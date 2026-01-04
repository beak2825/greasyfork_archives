// ==UserScript==
// @name         移除贴吧搜索按钮
// @name:en      Remove Tieba's Search Button
// @name:zh-cn   移除贴吧搜索按钮
// @name:zh-tw   移除貼吧搜索按鈕
// @namespace    http://tampermonkey.net/
// @version      2025-09-03
// @description  Remove Tieba's search button
// @author       h453
// @match        https://tieba.baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @license      The Unlicense
// @downloadURL https://update.greasyfork.org/scripts/548220/%E7%A7%BB%E9%99%A4%E8%B4%B4%E5%90%A7%E6%90%9C%E7%B4%A2%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/548220/%E7%A7%BB%E9%99%A4%E8%B4%B4%E5%90%A7%E6%90%9C%E7%B4%A2%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const shit = () => document.querySelector("#selectsearch-icon")
    const callback = () => {
        if (shit()) shit().remove()
    }
    const observer = new MutationObserver(callback);
    observer.observe(document.querySelector("body"), {childList: true});
})();