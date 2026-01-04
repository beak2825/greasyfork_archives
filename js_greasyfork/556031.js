// ==UserScript==
// @name         TikTok – Skip All Live Streams
// @namespace    https://gist.github.com/Carbneth/d502df426d8d6fe045f76f0f69ed8094
// @version      1.0
// @description  Automatically block, hide, and skip TikTok Live Streams
// @author       Carbneth
// @match        https://www.tiktok.com/*
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556031/TikTok%20%E2%80%93%20Skip%20All%20Live%20Streams.user.js
// @updateURL https://update.greasyfork.org/scripts/556031/TikTok%20%E2%80%93%20Skip%20All%20Live%20Streams.meta.js
// ==/UserScript==

(function() {

    /* ============================================================
     *  1. URL-based detection (redirect away from /live/)
     * ============================================================ */
    // Prevent navigation to /live paths without redirecting.
    function preventLiveNavigation() {
        if (location.pathname.startsWith("/live") || location.href.includes("/live/")) {
            // Replace history state to a safe path but keep the user on the same page
            try {
                const safe = '/foryou';
                if (location.pathname !== safe) {
                    history.replaceState(history.state, document.title, safe);
                }
            } catch (e) {
                // ignore
            }
        }
    }
    preventLiveNavigation();


    /* ============================================================
     *  2. Network-layer block for live stream FLV requests
     * ============================================================ */
    // Heuristics to detect live-stream network endpoints. Keep this broad but avoid false positives.
    const isLiveStreamURL = url => {
        if (typeof url !== 'string') return false;
        const u = url.toLowerCase();
        // Typical tiktok live assets contain stream- and .flv or /live/ in path or query
        return (u.includes('tiktokcdn') && u.includes('stream-') && u.includes('.flv'))
            || u.includes('/live/')
            || u.includes('playervod') && u.includes('flv');
    };

    /* Patch fetch */
    // Patch fetch to silently abort or return an empty fake response for live stream URLs.
    const originalFetch = window.fetch.bind(window);
    window.fetch = function(resource, ...rest) {
        const url = typeof resource === 'string' ? resource : (resource && resource.url) || '';
        if (isLiveStreamURL(url)) {
            console.debug('[Userscript] Aborting fetch for live stream:', url);
            // Return a resolved promise with an empty Response-like object to avoid errors in page scripts
            const body = new ReadableStream({
                start(controller) { controller.close(); }
            });
            const response = new Response(body, { status: 204, statusText: 'No Content' });
            return Promise.resolve(response);
        }
        return originalFetch(resource, ...rest);
    };

    /* Patch XHR */
    // Patch XHR open to intercept live endpoints and abort the request silently.
    (function() {
        const origOpen = XMLHttpRequest.prototype.open;
        const origSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
            this.__skip_live_url = !!isLiveStreamURL(url);
            return origOpen.apply(this, arguments);
        };
        XMLHttpRequest.prototype.send = function(body) {
            if (this.__skip_live_url) {
                try {
                    console.debug('[Userscript] Aborting XHR for live stream');
                    this.abort();
                } catch (e) {}
                // Fire readyState=4 with status 204 to mimic a harmless response
                try {
                    Object.defineProperty(this, 'status', { value: 204, writable: true });
                } catch (e) {}
                if (typeof this.onreadystatechange === 'function') {
                    this.readyState = 4;
                    try { this.onreadystatechange(); } catch (e) {}
                }
                return;
            }
            return origSend.apply(this, arguments);
        };
    })();


    /* ============================================================
     *  3. DOM-layer removal of Live tiles and Live feed cards
     * ============================================================ */
    function removeLiveElements(root = document) {
        // Remove anchors that navigate to /live
        const liveLinks = root.querySelectorAll('a[href*="/live"]');
        liveLinks.forEach(el => {
            const card = el.closest('div');
            if (card) card.remove();
            else el.remove();
        });

        // Remove any video elements pointing to flv or containing live attributes
        const liveVideos = root.querySelectorAll('video[src*=".flv"], video[data-live], source[src*=".flv"], a[href*="/live/"]');
        liveVideos.forEach(node => {
            const parent = node.closest('div');
            if (parent) parent.remove(); else node.remove();
        });

        // Hide common live-badge or live-card classes (best-effort)
        const possibleSelectors = ['.live-card', '.live-badge', '[aria-label="Live"]', '.liveItem'];
        possibleSelectors.forEach(sel => {
            root.querySelectorAll(sel).forEach(n => n.remove());
        });
    }

    const observer = new MutationObserver(mutations => {
        preventLiveNavigation();
        mutations.forEach(m => {
            m.addedNodes && m.addedNodes.forEach(n => {
                if (n.nodeType === 1) removeLiveElements(n);
            });
        });
        // Also run a periodic cleanup in case some elements are inserted indirectly
        try { removeLiveElements(); } catch (e) {}
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Prevent clicks on links that would navigate to /live
    document.addEventListener('click', e => {
        const a = e.composedPath && e.composedPath().find(n => n && n.tagName === 'A');
        if (a && a.href && isLiveStreamURL(a.href) || (a && a.getAttribute && a.getAttribute('href') && a.getAttribute('href').includes('/live'))) {
            e.preventDefault();
            e.stopPropagation();
            console.debug('[Userscript] Prevented navigation to live link');
            // Optionally remove the clicked card
            const card = a.closest('div'); if (card) card.remove();
        }
    }, { capture: true, passive: false });

    // Wrap WebSocket and EventSource to prevent live streaming connections
    (function() {
        const OrigWebSocket = window.WebSocket;
        window.WebSocket = function(url, protocols) {
            try {
                if (isLiveStreamURL(url)) {
                    console.debug('[Userscript] Blocking WebSocket to', url);
                    // Return a dummy socket-like object that never opens
                    const dummy = {
                        addEventListener() {},
                        removeEventListener() {},
                        send() { throw new Error('Blocked live socket'); },
                        close() {},
                        readyState: 3
                    };
                    return dummy;
                }
            } catch (e) {}
            return new OrigWebSocket(url, protocols);
        };

        const OrigEventSource = window.EventSource;
        if (OrigEventSource) {
            window.EventSource = function(url, opts) {
                if (isLiveStreamURL(url) || (typeof url === 'string' && url.includes('/live'))) {
                    console.debug('[Userscript] Blocking EventSource to', url);
                    // Return dummy event source
                    return {
                        addEventListener() {},
                        removeEventListener() {},
                        close() {},
                        readyState: 2
                    };
                }
                return new OrigEventSource(url, opts);
            };
        }
    })();

})();
