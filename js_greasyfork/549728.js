// ==UserScript==
// @name         Reddit - Hide Ads
// @namespace    http://tampermonkey.net/
// @version      2025-09-11
// @description  A quick and dirty add remover for Reddit
// @author       You
// @match        https://*.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/549728/Reddit%20-%20Hide%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/549728/Reddit%20-%20Hide%20Ads.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function replaceAds() {
        document.querySelectorAll("shreddit-ad-post").forEach(ad => {
            // Create replacement node
            let replacement = document.createElement("div");
            replacement.style.cssText = "padding: 10px; text-align: center; color: gray; font-style: italic;";
            replacement.textContent = "Ad Removed.";

            // Replace ad with new element
            ad.replaceWith(replacement);
        });
    }

    // Run once on load
    replaceAds();

    // Watch for dynamically loaded ads
    const observer = new MutationObserver(replaceAds);
    observer.observe(document.body, { childList: true, subtree: true });
})();