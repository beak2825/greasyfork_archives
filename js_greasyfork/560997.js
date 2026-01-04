// ==UserScript==
// @name         B站深色模式自动切换
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  根据系统主题自动修改 Bilibili 的 theme_style Cookie
// @author       此为genimi3flash自动生成
// @match        *://*.bilibili.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560997/B%E7%AB%99%E6%B7%B1%E8%89%B2%E6%A8%A1%E5%BC%8F%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/560997/B%E7%AB%99%E6%B7%B1%E8%89%B2%E6%A8%A1%E5%BC%8F%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 设置 Cookie 的工具函数
    function setBiliCookie(value) {
        // 设置有效期为 1 年，路径为 /，域名为 .bilibili.com
        const expires = new Date();
        expires.setTime(expires.getTime() + (365 * 24 * 60 * 60 * 1000));
        document.cookie = `theme_style=${value}; expires=${expires.toUTCString()}; path=/; domain=.bilibili.com`;
    }

    // 获取当前 Cookie 值的工具函数
    function getBiliCookie() {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; theme_style=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    function syncTheme(isDark) {
        const targetTheme = isDark ? 'dark' : 'light';
        const currentTheme = getBiliCookie();

        if (currentTheme !== targetTheme) {
            console.log(`[主题助手] 检测到系统偏好为 ${targetTheme}，正在同步...`);
            setBiliCookie(targetTheme);
            // 修改完 Cookie 后，通常需要刷新页面才能让服务端/前端重新渲染对应样式
            location.reload();
        }
    }

    // 1. 初始化检查
    syncTheme(darkModeMediaQuery.matches);

    // 2. 监听系统实时切换（例如你在 Windows 设置里从浅色切到深色）
    darkModeMediaQuery.addEventListener('change', (e) => {
        syncTheme(e.matches);
    });
})();