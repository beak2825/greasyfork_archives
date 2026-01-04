// ==UserScript==
// @name         Times TARDIS Feeds Scanner (restricted)
// @namespace    xwd-snitch
// @version      1.0
// @description  Find Times puzzle feed URLs (runs only on feeds pages)
// @match        https://feeds.thetimes.com/puzzles*
// @run-at       document-idle
// @grant        GM_setClipboard
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/554468/Times%20TARDIS%20Feeds%20Scanner%20%28restricted%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554468/Times%20TARDIS%20Feeds%20Scanner%20%28restricted%29.meta.js
// ==/UserScript==


(() => {
  'use strict';

  // ---------- small utils ----------
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const $ = (sel, root = document) => root.querySelector(sel);

  const dateToYmd = d => {
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${y}${m}${day}`;
  };
  const ymdToDate = ymd => new Date(Date.UTC(+ymd.slice(0,4), +ymd.slice(4,6)-1, +ymd.slice(6,8)));
  const addDays = (d, days) => new Date(d.getTime() + days*86400000);
  const isSunday = d => d.getUTCDay() === 0;

  // ---------- UI (collapsed toggle + panel) ----------
  function mountToggle() {
    if (document.getElementById('tardis-toggle')) return;
    const btn = document.createElement('button');
    btn.id = 'tardis-toggle';
    Object.assign(btn.style, {
      position: 'fixed', left: '18px', bottom: '60px', zIndex: 2147483647,
      padding: '10px 14px', borderRadius: '12px', border: '1px solid #888',
      background: '#0e63f1', color: '#fff', font: '12px system-ui,Segoe UI,Roboto,sans-serif',
      cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,.18)'
    });
    btn.textContent = 'TARDIS';
    btn.addEventListener('click', () => {
      const panel = document.getElementById('tardis-feeds-panel');
      if (!panel) return;
      const hidden = panel.style.display === 'none';
      panel.style.display = hidden ? 'block' : 'none';
    });
    document.body.appendChild(btn);
  }

  function mountPanel() {
    if (document.getElementById('tardis-feeds-panel')) return;

    const panel = document.createElement('div');
    panel.id = 'tardis-feeds-panel';
    Object.assign(panel.style, {
      position: 'fixed', left: '18px', bottom: '108px', zIndex: 2147483647,
      background: '#fff', border: '1px solid #999', borderRadius: '12px',
      font: '12px/1.3 system-ui,-apple-system,Segoe UI,Roboto,sans-serif',
      boxShadow: '0 2px 10px rgba(0,0,0,.18)', padding: '10px', width: '340px',
      display: 'none' // start collapsed
    });

    panel.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        <div style="font-weight:600;">Times TARDIS Feeds Scanner</div>
        <button id="tf-close" title="Collapse" style="border:1px solid #bbb;background:#f5f5f5;border-radius:8px;padding:4px 8px;cursor:pointer;">Close</button>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:6px;">
        <label style="display:flex;flex-direction:column;gap:4px;">
          <span>From (YYYYMMDD)</span>
          <input id="tf-from" type="text" placeholder="20250922" style="padding:6px;border:1px solid #bbb;border-radius:8px;">
        </label>
        <label style="display:flex;flex-direction:column;gap:4px;">
          <span>To (YYYYMMDD)</span>
          <input id="tf-to" type="text" placeholder="20250927" style="padding:6px;border:1px solid #bbb;border-radius:8px;">
        </label>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:6px;">
        <label style="display:flex;flex-direction:column;gap:4px;">
          <span>Type</span>
          <select id="tf-type" style="padding:6px;border:1px solid #bbb;border-radius:8px;">
            <option value="crosswordcryptic">Cryptic</option>
            <option value="crosswordquickcryptic">Quick</option>
          </select>
        </label>
        <label style="display:flex;flex-direction:column;gap:4px;">
          <span>Probes concurrency</span>
          <input id="tf-conc" type="number" min="1" max="10" value="6" style="padding:6px;border:1px solid #bbb;border-radius:8px;">
        </label>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:6px;">
        <label style="display:flex;flex-direction:column;gap:4px;">
          <span>Start ID</span>
          <input id="tf-initial-id" type="number" value="73900"
                 style="padding:6px;border:1px solid #bbb;border-radius:8px;">
        </label>
        <label style="display:flex;flex-direction:column;gap:4px;">
          <span>First search length</span>
          <input id="tf-first-range" type="number" value="400"
                 style="padding:6px;border:1px solid #bbb;border-radius:8px;">
        </label>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:6px;">
        <label style="display:flex;flex-direction:column;gap:4px;">
          <span>Polite delay (ms)</span>
          <input id="tf-delay" type="number" min="0" value="10" style="padding:6px;border:1px solid #bbb;border-radius:8px;">
        </label>
        <div style="display:flex;align-items:center;gap:10px;">
          <label style="display:flex;align-items:center;gap:6px;cursor:pointer;margin-top:22px;">
            <input id="tf-skip-sun" type="checkbox" checked>
            <span>Skip Sundays</span>
          </label>
        </div>
      </div>

      <div style="display:flex;gap:6px;margin-bottom:8px;flex-wrap:wrap;">
        <button id="tf-scan" style="padding:8px 10px;border:1px solid #999;border-radius:8px;background:#1867f7;color:#fff;cursor:pointer;">Scan</button>
        <button id="tf-stop" style="padding:8px 10px;border:1px solid #999;border-radius:8px;background:#eee;cursor:pointer;">Stop</button>
        <button id="tf-copy" title="Copy URLs as text" style="padding:8px 10px;border:1px solid #999;border-radius:8px;background:#06a77d;color:#fff;cursor:pointer;">Copy</button>
        <button id="tf-dl-json" style="padding:8px 10px;border:1px solid #999;border-radius:8px;background:#444;color:#fff;cursor:pointer;">Download JSON</button>
        <button id="tf-dl-csv" style="padding:8px 10px;border:1px solid #999;border-radius:8px;background:#444;color:#fff;cursor:pointer;">Download CSV</button>
      </div>

      <div id="tf-status" style="font-size:11px;color:#444;margin-bottom:6px;">Idle.</div>
      <div id="tf-results" style="max-height:260px;overflow:auto;border:1px solid #ddd;border-radius:8px;padding:6px;font-family:ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;font-size:11px;"></div>
    `;

    document.body.appendChild(panel);

    // --- derive sensible defaults for this page ---
    (function setSmartDefaults() {
      // helpers consistent with the rest of the script (UTC-based)
      const startOfWeekMonday = (d) => {
        const day = d.getUTCDay();                // 0=Sun,1=Mon,...6=Sat
        const offset = (day + 6) % 7;             // days since Monday
        const base = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
        return addDays(base, -offset);            // Monday of that week
      };
      const nextMonday = (d) => {
        const day = d.getUTCDay();
        let delta = (8 - day) % 7;                // 0 if Monday; we want *next* Monday
        if (delta === 0) delta = 7;
        const base = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
        return addDays(base, delta);
      };

      // Try to extract from the current feed URL:
      //  /sp/<type>/<YYYYMMDD>/<id>/
      const m = location.href.match(/\/sp\/([^/]+)\/(\d{8})\/(\d+)\//);

      const now = new Date();
      const monday   = nextMonday(now);
      const sunday   = addDays(monday, 6);

      // Fill date range inputs (YYYYMMDD)
      $('#tf-from').value = dateToYmd(monday);
      $('#tf-to').value   = dateToYmd(sunday);

      // If the URL revealed a type and id, set them too
      if (m) {
        const [, type, , idStr] = m;
        const bump = 400; // your “plus N” tweak
        const guessed = (parseInt(idStr, 10) || cfg.initialId) + bump;

        // set the <select> if it contains this value
        const typeSel = $('#tf-type');
        if ([...typeSel.options].some(o => o.value === type)) typeSel.value = type;

        $('#tf-initial-id').value = String(guessed);
      }
    })();

    $('#tf-close').addEventListener('click', () => { panel.style.display = 'none'; });
    $('#tf-scan').addEventListener('click', onScanFeeds);
    $('#tf-stop').addEventListener('click', () => { stopFlag = true; setStatus('Stopping…'); });
    $('#tf-copy').addEventListener('click', copyList);
    $('#tf-dl-json').addEventListener('click', () => downloadList('json'));
    $('#tf-dl-csv').addEventListener('click', () => downloadList('csv'));
  }

  // ---------- Adaptive TARDIS (feeds-only) ----------
  let stopFlag = false;

  const cfg = {
    baseUrl: 'https://feeds.thetimes.com/puzzles/sp/', // + type + ymd + id + '/'
    initialId: 73900,   // first-day starting guess
    firstRange: 400,    // breadth on the first day (no lastHit)
    narrowBack: 10,     // subsequent days: start a bit before lastHit
    narrowCount: 30     // and scan forward this many (no widen)
  };

  const found = []; // {ymd, id, url}

  function setStatus(msg) { const el = $('#tf-status'); if (el) el.textContent = msg; }
  function addLine(text) {
    const box = $('#tf-results'); if (!box) return;
    const div = document.createElement('div'); div.textContent = text;
    box.appendChild(div); box.scrollTop = box.scrollHeight;
  }

  async function feedExists(url, politeMs) {
    try {
      const r = await fetch(url, { method: 'GET', credentials: 'include', cache: 'no-store' });
      if (politeMs) await sleep(politeMs);
      return r.ok;
    } catch {
      if (politeMs) await sleep(politeMs);
      return false;
    }
  }

  // Concurrent scan for [startId, startId+count)
  async function scanWindowConcurrent(ymd, type, startId, count, politeMs, conc) {
    const base = `${cfg.baseUrl}${type}/${ymd}/`;
    const end = startId + count;
    let nextId = Math.max(1, startId);
    let result = null;
    let active = 0;

    const worker = async () => {
      active++;
      try {
        while (!result && !stopFlag) {
          const id = nextId++;
          if (id >= end) break;
          const url = `${base}${id}/`;
          const ok = await feedExists(url, politeMs);
          if (ok) { result = { id, url }; break; }
        }
      } finally {
        active--;
      }
    };

    const workers = [];
    const slots = Math.max(1, Math.min(conc|0 || 1, 10));
    for (let i = 0; i < slots; i++) workers.push(worker());
    while (active > 0) await Promise.allSettled(workers);

    return result;
  }

  async function findForDate(ymd, type, lastHitId, politeMs, conc) {
    if (lastHitId) {
      // Narrow-only pass; if not found, return null (no widening)
      const start = Math.max(1, lastHitId - cfg.narrowBack);
      return await scanWindowConcurrent(ymd, type, start, cfg.narrowCount + cfg.narrowBack, politeMs, conc);
    }
    // First day: wide probe only
    return await scanWindowConcurrent(ymd, type, cfg.initialId, cfg.firstRange, politeMs, conc);
  }

  async function onScanFeeds() {
    stopFlag = false;
    found.length = 0;
    $('#tf-results').innerHTML = '';

    const from = $('#tf-from').value.trim();
    const to   = $('#tf-to').value.trim();
    const type = $('#tf-type').value;
    const skipSun = $('#tf-skip-sun').checked;
    const polite = Math.max(0, +$('#tf-delay').value || 0);
    const conc = Math.max(1, Math.min(+$('#tf-conc').value || 1, 10));

    const initialId   = +$('#tf-initial-id').value || cfg.initialId;
    const firstRange  = +$('#tf-first-range').value || cfg.firstRange;

    // Pass these into findForDate or override cfg for this run:
    cfg.initialId  = initialId;
    cfg.firstRange = firstRange;

    const start = ymdToDate(from);
    const end   = ymdToDate(to);
    if (!(from && to) || isNaN(start) || isNaN(end) || start > end) {
      setStatus('Bad date range.');
      return;
    }

    setStatus('Scanning feeds… (adaptive narrow, concurrent)');
    let lastHitId = null, dayCount = 0, hitCount = 0;

    for (let d = start; d <= end && !stopFlag; d = addDays(d, 1)) {
      if (skipSun && isSunday(d)) continue;
      const ymd = dateToYmd(d);
      setStatus(`Scanning ${ymd}…`);
      const hit = await findForDate(ymd, type, lastHitId, polite, conc);
      if (stopFlag) break;
      dayCount++;
      if (hit) {
        found.push({ ymd, id: hit.id, url: hit.url });
        lastHitId = hit.id;
        hitCount++;
        addLine(`✔ ${ymd}  → ${hit.url}`);
      } else {
        addLine(`✖ ${ymd}  (no hit in narrow window)`);
      }
    }
    setStatus(stopFlag ? 'Stopped.' : `Done. Days scanned: ${dayCount}. Hits: ${hitCount}.`);
  }

  // ---------- export helpers ----------
  function copyList() {
    if (!found.length) { setStatus('Nothing to copy. Run Scan first.'); return; }
    const text = found.map(x => x.url).join('\n');
    (async () => {
      try {
        if (typeof GM_setClipboard === 'function') GM_setClipboard(text);
        else if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text);
        setStatus(`Copied ${found.length} URL(s) to clipboard.`);
      } catch {
        setStatus('Copy failed (permissions). You can still Download.');
      }
    })();
  }

  function downloadList(fmt) {
    if (!found.length) { setStatus('Nothing to download. Run Scan first.'); return; }
    const stamp = new Date().toISOString().replace(/[:.]/g,'-');
    if (fmt === 'json') {
      const blob = JSON.stringify(found, null, 2);
      saveData(`times-feeds-${stamp}.json`, 'application/json', blob);
    } else {
      const header = 'date,id,url\n';
      const csv = header + found.map(x => `${x.ymd},${x.id},${x.url}`).join('\n');
      saveData(`times-feeds-${stamp}.csv`, 'text/csv', csv);
    }
  }

  function saveData(filename, mime, text) {
    const url = 'data:' + mime + ';charset=utf-8,' + encodeURIComponent(text);
    if (typeof GM_download === 'function') {
      GM_download({ url, name: filename, saveAs: false });
    } else {
      const a = document.createElement('a');
      a.href = url; a.download = filename; a.style.display = 'none';
      document.body.appendChild(a); a.click(); a.remove();
    }
  }

  // ---------- boot ----------
  (function init() {
    if (!document.body) return;
    mountToggle();
    mountPanel();
  })();
})();
