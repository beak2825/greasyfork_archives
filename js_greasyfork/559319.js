// ==UserScript==
// @name         Qwen Chat: Enter = New Line, Ctrl+Enter = Send (Working Version)
// @name:ru      Qwen Chat: Enter = новая строка, Ctrl+Enter = отправка (рабочая версия)
// @namespace    qwen-patch
// @match        https://chat.qwen.ai/*
// @grant        none
// @run-at       document-idle
// @description  Allows using Enter to insert a new line and Ctrl+Enter to send a message in Qwen Chat.
// @description:ru  Позволяет использовать Enter для переноса строки и Ctrl+Enter для отправки сообщения в Qwen Chat.
// @version      1.0.0
// @author       Hipahopa808
// @license      MIT
// @supportURL   
// @homepageURL  https://chat.qwen.ai/
// @downloadURL https://update.greasyfork.org/scripts/559319/Qwen%20Chat%3A%20Enter%20%3D%20New%20Line%2C%20Ctrl%2BEnter%20%3D%20Send%20%28Working%20Version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559319/Qwen%20Chat%3A%20Enter%20%3D%20New%20Line%2C%20Ctrl%2BEnter%20%3D%20Send%20%28Working%20Version%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver(() => {
        const textarea = document.querySelector('textarea#chat-input');
        if (!textarea || textarea.hasAttribute('data-patched')) return;

        textarea.setAttribute('data-patched', 'true');
        console.log('✅ Input field found: textarea#chat-input');

        textarea.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                if (e.ctrlKey) {
                    // Ctrl+Enter → submit via form
                    e.preventDefault();
                    e.stopImmediatePropagation();

                    const form = this.closest('form');
                    if (form) {
                        form.requestSubmit();
                        console.log('🚀 Message sent via form using Ctrl+Enter');
                    } else {
                        // Fallback: find send button
                        const sendButton = document.querySelector(
                            'button[type="submit"], button[aria-label*="send" i], .send-button, [data-testid*="send"]'
                        );
                        if (sendButton) {
                            sendButton.click();
                            console.log('🚀 Message sent via button using Ctrl+Enter');
                        } else {
                            console.warn('⚠️ Neither form nor send button found');
                        }
                    }
                } else {
                    // Plain Enter → insert new line
                    e.preventDefault();
                    e.stopImmediatePropagation();

                    const start = this.selectionStart;
                    const end = this.selectionEnd;

                    // Insert \n using setRangeText
                    this.setRangeText('\n', start, end, 'end');

                    // Simulate input event as if user typed the character
                    const inputEvent = new InputEvent('input', {
                        bubbles: true,
                        cancelable: true,
                        data: '\n'
                    });
                    this.dispatchEvent(inputEvent);

                    console.log('✅ New line inserted via setRangeText + InputEvent');
                }
            }
        }, true); // capture phase — intercept before React handles it
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();