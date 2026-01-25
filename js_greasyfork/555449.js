// ==UserScript==
// @name         KAAUH Lab - Robust Buttons & Highlighting + Barcode/MRN Dual Entry
// @namespace    Violentmonkey Scripts
// @version      3.3
// @description  Fixed barcode/MRN entry buttons to always appear reliably. Persistent filters, location badge, draggable dual-mode popup, and UI enhancements.
// @match        *://his.kaauh.org/lab/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @author       Hamad Al-Shegifi
// @downloadURL https://update.greasyfork.org/scripts/555449/KAAUH%20Lab%20-%20Robust%20Buttons%20%20Highlighting%20%2B%20BarcodeMRN%20Dual%20Entry.user.js
// @updateURL https://update.greasyfork.org/scripts/555449/KAAUH%20Lab%20-%20Robust%20Buttons%20%20Highlighting%20%2B%20BarcodeMRN%20Dual%20Entry.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  console.log('KAAUH Lab - Robust Buttons & Highlighting + Dual Entry v3.0.9 Loading...');

  //================================================================================
  // CONFIG & STATE
  //================================================================================
  const WORKBENCH_SELECTION_KEY = 'kaauh_last_workbench_selection';
  const FILTER_PERSISTENCE_KEY = 'kaauh_filter_persistence';

  const SELECTORS = {
    workbenchDropdown: '#filterSec',
    statusDropdownTrigger: 'option[translateid="lab-test-analyzer.result-status.Ordered"]',
    buttonGroupContainer: 'ul.nav.nav-tabs.tab-container',
    buttonGroup: '.filter-btn-group',
    agHeaderViewport: '.ag-header-viewport',
    agBodyViewport: '.ag-body-viewport',
    resetButton: 'button[translateid="lab-order-list.Reset"]',
    referenceLabToggle: '.nova-toggle',
  };

  let state = {
    lastUrl: location.href,
    hasAppliedInitialFilters: false,
    filterRetryCount: 0,
    maxFilterRetries: 5,
    isApplyingFilters: false,
    lastFilterApplication: 0,
    observerThrottle: null,
    selectedWorkbenchId: null,
    resetButtonRelocated: false,
    isProcessingReset: false,
    entryButtonsPlaced: false, // NEW: Track button placement state
  };

  let scrollListenerAttached = false;

  //================================================================================
  // STYLES
  //================================================================================
  GM_addStyle(`
    .filter-btn-group { display: flex !important; flex-wrap: nowrap !important; gap: 6px !important; margin-top: 12px !important; overflow-x: auto !important; padding-bottom: 6px !important; padding-inline: 10px !important; }
    .filter-btn-group::-webkit-scrollbar { height: 8px; }
    .filter-btn-group::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; }
    .filter-btn-group::-webkit-scrollbar-thumb { background: #888; border-radius: 4px; }
    .filter-btn-group::-webkit-scrollbar-thumb:hover { background: #555; }

    .filter-btn-group .btn { padding: 6px 12px !important; font-size: 13px !important; font-weight: bold !important; border-radius: 6px !important; border: none !important; color: #fff !important; white-space: nowrap !important; cursor: pointer !important; flex-shrink: 0 !important; transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease; }
    .filter-btn-group .btn:not(.selected) { opacity: 0.1 !important; }
    .filter-btn-group .btn.selected { opacity: 1 !important; box-shadow: 0 0 0 3px rgba(255,255,255,0.8), 0 0 0 5px rgba(0,123,255,0.5) !important; transform: scale(1.02) !important; z-index: 10 !important; position: relative !important; }
    .filter-btn-group .btn:hover { opacity: 1 !important; transform: scale(1.05); box-shadow: 0 4px 8px rgba(0,0,0,0.15); }

    .reset-button-container { display: flex !important; align-items: center !important; gap: 15px !important; margin-bottom: 10px !important; }
    .relocated-reset-button { order: -1 !important; margin-right: 15px !important; }

    ${Array.from({ length: 20 }, (_, i) => {
      const colors = ['#28a745','#ffc107','#17a2b8','#dc3545','#6f42c1','#fd7e14','#20c997','#6610f2','#e83e8c','#343a40','#198754','#0d6efd','#d63384','#6c757d','#ff5733','#9c27b0','#00bcd4','#795548','#3f51b5','#009688'];
      return `.btn-color-${i} { background-color: ${colors[i % colors.length]} !important; }`;
    }).join('\n')}

    .ag-row:hover .ag-cell { background-color: lightblue !important; }

    /* Popup styles */
    #barcode-popup-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); display: none; z-index: 10000; }
    .barcode-popup-box { position: absolute; background: #fff; padding: 25px; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.3); text-align: center; width: 350px; }
    .barcode-popup-title { margin: 0 0 15px 0; color: #333; cursor: move; user-select: none; }
    .barcode-popup-input { width: 100%; padding: 10px; font-size: 16px; border: 2px solid #ccc; border-radius: 4px; padding-right: 30px; }

    /* Styles for the input wrapper and clear button */
    .barcode-popup-input-wrapper { position: relative; }
    .barcode-popup-clear-btn {
        position: absolute;
        right: 6px;
        top: 50%;
        transform: translateY(-50%);
        background: #ccc;
        border: none;
        border-radius: 50%;
        width: 22px;
        height: 22px;
        font-weight: bold;
        color: white;
        cursor: pointer;
        line-height: 20px;
        text-align: center;
        font-size: 16px;
        padding: 0;
    }
    .barcode-popup-clear-btn:hover { background: #999; }

    /* Hide Info toggle */
    .gm-hide-element { display: none !important; }
    #gm-toggle-button { color: white !important; }
  `);

  //================================================================================
  // FILTER PERSISTENCE
  //================================================================================
  async function saveFilterValues(filters) {
    try { await GM_setValue(FILTER_PERSISTENCE_KEY, JSON.stringify(filters)); }
    catch (e) { console.error('Error saving filter values:', e); }
  }
  async function loadFilterValues() {
    try {
      const filtersJSON = await GM_getValue(FILTER_PERSISTENCE_KEY, null);
      return filtersJSON ? JSON.parse(filtersJSON) : {};
    } catch (e) {
      console.error('Error loading filter values:', e);
      return {};
    }
  }
  async function clearSavedFilters() {
    try { await GM_setValue(FILTER_PERSISTENCE_KEY, JSON.stringify({})); }
    catch (e) { console.error('Error clearing saved filters:', e); }
  }

  function robustClearInput(inputElement) {
    if (!inputElement || inputElement.value === '') return;
    inputElement.value = '';
    inputElement.dispatchEvent(new Event('input', { bubbles: true }));
    inputElement.dispatchEvent(new Event('change', { bubbles: true }));
    inputElement.dispatchEvent(new Event('blur', { bubbles: true }));
    let cycles = 0;
    const maxCycles = 5;
    const enforcementInterval = setInterval(() => {
      if (!document.body.contains(inputElement) || cycles >= maxCycles) {
        clearInterval(enforcementInterval);
        return;
      }
      if (inputElement.value !== '') {
        inputElement.value = '';
        inputElement.dispatchEvent(new Event('input', { bubbles: true }));
        inputElement.dispatchEvent(new Event('change', { bubbles: true }));
      }
      cycles++;
    }, 100);
  }

  async function performFullReset() {
    if (state.isProcessingReset) return;
    state.isProcessingReset = true;
    try {
      document.querySelectorAll(SELECTORS.agHeaderViewport + ' .ag-floating-filter-input').forEach(robustClearInput);
      await clearSavedFilters();
      const workbenchSelect = document.getElementById(SELECTORS.workbenchDropdown.substring(1));
      if (workbenchSelect) await setAndVerifyDropdown(workbenchSelect, workbenchSelect.options[0].value, 'Workbench');
      const statusDropdown = document.querySelector(SELECTORS.statusDropdownTrigger)?.closest('select');
      if (statusDropdown) await setAndVerifyDropdown(statusDropdown, statusDropdown.options[0].value, 'Status');
      state.selectedWorkbenchId = null;
      await GM_setValue(WORKBENCH_SELECTION_KEY, JSON.stringify({}));
      document.querySelectorAll('.filter-btn-group .btn').forEach(btn => btn.classList.remove('selected'));
    } catch (error) {
      console.error('Error during reset process:', error);
    } finally {
      setTimeout(() => { state.isProcessingReset = false; }, 1000);
    }
  }

  //================================================================================
  // DROPDOWN ENFORCER
  //================================================================================
  function setAndVerifyDropdown(dropdown, targetValue, description, duration = 1000) {
    return new Promise((resolve) => {
      if (!dropdown) { console.error(`[Enforcer] Missing dropdown: ${description}`); return resolve(false); }
      if (dropdown.value === targetValue) return resolve(true);

      dropdown.value = targetValue;
      dropdown.dispatchEvent(new Event('input', { bubbles: true }));
      dropdown.dispatchEvent(new Event('change', { bubbles: true }));

      let cycles = 0;
      const intervalDuration = 100;
      const maxCycles = duration / intervalDuration;
      const enforcementInterval = setInterval(() => {
        if (!document.body.contains(dropdown)) { clearInterval(enforcementInterval); return resolve(false); }
        if (dropdown.value !== targetValue) {
          dropdown.value = targetValue;
          dropdown.dispatchEvent(new Event('input', { bubbles: true }));
          dropdown.dispatchEvent(new Event('change', { bubbles: true }));
        }
        cycles++;
        if (cycles >= maxCycles) {
          clearInterval(enforcementInterval);
          return resolve(dropdown.value === targetValue);
        }
      }, intervalDuration);
    });
  }

  //================================================================================
  // COLUMN FILTERING & PERSISTENCE
  //================================================================================
  function setColumnFilter(columnName, value, shouldPersist = true) {
    const headerViewport = document.querySelector(SELECTORS.agHeaderViewport);
    if (!headerViewport) return false;
    const allCols = Array.from(headerViewport.querySelectorAll('.ag-header-cell')).map(cell => cell.getAttribute('col-id'));
    const columnIndex = allCols.indexOf(columnName);
    if (columnIndex === -1) return false;

    const filterInput = headerViewport.querySelector(`.ag-header-row[aria-rowindex="2"]`)?.children[columnIndex]?.querySelector('.ag-floating-filter-input');
    if (!filterInput) return false;

    if (filterInput.value === value) return true;

    filterInput.value = value;
    filterInput.dispatchEvent(new Event('input', { bubbles: true }));
    filterInput.dispatchEvent(new Event('change', { bubbles: true }));

    let enforcementCycles = 0;
    const maxCycles = 10;
    const enforcementInterval = setInterval(() => {
      if (!document.body.contains(filterInput)) { clearInterval(enforcementInterval); return; }
      if (filterInput.value !== value) {
        filterInput.value = value;
        filterInput.dispatchEvent(new Event('input', { bubbles: true }));
        filterInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
      enforcementCycles++;
      if (enforcementCycles >= maxCycles) clearInterval(enforcementInterval);
    }, 200);

    if (shouldPersist) {
      setTimeout(async () => {
        const currentFilters = await loadFilterValues();
        currentFilters[columnName] = value;
        await saveFilterValues(currentFilters);
      }, 250);
    }
    return true;
  }

  async function applySavedFilters() {
    if (state.isApplyingFilters) return true;
    const now = Date.now();
    if (now - state.lastFilterApplication < 1000) return true;
    state.isApplyingFilters = true;
    state.lastFilterApplication = now;
    try {
      const savedFilters = await loadFilterValues();
      if (Object.keys(savedFilters).length === 0) return true;
      for (const [columnName, value] of Object.entries(savedFilters)) {
        setColumnFilter(columnName, value, false);
        await new Promise(r => setTimeout(r, 250));
      }
      return true;
    } finally {
      setTimeout(() => { state.isApplyingFilters = false; }, 500);
    }
  }

  async function applyFiltersWithRetry() {
    const headerViewport = document.querySelector(SELECTORS.agHeaderViewport);
    if (!headerViewport) return;
    const success = await applySavedFilters();
    if (!success && state.filterRetryCount < state.maxFilterRetries) {
      state.filterRetryCount++;
      setTimeout(() => applyFiltersWithRetry(), 1500);
    }
  }

  //================================================================================
  // LOCATION LOGGER
  //================================================================================
  (function locationLogger() {
    function getPatientLocation() {
      let locElement = document.querySelector('div.patient-info span[title*="UNIT/"]') || document.querySelector('div.patient-info span[title]');
      if (locElement) {
        const titleAttr = locElement.getAttribute('title');
        if (titleAttr && titleAttr.trim() !== '') return titleAttr.trim().replace(/\s+/g, ' ');
        const clone = locElement.cloneNode(true);
        const h6InLoc = clone.querySelector('h6');
        if (h6InLoc) h6InLoc.remove();
        let cleanedText = clone.textContent.trim().replace(/\s+/g, ' ');
        cleanedText = cleanedText.replace(/^Bed\s*/i, '').trim();
        return cleanedText || null;
      }
      return null;
    }
    function addLocationToHeader() {
      const mrnDisplay = document.getElementById('mrn-display');
      const barcodeBox = document.getElementById('barcode-display-box');
      if (!mrnDisplay || !barcodeBox || document.getElementById('suite-location-display')) return;
      const location = getPatientLocation();
      if (location) {
        const locationDiv = document.createElement('div');
        locationDiv.id = 'suite-location-display';
        locationDiv.textContent = `${location}`;
        Object.assign(locationDiv.style, {
          fontWeight: 'bold', fontSize: '18px', color: '#ffffff', backgroundColor: '#0000ff',
          borderRadius: '4px', padding: '4px 10px', marginLeft: '12px', display: 'flex', alignItems: 'center'
        });
        mrnDisplay.after(locationDiv);
      }
    }
    const observer = new MutationObserver(() => { addLocationToHeader(); });
    observer.observe(document.body, { childList: true, subtree: true });
    addLocationToHeader();
  })();

  //================================================================================
  // HIDE INFO PANEL TOGGLE
  //================================================================================
  (function hideInfoPanel() {
    const elementToHideSelector = '.lo-view-detail-top';
    const buttonContainerSelector = '.btn-area';

    const eyeIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px;">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
      </svg>`;
    const eyeOffIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px;">
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/>
      </svg>`;

    const updateElementVisibility = (element) => {
      if (!element) return;
      const isHidden = GM_getValue('elementHidden', false);
      if (isHidden) element.classList.add('gm-hide-element'); else element.classList.remove('gm-hide-element');
    };

    const createToggleButton = (container) => {
      const toggleButton = document.createElement('button');
      toggleButton.id = 'gm-toggle-button';
      toggleButton.className = 'btn btn-color-11';
      const updateButtonState = () => {
        const isHidden = GM_getValue('elementHidden', false);
        toggleButton.innerHTML = (isHidden ? eyeOffIcon + ' Show Info' : eyeIcon + ' Hide Info');
        toggleButton.setAttribute('title', isHidden ? 'Show patient info header' : 'Hide patient info header');
      };
      toggleButton.addEventListener('click', (e) => {
        e.preventDefault();
        const isCurrentlyHidden = GM_getValue('elementHidden', false);
        GM_setValue('elementHidden', !isCurrentlyHidden);
        updateButtonState();
        const elementToHide = document.querySelector(elementToHideSelector);
        if (elementToHide) updateElementVisibility(elementToHide);
      });
      const wrapper = document.createElement('div');
      wrapper.className = 'btn-group mr-1';
      wrapper.appendChild(toggleButton);
      container.prepend(wrapper);
      updateButtonState();
    };

    const observer = new MutationObserver(() => {
      const buttonContainer = document.querySelector(buttonContainerSelector);
      if (buttonContainer && !document.getElementById('gm-toggle-button')) createToggleButton(buttonContainer);
      const targetElement = document.querySelector(elementToHideSelector);
      if (targetElement) updateElementVisibility(targetElement);
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  })();

  //================================================================================
  // CONDITIONAL CELL STYLES + SCROLL LISTENER
  //================================================================================
  function applyConditionalCellStyles() {
    const rows = document.querySelectorAll('.ag-center-cols-container .ag-row');
    for (const row of rows) {
      const clinicCell = row.querySelector('.ag-cell[col-id="clinic"]');
      const isEmergency = clinicCell && clinicCell.textContent.trim().toUpperCase() === 'EMERGENCY';
      const cellsInRow = row.querySelectorAll('.ag-cell');
      for (const cell of cellsInRow) {
        cell.style.backgroundColor = '';
        cell.style.color = '';
        cell.style.fontWeight = '';
        if (isEmergency) {
          cell.style.backgroundColor = '#ffcccb';
          cell.style.color = 'black';
        }
        const colId = cell.getAttribute('col-id');
        const text = cell.textContent.trim();
        if (colId === 'testStatus') {
          switch (text) {
            case 'Resulted': cell.style.backgroundColor = '#ffb733'; cell.style.color = 'black'; break;
            case 'Ordered': cell.style.backgroundColor = 'yellow'; cell.style.color = 'black'; break;
            case 'VerifiedLevel1':
            case 'VerifiedLevel2': cell.style.backgroundColor = 'lightgreen'; cell.style.color = 'black'; break;
          }
        } else if (colId === 'sampleStatus') {
          switch (text) {
            case 'Received': cell.style.backgroundColor = 'lightgreen'; cell.style.color = 'black'; cell.style.fontWeight = 'bold'; break;
            case 'Rejected': cell.style.backgroundColor = 'red'; cell.style.color = 'black'; cell.style.fontWeight = 'bold'; break;
            case 'Collected': cell.style.backgroundColor = 'orange'; cell.style.color = 'black'; cell.style.fontWeight = 'bold'; break;
          }
        }
      }
    }
  }

  function setupGridScrollListener() {
    if (scrollListenerAttached) return;
    const gridViewport = document.querySelector(SELECTORS.agBodyViewport);
    if (gridViewport) {
      let rafId;
      gridViewport.addEventListener('scroll', () => {
        if (rafId) window.cancelAnimationFrame(rafId);
        rafId = window.requestAnimationFrame(() => { applyConditionalCellStyles(); });
      }, { passive: true });
      scrollListenerAttached = true;
    }
  }

  //================================================================================
  // BUTTONS: WORKBENCH, STATUS, RESET
  //================================================================================
  function updateButtonSelection(selectedId) {
    state.selectedWorkbenchId = selectedId;
    document.querySelectorAll('.filter-btn-group .btn').forEach(btn => {
      btn.classList.toggle('selected', btn.dataset.workbenchId === selectedId);
    });
  }

  function insertFilterButtons() {
    if (document.querySelector(SELECTORS.buttonGroup)) return;
    const target = document.querySelector(SELECTORS.buttonGroupContainer);
    const select = document.getElementById(SELECTORS.workbenchDropdown.substring(1));
    if (!target || !select || select.options.length <= 1) return;

    const workbenches = Array.from(select.options).reduce((acc, option) => {
      const id = option.value?.trim();
      let name = option.textContent?.trim();
      if (id && name) {
        if (name.toLowerCase().includes('---select---') || ['select', 'all'].includes(name.toLowerCase())) name = 'ALL WORK BENCHES';
        acc[name] = id;
      }
      return acc;
    }, {});
    if (Object.keys(workbenches).length <= 1) return;

    const group = document.createElement('div');
    group.className = 'filter-btn-group';
    let colorIndex = 0;

    for (const [name, id] of Object.entries(workbenches)) {
      const btn = document.createElement('button');
      btn.className = `btn btn-color-${colorIndex++ % 20}`;
      btn.dataset.workbenchId = id;
      const sessionKey = `workbench_status_${id || 'all'}`;
      let currentStatus = sessionStorage.getItem(sessionKey) || 'Ordered';
      btn.textContent = `${name} (${currentStatus})`;
      if (select.value === id) { btn.classList.add('selected'); state.selectedWorkbenchId = id; }

      btn.addEventListener('click', async () => {
        currentStatus = (currentStatus === 'Ordered') ? 'Resulted' : 'Ordered';
        sessionStorage.setItem(sessionKey, currentStatus);
        btn.textContent = `${name} (${currentStatus})`;

        updateButtonSelection(id);
        GM_setValue(WORKBENCH_SELECTION_KEY, JSON.stringify({ id, status: currentStatus }));

        const workbenchSelect = document.getElementById(SELECTORS.workbenchDropdown.substring(1));
        await setAndVerifyDropdown(workbenchSelect, id, 'Workbench');

        const statusDropdown = document.querySelector(SELECTORS.statusDropdownTrigger)?.closest('select');
        if (statusDropdown) {
          const optionToSelect = Array.from(statusDropdown.options).find(opt => opt.textContent.trim() === currentStatus);
          if (optionToSelect) await setAndVerifyDropdown(statusDropdown, optionToSelect.value, 'Status');
        }
      });
      group.appendChild(btn);
    }
    target.parentNode.insertBefore(group, target.nextSibling);
    if (!state.selectedWorkbenchId && select.value) { updateButtonSelection(select.value); }
  }

  function addStatusDropdownListener() {
    const statusDropdown = document.querySelector(SELECTORS.statusDropdownTrigger)?.closest('select');
    if (!statusDropdown || statusDropdown.dataset.statusListenerAttached === 'true') return;

    statusDropdown.addEventListener('change', async (event) => {
      try {
        const selectedOption = event.target.options[event.target.selectedIndex];
        const selectedText = selectedOption.textContent.trim();
        if (selectedOption.value === '0' || selectedText.toLowerCase().includes('select')) {
          if (state.isProcessingReset) return;
          const relocatedResetButton = document.querySelector('.relocated-reset-button');
          if (relocatedResetButton) relocatedResetButton.click();
          return;
        }
        setTimeout(async () => {
          if (selectedText === 'Sample Rejected') {
            setColumnFilter('sampleStatus', 'Rejected'); setColumnFilter('testStatus', '');
          } else if (selectedText === 'Sample Refused') {
            setColumnFilter('sampleStatus', 'Refused'); setColumnFilter('testStatus', '');
          } else {
            const statusMap = { 'Verified 1': 'VerifiedLevel1', 'Verified 2': 'VerifiedLevel2', 'Cancelled': 'Cancelled' };
            const filterText = statusMap[selectedText] || selectedText;
            setColumnFilter('testStatus', filterText);
            setColumnFilter('sampleStatus', 'Received');
          }
        }, 100);
      } catch (error) { console.error('Error in status dropdown listener:', error); }
    });
    statusDropdown.dataset.statusListenerAttached = 'true';
  }

  function relocateResetButton() {
    if (state.resetButtonRelocated) return;
    const resetButton = document.querySelector(SELECTORS.resetButton);
    const referenceLabToggle = document.querySelector(SELECTORS.referenceLabToggle);
    if (!resetButton || !referenceLabToggle || resetButton.classList.contains('relocated-reset-button')) return;

    const container = document.createElement('div');
    container.className = 'reset-button-container';
    const relocatedResetButton = resetButton.cloneNode(true);
    relocatedResetButton.classList.add('relocated-reset-button');
    referenceLabToggle.parentNode.insertBefore(container, referenceLabToggle);
    container.appendChild(relocatedResetButton);
    container.appendChild(referenceLabToggle);
    resetButton.remove();

    relocatedResetButton.addEventListener('click', async (event) => {
      event.preventDefault();
      event.stopPropagation();
      await performFullReset();
    });
    state.resetButtonRelocated = true;
  }

  //================================================================================
  // DUAL-MODE BARCODE/MRN POPUP - FIXED VERSION
  //================================================================================
  (function dualEntryPopupModule() {
    const TARGET_SEARCH_PLACEHOLDER = 'Search by MRN / NationalId & IqamaId';
    const TARGET_BARCODE_COLUMN_HEADER = 'Barcode';
    const TARGET_MRN_COLUMN_HEADER = 'Cluster MRN';
    const BARCODE_POPUP_POSITION_KEY = 'kaauh_barcode_popup_position';
    const POPUP_MODE_KEY = 'kaauh_barcode_popup_mode'; // 'BARCODE' | 'MRN'

    function clearAllFiltersShallow() {
      const clearAndNotify = (inputElement) => {
        if (inputElement && inputElement.value !== '') {
          inputElement.value = '';
          inputElement.dispatchEvent(new Event('input', { bubbles: true }));
        }
      };
      const mainSearchInput = document.querySelector(`input[placeholder="${TARGET_SEARCH_PLACEHOLDER}"]`);
      clearAndNotify(mainSearchInput);
      document.querySelectorAll('input.ag-floating-filter-input').forEach(clearAndNotify);
    }

    document.addEventListener('keydown', (event) => {
      if (document.activeElement.id === 'barcode-popup-input') return;
      if (event.key === 'Delete') clearAllFiltersShallow();
    });

    function findFloatingFilterInputByHeader(headerText) {
        const headerViewport = document.querySelector(SELECTORS.agHeaderViewport);
        if (!headerViewport) return null;

        const allTitleCells = Array.from(headerViewport.querySelectorAll('.ag-header-row[aria-rowindex="1"] .ag-header-cell'));
        let targetHeaderCell = null;
        for (const cell of allTitleCells) {
            const cellTextElement = cell.querySelector('.ag-header-cell-text');
            if (cellTextElement && cellTextElement.textContent?.trim().toLowerCase() === headerText.toLowerCase()) {
                targetHeaderCell = cell;
                break;
            }
        }

        if (!targetHeaderCell) {
            console.error(`[KAAUH Script] Could not find header cell with text: "${headerText}"`);
            return null;
        }

        const colId = targetHeaderCell.getAttribute('col-id');
        const columnIndex = allTitleCells.findIndex(cell => cell.getAttribute('col-id') === colId);

        if (columnIndex === -1) {
            console.error(`[KAAUH Script] Could not determine column index for col-id: "${colId}"`);
            return null;
        }

        const filterRow = headerViewport.querySelector('.ag-header-row[aria-rowindex="2"]');
        if (!filterRow) {
            console.error(`[KAAUH Script] Could not find the filter row.`);
            return null;
        }

        const filterCell = filterRow.children[columnIndex];
        if (!filterCell) {
            console.error(`[KAAUH Script] Could not find filter cell at index: ${columnIndex}`);
            return null;
        }

        return filterCell.querySelector('input.ag-floating-filter-input');
    }

    function findBarcodeFilterInput() {
      return findFloatingFilterInputByHeader(TARGET_BARCODE_COLUMN_HEADER);
    }
    function findMrnFilterInput() {
      return findFloatingFilterInputByHeader(TARGET_MRN_COLUMN_HEADER);
    }

    async function loadPopupMode() {
      try {
        const saved = await GM_getValue(POPUP_MODE_KEY, 'BARCODE');
        return saved === 'MRN' ? 'MRN' : 'BARCODE';
      } catch { return 'BARCODE'; }
    }
    async function savePopupMode(mode) {
      try { await GM_setValue(POPUP_MODE_KEY, mode === 'MRN' ? 'MRN' : 'BARCODE'); } catch {}
    }

    async function createBarcodePopup() {
      let popupContainer = document.getElementById('barcode-popup-container');
      if (popupContainer) return popupContainer;

      const savedPositionJSON = await GM_getValue(BARCODE_POPUP_POSITION_KEY, null);
      const savedPosition = savedPositionJSON ? JSON.parse(savedPositionJSON) : null;

      popupContainer = document.createElement('div');
      popupContainer.id = 'barcode-popup-container';

      const popupBox = document.createElement('div');
      popupBox.className = 'barcode-popup-box';
      const initialStyle = {};
      if (savedPosition && savedPosition.top && savedPosition.left) {
        initialStyle.top = savedPosition.top;
        initialStyle.left = savedPosition.left;
      } else {
        initialStyle.top = '50%';
        initialStyle.left = '50%';
        initialStyle.transform = 'translate(-50%, -50%)';
      }
      Object.assign(popupBox.style, initialStyle);

      const popupTitle = document.createElement('h3');
      popupTitle.className = 'barcode-popup-title';
      popupTitle.textContent = 'Rapid Entry';

      const inputWrapper = document.createElement('div');
      inputWrapper.className = 'barcode-popup-input-wrapper';

      const popupInput = document.createElement('input');
      popupInput.id = 'barcode-popup-input';
      popupInput.type = 'text';
      popupInput.placeholder = 'Scan or type and press Enter';
      popupInput.className = 'barcode-popup-input';

      const clearInputBtn = document.createElement('button');
      clearInputBtn.type = 'button';
      clearInputBtn.className = 'barcode-popup-clear-btn';
      clearInputBtn.innerHTML = '&times;';
      clearInputBtn.title = 'Clear input';
      clearInputBtn.addEventListener('click', () => {
          popupInput.value = '';
          popupInput.focus();
      });

      inputWrapper.appendChild(popupInput);
      inputWrapper.appendChild(clearInputBtn);

      popupContainer.appendChild(popupBox);
      popupBox.appendChild(popupTitle);
      popupBox.appendChild(inputWrapper);
      document.body.appendChild(popupContainer);

      popupTitle.addEventListener('mousedown', (e) => {
        e.preventDefault();
        if (popupBox.style.transform && popupBox.style.transform !== 'none') {
          const rect = popupBox.getBoundingClientRect();
          popupBox.style.left = rect.left + 'px';
          popupBox.style.top = rect.top + 'px';
          popupBox.style.transform = 'none';
        }
        const initialLeft = popupBox.offsetLeft;
        const initialTop = popupBox.offsetTop;
        const startX = e.clientX;
        const startY = e.clientY;
        const onMouseMove = (moveEvent) => {
          const dx = moveEvent.clientX - startX;
          const dy = moveEvent.clientY - startY;
          popupBox.style.left = (initialLeft + dx) + 'px';
          popupBox.style.top = (initialTop + dy) + 'px';
        };
        const onMouseUp = async () => {
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
          const newPosition = { top: popupBox.style.top, left: popupBox.style.left };
          await GM_setValue(BARCODE_POPUP_POSITION_KEY, JSON.stringify(newPosition));
        };
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });

      popupContainer.addEventListener('click', (e) => {
        if (e.target === popupContainer) {
            popupContainer.style.display = 'none';
        }
      });

      popupInput.addEventListener('keydown', async (event) => {
        if (event.key !== 'Enter') return;
        event.preventDefault();
        const value = popupInput.value.trim();
        if (!value) return;

        clearAllFiltersShallow();

        // Load the current mode right when Enter is pressed
        const currentMode = await loadPopupMode();

        let targetInput = null;
        if (currentMode === 'MRN') {
          targetInput = findMrnFilterInput();
        } else {
          targetInput = findBarcodeFilterInput();
        }

        if (targetInput) {
          targetInput.value = value;
          targetInput.dispatchEvent(new Event('input', { bubbles: true }));
          targetInput.dispatchEvent(new Event('change', { bubbles: true }));
          popupInput.value = '';
          popupInput.focus();
        } else {
          popupInput.style.borderColor = 'red';
          setTimeout(() => popupInput.style.borderColor = '#ccc', 2000);
        }
      });

      return popupContainer;
    }

    // FIXED: Robust button placement with comprehensive checks
    async function addControls(container) {
      // Verify container is actually in the DOM
      if (!container || !document.body.contains(container)) {
        console.log('[Entry Buttons] Container not in DOM yet, waiting...');
        return false;
      }

      const popup = await createBarcodePopup();

      // Check if buttons exist AND are attached to the correct container
      const barcodeBtn = document.getElementById('barcode-entry-btn');
      const mrnBtn = document.getElementById('mrn-entry-btn');

      const barcodeBtnInContainer = barcodeBtn && container.contains(barcodeBtn);
      const mrnBtnInContainer = mrnBtn && container.contains(mrnBtn);

      // If both buttons exist and are in the container, we're done
      if (barcodeBtnInContainer && mrnBtnInContainer) {
        console.log('[Entry Buttons] Buttons already placed correctly');
        return true;
      }

      // Remove orphaned buttons if they exist elsewhere
      if (barcodeBtn && !barcodeBtnInContainer) {
        console.log('[Entry Buttons] Removing orphaned Barcode button');
        barcodeBtn.remove();
      }
      if (mrnBtn && !mrnBtnInContainer) {
        console.log('[Entry Buttons] Removing orphaned MRN button');
        mrnBtn.remove();
      }

      // Create Barcode Entry button
      if (!barcodeBtnInContainer) {
          const barcodeButton = document.createElement('button');
          barcodeButton.id = 'barcode-entry-btn';
          barcodeButton.textContent = 'Barcode Entry';
          Object.assign(barcodeButton.style, {
              backgroundColor: '#11800b',
              transition: 'background-color 0.3s', padding: '6px 12px',
              fontSize: '13px', fontWeight: 'bold', borderRadius: '6px', color: '#ffffff',
              border: '1px solid #285e79', cursor: 'pointer', marginLeft: '8px'
          });
          barcodeButton.addEventListener('click', async () => {
              await savePopupMode('BARCODE');
              await performFullReset();
              popup.style.display = 'block';
              document.getElementById('barcode-popup-input').focus();
          });
          container.appendChild(barcodeButton);
          console.log('[Entry Buttons] Barcode button created and attached');
      }

      // Create MRN Entry button
      if (!mrnBtnInContainer) {
          const mrnButton = document.createElement('button');
          mrnButton.id = 'mrn-entry-btn';
          mrnButton.textContent = 'MRN Entry';
          Object.assign(mrnButton.style, {
              backgroundColor: '#d19a02',
              transition: 'background-color 0.3s', padding: '6px 12px',
              fontSize: '13px', fontWeight: 'bold', borderRadius: '6px', color: '#ffffff',
              border: '1px solid #4a2d8a', cursor: 'pointer', marginLeft: '8px'
          });
          mrnButton.addEventListener('click', async () => {
              await savePopupMode('MRN');
              await performFullReset();
              popup.style.display = 'block';
              document.getElementById('barcode-popup-input').focus();
          });
          container.appendChild(mrnButton);
          console.log('[Entry Buttons] MRN button created and attached');
      }

      return true;
    }

    // FIXED: Enhanced button placement logic with proper state tracking
    async function placeButton() {
      const buttonContainer = document.querySelector('.reset-button-container');

      // If container doesn't exist yet, try again
      if (!buttonContainer) {
        state.entryButtonsPlaced = false;
        return;
      }

      // Attempt to place buttons
      const success = await addControls(buttonContainer);

      if (success) {
        state.entryButtonsPlaced = true;
        console.log('[Entry Buttons] Successfully placed and verified');
      } else {
        state.entryButtonsPlaced = false;
      }
    }

    // FIXED: Dedicated MutationObserver for button placement
    const buttonObserver = new MutationObserver(async (mutations) => {
      // Only run if we're on the correct page
      if (!location.href.includes('/lab-orders/lab-test-analyzer')) return;

      // Check if buttons need to be placed
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          const hasResetContainer = document.querySelector('.reset-button-container');

          // If container exists but buttons aren't placed, place them
          if (hasResetContainer && !state.entryButtonsPlaced) {
            await placeButton();
            break;
          }
        }
      }
    });

    // Start observing
    buttonObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    // FIXED: Backup polling mechanism with proper throttling
    let pollAttempts = 0;
    const maxPollAttempts = 50; // 50 attempts = 50 seconds max

    const pollInterval = setInterval(async () => {
      pollAttempts++;

      // Stop polling if buttons are placed or max attempts reached
      if (state.entryButtonsPlaced || pollAttempts >= maxPollAttempts) {
        clearInterval(pollInterval);
        if (state.entryButtonsPlaced) {
          console.log('[Entry Buttons] Polling stopped - buttons placed successfully');
        } else {
          console.warn('[Entry Buttons] Polling stopped - max attempts reached');
        }
        return;
      }

      // Only attempt placement on the correct page
      if (!location.href.includes('/lab-orders/lab-test-analyzer')) {
        return;
      }

      // Check if container exists and buttons aren't placed
      const container = document.querySelector('.reset-button-container');
      if (container && !state.entryButtonsPlaced) {
        await placeButton();
      }
    }, 1000); // Check every second

    // Initial placement attempt
    setTimeout(placeButton, 500);
  })();

  //================================================================================
  // NAV SHORTCUT + MASTER OBSERVER
  //================================================================================
  function setupNavigationShortcut() {
    const labOrdersLink = document.querySelector('span.csi-menu-text[title="Lab Orders"]')?.closest('a');
    if (!labOrdersLink || labOrdersLink.dataset.shortcutAttached === 'true') return;
    labOrdersLink.addEventListener('click', () => {
      setTimeout(() => {
        const labTestStatusTab = document.querySelector('a[href="#/lab-orders/lab-test-analyzer"]');
        if (labTestStatusTab) labTestStatusTab.click();
      }, 100);
    });
    labOrdersLink.dataset.shortcutAttached = 'true';
  }

  async function applyPersistentWorkbenchFilter() {
    const workbenchSelect = document.getElementById(SELECTORS.workbenchDropdown.substring(1));
    const statusDropdown = document.querySelector(SELECTORS.statusDropdownTrigger)?.closest('select');
    if (!workbenchSelect || !statusDropdown) return;
    try {
      const savedWorkbenchJSON = await GM_getValue(WORKBENCH_SELECTION_KEY, null);
      if (savedWorkbenchJSON) {
        const savedWorkbench = JSON.parse(savedWorkbenchJSON);
        if (savedWorkbench?.id && savedWorkbench?.status) {
          const workbenchSuccess = await setAndVerifyDropdown(workbenchSelect, savedWorkbench.id, 'Workbench');
          const optionToSelect = Array.from(statusDropdown.options).find(opt => opt.textContent.trim() === savedWorkbench.status);
          let statusSuccess = false;
          if (optionToSelect) statusSuccess = await setAndVerifyDropdown(statusDropdown, optionToSelect.value, 'Status');
          if (workbenchSuccess && statusSuccess) updateButtonSelection(savedWorkbench.id);
        }
      }
    } catch (e) { console.error('Error applying persistent workbench filter:', e); }
  }

  async function masterObserverCallback() {
    if (state.observerThrottle) clearTimeout(state.observerThrottle);
    state.observerThrottle = setTimeout(async () => {
      if (location.href !== state.lastUrl) {
        state.lastUrl = location.href;
        Object.assign(state, {
          hasAppliedInitialFilters: false, filterRetryCount: 0, isApplyingFilters: false,
          selectedWorkbenchId: null, resetButtonRelocated: false, isProcessingReset: false,
          entryButtonsPlaced: false // Reset button placement state on URL change
        });
        scrollListenerAttached = false;
      }
      setupNavigationShortcut();
      if (!location.href.includes('/lab-orders/lab-test-analyzer')) return;

      relocateResetButton();
      insertFilterButtons();
      addStatusDropdownListener();
      setupGridScrollListener();

      if (!state.hasAppliedInitialFilters) {
        await applyPersistentWorkbenchFilter();
        await applyFiltersWithRetry();
        state.hasAppliedInitialFilters = true;
      }
      applyConditionalCellStyles();
    }, 100);
  }

  const observer = new MutationObserver(masterObserverCallback);
  observer.observe(document.body, { childList: true, subtree: true });
  masterObserverCallback();
})();