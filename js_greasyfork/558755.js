// ==UserScript==
// @name         B站动态页面宽度调整
// @namespace    https://github.com/siemingsuan/some-script
// @version      1.0
// @description  因为你站旧版动态页面的宽度太小了，看着很不舒服，如果用了展示IP属地的脚本直接放不下，甚至转发视频的动态还没有新版……于是将t.bilibili.com页面中#app .content的宽度改为750px
// @icon    https://www.bilibili.com/favicon.ico
// @author       siemingsuan
// @match        https://t.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558755/B%E7%AB%99%E5%8A%A8%E6%80%81%E9%A1%B5%E9%9D%A2%E5%AE%BD%E5%BA%A6%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/558755/B%E7%AB%99%E5%8A%A8%E6%80%81%E9%A1%B5%E9%9D%A2%E5%AE%BD%E5%BA%A6%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建样式
    const style = document.createElement('style');
    style.innerHTML = `
        #app .content {
            width: 750px !important;
            max-width: 750px !important;
        }
    `;
     // 添加到文档头部
    document.head.appendChild(style);
})();
