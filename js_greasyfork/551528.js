// ==UserScript==
// @name         手机c001apk自动跳转
// @namespace    http://via
// @version      1.1
// @description  打开 coolapk.com 自动跳转到 coolmarket://
// @match        *://www.coolapk.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551528/%E6%89%8B%E6%9C%BAc001apk%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/551528/%E6%89%8B%E6%9C%BAc001apk%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    var url = location.href;
    var marketUrl = url.replace("https://www.coolapk.com", "coolmarket:/");
    location.href = marketUrl;
})();