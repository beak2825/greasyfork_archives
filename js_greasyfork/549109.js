// ==UserScript==
// @name         SmartEdu 视频自动联播
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动点击联播按钮（smartedu.cn）
// @author       丸子自用
// @match        *://*.smartedu.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549109/SmartEdu%20%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E8%81%94%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/549109/SmartEdu%20%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E8%81%94%E6%92%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 每隔10秒检查一次
    setInterval(() => {
        const btn = document.querySelector("a.layui-layer-btn0");
        if (btn) {
            console.log("检测到按钮，正在点击...");
            btn.click();
        }
    }, 10000); // 10秒
})();
