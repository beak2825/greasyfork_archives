// ==UserScript==
// @name         UWU Logs - Useful w/o Blood-Queen
// @namespace    https://uwu-logs.xyz/
// @version      1.0
// @author       Nikrozja powered by AI
// @description  Adds column "Useful w/o BQ" = Useful - Blood-Queen Lana'thel
// @match        https://uwu-logs.xyz/reports/*/damage/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563670/UWU%20Logs%20-%20Useful%20wo%20Blood-Queen.user.js
// @updateURL https://update.greasyfork.org/scripts/563670/UWU%20Logs%20-%20Useful%20wo%20Blood-Queen.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('UWU script loaded');

    function parseNumber(text) {
        if (!text) return 0;
        return parseInt(text.replace(/\s+/g, ''), 10) || 0;
    }

    function run() {
        const table = document.querySelector('table.add-player-rank');
        if (!table) {
            console.log('UWU: table not found yet');
            return;
        }

        const headerRow = table.querySelector('thead tr');
        if (!headerRow) return;

        const headers = Array.from(headerRow.children);

        if (headers.some(h => h.textContent.trim() === 'Useful w/o BQ')) {
            console.log('UWU: column already exists');
            return;
        }

        const usefulIndex = headers.findIndex(h => h.textContent.trim() === 'Useful');
        const bqIndex = headers.findIndex(h => h.textContent.trim() === "Blood-Queen Lana'thel");

        if (usefulIndex === -1 || bqIndex === -1) {
            console.log('UWU: required columns not found');
            return;
        }

        const th = document.createElement('th');
        th.textContent = 'Useful w/o BQ';
        headers[usefulIndex].after(th);

        table.querySelectorAll('tbody tr').forEach(row => {
            const cells = Array.from(row.children);

            const useful = parseNumber(cells[usefulIndex]?.textContent);
            const bq = parseNumber(cells[bqIndex]?.textContent);

            const td = document.createElement('td');
            td.className = 'total-cell';
            td.textContent = (useful - bq).toLocaleString('en-US');

            cells[usefulIndex].after(td);
        });

        console.log('UWU: column Useful w/o BQ added');
    }

    const interval = setInterval(() => {
        if (document.querySelector('table.add-player-rank')) {
            clearInterval(interval);
            run();
        }
    }, 300);
})();