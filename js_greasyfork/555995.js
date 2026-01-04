// ==UserScript==
// @name 猜猜貓是誰/輔助插件
// @name:en Who Is The Cat / Auto-Answer Assistant
// @namespace http://tampermonkey.net/
// @version 4.7
// @description 針對《猜猜貓是誰》遊戲設計的智慧輔助工具。提供答案指示面板、自動點擊功能、延遲設定及隨機錯誤模擬，旨在提升遊戲體驗與樂趣。
// @description:en Intelligent auxiliary tool for the "Who is the Cat" game. Provides an answer indicator panel, configurable auto-click, delay settings, and random error simulation.
// @author Null
// @match https://catbud.net/tool/who/*
// @grant GM_addStyle
// @grant GM_setValue
// @grant GM_getValue
// @run-at document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555995/%E7%8C%9C%E7%8C%9C%E8%B2%93%E6%98%AF%E8%AA%B0%E8%BC%94%E5%8A%A9%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/555995/%E7%8C%9C%E7%8C%9C%E8%B2%93%E6%98%AF%E8%AA%B0%E8%BC%94%E5%8A%A9%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const AUTO_CLICK_KEY = 'catbud_auto_click_enabled';
    const MIN_DELAY_KEY = 'catbud_min_delay';
    const MAX_DELAY_KEY = 'catbud_max_delay';
    const ERROR_RATE_KEY = 'catbud_error_rate';
    const ERROR_COUNT_KEY = 'catbud_error_count';
    const LOGGING_ENABLED_KEY = 'catbud_logging_enabled';
    const AVATAR_API_URL = 'https://catbud.net/api/discord/face/';

    const NICKNAME_MIN_DELAY = 2500;
    const NICKNAME_MAX_DELAY = 3000;

    let minDelay = GM_getValue(MIN_DELAY_KEY, 500);
    let maxDelay = GM_getValue(MAX_DELAY_KEY, 2000);
    let isAutoClickEnabled = GM_getValue(AUTO_CLICK_KEY, false);
    let errorRate = GM_getValue(ERROR_RATE_KEY, 0);
    let errorCount = GM_getValue(ERROR_COUNT_KEY, 0);
    let isLoggingEnabled = GM_getValue(LOGGING_ENABLED_KEY, true);
    let lastQuestionValue = '';

    function customLog(message, isWarning = false) {
        if (isLoggingEnabled) {
            const now = new Date();
            const time = now.toTimeString().split(' ')[0];
            if (isWarning) {
                console.warn(`[${time}] ${message}`);
            } else {
                console.log(`[${time}] ${message}`);
            }
        }
    }

    const INLINE_CSS = `
        #catbud-panel-container {
            position: fixed;
            top: 10px;
            right: 10px; /* 定位到右上角 */
            z-index: 10000;
            background-color: rgba(44, 62, 80, 0.95);
            border: 1px solid #34495e;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            
            /* 預設狀態 (縮小且透明) */
            width: 150px;
            max-height: 50px;
            overflow: hidden;
            opacity: 0.2; 
            padding: 5px; /* 縮小時的邊距 */

            transition: all 0.3s ease-in-out; /* 平滑過渡效果 */
            
            color: #f9fafb;
            font-family: sans-serif;
            box-sizing: border-box;
        }

        /* 懸停狀態 (恢復完整顯示) */
        #catbud-panel-container:hover {
            width: 350px;
            max-height: 90vh;
            overflow-y: auto;
            opacity: 1.0;
            padding: 15px; /* 恢復完整邊距 */
        }

        /* 懸停時才顯示的內容 */
        #catbud-panel-container:not(:hover) #control-panel-content,
        #catbud-panel-container:not(:hover) #catbud-answer-indicators {
            display: none;
        }

        #info-section {
            display: flex; align-items: center; margin-bottom: 5px; padding-bottom: 2px;
            border-bottom: 1px solid #4b5563; width: 100%; box-sizing: border-box;
        }
        #catbud-panel-container:hover #info-section {
             margin-bottom: 15px; padding-bottom: 5px; /* 恢復完整間距 */
        }

        #target-avatar-popup {
            width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;
            border: 2px solid #facc15; object-fit: cover; flex-shrink: 0;
        }
        #target-text-container { word-break: break-word; flex-grow: 1; }
        #target-text-label { color: #9ca3af; font-size: 12px; }
        #target-text-popup { color: #facc15; font-weight: bold; font-size: 16px; }

        #catbud-answer-indicators {
            width: 100%; display: flex; justify-content: space-between; margin-bottom: 20px;
        }
        .indicator-bar {
            width: 30%; height: 15px; background-color: #4b5563; opacity: 0.2; transition: background-color 0.3s; border-radius: 2px;
        }
        .indicator-bar.highlight {
            background-color: #10b981 !important; opacity: 1.0 !important;
        }

        #control-panel-content {
            width: 100%; background-color: #374151; padding: 10px; border-radius: 6px;
        }
        .panel-title {
            font-size: 14px; font-weight: bold; margin-bottom: 8px; color: #a7f3d0;
        }
        .control-row {
            display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;
            font-size: 13px; color: #f9fafb;
        }
        .delay-input {
            width: 50px; padding: 5px; border-radius: 3px; border: 1px solid #4b5563;
            background-color: #2c3e50; color: #f9fafb; text-align: center;
        }

        /* Switch Toggle Styling */
        .switch { position: relative; display: inline-block; width: 40px; height: 20px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider {
          position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
          background-color: #ccc; transition: .4s; border-radius: 20px;
        }
        .slider:before {
          position: absolute; content: ""; height: 16px; width: 16px; left: 2px; bottom: 2px;
          background-color: white; transition: .4s; border-radius: 50%;
        }
        input:checked + .slider { background-color: #4CAF50; }
        input:checked + .slider:before { transform: translateX(20px); }
    `;

    const INLINE_HTML = `
        <div id="info-section">
            <img id="target-avatar-popup" src="" alt="目標頭像" style="display: none;">
            <div id="target-text-container">
                <span id="target-text-label">遊戲狀態:</span>
                <div id="target-text-popup">等待中...</div>
            </div>
        </div>
        <div id="catbud-answer-indicators">
            <div class="indicator-bar" data-index="0"></div>
            <div class="indicator-bar" data-index="1"></div>
            <div class="indicator-bar" data-index="2"></div>
        </div>

        <div id="control-panel-content">
            <div class="panel-title">自動點擊設定</div>

            <div class="control-row" style="margin-bottom: 12px; border-bottom: 1px solid #4b5563; padding-bottom: 5px;">
                <label for="loggingToggle">控制台訊息輸出:</label>
                <label class="switch">
                    <input type="checkbox" id="loggingToggle" data-initial-checked="${isLoggingEnabled}">
                    <span class="slider"></span>
                </label>
            </div>

            <div class="control-row">
                <label for="autoClickToggle">自動點擊開關:</label>
                <label class="switch">
                    <input type="checkbox" id="autoClickToggle" data-initial-checked="${isAutoClickEnabled}">
                    <span class="slider"></span>
                </label>
            </div>

            <div class="control-row" style="margin-top: 10px;">
                <span>最小延遲 (秒):</span>
                <input type="number" id="minDelayInput" class="delay-input" value="${(minDelay / 1000).toFixed(1)}" step="0.1" min="0.1" max="10">
            </div>

            <div class="control-row">
                <span>最大延遲 (秒):</span>
                <input type="number" id="maxDelayInput" class="delay-input" value="${(maxDelay / 1000).toFixed(1)}" step="0.1" min="0.1" max="10">
            </div>

            <div class="panel-title" style="margin-top: 10px; color: #fcc419;">隨機錯誤設定</div>
            <div class="control-row">
                <span>錯誤機率 (%):</span>
                <input type="number" id="errorRateInput" class="delay-input" value="${errorRate}" min="0" max="100">
            </div>
            <div class="control-row">
                <span>剩餘錯誤次數 (0=關閉):</span>
                <input type="number" id="errorCountInput" class="delay-input" value="${errorCount}" min="0" max="999">
            </div>
        </div>
    `;

    function setupInlinePanelListeners() {
        const panel = document.getElementById('catbud-panel-container');
        if (!panel) return;

        const loggingToggle = panel.querySelector('#loggingToggle');
        loggingToggle.checked = GM_getValue(LOGGING_ENABLED_KEY, true);

        loggingToggle.addEventListener('change', (e) => {
            isLoggingEnabled = e.target.checked;
            GM_setValue(LOGGING_ENABLED_KEY, isLoggingEnabled);
            customLog(`Catbud Auto: 控制台輸出功能已${isLoggingEnabled ? '啟用' : '禁用'}。`);
        });

        const toggle = panel.querySelector('#autoClickToggle');
        toggle.checked = GM_getValue(AUTO_CLICK_KEY, false);

        toggle.addEventListener('change', (e) => {
            isAutoClickEnabled = e.target.checked;
            GM_setValue(AUTO_CLICK_KEY, isAutoClickEnabled);
            customLog(`Catbud Auto: 自動點擊功能已${isAutoClickEnabled ? '啟用' : '禁用'}。`);
        });

        const minDelayInput = panel.querySelector('#minDelayInput');
        const maxDelayInput = panel.querySelector('#maxDelayInput');

        const updateDelay = () => {
            const newMin_s = parseFloat(minDelayInput.value);
            const newMax_s = parseFloat(maxDelayInput.value);

            const newMin_ms = Math.round(newMin_s * 1000);
            const newMax_ms = Math.round(newMax_s * 1000);

            if (newMin_s >= 0.1 && newMax_s <= 10 && newMin_s <= newMax_s) {
                minDelay = newMin_ms;
                maxDelay = newMax_ms;
                GM_setValue(MIN_DELAY_KEY, minDelay);
                GM_setValue(MAX_DELAY_KEY, maxDelay);
                customLog(`Catbud Auto: 延遲範圍已更新為 ${newMin_s}s 到 ${newMax_s}s。`);
            } else {
                minDelayInput.value = (minDelay / 1000).toFixed(1);
                maxDelayInput.value = (maxDelay / 1000).toFixed(1);
                alert("延遲範圍無效。請確保最小值不小於 0.1s，且不超過最大值。");
            }
        };

        minDelayInput.addEventListener('change', updateDelay);
        maxDelayInput.addEventListener('change', updateDelay);

        const errorRateInput = panel.querySelector('#errorRateInput');
        const errorCountInput = panel.querySelector('#errorCountInput');

        const updateErrorSettings = () => {
            const newRate = parseInt(errorRateInput.value, 10);
            const newCount = parseInt(errorCountInput.value, 10);

            if (newRate >= 0 && newRate <= 100 && newCount >= 0) {
                errorRate = newRate;
                errorCount = newCount;
                GM_setValue(ERROR_RATE_KEY, errorRate);
                GM_setValue(ERROR_COUNT_KEY, errorCount);
                customLog(`Catbud Auto: 隨機錯誤已更新。機率: ${errorRate}%，剩餘次數: ${errorCount}。`);
            } else {
                errorRateInput.value = errorRate;
                errorCountInput.value = errorCount;
                alert("錯誤設定無效。機率需在 0-100% 之間，次數需為非負整數。");
            }
        };

        errorRateInput.addEventListener('change', updateErrorSettings);
        errorCountInput.addEventListener('change', updateErrorSettings);
    }

    function createInlinePanel() {
        GM_addStyle(INLINE_CSS);

        const panelContainer = document.createElement('div');
        panelContainer.id = 'catbud-panel-container';
        panelContainer.innerHTML = INLINE_HTML;
        document.body.appendChild(panelContainer);

        setupInlinePanelListeners();
    }

    function updateAnswerIndicators(correctIndex, targetValue, correctUuid) {
        const panel = document.getElementById('catbud-panel-container');
        if (!panel) return;

        const textElement = panel.querySelector('#target-text-popup');
        const avatarElement = panel.querySelector('#target-avatar-popup');
        const bars = panel.querySelectorAll('.indicator-bar');

        if (targetValue) {
            panel.querySelector('#target-text-label').textContent = '目標 ID/暱稱:';
            textElement.textContent = targetValue;
            
            // 縮小時隱藏頭像，懸停時才顯示
            if (correctUuid) {
                avatarElement.src = AVATAR_API_URL + correctUuid;
                avatarElement.style.display = 'block';
            } else {
                avatarElement.src = '';
                avatarElement.style.display = 'none';
            }
        } else {
            panel.querySelector('#target-text-label').textContent = '遊戲狀態:';
            textElement.textContent = '等待中...';
            avatarElement.src = '';
            avatarElement.style.display = 'none';
        }

        bars.forEach(bar => {
            bar.classList.remove('highlight');
        });

        if (correctIndex !== -1 && correctIndex < bars.length) {
            const correctBar = bars[correctIndex];
            correctBar.classList.add('highlight');
        }
    }


    function getRandomDelay(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function autoSolve() {
        const gameScreen = document.getElementById('gameScreen');
        const questionElement = document.getElementById('questionText');

        if (!gameScreen || gameScreen.style.display === 'none' || !questionElement) {
            updateAnswerIndicators(-1, null, null);
            lastQuestionValue = '';
            return;
        }

        const targetValue = questionElement.textContent.trim();

        if (!targetValue) {
            return;
        }

        if (targetValue === lastQuestionValue) {
            return;
        }
        lastQuestionValue = targetValue;

        let correctOption = null;
        let correctOptionIndex = -1;
        let correctUuid = null;
        let isNicknameQuestion = false;

        const playerOptions = document.querySelectorAll('.player-option');
        if (playerOptions.length === 0) {
             updateAnswerIndicators(-1, targetValue, null);
             return;
        }

        for (let i = 0; i < playerOptions.length; i++) {
            const option = playerOptions[i];
            const playerIdElement = option.querySelector('.player-id');
            const nicknameElement = option.querySelector('.player-nickname');

            const optionId = playerIdElement ? playerIdElement.textContent.trim() : '';
            const optionNickname = nicknameElement ? nicknameElement.textContent.trim() : '';

            if (optionId === targetValue) {
                correctOption = option;
                correctOptionIndex = i;
                correctUuid = option.getAttribute('data-uuid');
                isNicknameQuestion = false;
                break;
            } else if (optionNickname === targetValue) {
                correctOption = option;
                correctOptionIndex = i;
                correctUuid = option.getAttribute('data-uuid');
                isNicknameQuestion = true;
                break;
            }
        }

        updateAnswerIndicators(correctOptionIndex, targetValue, correctUuid);

        if (correctOption && isAutoClickEnabled) {
            const isSelected = correctOption.classList.contains('selected');
            const isFinalized = correctOption.classList.contains('correct') ||
                                 correctOption.classList.contains('incorrect');

            let isClickBlocked = isSelected || isFinalized;

            if (!isClickBlocked) {
                let finalTargetOption = correctOption;
                let isMistake = false;

                let min = minDelay;
                let max = maxDelay;
                let logPrefix = '[Auto-Click Enabled]';

                if (isNicknameQuestion) {
                    min = NICKNAME_MIN_DELAY;
                    max = NICKNAME_MAX_DELAY;
                    logPrefix = '[SLOW CLICK / Nickname Question]';
                }

                if (errorCount > 0 && errorRate > 0 && Math.random() * 100 < errorRate) {
                    const incorrectOptions = Array.from(playerOptions).filter(option => option !== correctOption);

                    if (incorrectOptions.length > 0) {
                        const randomIndex = Math.floor(Math.random() * incorrectOptions.length);
                        finalTargetOption = incorrectOptions[randomIndex];
                        isMistake = true;

                        errorCount--;
                        GM_setValue(ERROR_COUNT_KEY, errorCount);

                        // Update the display for remaining error count
                        const errorCountInput = document.querySelector('#catbud-panel-container #errorCountInput');
                        if (errorCountInput) {
                            errorCountInput.value = errorCount;
                        }
                    }
                }

                const delay = getRandomDelay(min, max);
                const delaySeconds = (delay / 1000).toFixed(2);

                if (isMistake) {
                    customLog(`Catbud Auto: [WARNING] 執行隨機錯誤 (${errorRate}%)! 剩餘次數: ${errorCount}。將在 ${delaySeconds} 秒後點擊錯誤選項。`, true);
                } else {
                    customLog(`Catbud Auto: ${logPrefix} 將在 ${delaySeconds} 秒後點擊: ${targetValue}`);
                }

                setTimeout(() => {
                    const currentIsAnswered = finalTargetOption.classList.contains('selected') ||
                                              finalTargetOption.classList.contains('correct') ||
                                              finalTargetOption.classList.contains('incorrect');

                    if (!currentIsAnswered) {
                         finalTargetOption.click();
                    }
                }, delay);
            }
        }
    }


    const observer = new MutationObserver((mutationsList, observer) => {
        autoSolve();
    });

    function startObserver() {
        const targetNode = document.getElementById('gameContentWrapper');

        if (targetNode) {
            observer.observe(targetNode, {
                childList: true,
                subtree: true,
                characterData: true,
                attributes: true
            });
            customLog('Catbud Auto: MutationObserver 啟動。');
            autoSolve();
        } else {
            setTimeout(startObserver, 1000);
        }
    }

    function initializeScript() {
        createInlinePanel();
        startObserver();
    }

    initializeScript();

})();