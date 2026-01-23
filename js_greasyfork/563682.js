// ==UserScript==
// @name         [Helperscript only] Carbaba Auto-Fill Helper
// @namespace    https://greasyfork.org/users/976031
// @version      1.0
// @description  Auto-fills registration and mileage fields on Carbaba website
// @match        https://carbaba.co.uk/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563682/%5BHelperscript%20only%5D%20Carbaba%20Auto-Fill%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/563682/%5BHelperscript%20only%5D%20Carbaba%20Auto-Fill%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to get URL parameter
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(window.location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    // Function to wait for an element to appear
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }

            const observer = new MutationObserver((mutations, obs) => {
                const element = document.querySelector(selector);
                if (element) {
                    obs.disconnect();
                    resolve(element);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Element ${selector} not found within ${timeout}ms`));
            }, timeout);
        });
    }

    // Function to type a single character using execCommand (most native method)
    async function typeCharacter(element, char) {
        // Ensure element is focused before each character
        if (document.activeElement !== element) {
            element.focus();
            await new Promise(resolve => setTimeout(resolve, 50));
        }

        const isNumberInput = element.type === 'number';

        // Try execCommand insertText first (works for both text and number inputs)
        if (document.execCommand) {
            try {
                // For number inputs, we can't use setSelectionRange, but execCommand might still work
                if (!isNumberInput && element.setSelectionRange) {
                    try {
                        const len = element.value.length;
                        element.setSelectionRange(len, len);
                    } catch (e) {
                        // setSelectionRange might fail
                    }
                }

                // Insert the character using execCommand (works for number inputs too)
                const success = document.execCommand('insertText', false, char);
                if (success) {
                    // Small delay to let the browser process
                    await new Promise(resolve => setTimeout(resolve, 50));
                    return true;
                }
            } catch (e) {
                // execCommand might fail, fall through to manual method
                console.log('execCommand failed, using fallback:', e);
            }
        }

        // Fallback: manually set value
        if (isNumberInput) {
            // Number inputs: append to value
            element.value = element.value + char;
        } else {
            // Text inputs: insert at cursor position
            const start = (element.selectionStart !== null && element.selectionStart !== undefined)
                ? element.selectionStart
                : element.value.length;
            const end = (element.selectionEnd !== null && element.selectionEnd !== undefined)
                ? element.selectionEnd
                : element.value.length;
            const before = element.value.substring(0, start);
            const after = element.value.substring(end);
            element.value = before + char + after;

            // Move cursor after inserted character (only if supported)
            if (element.setSelectionRange) {
                try {
                    element.setSelectionRange(start + 1, start + 1);
                } catch (e) {
                    // Ignore errors
                }
            }
        }

        // Dispatch input event with proper properties
        const inputEvent = new InputEvent('input', {
            inputType: 'insertText',
            data: char,
            bubbles: true,
            cancelable: true
        });
        element.dispatchEvent(inputEvent);

        await new Promise(resolve => setTimeout(resolve, 50));
        return false;
    }

    // Function to type text character by character
    async function typeText(element, text, fieldName = 'field') {
        console.log(`Starting to type in ${fieldName}:`, text);

        // Click and focus the element multiple times to ensure it's active
        element.click();
        element.focus();
        await new Promise(resolve => setTimeout(resolve, 150));

        // Verify element is focused
        if (document.activeElement !== element) {
            console.log(`${fieldName} not focused, trying again...`);
            element.focus();
            await new Promise(resolve => setTimeout(resolve, 150));
        }

        // Clear existing value
        element.value = '';
        const isNumberInput = element.type === 'number';
        if (element.setSelectionRange && !isNumberInput) {
            try {
                element.setSelectionRange(0, 0);
            } catch (e) {
                // Ignore errors for number inputs
            }
        }
        element.dispatchEvent(new Event('input', { bubbles: true }));
        await new Promise(resolve => setTimeout(resolve, 100));

        // Type each character one by one
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            console.log(`Typing character ${i + 1}/${text.length}: "${char}"`);

            // Ensure element is still focused before each character
            if (document.activeElement !== element) {
                console.log(`${fieldName} lost focus, refocusing...`);
                element.focus();
                await new Promise(resolve => setTimeout(resolve, 50));
            }

            await typeCharacter(element, char);

            // Verify the character was inserted
            if (!element.value.includes(char) && i === 0) {
                console.warn(`Character "${char}" may not have been inserted. Current value:`, element.value);
            }
        }

        console.log(`Finished typing in ${fieldName}. Final value:`, element.value);

        // For number inputs, trigger validation by blurring and refocusing
        if (element.type === 'number') {
            // Trigger input event one more time
            element.dispatchEvent(new InputEvent('input', {
                inputType: 'insertText',
                bubbles: true,
                cancelable: true
            }));
            await new Promise(resolve => setTimeout(resolve, 100));

            // Blur to trigger validation
            element.blur();
            element.dispatchEvent(new Event('blur', { bubbles: true, cancelable: true }));
            await new Promise(resolve => setTimeout(resolve, 100));

            // Refocus
            element.focus();
            element.dispatchEvent(new Event('focus', { bubbles: true, cancelable: true }));
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Trigger change event
        element.dispatchEvent(new Event('change', { bubbles: true }));
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Function to fill the form
    async function fillForm() {
        const regValue = getUrlParameter('reg');
        if (!regValue) {
            return; // No reg parameter, nothing to do
        }

        try {
            // Wait for the page to be ready
            await new Promise(resolve => setTimeout(resolve, 500));

            // Wait for the registration input field
            const regInput = await waitForElement('input[name="vrm"]');
            await new Promise(resolve => setTimeout(resolve, 200));

            // Type the registration number
            await typeText(regInput, regValue);

            // Wait before moving to next field
            await new Promise(resolve => setTimeout(resolve, 500));

            // Wait for the mileage input field - might need to wait longer
            let mileageInput;
            try {
                mileageInput = await waitForElement('input[name="mileage"]', 15000);
            } catch (e) {
                console.error('Mileage input not found:', e);
                // Try alternative selector
                mileageInput = document.querySelector('input[type="number"][name="mileage"]') ||
                               document.querySelector('input[name="mileage"]');
                if (!mileageInput) {
                    console.error('Could not find mileage input field');
                    return;
                }
            }

            await new Promise(resolve => setTimeout(resolve, 200));

            // Ensure mileage input is visible and interactable
            if (mileageInput.offsetParent === null) {
                console.warn('Mileage input is not visible, waiting...');
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            // Type the mileage value
            console.log('Typing mileage value...');
            await typeText(mileageInput, '10000', 'mileage');
            console.log('Mileage value typed. Current value:', mileageInput.value);

            // Wait for form validation
            await new Promise(resolve => setTimeout(resolve, 500));

            // Find and click the submit button - try multiple approaches
            let submitButton = null;

            // Try primary selector
            submitButton = document.querySelector('button[type="submit"].btn-custom');

            // Try by text content
            if (!submitButton) {
                const buttons = document.querySelectorAll('button[type="submit"]');
                for (const btn of buttons) {
                    if (btn.textContent.includes('Value My Car') || btn.textContent.includes('Value')) {
                        submitButton = btn;
                        break;
                    }
                }
            }

            // Try alternative selectors
            if (!submitButton) {
                submitButton = document.querySelector('button.btn-custom[type="submit"]');
            }
            if (!submitButton) {
                submitButton = document.querySelector('button.btn-primary[type="submit"]');
            }
            if (!submitButton) {
                submitButton = document.querySelector('form button[type="submit"]');
            }

            if (submitButton) {
                await new Promise(resolve => setTimeout(resolve, 300));
                submitButton.click();
                console.log('Submit button clicked');
            } else {
                console.warn('Submit button not found. Available buttons:',
                    Array.from(document.querySelectorAll('button')).map(b => ({
                        text: b.textContent.trim(),
                        type: b.type,
                        classes: b.className
                    }))
                );
            }
        } catch (error) {
            console.error('Error filling Carbaba form:', error);
        }
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fillForm);
    } else {
        fillForm();
    }
})();
