// ==UserScript==
// @name         Carousell++
// @namespace    http://tampermonkey.net/
// @version      1.1
// @license      GPL-3.0
// @description  Makes Carousell search less annoying and more useful
// @author       oopsitsdeleted
// @match        https://www.carousell.sg/search/*
// @match        https://www.carousell.com.my/search/*
// @match        https://www.carousell.ph/search/*
// @match        https://www.carousell.com.hk/search/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/557565/Carousell%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/557565/Carousell%2B%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Log removal events only if you want to debug.
    const DEBUG = true;

    /**
     * removes all the annoying bs from carousell search (boosted/sponsored) hehe 99.999% vibecoded
     */
    function removeSponsoredPosts() {
        let removedCount = 0;

        // --- boosted/spotlight ads ---

        // find boosted
        const boostedIndicators = document.querySelectorAll('svg[fill="#00816D"]');

        // find spotlight indicators
        const spotlightIndicators = document.querySelectorAll('div[style*="background: rgb(169, 80, 168)"]');

        // Combine all listing indicators into one NodeList
        const allListingIndicators = [...boostedIndicators, ...spotlightIndicators];

        allListingIndicators.forEach(indicatorElement => {
            let cardElement = indicatorElement;
            let depth = 0;
            const MAX_DEPTH = 10;

            // main card wrapper
            while (cardElement && depth < MAX_DEPTH) {
                // rabs
                if (cardElement.hasAttribute('data-testid') && cardElement.getAttribute('data-testid').startsWith('listing-card')) {

                    // remove parents
                    const removalTarget = cardElement.parentElement;

                    if (removalTarget && removalTarget.parentElement) {
                        if (DEBUG) console.log(`[Carousell++] Removing Boosted/Spotlight Listing:`, removalTarget);
                        removalTarget.parentElement.removeChild(removalTarget);
                        removedCount++;
                        return;
                    }
                }
                cardElement = cardElement.parentElement;
                depth++;
            }
        });

        // --- banner ads ---

        // target shoutout banner
        const shoutoutSelector = '.D_bNr';
        const shoutoutBanners = document.querySelectorAll(shoutoutSelector);

        shoutoutBanners.forEach(banner => {
            // remove grid item and collapse space so it doesnt leave blank space
            // Shoutout Banner (.D_bNr) -> Parent DIV (1st level) -> Grid Item Container (2nd level, what we want to remove)
            const parent = banner.parentElement;
            const removalTarget = parent ? parent.parentElement : null;

            if (removalTarget && removalTarget.parentElement) {
                if (DEBUG) console.log(`[Carousell++] Removing Shoutout Banner Grid Container:`, removalTarget);
                removalTarget.parentElement.removeChild(removalTarget);
                removedCount++;
            }
        });

        // --- big ass carousell ads ---

        // target banner
        const smartRenderSelector = '.D_aEW';
        const smartRenderBanners = document.querySelectorAll(smartRenderSelector);

        smartRenderBanners.forEach(banner => {
            // remove grid item
            // .D_aEW -> Parent DIV (.D_ZP) -> Grid Item Container (what we want to remove)
            const removalTarget = banner.parentElement;

            if (removalTarget && removalTarget.parentElement) {
                if (DEBUG) console.log(`[Carousell++] Removing Smart Render/Carousell Ad Grid Container:`, removalTarget);
                removalTarget.parentElement.removeChild(removalTarget);
                removedCount++;
            }
        });

        // --- big big big banner ---

        // target banner
        const promotedContentSelector = '.D_ais';
        const promotedContentBanners = document.querySelectorAll(promotedContentSelector);

        promotedContentBanners.forEach(banner => {
            // hmmm
            const removalTarget = banner;

            if (removalTarget && removalTarget.parentElement) {
                if (DEBUG) console.log(`[Carousell++] Removing Promoted Content Banner:`, removalTarget);
                removalTarget.parentElement.removeChild(removalTarget);
                removedCount++;
            }
        });


        if (DEBUG && removedCount > 0) {
            console.log(`[Carousell++] Successfully removed ${removedCount} annoying bs.`);
        }
    }

    /**
     * Use MutationObserver to watch for new content being loaded (e.g., infinite scroll)
     * and run the removal function again.
     */
    function observeDOM() {
        // Observe the main content area (document.body) for new elements.
        const targetNode = document.body;

        const config = { childList: true, subtree: true };

        const observer = new MutationObserver((mutationsList, observer) => {
            // Run the removal logic every time the DOM changes.
            removeSponsoredPosts();
        });

        // Start observing the target node for configured mutations
        observer.observe(targetNode, config);

        // Run the function immediately on page load, as the observer might miss initial content
        removeSponsoredPosts();
    }

    // Start the whole process
    observeDOM();

})();