// ==UserScript==
// @name         小米搶券神器 (防跳頁+安全停止版)
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  修正點擊到導航列導致跳頁的問題；修正回到上一頁無限運行的問題。加入排除關鍵字與安全防護。
// @author       Gemini
// @match        https://www.mi.com/tw/event/*
// @grant        none
// @icon https://www.google.com/s2/favicons?sz=64&domain=mi.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556541/%E5%B0%8F%E7%B1%B3%E6%90%B6%E5%88%B8%E7%A5%9E%E5%99%A8%20%28%E9%98%B2%E8%B7%B3%E9%A0%81%2B%E5%AE%89%E5%85%A8%E5%81%9C%E6%AD%A2%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556541/%E5%B0%8F%E7%B1%B3%E6%90%B6%E5%88%B8%E7%A5%9E%E5%99%A8%20%28%E9%98%B2%E8%B7%B3%E9%A0%81%2B%E5%AE%89%E5%85%A8%E5%81%9C%E6%AD%A2%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // -----------------------
    // ★ 設定區域
    // -----------------------
    const WORKER_INTERVAL_MS = 70;           // 掃描速度
    const RUN_DURATION_SECONDS = 5;          // 搶券持續時間 (秒)
    const TARGET_START_TIME = "00:00:00";     // 刷新/開始時間 (24小時制)

    // *** 點擊目標設定 ***
    const TARGET_START_INDEX = 3; // 起始索引 (0=第1個, 1=第2個)
    const TARGET_COUNT = 1;       // 總共點幾個

    // *** ⛔ 排除關鍵字 (防止點到導航列) ***
    // 如果按鈕文字包含這些字，絕對不點
    const EXCLUDE_KEYWORDS = ["現在使用", "瞭解更多", "購物車", "登入", "註冊", "搜尋", "首頁", "Top", "Cart", "Login", "Search"];

    // -----------------------
    // 變數
    // -----------------------
    const STORAGE_KEY_AUTO_RUN = "mi_snipe_auto_run";
    let isRunning = false;
    let scheduledStartTimeout = null;
    let stopTimeout = null;

    // -----------------------
    // ★ Web Worker (防節流)
    // -----------------------
    const workerCode = `
        let interval = null;
        self.onmessage = function(e) {
            if (e.data === "start") {
                interval = setInterval(() => {
                    self.postMessage("tick");
                }, ${WORKER_INTERVAL_MS});
            }
            if (e.data === "stop") {
                clearInterval(interval);
            }
        };
    `;
    const worker = new Worker(URL.createObjectURL(new Blob([workerCode])));

    // -----------------------
    // 計算延遲
    // -----------------------
    function calculateDelay() {
        const parts = TARGET_START_TIME.split(':');
        if (parts.length < 2) return 0;
        const targetHour = parseInt(parts[0], 10);
        const targetMinute = parseInt(parts[1], 10);
        const targetSecond = parts.length > 2 ? parseInt(parts[2], 10) : 0;
        const now = new Date();
        const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), targetHour, targetMinute, targetSecond, 0);
        if (targetDate.getTime() <= now.getTime()) {
            targetDate.setDate(targetDate.getDate() + 1);
        }
        return targetDate.getTime() - now.getTime();
    }

    // -----------------------
    // UI 建立
    // -----------------------
    const panel = document.createElement('div');
    panel.style = `
        position: fixed; top: 120px; right: 20px; padding: 15px;
        background: rgba(255, 255, 255, 0.95); border: 2px solid #ff6700;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3); border-radius: 8px;
        z-index: 999999; min-width: 150px; text-align: center;
    `;
    const statusText = document.createElement('div');
    statusText.innerText = `準備就緒`;
    statusText.style = "margin-bottom:10px; font-weight:bold; color:#333; font-size:14px;";

    const immediateBtn = document.createElement('button');
    immediateBtn.innerText = '⚡ 立即開始 (不刷新)';
    immediateBtn.style = `width: 100%; padding:8px 0; margin-bottom:5px; cursor:pointer; background:#007bff; color:white; border:none; border-radius:5px; font-weight:bold; font-size:14px;`;

    const scheduleReloadBtn = document.createElement('button');
    scheduleReloadBtn.innerText = `🔄 排程刷新並搶券\n(${TARGET_START_TIME})`;
    scheduleReloadBtn.style = `width: 100%; padding:10px 0; cursor:pointer; background:#28a745; color:white; border:none; border-radius:5px; font-weight:bold; font-size:14px; line-height: 1.4;`;

    const stopBtn = document.createElement('button'); // 緊急停止按鈕
    stopBtn.innerText = '🛑 強制停止';
    stopBtn.style = `width: 100%; padding:5px 0; margin-top:5px; cursor:pointer; background:#dc3545; color:white; border:none; border-radius:5px; font-weight:bold; font-size:12px; display:none;`;

    panel.appendChild(statusText);
    panel.appendChild(immediateBtn);
    panel.appendChild(scheduleReloadBtn);
    panel.appendChild(stopBtn);
    document.body.appendChild(panel);

    // -----------------------
    // ★ 核心功能：找按鈕並點擊
    // -----------------------
    function clickCoupons() {
        const xpath = "//button";
        const result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        let total = result.snapshotLength;

        if (total === 0) {
            statusText.innerText = "👀 等待按鈕出現...";
            statusText.style.color = "#ff8800";
            return;
        }

        const startIndex = TARGET_START_INDEX;
        const endIndex = Math.min(startIndex + TARGET_COUNT, total) - 1;
        let validClicks = 0;

        for (let i = startIndex; i <= endIndex; i++) {
            if (i >= total) continue;
            let btn = result.snapshotItem(i);

            // --- 🛡️ 安全過濾區 ---
            if (btn.disabled) continue;

            // 1. 檢查按鈕文字是否在排除名單內
            const btnText = btn.textContent.trim();
            if (EXCLUDE_KEYWORDS.some(keyword => btnText.includes(keyword))) {
                // 發現是導航按鈕，跳過
                continue;
            }

            // 2. 檢查按鈕大小 (導航圖示通常很小，領取按鈕通常比較大)
            // 如果寬度小於 30px，極有可能是 icon 按鈕，跳過
            if (btn.offsetWidth > 0 && btn.offsetWidth < 30) {
                continue;
            }
            // --------------------

            try {
                // UI 計數器邏輯
                let counter = btn.querySelector('.claim-click-counter');
                let count = 0;
                if (counter) {
                    count = parseInt(counter.dataset.count, 10) || 0;
                    count++;
                    counter.dataset.count = count;
                    counter.innerText = `(${count})`;
                } else {
                    count = 1;
                    counter = document.createElement('span');
                    counter.className = 'claim-click-counter';
                    counter.dataset.count = 1;
                    counter.style = "position:absolute; right:0; bottom:0; background:rgba(255,0,0,0.8); color:white; padding:1px 3px; font-size:9px; border-radius:2px; z-index:1000; pointer-events:none;";
                    counter.innerText = `(1)`;
                    btn.style.position = "relative";
                    btn.appendChild(counter);
                }

                btn.click();
                validClicks++;

                // 視覺回饋
                btn.style.border = "3px solid red";
                btn.style.boxShadow = "0 0 10px yellow";

            } catch (e) {
                console.error("點擊錯誤", e);
            }
        }

        statusText.innerText = `🔥 攻擊中! 點擊有效目標: ${validClicks}`;
        statusText.style.color = "#dc3545";
    }

    worker.onmessage = (e) => {
        if (e.data === "tick" && isRunning) {
            clickCoupons();
        }
    };

    // -----------------------
    // 執行控制
    // -----------------------
    function executeScript() {
        // ★ 安全修正：啟動時，立刻刪除 localStorage 標記
        // 這樣如果不小心跳頁，回來時就不會無限重啟
        localStorage.removeItem(STORAGE_KEY_AUTO_RUN);

        isRunning = true;

        // UI 更新
        scheduleReloadBtn.disabled = true;
        scheduleReloadBtn.style.opacity = "0.6";
        immediateBtn.disabled = true;
        immediateBtn.style.opacity = "0.6";
        stopBtn.style.display = "block"; // 顯示強制停止按鈕

        statusText.innerText = "🔥 啟動監測...";
        statusText.style.color = "#dc3545";

        worker.postMessage("start");

        if (RUN_DURATION_SECONDS > 0) {
            stopTimeout = setTimeout(stopAndCleanup, RUN_DURATION_SECONDS * 1000);
        }
    }

    function stopAndCleanup() {
        // 強制停止邏輯
        isRunning = false;
        worker.postMessage("stop");
        if (stopTimeout) clearTimeout(stopTimeout);
        localStorage.removeItem(STORAGE_KEY_AUTO_RUN); // 再次確保清除

        statusText.innerText = `✅ 已停止`;
        statusText.style.color = "green";

        // 恢復按鈕狀態
        scheduleReloadBtn.disabled = false;
        scheduleReloadBtn.style.opacity = "1";
        immediateBtn.disabled = false;
        immediateBtn.style.opacity = "1";
        scheduleReloadBtn.innerText = `🔄 排程刷新並搶券\n(${TARGET_START_TIME})`;
        scheduleReloadBtn.style.backgroundColor = "#28a745";
        stopBtn.style.display = "none";
    }

    // -----------------------
    // 排程刷新邏輯
    // -----------------------
    function startScheduleReload() {
        if (isRunning || scheduledStartTimeout) {
            // 取消邏輯
            if (scheduledStartTimeout) clearTimeout(scheduledStartTimeout);
            scheduledStartTimeout = null;
            scheduleReloadBtn.innerText = `🔄 排程刷新並搶券\n(${TARGET_START_TIME})`;
            scheduleReloadBtn.style.backgroundColor = "#28a745";
            statusText.innerText = "已取消排程";
            statusText.style.color = "#333";
            return;
        }

        const delay = calculateDelay();

        const sec = Math.floor(delay / 1000);
        const min = Math.floor(sec / 60);
        const remain = sec % 60;

        statusText.innerText = `⏰ 剩 ${min}分${remain}秒 刷新`;
        statusText.style.color = "#17a2b8";

        scheduleReloadBtn.innerText = "等待刷新中 (取消)";
        scheduleReloadBtn.style.backgroundColor = "#ffc107";

        scheduledStartTimeout = setTimeout(() => {
            // 設定標記
            localStorage.setItem(STORAGE_KEY_AUTO_RUN, "true");
            statusText.innerText = "🔄 正在刷新網頁...";
            location.reload();
        }, delay);
    }

    // -----------------------
    // ★ 初始化檢查
    // -----------------------
    if (localStorage.getItem(STORAGE_KEY_AUTO_RUN) === "true") {
        console.log("[搶券神器] 檢測到自動刷新標記，立即啟動！");
        executeScript();
    }

    // -----------------------
    // 綁定事件
    // -----------------------
    immediateBtn.onclick = executeScript;
    scheduleReloadBtn.onclick = startScheduleReload;
    stopBtn.onclick = stopAndCleanup; // 綁定強制停止

})();