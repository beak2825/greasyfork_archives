// ==UserScript==
// @name         Barcode Rapid Entry Helper
// @namespace    Violentmonkey Scripts
// @version      3.0
// @description  Automates barcode submission by simulating 'Enter' on 12-digit scans and clearing the field.
// @match        https://his.kaauh.org/*
// @author       Hamad AlShegifi
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548076/Barcode%20Rapid%20Entry%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/548076/Barcode%20Rapid%20Entry%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const BARCODE_INPUT_SELECTOR = 'input[formcontrolname="Barcode"]';
    const BARCODE_LENGTH_TRIGGER = 12;

    /**
     * Attaches the rapid entry listeners to a barcode input element.
     * This is the core function of the script.
     */
    function enableRapidEntry(barcodeInput) {
        // This listener triggers the 'Enter' press automatically for 12-digit scans.
        barcodeInput.addEventListener('input', function() {
            if (this.value.length === BARCODE_LENGTH_TRIGGER) {
                // Step 1: Simulate an "Enter" key press to submit the barcode to the website.
                const enterEvent = new KeyboardEvent('keydown', {
                    bubbles: true,
                    cancelable: true,
                    key: 'Enter',
                    code: 'Enter'
                });
                this.dispatchEvent(enterEvent);

                // Step 2: Clear the input field after a short delay to make it ready for the next scan.
                setTimeout(() => {
                    this.value = '';
                }, 100);
            }
        });
    }

    // --- Main Execution ---
    // This observer continuously scans the page for new barcode inputs
    // that haven't been processed yet.
    const observer = new MutationObserver(() => {
        // Find all barcode inputs that we haven't attached our listener to yet.
        const newInputs = document.querySelectorAll(
            BARCODE_INPUT_SELECTOR + ':not([data-rapid-entry-attached])'
        );

        newInputs.forEach(input => {
            console.log('Rapid entry enabled for a new barcode input.');
            enableRapidEntry(input);
            // Mark the input as processed so we don't attach listeners to it again.
            input.dataset.rapidEntryAttached = 'true';
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();