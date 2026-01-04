// ==UserScript==
// @name         DuckDuckGo Redirect to Google Maps
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Redirects the 'Maps' button on DuckDuckGo search results to Google Maps instead of Apple Maps.
// @author       nereids
// @license      MIT
// @match        *://duckduckgo.com/*
// @grant        none
// @icon         https://icons.duckduckgo.com/ip3/duckduckgo.com.ico
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/555659/DuckDuckGo%20Redirect%20to%20Google%20Maps.user.js
// @updateURL https://update.greasyfork.org/scripts/555659/DuckDuckGo%20Redirect%20to%20Google%20Maps.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const GOOGLE_MAPS_BASE_URL = 'https://www.google.com/maps/search/';

    function setupMapsLinkListener() {
        // Find the 'Maps' link element using the provided structure and text content.
        // We look for an <a> tag that contains 'Maps' as its text.
        const mapsLink = Array.from(document.querySelectorAll('li a'))
                             .find(a => a.textContent.trim() === 'Maps');

        if (mapsLink) {
            // **Core Correction:** We attach an event listener to intercept the click.
            mapsLink.addEventListener('click', function(event) {
                // 1. Stop the default behavior (which is DDG's internal navigation/SPA logic).
                event.preventDefault();
                event.stopPropagation(); // Also stop propagation in case parent elements have handlers.

                // 2. Extract the search query from the current DDG URL.
                // The current URL in the browser bar is the source of the query.
                const currentUrl = new URL(window.location.href);
                const query = currentUrl.searchParams.get('q');

                if (query) {
                    // 3. Construct the Google Maps URL and perform the redirect in a new tab.
                    const googleMapsUrl = GOOGLE_MAPS_BASE_URL + encodeURIComponent(query);
                    window.open(googleMapsUrl, '_blank');

                    console.log(`Redirected 'Maps' click for query: ${query} to Google Maps.`);
                } else {
                    console.warn('Could not extract search query from current URL for redirect.');
                }
            }, true); // Use 'true' for capture phase to ensure our handler runs before any other DDG handlers.

            // For a better visual experience, you can still update the href attribute
            // to display the target URL in the status bar on hover.
            mapsLink.href = GOOGLE_MAPS_BASE_URL + (new URL(window.location.href)).searchParams.get('q') || '';
            mapsLink.target = '_blank';

            console.log('DuckDuckGo Maps link click interceptor is active.');
            return true; // Link found and listener set up
        }
        return false; // Link not found
    }

    // Use MutationObserver to reliably wait for the dynamic navigation bar to load.
    const observer = new MutationObserver((mutationsList, observer) => {
        if (setupMapsLinkListener()) {
            observer.disconnect(); // Disconnect once successful
        }
    });

    // Start observing the document body for changes in the subtree.
    observer.observe(document.body, { childList: true, subtree: true });

    // Also try to run immediately in case the element is already present on page load.
    setupMapsLinkListener();
})();