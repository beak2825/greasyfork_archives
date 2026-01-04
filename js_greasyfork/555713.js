// ==UserScript==
// @name         豆包深色模式 + 宽屏聊天开关（输入框同步 + 表格优化）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  深色模式 + 宽屏聊天开关，输入框同步变宽，表格在深色模式下增强对比度，刷新记忆状态
// @author       Tomoya
// @match        https://*.doubao.com/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555713/%E8%B1%86%E5%8C%85%E6%B7%B1%E8%89%B2%E6%A8%A1%E5%BC%8F%20%2B%20%E5%AE%BD%E5%B1%8F%E8%81%8A%E5%A4%A9%E5%BC%80%E5%85%B3%EF%BC%88%E8%BE%93%E5%85%A5%E6%A1%86%E5%90%8C%E6%AD%A5%20%2B%20%E8%A1%A8%E6%A0%BC%E4%BC%98%E5%8C%96%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/555713/%E8%B1%86%E5%8C%85%E6%B7%B1%E8%89%B2%E6%A8%A1%E5%BC%8F%20%2B%20%E5%AE%BD%E5%B1%8F%E8%81%8A%E5%A4%A9%E5%BC%80%E5%85%B3%EF%BC%88%E8%BE%93%E5%85%A5%E6%A1%86%E5%90%8C%E6%AD%A5%20%2B%20%E8%A1%A8%E6%A0%BC%E4%BC%98%E5%8C%96%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const THEME_KEY = 'doubao-theme';
    const WIDTH_KEY = 'doubao-widechat';
    let currentTheme = localStorage.getItem(THEME_KEY) || 'light';
    let wideChat = localStorage.getItem(WIDTH_KEY) === 'true';

    // ====== 设置主题 ======
    function setDataTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        currentTheme = theme;
        localStorage.setItem(THEME_KEY, theme);
        updateThemeSwitch();
        applyDarkTableStyle(); // 表格深色模式应用
    }

    // ====== 设置宽屏 ======
    function setWideChat(enable) {
        wideChat = enable;
        localStorage.setItem(WIDTH_KEY, enable);
        updateWidth();
        updateWidthSwitch();
    }

    // ====== 更新宽屏样式 ======
    function updateWidth() {
        const maxWidth = wideChat ? '1500px' : '848px';

        // 聊天区最外层 CSS 变量
        const chatContainers = document.querySelectorAll('.container-SrVXPg.chrome70-container');
        chatContainers.forEach(el => {
            el.style.setProperty('--center-content-max-width', maxWidth, 'important');
        });

        // 输入框区域、编辑器、聊天区内容容器
        const contentContainers = document.querySelectorAll('[class*="max-w-[var(--content-max-width)]"], .editor-container-FvjPyp, .editor-wrapper-aTMAEc, .custom-area-wrapper-eZ7eV6');
        contentContainers.forEach(el => {
            el.style.setProperty('max-width', maxWidth, 'important');
            el.style.setProperty('width', '100%', 'important');
        });
    }

    // ====== 深色模式表格样式 ======
    function applyDarkTableStyle() {
        const styleId = 'doubao-dark-table-style';
        if (currentTheme === 'dark') {
            if (!document.getElementById(styleId)) {
                const style = document.createElement('style');
                style.id = styleId;
                style.innerHTML = `
                    table thead th {
                        background-color: #2c2c2c !important;
                        color: #ffffff !important;
                        border-bottom: 1px solid #555 !important;
                    }
                    table, table th, table td {
                        border-color: #555 !important;
                    }
                    table td {
                        color: #eee !important;
                    }
                    table tbody tr:nth-child(even) {
                        background-color: #1f1f1f !important;
                    }
                    table tbody tr:nth-child(odd) {
                        background-color: #262626 !important;
                    }
                `;
                document.head.appendChild(style);
            }
        } else {
            const style = document.getElementById(styleId);
            if (style) style.remove();
        }
    }

    // ====== 开关按钮样式 ======
    function switchStyle() {
        return `
            position: fixed;
            padding: 6px 12px;
            border-radius: 20px;
            cursor: pointer;
            color: #fff;
            font-weight: bold;
            user-select: none;
            background: rgba(0,0,0,0.3);
            z-index: 9999;
        `;
    }

    // ====== 主题开关 ======
    const themeSwitch = document.createElement('div');
    themeSwitch.style.cssText = switchStyle() + 'right:20px; bottom:20px;';
    themeSwitch.addEventListener('click', () => {
        setDataTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });

    function updateThemeSwitch() {
        themeSwitch.innerText = currentTheme === 'dark' ? '🌙 深色模式' : '☀️ 浅色模式';
    }

    // ====== 宽屏开关 ======
    const widthSwitch = document.createElement('div');
    widthSwitch.style.cssText = switchStyle() + 'right:20px; bottom:60px;';
    widthSwitch.addEventListener('click', () => {
        setWideChat(!wideChat);
    });

    function updateWidthSwitch() {
        widthSwitch.innerText = wideChat ? '🖥️ 宽屏模式' : '🖥️ 默认宽度';
    }

    // ====== DOM 观察 ======
    const observer = new MutationObserver(() => {
        if (!document.body.contains(themeSwitch)) document.body.appendChild(themeSwitch);
        if (!document.body.contains(widthSwitch)) document.body.appendChild(widthSwitch);
        updateWidth();
    });
    observer.observe(document, { childList: true, subtree: true });

    // ====== 初始化 ======
    if (document.body) {
        document.body.appendChild(themeSwitch);
        document.body.appendChild(widthSwitch);
    }
    setDataTheme(currentTheme);
    setWideChat(wideChat);

})();
