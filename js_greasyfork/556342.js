// ==UserScript==
// @name   喝水提醒（间隔30分钟）
// @namespace    http://tampermonkey.net/
// @version      v251120_1118
// @description  从早上9:00开始，可自定义间隔弹出喝水提醒
// @author       liuyoyo
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556342/%E5%96%9D%E6%B0%B4%E6%8F%90%E9%86%92%EF%BC%88%E9%97%B4%E9%9A%9430%E5%88%86%E9%92%9F%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/556342/%E5%96%9D%E6%B0%B4%E6%8F%90%E9%86%92%EF%BC%88%E9%97%B4%E9%9A%9430%E5%88%86%E9%92%9F%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== 可自定义的变量 =====
    const REMINDER_INTERVAL_MINUTES = 30; // 提醒间隔（分钟）
    const START_HOUR = 9;                 // 开始小时（24小时制）
    const START_MINUTE = 0;              // 开始分钟
    const START_SECOND = 0;               // 开始秒数
    // =========================

    let reminderDiv = null;
    let nextReminderTime = null; // 跟踪下一次提醒的预期时间

    // 检查是否应该开始提醒
    function shouldStartReminders() {
        const now = new Date();
        const currentTime = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
        const startTime = START_HOUR * 3600 + START_MINUTE * 60 + START_SECOND;

        return currentTime >= startTime;
    }

    // 格式化时间显示
    function formatTime(date) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }

    // 创建提醒弹窗
    function createReminderPopup(nextTime) {
        // 如果已经存在提醒弹窗，先移除
        if (reminderDiv) {
            reminderDiv.remove();
        }

        // 创建弹窗容器
        reminderDiv = document.createElement('div');
        reminderDiv.id = 'water-reminder-popup';

        // 设置样式
        reminderDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 1600px;
            height: 700px;
            background-color: white;
            border: 3px solid #00BFFF;
            border-radius: 15px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-family: "Ink Free", "Segoe Print", "Bradley Hand", "Comic Sans MS", cursive, sans-serif;
        `;

        // 创建关闭按钮
        const closeButton = document.createElement('button');
        closeButton.textContent = '✕';
        closeButton.style.cssText = `
            position: absolute;
            top: 15px;
            right: 15px;
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #00BFFF;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        // 关闭按钮悬停效果
        closeButton.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#f0f0f0';
        });

        closeButton.addEventListener('mouseout', function() {
            this.style.backgroundColor = 'transparent';
        });

        // 关闭功能
        closeButton.addEventListener('click', function() {
            reminderDiv.remove();
            reminderDiv = null;
        });

        // 创建提醒文字
        const reminderText = document.createElement('div');
        reminderText.textContent = "It's time to drink water !";
        reminderText.style.cssText = `
            color: #00BFFF;
            font-size: 8em;
            font-weight: bold;
            text-align: center;
            text-shadow: 2px 2px 4px rgba(0, 191, 255, 0.3);
            padding: 20px;
            margin-bottom: 20px;
        `;

        // 创建下次提醒时间文字
        const nextReminderText = document.createElement('div');
        nextReminderText.textContent = `下次提醒时间: ${formatTime(nextTime)}`;
        nextReminderText.style.cssText = `
            color: #666;
            font-size: 1em;
            text-align: center;
            position: absolute;
            bottom: 30px;
            width: 100%;
        `;

        // 添加到弹窗
        reminderDiv.appendChild(closeButton);
        reminderDiv.appendChild(reminderText);
        reminderDiv.appendChild(nextReminderText);

        // 添加到页面
        document.body.appendChild(reminderDiv);
    }

    // 显示提醒（仅在激活的标签页中显示，且时间差不超过2秒）
    function showReminder() {
        const now = new Date();
        const timeDiff = Math.abs(now.getTime() - nextReminderTime.getTime());

        // 检查页面是否可见且时间差不超过2秒
        if (!document.hidden && timeDiff <= 2000) {
            const actualNextTime = new Date(nextReminderTime.getTime() + REMINDER_INTERVAL_MINUTES * 60 * 1000);
            createReminderPopup(actualNextTime);
            console.log(`显示喝水提醒，下次提醒将在 ${formatTime(actualNextTime)}`);
        }

        // 计算并调度下一次提醒
        nextReminderTime = new Date(nextReminderTime.getTime() + REMINDER_INTERVAL_MINUTES * 60 * 1000);
        const delay = nextReminderTime.getTime() - new Date().getTime();
        setTimeout(showReminder, delay);
    }

    // 主函数
    function init() {
        if (!shouldStartReminders()) {
            // 如果还没到开始时间，设置定时器检查
            const now = new Date();
            const startTime = new Date(now);
            startTime.setHours(START_HOUR, START_MINUTE, START_SECOND, 0);

            if (now < startTime) {
                const timeUntilStart = startTime.getTime() - now.getTime();
                console.log(`喝水提醒脚本将在 ${formatTime(startTime)} 开始，间隔 ${REMINDER_INTERVAL_MINUTES} 分钟`);
                setTimeout(init, timeUntilStart);
            }
            return;
        }

        // 到了开始时间，计算第一次提醒的时间
        const now = new Date();
        const startTime = new Date(now);
        startTime.setHours(START_HOUR, START_MINUTE, START_SECOND, 0);

        // 根据当前时间计算下次提醒时间
        if (now > startTime) {
            const timeSinceStart = now.getTime() - startTime.getTime();
            const intervals = Math.ceil(timeSinceStart / (REMINDER_INTERVAL_MINUTES * 60 * 1000));
            nextReminderTime = new Date(startTime.getTime() + intervals * REMINDER_INTERVAL_MINUTES * 60 * 1000);
        } else {
            nextReminderTime = startTime;
        }

        // 调度第一次提醒
        const delay = nextReminderTime.getTime() - now.getTime();
        setTimeout(showReminder, delay);
    }

    // 页面加载后启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 当页面可见性改变时（切换标签页），如果弹窗存在且页面变为非激活状态，则关闭弹窗
    document.addEventListener('visibilitychange', function() {
        if (document.hidden && reminderDiv) {
            reminderDiv.remove();
            reminderDiv = null;
        }
    });
})();