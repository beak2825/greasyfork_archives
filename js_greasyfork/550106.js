// ==UserScript==
// @name         Advanced Search User Filter
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  Inline Torn stats for Advanced Search. Company/Faction toggle. Multi-key round-robin. 1 req/sec global queue. v2 NetWorth + TimePlayed averages.
// @author       SuperGogu[3580072]
// @match        https://www.torn.com/page.php?sid=UserList*
// @match        https://www.torn.com/factions.php*
// @match        https://www.torn.com/joblist.php*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550106/Advanced%20Search%20User%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/550106/Advanced%20Search%20User%20Filter.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---------- Constants / Storage keys ----------
  const STORAGE_PREFIX = 'asuf_';
  const POS_KEY = STORAGE_PREFIX + 'pos';
  const VISIBLE_KEY = STORAGE_PREFIX + 'visible';
  const OPACITY_KEY = STORAGE_PREFIX + 'opacity';
  const LS_APIKEY = 'ASUF_TORN_APIKEY';
  const LS_MODE = 'ASUF_MODE'; // 'company' | 'faction'
  const COLLAPSED_KEY = STORAGE_PREFIX + 'collapsed';
  const LS_DISPLAY = 'ASUF_DISPLAY'; // 'onpage' | 'onapp'
  let __asufResultsShown = false; //


  const DEFAULT_POS = { x: 20, y: 90 };
  const DEFAULT_VISIBLE = true;
  const DEFAULT_OPACITY = 0.88;

  // ---------- Persist helpers ----------
  const setPos = pos => GM_setValue(POS_KEY, pos);
  const getPos = () => GM_GetOrDefault(POS_KEY, DEFAULT_POS);
  const setVisible = v => GM_setValue(VISIBLE_KEY, !!v);
  const getVisible = () => GM_GetOrDefault(VISIBLE_KEY, DEFAULT_VISIBLE);
  const setOpacity = o => GM_setValue(OPACITY_KEY, Number(o));
  const getOpacity = () => GM_GetOrDefault(OPACITY_KEY, DEFAULT_OPACITY);

  function GM_GetOrDefault(key, def) {
    const v = GM_getValue(key);
    return typeof v === 'undefined' ? def : v;
  }

  function getDisplayMode() {
    const v = localStorage.getItem(LS_DISPLAY);
    return (v === 'onapp') ? 'onapp' : 'onpage';
  }

  function setDisplayMode(v) {
    localStorage.setItem(LS_DISPLAY, (v === 'onapp') ? 'onapp' : 'onpage');
  }

  // ---------- Styles ----------
  GM_addStyle(`
    .asuf-panel {
      position: fixed; top: 0; left: 0; z-index: 999999;
      width: 420px; max-width: calc(100vw - 24px);
      border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,.35);
      background: rgba(10,10,10,.45); color: #fff;
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial;
      backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
      transition: transform .12s ease;
      user-select: none; overflow: hidden;
    }
    .asuf-header {
      display:flex; justify-content:space-between; align-items:center;
      padding:8px 10px; cursor:move; font-weight:600; font-size:13px;
      background: linear-gradient(90deg, rgba(255,255,255,.05), rgba(255,255,255,.02));
      border-bottom: 1px solid rgba(255,255,255,.06);
    }
    .asuf-handle { width:12px; height:12px; border-radius:3px; background:rgba(255,255,255,.08); margin-right:8px; }
    .asuf-body { padding:10px; font-size:13px; line-height:1.35; max-height: 72vh; overflow:auto; }
    .asuf-row { display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
    .asuf-input {
      flex:1 1 auto; background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.12);
      padding:6px 8px; border-radius:8px; color:#fff; width:100%;
    }
    .asuf-btn { background:rgba(0,0,0,.18); border:none; padding:6px 10px; border-radius:8px; color:#fff; cursor:pointer; font-size:12px; }
    .asuf-btn:disabled { opacity:.5; cursor:not-allowed; }
    .asuf-small { font-size:11px; opacity:.85; }
    .asuf-sep { opacity:.06; border:none; height:1px; background:rgba(255,255,255,.08); margin:8px 0; }

    /* Inline annotation on each <li> */
    .asuf-annot {
      display:block;
      margin:6px 6px 0 6px;
      padding:4px 6px;
      border-radius:8px;
      background:rgba(0,0,0,.12);
      border:1px solid rgba(255,255,255,.10);
      color:#e9ecef;
      font-size:12px; line-height:1.35;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    #asuf-hide { cursor: pointer; }
    /* Results panel (for OnApp) */
    .asuf-results {
      position: fixed;
      z-index: 999998;
      width: 600px;
      max-width: calc(100vw - 24px);
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,.35);
      background: rgba(10,10,10,.45);
      color: #fff;
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial;
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      overflow: hidden;
    }

    .asuf-results-header {
      padding: 6px 10px;
      font-size: 12px;
      font-weight: 600;
      border-bottom: 1px solid rgba(255,255,255,.06);
      background: linear-gradient(90deg, rgba(255,255,255,.05), rgba(255,255,255,.02));
    }

    .asuf-results-body {
      max-height: 280px; /* ~10 rânduri */
      overflow: auto;
      font-size: 12px;
      line-height: 1.35;
    }

    .asuf-res-row {
      padding: 6px 10px;
      border-bottom: 1px solid rgba(255,255,255,.06);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .asuf-res-row:last-child { border-bottom: none; }

    .asuf-res-name a {
      color: #9ad1ff;
      text-decoration: none;
    }
    .asuf-res-name a:hover { text-decoration: underline; }

    .asuf-res-row {
      white-space: normal !important;
      word-break: break-word;
      line-height: 1.4;
    }

    /* colored numbers */
    .asuf-metric { font-weight: 700; }
    .asuf-red    { color: #ff6b6b; }
    .asuf-orange { color: #ff9f43; }
    .asuf-yellow { color: #ffd166; }
    .asuf-green  { color: #4cd964; }

    /* OnApp: allow wrapping long lines */
    .asuf-res-row {
      white-space: normal !important;
      word-break: break-word;
      line-height: 1.4;
    }

  `);

  // ---------- Panel UI ----------
  const panel = document.createElement('div');
  panel.className = 'asuf-panel';
  panel.style.opacity = getOpacity();

  const header = document.createElement('div');
  header.className = 'asuf-header';
  header.innerHTML = `
    <div style="display:flex; align-items:center;">
      <div class="asuf-handle" title="Drag"></div>
      Advanced Search User Filter
      <span class="asuf-small" style="margin-left:6px; opacity:.7;">— controls</span>
    </div>
    <div>
      <button class="asuf-btn" id="asuf-hide" title="Hide">✕</button>
    </div>
  `;

  const body = document.createElement('div');
  body.className = 'asuf-body';
  body.innerHTML = `
    <div class="asuf-row" style="margin-bottom:6px;">
      <input id="asuf-apikey" type="password" class="asuf-input"
             placeholder="Enter one or more API keys, comma-separated">
      <button class="asuf-btn" id="asuf-togglekey" title="Show/Hide API keys">Show</button>
      <button class="asuf-btn" id="asuf-savekey">Save</button>
    </div>

    <div class="asuf-row" style="margin:6px 0;">
      <label style="font-size:12px; margin-right:8px;">Mode:</label>
      <label style="font-size:12px; margin-right:8px;">
        <input type="radio" name="asuf-mode" value="company" id="asuf-mode-company" checked>
        Company
      </label>
      <label style="font-size:12px;">
        <input type="radio" name="asuf-mode" value="faction" id="asuf-mode-faction">
        Faction
      </label>
    </div>

    <!-- NEW: Display toggle -->
    <div class="asuf-row" style="margin:6px 0;">
      <label style="font-size:12px; margin-right:6px;">Display:</label>
      <label style="font-size:12px; margin-right:8px;">
        <input type="radio" name="asuf-display" value="onpage" id="asuf-display-onpage" checked>
        OnPage
      </label>
      <label style="font-size:12px;">
        <input type="radio" name="asuf-display" value="onapp" id="asuf-display-onapp">
        OnApp
      </label>
    </div>

     <div class="asuf-row">
      <button class="asuf-btn" id="asuf-run">Fetch & annotate</button>
      <button class="asuf-btn" id="asuf-cancel" disabled>Cancel</button>
      <span id="asuf-status" class="asuf-small">Idle</span>
    </div>
  `;

  panel.appendChild(header);
  panel.appendChild(body);

  document.body.appendChild(panel);

  // Create results panel (for OnApp)
  const resPanel = document.createElement('div');
  resPanel.className = 'asuf-results';
  resPanel.innerHTML = `
    <div class="asuf-results-header">Results (OnApp)</div>
    <div class="asuf-results-body" id="asuf-results-body"></div>
  `;

  resPanel.style.visibility = 'hidden';
  document.body.appendChild(resPanel);

  // Position under the main panel

  function updateResultsPanelPosition() {
    const rect = panel.getBoundingClientRect();
    const left = Math.max(8, rect.left);
    const top = Math.min(window.innerHeight - 60, rect.bottom + 8);
    resPanel.style.left = `${left}px`;
    resPanel.style.top = `${top}px`;
    resPanel.style.width = `${Math.max(rect.width, 420)}px`;

    // Reveal results only once, after the first correct placement
    if (!__asufResultsShown) {
      resPanel.style.visibility = ''; // '' = visible
      __asufResultsShown = true;
    }
  }


  // Show/hide results panel depending on display mode
  function updateResultsPanelVisibility() {
    const visible = (getDisplayMode() === 'onapp');
    resPanel.style.display = visible ? '' : 'none';
  }

  updateResultsPanelVisibility();
  applyCollapsed(getCollapsed());

  // Position & visibility
  const pos = getPos(); panel.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
  if (!getVisible()) panel.style.display = 'none';

  // ensure correct first placement even before any drag
  requestAnimationFrame(() => {
    updateResultsPanelPosition(); // 1) imediat după primul frame
    requestAnimationFrame(updateResultsPanelPosition); // 2) încă un frame, după ce transform-ul e “committed”
    setTimeout(updateResultsPanelPosition, 60); // 3) safety net (fonturi/imagini/TTFB)
  });

  window.addEventListener('load', updateResultsPanelPosition);


  // Dragging
  let dragging=false, dragStart={x:0,y:0}, panelStart={x:pos.x,y:pos.y};
  const getTranslate = () => {
    const m = /translate\(([-\d.]+)px,\s*([-\d.]+)px\)/.exec(panel.style.transform||'');
    return m ? {x:parseFloat(m[1]), y:parseFloat(m[2])}:{x:0,y:0};
  };
  header.addEventListener('pointerdown', e=>{
    if (e.button && e.button!==0) return;
    // ⬇️ NU iniția drag dacă s-a apăsat pe butonul X (sau în interiorul lui)
    const isOnCloseBtn = e.target.closest && e.target.closest('#asuf-hide');
    if (isOnCloseBtn) return;
    dragging=true; header.setPointerCapture(e.pointerId);
    dragStart={x:e.clientX,y:e.clientY}; panelStart=getTranslate(); panel.style.transition='none';
  });
  window.addEventListener('pointermove', e=>{
    if(!dragging) return;
    const nx = Math.max(0, Math.min(panelStart.x + (e.clientX-dragStart.x), window.innerWidth - panel.getBoundingClientRect().width));
    const ny = Math.max(0, Math.min(panelStart.y + (e.clientY-dragStart.y), window.innerHeight - panel.getBoundingClientRect().height));
    panel.style.transform = `translate(${nx}px, ${ny}px)`;
    updateResultsPanelPosition();
  });
  window.addEventListener('pointerup', e=>{
    if(!dragging) return; dragging=false; try{header.releasePointerCapture(e.pointerId);}catch{}
    panel.style.transition=''; const t=getTranslate(); setPos({x:t.x,y:t.y});
    updateResultsPanelPosition();
  });

  // Hide & menu toggle
  document.getElementById('asuf-hide').addEventListener('click', ()=>{
    const next = !getCollapsed();
    setCollapsed(next);
    applyCollapsed(next);
  });

  header.addEventListener('dblclick', ()=>{
    const next = !getCollapsed();
    setCollapsed(next);
    applyCollapsed(next);
  });


  GM_registerMenuCommand('Toggle Advanced Search User Filter', ()=>{
    const hidden = panel.style.display==='none';
    panel.style.display = hidden ? '' : 'none';
    setVisible(hidden);
  });
  panel.addEventListener('mousedown', ()=> panel.style.zIndex = String(1000000 + (Date.now()%100000)));

  // API keys UI
  const apiKeyInput = document.getElementById('asuf-apikey');
  const toggleBtn = document.getElementById('asuf-togglekey');
  const saveBtn = document.getElementById('asuf-savekey');
  const savedRaw = localStorage.getItem(LS_APIKEY)||'';
  if (savedRaw) apiKeyInput.value = savedRaw;

  toggleBtn.addEventListener('click', ()=>{
    if (apiKeyInput.type === 'password') {
      apiKeyInput.type = 'text';
      toggleBtn.textContent = 'Hide';
    } else {
      apiKeyInput.type = 'password';
      toggleBtn.textContent = 'Show';
    }
  });
  saveBtn.addEventListener('click', ()=>{
    const raw = apiKeyInput.value.trim();
    if (!raw) { alert('Please enter at least one API key.'); return; }
    localStorage.setItem(LS_APIKEY, raw);
    alert('API key(s) saved to localStorage.');
  });

  // Mode toggle (persist)
  const rCompany = document.getElementById('asuf-mode-company');
  const rFaction = document.getElementById('asuf-mode-faction');
  function getMode() {
    const saved = localStorage.getItem(LS_MODE);
    return (saved==='faction') ? 'faction' : 'company';
  }
  function setModeUI(mode) {
    rCompany.checked = (mode==='company');
    rFaction.checked = (mode==='faction');
  }
  setModeUI(getMode());
  // After setModeUI(getMode());
  const rDispOnPage = document.getElementById('asuf-display-onpage');
  const rDispOnApp = document.getElementById('asuf-display-onapp');
  function setDisplayUI(disp) {
    rDispOnPage.checked = (disp === 'onpage');
    rDispOnApp.checked = (disp === 'onapp');
  }
  setDisplayUI(getDisplayMode());
  [rDispOnPage, rDispOnApp].forEach(r=>{
    r.addEventListener('change', ()=>{
      const val = rDispOnApp.checked ? 'onapp' : 'onpage';
      setDisplayMode(val);
      updateResultsPanelVisibility(); // show/hide results panel
    });
  });

  [rCompany, rFaction].forEach(r=>{
    r.addEventListener('change', ()=>{
      const val = rFaction.checked ? 'faction' : 'company';
      localStorage.setItem(LS_MODE, val);
    });
  });

  // Status helpers
  const statusEl = document.getElementById('asuf-status');
  const setStatus = t => statusEl.textContent = t;

  // ---------- Utilities ----------
  // safe text

  function getPageType() {
    const url = location.href;

    // Advanced Search (your current page)
    if (url.includes('/page.php?sid=UserList')) return 'advanced';

    // Company page (joblist)
    if (location.pathname === '/joblist.php') return 'company_page';

    // Faction profile members list
    if (url.includes('/factions.php') && url.includes('step=profile') && url.includes('ID=')) return 'faction_page';

    return 'unknown';
  }

  const safe = v => (v === null || v === undefined || v === '' ? '—' : String(v));

  // wrap with color class (if any)
  function wrapMetric(val, cls) {
    const inner = `<b>${safe(val)}</b>`;
    return cls ? `<span class="asuf-metric ${cls}">${inner}</span>` : inner;
  }

  /* ---------- COMPANY color rules ----------
     JP (jobpointsused):
       <1000 red | 1000-4999 orange | 5000-14999 yellow | >=15000 green
     CS (current streak):
       <10 green, else default (no color)
     BS (best streak):
       >75 green, else default (no color)
  */
  function clsJP(jp) {
    if (jp == null) return '';
    const n = Number(jp);
    if (n < 1000) return 'asuf-red';
    if (n < 5000) return 'asuf-orange';
    if (n < 15000) return 'asuf-yellow';
    return 'asuf-green';
  }
  function clsCS(cs) {
    if (cs == null) return '';
    return Number(cs) < 10 ? 'asuf-green' : '';
  }
  function clsBS(bs) {
    if (bs == null) return '';
    return Number(bs) > 75 ? 'asuf-green' : '';
  }

  /* ---------- FACTION color rules ----------
     Playtime (seconds → mins):
       < 15m red | 15–30m orange | 30–60m yellow | >60m green
     Ranked war hits:
       >75 green | 25–75 yellow | 1–24 orange | 0 default
     (Assumption for 0–24=orange so all ranges are covered.)
  */
  function clsPlayFromSeconds(sec) {
    if (sec == null) return '';
    const mins = Number(sec) / 60;
    if (mins < 15) return 'asuf-red';
    if (mins < 30) return 'asuf-orange';
    if (mins < 60) return 'asuf-yellow';
    return 'asuf-green';
  }
  function clsRWHits(n) {
    if (n == null) return '';
    const x = Number(n);
    if (x > 75) return 'asuf-green';
    if (x >= 25 && x <= 75) return 'asuf-yellow';
    if (x > 0 && x < 25) return 'asuf-orange';
    return '';
  }


  function computeQueueDelayByKeys(keyCount) {
    if (keyCount >= 5) return 200;
    if (keyCount === 4) return 250;
    if (keyCount === 3) return 350;
    if (keyCount === 2) return 500;
    return 1000; // 0 sau 1 cheie
  }

  function getCollapsed() {
    return GM_GetOrDefault(COLLAPSED_KEY, false);
  }
  function setCollapsed(v) {
    GM_setValue(COLLAPSED_KEY, !!v);
  }
  function applyCollapsed(collapsed) {
    const bodyEl = document.querySelector('.asuf-body');
    const btn = document.getElementById('asuf-hide');
    if (bodyEl) bodyEl.style.display = collapsed ? 'none' : '';
    if (btn) {
      btn.title = collapsed ? 'Show panel' : 'Hide panel';
      // Dacă vrei să schimbi și iconul, decomentează una din linii:
      // btn.textContent = collapsed ? '▾' : '✕';
      // btn.textContent = collapsed ? '⤵' : '✕';
      // sau lasă mereu '✕' dacă preferi:
      btn.textContent = '✕';
    }
    updateResultsPanelPosition();
  }

  const resBody = () => document.getElementById('asuf-results-body');

  function clearResultsPanel() {
    const b = resBody(); if (b) b.innerHTML = '';
  }

  function pushResultRow(html) {
    const b = resBody(); if (!b) return;
    const row = document.createElement('div');
    row.className = 'asuf-res-row';
    row.innerHTML = html;
    b.appendChild(row);
    b.scrollTop = b.scrollHeight;
  }



  function parseApiKeys(raw) {
    return (raw || '').split(',').map(s => s.trim()).filter(Boolean);
  }
  function createRoundRobin(keys) {
    let i = 0;
    return () => {
      const k = keys[i];
      i = (i + 1) % keys.length;
      return k;
    };
  }
