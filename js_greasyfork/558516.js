// ==UserScript==
// @name         Gemini 宽屏显示
// @namespace    http://tampermonkey.net/
// @version      3.4
// @description  Gemini全屏显示，拓宽信息
// @author       V：chatgpt4v
// @license      MIT
// @match        https://gemini.google.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/558516/Gemini%20%E5%AE%BD%E5%B1%8F%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/558516/Gemini%20%E5%AE%BD%E5%B1%8F%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const css = `
        /* === 1. 主内容区域全宽 (对话气泡区域) === */
        main,
        infinite-scroller,
        .conversation-container,
        .horizontal-scroll-container,
        [class*="conversation-container"],
        [class*="main-content"] {
            max-width: 100% !important;
            width: 100% !important;
            margin-left: auto !important;
            margin-right: auto !important;
        }

        /* === 2. 代码块强制全宽 === */
        code-block {
            max-width: 100% !important;
            width: 100% !important;
            min-width: 0 !important;
            display: block !important;
        }
        .code-block-decoration,
        .formatted-code-block-internal-container {
            max-width: 100% !important;
        }

        /* === 3. 输入框区域 (重点修复) === */

        /* 步骤A：只把最外层的“黑条”壳子拉宽 */
        /* input-area-v2 是你截图里的最外层容器 */
        input-area-v2,
        .input-area-container,
        .input-wrapper {
            max-width: 100% !important;
            width: 100% !important;
            margin-left: auto !important;
            margin-right: auto !important;
        }

        /* 步骤B：让输入框内部的“网格”占满这 95% 的空间 */
        /* xapfileselectordropzone 是包裹按钮和文字的直接父级 */
        xapfileselectordropzone,
        [class*="xapfileselectordropzone"] {
            width: 100% !important;
            max-width: 100% !important;
            /* 严禁修改 display，保持原生的 grid，否则按钮会乱跑 */
        }

        /* 步骤C：【关键】修复内部文字容器的位置 */
        /* 之前就是因为它被居中导致的缩进，现在强制去除所有外边距 */
        [class*="text-input-field_textarea-wrapper"] {
            margin: 5 !important; /* 紧贴左边的+号按钮 */
            padding: 5 !important;
            width: auto !important; /* 让它自然填充剩余空间 */
            flex-grow: 1 !important; /* 占据中间所有空地 */
        }

        /* 步骤D：确保打字的区域也是满的 */
        rich-textarea,
        .ql-editor {
            width: 100% !important;
            max-width: 100% !important;
            padding-left: 0 !important; /* 防止左侧内缩进 */
        }

        /* 4. 隐藏横向滚动条 */
        body {
            overflow-x: hidden;
        }
    `;

    function injectStyles() {
        if (document.getElementById('gemini-auto-wide-v3-4')) return;
        const style = document.createElement('style');
        style.id = 'gemini-auto-wide-v3-4';
        style.textContent = css;
        document.head.appendChild(style);
    }

    injectStyles();
    setInterval(injectStyles, 1000);

})();