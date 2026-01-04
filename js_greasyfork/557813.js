// ==UserScript==
// @name         Enable JewishGen Filter Rows (3 & 4) & Remove Overlay
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Unblocks, enables the 3rd and 4th search filter rows, AND removes the blocking donor overlay on JewishGen.
// @author       Knaper Yaden
// @match        *://www.jewishgen.org/databases/all/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/557813/Enable%20JewishGen%20Filter%20Rows%20%283%20%204%29%20%20Remove%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/557813/Enable%20JewishGen%20Filter%20Rows%20%283%20%204%29%20%20Remove%20Overlay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Core logic wrapped in a function that runs once the DOM is ready
    function initializeScript() {

        // --- 1. Filter Row Enabling Function ---
        function enableFilterRow(rowNumber) {
            const selectV = document.getElementById('SEL' + rowNumber);
            const selectT = document.getElementById('OPT' + rowNumber);
            const inputField = document.getElementById('SRCH' + rowNumber);

            const elements = [selectV, selectT, inputField];

            elements.forEach(el => {
                if (el) {
                    el.removeAttribute('disabled');
                    if (el.tagName === 'INPUT') {
                        el.style.backgroundColor = '';
                    }
                }
            });
        }

        // --- 2. Execute Enabling on Rows 3 and 4 ---
        enableFilterRow(3);
        enableFilterRow(4);

        // --- 3. Clean up Blocking Elements ---

        // A. Remove the blocking 'onmouseover' from the tbody
        const tbodyBlocker = document.querySelector('tbody[onmouseover*="OverlayPopup"]');
        if (tbodyBlocker) {
            tbodyBlocker.removeAttribute('onmouseover');
        }

        // B. Remove the Persistent Overlay DIV
        const overlayDiv = Array.from(document.querySelectorAll('div')).find(div =>
            div.textContent && div.textContent.includes('The advanced database search features are available only to')
        );

        if (overlayDiv) {
            overlayDiv.remove();
        }

        console.log('✅ JewishGen Filter Rows 3 and 4 enabled and overlay removed.');
    }

    // Use DOMContentLoaded for reliable execution after HTML structure is parsed
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeScript);
    } else {
        // Run immediately if the document is already loaded
        initializeScript();
    }

})();