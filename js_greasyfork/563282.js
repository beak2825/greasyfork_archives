// ==UserScript==
// @name         SO Sponsored Post
// @namespace    http://tampermonkey.net/
// @version      2026-01-18
// @description  hide sponsored posts on stackoverflow
// @author       ActualFork
// @match        https://stackoverflow.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stackoverflow.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563282/SO%20Sponsored%20Post.user.js
// @updateURL https://update.greasyfork.org/scripts/563282/SO%20Sponsored%20Post.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let style = document.createElement("style");
    style.textContent = ".js-zone-container { display: none !important; }"
    document.head.appendChild(style);
})();