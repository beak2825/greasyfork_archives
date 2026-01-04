// ==UserScript==
// @name         斗鱼精简画面
// @author       uerax
// @license      MIT
// @version      0.0.4
// @description  斗鱼礼物栏和画中画删除
// @match        *://*.douyu.com/g_*
// @match        *://*.douyu.com/0*
// @match        *://*.douyu.com/1*
// @match        *://*.douyu.com/2*
// @match        *://*.douyu.com/3*
// @match        *://*.douyu.com/4*
// @match        *://*.douyu.com/5*
// @match        *://*.douyu.com/6*
// @match        *://*.douyu.com/7*
// @match        *://*.douyu.com/8*
// @match        *://*.douyu.com/9*
// @match        *://*.douyu.com/directory/myFollow
// @match        *://*.douyu.com/topic/*
// @match        *://*.douyu.com/beta/*
// @icon         https://www.douyu.com/favicon.ico
// @require      https://code.jquery.com/jquery-2.2.4.min.js
// @run-at       document-end
// @namespace https://greasyfork.org/users/1552297
// @downloadURL https://update.greasyfork.org/scripts/560163/%E6%96%97%E9%B1%BC%E7%B2%BE%E7%AE%80%E7%94%BB%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/560163/%E6%96%97%E9%B1%BC%E7%B2%BE%E7%AE%80%E7%94%BB%E9%9D%A2.meta.js
// ==/UserScript==



(function() {
    'use strict';

    // 3. 定义删除逻辑并循环执行（应对异步加载和换房不刷新的情况）
    setInterval(() => {
        const giftBar = document.querySelector('[class*="interactive__"]');
        if (giftBar) {
            giftBar.remove();
        }
    }, 1000);

    // 4. 注入 CSS 修复变量和位置
    const style = document.createElement('style');
    style.innerHTML = `


        /* 强制视频和流容器触底 */
        [class^="stream__"], .layout-Player-video, .layout-Player-barrage {
            bottom: 0px !important;
        }
    `;
    document.head.appendChild(style);



})();