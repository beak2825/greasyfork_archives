// ==UserScript==
// @name         SwordMasters.io 安全強化版（節流/隨機丟棄/冷卻/監控）
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      3.0
// @description  保守的人類化與節流機制：隨機延遲、隨機丟棄 extra hits、冷卻、自適應限速與監控（非繞過反作弊）
// @author       huang-wei-lun
// @match        https://swordmasters.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558179/SwordMastersio%20%E5%AE%89%E5%85%A8%E5%BC%B7%E5%8C%96%E7%89%88%EF%BC%88%E7%AF%80%E6%B5%81%E9%9A%A8%E6%A9%9F%E4%B8%9F%E6%A3%84%E5%86%B7%E5%8D%BB%E7%9B%A3%E6%8E%A7%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/558179/SwordMastersio%20%E5%AE%89%E5%85%A8%E5%BC%B7%E5%8C%96%E7%89%88%EF%BC%88%E7%AF%80%E6%B5%81%E9%9A%A8%E6%A9%9F%E4%B8%9F%E6%A3%84%E5%86%B7%E5%8D%BB%E7%9B%A3%E6%8E%A7%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // === 可調參數（UI 可改） ===
    let enabled = true;
    let folded = false;

    // 節流與行為設定（可微調）
    let MAX_PPS = 20;           // 每秒最大封包量（保守）
    let RANDOM_DELAY_MIN = 15;  // ms
    let RANDOM_DELAY_MAX = 60;  // ms
    let EXTRA_DROP_CHANCE = 0.25; // 額外攻擊隨機丟棄機率（0~1），模擬手滑/漏擊
    let COOLDOWN_THRESHOLD = 60; // 如果 1 秒內發送超過此值，就進入短暫冷卻（保護）
    let COOLDOWN_SECONDS = 3;   // 冷卻秒數
    let MAX_EXTRA_ALLOWED = 10; // 額外最多 +10（總共最多 x11）

    // 內部狀態
    const schedulerQueue = [];
    let ppsCounter = 0;
    let totalSentLastSecond = 0;
    let inCooldown = false;

    // 監控歷史（簡單）
    let sentHistory = []; // timestamps ms of sends
    function recordSend() {
        const now = Date.now();
        sentHistory.push(now);
        // 保留近 60 秒資料
        const cutoff = now - 60000;
        while (sentHistory.length && sentHistory[0] < cutoff) sentHistory.shift();
    }
    function recentPerSecond() {
        const now = Date.now();
        const oneSecAgo = now - 1000;
        return sentHistory.filter(t => t >= oneSecAgo).length;
    }

    // 每秒清除 ppsCounter
    setInterval(() => { ppsCounter = 0; }, 1000);

    // Utilities
    function rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    function randFloat(min, max) {
        return Math.random() * (max - min) + min;
    }

    // 排程器：處理 queue 並遵守限速與冷卻
    function scheduleSend(ws, data) {
        schedulerQueue.push({ ws, data });
        if (schedulerQueue.length === 1) processQueue();
    }

    function processQueue() {
        if (schedulerQueue.length === 0) return;

        // 如果在冷卻中，等冷卻結束
        if (inCooldown) {
            setTimeout(processQueue, 250);
            return;
        }

        // 若超過每秒封包限制 → 延後
        if (ppsCounter >= MAX_PPS) {
            setTimeout(processQueue, 50 + rand(0, 40));
            return;
        }

        const item = schedulerQueue.shift();
        if (!item) {
            setTimeout(processQueue, rand(10, 30));
            return;
        }

        // 發送
        try {
            item.ws.__originalSend(item.data);
            ppsCounter++;
            recordSend();
        } catch (e) {
            console.warn("[SafeMult] send error:", e);
        }

        // 監控：檢查是否啟動短暫冷卻（若近 1 秒超過門檻）
        const recent = recentPerSecond();
        if (recent > COOLDOWN_THRESHOLD) {
            inCooldown = true;
            console.warn("[SafeMult] Entering cooldown: recent per sec =", recent);
            setTimeout(() => { inCooldown = false; }, COOLDOWN_SECONDS * 1000);
        }

        // 下一個處理時間：隨機延遲（人類化）
        setTimeout(processQueue, rand(RANDOM_DELAY_MIN, RANDOM_DELAY_MAX));
    }

    // UI 建立（含可調參數展示）
    function createUI() {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.bottom = '10px';
        container.style.left = '10px';
        container.style.zIndex = '10000';
        container.style.backgroundColor = 'rgba(0,0,0,0.75)';
        container.style.color = 'white';
        container.style.padding = '8px';
        container.style.borderRadius = '8px';
        container.style.fontFamily = 'Arial, sans-serif';
        container.style.fontSize = '13px';
        container.style.width = '240px';
        container.style.userSelect = 'none';

        const header = document.createElement('div');
        header.style.cursor = 'pointer';
        header.style.fontWeight = 'bold';
        header.style.marginBottom = '6px';
        container.appendChild(header);

        function updateHeader() {
            const status = enabled ? "已啟用" : "已停用";
            header.innerText = `殺人乘數 (${status}) ${folded ? "▲" : "▼"}`;
        }

        const content = document.createElement('div');

        // 啟用按鈕
        const toggleBtn = document.createElement('button');
        toggleBtn.innerText = '已啟用';
        toggleBtn.style.width = '100%';
        toggleBtn.style.padding = '6px';
        toggleBtn.style.marginBottom = '6px';
        toggleBtn.style.border = 'none';
        toggleBtn.style.borderRadius = '4px';
        toggleBtn.style.cursor = 'pointer';
        toggleBtn.style.backgroundColor = '#28a745';
        toggleBtn.style.color = 'white';
        toggleBtn.onclick = () => {
            enabled = !enabled;
            toggleBtn.innerText = enabled ? '已啟用' : '已停用';
            toggleBtn.style.backgroundColor = enabled ? '#28a745' : '#dc3545';
            updateHeader();
        };
        content.appendChild(toggleBtn);

        // slider
        const sliderWrap = document.createElement('div');
        sliderWrap.style.display = 'flex';
        sliderWrap.style.alignItems = 'center';

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '1';
        slider.max = '100';
        slider.value = '1';
        slider.style.width = '140px';
        slider.style.marginRight = '8px';
        slider.oninput = () => { valueLabel.innerText = 'x' + slider.value; };
        sliderWrap.appendChild(slider);

        const valueLabel = document.createElement('div');
        valueLabel.innerText = 'x1';
        sliderWrap.appendChild(valueLabel);
        content.appendChild(sliderWrap);

        // 額外丟棄率（顯示）
        const dropRow = document.createElement('div');
        dropRow.style.marginTop = '6px';
        dropRow.style.fontSize = '12px';
        dropRow.innerText = `丟棄率: ${Math.round(EXTRA_DROP_CHANCE*100)}%  最大額外: ${MAX_EXTRA_ALLOWED}`;
        content.appendChild(dropRow);

        // 監控資訊
        const monitor = document.createElement('div');
        monitor.style.marginTop = '6px';
        monitor.style.fontSize = '12px';
        monitor.style.lineHeight = '1.3';
        content.appendChild(monitor);

        // 折疊功能
        header.onclick = () => {
            folded = !folded;
            content.style.display = folded ? 'none' : 'block';
            updateHeader();
        };

        // 初始
        updateHeader();
        container.appendChild(content);
        document.body.appendChild(container);

        // 每 800ms 更新監控畫面
        setInterval(() => {
            const qlen = schedulerQueue.length;
            const recent1 = recentPerSecond();
            monitor.innerText = `Queue: ${qlen}  PPS(now): ${recent1}  冷卻: ${inCooldown ? "ON" : "OFF"}`;
        }, 800);

        // 返回 slider 讓主程式使用
        return { slider };
    }

    const ui = createUI();

    // Hook WebSocket（採用排程器發送）
    const OldSend = WebSocket.prototype.send;
    WebSocket.prototype.__originalSend = OldSend;

    WebSocket.prototype.send = function (data) {
        // 嘗試解析為字串
        let msg = "";
        try {
            if (typeof data === "string") msg = data;
            else if (data instanceof ArrayBuffer || ArrayBuffer.isView(data)) msg = new TextDecoder().decode(data);
            else msg = data.toString();
        } catch (e) {
            msg = "";
        }

        if (!enabled) {
            // 直接發送但仍由原始函式
            return this.__originalSend(data);
        }

        // 若是攻擊訊息，則套用人類化規則
        if (msg.includes("Client:EnemyController:checkDamage")) {
            // 先排入一次原始攻擊
            scheduleSend(this, data);

            // 計算 target（限制最大為 slider 值與 MAX_EXTRA_ALLOWED）
            let target = Math.min(parseInt(ui.slider.value, 10), MAX_EXTRA_ALLOWED + 1); // 因為包含第 1 次
            let lastValue = 1;

            while (lastValue < target) {
                lastValue = lastValue + 1;

                // 隨機丟棄 extra hit（模擬失誤）
                if (Math.random() < EXTRA_DROP_CHANCE) {
                    // 略過這次 extra
                } else {
                    // 如果 queue 太長或正在冷卻，則不再排太多，降低風險
                    if (schedulerQueue.length > 150 || inCooldown) {
                        // 以較高機率直接丟棄
                        if (Math.random() < 0.6) {
                            // skip
                        } else {
                            scheduleSend(this, data);
                        }
                    } else {
                        scheduleSend(this, data);
                    }
                }
            }
            return;
        }

        // 其他訊息一樣走排程器以維持一致性
        scheduleSend(this, data);
    };

    // Console 小提示與警告
    console.log("[SafeMult] 已啟動（保守模式）");
    console.log("[SafeMult] 設定：MAX_PPS=", MAX_PPS, " drop=", EXTRA_DROP_CHANCE, " cooldownTh=", COOLDOWN_THRESHOLD);

})();
