// ==UserScript==
// @name         强制使用系统默认 Sans-Serif 字体 (essay.ink)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  强制将 essay.ink 网站上的所有字体设置为系统默认的 sans-serif 字体。
// @author       Hoyt
// @match        *://*.essay.ink/*
// @grant        none
// @run-at       document-start
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/553928/%E5%BC%BA%E5%88%B6%E4%BD%BF%E7%94%A8%E7%B3%BB%E7%BB%9F%E9%BB%98%E8%AE%A4%20Sans-Serif%20%E5%AD%97%E4%BD%93%20%28essayink%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553928/%E5%BC%BA%E5%88%B6%E4%BD%BF%E7%94%A8%E7%B3%BB%E7%BB%9F%E9%BB%98%E8%AE%A4%20Sans-Serif%20%E5%AD%97%E4%BD%93%20%28essayink%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const css = `
        /* 强制覆盖所有文本元素的字体，排除图标(i标签) */
        body,
        *:not(i),
        p, span, a, h1, h2, h3, h4, h5, h6,
        div, li, ul, ol, table, td, th,
        input, button, textarea, select,
        .ProseMirror, .editor-content, [contenteditable="true"] {
            font-family: sans-serif !important;
        }
    `;

    const style = document.createElement('style');
    style.textContent = css; // 无需设置 type="text/css"，HTML5 中默认生效

    // 直接插入样式，利用 document-start 确保优先级
    const target = document.head || document.body;
    if (target) {
        target.appendChild(style);
    }
})();