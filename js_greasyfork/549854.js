// ==UserScript==
// @name         Bold Account Manager Text + Highlight Steps
// @namespace    https://greasyfork.org/users/1516265
// @version      1.9.8
// @description  Bold + Verdana on account name in gray alert bar, highlight Step cells, add Vessel column sorting, and enable Quantity sorting
// @author       Nicolai Mihaic
// @match        https://app.bar-i.com/barI/*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bar-i.com
// @downloadURL https://update.greasyfork.org/scripts/549854/Bold%20Account%20Manager%20Text%20%2B%20Highlight%20Steps.user.js
// @updateURL https://update.greasyfork.org/scripts/549854/Bold%20Account%20Manager%20Text%20%2B%20Highlight%20Steps.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const TARGET_SEL = '.gray-alertbar';
  const MARK_ATTR = 'data-tm-styled';
  const PREFIX = 'You are viewing as Bar Account Manager for ';

  let retryCount = 0;
  const MAX_RETRIES = 50;
  const RETRY_DELAY = 200;

  function injectCSS(doc = document) {
    let style = doc.getElementById('tm-account-css');
    if (!style) {
      style = doc.createElement('style');
      style.id = 'tm-account-css';
      (doc.head || doc.documentElement).appendChild(style);
    }

    style.textContent = `
      .tm-account-name {
        font-weight: 500;
        font-size: 13px !important;
        font-family: Verdana, Tahoma, Arial, sans-serif !important;
        color: #f0bd18 !important;
      }
      .tm-step1-invoices {
        color: #28a745 !important;
        font-weight: bold;
      }
      .tm-step5-variance {
        color: #f0bd18 !important;
        font-weight: bold;
      }
      .tm-step2-count {
        color: #dc3545 !important;
        font-weight: bold;
      }
      .tm-step234-done {
        color: #5b96f5 !important;
        font-weight: bold;
      }
      .tm-vessel-sort {
        color: inherit;
        text-decoration: none;
        cursor: pointer;
      }
      .tm-vessel-sort:hover {
        text-decoration: underline;
      }
      .tm-vessel-sort.asc::after {
        content: " ▲";
        font-size: 0.8em;
      }
      .tm-vessel-sort.desc::after {
        content: " ▼";
        font-size: 0.8em;
      }
    `;
  }

  function highlightSpecialCells(doc = document) {
    const cells = doc.querySelectorAll('td');
    for (const cell of cells) {
      const text = (cell.textContent || '').trim();
      if (text === 'Step 1 Invoices' && !cell.classList.contains('tm-step1-invoices')) {
        cell.classList.add('tm-step1-invoices');
      }
      if (text === 'Step 2 Count' && !cell.classList.contains('tm-step2-count')) {
        cell.classList.add('tm-step2-count');
      }
      if (text === 'Step 5 Variance Report' && !cell.classList.contains('tm-step5-variance')) {
        cell.classList.add('tm-step5-variance');
      }
      if (text === 'Step 2,3,4 Done' && !cell.classList.contains('tm-step234-done')) {
        cell.classList.add('tm-step234-done');
      }
    }
  }

  function addVesselSorting(doc = document) {
    const allTables = doc.querySelectorAll('table.comm-table-main-table');

    allTables.forEach(table => {
      const commContainer = table.closest('app-communication-detials, app-communication-details');
      if (!commContainer) return;

      if (table.getAttribute('data-tm-vessel-sort') === '1') return;

      const headers = table.querySelectorAll('thead th');
      if (headers.length >= 3) {
        const vesselHeader = headers[2];
        const headerText = vesselHeader.textContent.trim();

        if (headerText === 'Vessel' && !vesselHeader.querySelector('.tm-vessel-sort')) {
          const sortLink = doc.createElement('a');
          sortLink.className = 'tm-vessel-sort sort';
          sortLink.textContent = 'Vessel';
          sortLink.href = '#';
          sortLink.style.cssText = vesselHeader.style.cssText;

          sortLink.addEventListener('click', (e) => {
            e.preventDefault();
            sortTableByVessel(table, sortLink);
          });

          const originalStyle = vesselHeader.getAttribute('style') || '';
          vesselHeader.innerHTML = '';
          vesselHeader.appendChild(sortLink);
          if (originalStyle) {
            vesselHeader.setAttribute('style', originalStyle);
          }
        }
      }

      table.setAttribute('data-tm-vessel-sort', '1');
    });
  }

  function addQuantitySorting(doc = document) {
    if (!window.location.href.includes('/analysis-workflow/add-invoice/')) return;

    setTimeout(() => {
      const invoiceTables = doc.querySelectorAll('app-invoice-list table');

      invoiceTables.forEach(table => {
        if (table.getAttribute('data-tm-quantity-sort') === '1') return;

        const headers = table.querySelectorAll('thead th');
        if (headers.length >= 5) {
          const quantityHeader = headers[4];
          const headerText = quantityHeader.textContent.trim();

          if (headerText === 'Quantity' && !quantityHeader.querySelector('a.sort')) {
            const existingSortLink = table.querySelector('a.sort');
            const sortLink = doc.createElement('a');

            if (existingSortLink) {
              Array.from(existingSortLink.attributes).forEach(attr => {
                if (attr.name !== 'class') {
                  sortLink.setAttribute(attr.name, attr.value);
                }
              });
            }

            sortLink.className = 'sort';
            sortLink.textContent = 'Quantity';

            sortLink.addEventListener('click', (e) => {
              console.log('Quantity sort clicked');
              e.preventDefault();

              const currentClass = sortLink.className;
              let isAscending;
              if (currentClass.includes('ascending')) {
                sortLink.className = 'sort descending';
                isAscending = false;
              } else if (currentClass.includes('descending')) {
                sortLink.className = 'sort';
                return; // Reset to unsorted
              } else {
                sortLink.className = 'sort ascending';
                isAscending = true;
              }

              // Clear other sort indicators
              table.querySelectorAll('a.sort').forEach(link => {
                if (link !== sortLink) {
                  link.className = 'sort';
                }
              });

              // Sort the table
              sortTableByQuantity(table, isAscending);
              console.log('Sorted by quantity, ascending:', isAscending);
            });

            quantityHeader.innerHTML = '';
            quantityHeader.appendChild(sortLink);
          }
        }

        table.setAttribute('data-tm-quantity-sort', '1');
      });
    }, 3000);
  }

  function sortTableByQuantity(table, isAscending) {
    const tbody = table.querySelector('tbody');
    if (!tbody) return;

    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.sort((a, b) => {
      const aInput = a.cells[4]?.querySelector('input[id^="quantity_fo"]');
      const bInput = b.cells[4]?.querySelector('input[id^="quantity_fo"]');

      const aValue = parseFloat(aInput?.value || '0') || 0;
      const bValue = parseFloat(bInput?.value || '0') || 0;

      if (isAscending) {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });

    // Re-append sorted rows
    rows.forEach(row => tbody.appendChild(row));
  }

  function sortTableByVessel(table, sortLink) {
    const tbody = table.querySelector('tbody');
    if (!tbody) return;

    const rows = Array.from(tbody.querySelectorAll('tr'));
    const isAsc = !sortLink.classList.contains('asc');

    sortLink.classList.remove('asc', 'desc');
    sortLink.classList.add(isAsc ? 'asc' : 'desc');

    const otherSortLinks = table.querySelectorAll('.sort');
    otherSortLinks.forEach(link => {
      if (link !== sortLink) {
        link.classList.remove('asc', 'desc');
      }
    });

    rows.sort((a, b) => {
      const aVessel = a.cells[2]?.querySelector('textarea')?.value || a.cells[2]?.textContent || '';
      const bVessel = b.cells[2]?.querySelector('textarea')?.value || b.cells[2]?.textContent || '';

      const aText = aVessel.trim().toLowerCase();
      const bText = bVessel.trim().toLowerCase();

      if (isAsc) {
        return aText.localeCompare(bText);
      } else {
        return bText.localeCompare(aText);
      }
    });

    rows.forEach(row => tbody.appendChild(row));
  }


  function findBackLink(container) {
    const anchors = container.querySelectorAll('a');
    for (const a of anchors) {
      const t = (a.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase();
      if (t === 'back to dashboard') return a;
    }
    return null;
  }

  function findPrefixTextNode(container) {
    const walker = container.ownerDocument.createTreeWalker(
      container,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          if (!node.nodeValue) return NodeFilter.FILTER_REJECT;
          const parentLink = node.parentElement && node.parentElement.closest('a');
          if (parentLink) return NodeFilter.FILTER_REJECT;
          return node.nodeValue.indexOf(PREFIX) !== -1
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_SKIP;
        }
      }
    );
    return walker.nextNode();
  }

  function processBar(bar) {
    if (!bar || bar.getAttribute(MARK_ATTR) === '1') return;

    const link = findBackLink(bar);
    if (!link) return;

    if (bar.querySelector('.tm-account-name')) {
      bar.setAttribute(MARK_ATTR, '1');
      return;
    }

    const node = findPrefixTextNode(bar);
    if (!node) return;

    const text = node.nodeValue;
    const start = text.indexOf(PREFIX);
    if (start === -1) return;

    const afterPrefixOffset = start + PREFIX.length;
    const accountAndRest = node.splitText(afterPrefixOffset);
    if (!/\s$/.test(node.nodeValue)) node.nodeValue += ' ';

    let accountText = accountAndRest.nodeValue;
    const match = accountText.match(/^(.*?)(\.\s*)?$/);
    let accountCore = match ? match[1] : accountText;

    accountAndRest.splitText(accountCore.length);

    const span = node.ownerDocument.createElement('span');
    span.className = 'tm-account-name';
    span.textContent = accountAndRest.nodeValue.trim();

    accountAndRest.parentNode.replaceChild(span, accountAndRest);

    const next = span.nextSibling;
    if (!(next && next.nodeType === Node.TEXT_NODE && /^\s/.test(next.nodeValue))) {
      span.parentNode.insertBefore(node.ownerDocument.createTextNode(' '), next || link);
    }

    bar.setAttribute(MARK_ATTR, '1');
  }

  function processAll(root = document) {
    const bars = root.querySelectorAll(TARGET_SEL);
    bars.forEach(processBar);
    highlightSpecialCells(root);
    addVesselSorting(root);

    if (window.location.href.includes('/analysis-workflow/add-invoice/')) {
      addQuantitySorting(root);
    }

    return bars.length > 0;
  }

  let scheduled = false;
  function schedule(root) {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      processAll(root);
    });
  }

  function initObserver(doc = document) {
    const obs = new MutationObserver((muts) => {
      for (const m of muts) {
        if (m.type === 'childList') {
          for (const n of m.addedNodes) {
            if (n instanceof Element) {
              if (
                n.matches?.(TARGET_SEL) ||
                n.querySelector?.(TARGET_SEL) ||
                n.querySelector?.('td') ||
                n.matches?.('app-communication-detials') ||
                n.querySelector?.('app-communication-detials') ||
                n.matches?.('app-communication-details') ||
                n.querySelector?.('app-communication-details')
              ) {
                schedule(doc);
                return;
              }
            }
          }
        }
      }
      schedule(doc);
    });
    obs.observe(doc.body || doc.documentElement, { childList: true, subtree: true });
  }

  function retryProcessing() {
    if (retryCount >= MAX_RETRIES) return;

    retryCount++;
    const found = processAll(document);

    const commTables = document.querySelectorAll('table.comm-table-main-table');
    const needsVesselSort = Array.from(commTables).some(table => {
      const commContainer = table.closest('app-communication-detials, app-communication-details');
      return commContainer && table.getAttribute('data-tm-vessel-sort') !== '1';
    });

    let needsQuantitySort = false;

    if (!found || needsVesselSort) {
      setTimeout(retryProcessing, RETRY_DELAY);
    }
  }

  function initialize() {
    injectCSS(document);

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        processAll(document);
        retryProcessing();
      });
    } else {
      processAll(document);
      retryProcessing();
    }

    if (document.body) {
      initObserver(document);
    } else {
      const bodyObserver = new MutationObserver(() => {
        if (document.body) {
          bodyObserver.disconnect();
          initObserver(document);
        }
      });
      bodyObserver.observe(document.documentElement, { childList: true });
    }

    const globalObs = new MutationObserver((muts) => {
      for (const m of muts) {
        for (const node of m.addedNodes) {
          if (node instanceof HTMLIFrameElement && node.contentDocument) {
            try {
              injectCSS(node.contentDocument);
              processAll(node.contentDocument);
              initObserver(node.contentDocument);
            } catch (_) {}
          }
        }
      }
    });
    globalObs.observe(document.documentElement, { childList: true, subtree: true });
  }

  initialize();

})();