// ==UserScript==
// @name         JAVDB隐藏低评分视频（<4.0）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动隐藏javdb评分低于 4.0 的视频条目
// @author       yifan
// @match        https://javdb.com/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553224/JAVDB%E9%9A%90%E8%97%8F%E4%BD%8E%E8%AF%84%E5%88%86%E8%A7%86%E9%A2%91%EF%BC%88%3C40%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/553224/JAVDB%E9%9A%90%E8%97%8F%E4%BD%8E%E8%AF%84%E5%88%86%E8%A7%86%E9%A2%91%EF%BC%88%3C40%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideLowRatedItems() {
        // 查找所有 .item 元素
        const items = document.querySelectorAll('div.item');

        items.forEach(item => {
            // 在 .score 元素中查找评分
            const scoreElement = item.querySelector('.score .value');
            if (!scoreElement) return;

            const text = scoreElement.textContent || scoreElement.innerText;
            // 提取数字
            const match = text.match(/(\d+(\.\d+)?)/);
            if (match) {
                const score = parseFloat(match[1]);
                if (score < 4.1) {
                    // 隐藏整个 .item
                    item.style.display = 'none';
                }
            }
        });
    }

    // 初次执行
    hideLowRatedItems();

    // 监听
    const observer = new MutationObserver(() => {
        hideLowRatedItems();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();