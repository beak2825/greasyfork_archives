// ==UserScript==
// @name         Auto Click "Ladda om" on Bemlo
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Klickar automatiskt på "Ladda om"-knappen när den dyker upp på Bemlo-sidan
// @author       William Brandt
// @match        https://app.bemlo.com/vacancies/tenders
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553182/Auto%20Click%20%22Ladda%20om%22%20on%20Bemlo.user.js
// @updateURL https://update.greasyfork.org/scripts/553182/Auto%20Click%20%22Ladda%20om%22%20on%20Bemlo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Funktion för att hitta och klicka på knappen
    function clickReloadButton() {
        const buttons = document.querySelectorAll('.css-f4fgfe');
        const reloadButton = Array.from(buttons).find(btn => btn.textContent.trim() === 'Ladda om');

        if (reloadButton) {
            console.log('Knappen "Ladda om" hittades och klickades.');
            reloadButton.click();
        }
    }

    // Kör funktionen varje 0,5:e sekund
    setInterval(clickReloadButton, 500);
})();
