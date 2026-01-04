// ==UserScript==
// @name         学习公社刷课脚本
// @namespace    https://jiaobenmiao.com/
// @version      1.0
// @description  该油猴脚本用于 学习公社 的辅助看课，脚本功能如下：自动点击继续学习按钮
// @author       脚本喵
// @match        https://study.enaea.edu.cn/*
// @grant        none
// @icon         https://jiaobenmiao.com/img/logo2.jpg
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552654/%E5%AD%A6%E4%B9%A0%E5%85%AC%E7%A4%BE%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/552654/%E5%AD%A6%E4%B9%A0%E5%85%AC%E7%A4%BE%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    setInterval(function () {
        if (document.getElementsByClassName("dialog-box").length != 0) {
            console.log("检测到20分钟限制，去除限制");
            document.getElementsByClassName("dialog-button-container")[0].children[0].click();
        }
        console.log("检测中");
    }, 5000);
})();
