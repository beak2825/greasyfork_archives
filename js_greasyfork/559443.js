// ==UserScript==
// @name         Genius Tab to Select
// @namespace    https://genius.com/
// @version      1.0.1
// @description  You can use this script to select input result with tab button.
// @author       SHOOK1sT and Google Gemini :)
// @match        *://genius.com/*-lyrics
// @match        *://genius.com/*-lyrics?*
// @icon         https://imgur.com/w3KeanO.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559443/Genius%20Tab%20to%20Select.user.js
// @updateURL https://update.greasyfork.org/scripts/559443/Genius%20Tab%20to%20Select.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Genius Tab to Select extension loaded');

    // Helper to find the focused option in a react-select or similar dropdown
    function findFocusedOption() {
        // 1. Look for options with "focused" classes (react-select standard)
        const focusedByClass = document.querySelector(
            '[class*="-option--is-focused"], ' +
            '[class*="-Option--is-focused"], ' +
            '[class*="option--is-focused"], ' +
            '[class*="-focused"], ' +
            '.is-focused'
        );
        if (focusedByClass) return focusedByClass;

        // 2. Fallback: Search all visible options and check for highlight background color
        const options = document.querySelectorAll('[class*="option"], [id*="option"], [role="option"]');
        for (const opt of options) {
            if (!(opt.offsetWidth > 0 || opt.offsetHeight > 0)) continue;
            const style = window.getComputedStyle(opt);
            const bg = style.backgroundColor;
            // Color Check
            if (bg !== 'rgba(0, 0, 0, 0)' && bg !== 'rgb(255, 255, 255)' && bg !== 'transparent') {
                return opt;
            }
        }
        return null;
    }

    document.addEventListener('keydown', (event) => {
        // Only intercept Tab key
        if (event.key !== 'Tab') return;

        const target = event.target;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') return;

        const focusedOption = findFocusedOption();

        if (focusedOption) {
            console.log('Tab pressed while a suggestion is focused. Selecting:', focusedOption.textContent);

            // Prevent default tab behavior (switching fields)
            event.preventDefault();

            // Execute selection with a tiny delay
            setTimeout(() => {
                focusedOption.click();

                // Re-focus the original input
                setTimeout(() => {
                    target.focus();
                }, 50);
            }, 10);
        }
    }, true); // Use capture phase to intercept early
})();