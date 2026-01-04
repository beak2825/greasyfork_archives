// ==UserScript==
// @name         YouTube Queue Player Bottom Left
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license MIT
// @description  Open YouTube's queued videos player on the bottom left instead of bottom right
// @author       Dingo (Claude Sonnet)
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/555345/YouTube%20Queue%20Player%20Bottom%20Left.user.js
// @updateURL https://update.greasyfork.org/scripts/555345/YouTube%20Queue%20Player%20Bottom%20Left.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        ytd-miniplayer.ytdMiniplayerComponentVisible {
            left: 24px !important;
            right: auto !important;
        }
    `);
})();
