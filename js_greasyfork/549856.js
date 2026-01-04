// ==UserScript==
// @name         Bar-I Table Sort Enhancer (SPA-safe, hidden-column aware)
// @namespace    https://greasyfork.org/users/your-username
// @version      2.3.0
// @description  Click-to-sort on the SECOND table (+flash). Correctly maps header→cell even when columns are hidden. SPA-aware start/stop. Clears indicators on disable. Click first column to copy row.
// @author       Nicolai Mihaic
// @match        https://app.bar-i.com/*
// @grant        none
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bar-i.com
// @downloadURL https://update.greasyfork.org/scripts/549856/Bar-I%20Table%20Sort%20Enhancer%20%28SPA-safe%2C%20hidden-column%20aware%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549856/Bar-I%20Table%20Sort%20Enhancer%20%28SPA-safe%2C%20hidden-column%20aware%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const ROUTE_RE = /^https?:\/\/app\.bar-i\.com\/barI\/analysis-workflow\/accountability-analysis\/?/i;
  const IDS = { btn: 'BTS_btn' };

  let BTS_started = false;
  let BTS_active = false;
  let BTS_table = null;
  let BTS_headerListeners = new Map();
  let BTS_urlPoll = null;
  let BTS_domObs = null;
  let BTS_bodyObs = null;
  let BTS_headObs = null;

  // Row copy functionality variables
  let RC_copyListeners = new Map();

  let BTS_sortState = { colIndex: 4, ascending: false, bySecond: false };

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const onTarget = () => ROUTE_RE.test(location.href);
  const isVisible = (el) => !!el && el.offsetWidth > 0 && el.offsetHeight > 0 && getComputedStyle(el).visibility !== 'hidden';

  function addButton() {
    if (document.getElementById(IDS.btn) || !document.body) return;
    const btn = document.createElement('button');
    btn.id = IDS.btn;
    btn.textContent = 'Enable Table Sort';
    Object.assign(btn.style, {
      position: 'fixed', top: '55px', left: '10px', zIndex: 2147483639,
      padding: '5px 10px', backgroundColor: '#28a745', color: '#fff',
      border: 'none', borderRadius: '6px', cursor: 'pointer',
      boxShadow: '0 6px 18px rgba(0,0,0,.08)', font: '13px/1.2 system-ui,-apple-system,Segoe UI,Roboto,sans-serif'
    });
    btn.addEventListener('click', async () => {
      if (!BTS_active) {
        btn.textContent = 'Sort Enabled';
        btn.style.backgroundColor = '#218838';
        await initTableSort();
        BTS_active = true;
      } else {
        btn.textContent = 'Sort Disabled';
        btn.style.backgroundColor = '#6c757d';
        disableTableSort();
        BTS_active = false;
      }
    }, { passive: true });
    document.body.appendChild(btn);
  }

  function enableTextareaSelection() {
    // Find all disabled textareas
    const disabledTextareas = document.querySelectorAll('textarea.disabled, textarea[disabled]');
    disabledTextareas.forEach(textarea => {
        // Remove the disabled attribute
        textarea.removeAttribute('disabled');
        // Make it readonly instead (allows selection but not editing)
        textarea.readOnly = true;
        // Remove disabled class
        textarea.classList.remove('disabled');
        // Enable text selection
        textarea.style.userSelect = 'text';
        textarea.style.webkitUserSelect = 'text';
        textarea.style.mozUserSelect = 'text';
        textarea.style.msUserSelect = 'text';
        // Maintain disabled appearance
        textarea.style.backgroundColor = '#e9ecef';
        textarea.style.opacity = '1';
        textarea.style.cursor = 'text';
        // Add tooltip
        textarea.title = 'Text is selectable and copyable';
    });
  }

  function removeButton() { document.getElementById(IDS.btn)?.remove(); }

  async function waitForSecondTable(timeoutMs = 15000) {
    const t0 = performance.now();
    while (performance.now() - t0 < timeoutMs) {
      const t = document.querySelectorAll('table')[1];
      if (t && t.tBodies && t.tBodies[0]) return t;
      await sleep(200);
    }
    return null;
  }

  // NEW: strip indicators from all headers (used on disable)
  function clearHeaderIndicators(table) {
    if (!table) return;
    const heads = table.tHead ? table.tHead.querySelectorAll('th') : table.querySelectorAll('thead th, th');
    heads.forEach(th => {
      th.textContent = (th.textContent || '').replace(/[\u25B2\u25BC][SU]?/g, '').trim();
    });
  }

  function buildColumnMap(table) {
    const thead = table.tHead || table.querySelector('thead');
    const headerCells = thead ? Array.from(thead.rows[0]?.cells || thead.querySelectorAll('th')) : Array.from(table.querySelectorAll('thead th'));
    const visibleHeaders = headerCells.filter(isVisible);

    const tbody = table.tBodies[0];
    const firstRow = tbody?.rows?.[0];
    const bodyCells = firstRow ? Array.from(firstRow.cells) : [];
    const visibleBodyCellIndices = [];
    for (let i = 0; i < bodyCells.length; i++) {
      if (isVisible(bodyCells[i])) visibleBodyCellIndices.push(i);
    }

    const len = Math.min(visibleHeaders.length, visibleBodyCellIndices.length);
    const headerByCellIndex = new Map();
    for (let j = 0; j < len; j++) {
      headerByCellIndex.set(visibleBodyCellIndices[j], visibleHeaders[j]);
    }
    return { visibleHeaders, visibleBodyCellIndices, headerByCellIndex, len };
  }

  function sortTable(table, colIndex, ascending, bySecond) {
    const tbody = table.tBodies[0];
    if (!tbody) return;
    const rows = Array.from(tbody.querySelectorAll('tr')).sort((x, y) => {
      const getCellText = (row) => (row.cells[colIndex]?.textContent || row.cells[colIndex]?.innerText || '').trim();
      const clean = (s) => s.replace(/^[\*\$]+\s*/, '').trim();
      const sx = getCellText(x).split('/');
      const sy = getCellText(y).split('/');
      const xv = parseFloat(bySecond ? clean(sx[1] || sx[0] || '') : clean(sx[0] || '')) || 0;
      const yv = parseFloat(bySecond ? clean(sy[1] || sy[0] || '') : clean(sy[0] || '')) || 0;
      return ascending ? xv - yv : yv - xv;
    });
    const frag = document.createDocumentFragment();
    rows.forEach(r => frag.appendChild(r));
    tbody.appendChild(frag);
  }

  function flashHeader(th) {
    const original = th.style.backgroundColor;
    th.style.backgroundColor = '#ff000061';
    setTimeout(() => { th.style.backgroundColor = original || ''; }, 300);
  }

  function updateHeaderIndicators(table, map) {
    map.visibleHeaders.forEach((th) => {
      th.textContent = (th.textContent || '').replace(/[\u25B2\u25BC][SU]?/g, '').trim();
    });
    const th = map.headerByCellIndex.get(BTS_sortState.colIndex);
    if (th) {
      const arrow = BTS_sortState.ascending ? ' ▲' : ' ▼';
      const mode  = BTS_sortState.bySecond ? 'U' : 'S';
      th.textContent += arrow + mode;
    }
  }

  function bindHeaders(table) {
    if (BTS_table && BTS_table !== table) unbindHeaders(BTS_table);
    BTS_table = table;

    const map = buildColumnMap(table);

    if (!map.headerByCellIndex.has(BTS_sortState.colIndex) && map.visibleBodyCellIndices.length) {
      BTS_sortState.colIndex = map.visibleBodyCellIndices[0];
    }

    unbindHeaders(table); // clean any existing

    map.visibleHeaders.forEach((th) => {
      th.style.cursor = 'pointer';
      th.style.userSelect = 'none';
      th.style.webkitUserSelect = 'none';

      const handler = (e) => {
        const m = buildColumnMap(table);
        let targetColIndex = null;
        for (const [cellIdx, hdr] of m.headerByCellIndex.entries()) {
          if (hdr === th) { targetColIndex = cellIdx; break; }
        }
        if (targetColIndex == null) return;

        BTS_sortState.colIndex = targetColIndex;
        if (e.shiftKey) BTS_sortState.bySecond = !BTS_sortState.bySecond;
        else BTS_sortState.ascending = !BTS_sortState.ascending;

        sortTable(table, BTS_sortState.colIndex, BTS_sortState.ascending, BTS_sortState.bySecond);
        updateHeaderIndicators(table, m);
        flashHeader(th);
      };

      th.addEventListener('click', handler);
      BTS_headerListeners.set(th, handler);
    });

    sortTable(table, BTS_sortState.colIndex, BTS_sortState.ascending, BTS_sortState.bySecond);
    updateHeaderIndicators(table, map);

    if (BTS_bodyObs) BTS_bodyObs.disconnect();
    if (table.tBodies[0]) {
      BTS_bodyObs = new MutationObserver(() => {
        const current = document.querySelectorAll('table')[1];
        if (current && current !== BTS_table) {
          bindHeaders(current);
          bindRowCopy(current);
        }
      });
      BTS_bodyObs.observe(table.tBodies[0], { childList: true, subtree: true });
    }

    if (BTS_headObs) BTS_headObs.disconnect();
    if (table.tHead) {
      BTS_headObs = new MutationObserver(() => { bindHeaders(table); });
      BTS_headObs.observe(table.tHead, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
    }
  }

  function unbindHeaders(table) {
    table.querySelectorAll('th').forEach((th) => {
      const handler = BTS_headerListeners.get(th);
      if (handler) {
        th.removeEventListener('click', handler);
        BTS_headerListeners.delete(th);
      }
      th.style.backgroundColor = '';
    });
    // NEW: remove indicators when unbinding
    clearHeaderIndicators(table);
  }

  async function initTableSort() {
    const t = await waitForSecondTable();
    if (!t) return;
    bindHeaders(t);
  }

  function disableTableSort() {
    // Unbind and clear indicators from the last bound table
    if (BTS_table) {
      unbindHeaders(BTS_table);
      BTS_table = null;
    }
    // If the table was replaced just before disabling, clear indicators on the current second table too
    const currentSecond = document.querySelectorAll('table')[1];
    if (currentSecond) clearHeaderIndicators(currentSecond);

    if (BTS_bodyObs) { BTS_bodyObs.disconnect(); BTS_bodyObs = null; }
    if (BTS_headObs) { BTS_headObs.disconnect(); BTS_headObs = null; }
  }

  // ========== ROW COPY FUNCTIONALITY ==========

  function copyRowToClipboard(row) {
    // Extract text content from all cells in the row
    const cells = row.querySelectorAll('td');
    const rowData = [];

    cells.forEach(cell => {
      // Get text content, removing extra whitespace
      let cellText = cell.textContent.trim();
      // Replace multiple spaces/newlines with single space
      cellText = cellText.replace(/\s+/g, ' ');
      rowData.push(cellText);
    });

    // Join with tabs for easy pasting into spreadsheets
    const rowText = rowData.join('\t');

    // Copy to clipboard
    navigator.clipboard.writeText(rowText).then(() => {
      // Visual feedback
      showCopyConfirmation(row);
    }).catch(err => {
      console.error('Failed to copy: ', err);
      // Fallback for older browsers
      fallbackCopyToClipboard(rowText);
      showCopyConfirmation(row);
    });
  }

  function showCopyConfirmation(row) {
    // Highlight the row briefly to show it was copied
    const originalBackground = row.style.backgroundColor;
    row.style.backgroundColor = '#d4edda';
    row.style.transition = 'background-color 0.3s';

    setTimeout(() => {
      row.style.backgroundColor = originalBackground;
    }, 1000);

    // Show a small notification
    const notification = document.createElement('div');
    notification.textContent = 'Row copied to clipboard!';
    notification.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      background: #28a745;
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      z-index: 10000;
      font-size: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 2000);
  }

  function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      console.log('Fallback copy successful');
    } catch (err) {
      console.error('Fallback copy failed: ', err);
    }

    document.body.removeChild(textArea);
  }

  function bindRowCopy(table) {
    if (!table || !table.tBodies[0]) return;

    // Clear existing listeners
    unbindRowCopy(table);

    // Find all rows in the table body
    const rows = table.tBodies[0].querySelectorAll('tr');

    rows.forEach(row => {
      const firstCell = row.querySelector('td:first-child');

      if (firstCell) {
        // Add visual indicators for clickability (subtle to not interfere with sorting)
        firstCell.style.cursor = 'copy';
        firstCell.title = 'Click to copy this row to clipboard';

        // Add a subtle border to indicate clickability
        const originalBorder = firstCell.style.border;
        firstCell.style.borderLeft = '2px solid transparent';

        // Add hover effect
        const mouseEnterHandler = () => {
          firstCell.style.borderLeft = '2px solid #dc3545';
          firstCell.style.backgroundColor = '#f8d7da';
        };

        const mouseLeaveHandler = () => {
          firstCell.style.borderLeft = '2px solid transparent';
          firstCell.style.backgroundColor = '';
        };

        // Add click event listener
        const clickHandler = function(e) {
          e.stopPropagation(); // Prevent any other click handlers
          copyRowToClipboard(row);
        };

        firstCell.addEventListener('click', clickHandler);
        firstCell.addEventListener('mouseenter', mouseEnterHandler);
        firstCell.addEventListener('mouseleave', mouseLeaveHandler);

        // Store listeners for cleanup
        RC_copyListeners.set(firstCell, {
          click: clickHandler,
          mouseenter: mouseEnterHandler,
          mouseleave: mouseLeaveHandler
        });
      }
    });
  }

  function unbindRowCopy(table) {
    if (!table) return;

    const firstCells = table.querySelectorAll('tbody td:first-child');
    firstCells.forEach(cell => {
      const handlers = RC_copyListeners.get(cell);
      if (handlers) {
        cell.removeEventListener('click', handlers.click);
        cell.removeEventListener('mouseenter', handlers.mouseenter);
        cell.removeEventListener('mouseleave', handlers.mouseleave);
        RC_copyListeners.delete(cell);

        // Reset styles
        cell.style.cursor = '';
        cell.style.borderLeft = '';
        cell.style.backgroundColor = '';
        cell.title = '';
      }
    });
  }

  async function initRowCopy() {
    const t = await waitForSecondTable();
    if (!t) return;
    bindRowCopy(t);
  }

  function disableRowCopy() {
    const currentSecond = document.querySelectorAll('table')[1];
    if (currentSecond) unbindRowCopy(currentSecond);
    RC_copyListeners.clear();
  }

  // ========== END ROW COPY FUNCTIONALITY ==========

  function start() {
    if (BTS_started) return;
    BTS_started = true;

    BTS_domObs = new MutationObserver(() => {
      if (document.body) {
        addButton();
        // Always initialize row copy when page loads
        setTimeout(initRowCopy, 1000);
      }
    });
    BTS_domObs.observe(document.documentElement, { childList: true, subtree: true });

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        addButton();
        setTimeout(initRowCopy, 1000);
      }, { once: true });
    } else {
      addButton();
      setTimeout(initRowCopy, 1000);
    }
  }

  function stop() {
    disableTableSort();
    disableRowCopy();
    removeButton();
    if (BTS_domObs) { BTS_domObs.disconnect(); BTS_domObs = null; }
    BTS_started = false;
  }

  (function installUrlWatcher() {
    let last = location.href;
    function check() {
      const now = location.href;
      if (now !== last) {
        last = now;
        if (onTarget()) start(); else stop();
      }
    }
    BTS_urlPoll = setInterval(check, 200);
    window.addEventListener('popstate', check);
    window.addEventListener('hashchange', check);

    if (onTarget()) start(); else stop();
  })();

  // Method 3: Multiple trigger points (recommended for Angular apps)
  function setupAutoRun() {
    // Run immediately
    enableTextareaSelection();
    // Set up observer for dynamic content
    const observer = new MutationObserver(() => enableTextareaSelection());
    observer.observe(document.body, { childList: true, subtree: true });
    // Also run periodically as backup
    setInterval(enableTextareaSelection, 2000);
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupAutoRun);
  } else {
    setupAutoRun();
  }

})();