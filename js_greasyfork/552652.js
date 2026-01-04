// ==UserScript==
// @name         おんｊらくちん安価
// @namespace    K9Y_onj
// @version      1.1
// @description  Detect Ctrl + numbers (up to 3 digits) and insert formatted text
// @match        https://hayabusa.open2ch.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552652/%E3%81%8A%E3%82%93%EF%BD%8A%E3%82%89%E3%81%8F%E3%81%A1%E3%82%93%E5%AE%89%E4%BE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/552652/%E3%81%8A%E3%82%93%EF%BD%8A%E3%82%89%E3%81%8F%E3%81%A1%E3%82%93%E5%AE%89%E4%BE%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let buffer = "";
    let timeout = null;
    const WAIT_TIME = 200;

    window.addEventListener('keydown', (e) => {
        if (e.ctrlKey && /^[0-9]$/.test(e.key)) {
            e.preventDefault();
            buffer += e.key;
            if (buffer.length > 3) buffer = buffer.slice(-3);
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                insertText(`>>${buffer}\n`);
                buffer = "";
            }, WAIT_TIME);
        }
    });

    function insertText(text) {
        const el = document.activeElement;
        if (el && (el.tagName === "TEXTAREA" || (el.tagName === "INPUT" && el.type === "text" || el.isContentEditable))) {
            const start = el.selectionStart;
            const end = el.selectionEnd;
            const value = el.value;
            el.value = value.slice(0, start) + text + value.slice(end);
            el.selectionStart = el.selectionEnd = start + text.length;
            el.dispatchEvent(new Event("input", { bubbles: true }));
        }
    }

})();
