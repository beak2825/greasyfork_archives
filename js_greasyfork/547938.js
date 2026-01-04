// ==UserScript==
// @name         量见云联播
// @namespace    http://tampermonkey.net/
// @version      2025-09-02
// @description  量见云课程自动联播
// @author       木木
// @match        https://pc.lzdxedu.com/course/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547938/%E9%87%8F%E8%A7%81%E4%BA%91%E8%81%94%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/547938/%E9%87%8F%E8%A7%81%E4%BA%91%E8%81%94%E6%92%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener("DOMContentLoaded", () => {
    const checkInterval = 500; // 每 500ms 检查一次

    const intervalId = setInterval(() => {

        // 1️⃣ 检查弹窗按钮 #continueBtn
        const targetElement = document.querySelector(".check-interventions");
        const continueBtn = document.querySelector("#continueBtn");
        if (targetElement && continueBtn) {
            const displayValue = targetElement.style.display;
            if (displayValue === 'block') {
                continueBtn.click();
                console.log("continueBtn 已点击");
            }
        }

        // 2️⃣ 检查 xgplayer 播放按钮（data-state=pause）
        const startBtn = document.querySelector(".xgplayer-start");
        if (startBtn && startBtn.dataset.state !== "play") {
            if (typeof startBtn.onclick === "function") {
                startBtn.onclick();
                console.log("xgplayer-start onclick() 已调用");
            } else {
                startBtn.click();
                console.log("xgplayer-start click() 已触发");
            }
        }

        // 3️⃣ 点击取消按钮
        const cancelBtn = document.querySelector(".cancel.flex-1.text-center");
        if (cancelBtn) {
            cancelBtn.click();
            console.log(".cancel.flex-1.text-center 已点击");
        }

        // 4️⃣ 监听 <xg-start> 元素，如果不包含 hide class，则点击
        const xgStart = document.querySelector("xg-start.xgplayer-start");
        if (xgStart && !xgStart.classList.contains("hide")) {
            xgStart.click();
            console.log("xg-start 元素已点击（不包含 hide）");
        }

    }, checkInterval);
});

    // Your code here...
})();