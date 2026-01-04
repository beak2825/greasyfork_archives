// ==UserScript==
// @name         Goatlings HA Buddy Item Search
// @namespace    https://greasyfork.org/en/users/322117
// @version      1.0
// @description  Add search functionality to HA Buddy items
// @author       mechagotch
// @match        https://www.goatlings.com/habuddy*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555154/Goatlings%20HA%20Buddy%20Item%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/555154/Goatlings%20HA%20Buddy%20Item%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (document.readyState !== 'loading') {
        initSearch();
    } else {
        document.addEventListener("DOMContentLoaded", initSearch);
    }

    function initSearch() {
        const categoryContainer = document.querySelector('.categories');
        if (!categoryContainer) return;

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.id = 'itemSearchInput';
        searchInput.className = 'button';
        searchInput.placeholder = "Search items"

        const clearButton = document.createElement('input');
        clearButton.type = 'button';
        clearButton.id = 'clearSearchButton';
        clearButton.className = 'button';
        clearButton.value = 'Clear Search';

        searchInput.style.marginRight = '5px';

        categoryContainer.insertBefore(clearButton, categoryContainer.firstChild);
        categoryContainer.insertBefore(searchInput, clearButton);

        searchInput.addEventListener('input', function() {
            filterItems(this.value);
        });

        clearButton.addEventListener('click', function() {
            searchInput.value = '';
            filterItems('');
            searchInput.focus();
        });

        const categoryButtons = document.querySelectorAll('.categories input[type="button"]');
        categoryButtons.forEach(button => {
            button.addEventListener('click', function() {
                searchInput.value = '';
                filterItems('');
            });
        });

        function filterItems(searchTerm) {
            const items = document.querySelectorAll('#item_area_ajax .closetItem');
            const lowerSearchTerm = searchTerm.toLowerCase();

            items.forEach(item => {
                const itemName = item.textContent.toLowerCase();
                if (itemName.includes(lowerSearchTerm)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        }

        const style = document.createElement('style');
        style.textContent = `#itemSearchInput {margin-right: 3px;} #clearSearchButton {margin-right: 3px;}`;
        document.head.appendChild(style);
    }

})();