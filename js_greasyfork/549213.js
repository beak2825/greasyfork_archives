// ==UserScript==
// @name        WebDoc - anpassad väntelista
// @namespace   http://tampermonkey.net/
// @version     1.8
// @description Anpassar och förifyller fält i "Sätt patienten på väntelistan"-dialogen på webdoc.atlan.se
// @author      Din Kollega
// @match       https://webdoc.atlan.se/*
// @grant       none
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/549213/WebDoc%20-%20anpassad%20v%C3%A4ntelista.user.js
// @updateURL https://update.greasyfork.org/scripts/549213/WebDoc%20-%20anpassad%20v%C3%A4ntelista.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- ANPASSNINGSBARA INSTÄLLNINGAR ---
    const synligaBokningstyper = [
        "Plan mottagning",
        "Telefon",
        "Admin",
        "Prickmottagning",
        "Hembesök",
    ];
    const forvaldBookingstyp = "Plan mottagning";

    const synligaEgenskaper = [
        "Enstaka",
        "Återkommande",
        "Administration",
        "Telefonkontakt",
    ];
    const forvaldEgenskap = "Enstaka";

    const synligaPrioriteter = [
        "Hög",
        "Medel",
        "Låg",
    ];
    const forvaldPrioritet = "Medel";

    const forvaldAnledningForsening = "Medicinskt orsakad väntan";

    // --- SLUT PÅ INSTÄLLNINGAR ---

    /**
     * Optimerad funktion för att dölja oönskade alternativ och eventuellt sätta förvalt värde.
     * @param {string} selectId - ID för <select>-elementet.
     * @param {string[]} synligaAlternativ - En array med texten för de alternativ som ska vara synliga.
     * @param {string} forvaltAlternativ - Texten för det alternativ som ska vara förvalt.
     */
    function anpassaSelectLista(selectId, synligaAlternativ, forvaltAlternativ) {
        const selectElement = document.getElementById(selectId);
        if (!selectElement) {
            console.warn(`Kunde inte hitta select-element med ID: ${selectId}`);
            return;
        }

        const synligaSet = new Set(synligaAlternativ);
        const currentSelectedText = selectElement.options[selectElement.selectedIndex].textContent.trim().replace(/\s+/g, ' ');

        // Dölj alla alternativ som inte finns i vår lista
        Array.from(selectElement.options).forEach(option => {
            const trimmedText = option.textContent.trim().replace(/\s+/g, ' ');
            if (trimmedText && trimmedText !== 'Välj...') {
                if (!synligaSet.has(trimmedText)) {
                    option.style.display = 'none';
                } else {
                    option.style.display = '';
                }
            }
        });

        // Sätt det förvalda alternativet ENDAST om "Välj..." är aktivt.
        if (currentSelectedText === 'Välj...' || currentSelectedText === '') {
            const optionToSelect = Array.from(selectElement.options).find(opt => opt.textContent.trim().replace(/\s+/g, ' ') === forvaltAlternativ);
            if (optionToSelect) {
                optionToSelect.selected = true;
            } else {
                console.warn(`Kunde inte hitta det förvalda alternativet "${forvaltAlternativ}" i listan med ID: ${selectId}`);
            }
        }
    }

    /**
     * Sätter ett förvalt värde för en select-lista baserat på textinnehållet, endast om inget är valt.
     * @param {string} selectId - ID för <select>-elementet.
     * @param {string} forvaldText - Texten för det alternativ som ska vara förvalt.
     */
    function setForvaltAlternativ(selectId, forvaldText) {
        const selectElement = document.getElementById(selectId);
        if (!selectElement) {
            console.warn(`Kunde inte hitta select-element med ID: ${selectId}`);
            return;
        }

        // Kontrollera om det redan finns ett valt värde
        const currentSelectedText = selectElement.options[selectElement.selectedIndex].textContent.trim();
        if (currentSelectedText === 'Välj...' || currentSelectedText === '') {
            const optionToSelect = Array.from(selectElement.options).find(opt => opt.textContent.trim() === forvaldText);
            if (optionToSelect) {
                optionToSelect.selected = true;
            } else {
                console.warn(`Kunde inte hitta alternativet "${forvaldText}" i listan med ID: ${selectId}`);
            }
        }
    }


    /**
     * Sätter datumet i datumfältet till en månad framåt i tiden.
     */
    function setFramtidaDatum() {
        const datumFalt = document.getElementById('BesoksDatum');
        if (!datumFalt) {
            console.warn('Kunde inte hitta datumfältet "BesoksDatum"');
            return;
        }

        const idag = new Date();
        idag.setMonth(idag.getMonth() + 1);

        const ar = idag.getFullYear();
        const manad = String(idag.getMonth() + 1).padStart(2, '0');
        const dag = String(idag.getDate()).padStart(2, '0');

        datumFalt.value = `${ar}-${manad}-${dag}`;
    }

    /**
     * Döljer fälten för remissinformation.
     */
    function taBortRemissFalt() {
        const dialog = document.getElementById('JQDialogDivWaitingList');
        if (!dialog) return;

        const allRows = dialog.querySelectorAll('tr');

        for (const row of allRows) {
            const rowText = row.textContent.trim();
            if (rowText.includes('Remiss från:') || rowText.includes('Remissdatum:')) {
                row.style.display = 'none';
            }
        }
    }

    /**
     * Huvudfunktionen som kör alla anpassningar när dialogrutan dyker upp.
     */
    async function korAnpassningar() {
        const bokningstypSelect = document.getElementById('bookingTypeSelector');
        if (!bokningstypSelect) {
            return;
        }

        // Check if the script has already run for this instance
        if (bokningstypSelect.dataset.customized) {
            return;
        }

        // Använd en Promise för att vänta på att bokningstypen ska vara redo
        const bokningstypRedo = new Promise(resolve => {
            const observer = new MutationObserver((mutationsList, observer) => {
                const element = document.getElementById('bookingTypeSelector');
                if (element && element.options.length > 5) {
                    observer.disconnect();
                    resolve();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        });

        await bokningstypRedo;

        // Anpassa listorna i den mest effektiva ordningen
        anpassaSelectLista('bookingTypeSelector', synligaBokningstyper, forvaldBookingstyp);
        anpassaSelectLista('egenskap', synligaEgenskaper, forvaldEgenskap);
        anpassaSelectLista('prioritet', synligaPrioriteter, forvaldPrioritet);

        // Sätt förvalt värde för "Anledning till försening"
        setForvaltAlternativ('reasonForDelay', forvaldAnledningForsening);

        // Sätt "Önskat besöksdatum"
        setFramtidaDatum();

        // Dölj remissfälten
        taBortRemissFalt();

        // Markera att vi har kört skriptet på denna instans genom att lägga till attributet.
        // Detta är säkrare än att lita på att det inte finns från början.
        bokningstypSelect.dataset.customized = 'true';
    }

    /**
     * Global observer som lyssnar efter när väntelistedialogen dyker upp.
     */
    function startObserver() {
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const dialog = document.getElementById('JQDialogDivWaitingList');
                    // Viktigt: Kör alltid anpassningarna när dialogen dyker upp.
                    // Dubbelkörning hanteras nu inuti korAnpassningar.
                    if (dialog) {
                        korAnpassningar();
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Starta observern när skriptet körs
    startObserver();

})();