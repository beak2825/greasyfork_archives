// ==UserScript==
// @name         InvestNow Return % Calculator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Calculate and display Return % for each fund on InvestNow
// @author       You
// @match        https://secure.investnow.co.nz/feature/client/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557039/InvestNow%20Return%20%25%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/557039/InvestNow%20Return%20%25%20Calculator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        columnHeaders: {
            marketValue: ['Market Value', 'Market Value (NZD)', 'Current Value', 'NZD Value'],
            nzdValue: ['NZD Value', 'NZD Value (NZD)'],
            unrealisedGain: ['Unrealised Gain', 'Unrealised Gain (NZD)', 'Unrealised', 'Unrealised'],
            totalReturn: ['Total Return', 'Total Return (NZD)', 'Total Return (NZD)', 'Total Return (NZD)']
        },
        returnColumnHeader: 'Return %',
        observerConfig: {
            childList: true,
            subtree: true
        },
        retryDelay: 1000,
        maxRetries: 10
    };

    // Global storage for calculated Return % values
    const returnPercentages = new Map(); // key: fund name, value: return percentage

    // Global storage for NZD values from Valuation table
    const marketValues = new Map(); // key: fund name, value: NZD value

    // Flag to prevent multiple expansions
    let hasExpandedRows = false;

    // Extract NZD values from Valuation (Holdings) table
    function extractMarketValues(isRecursive = false) {
        console.log('RL - InvestNow Return % Calculator: Extracting NZD values from Valuation table...');

        // Only clear if we haven't extracted anything yet, or if we're on the Valuation tab
        const tables = document.querySelectorAll('table');
        let hasValuationTable = false;

        tables.forEach((table, index) => {
            const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent.trim());
            const hasNzdValue = CONFIG.columnHeaders.nzdValue.some(header =>
                headers.some(h => h.includes(header))
            );

            // Valuation table has NZD Value but typically doesn't have Unrealised Gain
            // Returns table has Unrealised Gain but doesn't have NZD Value
            if (hasNzdValue && !headers.some(h => h.includes('Unrealised'))) {
                hasValuationTable = true;
                console.log(`RL - InvestNow Return % Calculator: Table ${index + 1} identified as Valuation table (has NZD Value, no Unrealised)`);
            }
        });

        // Only clear and re-extract if we're on the Valuation tab
        if (hasValuationTable) {
            console.log('RL - InvestNow Return % Calculator: On Valuation tab, clearing and re-extracting NZD values...');
            marketValues.clear();
        } else {
            console.log(`RL - InvestNow Return % Calculator: On Returns tab, keeping existing ${marketValues.size} NZD values`);
            if (marketValues.size > 0) {
                console.log(`RL - InvestNow Return % Calculator: Current NZD values:`, Array.from(marketValues.entries()));
            }
            return; // Keep existing values
        }

        console.log(`RL - InvestNow Return % Calculator: Found ${tables.length} tables to search for NZD values`);

        // First, check if we need to expand rows in any Valuation table
        let needsExpansion = false;
        tables.forEach((table, index) => {
            const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent.trim());
            const hasNzdValue = CONFIG.columnHeaders.nzdValue.some(header =>
                headers.some(h => h.includes(header))
            );

            if (hasNzdValue) {
                console.log(`RL - InvestNow Return % Calculator: Found Valuation table ${index + 1}, checking for collapsed rows...`);

                // Check if we need to expand rows for this table
                const expandButtons = table.querySelectorAll('button[aria-label="Row Expanded"]');
                // Check if there are any collapsed rows (chevronright icon) that need expanding
                const collapsedButtons = Array.from(expandButtons).filter(btn =>
                    btn.querySelector('chevronrighticon')
                );

                if (collapsedButtons.length > 0) {
                    console.log(`RL - InvestNow Return % Calculator: Found Valuation table with ${collapsedButtons.length} collapsed rows, expanding...`);
                    needsExpansion = true;
                }
            }
        });

        if (needsExpansion) {
            console.log(`RL - InvestNow Return % Calculator: Expanding Valuation table rows before extracting NZD values...`);
            hasExpandedRows = false; // Reset flag to allow expansion
            expandAllRows();

            // Wait a moment for expansion to complete, then re-extract
            setTimeout(() => {
                console.log(`RL - InvestNow Return % Calculator: Re-extracting NZD values after expansion...`);
                extractMarketValues(true); // Recursive call to extract after expansion
            }, 1000);
            return;
        }

        tables.forEach((table, index) => {
            const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent.trim());
            console.log(`RL - InvestNow Return % Calculator: Table ${index + 1} headers:`, headers);

            // Look for Holdings/Valuation table (has NZD Value column)
            const hasNzdValue = CONFIG.columnHeaders.nzdValue.some(header =>
                headers.some(h => h.includes(header))
            );
            const hasMarketValue = CONFIG.columnHeaders.marketValue.some(header =>
                headers.some(h => h.includes(header))
            );
            const hasUnrealisedGain = CONFIG.columnHeaders.unrealisedGain.some(header =>
                headers.some(h => h.includes(header))
            );

            console.log(`RL - InvestNow Return % Calculator: Table ${index + 1} - NZDValue: ${hasNzdValue}, MarketValue: ${hasMarketValue}, UnrealisedGain: ${hasUnrealisedGain}`);

            if (hasNzdValue) {
                console.log(`RL - InvestNow Return % Calculator: Found Valuation table ${index + 1}`);

                const nzdValueIndex = findColumnIndex(headers, CONFIG.columnHeaders.nzdValue);
                console.log(`RL - InvestNow Return % Calculator: NZD Value column index: ${nzdValueIndex}`);

                const rows = table.querySelectorAll('tbody tr, tr');
                console.log(`RL - InvestNow Return % Calculator: Found ${rows.length} rows in Valuation table`);

                rows.forEach((row, rowIndex) => {
                    // Debug: Log what we're seeing in each row
                    const rowHtml = row.innerHTML.substring(0, 200);
                    const hasTh = !!row.querySelector('th');
                    const hasToggler = !!row.querySelector('p-treetabletoggler');
                    console.log(`RL - InvestNow Return % Calculator: Row ${rowIndex + 1} debug - hasTh: ${hasTh}, hasToggler: ${hasToggler}, HTML: ${rowHtml}`);

                    // Only skip actual header rows (rows with th elements)
                    // Don't skip rows with togglers as they might contain actual data after expansion
                    if (row.querySelector('th')) {
                        console.log(`RL - InvestNow Return % Calculator: Skipping header row ${rowIndex + 1}`);
                        return;
                    }

                    // Check if this is a category sub-header (has toggler but no actual fund data)
                    const nameCell = row.querySelector('td:first-child');
                    if (nameCell && hasToggler) {
                        const nameContent = getCellContent(nameCell);
                        // Skip if it looks like a category header (no specific fund name)
                        if (nameContent && (nameContent.includes('Fixed Interest') || nameContent.includes('Equities') || nameContent.includes('Cash'))) {
                            console.log(`RL - InvestNow Return % Calculator: Skipping category subheader row ${rowIndex + 1}: "${nameContent}"`);
                            return;
                        }
                    }

                    const cells = row.querySelectorAll('td');
                    if (cells.length <= nzdValueIndex) {
                        console.log(`RL - InvestNow Return % Calculator: Row ${rowIndex + 1} has insufficient cells (${cells.length} <= ${nzdValueIndex})`);
                        return;
                    }

                    // Get fund name - reuse the nameCell we already got
                    let fundName = `Fund_${rowIndex}`;
                    if (nameCell) {
                        const nameContent = getCellContent(nameCell);
                        if (nameContent && nameContent.trim() && !nameContent.includes('%') && !parseCurrency(nameContent)) {
                            fundName = nameContent.trim();
                        }
                    }

                    // Extract NZD Value
                    const nzdValueContent = getCellContent(cells[nzdValueIndex]);
                    const nzdValue = parseCurrency(nzdValueContent);

                    console.log(`RL - InvestNow Return % Calculator: Row ${rowIndex + 1} - Fund: "${fundName}", NZD Value: "${nzdValueContent}" -> ${nzdValue}`);

                    if (nzdValue !== null && nzdValue > 0) {
                        marketValues.set(fundName, nzdValue);
                        console.log(`RL - InvestNow Return % Calculator: Stored NZD value for "${fundName}": ${nzdValue}`);
                    }
                });
            }
        });

        console.log(`RL - InvestNow Return % Calculator: Extracted ${marketValues.size} NZD values`);
        console.log(`RL - InvestNow Return % Calculator: NZD values map:`, Array.from(marketValues.entries()));
    }

    // Auto-expand all rows function
    function expandAllRows() {
        if (hasExpandedRows) {
            console.log('RL - InvestNow Return % Calculator: Rows already expanded, skipping...');
            return;
        }

        console.log('RL - InvestNow Return % Calculator: Expanding all rows...');
        const expandButtons = document.querySelectorAll('button[aria-label="Row Expanded"]');

        // Filter to only get collapsed rows (chevronright icon)
        const collapsedButtons = Array.from(expandButtons).filter(btn =>
            btn.querySelector('chevronrighticon')
        );

        if (collapsedButtons.length === 0) {
            console.log('RL - InvestNow Return % Calculator: No collapsed rows found to expand');
            return;
        }

        console.log(`RL - InvestNow Return % Calculator: Found ${collapsedButtons.length} collapsed rows to expand`);
        hasExpandedRows = true; // Set flag to prevent re-expansion

        // Add a small delay between clicks to avoid overwhelming the UI
        collapsedButtons.forEach((button, index) => {
            if (button) {
                setTimeout(() => {
                    console.log(`RL - InvestNow Return % Calculator: Expanding collapsed row ${index + 1}`);
                    button.click();
                }, index * 100); // 100ms delay between each click
            }
        });

        // Wait longer for all expansions to complete, then process again
        setTimeout(() => {
            console.log('RL - InvestNow Return % Calculator: Processing after row expansion...');
            // Find and process only the Returns table
            const tables = document.querySelectorAll('table');
            console.log(`RL - InvestNow Return % Calculator: Found ${tables.length} tables after expansion`);

            tables.forEach((table, index) => {
                console.log(`RL - InvestNow Return % Calculator: Checking table ${index + 1} after expansion`);
                if (shouldProcessTable(table)) {
                    console.log(`RL - InvestNow Return % Calculator: Processing Returns table ${index + 1}`);
                    processTable(table);
                }
            });
        }, 2000); // Wait 2 seconds for all expansions
    }

    // Main function to process tables
    function processTables() {
        console.log('RL - InvestNow Return % Calculator: processTables() called');

        // First, extract market values from Valuation table
        extractMarketValues();

        const tables = document.querySelectorAll('table');
        console.log(`RL - InvestNow Return % Calculator: Found ${tables.length} tables on page`);
        let processedCount = 0;

        // Look for Returns tables specifically
        let returnsTableFound = false;

        tables.forEach((table, index) => {
            console.log(`RL - InvestNow Return % Calculator: Examining table ${index + 1}`);
            if (shouldProcessTable(table)) {
                console.log(`RL - InvestNow Return % Calculator: Table ${index + 1} should be processed`);
                returnsTableFound = true;

                // Check if we need to expand rows for this table
                const expandButtons = table.querySelectorAll('button[aria-label="Row Expanded"]');
                // Check if there are any collapsed rows (chevronright icon) that need expanding
                const collapsedButtons = Array.from(expandButtons).filter(btn =>
                    btn.querySelector('chevronrighticon')
                );

                if (collapsedButtons.length > 0) {
                    console.log(`RL - InvestNow Return % Calculator: Found Returns table with ${collapsedButtons.length} collapsed rows, expanding...`);
                    hasExpandedRows = false; // Reset flag to allow expansion
                    expandAllRows();
                    return false; // Return false for now, will be called again after expansion
                }

                if (processTable(table)) {
                    processedCount++;
                    console.log(`RL - InvestNow Return % Calculator: Successfully processed table ${index + 1}`);
                } else {
                    console.log(`RL - InvestNow Return % Calculator: Failed to process table ${index + 1}`);
                }
            } else {
                console.log(`RL - InvestNow Return % Calculator: Table ${index + 1} does not contain required columns`);
            }
        });

        // If no Returns table found but we see expand buttons, try expanding
        if (!returnsTableFound && !hasExpandedRows) {
            const expandButtons = document.querySelectorAll('button[aria-label="Row Expanded"]');
            if (expandButtons.length > 0) {
                console.log('RL - InvestNow Return % Calculator: No Returns table found but expandable rows exist, expanding to reveal Returns data...');
                expandAllRows();
                return false;
            }
        }

        console.log(`RL - InvestNow Return % Calculator: Processed ${processedCount} tables successfully`);
        return processedCount > 0;
    }

    // Check if table contains relevant financial data
    function shouldProcessTable(table) {
        const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent.trim());
        console.log(`RL - InvestNow Return % Calculator: Table headers found: [${headers.join(', ')}]`);

        const hasMarketValue = CONFIG.columnHeaders.marketValue.some(header =>
            headers.some(h => h.includes(header))
        );
        const hasUnrealisedGain = CONFIG.columnHeaders.unrealisedGain.some(header =>
            headers.some(h => h.includes(header))
        );
        const hasTotalReturn = CONFIG.columnHeaders.totalReturn.some(header =>
            headers.some(h => h.includes(header))
        );

        // Check for Return table type (has Unrealised and Total Return but no Market Value)
        const isReturnTable = hasUnrealisedGain && hasTotalReturn && !hasMarketValue;
        // Check for Holdings table type (has Market Value and Unrealised)
        const isHoldingsTable = hasMarketValue && hasUnrealisedGain;

        console.log(`RL - InvestNow Return % Calculator: Column check - MarketValue: ${hasMarketValue}, UnrealisedGain: ${hasUnrealisedGain}, TotalReturn: ${hasTotalReturn}`);
        console.log(`RL - InvestNow Return % Calculator: Table type - ReturnTable: ${isReturnTable}, HoldingsTable: ${isHoldingsTable}`);

        return isReturnTable || isHoldingsTable;
    }

    // Process a single table
    function processTable(table) {
        console.log('RL - InvestNow Return % Calculator: processTable() called');
        const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent.trim());

        // Find column indices
        const marketValueIndex = findColumnIndex(headers, CONFIG.columnHeaders.marketValue);
        const unrealisedGainIndex = findColumnIndex(headers, CONFIG.columnHeaders.unrealisedGain);
        const totalReturnIndex = findColumnIndex(headers, CONFIG.columnHeaders.totalReturn);

        // Determine table type
        const hasMarketValue = marketValueIndex !== -1;
        const hasUnrealisedGain = unrealisedGainIndex !== -1;
        const hasTotalReturn = totalReturnIndex !== -1;
        const isReturnTable = hasUnrealisedGain && hasTotalReturn && !hasMarketValue;
        const isHoldingsTable = hasMarketValue && hasUnrealisedGain;

        console.log(`RL - InvestNow Return % Calculator: Column indices - MarketValue: ${marketValueIndex}, UnrealisedGain: ${unrealisedGainIndex}, TotalReturn: ${totalReturnIndex}`);
        console.log(`RL - InvestNow Return % Calculator: Processing as ${isReturnTable ? 'Return' : 'Holdings'} table`);

        if (!isReturnTable && !isHoldingsTable) {
            console.log('RL - InvestNow Return % Calculator: Table does not match expected patterns');
            return false;
        }

        // Add Return % header if not exists
        if (!headers.includes(CONFIG.returnColumnHeader)) {
            console.log('RL - InvestNow Return % Calculator: Adding Return % header');
            const headerRow = table.querySelector('tr');
            if (headerRow) {
                const th = document.createElement('th');
                th.textContent = CONFIG.returnColumnHeader;
                th.style.textAlign = 'right';
                th.style.fontWeight = 'bold';
                headerRow.appendChild(th);
            }
        } else {
            console.log('RL - InvestNow Return % Calculator: Return % header already exists');
        }

        // Process each data row
        const rows = table.querySelectorAll('tbody tr, tr');
        console.log(`RL - InvestNow Return % Calculator: Found ${rows.length} rows to process`);
        let hasProcessedRows = false;

        rows.forEach((row, index) => {
            // Skip header rows and category sub-headers (rows with expand buttons)
            if (row.querySelector('th') || row.querySelector('p-treetabletoggler')) {
                console.log(`RL - InvestNow Return % Calculator: Skipping header/subheader row ${index + 1}`);
                return;
            }

            const cells = row.querySelectorAll('td');
            const requiredColumns = isReturnTable ?
                Math.max(unrealisedGainIndex, totalReturnIndex) :
                Math.max(marketValueIndex, unrealisedGainIndex, totalReturnIndex);

            if (cells.length <= requiredColumns) {
                console.log(`RL - InvestNow Return % Calculator: Row ${index + 1} has insufficient cells (${cells.length})`);
                return;
            }

            // Get fund name for storage key - specifically use the first column (Name column)
            let fundName = `Fund_${index}`;
            const nameCell = cells[0]; // First column should be the fund name
            if (nameCell) {
                const nameContent = getCellContent(nameCell);
                if (nameContent && nameContent.trim() && !nameContent.includes('%') && !parseCurrency(nameContent)) {
                    fundName = nameContent.trim();
                }
            }
            console.log(`RL - InvestNow Return % Calculator: Processing fund: "${fundName}"`);

            let marketValue, unrealisedGain, totalReturn;

            if (isReturnTable) {
                // For Return table: calculate market value from total return and unrealised gain
                // totalReturn = marketValue - costBase, where costBase = marketValue - unrealisedGain
                // So: totalReturn = marketValue - (marketValue - unrealisedGain) = unrealisedGain
                // This means the "Total Return" column might actually be something different
                // Let's use the formula: returnPercentage = (totalReturn / (marketValue - unrealisedGain)) * 100
                // But we need to infer market value differently

                // Get cell content more thoroughly - check for nested elements
                const unrealisedCell = cells[unrealisedGainIndex];
                const totalReturnCell = cells[totalReturnIndex];

                console.log(`RL - InvestNow Return % Calculator: Row ${index + 1} (Return table) - Unrealised cell content: "${unrealisedCell?.textContent}", innerHTML: "${unrealisedCell?.innerHTML}"`);
                console.log(`RL - InvestNow Return % Calculator: Row ${index + 1} (Return table) - TotalReturn cell content: "${totalReturnCell?.textContent}", innerHTML: "${totalReturnCell?.innerHTML}"`);

                const unrealisedContent = getCellContent(unrealisedCell);
                const totalReturnContent = getCellContent(totalReturnCell);

                console.log(`RL - InvestNow Return % Calculator: Row ${index + 1} (Return table) - Extracted Unrealised content: "${unrealisedContent}"`);
                console.log(`RL - InvestNow Return % Calculator: Row ${index + 1} (Return table) - Extracted TotalReturn content: "${totalReturnContent}"`);

                unrealisedGain = parseCurrency(unrealisedContent);
                totalReturn = parseCurrency(totalReturnContent);

                // For Return table, we'll need to calculate market value differently
                // Let's assume we can derive it from other data or use a different approach
                console.log(`RL - InvestNow Return % Calculator: Row ${index + 1} (Return table) - UnrealisedGain: ${unrealisedGain}, TotalReturn: ${totalReturn}`);

                // For now, let's try to calculate return percentage directly if we have the data
                if (unrealisedGain !== null && totalReturn !== null) {
                    // If totalReturn represents the actual return, and unrealisedGain is the unrealized portion
                    // We might need to make assumptions or look for additional data
                    marketValue = null; // We'll handle this specially
                }
            } else {
                // For Holdings table: use original logic
                const marketValueCell = cells[marketValueIndex];
                const unrealisedCell = cells[unrealisedGainIndex];
                const totalReturnCell = cells[totalReturnIndex];

                console.log(`RL - InvestNow Return % Calculator: Row ${index + 1} (Holdings table) - MarketValue cell: "${marketValueCell?.textContent}"`);
                console.log(`RL - InvestNow Return % Calculator: Row ${index + 1} (Holdings table) - Unrealised cell: "${unrealisedCell?.textContent}"`);
                console.log(`RL - InvestNow Return % Calculator: Row ${index + 1} (Holdings table) - TotalReturn cell: "${totalReturnCell?.textContent}"`);

                const marketValueContent = getCellContent(marketValueCell);
                const unrealisedContent = getCellContent(unrealisedCell);
                const totalReturnContent = getCellContent(totalReturnCell);

                console.log(`RL - InvestNow Return % Calculator: Row ${index + 1} (Holdings table) - Extracted MarketValue content: "${marketValueContent}"`);
                console.log(`RL - InvestNow Return % Calculator: Row ${index + 1} (Holdings table) - Extracted Unrealised content: "${unrealisedContent}"`);
                console.log(`RL - InvestNow Return % Calculator: Row ${index + 1} (Holdings table) - Extracted TotalReturn content: "${totalReturnContent}"`);

                marketValue = parseCurrency(marketValueContent);
                unrealisedGain = parseCurrency(unrealisedContent);
                totalReturn = parseCurrency(totalReturnContent);
                console.log(`RL - InvestNow Return % Calculator: Row ${index + 1} (Holdings table) values - MarketValue: ${marketValue}, UnrealisedGain: ${unrealisedGain}, TotalReturn: ${totalReturn}`);
            }

            if ((isReturnTable && unrealisedGain !== null && totalReturn !== null) ||
                (!isReturnTable && marketValue !== null && unrealisedGain !== null && totalReturn !== null)) {

                let returnPercentage = null;

                if (isReturnTable) {
                    // For Return table: Use market value from Valuation table with correct formula
                    // costBase = marketValue - unrealisedGain
                    // returnPercentage = (totalReturn / costBase) * 100

                    const marketValueFromValuation = marketValues.get(fundName);
                    console.log(`RL - InvestNow Return % Calculator: Row ${index + 1} looking for market value for "${fundName}": ${marketValueFromValuation}`);

                    if (marketValueFromValuation !== null && marketValueFromValuation !== undefined) {
                        const costBase = marketValueFromValuation - unrealisedGain;
                        console.log(`RL - InvestNow Return % Calculator: Row ${index + 1} calculated costBase: ${marketValueFromValuation} - ${unrealisedGain} = ${costBase}`);

                        if (costBase !== 0 && costBase > 0) {
                            returnPercentage = (totalReturn / costBase) * 100;
                            console.log(`RL - InvestNow Return % Calculator: Row ${index + 1} calculated return percentage: ${totalReturn} / ${costBase} * 100 = ${returnPercentage}%`);
                        } else {
                            console.log(`RL - InvestNow Return % Calculator: Row ${index + 1} costBase is ${costBase}, cannot calculate percentage`);
                        }
                    } else {
                        console.log(`RL - InvestNow Return % Calculator: Row ${index + 1} could not find market value for "${fundName}" in Valuation table`);
                    }
                } else {
                    // Original Holdings table logic
                    const costBase = marketValue - unrealisedGain;
                    console.log(`RL - InvestNow Return % Calculator: Row ${index + 1} calculated costBase: ${costBase}`);

                    if (costBase !== 0) {
                        returnPercentage = (totalReturn / costBase) * 100;
                        console.log(`RL - InvestNow Return % Calculator: Row ${index + 1} calculated returnPercentage: ${returnPercentage}%`);
                    } else {
                        console.log(`RL - InvestNow Return % Calculator: Row ${index + 1} costBase is zero, cannot calculate percentage`);
                    }
                }

                // Find or create the Return % column
                let returnColumnIndex = findColumnIndex(headers, [CONFIG.returnColumnHeader]);
                let returnCell;

                if (returnColumnIndex !== -1 && returnColumnIndex < cells.length) {
                    // Return % column exists, use it
                    returnCell = cells[returnColumnIndex];
                    console.log(`RL - InvestNow Return % Calculator: Updating existing Return % cell for row ${index + 1}`);
                } else {
                    // Return % column doesn't exist or doesn't have enough cells, create it
                    console.log(`RL - InvestNow Return % Calculator: Creating new Return % cell for row ${index + 1}`);
                    returnCell = document.createElement('td');
                    returnCell.style.textAlign = 'right';
                    returnCell.style.fontWeight = 'bold';
                    row.appendChild(returnCell);
                }

                if (returnPercentage !== null && !isNaN(returnPercentage)) {
                    // Store the calculated value
                    returnPercentages.set(fundName, returnPercentage);
                    console.log(`RL - InvestNow Return % Calculator: Stored return percentage for "${fundName}": ${returnPercentage}%`);

                    returnCell.textContent = formatPercentage(returnPercentage);
                    returnCell.style.textAlign = 'right';
                    returnCell.style.fontWeight = 'bold';
                    returnCell.style.color = returnPercentage >= 0 ? '#28a745' : '#dc3545';
                    returnCell.setAttribute('data-return-percentage', 'true'); // Mark our element
                    console.log(`RL - InvestNow Return % Calculator: Row ${index + 1} Return % set to: ${returnCell.textContent}`);
                    hasProcessedRows = true;
                } else {
                    // Check if we have a stored value for this fund
                    const storedPercentage = returnPercentages.get(fundName);
                    if (storedPercentage !== undefined) {
                        console.log(`RL - InvestNow Return % Calculator: Restoring stored return percentage for "${fundName}": ${storedPercentage}%`);
                        returnCell.textContent = formatPercentage(storedPercentage);
                        returnCell.style.textAlign = 'right';
                        returnCell.style.fontWeight = 'bold';
                        returnCell.style.color = storedPercentage >= 0 ? '#28a745' : '#dc3545';
                        returnCell.setAttribute('data-return-percentage', 'true'); // Mark our element
                        console.log(`RL - InvestNow Return % Calculator: Row ${index + 1} Return % restored to: ${returnCell.textContent}`);
                        hasProcessedRows = true;
                    } else {
                        returnCell.textContent = 'N/A';
                        returnCell.style.textAlign = 'right';
                        returnCell.style.color = '#6c757d';
                        returnCell.setAttribute('data-return-percentage', 'true'); // Mark our element
                        console.log(`RL - InvestNow Return % Calculator: Row ${index + 1} Return % set to N/A`);
                    }
                }

                hasProcessedRows = true;
            } else {
                console.log(`RL - InvestNow Return % Calculator: Row ${index + 1} has null values, skipping`);
            }
        });

        console.log(`RL - InvestNow Return % Calculator: Table processing complete, hasProcessedRows: ${hasProcessedRows}`);
        return hasProcessedRows;
    }

    // Find column index by header text
    function findColumnIndex(headers, possibleHeaders) {
        console.log(`RL - InvestNow Return % Calculator: findColumnIndex() searching for headers: [${possibleHeaders.join(', ')}] in [${headers.join(', ')}]`);
        for (const header of possibleHeaders) {
            const index = headers.findIndex(h => h.includes(header));
            if (index !== -1) {
                console.log(`RL - InvestNow Return % Calculator: Found header "${header}" at index ${index}`);
                return index;
            }
        }
        console.log(`RL - InvestNow Return % Calculator: No matching header found for [${possibleHeaders.join(', ')}]`);
        return -1;
    }

    // Parse currency value from text
    function parseCurrency(text) {
        console.log(`RL - InvestNow Return % Calculator: parseCurrency() parsing: "${text}"`);
        if (!text) {
            console.log('RL - InvestNow Return % Calculator: parseCurrency() - empty text, returning null');
            return null;
        }

        // Clean the text more thoroughly
        const cleanText = text.toString().replace(/[$,\s]/g, '').trim();
        console.log(`RL - InvestNow Return % Calculator: parseCurrency() cleaned text: "${cleanText}"`);

        // If still empty after cleaning, return null
        if (!cleanText || cleanText === '') {
            console.log('RL - InvestNow Return % Calculator: parseCurrency() - still empty after cleaning');
            return null;
        }

        // Try multiple regex patterns
        const patterns = [
            /-?\d+\.?\d*/,  // Standard decimal
            /-?\d+,?\d*/,   // Comma as decimal separator
            /-?\d+/,        // Integer only
        ];

        let result = null;
        for (const pattern of patterns) {
            const match = cleanText.match(pattern);
            if (match && match[0]) {
                const parsed = parseFloat(match[0].replace(',', '.'));
                if (!isNaN(parsed)) {
                    result = parsed;
                    break;
                }
            }
        }

        console.log(`RL - InvestNow Return % Calculator: parseCurrency() result: ${result}`);
        return result;
    }

    // Enhanced cell content extraction for Angular apps
    function getCellContent(cell) {
        if (!cell) return null;

        // Try multiple methods to get the actual content
        const methods = [
            () => cell.textContent?.trim(),
            () => cell.innerText?.trim(),
            () => {
                // Look for nested divs with content
                const nestedDivs = cell.querySelectorAll('div');
                for (const div of nestedDivs) {
                    const content = div.textContent?.trim();
                    if (content && content !== '') {
                        return content;
                    }
                }
                return null;
            },
            () => {
                // Try to get value from Angular data attributes
                const ngContent = cell.getAttribute('ng-reflect-model') ||
                                 cell.getAttribute('ng-value') ||
                                 cell.getAttribute('value');
                return ngContent?.trim();
            }
        ];

        for (const method of methods) {
            try {
                const content = method();
                if (content && content !== '' && content !== ' ') {
                    console.log(`RL - InvestNow Return % Calculator: Found content using method: ${content}`);
                    return content;
                }
            } catch (e) {
                console.log('RL - InvestNow Return % Calculator: Method failed:', e.message);
            }
        }

        return null;
    }

    // Format percentage with 2 decimal places
    function formatPercentage(value) {
        const formatted = `${value.toFixed(2)}%`;
        console.log(`RL - InvestNow Return % Calculator: formatPercentage() ${value} -> ${formatted}`);
        return formatted;
    }

    // Wait for content to load
    function waitForContent(callback, retries = 0) {
        console.log(`RL - InvestNow Return % Calculator: waitForContent() called, retries: ${retries}/${CONFIG.maxRetries}`);
        console.log(`RL - InvestNow Return % Calculator: Document readyState: ${document.readyState}`);
        console.log(`RL - InvestNow Return % Calculator: Document body exists: ${!!document.body}`);
        console.log(`RL - InvestNow Return % Calculator: Current URL: ${window.location.href}`);

        if (document.readyState === 'complete' && document.body) {
            // Check if tables exist
            const tables = document.querySelectorAll('table');
            console.log(`RL - InvestNow Return % Calculator: Document ready, found ${tables.length} tables`);

            // Log all elements to help debug
            const allElements = document.querySelectorAll('*');
            console.log(`RL - InvestNow Return % Calculator: Total elements on page: ${allElements.length}`);

            // Look for any table-like elements
            const tableElements = document.querySelectorAll('table, .table, [role="table"]');
            console.log(`RL - InvestNow Return % Calculator: Found ${tableElements.length} table-like elements`);

            if (tables.length > 0) {
                console.log('RL - InvestNow Return % Calculator: Tables found, executing callback');
                callback();
                return;
            } else {
                console.log('RL - InvestNow Return % Calculator: No tables found, checking page content...');
                // Log some page content to debug
                const bodyText = document.body?.innerText?.substring(0, 500) || 'No body text';
                console.log(`RL - InvestNow Return % Calculator: Page content preview: ${bodyText}`);

                // Check if we're on dashboard and need to wait for navigation
                if (window.location.href.includes('/dashboard')) {
                    console.log('RL - InvestNow Return % Calculator: On dashboard page - will wait for navigation to Holdings/Returns');
                }
            }
        }

        if (retries < CONFIG.maxRetries) {
            console.log(`RL - InvestNow Return % Calculator: Retrying in ${CONFIG.retryDelay}ms...`);
            setTimeout(() => waitForContent(callback, retries + 1), CONFIG.retryDelay);
        } else {
            console.log('RL - InvestNow Return % Calculator: Max retries reached, giving up');
            console.log('RL - InvestNow Return % Calculator: Final page state:');
            console.log(`RL - InvestNow Return % Calculator: - URL: ${window.location.href}`);
            console.log(`RL - InvestNow Return % Calculator: - Title: ${document.title}`);
            console.log(`RL - InvestNow Return % Calculator: - ReadyState: ${document.readyState}`);

            // Even if no tables found initially, still set up observer and click handlers
            // This will catch navigation to Holdings/Returns pages
            console.log('RL - InvestNow Return % Calculator: Setting up observers anyway for navigation detection');
            setupAfterInit();
        }
    }

    // Set up observers and event handlers after initialization
    function setupAfterInit() {
        console.log('RL - InvestNow Return % Calculator: Setting up post-initialization observers');

        // Set up observer for dynamic content changes
        const observer = setupObserver();

        // Also reprocess on tab changes or clicks
        document.addEventListener('click', (e) => {
            // Check if click is on a tab or navigation element
            const target = e.target;
            if (target.matches('[role="tab"], .tab, .nav-link, button') ||
                target.closest('[role="tab"], .tab, .nav-link, button')) {
                console.log('RL - InvestNow Return % Calculator: Click detected on tab/navigation, triggering reprocess');
                setTimeout(processTables, 1000);
            }
        });

        // Periodic reprocessing for safety
        setInterval(() => {
            console.log('RL - InvestNow Return % Calculator: Periodic reprocess triggered');
            processTables();
        }, 5000);

        console.log('RL - InvestNow Return % Calculator: Post-initialization setup complete');
    }

    // Set up MutationObserver to detect content changes
    function setupObserver() {
        console.log('RL - InvestNow Return % Calculator: Setting up MutationObserver');
        const observer = new MutationObserver((mutations) => {
            let shouldReprocess = false;

            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    // Check if new tables were added or if existing tables changed
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.tagName === 'TABLE' || node.querySelector('table')) {
                                console.log('RL - InvestNow Return % Calculator: MutationObserver detected table changes');
                                shouldReprocess = true;
                            }
                        }
                    });
                }
            });

            if (shouldReprocess) {
                console.log('RL - InvestNow Return % Calculator: MutationObserver triggering reprocess');
                setTimeout(processTables, 500);
            }
        });

        observer.observe(document.body, CONFIG.observerConfig);
        console.log('RL - InvestNow Return % Calculator: MutationObserver setup complete');
        return observer;
    }

    // Initialize the script
    function init() {
        console.log('RL - InvestNow Return % Calculator: Initializing...');

        // Wait for initial content
        waitForContent(() => {
            console.log('RL - InvestNow Return % Calculator: Processing initial tables...');
            processTables();

            // Set up post-initialization observers
            setupAfterInit();

            console.log('RL - InvestNow Return % Calculator: Initialization complete');
        });
    }

    // Start the script
    if (document.readyState === 'loading') {
        console.log('RL - InvestNow Return % Calculator: Document still loading, waiting for DOMContentLoaded');
        document.addEventListener('DOMContentLoaded', init);
    } else {
        console.log('RL - InvestNow Return % Calculator: Document already loaded, initializing immediately');
        init();
    }

})();