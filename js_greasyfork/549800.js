// ==UserScript==
// @name         移除百度搜索广告
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       zyl
// @match        https://*.baidu.com/*
// @grant        none
// @description 移除搜索结果广告
// @license MIT
// @run-at      document-start


// @downloadURL https://update.greasyfork.org/scripts/549800/%E7%A7%BB%E9%99%A4%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/549800/%E7%A7%BB%E9%99%A4%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const style = document.createElement('style');
    style.innerHTML = `
        .b_ad,
        .gp2k11k,[class="result c-container new-pmd"] {
            visibility: hidden !important;height:0px;
    display: none !important;overflow:hidden;
        }
    `;

    document.documentElement.appendChild(style);
})();
