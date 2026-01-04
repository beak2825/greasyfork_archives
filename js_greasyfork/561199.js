// ==UserScript==
// @name         P3 – Random Eyrie Auto Interaction
// @namespace    p3_random_eyrie_auto
// @version      1.0
// @description  Automatically interacts with Random Eyrie actions on page load and refreshes randomly
// @match        https://pocketpumapets.com/random_eyrie.php*
// @icon         https://www.pocketpumapets.com/favicon.ico
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561199/P3%20%E2%80%93%20Random%20Eyrie%20Auto%20Interaction.user.js
// @updateURL https://update.greasyfork.org/scripts/561199/P3%20%E2%80%93%20Random%20Eyrie%20Auto%20Interaction.meta.js
// ==/UserScript==

(() => {
    'use strict';

    // ---------- HELPER FUNCTION TO RANDOMLY CLICK AVAILABLE ACTION ----------
    function clickRandomEyrieAction() {
        // Find the three links by their text
        const actions = ['Spa Treatment', 'Playtime', 'Give a Treat'];
        const availableLinks = [];

        actions.forEach(actionText => {
            const link = [...document.querySelectorAll('div.eyrie_interaction a')].find(a => a.textContent.trim() === actionText);
            if (link) availableLinks.push(link);
        });

        if (availableLinks.length > 0) {
            // Pick a random link
            const randomLink = availableLinks[Math.floor(Math.random() * availableLinks.length)];
            console.log('[Random Eyrie] Clicking:', randomLink.textContent.trim());
            // Navigate to the link
            window.location.href = randomLink.href;
        } else {
            console.log('[Random Eyrie] No available actions found.');
        }
    }

    // ---------- CLICK AN ACTION ON PAGE LOAD ----------
    clickRandomEyrieAction();

    // ---------- RANDOM REFRESH BETWEEN 4–6 MINUTES ----------
    const minMinutes = 4;
    const maxMinutes = 6;
    const refreshTime = Math.floor(Math.random() * (maxMinutes - minMinutes + 1) + minMinutes) * 60 * 1000;

    console.log(`[Random Eyrie] Next refresh in ${(refreshTime / 60000).toFixed(2)} minutes.`);
    setTimeout(() => location.reload(), refreshTime);

})();
