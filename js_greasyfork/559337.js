// ==UserScript==
// @name         WME Segment Age Heatmap (Last Edit)
// @namespace    https://waze.com
// @version      Final
// @description  Highlights WME segments by last edit age (0–2y green, 3–4y amber, 5–7y red, 8–10y+ black)
// @author       ShiftF5
// @match        https://www.waze.com/editor*
// @match        https://www.waze.com/*/editor*
// @match        https://beta.waze.com/editor*
// @match        https://beta.waze.com/*/editor*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559337/WME%20Segment%20Age%20Heatmap%20%28Last%20Edit%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559337/WME%20Segment%20Age%20Heatmap%20%28Last%20Edit%29.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // Prevent double-injection (WME can soft-reload parts of the app)
  if (window.__WME_SEG_AGE_HEATMAP_V133__) return;
  window.__WME_SEG_AGE_HEATMAP_V133__ = true;

  /******************************************************************
   * Config
   ******************************************************************/
  const DAY_MS = 24 * 60 * 60 * 1000;
  const YEAR_MS = 365.25 * DAY_MS;

  const STORE_KEY = 'wme_seg_age_heatmap_v133';

  const BUCKETS = [
    { label: '0–2y',  color: '#22c55e' }, // green
    { label: '3–4y',  color: '#f59e0b' }, // amber
    { label: '5–7y',  color: '#ef4444' }, // red
    { label: '8–10y+', color: '#111111' } // black
  ];

  const DEFAULT_STATE = {
    enabled: true,
    x: 22,
    y: 120,
    opacity: 0.85,
    width: 6,
    filterBuckets: null // Set([bucketIdx]) or null
  };

  /******************************************************************
   * State
   ******************************************************************/
  function loadState() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      if (parsed.filterBuckets && Array.isArray(parsed.filterBuckets)) {
        parsed.filterBuckets = new Set(parsed.filterBuckets);
      } else {
        parsed.filterBuckets = null;
      }
      return { ...DEFAULT_STATE, ...parsed };
    } catch {
      return { ...DEFAULT_STATE };
    }
  }

  function saveState() {
    try {
      const out = { ...state, filterBuckets: state.filterBuckets ? Array.from(state.filterBuckets) : null };
      localStorage.setItem(STORE_KEY, JSON.stringify(out));
    } catch {}
  }

  let state = loadState();

  const W = () => window.W;

  /******************************************************************
   * LRU cache (caps memory and removes evicted features from layer)
   ******************************************************************/
  class LRUCache {
    constructor(max = 4000) {
      this.max = max;
      this.map = new Map(); // segId -> { feat, bucketIdx, lastMs }
      this.onEvict = null;
    }
    get(id) {
      const v = this.map.get(id);
      if (!v) return null;
      this.map.delete(id);
      this.map.set(id, v);
      return v;
    }
    set(id, v) {
      if (this.map.has(id)) this.map.delete(id);
      this.map.set(id, v);
      while (this.map.size > this.max) {
        const oldestId = this.map.keys().next().value;
        const oldest = this.map.get(oldestId);
        this.map.delete(oldestId);
        try { this.onEvict && this.onEvict(oldestId, oldest); } catch {}
      }
    }
    has(id) { return this.map.has(id); }
    delete(id) { return this.map.delete(id); }
    keys() { return this.map.keys(); }
    clear() { this.map.clear(); }
  }

  /******************************************************************
   * Helpers
   ******************************************************************/
  function toMillis(v) {
    if (!v) return null;
    if (typeof v === 'number') return (v > 0 && v < 1e12) ? v * 1000 : v;
    if (v instanceof Date) return v.getTime();
    if (typeof v === 'string') {
      const t = Date.parse(v);
      return Number.isFinite(t) ? t : null;
    }
    return null;
  }

  function getLastEditMs(seg) {
    const a = seg?.attributes;
    if (!a) return null;

    // WME builds vary. We try common timestamp fields (updated first, then created as fallback).
    const candidates = [
      a.updatedOn, a.updatedAt, a.lastUpdatedOn, a.lastUpdateDate,
      a.updatedDate, a.modifiedOn, a.modifiedAt, a.editDate,
      a.createdOn, a.createdAt, a.createdDate
    ];

    for (const c of candidates) {
      const ms = toMillis(c);
      if (ms) return ms;
    }
    return null;
  }

  const yearsAgo = (ms) => (Date.now() - ms) / YEAR_MS;

  function bucketIndexFromYears(y) {
    if (y <= 2) return 0;
    if (y <= 4) return 1;
    if (y <= 7) return 2;
    return 3; // 8–10y+ bucket
  }

  function shouldShowBucket(idx) {
    return !state.filterBuckets || state.filterBuckets.has(idx);
  }

  function throttle(fn, wait) {
    let last = 0, timer = null;
    return () => {
      const now = Date.now();
      const rem = wait - (now - last);
      if (rem <= 0) {
        last = now;
        fn();
      } else {
        clearTimeout(timer);
        timer = setTimeout(() => { last = Date.now(); fn(); }, rem);
      }
    };
  }

  /******************************************************************
   * OpenLayers overlay (click-through) + incremental updates
   ******************************************************************/
  let layer = null;

  const cache = new LRUCache(4000);   // segId -> { feat, bucketIdx, lastMs }
  const dirty = new Set();            // segIds changed by model events
  const stats = { shown: 0, unknown: 0 };

  function makeClickThrough(lyr) {
    try {
      if (lyr?.div) {
        lyr.div.style.pointerEvents = 'none';
        lyr.div.style.cursor = 'default';
        lyr.div.style.userSelect = 'none';
      }
      const svg = lyr?.div?.querySelector?.('svg');
      if (svg) svg.style.pointerEvents = 'none';
      const canvas = lyr?.div?.querySelector?.('canvas');
      if (canvas) canvas.style.pointerEvents = 'none';
    } catch {}
  }

  function ensureLayer() {
    const w = W();
    const OL = window.OpenLayers;
    if (!w?.map || !OL) return null;
    if (layer) return layer;

    layer = new OL.Layer.Vector('SegAge Heatmap', {
      displayInLayerSwitcher: false,
      styleMap: new OL.StyleMap({
        'default': new OL.Style({
          strokeColor: '${strokeColor}',
          strokeOpacity: state.opacity,
          strokeWidth: state.width,
          fillOpacity: 0
        })
      })
    });

    w.map.addLayer(layer);
    try { layer.setZIndex(9999); } catch {}

    makeClickThrough(layer);

    // Evict hook: remove feature from layer
    cache.onEvict = (_segId, entry) => {
      if (entry?.feat && layer) {
        try { layer.removeFeatures([entry.feat]); } catch {}
      }
    };

    return layer;
  }

  function applyStyleControls() {
    if (!layer?.styleMap) return;
    try {
      const st = layer.styleMap.styles?.default?.defaultStyle;
      if (st) {
        st.strokeOpacity = state.opacity;
        st.strokeWidth = state.width;
      }
      layer.redraw(true);
      makeClickThrough(layer);
    } catch {}
  }

  function inView(seg) {
    try {
      const w = W();
      const ext = w?.map?.getExtent?.();
      if (!ext) return true;
      const b = seg?.geometry?.getBounds?.();
      if (!b) return true;
      return ext.intersectsBounds(b, false);
    } catch {
      return true;
    }
  }

  function getSegmentsIterable() {
    const w = W();
    const m = w?.model?.segments;
    if (!m) return [];
    if (typeof m.fetchInView === 'function') {
      try {
        const res = m.fetchInView();
        if (res && (Symbol.iterator in Object(res))) return res;
      } catch {}
    }
    if (m.objects) return Object.values(m.objects);
    return m.models || [];
  }

  function removeFeatureForSeg(segId, toRemove) {
    const entry = cache.get(segId);
    if (entry?.feat) toRemove.push(entry.feat);
    cache.delete(segId);
  }

  function redraw() {
    if (!state.enabled) return;

    const w = W();
    if (!w?.model?.segments) return;

    const lyr = ensureLayer();
    if (!lyr) return;

    makeClickThrough(lyr);

    stats.shown = 0;
    stats.unknown = 0;

    const segs = getSegmentsIterable();
    const visibleEligible = new Set();
    const dirtyProcessed = new Set();

    const toAdd = [];
    const toRemove = [];

    for (const seg of segs) {
      if (!seg) continue;

      const segId = seg.getAttribute ? seg.getAttribute('id') : seg?.attributes?.id;
      if (segId == null) continue;

      if (!inView(seg)) {
        if (cache.has(segId)) removeFeatureForSeg(segId, toRemove);
        continue;
      }

      const lastMs = getLastEditMs(seg);
      if (!lastMs) {
        stats.unknown++;
        if (cache.has(segId)) removeFeatureForSeg(segId, toRemove);
        continue;
      }

      const y = yearsAgo(lastMs);
      if (!Number.isFinite(y) || y < 0) {
        if (cache.has(segId)) removeFeatureForSeg(segId, toRemove);
        continue;
      }

      const bucketIdx = bucketIndexFromYears(y);
      if (!shouldShowBucket(bucketIdx)) {
        if (cache.has(segId)) removeFeatureForSeg(segId, toRemove);
        continue;
      }

      visibleEligible.add(segId);
      stats.shown++;

      const cached = cache.get(segId); // LRU touch
      const isDirty = dirty.has(segId);

      const needCreate = !cached || !cached.feat;
      const needUpdate = needCreate || isDirty || cached.bucketIdx !== bucketIdx || cached.lastMs !== lastMs;
      if (!needUpdate) continue;

      const strokeColor = BUCKETS[bucketIdx].color;

      if (needCreate) {
        const geom = seg.geometry;
        if (!geom?.clone) continue;
        const feat = new OpenLayers.Feature.Vector(geom.clone(), { strokeColor });
        toAdd.push(feat);
        cache.set(segId, { feat, bucketIdx, lastMs });
      } else if (isDirty) {
        // Geometry may have changed: recreate feature to stay in sync.
        removeFeatureForSeg(segId, toRemove);
        const geom = seg.geometry;
        if (!geom?.clone) continue;
        const feat = new OpenLayers.Feature.Vector(geom.clone(), { strokeColor });
        toAdd.push(feat);
        cache.set(segId, { feat, bucketIdx, lastMs });
        dirtyProcessed.add(segId);
      } else {
        cached.feat.attributes.strokeColor = strokeColor;
        cached.bucketIdx = bucketIdx;
        cached.lastMs = lastMs;
        try { cached.feat.style = null; } catch {}
        cache.set(segId, cached); // refresh LRU
      }
    }

    // Remove cached entries no longer visible/eligible
    for (const segId of Array.from(cache.keys())) {
      if (!visibleEligible.has(segId)) removeFeatureForSeg(segId, toRemove);
    }

    // Batch OpenLayers operations (chunked)
    if (toRemove.length) {
      for (let i = 0; i < toRemove.length; i += 250) {
        try { layer.removeFeatures(toRemove.slice(i, i + 250)); } catch {}
      }
    }
    if (toAdd.length) {
      for (let i = 0; i < toAdd.length; i += 250) {
        try { layer.addFeatures(toAdd.slice(i, i + 250)); } catch {}
      }
    }

    // Only clear dirty that was processed
    for (const id of dirtyProcessed) dirty.delete(id);

    if (ui?.statsLine) {
      ui.statsLine.textContent = `${stats.shown.toLocaleString()} shown • ${stats.unknown.toLocaleString()} unknown`;
    }
  }

  /******************************************************************
   * Safe redraw + idle scheduler
   ******************************************************************/
  const err = { count: 0, windowStart: Date.now() };

  function safeRedraw() {
    try {
      redraw();
      err.count = Math.max(0, err.count - 1);
    } catch (e) {
      console.warn('[SegAge] Heatmap error:', e);
      const now = Date.now();
      if (now - err.windowStart > 60_000) {
        err.windowStart = now;
        err.count = 0;
      }
      err.count++;
      if (err.count >= 4) setEnabled(false);
    }
  }

  let idleHandle = null;
  let idleFallbackTO = null;

  function scheduleRedraw() {
    if (!state.enabled) return;
    if (document.hidden) return;

    if (typeof cancelIdleCallback === 'function' && idleHandle) {
      try { cancelIdleCallback(idleHandle); } catch {}
    }
    if (idleFallbackTO) clearTimeout(idleFallbackTO);

    const run = () => safeRedraw();

    if (typeof requestIdleCallback === 'function') {
      idleHandle = requestIdleCallback(run, { timeout: 200 });
    } else {
      idleFallbackTO = setTimeout(run, 120);
    }
  }

  const scheduleRedrawThrottled = throttle(scheduleRedraw, 120);

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) scheduleRedraw();
  });

  let intervalId = null;

  function setEnabled(on) {
    state.enabled = !!on;
    saveState();

    const lyr = ensureLayer();
    if (!lyr) return;

    if (state.enabled) {
      lyr.setVisibility(true);
      makeClickThrough(lyr);
      applyStyleControls();
      scheduleRedraw();
      if (!intervalId) intervalId = setInterval(scheduleRedraw, 15000); // gentle fallback
    } else {
      lyr.setVisibility(false);
      try { lyr.removeAllFeatures(); } catch {}
      cache.clear();
      dirty.clear();
      if (intervalId) { clearInterval(intervalId); intervalId = null; }
    }

    paintToggle();
  }

  /******************************************************************
   * Compact UI
   ******************************************************************/
  let ui = null;

  function injectStyles() {
    if (document.getElementById('segAgeCompactStyle')) return;

    const style = document.createElement('style');
    style.id = 'segAgeCompactStyle';
    style.textContent = `
      :root{
        --segAge-bg: rgba(10, 12, 18, .86);
        --segAge-bg2: rgba(16, 18, 26, .92);
        --segAge-border: rgba(255,255,255,.12);
        --segAge-text: rgba(255,255,255,.92);
        --segAge-muted: rgba(255,255,255,.66);
        --segAge-shadow: 0 16px 46px rgba(0,0,0,.52);
        --segAge-r: 16px;
      }
      #segAgeWrap{ position: fixed; left:0; top:0; width:0; height:0; z-index: 999999; pointer-events:none; }
      #segAgePanel{
        position: fixed;
        width: 242px;
        border-radius: var(--segAge-r);
        background: linear-gradient(180deg, var(--segAge-bg2), var(--segAge-bg));
        border: 1px solid var(--segAge-border);
        box-shadow: var(--segAge-shadow);
        color: var(--segAge-text);
        font: 11px/1.25 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;
        backdrop-filter: blur(10px);
        pointer-events:auto;
        user-select:none;
        overflow:hidden;
      }
      #segAgeHead{
        padding: 8px 10px;
        display:flex; align-items:center; justify-content:space-between;
        border-bottom: 1px solid rgba(255,255,255,.10);
        cursor: move;
      }
      #segAgeBrand{ display:flex; align-items:center; gap:8px; min-width:0; }
      #segAgeLogo{
        width: 22px; height: 22px; border-radius: 8px;
        background: radial-gradient(circle at 30% 30%, rgba(99,102,241,.9), rgba(34,197,94,.55));
        border: 1px solid rgba(255,255,255,.14);
        flex: 0 0 auto;
      }
      #segAgeTitleWrap{ min-width:0; }
      #segAgeTitle{ font-weight:900; font-size:12px; letter-spacing:.2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
      #segAgeSub{ margin-top:1px; font-size:10px; color: var(--segAge-muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
      #segAgeToggle{
        border: 1px solid rgba(255,255,255,.14);
        background: rgba(255,255,255,.06);
        border-radius: 999px;
        padding: 6px 9px;
        cursor:pointer;
        color: var(--segAge-text);
        font-weight: 900;
        letter-spacing:.3px;
        min-width: 56px;
        text-align:center;
      }
      #segAgeToggle.on{ background: rgba(34,197,94,.14); border-color: rgba(34,197,94,.28); }
      #segAgeToggle.off{ opacity: .75; }
      #segAgeBody{ padding: 10px; }

      #segAgeTopRow{ display:flex; gap:6px; align-items:center; margin-bottom: 8px; }
      #segAgePill{
        height: 28px; padding: 0 8px; border-radius: 10px;
        display:flex; align-items:center; justify-content:center;
        background: rgba(255,255,255,.05);
        border: 1px solid rgba(255,255,255,.10);
        color: var(--segAge-muted);
        font-size: 10px;
        white-space: nowrap;
      }
      #segAgeQuickBar{ display:flex; gap:6px; align-items:center; }
      .segAgeQBtn{
        height: 28px; padding: 0 8px; border-radius: 10px;
        border: 1px solid rgba(255,255,255,.10);
        background: rgba(255,255,255,.05);
        color: rgba(255,255,255,.86);
        font-weight: 900;
        cursor: pointer;
        font-size: 10px;
      }

      #segAgeControls{
        margin-bottom: 8px;
        padding: 8px;
        border-radius: 12px;
        background: rgba(255,255,255,.05);
        border: 1px solid rgba(255,255,255,.10);
      }
      .segAgeCtrlRow{ display:flex; align-items:center; justify-content:space-between; gap:8px; }
      .segAgeCtrlRow + .segAgeCtrlRow{ margin-top: 8px; }
      .segAgeCtrlLabel{ color: var(--segAge-text); opacity:.88; font-weight:750; font-size: 10px; } /* FIX #1 */
      .segAgeCtrlValue{ color: var(--segAge-muted); font-variant-numeric: tabular-nums; font-size: 10px; }
      .segAgeRange{ width: 100%; margin-top: 5px; }

      #segAgeLegend{
        padding: 8px;
        border-radius: 12px;
        background: rgba(255,255,255,.05);
        border: 1px solid rgba(255,255,255,.10);
      }
      .segAgeRow{
        display:flex; align-items:center; justify-content:space-between;
        padding: 6px 6px;
        border-radius: 10px;
        background: rgba(255,255,255,.04);
        border: 1px solid rgba(255,255,255,.06);
        cursor: pointer;
      }
      .segAgeRow + .segAgeRow{ margin-top: 6px; }
      .segAgeRow.active{
        outline: 2px solid rgba(99,102,241,.45);
        background: rgba(99,102,241,.10);
      }
      .segAgeLeft{ display:flex; align-items:center; gap:8px; min-width:0; }
      .segAgeSwatch{ width:12px; height:12px; border-radius:4px; border:1px solid rgba(255,255,255,.18); }
      .segAgeLabel{ font-weight:800; font-size: 10px; }
      .segAgeBadge{
        font-size: 10px;
        color: var(--segAge-muted);
        border: 1px solid rgba(255,255,255,.10);
        background: rgba(255,255,255,.04);
        padding: 2px 6px;
        border-radius: 999px;
        white-space: nowrap;
      }
      #segAgeFoot{
        margin-top: 8px;
        font-size: 10px;
        color: var(--segAge-muted);
        display:flex; justify-content:space-between; gap:8px;
      }
      #segAgeFoot b{ color: var(--segAge-text); font-weight: 900; }
    `;
    document.head.appendChild(style);
  }

  function paintLegendActive(rows) {
    for (let i = 0; i < rows.length; i++) {
      rows[i].classList.toggle('active', !!state.filterBuckets && state.filterBuckets.has(i));
    }
  }

  function toggleBucketFilter(bucketIdx, withShift, legendRows) {
    if (!withShift) {
      if (state.filterBuckets && state.filterBuckets.size === 1 && state.filterBuckets.has(bucketIdx)) {
        state.filterBuckets = null; // reset
      } else {
        state.filterBuckets = new Set([bucketIdx]);
      }
    } else {
      if (!state.filterBuckets) state.filterBuckets = new Set();
      state.filterBuckets.has(bucketIdx) ? state.filterBuckets.delete(bucketIdx) : state.filterBuckets.add(bucketIdx);
      if (state.filterBuckets.size === 0) state.filterBuckets = null;
    }
    saveState();

    try { layer?.removeAllFeatures(); } catch {}
    cache.clear();
    scheduleRedraw();

    paintLegendActive(legendRows);
  }

  function paintToggle() {
    if (!ui?.toggleBtn) return;
    ui.toggleBtn.textContent = state.enabled ? 'ON' : 'OFF';
    ui.toggleBtn.classList.toggle('on', state.enabled);
    ui.toggleBtn.classList.toggle('off', !state.enabled);
  }

  function createUI() {
    injectStyles();

    const wrap = document.createElement('div');
    wrap.id = 'segAgeWrap';

    const panel = document.createElement('div');
    panel.id = 'segAgePanel';
    panel.style.left = `${state.x}px`;
    panel.style.top = `${state.y}px`;

    // header
    const head = document.createElement('div');
    head.id = 'segAgeHead';

    const brand = document.createElement('div');
    brand.id = 'segAgeBrand';

    const logo = document.createElement('div');
    logo.id = 'segAgeLogo';

    const titleWrap = document.createElement('div');
    titleWrap.id = 'segAgeTitleWrap';

    const title = document.createElement('div');
    title.id = 'segAgeTitle';
    title.textContent = 'WME Segment Heatmap';

    const sub = document.createElement('div');
    sub.id = 'segAgeSub';
    sub.textContent = 'Age • last edit';

    titleWrap.appendChild(title);
    titleWrap.appendChild(sub);

    brand.appendChild(logo);
    brand.appendChild(titleWrap);

    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.id = 'segAgeToggle';
    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      setEnabled(!state.enabled);
    });

    head.appendChild(brand);
    head.appendChild(toggleBtn);

    // body
    const body = document.createElement('div');
    body.id = 'segAgeBody';

    const topRow = document.createElement('div');
    topRow.id = 'segAgeTopRow';

    const pill = document.createElement('div');
    pill.id = 'segAgePill';
    pill.textContent = 'Viewport';

    const quickBar = document.createElement('div');
    quickBar.id = 'segAgeQuickBar';

    // legend rows need to exist before callbacks use them (FIX #2)
    const legendRows = [];

    const mkBtn = (txt, titleText, onClick) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'segAgeQBtn';
      b.textContent = txt;
      b.title = titleText;
      b.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); onClick(); });
      return b;
    };

    const btnAll = mkBtn('ALL', 'Show all buckets', () => {
      state.filterBuckets = null;
      saveState();
      try { layer?.removeAllFeatures(); } catch {}
      cache.clear();
      scheduleRedraw();
      paintLegendActive(legendRows);
    });

    const btnOld = mkBtn('OLD', 'Only old (5+ years)', () => {
      state.filterBuckets = new Set([2, 3]);
      saveState();
      try { layer?.removeAllFeatures(); } catch {}
      cache.clear();
      scheduleRedraw();
      paintLegendActive(legendRows);
    });

    const btnReset = mkBtn('⟲', 'Reset filters + sliders', () => {
      state.opacity = DEFAULT_STATE.opacity;
      state.width = DEFAULT_STATE.width;
      state.filterBuckets = null;
      saveState();

      ui.opRange.value = String(state.opacity);
      ui.wRange.value = String(state.width);

      applyStyleControls();
      try { layer?.removeAllFeatures(); } catch {}
      cache.clear();
      scheduleRedraw();
      paintLegendActive(legendRows);
    });

    quickBar.appendChild(btnAll);
    quickBar.appendChild(btnOld);
    quickBar.appendChild(btnReset);

    topRow.appendChild(pill);
    topRow.appendChild(quickBar);

    // controls
    const controls = document.createElement('div');
    controls.id = 'segAgeControls';

    const mkSlider = (labelText, valueText, min, max, step, value, onInput) => {
      const row = document.createElement('div');
      row.className = 'segAgeCtrlRow';

      const label = document.createElement('div');
      label.className = 'segAgeCtrlLabel';
      label.textContent = labelText;

      const val = document.createElement('div');
      val.className = 'segAgeCtrlValue';
      val.textContent = valueText;

      row.appendChild(label);
      row.appendChild(val);

      const range = document.createElement('input');
      range.className = 'segAgeRange';
      range.type = 'range';
      range.min = String(min);
      range.max = String(max);
      range.step = String(step);
      range.value = String(value);

      range.addEventListener('input', () => onInput(range.value, val));

      return { row, range };
    };

    const op = mkSlider('Opacity', `${Math.round(state.opacity * 100)}%`, 0.20, 1.00, 0.05, state.opacity,
      (v, valEl) => {
        state.opacity = Number(v);
        valEl.textContent = `${Math.round(state.opacity * 100)}%`;
        saveState();
        applyStyleControls();
      }
    );

    const wd = mkSlider('Width', `${state.width}px`, 2, 10, 1, state.width,
      (v, valEl) => {
        state.width = Number(v);
        valEl.textContent = `${state.width}px`;
        saveState();
        applyStyleControls();
      }
    );

    controls.appendChild(op.row);
    controls.appendChild(op.range);
    controls.appendChild(wd.row);
    controls.appendChild(wd.range);

    // legend
    const legend = document.createElement('div');
    legend.id = 'segAgeLegend';

    BUCKETS.forEach((b, idx) => {
      const row = document.createElement('div');
      row.className = 'segAgeRow';

      const left = document.createElement('div');
      left.className = 'segAgeLeft';

      const sw = document.createElement('div');
      sw.className = 'segAgeSwatch';
      sw.style.background = b.color;

      const lbl = document.createElement('div');
      lbl.className = 'segAgeLabel';
      lbl.textContent = b.label;

      left.appendChild(sw);
      left.appendChild(lbl);

      const badge = document.createElement('div');
      badge.className = 'segAgeBadge';
      badge.textContent = 'Filter';

      row.appendChild(left);
      row.appendChild(badge);

      row.addEventListener('click', (e) => {
        e.preventDefault(); e.stopPropagation();
        toggleBucketFilter(idx, !!e.shiftKey, legendRows);
      });

      legend.appendChild(row);
      legendRows.push(row);
    });

    // footer
    const foot = document.createElement('div');
    foot.id = 'segAgeFoot';

    const statsLine = document.createElement('span');
    statsLine.textContent = '0 shown • 0 unknown';

    const help = document.createElement('span');
    help.innerHTML = `Auto: <b>idle</b>`;

    foot.appendChild(statsLine);
    foot.appendChild(help);

    body.appendChild(topRow);
    body.appendChild(controls);
    body.appendChild(legend);
    body.appendChild(foot);

    panel.appendChild(head);
    panel.appendChild(body);

    // draggable (header only)
    const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
    let dragging = false, startX = 0, startY = 0, baseX = 0, baseY = 0;

    function onDown(ev) {
      dragging = true;
      const e = ev.touches ? ev.touches[0] : ev;
      startX = e.clientX; startY = e.clientY;
      const rect = panel.getBoundingClientRect();
      baseX = rect.left; baseY = rect.top;

      ev.preventDefault(); ev.stopPropagation();
      document.addEventListener('mousemove', onMove, { passive: false });
      document.addEventListener('mouseup', onUp, { passive: false });
      document.addEventListener('touchmove', onMove, { passive: false });
      document.addEventListener('touchend', onUp, { passive: false });
    }

    function onMove(ev) {
      if (!dragging) return;
      const e = ev.touches ? ev.touches[0] : ev;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      const newX = clamp(baseX + dx, 8, window.innerWidth - 260);
      const newY = clamp(baseY + dy, 8, window.innerHeight - 90);

      panel.style.left = `${newX}px`;
      panel.style.top = `${newY}px`;

      ev.preventDefault(); ev.stopPropagation();
    }

    function onUp(ev) {
      if (!dragging) return;
      dragging = false;

      const rect = panel.getBoundingClientRect();
      state.x = Math.round(rect.left);
      state.y = Math.round(rect.top);
      saveState();

      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);

      ev.preventDefault(); ev.stopPropagation();
    }

    head.addEventListener('mousedown', onDown, { passive: false });
    head.addEventListener('touchstart', onDown, { passive: false });

    wrap.appendChild(panel);
    document.body.appendChild(wrap);

    ui = {
      toggleBtn,
      statsLine,
      legendRows, // FIX #2: ensure exposed and assigned
      opRange: op.range,
      wRange: wd.range
    };

    paintToggle();
    paintLegendActive(legendRows);

    return ui;
  }

  /******************************************************************
   * Model hooks (do not use arguments[0] in arrow functions)
   ******************************************************************/
  function hookModelEvents() {
    try {
      const w = W();
      const segModel = w?.model?.segments;
      if (!segModel?.on) return;

      const markDirty = (m) => {
        const id = m?.get?.('id') ?? m?.attributes?.id;
        if (id != null) dirty.add(id);
      };

      segModel.on('change', (m) => { markDirty(m); scheduleRedrawThrottled(); });
      segModel.on('add',    (m) => { markDirty(m); scheduleRedrawThrottled(); });

      segModel.on('remove', (m) => {
        const id = m?.get?.('id') ?? m?.attributes?.id;
        if (id != null) {
          dirty.delete(id);
          cache.delete(id);
        }
        scheduleRedrawThrottled();
      });

      segModel.on('reset', () => {
        try { layer?.removeAllFeatures(); } catch {}
        cache.clear();
        dirty.clear();
        scheduleRedrawThrottled();
      });
    } catch {}
  }

  /******************************************************************
   * Boot
   ******************************************************************/
  function boot() {
    const w = W();
    if (!w?.map || !w?.model?.segments || !window.OpenLayers) return false;

    ensureLayer();
    createUI();
    applyStyleControls();

    try { w.map.events.register('moveend', null, scheduleRedrawThrottled); } catch {}
    try { w.map.events.register('zoomend', null, scheduleRedrawThrottled); } catch {}

    hookModelEvents();
    setEnabled(state.enabled);
    scheduleRedraw();

    return true;
  }

  const timer = setInterval(() => {
    if (boot()) clearInterval(timer);
  }, 500);
})();
