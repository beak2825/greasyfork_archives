// ==UserScript==
// @name         Steam Reviews: Show Percent Instead of Label
// @namespace    Betterthanever
// @version      0.1
// @description  Replace "Very/Mostly Positive" style labels with the actual % from Steam's tooltip on store pages
// @match        https://store.steampowered.com/*
// @run-at       document-idle
// @grant        none
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/550138/Steam%20Reviews%3A%20Show%20Percent%20Instead%20of%20Label.user.js
// @updateURL https://update.greasyfork.org/scripts/550138/Steam%20Reviews%3A%20Show%20Percent%20Instead%20of%20Label.meta.js
// ==/UserScript==

(function () {
  'use strict';


  const PERCENT_RE = /(\d{1,3})\s*%/;


  const LABEL_SELECTORS = [
    '.user_reviews_summary_row .game_review_summary',
    '.game_review_summary',
    '.store_review_summary',
    '.store_review_summary a',
    '.store_overview .user_reviews .summary'
  ];

  const TOOLTIP_ATTRS = ['data-tooltip-text', 'data-tooltip-html', 'title', 'aria-label'];

  function extractPercentFromEl(el) {
    for (const attr of TOOLTIP_ATTRS) {
      const v = el.getAttribute && el.getAttribute(attr);
      if (v && typeof v === 'string') {
        const m = v.match(PERCENT_RE);
        if (m) return m[1];
      }
    }

    let p = el.parentElement;
    for (let i = 0; i < 3 && p; i++, p = p.parentElement) {
      for (const attr of TOOLTIP_ATTRS) {
        const v = p.getAttribute && p.getAttribute(attr);
        if (v && typeof v === 'string') {
          const m = v.match(PERCENT_RE);
          if (m) return m[1];
        }
      }
    }
    return null;
  }

  function isAlreadyProcessed(el) {
    return el.dataset && el.dataset.tmReviewPct === '1';
  }

  function markProcessed(el) {
    if (el.dataset) el.dataset.tmReviewPct = '1';
  }

  function replaceLabel(el) {
    if (!el || isAlreadyProcessed(el)) return;

    const pct = extractPercentFromEl(el);

    if (!pct) return;


    const original = el.textContent.trim();
    if (!el.getAttribute('title')) {
      el.setAttribute('title', original);
    }

    el.textContent = `${pct}%`;

    el.style.whiteSpace = 'nowrap';

    markProcessed(el);
  }

  function processAll(root = document) {
    LABEL_SELECTORS.forEach(sel => {
      root.querySelectorAll(sel).forEach(replaceLabel);
    });
  }

  processAll();

  const observer = new MutationObserver(mutations => {
    for (const m of mutations) {

      m.addedNodes.forEach(node => {
        if (!(node instanceof HTMLElement)) return;
        if (LABEL_SELECTORS.some(sel => node.matches?.(sel))) {
          replaceLabel(node);
        }
        processAll(node);
      });
    }
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });

  const _pushState = history.pushState;
  history.pushState = function() {
    const ret = _pushState.apply(this, arguments);
    setTimeout(processAll, 100);
    return ret;
  };
  window.addEventListener('popstate', () => setTimeout(processAll, 100));
})();
