// ==UserScript==
// @name         DeepCo Statistics + Lag Fix & Optimization
// @namespace    https://greasyfork.org/en/users/1559634-korphd
// @version      2026-01-12 v1.01
// @description  same script as the one from Cosmin Deme, but no lag. performance fixes for lag.
// @match        https://*.deepco.app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deepco.app
// @license      MIT
// @grant        GM.setValue
// @grant        GM.getValue
// @require      https://code.highcharts.com/highcharts.js
// @require      https://code.highcharts.com/modules/boost.js
// @require      https://code.highcharts.com/modules/mouse-wheel-zoom.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/562452/DeepCo%20Statistics%20%2B%20Lag%20Fix%20%20Optimization.user.js
// @updateURL https://update.greasyfork.org/scripts/562452/DeepCo%20Statistics%20%2B%20Lag%20Fix%20%20Optimization.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  /**********************
   * STORAGE / KEYS
   **********************/
  const SCHEMA = [['Timestamp', 'Tile Count', 'RC', 'Level', 'DC', 'DCIncome', 'Processing Rating']];
  const DB_KEY = 'nudgeLogs';
  const VIS_KEY = 'chartVisibility';

  const RANGE_KEY = 'deepco_range_r7';
  const AUTO_KEY  = 'deepco_range_auto_r7';

  // DC/hr from toast (keep working r3 keys)
  const DC_ACC_KEY = 'deepco_dc_acc_since_reset_r3';
  const DC_RESET_TS_KEY = 'deepco_dc_reset_ts_r3';
  const DC_TOAST_DEDUPE_KEY = 'deepco_dc_toast_dedupe_r3';
  const CHART_HIDE_KEY = 'deepco_chart_hidden_r3';

  const CHART_ID = 'deepco-chart-container';
  const PANEL_ID = 'deepco-stats-panel';
  const RANGE_BAR_ID = 'deepco-rangebar';

  // HUD (live values)
  const HUD_ID = 'deepco-live-hud';

  // Totals HUD (separate, not chart stats)
  const TOTALS_HUD_ID = 'deepco-totals-hud';
  const TOTAL_DC_KEY = 'deepco_total_dc_since_reset_r7';
  const TOTAL_RC_KEY = 'deepco_total_rc_since_reset_r7';
  const TOTAL_RC_LAST_KEY = 'deepco_total_rc_last_seen_r7';
  const TOTAL_RESET_TS_KEY = 'deepco_totals_reset_ts_r7';


  const POLL_MS = 2500;
  const MAX_CHART_POINTS = 3000;
  const RANGE_ANIM_MS = 280;

  // ✅ Anti-spike warmup (DC/hr = 0 primele N secunde după baseline start)
  const DC_WARMUP_SECONDS = 10;

  // Time-to-finish-block: average interval between DC toasts over last minute
  const BLOCK_WINDOW_MS = 60_000;
  const BLOCK_BUF_KEEP_MS = 10 * 60_000;

  // ✅ reserve top space so HUD never overlaps plot
  const CHART_TOP_SPACING = 44; // tuned for 3 lines HUD

  /**********************
   * STATE
   **********************/
  let db = await GM.getValue(DB_KEY, SCHEMA);
  fixTimestamps(db);

  let myChart = null;
  // Chart redraw throttling (prevents lag when many points accumulate)
  let _chartRedrawScheduled = false;
  let _lastChartTsForExtremes = null;

  // OPTIMIZATION: Use requestAnimationFrame for smoother UI updates logic if available, fallback to timeout
  function scheduleChartRedraw(tsForExtremes) {
    if (tsForExtremes != null) _lastChartTsForExtremes = tsForExtremes;
    if (_chartRedrawScheduled) return;
    _chartRedrawScheduled = true;
    
    // Increased throttle slightly to 300ms to group more updates
    setTimeout(() => {
      _chartRedrawScheduled = false;
      if (!myChart) return;
      try { 
          // Check if we really need to redraw? Yes, data changed.
          myChart.redraw(); 
      } catch (_) {}
      try {
        if (rangeMode !== 'all' && _lastChartTsForExtremes != null) {
          applyRangeExtremes(_lastChartTsForExtremes);
        }
      } catch (_) {}
    }, 300);
  }


  // RC/hr since recursion baseline
  let recursionTime = null;
  let startingRC = null;
  let lastRC = null;

  /** @type {{ts:number, rc:number}[]} */
  let rcBuf = [];

  // DC state
  let dcAcc = Number(await GM.getValue(DC_ACC_KEY, 0)) || 0;
  let dcResetTs = Number(await GM.getValue(DC_RESET_TS_KEY, 0)) || 0;

  // Totals since reset (separate HUD)
  let totalDcSinceReset = Number(await GM.getValue(TOTAL_DC_KEY, 0)) || 0;
  let totalRcSinceReset = Number(await GM.getValue(TOTAL_RC_KEY, 0)) || 0;
  let totalRcLastSeen = await GM.getValue(TOTAL_RC_LAST_KEY, null);
  if (totalRcLastSeen !== null) totalRcLastSeen = Number(totalRcLastSeen);

  // Totals timer ("Time since reset" for Totals HUD)
  let totalsResetTs = Number(await GM.getValue(TOTAL_RESET_TS_KEY, 0)) || 0;
  if (!Number.isFinite(totalsResetTs) || totalsResetTs <= 0) totalsResetTs = Date.now();


  // DC toast timestamps (used to estimate time to finish block)
  /** @type {number[]} */
  let dcToastTimes = [];

  // Block-time event rules
  // - multiple popups in the same observer callback count as ONE event
  // - ignore events that happen faster than 0.3s
  const BLOCK_MIN_EVENT_GAP_MS = 300;
  let lastBlockEventTs = 0;
  let lastBlockAvgSec = null;

  // Toast dedupe
  let toastKeys = await GM.getValue(DC_TOAST_DEDUPE_KEY, []);
  if (!Array.isArray(toastKeys)) toastKeys = [];
  let toastKeySet = new Set(toastKeys);

  // Range selection + AUTO
  let rangeMode = (localStorage.getItem(RANGE_KEY) || 'all').toLowerCase();
  let autoFollow = (localStorage.getItem(AUTO_KEY) || '1') === '1';

  const RANGE_MS = {
    '1m': 60_000,
    '5m': 5 * 60_000,
    '10m': 10 * 60_000,
    '30m': 30 * 60_000,
    '1h': 60 * 60_000,
    'all': null
  };

  /**********************
   * UTILS
   **********************/
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  async function waitFor(fn, timeoutMs = 30000, stepMs = 200) {
    const t0 = Date.now();
    while (Date.now() - t0 < timeoutMs) {
      try { if (fn()) return true; } catch (_) {}
      await sleep(stepMs);
    }
    return false;
  }

  function fixTimestamps(arr) {
    if (!Array.isArray(arr) || arr.length === 0) return;
    for (let i = 1; i < arr.length; i++) {
      const ts = arr[i]?.[0];
      if (typeof ts === 'string') {
        const parsed = Date.parse(ts);
        if (Number.isFinite(parsed)) arr[i][0] = parsed;
      }
    }
  }

  function safeNumber(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }

  function safeText(v) {
    return (v == null) ? '' : String(v);
  }

  function parseFirstNumber(text) {
    if (!text) return 0;
    // Simple check before regex to speed up
    if (!/\d/.test(text)) return 0;
    const m = String(text).replace(/,/g, '').match(/[+-]?\d+(?:\.\d+)?/);
    return m ? safeNumber(m[0]) : 0;
  }

  function isDigPage() {
    return location.pathname === '/dig';
  }

  function clampSeries(series) {
    try {
      // OPTIMIZATION: Batch removal if significantly over limit
      const len = series.data.length;
      if (len > MAX_CHART_POINTS) {
         // remove excessive points
         // Note: shifting one by one in a loop is okay-ish because Highcharts handles array operations, 
         // but we rely on the scheduled redraw to actually render the changes.
         let toRemove = len - MAX_CHART_POINTS;
         while (toRemove > 0) {
             series.removePoint(0, false);
             toRemove--;
         }
      }
    } catch (_) {}
  }

  /**********************
   * HUD (live values) - top center, smaller, never overlaps plot
   **********************/
  function getChartAnchorRect() {
    const el = document.getElementById(CHART_ID);
    if (!el) return null;
    try {
      const r = el.getBoundingClientRect();
      if (!r || !Number.isFinite(r.top)) return null;
      return r;
    } catch (_) {
      return null;
    }
  }

  function positionOverlayHud(el, mode) {
    // Keep HUDs visible even when chart is hidden (SPA nav / toggle).
    // When chart exists, anchor near its top edge; otherwise fall back to viewport.
    const r = getChartAnchorRect();
    const topBase = r ? Math.max(6, Math.round(r.top) + 6) : 6;
    if (mode === 'center') {
      el.style.top = `${topBase}px`;
      el.style.left = '50%';
      el.style.right = '';
      el.style.transform = 'translateX(-50%)';
    } else if (mode === 'right') {
      el.style.top = `${topBase + 2}px`;
      el.style.right = '12px';
      el.style.left = '';
      el.style.transform = '';
    }
  }

  
  function hudsArePinnedInRangeBar() {
    const bar = document.getElementById(RANGE_BAR_ID);
    return !!(bar && bar.getAttribute('data-hud-mounted') === '1');
  }

