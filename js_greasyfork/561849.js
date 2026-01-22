// ==UserScript==
// @name         微博首页直接跳转到最新微博
// @namespace    https://weibo.com/
// @version      1.1
// @description  微博首页强制重定向到指定群页面（修复重复刷新问题）
// @author       alstia
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
    
    // 新增：重定向状态锁，防止重复执行
    let isRedirecting = false;
    let timer = null;

    function redirect() {
        // 如果正在重定向或不在首页，直接返回
        if (isRedirecting || location.pathname !== '/' || location.search) {
            return;
        }
        
        // 确保不在目标页面
        if (location.href === TARGET) {
            return;
        }

        // 标记为正在重定向
        isRedirecting = true;
        clearTimeout(timer);
        
        // 增加轻微延迟，等待微博前端完全就绪
        timer = setTimeout(() => {
            // 双重检查，确保条件仍然满足
            if (location.pathname === '/' && !location.search && location.href !== TARGET) {
                location.replace(TARGET);
            } else {
                // 条件不满足时释放锁
                isRedirecting = false;
            }
        }, 50); // 稍微增加延迟到50ms，更稳定
    }

    // 页面首次加载
    redirect();

    // 监听History API
    ['pushState', 'replaceState'].forEach(method => {
        const original = history[method];
        history[method] = function (...args) {
            original.apply(history, args);
            // 延迟更长一点，等待微博路由完成
            setTimeout(redirect, 100);
        };
    });

    // 浏览器前进/后退按钮
    window.addEventListener('popstate', () => {
        setTimeout(redirect, 100);
    });
})();