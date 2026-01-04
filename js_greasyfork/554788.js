// ==UserScript==
// @name        Fix NESN
// @namespace   Violentmonkey Scripts
// @match       https://watch.nesn.com/*
// @grant       none
// @version     1.0
// @license     MIT
// @author      kayleighember
// @description remove annoying socials on NESN
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/554788/Fix%20NESN.user.js
// @updateURL https://update.greasyfork.org/scripts/554788/Fix%20NESN.meta.js
// ==/UserScript==

(function() {
  // Wait for the DOM to be ready
  function deleteFooter() {
    // Find any footer element
    const footers = document.querySelectorAll("footer");

    for (const footer of footers) {
      // Walk up until we hit the top-level container that holds it
      let container = footer.closest("div");
      if (container) {
        container.remove();
        console.log("Removed footer container:", container);
      } else {
        footer.remove();
        console.log("Removed footer only:", footer);
      }
    }
  }

  // Run immediately
  deleteFooter();

  // Also run if site dynamically loads it later
  const obs = new MutationObserver(deleteFooter);
  obs.observe(document.body, { childList: true, subtree: true });
})();