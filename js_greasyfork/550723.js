// ==UserScript==
// @name         Company Meeting Date Sorter (Local Files)
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Automatically adds a Meeting Date ▲/▼ sort toggle to search result tables on local pages.
// @match        file://*/*
// @run-at       document-idle
// @author       vacuity
// @license      MIT
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/550723/Company%20Meeting%20Date%20Sorter%20%28Local%20Files%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550723/Company%20Meeting%20Date%20Sorter%20%28Local%20Files%29.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // Extra guard: ensure we only run on local files even if @match is broadened in the future.
  if (location.protocol !== 'file:') return;

  if (window.__companyDateSorterInitialized__) return;
  window.__companyDateSorterInitialized__ = true;

  document.addEventListener('DOMContentLoaded', init);
  // In case the page is already loaded
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    init();
  }

  function init() {
    // Find candidate tables and enhance them
    const tables = Array.from(document.querySelectorAll('table'));
    for (const table of tables) {
      tryEnhanceTable(table);
    }
  }

  function tryEnhanceTable(table) {
    if (table.dataset.meetingDateSorter === '1') return false;

    // Find a header row (first row that contains any <th>)
    const headerRow =
      table.querySelector('tr th') ? table.querySelector('tr').closest('tr') :
      Array.from(table.rows).find(r => r.querySelector('th')) ||
      null;

    if (!headerRow) return false;

    // Identify header cells and Meeting Date column index
    const ths = Array.from(headerRow.querySelectorAll('th'));
    if (!ths.length) return false;

    const thTexts = ths.map(th => (th.textContent || '').trim().toLowerCase());
    const hasName = thTexts.includes('name');
    let mdIdx = thTexts.findIndex(t => t.includes('meeting date'));

    // Require literal "Meeting Date" and a "Name" header
    if (mdIdx === -1 || !hasName) return false;

    // Build row groups (main row + following detail row(s))
    const groups = collectGroups(table, headerRow);
    if (!groups.length) return false;

    // Wire sorting on Meeting Date header
    const mdTh = ths[mdIdx];
    if (!mdTh) return false;

    table.dataset.meetingDateSorter = '1'; // mark as enhanced

    // Initial sort direction and render (default: newest first)
    let sortDir = 'desc';
    setHeaderLabel(mdTh, sortDir);
    renderSorted(groups, sortDir);

    // Make header interactive
    mdTh.setAttribute('role', 'button');
    mdTh.setAttribute('tabindex', '0');
    mdTh.style.userSelect = 'none';
    mdTh.style.cursor = 'pointer';
    mdTh.title = 'Click to sort by Meeting Date';

    mdTh.addEventListener('click', () => {
      sortDir = sortDir === 'desc' ? 'asc' : 'desc';
      setHeaderLabel(mdTh, sortDir);
      renderSorted(groups, sortDir);
    });

    mdTh.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        sortDir = sortDir === 'desc' ? 'asc' : 'desc';
        setHeaderLabel(mdTh, sortDir);
        renderSorted(groups, sortDir);
      }
    });

    return true;
  }

  function setHeaderLabel(th, dir) {
    th.textContent = `Meeting Date ${dir === 'desc' ? '▼' : '▲'}`;
  }

  function renderSorted(groups, dir) {
    const sorted = groups.slice().sort((a, b) =>
      dir === 'desc' ? b.dateMs - a.dateMs : a.dateMs - b.dateMs
    );

    // All group rows share the same parent section (usually <tbody>)
    const container = groups[0].rows[0].parentElement;
    const frag = document.createDocumentFragment();

    // Remove any current group rows (safe: DOM references persist)
    for (const g of groups) {
      for (const r of g.rows) {
        if (r.parentElement === container) container.removeChild(r);
      }
    }

    // Append in new order
    for (const g of sorted) {
      for (const r of g.rows) frag.appendChild(r);
    }
    container.appendChild(frag);
  }

  function collectGroups(table, headerRow) {
    // Use table.rows to include rows in thead/tbody/tfoot (ignores nested tables' rows)
    const rows = Array.from(table.rows);
    const headerIndex = rows.indexOf(headerRow);
    const out = [];

    for (let i = headerIndex + 1; i < rows.length; i++) {
      const row = rows[i];
      const tds = row.querySelectorAll(':scope > td');
      const isDetail = tds.length === 1 && tds[0].hasAttribute('colspan');

      if (isDetail) continue; // skip orphan detail rows

      // Main row heuristic: at least 3 <td> cells (Name, Meeting Date, Meeting Type)
      if (tds.length >= 3) {
        // Gather subsequent detail rows (single <td colspan="...">) until the next main row
        const groupRows = [row];
        let j = i + 1;
        while (j < rows.length) {
          const next = rows[j];
          const nextTds = next.querySelectorAll(':scope > td');
          const nextIsDetail = nextTds.length === 1 && nextTds[0].hasAttribute('colspan');
          if (!nextIsDetail) break;
          groupRows.push(next);
          j++;
        }
        i = j - 1;

        const dateText = tds[1]?.textContent.trim() || '';
        const date = parseYMD(dateText); // expects YYYY-MM-DD
        const dateMs = date.getTime();

        out.push({ date, dateMs, rows: groupRows });
      }
    }
    return out;
  }

  function parseYMD(s) {
    // Strict: YYYY-MM-DD; otherwise treat as epoch 0 so it sorts to bottom
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    if (!m) return new Date(0);
    const [, y, mo, d] = m;
    return new Date(Number(y), Number(mo) - 1, Number(d));
  }
})();
