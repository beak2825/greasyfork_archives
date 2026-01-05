// ==UserScript==
// @name         RedGifs Advanced Buffer Fix + Overlay Remover (Optimized)
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Prevents RedGifs buffering issues and removes profile overlays - Optimized
// @author       You
// @match        https://old.reddit.com/*
// @match        https://www.reddit.com/*
// @match        https://redgifs.com/*
// @match        https://*.redgifs.com/*
// @run-at       document-end
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558777/RedGifs%20Advanced%20Buffer%20Fix%20%2B%20Overlay%20Remover%20%28Optimized%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558777/RedGifs%20Advanced%20Buffer%20Fix%20%2B%20Overlay%20Remover%20%28Optimized%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const isReddit = /reddit\.com/.test(location.hostname);
    const isRedgifs = /redgifs\.com/.test(location.hostname);

    // Optimized buffer management
    function setupAdvancedBuffering(video) {
        if (video.hasAttribute('data-advanced-buffer')) return;
        video.setAttribute('data-advanced-buffer', 'true');

        video.preload = 'auto';

        if (video.dataset.src && !video.src) {
            video.src = video.dataset.src;
            video.load();
        }

        let isStuck = false;
        let lastCurrentTime = 0;
        let stuckCheckCount = 0;
        let recentUnstickAttempt = false;

        // Extremely reduced monitoring - check every 5 seconds
        const progressMonitor = setInterval(() => {
            if (video.paused || video.ended) {
                stuckCheckCount = 0;
                isStuck = false;
                return;
            }

            if (video.currentTime === lastCurrentTime && video.currentTime > 0) {
                stuckCheckCount++;

                // Only intervene after 3 checks (15 seconds of being truly stuck)
                if (stuckCheckCount >= 3 && !isStuck && !recentUnstickAttempt) {
                    isStuck = true;
                    recentUnstickAttempt = true;
                    attemptUnstick();
                    setTimeout(() => { recentUnstickAttempt = false; }, 20000);
                }
            } else {
                stuckCheckCount = 0;
                isStuck = false;
                lastCurrentTime = video.currentTime;
            }
        }, 5000); // Increased from 3000ms to 5000ms

        function attemptUnstick() {
            const currentTime = video.currentTime;
            video.currentTime = currentTime + 0.02; // Tiny jump

            setTimeout(() => {
                if (video.currentTime === currentTime + 0.02 && !video.paused) {
                    const savedTime = video.currentTime;
                    video.currentTime = 0;
                    requestAnimationFrame(() => {
                        video.currentTime = savedTime;
                        video.play().catch(() => {});
                    });
                }
            }, 3000); // Increased from 2000ms to 3000ms
        }

        // Very patient waiting handler - only intervene after 8 seconds
        let waitingTimeout = null;

        video.addEventListener('waiting', () => {
            if (waitingTimeout) clearTimeout(waitingTimeout);

            waitingTimeout = setTimeout(() => {
                const savedTime = video.currentTime;
                video.currentTime = savedTime + 0.02;
                video.play().catch(() => {});
            }, 8000); // Increased from 5000ms to 8000ms
        });

        video.addEventListener('playing', () => {
            if (waitingTimeout) clearTimeout(waitingTimeout);
            isStuck = false;
            stuckCheckCount = 0;
        });

        video.addEventListener('pause', () => {
            if (waitingTimeout) clearTimeout(waitingTimeout);
            stuckCheckCount = 0;
        });

        // Removed progress event throttling - only check on actual stalls

        // Seamless looping
        video.loop = false;
        let isLooping = false;

        function checkForLoop() {
            if (video.paused || !video.duration) return;

            const timeRemaining = video.duration - video.currentTime;

            if (timeRemaining < 0.04 && !isLooping) {
                isLooping = true;
                requestAnimationFrame(() => {
                    video.currentTime = 0;
                    setTimeout(() => { isLooping = false; }, 100);
                });
            }

            if (!video.paused) {
                requestAnimationFrame(checkForLoop);
            }
        }

        video.addEventListener('playing', () => {
            requestAnimationFrame(checkForLoop);
        });

        video.addEventListener('ended', () => {
            video.currentTime = 0;
            video.play().catch(() => {});
        });

        // Cleanup
        const cleanupObserver = new MutationObserver((mutations) => {
            if (!document.body.contains(video)) {
                clearInterval(progressMonitor);
                if (waitingTimeout) clearTimeout(waitingTimeout);
                cleanupObserver.disconnect();
            }
        });
        cleanupObserver.observe(document.body, { childList: true, subtree: true });
    }

    // Optimized overlay removal - run less frequently
    function removeProfileOverlays() {
        const overlaySelectors = [
            '[title*="User profile"]',
            '[title*="profile page"]',
            'a[href*="/users/"]:not([class*="control"])',
            '[class*="CreatorLink"]',
            '[class*="UserLink"]',
            '[class*="ProfileLink"]'
        ];

        overlaySelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                const isOverlayingVideo = element.querySelector('video') || element.closest('[class*="video"]');
                const isControlElement = element.closest('[class*="control"]') || element.tagName === 'BUTTON';

                if (isOverlayingVideo && !isControlElement) {
                    element.style.display = 'none';
                    element.style.pointerEvents = 'none';
                }
            });
        });

        // Simplified video overlay removal
        document.querySelectorAll('video').forEach(video => {
            video.style.pointerEvents = 'auto';
        });
    }

    function processAllVideos() {
        const videos = document.querySelectorAll('video:not([data-advanced-buffer])');

        videos.forEach(video => {
            const src = video.src || video.currentSrc || video.dataset.src || '';
            const isRedgifsVideo = src.includes('redgifs.com') || isRedgifs || video.closest('[href*="redgifs.com"]');

            if (isRedgifsVideo || (isReddit && src)) {
                setupAdvancedBuffering(video);
            }
        });
    }

    function injectStyles() {
        const css = `
            [class*="CreatorLink"]:not([class*="control"]),
            [class*="UserLink"]:not([class*="control"]),
            [class*="ProfileLink"]:not([class*="control"]),
            [class*="player-overlay"],
            [class*="PlayerOverlay"],
            [class*="custom-controls"]:not(video::-webkit-media-controls) {
                display: none !important;
                pointer-events: none !important;
            }

            video {
                pointer-events: auto !important;
                z-index: 100 !important;
            }

            video + div:not([class*="control"]):empty {
                pointer-events: none !important;
            }
        `;

        const styleElement = document.createElement('style');
        styleElement.textContent = css;
        document.head.appendChild(styleElement);
    }

    // Reduced monitoring frequency
    function startContentMonitoring() {
        const observer = new MutationObserver((mutations) => {
            let hasNewVideos = false;

            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1 && (node.tagName === 'VIDEO' || node.querySelector('video'))) {
                        hasNewVideos = true;
                        break;
                    }
                }
                if (hasNewVideos) break;
            }

            if (hasNewVideos) {
                processAllVideos();
                removeProfileOverlays();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Increased interval from 5000ms to 10000ms
        setInterval(() => {
            processAllVideos();
            removeProfileOverlays();
        }, 10000);
    }

    function initialize() {
        injectStyles();
        processAllVideos();
        removeProfileOverlays();
        startContentMonitoring();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();