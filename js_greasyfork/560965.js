// ==UserScript==
// @name         Steam Game Collector Showcase Merger
// @namespace    https://darkpro1337.github.io
// @version      1.0
// @description  Merges multiple Game Collector showcases into a single unified panel.
// @author       DarkPro1337
// @match        https://steamcommunity.com/id/*
// @match        https://steamcommunity.com/profiles/*
// @exclude      https://steamcommunity.com/*/edit/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?domain=steamcommunity.com&sz=64
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560965/Steam%20Game%20Collector%20Showcase%20Merger.user.js
// @updateURL https://update.greasyfork.org/scripts/560965/Steam%20Game%20Collector%20Showcase%20Merger.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function mergeGameCollectors() {
        // Find all Game Collector showcases
        const showcases = document.querySelectorAll('.gamecollector_showcase');
        if (showcases.length < 2) return;

        // Setup the Master Container
        const masterShowcase = showcases[0];
        const targetContainer = masterShowcase.querySelector('.showcase_gamecollector_games');
        if (!targetContainer) return;

        targetContainer.querySelectorAll('div[style*="clear: left"]').forEach(el => el.remove());

        // Ensure vertical growth
        targetContainer.style.height = 'auto';
        targetContainer.style.maxHeight = 'none';

        // Merge Loop
        for (let i = 1; i < showcases.length; i++) {
            const currentShowcase = showcases[i];
            const sourceContainer = currentShowcase.querySelector('.showcase_gamecollector_games');

            if (sourceContainer) {
                // Select ONLY the game slots
                const games = sourceContainer.querySelectorAll('.showcase_slot');
                games.forEach(game => {
                    targetContainer.appendChild(game);
                });
            }

            // Remove the empty showcase block
            const outerWrapper = currentShowcase.closest('.profile_customization');
            if (outerWrapper) outerWrapper.remove();
        }

        // Add ONE single clear div at the very end to ensure the container has the correct height
        const finalClear = document.createElement('div');
        finalClear.style.clear = 'left';
        targetContainer.appendChild(finalClear);
    }

    mergeGameCollectors();

})();