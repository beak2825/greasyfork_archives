// ==UserScript==
// @name         MyFitnessPal Full Export → ZIP (API Monthly + Weight)
// @namespace    http://github.com/1337-server
// @version      2.7
// @description  Fetch monthly diary via API, store month JSONs, extract per-day JSONs (gap-filled), and fetch 1-year weight report (normalized dates) into weight.json
// @author       1337-server
// @license      MIT
// @match        https://www.myfitnesspal.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/554485/MyFitnessPal%20Full%20Export%20%E2%86%92%20ZIP%20%28API%20Monthly%20%2B%20Weight%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554485/MyFitnessPal%20Full%20Export%20%E2%86%92%20ZIP%20%28API%20Monthly%20%2B%20Weight%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ─────────────────────────────────────────────────────────────
  // Config
  // ─────────────────────────────────────────────────────────────
  const JSZIP_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
  const FILESAVER_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js';
  const REQUEST_DELAY_MS = 900;
  const FALLBACK_EARLIEST_DATE = '2010-01-01';
  const MAX_MONTHS = 500;

  // Local “today” in YYYY-MM-DD (avoid UTC shifting)
  const tzOffsetMs = new Date().getTimezoneOffset() * 60000;
  const todayLocalISO = new Date(Date.now() - tzOffsetMs).toISOString().slice(0, 10);

  // ─────────────────────────────────────────────────────────────
  // Library loader
  // ─────────────────────────────────────────────────────────────
  function injectScript(url) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${url}"]`)) return resolve();
      const s = document.createElement('script');
      s.src = url;
      s.onload = () => setTimeout(resolve, 50);
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }
  async function ensureLibs() {
    if (!window.JSZip) await injectScript(JSZIP_CDN);
    if (!window.saveAs) await injectScript(FILESAVER_CDN);
  }

  // ─────────────────────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────────────────────
  GM_addStyle(`
    #mfp-export-panel {
      position: fixed; right: 14px; top: 14px; z-index: 2147483647;
      background: #111; color: #fff; font-family: Arial, sans-serif;
      padding: 10px; border-radius: 8px; width: 260px;
      box-shadow: 0 6px 18px rgba(0,0,0,.4); opacity: .95;
    }
    #mfp-export-panel input { width: 100%; margin-top: 4px; padding: 4px; border-radius: 4px; border: none; }
    #mfp-export-panel button { margin-top: 8px; padding: 6px 8px; width: 100%; cursor: pointer; border: none; border-radius: 4px; }
    #mfp-export-panel .status { font-size: 12px; margin-top: 8px; min-height: 34px; line-height: 1.2; color: #ddd; }
    #mfp-export-panel .progress { background:#222; border-radius:6px; padding:6px; margin-top:8px; font-size:12px; color:#aaa;}
  `);

  const panel = document.createElement('div');
  panel.id = 'mfp-export-panel';
  panel.innerHTML = `
    <div style="font-weight:700; font-size:14px;">MFP Exporter (API → Monthly, Daily & Weight)</div>
    <div style="font-size:12px; margin-top:6px;">Exports monthly diary, daily logs, and yearly weight data.</div>
    <label style="font-size:12px;">Start date:</label>
    <input type="date" id="mfp-start-date" value="2025-01-01">
    <label style="font-size:12px;">End date:</label>
    <input type="date" id="mfp-end-date" value="${todayLocalISO}">
    <button id="mfp-start">Start Export</button>
    <button id="mfp-stop" style="display:none; background:#a00; color:#fff;">Stop</button>
    <div class="status" id="mfp-status">Idle</div>
    <div class="progress" id="mfp-progress"></div>
  `;
  document.body.appendChild(panel);

  const btnStart = document.getElementById('mfp-start');
  const btnStop  = document.getElementById('mfp-stop');
  const statusEl = document.getElementById('mfp-status');
  const progEl   = document.getElementById('mfp-progress');
  const inputStart = document.getElementById('mfp-start-date');
  const inputEnd   = document.getElementById('mfp-end-date');

  let stopRequested = false;
  btnStop.addEventListener('click', () => { stopRequested = true; btnStop.style.display = 'none'; });
  btnStart.addEventListener('click', startExport);

  // ─────────────────────────────────────────────────────────────
  // Utils
  // ─────────────────────────────────────────────────────────────
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const logStatus = msg => { statusEl.textContent = msg; console.log('[MFP Exporter] ' + msg); };
  const setProgress = msg => { progEl.textContent = msg; };
  const iso = d => d.toISOString().slice(0, 10);

  function monthsBetween(startISO, endISO) {
    const s = new Date(startISO);
    const e = new Date(endISO);
    return (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
  }
  function addMonthsToISO(startISO, n) {
    const d = new Date(startISO);
    d.setUTCMonth(d.getUTCMonth() + n);
    return d.toISOString().slice(0, 7); // YYYY-MM
  }
  function monthNameFromISO(monthISO) {
    const [y, m] = monthISO.split('-').map(Number);
    const d = new Date(Date.UTC(y, m - 1, 1));
    return d.toLocaleString(undefined, { month: 'long' });
  }
  function yearFromISO(monthISO) {
    return monthISO.split('-')[0];
  }

  // Normalize YYYY-M-D → YYYY-MM-DD; return null if not parseable
  function normalizeISODateString(s) {
    const m = String(s || '').match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    return m ? `${m[1]}-${m[2].padStart(2,'0')}-${m[3].padStart(2,'0')}` : null;
  }

  // ─────────────────────────────────────────────────────────────
  // Username detection
  // ─────────────────────────────────────────────────────────────
  async function detectUsername() {
    const userEl = document.querySelector('a[href*="/profile/"], a[href*="/user/"], a[href*="/food/diary/"]');
    if (userEl && userEl.href) {
      const match = userEl.href.match(/\/(user|profile)\/([^\/]+)/);
      if (match && match[2]) return match[2];
    }
    try {
      const resp = await fetch('https://www.myfitnesspal.com/api/auth/csrf_token/', { credentials: 'include' });
      if (resp.ok) {
        const json = await resp.json();
        if (json?.user?.username) return json.user.username;
      }
    } catch (_) {}
    return prompt('Could not detect username automatically. Enter your MyFitnessPal username:');
  }

  // ─────────────────────────────────────────────────────────────
  // API fetch: monthly diaries  ✅ fixed end-of-month UTC issue
  // ─────────────────────────────────────────────────────────────
  async function fetchMonthlyDiaryAPI(username, monthISO) {
    const [yStr, mStr] = monthISO.split('-');
    const from = `${yStr}-${mStr}-01`;

    // Compute last day in LOCAL time and format directly as string (no toISOString)
    const lastDay = new Date(Number(yStr), Number(mStr), 0).getDate();
    const to = `${yStr}-${mStr}-${String(lastDay).padStart(2, '0')}`;

    const url = 'https://www.myfitnesspal.com/api/services/diary/report';
    const payload = {
      username,
      show_food_diary: 1,
      show_exercise_diary: 1,
      show_food_notes: 0,
      show_exercise_notes: 0,
      from,
      to
    };

    console.debug('[MFP Exporter] POST /diary/report', payload);

    const resp = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!resp.ok) throw new Error(`MFP diary fetch failed: ${resp.status}`);
    return await resp.json();
  }

  // ─────────────────────────────────────────────────────────────
  // API fetch: 1-year weight report (normalized)
  // ─────────────────────────────────────────────────────────────
  async function fetchWeightReport() {
    const url = 'https://www.myfitnesspal.com/api/services/reports/results/progress/1/365?report_name=weight';
    const resp = await fetch(url, { credentials: 'include', headers: { 'Accept': 'application/json' } });
    if (!resp.ok) throw new Error(`MFP weight fetch failed: ${resp.status}`);
    const json = await resp.json();
    const results = json?.outcome?.results || [];

    // Results are MM/DD across ~365 days, ordered. Assign years by rolling forward.
    const today = new Date(); // local
    let year = today.getFullYear() - 1;
    let prevM = 0, prevD = 0;

    const normalized = results.map(({ date, total }) => {
      const [mStr, dStr] = String(date).split('/');
      const m = parseInt(mStr, 10);
      const d = parseInt(dStr, 10);

      // Year roll-over when month/day decreases
      if (prevM && (m < prevM || (m === prevM && d < prevD))) {
        year += 1;
      }
      prevM = m; prevD = d;

      const outISO = `${year}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      return { date: outISO, weight: total };
    });

    // Safety: if last is somehow in the future, shift all back 1 year
    const last = normalized[normalized.length - 1];
    if (last && new Date(last.date) > today) {
      for (const entry of normalized) {
        const dt = new Date(entry.date);
        dt.setFullYear(dt.getFullYear() - 1);
        entry.date = dt.toISOString().slice(0, 10);
      }
    }

    return normalized;
  }

  // ─────────────────────────────────────────────────────────────
  // Extract per-day entries (monthly = array of days)
  //   ✅ accepts YYYY-M-D and pads; ✅ returns structured list
  // ─────────────────────────────────────────────────────────────
  function enumerateDaysFromMonthlyArray(reportArray) {
    if (!Array.isArray(reportArray)) return [];
    const out = [];
    for (const item of reportArray) {
      if (!item || typeof item !== 'object') continue;
      const raw = item.date || item.day || item.entry_date;
      const d = normalizeISODateString(raw);
      if (d) out.push({ date: d, payload: item });
    }
    return out;
  }

  // Fill missing calendar days in a month (MFP often omits zero-activity dates)
  function fillMissingDays(dayList, monthISO) {
    const [y, m] = monthISO.split('-').map(Number);
    const last = new Date(y, m, 0).getDate();
    const have = new Set(dayList.map(d => d.date));
    for (let dd = 1; dd <= last; dd++) {
      const iso = `${y}-${String(m).padStart(2,'0')}-${String(dd).padStart(2,'0')}`;
      if (!have.has(iso)) {
        dayList.push({ date: iso, payload: { date: iso, is_empty: true } });
      }
    }
    dayList.sort((a,b) => a.date.localeCompare(b.date));
    return dayList;
  }

  // ─────────────────────────────────────────────────────────────
  // Main export
  // ─────────────────────────────────────────────────────────────
  async function startExport() {
    stopRequested = false;
    btnStop.style.display = 'inline-block';
    btnStart.style.display  = 'none';
    logStatus('Preparing API export...');
    await ensureLibs();

    const zip = new JSZip();
    const monthFolder = zip.folder('monthly');
    const dailyRoot   = zip.folder('daily');

    const username = await detectUsername();
    logStatus('Detected user: ' + username);

    const earliest = inputStart.value || FALLBACK_EARLIEST_DATE;
    const endDate  = inputEnd.value || todayLocalISO;
    const totalMonths = monthsBetween(earliest, endDate);
    logStatus(`Fetching ${totalMonths + 1} months from ${earliest} to ${endDate}...`);

    if (totalMonths > MAX_MONTHS) {
      const ok = confirm(`About to iterate ${totalMonths + 1} months — continue?`);
      if (!ok) {
        btnStop.style.display = 'none';
        btnStart.style.display = 'inline-block';
        return;
      }
    }

    for (let i = 0; i <= totalMonths; i++) {
      if (stopRequested) break;

      const monthISO = addMonthsToISO(earliest, i);
      const y        = yearFromISO(monthISO);
      const mName    = monthNameFromISO(monthISO);
      const monthDailyFolderName = `${monthISO}_${mName}`;

      setProgress(`Fetching month ${monthISO} (${i + 1}/${totalMonths + 1})`);

      try {
        const report = await fetchMonthlyDiaryAPI(username, monthISO);

        // Save raw month
        monthFolder.file(`month-${monthISO}.json`, JSON.stringify(report, null, 2));

        // Extract per-day and fill gaps so every calendar day exists
        const yearFolder = dailyRoot.folder(y);
        const monthDailyFolder = yearFolder.folder(monthDailyFolderName);

        let days = enumerateDaysFromMonthlyArray(report);
        days = fillMissingDays(days, monthISO);

        if (days.length === 0) {
          monthDailyFolder.file(`_no-days-detected.txt`, `No per-day entries parsed for ${monthISO}.`);
        } else {
          for (const { date, payload } of days) {
            monthDailyFolder.file(`${date}.json`, JSON.stringify(payload, null, 2));
          }
        }

        await sleep(REQUEST_DELAY_MS);
      } catch (e) {
        monthFolder.file(`month-${monthISO}.json`, JSON.stringify({ month: monthISO, error: e.toString() }, null, 2));
      }
    }

    // ─── Fetch and normalize weight data ────────────────────────────
    try {
      setProgress('Fetching weight data (1 year)...');
      const normalized = await fetchWeightReport();
      zip.file('weight.json', JSON.stringify(normalized, null, 2));
    } catch (e) {
      zip.file('weight-error.json', JSON.stringify({ error: e.toString() }, null, 2));
    }

    // ─── Manifest ──────────────────────────────────────────────────
    const manifest = {
      created_at: new Date().toISOString(),
      mode: 'api-monthly+daily-folders+weight',
      username,
      start_date: earliest,
      end_date: endDate,
      structure: {
        monthly: '/monthly/month-YYYY-MM.json',
        daily:   '/daily/YYYY/YYYY-MM_MonthName/YYYY-MM-DD.json',
        weight:  '/weight.json'
      },
      notes: "Includes monthly diaries, per-day logs (gap-filled for missing calendar dates), and 1-year weight report (dates normalized to ISO)."
    };
    zip.file('manifest.json', JSON.stringify(manifest, null, 2));

    logStatus('Generating ZIP...');
    const blob = await zip.generateAsync({ type: 'blob' });
    const fname = `mfp_export_${earliest}_to_${endDate}.zip`;
    saveAs(blob, fname);
    logStatus('Download started: ' + fname);

    btnStop.style.display = 'none';
    btnStart.style.display = 'inline-block';
    setProgress('Done.');
  }
})();
