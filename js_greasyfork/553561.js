// ==UserScript==
// @name         No More Videos
// @author       duskisback
// @namespace    https://youtube.com/
// @version      1.4
// @description  Hides the fullscreen "More videos" overlay on YouTube.
// @match        https://www.youtube.com/*
// @run-at       document-start
// @license      CC BY-NC 4.0
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/553561/No%20More%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/553561/No%20More%20Videos.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Using CSS to permanently hide the grid components.
    const staticCss = `
        .ytp-fullscreen-grid,
        .ytp-fullscreen-grid-hover-overlay,
        .ytp-fullscreen-grid-hover-overlay-chevron,
        .ytp-fullscreen-grid-stills-container {
            opacity: 0 !important;
            pointer-events: none !important;
        }

        .ytp-fullscreen:is(.ytp-fullscreen-grid-peeking, .ytp-fullscreen-grid-active) .ytp-gradient-top,
        .ytp-fullscreen:is(.ytp-fullscreen-grid-peeking, .ytp-fullscreen-grid-active) .ytp-gradient-bottom {
            opacity: 0 !important;
        }
    `;
    GM_addStyle(staticCss);

    // Using a requestAnimationFrame loop.
    const fixScrollJiggle = () => {
        const player = document.querySelector('.html5-video-player.ytp-fullscreen');
        if (!player) {
            requestAnimationFrame(fixScrollJiggle);
            return;
        }

        const chromeBottom = player.querySelector('.ytp-chrome-bottom');
        const overlays = player.querySelector('.ytp-overlays-container');

        // This is the core check: is the user *trying* to move the bar up?
        const isGridPeeking = player.classList.contains('ytp-fullscreen-grid-peeking') ||
                              player.classList.contains('ytp-fullscreen-grid-active');

        if (isGridPeeking) {
            // SCROLLING: Override YouTube's JS to prevent the bar from moving up.
            if (chromeBottom) {
                chromeBottom.style.setProperty('bottom', '0px', 'important');
                // The 'transition-property' override is vital to stop the jiggle animation
                chromeBottom.style.setProperty('transition-property', 'opacity, transform', 'important');
            }
            if (overlays) {
                overlays.style.setProperty('bottom', 'calc(var(--yt-delhi-bottom-controls-height, 72px) + 30px)', 'important');
                overlays.style.setProperty('transition-property', 'opacity, transform', 'important');
            }

        } else {
            // When we're not scrolling, remove our fix.
            // For the user information: Without this, in the earlier versions upon moving the mouse the UI would lag and scroll wheel volume controls would-
            // -be really hard to use, so this kind of fixes it also adding a little neat thing, where upon moving and scrolling the taskbar changes opacity. Cool, yeah?
            if (chromeBottom) {
                if (chromeBottom.style.getPropertyValue('bottom') === '0px') chromeBottom.style.removeProperty('bottom');
                if (chromeBottom.style.getPropertyValue('transition-property') === 'opacity, transform') chromeBottom.style.removeProperty('transition-property');
            }
            if (overlays) {
                if (overlays.style.getPropertyValue('bottom').startsWith('calc')) overlays.style.removeProperty('bottom');
                if (overlays.style.getPropertyValue('transition-property') === 'opacity, transform') overlays.style.removeProperty('transition-property');
            }
        }

        requestAnimationFrame(fixScrollJiggle);
    };

    requestAnimationFrame(fixScrollJiggle);
})();