// ==UserScript==
// @name         YouTube: Reload Once Per Video to bypass Anti-Adblock
// @namespace    https://tampermonkey.net/
// @version      1.0
// @description  Reload each YouTube watch?v=... once (per tab/session) and prevent the video from starting before the reload.
// @author       ysfwh
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @license      Public Domain
// @downloadURL https://update.greasyfork.org/scripts/550634/YouTube%3A%20Reload%20Once%20Per%20Video%20to%20bypass%20Anti-Adblock.user.js
// @updateURL https://update.greasyfork.org/scripts/550634/YouTube%3A%20Reload%20Once%20Per%20Video%20to%20bypass%20Anti-Adblock.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Helper: get ?v= id from a URL (handles relative URLs too)
    function getVideoIdFromUrl(u) {
        try {
            const url = new URL(u, location.origin);
            return url.pathname === '/watch' ? url.searchParams.get('v') : null;
        } catch (e) {
            return null;
        }
    }

    // Block autoplay for videos that are on-first-open (key not set yet)
    const originalPlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
        try {
            const vid = getVideoIdFromUrl(location.href);
            if (vid && !sessionStorage.getItem('ytFirstLoad_' + vid)) {
                // Block automatic play on first-open before we reload.
                // Returning a resolved promise avoids uncaught promise rejections.
                console.debug('TM: blocking autoplay for video', vid);
                return Promise.resolve();
            }
        } catch (e) {
            // fall through to normal play on errors
        }
        return originalPlay.apply(this, arguments);
    };

    // If this video hasn't been "first-loaded" in this tab/session, mark it and force a full reload.
    function doReloadIfNeededForUrl(u) {
        const vid = getVideoIdFromUrl(u);
        if (!vid) return false;
        const key = 'ytFirstLoad_' + vid;
        if (!sessionStorage.getItem(key)) {
            try { sessionStorage.setItem(key, '1'); } catch (e) { /* ignore */ }
            console.info('TM: first open for', vid, '- forcing full reload');
            // Try to reload immediately. location.replace avoids adding an extra history entry.
            try { location.replace(u); } catch (e) { setTimeout(() => location.replace(u), 0); }
            return true;
        }
        return false;
    }

    // Intercept SPA navigation via history API so we can react before the player starts.
    (function patchHistory() {
        const _push = history.pushState;
        history.pushState = function (state, title, url) {
            const res = _push.apply(this, arguments);
            // url may be relative -> construct absolute
            try {
                const full = url ? new URL(url, location.origin).href : location.href;
                // small async tick to ensure URL already updated in location for other listeners,
                // but we reload immediately within doReloadIfNeededForUrl if needed
                setTimeout(() => doReloadIfNeededForUrl(full), 0);
            } catch (e) {
                setTimeout(() => doReloadIfNeededForUrl(location.href), 0);
            }
            return res;
        };

        const _replace = history.replaceState;
        history.replaceState = function (state, title, url) {
            const res = _replace.apply(this, arguments);
            try {
                const full = url ? new URL(url, location.origin).href : location.href;
                setTimeout(() => doReloadIfNeededForUrl(full), 0);
            } catch (e) {
                setTimeout(() => doReloadIfNeededForUrl(location.href), 0);
            }
            return res;
        };

        window.addEventListener('popstate', () => doReloadIfNeededForUrl(location.href));
    })();

    // Also listen for YouTube's navigation events (extra safety)
    window.addEventListener('yt-navigate-start', (ev) => {
        // the event may not expose the URL consistently; fall back to location.href
        try {
            const maybeUrl = ev?.detail?.url || ev?.detail?.command?.url || location.href;
            doReloadIfNeededForUrl(maybeUrl);
        } catch (e) {
            doReloadIfNeededForUrl(location.href);
        }
    });

    // Check the current load (initial page load)
    doReloadIfNeededForUrl(location.href);
})();
