// ==UserScript==
// @name         TW Off-jelölés gomb – univerzális fix (battle viewer támogatással)
// @namespace    https://tampermonkey.net/
// @version      1.2
// @description  Megjeleníti az off jelölés gombot minden harcban, még néző módban is. Több szerververziót támogat, DOM figyeléssel.
// @match        https://*.the-west.net/game.php*
// @match        https://*.the-west.hu/game.php*
// @match        https://*.the-west.de/game.php*
// @match        https://*.the-west.pl/game.php*
// @match        https://*.the-west.fr/game.php*
// @match        https://*.the-west.es/game.php*
// @match        https://*.the-west.cz/game.php*
// @match        https://*.the-west.com.br/game.php*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557139/TW%20Off-jel%C3%B6l%C3%A9s%20gomb%20%E2%80%93%20univerz%C3%A1lis%20fix%20%28battle%20viewer%20t%C3%A1mogat%C3%A1ssal%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557139/TW%20Off-jel%C3%B6l%C3%A9s%20gomb%20%E2%80%93%20univerz%C3%A1lis%20fix%20%28battle%20viewer%20t%C3%A1mogat%C3%A1ssal%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Az Inno miatt néha más az osztály neve – több fallback selector
    const selectors = [
        '.fort_battle_button.single_use',
        '[class*="fort_battle"][class*="button"]',
        '[id*="fort"][id*="button"]',
        '[class*="single"][class*="use"]',
        '[class*="battle"][class*="off"]'
    ];

    function showButtons(root = document) {
        selectors.forEach(sel => {
            root.querySelectorAll(sel).forEach(el => {
                if (el.style.display === 'none' ||
                    window.getComputedStyle(el).display === 'none') {
                    el.style.display = 'block';
                }
            });
        });
    }

    // --- Harcablak felismerése ---
    // GUI.openWindow hookolása: amikor battle viewer vagy battle ablak nyílik
    function hookGUI() {
        if (!window.GUI || !GUI.openWindow || GUI.openWindow._tw_patched) return;

        const originalOpen = GUI.openWindow;
        GUI.openWindow = function(name, ...args) {
            const win = originalOpen.apply(this, [name, ...args]);
            if (name.toLowerCase().includes("fortbattle")) {
                // kis csúsztatás, hogy az UI betöltődjön
                setTimeout(() => showButtons(), 300);
                setTimeout(() => showButtons(), 1000);
            }
            return win;
        };

        GUI.openWindow._tw_patched = true;
    }

    // UI hookolása minden betöltésnél
    const guiInterval = setInterval(() => {
        if (window.GUI && GUI.openWindow) {
            clearInterval(guiInterval);
            hookGUI();
        }
    }, 200);

    // --- DOM figyelése ---
    const obs = new MutationObserver(mutations => {
        for (const m of mutations) {
            if (m.addedNodes.length) {
                showButtons(m.target);
            }
        }
    });

    obs.observe(document.body, { childList: true, subtree: true });

    // Biztonsági lefuttatás induláskor
    setTimeout(() => showButtons(), 500);
    setTimeout(() => showButtons(), 1500);
})();
