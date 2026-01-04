// ==UserScript==
// @name         Bazaar Stock Helper
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  Scans your bazaar and adds a visual dot to items on the 'Add Items' page to show what's already in stock.
// @author       aquagloop
// @match        https://www.torn.com/bazaar.php*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/552457/Bazaar%20Stock%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/552457/Bazaar%20Stock%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const BAZAAR_ITEMS_KEY = 'torn_bazaar_items_list_v1';
    let processedPage = '';
    let isManagePageListenerActive = false;

    GM_addStyle(`
        .bh-in-bazaar, .bh-not-in-bazaar {
            position: relative !important;
        }
        .bh-in-bazaar::before {
            content: '';
            position: absolute;
            top: 4px;
            left: 4px;
            width: 10px;
            height: 10px;
            background-color: #4CAF50;
            border-radius: 50%;
            border: 1px solid rgba(0, 0, 0, 0.5);
            z-index: 100;
        }
        .bh-not-in-bazaar::before {
            content: '';
            position: absolute;
            top: 4px;
            left: 4px;
            width: 10px;
            height: 10px;
            background-color: #F44336;
            border-radius: 50%;
            border: 1px solid rgba(0, 0, 0, 0.5);
            z-index: 100;
        }
    `);

    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    const scanBazaarItems = async (isInitialScan = false) => {
        if (isInitialScan) {
            document.querySelectorAll('#manage-bazaar-list .bh-scanned-dot').forEach(dot => dot.remove());
        }

        const itemElements = document.querySelectorAll('#manage-bazaar-list .item___jLJcf[aria-label]');
        if (itemElements.length === 0) {
            return;
        }

        const storedData = await GM_getValue(BAZAAR_ITEMS_KEY, '[]');
        const bazaarItemsSet = isInitialScan ? new Set() : new Set(JSON.parse(storedData));

        itemElements.forEach(el => {
            const itemName = el.getAttribute('aria-label');
            if (itemName) {
                bazaarItemsSet.add(itemName);

                if (!el.querySelector('.bh-scanned-dot')) {
                    el.style.position = 'relative';
                    const dot = document.createElement('div');
                    dot.className = 'bh-scanned-dot';
                    dot.style.cssText = `
                        position: absolute;
                        top: 5px;
                        right: 5px;
                        width: 8px;
                        height: 8px;
                        background-color: #4CAF50;
                        border-radius: 50%;
                        border: 1px solid white;
                        box-shadow: 0 0 2px rgba(0,0,0,0.7);
                        z-index: 101;
                    `;
                    el.appendChild(dot);
                }
            }
        });

        const updatedItemNames = Array.from(bazaarItemsSet);
        await GM_setValue(BAZAAR_ITEMS_KEY, JSON.stringify(updatedItemNames));

        let confirmation = document.querySelector('#bazaar-scan-confirmation');
        if (!confirmation) {
            const saveButtonContainer = document.querySelector('.confirmation___eWdQi');
            if (saveButtonContainer) {
                confirmation = document.createElement('div');
                confirmation.id = 'bazaar-scan-confirmation';
                confirmation.style.cssText = 'color: #4CAF50; margin-left: 15px; font-weight: bold; display: inline-block; vertical-align: middle;';
                saveButtonContainer.appendChild(confirmation);
            }
        }
        if (confirmation) confirmation.textContent = `✓ Synced ${updatedItemNames.length} items.`;
    };

    const highlightInventoryItems = async () => {
        const storedData = await GM_getValue(BAZAAR_ITEMS_KEY, '[]');
        const bazaarItemsSet = new Set(JSON.parse(storedData));
        const titleElement = document.querySelector('.items-wrap .title-black');
        let infoMsg = document.querySelector('#bazaar-helper-info-msg');
        if (!infoMsg && titleElement) {
            infoMsg = document.createElement('p');
            infoMsg.id = 'bazaar-helper-info-msg';
            infoMsg.style.cssText = 'text-align: center; margin: 10px; font-weight: bold;';
            titleElement.insertAdjacentElement('afterend', infoMsg);
        }
        if (bazaarItemsSet.size === 0) {
            if (infoMsg) {
                infoMsg.textContent = 'Bazaar Helper: Go to the "Manage Bazaar" page to sync your items.';
                infoMsg.style.color = '#F44336';
            }
            return;
        } else {
            if (infoMsg) {
                infoMsg.textContent = 'Items in your bazaar have a green dot; others have a red dot.';
                infoMsg.style.color = '#888';
            }
        }
        const inventoryItems = document.querySelectorAll('ul.items-cont[style*="display: block"] > li.clearfix[data-group]');
        if (inventoryItems.length === 0) {
            return;
        }
        inventoryItems.forEach(item => {
            const itemName = item.querySelector('.name-wrap > .t-overflow')?.textContent;
            if (!itemName) return;
            item.classList.remove('bh-in-bazaar', 'bh-not-in-bazaar');
            if (bazaarItemsSet.has(itemName)) {
                item.classList.add('bh-in-bazaar');
            } else {
                item.classList.add('bh-not-in-bazaar');
            }
        });
    };

    const addTabClickListener = () => {
        const tabsContainer = document.querySelector('ul.ui-tabs-nav');
        if (tabsContainer && !tabsContainer.dataset.bhListenerAdded) {
            tabsContainer.addEventListener('click', () => {
                setTimeout(highlightInventoryItems, 250);
            });
            tabsContainer.dataset.bhListenerAdded = 'true';
        }
    };

    const debouncedScan = debounce(() => {
        scanBazaarItems(false);
    }, 400);

    setInterval(() => {
        const currentHash = window.location.hash;
        if (currentHash.includes('/manage')) {
            if (processedPage !== 'manage') {
                processedPage = 'manage';
                setTimeout(() => scanBazaarItems(true), 500);
            }
            if (!isManagePageListenerActive) {
                window.addEventListener('scroll', debouncedScan, true);
                isManagePageListenerActive = true;
            }
        } else {
            if (isManagePageListenerActive) {
                window.removeEventListener('scroll', debouncedScan, true);
                isManagePageListenerActive = false;
            }
            if (currentHash.includes('/add')) {
                if (processedPage !== 'add') {
                    processedPage = 'add';
                    setTimeout(() => {
                        highlightInventoryItems();
                        addTabClickListener();
                    }, 500);
                }
                addTabClickListener();
            } else {
                processedPage = '';
            }
        }
    }, 250);

})();

