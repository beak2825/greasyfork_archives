// ==UserScript==
// @name         自动点击立即领取（只点一次）
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自动检测并点击 span 标签中含有“立即领取”的按钮（只执行一次）
// @author       You
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/549813/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%AB%8B%E5%8D%B3%E9%A2%86%E5%8F%96%EF%BC%88%E5%8F%AA%E7%82%B9%E4%B8%80%E6%AC%A1%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/549813/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%AB%8B%E5%8D%B3%E9%A2%86%E5%8F%96%EF%BC%88%E5%8F%AA%E7%82%B9%E4%B8%80%E6%AC%A1%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 每 200ms 检查一次
    const timer = setInterval(() => {
        let spans = document.querySelectorAll("span");

        for (let span of spans) {
            if (span.innerText.includes("立即领取")) {
                console.log("发现 '立即领取' 按钮，点击一次后停止...");
                span.click(); // 点击
                console.log("点击了一次")
                clearInterval(timer); // 停止定时器，保证只点击一次
                return;
            }
        }
    }, 200);
})();
