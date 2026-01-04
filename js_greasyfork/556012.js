// ==UserScript==
// @name         enhanced artikel-log
// @namespace    https://greasyfork.org/de/users/1516523-martink
// @version      1.0.2
// @description  Parsed und visualisiert Log-Tabellen mit Diff-Ansicht, Highlighting und Filter-Dropdowns für Wer und Aktion
// @author       Martin Kaiser
// @match        *://opus.geizhals.at/kalif/artikel?id=*
// @noframes
// @run-at       document-idle
// @grant        none
// @license      MIT
// @icon         https://666kb.com/i/fxfm86s1jawf7ztn7.jpg
// @downloadURL https://update.greasyfork.org/scripts/556012/enhanced%20artikel-log.user.js
// @updateURL https://update.greasyfork.org/scripts/556012/enhanced%20artikel-log.meta.js
// ==/UserScript==

(function() {
'use strict';

// Nicht in iframes ausführen - verhindert mehrfache Skript-Instanzen
try {
    if (window.self !== window.top) return;
} catch (e) {
    // Cross-origin iframe - auch nicht ausführen
    return;
}

// Zusätzliche Prüfung: Nur auf der erwarteten Seite ausführen
if (!window.location.pathname.startsWith('/kalif/artikel')) return;

// Verhindere mehrfache Initialisierung im selben Fenster
if (window.__enhancedArtikelLogInitialized) return;
window.__enhancedArtikelLogInitialized = true;

// Global toggle state for diff view
let diffViewEnabled = true;
let highlightingEnabled = true;
let highlightingEnabledCache = true;
let toggleCreated = false;

// LocalStorage Keys
const STORAGE_KEY_DIFF = 'adminlog_diffViewEnabled';
const STORAGE_KEY_HIGHLIGHTING = 'adminlog_highlightingEnabled';

function loadSettings() {
  const diffSetting = localStorage.getItem(STORAGE_KEY_DIFF);
  const highlightSetting = localStorage.getItem(STORAGE_KEY_HIGHLIGHTING);

  if (diffSetting !== null) diffViewEnabled = diffSetting === 'true';
  if (highlightSetting !== null) {
    highlightingEnabled = highlightSetting === 'true';
    highlightingEnabledCache = highlightingEnabled;
  }
}

function saveSettings() {
  localStorage.setItem(STORAGE_KEY_DIFF, diffViewEnabled);
  localStorage.setItem(STORAGE_KEY_HIGHLIGHTING, highlightingEnabledCache);
}

// Einstellungen beim Start laden
loadSettings();

function isLogMode() {
  return window.location.search.includes('mode=log');
}

function createDiffViewToggle() {
  if (!isLogMode()) {
    return false;
  }

  if (toggleCreated) {
    return false;
  }


  const heading = document.querySelector('h5.pt-1.mb-0');
  if (!heading) {
    return false;
  }

  // Add CSS for the toggle slider and checkbox
  if (!document.querySelector('style[data-toggle-style]')) {
    const style = document.createElement('style');
    style.setAttribute('data-toggle-style', 'true');
    style.textContent = `
      input[type="checkbox"][data-diff-toggle] {
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        width: 50px;
        height: 26px;
        background-color: #ccc;
        border-radius: 20px;
        border: none;
        cursor: pointer;
        position: relative;
        transition: background-color 0.3s ease;
        outline: none;
        padding: 0;
      }

      input[type="checkbox"][data-diff-toggle]:checked {
        background-color: #28a745;
      }

      input[type="checkbox"][data-diff-toggle]::after {
        content: '';
        position: absolute;
        width: 22px;
        height: 22px;
        background-color: white;
        border-radius: 50%;
        top: 2px;
        left: 2px;
        transition: left 0.3s ease;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      }

      input[type="checkbox"][data-diff-toggle]:checked::after {
        left: 26px;
      }

      input[type="checkbox"][data-highlighting-toggle] {
        cursor: pointer;
        width: 16px;
        height: 16px;
        margin: 0;
      }

      input[type="checkbox"][data-highlighting-toggle]:disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }

      .adminlog__inner-table {
        background-color: #FFFFFF !important;
      }

      .adminlog__inner-table td {
        background-color: #FFFFFF !important;
      }

      .adminlog__inner-table tr:nth-child(even) {
        background-color: #fafafa !important;
      }

      .adminlog__inner-table span[style*="background-color"] {
        background-color: inherit !important;
      }

      body.adminlog__white-bg {
        background-color: #FFFFFF !important;
      }
    `;
    document.head.appendChild(style);
  }

  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.gap = '20px';
  container.style.marginLeft = '15px';

  // Diff-Ansicht Toggle
  const label1 = document.createElement('label');
  label1.textContent = 'Diff-Ansicht';
  label1.style.fontSize = '0.9em';
  label1.style.fontWeight = 'normal';
  label1.style.margin = '0';
  label1.style.cursor = 'pointer';
  label1.style.display = 'flex';
  label1.style.alignItems = 'center';
  label1.style.gap = '8px';

  const toggleSwitch = document.createElement('input');
  toggleSwitch.type = 'checkbox';
  toggleSwitch.checked = diffViewEnabled;
  toggleSwitch.setAttribute('data-diff-toggle', 'true');

  toggleSwitch.addEventListener('change', function() {
    diffViewEnabled = this.checked;
    highlightingCheckbox.disabled = !diffViewEnabled;

    if (!diffViewEnabled) {
      // Speichere Zustand bevor deaktiviert wird
      highlightingEnabledCache = highlightingEnabled;

      highlightingCheckbox.checked = false;
      highlightingEnabled = false;
    } else {
      // Stelle Zustand wieder her
      highlightingEnabled = highlightingEnabledCache;

      highlightingCheckbox.checked = highlightingEnabled;
    }

    // Re-process all rows
    processLogTable();
    saveSettings();
  });

  label1.appendChild(toggleSwitch);
  container.appendChild(label1);

  // Highlighting Checkbox
  const label2 = document.createElement('label');
  label2.textContent = 'Highlighting';
  label2.style.fontSize = '0.9em';
  label2.fontWeight = 'normal';
  label2.style.margin = '0';
  label2.style.cursor = 'pointer';
  label2.style.display = 'flex';
  label2.style.alignItems = 'center';
  label2.style.gap = '6px';

  const highlightingCheckbox = document.createElement('input');
  highlightingCheckbox.type = 'checkbox';
  highlightingCheckbox.checked = highlightingEnabled;
  highlightingCheckbox.disabled = !diffViewEnabled;
  highlightingCheckbox.setAttribute('data-highlighting-toggle', 'true');

  highlightingCheckbox.addEventListener('change', function() {
    highlightingEnabled = this.checked;
    highlightingEnabledCache = this.checked;

    // Re-process all rows
    processLogTable();
    saveSettings();
  });

  label2.appendChild(highlightingCheckbox);
  container.appendChild(label2);

  heading.parentNode.insertBefore(container, heading.nextSibling);

  toggleCreated = true;
  return true;
}

function processLogTable() {

  if (!isLogMode()) {
    return false;
  }

  // Debug: Check for various table selectors
  const tbody = document.querySelector('tbody');

  const tables = document.querySelectorAll('table');

  const allTrs = document.querySelectorAll('tr');

  if (tables.length === 0 || allTrs.length === 0) {
    return false;
  }

  const rows = document.querySelectorAll('tbody tr');

  if (tbody) {
    const trsInTbody = tbody.querySelectorAll('tr');

    // Log first few rows
    trsInTbody.forEach((tr, idx) => {
      if (idx < 3) {
        const tds = tr.querySelectorAll('td');
      }
    });
  }

  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('td');
    if (cells.length < 5) {
      return;
    }

    const actionCell = cells[3];
    const dataCell = cells[4];

    // Store original content if not already stored
    if (!dataCell.hasAttribute('data-original-html')) {
      dataCell.setAttribute('data-original-html', dataCell.innerHTML);
    }

    // If diff view is disabled, restore original content
    if (!diffViewEnabled) {
      dataCell.innerHTML = dataCell.getAttribute('data-original-html');
      return;
    }

    const action = actionCell.textContent.trim();
    // Use original HTML for processing, not current (which might be a rendered table)
    const dataHtml = dataCell.getAttribute('data-original-html');
    const dataText = dataCell.textContent;

    let processed = false;

    if (dataHtml.includes('Changes:')) {
      renderChangesFormat(dataCell, dataHtml);
      processed = true;
    }

    if (!processed && action === 'PREISLIMIT' && dataHtml.includes('==>')) {
      renderPreislimitFormat(dataCell, dataHtml);
      processed = true;
    }

    if (!processed && dataHtml.includes('[') && dataHtml.includes('MATCHRULE') && dataHtml.includes('==>')) {
      renderMatchruleFormat(dataCell, dataHtml);
    }
  });
  return true;
}

