// ==UserScript==
// @name         qwen css
// @description  a
// @match        https://chat.qwen.ai/*
// @version 0.0.1.20260108151116
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/556171/qwen%20css.user.js
// @updateURL https://update.greasyfork.org/scripts/556171/qwen%20css.meta.js
// ==/UserScript==

(function () {
    const style = document.createElement('style');
style.id = 'qwenCssStyleId';

    style.textContent = `
.user-message-text-content, .chat-user-message {
    background-color: red !important;
    color: black !important;
}
        `;
    document.head.appendChild(style);
})();