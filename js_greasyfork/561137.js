// ==UserScript==
// @name         移除超星 mouseout 事件监听器（防自动暂停视频）
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  通过注入脚本到页面上下文来完全移除事件监听器
// @match        https://mooc1.chaoxing.com/*
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/561137/%E7%A7%BB%E9%99%A4%E8%B6%85%E6%98%9F%20mouseout%20%E4%BA%8B%E4%BB%B6%E7%9B%91%E5%90%AC%E5%99%A8%EF%BC%88%E9%98%B2%E8%87%AA%E5%8A%A8%E6%9A%82%E5%81%9C%E8%A7%86%E9%A2%91%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/561137/%E7%A7%BB%E9%99%A4%E8%B6%85%E6%98%9F%20mouseout%20%E4%BA%8B%E4%BB%B6%E7%9B%91%E5%90%AC%E5%99%A8%EF%BC%88%E9%98%B2%E8%87%AA%E5%8A%A8%E6%9A%82%E5%81%9C%E8%A7%86%E9%A2%91%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个脚本元素，直接注入到页面上下文中
    const script = document.createElement('script');
    script.textContent = `
        (function() {
            // 保存原始的 addEventListener
            const originalAdd = EventTarget.prototype.addEventListener;

            // 完全重写 addEventListener
            EventTarget.prototype.addEventListener = function(type, listener, options) {
                if (this === window && type === 'mouseout') {
                    // 阻止所有添加到 window 的 mouseout 事件
                    console.log('已阻止 window mouseout 事件监听器');
                    return;
                }
                return originalAdd.call(this, type, listener, options);
            };

            // 移除已存在的 onmouseout
            window.onmouseout = null;

            // 持续监控
            setInterval(function() {
                window.onmouseout = null;
            }, 1000);
        })();
    `;

    // 在文档头部插入脚本
    if (document.head) {
        document.head.appendChild(script);
    } else {
        document.documentElement.appendChild(script);
    }

    console.log('已注入脚本到页面上下文');
})();