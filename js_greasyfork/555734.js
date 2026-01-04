// ==UserScript==
// @name         FV - Hide Sick Villager From Maintenance Market
// @namespace    https://greasyfork.org/en/users/1535374-necroam
// @version      3.0
// @description  Hide rows with sick villagers from the maintenance market list.
// @author       necroam
// @match        https://www.furvilla.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555734/FV%20-%20Hide%20Sick%20Villager%20From%20Maintenance%20Market.user.js
// @updateURL https://update.greasyfork.org/scripts/555734/FV%20-%20Hide%20Sick%20Villager%20From%20Maintenance%20Market.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Waits for market list to load, then hides sick villagers. Only if the villager has fa-frown (sickness)
    window.addEventListener('load', () => {
        const rows = document.querySelectorAll('tbody tr');

        rows.forEach(row => {
            const frownIcon = row.querySelector('i.fa.fa-frown-o');

            if (frownIcon) {
                row.style.display = 'none';
            }
        });
    });
})();