// ==UserScript==
// @name         Amazon.fr - Show Only Amazon Products
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Automatically filter Amazon.fr search results to show only products sold by Amazon
// @match        https://www.amazon.fr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556009/Amazonfr%20-%20Show%20Only%20Amazon%20Products.user.js
// @updateURL https://update.greasyfork.org/scripts/556009/Amazonfr%20-%20Show%20Only%20Amazon%20Products.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const amazonSellerId = 'A1X6FK5RDHNB96';
    const sellerParam = `p_6:${amazonSellerId}`;

    function modifyUrl() {
        let url = new URL(window.location.href);
        let searchParams = url.searchParams;

        // Check if it's a search page
        if (url.pathname.startsWith('/s') || url.pathname.startsWith('/gp/search')) {
            // Check if the seller parameter is already present
            if (!searchParams.get('rh') || !searchParams.get('rh').includes(sellerParam)) {
                let rh = searchParams.get('rh') || '';
                rh = rh ? rh + ',' + sellerParam : sellerParam;
                searchParams.set('rh', rh);

                // Redirect to the new URL
                window.location.href = url.toString();

              console.log("-- MODIFIED URL.")
            }
        }
    }

    // Run the function when the page loads
    modifyUrl();

    // Use a MutationObserver to detect when search results are loaded
    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Check if the added node is the search results container
                if (document.querySelector('.s-result-list')) {
                    modifyUrl();
                    break;
                }
            }
        }
    });

    // Start observing the document body for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Also run the function when the URL changes without a page reload (e.g., when using faceted search)
    window.addEventListener('popstate', modifyUrl);
})();
