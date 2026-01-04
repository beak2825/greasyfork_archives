// ==UserScript==
// @name         CyTube Active Video Highlight
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a golden glow around the currently playing video in the queue list on CyTube.
// @author       You
// @match        https://cytu.be/r/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/555236/CyTube%20Active%20Video%20Highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/555236/CyTube%20Active%20Video%20Highlight.meta.js
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(`
        li.queue_entry.queue_active {
            border: 2px solid gold !important;
            box-shadow: 0 0 12px rgba(255, 215, 0, 0.6), 0 0 4px rgba(255, 215, 0, 0.4);
            animation: glowPulse 1.5s ease-in-out infinite;
        }

        @keyframes glowPulse {
            0% { box-shadow: 0 0 8px rgba(255, 215, 0, 0.4); }
            50% { box-shadow: 0 0 16px rgba(255, 215, 0, 0.8); }
            100% { box-shadow: 0 0 8px rgba(255, 215, 0, 0.4); }
        }
    `);
})();