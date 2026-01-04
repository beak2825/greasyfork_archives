// ==UserScript==
// @name         YouTube Video Filter
// @namespace    https://github.com/quantavil
// @version      3.0.1
// @description  Filter YouTube videos by views, age, and duration; fixes Infinity storage, date UTC bugs, and unknown metadata handling
// @author       You
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/555519/YouTube%20Video%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/555519/YouTube%20Video%20Filter.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // ---------- Config/state ----------
  const filters = {
    minViews: 0,
    maxViews: Infinity,
    minDays: 0,
    maxDays: Infinity,
    minDuration: 0,
    maxDuration: Infinity,
    enabled: false,
  };

  const STORAGE_KEY = 'ytVideoFilter:v3';
  const VIDEO_HOST_SELECTORS = [
    'ytd-rich-item-renderer',
    'ytd-video-renderer',
    'ytd-grid-video-renderer',
    'ytd-compact-video-renderer',
  ];

  // ---------- Styles ----------
  GM_addStyle(`
    #yt-filter-toggle {
      position: fixed;
      top: 50%;
      right: 0;
      transform: translateY(-50%) translateX(42px);
      z-index: 10001;
      background: #000;
      color: #fff;
      border: none;
      border-radius: 8px 0 0 8px;
      padding: 16px 10px;
      cursor: pointer;
      font: 400 20px/1 Arial, sans-serif;
      box-shadow: -2px 0 12px rgba(0,0,0,.4);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), z-index 0s;
      writing-mode: vertical-rl;
      letter-spacing: 1px;
    }
    #yt-filter-toggle:hover {
      transform: translateY(-50%) translateX(0);
      background: #1a1a1a;
    }
    #yt-filter-toggle.active {
      transform: translateY(-50%) translateX(0);
      background: #1a1a1a;
      z-index: 9999;
    }
    #yt-filter-toggle::before {
      content: '⚙';
      font-size: 18px;
      display: block;
      margin-bottom: 8px;
      writing-mode: horizontal-tb;
    }
    
    #yt-filter-panel {
      position: fixed;
      top: 50%;
      right: -340px;
      transform: translateY(-50%);
      z-index: 10000;
      width: 320px;
      max-height: 85vh;
      overflow-y: auto;
      overflow-x: hidden;
      background: #0f0f0f;
      color: #fff;
      border: 1px solid #2a2a2a;
      border-right: none;
      border-radius: 12px 0 0 12px;
      box-shadow: -4px 0 24px rgba(0,0,0,.8);
      padding: 20px;
      transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      font: 13px/1.4 Roboto, Arial, sans-serif;
    }
    #yt-filter-panel.visible {
      right: 0;
    }
    #yt-filter-panel::-webkit-scrollbar {
      width: 8px;
    }
    #yt-filter-panel::-webkit-scrollbar-track {
      background: #1a1a1a;
    }
    #yt-filter-panel::-webkit-scrollbar-thumb {
      background: #3a3a3a;
      border-radius: 4px;
    }
    #yt-filter-panel::-webkit-scrollbar-thumb:hover {
      background: #4a4a4a;
    }
    
    #yt-filter-panel h3 {
      margin: 0 0 16px;
      font: 500 18px/1.2 Roboto, Arial, sans-serif;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #2a2a2a;
      padding-bottom: 12px;
    }
    .ytf-close {
      cursor: pointer;
      font-size: 24px;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background 0.2s;
    }
    .ytf-close:hover {
      background: #2a2a2a;
    }
    
    .ytf-group {
      margin-bottom: 16px;
    }
    .ytf-group label {
      display: block;
      margin-bottom: 8px;
      color: #aaa;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .ytf-row {
      display: flex;
      gap: 8px;
      position: relative;
      z-index: 1;
    }
    .ytf-input-wrapper {
      flex: 1;
      position: relative;
    }
    .ytf-input {
      width: 100%;
      padding: 10px 12px;
      border-radius: 6px;
      border: 1px solid #2a2a2a;
      background: #1a1a1a;
      color: #fff;
      font-size: 13px;
      transition: all 0.2s ease;
      position: relative;
      z-index: 2;
      box-sizing: border-box;
    }
    .ytf-input:focus {
      outline: none;
      border-color: #3ea6ff;
      z-index: 3;
    }
    .ytf-input.error {
      border-color: #ff4444;
      background: rgba(255, 68, 68, 0.1);
    }
    .ytf-input::placeholder {
      color: #666;
    }
    
    .ytf-input[type="date"] {
      position: relative;
      z-index: 2;
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
    }
    .ytf-input[type="date"]::-webkit-calendar-picker-indicator {
      filter: invert(1);
      cursor: pointer;
      position: relative;
      z-index: 4;
      opacity: 0.7;
      transition: opacity 0.2s ease;
    }
    .ytf-input[type="date"]::-webkit-calendar-picker-indicator:hover {
      opacity: 1;
    }
    .ytf-input[type="date"]::-webkit-datetime-edit {
      color: #fff;
    }
    .ytf-input[type="date"]::-webkit-datetime-edit-fields-wrapper {
      padding: 0;
    }
    .ytf-input[type="date"]::-webkit-inner-spin-button {
      display: none;
    }
    
    .ytf-error-msg {
      color: #ff4444;
      font-size: 11px;
      margin-top: 4px;
      display: none;
      animation: fadeIn 0.2s ease;
    }
    .ytf-error-msg.show {
      display: block;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-2px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .ytf-actions {
      display: flex;
      gap: 8px;
      margin-top: 20px;
    }
    .ytf-btn {
      flex: 1;
      padding: 11px;
      border-radius: 8px;
      border: 1px solid #2a2a2a;
      background: #1a1a1a;
      color: #fff;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      transition: all 0.2s;
    }
    .ytf-btn:hover:not(:disabled) {
      background: #2a2a2a;
      transform: translateY(-1px);
    }
    .ytf-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .ytf-btn.primary {
      background: #3ea6ff;
      border: none;
      color: #000;
    }
    .ytf-btn.primary:hover:not(:disabled) {
      background: #4db8ff;
    }
    .ytf-btn.primary.active {
      background: #00c853;
    }
    .ytf-btn.primary.active:hover:not(:disabled) {
      background: #00e676;
    }
    
    .ytf-stats {
      margin-top: 16px;
      padding: 12px;
      background: #1a1a1a;
      border-radius: 6px;
      border: 1px solid #2a2a2a;
      color: #aaa;
      text-align: center;
      font-size: 12px;
    }
    .ytf-hidden {
      display: none !important;
    }
  `);

  // ---------- Utilities ----------
  const qs = (root, sel) => root.querySelector(sel);
  const qsa = (root, sel) => root.querySelectorAll(sel);
  const byText = (nodes, pred) => {
    for (const n of nodes) {
      const t = (n.textContent || '').trim();
      if (t && pred(t)) return t;
    }
    return '';
  };

  const parseNumberWithSuffix = (txt) => {
    const m = (txt || '').replace(/[, ]/g, '').match(/([\d.]+)\s*([KMB])?/i);
    if (!m) {
      const num = parseInt((txt || '').replace(/[^\d]/g, ''), 10);
      return Number.isFinite(num) ? num : 0;
    }
    let n = parseFloat(m[1]) || 0;
    const s = (m[2] || '').toUpperCase();
    if (s === 'K') n *= 1e3;
    else if (s === 'M') n *= 1e6;
    else if (s === 'B') n *= 1e9;
    return Math.floor(n);
  };

  const parseViews = (txt) => parseNumberWithSuffix((txt || '').replace(/views?/i, '').trim());
  
  const parseDaysAgo = (txt) => {
    if (!txt) return Infinity;
    const s = txt.toLowerCase().replace('streamed', '').replace('premiered', '').trim();
    const m = s.match(/(\d+)\s*(second|minute|hour|day|week|month|year)s?/);
    if (!m) return Infinity;
    const v = parseInt(m[1], 10);
    const unit = m[2];
    const mult = {
      second: 1 / (24 * 3600),
      minute: 1 / (24 * 60),
      hour: 1 / 24,
      day: 1,
      week: 7,
      month: 30,
      year: 365,
    }[unit] || 1;
    return v * mult;
  };

  // ✅ FIXED: Use NaN for unknown, floor instead of round, handle LIVE
  const parseDuration = (txt) => {
    if (!txt) return NaN;
    const t = txt.trim();
    if (/^live$/i.test(t)) return NaN; // LIVE = unknown duration
    
    const parts = t.split(':').map(x => parseInt(x, 10) || 0);
    let seconds = 0;
    if (parts.length === 3) seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
    else if (parts.length === 2) seconds = parts[0] * 60 + parts[1];
    else seconds = parts[0] || 0;
    
    return Math.floor(seconds / 60); // floor, not round
  };

  // ✅ FIXED: Proper local date formatting (no UTC conversion)
  const toLocalISODate = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // ✅ FIXED: Normalize to local noon to avoid timezone issues
  const daysAgoToDate = (days) => {
    if (!Number.isFinite(days) || days === Infinity) return '';
    const d = new Date();
    d.setHours(12, 0, 0, 0); // Normalize to noon
    d.setDate(d.getDate() - Math.floor(days));
    return toLocalISODate(d);
  };

  // ✅ FIXED: Force local noon on both sides to avoid DST/UTC issues
  const dateToDaysAgo = (dateStr) => {
    if (!dateStr) return Infinity;
    const d = new Date(dateStr + 'T12:00:00'); // Force local noon
    if (isNaN(d.getTime())) return Infinity;
    const now = new Date();
    now.setHours(12, 0, 0, 0); // Normalize current time
    return Math.floor((now - d) / 86400000);
  };

  const isShorts = (host) => {
    if (qs(host, 'a[href*="/shorts/"]')) return true;
    if (qs(host, '[is-shorts], [href^="/shorts/"]')) return true;
    return false;
  };

  // ✅ IMPROVED: Enhanced selectors with fallbacks
  const getVideoMeta = (host) => {
    const metaLineSpans = qsa(host, '#metadata-line span, .inline-metadata-item');
    const cmvSpans = qsa(host, '.yt-content-metadata-view-model__metadata-row span');
    const allSpans = [...metaLineSpans, ...cmvSpans];

    const viewsTxt = byText(allSpans, t => /view/i.test(t) && !/watching/i.test(t));
    const timeTxt = byText(allSpans, t => /(ago|streamed|premiered)/i.test(t));

    // Enhanced duration detection with fallbacks
    let durationTxt =
      (qs(host, 'ytd-thumbnail-overlay-time-status-renderer #text')?.textContent || '').trim() ||
      (qs(host, 'ytd-thumbnail-overlay-time-status-renderer [id="text"]')?.textContent || '').trim() ||
      (qs(host, '.yt-thumbnail-overlay-badge-view-model .yt-badge-shape__text')?.textContent || '').trim() ||
      '';

    // Fallback: Try aria-label on thumbnail
    if (!durationTxt) {
      const thumb = qs(host, 'ytd-thumbnail[aria-label], a#thumbnail[aria-label]');
      const ariaLabel = thumb?.getAttribute('aria-label') || '';
      const match = ariaLabel.match(/(\d+:\d+(?::\d+)?)/);
      if (match) durationTxt = match[1];
    }

    return {
      views: parseViews(viewsTxt),
      daysAgo: parseDaysAgo(timeTxt),
      duration: parseDuration(durationTxt),
    };
  };

  // ---------- Filtering ----------
  // ✅ FIXED: Proper handling of unknown dates and durations
  const matches = (host) => {
    if (!filters.enabled) return true;
    
    // Ignore shorts (don't filter them)
    if (isShorts(host)) return true;

    const { views, daysAgo, duration } = getVideoMeta(host);

    // ✅ NEW: Reject videos with unknown date if any date filter is active
    const dateFilterActive = (filters.minDays > 0 || filters.maxDays < Infinity);
    if (daysAgo === Infinity && dateFilterActive) return false;

    // Apply view filters
    if (views < filters.minViews || views > filters.maxViews) return false;
    
    // Apply date filters
    if (daysAgo < filters.minDays || daysAgo > filters.maxDays) return false;
    
    // ✅ FIXED: Only apply duration filter when duration is known and finite
    const durationKnown = Number.isFinite(duration) && duration >= 0;
    if (durationKnown && (duration < filters.minDuration || duration > filters.maxDuration)) return false;

    return true;
  };

  const applyToAll = () => {
    const nodes = document.querySelectorAll(VIDEO_HOST_SELECTORS.join(','));
    let total = 0, hidden = 0;
    for (const host of nodes) {
      total++;
      if (matches(host)) {
        host.classList.remove('ytf-hidden');
      } else {
        host.classList.add('ytf-hidden');
        hidden++;
      }
    }
    const stats = document.getElementById('ytf-stats');
    if (stats) {
      if (filters.enabled) {
        stats.textContent = `Showing ${total - hidden} of ${total} videos`;
      } else {
        stats.textContent = `Filter disabled`;
      }
    }
  };

  // ✅ IMPROVED: Better debouncing for rapid mutations
  let raf = 0;
  let debounceTimer = 0;
  const scheduleApply = () => {
    if (raf) cancelAnimationFrame(raf);
    clearTimeout(debounceTimer);
    
    debounceTimer = setTimeout(() => {
      raf = requestAnimationFrame(() => {
        applyToAll();
        raf = 0;
      });
    }, 100); // Wait 100ms for rapid mutations
  };

  // ---------- Storage ----------
  // ✅ FIXED: Properly handle Infinity serialization
  const persist = () => {
    const state = {
      minViews: filters.minViews || 0,
      maxViews: Number.isFinite(filters.maxViews) ? filters.maxViews : null,
      minDays: filters.minDays || 0,
      maxDays: Number.isFinite(filters.maxDays) ? filters.maxDays : null,
      minDuration: filters.minDuration || 0,
      maxDuration: Number.isFinite(filters.maxDuration) ? filters.maxDuration : null,
      enabled: !!filters.enabled,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  };
  
  // ✅ FIXED: Coerce null back to Infinity on load
  const load = () => {
    try {
      const d = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      filters.minViews = d.minViews ?? 0;
      filters.maxViews = d.maxViews ?? Infinity;
      filters.minDays = d.minDays ?? 0;
      filters.maxDays = d.maxDays ?? Infinity;
      filters.minDuration = d.minDuration ?? 0;
      filters.maxDuration = d.maxDuration ?? Infinity;
      filters.enabled = !!d.enabled;
    } catch {
      // Keep defaults on parse error
    }
  };

  // ---------- Validation ----------
  const validateNumber = (value, allowSuffix = false) => {
    if (value === '' || value == null) return { valid: true, value: null };
    
    const cleaned = value.replace(/[,\s]/g, '');
    
    if (allowSuffix) {
      if (!/^[\d.]+[KMB]?$/i.test(cleaned)) {
        return { valid: false, error: 'Use format: 1.5K, 10M, or 1,234' };
      }
      return { valid: true, value: parseNumberWithSuffix(value) };
    }
    
    const num = parseInt(cleaned, 10);
    if (!Number.isFinite(num) || num < 0) {
      return { valid: false, error: 'Must be a positive number' };
    }
    
    return { valid: true, value: num };
  };

  const validateDate = (value) => {
    if (value === '' || value == null) return { valid: true, value: null };
    
    const d = new Date(value + 'T00:00:00');
    if (isNaN(d.getTime())) {
      return { valid: false, error: 'Invalid date format' };
    }
    
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const inputDate = new Date(value + 'T00:00:00');
    
    if (inputDate > now) {
      return { valid: false, error: 'Date cannot be in the future' };
    }
    
    return { valid: true, value: value };
  };

  const showError = (input, message) => {
    input.classList.add('error');
    const wrapper = input.closest('.ytf-input-wrapper');
    let errorMsg = wrapper.querySelector('.ytf-error-msg');
    if (!errorMsg) {
      errorMsg = document.createElement('div');
      errorMsg.className = 'ytf-error-msg';
      wrapper.appendChild(errorMsg);
    }
    errorMsg.textContent = message;
    errorMsg.classList.add('show');
  };

  const clearError = (input) => {
    input.classList.remove('error');
    const wrapper = input.closest('.ytf-input-wrapper');
    const errorMsg = wrapper.querySelector('.ytf-error-msg');
    if (errorMsg) {
      errorMsg.classList.remove('show');
    }
  };

  const validateAllInputs = (minViews, maxViews, minDate, maxDate, minDur, maxDur) => {
    const minViewsVal = validateNumber(minViews.value.trim(), true);
    const maxViewsVal = validateNumber(maxViews.value.trim(), true);
    const minDateVal = validateDate(minDate.value.trim());
    const maxDateVal = validateDate(maxDate.value.trim());
    const minDurVal = validateNumber(minDur.value.trim(), false);
    const maxDurVal = validateNumber(maxDur.value.trim(), false);

    [minViews, maxViews, minDate, maxDate, minDur, maxDur].forEach(clearError);

    let hasError = false;

    if (!minViewsVal.valid) { showError(minViews, minViewsVal.error); hasError = true; }
    if (!maxViewsVal.valid) { showError(maxViews, maxViewsVal.error); hasError = true; }
    if (!minDateVal.valid) { showError(minDate, minDateVal.error); hasError = true; }
    if (!maxDateVal.valid) { showError(maxDate, maxDateVal.error); hasError = true; }
    if (!minDurVal.valid) { showError(minDur, minDurVal.error); hasError = true; }
    if (!maxDurVal.valid) { showError(maxDur, maxDurVal.error); hasError = true; }

    // Date range validation
    if (minDateVal.valid && maxDateVal.valid && minDateVal.value && maxDateVal.value) {
      const fromDate = new Date(minDateVal.value);
      const toDate = new Date(maxDateVal.value);
      if (fromDate > toDate) {
        showError(minDate, 'From date must be before To date');
        hasError = true;
      }
    }

    return {
      valid: !hasError,
      minViews: minViewsVal.value,
      maxViews: maxViewsVal.value,
      minDate: minDateVal.value,
      maxDate: maxDateVal.value,
      minDur: minDurVal.value,
      maxDur: maxDurVal.value,
    };
  };

  // ---------- UI ----------
  const createUI = () => {
    const oldBtn = document.getElementById('yt-filter-toggle');
    const oldPanel = document.getElementById('yt-filter-panel');
    if (oldBtn) oldBtn.remove();
    if (oldPanel) oldPanel.remove();

    // Toggle button
    const btn = document.createElement('button');
    btn.id = 'yt-filter-toggle';
    btn.textContent = 'FILTER';
    document.body.appendChild(btn);

    // Panel
    const panel = document.createElement('div');
    panel.id = 'yt-filter-panel';

    const h = document.createElement('h3');
    h.textContent = 'Video Filters';
    const close = document.createElement('span');
    close.className = 'ytf-close';
    close.title = 'Close';
    close.textContent = '×';
    close.addEventListener('click', () => {
      panel.classList.remove('visible');
      btn.classList.remove('active');
    });
    h.appendChild(close);
    panel.appendChild(h);

    btn.addEventListener('click', () => {
      const isVisible = panel.classList.toggle('visible');
      btn.classList.toggle('active', isVisible);
    });

    const group = (labelTxt, inputs) => {
      const g = document.createElement('div');
      g.className = 'ytf-group';
      const l = document.createElement('label');
      l.textContent = labelTxt;
      const row = document.createElement('div');
      row.className = 'ytf-row';
      
      inputs.forEach(input => {
        const wrapper = document.createElement('div');
        wrapper.className = 'ytf-input-wrapper';
        wrapper.appendChild(input);
        row.appendChild(wrapper);
      });
      
      g.appendChild(l);
      g.appendChild(row);
      return g;
    };

    const iText = (id, ph) => {
      const i = document.createElement('input');
      i.className = 'ytf-input';
      i.id = id;
      i.placeholder = ph;
      i.type = 'text';
      return i;
    };
    
    const iDate = (id, ph) => {
      const i = document.createElement('input');
      i.className = 'ytf-input';
      i.id = id;
      i.placeholder = ph;
      i.type = 'date';
      return i;
    };
    
    const iNum = (id, ph) => {
      const i = document.createElement('input');
      i.className = 'ytf-input';
      i.id = id;
      i.placeholder = ph;
      i.type = 'number';
      i.min = '0';
      i.step = '1';
      return i;
    };

    const minViews = iText('minViews', 'Min (e.g., 10K)');
    const maxViews = iText('maxViews', 'Max (e.g., 10M)');
    const minDate = iDate('minDate', 'From');
    const maxDate = iDate('maxDate', 'To');
    const minDur  = iNum('minDuration', 'Min (mins)');
    const maxDur  = iNum('maxDuration', 'Max (mins)');

    [minViews, maxViews, minDate, maxDate, minDur, maxDur].forEach(input => {
      input.addEventListener('input', () => clearError(input));
    });

    // Hydrate inputs from loaded state
    const setVal = (el, v) => { el.value = (v === Infinity || v === 0) ? '' : String(v); };
    setVal(minViews, filters.minViews);
    setVal(maxViews, filters.maxViews);
    
    // Date mapping note: "From" (older) = maxDays, "To" (newer) = minDays
    // (because older dates have larger daysAgo values)
    minDate.value = (filters.maxDays !== Infinity) ? daysAgoToDate(filters.maxDays) : '';
    maxDate.value = (filters.minDays !== 0) ? daysAgoToDate(filters.minDays) : '';
    
    setVal(minDur,  filters.minDuration);
    setVal(maxDur,  filters.maxDuration);

    panel.appendChild(group('Views', [minViews, maxViews]));
    panel.appendChild(group('Date Range', [minDate, maxDate]));
    panel.appendChild(group('Duration (minutes)', [minDur, maxDur]));

    const actions = document.createElement('div');
    actions.className = 'ytf-actions';

    const apply = document.createElement('button');
    apply.className = 'ytf-btn primary';
    apply.id = 'ytf-apply';
    apply.textContent = filters.enabled ? 'Disable Filter' : 'Apply Filter';
    if (filters.enabled) apply.classList.add('active');
    
    apply.addEventListener('click', () => {
      if (filters.enabled) {
        // Disable mode
        filters.enabled = false;
        apply.textContent = 'Apply Filter';
        apply.classList.remove('active');
        persist();
        scheduleApply();
      } else {
        // Apply mode
        const validation = validateAllInputs(minViews, maxViews, minDate, maxDate, minDur, maxDur);
        if (!validation.valid) return;
        
        filters.minViews = validation.minViews ?? 0;
        filters.maxViews = validation.maxViews ?? Infinity;
        
        // Date range works inversely:
        // - "From" (older date) = larger daysAgo = maxDays
        // - "To" (newer date) = smaller daysAgo = minDays
        filters.maxDays = validation.minDate ? dateToDaysAgo(validation.minDate) : Infinity;
        filters.minDays = validation.maxDate ? dateToDaysAgo(validation.maxDate) : 0;
        
        filters.minDuration = validation.minDur ?? 0;
        filters.maxDuration = validation.maxDur ?? Infinity;
        
        filters.enabled = true;
        apply.textContent = 'Disable Filter';
        apply.classList.add('active');
        persist();
        scheduleApply();
      }
    });

    const reset = document.createElement('button');
    reset.className = 'ytf-btn';
    reset.textContent = 'Reset';
    reset.addEventListener('click', () => {
      [minViews, maxViews, minDate, maxDate, minDur, maxDur].forEach(i => {
        i.value = '';
        clearError(i);
      });
      
      filters.minViews = 0;
      filters.maxViews = Infinity;
      filters.minDays = 0;
      filters.maxDays = Infinity;
      filters.minDuration = 0;
      filters.maxDuration = Infinity;
      filters.enabled = false;
      
      apply.textContent = 'Apply Filter';
      apply.classList.remove('active');
      
      persist();
      scheduleApply();
    });

    actions.appendChild(apply);
    actions.appendChild(reset);
    panel.appendChild(actions);

    const stats = document.createElement('div');
    stats.className = 'ytf-stats';
    stats.id = 'ytf-stats';
    stats.textContent = filters.enabled ? 'Applying…' : 'Filter disabled';
    panel.appendChild(stats);

    document.body.appendChild(panel);
  };

  // ---------- Observers & navigation ----------
  const attachObservers = () => {
    const root = document.querySelector('ytd-app') || document.body;
    if (!root) return;

    const mo = new MutationObserver(() => scheduleApply());
    mo.observe(root, { childList: true, subtree: true });

    window.addEventListener('yt-navigate-start', () => scheduleApply(), true);
    window.addEventListener('yt-navigate-finish', () => {
      requestAnimationFrame(() => scheduleApply());
    }, true);

    window.addEventListener('load', () => scheduleApply(), true);
    window.addEventListener('popstate', () => scheduleApply(), true);
    window.addEventListener('hashchange', () => scheduleApply(), true);
  };

  // ---------- Init ----------
  const init = () => {
    load();
    createUI();
    attachObservers();
    setTimeout(scheduleApply, 600);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();