// ==UserScript==
// @name         TheBoringXiaohongshuInfoBlocker
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  通过CSS注入优雅地隐藏小红书页面底部的app-info与divider元素
// @author       FotixChiang feat.ChatGPT
// @match        *://www.xiaohongshu.com/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/553446/TheBoringXiaohongshuInfoBlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/553446/TheBoringXiaohongshuInfoBlocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.id = 'hide-xhs-app-info-style';
    style.textContent = `
        /* 隐藏底部 App 下载提示及分隔线 */
        .app-info,
        .divider {
            display: none !important;
            visibility: hidden !important;
        }
    `;

    // 在页面开始加载时尽早插入样式
    const insertStyle = () => {
        if (!document.head.contains(style)) {
            document.head.appendChild(style);
        }
    };

    // 尝试立即注入，如head未加载则等待
    if (document.head) {
        insertStyle();
    } else {
        new MutationObserver((mutations, observer) => {
            if (document.head) {
                insertStyle();
                observer.disconnect();
            }
        }).observe(document.documentElement, { childList: true });
    }
})();
