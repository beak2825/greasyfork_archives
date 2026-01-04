// ==UserScript==
// @name          Neopets User Shop 'Market Value Display'
// @namespace     http://tampermonkey.net/
// @version       1.0.10
// @description   Displays ItemDB market price and profit margin in a player shop.
// @author        Logan Bell (Modified by AI)
// @match         https://www.neopets.com/browseshop.phtml*owner=*
// @connect       itemdb.com.br
// @grant         GM_xmlhttpRequest
// @run-at        document-end
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/558002/Neopets%20User%20Shop%20%27Market%20Value%20Display%27.user.js
// @updateURL https://update.greasyfork.org/scripts/558002/Neopets%20User%20Shop%20%27Market%20Value%20Display%27.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const API_URL = "https://itemdb.com.br/api/v1/items/many";
    const ITEMDB_BASE_URL = "https://itemdb.com.br/item/";
    // New class for the price check result container
    const PRICE_CHECK_CLASS = 'gemini-user-shop-price-check';

    // --- GUI: Status Box for Debugging ---
    const statusBox = document.createElement('div');
    statusBox.id = 'gemini-status-box';
    statusBox.style.cssText = `
        position: fixed; bottom: 10px; right: 10px; padding: 6px 10px;
        background: #fff3cd; border: 1px solid #ffeeba; z-index: 9999;
        font-size: 11px; font-weight: bold; border-radius: 4px; color: #664d03;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    `;
    statusBox.innerText = 'Market Value Display V1.9: Starting...';
    document.body.appendChild(statusBox);

    // --- Helper Functions ---

    function updateStatus(text, color = '#664d03', background = '#fff3cd') {
        statusBox.innerText = text;
        statusBox.style.color = color;
        statusBox.style.background = background;
    }

    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function createSlug(name) {
        return name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }

    /** Helper function to find the insertion point and clean up existing breaks */
    function findInsertionPoint(cell) {
        let targetNode = null;
        // Find the node that contains the "Cost :" text.
        for (const node of cell.childNodes) {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.includes('Cost :')) {
                targetNode = node;
                break;
            }
        }
        return targetNode;
    }

    /** Injects the formatted price/profit HTML into the cell */
    function injectResult(cell, htmlContent) {
        // Find the insertion point
        const targetNode = findInsertionPoint(cell);
        if (!targetNode) {
            return;
        }

        // Clean up any stray <br> tags or empty text nodes immediately following the target text node
        let nextNode = targetNode.nextSibling;
        while(nextNode && (nextNode.nodeName === 'BR' || nextNode.nodeType === Node.TEXT_NODE && nextNode.textContent.trim() === '')) {
            const toRemove = nextNode;
            nextNode = nextNode.nextSibling;
            toRemove.remove();
        }

        // Add a line break after the price line
        const newBr = document.createElement('br');
        cell.appendChild(newBr);

        // Create and append the result container div
        const resultDiv = document.createElement('div');
        resultDiv.className = PRICE_CHECK_CLASS;
        resultDiv.style.marginTop = "2px";
        resultDiv.innerHTML = htmlContent;

        cell.appendChild(resultDiv);
    }


    // --- Main Logic ---

    const items = [];
    // 1. Find all shop items and extract data
    const itemCells = document.querySelectorAll('td[width="120"][align="center"][valign="top"]');

    if (itemCells.length === 0) {
        updateStatus("Display: No items found with selector.", 'red', '#f8d7da');
        return;
    }

    updateStatus(`Display V1.9: Found ${itemCells.length} items. Collecting data...`);
    console.log(`Display V1.9: Found ${itemCells.length} items to check.`);

    itemCells.forEach(cell => {
        // Skip if result is already injected
        if (cell.querySelector(`.${PRICE_CHECK_CLASS}`)) {
            return;
        }

        const itemNameNode = cell.querySelector('b');
        const cellHTML = cell.innerHTML;
        const priceMatch = cellHTML.match(/Cost\s*:\s*([\d,]+)\s*NP/);

        const name = itemNameNode ? itemNameNode.textContent.trim() : null;
        const shopPrice = priceMatch ? parseInt(priceMatch[1].replace(/,/g, ''), 10) : null;

        if (name && shopPrice !== null) {
            items.push({
                name: name,
                shopPrice: shopPrice,
                cell: cell // Store the cell reference
            });
        }
    });

    if (items.length === 0) {
        updateStatus("Display: Could not extract item data.", 'red', '#f8d7da');
        return;
    }

    // 2. Fetch Data for all items in one API call
    const itemNames = items.map(i => i.name);
    updateStatus(`Display V1.9: Fetching prices for ${items.length} items...`);

    GM_xmlhttpRequest({
        method: "POST",
        url: API_URL,
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify({ name: itemNames }),
        onload: function(response) {
            if (response.status !== 200) {
                console.error("API Error:", response.statusText);
                updateStatus("Error: API Failed", 'red', '#f8d7da');
                return;
            }

            try {
                const data = JSON.parse(response.responseText);
                updateUI(data); // Call function to update UI after successful fetch
                updateStatus("Display V1.9: Complete!", 'green', '#d4edda');
                setTimeout(() => statusBox.remove(), 5000);
            } catch (e) {
                console.error("JSON Parse Error:", e);
                updateStatus("Error: Bad Data", 'red', '#f8d7da');
            }
        },
        onerror: function(err) {
            console.error("Request Failed:", err);
            updateStatus("Error: Check Permissions", 'red', '#f8d7da');
        }
    });

    // 3. Update UI
    function updateUI(apiData) {
        items.forEach(item => {
            const itemData = apiData[item.name];
            const itemSlug = createSlug(item.name);
            const itemDBLink = ITEMDB_BASE_URL + itemSlug;

            // Start of the link structure
            const linkStart = `<a href="${itemDBLink}" target="_blank" style="text-decoration: none; color: inherit;">`;
            const linkEnd = `</a>`;

            let htmlContent = '';

            if (itemData && itemData.price && itemData.price.value) {
                const marketPrice = itemData.price.value;
                const profit = marketPrice - item.shopPrice;

                // Styling logic from the second script
                if (profit > 0) {
                    htmlContent = `
                        ${linkStart}
                        <div style="text-align: center; color: #008000; padding: 2px 4px; border-radius: 4px; font-weight: bold; font-size: 0.9em; line-height: 1.1;">
                            Market: ${formatNumber(marketPrice)}<br>
                            Profit: +${formatNumber(profit)}
                        </div>
                        ${linkEnd}`;
                } else {
                    htmlContent = `
                        ${linkStart}
                        <div style="text-align: center; color: #a0a0a0; font-size: 0.8em; padding: 2px 4px; line-height: 1.1;">
                            Market: ${formatNumber(marketPrice)}<br>
                            Loss: ${formatNumber(profit)}
                        </div>
                        ${linkEnd}`;
                }
            } else {
                htmlContent = `<span style="color: #aaa; font-size: 0.7em;">No ItemDB Data</span>`;
            }

            injectResult(item.cell, htmlContent);
        });
    }

})();