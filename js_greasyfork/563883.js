// ==UserScript==
// @name         Example Greasy Fork Compliant Script
// @namespace    https://greasyfork.org/users/your-id
// @version      1.0.0
// @description  Tự động tô sáng các đoạn văn bản được bôi đen trên trang web.
// @author       Your Name
// @license      MIT
// @match        https://example.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/563883/Example%20Greasy%20Fork%20Compliant%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/563883/Example%20Greasy%20Fork%20Compliant%20Script.meta.js
// ==/UserScript==

/*
 This script highlights selected text on the page by wrapping it in a <mark> tag.
 No tracking, no ads, no external code loading.
*/

(function () {
    'use strict';

    /**
     * Highlight currently selected text
     */
    function highlightSelection() {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) {
            return;
        }

        const range = selection.getRangeAt(0);
        if (range.collapsed) {
            return;
        }

        const mark = document.createElement('mark');
        mark.style.backgroundColor = 'yellow';

        try {
            range.surroundContents(mark);
            selection.removeAllRanges();
        } catch (error) {
            console.warn('Unable to highlight selection:', error);
        }
    }

    /**
     * Add keyboard shortcut: Ctrl + Shift + H
     */
    document.addEventListener('keydown', function (event) {
        if (event.ctrlKey && event.shiftKey && event.key === 'H') {
            highlightSelection();
        }
    });

})();
