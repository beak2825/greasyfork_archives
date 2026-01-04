// ==UserScript==
// @name         Seiya-saiga Checkbox Tracker
// @namespace    https://greasyfork.org/en/users/890485-asafd
// @version      1.0.0
// @description  Save/restore checkbox states on seiya-saiga / galge.seiya-saiga guide pages
// @match        https://galge.seiya-saiga.com/game/*
// @match        https://seiya-saiga.com/game/*
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561322/Seiya-saiga%20Checkbox%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/561322/Seiya-saiga%20Checkbox%20Tracker.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // --------------------------
  // Config
  // --------------------------
  const PAGE_KEY = `tm_checkbox_state::${location.origin}${location.pathname}`;
  const SAVE_DEBOUNCE_MS = 250;

  const PANEL_HIDDEN_KEY = `tm_checkbox_panel_hidden::${location.origin}`;

  // --------------------------
  // Utils
  // --------------------------
  function safeJsonParse(s, fallback) {
    try { return JSON.parse(s); } catch { return fallback; }
  }

  function getOptionText(cb) {
    let n = cb.nextSibling;
    while (n && n.nodeType === Node.TEXT_NODE && !n.textContent.trim()) n = n.nextSibling;
    if (n && n.nodeType === Node.TEXT_NODE) return n.textContent.trim();

    const p = cb.parentElement;
    if (!p) return '';
    return (p.textContent || '').replace(/\s+/g, ' ').trim();
  }

  function createEl(tag, props = {}, children = []) {
    const el = document.createElement(tag);
    Object.assign(el, props);
    for (const c of children) el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    return el;
  }

  function toast(msg) {
    const t = createEl('div', {
      textContent: msg,
      style: `
        position: fixed; left: 50%; top: 14px; transform: translateX(-50%);
        background: rgba(0,0,0,.82); color: #fff; padding: 8px 12px;
        border-radius: 10px; font-size: 12px; z-index: 999999;
        max-width: 80vw; white-space: pre-wrap;
      `
    });
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2200);
  }

  // --------------------------
  // Load / Save state
  // --------------------------
  let state = GM_getValue(PAGE_KEY, null);
  if (typeof state === 'string') state = safeJsonParse(state, null);
  if (!state || typeof state !== 'object') {
    state = { meta: { url: location.href, total: 0, updatedAt: 0 }, map: {} };
  }

  let saveTimer = null;
  function scheduleSave() {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      state.meta.updatedAt = Date.now();
      GM_setValue(PAGE_KEY, JSON.stringify(state));
      saveTimer = null;
    }, SAVE_DEBOUNCE_MS);
  }

  // --------------------------
  // Build checkbox keys
  // --------------------------
  const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"]'));

  const textCount = new Map();
  const keys = new Map(); // checkbox -> key

  for (const cb of checkboxes) {
    const text = getOptionText(cb) || '__EMPTY__';
    const cnt = (textCount.get(text) || 0) + 1;
    textCount.set(text, cnt);
    const key = `${text}@@${cnt}`;
    keys.set(cb, key);
    cb.dataset.tmKey = key;
  }

  // Meta（不弹窗）
  const prevTotal = state.meta.total || 0;
  state.meta.total = checkboxes.length;
  if (prevTotal && prevTotal !== checkboxes.length) {
    console.warn(`[CheckboxTracker] checkbox count changed: ${prevTotal} -> ${checkboxes.length}`);
  }

  // Restore（不弹窗）
  for (const cb of checkboxes) {
    const key = keys.get(cb);
    if (state.map[key] === true) cb.checked = true;
  }

  // --------------------------
  // UI Panel
  // --------------------------
  function countChecked() {
    let c = 0;
    for (const cb of checkboxes) if (cb.checked) c++;
    return c;
  }

  const panel = createEl('div', {
    style: `
      position: fixed; right: 14px; top: 14px; z-index: 999998;
      background: rgba(255,255,255,.92);
      border: 1px solid rgba(0,0,0,.15);
      border-radius: 12px;
      padding: 10px 10px 8px 10px;
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
      font-size: 12px; color: #111;
      box-shadow: 0 8px 30px rgba(0,0,0,.18);
      min-width: 180px;
      user-select: none;
    `
  });

  const title = createEl('div', { style: 'font-weight: 700; margin-bottom: 6px;' }, ['✅ 选项记录']);

  const progress = createEl('div', { style: 'margin-bottom: 8px; opacity: .9;' });
  function refreshProgress() {
    progress.textContent = `进度：${countChecked()} / ${checkboxes.length}`;
  }

  const btnRow = createEl('div', { style: 'display: flex; gap: 6px; flex-wrap: wrap;' });

  function mkBtn(text, onClick) {
    return createEl('button', {
      type: 'button',
      textContent: text,
      style: `
        padding: 5px 8px; border-radius: 10px;
        border: 1px solid rgba(0,0,0,.2);
        background: rgba(255,255,255,.9);
        cursor: pointer; font-size: 12px;
      `,
      onclick: onClick
    });
  }

  const btnClear = mkBtn('清空本页', () => {
    state.map = {};
    for (const cb of checkboxes) cb.checked = false;
    scheduleSave();
    refreshProgress();
    toast('已清空本页记录');
  });

  const btnHide = mkBtn('隐藏', () => {
    panel.style.display = 'none';
    GM_setValue(PANEL_HIDDEN_KEY, true);
    toast('面板已隐藏：Tampermonkey 菜单里可“显示面板”');
  });

  btnRow.append(btnClear, btnHide);
  panel.append(title, progress, btnRow);
  document.body.appendChild(panel);
  refreshProgress();

  const panelHidden = !!GM_getValue(PANEL_HIDDEN_KEY, false);
  if (panelHidden) {
    panel.style.display = 'none';
  }

  // --------------------------
  // Listen changes
  // --------------------------
  function onChanged(ev) {
    const cb = ev.target;
    if (!(cb instanceof HTMLInputElement) || cb.type !== 'checkbox') return;
    const key = cb.dataset.tmKey;
    if (!key) return;

    state.map[key] = cb.checked === true;
    scheduleSave(); // 仅保存，不提示
    refreshProgress();
  }

  document.addEventListener('change', onChanged, true);

  // --------------------------
  // Tampermonkey menu commands
  // --------------------------
  function showPanel() {
    panel.style.display = '';
    GM_setValue(PANEL_HIDDEN_KEY, false); // ✅ 取消隐藏记忆
  }

  GM_registerMenuCommand('显示面板', showPanel);
  GM_registerMenuCommand('清空本页记录', () => btnClear.click());
})();
