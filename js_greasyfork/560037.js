// ==UserScript==
// @name         Force Plain Text Copy
// @namespace    https://greasyfork.org/users/1300060
// @description  Always copy as plain text
// @version      1.0
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560037/Force%20Plain%20Text%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/560037/Force%20Plain%20Text%20Copy.meta.js
// ==/UserScript==

(function () {
  function onCopy(e) {
    var sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;
    e.clipboardData.setData("text/plain", sel.toString());
    e.preventDefault();
  }
  document.addEventListener("copy", onCopy, true);
})();
