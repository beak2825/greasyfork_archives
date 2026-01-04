// ==UserScript==
// @name         cnBeta 暗黑模式
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  全面暗黑化，统一背景、字体、边框、表单、图片等所有视觉元素
// @author       Ryan
// @match        https://www.cnbeta.com.tw/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550959/cnBeta%20%E6%9A%97%E9%BB%91%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/550959/cnBeta%20%E6%9A%97%E9%BB%91%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        html, body {
            background-color: #181a1b !important;
            color: #e8e6e3 !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
        }

        /* 清除强制白色背景 */
        [style*="background:#fff"], [style*="background-color:#fff"],
        [style*="background: white"], [style*="background-color: white"] {
            background-color: #181a1b !important;
            color: #e8e6e3 !important;
        }

        /* 修复白字叠加白背景问题 */
        [style*="color:#fff"], [style*="color: white"] {
            color: #e8e6e3 !important;
        }

        /* 所有容器透明处理 */
        div, section, article, aside, main, header, footer, nav, ul, li,
        .box, .card, .panel, .block, .list-item, .content-ul {
            background-color: transparent !important;
            color: inherit !important;
            border-color: #444 !important;
        }

        /* 特别修复 .content-ul 白底白字问题 */
        .content-ul {
            background-color: #181a1b !important;
            color: #e8e6e3 !important;
        }

        /* 全面覆盖所有链接样式，去除下划线 */
        a, a:link, a:visited, a:hover, a:active,
        .link, .title a, .headline a, .news_list a, .article a, .entry a, .post a,
        div a, section a, article a, aside a, header a, footer a, nav a, ul a, li a {
            color: #e8e6e3 !important;
            text-decoration: none !important;
            background-color: transparent !important;
        }

        a:hover {
            color: #ffffff !important;
        }

        /* 标题白色突出 */
        h1, h2, h3, h4, h5, h6 {
            color: #ffffff !important;
        }

        /* 次要文字灰色 */
        small, .meta, .subtitle, .info, .time, .source {
            color: #a8a6a3 !important;
        }

        /* 图片灰暗处理 */
        img {
            filter: brightness(0.75) contrast(1.1) saturate(0.8) !important;
            transition: filter 0.3s ease;
        }

        img:hover {
            filter: brightness(0.9) contrast(1.2) saturate(1) !important;
        }

        video {
            filter: brightness(0.8) contrast(1.1) !important;
        }

        /* 表单元素暗黑处理 */
        input, textarea, select, button {
            background-color: #2a2d2e !important;
            color: #e8e6e3 !important;
            border: 1px solid #444 !important;
            box-shadow: none !important;
            caret-color: #3391ff !important;
        }

        input::placeholder, textarea::placeholder {
            color: #888 !important;
        }

        input:focus, textarea:focus, select:focus {
            outline: none !important;
            border-color: #3391ff !important;
            background-color: #303233 !important;
        }

        .search-box input, .comment-form textarea, .form-control, .input-group input {
            background-color: #2a2d2e !important;
            color: #e8e6e3 !important;
            border: 1px solid #444 !important;
        }

        /* 修复白色边框和线条 */
        hr, .divider, .line, .bordered, .separator {
            border-color: #444 !important;
            background-color: #444 !important;
        }
    `;
    document.head.appendChild(style);

    // 清除内联白背景和白字
    document.querySelectorAll('[style]').forEach(el => {
        const bg = el.style.background || el.style.backgroundColor;
        const fg = el.style.color;
        if (bg && (bg.includes('#fff') || bg.includes('white'))) {
            el.style.background = 'transparent';
            el.style.backgroundColor = 'transparent';
        }
        if (fg && (fg.includes('#fff') || fg.includes('white'))) {
            el.style.color = '#e8e6e3';
        }
    });
})();
