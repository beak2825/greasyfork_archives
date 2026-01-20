// ==UserScript==
// @name         BTN - Fix User Profile Degraded Performance
// @namespace    delgan-btn-series-recommendation-fix
// @version      1.1.0
// @license      MIT
// @description  Fix performances degradation on user profile pages
// @match        https://broadcasthe.net/user.php?id=*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563015/BTN%20-%20Fix%20User%20Profile%20Degraded%20Performance.user.js
// @updateURL https://update.greasyfork.org/scripts/563015/BTN%20-%20Fix%20User%20Profile%20Degraded%20Performance.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function fetchSeriesData(query) {
        return fetch("/series_autocomplete.php?term=" + encodeURIComponent(query),
            {
                headers: { "Accept": "application/json" }
            })
            .then(response => {
                return response.json();
            });
    }

    function createAutocompleteInput() {
        const container = document.createElement('div');

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.id = 'series_search';
        searchInput.setAttribute('list', 'series_list');
        searchInput.placeholder = 'Type to search...';
        searchInput.autocomplete = 'off';

        const datalist = document.createElement('datalist');
        datalist.id = 'series_list';

        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = 'seriesid';
        hiddenInput.id = 'series_real_value';

        container.appendChild(searchInput);
        container.appendChild(datalist);
        container.appendChild(hiddenInput);

        searchInput.addEventListener("input", function () {
            const query = searchInput.value.trim();

            if (query.length < 2) {
                datalist.innerHTML = "";
                return;
            }

            // Prevent the datalist to show again on selection.
            for (const option of datalist.options) {
                if (option.value === query) {
                    return;
                }
            }

            fetchSeriesData(query)
                .then(data => {
                    datalist.innerHTML = "";
                    const fragment = document.createDocumentFragment();
                    data.forEach(item => {
                        const option = document.createElement("option");
                        option.value = item.label;
                        option.dataset.id = item.value;
                        fragment.appendChild(option);
                    });
                    datalist.appendChild(fragment);
                });
        });

        searchInput.addEventListener("change", function () {
            for (const option of datalist.options) {
                if (option.value === searchInput.value) {
                    hiddenInput.value = option.dataset.id;
                    return;
                }
            }
            hiddenInput.value = "";
        });

        return container;
    }


    function replaceSeriesSelectFromElement(el) {
        if (!el) {
            return false;
        }

        // The problem is due to the "Series Recommendation" feature.
        // It displays thousands of options in a select dropdown, which degrades performance significantly.
        // To fix this, we replace the select element with a custom autocomplete input.
        const select = el.querySelector('#dialog select[name="seriesid"]');

        if (!select) {
            return false;
        }

        // We can't simply parse the options from the select, because it's actually not complete.
        // Subsequent mutations will add more options, but that would freeze the browser again.
        // Therefore, we must remove the `<select>` on first appearance, and replace it with our own
        // autocomplete input that dynamically fetches series data from the REST API.
        const input = createAutocompleteInput();

        select.parentNode.replaceChild(input, select);

        return true;
    }

    // We need to remove the dropdown as soon as it appears to prevent the browser to start rendering it.
    const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                if (node.nodeType !== 1) {
                    continue
                };
                if (replaceSeriesSelectFromElement(node)) {
                    return;
                }
            }
        }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
})();