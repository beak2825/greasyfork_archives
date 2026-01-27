// ==UserScript==
// @name         Faster Vault Deposits
// @namespace    https://greasyfork.org/en/users/1469540-davrone
// @version      1.1
// @description  Draggable button that deposits all cash to faction vault - opens in new window and autofills amount to max
// @author       Tornholio
// @match        https://www.torn.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/554799/Faster%20Vault%20Deposits.user.js
// @updateURL https://update.greasyfork.org/scripts/554799/Faster%20Vault%20Deposits.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const POSITION_KEY = 'tornVaultButtonPosition';
    const DEPOSIT_AMOUNT_KEY = 'tornVaultDepositAmount';
    const DEBUG = true;

    function log(...args) {
        if (DEBUG) console.log('[Vault Script]', ...args);
    }

    // Get position from storage with safety check
    let buttonPosition = GM_getValue(POSITION_KEY, { top: 20, right: 20 });
    
    // Validate position is on-screen
    function validatePosition(pos) {
        const maxWidth = window.innerWidth;
        const maxHeight = window.innerHeight;
        
        if (pos.left && pos.left > maxWidth - 100) return false;
        if (pos.right && pos.right > maxWidth - 100) return false;
        if (pos.top && pos.top > maxHeight - 100) return false;
        if (pos.bottom && pos.bottom > maxHeight - 100) return false;
        
        return true;
    }
    
    if (!validatePosition(buttonPosition)) {
        log('Saved position invalid, resetting to default');
        buttonPosition = { top: 20, right: 20 };
        GM_setValue(POSITION_KEY, buttonPosition);
    }

    // Dragging state
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };

    // Create the floating button
    function createDepositButton() {
        if (document.getElementById('quick-vault-deposit')) {
            log('Button already exists');
            return;
        }

        log('Creating vault button...');

        const button = document.createElement('button');
        button.id = 'quick-vault-deposit';
        button.innerHTML = 'VAULT';

        const pos = buttonPosition;
        button.style.cssText = `
            position: fixed;
            ${pos.bottom !== undefined ? `bottom: ${pos.bottom}px;` : ''}
            ${pos.top !== undefined ? `top: ${pos.top}px;` : ''}
            ${pos.right !== undefined ? `right: ${pos.right}px;` : ''}
            ${pos.left !== undefined ? `left: ${pos.left}px;` : ''}
            z-index: 99999;
            padding: 8px 18px;
            background: #1f2937;
            color: #fbbf24 !important;
            border: 1px solid #374151;
            border-radius: 3px;
            cursor: move;
            font-weight: 600;
            font-size: 12px;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            box-shadow: 0 1px 3px rgba(0,0,0,0.3);
            transition: all 0.2s ease;
            user-select: none;
            font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif;
        `;

        button.onmouseenter = () => {
            if (!isDragging) {
                button.style.background = '#374151';
                button.style.borderColor = '#6b7280';
                button.style.boxShadow = '0 3px 6px rgba(0,0,0,0.25)';
            }
        };

        button.onmouseleave = () => {
            if (!isDragging) {
                button.style.background = '#1f2937';
                button.style.borderColor = '#374151';
                button.style.boxShadow = '0 1px 3px rgba(0,0,0,0.3)';
            }
        };

        button.onclick = (e) => {
            if (!isDragging) {
                handleDeposit();
            }
        };

        button.oncontextmenu = (e) => {
            e.preventDefault();
            buttonPosition = { top: 20, right: 20 };
            GM_setValue(POSITION_KEY, buttonPosition);
            button.style.top = '20px';
            button.style.right = '20px';
            button.style.left = 'auto';
            button.style.bottom = 'auto';
            log('Position reset to default');
            return false;
        };

        button.onmousedown = (e) => {
            if (e.button === 0) {
                isDragging = true;
                button.style.cursor = 'grabbing';
                button.style.transition = 'none';
                button.style.opacity = '0.8';

                const rect = button.getBoundingClientRect();
                dragOffset.x = e.clientX - rect.left;
                dragOffset.y = e.clientY - rect.top;

                e.preventDefault();
            }
        };

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const x = e.clientX - dragOffset.x;
                const y = e.clientY - dragOffset.y;

                button.style.left = x + 'px';
                button.style.top = y + 'px';
                button.style.right = 'auto';
                button.style.bottom = 'auto';
            }
        });

        document.addEventListener('mouseup', (e) => {
            if (isDragging) {
                isDragging = false;
                button.style.cursor = 'move';
                button.style.transition = 'all 0.2s ease';
                button.style.opacity = '1';

                const rect = button.getBoundingClientRect();
                const windowWidth = window.innerWidth;
                const windowHeight = window.innerHeight;

                const distanceToLeft = rect.left;
                const distanceToRight = windowWidth - rect.right;
                const distanceToTop = rect.top;
                const distanceToBottom = windowHeight - rect.bottom;

                const newPosition = {};

                if (distanceToLeft < distanceToRight) {
                    newPosition.left = Math.round(rect.left);
                } else {
                    newPosition.right = Math.round(distanceToRight);
                }

                if (distanceToTop < distanceToBottom) {
                    newPosition.top = Math.round(rect.top);
                } else {
                    newPosition.bottom = Math.round(distanceToBottom);
                }

                buttonPosition = newPosition;
                GM_setValue(POSITION_KEY, newPosition);

                button.style.left = newPosition.left !== undefined ? newPosition.left + 'px' : 'auto';
                button.style.right = newPosition.right !== undefined ? newPosition.right + 'px' : 'auto';
                button.style.top = newPosition.top !== undefined ? newPosition.top + 'px' : 'auto';
                button.style.bottom = newPosition.bottom !== undefined ? newPosition.bottom + 'px' : 'auto';
            }
        });

        try {
            document.body.appendChild(button);
            log('Button created and appended successfully');
        } catch (error) {
            log('Error appending button:', error);
        }
    }

    // Get current cash from page
    function getCashOnHand() {
        log('Attempting to find cash on hand...');
        
        try {
            const userInfo = document.querySelector('[class*="user-information"]') || 
                           document.querySelector('[class*="userInfo"]') ||
                           document.querySelector('.user-info');
            
            if (userInfo) {
                log('Found user info container');
                const moneyElements = userInfo.querySelectorAll('span, div, li');
                for (const el of moneyElements) {
                    const text = el.textContent.trim();
                    if (text.includes('$')) {
                        const match = text.match(/\$([0-9,]+)/);
                        if (match) {
                            const amount = parseInt(match[1].replace(/,/g, ''));
                            if (!isNaN(amount) && amount >= 0) {
                                log('Found cash via user info:', amount);
                                return amount;
                            }
                        }
                    }
                }
            }
        } catch (e) {
            log('Strategy 1 failed:', e);
        }

        try {
            if (window.torn && window.torn.user && window.torn.user.money) {
                const amount = parseInt(window.torn.user.money);
                if (!isNaN(amount)) {
                    log('Found cash via torn API:', amount);
                    return amount;
                }
            }
        } catch (e) {
            log('Strategy 2 failed:', e);
        }

        try {
            const moneyEl = document.querySelector('[data-money], [data-cash], [data-amount]');
            if (moneyEl) {
                const amount = parseInt(moneyEl.dataset.money || moneyEl.dataset.cash || moneyEl.dataset.amount);
                if (!isNaN(amount)) {
                    log('Found cash via data attribute:', amount);
                    return amount;
                }
            }
        } catch (e) {
            log('Strategy 3 failed:', e);
        }

        log('Could not find cash amount on page');
        return null;
    }

    // Handle the deposit action
    function handleDeposit() {
        const button = document.getElementById('quick-vault-deposit');
        const originalText = button.innerHTML;
        button.innerHTML = '⏳ Opening...';
        button.disabled = true;

        try {
            let cashOnHand = getCashOnHand();
            
            if (cashOnHand !== null && cashOnHand >= 0) {
                log('Storing cash amount:', cashOnHand);
                GM_setValue(DEPOSIT_AMOUNT_KEY, cashOnHand);
                GM_setValue('tornVaultDepositTimestamp', Date.now());
            } else {
                log('No cash amount found, will try to read from faction page');
                GM_setValue(DEPOSIT_AMOUNT_KEY, null);
            }

            window.open('https://www.torn.com/factions.php?step=your#/tab=armoury', '_blank');

            setTimeout(() => {
                button.innerHTML = originalText;
                button.disabled = false;
            }, 1500);

        } catch (error) {
            log('Vault deposit error:', error);
            button.innerHTML = originalText;
            button.disabled = false;
        }
    }

    // Auto-fill and submit if we're on the faction deposit page
    function checkAndAutoDeposit() {
        if (!window.location.href.includes('factions.php?step=your')) {
            return;
        }

        log('On faction page, checking for deposit...');

        let depositAmount = GM_getValue(DEPOSIT_AMOUNT_KEY, null);
        const timestamp = GM_getValue('tornVaultDepositTimestamp', 0);
        const timeSinceClick = Date.now() - timestamp;

        if (timeSinceClick > 10000) {
            log('No recent vault button click detected');
            return;
        }

        log('Recent vault click detected, deposit amount:', depositAmount);

        if (depositAmount !== null && depositAmount >= 0) {
            log('Using stored amount:', depositAmount);
            GM_setValue(DEPOSIT_AMOUNT_KEY, null);
            setTimeout(() => fillAndSubmitDepositForm(depositAmount), 800);
            return;
        }

        log('No stored amount, trying to read from faction page...');
        
        let attempts = 0;
        const maxAttempts = 15;
        
        const findBalance = () => {
            attempts++;
            log(`Attempt ${attempts} to find balance...`);

            let foundAmount = null;

            const pageText = document.body.textContent;
            let match = pageText.match(/You have \$([0-9,]+)/i);
            if (match) {
                foundAmount = parseInt(match[1].replace(/,/g, ''));
                log('Found via "You have" text:', foundAmount);
            }

            if (!foundAmount) {
                match = pageText.match(/balance[:\s]+\$([0-9,]+)/i);
                if (match) {
                    foundAmount = parseInt(match[1].replace(/,/g, ''));
                    log('Found via balance text:', foundAmount);
                }
            }

            if (!foundAmount) {
                foundAmount = getCashOnHand();
                if (foundAmount) {
                    log('Found via getCashOnHand:', foundAmount);
                }
            }

            if (foundAmount !== null && !isNaN(foundAmount)) {
                log('Successfully found amount:', foundAmount);
                setTimeout(() => fillAndSubmitDepositForm(foundAmount), 400);
            } else if (attempts < maxAttempts) {
                setTimeout(findBalance, 300);
            } else {
                log('Could not find balance amount after', maxAttempts, 'attempts');
            }
        };

        findBalance();
    }

    // Fill deposit form with AGGRESSIVE React state manipulation
    function fillAndSubmitDepositForm(amount) {
        log('Attempting to fill deposit form with amount:', amount);

        let attempts = 0;
        const maxAttempts = 25;

        const tryFillAndSubmit = () => {
            attempts++;
            log(`Fill attempt ${attempts}...`);

            let moneyInput = null;

            const depositElements = Array.from(document.querySelectorAll('*')).filter(el => 
                el.textContent.includes('DEPOSIT MONEY') && el.offsetParent !== null
            );

            for (const depositEl of depositElements) {
                log('Found DEPOSIT MONEY element');
                let parent = depositEl;
                for (let i = 0; i < 5; i++) {
                    parent = parent.parentElement;
                    if (!parent) break;
                    
                    const input = parent.querySelector('input[type="number"], input[type="text"], input:not([type])');
                    if (input && input.offsetParent !== null && !input.placeholder?.toLowerCase().includes('search')) {
                        log('Found input near DEPOSIT MONEY');
                        moneyInput = input;
                        break;
                    }
                }
                if (moneyInput) break;
            }

            if (!moneyInput) {
                const inputs = document.querySelectorAll('input[type="number"], input[name*="money" i], input[name*="amount" i]');
                for (const input of inputs) {
                    if (input.offsetParent !== null && !input.disabled && !input.readOnly) {
                        log('Found candidate input:', input.name || input.id || 'unnamed');
                        moneyInput = input;
                        break;
                    }
                }
            }

            if (!moneyInput) {
                const armorySection = document.querySelector('[class*="armoury"], [class*="armory"], [id*="armoury"], [id*="armory"]');
                if (armorySection) {
                    log('Found armory section');
                    const input = armorySection.querySelector('input[type="number"], input[type="text"]');
                    if (input && input.offsetParent !== null) {
                        log('Found input in armory section');
                        moneyInput = input;
                    }
                }
            }

            if (moneyInput) {
                log('Successfully found input field, filling with:', amount);
                
                // NUCLEAR OPTION: Character-by-character typing with React event simulation
                simulateUserTyping(moneyInput, amount.toString());
                
            } else {
                log(`Attempt ${attempts}: Money input not found yet`);
                if (attempts < maxAttempts) {
                    setTimeout(tryFillAndSubmit, 250);
                } else {
                    log('ERROR: Could not find deposit input field after', maxAttempts, 'attempts');
                }
            }
        };

        tryFillAndSubmit();
    }

    // Simulate realistic user typing to trigger React's state updates
    function simulateUserTyping(input, text) {
        log('Starting character-by-character typing simulation');
        
        // Get the native setter
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            'value'
        ).set;

        // Focus the input first
        input.focus();
        input.click();
        
        // Clear the field
        nativeInputValueSetter.call(input, '');
        input.dispatchEvent(new Event('input', { bubbles: true }));
        
        let index = 0;
        
        const typeNextChar = () => {
            if (index < text.length) {
                // Get current value and add next character
                const currentValue = input.value;
                const newValue = currentValue + text[index];
                
                // Set value using native setter
                nativeInputValueSetter.call(input, newValue);
                
                // Create and dispatch input event
                const inputEvent = new Event('input', { bubbles: true, cancelable: true });
                
                // Set the inputType to simulate keyboard input
                Object.defineProperty(inputEvent, 'inputType', {
                    value: 'insertText',
                    writable: false
                });
                Object.defineProperty(inputEvent, 'data', {
                    value: text[index],
                    writable: false
                });
                
                input.dispatchEvent(inputEvent);
                
                // Also dispatch keydown/keyup for good measure
                const keyCode = text[index].charCodeAt(0);
                input.dispatchEvent(new KeyboardEvent('keydown', { 
                    key: text[index], 
                    keyCode: keyCode,
                    bubbles: true 
                }));
                input.dispatchEvent(new KeyboardEvent('keyup', { 
                    key: text[index], 
                    keyCode: keyCode,
                    bubbles: true 
                }));
                
                index++;
                
                // Continue typing with small delay
                setTimeout(typeNextChar, 30);
                
            } else {
                // Finished typing
                log('Finished typing, final value:', input.value);
                
                // Fire change event
                input.dispatchEvent(new Event('change', { bubbles: true }));
                
                // Blur then focus to ensure React updates
                input.blur();
                setTimeout(() => {
                    input.focus();
                    
                    // Highlight the input
                    input.style.transition = 'border-color 0.3s, box-shadow 0.3s';
                    input.style.borderColor = '#10b981';
                    input.style.boxShadow = '0 0 10px rgba(16, 185, 129, 0.5)';
                    
                    setTimeout(() => {
                        input.style.borderColor = '';
                        input.style.boxShadow = '';
                    }, 2000);
                    
                    log('Deposit form filled successfully');
                }, 50);
            }
        };
        
        // Start typing after small delay
        setTimeout(typeNextChar, 100);
    }

    // Initialize when page loads
    function init() {
        log('Initializing Vault Deposit script...');
        
        const waitForBody = setInterval(() => {
            if (document.body) {
                clearInterval(waitForBody);
                createDepositButton();
                checkAndAutoDeposit();
            }
        }, 100);
        
        setTimeout(() => clearInterval(waitForBody), 5000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();