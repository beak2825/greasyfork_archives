// ==UserScript==
// @name         TSDM論壇自動點擊廣告 v3.0
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  簡化版：自動點廣告+領獎，手動關閉廣告
// @author       You
// @match        https://www.tsdm39.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555661/TSDM%E8%AB%96%E5%A3%87%E8%87%AA%E5%8B%95%E9%BB%9E%E6%93%8A%E5%BB%A3%E5%91%8A%20v30.user.js
// @updateURL https://update.greasyfork.org/scripts/555661/TSDM%E8%AB%96%E5%A3%87%E8%87%AA%E5%8B%95%E9%BB%9E%E6%93%8A%E5%BB%A3%E5%91%8A%20v30.meta.js
// ==/UserScript==
/*
 * v3.0 版本更新說明：
 * ✅ 簡化功能：只保留自動點廣告 + 自動領獎
 * ✅ 智能判斷：在打工頁面直接執行，其他頁面顯示 UI
 * ✅ 移除所有關閉廣告的功能（手動關閉）
 * ✅ 只使用 element.click() 模擬點擊
 *
 * 執行邏輯：
 * 1. 檢查當前網址
 * 2. 如果是打工頁面 → 延遲 2 秒後自動執行
 * 3. 如果不是 → 創建 UI，等待用戶點擊
 * 4. 點擊廣告 → 領取獎勵 → 完成
 */
