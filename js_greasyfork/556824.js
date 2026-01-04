// ==UserScript==
// @name         Pintia Code Highlight
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自定义 Pintia 代码块样式，提升可读性
// @author       Rayni
// @match        https://pintia.cn/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556824/Pintia%20Code%20Highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/556824/Pintia%20Code%20Highlight.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 等待页面加载完成
    const observer = new MutationObserver(() => {
        const preElements = document.querySelectorAll('.rendered-markdown pre');
        preElements.forEach(pre => {
            // 添加自定义样式
            pre.style.display = 'flex';
            pre.style.backgroundColor = '#FFFFFF'; // 深色背景
            pre.style.color = '#000000';           // 浅灰色文本
            pre.style.border = '1px solid #444';
            pre.style.borderRadius = '8px';
            pre.style.padding = '1rem';
            pre.style.fontFamily = '"Fira Code", "Consolas", monospace';
            pre.style.fontSize = '14px';
            pre.style.wordBreak = 'break-all';
            pre.style.overflowX = 'auto';
            pre.style.margin = '0.5rem 0';
            pre.style.textOverflow = 'ellipsis';
            pre.style.whiteSpace = 'pre-wrap';
        });
    });

    // 观察 DOM 变化，以处理动态加载的内容
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始执行一次
    setTimeout(() => {
        observer.disconnect();
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }, 100);
})();