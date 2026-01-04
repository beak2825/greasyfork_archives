// ==UserScript==
// @name         Microsoft Login - Bypass 'Stay Signed In'
// @namespace    https://codeberg.org/cache_miss/
// @version      1.2
// @description  Bypasses the annoying 'Stay Signed In' page after logging into a Microsoft account by automatically clicking the 'Yes' button
// @author       Logan Kirkland <logan@logankirk.land>
// @license      MIT
// @match        https://login.microsoftonline.com/common/login
// @match        https://login.microsoftonline.com/common/SAS/ProcessAuth
// @match        https://login.microsoftonline.com/*/login
// @grant        none
// @homepageURL  https://codeberg.org/cache_miss/ms-stay-signed-in-userscript
// @homepage     https://codeberg.org/cache_miss/ms-stay-signed-in-userscript
// @supportURL   https://codeberg.org/cache_miss/ms-stay-signed-in-userscript/issues
// @downloadURL https://update.greasyfork.org/scripts/553409/Microsoft%20Login%20-%20Bypass%20%27Stay%20Signed%20In%27.user.js
// @updateURL https://update.greasyfork.org/scripts/553409/Microsoft%20Login%20-%20Bypass%20%27Stay%20Signed%20In%27.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const BTN_ID = "idSIButton9";
  const MAX_ATTEMPTS = 20;
  const RETRY_INTERVAL = 250; // milliseconds
  let attempts = 0;

  function tryClickButton() {
    const btn = document.querySelector("#" + BTN_ID);

    if (btn) {
      // Check if button is actually visible and enabled
      if (btn.offsetParent !== null && !btn.disabled) {
        btn.click();
        return true;
      }
    }

    attempts++;
    if (attempts < MAX_ATTEMPTS) {
      setTimeout(tryClickButton, RETRY_INTERVAL);
    }
    return false;
  }

  // Start attempting when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", tryClickButton);
  } else {
    tryClickButton();
  }
})();
