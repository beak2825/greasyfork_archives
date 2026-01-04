// ==UserScript==
// @name         知乎去除登录弹窗 （2025最新可用）
// @name:zh-CN   知乎去除登录弹窗（2025最新可用）
// @namespace    https://gist.github.com/your-username
// @version      2.0
// @description  移除知乎登录弹窗和遮罩
// @description:en Automatically and immediately removes the zhihu.com login modal and backdrop. Works on first load without refresh.
// @author       Gemini 2.5 pro
// @match        *://*.zhihu.com/*
// @grant        GM_addStyle
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/552736/%E7%9F%A5%E4%B9%8E%E5%8E%BB%E9%99%A4%E7%99%BB%E5%BD%95%E5%BC%B9%E7%AA%97%20%EF%BC%882025%E6%9C%80%E6%96%B0%E5%8F%AF%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/552736/%E7%9F%A5%E4%B9%8E%E5%8E%BB%E9%99%A4%E7%99%BB%E5%BD%95%E5%BC%B9%E7%AA%97%20%EF%BC%882025%E6%9C%80%E6%96%B0%E5%8F%AF%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 任务1: 立即注入CSS，防止页面滚动被锁定。
    // @run-at document-start 确保了这行代码在最早的时机执行。
    GM_addStyle('html, body { overflow: auto !important; }');

    // 任务2: 等待DOM加载完成后，再执行所有与DOM操作相关的JavaScript代码。
    // 这解决了脚本在 document.body 未创建时执行而导致失败的问题。
    window.addEventListener('DOMContentLoaded', (event) => {
        console.log('[知乎去弹窗脚本] DOM 已加载，开始监视弹窗...');

        // 定义移除弹窗的核心函数
        const removeLoginModal = () => {
            const modalWrapper = document.querySelector('.Modal-wrapper');
            if (modalWrapper && modalWrapper.querySelector('.signFlowModal')) {
                console.log('[知乎去弹窗脚本] 检测到登录弹窗，正在移除...');
                modalWrapper.remove();
                console.log('[知乎去弹窗脚本] 弹窗已成功移除。');
                return true; // 返回true表示成功移除了
            }
            return false; // 返回false表示没找到弹窗
        };

        // 页面加载完成后，立即执行一次检查，以防弹窗已存在
        removeLoginModal();

        // 创建一个 MutationObserver 来监视后续动态添加的弹窗
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // 如果检测到DOM有新节点添加，就尝试移除弹窗
                    // 这里的检查是高效的，因为只有在页面变化时才触发
                    if (removeLoginModal()) {
                        // 成功移除后可以断开观察，但考虑到知乎是单页应用(SPA)，
                        // 在页面内跳转时不会重新加载脚本，所以持续观察是最佳选择。
                    }
                }
            }
        });

        // 启动监视，目标是 document.body
        // 此时 document.body 必定存在
        observer.observe(document.body, {
            childList: true, // 监视子节点的添加或删除
            subtree: true    // 监视所有后代节点
        });
    });
})();