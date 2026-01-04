// ==UserScript==
// @name         GoFile Download Bypass (with banner)
// @namespace    https://greasyfork.org/en/users/1522706-squiggly6279
// @version      1.2
// @description  Redirect gofile share pages (e.g. /d/QGjyK2) to gf.1drv.eu.org (maps /d/<id> -> /<id>). Shows a brief banner "redirected to gf.1drv.eu.org" before redirecting. Opt-out with ?noredirect=1. Preserves trailing path/query/hash and avoids loops.
// @author       you
// @icon         https://www.google.com/s2/favicons?domain=gofile.io
// @match        *://gofile.io/*
// @match        *://www.gofile.io/*
// @match        *://gofile.co/*
// @match        *://www.gofile.co/*
// @match        *://*.gofile.*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551810/GoFile%20Download%20Bypass%20%28with%20banner%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551810/GoFile%20Download%20Bypass%20%28with%20banner%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ---------- CONFIG ----------
    const TARGET_HOST = 'gf.1drv.eu.org'; // destination host
    const IGNORE_PREFIXES = ['/api/', '/public/', '/static/', '/cdn/', '/download?']; // do not redirect these
    const OPT_OUT_PARAM = 'noredirect'; // add ?noredirect=1 to opt out
    const ID_RE = /^[A-Za-z0-9_-]{4,40}$/; // allowed chars for id
    const BANNER_SHOW_MS = 1100; // how long banner is visible before redirect (ms)
    const BANNER_FADE_MS = 300;   // CSS fade duration (ms)
    // --------------------------------

    try {
        if (window.top !== window) return; // run only in top window

        const host = location.hostname;
        if (host === TARGET_HOST) return; // already on target

        // basic allowed host check
        const allowedHosts = ['gofile.io', 'www.gofile.io', 'gofile.co', 'www.gofile.co'];
        if (!allowedHosts.some(h => host === h || host.endsWith('.' + h))) return;

        const url = new URL(location.href);
        const path = location.pathname || '/';
        const lowerPath = path.toLowerCase();

        // Respect opt-out
        if (url.searchParams.has(OPT_OUT_PARAM)) {
            console.debug('GoFile bypass: opt-out param present, skipping redirect');
            return;
        }

        // Ignore common API/static endpoints
        for (const pfx of IGNORE_PREFIXES) {
            if (lowerPath.startsWith(pfx)) {
                console.debug('GoFile bypass: ignoring path prefix', pfx);
                return;
            }
        }

        // helper to build target URL, preserving protocol/query/hash and optional trailingPath
        function buildTargetUrl(id, trailing = '') {
            if (trailing && !trailing.startsWith('/')) trailing = '/' + trailing;
            const q = location.search || '';
            const h = location.hash || '';
            return location.protocol + '//' + TARGET_HOST + '/' + id + trailing + q + h;
        }

        // Prevent looping: sessionStorage per-id marker
        function alreadyRedirected(key) {
            try { return !!sessionStorage.getItem('gofile_redirected_' + key); } catch (e) { return false; }
        }
        function markRedirected(key) {
            try { sessionStorage.setItem('gofile_redirected_' + key, Date.now().toString()); } catch (e) { /* ignore */ }
        }

        // Create and show banner, then call onDone() after timing; returns a Promise
        function showBannerThen(delayMs = BANNER_SHOW_MS) {
            return new Promise((resolve) => {
                try {
                    // banner container
                    const banner = document.createElement('div');
                    banner.setAttribute('id', 'gofile-redirect-banner');
                    banner.textContent = `Redirected to ${TARGET_HOST}`;
                    // minimal inline styles (kept small & unobtrusive)
                    const style = banner.style;
                    style.position = 'fixed';
                    style.top = '16px';
                    style.left = '50%';
                    style.transform = 'translateX(-50%)';
                    style.zIndex = 2147483647; // max z-index to be visible
                    style.padding = '10px 14px';
                    style.fontFamily = 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial';
                    style.fontSize = '13px';
                    style.borderRadius = '10px';
                    style.boxShadow = '0 6px 18px rgba(0,0,0,0.28)';
                    style.background = 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(245,245,245,0.96))';
                    style.color = '#111';
                    style.opacity = '0';
                    style.transition = `opacity ${BANNER_FADE_MS}ms ease, transform ${BANNER_FADE_MS}ms ease`;
                    style.pointerEvents = 'none';
                    // append and trigger fade-in
                    document.documentElement.appendChild(banner);
                    // force reflow then show
                    // eslint-disable-next-line no-unused-expressions
                    banner.offsetHeight;
                    style.opacity = '1';
                    style.transform = 'translateX(-50%) translateY(0)';

                    // after delay, fade out then remove
                    setTimeout(() => {
                        style.opacity = '0';
                        style.transform = 'translateX(-50%) translateY(-6px)';
                        setTimeout(() => {
                            try { banner.remove(); } catch (e) { /* ignore */ }
                            resolve();
                        }, BANNER_FADE_MS + 10);
                    }, delayMs);
                } catch (e) {
                    // If anything fails drawing banner, just resolve immediately
                    resolve();
                }
            });
        }

        // Patterns to detect share id + optional trailing path
        const shareRegexes = [
            /\/d\/([A-Za-z0-9_-]{4,40})(\/.*)?$/i,
            /\/f\/([A-Za-z0-9_-]{4,40})(\/.*)?$/i,
            /\/file\/d\/([A-Za-z0-9_-]{4,40})(\/.*)?$/i,
            /[?&]file=([A-Za-z0-9_-]{4,40})/i,
            /\/([A-Za-z0-9_-]{4,40})(?:\/.*)?$/i
        ];

        for (const re of shareRegexes) {
            const m = location.pathname.match(re) || location.href.match(re);
            if (m && m[1]) {
                const id = m[1];
                const trailing = (m[2] && m[2] !== '/') ? m[2] : '';
                if (!ID_RE.test(id)) continue;
                if (alreadyRedirected(id)) {
                    console.debug('GoFile bypass: already redirected id', id, '- skipping');
                    return;
                }
                const target = buildTargetUrl(id, trailing);
                markRedirected(id);
                console.debug('GoFile bypass: redirecting to', target);
                // show banner then redirect
                showBannerThen().then(() => location.replace(target));
                return;
            }
        }

        // Root redirect (show banner then redirect)
        if (path === '/' || path === '' || path === '/index.html') {
            if (document.referrer && (new URL(document.referrer).hostname === TARGET_HOST)) {
                console.debug('GoFile bypass: referrer is target host, skipping root redirect');
                return;
            }
            const rootTarget = location.protocol + '//' + TARGET_HOST + '/' + (location.search || '') + (location.hash || '');
            console.debug('GoFile bypass: redirecting root to', rootTarget);
            showBannerThen().then(() => location.replace(rootTarget));
            return;
        }

        console.debug('GoFile bypass: no redirect rule matched for', location.href);
    } catch (err) {
        console.error('GoFile bypass script error:', err);
    }
})();
