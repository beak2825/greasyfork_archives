// ==UserScript==
// @name         AI Studio - 聊天风格
// @name:en      AI Studio - Chat Style
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  修改 AI Studio 的风格像是聊天，支持深浅色模式。
// @description:en  Modifying AI Studio's style is like chatting, supporting both light and dark modes.
// @author       fleey
// @match        https://aistudio.google.com/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548060/AI%20Studio%20-%20%E8%81%8A%E5%A4%A9%E9%A3%8E%E6%A0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/548060/AI%20Studio%20-%20%E8%81%8A%E5%A4%A9%E9%A3%8E%E6%A0%BC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Telegram 风格配色方案
    const telegramColors = {
        primary: '#0088cc',
        primaryDark: '#006ba6',
        secondary: '#40a7e3',
        background: '#ffffff',
        backgroundDark: '#17212b',
        surface: '#f5f5f5',
        surfaceDark: '#242f3d',
        text: '#000000',
        textDark: '#ffffff',
        textSecondary: '#707579',
        textSecondaryDark: '#aaaaaa',
        border: '#e1e5e9',
        borderDark: '#3e546a',
        userBubble: '#0088cc',
        userBubbleDark: '#2b5278',
        botBubble: '#ffffff',
        botBubbleDark: '#182533',
        shadow: 'rgba(0, 0, 0, 0.1)',
        shadowDark: 'rgba(0, 0, 0, 0.3)'
    };

    // 检测系统主题
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    // 创建 CSS 样式
    function createTelegramStyles() {
        const colors = isDarkMode ? {
            bg: telegramColors.backgroundDark,
            surface: telegramColors.surfaceDark,
            text: telegramColors.textDark,
            textSecondary: telegramColors.textSecondaryDark,
            border: telegramColors.borderDark,
            userBubble: telegramColors.userBubbleDark,
            botBubble: telegramColors.botBubbleDark,
            shadow: telegramColors.shadowDark
        } : {
            bg: telegramColors.background,
            surface: telegramColors.surface,
            text: telegramColors.text,
            textSecondary: telegramColors.textSecondary,
            border: telegramColors.border,
            userBubble: telegramColors.userBubble,
            botBubble: telegramColors.botBubble,
            shadow: telegramColors.shadow
        };

        return `
        /* 全局样式重置 */
        * {
            box-sizing: border-box;
        }

        .chat-container {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
            color: ${colors.text} !important;
        }

        .chat-view-container {
            margin: 0 auto !important;
            position: relative !important;
        }

        .chat-container[_ngcontent-ng-c2385228922] .chat-view-container[_ngcontent-ng-c2385228922]:not(.zero-state):not(.side-by-side) {
            padding-top: 0 !important;
        }

        /* 聊天会话容器 */
        ms-chat-session {
            background: transparent !important;
            position: relative !important;
            z-index: 1 !important;
        }

        /* 滚动容器 */
        ms-autoscroll-container {
            background: transparent !important;
            padding: 0 !important;
        }

        /* 聊天轮次容器 - Telegram 风格 */
        .chat-turn-container {
            margin: 16px 0 !important;
            padding: 0 !important;
            background: transparent !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
        }

        /* 用户消息样式 - 类似 Telegram 右侧气泡 */
        .chat-turn-container.user {
            display: flex !important;
            justify-content: flex-end !important;
            margin-left: 60px !important;
        }

        .user-prompt-container {
            background: ${colors.userBubble} !important;
            color: white !important;
            border-radius: 18px 18px 4px 18px !important;
            padding: 12px 16px !important;
            max-width: 70% !important;
            box-shadow: 0 1px 2px ${colors.shadow} !important;
            position: relative !important;
            margin-left: auto !important;
        }

        .user-prompt-container .turn-content {
            margin: 0 !important;
            padding: 0 !important;
        }

        .user-prompt-container .author-label {
            display: none !important;
        }

        .user-prompt-container .cmark-node {
            color: white !important;
            margin: 0 !important;
        }

        .user-prompt-container p {
            margin: 0 !important;
            line-height: 1.6 !important;
        }

        /* AI 回复样式 - 类似 Telegram 左侧气泡 */
        .chat-turn-container.model {
            display: flex !important;
            justify-content: flex-start !important;
            margin-right: 60px !important;
        }

        .model-prompt-container {
            background: ${colors.botBubble} !important;
            color: ${colors.text} !important;
            border: 1px solid ${colors.border} !important;
            border-radius: 18px 18px 18px 4px !important;
            padding: 12px 16px !important;
            max-width: 70% !important;
            box-shadow: 0 1px 2px ${colors.shadow} !important;
            position: relative !important;
        }

        .model-prompt-container .turn-content {
            margin: 0 !important;
            padding: 0 !important;
        }

        .model-prompt-container .author-label {
            display: none !important;
        }

        .model-prompt-container .cmark-node {
            color: ${colors.text} !important;
            margin: 0 !important;
        }

        .model-prompt-container p {
            margin: 0 0 8px 0 !important;
            line-height: 1.6 !important;
        }

        .model-prompt-container p:last-child {
            margin-bottom: 0 !important;
        }

        /* 思考过程样式优化 */
        ms-thought-chunk {
            margin: 8px 0 !important;
        }

        .mat-accordion {
            background: transparent !important;
            box-shadow: none !important;
        }

        .mat-expansion-panel {
            background: rgba(${isDarkMode ? '255,255,255' : '0,0,0'}, 0.05) !important;
            border-radius: 12px !important;
            box-shadow: none !important;
            margin: 4px 0 !important;
            border: 1px solid ${colors.border} !important;
        }
        
        .container .mat-expansion-panel {
            background: rgba(${isDarkMode ? '255,255,255' : '0,0,0'}, 0.05) !important;
            border-radius: 12px !important;
            box-shadow: none !important;
            margin: 0 0 !important;
            border: 1px solid ${colors.border} !important;
        }

        .mat-expansion-panel-header {
            padding: 8px 12px !important;
            height: auto !important;
            border-radius: 12px !important;
        }

        .thinking-progress-icon {
            width: 16px !important;
            height: 16px !important;
            margin-right: 6px !important;
        }

        .experimental-label {
            background: ${telegramColors.primary} !important;
            color: white !important;
            padding: 2px 6px !important;
            border-radius: 10px !important;
            font-size: 10px !important;
            margin-left: 6px !important;
        }

        .chat-turn-container:hover .actions-container {
            opacity: 1 !important;
        }
        .ms-button-borderless:hover {
            background: ${colors.border} !important;
        }

        .ms-button-icon-symbol {
            font-size: 16px !important;
            color: ${colors.textSecondary} !important;
        }

        /* 底部信息样式 */
        .turn-footer {
            display: flex !important;
            align-items: center !important;
            justify-content: flex-end !important;
            margin-top: 8px !important;
            gap: 8px !important;
            padding: 4px 8px !important;
            opacity: 0.7 !important;
            transition: opacity 0.2s ease !important;
        }

        .turn-footer:hover {
            opacity: 1 !important;
        }

        .model-run-time-pill {
            background: transparent !important;
            color: ${colors.textSecondary} !important;
            font-size: 11px !important;
            padding: 2px 6px !important;
            border-radius: 10px !important;
            border: none !important;
        }

        .response-feedback-button {
            background: transparent !important;
            border: none !important;
            border-radius: 50% !important;
            width: 28px !important;
            height: 28px !important;
            padding: 0 !important;
            opacity: 0.6 !important;
            transition: all 0.2s ease !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
        }

        .response-feedback-button:hover {
            opacity: 1 !important;
            background: ${colors.border} !important;
            transform: scale(1.1) !important;
        }

        .response-feedback-button .ms-button-icon-symbol {
            font-size: 16px !important;
            color: ${colors.textSecondary} !important;
        }

        .response-feedback-button:hover .ms-button-icon-symbol {
            color: ${colors.text} !important;
        }

        /* 代码块样式优化 */
        pre, code {
            border-radius: 12px !important;
            border: none !important;
        }

        pre {
            padding: 16px !important;
            margin: 12px 0 !important;
            overflow-x: auto !important;
            font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace !important;
            line-height: 1.5 !important;
        }

        code {
            padding: 3px 6px !important;
            font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace !important;
            font-size: 0.9em !important;
        }

        /* 内联代码样式优化 */
        .inline-code {
            background: ${isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'} !important;
            color: ${isDarkMode ? '#e8eaed' : '#1a73e8'} !important;
            border-radius: 6px !important;
            padding: 2px 6px !important;
            font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace !important;
            font-size: 0.9em !important;
            border: none !important;
            box-shadow: none !important;
        }

       
        /* 滚动条样式 */
        ::-webkit-scrollbar {
            width: 6px !important;
        }

        ::-webkit-scrollbar-track {
            background: transparent !important;
        }

        ::-webkit-scrollbar-thumb {
            background: ${colors.border} !important;
            border-radius: 3px !important;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: ${colors.textSecondary} !important;
        }

        /* 响应式设计 */
        @media (max-width: 768px) {
            .chat-view-container {
                padding: 12px !important;
            }

            .user-prompt-container,
            .model-prompt-container {
                max-width: 85% !important;
            }

            .chat-turn-container.user {
                margin-left: 20px !important;
            }

            .chat-turn-container.model {
                margin-right: 20px !important;
            }
        }

        /* 动画效果 */
        .chat-turn-container {
            animation: slideIn 0.3s ease-out !important;
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* 链接样式 */
        a {
            color: ${telegramColors.primary} !important;
            text-decoration: none !important;
        }

        a:hover {
            text-decoration: underline !important;
        }

        /* 选择文本样式 */
        ::selection {
            background: ${telegramColors.secondary} !important;
            color: white !important;
        }

        .prompt-input-wrapper {
            background: transparent !important;
            overflow: hidden !important;
            transition: all 0.2s ease !important;
        }

        .prompt-input-wrapper-container {
            display: flex !important;
            align-items: flex-end !important;
            background: ${colors.bg} !important;
            border-radius: 24px !important;
            padding: 8px 12px !important;
        }

        /* 文本输入区域 */
        .text-wrapper {
            flex: 1 !important;
            padding: 0px 12px !important;
            margin-right: 8px !important;
        }

        ms-code-block {
            margin: 10px 0 !important!
        }

        .text-input-wrapper {
            background: transparent !important;
        }

        .textarea {
            background: transparent !important;
            border: none !important;
            outline: none !important;
            resize: none !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
            font-size: 14px !important;
            line-height: 1.6 !important;
            color: ${colors.text} !important;
            padding: 8px 0 !important;
        }

        .textarea::placeholder {
            color: ${colors.textSecondary} !important;
            opacity: 0.7 !important;
        }

        /* 按钮区域简化 */
        .button-wrapper {
            display: flex !important;
            align-items: center !important;
            gap: 4px !important;
        }

        /* 添加按钮简化 */
        ms-add-chunk-menu button {
            background: transparent !important;
            border: none !important;
            border-radius: 50% !important;
            width: 36px !important;
            height: 36px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            transition: all 0.2s ease !important;
            color: ${colors.textSecondary} !important;
        }

        ms-add-chunk-menu button:hover {
            background: ${colors.border} !important;
            color: ${colors.text} !important;
        }

        ms-add-chunk-menu .ms-button-icon-symbol {
            font-size: 20px !important;
        }

        /* 运行按钮优化 */
        .run-button {
            background: ${telegramColors.primary} !important;
            border: none !important;
            border-radius: 20px !important;
            padding: 8px 16px !important;
            color: white !important;
            font-weight: 500 !important;
            transition: all 0.2s ease !important;
            min-width: 60px !important;
            height: 36px !important;
        }

        .run-button:not(:disabled):hover {
            background: ${telegramColors.primaryDark} !important;
            transform: translateY(-1px) !important;
            box-shadow: 0 2px 8px rgba(0, 136, 204, 0.3) !important;
        }

        .run-button:disabled {
            background: ${colors.border} !important;
            color: ${colors.textSecondary} !important;
            cursor: not-allowed !important;
        }

        .run-button .inner {
            display: flex !important;
            align-items: center !important;
            gap: 6px !important;
        }

        .run-button .label {
            font-size: 14px !important;
        }

        .run-button .command {
            display: flex !important;
            align-items: center !important;
            gap: 2px !important;
            opacity: 0.8 !important;
        }

        .run-button .command .mat-icon {
            font-size: 14px !important;
            width: 14px !important;
            height: 14px !important;
        }

        /* 移除不必要的动画和高亮效果 */
        .run-button .highlight {
            display: none !important;
        }

        /* 附件区域简化 */
        .attachment-wrapper {
            margin-top: 4px !important;
        }

        /* 工具提示简化 */
        .mat-mdc-tooltip {
            background: ${colors.surfaceDark} !important;
            color: ${colors.textDark} !important;
            font-size: 12px !important;
            border-radius: 6px !important;
            padding: 6px 8px !important;
        }
        `;
    }

    // 应用样式
    function applyTelegramTheme() {
        // 移除现有的样式
        const existingStyle = document.getElementById('telegram-theme');
        if (existingStyle) {
            existingStyle.remove();
        }

        // 创建新的样式元素
        const style = document.createElement('style');
        style.id = 'telegram-theme';
        style.textContent = createTelegramStyles();
        document.head.appendChild(style);
    }

    // 监听主题变化
    function setupThemeListener() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            // 使用现代的 addEventListener 替代废弃的 addListener
            mediaQuery.addEventListener('change', () => {
                setTimeout(applyTelegramTheme, 100);
            });
        }
    }

    // 初始化函数
    function init() {
        // 等待页面加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // 应用主题
        applyTelegramTheme();

        // 设置主题监听器
        setupThemeListener();

        // 监听页面变化，重新应用样式
        const observer = new MutationObserver(() => {
            setTimeout(applyTelegramTheme, 100);
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('🎨 AI Studio Telegram 主题已应用 - ai_studio_enhancer_v4.js:608');
    }

    // 启动脚本
    init();

})();

