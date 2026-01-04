// ==UserScript==
// @name         Pending barcodes
// @namespace    http://tampermonkey.net/
// @version      2.2.0
// @description  Collects barcodes and their workbenches, provides a sortable/filterable interface, and clicks the filtered result.
// @author       Hamad AlShegifi
// @match        *://his.kaauh.org/lab/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555457/Pending%20barcodes.user.js
// @updateURL https://update.greasyfork.org/scripts/555457/Pending%20barcodes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        #barcode-inpage-container {
            width: 30vw !important;
            float: left !important;
        }
        .ag-root-wrapper-body {
            width: 70vw !important;
            margin-left: auto !important;
            margin-right: 0 !important;
        }
    `);

})();

(function() {
    'use strict';

    // --- Configuration ---
    const TABLE_BODY_SELECTOR = 'tbody[formarrayname="TubeTypeList"]';
    const BARCODE_DISPLAY_SELECTOR = '#barcode-display-box';
    const STORAGE_KEY = 'collectedBarcodes_storage_v2';
    const IN_PAGE_TABLE_ID = 'barcode-inpage-container';
    const INJECTION_POINT_SELECTOR = '.row.labordertab';
    const GRID_CONTAINER_SELECTOR = '.ag-center-cols-container';

    // --- State Flags & Cache ---
    const collectedBarcodesThisSession = new Set();
    let lastCheckedPatientBarcode = null;
    let timeSinceInterval = null;
    let observerDebounceTimer = null;
    let isTableUpdating = false;
    // *** NEW: State for sorting, default to newest first
    let sortState = { key: 'timestamp', direction: 'desc' };


    // --- Main Logic ---
    function initialize() {
        console.log("Barcode Collector: Script started. Observing for page changes...");
        const observer = new MutationObserver((mutations, obs) => {
            if (observerDebounceTimer) clearTimeout(observerDebounceTimer);
            observerDebounceTimer = setTimeout(() => {
                const injectionPoint = document.querySelector(INJECTION_POINT_SELECTOR);
                if (injectionPoint) {
                    updateOrInsertBarcodeTable();
                } else {
                    const existingTable = document.getElementById(IN_PAGE_TABLE_ID);
                    if (existingTable) {
                        if (timeSinceInterval) clearInterval(timeSinceInterval);
                        existingTable.remove();
                    }
                }

                const patientBarcodeBox = document.querySelector(BARCODE_DISPLAY_SELECTOR);
                const barcodeOnPage = patientBarcodeBox ? Array.from(patientBarcodeBox.querySelectorAll('div')).find(div => div.textContent.includes('Sample Barcode:'))?.nextElementSibling?.textContent.trim() : null;

                if (barcodeOnPage) {
                    if (barcodeOnPage !== lastCheckedPatientBarcode) {
                        console.log(`Barcode Collector: Detected patient barcode on page: ${barcodeOnPage}`);
                        lastCheckedPatientBarcode = barcodeOnPage;
                        markBarcodeAsFoundAndUpdateStorage(barcodeOnPage);
                    }
                } else {
                    if (lastCheckedPatientBarcode !== null) {
                        lastCheckedPatientBarcode = null;
                    }
                }

                const allBarcodeRows = document.querySelectorAll(`${TABLE_BODY_SELECTOR} tr`);
                if (allBarcodeRows.length > 0) {
                    (async () => {
                        for (const row of allBarcodeRows) {
                            const barcodeInput = row.querySelector('input[formcontrolname="Barcode"]');
                            const workbenchInput = row.querySelector('input[formcontrolname="TestSection"]');

                            if (barcodeInput && barcodeInput.value) {
                                const barcode = barcodeInput.value.trim();
                                const workbench = workbenchInput && workbenchInput.value ? workbenchInput.value.trim() : 'N/A';
                                await saveBarcode(barcode, workbench);
                            }
                        }
                    })();
                }
            }, 250);
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    async function saveBarcode(barcode, workbench) {
        if (collectedBarcodesThisSession.has(barcode)) return;
        let barcodes = await GM_getValue(STORAGE_KEY, []);
        if (barcodes.some(entry => entry.barcode === barcode)) {
            collectedBarcodesThisSession.add(barcode);
            return;
        }
        const newEntry = {
            count: barcodes.length + 1,
            barcode: barcode,
            workbench: workbench,
            timestamp: new Date().toISOString(),
            found: false
        };
        barcodes.push(newEntry);
        await GM_setValue(STORAGE_KEY, barcodes);
        collectedBarcodesThisSession.add(barcode);
        console.log(`Barcode Collector: Saved new barcode - ${barcode} with workbench - ${workbench}`);
        updateOrInsertBarcodeTable();
    }

    function formatTimeSince(isoTimestamp) {
        const date = new Date(isoTimestamp);
        const now = new Date();
        const totalMinutes = Math.floor((now - date) / (1000 * 60));
        if (totalMinutes < 1) return "00:00 ago";
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ago`;
    }

    async function markBarcodeAsFoundAndUpdateStorage(barcodeToMark) {
        let barcodes = await GM_getValue(STORAGE_KEY, []);
        const entry = barcodes.find(b => b.barcode === barcodeToMark);
        if (entry && !entry.found) {
            entry.found = true;
            await GM_setValue(STORAGE_KEY, barcodes);
            console.log(`Barcode Collector: Marked barcode ${barcodeToMark} as found and saved status.`);
        }
        updateViewWithHighlight(barcodeToMark);
    }

    function updateViewWithHighlight(barcode) {
        const table = document.getElementById(IN_PAGE_TABLE_ID);
        if (!table) return;
        const row = table.querySelector(`tr[data-barcode-row="${barcode}"]`);
        if (row) {
            row.classList.add('barcode-found');
        }
    }

    function findFloatingFilterInputByHeader(headerText) {
        const headerViewport = document.querySelector('.ag-header-viewport');
        if (!headerViewport) return null;
        const allTitleCells = Array.from(headerViewport.querySelectorAll('.ag-header-row[aria-rowindex="1"] .ag-header-cell'));
        if (allTitleCells.length === 0) return null;
        let targetColumnIndex = -1;
        allTitleCells.forEach((cell, index) => {
            const cellTextElement = cell.querySelector('.ag-header-cell-text');
            if (cellTextElement && cellTextElement.textContent.trim().toLowerCase() === headerText.toLowerCase()) {
                targetColumnIndex = index;
            }
        });
        if (targetColumnIndex === -1) return null;
        const filterRow = headerViewport.querySelector('.ag-header-row[aria-rowindex="2"]');
        if (!filterRow) return null;
        const filterCell = filterRow.children[targetColumnIndex];
        if (!filterCell) return null;
        return filterCell.querySelector('input.ag-floating-filter-input');
    }

    function waitForGridUpdateAndClick() {
        return new Promise((resolve, reject) => {
            const gridContainer = document.querySelector(GRID_CONTAINER_SELECTOR);
            if (!gridContainer) return reject("AG-Grid container not found.");
            const timeout = setTimeout(() => { observer.disconnect(); reject("Timeout: AG-Grid did not update."); }, 2000);
            const observer = new MutationObserver((mutations, obs) => {
                const firstRow = gridContainer.querySelector('.ag-row[row-index="0"]');
                if (firstRow) {
                    firstRow.click();
                    clearTimeout(timeout);
                    obs.disconnect();
                    resolve();
                }
            });
            observer.observe(gridContainer, { childList: true, subtree: true });
        });
    }

    function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

    async function enterBarcodeInFilter(barcode) {
        const targetInput = findFloatingFilterInputByHeader('Barcode');
        if (!targetInput) { console.error('Barcode Collector: Could not find "Barcode" filter input.'); return; }
        try {
            console.log(`Barcode Collector: Filtering for barcode "${barcode}"...`);
            targetInput.focus(); await sleep(50);
            targetInput.value = barcode;
            targetInput.dispatchEvent(new Event('input', { bubbles: true, cancelable: true })); await sleep(100);
            targetInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true }));
            targetInput.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true }));
            console.log("Barcode Collector: Waiting for AG-Grid to update...");
            await waitForGridUpdateAndClick();
            console.log("Barcode Collector: Clicked the first grid row.");
        } catch (error) { console.error("Barcode Collector: Error while filtering/clicking.", error); }
        finally { if (targetInput) targetInput.blur(); }
    }

    // *** NEW: Handles click on the sortable table header
    function handleSortClick() {
        sortState.direction = sortState.direction === 'desc' ? 'asc' : 'desc';
        console.log(`Barcode Collector: Sorting by timestamp ${sortState.direction}`);
        updateOrInsertBarcodeTable();
    }

    async function updateOrInsertBarcodeTable() {
        if (isTableUpdating) return;
        isTableUpdating = true;
        try {
            const injectionPoint = document.querySelector(INJECTION_POINT_SELECTOR);
            if (!injectionPoint) { isTableUpdating = false; return; }

            let container = document.getElementById(IN_PAGE_TABLE_ID);
            const barcodes = await GM_getValue(STORAGE_KEY, []);

            // *** NEW: Apply sorting based on the current sortState
            if (sortState.key === 'timestamp') {
                barcodes.sort((a, b) => {
                    const dateA = new Date(a.timestamp);
                    const dateB = new Date(b.timestamp);
                    return sortState.direction === 'asc' ? dateA - dateB : dateB - dateA;
                });
            }

            const uniqueWorkbenches = ['All', ...new Set(barcodes.map(b => b.workbench).filter(Boolean))];

            if (!container) {
                container = document.createElement('div');
                container.id = IN_PAGE_TABLE_ID;
                injectionPoint.parentNode.insertBefore(container, injectionPoint.nextSibling);

                container.innerHTML = `
                    <div class="bc-table-header">
                        <h2>Pending</h2>
                        <div class="bc-filter-container"><label for="workbench-filter">Workbench:</label><select id="workbench-filter"></select></div>
                        <div class="bc-button-group">
                             <button id="delete-completed-btn" class="bc-btn bc-btn-completed">Clear Completed</button>
                             <button id="clear-all-btn" class="bc-btn bc-btn-clear-all">Clear All</button>
                        </div>
                    </div>
                    <div class="bc-table-body">
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th><th>Barcode</th><th>Workbench</th>
                                    <th id="sort-by-time-header" class="sortable-header">Added <span id="sort-indicator"></span></th>
                                    <th>Pending</th><th>Actions</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>`;

                container.querySelector('#clear-all-btn').addEventListener('click', async () => {
                    if (confirm("Are you sure you want to delete ALL pending barcodes? This cannot be undone.")) {
                        await GM_setValue(STORAGE_KEY, []);
                        await updateOrInsertBarcodeTable();
                    }
                });
                container.querySelector('#delete-completed-btn').addEventListener('click', deleteCompletedBarcodes);
                container.querySelector('#workbench-filter').addEventListener('change', updateOrInsertBarcodeTable);
                // *** NEW: Add event listener for the sortable header
                container.querySelector('#sort-by-time-header').addEventListener('click', handleSortClick);
            }

            // *** NEW: Update the sort indicator in the UI
            const sortIndicator = container.querySelector('#sort-indicator');
            if (sortIndicator) {
                sortIndicator.textContent = sortState.direction === 'asc' ? '▲' : '▼';
            }

            const filterDropdown = container.querySelector('#workbench-filter');
            const currentFilterValue = filterDropdown.value;
            filterDropdown.innerHTML = uniqueWorkbenches.map(wb => `<option value="${wb}">${wb}</option>`).join('');
            if (uniqueWorkbenches.includes(currentFilterValue)) filterDropdown.value = currentFilterValue;

            const selectedWorkbench = filterDropdown.value;
            const filteredBarcodes = selectedWorkbench === 'All' ? barcodes : barcodes.filter(b => b.workbench === selectedWorkbench);

            let tableRows = filteredBarcodes.map(entry => `
                <tr data-barcode-row="${entry.barcode}" class="${entry.found ? 'barcode-found' : ''}">
                    <td>${entry.count}</td><td>${entry.barcode}</td><td>${entry.workbench || 'N/A'}</td>
                    <td>${new Date(entry.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</td>
                    <td data-timestamp="${entry.timestamp}">${formatTimeSince(entry.timestamp)}</td>
                    <td class="action-cell-bc"><span class="delete-barcode-btn" data-barcode="${entry.barcode}" title="Delete">&times;</span></td>
                </tr>
            `).join('');

            if (filteredBarcodes.length === 0) {
                tableRows = '<tr><td colspan="6">No pending barcodes match the filter.</td></tr>';
            }

            const tableBody = container.querySelector('tbody');
            if (tableBody.innerHTML !== tableRows) tableBody.innerHTML = tableRows;

            tableBody.removeEventListener('click', handleTableClick);
            tableBody.addEventListener('click', handleTableClick);

            if (timeSinceInterval) clearInterval(timeSinceInterval);
            timeSinceInterval = setInterval(() => {
                container.querySelectorAll('td[data-timestamp]').forEach(cell => {
                    cell.textContent = formatTimeSince(cell.dataset.timestamp);
                });
            }, 5000);
        } finally {
            isTableUpdating = false;
        }
    }

    async function handleTableClick(event) {
        const row = event.target.closest('tr');
        if (!row || !row.dataset.barcodeRow) return;
        if (event.target.classList.contains('delete-barcode-btn')) {
            await deleteBarcode(event.target.dataset.barcode);
        } else {
            await enterBarcodeInFilter(row.dataset.barcodeRow);
        }
    }

    async function deleteCompletedBarcodes() {
        if (confirm("Are you sure you want to delete all completed (green) barcodes?")) {
            console.log("Barcode Collector: Deleting completed barcodes.");
            let barcodes = await GM_getValue(STORAGE_KEY, []);
            let updatedBarcodes = barcodes.filter(entry => !entry.found);
            updatedBarcodes.forEach((entry, index) => { entry.count = index + 1; });
            await GM_setValue(STORAGE_KEY, updatedBarcodes);
            await updateOrInsertBarcodeTable();
        }
    }

    async function deleteBarcode(barcodeToDelete) {
        let barcodes = await GM_getValue(STORAGE_KEY, []);
        let updatedBarcodes = barcodes.filter(entry => entry.barcode !== barcodeToDelete);
        updatedBarcodes.forEach((entry, index) => { entry.count = index + 1; });
        await GM_setValue(STORAGE_KEY, updatedBarcodes);
        console.log(`Barcode Collector: Deleted barcode - ${barcodeToDelete}`);
        await updateOrInsertBarcodeTable();
    }

    GM_addStyle(`
        #${IN_PAGE_TABLE_ID} {
            margin: 15px 0; border: 1px solid #ccc; border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1); font-family: Arial, sans-serif;
            background-color: #fff; display: flex; flex-direction: column; height: 90vh;
        }
        .bc-table-header {
            padding: 10px 16px; background-color: #f7f7f7; border-bottom: 1px solid #ccc;
            border-top-left-radius: 8px; border-top-right-radius: 8px;
            display: flex; justify-content: space-between; align-items: center; gap: 16px;
        }
        .bc-table-header h2 { margin: 0; font-size: 1.1em; color: #333; flex-shrink: 0; }
        .bc-filter-container { display: flex; align-items: center; gap: 8px; margin-left: auto; }
        .bc-filter-container label { font-weight: bold; font-size: 0.9em; }
        #workbench-filter { padding: 4px; border-radius: 4px; border: 1px solid #ccc; }
        .bc-button-group { display: flex; gap: 8px; flex-shrink: 0; }
        .bc-btn {
            border: none; padding: 6px 12px; border-radius: 5px; cursor: pointer;
            font-weight: bold; font-size: 0.9em; color: white; transition: background-color 0.2s;
        }
        .bc-btn:hover { opacity: 0.9; }
        .bc-btn-clear-all { background-color: #ef5350; }
        .bc-btn-clear-all:hover { background-color: #d32f2f; }
        .bc-btn-completed { background-color: #0288d1; }
        .bc-btn-completed:hover { background-color: #0277bd; }
        .bc-table-body {
            padding: 8px; overflow-y: auto; flex-grow: 1; min-height: 0;
        }
        .bc-table-body table { width: 100%; border-collapse: collapse; }
        .bc-table-body th, .bc-table-body td {
            border: 1px solid #ddd; padding: 4px 8px; text-align: left; font-size: 0.9em;
        }
        .bc-table-body th { background-color: #f2f2f2; }
        .bc-table-body .sortable-header { cursor: pointer; }
        .bc-table-body .sortable-header:hover { background-color: #e0e0e0; }
        #sort-indicator { font-size: 0.8em; margin-left: 4px; }
        .bc-table-body tbody tr { cursor: pointer; }
        .bc-table-body tbody tr:hover { background-color: #e8eaf6; }
        .bc-table-body tbody tr.barcode-found { background-color: #a5d6a7 !important; color: #1b5e20; }
        .bc-table-body tbody tr.barcode-found:hover { background-color: #81c784 !important; }
        .action-cell-bc { text-align: center !important; }
        .delete-barcode-btn {
            cursor: pointer; font-weight: bold; font-size: 18px; color: #ef5350;
            padding: 0 4px; border-radius: 4px;
        }
        .delete-barcode-btn:hover { color: white; background-color: #d32f2f; }
    `);

    initialize();
})();