(function() {
    'use strict';
    // 只在頂層視窗執行
    if (window.self !== window.top) {
        console.log('[TSDM自動打工] 偵測到內嵌頁面，跳過執行');
        return;
    }
    console.log('[TSDM自動打工] 腳本已載入 v3.0');
    const adSelectors = [
        '#np_advid1 > a > img',
        '#np_advid2 > a > img',
        '#np_advid4 > a > img',
        '#np_advid6 > a > img',
        '#np_advid7 > a > img',
        '#np_advid9 > a > img'
    ];
    const WORK_URL = 'https://www.tsdm39.com/plugin.php?id=np_cliworkdz:work';
    let floatingButton = null;
    let controlPanel = null;
    let currentY = 200;
    let isWorking = false;
    // ═══════════════════════════════════════════════════════════════
    // v3.0 核心：智能判斷執行模式
    // ═══════════════════════════════════════════════════════════════
    function init() {
        console.log('[TSDM自動打工] 初始化腳本 v3.0');
        // 檢查是否在打工頁面
        const isWorkPage = window.location.href.indexOf(WORK_URL) !== -1;
        if (isWorkPage) {
            // 在打工頁面：檢查是否有廣告（判斷時間是否到了）
            console.log('[TSDM自動打工] 偵測到打工頁面，檢查廣告是否存在...');

            setTimeout(() => {
                const firstAd = document.querySelector(adSelectors[0]);

                if (firstAd) {
                    console.log('[TSDM自動打工] 廣告存在，開始自動執行');
                    startAutoWork();
                } else {
                    console.log('[TSDM自動打工] 廣告不存在（時間未到或已完成），不執行');
                }
            }, 2000);  // 等待 2 秒確保頁面載入完成
        } else {
            // 不在打工頁面：創建 UI
            console.log('[TSDM自動打工] 不在打工頁面，創建 UI');
            createFloatingButton();
            createControlPanel();
        }
    }
    // ═══════════════════════════════════════════════════════════════
    // UI 創建函數
    // ═══════════════════════════════════════════════════════════════
    function createFloatingButton() {
        if (floatingButton) return;
        floatingButton = $(`
            <div id="tsdm-floating-button" style="
                position: fixed; right: 0; top: ${currentY}px;
                width: 50px; height: 50px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white; border-radius: 50% 0 0 50%;
                display: flex; align-items: center; justify-content: center;
                cursor: pointer; z-index: 999999; font-size: 24px;
                box-shadow: -2px 2px 10px rgba(0,0,0,0.3);
                transition: all 0.3s ease; user-select: none;
            ">🏅</div>
        `);
        floatingButton.on('mouseenter', function() {
            $(this).css('transform', 'scale(1.1)');
        }).on('mouseleave', function() {
            $(this).css('transform', 'scale(1)');
        }).on('click', function() {
            toggleControlPanel();
        });
        // 拖曳功能
        let isDragging = false, startY = 0;
        floatingButton.on('mousedown', function(e) {
            isDragging = true;
            startY = e.clientY - currentY;
            $(this).css('cursor', 'grabbing');
        });
        $(document).on('mousemove', function(e) {
            if (isDragging) {
                currentY = Math.max(0, Math.min(e.clientY - startY, window.innerHeight - 50));
                floatingButton.css('top', currentY + 'px');
            }
        }).on('mouseup', function() {
            if (isDragging) {
                isDragging = false;
                floatingButton.css('cursor', 'pointer');
            }
        });
        $('body').append(floatingButton);
        console.log('[TSDM自動打工] 浮動按鈕已創建');
    }
    function createControlPanel() {
        if (controlPanel) return;
        controlPanel = $(`
            <div id="tsdm-control-panel" style="
                position: fixed; right: 60px; top: ${currentY}px; width: 320px;
                background: white; border-radius: 10px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                z-index: 999999; font-family: Arial, sans-serif; display: none;
            ">
                <div style="
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white; padding: 15px; border-radius: 10px 10px 0 0;
                    font-weight: bold; font-size: 16px;
                ">
                    🏅 TSDM 自動打工控制面板 v3.0
                </div>
                <div style="padding: 20px;">
                    <div id="tsdm-status" style="
                        padding: 10px; background: #f0f0f0; border-radius: 5px;
                        margin-bottom: 15px; font-size: 14px; color: #333;
                    ">狀態：待命中</div>
                    <div id="tsdm-log" style="
                        max-height: 200px; overflow-y: auto; background: #fafafa;
                        border: 1px solid #e0e0e0; border-radius: 5px; padding: 10px;
                        margin-bottom: 15px; font-size: 12px; font-family: monospace; color: #555;
                    ">
                        <div style="color: #888;">等待操作...</div>
                    </div>
                    <button id="tsdm-start-btn" style="
                        width: 100%; padding: 12px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white; border: none; border-radius: 5px; cursor: pointer;
                        font-size: 14px; font-weight: bold;
                    ">開始自動打工</button>
                    <div style="margin-top: 10px; padding: 10px; background: #fff3cd;
                        border-radius: 5px; font-size: 12px; color: #856404;">
                        💡 提示：廣告視窗需手動關閉（Ctrl+W）
                    </div>
                </div>
            </div>
        `);
        controlPanel.find('#tsdm-start-btn').on('click', function() {
            addLog('🚀 準備前往打工頁面...', 'info');
            addLog('💡 到達後將自動執行', 'info');

            setTimeout(() => {
                window.location.href = WORK_URL;
            }, 1000);
        });
        $('body').append(controlPanel);
        console.log('[TSDM自動打工] 控制面板已創建');
    }
    function toggleControlPanel() {
        if (!controlPanel) createControlPanel();
        controlPanel.is(':visible') ? controlPanel.fadeOut(200) : controlPanel.fadeIn(200);
    }
    // ═══════════════════════════════════════════════════════════════
    // 日誌與狀態函數
    // ═══════════════════════════════════════════════════════════════
    function addLog(message, type = 'info') {
        const logDiv = $('#tsdm-log');
        if (logDiv.length === 0) {
            console.log(`[TSDM自動打工] ${message}`);
            return;
        }
        const timestamp = new Date().toLocaleTimeString();
        const colors = {success: '#28a745', error: '#dc3545', warning: '#ffc107', info: '#17a2b8'};

        logDiv.append($(`<div style="color: ${colors[type] || '#555'}; margin-bottom: 5px;">[${timestamp}] ${message}</div>`));
        logDiv.scrollTop(logDiv[0].scrollHeight);
        console.log(`[TSDM自動打工] ${message}`);
    }
    function updateStatus(status) {
        const statusDiv = $('#tsdm-status');
        if (statusDiv.length > 0) {
            statusDiv.text(`狀態：${status}`);
        }
    }
    // ═══════════════════════════════════════════════════════════════
    // 核心功能函數（v3.0 簡化版）
    // ═══════════════════════════════════════════════════════════════
    function startAutoWork() {
        if (isWorking) {
            console.log('[TSDM自動打工] 已經在執行中');
            return;
        }
        isWorking = true;
        console.log('[TSDM自動打工] 🚀 開始自動打工流程（v3.0）');
        console.log('[TSDM自動打工] 📋 流程：點擊廣告 → 領取獎勵');
        clickAdsSequentially();
    }
    function clickAdsSequentially() {
        console.log('[TSDM自動打工] 🎯 開始點擊廣告...');
        // 依序點擊 6 個廣告
        adSelectors.forEach((selector, index) => {
            setTimeout(() => {
                clickAd(selector, index + 1);
            }, index * 500);  // 每個間隔 500ms
        });
        // 所有廣告點擊完成後，等待 1 秒再領取獎勵
        const totalTime = adSelectors.length * 500 + 1000;  // 3500ms

        setTimeout(() => {
            console.log('[TSDM自動打工] 🎁 準備領取獎勵');
            clickWorkStart();
        }, totalTime);
    }
    function clickAd(selector, adNumber) {
        console.log(`[TSDM自動打工] 🖱️ 點擊第 ${adNumber} 個廣告: ${selector}`);
        const element = document.querySelector(selector);
        if (element) {
            try {
                element.click();
                console.log(`[TSDM自動打工] ✅ 成功點擊第 ${adNumber} 個廣告`);
            } catch (error) {
                console.log(`[TSDM自動打工] ❌ 點擊第 ${adNumber} 個廣告失敗: ${error.message}`);
            }
        } else {
            console.log(`[TSDM自動打工] ⚠️ 第 ${adNumber} 個廣告不存在`);
        }
    }
    function clickWorkStart() {
        console.log('[TSDM自動打工] 🎁 點擊領取獎勵按鈕');
        const workStartBtn = document.querySelector('#workstart');
        if (workStartBtn) {
            try {
                workStartBtn.click();
                console.log('[TSDM自動打工] ✅ 已點擊領取獎勵按鈕');
                console.log('[TSDM自動打工] ✨ 自動打工流程完成！');
                console.log('[TSDM自動打工] 💡 請手動關閉廣告視窗（Ctrl+W）');
                isWorking = false;
            } catch (error) {
                console.log(`[TSDM自動打工] ❌ 點擊領取獎勵按鈕失敗: ${error.message}`);
                isWorking = false;
            }
        } else {
            console.log('[TSDM自動打工] ❌ 找不到領取獎勵按鈕 #workstart');
            console.log('[TSDM自動打工] ⚠️ 可能原因：時間未到或頁面結構改變');
            isWorking = false;
        }
    }
    // ═══════════════════════════════════════════════════════════════
    // 初始化執行
    // ═══════════════════════════════════════════════════════════════
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
/*
 * ═══════════════════════════════════════════════════════════════
 * v3.0 完整更新日誌
 * ═══════════════════════════════════════════════════════════════
 *
 * 【核心改進】
 * ✅ 智能判斷執行模式
 *    - 在打工頁面：自動執行（延遲 2 秒確保頁面載入）
 *    - 不在打工頁面：顯示 UI（點擊按鈕跳轉）
 *
 * ✅ 簡化功能
 *    - 只保留：點廣告 + 領獎勵
 *    - 移除：所有關閉廣告的功能
 *    - 移除：window.open 相關代碼
 *    - 移除：視窗追蹤相關代碼
 *
 * ✅ 優化 UI
 *    - 移除「手動關閉所有廣告視窗」按鈕
 *    - 新增提示：「廣告視窗需手動關閉（Ctrl+W）」
 *    - 簡化控制面板（只保留一個按鈕）
 *
 * ✅ 日誌優化
 *    - 改用 console.log（因為可能沒有 UI）
 *    - 保留 addLog 函數（UI 模式時使用）
 *
 * 【執行邏輯】
 *
 * 情況 A：從其他頁面進入
 * 1. 顯示浮動按鈕 🏅
 * 2. 點擊按鈕開啟控制面板
 * 3. 點擊「開始自動打工」
 * 4. 跳轉到打工頁面
 * 5. 自動執行（見情況 B）
 *
 * 情況 B：直接進入打工頁面（書籤）
 * 1. 延遲 2 秒確保頁面載入
 * 2. 檢查廣告是否存在（判斷時間是否到了）
 * 3. 如果存在：自動執行
 *    - 點擊 6 個廣告（間隔 500ms）
 *    - 等待 1 秒
 *    - 點擊領取獎勵按鈕
 *    - 完成（提示手動關閉廣告）
 * 4. 如果不存在：不執行（時間未到）
 *
 * 【時間軸】
 * 0ms      - 腳本載入
 * 2000ms   - 檢查廣告是否存在
 * 2000ms   - 開始點擊第 1 個廣告
 * 2500ms   - 點擊第 2 個廣告
 * 3000ms   - 點擊第 3 個廣告
 * 3500ms   - 點擊第 4 個廣告
 * 4000ms   - 點擊第 5 個廣告
 * 4500ms   - 點擊第 6 個廣告
 * 5500ms   - 點擊領取獎勵按鈕
 * 5500ms+  - 頁面跳轉
 *
 * 【已移除的功能】
 * ❌ window.open 視窗追蹤
 * ❌ openedAdWindows 陣列
 * ❌ startWindowMonitoring 函數
 * ❌ closeAllAdWindows 函數
 * ❌ manualCloseAllAdWindows 函數
 * ❌ 手動關閉按鈕
 * ❌ GM_setValue/GM_getValue 視窗相關資料
 * ❌ 跨頁面視窗追蹤
 *
 * 【保留的功能】
 * ✅ 浮動按鈕（可拖曳）
 * ✅ 控制面板（簡化版）
 * ✅ 自動點擊廣告
 * ✅ 自動領取獎勵
 * ✅ 智能判斷執行模式
 * ✅ 日誌系統（console + UI）
 *
 * 【使用方式】
 *
 * 方式 1：從論壇任意頁面
 * 1. 點擊右側 🏅 按鈕
 * 2. 點擊「開始自動打工」
 * 3. 自動跳轉並執行
 * 4. 完成後手動關閉廣告（Ctrl+W 或點擊關閉）
 *
 * 方式 2：直接用書籤進入打工頁面
 * 1. 點擊書籤（https://www.tsdm39.com/plugin.php?id=np_cliworkdz:work）
 * 2. 自動執行（無需點擊任何東西）
 * 3. 完成後手動關閉廣告
 *
 * 【測試重點】
 * 1. ✅ 在首頁是否顯示 UI？
 * 2. ✅ 點擊按鈕是否跳轉到打工頁面？
 * 3. ✅ 直接進入打工頁面是否自動執行？
 * 4. ✅ 是否成功點擊 6 個廣告？
 * 5. ✅ 是否成功領取獎勵？
 * 6. ✅ 廣告視窗是否可以手動關閉？
 *
 * 【已知限制】
 * ⚠️ 廣告視窗需要手動關閉（技術限制）
 * ⚠️ 如果時間未到（廣告不存在），不會執行
 * ⚠️ 需要等待 2 秒才會開始執行（確保頁面載入）
 *
 * 【優點】
 * ✅ 代碼簡潔（移除了 200+ 行無用代碼）
 * ✅ 邏輯清晰（智能判斷執行模式）
 * ✅ 穩定可靠（只用 element.click()）
 * ✅ 符合實際需求（自動點廣告+領獎，手動關廣告）
 *
 * 【給下一個我的提示】
 * 如果 v3.0 有問題，請確認：
 * 1. 是否在打工頁面（檢查網址）
 * 2. 廣告選擇器是否正確（6 個 ID）
 * 3. 領取獎勵按鈕 #workstart 是否存在
 * 4. 主控台是否有錯誤訊息
 *
 * v3.0 已經是最簡化版本，應該不會再有複雜問題了。
 * 如果還有問題，可能是網站結構改變，需要更新選擇器。
 *
 * 祝使用愉快！🍀
 */