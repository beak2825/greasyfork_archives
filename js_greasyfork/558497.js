// ==UserScript==
// @name         豆包宽屏气泡美化
// @namespace    https://greasyfork.org/zh-CN/users/1310817
// @version      1.3.1
// @description  豆包聊天页面精细化宽屏适配，修复表格/输入框/代码块显示问题，优化视觉体验，支持2K/4K/超宽屏分级适配
// @author       Super_FFF、Doubao AI
// @match        https://www.doubao.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=doubao.com
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/558497/%E8%B1%86%E5%8C%85%E5%AE%BD%E5%B1%8F%E6%B0%94%E6%B3%A1%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/558497/%E8%B1%86%E5%8C%85%E5%AE%BD%E5%B1%8F%E6%B0%94%E6%B3%A1%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ===================== 核心配置项（可根据需求调整） =====================
    const CONFIG = {
        minTotalWidth: 900,         // 小屏最小宽度（避免太窄）
        sidePadding: 80,            // 全局侧边留白（px）
        inputMinHeight: 80,         // 输入框最小高度（px）
        tableCellMinWidth: 80,      // 表格单元格最小宽度（px）
        bubbleColor: 'lightyellow', // 消息气泡底色
        bubbleHoverColor: '#fff9e6',// 气泡hover高亮色
        enableShortcut: true,       // 是否开启宽屏切换快捷键（Ctrl+Shift+W）
        debugMode: false            // 调试模式（显示元素边框，排查问题用）
    };

    // ===================== 工具函数 =====================
    // 分级自适应宽度计算（适配2K/4K/超宽屏）
    const calculateAdaptiveWidth = () => {
        const screenWidth = window.innerWidth - CONFIG.sidePadding;
        let adaptiveContentWidth, adaptiveInputWidth;

        // 分级适配规则
        if (screenWidth >= 2560) { // 2K+/4K屏（超宽屏）
            adaptiveContentWidth = Math.min(screenWidth * 0.8, 2200);
            adaptiveInputWidth = adaptiveContentWidth * 0.75;
        } else if (screenWidth >= 1920) { // 1080P/2K屏
            adaptiveContentWidth = Math.min(screenWidth * 0.85, 1800);
            adaptiveInputWidth = adaptiveContentWidth * 0.8;
        } else { // 笔记本/小屏
            adaptiveContentWidth = Math.max(screenWidth * 0.9, CONFIG.minTotalWidth);
            adaptiveInputWidth = adaptiveContentWidth * 0.85;
        }

        return {
            adaptiveContentWidth: Math.max(adaptiveContentWidth, CONFIG.minTotalWidth),
            adaptiveInputWidth
        };
    };

    // 表格增强：滚动容器+提示+样式优化
    const enhanceTableDisplay = () => {
        document.querySelectorAll('table').forEach(table => {
            // 给表格添加专用滚动容器
            if (!table.parentElement?.classList.contains('table-wrapper')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'table-wrapper';
                wrapper.style.cssText = `
                    width: 100%;
                    overflow-x: auto;
                    margin: 15px 0;
                    border-radius: 8px;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                `;
                table.parentNode.insertBefore(wrapper, table);
                wrapper.appendChild(table);
            }

            // 超宽表格显示滑动提示
            const wrapper = table.parentElement;
            const tableWidth = table.scrollWidth;
            const wrapperWidth = wrapper.clientWidth;
            if (tableWidth > wrapperWidth + 20 && !wrapper.querySelector('.table-scroll-tip')) {
                const tip = document.createElement('div');
                tip.className = 'table-scroll-tip';
                tip.style.cssText = `
                    font-size: 12px;
                    color: #666;
                    padding: 5px 0;
                    text-align: right;
                    user-select: none;
                    transition: opacity 0.5s ease;
                `;
                tip.textContent = '← 表格可左右滑动 →';
                wrapper.insertBefore(tip, table);
                // 3秒后隐藏提示
                setTimeout(() => tip.style.opacity = '0', 3000);
            }
        });
    };

    // 懒加载优化：宽屏下提前加载图片
    const optimizeLazyLoad = () => {
        const chatList = document.querySelector('.chat-message-list');
        if (!chatList) return;

        chatList.addEventListener('scroll', () => {
            const lazyImages = document.querySelectorAll('img[loading="lazy"]');
            lazyImages.forEach(img => {
                const rect = img.getBoundingClientRect();
                // 宽屏下提前200px加载
                if (rect.top < window.innerHeight + 200) {
                    img.loading = 'eager';
                }
            });
        });
    };

    // 宽屏/普通模式切换快捷键（Ctrl+Shift+W）
    const setupShortcut = () => {
        if (!CONFIG.enableShortcut) return;

        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'W') {
                e.preventDefault();
                const isWideMode = document.body.classList.toggle('wide-mode');
                if (isWideMode) {
                    document.body.style.setProperty('--custom-max-width', '98%');
                } else {
                    document.body.style.removeProperty('--custom-max-width');
                }
                injectAdaptiveStyles();
                enhanceTableDisplay();
                // 提示用户
                alert(isWideMode ? '已切换至超宽屏模式' : '已恢复默认宽屏模式');
            }
        });
    };

    // ===================== 样式注入 =====================
    const injectAdaptiveStyles = () => {
        const { adaptiveContentWidth, adaptiveInputWidth } = calculateAdaptiveWidth();
        const style = document.createElement('style');
        style.id = 'doubao-adaptive-style';

        // 调试模式：显示元素边框（方便排查布局问题）
        const debugStyle = CONFIG.debugMode ? `
            * { outline: 1px solid rgba(255,0,0,0.1) !important; }
        ` : '';

        style.textContent = `
            ${debugStyle}

            /* ========== 全局布局分级适配 ========== */
            :root {
                --custom-max-width: unset;
            }
            .wide-mode :root {
                --custom-max-width: 98% !important;
            }
            .chat-container .center-content,
            [class*="chat"][class*="container"],
            .conversation-content,
            .main-content {
                --center-content-max-width: ${adaptiveContentWidth}px !important;
                max-width: var(--custom-max-width, ${adaptiveContentWidth}px) !important;
                width: 98% !important;
                margin: 0 auto !important;
                padding: 0 10px !important;
            }

            /* ========== 侧边栏+主内容区分离适配 ========== */
            .sidebar-container, [class*="sidebar"], [class*="aside"] {
                width: 280px !important;
                flex-shrink: 0 !important;
            }
            .main-chat-area, [class*="main"][class*="chat"] {
                flex: 1 !important;
                padding: 0 20px !important;
            }
            .chat-page-layout, [class*="chat"][class*="layout"] {
                display: flex !important;
                width: 100% !important;
                max-width: unset !important;
            }

            /* ========== 消息列表适配 ========== */
            .chat-message-list,
            [class*="message"][class*="list"],
            .message-content {
                width: 100% !important;
                max-width: var(--custom-max-width, ${adaptiveContentWidth}px) !important;
                overflow: visible !important;
                padding: 20px 0 !important;
            }

            /* ========== 表格深度优化 ========== */
            .table-wrapper {
                width: 100% !important;
                overflow-x: auto !important;
            }
            table {
                width: 100% !important;
                min-width: 100% !important;
                table-layout: auto !important;
                overflow-x: auto !important;
                display: block !important;
                margin: 10px 0 !important;
                border-collapse: collapse !important;
            }
            th, td {
                white-space: normal !important;
                word-wrap: break-word !important;
                word-break: break-all !important;
                min-width: ${CONFIG.tableCellMinWidth}px !important;
                padding: 8px 12px !important;
                border: 1px solid #eee !important;
            }
            /* 暗色模式表格适配 */
            @media (prefers-color-scheme: dark) {
                th, td { border-color: #333 !important; }
            }

            /* ========== 输入框一体化适配 ========== */
            .chat-input-container,
            [class*="input"][class*="box"],
            [class*="send"][class*="box"],
            .editor-container,
            textarea.chat-input {
                width: 100% !important;
                max-width: var(--custom-max-width, ${adaptiveInputWidth}px) !important;
                min-width: 600px !important;
                min-height: ${CONFIG.inputMinHeight}px !important;
                margin: 20px auto !important;
                padding: 12px 16px !important;
                border-radius: 8px !important;
                resize: vertical !important;
                box-sizing: border-box !important;
            }
            .input-with-send-btn {
                display: flex !important;
                align-items: flex-end !important;
                gap: 10px !important;
                max-width: ${adaptiveInputWidth}px !important;
                margin: 0 auto !important;
            }
            .input-with-send-btn textarea.chat-input {
                flex: 1 !important;
                margin: 0 !important;
            }
            .send-btn {
                flex-shrink: 0 !important;
                width: 80px !important;
                height: 40px !important;
                margin-bottom: 8px !important;
            }
            textarea.chat-input {
                font-size: clamp(14px, 1vw, 16px) !important;
                line-height: 1.6 !important;
            }

            /* ========== 代码块/长文本适配 ========== */
            pre, code, [class*="code"][class*="block"] {
                white-space: pre-wrap !important;
                word-break: break-all !important;
                max-width: 100% !important;
                overflow-x: auto !important;
                padding: 12px !important;
                border-radius: 8px !important;
                font-size: clamp(13px, 0.9vw, 15px) !important;
            }
            .message-content p, .message-content div {
                word-break: break-word !important;
                overflow-wrap: break-word !important;
            }

            /* ========== 图片/多媒体适配 ========== */
            .message-content img, [class*="image"][class*="content"] {
                max-width: 100% !important;
                height: auto !important;
                border-radius: 8px !important;
                max-height: 600px !important;
                object-fit: contain !important;
            }
            .message-content video, .message-content audio {
                max-width: 100% !important;
                min-width: 300px !important;
                border-radius: 8px !important;
            }

            /* ========== 消息气泡美化+视觉分级 ========== */
            .message-item {
                margin: 12px 0 !important;
                padding: 0 8px !important;
            }
            .message-item.user-message .message-content {
                background-color: ${CONFIG.bubbleColor} !important;
                border-radius: 12px !important;
                padding: clamp(12px, 1vw, 16px) clamp(16px, 1.2vw, 20px) !important;
                box-shadow: 0 1px 3px rgba(0,0,0,0.05) !important;
                transition: background-color 0.2s ease !important;
            }
            .message-item.user-message .message-content:hover {
                background-color: ${CONFIG.bubbleHoverColor} !important;
            }

            /* ========== 字体/行高宽屏适配 ========== */
            body, .message-content, .chat-input {
                font-size: clamp(14px, 1vw, 16px) !important;
                line-height: 1.6 !important;
            }
            .message-content h1, .message-content h2, .message-content h3 {
                margin: 10px 0 !important;
                line-height: 1.4 !important;
            }

            /* ========== 暗色模式兼容 ========== */
            @media (prefers-color-scheme: dark) {
                .message-item.user-message .message-content {
                    background-color: #2a2a2a !important;
                    color: #e0e0e0 !important;
                }
                .message-item.user-message .message-content:hover {
                    background-color: #333 !important;
                }
                pre, code {
                    background-color: #1e1e1e !important;
                    color: #e0e0e0 !important;
                }
                .table-scroll-tip {
                    color: #aaa !important;
                }
            }

            /* ========== 响应式降级 ========== */
            @media (max-width: 1200px) {
                .chat-input-container {
                    max-width: ${adaptiveInputWidth * 0.9}px !important;
                }
                table {
                    min-width: 95% !important;
                }
            }
            @media (max-width: 768px) {
                .chat-container .center-content {
                    max-width: 98% !important;
                }
                textarea.chat-input {
                    min-width: unset !important;
                }
                .sidebar-container {
                    width: 240px !important;
                }
            }

            /* ========== 兜底样式 ========== */
            [class*="container"][class*="content"] {
                max-width: unset !important;
            }
        `;

        // 移除旧样式，避免重复叠加
        const oldStyle = document.getElementById('doubao-adaptive-style');
        if (oldStyle) oldStyle.remove();
        document.head.appendChild(style);
    };

    // ===================== 事件监听 =====================
    const setupResizeListener = () => {
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                injectAdaptiveStyles();
                enhanceTableDisplay();
            }, 150); // 防抖延迟150ms
        });
    };

    const setupMutationObserver = () => {
        let lastUpdateTime = 0;
        const observer = new MutationObserver((mutations) => {
            const now = Date.now();
            // 1秒内最多更新1次，减少性能消耗
            if (now - lastUpdateTime < 1000) return;

            const hasTargetNodes = mutations.some(m =>
                Array.from(m.addedNodes).some(node =>
                    node.nodeType === 1 && (
                        node.matches('table') || node.matches('img') ||
                        node.matches('.chat-input-container') ||
                        node.matches('[class*="message"][class*="item"]')
                    )
                )
            );

            if (hasTargetNodes) {
                injectAdaptiveStyles();
                enhanceTableDisplay();
                lastUpdateTime = now;
            }
        });

        // 缩小观察范围，提升性能
        observer.observe(document.querySelector('.chat-container') || document.body, {
            childList: true,
            subtree: true,
            attributes: false
        });
    };

    // ===================== 初始化 =====================
    const init = () => {
        const ready = () => {
            // 核心逻辑执行
            injectAdaptiveStyles();
            enhanceTableDisplay();
            optimizeLazyLoad();
            setupShortcut();
            setupResizeListener();
            setupMutationObserver();

            // 定时兜底校准（10秒/次，仅页面可见时执行）
            setInterval(() => {
                if (!document.hidden) {
                    injectAdaptiveStyles();
                    enhanceTableDisplay();
                }
            }, 10000);
        };

        // 兼容不同页面加载状态
        if (document.readyState === 'complete') {
            ready();
        } else if (document.readyState === 'interactive') {
            setTimeout(ready, 500);
        } else {
            document.addEventListener('DOMContentLoaded', ready);
            setTimeout(ready, 3000); // 兜底超时执行
        }
    };

    // 启动脚本
    init();
})();
