// ==UserScript==
// @name        Table sort columns with ctrl+alt+click
// @namespace   jjenkx
// @description Adds column sorting to any table on any website. Trigger sorting with Ctrl+Alt+Left-Click.
// @include     *
// @version     1.0
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/556727/Table%20sort%20columns%20with%20ctrl%2Balt%2Bclick.user.js
// @updateURL https://update.greasyfork.org/scripts/556727/Table%20sort%20columns%20with%20ctrl%2Balt%2Bclick.meta.js
// ==/UserScript==

// Handles clicks anywhere on the page and checks if the user clicked inside a table
function clickHandler(event) {
  const table = event.target.closest('table');
  if (!table) return;

  const td = event.target.closest('td, th');
  const isTopRow = td.closest('tr') === table.querySelector('tr');

  const ctrl = event.ctrlKey || event.metaKey;
  const alt = event.altKey;
  const leftClick = event.button === 0;

  // Sorting only happens when the user presses Ctrl + Alt + left click
  if (ctrl && alt && leftClick) {
    sortTableByTd(table, td, isTopRow);
  }
}

// Figures out which column was clicked and triggers sorting
function sortTableByTd(table, td, includeHeader) {
  // Determine exact column index, respecting colSpan if present
  let col = 0;
  for (const tdi of td.parentNode.querySelectorAll('td, th')) {
    if (tdi === td) break;
    col += tdi.colSpan || 1;
  }

  // Determines whether user is sorting the same column again (to reverse order)
  const lastSortCol = parseInt(table.dataset.lastSortCol, 10);
  const lastSortOrder = parseInt(table.dataset.lastSortOrder, 10);
  const order = lastSortCol === col ? -lastSortOrder || -1 : -1;

  table.dataset.lastSortCol = col;
  table.dataset.lastSortOrder = order;

  sortTable(table, col, order, includeHeader);
}

// Takes a table and performs actual sorting on its rows
function sortTable(table, col, order, includeHeader) {
  const trs = Array.from(table.querySelectorAll('tr'));
  const tbody = table.querySelector('tbody') || table;

  // If sorting the top row, include it; otherwise remove header temporarily
  const headerRow = includeHeader ? null : trs.shift();

  // Extract values from the chosen column and classify them by detected data type
  const rowsWithValues = trs.map(tr => {
    const text = colText(tr, col);
    let value = text;
    let valueType = 'string';

    // Detect numbers
    if (isNum(text)) {
      value = parseNum(text);
      valueType = 'number';

    // Detect dates such as "1/5/2023" or "2023-05-12"
    } else if (isDate(text)) {
      value = parseDate(text);
      valueType = 'date';

    // Detect file sizes like "2 MB", "10 GiB", etc.
    } else if (isSize(text)) {
      value = parseSize(text);
      valueType = 'number';
    }

    return { tr, value, valueType };
  });

  // Sorting logic: numeric → date → string
  rowsWithValues.sort((a, b) => {
    if (a.valueType === b.valueType) {
      return (a.value === b.value ? 0 : a.value > b.value ? 1 : -1) * order;
    }
    const typeOrder = { 'number': 1, 'date': 2, 'string': 3 };
    return (typeOrder[a.valueType] - typeOrder[b.valueType]) * order;
  });

  // Reinsert rows in sorted order
  if (!includeHeader && headerRow) tbody.appendChild(headerRow);
  rowsWithValues.forEach(row => tbody.appendChild(row.tr));
}

// Retrieves the text for the chosen column from a row, respecting colSpan
function colText(tr, col) {
  let c = 0;
  for (const td of tr.querySelectorAll('td, th')) {
    c += td.colSpan || 1;
    if (c > col) return clean(td.textContent);
  }
  return '';
}

// Detects whether text is numeric
function isNum(text) {
  return text && !isNaN(text.replace(/,/g, ''));
}

function parseNum(text) {
  return parseFloat(text.replace(/,/g, ''));
}

// Detects simple date formats
function isDate(text) {
  const datePatterns = [/^\d{1,2}\/\d{1,2}\/\d{4}$/, /^\d{4}-\d{1,2}-\d{1,2}$/];
  return datePatterns.some(pattern => pattern.test(text));
}

// Converts date to numeric timestamp
function parseDate(text) {
  const date = new Date(text);
  return !isNaN(date) ? date.getTime() : null;
}

// Detects sizes like "1 MB", "20 GiB", etc.
function isSize(text) {
  const regex = /^\s*\d+(\.\d+)?\s*(B|KB|MB|GB|TB|PB|EB|ZB|YB|KIB|MIB|GIB|TIB|PIB|EIB|ZIB|YIB)\s*$/i;
  return regex.test(text);
}

// Converts size units into bytes
function parseSize(text) {
  const units = {
    'B': 1, 'KB': 1e3, 'MB': 1e6, 'GB': 1e9, 'TB': 1e12, 'PB': 1e15, 'EB': 1e18, 'ZB': 1e21, 'YB': 1e24,
    'KIB': 1024, 'MIB': 1024 ** 2, 'GIB': 1024 ** 3, 'TIB': 1024 ** 4, 'PIB': 1024 ** 5, 'EIB': 1024 ** 6,
    'ZIB': 1024 ** 7, 'YIB': 1024 ** 8
  };
  const match = text.match(/^\s*(\d+(\.\d+)?)\s*([a-zA-Z]+)\s*$/i);
  if (!match) return NaN;
  const [_, num, , unit] = match;
  return parseFloat(num) * (units[unit.toUpperCase()] || 0);
}

// Basic text cleanup for comparisons
function clean(string) {
  return string.trim().toLowerCase().replace(/\s+/g, ' ');
}

// Injects two optional CSS utility classes (not directly used for sorting)
let style = document.createElement('style');
style.innerHTML = `.tt_hidden { display: none; } .tt_stats { background-color: #ffc; }`;
document.head.appendChild(style);

// Global click listener for the entire page
window.addEventListener('mousedown', clickHandler, true);
