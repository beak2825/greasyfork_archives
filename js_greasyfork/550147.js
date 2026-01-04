// ==UserScript==
// @license MIT
// @name        Published Google Sheets pubhtml link to XLSX file
// @namespace   ViolentmonkeyScripts
// @match       https://docs.google.com/spreadsheets/d/e/*/pubhtml*
// @grant       none
// @version     1.0
// @description Add a button on pubhtml pages to download the sheet as an XLSX file.
// @downloadURL https://update.greasyfork.org/scripts/550147/Published%20Google%20Sheets%20pubhtml%20link%20to%20XLSX%20file.user.js
// @updateURL https://update.greasyfork.org/scripts/550147/Published%20Google%20Sheets%20pubhtml%20link%20to%20XLSX%20file.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const ID = 'vm-download-xlsx-btn';
  if (document.getElementById(ID)) return;

  function buildDownloadUrl(href) {
    // Replace trailing /pubhtml and any query string with /pub?output=xlsx
    return href.replace(/\/pubhtml(\?.*)?$/, '/pub?output=xlsx');
  }

  function createButton() {
    const btn = document.createElement('button');
    btn.id = ID;
    btn.type = 'button';
    btn.textContent = 'Download XLSX';
    Object.assign(btn.style, {
      position: 'fixed',
      top: '12px',
      right: '12px',
      zIndex: 99999,
      padding: '8px 12px',
      borderRadius: '6px',
      border: 'none',
      boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
      background: '#1a73e8',
      color: '#fff',
      fontSize: '13px',
      cursor: 'pointer',
    });

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const downloadUrl = buildDownloadUrl(location.href);
      window.open(downloadUrl, '_blank');
    });

    document.body.appendChild(btn);
  }

  // Some pubhtml pages may load late; try to insert immediately and also after load.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createButton, { once: true });
  } else {
    createButton();
  }

  // If page dynamically replaces body, re-add button if needed.
  const mo = new MutationObserver(() => {
    if (!document.getElementById(ID) && location.href.includes('/pubhtml')) createButton();
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });
})();