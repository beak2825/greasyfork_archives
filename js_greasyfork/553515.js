// ==UserScript==
// @name         AliExpress Bundle Deal Highlighter
// @namespace    http://aliexpress.com/
// @version      1.03
// @description  Highlight bundle deals with a yellow background on AliExpress
// @author       n00bCod3r
// @include      https://*aliexpress*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553515/AliExpress%20Bundle%20Deal%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/553515/AliExpress%20Bundle%20Deal%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to highlight bundle deals
    function highlightBundleDeals() {
        // Reset old styles (when page changes)
        const allCards = document.querySelectorAll('.card-out-wrapper');
        allCards.forEach(card => {
            card.style.border = ''; // Reset border
        });

        // Find all elements next to comet-icons (only bundle deals have this)
        const offerElements = document.querySelectorAll('div.card-out-wrapper:has(span.comet-icon)');

        offerElements.forEach(element => {
            element.style.border = '5px solid #ffeb3b'; // Apply style
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
