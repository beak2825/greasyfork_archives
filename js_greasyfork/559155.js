// ==UserScript==
// @name         Gemini Ultra Wide
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  对话内容全宽；输入框限制 80% 并居中 (基于 input-container 修正)
// @author       Wuyilingwei
// @match        https://gemini.google.com/*
// @supportURL   https://github.com/wuyilingwei/MyUserScript/issues
// @homepageURL  https://github.com/wuyilingwei/MyUserScript
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gemini.google.com
// @license      MIT & Anti-Labor Exploitation License
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559155/Gemini%20Ultra%20Wide.user.js
// @updateURL https://update.greasyfork.org/scripts/559155/Gemini%20Ultra%20Wide.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const css = `
        /* -----------------------------------------------------------
           1. 主对话区域 (Main Content) - 强制全宽
           ----------------------------------------------------------- */
        .conversation-container {
            max-width: none !important;
            width: 90% !important;
        }

        user-query,
        .user-query-container,
        model-response,
        .model-response-container {
            max-width: none !important;
            width: 100% !important;
        }

        /* 移除内部文本容器的限制，防止文字被包裹在中间 */
        .message-content,
        .text-content {
            max-width: none !important;
        }

        /* -----------------------------------------------------------
           2. 底部输入区域 (Input Area) - 限制 80% 并居中
           ----------------------------------------------------------- */

        /* 外层容器: 保持 100% 宽度，确保渐变背景(input-gradient)覆盖全屏底部
           同时设置为 Flex 使得内部元素可以轻松居中
        */
        input-container {
            width: 100% !important;
            max-width: 100% !important;
            display: flex !important;
            flex-direction: column !important; /* 垂直排列：输入框在上，Disclaimer在下 */
            align-items: center !important;    /* 核心：强制子元素水平居中 */
        }

        /* 中间包裹层: 确保它不限制宽度，允许子元素撑开
        */
        .input-area-container {
            width: 100% !important;
            max-width: 100% !important;
            display: flex !important;
            justify-content: center !important; /* 二次确保居中 */
        }

        /* 目标输入框 (Target Component): 限制为 80%
        */
        input-area-v2 {
            width: 80% !important;
            max-width: 80% !important;
            /* 如果父级 Flex 失效，margin: auto 作为 fallback
               确保 block 级元素居中
            */
            margin-left: auto !important;
            margin-right: auto !important;
        }

        /* 免责声明 (Disclaimer): 也许你也希望它居中且宽度对齐
        */
        hallucination-disclaimer {
            width: 80% !important;
            max-width: 80% !important;
            margin-left: auto !important;
            margin-right: auto !important;
        }
        /* ==========================================================================
           3. 移除干扰元素 (Privacy & Cleanliness)
           ========================================================================== */

        /* 移除底部的 "Gemini 可能显示不准确信息..." */
        hallucination-disclaimer,
        .hallucination-disclaimer {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }

        /* 移除与 disclaimer 相关的底部留白，让界面更紧凑 */
        .input-area-container {
            margin-bottom: 10px !important; /* 仅保留少量底部边距 */
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