// ==UserScript==
// @name         巴哈小瑪莉自動投注器
// @description  自動投注巴哈小瑪莉(含防破產保護、開獎統計)。
// @author       由Gemini產生
// @version      1.0
// @match        https://now.gamer.com.tw/chat_list.php*
// @icon         https://ani.gamer.com.tw/apple-touch-icon-144.jpg
// @require      https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js
// @grant        GM_addStyle
// @noframes
// @license MIT
// @namespace https://greasyfork.org/users/1308487
// @downloadURL https://update.greasyfork.org/scripts/551273/%E5%B7%B4%E5%93%88%E5%B0%8F%E7%91%AA%E8%8E%89%E8%87%AA%E5%8B%95%E6%8A%95%E6%B3%A8%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/551273/%E5%B7%B4%E5%93%88%E5%B0%8F%E7%91%AA%E8%8E%89%E8%87%AA%E5%8B%95%E6%8A%95%E6%B3%A8%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===================================================================
    // 1. 【設定與數據儲存區】
    // ===================================================================
    const STORAGE_KEY = 'maryBettingData';
    const PLAYER_NAME = '巴哈小瑪莉'; // 固定的開獎機器人名稱
    const INPUT_FIELD_ID = 'msg_input';
    const SEND_BUTTON_SELECTOR = '.chat_inputarea .btn-send.is-ready';

    // 預設投注指令，方便集中管理
    const DEFAULT_BET_COMMAND = '/mary 0 10 10 0 0 0 0 0 0';

    // 【修改】: 投注間隔，以秒為單位，用於設定 UI 預設值
    const DEFAULT_BET_INTERVAL_SEC = 5;
    // 【新增】: 轉換單位常數
    const MS_PER_SECOND = 1000;

    let isRunning = false;
    let autoBetTimer = null;
    let totalCommandsSent = 0;
    let totalDraws = 0;

    let initialBahbi = 0;
    let currentBahbi = 0;
    let isSafetyPaused = false;

    // 動態儲存當前分析機器人名稱，不進行持久化儲存
    let currentAnalyzerName = null;

    // 預設安全水位線設定 (已修正註釋語法)
    let safetyConfig = {
        // 百分比虧損停止 (30%)
        percentLoss: 30,
        // 絕對金額虧損停止
        absoluteLoss: 500,
        // 最低庫存停止
        minInventory: 1000
    };

    // 選項的固定順序鍵名
    const OPTION_ORDER = [
        '2', '5', '10', '15', '20-grape', '20-bell', '30', '40', '100'
    ];

    // 賠率映射表
    const PAYOUT_MAP = {
        '2': 2, '5': 5, '10': 10, '15': 15,
        '20-grape': 20, '20-bell': 20,
        '30': 30, '40': 40, '100': 100
    };

    let drawingCounts = {
        '2': 0, '5': 0, '10': 0, '15': 0, '20-grape': 0, '20-bell': 0, '30': 0, '40': 0, '100': 0
    };

    const DISPLAY_NAMES = {
        '2': '🍒 (2)', '5': '🍎 (5)', '10': '🍊 (10)', '15': '🍇 (15)',
        '20-grape': '🍉 (20)', '20-bell': '🔔 (20)',
        '30': '⭐ (30)', '40': '7️⃣ (40)', '100': '🎰 (100)'
    };

    const SYMBOL_MAP = {
        '🍒': '2', '🍎': '5', '🍊': '10', '🍇': '15',
        '🍉': '20-grape', '🔔': '20-bell', '⭐': '30', '7️⃣': '40', '🎰': '100'
    };

    // 儲存 UI 位置 (預設右上角)
    let uiPosition = { top: 20, left: window.innerWidth - 270 };

    // ===================================================================
    // 2. 【數據持久化函數】: 儲存與載入
    // ===================================================================

    function saveData() {
        const data = {
            counts: drawingCounts,
            totalDraws: totalDraws,
            totalCommandsSent: totalCommandsSent,
            initialBahbi: initialBahbi,
            currentBahbi: currentBahbi,
            safetyConfig: safetyConfig,
            isSafetyPaused: isSafetyPaused,
            uiPosition: uiPosition
        };
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error('[數據] 儲存數據失敗:', e);
        }
    }

    function loadData() {
        try {
            const storedData = localStorage.getItem(STORAGE_KEY);
            if (storedData) {
                const data = JSON.parse(storedData);

                Object.keys(drawingCounts).forEach(key => {
                    if (data.counts && data.counts[key] !== undefined) {
                        drawingCounts[key] = data.counts[key];
                    }
                });

                totalDraws = data.totalDraws || 0;
                totalCommandsSent = data.totalCommandsSent || 0;
                initialBahbi = data.initialBahbi || 0;
                currentBahbi = data.currentBahbi || 0;

                if (data.safetyConfig) {
                    safetyConfig = data.safetyConfig;
                }
                isSafetyPaused = data.isSafetyPaused || false;

                if (data.uiPosition) {
                    uiPosition = data.uiPosition;
                } else {
                    uiPosition.left = window.innerWidth - 270;
                }

                console.log(`[數據] 成功載入歷史數據。總開獎次數: ${totalDraws}`);
            }
        } catch (e) {
            console.error('[數據] 載入數據失敗或數據格式錯誤:', e);
        }
    }

    function resetData() {
        if (!confirm('確定要歸零所有開獎數據嗎？此操作不可撤銷！')) {
            return;
        }

        Object.keys(drawingCounts).forEach(key => {
            drawingCounts[key] = 0;
        });
        totalDraws = 0;
        totalCommandsSent = 0;

        initialBahbi = 0;
        currentBahbi = 0;

        isSafetyPaused = false;

        // 偵測到的機器人名稱也重置
        currentAnalyzerName = null;

        saveData();
        displayStats();
        updateBahbiStatus();

        console.log('[數據] 所有數據已歸零並儲存。');
    }


    // ===================================================================
    // 3. 【數據分析與安全檢查】: 核心邏輯
    // ===================================================================

    /**
     * 檢查是否觸發安全水位線
     */
    function checkSafetyLimits() {
        if (!isRunning || initialBahbi <= 0) return false;

        const currentLoss = initialBahbi - currentBahbi;
        const limitReached = document.getElementById('safety-limit-text');

        const percentLimit = initialBahbi * (safetyConfig.percentLoss / 100);
        if (currentLoss >= percentLimit && safetyConfig.percentLoss > 0) {
            stopAutoBet(`[資金保護] 虧損達到 ${safetyConfig.percentLoss}% 水位線！`);
            limitReached.textContent = `已觸發：虧損達 ${safetyConfig.percentLoss}%`;
            isSafetyPaused = true;
            return true;
        }

        if (currentLoss >= safetyConfig.absoluteLoss && safetyConfig.absoluteLoss > 0) {
            stopAutoBet(`[資金保護] 虧損達到 ${safetyConfig.absoluteLoss.toLocaleString()} 元！`);
            limitReached.textContent = `已觸發：虧損達 ${safetyConfig.absoluteLoss.toLocaleString()}`;
            isSafetyPaused = true;
            return true;
        }

        if (currentBahbi <= safetyConfig.minInventory && safetyConfig.minInventory > 0) {
            stopAutoBet(`[資金保護] 庫存低於最低 ${safetyConfig.minInventory.toLocaleString()} 元！`);
            limitReached.textContent = `已觸發：庫存低於 ${safetyConfig.minInventory.toLocaleString()}`;
            isSafetyPaused = true;
            return true;
        }

        if (isSafetyPaused) {
             limitReached.textContent = `檢查中...`;
             isSafetyPaused = false;
        }

        limitReached.textContent = '檢查中...';
        return false;
    }

    /**
     * 更新巴幣狀態顯示
     */
    function updateBahbiStatus(newBahbi = null) {
        const bahbiStatusEl = document.getElementById('bahbi-status');

        if (!bahbiStatusEl) return;

        if (newBahbi !== null) {
            currentBahbi = newBahbi;
        }

        if (currentBahbi > 0 && initialBahbi > 0) {
            const change = currentBahbi - initialBahbi;
            const sign = change >= 0 ? '+' : '';
            const formattedChange = `${sign}${change.toLocaleString()}`;

            bahbiStatusEl.textContent = `巴幣: ${currentBahbi.toLocaleString()} (${formattedChange})`;

            checkSafetyLimits();
        } else if (initialBahbi > 0) {
            bahbiStatusEl.textContent = `巴幣: ${initialBahbi.toLocaleString()} (+0)`;
        } else {
            bahbiStatusEl.textContent = `巴幣: - (未追蹤)`;
        }
    }

    /**
     * 計算並標記正期望值的項目
     */
    function calculateExpectedValue() {
        const dataTableBody = document.getElementById('data-table-body');
        if (!dataTableBody || totalDraws === 0) return;

        let maxExpectedValue = 0;
        let bestOptionKey = null;

        // 1. 計算每個選項的期望值 (Expected Value, EV)
        const evMap = {};
        OPTION_ORDER.forEach(key => {
            const count = drawingCounts[key];
            const payout = PAYOUT_MAP[key];
            const probability = count / totalDraws;
            const expectedValue = probability * payout; // EV = P * R
            evMap[key] = expectedValue;

            // 尋找最高的 EV
            if (expectedValue > 1.0 && expectedValue > maxExpectedValue) {
                maxExpectedValue = expectedValue;
                bestOptionKey = key;
            }
        });

        // 2. 遍歷表格行並進行標記
        const rows = dataTableBody.querySelectorAll('tr');
        rows.forEach((row, index) => {
            const key = OPTION_ORDER[index];
            const ev = evMap[key] || 0; // 確保有 EV 值
            const probabilityCell = row.cells[2];

            // 移除舊樣式
            probabilityCell.style.backgroundColor = 'transparent';
            probabilityCell.style.color = 'white';
            probabilityCell.style.fontWeight = 'normal';
            probabilityCell.style.border = 'none';

            if (ev > 1.0) {
                // 如果是正期望值 (> 1.0)
                probabilityCell.style.backgroundColor = '#FFEB3B'; // 黃底
                probabilityCell.style.color = 'black';

                if (key === bestOptionKey) {
                    // 如果是最高的正期望值
                    probabilityCell.style.fontWeight = 'bold';
                    probabilityCell.style.border = '1px solid #FF9800';
                }
            }
        });
    }

    /**
     * 計算並在 UI 介面下方顯示統計數據
     */
    function displayStats() {
        let tableRowsHTML = '';
        let totalCount = 0;

        OPTION_ORDER.forEach(key => {
            const displayName = DISPLAY_NAMES[key] || key;
            const count = drawingCounts[key];
            totalCount += count;

            const probability = totalDraws > 0 ? (count / totalDraws * 100).toFixed(3) : '0.000';

            tableRowsHTML += `
                <tr>
                    <td>${displayName}</td>
                    <td style="text-align: right;">${count}</td>
                    <td class="probability-cell" style="text-align: right;">${probability}%</td>
                </tr>
            `;
        });

        const dataTableBody = document.getElementById('data-table-body');
        const totalRow = document.getElementById('data-table-total');

        if (dataTableBody) {
            dataTableBody.innerHTML = tableRowsHTML;
            // 數據載入後立即計算並標記正期望值
            calculateExpectedValue();
        }

        if (totalRow) {
            totalRow.innerHTML = `
                <td>總計</td>
                <td style="text-align: right;">${totalDraws}</td>
                <td style="text-align: right;">100.000%</td>
            `;
        }

        let statusText = isSafetyPaused ? '安全暫停' : (isRunning ? '執行中' : '已停止');
        let statusColor = isSafetyPaused ? '#FF9800' : (isRunning ? '#4CAF50' : '#ffeb3b');

        updateUIStatus(statusText, statusColor);
    }

    /**
     * 解析單條訊息中的開獎結果
     */
    function parseSingleResult(messageText, userName) {
        const resultLineMatch = messageText.match(/開獎結果[:：][\s\S]*?\([\s\S]*?(\d+)[\s\S]*?\)/);

        if (!resultLineMatch) return false;

        const resultLine = resultLineMatch[0];
        let keyToUpdate = null;

        for (const symbol in SYMBOL_MAP) {
            if (resultLine.includes(symbol)) {
                keyToUpdate = SYMBOL_MAP[symbol];
                break;
            }
        }

        if (keyToUpdate && drawingCounts[keyToUpdate] !== undefined) {
            drawingCounts[keyToUpdate]++;
            totalDraws++;

            const bahbiRegex = /剩餘巴幣[:：]\s*([\d,]+)/;
            const bahbiMatch = messageText.match(bahbiRegex);

            if (bahbiMatch) {
                const remainingBahbi = parseInt(bahbiMatch[1].replace(/,/g, ''), 10);
                if (remainingBahbi > 0) {
                    if (initialBahbi === 0) {
                         initialBahbi = remainingBahbi;
                    }
                    updateBahbiStatus(remainingBahbi);
                }
            }

            // 第一次成功解析分析機器人發出的結果時，儲存其名稱
            if (!currentAnalyzerName && userName !== PLAYER_NAME) {
                 currentAnalyzerName = userName;
                 console.log(`[偵測] 成功識別當前分析機器人為: ${currentAnalyzerName}`);
            }

            saveData();
            displayStats(); // 每次開獎都更新並重新計算 EV

            return true;
        }

        return false;
    }

    /**
     * 檢查單一訊息是否為開獎結果，並確保不會重複計數
     */
    function checkAndParseNewMessage(messageElement) {
        if (messageElement.dataset.parsed === 'true') {
            return false;
        }

        const userNameEl = messageElement.querySelector('.now_user-info .now_user-nickname');
        const userName = userNameEl ? userNameEl.textContent.trim() : null;
        const messageText = messageElement.textContent.trim();

        if (!messageText) {
             return false;
        }

        const isResult = messageText.includes('開獎結果');
        if (!isResult) return false;

        // 1. 判斷是否為「巴哈小瑪莉」發出的系統開獎結果
        const dateRegex = /\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}/;
        const dateMatch = messageText.match(dateRegex);

        const isSystemResult = (userName === PLAYER_NAME || !userNameEl) && dateMatch;

        // 2. 判斷是否為分析機器人發出的結果
        let isAnalyzerMessage = false;
        if (userName && userName !== PLAYER_NAME) {
            // 如果已經偵測到名稱，使用該名稱
            if (currentAnalyzerName && userName === currentAnalyzerName) {
                isAnalyzerMessage = true;
            }
            // 如果尚未偵測到名稱，或這是新的分析機器人 (非巴哈小瑪莉)
            else if (!currentAnalyzerName || (currentAnalyzerName && userName !== currentAnalyzerName)) {
                // 允許通過解析，並在 parseSingleResult 中更新 currentAnalyzerName
                isAnalyzerMessage = true;
            }
        }

        if (isSystemResult || isAnalyzerMessage) {
            if (parseSingleResult(messageText, userName)) {
                messageElement.dataset.parsed = 'true';
                return true;
            }
        }
        return false;
    }


    // ===================================================================
    // 4. 【控制與執行函數】
    // ===================================================================

    function updateUIStatus(status, color) {
        const statusElement = document.getElementById('ui-status');
        if (statusElement) {
            statusElement.textContent = status;
            statusElement.style.color = color;
        }
        const startButton = document.getElementById('start-bet');
        const stopButton = document.getElementById('stop-bet');

        if (startButton) startButton.disabled = isRunning || isSafetyPaused;
        if (stopButton) stopButton.disabled = !isRunning && !isSafetyPaused;

        const commandCountElement = document.getElementById('command-count');
        if (commandCountElement) commandCountElement.textContent = `發送指令數: ${totalCommandsSent}`;
    }

    function readCurrentBahbiFromLastMessage() {
        const elements = document.querySelectorAll(".msg_container");
        if (elements.length === 0) return 0;

        const lastMessage = elements[elements.length - 1];
        const messageText = lastMessage.textContent;
        const bahbiRegex = /剩餘巴幣[:：]\s*([\d,]+)/;
        const bahbiMatch = messageText.match(bahbiRegex);

        if (bahbiMatch) {
            return parseInt(bahbiMatch[1].replace(/,/g, ''), 10);
        }
        return 0;
    }

    function placeBet() {
        if (isSafetyPaused) {
             console.log('[自動投注] 因觸發安全水位線，暫停投注。');
             return;
        }

        const inputField = document.getElementById(INPUT_FIELD_ID);
        const sendButton = document.querySelector(SEND_BUTTON_SELECTOR);
        const command = document.getElementById('bet-command').value;

        if (!inputField || !sendButton) {
            console.error(`找不到輸入框或發送按鈕！無法發送指令。`);
            stopAutoBet();
            return;
        }

        if (inputField && sendButton) {
            inputField.textContent = command;
            inputField.dispatchEvent(new Event('input', { bubbles: true }));
            sendButton.click();

            totalCommandsSent++;
            saveData();

            console.log(`[自動投注] 已發送指令: ${command}`);
            updateUIStatus('執行中 (等待結果)', '#4CAF50');
        }
    }

    function startAutoBet() {
        if (isRunning) return;

        isSafetyPaused = false;
        isRunning = true;

        safetyConfig.percentLoss = parseInt(document.getElementById('safety-percent-loss').value) || 0;
        safetyConfig.absoluteLoss = parseInt(document.getElementById('safety-absolute-loss').value.replace(/,/g, '')) || 0;
        safetyConfig.minInventory = parseInt(document.getElementById('safety-min-inventory').value.replace(/,/g, '')) || 0;

        const lastKnownBahbi = readCurrentBahbiFromLastMessage();
        if (lastKnownBahbi > 0) {
            initialBahbi = lastKnownBahbi;
            currentBahbi = lastKnownBahbi;
            updateBahbiStatus();
            document.getElementById('safety-limit-text').textContent = '檢查中...';
            console.log(`[巴幣追蹤] 啟動時記錄初始巴幣: ${initialBahbi.toLocaleString()}`);
        } else {
            initialBahbi = 0;
            currentBahbi = 0;
            updateBahbiStatus();
            document.getElementById('safety-limit-text').textContent = '請等待第一筆開獎結果以設定初始巴幣。';
            console.warn('[巴幣追蹤] 無法從當前聊天記錄中讀取剩餘巴幣。追蹤將從下次成功開獎後開始。');
        }

        const intervalSec = parseInt(document.getElementById('bet-interval-sec').value);
        // 【修改】: 使用 MS_PER_SECOND 進行計算
        const intervalMs = intervalSec * MS_PER_SECOND;

        placeBet();
        autoBetTimer = setInterval(placeBet, intervalMs);

        console.log(`[控制台] 自動投注已啟動，間隔 ${intervalSec} 秒。`);
        saveData();
    }

    function stopAutoBet(reason = '[控制台] 手動終止。') {
        if (!isRunning && !isSafetyPaused) return;

        clearInterval(autoBetTimer);
        isRunning = false;

        if (isSafetyPaused) {
            isSafetyPaused = false;
            reason = '[資金保護解除] 已手動清除安全鎖定。';
            document.getElementById('safety-limit-text').textContent = '安全鎖定已解除，請點擊執行重新啟動。';
        } else {
            reason = '[控制台] 手動終止。';
        }

        console.log(reason);
        updateUIStatus('已停止', '#ffeb3b');
        updateBahbiStatus();
        saveData();
    }

    // ===================================================================
    // 5. 【核心 UI 函數】
    // ===================================================================

    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        element.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;

            const targetTagName = e.target.tagName;
            if (targetTagName === 'INPUT' || targetTagName === 'BUTTON' || targetTagName === 'SELECT' || targetTagName === 'TEXTAREA' || e.target.closest('input, button, select, textarea')) {
                return;
            }

            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;

            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();

            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            let newTop = element.offsetTop - pos2;
            let newLeft = element.offsetLeft - pos1;

            newTop = Math.max(0, Math.min(newTop, window.innerHeight - element.offsetHeight));
            newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - element.offsetWidth));

            element.style.top = newTop + "px";
            element.style.left = newLeft + "px";
            element.style.right = "auto";

            uiPosition.top = newTop;
            uiPosition.left = newLeft;
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;

            saveData();
            console.log(`[UI] 位置已更新: Top: ${uiPosition.top}px, Left: ${uiPosition.left}px`);
        }
    }


    function createUI() {
        const uiContainer = document.createElement('div');
        uiContainer.id = 'tampermonkey-control-ui';

        // 使用 DEFAULT_BET_COMMAND 和 DEFAULT_BET_INTERVAL_SEC 常數
        uiContainer.innerHTML = `
            <div style="padding: 10px; border-radius: 5px; background: rgba(0, 0, 0, 0.85); color: white; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); font-size: 13px;">
                <h4 style="margin: 0 0 10px 0; font-size: 16px; border-bottom: 1px solid #444; padding-bottom: 5px;">自動投注控制台 (可拖曳)</h4>

                <div style="margin-bottom: 8px;">
                    <label for="bet-command" style="display: block; font-size: 12px; margin-bottom: 3px;">投注指令</label>
                    <input type="text" id="bet-command" value="${DEFAULT_BET_COMMAND}" style="width: 100%; padding: 4px; border: none; border-radius: 3px; background: #333; color: white;">
                </div>

                <div style="margin-bottom: 12px; display: flex; align-items: center;">
                    <label for="bet-count" style="font-size: 12px; margin-right: 5px; white-space: nowrap;">投注間隔 (秒):</label>
                    <input type="number" id="bet-interval-sec" value="${DEFAULT_BET_INTERVAL_SEC}" style="width: 50px; padding: 4px; border: none; border-radius: 3px; background: #333; color: white; text-align: center;">
                    <span id="ui-status" style="margin-left: auto; font-size: 14px; font-weight: bold; color: #ffeb3b;">已停止</span>
                </div>

                <div style="display: flex; justify-content: space-between;">
                    <button id="start-bet" style="padding: 6px 10px; background: #4CAF50; color: white; border: none; border-radius: 3px; cursor: pointer; flex-grow: 1; margin-right: 5px;">執行</button>
                    <button id="stop-bet" style="padding: 6px 10px; background: #F44336; color: white; border: none; border-radius: 3px; cursor: pointer; flex-grow: 1; margin-left: 5px;" disabled>終止</button>
                </div>

                <p id="command-count" style="font-size: 12px; margin: 10px 0 0 0; color: #ccc;">發送指令數: 0</p>
                <p id="bahbi-status" style="font-size: 12px; margin: 0; color: #aaa;">巴幣: - (未追蹤)</p>
                <p id="safety-limit-text" style="font-size: 12px; margin: 0; color: #ccc;">-</p>


                <h4 style="margin: 15px 0 5px 0; font-size: 14px; border-top: 1px solid #444; padding-top: 10px;">
                    資金安全水位線 (Stop-Loss)
                </h4>

                <div class="safety-config-block" style="font-size: 12px; line-height: 1.5;">
                    <div class="safety-row">
                        <span class="safety-label">虧損達初始巴幣:</span>
                        <input type="number" id="safety-percent-loss" value="${safetyConfig.percentLoss}" min="0" max="100" class="safety-input percent-input">
                        <span class="safety-unit">% 時停止</span>
                    </div>
                    <div class="safety-row">
                        <span class="safety-label">虧損達絕對金額:</span>
                        <input type="text" id="safety-absolute-loss" value="${safetyConfig.absoluteLoss.toLocaleString()}" class="safety-input money-input">
                        <span class="safety-unit">元時停止</span>
                    </div>
                    <div class="safety-row">
                        <span class="safety-label">庫存低於:</span>
                        <input type="text" id="safety-min-inventory" value="${safetyConfig.minInventory.toLocaleString()}" class="safety-input money-input">
                        <span class="safety-unit">元時停止</span>
                    </div>
                </div>


                <h4 style="margin: 15px 0 5px 0; font-size: 14px; border-top: 1px solid #444; padding-top: 10px; display: flex; justify-content: space-between; align-items: center;">
                    <span>開獎數據分析</span>
                    <button id="reset-data" style="padding: 2px 5px; font-size: 10px; background: #607D8B; color: white; border: none; border-radius: 3px; cursor: pointer;">歸零數據</button>
                </h4>

                <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                    <thead style="background: #222;">
                        <tr>
                            <th style="padding: 4px; text-align: left;">選項</th>
                            <th style="padding: 4px; text-align: right;">次數</th>
                            <th style="padding: 4px; text-align: right;">機率</th>
                        </tr>
                    </thead>
                    <tbody id="data-table-body">
                        </tbody>
                    <tfoot style="border-top: 1px solid #444; font-weight: bold;">
                        <tr id="data-table-total">
                            </tr>
                    </tfoot>
                </table>
            </div>
        `;

        // 設置 UI 樣式，使用儲存的位置，並添加移動游標
        uiContainer.style.cssText = `
            position: fixed;
            top: ${uiPosition.top}px;
            left: ${uiPosition.left}px;
            right: auto;
            z-index: 9999;
            width: 280px;
            font-family: Arial, sans-serif;
            cursor: move;
        `;

        document.body.appendChild(uiContainer);

        // 啟用拖曳功能
        makeDraggable(uiContainer);

        // 綁定事件
        document.getElementById('start-bet').addEventListener('click', startAutoBet);
        document.getElementById('stop-bet').addEventListener('click', stopAutoBet);
        document.getElementById('reset-data').addEventListener('click', resetData);

        // 綁定安全設定的輸入事件，使其自動儲存設定
        document.getElementById('safety-percent-loss').addEventListener('change', updateSafetyConfig);
        document.getElementById('safety-absolute-loss').addEventListener('change', updateSafetyConfig);
        document.getElementById('safety-min-inventory').addEventListener('change', updateSafetyConfig);

        displayStats();
        updateBahbiStatus();
        document.getElementById('safety-limit-text').textContent = isSafetyPaused ? `安全暫停 (請點擊終止解除)` : '-';
    }

    /**
     * 更新安全設定物件並儲存
     */
    function updateSafetyConfig() {
        safetyConfig.percentLoss = parseInt(document.getElementById('safety-percent-loss').value) || 0;
        safetyConfig.absoluteLoss = parseInt(document.getElementById('safety-absolute-loss').value.replace(/,/g, '')) || 0;
        safetyConfig.minInventory = parseInt(document.getElementById('safety-min-inventory').value.replace(/,/g, '')) || 0;

        // 重新格式化顯示，保持千分位
        document.getElementById('safety-absolute-loss').value = safetyConfig.absoluteLoss.toLocaleString();
        document.getElementById('safety-min-inventory').value = safetyConfig.minInventory.toLocaleString();

        saveData();
        console.log('[設定] 資金安全設定已更新。');

        if (isRunning) {
            checkSafetyLimits();
        }
    }

    function markExistingMessages() {
        const existingMessages = document.querySelectorAll(".msg_container");
        existingMessages.forEach(el => {
            el.dataset.parsed = 'true';
        });
        console.log(`[啟動] 已標記 ${existingMessages.length} 條歷史訊息為已解析 (避免 F5 重複計數)。`);
    }

    function handleLayout() {
        const elements = document.querySelectorAll(".msg_container");

        if (elements.length > 0) {
            const lastMessage = elements[elements.length - 1];
            checkAndParseNewMessage(lastMessage);
        }
    }

    GM_addStyle(`
        .now_chatroom-container .chatroom .msg_container { margin-top: 12px !important; margin-bottom: 12px !important; }
        .now_chatroom-container.is-bpage { height: 90vh !important; }
        div.user-runes { display: none !important; }
        .chatroom { overscroll-behavior: contain; }
        #tampermonkey-control-ui table td, #tampermonkey-control-ui table th {
            padding: 4px;
            border-bottom: 1px dashed #333;
        }
        /* 針對控制台 UI 的樣式微調 */
        #tampermonkey-control-ui input[type="number"], #tampermonkey-control-ui input[type="text"] {
            box-sizing: border-box;
        }
        /* 新增：統一機率欄位樣式 */
        #tampermonkey-control-ui .probability-cell {
            padding: 4px;
            transition: background-color 0.3s, font-weight 0.3s;
        }

        /* V6.0 修正：資金保護區塊樣式調整 */
        .safety-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 5px;
        }
        .safety-label {
            white-space: nowrap;
            margin-right: 5px;
            flex-shrink: 0;
            /* 讓 Label 佔據更多空間，把右邊擠小 */
            width: 125px;
        }
        .safety-input {
            text-align: right;
            background: #333;
            color: white;
            border: none;
            padding: 2px;
            flex-grow: 1;
            /* 讓輸入框彈性縮放，但確保最小寬度 */
            min-width: 40px;
        }
        .percent-input {
            width: 40px !important;
            flex-grow: 0 !important;
        }
        .money-input {
            /* 允許長數字顯示，但給予一個合理的最大寬度 */
            max-width: 70px;
            width: auto;
        }
        .safety-unit {
            white-space: nowrap;
            width: 45px; /* 單位文字的固定寬度 */
            text-align: right;
            margin-left: 5px;
            flex-shrink: 0;
        }
    `);

    (async function () {
        loadData();
        createUI();

        document.addEventListener("focus", function () {
            if (document.hidden) return;
            document.getElementById(INPUT_FIELD_ID)?.focus();
        });

        console.log('⏳ 腳本啟動延遲 2.5 秒，以等待頁面穩定和舊訊息載入...');
        await new Promise(resolve => setTimeout(resolve, 2500));

        const chatLog = document.querySelector("#BH-slave, .now_chatroom-container");

        if (chatLog) {
            markExistingMessages();

            const observer = new MutationObserver(handleLayout);
            observer.observe(chatLog, { childList: true, subtree: true });
            console.log('✅ 數據分析腳本已穩定啟動，監聽聊天容器的 DOM 變動。');
        } else {
            console.error('❌ 找不到聊天記錄容器！請檢查選擇器 #BH-slave, .now_chatroom-container 是否正確。');
        }
    })();

})();