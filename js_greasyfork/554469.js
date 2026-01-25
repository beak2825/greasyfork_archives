// ==UserScript==
// @name         McDVoice Auto Next
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically clicks the Next button on McDVoice survey pages and adds auto-fill button for survey code
// @author       louietyj
// @match        https://www.mcdvoice.com/*
// @match        https://mcdvoice.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/554469/McDVoice%20Auto%20Next.user.js
// @updateURL https://update.greasyfork.org/scripts/554469/McDVoice%20Auto%20Next.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clickNextButton() {
        const nextButton = document.querySelector('input[type="submit"]#NextButton');
        if (nextButton) {
            nextButton.click();
        }
    }

    function addAutoFillButton() {
        // Check if we're on the first page with code input fields
        const firstInput = document.querySelector('input#CN1');
        if (!firstInput) {
            return; // Not on the code entry page
        }

        // Check if button already exists
        if (document.querySelector('#mcdvoice-autofill-btn')) {
            return;
        }

        // Create the auto-fill button - match the Start button style
        const autoFillBtn = document.createElement('button');
        autoFillBtn.id = 'mcdvoice-autofill-btn';
        autoFillBtn.type = 'button';
        autoFillBtn.className = 'NextButton';
        autoFillBtn.textContent = '📋 Paste Code';
        // Match the Start button styling exactly, with proper width for longer text
        autoFillBtn.style.cssText = 'background-image: url("https://www.mcdvoice.com/Projects/MCD_CSI/images/Button.png"); background-size: 100% 100%; background-position: center; background-repeat: no-repeat; background-color: rgba(0, 0, 0, 0); color: rgb(41, 41, 41); font-size: 14px; font-weight: 700; font-family: Verdana, Helvetica, Arial, sans-serif; padding: 0px 10px 3px; margin: 25px 5px 15px; width: auto; min-width: 150px; height: 40px; border: 0px none; border-radius: 0px; display: inline-block; cursor: pointer; text-align: center; white-space: nowrap; box-sizing: border-box;';

        // Add click handler
        autoFillBtn.addEventListener('click', async function() {
            try {
                // Read from clipboard
                const clipboardText = await navigator.clipboard.readText();
                
                // Parse the format: "xxxxx-xxxxx-xxxxx-xxxxx-xxxxx-x"
                // Remove any whitespace and split by dashes
                const cleaned = clipboardText.trim().replace(/\s+/g, '');
                const parts = cleaned.split('-');
                
                if (parts.length !== 6) {
                    alert('Invalid code format. Expected format: xxxxx-xxxxx-xxxxx-xxxxx-xxxxx-x');
                    return;
                }

                // Validate lengths: 5, 5, 5, 5, 5, 1
                const expectedLengths = [5, 5, 5, 5, 5, 1];
                for (let i = 0; i < 6; i++) {
                    if (parts[i].length !== expectedLengths[i]) {
                        alert(`Invalid code format. Part ${i + 1} should be ${expectedLengths[i]} digit(s), but got ${parts[i].length}.`);
                        return;
                    }
                }

                // Fill the input fields
                const inputIds = ['CN1', 'CN2', 'CN3', 'CN4', 'CN5', 'CN6'];
                for (let i = 0; i < 6; i++) {
                    const input = document.querySelector(`input#${inputIds[i]}`);
                    if (input) {
                        input.value = parts[i];
                        // Trigger input event to ensure any validation/formatting is triggered
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                        input.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                }

                console.log('Auto-filled survey code from clipboard');
            } catch (error) {
                console.error('Error reading from clipboard:', error);
                alert('Failed to read from clipboard. Please make sure you have copied the code and granted clipboard permissions.');
            }
        });

        // Find the Start button and insert our button next to it
        const startButton = document.querySelector('button[type="submit"], input[type="submit"]');
        if (startButton && startButton.parentElement) {
            startButton.parentElement.insertBefore(autoFillBtn, startButton.nextSibling);
        } else {
            // Fallback: insert after the last input field
            const lastInput = document.querySelector('input#CN6');
            if (lastInput && lastInput.parentElement) {
                lastInput.parentElement.insertBefore(autoFillBtn, lastInput.nextSibling);
            }
        }
    }

    // Function to initialize based on page type
    function initialize() {
        // Check if we're on the first page (with code input fields)
        const firstInput = document.querySelector('input#CN1');
        if (firstInput) {
            // We're on the first page, add auto-fill button
            addAutoFillButton();
            
            // Also observe for dynamic loading
            const observer = new MutationObserver(() => {
                if (!document.querySelector('#mcdvoice-autofill-btn')) {
                    addAutoFillButton();
                }
            });

            if (document.body) {
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }
        } else {
            // We're on a survey page, check for Next button
            const nextButton = document.querySelector('input[type="submit"]#NextButton');
            if (nextButton && nextButton.value !== 'Start') {
                // Only auto-click if it's not the Start button (which is on first page)
                clickNextButton();
                
                // Also set up observer for Next button
                const observer = new MutationObserver(() => {
                    const nextBtn = document.querySelector('input[type="submit"]#NextButton');
                    if (nextBtn && nextBtn.offsetParent !== null && nextBtn.value !== 'Start') {
                        observer.disconnect();
                        clickNextButton();
                    }
                });

                if (document.body) {
                    observer.observe(document.body, {
                        childList: true,
                        subtree: true
                    });
                }
            }
        }
    }

    // Wait for the page to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();
