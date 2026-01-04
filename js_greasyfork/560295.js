// ==UserScript==
// @name         雪球页面净化 (已修正语法)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  修正 CSS 选择器语法，去除右侧栏及 optional
// @author       Zengfeng
// @match        https://xueqiu.com/*
// @match        https://*.xueqiu.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560295/%E9%9B%AA%E7%90%83%E9%A1%B5%E9%9D%A2%E5%87%80%E5%8C%96%20%28%E5%B7%B2%E4%BF%AE%E6%AD%A3%E8%AF%AD%E6%B3%95%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560295/%E9%9B%AA%E7%90%83%E9%A1%B5%E9%9D%A2%E5%87%80%E5%8C%96%20%28%E5%B7%B2%E4%BF%AE%E6%AD%A3%E8%AF%AD%E6%B3%95%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 修复后的 CSS 选择器
    GM_addStyle(`
        /* 1. 隐藏目标元素 */
        .home__col--rt,
        .optional,
        .home__stock-index__box,
        .home__stock-index__slider,
        .nav__placeholder,
        .user__control__pannel,
        .taichi__bubble,
        .stickyFixed,
        #optional {
            display: none !important;
        }

        /* 2. 让主体容器和左侧栏撑满宽度 */
        /* .container 是外层大容器，如果不把 max-width 去掉，页面依然是窄的 */
        .home__layout {
            max-width: 100% !important;
            width: 95% !important; /* 留点边距更好看 */
            margin: 0 auto !important;
        }

        /* 3. 让左侧内容区宽度变为 100% */
        .home__col--mn {
            width: 100% !important;
            padding-right: 0 !important;
        }
    `);

    console.log("雪球净化：语法已修正，元素已隐藏。");
})();