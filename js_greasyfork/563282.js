// ==UserScript==
// @name         SE Sponsored Post
// @namespace    http://tampermonkey.net/
// @version      2026-01-24
// @description  hide sponsored posts on stackexchange
// @author       ActualFork
// @match        https://stackoverflow.com/*
// @match        https://superuser.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stackexchange.com/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563282/SE%20Sponsored%20Post.user.js
// @updateURL https://update.greasyfork.org/scripts/563282/SE%20Sponsored%20Post.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let style = document.createElement("style");
    style.textContent = ".js-zone-container { display: none !important; }"
    document.head.appendChild(style);
})();