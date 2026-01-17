// ==UserScript==
// @name         Google Scholar Profile Scraper
// @namespace    http://tampermonkey.net/
// @version      2026-01-17
// @description  Export Google Scholar Profile papers to CSV. Adds an export button to the profile page.
// @author       hasaki
// @match        https://scholar.google.com/citations?*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562864/Google%20Scholar%20Profile%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/562864/Google%20Scholar%20Profile%20Scraper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to extract data from the table
    function scrapeData() {
        // Select all rows in the publication table
        const rows = document.querySelectorAll('.gsc_a_tr');
        if (!rows.length) {
            alert('No papers found on this page.');
            return [];
        }

        const data = [];
        // CSV Header
        data.push(['Title', 'Authors', 'Venue', 'Cited By', 'Year', 'Link']);

        rows.forEach(row => {
            // Title and Link
            // We capture the full text of the title cell minus the author/venue info to include any tags (like CCF, Preprint)
            const titleCell = row.querySelector('.gsc_a_t');
            let title = '';
            let link = '';

            if (titleCell) {
                const titleAnchor = titleCell.querySelector('.gsc_a_at');
                link = titleAnchor ? titleAnchor.href : '';

                // Clone to safely manipulate
                const cellClone = titleCell.cloneNode(true);
                // Remove author/venue info (which are in .gs_gray)
                cellClone.querySelectorAll('.gs_gray').forEach(el => el.remove());
                // The remaining text is the Title plus any tags/badges
                title = cellClone.innerText.trim();
            }

            // Authors and Venue are usually in two div.gs_gray elements
            const grayDivs = row.querySelectorAll('.gs_gray');
            const authors = grayDivs.length > 0 ? grayDivs[0].innerText.trim() : '';
            const venue = grayDivs.length > 1 ? grayDivs[1].innerText.trim() : '';

            // Cited By count
            const citedByEl = row.querySelector('.gsc_a_ac');
            const citedBy = citedByEl ? citedByEl.innerText.trim() : '0';

            // Year
            const yearEl = row.querySelector('.gsc_a_y');
            const year = yearEl ? yearEl.innerText.trim() : '';

            // Helper to escape quotes for CSV format
            const escapeCsv = (text) => {
                if (!text) return '';
                // If text contains comma, quote, or newline, wrap in quotes and escape internal quotes
                if (text.includes(',') || text.includes('"') || text.includes('\n')) {
                    return '"' + text.replace(/"/g, '""') + '"';
                }
                return text;
            };

            data.push([
                escapeCsv(title),
                escapeCsv(authors),
                escapeCsv(venue),
                escapeCsv(citedBy),
                escapeCsv(year),
                escapeCsv(link)
            ]);
        });

        return data;
    }

    // Function to download data as CSV
    function downloadCSV(data) {
        if (data.length === 0) return;

        const csvContent = '\uFEFF' + data.map(e => e.join(",")).join("\n"); // Add BOM for Excel compatibility
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.setAttribute("href", url);

        // Generate filename with timestamp (YYYY-MM-DD_HH-MM-SS)
        const now = new Date();
        const dateStr = now.getFullYear() + '-' +
                       String(now.getMonth() + 1).padStart(2, '0') + '-' +
                       String(now.getDate()).padStart(2, '0');
        const timeStr = String(now.getHours()).padStart(2, '0') + '-' +
                       String(now.getMinutes()).padStart(2, '0') + '-' +
                       String(now.getSeconds()).padStart(2, '0');

        link.setAttribute("download", `google_scholar_export_${dateStr}_${timeStr}.csv`);

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Create and inject the button
    function addExportButton() {
        // Check if button already exists
        if (document.getElementById('gs-export-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'gs-export-btn';
        btn.innerText = '📥 Export to CSV';

        // Style the button
        Object.assign(btn.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: '9999',
            padding: '12px 20px',
            backgroundColor: '#1a73e8',
            color: 'white',
            border: 'none',
            borderRadius: '24px',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            fontSize: '14px',
            fontWeight: '500',
            fontFamily: 'Google Sans, Roboto, Arial, sans-serif',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 'normal' // Fix vertical alignment
        });

        // Hover effects
        btn.onmouseover = () => { btn.style.backgroundColor = '#1557b0'; };
        btn.onmouseout = () => { btn.style.backgroundColor = '#1a73e8'; };

        btn.onclick = () => {
            const data = scrapeData();
            if (data.length > 0) {
                downloadCSV(data);
            }
        };

        document.body.appendChild(btn);
    }

    // Run on load and observe changes (in case of dynamic loading)
    window.addEventListener('load', addExportButton);

    // Also try to add it immediately in case document is already ready
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        addExportButton();
    }

})();
