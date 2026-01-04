// ==UserScript==
// @name         Google Translate Dark Theme
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Forces a dark theme on Google Translate by inverting colors.
// @author       raspjoy
// @match        https://translate.google.com/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553205/Google%20Translate%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/553205/Google%20Translate%20Dark%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        html {
            /* This is the main filter that inverts colors */
            filter: invert(1) hue-rotate(180deg) !important;

            /* This sets the background to white, which becomes black after inversion */
            background-color: #fff !important;
        }

        /* This part re-inverts images and maps so they don't look like photo negatives */
        img, video, .lH3iKc, .feedback-container {
            filter: invert(1) hue-rotate(180deg) !important;
        }
    `);
})();