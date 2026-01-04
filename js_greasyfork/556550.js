// ==UserScript==
// @name         淘金币红包确定
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在淘金币页面自动点击“确认”按钮，检测次数超过100次则停止
// @author       mattpower
// @match        https://huodong.taobao.com/wow/z/tbhome/pc-growth/tao-coin*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556550/%E6%B7%98%E9%87%91%E5%B8%81%E7%BA%A2%E5%8C%85%E7%A1%AE%E5%AE%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/556550/%E6%B7%98%E9%87%91%E5%B8%81%E7%BA%A2%E5%8C%85%E7%A1%AE%E5%AE%9A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 目标选择器
    const SELECTOR = '#ice-container > div > div.tbpc-layout > div.gold-content > div.feeds > div > div.tbpc-row > div:nth-child(1) > div > div.bubble-container > div > div.operate > div.btn.confirm';

    let checkCount = 0; // 检测次数计数器
    const maxCheckCount = 100; // 最大检测次数

    // 每隔 100ms 检测一次
    const interval = setInterval(() => {
        checkCount++; // 增加检测次数
        const button = document.querySelector(SELECTOR);
        if (button && button.offsetParent !== null) { // 确保元素存在且可见
            console.log('检测到按钮，正在点击...');
            button.click();
        } else {
            console.log(`未检测到按钮 (检测次数: ${checkCount})`);
        }

        // 如果检测次数超过最大次数，则停止检测
        if (checkCount >= maxCheckCount) {
            console.log(`已达到最大检测次数 ${maxCheckCount}，停止检测程序`);
            clearInterval(interval);
        }
    }, 100); // 100ms = 0.1s

    // 可选：页面卸载时清除定时器（防止内存泄漏）
    window.addEventListener('beforeunload', () => {
        clearInterval(interval);
    });
})();