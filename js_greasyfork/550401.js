// ==UserScript==
// @name         Freetar: Widescreen Layout w/ Adjustable columns + Show Columns toggle
// @namespace    https://example.com/
// @version      3.8
// @description  Columns with width from longest line, per-column ▲▼ controls; global toggle; fills remaining viewport height; saves immediately after manual moves with verify+retry; restores per size/zoom bucket (nearest on load); auto-removes empty columns so adjustments can continue seamlessly.
// @match        http://localhost:22000/*
// @run-at       document-idle
// @noframes
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.getValue
// @grant        GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/550401/Freetar%3A%20Widescreen%20Layout%20w%20Adjustable%20columns%20%2B%20Show%20Columns%20toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/550401/Freetar%3A%20Widescreen%20Layout%20w%20Adjustable%20columns%20%2B%20Show%20Columns%20toggle.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const SELECTOR = 'div.tab.font-monospace';
  const STORAGE_KEY_PREFIX = 'ftColumns:';
  const GLOBAL_ENABLE_KEY = 'ftEnabled';
  const EXTRA_CH = 3; // extra width beyond the longest line
  const TOGGLE_ID = 'checkbox_show_columns';
  const MIN_HEIGHT_PX = 120; // guard for very small viewports

  // Bucketed manual-save with nearest-restore
  const BUCKET_STEP_H = 60;        // px bucket step for available height
  const DPR_STEP      = 0.25;      // bucket step for devicePixelRatio (captures zoom)
  const MAX_BUCKETS   = 8;         // keep at most N recent buckets per page
  const INDEX_KEY_PREFIX = 'ftColumnsIdx:'; // per-page list of saved buckets

  // Robust save config
  const SAVE_RETRY_DELAY_MS = 60;  // small delay before retry if verify failed

  let enabled = typeof GM_getValue === 'function' ? GM_getValue(GLOBAL_ENABLE_KEY, true) : true;
  let moEnhancer = null;
  let moToolbar = null;
  let enhanced = false;
  let originalHTML = null;
  let tabEl = null;
  let onResizeHandler = null;

  // Prefer Promise-based API if present
  const hasAsyncGM = typeof GM !== 'undefined'
                  && typeof GM.getValue === 'function'
                  && typeof GM.setValue === 'function';

  async function gmGet(key, def) {
    try {
      if (hasAsyncGM) return await GM.getValue(key, def);
      if (typeof GM_getValue === 'function') return GM_getValue(key, def);
    } catch {}
    return def;
  }
  async function gmSet(key, value) {
    try {
      if (hasAsyncGM) return await GM.setValue(key, value);
      if (typeof GM_setValue === 'function') { GM_setValue(key, value); return; }
    } catch {}
  }

  // --- Storage keys ---
  function storageKeyForPage() { // legacy fallback key (single layout per page)
    return STORAGE_KEY_PREFIX + location.pathname;
  }
  function indexKeyForPage() { return INDEX_KEY_PREFIX + location.pathname; }
  function storageKeyForBucket(bucket) { return `${STORAGE_KEY_PREFIX}${location.pathname}|${bucket}`; }

  // --- Bucket helpers ---
  function roundToStep(n, step) { return Math.round(n / step) * step; }

  // Height available to the columns (top of block to viewport bottom)
  function getAvailableHeightForBucket() {
    const el = tabEl || document.querySelector(SELECTOR);
    const topPx = el ? Math.max(0, el.getBoundingClientRect().top) : 0;
    return Math.max(MIN_HEIGHT_PX, Math.floor(window.innerHeight - topPx));
  }

  // Build a bucket id like "h660|d1.00"
  function computeBucketId() {
    const h = getAvailableHeightForBucket();
    const hb = Math.max(BUCKET_STEP_H, roundToStep(h, BUCKET_STEP_H));
    const dpr = window.devicePixelRatio || 1;
    const dprb = Math.max(0.5, roundToStep(dpr, DPR_STEP));
    return `h${hb}|d${dprb.toFixed(2)}`;
  }

  function parseBucketId(id) {
    const m = /^h(\d+)\|d(\d+(?:\.\d+)?)$/.exec(id);
    return m ? { h: parseInt(m[1], 10), dpr: parseFloat(m[2]) } : null;
  }
  function bucketDistance(a, b) {
    // Prefer same zoom strongly; DPR diff is weighted higher than height diff
    return Math.abs(a.h - b.h) + 100 * Math.abs(a.dpr - b.dpr);
  }

  function readBucketIndex() {
    try {
      const raw = typeof GM_getValue === 'function' ? GM_getValue(indexKeyForPage(), '[]') : '[]';
      return JSON.parse(raw) || [];
    } catch { return []; }
  }
  function writeBucketIndex(list) {
    try { if (typeof GM_setValue === 'function') GM_setValue(indexKeyForPage(), JSON.stringify(list)); } catch {}
  }
  function addBucketToIndex(bucket) {
    const list = readBucketIndex();
    const idx = list.indexOf(bucket);
    if (idx !== -1) list.splice(idx, 1); // move to end (most recent)
    list.push(bucket);
    while (list.length > MAX_BUCKETS) list.shift();
    writeBucketIndex(list);
  }

  // --- Save/load with verify+retry; only called after manual ▲/▼ ---
  function getCurrentCounts(root) {
    return Array.from(root.querySelectorAll('.ft-col-body')).map(b => b.children.length);
  }

  async function persistCountsReliably(root) {
    const counts = getCurrentCounts(root);
    const bucket = computeBucketId();
    const key = storageKeyForBucket(bucket);
    const payloadStr = JSON.stringify({ counts, v: 8, bucket, savedAt: Date.now() });

    // Write -> read verify -> small-delay retry if needed
    await gmSet(key, payloadStr);
    let got = await gmGet(key, null);
    if (got !== payloadStr) {
      await new Promise(r => setTimeout(r, SAVE_RETRY_DELAY_MS));
      await gmSet(key, payloadStr);
      got = await gmGet(key, null);
    }

    // Update index
    addBucketToIndex(bucket);
    if (got !== payloadStr) {
      try { if (typeof GM_setValue === 'function') GM_setValue(storageKeyForPage(), payloadStr); } catch {}
      console.warn('[Freetar] Save verify failed after retry; wrote legacy key as fallback:', key);
    }
  }

  function saveCountsAfterManual(root) {
    // Save now and once more on the next frame (covers late reflows)
    persistCountsReliably(root);
    try { requestAnimationFrame(() => { if (root.isConnected) persistCountsReliably(root); }); } catch {}
  }

  // On load, try exact bucket; else nearest saved bucket (prefer most recent on ties); else legacy key
  function loadCounts() {
    try {
      const curId = computeBucketId();

      // Exact
      let raw = typeof GM_getValue === 'function' ? GM_getValue(storageKeyForBucket(curId)) : null;

      // Nearest
      if (!raw) {
        const list = readBucketIndex();
        const cur = parseBucketId(curId);
        if (cur && list.length) {
          let best = null, bestDist = Infinity, bestSavedAt = -1;
          for (const id of list) {
            const candidate = typeof GM_getValue === 'function' ? GM_getValue(storageKeyForBucket(id)) : null;
            if (!candidate) continue;
            const parsed = JSON.parse(candidate);
            if (!parsed || !Array.isArray(parsed.counts)) continue;
            const spec = parseBucketId(id);
            const d = spec ? bucketDistance(spec, cur) : Infinity;
            const ts = typeof parsed.savedAt === 'number' ? parsed.savedAt : 0;
            if (d < bestDist || (d === bestDist && ts > bestSavedAt)) {
              best = parsed; bestDist = d; bestSavedAt = ts;
            }
          }
          if (best) raw = JSON.stringify(best);
        }
      }

      // Legacy fallback
      if (!raw) raw = typeof GM_getValue === 'function' ? GM_getValue(storageKeyForPage()) : null;
      if (!raw) return null;

      const parsed = JSON.parse(raw);
      return (parsed && Array.isArray(parsed.counts)) ? parsed.counts : null;
    } catch { return null; }
  }

  // Convert original tab content into div.ft-line elements (one per visual line)
  function extractLines(container) {
    const lines = [];
    let buffer = [];

    const flush = () => {
      const el = document.createElement('div');
      el.className = 'ft-line';
      if (buffer.length === 0) el.innerHTML = '&nbsp;';
      else buffer.forEach(n => el.appendChild(n));
      lines.push(el);
      buffer = [];
    };

    Array.from(container.childNodes).forEach(node => {
      if (node.nodeName === 'BR') flush();
      else buffer.push(node.cloneNode(true));
    });
    if (buffer.length) flush();
    return lines;
  }

  function computeLongestLineCh(lines) {
    let maxLen = 0;
    for (const line of lines) {
      const t = line.textContent.replace(/\u00A0/g, ' ');
      if (t.length > maxLen) maxLen = t.length;
    }
    return maxLen + EXTRA_CH;
  }

  function injectStyles() {
    if (document.querySelector('style[data-ft-enhanced-style="1"]')) return;
    const style = document.createElement('style');
    style.setAttribute('data-ft-enhanced-style', '1');
    style.textContent = `
      :root { color-scheme: light dark; }
      .container { max-width: 100% !important; width: 100% !important; }

      ${SELECTOR}.ft-enhanced {
        display: flex;
        align-items: stretch;
        gap: 2rem;
        height: var(--ft-columns-height, 80vh);
        max-height: var(--ft-columns-height, 80vh);
        overflow-x: auto;
        overflow-y: hidden;
        -webkit-overflow-scrolling: touch;
        overscroll-behavior-x: contain;
        scrollbar-gutter: stable both-edges;
        padding: 10px;
        font-variant-ligatures: none;
      }

      ${SELECTOR}.ft-enhanced .ft-col {
        flex: 0 0 auto;
        width: var(--ft-col-width, 60ch);
        min-width: var(--ft-col-width, 60ch);
        max-width: var(--ft-col-width, 60ch);
        display: flex;
        flex-direction: column;
        position: relative;
        padding: 0 10px;
        border-right: 1px solid rgba(128,128,128,0.35);
      }
      ${SELECTOR}.ft-enhanced .ft-col:last-child { border-right: none; }

      ${SELECTOR}.ft-enhanced .ft-col-body {
        flex: 1 1 auto;
        overflow: hidden;
        line-height: 1.45;
      }

      ${SELECTOR}.ft-enhanced .ft-line { white-space: pre; padding-block: 2px; }

      ${SELECTOR}.ft-enhanced .ft-col-controls {
        flex: 0 0 auto;
        display: flex;
        gap: 6px;
        justify-content: center;
        padding: 6px 0 4px;
        opacity: 0.8;
      }

      ${SELECTOR}.ft-enhanced .ft-btn {
        width: 24px; height: 24px; border-radius: 999px;
        border: 1px solid color-mix(in oklab, currentColor 25%, transparent);
        background: color-mix(in oklab, currentColor 5%, transparent);
        color: inherit; display: inline-flex; align-items: center; justify-content: center;
        font-size: 12px; cursor: pointer; opacity: 0.55;
        transition: opacity .15s ease, background-color .15s ease;
        user-select: none;
      }
      ${SELECTOR}.ft-enhanced .ft-btn:hover { opacity: 0.95; background: color-mix(in oklab, currentColor 10%, transparent); }

      @media (max-width: 768px) {
        ${SELECTOR}.ft-enhanced {
          height: auto; max-height: none; overflow: visible; display: block; padding: 10px 0;
        }
        ${SELECTOR}.ft-enhanced .ft-col {
          width: auto; min-width: 0; max-width: none; border-right: none; padding: 0;
        }
        ${SELECTOR}.ft-enhanced .ft-col-body { overflow: visible; }
        ${SELECTOR}.ft-enhanced .ft-col-controls { justify-content: flex-start; padding-bottom: 0.75rem; }
      }
    `;
    document.head.appendChild(style);
  }

  function removeStyles() {
    const el = document.querySelector('style[data-ft-enhanced-style="1"]');
    if (el) el.remove();
  }

  function createColumn() {
    const col = document.createElement('div');
    col.className = 'ft-col';
    const body = document.createElement('div');
    body.className = 'ft-col-body';
    const controls = document.createElement('div');
    controls.className = 'ft-col-controls';

    const btnUp = document.createElement('button');
    btnUp.className = 'ft-btn';
    btnUp.title = 'Pull one line from the next column';
    btnUp.textContent = '▲';

    const btnDown = document.createElement('button');
    btnDown.className = 'ft-btn';
    btnDown.title = 'Push one line to the next column';
    btnDown.textContent = '▼';

    controls.append(btnUp, btnDown);
    col.append(body, controls);
    return { col, body, btnUp, btnDown };
  }

  function getColumns(root) { return Array.from(root.querySelectorAll('.ft-col')); }
  function getBodies(root) { return Array.from(root.querySelectorAll('.ft-col-body')); }

  // NEW: remove any empty columns (not just trailing), keeping at least one column
  function pruneEmptyColumns(root) {
    while (true) {
      const cols = getColumns(root);
      if (cols.length <= 1) break;
      let removed = false;
      for (let i = 0; i < cols.length; i++) {
        const b = cols[i].querySelector('.ft-col-body');
        if (b && b.children.length === 0) {
          cols[i].remove();
          removed = true;
          break; // restart with fresh list
        }
      }
      if (!removed) break;
    }
  }

  function ensureNoOverflow(root) {
    let bodies = getBodies(root);
    for (let i = 0; i < bodies.length; i++) {
      const body = bodies[i];
      while (body.scrollHeight > body.clientHeight && body.lastElementChild) {
        const next = bodies[i + 1] || createColumnAndAttach(root).body;
        bodies = getBodies(root);
        const current = bodies[i];
        const nextBody = bodies[i + 1];
        nextBody.prepend(current.lastElementChild);
      }
    }
    // Remove any empty columns anywhere (so next adjustments skip gaps)
    pruneEmptyColumns(root);
  }

  function createColumnAndAttach(root) {
    const parts = createColumn();
    root.appendChild(parts.col);
    attachHandlers(root, parts);
    return parts;
  }

  function attachHandlers(root, parts) {
    parts.btnDown.addEventListener('click', () => {
      const cols = getColumns(root);
      const idx = cols.indexOf(parts.col);
      const bodies = getBodies(root);
      const body = bodies[idx];
      if (!body || !body.lastElementChild) return;

      const next = bodies[idx + 1] || createColumnAndAttach(root).body;
      next.prepend(body.lastElementChild);

      ensureNoOverflow(root);  // reflow + prune empties
      saveCountsAfterManual(root);
    });

    parts.btnUp.addEventListener('click', () => {
      const cols = getColumns(root);
      const idx = cols.indexOf(parts.col);
      const bodies = getBodies(root);
      const body = bodies[idx];
      const next = bodies[idx + 1];
      if (!body || !next || !next.firstElementChild) return;

      const candidate = next.firstElementChild;
      body.append(candidate);

      if (body.scrollHeight > body.clientHeight) {
        next.prepend(body.lastElementChild);
        // no return; still prune empties and save
      }
      ensureNoOverflow(root);  // reflow + prune empties
      saveCountsAfterManual(root);
    });
  }

  function buildAuto(root, lines) {
    let c = createColumnAndAttach(root);
    for (let i = 0; i < lines.length; i++) {
      c.body.append(lines[i]);
      if (c.body.scrollHeight > c.body.clientHeight) {
        const next = createColumnAndAttach(root);
        next.body.prepend(c.body.lastElementChild);
        c = next;
      }
    }
    ensureNoOverflow(root); // also prunes empties
  }

  function buildFromCounts(root, lines, counts) {
    let i = 0;
    for (let colIdx = 0; colIdx < counts.length; colIdx++) {
      const { body } = createColumnAndAttach(root);
      for (let put = 0; put < counts[colIdx] && i < lines.length; put++) {
        body.append(lines[i++]);
      }
    }
    while (i < lines.length) {
      const { body } = createColumnAndAttach(root);
      while (i < lines.length) {
        body.append(lines[i++]);
        if (body.scrollHeight > body.clientHeight) {
          const next = createColumnAndAttach(root);
          next.body.prepend(body.lastElementChild);
          break;
        }
      }
    }
    ensureNoOverflow(root); // also prunes empties
  }

  // Fill to bottom of viewport when scrolled to the top (avoids jumps mid-page)
  function setViewportFillingHeight() {
    if (!tabEl || !tabEl.classList.contains('ft-enhanced')) return;
    if (window.scrollY > 0) {
      tabEl.style.removeProperty('--ft-columns-height'); // fallback to 80vh
      return;
    }
    const rect = tabEl.getBoundingClientRect(); // relative to viewport
    const topPx = Math.max(0, rect.top);
    const target = Math.max(MIN_HEIGHT_PX, Math.floor(window.innerHeight - topPx));
    tabEl.style.setProperty('--ft-columns-height', `${target}px`);
  }

  function injectStylesOnce() {
    injectStyles();
  }

  function enhance() {
    if (enhanced) return;
    const tab = document.querySelector(SELECTOR);
    if (!tab) return;

    // Save original content for restoration
    tabEl = tab;
    originalHTML = tabEl.innerHTML;

    injectStylesOnce();

    // Build columns from lines
    const lines = extractLines(tabEl);
    const longestCh = computeLongestLineCh(lines);

    tabEl.classList.add('ft-enhanced');
    tabEl.style.setProperty('--ft-col-width', `${longestCh}ch`);
    tabEl.innerHTML = '';

    const saved = loadCounts();
    if (saved && saved.length) {
      buildFromCounts(tabEl, lines, saved);
    } else {
      buildAuto(tabEl, lines);
    }

    setTimeout(() => {
      ensureNoOverflow(tabEl);
      setViewportFillingHeight();
    }, 0);

    onResizeHandler = () => {
      ensureNoOverflow(tabEl);
      setViewportFillingHeight();
      // no save on resize/zoom
    };
    window.addEventListener('resize', onResizeHandler, { passive: true });

    window.addEventListener('load', () => {
      setViewportFillingHeight();
    }, { once: true });

    if (!moEnhancer) {
      moEnhancer = new MutationObserver(() => {
        if (!enabled) return;
        ensureNoOverflow(tabEl);
      });
      moEnhancer.observe(document.documentElement, { childList: true, subtree: true });
    }

    enhanced = true;
  }

  function disableAndRestore() {
    if (!enhanced) return;
    if (onResizeHandler) {
      window.removeEventListener('resize', onResizeHandler);
      onResizeHandler = null;
    }
    if (moEnhancer) {
      moEnhancer.disconnect();
      moEnhancer = null;
    }
    if (tabEl) {
      tabEl.classList.remove('ft-enhanced');
      tabEl.removeAttribute('style');
      tabEl.innerHTML = originalHTML || tabEl.innerHTML;
    }
    removeStyles();
    enhanced = false;
  }

  // Insert the "Show Columns" toggle (global)
  function insertToggle() {
    if (document.getElementById(TOGGLE_ID)) return;

    const transposeDown = document.getElementById('transpose_down');
    if (!transposeDown) return;

    const transposeBlock = transposeDown.closest('div');
    const toolbar = transposeBlock?.parentElement;
    if (!toolbar) return;

    const wrap = document.createElement('div');
    wrap.className = 'form-check form-switch me-4';

    const input = document.createElement('input');
    input.className = 'form-check-input';
    input.type = 'checkbox';
    input.role = 'switch';
    input.id = TOGGLE_ID;
    input.checked = !!enabled;

    const label = document.createElement('label');
    label.className = 'form-check-label';
    label.setAttribute('for', TOGGLE_ID);
    label.textContent = 'Show Columns';

    wrap.append(input, label);

    if (transposeBlock.nextSibling) {
      toolbar.insertBefore(wrap, transposeBlock.nextSibling);
    } else {
      toolbar.appendChild(wrap);
    }

    input.addEventListener('change', async () => {
      enabled = input.checked;
      try {
        if (hasAsyncGM) await GM.setValue(GLOBAL_ENABLE_KEY, enabled);
        else if (typeof GM_setValue === 'function') GM_setValue(GLOBAL_ENABLE_KEY, enabled);
      } catch {}
      if (enabled) enhance();
      else disableAndRestore();
    });
  }

  function ensureToggleInserted() {
    insertToggle();
    if (!moToolbar) {
      moToolbar = new MutationObserver(() => insertToggle());
      moToolbar.observe(document.documentElement, { childList: true, subtree: true });
    }
  }

  function init() {
    ensureToggleInserted();
    if (enabled) enhance();
    else disableAndRestore();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();