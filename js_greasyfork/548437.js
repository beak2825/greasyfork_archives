// ==UserScript==
// @name         自动点击立即领取
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动检测并点击 span 标签中含有“立即领取”的按钮
// @author       You
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548437/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%AB%8B%E5%8D%B3%E9%A2%86%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/548437/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%AB%8B%E5%8D%B3%E9%A2%86%E5%8F%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 每秒检查 5 次（即每 200ms 检查一次）
    setInterval(() => {
        // 查找所有 span 标签
        let spans = document.querySelectorAll("span");

        for (let span of spans) {
            if (span.innerText.includes("立即领取")) {
                console.log("发现 '立即领取' 按钮，尝试点击...");
                span.click(); // 模拟点击
                // 如果只想点击一次，可以 return 或 clearInterval
                return;
            }
        }
    }, 200); // 200ms 执行一次
})();