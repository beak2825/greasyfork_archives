// ==UserScript==
// @name         花瓣 首次进入默认到关注
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  只在从外部进入花瓣首页/发现页时，自动跳转到 /follow，不影响站内点其他频道
// @match        https://huaban.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557958/%E8%8A%B1%E7%93%A3%20%E9%A6%96%E6%AC%A1%E8%BF%9B%E5%85%A5%E9%BB%98%E8%AE%A4%E5%88%B0%E5%85%B3%E6%B3%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/557958/%E8%8A%B1%E7%93%A3%20%E9%A6%96%E6%AC%A1%E8%BF%9B%E5%85%A5%E9%BB%98%E8%AE%A4%E5%88%B0%E5%85%B3%E6%B3%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const path = location.pathname;
    const ref = document.referrer || '';

    // 只在“从站外进来”时生效，站内跳转（referrer 是 huaban.com）不管
    const fromOutside = !ref.startsWith('https://huaban.com');

    // 只拦截这两种入口：根域名 /  和  发现 /discovery
    if (fromOutside && (path === '/' || path.startsWith('/discovery'))) {
        location.replace('https://huaban.com/follow');
    }

    // 不再加 MutationObserver，不再干预你站内点频道
})();
