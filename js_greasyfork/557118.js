// ==UserScript==
// @name         Amazon Auto-Sort by Best Sellers
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Automatically detects and immediately redirects Amazon search results to the 'Best Sellers' sort order, bypassing the default 'Featured' sort and eliminating page double-loads.
// @author       Gemini
// @match        *://*.amazon.com/s*
// @match        *://*.amazon.co.uk/s*
// @match        *://*.amazon.de/s*
// @match        *://*.amazon.ca/s*
// @match        *://*.amazon.fr/s*
// @match        *://*.amazon.it/s*
// @match        *://*.amazon.es/s*
// @match        *://*.amazon.co.jp/s*
// @match        *://*.amazon.com.au/s*
// @run-at       document-start
// @grant        none
// @license      CC BY 4.0
// @downloadURL https://update.greasyfork.org/scripts/557118/Amazon%20Auto-Sort%20by%20Best%20Sellers.user.js
// @updateURL https://update.greasyfork.org/scripts/557118/Amazon%20Auto-Sort%20by%20Best%20Sellers.meta.js
// ==/UserScript==

/*
 * This work is licensed under the Creative Commons Attribution 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by/4.0/
 * or send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
 */

(function() {
    // Check if the current page is an Amazon search results page (URL path starts with '/s')
    if (window.location.pathname.startsWith('/s')) {
        'use strict';

        // --- Configuration ---
        // The value attribute for the "Best Sellers" sort order, confirmed to be correct for direct URL manipulation.
        const BEST_SELLERS_SORT_VALUE = 'exact-aware-popularity-rank';
        // ---------------------

        const url = new URL(window.location.href);
        const urlParams = url.searchParams;
        const currentSort = urlParams.get('s');

        console.log(`TAMPERMONKEY DEBUG: Current URL is an Amazon search page: ${window.location.href}`);
        console.log(`TAMPERMONKEY DEBUG: Current 's' URL parameter is: ${currentSort}`);

        // 1. Check if the URL already contains the correct sort value
        if (currentSort === BEST_SELLERS_SORT_VALUE) {
             console.log(`TAMPERMONKEY DEBUG: Sort is already set to target value '${BEST_SELLERS_SORT_VALUE}'. No action needed.`);
             return; // Stop execution if already sorted
        }

        // 2. Immediate Redirection: Construct the new URL from existing parameters

        // Preserve all existing query parameters but force the 's' parameter to our target value.
        urlParams.set('s', BEST_SELLERS_SORT_VALUE);

        // Amazon sometimes adds a 'ref' parameter that points to the previous sort state.
        // We replace it with the known 'Best Sellers' reference for a clean navigation.
        const knownBestSellersRef = 'sr_st_exact-aware-popularity-rank';
        if (urlParams.has('ref')) {
            // Check if the existing ref already contains a sort reference we should replace
            const refValue = urlParams.get('ref');
            if (refValue.startsWith('sr_st_')) {
                 urlParams.set('ref', knownBestSellersRef);
            } else {
                 // For general search entry points, we can append the sort ref cleanly
                 urlParams.set('ref', knownBestSellersRef);
            }
        } else {
             // If no 'ref' exists, add the Best Sellers ref
             urlParams.set('ref', knownBestSellersRef);
        }

        // Update the full URL string
        const newUrl = url.toString();

        console.log(`Amazon Auto-Sort: Current sort is '${currentSort}'. Forcing immediate redirect to Best Sellers.`);
        console.log(`TAMPERMONKEY DEBUG: Redirecting to: ${newUrl}`);

        // Perform the direct navigation, preventing the initial page from loading.
        window.location.replace(newUrl);
    }
})();