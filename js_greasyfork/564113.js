// ==UserScript==
// @name         Linux.do 授权登录自动允许
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      0.0.1
// @description  在 connect.linux.do 页面检测到“允许”按钮时自动点击
// @author       caolib
// @match        https://connect.linux.do/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/564113/Linuxdo%20%E6%8E%88%E6%9D%83%E7%99%BB%E5%BD%95%E8%87%AA%E5%8A%A8%E5%85%81%E8%AE%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/564113/Linuxdo%20%E6%8E%88%E6%9D%83%E7%99%BB%E5%BD%95%E8%87%AA%E5%8A%A8%E5%85%81%E8%AE%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义目标按钮的选择器：匹配 href 包含 /oauth2/approve/ 的链接
    const targetSelector = 'a[href*="/oauth2/approve/"]';

    // 尝试点击函数
    function tryClick() {
        const btn = document.querySelector(targetSelector);
        if (btn) {
            console.log('检测到“允许”按钮，正在点击...');
            btn.click();
            return true;
        }
        return false;
    }

    // 1. 页面加载完成后立即尝试
    if (!tryClick()) {
        // 2. 如果按钮尚未出现（可能是动态加载），使用观察器监听
        const observer = new MutationObserver((mutations) => {
            if (tryClick()) {
                observer.disconnect(); // 点击成功后停止监听
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
})();