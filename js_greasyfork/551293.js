// ==UserScript==
// @name         DeepSeek Chat Ctrl+Enter to Send
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  Ctrl+Enter or Cmd+Enter sends the message, Enter only breaks the line（applies to chat.deepseek.com）
// @author       ChatGPT
// @match        https://chat.deepseek.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551293/DeepSeek%20Chat%20Ctrl%2BEnter%20to%20Send.user.js
// @updateURL https://update.greasyfork.org/scripts/551293/DeepSeek%20Chat%20Ctrl%2BEnter%20to%20Send.meta.js
// ==/UserScript==

(function () {
    'use strict';

    document.addEventListener('keydown', function (e) {
        if (document.activeElement?.tagName === 'TEXTAREA') {
            if (e.key === 'Enter') {
                e.preventDefault();
                e.stopImmediatePropagation();

                if (e.ctrlKey || e.metaKey) {
                    // Ctrl+Enter or Cmd+Enter → send
                    const sendBtn = document.querySelector('path[d="M8.3125 0.981587C8.66767 1.0545 8.97902 1.20558 9.2627 1.43374C9.48724 1.61438 9.73029 1.85933 9.97949 2.10854L14.707 6.83608L13.293 8.25014L9 3.95717V15.0431H7V3.95717L2.70703 8.25014L1.29297 6.83608L6.02051 2.10854C6.26971 1.85933 6.51277 1.61438 6.7373 1.43374C6.97662 1.24126 7.28445 1.04542 7.6875 0.981587C7.8973 0.94841 8.1031 0.956564 8.3125 0.981587Z"]')?.closest('.ds-icon-button');
                    if (!sendBtn) {
                        console.warn('[Tampermonkey] ❌ Send button not found');
                        return;
                    }
                    sendBtn.click();
                } else {
                    // Only Enter → inserts a newline (prevents default sending)
                    const textarea = document.activeElement;
                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;
                    const value = textarea.value;

                    // Insert a line break
                    textarea.value = value.slice(0, start) + '\n' + value.slice(end);
                    textarea.selectionStart = textarea.selectionEnd = start + 1;

                    // Trigger input event to update state
                    textarea.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }
        }
    }, true);
})();
