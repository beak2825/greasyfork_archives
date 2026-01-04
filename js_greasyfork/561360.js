// ==UserScript==
// @name         eRevollution - Partial Train Button
// @namespace    http://www.erevollution.com/
// @version      1.0.1
// @author       SkyIsTheLimit
// @description  Unchecks all but the last training ground and clicks Train
// @match        https://www.erevollution.com/*/training-grounds
// @icon         https://www.google.com/s2/favicons?sz=64&domain=erevollution.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561360/eRevollution%20-%20Partial%20Train%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/561360/eRevollution%20-%20Partial%20Train%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. Find the existing Train button to use as a reference point
    const trainButton = document.querySelector('button.buttonT[type="submit"]');

    if (trainButton) {
        // 2. Create the "Partial Train" button
        const partialBtn = document.createElement('button');
        partialBtn.type = 'button'; // Set to button so it doesn't auto-submit before logic
        partialBtn.className = 'buttonT';
        partialBtn.style.marginLeft = '10px';
        partialBtn.style.backgroundColor = '#5bc0de'; // Optional: distinct color (info blue)
        partialBtn.innerHTML = '<div class="content">Partial Train</div>';

        // 3. Add the logic to the button
        partialBtn.addEventListener('click', function() {
            const checkboxes = document.querySelectorAll('.tgCheckbox');

            if (checkboxes.length > 0) {
                // Uncheck all but the last checkbox
                for (let i = 0; i < checkboxes.length - 1; i++) {
                    checkboxes[i].checked = false;

                    // Trigger 'change' event so the page updates its internal totals (Gold/RON/Energy)
                    checkboxes[i].dispatchEvent(new Event('change', { bubbles: true }));
                }

                // Ensure the last checkbox is checked
                const lastIdx = checkboxes.length - 1;
                checkboxes[lastIdx].checked = true;
                checkboxes[lastIdx].dispatchEvent(new Event('change', { bubbles: true }));

                // 4. Trigger the click on the original Train button
                trainButton.click();
            } else {
                alert('No training checkboxes found.');
            }
        });

        // 5. Inject the button into the same container as the original Train button
        trainButton.parentNode.appendChild(partialBtn);
    }
})();