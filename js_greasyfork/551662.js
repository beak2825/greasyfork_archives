// ==UserScript==
// @name         (OUTDATED) Chub.AI - Message Formatting Corrector (PC/Desktop Version)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Formats narration and dialogues, and removes <think> tags with a single click. (PC/Desktop Version)
// @author       accforfaciet
// @match        *://chub.ai/chats/*
// @grant        GM_addStyle
// @run-at       document-idle
// @license MIT
// ==/UserScript==

(function() {
    'use strict';

    // --- DEBUG SETTINGS ---
    const DEBUG_MODE = false; // Set to true to output messages to the console and enable pauses
    const DEBUG_PAUSE_MS = 50; // Pause duration in milliseconds
    // --- END OF DEBUG SETTINGS ---

    // --- SELECTORS FOR CHUB.AI ---
    const EDIT_BUTTON_SELECTOR = 'button:has(span[aria-label="edit"])';
    const TEXT_AREA_SELECTOR = 'textarea.ant-input-borderless';
    const CONFIRM_BUTTON_SELECTOR = 'button:has(span[aria-label="check"])';
    const MAIN_INPUT_SELECTOR = 'textarea[placeholder*="Send a message"]'; // For mobile keyboard fix
    // --- END OF SETTINGS ---

    // --- DEBUGGING TOOLS ---

    /** Logs a message to the console only if DEBUG_MODE is enabled. */
    function debugLog(...args) {
        if (DEBUG_MODE) {
            console.log('[DEBUG]', ...args);
        }
    }

    /** Creates a pause in execution only if DEBUG_MODE is enabled. */
    function debugPause(ms = DEBUG_PAUSE_MS) {
        if (DEBUG_MODE) {
            debugLog(`Pausing for ${ms / 1000} sec...`);
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        return Promise.resolve();
    }

    /** Highlights an element with a red border for visual debugging. */
    function highlightElement(element, remove = false) {
        if (DEBUG_MODE && element) {
            element.style.outline = remove ? '' : '3px solid red';
            element.style.outlineOffset = '3px';
        }
    }

    /**
     * Asynchronous function to wait for an element to appear in the DOM.
     * @param {string} selector - The CSS selector for the element.
     * @returns {Promise<Element>}
     */
    function waitForElement(selector) {
        return new Promise((resolve, reject) => {
            const el = document.querySelector(selector);
            if (el) {
                resolve(el);
                return;
            }
            const observer = new MutationObserver(() => {
                const el = document.querySelector(selector);
                if (el) {
                    observer.disconnect();
                    resolve(el);
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        });
    }

    // --- CORE FORMATTING FUNCTIONS ---

    /**
     * Function #1: Removes text inside various thought/system tags.
     */
    function removeThinkTags(text) {
        text = text.replace(/\n?\s*<thought>[\s\S]*?<\/thought>\s*\n?/g, '');
        text = text.replace(/\n?\s*<thoughts>[\s\S]*?<\/thoughts>\s*\n?/g, '');
        text = text.replace(/\n?\s*<think>[\s\S]*?<\/think>\s*\n?/g, '');
        text = text.replace('<system>', '');
        text = text.replace('</system>', '');
        text = text.replace('<response>', '');
        text = text.replace('</response>', '');
        text = removeSystemPrompt(text);
        return text;
    }

    /**
     * Function #2: Removes a leaked system prompt from the start of a message.
     */
    function removeSystemPrompt(text) {
        // This pattern is less common on Chub but included for consistency.
        const trimmedText = text.trim();
        if (!trimmedText.toLowerCase().startsWith('the user')) {
            return text;
        }
        const splitPointIndex = text.search(/[^\s\*]\*[^\s\*]/);
        if (splitPointIndex !== -1) {
            const result = text.substring(splitPointIndex + 1);
            debugLog(`System prompt found and removed.`);
            return result;
        }
        return text;
    }

    /**
     * Function #3: Smart text formatting (Line-by-Line).
     * This is the main function that combines all formatting rules.
     */
    function formatNarrationAndDialogue(text) {
        text = removeThinkTags(text); // Start by cleaning tags and prompts
        const normalizedText = text.replace(/[«“”„‟⹂❞❝]/g, '"');
        const lines = normalizedText.split('\n');
        const processedLines = lines.map(line => {
            const trimmedLine = line.trim();
            if (trimmedLine === '') return '';
            const cleanLine = trimmedLine.replace(/\*/g, '');
            if (cleanLine.includes('"') || cleanLine.includes('`')) {
                const fragments = cleanLine.split(/("[\s\S]*?"|`[\s\S]*?`)/);
                const processedFragments = fragments.map(frag => {
                    if ((frag.startsWith('"') && frag.endsWith('"')) || (frag.startsWith('`') && frag.endsWith('`'))) {
                        return frag;
                    } else if (frag.trim() !== '') {
                        return `*${frag.trim()}*`;
                    }
                    return '';
                });
                return processedFragments.filter(f => f).join(' ');
            } else {
                return `*${cleanLine}*`;
            }
        });
        return processedLines.join('\n');
    }

    /**
     * Main mechanism: finds the last message, clicks edit, processes text, and saves.
     */
    async function processLastMessage(textProcessor) {
        debugLog('--- STARTING EDIT PROCESS (Chub.AI) ---');
        let lastHighlightedElement = null;
        const cleanup = () => { if (lastHighlightedElement) highlightElement(lastHighlightedElement, true); };

        try {
            // 1. Find the last "Edit" button
            debugLog('1. Searching for edit buttons:', EDIT_BUTTON_SELECTOR);
            const allEditButtons = document.querySelectorAll(EDIT_BUTTON_SELECTOR);
            if (allEditButtons.length === 0) {
                debugLog('STOP: No edit buttons found.');
                return;
            }
            const lastEditButton = allEditButtons[allEditButtons.length - 1];
            highlightElement(lastEditButton);
            lastHighlightedElement = lastEditButton;
            await debugPause();
            lastEditButton.click();
            debugLog('2. Clicked edit button.');

            // 2. Wait for text area and process text
            highlightElement(lastEditButton, true);
            const textField = await waitForElement(TEXT_AREA_SELECTOR);
            debugLog('3. Text area found.');
            highlightElement(textField);
            lastHighlightedElement = textField;
            const originalText = textField.value;
            const newText = textProcessor(originalText);

            if (DEBUG_MODE) {
                console.groupCollapsed('[DEBUG] Text comparison (before and after)');
                console.log('--- ORIGINAL TEXT ---\n', originalText);
                console.log('--- NEW TEXT ---\n', newText);
                console.groupEnd();
            }

            // 3. Update text area value using React-safe method
            const nativeTextareaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
            nativeTextareaValueSetter.call(textField, newText);
            const event = new Event('input', { bubbles: true });
            textField.dispatchEvent(event);
            debugLog('4. Injected new text into field.');
            await debugPause();

            // 4. Find and click confirm button
            highlightElement(textField, true);
            const confirmButton = await waitForElement(CONFIRM_BUTTON_SELECTOR);
            debugLog('5. Found confirm button.');
            highlightElement(confirmButton);
            lastHighlightedElement = confirmButton;
            await debugPause();
            if (confirmButton) confirmButton.click();
            debugLog('6. Clicked confirm button.');
            debugLog('--- PROCESS SUCCESSFULLY COMPLETED ---');

        } catch (error) {
            console.error('CRITICAL ERROR during the editing process:', error);
        } finally {
            cleanup();
        }
    }

    /**
     * Creates and adds the single formatting button to the page.
     */
    function createTriggerButton() {
        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'chub-editor-buttons';
        document.body.appendChild(buttonContainer);

        const formatButton = document.createElement('button');
        formatButton.innerHTML = '✏️';
        formatButton.id = 'formatterTrigger';
        formatButton.title = 'Format asterisks & remove <think> tags';
        formatButton.addEventListener('click', () => processLastMessage(formatNarrationAndDialogue));
        buttonContainer.appendChild(formatButton);
    }

    /**
     * Mobile keyboard fix: hides the button when the main input is focused.
     */
    async function initKeyboardBugFix() {
        try {
            const mainInput = await waitForElement(MAIN_INPUT_SELECTOR);
            const buttonContainer = document.getElementById('chub-editor-buttons');
            if (!mainInput || !buttonContainer) return;

            mainInput.addEventListener('focus', () => { buttonContainer.style.display = 'none'; });
            mainInput.addEventListener('blur', () => {
                setTimeout(() => { buttonContainer.style.display = 'block'; }, 200);
            });
        } catch (e) {
            console.log('Could not find main input field for keyboard fix (this is normal on PC).');
        }
    }

    // --- STYLES ---
    // Use the desired block and comment out the other.

    // --- STYLES FOR PC (Default) ---
    GM_addStyle(`
        #chub-editor-buttons button {
            position: fixed; z-index: 9999;
            width: 50px; height: 50px; color: white;
            border: none; border-radius: 50%;
            font-size: 24px; box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            cursor: pointer; transition: transform 0.2s;
            background-color: #c9226e; /* Pink */
        }
        #chub-editor-buttons button:active { transform: scale(0.9); }
        #formatterTrigger { right: 18%; bottom: 8%; }
    `);

    /*
    // --- STYLES FOR MOBILE ---
    // To use these: remove "/*" from the top and "* /" from the bottom of this block,
    // and wrap the PC styles block above in the same comments.
    GM_addStyle(`
        #chub-editor-buttons button {
            position: fixed; z-index: 9999;
            width: 45px; height: 45px; color: white;
            border: none; border-radius: 50%;
            font-size: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            cursor: pointer; transition: all 0.2s;
            background-color: #c9226e; Pink
        }
        #chub-editor-buttons button:active { transform: scale(0.9); }
        #formatterTrigger { right: 5%; bottom: 12%; }
    `);
    */

    // --- STARTUP ---
    createTriggerButton();
    initKeyboardBugFix();
    console.log('Script "Advanced Message Formatter" for Chub.AI (v2.0) started successfully.');

})();