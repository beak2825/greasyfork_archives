// ==UserScript==
// @name         Chainwise Optimalisatie Statusoverzichten
// @namespace    http://tampermonkey.net/
// @version      2025.1.1
// @description  Mutaties aan Status overzichten in Chainwise zodat het overzichterlijker is.
// @author       Gijs Hofman
// @match        https://heldertelecom.chainwisehosted.nl/modules/helpdesk/statusoverzicht_calls_vw.asp*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555428/Chainwise%20Optimalisatie%20Statusoverzichten.user.js
// @updateURL https://update.greasyfork.org/scripts/555428/Chainwise%20Optimalisatie%20Statusoverzichten.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // -----------------------------------------------------------
    // CONFIGURATIE
    // -----------------------------------------------------------

    const TABEL_SELECTOR = 'table.ListBody.fixed-header';

    // Kolomtitels die VOLLEDIG verborgen moeten worden. (Spaties en hoofdletters worden genegeerd)
    const KOLOM_TITELS_OM_TE_VERBERGEN = [
        "binnen deadline",
        "totaal alle statussen", // Deze wordt nog steeds verborgen, maar niet meer gebruikt voor de som
        "gereed",
        "gereed vol",
        "eind arc",
        "vrp",
        "exa"
    ];

    // Titels agressief opschonen voor vergelijking (alle spaties en hoofdletters verwijderd)
    const VERBERG_TITELS_SCHOON = KOLOM_TITELS_OM_TE_VERBERGEN.map(t => t.replace(/\s/g, '').toLowerCase());

    // RIJ-TITELS die VOLLEDIG verborgen moeten worden (gebaseerd op de tekst in de EERSTE cel)
    const RIJ_TITELS_OM_TE_VERBERGEN = [
        "totaal",
        "ticket soorten",
        "administratie",
        "bestellingen",
        "engineering",
        "nieuw/ opzegging/ aanpassing - oc | vast",
        "nieuw/ opzegging/ aanpassing - overige | vast",
        "nieuw/ opzegging/ verlenging/ np | mobiel",
        "project",
        //"storing / issue",
        "verzoek binnendienst",
        "verzoek servicedesk",
        "werkzaamheden intern",
        "Uitvoerders",
        "sales am",
        "sales ondersteuning",
        "verlenging en nieuw",
        " "
    ];

    // Titels agressief opschonen voor rij-vergelijking
    const VERBERG_RIJEN_SCHOON = RIJ_TITELS_OM_TE_VERBERGEN.map(t => t.replace(/\s/g, '').toLowerCase());


    const INDEX_UITVOERDER = 0;
    const LAATSTE_KOLOM_INDEX = 13; // Index van de lege kolom

    // Configuratie Rijen (Markering)
    const NAAM_GIJS = 'Gijs Hofman';
    const KLEUR_GIJS_BG = '#cfe2ff';
    const KLEUR_GIJS_RAND = '#0dcaf0';

    const NAAM_SERVICEDESK = 'Afdeling Servicedesk';
    const KLEUR_SD_BG = '#ffc107';
    const KLEUR_SD_RAND = '#b28704';

    const NAAM_TICKET = 'storing / issue';
    const KLEUR_TI_BG = '#f5d7f3';
    const KLEUR_TI_RAND = '#a893a7';

    // NIEUWE CONFIGURATIE VOOR BEREKENINGEN
    // TOTAAL: De unieke keywords die we willen meetellen. De logica zoekt ALLE kolommen die deze bevatten.
    const TOTAAL_SUM_KEYWORDS = ['start', 'nwstart', 'nw', 'beh', 'ing', 'wor'];
    // NIEUW: De keywords die we alleen voor de 'NIEUW' teller willen gebruiken (start en NWstart).
    const NIEUW_SUM_KEYWORDS = ['start', 'nwstart'];


    // -----------------------------------------------------------
    // HULPFUNCTIES
    // -----------------------------------------------------------

    function cleanTitle(text) {
        if (!text) return '';
        // Verwijder alle whitespace (inclusief &nbsp; en normale spaties) en zet om naar kleine letters
        return text.replace(/\s/g, '').toLowerCase();
    }

    /**
     * Haalt het getal uit een cel.
     * Zoekt expliciet naar het getal in de <a> tag, omdat dit de zichtbare teller is
     * in de meeste ticketcellen. Dit voorkomt het oppakken van verborgen, onjuiste
     * totaaltellingen in de TD.
     * @param {HTMLElement} cell
     * @returns {number} Het gevonden getal, anders 0.
     */
    function getCountFromCell(cell) {
        if (!cell) return 0;

        let textToParse;

        // Gebruik querySelector om de <a> tag overal in de cel te vinden.
        // Dit is de meest betrouwbare bron voor het ZICHTBARE ticket-aantal.
        const linkElement = cell.querySelector('a');

        if (linkElement) {
            // Als er een link is, gebruiken we ALLEEN de tekst van die link.
            textToParse = linkElement.textContent.trim();
        } else {
             // Als er geen <a> is (bijvoorbeeld in een totaalrij zonder link),
             // vallen we terug op de gehele cel tekst.
             textToParse = cell.textContent.trim();
        }

        // Zoek naar de eerste reeks cijfers (getallen) en parse deze.
        const match = textToParse.match(/\d+/);

        const count = match ? parseInt(match[0], 10) : 0;
        return isNaN(count) ? 0 : count;
    }

    /**
     * Zoekt de indexen van alle kolommen op basis van een array van keywords in de header.
     * @param {HTMLElement} table
     * @param {string[]} keywords - Array van gezochte keywords (e.g., ['start', 'nwstart'])
     * @returns {number[]} Array van gevonden indexen.
     */
    function findColumnIndicesByKeywords(table, keywords) {
        const headerRow = table.querySelector('thead tr');
        if (!headerRow) return [];

        const targetIndices = [];
        const cleanKeywords = keywords.map(cleanTitle);

        headerRow.querySelectorAll('td').forEach((th, index) => {
            const titelSchoneVersie = cleanTitle(th.textContent);

            // Check of de schoongemaakte titel EEN van de keywords bevat
            const isMatch = cleanKeywords.some(keyword => titelSchoneVersie.includes(keyword));

            if (isMatch) {
                targetIndices.push(index);
            }
        });

        // Gebruik een Set om unieke indexen te garanderen (hoewel de logic al uniek zou moeten zijn)
        return Array.from(new Set(targetIndices));
    }

    // -----------------------------------------------------------
    // FUNCTIE 1: VOLLEDIG VERBERGEN VAN KOLOMMEN (Titel-gebaseerd)
    // -----------------------------------------------------------

    function verbergKolommen(table) {
        if (!table) return [];

        const headerRow = table.querySelector('thead tr');
        if (!headerRow) return [];

        const verborgenIndexen = [];

        // 1. Bepaal de indexen op basis van de titels
        headerRow.querySelectorAll('td').forEach((th, index) => {
            const titelSchoneVersie = cleanTitle(th.textContent);

            let moetVerbergen = false;

            // Controleer of de schoongemaakte titel in de lijst staat
            if (VERBERG_TITELS_SCHOON.includes(titelSchoneVersie)) {
                moetVerbergen = true;
            }

            // Expliciete check voor de lege laatste kolom (index 13)
            if (index === LAATSTE_KOLOM_INDEX) {
                 moetVerbergen = true;
            }

            // Pas 'display: none' toe en verzamel de index
            if (moetVerbergen) {
                if (!verborgenIndexen.includes(index)) {
                     verborgenIndexen.push(index);
                }
                th.style.display = 'none';
            }
        });

        // 2. Verberg de cellen in de tbody op basis van de gevonden indexen
        table.querySelectorAll('tbody tr').forEach(row => {
            row.querySelectorAll('td').forEach((td, index) => {
                // De colspan rij skippen we
                if (td.getAttribute('colspan')) return;

                if (verborgenIndexen.includes(index)) {
                    td.style.display = 'none';
                }
            });
        });

        return verborgenIndexen; // Geef de gevonden indexen terug voor de markering
    }

    // -----------------------------------------------------------
    // FUNCTIE 2: RIJEN VERBERGEN, MARKEREN EN OPTIMALISEREN
    // -----------------------------------------------------------

    function markeerEnOptimaliseerRijen(table, kolommen_verborgen) {
        if (!table) return;

        const doelen = [
            { naam: NAAM_GIJS, bg: KLEUR_GIJS_BG, rand: KLEUR_GIJS_RAND },
            { naam: NAAM_SERVICEDESK, bg: KLEUR_SD_BG, rand: KLEUR_SD_RAND },
            { naam: NAAM_TICKET, bg: KLEUR_TI_BG, rand: KLEUR_TI_RAND }
        ];

        table.querySelectorAll('tbody tr').forEach(row => {
            const eersteCel = row.querySelector('td');
            if (!eersteCel) return; // Rij zonder cellen negeren

            // --- STAP 0: RIJEN VERBERGEN ---
            const rijTitelSchoneVersie = cleanTitle(eersteCel.textContent);

            if (VERBERG_RIJEN_SCHOON.includes(rijTitelSchoneVersie)) {
                row.style.display = 'none';
                return;
            }

            const uitvoerderCel = row.querySelectorAll('td')[INDEX_UITVOERDER];
            const doel = doelen.find(d => uitvoerderCel && uitvoerderCel.textContent.trim() === d.naam);


            // --- STAP 1: OPTIMALISATIE (Geldt voor ALLE ZICHTBARE rijen) ---

            row.querySelectorAll('td').forEach((td, index) => {
                // Sla de 'uitvoerder' cel (index 0) en colspan rijen over
                if (index > 0 && !td.getAttribute('colspan')) {

                    // Nieuwe robuuste reiniging: we halen de link (met het juiste getal) op
                    const linkElement = td.querySelector('a');

                    if (linkElement) {
                        // 1. Maak de cel leeg van alle inhoud (tekst en elementen)
                        td.innerHTML = '';
                        // 2. Voeg alleen de link (die het juiste, klikbare nummer bevat) weer toe
                        td.appendChild(linkElement);
                    }

                    // Extra styling voor opgeruimde cellen
                    td.style.padding = '4px';
                    td.style.textAlign = 'center';

                }
            });


            // --- STAP 2: MARKERING ---

            if (doel) {
                // 1. Pas de markering toe op de rij-eigenschappen
                row.style.outline = `2px solid ${doel.rand}`;
                row.style.fontWeight = 'bold';

                // 2. Pas de gekozen achtergrondkleur per cel toe, ALLEEN op de zichtbare kolommen
                row.querySelectorAll('td').forEach((td, index) => {
                    // Als de cel zichtbaar is (NIET in de lijst van verborgen kolommen)
                    if (!kolommen_verborgen.includes(index)) {
                        td.style.backgroundColor = doel.bg;
                    }
                });
            }
        });
    }

    // -----------------------------------------------------------
    // FUNCTIE 3: SAMENVATTINGSBLOKKEN TOEVOEGEN (FIXED LOGIC)
    // -----------------------------------------------------------

    function addSummaryBlocks(table) {
        if (!table) return;

        // 1. Vind de rij van Gijs Hofman
        let gijsRow = null;
        table.querySelectorAll('tbody tr').forEach(row => {
            const uitvoerderCel = row.querySelectorAll('td')[INDEX_UITVOERDER];
            if (uitvoerderCel && uitvoerderCel.textContent.trim() === NAAM_GIJS) {
                gijsRow = row;
            }
        });

        if (!gijsRow) {
            console.warn(`[Chainwise Script] Kon rij voor ${NAAM_GIJS} niet vinden. Geen samenvattingsblokken toegevoegd.`);
            return;
        }

        // --- 2A. Bereken de Specifieke Totaal Som (TOTAAL) ---
        let specificGijsTotal = 0;
        const totaalIndices = findColumnIndicesByKeywords(table, TOTAAL_SUM_KEYWORDS);

        totaalIndices.forEach(index => {
            const cell = gijsRow.cells[index];
            if (cell) {
                specificGijsTotal += getCountFromCell(cell);
            }
        });

        // --- 2B. Bereken 'Nieuwe Tickets' (NIEUW) ---
        let newGijsTickets = 0;
        const nieuwIndices = findColumnIndicesByKeywords(table, NIEUW_SUM_KEYWORDS);

        nieuwIndices.forEach(index => {
            const cell = gijsRow.cells[index];
            if (cell) {
                newGijsTickets += getCountFromCell(cell);
            }
        });


        // 3. Creëer de container
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexWrap = 'wrap'; // Voor responsiviteit
        container.style.marginBottom = '10px';

        // 4. Creëer en voeg de blokken toe
        const totalBlock = createSummaryBlock(`TOTAAL: ${specificGijsTotal}`, '#198754'); // Groen
        const newBlock = createSummaryBlock(`NIEUW (${NAAM_GIJS}): ${newGijsTickets}`, '#dc3545'); // Rood

        container.appendChild(totalBlock);
        container.appendChild(newBlock);

        // 5. Voeg de container in vóór de tabel
        table.parentNode.insertBefore(container, table);
    }

    // Hulpfunctie om de samenvattingsblokken aan te maken
    function createSummaryBlock(text, color) {
        const div = document.createElement('div');
        div.textContent = text;

        // Pas stijlen individueel toe om compatibiliteit in Tampermonkey te garanderen
        div.style.backgroundColor = color;
        div.style.color = 'white';
        div.style.padding = '12px 20px';
        div.style.margin = '0 15px 20px 0';
        div.style.fontSize = '1.1em';
        div.style.fontWeight = 'bold';
        div.style.textAlign = 'center';
        div.style.borderRadius = '8px';
        div.style.display = 'inline-block';
        div.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.2)';
        div.style.border = '1px solid rgba(255, 255, 255, 0.5)';
        div.style.minWidth = '250px';

        return div;
    }


    // -----------------------------------------------------------
    // UITVOERING
    // -----------------------------------------------------------

    const tableElement = document.querySelector(TABEL_SELECTOR);

    if (tableElement) {
        // Functie 1 retourneert de dynamische indexen
        const verborgenIndexen = verbergKolommen(tableElement);

        markeerEnOptimaliseerRijen(tableElement, verborgenIndexen);

        // Nieuwe stap: Samenvattingsblokken toevoegen
        addSummaryBlocks(tableElement);

    } else {
        console.error('Tampermonkey Script: De hoofdtabel kon niet gevonden worden.');
    }

})();