// ==UserScript==
// @name         WME NoEdit Finder
// @namespace    https://waze.com
// @version      1.0.1
// @description  Finds no-edit cells (holes/rings) near your recent edits, with one-click Editor/LiveMap links + optional locality labels (JSONP no-CORS).
// @author       CRISTIΛN
// @match        https://www.waze.com/*user/editor*
// @match        https://beta.waze.com/*user/editor*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558837/WME%20NoEdit%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/558837/WME%20NoEdit%20Finder.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /***************************************************************************
   * CONFIG
   ***************************************************************************/
  const STORAGE_KEY_STATE = 'WME_FHF_STATE_V1';
  const STORAGE_KEY_GEOCACHE = 'WME_FHF_GEOCACHE_V1';

  const MAX_LOAD_MORE_CLICKS = 20;

  // Outlier / clamp
  const RO_BBOX = { latMin: 43.4, latMax: 48.6, lonMin: 20.0, lonMax: 29.8 };
  const RO_CLAMP_RATIO = 0.60;
  const IQR_K = 1.5;

  // Grid limits
  const GRID_MIN = 10;
  const GRID_MAX = 30;

  // Labeling (JSONP)
  const GEOCODE_BASE_THROTTLE_MS = 1200;     // base delay
  const GEOCODE_TIMEOUT_MS = 9000;
  const GEOCODE_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
  const GEOCODE_JITTER_MS = 250;             // random jitter
  const GEOCODE_BACKOFF_STEP_MS = 700;       // added per failure streak
  const GEOCODE_BACKOFF_MAX_MS = 6000;

  // Candidate limits
  const MAX_CANDIDATES = 30;

  /***************************************************************************
   * STATE
   ***************************************************************************/
  const FHF = {
    entriesRaw: [],
    entriesSan: [],
    entriesFiltered: [],
    derived: { bbox: null, grid: null, cells: null, distToActive: null, candidates: [] },

    filters: { maxDaysAgo: 30, text: '', excludeUnknownAge: false },

    cfg: {
      bufferKm: 12,
      gridSize: 18,
      ringMax: 3,              // how far from activity we consider no-edit cells
      labelsEnabled: true,
      maxLabels: 20,
      minConfidence: 'MED',    // HIGH | MED | LOW
    },

    geocode: {
      cache: new Map(),
      inflight: new Map(),
      lastReqTs: 0,
      failStreak: 0,
    },

    ui: { panel: null, header: null, content: null, countLabel: null },
    darkMode: false,
  };

  /***************************************************************************
   * UTIL
   ***************************************************************************/
  function log(...args) { console.log('%c[FHF]', 'color:#00b8d4;font-weight:bold;', ...args); }

  function debounce(fn, ms = 250) {
    let t;
    return function (...args) { clearTimeout(t); t = setTimeout(() => fn.apply(this, args), ms); };
  }

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  function validateCoordinates(lat, lon) {
    return typeof lat === 'number' && typeof lon === 'number' && !isNaN(lat) && !isNaN(lon) &&
      lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
  }

  function isZeroish(lat, lon) { return (lat === 0 && lon === 0) || (Math.abs(lat) < 1e-10 && Math.abs(lon) < 1e-10); }

  function inBBox(lat, lon, bb) {
    return lat >= bb.latMin && lat <= bb.latMax && lon >= bb.lonMin && lon <= bb.lonMax;
  }

  function roundCoord(x, decimals) {
    const p = Math.pow(10, decimals);
    return Math.round(x * p) / p;
  }

  function computeBBox(entries) {
    if (!entries || !entries.length) return null;
    let minLat = Infinity, maxLat = -Infinity, minLon = Infinity, maxLon = -Infinity;
    for (const e of entries) {
      minLat = Math.min(minLat, e.lat);
      maxLat = Math.max(maxLat, e.lat);
      minLon = Math.min(minLon, e.lon);
      maxLon = Math.max(maxLon, e.lon);
    }
    if (!isFinite(minLat) || !isFinite(minLon)) return null;
    return { minLat, maxLat, minLon, maxLon };
  }

  function approxKmNS(bb) { return (bb.maxLat - bb.minLat) * 111; }
  function approxKmEW(bb) { return (bb.maxLon - bb.minLon) * 80; }

  function padBBoxKm(bb, bufferKm) {
    const dLat = bufferKm / 111;
    const dLon = bufferKm / 80;
    return { minLat: bb.minLat - dLat, maxLat: bb.maxLat + dLat, minLon: bb.minLon - dLon, maxLon: bb.maxLon + dLon };
  }

  function distanceKm(aLat, aLon, bLat, bLon) {
    const x = (bLon - aLon) * 80;
    const y = (bLat - aLat) * 111;
    return Math.sqrt(x * x + y * y);
  }

  function neigh4Idx(idx, rows, cols) {
    const r = Math.floor(idx / cols), c = idx % cols;
    const out = [];
    if (r > 0) out.push((r - 1) * cols + c);
    if (r < rows - 1) out.push((r + 1) * cols + c);
    if (c > 0) out.push(r * cols + (c - 1));
    if (c < cols - 1) out.push(r * cols + (c + 1));
    return out;
  }

  function neigh8Idx(idx, rows, cols) {
    const r = Math.floor(idx / cols), c = idx % cols;
    const out = [];
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const rr = r + dr, cc = c + dc;
        if (rr >= 0 && rr < rows && cc >= 0 && cc < cols) out.push(rr * cols + cc);
      }
    }
    return out;
  }

  function buildWmeEditorUrl(lat, lon, zoom) {
    const z = typeof zoom === 'number' ? zoom : 6;
    return `https://www.waze.com/editor?lon=${lon.toFixed(6)}&lat=${lat.toFixed(6)}&zoom=${z}`;
  }

  function buildLiveMapUrl(lat, lon) {
    return `https://www.waze.com/live-map?ll=${lat.toFixed(6)},${lon.toFixed(6)}&z=14`;
  }

  function smartZoomForCell(latStep, lonStep) {
    const km = Math.max(latStep * 111, lonStep * 80);
    if (km > 20) return 10;
    if (km > 10) return 11;
    if (km > 5) return 12;
    if (km > 2) return 13;
    if (km > 1) return 14;
    return 15;
  }

  /***************************************************************************
   * THEME
   ***************************************************************************/
  function detectDarkMode() {
    const root = document.documentElement;
    const body = document.body;

    const classHint =
      root.classList.contains('dark') ||
      root.classList.contains('theme-dark') ||
      (body && (body.classList.contains('dark') || body.classList.contains('theme-dark')));

    let bgDark = false;
    if (body) {
      const cssBg = getComputedStyle(body).backgroundColor;
      const m = cssBg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
      if (m) {
        const r = +m[1], g = +m[2], b = +m[3];
        bgDark = (r + g + b) / 3 < 80;
      }
    }

    const prefers = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return !!(classHint || bgDark || prefers);
  }

  function observeThemeChanges() {
    if (window.matchMedia) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const onChange = () => {
        FHF.darkMode = detectDarkMode();
        applyTheme();
        render();
      };
      if (mq.addEventListener) mq.addEventListener('change', onChange);
      else if (mq.addListener) mq.addListener(onChange);
    }

    const obs = new MutationObserver(() => {
      const next = detectDarkMode();
      if (next !== FHF.darkMode) {
        FHF.darkMode = next;
        applyTheme();
        render();
      }
    });

    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    if (document.body) obs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }

  /***************************************************************************
   * PERSISTENCE
   ***************************************************************************/
  function saveState() {
    try {
      localStorage.setItem(
        STORAGE_KEY_STATE,
        JSON.stringify({ filters: FHF.filters, cfg: FHF.cfg })
      );
    } catch { /* ignore */ }
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_STATE);
      if (!raw) return;
      const s = JSON.parse(raw);
      if (s && s.filters) {
        const f = s.filters;
        if (typeof f.maxDaysAgo === 'number') FHF.filters.maxDaysAgo = clamp(f.maxDaysAgo, 1, 365);
        if (typeof f.text === 'string') FHF.filters.text = f.text;
        if (typeof f.excludeUnknownAge === 'boolean') FHF.filters.excludeUnknownAge = f.excludeUnknownAge;
      }
      if (s && s.cfg) {
        const c = s.cfg;
        if (typeof c.bufferKm === 'number') FHF.cfg.bufferKm = clamp(c.bufferKm, 0, 200);
        if (typeof c.gridSize === 'number') FHF.cfg.gridSize = clamp(Math.round(c.gridSize), GRID_MIN, GRID_MAX);
        if (typeof c.ringMax === 'number') FHF.cfg.ringMax = clamp(Math.round(c.ringMax), 1, 8);
        if (typeof c.labelsEnabled === 'boolean') FHF.cfg.labelsEnabled = c.labelsEnabled;
        if (typeof c.maxLabels === 'number') FHF.cfg.maxLabels = clamp(Math.round(c.maxLabels), 0, 200);
        if (c.minConfidence === 'HIGH' || c.minConfidence === 'MED' || c.minConfidence === 'LOW') FHF.cfg.minConfidence = c.minConfidence;
      }
    } catch { /* ignore */ }
  }

  function loadGeocodeCache() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_GEOCACHE);
      if (!raw) return;
      const obj = JSON.parse(raw);
      if (!obj || typeof obj !== 'object') return;
      FHF.geocode.cache = new Map(Object.entries(obj));
    } catch { /* ignore */ }
  }

  function saveGeocodeCache() {
    try {
      const obj = Object.fromEntries(FHF.geocode.cache.entries());
      localStorage.setItem(STORAGE_KEY_GEOCACHE, JSON.stringify(obj));
    } catch { /* ignore */ }
  }

  /***************************************************************************
   * EXTRACT RECENT EDITS
   ***************************************************************************/
  function findRecentEditsContainer() { return document.querySelector('#recent-edits'); }

  function extractEditEntryElements() {
    const c = findRecentEditsContainer();
    if (!c) return [];
    return Array.from(c.querySelectorAll('.transaction'));
  }

  function extractEditorUrl(entry) {
    const link = entry.querySelector('a[href*="/editor"], a[href*="editor"]');
    if (!link) return null;
    const href = link.getAttribute('href');
    if (!href) return null;
    try { return new URL(href, window.location.origin).toString(); } catch { return href; }
  }

  function extractLocationFromEntry(entry) {
    const link = entry.querySelector('a[href*="/editor"], a[href*="editor"]');
    if (!link) return null;
    const href = link.getAttribute('href');
    if (!href) return null;
    try {
      const url = new URL(href, window.location.origin);
      const lon = parseFloat(url.searchParams.get('lon'));
      const lat = parseFloat(url.searchParams.get('lat'));
      if (!validateCoordinates(lat, lon)) return null;
      if (isZeroish(lat, lon)) return null;
      return { lat, lon };
    } catch {
      return null;
    }
  }

  function extractTimestampFromEntry(entry) {
    const timeElement = entry.querySelector('.timestamp, .time, [class*="time"], [class*="timestamp"]');
    if (timeElement && timeElement.textContent) return timeElement.textContent.trim();

    const text = entry.textContent || '';
    const patterns = [
      /(\d+)\s*(päivää|päivä|tuntia|tunti|minuuttia|minuutti|viikkoa|kuukautta)\s*sitten/i,
      /(\d+)\s*(days?|hours?|minutes?|weeks?|months?)\s*ago/i,
      /(\d+)\s*(zile|zi|ore|oră|ora|minute|minut|săptămâni|saptamani|săptămână|saptamana|luni|lună|luna)\s*în urmă/i,
      /(acum|chiar acum)/i,
    ];
    for (const re of patterns) {
      const m = text.match(re);
      if (m) return m[0];
    }
    return null;
  }

  // FIX: stronger coverage (EN + FI + RO + "now")
  function parseRelativeTime(timeText) {
    if (!timeText) return null;
    const text = timeText.toLowerCase().trim();

    if (/^(now|just now|acum|chiar acum)$/i.test(text)) return 0;

    const patterns = [
      // EN
      { re: /(\d+)\s*days?\s*ago/i, mult: 1 },
      { re: /(\d+)\s*hours?\s*ago/i, mult: 1 / 24 },
      { re: /(\d+)\s*minutes?\s*ago/i, mult: 1 / (24 * 60) },
      { re: /(\d+)\s*weeks?\s*ago/i, mult: 7 },
      { re: /(\d+)\s*months?\s*ago/i, mult: 30 },

      // FI (päivä/päivää, tunti/tuntia, minuutti/minuuttia, viikko/viikkoa, kuukausi/kuukautta)
      { re: /(\d+)\s*päiv(ä|ää)\s*sitten/i, mult: 1 },
      { re: /(\d+)\s*tunti(a)?\s*sitten/i, mult: 1 / 24 },
      { re: /(\d+)\s*minuutt(i|ia)\s*sitten/i, mult: 1 / (24 * 60) },
      { re: /(\d+)\s*viikko(a)?\s*sitten/i, mult: 7 },
      { re: /(\d+)\s*kuukautta\s*sitten/i, mult: 30 },

      // RO (diacritice + fără)
      { re: /(\d+)\s*zile?\s*în\s*urmă/i, mult: 1 },
      { re: /(\d+)\s*ore?\s*în\s*urmă/i, mult: 1 / 24 },
      { re: /(\d+)\s*oră\s*în\s*urmă/i, mult: 1 / 24 },
      { re: /(\d+)\s*minute?\s*în\s*urmă/i, mult: 1 / (24 * 60) },
      { re: /(\d+)\s*săptăm(â|a)ni?\s*în\s*urmă/i, mult: 7 },
      { re: /(\d+)\s*luni?\s*în\s*urmă/i, mult: 30 },
      { re: /(\d+)\s*lună\s*în\s*urmă/i, mult: 30 },
    ];

    for (const p of patterns) {
      const m = text.match(p.re);
      if (m) {
        const v = parseInt(m[1], 10);
        if (!isNaN(v)) return v * p.mult;
      }
    }
    return null;
  }

  function extractRawText(entry) {
    const txt = entry.textContent || '';
    return txt.replace(/\s+/g, ' ').trim();
  }

  function createStableId(entryEl, lat, lon) {
    const url = extractEditorUrl(entryEl);
    if (url && /[?&]lat=/.test(url) && /[?&]lon=/.test(url)) return url;
    return `${roundCoord(lat, 5).toFixed(5)},${roundCoord(lon, 5).toFixed(5)}`;
  }

  function findLoadMoreButton() {
    const btns = document.querySelectorAll('button, .button, [role="button"]');
    for (const b of btns) {
      const t = (b.textContent || '').trim().toLowerCase();
      if (t.includes('lataa lisää') || t.includes('load more')) return b;
    }
    return null;
  }

  function clickLoadMoreButton() {
    const b = findLoadMoreButton();
    if (!b) return false;
    b.click();
    return true;
  }

  function waitForNewContent(timeout = 5000) {
    return new Promise((resolve) => {
      const container = findRecentEditsContainer();
      if (!container) return resolve(false);
      let timeoutId;
      const obs = new MutationObserver((mutations) => {
        for (const m of mutations) {
          if (m.addedNodes && m.addedNodes.length) {
            clearTimeout(timeoutId);
            obs.disconnect();
            resolve(true);
            return;
          }
        }
      });
      obs.observe(container, { childList: true, subtree: true });
      timeoutId = setTimeout(() => { obs.disconnect(); resolve(false); }, timeout);
    });
  }

  // OPT: dedup streaming (no big all.concat + dedup each loop)
  async function collectEntriesWithPagination(maxClicks = MAX_LOAD_MORE_CLICKS) {
    const seen = new Set();
    const all = [];

    let attempts = 0;
    let lastElementsCount = 0;

    while (attempts <= maxClicks) {
      const elements = extractEditEntryElements();
      // stop if no growth and no button
      if (elements.length === lastElementsCount && !findLoadMoreButton()) break;
      lastElementsCount = elements.length;

      for (const el of elements) {
        const loc = extractLocationFromEntry(el);
        if (!loc) continue;

        const ts = extractTimestampFromEntry(el);
        const daysAgo = ts ? parseRelativeTime(ts) : null;
        const url = extractEditorUrl(el);
        const rawText = extractRawText(el);
        const id = createStableId(el, loc.lat, loc.lon);

        if (seen.has(id)) continue;
        seen.add(id);

        all.push({ id, lat: loc.lat, lon: loc.lon, timestamp: ts || undefined, daysAgo, url, rawText });
      }

      const btn = findLoadMoreButton();
      if (!btn) break;
      if (!clickLoadMoreButton()) break;

      const loaded = await waitForNewContent(5000);
      if (!loaded) break;

      attempts++;
    }

    return all;
  }

  /***************************************************************************
   * SANITIZER + FILTERS
   ***************************************************************************/
  function quantile(sortedArr, q) {
    const a = sortedArr;
    if (!a.length) return null;
    const pos = (a.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (a[base + 1] === undefined) return a[base];
    return a[base] + rest * (a[base + 1] - a[base]);
  }

  function iqrBounds(values) {
    const a = values.slice().sort((x, y) => x - y);
    const q1 = quantile(a, 0.25);
    const q3 = quantile(a, 0.75);
    const iqr = q3 - q1;
    const lo = q1 - IQR_K * iqr;
    const hi = q3 + IQR_K * iqr;
    return { lo, hi };
  }

  function sanitizeEntries(entries) {
    let pts = entries.filter((e) => validateCoordinates(e.lat, e.lon) && !isZeroish(e.lat, e.lon));

    if (pts.length >= 8) {
      const latB = iqrBounds(pts.map((p) => p.lat));
      const lonB = iqrBounds(pts.map((p) => p.lon));
      pts = pts.filter((p) => p.lat >= latB.lo && p.lat <= latB.hi && p.lon >= lonB.lo && p.lon <= lonB.hi);
    }

    if (pts.length) {
      const roCount = pts.reduce((acc, p) => acc + (inBBox(p.lat, p.lon, RO_BBOX) ? 1 : 0), 0);
      if (roCount / pts.length >= RO_CLAMP_RATIO) pts = pts.filter((p) => inBBox(p.lat, p.lon, RO_BBOX));
    }

    return pts;
  }

  function applyFilters() {
    const maxDays = FHF.filters.maxDaysAgo;
    const q = (FHF.filters.text || '').trim().toLowerCase();
    const exclUnknown = !!FHF.filters.excludeUnknownAge;

    FHF.entriesFiltered = FHF.entriesSan.filter((e) => {
      if (exclUnknown && (e.daysAgo == null || isNaN(e.daysAgo))) return false;
      if (typeof maxDays === 'number' && maxDays > 0) {
        if (e.daysAgo != null && typeof e.daysAgo === 'number' && e.daysAgo > maxDays) return false;
      }
      if (q) {
        const t = (e.rawText || '').toLowerCase();
        if (!t.includes(q)) return false;
      }
      return true;
    });
  }

  /***************************************************************************
   * DERIVE: grid + candidates (no-edit cells)
   ***************************************************************************/
  function recomputeDerived() {
    FHF.derived = { bbox: null, grid: null, cells: null, distToActive: null, candidates: [] };

    const src = FHF.entriesFiltered;
    if (!src.length) return;

    const bb0 = computeBBox(src);
    if (!bb0) return;

    const bbox = padBBoxKm(bb0, FHF.cfg.bufferKm || 0);

    const rows = clamp(Math.round(FHF.cfg.gridSize), GRID_MIN, GRID_MAX);
    const cols = rows;

    const latSpan = Math.max(0.0005, bbox.maxLat - bbox.minLat);
    const lonSpan = Math.max(0.0005, bbox.maxLon - bbox.minLon);
    const latStep = latSpan / rows;
    const lonStep = lonSpan / cols;

    const cells = new Array(rows * cols);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        cells[r * cols + c] = {
          row: r, col: c, idx: r * cols + c,
          count: 0,
          latCenter: bbox.minLat + (r + 0.5) * latStep,
          lonCenter: bbox.minLon + (c + 0.5) * lonStep,
        };
      }
    }

    function idxFor(lat, lon) {
      let r = Math.floor(((lat - bbox.minLat) / (bbox.maxLat - bbox.minLat)) * rows);
      let c = Math.floor(((lon - bbox.minLon) / (bbox.maxLon - bbox.minLon)) * cols);
      if (r < 0) r = 0;
      if (r >= rows) r = rows - 1;
      if (c < 0) c = 0;
      if (c >= cols) c = cols - 1;
      return r * cols + c;
    }

    for (const e of src) cells[idxFor(e.lat, e.lon)].count++;

    // FIX: use 8-neighborhood BFS for ring distance (coherent with neigh8 in HOLE detection)
    const distToActive = new Array(rows * cols).fill(Infinity);
    const queue = [];
    for (let i = 0; i < cells.length; i++) {
      if (cells[i].count > 0) { distToActive[i] = 0; queue.push(i); }
    }
    for (let qi = 0; qi < queue.length; qi++) {
      const cur = queue[qi];
      const nd = distToActive[cur] + 1;
      for (const nb of neigh8Idx(cur, rows, cols)) {
        if (distToActive[nb] > nd) { distToActive[nb] = nd; queue.push(nb); }
      }
    }

    const ringMax = clamp(FHF.cfg.ringMax, 1, 8);

    const centerLat = (bbox.minLat + bbox.maxLat) / 2;
    const centerLon = (bbox.minLon + bbox.maxLon) / 2;

    function activeNeighborsCount(idx) {
      let n = 0;
      for (const nb of neigh8Idx(idx, rows, cols)) if (cells[nb].count > 0) n++;
      return n;
    }

    function score(idx, kind, an) {
      const cell = cells[idx];
      const ring = distToActive[idx];
      const dCenter = distanceKm(cell.latCenter, cell.lonCenter, centerLat, centerLon);

      let s = 0;
      if (kind === 'HOLE') s += 120;
      else if (kind === 'RING') s += 85;
      else s += 60;

      s += Math.max(0, 22 - Math.min(ring, 20) * 4);
      s += Math.max(0, 10 - dCenter * 0.25);
      if (kind === 'HOLE') s += an * 6;
      return s;
    }

    const candidates = [];
    for (let i = 0; i < cells.length; i++) {
      if (cells[i].count !== 0) continue;

      const ring = distToActive[i];
      if (!(ring > 0 && ring <= ringMax)) continue;

      const an = activeNeighborsCount(i);
      const kind = (an >= 2) ? 'HOLE' : 'RING';

      candidates.push({
        id: `NOEDIT|${kind}|${i}`,
        kind,
        cellIdx: i,
        lat: cells[i].latCenter,
        lon: cells[i].lonCenter,
        ring,
        activeNeighbors: an,
        score: score(i, kind, an),
        label: null,
        labelType: null,
        confidence: null,
        labelStatus: 'idle', // idle|loading|ok|fail|off
      });
    }

    candidates.sort((a, b) => b.score - a.score);

    FHF.derived = {
      bbox,
      grid: { rows, cols, latStep, lonStep, zoom: smartZoomForCell(latStep, lonStep) },
      cells,
      distToActive,
      candidates: candidates.slice(0, MAX_CANDIDATES),
    };
  }

  /***************************************************************************
   * LABELS (JSONP no-CORS)
   ***************************************************************************/
  function geocodeKey(lat, lon) {
    return `${roundCoord(lat, 4).toFixed(4)},${roundCoord(lon, 4).toFixed(4)}`;
  }

  // FIX: cache TTL (7d)
  function cacheGet(lat, lon) {
    const k = geocodeKey(lat, lon);
    if (FHF.geocode.cache.has(k)) {
      try {
        const obj = JSON.parse(FHF.geocode.cache.get(k));
        if (obj && obj.ts && (Date.now() - obj.ts) > GEOCODE_CACHE_TTL_MS) {
          FHF.geocode.cache.delete(k);
          saveGeocodeCache();
          return null;
        }
        return obj;
      } catch {
        FHF.geocode.cache.delete(k);
        saveGeocodeCache();
      }
    }
    return null;
  }

  function cacheSet(lat, lon, obj) {
    const k = geocodeKey(lat, lon);
    FHF.geocode.cache.set(k, JSON.stringify(obj));
    saveGeocodeCache();
  }

  function classifyConfidence(type) {
    const t = (type || '').toLowerCase();
    if (t === 'city' || t === 'town' || t === 'village' || t === 'municipality' || t === 'commune') return 'HIGH';
    if (t === 'hamlet' || t === 'suburb' || t === 'neighbourhood' || t === 'neighborhood') return 'MED';
    return 'LOW';
  }

  function confidenceRank(conf) {
    if (conf === 'HIGH') return 3;
    if (conf === 'MED') return 2;
    return 1;
  }

  // FIX: adaptive backoff + jitter
  async function throttleDelay() {
    const backoff = clamp(FHF.geocode.failStreak * GEOCODE_BACKOFF_STEP_MS, 0, GEOCODE_BACKOFF_MAX_MS);
    const target = GEOCODE_BASE_THROTTLE_MS + backoff + Math.floor(Math.random() * GEOCODE_JITTER_MS);

    const now = Date.now();
    const dt = now - FHF.geocode.lastReqTs;
    const wait = target - dt;
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    FHF.geocode.lastReqTs = Date.now();
  }

  function safeRemoveScript(node) { try { node && node.parentNode && node.parentNode.removeChild(node); } catch {} }

  function jsonp(url, timeoutMs = GEOCODE_TIMEOUT_MS) {
    return new Promise((resolve) => {
      const cb = `__fhf_jsonp_${Math.random().toString(36).slice(2)}_${Date.now()}`;
      const sep = url.includes('?') ? '&' : '?';
      const full = `${url}${sep}json_callback=${encodeURIComponent(cb)}`;

      let done = false;
      let script = null;

      const timer = setTimeout(() => {
        if (done) return;
        done = true;
        try { delete window[cb]; } catch {}
        safeRemoveScript(script);
        resolve(null);
      }, timeoutMs);

      window[cb] = (data) => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        try { delete window[cb]; } catch {}
        safeRemoveScript(script);
        resolve(data || null);
      };

      script = document.createElement('script');
      script.src = full;
      script.async = true;
      script.referrerPolicy = 'no-referrer';
      script.onerror = () => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        try { delete window[cb]; } catch {}
        safeRemoveScript(script);
        resolve(null);
      };

      document.head.appendChild(script);
    });
  }

  async function reverseGeocodeNominatim(lat, lon) {
    const cached = cacheGet(lat, lon);
    if (cached) return cached;

    const k = geocodeKey(lat, lon);
    if (FHF.geocode.inflight.has(k)) return FHF.geocode.inflight.get(k);

    const p = (async () => {
      await throttleDelay();

      const url =
        `https://nominatim.openstreetmap.org/reverse` +
        `?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}` +
        `&zoom=14&addressdetails=1`;

      const data = await jsonp(url, GEOCODE_TIMEOUT_MS);
      if (!data) return null;

      const addr = data && data.address ? data.address : {};

      const name =
        addr.city || addr.town || addr.village || addr.municipality || addr.commune ||
        addr.hamlet || addr.suburb || addr.neighbourhood || data.name;

      const type =
        addr.city ? 'city' :
        addr.town ? 'town' :
        addr.village ? 'village' :
        addr.municipality ? 'municipality' :
        addr.commune ? 'commune' :
        addr.hamlet ? 'hamlet' :
        addr.suburb ? 'suburb' :
        addr.neighbourhood ? 'neighbourhood' :
        (data && data.type ? data.type : 'place');

      const county = addr.county || addr.state || addr.region || '';
      const display = name ? `${name}${county ? ' · ' + county : ''}` : null;

      const out = { display, name: name || '', type, county, confidence: classifyConfidence(type), ts: Date.now() };
      cacheSet(lat, lon, out);
      return out;
    })();

    FHF.geocode.inflight.set(k, p);
    try { return await p; }
    finally { FHF.geocode.inflight.delete(k); }
  }

  function applyConfidenceFilter(items) {
    if (!FHF.cfg.labelsEnabled) return items;
    const minRank = confidenceRank(FHF.cfg.minConfidence);
    return items.filter((m) => {
      if (!m.confidence) return true; // not labeled yet
      return confidenceRank(m.confidence) >= minRank;
    });
  }

  async function labelTop(updateRowFn) {
    if (!FHF.cfg.labelsEnabled) return;
    const max = clamp(FHF.cfg.maxLabels || 0, 0, 200);
    const list = FHF.derived.candidates.slice(0, max);

    for (const m of list) {
      const cached = cacheGet(m.lat, m.lon);
      if (cached && cached.display) {
        m.label = cached.display;
        m.labelType = cached.type;
        m.confidence = cached.confidence || classifyConfidence(cached.type);
        m.labelStatus = 'ok';
        FHF.geocode.failStreak = 0;
        updateRowFn && updateRowFn(m);
        continue;
      }

      m.labelStatus = 'loading';
      updateRowFn && updateRowFn(m);

      const res = await reverseGeocodeNominatim(m.lat, m.lon);
      if (res && res.display) {
        m.label = res.display;
        m.labelType = res.type;
        m.confidence = res.confidence || classifyConfidence(res.type);
        m.labelStatus = 'ok';
        FHF.geocode.failStreak = 0;
      } else {
        m.labelStatus = 'fail';
        FHF.geocode.failStreak = clamp(FHF.geocode.failStreak + 1, 0, 20);
      }
      updateRowFn && updateRowFn(m);
    }
  }

  /***************************************************************************
   * UI
   ***************************************************************************/
  function makeDraggable(el, handle) {
    let isDown = false;
    let startX, startY, startLeft, startTop;

    handle.style.cursor = 'move';

    handle.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = el.getBoundingClientRect();
      startLeft = rect.left;
      startTop = rect.top;
      document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      el.style.left = `${startLeft + dx}px`;
      el.style.top = `${startTop + dy}px`;
    });

    document.addEventListener('mouseup', () => {
      if (!isDown) return;
      isDown = false;
      document.body.style.userSelect = '';
    });
  }

  function styledInput(el) {
    el.style.border = `1px solid ${FHF.darkMode ? '#2a3440' : '#ccc'}`;
    el.style.background = FHF.darkMode ? '#0f1620' : '#fff';
    el.style.color = FHF.darkMode ? '#e7eef7' : '#000';
    el.style.borderRadius = '8px';
    el.style.padding = '6px 8px';
    el.style.fontSize = '11px';
    return el;
  }

  function styledBtn(btn, kind = 'ghost') {
    btn.style.border = 'none';
    btn.style.cursor = 'pointer';
    btn.style.borderRadius = '10px';
    btn.style.padding = '6px 10px';
    btn.style.fontSize = '11px';
    if (kind === 'primary') {
      btn.style.background = '#00b8d4';
      btn.style.color = '#fff';
    } else {
      btn.style.background = FHF.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
      btn.style.color = FHF.darkMode ? '#e7eef7' : '#111';
    }
    return btn;
  }

  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); return true; }
    catch {
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        return true;
      } catch { return false; }
    }
  }

  function applyTheme() {
    const panel = FHF.ui.panel;
    if (!panel) return;

    panel.style.background = FHF.darkMode ? 'rgba(10,15,20,0.98)' : 'rgba(255,255,255,0.96)';
    panel.style.color = FHF.darkMode ? '#f5f5f5' : '#000';

    if (FHF.ui.header) {
      FHF.ui.header.style.background = FHF.darkMode
        ? 'linear-gradient(90deg,#003545,#001f29)'
        : 'linear-gradient(90deg,#00b8d4,#0088a3)';
    }
  }

  function updateCountLabel() {
    if (!FHF.ui.countLabel) return;
    const total = FHF.entriesSan.length;
    const filtered = FHF.entriesFiltered.length;
    FHF.ui.countLabel.textContent = `${filtered}/${total} edits`;
  }

  function createPanel() {
    if (FHF.ui.panel) return;

    const panel = document.createElement('div');
    panel.style.cssText = `
      position: fixed; top: 60px; right: 30px;
      width: 860px; height: 620px;
      border-radius: 14px;
      border: 1px solid rgba(0,184,212,0.85);
      box-shadow: 0 10px 30px rgba(0,0,0,0.35);
      z-index: 99999;
      display: flex; flex-direction: column;
      font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
      font-size: 12px;
      backdrop-filter: blur(4px);
    `;

    const header = document.createElement('div');
    header.style.cssText = `
      padding: 8px 10px;
      display:flex; align-items:center; justify-content:space-between;
      border-bottom:1px solid rgba(0,0,0,0.08);
      color:#fff; border-radius:14px 14px 0 0;
    `;

    const title = document.createElement('div');
    title.textContent = 'WME NoEdit Finder';
    title.style.cssText = 'font-size:12px;font-weight:900;letter-spacing:0.2px;';

    const right = document.createElement('div');
    right.style.cssText = 'display:flex;gap:10px;align-items:center;';

    const count = document.createElement('div');
    count.style.cssText = 'font-size:11px;opacity:0.92;';
    count.textContent = '0 edits';

    const refreshBtn = styledBtn(document.createElement('button'), 'ghost');
    refreshBtn.textContent = 'Refresh';
    refreshBtn.style.background = 'rgba(255,255,255,0.12)';
    refreshBtn.style.color = '#fff';
    refreshBtn.addEventListener('click', () => refreshData(true));

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.style.cssText = `border:none;background:transparent;color:#fff;font-size:14px;cursor:pointer;padding:0 6px;`;
    closeBtn.addEventListener('click', () => { panel.style.display = 'none'; });

    right.appendChild(count);
    right.appendChild(refreshBtn);
    right.appendChild(closeBtn);

    header.appendChild(title);
    header.appendChild(right);

    const content = document.createElement('div');
    content.style.cssText = `flex:1;padding:10px 12px;position:relative;overflow:hidden;`;

    panel.appendChild(header);
    panel.appendChild(content);

    document.body.appendChild(panel);

    FHF.ui.panel = panel;
    FHF.ui.header = header;
    FHF.ui.content = content;
    FHF.ui.countLabel = count;

    makeDraggable(panel, header);

    FHF.darkMode = detectDarkMode();
    applyTheme();
  }

  function clearContent() {
    if (FHF.ui.content) FHF.ui.content.textContent = '';
  }

  function render() {
    clearContent();
    const content = FHF.ui.content;
    if (!content) return;

    const rowRegistry = new Map(); // id -> updateRow

    const top = document.createElement('div');
    top.style.cssText = `
      display:flex;gap:10px;align-items:flex-end;flex-wrap:wrap;
      padding:10px 12px;border-radius:14px;
      background:${FHF.darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'};
      border:1px solid ${FHF.darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};
    `;

    const makeField = (label, inputEl) => {
      const w = document.createElement('div');
      w.style.cssText = 'display:flex;flex-direction:column;gap:4px;';
      const l = document.createElement('div');
      l.textContent = label;
      l.style.cssText = `font-size:10px;opacity:${FHF.darkMode ? 0.9 : 0.75};`;
      w.appendChild(l);
      w.appendChild(inputEl);
      return w;
    };

    const inpDays = styledInput(document.createElement('input'));
    inpDays.type = 'number'; inpDays.min = '1'; inpDays.max = '365';
    inpDays.value = String(FHF.filters.maxDaysAgo);
    inpDays.style.width = '90px';
    inpDays.addEventListener('input', debounce(() => {
      FHF.filters.maxDaysAgo = clamp(parseInt(inpDays.value || '30', 10), 1, 365);
      saveState(); recomputeAll(); render();
    }, 250));

    const inpText = styledInput(document.createElement('input'));
    inpText.type = 'text';
    inpText.placeholder = 'Iasi / DN / ...';
    inpText.value = FHF.filters.text || '';
    inpText.style.width = '170px';
    inpText.addEventListener('input', debounce(() => {
      FHF.filters.text = inpText.value || '';
      saveState(); recomputeAll(); render();
    }, 250));

    const chkUnknown = document.createElement('input');
    chkUnknown.type = 'checkbox';
    chkUnknown.checked = !!FHF.filters.excludeUnknownAge;
    chkUnknown.addEventListener('change', () => {
      FHF.filters.excludeUnknownAge = !!chkUnknown.checked;
      saveState(); recomputeAll(); render();
    });

    const wrapUnknown = document.createElement('div');
    wrapUnknown.style.cssText = 'display:flex;align-items:center;gap:6px;height:28px;';
    wrapUnknown.appendChild(chkUnknown);
    const uLbl = document.createElement('div');
    uLbl.textContent = 'Exclude unknown age';
    uLbl.style.cssText = `font-size:11px;color:${FHF.darkMode ? '#d5dde5' : '#222'};`;
    wrapUnknown.appendChild(uLbl);

    const inpBuf = styledInput(document.createElement('input'));
    inpBuf.type = 'number'; inpBuf.min = '0'; inpBuf.max = '200';
    inpBuf.value = String(FHF.cfg.bufferKm);
    inpBuf.style.width = '120px';
    inpBuf.addEventListener('input', debounce(() => {
      FHF.cfg.bufferKm = clamp(parseFloat(inpBuf.value || '0'), 0, 200);
      saveState(); recomputeAll(); render();
    }, 300));

    const inpGrid = styledInput(document.createElement('input'));
    inpGrid.type = 'number'; inpGrid.min = String(GRID_MIN); inpGrid.max = String(GRID_MAX);
    inpGrid.value = String(FHF.cfg.gridSize);
    inpGrid.style.width = '90px';
    inpGrid.addEventListener('input', debounce(() => {
      FHF.cfg.gridSize = clamp(parseInt(inpGrid.value || '18', 10), GRID_MIN, GRID_MAX);
      saveState(); recomputeAll(); render();
    }, 300));

    const inpRing = styledInput(document.createElement('input'));
    inpRing.type = 'number'; inpRing.min = '1'; inpRing.max = '8';
    inpRing.value = String(FHF.cfg.ringMax);
    inpRing.style.width = '95px';
    inpRing.addEventListener('input', debounce(() => {
      FHF.cfg.ringMax = clamp(parseInt(inpRing.value || '3', 10), 1, 8);
      saveState(); recomputeAll(); render();
    }, 300));

    const chkLbl = document.createElement('input');
    chkLbl.type = 'checkbox';
    chkLbl.checked = !!FHF.cfg.labelsEnabled;
    chkLbl.addEventListener('change', () => { FHF.cfg.labelsEnabled = !!chkLbl.checked; saveState(); render(); });

    const inpMaxLbl = styledInput(document.createElement('input'));
    inpMaxLbl.type = 'number'; inpMaxLbl.min = '0'; inpMaxLbl.max = '60';
    inpMaxLbl.value = String(FHF.cfg.maxLabels);
    inpMaxLbl.style.width = '70px';
    inpMaxLbl.addEventListener('input', debounce(() => {
      FHF.cfg.maxLabels = clamp(parseInt(inpMaxLbl.value || '0', 10), 0, 200);
      saveState();
    }, 250));

    const selConf = styledInput(document.createElement('select'));
    selConf.style.width = '110px';
    ['HIGH', 'MED', 'LOW'].forEach((c) => {
      const o = document.createElement('option'); o.value = c; o.textContent = c; selConf.appendChild(o);
    });
    selConf.value = FHF.cfg.minConfidence;
    selConf.addEventListener('change', () => { FHF.cfg.minConfidence = selConf.value; saveState(); render(); });

    const btnRecompute = styledBtn(document.createElement('button'), 'primary');
    btnRecompute.textContent = 'Recompute';
    btnRecompute.addEventListener('click', () => { recomputeAll(); render(); });

    const btnLabel = styledBtn(document.createElement('button'), 'ghost');
    btnLabel.textContent = 'Label top';
    btnLabel.addEventListener('click', async () => {
      if (!FHF.cfg.labelsEnabled) return;
      btnLabel.disabled = true;
      const old = btnLabel.textContent;
      btnLabel.textContent = 'Labeling…';
      await labelTop((m) => { if (rowRegistry.has(m.id)) rowRegistry.get(m.id)(); });
      btnLabel.textContent = old;
      btnLabel.disabled = false;
      // NOTE: no full render here; rows updated incrementally
    });

    const btnCopy = styledBtn(document.createElement('button'), 'ghost');
    btnCopy.textContent = 'Copy list';
    btnCopy.addEventListener('click', async () => {
      const list = applyConfidenceFilter(FHF.derived.candidates);
      const lines = list.map((m, i) => {
        const label =
          (m.labelStatus === 'loading') ? 'Labeling…' :
          (m.labelStatus === 'fail') ? 'Label failed' :
          (m.label || `${m.lat.toFixed(5)}, ${m.lon.toFixed(5)}`);
        return `${i + 1}. [${m.kind}] ${label} (ring=${m.ring}, score=${m.score.toFixed(1)})`;
      });
      await copyText(lines.join('\n'));
      btnCopy.textContent = 'Copied!';
      setTimeout(() => (btnCopy.textContent = 'Copy list'), 900);
    });

    top.appendChild(makeField('Max age (days)', inpDays));
    top.appendChild(makeField('Text match', inpText));

    const unknownField = document.createElement('div');
    unknownField.style.cssText = 'display:flex;flex-direction:column;gap:4px;';
    const unknownLabel = document.createElement('div');
    unknownLabel.textContent = 'Age filter';
    unknownLabel.style.cssText = `font-size:10px;opacity:${FHF.darkMode ? 0.9 : 0.75};`;
    unknownField.appendChild(unknownLabel);
    unknownField.appendChild(wrapUnknown);
    top.appendChild(unknownField);

    top.appendChild(makeField('Footprint buffer (km)', inpBuf));
    top.appendChild(makeField('Grid size', inpGrid));
    top.appendChild(makeField('Ring max', inpRing));

    const labelsField = document.createElement('div');
    labelsField.style.cssText = 'display:flex;flex-direction:column;gap:4px;';
    const labelsLabel = document.createElement('div');
    labelsLabel.textContent = 'Labels';
    labelsLabel.style.cssText = `font-size:10px;opacity:${FHF.darkMode ? 0.9 : 0.75};`;
    labelsField.appendChild(labelsLabel);

    const labelsRow = document.createElement('div');
    labelsRow.style.cssText = 'display:flex;gap:8px;align-items:center;';
    labelsRow.appendChild(chkLbl);
    const lblTxt = document.createElement('div');
    lblTxt.textContent = 'Enable';
    lblTxt.style.cssText = `font-size:11px;color:${FHF.darkMode ? '#d5dde5' : '#222'};`;
    labelsRow.appendChild(lblTxt);

    const lblN = document.createElement('div');
    lblN.textContent = 'Top N';
    lblN.style.cssText = `font-size:10px;opacity:${FHF.darkMode ? 0.85 : 0.75};margin-left:6px;`;
    labelsRow.appendChild(lblN);
    labelsRow.appendChild(inpMaxLbl);

    labelsField.appendChild(labelsRow);
    top.appendChild(labelsField);
    top.appendChild(makeField('Min confidence', selConf));

    const btns = document.createElement('div');
    btns.style.cssText = 'display:flex;gap:8px;align-items:center;margin-left:auto;flex-wrap:wrap;';
    btns.appendChild(btnRecompute);
    btns.appendChild(btnLabel);
    btns.appendChild(btnCopy);
    top.appendChild(btns);

    content.appendChild(top);

    const summary = document.createElement('div');
    summary.style.cssText = 'margin:10px 2px 8px 2px;font-size:11px;display:flex;gap:10px;flex-wrap:wrap;';
    summary.style.color = FHF.darkMode ? '#aab6c3' : '#555';

    if (!FHF.entriesFiltered.length || !FHF.derived.grid) {
      summary.textContent = 'No data yet. Click Refresh.';
      content.appendChild(summary);
      return;
    }

    const bb = FHF.derived.bbox;
    const g = FHF.derived.grid;

    summary.textContent =
      `Footprint=${approxKmNS(bb).toFixed(1)}×${approxKmEW(bb).toFixed(1)} km · Grid=${g.rows}×${g.cols} · Candidates=${FHF.derived.candidates.length}`;

    content.appendChild(summary);

    const listWrap = document.createElement('div');
    listWrap.style.cssText = 'height:calc(100% - 150px);overflow:auto;padding-right:6px;';

    const items = applyConfidenceFilter(FHF.derived.candidates);

    if (!items.length) {
      const msg = document.createElement('div');
      msg.textContent = 'No no-edit cells found near footprint. Try increasing Ring max or Buffer km.';
      msg.style.cssText = 'font-size:11px;margin-top:10px;';
      msg.style.color = FHF.darkMode ? '#9aa7b4' : '#666';
      listWrap.appendChild(msg);
      content.appendChild(listWrap);
      return;
    }

    items.forEach((m) => {
      const row = document.createElement('div');
      row.style.cssText = `
        display:flex;gap:10px;align-items:flex-start;justify-content:space-between;
        padding:11px 11px;border-radius:16px;margin-bottom:9px;
        background:${FHF.darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'};
        border:1px solid ${FHF.darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'};
      `;

      const left = document.createElement('div');
      left.style.cssText = 'flex:1;min-width:0;';

      const topLine = document.createElement('div');
      topLine.style.cssText = 'display:flex;gap:8px;align-items:center;flex-wrap:wrap;';

      const badge = document.createElement('div');
      badge.textContent = m.kind;
      badge.style.cssText = `
        font-size:10px;font-weight:900;padding:2px 8px;border-radius:999px;
        background:${m.kind === 'HOLE' ? 'rgba(255,82,82,0.20)' : 'rgba(0,184,212,0.18)'};
        color:${FHF.darkMode ? '#e7eef7' : '#111'};
      `;

      const title = document.createElement('div');
      title.style.cssText = 'font-weight:900;max-width:520px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';

      const sub = document.createElement('div');
      sub.style.cssText = `font-size:10px;opacity:${FHF.darkMode ? 0.85 : 0.7};margin-top:3px;line-height:1.2;`;

      const updateRow = () => {
        const label =
          m.labelStatus === 'loading' ? 'Labeling…' :
          m.labelStatus === 'fail' ? 'Label failed' :
          (m.label ? m.label : `${m.lat.toFixed(5)}, ${m.lon.toFixed(5)}`);

        title.textContent = label;

        const extras = [];
        extras.push(`ring=${m.ring}`);
        if (m.kind === 'HOLE') extras.push(`neighbors=${m.activeNeighbors}`);
        extras.push(`score=${m.score.toFixed(1)}`);

        if (FHF.cfg.labelsEnabled) {
          if (m.confidence) extras.push(`conf=${m.confidence}`);
          if (m.labelType) extras.push(`type=${m.labelType}`);
        }

        sub.textContent = extras.join(' · ');
      };

      updateRow();
      rowRegistry.set(m.id, updateRow);

      topLine.appendChild(badge);
      topLine.appendChild(title);

      left.appendChild(topLine);
      left.appendChild(sub);

      const btns2 = document.createElement('div');
      btns2.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end;';

      const openBtn = styledBtn(document.createElement('button'), 'primary');
      openBtn.textContent = 'Open Editor';
      openBtn.addEventListener('click', () => window.open(buildWmeEditorUrl(m.lat, m.lon, FHF.derived.grid.zoom), '_blank'));

      const liveBtn = styledBtn(document.createElement('button'), 'ghost');
      liveBtn.textContent = 'Live Map';
      liveBtn.addEventListener('click', () => window.open(buildLiveMapUrl(m.lat, m.lon), '_blank'));

      btns2.appendChild(openBtn);
      btns2.appendChild(liveBtn);

      row.appendChild(left);
      row.appendChild(btns2);
      listWrap.appendChild(row);
    });

    content.appendChild(listWrap);

    // Auto-label top N (non-blocking, incremental)
    if (FHF.cfg.labelsEnabled && FHF.cfg.maxLabels > 0) {
      labelTop((m) => { if (rowRegistry.has(m.id)) rowRegistry.get(m.id)(); }).catch(() => {});
    }
  }

  /***************************************************************************
   * PIPELINE
   ***************************************************************************/
  function recomputeAll() {
    applyFilters();
    updateCountLabel();
    recomputeDerived();
  }

  /***************************************************************************
   * REFRESH
   ***************************************************************************/
  async function refreshData(forceShowPanel) {
    try {
      if (forceShowPanel && FHF.ui.panel) FHF.ui.panel.style.display = 'flex';

      if (!findRecentEditsContainer()) {
        log('No recent edits container yet. Retrying…');
        setTimeout(() => refreshData(forceShowPanel), 800);
        return;
      }

      const raw = await collectEntriesWithPagination(MAX_LOAD_MORE_CLICKS);
      FHF.entriesRaw = raw;

      const san = sanitizeEntries(raw);

      // keep original fields (rawText/url) by id if possible
      const byId = new Map(raw.map((e) => [e.id, e]));
      FHF.entriesSan = san.map((e) => byId.get(e.id) || e);

      recomputeAll();
      render();
    } catch (e) {
      log('Refresh failed', e);
      render();
    }
  }

  /***************************************************************************
   * BOOTSTRAP
   ***************************************************************************/
  function waitForProfilePage() {
    if (findRecentEditsContainer()) init();
    else setTimeout(waitForProfilePage, 600);
  }

  function init() {
    if (window.WME_FHF_LOADED_V101) return;
    window.WME_FHF_LOADED_V101 = true;

    loadState();
    loadGeocodeCache();

    createPanel();
    FHF.darkMode = detectDarkMode();
    applyTheme();
    observeThemeChanges();

    refreshData(false);
    log('Loaded v1.0.1');
  }

  waitForProfilePage();
})();
