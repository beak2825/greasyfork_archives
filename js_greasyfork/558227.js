// ==UserScript==
// @name         115转存助手 (115 Auto Save)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  115网盘分享页面自动点击提交、一键转存及确认按钮
// @author       Xiaowu
// @match        https://115cdn.com/s/*
// @icon         https://115.com/favicon.ico
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558227/115%E8%BD%AC%E5%AD%98%E5%8A%A9%E6%89%8B%20%28115%20Auto%20Save%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558227/115%E8%BD%AC%E5%AD%98%E5%8A%A9%E6%89%8B%20%28115%20Auto%20Save%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 辅助函数：休眠指定毫秒数
     * 使用 Promise 封装 setTimeout，方便在 async 函数中使用 await
     * @param {number} ms - 毫秒数
     */
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    /**
     * 辅助函数：带日志的点击操作
     * @param {Element} element - DOM 元素
     * @param {string} desc - 操作描述
     */
    const safeClick = (element, desc) => {
        if (element) {
            console.log(`[115转存助手] 正在点击: ${desc}`);
            element.click();
        } else {
            console.warn(`[115转存助手] 未找到元素: ${desc}`);
        }
    };

    /**
     * 主执行逻辑
     * 使用 async/await 确保操作按顺序和时间间隔执行
     */
    const runScript = async () => {
        console.log('[115转存助手] 脚本启动...');

        // === 步骤 1: 等待 0.5s 后点击"确定"按钮（提交访问码） ===
        await sleep(500);
        const allButtons = document.querySelectorAll('button');
        let submitBtnFound = false;
        
        for (const btn of allButtons) {
            if (btn.textContent.trim() === '确定') {
                safeClick(btn, '确定按钮（提交访问码）');
                submitBtnFound = true;
                break;
            }
        }
        if (!submitBtnFound) console.warn('[115转存助手] 未找到"确定"按钮');

        // === 步骤 2: 等待 1s 后点击"转存"按钮 ===
        await sleep(1000);
        let saveBtnFound = false;
        
        const buttons2 = document.querySelectorAll('button');
        for (const btn of buttons2) {
            if (btn.textContent.trim() === '转存') {
                safeClick(btn, '转存按钮');
                saveBtnFound = true;
                break;
            }
        }
        if (!saveBtnFound) console.warn('[115转存助手] 未找到"转存"按钮');

        // === 步骤 3: 等待 0.5s 后点击"转存到此"确认按钮 ===
        await sleep(500);
        let confirmBtnFound = false;
        
        const buttons3 = document.querySelectorAll('button');
        for (const btn of buttons3) {
            if (btn.textContent.trim() === '转存到此') {
                safeClick(btn, '转存到此确认按钮');
                confirmBtnFound = true;
                break;
            }
        }
        if (!confirmBtnFound) console.warn('[115转存助手] 未找到"转存到此"按钮');

        console.log('[115转存助手] 流程结束');
    };
    // 页面加载完成后执行 (由于 @run-at document-idle，此处直接执行即可，但也为了保险起见可以再次监听页面加载)
    if (document.readyState === 'complete') {
        runScript();
    } else {
        window.addEventListener('load', runScript);
    }

})();