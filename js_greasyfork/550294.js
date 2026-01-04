// ==UserScript==
// @license MIT
// @name         Yokohama Facility Reservation - Select All
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds "Select All" and "Deselect All" buttons to the Yokohama facility reservation page.
// @author       Gemini
// @match        https://www.shisetsu.city.yokohama.lg.jp/user/AvailabilityCheckApplySelectFacility
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yokohama.lg.jp
// @downloadURL https://update.greasyfork.org/scripts/550294/Yokohama%20Facility%20Reservation%20-%20Select%20All.user.js
// @updateURL https://update.greasyfork.org/scripts/550294/Yokohama%20Facility%20Reservation%20-%20Select%20All.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Finds the target location and inserts the control buttons.
     * @returns {boolean} - True if the buttons were added successfully, false otherwise.
     */
    function addControlButtons() {
        // Find the container where the page title is located
        const headerContainer = document.querySelector('.page-header .d-flex');

        // If the container isn't on the page yet, or if we've already added the button, do nothing.
        if (!headerContainer || document.getElementById('selectAllBtn-userscript')) {
            return false;
        }

        // --- Create the "Select All" button ---
        const selectAllButton = document.createElement('button');
        selectAllButton.textContent = 'すべて選択'; // "Select All" in Japanese
        selectAllButton.id = 'selectAllBtn-userscript';
        selectAllButton.type = 'button'; // Prevents form submission
        // Use the same CSS classes as other buttons on the page for a consistent look
        selectAllButton.classList.add('btn', 'btn-info', 'btn-sm', 'ml-3', 'mb-2');

        selectAllButton.addEventListener('click', () => {
            const checkboxes = document.querySelectorAll('.facilities tbody input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                // If the checkbox is not already checked, click it.
                if (!checkbox.checked) {
                    // We use .click() to ensure any JavaScript frameworks (like Vue.js)
                    // on the page correctly register the change.
                    checkbox.click();
                }
            });
        });

        // --- Create the "Deselect All" button ---
        const deselectAllButton = document.createElement('button');
        deselectAllButton.textContent = 'すべて解除'; // "Deselect All" in Japanese
        deselectAllButton.id = 'deselectAllBtn-userscript';
        deselectAllButton.type = 'button';
        deselectAllButton.classList.add('btn', 'btn-secondary', 'btn-sm', 'ml-2', 'mb-2');

        deselectAllButton.addEventListener('click', () => {
             const checkboxes = document.querySelectorAll('.facilities tbody input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                // If the checkbox is checked, click it to uncheck.
                if (checkbox.checked) {
                    checkbox.click();
                }
            });
        });

        // --- Add the new buttons to the page ---
        headerContainer.appendChild(selectAllButton);
        headerContainer.appendChild(deselectAllButton);

        return true; // Buttons added successfully
    }

    // Because the page might load content dynamically, we'll check for the target
    // element every 500 milliseconds until it's found.
    const interval = setInterval(() => {
        if (addControlButtons()) {
            clearInterval(interval); // Stop checking once the buttons are added.
        }
    }, 500);
})();