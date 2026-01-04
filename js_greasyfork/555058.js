// ==UserScript==
// @name         OfferUp - Hide Sponsored Results
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Filter out sponsored/ad results from OfferUp search results
// @author       You
// @match        https://offerup.com/*
// @match        https://*.offerup.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/555058/OfferUp%20-%20Hide%20Sponsored%20Results.user.js
// @updateURL https://update.greasyfork.org/scripts/555058/OfferUp%20-%20Hide%20Sponsored%20Results.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Counter for stats (optional - can be removed)
    let hiddenCount = 0;

    // Function to hide sponsored results
    function hideSponsoredResults() {
        // Method 1: Find anchor tags with target="_blank" (these are typically ads)
        const sponsoredLinks = document.querySelectorAll('a[target="_blank"][rel*="nofollow"]');
        
        sponsoredLinks.forEach(link => {
            // Check if it's not already hidden
            if (link.style.display !== 'none' && !link.classList.contains('tampermonkey-hidden')) {
                link.style.display = 'none';
                link.classList.add('tampermonkey-hidden');
                hiddenCount++;
            }
        });

        // Method 2: Find direct anchor children of ul elements (ads not wrapped in li)
        const listContainers = document.querySelectorAll('ul');
        
        listContainers.forEach(ul => {
            // Get direct children that are anchor tags (not li elements)
            const directAnchors = Array.from(ul.children).filter(child => 
                child.tagName === 'A' && !child.classList.contains('tampermonkey-hidden')
            );
            
            directAnchors.forEach(anchor => {
                anchor.style.display = 'none';
                anchor.classList.add('tampermonkey-hidden');
                hiddenCount++;
            });
        });

        // Log the results (optional - can be removed)
        if (hiddenCount > 0) {
            console.log(`[OfferUp Filter] Hidden ${hiddenCount} sponsored results`);
        }
    }

    // Run the filter function initially
    function initialize() {
        hideSponsoredResults();
    }

    // Set up MutationObserver to watch for dynamically loaded content
    const observer = new MutationObserver((mutations) => {
        // Check if new nodes were added
        let shouldFilter = false;
        
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                shouldFilter = true;
            }
        });
        
        if (shouldFilter) {
            hideSponsoredResults();
        }
    });

    // Start observing when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initialize();
            
            // Start observing the entire document for changes
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    } else {
        // DOM is already ready
        initialize();
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Run the filter periodically as a backup (every 2 seconds)
    setInterval(hideSponsoredResults, 2000);

})();