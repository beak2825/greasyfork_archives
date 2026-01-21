// ==UserScript==
// @name         Tinkercad Auto-Select Favorites On Design Load
// @namespace    https://tinkercad.com/
// @version      1.4
// @description  Auto-select "Favorites"
// @author       BlackJackShellac & ChatGPT Code
// @match        https://www.tinkercad.com/things/*/edit*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563405/Tinkercad%20Auto-Select%20Favorites%20On%20Design%20Load.user.js
// @updateURL https://update.greasyfork.org/scripts/563405/Tinkercad%20Auto-Select%20Favorites%20On%20Design%20Load.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function deepQuerySelectorAll(selector, root = document) {
        const results = Array.from(root.querySelectorAll(selector));
        for (const el of root.querySelectorAll('*')) {
            if (el.shadowRoot) results.push(...deepQuerySelectorAll(selector, el.shadowRoot));
        }
        return results;
    }

    function deepFindByText(text, root = document) {
        const lowerText = text.toLowerCase();
        const elems = deepQuerySelectorAll('*', root);
        return Array.from(elems).find(el => el.textContent?.trim().toLowerCase() === lowerText);
    }


    async function selectFavorites() {
        const shapesButton = deepFindByText('Basic Shapes') || deepFindByText('Favorites');
        if (shapesButton) {
            shapesButton.click();
            setTimeout(() => {
                const fav = deepFindByText('Favorites');
                if (fav) fav.click();
                console.log('[Tampermonkey] Selected Favorites library ✅');
            }, 800);
        }
    }

    window.addEventListener('load', () => {
        console.log('[Tampermonkey] Waiting for Tinkercad...');
        setTimeout(() => {
            selectFavorites();
//        }, 10000); // ORG
        }, 5000); //bjs
    });
})();