function ensureHud() {
    let hud = document.getElementById(HUD_ID);
    if (hud) return hud;

    hud = document.createElement('div');
    hud.id = HUD_ID;
    hud.style.position = 'fixed';
    hud.style.zIndex = '2147483646';

    // smaller + compact to avoid touching plot
    hud.style.padding = '4px 6px';
    hud.style.borderRadius = '7px';
    hud.style.background = 'rgba(0,0,0,0.28)';
    hud.style.border = '1px solid rgba(255,255,255,0.14)';
    hud.style.pointerEvents = 'none';
    hud.style.whiteSpace = 'nowrap';
    hud.style.fontSize = '11px';
    hud.style.lineHeight = '1.18';

    document.documentElement.appendChild(hud);
    if (!hudsArePinnedInRangeBar()) positionOverlayHud(hud, 'center');
    return hud;
  }

  function fmt2(n) {
    const x = Number(n);
    return Number.isFinite(x) ? x.toFixed(2) : '0.00';
  }

  function fmt1(n) {
    const x = Number(n);
    return Number.isFinite(x) ? x.toFixed(1) : '0.0';
  }

  function fmtHMS(ms) {
    const t = Math.max(0, Math.floor(ms / 1000));
    const s = t % 60;
    const m = Math.floor(t / 60) % 60;
    const hTotal = Math.floor(t / 3600);
    const h = hTotal % 24;
    const d = Math.floor(hTotal / 24);
    const pad = (v) => String(v).padStart(2, '0');
    const core = `${pad(h)}:${pad(m)}:${pad(s)}`;
    return d > 0 ? `${d}d ${core}` : core;
  }

  function lastY(series) {
    const d = series?.data;
    if (!d || !d.length) return null;
    const p = d[d.length - 1];
    return (p && typeof p.y === 'number') ? p.y : null;
  }

  function updateHud() {
    if (!myChart) return;
    const hud = ensureHud();
    if (!hud) return;

    // Keep position synced with chart location (and still visible when chart hidden).
    // If HUD is pinned into the range bar, DON'T reposition (it would jump/disappear).
    if (!hudsArePinnedInRangeBar()) positionOverlayHud(hud, 'center');

    const s0 = myChart.series?.[0];
    const s1 = myChart.series?.[1];
    const s2 = myChart.series?.[2];
    const s3 = myChart.series?.[3];

    const lines = [];
    if (s0?.visible) lines.push(`RC/hr: ${fmt2(lastY(s0))}`);
    if (s1?.visible) lines.push(`RC/PastMinute: ${fmt2(lastY(s1))}`);
    if (s2?.visible) lines.push(`DC/hr: ${fmt2(lastY(s2))}`);
    if (s3?.visible) {
      const v = lastY(s3);
      const show = (v != null) ? v : lastBlockAvgSec;
      lines.push(`Time to finish block: ${show != null ? (fmt1(show) + 's') : '-'}`);
    }

    hud.innerHTML = lines.length ? lines.join('<br/>') : '';
  }

  /**********************
   * TOTALS HUD (separate; includes reset button)
   **********************/
  function ensureTotalsHud() {
    let box = document.getElementById(TOTALS_HUD_ID);
    if (box) return box;

    box = document.createElement('div');
    box.id = TOTALS_HUD_ID;
    box.style.position = 'fixed';
    box.style.zIndex = '2147483647';
    box.style.padding = '6px 8px';
    box.style.borderRadius = '8px';
    box.style.background = 'rgba(0,0,0,0.35)';
    box.style.border = '1px solid rgba(255,255,255,0.16)';
    box.style.whiteSpace = 'nowrap';
    box.style.fontSize = '12px';
    box.style.lineHeight = '1.25';
    box.style.display = 'flex';
    box.style.alignItems = 'flex-start';
    box.style.gap = '8px';

    const txt = document.createElement('div');
    txt.id = `${TOTALS_HUD_ID}-text`;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'Reset';
    btn.style.cursor = 'pointer';
    btn.style.padding = '4px 8px';
    btn.style.borderRadius = '6px';
    btn.style.border = '1px solid rgba(255,255,255,0.25)';
    btn.style.background = 'rgba(0,0,0,0.25)';
    btn.style.color = 'inherit';
    btn.style.font = 'inherit';
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      resetTotalsHud().catch(() => {});
    });

    box.appendChild(txt);
    box.appendChild(btn);
    document.documentElement.appendChild(box);
    if (!hudsArePinnedInRangeBar()) positionOverlayHud(box, 'right');
    return box;
  }

  function updateTotalsHud() {
    const box = ensureTotalsHud();
    if (!box) return;

    // Keep visible/positioned even when chart is hidden.
    if (!hudsArePinnedInRangeBar()) positionOverlayHud(box, 'right');
    const txt = document.getElementById(`${TOTALS_HUD_ID}-text`);
    if (!txt) return;

    const elapsedMs = Date.now() - (Number.isFinite(totalsResetTs) ? totalsResetTs : Date.now());
    txt.innerHTML =
      `Total DC since reset: <b>${safeNumber(totalDcSinceReset).toFixed(2)}</b>` +
      `<br/>Total RC since reset: <b>${safeNumber(totalRcSinceReset).toFixed(2)}</b>` +
      `<br/>Time since reset: <b>${fmtHMS(elapsedMs)}</b>`;
  }

  async function resetTotalsHud() {
    // reset only totals HUD (not chart stats, not DC/hr, not logs)
    totalDcSinceReset = 0;
    totalRcSinceReset = 0;

    // reset timer baseline for Totals HUD
    totalsResetTs = Date.now();

    // baseline RC for future diffs
    const rcNow = safeNumber(parseFirstNumber(getRCCount()));
    totalRcLastSeen = Number.isFinite(rcNow) ? rcNow : 0;

    await GM.setValue(TOTAL_DC_KEY, totalDcSinceReset);
    await GM.setValue(TOTAL_RC_KEY, totalRcSinceReset);
    await GM.setValue(TOTAL_RC_LAST_KEY, totalRcLastSeen);
    await GM.setValue(TOTAL_RESET_TS_KEY, totalsResetTs);

    updateTotalsHud();
  }

  async function addToTotalDc(delta) {
    // Rule: add ALL DC popups, regardless duplicates/time (no dedupe)
    totalDcSinceReset += delta;
    await GM.setValue(TOTAL_DC_KEY, totalDcSinceReset);
    updateTotalsHud();
  }

  async function updateTotalRcFromSnapshot(rcNow) {
    // Sum only positive increases; handle recursion drops by resetting baseline
    const rc = safeNumber(rcNow);
    if (totalRcLastSeen === null || !Number.isFinite(totalRcLastSeen)) {
      totalRcLastSeen = rc;
      await GM.setValue(TOTAL_RC_LAST_KEY, totalRcLastSeen);
      updateTotalsHud();
      return;
    }
    const d = rc - totalRcLastSeen;
    if (d > 0) {
      totalRcSinceReset += d;
      await GM.setValue(TOTAL_RC_KEY, totalRcSinceReset);
    }
    totalRcLastSeen = rc;
    await GM.setValue(TOTAL_RC_LAST_KEY, totalRcLastSeen);
    updateTotalsHud();
  }


  /**********************
   * DOM READERS
   **********************/
  function getTileCount() {
    const el = document.querySelector('#worker_tiles') || document.querySelector('[data-testid="worker_tiles"]');
    return el ? el.textContent : '';
  }

  function getRCCount() {
    const el = document.querySelector('span.flex:nth-child(2) > span:nth-child(1)');
    if (el) return el.textContent;

    const nodes = Array.from(document.querySelectorAll('span,div,p')).slice(0, 1200);
    for (const n of nodes) {
      const t = (n.textContent || '').trim();
      if ((/\bRC\b/i.test(t) || /RC:/i.test(t)) && /\d/.test(t)) return t;
    }
    return '';
  }

  function getLevel() {
    const el = document.querySelector('#worker_level') || document.querySelector('[data-testid="worker_level"]');
    return el ? el.textContent : '';
  }

  function getProcessingRating() {
    const el = document.querySelector('#processing_rating') || document.querySelector('[data-testid="processing_rating"]');
    return el ? el.textContent : '';
  }

  /**********************
   * DC FROM TOAST
   **********************/
  function extractDCDeltaFromText(text) {
    if (!text) return null;
    // OPTIMIZATION: string check before Regex
    if (!text.includes('DC') && !text.includes('dc')) return null;

    const t = String(text).replace(/,/g, ' ');
    const m = t.match(/\+?\s*([0-9]+(?:\.\d+)?)[ \t]*\[(DC)\]/i);
    if (!m) return null;
    const v = Number(m[1]);
    if (!Number.isFinite(v) || v <= 0) return null;
    return v;
  }

  function dcRateWithWarmup(ts, dcSnapshot, fallbackBaseTs) {
    if (!dcResetTs) return 0;

    const base = dcResetTs || fallbackBaseTs || ts;
    const elapsedMs = ts - base;

    if (elapsedMs < DC_WARMUP_SECONDS * 1000) return 0;

    const hours = elapsedMs / 3600_000;
    if (!(hours > 0)) return 0;

    const rate = dcSnapshot / hours;
    return Number.isFinite(rate) ? rate : 0;
  }

  function recordDcToast(ts) {
    const t = Number(ts) || Date.now();
    dcToastTimes.push(t);
    // keep only recent for performance
    const cutoff = t - BLOCK_BUF_KEEP_MS;
    while (dcToastTimes.length && dcToastTimes[0] < cutoff) dcToastTimes.shift();
  }

  // Record a "block finished" event based on DC toast timing rules:
  // - Multiple toasts in the same observer callback count as ONE event.
  // - Ignore if the last recorded event is < 0.3s ago.
  function recordBlockEvent(ts) {
    const t = Number(ts) || Date.now();
    if (lastBlockEventTs && (t - lastBlockEventTs) < BLOCK_MIN_EVENT_GAP_MS) return false;
    lastBlockEventTs = t;
    recordDcToast(t);
    return true;
  }

  function avgBlockTimeSecondsLastMinute(nowTs) {
    const now = Number(nowTs) || Date.now();
    const cutoff = now - BLOCK_WINDOW_MS;

    // find first index >= cutoff
    let startIdx = 0;
    while (startIdx < dcToastTimes.length && dcToastTimes[startIdx] < cutoff) startIdx++;

    const n = dcToastTimes.length - startIdx;
    if (n < 2) return lastBlockAvgSec;

    const first = dcToastTimes[startIdx];
    const last = dcToastTimes[dcToastTimes.length - 1];
    if (!(last > first)) return null;

    const avgMs = (last - first) / (n - 1);
    const sec = avgMs / 1000;
    if (Number.isFinite(sec)) {
      lastBlockAvgSec = sec;
      return sec;
    }
    return lastBlockAvgSec;
  }

  function countToastIfNew(delta, rawText) {
    const key = `${rawText}@@${performance.now().toFixed(3)}`;
    if (toastKeySet.has(key)) return false;

    toastKeySet.add(key);
    if (toastKeySet.size > 300) {
      const arr = Array.from(toastKeySet);
      toastKeySet = new Set(arr.slice(arr.length - 200));
    }
    GM.setValue(DC_TOAST_DEDUPE_KEY, Array.from(toastKeySet)).catch(() => {});

    if (!dcResetTs) {
      dcResetTs = Date.now();
      GM.setValue(DC_RESET_TS_KEY, dcResetTs).catch(() => {});
    }

    dcAcc += delta;
    GM.setValue(DC_ACC_KEY, dcAcc).catch(() => {});

    pushInstantDcPoint();
    return true;
  }

  // Toast observer can break on SPA navigations if <body> is replaced.
  // We keep a single observer instance and reattach whenever document.body changes.
  let __toastObserver = null;
  let __toastObservedBody = null;

  function ensureToastObserverAttached() {
    const body = document.body;
    if (!body) return;

    if (__toastObserver && __toastObservedBody === body) return;

    try { if (__toastObserver) __toastObserver.disconnect(); } catch (_) {}

    __toastObservedBody = body;
    __toastObserver = new MutationObserver((mutations) => {
      // Count all DC deltas, but record "block finish" timing at most once per callback.
      let hadAcceptedInThisCallback = false;
      
      // OPTIMIZATION: Avoid processing too many nodes if lag occurs
      let processedCount = 0;

      for (const m of mutations) {
        if (!m.addedNodes) continue;
        for (const node of m.addedNodes) {
          if (processedCount > 50) break; // Lag protection
          if (!(node instanceof HTMLElement)) continue;
          
          const text = (node.innerText || node.textContent || '').trim();
          // Fast fail
          if (!text || (!text.includes('DC') && !text.includes('dc'))) continue;
          
          processedCount++;

          const delta = extractDCDeltaFromText(text);
          if (delta == null) continue;

          // Totals HUD: count ALL DC popups (no dedupe)
          addToTotalDc(delta).catch(() => {});

          const accepted = countToastIfNew(delta, text);
          if (accepted) hadAcceptedInThisCallback = true;
        }
      }

      // Rules:
      // - multiple popups simultaneously => one event
      // - popups faster than 0.3s => ignore
      if (hadAcceptedInThisCallback) {
        const ts = Date.now();
        if (recordBlockEvent(ts)) {
          pushInstantBlockPoint(ts);
        }
      }
    });

    try {
      __toastObserver.observe(body, { childList: true, subtree: true });
    } catch (_) {}
  }

  function pushInstantDcPoint() {
    try {
      if (!myChart) return;

      const ts = Date.now();
      const fallbackBase = (db[1]?.[0] || ts);
      const dcSnap = safeNumber(dcAcc);
      const v2 = dcRateWithWarmup(ts, dcSnap, fallbackBase);

      myChart.series[2].addPoint([ts, v2], false, false);
      clampSeries(myChart.series[2]);
      
      // OPTIMIZATION: Don't redraw immediately, schedule it
      scheduleChartRedraw(ts);

      updateHud();
    } catch (_) {}
  }

  // Instant update for "Time to finish block" series when a valid event occurs.
  function pushInstantBlockPoint(ts) {
    try {
      if (!myChart) return;
      const t = Number(ts) || Date.now();
      const v3 = avgBlockTimeSecondsLastMinute(t);
      // If we still don't have enough samples, don't spam zeros.
      if (v3 == null) return;
      myChart.series[3].addPoint([t, v3], false, false);
      clampSeries(myChart.series[3]);
      
      // OPTIMIZATION: Schedule redraw instead of instant
      scheduleChartRedraw(t);
      
      updateHud();
    } catch (_) {}
  }

  /**********************
   * RC CALCS
   **********************/
  function pushRcBuf(ts, rc) {
    const prev = rcBuf.length ? rcBuf[rcBuf.length - 1].rc : null;
    if (Number.isFinite(prev) && rc < prev) rcBuf = [];
    rcBuf.push({ ts, rc });

    const cutoff = ts - (60_000 + 15_000);
    while (rcBuf.length && rcBuf[0].ts < cutoff) rcBuf.shift();
  }

  function rcHrSinceRecursion(ts, rc) {
    if (recursionTime == null || startingRC == null || (Number.isFinite(lastRC) && rc < lastRC)) {
      recursionTime = ts;
      startingRC = rc;
    }
    const hours = (ts - recursionTime) / 3600_000;
    const delta = rc - startingRC;
    if (!(hours > 0) || !(delta > 0)) return 0;
    return delta / hours;
  }

  function rcHrPastMinute(ts) {
    const cutoff = ts - 60_000;
    while (rcBuf.length && rcBuf[0].ts < cutoff) rcBuf.shift();
    if (rcBuf.length < 2) return null;

    const oldest = rcBuf[0];
    const newest = rcBuf[rcBuf.length - 1];

    const dRC = newest.rc - oldest.rc;
    if (!(dRC > 0)) return 0;

    const hours = (newest.ts - oldest.ts) / 3600_000;
    if (!(hours > 0)) return null;

    return dRC / hours;
  }

  /**********************
   * THEME
   **********************/
  function applyFontPatch() {
    try {
      const bodyStyles = getComputedStyle(document.body);
      const fontColor = bodyStyles.color || '#ccc';
      const bodyFont = bodyStyles.fontFamily || 'sans-serif';

      Highcharts.setOptions({
        chart: {
          backgroundColor: 'rgb(17, 17, 17)',
          style: { color: fontColor, fontFamily: bodyFont }
        },
        title: { style: { color: fontColor } },
        subtitle: { style: { color: fontColor } },
        xAxis: { labels: { style: { color: fontColor } } },
        yAxis: { labels: { style: { color: fontColor } } },
        legend: { itemStyle: { color: fontColor } },
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.85)',
          style: { color: fontColor }
        }
      });
    } catch (_) {}
  }

  /**********************
   * RANGE BUTTONS + AUTO
   **********************/
  function setRange(mode) {
    const m = (mode || 'all').toLowerCase();
    rangeMode = RANGE_MS[m] !== undefined ? m : 'all';
    localStorage.setItem(RANGE_KEY, rangeMode);
    mountHudsInRangeBar();
    updateRangeButtonsUI();
    applyRangeExtremes(Date.now());
  }

  function toggleAuto() {
    autoFollow = !autoFollow;
    localStorage.setItem(AUTO_KEY, autoFollow ? '1' : '0');
    updateRangeButtonsUI();
    if (autoFollow) applyRangeExtremes(Date.now());
  }

  function applyRangeExtremes(latestX) {
    if (!myChart) return;
    const ms = RANGE_MS[rangeMode];
    const xAxis = myChart.xAxis?.[0];
    if (!xAxis) return;

    if (!ms) {
      try { xAxis.setExtremes(null, null, true, false); } catch (_) {}
      return;
    }

    if (!autoFollow) return;

    const max = Number.isFinite(latestX) ? latestX : Date.now();
    const min = max - ms;

    try {
      xAxis.setExtremes(min, max, true, { duration: RANGE_ANIM_MS });
    } catch (_) {}
  }

  function updateRangeButtonsUI() {
    const bar = document.getElementById(RANGE_BAR_ID);
    if (!bar) return;


    // Keep HUDs pinned inside the range bar
    mountHudsInRangeBar();
    const btns = bar.querySelectorAll('button[data-range]');
    btns.forEach(b => {
      const r = (b.getAttribute('data-range') || '').toLowerCase();
      if (r === rangeMode) b.classList.add('active');
      else b.classList.remove('active');
    });

    const autoBtn = bar.querySelector('button[data-auto="1"]');
    if (autoBtn) {
      if (autoFollow && rangeMode !== 'all') autoBtn.classList.add('active');
      else autoBtn.classList.remove('active');
      autoBtn.textContent = autoFollow ? 'AUTO: ON' : 'AUTO: OFF';
    }

    const chartBtn = bar.querySelector('button[data-chart="1"]');
    if (chartBtn) {
      const hidden = isChartHidden();
      if (hidden) chartBtn.classList.add('active');
      else chartBtn.classList.remove('active');
      chartBtn.textContent = hidden ? 'CHART: OFF' : 'CHART: ON';
    }
  }

  
  /**********************
   * HUD PINS (keep HUDs fixed above chart, on same line as CHART toggle)
   * - Left: live series HUD (RC/hr, RC/pastminute, DC/hr, Time to finish block)
   * - Right: Totals HUD (Total DC/RC + timers + Reset)
   * Mounted inside the range bar so it doesn't "float" when scrolling.
   **********************/
  function mountHudsInRangeBar() {
    const bar = document.getElementById(RANGE_BAR_ID);
    if (!bar) return;

    // Build a 3-column grid: [left HUD] [buttons] [right HUD]
    if (bar.getAttribute('data-hud-mounted') !== '1') {
      const kids = Array.from(bar.childNodes);

      const left = document.createElement('div');
      left.id = `${RANGE_BAR_ID}-leftslot`;
      left.style.display = 'flex';
      left.style.alignItems = 'center';
      left.style.justifyContent = 'flex-start';
      left.style.minWidth = '0';

      const center = document.createElement('div');
      center.id = `${RANGE_BAR_ID}-centerslot`;
      center.style.display = 'flex';
      center.style.alignItems = 'center';
      center.style.justifyContent = 'center';
      center.style.gap = '8px';
      center.style.flexWrap = 'wrap';

      const right = document.createElement('div');
      right.id = `${RANGE_BAR_ID}-rightslot`;
      right.style.display = 'flex';
      right.style.alignItems = 'center';
      right.style.justifyContent = 'flex-end';
      right.style.minWidth = '0';

      // grid layout on bar
      bar.style.display = 'grid';
      bar.style.gridTemplateColumns = '1fr auto 1fr';
      bar.style.alignItems = 'center';
      bar.style.columnGap = '10px';
      bar.style.rowGap = '8px';
      bar.style.justifyContent = ''; // not used in grid
      bar.style.minHeight = '34px';

      // move all existing children into center
      bar.innerHTML = '';
      for (const k of kids) center.appendChild(k);

      bar.appendChild(left);
      bar.appendChild(center);
      bar.appendChild(right);

      bar.setAttribute('data-hud-mounted', '1');
    }

    const leftSlot = document.getElementById(`${RANGE_BAR_ID}-leftslot`);
    const rightSlot = document.getElementById(`${RANGE_BAR_ID}-rightslot`);
    if (!leftSlot || !rightSlot) return;

    // Ensure elements exist
    const liveHud = ensureHud();
    const totalsHud = ensureTotalsHud();

    // Re-parent HUDs into slots
    if (liveHud && liveHud.parentElement !== leftSlot) leftSlot.appendChild(liveHud);
    if (totalsHud && totalsHud.parentElement !== rightSlot) rightSlot.appendChild(totalsHud);

    // Make them non-floating (override fixed positioning)
    if (liveHud) {
      liveHud.style.position = 'relative';
      liveHud.style.top = '';
      liveHud.style.left = '';
      liveHud.style.right = '';
      liveHud.style.transform = '';
      liveHud.style.margin = '0';
    }
    if (totalsHud) {
      totalsHud.style.position = 'relative';
      totalsHud.style.top = '';
      totalsHud.style.left = '';
      totalsHud.style.right = '';
      totalsHud.style.transform = '';
      totalsHud.style.margin = '0';
    }
  }

