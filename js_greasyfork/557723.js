// ==UserScript==
// @name         DeepSeek对话导航
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  为 DeepSeek 网页版添加侧边栏导航，支持点击跳转、平滑滚动、自动高亮当前问题。
// @author       Cosmo
// @match        https://chat.deepseek.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deepseek.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557723/DeepSeek%E5%AF%B9%E8%AF%9D%E5%AF%BC%E8%88%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/557723/DeepSeek%E5%AF%B9%E8%AF%9D%E5%AF%BC%E8%88%AA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置项：去抖动延迟（毫秒），避免频繁 DOM 操作导致卡顿
    const DEBOUNCE_DELAY = 800;

    // 全局状态记录
    let lastQuestionCount = 0;
    let observerTimeout = null;

    /**
     * 创建侧边栏容器及样式
     */
    function createTOCSidebar() {
        // 防止重复创建
        if (document.getElementById('ds-toc-sidebar')) return;

        const sidebar = document.createElement('div');
        sidebar.id = 'ds-toc-sidebar';

        sidebar.innerHTML = `
            <div class="ds-toc-header" id="ds-toc-header">
                <span class="ds-toc-title">对话导航</span>
                <span class="ds-toc-toggle" title="折叠/展开">−</span>
            </div>
            <div class="ds-toc-content" id="ds-toc-content">
                <div class="ds-toc-empty">正在加载对话...</div>
            </div>
        `;

        // 注入 CSS 样式 (清爽白色主题)
        const style = document.createElement('style');
        style.textContent = `
            /* 主容器 */
            #ds-toc-sidebar {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 180px;
                background: #ffffff;
                border-radius: 10px;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
                z-index: 9999;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                display: flex;
                flex-direction: column;
                max-height: 80vh;
                transition: all 0.3s ease;
                border: 1px solid #f0f0f0;
            }

            /* 折叠状态 */
            #ds-toc-sidebar.ds-collapsed {
                width: 46px;
                height: 46px;
                overflow: hidden;
                border-radius: 23px;
                opacity: 0.8;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }

            #ds-toc-sidebar.ds-collapsed .ds-toc-content,
            #ds-toc-sidebar.ds-collapsed .ds-toc-title {
                display: none;
            }

            #ds-toc-sidebar.ds-collapsed .ds-toc-header {
                padding: 0;
                justify-content: center;
                height: 100%;
                background: #ffffff;
            }

            #ds-toc-sidebar.ds-collapsed .ds-toc-toggle {
                font-size: 20px;
                color: #4d8aff;
            }

            /* 头部区域 */
            .ds-toc-header {
                background: #fcfcfc;
                padding: 12px 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: pointer;
                border-bottom: 1px solid #f0f0f0;
                border-radius: 10px 10px 0 0;
                user-select: none;
                flex-shrink: 0;
            }
            .ds-toc-header:hover {
                background: #f5f7fa;
            }

            .ds-toc-title {
                font-weight: 600;
                font-size: 14px;
                color: #333;
            }

            .ds-toc-toggle {
                font-size: 18px;
                color: #999;
                line-height: 1;
            }

            /* 内容列表区域 */
            .ds-toc-content {
                overflow-y: auto;
                padding: 8px 0;
                flex-grow: 1;
                /* 滚动条样式适配 */
                scrollbar-width: thin;
                scrollbar-color: #d1d5db #ffffff;
            }

            .ds-toc-content::-webkit-scrollbar { width: 4px; }
            .ds-toc-content::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 2px; }
            .ds-toc-content::-webkit-scrollbar-track { background: transparent; }

            /* 单个条目 */
            .ds-toc-item {
                padding: 8px 16px;
                font-size: 13px;
                color: #555;
                cursor: pointer;
                border-left: 3px solid transparent;
                transition: background 0.2s, color 0.2s;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                line-height: 1.5;
            }

            .ds-toc-item:hover {
                background: #f5f7fa;
                color: #000;
            }

            /* 激活状态 */
            .ds-toc-item.ds-active {
                background: #eef4ff;
                color: #4d8aff;
                border-left-color: #4d8aff;
                font-weight: 500;
            }

            /* 空状态提示 */
            .ds-toc-empty {
                padding: 20px;
                text-align: center;
                color: #9ca3af;
                font-size: 12px;
            }

            /* 目标内容高亮动画 */
            .ds-highlight-anim {
                animation: ds-pulse 2s ease;
            }

            @keyframes ds-pulse {
                0% { background-color: rgba(77, 138, 255, 0.2); }
                100% { background-color: transparent; }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(sidebar);

        // 绑定折叠/展开事件
        document.getElementById('ds-toc-header').addEventListener('click', toggleSidebar);
    }

    /**
     * 切换侧边栏状态
     */
    function toggleSidebar() {
        const sidebar = document.getElementById('ds-toc-sidebar');
        const btn = sidebar.querySelector('.ds-toc-toggle');

        sidebar.classList.toggle('ds-collapsed');

        if (sidebar.classList.contains('ds-collapsed')) {
            btn.textContent = '+';
        } else {
            btn.textContent = '−';
        }
    }

    /**
     * 核心逻辑：解析 DOM 生成目录
     * 采用“回答倒推问题”的策略，适配 DeepSeek 的 DOM 结构
     */
    function generateTOC() {
        // 1. 查找所有包含 markdown 的回答块
        const markdownMessages = document.querySelectorAll('.ds-message:has(> .ds-markdown)');

        // 2. 简单缓存策略：如果回答数量未变且已渲染，则跳过
        if (markdownMessages.length === lastQuestionCount && markdownMessages.length > 0) {
            return;
        }

        const validPairs = [];

        // 3. 遍历回答，查找其对应的问题 DOM
        markdownMessages.forEach(answerMsg => {
            const parentDiv = answerMsg.parentElement;
            // 每一个回答块的父级的上一个兄弟节点，通常包含问题
            const prevSibling = parentDiv ? parentDiv.previousElementSibling : null;

            if (prevSibling) {
                const questionMsg = prevSibling.querySelector('.ds-message');
                if (questionMsg) {
                    validPairs.push({
                        dom: questionMsg, // 问题的 DOM 元素
                        text: questionMsg.textContent.trim() // 问题的文本内容
                    });
                }
            }
        });

        const tocContent = document.getElementById('ds-toc-content');
        if (!tocContent) return;

        // 处理无数据情况
        if (validPairs.length === 0) {
            tocContent.innerHTML = '<div class="ds-toc-empty">暂无问题</div>';
            return;
        }

        // 更新缓存计数
        lastQuestionCount = markdownMessages.length;

        // 4. 构建 HTML 字符串 (使用数组 join 比频繁操作 innerHTML 更快)
        const htmlParts = validPairs.map((pair, index) => {
            // 转义 HTML 字符防止 XSS
            const safeText = pair.text
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");

            return `<div class="ds-toc-item" data-index="${index}" title="${safeText}">${safeText}</div>`;
        });

        tocContent.innerHTML = htmlParts.join('');

        // 5. 绑定点击事件 (事件委托模式可进一步优化，但此处保持简单直接)
        const items = tocContent.querySelectorAll('.ds-toc-item');
        items.forEach(item => {
            item.addEventListener('click', function(e) {
                e.stopPropagation();

                // UI 状态更新
                items.forEach(i => i.classList.remove('ds-active'));
                this.classList.add('ds-active');

                // 页面滚动
                const idx = parseInt(this.getAttribute('data-index'));
                const targetEl = validPairs[idx].dom;

                if (targetEl) {
                    // 移除旧高亮
                    document.querySelectorAll('.ds-highlight-anim').forEach(el => el.classList.remove('ds-highlight-anim'));

                    // 添加新高亮与滚动
                    targetEl.classList.add('ds-highlight-anim');
                    targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
        });
    }

    /**
     * 监听 DOM 变化，自动更新目录
     */
    function setupObserver() {
        const observer = new MutationObserver((mutations) => {
            if (observerTimeout) clearTimeout(observerTimeout);

            // 性能优化：仅当有节点增加时才触发更新
            let shouldUpdate = false;
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    shouldUpdate = true;
                    break;
                }
            }

            if (shouldUpdate) {
                // 防抖延迟，给页面渲染留出时间
                observerTimeout = setTimeout(generateTOC, DEBOUNCE_DELAY);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * 初始化入口
     */
    function init() {
        createTOCSidebar();
        // 延迟首次生成，确保页面基础元素已就绪
        setTimeout(generateTOC, 1000);
        setupObserver();
    }

    // 启动脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();