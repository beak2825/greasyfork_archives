// ==UserScript==
// @name         鼠标悬浮在热搜时显示全部文字
// @namespace    http://tampermonkey.net/
// @version      2025-10-01-2
// @description  鼠标悬浮在词条上时会显示完整的文字
// @author       You
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551228/%E9%BC%A0%E6%A0%87%E6%82%AC%E6%B5%AE%E5%9C%A8%E7%83%AD%E6%90%9C%E6%97%B6%E6%98%BE%E7%A4%BA%E5%85%A8%E9%83%A8%E6%96%87%E5%AD%97.user.js
// @updateURL https://update.greasyfork.org/scripts/551228/%E9%BC%A0%E6%A0%87%E6%82%AC%E6%B5%AE%E5%9C%A8%E7%83%AD%E6%90%9C%E6%97%B6%E6%98%BE%E7%A4%BA%E5%85%A8%E9%83%A8%E6%96%87%E5%AD%97.meta.js
// ==/UserScript==

(function() {
    'use strict';
    addEventListener("load",()=>{
        // 选择需要观察变动的节点
        const root = document.querySelector(".center-search-container");

        // 观察器的配置（需要观察什么变动）
        const config = { attributes: true, childList: true, subtree: true };

        // 当观察到变动时执行的回调函数
        const callback = function (mutationsList, observer) {
            // Use traditional 'for loops' for IE 11
            for (let mutation of mutationsList) {
                if (mutation.type === "childList") {
                    const trending_items = root.querySelectorAll(".trending-item")

                    if(trending_items.length === 0 ){
                        return
                    }

                    trending_items.forEach(item=>{
                        const text = item.querySelector(".trending-text").textContent
                        item.title = text
                    })

                    observer.disconnect();
                }
            }
        };

        // 创建一个观察器实例并传入回调函数
        const observer = new MutationObserver(callback);

        // 以上述配置开始观察目标节点
        observer.observe(root, config);

    })
})();