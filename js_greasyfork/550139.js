// ==UserScript==
// @name         Steam Reviews: Percent Hovercards
// @namespace    Betterthanever
// @version      031
// @description  Replace review labels with raw % on store pages, hovers, search tiles, and the slider/detail pane
// @match        https://store.steampowered.com/*
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @connect      store.steampowered.com
// @license  GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/550139/Steam%20Reviews%3A%20Percent%20Hovercards.user.js
// @updateURL https://update.greasyfork.org/scripts/550139/Steam%20Reviews%3A%20Percent%20Hovercards.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const LABEL_WORD_RE = /\b(?:Overwhelmingly\s+|Very\s+|Mostly\s+)?(?:Positive|Negative)\b|\bMixed\b/gi;
  const PERCENT_RE = /(\d{1,3})\s*%/;

  const CANDIDATE_CONTAINERS = [
    '.user_reviews_summary_row',
    '.store_review_summary',
    '.store_overview .user_reviews',
    '.search_result_review',
    '#game_hover',
    '.hover_details_block',
    '.details_block',
    '.salepreviewwidgets_StoreSaleWidgetContainer',
    '.home_pagecontent',
    '.contenthub_page',
    '.store_capsule',
    '.cluster_capsule',
    'body'
  ];

  const pctCache = new Map();

  function $(sel, root = document) { return root.querySelector(sel); }
  function $all(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }
  const txt = el => (el?.textContent || '').trim();

  function getAppIdFromContext(node) {
    let n = node;
    for (let i = 0; i < 10 && n; i++, n = n.parentElement) {
      for (const attr of ['data-ds-appid', 'data-appid', 'data-ds-itemkey', 'data-store-tooltip']) {
        const v = n.getAttribute?.(attr);
        if (v) {
          const m = String(v).match(/\b(\d{3,9})\b/);
          if (m) return m[1];
        }
      }
      const a = n.querySelector?.('a[href*="/app/"]');
      if (a && a.href) {
        const m = a.href.match(/\/app\/(\d{3,9})\b/);
        if (m) return m[1];
      }
    }
    const hoverLink = $('#game_hover a[href*="/app/"]');
    if (hoverLink) {
      const m = hoverLink.href.match(/\/app\/(\d{3,9})\b/);
      if (m) return m[1];
    }
    return null;
  }

  function fetchPercentForApp(appid) {
    if (!appid) return Promise.resolve(null);
    if (pctCache.has(appid)) return Promise.resolve(pctCache.get(appid));

    const url = `https://store.steampowered.com/appreviews/${appid}?json=1&purchase_type=all&language=all`;

    const parse = (j) => {
      try {
        const q = j.query_summary || j;
        const pos = Number(q.total_positive || 0);
        const neg = Number(q.total_negative || 0);
        const total = pos + neg;
        if (total > 0) {
          const pct = String(Math.round((pos / total) * 100));
          pctCache.set(appid, pct);
          return pct;
        }
      } catch {}
      return null;
    };

    return fetch(url, { credentials: 'include' })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(parse)
      .catch(() => new Promise(resolve => {
        if (typeof GM_xmlhttpRequest !== 'function') return resolve(null);
        GM_xmlhttpRequest({
          method: 'GET', url,
          onload: res => { try { resolve(parse(JSON.parse(res.responseText))); } catch { resolve(null); } },
          onerror: () => resolve(null), ontimeout: () => resolve(null)
        });
      }));
  }

  function markDone(el) { el.dataset.tmReviewPct = '1'; }
  function isDone(el) { return el?.dataset?.tmReviewPct === '1'; }

  function* walkTextNodes(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    let n;
    while ((n = walker.nextNode())) yield n;
  }

  function replaceLabelWordsInElement(el, pct) {
    let replaced = false;
    for (const tn of walkTextNodes(el)) {
      if (LABEL_WORD_RE.test(tn.nodeValue)) {
        tn.nodeValue = tn.nodeValue.replace(LABEL_WORD_RE, `${pct}%`);
        replaced = true;
      }
    }
    if (replaced && !el.getAttribute('title')) el.setAttribute('title', 'Review summary replaced by userscript');
    return replaced;
  }

  async function processNode(container) {
    if (!(container instanceof HTMLElement)) return;

    const candidates = new Set();

    CANDIDATE_CONTAINERS.forEach(sel => {
      $all(`${sel} a, ${sel} span, ${sel} div`, container).forEach(el => {
        const t = txt(el);
        if (LABEL_WORD_RE.test(t)) candidates.add(el);
      });
    });

    if (candidates.size === 0) {
      $all('a, span, div', container).forEach(el => {
        const t = txt(el);
        if (LABEL_WORD_RE.test(t)) candidates.add(el);
      });
    }

    $all('[data-tooltip-text],[data-tooltip-html],[title],[aria-label]', container).forEach(el => {
      const tip = el.getAttribute('data-tooltip-text') || el.getAttribute('data-tooltip-html') ||
                  el.getAttribute('title') || el.getAttribute('aria-label') || '';
      if (PERCENT_RE.test(tip)) candidates.add(el);
    });

    for (const el of candidates) {
      if (isDone(el)) continue;

      let pct = null;
      const tip = el.getAttribute('data-tooltip-text') || el.getAttribute('data-tooltip-html') ||
                  el.getAttribute('title') || el.getAttribute('aria-label') || '';
      const tipMatch = tip.match(PERCENT_RE);
      if (tipMatch) pct = tipMatch[1];

      if (!pct) {
        const inlineMatch = txt(el).match(PERCENT_RE);
        if (inlineMatch) pct = inlineMatch[1];
      }

      if (!pct) {
        const appid = getAppIdFromContext(el);
        pct = await fetchPercentForApp(appid);
      }

      if (!pct) continue;

      const changed = replaceLabelWordsInElement(el, pct);

      if (!changed) {
        if (!el.querySelector('.tm-review-pct')) {
          const span = document.createElement('span');
          span.className = 'tm-review-pct';
          span.textContent = ` ${pct}%`;
          span.style.whiteSpace = 'nowrap';
          span.style.fontWeight = '600';
          span.style.fontSize = getComputedStyle(el).fontSize || '12px';
          try { el.appendChild(span); } catch { el.parentElement?.appendChild(span); }
        }
      }

      markDone(el);
    }
  }

  function processAll(root = document) {
    CANDIDATE_CONTAINERS.forEach(sel => {
      $all(sel, root).forEach(processNode);
    });
  }


  processAll();

  const mo = new MutationObserver(mutations => {
    for (const m of mutations) {
      m.addedNodes.forEach(n => {
        if (n instanceof HTMLElement) processAll(n);
      });
      if (m.target instanceof HTMLElement && (m.type === 'childList' || m.type === 'subtree')) {
        processNode(m.target);
      }
    }
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });

  const _ps = history.pushState;
  history.pushState = function () {
    const r = _ps.apply(this, arguments);
    setTimeout(processAll, 120);
    return r;
  };
  window.addEventListener('popstate', () => setTimeout(processAll, 120));

  setInterval(() => {
    const vr = document.querySelector('.contenthub_page, .home_pagecontent, .salepreviewwidgets_StoreSaleWidgetContainer');
    if (vr) processAll(vr);
  }, 1000);
})();
