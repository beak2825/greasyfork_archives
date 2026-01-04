// ==UserScript==
// @name         知乎自动关闭登录弹窗
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  页面加载完成后自动点掉知乎的弹窗关闭按钮
// @author       你自己
// @match        *://*.zhihu.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548256/%E7%9F%A5%E4%B9%8E%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E7%99%BB%E5%BD%95%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/548256/%E7%9F%A5%E4%B9%8E%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E7%99%BB%E5%BD%95%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 页面加载完执行一次
    window.addEventListener('load', () => {
        const btn = document.querySelector('button[aria-label="关闭"].Button.Modal-closeButton.Button--plain');
        if (btn) {
            btn.click();
        }
    });

    // 有些弹窗是后来动态插入的，用 MutationObserver 监听
    const observer = new MutationObserver(() => {
        const btn = document.querySelector('button[aria-label="关闭"].Button.Modal-closeButton.Button--plain');
        if (btn) {
            btn.click();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
