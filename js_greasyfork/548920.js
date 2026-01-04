// ==UserScript==
// @name         Flingster - Advanced Ad Skipper
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Automatically clicks 'next' on Flingster ads by detecting multiple ad clues like "Hide This", "flag-sponsored", or "Connect with Women".
// @author       hawg808
// @match        *://*.flingster.com/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548920/Flingster%20-%20Advanced%20Ad%20Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/548920/Flingster%20-%20Advanced%20Ad%20Skipper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    // List of CSS selectors that identify an ad. The script will trigger if ANY of these are found.
    const adSelectors = [
        '.rcw-hide',                // The container for ">> Hide This"
        '.flag-sponsored',          // The "Remove Ads" flag
        '.rcw-cont .girls-btn'      // The "Connect with Women" button inside the ad box
    ];
    // The 'next' button that skips to the next person.
    const nextButtonSelector = '#right_button';
    // --- End Configuration ---

    console.log('Flingster Advanced Ad Skipper is now active. 🚀');

    // This function clicks the 'next' button.
    const clickNextButton = () => {
        const nextButton = document.querySelector(nextButtonSelector);
        if (nextButton) {
            // Find which clue was detected for the log message
            const detectedClue = adSelectors.find(selector => document.querySelector(selector));
            console.log(`Ad detected (clue: "${detectedClue}")! Clicking "next"...`);
            nextButton.click();
        }
    };

    // We use a MutationObserver to efficiently watch for when new elements
    // are added to the page.
    const observer = new MutationObserver((mutationsList) => {
        // Check only if something was actually added to the page
        if (!mutationsList.some(mutation => mutation.addedNodes.length > 0)) {
            return;
        }

        // Check if any of our ad selectors match a new, visible element.
        for (const selector of adSelectors) {
            const adElement = document.querySelector(selector);
            // Check if the element exists and is actually visible on the screen.
            if (adElement && adElement.offsetParent !== null) {
                clickNextButton();
                // Exit the function once an ad is found and clicked to avoid multiple clicks.
                return;
            }
        }
    });

    // Start observing the entire page for changes.
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();