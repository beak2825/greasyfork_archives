// ==UserScript==
// @name         IT之家首页广告移除
// @namespace    http://tampermonkey.net/
// @version      2025-12-08
// @description  IT之家首页广告移除，不确定其他页面，懒得试了
// @author       FC
// @license      MIT
// @include      *://*.ithome.com/*
// @match        *://*.ithome.com/*
// @icon         https://www.ithome.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558313/IT%E4%B9%8B%E5%AE%B6%E9%A6%96%E9%A1%B5%E5%B9%BF%E5%91%8A%E7%A7%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/558313/IT%E4%B9%8B%E5%AE%B6%E9%A6%96%E9%A1%B5%E5%B9%BF%E5%91%8A%E7%A7%BB%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('.ad').parent('li').remove();
})();