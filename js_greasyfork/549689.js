// ==UserScript==
// @name         Flight Rising - Auction House Hoard Item Search
// @namespace    https://greasyfork.org/en/users/322117
// @version      0.2
// @description  Adds a search bar to filter hoard items in the Flight Rising Auction House's Sell page.
// @author       mechagotch
// @match        https://www1.flightrising.com/auction-house/sell/realm/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=flightrising.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549689/Flight%20Rising%20-%20Auction%20House%20Hoard%20Item%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/549689/Flight%20Rising%20-%20Auction%20House%20Hoard%20Item%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const checkInterval = setInterval(() => {
        const container = document.querySelector('.ah-sell-item-list');
        if (container) {
            clearInterval(checkInterval);

            const searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.id = 'fr-ah-search';
            searchInput.placeholder = 'Search hoard';
            searchInput.style = `margin-bottom:10px; padding:5px; width: 100%; display:block;`

            container.parentNode.insertBefore(searchInput, container);

            const items = container.querySelectorAll('.ah-sell-item');

            function filterItems() {
                const searchTerm = searchInput.value.toLowerCase().trim();

                items.forEach(item => {
                    const itemName = item.getAttribute('data-name')?.toLowerCase() || '';

                    if (searchTerm === '' || itemName.includes(searchTerm)) {
                        item.style.display = ''
                        const padContainer = item.closest('.ah-sell-item-padcontainer');
                        if (padContainer) {
                            padContainer.style.display = ''
                        }
                    } else {
                        item.style.display = 'none'; // Hide item
                    }
                });

                const padContainers = container.querySelectorAll('.ah-sell-item-padcontainer');
                padContainers.forEach(padContainer => {
                     const visibleItems = padContainer.querySelectorAll('.ah-sell-item:not([style*="display: none"])');
                     if (visibleItems.length === 0) {
                         padContainer.style.display = 'none';
                     } else {
                         padContainer.style.display = ''
                     }
                });
            }

            searchInput.addEventListener('input', filterItems);
        }
    }, 500); // The site lags, give it 500ms

})();