// ==UserScript==
// @name         HyperLite Web Accelerator – Extreme Edition
// @namespace    https://tampermonkey.net/
// @version      2.0.0
// @license      MIT
// @description  Ultra-light, privacy-first web accelerator for very slow internet. Blocks trackers, IP beacons, heavy embeds, optimizes images, reduces fingerprinting, and adapts automatically.
// @author       Domopremo (Remake) — Original concept by Super Fast Load author
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563882/HyperLite%20Web%20Accelerator%20%E2%80%93%20Extreme%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/563882/HyperLite%20Web%20Accelerator%20%E2%80%93%20Extreme%20Edition.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* =========================
       STORAGE & MODES
    ========================== */

    const SITE_KEY = 'hyperlite:disable:' + location.hostname;
    if (localStorage.getItem(SITE_KEY) === '1') return;

    const MODES = {
        BALANCED: 0,
        SLOW: 1,
        EXTREME: 2
    };

    let MODE = MODES.BALANCED;

    const conn = navigator.connection;
    if (conn?.saveData || conn?.effectiveType?.includes('2g')) {
        MODE = MODES.SLOW;
    }
    if (conn?.effectiveType === 'slow-2g') {
        MODE = MODES.EXTREME;
    }

    /* =========================
       CONFIG
    ========================== */

    const CONFIG = {
        BLOCK_FONTS: MODE >= MODES.SLOW,
        BLOCK_PREFETCH: true,
        STOP_AUTOPLAY: MODE >= MODES.SLOW,
        IMAGE_OPTIMIZE: MODE >= MODES.SLOW,
        LAZY_EMBEDS: MODE >= MODES.SLOW,
        FINGERPRINT_REDUCE: MODE === MODES.EXTREME
    };

    let bytesSaved = 0;
    const processed = new WeakSet();

    /* =========================
       TRACKERS & BEACONS
    ========================== */

    const TRACKERS = [
        'google-analytics.com',
        'googletagmanager.com',
        'doubleclick.net',
        'facebook.com/tr',
        'connect.facebook.net',
        'clarity.ms',
        'hotjar.com',
        'sentry.io',
        'mixpanel.com',
        'segment.com',
        'fullstory.com'
    ];

    const isTracker = url => {
        try {
            const h = new URL(url, location.origin).hostname;
            return TRACKERS.some(t => h.endsWith(t));
        } catch {
            return false;
        }
    };

    /* =========================
       FINGERPRINT REDUCTION
    ========================== */

    if (CONFIG.FINGERPRINT_REDUCE) {
        Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 2 });
        Object.defineProperty(navigator, 'deviceMemory', { get: () => 2 });
        Object.defineProperty(navigator, 'plugins', { get: () => [] });
        Object.defineProperty(navigator, 'mimeTypes', { get: () => [] });
    }

    /* =========================
       BEACON BLOCKING
    ========================== */

    const origBeacon = navigator.sendBeacon;
    navigator.sendBeacon = function (url, data) {
        if (isTracker(url)) {
            bytesSaved += data?.size || 512;
            return false;
        }
        return origBeacon.call(this, url, data);
    };

    /* =========================
       CORE OBSERVER
    ========================== */

    const observer = new MutationObserver(mutations => {
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                if (!(node instanceof HTMLElement)) continue;
                if (processed.has(node)) continue;
                processed.add(node);

                const src = node.src || node.href || '';

                // Trackers
                if (src && isTracker(src)) {
                    bytesSaved += 20000;
                    node.remove();
                    continue;
                }

                // Fonts
                if (CONFIG.BLOCK_FONTS && /fonts\.googleapis\.com|\.woff2?$/.test(src)) {
                    bytesSaved += 50000;
                    node.remove();
                    continue;
                }

                // Prefetch
                if (node.tagName === 'LINK' && CONFIG.BLOCK_PREFETCH && node.rel === 'prefetch') {
                    node.remove();
                }

                // Autoplay
                if (CONFIG.STOP_AUTOPLAY && (node.tagName === 'VIDEO' || node.tagName === 'AUDIO')) {
                    node.autoplay = false;
                    node.preload = 'metadata';
                }

                // Image optimization
                if (CONFIG.IMAGE_OPTIMIZE && node.tagName === 'IMG') {
                    node.loading = 'lazy';
                    node.decoding = 'async';
                    node.removeAttribute('srcset');
                }

                // Lazy embeds
                if (CONFIG.LAZY_EMBEDS && node.tagName === 'IFRAME') {
                    const placeholder = document.createElement('button');
                    placeholder.textContent = 'Load content';
                    placeholder.style.cssText = 'padding:6px;font-size:12px';
                    placeholder.onclick = () => node.replaceWith(node);
                    node.replaceWith(placeholder);
                }
            }
        }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });

    /* =========================
       UI TOGGLE
    ========================== */

    const toggle = document.createElement('button');
    toggle.textContent = '⚡ HyperLite';
    toggle.style.cssText =
        'position:fixed;bottom:10px;right:10px;z-index:99999;font-size:12px;padding:6px;';
    toggle.onclick = () => {
        localStorage.setItem(SITE_KEY, '1');
        location.reload();
    };
    document.documentElement.appendChild(toggle);

    /* =========================
       CLEANUP & LOGGING
    ========================== */

    window.addEventListener('load', () => {
        setTimeout(() => observer.disconnect(), 3000);
        console.log(
            `[HyperLite] Mode: ${Object.keys(MODES)[MODE]} | ~${Math.round(bytesSaved / 1024)} KB saved`
        );
    });

})();
