// ==UserScript==
// @name         Faster Vault Deposits
// @namespace    https://greasyfork.org/en/users/1469540-davrone
// @version      1.0
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

    // Get position from storage
    let buttonPosition = GM_getValue(POSITION_KEY, { top: 20, right: 20 });

    // Dragging state
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };

    // Create the floating button
    function createDepositButton() {
        const button = document.createElement('button');
        button.id = 'quick-vault-deposit';
        button.innerHTML = 'VAULT';

        // Apply saved position
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

        // Hover effect
        button.onmouseenter = () => {
            if (!isDragging) {
                button.style.background = '#374151';
                button.style.borderColor = '#6b7280';
                button.style.boxShadow = '0 3px 6px rgba(0,0,0,0.25)';
            }
        };

        button.onmouseleave = () => {
            if (!isDragging) {
                button.style.background = '#2d3748';
                button.style.borderColor = '#4a5568';
                button.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
            }
        };

        // Left click - deposit
        button.onclick = (e) => {
            if (!isDragging) {
                handleDeposit();
            }
        };

        // Dragging functionality
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

                // Save new position
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

        document.body.appendChild(button);
    }

    // Format number with commas
    function formatMoney(amount) {
        return '$' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    // Get current cash from page
    function getCashOnHand() {
        // Try multiple selector patterns for Torn's various layouts
        const selectors = [
            // Top user bar
            'li[id^="user-money"] span.bold',
            'li[id*="money"] span.bold',
            '#user-money span',
            'li.user-money span',
            // Generic money containers
            'div[class*="money"] span.bold',
            'div[class*="money"] span',
            'div[class*="userInfo"] span.bold',
            'span[class*="money"]',
            // User info bar variations
            'ul.user-info span.bold',
            '.user-info-value',
            // Direct text search as fallback
            'li:has([class*="money"])',
        ];

        for (const selector of selectors) {
            try {
                const elements = document.querySelectorAll(selector);
                for (const element of elements) {
                    const text = element.textContent || '';
                    // Look for dollar amounts
                    if (text.includes('$') || /^\d{1,3}(,\d{3})*$/.test(text.replace(/[$,]/g, ''))) {
                        const cashText = text.replace(/[$,]/g, '');
                        const cash = parseInt(cashText);
                        if (!isNaN(cash) && cash > 0 && cash < 1000000000000) { // Sanity check
                            console.log(`Found cash: $${cash} using selector: ${selector}`);
                            return cash;
                        }
                    }
                }
            } catch (e) {
                // Selector might not work, continue to next
            }
        }

        console.log('Could not find cash amount on page');
        return null;
    }

    // Handle the deposit action
    function handleDeposit() {
        const button = document.getElementById('quick-vault-deposit');
        const originalText = button.innerHTML;
        button.innerHTML = '⏳ Opening...';
        button.disabled = true;

        try {
            // Get current cash from the page
            let cashOnHand = getCashOnHand();

            if (cashOnHand && cashOnHand > 0) {
                // Save the amount to deposit if we found it
                GM_setValue(DEPOSIT_AMOUNT_KEY, cashOnHand);
            } else {
                // Still open the page, but user will need to enter amount manually
                GM_setValue(DEPOSIT_AMOUNT_KEY, null);
            }

            // Always open faction armory page in new window
            window.open('https://www.torn.com/factions.php?step=your#/tab=armoury', '_blank');

            setTimeout(() => {
                button.innerHTML = originalText;
                button.disabled = false;
            }, 1500);

        } catch (error) {
            console.error('Vault deposit error:', error);
            button.innerHTML = originalText;
            button.disabled = false;
        }
    }

    // Auto-fill and submit if we're on the faction deposit page
    function checkAndAutoDeposit() {
        // Check if we're on the faction page
        if (window.location.href.includes('factions.php?step=your')) {
            let depositAmount = GM_getValue(DEPOSIT_AMOUNT_KEY, null);

            // If we didn't get amount from previous page, try to read it from this page
            if (!depositAmount) {
                console.log('No stored amount, trying to read from faction page...');

                // Try multiple times to find the balance text
                let attempts = 0;
                const maxAttempts = 10;

                const findBalance = () => {
                    attempts++;

                    // Look for "You have $X,XXX and a balance of" text on faction page
                    const pageText = document.body.textContent;
                    const match = pageText.match(/You have \$([0-9,]+)/i);

                    if (match) {
                        depositAmount = parseInt(match[1].replace(/,/g, ''));
                        console.log('Found balance on faction page:', depositAmount);

                        // Clear the stored amount
                        GM_setValue(DEPOSIT_AMOUNT_KEY, null);

                        // Wait a moment for input field to be fully rendered
                        setTimeout(() => {
                            fillAndSubmitDepositForm(depositAmount);
                        }, 400);
                    } else if (attempts < maxAttempts) {
                        console.log(`Attempt ${attempts}: Balance text not found yet, retrying...`);
                        setTimeout(findBalance, 200);
                    } else {
                        console.log('Could not find balance amount after 10 attempts');
                    }
                };

                // Start immediately
                findBalance();
            } else {
                // We have stored amount from previous page
                // Clear the stored amount
                GM_setValue(DEPOSIT_AMOUNT_KEY, null);

                // Fill the form quickly
                setTimeout(() => {
                    fillAndSubmitDepositForm(depositAmount);
                }, 500);
            }
        }
    }

    // Fill and submit the deposit form
    function fillAndSubmitDepositForm(amount) {
        // Try multiple times in case the page is still loading
        let attempts = 0;
        const maxAttempts = 20;

        const tryFillAndSubmit = () => {
            attempts++;

            console.log(`Attempt ${attempts}: Looking for money input field...`);

            // Look for money input field with various selectors
            let moneyInput = null;

            // Try different selectors
            const selectors = [
                'input[name="money"]',
                'input[type="number"]',
                'input[placeholder*="money" i]',
                'input[placeholder*="amount" i]',
                'div:has(button:contains("DEPOSIT MONEY")) input',
                'input[class*="input"]',
                'input[type="text"]'
            ];

            for (const selector of selectors) {
                try {
                    const input = document.querySelector(selector);
                    if (input && input.offsetParent !== null) { // Check if visible
                        console.log(`Found input with selector: ${selector}`);
                        moneyInput = input;
                        break;
                    }
                } catch (e) {
                    // Continue to next selector
                }
            }

            // Fallback: find any input near the "DEPOSIT MONEY" button
            if (!moneyInput) {
                const depositButtons = Array.from(document.querySelectorAll('button, a'));
                for (const btn of depositButtons) {
                    if (btn.textContent.includes('DEPOSIT MONEY')) {
                        // Look for input near this button
                        const parent = btn.closest('div');
                        if (parent) {
                            const nearbyInput = parent.querySelector('input');
                            if (nearbyInput) {
                                console.log('Found input near DEPOSIT MONEY button');
                                moneyInput = nearbyInput;
                                break;
                            }
                        }
                    }
                }
            }

            if (moneyInput) {
                // Fill the input
                moneyInput.value = amount;
                moneyInput.dispatchEvent(new Event('input', { bubbles: true }));
                moneyInput.dispatchEvent(new Event('change', { bubbles: true }));
                moneyInput.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));

                console.log('Successfully filled deposit amount:', amount);

                // Highlight the input briefly
                moneyInput.style.transition = 'border-color 0.3s, box-shadow 0.3s';
                moneyInput.style.borderColor = '#10b981';
                moneyInput.style.boxShadow = '0 0 10px rgba(16, 185, 129, 0.5)';
                setTimeout(() => {
                    moneyInput.style.borderColor = '';
                    moneyInput.style.boxShadow = '';
                }, 2000);

                // Focus the input
                moneyInput.focus();

            } else {
                console.log(`Attempt ${attempts}: Money input not found yet`);
                if (attempts < maxAttempts) {
                    setTimeout(tryFillAndSubmit, 250);
                } else {
                    console.error('Could not find deposit input field after 20 attempts');
                }
            }
        };

        tryFillAndSubmit();
    }

    // Initialize when page loads
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                createDepositButton();
                checkAndAutoDeposit();
            });
        } else {
            createDepositButton();
            checkAndAutoDeposit();
        }
    }

    init();
})();