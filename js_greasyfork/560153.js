// ==UserScript==
// @license MIT 
// @name         Gmail: Remove Upgrade Button
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Removes the upgrade button with data-pep-id="global-pep-gmail" from Gmail
// @match        https://mail.google.com/*
// @run-at       document-start
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/560153/Gmail%3A%20Remove%20Upgrade%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/560153/Gmail%3A%20Remove%20Upgrade%20Button.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const TARGET_SELECTOR = '[data-pep-id="global-pep-gmail"]';

  function removeUpgradeButton() {
    const element = document.querySelector(TARGET_SELECTOR);
    if (element) {
      element.remove();
      console.log("Gmail upgrade button removed");
    }
  }

  // Attempt removal multiple times during initial page load
  let attempts = 0;
  const burstInterval = setInterval(() => {
    removeUpgradeButton();
    attempts++;
    if (attempts >= 80) {
      clearInterval(burstInterval);
    }
  }, 100);

  // Watch for Gmail dynamically inserting the button later
  const observer = new MutationObserver(() => {
    removeUpgradeButton();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  // Handle Gmail's SPA navigation (view changes without full page reload)
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function () {
    const result = originalPushState.apply(this, arguments);
    setTimeout(removeUpgradeButton, 0);
    return result;
  };

  history.replaceState = function () {
    const result = originalReplaceState.apply(this, arguments);
    setTimeout(removeUpgradeButton, 0);
    return result;
  };
})();