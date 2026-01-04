// ==UserScript==
// @name         LostCity Markets: Additional Functions
// @namespace    http://tampermonkey.net/
// @version      3.4
// @description  Hide listings from blocked sellers or items. Shift-click item icons to block them instantly on lostcity.markets pages.
// @match        https://lostcity.markets/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554255/LostCity%20Markets%3A%20Additional%20Functions.user.js
// @updateURL https://update.greasyfork.org/scripts/554255/LostCity%20Markets%3A%20Additional%20Functions.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const SELLER_KEY = 'blockedSellersList';
    const ITEM_KEY = 'blockedItemsList';

    function getList(key) {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : [];
    }

    function saveList(key, list) {
        localStorage.setItem(key, JSON.stringify(list));
    }

    function normalizeName(name) {
        return name.trim().toLowerCase().replace(/\s+/g, ' ');
    }

    function hideListings() {
        const blockedSellers = getList(SELLER_KEY).map(normalizeName);
        const blockedItems = getList(ITEM_KEY).map(normalizeName);
        const rows = document.querySelectorAll('tr');

        rows.forEach(row => {
            const sellerLink = row.querySelector('a[href^="/users/"]');
            const itemImg = row.querySelector('img[alt$="Icon"]');

            const sellerName = sellerLink?.textContent.trim();
            const itemAlt = itemImg?.getAttribute('alt') || '';
            const itemName = itemAlt.replace(/ icon$/i, '').trim();

            const isBlockedSeller = sellerName && blockedSellers.includes(normalizeName(sellerName));
            const isBlockedItem = itemName && blockedItems.includes(normalizeName(itemName));

            row.style.display = (isBlockedSeller || isBlockedItem) ? 'none' : '';
        });
    }

    function createButton(label, onClick, offsetY) {
        const button = document.createElement('button');
        button.textContent = label;
        Object.assign(button.style, {
            position: 'fixed',
            top: `${offsetY}px`,
            left: '20px',
            zIndex: 10000,
            width: '160px',
            height: '40px',
            padding: '8px',
            backgroundColor: '#222',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
            textAlign: 'center'
        });
        button.addEventListener('click', onClick);
        document.body.appendChild(button);
    }

    function addBlockUnblockButtons() {
        // Seller block
        createButton('🔕 Block Seller', () => {
            const name = prompt('Enter seller name to block:');
            if (name) {
                const list = getList(SELLER_KEY);
                const norm = normalizeName(name);
                if (!list.map(normalizeName).includes(norm)) {
                    list.push(name.trim());
                    saveList(SELLER_KEY, list);
                    hideListings();
                    alert(`Seller "${name}" has been blocked.`);
                } else {
                    alert(`Seller "${name}" is already blocked.`);
                }
            }
        }, 20);

        // Seller unblock
        createButton('✅ Unblock Seller', () => {
            const list = getList(SELLER_KEY);
            if (list.length === 0) return alert('Your seller block list is empty.');
            const name = prompt(`Blocked sellers:\n${list.join(', ')}\n\nEnter seller name to unblock:`);
            const norm = normalizeName(name);
            const updated = list.filter(s => normalizeName(s) !== norm);
            if (updated.length < list.length) {
                saveList(SELLER_KEY, updated);
                alert(`Seller "${name}" has been unblocked.`);
                location.reload();
            } else {
                alert(`Seller "${name}" is not in your block list.`);
            }
        }, 70);

        // Item block
        createButton('📦 Block Item', () => {
            const itemName = prompt('Enter item name to block (e.g., Runite Bar):');
            if (itemName) {
                const list = getList(ITEM_KEY);
                const norm = normalizeName(itemName);
                if (!list.map(normalizeName).includes(norm)) {
                    list.push(itemName.trim());
                    saveList(ITEM_KEY, list);
                    hideListings();
                    alert(`Item "${itemName}" has been blocked.`);
                } else {
                    alert(`Item "${itemName}" is already blocked.`);
                }
            }
        }, 120);

        // Item unblock
        createButton('📦 Unblock Item', () => {
            const list = getList(ITEM_KEY);
            if (list.length === 0) return alert('Your item block list is empty.');
            const itemName = prompt(`Blocked items:\n${list.join(', ')}\n\nEnter item name to unblock:`);
            const norm = normalizeName(itemName);
            const updated = list.filter(i => normalizeName(i) !== norm);
            if (updated.length < list.length) {
                saveList(ITEM_KEY, updated);
                alert(`Item "${itemName}" has been unblocked.`);
                location.reload();
            } else {
                alert(`Item "${itemName}" is not in your block list.`);
            }
        }, 170);
    }

    function enableShiftClickBlocking() {
        document.addEventListener('click', e => {
            if (e.shiftKey && e.target.tagName === 'IMG' && e.target.alt.endsWith('Icon')) {
                const itemName = e.target.alt.replace(/ icon$/i, '').trim();
                const norm = normalizeName(itemName);
                const list = getList(ITEM_KEY);
                if (!list.map(normalizeName).includes(norm)) {
                    list.push(itemName);
                    saveList(ITEM_KEY, list);
                    hideListings();
                    alert(`Item "${itemName}" has been blocked via Shift+Click.`);
                } else {
                    alert(`Item "${itemName}" is already blocked.`);
                }
                e.preventDefault();
                e.stopPropagation();
            }
        }, true);
    }

    function addInstructionLabel() {
    const label = document.createElement('div');
    label.textContent = '💡 Shift-click an item icon to add it to your block list.';
    Object.assign(label.style, {
        position: 'fixed',
        top: '220px',
        left: '20px',
        zIndex: 10000,
        width: '260px',
        padding: '10px',
        backgroundColor: '#222',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        fontSize: '13px',
        fontFamily: 'sans-serif',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        textAlign: 'center'
    });
    document.body.appendChild(label);
}


    // Initialize
    hideListings();
    addBlockUnblockButtons();
    enableShiftClickBlocking();
    addInstructionLabel();

    const observer = new MutationObserver(hideListings);
    observer.observe(document.body, { childList: true, subtree: true });
})();
