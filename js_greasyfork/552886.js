// ==UserScript==
// @name         Wider Gemini (v2.1)
// @name:zh-CN   加宽 Gemini (v2.1)
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Widen the display area of the Gemini web version.
// @description:zh-CN  加宽 Gemini 网页版显示区域。
// @author       dean
// @match        https://gemini.google.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552886/Wider%20Gemini%20%28v21%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552886/Wider%20Gemini%20%28v21%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 在这里自定义你想要的宽度 ---
    const newMaxWidth = '1800px'; // 你可以改成 '85%', '2000px' 等

    // 针对 Gemini 当前结构的 CSS 选择器
    const customCSS = `
        /* 主要内容区域的容器 */
        mat-sidenav-content, .main-content {
            max-width: ${newMaxWidth} !important;
        }

        /* 聊天记录的直接容器 */
        .conversation-container {
            max-width: ${newMaxWidth} !important;
        }
    `;

    // 注入样式
    try {
        GM_addStyle(customCSS);
        console.log('Wider Gemini styles applied successfully.');
    } catch (e) {
        console.error('Wider Gemini script failed to apply styles:', e);
    }
})();