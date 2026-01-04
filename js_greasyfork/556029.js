// ==UserScript==
// @name         优酷弹幕刷新
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  每3分钟自动点击弹幕开关两次，间隔1秒.
// @match        *://v.youku.com/*
// @match        *://*.youku.com/v_*
// @match        *://*.youku.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556029/%E4%BC%98%E9%85%B7%E5%BC%B9%E5%B9%95%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/556029/%E4%BC%98%E9%85%B7%E5%BC%B9%E5%B9%95%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clickTwice() {
        const btn = document.getElementById('barrage-switch');
        if (btn) {
            console.log('执行弹幕刷新');
            btn.click(); // 第一次点击
            setTimeout(() => btn.click(), 500); // 第二次点击
        }
    }

    // 页面加载后启动定时器
    function init() {
        // 立即执行一次
        clickTwice();
        // 每3分钟执行一次
        setInterval(clickTwice, 3 * 60 * 1000);
        console.log('弹幕自动刷新已启动');
    }

    // 延迟初始化，确保页面加载完成
    setTimeout(init, 3000);
})();