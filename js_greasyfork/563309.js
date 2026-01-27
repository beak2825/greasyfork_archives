// ==UserScript==
// @name         Gemini Chat Navigator - 聊天快速跳转
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  为 Gemini AI 聊天添加快速导航面板，点击跳转到历史问题
// @author       柒刻
// @icon         https://www.google.com/s2/favicons?domain=gemini.google.com
// @match        https://gemini.google.com/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/563309/Gemini%20Chat%20Navigator%20-%20%E8%81%8A%E5%A4%A9%E5%BF%AB%E9%80%9F%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/563309/Gemini%20Chat%20Navigator%20-%20%E8%81%8A%E5%A4%A9%E5%BF%AB%E9%80%9F%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==================== 配置项 ====================
    const CONFIG = {
        HIGHLIGHT_DURATION: 2000,
        PREVIEW_LENGTH: 20
    };

    // ==================== 样式注入 ====================
    GM_addStyle(`
        /* 主面板 - 留出顶部空间 */
        #chat-navigator-panel {
            position: fixed;
            top: 70px;
            right: 0;
            bottom: 20px;
            z-index: 9999;
            font-family: 'Google Sans', 'Roboto', sans-serif;
            display: flex;
            align-items: stretch;
            pointer-events: none;
        }

        /* 只有展开时才启用 pointer-events */
        #chat-navigator-panel.expanded {
            pointer-events: auto;
        }

        /* 触发条 - 只覆盖小蓝条区域 */
        .nav-trigger {
            position: absolute;
            right: 2px;
            top: 50%;
            transform: translateY(-50%);
            width: 10px;
            height: 60px;
            pointer-events: auto;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10;
            border-radius: 4px;
        }

        /* 触发条的可视提示 - 浅蓝色 */
        .nav-trigger::after {
            content: '';
            width: 4px;
            height: 50px;
            background: rgba(66, 133, 244, 0.5);
            border-radius: 3px;
            transition: all 0.2s;
        }

        .nav-trigger:hover::after {
            background: rgba(66, 133, 244, 0.8);
            height: 56px;
            width: 5px;
        }

        #chat-navigator-panel.expanded .nav-trigger {
            pointer-events: none;
        }

        #chat-navigator-panel.expanded .nav-trigger::after {
            opacity: 0;
        }

        /* 内容容器 - 默认只显示短线 */
        .nav-inner {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            justify-content: flex-start;
            gap: 4px;
            padding: 12px 10px;
            height: 100%;
            overflow: hidden;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-sizing: border-box;
            pointer-events: none;
        }

        /* 展开时内容可交互 */
        #chat-navigator-panel.expanded .nav-inner {
            pointer-events: auto;
        }

        /* 列表容器 - 可滚动 */
        #nav-list {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 4px;
            flex: 1;
            overflow-y: auto;
            overflow-x: hidden;
            width: 100%;
        }

        #nav-list::-webkit-scrollbar {
            width: 3px;
        }
        #nav-list::-webkit-scrollbar-track {
            background: transparent;
        }
        #nav-list::-webkit-scrollbar-thumb {
            background: rgba(0,0,0,0.15);
            border-radius: 2px;
        }

        @media (prefers-color-scheme: dark) {
            #nav-list::-webkit-scrollbar-thumb {
                background: rgba(255,255,255,0.2);
            }
        }
        #chat-navigator-panel.dark-mode #nav-list::-webkit-scrollbar-thumb {
            background: rgba(255,255,255,0.2);
        }

        /* 展开状态 - 亮色 */
        #chat-navigator-panel.expanded .nav-inner {
            background: #e9eef6;
            box-shadow: -4px 0 20px rgba(0,0,0,0.1);
            padding: 12px 16px;
            gap: 2px;
            min-width: 280px;
        }

        /* 滚动条样式 */
        .nav-inner::-webkit-scrollbar {
            width: 3px;
        }
        .nav-inner::-webkit-scrollbar-track {
            background: transparent;
        }
        .nav-inner::-webkit-scrollbar-thumb {
            background: rgba(0,0,0,0.15);
            border-radius: 2px;
        }

        /* 条目容器 */
        .nav-item {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 12px;
            cursor: pointer;
            transition: all 0.2s;
            white-space: nowrap;
            padding: 10px 12px;
            border-radius: 24px;
            margin: 0 -8px;
        }

        /* 展开时悬浮条目背景 */
        #chat-navigator-panel.expanded .nav-item:hover {
            background: rgba(11, 87, 207, 0.08);
        }

        /* 条目文本 - 默认隐藏 */
        .nav-item-text {
            font-size: 14px;
            color: #1f1f1f;
            opacity: 0;
            max-width: 0;
            overflow: hidden;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-weight: 400;
        }

        /* 展开时显示文本 */
        #chat-navigator-panel.expanded .nav-item-text {
            opacity: 1;
            max-width: 240px;
        }

        /* 展开时悬浮的条目高亮 */
        #chat-navigator-panel.expanded .nav-item:hover .nav-item-text {
            color: #0b57cf;
        }

        /* 短线指示器 - 默认隐藏，展开后显示 */
        .nav-item-line {
            width: 14px;
            height: 2px;
            background: #c4c7c5;
            border-radius: 1px;
            transition: all 0.2s;
            flex-shrink: 0;
            opacity: 0;
        }

        #chat-navigator-panel.expanded .nav-item-line {
            opacity: 1;
        }

        /* ============ 暗色模式适配 ============ */
        /* 系统暗色 */
        @media (prefers-color-scheme: dark) {
            #chat-navigator-panel.expanded .nav-inner {
                background: #1e1f20;
                box-shadow: -4px 0 20px rgba(0,0,0,0.5);
                min-width: 280px;
            }
            .nav-inner::-webkit-scrollbar-thumb {
                background: rgba(255,255,255,0.2);
            }
            .nav-item-text {
                color: #e3e3e3;
            }
            #chat-navigator-panel.expanded .nav-item:hover {
                background: rgba(138, 180, 248, 0.12);
            }
            #chat-navigator-panel.expanded .nav-item:hover .nav-item-text {
                color: #a8c7fa;
            }
            .nav-item-line {
                background: #5f6368;
            }
            .nav-item:hover .nav-item-line {
                background: #8ab4f8;
            }
            .nav-trigger::after {
                background: rgba(138, 180, 248, 0.5);
            }
            .nav-trigger:hover::after {
                background: rgba(138, 180, 248, 0.8);
            }
        }

        /* Gemini 暗色主题 */
        html[dark] #chat-navigator-panel.expanded .nav-inner,
        html.dark-theme #chat-navigator-panel.expanded .nav-inner,
        body.dark-theme #chat-navigator-panel.expanded .nav-inner,
        [data-theme="dark"] #chat-navigator-panel.expanded .nav-inner,
        [data-color-mode="dark"] #chat-navigator-panel.expanded .nav-inner {
            background: #1e1f20;
            box-shadow: -4px 0 20px rgba(0,0,0,0.5);
            min-width: 280px;
        }
        html[dark] .nav-item-text,
        html.dark-theme .nav-item-text,
        body.dark-theme .nav-item-text,
        [data-theme="dark"] .nav-item-text {
            color: #e3e3e3;
        }
        html[dark] #chat-navigator-panel.expanded .nav-item:hover,
        html.dark-theme #chat-navigator-panel.expanded .nav-item:hover,
        body.dark-theme #chat-navigator-panel.expanded .nav-item:hover,
        [data-theme="dark"] #chat-navigator-panel.expanded .nav-item:hover {
            background: rgba(138, 180, 248, 0.12);
        }
        html[dark] #chat-navigator-panel.expanded .nav-item:hover .nav-item-text,
        html.dark-theme #chat-navigator-panel.expanded .nav-item:hover .nav-item-text,
        body.dark-theme #chat-navigator-panel.expanded .nav-item:hover .nav-item-text,
        [data-theme="dark"] #chat-navigator-panel.expanded .nav-item:hover .nav-item-text {
            color: #a8c7fa;
        }
        html[dark] .nav-item-line,
        html.dark-theme .nav-item-line,
        body.dark-theme .nav-item-line,
        [data-theme="dark"] .nav-item-line {
            background: #5f6368;
        }
        html[dark] .nav-item:hover .nav-item-line,
        html.dark-theme .nav-item:hover .nav-item-line,
        body.dark-theme .nav-item:hover .nav-item-line,
        [data-theme="dark"] .nav-item:hover .nav-item-line {
            background: #8ab4f8;
        }
        html[dark] .nav-trigger::after,
        html.dark-theme .nav-trigger::after,
        body.dark-theme .nav-trigger::after,
        [data-theme="dark"] .nav-trigger::after {
            background: rgba(138, 180, 248, 0.5);
        }
        html[dark] .nav-trigger:hover::after,
        html.dark-theme .nav-trigger:hover::after,
        body.dark-theme .nav-trigger:hover::after,
        [data-theme="dark"] .nav-trigger:hover::after {
            background: rgba(138, 180, 248, 0.8);
        }

        /* JS 检测的暗色模式 */
        #chat-navigator-panel.dark-mode .nav-inner {
            background: transparent;
        }
        #chat-navigator-panel.dark-mode.expanded .nav-inner {
            background: #1e1f20;
            box-shadow: -4px 0 20px rgba(0,0,0,0.5);
            min-width: 280px;
        }
        #chat-navigator-panel.dark-mode .nav-item-text {
            color: #e3e3e3;
        }
        #chat-navigator-panel.dark-mode.expanded .nav-item:hover {
            background: rgba(138, 180, 248, 0.12);
        }
        #chat-navigator-panel.dark-mode.expanded .nav-item:hover .nav-item-text {
            color: #a8c7fa;
        }
        #chat-navigator-panel.dark-mode .nav-item-line {
            background: #5f6368;
        }
        #chat-navigator-panel.dark-mode .nav-item:hover .nav-item-line {
            background: #8ab4f8;
        }
        #chat-navigator-panel.dark-mode .nav-count {
            color: #9aa0a6;
        }
        #chat-navigator-panel.dark-mode .nav-trigger::after {
            background: rgba(138, 180, 248, 0.5);
        }
        #chat-navigator-panel.dark-mode .nav-trigger:hover::after {
            background: rgba(138, 180, 248, 0.8);
        }

        /* 悬浮条目时短线变色 */
        .nav-item:hover .nav-item-line {
            background: #1a73e8;
            width: 18px;
        }

        /* 搜索框容器 - 默认隐藏 */
        .nav-search-box {
            display: none;
            margin-bottom: 8px;
            opacity: 0;
            transition: opacity 0.3s;
            width: 100%;
            flex-shrink: 0;
        }

        #chat-navigator-panel.expanded .nav-search-box {
            display: flex;
            justify-content: center;
            opacity: 1;
        }

        .nav-search-input {
            width: 100%;
            max-width: 220px;
            padding: 8px 12px;
            border: 1px solid #dadce0;
            text-align: left;
            border-radius: 18px;
            font-size: 13px;
            outline: none;
            background: #fff;
            color: #1f1f1f;
            box-sizing: border-box;
            transition: border-color 0.2s, box-shadow 0.2s;
        }

        .nav-search-input:focus {
            border-color: #1a73e8;
            box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.2);
        }

        .nav-search-input::placeholder {
            color: #9aa0a6;
        }

        /* 暗色模式搜索框 */
        #chat-navigator-panel.dark-mode .nav-search-input {
            background: #292a2d;
            border-color: #5f6368;
            color: #e3e3e3;
        }

        #chat-navigator-panel.dark-mode .nav-search-input:focus {
            border-color: #8ab4f8;
            box-shadow: 0 0 0 2px rgba(138, 180, 248, 0.2);
        }

        /* 搜索高亮 */
        .nav-item-text mark {
            background: #fff3cd;
            color: inherit;
            padding: 0 2px;
            border-radius: 2px;
        }

        #chat-navigator-panel.dark-mode .nav-item-text mark {
            background: rgba(255, 243, 205, 0.3);
        }

        /* 无结果提示 */
        .nav-no-result {
            font-size: 12px;
            color: #9aa0a6;
            text-align: right;
            padding: 16px 0;
            opacity: 0;
            transition: opacity 0.3s;
        }

        #chat-navigator-panel.expanded .nav-no-result {
            opacity: 1;
        }

        /* 计数 - 默认隐藏 */
        .nav-count {
            font-size: 11px;
            color: var(--gem-sys-color--on-surface-variant, #5f6368);
            opacity: 0;
            transition: opacity 0.3s;
            margin-top: 4px;
            text-align: right;
        }

        #chat-navigator-panel.expanded .nav-count {
            opacity: 1;
        }

        @media (prefers-color-scheme: dark) {
            .nav-count {
                color: #9aa0a6;
            }
        }

        /* 高亮效果 */
        @keyframes nav-highlight {
            0%, 100% { box-shadow: 0 0 0 0 rgba(26, 115, 232, 0); }
            50% { box-shadow: 0 0 0 6px rgba(26, 115, 232, 0.25); }
        }

        .message-highlight {
            animation: nav-highlight 1.5s ease-out;
            outline: 2px solid #1a73e8 !important;
            outline-offset: 4px;
            border-radius: 12px;
        }

        /* 空状态 */
        .nav-empty {
            font-size: 11px;
            color: var(--gem-sys-color--on-surface-variant, #5f6368);
            opacity: 0;
            transition: opacity 0.3s;
            text-align: right;
        }

        #chat-navigator-panel.expanded .nav-empty {
            opacity: 1;
        }
    `);

    // ==================== 核心类 ====================
    class ChatNavigator {
        constructor() {
            this.messages = [];
            this.observer = null;
            this.panel = null;
            this.isScanning = false;
            this.init();
        }

        init() {
            this.createPanel();
            this.setupThemeDetection();
            this.fullScan();
            this.setupObserver();
            this.bindEvents();
            console.log('Gemini Chat Navigator 已加载');
        }

        // 检测并应用主题
        setupThemeDetection() {
            const applyTheme = () => {
                const isDark = this.isDarkMode();
                this.panel.classList.toggle('dark-mode', isDark);
            };

            // 初始检测
            applyTheme();

            // 监听主题变化
            const observer = new MutationObserver(applyTheme);
            observer.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ['class', 'data-theme', 'dark', 'data-color-mode']
            });
            observer.observe(document.body, {
                attributes: true,
                attributeFilter: ['class', 'data-theme']
            });

            // 监听系统主题变化
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);
        }

        // 判断是否暗色模式
        isDarkMode() {
            const html = document.documentElement;
            const body = document.body;

            // 检查各种暗色模式标记
            if (html.hasAttribute('dark') || html.classList.contains('dark-theme') ||
                html.classList.contains('dark') || html.dataset.theme === 'dark' ||
                html.dataset.colorMode === 'dark') {
                return true;
            }
            if (body.classList.contains('dark-theme') || body.classList.contains('dark') ||
                body.dataset.theme === 'dark') {
                return true;
            }

            // 检查系统主题
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return true;
            }

            // 检查背景颜色
            const bgColor = getComputedStyle(body).backgroundColor;
            if (bgColor) {
                const rgb = bgColor.match(/\d+/g);
                if (rgb && rgb.length >= 3) {
                    const brightness = (parseInt(rgb[0]) + parseInt(rgb[1]) + parseInt(rgb[2])) / 3;
                    if (brightness < 50) return true;
                }
            }

            return false;
        }

        // 创建面板
        createPanel() {
            const panel = document.createElement('div');
            panel.id = 'chat-navigator-panel';

            // 触发条 - 用于展开面板
            const trigger = document.createElement('div');
            trigger.className = 'nav-trigger';
            trigger.id = 'nav-trigger';

            const inner = document.createElement('div');
            inner.className = 'nav-inner';
            inner.id = 'nav-inner';

            // 搜索框
            const searchBox = document.createElement('div');
            searchBox.className = 'nav-search-box';
            searchBox.id = 'nav-search-box';

            const searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.className = 'nav-search-input';
            searchInput.id = 'nav-search-input';
            searchInput.placeholder = '搜索问题...';

            searchBox.appendChild(searchInput);
            inner.appendChild(searchBox);

            // 内容容器
            const listContainer = document.createElement('div');
            listContainer.id = 'nav-list';
            inner.appendChild(listContainer);

            panel.appendChild(trigger);
            panel.appendChild(inner);
            document.body.appendChild(panel);
            this.panel = panel;
            this.trigger = trigger;
            this.inner = inner;
            this.listContainer = listContainer;
            this.searchInput = searchInput;
            this.searchBox = searchBox;
            this.searchQuery = '';
            this.isExpanded = false;
            this.expandTimeout = null;
            this.collapseTimeout = null;

            // 绑定搜索事件
            this.bindSearchEvents();
            // 绑定展开/收起事件
            this.bindExpandEvents();
        }

        // 绑定展开/收起事件
        bindExpandEvents() {
            // 鼠标进入触发条 - 延迟展开
            this.trigger.addEventListener('mouseenter', () => {
                clearTimeout(this.collapseTimeout);
                this.expandTimeout = setTimeout(() => {
                    this.expand();
                }, 200); // 200ms 延迟展开
            });

            // 鼠标离开触发条
            this.trigger.addEventListener('mouseleave', () => {
                clearTimeout(this.expandTimeout);
                // 如果已展开，检查是否进入了面板内容区
                if (this.isExpanded) {
                    this.collapseTimeout = setTimeout(() => {
                        this.collapse();
                    }, 300);
                }
            });

            // 鼠标进入面板内容区 - 保持展开
            this.inner.addEventListener('mouseenter', () => {
                clearTimeout(this.collapseTimeout);
            });

            // 鼠标离开面板内容区 - 延迟收起
            this.inner.addEventListener('mouseleave', () => {
                clearTimeout(this.expandTimeout);
                this.collapseTimeout = setTimeout(() => {
                    this.collapse();
                }, 300); // 300ms 延迟收起
            });

            // 点击触发条 - 切换展开状态
            this.trigger.addEventListener('click', () => {
                clearTimeout(this.expandTimeout);
                clearTimeout(this.collapseTimeout);
                if (this.isExpanded) {
                    this.collapse();
                } else {
                    this.expand();
                }
            });
        }

        // 展开面板
        expand() {
            this.isExpanded = true;
            this.panel.classList.add('expanded');
        }

        // 收起面板
        collapse() {
            // 如果搜索框有焦点，不收起
            if (document.activeElement === this.searchInput) {
                return;
            }
            this.isExpanded = false;
            this.panel.classList.remove('expanded');
            // 清除搜索
            if (this.searchQuery) {
                this.searchQuery = '';
                this.searchInput.value = '';
                this.renderList();
            }
        }

        // 绑定搜索事件
        bindSearchEvents() {
            let debounceTimer;
            this.searchInput.addEventListener('input', (e) => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    this.searchQuery = e.target.value.trim().toLowerCase();
                    this.renderList();
                }, 200);
            });

            // 阻止事件冒泡
            this.searchInput.addEventListener('click', (e) => {
                e.stopPropagation();
            });

            // 搜索框失去焦点时，延迟检查是否需要收起面板
            this.searchInput.addEventListener('blur', () => {
                this.collapseTimeout = setTimeout(() => {
                    // 如果鼠标不在面板上，收起面板
                    if (!this.panel.matches(':hover')) {
                        this.collapse();
                    }
                }, 300);
            });
        }

        // 完整扫描
        async fullScan() {
            if (this.isScanning) return;
            this.isScanning = true;

            const scrollContainer = document.querySelector('main') ||
                document.querySelector('[class*="scroll"]') ||
                document.documentElement;

            const originalScrollTop = scrollContainer.scrollTop;

            scrollContainer.scrollTop = 0;
            await this.wait(300);
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
            await this.wait(500);
            scrollContainer.scrollTop = originalScrollTop;
            await this.wait(200);

            this.scanMessages();
            this.isScanning = false;
        }

        wait(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        // 扫描用户消息
        scanMessages() {
            this.messages = [];

            // 多种选择器组合尝试
            const selectorGroups = [
                // 优先级1: conversation-turn 结构
                () => {
                    const turns = document.querySelectorAll('conversation-turn');
                    const userTurns = [];
                    turns.forEach(turn => {
                        if (turn.getAttribute('data-turn-role') === 'user') {
                            userTurns.push(turn);
                        }
                    });
                    return userTurns;
                },
                // 优先级2: user-query 元素
                () => [...document.querySelectorAll('user-query')],
                // 优先级3: 带 query-bubble 类的元素
                () => [...document.querySelectorAll('.user-query-bubble-with-background')],
                // 优先级4: 包含上传图片的父容器
                () => {
                    const imgs = document.querySelectorAll('img[data-test-id="uploaded-img"]');
                    const parents = new Set();
                    imgs.forEach(img => {
                        // 找到包含该图片的 conversation-turn 或 user-query
                        let parent = img.closest('conversation-turn') || img.closest('user-query');
                        if (parent) parents.add(parent);
                    });
                    return [...parents];
                },
                // 优先级5: 通用 query 选择器
                () => [...document.querySelectorAll('[class*="query-bubble"], [class*="user-query"]')]
            ];

            let userNodes = [];

            for (const getNodes of selectorGroups) {
                try {
                    const nodes = getNodes();
                    if (nodes.length > 0) {
                        userNodes = nodes;
                        break;
                    }
                } catch (e) { }
            }

            const seen = new Set();
            userNodes.forEach((node) => {
                const text = this.extractText(node);
                // 允许图片标记或文字内容
                if (text && (text.includes('🖼️') || text.length > 3) && !seen.has(text)) {
                    seen.add(text);
                    node.dataset.chatNavIndex = this.messages.length;
                    this.messages.push({
                        index: this.messages.length,
                        text: text,
                        node: node
                    });
                }
            });

            console.log(`成功解析 ${this.messages.length} 条问题`);
            this.renderList();
        }

        // 提取文本
        extractText(node) {
            // 检查是否有图片 - 使用 Gemini 的确切选择器
            let hasImage = false;

            // 方式1: Gemini 上传图片的确切选择器
            const uploadedImg = node.querySelector('img[data-test-id="uploaded-img"], img.preview-image');
            if (uploadedImg) {
                hasImage = true;
            }

            // 方式2: 检查 lh3.googleusercontent 链接的图片
            if (!hasImage) {
                const images = node.querySelectorAll('img');
                images.forEach(img => {
                    const src = img.src || '';
                    if (src.includes('lh3.googleusercontent') || src.includes('googleusercontent.com/gg/')) {
                        hasImage = true;
                    }
                });
            }

            // 方式3: 检查图片预览容器
            if (!hasImage) {
                const previewContainer = node.querySelector('[class*="preview-image"], [class*="uploaded-img"]');
                if (previewContainer) {
                    hasImage = true;
                }
            }

            const queryText = node.querySelector('.query-text, [class*="query-text"]');
            let text = '';

            if (queryText) {
                text = this.cleanText(queryText);
            } else {
                const p = node.querySelector('p');
                if (p) {
                    text = this.cleanText(p);
                } else {
                    text = this.cleanText(node);
                }
            }

            // 如果没有文字但有图片，返回图片标记
            if (!text && hasImage) {
                return '🖼️ [图片]';
            }

            // 如果有文字也有图片，添加图片标记
            if (text && hasImage) {
                return '🖼️ ' + text;
            }

            return text;
        }

        cleanText(node) {
            const clone = node.cloneNode(true);
            clone.querySelectorAll('button, mat-icon, svg, img, [class*="icon"], code, pre').forEach(el => el.remove());
            let text = clone.textContent || '';
            text = text.trim().replace(/\s+/g, ' ');
            return text;
        }

        // 渲染列表
        renderList() {
            // 清空列表容器
            while (this.listContainer.firstChild) {
                this.listContainer.removeChild(this.listContainer.firstChild);
            }

            // 过滤消息
            const filteredMessages = this.searchQuery
                ? this.messages.filter(msg => msg.text.toLowerCase().includes(this.searchQuery))
                : this.messages;

            if (this.messages.length === 0) {
                const empty = document.createElement('div');
                empty.className = 'nav-empty';
                empty.textContent = '暂无问题';

                const line = document.createElement('div');
                line.className = 'nav-item-line';
                line.style.background = '#dadce0';

                this.listContainer.appendChild(empty);
                this.listContainer.appendChild(line);
                return;
            }

            // 搜索无结果
            if (filteredMessages.length === 0 && this.searchQuery) {
                const noResult = document.createElement('div');
                noResult.className = 'nav-no-result';
                noResult.textContent = '未找到匹配结果';
                this.listContainer.appendChild(noResult);

                // 添加计数
                const count = document.createElement('div');
                count.className = 'nav-count';
                count.textContent = `0/${this.messages.length} 条`;
                this.listContainer.appendChild(count);
                return;
            }

            // 创建条目
            filteredMessages.forEach(msg => {
                const item = document.createElement('div');
                item.className = 'nav-item';
                item.dataset.index = msg.index;

                // 文本
                const text = document.createElement('span');
                text.className = 'nav-item-text';
                const preview = msg.text.length > CONFIG.PREVIEW_LENGTH
                    ? msg.text.substring(0, CONFIG.PREVIEW_LENGTH) + '...'
                    : msg.text;

                // 高亮搜索词
                if (this.searchQuery) {
                    this.highlightText(text, preview, this.searchQuery);
                } else {
                    text.textContent = preview;
                }
                text.title = msg.text;

                // 短线
                const line = document.createElement('div');
                line.className = 'nav-item-line';

                item.appendChild(text);
                item.appendChild(line);
                this.listContainer.appendChild(item);
            });

            // 添加计数
            const count = document.createElement('div');
            count.className = 'nav-count';
            if (this.searchQuery) {
                count.textContent = `${filteredMessages.length}/${this.messages.length} 条`;
            } else {
                count.textContent = `共 ${this.messages.length} 条`;
            }
            this.listContainer.appendChild(count);
        }

        // 高亮搜索文本
        highlightText(container, text, query) {
            const lowerText = text.toLowerCase();
            const lowerQuery = query.toLowerCase();
            let lastIndex = 0;

            while (true) {
                const index = lowerText.indexOf(lowerQuery, lastIndex);
                if (index === -1) {
                    // 剩余文本
                    if (lastIndex < text.length) {
                        container.appendChild(document.createTextNode(text.substring(lastIndex)));
                    }
                    break;
                }

                // 高亮前的文本
                if (index > lastIndex) {
                    container.appendChild(document.createTextNode(text.substring(lastIndex, index)));
                }

                // 高亮部分
                const mark = document.createElement('mark');
                mark.textContent = text.substring(index, index + query.length);
                container.appendChild(mark);

                lastIndex = index + query.length;
            }
        }

        // 跳转到消息
        scrollToMessage(index) {
            const message = this.messages.find(m => m.index === index);
            if (!message) return;

            const node = message.node;
            node.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });

            node.classList.add('message-highlight');
            setTimeout(() => {
                node.classList.remove('message-highlight');
            }, CONFIG.HIGHLIGHT_DURATION);
        }

        // 监听页面变化
        setupObserver() {
            const targetNode = document.querySelector('main') || document.body;

            let debounceTimer;
            this.observer = new MutationObserver(() => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => this.scanMessages(), 1000);
            });

            this.observer.observe(targetNode, {
                childList: true,
                subtree: true
            });
        }

        // 绑定事件
        bindEvents() {
            this.panel.addEventListener('click', (e) => {
                const navItem = e.target.closest('.nav-item');
                if (navItem) {
                    const index = parseInt(navItem.dataset.index);
                    this.scrollToMessage(index);
                }
            });
        }
    }

    // ==================== 启动 ====================
    const start = () => {
        setTimeout(() => {
            new ChatNavigator();
        }, 2000);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
