// ==UserScript==
// @name         B&Q Marketplace Filter
// @version      1.0
// @namespace    https://restall.io/
// @description  Adds a query parameter to B&Q search/category URLs to filter marketplace items.
// @match        *://*.diy.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557953/BQ%20Marketplace%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/557953/BQ%20Marketplace%20Filter.meta.js
// ==/UserScript==

(function () {
    // ---- CONFIG ----
    const QUERY_PARAM_KEY = "Sold by";
    const QUERY_PARAM_VALUE = "B&Q";

    // Pattern equivalents of your DeclarativeNetRequest rules:
    const searchRegex = /diy\.com\/search(\.data)?/i;
    const catRegex = /diy\.com\/.*\.cat/i;

    const url = new URL(location.href);

    // Determine if the current URL matches one of the rules
    const matchesSearch = searchRegex.test(url.href);
    const matchesCat = catRegex.test(url.href);

    if (!matchesSearch && !matchesCat) {
        return; // No match ⇒ do nothing.
    }

    // If parameter already exists and matches, do nothing to prevent loops
    if (url.searchParams.get(QUERY_PARAM_KEY) === QUERY_PARAM_VALUE) {
        return;
    }

    // Add/update the param
    url.searchParams.set(QUERY_PARAM_KEY, QUERY_PARAM_VALUE);

    // Redirect to updated URL
    location.replace(url.toString());
})();
