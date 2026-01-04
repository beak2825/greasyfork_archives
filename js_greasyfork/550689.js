// ==UserScript==
// @name        AI Studio Legacy Keybinds
// @namespace   Violentmonkey Scripts
// @match       https://aistudio.google.com/*
// @grant       none
// @license     MIT
// @version     1.0
// @author      smoothxhale
// @description Remaps Enter to Shift+Enter, and Ctrl+Enter to Enter on aistudio.google.com.
// @downloadURL https://update.greasyfork.org/scripts/550689/AI%20Studio%20Legacy%20Keybinds.user.js
// @updateURL https://update.greasyfork.org/scripts/550689/AI%20Studio%20Legacy%20Keybinds.meta.js
// ==/UserScript==

function robustlyClickSendButton() {
    const sendButton = document.querySelector('button[aria-label="Run"]');
    if (!sendButton) {
        return;
    }
    sendButton.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    sendButton.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    sendButton.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
    sendButton.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    sendButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

function redefineEvent(event, properties) {
    Object.defineProperties(event, Object.keys(properties).reduce((acc, key) => {
        acc[key] = { value: properties[key], writable: false, configurable: true };
        return acc;
    }, {}));
}

window.addEventListener('keydown', (event) => {
    if (event.target.tagName !== 'TEXTAREA' || event.isComposing) {
        return;
    }

    if (event.key === 'Enter' && event.ctrlKey && !event.shiftKey) {
        event.preventDefault();
        event.stopImmediatePropagation();
        robustlyClickSendButton();
    } else if (event.key === 'Enter' && !event.ctrlKey && !event.shiftKey) {
        event.stopImmediatePropagation();
        redefineEvent(event, { shiftKey: true });
    }
}, true);