// ==UserScript==
// @name         Solidgate: No Domain Email Search
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a button to search by email without the domain part on Solidgate Hub.
// @match        https://hub.solidgate.com/payments/order*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564350/Solidgate%3A%20No%20Domain%20Email%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/564350/Solidgate%3A%20No%20Domain%20Email%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to handle the URL change logic
    function searchWithoutDomain() {
        const emailInput = document.querySelector('input[name="customerEmail"]');
        if (!emailInput || !emailInput.value) {
            alert("Please enter an email first.");
            return;
        }

        // Get the value before the @ symbol
        const emailValue = emailInput.value.trim();
        const noDomainValue = emailValue.split('@')[0];

        // Construct the new URL
        const url = new URL(window.location.href);
        url.searchParams.set('customer_email', noDomainValue);

        // Redirect to the new URL
        window.location.href = url.toString();
    }

    // Function to inject the button next to the input field
    function injectButton() {
        // Check if button already exists to avoid duplicates
        if (document.getElementById('no-domain-btn')) return;

        const emailInput = document.querySelector('input[name="customerEmail"]');

        if (emailInput) {
            const btn = document.createElement('button');
            btn.id = 'no-domain-btn';
            btn.type = 'button';
            btn.innerText = 'No domain';

            // Basic styling to match a dashboard look
            btn.style.marginLeft = '10px';
            btn.style.padding = '4px 10px';
            btn.style.cursor = 'pointer';
            btn.style.backgroundColor = '#f0f0f0';
            btn.style.border = '1px solid #ccc';
            btn.style.borderRadius = '4px';
            btn.style.fontSize = '12px';

            btn.addEventListener('click', searchWithoutDomain);

            // Insert button right after the input field
            emailInput.parentNode.insertBefore(btn, emailInput.nextSibling);
        }
    }

    // Since many dashboards load content dynamically (SPA),
    // we check for the element every second.
    setInterval(injectButton, 1000);
})();