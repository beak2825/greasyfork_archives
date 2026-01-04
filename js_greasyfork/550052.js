// ==UserScript==
// @name         隐藏b站反广告tips
// @namespace    https://www.sumoli.com/
// @version      v1.0.0
// @description  这个插件可以隐藏b站的反广告tips，也就是首页最上边的橙色提示，包括修复了一些布局问题
// @author       红叶
// @match        *://www.bilibili.com/**
// @icon         https://i0.hdslb.com/bfs/static/jinkela/long/images/favicon.ico
// @grant        GM_addStyle
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/550052/%E9%9A%90%E8%97%8Fb%E7%AB%99%E5%8F%8D%E5%B9%BF%E5%91%8Atips.user.js
// @updateURL https://update.greasyfork.org/scripts/550052/%E9%9A%90%E8%97%8Fb%E7%AB%99%E5%8F%8D%E5%B9%BF%E5%91%8Atips.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const style = `
        .adblock-tips{
            display:none !important;
        }
        .recommended-container_floor-aside .container>*:nth-of-type(n + 8){
            margin-top: 0;
        }
        .recommended-container_floor-aside .container.is-version8>*:nth-of-type(n + 13){
            margin-top: 0;
        }

    `
    GM_addStyle(style)
})();