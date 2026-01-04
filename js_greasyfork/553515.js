// ==UserScript==
// @name         AliExpress Bundle Deal Highlighter
// @namespace    http://aliexpress.com/
// @version      1.02
// @description  Highlight bundle deals with a yellow background on AliExpress
// @author       ByteShaman
// @match        https://*.aliexpress.com/*
// @match        https://www.aliexpress.us/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553515/AliExpress%20Bundle%20Deal%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/553515/AliExpress%20Bundle%20Deal%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const BUNDLE_DEAL_STRINGS = ['offerte a pacchetto', 'bundle deals', 'dollar express'];

    // Function to highlight bundle deals
    function highlightBundleDeals() {
        // Reset old styles (when page changes)
        const allCards = document.querySelectorAll('.card-out-wrapper');
        allCards.forEach(card => {
            card.style.border = ''; // Reset border
        });

        // Find all elements next to comet-icons (only bundle deals have this)
        const offerElements = document.querySelectorAll('span:has(+ span.comet-icon)');

        offerElements.forEach(element => {
            // Check if the element contains the bundle deal text
            if (BUNDLE_DEAL_STRINGS.includes(element.textContent.toLowerCase())) {
                // Find the parent card-out-wrapper div
                const cardWrapper = element.closest('.card-out-wrapper');
                // Apply style
                if (cardWrapper) {
                  cardWrapper.style.border = '5px solid #ffeb3b';
                }
            }
        });
    }

    // Run on page load
    highlightBundleDeals();

    // Observe DOM changes for dynamically loaded content
    const observer = new MutationObserver(() => {
        highlightBundleDeals();
    });

    // Start observing the document body for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
