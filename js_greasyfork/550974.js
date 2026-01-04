// ==UserScript==
// @name         Bilibili 直播 去马赛克脚本
// @namespace    http://tampermonkey.net/
// @version      2025-08-02
// @description  去除bilibili直播马赛克
// @author       You
// @match        https://live.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      GNU GPLv3

// @downloadURL https://update.greasyfork.org/scripts/550974/Bilibili%20%E7%9B%B4%E6%92%AD%20%E5%8E%BB%E9%A9%AC%E8%B5%9B%E5%85%8B%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/550974/Bilibili%20%E7%9B%B4%E6%92%AD%20%E5%8E%BB%E9%A9%AC%E8%B5%9B%E5%85%8B%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeMask() {
        const mask = document.getElementById('web-player-module-area-mask-panel');
        if (mask) {
            mask.remove();
        }
    }

    // 页面加载完成后执行
    window.addEventListener('load', removeMask);

    // 防止动态加载遗漏：定时器持续监听新增 video
    setInterval(removeMask, 2000);

})();