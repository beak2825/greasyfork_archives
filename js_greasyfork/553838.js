// ==UserScript==
// @name         移除bilibili直播间马赛克
// @namespace    http://tampermonkey.net/
// @version      2025-10-27
// @description  阿姨闹麻了
// @author       You
// @match        https://live.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553838/%E7%A7%BB%E9%99%A4bilibili%E7%9B%B4%E6%92%AD%E9%97%B4%E9%A9%AC%E8%B5%9B%E5%85%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/553838/%E7%A7%BB%E9%99%A4bilibili%E7%9B%B4%E6%92%AD%E9%97%B4%E9%A9%AC%E8%B5%9B%E5%85%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const element = document.createElement('style');
    element.innerHTML = '#web-player-module-area-mask-panel{opacity: 0;}';
    document.head.append(element);
})();