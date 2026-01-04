// ==UserScript==
// @name         Advanced AdBlocker Panel
// @namespace    baba-scripts
// @version      6.15
// @description  Draggable panel, dual counters (page/total), pause, safe-header rules, regex filters (ad-*, -ad*, ad_*, *_ad), Ads/Adverts, and exact 'ad' match (non-regex). Panel only in top frame; blocking in all frames. Trusted Types-safe DOM ops.
// @author       Volkan SALiH
// @license      MIT
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/547964/Advanced%20AdBlocker%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/547964/Advanced%20AdBlocker%20Panel.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const IS_TOP = (window.top === window.self);

  // === Storage Keys ===
  const KEY_TOTAL   = "abp_total";
  const KEY_PAUSE   = "abp_paused";
  const KEY_OPEN    = "abp_panel_open";

  // Cross-frame shared state
  let totalAds  = Number(GM_getValue(KEY_TOTAL, 0)) || 0;
  let isPaused  = !!GM_getValue(KEY_PAUSE, false);
  let isOpen    = !!GM_getValue(KEY_OPEN, true);

  // Page-local counter
  let pageAds   = 0;

  // === Styles ===
  GM_addStyle(`
    #abp-panel {
      position: fixed; top: 12px; right: 12px; width: 240px;
      background:#1a1a1a; color:#fff; font-family:system-ui, Arial, sans-serif; font-size:13px;
      border-radius: 10px; box-shadow:0 6px 18px rgba(0,0,0,.45);
      z-index: 2147483647; user-select: none; overflow: hidden;
    }
    #abp-header {
      padding:10px; background:#2a2a2a; display:flex; align-items:center; gap:8px;
      font-weight:700; cursor: move;
    }
    #abp-header .shield { font-size: 16px }
    #abp-title { flex: 1; cursor: default }
    #abp-body {
      transition: max-height .35s ease, opacity .35s ease;
      max-height: 420px; opacity: 1; overflow: hidden; padding: 8px 10px;
    }
    #abp-body.collapsed { max-height: 0; opacity: 0; padding: 0 10px }
    .abp-row { padding: 6px 0; border-top: 1px solid #333; display:flex; justify-content:space-between; align-items:center }
    .abp-row:first-of-type { border-top: 0 }
    .abp-btn { cursor:pointer; color:#00b7ff }
    .abp-btn:hover { text-decoration: underline }
  `);

  // === Panel (only in top frame) ===
  let panel, header, body, lblPage, lblTotal, btnPause;
  let dragActive = false, dragMoved = false, dragDX = 0, dragDY = 0;

  if (IS_TOP) {
    panel = document.createElement('div');
    panel.id = 'abp-panel';

    header = document.createElement('div');
    header.id = 'abp-header';

    const icon = document.createElement('span');
    icon.className = 'shield';
    icon.textContent = '🛡️';

    const title = document.createElement('div');
    title.id = 'abp-title';
    title.textContent = 'AdBlock Panel';

    body = document.createElement('div');
    body.id = 'abp-body';

    const rowPage = document.createElement('div');
    rowPage.className = 'abp-row';
    const pageLeft = document.createElement('span'); pageLeft.textContent = 'Page Ads Blocked';
    lblPage = document.createElement('span'); lblPage.id = 'abp-page'; lblPage.textContent = '0';
    rowPage.appendChild(pageLeft); rowPage.appendChild(lblPage);

    const rowTotal = document.createElement('div');
    rowTotal.className = 'abp-row';
    const totalLeft = document.createElement('span'); totalLeft.textContent = 'Total Ads Blocked';
    lblTotal = document.createElement('span'); lblTotal.id = 'abp-total'; lblTotal.textContent = String(totalAds);
    rowTotal.appendChild(totalLeft); rowTotal.appendChild(lblTotal);

    const rowPause = document.createElement('div');
    rowPause.className = 'abp-row';
    const pauseLeft = document.createElement('span'); pauseLeft.textContent = 'Blocking';
    btnPause = document.createElement('span'); btnPause.id = 'abp-pause'; btnPause.className = 'abp-btn';
    btnPause.textContent = isPaused ? '▶ Resume' : '⏸ Pause';
    rowPause.appendChild(pauseLeft); rowPause.appendChild(btnPause);

    body.appendChild(rowPage);
    body.appendChild(rowTotal);
    body.appendChild(rowPause);

    header.appendChild(icon);
    header.appendChild(title);
    panel.appendChild(header);
    panel.appendChild(body);
    document.documentElement.appendChild(panel);

    // restore collapsed state
    if (!isOpen) body.classList.add('collapsed');

    // Drag (header holds drag; click toggles when not moved)
    header.addEventListener('mousedown', (e) => {
      dragActive = true; dragMoved = false;
      const rect = panel.getBoundingClientRect();
      dragDX = e.clientX - rect.left; dragDY = e.clientY - rect.top;
      e.preventDefault();
    });
    document.addEventListener('mousemove', (e) => {
      if (!dragActive) return;
      const left = e.clientX - dragDX, top = e.clientY - dragDY;
      if (Math.abs(left - panel.offsetLeft) > 3 || Math.abs(top - panel.offsetTop) > 3) dragMoved = true;
      panel.style.left = left + 'px';
      panel.style.top  = top + 'px';
      panel.style.right = 'auto';
    });
    document.addEventListener('mouseup', () => { dragActive = false; });

    // Toggle (only if no drag)
    header.addEventListener('click', () => {
      if (dragMoved) return;
      isOpen = !isOpen;
      GM_setValue(KEY_OPEN, isOpen);
      body.classList.toggle('collapsed', !isOpen);
    });

    // Pause
    btnPause.addEventListener('click', (e) => {
      e.stopPropagation();
      isPaused = !isPaused;
      GM_setValue(KEY_PAUSE, isPaused);
      btnPause.textContent = isPaused ? '▶ Resume' : '⏸ Pause';
    });
  }

  // === Helpers (usable in all frames) ===
  const SAFE_TAGS = new Set(['HEADER','NAV','FOOTER']);
  const SAFE_KEYWORDS = ['masthead','topbar','site-header','navbar','menu','breadcrumb','logo','search'];

  // Regex rules (class/id) — case-insensitive
  const RX_PATTERNS = [
      /advert/i,
      /reklam/i,
   // /^ad-.*/i,   // ad-*
   // /.*-ad$/i,   // -ad*
   // /^ad_.*/i,   // ad_*
   // /.*_ad$/i    // *_ad
  ];
  // Exact words via regex (but not 'ad'): Ads / Adverts (case-insensitive)
  const RX_WORDS = /^(ads|adverts)$/i;

  function isPanelOrInside(node) {
    if (!node || node.nodeType !== 1) return false;
    return !!(IS_TOP && panel && (node === panel || node.closest && node.closest('#abp-panel')));
  }

  function isSafeRegion(el) {
    if (!el || el.nodeType !== 1) return false;
    if (SAFE_TAGS.has(el.tagName)) return true;
    const idc = ((el.id || '') + ' ' + (el.className || '')).toLowerCase();
    return SAFE_KEYWORDS.some(k => idc.includes(k));
  }

  function classOrIdMatches(el) {
    // skip if no id/class
    const id = el.id || '';
    const classes = el.classList ? Array.from(el.classList) : [];

    // 1) exact 'ad' (lowercase only), non-regex
    if (id === 'ad') return true;
    if (classes.includes('ad')) return true;

    // 2) Ads / Adverts (case-insensitive, exact) with regex
    if (RX_WORDS.test(id)) return true;
    if (classes.some(c => RX_WORDS.test(c))) return true;

    // 3) pattern regexes
    if (RX_PATTERNS.some(rx => rx.test(id))) return true;
    if (classes.some(c => RX_PATTERNS.some(rx => rx.test(c)))) return true;

    return false;
  }

  const CANDIDATE_SELECTOR = '[id], [class]';

  function scanAndBlock(root) {
    // pull latest pause in frames so top-frame toggle propagates
    isPaused = !!GM_getValue(KEY_PAUSE, false);
    if (isPaused) return;

    const candidates = [];
    if (root.nodeType === 1 && (root.id || root.className)) candidates.push(root);
    if (root.querySelectorAll) candidates.push(...root.querySelectorAll(CANDIDATE_SELECTOR));

    let removedThisRun = 0;

    for (const el of candidates) {
      if (!el || el.nodeType !== 1) continue;
      if (isPanelOrInside(el)) continue;           // never touch the panel
      if (isSafeRegion(el)) continue;              // do not remove safe structural regions
      if (!classOrIdMatches(el)) continue;

      el.remove();
      pageAds++; totalAds++; removedThisRun++;
    }

    if (removedThisRun > 0) {
      GM_setValue(KEY_TOTAL, totalAds);
      // update counters if panel exists
      if (IS_TOP) {
        const pageEl  = document.getElementById('abp-page');
        const totalEl = document.getElementById('abp-total');
        if (pageEl)  pageEl.textContent  = String(pageAds);
        if (totalEl) totalEl.textContent = String(totalAds);
      }
    }
  }

  // Initial sweep + Observer + periodic backup
  const runInitial = () => scanAndBlock(document.documentElement || document.body || document);

  // MutationObserver in all frames
  const mo = new MutationObserver(muts => {
    for (const m of muts) {
      for (const node of m.addedNodes) {
        if (node && node.nodeType === 1) scanAndBlock(node);
      }
    }
  });

  if (document.body) {
    runInitial();
    mo.observe(document.body, { childList: true, subtree: true });
  } else {
    // in very early stages, wait for body
    const ready = new MutationObserver(() => {
      if (document.body) {
        ready.disconnect();
        runInitial();
        mo.observe(document.body, { childList: true, subtree: true });
      }
    });
    ready.observe(document.documentElement, { childList: true, subtree: true });
  }

  // backup sweep (covers SPAs / missed nodes)
  setInterval(() => scanAndBlock(document.body || document), 3000);
})();
