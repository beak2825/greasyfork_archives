// ==UserScript==
// @name         Auto Click Get Money - Continuous
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自動檢查並點擊 "Get money" 按鈕 (持續監聽版)
// @author       ALEN
// @icon         https://i.imgur.com/tnqS60o.jpeg
// @match        https://fpris.pro/bonus*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fpris.pro
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548302/Auto%20Click%20Get%20Money%20-%20Continuous.user.js
// @updateURL https://update.greasyfork.org/scripts/548302/Auto%20Click%20Get%20Money%20-%20Continuous.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("⏳ 已啟動自動點擊腳本，會每隔 5 秒檢查一次按鈕。");

    // 每隔 5 秒檢查一次
    const interval = setInterval(() => {
        const btn = document.querySelector('a.button');

        if (btn && btn.textContent.includes("Get money")) {
            console.log("✅ 找到按鈕，正在點擊...");
            btn.click();
            clearInterval(interval); // 點擊後停止監聽
        } else {
            console.log("🔍 按鈕還沒出現，繼續等候...");
        }
    }, 5000); // 5000ms = 5 秒
})();