// Run immediately
processLogTable();

// Also run on DOMContentLoaded in case of async loading
document.addEventListener('DOMContentLoaded', function() {
  if (isLogMode()) {
    processLogTable();
  }
});

function renderChangesFormat(cell, dataHtml) {
  const cleanHtml = dataHtml.replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');
  const match = cleanHtml.match(/Changes:\s*([\s\S]*)/);
  if (!match) {
    return;
  }

  const content = match[1];
  const segments = parseSegments(content);

  if (segments.length === 0) {
    return;
  }

  const table = createInnerTable(segments);
  cell.innerHTML = '';
  cell.appendChild(table);
}

function renderPreislimitFormat(cell, dataHtml) {
  const cleanHtml = dataHtml.replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');
  const match = cleanHtml.match(/([^\s]+)\s*==>\s*([^\s]+)/);
  if (!match) {
    return;
  }

  const segments = [{
    field: 'Preis',
    oldValue: match[1].trim(),
    newValue: match[2].trim()
  }];

  const table = createInnerTable(segments);
  cell.innerHTML = '';
  cell.appendChild(table);
}

function renderMatchruleFormat(cell, dataHtml) {
  const cleanHtml = dataHtml.replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');
  const match = cleanHtml.match(/\[MATCHRULE\s+([^\]]+)\]/);
  if (!match) {
    return;
  }

  const content = match[1];
  const parts = content.split(/\s*==>\s*/);
  if (parts.length !== 2) {
    return;
  }

  const segments = [{
    field: 'MATCHRULE',
    oldValue: parts[0].trim(),
    newValue: parts[1].trim()
  }];

  const table = createInnerTable(segments);
  cell.innerHTML = '';
  cell.appendChild(table);
}

