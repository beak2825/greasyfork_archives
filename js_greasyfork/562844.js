// ==UserScript==
// @name         Perplexity AI - Enter发送
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在 Perplexity AI 中，Enter 直接发送消息，Ctrl+Enter 换行
// @author       spin6lock
// @license      MIT
// @match        https://www.perplexity.ai/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562844/Perplexity%20AI%20-%20Enter%E5%8F%91%E9%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/562844/Perplexity%20AI%20-%20Enter%E5%8F%91%E9%80%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 使用事件捕获，确保在原事件处理器之前拦截
    document.addEventListener('keydown', function(e) {
        // 找到输入框 - Perplexity 使用多种可能的输入元素
        const target = e.target;
        const isInputField = target.tagName === 'TEXTAREA' ||
                            target.tagName === 'INPUT' ||
                            target.contentEditable === 'true' ||
                            target.closest('[contenteditable="true"]');

        if (!isInputField) return;

        // Ctrl+Enter 或 Cmd+Enter = 换行（允许默认行为）
        if (e.ctrlKey || e.metaKey) {
            if (e.key === 'Enter') {
                // 插入换行符
                e.stopPropagation();
                e.stopImmediatePropagation();

                // 对于 contenteditable 元素
                if (target.isContentEditable) {
                    const selection = window.getSelection();
                    const range = selection.getRangeAt(0);
                    const br = document.createElement('br');
                    range.insertNode(br);
                    range.setStartAfter(br);
                    range.setEndAfter(br);
                    selection.removeAllRanges();
                    selection.addRange(range);
                } else {
                    // 对于 textarea/input
                    const start = target.selectionStart;
                    const end = target.selectionEnd;
                    target.value = target.value.substring(0, start) + '\n' + target.value.substring(end);
                    target.selectionStart = target.selectionEnd = start + 1;
                }
                // 触发 input 事件以更新 UI
                target.dispatchEvent(new Event('input', { bubbles: true }));
            }
            return;
        }

        // 单独的 Enter = 发送（阻止默认换行）
        if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            // 触发发送按钮的点击事件
            // 策略1: 先尝试标准属性
            let sendButton = document.querySelector('button[aria-label*="Submit"], button[aria-label*="Send"], button[type="submit"]');

            // 策略2: 在 .scrollable-container 内查找
            if (!sendButton) {
                const container = document.querySelector('.scrollable-container');
                if (container) {
                    // 找到容器底部固定的按钮区域
                    const buttonArea = container.querySelector('.erp-sidecar\\:fixed button, div[class*="sidecar"] button');
                    if (buttonArea) sendButton = buttonArea;
                }
            }

            // 策略3: 查找包含箭头图标的按钮
            if (!sendButton) {
                const buttons = document.querySelectorAll('button');
                for (const btn of buttons) {
                    const svg = btn.querySelector('svg');
                    if (svg && (btn.innerHTML.includes('arrow') || btn.classList.contains('send'))) {
                        sendButton = btn;
                        break;
                    }
                }
            }

            if (sendButton) {
                sendButton.click();
            }
        }
    }, true); // 使用捕获阶段

    console.log('Perplexity Enter发送脚本已加载');
})();
