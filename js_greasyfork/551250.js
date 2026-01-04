// ==UserScript==
// @name         Hide Roblox Items
// @namespace    khanh_dev
// @version      1.0
// @description  Hide items, auto saved, reset buttom
// @match        https://www.roblox.com/my/avatar*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/551250/Hide%20Roblox%20Items.user.js
// @updateURL https://update.greasyfork.org/scripts/551250/Hide%20Roblox%20Items.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'hiddenItemsList';

    function getHiddenItems() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    }

    function saveHiddenItems(list) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }

    function createStyledResetButton() {
        if (document.getElementById('reset-hidden-items')) return;

        const btnReset = document.createElement('button');
        btnReset.id = 'reset-hidden-items';
        btnReset.textContent = 'Reset Hided Items';

        btnReset.style.position = 'fixed';
        btnReset.style.top = '80px';
        btnReset.style.right = '1050px';
        btnReset.style.zIndex = '9999';
        btnReset.style.padding = '10px 20px';
        btnReset.style.fontSize = '14px';
        btnReset.style.fontWeight = 'bold';
        btnReset.style.color = '#fff';
        btnReset.style.backgroundColor = '#333';
        btnReset.style.border = 'none';
        btnReset.style.borderRadius = '8px';
        btnReset.style.cursor = 'pointer';
        btnReset.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
        btnReset.style.transition = 'background-color 0.2s ease';

        btnReset.onmouseenter = () => {
            btnReset.style.backgroundColor = '#555';
        };
        btnReset.onmouseleave = () => {
            btnReset.style.backgroundColor = '#333';
        };

        btnReset.onclick = () => {
            localStorage.removeItem(STORAGE_KEY);
            const allItems = document.querySelectorAll('li.item-card, li.list-item');
            allItems.forEach(item => {
                item.style.display = '';
            });
        };

        document.body.appendChild(btnReset);
    }

    function enhanceItems() {
        const hiddenItems = getHiddenItems();
        const items = document.querySelectorAll('li.item-card, li.list-item');

        items.forEach(item => {
            if (item.classList.contains('enhanced')) return;
            item.classList.add('enhanced');
            item.style.position = 'relative';

            const thumb = item.querySelector('.item-card-thumb-container');
            const itemName = thumb?.getAttribute('data-item-name')?.trim();

            if (itemName && hiddenItems.includes(itemName)) {
                item.style.display = 'none';
                return;
            }

            const btnHide = document.createElement('button');
            btnHide.textContent = 'Hide';
            btnHide.title = 'Hide this item';
            btnHide.style.position = 'absolute';
            btnHide.style.top = '4px';
            btnHide.style.right = '4px';
            btnHide.style.padding = '2px 8px';
            btnHide.style.fontSize = '12px';
            btnHide.style.background = '#ff4d4d';
            btnHide.style.color = '#fff';
            btnHide.style.border = 'none';
            btnHide.style.borderRadius = '4px';
            btnHide.style.cursor = 'pointer';
            btnHide.style.display = 'none';
            btnHide.style.zIndex = '10';

            btnHide.onclick = (e) => {
                e.stopPropagation();
                if (itemName) {
                    const updated = [...hiddenItems, itemName];
                    saveHiddenItems(updated);
                }
                item.style.display = 'none';
            };

            item.appendChild(btnHide);

            item.addEventListener('mouseenter', () => {
                btnHide.style.display = 'block';
            });

            item.addEventListener('mouseleave', () => {
                btnHide.style.display = 'none';
            });
        });
    }

    createStyledResetButton();

    const observer = new MutationObserver(() => {
        enhanceItems();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    enhanceItems();
})();
