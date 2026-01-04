// ==UserScript==
// @name        Neopets 'Auction' Pricer
// @namespace   http://tampermonkey.net/
// @version     1.0.3
// @description Checks item prices in the Auction House table against ItemDB market value, injecting a "Market Price" column next to Current Price. Highlights the market price in RED if the Current Price exceeds the market value (overpay), or GREEN otherwise.
// @author      Logan Bell
// @match       https://www.neopets.com/auctions.phtml*
// @connect     itemdb.com.br
// @grant       GM_xmlhttpRequest
// @run-at      document-end
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/557881/Neopets%20%27Auction%27%20Pricer.user.js
// @updateURL https://update.greasyfork.org/scripts/557881/Neopets%20%27Auction%27%20Pricer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Neopets Auction Pricer V1.0.7: Script started.");

    // --- Configuration ---
    const API_URL = "https://itemdb.com.br/api/v1/items/many";
    const ITEMDB_BASE_URL = "https://itemdb.com.br/item/";

    // Color definitions
    const COLOR_OVERPAY = '#D00000'; // Red
    const COLOR_GOOD_DEAL = '#008000'; // Green

    // The index of the "Current Price" cell in the ITEM DATA row (8 total cells before injection).
    // The Current Price cell is at index 6 in the original 8-cell data row.
    const DATA_CURRENT_PRICE_INDEX = 6;

    // The index of the "Current Price" cell in the HEADER row (7 total cells before injection).
    // The Current Price header is at index 6 in the original 7-cell header row.
    const HEADER_CURRENT_PRICE_INDEX = 6;

    // --- GUI: Status Box ---
    const statusBox = document.createElement('div');
    statusBox.id = 'gemini-status-box';
    statusBox.style.cssText = `
        position: fixed; bottom: 10px; right: 10px; padding: 6px;
        background: #f7f7f7; border: 1px solid #ccc; z-index: 9999;
        font-size: 11px; font-weight: bold; border-radius: 4px;
    `;
    statusBox.innerText = 'Auction Scanner: Ready';
    document.body.appendChild(statusBox);

    // --- Helper Functions ---
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // Creates a URL slug from the item name
    function createSlug(name) {
        return name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }

    // Parses a Neopets price string (e.g., "12,345 NP" or API string "2,100,000") into a number.
    function parsePrice(priceText) {
        if (!priceText) return 0;
        // Ensure input is treated as a string, then remove 'NP' and commas
        return parseInt(String(priceText).trim().replace(/NP/g, '').replace(/,/g, ''), 10) || 0;
    }

    // --- Correction Function: Swap Current Price and Market Price values ---
    function swapCellContents(tableRows) {
        // After injection, the table rows have 9 cells:
        // [0]...[5] (Last Bid), [6] (Market Price), [7] (Current Price), [8] (Last Bidder)

        // Target indices in the 9-cell row *after* insertion:
        const MARKET_PRICE_INDEX_AFTER_INSERT = 6; // Where we injected the resultCell
        const CURRENT_PRICE_INDEX_AFTER_INSERT = 7; // Where the Current Price cell shifted to

        tableRows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length === 9) {
                const marketCell = cells[MARKET_PRICE_INDEX_AFTER_INSERT];
                const currentPriceCell = cells[CURRENT_PRICE_INDEX_AFTER_INSERT];

                if (marketCell && currentPriceCell) {
                    // Temporarily store the Market Price HTML
                    const tempMarketHTML = marketCell.innerHTML;

                    // Move Current Price content to Market Price cell's location (index 6)
                    marketCell.innerHTML = currentPriceCell.innerHTML;

                    // Move Market Price content back to Current Price cell's location (index 7)
                    currentPriceCell.innerHTML = tempMarketHTML;
                }
            }
        });
    }

    // --- Main Logic ---

    // 1. Find the target table and inject the new header column
    const auctionTable = document.querySelector('table[align="center"][width="100%"]');

    if (!auctionTable) {
        statusBox.innerText = "Scanner: Auction table not found.";
        return;
    }

    const headerRow = auctionTable.querySelector('tbody > tr:first-child');

    // Header row has 7 <td> elements due to colspan="2" on the 'Item' column (index 1).
    const EXPECTED_HEADER_CELLS = 7;
    if (!headerRow || headerRow.children.length !== EXPECTED_HEADER_CELLS) {
        statusBox.innerText = `Scanner: Header row structured incorrectly (Expected ${EXPECTED_HEADER_CELLS}, found ${headerRow ? headerRow.children.length : '0'}).`;
        return;
    }

    // Inject the new header column (Market Price)
    const marketHeader = document.createElement('td');
    marketHeader.setAttribute('align', 'center');
    marketHeader.setAttribute('bgcolor', '#dddd77');
    marketHeader.innerHTML = '<b>Market</b>';

    // Get the reference header element: the cell for 'Current Price'
    const currentPriceHeader = headerRow.children[HEADER_CURRENT_PRICE_INDEX];

    if (!currentPriceHeader) {
        console.error(`Current Price header not found at index ${HEADER_CURRENT_PRICE_INDEX}.`);
        statusBox.innerText = `Scanner: Current Price header not found.`;
        return;
    }

    // Insert the Market header BEFORE the Current Price header to place it correctly.
    // This is correct: Auction No. [0]... Last Bid [5], Market [6] (new), Current Price [7] (pushed), Last Bidder [8] (pushed)
    headerRow.insertBefore(marketHeader, currentPriceHeader);

    console.log("Auction Pricer V1.0.7: Header column injected.");

    // 2. Scrape items from table rows
    const items = [];
    const itemRows = Array.from(auctionTable.querySelectorAll('tbody > tr')).slice(1);

    itemRows.forEach((row, index) => {
        // Auction item rows have 8 <td> elements initially.
        const cells = row.querySelectorAll('td');

        const EXPECTED_ITEM_CELLS = 8;
        if (cells.length !== EXPECTED_ITEM_CELLS) {
            console.warn(`Skipping row ${index}: Not enough <td> elements found (expected ${EXPECTED_ITEM_CELLS}, found ${cells.length}).`);
            return;
        }

        // Scrape item name from the third <td> (index 2)
        const nameElement = cells[2].querySelector('a');
        const name = nameElement ? nameElement.innerText.trim() : null;

        // Scrape the Current Price from the <td> at DATA_CURRENT_PRICE_INDEX (index 6)
        const currentPriceCell = cells[DATA_CURRENT_PRICE_INDEX];
        const currentPriceText = currentPriceCell ? currentPriceCell.innerText.trim() : '0 NP';
        const currentPrice = parsePrice(currentPriceText);

        if (!name) {
            console.warn(`Skipping row ${index}: Item name not found in <td> index 2.`);
            return;
        }

        // Create the market price cell to inject
        const resultCell = document.createElement('td');
        resultCell.className = 'gemini-price-check';
        resultCell.setAttribute('align', 'center');
        // Use the row's existing background color
        resultCell.setAttribute('bgcolor', cells[0].parentElement.getAttribute('bgcolor'));
        resultCell.innerHTML = '<span style="color: #666; font-size: 0.9em;">Checking...</span>';

        // Inject the new cell: insert BEFORE the 'Current Price' cell (index 6).
        row.insertBefore(resultCell, currentPriceCell);

        items.push({
            name: name,
            currentPrice: currentPrice, // Stored for comparison later
            element: resultCell,
            container: row
        });
    });

    console.log(`Auction Pricer V1.0.7: Found ${items.length} items to check.`);
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

                // --- FIX: Swap the contents to match the headers ---
                swapCellContents(itemRows);

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

    // 4. Update UI with Price Comparison (Market Price is applied to the injected cell)
    function updatePrices(apiData) {
        items.forEach(item => {
            const itemData = apiData[item.name];
            const itemSlug = createSlug(item.name);
            const itemDBLink = ITEMDB_BASE_URL + itemSlug;

            // Link wrapper for the market price
            const linkStart = `<a href="${itemDBLink}" target="_blank" style="text-decoration: none;">`;
            const linkEnd = `</a>`;

            if (itemData && itemData.price && itemData.price.value) {
                // Use parsePrice to ensure the market price is a number, handling strings with commas
                const marketPrice = parsePrice(itemData.price.value);

                // --- COLOR LOGIC: If Current Price is HIGHER than Market Price, it's an overpay (RED) ---
                let priceColor = COLOR_GOOD_DEAL; // Default to Green

                if (item.currentPrice > marketPrice) {
                    priceColor = COLOR_OVERPAY; // Red
                }

                item.element.innerHTML = `
                    ${linkStart}
                    <div style="font-size: 1.0em; font-weight: bold; line-height: 1.1; color: ${priceColor};">
                        ${formatNumber(marketPrice)}
                    </div>
                    ${linkEnd}`;

            } else {
                item.element.innerHTML = `<span style="color: #aaa; font-size: 0.9em;">No ItemDB Data</span>`;
            }
        });
    }

})();