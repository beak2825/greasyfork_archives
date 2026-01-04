// ==UserScript==
// @name         91cg全局屏蔽adspop广告div
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  匹配所有网站，自动删除class为adspop的div广告元素
// @author       你
// @match        *://*/*
// @exclude      chrome://*/*
// @exclude      edge://*/*
// @exclude      about:*
// @exclude      moz-extension://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559921/91cg%E5%85%A8%E5%B1%80%E5%B1%8F%E8%94%BDadspop%E5%B9%BF%E5%91%8Adiv.user.js
// @updateURL https://update.greasyfork.org/scripts/559921/91cg%E5%85%A8%E5%B1%80%E5%B1%8F%E8%94%BDadspop%E5%B9%BF%E5%91%8Adiv.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. CSS提前隐藏，防止广告闪烁
    GM_addStyle(`
        div.adspop {
            display: none !important;
            visibility: hidden !important;
            width: 0 !important;
            height: 0 !important;
            opacity: 0 !important;
            z-index: -9999 !important;
        }
    `);

    // 2. 核心函数：删除adspop广告元素
    function removeAdspopDiv() {
        // 选择所有class为adspop的div元素
        const adElements = document.querySelectorAll('div.adspop');
        if (adElements.length > 0) {
            adElements.forEach(el => {
                el.remove(); // 直接从DOM中移除
                console.log(`已移除adspop广告元素：`, el);
            });
            return true;
        }
        return false;
    }

    // 3. 带重试机制的执行函数，处理延迟加载的广告
    function autoRemoveWithRetry(maxRetry = 20, interval = 400) {
        let retryCount = 0;
        const timer = setInterval(() => {
            const isRemoved = removeAdspopDiv();
            retryCount++;

            // 移除成功或达到最大重试次数，停止定时器
            if (isRemoved || retryCount >= maxRetry) {
                clearInterval(timer);
                if (retryCount >= maxRetry) {
                    console.log('未检测到adspop广告元素，已停止重试');
                }
            }
        }, interval);
    }

    // 4. 监听DOM变化，应对动态渲染的广告
    const domObserver = new MutationObserver((mutations) => {
        mutations.forEach(() => {
            removeAdspopDiv();
        });
    });

    // 5. 页面加载完成后初始化
    function initAdRemover() {
        // 立即执行一次移除操作
        removeAdspopDiv();
        // 启动重试机制
        autoRemoveWithRetry();
        // 监听body的DOM变化（子元素新增/删除/属性修改）
        if (document.body) {
            domObserver.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true
            });
        }
    }

    // 适配SPA单页应用，路由变化时重新执行
    let lastHref = window.location.href;
    setInterval(() => {
        if (window.location.href !== lastHref) {
            lastHref = window.location.href;
            initAdRemover();
        }
    }, 500);

    // 页面加载完成执行初始化
    window.addEventListener('load', initAdRemover);
    // 若页面已加载完成，直接执行
    if (document.readyState === 'complete') {
        initAdRemover();
    }
})();