// ==UserScript==
// @name         Arson Rurality & Flammability Helper
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Match crime names to a published Google Sheet row and display columns 4 and 6 next to the title.
// @author       KingLouisCLXXII [2070312]
// @match        https://www.torn.com/page.php?sid=crimes*
// @match        https://www.torn.com/loader.php?sid=crimes*
// @grant        GM_xmlhttpRequest
// @connect      docs.google.com
// @connect      googleusercontent.com
// @connect      doc-08-0s-sheets.googleusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/556131/Arson%20Rurality%20%20Flammability%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/556131/Arson%20Rurality%20%20Flammability%20Helper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==============================
    // CONFIG
    // ==============================
    // Your published URL:
    // https://docs.google.com/spreadsheets/d/e/2PACX-1vTZFpyrREJMqORZfK4vPg6xK5B5VUsqCtexxzYTK9X5JAfjnWBwQPbVZI_kcgazgair0EspRI51DVme/pubhtml?gid=738243478&single=true
    //
    // Convert it to CSV output by swapping `pubhtml` -> `pub` and adding `&output=csv`:
    const SHEET_CSV_URL =
        'https://docs.google.com/spreadsheets/d/e/2PACX-1vTZFpyrREJMqORZfK4vPg6xK5B5VUsqCtexxzYTK9X5JAfjnWBwQPbVZI_kcgazgair0EspRI51DVme/pub?gid=738243478&single=true&output=csv';

    // If the first row is headers, leave this true
    const HAS_HEADER_ROW = true;

    // ==============================
    // INTERNALS
    // ==============================
    let lookupByName = null;
    let sheetLoaded = false;

    function log(...args) {
        console.log('[Crimes Sheet Lookup]', ...args);
    }

    // Simple CSV parser that supports quoted fields with commas
    function parseCSV(text) {
        const rows = [];
        let row = [];
        let field = '';
        let inQuotes = false;

        for (let i = 0; i < text.length; i++) {
            const c = text[i];
            const next = text[i + 1];

            if (inQuotes) {
                if (c === '"' && next === '"') {
                    // Escaped quote
                    field += '"';
                    i++;
                } else if (c === '"') {
                    inQuotes = false;
                } else {
                    field += c;
                }
            } else {
                if (c === '"') {
                    inQuotes = true;
                } else if (c === ',') {
                    row.push(field);
                    field = '';
                } else if (c === '\r') {
                    // ignore, handle \n
                } else if (c === '\n') {
                    row.push(field);
                    rows.push(row);
                    row = [];
                    field = '';
                } else {
                    field += c;
                }
            }
        }

        // last field / row
        if (field.length > 0 || row.length > 0) {
            row.push(field);
            rows.push(row);
        }

        return rows;
    }

    function loadSheet() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: SHEET_CSV_URL,
                onload: function (response) {
                    try {
                        const csv = response.responseText;
                        const rows = parseCSV(csv);
                        const map = new Map();

                        rows.forEach((cols, idx) => {
                            if (!cols || cols.length === 0) return;
                            if (HAS_HEADER_ROW && idx === 0) return;

                            // 1-based: col1 = index 0, col4 = index 3, col6 = index 5
                            const col1 = (cols[0] || '').trim();
                            const col4 = cols[3] || '';
                            const col6 = cols[5] || '';

                            if (!col1) return;

                            const key = col1.toLowerCase();
                            map.set(key, { col4, col6 });
                        });

                        log('Loaded sheet rows into map:', map.size);
                        resolve(map);
                    } catch (e) {
                        log('Error parsing CSV:', e);
                        reject(e);
                    }
                },
                onerror: function (err) {
                    log('Error loading sheet CSV:', err);
                    reject(err);
                }
            });
        });
    }

    function makeBadgeText(row) {
        const v4 = String(row.col4 || '').trim();
        const v6 = String(row.col6 || '').trim();

        const left  = v4 ? `${v4}R` : '';
        const right = v6 ? `${v6}F` : '';

        if (left && right) return `${left} | ${right}`;
        if (left) return left;
        if (right) return right;
        return '';
    }

    function decorateTitleElements() {
        if (!sheetLoaded || !lookupByName) return;

        const nodes = document.querySelectorAll('.titleAndScenario___uWExi');
        nodes.forEach(node => {
            if (node.dataset.tmSheetProcessed === '1') return;
            node.dataset.tmSheetProcessed = '1';

            const firstDiv = node.querySelector('div');
            if (!firstDiv) return;

            const name = firstDiv.textContent.trim();
            if (!name) return;

            const key = name.toLowerCase();
            const row = lookupByName.get(key);
            if (!row) {
                // log(`No match for "${name}"`);
                return;
            }

            const badgeText = makeBadgeText(row);
            if (!badgeText) return;

            const span = document.createElement('span');
            span.textContent = badgeText;
            span.style.marginLeft = '6px';
            span.style.padding = '1px 4px';
            span.style.borderRadius = '4px';
            span.style.fontSize = '11px';
            span.style.background = 'rgba(0,0,0,0.4)';
            span.style.color = '#fff';
            span.style.display = 'inline-block';
            span.style.verticalAlign = 'middle';

            firstDiv.appendChild(span);
        });
    }

    function setupObserver() {
        // Initial run
        decorateTitleElements();

        // React/virtual list support
        const observer = new MutationObserver(() => {
            decorateTitleElements();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    async function init() {
        try {
            lookupByName = await loadSheet();
            sheetLoaded = true;
            setupObserver();
        } catch (e) {
            log('Failed to initialize:', e);
        }
    }

    window.addEventListener('load', () => {
        setTimeout(init, 1000);
    });
})();
