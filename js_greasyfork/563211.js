// ==UserScript==
// @name         JSON.stringify Logger
// @version      1.0
// @description  Logs the argument to the function JSON.stringify, for demo purposes only.
// @match        *://*/*
// @run-at       document-start
// @license      MIT
// @namespace https://greasyfork.org/users/1562248
// @downloadURL https://update.greasyfork.org/scripts/563211/JSONstringify%20Logger.user.js
// @updateURL https://update.greasyfork.org/scripts/563211/JSONstringify%20Logger.meta.js
// ==/UserScript==

(function () {
  const originalStringify = JSON.stringify;

  JSON.stringify = function (...args) {
    console.log("JSON.stringify:", args);
    return originalStringify.apply(this, args);
  };
})();
