// ==UserScript==
// @name         Shopee Full Product Title or Tooltip
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Toggle between showing full product titles inline or tooltips on hover for items on Shopee search, product, and wishlist pages. Always show full title on product detail pages.
// @author       Grok
// @match        https://shopee.co.id/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560538/Shopee%20Full%20Product%20Title%20or%20Tooltip.user.js
// @updateURL https://update.greasyfork.org/scripts/560538/Shopee%20Full%20Product%20Title%20or%20Tooltip.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Toggle setting: true = full inline display on search, false = tooltip hover on search
    let fullDisplaySearch = GM_getValue('fullDisplaySearch', false);

    // Search page selectors
    const searchTitleSelector = 'div.line-clamp-2';
    const searchTitleContainerSelector = 'div.space-y-1';

    // Product page selectors
    const productTitleSelector = 'h1.vR6K3w';
    const productTitleWrapperSelector = 'div.WBVL_7';
    const productRatingsRowSelector = 'div.asFzUa';

    // Sidebar "Produk Pilihan Toko" titles
    const sidebarTitleSelector = '.item-card-special__name--special';

    // Add tooltips on search titles (only when toggle is OFF)
    function addSearchTooltips() {
        if (fullDisplaySearch) return;

        const titles = document.querySelectorAll(searchTitleSelector);

        titles.forEach(el => {
            const isTruncated = el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth;
            if (isTruncated && !el.hasAttribute('title')) {
                el.title = el.textContent.trim();
                el.style.cursor = 'help';
            }
        });
    }

    // Always force full titles on product pages (main + sidebar)
    GM_addStyle(`
        /* Main product title */
        ${productTitleWrapperSelector} {
            display: flex !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            overflow: visible !important;
            height: auto !important;
            min-height: unset !important;
        }

        ${productTitleWrapperSelector} > div._wgU9F,
        ${productTitleWrapperSelector} > div.items-center {
            order: 1 !important;
            margin-bottom: 8px !important;
        }

        ${productTitleSelector} {
            order: 2 !important;
            display: block !important;
            -webkit-line-clamp: unset !important;
            line-clamp: unset !important;
            overflow: visible !important;
            text-overflow: unset !important;
            white-space: normal !important;
            max-height: none !important;
            height: auto !important;
            word-break: break-word !important;
            word-wrap: break-word !important;
            margin-bottom: 12px !important; /* Tight but comfortable */
        }

        div.tKNJvJ,
        div.flex-auto {
            overflow: visible !important;
            height: auto !important;
            min-height: unset !important;
        }

        ${productRatingsRowSelector} {
            display: flex !important;
            margin-top: 8px !important;
            width: 100% !important;
        }

        /* Sidebar "Produk Pilihan Toko" titles */
        ${sidebarTitleSelector} {
            display: block !important;
            -webkit-line-clamp: unset !important;
            line-clamp: unset !important;
            overflow: visible !important;
            text-overflow: unset !important;
            white-space: normal !important;
            max-height: none !important;
            height: auto !important;
            word-break: break-word !important;
            margin-bottom: 4px !important;
        }

        /* Ensure sidebar cards expand vertically */
        .item-card-special__lower-padding {
            height: auto !important;
            min-height: unset !important;
        }

        .item-card-special {
            height: auto !important;
            padding-bottom: 8px !important;
        }
    `);

    // Search pages handling
    if (fullDisplaySearch) {
        GM_addStyle(`
            ${searchTitleSelector} {
                display: block !important;
                -webkit-line-clamp: unset !important;
                overflow: visible !important;
                text-overflow: unset !important;
                white-space: normal !important;
                max-height: none !important;
                height: auto !important;
            }
            ${searchTitleContainerSelector} {
                min-height: unset !important;
                height: auto !important;
                margin-bottom: 12px !important;
            }
        `);
    } else {
        addSearchTooltips();
        const observer = new MutationObserver(addSearchTooltips);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Toggle menu (affects search only)
    function toggleSearchFullDisplay() {
        fullDisplaySearch = !fullDisplaySearch;
        GM_setValue('fullDisplaySearch', fullDisplaySearch);
        alert(`Search titles full display: ${fullDisplaySearch ? 'ENABLED' : 'DISABLED'} (tooltips on hover).\nProduct pages (main + sidebar) always show full titles.\nRefresh to apply.`);
    }

    GM_registerMenuCommand(`Search Titles: Full Display (${fullDisplaySearch ? 'ON' : 'OFF'})`, toggleSearchFullDisplay);
})();