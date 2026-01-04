// ==UserScript==
// @name         HIS Pending Samples Tab (New UI + Old Logic)
// @namespace    http://tampermonkey.net/
// @version      7.8
// @description  Combines the new Tab UI with the reliable old barcode collection logic (Save Button Trigger)
// @author       Hamad AlShegifi & You
// @match        *://his.kaauh.org/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551325/HIS%20Pending%20Samples%20Tab%20%28New%20UI%20%2B%20Old%20Logic%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551325/HIS%20Pending%20Samples%20Tab%20%28New%20UI%20%2B%20Old%20Logic%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // PART 1: CONFIGURATION & CONSTANTS
    // ==========================================
    // --- UI CONSTANTS ---
    const NEW_TAB_NAME = "Pending Samples";
    const NEW_TAB_ID = "custom-pending-samples-tab";
    const CUSTOM_CONTENT_ID = "custom-pending-samples-content";
    const TAB_BADGE_ID = "tab-pending-count-badge";
    const BARCODE_DISPLAY_SELECTOR = '#barcode-display-box';
    const STATUS_HEADER_SELECTOR = '#test-summary-container h2';
    const NAVBAR_SELECTOR = 'ul.navbar-right';
    const GRID_CONTAINER_SELECTOR = '.ag-center-cols-container';
    const TARGET_TAB_SELECTOR = 'a[translateid="lab-orders-index.LabTestAnalyzer"]';

    // --- COLLECTION CONSTANTS (Old Logic) ---
    const TABLE_BODY_SELECTOR = 'tbody[formarrayname="TubeTypeList"], tbody[formarrayname="tubetypelist"]';

    const STORAGE_KEY = 'collectedBarcodes_storage_v2';
    const DEBOUNCE_DELAY = 100;
    const TIME_UPDATE_INTERVAL = 5000;
    const CACHE_DURATION = 1000;

    const collectedBarcodesThisSession = new Set();
    let timeSinceInterval = null;
    let sortState = { key: 'timestamp', direction: 'desc' };
    let statsBoxInjected = false;
    let mainObserver = null;
    let observerDebounceTimer = null;
    let cachedBarcodes = null;
    let cacheTimestamp = 0;

    // ==========================================
    // PART 2: INITIALIZATION
    // ==========================================
    function init() {
        if (!mainObserver) {
            initializeBarcodeLogic();
        }

        if (document.getElementById(NEW_TAB_ID)) return;

        const navList = document.querySelector('ul.nav.nav-tabs.tab-container');
        if (navList) {
            setupCustomTab(navList);
        }
    }

    function setupCustomTab(navList) {
        let originalContent = document.querySelector('.tab-content');
        if (!originalContent) originalContent = navList.nextElementSibling;
        if (!originalContent) return;

        let customContent = document.createElement('div');
        customContent.id = CUSTOM_CONTENT_ID;
        customContent.style.display = 'none';
        originalContent.parentNode.insertBefore(customContent, originalContent.nextSibling);

        const lastTab = navList.lastElementChild;
        const newLi = lastTab.cloneNode(true);
        const link = newLi.querySelector('a');
        const textSpan = newLi.querySelector('span');

        newLi.id = NEW_TAB_ID;

        if (textSpan) {
            textSpan.innerHTML = `${NEW_TAB_NAME} <span id="${TAB_BADGE_ID}" class="tab-badge" style="display:none">0</span>`;
        }

        link.href = "javascript:void(0);";
        link.classList.remove('active');
        link.removeAttribute('style');
        if(textSpan) textSpan.removeAttribute('style');

        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            navList.querySelectorAll('a').forEach(a => a.classList.remove('active'));
            link.classList.add('active');
            originalContent.style.display = 'none';
            customContent.style.display = 'block';
            updateOrInsertBarcodeTable();
        });

        navList.addEventListener('click', function(e) {
            if (!e.target.closest('#' + NEW_TAB_ID)) {
                link.classList.remove('active');
                originalContent.style.display = 'block';
                customContent.style.display = 'none';
            }
        });

        navList.appendChild(newLi);
    }

    // ==========================================
    // PART 3: BARCODE LOGIC
    // ==========================================
    function initializeBarcodeLogic() {
        mainObserver = new MutationObserver((mutations) => {
            if (observerDebounceTimer) clearTimeout(observerDebounceTimer);
            observerDebounceTimer = setTimeout(observerCallback, DEBOUNCE_DELAY);
        });

        mainObserver.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: true,
            attributeFilter: ['value']
        });

        window.addEventListener('beforeunload', cleanup);
    }

    async function observerCallback() {
        checkAndApplyPostRedirectFilter();
        injectStatsBox();
        checkForSaveButton(); // Check for the save button on every mutation cycle
        await checkAndMarkPatientBarcode();
        await collectAndSaveBarcodes();

        const stats = extractSampleCounts();
        updateStatsDisplay(stats);
    }

    // --- NEW: SAVE BUTTON HANDLER ---
    function checkForSaveButton() {
        const saveBtn = document.getElementById('savebtn-smplrecieve');
        // Check if button exists and if we haven't already attached our specific listener
        if (saveBtn && !saveBtn.dataset.tmListenerAttached) {
            // We use 'mousedown' to ensure we catch the data BEFORE the click event potentially clears the form/table
            saveBtn.addEventListener('mousedown', async () => {
                console.log("Save button detected - forcing barcode collection");
                await collectAndSaveBarcodes();
            });
            // Mark button as handled so we don't attach multiple listeners
            saveBtn.dataset.tmListenerAttached = "true";
        }
    }

    async function collectAndSaveBarcodes() {
        const selectors = TABLE_BODY_SELECTOR.split(',').map(s => `${s.trim()} tr`);
        const allBarcodeRows = document.querySelectorAll(selectors.join(', '));

        const newEntries = [];

        if (allBarcodeRows.length > 0) {
            for (const row of allBarcodeRows) {
                const barcodeInput = row.querySelector('input[formcontrolname="Barcode"]');
                const workbenchInput = row.querySelector('input[formcontrolname="TestSection"]');

                if (barcodeInput && barcodeInput.value) {
                    const barcode = barcodeInput.value.trim();
                    if(barcode.length < 3) continue;

                    const workbench = workbenchInput && workbenchInput.value ? workbenchInput.value.trim() : 'N/A';
                    newEntries.push({ barcode, workbench });
                }
            }
        }

        if (newEntries.length > 0) {
            await saveBarcodesBatch(newEntries);
        }
    }

    async function saveBarcodesBatch(entries) {
        let barcodes = await getCachedBarcodes();
        let isDirty = false;

        for (const entry of entries) {
            // Skip if added this session (prevents spamming checks)
            if (collectedBarcodesThisSession.has(entry.barcode)) continue;

            // Skip if already in persistent storage (prevents altering old data)
            if (barcodes.some(b => b.barcode === entry.barcode)) {
                collectedBarcodesThisSession.add(entry.barcode);
                continue;
            }

            // Add new entry
            barcodes.push({
                count: barcodes.length + 1,
                barcode: entry.barcode,
                workbench: entry.workbench,
                timestamp: new Date().toISOString(),
                found: false
            });
            collectedBarcodesThisSession.add(entry.barcode);
            isDirty = true;
        }

        // Only save to storage if we actually added something new
        if (isDirty) {
            await saveBarcodesCached(barcodes);
            await updateOrInsertBarcodeTable();
        }
    }

    async function checkAndMarkPatientBarcode() {
        const box = document.querySelector(BARCODE_DISPLAY_SELECTOR);
        const codeElement = box ? Array.from(box.querySelectorAll('div')).find(div => div.textContent.includes('Sample Barcode:')) : null;
        const code = codeElement ? codeElement.nextElementSibling?.textContent.trim() : null;

        if (!code) return;

        const h2 = document.querySelector(STATUS_HEADER_SELECTOR);
        if (!h2) return;

        const currentStatus = h2.textContent
            .replace(/[\r\n\t]/g, ' ')
            .replace(/\s+/g, ' ')
            .replace(/[\u200B-\u200D\uFEFF]/g, '')
            .trim()
            .toLowerCase();

        const MATCH_1 = "all clear: no pending actions";
        const MATCH_2 = "action required! : verification required";

        if (currentStatus === MATCH_1 || currentStatus === MATCH_2) {
            let barcodes = await GM_getValue(STORAGE_KEY, []);
            const entry = barcodes.find(b => b.barcode === code);

            if (entry && !entry.found) {
                entry.found = true;
                await GM_setValue(STORAGE_KEY, barcodes);
                cachedBarcodes = barcodes;
                cacheTimestamp = Date.now();

                await updateOrInsertBarcodeTable(); // Only update UI on status change
                updateStatsDisplay(extractSampleCounts());
            }
        }
    }

    async function getCachedBarcodes() {
        const now = Date.now();
        if (!cachedBarcodes || (now - cacheTimestamp) > CACHE_DURATION) {
            cachedBarcodes = await GM_getValue(STORAGE_KEY, []);
            cacheTimestamp = now;
        }
        return cachedBarcodes;
    }

    async function saveBarcodesCached(barcodes) {
        await GM_setValue(STORAGE_KEY, barcodes);
        cachedBarcodes = barcodes;
        cacheTimestamp = Date.now();
    }

    function extractSampleCounts() {
        const barcodes = cachedBarcodes || [];
        const total = barcodes.length;
        const completed = barcodes.filter(b => b.found).length;
        return { totalSamples: total, completedSamples: completed, pendingSamples: total - completed };
    }

    // --- DASHBOARD ---
    async function updateOrInsertBarcodeTable() {
        let container = document.getElementById(CUSTOM_CONTENT_ID);
        if (!container) return;
        const barcodes = await getCachedBarcodes();
        barcodes.sort((a, b) => {
             const dateA = new Date(a.timestamp);
             const dateB = new Date(b.timestamp);
             return sortState.direction === 'asc' ? dateA - dateB : dateB - dateA;
        });

        const uniqueWorkbenches = ['All', ...new Set(barcodes.map(b => b.workbench).filter(Boolean))];
        let innerWrapper = document.getElementById('bc-inner-wrapper');
        if (!innerWrapper) {
            container.innerHTML = `
                <div id="bc-inner-wrapper">
                    <div class="bc-table-header">
                        <div class="bc-header-top-row"><h2>Pending Samples</h2></div>
                        <div class="bc-table-controls">
                            <div class="bc-filter-container"><label>Filter:</label><select id="workbench-filter"></select></div>
                            <div class="bc-button-group">
                                 <button id="delete-completed-btn" class="bc-btn bc-btn-completed">Clear Done</button>
                                 <button id="clear-all-btn" class="bc-btn bc-btn-clear-all">Clear All</button>
                            </div>
                        </div>
                    </div>
                    <div class="bc-table-body">
                        <table>
                            <thead><tr><th style="width:50px;">#</th><th>Barcode</th><th>Workbench</th><th id="sort-by-time-header" class="sortable-header">Time <span id="sort-indicator"></span></th><th>Age</th><th style="width:50px;">X</th></tr></thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>`;
            innerWrapper = document.getElementById('bc-inner-wrapper');
            innerWrapper.querySelector('#clear-all-btn').onclick = async () => { if(confirm("Delete ALL?")) { await saveBarcodesCached([]); await updateOrInsertBarcodeTable(); }};
            innerWrapper.querySelector('#delete-completed-btn').onclick = deleteCompletedBarcodes;
            innerWrapper.querySelector('#workbench-filter').onchange = updateOrInsertBarcodeTable;
            innerWrapper.querySelector('#sort-by-time-header').onclick = handleSortClick;
        }

        const sortIndicator = document.getElementById('sort-indicator');
        if (sortIndicator) sortIndicator.textContent = sortState.direction === 'asc' ? '▲' : '▼';
        const filterDropdown = document.getElementById('workbench-filter');
        const currentFilter = filterDropdown.value;
        if (filterDropdown.children.length !== uniqueWorkbenches.length) {
             filterDropdown.innerHTML = uniqueWorkbenches.map(wb => `<option value="${wb}">${wb}</option>`).join('');
             if(uniqueWorkbenches.includes(currentFilter)) filterDropdown.value = currentFilter;
        }

        const selectedWorkbench = filterDropdown.value || 'All';
        const filteredBarcodes = selectedWorkbench === 'All' ? barcodes : barcodes.filter(b => b.workbench === selectedWorkbench);

        const tableBody = innerWrapper.querySelector('tbody');
        const newHtml = filteredBarcodes.length === 0 ? '<tr><td colspan="6" style="text-align:center; padding: 20px;">No samples pending.</td></tr>' :
            filteredBarcodes.map(entry => `
            <tr data-barcode-row="${entry.barcode}" class="${entry.found ? 'barcode-found' : ''}">
                <td>${entry.count}</td><td><strong>${entry.barcode}</strong></td><td>${entry.workbench}</td>
                <td>${new Date(entry.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</td>
                <td data-timestamp="${entry.timestamp}">${formatTimeSince(entry.timestamp)}</td>
                <td class="action-cell-bc"><span class="delete-barcode-btn" data-barcode="${entry.barcode}">&times;</span></td>
            </tr>`).join('');

        if (tableBody.innerHTML !== newHtml) tableBody.innerHTML = newHtml;
        tableBody.onclick = handleTableClick;

        if (timeSinceInterval) clearInterval(timeSinceInterval);
        timeSinceInterval = setInterval(() => { container.querySelectorAll('td[data-timestamp]').forEach(cell => cell.textContent = formatTimeSince(cell.dataset.timestamp)); }, TIME_UPDATE_INTERVAL);
    }

    // --- NAVIGATION LOGIC ---
    async function handleTableClick(event) {
        const row = event.target.closest('tr');
        if (!row || !row.dataset.barcodeRow) return;

        if (event.target.classList.contains('delete-barcode-btn')) {
            event.stopPropagation();
            await deleteBarcode(event.target.dataset.barcode);
            return;
        }

        const barcode = row.dataset.barcodeRow;
        const targetTab = document.querySelector(TARGET_TAB_SELECTOR);

        if (targetTab) {
            const parentLi = targetTab.closest('li');
            if(parentLi && !parentLi.classList.contains('active')) {
                 targetTab.click();
            }
            await enterBarcodeInFilter(barcode);
        } else {
             sessionStorage.setItem('barcodeToFilterAfterRedirect', barcode);
             window.location.href = 'https://his.kaauh.org/lab/#/lab-orders/lab-test-analyzer';
        }
    }

    // --- FILTER & INTERACTION ---
    async function enterBarcodeInFilter(barcode) {
        let input = null;
        let attempts = 0;
        const maxAttempts = 30;

        while(!input && attempts < maxAttempts) {
            input = findFloatingFilterInputByHeader('Barcode');
            if(!input) {
                await new Promise(r => setTimeout(r, 100));
                attempts++;
            }
        }

        if (!input) {
            console.error("Barcode filter input not found.");
            return;
        }

        // --- CLEAR OTHER FILTERS ---
        try {
            const filterRow = input.closest('.ag-header-row');
            if(filterRow) {
                const allFilters = filterRow.querySelectorAll('input.ag-floating-filter-input');
                const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                let clearedAny = false;

                for (const otherInput of allFilters) {
                    if (otherInput !== input && otherInput.value && otherInput.value.trim() !== '') {
                        nativeSetter.call(otherInput, '');
                        otherInput.dispatchEvent(new Event('input', { bubbles: true }));
                        otherInput.dispatchEvent(new Event('change', { bubbles: true }));

                        otherInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true }));
                        otherInput.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', keyCode: 13, bubbles: true }));

                        clearedAny = true;
                    }
                }
                if(clearedAny) await new Promise(r => setTimeout(r, 200));
            }
        } catch(e) {
            console.warn("Error clearing other filters:", e);
        }

        // --- ENTER NEW BARCODE ---
        try {
            input.focus();
            await new Promise(r => setTimeout(r, 50));

            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
            nativeInputValueSetter.call(input, barcode);

            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));

            await new Promise(r => setTimeout(r, 50));

            input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true }));
            input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', keyCode: 13, bubbles: true }));

            await waitForRowAndClick();

        } catch (e) {
            console.error("Error entering barcode:", e);
        }
    }

    async function waitForRowAndClick() {
        const grid = document.querySelector(GRID_CONTAINER_SELECTOR);
        if(!grid) return;

        let row = null;
        let attempts = 0;

        while(attempts < 15) {
             await new Promise(r => setTimeout(r, 200));
             row = grid.querySelector('.ag-row[row-index="0"]');

             if(row && row.offsetParent !== null) {
                 row.click();
                 break;
             }
             attempts++;
        }
    }

    function findFloatingFilterInputByHeader(headerText) {
        const headerViewport = document.querySelector('.ag-header-viewport');
        if (!headerViewport) return null;
        const cells = Array.from(headerViewport.querySelectorAll('.ag-header-row[aria-rowindex="1"] .ag-header-cell'));
        const idx = cells.findIndex(cell => cell.textContent.trim().toLowerCase() === headerText.toLowerCase());
        const row = headerViewport.querySelector('.ag-header-row[aria-rowindex="2"]');
        return row ? row.children[idx]?.querySelector('input') : null;
    }

    function handleSortClick() { sortState.direction = sortState.direction === 'desc' ? 'asc' : 'desc'; updateOrInsertBarcodeTable(); }

    async function deleteCompletedBarcodes() {
        if (confirm("Delete completed?")) {
            let barcodes = await getCachedBarcodes();
            let updated = barcodes.filter(entry => !entry.found);
            updated.forEach((e, i) => e.count = i + 1);
            await saveBarcodesCached(updated);
            await updateOrInsertBarcodeTable();
        }
    }

    async function deleteBarcode(barcode) {
        let barcodes = await getCachedBarcodes();
        let updated = barcodes.filter(entry => entry.barcode !== barcode);
        updated.forEach((e, i) => e.count = i + 1);
        await saveBarcodesCached(updated);
        await updateOrInsertBarcodeTable();
    }

    function injectStatsBox() {
        if (statsBoxInjected) return;
        const navbar = document.querySelector(NAVBAR_SELECTOR);
        if (!navbar) return;
        const statsContainer = document.createElement('li');
        statsContainer.className = 'nav-item';
        statsContainer.id = 'bc-stats-container';
        statsContainer.innerHTML = `<div class="bc-stats-box"><div class="bc-stat-item"><span>Tot:</span><span id="bc-total-count" class="bc-stat-value">0</span></div><div class="bc-stat-item"><span>Ok:</span><span id="bc-completed-count" class="bc-stat-value bc-completed">0</span></div><div class="bc-stat-item"><span>Pen:</span><span id="bc-pending-count" class="bc-stat-value bc-pending">0</span></div></div>`;
        const clock = navbar.querySelector('.clock-nav');
        navbar.insertBefore(statsContainer, clock || navbar.firstChild);
        statsBoxInjected = true;
    }

    function updateStatsDisplay(stats) {
        const t = document.getElementById('bc-total-count'); if(t) t.textContent = stats.totalSamples;
        const c = document.getElementById('bc-completed-count'); if(c) c.textContent = stats.completedSamples;
        const p = document.getElementById('bc-pending-count'); if(p) p.textContent = stats.pendingSamples;

        const tabBadge = document.getElementById(TAB_BADGE_ID);
        if (tabBadge) {
            tabBadge.textContent = stats.pendingSamples;
            tabBadge.style.display = stats.pendingSamples > 0 ? 'inline-block' : 'none';
        }
    }

    function formatTimeSince(iso) {
        const d = Math.floor((new Date() - new Date(iso)) / 60000);
        if (d < 1) return "Now";
        const h = Math.floor(d / 60);
        return h > 0 ? `${h}h ${d%60}m` : `${d}m`;
    }

    function cleanup() {
        if (timeSinceInterval) clearInterval(timeSinceInterval);
        if (mainObserver) mainObserver.disconnect();
    }

    function checkAndApplyPostRedirectFilter() {
        const code = sessionStorage.getItem('barcodeToFilterAfterRedirect');
        if (!code) return;
        sessionStorage.removeItem('barcodeToFilterAfterRedirect');
        if (window.location.href.includes('lab-test-analyzer')) setTimeout(() => enterBarcodeInFilter(code), 750);
    }

    // ==========================================
    // PART 4: STYLES (NEW UI)
    // ==========================================
    GM_addStyle(`
        :root { --bc-primary: #ef5350; --bc-secondary: #0288d1; --bc-success: #4caf50; }
        ul.nav.nav-tabs.tab-container { display: flex !important; flex-wrap: nowrap !important; width: 100% !important; gap: 5px !important; }
        ul.nav.nav-tabs.tab-container > li { flex: 1 1 0px !important; display: flex !important; min-width: 0 !important; }
        ul.nav.nav-tabs.tab-container > li > a { width: 100% !important; text-align: center !important; white-space: nowrap !important; overflow: hidden !important; text-overflow: ellipsis !important; padding: 10px 4px !important; margin: 0 !important; display: block !important; float: none !important; font-size: 12px !important; }
        ul.nav.nav-tabs.tab-container > li > a > span { display: inline !important; white-space: nowrap !important; }
        .tab-badge { background-color: var(--bc-primary); color: white; padding: 2px 6px; border-radius: 10px; font-size: 10px; font-weight: bold; margin-left: 5px; vertical-align: middle; line-height: 1; }
        #bc-stats-container { display: flex !important; align-items: center; margin-right: auto; padding: 0 10px; }
        .bc-stats-box { display: flex; gap: 10px; background: rgba(0,0,0,0.05); padding: 5px 10px; border-radius: 6px; font-size: 12px; }
        .bc-stat-value { font-weight: bold; padding: 2px 6px; border-radius: 4px; background: rgba(0,0,0,0.1); margin-left: 4px; }
        .bc-stat-value.bc-completed { background: var(--bc-success); color: #fff; }
        .bc-stat-value.bc-pending { background: var(--bc-primary); color: #fff; }
        #${CUSTOM_CONTENT_ID} { padding: 10px; background: #f4f6f9; min-height: 80vh; }
        #bc-inner-wrapper { background: white; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); width: 100%; border: 1px solid #e0e0e0; display: flex; flex-direction: column; }
        .bc-table-header { padding: 10px 15px; border-bottom: 2px solid #f0f0f0; display: flex; justify-content: space-between; align-items: center; }
        .bc-table-header h2 { margin: 0; font-size: 1.2rem; color: #333; }
        .bc-table-controls { display: flex; align-items: center; gap: 10px; }
        .bc-btn { border: none; padding: 6px 12px; border-radius: 4px; color: white; cursor: pointer; font-size: 0.85em; }
        .bc-btn-clear-all { background: var(--bc-primary); }
        .bc-btn-completed { background: var(--bc-secondary); }
        .bc-table-body { padding: 0; overflow-x: auto; }
        .bc-table-body table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .bc-table-body th { background: #f9f9f9; padding: 8px 10px; text-align: left; border-bottom: 1px solid #eee; }
        .bc-table-body td { padding: 8px 10px; border-bottom: 1px solid #eee; color: #333; }
        .bc-table-body tbody tr:hover { background: #f5f5f5; cursor: pointer; }
        .bc-table-body tbody tr.barcode-found { background: #e8f5e9; }
        .bc-table-body tbody tr.barcode-found td { color: #2e7d32; }
        .delete-barcode-btn { color: #999; font-weight: bold; font-size: 1.2em; cursor: pointer; }
        .delete-barcode-btn:hover { color: var(--bc-primary); }
        .action-cell-bc { text-align: center; }
    `);

    setInterval(init, 1000);
})();