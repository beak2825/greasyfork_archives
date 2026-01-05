// ==UserScript==
// @name         Flight Rising Item Search (DMs, Baldwin, & Crossroads)
// @namespace    https://greasyfork.org/en/users/1556122
// @version      1.0
// @description  Adds a search bar to interfaces that need one really badly
// @author       c0ppercat
// @match        https://www1.flightrising.com/msgs/*
// @match        https://www1.flightrising.com/trading/baldwin/transmute*
// @match        https://www1.flightrising.com/crossroads/offer/make*
// @match        https://www1.flightrising.com/crossroads/deliver/start*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561422/Flight%20Rising%20Item%20Search%20%28DMs%2C%20Baldwin%2C%20%20Crossroads%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561422/Flight%20Rising%20Item%20Search%20%28DMs%2C%20Baldwin%2C%20%20Crossroads%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CSS
    const style = document.createElement('style');
    style.innerHTML = `
        #fr-item-search-input {
            display: block;
            width: 442px;
            padding: 4px 8px;
            font-size: 12px;
            margin: 12px auto 12px auto;
            background-color: #1d1e21;
            border: 1px solid #4e5661;
            color: #fff;
            border-radius: 4px;
            box-sizing: border-box;
            z-index: 1000;
        }
        #fr-item-search-input:focus {
            outline: 1px solid #7598c1;
            border-color: #7598c1;
        }
    `;
    document.head.appendChild(style);

    let searchInput = null;

    function filterItems() {
        if (!searchInput) return;
        const query = searchInput.value.toLowerCase();
        const items = document.querySelectorAll('#itempage .item-attachment');

        items.forEach(item => {
            const link = item.querySelector('a');
            const img = item.querySelector('img');

            let itemName = "";
            if (link && link.hasAttribute('data-name')) {
                itemName = link.getAttribute('data-name').toLowerCase();
            } else if (img && img.hasAttribute('alt')) {
                itemName = img.getAttribute('alt').toLowerCase();
            }

            if (itemName.includes(query)) {
                item.style.display = "inline-block";
            } else {
                item.style.display = "none";
            }
        });
    }

    const observer = new MutationObserver((mutations) => {
        const itemPage = document.getElementById('itempage');

        if (itemPage && !document.getElementById('fr-item-search-input')) {
            searchInput = document.createElement('input');
            searchInput.id = 'fr-item-search-input';
            searchInput.type = 'text';
            searchInput.placeholder = 'Search items...';

            itemPage.parentNode.insertBefore(searchInput, itemPage);
            searchInput.addEventListener('input', filterItems);
        }

        if (searchInput && searchInput.value !== "") {
            filterItems();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();