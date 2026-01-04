// ==UserScript==
// @name         stupid bitch ass snow
// @namespace    https://cartii.fit/
// @version      2.0.0
// @description  THIS SNOW SUCKS
// @match        *://cartii.fit/*
// @match        *://*.cartii.fit/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561076/stupid%20bitch%20ass%20snow.user.js
// @updateURL https://update.greasyfork.org/scripts/561076/stupid%20bitch%20ass%20snow.meta.js
// ==/UserScript==

(() => {
  "use strict";

  const BLOCK_ID = "SnowfallCanvas";
  const BLOCK_TESTID = "SnowfallCanvas";

  // CSS: hide it even if it exists only briefly
  const style = document.createElement("style");
  style.textContent = `
    #${BLOCK_ID},
    [data-testid="${BLOCK_TESTID}"],
    canvas#${BLOCK_ID},
    canvas[data-testid="${BLOCK_TESTID}"] {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }
  `;
  (document.documentElement || document).appendChild(style);

  function removeTargets(root = document) {
    try {
      root.querySelectorAll?.(
        `#${BLOCK_ID}, [data-testid="${BLOCK_TESTID}"], canvas#${BLOCK_ID}, canvas[data-testid="${BLOCK_TESTID}"]`
      ).forEach(el => el.remove());
    } catch (_) {}
  }

  // Run early
  removeTargets();

  // Watch for reinsertion
  const mo = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (!node || node.nodeType !== 1) continue; // element nodes only
        // remove within the added subtree
        removeTargets(node);
        // if the node itself is a match, removeTargets(node) might not catch it (depending on root)
        if (node.id === BLOCK_ID || node.getAttribute?.("data-testid") === BLOCK_TESTID) {
          node.remove();
        }
      }
    }
  });

  // Start observing once documentElement exists
  const startObserve = () => {
    if (document.documentElement) {
      mo.observe(document.documentElement, { childList: true, subtree: true });
      return true;
    }
    return false;
  };

  if (!startObserve()) {
    const t = setInterval(() => {
      if (startObserve()) clearInterval(t);
    }, 10);
  }

  // Backstop for weird render loops
  setInterval(removeTargets, 300);
})();
