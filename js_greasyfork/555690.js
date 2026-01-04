// ==UserScript==
// @name         豆包聊天窗口宽度自适应  -- By Benson
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  让豆包的聊天窗口和输入框自适应浏览器宽度，并美化消息气泡样式。
// @author       Benson
// @match        https://www.doubao.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555690/%E8%B1%86%E5%8C%85%E8%81%8A%E5%A4%A9%E7%AA%97%E5%8F%A3%E5%AE%BD%E5%BA%A6%E8%87%AA%E9%80%82%E5%BA%94%20%20--%20By%20Benson.user.js
// @updateURL https://update.greasyfork.org/scripts/555690/%E8%B1%86%E5%8C%85%E8%81%8A%E5%A4%A9%E7%AA%97%E5%8F%A3%E5%AE%BD%E5%BA%A6%E8%87%AA%E9%80%82%E5%BA%94%20%20--%20By%20Benson.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("豆包聊天窗口自适应脚本已启动...");

    GM_addStyle(`
        /* 1. 定义全局动态宽度变量和颜色主题变量 */
        :root {
            /*
             * 动态宽度：在屏幕宽度足够时，最大宽度为 2000px；
             * 当屏幕变窄时，自动填充可用空间，并留出 40px 的边距。
             */
            --doubao-dynamic-width: min(calc(100vw - 40px), 2000px) !important;

            /* 自定义消息气泡颜色 */
            --receive-bg-color: #E6F4EA !important; /* 接收消息背景色 */
            --receive-border-color: #B2F0C6 !important; /* 接收消息边框色 */
            --send-bg-color: #F0F8FF !important; /* 发送消息背景色 */
            --send-border-color: #D6E4FF !important; /* 发送消息边框色 */
        }

        /* 2. 应用到整个聊天页面的居中容器，这是实现全屏宽度的关键 */
        .container-SrVXPg {
            --center-content-max-width: var(--doubao-dynamic-width) !important;
        }

        /* 3. 调整消息块的布局和样式 */
        /* 3.1 接收消息 - 保持左对齐并限制最大宽度 */
        div[data-testid="receive_message"] > div.flex.flex-col.flex-grow {
            align-self: flex-start !important;
            max-width: 95% !important; /* 限制接收消息的最大宽度，避免过宽影响阅读 */
        }

        /* 3.2 发送消息 - 右对齐、自适应宽度并美化样式 */
        /* 修复换行问题，并确保消息气泡颜色和边框生效 */
        [data-testid="send_message"] .container-QQkdo4,
        [data-testid="send_message"] .max-w-650,
        [data-testid="send_message"] .max-w-2000 {
            max-width: calc(95% + 40px) !important; /* 补偿内边距，确保内容有足够空间 */
            width: fit-content !important; /* 宽度自适应内容 */
            margin-left: auto !important; /* 右对齐的关键 */
            background-color: var(--send-bg-color) !important;
            border: 1px solid var(--send-border-color) !important;
            border-radius: 12px !important; /* 可选：增加圆角让气泡更美观 */
        }

        /* 为接收消息也添加统一的气泡样式 */
        [data-testid="receive_message"] .container-QQkdo4 {
            background-color: var(--receive-bg-color) !important;
            border: 1px solid var(--receive-border-color) !important;
            border-radius: 12px !important; /* 可选：增加圆角让气泡更美观 */
        }

        /* 4. 文字编辑窗口 - 确保输入框区域也自适应宽度 */
        #chat-route-layout {
            --content-max-width: var(--doubao-dynamic-width) !important;
            --chat-area-max-width: var(--doubao-dynamic-width) !important;
        }

        /* 确保输入框容器和内容区域占满宽度 */
        .chat-input-container,
        .input-container,
        .ProseMirror,
        .editor-container {
            max-width: 100% !important;
            width: 100% !important;
        }
    `);

})();