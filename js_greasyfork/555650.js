// ==UserScript==
// @name         P3 Quantity Sorter Most > Least
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Sort FancySelectorList items from highest to lowest quantity, with toggle control and auto-resort when the list changes
// @match        https://pocketpumapets.com/*
// @icon         https://www.pocketpumapets.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555650/P3%20Quantity%20Sorter%20Most%20%3E%20Least.user.js
// @updateURL https://update.greasyfork.org/scripts/555650/P3%20Quantity%20Sorter%20Most%20%3E%20Least.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const BUTTON_ID = 'p3-fancy-sort-toggle';
    const DEBOUNCE_MS = 150;

    // wait for the list to appear
    function waitForList() {
        const list = document.querySelector('.FancySelectorList');
        if (!list) {
            setTimeout(waitForList, 500);
            return;
        }
        initSorter(list);
    }

    // get the "item" elements inside the FancySelectorList robustly
    // uses the .FancySelectorInfoLine element -> its parent container is considered the item
    function getItemElements(list) {
        const infoLines = Array.from(list.querySelectorAll('.FancySelectorInfoLine'));
        const items = [];
        const seen = new Set();
        for (const info of infoLines) {
            const item = info.parentElement;
            if (item && !seen.has(item)) {
                seen.add(item);
                items.push(item);
            }
        }
        // fallback: if no .FancySelectorInfoLine found, try immediate children of the inner wrapper
        if (items.length === 0) {
            // find deepest single wrapper that contains many children
            const candidate = list.querySelector('div');
            if (candidate) {
                return Array.from(candidate.children);
            }
            return Array.from(list.children);
        }
        return items;
    }

    function initSorter(list) {
        // Establish initial original order (only for the current items present at init)
        let originalOrder = getItemElements(list);

        // create toggle button if not already present
        if (!document.getElementById(BUTTON_ID)) {
            const toggle = document.createElement('button');
            toggle.id = BUTTON_ID;
            toggle.textContent = '🔽 Sort by Qty';
            Object.assign(toggle.style, {
                position: 'fixed',
                top: '10px',
                right: '10px',
                zIndex: '99999',
                padding: '6px 10px',
                fontSize: '13px',
                borderRadius: '6px',
                border: '1px solid #444',
                background: '#f6f6f6',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
            });
            document.body.appendChild(toggle);

            let isSorted = false;
            let debounceTimeout = null;

            // observer to watch for added/removed items and re-sort if enabled
            const observer = new MutationObserver(() => {
                if (!isSorted) return;
                if (debounceTimeout) clearTimeout(debounceTimeout);
                debounceTimeout = setTimeout(() => {
                    sortItems(list);
                }, DEBOUNCE_MS);
            });

            // start observing the list (childList and subtree to catch dynamic updates)
            observer.observe(list, { childList: true, subtree: true });

            toggle.addEventListener('click', () => {
                if (!isSorted) {
                    // rebuild originalOrder to the current order at time of sorting,
                    // so "unsort" will restore to the order before sorting
                    originalOrder = getItemElements(list);
                    sortItems(list);
                    toggle.textContent = '🔼 Unsort';
                    isSorted = true;
                } else {
                    restoreOriginal(list, originalOrder);
                    toggle.textContent = '🔽 Sort by Qty';
                    isSorted = false;
                }
            });

            // also add double-click => force-resort (handy)
            toggle.addEventListener('dblclick', () => {
                sortItems(list);
            });
        }
    }

    // parse "x 34" style text into integer
    function parseQtyFromElement(item) {
        const info = item.querySelector('.FancySelectorInfoLine');
        if (!info) return 0;
        const text = info.textContent || '';
        const m = text.match(/(\d+)/);
        return m ? parseInt(m[1], 10) : 0;
    }

    function sortItems(list) {
        const items = getItemElements(list);
        if (items.length <= 1) return;

        // stable sort by quantity descending
        const itemsWithIndex = items.map((el, i) => ({ el, i, qty: parseQtyFromElement(el) }));
        itemsWithIndex.sort((a, b) => {
            if (b.qty !== a.qty) return b.qty - a.qty;
            return a.i - b.i; // stable fallback: original order
        });

        // Append sorted elements into the parent container of the first item.
        // We need to find the correct container to append to: often items are direct children of a wrapper <div> inside .FancySelectorList
        const container = items[0].parentElement;
        if (!container) return;

        for (const itemObj of itemsWithIndex) {
            container.appendChild(itemObj.el);
        }
    }

    // restore originalOrder (items that no longer exist are ignored),
    // any new items not in originalOrder are appended after restored originals
    function restoreOriginal(list, originalOrder) {
        const currentItems = getItemElements(list);
        if (originalOrder.length === 0) return;

        // find container to append into (use parentElement of currentItems[0] or originalOrder[0])
        const container = (currentItems[0] || originalOrder[0]).parentElement;
        if (!container) return;

        const presentSet = new Set(currentItems);
        // append originals that still exist, in original order
        for (const item of originalOrder) {
            if (presentSet.has(item)) {
                container.appendChild(item);
                presentSet.delete(item);
            }
        }
        // append any remaining items (new items that were not in originalOrder)
        for (const item of currentItems) {
            if (presentSet.has(item)) {
                container.appendChild(item);
            }
        }
    }

    waitForList();
})();
