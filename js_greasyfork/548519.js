// ==UserScript==
// @name         Auto klik Wykonaj
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatycznie klika guziki "Wykonaj", gdy staną się aktywne
// @match        *://*.gangsters.pl/?module=missions*
// @grant        none
// author        mleko95
// @license      Proprietary
// @downloadURL https://update.greasyfork.org/scripts/548519/Auto%20klik%20Wykonaj.user.js
// @updateURL https://update.greasyfork.org/scripts/548519/Auto%20klik%20Wykonaj.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clickActiveButtons() {
        document.querySelectorAll('input.buttonGreen[value="Wykonaj"]').forEach(btn => {
            if (!btn.disabled) {
                console.log("Klikam guzik:", btn);
                btn.click();
            }
        });
    }

    // sprawdzaj co 1 sekundę
    setInterval(clickActiveButtons, 1000);
})();
