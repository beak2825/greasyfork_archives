// ==UserScript==
// @name          Neopets 'Quick Stock' Pricer
// @namespace     http://tampermonkey.net/
// @version       1.0.2
// @description   Checks item prices in the Quick Stock table against ItemDB market value, injecting a "Market Price" column, and displaying a total value in the final header row.
// @author        Logan Bell
// @match         https://www.neopets.com/quickstock.phtml*
// @connect       itemdb.com.br
// @grant         GM_xmlhttpRequest
// @run-at        document-end
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/557883/Neopets%20%27Quick%20Stock%27%20Pricer.user.js
// @updateURL https://update.greasyfork.org/scripts/557883/Neopets%20%27Quick%20Stock%27%20Pricer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Neopets Quick Stock Pricer V1.6: Script started.");

    // --- Configuration ---
    const API_URL = "https://itemdb.com.br/api/v1/items/many";
    const ITEMDB_BASE_URL = "https://itemdb.com.br/item/";

    // --- Global Variables ---
    let totalMarketValue = 0;
    // Store all identified header rows
    const headerRows = [];

    // --- GUI: Status Box ---
    const statusBox = document.createElement('div');
    statusBox.id = 'gemini-status-box';
    statusBox.style.cssText = `
        position: fixed; bottom: 10px; right: 10px; padding: 6px;
        background: #f7f7f7; border: 1px solid #ccc; z-index: 9999;
        font-size: 11px; font-weight: bold; border-radius: 4px;
        color: #333;
    `;
    statusBox.innerText = 'Quick Stock Scanner: Ready';
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

    // 1. Find the target table
    const quickstockTable = document.querySelector('form[action="process_quickstock.phtml"] > table');

    if (!quickstockTable) {
        statusBox.innerText = "Scanner: Quick Stock table not found.";
        return;
    }

    // Define the Market Price header element once
    const marketHeaderTemplate = document.createElement('th');
    marketHeaderTemplate.setAttribute('align', 'center');
    marketHeaderTemplate.setAttribute('width', '10%');
    marketHeaderTemplate.setAttribute('bgcolor', '#dddd77');
    marketHeaderTemplate.innerHTML = '<b>Market Price</b>';

    // 2. Identify all header rows and item rows
    const allRows = quickstockTable.querySelectorAll('tbody > tr');
    const allRowsArray = Array.from(allRows);

    allRowsArray.forEach(row => {
        const cells = Array.from(row.children);
        const firstCell = cells[0];

        // Check if the row is a header row
        const isHeaderRow = firstCell && (firstCell.tagName === 'TH' || firstCell.querySelector('b'));

        if (isHeaderRow && cells.length >= 8) {
            // Store all header rows first
            headerRows.push(row);
        }
    });

    // Determine the last header row (which we want to convert to the total display)
    const lastHeaderRow = headerRows.pop(); // Removes and saves the last header row from the array
    let injectedHeaderCount = 0;

    // Now, iterate over the remaining header rows (all but the last one) and inject the column
    headerRows.forEach(row => {
        const cells = Array.from(row.children);

        // This is a header row, so inject the Market Price header
        const marketHeaderClone = marketHeaderTemplate.cloneNode(true);
        const stockHeader = cells[1];
        row.insertBefore(marketHeaderClone, stockHeader);
        injectedHeaderCount++;
    });

    console.log(`Quick Stock Pricer V1.6: Injected market header into ${injectedHeaderCount} category header rows.`);

    // 3. Scrape and process item rows
    const items = [];

    // Only select rows that are visually item rows (based on alternating background colors)
    const itemRows = allRowsArray.filter(row => {
        const bgColor = row.getAttribute('bgcolor');
        return (bgColor === '#FFFFFF' || bgColor === '#ffffcc');
    });

    itemRows.forEach((row, index) => {
        const cells = row.querySelectorAll('td');

        // We only proceed if we know the row will have 9 cells (8 initial + 1 injected)
        if (cells.length < 8) {
            return;
        }

        const nameCell = cells[0];
        const name = nameCell ? nameCell.innerText.trim() : null;

        if (!name || name.length < 2) {
            return;
        }

        // Create the market price cell to inject
        const resultCell = document.createElement('td');
        resultCell.className = 'gemini-price-check';
        resultCell.setAttribute('align', 'center');
        resultCell.setAttribute('bgcolor', row.getAttribute('bgcolor')); // Maintain row color stripe
        resultCell.innerHTML = '<span style="color: #666; font-size: 0.9em;">Checking...</span>';

        // Injection point: insert after the 'Object Name' cell (index 0) and before the 'Stock' cell (now index 1)
        const stockCell = cells[1];
        row.insertBefore(resultCell, stockCell);


        items.push({
            name: name,
            element: resultCell
        });
    });

    console.log(`Quick Stock Pricer V1.6: Found ${items.length} items to check.`);
    statusBox.innerText = `Scanner: Found ${items.length} items...`;

    if (items.length === 0) {
        statusBox.innerText = "Scanner: No items found in the main inventory table.";
        return;
    }

    // 4. Fetch Data
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

    // 5. Update UI and Calculate Total (Modified)
    function updatePrices(apiData) {
        items.forEach(item => {
            const itemData = apiData[item.name];
            const itemSlug = createSlug(item.name);
            const itemDBLink = ITEMDB_BASE_URL + itemSlug;

            const linkStart = `<a href="${itemDBLink}" target="_blank" style="text-decoration: none; color: #000;">`;
            const linkEnd = `</a>`;

            if (itemData && itemData.price && itemData.price.value) {
                const marketPrice = itemData.price.value;

                // Accumulate the market value
                totalMarketValue += marketPrice;

                item.element.innerHTML = `
                    ${linkStart}
                    <div style="font-size: 1.0em; font-weight: bold; line-height: 1.1; color: #333333;">
                        ${formatNumber(marketPrice)}
                    </div>
                    ${linkEnd}`;

            } else {
                item.element.innerHTML = `<span style="color: #aaa; font-size: 0.9em;">No ItemDB Data</span>`;
            }
        });

        // --- Display the Total Market Value in the last remaining header row ---
        if (lastHeaderRow) {
            const cells = Array.from(lastHeaderRow.children);

            // Re-use the third column cell (which is now index 2, assuming the first 2 are 'Object Name' and 'Stock')
            // However, since the row is a header (TH), we need to ensure the target is the correct TH.

            // To be safe, we'll clear and recreate the cells to ensure the total takes up the space intended for 'Market Price'

            // 1. Clear the contents of the last header row and re-insert the base columns
            lastHeaderRow.innerHTML = '';

            // Column 1: A label for the total
            const totalLabel = document.createElement('th');
            totalLabel.setAttribute('align', 'left');
            totalLabel.innerHTML = '<b>Total Est. Market Value</b>';
            lastHeaderRow.appendChild(totalLabel);

            // Column 2: The actual calculated total
            const totalValueCell = document.createElement('th');
            totalValueCell.setAttribute('align', 'center');
            totalValueCell.setAttribute('width', '10%');
            totalValueCell.setAttribute('bgcolor', '#aaaa44');
            totalValueCell.innerHTML = `
                <div style="font-size: 1.1em; font-weight: bold; color: #008800; padding: 2px 0;">
                    ${formatNumber(totalMarketValue)} NP
                </div>
            `;
            lastHeaderRow.appendChild(totalValueCell);

            // Column 3 to 9: Recreate the remaining headers and merge them into a single cell
            // These original cells were 'Stock', 'Deposit', 'Donate', 'Discard', 'Gallery', 'Closet', 'Shed' (7 total)

            const remainingCell = document.createElement('th');
            remainingCell.setAttribute('colspan', '7');
            remainingCell.setAttribute('bgcolor', '#EEEEBB');
            remainingCell.innerHTML = '<b>Quick Stock Actions</b>';
            lastHeaderRow.appendChild(remainingCell);

            // Set the overall color of the last header row to match the others
            lastHeaderRow.setAttribute('bgcolor', '#EEEEBB');

        }
    }

})();