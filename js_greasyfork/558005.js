// ==UserScript==
// @name         Neopets NPC Shop Pricer
// @namespace    http://tampermonkey.net/
// @version      1.0.7
// @description  Checks item prices in modern NPC shops against ItemDB market value, with compact styling and link to ItemDB.
// @author       Logan Bell
// @match        *://www.neopets.com/objects.phtml?*type=shop*
// @match        *://www.neopets.com/objects.phtml?obj_type=*
// @connect      itemdb.com.br
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558005/Neopets%20NPC%20Shop%20Pricer.user.js
// @updateURL https://update.greasyfork.org/scripts/558005/Neopets%20NPC%20Shop%20Pricer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Neopets Shop Pricer V4.0: Script started.");

    // --- Configuration ---
    const API_URL = "https://itemdb.com.br/api/v1/items/many";
    const ITEMDB_BASE_URL = "https://itemdb.com.br/item/";

    // --- GUI: Status Box ---
    const statusBox = document.createElement('div');
    statusBox.id = 'gemini-status-box';
    statusBox.style.cssText = `
        position: fixed; bottom: 10px; right: 10px; padding: 6px;
        background: #f7f7f7; border: 1px solid #ccc; z-index: 9999;
        font-size: 11px; font-weight: bold; border-radius: 4px;
    `;
    statusBox.innerText = 'Shop Scanner V4.0: Ready';
    document.body.appendChild(statusBox);

    // --- Helper Functions ---
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // NEW: Creates a URL slug from the item name
    function createSlug(name) {
        return name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }

    // --- Main Logic ---

    // 1. Find all items using the new class structure
    const items = [];
    const itemContainers = document.querySelectorAll('.shop-item');

    itemContainers.forEach((container) => {
        const itemImg = container.querySelector('.item-img');
        const itemNameNode = container.querySelector('.item-name b');
        const itemPriceNode = container.querySelector('.item-stock:last-child');

        if (itemImg && itemNameNode && itemPriceNode) {
            const name = itemImg.getAttribute('data-name');

            // FIX for Comma Bug: Remove all commas before parsing the price
            const shopPrice = parseInt(itemImg.getAttribute('data-price').replace(/,/g, ''), 10);

            if (container.querySelector('.gemini-price-check')) return;

            // Create container for result
            const resultDiv = document.createElement('div');
            resultDiv.className = 'gemini-price-check';
            resultDiv.style.marginTop = "0"; // <-- MODIFIED FOR V1.0.7

            container.appendChild(resultDiv);

            items.push({
                name: name,
                shopPrice: shopPrice,
                element: resultDiv,
                container: container
            });
        }
    });

    console.log(`Shop Pricer V4.0: Found ${items.length} items to check.`);
    statusBox.innerText = `Scanner: Found ${items.length} items...`;
    if (items.length === 0) {
        statusBox.innerText = "Scanner: No items found with modern selector.";
        return;
    }

    // 2. Fetch Data
    const itemNames = items.map(i => i.name);
    GM_xmlhttpRequest({
        method: "POST",
        url: API_URL,
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify({ name: itemNames }),
        onload: function(response) {
            if (response.status !== 200) {
                console.error("API Error:", response.statusText);
                statusBox.innerText = "Error: API Failed";
                return;
            }

            try {
                const data = JSON.parse(response.responseText);
                updatePrices(data);
                statusBox.innerText = "Neoscan: Complete!";
                setTimeout(() => statusBox.remove(), 5000);
            } catch (e) {
                console.error("JSON Parse Error:", e);
                statusBox.innerText = "Error: Bad Data";
            }
        },
        onerror: function(err) {
            console.error("Request Failed:", err);
            statusBox.innerText = "Error: Check Permissions";
        }
    });

    // 3. Update UI (Includes compact styling, no NP suffix, and link to ItemDB)
    function updatePrices(apiData) {
        items.forEach(item => {
            const itemData = apiData[item.name];
            const itemSlug = createSlug(item.name);
            const itemDBLink = ITEMDB_BASE_URL + itemSlug;

            // Start of the link structure
            const linkStart = `<a href="${itemDBLink}" target="_blank" style="text-decoration: none; color: inherit;">`;
            const linkEnd = `</a>`;


            if (itemData && itemData.price && itemData.price.value) {
                const marketPrice = itemData.price.value;
                const profit = marketPrice - item.shopPrice;

                // Styling
                if (profit > 0) {
                    item.element.innerHTML = `
                        ${linkStart}
                        <div style="text-align: center; color: #008000; padding: 2px 4px; border-radius: 4px; font-weight: bold; font-size: 0.75em; line-height: 1.1;">
                            Market: ${formatNumber(marketPrice)}<br>
                            Profit: +${formatNumber(profit)}
                        </div>
                        ${linkEnd}`;
                } else {
                    item.element.innerHTML = `
                        ${linkStart}
                        <div style="text-align: center; color: #a0a0a0; font-size: 0.7em; padding: 2px 4px; line-height: 1.1;">
                            Market: ${formatNumber(marketPrice)}<br>
                            Loss: ${formatNumber(profit)}
                        </div>
                        ${linkEnd}`;
                }
            } else {
                item.element.innerHTML = `<span style="color: #aaa; font-size: 0.7em;">No ItemDB Data</span>`;
            }
        });
    }

})();