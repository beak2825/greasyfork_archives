// ==UserScript==
// @name         CarGurus Sponsored Remover
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Removes sponsored content from CarGurus search results.
// @match        https://www.cargurus.ca/*
// @match        https://www.cargurus.com/*
// @match        https://www.cargurus.co.uk/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cargurus.ca
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557327/CarGurus%20Sponsored%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/557327/CarGurus%20Sponsored%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to scan and remove sponsored tiles
    function removeSponsoredListings() {
        // The specific element that contains the "Sponsored" text
        const sponsoredIndicators = document.querySelectorAll('[data-testid="sponsored-text"]');

        sponsoredIndicators.forEach(indicator => {
            const textContent = indicator.textContent.trim().toLowerCase();

            // Check if it actually says "Sponsored" (sometimes this element exists but is empty/whitespace)
            if (textContent.includes('sponsored')) {
                // We need to remove the main container for this specific car.
                // Based on the HTML structure: p -> div -> div -> div(class*="_tileFrame")
                // We use .closest() to find the nearest parent wrapper that acts as the tile frame.
                // We use a partial selector for "tileFrame" in case the random hash suffix changes in updates.
                const tile = indicator.closest('div[class*="_tileFrame"]');

                if (tile) {
                    tile.style.display = 'none'; // Hide it visually
                    // Optional: tile.remove(); // Completely remove from DOM
                    console.log('CarGurus Sponsored Remover: Hid a sponsored listing.');
                }
            }
        });
    }

    // Run the removal function immediately on load
    removeSponsoredListings();

    // Set up a MutationObserver to catch listings loaded dynamically (infinite scroll/pagination)
    const observer = new MutationObserver((mutations) => {
        let shouldRun = false;
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                shouldRun = true;
                break;
            }
        }
        if (shouldRun) {
            removeSponsoredListings();
        }
    });

    // Start observing the document body for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();