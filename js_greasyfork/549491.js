// ==UserScript==
// @name         Pixeldrain Unbind Arrow Keys
// @namespace    http://tampermonkey.net/
// @version      2025-09-14
// @description  Unbind arrow keys which are binded for switching next and previous item in album
// @author       DebNation
// @match        https://pixeldrain.com/*
// @match        https://pixeldrain.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixeldrain.com
// @grant        GM_openInTab
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549491/Pixeldrain%20Unbind%20Arrow%20Keys.user.js
// @updateURL https://update.greasyfork.org/scripts/549491/Pixeldrain%20Unbind%20Arrow%20Keys.meta.js
// ==/UserScript==

(function() {
  document.addEventListener("keydown", e => {
    if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
      e.stopImmediatePropagation();
    }
  }, true);
})();