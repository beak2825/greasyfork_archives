// ==UserScript==
// @name         数字党校培训平台刷课脚本
// @namespace    https://jiaobenmiao.com/
// @version      2.0
// @description  该油猴脚本用于 数字党校培训平台 的辅助看课，脚本功能如下：自动点击继续播放按钮
// @author       脚本喵
// @match        https://zhdj.cumtb.edu.cn/*
// @grant        none
// @icon         https://jiaobenmiao.com/img/logo2.jpg
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555111/%E6%95%B0%E5%AD%97%E5%85%9A%E6%A0%A1%E5%9F%B9%E8%AE%AD%E5%B9%B3%E5%8F%B0%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/555111/%E6%95%B0%E5%AD%97%E5%85%9A%E6%A0%A1%E5%9F%B9%E8%AE%AD%E5%B9%B3%E5%8F%B0%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    setInterval(function () {
        let msg = document.querySelector("div.el-message-box__container ")
        if (msg && msg.innerText.indexOf("暂停") != -1) {
            if (document.querySelector("div.el-message-box__btns > button")) {
                document.querySelector("div.el-message-box__btns > button").click()
            }
        }
    }, 1000)


})();