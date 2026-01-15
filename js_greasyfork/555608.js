// ==UserScript==
// @name         Torn Stocks — Color rows (robust, multi, GUI)
// @namespace    user.tamper.scripts
// @version      0.5.1
// @description  Evidențiază rândurile pentru acțiunile selectate. Panou flotant configurabil + un singur GM toggle + culori săptămânale.
// @author       SuperGogu
// @match        https://www.torn.com/page.php?sid=stocks*
// @match        https://www.torn.com/*stocks*
// @run-at       document-idle
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555608/Torn%20Stocks%20%E2%80%94%20Color%20rows%20%28robust%2C%20multi%2C%20GUI%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555608/Torn%20Stocks%20%E2%80%94%20Color%20rows%20%28robust%2C%20multi%2C%20GUI%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // === CONFIG GENERAL ===
  const HIGHLIGHT_HEX = '#E6C229';         // culoarea standard (galben)
  const SPECIAL_COLOR_RED  = '#E53935';    // roșu pentru special stocks
  const SPECIAL_COLOR_BLUE = '#1E88E5';    // albastru pentru special stocks

  const STORAGE_KEY = 'tse_stocks_config_v1';
  const PANEL_VISIBLE_KEY = 'tse_panel_visible_v1';
  const COLOR_BASE_KEY = 'tse_color_base_thursday_v1';
  const PANEL_POS_KEY = 'tse_panel_pos_v1';

  // === HELPERS ===
  const toRgb = (hex) => {
    const m = String(hex).trim().replace('#', '');
    const n = m.length === 3 ? m.split('').map(c => c + c).join('') : m;
    const num = parseInt(n, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255].join(', ');
  };

  const norm = (s) => (s || '')
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ')
    .replace(/[\u00A0\s]+/g, ' ')
    .replace(/[.,/\\|_*~^`'":;?!]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // aliasuri pentru nume care pot apărea diferit în UI vs wiki
  const NAME_ALIASES = {};
  NAME_ALIASES[norm('Performance Ribaldry')] = norm('Performance Ribaldry Network');
  NAME_ALIASES[norm('Symbiotic Ltd')] = norm('Symbiotic Ltd.');

  const getKeyForName = (pretty) => {
    const base = norm(pretty);
    return NAME_ALIASES[base] || base;
  };

  // === LISTA COMPLETĂ DE STOCK-URI (din wiki) ===
  const ALL_STOCKS = [
    'Alcoholics Synonymous',
    'Big Al\'s Gun Shop',
    'Crude & Co',
    'Eaglewood Mercenary',
    'Empty Lunchbox Traders',
    'Evil Ducks Candy Corp',
    'Feathery Hotels Group',
    'Grain',
    'Herbal Releaf Co.',
    'Home Retail Group',
    'I Industries Ltd.',
    'Insured On Us',
    'International School TC',
    'Legal Authorities Group',
    'Lo Squalo Waste Management',
    'Lucky Shots Casino',
    'Mc Smoogle Corp',
    'Messaging Inc.',
    'Munster Beverage Corp.',
    'Performance Ribaldry Network',
    'PointLess',
    'Symbiotic Ltd.',
    'Syscore MFG',
    'TC Media Productions',
    'TC Music Industries',
    'Tell Group Plc.',
    'The Torn City Times',
    'Torn & Shanghai Banking',
    'Torn City Clothing',
    'Torn City Health Service',
    'Torn City Investments',
    'Torn City Motors',
    'West Side University',
    'Wind Lines Travel',
    'Yazoo',
  ];

  // valorile implicite (= ce aveai înainte în TARGET_NAMES)
  const DEFAULT_ENABLED = [
    'Feathery Hotels Group',
    'Torn City Investments',
    'Symbiotic Ltd.',
    'Performance Ribaldry Network',
    'West Side University',
    'The Torn City Times',
    'Grain',
    'I Industries Ltd.',
    'Torn City Health Service',
  ];

  const STOCKS = ALL_STOCKS.map((name) => {
    const baseKey = norm(name);
    const key = NAME_ALIASES[baseKey] || baseKey;
    return { name, key };
  });

  const DEFAULT_ENABLED_KEYS = new Set(
    DEFAULT_ENABLED.map((name) => {
      const baseKey = norm(name);
      return NAME_ALIASES[baseKey] || baseKey;
    }),
  );

  // cele 3 speciale cu roșu/albastru săptămânal
  const SPECIAL_STOCK_KEYS = new Set([
    getKeyForName('Feathery Hotels Group'),
    getKeyForName('Symbiotic Ltd.'),            // acoperă și varianta fără punct
    getKeyForName('Performance Ribaldry'),      // acoperă și Network
  ]);

  // === CONFIG SALVAT (GM storage) ===
  let config = (typeof GM_getValue === 'function'
    ? (GM_getValue(STORAGE_KEY, null) || {})
    : {});

  const saveConfig = () => {
    if (typeof GM_setValue === 'function') {
      GM_setValue(STORAGE_KEY, config);
    }
  };

  const buildEnabledSet = () => {
    const set = new Set();
    STOCKS.forEach((stock) => {
      const key = stock.key;
      let enabled;
      if (Object.prototype.hasOwnProperty.call(config, key)) {
        enabled = !!config[key];
      } else {
        enabled = DEFAULT_ENABLED_KEYS.has(key);
      }
      if (enabled) set.add(key);
    });
    return set;
  };

  let enabledKeys = buildEnabledSet();

  // === LOGICĂ CULOARE SĂPTĂMÂNALĂ (joia se schimbă) ===
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  let memoryBaseThursday = null;

  function getLastThursdayStart(d) {
    const date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const day = date.getDay(); // 0=Sun, 4=Thu
    const diff = (day >= 4) ? (day - 4) : (7 - (4 - day));
    date.setDate(date.getDate() - diff);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  function getBaseThursday() {
    if (typeof GM_getValue === 'function' && typeof GM_setValue === 'function') {
      const stored = GM_getValue(COLOR_BASE_KEY, null);
      if (stored) {
        const d = new Date(stored);
        if (!Number.isNaN(d.getTime())) return d;
      }
      const now = new Date();
      const base = getLastThursdayStart(now);
      GM_setValue(COLOR_BASE_KEY, base.toISOString());
      return base;
    } else {
      if (memoryBaseThursday) return memoryBaseThursday;
      const base = getLastThursdayStart(new Date());
      memoryBaseThursday = base;
      return base;
    }
  }

  function getWeeklyColor() {
    const base = getBaseThursday();
    const now = new Date();
    const diffMs = now - base;
    const diffDays = Math.floor(diffMs / MS_PER_DAY);
    const weeks = Math.floor(diffDays / 7);
    const isRedWeek = (weeks % 2 === 0); // săptămâna de bază = ROȘU
    return isRedWeek ? SPECIAL_COLOR_RED : SPECIAL_COLOR_BLUE;
  }

  // === STILURI ===
  const style = document.createElement('style');
  style.textContent = `
  /* highlight pe tot <ul> = rândul întreg */
  ul[role="tablist"][data-tse-accent]{
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    outline: 2px solid var(--tse-accent, ${HIGHLIGHT_HEX});
    outline-offset: -2px;
  }
  ul[role="tablist"][data-tse-accent]::before{
    content:"";
    position:absolute; inset:0; border-radius:12px;
    background: rgba(var(--tse-accent-rgb, 230,194,41), .10);
    pointer-events:none;
  }
  /* nu conturăm celula de preț ca să evităm dublura */
  li[role="tab"][data-name="priceTab"]{
    box-shadow: none !important;
    outline: none !important;
  }

  /* PANOU FLOTTANT */
  #tse-panel{
    position: fixed;
    top: 80px;
    right: 20px;
    z-index: 9999;
    min-width: 260px;
    max-width: 320px;
    max-height: 70vh;
    display: flex;
    flex-direction: column;
    background: rgba(10, 10, 10, 0.96);
    color: #f0f0f0;
    border-radius: 10px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.45);
    font-size: 12px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }
  #tse-panel-header{
    display:flex;
    align-items:center;
    justify-content:space-between;
    padding:6px 8px;
    background: rgba(255,255,255,0.03);
    cursor: move;
    user-select:none;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    font-weight:600;
  }
  #tse-panel-title{
    font-size: 12px;
  }
  #tse-panel-close{
    background: transparent;
    border: none;
    color: inherit;
    cursor: pointer;
    font-size: 14px;
    line-height: 1;
    padding: 0 4px;
  }
  #tse-panel-body{
    padding: 6px 8px 8px;
    overflow: auto;
  }
  .tse-panel-section-title{
    font-size: 11px;
    opacity: .7;
    margin-bottom: 4px;
  }
  .tse-panel-row{
    display:flex;
    align-items:center;
    gap:4px;
    margin-bottom:2px;
    cursor:pointer;
  }
  .tse-panel-row input[type="checkbox"]{
    flex:0 0 auto;
    margin:0;
  }
  .tse-panel-row span{
    flex:1 1 auto;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .tse-panel-footer{
    margin-top:6px;
    display:flex;
    gap:4px;
    justify-content:flex-end;
    font-size:10px;
    opacity:.9;
  }
  .tse-chip-btn{
    border: 1px solid rgba(255,255,255,0.25);
    background: rgba(255,255,255,0.06);
    border-radius: 999px;
    padding: 1px 8px;
    cursor: pointer;
    color: #ffffff; /* text ALB */
  }
  `;
  document.documentElement.appendChild(style);

  // === HIGHLIGHT HELPERS ===
  function getStockNameFromNameTab(nameLi) {
    if (!nameLi) return '';
    const aria = nameLi.getAttribute('aria-label') || '';
    const m = aria.match(/^Stock:\s*(.+)$/i);
    if (m && m[1]) return m[1].trim();
    const preferred = nameLi.querySelector('.tt-acronym-container') || nameLi;
    return (preferred.textContent || '').replace(/\([^)]+\)/g, '').trim();
  }

  function highlightRow(rowUl, hex) {
    if (!rowUl) return;
    if (!rowUl.hasAttribute('data-tse-accent')) {
      rowUl.setAttribute('data-tse-accent', '1');
    }
    rowUl.style.setProperty('--tse-accent', hex);
    rowUl.style.setProperty('--tse-accent-rgb', toRgb(hex));
  }

  function unhighlightRow(rowUl) {
    if (!rowUl) return;
    rowUl.removeAttribute('data-tse-accent');
    rowUl.style.removeProperty('--tse-accent');
    rowUl.style.removeProperty('--tse-accent-rgb');
  }

  function getColorForKey(key) {
    if (SPECIAL_STOCK_KEYS.has(key)) {
      return getWeeklyColor(); // roșu / albastru, în funcție de săptămână
    }
    return HIGHLIGHT_HEX;
  }

  function process(container = document) {
    if (!container) container = document;

    // 1) scoatem highlight-ul de pe rândurile care nu mai sunt în enabledKeys
    const highlightedRows = container.querySelectorAll('ul[role="tablist"][data-tse-accent]');
    highlightedRows.forEach((row) => {
      const nameLi = row.querySelector('li[role="tab"][data-name="nameTab"]');
      const pretty = getStockNameFromNameTab(nameLi);
      const key = getKeyForName(pretty);
      if (!enabledKeys.has(key)) {
        unhighlightRow(row);
      }
    });

    // 2) adăugăm highlight pentru cele active
    const nameTabs = container.querySelectorAll('li[role="tab"][data-name="nameTab"]');
    nameTabs.forEach((nameLi) => {
      const pretty = getStockNameFromNameTab(nameLi);
      if (!pretty) return;
      const key = getKeyForName(pretty);
      if (!key || !enabledKeys.has(key)) return;
      const row = nameLi.closest('ul[role="tablist"]');
      if (row) {
        const color = getColorForKey(key);
        highlightRow(row, color);
      }
    });
  }

  // === PANOU FLOTTANT ===
  let panelEl = null;

  function makeDraggable(panel, handle) {
    if (!panel || !handle) return;
    let isDown = false;
    let startX = 0;
    let startY = 0;
    let startLeft = 0;
    let startTop = 0;

    const onMouseDown = (e) => {
      if (e.button !== 0) return;
      isDown = true;
      const rect = panel.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      startLeft = rect.left;
      startTop = rect.top;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const newLeft = startLeft + dx;
      const newTop = startTop + dy;
      panel.style.left = `${newLeft}px`;
      panel.style.top = `${newTop}px`;
      panel.style.right = 'auto';
    };

    const onMouseUp = () => {
      if (!isDown) return;
      isDown = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      // salvăm poziția la final de drag
      if (typeof GM_setValue === 'function') {
        const rect = panel.getBoundingClientRect();
        GM_setValue(PANEL_POS_KEY, { left: rect.left, top: rect.top });
      }
    };

    handle.addEventListener('mousedown', onMouseDown);
  }

  function createPanel() {
    const panel = document.createElement('div');
    panel.id = 'tse-panel';

    const header = document.createElement('div');
    header.id = 'tse-panel-header';

    const title = document.createElement('div');
    title.id = 'tse-panel-title';
    title.textContent = 'Torn Stocks — highlight';

    const closeBtn = document.createElement('button');
    closeBtn.id = 'tse-panel-close';
    closeBtn.type = 'button';
    closeBtn.textContent = '×';
    closeBtn.addEventListener('click', () => hidePanel());

    header.appendChild(title);
    header.appendChild(closeBtn);

    const body = document.createElement('div');
    body.id = 'tse-panel-body';

    const sectionTitle = document.createElement('div');
    sectionTitle.className = 'tse-panel-section-title';
    sectionTitle.textContent = 'Bifează acțiunile pe care vrei să le evidențiezi:';
    body.appendChild(sectionTitle);

    // checkboxes pentru fiecare stock
    STOCKS.forEach((stock) => {
      const row = document.createElement('label');
      row.className = 'tse-panel-row';

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.dataset.tseKey = stock.key;
      cb.checked = enabledKeys.has(stock.key);

      cb.addEventListener('change', (e) => {
        const key = e.target.dataset.tseKey;
        const on = e.target.checked;
        config[key] = on;
        saveConfig();
        enabledKeys = buildEnabledSet();
        process(); // reaplică highlight-urile
      });

      const span = document.createElement('span');
      span.textContent = stock.name;

      row.appendChild(cb);
      row.appendChild(span);
      body.appendChild(row);
    });

    // butoane micuțe: All / None
    const footer = document.createElement('div');
    footer.className = 'tse-panel-footer';

    const btnAll = document.createElement('button');
    btnAll.type = 'button';
    btnAll.className = 'tse-chip-btn';
    btnAll.textContent = 'All';
    btnAll.addEventListener('click', () => {
      STOCKS.forEach((s) => {
        config[s.key] = true;
      });
      saveConfig();
      enabledKeys = buildEnabledSet();
      body.querySelectorAll('input[type="checkbox"][data-tse-key]')
        .forEach((cb) => { cb.checked = true; });
      process();
    });

    const btnNone = document.createElement('button');
    btnNone.type = 'button';
    btnNone.className = 'tse-chip-btn';
    btnNone.textContent = 'None';
    btnNone.addEventListener('click', () => {
      STOCKS.forEach((s) => {
        config[s.key] = false;
      });
      saveConfig();
      enabledKeys = buildEnabledSet();
      body.querySelectorAll('input[type="checkbox"][data-tse-key]')
        .forEach((cb) => { cb.checked = false; });
      process();
    });

    footer.appendChild(btnAll);
    footer.appendChild(btnNone);
    body.appendChild(footer);

    panel.appendChild(header);
    panel.appendChild(body);
    document.body.appendChild(panel);

    // aplicăm poziția salvată (dacă există)
    if (typeof GM_getValue === 'function') {
      const pos = GM_getValue(PANEL_POS_KEY, null);
      if (pos && typeof pos.left === 'number' && typeof pos.top === 'number') {
        panel.style.left = pos.left + 'px';
        panel.style.top = pos.top + 'px';
        panel.style.right = 'auto';
      }
    }

    const visible = (typeof GM_getValue === 'function'
      ? GM_getValue(PANEL_VISIBLE_KEY, true)
      : true);
    panel.style.display = visible ? 'block' : 'none';

    makeDraggable(panel, header);

    return panel;
  }

  function ensurePanel() {
    if (!panelEl) {
      panelEl = createPanel();
    }
    return panelEl;
  }

  function showPanel() {
    const panel = ensurePanel();
    panel.style.display = 'block';
    if (typeof GM_setValue === 'function') {
      GM_SETVALUE(PANEL_VISIBLE_KEY, true); // BUG - fix: GM_setValue not GM_SETVALUE
    }
  }

  function hidePanel() {
    const panel = ensurePanel();
    panel.style.display = 'none';
    if (typeof GM_setValue === 'function') {
      GM_setValue(PANEL_VISIBLE_KEY, false);
    }
  }

  function togglePanel() {
    const panel = ensurePanel();
    const hidden = panel.style.display === 'none' || panel.style.display === '';
    if (hidden) {
      panel.style.display = 'block';
      if (typeof GM_setValue === 'function') {
        GM_setValue(PANEL_VISIBLE_KEY, true);
      }
    } else {
      panel.style.display = 'none';
      if (typeof GM_setValue === 'function') {
        GM_setValue(PANEL_VISIBLE_KEY, false);
      }
    }
  }

  // === GM MENU COMMAND (UN SINGUR TOGGLE) ===
  if (typeof GM_registerMenuCommand === 'function') {
    GM_registerMenuCommand('Toggle stock panel', togglePanel);
  }

  // === RUN HIGHLIGHT LOGIC ===
  process();
  setTimeout(process, 600);
  setTimeout(process, 1500);
  setTimeout(process, 4000);

  const obs = new MutationObserver(() => process());
  if (document.body) {
    obs.observe(document.body, { childList: true, subtree: true });
  }

  // util public
  window.tseReapply = () => process();

  // creează panoul imediat (respectă vizibilitatea + poziția salvată)
  if (document.body) {
    ensurePanel();
  } else {
    window.addEventListener('DOMContentLoaded', ensurePanel, { once: true });
  }
})();
