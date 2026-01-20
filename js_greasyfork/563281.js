// ==UserScript==
// @name         Rolimons Trade Values
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Rolimons per-item value + totals + delta UI + accurate after-fee robux (label->right + robust fallback) + live input updates on counter-like pages. Optimized for Firefox: scoped DOM scans, per-frame rect cache, minimal rebinding.
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

  // Geometry / banding
  const RIGHT_COLUMN_MIN_X_RATIO = 0.52;
  const X_THRESHOLD_PX = 260;
  const MAX_Y_DISTANCE_PX = 1700;

  // After-fee search scope
  const AFTERFEE_Y_BAND_PX = 220; // only look near the label row
  const AFTERFEE_MAX_SCAN_NODES = 2200; // safety cap if Roblox changes markup

  /* ------------------ LOGGING ------------------ */
  const LOG_PREFIX = '[Rolimons]';
  function log(...args) {
    if (!ROLO_DEBUG) return;
    try { unsafeWindow.console.log(LOG_PREFIX, ...args); }
    catch { console.log(LOG_PREFIX, ...args); }
  }

  /* ------------------ STYLE (inject once) ------------------ */
  const STYLE_ID = 'rolo-style-v7';
  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = `
      .rolimons-inline{display:flex;align-items:center;gap:6px;margin-top:2px;font-size:14px;font-weight:400;color:white}
      .rolimons-inline .rolo-mark{color:#00a2ff;font-size:15px;line-height:1}
      .rolimons-inline a{display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;text-decoration:none;opacity:.85;transform:translateY(-.5px);cursor:pointer}
      .rolimons-inline a:hover{opacity:1}
      .rolimons-total-robuxline .rolo-mark{display:inline-block;width:16px;text-align:center;color:#00a2ff;font-size:15px;line-height:1}
      .rolimons-delta-wrap{user-select:none}
      .rolimons-delta-box{background:rgba(160,160,160,.14);border:1px solid rgba(255,255,255,.06);border-radius:6px;box-shadow:0 0 0 1px rgba(0,0,0,.12) inset}
    `;
    document.head.appendChild(s);
  }

  /* ------------------ ROLIMONS DATA ------------------ */
  let itemValues = null;

  const pageFallbackCache = new Map(); // id -> { rap, value }
  const pageFallbackInFlight = new Set();

  function fetchRolimonsData() {
    const tryUrl = (url) => new Promise((resolve) => {
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
              log('Rolimons data loaded from', url, '| items:', Object.keys(itemValues).length);
              resolve(true);
            } else resolve(false);
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

          const finalValue = value || rap || 0;
          pageFallbackCache.set(id, { rap: rap || 0, value: finalValue });
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
    // Rolimons itemdetails: Rare is index 9 (0-based)
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
  function rectCenterX(r) { return r.left + r.width / 2; }

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

  /* ------------------ GEOMETRY HELPERS ------------------ */
  function extractLastNumber(text) {
    if (!text) return 0;
    const matches = String(text).match(/(\d[\d,]*)/g);
    if (!matches || matches.length === 0) return 0;
    const last = matches[matches.length - 1];
    return Number(last.replace(/,/g, '')) || 0;
  }

  /* ------------------ BUILD LINK GEOMETRY (once per render) ------------------ */
  function buildCatalogLinkGeom(root, getRect) {
    const links = [...root.querySelectorAll('a[href*="/catalog/"]')];
    const out = [];
    for (const a of links) {
      const id = getCatalogIdFromHref(a.getAttribute('href') || a.href);
      if (!id) continue;
      const r = getRect(a);
      if (!r) continue;
      out.push({ id, rect: r, cx: rectCenterX(r), top: r.top, bottom: r.bottom });
    }
    return out;
  }

  /* ------------------ AFTER-FEE (scoped, cached) ------------------ */
  function findLikelySidebarContainer(totalRow) {
  // Prefer a small subtree near totals; fallback to row parent or body
    return (
      totalRow?.closest?.('section, aside, .trade-summary, .trade-side, .trade-values, .container, .content') ||
      totalRow?.parentElement ||
      document.body
    );
  }

  function getTradeSideContainer(totalRow) {
   if (!totalRow) return null;

  // Prefer known panel classes first
   const direct =
     totalRow.closest('.trade-side, .trade-panel, .trade-offer, .trade-request, .trade-container');
   if (direct) return direct;

  // Fallback: climb upward until this container contains ONLY this side's Total Value row
   let el = totalRow.parentElement;
   while (el && el !== document.body) {
     const totalRowsHere = [...el.querySelectorAll('div.robux-line')].filter(isTotalValueRow);
     if (totalRowsHere.length === 1) return el;
     el = el.parentElement;
   }

   return null;
  }

  // Robust: directly read "Robux Offered (After 30% fee)" row value (works on /trades tabs)
  function findAfterFeeFromRobuxRow(scope, getRect, curTop) {
    if (!scope) return 0;

    const rows = scope.querySelectorAll('div.robux-line');
    let best = 0;
    let bestDy = Infinity;

    for (const row of rows) {
      const t = (row.textContent || '').toLowerCase();
      if (!t.includes('robux')) continue;
      if (!(t.includes('after 30%') || t.includes('30% fee') || t.includes('30 %'))) continue;

      const r = getRect(row);
      const midY = r ? (r.top + r.height / 2) : curTop;
      const dy = Math.abs(midY - curTop);

      // Prefer the closest matching row to the current Total Value row
      if (dy > bestDy) continue;

      const valEl =
        row.querySelector('.robux-line-value') ||
        row.querySelector('.robux-line-amount .robux-line-value') ||
        row.querySelector('span.robux-line-value');

      const amt = extractLastNumber(valEl ? valEl.textContent : row.textContent);
      if (amt > 0) {
        best = amt;
        bestDy = dy;
      }
    }

    return best || 0;
  }


  // Shared: find after-fee amount by finding a "30%" label and locating nearest number to its right.
  function findAfterFeeAmountByLabelRight(root, getRect, totalRow, curX, yMin, curTop) {
    // IMPORTANT: root may be a panel container (side). Do not rescope away from it.
    const scope = root || findLikelySidebarContainer(totalRow) || document.body;

    const nodes = scope.querySelectorAll('div, span');
    const capped = Math.min(nodes.length, AFTERFEE_MAX_SCAN_NODES);

    let bestLabelRect = null;

    // Look in a window around the Total Value row (prevents crossing to other panel)
    const yBandMin = curTop - 650;
    const yBandMax = curTop + 650;

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



  // Counter-like: if label->right fails, compute from robux entry control
  function getCounterAfterFeeRobux(root, getRect, totalRow, curX, yMin, curTop) {
    const fromUI = findAfterFeeAmountByLabelRight(root, getRect, totalRow, curX, yMin, curTop);
    if (fromUI > 0) return fromUI;

    let bestVal = 0;
    let bestScore = Infinity;

    const candidates = root.querySelectorAll('input, textarea, [contenteditable="true"], [role="textbox"]');
    for (const el of candidates) {
      const r = getRect(el);
      if (!r) continue;

      if (r.bottom < yMin) continue;
      if (r.top > curTop + 900) continue;

      let raw = '';
      if ('value' in el) raw = (el.value || '').toString();
      if (!raw) raw = (el.textContent || '').toString();
      if (!raw) raw = (el.getAttribute('aria-valuetext') || '').toString();

      raw = raw.replace(/,/g, '').trim();
      if (!raw) continue;

      const n = extractLastNumber(raw);
      if (!Number.isFinite(n) || n <= 0) continue;

      const aria = (
        el.getAttribute('aria-label') ||
        el.getAttribute('placeholder') ||
        el.getAttribute('name') ||
        ''
      ).toLowerCase();

      const parentText = (el.parentElement?.textContent || '').toLowerCase();
      const looksRobux =
        aria.includes('robux') || aria.includes('r$') ||
        parentText.includes('robux') || parentText.includes('r$');

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
function computeTotalsForTotalRows(root, getRect, catalogLinks, rerender) {
  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  const rightMinX = vw * RIGHT_COLUMN_MIN_X_RATIO;

  const allRows = findTotalValueRows(root)
    .map(row => ({ row, rect: getRect(row) }))
    .filter(x => x.rect);

  const rows = allRows.filter(x => rectCenterX(x.rect) >= rightMinX);
  rows.sort((a, b) => (a.rect.top - b.rect.top) || (a.rect.left - b.rect.left));

  const results = [];
  const isCounter = isCounterLikePage();

  for (let i = 0; i < rows.length; i++) {
    const cur = rows[i];
    const curX = rectCenterX(cur.rect);
    const curTop = cur.rect.top;

    let yMin = curTop - MAX_Y_DISTANCE_PX;
    if (i > 0) {
      const prev = rows[i - 1];
      if (Math.abs(rectCenterX(prev.rect) - curX) <= X_THRESHOLD_PX) {
        yMin = Math.max(yMin, prev.rect.bottom + 8);
      }
    }

    const pickedIds = new Set();
    for (const L of catalogLinks) {
      if (L.bottom > curTop + 8) continue;
      if (L.top < yMin) continue;
      if (Math.abs(L.cx - curX) > X_THRESHOLD_PX) continue;
      pickedIds.add(L.id);
    }

    let rapTotal = 0;
    let valueTotal = 0;

    pickedIds.forEach(id => {
      const d = getItemData(id, rerender);
      rapTotal += d.rap || 0;
      valueTotal += d.value || 0;
    });

    // ---- Robux (panel-scoped so "Your Request" can't leak into "Your Offer") ----
      // ---- Robux (panel-scoped so "Your Request" can't leak into "Your Offer") ----
      // ---- Robux (panel-scoped so "Your Request" can't leak into "Your Offer") ----
      let robuxAfterFee = 0;

      const side = getTradeSideContainer(cur.row);
      const scope = side || findLikelySidebarContainer(cur.row) || cur.row.parentElement || root;

      if (isCounter) {
        robuxAfterFee = getCounterAfterFeeRobux(
          scope,
          getRect,
          cur.row,
          curX,
          -Infinity,
          curTop
        );
      } else {
        // First: direct robux-row parse (works on /trades tabs)
        robuxAfterFee = findAfterFeeFromRobuxRow(scope, getRect, curTop);

        // Fallback: old geometry method
        if (!robuxAfterFee) {
          robuxAfterFee = findAfterFeeAmountByLabelRight(
            scope,
            getRect,
            cur.row,
            curX,
            -Infinity,
            curTop
          );
        }
      }


    if (robuxAfterFee > 0) {
      rapTotal += robuxAfterFee;
      valueTotal += robuxAfterFee;
    }

    const totals = { rapTotal, valueTotal, count: pickedIds.size, robuxAfterFee };
    results.push({ row: cur.row, totals });
  }

  const withItemsOrRobux = results.filter(r => (r.totals.count > 0) || (r.totals.robuxAfterFee > 0));
  if (withItemsOrRobux.length <= 2) return withItemsOrRobux;

  const top2 = [...withItemsOrRobux].sort((a, b) => {
    const scoreA = (a.totals.count * 1000000) + (a.totals.robuxAfterFee || 0);
    const scoreB = (b.totals.count * 1000000) + (b.totals.robuxAfterFee || 0);
    return scoreB - scoreA;
  }).slice(0, 2);

  top2.sort((a, b) => (getRect(a.row)?.top ?? 0) - (getRect(b.row)?.top ?? 0));
  return top2;
 }


  /* ------------------ INLINE ITEM VALUE (≋) + LINK ICON ------------------ */
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
    root.querySelectorAll('.rolimons-total-robuxline').forEach(n => n.remove());

    const rowsWithTotals = computeTotalsForTotalRows(root, getRect, catalogLinks, rerender);

    const sidesArr = rowsWithTotals.slice(0, 2).map((obj) => {
      const { row, totals } = obj;

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
      val.textContent = fmt(totals.valueTotal);

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
    wrap.style.cssText = `display:flex;flex-direction:column;align-items:center;gap:6px;margin:6px 0 8px 0;`;
    wrap.innerHTML = `
      ${boxLineHTML(rapDiff, giveTotals.rapTotal, 'RAP', true)}
      ${boxLineHTML(valDiff, giveTotals.valueTotal, 'Value', true)}
    `;
    return wrap;
  }

  function buildDeltaWrapNormal(giveTotals, getTotals) {
    const rapDiff = (getTotals.rapTotal || 0) - (giveTotals.rapTotal || 0);
    const valDiff = (getTotals.valueTotal || 0) - (giveTotals.valueTotal || 0);

    const wrap = document.createElement('div');
    wrap.className = 'rolimons-delta-wrap';
    wrap.style.cssText = `display:flex;justify-content:center;gap:14px;margin:12px 0 10px 0;`;
    wrap.innerHTML = `
      ${boxLineHTML(rapDiff, giveTotals.rapTotal, 'RAP', false)}
      ${boxLineHTML(valDiff, giveTotals.valueTotal, 'Value', false)}
    `;
    return wrap;
  }

  function injectDeltaNormalTrade(root, sides) {
    root.querySelector('.rolimons-delta-wrap')?.remove();
    if (!sides?.give || !sides?.receive) return;
    if (!sides.give.totals.count && !sides.give.totals.robuxAfterFee) return;
    if (!sides.receive.totals.count && !sides.receive.totals.robuxAfterFee) return;

    const wrap = buildDeltaWrapNormal(sides.give.totals, sides.receive.totals);
    sides.give.injectedRow.insertAdjacentElement('afterend', wrap);
  }

  function injectDeltaCounterBelowValue(root, sides) {
    root.querySelector('.rolimons-delta-wrap')?.remove();
    if (!sides?.give || !sides?.receive) return;
    if (!sides.give.totals.count && !sides.give.totals.robuxAfterFee) return;
    if (!sides.receive.totals.count && !sides.receive.totals.robuxAfterFee) return;

    const wrap = buildDeltaWrapCounterStacked(sides.give.totals, sides.receive.totals);
    sides.give.injectedRow.insertAdjacentElement('afterend', wrap);
  }

  /* ------------------ COUNTER-LIKE: LIVE UPDATE ON INPUT (incremental binding) ------------------ */
  function bindGlobalCounterLikeInput(root, scheduleFn) {
   if (!isCounterLikePage()) return;
   if (root.dataset.roloGlobalBound === '1') return;
   root.dataset.roloGlobalBound = '1';

   const handler = (e) => {
     const t = e.target;
     if (!t) return;

     // Only react to likely relevant editable elements
     const tag = (t.tagName || '').toUpperCase();
     const isEditable =
       tag === 'INPUT' ||
       tag === 'TEXTAREA' ||
       t.getAttribute?.('contenteditable') === 'true' ||
       t.getAttribute?.('role') === 'textbox';

     if (!isEditable) return;

     scheduleFn(root);
   };

   // Capture phase catches it even if Roblox stops propagation
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

    const looksNumeric =
      type === 'number' ||
      /\d/.test(val) ||
      /\d/.test(placeholder) ||
      /\d/.test(aria) ||
      /\d/.test(text);

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

    // bind node itself if candidate
    if (
      node.tagName === 'INPUT' ||
      node.tagName === 'TEXTAREA' ||
      node.getAttribute('contenteditable') === 'true' ||
      node.getAttribute('role') === 'textbox'
    ) {
      bindCounterField(node, scheduleFn, root);
    }

    // bind candidates in subtree
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
      return !!p?.closest?.('.rolimons-total-robuxline, .rolimons-inline, .rolimons-delta-wrap, .rolimons-delta-box');
    }

    return !!(
      n.classList?.contains('rolimons-total-robuxline') ||
      n.classList?.contains('rolimons-inline') ||
      n.classList?.contains('rolimons-delta-wrap') ||
      n.classList?.contains('rolimons-delta-box') ||
      n.closest?.('.rolimons-total-robuxline, .rolimons-inline, .rolimons-delta-wrap, .rolimons-delta-box')
    );
  }

  function addProjectedBadge(itemCardEl, itemId) {
    if (!itemCardEl || !itemId) return;
    if (!isProjectedItem(itemId)) return;

    const thumb =
      itemCardEl.querySelector('.item-card-thumb-container') ||
      itemCardEl.querySelector('thumbnail-2d') ||
      itemCardEl;

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

    const thumb =
      itemCardEl.querySelector('.item-card-thumb-container') ||
      itemCardEl.querySelector('thumbnail-2d') ||
      itemCardEl;

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

  /* ------------------ SCHEDULER (debounce-only) ------------------ */
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

    const catalogLinks = buildCatalogLinkGeom(root, getRect);

    root.querySelectorAll('.item-card-container, .list-item').forEach(item => {
      const id = getCatalogIdFromItemCard(item);
      if (!id) return;

      addProjectedBadge(item, id);
      addRareBadge(item, id);

      const target =
        item.querySelector('.item-card-caption, .item-card-name') ||
        item;

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

      // On some layouts the robux control isn't an <input>, so include broader candidates
      const hasUI = root.querySelector('.item-card-container, .list-item, div.robux-line, a[href*="/catalog/"], input, textarea, [contenteditable="true"], [role="textbox"]');
      if (!hasUI) return;

      clearInterval(interval);

      // Initial bind (counter-like only)
      initialBindAllCounterInputs(root, schedule);
      bindGlobalCounterLikeInput(root, schedule);

      // First render
      schedule(root);

      if (observer) observer.disconnect();

      observer = new MutationObserver((mutations) => {
        // Bind any newly-added inputs for counter-like pages (incremental)
        if (isCounterLikePage()) {
          for (const m of mutations) {
            for (const n of m.addedNodes) bindCounterInputsInSubtree(n, schedule, root);
          }
        }

        const onlyOurStuff = mutations.every(m => {
          const nodes = [...m.addedNodes, ...m.removedNodes].filter(n => n.nodeType === 1 || n.nodeType === 3);
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