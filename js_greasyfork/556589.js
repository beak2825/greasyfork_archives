// ==UserScript==
// @name         Real-Debrid Downloader Helper
// @namespace    https://greasyfork.org/en/users/807108-jeremy-r
// @author       JRem
// @version      1.1
// @description  Adds 10 empty lines to textarea and toggles showlinks checkbox
// @match        https://real-debrid.com/downloader
// @run-at       document-end
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556589/Real-Debrid%20Downloader%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/556589/Real-Debrid%20Downloader%20Helper.meta.js
// ==/UserScript==


(function () {
    'use strict';

    function applyEdits() {
        const textarea = document.querySelector('#links');
        const checkbox = document.querySelector('input[name="showlinks"]');

        if (textarea) {
            textarea.value += '\n'.repeat(10);
        }
        if (checkbox) {
            checkbox.checked = true;
        }
    }

    function init() {
        const textarea = document.querySelector('#links');
        const checkbox = document.querySelector('input[name="showlinks"]');
        const resetBtn = document.querySelector('#clear_links');

        if (textarea && checkbox) {
            applyEdits();

            // Attach listener to Reset button
            if (resetBtn) {
                resetBtn.addEventListener('click', () => {
                    // Delay slightly to let Real-Debrid clear the textarea first
                    setTimeout(applyEdits, 50);
                });
            }

            console.log('Userscript applied: textarea padded, checkbox checked, reset hook added.');
            return true;
        }
        return false;
    }

    // Poll until elements exist
    let attempts = 0;
    const maxAttempts = 20; // ~10 seconds
    const interval = setInterval(() => {
        if (init() || attempts >= maxAttempts) {
            clearInterval(interval);
        }
        attempts++;
    }, 500);
})();
