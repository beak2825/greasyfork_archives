// ==UserScript==
// @name         CSQAQ网站自动点击关闭广告按钮（全站版）
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  自动定位并点击csqaq.com所有页面的关闭广告按钮（class前缀transparentButton___）
// @author       你
// @match        https://csqaq.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csqaq.com
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559912/CSQAQ%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%85%B3%E9%97%AD%E5%B9%BF%E5%91%8A%E6%8C%89%E9%92%AE%EF%BC%88%E5%85%A8%E7%AB%99%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/559912/CSQAQ%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%85%B3%E9%97%AD%E5%B9%BF%E5%91%8A%E6%8C%89%E9%92%AE%EF%BC%88%E5%85%A8%E7%AB%99%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 核心函数：查找并点击关闭广告按钮
    function clickCloseAdButton() {
        // 通过class前缀匹配关闭广告按钮
        const closeButton = document.querySelector('div[class^="transparentButton___"]');
        if (closeButton) {
            closeButton.click(); // 模拟用户点击
            console.log("已自动点击关闭广告按钮");
            return true;
        }
        return false;
    }

    // 带重试机制的执行函数
    // maxRetry：最大重试次数，interval：重试间隔(ms)
    function autoClickWithRetry(maxRetry = 15, interval = 300) {
        let retryCount = 0;
        const timer = setInterval(() => {
            const isClicked = clickCloseAdButton();
            retryCount++;

            // 点击成功或达到最大重试次数，停止定时器
            if (isClicked || retryCount >= maxRetry) {
                clearInterval(timer);
                if (retryCount >= maxRetry) {
                    console.log("未找到关闭广告按钮，已停止重试");
                }
            }
        }, interval);
    }

    // 监听DOM变化，应对动态加载的按钮
    const domObserver = new MutationObserver(() => {
        clickCloseAdButton();
    });

    // 页面加载完成后启动逻辑
    function initAdClicker() {
        // 立即执行一次点击检测
        clickCloseAdButton();
        // 启动重试机制
        autoClickWithRetry();
        // 监听body的DOM变化（子元素新增/删除）
        domObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 适配单页应用（SPA）的路由变化，重新执行逻辑
    let lastHref = window.location.href;
    setInterval(() => {
        if (window.location.href !== lastHref) {
            lastHref = window.location.href;
            initAdClicker(); // 路由变化后重新初始化
        }
    }, 500);

    // 初始加载执行
    window.addEventListener('load', initAdClicker);
    // 若页面提前加载完成，直接执行
    if (document.readyState === 'complete') {
        initAdClicker();
    }
})();