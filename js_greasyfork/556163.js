// ==UserScript==
// @name             test script
// @description      test if userscript manager is working
// @match            *://*/*
// @run-at           document-start
// @version          1.1.1
// @namespace https://greasyfork.org/users/1538977
// @downloadURL https://update.greasyfork.org/scripts/556163/test%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/556163/test%20script.meta.js
// ==/UserScript==

const p = document.createElement("p");
p.style = "position:fixed;bottom:0;right:0; background:#000;color:#fff;";
p.innerHTML = "userscripts working";
document.body.appendChild(p);
setTimeout(() => p.remove(), 2000);
