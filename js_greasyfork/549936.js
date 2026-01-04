// ==UserScript==
// @name         Overseas Online Activity Filter Extended
// @namespace    https://www.torn.com/
// @version      1.4
// @description  Hide/Show abroad players and display their last action online, with delayed updates.
// @author       SuperGogu [3580072]
// @match        https://www.torn.com/index.php?page=people*
// @run-at       document-end
// @license      Apache License 2.0
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/549936/Overseas%20Online%20Activity%20Filter%20Extended.user.js
// @updateURL https://update.greasyfork.org/scripts/549936/Overseas%20Online%20Activity%20Filter%20Extended.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const LS_KEY = 'ooaf_settings_v2';
  const CLASS_ROW_BADGE = 'ooaf-lastaction-badge';
  const CLASS_ROW_META  = 'ooaf-meta';
  const FETCH_DELAY_MS_DEFAULT = 1000;
  const MAX_RETRIES = 3;
  const RATE_LIMIT_PAUSE_MS = 65000; // 65s safety

  // ------------- ONLY THIS LIST -------------
  const LIST_SELECTORS = [
    'ul.users-list.icons.cont-gray.bottom-round.m-bottom10',
    'ul.users-list.icons.cont-gray.bottom-round',
    'ul.users-list.icons',
    'ul.users-list'
  ];

  // ---------- STIL ----------
  GM_addStyle(`
    .ooaf-panel{position:fixed;top:80px;left:80px;width:390px;min-width:290px;height:290px;min-height:180px;display:flex;flex-direction:column;z-index:999999;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.25);overflow:hidden;user-select:none;backdrop-filter:blur(2px)}
    .ooaf-header{background:rgba(20,20,25,.6);color:#fff;padding:8px 10px;display:flex;align-items:center;gap:8px;cursor:move;font-weight:600;font-size:13px}
    .ooaf-title{flex:1}
    .ooaf-btn{appearance:none;border:none;cursor:pointer;padding:6px 10px;border-radius:8px;background:rgba(255,255,255,.15);color:#fff;font-size:12px}
    .ooaf-btn:hover{background:rgba(255,255,255,.25)}
    .ooaf-body{flex:1;background:rgba(30,30,36,.4);color:#e9e9ee;padding:10px;overflow:auto;font-size:12px;user-select:text}
    .ooaf-row{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px}
    .ooaf-chip{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.1);padding:4px 8px;border-radius:999px}
    .ooaf-body input[type="text"], .ooaf-body input[type="password"]{width:100%}
    .ooaf-footer{display:flex;align-items:center;gap:8px;padding:6px 10px;background:rgba(20,20,25,.55);color:#ddd;font-size:12px}
    .ooaf-oprange{width:120px}
    .ooaf-resizer{position:absolute;right:0;bottom:0;width:14px;height:14px;cursor:se-resize;background:linear-gradient(135deg,transparent 0 50%,rgba(255,255,255,.35) 50% 100%);opacity:.7}
    .ooaf-hidden{display:none!important}
    .${CLASS_ROW_BADGE}{margin-left:8px;padding:2px 6px;border-radius:6px;font-size:11px;background:rgba(255,255,255,.08);color:#ddd;display:inline-block}
    .ooaf-badge-fresh{background:rgba(0,200,0,.18)}
    .ooaf-badge-stale{background:rgba(200,200,0,.18)}
    .ooaf-badge-unknown{background:rgba(200,0,0,.18)}
    .ooaf-progress{height:8px;border-radius:999px;background:rgba(255,255,255,.18);overflow:hidden}
    .ooaf-progress > div{height:100%;width:0%;background:rgba(255,255,255,.65)}
    .ooaf-mono{font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace}
    .ooaf-breath{letter-spacing:.2px}
    .ooaf-select{background:rgba(255,255,255,.1);color:#e9e9ee;border:none;border-radius:999px;padding:4px 8px}
  `);

  // ---------- STATE ----------
  function loadState() {
    try { return JSON.parse(GM_getValue(LS_KEY) || '{}'); } catch { return {}; }
  }
  function saveState(overrides) {
    const st = loadState();
    const panel = document.querySelector('.ooaf-panel');
    if (panel) { st.top=panel.style.top; st.left=panel.style.left; st.width=panel.style.width; st.height=panel.style.height; st.hidden=panel.classList.contains('ooaf-hidden'); }
    if (apiInput) { st.apiKey = apiInput.value.trim(); st.apiMasked = apiInput.type === 'password'; }
    if (thrVal) st.value = +thrVal.value || 60;
    if (thrUnit) st.unit = thrUnit.value;
    if (delayInput) st.delay = +delayInput.value || FETCH_DELAY_MS_DEFAULT;
    if (opRange) st.alpha = opRange.value;
    if (hideUnknownChk) st.hideUnknown = hideUnknownChk.checked;
    if (exclJailChk) st.excludeJail = exclJailChk.checked;
    if (exclHospChk) st.excludeHospital = exclHospChk.checked;
    if (sortSel) st.sortBy = sortSel.value;
    if (overrides && typeof overrides === 'object') Object.assign(st, overrides);
    GM_setValue(LS_KEY, JSON.stringify(st));
  }

  // ---------- UI ----------
  let apiInput, apiToggleBtn, thrVal, thrUnit, delayInput, opRange, hideUnknownChk, exclJailChk, exclHospChk, sortSel;
  let runState = { running:false, queue:[], timer:null, processed:0, startedAt:0, paused:false, pauseUntil:0 };

  function createPanel() {
    const s = loadState();

    const panel = document.createElement('div');
    panel.className = 'ooaf-panel';
    panel.style.top = s.top ?? '80px';
    panel.style.left = s.left ?? '80px';
    panel.style.width = s.width ?? '390px';
    panel.style.height = s.height ?? '290px';

    const header = document.createElement('div');
    header.className = 'ooaf-header';
    const t = document.createElement('span'); t.className = 'ooaf-title'; t.textContent = 'Last Action by API (TORN)';
    const btnHide = btn('Hide'); const btnClose = btn('×');
    header.append(t, btnHide, btnClose);

    const body = document.createElement('div');
    body.className = 'ooaf-body';
    body.innerHTML = `
      <div class="ooaf-row" style="grid-template-columns:1fr auto;">
        <label class="ooaf-chip" style="grid-column:1 / span 1; min-width:0;">
          API key
          <input type="password" class="ooaf-api" placeholder="Paste your TORN API key"/>
        </label>
        <button class="ooaf-btn ooaf-api-toggle" title="Show/Hide API key">👁</button>
      </div>
      <div class="ooaf-row">
        <label class="ooaf-chip">Value <input type="number" min="1" step="1" class="ooaf-thr-val" style="width:80px" value="60"></label>
        <label class="ooaf-chip">Unit
          <select class="ooaf-thr-unit ooaf-select">
            <option value="minutes">minutes</option>
            <option value="hours">hours</option>
            <option value="days">days</option>
          </select>
        </label>
      </div>
      <div class="ooaf-row">
        <label class="ooaf-chip" title="Delay per request"><span>Delay</span> <input type="number" min="250" step="250" class="ooaf-delay" style="width:80px" value="${FETCH_DELAY_MS_DEFAULT}"><span class="ooaf-mono">ms</span></label>
        <label class="ooaf-chip" title="Ascunde rândurile fără 'last action' detectabil"><input type="checkbox" class="ooaf-hide-unknown"> Hide unknown</label>
      </div>
      <div class="ooaf-row">
        <label class="ooaf-chip"><input type="checkbox" class="ooaf-excl-jail"> Exclude Jail</label>
        <label class="ooaf-chip"><input type="checkbox" class="ooaf-excl-hosp"> Exclude Hospital</label>
      </div>
      <div class="ooaf-row">
        <label class="ooaf-chip">Sort by
          <select class="ooaf-sort ooaf-select" title="Live sort after fetch">
            <option value="none">None</option>
            <option value="inactivity">Inactivity (desc)</option>
            <option value="level">Level (desc)</option>
          </select>
        </label>
        <span class="ooaf-chip">Hotkey: <b>Alt+L</b></span>
      </div>
      <div class="ooaf-row" style="grid-template-columns:1fr 1fr;">
        <button class="ooaf-btn ooaf-fetch" style="font-weight:700;">Fetch</button>
        <button class="ooaf-btn ooaf-stop">Stop</button>
      </div>

      <div class="ooaf-row" style="grid-template-columns:1fr;">
        <div class="ooaf-progress"><div class="ooaf-bar"></div></div>
      </div>
      <div class="ooaf-row" style="grid-template-columns:1fr 1fr;">
        <span class="ooaf-chip">Found <b class="ooaf-found">0</b></span>
        <span class="ooaf-chip">Processed <b class="ooaf-processed">0</b></span>
      </div>
      <div class="ooaf-row" style="grid-template-columns:1fr 1fr;">
        <span class="ooaf-chip">Hidden <b class="ooaf-hidden-count">0</b></span>
        <span class="ooaf-chip">Visible <b class="ooaf-visible-count">0</b></span>
      </div>
      <div class="ooaf-row" style="grid-template-columns:1fr 1fr;">
        <span class="ooaf-chip">ETA <b class="ooaf-eta ooaf-mono">—</b></span>
        <span class="ooaf-chip ooaf-status">Ready</span>
      </div>
    `;

    const footer = document.createElement('div');
    footer.className = 'ooaf-footer';
    footer.innerHTML = `
      <span>Transparency</span>
      <input type="range" class="ooaf-oprange" min="0.2" max="0.95" step="0.01" value="0.4">
      <span class="ooaf-opval"></span>
    `;

    const resizer = document.createElement('div'); resizer.className = 'ooaf-resizer';

    panel.append(header, body, footer, resizer);
    document.body.appendChild(panel);
    const sHidden = s.hidden ?? false; if (sHidden) panel.classList.add('ooaf-hidden');

    // refs
    apiInput = panel.querySelector('.ooaf-api');
    apiToggleBtn = panel.querySelector('.ooaf-api-toggle');
    thrVal = panel.querySelector('.ooaf-thr-val');
    thrUnit = panel.querySelector('.ooaf-thr-unit');
    delayInput = panel.querySelector('.ooaf-delay');
    opRange = panel.querySelector('.ooaf-oprange');
    hideUnknownChk = panel.querySelector('.ooaf-hide-unknown');
    exclJailChk = panel.querySelector('.ooaf-excl-jail');
    exclHospChk = panel.querySelector('.ooaf-excl-hosp');
    sortSel = panel.querySelector('.ooaf-sort');

    const foundEl = panel.querySelector('.ooaf-found');
    const procEl = panel.querySelector('.ooaf-processed');
    const hidEl = panel.querySelector('.ooaf-hidden-count');
    const visEl = panel.querySelector('.ooaf-visible-count');
    const opVal = panel.querySelector('.ooaf-opval');
    const bar = panel.querySelector('.ooaf-bar');
    const etaEl = panel.querySelector('.ooaf-eta');
    const statusEl = panel.querySelector('.ooaf-status');

    // restore
    apiInput.value = s.apiKey ?? '';
    if (s.apiMasked === false) apiInput.type = 'text'; // remember last choice
    thrVal.value = s.value ?? 60;
    thrUnit.value = s.unit ?? 'minutes';
    delayInput.value = s.delay ?? FETCH_DELAY_MS_DEFAULT;
    opRange.value = s.alpha ?? '0.4';
    hideUnknownChk.checked = !!s.hideUnknown;
    exclJailChk.checked = !!s.excludeJail;
    exclHospChk.checked = !!s.excludeHospital;
    sortSel.value = s.sortBy ?? 'none';

    apiToggleBtn.addEventListener('click', () => {
      apiInput.type = apiInput.type === 'password' ? 'text' : 'password';
      saveState();
    });

    const applyAlpha = (a) => {
      body.style.background = `rgba(30,30,36,${a})`;
      header.style.background = `rgba(20,20,25,${Math.min(1, a + 0.2)})`;
      opVal.textContent = `${Math.round((1 - a) * 100)}% transparent`;
      saveState();
    };
    applyAlpha(parseFloat(opRange.value));
    opRange.addEventListener('input', e => applyAlpha(parseFloat(e.target.value)));

    // drag
    let drag = { on:false,x:0,y:0,l:0,t:0 };
    header.addEventListener('mousedown', e => { drag.on=true; drag.x=e.clientX; drag.y=e.clientY; drag.l=parseInt(panel.style.left,10)||0; drag.t=parseInt(panel.style.top,10)||0; document.body.style.userSelect='none'; });
    document.addEventListener('mousemove', e => { if(!drag.on)return; panel.style.left=(drag.l+e.clientX-drag.x)+'px'; panel.style.top=(drag.t+e.clientY-drag.y)+'px';});
    document.addEventListener('mouseup', ()=>{ if(drag.on){drag.on=false; document.body.style.userSelect=''; saveState();}});

    // resize
    let rsz = { on:false,x:0,y:0,w:0,h:0 };
    resizer.addEventListener('mousedown', e => { e.stopPropagation(); rsz.on=true; rsz.x=e.clientX; rsz.y=e.clientY; const r=panel.getBoundingClientRect(); rsz.w=r.width; rsz.h=r.height; document.body.style.userSelect='none'; });
    document.addEventListener('mousemove', e => { if(!rsz.on)return; panel.style.width=Math.max(290, rsz.w + (e.clientX-rsz.x))+'px'; panel.style.height=Math.max(180, rsz.h + (e.clientY-rsz.y))+'px'; });
    document.addEventListener('mouseup', ()=>{ if(rsz.on){ rsz.on=false; document.body.style.userSelect=''; saveState(); } });

    btnHide.addEventListener('click', () => {
      const disp = body.style.display==='none' ? 'block':'none';
      body.style.display = disp; footer.style.display = disp==='none'?'none':'flex';
      resizer.style.display = disp==='none'?'none':'block';
    });
    btnClose.addEventListener('click', () => { panel.classList.add('ooaf-hidden'); saveState({hidden:true}); });

    document.addEventListener('keydown', (e) => { if (e.altKey && e.key.toLowerCase()==='l'){ panel.classList.toggle('ooaf-hidden'); saveState(); } });
    GM_registerMenuCommand('Show/Hide panel (Alt+L)', () => { panel.classList.toggle('ooaf-hidden'); saveState(); });

    [apiInput, thrVal, thrUnit, delayInput, hideUnknownChk, exclJailChk, exclHospChk, sortSel].forEach(el=>{
      el.addEventListener('change', saveState);
      el.addEventListener('input', saveState);
    });

    // Fetch / Stop
    const btnFetch = panel.querySelector('.ooaf-fetch');
    const btnStop  = panel.querySelector('.ooaf-stop');

    btnFetch.addEventListener('click', async () => {
      if (runState.running) return;
      const key = (apiInput.value||'').trim();
      if (!key) { alert('Set your TORN API key first.'); return; }

      statusEl.textContent = 'Scanning DOM…';
      const rows = getPlayerRows();
      const list = rows.map(r => {
        return { row: r, uid: extractUserId(r), level: extractLevelFromRow(r) };
      }).filter(x => !!x.uid);

      foundEl.textContent = String(list.length);
      bar.style.width = '0%';
      etaEl.textContent = '—';
      procEl.textContent = '0';
      hidEl.textContent = '0';
      visEl.textContent = String(list.length);

      runState.running = true; runState.processed = 0; runState.startedAt = Date.now(); runState.paused=false; runState.pauseUntil=0;
      statusEl.textContent = 'Fetching…';
      processQueueSequential(key, list, (progress) => {
        // onEach
        procEl.textContent = String(progress.done);
        const pct = progress.total ? Math.floor(progress.done / progress.total * 100) : 0;
        bar.style.width = pct + '%';
        etaEl.textContent = progress.etaText;
        const { hidden, visible } = recountVisibility(rows);
        hidEl.textContent = String(hidden);
        visEl.textContent = String(visible);
      }, () => {
        runState.running = false;
        statusEl.textContent = 'Done';
        // sort on finish (if sort selected)
        if (sortSel.value !== 'none') {
          sortRowsBySelection(sortSel.value);
        }
      });
    });

    btnStop.addEventListener('click', () => {
      runState.running = false;
      runState.paused = false;
      if (runState.timer) { clearTimeout(runState.timer); runState.timer = null; }
      statusEl.textContent = 'Stopped';
    });

    // live re-sort when selection changes (after avem date pe rânduri)
    sortSel.addEventListener('change', () => {
      if (sortSel.value !== 'none') sortRowsBySelection(sortSel.value);
    });

    // helpers for UI
    function etaTextFrom(ms) {
      if (!isFinite(ms) || ms <= 0) return '—';
      const s = Math.ceil(ms / 1000);
      const m = Math.floor(s / 60);
      const sec = s % 60;
      return m ? `${m}m ${sec}s` : `${sec}s`;
    }

    // fetch sequential cu backoff + rate-limit pause
    function processQueueSequential(apiKey, list, onEach, onDone) {
      const delay = Math.max(250, +(delayInput.value || FETCH_DELAY_MS_DEFAULT));
      const total = list.length;
      let idx = 0;
      let avgPerItem = delay; // pornim cu delay ca estimare

      const step = async () => {
        if (!runState.running) return onDone && onDone();
        if (idx >= total) return onDone && onDone();

        // rate-limit pause active?
        if (runState.paused) {
          const now = Date.now();
          if (now < runState.pauseUntil) {
            const remaining = runState.pauseUntil - now;
            onEach && onEach({ done: idx, total, etaText: etaTextFrom(remaining + (total-idx)*delay) });
            runState.timer = setTimeout(step, Math.min(remaining, 1000));
            return;
          } else {
            runState.paused = false;
          }
        }

        const startOne = Date.now();
        const { row, uid } = list[idx];

        try {
          const data = await fetchUserWithRetry(apiKey, uid);
          const relative = data?.last_action?.relative || '';
          const mins = parseRelativeToMinutes(relative);
          const statusState = (data?.status?.state || '').toLowerCase();
          const states = data?.states || {};
          const inHospital = statusState === 'hospital' || (states.hospital_timestamp && states.hospital_timestamp > 0);
          const inJail     = statusState === 'jail'     || (states.jail_timestamp && states.jail_timestamp > 0);

          // meta pe rând (pentru sortări/filtre ulterioare)
          attachMeta(row, { mins, level: data?.level ?? extractLevelFromRow(row), inHospital, inJail });

          decorateRowWithLastAction(row, relative);
          applyRowVisibilityWithThresholdAndExclusions(row, { mins, inHospital, inJail });

        } catch (e) {
          // dacă e rate-limit -> pauză
          if (e && e.__rateLimit) {
            runState.paused = true;
            runState.pauseUntil = Date.now() + RATE_LIMIT_PAUSE_MS;
          }
          // marchează N/A
          attachMeta(row, { mins: null, level: extractLevelFromRow(row), inHospital:false, inJail:false });
          decorateRowWithLastAction(row, null, e);
          applyRowVisibilityWithThresholdAndExclusions(row, { mins: null, inHospital:false, inJail:false });
        }

        idx++;
        runState.processed = idx;
        const took = Date.now() - startOne;
        // moving average simplu
        avgPerItem = avgPerItem * 0.7 + took * 0.3;
        const remaining = (total - idx) * (avgPerItem + delay);
        onEach && onEach({ done: idx, total, etaText: etaTextFrom(remaining) });

        if (!runState.running) return onDone && onDone();
        runState.timer = setTimeout(step, delay);
      };
      step();
    }

    function fetchUserWithRetry(apiKey, userId) {
      let attempt = 0;
      const backoffs = [1000, 2000, 4000];

      return new Promise((resolve, reject) => {
        const attemptFetch = () => {
          attempt++;
          GM_xmlhttpRequest({
            method: 'GET',
            url: `https://api.torn.com/user/${userId}?key=${encodeURIComponent(apiKey)}&selections=profile`,
            headers: { 'Accept': 'application/json' },
            timeout: 20000,
            onload: (res) => {
              try {
                const status = res.status;
                const json = JSON.parse(res.responseText || '{}');

                if (status === 429 || json?.error?.code === 5) { // 5 ~ Too many requests (comun la TORN)
                  const err = new Error('Rate limited');
                  err.__rateLimit = true;
                  return reject(err);
                }

                if (status >= 200 && status < 300 && !json.error) {
                  return resolve(json);
                }

                // erori temporare -> retry
                if ((status >= 500 && status < 600) || json?.error) {
                  if (attempt <= MAX_RETRIES) {
                    const wait = backoffs[Math.min(attempt-1, backoffs.length-1)];
                    setTimeout(attemptFetch, wait);
                  } else {
                    reject(new Error(json?.error?.error || `HTTP ${status}`));
                  }
                  return;
                }

                reject(new Error(`HTTP ${status}`));
              } catch (err) {
                if (attempt <= MAX_RETRIES) {
                  const wait = backoffs[Math.min(attempt-1, backoffs.length-1)];
                  setTimeout(attemptFetch, wait);
                } else reject(err);
              }
            },
            onerror: () => {
              if (attempt <= MAX_RETRIES) setTimeout(attemptFetch, backoffs[Math.min(attempt-1, backoffs.length-1)]);
              else reject(new Error('Network error'));
            },
            ontimeout: () => {
              if (attempt <= MAX_RETRIES) setTimeout(attemptFetch, backoffs[Math.min(attempt-1, backoffs.length-1)]);
              else reject(new Error('Request timeout'));
            },
          });
        };
        attemptFetch();
      });
    }

    function sortRowsBySelection(mode) {
      const root = getListRoot();
      if (!root) return;

      const rows = getPlayerRows();
      if (!rows.length) return;

      const items = rows.map(r => {
        const meta = readMeta(r);
        const mins = meta?.mins ?? parseRelativeToMinutes(r.querySelector('.' + CLASS_ROW_BADGE)?.textContent || '') ?? null;
        const lvl  = meta?.level ?? extractLevelFromRow(r) ?? 0;
        return { el: r, mins, level: lvl };
      });

      if (mode === 'inactivity') {
        items.sort((a,b) => {
          const am = (a.mins==null)?-1:a.mins, bm=(b.mins==null)?-1:b.mins;
          if (am === -1 && bm === -1) return 0;
          if (am === -1) return 1;
          if (bm === -1) return -1;
          return bm - am; // desc: mai inactiv la început
        });
      } else if (mode === 'level') {
        items.sort((a,b) => (b.level||0) - (a.level||0));
      } else {
        return;
      }

      // reatașăm în ordinea nouă în ACELAȘI <ul>
      items.forEach(it => root.appendChild(it.el));
    }


  } // end createPanel

  function btn(text){ const b=document.createElement('button'); b.className='ooaf-btn'; b.textContent=text; return b; }

  // ---------- PAGE PARSING ----------
  function getListRoot() {
    // 1) preferă selectorul cel mai specific
    for (const sel of LIST_SELECTORS) {
      const el = document.querySelector(sel);
      if (el) return el;
    }
    // 2) fallback: „cel mai bun” <ul.users-list> care conține link-uri de profil
    const alls = Array.from(document.querySelectorAll('ul.users-list'));
    return alls.find(ul => ul.querySelector('a[href*="/profiles.php?XID="]')) || null;
  }

  function getPlayerRows() {
    const root = getListRoot();
    if (!root) return [];
    // doar copiii direcți <li> din lista asta
    const rows = Array.from(root.querySelectorAll(':scope > li'));
    // excludem headere/pagini etc., dar păstrăm rândurile „tt-hidden” (le vei controla tu prin filtrul tău)
    return rows.filter(r => !isHeader(r));
  }

  function isHeader(el) {
    // în lista asta nu ar trebui să existe thead/headers, dar păstrăm protecția
    return el.matches('.title, .header, .pagination, .table-header');
  }


  function extractUserId(row) {
    const a = row.querySelector('a[href*="/profiles.php?XID="]');
    if (!a) return null;
    const m = a.href.match(/XID=(\d+)/);
    return m ? m[1] : null;
  }

  function extractLevelFromRow(row) {
    const levelWrap = row.querySelector('.level, .level-wrap');
    if (levelWrap) {
      const m = (levelWrap.textContent || '').match(/(\d+)/);
      if (m) return parseInt(m[1], 10);
    }
    // fallback: dacă se schimbă layout-ul
    const nums = (row.textContent || '').match(/\b\d+\b/g);
    if (nums && nums.length) {
      const guess = parseInt(nums[0], 10);
      if (!isNaN(guess)) return guess;
    }
    return 0;
  }


  // ---------- DECORARE & FILTRARE ----------
  function attachMeta(row, meta) {
    let holder = row.querySelector('.' + CLASS_ROW_META);
    if (!holder) {
      holder = document.createElement('span');
      holder.className = CLASS_ROW_META;
      holder.style.display = 'none';
      row.appendChild(holder);
    }
    holder.textContent = JSON.stringify(meta);
  }
  function readMeta(row) {
    const holder = row.querySelector('.' + CLASS_ROW_META);
    if (!holder) return null;
    try { return JSON.parse(holder.textContent || '{}'); } catch { return null; }
  }

  function decorateRowWithLastAction(row, relative, err) {
    const old = row.querySelector('.' + CLASS_ROW_BADGE);
    if (old) old.remove();

    const nameAnchor = row.querySelector('a[href*="/profiles.php?XID="]');
    if (!nameAnchor) return;

    const badge = document.createElement('span');
    badge.className = CLASS_ROW_BADGE;

    if (relative == null) {
      badge.textContent = err ? `N/A (${err.message})` : 'N/A';
      badge.classList.add('ooaf-badge-unknown');
    } else {
      badge.textContent = relative;
      const mins = parseRelativeToMinutes(relative);
      if (mins == null) badge.classList.add('ooaf-badge-unknown');
      else if (mins < 60) badge.classList.add('ooaf-badge-fresh');
      else badge.classList.add('ooaf-badge-stale');
    }
    nameAnchor.parentElement.appendChild(badge);
  }

  function applyRowVisibilityWithThresholdAndExclusions(row, ctx) {
    const { mins, inHospital, inJail } = ctx;
    const st = loadState();
    const thr = thresholdToMinutes(st);

    // excluderi întâi
    if ((st.excludeHospital && inHospital) || (st.excludeJail && inJail)) {
      row.style.display = 'none';
      return;
    }

    let show;
    if (mins == null) show = !st.hideUnknown;
    else show = mins >= thr; // vrem inactivi >= prag

    row.style.display = show ? '' : 'none';
  }

  function recountVisibility(rows) {
    const list = rows && rows.length ? rows : getPlayerRows();
    let hidden = 0, visible = 0;
    list.forEach(r => (r.style.display === 'none' ? hidden++ : visible++));
    return { hidden, visible };
  }


  function thresholdToMinutes(st) {
    const v = Math.max(1, +((st.value ?? 60)));
    const u = (st.unit ?? 'minutes');
    if (u === 'minutes') return v;
    if (u === 'hours') return v * 60;
    if (u === 'days') return v * 1440;
    return v;
  }

  // parser relative -> minute
  function parseRelativeToMinutes(raw) {
    if (!raw) return null;
    const s = String(raw).toLowerCase().trim();
    if (/^(online|now|just now|moments? ago)$/.test(s)) return 0;
    if (/a\s+minute/.test(s)) return 1;
    if (/a\s+second/.test(s)) return 0;
    if (/a\s+few\s+minutes?/.test(s)) return 3;
    if (/less\s+than\s+a\s+minute/.test(s)) return 0;

    let minutes = 0, matched = false;
    const re = /(\d+)\s*(y|yr|yrs|year|years|mo|month|months|w|wk|wks|week|weeks|d|day|days|h|hr|hrs|hour|hours|m|min|mins|minute|minutes|s|sec|secs|second|seconds)\b/g;
    let m;
    while ((m = re.exec(s)) !== null) {
      matched = true;
      const val = parseInt(m[1], 10);
      minutes += val * unitToMinutes(m[2]);
    }
    if (matched) return minutes;

    const ml = s.match(/(\d+)\s+(years?|months?|weeks?|days?|hours?|minutes?|seconds?)\s+ago/);
    if (ml) return parseInt(ml[1], 10) * unitToMinutes(ml[2]);

    const mn = s.match(/(\d+)\s*(minutes?|hours?|days?)/);
    if (mn) return parseInt(mn[1], 10) * unitToMinutes(mn[2]);

    return null;
  }
  function unitToMinutes(u) {
    u = u.toLowerCase();
    if (u.startsWith('y')) return 525600;
    if (u.startsWith('mo')) return 43200;
    if (u.startsWith('w')) return 10080;
    if (u.startsWith('d')) return 1440;
    if (u.startsWith('h')) return 60;
    if (u.startsWith('m')) return 1;
    if (u.startsWith('s')) return 0;
    return 0;
  }

  // ---------- INIT ----------
  function onReady(fn) {
    if (document.readyState === 'complete' || document.readyState === 'interactive') fn();
    else document.addEventListener('DOMContentLoaded', fn, { once: true });
  }
  onReady(createPanel);

})();
