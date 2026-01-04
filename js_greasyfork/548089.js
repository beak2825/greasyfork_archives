// ==UserScript==
// @name         雪球头部修改
// @namespace    http://tampermonkey.net/
// @version      2025-09-03
// @description  雪球头部修改You
// @author       imzhi <yxz_blue@126.com>
// @match        https://xueqiu.com/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xueqiu.com
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548089/%E9%9B%AA%E7%90%83%E5%A4%B4%E9%83%A8%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/548089/%E9%9B%AA%E7%90%83%E5%A4%B4%E9%83%A8%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var jq = $.noConflict();
    // jq('.nav.stickyFixed').css('background-color', 'red');
    // jq('.container').css('background-color', 'red');
    jq('.nav__logo').hide();
})();