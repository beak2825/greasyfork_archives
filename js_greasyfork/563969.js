// ==UserScript==
// @name                Zhihu.com Dark Mode 2
// @name:zh-CN          知乎黑暗模式-改2
// @name:zh-TW          知乎黑暗模式-改2
// @namespace           https://www.zhihu.com/
// @version             0.1
// @description         Enable Zhihu.com Dark Mode Mod
// @description:zh-CN   开启知乎黑暗模式
// @description:zh-TW   开启知乎黑暗模式
// @author              call duck
// @match               *://*.zhihu.com/*
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/563969/Zhihucom%20Dark%20Mode%202.user.js
// @updateURL https://update.greasyfork.org/scripts/563969/Zhihucom%20Dark%20Mode%202.meta.js
// ==/UserScript==

(function () {
    'use strict';
        const ignoreList = [
        'link.zhihu.com',
        'video.zhihu.com',
        'www.zhihu.com/pub/book',
        'www.zhihu.com/tardis',
    ];
 
    const checkURL = (url) => {
        for (const u of ignoreList) {
            if (url.indexOf(u) !== -1) {
                return false
            }
        }
        return true;
    };

// 获取特定名称的 cookie 值
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    // 设置 cookie
    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        // 注意：设置在 .zhihu.com 域名下确保全站生效
        document.cookie = `${name}=${value}${expires}; path=/; domain=.zhihu.com`;
    }

    const currentTheme = getCookie('theme');

    // 如果 theme 不存在或者不等于 dark
    if (checkURL(location.href) && currentTheme !== 'dark') {
        setCookie('theme', 'dark', 365); // 设置有效期一年
        window.location.reload(); // 刷新页面使配置生效
    }
    
})();
