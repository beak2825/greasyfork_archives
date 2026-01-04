// ==UserScript==
// @name         WebDoc - Flytta varnings- och inforutor
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Flyttar varningsrutan (jError) på webdoc.atlan.se från toppen till nedre högra hörnet med en permanent CSS-regel.
// @author       Ditt Namn
// @match        https://webdoc.atlan.se/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/549214/WebDoc%20-%20Flytta%20varnings-%20och%20inforutor.user.js
// @updateURL https://update.greasyfork.org/scripts/549214/WebDoc%20-%20Flytta%20varnings-%20och%20inforutor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Denna CSS-regel kommer att injiceras direkt på sidan.
    // '!important' tvingar webbläsaren att prioritera våra stilar
    // över sidans egna, inline-stilar (top: 88px; left: 1331px;).
    const overrideCss = `
        #jError {
            top: auto !important;
            left: auto !important;
            bottom: 20px !important;
            right: 20px !important;
            position: fixed !important;
        }
    `;

    // Använd Tampermonkeys inbyggda funktion för att lägga till CSS-regeln.
    GM_addStyle(overrideCss);

    console.log('Permanent CSS-regel för att flytta #jError har injicerats.');

})();