// ==UserScript==
// @name         Paradb Download Button
// @version      0.1
// @description  Add download button to paradb song list. Sometimes the bulk download misses certain songs, use this button to prevent missing downloads.
// @author       barryZZJ
// @namespace    https://github.com/barryZZJ
// @match        http*://paradb.net/*
// @icon         https://paradb.net/icon.png
// @run-at document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559884/Paradb%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/559884/Paradb%20Download%20Button.meta.js
// ==/UserScript==

function copyClassList (sourceElem, targetElem) {
  let classList = sourceElem.classList;
  for (const cls of classList) {
    targetElem.classList.add(cls);
  }
}

function insertDownloadHeader (table) {
  let headerRow = table.querySelector('thead tr');
  if (!headerRow) return;
  let downloadHeader = document.createElement('th');
  downloadHeader.style = 'width:calc(8px * 10)';
  copyClassList(headerRow.querySelector('th'), downloadHeader);
  let downloadHeaderSpan = document.createElement('span');
  downloadHeaderSpan.textContent = '⭳';
  copyClassList(headerRow.querySelector('th span'), downloadHeaderSpan);

  downloadHeader.appendChild(downloadHeaderSpan);
  headerRow.appendChild(downloadHeader);
}

function insertDownloadButtons(table, row) {
  let mapId = row.querySelector('td a')?.getAttribute('href')?.split('/').pop();
  if (!mapId) return;
  let downloadCell = document.createElement('td');
  copyClassList(row.querySelector('td'), downloadCell);

  let downloadLink = document.createElement('a');
  downloadLink.href = `/api/maps/${mapId}/download`;
  copyClassList(row.querySelectorAll('td a')[1], downloadLink);
  downloadCell.appendChild(downloadLink);

  let downloadSpan = document.createElement('span');
  downloadSpan.textContent = '⭳';
  copyClassList(row.querySelector('td a span'), downloadSpan);
  downloadLink.appendChild(downloadSpan);

  row.appendChild(downloadCell);
}

(function () {
  'use strict';

  let table = document.querySelector('table');
  if (!table) return;

  let observer = new MutationObserver((mutationsList, observer) => {
    for (let mutation of mutationsList) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        if (table.querySelector('tbody tr')) {
          if (table.querySelector('th:last-child')?.textContent !== '⭳') {
            insertDownloadHeader(table);
          }
          for (const row of mutation.addedNodes) {
            if (row.nodeType === Node.ELEMENT_NODE && row.tagName === 'TR') {
              if (row.querySelector('td:last-child a')?.getAttribute('href')?.includes('/download')) {
                continue; // Download button already exists
              }
              insertDownloadButtons(table, row);
            }
          }
        }
      }
    }

  });
  observer.observe(table, { childList: true, subtree: true });

})();