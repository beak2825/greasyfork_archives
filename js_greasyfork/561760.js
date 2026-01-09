// ==UserScript==
// @name        TTUC - Catacombs Map
// @namespace   lander_scripts
// @version     0.1.13
// @description Draws a map for the catacombs in the game, allows placing POIs, and marks exits.
// @author      You
// @match       https://badtraining.quest/story/trainer1
// @icon        https://badtraining.quest/favicon.ico
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/561760/TTUC%20-%20Catacombs%20Map.user.js
// @updateURL https://update.greasyfork.org/scripts/561760/TTUC%20-%20Catacombs%20Map.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentRow = null;
    let currentCol = null;
    let mapData = JSON.parse(localStorage.getItem('catacombsMap')) || {};
    let mapDiv = null;
    let lastLocation = null;
    let lastMapData = null;
    let floatingTooltip = null;
    let tooltipTimeout = null;

    function parsePosition(loc) {
        if (!loc || !loc.startsWith('catacombs?')) return null;
        const params = new URLSearchParams(loc.split('?')[1]);
        const cc = parseInt(params.get('cc'));
        const rr = parseInt(params.get('rr'));
        if (isNaN(cc) || isNaN(rr)) return null;
        return { row: rr, col: cc };
    }

    function getAvailableDirections() {
        const directions = {};
        const directionElements = document.querySelectorAll('[x-data-key]');

        directionElements.forEach(el => {
            const key = el.getAttribute('x-data-key');
            if (['n', 's', 'e', 'w'].includes(key)) {
                directions[key] = true;
            }
        });

        return directions;
    }

    function updateMap() {
        const pos = parsePosition(window.current_page ? window.current_page.location : null);
        if (!pos) return false;

        currentRow = pos.row;
        currentCol = pos.col;
        const key = `${currentRow}_${currentCol}`;

        // Check if we actually moved or if data changed
        const currentLocation = `${currentRow}_${currentCol}`;
        const mapDataChanged = JSON.stringify(mapData) !== JSON.stringify(lastMapData);

        if (currentLocation === lastLocation && !mapDataChanged) {
            return false; // No changes, skip update
        }

        lastLocation = currentLocation;
        lastMapData = JSON.parse(JSON.stringify(mapData)); // Deep copy

        // Mark current cell as visited
        if (!mapData[key]) {
            mapData[key] = { visited: true, poi: '', isExit: false, directions: {} };
        } else {
            mapData[key].visited = true;
        }

        // Get available directions from current position
        const availableDirs = getAvailableDirections();
        mapData[key].directions = availableDirs;

        // Check if this is a dead end (only one possible direction)
        const dirCount = Object.keys(availableDirs).length;
        if (dirCount === 1) {
            mapData[key].isDeadEnd = true;
        } else {
            mapData[key].isDeadEnd = false;
        }

        // Mark adjacent cells as reachable (even if not visited)
        for (const dir in availableDirs) {
            let adjRow = currentRow;
            let adjCol = currentCol;

            switch(dir) {
                case 'n': adjRow--; break;
                case 's': adjRow++; break;
                case 'e': adjCol++; break;
                case 'w': adjCol--; break;
            }

            const adjKey = `${adjRow}_${adjCol}`;
            if (!mapData[adjKey]) {
                mapData[adjKey] = {
                    visited: false,
                    poi: '',
                    isExit: false,
                    isDeadEnd: false,
                    directions: {}
                };
            }
        }

        // Check for exit
        if (window.current_page && window.current_page.next_pages &&
            Array.isArray(window.current_page.next_pages) &&
            Array.isArray(window.current_page.next_pages[0]) &&
            window.current_page.next_pages[0][1] === "Climb the ladder") {
            mapData[key].isExit = true;
        }

        localStorage.setItem('catacombsMap', JSON.stringify(mapData));
        return true; // Changes were made
    }

    // Function to count graphemes (visual characters) properly
    function countGraphemes(str) {
        // Use Intl.Segmenter for modern browsers to properly count graphemes
        if (typeof Intl !== 'undefined' && Intl.Segmenter) {
            const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
            return [...segmenter.segment(str)].length;
        }
        // Fallback for older browsers: split by Unicode code points
        return [...str].length;
    }

    function setPOI(row, col, currentPOI = '') {
        const key = `${row}_${col}`;
        const char = prompt('Enter a single character or emoji for POI (or leave empty to remove):', currentPOI || '');

        if (char !== null) {
            if (char === '') {
                // Remove POI
                if (mapData[key]) {
                    mapData[key].poi = '';
                }
            } else {
                // Check if it's a single visual character (grapheme)
                const graphemeCount = countGraphemes(char);
                if (graphemeCount === 1) {
                    // Set POI
                    if (!mapData[key]) {
                        mapData[key] = {
                            visited: false,
                            poi: char,
                            isExit: false,
                            isDeadEnd: false,
                            directions: {}
                        };
                    } else {
                        mapData[key].poi = char;
                    }
                } else {
                    alert(`Please enter exactly ONE character or emoji. You entered ${graphemeCount} visual characters.`);
                    return; // Don't save if not a single character
                }
            }

            localStorage.setItem('catacombsMap', JSON.stringify(mapData));
            lastMapData = null; // Force redraw
            updateAndDrawMap();
        }
    }

    function deleteCellData(row, col) {
        const key = `${row}_${col}`;
        if (mapData[key]) {
            const confirmDelete = confirm(`Delete all data for cell (${col}, ${row})?\n\nThis will remove:\n- Visited status\n- POI\n- Exit marker\n- Dead end marker\n- Direction data\n\nThis action cannot be undone.`);

            if (confirmDelete) {
                delete mapData[key];
                localStorage.setItem('catacombsMap', JSON.stringify(mapData));
                lastMapData = null; // Force redraw
                updateAndDrawMap();
            }
        }
    }

    function getTooltipText(r, c, cellData) {
        let tooltipText = `(${c}, ${r})`;
        if (cellData) {
            if (cellData.visited) {
                tooltipText += ' - Visited';
                if (cellData.isDeadEnd) {
                    tooltipText += ' - 🚧Dead End';
                }
                if (cellData.isExit) {
                    tooltipText += ' - 🚪Exit';
                }
                if (cellData.poi) {
                    tooltipText += ` - 📍POI: ${cellData.poi}`;
                }
            } else {
                tooltipText += ' - Reachable (unvisited)';
                if (cellData.poi) {
                    tooltipText += ` - 📍POI: ${cellData.poi}`;
                }
            }
        } else {
            tooltipText += ' - Unknown';
        }

        // Add keyboard shortcut info to tooltip
        //tooltipText += '\nShift+Click: Edit POI | Ctrl+Click: Delete';
        return tooltipText;
    }

    function createFloatingTooltip() {
        if (floatingTooltip) return floatingTooltip;

        floatingTooltip = document.createElement('div');
        floatingTooltip.id = 'floatingMapTooltip';
        floatingTooltip.style.position = 'fixed';
        floatingTooltip.style.zIndex = '10000';
        floatingTooltip.style.backgroundColor = '#222';
        floatingTooltip.style.color = '#fff';
        floatingTooltip.style.padding = '6px 10px';
        floatingTooltip.style.borderRadius = '4px';
        floatingTooltip.style.fontSize = '12px';
        floatingTooltip.style.whiteSpace = 'pre';
        floatingTooltip.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
        floatingTooltip.style.textAlign = 'center';
        floatingTooltip.style.lineHeight = '1.4';
        floatingTooltip.style.minWidth = '120px';
        floatingTooltip.style.maxWidth = '200px';
        floatingTooltip.style.pointerEvents = 'none';
        floatingTooltip.style.opacity = '0';
        floatingTooltip.style.transition = 'opacity 0.15s ease';
        floatingTooltip.style.border = '1px solid #444';

        document.body.appendChild(floatingTooltip);
        return floatingTooltip;
    }

    function showTooltip(text, x, y) {
        const tooltip = createFloatingTooltip();

        if (tooltipTimeout) {
            clearTimeout(tooltipTimeout);
            tooltipTimeout = null;
        }

        tooltip.textContent = text;
        tooltip.style.opacity = '1';

        // Position the tooltip with offset from mouse pointer
        const offsetX = 15;
        const offsetY = 15;

        // Get tooltip dimensions
        tooltip.style.left = '0px';
        tooltip.style.top = '0px';
        const rect = tooltip.getBoundingClientRect();

        // Calculate position, adjusting if it would go off-screen
        let finalX = x + offsetX;
        let finalY = y + offsetY;

        // Check right edge
        if (finalX + rect.width > window.innerWidth) {
            finalX = x - rect.width - offsetX;
        }

        // Check bottom edge
        if (finalY + rect.height > window.innerHeight) {
            finalY = y - rect.height - offsetY;
        }

        // Ensure it doesn't go off left or top edges
        finalX = Math.max(5, finalX);
        finalY = Math.max(5, finalY);

        tooltip.style.left = finalX + 'px';
        tooltip.style.top = finalY + 'px';
    }

    function hideTooltip() {
        if (!floatingTooltip) return;

        tooltipTimeout = setTimeout(() => {
            if (floatingTooltip) {
                floatingTooltip.style.opacity = '0';
            }
        }, 100); // Small delay to prevent flickering when moving between cells
    }

    function updateMapCell(td, r, c) {
        const key = `${r}_${c}`;
        const cellData = mapData[key];

        // Clear existing content
        td.textContent = '';

        // Reset to default styles
        td.style.border = '1px solid #444';

        if (cellData) {
            // Determine background color based on cell status
            if (r === currentRow && c === currentCol) {
                // Current position gets special highlighting
                td.style.border = '2px solid purple';
                td.style.backgroundColor = '#555';
            } else if (cellData.visited) {
                if (cellData.isDeadEnd) {
                    // Dead end cells: dark grayish-red (#5a3a3a)
                    td.style.backgroundColor = '#5a3a3a';
                } else {
                    // Regular visited cells
                    td.style.backgroundColor = '#333';
                }
            } else {
                // Unvisited but reachable cells
                td.style.backgroundColor = '#1a1a1a';
            }

            // Add cell content
            let text = cellData.poi || '';

            // Add exit emoji if it's an exit
            if (cellData.isExit) {
                text += '🚪';
            }

            td.textContent = text;
        } else {
            // Unknown/unreachable cells
            td.style.backgroundColor = '#0a0a0a';
        }
    }

    function updatePositionDisplay() {
        const positionDisplay = document.getElementById('currentPositionDisplay');
        if (positionDisplay) {
            positionDisplay.textContent = `👤: (${currentCol}, ${currentRow})`;
        }
    }

    function updateAndDrawMap() {
        if (!mapDiv) return;

        const table = mapDiv.querySelector('table');
        const needsFullRedraw = !table;

        if (needsFullRedraw) {
            drawFullMap();
        } else {
            // Just update the existing map
            const rows = table.rows;
            for (let i = 0; i < rows.length; i++) {
                const cells = rows[i].cells;
                for (let j = 0; j < cells.length; j++) {
                    const td = cells[j];
                    const r = parseInt(td.dataset.row);
                    const c = parseInt(td.dataset.col);
                    updateMapCell(td, r, c);
                }
            }

            updatePositionDisplay();
        }
    }

    function drawFullMap() {
        const rows = [];
        const cols = [];
        for (let key in mapData) {
            const [r, c] = key.split('_').map(Number);
            rows.push(r);
            cols.push(c);
        }

        if (rows.length === 0) {
            mapDiv.innerHTML = '<p>No map data yet.</p>';
            return;
        }

        const minRow = Math.min(...rows);
        const maxRow = Math.max(...rows);
        const minCol = Math.min(...cols);
        const maxCol = Math.max(...cols);

        // Create container for map and controls
        const container = document.createElement('div');

        // Create controls container
        const controlsDiv = document.createElement('div');
        controlsDiv.style.display = 'flex';
        controlsDiv.style.alignItems = 'center';
        controlsDiv.style.gap = '10px';
        controlsDiv.style.marginBottom = '10px';
        controlsDiv.style.fontSize = '12px';
        controlsDiv.style.flexWrap = 'wrap';
        controlsDiv.style.justifyContent = 'space-between';

        // Current position display
        const positionDisplay = document.createElement('div');
        positionDisplay.id = 'currentPositionDisplay';
        positionDisplay.style.color = '#fff';
        positionDisplay.style.fontWeight = 'bold';
        positionDisplay.textContent = `Position: (${currentCol}, ${currentRow})`;
        controlsDiv.appendChild(positionDisplay);

        // POI Help text (not a button)
        const poiHelpText = document.createElement('div');
        poiHelpText.id = 'poiHelpText';
        poiHelpText.textContent = '⌨️';
        poiHelpText.style.cursor = 'help';
        poiHelpText.style.userSelect = 'none';
        poiHelpText.title = '⌨️Shift+Click: Add/edit POI marker (single character)\n⌨️Ctrl+Click: Delete all data for cell';
        controlsDiv.appendChild(poiHelpText);

        // Reset Map button
        const resetBtn = document.createElement('button');
        resetBtn.textContent = '🗑 Reset Map';
        resetBtn.style.border = 'none';
        resetBtn.style.borderRadius = '10px';
        resetBtn.style.padding = '5px 10px';
        resetBtn.style.fontSize = '0.8em';
        resetBtn.style.backgroundColor = '#c62828';
        resetBtn.style.color = '#fff';
        resetBtn.style.cursor = 'pointer';
        resetBtn.onclick = () => {
            const confirmReset = confirm('⚠️WARNING⚠️\n\nThis will completely reset your map data. This action is irreversible.\n\nAre you sure you want to reset the map?');
            if (confirmReset) {
                mapData = {};
                localStorage.removeItem('catacombsMap');
                currentRow = null;
                currentCol = null;
                lastLocation = null;
                lastMapData = null;
                drawFullMap();
            }
        };
        controlsDiv.appendChild(resetBtn);

        // Create the map table
        const table = document.createElement('table');
        table.style.borderCollapse = 'collapse';

        for (let r = minRow; r <= maxRow; r++) {
            const tr = document.createElement('tr');
            for (let c = minCol; c <= maxCol; c++) {
                const td = document.createElement('td');
                td.style.width = '20px';
                td.style.height = '20px';
                td.style.border = '1px solid #444';
                td.style.textAlign = 'center';
                td.style.fontSize = '12px';
                td.style.position = 'relative';
                td.style.cursor = 'crosshair';
                td.style.userSelect = 'none'; // Prevent text selection

                // Store coordinates as data attributes for click handling
                td.dataset.row = r;
                td.dataset.col = c;

                const key = `${r}_${c}`;
                const cellData = mapData[key];

                // Add event listeners for tooltip
                td.addEventListener('mouseenter', function(e) {
                    const tooltipText = getTooltipText(r, c, cellData);
                    showTooltip(tooltipText, e.clientX, e.clientY);
                });

                td.addEventListener('mousemove', function(e) {
                    const tooltipText = getTooltipText(r, c, cellData);
                    showTooltip(tooltipText, e.clientX, e.clientY);
                });

                td.addEventListener('mouseleave', function(e) {
                    hideTooltip();
                });

                // Handle keyboard shortcut clicks
                td.addEventListener('click', function(e) {
                    const row = parseInt(this.dataset.row);
                    const col = parseInt(this.dataset.col);

                    if (e.shiftKey) {
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();

                        // Prevent text selection
                        if (window.getSelection) {
                            window.getSelection().removeAllRanges();
                        } else if (document.selection) {
                            document.selection.empty();
                        }

                        const key = `${row}_${col}`;
                        const currentPOI = mapData[key] ? mapData[key].poi : '';
                        setPOI(row, col, currentPOI);
                    } else if (e.ctrlKey) {
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();

                        // Prevent text selection
                        if (window.getSelection) {
                            window.getSelection().removeAllRanges();
                        } else if (document.selection) {
                            document.selection.empty();
                        }

                        deleteCellData(row, col);
                    }
                });

                // Set initial cell appearance
                updateMapCell(td, r, c);
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }

        // Assemble everything
        container.appendChild(controlsDiv);
        container.appendChild(table);

        // Clear and add new content
        mapDiv.innerHTML = '';
        mapDiv.appendChild(container);
    }

    function checkLocation() {
        if (window.current_page && window.current_page.id === 'catacombs') {
            const hasChanges = updateMap();

            if (!mapDiv) {
                mapDiv = document.createElement('div');
                mapDiv.id = 'catacombsMap';
                mapDiv.style.position = 'fixed';
                mapDiv.style.bottom = '10px';
                mapDiv.style.left = '10px';
                mapDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                mapDiv.style.padding = '10px';
                mapDiv.style.borderRadius = '5px';
                mapDiv.style.zIndex = '1000';
                mapDiv.style.overflow = 'auto';
                mapDiv.style.maxHeight = '80vh';
                mapDiv.style.maxWidth = '80vw';
                document.body.appendChild(mapDiv);
            }

            mapDiv.style.display = 'block';

            if (hasChanges || !mapDiv.querySelector('table')) {
                updateAndDrawMap();
            }
        } else {
            if (mapDiv) {
                mapDiv.style.display = 'none';
            }
            // Also hide the floating tooltip when not in catacombs
            if (floatingTooltip) {
                floatingTooltip.style.opacity = '0';
            }
        }
    }

    // Poll every 1 second for changes
    setInterval(checkLocation, 100);

    // Initial check
    checkLocation();
})();