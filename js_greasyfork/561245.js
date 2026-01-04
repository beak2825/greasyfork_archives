// ==UserScript==
// @name         Google AI Studio | Direct Link Opener
// @namespace    https://greasyfork.org/en/users/1462137-piknockyou
// @version      1.0
// @author       Piknockyou (vibe-coded)
// @license      AGPL-3.0
// @description  Bypasses Google/Vertex redirect URLs - clicks open the actual destination directly
// @match        https://aistudio.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aistudio.google.com
// @grant        GM_xmlhttpRequest
// @connect      vertexaisearch.cloud.google.com
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/561245/Google%20AI%20Studio%20%7C%20Direct%20Link%20Opener.user.js
// @updateURL https://update.greasyfork.org/scripts/561245/Google%20AI%20Studio%20%7C%20Direct%20Link%20Opener.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // =========================================================================
    //  CONFIGURATION
    // =========================================================================
    const CONFIG = Object.freeze({
        DEBUG: false,
        REQUEST_TIMEOUT: 8000,
        MAX_RETRIES: 2,
        RETRY_DELAY_MS: 300,
        SCAN_DEBOUNCE_MS: 50,
    });

    // =========================================================================
    //  STATE MANAGEMENT
    // =========================================================================
    const LinkState = Object.freeze({
        QUEUED: 1,
        RESOLVING: 2,
        RESOLVED: 3,
        FAILED: 4,
    });

    const linkStateMap = new WeakMap();
    const resolvedUrlCache = new Map(); // Cache: originalHref -> finalUrl

    // =========================================================================
    //  UTILITIES
    // =========================================================================
    const log = CONFIG.DEBUG
        ? (...args) => console.log('%c[DirectLink]', 'color: #4285f4; font-weight: bold;', ...args)
        : () => {};

    function debounce(fn, delay) {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn(...args), delay);
        };
    }

    // =========================================================================
    //  URL DETECTION & EXTRACTION
    // =========================================================================
    const REDIRECT_PATTERNS = {
        GOOGLE_URL: /google\.com\/url\?/,
        VERTEX_SEARCH: /vertexaisearch\.cloud\.google\.com/,
    };

    function isRedirectUrl(url) {
        if (!url || typeof url !== 'string') return false;
        return REDIRECT_PATTERNS.GOOGLE_URL.test(url) || REDIRECT_PATTERNS.VERTEX_SEARCH.test(url);
    }

    function extractFromGoogleWrapper(urlString) {
        try {
            const url = new URL(urlString);
            // Try common redirect parameter names
            const destination = url.searchParams.get('q') || url.searchParams.get('url') || url.searchParams.get('u');
            if (destination) {
                return decodeURIComponent(destination);
            }
        } catch (e) {
            log('Failed to parse Google wrapper URL:', e.message);
        }
        return null;
    }

    // =========================================================================
    //  NETWORK RESOLUTION (Vertex Redirects)
    // =========================================================================
    function resolveVertexRedirect(url, retries = CONFIG.MAX_RETRIES) {
        return new Promise((resolve, reject) => {
            const attempt = (remainingRetries) => {
                GM_xmlhttpRequest({
                    method: 'HEAD',
                    url: url,
                    timeout: CONFIG.REQUEST_TIMEOUT,
                    anonymous: true, // Don't send cookies for privacy
                    onload(response) {
                        const finalUrl = response.finalUrl?.trim();
                        if (finalUrl && finalUrl !== url) {
                            log('Vertex resolved:', url, '→', finalUrl);
                            resolve(finalUrl);
                        } else {
                            resolve(url); // No redirect occurred
                        }
                    },
                    onerror(error) {
                        if (remainingRetries > 0) {
                            log(`Retry (${remainingRetries} left):`, url);
                            setTimeout(() => attempt(remainingRetries - 1), CONFIG.RETRY_DELAY_MS);
                        } else {
                            log('Resolution failed:', url, error);
                            reject(new Error('Network request failed'));
                        }
                    },
                    ontimeout() {
                        if (remainingRetries > 0) {
                            log(`Timeout, retry (${remainingRetries} left):`, url);
                            setTimeout(() => attempt(remainingRetries - 1), CONFIG.RETRY_DELAY_MS);
                        } else {
                            log('Resolution timed out:', url);
                            reject(new Error('Request timed out'));
                        }
                    },
                });
            };
            attempt(retries);
        });
    }

    // =========================================================================
    //  MAIN RESOLUTION PIPELINE
    // =========================================================================
    async function resolveRedirectChain(originalUrl) {
        // Check cache first
        if (resolvedUrlCache.has(originalUrl)) {
            return resolvedUrlCache.get(originalUrl);
        }

        let currentUrl = originalUrl;

        // Step 1: Unwrap google.com/url wrapper
        if (REDIRECT_PATTERNS.GOOGLE_URL.test(currentUrl)) {
            const extracted = extractFromGoogleWrapper(currentUrl);
            if (extracted) {
                currentUrl = extracted;
                log('Unwrapped Google URL:', originalUrl, '→', currentUrl);
            }
        }

        // Step 2: Resolve Vertex redirect if present
        if (REDIRECT_PATTERNS.VERTEX_SEARCH.test(currentUrl)) {
            try {
                currentUrl = await resolveVertexRedirect(currentUrl);
            } catch (e) {
                // On failure, return best effort (the unwrapped URL)
                log('Vertex resolution failed, using unwrapped URL');
            }
        }

        // Cache the result
        if (currentUrl !== originalUrl) {
            resolvedUrlCache.set(originalUrl, currentUrl);
        }

        return currentUrl;
    }

    // =========================================================================
    //  LINK PROCESSING
    // =========================================================================
    async function processLink(anchor) {
        const originalHref = anchor.href;

        if (!originalHref || !isRedirectUrl(originalHref)) {
            return;
        }

        // Skip if already being processed or resolved
        const currentState = linkStateMap.get(anchor);
        if (currentState === LinkState.RESOLVING || currentState === LinkState.RESOLVED) {
            return;
        }

        linkStateMap.set(anchor, LinkState.RESOLVING);

        // Store original href for reference
        if (!anchor.dataset.originalHref) {
            anchor.dataset.originalHref = originalHref;
        }

        try {
            const finalUrl = await resolveRedirectChain(originalHref);

            if (finalUrl && finalUrl !== originalHref) {
                anchor.href = finalUrl;
                anchor.dataset.resolved = 'true';
                linkStateMap.set(anchor, LinkState.RESOLVED);
                log('Link updated:', originalHref.slice(0, 60) + '...', '→', finalUrl);
            } else {
                linkStateMap.set(anchor, LinkState.RESOLVED);
            }
        } catch (e) {
            linkStateMap.set(anchor, LinkState.FAILED);
            log('Processing failed for:', originalHref);
        }
    }

    function scanDocument() {
        const selector = [
            'a[href*="google.com/url?"]',
            'a[href*="vertexaisearch.cloud.google.com"]',
        ].join(', ');

        const anchors = document.querySelectorAll(selector);

        anchors.forEach((anchor) => {
            if (!linkStateMap.has(anchor)) {
                linkStateMap.set(anchor, LinkState.QUEUED);
                processLink(anchor);
            }
        });

        log(`Scanned document, found ${anchors.length} redirect links`);
    }

    const debouncedScan = debounce(scanDocument, CONFIG.SCAN_DEBOUNCE_MS);

    // =========================================================================
    //  CLICK INTERCEPTION (Fallback for unresolved links)
    // =========================================================================
    async function handleLinkClick(event) {
        const anchor = event.target.closest('a');
        if (!anchor) return;

        const href = anchor.href;
        if (!isRedirectUrl(href)) return;

        // If already resolved, let default behavior proceed
        if (anchor.dataset.resolved === 'true') {
            log('Click: using pre-resolved href');
            return;
        }

        // Intercept and resolve on-the-fly
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        log('Click intercepted, resolving:', href.slice(0, 60) + '...');

        // Visual feedback
        const originalCursor = anchor.style.cursor;
        const originalOpacity = anchor.style.opacity;
        anchor.style.cursor = 'progress';
        anchor.style.opacity = '0.6';

        try {
            const finalUrl = await resolveRedirectChain(href);

            // Restore visual state
            anchor.style.cursor = originalCursor;
            anchor.style.opacity = originalOpacity;

            // Update the href for future clicks
            if (finalUrl !== href) {
                anchor.href = finalUrl;
                anchor.dataset.resolved = 'true';
                linkStateMap.set(anchor, LinkState.RESOLVED);
            }

            // Navigate
            const newTab = event.ctrlKey || event.metaKey || event.button === 1;
            if (newTab) {
                window.open(finalUrl, '_blank', 'noopener,noreferrer');
            } else {
                window.location.href = finalUrl;
            }
        } catch (e) {
            // Restore visual state
            anchor.style.cursor = originalCursor;
            anchor.style.opacity = originalOpacity;

            // Fallback: try synchronous extraction
            const extracted = extractFromGoogleWrapper(href);
            const fallbackUrl = extracted || href;

            log('Resolution failed, using fallback:', fallbackUrl);

            const newTab = event.ctrlKey || event.metaKey || event.button === 1;
            if (newTab) {
                window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
            } else {
                window.location.href = fallbackUrl;
            }
        }
    }

    // =========================================================================
    //  MUTATION OBSERVER (Dynamic content)
    // =========================================================================
    function setupObserver() {
        const observer = new MutationObserver((mutations) => {
            let shouldScan = false;

            for (const mutation of mutations) {
                if (mutation.type !== 'childList') continue;

                for (const node of mutation.addedNodes) {
                    if (node.nodeType !== Node.ELEMENT_NODE) continue;

                    // Check if the node itself is a redirect link
                    if (node.nodeName === 'A' && isRedirectUrl(node.href)) {
                        shouldScan = true;
                        break;
                    }

                    // Check if the node contains redirect links
                    if (node.querySelector?.('a[href*="google.com/url?"], a[href*="vertexaisearch.cloud.google.com"]')) {
                        shouldScan = true;
                        break;
                    }
                }

                if (shouldScan) break;
            }

            if (shouldScan) {
                debouncedScan();
            }
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
        });

        log('MutationObserver initialized');
        return observer;
    }

    // =========================================================================
    //  INITIALIZATION
    // =========================================================================
    function init() {
        log('Initializing Direct Link Opener');

        // Register click handler in capture phase for early interception
        document.addEventListener('click', handleLinkClick, { capture: true, passive: false });
        document.addEventListener('auxclick', handleLinkClick, { capture: true, passive: false }); // Middle-click

        // Setup observer immediately (before DOM is ready)
        setupObserver();

        // Initial scan when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', scanDocument, { once: true });
        } else {
            scanDocument();
        }

        // Also scan after full load (catches lazy-loaded content)
        window.addEventListener('load', () => setTimeout(scanDocument, 500), { once: true });

        log('Initialization complete');
    }

    init();
})();