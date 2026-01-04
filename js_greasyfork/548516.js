// ==UserScript==
// @name         YouTube Comments Fix (Edge scrollParent bug)
// @namespace    https://greasyfork.org/users/846945
// @version      1.1
// @description  Fixes YouTube comments not loading in Microsoft Edge by making HTMLElement.scrollParent writable before YouTube's scripts run.
// @author       lucassilvas1
// @license      MIT
// @match        https://www.youtube.com/watch*
// @match        https://www.youtube.com/shorts*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548516/YouTube%20Comments%20Fix%20%28Edge%20scrollParent%20bug%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548516/YouTube%20Comments%20Fix%20%28Edge%20scrollParent%20bug%29.meta.js
// ==/UserScript==

(function() {
  try {
    Object.defineProperty(HTMLElement.prototype, 'scrollParent', {
      writable: true,
      value: null
    });
  } catch (e) {
    // Silently ignore if it's already defined
  }
})();