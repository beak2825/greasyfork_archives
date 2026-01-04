// ==UserScript==
// @name         YouTube Speed Toggle
// @namespace    https://github.com/ywtaoo
// @version      1.0.0
// @description  Add a speed toggle button to YouTube player controls, switch between 1x and 2x with one click
// @author       ywtaoo
// @license      MIT
// @match        https://www.youtube.com/*
// @icon         https://www.youtube.com/favicon.ico
// @homepageURL  https://github.com/ywtaoo/youtube-speed-toggle
// @supportURL   https://github.com/ywtaoo/youtube-speed-toggle/issues
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/560281/YouTube%20Speed%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/560281/YouTube%20Speed%20Toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const BUTTON_ID = 'yt-speed-toggle-btn';
    const SPEEDS = [1, 2];
    let currentSpeedIndex = 0;

    /**
     * Create speed toggle button
     */
    function createSpeedButton() {
        const button = document.createElement('button');
        button.id = BUTTON_ID;
        button.className = 'ytp-button';
        button.title = 'Toggle playback speed';
        button.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: center;
            width: auto;
            min-width: 40px;
            height: 100%;
            padding: 0 8px;
            font-size: 14px;
            font-weight: 500;
            color: #fff;
            opacity: 0.9;
            cursor: pointer;
            transition: opacity 0.1s ease;
            line-height: 1;
        `;
        button.textContent = '1x';

        button.addEventListener('mouseenter', () => {
            button.style.opacity = '1';
        });

        button.addEventListener('mouseleave', () => {
            button.style.opacity = '0.9';
        });

        button.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleSpeed();
        });

        return button;
    }

    /**
     * Toggle playback speed
     */
    function toggleSpeed() {
        const video = document.querySelector('video');
        if (!video) return;

        currentSpeedIndex = (currentSpeedIndex + 1) % SPEEDS.length;
        const newSpeed = SPEEDS[currentSpeedIndex];

        video.playbackRate = newSpeed;
        updateButtonDisplay(newSpeed);
    }

    /**
     * Update button display
     */
    function updateButtonDisplay(speed) {
        const button = document.getElementById(BUTTON_ID);
        if (button) {
            button.textContent = speed + 'x';
            button.title = `Current speed: ${speed}x (click to toggle)`;
        }
    }

    /**
     * Sync button state with current video speed
     */
    function syncButtonWithVideo() {
        const video = document.querySelector('video');
        const button = document.getElementById(BUTTON_ID);

        if (video && button) {
            const currentRate = video.playbackRate;
            const speedIndex = SPEEDS.indexOf(currentRate);

            if (speedIndex !== -1) {
                currentSpeedIndex = speedIndex;
            } else {
                // If current speed is not in preset list, reset to 1x
                currentSpeedIndex = 0;
            }

            updateButtonDisplay(SPEEDS[currentSpeedIndex]);
        }
    }

    /**
     * Inject button into player controls
     */
    function injectButton() {
        // Check if button already exists
        if (document.getElementById(BUTTON_ID)) {
            syncButtonWithVideo();
            return;
        }

        // Find right controls area
        const rightControls = document.querySelector('.ytp-right-controls');
        if (!rightControls) return;

        const button = createSpeedButton();

        // Insert at the first position of right controls (before fullscreen button)
        rightControls.insertBefore(button, rightControls.firstChild);

        // Sync current video speed
        syncButtonWithVideo();

        // Listen for video speed changes (user may change speed via other methods)
        const video = document.querySelector('video');
        if (video) {
            video.addEventListener('ratechange', () => {
                syncButtonWithVideo();
            });
        }

        console.log('[YouTube Speed Toggle] Button injected');
    }

    /**
     * Initialize script
     */
    function init() {
        // Try to inject immediately
        injectButton();

        // Use MutationObserver to watch for DOM changes
        // YouTube is a SPA, content loads dynamically
        const observer = new MutationObserver((mutations) => {
            // Check if player exists but button doesn't
            const player = document.querySelector('#movie_player');
            const button = document.getElementById(BUTTON_ID);

            if (player && !button) {
                injectButton();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Listen for YouTube SPA navigation
        // YouTube uses History API for page navigation
        const originalPushState = history.pushState;
        history.pushState = function(...args) {
            originalPushState.apply(this, args);
            // Delay execution to wait for new page content to load
            setTimeout(injectButton, 1000);
        };

        const originalReplaceState = history.replaceState;
        history.replaceState = function(...args) {
            originalReplaceState.apply(this, args);
            setTimeout(injectButton, 1000);
        };

        window.addEventListener('popstate', () => {
            setTimeout(injectButton, 1000);
        });

        // Listen for YouTube's yt-navigate-finish event (more reliable)
        window.addEventListener('yt-navigate-finish', () => {
            setTimeout(injectButton, 500);
        });
    }

    // Start script
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
