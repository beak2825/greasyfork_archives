// ==UserScript==
// @name         修正谷歌中国重定向
// @namespace    http://tampermonkey.net/
// @version      2025-11-19
// @description  中国大陆访问https://www.google.com时总是被重定向到https://www.google.cn/m，此脚本可以简单粗暴地再次重定向至https://google.com.hk以解决无法使用的问题。
// @author       shiraha
// @match        https://google.cn/m
// @match        https://www.google.cn/m
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      free
// @downloadURL https://update.greasyfork.org/scripts/556269/%E4%BF%AE%E6%AD%A3%E8%B0%B7%E6%AD%8C%E4%B8%AD%E5%9B%BD%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/556269/%E4%BF%AE%E6%AD%A3%E8%B0%B7%E6%AD%8C%E4%B8%AD%E5%9B%BD%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

(function() {
    document.location.href = document.location.href.replace('https://google.cn/m','https://google.com.hk').replace('https://www.google.cn/m','https://google.com.hk');
})();