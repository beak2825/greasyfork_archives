// ==UserScript==
// @name         Chainwise Debiteurnummer Linker
// @namespace    http://tampermonkey.net/
// @version      2025.1.1
// @description  Zoekt naar 'DebiteurNr' (robuust), extraheert de nummerieke waarde en verandert deze in een directe link naar Heldere Inzage.
// @author       Gijs Hofman
// @match        https://heldertelecom.chainwisehosted.nl/modules/relatiebeheer/bedr_vw.asp*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555429/Chainwise%20Debiteurnummer%20Linker.user.js
// @updateURL https://update.greasyfork.org/scripts/555429/Chainwise%20Debiteurnummer%20Linker.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // -----------------------------------------------------------
    // CONFIGURATIE
    // -----------------------------------------------------------
    // De gezochte tekst, opgeschoond (kleine letters, geen spaties)
    const DEBITEUR_LABEL_SCHOON = 'debiteurnr';
    const PORTAAL_BASE_URL = 'https://portal.helderinzage.nl/search/index_elastic';
    const SEARCH_PARAMS = '&inactive=0&search_subscriptions=0'; // Constante zoekparameters

    // -----------------------------------------------------------
    // HULPFUNCTIE
    // -----------------------------------------------------------

    /**
     * Maakt tekst schoon voor robuuste vergelijking:
     * Verwijdert whitespace, leestekens (:), en zet alles om naar kleine letters.
     */
    function cleanText(text) {
        if (!text) return '';
        // Verwijder alle whitespace, dubbele punten en zet om naar kleine letters
        return text.replace(/[\s\:]/g, '').toLowerCase();
    }

    /**
     * Zoekt in de DOM naar het debiteurnummer en maakt er een hyperlink van.
     */
    function linkDebiteurnummer() {
        console.log('Script "Chainwise Debiteurnummer Linker" start (v1.1)...');

        // Zoek naar alle cellen in het document
        const cells = document.querySelectorAll('td');

        for (const labelCell of cells) {
            // Stap 1: Controleer of de cel de debiteur label bevat (robuuste check)
            if (cleanText(labelCell.textContent) === DEBITEUR_LABEL_SCHOON) {

                // Stap 2: Zoek de direct volgende cel (waar de waarde staat)
                const valueCell = labelCell.nextElementSibling;

                if (valueCell && valueCell.tagName === 'TD') {
                    // Stap 3: Extract de nummerieke waarde (Debiteurnummer)
                    const rawValue = valueCell.textContent.trim();

                    // Gebruik RegEx om ALLEEN de eerste sequentie van cijfers te extraheren (robuust)
                    const match = rawValue.match(/\d+/);
                    const debiteurNummer = match ? match[0] : '';


                    if (debiteurNummer) {
                        // Stap 4: Creëer de volledige link
                        const fullUrl = `${PORTAAL_BASE_URL}?term=${debiteurNummer}${SEARCH_PARAMS}`;

                        console.log(`Gevonden DebiteurNr: ${debiteurNummer}. Nieuwe URL: ${fullUrl}`);

                        // Stap 5: Vervang de tekst door een hyperlink
                        const link = document.createElement('a');
                        link.href = fullUrl;
                        link.target = '_blank'; // Open in een nieuw tabblad
                        link.textContent = debiteurNummer;
                        link.style.fontWeight = 'bold'; // Optionele styling
                        link.style.color = '#007bff'; // Bootstrap/standaard blauwe link kleur

                        // Leeg de cel en voeg de link toe
                        valueCell.innerHTML = '';
                        valueCell.appendChild(link);
                        return; // We zijn klaar, de link is gemaakt, dus stoppen
                    }
                }
            }
        }
        console.log('Script voltooid: DebiteurNr niet gevonden of is niet numeriek.');
    }

    // Uitvoering
    linkDebiteurnummer();

})();