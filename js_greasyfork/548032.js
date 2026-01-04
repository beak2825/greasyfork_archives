// ==UserScript==
// @name         Aff Link Helper — Shopee + Lazada PH + Push to GSheets
// @namespace    https://markg.dev/userscripts/aff-link-helper
// @version      2025.09.01.5
// @description  Capture clean product URLs and generate affiliate shortlinks for Shopee (GraphQL) and Lazada PH (subId template flow). Push results to Google Sheets (AFF_Links).
// @author       Mark
// @license      MIT
// @match        https://shopee.ph/*
// @match        https://*.shopee.ph/*
// @match        https://shopee.sg/*
// @match        https://shopee.co.id/*
// @match        https://shopee.co.th/*
// @match        https://shopee.com.my/*
// @match        https://shopee.vn/*
// @match        https://shopee.tw/*
// @match        https://www.lazada.com.ph/*
// @match        https://lazada.com.ph/*
// @run-at       document-idle
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      affiliate.shopee.ph
// @connect      adsense.lazada.com.ph
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/548032/Aff%20Link%20Helper%20%E2%80%94%20Shopee%20%2B%20Lazada%20PH%20%2B%20Push%20to%20GSheets.user.js
// @updateURL https://update.greasyfork.org/scripts/548032/Aff%20Link%20Helper%20%E2%80%94%20Shopee%20%2B%20Lazada%20PH%20%2B%20Push%20to%20GSheets.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /** =========================
   *  CONFIG
   *  ========================= */
  const CFG = {
    STORAGE_KEY: 'aff_helper_rows_v1',
    SUBID_KEY: 'aff_helper_subid',
    GAS_URL_KEY: 'aff_helper_gas_url',
    UI_HOTKEY: 'Alt+S',
    // Shopee
    SHOPEE_API: 'https://affiliate.shopee.ph/api/v3/gql?q=batchCustomLink',
    // Lazada PH
    LAZADA_BASE: 'https://adsense.lazada.com.ph',
    LAZADA_ADD: '/subId-templates/add.json',
    LAZADA_LIST: '/subId-templates/list.json',
    LAZADA_CONVERT: '/newOffer/link-convert.json',
    // GAS
    GAS_URL_DEFAULT: '',
    SHEET_TAB: 'AFF_Links'
  };

  /** =========================
   *  STATE
   *  ========================= */
  const state = {
    rows: loadRows(),
    subId: loadSubId(),
    gasUrl: loadGasUrl(),
    hidden: false,
    showSettings: false,
  };

  /** =========================
   *  UTIL
   *  ========================= */
  function loadRows() {
    try { const raw = localStorage.getItem(CFG.STORAGE_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; }
  }
  function saveRows() { localStorage.setItem(CFG.STORAGE_KEY, JSON.stringify(state.rows || [])); }

  function loadSubId() { try { return localStorage.getItem(CFG.SUBID_KEY) || ''; } catch { return ''; } }
  function saveSubId(v) { try { localStorage.setItem(CFG.SUBID_KEY, v || ''); } catch {} }

  function loadGasUrl() { try { return localStorage.getItem(CFG.GAS_URL_KEY) || CFG.GAS_URL_DEFAULT; } catch { return CFG.GAS_URL_DEFAULT; } }
  function saveGasUrl(v) { try { localStorage.setItem(CFG.GAS_URL_KEY, v || ''); } catch {} }

  function stripUrlParams(u) {
    try { const url = new URL(u); url.search=''; url.hash=''; return url.toString(); }
    catch { return (u||'').split('#')[0].split('?')[0]; }
  }
  function readOgUrl() {
    const el = document.querySelector('meta[property="og:url"]');
    return (el && el.content) ? el.content.trim() : null;
  }
  function decodeSlugPart(s) { try { return decodeURIComponent(s); } catch { return s; } }
  function extractNameFromUrl(u) {
    try {
      const url = new URL(u);
      const parts = url.pathname.split('/').filter(Boolean);
      const last = decodeSlugPart(parts[parts.length - 1] || '');
      const trimmed = last.replace(/\.html?$/i, '');
      const stopAtI = trimmed.split('i.')[0];
      const base = stopAtI || trimmed;
      const words = base.split('-').filter(Boolean).slice(0, 5);
      return words.length ? words.join(' ') : '(no-name)';
    } catch { return '(no-name)'; }
  }
  function escapeHtml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }
  function escapeAttr(s){ return String(s).replace(/"/g,'&quot;'); }

  function log(msg) {
    const el = document.getElementById('aff-log');
    if (!el) return;
    const ts = new Date().toLocaleString();
    el.value = `[${ts}] ${msg}\n` + el.value;
  }
  function setDisabled(id, yes){ const el = document.getElementById(id); if (el) el.disabled = !!yes; }
  function provider() {
    const h = location.hostname;
    if (h.includes('shopee.')) return 'shopee';
    if (h.includes('lazada.com.ph')) return 'lazadaPH';
    return 'unknown';
  }

  /** =========================
   *  SHOPEE: GraphQL shortlink
   *  ========================= */
  function shopeeRequestShortLink(originalLink, subId1) {
    const payload = {
      operationName: 'batchGetCustomLink',
      query: `
        query batchGetCustomLink($linkParams: [CustomLinkParam!], $sourceCaller: SourceCaller){
          batchCustomLink(linkParams: $linkParams, sourceCaller: $sourceCaller){
            shortLink
            longLink
            failCode
          }
        }
      `,
      variables: { linkParams: [{ originalLink, advancedLinkParams: subId1 ? { subId1 } : {} }], sourceCaller: 'CUSTOM_LINK_CALLER' }
    };
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'POST',
        url: CFG.SHOPEE_API,
        data: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        anonymous: false,
        onload: (res) => {
          try {
            if (res.status !== 200) return reject(new Error(`HTTP ${res.status}: ${res.responseText}`));
            const json = JSON.parse(res.responseText);
            const item = (json?.data?.batchCustomLink || [])[0];
            if (!item) return reject(new Error('Empty batchCustomLink array'));
            if (item.failCode && item.failCode !== 0) return reject(new Error(`failCode=${item.failCode}`));
            if (!item.shortLink) return reject(new Error('No shortLink returned'));
            resolve(item.shortLink);
          } catch (e) { reject(e); }
        },
        onerror: (e) => reject(e)
      });
    });
  }

  /** =========================
   *  LAZADA PH: SubID template flow
   *  ========================= */
  function lazadaAddSubIdTemplate(subAffId) {
    const payload = { extraParam: { subAffId, subId1:'', subId2:'', subId3:'', subId4:'', subId5:'', subId6:'' } };
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'POST',
        url: CFG.LAZADA_BASE + CFG.LAZADA_ADD,
        data: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        anonymous: false,
        onload: (res) => { if (res.status !== 200) reject(new Error(`LAZADA add.json HTTP ${res.status}: ${res.responseText}`)); else resolve(res.responseText); },
        onerror: (e) => reject(e)
      });
    });
  }
  function lazadaListTemplates() {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: CFG.LAZADA_BASE + CFG.LAZADA_LIST,
        headers: { 'Accept': 'application/json' },
        anonymous: false,
        onload: (res) => {
          try { if (res.status !== 200) return reject(new Error(`LAZADA list.json HTTP ${res.status}: ${res.responseText}`));
            resolve(JSON.parse(res.responseText)); } catch (e) { reject(e); }
        },
        onerror: (e) => reject(e)
      });
    });
  }
  function lazadaFindSubIdKey(listJson, subAffId) {
    const arr = listJson?.data?.subIdList || [];
    if (!Array.isArray(arr) || !arr.length) return null;
    const targetDesc = `subAffId=${subAffId}`;
    const exact = arr.find(x => x?.desc === targetDesc && x?.subIdKey);
    if (exact?.subIdKey) return exact.subIdKey;
    const first = arr.find(x => x?.subIdKey);
    return first ? first.subIdKey : null;
  }
  function lazadaConvertLink(jumpUrl, subIdTemplateKey) {
    const payload = { jumpUrl, subIdTemplateKey };
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'POST',
        url: CFG.LAZADA_BASE + CFG.LAZADA_CONVERT,
        data: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        anonymous: false,
        onload: (res) => {
          try {
            if (res.status !== 200) return reject(new Error(`LAZADA convert HTTP ${res.status}: ${res.responseText}`));
            const json = JSON.parse(res.responseText);
            if (!json?.success) return reject(new Error(`Convert failed: ${res.responseText}`));
            const msg = json?.message;
            if (!msg || typeof msg !== 'string') return reject(new Error('No short link in message'));
            resolve(msg);
          } catch (e) { reject(e); }
        },
        onerror: (e) => reject(e)
      });
    });
  }

  /** =========================
   *  PUSH → Google Sheets (GAS)
   *  ========================= */
  function gmPostJSON(url, data) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'POST',
        url,
        data: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        // No cookies needed if your web app is deployed "Anyone"
        onload: (res) => resolve(res),
        onerror: (res) => reject(res)
      });
    });
  }

  async function doPush() {
    try {
      setDisabled('aff-btn-push', true);

      if (!state.rows.length) { log('Nothing to push. Capture first.'); return; }
      const gasUrlInput = document.getElementById('aff-gas-url');
      const gasUrl = (gasUrlInput?.value || state.gasUrl || '').trim();
      if (!gasUrl) { log('❗ Set your GAS Web App URL in ⚙️ Settings.'); return; }

      state.gasUrl = gasUrl; saveGasUrl(gasUrl);

      log(`Pushing ${state.rows.length} rows to Google Sheets...`);
      const payload = { sheetName: CFG.SHEET_TAB, rows: state.rows.map(r => ({ name: r.name, pageLink: r.pageLink, affLink: r.affLink })) };
      const res = await gmPostJSON(gasUrl, payload);

      let body = null;
      try { body = JSON.parse(res.responseText || '{}'); } catch {}
      if (!body || !body.ok) {
        log(`❌ Push failed — status ${res.status} @ ${res.finalUrl || res.responseURL || gasUrl}`);
        if (res.responseText) log(`Server said: ${res.responseText.substring(0, 400)}`);
        return;
      }

      log(`✅ Pushed ${body.inserted || 0} rows to "${CFG.SHEET_TAB}". Clearing local data...`);
      state.rows = [];
      saveRows();
      renderTable();
      log('Local data cleared.');
    } catch (e) {
      // GM onerror passes an object; stringify useful bits
      try {
        const status = e?.status; const url = e?.finalUrl || e?.responseURL;
        const txt = (e?.responseText || '').substring(0, 400);
        log(`❌ Push error — status ${status || 'n/a'} @ ${url || 'n/a'}`);
        if (txt) log(`Body: ${txt}`);
      } catch {
        log(`❌ Push error: ${String(e)}`);
      }
    } finally {
      setDisabled('aff-btn-push', false);
    }
  }

  async function doTestGAS() {
    try {
      setDisabled('aff-btn-test', true);
      const gasUrl = (document.getElementById('aff-gas-url')?.value || state.gasUrl || '').trim();
      if (!gasUrl) { log('Enter GAS Web App URL first.'); return; }
      log('Testing GAS endpoint...');
      const res = await gmPostJSON(gasUrl, { sheetName: CFG.SHEET_TAB, rows: [] });
      log(`GAS test status: ${res.status} @ ${res.finalUrl || res.responseURL || gasUrl}`);
      if (res.responseText) log(`Response: ${res.responseText.substring(0, 300)}`);
    } catch (e) {
      log(`❌ GAS test failed: ${e?.status || ''} ${e?.responseText ? e.responseText.substring(0, 300) : String(e)}`);
    } finally {
      setDisabled('aff-btn-test', false);
    }
  }

  /** =========================
   *  CAPTURE BUTTON
   *  ========================= */
  async function doCapture() {
    try {
      setDisabled('aff-btn-capture', true);

      const subIdInput = document.getElementById('aff-subid');
      const subId = (subIdInput?.value || '').trim();
      state.subId = subId; saveSubId(subId);

      const prov = provider();
      if (prov === 'shopee') {
        const pageUrl = stripUrlParams(location.href);
        log(`Shopee: captured page URL (no params): ${pageUrl}`);
        if (subId) log(`Using SUBID (subId1): ${subId}`); else log('No SUBID entered (proceeding without subId1)');
        const shortLink = await shopeeRequestShortLink(pageUrl, subId);
        log(`Shopee shortLink: ${shortLink}`);
        addRowRender({ name: extractNameFromUrl(pageUrl), pageLink: pageUrl, affLink: shortLink });

      } else if (prov === 'lazadaPH') {
        const og = readOgUrl();
        const pageUrl = stripUrlParams(og || location.href);
        log(`Lazada PH: captured og:url (or fallback) = ${pageUrl}`);

        if (subId) {
          log(`Lazada PH: adding subId template for subAffId=${subId}...`);
          await lazadaAddSubIdTemplate(subId);
        } else {
          log(`Lazada PH: skipping add.json (no SUBID)`);
        }

        log('Lazada PH: listing subId templates...');
        const listJson = await lazadaListTemplates();
        const subIdKey = lazadaFindSubIdKey(listJson, subId);
        if (!subIdKey) throw new Error('No subIdKey found in list.json');
        log(`Lazada PH: selected subIdTemplateKey = ${subIdKey}`);

        log('Lazada PH: converting link...');
        const shortLink = await lazadaConvertLink(pageUrl, subIdKey);
        log(`Lazada PH shortLink: ${shortLink}`);

        addRowRender({ name: extractNameFromUrl(pageUrl), pageLink: pageUrl, affLink: shortLink });

      } else {
        log('❌ Unknown provider on this domain. Open a Shopee product page or Lazada PH product page.');
      }
    } catch (e) {
      log(`❌ Capture failed: ${e.message || e}`);
    } finally {
      setDisabled('aff-btn-capture', false);
    }
  }

  function addRowRender(row) {
    state.rows.push(row);
    saveRows();
    renderTable();
  }

  function clearAll() {
    state.rows = [];
    saveRows();
    renderTable();
    const el = document.getElementById('aff-log'); if (el) el.value = '';
    log('Cleared data.');
  }

  /** =========================
   *  UI (Desktop + Mobile)
   *  ========================= */
  GM_addStyle(`
    #aff-toggle {
      position: fixed; bottom: 14px; right: 14px; z-index: 2147483647;
      padding: 10px 12px; border-radius: 999px; border: 1px solid #ccc; background: #fff;
      font: 14px/1.1 system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif; cursor: pointer;
      box-shadow: 0 2px 8px rgba(0,0,0,.15);
      touch-action: manipulation;
    }
    #aff-panel {
      position: fixed; bottom: 72px; right: 14px; width: 420px; max-height: 72vh; overflow: hidden;
      z-index: 2147483647; background: #fff; border: 1px solid #dcdcdc; border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,.2); display: flex; flex-direction: column;
    }
    #aff-header {
      padding: 10px 12px; background: #f7f7f7; border-bottom: 1px solid #eaeaea; font-weight: 600;
      display: flex; align-items: center; justify-content: space-between; gap: 8px;
    }
    #aff-header-controls { display:flex; gap:6px; align-items:center; }
    #aff-body { padding: 10px 12px; display: flex; flex-direction: column; gap: 8px; overflow: auto; }
    #aff-row { display: grid; grid-template-columns: 1fr auto auto auto; gap: 8px; align-items: center; }
    #aff-subid, #aff-gas-url {
      width: 100%; padding: 10px 12px; border: 1px solid #d0d0d0; border-radius: 10px;
      font: 14px/1.4 system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;
    }
    .aff-btn {
      padding: 10px 12px; border: 1px solid #d0d0d0; border-radius: 10px; background: #fff; cursor: pointer;
      font: 14px/1.1 system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif; touch-action: manipulation;
    }
    .aff-btn:hover { background: #f3f3f3; }
    .aff-btn:disabled { opacity:.6; cursor: not-allowed; }
    #aff-log {
      width: 100%; height: 110px; resize: vertical; border: 1px solid #d0d0d0; border-radius: 10px; padding: 8px 10px;
      font: 12px/1.4 ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace; background: #fafafa;
    }
    #aff-table { width: 100%; border-collapse: collapse; margin-top: 6px; }
    #aff-table th, #aff-table td {
      border: 1px solid #e5e5e5; padding: 8px 10px; font: 13px/1.4 system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;
      vertical-align: top; word-break: break-word;
    }
    #aff-table th { background: #f9f9f9; position: sticky; top: 0; z-index: 1; }
    .aff-links a { text-decoration: none; color: #0969da; }
    .aff-hide { display: none !important; }

    /* Mobile tweaks */
    @media (max-width: 768px) {
      #aff-panel { right: 8px; left: 8px; width: auto; bottom: 80px; max-height: 70vh; }
      #aff-row { grid-template-columns: 1fr 1fr; grid-auto-rows: minmax(44px,auto); }
      #aff-row .aff-btn { width: 100%; }
      #aff-header { font-size: 14px; }
      #aff-toggle { bottom: 10px; right: 10px; font-size: 16px; padding: 12px 14px; }
      #aff-log { height: 120px; }
      #aff-table th, #aff-table td { font-size: 12px; }
    }
  `);

  function buildUI() {
    const toggle = document.createElement('button');
    toggle.id = 'aff-toggle'; toggle.textContent = '👁 Show';
    toggle.title = `Toggle panel (${CFG.UI_HOTKEY})`;
    toggle.addEventListener('click', togglePanel);
    document.body.appendChild(toggle);

    const panel = document.createElement('div');
    panel.id = 'aff-panel'; panel.className = 'aff-hide';
    panel.innerHTML = `
      <div id="aff-header">
        <div>Aff Link Helper (Shopee + Lazada PH)</div>
        <div id="aff-header-controls">
          <button id="aff-btn-settings" class="aff-btn" title="Settings">⚙️</button>
          <div style="font-weight:400; font-size:12px; opacity:.7">${CFG.UI_HOTKEY} to toggle</div>
        </div>
      </div>
      <div id="aff-body">
        <div id="aff-row">
          <input id="aff-subid" type="text" placeholder="SUBID (Shopee=subId1, Lazada=subAffId)" />
          <button id="aff-btn-capture" class="aff-btn" title="Capture & generate shortlink">Capture</button>
          <button id="aff-btn-push" class="aff-btn" title="Push rows to Google Sheets">Push</button>
          <button id="aff-btn-clear" class="aff-btn" title="Clear table & logs">Clear</button>
        </div>

        <div id="aff-settings" class="aff-hide" style="display:grid; grid-template-columns: 1fr auto auto; gap:8px; align-items:center;">
          <input id="aff-gas-url" type="url" placeholder="Paste your GAS Web App URL (…/exec)" />
          <button id="aff-btn-save-gas" class="aff-btn" title="Save GAS URL">Save</button>
          <button id="aff-btn-test" class="aff-btn" title="Test GAS endpoint">Test GAS</button>
          <div style="grid-column: 1 / -1; font-size:12px; opacity:.8;">
            Sheet tab is fixed to <b>${CFG.SHEET_TAB}</b>. Your GAS must be deployed as a Web App with access "<i>Anyone</i>" (or "Anyone with the link").
          </div>
        </div>

        <textarea id="aff-log" placeholder="LOGS..."></textarea>
        <div id="aff-table-wrap"></div>
      </div>
    `;
    document.body.appendChild(panel);

    // Bind UI
    document.getElementById('aff-btn-capture').addEventListener('click', doCapture);
    document.getElementById('aff-btn-push').addEventListener('click', doPush);
    document.getElementById('aff-btn-clear').addEventListener('click', clearAll);

    const sub = document.getElementById('aff-subid');
    if (state.subId) sub.value = state.subId;
    sub.addEventListener('change', () => { state.subId = sub.value.trim(); saveSubId(state.subId); });

    // Settings
    const settings = document.getElementById('aff-settings');
    const btnSettings = document.getElementById('aff-btn-settings');
    const gasInput = document.getElementById('aff-gas-url');
    const saveGasBtn = document.getElementById('aff-btn-save-gas');
    const testBtn = document.getElementById('aff-btn-test');
    if (state.gasUrl) gasInput.value = state.gasUrl;

    btnSettings.addEventListener('click', () => {
      state.showSettings = !state.showSettings;
      settings.classList.toggle('aff-hide', !state.showSettings);
    });
    saveGasBtn.addEventListener('click', () => {
      state.gasUrl = (gasInput.value || '').trim();
      saveGasUrl(state.gasUrl);
      log(state.gasUrl ? 'Saved GAS Web App URL.' : 'Cleared GAS Web App URL.');
    });
    testBtn.addEventListener('click', doTestGAS);

    // Restore table
    renderTable();

    // Hotkey
    window.addEventListener('keydown', (e) => {
      if (e.altKey && e.key.toLowerCase() === 's') { e.preventDefault(); togglePanel(); }
    });

    // Initial log
    const prov = provider();
    if (prov === 'lazadaPH') {
      const pageUrl = stripUrlParams(readOgUrl() || location.href);
      log(`On load [Lazada PH]: ${pageUrl}`);
    } else if (prov === 'shopee') {
      const pageUrl = stripUrlParams(location.href);
      log(`On load [Shopee]: ${pageUrl}`);
    } else {
      log('On load: unsupported domain for capture (open Shopee or Lazada PH product page).');
    }
  }

  function togglePanel() {
    state.hidden = !state.hidden;
    const panel = document.getElementById('aff-panel');
    const toggle = document.getElementById('aff-toggle');
    if (state.hidden) { panel.classList.add('aff-hide'); toggle.textContent = '👁 Show'; }
    else { panel.classList.remove('aff-hide'); toggle.textContent = '👁 Hide'; }
  }

  function renderTable() {
    const wrap = document.getElementById('aff-table-wrap');
    if (!wrap) return;
    if (!state.rows.length) { wrap.innerHTML = ''; return; }

    const rowsHtml = state.rows.map(r => `
      <tr>
        <td>${escapeHtml(r.name || '')}</td>
        <td class="aff-links"><a href="${escapeAttr(r.pageLink)}" target="_blank" rel="noopener noreferrer">${escapeHtml(r.pageLink)}</a></td>
        <td class="aff-links"><a href="${escapeAttr(r.affLink)}" target="_blank" rel="noopener noreferrer">${escapeHtml(r.affLink)}</a></td>
      </tr>
    `).join('');

    wrap.innerHTML = `
      <table id="aff-table">
        <thead>
          <tr><th style="width:30%">Name</th><th style="width:35%">Page Link</th><th style="width:35%">Aff Link</th></tr>
        </thead>
        <tbody>${rowsHtml}</tbody>
      </table>
    `;
  }

  /** =========================
   *  INIT
   *  ========================= */
  buildUI();
  togglePanel(); // start visible

})();
