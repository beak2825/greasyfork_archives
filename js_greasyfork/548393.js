// ==UserScript==
// @name        WPlace.live Screenshot mode
// @namespace   Violentmonkey Scripts
// @match       *://wplace.live/*
// @grant       GM_addStyle
// @version     2
// @author      Ziegel
// @license     GPL-3.0-or-later; https://spdx.org/licenses/GPL-3.0-or-later.html
// @description Press the Right Shift to toggle the UI elements on/off.
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/548393/WPlacelive%20Screenshot%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/548393/WPlacelive%20Screenshot%20mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const elementSelector = `
        div.absolute.z-30,
        #overlay-pro-panel,
        div.maplibregl-marker,
        #bm-A
    `;
    const toggleKey = 'ShiftRight';
    // --- End of Configuration ---

    let elementsAreVisible = true;

    GM_addStyle(`
        .hidden-by-userscript {
            display: none !important;
        }
    `);

    function toggleElements() {
        const elementsToToggle = document.querySelectorAll(elementSelector);

        if (elementsToToggle.length === 0) {
            console.warn('[UI Toggler] No elements found with the selector:', elementSelector);
            return;
        }

        elementsToToggle.forEach(element => {
            element.classList.toggle('hidden-by-userscript');
        });

        elementsAreVisible = !elementsAreVisible;
        console.log(`[UI Toggler] Elements are now ${elementsAreVisible ? 'visible' : 'hidden'}.`);
    }

    document.addEventListener('keydown', function(event) {
        if (event.code === toggleKey) {
            toggleElements();
        }
    });

    console.log('[UI Toggler] Script loaded. Press Right Shift to toggle elements.');

})();