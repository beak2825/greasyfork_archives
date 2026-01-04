// ==UserScript==
// @name         Rutracker Auto Sort by Seeders
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Automatically sort Rutracker search results by seeders (S) in descending order
// @author       82
// @license MIT
// @match        https://rutracker.org/forum/tracker.php?nm=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rutracker.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552424/Rutracker%20Auto%20Sort%20by%20Seeders.user.js
// @updateURL https://update.greasyfork.org/scripts/552424/Rutracker%20Auto%20Sort%20by%20Seeders.meta.js
// ==/UserScript==
/* global $ */

(function() {
    'use strict';

    function forceSortBySeeders() {
        const seedHeader = document.querySelector('th[data-column="6"]');

        if (seedHeader) {
            const table = document.getElementById('tor-tbl');
            if (table && typeof $ !== 'undefined' && $(table).data('tablesorter')) {
                try {
                    $(table).trigger('sorton', [[[6,1]]]);
                    return;
                } catch (e) {
                }
            }

            seedHeader.click();

            setTimeout(() => {
                seedHeader.click();

                setTimeout(() => {
                    seedHeader.click();
                }, 300);
            }, 300);
        }
    }

    setTimeout(forceSortBySeeders, 1000);
    setTimeout(forceSortBySeeders, 2500);
})();
