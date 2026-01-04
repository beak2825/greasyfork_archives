// ==UserScript==
// @name         Copy Checkmark
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Shows a quick green checkmark when you copy text.
// @author       Gemini
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/555360/Copy%20Checkmark.user.js
// @updateURL https://update.greasyfork.org/scripts/555360/Copy%20Checkmark.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // The function to show the checkmark
    function showCheckmark() {
        // 1. Create the checkmark element
        const checkmark = document.createElement('div');
        checkmark.innerHTML = '✅'; // Unicode green checkmark
        checkmark.id = 'copy-checkmark-gemini';

        // 2. Apply styling to make it look good and float on top
        checkmark.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 50px;
            z-index: 99999;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
            pointer-events: none; /* Allows clicks to pass through */
        `;

        // 3. Add to the body
        document.body.appendChild(checkmark);

        // 4. Show the checkmark by changing opacity
        // We use a slight delay with requestAnimationFrame to ensure the opacity transition works
        requestAnimationFrame(() => {
            checkmark.style.opacity = '1';
        });

        // 5. Hide and remove the element after a short duration (e.g., 800 milliseconds)
        setTimeout(() => {
            checkmark.style.opacity = '0';
            // Wait for the fade-out transition (0.3s) before removing
            setTimeout(() => {
                checkmark.remove();
            }, 300);
        }, 800);
    }

    // Attach the event listener to the entire document
    document.addEventListener('copy', showCheckmark);
})();