function parseSegments(content) {
  const segments = [];

  // Remove leading/trailing spaces and brackets if present
  content = content.trim();
  if (content.startsWith('[')) content = content.substring(1);
  if (content.endsWith(']')) content = content.substring(0, content.length - 1);

  // Split by ],[ to get individual segments
  const rawSegments = content.split('],[');

  rawSegments.forEach((rawSeg, idx) => {
    let segment = rawSeg.trim();

    // Clean up brackets if they're still there from the split
    if (segment.startsWith('[')) segment = segment.substring(1);
    if (segment.endsWith(']')) segment = segment.substring(0, segment.length - 1);


    const arrowIndex = segment.indexOf('==>');
    if (arrowIndex === -1) {
      return;
    }

    const beforeArrow = segment.substring(0, arrowIndex).trim();
    const afterArrow = segment.substring(arrowIndex + 3).trim();

    const spaceIndex = beforeArrow.indexOf(' ');
    let field, oldValue;

    if (spaceIndex > 0) {
      field = beforeArrow.substring(0, spaceIndex);
      oldValue = beforeArrow.substring(spaceIndex + 1);
    } else {
      field = beforeArrow;
      oldValue = '';
    }


    segments.push({
      field: field,
      oldValue: oldValue,
      newValue: afterArrow
    });
  });

  return segments;
}

function tokenize(value) {
  if (!value || value.trim() === 'NIX') {
    return [];
  }

  // Try to detect delimiter and split
  let tokens = [];
  if (value.includes('|')) {
    tokens = value.split('|').map(t => t.trim()).filter(t => t);
  } else if (value.includes(',')) {
    tokens = value.split(',').map(t => t.trim()).filter(t => t);
  } else {
    // Split by whitespace
    tokens = value.split(/\s+/).filter(t => t);
  }

  return tokens;
}

