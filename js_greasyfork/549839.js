// ==UserScript==
// @name          WhatsAppWeb Archived Toggler
// @namespace     http://tampermonkey.net/
// @version       1.1
// @description   Hide and toggle the Archived row on WhatsApp Web with a keyboard shortcut (Ctrl + Alt + A)
// @author        Aiesa
// @match         https://web.whatsapp.com/
// @icon          https://web.whatsapp.com/img/favicon/1x/favicon.png
// @grant         none
// @license       MIT
// @origin        based on work of Dequei https://github.com/CristianH96/WhatsAppWebArchivedRemover (but repo is missing)
// @downloadURL https://update.greasyfork.org/scripts/549839/WhatsAppWeb%20Archived%20Toggler.user.js
// @updateURL https://update.greasyfork.org/scripts/549839/WhatsAppWeb%20Archived%20Toggler.meta.js
// ==/UserScript==
(function() {
    'use strict';

    let isArchivedVisible = false;

    function toggleArchivedRow() {
        // Find the element by the stable data-icon attribute.
        const iconSpan = document.querySelector('[data-icon="archive-refreshed"]');
        
        if (iconSpan) {
            // Climb up the DOM tree to find the parent <button> element.
            let archivedRow = iconSpan;
            while (archivedRow && archivedRow.tagName !== 'BUTTON') {
                archivedRow = archivedRow.parentElement;
            }

            if (archivedRow) {
                // Toggle the visibility based on the current state
                if (isArchivedVisible) {
                    archivedRow.style.display = 'none';
                    console.info('Archived row is now hidden.');
                } else {
                    archivedRow.style.display = ''; // Use an empty string to revert to default display
                    console.info('Archived row is now visible.');
                }
                isArchivedVisible = !isArchivedVisible;
            }
        }
    }

    // Set up a MutationObserver to hide the row whenever it appears
    const observer = new MutationObserver(() => {
        const iconSpan = document.querySelector('[data-icon="archive-refreshed"]');
        const archivedRow = iconSpan ? iconSpan.closest('button') : null;
        
        // Only hide it if it's currently meant to be hidden
        if (archivedRow && !isArchivedVisible) {
            archivedRow.style.display = 'none';
        }
    });

    // Start observing the body for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Listen for the keyboard shortcut
    document.addEventListener('keydown', (event) => {
        if (event.ctrlKey && event.altKey && event.code === 'KeyA') {
            // Prevent the default browser action for this shortcut
            event.preventDefault();
            toggleArchivedRow();
        }
    });

})();