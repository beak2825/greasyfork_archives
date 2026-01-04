// ==UserScript==
// @name           Neopets 'My Shop' Pricer
// @namespace      http://tampermonkey.net/
// @version        1.0.3
// @description    Checks item prices in the user shop price editing table against ItemDB market value, injecting a "Market Price" column.
// @author         Logan Bell
// @match          https://www.neopets.com/market.phtml
// @match          https://www.neopets.com/market.phtml?type=your*
// @connect        itemdb.com.br
// @grant          GM_xmlhttpRequest
// @run-at         document-end
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/557882/Neopets%20%27My%20Shop%27%20Pricer.user.js
// @updateURL https://update.greasyfork.org/scripts/557882/Neopets%20%27My%20Shop%27%20Pricer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Neopets User Shop Pricer V1.3: Script started.");

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
        max-width: 250px; text-align: center;
    `;
    statusBox.innerText = 'User Shop Scanner: Ready';
    document.body.appendChild(statusBox);

    // --- Helper Functions ---
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // Creates a URL slug from the item name
    function createSlug(name) {
        return name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }

    // --- Main Logic ---

    // 1. Find the target table and inject the new header column
    const shopTable = document.querySelector('form[action="process_market.phtml"] > table');

    if (!shopTable) {
        statusBox.innerText = "Scanner: Shop table not found.";
        return;
    }

    const headerRow = shopTable.querySelector('tbody > tr:first-child');
    if (!headerRow || headerRow.children.length < 4) {
        statusBox.innerText = "Scanner: Header row not structured as expected.";
        return;
    }

    // Inject the new header column (Mkt. Price)
    const marketHeader = document.createElement('td');
    marketHeader.setAttribute('align', 'center');
    marketHeader.setAttribute('bgcolor', '#dddd77');
    marketHeader.innerHTML = '<b>Market</b>';

    // Find the 'Type' header (4th column, index 3) and insert after it
    const typeHeader = headerRow.children[3];
    headerRow.insertBefore(marketHeader, typeHeader.nextSibling);

    console.log("User Shop Pricer V1.3: Header column injected.");

    // 2. Scrape items from table rows
    const items = [];
    // Get all item rows (skip header row and footer row)
    const itemRows = Array.from(shopTable.querySelectorAll('tbody > tr')).slice(1, -1);

    itemRows.forEach((row, index) => {
        // The visible <td> cells we care about:
        // Index 0: Name, Index 3: Type, Index 4: Your Price (Input)
        const cells = row.querySelectorAll('td');

        if (cells.length < 5) {
            console.warn(`Skipping row ${index}: Not enough <td> elements found.`);
            return;
        }

        const nameElement = cells[0].querySelector('b');
        const typeCell = cells[3];

        // Scrape item name from the first <td> (index 0)
        const name = nameElement ? nameElement.innerText.trim() : null;

        if (!name) {
            console.warn(`Skipping row ${index}: Item name not found.`);
            return;
        }

        // Create the market price cell to inject
        const resultCell = document.createElement('td');
        resultCell.className = 'gemini-price-check';
        resultCell.setAttribute('align', 'center');
        resultCell.setAttribute('bgcolor', '#ffffcc');
        // Use white-space: nowrap to prevent numbers from wrapping and keep the column width consistent
        resultCell.style.cssText = 'white-space: nowrap; padding: 0 5px;';

        resultCell.innerHTML = '<span style="color: #666; font-size: 0.9em;">Checking...</span>';

        // Inject the new cell: insert after the 'Type' cell (index 3)
        row.insertBefore(resultCell, typeCell.nextSibling);

        items.push({
            name: name,
            shopPrice: 0,
            element: resultCell,
            container: row
        });
    });

    console.log(`User Shop Pricer V1.3: Found ${items.length} items to check.`);
    statusBox.innerText = `Scanner: Found ${items.length} items...`;

    if (items.length === 0) {
        statusBox.innerText = "Scanner: No items found in the table.";
        return;
    }

    // 3. Fetch Data
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
                statusBox.innerText = "Scanner: Complete!";
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

    // 4. Update UI
    function updatePrices(apiData) {
        items.forEach(item => {
            const itemData = apiData[item.name];
            const itemSlug = createSlug(item.name);
            const itemDBLink = ITEMDB_BASE_URL + itemSlug;

            // Link wrapper for the market price
            const linkStart = `<a href="${itemDBLink}" target="_blank" style="text-decoration: none; color: #000;">`;
            const linkEnd = `</a>`;

            if (itemData && itemData.price && itemData.price.value) {
                const marketPrice = itemData.price.value;

                // FIX FOR V1.0.3: Compact the template literal to a single line.
                // This prevents newlines and tabs from being inserted as literal whitespace (text nodes)
                // inside the <td>, allowing align="center" to work correctly.
                item.element.innerHTML = `${linkStart}<div style="font-size: 1.0em; font-weight: bold; line-height: 1.1; color: #333333; text-align: center;">${formatNumber(marketPrice)}</div>${linkEnd}`;

            } else {
                item.element.innerHTML = `<span style="color: #aaa; font-size: 0.9em;">No ItemDB Data</span>`;
            }
        });
    }

})();