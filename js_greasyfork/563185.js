// ==UserScript==
// @name         Web Anti-Nerv All-in-One
// @namespace    https://example.com/web-anti-nerv
// @version      1.0.0
// @description  Entfernt Cookie-Banner, Popups, Overlays, erzwingt Rechtsklick, stoppt Infinite Scroll, entschlackt YouTube, entfernt AMP & Tracking-Links.
// @match        *://*/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563185/Web%20Anti-Nerv%20All-in-One.user.js
// @updateURL https://update.greasyfork.org/scripts/563185/Web%20Anti-Nerv%20All-in-One.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CONFIG = {
        removeCookieBanners: true,
        removeOverlays: true,
        forceRightClick: true,
        stopInfiniteScroll: true,
        cleanYouTube: true,
        cleanLinks: true
    };

    // -------------------------------
    // Cookie-Banner entfernen
    // -------------------------------
    function removeCookieBanners() {
        const keywords = ['cookie', 'consent', 'gdpr', 'privacy'];
        document.querySelectorAll('div, section, aside').forEach(el => {
            const text = (el.innerText || '').toLowerCase();
            if (keywords.some(k => text.includes(k)) && el.offsetHeight > 50) {
                el.remove();
            }
        });
    }

    // -------------------------------
    // Popups & Overlays entfernen
    // -------------------------------
    function removeOverlays() {
        document.body.style.overflow = 'auto';
        document.querySelectorAll('*').forEach(el => {
            const style = getComputedStyle(el);
            if (
                (style.position === 'fixed' || style.position === 'sticky') &&
                parseInt(style.zIndex, 10) > 1000
            ) {
                el.remove();
            }
        });
    }

    // -------------------------------
    // Rechtsklick erzwingen
    // -------------------------------
    function forceRightClick() {
        const events = ['contextmenu', 'selectstart', 'mousedown', 'mouseup', 'copy', 'cut'];
        events.forEach(evt => {
            document.addEventListener(evt, e => e.stopPropagation(), true);
        });
        document.oncontextmenu = null;
        document.onselectstart = null;
    }

    // -------------------------------
    // Infinite Scroll stoppen
    // -------------------------------
    function stopInfiniteScroll() {
        let lastScrollHeight = document.body.scrollHeight;
        setInterval(() => {
            if (document.body.scrollHeight !== lastScrollHeight) {
                document.body.style.overflow = 'auto';
                lastScrollHeight = document.body.scrollHeight;
            }
        }, 1000);
    }

    // -------------------------------
    // YouTube entschlacken
    // -------------------------------
    function cleanYouTube() {
        if (!location.hostname.includes('youtube.com')) return;

        const selectors = [
            'ytd-rich-section-renderer', // Shorts
            'ytd-reel-shelf-renderer',
            '#related',
            'ytd-merch-shelf-renderer'
        ];

        selectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => el.remove());
        });
    }

    // -------------------------------
    // AMP & Tracking-Links säubern
    // -------------------------------
    function cleanLinks() {
        document.querySelectorAll('a[href]').forEach(a => {
            let url = a.getAttribute('href');

            if (!url) return;

            // Google Redirects
            if (url.includes('/url?q=')) {
                const match = url.match(/url\\?q=([^&]+)/);
                if (match) a.href = decodeURIComponent(match[1]);
            }

            // AMP
            if (url.includes('/amp/')) {
                a.href = url.replace('/amp/', '/');
            }
        });
    }

    // -------------------------------
    // Initial Run
    // -------------------------------
    function runAll() {
        if (CONFIG.removeCookieBanners) removeCookieBanners();
        if (CONFIG.removeOverlays) removeOverlays();
        if (CONFIG.forceRightClick) forceRightClick();
        if (CONFIG.stopInfiniteScroll) stopInfiniteScroll();
        if (CONFIG.cleanYouTube) cleanYouTube();
        if (CONFIG.cleanLinks) cleanLinks();
    }

    runAll();

    // -------------------------------
    // DOM Änderungen beobachten
    // -------------------------------
    const observer = new MutationObserver(runAll);
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();
