// ==UserScript==
// @name         BlockRaf
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Blocks all YouTube ads, banners, and previews without triggering warnings or breaking video playback
// @author       Rafin
// @match        https://*.youtube.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553359/BlockRaf.user.js
// @updateURL https://update.greasyfork.org/scripts/553359/BlockRaf.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2025 Rafin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function() {
    'use strict';

    // Function to hide ad-related elements without breaking the player
    function hideAds() {
        const selectors = [
            // Ad containers
            '.ytp-ad-module',
            '.video-ads',
            '.ytd-ad-slot-renderer',
            '.ytd-in-feed-ad-layout-renderer',
            // Banner and overlay ads
            '.ytp-ad-overlay-container',
            '.ytp-ad-image-overlay',
            '.ytp-ad-text-overlay',
            '.ytp-ad-overlay-slot',
            '.ytd-companion-slot-renderer',
            '.ytd-banner-promo-renderer',
            '.ytd-action-companion-ad-renderer',
            '.ytd-invideo-overlay-renderer',
            // Ad previews and buttons
            '.ytp-ad-preview-container',
            '.ytp-ad-preview-image',
            '.ytp-ad-preview-text',
            '.ytp-ad-skip-button-container',
            '.ytp-ad-skip-button',
            '.ytp-ad-skip-button-text',
            '.ytp-ad-skip-button-modern',
            // Player ad elements
            '.ytp-ad-player-overlay',
            '.ytp-ad-player-overlay-flyout-cta',
            '.ytd-player-legacy-desktop-watch-ads-renderer',
            // Sidebar and feed ads
            '.ytd-promoted-video-renderer',
            '.ytd-ad-image-renderer',
            '.ytd-ad-badge-renderer',
            // Miscellaneous
            '.masthead-ad',
            '.ytd-ad-notice-renderer',
            '.ytd-ad-pitch-renderer',
            '.sparkles-light-cta'
        ];

        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                // Hide elements instead of removing to prevent player issues
                el.style.display = 'none';
                el.style.visibility = 'hidden';
                el.style.height = '0px';
                el.style.width = '0px';
                el.style.overflow = 'hidden';
            });
        });

        // Ensure video player is not affected
        const videoPlayer = document.querySelector('video');
        if (videoPlayer) {
            // Clear ad-related attributes
            ['data-ad-showing', 'data-ad-playing', 'data-ad-format'].forEach(attr => {
                if (videoPlayer.hasAttribute(attr)) {
                    videoPlayer.removeAttribute(attr);
                }
            });
            // Force player to resume if stuck
            if (videoPlayer.paused && !videoPlayer.ended) {
                videoPlayer.play().catch(() => {});
            }
        }
    }

    // Function to block ad-related network requests
    function blockAdRequests() {
        const adDomains = [
            'doubleclick.net',
            'googlesyndication.com',
            'youtube.com/api/ads',
            'youtube.com/pagead',
            'ads.youtube.com',
            'youtube.com/ad',
            'ytimg.com/*/ads'
        ];

        // Intercept fetch requests
        const originalFetch = window.fetch;
        window.fetch = async function(...args) {
            const url = args[0];
            if (typeof url === 'string' && adDomains.some(domain => url.includes(domain))) {
                return new Response('{}', { status: 200, statusText: 'OK' });
            }
            return originalFetch.apply(this, args);
        };

        // Intercept XMLHttpRequest
        const originalXhrOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url, ...args) {
            if (typeof url === 'string' && adDomains.some(domain => url.includes(domain))) {
                return;
            }
            return originalXhrOpen.apply(this, [method, url, ...args]);
        };
    }

    // Function to protect playlist videos
    function protectPlaylistVideos() {
        const player = document.querySelector('.html5-main-video');
        if (player) {
            const isPlaylist = window.location.search.includes('list=') || document.querySelector('.ytd-playlist-panel-renderer');
            if (isPlaylist) {
                // Clear ad-related attributes
                ['data-ad-showing', 'data-ad-playing', 'data-ad-format'].forEach(attr => {
                    if (player.hasAttribute(attr)) {
                        player.removeAttribute(attr);
                    }
                });
                // Ensure playback continues
                if (player.paused && !player.ended) {
                    player.play().catch(() => {});
                }
            }
        }
    }

    // MutationObserver to monitor DOM changes
    function observeDOM() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(() => {
                hideAds();
                protectPlaylistVideos();
            });
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true
        });
    }

    // Initialize ad blocking
    blockAdRequests();

    // Run when document is ready
    function initialize() {
        hideAds();
        protectPlaylistVideos();
        observeDOM();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // Fallback interval to catch late-loaded ads
    setInterval(() => {
        hideAds();
        protectPlaylistVideos();
    }, 1000);
})();