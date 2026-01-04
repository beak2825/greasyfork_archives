// ==UserScript==
// @name         删除百度首页搜索框的灰色搜索推荐 Remove Baidu Placeholder Attr
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove Baidu search box placeholders
// @match        *://www.baidu.com/*
// @match        *://baidu.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556928/%E5%88%A0%E9%99%A4%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E6%90%9C%E7%B4%A2%E6%A1%86%E7%9A%84%E7%81%B0%E8%89%B2%E6%90%9C%E7%B4%A2%E6%8E%A8%E8%8D%90%20Remove%20Baidu%20Placeholder%20Attr.user.js
// @updateURL https://update.greasyfork.org/scripts/556928/%E5%88%A0%E9%99%A4%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E6%90%9C%E7%B4%A2%E6%A1%86%E7%9A%84%E7%81%B0%E8%89%B2%E6%90%9C%E7%B4%A2%E6%8E%A8%E8%8D%90%20Remove%20Baidu%20Placeholder%20Attr.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removePlaceholders() {
        const ta = document.querySelector('#chat-textarea, textarea.chat-input-textarea');
        if (ta) {
            ta.removeAttribute('data-ai-placeholder');
            ta.removeAttribute('data-normal-placeholder');
            // 如需清空 placeholder 文本，也可加上：
             ta.setAttribute('placeholder', '');
        }
    }

    // 页面加载后执行
    removePlaceholders();

    // 百度可能动态更新，监听变化
    const observer = new MutationObserver(removePlaceholders);
    observer.observe(document.body, { childList: true, subtree: true });
})();
