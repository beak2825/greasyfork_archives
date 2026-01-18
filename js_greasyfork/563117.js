// ==UserScript==
// @name         ChatGPT 对话预览与跳转
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在ChatGPT页面添加一个对话预览与跳转功能，支持按钮悬停预览和对话项悬停展开。性能优化版。
// @author       BPsoda
// @match        https://chatgpt.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/563117/ChatGPT%20%E5%AF%B9%E8%AF%9D%E9%A2%84%E8%A7%88%E4%B8%8E%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/563117/ChatGPT%20%E5%AF%B9%E8%AF%9D%E9%A2%84%E8%A7%88%E4%B8%8E%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('%c [TOC] 性能优化版已启动', 'color:#fff; background:#007bff; padding:3px; border-radius:3px;');

    // 配置
    const config = {
        selector: 'article [data-message-author-role="user"]', // 更精确的选择器
        panelId: 'tocContainer',
        previewId: 'previewContainer',
        btnId: 'tocToggleButton',
        debounceDelay: 800, // 防抖延迟（毫秒）
        initDelay: 2000, // 初始化延迟（避开首屏加载高峰）
        checkInterval: 5000 // UI检查间隔（防止被React清除）
    };

    // 状态管理
    let lastUserMessageCount = 0;
    let updateTimeout = null;
    let isUpdating = false;
    let observer = null;

    // 创建样式（包含深色模式支持）
    function injectStyles() {
        if (document.getElementById('toc-styles')) return;

        const style = document.createElement('style');
        style.id = 'toc-styles';
        style.innerHTML = `
            #${config.panelId} {
                position: fixed !important;
                right: 10px;
                top: 60px;
                width: 240px;
                max-height: 70vh;
                overflow-y: auto;
                z-index: 999999;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                border: 1px solid #d1d5db;
                border-radius: 8px;
                padding: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                font-size: 14px;
                color: #111827;
                transition: opacity 0.2s ease;
                display: block;
            }
            #${config.previewId} {
                position: fixed !important;
                right: 50px;
                top: 60px;
                width: 240px;
                max-height: 70vh;
                overflow-y: auto;
                z-index: 1000000;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                border: 1px solid #d1d5db;
                border-radius: 8px;
                padding: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                font-size: 14px;
                color: #111827;
                transition: opacity 0.2s ease;
                display: none;
            }
            #${config.btnId} {
                position: fixed !important;
                right: 10px;
                top: 30px;
                width: 36px;
                height: 36px;
                padding: 0;
                text-align: center;
                cursor: pointer;
                z-index: 1000001;
                background: #f3f4f6;
                border: 1px solid #d1d5db;
                border-radius: 8px;
                color: #374151;
                transition: all 0.2s ease;
                line-height: 36px;
                user-select: none;
                font-size: 18px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            #${config.btnId}:hover {
                background: #e5e7eb;
                border-color: #9ca3af;
            }
            .toc-item {
                margin-bottom: 5px;
            }
            .toc-item-text {
                cursor: pointer;
                padding: 6px 8px;
                border-radius: 6px;
                transition: background-color 0.2s ease, max-height 0.3s ease;
                color: #1f2937;
                background-color: transparent;
                max-height: 2.25em;
                min-height: 2.25em;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                line-height: 1.5em;
            }
            .toc-item-text:hover {
                background-color: #e5e7eb;
            }
            .toc-item-expanded {
                cursor: pointer;
                padding: 6px 8px;
                border-radius: 6px;
                transition: max-height 0.3s ease, opacity 0.2s ease;
                color: #1f2937;
                background-color: #f9fafb;
                max-height: 0;
                overflow: hidden;
                opacity: 0;
                display: none;
                line-height: 1.5em;
                white-space: pre-wrap;
                word-wrap: break-word;
                border: 1px solid #e5e7eb;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            }
            /* 深色模式支持 */
            .dark #${config.panelId},
            .dark #${config.previewId} {
                background: rgba(33, 33, 33, 0.95) !important;
                color: #e5e7eb !important;
                border-color: #444 !important;
            }
            .dark #${config.btnId} {
                background: #212121 !important;
                color: #e5e7eb !important;
                border-color: #444 !important;
            }
            .dark .toc-item-text {
                color: #e5e7eb !important;
            }
            .dark .toc-item-text:hover {
                background-color: rgba(255, 255, 255, 0.1) !important;
            }
            .dark .toc-item-expanded {
                color: #e5e7eb !important;
                background-color: rgba(255, 255, 255, 0.05) !important;
                border-color: #444 !important;
            }
        `;
        document.head.appendChild(style);
    }

    // 创建UI元素
    function injectUI() {
        if (document.getElementById(config.btnId)) return;

        // 创建切换按钮
        const toggleButton = document.createElement('div');
        toggleButton.id = config.btnId;
        toggleButton.innerHTML = '━';
        toggleButton.onclick = function(e) {
            e.stopPropagation();
            const panel = document.getElementById(config.panelId);
            if (panel.style.display === 'block') {
                panel.style.display = 'none';
                toggleButton.innerHTML = '▶';
                document.getElementById(config.previewId).style.display = 'none';
            } else {
                panel.style.display = 'block';
                toggleButton.innerHTML = '━';
            }
        };

        // 按钮悬停效果
        toggleButton.onmouseenter = function() {
            const preview = document.getElementById(config.previewId);
            preview.style.display = 'block';
            syncPreviewContent();
        };

        toggleButton.onmouseleave = function() {
            const preview = document.getElementById(config.previewId);
            // 延迟隐藏，允许鼠标移动到预览窗口
            setTimeout(() => {
                if (!preview.matches(':hover')) {
                    preview.style.display = 'none';
                }
            }, 200);
        };

        // 创建主目录容器
        const tocContainer = document.createElement('div');
        tocContainer.id = config.panelId;
        tocContainer.innerHTML = '<div id="toc-list-inner"></div>';

        // 创建预览窗口
        const previewContainer = document.createElement('div');
        previewContainer.id = config.previewId;
        previewContainer.innerHTML = '<div id="preview-list-inner"></div>';

        // 预览窗口悬停处理
        previewContainer.onmouseenter = function() {
            previewContainer.style.display = 'block';
            syncPreviewContent();
        };

        previewContainer.onmouseleave = function() {
            previewContainer.style.display = 'none';
        };

        document.body.appendChild(toggleButton);
        document.body.appendChild(tocContainer);
        document.body.appendChild(previewContainer);
    }

    // 创建TOC项（带悬停展开功能）
    function createTOCItem(message, index, container) {
        const article = message.closest('article');
        if (!article) return null;

        const textContent = message.innerText?.trim() || message.textContent?.trim() || '......';
        const fullText = textContent;
        const shortText = textContent.length > 9 ? `${textContent.substring(0, 8)}...` : textContent;
        const formattedIndex = ("0" + (index + 1)).slice(-2); // 两位数字编号

        // 创建TOC项容器
        const tocItem = document.createElement('div');
        tocItem.className = 'toc-item';

        // 创建显示文本的元素
        const textDisplay = document.createElement('div');
        textDisplay.className = 'toc-item-text';
        textDisplay.textContent = `${formattedIndex} ${shortText}`;

        // 创建展开文本容器
        const expandedText = document.createElement('div');
        expandedText.className = 'toc-item-expanded';
        expandedText.textContent = `${formattedIndex} ${fullText}`;

        // 点击跳转功能
        const scrollToQuestion = function() {
            article.scrollIntoView({ behavior: 'smooth', block: 'center' });
        };

        textDisplay.onclick = scrollToQuestion;
        expandedText.onclick = scrollToQuestion;

        // 悬停时展开显示更多文本（约10行）
        let hideTimeout = null;

        textDisplay.onmouseenter = function() {
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                hideTimeout = null;
            }
            textDisplay.style.display = 'none';
            expandedText.style.display = 'block';
            requestAnimationFrame(() => {
                expandedText.style.maxHeight = '15em'; // 约10行高度
                expandedText.style.opacity = '1';
                expandedText.style.backgroundColor = '#f3f4f6';
            });
        };

        textDisplay.onmouseleave = function() {
            hideTimeout = setTimeout(() => {
                if (!expandedText.matches(':hover')) {
                    expandedText.style.maxHeight = '0';
                    expandedText.style.opacity = '0';
                    setTimeout(() => {
                        expandedText.style.display = 'none';
                        textDisplay.style.display = 'block';
                    }, 300);
                }
            }, 150);
        };

        expandedText.onmouseenter = function() {
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                hideTimeout = null;
            }
            expandedText.style.backgroundColor = '#f3f4f6';
        };

        expandedText.onmouseleave = function() {
            expandedText.style.maxHeight = '0';
            expandedText.style.opacity = '0';
            setTimeout(() => {
                expandedText.style.display = 'none';
                textDisplay.style.display = 'block';
            }, 300);
        };

        tocItem.appendChild(textDisplay);
        tocItem.appendChild(expandedText);
        container.appendChild(tocItem);

        return tocItem;
    }

    // 更新列表（性能优化版）
    function updateList() {
        if (isUpdating) return;

        const messages = document.querySelectorAll(config.selector);

        // 性能检查：如果数量没变，就不更新 DOM
        if (messages.length === lastUserMessageCount) return;
        lastUserMessageCount = messages.length;

        const listInner = document.getElementById('toc-list-inner');
        if (!listInner) return;

        isUpdating = true;

        // 临时断开 observer 以避免无限循环
        if (observer) {
            observer.disconnect();
        }

        // 使用 DocumentFragment 批量操作 DOM
        const fragment = document.createDocumentFragment();
        messages.forEach((msg, index) => {
            createTOCItem(msg, index, fragment);
        });

        listInner.innerHTML = '';
        listInner.appendChild(fragment);

        // 重新连接 observer
        if (observer) {
            const target = document.querySelector('main') || document.body;
            observer.observe(target, { childList: true, subtree: true });
        }

        isUpdating = false;

        // 如果预览窗口正在显示，同步更新
        if (document.getElementById(config.previewId).style.display === 'block') {
            syncPreviewContent();
        }
    }

    // 同步预览窗口内容
    function syncPreviewContent() {
        if (isUpdating) return;

        const previewInner = document.getElementById('preview-list-inner');
        const tocInner = document.getElementById('toc-list-inner');
        if (!previewInner || !tocInner) return;

        previewInner.innerHTML = tocInner.innerHTML;

        // 为预览窗口中的项目重新绑定事件
        const previewItems = previewInner.querySelectorAll('.toc-item');
        const messages = document.querySelectorAll(config.selector);

        previewItems.forEach((item, index) => {
            if (index >= messages.length) return;

            const textDisplay = item.querySelector('.toc-item-text');
            const expandedText = item.querySelector('.toc-item-expanded');
            if (!textDisplay || !expandedText) return;

            const message = messages[index];
            const article = message.closest('article');
            if (!article) return;

            const scrollToQuestion = function() {
                article.scrollIntoView({ behavior: 'smooth', block: 'center' });
            };

            textDisplay.onclick = scrollToQuestion;
            expandedText.onclick = scrollToQuestion;

            // 重新绑定悬停展开功能
            let hideTimeout = null;

            textDisplay.onmouseenter = function() {
                if (hideTimeout) {
                    clearTimeout(hideTimeout);
                    hideTimeout = null;
                }
                textDisplay.style.display = 'none';
                expandedText.style.display = 'block';
                requestAnimationFrame(() => {
                    expandedText.style.maxHeight = '15em';
                    expandedText.style.opacity = '1';
                    expandedText.style.backgroundColor = '#f3f4f6';
                });
            };

            textDisplay.onmouseleave = function() {
                hideTimeout = setTimeout(() => {
                    if (!expandedText.matches(':hover')) {
                        expandedText.style.maxHeight = '0';
                        expandedText.style.opacity = '0';
                        setTimeout(() => {
                            expandedText.style.display = 'none';
                            textDisplay.style.display = 'block';
                        }, 300);
                    }
                }, 150);
            };

            expandedText.onmouseenter = function() {
                if (hideTimeout) {
                    clearTimeout(hideTimeout);
                    hideTimeout = null;
                }
                expandedText.style.backgroundColor = '#f3f4f6';
            };

            expandedText.onmouseleave = function() {
                expandedText.style.maxHeight = '0';
                expandedText.style.opacity = '0';
                setTimeout(() => {
                    expandedText.style.display = 'none';
                    textDisplay.style.display = 'block';
                }, 300);
            };
        });
    }

    // 防抖处理：避免 ChatGPT 打字时频繁触发
    function debouncedUpdate() {
        clearTimeout(updateTimeout);
        updateTimeout = setTimeout(() => {
            updateList();
        }, config.debounceDelay);
    }

    // 初始化与监听
    function init() {
        injectStyles();
        injectUI();
        updateList();

        // 监听对话区域
        observer = new MutationObserver((mutations) => {
            if (isUpdating) return;

            let shouldUpdate = false;

            mutations.forEach(mutation => {
                // 忽略我们自己创建的元素的变更
                if (mutation.target && (
                    mutation.target.id === config.panelId ||
                    mutation.target.id === config.previewId ||
                    mutation.target.id === config.btnId ||
                    mutation.target.closest(`#${config.panelId}`) ||
                    mutation.target.closest(`#${config.previewId}`)
                )) {
                    return;
                }

                // 只有当增加或删除了节点时才触发
                if (mutation.addedNodes.length || mutation.removedNodes.length) {
                    // 检查是否真的是用户消息节点
                    for (let node of mutation.addedNodes) {
                        if (node.nodeType === 1 && (
                            node.querySelector && node.querySelector(config.selector) ||
                            node.matches && node.matches(config.selector) ||
                            node.getAttribute && node.getAttribute('data-message-author-role') === 'user'
                        )) {
                            shouldUpdate = true;
                            break;
                        }
                    }
                    if (mutation.removedNodes.length) {
                        shouldUpdate = true;
                    }
                }
            });

            if (shouldUpdate) {
                debouncedUpdate();
            }
        });

        // 尝试监听 main 标签，如果没加载好就监听 body
        const target = document.querySelector('main') || document.body;
        observer.observe(target, { childList: true, subtree: true });
    }

    // 启动延迟，避开首屏加载高峰
    setTimeout(init, config.initDelay);

    // 每5秒检查一次 UI 是否还在 (防止被 React 彻底抹除)
    setInterval(() => {
        if (!document.getElementById(config.btnId)) {
            injectUI();
            updateList();
        }
    }, config.checkInterval);
})();