function titleFromRank(rankStr) {
  if (!rankStr) return '—';
  const parts = String(rankStr).trim().split(/\s+/);
  return parts.length ? parts[parts.length - 1] : '—';
}

  // ---------- Global API queue (1 req/sec) using GM_xmlhttpRequest ----------
  const reqQueue = [];
  let reqTimerActive = false;

  let queueDelayMs = 1000; // default 1 req/sec; îl schimbăm dinamic în Faction



  function apiRequest(url) {
    return new Promise((resolve, reject) => {
      reqQueue.push({ url, resolve, reject });
      pumpQueue();
    });
  }

  function pumpQueue() {
    if (reqTimerActive) return;
    if (!reqQueue.length) return;
    reqTimerActive = true;

    const tick = () => {
      if (!reqQueue.length) { reqTimerActive = false; return; }
      const job = reqQueue.shift();
      GM_xmlhttpRequest({
        method: 'GET',
        url: job.url,
        headers: { 'Accept': 'application/json' },
        timeout: 20000,
        onload: (resp) => {
          try {
            const json = JSON.parse(resp.responseText);
            if (resp.status !== 200 || json?.error) {
              const code = json?.error?.code ?? resp.status;
              const msg = json?.error?.error ?? 'API error';
              job.reject(new Error(`API error ${code}: ${msg}`));
            } else {
              job.resolve(json);
            }
          } catch {
            job.reject(new Error('Invalid JSON from API'));
          }
        },
        onerror: () => job.reject(new Error('Network error')),
        ontimeout: () => job.reject(new Error('Request timeout')),
      });

      // schedule next after the current queueDelayMs
      setTimeout(() => {
        if (reqQueue.length) tick(); else reqTimerActive = false;
      }, queueDelayMs);

    };

    tick();
  }

  const sleep = ms => new Promise(r=>setTimeout(r,ms));

  // ---------- Page parsing ----------
  function collectUsersFromDOM() {
    const url = location.href;

    // helper: normalize rezultat {id, name, node, li}
    const makeItem = (id, name, node) => ({ id, name, node, li: node });

    // A) Advanced Search (pagina ta originală)
    if (url.includes('/page.php?sid=UserList')) {
      const wrap = document.querySelector('ul.user-info-list-wrap.bottom-round.cont-gray');
      if (!wrap) return [];
      const lis = Array.from(wrap.querySelectorAll(':scope > li'));
      const users = [];
      for (const li of lis) {
        const a = li.querySelector('a.user.name[href*="/profiles.php?XID="]');
        if (!a) continue;
        const href = a.getAttribute('href') || '';
        const m = /XID=(\d+)/.exec(href);
        if (!m) continue;
        const id = m[1];
        const title = a.getAttribute('title') || a.textContent.trim() || `User ${id}`;
        const name = title.replace(/\s*\[\d+\]\s*$/, '').trim();
        users.push(makeItem(id, name, li));
      }
      return users;
    }

    // B) Company page (/joblist.php)
    if (location.pathname === '/joblist.php') {
      const blocks = Array.from(document.querySelectorAll('.employees-list > li > ul.item.icons'));
      return blocks.map(block => {
        const a = block.querySelector('a.user.name[href*="/profiles.php?XID="]');
        if (!a) return null;
        const href = a.getAttribute('href') || '';
        const m = /XID=(\d+)/.exec(href);
        if (!m) return null;
        const id = m[1];
        const title = a.getAttribute('title') || a.textContent.trim() || `User ${id}`;
        const name = title.replace(/\s*\[\d+\]\s*$/, '').trim();
        return makeItem(id, name, block);
      }).filter(Boolean);
    }

    // C) Faction profile members (/factions.php?step=profile&ID=*)
    if (url.includes('/factions.php') && url.includes('step=profile') && url.includes('ID=')) {
      const rows = Array.from(document.querySelectorAll('.f-war-list.members-list .table-body .table-row'));
      return rows.map(row => {
        const a = row.querySelector('a[href*="/profiles.php?XID="]');
        if (!a) return null;
        const href = a.getAttribute('href') || '';
        const m = /XID=(\d+)/.exec(href);
        if (!m) return null;
        const id = m[1];

        // name din honor-text sau fallback pe textul linkului
        let name = '';
        const honor = row.querySelector('.honor-text') || row.querySelector('.honor-text-svg');
        if (honor && honor.textContent.trim()) name = honor.textContent.trim();
        if (!name) name = (a.textContent || '').trim();

        return makeItem(id, name, row);
      }).filter(Boolean);
    }

    return [];
  }


  // ---------- Inline annotation containers ----------
  function ensureAnnotContainer(node) {
    const url = location.href;

    // Advanced Search: sub <li> direct
    if (url.includes('/page.php?sid=UserList')) {
      let box = node.querySelector('.asuf-annot');
      if (!box) {
        box = document.createElement('div');
        box.className = 'asuf-annot';
        box.style.marginTop = '4px';
        box.style.fontSize = '12px';
        box.style.opacity = '0.9';
        node.appendChild(box);
      }
      return box;
    }

    // Company: sub blocul <ul.item.icons>
    if (location.pathname === '/joblist.php') {
      let box = node.querySelector('.asuf-annot');
      if (!box) {
        box = document.createElement('div');
        box.className = 'asuf-annot';
        box.style.marginTop = '4px';
        box.style.fontSize = '12px';
        box.style.opacity = '0.9';
        node.appendChild(box);
      }
      return box;
    }

    // Faction: în prima celulă "member"
    if (url.includes('/factions.php') && url.includes('step=profile') && url.includes('ID=')) {
      const memberCell = node.querySelector('.table-cell.member') || node.firstElementChild || node;
      let box = memberCell.querySelector('.asuf-annot');
      if (!box) {
        box = document.createElement('div');
        box.className = 'asuf-annot';
        box.style.marginTop = '4px';
        box.style.fontSize = '12px';
        box.style.opacity = '0.9';
        memberCell.appendChild(box);
      }
      return box;
    }

    // fallback
    let box = node.querySelector('.asuf-annot');
    if (!box) {
      box = document.createElement('div');
      box.className = 'asuf-annot';
      node.appendChild(box);
    }
    return box;
  }


  function renderError(li, message) {
    const box = ensureAnnotContainer(li);
    box.innerHTML = `<span style="color:#ffb3b3;">Error: ${message}</span>`;
    li.setAttribute('data-asuf-annotated', '1');
  }

  // ---------- Formatting helpers ----------
  function fmtHM(sec) {
    if (sec == null) return '—';
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    return `${h}h ${m}m`;
  }
  function utcMidnightNDaysAgo(n = 0) {
    const d = new Date();
    d.setUTCHours(0,0,0,0);
    d.setUTCDate(d.getUTCDate() - n);
    return Math.floor(d.getTime() / 1000);
  }
  function relFromTimestamp(ts) {
    const now = Math.floor(Date.now() / 1000);
    let diff = Math.max(0, now - Number(ts || 0));
    const days = Math.floor(diff / 86400); diff %= 86400;
    const hours = Math.floor(diff / 3600); diff %= 3600;
    const mins = Math.floor(diff / 60);
    if (days > 0) return `${days} days ago`;
    if (hours > 0) return `${hours}h ${mins}m ago`;
    return `${mins}m ago`;
  }

  // ---------- COMPANY mode: extract + render ----------
  function extractCompanyFields(api) {
    // Job points used (JP) from personalstats
    const jobpointsused = (api?.personalstats && Object.prototype.hasOwnProperty.call(api.personalstats, 'jobpointsused'))
      ? api.personalstats.jobpointsused
      : null;

    // activity streaks from personalstats (0 is valid)
    const hasCur = api?.personalstats && Object.prototype.hasOwnProperty.call(api.personalstats, 'activestreak');
    const hasBest = api?.personalstats && Object.prototype.hasOwnProperty.call(api.personalstats, 'bestactivestreak');
    const currentActivityStreak = hasCur ? api.personalstats.activestreak : null;
    const bestActivityStreak = hasBest ? api.personalstats.bestactivestreak : null;

    const xanaxTaken = (api?.personalstats && Object.prototype.hasOwnProperty.call(api.personalstats, 'xantaken'))
      ? api.personalstats.xantaken
      : (api?.personalstats?.xanaxused ?? null);

    const lastActiveRelative =
      api?.last_action?.relative ??
      (api?.last_action?.timestamp ? relFromTimestamp(api.last_action.timestamp) : null);

    return {
      jobpointsused, // JP
      currentActivityStreak, // CS
      bestActivityStreak, // BS
      xanaxTaken, // Xan
      lastActiveRelative, // Last
    };
  }


  function renderCompanyAnnot(li, payload) {
    const box = ensureAnnotContainer(li);
    const jpHTML  = wrapMetric(payload.jobpointsused,        clsJP(payload.jobpointsused));
    const csHTML  = wrapMetric(payload.currentActivityStreak, clsCS(payload.currentActivityStreak)) + 'd';
    const bsHTML  = wrapMetric(payload.bestActivityStreak,    clsBS(payload.bestActivityStreak)) + 'd';
    const xanHTML = wrapMetric(payload.xanaxTaken, '');
    const lastHTML= wrapMetric(payload.lastActiveRelative, '');

    box.innerHTML =
      `JP: ${jpHTML} | ` +
      `CS: ${csHTML} | ` +
      `BS: ${bsHTML} | ` +
      `Xan: ${xanHTML} | ` +
      `Last: ${lastHTML}`;

    li.setAttribute('data-asuf-annotated', '1');
  }


  function renderCompanyOnApp(user, payload) {
    const jpHTML  = wrapMetric(payload.jobpointsused,        clsJP(payload.jobpointsused));
    const csHTML  = wrapMetric(payload.currentActivityStreak, clsCS(payload.currentActivityStreak)) + 'd';
    const bsHTML  = wrapMetric(payload.bestActivityStreak,    clsBS(payload.bestActivityStreak)) + 'd';
    const xanHTML = wrapMetric(payload.xanaxTaken, '');
    const lastHTML= wrapMetric(payload.lastActiveRelative, '');

    const line =
      `<span class="asuf-res-name"><a target="_blank" href="https://www.torn.com/profiles.php?XID=${user.id}">${user.name} [${user.id}]</a></span> — ` +
      `JP: ${jpHTML} | ` +
      `CS: ${csHTML} | ` +
      `BS: ${bsHTML} | ` +
      `Xan: ${xanHTML} | ` +
      `Last: ${lastHTML}`;

    pushResultRow(line);
  }



  function renderErrorOnApp(user, message) {
    pushResultRow(
      `<span class="asuf-res-name"><a target="_blank" href="https://www.torn.com/profiles.php?XID=${user.id}">${user.name} [${user.id}]</a></span> — ` +
      `<span style="color:#ffb3b3;">Error: ${message}</span>`
    );
  }


  // ---------- FACTION mode: fetchers (v2 public for networth + timeplayed) ----------
  async function fetchUserCore(userId, nextKey) {
    const url = `https://api.torn.com/user/${userId}?selections=profile,personalstats&key=${encodeURIComponent(nextKey())}`;
    return await apiRequest(url);
  }
  // v2 public: networth for any player
