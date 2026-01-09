// ==UserScript==
// @name         Gemini 自动发送 URL 参数
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  进入 Gemini 时自动填入并发送 URL 参数 q 的内容，发送后自动清理 URL 防止重复触发。
// @author       boxjohn
// @match        https://gemini.google.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561796/Gemini%20%E8%87%AA%E5%8A%A8%E5%8F%91%E9%80%81%20URL%20%E5%8F%82%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/561796/Gemini%20%E8%87%AA%E5%8A%A8%E5%8F%91%E9%80%81%20URL%20%E5%8F%82%E6%95%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const autoSend = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const question = urlParams.get('q');

        if (!question) return;

        // 1. 立即清理 URL 参数，防止刷新重复发送
        const newUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);

        console.log("已获取问题并清理 URL 痕迹:", question);

        // 2. 轮询查找输入框
        const checkExist = setInterval(() => {
            // 兼容多种可能的输入框选择器
            const editor = document.querySelector('.ql-editor[contenteditable="true"]') || 
                           document.querySelector('textarea[aria-label]');
            
            if (editor) {
                clearInterval(checkExist);

                // 3. 聚焦并填入文本
                editor.focus();
                // 使用 insertText 能确保触发 React/Angular 的状态更新
                document.execCommand('insertText', false, question);

                // 4. 触发 input 事件确保发送按钮解除禁用
                editor.dispatchEvent(new Event('input', { bubbles: true }));

                // 5. 查找发送按钮并点击
                setTimeout(() => {
                    const sendButton = document.querySelector('button[aria-label*="发送"], button[aria-label*="Send"]');
                    if (sendButton && !sendButton.disabled) {
                        sendButton.click();
                        console.log("指令已成功发送。");
                    }
                }, 600);
            }
        }, 500);
    };

    // 执行脚本
    if (document.readyState === 'complete') {
        autoSend();
    } else {
        window.addEventListener('load', autoSend);
    }
})();