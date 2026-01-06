// ==UserScript==
// @name         Gemini 气泡外壳版 (文字原色)
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  仅保留对话气泡背景与侧边条，不修改文字颜色，保证原生阅读体验
// @author       Your Name
// @match        https://gemini.google.com/*
// @grant        GM_addStyle
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561578/Gemini%20%E6%B0%94%E6%B3%A1%E5%A4%96%E5%A3%B3%E7%89%88%20%28%E6%96%87%E5%AD%97%E5%8E%9F%E8%89%B2%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561578/Gemini%20%E6%B0%94%E6%B3%A1%E5%A4%96%E5%A3%B3%E7%89%88%20%28%E6%96%87%E5%AD%97%E5%8E%9F%E8%89%B2%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const css = `
        /* 1. 全局布局：增加两侧留白，避免文字贴边 */
        .chat-item {
            display: flex !important;
            flex-direction: column !important;
            margin-bottom: 30px !important;
            padding: 0 8% !important;
        }

        /* 2. 用户提问气泡：背景深灰蓝 + 右侧蓝条 */
        .user-query-bubble-with-background {
            align-self: flex-end !important;
            background-color: #2d3135 !important; /* 气泡底色 */
            border: 1px solid #444746 !important;
            border-right: 6px solid #8ab4f8 !important; /* 身份识别蓝条 */
            border-radius: 18px 18px 2px 18px !important;
            padding: 12px 24px !important;
            max-width: 85% !important;
        }

        /* 3. 模型回复气泡：背景深灰 + 左侧绿条 */
        model-response {
            align-self: flex-start !important;
            background-color: #1e1f20 !important; /* 气泡底色 */
            border: 1px solid #3c4043 !important;
            border-left: 6px solid #81c995 !important; /* 身份识别绿条 */
            border-radius: 2px 18px 18px 18px !important;
            padding: 20px !important;
            width: 100% !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
        }

        /* 4. 强制透明：让原本散乱的背景消失，统一透出气泡底色 */
        .markdown-main-panel,
        .response-container,
        .message-content,
        .thought-container,
        .query-text,
        ms-message-content {
            background: transparent !important;
            background-color: transparent !important;
            border: none !important;
        }

        /* 5. 内部组件细微修饰 */
        /* “显示思路”按钮保持原样，仅稍微拉开距离 */
        .show-thoughts-button {
            margin-bottom: 12px !important;
        }

        /* 表格背景微调，确保在气泡内有层次感 */
        table {
            background: rgba(255,255,255,0.02) !important;
            border-radius: 8px !important;
        }

    `;

    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(css);
    } else {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }
})();