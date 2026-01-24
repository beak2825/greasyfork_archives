// ==UserScript==
// @name         IPA → SideStore (iOS)
// @namespace    sharmanhall
// @version      1.1
// @description  Redirect IPA download links to SideStore so you can install apps directly without saving to Files first.
// @author       sharmanhall
// @match        *://*/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/563736/IPA%20%E2%86%92%20SideStore%20%28iOS%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563736/IPA%20%E2%86%92%20SideStore%20%28iOS%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ---- prefs ----
    const VERBOSE = true;                      // set false to quiet logs
    const REWRITE_IPA_LINKS = true;            // intercept <a> links to .ipa files

    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    function log(...args) {
        if (VERBOSE) console.log('[IPA-SideStore]', ...args);
    }

    function isIPAURL(u) {
        try {
            const url = (u instanceof URL) ? u : new URL(u, location.href);
            // Check if pathname ends with .ipa (case-insensitive)
            // Also check for .ipa in query params (some CDNs use ?file=something.ipa)
            const pathname = url.pathname.toLowerCase();
            const fullUrl = url.toString().toLowerCase();
            
            if (pathname.endsWith('.ipa')) return true;
            // Handle CDN URLs like ?filename=app.ipa or &file=app.ipa
            if (/[?&][^=]*=.*\.ipa(&|$)/i.test(fullUrl)) return true;
            
            return false;
        } catch {
            return false;
        }
    }

    function buildSideStoreUrl(originalUrl) {
        const url = new URL(originalUrl, location.href);
        // SideStore expects: sidestore://install?url=<URL_ENCODED_IPA_URL>
        return `sidestore://install?url=${encodeURIComponent(url.toString())}`;
    }

    function redirectToSideStore(u) {
        const ssUrl = buildSideStoreUrl(u);
        log('Redirecting to SideStore:', ssUrl);
        location.replace(ssUrl); // avoid extra history entries
    }

    if (!isIOS) {
        log('Not iOS, script disabled.');
        return;
    }

    // Auto-handoff: if you land directly on an IPA URL, send to SideStore immediately
    if (REWRITE_IPA_LINKS && isIPAURL(location.href)) {
        log('Direct IPA URL detected, handing off to SideStore...');
        redirectToSideStore(location.href);
        return;
    }

    // Helper to resolve the actual target URL (handles data attributes, redirects, etc.)
    function resolveTargetHref(a) {
        // Some sites store expanded/real URLs in data attributes
        const expanded = a?.dataset?.expandedUrl || 
                         a?.getAttribute?.('data-expanded-url') ||
                         a?.dataset?.url ||
                         a?.getAttribute?.('data-url') ||
                         a?.dataset?.href ||
                         a?.getAttribute?.('data-href');
        if (expanded && isIPAURL(expanded)) return expanded;
        
        // Check download attribute (often contains filename hints)
        const download = a?.getAttribute?.('download');
        if (download && download.toLowerCase().endsWith('.ipa') && a?.href) {
            return a.href;
        }
        
        return a?.href || '';
    }

    // 1) Global capture for all clicks (robust for dynamic UIs like Discord/Telegram)
    if (REWRITE_IPA_LINKS) {
        document.addEventListener('click', (e) => {
            const a = e.target?.closest?.('a[href], a[download]');
            if (!a) return;

            const targetHref = resolveTargetHref(a);
            if (!isIPAURL(targetHref)) return;

            try {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                redirectToSideStore(targetHref);
            } catch (err) {
                log('Error redirecting (global):', err);
            }
        }, { capture: true, passive: false });
    }

    // 2) Per-anchor hook + MutationObserver (catches dynamically added links)
    if (REWRITE_IPA_LINKS) {
        const processAnchor = (a) => {
            if (!a || !a.href) return;
            if (a.dataset.ssIpa === '1') return; // double-hook guard

            const targetHref = resolveTargetHref(a);
            if (!isIPAURL(targetHref)) return;

            const handler = (e) => {
                try {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    redirectToSideStore(targetHref);
                } catch (err) {
                    log('Error redirecting (anchor):', err);
                }
            };

            a.addEventListener('click', handler, { capture: true, passive: false });
            a.dataset.ssIpa = '1';
            log('Hooked IPA link:', targetHref);
        };

        // Initial pass
        document.querySelectorAll('a[href], a[download]').forEach(processAnchor);

        // Observe dynamically-added links (SPAs, infinite scroll, chat apps, etc.)
        const mo = new MutationObserver((muts) => {
            for (const m of muts) {
                for (const node of m.addedNodes) {
                    if (node.nodeType !== 1) continue;
                    if (node.tagName === 'A' && (node.href || node.download)) processAnchor(node);
                    else node.querySelectorAll?.('a[href], a[download]').forEach(processAnchor);
                }
            }
        });
        mo.observe(document.documentElement, { childList: true, subtree: true });
    }

    log('IPA → SideStore script loaded.');
})();