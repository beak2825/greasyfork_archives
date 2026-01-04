// ==UserScript==
// @name         RetroAchievements Cleanup Unlocks
// @namespace    https://metalsnake.space/
// @version      0.3
// @description  Hide total unlocks and remove parentheses from hardcore unlocks on game pages
// @author       MetalSnake
// @match        https://retroachievements.org/game/*
// @match        http://retroachievements.org/game/*
// @grant        none
// @license      GPL-3.0-or-later; https://spdx.org/licenses/GPL-3.0-or-later.html
// @downloadURL https://update.greasyfork.org/scripts/558210/RetroAchievements%20Cleanup%20Unlocks.user.js
// @updateURL https://update.greasyfork.org/scripts/558210/RetroAchievements%20Cleanup%20Unlocks.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function processUnlocks() {
        const totalSpans = document.querySelectorAll('span.cursor-help[title="Total unlocks"]');

        totalSpans.forEach(totalSpan => {
            // Hide total unlocks span
            totalSpan.style.display = 'none';

            // Look for the next hardcore unlocks span
            let sibling = totalSpan.nextElementSibling;
            while (sibling && !sibling.matches('span.cursor-help.font-bold[title="Hardcore unlocks"]')) {
                sibling = sibling.nextElementSibling;
            }

            if (sibling && sibling.textContent) {
                // Remove parentheses from the hardcore unlocks text
                sibling.textContent = sibling.textContent.replace(/[()]/g, '');
            }
        });
    }

    // Run once on load
    setTimeout(() => {
        processUnlocks();
    }, 100);
})();