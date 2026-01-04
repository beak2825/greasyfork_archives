// ==UserScript==
// @name         YouTube Fullscreen Classic 2024 Title
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Reverts the fullscreen title to the classic top-left style, and hides it when player controls auto-hide.
// @author       Gemini & ChatGPT
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/552945/YouTube%20Fullscreen%20Classic%202024%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/552945/YouTube%20Fullscreen%20Classic%202024%20Title.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const customCSS = `
        /* --- 1. Hide new overlay --- */
        .ytp-fullscreen yt-player-overlay-video-details-renderer,
        .ytp-fullscreen .ytp-overlay-top-left .ytp-fullscreen-metadata {
            display: none !important;
        }

        /* --- 2. Restore classic top-left title --- */
        .ytp-fullscreen .ytp-chrome-top {
            display: flex !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            height: auto !important;
            background: linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%) !important;
            padding: 0 10px !important;
            box-sizing: border-box !important;
            z-index: 21 !important;
            pointer-events: none !important;
            transition: opacity 0.3s ease !important;
            opacity: 1 !important;
        }

        /* When the player hides its controls, hide the title too */
        .ytp-fullscreen.ytp-autohide .ytp-chrome-top {
            opacity: 0 !important;
        }

        /* Title container */
        .ytp-fullscreen .ytp-chrome-top .ytp-title {
            position: static !important;
            display: block !important;
            margin: 0 !important;
            pointer-events: none !important;
        }

        .ytp-fullscreen .ytp-chrome-top .ytp-title-text {
            display: block !important;
        }

        .ytp-fullscreen .ytp-chrome-top .ytp-title-text .ytp-title-link {
            color: white !important;
            font-size: 2.5rem !important;
            font-weight: normal !important;
            text-decoration: none !important;
            cursor: default !important;
            pointer-events: none !important;
            text-shadow: 0 0 5px rgba(0,0,0,0.7);
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            max-width: 80vw !important;
            display: inline-block !important;
        }

        .ytp-fullscreen .ytp-chrome-top .ytp-title-subtext,
        .ytp-fullscreen .ytp-gradient-top {
            display: none !important;
        }
    `;

    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(customCSS);
    } else {
        const style = document.createElement('style');
        style.textContent = customCSS;
        document.head.appendChild(style);
    }
})();
