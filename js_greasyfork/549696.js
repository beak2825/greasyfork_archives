// ==UserScript==
// @name         Flight Rising - Auction House Exact Match Filter
// @namespace    https://greasyfork.org/en/users/322117
// @version      0.4
// @description  Adds a button to the FR Auction House Buy page to filter listings by exact item name match.
// @author       mechagotch
// @match        https://www1.flightrising.com/auction-house/buy/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=flightrising.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549696/Flight%20Rising%20-%20Auction%20House%20Exact%20Match%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/549696/Flight%20Rising%20-%20Auction%20House%20Exact%20Match%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let exactMatchButton = null;
    let isFilteringActive = false;
    let originalSearchTerm = '';

    function getCurrentSearchTerm() {
        let searchInput = document.querySelector('input[name="itemname"]');
        return searchInput ? searchInput.value.trim() : '';
    }

    function filterListings() {
        let searchTerm = getCurrentSearchTerm().toLowerCase();
        if (searchTerm === '') {
            toggleFilter(false);
            return;
        }

        let listings = document.querySelectorAll('.ah-listing-row');

        listings.forEach(listing => {
            let itemName = listing?.children[0]?.getAttribute('data-name')?.toLowerCase().trim() || '';
            if (itemName === searchTerm) {
                listing.style.display = '';
            } else {
                listing.style.display = 'none';
            }
        });

    }

    function resetListings() {
        let listings = document.querySelectorAll('.ah-listing-row');
        listings.forEach(listing => {
            listing.style.display = '';
        });
    }

    function toggleFilter(activate = null) {
        if (activate === null) {
            isFilteringActive = !isFilteringActive;
        } else {
            isFilteringActive = activate;
        }

        if (isFilteringActive) {
            originalSearchTerm = getCurrentSearchTerm();
            filterListings();
            if (exactMatchButton) exactMatchButton.textContent = "Show All";
        } else {
            resetListings();
            if (exactMatchButton) exactMatchButton.textContent = "Exact Match";
        }
    }

    function createExactMatchButton() {
        let searchSubmitButton = document.getElementById('ah-search-submit');
        let searchForm = document.getElementById('ah-buy-form');

        if (!searchSubmitButton || !searchForm) return;

        exactMatchButton = document.createElement('button');
        exactMatchButton.type = 'button';
        exactMatchButton.id = 'fr-ah-exact-match-btn';
        exactMatchButton.textContent = 'Exact Match';

        exactMatchButton.style.cssText = `
            margin-left: 10px;
            padding: 5px 10px;
            color: white;
            font-weight: bold;
            background-color: #731d08;
            border: 1px solid #ccc;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
        `;

        exactMatchButton.addEventListener('mouseenter', function() {
             this.style.backgroundColor = '#4c1407';
        });
        exactMatchButton.addEventListener('mouseleave', function() {
             this.style.backgroundColor = '#731d08';
        });

        exactMatchButton.addEventListener('click', function() {
            toggleFilter();
        });

        let submitContainer = searchSubmitButton.closest('div');
        if (submitContainer && submitContainer.parentNode === searchForm) {
             submitContainer.parentNode.insertBefore(exactMatchButton, submitContainer.nextSibling);
        } else {
             searchSubmitButton.parentNode.insertBefore(exactMatchButton, searchSubmitButton.nextSibling);
        }

    }

    function handleFormSubmit(event) {
        if (isFilteringActive) {
             toggleFilter(false);
        }
    }

    let checkContentInterval = setInterval(() => {
        let ahContent = document.getElementById('ah-content');
        let searchForm = document.getElementById('ah-buy-form');
        if (ahContent && searchForm) {
            clearInterval(checkContentInterval);
            createExactMatchButton();
            searchForm.addEventListener('submit', handleFormSubmit);

            let paginationForm = document.getElementById('ah-pagination-form');
            if (paginationForm) {
                paginationForm.addEventListener('submit', handleFormSubmit);
            }

        }
    }, 500);

})();