function ensureRangeBar() {
    const panel = document.getElementById(PANEL_ID);
    if (!panel) return;

    if (document.getElementById(RANGE_BAR_ID)) return;

    const bar = document.createElement('div');
    bar.id = RANGE_BAR_ID;
    bar.style.display = 'flex';
    bar.style.justifyContent = 'center';
    bar.style.gap = '8px';
    bar.style.margin = '8px 0 10px 0';
    bar.style.flexWrap = 'wrap';

    const css = document.createElement('style');
    css.textContent = `
      #${RANGE_BAR_ID} button{
        cursor:pointer;
        padding:6px 10px;
        border-radius:6px;
        border:1px solid rgba(255,255,255,0.25);
        background: rgba(0,0,0,0.25);
        color: inherit;
        font: inherit;
        user-select:none;
      }
      #${RANGE_BAR_ID} button.active{
        border-color: rgba(255,255,255,0.8);
        background: rgba(255,255,255,0.12);
      }
      #${RANGE_BAR_ID} button[data-auto="1"]{
        border-style: dashed;
      }

      #${RANGE_BAR_ID} button[data-chart="1"]{
        border-style: dashed;
      }
    

/* Friendlier action buttons (Export / Reset) */
#deepco-action-buttons{
  display:flex;
  justify-content:center;
  gap:10px;
  flex-wrap:wrap;
  margin: 12px 0 0 0;
}
#deepco-action-buttons .deepco-action-btn{
  cursor:pointer;
  padding:8px 14px;
  border-radius:10px;
  border:1px solid rgba(255,255,255,0.25);
  background: rgba(255,255,255,0.06);
  color: inherit;
  font: inherit;
  font-weight: 600;
  letter-spacing: .2px;
  user-select:none;
  transition: transform .06s ease, background .12s ease, border-color .12s ease;
}
#deepco-action-buttons .deepco-action-btn:hover{
  background: rgba(255,255,255,0.10);
  border-color: rgba(255,255,255,0.40);
}
#deepco-action-buttons .deepco-action-btn:active{
  transform: translateY(1px);
  background: rgba(255,255,255,0.14);
}
    `;
    document.head.appendChild(css);

    const defs = [
      ['1m', '1M'],
      ['5m', '5M'],
      ['10m', '10M'],
      ['30m', '30M'],
      ['1h', '1HR'],
      ['all', 'All'],
    ];

    for (const [k, label] of defs) {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = label;
      b.setAttribute('data-range', k);
      b.addEventListener('click', () => {
      // Period buttons force AUTO follow for the chart
      autoFollow = true;
      localStorage.setItem(AUTO_KEY, '1');
      setRange(k);
    });
      bar.appendChild(b);
    }

    const autoBtn = document.createElement('button');
    autoBtn.type = 'button';
    autoBtn.setAttribute('data-auto', '1');
    autoBtn.addEventListener('click', toggleAuto);
    bar.appendChild(autoBtn);


    // Chart toggle button (same style as range buttons)
    const chartBtn = document.createElement('button');
    chartBtn.type = 'button';
    chartBtn.id = 'deepco-toggle-chart-btn';
    chartBtn.setAttribute('data-chart', '1');
    chartBtn.addEventListener('click', () => {
      setChartHidden(!isChartHidden());
    });
    bar.appendChild(chartBtn);

    const chartDiv = document.getElementById(CHART_ID);
    if (chartDiv && chartDiv.parentElement === panel) {
      panel.insertBefore(bar, chartDiv);
    } else {
      panel.appendChild(bar);
    }

    updateRangeButtonsUI();
  }

  /**********************
   * PANEL / EXPORT / RESET
   **********************/
  async function initPanelIfNeeded() {
    const ready = await waitFor(() => document.getElementById('main-panel'), 60000);
    if (!ready) return;

    const grid = document.getElementById('main-panel');
    if (!grid) return;

    if (!document.getElementById(PANEL_ID)) {
      const panelContainer = document.createElement('div');
      panelContainer.id = PANEL_ID;
      panelContainer.className = 'grid-wrapper';

      const chartContainer = document.createElement('div');
      chartContainer.id = CHART_ID;
      chartContainer.style.minHeight = '320px';
      const btnContainer = document.createElement('div');
      btnContainer.id = 'deepco-action-buttons';
      btnContainer.style.display = 'flex';
      btnContainer.style.justifyContent = 'center';
      btnContainer.style.gap = '10px';

      const exportBtn = document.createElement('button');
      exportBtn.className = 'deepco-action-btn';
      exportBtn.textContent = 'Export Player Stats';
      exportBtn.addEventListener('click', exportStats);
      btnContainer.appendChild(exportBtn);

      const resetBlockBtn = document.createElement('button');
      resetBlockBtn.className = 'deepco-action-btn';
      resetBlockBtn.textContent = 'Reset Block Time';
      resetBlockBtn.addEventListener('click', resetBlockTimeStats);
      btnContainer.appendChild(resetBlockBtn);

      const resetBtn = document.createElement('button');
      resetBtn.className = 'deepco-action-btn';
      resetBtn.textContent = 'Reset Stats';
      resetBtn.addEventListener('click', resetStats);
      btnContainer.appendChild(resetBtn);
      panelContainer.appendChild(chartContainer);
      panelContainer.appendChild(btnContainer);
      grid.appendChild(panelContainer);
    }

    ensureRangeBar();
    applyChartHiddenState();
  }

  
  function isChartHidden() {
    try { return localStorage.getItem(CHART_HIDE_KEY) === '1'; } catch (e) { return false; }
  }

  function setChartHidden(hidden) {
    try { localStorage.setItem(CHART_HIDE_KEY, hidden ? '1' : '0'); } catch (e) {}
    applyChartHiddenState();
  }

  function applyChartHiddenState() {
    const chartEl = document.getElementById(CHART_ID);
    const hidden = isChartHidden();

    if (chartEl) {
      // Hide ONLY the Highcharts drawing area so the HUD-urile (fixed) remain visible.
      // We also collapse the chart container height to avoid leaving empty space.
      const hc = chartEl.querySelector('.highcharts-container');
      if (hidden) {
        if (!chartEl.dataset.deepcoOrigMinH) chartEl.dataset.deepcoOrigMinH = chartEl.style.minHeight || '';
        if (!chartEl.dataset.deepcoOrigH) chartEl.dataset.deepcoOrigH = chartEl.style.height || '';
        if (hc) hc.style.display = 'none';
        chartEl.style.overflow = 'hidden';
        chartEl.style.minHeight = '0px';
        chartEl.style.height = '0px';
        chartEl.style.padding = '0px';
        chartEl.style.margin = '0px';
      } else {
        if (hc) hc.style.display = '';
        chartEl.style.overflow = '';
        chartEl.style.padding = '';
        chartEl.style.margin = '';
        chartEl.style.minHeight = chartEl.dataset.deepcoOrigMinH || '320px';
        chartEl.style.height = chartEl.dataset.deepcoOrigH || '';
      }
    }

    // Update button UI (in range bar)
    updateRangeButtonsUI();

    // If we just showed the chart, Highcharts needs a reflow to size correctly.
    if (!hidden && window.myChart && typeof window.myChart.reflow === 'function') {
      setTimeout(() => { try { window.myChart.reflow(); } catch (e) {} }, 50);
    }
  }



  async function exportStats() {
    const rows = await GM.getValue(DB_KEY, SCHEMA);
    const csv = rows.map(r => r.map(v => (v == null ? '' : String(v))).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'deepco_player_stats.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function resetBlockTimeStats() {
    if (!confirm('Reset only the "Time to finish block" statistic?')) return;

    dcToastTimes = [];
    lastBlockEventTs = 0;
    lastBlockAvgSec = null;

    if (myChart) {
      try {
        if (myChart.series && myChart.series[3]) myChart.series[3].setData([], false);
        myChart.redraw();
        if (rangeMode !== 'all') applyRangeExtremes(Date.now());
        updateHud();
      } catch (_) {}
    }
  }

  async function resetStats() {
    if (!confirm('Are you sure you want to clear player stats?')) return;

    db = SCHEMA;
    recursionTime = null;
    startingRC = null;
    lastRC = null;
    rcBuf = [];

    dcAcc = 0;
    dcResetTs = 0;
    dcToastTimes = [];
    lastBlockEventTs = 0;
    lastBlockAvgSec = null;
    await GM.setValue(DC_ACC_KEY, dcAcc);
    await GM.setValue(DC_RESET_TS_KEY, dcResetTs);

    await GM.setValue(DB_KEY, db);

    if (myChart) {
      try {
        myChart.series.forEach(s => s.setData([], false));
        myChart.redraw();
        applyRangeExtremes(Date.now());
        updateHud();
      } catch (_) {}
    }

    alert('Tile logs have been cleared.');
  }

  /**********************
   * BUILD INITIAL SERIES
   **********************/
  function buildInitialSeries() {
    const s0 = [];
    const s1 = [];
    const s2 = [];
    const s3 = [];

    recursionTime = null;
    startingRC = null;
    lastRC = null;
    rcBuf = [];

    // rebuild toast times from stored DC snapshots (DC increases == toast event)
    dcToastTimes = [];
    lastBlockAvgSec = null;
    let prevDc = 0;

    const fallbackBase = (db[1]?.[0] || Date.now());

    for (let i = 1; i < db.length; i++) {
      const ts = db[i][0];
      const rc = db[i][2];
      const dcSnap = db[i][4];

      if (!Number.isFinite(ts) || !Number.isFinite(rc)) continue;

      pushRcBuf(ts, rc);

      const v0 = rcHrSinceRecursion(ts, rc);
      const v1 = rcHrPastMinute(ts);

      const dcVal = Number.isFinite(dcSnap) ? dcSnap : 0;
      const v2 = dcRateWithWarmup(ts, dcVal, fallbackBase);

      // infer DC toast when DC snapshot increases
      if (dcVal > prevDc) {
        recordDcToast(ts);
        prevDc = dcVal;
      } else if (dcVal < prevDc) {
        // reset detected in history
        dcToastTimes = [];
        prevDc = dcVal;
      }

      const v3 = avgBlockTimeSecondsLastMinute(ts);

      s0.push([ts, v0]);
      if (v1 != null) s1.push([ts, v1]);
      s2.push([ts, v2]);
      s3.push([ts, v3]);

      lastRC = rc;
    }

    return [s0, s1, s2, s3];
  }

  /**********************
   * SERIES VISIBILITY persistence
   **********************/
  function restoreSeriesVisibility(chart) {
    try {
      const raw = localStorage.getItem(VIS_KEY);
      if (!raw) return;
      const vis = JSON.parse(raw);
      if (!Array.isArray(vis)) return;
      chart.series.forEach((s, i) => { if (vis[i] === false) s.hide(); });
    } catch (_) {}
  }

  function attachLegendPersistence(chart) {
    chart.update({
      plotOptions: {
        series: {
          events: {
            legendItemClick: function () {
              const visibility = this.chart.series.map(s => s.visible);
              localStorage.setItem(VIS_KEY, JSON.stringify(visibility));
              setTimeout(updateHud, 0);
            }
          }
        }
      }
    }, false);
  }

  /**********************
   * CHART INIT (title left, HUD centered, top spacing reserved)
   **********************/
  async function initChartOnce() {
    if (!isDigPage()) return;

    const panelReady = await waitFor(() => document.getElementById('main-panel'), 60000);
    if (!panelReady) return;

    const container = document.getElementById(CHART_ID);
    if (!container) return;

    const hcReady = await waitFor(() => window.Highcharts && typeof Highcharts.chart === 'function', 30000);
    if (!hcReady) return;

    applyFontPatch();

    if (myChart) return;

    const [s0, s1, s2, s3] = buildInitialSeries();

    myChart = Highcharts.chart(CHART_ID, {

      boost: { enabled: true, useGPUTranslations: true, usePreAllocated: true },

      chart: {
        spacingTop: CHART_TOP_SPACING,
        zooming: { type: 'x', mouseWheel: { enabled: false, type: 'x' } }
      },

      // ✅ moved from center to left
      title: { text: 'RC/hr & DC/hr', align: 'left' },
      subtitle: {
        align: 'left',
        text: document.ontouchstart === undefined
          ? 'Click and drag in the plot area to zoom in'
          : 'Pinch the chart to zoom in'
      },

      xAxis: {
        type: 'datetime',
        events: {
          afterSetExtremes: function (e) {
            if (e && e.trigger) {
              autoFollow = false;
              localStorage.setItem(AUTO_KEY, '0');
              updateRangeButtonsUI();
            }
          }
        }
      },
      yAxis: [{ title: { text: 'per hour' } }, { title: { text: 'seconds' }, opposite: true }],
      legend: {
        enabled: true,
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'bottom'
      },
      plotOptions: {
        series: {
          animation: false,
          marker: { enabled: false },
          states: { hover: { enabled: false } },
          turboThreshold: 50000,
          boostThreshold: 1000
        }
      },
      series: [{
        name: 'RC/hr (Since Recursion)',
        data: s0,
        color: '#4aa3ff'
      }, {
        name: 'RC/hr (Past Minute)',
        data: s1,
        color: 'red'
      }, {
        name: 'DC/hr (Since Reset)',
        data: s2,
        color: '#f4c430'
      }, {
        name: 'Time to finish block (avg 1m)',
        data: s3,
        color: 'green',
        yAxis: 1
      }],
      tooltip: {
        shared: true,
        animation: false,
        hideDelay: 0,
        useHTML: true,
        outside: false,
        formatter: function () {
          const dt = new Date(this.x);
          let out = `${dt.toLocaleDateString()} ${dt.toLocaleTimeString()}`;
          const pts = this.points || [];
          for (const p of pts) {
            if (!p || !p.series) continue;
            if (p.series && String(p.series.name).startsWith('Time to finish block')) {
              out += `<br/>${p.series.name}: ${Number(p.y).toFixed(1)}s`;
            } else {
              out += `<br/>${p.series.name}: ${Number(p.y).toFixed(2)}`;
            }
          }
          return out;
        }
      },
      credits: { enabled: false }
    });
    window.myChart = myChart;
    applyChartHiddenState();

    restoreSeriesVisibility(myChart);
    attachLegendPersistence(myChart);

    ensureRangeBar();
    updateRangeButtonsUI();

    ensureHud();
    updateHud();

    ensureTotalsHud();
    updateTotalsHud();

    if (rangeMode !== 'all') applyRangeExtremes(Date.now());

    requestAnimationFrame(() => { try { myChart.reflow(); } catch (_) {} });
    setTimeout(() => { try { myChart.reflow(); } catch (_) {} }, 200);
    window.addEventListener('resize', () => { try { myChart.reflow(); } catch (_) {} });
  }

  /**********************
   * SNAPSHOT + UPDATE (poll)
   **********************/
  async function logSnapshotAndUpdate() {
    const ts = Date.now();

    const tileCount = safeNumber(getTileCount());
    const rc = safeNumber(parseFirstNumber(getRCCount()));
    // Totals HUD: sum RC increases since reset
    updateTotalRcFromSnapshot(rc).catch(() => {});
    const level = safeNumber(getLevel());
    const rating = safeText(getProcessingRating());

    const dcSinceReset = safeNumber(dcAcc);
    const row = [ts, tileCount, rc, level, dcSinceReset, 0, rating];
    db.push(row);
    await GM.setValue(DB_KEY, db);

    if (!myChart) return;

    pushRcBuf(ts, rc);

    const v0 = rcHrSinceRecursion(ts, rc);
    const v1 = rcHrPastMinute(ts);

    const fallbackBase = (db[1]?.[0] || ts);
    const v2 = dcRateWithWarmup(ts, dcSinceReset, fallbackBase);
    const v3Raw = avgBlockTimeSecondsLastMinute(ts);
    const v3 = (v3Raw != null) ? v3Raw : (lastBlockAvgSec != null ? lastBlockAvgSec : null);

    myChart.series[0].addPoint([ts, v0], false, false);
    if (v1 != null) myChart.series[1].addPoint([ts, v1], false, false);
    myChart.series[2].addPoint([ts, v2], false, false);
    // Keep the line stable: if we have no new sample, carry forward last known value.
    if (v3 != null) myChart.series[3].addPoint([ts, v3], false, false);

    clampSeries(myChart.series[0]);
    clampSeries(myChart.series[1]);
    clampSeries(myChart.series[2]);
    clampSeries(myChart.series[3]);

    // OPTIMIZATION: Do not force redraw here. Schedule it.
    scheduleChartRedraw(ts);

    lastRC = rc;
    updateHud();
  }

  async function pollLoop() {
    await logSnapshotAndUpdate();
    setInterval(async () => {
      try { await logSnapshotAndUpdate(); } catch (_) {}
    }, POLL_MS);
  }

  /**********************
   * SPA NAV FIX
   **********************/
  let lastPath = location.pathname;

  async function onRouteMaybeChanged() {
    if (location.pathname === lastPath) return;
    lastPath = location.pathname;

    if (!isDigPage()) {
      const panel = document.getElementById(PANEL_ID);
      if (panel) panel.remove();
      const hud = document.getElementById(HUD_ID);
      if (hud) hud.remove();
      const totals = document.getElementById(TOTALS_HUD_ID);
      if (totals) totals.remove();
      myChart = null;
      return;
    }

    await initPanelIfNeeded();
    await initChartOnce();
  }

  function hookHistory(fnName) {
    const original = history[fnName];
    history[fnName] = function () {
      const ret = original.apply(this, arguments);
      Promise.resolve().then(() => { ensureToastObserverAttached(); return onRouteMaybeChanged(); });
      return ret;
    };
  }

  function startSpaWatcher() {
    hookHistory('pushState');
    hookHistory('replaceState');
    window.addEventListener('popstate', () => { ensureToastObserverAttached(); onRouteMaybeChanged().catch(() => {}); });
    setInterval(() => {
      ensureToastObserverAttached();
      onRouteMaybeChanged().catch(() => {});
    }, 500);
  }

  /**********************
   * BOOT
   **********************/
  await waitFor(() => document.body, 30000);

  ensureToastObserverAttached();
  startSpaWatcher();

  await initPanelIfNeeded();
  if (isDigPage()) await initChartOnce();

  // Persist Totals HUD timer baseline if missing, and keep "Time since reset" live.
  if (!window.__deepco_totals_timer_inited_r7m__) {
    window.__deepco_totals_timer_inited_r7m__ = true;
    try {
      // ensure the baseline exists in storage (so refresh keeps the same elapsed time)
      if (!Number.isFinite(Number(await GM.getValue(TOTAL_RESET_TS_KEY, 0))) || Number(await GM.getValue(TOTAL_RESET_TS_KEY, 0)) <= 0) {
        await GM.setValue(TOTAL_RESET_TS_KEY, totalsResetTs);
      }
    } catch (_) {}

    setInterval(() => {
      try {
        if (!isDigPage()) return;
        if (document.getElementById(TOTALS_HUD_ID)) updateTotalsHud();
      } catch (_) {}
    }, 1000);
  }

  if (!window.__deepco_stats_poll_started_r7g__) {
    window.__deepco_stats_poll_started_r7g__ = true;
    await pollLoop();
  }
})();


