// ==UserScript==
// @name         HWM: Sort by Repair % or Gold
// @namespace    https://www.heroeswm.ru
// @version      1.4.2
// @description  Кнопки сортировки по % ремонта, по золоту и отдельная строка для кнопки сброса.
// @author       Етемал
// @license      MIT
// @match        *://www.heroeswm.ru/inventory.php*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548264/HWM%3A%20Sort%20by%20Repair%20%25%20or%20Gold.user.js
// @updateURL https://update.greasyfork.org/scripts/548264/HWM%3A%20Sort%20by%20Repair%20%25%20or%20Gold.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const CONTAINER_ID = 'all_trades_to_me';
  const LS_KEY = 'hwm_sort_repair_settings';

  let isSorting = false, observer = null;
  let originalOrder = null;

  const loadSettings = () => {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || { mode: 'percent', order: 'asc' }; }
    catch { return { mode: 'percent', order: 'asc' }; }
  };
  const saveSettings = (s) => localStorage.setItem(LS_KEY, JSON.stringify(s));

  function parsePercent(el) {
    const txt = el.innerText || '';
    const m = txt.match(/\((\d+)%\)/);
    return m ? parseInt(m[1], 10) : Number.POSITIVE_INFINITY;
  }

  function parseGold(el) {
    const txt = el.innerText || '';
    const m = txt.match(/Плата[\s\S]*?([0-9][0-9\s,.\u00A0\u202F\u2009\u2007]*)\s*\(/);
    if (!m) return Number.POSITIVE_INFINITY;
    const digits = m[1].replace(/[^\d]/g, '');
    return digits ? parseInt(digits, 10) : Number.POSITIVE_INFINITY;
  }

  function sortContainer(container, settings) {
    if (!container) return;
    if (settings.mode === 'reset') {
      restoreOriginal(container);
      return;
    }

    isSorting = true;
    container.querySelectorAll(':scope > .separator2').forEach(n => n.remove());

    const items = Array.from(container.querySelectorAll(':scope > .inv_peredachka'));

    items.sort((a, b) => {
      const va = settings.mode === 'percent' ? parsePercent(a) : parseGold(a);
      const vb = settings.mode === 'percent' ? parsePercent(b) : parseGold(b);
      if (va === vb) return 0;
      return settings.order === 'asc' ? va - vb : vb - va;
    });

    const frag = document.createDocumentFragment();
    items.forEach((item, idx) => {
      const sep = document.createElement('div'); sep.className = 'separator2'; frag.appendChild(sep);
      frag.appendChild(item);
      if (idx === items.length - 1) {
        const sepTail = document.createElement('div'); sepTail.className = 'separator2'; frag.appendChild(sepTail);
      }
    });

    container.appendChild(frag);
    isSorting = false;
  }

  function storeOriginal(container) {
    if (originalOrder) return;
    const nodes = Array.from(container.querySelectorAll(':scope > .inv_peredachka, :scope > .separator2'));
    originalOrder = nodes.map(n => n.cloneNode(true));
  }

  function restoreOriginal(container) {
    if (!originalOrder) return;
    isSorting = true;
    container.innerHTML = '';
    originalOrder.forEach(n => container.appendChild(n.cloneNode(true)));
    isSorting = false;
  }

  function createButtons(container, settings) {
    if (document.getElementById('hwm-sort-buttons')) return;

    const wrap = document.createElement('div');
    wrap.id = 'hwm-sort-buttons';
    wrap.style.margin = '8px 0';
    wrap.style.display = 'flex';
    wrap.style.flexDirection = 'column';
    wrap.style.gap = '6px';

    const row1 = document.createElement('div');
    row1.style.display = 'flex';
    row1.style.gap = '8px';

    const row2 = document.createElement('div');
    row2.style.display = 'flex';

    const makeBtn = (mode, labelBase) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.style.padding = '4px 8px';
      btn.style.border = '1px solid #aaa';
      btn.style.borderRadius = '6px';
      btn.style.background = '#f3f3f3';
      btn.style.cursor = 'pointer';
      btn.style.fontSize = '12px';
      btn.style.whiteSpace = 'nowrap';

      const applyVisual = () => {
        const isActive = settings.mode === mode;
        const arrow = isActive && mode !== 'reset'
          ? (settings.order === 'asc' ? '↑' : '↓')
          : '';
        btn.textContent = mode === 'reset' ? labelBase : `${labelBase} ${arrow}`;
        btn.style.background = isActive ? '#e7f1ff' : '#f3f3f3';
        btn.style.borderColor = isActive ? '#6aa0ff' : '#aaa';
      };
      applyVisual();

      btn.addEventListener('click', (e) => {
        e.stopPropagation(); e.preventDefault();
        if (mode === 'reset') {
          settings.mode = 'reset';
          saveSettings(settings);
          restoreOriginal(container);
        } else {
          if (settings.mode === mode) {
            settings.order = settings.order === 'asc' ? 'desc' : 'asc';
          } else {
            settings.mode = mode;
            settings.order = 'asc';
          }
          saveSettings(settings);
          sortContainer(container, settings);
        }
        wrap.querySelectorAll('button').forEach(b => b.dispatchEvent(new Event('refresh-label')));
      });

      btn.addEventListener('refresh-label', applyVisual);
      return btn;
    };

    row1.appendChild(makeBtn('percent', 'Сортировать по %'));
    row1.appendChild(makeBtn('gold', 'Сортировать по золоту'));
    row2.appendChild(makeBtn('reset', 'Сброс'));

    wrap.appendChild(row1);
    wrap.appendChild(row2);

    const header = document.querySelector('.inv_scroll_content[onclick*="all_trades_to_me"]');
    if (header && header.parentNode) {
      header.parentNode.insertBefore(wrap, header.nextSibling);
    } else {
      container.parentNode.insertBefore(wrap, container);
    }
  }

  function observeContainer(container, settings) {
    if (observer) observer.disconnect();
    observer = new MutationObserver(() => {
      if (isSorting) return;
      if (settings.mode !== 'reset') {
        setTimeout(() => sortContainer(container, settings), 0);
      }
    });
    observer.observe(container, { childList: true, subtree: false });
  }

  (async function init() {
    const container = await new Promise((resolve) => {
      const el = document.querySelector('#' + CONTAINER_ID);
      if (el) return resolve(el);
      const mo = new MutationObserver(() => {
        const el2 = document.querySelector('#' + CONTAINER_ID);
        if (el2) { mo.disconnect(); resolve(el2); }
      });
      mo.observe(document.documentElement, { childList: true, subtree: true });
    });

    storeOriginal(container);

    const settings = loadSettings();
    createButtons(container, settings);
    if (settings.mode !== 'reset') sortContainer(container, settings);
    observeContainer(container, settings);

    const foldObserver = new MutationObserver(() => {
      if (settings.mode !== 'reset') sortContainer(container, settings);
    });
    foldObserver.observe(container, { attributes: true, attributeFilter: ['hidden', 'class'] });
  })();
})();
