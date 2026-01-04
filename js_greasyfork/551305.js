// ==UserScript==
// @name		Sora Auto Code Generator by robomonkey.io
// @description		Automatically generates and submits invite codes for Sora
// @author Robomonkey
// @version		1.1.2
// @match		https://*.sora.chatgpt.com/*
// @icon		https://cdn.openai.com/sora/assets/favicon-dark.ico
// @license MIT
// @namespace https://greasyfork.org/users/1521443
// @downloadURL https://update.greasyfork.org/scripts/551305/Sora%20Auto%20Code%20Generator%20by%20robomonkeyio.user.js
// @updateURL https://update.greasyfork.org/scripts/551305/Sora%20Auto%20Code%20Generator%20by%20robomonkeyio.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function init() {
        console.log('Sora Auto Code Generator initialized');
        
        // Wait for the dialog to appear
        const observer = new MutationObserver(() => {
            const dialog = document.querySelector('[role="dialog"][aria-labelledby*="radix"]');
            const heading = document.querySelector('h2.font-brand');
            
            if (dialog && heading && heading.textContent.includes('Enter invite code')) {
                addGenerateButton();
                observer.disconnect();
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Check if dialog is already present
        const existingDialog = document.querySelector('[role="dialog"][aria-labelledby*="radix"]');
        const existingHeading = document.querySelector('h2.font-brand');
        if (existingDialog && existingHeading && existingHeading.textContent.includes('Enter invite code')) {
            addGenerateButton();
        }
    }

    function addGenerateButton() {
        // Check if button already exists
        if (document.getElementById('auto-code-generator-btn')) {
            return;
        }

        console.log('Adding generate code button');
        
        // Find the container with the input slots
        const inputContainer = document.querySelector('[data-input-otp-container="true"]');
        if (!inputContainer) {
            console.error('Could not find input container');
            return;
        }

        // Create the button
        const button = document.createElement('button');
        button.id = 'auto-code-generator-btn';
        button.textContent = 'Generate & Submit Code';
        button.style.cssText = `
            margin-top: 16px;
            padding: 12px 24px;
            background: linear-gradient(to bottom, #1a73e8, #0d47a1);
            color: white;
            border: none;
            border-radius: 9999px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        `;
        
        button.addEventListener('mouseenter', () => {
            button.style.background = 'linear-gradient(to bottom, #1557b0, #0a3a82)';
            button.style.transform = 'scale(1.02)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.background = 'linear-gradient(to bottom, #1a73e8, #0d47a1)';
            button.style.transform = 'scale(1)';
        });
        
        button.addEventListener('click', async () => {
            console.log('Generate button clicked');
            await generateAndSubmitCode();
        });

        // Insert button after the input container
        inputContainer.parentElement.appendChild(button);
        console.log('Button added successfully');
    }

    function generateRandomCode() {
        const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let code = '';
        for (let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            code += characters[randomIndex];
        }
        console.log('Generated code:', code);
        return code;
    }

    async function generateAndSubmitCode() {
        const code = generateRandomCode();
        
        // Find the hidden input field
        const hiddenInput = document.querySelector('input[data-slot="input-otp"]');
        if (!hiddenInput) {
            console.error('Could not find input field');
            return;
        }

        console.log('Filling code into input field');
        
        // Set the value
        hiddenInput.value = code;
        
        // Trigger input events to make the UI update
        hiddenInput.dispatchEvent(new Event('input', { bubbles: true }));
        hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
        
        // Wait a moment for the UI to update
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Find the submit button inside the dialog (not the fixed floating one)
        const dialog = document.querySelector('[role="dialog"]');
        if (!dialog) {
            console.error('Could not find dialog');
            return;
        }
        
        const buttons = Array.from(dialog.querySelectorAll('button'));
        const submitButton = buttons.find(btn => btn.textContent.includes('Join New Sora'));
        
        if (submitButton) {
            console.log('Clicking submit button inside dialog');
            // Trigger multiple events to ensure the click is registered
            submitButton.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            submitButton.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
            submitButton.click();
            submitButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        } else {
            console.error('Could not find submit button in dialog');
        }
    }

    // Initialize when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();