// ==UserScript==
// @name         RafBlocker Enhanced
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Blocks all YouTube ads (video, banner, preview) and suppresses adblocker warnings without skipping playlist videos.
// @author       Raf
// @match        *://www.youtube.com/*
// @match        *://m.youtube.com/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553492/RafBlocker%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/553492/RafBlocker%20Enhanced.meta.js
// ==/UserScript==

/*
 * MIT License
 *
 * Copyright (c) 2025 Raf
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function() {
    'use strict';

    // --- Configuration and Selectors ---
    const AD_SELECTORS = [
        '.ad-container',
        '.video-ads',
        '.ytp-ad-module',
        '.ytp-ad-image-overlay',
        '.ytp-ad-overlay-container',
        '.ytp-ce-element',
        '.ytp-ad-text',
        '.ytp-ad-preview-container',
        '.ytp-ad-skip-button-container',
        '.ytp-ad-banner-container',
        '.sparkles-light-cta', // Promotional banners
        '.ytd-companion-slot-renderer',
        '.ytd-action-companion-ad-renderer',
        '.ytd-in-feed-ad-renderer'
    ].join(', ');

    const SKIP_BUTTON_SELECTOR = '.ytp-ad-skip-button, .ytp-skip-ad-button, .ytp-ad-skip-button-modern';
    const WARNING_MODAL_SELECTOR = [
        'ytd-popup-container',
        'tp-yt-paper-dialog',
        '.ytp-adblock-warning',
        '.yt-spec-general-modal',
        '#dialog',
        '.ytd-consent-bump-v2-lightbox'
    ].join(', ');

    const DISMISS_BUTTON_SELECTOR = [
        'ytd-button-renderer button',
        '.ytp-adblock-warning-dismiss',
        '.yt-spec-button-shape-next--call-to-action',
        'button[aria-label*="Dismiss"]',
        'button[aria-label*="Close"]'
    ].join(', ');

    // --- Utility Functions ---

    // Remove elements matching the selector
    function removeElements(selector) {
        document.querySelectorAll(selector).forEach(element => {
            if (element) {
                element.remove();
            }
        });
    }

    // Check if the current video is an ad
    function isAdPlaying() {
        return document.querySelector('.ad-showing, .ad-interrupting, .ytp-ad-player-overlay') !== null;
    }

    // Skip video ads without affecting playlist videos
    function skipVideoAd() {
        const skipButton = document.querySelector(SKIP_BUTTON_SELECTOR);
        if (skipButton) {
            skipButton.click();
            return true;
        }

        const videoPlayer = document.querySelector('video');
        if (videoPlayer && isAdPlaying()) {
            videoPlayer.currentTime = videoPlayer.duration || Number.MAX_SAFE_INTEGER;
            return true;
        }
        return false;
    }

    // Suppress adblocker warnings
    function suppressAdBlockWarning() {
        // Inject CSS to hide modals and restore scrolling
        let style = document.getElementById('RafBlockerStyle');
        if (!style) {
            style = document.createElement('style');
            style.id = 'RafBlockerStyle';
            style.type = 'text/css';
            document.head.appendChild(style);
        }

        style.innerHTML = `
            ${WARNING_MODAL_SELECTOR}, .ytp-adblock-warning, .ytp-consent-bump {
                display: none !important;
                visibility: hidden !important;
                pointer-events: none !important;
            }
            body, html {
                overflow: auto !important;
            }
            .ytp-ad-player-overlay, .ytp-ad-overlay-slot {
                display: none !important;
            }
        `;

        // Click dismiss buttons
        document.querySelectorAll(DISMISS_BUTTON_SELECTOR).forEach(button => {
            if (button.innerText.toUpperCase().includes('DISMISS') || 
                button.innerText.toUpperCase().includes('CLOSE') || 
                button.getAttribute('aria-label')?.toUpperCase().includes('DISMISS') ||
                button.getAttribute('aria-label')?.toUpperCase().includes('CLOSE')) {
                button.click();
            }
        });

        // Manipulate player state to bypass ad checks
        const player = document.querySelector('#movie_player');
        if (player && player.getPlayerState) {
            const state = player.getPlayerState();
            if (state === 2 && isAdPlaying()) { // Paused due to ad
                player.playVideo();
            }
        }

        // Override YouTube's ad-related properties
        if (window.ytplayer?.config?.args) {
            window.ytplayer.config.args.advideo = 0;
            window.ytplayer.config.args.is_ad = false;
            window.ytplayer.config.args.ad_flags = 0;
            window.ytplayer.config.args.ad_module = '';
        }

        // Mock ad-related functions to return empty or safe values
        const originalGet = Object.getOwnPropertyDescriptor;
        const originalDefine = Object.defineProperty;
        const mockProperties = ['adPlacements', 'adSlots', 'isAdPlaying', 'adsEnabled'];
        mockProperties.forEach(prop => {
            if (window.ytplayer) {
                originalDefine(window.ytplayer, prop, {
                    get: () => false,
                    configurable: true
                });
            }
        });
    }

    // --- Main Blocking Logic ---
    function blockAdsAndWarnings() {
        // Suppress adblock warnings first
        suppressAdBlockWarning();

        // Remove all ad-related elements
        removeElements(AD_SELECTORS);

        // Skip video ads only if an ad is detected
        if (isAdPlaying()) {
            skipVideoAd();
        }
    }

    // --- Playlist Protection ---
    function protectPlaylist() {
        const playlist = document.querySelector('ytd-playlist-panel-renderer');
        if (playlist) {
            // Ensure the player doesn't skip videos due to ad detection
            const player = document.querySelector('#movie_player');
            if (player && player.getPlaylistId) {
                const playlistId = player.getPlaylistId();
                if (playlistId && isAdPlaying()) {
                    // Prevent skipping by ensuring ad checks don't interfere
                    player.playVideo();
                }
            }
        }
    }

    // --- Observer and Interval ---
    const observer = new MutationObserver(() => {
        blockAdsAndWarnings();
        protectPlaylist();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Run every 100ms for aggressive ad removal
    setInterval(() => {
        blockAdsAndWarnings();
        protectPlaylist();
    }, 100);

    // Initial run
    blockAdsAndWarnings();
    protectPlaylist();
})();