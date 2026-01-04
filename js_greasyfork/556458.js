// ==UserScript==
// @name         YouTube CRT Overlay
// @version      1.1
// @namespace    http://tampermonkey.net/
// @license      MIT License
// @description  Applies a CSS CRT scanline and vignette effect to YouTube videos
// @author       itsmebucky
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/556458/YouTube%20CRT%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/556458/YouTube%20CRT%20Overlay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CHECK_INTERVAL_MS = 2000; // Check every 2 seconds for new videos

    function applyCRT() {

        // Find the player
        let player = document.getElementById('movie_player') || document.querySelector('.html5-video-player');

        if (!player) return;

        // Find the video element inside THIS player
        const video = player.querySelector('video');
        if (!video) return;

        // Check if overlay already exists
        if (player.querySelector('.crt-overlay-layer')) {
            return;
        }

        // Apply CSS Filters
        video.style.filter = "contrast(1.3) saturate(1.2) blur(0.6px)";

        // Create and Inject the Overlay
        const overlay = document.createElement('div');
        overlay.className = 'crt-overlay-layer'; // Class instead of ID
        overlay.style.cssText = `
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            z-index: 10;
            pointer-events: none;
            background:
                repeating-linear-gradient(
                    to bottom,
                    transparent 0px,
                    transparent 2px,
                    rgba(0, 0, 0, 0.25) 2px,
                    rgba(0, 0, 0, 0.25) 4px
                ),
                repeating-linear-gradient(
                    to right,
                    transparent 0px,
                    rgba(255, 0, 0, 0.05) 1px,
                    rgba(0, 255, 0, 0.05) 2px,
                    rgba(0, 0, 255, 0.05) 3px
                ),
                radial-gradient(
                    circle,
                    transparent 60%,
                    rgba(0, 0, 0, 0.6) 100%
                );
            mix-blend-mode: overlay;
        `;

        player.appendChild(overlay);
        console.log("📺 CRT Overlay Applied to current player");
    }

    // Run repeatedly to handle navigation
    setInterval(applyCRT, CHECK_INTERVAL_MS);

    // Run once immediately
    applyCRT();
})();