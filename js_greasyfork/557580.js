// ==UserScript==
// @name         Constellation Lot View
// @namespace    http://tampermonkey.net/
// @version      2025-09-15
// @description  Highlight frozen tasks
// @author       Me
// @match        https://randrhomes.constellation-online.com/*/OLS/SingleLotView.aspx*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=constellation-online.com
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557580/Constellation%20Lot%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/557580/Constellation%20Lot%20View.meta.js
// ==/UserScript==


(function () {
  // ---------- Config ----------
  // Which cell to highlight (1-based index). You said “12th (index 11)” but your code targeted nth-of-type(11).
  // Set this to the exact column number you want. Change to 12 if that’s truly the one you want.
  const FROZEN_CELL_INDEX = 11;

  // ---------- Styles ----------
  const css = `
    .tm-frozen-cell {
      /* inset border without affecting layout box model */
      box-shadow: inset 0 0 0 3px #2b6cb0 !important;
      border-radius: 4px;
    }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // ---------- Helpers ----------
  function safeAtob(b64) {
    if (!b64) return '';
    b64 = b64.replace(/-/g, '+').replace(/_/g, '/');
    const pad = b64.length % 4;
    if (pad) b64 += '='.repeat(4 - pad);
    return atob(b64);
  }

  function parseRowData(tr) {
    try {
      const b64 = tr.getAttribute('data') || '';
      const text = safeAtob(b64);
      let obj;
      try { obj = JSON.parse(text); } catch { return null; }
      if (typeof obj === 'string') {
        try { obj = JSON.parse(obj); } catch { /* ignore */ }
      }
      return obj && typeof obj === 'object' ? obj : null;
    } catch {
      return null;
    }
  }

  function isFrozenFrom(obj) {
    return Boolean(obj?.IsFrozen ?? obj?.Frozen ?? obj?.isFrozen ?? obj?.frozen);
  }

  function processRow(tr) {
    const data = parseRowData(tr);
    if (!data) return;

    const isFrozen = isFrozenFrom(data);
    const cells = tr.children;
    const target = cells[FROZEN_CELL_INDEX - 1] || tr.querySelector('td:nth-of-type(' + FROZEN_CELL_INDEX + ')') || cells[0];
    if (!target) return;

    if (isFrozen) {
      target.classList.add('tm-frozen-cell');
      if (!target.title?.includes('Frozen')) target.title = (target.title ? target.title + ' · ' : '') + 'Frozen task';
    } else {
      target.classList.remove('tm-frozen-cell');
    }


    //Expand PO section if blank....or if there is more than one
    //  Cell 1 = PO vendor link area, set if a PO is showing
    //  Cell 3 = down arrow link, click to show hidden PO's
    debugger;
    const po_cells = tr.querySelector('table.PoSupplier thead tr').children,
      po_vendor_link = po_cells[1].querySelector('a'),
      show_po_arrow_down = po_cells[3].querySelector('i.fa-arrow-down'),
      show_po_link = po_cells[3].querySelector('a');
    if (po_vendor_link.innerText === '' && show_po_arrow_down) {
      show_po_link.click();
    }
  }

  function processAllRows(tbody) {
    tbody.querySelectorAll('tr[data]').forEach(processRow);
  }

  // ---------- Observers ----------
  let tbodyObserver = null;
  let tableWatcher = null;
  let currentTbody = null;

  function attachTbodyObserver(tbody) {
    if (tbodyObserver) tbodyObserver.disconnect();
    currentTbody = tbody;

    // initial pass
    processAllRows(tbody);

    tbodyObserver = new MutationObserver(mutations => {
      for (const m of mutations) {
        if (m.type === 'childList') {
          m.addedNodes.forEach(n => {
            if (n.nodeType !== 1) return;
            if (n.matches?.('tr[data]')) processRow(n);
            n.querySelectorAll?.('tr[data]')?.forEach(processRow);
          });
        } else if (m.type === 'attributes' && m.target?.matches?.('tr[data]')) {
          processRow(m.target);
        }
      }
    });

    tbodyObserver.observe(tbody, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data']
    });

    // Light periodic safety net for “big rewrites” that slip past us
    // (cheap: just rescans for new rows + updates classes)
    if (!window.__tmFrozenInterval) {
      window.__tmFrozenInterval = setInterval(() => {
        const tb = document.querySelector('#LotTaskTable');
        if (tb) processAllRows(tb);
      }, 1500);
    }
  }

  function watchForTbodyReplacement() {
    if (tableWatcher) tableWatcher.disconnect();

    // Observe the whole document for a new #LotTaskTable (handles full outerHTML replacement)
    tableWatcher = new MutationObserver(() => {
      const tb = document.querySelector('#LotTaskTable');
      if (!tb) return;

      // If TBODY node identity changed, re-attach
      if (tb !== currentTbody) {
        attachTbodyObserver(tb);
      }
    });

    tableWatcher.observe(document.documentElement, { childList: true, subtree: true });
  }

  function init() {
    const tb = document.querySelector('#LotTaskTable');
    if (tb) attachTbodyObserver(tb);
    watchForTbodyReplacement();
  }

  // Run now, and also when the page becomes visible again
  init();
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) init();
  });
})();
