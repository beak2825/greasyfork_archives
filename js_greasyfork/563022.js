// ==UserScript==
// @name         洛谷局部深色主题 (保留原版导航栏)
// @namespace    https://github.com/dengmuyang/luogu
// @version      1.4.0
// @description  仅将内容区、题目区变为深色，保留顶部和侧边栏原色
// @author       dengmuyang
// @match        *://www.luogu.com.cn/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/563022/%E6%B4%9B%E8%B0%B7%E5%B1%80%E9%83%A8%E6%B7%B1%E8%89%B2%E4%B8%BB%E9%A2%98%20%28%E4%BF%9D%E7%95%99%E5%8E%9F%E7%89%88%E5%AF%BC%E8%88%AA%E6%A0%8F%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563022/%E6%B4%9B%E8%B0%B7%E5%B1%80%E9%83%A8%E6%B7%B1%E8%89%B2%E4%B8%BB%E9%A2%98%20%28%E4%BF%9D%E7%95%99%E5%8E%9F%E7%89%88%E5%AF%BC%E8%88%AA%E6%A0%8F%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const styleId = 'luogu-local-dark-theme';
    
    // 专门针对内容区的 CSS
    const css = `
        /* 1. 背景适配：排除掉 Header 和 Sidenav */
        body, 
        .lfe-body:not(.main-container), 
        #app > .main-container > main {
            background-color: #0f172a !important;
        }

        /* 2. 内容卡片与题目容器 */
        .card, .am-panel, .lg-article, 
        section.padding-default, 
        .item-container,
        .problem-content-container,
        .content-card {
            background-color: #1e293b !important;
            border: 1px solid #334155 !important;
            color: #e2e8f0 !important;
        }

        /* 3. 题目页面文字颜色修正 */
        .problem-content-container *, 
        .lg-article *, 
        .marked * {
            color: #e2e8f0 !important;
        }

        /* 4. 代码块与输入框 */
        pre, code, .copy-btn {
            background-color: #0f172a !important;
            border-color: #334155 !important;
            color: #60a5fa !important;
        }
        input, textarea, .edited-container, .select-container {
            background-color: #0f172a !important;
            color: #f1f5f9 !important;
            border: 1px solid #475569 !important;
        }

        /* 5. 关键：强制保护导航栏和侧边栏不被修改 */
        #app-header, 
        .lfe-header, 
        header,
        .side-navigation, 
        nav {
            background-color: inherit; /* 随洛谷系统设置 */
            color: inherit;
        }

        /* 6. 链接颜色适配 */
        a:not([class*="header"]) {
            color: #60a5fa !important;
        }

        /* 7. 讨论区回复框等动态元素 */
        .reply-container, .comment-item {
            background-color: #1e293b !important;
            border-bottom: 1px solid #334155 !important;
        }
    `;

    function applyTheme() {
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = css;
            (document.head || document.documentElement).appendChild(style);
        }
    }

    function removeTheme() {
        const style = document.getElementById(styleId);
        if (style) style.remove();
    }

    // 初始化
    const status = localStorage.getItem('luogu-theme-status') || 'dark';
    if (status === 'dark') applyTheme();

    // 切换按钮
    function initUI() {
        const btn = document.createElement('div');
        btn.innerHTML = localStorage.getItem('luogu-theme-status') === 'light' ? '🌞' : '🌙';
        Object.assign(btn.style, {
            position: 'fixed', bottom: '20px', left: '20px',
            width: '40px', height: '40px', background: '#3b82f6',
            color: 'white', borderRadius: '50%', textAlign: 'center',
            lineHeight: '40px', cursor: 'pointer', zIndex: '99999'
        });

        btn.onclick = () => {
            const current = localStorage.getItem('luogu-theme-status') || 'dark';
            if (current === 'dark') {
                removeTheme();
                localStorage.setItem('luogu-theme-status', 'light');
                btn.innerHTML = '🌞';
            } else {
                applyTheme();
                localStorage.setItem('luogu-theme-status', 'dark');
                btn.innerHTML = '🌙';
            }
        };
        document.body.appendChild(btn);
    }

    if (document.readyState === 'complete') initUI();
    else document.addEventListener('DOMContentLoaded', initUI);
})();
