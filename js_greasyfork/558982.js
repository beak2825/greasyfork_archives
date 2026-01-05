// ==UserScript==
// @name         weav3r → Torn Bazaar deep link (multi-item safe)
// @namespace    muppet.weav3r.bazaar
// @version      1.1.0
// @description  Append itemId + highlight to Torn bazaar links on weav3r.dev (supports multi-item pages)
// @author       Muppet
// @match        https://weav3r.dev/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558982/weav3r%20%E2%86%92%20Torn%20Bazaar%20deep%20link%20%28multi-item%20safe%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558982/weav3r%20%E2%86%92%20Torn%20Bazaar%20deep%20link%20%28multi-item%20safe%29.meta.js
// ==/UserScript==

(() => {
  'use strict';

  function rewriteCard(cardEl, itemId) {
    if (!itemId) return;

    cardEl
      .querySelectorAll('a[href^="https://www.torn.com/bazaar.php"]')
      .forEach(a => {
        try {
          const url = new URL(a.href);

          if (!url.searchParams.has('userId')) return;

          url.searchParams.set('itemId', itemId);
          url.searchParams.set('highlight', '1');

          if (!url.hash) url.hash = '#/';

          a.href = url.toString();
        } catch {}
      });
  }

  function processPage() {
    // Case 1: single item page (/item/206)
    const singleMatch = location.pathname.match(/\/item\/(\d+)/);
    if (singleMatch) {
      const itemId = singleMatch[1];
      rewriteCard(document, itemId);
      return;
    }

    // Case 2: multi-item page (favorites, grids, etc.)
    document.querySelectorAll('a[href^="/item/"]').forEach(itemLink => {
      const match = itemLink.getAttribute('href').match(/\/item\/(\d+)/);
      if (!match) return;

      const itemId = match[1];

      // Find the nearest card/container
      const card =
        itemLink.closest('.border.rounded-lg') || // favorites cards
        itemLink.closest('[class*="card"]') ||
        itemLink.closest('div');

      if (card) {
        rewriteCard(card, itemId);
      }
    });
  }

  // Run once
  processPage();

  // Re-run if the page updates dynamically
  const obs = new MutationObserver(processPage);
  obs.observe(document.body, { childList: true, subtree: true });
})();
