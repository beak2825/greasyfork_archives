// ==UserScript==
// @name         B 站移除评论区
// @namespace    https://github.com/SIXiaolong1117/Rules
// @version      0.2
// @description  隐藏并移除 Bilibili 页面中的评论区（支持异步加载与单页路由）
// @license      MIT
// @icon         https://www.bilibili.com/favicon.ico
// @author       SI Xiaolong
// @match        https://www.bilibili.com/*
// @match        https://m.bilibili.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/552602/B%20%E7%AB%99%E7%A7%BB%E9%99%A4%E8%AF%84%E8%AE%BA%E5%8C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/552602/B%20%E7%AB%99%E7%A7%BB%E9%99%A4%E8%AF%84%E8%AE%BA%E5%8C%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 注入 CSS（不删除，只隐藏）
    const css = `
        #commentapp {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            pointer-events: none !important;
        }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    // MutationObserver 保持隐藏（处理异步渲染）
    const observer = new MutationObserver(() => {
        const el = document.getElementById('commentapp');
        if (el) {
            el.style.display = 'none';
            el.style.visibility = 'hidden';
            el.style.opacity = '0';
            el.style.height = '0';
            el.style.margin = '0';
            el.style.padding = '0';
            el.style.pointerEvents = 'none';
        }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });

    // 定时检查兜底
    setInterval(() => {
        const el = document.getElementById('commentapp');
        if (el) {
            el.style.display = 'none';
            el.style.visibility = 'hidden';
            el.style.opacity = '0';
            el.style.height = '0';
            el.style.margin = '0';
            el.style.padding = '0';
            el.style.pointerEvents = 'none';
        }
    }, 2000);

    console.log('[Tampermonkey] B站评论区已隐藏');
})();