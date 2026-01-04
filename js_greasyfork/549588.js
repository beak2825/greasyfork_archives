// ==UserScript==
// @name         UOJ Font Changer
// @name:zh-CN   UOJ 字体强制修改器
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Forces the font on uoj.ac to Lato, 'Noto Sans CJK SC' and the code font to 'Fira Code'.
// @description:zh-CN  强制将 uoj.ac 的网页字体更改为 Lato 和 Noto Sans CJK SC，代码字体更改为 Fira Code。
// @match        *://*.uoj.ac/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549588/UOJ%20Font%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/549588/UOJ%20Font%20Changer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 确保您的系统中已安装 'Lato', 'Noto Sans CJK SC', 和 'Fira Code' 字体
    // Noto Sans CJK SC 是思源黑体简体中文版
    // Fira Code 是一款流行的编程连字字体

    const css = `
        /* 全局字体设置 */
        body, html, .uoj-content, h1, h2, h3, h4, h5, h6, p, a, li, th, td {
            font-family: Lato, 'Noto Sans CJK SC', sans-serif !important;
        }

        /* 代码及等宽字体设置 */
        /* 针对 <pre>, <code>, <kbd>, <samp>, .CodeMirror-code 等元素 */
        pre, code, kbd, samp, .CodeMirror-code, .sh_sourceCode, .uoj-content pre, .uoj-content code, textarea.form-control {
            font-family: 'Fira Code', monospace !important;
            /* 可选：为 Fira Code 启用字体连字特性 */
            font-variant-ligatures: common-ligatures;
            -webkit-font-variant-ligatures: common-ligatures;
            font-feature-settings: "liga", "clig";
        }
    `;

    GM_addStyle(css);
})();