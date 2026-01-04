// ==UserScript==
// @name         X (Twitter) 自动浏览帖子
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  在 X (Twitter) 主页自动点击帖子，等待5秒后返回，并浏览下一个帖子。支持在指定时间段内自动执行，并优化了时间段设置界面。
// @author       You
// @match        https://x.com/*
// @match        https://twitter.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559018/X%20%28Twitter%29%20%E8%87%AA%E5%8A%A8%E6%B5%8F%E8%A7%88%E5%B8%96%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/559018/X%20%28Twitter%29%20%E8%87%AA%E5%8A%A8%E6%B5%8F%E8%A7%88%E5%B8%96%E5%AD%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 脚本状态 ---
    let isRunning = false;
    let isSchedulerEnabled = false;
    let scheduleCheckInterval;
    const visitedPosts = new Set();

    // --- 工具函数 ---
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const findNextUnvisitedPost = () => {
        const posts = document.querySelectorAll('article[data-testid="tweet"]');
        for (const post of posts) {
            const rect = post.getBoundingClientRect();
            if (rect.top >= 0 && rect.top < window.innerHeight) {
                const linkElement = post.querySelector('a[href*="/status/"]');
                if (linkElement) {
                    const postUrl = linkElement.href;
                    if (!visitedPosts.has(postUrl)) {
                        return { element: post, url: postUrl };
                    }
                }
            }
        }
        return null;
    };

    // --- 核心浏览逻辑 ---
    const autoViewPosts = async () => {
        console.log("【自动浏览脚本】开始运行...");
        while (isRunning) {
            if (!window.location.pathname.includes('/home')) {
                console.log("【自动浏览脚本】不在主页，停止运行。");
                stopScript();
                return;
            }
            const nextPostData = findNextUnvisitedPost();
            if (!nextPostData) {
                console.log("【自动浏览脚本】当前视口没有新帖子，向下滚动以加载更多...");
                window.scrollBy(0, window.innerHeight);
                await sleep(3000);
                continue;
            }
            const { element: currentPost, url: postUrl } = nextPostData;
            visitedPosts.add(postUrl);
            console.log(`【自动浏览脚本】找到新帖子: ${postUrl}`);
            currentPost.click();
            await sleep(1500);
            if (window.location.pathname.includes('/status/')) {
                window.scrollBy(0, 300);
                await sleep(5000);
            }
            console.log("【自动浏览脚本】返回主页...");
            window.history.back();
            await sleep(2000);
        }
        console.log("【自动浏览脚本】已停止。");
    };

    // --- 脚本启停控制 ---
    const startScript = () => { if (isRunning) return; isRunning = true; visitedPosts.clear(); updateManualButton(); autoViewPosts(); };
    const stopScript = () => { isRunning = false; updateManualButton(); };
    const toggleManualScript = () => { isRunning ? stopScript() : startScript(); };

    // --- 定时任务逻辑 ---
    const isNowInSchedule = () => {
        const schedules = GM_getValue('x_autoViewer_schedules', []);
        if (!schedules.length) return false;
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();

        for (const range of schedules) {
            if (!range.start || !range.end) continue;
            const [startHour, startMin] = range.start.split(':').map(Number);
            const [endHour, endMin] = range.end.split(':').map(Number);
            if (isNaN(startHour) || isNaN(startMin) || isNaN(endHour) || isNaN(endMin)) continue;

            const startTime = startHour * 60 + startMin;
            const endTime = endHour * 60 + endMin;

            if (startTime <= endTime) {
                if (currentTime >= startTime && currentTime <= endTime) return true;
            } else {
                if (currentTime >= startTime || currentTime <= endTime) return true;
            }
        }
        return false;
    };

    const checkScheduleAndRun = () => {
        if (!isSchedulerEnabled) return;
        const shouldBeRunning = isNowInSchedule();
        const statusSpan = document.getElementById('schedule-status');
        if (shouldBeRunning && !isRunning) {
            console.log("【定时任务】到达预定时间，自动启动脚本。");
            if (statusSpan) statusSpan.textContent = '状态: 运行中';
            startScript();
        } else if (!shouldBeRunning && isRunning) {
            console.log("【定时任务】不在预定时间，自动停止脚本。");
            if (statusSpan) statusSpan.textContent = '状态: 等待中';
            stopScript();
        } else {
            if (statusSpan) statusSpan.textContent = isSchedulerEnabled ? (shouldBeRunning ? '状态: 运行中' : '状态: 等待中') : '状态: 未启用';
        }
    };

    // --- UI 逻辑 ---
    const updateManualButton = () => {
        const button = document.getElementById('auto-viewer-control-btn');
        if (!button) return;
        button.innerText = isRunning ? '停止手动浏览' : '开始手动浏览';
        button.style.backgroundColor = isRunning ? '#ff4444' : '#1da1f2';
    };

    const saveSchedules = () => {
        const blocks = document.querySelectorAll('.schedule-block');
        const schedules = [];
        blocks.forEach(block => {
            const start = block.querySelector('.schedule-start').value;
            const end = block.querySelector('.schedule-end').value;
            if (start && end) {
                schedules.push({ start, end });
            }
        });
        GM_setValue('x_autoViewer_schedules', schedules);
        checkScheduleAndRun(); // 保存后立即检查
    };

    const addScheduleBlock = (data = { start: '09:00', end: '10:00' }) => {
        const list = document.getElementById('schedule-list');
        const block = document.createElement('div');
        block.className = 'schedule-block';
        block.innerHTML = `
            <input type="time" class="schedule-start" value="${data.start}">
            <span>至</span>
            <input type="time" class="schedule-end" value="${data.end}">
            <button class="schedule-remove-btn">删除</button>
        `;
        list.appendChild(block);

        block.querySelector('.schedule-remove-btn').addEventListener('click', () => {
            block.remove();
            saveSchedules();
        });

        block.querySelectorAll('input[type="time"]').forEach(input => {
            input.addEventListener('change', saveSchedules);
        });
    };

    const createScheduleUI = () => {
        const panel = document.createElement('div');
        panel.id = 'schedule-panel';
        panel.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 8px;">定时任务</div>
            <div id="schedule-list"></div>
            <button id="add-schedule-btn">+ 添加时间段</button>
            <div style="margin-top: 10px;">
                <label style="display: flex; align-items: center; cursor: pointer;">
                    <input type="checkbox" id="schedule-toggle">
                    <span style="margin-left: 5px;">启用定时</span>
                </label>
            </div>
            <div id="schedule-status" style="margin-top: 5px; font-size: 12px; color: #888;">状态: 未启用</div>
        `;
        document.body.appendChild(panel);

        // 加载并渲染已有时间段
        const savedSchedules = GM_getValue('x_autoViewer_schedules', []);
        if (savedSchedules.length === 0) {
            addScheduleBlock(); // 如果没有保存的，添加一个默认的
        } else {
            savedSchedules.forEach(s => addScheduleBlock(s));
        }

        // 绑定事件
        document.getElementById('add-schedule-btn').addEventListener('click', () => addScheduleBlock());

        const toggle = document.getElementById('schedule-toggle');
        isSchedulerEnabled = GM_getValue('x_autoViewer_schedulerEnabled', false);
        toggle.checked = isSchedulerEnabled;
        toggle.addEventListener('change', () => {
            isSchedulerEnabled = toggle.checked;
            GM_setValue('x_autoViewer_schedulerEnabled', isSchedulerEnabled);
            checkScheduleAndRun();
        });
    };

    // --- 初始化 ---
    GM_addStyle(`
        #auto-viewer-control-btn { position: fixed; bottom: 20px; right: 20px; z-index: 9999; padding: 10px 15px; color: white; border: none; border-radius: 20px; cursor: pointer; font-size: 14px; font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
        #schedule-panel { position: fixed; bottom: 20px; left: 20px; z-index: 9999; background-color: white; border: 1px solid #ccd6dd; padding: 15px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; width: 280px; }
        .schedule-block { display: flex; align-items: center; margin-bottom: 8px; gap: 8px; }
        .schedule-block input[type="time"] { padding: 4px; border-radius: 4px; border: 1px solid #ccd6dd; }
        .schedule-remove-btn { background: #e0245e; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 12px; }
        .schedule-remove-btn:hover { background: #c02354; }
        #add-schedule-btn { width: 100%; padding: 8px; background: #1da1f2; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; margin-top: 5px; }
        #add-schedule-btn:hover { background: #1a91da; }
    `);

    const init = () => {
        updateManualButton();
        createScheduleUI();
        scheduleCheckInterval = setInterval(checkScheduleAndRun, 30000); // 每30秒检查一次，减少资源消耗
        checkScheduleAndRun(); // 页面加载时立即检查一次
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();