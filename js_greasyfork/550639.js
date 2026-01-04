// ==UserScript==
// @name         Camerax Floating Live Multi-Term Search + Price Sort (Draggable, Themeable, Compact UI)
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Draggable floating search with multi-term partial AND filtering and price re-sort; compact buttons, theme selector dropdown, added orange Dracula theme, grey theme gets a black border. Position & theme saved.
// @match        https://camerax.com/product-category/*
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/550639/Camerax%20Floating%20Live%20Multi-Term%20Search%20%2B%20Price%20Sort%20%28Draggable%2C%20Themeable%2C%20Compact%20UI%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550639/Camerax%20Floating%20Live%20Multi-Term%20Search%20%2B%20Price%20Sort%20%28Draggable%2C%20Themeable%2C%20Compact%20UI%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  /* ---------- CONFIG ---------- */
  const FLOAT_WIDTH = 300; // px
  const DEBOUNCE_MS = 160;
  const STORAGE_KEY_POS = 'camx-floating-pos-v1';
  const STORAGE_KEY_THEME = 'camx-floating-theme-v1';
  /* ---------------------------- */

  // Theme definitions
  const THEMES = {
    dracula: {
      name: 'Dracula',
      bg: '#282a36',
      inputBg: '#44475a',
      inputColor: '#f8f8f2',
      controlBg: '#ffffff',
      controlText: '#282a36',
      subtleBg: '#44475a',
      border: '#6272a4',
      smallText: '#f8f8f2',
      boxShadow: '0 6px 18px rgba(0,0,0,0.45)'
    },
    dracula_orange: {
      name: 'Dracula (Orange)',
      bg: '#212025',
      inputBg: '#3b3a3f',
      inputColor: '#f8f8f2',
      controlBg: '#ffb86c',   // orange accent for buttons
      controlText: '#2b2a2a',
      subtleBg: '#38343a',
      border: '#ffb86c',
      smallText: '#f8f8f2',
      boxShadow: '0 6px 20px rgba(0,0,0,0.55)'
    },
    grey: {
      name: 'Grey',
      bg: '#efefef',
      inputBg: '#ffffff',
      inputColor: '#1a1a1a',
      controlBg: '#ffffff',
      controlText: '#333333',
      subtleBg: '#f5f5f5',
      border: '#000000', // changed to black border per request
      smallText: '#333333',
      boxShadow: '0 6px 18px rgba(30,30,30,0.08)'
    }
  };

  function log(...args) { try { console.log('[CamX-userscript]', ...args); } catch (e) {} }
  function debounce(fn, ms) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), ms);
    };
  }

  function findProductsContainer() {
    return document.querySelector('.products')
      || document.querySelector('.products.row')
      || document.querySelector('ul.products')
      || document.querySelector('#main .content')
      || document.querySelector('.shop-container')
      || null;
  }

  function collectProductEntries(container) {
    if (!container) return [];
    const productEls = Array.from(container.querySelectorAll('.product-small'));
    const entries = productEls.map(productEl => {
      let wrapper = productEl;
      try {
        while (wrapper.parentElement && wrapper.parentElement !== container && wrapper !== document.body) {
          wrapper = wrapper.parentElement;
        }
      } catch (e) {}
      if (!wrapper || wrapper.parentElement !== container) wrapper = productEl;
      return { productEl, wrapperEl: wrapper };
    });
    const seen = new Set();
    const dedup = [];
    for (const e of entries) {
      if (!seen.has(e.wrapperEl)) { seen.add(e.wrapperEl); dedup.push(e); }
    }
    return dedup;
  }

  function parsePriceFromWrapper(el) {
    if (!el) return Infinity;
    try {
      const amounts = Array.from(el.querySelectorAll('.woocommerce-Price-amount'));
      if (amounts.length === 0) return Infinity;
      const node = amounts[amounts.length - 1];
      const raw = (node.textContent || '').replace(/[^0-9.]/g, '');
      const n = parseFloat(raw);
      return Number.isFinite(n) ? n : Infinity;
    } catch (e) {
      return Infinity;
    }
  }

  function getTitleAndMeta(entry) {
    try {
      const titleNode = entry.productEl.querySelector('.product-title a, .woocommerce-loop-product__title, .name.product-title');
      const title = (titleNode && titleNode.textContent || '').trim();
      const condNode = entry.productEl.querySelector('.condition-grade-shop, .condition-grade, .product-info .stock, .price-wrapper, .product-meta');
      const condText = condNode ? condNode.textContent.trim() : '';
      return (title + ' ' + condText).replace(/\s+/g, ' ').trim();
    } catch (e) {
      return '';
    }
  }

  function filterAndResort(container, desc = false, query = '') {
    if (!container) return;
    try {
      const entries = collectProductEntries(container);
      const tokens = (query || '').toLowerCase().trim().split(/\s+/).filter(t => t.length > 0);

      entries.forEach(entry => {
        const text = (getTitleAndMeta(entry) || '').toLowerCase();
        let visible = true;
        for (const tok of tokens) {
          if (!text.includes(tok)) { visible = false; break; }
        }
        try { entry.wrapperEl.style.display = visible ? '' : 'none'; } catch (e) {}
      });

      const visible = entries
        .filter(e => e.wrapperEl && e.wrapperEl.offsetParent !== null)
        .sort((a, b) => {
          const pa = parsePriceFromWrapper(a.wrapperEl);
          const pb = parsePriceFromWrapper(b.wrapperEl);
          return desc ? pb - pa : pa - pb;
        });

      visible.forEach(e => {
        try { container.appendChild(e.wrapperEl); } catch (err) {}
      });
    } catch (err) {
      log('filterAndResort error', err);
    }
  }

  // Apply theme styles to the UI elements
  function applyThemeToUI(uiElements, themeName) {
    const theme = THEMES[themeName] || THEMES.dracula;
    const { root, input, toggle, clear, themeSelect, title, small } = uiElements;

    root.style.background = theme.bg;
    root.style.boxShadow = theme.boxShadow;
    title.style.color = theme.smallText;
    small.style.color = theme.smallText;

    // Input
    input.style.background = theme.inputBg;
    input.style.color = theme.inputColor;
    input.style.border = `1px solid ${theme.border}`;

    // Toggle (primary)
    toggle.style.background = theme.controlBg;
    toggle.style.color = theme.controlText;
    toggle.style.border = `1px solid ${theme.border}`;

    // Clear
    clear.style.background = theme.controlBg;
    clear.style.color = theme.controlText;
    clear.style.border = `1px solid ${theme.border}`;

    // Theme selector
    if (themeSelect) {
      themeSelect.style.background = theme.controlBg;
      themeSelect.style.color = theme.controlText;
      themeSelect.style.border = `1px solid ${theme.border}`;
    }
  }

  // Create floating UI (draggable + compact buttons + theme select)
  function createFloatingUI(onChangeCallback) {
    // Avoid duplicate
    if (document.getElementById('camx-floating-filter')) {
      const existingInput = document.querySelector('#camx-floating-filter input[type="search"]');
      return {
        root: document.getElementById('camx-floating-filter'),
        input: existingInput,
        getDesc: () => document.getElementById('camx-toggle')?.dataset.desc === '1'
      };
    }

    const wrap = document.createElement('div');
    wrap.id = 'camx-floating-filter';
    wrap.style.position = 'fixed';
    wrap.style.top = '18px';
    wrap.style.left = '';
    wrap.style.zIndex = '999999';
    wrap.style.width = FLOAT_WIDTH + 'px';
    wrap.style.padding = '8px';
    wrap.style.borderRadius = '10px';
    wrap.style.fontFamily = 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial';
    wrap.style.color = '#fff';
    wrap.style.display = 'flex';
    wrap.style.flexDirection = 'column';
    wrap.style.gap = '6px';
    wrap.style.alignItems = 'stretch';
    wrap.style.userSelect = 'none';

    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.gap = '6px';
    header.style.cursor = 'move';
    header.style.padding = '2px 4px';

    const title = document.createElement('div');
    title.textContent = 'Filter & Sort';
    title.style.fontWeight = '700';
    title.style.fontSize = '12px';
    title.style.pointerEvents = 'none';

    const small = document.createElement('div');
    small.style.fontSize = '11px';
    small.textContent = 'price';
    small.style.opacity = '0.95';
    small.style.pointerEvents = 'none';

    header.appendChild(title);
    header.appendChild(small);
    wrap.appendChild(header);

    const input = document.createElement('input');
    input.type = 'search';
    input.placeholder = 'space-separated terms (AND). partial words OK';
    input.style.padding = '8px';
    input.style.fontSize = '13px';
    input.style.borderRadius = '6px';
    input.style.width = '100%';
    input.autocomplete = 'off';

    // controls row (compact)
    const controls = document.createElement('div');
    controls.style.display = 'flex';
    controls.style.gap = '6px';
    controls.style.alignItems = 'center';

    // Asc/Desc toggle (small)
    const toggle = document.createElement('button');
    toggle.id = 'camx-toggle';
    toggle.dataset.desc = '0';
    toggle.textContent = 'Asc';
    toggle.title = 'Toggle Asc/Desc';
    toggle.style.flex = '1';
    toggle.style.padding = '3px 6px';
    toggle.style.fontSize = '11px';
    toggle.style.borderRadius = '5px';
    toggle.style.cursor = 'pointer';

    // Clear (small)
    const clear = document.createElement('button');
    clear.textContent = 'Clear';
    clear.title = 'Clear filter';
    clear.style.padding = '3px 6px';
    clear.style.fontSize = '11px';
    clear.style.borderRadius = '5px';
    clear.style.cursor = 'pointer';

    // Theme selector (dropdown)
    const themeSelect = document.createElement('select');
    themeSelect.id = 'camx-theme-select';
    themeSelect.style.padding = '3px 6px';
    themeSelect.style.fontSize = '11px';
    themeSelect.style.borderRadius = '5px';
    themeSelect.style.cursor = 'pointer';
    themeSelect.style.minWidth = '92px';

    // Populate theme options
    const themeKeys = Object.keys(THEMES);
    for (const key of themeKeys) {
      const opt = document.createElement('option');
      opt.value = key;
      opt.textContent = THEMES[key].name;
      themeSelect.appendChild(opt);
    }

    controls.appendChild(toggle);
    controls.appendChild(clear);
    controls.appendChild(themeSelect);

    wrap.appendChild(input);
    wrap.appendChild(controls);

    document.body.appendChild(wrap);

    // Position logic
    try {
      const saved = localStorage.getItem(STORAGE_KEY_POS);
      const rect = wrap.getBoundingClientRect();
      if (saved) {
        const pos = JSON.parse(saved);
        if (typeof pos.left === 'number' && typeof pos.top === 'number') {
          wrap.style.left = Math.min(Math.max(0, pos.left), window.innerWidth - rect.width) + 'px';
          wrap.style.top = Math.min(Math.max(0, pos.top), window.innerHeight - rect.height) + 'px';
        }
      } else {
        const left = Math.max(6, window.innerWidth - rect.width - 18);
        wrap.style.left = left + 'px';
      }
    } catch (e) {
      try { wrap.style.left = Math.max(6, window.innerWidth - FLOAT_WIDTH - 18) + 'px'; } catch (e2) {}
    }

    // Draggable (pointer events)
    (function makeDraggable(handle, element) {
      let dragging = false, startX = 0, startY = 0, startLeft = 0, startTop = 0;
      function onPointerDown(e) {
        const tgt = e.target;
        if (tgt.closest('input, select, button')) return;
        dragging = true;
        element.setPointerCapture?.(e.pointerId);
        startX = e.clientX;
        startY = e.clientY;
        const rect = element.getBoundingClientRect();
        startLeft = rect.left;
        startTop = rect.top;
        element.style.transition = 'none';
        e.preventDefault();
      }
      function onPointerMove(e) {
        if (!dragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        let nx = Math.round(startLeft + dx);
        let ny = Math.round(startTop + dy);
        const rect = element.getBoundingClientRect();
        nx = Math.min(Math.max(0, nx), window.innerWidth - rect.width);
        ny = Math.min(Math.max(0, ny), window.innerHeight - rect.height);
        element.style.left = nx + 'px';
        element.style.top = ny + 'px';
      }
      function onPointerUp(e) {
        if (!dragging) return;
        dragging = false;
        try { element.releasePointerCapture?.(e.pointerId); } catch (e) {}
        const rect = element.getBoundingClientRect();
        try { localStorage.setItem(STORAGE_KEY_POS, JSON.stringify({ left: rect.left, top: rect.top })); } catch (err) {}
        element.style.transition = '';
      }
      handle.addEventListener('pointerdown', onPointerDown, { passive: false });
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', onPointerUp);
    })(header, wrap);

    // Theme handling
    function getSavedTheme() {
      try {
        const t = localStorage.getItem(STORAGE_KEY_THEME);
        return (t && THEMES[t]) ? t : 'dracula';
      } catch (e) { return 'dracula'; }
    }
    let activeTheme = getSavedTheme();
    themeSelect.value = activeTheme;
    applyThemeToUI({ root: wrap, input, toggle, clear, themeSelect, title, small }, activeTheme);

    themeSelect.addEventListener('change', () => {
      activeTheme = themeSelect.value;
      try { localStorage.setItem(STORAGE_KEY_THEME, activeTheme); } catch (e) {}
      applyThemeToUI({ root: wrap, input, toggle, clear, themeSelect, title, small }, activeTheme);
    });

    // Wiring behavior
    let desc = false;
    toggle.addEventListener('click', () => {
      desc = !desc;
      toggle.dataset.desc = desc ? '1' : '0';
      toggle.textContent = desc ? 'Desc' : 'Asc';
      onChangeCallback(input.value, desc);
    });

    clear.addEventListener('click', () => {
      input.value = '';
      onChangeCallback('', desc);
      input.focus();
    });

    input.addEventListener('input', debounce(() => onChangeCallback(input.value, desc), DEBOUNCE_MS));

    return { root: wrap, input, toggle, clear, themeSelect, getDesc: () => toggle.dataset.desc === '1' };
  }

  function initWhenReady(retries = 50) {
    const container = findProductsContainer();
    if (container) {
      initApp(container);
      return;
    }
    if (retries <= 0) { log('products container not found; giving up.'); return; }
    setTimeout(() => initWhenReady(retries - 1), 300);
  }

  function initApp(container) {
    try {
      const ui = createFloatingUI((query, desc) => {
        filterAndResort(container, desc, query);
      });

      // initial run
      filterAndResort(container, ui.getDesc(), ui.input.value || '');

      // observe container for dynamic changes
      const mo = new MutationObserver(debounce(() => {
        try { filterAndResort(container, ui.getDesc(), ui.input.value || ''); } catch (e) { log('MO callback error', e); }
      }, 300));
      mo.observe(container, { childList: true, subtree: true });

      window.addEventListener('popstate', () => {
        setTimeout(() => filterAndResort(container, ui.getDesc(), ui.input.value || ''), 300);
      });

      log('CamX userscript initialized (draggable themeable compact)');
    } catch (e) {
      log('initApp error', e);
    }
  }

  initWhenReady();
})();
