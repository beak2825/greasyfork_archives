// ==UserScript==
// @name         tieba
// @namespace    http://tampermonkey.net/
// @version      2025-05-07
// @description  隐藏百度贴吧广告
// @author       You
// @match        https://tieba.baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=microsoft.com
// @grant        GM_log
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550919/tieba.user.js
// @updateURL https://update.greasyfork.org/scripts/550919/tieba.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_log("Init tieba");
    // 目标类名
    let targetClassNames = ['custom-custom-ad-container','ylh-ad-container'];

    // 隐藏广告函数
    function hideAdContainers() {
        targetClassNames.forEach(v=>{
            const adContainers = document.getElementsByClassName(v);
            for (let container of adContainers) {
                container.style.display = 'none';
                console.log('已隐藏广告容器:', container);
            }

            if (adContainers.length > 0) {
                console.log(`隐藏了 ${adContainers.length} 个广告容器`);
            }
        })
    }

    // 初始执行
    hideAdContainers();

    // 使用MutationObserver监听DOM变化
    const observer = new MutationObserver(function(mutations) {
        hideAdContainers();
    });

    // 开始观察DOM变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 监听history变化（应对SPA页面导航）
    let pushState = history.pushState;
    history.pushState = function() {
        pushState.apply(history, arguments);
        setTimeout(hideAdContainers, 100);
    };

    let replaceState = history.replaceState;
    history.replaceState = function() {
        replaceState.apply(history, arguments);
        setTimeout(hideAdContainers, 100);
    };

    window.addEventListener('popstate', function() {
        setTimeout(hideAdContainers, 100);
    });
})();