// ==UserScript==
// @name         Simple Text Highlighter
// @namespace    https://greasyfork.org/users/your-id
// @version      1.0.0
// @description  Cho phép người dùng tô màu (highlight) đoạn văn bản được chọn trên trang web bằng phím tắt.
// @author       YourName
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563976/Simple%20Text%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/563976/Simple%20Text%20Highlighter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * Highlight đoạn văn bản người dùng đang chọn
     */
    function highlightSelection() {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) {
            return;
        }

        const range = selection.getRangeAt(0);

        // Không highlight nếu không có text
        if (range.collapsed) {
            return;
        }

        const span = document.createElement('span');
        span.style.backgroundColor = 'yellow';
        span.style.color = 'black';

        try {
            range.surroundContents(span);
            selection.removeAllRanges();
        } catch (error) {
            console.warn('Không thể highlight nội dung này:', error);
        }
    }

    /**
     * Phím tắt: Ctrl + Shift + H
     */
    document.addEventListener('keydown', function (event) {
        if (event.ctrlKey && event.shiftKey && event.key === 'H') {
            highlightSelection();
        }
    });

})();
