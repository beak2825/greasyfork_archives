// ==UserScript==
// @name         TORN Market Logger + Filters + CSV Export
// @namespace    https://torn.com/
// @version      1.5.1
// @description  Draggable panel; paginated log sync (buy/sell); daily storage in IndexedDB; export CSV; profit per selected day + total; safe Clear Data; calendar button; opacity slider; input overflow fix; market/bazaar/all filter
// @author       SuperGogu[3580072]
// @match        https://www.torn.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect      api.torn.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550054/TORN%20Market%20Logger%20%2B%20Filters%20%2B%20CSV%20Export.user.js
// @updateURL https://update.greasyfork.org/scripts/550054/TORN%20Market%20Logger%20%2B%20Filters%20%2B%20CSV%20Export.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // ---------- CONFIG ----------
  const TORN_LOG_ENDPOINT = 'https://api.torn.com/v2/user/log';
  const LOG_IDS = [1225, 1226, 1113, 1112]; // Bazaar buy/sell, Item market sell/buy
  const PAGE_LIMIT = 100;
  const SORT = 'desc';

  // ---------- STATE KEYS ----------
  const STORE_KEYS = {
    apiKey: 'torn_api_key',
    panelPos: 'torn_panel_pos',
    hidden: 'torn_panel_hidden',
    lastSyncTo: 'torn_last_sync_to',
    earliestDate: 'torn_earliest_date_cached',
    opacity: 'torn_panel_opacity',        // 0.4–1.0
    tradeFilter: 'torn_trade_filter'      // 'all' | 'market' | 'bazaar'
  };

  // ---------- UI ----------
  const panel = document.createElement('div');
  panel.id = 'torn-floating-panel';
  panel.innerHTML = `
    <div class="header">
      <span>TORN Logger</span>
      <button id="torn-hide-btn" title="Hide panel">✕</button>
    </div>
    <div class="content">
      <label class="lbl">
        API Key
        <input type="password" id="torn-apikey" placeholder="Enter API key" />
      </label>

      <div class="row">
        <button id="torn-save-key">Save key</button>
        <button id="torn-test">Test key</button>
      </div>

      <div class="row align-center">
        <label class="lbl no-mb flex">
          <span style="min-width:72px;">Opacity</span>
          <input type="range" id="torn-opacity" min="40" max="100" step="1" />
          <span id="torn-opacity-val" class="mono small"></span>
        </label>
      </div>

      <hr/>

      <div class="row">
        <button id="torn-sync">Sync now</button>
        <button id="torn-export">Export CSV</button>
        <button id="torn-clear-db" class="danger">Clear data</button>
      </div>

      <div class="filter">
        <div class="row">
          <label class="lbl no-mb" style="flex:1;">
            Filter
            <select id="torn-filter" style="width:100%;">
              <option value="all">All</option>
              <option value="market">Item market</option>
              <option value="bazaar">Bazaars</option>
            </select>
          </label>
        </div>

        <label class="lbl">Select day</label>
        <div class="date-row">
          <input type="date" id="torn-day" />
          <button id="torn-open-calendar" title="Open calendar" class="icon-btn">📅</button>
        </div>

        <div class="profits">
          <div><strong>Selected day profit:</strong> <span id="torn-day-profit">—</span></div>
          <div><strong>Total profit:</strong> <span id="torn-total-profit">—</span></div>
        </div>
      </div>

      <small id="torn-status"></small>
    </div>
  `;

  GM_addStyle(`
    /* layout safeguards */
    #torn-floating-panel, #torn-floating-panel * { box-sizing: border-box; }
    #torn-floating-panel { overflow: hidden; }

    #torn-floating-panel {
      position: fixed; top: 90px; right: 30px; z-index: 999999;
      width: 320px; background: #111; color: #eee;
      border: 1px solid #333; border-radius: 10px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.35);
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      user-select: none;
    }
    #torn-floating-panel .header {
      cursor: move; padding: 8px 10px; background: #1a1a1a; border-bottom: 1px solid #333;
      display: flex; align-items: center; justify-content: space-between; font-weight: 600;
    }
    #torn-floating-panel .header button {
      background: transparent; border: none; color: #bbb; font-size: 16px; cursor: pointer;
    }
    #torn-floating-panel .header button:hover { color: #fff; }
    #torn-floating-panel .content { padding: 10px; user-select: text; }
    #torn-floating-panel .lbl { display:block; font-size: 13px; margin-bottom: 8px; }
    #torn-floating-panel .lbl.no-mb { margin-bottom: 0; }
    #torn-floating-panel .flex { display:flex; align-items:center; gap:8px; }
    #torn-floating-panel input[type="password"],
    #torn-floating-panel input[type="date"] {
      width: 100%; max-width: 100%;
      padding: 6px 8px; border-radius: 6px; border: 1px solid #333; background:#161616; color:#eee;
      display:block;
    }
    #torn-floating-panel select {
      width: 100%; max-width: 100%;
      padding: 6px 8px; border-radius: 6px; border: 1px solid #333; background:#161616; color:#eee;
      display:block;
    }
    #torn-floating-panel input[type="range"] {
      width: 100%; max-width: 100%;
      accent-color: #888;
    }
    #torn-floating-panel .row { display:flex; gap:8px; margin: 8px 0; flex-wrap: wrap; }
    #torn-floating-panel .row.align-center { align-items: center; }
    #torn-floating-panel button {
      padding: 6px 10px; border-radius: 8px; border: 1px solid #2f2f2f; background:#222; color:#eee; cursor:pointer;
    }
    #torn-floating-panel button:hover { background:#2a2a2a; }
    #torn-floating-panel button.danger { border-color:#5a2b2b; background:#2a1a1a; }
    #torn-floating-panel button.danger:hover { background:#3a1f1f; }
    #torn-floating-panel .filter { margin-top: 8px; }
    #torn-floating-panel .profits { margin: 6px 0 2px 0; display: grid; gap: 2px; }
    #torn-floating-panel .date-row { display:flex; gap:6px; align-items:center; }
    #torn-floating-panel .icon-btn {
      width: 36px; height: 32px; display:flex; align-items:center; justify-content:center;
      border-radius: 8px; border: 1px solid #2f2f2f; background:#222; color:#eee; cursor:pointer;
      flex: 0 0 auto;
    }
    #torn-floating-panel .icon-btn:hover { background:#2a2a2a; }
    #torn-floating-panel .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
    #torn-floating-panel .small { font-size: 12px; color:#bbb; }
  `);

  document.body.appendChild(panel);

  // --- Restore prefs & position ---
  const apiInput = panel.querySelector('#torn-apikey');
  const savedKey = GM_getValue(STORE_KEYS.apiKey, '');
  if (savedKey) apiInput.value = savedKey;

  const savedPos = GM_getValue(STORE_KEYS.panelPos, null);
  if (savedPos && typeof savedPos === 'object') {
    panel.style.top = savedPos.top + 'px';
    panel.style.left = savedPos.left + 'px';
    panel.style.right = 'auto';
  }
  const isHidden = GM_getValue(STORE_KEYS.hidden, false);
  if (isHidden) panel.style.display = 'none';

  // Opacity
  const opacityInput = panel.querySelector('#torn-opacity');
  const opacityVal = panel.querySelector('#torn-opacity-val');
  const savedOpacity = Math.min(1, Math.max(0.4, Number(GM_getValue(STORE_KEYS.opacity, 0.9))));
  setOpacity(savedOpacity);

  // Filter
  const filterSelect = panel.querySelector('#torn-filter');
  const savedFilter = GM_getValue(STORE_KEYS.tradeFilter, 'all');
  if (['all','market','bazaar'].includes(savedFilter)) filterSelect.value = savedFilter;

  // Show via menu
  GM_registerMenuCommand('Show TORN panel', () => {
    panel.style.display = 'block';
    GM_setValue(STORE_KEYS.hidden, false);
  });

  // Dragging
  (function makeDraggable(el, handleSel) {
    const handle = el.querySelector(handleSel);
    let dragging = false, offsetX = 0, offsetY = 0;

    handle.addEventListener('mousedown', (e) => {
      dragging = true;
      const rect = el.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
      e.preventDefault();
    });

    function onMove(e) {
      if (!dragging) return;
      el.style.left = (e.clientX - offsetX) + 'px';
      el.style.top  = (e.clientY - offsetY) + 'px';
      el.style.right = 'auto';
    }
    function onUp() {
      dragging = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      const rect = el.getBoundingClientRect();
      GM_setValue(STORE_KEYS.panelPos, { left: rect.left, top: rect.top });
    }
  })(panel, '.header');

  // Hide
  panel.querySelector('#torn-hide-btn').addEventListener('click', () => {
    panel.style.display = 'none';
    GM_setValue(STORE_KEYS.hidden, true);
  });

  // Buttons
  panel.querySelector('#torn-save-key').addEventListener('click', () => {
    const key = apiInput.value.trim();
    if (!key) return setStatus('Please enter an API key.', true);
    GM_setValue(STORE_KEYS.apiKey, key);
    setStatus('API key saved.');
  });

  panel.querySelector('#torn-test').addEventListener('click', async () => {
    try {
      const key = (apiInput.value || '').trim();
      if (!key) return setStatus('API key missing.', true);
      setStatus('Testing…');
      await fetchOnePage({ key, to: null, limit: 1 });
      setStatus('API key OK.');
    } catch (e) {
      setStatus('Test failed: ' + (e?.message || e), true);
    }
  });

  panel.querySelector('#torn-sync').addEventListener('click', async () => {
    const key = (apiInput.value || '').trim();
    if (!key) return setStatus('API key missing.', true);
    try {
      setStatus('Sync in progress…');
      const count = await syncAllLogs(key);
      setStatus(`Done. Processed records: ${count}.`);
      await refreshDateBoundsAndProfits();
    } catch (e) {
      setStatus('Sync error: ' + (e?.message || e), true);
    }
  });

    // CSV export
    panel.querySelector('#torn-export').addEventListener('click', async () => {
        try {
            setStatus('Preparing CSV…');
            const csvLines = await exportAllAsCSV(); // always returns at least the header
            const content = csvLines.join('\n') + '\n';

            // Use data URI to avoid objectURL edge cases in Tampermonkey
            const dataUrl = 'data:text/csv;charset=utf-8,' + encodeURIComponent(content);
            const filename = `torn_market_${new Date().toISOString().slice(0,10)}.csv`;

            GM_download({
                url: dataUrl,
                name: filename,
                saveAs: true,
                onerror: (e) => setStatus('Export error (download): ' + (e?.error || 'unknown'), true),
            });

            setStatus(`Exported ${Math.max(0, csvLines.length - 1)} rows (${filename}).`);
        } catch (e) {
            setStatus('Export error: ' + (e?.message || e), true);
        }
    });


  // SAFE CLEAR: only our object store + our progress keys (no DB deletion)
  panel.querySelector('#torn-clear-db').addEventListener('click', async () => {
    if (!confirm('This will delete ONLY the data saved by this userscript (days). Continue?')) return;
    try {
      await clearOurStoreOnly();
      GM_setValue(STORE_KEYS.lastSyncTo, null);
      GM_setValue(STORE_KEYS.earliestDate, null);
      setStatus('Data store cleared (script-only).');
      await refreshDateBoundsAndProfits();
    } catch (e) {
      setStatus('Clear data error: ' + (e?.message || e), true);
    }
  });

  // Calendar
  const dayInput = panel.querySelector('#torn-day');
  const openCalBtn = panel.querySelector('#torn-open-calendar');
  openCalBtn.addEventListener('click', () => {
    if (dayInput.showPicker) dayInput.showPicker();
    else dayInput.focus();
  });
  dayInput.addEventListener('change', async () => {
    await refreshProfitsForSelectedDay();
  });

  // Opacity handler
  const opacityInputHandler = () => {
    const v = Math.max(40, Math.min(100, Number(opacityInput.value || 90)));
    const normalized = v / 100;
    setOpacity(normalized);
    GM_setValue(STORE_KEYS.opacity, normalized);
  };
  opacityInput.addEventListener('input', opacityInputHandler);

  function setOpacity(val) {
    const clamped = Math.max(0.4, Math.min(1, Number(val) || 0.9));
    panel.style.opacity = String(clamped);
    const pct = Math.round(clamped * 100);
    opacityInput.value = String(pct);
    opacityVal.textContent = `${pct}%`;
  }

  // Filter persistence
  filterSelect.addEventListener('change', async () => {
    GM_setValue(STORE_KEYS.tradeFilter, filterSelect.value);
    await refreshProfitsForSelectedDay();
    await refreshTotalProfit();
  });

  function setStatus(msg, isErr=false) {
    const el = panel.querySelector('#torn-status');
    el.textContent = msg || '';
    el.style.color = isErr ? '#ff9aa2' : '#9aa';
  }
  function setDayProfitDisplay(v) {
    panel.querySelector('#torn-day-profit').textContent =
      (v === null || isNaN(v)) ? '—' : formatMoney(v);
  }
  function setTotalProfitDisplay(v) {
    panel.querySelector('#torn-total-profit').textContent =
      (v === null || isNaN(v)) ? '—' : formatMoney(v);
  }
  function formatMoney(n) {
    const sign = n < 0 ? '-' : '';
    const abs = Math.abs(n);
    return `${sign}$${abs.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }

  // ---------- NETWORK ----------
  function fetchOnePage({ key, to=null, limit=PAGE_LIMIT }) {
    return new Promise((resolve, reject) => {
      const params = new URLSearchParams();
      params.set('log', LOG_IDS.join(','));
      params.set('sort', SORT);
      params.set('limit', String(limit));
      params.set('key', key);
      if (to != null) params.set('to', String(to));

      GM_xmlhttpRequest({
        method: 'GET',
        url: `${TORN_LOG_ENDPOINT}?${params.toString()}`,
        responseType: 'json',
        onload: (res) => {
          if (res.status !== 200) return reject(new Error(`HTTP ${res.status}`));
          const data = res.response || JSON.parse(res.responseText);
          resolve(data);
        },
        onerror: () => reject(new Error('Network error')),
        ontimeout: () => reject(new Error('Timeout'))
      });
    });
  }

  async function syncAllLogs(key) {
    let nextTo = GM_getValue(STORE_KEYS.lastSyncTo, null);
    let processed = 0;
    let safetyPages = 0;

    while (true) {
      safetyPages++;
      if (safetyPages > 2000) throw new Error('Safety stop (too many pages).');

      const page = await fetchOnePage({ key, to: nextTo });
      const logs = Array.isArray(page?.log) ? page.log : [];
      if (!logs.length) break;

      const normalized = logs.map(extractMarketEvent).filter(Boolean);
      if (normalized.length) {
        await saveEventsByDay(normalized);
        processed += normalized.length;
      }

      const prevUrl = page?._metadata?.links?.prev || null;
      if (!prevUrl) break;

      const u = new URL(prevUrl);
      const toParam = u.searchParams.get('to');
      if (!toParam) break;
      nextTo = toParam;
      GM_setValue(STORE_KEYS.lastSyncTo, nextTo);
    }
    return processed;
  }

  function extractMarketEvent(row) {
    const d = row?.details;
    const data = row?.data;
    if (!d || !data) return null;

    const ts = Number(row.timestamp) || 0;
    const id = Number(d.id);

    let type = null;
    if (id === 1112 || /Item market buy/i.test(d.title)) type = 'buy';
    else if (id === 1113 || /Item market sell/i.test(d.title)) type = 'sell';
    else if (id === 1225 || /Bazaar buy/i.test(d.title)) type = 'buy';
    else if (id === 1226 || /Bazaar sell/i.test(d.title)) type = 'sell';
    else return null;

    const items = Array.isArray(data.items) ? data.items : [];
    const total = Number(data.cost_total) || 0;
    const each = Number(data.cost_each) || null;

    // Keep category; if missing, infer from title
    const category = d.category || (/\bBazaar\b/i.test(d.title) ? 'Bazaars' : 'Item market');

    return {
      ts,
      type,                       // 'buy' | 'sell'
      source: d.title,            // e.g., "Item market buy", "Bazaar sell"
      category,                   // "Item market" | "Bazaars"
      items: items.map(it => ({ id: Number(it.id), qty: Number(it.qty || 0) })),
      total,
      each,
      otherParty: data.buyer ?? data.seller ?? null,
      uid: items[0]?.uid ?? null,
    };
  }

  // ---------- IndexedDB ----------
  const DB_NAME = 'torn_market_db';
  const DB_VERSION = 1;
  let dbPromise = null;

  function openDB() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = (ev) => {
        const db = ev.target.result;
        if (!db.objectStoreNames.contains('days')) {
          const store = db.createObjectStore('days', { keyPath: 'date' }); // { date:'YYYY-MM-DD', buys:[], sells:[] }
          store.createIndex('date', 'date', { unique: true });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return dbPromise;
  }

  async function clearOurStoreOnly() {
    const db = await openDB();
    await new Promise((resolve, reject) => {
      const tx = db.transaction('days', 'readwrite');
      const store = tx.objectStore('days');
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
      tx.onabort = () => reject(tx.error);
    });
  }

  function tsToLocalDate(ts) {
    const d = new Date(ts * 1000);
    const pad = (n) => String(n).padStart(2,'0');
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth()+1);
    const dd = pad(d.getDate());
    return `${yyyy}-${mm}-${dd}`;
  }

  async function saveEventsByDay(events) {
    const db = await openDB();
    const byDay = new Map();
    for (const ev of events) {
      const date = tsToLocalDate(ev.ts);
      if (!byDay.has(date)) byDay.set(date, []);
      byDay.get(date).push(ev);
    }

    await new Promise((resolve, reject) => {
      const tx = db.transaction('days', 'readwrite');
      const store = tx.objectStore('days');

      const keys = Array.from(byDay.keys());
      let pending = keys.length;
      if (!pending) return resolve();

      keys.forEach(date => {
        const req = store.get(date);
        req.onsuccess = () => {
          const existing = req.result || { date, buys: [], sells: [] };
          for (const ev of byDay.get(date)) {
            if (ev.type === 'buy') existing.buys.push(ev);
            else existing.sells.push(ev);
          }
          const putReq = store.put(existing);
          putReq.onsuccess = () => { if (--pending === 0) resolve(); };
          putReq.onerror = () => reject(putReq.error);
        };
        req.onerror = () => reject(req.error);
      });

      tx.onabort = () => reject(tx.error);
    });

    const cached = GM_getValue(STORE_KEYS.earliestDate, null);
    const minNew = Array.from(byDay.keys()).sort()[0] || null;
    if (minNew && (!cached || minNew < cached)) {
      GM_setValue(STORE_KEYS.earliestDate, minNew);
    }
  }

  // ---------- FILTER HELPERS ----------
  function eventMatchesFilter(ev, filter) {
    if (!ev) return false;
    if (filter === 'all') return true;
    const cat = (ev.category || '').toLowerCase();
    if (filter === 'market') return cat === 'item market';
    if (filter === 'bazaar') return cat === 'bazaars';
    return true;
  }

  // ---------- PROFIT ----------
  // Profit = sum(sells.total) - sum(buys.total), with category filter
  async function getDayProfit(date) {
    if (!date) return null;
    const db = await openDB();
    const filter = GM_getValue(STORE_KEYS.tradeFilter, 'all');
    return new Promise((resolve, reject) => {
      const tx = db.transaction('days', 'readonly');
      const store = tx.objectStore('days');
      const req = store.get(date);
      req.onsuccess = () => {
        const day = req.result;
        if (!day) return resolve(0);
        const sells = (day.sells || []).filter(ev => eventMatchesFilter(ev, filter))
          .reduce((acc, ev) => acc + (Number(ev.total)||0), 0);
        const buys  = (day.buys  || []).filter(ev => eventMatchesFilter(ev, filter))
          .reduce((acc, ev) => acc + (Number(ev.total)||0), 0);
        resolve(sells - buys);
      };
      req.onerror = () => reject(req.error);
    });
  }

  async function getTotalProfit() {
    const db = await openDB();
    const filter = GM_getValue(STORE_KEYS.tradeFilter, 'all');
    return new Promise((resolve, reject) => {
      const tx = db.transaction('days', 'readonly');
      const store = tx.objectStore('days');
      let total = 0;
      const cursorReq = store.openCursor();
      cursorReq.onsuccess = (e) => {
        const cursor = e.target.result;
        if (cursor) {
          const day = cursor.value;
          const sells = (day.sells || []).filter(ev => eventMatchesFilter(ev, filter))
            .reduce((acc, ev) => acc + (Number(ev.total)||0), 0);
          const buys  = (day.buys  || []).filter(ev => eventMatchesFilter(ev, filter))
            .reduce((acc, ev) => acc + (Number(ev.total)||0), 0);
          total += (sells - buys);
          cursor.continue();
        } else {
          resolve(total);
        }
      };
      cursorReq.onerror = () => reject(cursorReq.error);
    });
  }

  async function getEarliestDateFromDB() {
    let cached = GM_getValue(STORE_KEYS.earliestDate, null);
    if (cached) return cached;

    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('days', 'readonly');
      const store = tx.objectStore('days');
      let minDate = null;
      const cursorReq = store.openCursor();
      cursorReq.onsuccess = (e) => {
        const cursor = e.target.result;
        if (cursor) {
          const k = cursor.key; // 'YYYY-MM-DD'
          if (!minDate || k < minDate) minDate = k;
          cursor.continue();
        } else {
          if (minDate) GM_setValue(STORE_KEYS.earliestDate, minDate);
          resolve(minDate);
        }
      };
      cursorReq.onerror = () => reject(cursorReq.error);
    });
  }

    // ---------- CSV EXPORT ----------
    async function exportAllAsCSV() {
        const db = await openDB().catch(err => {
            console.error('openDB failed:', err);
            return null;
        });

        const header = ['date','type','category','source','total','each','items','otherParty'];
        const lines = [header.join(',')];

        // If DB couldn't open (or doesn't exist yet), still return header so user gets a file
        if (!db) return lines;

        return new Promise((resolve, reject) => {
            const tx = db.transaction('days', 'readonly');
            const store = tx.objectStore('days');

            // Safety: if store is empty, we’ll just resolve with header
            let hadAny = false;

            const cursorReq = store.openCursor();

            cursorReq.onsuccess = (e) => {
                const cursor = e.target.result;
                if (cursor) {
                    hadAny = true;
                    const day = cursor.value; // {date, buys:[], sells:[]}

                    const push = (ev) => {
                        // Defensive conversions
                        const itemsStr = Array.isArray(ev.items)
                        ? ev.items.map(it => `${Number(it.id)||0}:${Number(it.qty)||0}`).join(';')
                        : '';

                        const row = [
                            day?.date || '',
                            ev?.type || '',
                            ev?.category || '',
                            `"${String(ev?.source || '').replace(/"/g,'""')}"`,
                            (ev?.total ?? ''),
                            (ev?.each ?? ''),
                            `"${itemsStr}"`,
                            `"${String(ev?.otherParty || '').replace(/"/g,'""')}"`
                        ];
                        lines.push(row.join(','));
                    };

                    (Array.isArray(day?.buys) ? day.buys : []).forEach(push);
                    (Array.isArray(day?.sells) ? day.sells : []).forEach(push);

                    cursor.continue();
                } else {
                    // No more records
                    if (!hadAny) {
                        // Nothing stored yet — header-only CSV is fine
                    }
                    resolve(lines);
                }
            };

            cursorReq.onerror = () => reject(cursorReq.error);
            tx.onabort = () => reject(tx.error || new Error('Transaction aborted'));
        });
    }



  // ---------- UI helpers: date bounds & profit refresh ----------
  async function refreshDateBoundsAndProfits() {
    const today = new Date();
    const pad = (n) => String(n).padStart(2,'0');
    const max = `${today.getFullYear()}-${pad(today.getMonth()+1)}-${pad(today.getDate())}`;
    dayInput.max = max;

    const min = await getEarliestDateFromDB();
    if (min) dayInput.min = min;

    if (!dayInput.value) {
      dayInput.value = max;
    } else {
      if (dayInput.value > max) dayInput.value = max;
      if (min && dayInput.value < min) dayInput.value = min;
    }

    await refreshProfitsForSelectedDay();
    await refreshTotalProfit();
  }

  async function refreshProfitsForSelectedDay() {
    const v = dayInput.value || null;
    const p = await getDayProfit(v);
    setDayProfitDisplay(p);
  }

  async function refreshTotalProfit() {
    const tp = await getTotalProfit();
    setTotalProfitDisplay(tp);
  }

  // ---- run ----
  (async () => {
    await refreshDateBoundsAndProfits();
  })();

})();
