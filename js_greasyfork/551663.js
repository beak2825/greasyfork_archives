// ==UserScript==
// @name         Chub AI - Automatic Message Formatting Corrector (Drag & Drop button)
// @namespace    http://tampermonkey.net/
// @version      7.0
// @description  Formats narration, removes <think> tags, and features a draggable button that remembers its position. Adapts for PC & Mobile.
// @author       accforfaciet
// @match        *://chub.ai/chats/*
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551663/Chub%20AI%20-%20Automatic%20Message%20Formatting%20Corrector%20%28Drag%20%20Drop%20button%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551663/Chub%20AI%20-%20Automatic%20Message%20Formatting%20Corrector%20%28Drag%20%20Drop%20button%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- SCRIPT SETTINGS ---
    const DEBUG_MODE = false;
    const BUTTON_POSITION_STORAGE_KEY = 'chubFormatterButtonPosition_v2'; // Key for saving the button's position
    // --- END OF SETTINGS ---

    // --- SELECTORS FOR CHUB.AI ---
    const EDIT_BUTTON_SELECTOR = 'button:has(span[aria-label="edit"])';
    const TEXT_AREA_SELECTOR = 'textarea.ant-input-borderless';
    const CONFIRM_BUTTON_SELECTOR = 'button:has(span[aria-label="check"])';
    const MAIN_INPUT_SELECTOR = 'textarea[placeholder*="Send a message"]';
    // --- END OF SELECTORS ---

    // --- DEBUGGING TOOLS ---
    function debugLog(...args) { if (DEBUG_MODE) console.log('[DEBUG]', ...args); }

    // --- DOM HELPER ---
    function waitForElement(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) return resolve(document.querySelector(selector));
            const observer = new MutationObserver(() => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        });
    }

    // --- CORE FORMATTING FUNCTIONS (Unchanged) ---
    function removeThinkTags(text) {
        text = text.replace(/\n?\s*<thought>[\s\S]*?<\/thought>\s*\n?/g, '');
        text = text.replace(/\n?\s*<thoughts>[\s\S]*?<\/thoughts>\s*\n?/g, '');
        text = text.replace(/\n?\s*<think>[\s\S]*?<\/think>\s*\n?/g, '');
        text = text.replace(/<system>[\s\S]*?<\/system>/g, '');
        text = text.replace(/<response>[\s\S]*?<\/response>/g, '');
        return removeSystemPrompt(text);
    }
    function removeSystemPrompt(text) {
        const trimmedText = text.trim();
        if (!trimmedText.toLowerCase().startsWith('the user')) return text;
        const splitPointIndex = text.search(/[^\s\*]\*[^\s\*]/);
        if (splitPointIndex !== -1) {
            debugLog(`System prompt found and removed.`);
            return text.substring(splitPointIndex + 1);
        }
        return text;
    }
    function formatNarrationAndDialogue(text) {
        text = removeThinkTags(text);
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

    // --- MAIN SCRIPT LOGIC (Unchanged) ---
    async function processLastMessage(textProcessor) {
        debugLog('--- STARTING EDIT PROCESS ---');
        try {
            const allEditButtons = document.querySelectorAll(EDIT_BUTTON_SELECTOR);
            if (allEditButtons.length === 0) {
                debugLog('STOP: No edit buttons found.'); return;
            }
            const lastEditButton = allEditButtons[allEditButtons.length - 1];
            lastEditButton.click();
            const textField = await waitForElement(TEXT_AREA_SELECTOR);
            const nativeTextareaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
            nativeTextareaValueSetter.call(textField, textProcessor(textField.value));
            textField.dispatchEvent(new Event('input', { bubbles: true }));
            const confirmButton = await waitForElement(CONFIRM_BUTTON_SELECTOR);
            if (confirmButton) confirmButton.click();
            debugLog('--- PROCESS SUCCESSFULLY COMPLETED ---');
        } catch (error) {
            console.error('CRITICAL ERROR during the editing process:', error);
        }
    }

    // --- DRAGGABLE BUTTON LOGIC (Updated!) ---
    function makeDraggable(element) {
        let isDragging = false;
        let hasDragged = false;
        let startX, startY, initialLeft, initialTop;

        function dragStart(e) {
            isDragging = true;
            hasDragged = false;
            element.classList.add('is-dragging'); // Add visual effect class
            const clientX = e.clientX ?? e.touches[0].clientX;
            const clientY = e.clientY ?? e.touches[0].clientY;
            startX = clientX;
            startY = clientY;
            const rect = element.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;
            window.addEventListener('mousemove', dragMove, { passive: false });
            window.addEventListener('touchmove', dragMove, { passive: false });
            window.addEventListener('mouseup', dragEnd);
            window.addEventListener('touchend', dragEnd);
        }

        function dragMove(e) {
            if (!isDragging) return;
            e.preventDefault(); // Prevent page scroll on mobile
            hasDragged = true;

            const clientX = e.clientX ?? e.touches[0].clientX;
            const clientY = e.clientY ?? e.touches[0].clientY;
            const deltaX = clientX - startX;
            const deltaY = clientY - startY;
            let newLeft = initialLeft + deltaX;
            let newTop = initialTop + deltaY;

            // --- Screen Boundary Constraints (New!) ---
            const buttonWidth = element.offsetWidth;
            const buttonHeight = element.offsetHeight;
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            newLeft = Math.max(0, Math.min(newLeft, screenWidth - buttonWidth));
            newTop = Math.max(0, Math.min(newTop, screenHeight - buttonHeight));
            // --- End of Constraints ---

            element.style.right = 'auto';
            element.style.bottom = 'auto';
            element.style.left = `${newLeft}px`;
            element.style.top = `${newTop}px`;
        }

        function dragEnd() {
            if (!isDragging) return;
            isDragging = false;
            element.classList.remove('is-dragging'); // Remove visual effect class
            if (hasDragged) {
                const finalRect = element.getBoundingClientRect();
                savePosition({ left: finalRect.left, top: finalRect.top });
            }
            window.removeEventListener('mousemove', dragMove);
            window.removeEventListener('touchmove', dragMove);
            window.removeEventListener('mouseup', dragEnd);
            window.removeEventListener('touchend', dragEnd);
        }

        element.addEventListener('mousedown', dragStart);
        element.addEventListener('touchstart', dragStart, { passive: true });
        element.addEventListener('click', () => { if (!hasDragged) processLastMessage(formatNarrationAndDialogue); });
    }

    function savePosition(pos) {
        localStorage.setItem(BUTTON_POSITION_STORAGE_KEY, JSON.stringify(pos));
        debugLog('Button position saved:', pos);
    }

    function loadPosition(element) {
        const savedPos = localStorage.getItem(BUTTON_POSITION_STORAGE_KEY);
        if (savedPos) {
            const pos = JSON.parse(savedPos);
            element.style.right = 'auto';
            element.style.bottom = 'auto';
            element.style.left = `${pos.left}px`;
            element.style.top = `${pos.top}px`;
            debugLog('Button position loaded:', pos);
        }
    }

    // --- UI CREATION & INITIALIZATION ---
    function createTriggerButton() {
        const formatButton = document.createElement('button');
        formatButton.innerHTML = '✏️';
        formatButton.id = 'formatterTrigger';
        formatButton.title = 'Click to format message. Hold and drag to move.';
        document.body.appendChild(formatButton);
        loadPosition(formatButton);
        makeDraggable(formatButton);
    }

    async function initKeyboardBugFix() {
        try {
            const mainInput = await waitForElement(MAIN_INPUT_SELECTOR);
            const button = document.getElementById('formatterTrigger');
            if (!mainInput || !button) return;
            mainInput.addEventListener('focus', () => { button.style.display = 'none'; });
            mainInput.addEventListener('blur', () => { setTimeout(() => { button.style.display = 'block'; }, 200); });
        } catch (e) {
            console.log('Could not find main input field for keyboard fix (this is normal on PC).');
        }
    }

    // --- ADAPTIVE STYLES (Updated with drag effects) ---
    GM_addStyle(`
        #formatterTrigger {
            position: fixed;
            z-index: 9999;
            color: white;
            border: none;
            border-radius: 50%;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            cursor: pointer;
            transition: transform 0.2s, opacity 0.2s; /* Smooth transitions */
            background-color: #c9226e;
            user-select: none;
        }
        #formatterTrigger:active {
            cursor: grabbing;
        }
        /* Visual feedback class for when the button is being dragged (New!) */
        #formatterTrigger.is-dragging {
            transform: scale(1.1);
            opacity: 0.8;
            box-shadow: 0 8px 16px rgba(0,0,0,0.3);
        }
        /* Default position for MOBILE (if no position is saved) */
        #formatterTrigger {
            width: 45px; height: 45px; font-size: 20px; right: 5%; bottom: 9%;
        }
        /* Default position for PC (if no position is saved) */
        @media (min-width: 769px) {
            #formatterTrigger {
                width: 50px; height: 50px; font-size: 24px; right: 18%; bottom: 8%;
            }
        }
    `);

    // --- STARTUP ---
    createTriggerButton();
    initKeyboardBugFix();
    console.log('Script "Chub AI - Automatic Message Formatting Corrector (Drag & Drop button)" (v7.0) started successfully.');
})();