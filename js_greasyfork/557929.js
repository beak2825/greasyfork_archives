// ==UserScript==
// @name         chichi-pui-fast-tag
// @namespace    http://tampermonkey.net/
// @version      2025-08-23
// @description  to paste tags fast in chichi-pui
// @author       chibimiku
// @license MIT
// @match        https://www.chichi-pui.com/posts/upload/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chichi-pui.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557929/chichi-pui-fast-tag.user.js
// @updateURL https://update.greasyfork.org/scripts/557929/chichi-pui-fast-tag.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建悬浮按钮
    const floatingButton = document.createElement('button');
    floatingButton.innerHTML = '📋';
    floatingButton.style.position = 'fixed';
    floatingButton.style.bottom = '20px';
    floatingButton.style.right = '20px';
    floatingButton.style.zIndex = '9999';
    floatingButton.style.width = '50px';
    floatingButton.style.height = '50px';
    floatingButton.style.borderRadius = '50%';
    floatingButton.style.backgroundColor = '#4CAF50';
    floatingButton.style.color = 'white';
    floatingButton.style.border = 'none';
    floatingButton.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    floatingButton.style.cursor = 'pointer';
    floatingButton.style.fontSize = '20px';
    floatingButton.title = '点击输入剪贴板内容';

    // 添加按钮到页面
    document.body.appendChild(floatingButton);

    // 处理按钮点击事件
    floatingButton.addEventListener('click', async function() {
        try {
            // 读取剪贴板内容
            const clipboardText = await navigator.clipboard.readText();

            if (!clipboardText.trim()) {
                showNotification('错误', '剪贴板为空或只包含空白字符');
                return;
            }

            // 按行分割并清理数据
            const lines = clipboardText.split('\n').map(line => line.trim()).filter(line => line);

            if (lines.length === 0) {
                showNotification('错误', '剪贴板中没有有效内容');
                return;
            }

            // 查找目标输入框
            const inputElement = findInputElement();
            if (!inputElement) {
                showNotification('错误', '未找到符合条件的输入框');
                return;
            }

            // 输入内容
            await inputLinesSequentially(inputElement, lines);

            showNotification('成功', `已输入 ${lines.length} 行内容`);

        } catch (error) {
            console.error('错误:', error);
            showNotification('错误', `无法读取剪贴板: ${error.message}`);
        }
    });

    // 查找目标输入框
    function findInputElement() {
        const inputs = document.querySelectorAll('input[placeholder*="タグを入力"]');
        return inputs.length > 0 ? inputs[0] : null;
    }

    // 顺序输入行内容
    async function inputLinesSequentially(inputElement, lines) {
        // 保存原始值以便在出错时恢复
        const originalValue = inputElement.value;

        try {
            // 聚焦到输入框
            inputElement.focus();

            for (let i = 0; i < lines.length; i++) {
                // 设置输入框的值
                inputElement.value = lines[i];

                // 触发输入事件以确保相关监听器被触发
                const inputEvent = new Event('input', { bubbles: true });
                inputElement.dispatchEvent(inputEvent);

                // 触发回车键事件
                const enterEvent = new KeyboardEvent('keypress', {
                    key: 'Enter',
                    keyCode: 13,
                    code: 'Enter',
                    which: 13,
                    charCode: 13,
                    bubbles: true
                });
                inputElement.dispatchEvent(enterEvent);

                // 等待一段时间再输入下一行（可调整延迟时间）
                await new Promise(resolve => setTimeout(resolve, 300));
            }
        } catch (error) {
            // 出错时恢复原始值
            inputElement.value = originalValue;
            throw error;
        }
    }

    // 显示通知
    function showNotification(title, message) {
        if (typeof GM_notification !== 'undefined') {
            GM_notification({
                title: title,
                text: message,
                timeout: 3000
            });
        } else {
            alert(`${title}: ${message}`);
        }
    }

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        button:hover {
            animation: pulse 1s infinite;
            background-color: #3e8e41 !important;
        }
    `;
    document.head.appendChild(style);
})();