// ==UserScript==
// @name         知乎增强：重定向首页 + 屏蔽干扰元素
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  自动跳转到关注页，并屏蔽热搜、指定广告/推荐模块
// @author       You
// @match        https://www.zhihu.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/561596/%E7%9F%A5%E4%B9%8E%E5%A2%9E%E5%BC%BA%EF%BC%9A%E9%87%8D%E5%AE%9A%E5%90%91%E9%A6%96%E9%A1%B5%20%2B%20%E5%B1%8F%E8%94%BD%E5%B9%B2%E6%89%B0%E5%85%83%E7%B4%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/561596/%E7%9F%A5%E4%B9%8E%E5%A2%9E%E5%BC%BA%EF%BC%9A%E9%87%8D%E5%AE%9A%E5%90%91%E9%A6%96%E9%A1%B5%20%2B%20%E5%B1%8F%E8%94%BD%E5%B9%B2%E6%89%B0%E5%85%83%E7%B4%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =============== 功能 1：注入 CSS 隐藏干扰元素 ===============
    GM_addStyle(`
        /* 隐藏特定 class 元素（如推荐卡片、广告等） */
        .css-51utkw {
            display: none !important;
        }

        /* 隐藏热搜区域 */
        div[class*="HotSearchCard-list"] {
            display: none !important;
        }
    `);

    // =============== 功能 2：首页自动跳转到 /follow ===============
    if (window.location.pathname === '/') {
        // 检查是否处于知乎的安全验证页（避免跳转导致无法验证）
        const isSecurityCheckPage = (
            document.title.includes('安全验证') ||
            !!document.querySelector('[aria-label="点击按钮进行验证"]') ||
            !!document.querySelector('.UnhumanVerifyWrapper') // 知乎验证页常见容器
        );

        if (!isSecurityCheckPage) {
            // 使用 replace 避免产生历史记录
            window.location.replace('https://www.zhihu.com/follow');
        }
    }
})();