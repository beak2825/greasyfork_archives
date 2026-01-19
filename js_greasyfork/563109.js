// ==UserScript==
// @name         Torn Ultra-Wide Market Layout
// @namespace    http://torn.com/
// @version      1.2
// @description  Expands the layout to the edges of the screen for more market space
// @author       srsbsns / Gemini
// @match        *://www.torn.com/page.php?sid=ItemMarket*
// @match        *://www.torn.com/imarket.php*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563109/Torn%20Ultra-Wide%20Market%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/563109/Torn%20Ultra-Wide%20Market%20Layout.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const styles = `
        /* 1. Expand the main container wrapper */
        .content-wrapper,
        #mainContainer {
            max-width: 100% !important;
            width: 100% !important;
            padding: 0 10px !important;
        }
        /* 2. Adjust the flexbox/grid layout of the page */
        .content-wrapper > .container {
            display: flex !important;
            max-width: 100% !important;
            width: 100% !important;
            justify-content: space-between !important;
        }
        /* 3. Push sidebars to the edges */
        /* Left Sidebar */
        #sidebar {
            margin-left: 0 !important;
            flex-shrink: 0 !important;
        }
        /* Right Sidebar (the one with Equipment/Supplies) */
        .content-wrapper > .container > .sidebar-right,
        aside[class*="sidebar-right"],
        div[class*="rightSidebar"] {
            margin-right: 0 !important;
            flex-shrink: 0 !important;
        }
        /* 4. Force the middle content (the market) to take all remaining space */
        .content-wrapper > .container > .content,
        .main-market-wrapper {
            flex-grow: 1 !important;
            margin: 0 15px !important;
            max-width: none !important;
            width: auto !important;
        }
        /* Compatibility for the Item Market specifically */
        .item-market-main-wrap {
            width: 100% !important;
            max-width: 100% !important;
        }
    `;

    let styleElement = null;

    function shouldApplyStyles() {
        const hash = window.location.hash;
        // Disable on addListing and viewListing pages
        return !hash.includes('/addListing') && !hash.includes('/viewListing');
    }

    function updateStyles() {
        if (shouldApplyStyles()) {
            if (!styleElement) {
                styleElement = GM_addStyle(styles);
            }
        } else {
            if (styleElement) {
                styleElement.remove();
                styleElement = null;
            }
        }
    }

    // Initial check
    updateStyles();

    // Listen for hash changes
    window.addEventListener('hashchange', updateStyles);
})();