// ==UserScript==
// @name         Helpdesk - Отправка сообщений по Enter
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Отправка по Enter вместо Ctrl+Enter + автоматический возврат фокуса
// @license MIT
// @author       You
// @match        https://stroitelnyjdvor.helpdeskeddy.com/*
// @grant        none
// @run-at       document-idle
// @language     ru
// @downloadURL https://update.greasyfork.org/scripts/551272/Helpdesk%20-%20%D0%9E%D1%82%D0%BF%D1%80%D0%B0%D0%B2%D0%BA%D0%B0%20%D1%81%D0%BE%D0%BE%D0%B1%D1%89%D0%B5%D0%BD%D0%B8%D0%B9%20%D0%BF%D0%BE%20Enter.user.js
// @updateURL https://update.greasyfork.org/scripts/551272/Helpdesk%20-%20%D0%9E%D1%82%D0%BF%D1%80%D0%B0%D0%B2%D0%BA%D0%B0%20%D1%81%D0%BE%D0%BE%D0%B1%D1%89%D0%B5%D0%BD%D0%B8%D0%B9%20%D0%BF%D0%BE%20Enter.meta.js
// ==/UserScript==

(function() {
'use strict';

function findButtonByText(text) {
    const buttons = document.querySelectorAll('button.el-button--primary');
    for (let btn of buttons) if (btn.textContent.trim() === text) return btn;
    return null;
}

function setCursorToEnd(el) {
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
}

function patchEditor(editorDiv, buttonText) {
    if (editorDiv.hasAttribute('data-patched')) return;
    editorDiv.setAttribute('data-patched', 'true');

    editorDiv.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
            e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
            editorDiv.contentEditable = false;

            setTimeout(() => {
                editorDiv.innerHTML = '';
                editorDiv.contentEditable = true;
                editorDiv.focus();
                setCursorToEnd(editorDiv);

                const button = findButtonByText(buttonText);
                if (button && !button.disabled) button.click();

                setTimeout(() => {
                    if (document.activeElement !== editorDiv) {
                        editorDiv.focus();
                        setCursorToEnd(editorDiv);
                    }
                }, 50);
            }, 0);
        }
    }, true);
}

function checkAndPatchEditors() {
    const editors = Array.from(document.querySelectorAll('.ck-editor__editable[contenteditable="true"]'));
    if (editors[0]) patchEditor(editors[0], 'Добавить ответ');
    if (editors[1]) patchEditor(editors[1], 'Добавить комментарий');
}

setTimeout(checkAndPatchEditors, 1000);
const observer = new MutationObserver(checkAndPatchEditors);
observer.observe(document.body, { childList: true, subtree: true });
})();