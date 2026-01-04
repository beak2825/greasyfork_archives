// ==UserScript==
// @name Torn Trade Autofill Buttons
// @namespace http://tornexpress.co.za/
// @version 4.6
// @description Adds autofill buttons, custom input, and multiplier buttons to trades for ghost trades
// @author SAShapeShifter
// @match https://www.torn.com/trade.php*
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556872/Torn%20Trade%20Autofill%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/556872/Torn%20Trade%20Autofill%20Buttons.meta.js
// ==/UserScript==
(function() {
    'use strict';
    console.log('Trade Autofill: Started at ' + new Date().toLocaleString());

    //Customise these values
    const buttonValues = [100000, 500000, 1000000, 5000000, 10000000, 20000000, 50000000];
    const multipliers = [1, 2, 3];
    let currentMultiplier = 1; // Default multiplier
    let initialAmount = 0; // Store initial value

    // Create container for multiplier buttons
    const multiplierContainer = document.createElement('div');
    multiplierContainer.className = 'trade-multiplier-container';
    multiplierContainer.style.display = 'none';
    multiplierContainer.style.flexWrap = 'wrap';
    multiplierContainer.style.gap = '10px';
    multiplierContainer.style.marginBottom = '10px';
    multiplierContainer.style.alignItems = 'center';
    multiplierContainer.style.marginTop = '20px';

    // Create multiplier buttons
    multipliers.forEach((multiplier) => {
        const button = document.createElement('button');
        button.textContent = multiplier + 'x';
        button.style.padding = '6px 12px';
        button.style.backgroundColor = multiplier === currentMultiplier ? '#555' : '#333';
        button.style.color = '#fff';
        button.style.border = '1px solid #555';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '12px';
        button.style.flex = '0 0 auto';
        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = '#444';
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = multiplier === currentMultiplier ? '#555' : '#333';
        });
        button.addEventListener('click', (e) => {
            e.preventDefault();
            currentMultiplier = multiplier;
            multiplierContainer.querySelectorAll('button').forEach(btn => {
                btn.style.backgroundColor = btn.textContent === multiplier + 'x' ? '#555' : '#333';
            });
            console.log('Trade Autofill: Multiplier set to ' + multiplier + 'x');
        });
        multiplierContainer.appendChild(button);
    });

    // Create container for buttons and input
    const container = document.createElement('div');
    container.className = 'trade-autofill-container';
    container.style.margin = '10px 0';
    container.style.display = 'none';
    container.style.flexWrap = 'wrap';
    container.style.gap = '10px';
    container.style.alignItems = 'center';
    container.style.maxWidth = '600px';

    // Create buttons
    buttonValues.forEach((value) => {
        const button = document.createElement('button');
        button.textContent = value.toLocaleString('en-US');
        button.style.padding = '8px 16px';
        button.style.backgroundColor = '#333';
        button.style.color = '#fff';
        button.style.border = '1px solid #555';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';
        button.style.flex = '1 0 18%';
        button.style.maxWidth = '110px';
        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = '#444';
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = '#333';
        });
        button.addEventListener('click', (e) => {
            e.preventDefault();
            updateInputValue(value * currentMultiplier);
            resetMultiplier();
        });
        container.appendChild(button);
    });

    // Create custom input field
    const customInput = document.createElement('input');
    customInput.type = 'text';
    customInput.placeholder = 'Enter amount (e.g., 600000)';
    customInput.style.padding = '8px';
    customInput.style.width = '150px';
    customInput.style.border = '1px solid #555';
    customInput.style.borderRadius = '4px';
    customInput.style.backgroundColor = '#222';
    customInput.style.color = '#fff';
    customInput.style.fontSize = '14px';
    customInput.style.flex = '0 0 auto';

    // Handle Enter key
    customInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const cleanedValue = customInput.value.replace(/,/g, '');
            if (!isNaN(cleanedValue) && cleanedValue !== '') {
                updateInputValue(parseInt(cleanedValue, 10) * currentMultiplier);
                customInput.value = '';
                resetMultiplier();
                console.log('Trade Autofill: Custom input processed');
            } else {
                console.log('Trade Autofill: Invalid custom input');
            }
        }
    });

    container.appendChild(customInput);

    // Create label for original amount
    const amountLabel = document.createElement('div');
    amountLabel.style.color = '#fff';
    amountLabel.style.fontSize = '12px';
    amountLabel.style.marginTop = '5px';
    amountLabel.textContent = 'Original Amount: $0';
    container.appendChild(amountLabel);

    // Function to update input value
    function updateInputValue(subtractAmount) {
        try {
            const visibleInput = document.querySelector('input.user-id.input-money:not([type="hidden"])');
            const hiddenInput = document.querySelector('input.user-id.input-money[type="hidden"][name="amount"]');
            if (!visibleInput || !hiddenInput) {
                console.log('Trade Autofill: Input(s) not found - visible: ' + !!visibleInput + ', hidden: ' + !!hiddenInput);
                return;
            }

            // Use initial value as the starting balance
            const currentBalance = initialAmount;
            const newValue = Math.max(0, currentBalance - subtractAmount); // Ensure subtraction
            visibleInput.value = newValue.toString();
            hiddenInput.value = newValue.toString();
            visibleInput.setAttribute('data-money', newValue.toString());
            hiddenInput.setAttribute('data-money', newValue.toString());
            console.log('Trade Autofill: Initial amount: ' + initialAmount + ', Subtracted: ' + subtractAmount + ', New value: ' + newValue + ', Type of subtractAmount: ' + typeof subtractAmount);
        } catch (error) {
            console.error('Trade Autofill: Error - ' + error.message);
        }
    }

    // Function to reset multiplier to 1x
    function resetMultiplier() {
        currentMultiplier = 1;
        multiplierContainer.querySelectorAll('button').forEach(btn => {
            btn.style.backgroundColor = btn.textContent === '1x' ? '#555' : '#333';
        });
        console.log('Trade Autofill: Multiplier reset to 1x');
    }

    // Function to place containers and capture initial amount
    function placeContainer() {
        if (!window.location.hash.includes('step=addmoney')) {
            multiplierContainer.style.display = 'none';
            container.style.display = 'none';
            console.log('Trade Autofill: Not on addmoney step');
            return;
        }

        const changeButtonWrap = document.querySelector('span.btn-wrap.silver');
        const visibleInput = document.querySelector('input.user-id.input-money:not([type="hidden"])');
        if (visibleInput && changeButtonWrap) {
            // Capture initial amount from value
            if (initialAmount === 0 && visibleInput.value) {
                const rawValue = visibleInput.value.replace(/,/g, '');
                initialAmount = parseInt(rawValue, 10);
                if (!isNaN(initialAmount)) {
                    amountLabel.textContent = 'Original Amount: $' + initialAmount.toLocaleString('en-US');
                    console.log('Trade Autofill: Captured initial amount from value: ' + initialAmount);
                } else {
                    console.log('Trade Autofill: Invalid initial value: ' + rawValue);
                }
            }

            const existingMultiplierContainer = changeButtonWrap.parentElement.querySelector('.trade-multiplier-container');
            const existingContainer = changeButtonWrap.parentElement.querySelector('.trade-autofill-container');
            if (!existingMultiplierContainer && !existingContainer) {
                changeButtonWrap.insertAdjacentElement('afterend', multiplierContainer);
                multiplierContainer.insertAdjacentElement('afterend', container);
                multiplierContainer.style.display = 'flex';
                container.style.display = 'flex';
                console.log('Trade Autofill: Containers added after Change button');
            } else {
                multiplierContainer.style.display = 'flex';
                container.style.display = 'flex';
                console.log('Trade Autofill: Containers already exist');
            }
        } else {
            multiplierContainer.style.display = 'none';
            container.style.display = 'none';
            console.log('Trade Autofill: Input or Change button not found - input: ' + !!visibleInput + ', button: ' + !!changeButtonWrap);
        }
    }

    // Append containers to body
    document.body.appendChild(multiplierContainer);
    document.body.appendChild(container);

    // Initial check with delay
    setTimeout(placeContainer, 5000);

    // Observe DOM changes
    const observer = new MutationObserver(() => {
        console.log('Trade Autofill: DOM changed, rechecking');
        placeContainer();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Listen for hash changes
    window.addEventListener('hashchange', () => {
        console.log('Trade Autofill: Hash changed to ' + window.location.hash);
        initialAmount = 0;
        amountLabel.textContent = 'Original Amount: $0';
        setTimeout(placeContainer, 5000);
    });

    console.log('Trade Autofill: Initialized');
})();