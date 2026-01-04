// ==UserScript==
// @name         YouTube Theater Mode Fix
// @version      3.1
// @description  Tries to revert some changes to the youtube theater / fullscreen mode to be like the old UI
// @author       Torkelicious
// @icon         https://www.youtube.com/favicon.ico
// @license      GPL-3.0-or-later
// @match        https://www.youtube.com/*
// @run-at       document-start
// @namespace    https://greasyfork.org/users/1403155
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/554084/YouTube%20Theater%20Mode%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/554084/YouTube%20Theater%20Mode%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const css = `
    ytd-app {
        overflow: auto !important;
    }
    ytd-app[scrolling] {
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        right: calc((var(--ytd-app-fullerscreen-scrollbar-width) + 1px)*-1) !important;
        bottom: 0 !important;
        overflow-x: auto !important;
    }
    ytd-watch-flexy[full-bleed-player] #single-column-container.ytd-watch-flexy,
    ytd-watch-flexy[full-bleed-player] #columns.ytd-watch-flexy {
        display: flex !important;
    }
    .ytp-fullscreen-grid-peeking.ytp-full-bleed-player.ytp-delhi-modern:not(.ytp-autohide) .ytp-chrome-bottom {
        bottom: 0 !important;
        opacity: 1!important;
    }
    #movie_player:not(.ytp-grid-ended-state) .ytp-fullscreen-grid {
        display: none!important;
        top:100%!important;
        opacity: 0!important;
    }
    .ytp-overlays-container {
        display: none !important;
    }
    ytd-watch-flexy[full-bleed-player][i-max-theater-mode][theater]:not([fullscreen]) #full-bleed-container.ytd-watch-flexy{
        height:56.25vw;
        max-height:81.5vh;
    }
    `;

    let styleInjected = false;

    function injectCSS() {
        if (!styleInjected) {
            const style = document.createElement('style');
            style.textContent = css;
            document.head.appendChild(style);
            styleInjected = true;
        }
    }

    function checkUrl() {
        if (location.pathname.startsWith('/watch')) {
            injectCSS();
        }
    }

    // Init check
    checkUrl();

    // SPA navigation
    let lastUrl = location.href;
    new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            checkUrl();
        }
    }).observe(document, {subtree: true, childList: true});
})();