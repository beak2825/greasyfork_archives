// ==UserScript==
// @name         publink-notebookllm-beautify
// @namespace    http://tampermonkey.net/
// @version      0.30
// @description  notebookllm 样式美化
// @author       huangbc
// @include      https://notebooklm.google.com/*
// @match        https://notebooklm.google.com/*
// @match        https://notebooklm.google.com/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shb.ltd
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/554946/publink-notebookllm-beautify.user.js
// @updateURL https://update.greasyfork.org/scripts/554946/publink-notebookllm-beautify.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('gemini-beautify')
     // 使用 GM_addStyle 添加样式
    GM_addStyle(`
        .featured-projects-container {
           display: none !important;
        }
        /* 添加更多自定义样式 */
    `);
    
    // 监听 DOM 变化，确保样式应用到动态加载的元素
    const observer = new MutationObserver(function() {
        // 可以在这里重新应用样式或处理动态元素
    });
    
    // 开始观察
    observer.observe(document.body, { childList: true, subtree: true });

    // Your code here...
})();