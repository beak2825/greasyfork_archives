// ==UserScript==
// @name         RevComps - Show Only Free Draws
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hide all paid draws, only show free entries
// @author       You
// @match        https://www.revcomps.com/*
// @match        https://*.revcomps.com/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563807/RevComps%20-%20Show%20Only%20Free%20Draws.user.js
// @updateURL https://update.greasyfork.org/scripts/563807/RevComps%20-%20Show%20Only%20Free%20Draws.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideNonFreeDraws() {
        const drawItems = document.querySelectorAll('.qode-pli');

        drawItems.forEach(item => {
            let isFree = false;

            // Check if price is £0.00
            const priceElement = item.querySelector('.qode-pli-price');
            if (priceElement && priceElement.textContent.includes('£0.00')) {
                isFree = true;
            }

            // Check if URL contains "free-entry"
            const link = item.querySelector('.qode-pli-link');
            if (link && link.href.includes('free-entry')) {
                isFree = true;
            }

            // Hide if not free
            if (!isFree) {
                item.style.display = 'none';
            }
        });
    }

    // Run on page load
    hideNonFreeDraws();

    // Watch for dynamic content
    const observer = new MutationObserver(hideNonFreeDraws);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Periodic check for late-loading content
    setInterval(hideNonFreeDraws, 1000);
})();