// ==UserScript==
// @name         Azure Portal Policy Column Width Fixer
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Sets column widths: 1st=700px, 2nd=500px, rest=200px in Azure Policy pages
// @author       You
// @match        *://sandbox*.*.portal.azure.net/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/556335/Azure%20Portal%20Policy%20Column%20Width%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/556335/Azure%20Portal%20Policy%20Column%20Width%20Fixer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const COLUMN_WIDTHS = {
        0: 700,  // First column
        1: 500,  // Second column
        default: 200  // All other columns
    };
    let fixCount = 0;
    let hasLogged = false;

    function getTargetWidth(index) {
        return COLUMN_WIDTHS[index] !== undefined ? COLUMN_WIDTHS[index] : COLUMN_WIDTHS.default;
    }

    function fixColumnWidths() {
        const headerRows = document.querySelectorAll('[role="row"][class*="DetailsHeader"]');
        const dataRows = document.querySelectorAll('[role="row"][class*="DetailsRow"]');

        // Log once when we find elements
        if (!hasLogged && (headerRows.length > 0 || dataRows.length > 0)) {
            console.log(`[Policy Fixer] Found ${headerRows.length} header rows, ${dataRows.length} data rows on ${window.location.hostname}`);
            hasLogged = true;
        }

        let fixed = 0;

        // Fix header columns
        headerRows.forEach(row => {
            const headers = row.querySelectorAll('[role="columnheader"]');
            headers.forEach((header, index) => {
                if (header.style.width) {
                    const targetWidth = getTargetWidth(index);
                    const currentWidth = parseFloat(header.style.width);
                    if (currentWidth !== targetWidth) {
                        header.style.width = `${targetWidth}px`;
                        fixed++;
                    }
                }
            });
        });

        // Fix data row cells
        dataRows.forEach(row => {
            const cells = row.querySelectorAll('[role="gridcell"]');
            cells.forEach((cell, index) => {
                if (cell.style.width) {
                    const targetWidth = getTargetWidth(index);
                    const currentWidth = parseFloat(cell.style.width);
                    if (currentWidth !== targetWidth) {
                        cell.style.width = `${targetWidth}px`;
                        fixed++;
                    }
                }
            });
        });

        if (fixed > 0) {
            fixCount++;
            console.log(`[Policy Fixer] ✓ Fixed ${fixed} columns (1st: 700px, 2nd: 500px, rest: 200px) on ${window.location.hostname}`);
        }

        return fixed;
    }

    // Run continuously
    setInterval(fixColumnWidths, 500);

    // Also watch for changes
    if (document.body) {
        const observer = new MutationObserver(fixColumnWidths);
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style']
        });
    }

    console.log('[Policy Fixer] Active on: ' + window.location.hostname);
})();
