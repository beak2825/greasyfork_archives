// ==UserScript==
// @name         Kindle Book List Parser & Exporter
// @namespace    https://jovialbadger.co.uk/
// @version      0.1.1
// @description  Parse Kindle book list pages, track read status (only fully read), detect gaps in export list, and export results to CSV.
// @author       JovialBadger
// @license      GNU GPL V3
// @match        https://www.amazon.*/hz/mycd/digital-console/contentlist/booksAll/dateAsc/?pageNumber=*
// @grant        none
// @run-at       document-end
// @noframes
// @icon         https://jovialbadger.co.uk/beta_jb/assets/logo/letters_logo.svg
// @supportURL   https://github.com/JovialBadger/Kindle-Book-List-Exporter/issues
// @homepageURL  https://jovialbadger.co.uk/Kindle-Book-List-Exporter/
// @homepage     https://jovialbadger.co.uk/Kindle-Book-List-Exporter/
// @source       https://github.com/JovialBadger/Kindle-Book-List-Exporter
// @downloadURL https://update.greasyfork.org/scripts/558542/Kindle%20Book%20List%20Parser%20%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/558542/Kindle%20Book%20List%20Parser%20%20Exporter.meta.js
// ==/UserScript==

const storageKey = "parsedItems";

function exportStorageToCSV() {
  const stored = localStorage.getItem(storageKey);
  if (!stored) {
    console.warn("No data found in localStorage under key:", storageKey);
    return;
  }

  const data = JSON.parse(stored);
  const items = Array.isArray(data?.items) ? data.items : [];
  if (items.length === 0) {
    console.warn("No items to export.");
    return;
  }

  // Collect union of keys across all items
  const keySet = new Set();
  items.forEach(item => Object.keys(item).forEach(k => keySet.add(k)));

  // Prefer a stable, descriptive order, then add any extras
  const preferredOrder = [
    "itemId",
    "itemType",
    "readStatus",
    "title",
    "author",
    "acquiredDate",
    "imageUrl",
    "devices",
    "sharedWith",
    "pageRowLocation"
  ];
  const extraKeys = [...keySet].filter(k => !preferredOrder.includes(k)).sort();
  const headers = [...preferredOrder, ...extraKeys].filter(k => keySet.has(k));

  // Build CSV rows
  const csvRows = [];
  csvRows.push(headers.join(",")); // header row

  items.forEach(item => {
    const row = headers.map(h => {
      let val = item[h];

      if (Array.isArray(val)) {
        val = val.join(";"); // join arrays with semicolon
      } else if (val === undefined || val === null) {
        val = "";
      } else {
        val = String(val);
      }

      // Escape quotes for CSV
      return `"${val.replace(/"/g, '""')}"`;
    });
    csvRows.push(row.join(","));
  });

  const csvContent = csvRows.join("\n");

  // Trigger download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const dateStamp = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  link.setAttribute("href", url);
  link.setAttribute("download", `${storageKey}_${dateStamp}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function getTotalItems() {
  return getContentRange().total;
}


function getContentRange() {
  const el = document.querySelector('#CONTENT_COUNT');
  if (!el) return null;

  const text = el.textContent.trim();
  const match = text.match(/Showing\s+(\d+)\s+to\s+(\d+)\s+of\s+(\d+)\s+items/i);
  if (!match) return {
    start: -1,
    end: -1,
    total: -1
  };;

  return {
    start: parseInt(match[1], 10),
    end: parseInt(match[2], 10),
    total: parseInt(match[3], 10)
  };
}

function getItemsPerPage() {
  const range = getContentRange();
  if (!range) return null;
  return 25;//range.end - range.start + 1; // number of items shown on this page
}

function getPageItemDistribution() {
  const range = getContentRange();
  if (!range) return null;

  const totalItems = range.total;
  const itemsPerPage = getItemsPerPage();

  const fullPages = Math.floor(totalItems / itemsPerPage);
  const remainder = totalItems % itemsPerPage;
  const lastPageItems = remainder === 0 ? itemsPerPage : remainder;
  const totalPages = remainder === 0 ? fullPages : fullPages + 1;

  return {
    itemsPerPage,
    fullPages,
    lastPageItems,
    totalPages,
    totalItems
  };
}


function getLastPageNumber() {
  return getPageItemDistribution().totalPages;
}

function changePage(data, next = -1){
  const pageNo = getPageNumber();
  const lastPageNo = getLastPageNumber();
  const gaps = findPageGaps(data.pageRowLocation);
  // → [3]   (page 3 is missing in this example)
  let completeResult = localStorage.getItem(storageKey+"-COMPLETE") * 1;
  //let completeResult = complete ? complete : 0;
  let nextPage = pageNo + 1;
  if (gaps.length > 0 && !gaps.includes(nextPage)) {
    nextPage = gaps[0];
    completeResult = 0;
  }
  if(next > -1 && completeResult === -1){
    nextPage = next;
  }
  if(gaps.length === 0 && completeResult !== 1){
    exportStorageToCSV();
    completeResult = 1;
    localStorage.setItem(storageKey+"-COMPLETE", completeResult);
  }
  if(nextPage <= lastPageNo && completeResult !== 1){
    setTimeout(function() {
      const hostName = window.location.hostname;
      window.location = "https://"+hostName+"/hz/mycd/digital-console/contentlist/booksAll/dateAsc/?pageNumber=" + (nextPage||1);
    }, 300);
    return;
  }
  createButton(data.pageRowLocation.length);
}

function reCheckAllPages(){
  localStorage.setItem(storageKey+"-COMPLETE", -1);
  let stored = localStorage.getItem(storageKey);
  let data = stored ? JSON.parse(stored) : { items: [], pageRowLocation: [] };
  data.pageRowLocation= [];
  localStorage.setItem(storageKey, JSON.stringify(data));
  changePage(data, 1);
}
function createButton(num = -1){
  const btnRestart = document.createElement('button');
  btnRestart.id = 'topButton';
  const totItems = getTotalItems();
  btnRestart.textContent = totItems === num ? 'Recheck All Pages' : 'Recheck Pages - Items Missing (' + num + '/' + totItems + ')';
  document.body.prepend(btnRestart);
  btnRestart.addEventListener("click", reCheckAllPages, false); //where func is your function name
  const reDownload = document.createElement('button');
  reDownload.id = 'topButton';
  reDownload.textContent = 'Re-Download Book List';
  document.body.prepend(reDownload);
  reDownload.addEventListener("click",exportStorageToCSV, false); //where func is your function name
}
const myInterval = setInterval(fireAfterSelector, 500);

const _selector = "ListLayout-module_table";
let attempts = 0;
const maxAttempts = 50; // e.g. stop after ~15 seconds (50 * 300ms)

function fireAfterSelector() {
  const selectorElems = document.querySelectorAll("[class^=" + _selector + "]");
  attempts++;
  if (selectorElems.length > 0){
    stopCheck();
    const rows = selectorElems[0].querySelectorAll('tr.ListItem-module_row__3orql');
    parseRowsWithPage(rows);
  } else if (attempts >= maxAttempts) {
    console.warn("Selector not found after max attempts, stopping interval.");
    stopCheck();
  }
}

function stopCheck() {
  clearInterval(myInterval);
}

function parseTableRow(rowElement, rowIndex, pageNumber) {
  const obj = {};

  // Extract unique ID from checkbox input
  const checkbox = rowElement.querySelector('input[type="checkbox"]');
  if (checkbox) {
    obj.itemId = checkbox.id.split(':')[0];
    obj.itemType = checkbox.id.split(':')[1];
    obj.title = checkbox.nextElementSibling.getAttribute('aria-label');
  }

  // Extract image URL
  const img = rowElement.querySelector('img');
  if (img) {
    obj.imageUrl = img.src;
  }

  // Extract title text
  const titleEl = rowElement.querySelector('.digital_entity_title div[role="heading"]');
  if (titleEl) {
    obj.title = titleEl.textContent.trim();
  }

  // Extract author(s)
  const authorEl = rowElement.querySelector('[id^="content-author"]');
  if (authorEl) {
    obj.author = authorEl.textContent.trim();
  }

  // Extract acquired date
  const acquiredEl = rowElement.querySelector('[id^="content-acquired-date"]');
  if (acquiredEl) {
    obj.acquiredDate = acquiredEl.textContent.replace('Acquired on', '').trim();
  }

  // Extract devices
  const deviceEls = rowElement.querySelectorAll('.popover-device-name');
  if (deviceEls.length > 0) {
    obj.devices = Array.from(deviceEls).map(el => el.textContent.trim());
  }

  // Extract shared-with info
  const sharedEl = rowElement.querySelector('[id^="content-shared"]');
  if (sharedEl) {
    obj.sharedWith = sharedEl.textContent.replace('Shared with', '').trim();
  }

  // Extract read status
  const readEl = rowElement.querySelector('#content-read-badge');
  if (readEl) {
    obj.readStatus = readEl.textContent.trim();
  }

  // Add page + row location
  obj.pageRowLocation = `${pageNumber}-${rowIndex + 1}`;

  return obj;
}

function parseRowsWithPage(rows) {
  const pageNumber = getPageNumber();

  // Load existing data from localStorage
  let stored = localStorage.getItem(storageKey);
  let data = stored ? JSON.parse(stored) : { items: [], pageRowLocation: [] };

  const seenIds = new Set(data.items.map(item => item.itemId));

  rows.forEach((row, index) => {
    const obj = parseTableRow(row, index, pageNumber);
    if (!seenIds.has(obj.itemId)) {
      seenIds.add(obj.itemId);
      data.items.push(obj);
    }
    if(!data.pageRowLocation.includes(obj.pageRowLocation)){
      data.pageRowLocation.push(obj.pageRowLocation);
    }
  });

  // Save back to localStorage
  localStorage.setItem(storageKey, JSON.stringify(data));

  console.log("Updated storage:", data);
  changePage(data);
  return data;
}
function getPageNumber(){
  return (new URLSearchParams(window.location.search).get('pageNumber') * 1)||1;
}

function findPageGaps(pageRowLocation) {
  // Find min and max page
  const minPage = 1;
  const maxPage = getLastPageNumber();
  if (!Array.isArray(pageRowLocation) || pageRowLocation.length === 0) {
    return Array.from({length: maxPage}, (_, i) => i+1);
  }
 // if (!Array.isArray(pageRowLocation) || pageRowLocation.length === 0) pageRowLocation= ["0-0"];

  // Extract page numbers from entries like "1-5"
  const pages = pageRowLocation.map(loc => parseInt(loc.split("-")[0], 10));

  // Collect unique pages that are present
  const presentPages = new Set(pages);

  // Find missing pages in the range
  const gaps = [];
  for (let p = minPage; p <= maxPage; p++) {
    if (!presentPages.has(p)) {
      gaps.push(p);
    }
  }
  return gaps;
}
