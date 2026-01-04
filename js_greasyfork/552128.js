// ==UserScript==
// @name         Chainwise Tooltip Promotor
// @namespace    http://tampermonkey.net/
// @version      2025.1.1
// @description  Haalt een specifieke tooltip-tekst op en toont deze in een rode balk onder de paginatitel.
// @author       Gijs Hofman
// @match        https://heldertelecom.chainwisehosted.nl/modules/helpdesk/calls_vw.asp*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552128/Chainwise%20Tooltip%20Promotor.user.js
// @updateURL https://update.greasyfork.org/scripts/552128/Chainwise%20Tooltip%20Promotor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. Definieer de selector voor de specifieke tooltip.
    // Dit element is de SPAN die het 'title' attribuut (de tooltip-tekst) bevat.
    const tooltipSelector = '.page-header-subtitle span[data-toggle="tooltip"';

    // 2. Zoek de elementen op de pagina
    const tooltipElement = document.querySelector(tooltipSelector);
    const headerWrap = document.getElementById('page-header-title-wrap');

    // 3. Controleer of de tooltip én de header-container zijn gevonden
    if (tooltipElement && headerWrap) {
        // Haal de tooltip-tekst op uit het 'title' attribuut
        const tooltipText = tooltipElement.getAttribute('title');

        if (tooltipText) {
            // 4. Creëer de nieuwe rode meldingenbalk (DIV)
            const warningBar = document.createElement('div');

            // Toepassen van inline stijlen voor de rode balk en zwarte tekst
            warningBar.style.cssText = `
                background-color: #ce1616; /* Lichtrode achtergrond */
                color: #ffffff; /* Zwarte tekst */
                border: 1px solid #f5c6cb; /* Donkerdere rand */
                padding: 10px;
                margin-top: 15px; /* Ruimte onder de subtitel */
                margin-bottom: 5px;
                border-radius: 4px;
                font-weight: bold;
                white-space: pre-wrap; /* Belangrijk voor het behoud van regeleinden als deze in de titel staan */
            `;

            // Zet de tooltip tekst in de nieuwe balk
            warningBar.textContent = tooltipText;

            // 5. Voeg de nieuwe balk toe aan de header-container, direct na de subtitel (p.page-header-subtitle)
            const subtitle = headerWrap.querySelector('.page-header-subtitle');

            if (subtitle) {
                subtitle.parentNode.insertBefore(warningBar, subtitle.nextSibling);
            } else {
                // Als er geen subtitel is, voeg de balk dan toe aan het einde van de header-wrap
                headerWrap.appendChild(warningBar);
            }

            console.log("Tooltip-tekst succesvol als rode balk toegevoegd.");
        }
    }
})();
