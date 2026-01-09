// ==UserScript==
// @name         微博首页直接跳转到最新微博
// @namespace    https://weibo.com/
// @version      1.0
// @description  微博首页强制重定向到指定群页面
// @author       You
// @match        https://weibo.com/*
// @license      MIT
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561849/%E5%BE%AE%E5%8D%9A%E9%A6%96%E9%A1%B5%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC%E5%88%B0%E6%9C%80%E6%96%B0%E5%BE%AE%E5%8D%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/561849/%E5%BE%AE%E5%8D%9A%E9%A6%96%E9%A1%B5%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC%E5%88%B0%E6%9C%80%E6%96%B0%E5%BE%AE%E5%8D%9A.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const TARGET = 'https://weibo.com/mygroups?gid=11000**********';

    /* 立即执行重定向（防抖 500 ms） */
    let timer = null;
    function redirect() {
        if (location.pathname === '/' && !location.search && location.href !== TARGET) {
            clearTimeout(timer);
            timer = setTimeout(() => location.replace(TARGET), 0);
        }
    }

    /* 页面首次加载 */
    redirect();

    /* 监听微博前端把 pathname 改回 '/'（History API） */
    ['pushState', 'replaceState'].forEach(method => {
        const original = history[method];
        history[method] = function (...args) {
            original.apply(history, args);
            setTimeout(redirect, 0); // 等微博改完再检查
        };
    });

    /* 浏览器前进 / 后退按钮 */
    window.addEventListener('popstate', redirect);
})();