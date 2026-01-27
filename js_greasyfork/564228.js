// ==UserScript==
// @name         YouMind Like Gemini
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  优化YouMind字体显示，使其接近Gemini的阅读体验（更清晰的加粗、更舒适的行高）
// @author       赤星
// @match        https://youmind.com/*
// @match        https://*.youmind.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/564228/YouMind%20Like%20Gemini.user.js
// @updateURL https://update.greasyfork.org/scripts/564228/YouMind%20Like%20Gemini.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const css = `
        /* 1. 引入 Inter 和 Roboto 字体，模拟现代清晰质感 */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Roboto:wght@400;500;700&display=swap');

        /* 2. 全局字体设定：优先使用 Google Sans 或 Inter，并开启抗锯齿 */
        body, #app, .app-container {
            font-family: "Google Sans", "Inter", "Roboto", "Helvetica Neue", system-ui, -apple-system, sans-serif !important;
            -webkit-font-smoothing: antialiased !important;
            -moz-osx-font-smoothing: grayscale !important;
            color: #1f1f1f !important; /* Gemini 的深灰色，对比度适中 */
        }

        /* 3. 优化正文阅读体验：增加行高，字间距微调 */
        p, .prose, .text-base, div[class*="text-"], span[class*="text-"] {
            line-height: 1.75 !important; /* 关键：Gemini 的舒适感来源 */
            letter-spacing: 0.01em;
        }

        /* 4. 强化加粗效果：YouMind 默认只有 500，这里强制改为 700 */
        strong, b, h1, h2, h3, h4, h5, h6, .font-bold, .font-semibold {
            font-weight: 700 !important;
            color: #0b0b0b !important; /* 加粗文字颜色加深 */
        }

        /* 5. 确保普通文字保持常规粗细 */
        p, li, span, div {
           font-weight: 400;
        }

        /* 6. 针对脑图节点的特殊微调 (可选) */
        .react-flow__node {
             font-weight: 500 !important; /* 节点文字稍微加重一点点，保持清晰 */
        }
    `;

    // 注入样式
    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(css);
    } else {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

})();