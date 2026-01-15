// ==UserScript==
// @name        Profession.hu Dark Mode
// @namespace   Violentmonkey Scripts
// @match       https://www.profession.hu/*
// @grant       none
// @version     1.0
// @author      Frank
// @description Sötét mód a profession.hu oldalhoz, legalább nem égetti ki a szemem éjszaka
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562475/Professionhu%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/562475/Professionhu%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.innerHTML = `
        /* Az egész oldal invertálása */
        html {
            filter: invert(0.9) hue-rotate(180deg) !important;
            background-color: #000 !important;
        }

        /* Képek, logók és videók visszainvertálása, hogy ne legyenek "negatív" hatásúak */
        img,
        video,
        iframe,
        .company-logo,
        [style*="background-image"] {
            filter: invert(1) hue-rotate(180deg) !important;
        }

        /* Fehér háttér fixálása a kártyáknál, hogy ne legyen túl világos */
        body {
            background-color: #121212 !important;
        }

        /* Néhány elem finomhangolása, ha szükséges */
        .job-card, .search-bar {
            box-shadow: 0 4px 6px rgba(255,255,255,0.1) !important;
        }
    `;
    document.head.appendChild(style);
})();