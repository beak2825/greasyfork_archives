// ==UserScript==
// @name         BingBeautified
// @namespace    https://github.com/lucisurbe/js
// @version      5
// @description  Reform the ugly elements in Bing.
// @author       LucisUrbe
// @icon         https://www.bing.com/sa/simg/favicon-trans-bg-blue-mg-png.png
// @match        *://*.bing.com/*
// @grant        GM_addStyle
// @run-at       document-end
// @license      Apache
// @downloadURL https://update.greasyfork.org/scripts/556693/BingBeautified.user.js
// @updateURL https://update.greasyfork.org/scripts/556693/BingBeautified.meta.js
// ==/UserScript==

"use strict";
(function() {
    GM_addStyle(`
        .red-dot, #b_copilot_search { display: none !important };
    `);
    // Prevent ghosted query update, which is a stupid behavior.
    document.addEventListener("mousedown", (event) => {
        if (event.target.matches(".b_searchbox")) {
            event.stopImmediatePropagation();
        }
    }, true);
})();
