// ==UserScript==
// @name         TikTok Background Play
// @namespace    https://github.com/Yaw-Dev
// @version      1.0
// @description  Trick the TikTok web player into thinking the tab is in focus | TikTok background play for the web player!
// @author       Yaw-Dev
// @match        *://www.tiktok.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547719/TikTok%20Background%20Play.user.js
// @updateURL https://update.greasyfork.org/scripts/547719/TikTok%20Background%20Play.meta.js
// ==/UserScript==

(function() {
    'use strict';

    Object.defineProperty(document, 'hidden', {
        get: function() {
            return false;
        },
        configurable: true
    });

})();