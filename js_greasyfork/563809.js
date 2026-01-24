// ==UserScript==
// @name         PitStop Prizes - Show Only Free Draws
// @namespace    violentmonkey.github.io
// @version      1.0
// @description  Hide all paid draws, only show free entries
// @author       You
// @license      MIT
// @match        https://pitstopprizes.co.uk/*
// @match        https://*.pitstopprizes.co.uk/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/563809/PitStop%20Prizes%20-%20Show%20Only%20Free%20Draws.user.js
// @updateURL https://update.greasyfork.org/scripts/563809/PitStop%20Prizes%20-%20Show%20Only%20Free%20Draws.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideNonFreeDraws() {
        const drawItems = document.querySelectorAll('li.product');

        drawItems.forEach(item => {
            let isFree = false;

            // Check if title contains "FREE TO ENTER"
            const title = item.querySelector('.woocommerce-loop-product__title');
            if (title && title.textContent.includes('FREE TO ENTER')) {
                isFree = true;
            }

            // Check if URL contains "free-to-enter"
            const link = item.querySelector('a[href*="free-to-enter"]');
            if (link) {
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