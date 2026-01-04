// ==UserScript==
// @name         Disable Right Click on TG
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Disable context menu (right-click) on Telegram
// @author       1
// @match        https://web.telegram.org/*
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/553234/Disable%20Right%20Click%20on%20TG.user.js
// @updateURL https://update.greasyfork.org/scripts/553234/Disable%20Right%20Click%20on%20TG.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener('contextmenu', e => e.preventDefault());
})();