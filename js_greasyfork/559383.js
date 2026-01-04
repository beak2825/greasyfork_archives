// ==UserScript==
// @name         Twitter/X auto refresh
// @namespace    http://tampermonkey.net/
// @version      8.1
// @description  自動刷新時間線。功能：1.防干擾閱讀 2.極速刷新 
// @author       程式夥伴
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559383/TwitterX%20auto%20refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/559383/TwitterX%20auto%20refresh.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. 設定值讀取 ---
    let baseTimeSeconds = GM_getValue('refresh_interval', 60);
    let randomVariance = GM_getValue('random_variance', 15);
    let pauseOnScroll = GM_getValue('pause_on_scroll', true);

    // --- 2. GPU 加速優化 (保留此項以減少轉圈圈，但不阻擋刷新) ---
    GM_addStyle(`
        video {
            transform: translateZ(0);
            backface-visibility: hidden;
            perspective: 1000px;
        }
    `);

    // --- 3. 選單註冊 ---
    function registerMenus() {
        GM_registerMenuCommand(`⚙️ 設定基礎時間 (目前: ${baseTimeSeconds}s)`, () => {
            const input = prompt(`請輸入基礎刷新秒數`, baseTimeSeconds);
            saveSetting('refresh_interval', input);
        });

        GM_registerMenuCommand(`🎲 設定隨機範圍 (目前: ±${randomVariance}s)`, () => {
            const input = prompt(`請輸入隨機變動秒數`, randomVariance);
            saveSetting('random_variance', input);
        });

        const pauseStatus = pauseOnScroll ? "✅" : "❌";
        GM_registerMenuCommand(`📖 閱讀時暫停刷新 (${pauseStatus})`, () => {
            GM_setValue('pause_on_scroll', !pauseOnScroll);
            location.reload();
        });
    }

    function saveSetting(key, userInput) {
        if (userInput !== null) {
            const num = parseInt(userInput, 10);
            if (!isNaN(num) && num >= 0) {
                GM_setValue(key, num);
                location.reload();
            }
        }
    }
    registerMenus();

    // --- 4. 計時器 UI ---
    let timeRemaining;
    let timerInterval;
    let isPaused = false;

    const timerDisplay = document.createElement('div');
    timerDisplay.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: rgba(29, 155, 240, 0.9);
        color: #fff;
        padding: 8px 12px;
        border-radius: 20px;
        z-index: 9999;
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 13px;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        user-select: none;
        transition: all 0.2s;
        min-width: 80px;
        text-align: center;
    `;

    function updateTimerDisplay(statusText = null, color = null) {
        if (statusText) {
            timerDisplay.innerText = statusText;
            timerDisplay.style.backgroundColor = color || 'rgba(29, 155, 240, 0.9)';
            return;
        }

        if (isPaused) {
            timerDisplay.innerText = "⏸ 已暫停";
            timerDisplay.style.backgroundColor = 'rgba(100, 100, 100, 0.8)';
        } else {
             if (timeRemaining <= 0) {
                 timerDisplay.innerText = `🚀 載入中...`;
                 timerDisplay.style.backgroundColor = '#00ba7c';
            } else {
                 timerDisplay.innerText = `↻ 刷新: ${timeRemaining}s`;
                 timerDisplay.style.backgroundColor = 'rgba(29, 155, 240, 0.9)';
            }
        }
    }

    timerDisplay.onclick = function() {
        isPaused = !isPaused;
        updateTimerDisplay();
    };

    document.body.appendChild(timerDisplay);

    function resetTimer() {
        const variance = Math.floor(Math.random() * (randomVariance * 2 + 1)) - randomVariance;
        timeRemaining = baseTimeSeconds + variance;
        if (timeRemaining < 5) timeRemaining = 5;
        updateTimerDisplay();
    }

    // --- 5. 核心刷新邏輯 ---
    function triggerFastRefresh() {
        // 如果有開啟防干擾，且正在捲動，則不刷新
        if (pauseOnScroll && window.scrollY > 50) return;

        const homeButtons = document.querySelectorAll('a[href="/home"]');
        let targetBtn = null;
        for (let btn of homeButtons) {
            if (btn.getAttribute('role') === 'link') {
                targetBtn = btn;
                break;
            }
        }

        if (targetBtn) {
            console.log("[Auto Refresh] 執行極速刷新...");
            window.scrollTo({ top: 0, behavior: 'instant' });
            targetBtn.click();
            setTimeout(() => {
                targetBtn.click();
            }, 100);
        }
    }

    resetTimer();

    // 每一秒檢查一次
    timerInterval = setInterval(() => {
        if (isPaused) return;

        // 僅保留捲動偵測 (閱讀模式)
        if (pauseOnScroll) {
            const isScrolling = window.scrollY > 50;
            const isNotHome = !window.location.pathname.includes('/home');

            if (isScrolling || isNotHome) {
                updateTimerDisplay("📖 閱讀中...", "rgba(255, 152, 0, 0.9)");
                return;
            }
        }

        // 正常倒數 (不再檢查影片)
        timeRemaining--;
        updateTimerDisplay();

        if (timeRemaining <= 0) {
            triggerFastRefresh();
            setTimeout(resetTimer, 1000);
        }
    }, 1000);

})();