// ==UserScript==
// @name         JanitorAI - Hide AI Disclaimer
// @namespace    https://lachlanm05.com/
// @version      1.0.0
// @description  hide the disclaimer on jai
// @match        https://janitorai.com/*
// @match        https://www.janitorai.com/*
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561241/JanitorAI%20-%20Hide%20AI%20Disclaimer.user.js
// @updateURL https://update.greasyfork.org/scripts/561241/JanitorAI%20-%20Hide%20AI%20Disclaimer.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const TARGET_CLASS = '_disclaimer_c1nvb_1';

  function hideMatching(root = document) {
    if (!root || root.nodeType !== 1 && root !== document) return;

    // fast path, exact token match
    const exact = (root === document)
      ? document.getElementsByClassName(TARGET_CLASS)
      : root.getElementsByClassName?.(TARGET_CLASS);

    if (exact && exact.length) {
      // HTMLCollection is live, copy first
      [...exact].forEach(el => {
        el.style.setProperty('display', 'none', 'important');
        el.setAttribute('data-tm-hidden', '1');
      });
    }

    // fallback: class attribute contains substring (covers weird tokenization)
    const nodes = (root === document)
      ? document.querySelectorAll(`[class*="${TARGET_CLASS}"]`)
      : root.querySelectorAll?.(`[class*="${TARGET_CLASS}"]`);

    if (nodes && nodes.length) {
      nodes.forEach(el => {
        el.style.setProperty('display', 'none', 'important');
        el.setAttribute('data-tm-hidden', '1');
      });
    }
  }

  // run asap, and again when dom loads.
  hideMatching(document);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => hideMatching(document), { once: true });
  }

  // watch for dynamic content
  const obs = new MutationObserver(muts => {
    for (const m of muts) {
      for (const n of m.addedNodes) {
        // only element nodes
        if (n && n.nodeType === 1) hideMatching(n);
      }
    }
  });

  // start observing asap
  const startObserver = () => {
    const target = document.documentElement || document.body;
    if (!target) return;
    obs.observe(target, { childList: true, subtree: true });
  };

  startObserver();
})();