// v2 public (no timestamp): returns both networth and timeplayed (up to yesterday)
async function fetchUserNowStats(userId, nextKey) {
  const url = `https://api.torn.com/v2/user/${userId}/personalstats?stat=networth,timeplayed&key=${encodeURIComponent(nextKey())}`;
  const json = await apiRequest(url);

  let networth = null;
  let timeplayedNow = null; // cumulative up to yesterday (the "now" baseline we need)

  const arr = json?.personalstats;
  if (Array.isArray(arr)) {
    for (const e of arr) {
      if (!e || typeof e !== 'object') continue;
      if (e.name === 'networth' && typeof e.value === 'number') networth = e.value;
      if (e.name === 'timeplayed' && typeof e.value === 'number') timeplayedNow = e.value;
    }
  } else if (json?.personalstats) {
    // Object-shaped fallback
    const vNW = json.personalstats.networth;
    const vTP = json.personalstats.timeplayed;
    if (typeof vNW === 'number') networth = vNW;
    if (typeof vTP === 'number') timeplayedNow = vTP;
  }

  return { networth, timeplayedNow };
}

  // v2 public: timeplayed snapshot at a given timestamp (seconds)
async function fetchUserTimePlayedAt(userId, epoch, nextKey) {
  const url = `https://api.torn.com/v2/user/${userId}/personalstats?stat=timeplayed&timestamp=${epoch}&key=${encodeURIComponent(nextKey())}`;
  const json = await apiRequest(url);
  const arr = json?.personalstats;
  if (Array.isArray(arr) && arr.length) {
    const entry = arr.find(e => e?.name === 'timeplayed') || arr[0];
    const val = entry?.value;
    return (typeof val === 'number') ? val : null;
  }
  const valObj = json?.personalstats?.timeplayed;
  return (typeof valObj === 'number') ? valObj : null;
}


  // Compute Played using two snapshots: D-2 and D-4 (baseline 'timeplayedNow' is "up to yesterday")
  async function computePlayedSummary(userId, nextKey, timeplayedNow) {
    if (timeplayedNow == null) return { avg3: null, yesterday: null };

    const tsD2 = utcMidnightNDaysAgo(2);
    const tsD4 = utcMidnightNDaysAgo(4);

    const [d2Val, d4Val] = await Promise.all([
      fetchUserTimePlayedAt(userId, tsD2, nextKey),
      fetchUserTimePlayedAt(userId, tsD4, nextKey),
    ]);

    const cleanDiff = (a, b) => (a != null && b != null) ? Math.max(0, a - b) : null;

    // Yesterday = delta between "now baseline" (yesterday) and D-2
    const yesterdaySec = cleanDiff(timeplayedNow, d2Val);

    // Last 3 days avg = (now - D-4) / 3
    const last3Sum = cleanDiff(timeplayedNow, d4Val);
    const avg3Sec = (last3Sum != null) ? Math.floor(last3Sum / 3) : null;

    return { avg3: avg3Sec, yesterday: yesterdaySec };
  }

  function renderFactionAnnot(li, data) {
    const box = ensureAnnotContainer(li);

    const title = safe(data.title);
    const rwCls = clsRWHits(data.rankedWarHits);
    const rwHTML = wrapMetric(data.rankedWarHits, rwCls);

    const played3 = data.played && data.played.avg3 != null ? fmtHM(data.played.avg3) : '—';
    const playedY = data.played && data.played.yesterday != null ? fmtHM(data.played.yesterday) : '—';
    const p3Cls = clsPlayFromSeconds(data.played?.avg3);
    const pyCls = clsPlayFromSeconds(data.played?.yesterday);
    const p3HTML = wrapMetric(played3, p3Cls);
    const pyHTML = wrapMetric(playedY, pyCls);

    const xanHTML = wrapMetric(data.xanax, '');
    const nwHTML  = (data.networth != null) ? wrapMetric(`$${Number(data.networth).toLocaleString()}`, '') : wrapMetric('—', '');

    box.innerHTML =
      `Title: <b>${title}</b> | ` +
      `Ranked war hits: ${rwHTML} | ` +
      `Played: 3d avg ${p3HTML}, yesterday ${pyHTML} | ` +
      `Xanax: ${xanHTML} | ` +
      `NW: ${nwHTML}`;

    li.setAttribute('data-asuf-annotated', '1');
  }


  function renderFactionOnApp(user, data) {
    const title = safe(data.title);
    const rwCls = clsRWHits(data.rankedWarHits);
    const rwHTML = wrapMetric(data.rankedWarHits, rwCls);

    const played3 = data.played && data.played.avg3 != null ? fmtHM(data.played.avg3) : '—';
    const playedY = data.played && data.played.yesterday != null ? fmtHM(data.played.yesterday) : '—';
    const p3Cls = clsPlayFromSeconds(data.played?.avg3);
    const pyCls = clsPlayFromSeconds(data.played?.yesterday);
    const p3HTML = wrapMetric(played3, p3Cls);
    const pyHTML = wrapMetric(playedY, pyCls);

    const xanHTML = wrapMetric(data.xanax, '');
    const nwHTML  = (data.networth != null) ? wrapMetric(`$${Number(data.networth).toLocaleString()}`, '') : wrapMetric('—', '');

    const line =
      `<span class="asuf-res-name"><a target="_blank" href="https://www.torn.com/profiles.php?XID=${user.id}">${user.name} [${user.id}]</a></span> — ` +
      `Title: <b>${title}</b> | ` +
      `Ranked war hits: ${rwHTML} | ` +
      `Played: 3d avg ${p3HTML}, yesterday ${pyHTML} | ` +
      `Xanax: ${xanHTML} | ` +
      `NW: ${nwHTML}`;

    pushResultRow(line);
  }



  // ---------- Orchestration ----------
  let cancelFlag = false;

  async function run() {
    const raw = (localStorage.getItem(LS_APIKEY) || '').trim();
    const keys = parseApiKeys(raw);
    if (!keys.length) { alert('Please save at least one Torn API key.'); return; }
    const nextKey = createRoundRobin(keys);

    const users = collectUsersFromDOM();
    if (!users.length) { setStatus('No users found.'); return; }

    const mode = getMode();
    const display = getDisplayMode();

    // Prepare UI
    setStatus(`Fetching ${users.length} users in ${mode} mode with ${keys.length} key(s)…`);
    const runBtn = document.getElementById('asuf-run');
    const cancelBtn = document.getElementById('asuf-cancel');
    if (runBtn) runBtn.disabled = true;
    if (cancelBtn) cancelBtn.disabled = false;
    cancelFlag = false;

    // Display panel prep (OnApp)
    updateResultsPanelVisibility();
    if (display === 'onapp') clearResultsPanel();

    // Speed up the global queue based on number of keys
    const prevDelay = queueDelayMs;
    queueDelayMs = computeQueueDelayByKeys(keys.length);

    let done = 0;
    try {
      for (const user of users) {
        if (cancelFlag) break;

        try {
          if (mode === 'company') {
            // v1: basic+profile+personalstats (Age, streaks, Xanax, last active)
            const url = `https://api.torn.com/user/${user.id}?selections=basic,profile,personalstats&key=${encodeURIComponent(nextKey())}`;
            const core = await apiRequest(url);
            const payload = extractCompanyFields(core);

            if (display === 'onapp') {
              renderCompanyOnApp(user, payload);
            } else {
              renderCompanyAnnot(user.li, payload);
            }

          } else {
            // Faction:
            // v1 core (rank → title, rankedwarhits, xantaken)
            const core = await fetchUserCore(user.id, nextKey);
            const rankStr = core?.rank || core?.profile?.rank || '';
            const title = titleFromRank(rankStr);
            const rankedWarHits = core?.personalstats?.rankedwarhits ?? 0;
            const xanax = core?.personalstats?.xantaken ?? 0;

            // v2 combo: networth + timeplayed (baseline up to yesterday)
            const { networth, timeplayedNow } = await fetchUserNowStats(user.id, nextKey);

            // v2 timeplayed snapshots: compute yesterday / 3d avg / 7d avg
            const played = await computePlayedSummary(user.id, nextKey, timeplayedNow);

            const data = { title, rankedWarHits, played, xanax, networth };

            if (display === 'onapp') {
              renderFactionOnApp(user, data);
            } else {
              renderFactionAnnot(user.li, data);
            }
          }

          setStatus(`OK: ${user.name} [${user.id}]`);
        } catch (e) {
          if (display === 'onapp') {
            renderErrorOnApp(user, e.message || 'Unknown error');
          } else {
            renderError(user.li, e.message || 'Unknown error');
          }
          setStatus(`Error on ${user.name} [${user.id}]`);
        }

        done++;
        // No manual delay here — apiRequest() is paced by the global queue using queueDelayMs.
      }
    } finally {
      // Restore the previous queue speed
      queueDelayMs = prevDelay;
    }

    if (runBtn) runBtn.disabled = false;
    if (cancelBtn) cancelBtn.disabled = true;
    cancelFlag = false;
    setStatus(`Done. Completed ${done}/${users.length}.`);
  }


  // Buttons
  document.getElementById('asuf-run').addEventListener('click', run);
  document.getElementById('asuf-cancel').addEventListener('click', ()=>{
    cancelFlag = true;
    document.getElementById('asuf-cancel').disabled = true;
    setStatus('Cancelling…');
  });

  window.addEventListener('resize', updateResultsPanelPosition);

  // Keyboard toggle for panel
  window.addEventListener('keydown', (e)=>{
    if (e.ctrlKey && e.shiftKey && (e.key==='P' || e.key==='p')){
      const hidden = panel.style.display==='none';
      panel.style.display = hidden ? '' : 'none';
      setVisible(hidden);
    }
  });

  console.info('Advanced Search User Filter — Company/Faction inline annotate, multi-key round-robin, 1 req/sec queue, v2 NetWorth + TimePlayed averages.');
})();
