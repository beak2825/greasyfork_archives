// ==UserScript==
// @name         Faction Deposit Helper (Keep 100k, No API)
// @version      1.15
// @description  Adds a button to faction armory page to calculate, set text input, and submit deposit over 3 clicks (manual initiation)
// @author       AeC3
// @match        https://www.torn.com/factions.php?step=your*
// @license      MIT
// @namespace AeC3
// @downloadURL https://update.greasyfork.org/scripts/550392/Faction%20Deposit%20Helper%20%28Keep%20100k%2C%20No%20API%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550392/Faction%20Deposit%20Helper%20%28Keep%20100k%2C%20No%20API%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const KEEP_ON_HAND = 100000; // 100k
    const MAX_CLICKS = 3; // Max clicks per deposit cycle
    let clickCount = 0;
    let depositAmount = 0;

    // Function to extract cash from text input's data-money attribute
    function getCashBalance() {
        const textInput = document.querySelector('input.amount.input-money[type="text"]');
        if (!textInput || !textInput.dataset.money) {
            return 0;
        }
        // Extract number (e.g., "118,300" -> 118300)
        const cashText = textInput.dataset.money.replace(/[^0-9]/g, '');
        return parseInt(cashText, 10) || 0;
    }

    // Create button (on armory page)
    if (window.location.pathname.includes('factions.php') && window.location.search.includes('step=your')) {
        const button = document.createElement('button');
        button.id = 'depositHelperBtn';
        button.innerHTML = `Deposit (0/${MAX_CLICKS})`;
        button.style.cssText = `
            position: fixed; top: 50px; right: 10px; z-index: 9999;
            background: #007BFF; color: white; padding: 10px 15px; border: none;
            border-radius: 5px; cursor: pointer; font-size: 14px;
        `;
        button.onclick = handleClick;
        document.body.appendChild(button);

        function handleClick() {
            clickCount++;
            button.innerHTML = `Deposit (${clickCount}/${MAX_CLICKS})`;

            if (clickCount === 1) {
                // First click: Calculate and set text input
                const cash = getCashBalance();
                depositAmount = Math.max(0, cash - KEEP_ON_HAND);
                if (depositAmount <= 0) {
                    clickCount = 0; // Reset
                    button.innerHTML = `Deposit (0/${MAX_CLICKS})`;
                    return;
                }

                // Find text input
                const textInput = document.querySelector('input.amount.input-money[type="text"]');
                if (!textInput) {
                    clickCount = 0; // Reset
                    button.innerHTML = `Deposit (0/${MAX_CLICKS})`;
                    return;
                }
                // Set text input value and trigger input event
                textInput.value = depositAmount;
                textInput.focus();
                const inputEvent = new Event('input', { bubbles: true });
                textInput.dispatchEvent(inputEvent);

            } else if (clickCount === 2) {
                // Second click: Click DEPOSIT MONEY button with exact text
                const buttons = document.querySelectorAll('button.torn-btn');
                let depositButton = null;
                buttons.forEach(btn => {
                    if (btn.textContent.trim() === 'DEPOSIT MONEY') {
                        depositButton = btn;
                    }
                });
                if (!depositButton || depositButton.disabled) {
                    clickCount = 0; // Reset
                    button.innerHTML = `Deposit (0/${MAX_CLICKS})`;
                    return;
                }
                depositButton.click();

            } else if (clickCount === 3) {
                // Third click: Click Yes confirmation
                const confirmButton = document.querySelector('a.yes.bold.t-blue.h.c-pointer');
                if (!confirmButton) {
                    clickCount = 0; // Reset
                    button.innerHTML = `Deposit (0/${MAX_CLICKS})`;
                    return;
                }
                confirmButton.click();
                clickCount = 0; // Reset for next cycle
                button.innerHTML = `Deposit (0/${MAX_CLICKS})`;
            }
        }
    }
})();