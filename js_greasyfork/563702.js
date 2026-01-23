// ==UserScript==
// @name         洛谷深色模式
// @license      MIT
// @namespace    https://www.luogu.com.cn/
// @version      1.3
// @description  暴力覆盖背景 + 修复标题冲突 + 补全侧边栏与顶栏
// @author       Gemini
// @match        https://www.luogu.com.cn/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/563702/%E6%B4%9B%E8%B0%B7%E6%B7%B1%E8%89%B2%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/563702/%E6%B4%9B%E8%B0%B7%E6%B7%B1%E8%89%B2%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.innerHTML = `
        html, body, #app, .lfe-body, .main-container, .container, 
        div, section, article, header, nav, footer, aside,
        .card, .wrapped, .padding-default, .popup, 
        .top-bar, .sidebar, .nav-scrollbar {
            background-color: #1e1e1e !important;
            background: #1e1e1e !important;
            color: #d4d4d4 !important;
            border-color: #333 !important;
            box-shadow: none !important;
        }

        .main-container, .top-bar, .sidebar {
            background: #1e1e1e !important;
        }

        [class*="lfe-h"], h1, h2, h3, h4, h5, h6, .title, strong, .name {
            color: #ffffff !important;
        }

        .markedContent, .md-inline-static, .p-container, pre, code {
            background-color: #121212 !important;
            color: #e0e0e0 !important;
            border: 1px solid #444 !important;
        }

        a, .lfe-caption, .lg-fg-bluelight {
            color: #4daafc !important; 
        }

        input, textarea, .lfe-form-sz-middle, button {
            background: #2d2d2d !important;
            color: white !important;
            border: 1px solid #444 !important;
        }

        .lg-fg-red    { color: #ff5555 !important; }
        .lg-fg-orange { color: #ff9922 !important; }
        .lg-fg-yellow { color: #f1c40f !important; }
        .lg-fg-green  { color: #52c41a !important; }
        .lg-fg-blue   { color: #3498db !important; }
        .lg-fg-purple { color: #9b59b6 !important; }

        .background, [class*="background"], hr {
            display: none !important;
        }
    `;
    
    // 注入逻辑
    if (document.head) {
        document.head.appendChild(style);
    } else {
        const observer = new MutationObserver(() => {
            if (document.head) {
                document.head.appendChild(style);
                observer.disconnect();
            }
        });
        observer.observe(document.documentElement, { childList: true });
    }
})();