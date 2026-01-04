// ==UserScript==
// @name                    ❀ 浮岚 Bilibili 自动深浅色
// @name:zh-TW              ❀ 浮嵐 Bilibili 自動深淺色
// @name:ja                 ❀ 浮嵐 Bilibili 自動ライト/ダーク
// @name:ko                 ❀ 부람 Bilibili 자동 라이트/다크
// @name:en                 ❀ Fulan Bilibili Auto Light/Dark
// @description             根据浏览器深浅色模式自动切换 B 站网页主题
// @description:zh-TW       根據瀏覽器深淺色模式自動切換 B 站網頁主題
// @description:ja          ブラウザのライト/ダークモードに応じて Bilibili のウェブテーマを自動切替
// @description:ko          브라우저의 라이트/다크 모드에 따라 Bilibili 웹 테마 자동 전환
// @description:en          Automatically switch Bilibili website theme based on browser light/dark mode
// @version      1.1
// @author       嵐 @ranburiedbyacat
// @namespace    https://bento.me/ranburiedbyacat
// @license      CC-BY-NC-SA-4.0
// @match        *://*.bilibili.com/*
// @compatible   Safari
// @compatible   Firefox
// @compatible   Chrome
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/554721/%E2%9D%80%20%E6%B5%AE%E5%B2%9A%20Bilibili%20%E8%87%AA%E5%8A%A8%E6%B7%B1%E6%B5%85%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/554721/%E2%9D%80%20%E6%B5%AE%E5%B2%9A%20Bilibili%20%E8%87%AA%E5%8A%A8%E6%B7%B1%E6%B5%85%E8%89%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const COOKIE_PATH = '/';
    const COOKIE_DOMAIN = '.bilibili.com';

    // 获取当前 theme_style cookie
    function getThemeCookie() {
        const match = document.cookie.match(/theme_style=(dark|light)/);
        return match ? match[1] : null;
    }

    // 设置 theme_style cookie 并刷新（仅在需要时）
    function setThemeCookieIfNeeded(isDark) {
        const current = getThemeCookie();
        const desired = isDark ? 'dark' : 'light';
        if (current !== desired) {
            document.cookie = `theme_style=${desired}; path=${COOKIE_PATH}; domain=${COOKIE_DOMAIN}`;
            console.log(`[AutoTheme] 切换 B站主题为: ${desired}`);
            location.reload();
        } else {
            console.log('[AutoTheme] 主题已与系统一致，无需刷新');
        }
    }

    // 系统是否偏好深色
    function systemPrefersDark() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    // 首次加载检查
    setThemeCookieIfNeeded(systemPrefersDark());

    // 监听系统主题变化
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', e => {
        setThemeCookieIfNeeded(e.matches);
    });

})();