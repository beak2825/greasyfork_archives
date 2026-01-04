// ==UserScript==
// @name         AI Studio System Instructions Injector
// @version      15.0
// @description  The definitive power-user script for Google AI Studio. Performs an instant, flicker-free check on page load & between chats (SPA-aware), so the UI only appears when needed. Replaces all browser dialogs with a professional, themed UI and non-blocking toast notifications. Features a 'one-shot' workflow to inject, close, & hide with a single click. Offers total control: closable button (hide session/forever) & full Tampermonkey menu integration (edit, inject, re-show).
// @author       Sayf
// @homepageURL  https://github.com/zSayf/Tampermonkey.AI-Studio-System-Instructions-Injector
// @source       https://github.com/zSayf/Tampermonkey.AI-Studio-System-Instructions-Injector
// @supportURL   https://github.com/zSayf/Tampermonkey.AI-Studio-System-Instructions-Injector/issues
// @license      MIT
// @match        https://aistudio.google.com/*prompts/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @namespace    https://github.com/zSayf
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM4ZTRhYWQiIHN0cm9rZS13aWR0aD0iMi41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0xNSA0VjJtMCAxOHYtMm0tNy41LTEyLjVMNCA0bTE2IDE2bC0zLjUtMy41TTIgMTJoMm0xNiAwaDJNNy41IDcuNUw0IDRtMTIuNSAwbDMuNSAzLjUiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIyIi8+PC9zdmc+
// @downloadURL https://update.greasyfork.org/scripts/551234/AI%20Studio%20System%20Instructions%20Injector.user.js
// @updateURL https://update.greasyfork.org/scripts/551234/AI%20Studio%20System%20Instructions%20Injector.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // --- Configuration & Constants ---
    const SCRIPT_NAME = 'AI Studio Injector';
    const STORAGE_KEY_INSTRUCTIONS = 'custom_system_instructions';
    const STORAGE_KEY_BUTTON_HIDDEN = 'injector_button_hidden_forever';
    const DEFAULT_INSTRUCTIONS = '';
    const SELECTORS = {
        systemInstructionsButton: '[data-test-system-instructions-card]',
        systemInstructionsSubtitle: '[data-test-system-instructions-card] .subtitle',
        systemInstructionsTextArea: 'textarea[aria-label="System instructions"]',
        overlayBackdrop: '.cdk-overlay-backdrop'
    };
    let systemInstructions;

    // --- UI Modals ---
    function showCustomPrompt({ title, message, defaultValue }) {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.id = 'injector-overlay';
            const modal = document.createElement('div');
            modal.id = 'injector-modal';
            modal.innerHTML = `
                <h2>${title}</h2>
                <p>${message}</p>
                <textarea id="injector-textarea" placeholder="Paste your system instructions here...">${defaultValue}</textarea>
                <div class="injector-buttons">
                    <button id="injector-cancel">Cancel</button>
                    <button id="injector-save">Save</button>
                </div>
            `;
            document.body.appendChild(overlay);
            document.body.appendChild(modal);
            const textarea = document.getElementById('injector-textarea');
            textarea.focus();
            textarea.select();
            const closeModal = () => { overlay.remove(); modal.remove(); };
            document.getElementById('injector-save').addEventListener('click', () => { resolve(textarea.value); closeModal(); });
            document.getElementById('injector-cancel').addEventListener('click', () => { resolve(null); closeModal(); });
            overlay.addEventListener('click', () => { resolve(null); closeModal(); });
        });
    }

    function showConfirmationModal({ title, message }) {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.id = 'injector-overlay';
            const modal = document.createElement('div');
            modal.id = 'injector-modal';
            modal.innerHTML = `
                <h2>${title}</h2>
                <p>${message}</p>
                <div class="injector-buttons confirmation">
                    <button data-choice="cancel" class="cancel">Cancel</button>
                    <button data-choice="overwrite">Overwrite</button>
                </div>
            `;
            document.body.appendChild(overlay);
            document.body.appendChild(modal);
            const closeModal = () => { overlay.remove(); modal.remove(); };
            modal.querySelector('button[data-choice="overwrite"]').addEventListener('click', () => { resolve(true); closeModal(); });
            modal.querySelector('button[data-choice="cancel"]').addEventListener('click', () => { resolve(false); closeModal(); });
            overlay.addEventListener('click', () => { resolve(false); closeModal(); });
        });
    }

    function showHideConfirmationModal() {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.id = 'injector-modal';
            modal.innerHTML = `
                <h2>Hide Button</h2>
                <p>How would you like to hide the injector button?</p>
                <div class="injector-buttons confirmation">
                    <button data-choice="session">For Session</button>
                    <button data-choice="forever">Hide Forever</button>
                    <button data-choice="cancel" class="cancel">Cancel</button>
                </div>
            `;
            const overlay = document.createElement('div');
            overlay.id = 'injector-overlay';
            document.body.appendChild(overlay);
            document.body.appendChild(modal);
            const closeModal = () => { overlay.remove(); modal.remove(); };
            modal.querySelectorAll('button').forEach(button => {
                button.addEventListener('click', () => { resolve(button.dataset.choice); closeModal(); });
            });
            overlay.addEventListener('click', () => { resolve('cancel'); closeModal(); });
        });
    }

    function showToast(message, type = 'info') {
        let toastContainer = document.getElementById('injector-toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'injector-toast-container';
            document.body.appendChild(toastContainer);
        }
        const toast = document.createElement('div');
        toast.className = `injector-toast ${type}`;
        const icons = {
            success: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
            info: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
            error: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`
        };
        toast.innerHTML = `<div class="toast-icon">${icons[type]}</div><div class="toast-message">${message}</div>`;
        toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('fade-out');
            toast.addEventListener('animationend', () => toast.remove());
        }, 3500);
    }

    // --- Styling ---
    GM_addStyle(`
        #injector-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); z-index: 9998; backdrop-filter: blur(4px); }
        #injector-modal { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #2d2d2d; color: #e0e0e0; border-radius: 12px; padding: 24px; width: 90%; max-width: 600px; z-index: 9999; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border: 1px solid #444; }
        #injector-modal h2 { margin-top: 0; font-size: 1.4em; color: #fff; }
        #injector-modal p { margin-bottom: 16px; line-height: 1.5; color: #ccc; }
        #injector-textarea { width: 100%; min-height: 200px; background: #1e1e1e; color: #e0e0e0; border: 1px solid #555; border-radius: 8px; padding: 12px; font-family: monospace; font-size: 14px; resize: vertical; box-sizing: border-box; }
        .injector-buttons { text-align: right; margin-top: 20px; }
        .injector-buttons button { padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; transition: all 0.2s ease; }
        #injector-cancel, .injector-buttons.confirmation button.cancel { background: #444; color: #fff; }
        #injector-cancel:hover, .injector-buttons.confirmation button.cancel:hover { background: #555; }
        #injector-save, .injector-buttons.confirmation button[data-choice="overwrite"] { background: #c0392b; color: #fff; }
        #injector-save:hover, .injector-buttons.confirmation button[data-choice="overwrite"]:hover { background: #e74c3c; }
        .injector-buttons.confirmation { display: flex; justify-content: flex-end; gap: 10px; }
        .injector-buttons.confirmation button { background: #4a4a4a; }
        .injector-buttons.confirmation button:hover { background: #5a5a5a; }
        #ai-studio-injector-trigger { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); z-index: 9990; background-color: #6a1b9a; color: white; border: none; border-radius: 12px 12px 0 0; padding: 8px 20px; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.3); transition: all 0.25s ease; }
        #ai-studio-injector-trigger:hover { background-color: #8e24aa; transform: translateX(-50%) translateY(-5px); box-shadow: 0 -6px 20px rgba(0, 0, 0, 0.4); }
        .injector-trigger-text { font-size: 14px; font-weight: bold; }
        .injector-close-btn { position: absolute; top: -5px; right: -5px; width: 20px; height: 20px; background: #c0392b; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; cursor: pointer; transition: transform 0.2s, opacity 0.2s; opacity: 0.5; line-height: 20px; }
        #ai-studio-injector-trigger:hover .injector-close-btn { opacity: 1; }
        .injector-close-btn:hover { transform: scale(1.2); }
        #injector-toast-container { position: fixed; top: 20px; right: 20px; z-index: 10000; display: flex; flex-direction: column; gap: 10px; }
        .injector-toast { display: flex; align-items: center; padding: 12px 16px; border-radius: 8px; background: #333; color: #fff; border-left: 5px solid #555; box-shadow: 0 5px 15px rgba(0,0,0,0.4); animation: toast-fade-in 0.3s ease; }
        .injector-toast.fade-out { animation: toast-fade-out 0.4s ease forwards; }
        .injector-toast .toast-icon { margin-right: 12px; display: flex; align-items: center; }
        .injector-toast .toast-icon svg { width: 20px; height: 20px; }
        .injector-toast.success { border-left-color: #2ecc71; } .injector-toast.success .toast-icon { color: #2ecc71; }
        .injector-toast.info { border-left-color: #3498db; } .injector-toast.info .toast-icon { color: #3498db; }
        .injector-toast.error { border-left-color: #e74c3c; } .injector-toast.error .toast-icon { color: #e74c3c; }
        @keyframes toast-fade-in { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }
        @keyframes toast-fade-out { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(100%); } }
    `);

    // --- Core Logic ---

    async function editInstructions() {
        const currentInstructions = await GM_getValue(STORAGE_KEY_INSTRUCTIONS, DEFAULT_INSTRUCTIONS);
        const userInput = await showCustomPrompt({
            title: "Edit System Instructions",
            message: "You can modify your saved system instructions below.",
            defaultValue: currentInstructions
        });
        if (userInput !== null && userInput.trim() !== '') {
            systemInstructions = userInput.trim();
            await GM_setValue(STORAGE_KEY_INSTRUCTIONS, systemInstructions);
            showToast('Instructions saved successfully!', 'success');
        } else if (userInput !== null) {
            showToast('Instructions cannot be empty.', 'error');
        }
    }

    async function loadOrPromptForInstructions() {
        let savedInstructions = await GM_getValue(STORAGE_KEY_INSTRUCTIONS, null);
        if (savedInstructions === null) {
            let userInput = null;
            while (userInput === null || userInput.trim() === '') {
                userInput = await showCustomPrompt({
                    title: `Welcome to ${SCRIPT_NAME}!`,
                    message: "This is your first time. Please set your custom system instructions below.",
                    defaultValue: DEFAULT_INSTRUCTIONS
                });
                if (userInput === null) {
                    const dummyInstruction = "---INJECTOR_DISABLED---";
                    await GM_setValue(STORAGE_KEY_INSTRUCTIONS, dummyInstruction);
                    return dummyInstruction;
                }
                if (userInput.trim() === '') {
                    showToast("Instructions cannot be empty. Please provide a prompt or cancel.", "error");
                }
            }
            savedInstructions = userInput.trim();
            await GM_setValue(STORAGE_KEY_INSTRUCTIONS, savedInstructions);
        }
        return savedInstructions;
    }

    function waitForElement(selector, callback) {
        const existingElement = document.querySelector(selector);
        if (existingElement) return callback(existingElement);
        const observer = new MutationObserver(() => {
            const element = document.querySelector(selector);
            if (element) {
                observer.disconnect();
                callback(element);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function injectText(textArea, text) {
        textArea.value = text;
        textArea.dispatchEvent(new Event('input', { bubbles: true }));
        textArea.dispatchEvent(new Event('blur', { bubbles: true }));
        console.log(`[${SCRIPT_NAME}]: SUCCESS: Text injected.`);
    }

    function hideButton() {
        const btn = document.getElementById('ai-studio-injector-trigger');
        if (btn) btn.style.display = 'none';
    }

    function closePanel() {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 25;
            const interval = setInterval(() => {
                if (!document.querySelector(SELECTORS.systemInstructionsTextArea)) {
                    clearInterval(interval);
                    resolve();
                    return;
                }
                if (attempts >= maxAttempts) {
                    clearInterval(interval);
                    reject(new Error("Failed to auto-close the panel."));
                    return;
                }
                const backdrop = document.querySelector(SELECTORS.overlayBackdrop);
                if (backdrop) backdrop.click();
                attempts++;
            }, 100);
        });
    }

    async function runFullSequence(textArea) {
        injectText(textArea, systemInstructions);
        try {
            await closePanel();
            hideButton();
            console.log(`[${SCRIPT_NAME}]: Sequence complete. Button hidden.`);
        } catch (error) {
            console.error(`[${SCRIPT_NAME}]: ${error.message}`);
            showToast(error.message, 'error');
        }
    }

    function waitForContent(textArea) {
        return new Promise(resolve => {
            let attempts = 0;
            const maxAttempts = 50;
            const interval = setInterval(() => {
                if (textArea.value.trim() !== '' || attempts >= maxAttempts) {
                    clearInterval(interval);
                    resolve();
                }
                attempts++;
            }, 10);
        });
    }

    async function processPanel() {
        waitForElement(SELECTORS.systemInstructionsTextArea, async (textArea) => {
            await waitForContent(textArea);
            const pageText = textArea.value.trim();
            const myText = systemInstructions.trim();
            if (pageText === '') {
                await runFullSequence(textArea);
            } else if (pageText === myText) {
                showToast('Instructions already match!', 'success');
                try { await closePanel(); hideButton(); } catch (e) { hideButton(); }
            } else {
                const shouldOverwrite = await showConfirmationModal({
                    title: 'Conflict Detected',
                    message: 'The instructions field already has text. Do you want to overwrite it?'
                });
                if (shouldOverwrite) {
                    await runFullSequence(textArea);
                } else {
                    try { await closePanel(); hideButton(); } catch(e) { hideButton(); }
                }
            }
        });
    }

    function triggerInjectionSequence() {
        const panel = document.querySelector(SELECTORS.systemInstructionsTextArea);
        const button = document.querySelector(SELECTORS.systemInstructionsButton);
        if (panel) {
            processPanel();
        } else if (button) {
            button.click();
            processPanel();
        } else {
            console.error(`[${SCRIPT_NAME}]: Could not find the system instructions button.`);
            showToast('Could not find the instructions button.', 'error');
        }
    }

    function createTriggerButton() {
        const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 4V2m0 18v-2m-7.5-12.5L4 4m16 16l-3.5-3.5M2 12h2m16 0h2M7.5 7.5L4 4m12.5 0l3.5 3.5"/><circle cx="12" cy="12" r="2"/></svg>`;
        const btn = document.createElement('button');
        btn.id = 'ai-studio-injector-trigger';
        btn.innerHTML = `
            <div class="injector-close-btn">&times;</div>
            ${svgIcon}
            <span class="injector-trigger-text">INJECTOR</span>
        `;
        btn.title = 'Inject System Instructions (One-Shot)\nRight-click to edit your saved instructions.';
        btn.addEventListener('click', triggerInjectionSequence);
        btn.addEventListener('contextmenu', e => { e.preventDefault(); editInstructions(); });
        btn.querySelector('.injector-close-btn').addEventListener('click', async (e) => {
            e.stopPropagation();
            const choice = await showHideConfirmationModal();
            switch (choice) {
                case 'session':
                    hideButton();
                    break;
                case 'forever':
                    await GM_setValue(STORAGE_KEY_BUTTON_HIDDEN, true);
                    hideButton();
                    break;
                case 'cancel':
                default:
                    break;
            }
        });
        document.body.appendChild(btn);
    }

    async function performInitialCheck() {
        console.log(`[${SCRIPT_NAME}]: Performing instant check...`);
        try {
            const subtitleElement = await new Promise((resolve, reject) => {
                waitForElement(SELECTORS.systemInstructionsSubtitle, resolve);
                setTimeout(() => reject(new Error('Subtitle element timeout')), 5000);
            });
            const pageText = subtitleElement.textContent.trim();
            const myText = systemInstructions.trim();
            const isMatched = pageText === myText;
            console.log(`[${SCRIPT_NAME}]: Instant check result: ${isMatched ? 'Matched' : 'No Match'}`);
            return isMatched;
        } catch (error) {
            console.warn(`[${SCRIPT_NAME}]: Instant check failed: ${error.message}. Assuming button is needed.`);
            return false;
        }
    }

    async function runChatCheck() {
        const oldButton = document.getElementById('ai-studio-injector-trigger');
        if (oldButton) oldButton.remove();
        const isPermanentlyHidden = await GM_getValue(STORAGE_KEY_BUTTON_HIDDEN, false);
        if (isPermanentlyHidden) {
            console.log(`[${SCRIPT_NAME}]: Button is permanently hidden by user setting.`);
            return;
        }
        const alreadyInjected = await performInitialCheck();
        if (!alreadyInjected) {
            createTriggerButton();
            console.log(`[${SCRIPT_NAME}]: Ready for this chat. Button created.`);
        } else {
            console.log(`[${SCRIPT_NAME}]: Ready for this chat. Button not needed.`);
        }
    }

    function startNavigationObserver() {
        let lastUrl = location.href;
        const observer = new MutationObserver(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                console.log(`[${SCRIPT_NAME}]: URL changed, re-running chat check.`);
                runChatCheck();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // --- Script Initialization ---
    async function main() {
        systemInstructions = await loadOrPromptForInstructions();

        if (systemInstructions === "---INJECTOR_DISABLED---") {
            console.log(`[${SCRIPT_NAME}]: Initial setup cancelled. Script is inactive.`);
            showToast("Injector is inactive until instructions are set (via Tampermonkey menu).", "info");
            GM_registerMenuCommand("Set System Instructions", editInstructions);
            return;
        }

        GM_registerMenuCommand("Edit System Instructions", editInstructions);
        GM_registerMenuCommand("Inject Instructions (from Menu)", triggerInjectionSequence);
        GM_registerMenuCommand("► (Re)Show Button", async () => {
            await GM_setValue(STORAGE_KEY_BUTTON_HIDDEN, false);
            showToast('Button will be shown on next refresh.', 'info');
        });

        runChatCheck();
        startNavigationObserver();
    }

    main();
})();