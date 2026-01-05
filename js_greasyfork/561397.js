// ==UserScript==
// @name         西电XDU一键评教(键盘快捷键版)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  进入评教页面等几秒加载完页面，之后按 ` 键（波浪号键）会自动勾选非常满意并自动填写评语。适用西安电子科技大学网上评教应用。
// @author       Setani_
// @match        *://ehall.xidian.edu.cn/jwapp/sys/wspjyyapp/*
// @icon         https://www.xidian.edu.cn/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561397/%E8%A5%BF%E7%94%B5XDU%E4%B8%80%E9%94%AE%E8%AF%84%E6%95%99%28%E9%94%AE%E7%9B%98%E5%BF%AB%E6%8D%B7%E9%94%AE%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561397/%E8%A5%BF%E7%94%B5XDU%E4%B8%80%E9%94%AE%E8%AF%84%E6%95%99%28%E9%94%AE%E7%9B%98%E5%BF%AB%E6%8D%B7%E9%94%AE%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isRunning = false; // 简单的防抖锁

    window.addEventListener('keydown', function(e) {
        // 检查按下的键是否是 ` 键
        if (e.key === '`' && !isRunning) {
            isRunning = true;
            console.log('检测到按键 `，正在执行自动填写...');

            try {
                // 1. 处理单选框 Label
                document.querySelectorAll(".bh-radio-label").forEach((item) => {
                    const text = item.innerText.trim();
                    if (["完全符合", "非常满意", "能够完全掌握本门课程的知识点并运用于实践", "推荐"].some(target => text.includes(target))) {
                        item.click();
                    }
                });

                // 2. 处理复选框 Label
                document.querySelectorAll(".bh-checkbox-label").forEach((item) => {
                    if (item.innerText.includes("运用知识能力：能够用所学知识去解决专业领域的问题。")) {
                        item.click();
                    }
                });

                // 3. 处理特定属性的 100 分 input
                document.querySelectorAll("input[data-x-bl='100']").forEach((item) => {
                    item.checked = true;
                });

                // 4. 勾选所有复选框
                document.querySelectorAll("input[type='checkbox']").forEach((item) => {
                    item.checked = true;
                });

                // 5. 填写评语并触发事件
                document.querySelectorAll(".bh-txt-input__txtarea").forEach((item) => {
                    item.value = "教学很负责，老师辛苦了！";
                    item.dispatchEvent(new Event('input', { bubbles: true }));
                    item.dispatchEvent(new Event('change', { bubbles: true })); // 增加 change 事件更稳妥
                });

                console.log('填写完成！');
            } catch (err) {
                console.error('自动填写过程中出现错误:', err);
            } finally {
                // 1秒后解锁，防止长按连发
                setTimeout(() => { isRunning = false; }, 1000);
            }
        }
    });
})();
