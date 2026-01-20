// ==UserScript==
// @name         Rolimons Trade Values
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Optimized for Firefox
// @match        https://www.roblox.com/trades*
// @match        https://www.roblox.com/users/*/trade*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      rolimons.com
// @connect      api.rolimons.com
// @downloadURL https://update.greasyfork.org/scripts/563281/Rolimons%20Trade%20Values.user.js
// @updateURL https://update.greasyfork.org/scripts/563281/Rolimons%20Trade%20Values.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* ------------------ CONFIG ------------------ */
  const ROLO_DEBUG = false;
  const ROLO_LINK_ICON = '🔗';

  const RIGHT_COLUMN_MIN_X_RATIO = 0.52;
  const X_THRESHOLD_PX = 260;
  const MAX_Y_DISTANCE_PX = 1700;

  const AFTERFEE_MAX_SCAN_NODES = 2200;

  // Pager search
  const ROLO_SEARCH_DEBOUNCE_MS = 1000;

  /* ------------------ SETTINGS ------------------ */
  const ROLO_STORAGE_KEY_INCLUDE_ROBUX = 'roloIncludeRobuxAfterFee';

  function getIncludeRobuxSetting() {
    const raw = localStorage.getItem(ROLO_STORAGE_KEY_INCLUDE_ROBUX);

    // Default ON, and persist it so new installs are checked
    if (raw === null) {
      localStorage.setItem(ROLO_STORAGE_KEY_INCLUDE_ROBUX, '1');
      return true;
    }

    return raw === '1';
  }


  function setIncludeRobuxSetting(v) {
    localStorage.setItem(ROLO_STORAGE_KEY_INCLUDE_ROBUX, v ? '1' : '0');
  }

  /* ------------------ LOGGING ------------------ */
  const LOG_PREFIX = '[Rolimons]';
  function log(...args) {
    if (!ROLO_DEBUG) return;
    try {
      unsafeWindow.console.log(LOG_PREFIX, ...args);
    } catch {
      console.log(LOG_PREFIX, ...args);
    }
  }

  /* ------------------ STYLE ------------------ */
  const STYLE_ID = 'rolo-style-v8';
  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;

    const s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = `
      .rolimons-inline {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-top: 2px;
        font-size: 14px;
        font-weight: 400;
        color: white;
      }
      .rolimons-inline .rolo-mark {
        color: #00a2ff;
        font-size: 15px;
        line-height: 1;
      }
      .rolimons-inline a {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        text-decoration: none;
        opacity: .85;
        transform: translateY(-.5px);
        cursor: pointer;
      }
      .rolimons-inline a:hover { opacity: 1; }

      .rolimons-total-robuxline .rolo-mark {
        display: inline-block;
        width: 16px;
        text-align: center;
        color: #00a2ff;
        font-size: 15px;
        line-height: 1;
      }

      .rolimons-delta-wrap { user-select: none; }
      .rolimons-delta-box {
        background: rgba(160,160,160,.14);
        border: 1px solid rgba(255,255,255,.06);
        border-radius: 6px;
        box-shadow: 0 0 0 1px rgba(0,0,0,.12) inset;
      }

      /* Pager search UI */
      .rolo-pager-search {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-left: 10px;
      }
      .rolo-pager-search input {
        width: 170px;
        padding: 6px 8px;
        border-radius: 6px;
        border: 1px solid rgba(255,255,255,.15);
        background: rgba(0,0,0,.20);
        color: white;
        outline: none;
        font-size: 13px;
      }
      .rolo-pager-search button {
        padding: 6px 10px;
        border-radius: 6px;
        border: 1px solid rgba(255,255,255,.12);
        background: rgba(0,0,0,.25);
        color: white;
        cursor: pointer;
        font-size: 12px;
      }
      .rolo-pager-search button:hover { background: rgba(0,0,0,.35); }
      .rolo-status {
        font-size: 12px;
        opacity: .9;
      }
            /* Results overlay ("separate page") */
      .rolo-results-overlay {
        position: fixed;
        inset: 0;
        z-index: 999999;
        background: rgba(0,0,0,.65);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .rolo-results-modal {
        width: min(900px, 92vw);
        max-height: min(80vh, 720px);
        overflow: auto;
        background: rgba(25,25,25,.98);
        border: 1px solid rgba(255,255,255,.10);
        border-radius: 14px;
        box-shadow: 0 20px 60px rgba(0,0,0,.55);
        padding: 14px;
        color: white;
      }
      .rolo-results-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 10px;
      }
      .rolo-results-head .title {
        font-size: 16px;
        font-weight: 700;
      }
      .rolo-results-head button {
        padding: 6px 10px;
        border-radius: 8px;
        border: 1px solid rgba(255,255,255,.12);
        background: rgba(0,0,0,.25);
        color: white;
        cursor: pointer;
      }
      .rolo-results-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .rolo-results-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 10px 12px;
        border-radius: 10px;
        border: 1px solid rgba(255,255,255,.08);
        background: rgba(255,255,255,.04);
      }
      .rolo-results-item .left {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
      }
      .rolo-results-item .name {
        font-weight: 650;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .rolo-results-item .meta {
        font-size: 12px;
        opacity: .9;
      }
      .rolo-results-item .actions {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-shrink: 0;
      }
      .rolo-results-item a {
        color: white;
        text-decoration: none;
        opacity: .9;
        border: 1px solid rgba(255,255,255,.12);
        border-radius: 8px;
        padding: 6px 10px;
        background: rgba(0,0,0,.22);
      }
      .rolo-results-item a:hover {
        opacity: 1;
      }
      /* Robux include toggle */
      /* Inline Robux toggle (next to delta boxes) */
      .rolo-robux-toggle-inline {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        margin-left: 10px;
        padding: 6px 10px;
        border-radius: 8px;
        border: 1px solid rgba(255,255,255,.10);
        background: rgba(0,0,0,.22);
        font-size: 12px;
        opacity: .95;
        user-select: none;
        white-space: nowrap;
      }
      .rolo-robux-toggle-inline input {
        width: 14px;
        height: 14px;
        cursor: pointer;
      }
      .rolo-robux-toggle-inline label {
        cursor: pointer;
      }
    `;
    document.head.appendChild(s);
  }

  /* ------------------ ROLIMONS DATA ------------------ */
  let itemValues = null;

  // Acronym (Rolimon's abbreviation) index: "FH" -> [itemId,...]
  let roloAcrIndex = new Map();

  const pageFallbackCache = new Map(); // id -> { rap, value }
  const pageFallbackInFlight = new Set();

  function fetchRolimonsData() {
    const tryUrl = (url) =>
      new Promise((resolve) => {
        GM_xmlhttpRequest({
          method: 'GET',
          url,
          timeout: 15000,
          onload(res) {
            try {
              const json = JSON.parse(res.responseText);
              const items = json?.items;
              if (items && typeof items === 'object') {
                itemValues = items;

                // Build acronym index after loading items
                roloAcrIndex = new Map();
                for (const [id, d] of Object.entries(itemValues)) {
                  const acr = (d?.[1] || '').toString().trim();
                  if (!acr) continue;
                  const key = acr.toUpperCase();
                  if (!roloAcrIndex.has(key)) roloAcrIndex.set(key, []);
                  roloAcrIndex.get(key).push(id);
                }

                log('Rolimons data loaded from', url, '| items:', Object.keys(items).length);
                resolve(true);

              } else {
                resolve(false);
              }
            } catch {
              resolve(false);
            }
          },
          onerror() { resolve(false); },
          ontimeout() { resolve(false); }
        });
      });

    return (async () => {
      if (await tryUrl('https://api.rolimons.com/items/v1/itemdetails')) return true;
      return await tryUrl('https://www.rolimons.com/itemapi/itemdetails');
    })();
  }

  function fetchRolimonsItemPageFallback(id, onDone) {
    if (!id) return;
    if (pageFallbackCache.has(id) || pageFallbackInFlight.has(id)) return;

    pageFallbackInFlight.add(id);

    GM_xmlhttpRequest({
      method: 'GET',
      url: `https://www.rolimons.com/item/${id}`,
      timeout: 15000,
      onload(res) {
        pageFallbackInFlight.delete(id);
        try {
          const html = res.responseText || '';
          let slice = html;
          const idx = html.search(/>\s*RAP\s*</i);
          if (idx > 0) slice = html.slice(Math.max(0, idx - 2000), idx + 7000);

          const rapMatch = slice.match(/>\s*RAP\s*<[\s\S]{0,800}?([\d,]{1,})\s*</i);
          const valMatch = slice.match(/>\s*Value\s*<[\s\S]{0,800}?([\d,]{1,})\s*</i);

          const rap = rapMatch ? Number(rapMatch[1].replace(/,/g, '')) : 0;
          const value = valMatch ? Number(valMatch[1].replace(/,/g, '')) : 0;

          pageFallbackCache.set(id, { rap: rap || 0, value: value || rap || 0 });
          onDone?.();
        } catch {}
      },
      onerror() { pageFallbackInFlight.delete(id); },
      ontimeout() { pageFallbackInFlight.delete(id); }
    });
  }

  function isProjectedItem(id) {
    if (!id || !itemValues || !itemValues[id]) return false;
    const d = itemValues[id];
    const projectedFlag = d[7] ?? d[8] ?? d[9];
    return projectedFlag === 1 || projectedFlag === true;
  }

  function isRareItem(id) {
    if (!id || !itemValues || !itemValues[id]) return false;
    const d = itemValues[id];
    const rareFlag = d[9];
    return rareFlag === 1 || rareFlag === true;
  }

  function getItemData(id, rerender) {
    if (!id) return { rap: 0, value: 0 };

    if (itemValues && itemValues[id]) {
      const d = itemValues[id];
      const rap = (d[2] != null && d[2] !== -1) ? d[2] : 0;
      const customValue = (d[3] != null && d[3] !== -1) ? d[3] : null;
      const defaultValue = (d[4] != null && d[4] !== -1) ? d[4] : null;
      const value = customValue ?? defaultValue ?? rap ?? 0;
      return { rap: rap || 0, value: value || 0 };
    }

    if (pageFallbackCache.has(id)) return pageFallbackCache.get(id) || { rap: 0, value: 0 };

    fetchRolimonsItemPageFallback(id, rerender);
    return { rap: 0, value: 0 };
  }

  const fmt = (n) => (Number(n) || 0).toLocaleString();

  /* ------------------ ID EXTRACTION ------------------ */
  function getCatalogIdFromHref(href) {
    if (!href) return null;
    const m = String(href).match(/\/catalog\/(\d+)/);
    return m?.[1] || null;
  }

  function getCatalogIdFromItemCard(item) {
    const a = item?.querySelector?.('a[href*="/catalog/"]');
    const href = a?.getAttribute('href') || a?.href;
    return getCatalogIdFromHref(href);
  }

  /* ------------------ PAGE TYPE ------------------ */
  function isCounterLikePage() {
    const p = location.pathname;
    return p.endsWith('/counter') || /\/users\/\d+\/trade\/?$/i.test(p);
  }

  /* ------------------ ROOT ------------------ */
  function findRoot() {
    return (
      document.querySelector('div[data-testid="trade-page"]') ||
      document.querySelector('#trade-page') ||
      document.querySelector('.trade-page') ||
      document.querySelector('#container-main') ||
      document.body
    );
  }

  /* ------------------ PER-RENDER RECT CACHE ------------------ */
  function makeRectCache() {
    const wm = new WeakMap();
    return (el) => {
      if (!el) return null;
      if (wm.has(el)) return wm.get(el);
      const r = el.getBoundingClientRect?.();
      const ok = r && r.width >= 2 && r.height >= 2 ? r : null;
      wm.set(el, ok);
      return ok;
    };
  }

  function rectCenterX(r) {
    return r.left + r.width / 2;
  }

  /* ------------------ TOTAL VALUE ROW FINDING ------------------ */
  function isTotalValueRow(el) {
    if (!el) return false;
    const label = el.querySelector?.('span.text-lead.ng-binding');
    if (label && (label.textContent || '').trim() === 'Total Value:') return true;

    const t = (el.textContent || '').trim();
    return t === 'Total Value:' || t.includes('Total Value:');
  }

  function findTotalValueRows(root) {
    return [...root.querySelectorAll('div.robux-line')].filter(isTotalValueRow);
  }

  /* ------------------ HELPERS ------------------ */
  function pageHasQueryHit(pagerHolder, page, query) {
    const st = getOrCreatePagerState(pagerHolder);
    const raw = (query || '').trim();
    if (!raw) return false;

    const qUpper = raw.toUpperCase();
    const qLower = raw.toLowerCase();

    const ids = st.pageCache.get(page) || [];
    if (!ids.length) return false;

    const acrIds = roloAcrIndex.get(qUpper) || [];
    const acrMode = acrIds.length > 0;

    for (const id of ids) {
      const d = itemValues?.[id];
      const name = (d?.[0] || '').toString().toLowerCase();
      if (acrMode) {
        if (acrIds.includes(id)) return true;
      } else {
        if (name.includes(qLower)) return true;
      }
    }
    return false;
  }


  function extractLastNumber(text) {
    if (!text) return 0;
    const matches = String(text).match(/(\d[\d,]*)/g);
    if (!matches || matches.length === 0) return 0;
    const last = matches[matches.length - 1];
    return Number(last.replace(/,/g, '')) || 0;
  }

  function buildCatalogLinkGeom(root, getRect) {
    const links = [...root.querySelectorAll('a[href*="/catalog/"]')];
    const out = [];
    for (const a of links) {
      const id = getCatalogIdFromHref(a.getAttribute('href') || a.href);
      if (!id) continue;
      const r = getRect(a);
      if (!r) continue;
      out.push({ id, cx: rectCenterX(r), top: r.top, bottom: r.bottom });
    }
    return out;
  }

  /* ------------------ AFTER-FEE (label->right) ------------------ */
  function findLikelySidebarContainer(totalRow) {
    return (
      totalRow?.closest?.('section, aside, .trade-summary, .trade-side, .trade-values, .container, .content') ||
      totalRow?.parentElement ||
      document.body
    );
  }

  function getTradeSideContainer(totalRow) {
    if (!totalRow) return null;

    const direct = totalRow.closest(
      '.trade-side, .trade-panel, .trade-offer, .trade-request, .trade-container, ' +
      '.trade-list-detail-offer, .trade-list-detail-request, .trade-list-detail-detail'
    );

    if (direct) return direct;

    let el = totalRow.parentElement;
    while (el && el !== document.body) {
      const totalRowsHere = [...el.querySelectorAll('div.robux-line')].filter(isTotalValueRow);
      if (totalRowsHere.length === 1) return el;
      el = el.parentElement;
    }
    return null;
  }

  function findAfterFeeAmountByLabelRight(root, getRect, totalRow, curX, curTop) {
    const scope = root || findLikelySidebarContainer(totalRow) || document.body;
    const nodes = scope.querySelectorAll('div, span, p, label, li');
    const capped = Math.min(nodes.length, AFTERFEE_MAX_SCAN_NODES);

    // avoid crossing panels
    const yBandMin = curTop - 650;
    const yBandMax = curTop + 650;

    let bestLabelRect = null;
    let bestLabelScore = Infinity;

    for (let i = 0; i < capped; i++) {
      const el = nodes[i];
      const r = getRect(el);
      if (!r) continue;

      if (r.top < yBandMin || r.bottom > yBandMax) continue;

      const x = rectCenterX(r);
      if (Math.abs(x - curX) > X_THRESHOLD_PX) continue;

      const t = (el.textContent || '').trim();
      if (!/30\s*%/i.test(t)) continue;
      if (/^\s*[\d,]+\s*$/.test(t)) continue;

      const midY = r.top + r.height / 2;
      const dy = Math.abs(midY - curTop);

      if (dy < bestLabelScore) {
        bestLabelScore = dy;
        bestLabelRect = r;
      }
    }

    if (!bestLabelRect) return 0;

    const labelMidY = bestLabelRect.top + bestLabelRect.height / 2;

    let bestAmount = 0;
    let bestScore = Infinity;

    for (let i = 0; i < capped; i++) {
      const el = nodes[i];
      const r = getRect(el);
      if (!r) continue;

      if (r.left < bestLabelRect.right + 6) continue;

      const midY = r.top + r.height / 2;
      const dy = Math.abs(midY - labelMidY);
      if (dy > 40) continue;

      const t = (el.textContent || '').trim();
      const amt = extractLastNumber(t);
      if (amt <= 0) continue;

      const dx = r.left - bestLabelRect.right;
      const score = dx + dy * 6;

      if (score < bestScore) {
        bestScore = score;
        bestAmount = amt;
      }
    }

    return bestAmount || 0;
  }

  function findAfterFeeAmountByRobuxLineInSection(root, getRect, sectionTop, sectionBottom) {
    const scope = root || document.body;

    const robuxLines = [...scope.querySelectorAll('div.robux-line')].filter((el) => {
      if (!el) return false;
      if (isTotalValueRow(el)) return false;
      if (el.classList?.contains('ng-hide')) return false;
      const r = getRect(el);
      if (!r) return false; // ignore hidden rows

      // Must be inside this section
      if (r.top < sectionTop - 0) return false;
      if (r.top > sectionBottom + 20) return false;

      const t = (el.textContent || '').toLowerCase();
      return t.includes('robux offered') && t.includes('30%') && t.includes('fee');
    });

    if (!robuxLines.length) return 0;

    // Prefer the first matching robux line in the section (usually only one)
    const best = robuxLines.sort((a, b) => (getRect(a).top - getRect(b).top))[0];

    const amountEl = best.querySelector('.robux-line-amount');
    const raw = (amountEl?.textContent || best.textContent || '').trim();
    return extractLastNumber(raw) || 0;
  }

  function findAfterFeeAmountByNearestRobuxLine(root, getRect, curX, curTop) {
    const scope = root || document.body;

    const robuxLines = [...scope.querySelectorAll('div.robux-line')].filter((el) => {
      if (!el) return false;
      if (isTotalValueRow(el)) return false;
      if (el.classList?.contains('ng-hide')) return false;

      const r = getRect(el);
      if (!r) return false;

      // must be in the same general column
      const x = rectCenterX(r);
      if (Math.abs(x - curX) > X_THRESHOLD_PX) return false;

      const t = (el.textContent || '').toLowerCase();
      return t.includes('robux offered') && t.includes('30%') && t.includes('fee');
    });

    if (!robuxLines.length) return 0;

    // Pick the robux-line closest to this Total Value row, but prefer ABOVE it.
    let bestEl = null;
    let bestScore = Infinity;

    for (const el of robuxLines) {
      const r = getRect(el);
      if (!r) continue;

      const midY = r.top + r.height / 2;
      const dy = midY - curTop;

      // Ignore far-away lines so give row doesn't steal receive robux.
      if (Math.abs(dy) > 180) continue;

      // Prefer lines above the total row (dy < 0).
      const score = Math.abs(dy) + (dy > 0 ? 250 : 0);

      if (score < bestScore) {
        bestScore = score;
        bestEl = el;
      }
    }

    if (!bestEl) return 0;

    const amountEl = bestEl.querySelector('.robux-line-amount');
    const raw = (amountEl?.textContent || bestEl.textContent || '').trim();
    return extractLastNumber(raw) || 0;
  }


  function findAfterFeeAmountGlobal(root, getRect, curTop) {
    // Find the "After 30% fee" label closest (vertically) to this totals row,
    // then grab the closest number to its right on the same horizontal band.
    const scope = root || document.body;
    const nodes = scope.querySelectorAll('div, span');
    const capped = Math.min(nodes.length, AFTERFEE_MAX_SCAN_NODES);

    const yBandMin = curTop - 350;
    const yBandMax = curTop + 250;

    let bestLabelRect = null;
    let bestLabelScore = Infinity;

    for (let i = 0; i < capped; i++) {
      const el = nodes[i];
      const r = getRect(el);
      if (!r) continue;

      if (r.top < yBandMin || r.bottom > yBandMax) continue;

      const t = (el.textContent || '').trim();
      if (!/30\s*%/i.test(t) || !/fee/i.test(t)) continue;
      if (/^\s*[\d,]+\s*$/.test(t)) continue;

     const midY = r.top + r.height / 2;
      const score = Math.abs(midY - curTop);

      if (score < bestLabelScore) {
        bestLabelScore = score;
        bestLabelRect = r;
      }
    }

    if (!bestLabelRect) return 0;

    const labelMidY = bestLabelRect.top + bestLabelRect.height / 2;
    let bestAmount = 0;
    let bestScore = Infinity;

    for (let i = 0; i < capped; i++) {
      const el = nodes[i];
      const r = getRect(el);
      if (!r) continue;

      if (r.left < bestLabelRect.right + 6) continue;

      const midY = r.top + r.height / 2;
      const dy = Math.abs(midY - labelMidY);
      if (dy > 60) continue;

      const amt = extractLastNumber((el.textContent || '').trim());
      if (amt <= 0) continue;

      const dx = r.left - bestLabelRect.right;
      const score = dx + dy * 8;

      if (score < bestScore) {
        bestScore = score;
        bestAmount = amt;
      }
    }

    return bestAmount || 0;
  }



  function getCounterAfterFeeRobux(root, getRect, totalRow, curX, curTop) {
    const fromUI = findAfterFeeAmountByLabelRight(root, getRect, totalRow, curX, curTop);
    if (fromUI > 0) return fromUI;

    // fallback: derive from input (pre-fee) => floor(*0.7)
    let bestVal = 0;
    let bestScore = Infinity;

    const candidates = root.querySelectorAll('input, textarea, [contenteditable="true"], [role="textbox"]');
    for (const el of candidates) {
      const r = getRect(el);
      if (!r) continue;
      if (r.top > curTop + 900) continue;

      let raw = '';
      if ('value' in el) raw = (el.value || '').toString();
      if (!raw) raw = (el.textContent || '').toString();
      if (!raw) raw = (el.getAttribute('aria-valuetext') || '').toString();

      raw = raw.replace(/,/g, '').trim();
      const n = extractLastNumber(raw);

      // IMPORTANT: allow "0" but treat it as 0
      if (!Number.isFinite(n) || n < 0) continue;

      const aria = (
        el.getAttribute('aria-label') ||
        el.getAttribute('placeholder') ||
        el.getAttribute('name') ||
        ''
      ).toLowerCase();

      const parentText = (el.parentElement?.textContent || '').toLowerCase();
      const looksRobux = aria.includes('robux') || aria.includes('r$') || parentText.includes('robux') || parentText.includes('r$');

      const midY = r.top + r.height / 2;

      let score = Math.abs(midY - curTop);
      if (!looksRobux) score += 250;

      if (score < bestScore) {
        bestScore = score;
        bestVal = n;
      }
    }

    return Math.floor(bestVal * 0.7) || 0;
  }

  /* ------------------ TOTALS COMPUTATION ------------------ */
  function getDisplayedTotals(totals) {
    const include = getIncludeRobuxSetting();
    return {
      rapTotal: include ? (totals.rapWithRobux || 0) : (totals.rapItemsOnly || 0),
      valueTotal: include ? (totals.valueWithRobux || 0) : (totals.valueItemsOnly || 0),
      count: totals.count || 0,
     robuxAfterFee: totals.robuxAfterFee || 0
    };
  }

  function computeTotalsForTotalRows(root, getRect, catalogLinks, rerender) {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const rightMinX = vw * RIGHT_COLUMN_MIN_X_RATIO;

    const allRows = findTotalValueRows(root)
      .map((row) => ({ row, rect: getRect(row) }))
      .filter((x) => x.rect);

    const rows = allRows.filter((x) => rectCenterX(x.rect) >= rightMinX);
    rows.sort((a, b) => (a.rect.top - b.rect.top) || (a.rect.left - b.rect.left));

    const results = [];
    const isCounter = isCounterLikePage();

    for (let i = 0; i < rows.length; i++) {
      const cur = rows[i];
      const curX = rectCenterX(cur.rect);
      const curTop = cur.rect.top;

      const nextTop = (i < rows.length - 1) ? rows[i + 1].rect.top : (curTop + 1400);
      const sectionBottom = Math.min(nextTop - 8, curTop + 1400);


      let yMin = curTop - MAX_Y_DISTANCE_PX;
      if (i > 0) {
        const prev = rows[i - 1];
        if (Math.abs(rectCenterX(prev.rect) - curX) <= X_THRESHOLD_PX) {
          yMin = Math.max(yMin, prev.rect.bottom + 8);
        }
      }

      // ✅ FIX: count duplicates (id -> count), not a Set
      const idCounts = new Map();
      for (const L of catalogLinks) {
        if (L.bottom > curTop + 8) continue;
        if (L.top < yMin) continue;
        if (Math.abs(L.cx - curX) > X_THRESHOLD_PX) continue;

        idCounts.set(L.id, (idCounts.get(L.id) || 0) + 1);
      }

      let rapTotal = 0;
      let valueTotal = 0;

      for (const [id, count] of idCounts.entries()) {
        const d = getItemData(id, rerender);
        rapTotal += (d.rap || 0) * count;
        valueTotal += (d.value || 0) * count;
      }

      let robuxAfterFee = 0;

      // ✅ /trades: match robux-line to the nearest Total Value row (prefer the line just above)
      if (!isCounter && location.pathname.startsWith('/trades')) {
        robuxAfterFee = findAfterFeeAmountByNearestRobuxLine(root, getRect, curX, curTop);
      }

      const side = getTradeSideContainer(cur.row);

      // Next: existing logic for other pages / backups
      if (robuxAfterFee <= 0 && side) {
        if (isCounter) {
          robuxAfterFee = getCounterAfterFeeRobux(side, getRect, cur.row, curX, curTop);
        } else {
          robuxAfterFee = findAfterFeeAmountByLabelRight(side, getRect, cur.row, curX, curTop);
        }
      }

      // Final fallback (rare)
      if (!isCounter && robuxAfterFee <= 0 && !location.pathname.startsWith('/trades')) {
        robuxAfterFee = findAfterFeeAmountGlobal(root, getRect, curTop);
      }



      const count = [...idCounts.values()].reduce((a, b) => a + b, 0);

      // Always keep "items only" totals
      const rapItemsOnly = rapTotal;
      const valueItemsOnly = valueTotal;

      // And also compute "with robux" totals (after-fee)
      const rapWithRobux = rapItemsOnly + (robuxAfterFee > 0 ? robuxAfterFee : 0);
      const valueWithRobux = valueItemsOnly + (robuxAfterFee > 0 ? robuxAfterFee : 0);

      const totals = {
        rapItemsOnly,
        valueItemsOnly,
        rapWithRobux,
        valueWithRobux,
        count,
        robuxAfterFee
      };



      results.push({ row: cur.row, totals });
    }

    const withItemsOrRobux = results.filter((r) => (r.totals.count > 0) || (r.totals.robuxAfterFee > 0));
    if (withItemsOrRobux.length <= 2) return withItemsOrRobux;

    const top2 = [...withItemsOrRobux]
      .sort((a, b) => {
        const scoreA = (a.totals.count * 1000000) + (a.totals.robuxAfterFee || 0);
        const scoreB = (b.totals.count * 1000000) + (b.totals.robuxAfterFee || 0);
        return scoreB - scoreA;
      })
      .slice(0, 2);

    top2.sort((a, b) => (getRect(a.row)?.top ?? 0) - (getRect(b.row)?.top ?? 0));
    return top2;
  }

  /* ------------------ INLINE ITEM VALUE ------------------ */
  function addInlineValue(target, itemId, rerender) {
    if (!target || target.querySelector('.rolimons-inline')) return;

    const { value } = getItemData(itemId, rerender);
    if (!value) return;

    const roliUrl = `https://www.rolimons.com/item/${itemId}`;

    const div = document.createElement('div');
    div.className = 'rolimons-inline';

    const mark = document.createElement('span');
    mark.className = 'rolo-mark';
    mark.textContent = '≋';

    const val = document.createElement('span');
    val.textContent = fmt(value);

    const a = document.createElement('a');
    a.className = 'rolimons-inline-link';
    a.href = roliUrl;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.title = "Open on Rolimon's";

    const icon = document.createElement('span');
    icon.style.fontSize = '13px';
    icon.style.lineHeight = '1';
    icon.textContent = ROLO_LINK_ICON;

    a.appendChild(icon);
    div.appendChild(mark);
    div.appendChild(val);
    div.appendChild(a);

    target.appendChild(div);
  }

  /* ------------------ INJECT TOTALS ------------------ */
  function injectRolimonsTotalsAndGetSides(root, getRect, catalogLinks, rerender) {
    root.querySelectorAll('.rolimons-total-robuxline').forEach((n) => n.remove());

    const rowsWithTotals = computeTotalsForTotalRows(root, getRect, catalogLinks, rerender);

    const sidesArr = rowsWithTotals.slice(0, 2).map((obj) => {
      const { row, totals } = obj;
      const shown = getDisplayedTotals(totals);

      const newRow = document.createElement('div');
      newRow.className = 'robux-line rolimons-total-robuxline';

      const left = document.createElement('span');
      left.className = 'text-lead ng-binding';
      left.style.opacity = '0';
      left.textContent = '.';

      const amtWrap = document.createElement('span');
      amtWrap.className = 'robux-line-amount';

      const mark = document.createElement('span');
      mark.className = 'rolo-mark';
      mark.textContent = '≋';

      const val = document.createElement('span');
      val.className = 'text-robux-lg robux-line-value ng-binding';
      val.style.color = 'white';
      val.textContent = fmt(shown.valueTotal);

      amtWrap.appendChild(mark);
      amtWrap.appendChild(val);
      newRow.appendChild(left);
      newRow.appendChild(amtWrap);

      row.insertAdjacentElement('afterend', newRow);

      return { totalRow: row, injectedRow: newRow, totals };
    });

    return {
      give: sidesArr[0] || null,
      receive: sidesArr[1] || null
    };
  }

  /* ------------------ DELTA UI ------------------ */
  function buildIncludeRobuxToggleInline(root, scheduleFn, robuxAfterFeeTotal) {
    const wrap = document.createElement('span');
    wrap.className = 'rolo-robux-toggle-inline';

    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = getIncludeRobuxSetting();
    cb.id = 'roloIncludeRobuxCb';

    const label = document.createElement('label');
    label.htmlFor = cb.id;

    const rbx = Number(robuxAfterFeeTotal) || 0;
    label.textContent = rbx > 0 ? `Include Robux (+${fmt(rbx)})` : 'Include Robux';

    cb.addEventListener('change', () => {
      setIncludeRobuxSetting(cb.checked);

      // IMPORTANT: /trades often replaces the DOM; don't rerender a stale root
      scheduleFn(findRoot());
    });


    wrap.appendChild(cb);
    wrap.appendChild(label);
    return wrap;
  }


  function boxLineHTML(diff, base, label, compact) {
    const up = diff >= 0;
    const arrow = up ? '▲' : '▼';
    const color = up ? '#2ecc71' : '#e74c3c';

    const abs = Math.abs(diff);
    const sign = up ? '+' : '-';

    const pct = (!base || base <= 0) ? 0 : (diff / base) * 100;
    const pAbs = Math.abs(pct);
    const pSign = pct >= 0 ? '+' : '-';

    const pad = compact ? '6px 10px' : '10px 14px';
    const width = compact ? '220px' : 'min-width:260px';
    const font = compact ? '14px' : '18px';

    return `
      <div class="rolimons-delta-box" style="padding:${pad};${compact ? `width:${width};` : `${width};`}text-align:center;">
        <span style="color:${color}; font-size:${font}; font-weight:700;">
          ${arrow} ${sign}${fmt(abs)} ${label} (${pSign}${pAbs.toFixed(1)}%)
        </span>
      </div>
    `;
  }

  function buildDeltaWrapCounterStacked(giveTotals, getTotals) {
    const rapDiff = (getTotals.rapTotal || 0) - (giveTotals.rapTotal || 0);
    const valDiff = (getTotals.valueTotal || 0) - (giveTotals.valueTotal || 0);

    const wrap = document.createElement('div');
    wrap.className = 'rolimons-delta-wrap';
    wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:6px;margin:6px 0 8px 0;';
    wrap.innerHTML = `${boxLineHTML(rapDiff, giveTotals.rapTotal, 'RAP', true)}${boxLineHTML(valDiff, giveTotals.valueTotal, 'Value', true)}`;
    return wrap;
  }

  function buildDeltaWrapNormal(giveTotals, getTotals) {
    const rapDiff = (getTotals.rapTotal || 0) - (giveTotals.rapTotal || 0);
    const valDiff = (getTotals.valueTotal || 0) - (giveTotals.valueTotal || 0);

    const wrap = document.createElement('div');
    wrap.className = 'rolimons-delta-wrap';
    wrap.style.cssText = 'display:flex;justify-content:center;align-items:center;gap:14px;flex-wrap:wrap;margin:12px 0 10px 0;';
    wrap.innerHTML = `${boxLineHTML(rapDiff, giveTotals.rapTotal, 'RAP', false)}${boxLineHTML(valDiff, giveTotals.valueTotal, 'Value', false)}`;
    return wrap;
  }

  function injectDeltaNormalTrade(root, sides) {
    root.querySelector('.rolimons-delta-wrap')?.remove();
    if (!sides?.give || !sides?.receive) return;

    const giveShown = getDisplayedTotals(sides.give.totals);
    const recvShown = getDisplayedTotals(sides.receive.totals);
    const wrap = buildDeltaWrapNormal(giveShown, recvShown);

    const robuxTotal = (sides.give.totals.robuxAfterFee || 0) + (sides.receive.totals.robuxAfterFee || 0);
    wrap.appendChild(buildIncludeRobuxToggleInline(root, scheduleForce, robuxTotal));


    sides.give.injectedRow.insertAdjacentElement('afterend', wrap);
  }

  function injectDeltaCounterBelowValue(root, sides) {
    root.querySelector('.rolimons-delta-wrap')?.remove();
    if (!sides?.give || !sides?.receive) return;

    const giveShown = getDisplayedTotals(sides.give.totals);
    const recvShown = getDisplayedTotals(sides.receive.totals);
    const wrap = buildDeltaWrapCounterStacked(giveShown, recvShown);

    const robuxTotal = (sides.give.totals.robuxAfterFee || 0) + (sides.receive.totals.robuxAfterFee || 0);
    wrap.appendChild(buildIncludeRobuxToggleInline(root, scheduleForce, robuxTotal));


    sides.give.injectedRow.insertAdjacentElement('afterend', wrap);
  }

  /* ------------------ COUNTER-LIKE: INPUT UPDATES ------------------ */
  function bindGlobalCounterLikeInput(root, scheduleFn) {
    if (!isCounterLikePage()) return;
    if (root.dataset.roloGlobalBound === '1') return;
    root.dataset.roloGlobalBound = '1';

    const handler = (e) => {
      const t = e.target;
      if (!t) return;

      const tag = (t.tagName || '').toUpperCase();
      const isEditable = tag === 'INPUT' || tag === 'TEXTAREA' || t.getAttribute?.('contenteditable') === 'true' || t.getAttribute?.('role') === 'textbox';
      if (!isEditable) return;

      scheduleFn(root);
    };

    root.addEventListener('input', handler, true);
    root.addEventListener('change', handler, true);
    root.addEventListener('keyup', handler, true);
  }

  function bindCounterField(el, scheduleFn, root) {
    if (!el?.dataset || el.dataset.roloBound === '1') return;

    const type = (el.getAttribute?.('type') || '').toLowerCase();
    const aria = (el.getAttribute?.('aria-label') || '').toLowerCase();
    const placeholder = (el.getAttribute?.('placeholder') || '').toLowerCase();
    const text = ((el.textContent || '') + '').toLowerCase();
    const val = ('value' in el ? (el.value || '') : '');

    const looksNumeric = type === 'number' || /\d/.test(val) || /\d/.test(placeholder) || /\d/.test(aria) || /\d/.test(text);
    if (!looksNumeric) return;

    el.dataset.roloBound = '1';
    const handler = () => scheduleFn(root);

    el.addEventListener('input', handler, { passive: true });
    el.addEventListener('change', handler, { passive: true });
    el.addEventListener('keyup', handler, { passive: true });
    el.addEventListener('paste', handler, { passive: true });
    el.addEventListener('blur', handler, { passive: true });
  }

  function bindCounterInputsInSubtree(node, scheduleFn, root) {
    if (!isCounterLikePage()) return;
    if (!node || node.nodeType !== 1) return;

    if (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA' || node.getAttribute('contenteditable') === 'true' || node.getAttribute('role') === 'textbox') {
      bindCounterField(node, scheduleFn, root);
    }

    const fields = node.querySelectorAll?.('input, textarea, [contenteditable="true"], [role="textbox"]');
    if (!fields) return;
    for (const el of fields) bindCounterField(el, scheduleFn, root);
  }

  function initialBindAllCounterInputs(root, scheduleFn) {
    if (!isCounterLikePage()) return;
    for (const el of root.querySelectorAll('input, textarea, [contenteditable="true"], [role="textbox"]')) {
      bindCounterField(el, scheduleFn, root);
    }
  }

  /* ------------------ LOOP-SAFE OBSERVER ------------------ */
  function isOurNode(n) {
    if (!n) return true;

    if (n.nodeType !== 1) {
      const p = n.parentElement;
      return !!p?.closest?.('.rolimons-total-robuxline, .rolimons-inline, .rolimons-delta-wrap, .rolimons-delta-box, .rolo-pager-search, .rolo-robux-toggle-inline');
    }

    return !!(
      n.classList?.contains('rolimons-total-robuxline') ||
      n.classList?.contains('rolimons-inline') ||
      n.classList?.contains('rolimons-delta-wrap') ||
      n.classList?.contains('rolimons-delta-box') ||
      n.classList?.contains('rolo-pager-search') ||
      n.classList?.contains('rolo-robux-toggle-inline') ||
      n.closest?.('.rolimons-total-robuxline, .rolimons-inline, .rolimons-delta-wrap, .rolimons-delta-box, .rolo-pager-search, .rolo-robux-toggle-inline')
    );
  }

  /* ------------------ BADGES ------------------ */
  function addProjectedBadge(itemCardEl, itemId) {
    if (!itemCardEl || !itemId) return;
    if (!isProjectedItem(itemId)) return;

    const thumb = itemCardEl.querySelector('.item-card-thumb-container') || itemCardEl.querySelector('thumbnail-2d') || itemCardEl;
    if (!thumb || thumb.querySelector('.rolo-projected-badge')) return;

    const cs = window.getComputedStyle(thumb);
    if (cs.position === 'static') thumb.style.position = 'relative';

    const badge = document.createElement('div');
    badge.className = 'rolo-projected-badge';
    badge.textContent = '⚠️';
    badge.title = "Rolimon's: Projected";
    badge.style.cssText = `
      position:absolute;
      top:6px;
      left:6px;
      z-index:5;
      font-size:16px;
      line-height:1;
      padding:3px 5px;
      border-radius:6px;
      background:rgba(0,0,0,0.55);
      box-shadow:0 1px 2px rgba(0,0,0,0.35);
      pointer-events:none;
      user-select:none;
    `;
    thumb.appendChild(badge);
  }

  function addRareBadge(itemCardEl, itemId) {
    if (!itemCardEl || !itemId) return;
    if (!isRareItem(itemId)) return;

    const thumb = itemCardEl.querySelector('.item-card-thumb-container') || itemCardEl.querySelector('thumbnail-2d') || itemCardEl;
    if (!thumb || thumb.querySelector('.rolo-rare-badge')) return;

    const cs = window.getComputedStyle(thumb);
    if (cs.position === 'static') thumb.style.position = 'relative';

    const badge = document.createElement('div');
    badge.className = 'rolo-rare-badge';
    badge.textContent = '💎';
    badge.title = "Rolimon's: Rare";
    badge.style.cssText = `
      position:absolute;
      top:6px;
      right:6px;
      z-index:5;
      font-size:16px;
      line-height:1;
      padding:3px 5px;
      border-radius:6px;
      background:rgba(0,0,0,0.55);
      box-shadow:0 1px 2px rgba(0,0,0,0.35);
      pointer-events:none;
      user-select:none;
    `;
    thumb.appendChild(badge);
  }

  /* ------------------ PAGER SEARCH (cached + debounced + case-insensitive) ------------------ */

  function closeResultsModal() {
    document.querySelector('.rolo-results-overlay')?.remove();
  }

  function openResultsModal({ query, results }) {
    closeResultsModal();

    const overlay = document.createElement('div');
    overlay.className = 'rolo-results-overlay';
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeResultsModal();
    });

    const modal = document.createElement('div');
    modal.className = 'rolo-results-modal';

    const head = document.createElement('div');
    head.className = 'rolo-results-head';

    const title = document.createElement('div');
    title.className = 'title';
    title.textContent = `Matches for "${query}" (${results.length})`;

    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.addEventListener('click', closeResultsModal);

    head.appendChild(title);
    head.appendChild(closeBtn);

    const list = document.createElement('div');
    list.className = 'rolo-results-list';

    for (const r of results) {
      const row = document.createElement('div');
      row.className = 'rolo-results-item';

      const left = document.createElement('div');
      left.className = 'left';

      const name = document.createElement('div');
      name.className = 'name';
      name.textContent = r.name || `Item ${r.id}`;

      const meta = document.createElement('div');
      meta.className = 'meta';
      meta.textContent = `Acr: ${r.acronym || '—'}  •  Value: ${fmt(r.value || 0)}  •  Page: ${r.page || '?'}`;

      left.appendChild(name);
      left.appendChild(meta);

      const actions = document.createElement('div');
      actions.className = 'actions';

      const roli = document.createElement('a');
      roli.href = `https://www.rolimons.com/item/${r.id}`;
      roli.target = '_blank';
      roli.rel = 'noopener noreferrer';
      roli.textContent = `Rolimon's ${ROLO_LINK_ICON}`;

      actions.appendChild(roli);

      row.appendChild(left);
      row.appendChild(actions);
      list.appendChild(row);
    }

    modal.appendChild(head);
    modal.appendChild(list);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  }

  const roloPagerState = new WeakMap(); // pagerHolder -> state

  function getPageNumberFromPager(pagerHolder) {
    const span =
      pagerHolder.querySelector('span[ng-bind*="cursorPaging.currentPageNumber"]') ||
      [...pagerHolder.querySelectorAll('span')].find((s) => /^Page\s+\d+/i.test((s.textContent || '').trim()));
    const m = (span?.textContent || '').match(/Page\s+(\d+)/i);
    return m ? Number(m[1]) : 0;
  }

  function findInventoryPanelFromPager(pagerHolder) {
    let el = pagerHolder;
    for (let i = 0; i < 12 && el; i++) {
      if (el.querySelectorAll?.('.item-card-container, .list-item').length) return el;
      el = el.parentElement;
    }
    return document.body;
  }

  function getTiles(panel) {
    return panel.querySelectorAll('.item-card-container, .list-item');
  }

  function getTileName(tile) {
    const nameEl = tile.querySelector('.item-card-name, .item-card-caption, .item-card-details') || tile;
    const title = nameEl.getAttribute?.('title') || '';
    const text = nameEl.textContent || '';
    return (title || text || '').trim();
  }

  function getTileCatalogId(tile) {
    return getCatalogIdFromItemCard(tile);
  }

  function filterInventoryTiles(panel, query) {
    const raw = (query || '').trim();
    const qLower = raw.toLowerCase();
    const qUpper = raw.toUpperCase();

    const tiles = getTiles(panel);
    let shown = 0;

    // Acronym priority: if query matches any Rolimon's acronym, assume acronym intent
    const acrIds = raw ? (roloAcrIndex.get(qUpper) || []) : [];
    const acrMode = raw && acrIds.length > 0;

    const matchedIds = [];

    for (const t of tiles) {
      const id = getTileCatalogId(t);
      const nameLower = getTileName(t).toLowerCase();

      let match = false;

      if (!raw) {
        match = true;
      } else if (acrMode && id) {
        match = acrIds.includes(id);
      } else {
        match = nameLower.includes(qLower);
      }

      t.style.display = match ? '' : 'none';

      if (match) {
        shown++;
        if (id) matchedIds.push(id);
      }
    }

    return { total: tiles.length, shown, matchedIds, acrMode };
  }

  function getOrCreatePagerState(pagerHolder) {
    let st = roloPagerState.get(pagerHolder);
    if (!st) {
      st = {
        runId: 0,
        debounceTimer: null,
        lastQuery: '',
        pageCache: new Map(),
        queryHits: new Map()
      };
      roloPagerState.set(pagerHolder, st);
    }
    return st;
  }

  function recordCurrentPageToCache(pagerHolder, panel) {
    const st = getOrCreatePagerState(pagerHolder);
    const page = getPageNumberFromPager(pagerHolder);
    if (!page) return;

    const ids = [];
    for (const t of getTiles(panel)) {
      const id = getTileCatalogId(t);
      if (id) ids.push(id);
    }
    if (ids.length) st.pageCache.set(page, ids);
  }

  function cachedPagesForQuery(pagerHolder, query) {
    const st = getOrCreatePagerState(pagerHolder);
    const q = (query || '').trim().toLowerCase();
    if (!q) return [];
    const hitSet = st.queryHits.get(q);
    if (!hitSet) return [];
    return [...hitSet];
  }

  function updateQueryHit(pagerHolder, query, pageNum) {
    const st = getOrCreatePagerState(pagerHolder);
    const q = (query || '').trim().toLowerCase();
    if (!q || !pageNum) return;

    let set = st.queryHits.get(q);
    if (!set) {
      set = new Set();
      st.queryHits.set(q, set);
    }
    set.add(pageNum);
  }

  function nearestPage(current, pages) {
    if (!pages || !pages.length) return 0;
    let best = pages[0];
    let bestD = Math.abs(best - current);
    for (const p of pages) {
      const d = Math.abs(p - current);
      if (d < bestD) {
        bestD = d;
        best = p;
      }
    }
    return best;
  }

  async function clickNextAndWait(pagerHolder, panel, isCanceled) {
    const nextBtn = pagerHolder.querySelector('li.pager-next > button');
    if (!nextBtn) return false;
    if (nextBtn.hasAttribute('disabled') || nextBtn.disabled) return false;

    const beforePage = getPageNumberFromPager(pagerHolder);
    const beforeFirst =
      panel.querySelector('a[href*="/catalog/"]')?.getAttribute('href') ||
      getTiles(panel)[0]?.textContent?.slice(0, 60) ||
      '';

    nextBtn.click();

    const start = Date.now();
    while (!isCanceled() && Date.now() - start < 1500) {
      await new Promise((r) => setTimeout(r, 35));

      const nowPage = getPageNumberFromPager(pagerHolder);
      const nowPanel = findInventoryPanelFromPager(pagerHolder);
      const nowFirst =
        nowPanel.querySelector('a[href*="/catalog/"]')?.getAttribute('href') ||
        getTiles(nowPanel)[0]?.textContent?.slice(0, 60) ||
        '';

      if (nowPage && beforePage && nowPage !== beforePage) return true;
      if (nowFirst && beforeFirst && nowFirst !== beforeFirst) return true;
    }
    return true;
  }

  async function clickPrevAndWait(pagerHolder, panel, isCanceled) {
    const prevBtn = pagerHolder.querySelector('li.pager-prev > button');
    if (!prevBtn) return false;
    if (prevBtn.hasAttribute('disabled') || prevBtn.disabled) return false;

    const beforePage = getPageNumberFromPager(pagerHolder);
    const beforeFirst =
      panel.querySelector('a[href*="/catalog/"]')?.getAttribute('href') ||
      getTiles(panel)[0]?.textContent?.slice(0, 60) ||
      '';

    prevBtn.click();

    const start = Date.now();
    while (!isCanceled() && Date.now() - start < 1500) {
      await new Promise((r) => setTimeout(r, 35));

      const nowPage = getPageNumberFromPager(pagerHolder);
      const nowPanel = findInventoryPanelFromPager(pagerHolder);
      const nowFirst =
        nowPanel.querySelector('a[href*="/catalog/"]')?.getAttribute('href') ||
        getTiles(nowPanel)[0]?.textContent?.slice(0, 60) ||
        '';

      if (nowPage && beforePage && nowPage !== beforePage) return true;
      if (nowFirst && beforeFirst && nowFirst !== beforeFirst) return true;
    }
    return true;
  }

  async function goToPageNearestHit(pagerHolder, panel, query, statusEl, cancelBtn, isCanceled) {
    const hits = cachedPagesForQuery(pagerHolder, query);
    if (!hits.length) return { panel, didMove: false };

    let curPage = getPageNumberFromPager(pagerHolder);
    if (!curPage) curPage = 1;

    const target = nearestPage(curPage, hits);
    if (!target || target === curPage) return { panel, didMove: false };

    statusEl.textContent = 'jumping…';
    cancelBtn.style.display = '';

    let safety = 0;
    while (!isCanceled() && safety++ < 200) {
      const pNow = getPageNumberFromPager(pagerHolder) || curPage;
      if (pNow === target) break;

      if (pNow < target) {
        const ok = await clickNextAndWait(pagerHolder, panel, isCanceled);
        if (!ok) break;
      } else {
        const ok = await clickPrevAndWait(pagerHolder, panel, isCanceled);
        if (!ok) break;
      }

      panel = findInventoryPanelFromPager(pagerHolder);
      recordCurrentPageToCache(pagerHolder, panel);

      curPage = getPageNumberFromPager(pagerHolder) || curPage;
      if (curPage === target) break;
    }

    return { panel, didMove: true };
  }

  async function lazySearchAcrossPages({ pagerHolder, panel, query, statusEl, cancelBtn }) {
    const st = getOrCreatePagerState(pagerHolder);
    const myRun = ++st.runId;
    const isCanceled = () => (roloPagerState.get(pagerHolder)?.runId !== myRun);

    const q = (query || '').trim();
    cancelBtn.style.display = q ? '' : 'none';

    recordCurrentPageToCache(pagerHolder, panel);

    let res = filterInventoryTiles(panel, q);
    statusEl.textContent = q ? `${res.shown}/${res.total}` : '';
    if (!q) return;

    const curPage = getPageNumberFromPager(pagerHolder);
    if (res.shown > 0) {
      updateQueryHit(pagerHolder, q, curPage);
      return;
    }

    const jump = await goToPageNearestHit(pagerHolder, panel, q, statusEl, cancelBtn, isCanceled);
    panel = jump.panel;

    if (isCanceled()) return;

    res = filterInventoryTiles(panel, q);
    statusEl.textContent = `${res.shown}/${res.total}`;
    const pAfterJump = getPageNumberFromPager(pagerHolder);
    if (res.shown > 0) {
      updateQueryHit(pagerHolder, q, pAfterJump);
      recordCurrentPageToCache(pagerHolder, panel);
      return;
    }

    statusEl.textContent = 'searching…';
    while (!isCanceled()) {
      const ok = await clickNextAndWait(pagerHolder, panel, isCanceled);
      if (!ok) {
        panel = findInventoryPanelFromPager(pagerHolder);
        recordCurrentPageToCache(pagerHolder, panel);
        res = filterInventoryTiles(panel, q);
        statusEl.textContent = `0/${res.total} (end)`;
        break;
      }

      panel = findInventoryPanelFromPager(pagerHolder);
      recordCurrentPageToCache(pagerHolder, panel);

      res = filterInventoryTiles(panel, q);
      statusEl.textContent = `${res.shown}/${res.total}`;

      const nowPage = getPageNumberFromPager(pagerHolder);
      if (res.shown > 0) {
        updateQueryHit(pagerHolder, q, nowPage);
        break;
      }
    }
  }

  async function listAllMatchesAcrossPages({ pagerHolder, panel, query, statusEl, cancelBtn }) {
    const st = getOrCreatePagerState(pagerHolder);
    const myRun = ++st.runId;
    const isCanceled = () => (roloPagerState.get(pagerHolder)?.runId !== myRun);

    const raw = (query || '').trim();
    if (!raw) return;

    cancelBtn.style.display = '';
    statusEl.textContent = 'listing…';

    const found = new Map();

    const captureFromPanel = (pnl) => {
      const page = getPageNumberFromPager(pagerHolder) || 1;
      const res = filterInventoryTiles(pnl, raw);

      for (const id of res.matchedIds || []) {
        if (found.has(id)) continue;
        const d = itemValues?.[id];
        const name = d?.[0] || '';
        const acronym = (d?.[1] || '').toString().trim();
        const { value } = getItemData(id, () => {});
        found.set(id, { id, name, acronym, value, page });
      }
    };

    captureFromPanel(panel);

    while (!isCanceled()) {
      statusEl.textContent = `listing… (${found.size})`;
      const ok = await clickNextAndWait(pagerHolder, panel, isCanceled);
      if (!ok) break;

      panel = findInventoryPanelFromPager(pagerHolder);
      recordCurrentPageToCache(pagerHolder, panel);
      captureFromPanel(panel);
    }

    const results = [...found.values()].sort(
      (a, b) => (a.page - b.page) || a.name.localeCompare(b.name)
    );

    statusEl.textContent = results.length ? `${results.length} found` : '0 found';
    openResultsModal({ query: raw, results });
  }

  function attachPagerSearchUI(root) {
    const pagerHolders = root.querySelectorAll('div.pager-holder');
    for (const holder of pagerHolders) {
      if (holder.querySelector('.rolo-pager-search')) continue;

      const pagerUl = holder.querySelector('ul.pager');
      if (!pagerUl) continue;

      const pageLi = [...pagerUl.querySelectorAll('li')].find((li) => {
        return li.querySelector('span[ng-bind*="cursorPaging.currentPageNumber"]') || /^Page\s+\d+/i.test((li.textContent || '').trim());
      });

      const li = document.createElement('li');
      li.className = 'rolo-pager-search';
      li.style.listStyle = 'none';

      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = 'Search all pages…';
      input.autocomplete = 'off';

      const cancelBtn = document.createElement('button');
      cancelBtn.type = 'button';
      cancelBtn.textContent = 'Cancel';
      cancelBtn.style.display = 'none';

      const listBtn = document.createElement('button');
      listBtn.type = 'button';
      listBtn.textContent = 'List';
      listBtn.style.display = 'none';

      const status = document.createElement('span');
      status.className = 'rolo-status';

      cancelBtn.addEventListener('click', () => {
        const st = getOrCreatePagerState(holder);
        st.runId++;
        if (st.debounceTimer) clearTimeout(st.debounceTimer);
        st.debounceTimer = null;
        cancelBtn.style.display = 'none';
        listBtn.style.display = 'none';
        status.textContent = '';
        closeResultsModal();
      });

      listBtn.addEventListener('click', () => {
        const st = getOrCreatePagerState(holder);
        st.runId++;

        const panel = findInventoryPanelFromPager(holder);
        listAllMatchesAcrossPages({
          pagerHolder: holder,
          panel,
          query: input.value || '',
          statusEl: status,
          cancelBtn
        });
      });

      input.addEventListener('input', () => {
        const st = getOrCreatePagerState(holder);
        const query = input.value || '';
        st.lastQuery = query;

        st.runId++;

        const panelNow = findInventoryPanelFromPager(holder);
        recordCurrentPageToCache(holder, panelNow);

        const res = filterInventoryTiles(panelNow, query);
        status.textContent = query ? `${res.shown}/${res.total}` : '';
        cancelBtn.style.display = query ? '' : 'none';
        listBtn.style.display = query ? '' : 'none';

        if (st.debounceTimer) clearTimeout(st.debounceTimer);
        if (!query) return;

        st.debounceTimer = setTimeout(() => {
          st.debounceTimer = null;
          const panel = findInventoryPanelFromPager(holder);
          lazySearchAcrossPages({
            pagerHolder: holder,
            panel,
            query: st.lastQuery,
            statusEl: status,
            cancelBtn
          });
        }, ROLO_SEARCH_DEBOUNCE_MS);
      }, { passive: true });

      li.appendChild(input);
      li.appendChild(cancelBtn);
      li.appendChild(listBtn);
      li.appendChild(status);

      if (pageLi && pageLi.nextSibling) pageLi.parentNode.insertBefore(li, pageLi.nextSibling);
      else pagerUl.appendChild(li);
    }
  }


  /* ------------------ SCHEDULER ------------------ */
  let scheduled = false;
  let timer = null;

  function schedule(root) {
    if (scheduled) return;
    scheduled = true;

    clearTimeout(timer);
    timer = setTimeout(() => {
      scheduled = false;
      processPage(root);
    }, 20);
  }
    function scheduleForce(root) {
    // Force a rerender even if one is already scheduled
    scheduled = false;
    clearTimeout(timer);
    schedule(root);
  }


  /* ------------------ MAIN PROCESS ------------------ */
  function processPage(root) {
    if (!itemValues) return;
    ensureStyle();
    const getRect = makeRectCache();

    let fallbackScheduleQueued = false;
    const rerender = () => {
      if (fallbackScheduleQueued) return;
      fallbackScheduleQueued = true;
      schedule(root);
    };

    // Pager search UI (inventory panels)
    attachPagerSearchUI(root);

    const catalogLinks = buildCatalogLinkGeom(root, getRect);

    root.querySelectorAll('.item-card-container, .list-item').forEach((item) => {
      const id = getCatalogIdFromItemCard(item);
      if (!id) return;

      addProjectedBadge(item, id);
      addRareBadge(item, id);

      const target = item.querySelector('.item-card-caption, .item-card-name') || item;
      addInlineValue(target, id, rerender);
    });

    const sides = injectRolimonsTotalsAndGetSides(root, getRect, catalogLinks, rerender);

    if (isCounterLikePage()) injectDeltaCounterBelowValue(root, sides);
    else injectDeltaNormalTrade(root, sides);

    log('render complete', { give: sides?.give?.totals, receive: sides?.receive?.totals });
  }

  /* ------------------ INIT ------------------ */
  let observer = null;

  async function init() {
    log('Script loaded');
    await fetchRolimonsData();
    ensureStyle();

    const interval = setInterval(() => {
      const root = findRoot();
      if (!root) return;

      const hasUI = root.querySelector('.item-card-container, .list-item, div.robux-line, a[href*="/catalog/"], input, textarea, [contenteditable="true"], [role="textbox"], div.pager-holder');
      if (!hasUI) return;

      clearInterval(interval);

      initialBindAllCounterInputs(root, schedule);
      bindGlobalCounterLikeInput(root, schedule);

      schedule(root);

      if (observer) observer.disconnect();

      observer = new MutationObserver((mutations) => {
        if (isCounterLikePage()) {
          for (const m of mutations) {
            for (const n of m.addedNodes) bindCounterInputsInSubtree(n, schedule, root);
          }
        }

        const onlyOurStuff = mutations.every((m) => {
          const nodes = [...m.addedNodes, ...m.removedNodes].filter((n) => n.nodeType === 1 || n.nodeType === 3);
          if (nodes.length === 0) return true;
          return nodes.every(isOurNode);
        });

        if (onlyOurStuff) return;
        schedule(root);
      });

      observer.observe(root, { childList: true, subtree: true, characterData: true });
      log('Observer attached');
    }, 500);
  }

  init();
})();