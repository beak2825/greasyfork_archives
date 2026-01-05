// ==UserScript==
// @name         选中字体颜色个性化 (兼容字体渲染脚本)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  强制自定义选中字体的背景色和文字颜色，完美兼容并覆盖“字体渲染”脚本
// @author       You
// @match        *://*/*
// @grant        unsafeWindow
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558998/%E9%80%89%E4%B8%AD%E5%AD%97%E4%BD%93%E9%A2%9C%E8%89%B2%E4%B8%AA%E6%80%A7%E5%8C%96%20%28%E5%85%BC%E5%AE%B9%E5%AD%97%E4%BD%93%E6%B8%B2%E6%9F%93%E8%84%9A%E6%9C%AC%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558998/%E9%80%89%E4%B8%AD%E5%AD%97%E4%BD%93%E9%A2%9C%E8%89%B2%E4%B8%AA%E6%80%A7%E5%8C%96%20%28%E5%85%BC%E5%AE%B9%E5%AD%97%E4%BD%93%E6%B8%B2%E6%9F%93%E8%84%9A%E6%9C%AC%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置区域 ---
    const config = {
        bgColor: "#bbd6fc",   // 选中背景色
        textColor: "#1b1b1b"  // 选中文字颜色
    };
    // ----------------

    // 构建高权重 CSS
    // 使用 html:not(#z) body:not(#z) 是为了人为增加两个 ID 的权重，
    // 确保优先级高于任何普通类名选择器。
    const selector = "html:not(#z) body:not(#z)";
    const cssRules = `
        ${selector} ::selection {
            background-color: ${config.bgColor} !important;
            color: ${config.textColor} !important;
            -webkit-text-fill-color: ${config.textColor} !important; /* 核心：覆盖字体渲染脚本的填充色 */
            text-shadow: none !important;
            background-image: none !important;
        }
        ${selector} ::-moz-selection {
            background-color: ${config.bgColor} !important;
            color: ${config.textColor} !important;
            text-shadow: none !important;
            background-image: none !important;
        }
    `;

    // 方法 1: 传统的 <style> 标签注入
    // 兼容所有浏览器，且作为兜底方案
    const styleEl = document.createElement('style');
    styleEl.id = "user-selection-override";
    styleEl.textContent = cssRules;
    (document.head || document.documentElement).appendChild(styleEl);

    // 方法 2: 通过 adoptedStyleSheets 注入
    // 这是“字体渲染”脚本使用的方法，我们需要同样使用它并将样式追加到最后，以确保覆盖
    try {
        const win = window.unsafeWindow || window;
        if (win.document.adoptedStyleSheets) {
            const sheet = new CSSStyleSheet();
            sheet.replaceSync(cssRules);
            // 将我们的样式表追加到现有样式表数组的末尾
            win.document.adoptedStyleSheets = [...win.document.adoptedStyleSheets, sheet];
        }
    } catch (e) {
        // 静默失败，不影响主功能
    }

})();