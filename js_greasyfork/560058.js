// ==UserScript==
// @name         b 站加大目录长度
// @version      1.2
// @license      MIT
// @description  加大目录长度,并删除顶部广告
// @author       白夜
// @match        *://*.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @namespace https://greasyfork.org/users/1486583
// @downloadURL https://update.greasyfork.org/scripts/560058/b%20%E7%AB%99%E5%8A%A0%E5%A4%A7%E7%9B%AE%E5%BD%95%E9%95%BF%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/560058/b%20%E7%AB%99%E5%8A%A0%E5%A4%A7%E7%9B%AE%E5%BD%95%E9%95%BF%E5%BA%A6.meta.js
// ==/UserScript==
(function() {
    'use strict';
    document.querySelector("#mirror-vdcon > div.right-container > div > div.rcmd-tab > div > div.video-pod__body").style.maxHeight='50vh';
    document.querySelector("#slide_ad").style.display = 'none';
})();