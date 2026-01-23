// ==UserScript==
// @name         Quotation Text Corrector All Users
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Change specific text on car edit page by Mufty Pro
// @author       Your Name
// @match        https://salsabeelcars.site/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563613/Quotation%20Text%20Corrector%20All%20Users.user.js
// @updateURL https://update.greasyfork.org/scripts/563613/Quotation%20Text%20Corrector%20All%20Users.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define the new text for the first target element (previous correction)
    const newText0 = "<strong>OFFER/</strong><br>QUOTATION";
    const targetSelector0 = 'body > div.wrapper > div.content-wrapper > section > div > div > div.panel-body > div:nth-child(1) > div > div.col-sm-3.top_left > p';

    // Define the new text for the second target element (new correction)
    const newText1 = "<strong>Tel &nbsp;:&nbsp; +880-2-222293331-5</strong>";
    const targetSelector1 = 'body > div.wrapper > div.content-wrapper > section > div > div > div.panel-body > div:nth-child(1) > div > div.col-sm-3.top_right > p:nth-child(1) > strong';

    // Define the new text for the third target element (new correction)
    const newText2 = "<b>QUOTATION FOR RECONDITIONED MOTOR VEHICLE</b>";
    const targetSelector2 = 'body > div.wrapper > div.content-wrapper > section > div > div > div.panel-body > div:nth-child(2) > div > p > b';

        // Define the new text for fax
    const newText3 = "<b> </b>";
    const targetSelector3 = 'body > div.wrapper > div.content-wrapper > section > div > div > div.panel-body > div:nth-child(1) > div > div.col-sm-3.top_right > p:nth-child(2) > strong';

    // Function to update the text of a target element
    function updateText(targetSelector, newText) {
        const targetElement = document.querySelector(targetSelector);
        if (targetElement) {
            targetElement.innerHTML = newText; // Use innerHTML to allow HTML formatting
        } else {
            console.error('Target element not found:', targetSelector);
        }
    }

    // Create a MutationObserver to wait for the elements to be available in the DOM
    const observer = new MutationObserver((mutationsList, observer) => {
        // Check if all target elements are present
        const targetElement0 = document.querySelector(targetSelector0);
        const targetElement1 = document.querySelector(targetSelector1);
        const targetElement2 = document.querySelector(targetSelector2);
        const targetElement3 = document.querySelector(targetSelector3);

        if (targetElement0 && targetElement1 && targetElement2) {
            // Update the text for all elements
            updateText(targetSelector0, newText0); // Previous correction
            updateText(targetSelector1, newText1); // New correction
            updateText(targetSelector2, newText2); // New correction
            updateText(targetSelector3, newText3); // DELETE FAX

            // Disconnect the observer after the updates are done
            observer.disconnect();
        }
    });

    // Start observing the document with the configured parameters
    observer.observe(document.body, { childList: true, subtree: true });
})();