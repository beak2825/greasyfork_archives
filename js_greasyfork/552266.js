// ==UserScript==
// @name         mdpr.jp 自動跳轉 /news/
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自動將 /news/ 快速重定向到 /news/detail/
// @match        https://mdpr.jp/news/*
// @exclude      https://mdpr.jp/news/detail/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552266/mdprjp%20%E8%87%AA%E5%8B%95%E8%B7%B3%E8%BD%89%20news.user.js
// @updateURL https://update.greasyfork.org/scripts/552266/mdprjp%20%E8%87%AA%E5%8B%95%E8%B7%B3%E8%BD%89%20news.meta.js
// ==/UserScript==

(function() {
    'use strict';
        location.replace(location.pathname.replace('/news/', '/news/detail/'));
})();
