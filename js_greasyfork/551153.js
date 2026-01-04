// ==UserScript==
// @name         Sonkwo Link to Steam
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  给杉果添加Steam链接
// @author       WK
// @match        https://www.sonkwo.hk/sku/*
// @run-at document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sonkwo.hk
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551153/Sonkwo%20Link%20to%20Steam.user.js
// @updateURL https://update.greasyfork.org/scripts/551153/Sonkwo%20Link%20to%20Steam.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function checkAndExecute() {
        var skuEnNameElement = document.querySelector(".sku-en-name");
        if (skuEnNameElement) {
            var gname = skuEnNameElement.innerHTML;
            if (!skuEnNameElement.querySelector('a')) {
                 skuEnNameElement.innerHTML = "<a href='https://store.steampowered.com/search?term=" + encodeURIComponent(gname) + "' target='_blank'>" + gname + "</a>";
            }
            clearInterval(checkInterval);

        } else {
            console.log("等待 .sku-en-name 元素加载...");
        }
    }

    var checkInterval = setInterval(checkAndExecute, 500);
    var checkCount = 0;

    var maxChecks = 20;

    var intervalStopper = setInterval(function() {
        checkCount++;
        if (checkCount >= maxChecks) {
            clearInterval(checkInterval);
            clearInterval(intervalStopper);
            console.error("在规定时间内未找到 .sku-en-name 元素，脚本停止。");
        }
    }, 500);

})();