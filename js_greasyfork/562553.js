// ==UserScript==
// @name         ChatGPT Fix Modal Translate
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Disable -translate-x-1/2 for ChatGPT modals to fix left-offset issue
// @author       YourName
// @match        https://chatgpt.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562553/ChatGPT%20Fix%20Modal%20Translate.user.js
// @updateURL https://update.greasyfork.org/scripts/562553/ChatGPT%20Fix%20Modal%20Translate.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个 style 元素
    const style = document.createElement('style');
    style.innerHTML = `
        /* 禁用 Tailwind utilities 的横向平移 */
        .ltr\\:-translate-x-1\\/2 {
            --tw-translate-x: 0% !important;
            translate: 0 var(--tw-translate-y) !important;
        }
    `;
    document.head.appendChild(style);

    console.log('[ChatGPT Fix] Disabled -translate-x-1/2');
})();
