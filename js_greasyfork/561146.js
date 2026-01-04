// ==UserScript==
// @name         Currys - Remove Sponsored Products
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Removes Criteo sponsored products and credit tiles from Currys search results
// @author       Steve
// @match        https://www.currys.co.uk/*
// @match        https://www.currys.ie/*
// @license      MIT
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561146/Currys%20-%20Remove%20Sponsored%20Products.user.js
// @updateURL https://update.greasyfork.org/scripts/561146/Currys%20-%20Remove%20Sponsored%20Products.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2026 Steve

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function() {
    'use strict';

    // Function to remove sponsored products
    function removeSponsoredProducts() {
        // Select elements with criteo/cretio sponsored product classes
        const sponsoredSelectors = [
            '.criteo-sponsored-product',
            '.cretio-sponsored-product',
            '[data-criteo-onclickbeacon]',
            '[data-criteo-onloadbeacon]'
        ];

        sponsoredSelectors.forEach(selector => {
            const sponsoredElements = document.querySelectorAll(selector);
            sponsoredElements.forEach(element => {
                element.remove();
                console.log('Removed sponsored product');
            });
        });
    }

    // Function to remove credit/flexpay tiles
    function removeCreditTiles() {
        const creditSelectors = [
            '#rep-example-slot',
            '.credit-tile',
            '.amp-dc-external-block',
            '.html-slot-container'
        ];

        creditSelectors.forEach(selector => {
            const creditElements = document.querySelectorAll(selector);
            creditElements.forEach(element => {
                // Check if it contains credit-related content
                if (element.textContent.includes('flexpay') || 
                    element.textContent.includes('APR') ||
                    element.textContent.includes('Credit Limit') ||
                    element.querySelector('.credit-tile')) {
                    element.remove();
                    console.log('Removed credit tile');
                }
            });
        });
    }

    // Combined removal function
    function removeUnwantedElements() {
        removeSponsoredProducts();
        removeCreditTiles();
    }

    // Initial removal
    removeUnwantedElements();

    // Watch for dynamically loaded content (infinite scroll, filters, etc.)
    const observer = new MutationObserver((mutations) => {
        removeUnwantedElements();
    });

    // Start observing the document for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Also run on common events that might load new content
    window.addEventListener('load', removeUnwantedElements);
    window.addEventListener('scroll', removeUnwantedElements);
})();
