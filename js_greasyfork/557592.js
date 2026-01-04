// ==UserScript==
// @name         Bazaar RRP to Price (DESKTOP)
// @version      2025-12-02
// @description  Adds an UPDATE button to copy all RRP values to price inputs in one click. Works in Desktop View only. No API required.
// @author       Alakazou [3652004]
// @license      MIT License
// @match        https://www.torn.com/bazaar.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @run-at       document-idle
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @namespace    https://greasyfork.org/users/1543626
// @downloadURL https://update.greasyfork.org/scripts/557592/Bazaar%20RRP%20to%20Price%20%28DESKTOP%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557592/Bazaar%20RRP%20to%20Price%20%28DESKTOP%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function copyRrpToPrices() {
        // Find all item rows using stable data-testid attribute
        const items = document.querySelectorAll('[data-testid^="item-"]');

        items.forEach(item => {
            // Find element containing RRP (starts with $, inside a div with class starting with "rrp")
            const rrpElement = item.querySelector('[class^="rrp"]');
            if (!rrpElement) return;

            // Remove $ and commas, parse as number
            const rrpText = rrpElement.textContent.replace(/[$,]/g, '');
            const rrpValue = parseInt(rrpText, 10);

            if (isNaN(rrpValue)) return;

            // Find the visible price input using stable data-testid
            const priceInput = item.querySelector('[data-testid="legacy-money-input"]:not([type="hidden"])');
            if (!priceInput) return;

            // Set the value
            priceInput.value = rrpValue;

            // Dispatch input event to trigger any listeners
            priceInput.dispatchEvent(new Event('input', { bubbles: true }));
            priceInput.dispatchEvent(new Event('change', { bubbles: true }));
        });

        console.log('RRP values copied to price inputs');
    }

    function addUpdateButton() {
        // Find the confirmation area with Save/Undo buttons
        const confirmationArea = document.querySelector('[class^="confirmation"]');
        if (!confirmationArea) return false;

        // Check if button already exists
        if (document.getElementById('rrp-update-btn')) return true;

        // Create the UPDATE button
        const updateBtn = document.createElement('button');
        updateBtn.id = 'rrp-update-btn';
        updateBtn.type = 'button';
        updateBtn.textContent = 'UPDATE';
        updateBtn.className = 'torn-btn silver';
        updateBtn.style.marginLeft = '10px';

        updateBtn.addEventListener('click', function(e) {
            e.preventDefault();
            copyRrpToPrices();
        });

        // Insert after the Undo button
        confirmationArea.appendChild(updateBtn);
        console.log('UPDATE button added');
        return true;
    }

    // Use MutationObserver to detect when React renders the content
    const observerTarget = document.querySelector('.content-wrapper') || document.body;
    const observer = new MutationObserver(function(mutations) {
        addUpdateButton();
    });

    observer.observe(observerTarget, {
        childList: true,
        subtree: true
    });

    // Also try immediately in case content is already loaded
    addUpdateButton();
})();
