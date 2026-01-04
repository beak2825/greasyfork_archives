// ==UserScript==
// @name         Kill Google Ads Interstitial (INS Overlay)
// @namespace    https://huseyinavniuzun.com/userscripts
// @version      1.0
// @author       Hüseyin Avni Uzun
// @description  Removes broken full-screen Google Ads vignette/interstitial overlays injected via <ins id="gpt_unit_..."> elements, restoring page interaction.
// @license      MIT
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560987/Kill%20Google%20Ads%20Interstitial%20%28INS%20Overlay%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560987/Kill%20Google%20Ads%20Interstitial%20%28INS%20Overlay%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const INS_ID_PREFIX = 'gpt_unit_';

  function removeInterstitials(root) {
    const scope = root && root.querySelectorAll ? root : document;
    const targets = scope.querySelectorAll(`ins[id^="${INS_ID_PREFIX}"]`);

    for (const el of targets) {
      // Ensure it cannot capture clicks even for a moment
      el.style.setProperty('pointer-events', 'none', 'important');
      el.style.setProperty('display', 'none', 'important');
      el.remove();
    }
  }

  // Initial cleanup
  document.addEventListener('DOMContentLoaded', () => {
    removeInterstitials(document);
  });

  // Watch for async or late injections (common with vignette ads)
  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (!node || node.nodeType !== 1) continue;

        if (
          node.tagName === 'INS' &&
          node.id &&
          node.id.startsWith(INS_ID_PREFIX)
        ) {
          node.remove();
        } else {
          removeInterstitials(node);
        }
      }
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  // Extra early pass for very fast injections
  removeInterstitials(document);
})();
