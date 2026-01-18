// ==UserScript==
// @name        Batoto (v4) - Custom zoom mode
// @namespace   https://greasyfork.org/en/users/1476331-jon78
// @icon        https://icons.duckduckgo.com/ip3/bato.to.ico
// @match       *://bato.si/*
// @match       *://bato.ing/*
// @grant       none
// @run-at      document-idle
// @version     1.0.2
// @license     CC0-1.0
// @description Adds the ability to customize zoom + more zoom options.
// @downloadURL https://update.greasyfork.org/scripts/562973/Batoto%20%28v4%29%20-%20Custom%20zoom%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/562973/Batoto%20%28v4%29%20-%20Custom%20zoom%20mode.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const STORAGE_KEY = 'bato_zoom_mode';
  const CUSTOM_KEY = STORAGE_KEY + ':custom';

  const NUMERIC_MODES = [
    { value: '480', label: '480px' },
    { value: '576', label: '576px' },
    { value: '768', label: '768px' },
    { value: '960', label: '960px' },
    { value: '1116', label: '1116px' },
    { value: '1200', label: '1200px' },
    { value: '1360', label: '1360px' },
    { value: 'custom', label: 'Custom...' }
  ];

  // Save original styles for each image container
  function recordOriginalStyles() {
    document.querySelectorAll('[data-name="image-item"] div[style], [data-name="image-item"] [data-name="image-show"]')
      .forEach(el => {
        if (!el.dataset.origStyle) el.dataset.origStyle = el.getAttribute('style') || '';
      });
  }

  // Restore images to original style
  function restoreOriginalStyles() {
    document.querySelectorAll('[data-name="image-item"] div[style], [data-name="image-item"] [data-name="image-show"]')
      .forEach(el => {
        if (el.dataset.origStyle) el.setAttribute('style', el.dataset.origStyle);
        const img = el.querySelector('img');
        if (img) {
          img.style.width = '100%';
          img.style.height = 'auto';
          img.style.display = 'block';
        }
      });
  }

  // Apply zoom to images
  function applyZoom(width, select) {
    recordOriginalStyles();

    if (width === '0') {
      restoreOriginalStyles();
      localStorage.setItem(STORAGE_KEY, width);
      return;
    }

    if (width === 'custom') {
      const prev = select ? select.dataset.prevValue || '0' : '0';
      const val = prompt('Enter desired width in pixels:', localStorage.getItem(CUSTOM_KEY) || '1200');
      if (!val) {
        if (select) select.value = prev;
        return;
      }
      width = val.replace(/[^\d]/g, '');
      localStorage.setItem(CUSTOM_KEY, width);
      if (select) select.value = width;
    }

    if (select) select.dataset.prevValue = width;

    const items = document.querySelectorAll('[data-name="image-item"] div[style], [data-name="image-item"] [data-name="image-show"]');
    items.forEach(el => {
      const img = el.querySelector('img');
      if (!img) return;
      const targetW = parseInt(width);
      const targetH = Math.round(targetW * (img.naturalHeight / img.naturalWidth));
      el.style.width = targetW + 'px';
      el.style.height = targetH + 'px';
      if (el.style.backgroundImage && el.style.backgroundImage !== 'none') {
        el.style.backgroundSize = `${targetW}px ${targetH}px`;
      }
      img.style.width = '100%';
      img.style.height = 'auto';
      img.style.display = 'block';
    });

    localStorage.setItem(STORAGE_KEY, width);
  }

  // Insert and order options: defaults, numeric ascending, custom last
  function insertAndOrderOptions(select) {
    if (!select) return;

    const selectedValue = select.value;

    // Preserve default options only
    const defaults = Array.from(select.options).filter(o => ['0','1','2','3'].includes(o.value));

    // Rebuild select
    select.innerHTML = '';

    // Append defaults
    defaults.forEach(o => select.appendChild(o));

    // Append numeric options from NUMERIC_MODES (excluding 'custom')
    NUMERIC_MODES.filter(o => o.value !== 'custom').forEach(opt => {
      const o = document.createElement('option');
      o.value = opt.value;
      o.textContent = opt.label;
      select.appendChild(o);
    });

    // Append custom
    const customOption = document.createElement('option');
    customOption.value = 'custom';
    customOption.textContent = 'Custom...';
    select.appendChild(customOption);

    // Restore previously selected value if still exists
    if (Array.from(select.options).some(o => o.value === selectedValue)) {
      select.value = selectedValue;
    } else {
      select.value = '0';
    }
  }

  function attachToSelect(select) {
    if (!select) return;

    insertAndOrderOptions(select);

    select.onchange = null;
    select.addEventListener('change', () => applyZoom(select.value, select));

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      applyZoom(saved, select);
      select.value = saved;
    }
  }

  function watchSelectReplacement() {
    const observer = new MutationObserver(() => {
      observer.disconnect();
      document.querySelectorAll('select').forEach(s => {
        const container = s.closest('div');
        if (!container) return;
        if (/zoom mode/i.test(container.textContent)) attachToSelect(s);
      });
      observer.observe(document.body, { childList: true, subtree: true });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  watchSelectReplacement();
  window.addEventListener('load', () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) applyZoom(saved);
  });
})();
