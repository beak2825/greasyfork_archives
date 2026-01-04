// ==UserScript==
// @name         BiliDynTheme
// @name:zh-CN   Bilibili主题色自动切换
// @name:zh-TW   Bilibili主題色自動切換
// @namespace    http://tampermonkey.net/
// @version      2025-11-27
// @description  Keeps Bilibili’s theme in sync with your OS theme.
// @description:zh-CN 让Bilibili的主题与系统主题保持同步。
// @description:zh-TW 讓Bilibili的主題與系統主題保持同步。
// @author       Ethan Dong
// @match        https://*.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=256&domain=https://www.bilibili.com/
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554740/BiliDynTheme.user.js
// @updateURL https://update.greasyfork.org/scripts/554740/BiliDynTheme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const BG_URLS = {
        dark: '//i0.hdslb.com/bfs/static/stone-free/dyn-home/assets/bg_dark.png@1c.avif',
        light: '//i0.hdslb.com/bfs/static/stone-free/dyn-home/assets/bg.png@1c.avif'
    };

    const themeMedia = window.matchMedia('(prefers-color-scheme: dark)');

    function toggleTheme(e) {
        const isDark = e.matches;

        // 1. 切换 html 标签上的 class
        document.documentElement.classList.toggle("bili_dark", isDark);

        // 2. 设置 Cookie (带上 SameSite 和过期时间)
        document.cookie = `theme_style=${isDark ? "dark" : "light"}; path=/; domain=.bilibili.com; max-age=31536000; SameSite=Lax`;

        // 3. 切换背景图
        // 使用可选链 (?.)：只有当 querySelector 找到元素时，才会尝试修改 style
        document.querySelector("#app > div.bg")?.style.setProperty('background-image', `url("${isDark ? BG_URLS.dark : BG_URLS.light}")`);

        console.log(`[BiliDynTheme] Switched to ${isDark ? 'Dark' : 'Light'} mode.`);
    }

    // 绑定监听器
    themeMedia.addEventListener("change", toggleTheme);

    // 初始化执行
    toggleTheme(themeMedia);

})();