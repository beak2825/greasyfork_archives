// ==UserScript==
// @name         Bilibili 搜索游客模式（去个性化）
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  拦截Bilibili搜索API请求，移除登录Cookie，实现游客（非个性化）搜索结果
// @author       a11034
// @match        https://search.bilibili.com/*
// @license      GPL-3.0-or-later
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563726/Bilibili%20%E6%90%9C%E7%B4%A2%E6%B8%B8%E5%AE%A2%E6%A8%A1%E5%BC%8F%EF%BC%88%E5%8E%BB%E4%B8%AA%E6%80%A7%E5%8C%96%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/563726/Bilibili%20%E6%90%9C%E7%B4%A2%E6%B8%B8%E5%AE%A2%E6%A8%A1%E5%BC%8F%EF%BC%88%E5%8E%BB%E4%B8%AA%E6%80%A7%E5%8C%96%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 登录相关的Cookie键（移除这些即可实现游客模式）
    const loginCookieKeys = ['SESSDATA', 'bili_jct', 'DedeUserID', 'DedeUserID__ckMd5', 'sid'];

    // 获取游客Cookie字符串（保留buvid3等必要设备Cookie，移除登录相关）
    function getGuestCookieString() {
        const cookies = document.cookie.split(';');
        const cookieMap = new Map();
        cookies.forEach(cookie => {
            const [key, ...valParts] = cookie.trim().split('=');
            if (key) {
                cookieMap.set(key, valParts.join('='));
            }
        });
        // 移除登录键
        loginCookieKeys.forEach(key => cookieMap.delete(key));

        if (cookieMap.size === 0) return '';

        return Array.from(cookieMap.entries())
            .map(([key, val]) => `${key}=${val}`)
            .join('; ');
    }

    // 保存原生fetch
    const originalFetch = window.fetch;

    // 重写fetch
    window.fetch = async function (input, init = {}) {
        const url = typeof input === 'string' ? input : input.url || '';

        // 只拦截Bilibili搜索API（综合 + 分类）
        if (url.includes('api.bilibili.com/x/web-interface/wbi/search')) {
            const guestCookie = getGuestCookieString();
            console.log('%c[脚本触发] 拦截搜索API:', 'color: green; font-weight: bold;', url);
            // 新init：强制omit credentials，手动设置游客Cookie
            const newInit = {
                ...init,
                credentials: 'omit',// 不携带任何页面Cookie
            };
            console.log('%c[游客Cookie]', 'color: blue;', guestCookie || '（无Cookie）');
            console.log('%c[原Cookie]', 'color: orange;', document.cookie);

            // 处理headers
            const originalHeaders = new Headers(init.headers || {});
            if (guestCookie) {
                originalHeaders.set('Cookie', guestCookie);
            } else {
                originalHeaders.delete('Cookie');
            }
            newInit.headers = originalHeaders;

            // 如果input是Request对象，重建一个
            if (input instanceof Request) {
                const newRequest = new Request(input, newInit);
                return originalFetch.call(this, newRequest);
            }

            return originalFetch.call(this, url, newInit);
        }
        console.log('%c[Bilibili去个性化脚本] 已加载', 'color: purple; font-size: 16px;');
        // 非搜索API，直接走原生
        return originalFetch.call(this, input, init);
    };
})();