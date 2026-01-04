// ==UserScript==
// @name        WebDoc - dölj och sortera om ikoner
// @namespace   http://tampermonkey.net/
// @version     2.9
// @description Döljer specifika ikoner, sorterar om de återstående enligt en prioriterad lista och skapar ett prydligt rutnät.
// @author      Gemini
// @match       https://webdoc.atlan.se/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/549215/WebDoc%20-%20d%C3%B6lj%20och%20sortera%20om%20ikoner.user.js
// @updateURL https://update.greasyfork.org/scripts/549215/WebDoc%20-%20d%C3%B6lj%20och%20sortera%20om%20ikoner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // *** ANPASSNING ***

    // 1. Lista med de exakta texterna för de ikoner som ska DÖLJAS.
    const labelsToHide = [
        "Operation", "Vaccination", "Ekon. övers.", "Provetikett",
        "Patientkort", "Adr. etikett", "FK 7804", "Diktera",
        "Avvikelse", "Kassa", "VGR Vårdval", "Svevac", "E-frikort"
    ];

    // 2. Prioriterad ordning för ikoner som ska visas FÖRST.
    const priorityOrder = [
        "Journal",
        "Dokument",
        "NPÖ",
        "Labportalen",
        "Tillväxt",
        "Varning",
        "Besök",
        "Anteckning",
        "Remiss",
        "Ladda upp fil",
        "Väntelista",
        "Påminnelse",
        "E-recept",
        "Pascal",
        "NLL",
        "Welch Allyn",
        "Brev",
        "SMS"
    ];

    // 3. Antal ikoner som ska visas per rad.
    const iconsPerRow = 6;

    // *** SLUT PÅ ANPASSNING ***

    function reorganizeIcons() {
        const iconTable = document.querySelector('table[data-test-id="leftMenuIconsTable"]');
        if (!iconTable || iconTable.dataset.reorganized) {
            return false;
        }

        const allIconCells = Array.from(iconTable.querySelectorAll('td.patientIconCell'));
        if (allIconCells.length === 0) {
            return false;
        }

        let visibleCells = [];
        allIconCells.forEach(cell => {
            const titleElement = cell.querySelector('b.patientIconTitle');
            if (titleElement) {
                const labelText = titleElement.textContent.trim();
                if (!labelsToHide.includes(labelText)) {
                    cell.sortLabel = labelText;
                    visibleCells.push(cell);
                }
            }
        });

        visibleCells.sort((a, b) => {
            const indexA = priorityOrder.indexOf(a.sortLabel);
            const indexB = priorityOrder.indexOf(b.sortLabel);

            if (indexA !== -1 && indexB !== -1) {
                return indexA - indexB;
            }
            if (indexA !== -1) {
                return -1;
            }
            if (indexB !== -1) {
                return 1;
            }
            return 0;
        });

        const tableBody = iconTable.querySelector('tbody');
        if (!tableBody) return false;

        tableBody.innerHTML = '';
        let newRow = null;

        // Modifierad loop för att lägga till ikoner från höger till vänster
        visibleCells.forEach((cell, index) => {
            if (index % iconsPerRow === 0) {
                newRow = document.createElement('tr');
                tableBody.appendChild(newRow);
            }
            if (newRow) {
                // Lägg till cellen i början av raden för att vända ordningen
                newRow.insertBefore(cell, newRow.firstChild);
            }
        });

        iconTable.dataset.reorganized = 'true';
        return true;
    }

    const observer = new MutationObserver((mutationsList, observer) => {
        reorganizeIcons();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    reorganizeIcons();
})();