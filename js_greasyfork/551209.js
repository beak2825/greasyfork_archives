// ==UserScript==
// @name         Credit card offers automator
// @namespace    huuns@notveryreal
// @version      1.0
// @description  Adding all the amex offer with one click
// @author       huuns
// @match        https://global.americanexpress.com/offers*
// @license       AGPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/551209/Credit%20card%20offers%20automator.user.js
// @updateURL https://update.greasyfork.org/scripts/551209/Credit%20card%20offers%20automator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Only run if account_key param is present
    if (!window.location.search.includes('account_key=')) {
        return;
    }

    // Helper: Find the h2 with innerText "Recommended Offers"
    function insertStartButton() {
        // Container for recommended offers section
        const container = document.querySelector('[data-testid="recommendedOffersContainer"]');
        if (!container) return;

        // Find header (h2) inside the container
        const header = container.querySelector('h2');
        if (!header) return;

        // Create start button
        const startBtn = document.createElement('button');
        startBtn.textContent = 'Add all offers';
        startBtn.style.marginLeft = '16px';
        startBtn.style.padding = '9px 18px';
        startBtn.style.background = '#4caf50';
        startBtn.style.color = '#fff';
        startBtn.style.border = 'none';
        startBtn.style.borderRadius = '6px';
        startBtn.style.cursor = 'pointer';

        // Insert the button right after the header
        header.parentNode.insertBefore(startBtn, header.nextSibling);

        // Click logic: select and click all offer buttons
        startBtn.onclick = function() {
            const buttons = document.querySelectorAll('button[type="button"][data-testid="merchantOfferListAddButton"][title="add to list card"]');
            buttons.forEach(btn => btn.click());
        };
    }

    // Wait for the container and header to appear
    function waitForContainer() {
        const container = document.querySelector('[data-testid="recommendedOffersContainer"]');
        if (container && container.querySelector('h2')) {
            insertStartButton();
        } else {
            setTimeout(waitForContainer, 500); // Retry after 0.5 seconds
        }
    }

    waitForContainer();
})();