/* === AVG POWER HUD (avg power/m) + RESET + CSV EXPORT ===
   Cerință:
   - HUD: doar "avg power/m" (cu reset + export)
   - Calcul:
       1) aduni toate cifrele negative care apar pe ecran într-o perioadă de 1 minut
       2) împarți la 60 (secunde) => medie pe secundă
       3) împarți la (atacuri/sec) derivat din "CS:" (în secunde). Exemplu CS: 0.5s => 2 atacuri/sec => împarți la 2.
          Echivalent: înmulțești cu CS (secunde/atac).
     CS se poate schimba; aplicăm ajustarea pe fiecare secundă și facem media pe ultimele 60 secunde.
*/
(function () {
  'use strict';

  const ROOT_ID   = 'deepco-avg-power-root';
  const SEC_ID    = 'deepco-avg-power-sec';
  const MIN_ID    = 'deepco-avg-power-min';
  const RESET_ID  = 'deepco-avg-power-reset';
  const EXPORT_ID = 'deepco-avg-power-export';

  // ---- capture negatives (fast floaters) ----
  let secSum = 0; // sum of negative numbers observed within current 1s bucket

  // Matches: "-97", "- 97", "-1,234.56", "-1234,56"
  // OPTIMIZATION: Created once, reused.
  const NEG_RE = /-\s*\d{1,3}(?:[.,]\d{3})*(?:[.,]\d+)?|-\s*\d+(?:[.,]\d+)?/g;

  function parseNegatives(text) {
    if (!text) return [];
    // OPTIMIZATION: Critical check. If no minus sign, don't run Regex. 
    // This avoids checking every timer, resource counter, etc.
    if (text.indexOf('-') === -1) return [];

    const m = String(text).match(NEG_RE);
    if (!m) return [];
    const out = [];
    for (let s of m) {
      s = s.replace(/\s+/g, '');
      const hasComma = s.includes(',');
      const hasDot = s.includes('.');
      if (hasComma && hasDot) {
        // comma thousands, dot decimals
        s = s.replace(/,/g, '');
      } else if (hasComma && !hasDot) {
        // comma decimals
        s = s.replace(',', '.');
      }
      const v = Number(s);
      if (Number.isFinite(v) && v < 0) out.push(v);
    }
    return out;
  }

  function startObserver() {
    const mo = new MutationObserver((mutations) => {
      // OPTIMIZATION: If too many mutations pile up (lag), process fewer.
      if (mutations.length > 500) return; 

      for (const mut of mutations) {
        if (mut.type === 'characterData') {
          const vals = parseNegatives(mut.target && mut.target.data);
          for (const v of vals) secSum += v;
          continue;
        }
        if (mut.addedNodes && mut.addedNodes.length) {
          for (const n of mut.addedNodes) {
            if (!n) continue;
            // Check node type to avoid property access on irrelevant nodes
            if (n.nodeType === 3) { // Text node
              const vals = parseNegatives(n.nodeValue);
              for (const v of vals) secSum += v;
            } else if (n.nodeType === 1) { // Element
              const vals = parseNegatives(n.textContent);
              for (const v of vals) secSum += v;
            }
          }
        }
      }
    });

    // OPTIMIZATION: Target specific container if known, otherwise Body. 
    // Removed documentElement (don't need to watch <head>)
    mo.observe(document.body || document.documentElement, {
      subtree: true,
      childList: true,
      characterData: true
    });
  }

  // ---- CS (attack period in seconds) ----
  let lastCsSeconds = 1.0;

  function readCsSeconds() {
    // Robust scan for: "CS: 0.5s" / "CS : 0.5 s" / "CS 0.5s"
    // We intentionally keep it tolerant to UI changes.
    const re = /\bCS\s*:\s*([0-9]+(?:\.[0-9]+)?)\s*s\b/i;

    try {
      // OPTIMIZATION: Limit tree walker depth or assume CS is visible
      const walker = document.createTreeWalker(
        document.body || document.documentElement,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode(node) {
            const t = node && node.nodeValue;
            if (!t) return NodeFilter.FILTER_REJECT;
            // Simple string check before Regex
            return t.includes('CS') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
          }
        }
      );

      let node;
      let count = 0;
      while ((node = walker.nextNode())) {
        if (count++ > 50) break; // Don't scan forever if not found
        const t = node.nodeValue;
        const m = t.match(re);
        if (m) {
          const v = Number(m[1]);
          if (Number.isFinite(v) && v > 0) {
            lastCsSeconds = v;
            return lastCsSeconds;
          }
        }
      }
    } catch (_) {}

    return lastCsSeconds;
  }

  // ---- rolling 60s window (per-second, CS-adjusted) ----
  const WIN = 60;
  const adjRing = new Array(WIN).fill(0); // each entry: secSum * csSeconds (negative)
  let ringIdx = 0;
  let adjSumTot = 0;

  // session log (one row per second)
  const sessionRows = [];

  function resetAll() {
    secSum = 0;
    lastCsSeconds = 1.0;

    adjSumTot = 0;
    for (let i = 0; i < WIN; i++) adjRing[i] = 0;
    ringIdx = 0;

    sessionRows.length = 0;

    const secEl = document.getElementById(SEC_ID);
    const minEl = document.getElementById(MIN_ID);
    if (minEl) minEl.textContent = '0.00';
    if (secEl) secEl.textContent = '0.00';
  }

  function exportSessionCsv() {
    // Includes CS to help validate calculations when CS changes.
    const header = ['ts_iso','cs_s','sum_neg_1s','avg_power_s','adj_sum_1s','avg_power_m'];
    const lines = [header.join(',')];

    for (const r of sessionRows) {
      lines.push([
        r.ts,
        String(r.cs),
        String(r.sum1s),
        String(r.avgS),
        String(r.adj1s),
        String(r.avgM)
      ].join(','));
    }

    const csv = lines.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    a.href = url;
    a.download = `avg-power-m-session-${stamp}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // ---- HUD creation + placement ----
  function makeHud() {
    let root = document.getElementById(ROOT_ID);
    if (root) return root;

    root = document.createElement('div');
    root.id = ROOT_ID;

    // Root: row with left stacked metrics + right buttons
    root.style.display = 'inline-flex';
    root.style.flexDirection = 'row';
    root.style.alignItems = 'center';
    root.style.gap = '10px';
    root.style.padding = '4px 8px';
    root.style.borderRadius = '8px';
    root.style.background = 'rgba(0,0,0,0.35)';
    root.style.border = '1px solid rgba(255,255,255,0.16)';
    root.style.fontSize = '12px';
    root.style.whiteSpace = 'nowrap';
    root.style.color = '#ffb3b3';
    root.style.pointerEvents = 'auto';

    const left = document.createElement('div');
    left.style.display = 'flex';
    left.style.flexDirection = 'column';
    left.style.gap = '2px';
    left.style.alignItems = 'flex-start';

    const row = (labelText, valueId) => {
      const r = document.createElement('div');
      r.style.display = 'flex';
      r.style.alignItems = 'center';
      r.style.gap = '6px';

      const lab = document.createElement('span');
      lab.textContent = labelText;

      const val = document.createElement('span');
      val.id = valueId;
      val.textContent = '0.00';
      val.style.fontWeight = '700';

      r.appendChild(lab);
      r.appendChild(val);
      return r;
    };

    left.appendChild(row('avg power/s:', SEC_ID));
    left.appendChild(row('avg power/m:', MIN_ID));

    const right = document.createElement('div');
    right.style.display = 'flex';
    right.style.flexDirection = 'row';
    right.style.gap = '6px';
    right.style.alignItems = 'center';

    const btn = (id, text) => {
      const b = document.createElement('button');
      b.id = id;
      b.type = 'button';
      b.textContent = text;
      b.style.fontSize = '11px';
      b.style.padding = '2px 6px';
      b.style.borderRadius = '6px';
      b.style.border = '1px solid rgba(255,255,255,0.25)';
      b.style.background = 'rgba(255,255,255,0.08)';
      b.style.color = 'inherit';
      b.style.cursor = 'pointer';
      return b;
    };

    const resetBtn = btn(RESET_ID, 'reset');
    resetBtn.addEventListener('click', resetAll);

    const exportBtn = btn(EXPORT_ID, 'export CSV');
    exportBtn.addEventListener('click', exportSessionCsv);

    right.appendChild(resetBtn);
    right.appendChild(exportBtn);

    root.appendChild(left);
    root.appendChild(right);

    return root;
  }

  function attachHud() {
    const root = makeHud();

    const totals = document.getElementById('deepco-totals-hud');
    if (totals && totals.parentElement) {
      // Insert immediately before TOTAL DC/RC HUD
      if (root.parentElement !== totals.parentElement || root.nextSibling !== totals) {
        totals.parentElement.insertBefore(root, totals);
      }
      // ensure normal flow (inline, same row)
      root.style.position = '';
      root.style.right = '';
      root.style.top = '';
      root.style.zIndex = '';
      return true;
    }

    // Fallback: keep it visible in top-right
    if (!root.parentElement) document.body.appendChild(root);
    root.style.position = 'fixed';
    root.style.right = '12px';
    root.style.top = '110px';
    root.style.zIndex = '2147483647';
    return false;
  }

  function tick1s() {
    const cs = readCsSeconds();           // seconds/attack
    const adj1s = secSum * cs;            // adjust for attacks/sec (divide by aps)
    // maintain ring
    adjSumTot -= adjRing[ringIdx];
    adjRing[ringIdx] = adj1s;
    adjSumTot += adjRing[ringIdx];
    ringIdx = (ringIdx + 1) % WIN;

    const avgM = adjSumTot / WIN;         // already "sum over 1 min / 60", with per-second CS adjustment

    // update HUD
    const secEl = document.getElementById(SEC_ID);
    const minEl = document.getElementById(MIN_ID);
    if (secEl) secEl.textContent = adj1s.toFixed(2);
    if (minEl) minEl.textContent = avgM.toFixed(2);

    // session row (one per second)
    sessionRows.push({
      ts: new Date().toISOString(),
      cs: Number(cs.toFixed(4)),
      sum1s: Number(secSum.toFixed(4)),
      avgS: Number(adj1s.toFixed(4)),
      adj1s: Number(adj1s.toFixed(4)),
      avgM: Number(avgM.toFixed(4))
    });

    // reset bucket for next second
    secSum = 0;
  }

  function boot() {
    startObserver();

    // Re-attach frequently (UI can rerender)
    let tries = 0;
    const attachTimer = setInterval(() => {
      attachHud();
      tries++;
      if (document.getElementById(ROOT_ID)?.parentElement && document.getElementById('deepco-totals-hud')) {
        if (tries > 10) {
          clearInterval(attachTimer);
          setInterval(attachHud, 2000);
        }
      }
      if (tries > 120) {
        clearInterval(attachTimer);
        setInterval(attachHud, 2000);
      }
    }, 500);

    setInterval(tick1s, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();