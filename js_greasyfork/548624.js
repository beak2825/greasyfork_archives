
// ==UserScript==
// @name         SHOPEE PRODUCT CAPTURE
// @namespace    https://markg.dev/userscripts/shopee-pdp-capture
// @version      1.6.1
// @description  Intercept https://shopee.ph/api/v4/pdp/get_pc, capture title + video + up to 8 images; GUI + LocalStorage; push to Google Sheets (adds COMBINED column) with SPA-safe toggle UI
// @author       You
// @match        https://shopee.ph/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/548624/SHOPEE%20PRODUCT%20CAPTURE.user.js
// @updateURL https://update.greasyfork.org/scripts/548624/SHOPEE%20PRODUCT%20CAPTURE.meta.js
// ==/UserScript==
 
(function () {
  'use strict';
 
  /** ================== CONFIG ================== **/
  const TARGET_SUBSTR = 'https://shopee.ph/api/v4/pdp/get_pc';
 
  // ✅ Your deployed GAS Web App URL
  const GAS_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbx_9vQW_3dMPDZ1CTuawZsIgh4tXVEwkR4Z9hlRzYu95m0GV1XXJBXooJP5AnmR3wFt/exec';
 
  // Sheet tab name
  const SHEET_TAB = 'SP_TEMU_CAPTURED';
 
  const STORAGE_KEYS = {
    BUFFER: 'shp_pdp_buffer_v1',
    CAPTURED: 'shp_pdp_captured_v1',
  };
  const LIMIT_BUFFER = 300;
  const MAX_IMAGES   = 8;
 
  /** ================== INJECT PAGE-CONTEXT INTERCEPTORS ================== **/
  function injectInterceptorsIntoPage() {
    const code = `
      (function(){
        const TARGET = ${JSON.stringify(TARGET_SUBSTR)};
        function postRaw(json){
          try {
            window.postMessage({ __shp: true, kind: 'pdp_raw', payload: json }, '*');
          } catch(_) {}
        }
 
        // Hook fetch
        const _fetch = window.fetch;
        window.fetch = function(...args){
          try {
            const req = args[0];
            const url = typeof req === 'string' ? req : (req && req.url) || '';
            const watch = typeof url === 'string' && url.indexOf(TARGET) !== -1;
            return _fetch.apply(this, args).then(res => {
              if (!watch) return res;
              try {
                const clone = res.clone();
                clone.json().then(json => postRaw(json)).catch(()=>{});
              } catch(_) {}
              return res;
            });
          } catch(_) {
            return _fetch.apply(this, args);
          }
        };
 
        // Hook XHR
        const _open = XMLHttpRequest.prototype.open;
        const _send = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.open = function(method, url, ...rest){
          this.__shp_watch = (typeof url === 'string' && url.indexOf(TARGET) !== -1);
          return _open.call(this, method, url, ...rest);
        };
        XMLHttpRequest.prototype.send = function(...args){
          if (this.__shp_watch) {
            this.addEventListener('load', () => {
              try {
                if (this.responseType && this.responseType !== '' && this.responseType !== 'text') return;
                const t = this.responseText;
                if (!t) return;
                const json = JSON.parse(t);
                postRaw(json);
              } catch(_) {}
            });
          }
          return _send.apply(this, args);
        };
      })();
    `;
    const s = document.createElement('script');
    s.textContent = code;
    (document.head || document.documentElement).appendChild(s);
    s.remove();
  }
 
  injectInterceptorsIntoPage();
 
  /** ================== RECEIVE RAW JSON FROM PAGE ================== **/
  window.addEventListener('message', (ev) => {
    const d = ev && ev.data;
    if (!d || !d.__shp || d.kind !== 'pdp_raw') return;
    if (!d.payload) return;
    pushBuffer(d.payload);
  });
 
  /** ================== UTIL: STORAGE ================== **/
  const readJSON = (key, fallback) => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : (fallback ?? null); } catch { return fallback ?? null; } };
  const writeJSON = (key, obj) => { try { localStorage.setItem(key, JSON.stringify(obj)); } catch {} };
 
  function pushBuffer(obj) {
    const buf = readJSON(STORAGE_KEYS.BUFFER, []);
    buf.push(obj);
    if (buf.length > LIMIT_BUFFER) buf.splice(0, buf.length - LIMIT_BUFFER);
    writeJSON(STORAGE_KEYS.BUFFER, buf);
    updateBadgeCount();
  }
 
  const getCaptures = () => readJSON(STORAGE_KEYS.CAPTURED, []);
  const setCaptures = (arr) => { writeJSON(STORAGE_KEYS.CAPTURED, arr); updateLogTable(); updateBadgeCount(); };
 
  /** ================== FORMATTERS ================== **/
  function ensureVideoUrl(videoPath) {
    if (!videoPath || typeof videoPath !== 'string') return '';
    if (/^https?:\/\//i.test(videoPath)) return videoPath;
    const path = videoPath.startsWith('/') ? videoPath : `/${videoPath}`;
    return `https://down-bs-sg.vod.susercontent.com${path}`;
  }
  function ensureImageUrl(imageId) {
    if (!imageId) return '';
    if (typeof imageId === 'string' && /^https?:\/\//i.test(imageId)) return imageId;
    return `https://down-ph.img.susercontent.com/file/${imageId}.jpg`;
  }
 
  /** ================== PARSER ================== **/
  function extractItem(json) {
    try {
      const data = json?.data;
      if (!data) return null;
 
      const title = (data?.item?.title || '').trim();
      const videoPath =
        data?.product_images?.video?.video_id ||
        data?.video?.video_id ||
        data?.product_images?.video_id || '';
      const video_url = ensureVideoUrl(videoPath);
 
      const imageIds =
        (Array.isArray(data?.product_images?.images) && data.product_images.images) ||
        (Array.isArray(data?.images) && data.images) ||
        [];
      const image_urls = imageIds.slice(0, MAX_IMAGES).map(ensureImageUrl).filter(Boolean);
 
      if (!title && !video_url && image_urls.length === 0) return null;
 
      return { title, video_url, image_urls, pushed: false, pushed_at: null, _ts: Date.now() };
    } catch { return null; }
  }
 
  /** ================== SHEETS PUSH (adds COMBINED column) ================== **/
  function buildRowsForSheet(captures) {
    return captures.map(it => {
      const title = it.title || '';
      const video = it.video_url || '';
      const imgs = [];
      for (let i = 0; i < MAX_IMAGES; i++) imgs.push(it.image_urls?.[i] || '');
      // COMBINED = video + all non-empty image URLs, comma-separated
      const combined = [video, ...imgs].filter(Boolean).join(',');
      // Columns: Title, Video URL, Image1..Image8, COMBINED
      return [ title, video, ...imgs, combined ];
    });
  }
 
  function postJSONViaGM(url, obj) {
    return new Promise((resolve) => {
      GM_xmlhttpRequest({
        method: 'POST',
        url,
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify(obj),
        onload: (res) => {
          const status = res.status || 0;
          let json = null;
          try { json = JSON.parse(res.responseText); } catch {}
          resolve({ ok: status >= 200 && status < 300, status, json, text: res.responseText });
        },
        onerror: (err) => resolve({ ok: false, status: 0, json: null, text: String(err) }),
        ontimeout: () => resolve({ ok: false, status: 0, json: null, text: 'timeout' }),
      });
    });
  }
 
  async function pushToSheets() {
    if (!GAS_WEBAPP_URL) {
      alert('Please set GAS_WEBAPP_URL in the userscript first.');
      return { ok: false, msg: 'Missing GAS endpoint' };
    }
 
    const all = getCaptures();
    const pending = all.filter(x => !x.pushed);
    if (pending.length === 0) {
      alert('Nothing to push. All captured items are already marked as pushed.');
      return { ok: true, inserted: 0 };
    }
 
    const rows = buildRowsForSheet(pending);
    const payload = { sheet: SHEET_TAB, rows };
 
    const result = await postJSONViaGM(GAS_WEBAPP_URL, payload);
 
    if (!result.ok) {
      alert(`GAS endpoint error (status ${result.status}).\n${result.text || ''}`);
      return { ok: false, msg: result.text || 'error' };
    }
 
    const ok = result.json && (result.json.ok || result.json.success);
    if (ok) {
      const now = new Date().toISOString();
      const updated = all.map(item => { if (!item.pushed) { item.pushed = true; item.pushed_at = now; } return item; });
      setCaptures(updated);
      alert(`Uploaded ${rows.length} row(s) to "${SHEET_TAB}".`);
      return { ok: true, inserted: rows.length };
    } else {
      alert('GAS endpoint returned unexpected response:\n' + (result.text || JSON.stringify(result.json)));
      return { ok: false, msg: result.text || JSON.stringify(result.json) };
    }
  }
 
  /** ================== GUI (mobile-friendly with toggle) ================== **/
  let panel, scrollWrap, badge;
 
  const UI_VIS_KEY = 'shp_ui_visible_v1';
  const getUIVisible = () => {
    try { return JSON.parse(localStorage.getItem(UI_VIS_KEY) || 'false'); } catch { return false; }
  };
  const setUIVisible = (v) => {
    try { localStorage.setItem(UI_VIS_KEY, JSON.stringify(!!v)); } catch {}
  };
 
  GM_addStyle(`
    /* Toggle button (bottom-left) */
    .shp-toggle{
      position:fixed; z-index:999998; left:16px; bottom:16px;
      background:#1a1a1a; color:#fff; border:1px solid #333; border-radius:999px;
      padding:10px 14px; font-weight:800; cursor:pointer;
      box-shadow:0 6px 20px rgba(0,0,0,.35); user-select:none
    }
    .shp-toggle:hover{opacity:.9}
 
    /* Panel (bottom-left; class-based show/hide) */
    .shp-panel{
      position:fixed; z-index:999999; bottom:60px; left:16px; width:420px; max-height:70vh;
      background:#111; color:#eee; font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;
      border:1px solid #333; border-radius:12px; box-shadow:0 6px 20px rgba(0,0,0,.4);
      overflow:hidden; user-select:none; display:none
    }
    .shp-panel.shp-open{ display:block; }
 
    .shp-header{display:flex;align-items:center;justify-content:space-between;gap:8px;background:#1a1a1a;padding:8px 10px;cursor:move}
    .shp-title{font-weight:700;font-size:14px}
    .shp-badge{background:#444;color:#fff;font-size:11px;padding:2px 6px;border-radius:999px}
    .shp-btnrow{display:flex;gap:6px}
    .shp-btn{background:#2f2f2f;color:#fff;border:none;padding:8px 12px;border-radius:8px;cursor:pointer;font-weight:700;font-size:12px}
    .shp-btn:hover{opacity:.9}
    .shp-cap{background:#2f7a53}
    .shp-sheets{background:#2f5fc7}
    .shp-clear{background:#c23a3a}
    .shp-body{padding:8px;background:#0f0f0f}
    .shp-scroll{max-height:48vh;overflow:auto;border:1px solid #222;border-radius:8px;background:#121212}
    .shp-table{width:100%;border-collapse:collapse;font-size:12px}
    .shp-table th{position:sticky;top:0;background:#191919;border-bottom:1px solid #333;text-align:left;padding:6px}
    .shp-table td{padding:6px;border-bottom:1px solid #1c1c1c;vertical-align:top}
    .shp-url,.shp-imgurl{word-break:break-all}
    .shp-url{color:#6cf}
    .shp-imgurl{color:#9f;display:inline-block;margin-right:6px}
    .shp-tip{font-size:11px;color:#aaa;margin-top:6px}
    @media (max-width: 600px){
      .shp-panel{width:94vw;left:3vw;right:auto;bottom:64px}
      .shp-btn{padding:10px 12px;font-size:13px}
      .shp-table{font-size:13px}
      .shp-scroll{max-height:52vh}
    }
  `);
 
  function createToggleButton(){
    const btn = document.createElement('button');
    btn.className = 'shp-toggle';
    btn.type = 'button';
    btn.textContent = 'PDP';
    btn.title = 'Show/Hide Shopee PDP Capture (Shift+S)';
    btn.addEventListener('click', toggleUI, { passive: true });
    document.documentElement.appendChild(btn);
 
    // Keyboard toggle: Shift+S
    window.addEventListener('keydown', (e) => {
      if (e.shiftKey && (e.key === 'S' || e.key === 's')) {
        e.preventDefault();
        toggleUI();
      }
    }, { passive: false });
  }
 
  function createGUI() {
    // If panel already exists, do nothing
    if (panel && document.documentElement.contains(panel)) return;
 
    panel = document.createElement('div'); panel.className = 'shp-panel';
    const header = document.createElement('div'); header.className = 'shp-header';
    const title = document.createElement('div'); title.className = 'shp-title'; title.textContent = 'Shopee PDP Capture';
    badge = document.createElement('span'); badge.className = 'shp-badge'; badge.textContent = '0';
 
    const btnWrap = document.createElement('div'); btnWrap.className = 'shp-btnrow';
    const mkBtn = (label, className, handler, tip='') => {
      const b=document.createElement('button');
      b.className=`shp-btn ${className}`;
      b.textContent=label; b.title=tip;
      b.addEventListener('click', handler, {passive:true});
      return b;
    };
    const captureBtn = mkBtn('CAPTURE','shp-cap', onCaptureClick, 'Parse buffered responses and save unique items');
    const sheetsBtn  = mkBtn('GSHEETS','shp-sheets', onSheetsClick, 'Send captured data to Google Sheets');
    const clearBtn   = mkBtn('CLEAR','shp-clear', onClearClick, 'Delete stored data and refresh');
 
    btnWrap.appendChild(captureBtn); btnWrap.appendChild(sheetsBtn); btnWrap.appendChild(clearBtn);
    header.appendChild(title); header.appendChild(badge); header.appendChild(btnWrap);
 
    const body = document.createElement('div'); body.className = 'shp-body';
 
    // Scroll container for the table (prevents full-screen growth)
    scrollWrap = document.createElement('div');
    scrollWrap.className = 'shp-scroll';
    scrollWrap.appendChild(renderTable(getCaptures()));
 
    const tip = document.createElement('div');
    tip.className = 'shp-tip';
    tip.textContent = 'Intercepts PDP API in the background. Click CAPTURE to parse & save.';
 
    body.appendChild(scrollWrap);
    body.appendChild(tip);
 
    panel.appendChild(header);
    panel.appendChild(body);
    document.documentElement.appendChild(panel);
 
    makeDraggable(panel, header);
    updateBadgeCount();
  }
 
  function renderTable(items) {
    const table = document.createElement('table'); table.className = 'shp-table';
    const thead = document.createElement('thead');
    const trh = document.createElement('tr');
    ['#', 'Title', 'Video URL', 'Image URLs (max 8)'].forEach(h => {
      const th = document.createElement('th');
      th.textContent = h;
      trh.appendChild(th);
    });
    thead.appendChild(trh);
 
    const tbody = document.createElement('tbody');
    if (!items || items.length === 0) {
      const tr = document.createElement('tr'); const td = document.createElement('td');
      td.colSpan = 4; td.textContent = 'No captures yet. Browse product pages or trigger actions that load PDP API, then click CAPTURE.';
      td.style.color='#aaa';
      tr.appendChild(td); tbody.appendChild(tr);
    } else {
      items.forEach((it, i) => {
        const tr = document.createElement('tr');
        const tdIdx = document.createElement('td'); tdIdx.textContent = String(i+1);
        const tdTitle = document.createElement('td'); tdTitle.textContent = it.title || '';
        const tdVideo = document.createElement('td');
        if (it.video_url) {
          const a=document.createElement('a');
          a.href=it.video_url; a.target='_blank'; a.rel='noopener'; a.className='shp-url'; a.textContent=it.video_url;
          tdVideo.appendChild(a);
        } else { tdVideo.textContent='—'; tdVideo.style.color='#888'; }
        const tdImgs = document.createElement('td');
        if (Array.isArray(it.image_urls) && it.image_urls.length) {
          it.image_urls.forEach((u, idx) => {
            const a=document.createElement('a');
            a.href=u; a.target='_blank'; a.rel='noopener'; a.className='shp-imgurl'; a.textContent=u;
            tdImgs.appendChild(a);
            if (idx<it.image_urls.length-1) tdImgs.appendChild(document.createElement('br'));
          });
        } else { tdImgs.textContent='—'; tdImgs.style.color='#888'; }
        tr.appendChild(tdIdx); tr.appendChild(tdTitle); tr.appendChild(tdVideo); tr.appendChild(tdImgs);
        tbody.appendChild(tr);
      });
    }
    table.appendChild(thead); table.appendChild(tbody);
    return table;
  }
 
  function updateLogTable() {
    if (!scrollWrap) return;
    const newTable = renderTable(getCaptures());
    scrollWrap.replaceChildren(newTable);
  }
 
  function updateBadgeCount() {
    if (!badge) return;
    const buf = readJSON(STORAGE_KEYS.BUFFER, []);
    const cap = readJSON(STORAGE_KEYS.CAPTURED, []);
    badge.textContent = `${cap.length} • ${buf.length}`;
    badge.title = `Captured: ${cap.length}\nBuffered: ${buf.length}`;
  }
 
  /** ================== DRAG (mouse + touch) ================== **/
  function makeDraggable(box, handle) {
    let sx=0, sy=0, ox=0, oy=0, dragging=false;
    const start=(x,y)=>{ dragging=true; sx=x; sy=y; const r=box.getBoundingClientRect(); ox=r.left; oy=r.top; };
const move = (x, y) => {
  if (!dragging) return;
  const dx = x - sx, dy = y - sy;
  box.style.left = `${ox + dx}px`;
  box.style.top  = `${oy + dy}px`;
  box.style.right = 'auto';
  box.style.bottom = 'auto';
};
    const end=()=>{ dragging=false; };
    handle.addEventListener('mousedown', e=>{ start(e.clientX,e.clientY); e.preventDefault(); });
    window.addEventListener('mousemove', e=>move(e.clientX,e.clientY));
    window.addEventListener('mouseup', end);
    handle.addEventListener('touchstart', e=>{ const t=e.touches[0]; start(t.clientX,t.clientY); }, {passive:true});
    window.addEventListener('touchmove', e=>{ const t=e.touches[0]; if(t) move(t.clientX,t.clientY); }, {passive:true});
    window.addEventListener('touchend', end, {passive:true});
    window.addEventListener('touchcancel', end, {passive:true});
  }
 
  /** ================== SHOW/HIDE (class-based) ================== **/
  function ensureGUI() {
    if (panel && document.documentElement.contains(panel)) return panel;
    createGUI();
    return panel;
  }
  function showUI() {
    ensureGUI();
    panel.classList.add('shp-open');
    setUIVisible(true);
  }
  function hideUI() {
    if (!panel) return;
    panel.classList.remove('shp-open');
    setUIVisible(false);
  }
  function toggleUI() {
    ensureGUI();
    const isOpen = panel.classList.contains('shp-open');
    if (isOpen) hideUI(); else showUI();
  }
 
  /** ================== BUTTON HANDLERS ================== **/
  function onCaptureClick() {
    const raw = readJSON(STORAGE_KEYS.BUFFER, []);
    if (!raw || raw.length === 0) {
      alert('No buffered PDP responses yet.\nBrowse product pages (or actions that load PDP) then try again.');
      return;
    }
 
    const existing = getCaptures();
    const out = existing.slice();
    const dedupe = new Set(existing.map(it => (it.title + '|' + (it.video_url || '') + '|' + (it.image_urls?.[0] || ''))));
 
    let added = 0;
    for (const js of raw) {
      const item = extractItem(js);
      if (!item) continue;
      const key = item.title + '|' + (item.video_url || '') + '|' + (item.image_urls?.[0] || '');
      if (dedupe.has(key)) continue;
      out.push(item); dedupe.add(key); added++;
    }
 
    setCaptures(out);
    writeJSON(STORAGE_KEYS.BUFFER, []);
    updateBadgeCount();
const move = (x, y) => {
  if (!dragging) return;
  const dx = x - sx, dy = y - sy;
  box.style.left  = (ox + dx) + 'px';
  box.style.top   = (oy + dy) + 'px';
  box.style.right = 'auto';
  box.style.bottom= 'auto';
};
  }
 
  async function onSheetsClick() { await pushToSheets(); }
 
  function onClearClick() {
    const ok = confirm('Clear all stored captures AND buffered raw responses? The page will refresh.');
    if (!ok) return;
    writeJSON(STORAGE_KEYS.CAPTURED, []); writeJSON(STORAGE_KEYS.BUFFER, []);
    updateLogTable(); updateBadgeCount(); location.reload();
  }
 
  /** ================== BOOT (robust for SPA) ================== **/
  function boot() {
    createToggleButton();     // Always show the tiny toggle (bottom-left)
    createGUI();              // Create panel immediately (hidden)
    if (getUIVisible()) showUI(); // Restore last state
 
    // Re-attach panel if Shopee SPA replaces DOM
    const mo = new MutationObserver(() => {
      if (!panel || !document.documentElement.contains(panel)) {
        createGUI();
        if (getUIVisible()) panel.classList.add('shp-open');
      }
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }
  boot();
 
})();