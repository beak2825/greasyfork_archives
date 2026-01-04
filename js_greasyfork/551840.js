// ==UserScript==
// @name         Stepik Invisible Character Button
// @namespace    https://stepik.org/
// @version      1.0
// @description  Adds invisible character button to Stepik comment editor
// @match        https://stepik.org/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551840/Stepik%20Invisible%20Character%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/551840/Stepik%20Invisible%20Character%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const INVISIBLE_CHAR = '\u200B'; // Zero-width space

    function insertInvisibleChar() {
        const editor = document.querySelector('.rich-text-editor__content[contenteditable="true"]');
        if (!editor) return;

        // Insert invisible character at cursor position
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);

        const textNode = document.createTextNode(INVISIBLE_CHAR);
        range.insertNode(textNode);

        // Move cursor after inserted character
        range.setStartAfter(textNode);
        range.setEndAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);

        // Trigger input events to enable submit button
        editor.dispatchEvent(new Event('input', { bubbles: true }));
        editor.dispatchEvent(new Event('change', { bubbles: true }));
        editor.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));

        // Focus editor
        editor.focus();
    }

    function createButton() {
        const btn = document.createElement('a');
        btn.id = 'invisible-char-btn';
        btn.className = 'cke_button cke_button_off';
        btn.title = 'Insert Invisible Character';
        btn.tabIndex = '-1';
        btn.setAttribute('role', 'button');
        btn.style.cursor = 'pointer';

        const icon = document.createElement('span');
        icon.className = 'cke_button_icon';
        icon.style.cssText = 'background: none; width: 16px; height: 16px; display: inline-block;';
        icon.innerHTML = '⧉';
        icon.style.fontSize = '16px';
        icon.style.lineHeight = '16px';

        const label = document.createElement('span');
        label.className = 'cke_button_label';
        label.textContent = 'Invisible Char';
        label.style.display = 'none';

        btn.appendChild(icon);
        btn.appendChild(label);

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            insertInvisibleChar();
        });

        return btn;
    }

    function addButton() {
        const toolgroup = document.querySelector('.cke_toolgroup');
        if (!toolgroup) {
            setTimeout(addButton, 500);
            return;
        }

        if (document.getElementById('invisible-char-btn')) return;

        const btn = createButton();
        toolgroup.appendChild(btn);
    }

    // Wait for editor to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(addButton, 1000));
    } else {
        setTimeout(addButton, 1000);
    }

    // Re-add button if comment widget reloads
    const observer = new MutationObserver(() => {
        if (document.querySelector('.cke_toolgroup') && !document.getElementById('invisible-char-btn')) {
            addButton();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();