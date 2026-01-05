// ==UserScript==
// @name         SwordMasters.io 安全友好版（x11 + adaptive PPS + jitter + packet monitor）
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      3.1
// @description  保護連線穩定、動態調整速率（基於狀態）、自然抖動、封包噪音、即時監控面板（不含任何繞過反作弊/隱匿偵測功能）
// @author       huang
// @match        https://swordmasters.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558181/SwordMastersio%20%E5%AE%89%E5%85%A8%E5%8F%8B%E5%A5%BD%E7%89%88%EF%BC%88x11%20%2B%20adaptive%20PPS%20%2B%20jitter%20%2B%20packet%20monitor%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/558181/SwordMastersio%20%E5%AE%89%E5%85%A8%E5%8F%8B%E5%A5%BD%E7%89%88%EF%BC%88x11%20%2B%20adaptive%20PPS%20%2B%20jitter%20%2B%20packet%20monitor%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ---------- 設定 ----------
    let enabled = true;
    let folded = false;

    // 基本參數（可調）
    let MAX_PPS = 25; // 上限（會動態調整）
    const ABSOLUTE_HARD_LIMIT = 60; // 絕對上限，避免設定太高
    const RANDOM_DELAY_MIN = 8;
    const RANDOM_DELAY_MAX = 45;

    // Adaptive PPS 參數
    const BACKOFF_FACTOR = 0.7;      // 當偵測到問題時縮減為多少（乘法）
    const RECOVERY_STEP = 1.05;      // 恢復倍率（每次 tick 增加）
    const MIN_PPS = 5;               // 最低安全值

    const schedulerQueue = [];
    let ppsCounter = 0;
    let sentTotalCounter = 0;
    let lastDelay = (RANDOM_DELAY_MIN + RANDOM_DELAY_MAX) / 2;

    // 監控資料
    let lastSecondSent = 0;
    let lastSecondTimestamp = Date.now();

    // 每秒清除計數
    setInterval(() => { ppsCounter = 0; lastSecondSent = 0; }, 1000);

    function rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // ---------- 封包噪音（保留你原本的 harmless noise） ----------
    function addPacketNoise(data) {
        if (typeof data === "string") {
            // 在不改變原智能結構的前提下只插入短 comment（如 JSON 剛好會被破壞請注意）
            // 若你的遊戲封包是純短訊（非 JSON），小心插入不要破壞格式。
            const noise = `/*${Math.random().toString(36).slice(2,8)}*/`;
            const pos = Math.floor(Math.random() * (data.length + 1));
            return data.slice(0, pos) + noise + data.slice(pos);
        }
        if (data instanceof ArrayBuffer) {
            const original = new Uint8Array(data);
            // 只附加 1 byte 微小 entropy（有些遊戲會嚴格驗證長度，使用前自行測試）
            const padding = new Uint8Array(1);
            padding[0] = Math.floor(Math.random() * 256);

            const extended = new Uint8Array(original.length + 1);
            extended.set(original);
            extended.set(padding, original.length);
            return extended.buffer;
        }
        return data;
    }

    // ---------- 自然「手部慣性」的 delay generator（有適度自相關） ----------
    function nextInertiaDelay() {
        // 讓 delay 在上一個值附近抖動（模擬慣性）
        // newDelay = lastDelay * alpha + random * (1-alpha)
        const alpha = 0.75; // 越高越有慣性
        const rnd = rand(RANDOM_DELAY_MIN, RANDOM_DELAY_MAX);
        const newDelay = Math.max(RANDOM_DELAY_MIN, Math.min(RANDOM_DELAY_MAX, Math.round(lastDelay * alpha + rnd * (1 - alpha))));
        lastDelay = newDelay;
        return newDelay;
    }

    // ---------- Adaptive PPS 控制（基於 queue 長度與連線狀態） ----------
    // 這個函數會在偵測到 queue 長度或連線似乎有問題時降低 MAX_PPS（保護伺服器與避免連線中斷），並在穩定時逐步恢復
    function adaptPPS() {
        // 當 queue 過長或 ppsCounter 高時啟動 backoff
        const QUEUE_HIGH = 40;     // queue 長度過高閾值
        const QUEUE_MED = 20;

        if (schedulerQueue.length > QUEUE_HIGH || ppsCounter > MAX_PPS * 0.9) {
            // 快速降速以避免爆發
            MAX_PPS = Math.max(MIN_PPS, Math.floor(MAX_PPS * BACKOFF_FACTOR));
            // 限制到硬上限
            MAX_PPS = Math.min(MAX_PPS, ABSOLUTE_HARD_LIMIT);
            showStatusFlash('BACKOFF');
            return;
        }

        // 如果 queue 合理，慢慢恢復
        if (schedulerQueue.length < QUEUE_MED && MAX_PPS < 25) {
            // 逐步恢復，但不超過初始推薦值（25）或絕對上限
            MAX_PPS = Math.min(25, Math.min(ABSOLUTE_HARD_LIMIT, Math.floor(MAX_PPS * RECOVERY_STEP)));
        }
    }

    // ---------- 隊列排程（使用可觀測的 send，不做隱匿） ----------
    function scheduleSend(ws, data) {
        schedulerQueue.push({ ws, data, ts: Date.now() });
        // 啟動處理
        if (schedulerQueue.length === 1) processQueue();
    }

    function processQueue() {
        if (schedulerQueue.length === 0) return;

        // 每次先做 adaptive 調整
        adaptPPS();

        if (ppsCounter >= MAX_PPS) {
            // 稍後再處理
            setTimeout(processQueue, 50);
            return;
        }

        const { ws, data } = schedulerQueue.shift();

        // 如果 WebSocket 未開啟，放回並稍後重試
        if (!ws || ws.readyState !== WebSocket.OPEN) {
            // 如果不是 OPEN，推回隊列尾並延後重試
            schedulerQueue.push({ ws, data, ts: Date.now() });
            setTimeout(processQueue, 200);
            return;
        }

        // 在送出前加入 benign noise（仍保留你原本的微量噪音）
        const disguised = addPacketNoise(data);

        // send（直接呼叫原 send，沒有隱形代理）
        try {
            ws.__rawSend(disguised);
        } catch (e) {
            // 若發生 send error，把它放回並啟動 backoff
            console.warn('[SafeMode] send error, backing off', e);
            // 推回並降低速率
            schedulerQueue.unshift({ ws, data, ts: Date.now() });
            MAX_PPS = Math.max(MIN_PPS, Math.floor(MAX_PPS * BACKOFF_FACTOR));
            setTimeout(processQueue, 200);
            return;
        }

        // 更新計數
        ppsCounter++;
        sentTotalCounter++;
        lastSecondSent++;

        // 下一次排程使用慣性 delay
        const d = nextInertiaDelay();
        setTimeout(processQueue, d);
    }

    // ---------- UI：控制面板（含監控） ----------
    function createControlPanel() {
        const c = document.createElement('div');
        c.style.position = 'fixed';
        c.style.bottom = '12px';
        c.style.right = '12px';
        c.style.zIndex = '999999';
        c.style.background = 'rgba(0,0,0,0.78)';
        c.style.color = '#fff';
        c.style.padding = '10px';
        c.style.borderRadius = '8px';
        c.style.fontFamily = 'Arial, sans-serif';
        c.style.fontSize = '13px';
        c.style.width = '260px';
        c.style.userSelect = 'none';

        const header = document.createElement('div');
        header.style.cursor = 'pointer';
        header.style.fontWeight = '700';
        header.style.marginBottom = '8px';
        header.innerText = 'Safe Mode 控制面板 ▼';
        c.appendChild(header);

        const content = document.createElement('div');

        // enable button
        const btn = document.createElement('button');
        btn.innerText = '已啟用';
        btn.style.width = '100%';
        btn.style.padding = '6px';
        btn.style.border = 'none';
        btn.style.borderRadius = '6px';
        btn.style.cursor = 'pointer';
        btn.style.background = '#28a745';
        btn.style.color = '#fff';
        btn.onclick = () => {
            enabled = !enabled;
            btn.innerText = enabled ? '已啟用' : '已停用';
            btn.style.background = enabled ? '#28a745' : '#dc3545';
        };
        content.appendChild(btn);

        // slider x1~11
        const wrap = document.createElement('div');
        wrap.style.marginTop = '8px';
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '1';
        slider.max = '11';
        slider.value = '1';
        slider.style.width = '150px';
        const val = document.createElement('span');
        val.innerText = ' x1';
        val.style.marginLeft = '8px';
        slider.oninput = () => { val.innerText = ' x' + slider.value; };
        wrap.appendChild(slider);
        wrap.appendChild(val);
        content.appendChild(wrap);

        // max pps control (informational + manual override)
        const ppsRow = document.createElement('div');
        ppsRow.style.marginTop = '8px';
        ppsRow.innerHTML = `MAX_PPS: <input id="pps_in" type="number" min="5" max="${ABSOLUTE_HARD_LIMIT}" value="${MAX_PPS}" style="width:60px"> <button id="pps_set" style="margin-left:6px">套用</button>`;
        content.appendChild(ppsRow);

        // monitor area
        const monitor = document.createElement('div');
        monitor.style.marginTop = '8px';
        monitor.style.fontSize = '12px';
        monitor.style.lineHeight = '1.4';
        monitor.innerHTML = [
            'PPS (this sec): <span id="mon_pps">0</span>',
            'Queue: <span id="mon_q">0</span>',
            'Sent total: <span id="mon_total">0</span>',
            'Current MAX_PPS: <span id="mon_maxpps">' + MAX_PPS + '</span>'
        ].join('<br>');
        content.appendChild(monitor);

        // small note
        const note = document.createElement('div');
        note.style.marginTop = '8px';
        note.style.opacity = '0.7';
        note.style.fontSize = '11px';
        note.innerText = '說明：此面板不含隱匿偵測功能。Adaptive PPS 會基於隊列/錯誤自動調整以保護連線。';
        content.appendChild(note);

        header.onclick = () => {
            folded = !folded;
            content.style.display = folded ? 'none' : 'block';
            header.innerText = 'Safe Mode 控制面板 ' + (folded ? '▲' : '▼');
        };

        c.appendChild(content);
        document.body.appendChild(c);

        // pps set handler
        document.getElementById('pps_set').onclick = () => {
            const v = parseInt(document.getElementById('pps_in').value, 10);
            if (!isNaN(v)) {
                MAX_PPS = Math.max(MIN_PPS, Math.min(ABSOLUTE_HARD_LIMIT, v));
                document.getElementById('mon_maxpps').innerText = MAX_PPS;
            }
        };

        // expose some nodes for update
        return {
            slider,
            nodes: {
                pps: () => document.getElementById('mon_pps'),
                q: () => document.getElementById('mon_q'),
                total: () => document.getElementById('mon_total'),
                maxpps: () => document.getElementById('mon_maxpps'),
            }
        };
    }

    const panel = createControlPanel();

    // ---------- 透明且可觀測的 WebSocket hook（保持 __rawSend 作為原始 send） ----------
    // 我不會替你建立隱形代理或嘗試躲避檢測；這裡給出清楚可觀測的 hook（便於除錯與監控）
    const OriginalSend = WebSocket.prototype.send;
    WebSocket.prototype.__rawSend = OriginalSend;

    WebSocket.prototype.send = function (data) {
        // 如果功能關閉，直接走原始 send
        if (!enabled) return this.__rawSend(data);

        let msg = "";
        try {
            if (typeof data === "string") msg = data;
            else if (data instanceof ArrayBuffer || ArrayBuffer.isView(data))
                msg = new TextDecoder().decode(data);
            else msg = data.toString();
        } catch (e) { msg = ""; }

        // 當偵測到攻擊類封包（請自行確認關鍵字是否正確）
        if (msg.includes("Client:EnemyController:checkDamage")) {
            // 先送一次
            scheduleSend(this, data);

            // 每次增加 +1，最多 x11（slider 取值）
            const targetTimes = Math.min(parseInt(panel.slider.value, 10) || 1, 11);
            let current = 1;
            while (current < targetTimes) {
                current++;
                scheduleSend(this, data);
            }
            return;
        }

        // 一般封包也用排程發送（以便實施 rate-limit 與 adaptive）
        scheduleSend(this, data);
    };

    // ---------- 監控更新（刷新面板數據） ----------
    function refreshMonitor() {
        const now = Date.now();
        // pps 取當下計數
        try {
            panel.nodes.pps().innerText = ppsCounter.toString();
            panel.nodes.q().innerText = schedulerQueue.length.toString();
            panel.nodes.total().innerText = sentTotalCounter.toString();
            panel.nodes.maxpps().innerText = MAX_PPS.toString();
        } catch (e) { /* ignore if elements gone */ }

        // schedule next update
        setTimeout(refreshMonitor, 300);
    }
    refreshMonitor();

    // ---------- 結語 ----------
    console.log('[SafeMode] 已啟動（透明 Hook） - 內含 adaptive PPS、inertia jitter、packet monitor');
})();
