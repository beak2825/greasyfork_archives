// ==UserScript==
// @name         115转存助手 (115 Auto Save)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  115网盘分享页面自动点击提交、一键转存及确认按钮
// @author       油猴大师
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

        // === 步骤 1: 等待 0.5s 后点击提交按钮 ===
        await sleep(500);
        const submitBtn = document.querySelector('.sharing-public-decode .form-decode .submit .button');
        safeClick(submitBtn, '提取码提交按钮');

        // === 步骤 2: 等待 0.5s 后点击"一键转存"按钮 ===
        await sleep(500);
        // 获取所有符合选择器的元素
        const menuLinks = document.querySelectorAll('.context-menu .cell-icon a, .context-menu .icon-cell a');
        let saveBtnFound = false;

        for (const link of menuLinks) {
            // 检查文本内容是否包含目标文字 (处理可能的空白字符)
            if (link.textContent.trim().includes('一键转存')) {
                safeClick(link, '一键转存按钮');
                saveBtnFound = true;
                break; // 找到后点击并退出循环
            }
        }
        if (!saveBtnFound) console.warn('[115转存助手] 未找到内容为“一键转存”的按钮');

        // === 步骤 3: 等待 0.5s 后点击确认转存按钮 ===
        await sleep(500);
        // 使用 CSS 属性选择器匹配 class 以 dgac 开头且包含 dgac-confirm 的元素
        const confirmBtns = document.querySelectorAll('html:root .dialog-action a[class^="dgac"].dgac-confirm');
        for (const confirmBtn of confirmBtns) {
            // 检查文本内容是否包含目标文字 (处理可能的空白字符)
            if (confirmBtn.textContent.trim().includes('立即转存')) {
                safeClick(confirmBtn, '立即转存确认按钮');
                saveBtnFound = true;
                break; // 找到后点击并退出循环
            }
        }
        //console.log(confirmBtn);
        //safeClick(confirmBtn, '立即转存确认按钮');

        console.log('[115转存助手] 流程结束');
    };

    // 页面加载完成后执行 (由于 @run-at document-idle，此处直接执行即可，但也为了保险起见可以再次监听页面加载)
    if (document.readyState === 'complete') {
        runScript();
    } else {
        window.addEventListener('load', runScript);
    }

})();