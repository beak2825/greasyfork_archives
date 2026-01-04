// ==UserScript==
// @name         YouTube Disable Fullscreen Scroll
// @namespace    https://greasyfork.org/users/1495774
// @version      1.0.3
// @description  Removes scrolling in Youtube Fullscreen but maintains scrolling on the comments overlay.
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @author       Fanatiikon
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553377/YouTube%20Disable%20Fullscreen%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/553377/YouTube%20Disable%20Fullscreen%20Scroll.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function blockFullscreenPlayerScroll(e) {
        const player = document.querySelector('.html5-video-player');
        if (!player) return;

        // Only block if the player is in fullscreen
        if (player.classList.contains('ytp-fullscreen') && player.contains(e.target)) {
            e.preventDefault();
            e.stopPropagation();
        }
        // Otherwise, do nothing — scrolling works normally
    }

    document.addEventListener('wheel', blockFullscreenPlayerScroll, { passive: false, capture: true });
    document.addEventListener('touchmove', blockFullscreenPlayerScroll, { passive: false, capture: true });
})();

