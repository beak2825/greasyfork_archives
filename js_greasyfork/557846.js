// ==UserScript==
// @name         豆包特定消息隐藏器
// @namespace    https://greasyfork.org/zh-CN/scripts/557846
// @version      6.0
// @description  自动隐藏豆包聊天中的特定消息，不影响其他内容
// @icon              data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZUAAAGQCAYAAABmlv2IAAAACXBIWXMAAC4jAAAuIwF4pT92AAAHvmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTA1LTE5VDE2OjUyOjA3KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0xMi0wMVQyMjoyMzowNSswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0xMi0wMVQyMjoyMzowNSswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4NDlhZWM5Zi0yZTljLWZkNDMtOGEwMS05NzAxYTM1ZjIxNWIiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo2ZGM4ODUyNy1mOTQ4LWUwNDEtYmM3Mi1lZGQzYWU2YTEzMzYiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDozYjM1YmFiMy01Yjc5LWU0NGItODg5Ny0yNjcwMzgxZTIyNjQiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDozYjM1YmFiMy01Yjc5LWU0NGItODg5Ny0yNjcwMzgxZTIyNjQiIHN0RXZ0OndoZW49IjIwMjAtMTItMDFUMjI6MjM6MDUrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNvbnZlcnRlZCIgc3RFdnQ6cGFyYW1ldGVycz0iZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iZGVyaXZlZCIgc3RFdnQ6cGFyYW1ldGVycz0iY29udmVydGVkIGZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjg0OWFlYzlmLTJlOWMtZmQ0My04YTAxLTk3MDFhMzVmMjE1YiIgc3RFdnQ6d2hlbj0iMjAyMC0xMi0wMVQyMjoyMzowNSswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9Inht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
// @author       YaHee,
// @match        *://*.doubao.com/*
// @match        *://*.volces.com/*
// @match        *://*.byteintl.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=doubao.com
// @grant        none
// @license      GPL License
// @downloadURL https://update.greasyfork.org/scripts/557846/%E8%B1%86%E5%8C%85%E7%89%B9%E5%AE%9A%E6%B6%88%E6%81%AF%E9%9A%90%E8%97%8F%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/557846/%E8%B1%86%E5%8C%85%E7%89%B9%E5%AE%9A%E6%B6%88%E6%81%AF%E9%9A%90%E8%97%8F%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('豆包特定消息隐藏器启动 - 自动模式');

    // 要隐藏的特定消息内容（完整或部分）
    const TARGET_MESSAGES = [
        // 证件照相关
        '证件照',
    ];

    // 创建MutationObserver来监听DOM变化
    let observer;

    // 主隐藏函数
    function hideSpecificMessages() {
        // 只查找非常特定的元素
        const messageElements = document.querySelectorAll(`
            [data-testid="message_text_content"],
            .paragraph-pP9ZLC.paragraph-element,
            .flow-markdown-body,
            .container-QQkdo4,
            .container-P2rR72
        `);

        let hiddenCount = 0;

        messageElements.forEach(element => {
            // 跳过已处理过的元素
            if (element.getAttribute('data-zh-hidden') === 'true') {
                return;
            }

            if (element && element.textContent) {
                const text = element.textContent.trim();

                // 检查是否包含目标消息
                let shouldHide = false;
                for (const target of TARGET_MESSAGES) {
                    if (text.includes(target)) {
                        shouldHide = true;
                        console.log('找到目标消息:', text.substring(0, 50));
                        break;
                    }
                }

                // 额外检查：如果文本包含特定模式
                if (!shouldHide && text.length > 20) {
                    if (text.includes('面部特征') && text.includes('证件照')) {
                        shouldHide = true;
                    }
                }

                if (shouldHide) {
                    // 使用最保守的隐藏方式
                    element.style.display = 'none';

                    // 标记已处理，避免重复
                    element.setAttribute('data-zh-hidden', 'true');
                    hiddenCount++;
                }
            }
        });

        if (hiddenCount > 0) {
            console.log(`已隐藏 ${hiddenCount} 条消息`);
        }
    }

    // 启动DOM变化监听
    function startObserver() {
        // 如果已有观察者，先断开
        if (observer) {
            observer.disconnect();
        }

        // 配置观察选项
        const config = {
            childList: true,      // 监听子节点变化
            subtree: true,        // 监听所有后代节点
            characterData: false  // 不监听文本变化
        };

        // 创建观察者
        observer = new MutationObserver(function(mutations) {
            // 检查是否有新节点添加
            let hasNewNodes = false;

            for (const mutation of mutations) {
                if (mutation.addedNodes.length > 0) {
                    hasNewNodes = true;
                    break;
                }
            }

            // 如果有新节点，执行隐藏函数
            if (hasNewNodes) {
                // 延迟一点时间，确保新消息完全加载
                setTimeout(hideSpecificMessages, 300);
            }
        });

        // 开始观察整个文档
        observer.observe(document.body, config);

        console.log('DOM变化监听已启动');
    }

    // 停止DOM变化监听
    function stopObserver() {
        if (observer) {
            observer.disconnect();
            observer = null;
            console.log('DOM变化监听已停止');
        }
    }

    // 初始化函数
    function init() {
        console.log('初始化特定消息隐藏器 - 自动模式');

        // 延迟执行，确保页面加载
        setTimeout(() => {
            // 第一次执行
            hideSpecificMessages();

            // 启动DOM变化监听
            startObserver();

            // 添加手动按钮
            addManualButton();

            console.log('脚本初始化完成 - 自动模式已启用');
        }, 3000);
    }

    // 添加手动按钮（保留以便调试）
    function addManualButton() {
        // 检查是否已存在按钮
        if (document.getElementById('zh-hide-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'zh-hide-btn';
        btn.innerHTML = '🚫';
        btn.title = '隐藏特定消息 (点击手动触发)';
        btn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 99999;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #666;
            color: white;
            border: 2px solid #444;
            cursor: pointer;
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0.7;
            transition: all 0.3s;
        `;

        btn.addEventListener('mouseenter', () => {
            btn.style.opacity = '1';
            btn.style.transform = 'scale(1.1)';
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.opacity = '0.7';
            btn.style.transform = 'scale(1)';
        });

        btn.addEventListener('click', () => {
            hideSpecificMessages();
            btn.style.background = '#4CAF50';
            setTimeout(() => {
                btn.style.background = '#666';
            }, 1000);
        });

        // 右键点击按钮可以切换自动模式
        btn.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (observer) {
                stopObserver();
                btn.title = '隐藏特定消息 (自动模式已关闭)';
                btn.style.background = '#FF5722';
            } else {
                startObserver();
                btn.title = '隐藏特定消息 (自动模式已开启)';
                btn.style.background = '#4CAF50';
            }
            setTimeout(() => {
                btn.style.background = '#666';
            }, 1000);
        });

        document.body.appendChild(btn);
        console.log('手动按钮已添加');
    }

    // 页面加载后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 1000);
    }

    // 页面切换时重新初始化
    window.addEventListener('popstate', () => {
        setTimeout(init, 1000);
    });

    // 监听SPA页面变化（针对单页应用）
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(init, 1000);
        }
    }).observe(document, {subtree: true, childList: true});

})();