// ==UserScript==
// @name         Amazon Wish List Valuer
// @namespace    https://greasyfork.org/en/users/1262395-grinnch
// @version      1.2
// @description  Displays the total value of an Amazon wish list
// @author       grinnch
// @license      MIT
// @match        https://www.amazon.com/hz/wishlist/*
// @match        https://www.amazon.ca/hz/wishlist/*
// @match        https://www.amazon.co.uk/hz/wishlist/*
// @icon         https://www.wildbirdfund.org/wp-content/uploads/2016/04/UWL_SWF_shims._CB368675346_.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554727/Amazon%20Wish%20List%20Valuer.user.js
// @updateURL https://update.greasyfork.org/scripts/554727/Amazon%20Wish%20List%20Valuer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'wishlistToggleStates';

    // Helpers
    const loadStates = () => {
        const storedStates = localStorage.getItem(STORAGE_KEY);
        return storedStates ? JSON.parse(storedStates) : {};
    };

    const saveState = (itemId, isChecked) => {
        const states = loadStates();
        states[itemId] = isChecked;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(states));
    };

    // UI Setup
    const titleElement = document.getElementById('profile-list-name');
    if (!titleElement) return;

    const displayNode = document.createElement("span");
    displayNode.id = 'ws-total-display';
    displayNode.style.marginLeft = '10px';
    titleElement.appendChild(displayNode);

    // Core Logic
    const recalculateTotal = () => {
        let sum = 0;
        const allItemRows = document.querySelectorAll('#g-items > li.ws-item-row');

        allItemRows.forEach(row => {
            const checkbox = row.querySelector('.ws-toggle-include');
            if (checkbox && checkbox.checked) {
                sum += parseFloat(row.dataset.price);
            }
        });

        const finalSum = sum.toFixed(2);
        const sumWithTax = (sum * 1.13).toFixed(2);
        const firstSymbolEl = document.querySelector('.a-price-symbol');
        const symbol = firstSymbolEl ? firstSymbolEl.textContent : '$';

        displayNode.textContent = `(Total: ${symbol}${finalSum} / ${symbol}${sumWithTax} with ~13% tax)`;
    };

    const processItem = (listItem) => {
        if (listItem.dataset.wsProcessed === "true") return;

        const priceEl = listItem.querySelector('[id^=itemPrice_]');
        const actionContainer = listItem.querySelector('[id^=itemAction_]');
        const savedStates = loadStates();

        if (priceEl && actionContainer) {
            const itemId = actionContainer.id.replace('itemAction_', '');
            const wholePart = priceEl.querySelector('.a-price-whole');
            const fractionPart = priceEl.querySelector('.a-price-fraction');

            if (wholePart && fractionPart) {
                const whole = wholePart.textContent.replace(/[,.]/g, '').trim();
                const fraction = fractionPart.textContent.trim();
                const cost = parseFloat(`${whole}.${fraction}`);

                if (!isNaN(cost)) {
                    listItem.classList.add('ws-item-row');
                    listItem.dataset.price = cost;

                    const toggleContainer = document.createElement('div');
                    toggleContainer.style.cssText = 'margin-top: 8px; color: #333; font-size: 13px;';

                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.className = 'ws-toggle-include';
                    // Default to true if not saved, otherwise use saved state
                    checkbox.checked = savedStates[itemId] !== false;
                    checkbox.style.cssText = 'margin-right: 5px; vertical-align: middle; position: relative; top: -1px;';

                    checkbox.addEventListener('change', () => {
                        saveState(itemId, checkbox.checked);
                        recalculateTotal();
                    });

                    const label = document.createElement('label');
                    label.style.cssText = 'cursor: pointer; font-weight: normal;';
                    label.appendChild(checkbox);
                    label.appendChild(document.createTextNode('Include in Total'));

                    toggleContainer.appendChild(label);
                    actionContainer.appendChild(toggleContainer);
                }
            }
        }

        listItem.dataset.wsProcessed = "true";
    };

    // Initialization & Observer
    const listContainer = document.getElementById('g-items');

    if (listContainer) {
        const existingItems = listContainer.querySelectorAll('li');
        existingItems.forEach(processItem);
        recalculateTotal();

        const observer = new MutationObserver((mutations) => {
            let shouldRecalc = false;

            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1 && node.tagName === 'LI') {
                            processItem(node);
                            shouldRecalc = true;
                        }
                    });
                }
            });

            if (shouldRecalc) {
                recalculateTotal();
            }
        });

        observer.observe(listContainer, { childList: true });
    }

})();