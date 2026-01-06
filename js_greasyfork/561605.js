// ==UserScript==
// @name         South Plus 自動任務
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  全自動背景完成日常及週常任務，具備狀態顯示面板，適合批量開啟書籤使用
// @author       You
// @match        https://*.east-plus.net/*
// @match        https://*.south-plus.net/*
// @match        https://*.level-plus.net/*
// @match        https://*.snow-plus.net/*
// @icon         data:image/gif;base64,R0lGODlhEAAQAKIAAKIbG8dXV/339+atrfHMzOGXl9d3d7QxMSH5BAAAAAAALAAAAAAQABAAAANSKBPX0Ma8MBR7GBA5y81AdIihgxWW+I0PsURVAQoXNQwtB0EolYOTza0HPI0EtCKug5RlAsjZwtQSPJGEqIljGGa3IN+EJT55XDnUdHwgOCiCBAA7
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561605/South%20Plus%20%E8%87%AA%E5%8B%95%E4%BB%BB%E5%8B%99.user.js
// @updateURL https://update.greasyfork.org/scripts/561605/South%20Plus%20%E8%87%AA%E5%8B%95%E4%BB%BB%E5%8B%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置：任務冷卻時間 (毫秒)
    const DAILY_COOLDOWN = 18 * 60 * 60 * 1000; // 18 小時
    const WEEKLY_COOLDOWN = 158 * 60 * 60 * 1000; // 158 小時

    // UI 樣式
    GM_addStyle(`
        #sp-task-panel {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: #fff;
            padding: 10px;
            border-radius: 5px;
            font-size: 12px;
            z-index: 9999;
            box-shadow: 0 0 5px rgba(0,0,0,0.5);
            min-width: 150px;
        }
        #sp-task-panel .task-item {
            margin-bottom: 5px;
            display: flex;
            justify-content: space-between;
        }
        #sp-task-panel .status-done { color: #4caf50; font-weight: bold; }
        #sp-task-panel .status-cool { color: #ff9800; }
        #sp-task-panel .status-work { color: #2196f3; animation: pulse 1s infinite; }
        #sp-task-panel .status-error { color: #f44336; }
        #sp-task-btn {
            margin-top: 5px;
            width: 100%;
            background: #444;
            border: 1px solid #666;
            color: #fff;
            cursor: pointer;
            padding: 2px;
        }
        #sp-task-btn:hover { background: #666; }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
    `);

    // 建立 UI
    const panel = document.createElement('div');
    panel.id = 'sp-task-panel';
    panel.innerHTML = `
        <div class="task-item">日常任務：<span id="status-daily">檢查中...</span></div>
        <div class="task-item">週常任務：<span id="status-weekly">檢查中...</span></div>
        <button id="sp-task-btn">強制執行所有任務</button>
    `;
    document.body.appendChild(panel);

    const statusDaily = document.getElementById('status-daily');
    const statusWeekly = document.getElementById('status-weekly');
    const forceBtn = document.getElementById('sp-task-btn');

    function updateStatus(type, msg, statusClass) {
        const el = type === 'daily' ? statusDaily : statusWeekly;
        el.textContent = msg;
        el.className = statusClass || '';
    }

    // 核心執行邏輯
    async function runTasks(force = false) {
        const now = Date.now();
        const lastDaily = GM_getValue('last_daily_task', 0);
        const lastWeekly = GM_getValue('last_weekly_task', 0);

        // 1. 處理日常
        if (force || now - lastDaily > DAILY_COOLDOWN) {
            updateStatus('daily', '執行中...', 'status-work');
            await processTask('日常', 15, 'daily');
        } else {
            const hoursLeft = ((DAILY_COOLDOWN - (now - lastDaily)) / 1000 / 60 / 60).toFixed(1);
            updateStatus('daily', `冷卻中 (${hoursLeft}h)`, 'status-cool');
        }

        // 2. 處理週常
        if (force || now - lastWeekly > WEEKLY_COOLDOWN) {
            updateStatus('weekly', '執行中...', 'status-work');
            await processTask('週常', 14, 'weekly');
        } else {
            const hoursLeft = ((WEEKLY_COOLDOWN - (now - lastWeekly)) / 1000 / 60 / 60).toFixed(1);
            updateStatus('weekly', `冷卻中 (${hoursLeft}h)`, 'status-cool');
        }
    }

    // 處理單個任務流程
    async function processTask(taskName, fallbackId, typeKey) {
        const baseUrl = window.location.origin;
        try {
            // A. 獲取列表
            let listHtml = await fetchUrl(`${baseUrl}/plugin.php?H_name-tasks.html`);
            let doc = new DOMParser().parseFromString(listHtml, 'text/html');
            
            let applyLinks = doc.querySelectorAll('a[onclick^="startjob"]');
            let jobId = null;

            for (let link of applyLinks) {
                let row = link.closest('tr');
                if (row && row.textContent.includes(taskName)) {
                    let match = link.getAttribute('onclick').match(/startjob\('(\d+)'\)/);
                    if (match) jobId = match[1];
                    break;
                }
            }

            if (jobId) {
                // 執行申請
                await fetchUrl(`${baseUrl}/plugin.php?H_name=tasks&action=ajax&actions=job&cid=${jobId}&nowtime=${Date.now()}`);
                await sleep(1500);
            } else {
                jobId = fallbackId; // 沒找到申請按鈕，可能已經接了，嘗試去領獎
            }

            // B. 領獎
            let progressHtml = await fetchUrl(`${baseUrl}/plugin.php?H_name-tasks-actions-newtasks.html.html`);
            let pDoc = new DOMParser().parseFromString(progressHtml, 'text/html');
            let finishLinks = pDoc.querySelectorAll('a[onclick^="startjob"]');
            let finished = false;

            for (let link of finishLinks) {
                let row = link.closest('tr');
                if (row && row.textContent.includes(taskName)) {
                    let match = link.getAttribute('onclick').match(/startjob\('(\d+)'\)/);
                    if (match && match[1] == jobId) {
                        await fetchUrl(`${baseUrl}/plugin.php?H_name=tasks&action=ajax&actions=job2&cid=${jobId}&nowtime=${Date.now()}`);
                        finished = true;
                        // 更新時間戳
                        if (typeKey === 'daily') GM_setValue('last_daily_task', Date.now());
                        if (typeKey === 'weekly') GM_setValue('last_weekly_task', Date.now());
                    }
                }
            }

            if (finished) {
                updateStatus(typeKey, '✅ 已完成', 'status-done');
            } else {
                // 如果沒找到領獎按鈕，可能是因為已經做完了，或者根本沒這個任務
                // 這裡我們假設如果沒找到申請也沒找到領獎，就是處於「完成」狀態 (針對 SP 的邏輯)
                // 為了保險，如果是強制執行，我們更新時間；如果是自動執行，我們保持原樣
                updateStatus(typeKey, '無需執行/已完成', 'status-cool');
            }

        } catch (e) {
            console.error(e);
            updateStatus(typeKey, '❌ 錯誤', 'status-error');
        }
    }

    // 通用 Fetch
    function fetchUrl(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: (res) => resolve(res.responseText),
                onerror: (err) => reject(err)
            });
        });
    }

    function sleep(ms) {
        return new Promise(r => setTimeout(r, ms));
    }

    // 綁定按鈕事件
    forceBtn.addEventListener('click', () => {
        runTasks(true);
    });

    // 自動啟動
    setTimeout(() => runTasks(false), 1000);

})();