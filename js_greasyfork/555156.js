// ==UserScript==
// @name         Folo - Remove AI Dialog
// @name:zh-CN   Folo - 移除AI对话框
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove the right-side AI dialog from Folo interface
// @description:zh-CN 移除Folo界面右侧的AI对话框
// @author       ObenK
// @license      MIT
// @match        https://app.folo.is/*
// @match        https://follow.is/*
// @match        http://localhost:*/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/555156/Folo%20-%20Remove%20AI%20Dialog.user.js
// @updateURL https://update.greasyfork.org/scripts/555156/Folo%20-%20Remove%20AI%20Dialog.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CSS样式来隐藏AI对话框
    const hideAICSS = `
        /* 隐藏右侧AI对话框区域 */
        .relative.flex.h-full.min-w-0.flex-col.overflow-hidden.bg-theme-background.flex-1,
        .relative.flex.h-full.min-w-0.flex-col.overflow-hidden.bg-background,
        [data-testid="chat-input-container"],
        [data-testid="chat-input"] {
            display: none !important;
        }
        
        /* 调整中间内容区域宽度，占满AI对话框的空间 */
        .relative.flex.h-full.flex-col.overflow-hidden.border-r.flex-none {
            flex-basis: 100% !important;
            min-width: 100% !important;
        }
        
        /* 隐藏AI相关的图标和按钮 */
        .i-mgc-ai-cute-fi,
        .i-mgc-folo-bot-original,
        [aria-label*="AI"],
        [aria-label*="ai"],
        [title*="AI"],
        [title*="ai"] {
            display: none !important;
        }
        
        /* 隐藏聊天相关的元素 */
        .mx-auto.w-full.max-w-4xl,
        .flex.size-full.flex-col.\@container,
        [style*="--ai-chat-layout-width"] {
            display: none !important;
        }
        
        /* 调整主容器布局 */
        .flex.h-full.min-w-0 {
            flex: 1 1 100% !important;
        }
        
        /* 隐藏特定的AI聊天容器 */
        main .relative.h-full.min-w-0.flex-1 > .relative.h-full.min-w-0.min-h-full.w-full.flex-none:last-child {
            display: none !important;
        }
        
        /* 确保中间内容区域扩展 */
        .relative.h-full.min-w-0.flex-1 {
            width: 100% !important;
        }
    `;

    // 添加CSS样式
    GM_addStyle(hideAICSS);

    // 动态移除AI对话框的函数
    function removeAIDialog() {
        // 查找并移除AI对话框相关的元素
        const aiSelectors = [
            '.relative.flex.h-full.min-w-0.flex-col.overflow-hidden.bg-theme-background.flex-1',
            '.relative.flex.h-full.min-w-0.flex-col.overflow-hidden.bg-background',
            '[data-testid="chat-input-container"]',
            '[data-testid="chat-input"]',
            '.mx-auto.w-full.max-w-4xl',
            '[style*="--ai-chat-layout-width"]'
        ];

        aiSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (el && !el.hasAttribute('data-ai-removed')) {
                    el.style.display = 'none';
                    el.setAttribute('data-ai-removed', 'true');
                }
            });
        });

        // 调整布局
        const middleColumn = document.querySelector('.relative.flex.h-full.flex-col.overflow-hidden.border-r.flex-none');
        if (middleColumn) {
            middleColumn.style.flexBasis = '100%';
            middleColumn.style.minWidth = '100%';
        }

        // 移除AI相关的按钮和图标
        const aiButtons = document.querySelectorAll('[aria-label*="AI"], [aria-label*="ai"], [title*="AI"], [title*="ai"]');
        aiButtons.forEach(btn => btn.style.display = 'none');
    }

    // 页面加载完成后执行
    function init() {
        // 立即执行一次
        removeAIDialog();
        
        // 监听DOM变化，防止AI对话框动态加载
        const observer = new MutationObserver(function(mutations) {
            let shouldRemove = false;
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        const element = node;
                        if (element.matches && (
                            element.matches('.relative.flex.h-full.min-w-0.flex-col.overflow-hidden') ||
                            element.matches('[data-testid*="chat"]') ||
                            element.querySelector('[data-testid*="chat"]') ||
                            element.querySelector('.mx-auto.w-full.max-w-4xl')
                        )) {
                            shouldRemove = true;
                        }
                    }
                });
            });
            
            if (shouldRemove) {
                setTimeout(removeAIDialog, 100);
            }
        });

        // 开始观察
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 页面加载完成后再次执行
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(removeAIDialog, 500);
            });
        } else {
            setTimeout(removeAIDialog, 500);
        }
    }

    // 如果页面已经加载，直接执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 定期检查，确保AI对话框不会重新出现
    setInterval(removeAIDialog, 2000);

    console.log('Folo AI Dialog Remover: Script loaded and running');
})();
