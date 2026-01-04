// ==UserScript==
// @name         Bazos.cz CZK → EUR
// @namespace    http://tampermonkey.net/
// @version      2025-11-11
// @author       YeapGuy
// @description  Konvertuje na českom Bazoši ceny z korún do eur.
// @match        https://*.bazos.cz/*
// @match        http://*.bazos.cz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bazos.cz
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555534/Bazoscz%20CZK%20%E2%86%92%20EUR.user.js
// @updateURL https://update.greasyfork.org/scripts/555534/Bazoscz%20CZK%20%E2%86%92%20EUR.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Exchange rate (you can update this manually or fetch dynamically)
    const CZK_TO_EUR = 0.041; // Example: 1 CZK = 0.041 EUR

    // Helper function to convert CZK string to EUR
    function convertPrice(text) {
        // Remove non-digit characters (spaces, Kč)
        const czk = parseFloat(text.replace(/[^\d]/g, ''));
        if (isNaN(czk)) return null;
        const eur = (czk * CZK_TO_EUR).toFixed(0);
        return '~' + eur + ' €';
    }

    // Convert prices in <div class="inzeratycena">
    const priceDivs = document.querySelectorAll('div.inzeratycena span[translate="no"]');
    priceDivs.forEach(span => {
        const eur = convertPrice(span.textContent);
        if (eur) {
            const eurSpan = document.createElement('span');
            eurSpan.style.color = 'green';
            eurSpan.style.marginLeft = '5px';
            eurSpan.textContent = `(${eur})`;
            span.parentNode.appendChild(eurSpan);
        }
    });

    // Convert prices in table format (inside <td colspan="2"><b><span>)
    const tableSpans = Array.from(document.querySelectorAll('td[colspan="2"] b span[translate="no"]'));
    tableSpans.forEach(span => {
        const eur = convertPrice(span.textContent);
        if (eur) {
            const eurSpan = document.createElement('span');
            eurSpan.style.color = 'green';
            eurSpan.style.marginLeft = '5px';
            eurSpan.textContent = `(${eur})`;
            span.parentNode.appendChild(eurSpan);
        }
    });

})();
