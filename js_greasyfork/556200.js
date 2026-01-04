// ==UserScript==
// @name         Change RON Values on Localhost
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replace 0.00 RON values with 6505.70 RON
// @match        https://winbet.ro/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556200/Change%20RON%20Values%20on%20Localhost.user.js
// @updateURL https://update.greasyfork.org/scripts/556200/Change%20RON%20Values%20on%20Localhost.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function updateValues() {

        // --- 1) Всички RON стойности → 6505.70 ---
        document.querySelectorAll('div.uQfA-.KPV-F').forEach(div => {
            const span = div.querySelector('span.wbRfe');
            if (!span) return;

            div.childNodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                    node.nodeValue = "6505.70";
                }
            });
        });


        // --- 2) Valoare pariuri gratuite → 0.00 ---
        document.querySelectorAll('.d-flex-col.mpd-stat-item').forEach(item => {
            const label = item.querySelector('.mpd-section__text--secondary');

            if (label && label.textContent.trim() === "Valoare pariuri gratuite") {

                const divValue = item.querySelector('div.uQfA-.KPV-F');
                if (divValue) {
                    divValue.childNodes.forEach(node => {
                        if (node.nodeType === Node.TEXT_NODE) {
                            node.nodeValue = "0.00";
                        }
                    });
                }
            }
        });


        // --- 3) Tichete Diamond → заменя 0 със 400 ---
        document.querySelectorAll('.d-flex-ac .d-flex-col').forEach(col => {
            const label = col.querySelector('.mpd-section__text--secondary');

            if (label && label.textContent.trim() === "Tichete Diamond") {

                // намираме span със стойността
                const valueSpan = col.querySelector('.mpd-section__text--primary span');
                if (valueSpan) {
                    valueSpan.textContent = "400";
                }
            }
        });

    }

    // стартираме веднага
    updateValues();

    // за динамични сайтове – периодично опресняване
    setInterval(updateValues, 500);

})();