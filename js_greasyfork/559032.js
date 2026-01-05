// ==UserScript==
// @name         KKTIX BOT (v10.1 - 自動刷新版)
// @namespace    http://tampermonkey.net/
// @version      10.1
// @description  移除直通購票，新增自訂間隔的自動刷新功能。偵測到購票頁面會自動停止刷新。
// @author       You
// @match        https://kktix.com/*
// @match        https://*.kktix.com/*
// @match        https://*.kktix.cc/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kktix.com
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559032/KKTIX%20BOT%20%28v101%20-%20%E8%87%AA%E5%8B%95%E5%88%B7%E6%96%B0%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559032/KKTIX%20BOT%20%28v101%20-%20%E8%87%AA%E5%8B%95%E5%88%B7%E6%96%B0%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 全局變數 ===
    let autoBuyInterval = null;
    let refreshTimer = null;

    // === 0. 攔截系統彈窗 ===
    const win = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
    win.alert = function(msg) {
        console.log("🚫 [KKTIX BOT] 已攔截系統彈窗:", msg);
        return true;
    };

    // === 設定檔存取鍵值 ===
    const KEY_COUNT = 'cfg_count';
    const KEY_KEYWORD = 'cfg_keyword';
    const KEY_AUTO = 'cfg_auto';
    const KEY_TIME = 'cfg_time';
    const KEY_LAST_SNIPE = 'cfg_last_snipe';
    const KEY_REFRESH_RATE = 'cfg_refresh_rate';   // 新增：刷新頻率
    const KEY_REFRESH_ACTIVE = 'cfg_refresh_active'; // 新增：刷新開關狀態

    // === 伺服器時間校正 ===
    let timeOffset = 0;
    function syncServerTime() {
        fetch(window.location.href, { method: 'HEAD' }).then(response => {
            const serverDateStr = response.headers.get('Date');
            if (serverDateStr) {
                const serverTime = new Date(serverDateStr).getTime();
                const localTime = Date.now();
                timeOffset = serverTime - localTime;
            }
        }).catch(err => console.log("無法校正時間", err));
    }

    // === 介面樣式 ===
    const style = document.createElement('style');
    style.innerHTML = `
        #bot-panel {
            position: fixed; top: 100px; right: 20px;
            background: rgba(20, 20, 20, 0.95); color: #fff;
            padding: 20px; border-radius: 10px; z-index: 99999;
            font-size: 14px; box-shadow: 0 4px 15px rgba(0,0,0,0.6);
            width: 350px; border: 1px solid #555;
            font-family: "Microsoft JhengHei", sans-serif;
            box-sizing: border-box;
        }
        #bot-panel * { box-sizing: border-box; }
        #bot-panel h3 {
            margin: 0 0 10px 0; font-size: 18px; color: #00d1b2;
            text-align: center; border-bottom: 1px solid #555; padding-bottom: 10px;
        }
        #server-clock {
            text-align: center; font-size: 24px; font-family: monospace;
            color: #ffeb3b; margin-bottom: 15px; font-weight: bold; text-shadow: 0 0 5px #ffeb3b;
            background: #000; padding: 5px; border-radius: 4px; border: 1px solid #444;
        }
        #bot-panel .row { margin-bottom: 12px; }
        #bot-panel label { display: block; margin-bottom: 5px; font-weight: bold; color: #ddd; }
        #bot-panel input[type="text"], #bot-panel input[type="number"] {
            width: 100%; padding: 8px; border: 1px solid #666;
            border-radius: 4px; background: #222; color: #fff; font-size: 14px;
        }
        #cfg-target-time { color: #e91e63 !important; font-weight: bold; letter-spacing: 1px; }

        .checkbox-group { display: flex; flex-direction: column; gap: 8px; margin-top: 15px; background: #333; padding: 10px; border-radius: 4px; }
        .checkbox-row { display: flex; align-items: center; }
        .checkbox-row input { width: 18px; height: 18px; margin-right: 10px; cursor: pointer; }
        .checkbox-row label { margin: 0; cursor: pointer; color: #fff; font-size: 14px; }
        .btn-group { display: flex; gap: 10px; margin-top: 15px; }
        #bot-panel button {
            flex: 1; padding: 10px; border: none; color: white; border-radius: 4px;
            cursor: pointer; font-weight: bold; font-size: 14px; transition: background 0.2s;
        }
        #btn-save { background: #00d1b2; }
        #btn-save:hover { background: #00b89c; }
        
        /* 刷新按鈕樣式 */
        #btn-refresh-toggle { background: #555; cursor: pointer; border: 1px solid #777; }
        #btn-refresh-toggle:hover { background: #666; }
        #btn-refresh-toggle.active { background: #e91e63; animation: pulse 1s infinite; border-color: #ff4081; }

        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(233, 30, 99, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(233, 30, 99, 0); }
            100% { box-shadow: 0 0 0 0 rgba(233, 30, 99, 0); }
        }

        #bot-status { margin-top: 12px; font-size: 13px; color: #aaa; text-align: center; background: #222; padding: 6px; border-radius: 4px; }
        .running-mode { border: 2px solid #e91e63 !important; box-shadow: 0 0 15px rgba(233, 30, 99, 0.5) !important; }
    `;
    document.head.appendChild(style);

    // === 1. 建立 UI 面板 ===
    function createPanel() {
        if (document.getElementById('bot-panel')) return;
        if (!document.body) { setTimeout(createPanel, 100); return; }

        const div = document.createElement('div');
        div.id = 'bot-panel';

        // 讀取設定
        const savedCount = GM_getValue(KEY_COUNT, 4);
        const savedKeyword = GM_getValue(KEY_KEYWORD, '');
        const savedAutoSubmit = GM_getValue(KEY_AUTO, true);
        const savedTargetTime = GM_getValue(KEY_TIME, '');
        const savedRefreshRate = GM_getValue(KEY_REFRESH_RATE, 2000); // 預設 2秒
        const isRefreshActive = GM_getValue(KEY_REFRESH_ACTIVE, false);

        div.innerHTML = `
            <h3>⚡ KKTIX BOT v10.1</h3>
            <div id="server-clock">00:00:00.0</div>

            <div class="row">
                <label>⏰ 定時刷新 (狙擊用):</label>
                <input type="text" id="cfg-target-time" value="${savedTargetTime}" placeholder="例 12:00:00 (留空關閉)">
            </div>
            
            <div class="row">
                <label>🔄 自動刷新間隔 (毫秒):</label>
                <input type="number" id="cfg-refresh-rate" value="${savedRefreshRate}" placeholder="預設: 2000 (2秒)">
            </div>

            <div class="row">
                <label>🎫 搶票張數:</label>
                <input type="number" id="cfg-count" value="${savedCount}" min="1" max="4">
            </div>
            <div class="row">
                <label>🔍 關鍵字 (例: A區):</label>
                <input type="text" id="cfg-keyword" value="${savedKeyword}" placeholder="留空則選第一個">
            </div>

            <div class="checkbox-group">
                <div class="checkbox-row">
                    <input type="checkbox" id="cfg-auto-submit" ${savedAutoSubmit ? 'checked' : ''}>
                    <label for="cfg-auto-submit">選完自動按下一步</label>
                </div>
            </div>

            <div class="btn-group">
                <button id="btn-save">💾 儲存設定</button>
                <button id="btn-refresh-toggle">${isRefreshActive ? '🛑 停止刷新' : '🔄 開始刷新'}</button>
            </div>
            <div id="bot-status">等待操作...</div>
        `;
        document.body.appendChild(div);

        // 初始化按鈕狀態
        const refreshBtn = document.getElementById('btn-refresh-toggle');
        if (isRefreshActive) refreshBtn.classList.add('active');

        // === 事件監聽：儲存設定 ===
        document.getElementById('btn-save').addEventListener('click', () => {
            GM_setValue(KEY_COUNT, document.getElementById('cfg-count').value);
            GM_setValue(KEY_KEYWORD, document.getElementById('cfg-keyword').value);
            GM_setValue(KEY_AUTO, document.getElementById('cfg-auto-submit').checked);
            GM_setValue(KEY_TIME, document.getElementById('cfg-target-time').value);
            GM_setValue(KEY_REFRESH_RATE, document.getElementById('cfg-refresh-rate').value); // 儲存刷新頻率

            GM_setValue(KEY_LAST_SNIPE, 0); // 重置狙擊鎖
            updateStatus("✅ 全域設定已儲存！", "#00d1b2");
        });

        // === 事件監聽：刷新開關 ===
        refreshBtn.addEventListener('click', () => {
            const currentState = GM_getValue(KEY_REFRESH_ACTIVE, false);
            const newState = !currentState;
            GM_setValue(KEY_REFRESH_ACTIVE, newState);

            // 更新 UI
            refreshBtn.innerText = newState ? '🛑 停止刷新' : '🔄 開始刷新';
            if (newState) {
                refreshBtn.classList.add('active');
                updateStatus("🚀 自動刷新已啟動", "#e91e63");
                // 如果開啟，立即執行一次 Reload 或啟動邏輯
                handleAutoRefresh();
            } else {
                refreshBtn.classList.remove('active');
                updateStatus("⏹️ 自動刷新已停止", "#aaa");
                if (refreshTimer) clearTimeout(refreshTimer);
            }
        });
    }

    // === 自動刷新邏輯 ===
    function handleAutoRefresh() {
        const isActive = GM_getValue(KEY_REFRESH_ACTIVE, false);
        if (!isActive) return;

        // 安全檢查：如果是購票頁面 (/registrations)，強制停止刷新
        if (window.location.href.includes('/registrations')) {
            console.log("[KKTIX BOT] 偵測到購票頁面，強制停止自動刷新！");
            GM_setValue(KEY_REFRESH_ACTIVE, false); // 關閉開關
            updateStatus("✅ 進入購票頁面，停止刷新！", "#00d1b2");
            
            // 更新按鈕樣式 (如果 UI 已建立)
            const btn = document.getElementById('btn-refresh-toggle');
            if (btn) {
                btn.innerText = '🔄 開始刷新';
                btn.classList.remove('active');
            }
            return;
        }

        // 讀取刷新頻率
        let rate = parseInt(GM_getValue(KEY_REFRESH_RATE, 2000));
        if (isNaN(rate) || rate < 100) rate = 2000; // 避免設定太快導致當機

        updateStatus(`⏳ ${rate}ms 後刷新頁面...`, "#ff9800");

        refreshTimer = setTimeout(() => {
            window.location.reload();
        }, rate);
    }

    // === 時鐘更新 ===
    function startClock() {
        const clockEl = document.getElementById('server-clock');
        if (window.clockInterval) clearInterval(window.clockInterval);

        window.clockInterval = setInterval(() => {
            const now = new Date(Date.now() + timeOffset);

            if(clockEl) {
                const timeStr = now.toTimeString().split(' ')[0];
                const ms = Math.floor(now.getMilliseconds() / 100);
                clockEl.innerText = `${timeStr}.${ms}`;
            }

            // 狙擊
            const targetTimeStr = GM_getValue(KEY_TIME, '');
            if (targetTimeStr) {
                const [h, m, s] = targetTimeStr.split(':').map(Number);
                const targetDate = new Date(now.getTime());
                targetDate.setHours(h, m, s, 0);

                if (now >= targetDate && (now - targetDate) < 60000) {
                    const lastSnipe = parseInt(GM_getValue(KEY_LAST_SNIPE, 0));
                    if (Date.now() - lastSnipe > 60000) {
                        console.log(">>> [KKTIX BOT] 時間到！執行狙擊刷新！");
                        updateStatus("⚡ 時間到！刷新中...", "#e91e63");
                        GM_setValue(KEY_LAST_SNIPE, Date.now());
                        location.reload();
                    }
                }
            }
        }, 50);
        setInterval(syncServerTime, 30000);
    }

    function updateStatus(text, color = "#aaa") {
        const el = document.getElementById('bot-status');
        if(el) { el.innerText = text; el.style.color = color; }
    }

    // === 搶票核心 ===
    function runAutoBuy() {
        if (autoBuyInterval) clearInterval(autoBuyInterval);

        const panel = document.getElementById('bot-panel');
        if(panel) panel.classList.add('running-mode');

        const TARGET_COUNT = parseInt(GM_getValue(KEY_COUNT, 4));
        const TARGET_KEYWORD = GM_getValue(KEY_KEYWORD, '');
        const AUTO_SUBMIT = GM_getValue(KEY_AUTO, true);

        const startTime = Date.now();
        updateStatus(`🚀 偵測中...找: ${TARGET_KEYWORD || "任意"}`, "#e91e63");

        let hasExecuted = false;

        autoBuyInterval = setInterval(() => {
            if (hasExecuted) { clearInterval(autoBuyInterval); return; }

            const ticketUnits = document.querySelectorAll('.ticket-unit');
            if (ticketUnits.length > 0) {
                let targetPlusBtn = null;

                if (TARGET_KEYWORD) {
                    for (let unit of ticketUnits) {
                        if (unit.innerText.includes(TARGET_KEYWORD)) {
                            const btn = unit.querySelector('button.btn-default.plus');
                            if (btn && !btn.disabled) { targetPlusBtn = btn; break; }
                        }
                    }
                }
                if (!targetPlusBtn) {
                    const allPlusBtns = document.querySelectorAll('button.btn-default.plus');
                    for(let btn of allPlusBtns) if(!btn.disabled) { targetPlusBtn = btn; break; }
                }

                if (targetPlusBtn) {
                    hasExecuted = true;
                    clearInterval(autoBuyInterval);

                    // 停止任何可能的刷新計時器
                    if (refreshTimer) clearTimeout(refreshTimer);
                    GM_setValue(KEY_REFRESH_ACTIVE, false); // 確保找到票後關閉刷新

                    for(let i = 0; i < TARGET_COUNT; i++) targetPlusBtn.click();

                    const agreeCheckbox = document.getElementById('person_agree_terms');
                    if (agreeCheckbox) agreeCheckbox.click();

                    updateStatus("✅ 已選票！", "#00d1b2");

                    if (AUTO_SUBMIT) {
                        const nextBtn = document.querySelector('button.btn-primary');
                        if (nextBtn && !nextBtn.disabled) {
                            setTimeout(() => nextBtn.click(), 100);
                            updateStatus("🚀 送出中...", "#e91e63");
                        }
                    } else {
                        updateStatus("✋ 等待手動送出", "#00d1b2");
                    }
                }
            }
        }, 100);
    }

    // === 初始化 ===
    function init() {
        syncServerTime();
        createPanel();
        startClock();
        
        // 檢查是否需要執行自動刷新 (如果在活動頁面)
        if (!window.location.href.includes('/registrations')) {
            handleAutoRefresh();
        } else {
            // 如果已經在購票頁面，執行搶票邏輯
            runAutoBuy();
            // 並確保刷新開關是關閉的
            GM_setValue(KEY_REFRESH_ACTIVE, false);
        }
    }

    window.addEventListener('load', init);
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) init();
    });

})();