// ==UserScript==
// @name         盗版IDM关闭警告页
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  关闭盗版IDM不时弹出警告页
// @author       lulu
// @match        *://www.internetdownloadmanager.com/download2.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=internetdownloadmanager.com
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554935/%E7%9B%97%E7%89%88IDM%E5%85%B3%E9%97%AD%E8%AD%A6%E5%91%8A%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/554935/%E7%9B%97%E7%89%88IDM%E5%85%B3%E9%97%AD%E8%AD%A6%E5%91%8A%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.stop(); // 立即停止加载资源
    // Your code here...
    window.close();
})();