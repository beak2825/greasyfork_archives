// ==UserScript==
// @name         Qwen 快捷发送（Ctrl+Enter）
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在 qianwen.com 按 Ctrl+Enter 或 Cmd+Enter 自动点击发送按钮
// @author       You
// @match        https://qianwen.com/*
// @match        https://*.qianwen.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560047/Qwen%20%E5%BF%AB%E6%8D%B7%E5%8F%91%E9%80%81%EF%BC%88Ctrl%2BEnter%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/560047/Qwen%20%E5%BF%AB%E6%8D%B7%E5%8F%91%E9%80%81%EF%BC%88Ctrl%2BEnter%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 监听键盘事件
    document.addEventListener('keydown', function(e) {
        // 仅在输入框聚焦时生效（避免全局误触）
        const activeEl = document.activeElement;
        const isInput = ['TEXTAREA', 'INPUT'].includes(activeEl?.tagName) ||
                        activeEl?.getAttribute('contenteditable') === 'true';

        if (isInput && (e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();

            // 查找发送按钮（支持动态加载延迟）
            let sendBtn = document.getElementsByClassName("operateBtn-JsB9e2")[0];

            if (!sendBtn) {
                // 尝试更宽松的选择器（以防类名微变）
                sendBtn = [...document.querySelectorAll('[class*="operateBtn"]')]
                    .find(el => el.offsetParent !== null); // 排除隐藏元素
            }

            if (sendBtn && !sendBtn.disabled) {
                sendBtn.click();
                console.log('🚀 Qwen: 已通过快捷键发送消息');
            } else {
                console.warn('⚠️ Qwen: 未找到可用的发送按钮');
            }
        }
    });
})();