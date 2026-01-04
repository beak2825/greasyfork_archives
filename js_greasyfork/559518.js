// ==UserScript==
// @name         ChatGPT Command+Enter Send
// @description  Send messages with Command+Enter or Ctrl+Enter. Enter and Shift+Enter will create new lines.
// @author       schweigen
// @license      MIT
// @version      1.2
// @namespace    ChatGPT.CommandEnterSend
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559518/ChatGPT%20Command%2BEnter%20Send.user.js
// @updateURL https://update.greasyfork.org/scripts/559518/ChatGPT%20Command%2BEnter%20Send.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getPromptElementFrom(target) {
        if (!(target instanceof Element)) return null;

        const byId = target.closest('#prompt-textarea');
        if (byId) return byId;

        const byProseMirror = target.closest('.ProseMirror[contenteditable="true"]');
        if (byProseMirror && byProseMirror.closest('form')?.querySelector('textarea[name="prompt-textarea"]')) {
            return byProseMirror;
        }

        const byName = target.closest('textarea[name="prompt-textarea"]');
        if (byName) return byName;

        return null;
    }

    function dispatchEnter(target, { shiftKey }) {
        const event = new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            shiftKey,
            ctrlKey: false,
            altKey: false,
            metaKey: false,
            bubbles: true,
            cancelable: true,
            composed: true
        });
        target.dispatchEvent(event);
    }

    function insertNewlineIntoTextarea(textarea) {
        const value = textarea.value ?? '';
        const start = Number.isFinite(textarea.selectionStart) ? textarea.selectionStart : value.length;
        const end = Number.isFinite(textarea.selectionEnd) ? textarea.selectionEnd : value.length;
        const nextValue = value.slice(0, start) + '\n' + value.slice(end);
        textarea.value = nextValue;

        const nextCursor = start + 1;
        textarea.selectionStart = nextCursor;
        textarea.selectionEnd = nextCursor;

        textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }

    function insertNewline(promptEl) {
        if (promptEl instanceof HTMLTextAreaElement) {
            insertNewlineIntoTextarea(promptEl);
            return;
        }
        dispatchEnter(promptEl, { shiftKey: true });
    }

    function isStopButton(button) {
        if (!(button instanceof HTMLButtonElement)) return false;
        const testId = button.getAttribute('data-testid');
        if (testId && testId.toLowerCase().includes('stop')) return true;
        const aria = button.getAttribute('aria-label') || '';
        if (/stop/i.test(aria)) return true;
        if (button.querySelector('svg[aria-label*="Stop"]')) return true;
        return false;
    }

    function isGenerating(form) {
        if (!form) return false;
        const stopButton = form.querySelector('button[data-testid="stop-button"]');
        if (stopButton) return true;
        const submitButton = form.querySelector('#composer-submit-button');
        return submitButton ? isStopButton(submitButton) : false;
    }

    function clickSendButtonNear(promptEl) {
        const form = promptEl.closest('form');
        const button = form?.querySelector('button[data-testid="send-button"], button#composer-submit-button');
        if (!button || !(button instanceof HTMLButtonElement) || button.disabled) return false;
        if (isStopButton(button)) return false;
        button.click();
        return true;
    }

    function sendMessage(promptEl) {
        const form = promptEl.closest('form');
        if (isGenerating(form)) return;
        if (clickSendButtonNear(promptEl)) return;
        dispatchEnter(promptEl, { shiftKey: false });
    }

    function handleKeyDown(event) {
        if (event.key !== 'Enter') return;
        if (!event.isTrusted) return;
        if (event.isComposing || event.keyCode === 229) return;

        const promptEl = getPromptElementFrom(event.target) || getPromptElementFrom(document.activeElement);
        if (!promptEl) return;

        const wantsSend = event.metaKey || event.ctrlKey;
        if (wantsSend && event.repeat) {
            event.preventDefault();
            event.stopImmediatePropagation();
            return;
        }

        event.preventDefault();
        event.stopImmediatePropagation();

        if (wantsSend) {
            sendMessage(promptEl);
        } else {
            insertNewline(promptEl);
        }
    }

    window.addEventListener('keydown', handleKeyDown, true);
})();
