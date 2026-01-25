// ==UserScript==
// @name         B站搜索框净化 (搜索词语替换 + 移除热榜面板)
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  移除b站热榜并统一搜索框提示文字
// @author       Kawaii Gemini
// @match        *://*.bilibili.com/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563975/B%E7%AB%99%E6%90%9C%E7%B4%A2%E6%A1%86%E5%87%80%E5%8C%96%20%28%E6%90%9C%E7%B4%A2%E8%AF%8D%E8%AF%AD%E6%9B%BF%E6%8D%A2%20%2B%20%E7%A7%BB%E9%99%A4%E7%83%AD%E6%A6%9C%E9%9D%A2%E6%9D%BF%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563975/B%E7%AB%99%E6%90%9C%E7%B4%A2%E6%A1%86%E5%87%80%E5%8C%96%20%28%E6%90%9C%E7%B4%A2%E8%AF%8D%E8%AF%AD%E6%9B%BF%E6%8D%A2%20%2B%20%E7%A7%BB%E9%99%A4%E7%83%AD%E6%A6%9C%E9%9D%A2%E6%9D%BF%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targetText = "请..善用搜索";

    // 1. CSS 部分：强制隐藏搜索面板，防止热搜弹出
    const style = document.createElement('style');
    style.innerHTML = `
        .search-pannel, .search-panel, .nav-search-menu, .search-suggest {
            display: none !important;
        }
    `;
    document.documentElement.appendChild(style);

    // 2. JS 部分：处理 placeholder 逻辑
    function fixPlaceholder(el) {
        if (el.getAttribute('placeholder') !== targetText) {
            el.setAttribute('placeholder', targetText);
        }
        if (el.getAttribute('title') !== targetText) {
            el.setAttribute('title', targetText);
        }
    }

    const observer = new MutationObserver((mutations) => {
        // 性能优化：只寻找特定的输入框类名
        const inputs = document.querySelectorAll('.nav-search-input, .nav-search-content');

        inputs.forEach(input => {
            fixPlaceholder(input);
        });
    });

    // 监听整个文档的属性变化，确保在 B 站脚本修改 placeholder 后能秒改回来
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['placeholder', 'title']
    });

})();