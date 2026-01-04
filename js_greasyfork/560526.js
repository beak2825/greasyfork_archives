// ==UserScript==
// @name         Tokopedia Full Product Title Display or Tooltip
// @namespace    http://tampermonkey.net/
// @version      1.7
// @license MIT
// @description  Toggle between showing full product titles inline or tooltips on hover (including on images) for truncated items on Tokopedia search, product, and wishlist pages. Auto-expands main title on product detail pages.
// @author       Grok
// @match        https://www.tokopedia.com/search*
// @match        https://www.tokopedia.com/*/*
// @match        https://www.tokopedia.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/560526/Tokopedia%20Full%20Product%20Title%20Display%20or%20Tooltip.user.js
// @updateURL https://update.greasyfork.org/scripts/560526/Tokopedia%20Full%20Product%20Title%20Display%20or%20Tooltip.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Persistent setting: true = full display mode, false = tooltip mode
    let fullDisplay = GM_getValue('fullDisplay', false);

    // Selectors for search/recommendations titles (original)
    const searchTitleContainerSelector = 'div[class*="SzIL"]'; // Title wrapper (e.g., SzILjt4fxHUFNVT48ZPhHA==)
    const searchTitleSelector = `${searchTitleContainerSelector} > span[class*="=="]`; // Span inside (e.g., +tnoqZhn89+NHUA43BpiJg==)

    // Selectors for wishlist titles (new, from provided HTML)
    const wishlistTitleSelector = 'div[class*="prd_link-product-name"]'; // e.g., prd_link-product-name css-pq4vhy

    // Combined title selector for both page types
    const combinedTitleSelector = `${searchTitleSelector}, ${wishlistTitleSelector}`;

    // PDP main title selectors (from previous)
    const pdpTitleSelector = 'h1[data-testid="lblPDPDetailProductName"][data-expanded="false"]';
    const pdpExpandButtonSelector = 'button[class*="css-1hifxen"]'; // The expand button

    // Function to auto-expand main title on PDP
    function autoExpandPdpTitle() {
        const title = document.querySelector(pdpTitleSelector);
        if (title) {
            const button = title.nextElementSibling; // The button is right after h1
            if (button && button.matches(pdpExpandButtonSelector)) {
                button.click(); // Simulate click to expand
            }
        }
    }

    // Function to add tooltips (hover mode), now also to images/media
    function addTooltips() {
        if (fullDisplay) return; // Skip if in full display mode

        const titles = document.querySelectorAll(combinedTitleSelector);

        titles.forEach(el => {
            const isTruncated = el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth;

            if (isTruncated) {
                const fullTitle = el.textContent.trim();

                // Add to title element
                if (!el.hasAttribute('title')) {
                    el.title = fullTitle;
                    el.style.cursor = 'help';
                }

                // Add to the product image/media (in cards)
                const productLink = el.closest('a');
                if (productLink) {
                    const image = productLink.querySelector('img[class*="css-1q90pod"]'); // Wishlist image selector (css-1q90pod)
                    if (image && !image.hasAttribute('title')) {
                        image.title = fullTitle;
                        image.style.cursor = 'help';
                    }
                }
            }
        });
    }

    // Apply full display mode if enabled (for search, recommendations, wishlist, etc.)
    if (fullDisplay) {
        GM_addStyle(`
            /* For search/recommendations */
            ${searchTitleContainerSelector} {
                display: block !important;
                -webkit-line-clamp: unset !important;
                -webkit-box-orient: unset !important;
                overflow: visible !important;
                text-overflow: unset !important;
                white-space: normal !important;
                max-height: none !important;
                height: auto !important;
            }
            ${searchTitleSelector} {
                display: inline !important; /* Ensure span flows naturally */
                white-space: normal !important;
            }
            /* For wishlist */
            ${wishlistTitleSelector} {
                display: block !important;
                -webkit-line-clamp: unset !important;
                -webkit-box-orient: unset !important;
                overflow: visible !important;
                text-overflow: unset !important;
                white-space: normal !important;
                max-height: none !important;
                height: auto !important;
            }
        `);
    } else {
        // Run tooltip addition
        addTooltips();

        // Observe for dynamic loads in tooltip mode (e.g., lazy-loaded items)
        const observer = new MutationObserver(addTooltips);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Auto-expand PDP main title regardless of mode
    autoExpandPdpTitle();

    // Observe for dynamic PDP changes (if title loads async)
    const pdpObserver = new MutationObserver(autoExpandPdpTitle);
    pdpObserver.observe(document.body, { childList: true, subtree: true });

    // Menu command to toggle mode, with ON/OFF status in text
    function toggleFullDisplay() {
        fullDisplay = !fullDisplay;
        GM_setValue('fullDisplay', fullDisplay);
        alert(`Full title display mode: ${fullDisplay ? 'ENABLED' : 'DISABLED'}. Refresh the page to apply changes and update menu text.`);
    }

    GM_registerMenuCommand(`Toggle Full Title Display (${fullDisplay ? 'ON' : 'OFF'})`, toggleFullDisplay);
})();