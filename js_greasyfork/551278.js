// ==UserScript==
// @name         UNIT3D Torrent Group Sorter
// @namespace    https://tampermonkey.net/
// @license      MIT
// @version      2.0
// @description  Sort torrents by completed downloads, seeders, age, size, or type - click button to activate. Works on UNIT3D trackers, such as seedpool, fearnopeer, yu-scene and darkpeers.
// @author       boisterous-larva
// @match        https://*/torrents/similar/*
// @downloadURL https://update.greasyfork.org/scripts/551278/UNIT3D%20Torrent%20Group%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/551278/UNIT3D%20Torrent%20Group%20Sorter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for page to load
    window.addEventListener('load', function() {
        // Add activation button
        addActivationButton();
    });

    function addActivationButton() {
        const panelHeading = document.querySelector('.panel__heading');
        if (!panelHeading) return;

        const button = document.createElement('button');
        button.textContent = '🔢 Enable Table Sorting';
        button.style.cssText = `
            margin-left: 15px;
            padding: 5px 10px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
            vertical-align: middle;
        `;

        button.addEventListener('click', function() {
            // Remove the button
            button.remove();
            // Initialize the table transformation and sorting
            initializeTableSorting();
        });

        panelHeading.appendChild(button);
    }

    function initializeTableSorting() {
        // First, duplicate row headers for each row while keeping tbody elements
        const tableData = prepareTableForSorting();

        // Then set up the sorting for all columns
        const completedHeader = document.querySelector('.similar-torrents__completed-header');
        const seedersHeader = document.querySelector('.similar-torrents__seeders-header');
        const ageHeader = document.querySelector('.similar-torrents__age-header');
        const sizeHeader = document.querySelector('.similar-torrents__size-header');
        const typeHeader = document.querySelector('.similar-torrents__type-header');

        if (!completedHeader || !seedersHeader || !ageHeader || !sizeHeader || !typeHeader) return;

        // Store original content before modifying
        const originalCompletedContent = completedHeader.innerHTML;
        const originalSeedersContent = seedersHeader.innerHTML;
        const originalAgeContent = ageHeader.innerHTML;
        const originalSizeContent = sizeHeader.innerHTML;
        const originalTypeContent = typeHeader.innerHTML;

        // Set up completed header
        completedHeader.style.cursor = 'pointer';
        completedHeader.title = 'Click to sort by completed downloads';

        // Set up seeders header
        seedersHeader.style.cursor = 'pointer';
        seedersHeader.title = 'Click to sort by seeders';

        // Set up age header
        ageHeader.style.cursor = 'pointer';
        ageHeader.title = 'Click to sort by age';

        // Set up size header
        sizeHeader.style.cursor = 'pointer';
        sizeHeader.title = 'Click to sort by size';

        // Set up type header
        typeHeader.style.cursor = 'pointer';
        typeHeader.title = 'Click to sort by type';

        let currentSort = { column: 'completed', direction: 'desc' };

        completedHeader.addEventListener('click', function() {
            if (currentSort.column === 'completed') {
                // Toggle direction if same column
                currentSort.direction = currentSort.direction === 'desc' ? 'asc' : 'desc';
            } else {
                // Switch to completed column with default desc direction
                currentSort = { column: 'completed', direction: 'desc' };
            }
            sortTable(tableData, currentSort.column, currentSort.direction);
            updateSortIndicators(currentSort, originalCompletedContent, originalSeedersContent, originalAgeContent, originalSizeContent, originalTypeContent);
        });

        seedersHeader.addEventListener('click', function() {
            if (currentSort.column === 'seeders') {
                // Toggle direction if same column
                currentSort.direction = currentSort.direction === 'desc' ? 'asc' : 'desc';
            } else {
                // Switch to seeders column with default desc direction
                currentSort = { column: 'seeders', direction: 'desc' };
            }
            sortTable(tableData, currentSort.column, currentSort.direction);
            updateSortIndicators(currentSort, originalCompletedContent, originalSeedersContent, originalAgeContent, originalSizeContent, originalTypeContent);
        });

        ageHeader.addEventListener('click', function() {
            if (currentSort.column === 'age') {
                // Toggle direction if same column
                currentSort.direction = currentSort.direction === 'desc' ? 'asc' : 'desc';
            } else {
                // Switch to age column with default desc direction (newest first)
                currentSort = { column: 'age', direction: 'desc' };
            }
            sortTable(tableData, currentSort.column, currentSort.direction);
            updateSortIndicators(currentSort, originalCompletedContent, originalSeedersContent, originalAgeContent, originalSizeContent, originalTypeContent);
        });

        sizeHeader.addEventListener('click', function() {
            if (currentSort.column === 'size') {
                // Toggle direction if same column
                currentSort.direction = currentSort.direction === 'desc' ? 'asc' : 'desc';
            } else {
                // Switch to size column with default desc direction (largest first)
                currentSort = { column: 'size', direction: 'desc' };
            }
            sortTable(tableData, currentSort.column, currentSort.direction);
            updateSortIndicators(currentSort, originalCompletedContent, originalSeedersContent, originalAgeContent, originalSizeContent, originalTypeContent);
        });

        typeHeader.addEventListener('click', function() {
            if (currentSort.column === 'type') {
                // Toggle direction if same column
                currentSort.direction = currentSort.direction === 'desc' ? 'asc' : 'desc';
            } else {
                // Switch to type column with default asc direction (alphabetical)
                currentSort = { column: 'type', direction: 'asc' };
            }
            sortTable(tableData, currentSort.column, currentSort.direction);
            updateSortIndicators(currentSort, originalCompletedContent, originalSeedersContent, originalAgeContent, originalSizeContent, originalTypeContent);
        });

        function prepareTableForSorting() {
            const table = document.querySelector('.similar-torrents__torrents');
            const tableBodies = Array.from(table.querySelectorAll('tbody'));
            const tableData = {
                bodies: [],
                allRows: []
            };

            tableBodies.forEach(tbody => {
                const allRows = Array.from(tbody.querySelectorAll('tr'));

                // Find the group header row (the one with the spanning th)
                const groupHeaderRow = allRows.find(row => {
                    const headerCell = row.querySelector('.similar-torrents__type[rowspan]');
                    return headerCell && parseInt(headerCell.getAttribute('rowspan')) > 1;
                });

                if (groupHeaderRow) {
                    const groupHeaderCell = groupHeaderRow.querySelector('.similar-torrents__type[rowspan]');
                    const headerText = groupHeaderCell.textContent.trim();

                    // Remove the group header cell from its original row
                    groupHeaderCell.remove();

                    // Process all data rows in this tbody
                    allRows.forEach(row => {
                        // Remove any existing header cells in this row
                        const existingHeader = row.querySelector('.similar-torrents__type');
                        if (existingHeader) {
                            existingHeader.remove();
                        }

                        // Create and insert new header cell for every row
                        const newHeader = document.createElement('th');
                        newHeader.className = 'similar-torrents__type';
                        newHeader.textContent = headerText;
                        newHeader.scope = 'row';
                        row.insertBefore(newHeader, row.firstChild);

                        // Store row reference for sorting
                        tableData.allRows.push(row);
                    });

                    // Store the tbody reference
                    tableData.bodies.push(tbody);
                } else {
                    // This tbody doesn't have a spanning group header
                    allRows.forEach(row => {
                        // Ensure existing headers have proper scope
                        const existingHeader = row.querySelector('.similar-torrents__type');
                        if (existingHeader) {
                            existingHeader.scope = 'row';
                        }
                        tableData.allRows.push(row);
                    });
                    tableData.bodies.push(tbody);
                }
            });

            console.log(`Prepared ${tableData.allRows.length} rows for sorting`);
            return tableData;
        }

        function sortTable(tableData, column, direction) {
            const rows = tableData.allRows;

            if (rows.length === 0) {
                console.error('No rows found for sorting');
                return;
            }

            console.log(`Sorting ${rows.length} rows by ${column} in ${direction} order`);

            rows.sort((a, b) => {
                let valueA, valueB;

                if (column === 'completed') {
                    valueA = getCompletedValue(a);
                    valueB = getCompletedValue(b);
                } else if (column === 'seeders') {
                    valueA = getSeedersValue(a);
                    valueB = getSeedersValue(b);
                } else if (column === 'age') {
                    valueA = getAgeValue(a);
                    valueB = getAgeValue(b);
                } else if (column === 'size') {
                    valueA = getSizeValue(a);
                    valueB = getSizeValue(b);
                } else if (column === 'type') {
                    valueA = getTypeValue(a);
                    valueB = getTypeValue(b);
                }

                // For string comparisons (type), we need to handle differently
                if (column === 'type') {
                    if (direction === 'desc') {
                        return valueB.localeCompare(valueA);
                    } else {
                        return valueA.localeCompare(valueB);
                    }
                } else {
                    // For numeric comparisons
                    return direction === 'desc' ? valueB - valueA : valueA - valueB;
                }
            });

            // Clear all tbody elements first
            tableData.bodies.forEach(tbody => {
                while (tbody.firstChild) {
                    tbody.removeChild(tbody.firstChild);
                }
            });

            // Redistribute sorted rows back into tbody elements
            const firstTbody = tableData.bodies[0];
            rows.forEach(row => firstTbody.appendChild(row));

            // Remove empty tbody elements (except the first one)
            for (let i = 1; i < tableData.bodies.length; i++) {
                const tbody = tableData.bodies[i];
                if (tbody.parentNode && tbody.children.length === 0) {
                    tbody.remove();
                }
            }
        }

        function getCompletedValue(row) {
            const completedLink = row.querySelector('.torrent-search--grouped__completed .text-orange');
            if (completedLink) {
                const text = completedLink.textContent.trim();
                return parseInt(text) || 0;
            }

            // Fallback: try to find any completed value in the completed cell
            const completedCell = row.querySelector('.torrent-search--grouped__completed');
            if (completedCell) {
                const text = completedCell.textContent.trim();
                const match = text.match(/\d+/);
                return match ? parseInt(match[0]) : 0;
            }

            return 0;
        }

        function getSeedersValue(row) {
            // Try multiple selectors to find the seeders value
            let seedersText = '';

            // First, try the specific seeders cell
            const seedersCell = row.querySelector('.similar-torrents__seeders');
            if (seedersCell) {
                seedersText = seedersCell.textContent.trim();
            } else {
                // Try to find any cell that might contain seeders information
                // Look for the cell in the same position as the seeders header
                const allCells = row.querySelectorAll('td');
                const seedersHeader = document.querySelector('.torrent-search--grouped__seeders .type-green');

                if (seedersHeader) {
                    // Find the index of the seeders header in the table header row
                    const headerRow = seedersHeader.closest('tr');
                    if (headerRow) {
                        const headerCells = Array.from(headerRow.querySelectorAll('th, td'));
                        const seedersIndex = headerCells.indexOf(seedersHeader);

                        if (seedersIndex !== -1 && allCells[seedersIndex]) {
                            seedersText = allCells[seedersIndex].textContent.trim();
                        }
                    }
                }

                // If still not found, try to find any cell with seeders-like content
                if (!seedersText) {
                    for (let cell of allCells) {
                        const text = cell.textContent.trim();
                        // Look for cells that only contain a number (likely seeders/leechers)
                        if (/^\d+$/.test(text)) {
                            seedersText = text;
                            break;
                        }
                    }
                }
            }

            // Extract the numeric value
            if (seedersText) {
                const match = seedersText.match(/\d+/);
                return match ? parseInt(match[0]) : 0;
            }

            return 0;
        }

        function getAgeValue(row) {
            // Find the age cell and extract the datetime attribute
            const ageCell = row.querySelector('.torrent-search--grouped__age');
            if (ageCell) {
                const timeElement = ageCell.querySelector('time');
                if (timeElement && timeElement.hasAttribute('datetime')) {
                    const datetime = timeElement.getAttribute('datetime');
                    // Convert the datetime string to a timestamp for sorting
                    return new Date(datetime).getTime();
                }
            }

            // Fallback: if no datetime attribute, return a very old date
            return 0;
        }

        function getSizeValue(row) {
            // Find the size cell and extract the byte value from the title attribute
            const sizeCell = row.querySelector('.torrent-search--grouped__size');
            if (sizeCell) {
                const spanElement = sizeCell.querySelector('span');
                if (spanElement && spanElement.hasAttribute('title')) {
                    const title = spanElement.getAttribute('title');
                    // Extract the numeric byte value from the title (e.g., "55955516318 B")
                    const match = title.match(/(\d+)\s*B/);
                    if (match) {
                        return parseInt(match[1]);
                    }
                }

                // Fallback: if no title attribute, try to parse the displayed text
                const sizeText = sizeCell.textContent.trim();
                return parseFileSize(sizeText);
            }

            return 0;
        }

        function getTypeValue(row) {
            // Find the type header cell in the row
            const typeCell = row.querySelector('.similar-torrents__type');
            if (typeCell) {
                return typeCell.textContent.trim();
            }
            return '';
        }

        function parseFileSize(sizeString) {
            // Parse human-readable file sizes like "52.11 GiB", "1.2 MiB", etc.
            const units = {
                'B': 1,
                'KiB': 1024,
                'MiB': 1024 * 1024,
                'GiB': 1024 * 1024 * 1024,
                'TiB': 1024 * 1024 * 1024 * 1024,
                'KB': 1000,
                'MB': 1000 * 1000,
                'GB': 1000 * 1000 * 1000,
                'TB': 1000 * 1000 * 1000 * 1000
            };

            const match = sizeString.match(/([\d.]+)\s*([KMGTP]?i?B)/);
            if (match) {
                const value = parseFloat(match[1]);
                const unit = match[2];
                return Math.round(value * (units[unit] || 1));
            }

            return 0;
        }

        function updateSortIndicators(sortState, originalCompleted, originalSeeders, originalAge, originalSize, originalType) {
            const completedHeader = document.querySelector('.similar-torrents__completed-header');
            const seedersHeader = document.querySelector('.similar-torrents__seeders-header');
            const ageHeader = document.querySelector('.similar-torrents__age-header');
            const sizeHeader = document.querySelector('.similar-torrents__size-header');
            const typeHeader = document.querySelector('.similar-torrents__type-header');

            // Reset all headers to their original content
            completedHeader.innerHTML = originalCompleted;
            seedersHeader.innerHTML = originalSeeders;
            ageHeader.innerHTML = originalAge;
            sizeHeader.innerHTML = originalSize;
            typeHeader.innerHTML = originalType;

            // Add indicator to active column by appending arrow to existing content
            const arrow = sortState.direction === 'desc' ? ' ↓' : ' ↑';

            if (sortState.column === 'completed') {
                completedHeader.innerHTML += arrow;
            } else if (sortState.column === 'seeders') {
                seedersHeader.innerHTML += arrow;
            } else if (sortState.column === 'age') {
                ageHeader.innerHTML += arrow;
            } else if (sortState.column === 'size') {
                sizeHeader.innerHTML += arrow;
            } else if (sortState.column === 'type') {
                typeHeader.innerHTML += arrow;
            }

            // Restore cursor styles and titles
            completedHeader.style.cursor = 'pointer';
            completedHeader.title = 'Click to sort by completed downloads';
            seedersHeader.style.cursor = 'pointer';
            seedersHeader.title = 'Click to sort by seeders';
            ageHeader.style.cursor = 'pointer';
            ageHeader.title = 'Click to sort by age';
            sizeHeader.style.cursor = 'pointer';
            sizeHeader.title = 'Click to sort by size';
            typeHeader.style.cursor = 'pointer';
            typeHeader.title = 'Click to sort by type';
        }

        // Initial sort by completed (descending)
        sortTable(tableData, currentSort.column, currentSort.direction);
        updateSortIndicators(currentSort, originalCompletedContent, originalSeedersContent, originalAgeContent, originalSizeContent, originalTypeContent);

        // Show a quick confirmation
        showNotification('Table sorting enabled! Click the Completed, Seeders, Age, Size, or Type column headers to sort.');
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 10000;
            padding: 10px 15px;
            background: #2196F3;
            color: white;
            border-radius: 5px;
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        `;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
})();
