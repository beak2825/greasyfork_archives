// ==UserScript==
// @name         Grundo's Cafe (GC) - Wishing Well Ranked Autofill
// @version      1
// @description  Autofills the wishing well donation amount to 25. Compares your list of wishes to the most recently granted wishes, and chooses the first one that hasn't been granted.
// @author       Chatgpt
// @match        https://grundos.cafe/wishing/
// @match        https://www.grundos.cafe/wishing/
// @license      MIT

// @namespace https://greasyfork.org/users/1519743
// @downloadURL https://update.greasyfork.org/scripts/550784/Grundo%27s%20Cafe%20%28GC%29%20-%20Wishing%20Well%20Ranked%20Autofill.user.js
// @updateURL https://update.greasyfork.org/scripts/550784/Grundo%27s%20Cafe%20%28GC%29%20-%20Wishing%20Well%20Ranked%20Autofill.meta.js
// ==/UserScript==

// Checks the most recently granted wishes, add more backup wishes by adding "item"
var wishes = [
    "Blue Draik Egg",
    "Yellow Draik Egg",
    "Red Draik Egg",
    "Green Draik Egg",
];

(function () {
    'use strict';

    if (window.location.href.match('grundos.cafe/wishing/')) {
        let donation = document.querySelector('[name="donation"]');
        if (donation) {
            // Adjust donation value here
            donation.value = 25;
        }

        let wish = document.querySelector('[name="wish"]');
        if (wish) {
            // Checks the most recently granted wishes
            const table = document.querySelector('table');
            let recentWishes = [];
            if (table) {
                const rows = Array.from(table.querySelectorAll('tr')).slice(0, 15);
                recentWishes = rows.flatMap(row =>
                    Array.from(row.querySelectorAll('td')).map(td => td.textContent.trim())
                );
            }

            // Pick the first wish not in recently granted
            let chosenWish = wishes.find(w => !recentWishes.includes(w));

            // If somehow all are taken, fallback to first wish
            if (!chosenWish) {
                chosenWish = wishes[0];
            }

            wish.value = chosenWish;
            console.log("Wish set to:", chosenWish);

            wish.focus();
        }
    }
})();