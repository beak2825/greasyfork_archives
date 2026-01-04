// ==UserScript==
// @name         YouTube Ad Blocke rPRO
// @namespace    https://tampermonkey.net/
// @version      1.5
// @description  Blocks YouTube ads, skips video ads, removes ad overlays
// @author       ChatGPT
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @license SHADOW
// @downloadURL https://update.greasyfork.org/scripts/561178/YouTube%20Ad%20Blocke%20rPRO.user.js
// @updateURL https://update.greasyfork.org/scripts/561178/YouTube%20Ad%20Blocke%20rPRO.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* --------------------------------------------------
       1. Block ad-related network requests
    -------------------------------------------------- */
    const blockedPatterns = [
        'doubleclick.net',
        'googlesyndication',
        'googleads',
        'adsystem',
        'adservice',
        'pagead',
    ];

    const originalFetch = window.fetch;
    window.fetch = function (...args) {
        const url = args[0]?.toString() || '';
        if (blockedPatterns.some(p => url.includes(p))) {
            return new Promise(() => {});
        }
        return originalFetch.apply(this, args);
    };

    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
        if (blockedPatterns.some(p => url.includes(p))) {
            return;
        }
        return originalOpen.apply(this, arguments);
    };

    /* --------------------------------------------------
       2. Remove ad elements from the page
    -------------------------------------------------- */
    const removeAds = () => {
        const selectors = [
            '.ytp-ad-module',
            '.ytp-ad-overlay-container',
            '.ytp-ad-player-overlay',
            '.ytp-ad-text-overlay',
            'ytd-display-ad-renderer',
            'ytd-promoted-sparkles-web-renderer',
            'ytd-video-masthead-ad-v3-renderer',
            '#player-ads',
            '#masthead-ad',
        ];

        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => el.remove());
        });
    };

    /* --------------------------------------------------
       3. Auto-skip & mute video ads
    -------------------------------------------------- */
    const handleVideoAds = () => {
        const video = document.querySelector('video');
        if (!video) return;

        const skipBtn = document.querySelector('.ytp-ad-skip-button');
        if (skipBtn) skipBtn.click();

        if (video.duration && video.duration < 60 && video.currentTime < video.duration) {
            video.currentTime = video.duration;
            video.muted = true;
        } else {
            video.muted = false;
        }
    };

    /* --------------------------------------------------
       4. Hide "Ad blocker warning" overlays
    -------------------------------------------------- */
    const hideWarnings = () => {
        document.querySelectorAll('tp-yt-paper-dialog').forEach(d => {
            if (d.innerText.toLowerCase().includes('ad blocker')) {
                d.remove();
            }
        });
    };

    /* --------------------------------------------------
       5. Observe page changes
    -------------------------------------------------- */
    const observer = new MutationObserver(() => {
        removeAds();
        handleVideoAds();
        hideWarnings();
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
    });

    /* --------------------------------------------------
       6. Initial cleanup
    -------------------------------------------------- */
    window.addEventListener('load', () => {
        removeAds();
        handleVideoAds();
        hideWarnings();
    });

})();
