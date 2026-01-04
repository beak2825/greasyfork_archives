// ==UserScript==
// @name         ChatGPT fix for missing caret
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Fixes ChatGPT bug where caret disappears after pasting CRLF-based newlines (Windows standard); converts CRLF to LF and pastes properly in ChatGPT ProseMirror editor
// @license      MIT
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @grant        none
// @homepage     https://greasyfork.org/en/scripts/559039/
// @downloadURL https://update.greasyfork.org/scripts/559039/ChatGPT%20fix%20for%20missing%20caret.user.js
// @updateURL https://update.greasyfork.org/scripts/559039/ChatGPT%20fix%20for%20missing%20caret.meta.js
// ==/UserScript==

(function ()
{
    'use strict';

    document.addEventListener('paste', function (event)
    {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;

        const prosemirror = target.closest('.ProseMirror');
        if (!prosemirror) return;

        const clipdata = event.clipboardData;
        if (!clipdata) return;

        const text = clipdata.getData('text/plain');
        if (!text || !text.includes('\r\n')) return;

        event.preventDefault();

        const normalized = text.replace(/\r\n?/g, '\n');
        const datatransfer = new DataTransfer();
        datatransfer.setData('text/plain', normalized);

        const syntheticpaste = new ClipboardEvent('paste',
        {
            clipboardData: datatransfer,
            bubbles: true,
            cancelable: true
        });

        target.dispatchEvent(syntheticpaste);
    }, true);
})();