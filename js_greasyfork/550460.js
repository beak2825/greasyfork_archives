// ==UserScript==
// @name         tencent cloud studio, retry boot
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Finds a button, waits 3 seconds, clicks it, and stops.
// @author       You
// @match        https://ide.cloud.tencent.com/ws/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550460/tencent%20cloud%20studio%2C%20retry%20boot.user.js
// @updateURL https://update.greasyfork.org/scripts/550460/tencent%20cloud%20studio%2C%20retry%20boot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义要查找的按钮选择器
    const BUTTON_SELECTOR = 'button.btn__21_ID';

    // 设置一个定时器，每 1 秒检查一次
    const checkInterval = setInterval(() => {
        // 尝试查找页面上的按钮
        const button = document.querySelector(BUTTON_SELECTOR);

        // 如果找到了按钮
        if (button) {
            console.log('按钮已找到！等待 3 秒后点击...');
            // 立即停止定时器，避免重复查找
            clearInterval(checkInterval);

            // 设置一个 3 秒的延迟，然后执行点击操作
            setTimeout(() => {
                console.log('3 秒已到，正在模拟点击按钮...');
                button.click();
                console.log('任务完成！');
            }, 3000); // 3000 毫秒 = 3 秒
        } else {
            console.log('按钮未找到，继续等待...');
        }
    }, 1000); // 1000 毫秒 = 1 秒
})();