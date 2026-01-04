// ==UserScript==
// @name         Enhanced Collect Table Pages (Optimized + Progress + Error Handling)
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  Enhanced table collection with progress indicators, better performance, error handling, and conflict prevention
// @author       Nicolai
// @match        *://app.bar-i.com/barI/analysis-workflow/accountability-analysis/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/550515/Enhanced%20Collect%20Table%20Pages%20%28Optimized%20%2B%20Progress%20%2B%20Error%20Handling%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550515/Enhanced%20Collect%20Table%20Pages%20%28Optimized%20%2B%20Progress%20%2B%20Error%20Handling%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /** ===============================
     * Configuration & State Management
     * =============================== */
    const CONFIG = {
        NAMESPACE_PREFIX: 'CTP_', // Unique prefix to avoid conflicts
        BUTTON_Z_INDEX: 9998, // Lower than invoice helper (9999+)
        PAGE_WAIT_TIME: 2800, // Optimized from 3500ms
        MAX_RETRIES: 3,
        PROGRESS_UPDATE_DELAY: 100
    };

    const State = {
        button: null,
        activeTable: null,
        cleanupFunctions: [],
        isProcessing: false,
        progressIndicator: null,
        sortState: null
    };

    /** ===============================
     * Utility Functions
     * =============================== */
    const Utils = {
        sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

        isTargetPage: () => /app\.bar-i\.com\/barI\/analysis-workflow\/accountability-analysis\//.test(location.href),

        debounce: (func, delay = 200) => {
            let timeoutId;
            return (...args) => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => func.apply(null, args), delay);
            };
        },

        createProgressIndicator: (text, color = '#d99416') => {
            const indicator = document.createElement('div');
            indicator.id = CONFIG.NAMESPACE_PREFIX + 'progress';
            indicator.style.cssText = `
                position: fixed;
                top: 90px;
                left: 160px;
                z-index: 2147483639;
                padding: 8px 16px;
                background: ${color};
                color: white;
                border-radius: 6px;
                font: bold 12px/1.4 system-ui, -apple-system, sans-serif;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                pointer-events: none;
                opacity: 0.95;
                transition: all 0.3s ease;
                min-width: 200px;
                text-align: center;
            `;
            indicator.textContent = text;
            document.body.appendChild(indicator);
            return indicator;
        },

        updateProgress: (indicator, text, color) => {
            if (indicator) {
                indicator.textContent = text;
                if (color) indicator.style.background = color;
            }
        },

        removeProgress: (indicator) => {
            if (indicator && indicator.parentNode) {
                indicator.style.opacity = '0';
                setTimeout(() => {
                    if (indicator.parentNode) indicator.remove();
                }, 300);
            }
        }
    };

    /** ===============================
     * Enhanced Button Creation
     * =============================== */
    function createEnhancedButton(table) {
        if (State.button || State.isProcessing) return;

        State.activeTable = table;
        State.button = document.createElement("button");
        State.button.id = CONFIG.NAMESPACE_PREFIX + 'collectBtn';
        State.button.innerHTML = '📊 SHOW ALL (collect pages)';

        Object.assign(State.button.style, {
            position: 'fixed',
            top: '55px',
            left: '160px', // Position next to Enable Table Sort button
            zIndex: CONFIG.BUTTON_Z_INDEX,
            padding: '5px 10px', // Match Enable Table Sort button padding
            backgroundColor: '#d99416',
            color: '#fff',
            border: 'none',
            borderRadius: '6px', // Match Enable Table Sort button border radius
            cursor: 'pointer',
            font: '13px/1.2 system-ui,-apple-system,Segoe UI,Roboto,sans-serif', // Match Enable Table Sort button font
            boxShadow: '0 6px 18px rgba(0,0,0,.08)', // Match Enable Table Sort button shadow
            transition: 'all 0.2s ease',
            userSelect: 'none'
        });

        // Enhanced interactions
        State.button.addEventListener('mouseenter', () => {
            if (!State.isProcessing) {
                State.button.style.backgroundColor = '#b8800f';
                State.button.style.transform = 'translateY(-1px)';
            }
        });

        State.button.addEventListener('mouseleave', () => {
            if (!State.isProcessing) {
                State.button.style.backgroundColor = '#d99416';
                State.button.style.transform = 'translateY(0)';
            }
        });

        const clickHandler = async (event) => {
            event.preventDefault();
            event.stopPropagation();

            if (State.isProcessing) {
                console.warn('[CTP] Collection already in progress');
                return;
            }

            await performEnhancedCollection();
        };

        State.button.addEventListener('click', clickHandler);
        State.cleanupFunctions.push(() => {
            State.button.removeEventListener('click', clickHandler);
        });

        document.body.appendChild(State.button);
        console.log('[CTP] Enhanced button created');
    }

    /** ===============================
     * Enhanced Collection Logic
     * =============================== */
    async function performEnhancedCollection() {
        State.isProcessing = true;
        State.button.disabled = true;
        State.button.style.opacity = '0.7';
        State.button.style.cursor = 'not-allowed';
        State.button.innerHTML = '⏳ Processing...';

        State.progressIndicator = Utils.createProgressIndicator('Initializing collection...');

        try {
            const tbody = State.activeTable.tBodies[0];
            if (!tbody) {
                throw new Error('Table body not found');
            }

            // Enhanced row collection with deduplication
            const collectedRows = new Map(); // Use Map for better performance
            let pageCount = 1;

            // Collect initial page
            Utils.updateProgress(State.progressIndicator, `Collecting page ${pageCount}...`);
            Array.from(tbody.rows).forEach((row, index) => {
                const key = generateRowKey(row);
                collectedRows.set(key, { html: row.outerHTML, originalIndex: index });
            });

            // Navigate through pages with enhanced error handling
            let nextButton = findNextButton();
            let retryCount = 0;

            while (nextButton && retryCount < CONFIG.MAX_RETRIES) {
                try {
                    pageCount++;
                    Utils.updateProgress(State.progressIndicator,
                        `Navigating to page ${pageCount}... (${collectedRows.size} rows collected)`);

                    nextButton.click();
                    await Utils.sleep(CONFIG.PAGE_WAIT_TIME);

                    // Wait for page load with timeout
                    const newTable = await waitForTableUpdate();
                    if (!newTable || !newTable.tBodies[0]) {
                        console.warn('[CTP] Table update timeout, retrying...');
                        retryCount++;
                        await Utils.sleep(1000);
                        continue;
                    }

                    const newTbody = newTable.tBodies[0];

                    // Update our active table reference
                    State.activeTable = newTable;
                    if (newTbody) {
                        Array.from(newTbody.rows).forEach((row, index) => {
                            const key = generateRowKey(row);
                            if (!collectedRows.has(key)) {
                                collectedRows.set(key, { html: row.outerHTML, originalIndex: index });
                            }
                        });
                    }

                    nextButton = findNextButton();
                    retryCount = 0; // Reset retry count on success

                } catch (error) {
                    console.error('[CTP] Error during page navigation:', error);
                    retryCount++;

                    if (retryCount >= CONFIG.MAX_RETRIES) {
                        Utils.updateProgress(State.progressIndicator, '⚠ Max retries reached, continuing...', '#ffc107');
                        await Utils.sleep(1500);
                        break;
                    }

                    await Utils.sleep(1000);
                }
            }

            // Enhanced table rebuild
            Utils.updateProgress(State.progressIndicator,
                `Rebuilding table with ${collectedRows.size} unique rows...`, '#17a2b8');

            tbody.innerHTML = '';
            const sortedRows = Array.from(collectedRows.values())
                .sort((a, b) => a.originalIndex - b.originalIndex);

            sortedRows.forEach(rowData => {
                tbody.insertAdjacentHTML('beforeend', rowData.html);
            });

            // Enhanced sorting setup
            setupEnhancedSorting(State.activeTable);

            // Success feedback
            Utils.updateProgress(State.progressIndicator,
                `✅ Success! Collected ${collectedRows.size} rows from ${pageCount} pages`, '#28a745');

            // Navigate back to page 1 with error handling
            await navigateToFirstPage();

            // Show completion alert with stats
            setTimeout(() => {
                alert(`✅ Collection Complete!\n\n` +
                      `• Pages processed: ${pageCount}\n` +
                      `• Unique rows collected: ${collectedRows.size}\n` +
                      `• Click column headers to sort (Shift+click for second value)\n` +
                      `• Returned to page 1`);
            }, 1000);

        } catch (error) {
            console.error('[CTP] Collection failed:', error);
            Utils.updateProgress(State.progressIndicator, '❌ Collection failed', '#dc3545');

            setTimeout(() => {
                alert(`Collection failed: ${error.message}\n\nPlease check the console for details.`);
            }, 1000);

        } finally {
            // Cleanup and reset state
            setTimeout(() => {
                if (State.progressIndicator) {
                    Utils.removeProgress(State.progressIndicator);
                    State.progressIndicator = null;
                }
            }, 3000);

            State.isProcessing = false;
            State.button.disabled = false;
            State.button.style.opacity = '1';
            State.button.style.cursor = 'pointer';
            State.button.innerHTML = '📊 SHOW ALL (collect pages)';
        }
    }

    /** ===============================
     * Helper Functions
     * =============================== */
    function generateRowKey(row) {
        // Create unique key based on first few cells to avoid duplicates
        return Array.from(row.cells)
            .slice(0, 3)
            .map(cell => (cell.textContent || '').trim())
            .join('|');
    }

    function findNextButton() {
        return document.querySelector("li.pagination-next.page-item:not(.disabled) a.page-link");
    }

    async function waitForTableUpdate(timeout = 5000) {
        const startTime = Date.now();
        let lastRowCount = State.activeTable?.tBodies[0]?.rows?.length || 0;

        while (Date.now() - startTime < timeout) {
            const tables = document.querySelectorAll("table");
            const targetTable = tables.length > 1 ? tables[1] : tables[0];

            if (targetTable && targetTable.tBodies[0]) {
                const currentRowCount = targetTable.tBodies[0].rows.length;
                // Wait for the table content to actually change
                if (currentRowCount > 0 && currentRowCount !== lastRowCount) {
                    State.activeTable = targetTable; // Update the active table reference
                    return targetTable;
                }
            }
            await Utils.sleep(100);
        }
        return State.activeTable; // Return current table if timeout
    }

    async function navigateToFirstPage() {
        try {
            const pageOneButton = Array.from(document.querySelectorAll("li.pagination-page.page-item a.page-link"))
                .find(link => link.textContent.trim() === "1");

            if (pageOneButton) {
                Utils.updateProgress(State.progressIndicator, 'Returning to page 1...');
                pageOneButton.click();
                await Utils.sleep(1500);
            }
        } catch (error) {
            console.warn('[CTP] Could not navigate to page 1:', error);
        }
    }

    /** ===============================
     * Enhanced Sorting System
     * =============================== */
    function setupEnhancedSorting(table) {
        // Initialize sort state with namespace
        if (!window[CONFIG.NAMESPACE_PREFIX + 'sortState']) {
            window[CONFIG.NAMESPACE_PREFIX + 'sortState'] = {
                ascending: false,
                bySecondValue: false,
                columnIndex: 4
            };
        }
        State.sortState = window[CONFIG.NAMESPACE_PREFIX + 'sortState'];

        const headers = table.querySelectorAll("th");

        headers.forEach((header, columnIndex) => {
            // Store original text only once
            if (!header._ctpOriginalText) {
                header._ctpOriginalText = header.textContent.replace(/[\u25B2\u25BC][SU]?/g, '').trim();
            }

            header.style.cursor = 'pointer';
            header.style.userSelect = 'none';
            resetHeaderStyle(header);

            // Remove existing listeners
            if (header._ctpListener) {
                header.removeEventListener('click', header._ctpListener);
            }

            // Enhanced click handler
            header._ctpListener = function(event) {
                event.preventDefault();
                event.stopPropagation();

                const oldColumnIndex = State.sortState.columnIndex;
                State.sortState.columnIndex = columnIndex;

                if (event.shiftKey) {
                    State.sortState.bySecondValue = !State.sortState.bySecondValue;
                } else {
                    if (oldColumnIndex === columnIndex) {
                        State.sortState.ascending = !State.sortState.ascending;
                    } else {
                        State.sortState.ascending = true; // Default to ascending for new column
                    }
                }

                performEnhancedSort(table);
                updateHeaderStyles(headers);
            };

            header.addEventListener('click', header._ctpListener);

            State.cleanupFunctions.push(() => {
                if (header._ctpListener) {
                    header.removeEventListener('click', header._ctpListener);
                    header._ctpListener = null;
                }
                // Clean up original text reference
                delete header._ctpOriginalText;
            });
        });

        updateHeaderStyles(headers);
    }

    function performEnhancedSort(table) {
        const tbody = table.tBodies[0];
        if (!tbody) return;

        const rows = Array.from(tbody.rows);
        const { columnIndex, ascending, bySecondValue } = State.sortState;

        rows.sort((rowA, rowB) => {
            try {
                const cellA = rowA.cells[columnIndex];
                const cellB = rowB.cells[columnIndex];

                if (!cellA || !cellB) return 0;

                const getTextContent = (cell) => (cell.textContent || cell.innerText || '').trim();
                const cleanValue = (text) => text.replace(/^[\*\$]+\s*/, '').trim();

                const textA = getTextContent(cellA);
                const textB = getTextContent(cellB);

                let valueA, valueB;

                if (textA.includes('/') && textB.includes('/')) {
                    // Handle fraction values
                    const partsA = textA.split('/');
                    const partsB = textB.split('/');

                    const indexToUse = bySecondValue ? 1 : 0;
                    valueA = parseFloat(cleanValue(partsA[indexToUse] || '0')) || 0;
                    valueB = parseFloat(cleanValue(partsB[indexToUse] || '0')) || 0;
                } else {
                    // Handle regular numeric values
                    valueA = parseFloat(cleanValue(textA)) || 0;
                    valueB = parseFloat(cleanValue(textB)) || 0;
                }

                return ascending ? valueA - valueB : valueB - valueA;

            } catch (error) {
                console.warn('[CTP] Sort comparison error:', error);
                return 0;
            }
        });

        // Rebuild table efficiently
        const fragment = document.createDocumentFragment();
        rows.forEach(row => fragment.appendChild(row));
        tbody.appendChild(fragment);
    }

    function updateHeaderStyles(headers) {
        headers.forEach((header, index) => {
            resetHeaderStyle(header);

            // Always reset to original text first
            if (header._ctpOriginalText) {
                header.textContent = header._ctpOriginalText;
            }

            if (index === State.sortState.columnIndex) {
                const arrow = State.sortState.ascending ? ' ▲' : ' ▼';
                const modifier = State.sortState.bySecondValue ? 'U' : 'S';

                header.textContent = header._ctpOriginalText + arrow + modifier;
                header.style.backgroundColor = '#ff000061';
                header.style.fontWeight = 'bold';
            }
        });
    }

    function resetHeaderStyle(header) {
        header.style.backgroundColor = '';
        header.style.fontWeight = 'normal';
    }

    /** ===============================
     * Enhanced Cleanup & Navigation
     * =============================== */
    function performCleanup() {
        console.log('[CTP] Performing cleanup...');

        if (State.button && State.button.parentNode) {
            State.button.remove();
            State.button = null;
        }

        if (State.progressIndicator) {
            Utils.removeProgress(State.progressIndicator);
            State.progressIndicator = null;
        }

        State.cleanupFunctions.forEach(cleanupFn => {
            try {
                cleanupFn();
            } catch (error) {
                console.warn('[CTP] Cleanup function error:', error);
            }
        });
        State.cleanupFunctions = [];

        State.activeTable = null;
        State.isProcessing = false;

        // Reset sort state when leaving page
        if (window[CONFIG.NAMESPACE_PREFIX + 'sortState']) {
            delete window[CONFIG.NAMESPACE_PREFIX + 'sortState'];
        }
        State.sortState = null;
    }

    /** ===============================
     * Enhanced Page Detection
     * =============================== */
    const debouncedPageCheck = Utils.debounce(() => {
        if (Utils.isTargetPage()) {
            const tables = document.querySelectorAll("table");
            if (tables.length > 1 && tables[1] && !State.button) {
                createEnhancedButton(tables[1]);
            }
        } else {
            performCleanup();
        }
    });

    /** ===============================
     * Enhanced Initialization
     * =============================== */
    function initializeEnhanced() {
        console.log('[CTP] Enhanced Table Collector v2.0.0 initializing...');

        // Create optimized mutation observer
        const observer = new MutationObserver(() => {
            if (!observer._processing) {
                observer._processing = true;
                setTimeout(() => {
                    observer._processing = false;
                    debouncedPageCheck();
                }, CONFIG.PROGRESS_UPDATE_DELAY);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false // Reduced scope for better performance
        });

        // Cleanup on page unload
        window.addEventListener('beforeunload', performCleanup);

        // Initial check
        debouncedPageCheck();

        console.log('[CTP] Enhanced initialization complete');
    }

    // Start the enhanced script
    initializeEnhanced();

})();