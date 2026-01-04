// ==UserScript==
// @name         Extra Youtube Features
// @namespace    Violentmonkey Scripts
// @version      1.3
// @license      MIT
// @author       Orbitt
// @description  Youtube Auto-Skip ads | Download Button | Sponsor Skip | Redirect to YouTubePi | Anti-Adblock Removal
// @match        *://www.youtube.com/*
// @match        *://m.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549425/Extra%20Youtube%20Features.user.js
// @updateURL https://update.greasyfork.org/scripts/549425/Extra%20Youtube%20Features.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function skipAds() {
        const skipButtons = [
            '.ytp-ad-skip-button',
            '.ytp-ad-skip-button-modern',
            '.ytp-skip-ad-button',
            'ytd-miniplayer .ytp-ad-skip-button',
            '[class*="skip"][class*="ad"]'
        ];
        skipButtons.forEach(sel => {
            document.querySelectorAll(sel).forEach(btn => btn.click());
        });
        document.querySelectorAll('.ytp-ad-overlay-container, .ytp-ad-image-overlay, .video-ads.ytp-ad-module').forEach(el => el.remove());
    }

    function addDownloadButton() {
        const existing = document.querySelector('#my-download-btn');
        const container = document.querySelector('#above-the-fold #top-level-buttons-computed');
        if (container && !existing) {
            const btn = document.createElement('button');
            btn.id = "my-download-btn";
            btn.className = "yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m";
            const span = document.createElement('span');
            span.className = "yt-spec-button-shape-next__button-text-content";
            span.innerText = "Download";
            btn.appendChild(span);
            btn.onclick = () => {
                const videoId = new URLSearchParams(window.location.search).get("v");
                if (videoId) window.open(`https://en.y2mate.is/pZuT/watch?v=${videoId}`, '_blank');
            };
            container.appendChild(btn);
        }
    }

    function sponsorSkip() {
        const video = document.querySelector('video');
        const chapters = document.querySelectorAll('.ytp-chapter-hover-container');
        if (video && chapters.length > 0) {
            chapters.forEach(ch => {
                if (ch.innerText.toLowerCase().includes('sponsor')) video.currentTime += 30;
            });
        }
    }

    function removeAntiAdblockPopup() {
        const selectors = [
            'tp-yt-paper-dialog',
            'ytd-popup-container',
            '.ytd-consent-bump-v2-lightbox',
            '[class*="dialog"][class*="popup"]',
            '[role="dialog"]',
            '.ytp-popup',
            '.video-ads.ytp-ad-module'
        ];
        selectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(dlg => {
                const isAdblockWarning =
                    dlg.querySelector('a[href*="support.google.com"]') ||
                    /adblock|allow\s+ads|blocker|advertising|turn\s+off/i.test(dlg.textContent) ||
                    dlg.querySelector('[class*="adblock"], [class*="blocker"]') ||
                    dlg.classList.contains('video-ads');
                if (isAdblockWarning) {
                    dlg.remove();
                    document.body.style.overflow = 'auto';
                }
            });
        });

        const backdrops = [
            'tp-yt-iron-overlay-backdrop.opened',
            '.ytp-ad-overlay-container',
            '[class*="backdrop"][class*="opened"]',
            '[class*="overlay"][style*="display: block"]',
            '.ytp-ad-module'
        ];
        backdrops.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                el.remove();
                document.body.style.overflow = 'auto';
            });
        });

        const player = document.querySelector('#movie_player, .html5-video-player');
        if (player) {
            if (player.style.display === 'none' || player.classList.contains('ad-showing')) {
                player.style.display = 'block';
                player.classList.remove('ad-showing', 'ad-interrupting');
            }
            const video = player.querySelector('video');
            if (video && video.paused) video.play().catch(() => {});
        }
    }

    function bypassAgeRestriction() {
        const ageDialog = document.querySelector('ytd-enforcement-message-view-model, [class*="age-restriction"]');
        if (ageDialog) ageDialog.remove();

        const video = document.querySelector('video');
        if (video && video.paused && video.readyState === 0) {
            const isAgeBlocked = document.querySelector('ytd-player .ytd-watch-flexy[ad-blocked], [class*="age-restricted"]');
            const videoId = new URLSearchParams(window.location.search).get('v');
            if (isAgeBlocked && videoId) window.location.href = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;
        }
    }

    function removeAdBanners() {
        const selectors = [
            '#player-ads',
            '#masthead-ad',
            '.ytp-ad-overlay-container',
            '.ytp-ad-image-overlay',
            '.yt-mealbar-promo-renderer',
            '.ytp-featured-product',
            'ytd-merch-shelf-renderer',
            'ytd-in-feed-ad-layout-renderer',
            '.tp-yt-iron-a11y-announcer',
            'ytd-ad-slot-renderer',
            '[class*="sponsored"], [class*="ad-slot"]'
        ];
        selectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                if (/ad|advertisement|sponsored|promo/i.test(el.textContent) ||
                    el.querySelector('[class*="ad"], [class*="sponsor"]') ||
                    el.classList.contains('video-ads')) el.remove();
            });
        });
    }

    function keepVideoPlayingEarly() {
        const video = document.querySelector('video');
        if (!video || video.dataset.keepPlayingEarly) return;
        video.dataset.keepPlayingEarly = 'true';
        const onPause = () => {
            if (video.currentTime <= 3) video.play().catch(() => {});
        };
        video.removeEventListener('pause', onPause);
        video.addEventListener('pause', onPause);
    }

    let debounceTimeout;
    const observer = new MutationObserver(() => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            removeAntiAdblockPopup();
            bypassAgeRestriction();
            skipAds();
            removeAdBanners();
            keepVideoPlayingEarly();
            addDownloadButton();
        }, 50);
    });

    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    removeAntiAdblockPopup();
    bypassAgeRestriction();
    skipAds();
    removeAdBanners();
    keepVideoPlayingEarly();
    addDownloadButton();

    setInterval(() => {
        sponsorSkip();
        skipAds();
        removeAdBanners();
    }, 5000);

})();