// ==UserScript==
// @name Bazaar Price on Category PC ONLY
// @namespace http://tampermonkey.net/
// @version 1.5
// @description Displays cheapest bazaar price and percentage difference on the item market page.
// @author WTV [3281931]
// @match https://www.torn.com/*
// @grant GM.xmlHttpRequest
// @grant GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/549878/Bazaar%20Price%20on%20Category%20PC%20ONLY.user.js
// @updateURL https://update.greasyfork.org/scripts/549878/Bazaar%20Price%20on%20Category%20PC%20ONLY.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const WEAVER_API_ENDPOINT = 'https://weav3r.dev/api/marketplace/';

    function getCheapestBazaarPrice(itemId) {
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: "GET",
                url: `${WEAVER_API_ENDPOINT}${itemId}`,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data && data.listings && data.listings.length > 0) {
                            const cheapestListing = data.listings.reduce((min, listing) =>
                                listing.price < min.price ? listing : min
                            );
                            resolve(cheapestListing.price);
                        } else {
                            resolve(null);
                        }
                    } catch (e) {
                        reject('Error parsing API response.');
                    }
                },
                onerror: function(response) {
                    reject('API request failed.');
                }
            });
        });
    }

    function calculatePercentageDifference(marketPrice, bazaarPrice) {
        if (marketPrice === 0 || bazaarPrice === null) return null;
        const difference = bazaarPrice - marketPrice;
        const percentage = (difference / marketPrice) * 100;
        return percentage.toFixed(2);
    }

    function processItems() {
        if (!window.location.href.includes('sid=ItemMarket')) {
            return;
        }

        const itemContainers = document.querySelectorAll('div[class*="itemTile"]');

        itemContainers.forEach(async (itemContainer) => {
            if (itemContainer.dataset.bazaarPriceAdded) return;
            itemContainer.dataset.bazaarPriceAdded = 'true';

            const detailsButton = itemContainer.querySelector('[aria-controls*="wai-itemInfo"]');
            if (!detailsButton) return;
            const itemId = detailsButton.getAttribute('aria-controls').split('-').pop();

            const priceElement = itemContainer.querySelector('div[class*="priceAndTotal"]');
            if (!priceElement) return;

            const priceSpan = priceElement.querySelector('span:first-child');
            const currentPrice = parseInt(priceSpan.innerText.replace(/[^0-9]/g, ''));

            try {
                const cheapestBazaarPrice = await getCheapestBazaarPrice(itemId);

                if (cheapestBazaarPrice !== null) {
                    const percentageDiff = calculatePercentageDifference(currentPrice, cheapestBazaarPrice);

                    const newDiv = document.createElement('div');
                    newDiv.style.cssText = 'font-size: 12px; margin-top: 5px; color: #ccc;';

                    const diffColor = percentageDiff >= 0 ? 'red' : 'limegreen';
                    newDiv.innerHTML = `
                        $${cheapestBazaarPrice.toLocaleString()} | <span style="color: ${diffColor};">${percentageDiff}%</span>
                    `;

                    priceElement.parentNode.appendChild(newDiv);
                }
            } catch (error) {
                console.error(`Failed to get bazaar price for item ${itemId}:`, error);
            }
        });
    }

    const observer = new MutationObserver(() => {
        processItems();
    });

    observer.observe(document.body, {  childList: true, subtree: true });

    processItems();
})();
