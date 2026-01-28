// ==UserScript==
// @name         TAPD搜索迭代时按Enter触发搜索
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  TAPD搜索迭代时每次都需要用鼠标点击按钮，太蠢了
// @author       RWH
// @license      MIT License
// @match        https://www.tapd.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tapd.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564294/TAPD%E6%90%9C%E7%B4%A2%E8%BF%AD%E4%BB%A3%E6%97%B6%E6%8C%89Enter%E8%A7%A6%E5%8F%91%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/564294/TAPD%E6%90%9C%E7%B4%A2%E8%BF%AD%E4%BB%A3%E6%97%B6%E6%8C%89Enter%E8%A7%A6%E5%8F%91%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener("keydown", (e) => {
        if(e.code == "Enter"){
            if(e.target.offsetParent.classList.contains("tapd-filter-item--keyword")){
                const button = document.querySelector(".iteration-filter .iteration-filter__footer .agi-button--default")
                button.click()
            }
        }
    }, false)
    // Your code here...
})();