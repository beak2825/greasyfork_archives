// ==UserScript==
// @name         LiteTube
// @namespace    http://tampermonkey.net/
// @version      2.8.4
// @description  Hide video recommendations from listing and remove annoying auto-mix playlists to reduce lag and improve performance
// @author       Liminality Dreams
// @match        https://www.youtube.com/*
// @icon         https://img.icons8.com/?size=100&id=62852&format=png&color=228BE6
// @grant        none
// @run-at       document-start
// @license GNU 3.0
// @downloadURL https://update.greasyfork.org/scripts/555243/LiteTube.user.js
// @updateURL https://update.greasyfork.org/scripts/555243/LiteTube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let reloadAttempts = new Map();
    const MAX_RELOAD_ATTEMPTS = 3;
    const RELOAD_DELAY = 300;

    const AUTO_MIX_PATTERNS = /^RD/;

    function isAutoMix(listId) {
        return listId && AUTO_MIX_PATTERNS.test(listId);
    }

    function isWatchPage() {
        return window.location.pathname === '/watch';
    }

    function getVideoId() {
        const url = new URL(window.location.href);
        return url.searchParams.get('v');
    }

    function checkAndReload() {
        if (!isWatchPage()) return;

        const url = new URL(window.location.href);
        const listParam = url.searchParams.get('list');
        const videoId = getVideoId();

        if (!listParam || !isAutoMix(listParam)) return;

        const attemptKey = videoId || 'unknown';
        const attempts = reloadAttempts.get(attemptKey) || 0;

        if (attempts >= MAX_RELOAD_ATTEMPTS) {
            reloadAttempts.delete(attemptKey);
            return;
        }

        reloadAttempts.set(attemptKey, attempts + 1);

        url.searchParams.delete('list');
        url.searchParams.delete('start_radio');
        url.searchParams.delete('index');

        const cleanUrl = url.toString();

        if (window.location.href !== cleanUrl) {
            setTimeout(() => {
                window.location.replace(cleanUrl);
            }, RELOAD_DELAY);
        }
    }

    function removeElements(selectors) {
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.remove();
            });
        });
    }

    function removeWatchPageSidebar() {
        if (!isWatchPage()) return;

        removeElements([
            '#secondary',
            'ytd-watch-next-secondary-results-renderer'
        ]);
    }

    function removeBloat() {
        removeElements([
            'ytd-rich-shelf-renderer[is-gaming]',
            'ytd-statement-banner-renderer',
            'ytd-banner-promo-renderer',
            'ytd-compact-promoted-video-renderer',
            'ytd-display-ad-renderer',
            'ytd-promoted-sparkles-web-renderer',
            'ytd-ad-slot-renderer',
            'ytd-in-feed-ad-layout-renderer',
            'ytd-promoted-video-renderer',
            'ytd-playlist-panel-renderer',
            '.ytp-playlist-menu'
        ]);
    }

    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            body[is-watch-page] #secondary,
            body[is-watch-page] ytd-watch-next-secondary-results-renderer,
            ytd-playlist-panel-renderer,
            .ytp-playlist-menu,
            ytd-ad-slot-renderer,
            ytd-in-feed-ad-layout-renderer {
                display: none !important;
                visibility: hidden !important;
            }
        `;
        (document.head || document.documentElement).appendChild(style);
    }

    function init() {
        injectStyles();
        checkAndReload();

        const observer = new MutationObserver(() => {
            removeWatchPageSidebar();
            removeBloat();
        });

        const startObserving = () => {
            if (document.body) {
                observer.observe(document.body, {
                    subtree: true,
                    childList: true
                });
                removeWatchPageSidebar();
                removeBloat();
            } else {
                setTimeout(startObserving, 100);
            }
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', startObserving);
        } else {
            startObserving();
        }

        window.addEventListener('yt-navigate-start', () => {
            const videoId = getVideoId();
            if (videoId) {
                reloadAttempts.delete(videoId);
            }
        });

        window.addEventListener('yt-navigate-finish', () => {
            checkAndReload();
            setTimeout(() => {
                removeWatchPageSidebar();
                removeBloat();
            }, 100);
        });

        window.addEventListener('yt-page-data-updated', () => {
            checkAndReload();
            removeWatchPageSidebar();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();