// ==UserScript==
// @name         Universal Captcha Learner — FULL with Movable Panel & Auto-Clear
// @namespace    https://example.com
// @version      1.4
// @description  Learns image-based reCAPTCHA & hCaptcha selections (auto-select known, highlight unknown, GUI to manage DB). Panel is movable/collapsible and position is remembered. Can auto-clear DB on start.
// @author       You
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/551168/Universal%20Captcha%20Learner%20%E2%80%94%20FULL%20with%20Movable%20Panel%20%20Auto-Clear.user.js
// @updateURL https://update.greasyfork.org/scripts/551168/Universal%20Captcha%20Learner%20%E2%80%94%20FULL%20with%20Movable%20Panel%20%20Auto-Clear.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* ----------------- Конфигурация ----------------- */
  const DB_PREFIX = 'captcha_learner_v1_';
  const DEFAULT_POLL = 1500;          // ms
  const MAX_IMG_DIM = 160;            // px (для downscale)
  const MIN_IMG_DIM = 20;
  const AUTO_START_DEFAULT = true;
  const SETTINGS_KEY = 'cl_settings_v1';
  /* ------------------------------------------------ */

  // ---------- helpers для GM storage ----------
  function gmSet(key, val) { try { GM_setValue(key, val); } catch (e) { console.error(e); } }
  function gmGet(key, def) { try { const v = GM_getValue(key); return typeof v === 'undefined' ? def : v; } catch (e) { return def; } }
  function gmList() { try { return GM_listValues(); } catch (e) { return []; } }
  function gmDelete(key) { try { GM_deleteValue(key); } catch (e) { console.error(e); } }

  // Загрузить/сохранить общие настройки панели
  function loadSettings() {
    const defaultSettings = {
      pollInterval: DEFAULT_POLL,
      autoStart: AUTO_START_DEFAULT,
      autoClearOnStart: false,
      collapsed: false,
      left: null,
      top: null
    };
    try {
      const s = GM_getValue(SETTINGS_KEY);
      if (!s) { gmSet(SETTINGS_KEY, defaultSettings); return defaultSettings; }
      return Object.assign({}, defaultSettings, s);
    } catch (e) { return defaultSettings; }
  }
  function saveSettings(s) { gmSet(SETTINGS_KEY, s); }

  let SETTINGS = loadSettings();

  // ---------- UI: стили, панель (movable, collapse) ----------
  const INFO_ID = 'cl_info_box';
  const PANEL_ID = 'cl_panel';
  function ensureStyles() {
    if (document.getElementById('cl_css')) return;
    const css = `
      #${INFO_ID}{ position:fixed; left:14px; top:14px; z-index:2147483647; background:#111; color:#fff; padding:10px 12px; border-radius:10px; font-family:Arial, sans-serif; font-size:13px; box-shadow:0 6px 20px rgba(0,0,0,0.4); max-width:340px;}
      #${PANEL_ID}{ position:fixed; right:14px; bottom:14px; z-index:2147483647; width:420px; font-family:Arial, sans-serif; font-size:13px; box-shadow:0 6px 20px rgba(0,0,0,0.2); border-radius:10px; overflow:hidden; background:#fff;}
      #${PANEL_ID} .header{ background:#0f4c81; color:#fff; padding:8px 10px; cursor:move; display:flex; align-items:center; justify-content:space-between;}
      #${PANEL_ID} .body{ padding:10px; background:#fff; color:#111;}
      #${PANEL_ID} input[type="number"]{ width:90px; }
      #${PANEL_ID} textarea{ width:100%; height:120px; font-family:monospace; font-size:12px; margin-top:6px; }
      #cl_db_list{ max-height:200px; overflow:auto; border:1px solid #eee; padding:6px; border-radius:6px; background:#fafafa; }
      .cl_entry{ display:flex; justify-content:space-between; align-items:center; padding:6px; border-bottom:1px dashed #eee; }
      .cl_thumb{ max-width:54px; max-height:44px; border:1px solid #ccc; margin-right:8px; }
      .cl_highlight{ outline:3px solid #ff9a3c !important; }
      .cl_btn{ padding:6px 8px; margin-left:6px; border-radius:6px; border:none; cursor:pointer; }
      .cl_btn_red{ background:#d9534f; color:#fff; }
      .cl_btn_primary{ background:#0f4c81; color:#fff; }
    `;
    const st = document.createElement('style');
    st.id = 'cl_css';
    st.innerText = css;
    document.head.appendChild(st);
  }

  function ensureInfoBox() {
    if (document.getElementById(INFO_ID)) return;
    ensureStyles();
    const el = document.createElement('div');
    el.id = INFO_ID;
    el.innerHTML = `<div style="font-weight:700;margin-bottom:6px">Captcha Learner</div><div id="cl_info_msg">Сканирование страницы...</div>`;
    document.body.appendChild(el);
  }
  function updateInfo(msg) {
    ensureInfoBox();
    const el = document.getElementById('cl_info_msg');
    if (el) el.textContent = msg;
  }

  // Позиция и состояние панели
  function ensurePanel() {
    if (document.getElementById(PANEL_ID)) return;
    ensureStyles();
    const panel = document.createElement('div');
    panel.id = PANEL_ID;
    panel.innerHTML = `
      <div class="header"><div style="font-weight:700">Captcha Learner — Controls</div>
        <div>
          <button id="cl_toggle_btn" class="cl_btn cl_btn_primary">–</button>
        </div>
      </div>
      <div class="body" id="cl_body">
        <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px;">
          <label>Interval(ms): <input id="cl_interval" type="number" value="${SETTINGS.pollInterval}" /></label>
          <label><input id="cl_autostart" type="checkbox" ${SETTINGS.autoStart ? 'checked' : ''}/> Auto</label>
          <label style="margin-left:8px"><input id="cl_autoclear" type="checkbox" ${SETTINGS.autoClearOnStart ? 'checked' : ''}/> Auto-clear on start</label>
        </div>
        <div style="display:flex;gap:8px;margin-bottom:8px;">
          <button id="cl_scan_btn" class="cl_btn cl_btn_primary">Scan now</button>
          <button id="cl_export_btn" class="cl_btn">Export DB</button>
          <button id="cl_import_btn" class="cl_btn">Import DB</button>
          <button id="cl_clear_btn" class="cl_btn cl_btn_red">Clear DB</button>
        </div>
        <div id="cl_db_list" style="margin-bottom:8px"></div>
        <textarea id="cl_import_area" placeholder='JSON for import / exported JSON will appear here'></textarea>
      </div>
    `;
    document.body.appendChild(panel);

    // restore position if saved
    if (SETTINGS.left && SETTINGS.top) {
      panel.style.left = SETTINGS.left;
      panel.style.top = SETTINGS.top;
      panel.style.right = 'auto';
      panel.style.bottom = 'auto';
    }

    // collapsed state
    const body = panel.querySelector('#cl_body');
    const toggleBtn = panel.querySelector('#cl_toggle_btn');
    function setCollapsed(v) {
      SETTINGS.collapsed = !!v;
      saveSettings(SETTINGS);
      body.style.display = v ? 'none' : 'block';
      toggleBtn.textContent = v ? '+' : '–';
    }
    setCollapsed(SETTINGS.collapsed);

    toggleBtn.addEventListener('click', () => setCollapsed(!SETTINGS.collapsed));

    // drag
    let dragging = false, dx = 0, dy = 0;
    const header = panel.querySelector('.header');
    header.addEventListener('mousedown', (e) => {
      dragging = true;
      dx = e.clientX - panel.offsetLeft;
      dy = e.clientY - panel.offsetTop;
      e.preventDefault();
    });
    document.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      panel.style.left = (e.clientX - dx) + 'px';
      panel.style.top = (e.clientY - dy) + 'px';
      panel.style.right = 'auto';
      panel.style.bottom = 'auto';
    });
    document.addEventListener('mouseup', () => {
      if (dragging) {
        dragging = false;
        SETTINGS.left = panel.style.left;
        SETTINGS.top = panel.style.top;
        saveSettings(SETTINGS);
      }
    });

    // controls hookup
    document.getElementById('cl_scan_btn').addEventListener('click', () => scanOnce(true));
    document.getElementById('cl_export_btn').addEventListener('click', exportDB);
    document.getElementById('cl_import_btn').addEventListener('click', importDBFromTextarea);
    document.getElementById('cl_clear_btn').addEventListener('click', () => {
      if (!confirm('Clear ALL learned DB entries?')) return;
      clearDB();
    });

    // settings inputs
    document.getElementById('cl_interval').addEventListener('change', (e) => {
      const v = Math.max(200, parseInt(e.target.value) || DEFAULT_POLL);
      SETTINGS.pollInterval = v;
      saveSettings(SETTINGS);
      restartPoller();
    });
    document.getElementById('cl_autostart').addEventListener('change', (e) => {
      SETTINGS.autoStart = !!e.target.checked;
      saveSettings(SETTINGS);
      if (SETTINGS.autoStart) startPoller(); else stopPoller();
    });
    document.getElementById('cl_autoclear').addEventListener('change', (e) => {
      SETTINGS.autoClearOnStart = !!e.target.checked;
      saveSettings(SETTINGS);
    });
  }

  // ---------- DB helpers ----------
  function dbKey(label) { return DB_PREFIX + label.replace(/\s+/g, '_').toLowerCase(); }
  function dbGet(label) { return gmGet(dbKey(label), []); }
  function dbSet(label, arr) { gmSet(dbKey(label), arr); }
  function dbAdd(label, dataUrl) {
    const key = dbKey(label);
    let arr = gmGet(key, []);
    if (!Array.isArray(arr)) arr = [];
    if (!arr.includes(dataUrl)) {
      arr.push(dataUrl);
      gmSet(key, arr);
    }
  }
  function dbRemove(label) { gmDelete(dbKey(label)); }
  function dbList() {
    const keys = gmList();
    const out = [];
    for (const k of keys) {
      if (k.startsWith(DB_PREFIX)) {
        const label = k.slice(DB_PREFIX.length);
        const arr = gmGet(k, []);
        out.push({ label: label, count: (Array.isArray(arr) ? arr.length : 0) });
      }
    }
    return out;
  }

  function clearDB() {
    const keys = gmList();
    for (const k of keys) {
      if (k.startsWith(DB_PREFIX)) gmDelete(k);
    }
    renderDBList();
    updateInfo('DB cleared');
  }

  function exportDB() {
    const items = dbList();
    const out = {};
    for (const it of items) {
      out[it.label] = gmGet(DB_PREFIX + it.label, []);
    }
    document.getElementById('cl_import_area').value = JSON.stringify(out, null, 2);
    updateInfo('Exported DB to textarea');
  }

  function importDBFromTextarea() {
    const txt = document.getElementById('cl_import_area').value.trim();
    if (!txt) return alert('Paste JSON into textarea first');
    try {
      const parsed = JSON.parse(txt);
      for (const k in parsed) {
        const key = DB_PREFIX + k;
        gmSet(key, parsed[k]);
      }
      renderDBList();
      updateInfo('Imported ' + Object.keys(parsed).length + ' entries');
    } catch (e) {
      alert('Invalid JSON: ' + e.message);
    }
  }

  function renderDBList() {
    const c = document.getElementById('cl_db_list');
    if (!c) return;
    c.innerHTML = '';
    const items = dbList();
    if (items.length === 0) { c.innerHTML = '<div style="color:#888;padding:8px">DB empty</div>'; return; }
    for (const it of items) {
      const row = document.createElement('div');
      row.className = 'cl_entry';
      const left = document.createElement('div');
      left.style.display = 'flex'; left.style.alignItems = 'center';
      const arr = gmGet(DB_PREFIX + it.label, []);
      const thumb = document.createElement('img'); thumb.className = 'cl_thumb'; thumb.src = arr && arr[0] ? arr[0] : '';
      left.appendChild(thumb);
      const t = document.createElement('div'); t.innerHTML = `<div style="font-weight:700">${it.label}</div><div style="font-size:12px;color:#666">${it.count} images</div>`;
      left.appendChild(t);
      row.appendChild(left);
      const btns = document.createElement('div');
      const view = document.createElement('button'); view.textContent = 'View'; view.className='cl_btn';
      view.onclick = () => { document.getElementById('cl_import_area').value = JSON.stringify({ label: it.label, images: gmGet(DB_PREFIX + it.label, []) }, null, 2); };
      const del = document.createElement('button'); del.textContent = 'Delete'; del.className='cl_btn cl_btn_red';
      del.onclick = () => { if (confirm('Delete "' + it.label + '"?')) { dbRemove(it.label); renderDBList(); } };
      btns.appendChild(view); btns.appendChild(del);
      row.appendChild(btns);
      c.appendChild(row);
    }
  }

  // ---------- image downscale & signature ----------
  function downscaleToDataUrl(img) {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      const scale = Math.min(1, MAX_IMG_DIM / Math.max(w, h));
      const nw = Math.max(MIN_IMG_DIM, Math.round(w * scale));
      const nh = Math.max(MIN_IMG_DIM, Math.round(h * scale));
      canvas.width = nw; canvas.height = nh;
      ctx.drawImage(img, 0, 0, nw, nh);
      return canvas.toDataURL('image/jpeg', 0.45);
    } catch (e) {
      console.error('downscale error', e);
      return null;
    }
  }

  // ---------- detection of widgets ----------
  function findRecaptcha() {
    // standard tiles
    const tiles = document.querySelectorAll('.rc-imageselect-tile-wrapper img, .rc-image-tile-wrapper img');
    // instruction node
    const instr = document.querySelector('.rc-imageselect-instructions, .rc-imageselect-desc-no-canonical, .rc-imageselect-instructions div');
    if (tiles && tiles.length && instr) {
      return { type: 'recaptcha', tiles: Array.from(tiles), label: instr.innerText.trim() };
    }
    return null;
  }
  function findHcaptcha() {
    const tiles = document.querySelectorAll('.task-image img, .image-grid img, .challenge-image img');
    const instr = document.querySelector('.prompt-text, .caption-text');
    if (tiles && tiles.length && instr) {
      return { type: 'hcaptcha', tiles: Array.from(tiles), label: instr.innerText.trim() };
    }
    return null;
  }

  function highlight(el) { try { el.classList.add('cl_highlight'); } catch (e) {} }
  function unhighlight(el) { try { el.classList.remove('cl_highlight'); } catch (e) {} }

  function attachLearnHandler(img, label) {
    const handler = function (ev) {
      ev.stopPropagation(); ev.preventDefault();
      const data = downscaleToDataUrl(img);
      if (!data) return;
      dbAdd(label, data);
      updateInfo('Learned image for "' + label + '"');
      unhighlight(img);
      img.removeEventListener('click', handler);
      renderDBList();
    };
    img.addEventListener('click', handler);
  }

  function tryAutoClick(img, label) {
    const data = downscaleToDataUrl(img);
    if (!data) return false;
    const arr = dbGet(label) || [];
    if (arr.includes(data)) {
      // try to click container or img itself
      const container = img.closest('button, td, div, a, span') || img;
      try { container.click(); } catch (e) { try { img.click(); } catch (e2) {} }
      return true;
    }
    return false;
  }

  function processWidget(widget) {
    if (!widget) return;
    updateInfo(widget.type + ' — "' + widget.label + '" — ' + widget.tiles.length + ' images');
    let matched = 0;
    for (const img of widget.tiles) {
      try {
        unhighlight(img);
        const ok = tryAutoClick(img, widget.label);
        if (ok) matched++;
        else {
          highlight(img);
          attachLearnHandler(img, widget.label);
        }
      } catch (e) {
        console.error('process tile error', e);
      }
    }
    if (matched) updateInfo('Auto-selected ' + matched + ' images for "' + widget.label + '"');
    renderDBList();
  }

  // ---------- scanning loop ----------
  let POLLER = null;
  function scanOnce(force) {
    try {
      const r = findRecaptcha();
      if (r) { processWidget(r); return; }
      const h = findHcaptcha();
      if (h) { processWidget(h); return; }
      if (force) updateInfo('No image captcha found on page');
    } catch (e) { console.error('scanOnce', e); }
  }

  function startPoller() {
    stopPoller();
    POLLER = setInterval(() => scanOnce(false), SETTINGS.pollInterval || DEFAULT_POLL);
    updateInfo('Polling every ' + (SETTINGS.pollInterval || DEFAULT_POLL) + ' ms');
  }
  function stopPoller() {
    if (POLLER) { clearInterval(POLLER); POLLER = null; updateInfo('Polling stopped'); }
  }
  function restartPoller() {
    if (SETTINGS.autoStart) startPoller();
  }

  // ---------- init ----------
  function init() {
    ensureInfoBox();
    ensurePanel();
    renderDBList();

    // auto-clear on start?
    if (SETTINGS.autoClearOnStart) {
      if (confirm('Auto-clear DB on start is enabled. Clear DB now?')) {
        clearDB();
      }
    }

    // auto start poller if enabled
    if (SETTINGS.autoStart) startPoller();

    // initial scan after short delay
    setTimeout(() => scanOnce(true), 1200);

    // refresh DB list periodically (in case learned)
    setInterval(renderDBList, 3500);
  }

  // run
  init();

})();
