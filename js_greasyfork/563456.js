// ==UserScript==
// @name         Rem4rk's Bazaar Price Adjuster
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adjust bazaar prices based on RRP percentage
// @author       rem4rk [2375926] - https://www.torn.com/profiles.php?XID=2375926
// @match        https://www.torn.com/bazaar.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563456/Rem4rk%27s%20Bazaar%20Price%20Adjuster.user.js
// @updateURL https://update.greasyfork.org/scripts/563456/Rem4rk%27s%20Bazaar%20Price%20Adjuster.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentOperation = null;
    let hasAutoLoaded = false;
    let hasUserInteracted = false;
    const STORAGE_KEY = 'torn_bazaar_rrp_values';

    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #rrp-dropdown {
                background: linear-gradient(to bottom, #e8e8e8 0%, #d0d0d0 100%);
                color: #333;
                border: 1px solid #aaa;
                border-radius: 3px;
                padding: 6px 12px;
                cursor: pointer;
                font-weight: 500;
                font-size: 11px;
                text-transform: uppercase;
                box-shadow: 0 1px 2px rgba(0,0,0,0.1);
                height: 28px;
            }

            #rrp-dropdown option {
                background-color: #2a2a2a;
                color: #ffffff;
                padding: 5px;
            }

            #rrp-dropdown:hover {
                background: linear-gradient(to bottom, #f0f0f0 0%, #d8d8d8 100%);
                border-color: #999;
            }

            #rrp-dropdown:active {
                background: linear-gradient(to bottom, #d0d0d0 0%, #e8e8e8 100%);
            }

            #rrp-settings-btn {
                background: linear-gradient(to bottom, #e8e8e8 0%, #d0d0d0 100%);
                color: #333;
                border: 1px solid #aaa;
                border-radius: 3px;
                padding: 6px 12px;
                cursor: pointer;
                font-weight: 500;
                font-size: 14px;
                box-shadow: 0 1px 2px rgba(0,0,0,0.1);
                height: 28px;
                width: 32px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                vertical-align: middle;
            }

            #rrp-settings-btn:hover {
                background: linear-gradient(to bottom, #f0f0f0 0%, #d8d8d8 100%);
                border-color: #999;
            }

            #rrp-settings-popup {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #fff;
                border: 2px solid #333;
                border-radius: 5px;
                padding: 20px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                z-index: 10000;
                width: 500px;
                max-width: 90%;
            }

            #rrp-settings-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 9999;
            }

            .rrp-popup-header {
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 15px;
                color: #333;
            }

            .rrp-popup-description {
                margin-bottom: 15px;
                color: #666;
                font-size: 13px;
                line-height: 1.5;
            }

            .rrp-popup-input {
                width: 100%;
                padding: 8px;
                border: 1px solid #aaa;
                border-radius: 3px;
                font-size: 13px;
                margin-bottom: 15px;
                box-sizing: border-box;
            }

            .rrp-popup-buttons {
                display: flex;
                gap: 10px;
                justify-content: flex-end;
            }

            .rrp-popup-btn {
                background: linear-gradient(to bottom, #e8e8e8 0%, #d0d0d0 100%);
                color: #333;
                border: 1px solid #aaa;
                border-radius: 3px;
                padding: 8px 16px;
                cursor: pointer;
                font-weight: 500;
                font-size: 11px;
                text-transform: uppercase;
            }

            .rrp-popup-btn:hover {
                background: linear-gradient(to bottom, #f0f0f0 0%, #d8d8d8 100%);
            }

            .rrp-popup-btn.primary {
                background: linear-gradient(to bottom, #4a9eff 0%, #3a8eef 100%);
                color: #fff;
                border-color: #2a7edf;
            }

            .rrp-popup-btn.primary:hover {
                background: linear-gradient(to bottom, #5aaeff 0%, #4a9eff 100%);
            }

            .rrp-example {
                background: #f5f5f5;
                padding: 10px;
                border-radius: 3px;
                margin-bottom: 15px;
                font-size: 12px;
                color: #555;
            }

            .rrp-warning {
                background: #fff3cd;
                border: 1px solid #ffc107;
                padding: 10px;
                border-radius: 3px;
                margin-bottom: 15px;
                font-size: 12px;
                color: #856404;
            }
        `;
        document.head.appendChild(style);
    }

    function getStoredValues() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error('Error parsing stored values:', e);
            }
        }
        // Default values
        return [0, -1, -2, -3, -4, -5, -7, -8, -9, -10];
    }

    function saveValues(values) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    }

    function parseUserInput(input) {
        const values = input.split(',')
            .map(v => v.trim())
            .filter(v => v !== '')
            .map(v => {
                // Remove % if present
                const cleaned = v.replace('%', '');
                const num = parseFloat(cleaned);
                return isNaN(num) ? null : num;
            })
            .filter(v => v !== null);

        // Remove duplicates and sort
        return [...new Set(values)].sort((a, b) => b - a);
    }

    function formatValue(value) {
        if (value === 0) {
            return hasUserInteracted ? 'RRP' : 'RRP - Click to Adjust';
        }
        if (value > 0) return `RRP +${value}%`;
        return `RRP ${value}%`;
    }

    function createDropdown() {
        const confirmationDiv = document.querySelector('.confirmation___eWdQi');
        if (!confirmationDiv) return;

        // Check if dropdown already exists
        if (document.getElementById('rrp-dropdown')) return;

        const container = document.createElement('div');
        container.style.display = 'inline-block';
        container.style.marginLeft = '10px';

        // Create dropdown
        const dropdown = document.createElement('select');
        dropdown.id = 'rrp-dropdown';
        dropdown.className = 'torn-btn silver';

        updateDropdownOptions(dropdown);

        // Set initial value to 0 (RRP)
        dropdown.value = '0';

        dropdown.addEventListener('change', handleDropdownChange);

        // Create settings button
        const settingsBtn = document.createElement('button');
        settingsBtn.id = 'rrp-settings-btn';
        settingsBtn.type = 'button'; // Prevent form submission
        settingsBtn.className = 'torn-btn silver';
        settingsBtn.textContent = '⚙';
        settingsBtn.style.marginLeft = '5px';
        settingsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openSettingsPopup();
        });

        container.appendChild(dropdown);
        container.appendChild(settingsBtn);
        confirmationDiv.appendChild(container);

        // Auto-load RRP prices on first load
        if (!hasAutoLoaded) {
            hasAutoLoaded = true;
            setTimeout(() => {
                currentOperation = { percentage: 0, cancelled: false };
                updateAllPrices(currentOperation);
            }, 100);
        }
    }

    function updateDropdownOptions(dropdown) {
        const values = getStoredValues();
        const currentValue = dropdown.value;
        dropdown.innerHTML = '';

        values.forEach(value => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = formatValue(value);
            dropdown.appendChild(option);
        });

        // Restore selection if it exists, otherwise default to 0
        if (currentValue !== '' && values.includes(parseFloat(currentValue))) {
            dropdown.value = currentValue;
        } else {
            dropdown.value = '0';
        }
    }

    function openSettingsPopup() {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'rrp-settings-overlay';
        overlay.addEventListener('click', closeSettingsPopup);

        // Create popup
        const popup = document.createElement('div');
        popup.id = 'rrp-settings-popup';

        const currentValues = getStoredValues();
        const currentInput = currentValues.map(v => v > 0 ? `${v}` : `${v}`).join(', ');

        popup.innerHTML = `
            <div class="rrp-popup-header">Configure RRP Adjustments</div>
            <div class="rrp-popup-description">
                Enter your desired price adjustments separated by commas.
                Use positive numbers for markups and negative numbers for markdowns.
            </div>
            <div class="rrp-warning">
                <strong>⚠ Note:</strong> Any negative values below -99% will result in all prices being set to $1.
            </div>
            <div class="rrp-example">
                <strong>Examples:</strong><br>
                • <code>0, -5, -10, -15</code> → RRP, 5% off, 10% off, 15% off<br>
                • <code>5, 0, -5</code> → 5% markup, RRP, 5% off<br>
                • <code>10, 5, 0, -2.5, -5</code> → Mix of markups and markdowns<br>
                • <code>-99, -100, -500</code> → All result in $1 prices
            </div>
            <input type="text" class="rrp-popup-input" id="rrp-values-input"
                   placeholder="e.g., 0, -5, -10, -15" value="${currentInput}">
            <div class="rrp-popup-buttons">
                <button type="button" class="rrp-popup-btn" id="rrp-cancel-btn">Cancel</button>
                <button type="button" class="rrp-popup-btn primary" id="rrp-save-btn">Save</button>
            </div>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(popup);

        // Add event listeners to buttons
        document.getElementById('rrp-cancel-btn').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeSettingsPopup();
        });

        document.getElementById('rrp-save-btn').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            saveSettingsFromPopup();
        });

        // Focus input
        setTimeout(() => {
            document.getElementById('rrp-values-input').focus();
        }, 100);
    }

    function closeSettingsPopup() {
        const overlay = document.getElementById('rrp-settings-overlay');
        const popup = document.getElementById('rrp-settings-popup');
        if (overlay) overlay.remove();
        if (popup) popup.remove();
    }

    function saveSettingsFromPopup() {
        const input = document.getElementById('rrp-values-input');
        if (!input) return;

        const values = parseUserInput(input.value);

        if (values.length === 0) {
            alert('Please enter at least one valid value.');
            return;
        }

        // Ensure 0 (RRP) is always included
        if (!values.includes(0)) {
            values.push(0);
            values.sort((a, b) => b - a);
        }

        saveValues(values);

        // Update dropdown
        const dropdown = document.getElementById('rrp-dropdown');
        if (dropdown) {
            updateDropdownOptions(dropdown);
        }

        closeSettingsPopup();
    }

    function handleDropdownChange(event) {
        const selectedValue = event.target.value;
        const percentage = parseFloat(selectedValue);

        // Mark that user has interacted
        if (!hasUserInteracted) {
            hasUserInteracted = true;
            // Update the dropdown text for RRP option
            const dropdown = document.getElementById('rrp-dropdown');
            if (dropdown) {
                updateDropdownOptions(dropdown);
            }
        }

        // Cancel any existing operation
        if (currentOperation) {
            currentOperation.cancelled = true;
        }

        // Create new operation
        currentOperation = { percentage, cancelled: false };
        updateAllPrices(currentOperation);
    }

    async function updateAllPrices(operation) {
        const items = document.querySelectorAll('.item___jLJcf');

        for (let item of items) {
            // Check if operation was cancelled
            if (operation.cancelled) {
                console.log('Operation cancelled');
                return;
            }

            const rrpDiv = item.querySelector('.rrp___aiQg2');
            const priceInput = item.querySelector('.price___DoKP7 input[data-testid="legacy-money-input"]:not([type="hidden"])');

            if (!rrpDiv || !priceInput) continue;

            // Extract RRP value (remove $ and commas)
            const rrpText = rrpDiv.textContent.replace(/[$,]/g, '');
            const rrpValue = parseFloat(rrpText);

            if (isNaN(rrpValue)) continue;

            // Calculate new price
            let newPrice = Math.round(rrpValue * (1 + operation.percentage / 100));

            // Ensure price is at least $1
            if (newPrice < 1) {
                newPrice = 1;
            }

            // Set the input value
            priceInput.value = newPrice.toLocaleString();

            // Trigger input event to notify any listeners
            const inputEvent = new Event('input', { bubbles: true });
            priceInput.dispatchEvent(inputEvent);

            const changeEvent = new Event('change', { bubbles: true });
            priceInput.dispatchEvent(changeEvent);

            // Small delay to prevent overwhelming the page
            await new Promise(resolve => setTimeout(resolve, 10));
        }

        // Play ding sound if operation completed successfully
        if (!operation.cancelled) {
            playDingSound();
        }
    }

    function playDingSound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }

    // Initialize when page loads
    function init() {
        addStyles();

        // Wait for the page to load
        const checkInterval = setInterval(() => {
            const confirmationDiv = document.querySelector('.confirmation___eWdQi');
            if (confirmationDiv) {
                createDropdown();
                clearInterval(checkInterval);
            }
        }, 500);

        // Stop checking after 10 seconds
        setTimeout(() => clearInterval(checkInterval), 10000);
    }

    // Run on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Also watch for navigation changes (in case Torn uses dynamic loading)
    const observer = new MutationObserver(() => {
        if (window.location.href.includes('bazaar.php')) {
            createDropdown();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();