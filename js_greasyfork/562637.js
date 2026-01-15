// ==UserScript==
// @name         Simple Page Word Counter
// @namespace    https://greasyfork.org/users/your-id
// @version      1.0.0
// @description  Hiển thị số lượng từ của nội dung trang web hiện tại.
// @author       Your Name
// @license      MIT
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562637/Simple%20Page%20Word%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/562637/Simple%20Page%20Word%20Counter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * Script này đếm số từ trong nội dung văn bản của trang web
     * và hiển thị kết quả ở góc dưới bên phải màn hình.
     */

    function countWords(text) {
        if (!text) {
            return 0;
        }
        return text
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .length;
    }

    function getPageText() {
        return document.body ? document.body.innerText : '';
    }

    function createCounterBox(wordCount) {
        const box = document.createElement('div');
        box.textContent = `Word count: ${wordCount}`;
        box.style.position = 'fixed';
        box.style.bottom = '10px';
        box.style.right = '10px';
        box.style.backgroundColor = '#222';
        box.style.color = '#fff';
        box.style.padding = '8px 12px';
        box.style.borderRadius = '6px';
        box.style.fontSize = '14px';
        box.style.zIndex = '99999';
        box.style.opacity = '0.8';
        return box;
    }

    function run() {
        const text = getPageText();
        const wordCount = countWords(text);
        const counterBox = createCounterBox(wordCount);
        document.body.appendChild(counterBox);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', run);
    } else {
        run();
    }
})();
