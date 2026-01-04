// ==UserScript==
// @name         YouTube Refresh on New Video (robust SPA)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Refresh each newly opened YouTube video (SPA-aware). Refreshes each video once per session.
// @match        *://*.youtube.com/*
// @match        https://youtu.be/*
// @match        https://www.youtube.com/watch*
// @run-at       document-idle
// @grant              none
// @license            MIT
// @downloadURL https://update.greasyfork.org/scripts/553654/YouTube%20Refresh%20on%20New%20Video%20%28robust%20SPA%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553654/YouTube%20Refresh%20on%20New%20Video%20%28robust%20SPA%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const REFRESH_DELAY_MS = 500;
    let lastSeenUrl = location.href;
    let currentVideoId = null;
    let overlayTimeout = null;

    function getVideoIdFromUrl() {
        const p = location.pathname;
        // watch?v=...
        if (p.startsWith('/watch')) return new URLSearchParams(location.search).get('v');
        // /shorts/<id>
        if (p.startsWith('/shorts/')) return p.split('/')[2] || null;
        // youtu.be/<id>
        if (location.hostname === 'youtu.be') return p.slice(1) || null;
        return null;
    }

    function showOverlay(text) {
        removeOverlay();
        const d = document.createElement('div');
        d.id = 'yt-refresh-overlay';
        d.textContent = text;
        Object.assign(d.style, {
            position: 'fixed',
            bottom: '12px',
            left: '12px',
            zIndex: 999999,
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '6px 10px',
            borderRadius: '6px',
            fontSize: '12px',
            fontFamily: 'Arial, sans-serif',
            pointerEvents: 'none'
        });
        document.documentElement.appendChild(d);
        overlayTimeout = setTimeout(removeOverlay, REFRESH_DELAY_MS + 500);
    }

    function removeOverlay() {
        const el = document.getElementById('yt-refresh-overlay');
        if (el) el.remove();
        if (overlayTimeout) {
            clearTimeout(overlayTimeout);
            overlayTimeout = null;
        }
    }

    function scheduleRefreshFor(id) {
        if (!id) return;
        const key = 'yt_refreshed_' + id;
        if (sessionStorage.getItem(key)) {
            // already refreshed this video in this session
            return;
        }
        showOverlay('Refreshing video…');
        setTimeout(() => {
            // mark so we don't loop-refresh after reload
            try { sessionStorage.setItem(key, '1'); } catch (e) {}
            location.reload();
        }, REFRESH_DELAY_MS);
    }

    function checkForVideoChange() {
        const id = getVideoIdFromUrl();
        if (id && id !== currentVideoId) {
            currentVideoId = id;
            scheduleRefreshFor(id);
        }
    }

    // History API overrides (catch push/replace)
    (function () {
        const _push = history.pushState;
        history.pushState = function () {
            _push.apply(this, arguments);
            setTimeout(checkForVideoChange, 200);
        };
        const _replace = history.replaceState;
        history.replaceState = function () {
            _replace.apply(this, arguments);
            setTimeout(checkForVideoChange, 200);
        };
    })();

    // SPA event that YouTube sometimes fires
    window.addEventListener('yt-navigate-finish', () => setTimeout(checkForVideoChange, 200));

    // popstate (back/forward)
    window.addEventListener('popstate', () => setTimeout(checkForVideoChange, 200));

    // MutationObserver fallback for heavy SPA changes
    const mo = new MutationObserver(() => {
        if (location.href !== lastSeenUrl) {
            lastSeenUrl = location.href;
            checkForVideoChange();
        }
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });

    // Poll fallback (very robust, low freq)
    setInterval(() => {
        if (location.href !== lastSeenUrl) {
            lastSeenUrl = location.href;
            checkForVideoChange();
        }
    }, 800);

    // initial check
    setTimeout(checkForVideoChange, 500);
})();