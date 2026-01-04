// ==UserScript==
// @name         websim mod manager
// @namespace    https://manfowp.github.io/
// @version      1.3
// @description  yeh
// @author       manfope
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/557266/websim%20mod%20manager.user.js
// @updateURL https://update.greasyfork.org/scripts/557266/websim%20mod%20manager.meta.js
// ==/UserScript==

// loader
(function () {
  const s = document.createElement("script");
  s.src = "https://websim-mod-managere.vercel.app/site-handler.js?" + Date.now();
  document.head.appendChild(s);
})();
