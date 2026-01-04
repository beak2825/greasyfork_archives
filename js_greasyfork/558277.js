// ==UserScript==
// @name         Neopets Ad Blocker
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Attempts to clear ads and empty space.
// @author       Logan Bell
// @match        *://www.neopets.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558277/Neopets%20Ad%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/558277/Neopets%20Ad%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Inject CSS to override residual spacing and prevent fixed elements from rendering ---
    const style = document.createElement('style');
    style.textContent = `
        /* Hides any elements with the extreme ad z-index that may be missed by JS */
        [style*="z-index: 2147483647"] { display: none !important; }

        /* Hides the bottom sticky banner (backup) */
        .horizontal_sticky { display: none !important; }

        /* Cleans up any margin/padding that could be causing excess blank space */
        body { padding-bottom: 0 !important; margin-bottom: 0 !important; }
    `;
    document.head.appendChild(style);

    // --- Selectors for All Known Ad Elements and their Wrappers ---
    const adSelectors = [
        // 1. The custom video ad tag (main container)
        'avp-video-ad',

        // 2. The bottom horizontal sticky ad container
        'span.horizontal_sticky',

        // 3. Google Ad iframes (Generic, but necessary for all wrappers)
        'iframe[title="3rd party ad content"]',

        // 4. Inner video ad containers
        'div[id^="av_"]',

        // 5. Common Svelte native ad wrapper
        'div.row.svelte-c71f9a'
    ];

    // --- Core Removal Logic ---
    function removeAds() {
        let removedCount = 0;

        // 1. Remove all elements found via direct CSS selectors (Ads and some placeholders)
        adSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                if (el) {
                    el.remove();
                    removedCount++;
                }
            });
        });

        // 2. Aggressive Removal of the Fixed/Floating Ad by High Z-Index
        const highTargetZIndex = '2147483647';
        // Check ALL elements using the '*' selector for maximum coverage
        document.querySelectorAll('*').forEach(el => {
            const style = window.getComputedStyle(el);
            // Must be position:fixed or position:absolute AND have the extreme z-index
            if ((style.position === 'fixed' || style.position === 'absolute') && style.zIndex === highTargetZIndex) {
                el.remove();
                removedCount++;
            }
        });

        // 3. Aggressive Native Ad Removal (adsrvr.org)
        // Climb up 5 parent levels to remove the root wrapper that the ad script might be regenerating.
        document.querySelectorAll('img[src*="adsrvr.org"]').forEach(img => {
            let root = img;
            // Traverse up to 5 times to find the highest ad wrapper
            for (let i = 0; i < 5; i++) {
                if (root.parentElement) {
                    root = root.parentElement;
                }
            }
            if (root && root.tagName === 'DIV') {
                root.remove();
                removedCount++;
            }
        });

        // 4. Final Empty Space Cleanup (Preserves Footer Menu)
        const footer = document.querySelector('.footer-pattern__2020');
        const spaceElement = footer?.nextElementSibling;

        // Check if the element immediately following the footer is a large, empty div.
        if (spaceElement && spaceElement.tagName === 'DIV' && spaceElement.offsetHeight > 50) {
            spaceElement.remove();
            removedCount++;
            console.log('[Ad Remover] Cleaned up residual empty space (large sibling).');
        }


        if (removedCount > 0) {
            console.log(`[Ad Remover] Performed cleanup and removed ${removedCount} element(s).`);
        }
    }

    // --- MutationObserver Setup ---
    // The observer runs the removal logic every time new elements are added to the page.
    const observer = new MutationObserver(removeAds);

    // Watch the entire document body for any child node changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Run immediately on script start
    removeAds();
})();