function highlightCell(oldValue, newValue, isNewValueCell) {
  if (!highlightingEnabled || oldValue === 'NIX' || newValue === 'NIX') {
    // Return plain text without highlighting
    return document.createTextNode(isNewValueCell ? newValue : oldValue);
  }

  const cellValue = isNewValueCell ? newValue : oldValue;
  const otherValue = isNewValueCell ? oldValue : newValue;

  const currentTokens = tokenize(cellValue);
  const otherTokens = tokenize(otherValue);

  if (currentTokens.length === 0) {
    return document.createTextNode(cellValue);
  }

  const container = document.createElement('span');

  currentTokens.forEach((token, idx) => {
    const tokenSpan = document.createElement('span');
    tokenSpan.textContent = token;

    const tokenExists = otherTokens.includes(token);

    if (isNewValueCell && !tokenExists) {
      // Green for new tokens in Neu-Wert
      tokenSpan.style.setProperty('background-color', '#e6ffe6', 'important');
      tokenSpan.style.borderRadius = '3px';
      tokenSpan.style.padding = '0 3px';
    } else if (!isNewValueCell && !tokenExists) {
      // Red strikethrough for deleted tokens in Alt-Wert
      tokenSpan.style.setProperty('background-color', '#ffecec', 'important');
      tokenSpan.style.textDecoration = 'line-through';
      tokenSpan.style.borderRadius = '3px';
      tokenSpan.style.padding = '0 3px';
    }

    container.appendChild(tokenSpan);

    // Add space between tokens
    if (idx < currentTokens.length - 1) {
      container.appendChild(document.createTextNode(' '));
    }
  });

  return container;
}

