// ==UserScript==
// @name         Walmart Persistent In-Store Filter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically applies the in-store filter to all search results
// @author       Rim
// @tag          shopping
// @license      GNU GPLv3
// @match        https://*.walmart.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558144/Walmart%20Persistent%20In-Store%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/558144/Walmart%20Persistent%20In-Store%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function applyFilter() {
        const url = new URL(window.location.href);

        // Check if we're on a search page and don't already have the facet
        if (url.pathname === '/search' && url.searchParams.has('q')) {
            const currentFacet = url.searchParams.get('facet');
            const targetFacet = 'fulfillment_method_in_store:In-store';

            // Only add if the facet isn't already present
            if (currentFacet !== targetFacet) {
                url.searchParams.set('facet', targetFacet);
                window.location.replace(url.href);
            }
        }
    }

    // Run on initial load
    applyFilter();

    // Watch for URL changes (for single-page app navigation)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            applyFilter();
        }
    }).observe(document, { subtree: true, childList: true });
})();