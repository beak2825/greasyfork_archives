// ==UserScript==
// @name         Flight Rising - Baldwin's Item Search
// @namespace    https://greasyfork.org/en/users/322117
// @version      0.5.1
// @description  Add a search bar to filter hoard items in Baldwin's Bubbling Brew.
// @author       mechagotch
// @match        https://www1.flightrising.com/trading/baldwin*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=flightrising.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549693/Flight%20Rising%20-%20Baldwin%27s%20Item%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/549693/Flight%20Rising%20-%20Baldwin%27s%20Item%20Search.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let searchInput = null;
    let lastSearchTerm = '';

    function filterItems(searchTerm = null) {
        if (searchTerm === null) {
            searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : lastSearchTerm;
        } else {
            lastSearchTerm = searchTerm;
        }

        const container = document.querySelector('#itempage');
        if (!container) return;

        const items = container.querySelectorAll('a.intclue[data-name]');

        items.forEach(anchor => {
            const itemName = anchor.getAttribute('data-name')?.toLowerCase() || '';
            const itemSpan = anchor.closest('.item-attachment');

            if (itemSpan) {
                if (searchTerm === '' || itemName.includes(searchTerm)) {
                    itemSpan.style.display = ''; // Show
                } else {
                    itemSpan.style.display = 'none'; // Hide
                }
            }
        });

    }

    function initSearch() {

        const itemPageContainer = document.querySelector('#itempage');
        const itemBoxContainer = document.querySelector('#swaptabs');

        if (!itemPageContainer || !itemBoxContainer) return;

        if (!searchInput) {
            searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.id = 'fr-baldwin-search';
            searchInput.placeholder = 'Search hoard';
            searchInput.value = lastSearchTerm;
            searchInput.style.cssText = `
                margin: -10px auto 3px;
                padding: 5px;
                width: 65%;
                display: block;
                border: 1px solid #ccc;
                border-radius: 4px;
                font-size: 10px;
                box-sizing: border-box;
            `;

            searchInput.addEventListener('input', function () {
                lastSearchTerm = searchInput.value.toLowerCase().trim();
                filterItems();
            });

        }

        if (!itemBoxContainer.contains(searchInput)) {
            itemBoxContainer.insertBefore(searchInput, itemBoxContainer.firstChild);
        }

        setTimeout(() => filterItems(lastSearchTerm), 75);
    }


    const checkContentInterval = setInterval(() => {
        const baldwinContent = document.querySelector('#baldwin');
        if (baldwinContent) {
            clearInterval(checkContentInterval);

            const checkItemBoxInterval = setInterval(() => {
                const itemBoxContainer = document.querySelector('#swaptabs');
                if (itemBoxContainer) {
                    clearInterval(checkItemBoxInterval);

                    initSearch();

                    const itemBoxObserver = new MutationObserver(function (mutationsList) {
                        for (let mutation of mutationsList) {
                            if (mutation.type === 'childList') {
                                let itemPageAffected = false;
                                mutation.addedNodes.forEach(node => {
                                    if (node.nodeType === Node.ELEMENT_NODE && node.id === 'itempage') {
                                        itemPageAffected = true;
                                    }
                                });
                                mutation.removedNodes.forEach(node => {
                                    if (node.nodeType === Node.ELEMENT_NODE && node.id === 'itempage') {
                                        itemPageAffected = true;
                                    }
                                });

                                if (itemPageAffected) {
                                    setTimeout(initSearch, 150);
                                }
                            }
                        }
                    });

                    itemBoxObserver.observe(itemBoxContainer, { childList: true, subtree: false });

                }
            }, 500);

        }
    }, 500); // Check for #baldwin every 500ms

})();