// ==UserScript==
// @name         IPA → SideStore (iOS)
// @namespace    sharmanhall
// @version      1.6
// @description  Redirect IPA download links to SideStore so you can install apps directly without saving to Files first.
// @author       sharmanhall
// @match        *://*/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/550410/IPA%20%E2%86%92%20SideStore%20%28iOS%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550410/IPA%20%E2%86%92%20SideStore%20%28iOS%29.meta.js
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

    // Known CDN/release domains that serve IPAs
    const ipaCDNHosts = [
        'github.com',
        'objects.githubusercontent.com',
        'github-releases.githubusercontent.com',
        'raw.githubusercontent.com',
        'cdn.discordapp.com',
        'media.discordapp.net',
        'dl.dropboxusercontent.com',
        'drive.google.com',
        'cdn.altstore.io',
        'ish.app'
    ];

    function isIPAURL(u) {
        try {
            const url = (u instanceof URL) ? u : new URL(u, location.href);
            const pathname = url.pathname.toLowerCase();
            const fullUrl = url.toString().toLowerCase();
            const hostname = url.hostname.toLowerCase();
            
            // Direct .ipa extension
            if (pathname.endsWith('.ipa')) return true;
            
            // GitHub releases: /releases/download/*/something.ipa
            if (hostname.includes('github') && /\/releases\/download\/[^/]+\/[^/]+\.ipa/i.test(pathname)) return true;
            
            // GitHub raw/objects URLs with .ipa
            if ((hostname.includes('githubusercontent.com') || hostname.includes('github')) && pathname.includes('.ipa')) return true;
            
            // CDN URLs with ?filename=app.ipa or &file=app.ipa patterns
            if (/[?&][^=]*=.*\.ipa(&|$)/i.test(fullUrl)) return true;
            
            // Discord CDN attachments ending in .ipa
            if (hostname.includes('discord') && pathname.includes('.ipa')) return true;
            
            return false;
        } catch {
            return false;
        }
    }

    // Check if element or ancestors have IPA-related download hints
    function hasIPADownloadHint(el) {
        if (!el) return false;
        
        // Check for download attribute with .ipa
        const download = el.getAttribute?.('download');
        if (download && download.toLowerCase().endsWith('.ipa')) return true;
        
        // Check text content for .ipa mentions (aggressive)
        const text = el.textContent?.toLowerCase() || '';
        if (text.includes('.ipa') && (text.includes('download') || text.includes('install'))) return true;
        
        // Check aria-label, title
        const label = el.getAttribute?.('aria-label')?.toLowerCase() || '';
        const title = el.getAttribute?.('title')?.toLowerCase() || '';
        if ((label + title).includes('.ipa')) return true;
        
        return false;
    }

    function buildSideStoreUrl(originalUrl) {
        const url = new URL(originalUrl, location.href);
        // SideStore expects: sidestore://install?url=<URL_ENCODED_IPA_URL>
        return `sidestore://install?url=${encodeURIComponent(url.toString())}`;
    }

    function redirectToSideStore(u) {
        const ssUrl = buildSideStoreUrl(u);
        log('Redirecting to SideStore:', ssUrl);
        location.replace(ssUrl);
    }

    if (!isIOS) {
        log('Not iOS, script disabled.');
        return;
    }

    // === AGGRESSIVE EARLY INTERCEPT ===
    // Try to catch direct IPA URL navigation before Safari's download dialog
    if (REWRITE_IPA_LINKS && isIPAURL(location.href)) {
        log('Direct IPA URL detected, handing off to SideStore immediately...');
        // Use both methods for maximum chance of interception
        redirectToSideStore(location.href);
        // Also try stopping the page load
        if (window.stop) window.stop();
        return;
    }

    // Helper to resolve the actual target URL
    function resolveTargetHref(a) {
        // Some sites store expanded/real URLs in data attributes
        const dataAttrs = ['expandedUrl', 'expanded-url', 'url', 'href', 'downloadUrl', 'download-url', 'fileUrl', 'file-url'];
        for (const attr of dataAttrs) {
            const val = a?.dataset?.[attr] || a?.getAttribute?.(`data-${attr}`);
            if (val && isIPAURL(val)) return val;
        }
        
        // Check download attribute (often contains filename hints)
        const download = a?.getAttribute?.('download');
        if (download && download.toLowerCase().endsWith('.ipa') && a?.href) {
            return a.href;
        }
        
        return a?.href || '';
    }

    // === GLOBAL CLICK CAPTURE (highest priority) ===
    if (REWRITE_IPA_LINKS) {
        document.addEventListener('click', (e) => {
            // Find any clickable element, not just direct anchors
            let target = e.target;
            let a = target?.closest?.('a[href], a[download], [role="link"]');
            
            // Also check if we clicked a button/span inside an anchor
            if (!a && target) {
                let parent = target.parentElement;
                for (let i = 0; i < 5 && parent; i++) {
                    if (parent.tagName === 'A' && (parent.href || parent.download)) {
                        a = parent;
                        break;
                    }
                    parent = parent.parentElement;
                }
            }
            
            if (!a) return;

            const targetHref = resolveTargetHref(a);
            const isIPA = isIPAURL(targetHref) || hasIPADownloadHint(a);
            
            if (!isIPA) return;
            
            // If we detected IPA via hint but URL doesn't look like IPA, still use the href
            const finalUrl = isIPAURL(targetHref) ? targetHref : a.href;
            if (!finalUrl) return;

            try {
                log('Intercepted IPA click:', finalUrl);
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                redirectToSideStore(finalUrl);
            } catch (err) {
                log('Error redirecting (global):', err);
            }
        }, { capture: true, passive: false });
        
        // Also intercept mousedown for even earlier capture
        document.addEventListener('mousedown', (e) => {
            const a = e.target?.closest?.('a[href], a[download]');
            if (!a) return;
            
            const targetHref = resolveTargetHref(a);
            if (!isIPAURL(targetHref) && !hasIPADownloadHint(a)) return;
            
            // Mark for interception
            a.dataset.ssIpaIntercept = '1';
        }, { capture: true, passive: true });
        
        // Intercept touchstart for iOS
        document.addEventListener('touchstart', (e) => {
            const a = e.target?.closest?.('a[href], a[download]');
            if (!a) return;
            
            const targetHref = resolveTargetHref(a);
            if (!isIPAURL(targetHref) && !hasIPADownloadHint(a)) return;
            
            a.dataset.ssIpaIntercept = '1';
        }, { capture: true, passive: true });
    }

    // === PER-ANCHOR HOOK + OBSERVER ===
    if (REWRITE_IPA_LINKS) {
        const processAnchor = (a) => {
            if (!a) return;
            if (a.dataset.ssIpa === '1') return;

            const targetHref = resolveTargetHref(a);
            const isIPA = isIPAURL(targetHref) || hasIPADownloadHint(a);
            if (!isIPA) return;

            const handler = (e) => {
                const finalUrl = isIPAURL(targetHref) ? targetHref : a.href;
                if (!finalUrl) return;
                
                try {
                    log('Hooked handler intercepted:', finalUrl);
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    redirectToSideStore(finalUrl);
                } catch (err) {
                    log('Error redirecting (anchor):', err);
                }
            };

            a.addEventListener('click', handler, { capture: true, passive: false });
            a.addEventListener('touchend', handler, { capture: true, passive: false });
            a.dataset.ssIpa = '1';
            log('Hooked IPA link:', targetHref || a.href);
        };

        // Initial pass - broader selector
        document.querySelectorAll('a[href], a[download], [role="link"][href]').forEach(processAnchor);

        // Observe dynamically-added links
        const mo = new MutationObserver((muts) => {
            for (const m of muts) {
                for (const node of m.addedNodes) {
                    if (node.nodeType !== 1) continue;
                    if (node.tagName === 'A') processAnchor(node);
                    else node.querySelectorAll?.('a[href], a[download]').forEach(processAnchor);
                }
            }
        });
        mo.observe(document.documentElement, { childList: true, subtree: true });
    }

    // === INTERCEPT BEFOREUNLOAD FOR DOWNLOAD NAVIGATIONS ===
    // This is a last-ditch effort to catch navigations to IPA URLs
    window.addEventListener('beforeunload', (e) => {
        // Can't reliably get the destination URL here, but logging for debug
        log('Page unloading...');
    });

    log('IPA → SideStore script loaded (aggressive mode).');
})();