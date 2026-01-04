// ==UserScript==
// @name         Gemini - Last Prompt Replacer
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Streamlines replacing the last prompt in a Gemini conversation with robust short and long press support.
// @author       vfxturjo
// @license      MIT
// @match        https://gemini.google.com/app/*
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/554455/Gemini%20-%20Last%20Prompt%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/554455/Gemini%20-%20Last%20Prompt%20Replacer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let keydownTimer = null;
    let isActionInProgress = false; // State flag to prevent key-repeat issues
    const longPressDuration = 400; // Time in ms to distinguish a long press

    /**
     * The core function to replace the last prompt.
     * @param {boolean} submit - If true, the script will simulate an "Enter" key press.
     */
    async function replacePrompt(submit = true) {
        console.log(`Gemini Replacer: Action triggered (Submit: ${submit}).`);

        try {
            const allEditButtons = document.querySelectorAll('[data-test-id="prompt-edit-button"]');
            if (allEditButtons.length === 0) {
                // Check if we are already in edit mode
                if (!document.querySelector('textarea[aria-label="Edit prompt"]')) {
                    alert("Gemini Replacer Error: Could not find any prompt edit buttons.");
                }
                // If we are already in edit mode, we can still proceed to paste.
            } else {
                const lastEditButton = allEditButtons[allEditButtons.length - 1];
                lastEditButton.click();
                console.log("Gemini Replacer: Edit button clicked.");
            }

            const clipboardText = await navigator.clipboard.readText();
            if (typeof clipboardText !== 'string' || clipboardText.length === 0) {
                alert("Gemini Replacer: Clipboard is empty or contains no text.");
                return;
            }
            console.log("Gemini Replacer: Successfully read from clipboard.");

            // A brief moment for the text area to become visible.
            setTimeout(() => {
                const promptTextArea = document.querySelector('textarea[aria-label="Edit prompt"]');

                if (promptTextArea) {
                    console.log("Gemini Replacer: Found the prompt text area.");
                    promptTextArea.value = clipboardText;
                    promptTextArea.dispatchEvent(new Event('input', { bubbles: true }));

                    if (submit) {
                        const enterEvent = new KeyboardEvent('keydown', {
                            bubbles: true, cancelable: true, key: 'Enter', code: 'Enter', keyCode: 13, which: 13
                        });
                        promptTextArea.dispatchEvent(enterEvent);
                        console.log("Gemini Replacer: Pasted content and simulated Enter press.");
                    } else {
                        console.log("Gemini Replacer: Pasted content without submitting. Ready for editing.");
                    }
                } else {
                    alert("Gemini Replacer Error: Could not find the prompt text area after clicking edit.");
                }
            }, 100);

        } catch (error) {
            if (error.name === 'NotAllowedError') {
                alert('Gemini Replacer: Please grant clipboard access permission to the site.');
            } else {
                console.error("Gemini Replacer: An unexpected error occurred:", error);
                alert("Gemini Replacer: An unexpected error occurred. See the console for details.");
            }
        }
    }

    // --- Triggers ---

    GM_registerMenuCommand('Replace Last Prompt', () => replacePrompt(true));

    document.addEventListener('keydown', function(event) {
        // Only run if CTRL+Q is pressed AND we are not already processing an action
        if (event.ctrlKey && event.key.toLowerCase() === 'q' && !isActionInProgress) {
            event.preventDefault();
            isActionInProgress = true; // Set the flag to block repeated events

            // Start a timer for the long press action.
            keydownTimer = setTimeout(() => {
                replacePrompt(false); // Execute the action without submitting.
                keydownTimer = null; // Clear the timer ID after it has run.
            }, longPressDuration);
        }
    });

    document.addEventListener('keyup', function(event) {
        // We only care about the keyup event if we started an action
        if (event.key.toLowerCase() === 'q' && isActionInProgress) {
            // If the timer is still running, it's a short press.
            if (keydownTimer) {
                clearTimeout(keydownTimer);
                replacePrompt(true); // Execute the action with submission.
            }
            // If keydownTimer is null, the long press already fired. Do nothing.

            // Reset state for the next key press
            keydownTimer = null;
            isActionInProgress = false;
        }
    });

})();