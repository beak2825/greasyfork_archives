// ==UserScript==
// @name         Character.AI - Message Formatting Corrector (Drag & Drop button)
// @namespace    http://tampermonkey.net/
// @version      7.0
// @description  Formats narration and dialogue with a single click. Features a draggable button that remembers its position and adapts for PC & Mobile.
// @author       accforfaciet
// @match        *://*.character.ai/chat*
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552560/CharacterAI%20-%20Message%20Formatting%20Corrector%20%28Drag%20%20Drop%20button%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552560/CharacterAI%20-%20Message%20Formatting%20Corrector%20%28Drag%20%20Drop%20button%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- SCRIPT SETTINGS ---
    const DEBUG_MODE = false;
    const ACTION_PAUSE_MS = 100;
    const BUTTON_POSITION_STORAGE_KEY = 'caiFormatterButtonPosition';
    // --- END OF SETTINGS ---

    // --- SELECTORS ---
    const MORE_OPTIONS_BUTTON_SELECTOR = 'button[aria-label="More options"]';
    const EDIT_BUTTON_TEXT = 'Edit message';
    const TEXT_AREA_SELECTOR = 'textarea[maxlength="4092"]';
    const SAVE_BUTTON_TEXT = 'Save';
    const MAIN_INPUT_SELECTOR = 'textarea[placeholder*="Message"]';
    const EDITED_TAG_SELECTOR = 'p[title="Message edited by user"]';
    // --- END OF SELECTORS ---

    // --- HELPERS ---
    function debugLog(...args) { if (DEBUG_MODE) console.log('[DEBUG]', ...args); }
    function pause(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const el = document.querySelector(selector);
            if (el) return resolve(el);
            const observer = new MutationObserver(() => {
                const el = document.querySelector(selector);
                if (el) {
                    observer.disconnect();
                    resolve(el);
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Element not found: ${selector}`));
            }, timeout);
        });
    }

    function findElementByText(selector, text) {
        return Array.from(document.querySelectorAll(selector)).find(el => el.textContent.trim() === text);
    }

    // --- CORE FORMATTING FUNCTION ---
    function formatNarrationAndDialogue(text) {
        const normalizedText = text.replace(/[«“”„‟⹂❞❝]/g, '"');
        const lines = normalizedText.split('\n');
        return lines.map(line => {
            const trimmedLine = line.trim();
            if (trimmedLine === '') return '';
            const cleanLine = trimmedLine.replace(/\*/g, '');
            if (cleanLine.includes('"') || cleanLine.includes('`')) {
                const fragments = cleanLine.split(/("[\s\S]*?"|`[\s\S]*?`)/);
                return fragments.map(frag => {
                    if ((frag.startsWith('"') && frag.endsWith('"')) || (frag.startsWith('`') && frag.endsWith('`'))) return frag;
                    if (frag.trim() !== '') return `*${frag.trim()}*`;
                    return '';
                }).filter(Boolean).join(' ');
            }
            return `*${cleanLine}*`;
        }).join('\n');
    }

    // --- MESSAGE CLEANUP LOGIC ---

    /** A reusable function that cleans a single message given its "(edited)" tag element. */
    function performCleanupOnTag(editedTag) {
        const messageContainer = editedTag.closest('div[class*="border-dashed"]');
        if (messageContainer) {
            messageContainer.classList.remove('border-dashed', 'border-2', 'border-blue', 'border-opacity-35');
            debugLog('Removed border styles from a message.');
        }

        const tagContainer = editedTag.parentElement;
        if (tagContainer) {
            tagContainer.remove();
            debugLog('Removed an (edited) tag element.');
        }
    }

    /** --- NEW: Cleans up all pre-existing edited messages on page load --- */
    async function cleanupAllExistingMessages() {
        try {
            // Wait for the chat to be loaded by looking for the first message options button
            await waitForElement(MORE_OPTIONS_BUTTON_SELECTOR);
            await pause(500); // A brief extra pause for content to settle

            const allEditedTags = document.querySelectorAll(EDITED_TAG_SELECTOR);
            if (allEditedTags.length > 0) {
                debugLog(`Found ${allEditedTags.length} pre-existing edited messages. Cleaning them up...`);
                allEditedTags.forEach(performCleanupOnTag);
            } else {
                debugLog('No pre-existing edited messages found on startup.');
            }
        } catch (error) {
            console.error("Could not perform initial cleanup (this is okay if there's no chat loaded):", error);
        }
    }

    // --- MAIN SCRIPT LOGIC ---
    async function processLastMessage(textProcessor) {
        debugLog('--- STARTING C.AI EDIT PROCESS ---');
        try {
            const latestOptionsButton = document.querySelector(MORE_OPTIONS_BUTTON_SELECTOR);
            if (!latestOptionsButton) {
                debugLog('STOP: No "More options" buttons found.'); return;
            }
            latestOptionsButton.click();
            debugLog('1. Clicked "More options" button.');
            await pause(ACTION_PAUSE_MS);

            const editButton = findElementByText('button', EDIT_BUTTON_TEXT);
            if (!editButton) {
                debugLog('STOP: Could not find "Edit message" button.');
                latestOptionsButton.click(); // Close the menu even if it fails
                return;
            }
            editButton.click();
            latestOptionsButton.click(); // Close the menu
            debugLog('2. Clicked "Edit message" and closed menu.');
            await pause(ACTION_PAUSE_MS);

            const textField = await waitForElement(TEXT_AREA_SELECTOR);
            const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
            nativeSetter.call(textField, textProcessor(textField.value));
            textField.dispatchEvent(new Event('input', { bubbles: true }));
            debugLog('3. Injected new text into textarea.');

            const saveButton = findElementByText('button', SAVE_BUTTON_TEXT);
            if (!saveButton) {
                debugLog('STOP: Could not find "Save" button.'); return;
            }
            saveButton.click();
            debugLog('4. Clicked "Save". Setting up observer for next message cleanup...');
            cleanupAllExistingMessages()

            debugLog('--- PROCESS SUCCESSFULLY COMPLETED ---');

        } catch (error) {
            console.error('CRITICAL ERROR during the C.AI editing process:', error);
        }
    }

    // --- DRAGGABLE BUTTON LOGIC (Unchanged) ---
    function makeDraggable(element) {
        let isDragging = false, hasDragged = false, startX, startY, initialLeft, initialTop;
        function dragStart(e) {
            isDragging = true; hasDragged = false;
            element.classList.add('is-dragging');
            const clientX = e.clientX ?? e.touches[0].clientX, clientY = e.clientY ?? e.touches[0].clientY;
            startX = clientX; startY = clientY;
            const rect = element.getBoundingClientRect();
            initialLeft = rect.left; initialTop = rect.top;
            window.addEventListener('mousemove', dragMove, { passive: false });
            window.addEventListener('touchmove', dragMove, { passive: false });
            window.addEventListener('mouseup', dragEnd);
            window.addEventListener('touchend', dragEnd);
        }
        function dragMove(e) {
            if (!isDragging) return;
            e.preventDefault(); hasDragged = true;
            const clientX = e.clientX ?? e.touches[0].clientX, clientY = e.clientY ?? e.touches[0].clientY;
            let newLeft = initialLeft + (clientX - startX), newTop = initialTop + (clientY - startY);
            newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - element.offsetWidth));
            newTop = Math.max(0, Math.min(newTop, window.innerHeight - element.offsetHeight));
            element.style.cssText += `right:auto; bottom:auto; left:${newLeft}px; top:${newTop}px;`;
        }
        function dragEnd() {
            if (!isDragging) return;
            isDragging = false;
            element.classList.remove('is-dragging');
            if (hasDragged) savePosition({ left: element.getBoundingClientRect().left, top: element.getBoundingClientRect().top });
            window.removeEventListener('mousemove', dragMove);
            window.removeEventListener('touchmove', dragMove);
            window.removeEventListener('mouseup', dragEnd);
            window.removeEventListener('touchend', dragEnd);
        }
        element.addEventListener('mousedown', dragStart);
        element.addEventListener('touchstart', dragStart, { passive: true });
        element.addEventListener('click', () => { if (!hasDragged) processLastMessage(formatNarrationAndDialogue); });
    }
    function savePosition(pos) { localStorage.setItem(BUTTON_POSITION_STORAGE_KEY, JSON.stringify(pos)); }
    function loadPosition(element) {
        const savedPos = localStorage.getItem(BUTTON_POSITION_STORAGE_KEY);
        if (savedPos) {
            const pos = JSON.parse(savedPos);
            element.style.cssText += `right:auto; bottom:auto; left:${pos.left}px; top:${pos.top}px;`;
        }
    }

    // --- UI CREATION & INITIALIZATION ---
    function createTriggerButton() {
        const formatButton = document.createElement('button');
        formatButton.innerHTML = '✏️';
        formatButton.id = 'cai-formatter-trigger';
        formatButton.title = 'Click to format message. Hold and drag to move.';
        document.body.appendChild(formatButton);
        loadPosition(formatButton);
        makeDraggable(formatButton);
    }
    async function initKeyboardBugFix() {
        try {
            const mainInput = await waitForElement(MAIN_INPUT_SELECTOR);
            const button = document.getElementById('cai-formatter-trigger');
            if (mainInput && button) {
                mainInput.addEventListener('focus', () => { button.style.display = 'none'; });
                mainInput.addEventListener('blur', () => { setTimeout(() => { button.style.display = 'block'; }, 200); });
            }
        } catch (e) { console.log('Could not find main input for keyboard fix.'); }
    }

    // --- ADAPTIVE STYLES (Unchanged) ---
    GM_addStyle(`
        #cai-formatter-trigger {
            position: fixed; z-index: 9999; color: white; border: none;
            border-radius: 50%; box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            cursor: pointer; transition: transform 0.2s, opacity 0.2s;
            background-color: #1A73E8; /* Character.AI Blue */
            user-select: none;
        }
        #cai-formatter-trigger:active { cursor: grabbing; }
        #cai-formatter-trigger.is-dragging {
            transform: scale(1.1); opacity: 0.8;
            box-shadow: 0 8px 16px rgba(0,0,0,0.3);
        }
        #cai-formatter-trigger { width: 45px; height: 45px; font-size: 20px; right: 5%; bottom: 15%; }
        @media (min-width: 769px) {
            #cai-formatter-trigger { width: 50px; height: 50px; font-size: 24px; right: 2%; bottom: 12%; }
        }
    `);

    // --- STARTUP ---
    createTriggerButton();
    initKeyboardBugFix();
    cleanupAllExistingMessages(); // Run the new cleanup function on startup
    console.log('Script "Character.AI - Message Formatting Corrector" (v7.0) started successfully.');
})();