// ==UserScript==
// @name         Steam Jump to New & Trending (Initial Jump)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Auto-scrolls to Steam's "New & Trending" on load, then allows free scrolling.
// @match        https://store.steampowered.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560086/Steam%20Jump%20to%20New%20%20Trending%20%28Initial%20Jump%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560086/Steam%20Jump%20to%20New%20%20Trending%20%28Initial%20Jump%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Locate "New & Trending" section via data attribute or XPath fallback
    function findTrendingSection() {
        const byAttr = document.querySelector('[data-genreid="NewReleases"]');
        if (byAttr) return byAttr;
        const xpath = "//h2[contains(normalize-space(.),'New & Trending')]/ancestor::div[contains(@class,'home_tab') or contains(@class,'tab_content')]";
        return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    // Smooth-scroll into view at the top of the viewport
    function scrollToTrending() {
        const el = findTrendingSection();
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Observe DOM until section appears
    const observer = new MutationObserver((mutations, obs) => {
        const el = findTrendingSection();
        if (!el) return; // Keep waiting if not found

        scrollToTrending();        // Initial scroll
        setTimeout(scrollToTrending, 2500); // Re-scroll after 2.5s in case Steam resets

        // The persistent 'scroll' event listener has been removed to allow free scrolling.

        obs.disconnect();          // Stop observing, we're done.
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();