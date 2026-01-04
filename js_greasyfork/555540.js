// ==UserScript==
// @name         TORN Quick Items → Hardcoded E (works with #quickItems)
// @namespace    tvdw.torn.quickitems.energy.static
// @version      0.4
// @description  Replace Can-of labels in Quick Items with fixed Energy values.
// @match        https://www.torn.com/item.php*
// @match        https://www.torn.com/*item.php*
// @run-at       document-idle
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/555540/TORN%20Quick%20Items%20%E2%86%92%20Hardcoded%20E%20%28works%20with%20quickItems%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555540/TORN%20Quick%20Items%20%E2%86%92%20Hardcoded%20E%20%28works%20with%20quickItems%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Edit if your E values differ
  const E = Object.freeze({
    'can of crocozade': 23,
    'can of damp valley': 15,
    'can of goose juice': 8,
    'can of munster': 30,
    'can of red cow': 38,
    'can of santa shooters': 30,
    'can of rockstar rudolph': 30,
  });

  const norm = s => s.replace(/\s+/g, ' ').trim().toLowerCase();

  function rewriteQuickItems() {
    const items = document.querySelectorAll('#quickItems .inner-content .item');
    if (!items.length) return;

    items.forEach(item => {
      const labelEl = item.querySelector('.text');
      if (!labelEl) return;

      const name = norm(labelEl.textContent || '');
      const e = E[name];
      if (e != null) {
        labelEl.textContent = `${e}E`;
        item.setAttribute('title', `${e}E`);
      }
    });
  }

  // Run once visible, then keep in sync with SPA changes
  function init() {
    rewriteQuickItems();

    const qi = document.querySelector('#quickItems');
    const root = qi || document.body;
    const mo = new MutationObserver(rewriteQuickItems);
    mo.observe(root, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
