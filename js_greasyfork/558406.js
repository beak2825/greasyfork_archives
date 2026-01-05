// ==UserScript==
// @name         Tankarta Business sleva
// @namespace    http://santomet.eu/
// @version      v1
// @description  Show prices with discounts (you must know your discount)
// @author       Marek Šanta
// @match        https://business.tankarta.cz/Dashboard*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tankarta.cz
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/558406/Tankarta%20Business%20sleva.user.js
// @updateURL https://update.greasyfork.org/scripts/558406/Tankarta%20Business%20sleva.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DISCOUNT = 2.20; // Kč discount per liter

    // Function to calculate discounted price
    function calculateDiscountedPrice(priceText) {
        if (!priceText || priceText.trim() === '') return null;

        // Parse Czech number format (comma as decimal separator)
        const cleaned = priceText.replace(/\s/g, '').replace(',', '.');
        const priceValue = parseFloat(cleaned);

        if (isNaN(priceValue)) {
            return null;
        }

        // Calculate discounted price
        const discountedPrice = priceValue - DISCOUNT;

        // Return in Czech format with 2 decimal places
        return discountedPrice < 0 ? '0,00' : discountedPrice.toFixed(2).replace('.', ',');
    }

    // Main function to add discount column
    function addDiscountToTable() {
        console.log('Looking for price tables...');

        // Find all tables with class box__list
        const tables = document.querySelectorAll('table.box__list');

        tables.forEach((table, tableIndex) => {
            // Skip if already processed (check for data attribute)
            if (table.hasAttribute('data-discount-added')) {
                console.log(`Table ${tableIndex} already processed, skipping`);
                return;
            }

            console.log(`Processing table ${tableIndex}`);

            // Get all rows in the table
            const rows = table.querySelectorAll('tr');
            console.log(`Found ${rows.length} rows in table ${tableIndex}`);

            if (rows.length === 0) {
                console.log(`No rows found in table ${tableIndex}, skipping`);
                return;
            }

            // Check if this is a price table (look for price patterns in the rows)
            let isPriceTable = false;
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length >= 2) {
                    const secondCellText = cells[1].textContent.trim();
                    // Check if it looks like a price (contains numbers and comma)
                    if (/[\d,]+\d*/.test(secondCellText)) {
                        isPriceTable = true;
                    }
                }
            });

            if (!isPriceTable) {
                console.log(`Table ${tableIndex} doesn't appear to be a price table, skipping`);
                return;
            }

            console.log(`Table ${tableIndex} is a price table, adding discount column...`);

            // Process each row
            rows.forEach((row, rowIndex) => {
                const cells = row.querySelectorAll('td');

                if (cells.length >= 2) {
                    const priceCell = cells[1];
                    const originalPrice = priceCell.textContent.trim();
                    const discountedPrice = calculateDiscountedPrice(originalPrice);

                    if (discountedPrice !== null) {
                        // Create new cell for discounted price
                        const discountCell = document.createElement('td');
                        discountCell.textContent = discountedPrice;
                        discountCell.style.color = '#e60114';
                        discountCell.style.fontWeight = 'bold';
                        discountCell.style.textAlign = 'center';
                        discountCell.style.padding = '8px 12px';
                        discountCell.style.border = '1px solid #ddd';

                        // Add the cell to the row
                        row.appendChild(discountCell);

                        // Update original price cell
                        priceCell.style.textAlign = 'center';
                        priceCell.style.padding = '8px 12px';
                        priceCell.style.border = '1px solid #ddd';
                        priceCell.title = `Úspora: ${DISCOUNT.toFixed(2).replace('.', ',')} Kč/l`;

                        // Add strikethrough to original price
                        priceCell.innerHTML = `<span style="text-decoration: line-through; opacity: 0.7;">${originalPrice}</span>`;

                        // Style the first cell (fuel name)
                        if (cells[0]) {
                            cells[0].style.textAlign = 'left';
                            cells[0].style.padding = '8px 12px';
                            cells[0].style.border = '1px solid #ddd';
                        }
                    }
                } else if (cells.length === 0 && row.querySelectorAll('th').length > 0) {
                    // This is a header row with th elements
                    const thCells = row.querySelectorAll('th');
                    if (thCells.length === 2) {
                        // Add a third header cell
                        const discountHeader = document.createElement('th');
                        discountHeader.textContent = 'Cena se slevou (Kč)';
                        discountHeader.style.padding = '8px 12px';
                        discountHeader.style.border = '1px solid #ddd';
                        discountHeader.style.backgroundColor = '#f5f5f5';
                        discountHeader.style.fontWeight = 'bold';
                        discountHeader.style.textAlign = 'center';
                        row.appendChild(discountHeader);
                    }
                }
            });

            // If there's no header row, add one
            if (!table.querySelector('thead') && !table.querySelector('tr th')) {
                console.log('Adding header row to table');

                // Create a header row
                const headerRow = document.createElement('tr');
                headerRow.innerHTML = `
                    <th style="padding: 8px 12px; border: 1px solid #ddd; background-color: #f5f5f5; font-weight: bold; text-align: left;">Palivo</th>
                    <th style="padding: 8px 12px; border: 1px solid #ddd; background-color: #f5f5f5; font-weight: bold; text-align: center;">Původní cena (Kč)</th>
                    <th style="padding: 8px 12px; border: 1px solid #ddd; background-color: #f5f5f5; font-weight: bold; text-align: center;">Cena se slevou (Kč)</th>
                `;

                // Insert at the beginning of the table
                if (table.tHead) {
                    table.tHead.appendChild(headerRow);
                } else {
                    const thead = document.createElement('thead');
                    thead.appendChild(headerRow);
                    table.insertBefore(thead, table.firstChild);
                }
            }

            // Style the table
            table.style.width = '100%';
            table.style.borderCollapse = 'collapse';
            table.style.marginTop = '10px';

            // Mark as processed
            table.setAttribute('data-discount-added', 'true');

            console.log(`Successfully added discount column to table ${tableIndex}`);
        });
    }

    // Run the function and set up monitoring
    function init() {
        console.log('Tankarta Discount Script started');

        // Run immediately
        setTimeout(addDiscountToTable, 100);

        // Run again after 1 second to catch dynamically loaded content
        setTimeout(addDiscountToTable, 1000);

        // Run again after 3 seconds
        setTimeout(addDiscountToTable, 3000);

        // Also run when the user clicks or interacts with the page (common trigger for dynamic content)
        document.addEventListener('click', function() {
            setTimeout(addDiscountToTable, 500);
        }, true);
    }

    // Start when page is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();