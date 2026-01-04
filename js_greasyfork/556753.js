// ==UserScript==
// @name         Nuvid Upload Date
// @namespace    NuvidUploadDate
// @version      1.0
// @description  Replaces "XX days" ago with the exact upload date.
// @author       nereids
// @license      MIT
// @icon         https://icons.duckduckgo.com/ip3/www.nuvid.com.ico
// @match        https://www.nuvid.com/video/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/556753/Nuvid%20Upload%20Date.user.js
// @updateURL https://update.greasyfork.org/scripts/556753/Nuvid%20Upload%20Date.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function convertDaysToDate() {
        // Find the element containing "Added by ... XXXX days"
        const addedByDiv = document.querySelector('div.add-by');
        if (!addedByDiv) return;

        const text = addedByDiv.textContent.trim();
        const match = text.match(/(\d+)\s*days?$/);
        if (!match) return;

        const daysAgo = parseInt(match[1], 10);
        if (isNaN(daysAgo)) return;

        const uploadDate = new Date();
        uploadDate.setDate(uploadDate.getDate() - daysAgo);

        const formatted = uploadDate.toISOString().split('T')[0]; // YYYY-MM-DD

        // Create the new date span
        const dateSpan = document.createElement('span');
        dateSpan.textContent = ` / ${formatted}`;

        // Append right after the original text
        addedByDiv.appendChild(dateSpan);
    }

    // Run immediately
    convertDaysToDate();

    // Also run again in case the content loads dynamically
    const observer = new MutationObserver((mutations) => {
        if (document.querySelector('div.add-by')) {
            convertDaysToDate();
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();