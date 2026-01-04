// ==UserScript==
// @name         Torn Vault Withdrawal Autofill Buttons
// @namespace    http://tornexpress.co.za/
// @version      1.6
// @description  Adds autofill buttons for vault withdrawals
// @author       SAShapeShifter
// @match        https://www.torn.com/properties.php*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556854/Torn%20Vault%20Withdrawal%20Autofill%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/556854/Torn%20Vault%20Withdrawal%20Autofill%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Vault Autofill: Script started');

    //Customise these values to your liking
    const buttonValues = [3000000,300000,1000000, 5000000, 10000000,20000000,100000000];

    // Create container for buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
        display: none;
        gap: 10px;
        margin: 10px 0;
    `;
    buttonContainer.className = 'vault-autofill-buttons';

    // Add buttons
    buttonValues.forEach((value) => {
        const button = document.createElement('button');
        button.textContent = value.toLocaleString();
        button.style.cssText = `
            padding: 8px 16px;
            background-color: #333;
            color: #fff;
            border: 1px solid #555;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        `;
        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = '#444';
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = '#333';
        });
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const input = document.querySelector('input.input-money');
            if (input) {
                input.value = value;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
                input.focus();
                console.log(`Vault Autofill: Set input value to ${value}`);
            } else {
                console.log('Vault Autofill: Input with class "input-money" not found');
            }
        });
        buttonContainer.appendChild(button);
    });

    // Function to place buttons after "Extra large vault" heading
    function placeButtons() {
        if (!window.location.hash.includes('p=options') || !window.location.hash.includes('tab=vault')) {
            console.log('Vault Autofill: Not on vault tab, hiding buttons');
            buttonContainer.style.display = 'none';
            return;
        }

        console.log('Vault Autofill: On vault tab, checking for heading');
        const heading = Array.from(document.querySelectorAll('div.title-black.top-round.m-top10[role="heading"]')).find(
            el => el.textContent.trim() === 'Extra large vault'
        );
        if (heading) {
            console.log('Vault Autofill: Found "Extra large vault" heading');
            const existingContainer = heading.nextElementSibling;
            if (existingContainer && existingContainer.classList.contains('vault-autofill-buttons')) {
                console.log('Vault Autofill: Buttons already added after heading, skipping');
                return;
            }
            buttonContainer.style.display = 'flex';
            heading.insertAdjacentElement('afterend', buttonContainer);
            console.log('Vault Autofill: Buttons added after heading');
        } else {
            console.log('Vault Autofill: Heading not found');
            buttonContainer.style.display = 'none';
        }
    }

    // Append container to body (will be moved if heading is found)
    document.body.appendChild(buttonContainer);

    // Initial check
    placeButtons();

    // Observe DOM changes and hash changes
    const observer = new MutationObserver(() => {
        console.log('Vault Autofill: DOM changed, rechecking');
        placeButtons();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('hashchange', () => {
        console.log('Vault Autofill: Hash changed to ' + window.location.hash);
        placeButtons();
    });

    console.log('Vault Autofill: Script initialized');
})();