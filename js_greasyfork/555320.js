// ==UserScript==
// @name         owo.vg Captcha Poller (Simplified)
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  A simplified script that constantly checks for the captcha submit button at a random 2-4 second interval and clicks it when available. Includes an on/off checkbox toggle inside the QR window.
// @author       You
// @match        https://owo.vg/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/555320/owovg%20Captcha%20Poller%20%28Simplified%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555320/owovg%20Captcha%20Poller%20%28Simplified%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const LOG_PREFIX = "[owo.vg-Captcha-Poller]";
    const CAPTCHA_SUBMIT_SELECTOR = '#captcha-root > div:nth-child(1) > div:nth-child(2) > input:nth-child(2)';
    const QR_SUBMIT_BUTTON_SELECTOR = '#qr-actions-container'; // Selector for the QR 'Post' button

    let pollingIntervalId = null;
    let isPollingActive = false; // Default to true (checked)
    let isClicking = false;
    let qrObserver = null;


    // --- Utility Functions ---

    /**
     * Generates a random integer delay between min (2000ms) and max (4000ms) for the polling interval.
     * NOTE: Using your custom ranges from the previous version (1000-3000ms for click delay, 2000ms fixed interval)
     * @param {number} min - Minimum delay in milliseconds.
     * @param {number} max - Maximum delay in milliseconds.
     * @returns {number} The random delay in milliseconds.
     */
    function getRandomDelay(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    // --- Polling Logic ---

    /**
     * Schedules the next run of checkAndClickCaptcha using a 2000ms fixed interval.
     */
    function scheduleNextCheck() {
        if (!isPollingActive) {
            console.log(`${LOG_PREFIX} Polling disabled. Stopping scheduling.`);
            return;
        }

        // Using your fixed interval (2000ms) from your previous script's `scheduleNextCheck`
        const interval = 2000;

        pollingIntervalId = setTimeout(() => {
            checkAndClickCaptcha();
        }, interval);
    }


    /**
     * Checks for the presence of the enabled captcha submit button and clicks it with a random delay.
     */
    function checkAndClickCaptcha() {
        if (!isPollingActive) {
            return;
        }
        if (isClicking) {
            scheduleNextCheck();
            return;
        }

        const captchaSubmitButton = document.querySelector(CAPTCHA_SUBMIT_SELECTOR);

        if (captchaSubmitButton && !captchaSubmitButton.disabled) {
            isClicking = true;
            // Using your custom ranges from the previous version (1000-3000ms)
            const clickDelay = getRandomDelay(1000, 3000);

            console.log(`${LOG_PREFIX} Captcha button found and enabled. Waiting ${clickDelay}ms before clicking...`);

            setTimeout(() => {
                const button = document.querySelector(CAPTCHA_SUBMIT_SELECTOR);
                if (button && !button.disabled) {
                    button.click();
                    console.log(`${LOG_PREFIX} Click dispatched successfully.`);
                } else {
                     console.log(`${LOG_PREFIX} Captcha button disappeared before click dispatch.`);
                }

                isClicking = false;
                scheduleNextCheck();

            }, clickDelay);

        } else {
            scheduleNextCheck();
        }
    }


    // --- Checkbox Toggle Logic ---

    /**
     * Handles the state change of the checkbox.
     * @param {Event} event - The change event from the checkbox.
     */
    function handleCheckboxChange(event) {
        if (event.target.checked) {
            isPollingActive = true;
            console.log(`${LOG_PREFIX} Polling ENABLED by user. Starting check cycle...`);
            // Start the cycle
            checkAndClickCaptcha();
        } else {
            isPollingActive = false;
            if (pollingIntervalId) {
                clearTimeout(pollingIntervalId);
                pollingIntervalId = null;
            }
            console.log(`${LOG_PREFIX} Polling DISABLED by user.`);
        }
    }

    /**
     * Creates and inserts the checkbox and label into the QR window, below the submit button.
     * @param {HTMLElement} qrElement - The Quick Reply element.
     */
    function createToggleButton(qrElement) {
        // Prevent creating multiple toggles
        if (document.getElementById('captcha-poller-toggle-checkbox')) {
            return;
        }

        const submitButton = qrElement.querySelector(QR_SUBMIT_BUTTON_SELECTOR);
        if (!submitButton) {
            console.log(`${LOG_PREFIX} QR submit button not found yet, delaying checkbox injection.`);
            return;
        }

        const checkboxId = 'captcha-poller-toggle-checkbox';

        // Create the container <div> to hold the elements
        const container = document.createElement('div');
        container.style.textAlign = 'center';
        container.style.marginTop = '5px';
        container.style.fontSize = '10px';
        container.style.width = '100%';

        // Ensure it doesn't wrap oddly in the QR table layout
        const td = submitButton.parentNode;
        if (td && td.tagName === 'TD') {
            td.style.paddingBottom = '5px'; // Add some padding above the buttons/input
            td.style.paddingTop = '5px';
        }

        // Create the checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = checkboxId;
        checkbox.checked = isPollingActive; // True by default
        checkbox.addEventListener('change', handleCheckboxChange);
        checkbox.style.verticalAlign = 'middle'; // Align with text

        // Create the label
        const label = document.createElement('label');
        label.htmlFor = checkboxId;
        label.textContent = 'Auto-Click Captcha';
        label.style.marginLeft = '5px';
        label.style.cursor = 'pointer';
        label.style.verticalAlign = 'middle'; // Align with checkbox

        container.appendChild(checkbox);
        container.appendChild(label);

        // Insert the container right after the submit button
        submitButton.parentNode.appendChild(container);

        console.log(`${LOG_PREFIX} Toggle checkbox created and placed in QR window.`);
    }


    // --- Execution Start ---

    function initializeScript() {
        const qrElement = document.getElementById('qr');

        // Initial check: if QR is present, try to inject the button
        if (qrElement) {
            createToggleButton(qrElement);
        }

        // Setup observer to handle when the QR form is opened or its content changes (like on initial page load or thread change)
        if (!qrObserver) {
             qrObserver = new MutationObserver((mutationsList, observer) => {
                const currentQrElement = document.getElementById('qr');
                if (currentQrElement) {
                    // Check if content was added/changed inside QR, indicating it's ready.
                    // The submit button is a good indicator of QR content presence.
                    if (currentQrElement.querySelector(QR_SUBMIT_BUTTON_SELECTOR) || !document.getElementById('captcha-poller-toggle-checkbox')) {
                        createToggleButton(currentQrElement);
                    }
                }
             });

             // Start observing the document body for the QR element itself, in case it's added later
             qrObserver.observe(document.body, { childList: true, subtree: true });

             console.log(`${LOG_PREFIX} QR observer attached.`);
        }

        // Start polling immediately if the default state is active
        if (isPollingActive) {
            console.log(`${LOG_PREFIX} Polling is ENABLED by default. Starting check cycle...`);
            checkAndClickCaptcha();
        }
    }


    // Only run on owo.vg
    if (window.location.href.startsWith('https://owo.vg/')) {
        initializeScript();
    } else {
        console.log(`${LOG_PREFIX} Not on an owo.vg page. Script inactive.`);
    }
})();