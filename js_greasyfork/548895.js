// ==UserScript==
// @name         MS Learn 中文跳转按钮
// @namespace    LemonNoCry
// @license      MIT
// @version      1.2
// @description  在 Microsoft Learn 页面自动添加按钮，跳转到 zh-cn 中文版本
// @match        https://learn.microsoft.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548895/MS%20Learn%20%E4%B8%AD%E6%96%87%E8%B7%B3%E8%BD%AC%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/548895/MS%20Learn%20%E4%B8%AD%E6%96%87%E8%B7%B3%E8%BD%AC%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 用正则找出 /xx-xx/ 的语言路径并替换成 /zh-cn/
    const currentUrl = window.location.href;
    const zhUrl = currentUrl.replace(/\/[a-z]{2}(?:-[a-z]{2})?\//i, '/zh-cn/');

    // 如果已经是 zh-cn 就不显示按钮
    if (currentUrl.includes('/zh-cn/')) return;

    // 轮询等待 DOM 出现
    const timer = setInterval(() => {
        const container = document.querySelector('.buttons');

        if (container) {
            // 防止重复插入
            if (!container.querySelector('.my-zh-btn')) {
                const btn = document.createElement('a');
                btn.textContent = '中文文档';
                btn.href = zhUrl;
                btn.className = 'button button-sm button-primary button-filled margin-right-none my-zh-btn';
                btn.style.backgroundColor = '#0078d4';
                btn.style.marginLeft = '8px';
                container.appendChild(btn);
            }
            clearInterval(timer);
        }
    }, 500); // 每 500ms 检查一次
})();