function createInnerTable(segments) {
  const table = document.createElement('table');
  table.style.borderCollapse = 'collapse';
  table.style.width = '100%';
  table.style.marginTop = '8px';
  table.style.fontSize = '0.9em';
  table.style.border = '1px solid #ddd';
  table.className = 'adminlog__inner-table';  // Markiere als innere Tabelle

  const columnWidths = ['20%', '40%', '40%'];

  const tbody = document.createElement('tbody');
  segments.forEach((seg, index) => {
    const row = document.createElement('tr');
    if (index % 2 === 0) {
      row.style.backgroundColor = '#fafafa';
    }

    // Feld column
    const fieldTd = document.createElement('td');
    fieldTd.textContent = seg.field;
    fieldTd.style.padding = '6px';
    fieldTd.style.border = '1px solid #ddd';
    fieldTd.style.wordBreak = 'break-word';
    fieldTd.style.width = columnWidths[0];
    row.appendChild(fieldTd);

    // Alt-Wert column
    const oldTd = document.createElement('td');
    oldTd.style.padding = '6px';
    oldTd.style.border = '1px solid #ddd';
    oldTd.style.wordBreak = 'break-word';
    oldTd.style.width = columnWidths[1];
    oldTd.appendChild(highlightCell(seg.oldValue, seg.newValue, false));
    row.appendChild(oldTd);

    // Neu-Wert column
    const newTd = document.createElement('td');
    newTd.style.padding = '6px';
    newTd.style.border = '1px solid #ddd';
    newTd.style.wordBreak = 'break-word';
    newTd.style.width = columnWidths[2];
    newTd.appendChild(highlightCell(seg.oldValue, seg.newValue, true));
    row.appendChild(newTd);

    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  return table;
}

// Wait for table to be rendered with MutationObserver
let observerStarted = false;
let lastProcessTime = 0;

function waitForTable() {

  // Try to create toggle first
  createDiffViewToggle();

  // Try immediately first
  if (processLogTable()) {
    lastProcessTime = Date.now();
    return;
  }

  // If not found, observe DOM changes
  if (!observerStarted) {
    observerStarted = true;
    let processTimeout;

    const observer = new MutationObserver(function(mutations) {
      // Debounce processing to avoid too many calls
      clearTimeout(processTimeout);
      processTimeout = setTimeout(() => {
        const now = Date.now();
        // Only process if at least 500ms has passed since last process
        if (now - lastProcessTime >= 500) {
          if (processLogTable()) {
            lastProcessTime = now;
          }
        }
      }, 200);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Keep observer running for at least 30 seconds to catch late-loaded content
    setTimeout(() => {
      observer.disconnect();
    }, 30000);
  }
}

// Run immediately
if (isLogMode()) {
  waitForTable();
}

// Also try after delays
if (isLogMode()) {
  setTimeout(() => {
    createDiffViewToggle();
    waitForTable();
  }, 300);

  setTimeout(() => {
    createDiffViewToggle();
    waitForTable();
  }, 800);

  setTimeout(() => {
    createDiffViewToggle();
    waitForTable();
  }, 1500);
}

// Also run on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
  if (isLogMode()) {
    createDiffViewToggle();
    waitForTable();
  }
});

// Listen for URL changes (when switching between article view and log view)
window.addEventListener('popstate', function() {
  if (!isLogMode()) {
    toggleCreated = false;
    return;
  }

  toggleCreated = false;
  observerStarted = false;
  createDiffViewToggle();
  waitForTable();
  initializeFilterDropdown();
});

// Monitor URL changes (including query parameter changes)
let lastUrl = window.location.href;

function checkUrlChange() {
  const currentUrl = window.location.href;
  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl;

    // Prüfe ob wir noch im log-Modus sind
    if (!isLogMode()) {
      // Entferne Toggle-Elemente
      const container = document.querySelector('.adminlog__filter-container')?.parentElement?.querySelector('[style*="display: flex"]');
      if (container) {
        container.remove();
      }

      // Deaktiviere CSS-Overrides
      const styleOverride = document.querySelector('style[data-white-bg-override]');
      if (styleOverride) {
        styleOverride.remove();
      }

      // Reset globale Variablen
      toggleCreated = false;
      observerStarted = false;

      return;
    }

    // Reset state when URL changes
    toggleCreated = false;
    observerStarted = false;

    // Re-initialize everything after a short delay to allow DOM to update
    setTimeout(() => {
      createDiffViewToggle();
      waitForTable();
      initializeFilterDropdown();
    }, 200);
  }
}

// Check for URL changes every 500ms
setInterval(checkUrlChange, 500);

// Add CSS for dropdown
if (!document.querySelector('style[data-filter-dropdown-style]')) {
  const style = document.createElement('style');
  style.setAttribute('data-filter-dropdown-style', 'true');
  style.textContent = `
    .adminlog__filter-dropdown {
      position: absolute;
      background: white;
      border: 1px solid #ddd;
      border-radius: 0.25rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      z-index: 1000;
      max-height: 300px;
      overflow-y: auto;
      min-width: 150px;
    }

    .adminlog__filter-dropdown-item {
      padding: 8px 12px;
      cursor: pointer;
      font-size: 0.9em;
      color: #000;
      background-color: #fff;
      border-bottom: 1px solid #f0f0f0;
    }

    .adminlog__filter-dropdown-item:hover {
      background-color: #f5f5f5;
      color: #000;
    }

    .adminlog__filter-container {
      position: relative;
      display: inline-block;
      width: 100%;
    }
  `;
  document.head.appendChild(style);
}

function filterTable() {
  const whoInput = document.querySelector('input.adminlog__filter[name="who"]');
  const actionInput = document.querySelector('input.adminlog__filter[name="action"]');

  const whoValue = whoInput ? whoInput.value.trim() : '';
  const actionValue = actionInput ? actionInput.value.trim() : '';

  const tbody = document.querySelector('form tbody');

  if (tbody) {
    const rows = tbody.querySelectorAll(':scope > tr');

    rows.forEach((row, idx) => {
      const cells = row.querySelectorAll(':scope > td');
      if (cells.length >= 4) {
        const whoCell = cells[2];
        const actionCell = cells[3];

        const rowWhoValue = whoCell ? whoCell.textContent.trim() : '';
        const rowActionValue = actionCell ? actionCell.textContent.trim() : '';

        const whoMatch = whoValue === '' || rowWhoValue === whoValue;
        const actionMatch = actionValue === '' || rowActionValue === actionValue;

        if (whoMatch && actionMatch) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      }
    });
  }
}

function initializeFilterDropdown() {

  if (!isLogMode()) {
    return;
  }

  const whoInput = document.querySelector('input.adminlog__filter[name="who"]');
  const actionInput = document.querySelector('input.adminlog__filter[name="action"]');

  // Initialize WHO filter
  if (whoInput) {
    initializeFilter(whoInput, 2);
  }

  // Initialize ACTION filter
  if (actionInput) {
    initializeFilter(actionInput, 3);
  }

  function initializeFilter(filterInput, cellIndex) {
    // Wrap the input in a container if not already wrapped
    if (!filterInput.parentElement.classList.contains('adminlog__filter-container')) {
      const container = document.createElement('div');
      container.className = 'adminlog__filter-container';
      filterInput.parentElement.insertBefore(container, filterInput);
      container.appendChild(filterInput);
    }

    const container = filterInput.parentElement;

    // Remove existing dropdown if any
    const existingDropdown = container.querySelector('.adminlog__filter-dropdown');
    if (existingDropdown) {
      existingDropdown.remove();
    }

    function getFilterValues() {
      // Try different selectors to find the main table
      let rows = [];

      // Try 1: form tbody
      let mainTable = document.querySelector('form tbody');

      if (mainTable) {
        rows = mainTable.querySelectorAll(':scope > tr');
      }

      // Try 2: If not found, get all tbody and filter
      if (rows.length === 0) {
        const allRows = document.querySelectorAll('tbody tr');

        // Filter out nested table rows (they will have fewer than 5 cells typically)
        rows = Array.from(allRows).filter(row => {
          const cells = row.querySelectorAll(':scope > td');
          return cells.length >= 5;
        });
      }

      const filterValues = {};

      rows.forEach((row, idx) => {
        const cells = row.querySelectorAll(':scope > td');

        if (cells.length > cellIndex) {
          const cell = cells[cellIndex];
          const cellText = cell.textContent.trim();

          if (cellText && cellText.length > 0) {
            filterValues[cellText] = (filterValues[cellText] || 0) + 1;
          }
        }
      });

      return filterValues;
    }

    function showDropdown() {
      const filterValues = getFilterValues();
      const sortedEntries = Object.entries(filterValues).sort((a, b) => a[0].localeCompare(b[0]));

      // Remove existing dropdown
      const existingDropdown = container.querySelector('.adminlog__filter-dropdown');
      if (existingDropdown) {
        existingDropdown.remove();
      }

      const dropdown = document.createElement('div');
      dropdown.className = 'adminlog__filter-dropdown';
      dropdown.style.top = (filterInput.offsetHeight + 2) + 'px';
      dropdown.style.left = '0px';

      if (sortedEntries.length === 0) {
        const item = document.createElement('div');
        item.className = 'adminlog__filter-dropdown-item';
        item.textContent = 'Keine Werte gefunden';
        dropdown.appendChild(item);
      } else {
        sortedEntries.forEach(([value, count]) => {
          const item = document.createElement('div');
          item.className = 'adminlog__filter-dropdown-item';
          item.textContent = `${value} (${count})`;
          item.style.cursor = 'pointer';

          item.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            filterInput.value = value;

            // Trigger input event to notify React/the application of the change
            const inputEvent = new Event('input', { bubbles: true });
            filterInput.dispatchEvent(inputEvent);

            const changeEvent = new Event('change', { bubbles: true });
            filterInput.dispatchEvent(changeEvent);

            // Remove dropdown
            dropdown.remove();

            // Filter table
            filterTable();
          });

          dropdown.appendChild(item);
        });
      }

      container.appendChild(dropdown);
    }

    function hideDropdown() {
      const dropdown = container.querySelector('.adminlog__filter-dropdown');
      if (dropdown) {
        dropdown.remove();
      }
    }

    // Input event listener to filter table when user types or input changes
    filterInput.addEventListener('input', function(e) {
      hideDropdown();
      filterTable();
    });

    filterInput.addEventListener('click', function(e) {
      e.stopPropagation();
      showDropdown();
    });

    filterInput.addEventListener('focus', function() {
      // Don't show dropdown on focus, only on click
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
      if (e.target !== filterInput) {
        hideDropdown();
      }
    });
  }
}

// Initialize filter dropdown after page loads
if (isLogMode()) {
  setTimeout(() => {
    initializeFilterDropdown();
  }, 1500);
}

})();