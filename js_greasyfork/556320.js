// ==UserScript==
// @name         Amazon Affiliate Tag Clean Links
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Creates clean Amazon affiliate links
// @match        *://*.amazon.com/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/556320/Amazon%20Affiliate%20Tag%20Clean%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/556320/Amazon%20Affiliate%20Tag%20Clean%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const AFFILIATE_TAG = 'pokemon-restocks-20';

    function cleanAmazonUrl() {
        const url = new URL(window.location.href);

        // Extract the essential parts
        const pathMatch = url.pathname.match(/\/dp\/([A-Z0-9]+)/i) ||
                         url.pathname.match(/\/gp\/product\/([A-Z0-9]+)/i);

        if (pathMatch) {
            const asin = pathMatch[1];

            // Check if we need to preserve certain parameters
            const th = url.searchParams.get('th'); // For variation selection
            const psc = url.searchParams.get('psc'); // For product selection context

            // Build clean URL
            let cleanUrl = `${url.origin}/dp/${asin}?tag=${AFFILIATE_TAG}`;

            // Add back essential parameters if they exist
            if (th) cleanUrl += `&th=${th}`;
            if (psc) cleanUrl += `&psc=${psc}`;

            // Only redirect if the current URL is different
            if (window.location.href !== cleanUrl) {
                window.location.replace(cleanUrl);
            }
        }
    }

    cleanAmazonUrl();
})();
