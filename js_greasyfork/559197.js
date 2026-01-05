// ==UserScript==
// @name         用 DarkReader时,淘宝评论区的关闭按钮颜色问题
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  修复 Dark Reader 导致的淘宝页面 closeWrap 元素显示问题，使用强对比效果
// @author       os9sur
// @match        *://*.taobao.com/*
// @match        *://*.tmall.com/*
// @match        *://*.tmall.hk/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559197/%E7%94%A8%20DarkReader%E6%97%B6%2C%E6%B7%98%E5%AE%9D%E8%AF%84%E8%AE%BA%E5%8C%BA%E7%9A%84%E5%85%B3%E9%97%AD%E6%8C%89%E9%92%AE%E9%A2%9C%E8%89%B2%E9%97%AE%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/559197/%E7%94%A8%20DarkReader%E6%97%B6%2C%E6%B7%98%E5%AE%9D%E8%AF%84%E8%AE%BA%E5%8C%BA%E7%9A%84%E5%85%B3%E9%97%AD%E6%8C%89%E9%92%AE%E9%A2%9C%E8%89%B2%E9%97%AE%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 使用 filter: invert(1) 实现完全颜色反转
    const customStyle = `
//         .closeWrap--IAcEEbMy {
//             filter: invert(1) !important;
//             background-color: #ffffff !important;
//             border: 2px solid #ff4444 !important;
//             border-radius: 4px !important;
//             padding: 4px !important;
//         }
        .closeIcon--txvFIsZm {
            filter: invert(1) !important;
        }
        .closeWrap--cDsyoIEs{
            filter: invert(1) !important;
        }
    `;

    function applyStyle() {
        if (document.getElementById('tm-fix-style')) return;

        const style = document.createElement('style');
        style.id = 'tm-fix-style';
        style.textContent = customStyle;
        document.head.appendChild(style);
    }

    applyStyle();

    const observer = new MutationObserver(function(mutations) {
        applyStyle();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();