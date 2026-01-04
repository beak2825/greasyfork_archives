// ==UserScript==
// @name         XenForo Watched Threads Backup (All Pages, Plain URLs)
// @namespace    https://simpcity.cr/
// @version      0.4
// @description  Export ALL watched thread URLs across all watched-threads pages as a plain text file.
// @author       You
// @license      MIT
// @match        https://simpcity.cr/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/550027/XenForo%20Watched%20Threads%20Backup%20%28All%20Pages%2C%20Plain%20URLs%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550027/XenForo%20Watched%20Threads%20Backup%20%28All%20Pages%2C%20Plain%20URLs%29.meta.js
// ==/UserScript==

(function () {
'use strict';

const BUTTON_ID = "xf-export-urls";

function createButton() {
if (document.getElementById(BUTTON_ID)) return;
const btn = document.createElement('button');
btn.id = BUTTON_ID;
btn.textContent = 'Export Watched URLs (All Pages)';
Object.assign(btn.style, {
position: 'fixed',
right: '20px',
bottom: '20px',
zIndex: 9999,
padding: '10px 14px',
background: '#0b74de',
color: '#fff',
border: 'none',
borderRadius: '6px',
cursor: 'pointer'
});
btn.addEventListener('click', exportAllPages);
document.body.appendChild(btn);
}

function getThreadUrls(doc) {
const anchors = doc.querySelectorAll('a[href*="/threads/"]');
const urls = [];
anchors.forEach(a => {
const href = a.href;
// Only include real thread pages (skip ?unread, anchors, etc.)
if (/\/threads\/[^/]+\.\d+\/?$/.test(href)) {
if (!urls.includes(href)) {
urls.push(href);
}
}
});
return urls;
}

function getMaxPage() {
let max = 1;
document.querySelectorAll('a[href*="page="]').forEach(a => {
const m = a.href.match(/page=(\d+)/);
if (m) {
const num = parseInt(m[1], 10);
if (num > max) max = num;
}
});
return max;
}

async function fetchPage(url) {
const res = await fetch(url, { credentials: 'same-origin' });
const text = await res.text();
return new DOMParser().parseFromString(text, "text/html");
}

async function exportAllPages() {
const btn = document.getElementById(BUTTON_ID);
btn.disabled = true;
btn.textContent = "Collecting...";

const base = location.href.split("?")[0];
const maxPage = getMaxPage();
const allUrls = new Set();

// page 1 (current page)
getThreadUrls(document).forEach(u => allUrls.add(u));

// remaining pages
for (let p = 2; p <= maxPage; p++) {
btn.textContent = `Collecting... (page ${p}/${maxPage})`;
const pageUrl = `${base}?page=${p}`;
try {
const doc = await fetchPage(pageUrl);
getThreadUrls(doc).forEach(u => allUrls.add(u));
} catch (e) {
console.error("Failed to fetch page", p, e);
break;
}
}

// Export
const text = Array.from(allUrls).join("\n");
const blob = new Blob([text], { type: "text/plain" });
const a = document.createElement("a");
a.href = URL.createObjectURL(blob);
a.download = "watched-threads.txt";
a.click();

btn.disabled = false;
btn.textContent = "Export Watched URLs (All Pages)";
}

createButton();
})();