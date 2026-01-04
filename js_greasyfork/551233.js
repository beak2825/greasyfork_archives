// ==UserScript==
// @name         Unsluggish ChatGPT Input
// @namespace    http://tampermonkey.net/
// @version      2.3.0
// @description  In a long chat typing is very sluggish. This script adds an alternative input area. (De)activate it via Ctrl+Alt+i
// @author       evermind-zz
// @homepage     https://github.com/evermind-zz/chatgpt-no-sluggish-input
// @license      GPL-3.0-or-later
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551233/Unsluggish%20ChatGPT%20Input.user.js
// @updateURL https://update.greasyfork.org/scripts/551233/Unsluggish%20ChatGPT%20Input.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ======== DEFAULT SETTINGS ========
    const defaultSettings = {
        overlayButton: true,
        enterCanStop: true
    };

    // Load persistent settings
    const savedSettings = JSON.parse(localStorage.getItem('overlay_settings') || '{}');
    window.OVERLAY_BUTTON = savedSettings.overlayButton ?? defaultSettings.overlayButton;
    window.OVERLAY_ENTER_CAN_STOP = savedSettings.enterCanStop ?? defaultSettings.enterCanStop;

    // ======== GLOBAL VARIABLES ========
    let wrapper = null;
    let overlay = null;
    let overlayBtn = null;
    let settingsIcon = null;
    let settingsPopup = null;
    let pollingInterval = null;
    window.FAST_INPUT_DEBUG = true;
    const MAX_HEIGHT = 300;

    // ======== ENUM STATES ========
    const ButtonState = {
        IDLE: 'idle',
        STOP: 'stop',
        SEND: 'send'
    };
    Object.freeze(ButtonState);

    function logDebug(msg, ...args) {
        if (window.FAST_INPUT_DEBUG) console.log(`[FastInputOverlay] ${msg}`, ...args);
    }

    // ======== HELPERS ========
    function getTextContainer() {
        const container = document.querySelector('#prompt-textarea');
        logDebug('getTextContainer:', container);
        return container;
    }

    function adjustHeight(el) {
        el.style.height = 'auto';
        el.style.height = Math.min(el.scrollHeight, MAX_HEIGHT) + 'px';
        el.style.overflowY = el.scrollHeight > MAX_HEIGHT ? 'auto' : 'hidden';
        logDebug('adjustHeight:', el.style.height);
    }

    function waitForSendButton(maxTime = 2000, intervalTime = 50) {
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const interval = setInterval(() => {
                const btn = detectSendButton();
                if (btn) {
                    updateOverlayButton(ButtonState.SEND);
                    clearInterval(interval);
                    logDebug('Send button found');
                    resolve(btn);
                } else if (Date.now() - start > maxTime) {
                    clearInterval(interval);
                    logDebug('Send button not found within timeout');
                    reject('Send button not found');
                }
            }, intervalTime);
        });
    }

    function detectSendButton() {
        return document.querySelector('[data-testid="send-button"]');
    }

    function detectStopButton() {
        return document.querySelector('[data-testid="stop-button"]');
    }

    function getButtonState() {
        if (detectStopButton()) return ButtonState.STOP;
        if (detectSendButton()) return ButtonState.SEND;
        return ButtonState.IDLE;
    }

    function checkWhichButtonShown() {
        if (pollingInterval) return; // only one interval
        pollingInterval = setInterval(() => {
            if (!overlayBtn) return;
            const state = getButtonState();

            updateOverlayButton(state);

            switch (state) {
                case ButtonState.IDLE:
                    clearInterval(pollingInterval);
                    pollingInterval = null;
                    break;
                case ButtonState.STOP:
                case ButtonState.SEND:
                    break;
            }
        }, 200);
    }

    function updateOverlayButton(state) {
        if (!overlayBtn) return;

        switch (state) {
            case ButtonState.IDLE:
                overlayBtn.innerText = '✉️'; // Send icon
                overlayBtn.style.background = '#d4f8d4'; // light green
                overlayBtn.style.color = '#006400'; // dark green
                break;

            case ButtonState.SEND:
                overlayBtn.innerText = '...'; // briefly when sending
                overlayBtn.style.background = '#f0f0f0'; // neutral
                overlayBtn.style.color = '#000';
                break;

            case ButtonState.STOP:
                overlayBtn.innerText = '⏹'; // Stop icon
                overlayBtn.style.background = '#f8d4d4'; // light red
                overlayBtn.style.color = '#8b0000'; // dark red
                break;
        }

        logDebug('Overlay button updated →', state);
    }

    function copyTextToChatGPT(text) {
        const container = getTextContainer();
        if (!container) {
            logDebug('Text container not found');
            return;
        }

        const lines = text.split('\n');
        const html = lines.map(line => `<p>${line || '&nbsp;'}</p>`).join('');
        container.innerHTML = html;
        logDebug('Overlay text copied:', lines);
    }

    // ======== SETTINGS POPUP ========
    function createSettingsPopup() {
        settingsPopup = document.createElement('div');
        settingsPopup.style.position = 'absolute';
        settingsPopup.style.bottom = '100%';
        settingsPopup.style.left = '0';
        settingsPopup.style.background = '#fff';
        settingsPopup.style.border = '1px solid #ccc';
        settingsPopup.style.borderRadius = '6px';
        settingsPopup.style.padding = '10px';
        settingsPopup.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        settingsPopup.style.display = 'none';
        settingsPopup.style.zIndex = '10000';
        settingsPopup.style.fontSize = '14px';

        // Overlay button toggle
        const btnCheckbox = document.createElement('input');
        btnCheckbox.type = 'checkbox';
        btnCheckbox.checked = window.OVERLAY_BUTTON;
        btnCheckbox.id = 'overlayBtnCheckbox';
        const btnLabel = document.createElement('label');
        btnLabel.innerText = 'Show Overlay Button';
        btnLabel.htmlFor = 'overlayBtnCheckbox';
        btnLabel.style.marginLeft = '4px';
        btnLabel.style.marginRight = '10px';
        btnCheckbox.addEventListener('change', () => {
            window.OVERLAY_BUTTON = btnCheckbox.checked;
            overlayBtn.style.display = window.OVERLAY_BUTTON ? 'inline-block' : 'none';
            saveSettings();
        });

        // Enter can stop toggle
        const enterCheckbox = document.createElement('input');
        enterCheckbox.type = 'checkbox';
        enterCheckbox.checked = window.OVERLAY_ENTER_CAN_STOP;
        enterCheckbox.id = 'enterCanStopCheckbox';
        const enterLabel = document.createElement('label');
        enterLabel.innerText = 'Enter can Stop';
        enterLabel.htmlFor = 'enterCanStopCheckbox';
        enterCheckbox.addEventListener('change', () => {
            window.OVERLAY_ENTER_CAN_STOP = enterCheckbox.checked;
            saveSettings();
        });

        settingsPopup.appendChild(btnCheckbox);
        settingsPopup.appendChild(btnLabel);
        settingsPopup.appendChild(enterCheckbox);
        settingsPopup.appendChild(enterLabel);

        settingsIcon.appendChild(settingsPopup);
    }

    function toggleSettingsPopup() {
        if (!settingsPopup) return;
        settingsPopup.style.display = settingsPopup.style.display === 'none' ? 'block' : 'none';
    }

    function saveSettings() {
        localStorage.setItem('overlay_settings', JSON.stringify({
            overlayButton: window.OVERLAY_BUTTON,
            enterCanStop: window.OVERLAY_ENTER_CAN_STOP
        }));
    }

    // ======== OVERLAY CREATION ========
    function createOverlay() {
        if (wrapper) return;

        wrapper = document.createElement('div');
        wrapper.style.position = 'fixed';
        wrapper.style.bottom = '20px';
        wrapper.style.left = '50%';
        wrapper.style.transform = 'translateX(-50%)';
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'flex-end';
        wrapper.style.gap = '8px';
        wrapper.style.width = '60%';
        wrapper.style.zIndex = '9999';

        // Settings icon
        settingsIcon = document.createElement('div');
        settingsIcon.innerText = '⚙️';
        settingsIcon.style.cursor = 'pointer';
        settingsIcon.style.fontSize = '18px';
        settingsIcon.addEventListener('click', toggleSettingsPopup);
        wrapper.appendChild(settingsIcon);

        // Overlay textarea
        overlay = document.createElement('textarea');
        overlay.style.width = '100%';
        overlay.style.height = '80px';
        overlay.style.fontSize = '16px';
        overlay.style.padding = '10px';
        overlay.style.border = '2px solid #0078D7';
        overlay.style.borderRadius = '8px';
        overlay.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        overlay.style.resize = 'none';
        overlay.style.overflowY = 'hidden';
        overlay.placeholder = 'Type here and press Enter (Shift+Enter for newline)...';
        overlay.addEventListener('input', () => adjustHeight(overlay));

        overlay.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleOverlayAction();
                adjustHeight(overlay);
                overlay.focus();
            }
        });

        wrapper.appendChild(overlay);

        // Optional Overlay button
        if (window.OVERLAY_BUTTON) {
            overlayBtn = document.createElement('button');
            overlayBtn.style.padding = '10px';
            overlayBtn.style.borderRadius = '6px';
            overlayBtn.style.border = '1px solid #0078D7';
            overlayBtn.style.background = '#f0f0f0';
            overlayBtn.style.cursor = 'pointer';
            overlayBtn.onclick = handleOverlayAction;
            updateOverlayButton(ButtonState.IDLE);
            wrapper.appendChild(overlayBtn);
        }

        document.body.appendChild(wrapper);
        createSettingsPopup();
    }

    // ======== STOP BUTTON HANDLING ========
    function clickStopButton(maxTime = 1000, intervalTime = 50) {
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const poll = setInterval(() => {
                const stopBtn = detectStopButton();
                if (stopBtn) {
                    clearInterval(poll);
                    logDebug('Stop button found → clicking');
                    stopBtn.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true}));
                    resolve(true);
                } else if (Date.now() - start > maxTime) {
                    clearInterval(poll);
                    logDebug('Stop button not found within timeout');
                    resolve(false);
                }
            }, intervalTime);
        });
    }

    // ======== HANDLE ACTION ========
    function handleOverlayAction() {
        const text = overlay.value.trim();
        const state = getButtonState();

        logDebug('handleOverlayAction → state:', state);

        updateOverlayButton(state);

        switch (state) {
            case ButtonState.IDLE: // at that time the chatgpt button is still idle
                if (text) {
                    copyTextToChatGPT(text);
                    waitForSendButton()
                        .then(btn => {
                            btn.click();
                            overlay.value = '';
                            checkWhichButtonShown();
                        })
                        .catch(console.error);
                } else {
                    logDebug('IDLE state but no text → nothing to send');
                }
                break;

            case ButtonState.STOP:
                if (window.OVERLAY_ENTER_CAN_STOP) {
                    clickStopButton().then(clicked => {
                        if (!clicked) logDebug('No stop button to click');
                        logDebug('STOP state and Enter-stop executed');
                    });
                } else {
                    logDebug('STOP state but Enter-stop disabled');
                }
                break;

            case ButtonState.SEND:
            default:
                logDebug('Send already underway → do nothing');
                break;
        }
    }

    // ======== TOGGLE OVERLAY ========
    function toggleOverlay() {
        if (!wrapper) createOverlay();
        if (wrapper.style.display === 'none' || wrapper.style.display === '') {
            wrapper.style.display = 'flex';
            overlay.focus();
            adjustHeight(overlay);
            logDebug('Overlay shown');
        } else {
            wrapper.style.display = 'none';
            logDebug('Overlay hidden');
        }
    }

    // ======== HOTKEY ========
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'i') {
            e.preventDefault();
            e.stopPropagation();
            toggleOverlay();
        }
    }, true);

    window.addEventListener('load', () => {
        setTimeout(createOverlay, 1000);
    });
})();
