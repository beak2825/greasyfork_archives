// ==UserScript==
// @name         Torn Crime Banner Toggle
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Remove the animated part of the crime banner and expand the stats box
// @author       Omanpx [1906686] + Claude Sonnet 4.5
// @match        https://www.torn.com/page.php?sid=crimes*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553603/Torn%20Crime%20Banner%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/553603/Torn%20Crime%20Banner%20Toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function setAriaExpanded() {
        const button = document.querySelector('.toggleStatsPanelButton___dOfzi');
        if (button) {
            // Check if it's not already expanded
            if (button.getAttribute('aria-expanded') !== 'true') {
                // Click the button to trigger the expand
                button.click();
                console.log('Clicked toggleStatsPanelButton to expand');
            }
        }

        // Also remove the banner wrapper
        const banner = document.querySelector('.bannerWrapper___b7tPK');
        if (banner) {
            banner.remove();
            console.log('Removed bannerWrapper element');
            return true;
        }

        return false;
    }

    // Run immediately
    setAriaExpanded();

    // Watch for dynamic content changes - observe the entire document
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                setAriaExpanded();
            }
        });
    });

    // Start observing the document body for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Also try repeatedly for the first few seconds
    let attempts = 0;
    const interval = setInterval(() => {
        if (setAriaExpanded() || attempts > 20) {
            clearInterval(interval);
        }
        attempts++;
    }, 200);
})();