// ==UserScript==
// @name         自动点击 renderTarget_pager_button（带开始/停止）
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  添加控制按钮，可开始/停止自动点击 class="renderTarget_pager_button" 的第一个元素（最多1000次，间隔11～12秒）
// @author       YourName
// @match        https://weread.qq.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562424/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%20renderTarget_pager_button%EF%BC%88%E5%B8%A6%E5%BC%80%E5%A7%8B%E5%81%9C%E6%AD%A2%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/562424/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%20renderTarget_pager_button%EF%BC%88%E5%B8%A6%E5%BC%80%E5%A7%8B%E5%81%9C%E6%AD%A2%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const TOTAL_CLICKS = 1000;
    let currentClick = 0;
    let isRunning = false;
    let timeoutId = null;

    // 获取随机延迟：5秒 + 1～2秒随机 → 11000 ～ 12000 ms
    function getRandomDelay() {
        return 40000 + Math.floor(Math.random() * 1000) + 1000;
    }

    // 点击目标按钮
    function clickTargetButton() {
        const buttons = document.getElementsByClassName("renderTarget_pager_button_right");
        if (buttons.length > 0) {
            buttons[0].click();
            console.log(`[自动点击] 第 ${currentClick + 1} 次点击完成`);
        } else {
            console.warn("[自动点击] 未找到目标按钮，跳过本次点击");
        }
    }

    // 主循环
    function nextClick() {
        if (!isRunning) return;

        if (currentClick >= TOTAL_CLICKS) {
            finishTask();
            return;
        }

        clickTargetButton();
        currentClick++;
        updateButtonText(`停止（${currentClick}/${TOTAL_CLICKS}）`);

        if (isRunning) {
            timeoutId = setTimeout(nextClick, getRandomDelay());
        }
    }

    // 任务完成
    function finishTask() {
        isRunning = false;
        updateButtonText("✅ 已完成！");
        console.log("[自动点击] 全部 1000 次点击已完成！");
    }

    // 停止任务
    function stopTask() {
        isRunning = false;
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
        updateButtonText("已停止");
        console.log("[自动点击] 用户手动停止");
    }

    // 更新按钮文本
    function updateButtonText(text) {
        const btn = document.getElementById('tampermonkey-auto-click-btn');
        if (btn) btn.textContent = text;
    }

    // 创建控制按钮
    function createControlButton() {
        if (document.getElementById('tampermonkey-auto-click-btn')) return;

        const button = document.createElement('button');
        button.id = 'tampermonkey-auto-click-btn';
        button.textContent = '开始自动点击';
        button.style.position = 'fixed';
        button.style.top = '20px';
        button.style.right = '20px';
        button.style.zIndex = '99999';
        button.style.padding = '10px 16px';
        button.style.fontSize = '14px';
        button.style.border = 'none';
        button.style.borderRadius = '6px';
        button.style.cursor = 'pointer';
        button.style.boxShadow = '0 3px 8px rgba(0,0,0,0.25)';
        button.style.transition = 'background-color 0.3s, color 0.3s';

        // 初始样式：绿色
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';

        button.addEventListener('click', () => {
            if (isRunning) {
                // 正在运行 → 停止
                stopTask();
                button.style.backgroundColor = '#9E9E9E'; // 灰色
            } else {
                // 未运行 → 开始
                isRunning = true;
                currentClick = 0;
                button.style.backgroundColor = '#F44336'; // 红色
                updateButtonText("停止（0/1000）");
                console.log("[自动点击] 开始执行自动点击任务...");
                nextClick(); // 立即执行第一次点击
            }
        });

        document.body.appendChild(button);
    }

    // 启动
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", createControlButton);
    } else {
        createControlButton();
    }
})();