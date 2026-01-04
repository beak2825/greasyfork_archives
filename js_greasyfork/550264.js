// ==UserScript==
// @name         WebDoc - Markera restnoterade läkemedel
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Markerar restnoterade läkemedel i autocomplete-listan baserat på global window.RESTNOTERINGAR (injicerad av Data Provider-scriptet).
// @author       Din Kollega
// @match        https://webdoc.atlan.se/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/550264/WebDoc%20-%20Markera%20restnoterade%20l%C3%A4kemedel.user.js
// @updateURL https://update.greasyfork.org/scripts/550264/WebDoc%20-%20Markera%20restnoterade%20l%C3%A4kemedel.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const LOGTAG = '[Restnoteringar Autocomplete]';
    const DEBUG = false; // 🔁 Sätt till true för att felsöka

    function dlog(...args) {
        if (DEBUG) console.log(LOGTAG, ...args);
    }

    /**
     * Väntar på att window.RESTNOTERINGAR ska vara tillgänglig (max 8 sekunder).
     */
    async function waitForRestnoteringar() {
        const timeout = 8000;
        const start = Date.now();

        while (!(window.RESTNOTERINGAR && Array.isArray(window.RESTNOTERINGAR) && window.RESTNOTERINGAR.length > 0)) {
            if (Date.now() - start > timeout) {
                dlog("⏳ Timeout: window.RESTNOTERINGAR kunde inte laddas i tid.");
                return false;
            }
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        dlog(`✅ RESTNOTERINGAR är tillgänglig med ${window.RESTNOTERINGAR.length} poster.`);
        return true;
    }

    /**
     * Genererar varningstext baserat på start- och slutdatum.
     * @param {string|null} startdatum
     * @param {string|null} slutdatum
     * @returns {string}
     */
    function genereraVarningstext(startdatum, slutdatum) {
        if (!startdatum) return "Restnoterat (datum saknas)";

        if (slutdatum && slutdatum.trim() !== "") {
            return `Restnoterat under perioden ${startdatum} - ${slutdatum}`;
        } else {
            return `Restnoterat fr. o. m. ${startdatum} tillsvidare.`;
        }
    }

    /**
     * Markerar rader med restnoterade läkemedel i autocomplete-listan.
     */
    async function markRestnoterade() {
        const ready = await waitForRestnoteringar();
        if (!ready) return;

        const autocompleteList = document.getElementById('ui-id-2');
        if (!autocompleteList || autocompleteList.style.display === 'none') {
            dlog("Autocomplete-listan är inte synlig.");
            return;
        }

        const items = autocompleteList.querySelectorAll('li.ui-menu-item');

        items.forEach(item => {
            const link = item.querySelector('a');
            if (!link || link.dataset.restnoteradProcessed) return;

            const tds = Array.from(link.querySelectorAll('td'));
            const match = window.RESTNOTERINGAR.find(entry => {
                return tds.some(td => {
                    const text = td.textContent.trim();
                    return text.startsWith(entry.varunummer + ' ') || text === entry.varunummer;
                });
            });

            if (match) {
                // Applicera strikethrough på originaltext
                tds.forEach(td => {
                    td.style.textDecoration = 'line-through';
                    td.style.color = '#888';
                });

                // Skapa varningsrad
                const table = link.querySelector('table');
                if (table) {
                    const newRow = document.createElement('tr');
                    const newCell = document.createElement('td');
                    newCell.colSpan = 5;
                    newCell.style.color = '#555';
                    newCell.style.fontSize = '0.85em';
                    newCell.style.paddingTop = '4px';
                    newCell.style.fontWeight = 'bold';

                    const varningstext = genereraVarningstext(match.startdatum, match.slutdatum);
                    newCell.textContent = varningstext;

                    table.appendChild(newRow);
                    newRow.appendChild(newCell);
                }

                link.dataset.restnoteradProcessed = 'true';
                dlog("✅ Markerade restnoterat läkemedel:", match.varunummer);
            }
        });
    }

    /**
     * Observerar när autocomplete-listan visas eller uppdateras.
     */
    function startObserver() {
        const observer = new MutationObserver(() => {
            const list = document.getElementById('ui-id-2');
            if (list && list.style.display !== 'none') {
                markRestnoterade();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style']
        });

        // Kör en gång direkt vid start
        markRestnoterade();
    }

    // Starta allt
    startObserver();
})();