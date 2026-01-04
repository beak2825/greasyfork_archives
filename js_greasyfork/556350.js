// ==UserScript==
// @license MIT
// @name         B站 隐藏热搜模块（全面）
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  隐藏 B站 各子域名中 “热搜”头部 + 热搜条目 + 热搜bar
// @match        https://*.bilibili.com/*
// @match        http://*.bilibili.com/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/556350/B%E7%AB%99%20%E9%9A%90%E8%97%8F%E7%83%AD%E6%90%9C%E6%A8%A1%E5%9D%97%EF%BC%88%E5%85%A8%E9%9D%A2%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/556350/B%E7%AB%99%20%E9%9A%90%E8%97%8F%E7%83%AD%E6%90%9C%E6%A8%A1%E5%9D%97%EF%BC%88%E5%85%A8%E9%9D%A2%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';


    GM_addStyle(`
        .header .title,
        .header {
            display: none !important;
        }
        .trendings-col .trending-item,
        .trendings-col {
            display: none !important;
        }
        .hot-search-bar,
        .search-trend-bar,
        .trendings-bar,
        .hot-searches,
        [class*="hotSearch"],
        [class*="trendBar"],
        [data-module="hotSearchBar"] {
            display: none !important;
        }
    `);


    function removeHot() {
        const el = document.querySelector('.bili-dyn-search-trendings');
        if (el) {
            el.remove();
            return true;
        }
        return false;
    }


    removeHot();


    const observer = new MutationObserver((mutations, obs) => {
        if (removeHot()) {
            obs.disconnect();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();
