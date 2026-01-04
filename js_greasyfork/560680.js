// ==UserScript==
// @name         Torn Item Market & Bazaar Stock Labels by srsbsns
// @namespace    http://torn.com/
// @version      10.6
// @description  Manual Scrape: Bazaar (Own Stock: x#) | Market (Stock x#). Excludes Market AddListing.
// @author       Gemini
// @match        *://www.torn.com/item.php*
// @match        *://www.torn.com/page.php?sid=ItemMarket*
// @match        *://www.torn.com/bazaar.php?userId=*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560680/Torn%20Item%20Market%20%20Bazaar%20Stock%20Labels%20by%20srsbsns.user.js
// @updateURL https://update.greasyfork.org/scripts/560680/Torn%20Item%20Market%20%20Bazaar%20Stock%20Labels%20by%20srsbsns.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CLEANING LOGIC ---
    function getCleanKey(text) {
        if (!text) return "";
        let clean = text.split('$')[0].split('|')[0].split('\n')[0].trim();
        clean = clean.replace(/\.\.\./g, '');
        return clean.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
    }

    // --- SCRAPER (Only runs on your Item page) ---
    function scrapeInventory() {
        const inventoryData = {};
        const qtyElements = document.querySelectorAll('.qty, .item-amount, [class*="quantity"]');

        qtyElements.forEach(qtyEl => {
            const parentLi = qtyEl.closest('li');
            if (!parentLi) return;
            const nameEl = parentLi.querySelector('.name');
            if (nameEl) {
                const nameText = nameEl.childNodes[0] ? nameEl.childNodes[0].textContent : nameEl.textContent;
                const key = getCleanKey(nameText);
                const rawQty = qtyEl.textContent.replace(/[^\d]/g, '').trim();
                const qty = rawQty.length > 0 ? parseInt(rawQty) : 1;
                if (key && key.length > 1) inventoryData[key] = qty;
            }
        });

        if (Object.keys(inventoryData).length > 0) {
            localStorage.setItem('torn_owned_stock', JSON.stringify(inventoryData));
        }
    }

    // --- INJECTION (Market & Other Player Bazaars) ---
    function injectBadges() {
        const url = window.location.href;
        const hash = window.location.hash;

        // NEW FIX: Stop injection if we are on the "Add Listing" screen of the Market
        if (url.includes('ItemMarket') && hash.includes('/addListing')) {
            return;
        }

        const stock = JSON.parse(localStorage.getItem('torn_owned_stock') || '{}');
        const isBazaar = url.includes('bazaar.php');

        const allNames = document.querySelectorAll('[class*="name_"], [class*="title_"], .name, [class*="itemName"], .desc');

        allNames.forEach(nameEl => {
            if (nameEl.closest('#sidebarroot')) return;

            const parent = nameEl.closest('li') || nameEl.parentElement;
            if (nameEl.querySelector('.tm-stock-text') || (parent && parent.querySelector('.tm-stock-text'))) {
                return;
            }

            const nameText = nameEl.textContent;
            const key = getCleanKey(nameText);

            let count = stock[key];
            if (count === undefined) {
                const stockKeys = Object.keys(stock);
                const match = stockKeys.find(sKey => sKey.startsWith(key) || key.startsWith(sKey));
                if (match) count = stock[match];
            }

            if (count !== undefined) {
                const stockSpan = document.createElement('div');
                stockSpan.className = 'tm-stock-text';

                const labelPrefix = isBazaar ? "Own Stock:" : "Stock";
                stockSpan.innerText = `(${labelPrefix} x${count})`;

                stockSpan.style.cssText = `
                    display: block;
                    font-size: 11px;
                    font-weight: bold;
                    color: ${count > 0 ? '#77dd77' : '#ff4444'};
                    margin-top: 1px;
                    pointer-events: none;
                `;

                nameEl.style.height = 'auto';
                nameEl.style.display = 'block';
                nameEl.appendChild(stockSpan);
            }
        });
    }

    // --- MAIN LOOP ---
    setInterval(() => {
        const url = window.location.href;
        if (url.includes('item.php') && !url.includes('ItemMarket')) {
            scrapeInventory();
        } else {
            injectBadges();
        }
    }, 1200);

})();