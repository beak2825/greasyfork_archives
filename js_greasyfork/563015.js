// ==UserScript==
// @name         BTN - Fix User Profile Degraded Performance
// @namespace    delgan-btn-series-recommendation-fix
// @version      1.0.0
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

    function createSeriesDatalist(data) {
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

        const fragment = document.createDocumentFragment();
        data.forEach(item => {
            const opt = document.createElement('option');
            opt.value = item.text;
            opt.dataset.id = item.value;
            fragment.appendChild(opt);
        });
        datalist.appendChild(fragment);

        searchInput.addEventListener('input', (e) => {
            const val = e.target.value;
            const item = data.find(i => i.text === val);
            hiddenInput.value = item ? item.value : "";
        });

        return container;
    }

    function replaceSeriesSelectFromElement(el) {
        if (!el) {
            return false;
        }

        // The problem is due to the "Series Recommendation" feature.
        // It displays thousands of options in a select dropdown, which degrades performance significantly.
        // To fix this, we replace the select element with a datalist input that allows searching.
        const select = el.querySelector('#dialog select[name="seriesid"]');

        if (!select) {
            return false;
        }


        const data = Array.from(select.options, option => ({
            value: option.value,
            text: option.text
        }));

        const datalist = createSeriesDatalist(data);

        select.parentNode.replaceChild(datalist, select);

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
