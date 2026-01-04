// ==UserScript==
// @name         RandomMan1 ItemMarket Updater
// @namespace    torn-itemmarket-sheet
// @author       SuperGogu[3580072]
// @version      1.2.3
// @description  Fetch RandomMan1 item market and push to Google Sheet via a GAS WebApp. Floating, hideable settings panel. Batching + retry.
// @match        https://www.torn.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_addValueChangeListener
// @connect      api.torn.com
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552463/RandomMan1%20ItemMarket%20Updater.user.js
// @updateURL https://update.greasyfork.org/scripts/552463/RandomMan1%20ItemMarket%20Updater.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // =======================
  // CONFIG
  // =======================
  const GAS_URL = 'https://script.google.com/macros/s/AKfycbyiiQukX6W8qZ84Fasm6o2T_zfmaI5IVabDWtJ7ypYrgSKIto-3oEhSIs3MN4JJIDq1/exec'; 
  const TIMER_SECONDS = 300; //CHANGE THIS IN SECONDS (NOW ITS 5 MINUTES)

  // Shared keys across tabs (Tampermonkey storage)
  const K_API     = 'rim_api_key';     // string
  const K_POS     = 'rim_panel_pos';   // {left, top}
  const K_RUN     = 'rim_running';     // '1' | '0'
  const K_STATE   = 'rim_state';       // JSON string: { leaderId, ts, running }
  const HEARTBEAT_MS = 3000;           // leader heartbeat period
  const STALE_MS     = 12000;          // if last heartbeat older than this -> takeover
  const K_UPDATE_LOCK = 'rim_update_lock';   // { holderId, ts }
  const LOCK_TTL_MS   = 90_000;              // lock valid 90s


  if (!window.name) window.name = 'rim_' + Math.random().toString(36).slice(2);
  const TAB_ID = window.name;

  // =======================
  // UI
  // =======================
  GM_addStyle(`
    .rim-wrap{
      position:fixed; right:16px; bottom:16px; z-index:999999;
      background:#2b2b2b; color:#fff; border:2px solid #fff; border-radius:14px;
      box-shadow:0 8px 24px rgba(0,0,0,.35);
      font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Arial,sans-serif;
      width:300px; padding:12px; display:flex; flex-direction:column; gap:10px;
    }
    .rim-title{ font-weight:700; font-size:14px; opacity:.95; cursor:move; user-select:none }
    .rim-row{ display:flex; gap:8px; align-items:center }
    .rim-input{
      flex:1; padding:8px 10px; border-radius:10px; border:1px solid #fff; background:#1f1f1f; color:#fff;
    }
    .rim-btn{
      padding:8px 12px; border-radius:10px; border:1px solid #fff; background:transparent; color:#fff; cursor:pointer; font-weight:600;
    }
    .rim-btn:hover{ background:rgba(255,255,255,.08) }
    .rim-status{ min-height:18px; font-size:12px; opacity:.90 }
    .rim-controls{ display:flex; gap:8px; align-items:center; justify-content:space-between; }
    .rim-timer{ font-variant-numeric:tabular-nums; font-weight:700; }
    .rim-right{ display:flex; gap:8px; }
    .rim-dragging{ opacity:.95; }
    .rim-badge{ font-size:11px; opacity:.8; }
  `);

  if (document.getElementById('rim-panel')) return;

  const panel = document.createElement('div');
  panel.className = 'rim-wrap';
  panel.id = 'rim-panel';
  panel.innerHTML = `
    <div class="rim-title" id="rim-handle">RandomMan1 Settings <span id="rim-role" class="rim-badge"></span></div>
    <div class="rim-row">
      <input id="rim-api" class="rim-input" type="password" placeholder="Enter Torn API-KEY..." />
      <button id="rim-save" class="rim-btn" title="Save API-KEY">Save</button>
      <button id="rim-eye" class="rim-btn" title="Show/Hide API-KEY">Show</button>
    </div>
    <div class="rim-controls">
      <div>
        <div class="rim-timer" id="rim-timer">Updating shop in ${TIMER_SECONDS} sec</div>
        <div class="rim-badge" id="rim-using">GAS: ${GAS_URL ? 'configured' : 'missing'}</div>
      </div>
      <div class="rim-right">
        <button id="rim-toggle" class="rim-btn">Start</button>
        <button id="rim-close" class="rim-btn" title="Hide panel">Hide</button>
      </div>
    </div>
    <div id="rim-status" class="rim-status">Ready.</div>
  `;
  document.body.appendChild(panel);

  const $ = (sel) => panel.querySelector(sel);
  const elHandle = $('#rim-handle');
  const elRole   = $('#rim-role');
  const elApi    = $('#rim-api');
  const elSave   = $('#rim-save');
  const elEye    = $('#rim-eye');
  const elToggle = $('#rim-toggle');
  const elClose  = $('#rim-close');
  const elTimer  = $('#rim-timer');
  const elStatus = $('#rim-status');

  // Load API key
  try {
    const gmVal = typeof GM_getValue === 'function' ? GM_getValue(K_API, '') : '';
    const lsVal = localStorage.getItem(K_API) || '';
    const apiVal = lsVal || gmVal || '';
    if (apiVal) elApi.value = apiVal;
  } catch(e){ console.warn('[RIM] read API key error:', e); }

  // Load position
  try {
    const raw = localStorage.getItem(K_POS);
    if (raw) {
      const pos = JSON.parse(raw);
      if (pos && typeof pos.left === 'number' && typeof pos.top === 'number') {
        panel.style.left = pos.left + 'px';
        panel.style.top  = pos.top + 'px';
        panel.style.right = 'auto';
        panel.style.bottom = 'auto';
      }
    }
  } catch(e){}

  // Load running state
  let running = (localStorage.getItem(K_RUN) === '1');

  // Timer bookkeeping (only runs on leader)
  let remaining = TIMER_SECONDS;
  let secondTickId = null;
  let heartbeatId  = null;
  let inFlight = false; 

    function readLock() {
      try {
        const s = GM_getValue(K_UPDATE_LOCK, '');
        return s ? JSON.parse(s) : null;
      } catch { return null; }
    }

    function writeLock(obj) {
      try { GM_setValue(K_UPDATE_LOCK, JSON.stringify(obj)); } catch {}
    }

    function lockIsStale(lock) {
      return !lock || (Date.now() - (lock.ts || 0)) > LOCK_TTL_MS;
    }

    function acquireLock() {
      const nowTs = Date.now();
      const lock = readLock();
      if (lockIsStale(lock)) {
        writeLock({ holderId: TAB_ID, ts: nowTs });
        const check = readLock();
        return !!(check && check.holderId === TAB_ID);
      }
      return false;
    }

    function releaseLock() {
      const lock = readLock();
      if (lock && lock.holderId === TAB_ID) {
        writeLock({ holderId: '', ts: 0 });
      }
    }

  function readState() {
    try {
      const s = GM_getValue(K_STATE, '');
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  }
  function writeState(obj) {
    try { GM_setValue(K_STATE, JSON.stringify(obj)); } catch {}
  }

  function setStatus(msg){ elStatus.textContent = msg || ''; }
  function setTimerLabel(){ elTimer.textContent = `Updating shop in ${remaining} sec`; }
  function setRunningState(on){
    running = !!on;
    localStorage.setItem(K_RUN, running ? '1' : '0');
    elToggle.textContent = running ? 'Stop' : 'Start';
    setStatus(running ? 'Running' : 'Stopped');
  }
  function setRoleBadge(isLeader){
    elRole.textContent = isLeader ? '(Leader)' : '(Follower)';
  }
  function persistPosition(){
    const rect = panel.getBoundingClientRect();
    const pos = { left: Math.round(rect.left), top: Math.round(rect.top) };
    try { localStorage.setItem(K_POS, JSON.stringify(pos)); } catch(e){}
  }

  let dragging = false, startX=0, startY=0, startLeft=0, startTop=0;
  function ensureTopLeft(){
    const rect = panel.getBoundingClientRect();
    panel.style.left = rect.left + 'px';
    panel.style.top  = rect.top + 'px';
    panel.style.right = 'auto';
    panel.style.bottom = 'auto';
  }
  function onPointerDown(e){
    if (e.target.closest('button, input, a')) return;
    dragging = true;
    panel.classList.add('rim-dragging');
    ensureTopLeft();
    const r = panel.getBoundingClientRect();
    startLeft = r.left; startTop = r.top;
    startX = e.clientX; startY = e.clientY;
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  }
  function onPointerMove(e){
    if (!dragging) return;
    let newLeft = startLeft + (e.clientX - startX);
    let newTop  = startTop  + (e.clientY - startY);
    const maxLeft = window.innerWidth - panel.offsetWidth;
    const maxTop  = window.innerHeight - panel.offsetHeight;
    newLeft = Math.max(0, Math.min(maxLeft, newLeft));
    newTop  = Math.max(0, Math.min(maxTop, newTop));
    panel.style.left = newLeft + 'px';
    panel.style.top  = newTop + 'px';
  }
  function onPointerUp(){
    dragging = false;
    panel.classList.remove('rim-dragging');
    persistPosition();
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
  }
  elHandle.addEventListener('pointerdown', onPointerDown);

  function httpGetJSON(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        headers: { 'accept': 'application/json' },
        onload: (res) => {
          try {
            if (res.status < 200 || res.status >= 300) return reject(new Error(`HTTP ${res.status}`));
            resolve(JSON.parse(res.responseText || '{}'));
          } catch(e){ reject(e); }
        },
        onerror: () => reject(new Error('Network error')),
        ontimeout: () => reject(new Error('Timeout')),
      });
    });
  }
  function httpPostJSON(url, payload) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'POST',
        url,
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify(payload),
        onload: (res) => {
          if (res.status >= 200 && res.status < 300) resolve(res.responseText);
          else reject(new Error(`HTTP ${res.status}`));
        },
        onerror: () => reject(new Error('Network error')),
        ontimeout: () => reject(new Error('Timeout')),
      });
    });
  }

    function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

    function withQueryParam(url, name, value) {
        try {
            const u = new URL(url);
            u.searchParams.set(name, value);
            return u.toString();
        } catch {
            const urlNoKey = url.replace(/([?&])key=[^&]*/i, '$1').replace(/[?&]$/, '');
            const sep = urlNoKey.includes('?') ? '&' : '?';
            return `${urlNoKey}${sep}key=${encodeURIComponent(value)}`;
        }
    }

    async function fetchAllItemMarket(apiKey) {
        const out = [];
        let url = `https://api.torn.com/v2/user/itemmarket?offset=0&limit=60&key=${encodeURIComponent(apiKey)}`;
        let lastUrl = '';

        for (let hop = 0; hop < 200 && url; hop++) {
            if (url === lastUrl) break;
            lastUrl = url;

            const page = await httpGetJSON(url);
            const list = Array.isArray(page?.itemmarket) ? page.itemmarket : [];
            out.push(...list);

            let nextUrl = page?._metadata?.links?.next || null;
            if (nextUrl) nextUrl = withQueryParam(nextUrl, 'key', apiKey);
            url = nextUrl;

            await sleep(1050);
        }
        return out;
    }


  const toPercent = (v) => (v===null||v===undefined||v==='') ? '' : `${Number(v).toFixed(2)}%`;
  const bonusLabel = (b) => {
    const t = (b?.title ?? '').toString().trim();
    const v = b?.value;
    if (!t && (v===undefined||v===null||v==='')) return '';
    const vStr = (v===undefined||v===null||v==='') ? '' : ` - ${Number(v).toFixed(0)}%`;
    return `${t}${vStr}`;
  };

    function buildTablesFromArray(list) {
        const header = ['Name','Bonus','Quality','Damage','Accuracy','Price'];
        const byType = {
            Primary:   { rows: [header], keys: [], rarities: [] },
            Secondary: { rows: [header], keys: [], rarities: [] },
            Melee:     { rows: [header], keys: [], rarities: [] },
        };

        for (const row of list) {
            const item = row?.item || {};
            const type = item?.type;
            if (!byType[type]) continue;

            const name = item?.name ?? '';
            const s = item?.stats || {};
            const rarity = item?.rarity || '';
            const uid = (item?.uid != null ? String(item.uid) : `${item?.id || ''}-${row?.id || ''}`);

            let bonus = '';
            if (Array.isArray(item?.bonuses) && item.bonuses.length) {
                bonus = item.bonuses.map(b => {
                    const t = (b?.title ?? '').toString().trim();
                    const v = b?.value;
                    return t ? (v===undefined||v===null||v==='' ? t : `${t} - ${Number(v).toFixed(0)}%`) : '';
                }).filter(Boolean).join('\n');
            }

            byType[type].rows.push([
                name,
                bonus,
                (s?.quality===null||s?.quality===undefined)? '' : `${Number(s.quality).toFixed(2)}%`,
                s?.damage ?? '',
                s?.accuracy ?? '',
                row?.price ?? ''
            ]);
            byType[type].keys.push(uid);
            byType[type].rarities.push(rarity || '');
        }

        return {
            primary:   byType.Primary,
            secondary: byType.Secondary,
            melee:     byType.Melee
        };
    }

  function chunk(arr, n) {
    const out = [];
    for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
    return out;
  }


    async function processOnce() {
        const apiKey = (document.getElementById('rim-api')?.value || '').trim();
        if (!apiKey) {
            document.getElementById('rim-status').textContent = 'Missing API-KEY. Save it first.';
            return;
        }
        if (!GAS_URL) {
            document.getElementById('rim-status').textContent = 'Missing GAS_URL in script.';
            return;
        }

        try {
            document.getElementById('rim-status').textContent = 'Fetching Torn itemmarket (all pages)…';
            const list = await fetchAllItemMarket(apiKey);

            document.getElementById('rim-status').textContent = 'Building tables…';
            const t = buildTablesFromArray(list);

            console.debug('[RIM] counts', {
                primary:   Math.max((t.primary?.rows?.length || 1) - 1, 0),
                secondary: Math.max((t.secondary?.rows?.length || 1) - 1, 0),
                melee:     Math.max((t.melee?.rows?.length || 1) - 1, 0),
            });

            document.getElementById('rim-status').textContent = 'Patching Google Sheet (no blank)…';

            const sections = [
                { key: 'Primary',   data: t.primary },
                { key: 'Secondary', data: t.secondary },
                { key: 'Melee',     data: t.melee }
            ];

            for (const sec of sections) {
                const rows = (sec.data?.rows || []).slice(1);    // skip header row (A..F)
                const keys = (sec.data?.keys || []);             // hidden G (UIDs)
                const rar  = (sec.data?.rarities || []);         // rarity for backgrounds

                await httpPostJSON(GAS_URL, {
                    mode: 'patch',
                    section: sec.key,
                    rows,
                    keys,
                    rarities: rar
                });

                await sleep(1050);
            }

            document.getElementById('rim-status').textContent = 'Updated Google Sheet.';
        } catch (err) {
            console.error('[RIM] processOnce error:', err);
            document.getElementById('rim-status').textContent = 'Update failed. Check console.';
        }
    }

  function now(){ return Date.now(); }

  function tryBecomeLeader() {
    const s = readState();
    const t = now();
    if (!s || !s.leaderId || (t - (s.ts || 0)) > STALE_MS) {
      writeState({ leaderId: TAB_ID, ts: t, running });
      return true;
    }
    return s.leaderId === TAB_ID;
  }

  function isLeader() {
    const s = readState();
    return !!(s && s.leaderId === TAB_ID && (now() - (s.ts || 0)) <= STALE_MS);
  }

  function startHeartbeat() {
    stopHeartbeat();
    heartbeatId = setInterval(() => {
      if (!isLeader()) {
        stopHeartbeat();
        setRoleBadge(false);
        return;
      }
      const s = readState() || {};
      writeState({ leaderId: TAB_ID, ts: now(), running });
    }, HEARTBEAT_MS);
  }
  function stopHeartbeat() {
    if (heartbeatId) { clearInterval(heartbeatId); heartbeatId = null; }
  }

  function startSecondTick() {
    if (secondTickId) return;
    secondTickId = setInterval(() => {
      if (!isLeader()) return;
      if (!running) return;

      remaining -= 1;

      if (remaining <= 0) {
        if (inFlight) return;

        remaining = TIMER_SECONDS;
        setTimerLabel();

        inFlight = true;

        const gotLock = acquireLock();
        if (!gotLock) {
          inFlight = false;
          return;
        }

        processOnce()
          .catch(() => { /* status already handled inside */ })
          .finally(() => {
            releaseLock();
            inFlight = false;
          });

      } else {
        setTimerLabel();
      }
    }, 1000);
  }

  function stopSecondTick() {
    if (secondTickId) { clearInterval(secondTickId); secondTickId = null; }
  }

  if (typeof GM_addValueChangeListener === 'function') {
    GM_addValueChangeListener(K_STATE, (_k, _old, newVal, remote) => {
      try {
        const s = newVal ? JSON.parse(newVal) : null;
        const amLeader = s && s.leaderId === TAB_ID && (now() - (s.ts || 0)) <= STALE_MS;
        setRoleBadge(!!amLeader);

        if (typeof s?.running === 'boolean') setRunningState(s.running);

        if (!s || !s.leaderId || (now() - (s.ts || 0)) > STALE_MS) {
          if (tryBecomeLeader()) {
            setRoleBadge(true);
            startHeartbeat();
          }
        }
      } catch {}
    });
  }

  if (tryBecomeLeader()) {
    setRoleBadge(true);
    startHeartbeat();
  } else {
    setRoleBadge(false);
  }

  startSecondTick();


  elSave.addEventListener('click', () => {
    const v = (elApi.value || '').trim();
    try { localStorage.setItem(K_API, v); } catch(e){}
    try { if (typeof GM_setValue === 'function') GM_setValue(K_API, v); } catch(e){}
    setStatus('API-KEY saved.');
  });

  elEye.addEventListener('click', () => {
    elApi.type = elApi.type === 'password' ? 'text' : 'password';
    elEye.textContent = elApi.type === 'password' ? 'Show' : 'Hide ';
  });

  elToggle.addEventListener('click', () => {
    setRunningState(!running);
    const s = readState() || {};
    writeState({ leaderId: s.leaderId || TAB_ID, ts: now(), running });
    if (isLeader() && running) {
      remaining = TIMER_SECONDS;
      setTimerLabel();
      startHeartbeat();
    }
  });

  elClose.addEventListener('click', () => {
    panel.style.display = 'none';
  });

  if (typeof GM_registerMenuCommand === 'function') {
    GM_registerMenuCommand('Show RandomMan1 panel', () => {
      panel.style.display = 'flex';
    });
  }

  setTimerLabel();
  setRunningState(running);

  window.addEventListener('beforeunload', () => {
    const lock = readLock();
    if (lock && lock.holderId === TAB_ID) {
      releaseLock();
    }
  });

})();