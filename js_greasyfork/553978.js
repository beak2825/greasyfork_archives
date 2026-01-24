// ==UserScript==
// @name         Grok Imagine VideoAutoClicker(自動點擊生成影片) v1.12
// @namespace    http://tampermonkey.net/
// @version      1.12
// @description  自動點擊生成影片按鈕，有使用者介面可調整閾值。
// @match        https://grok.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553978/Grok%20Imagine%20VideoAutoClicker%28%E8%87%AA%E5%8B%95%E9%BB%9E%E6%93%8A%E7%94%9F%E6%88%90%E5%BD%B1%E7%89%87%29%20v112.user.js
// @updateURL https://update.greasyfork.org/scripts/553978/Grok%20Imagine%20VideoAutoClicker%28%E8%87%AA%E5%8B%95%E9%BB%9E%E6%93%8A%E7%94%9F%E6%88%90%E5%BD%B1%E7%89%87%29%20v112.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // === 設定 ===
    // 使用包含 tabular-nums 的 class 名稱；改為使用多重 class selector，並對含方括號的 class 名稱做 escape
    const targetClassString = 'text-xs font-semibold w-[4ch] mb-[1px] tabular-nums';
    // CSS selector 中含有方括號的 class 名稱需要 escape，例如 w-[4ch] 要寫成 w-\[4ch\]
    const selector = 'div.text-xs.font-semibold.w-\\[4ch\\].mb-\\[1px\\].tabular-nums';

    let lastValue = null;
    let wasPresent = false;
    let autoMode = true;
    let threshold = 30;
    let playBeepOnLow = true;
    let playBeepOnLimit = true;
    let beepVolume = 0.005;
    let limitAlertShown = false;
    let persistentSuccessNotify = false; // 新增: 成功後持續通知

    let zeroCount = 0;
    let consecutiveRetries = 0;
    let maxRetriesAlertShown = false; // 新增：記錄是否已經顯示過最大重試次數警報
    const zeroThreshold = 20; // seconds
    const checkInterval = 500; // ms
    const zeroMaxCount = Math.floor(zeroThreshold * 1000 / checkInterval);
    const maxConsecutiveRetries = 2; // 最多重試次數

    let worker = null;

    // 生成統計
    let stats = { total: 0, success: 0, fail: 0 };
    // 失敗時自動填入的關鍵字（可透過控制面板設定）
    let failurePrompt = localStorage.getItem('grok_failure_prompt') || '';

    function getTimeString() {
        const now = new Date();
        const pad = n => n.toString().padStart(2, '0');
        return `[${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}]`;
    }

    function parseNumber(text) {
        if (!text) return null;
        const match = text.match(/-?\d+(\.\d+)?/);
        return match ? parseFloat(match[0]) : null;
    }

    function beepTriple(frequency = 880, duration = 0.1, volume = beepVolume) {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const playBeep = () => {
                const oscillator = ctx.createOscillator();
                const gain = ctx.createGain();
                oscillator.connect(gain);
                gain.connect(ctx.destination);
                oscillator.type = 'square';
                oscillator.frequency.value = frequency;
                gain.gain.value = volume;
                oscillator.start();
                oscillator.stop(ctx.currentTime + duration);
            };
            playBeep();
            setTimeout(playBeep, duration * 1000 + 100);
            setTimeout(playBeep, 2 * (duration * 1000 + 100));
        } catch (e) {
            console.log(getTimeString(), '無法播放聲音:', e);
        }
    }

    function playCmaj7Arpeggio(volume = beepVolume, duration = 0.25) {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const d = 48;
            const notes = [16.35 * d, 20.6 * d, 24.5 * d, 30.87 * d]; // C, E, G, B
            notes.forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'triangle';
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(volume, ctx.currentTime + i * duration);
                osc.start(ctx.currentTime + i * duration);
                osc.stop(ctx.currentTime + (i + 1) * duration);
            });
        } catch (e) {
            console.log(getTimeString(), '無法播放 arpeggio:', e);
        }
    }

    // === 控制面板 ===
    function createControlPanel() {
        if (window.__grokImaginePanel) return window.__grokImaginePanel.querySelector('#grok-console');

        const panel = document.createElement('div');
        panel.style.position = 'fixed';
        panel.style.top = '80px';
        panel.style.right = '10px';
        panel.style.zIndex = '99999';
        panel.style.background = 'rgba(30,30,30,0.9)';
        panel.style.color = '#fff';
        panel.style.padding = '10px 12px';
        panel.style.borderRadius = '10px';
        panel.style.fontSize = '14px';
        panel.style.fontFamily = 'monospace';
        panel.style.boxShadow = '0 4px 12px rgba(0,0,0,0.6)';
        panel.style.backdropFilter = 'blur(5px)';
        panel.style.width = '360px';
        panel.style.maxHeight = '520px';
        panel.style.display = 'flex';
        panel.style.flexDirection = 'column';
        panel.style.pointerEvents = 'auto';
        panel.style.userSelect = 'none';

        // Header (用作拖曳)
        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.cursor = 'move';
        header.style.marginBottom = '6px';
        header.style.gap = '8px';

        const title = document.createElement('div');
        title.style.fontWeight = 'bold';
        title.textContent = 'Grok 檢查控制';
        header.appendChild(title);

        // buttons group (minimize)
        const btnGroup = document.createElement('div');
        btnGroup.style.display = 'flex';
        btnGroup.style.alignItems = 'center';
        btnGroup.style.gap = '6px';

        const minimizeBtn = document.createElement('button');
        minimizeBtn.textContent = '－';
        minimizeBtn.title = '縮小/展開';
        minimizeBtn.style.background = 'transparent';
        minimizeBtn.style.border = 'none';
        minimizeBtn.style.color = '#fff';
        minimizeBtn.style.fontSize = '18px';
        minimizeBtn.style.cursor = 'pointer';
        minimizeBtn.style.padding = '0 6px';
        btnGroup.appendChild(minimizeBtn);

        header.appendChild(btnGroup);
        panel.appendChild(header);

        // 內容區塊（可縮放）
        const content = document.createElement('div');
        content.style.display = 'flex';
        content.style.flexDirection = 'column';
        content.style.gap = '6px';
        content.style.flex = '1';
        content.style.overflow = 'hidden';

        // Controls HTML (用 JS 建)
        const rowAuto = document.createElement('div');
        rowAuto.style.display = 'flex';
        rowAuto.style.alignItems = 'center';
        rowAuto.innerHTML = `<label style="display:flex;align-items:center;gap:6px;"><input type="checkbox" id="autoModeToggle" checked /> 自動模式</label>`;
        content.appendChild(rowAuto);

        const rowThreshold = document.createElement('div');
        rowThreshold.style.display = 'flex';
        rowThreshold.style.alignItems = 'center';
        rowThreshold.style.gap = '8px';
        rowThreshold.style.marginBottom = '2px';
        rowThreshold.innerHTML = `閥值(%):`;
        const thresholdInput = document.createElement('input');
        thresholdInput.type = 'number';
        thresholdInput.id = 'thresholdInput';
        thresholdInput.value = threshold;
        thresholdInput.min = 0;
        thresholdInput.max = 100;
        thresholdInput.step = 1;
        thresholdInput.style.width = '60px';
        thresholdInput.style.padding = '4px';
        thresholdInput.style.borderRadius = '4px';
        thresholdInput.style.border = 'none';
        thresholdInput.style.textAlign = 'center';

        const thresholdSlider = document.createElement('input');
        thresholdSlider.type = 'range';
        thresholdSlider.id = 'thresholdSlider';
        thresholdSlider.min = 0;
        thresholdSlider.max = 100;
        thresholdSlider.step = 1;
        thresholdSlider.value = threshold;
        thresholdSlider.style.flex = '1';

        rowThreshold.appendChild(thresholdInput);
        rowThreshold.appendChild(thresholdSlider);
        content.appendChild(rowThreshold);

        const rowBeep = document.createElement('div');
        rowBeep.style.display = 'flex';
        rowBeep.style.alignItems = 'center';
        rowBeep.innerHTML = `<label style="display:flex;align-items:center;gap:6px;"><input type="checkbox" id="beepToggle" checked /> 低於閾值播放音效</label>`;
        content.appendChild(rowBeep);

    const rowLimit = document.createElement('div');
    rowLimit.style.display = 'flex';
    rowLimit.style.alignItems = 'center';
    rowLimit.innerHTML = `<label style="display:flex;align-items:center;gap:6px;"><input type="checkbox" id="limitToggle" checked /> 額度用完提醒音效</label>`;
    content.appendChild(rowLimit);

    // 新增: 成功後持續通知勾選盒
    const rowPersistentSuccess = document.createElement('div');
    rowPersistentSuccess.style.display = 'flex';
    rowPersistentSuccess.style.alignItems = 'center';
    rowPersistentSuccess.innerHTML = `<label style="display:flex;align-items:center;gap:6px;"><input type="checkbox" id="persistentSuccessToggle" /> 成功後持續通知</label>`;
    content.appendChild(rowPersistentSuccess);

    // 新增: 關鍵字輸入（在生成失敗重試前會自動填入到 prompt textarea）
    const rowKeyword = document.createElement('div');
    rowKeyword.style.display = 'flex';
    rowKeyword.style.alignItems = 'center';
    rowKeyword.style.gap = '8px';
    rowKeyword.innerHTML = `失敗時填入關鍵字:`;
    const keywordInput = document.createElement('input');
    keywordInput.type = 'text';
    keywordInput.id = 'keywordInput';
    keywordInput.placeholder = '在此輸入要填入的 prompt';
    keywordInput.style.flex = '1';
    keywordInput.style.padding = '4px';
    keywordInput.style.borderRadius = '4px';
    keywordInput.style.border = 'none';
    keywordInput.value = failurePrompt || '';
    keywordInput.addEventListener('input', () => {
        failurePrompt = keywordInput.value;
        try { localStorage.setItem('grok_failure_prompt', failurePrompt); } catch (e) {}
    });
    rowKeyword.appendChild(keywordInput);
    content.appendChild(rowKeyword);

        // 音量 row 改百分比顯示
        const rowVolume = document.createElement('div');
        rowVolume.style.display = 'flex';
        rowVolume.style.alignItems = 'center';
        rowVolume.style.gap = '8px';
        rowVolume.innerHTML = `音量:`;
        const volumeSlider = document.createElement('input');
        volumeSlider.type = 'range';
        volumeSlider.id = 'volumeSlider';
        volumeSlider.min = 0;
        volumeSlider.max = 0.05;
        volumeSlider.step = 0.001;
        volumeSlider.value = beepVolume;
        volumeSlider.style.flex = '1';
        const volumeDisplay = document.createElement('span');
        volumeDisplay.id = 'volumeDisplay';
        volumeDisplay.textContent = Math.round(beepVolume / 0.05 * 100) + '%';
        rowVolume.appendChild(volumeSlider);
        rowVolume.appendChild(volumeDisplay);
        content.appendChild(rowVolume);

        // 統計顯示
        const statTitle = document.createElement('div');
        statTitle.style.fontWeight = 'bold';
        statTitle.textContent = '生成統計';
        content.appendChild(statTitle);

        const statRow = document.createElement('div');
        statRow.style.display = 'flex';
        statRow.style.gap = '10px';
        statRow.style.fontSize = '13px';
        statRow.innerHTML = `<span id="statTotal">總生成: 0</span><span id="statSuccess">成功: 0</span><span id="statFail">失敗: 0</span>`;
        content.appendChild(statRow);

        // console box
        const consoleBox = document.createElement('div');
        consoleBox.id = 'grok-console';
        consoleBox.style.flex = '1';
        consoleBox.style.background = 'rgba(0,0,0,0.28)';
        consoleBox.style.padding = '6px';
        consoleBox.style.borderRadius = '6px';
        consoleBox.style.overflowY = 'auto';
        consoleBox.style.fontSize = '12px';
        consoleBox.style.lineHeight = '1.4';
        consoleBox.style.whiteSpace = 'pre-wrap';
        consoleBox.style.minHeight = '120px';
        consoleBox.style.maxHeight = '250px'; // ⚡ 防止擠壓按鈕
        content.appendChild(consoleBox);

        // 按鈕列
        const btnRow = document.createElement('div');
        btnRow.style.display = 'flex';
        btnRow.style.gap = '8px';
        btnRow.style.marginTop = '6px';
        btnRow.style.justifyContent = 'flex-start';

        // 清空紀錄
        const clearBtn = document.createElement('button');
        clearBtn.textContent = '🧹 清空紀錄';
        clearBtn.style.background = 'rgba(255,255,255,0.06)';
        clearBtn.style.border = 'none';
        clearBtn.style.color = '#ccc';
        clearBtn.style.padding = '6px 10px';
        clearBtn.style.borderRadius = '6px';
        clearBtn.style.cursor = 'pointer';
        clearBtn.addEventListener('mouseenter', () => clearBtn.style.color = '#fff');
        clearBtn.addEventListener('mouseleave', () => clearBtn.style.color = '#ccc');
        clearBtn.addEventListener('click', () => {
            consoleBox.innerHTML = '';
            stats = { total: 0, success: 0, fail: 0 };
            if (window.__grokImaginePanel && window.__grokImaginePanel._updateStatsDisplay)
                window.__grokImaginePanel._updateStatsDisplay();
        });

        // 複製記錄
        const copyBtn = document.createElement('button');
        copyBtn.textContent = '📋 複製記錄';
        copyBtn.style.background = 'rgba(50,50,255,0.8)';
        copyBtn.style.border = 'none';
        copyBtn.style.color = '#fff';
        copyBtn.style.padding = '6px 10px';
        copyBtn.style.borderRadius = '6px';
        copyBtn.style.cursor = 'pointer';
        copyBtn.addEventListener('mouseenter', () => copyBtn.style.opacity = '0.85');
        copyBtn.addEventListener('mouseleave', () => copyBtn.style.opacity = '1');
        copyBtn.addEventListener('click', async () => {
            try {
                const text = consoleBox.innerText || '';
                const summary = `生成統計：總生成: ${stats.total}，成功: ${stats.success}，失敗: ${stats.fail}`;
                const finalText = text.trim() ? text + '\n\n' + summary : summary;
                await navigator.clipboard.writeText(finalText);
                console.log(`${getTimeString()} 已複製 console 記錄到剪貼簿`);
                console.log(summary);
            } catch (e) { console.log(`${getTimeString()} 複製失敗:`, e); }
        });

        // 登出按鈕
        const logoutBtn = document.createElement('button');
        logoutBtn.textContent = '🚪 登出';
        logoutBtn.style.background = 'rgba(255,50,50,0.8)';
        logoutBtn.style.border = 'none';
        logoutBtn.style.color = '#fff';
        logoutBtn.style.padding = '6px 10px';
        logoutBtn.style.borderRadius = '6px';
        logoutBtn.style.cursor = 'pointer';
        logoutBtn.addEventListener('mouseenter', () => logoutBtn.style.opacity = '0.85');
        logoutBtn.addEventListener('mouseleave', () => logoutBtn.style.opacity = '1');
        logoutBtn.addEventListener('click', tryLogout);

        btnRow.appendChild(clearBtn);
        btnRow.appendChild(copyBtn);
        btnRow.appendChild(logoutBtn);
        content.appendChild(btnRow);

        panel.appendChild(content);
        document.body.appendChild(panel);
        window.__grokImaginePanel = panel;

        // 變數綁定
    const autoModeToggle = panel.querySelector('#autoModeToggle');
    const thresholdInputEl = thresholdInput;
    const thresholdSliderEl = thresholdSlider;
    const beepToggle = panel.querySelector('#beepToggle');
    const limitToggle = panel.querySelector('#limitToggle');
    const persistentSuccessToggle = panel.querySelector('#persistentSuccessToggle');
    const volumeSliderEl = volumeSlider;
    const volumeDisplayEl = volumeDisplay;

        // hook console
        hookConsole(consoleBox);

        // 同步事件綁定
        autoModeToggle.addEventListener('change', () => { autoMode = autoModeToggle.checked; console.log(`${getTimeString()} 自動模式: ${autoMode ? '啟用' : '停用'}`); });

        thresholdInputEl.addEventListener('input', () => {
            let val = parseFloat(thresholdInputEl.value);
            if (isNaN(val)) val = 0;
            threshold = Math.min(Math.max(val, 0), 100);
            thresholdSliderEl.value = threshold;
        });
        thresholdSliderEl.addEventListener('input', () => {
            threshold = parseFloat(thresholdSliderEl.value);
            thresholdInputEl.value = threshold;
        });

    beepToggle.addEventListener('change', () => { playBeepOnLow = beepToggle.checked; });
    limitToggle.addEventListener('change', () => { playBeepOnLimit = limitToggle.checked; });
    persistentSuccessToggle.addEventListener('change', () => { persistentSuccessNotify = persistentSuccessToggle.checked; });

        volumeSliderEl.addEventListener('input', () => {
            beepVolume = parseFloat(volumeSliderEl.value);
            const percent = Math.round(beepVolume / 0.05 * 100);
            volumeDisplayEl.textContent = percent + '%';
        });

        function updateStatsDisplay() {
            const totalEl = panel.querySelector('#statTotal');
            const successEl = panel.querySelector('#statSuccess');
            const failEl = panel.querySelector('#statFail');
            if (totalEl) totalEl.textContent = `總生成: ${stats.total}`;
            if (successEl) successEl.textContent = `成功: ${stats.success}`;
            if (failEl) failEl.textContent = `失敗: ${stats.fail}`;
        }
        panel._updateStatsDisplay = updateStatsDisplay;

        // 拖曳功能 (保持在視窗內)
        let isDragging = false, offsetX = 0, offsetY = 0;
        header.addEventListener('mousedown', e => {
            isDragging = true;
            const rect = panel.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            panel.style.transition = 'none';
            document.body.style.userSelect = 'none';
        });
        document.addEventListener('mousemove', e => {
            if (!isDragging) return;
            let newLeft = e.clientX - offsetX;
            let newTop = e.clientY - offsetY;
            newLeft = Math.min(Math.max(newLeft, 0), window.innerWidth - panel.offsetWidth);
            newTop = Math.min(Math.max(newTop, 0), window.innerHeight - panel.offsetHeight);
            panel.style.left = newLeft + 'px';
            panel.style.top = newTop + 'px';
            panel.style.right = 'auto';
        });
        document.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            panel.style.transition = '';
            document.body.style.userSelect = '';
        });

        // 縮小/展開
        let minimized = false;
        minimizeBtn.addEventListener('click', () => {
            minimized = !minimized;
            content.style.display = minimized ? 'none' : 'flex';
            minimizeBtn.textContent = minimized ? '＋' : '－';
        });

        return consoleBox;
    }

    function hookConsole(consoleBox) {
        const originalLog = console.log;
        console.log = (...args) => {
            try {
                originalLog.apply(console, args);
                const msg = args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ');
                const entry = document.createElement('div');
                if (msg.includes('成功')) entry.style.color = '#6eff9f';
                else if (msg.includes('失敗')) entry.style.color = '#ff7b7b';
                else entry.style.color = '#ffd966';
                entry.textContent = msg;
                consoleBox.appendChild(entry);
                consoleBox.scrollTop = consoleBox.scrollHeight;
            } catch (e) { originalLog('hookConsole error:', e); }
        };
    }

    // === 檢查邏輯 ===
    // 新增: 持續音效控制
    let persistentBeepInterval = null;
    function startPersistentBeep() {
        if (persistentBeepInterval) return;
        // 立即播放第一次
        playCmaj7Arpeggio(beepVolume);
        // 然後開始間隔播放
        persistentBeepInterval = setInterval(() => {
            playCmaj7Arpeggio(beepVolume);
        }, 2000); // 每2秒持續播放
    }
    function stopPersistentBeep() {
        if (persistentBeepInterval) {
            clearInterval(persistentBeepInterval);
            persistentBeepInterval = null;
        }
    }

    function showPersistentSuccessBox() {
        // 若已存在則不重複顯示
        if (document.getElementById('persistent-success-msgbox')) return;
        const box = document.createElement('div');
        box.id = 'persistent-success-msgbox';
        box.style.position = 'fixed';
        box.style.top = '50%';
        box.style.left = '50%';
        box.style.transform = 'translate(-50%, -50%)';
        box.style.zIndex = '100000';
        box.style.background = 'rgba(40,40,40,0.98)';
        box.style.color = '#fff';
        box.style.padding = '32px 36px';
        box.style.borderRadius = '16px';
        box.style.fontSize = '20px';
        box.style.fontFamily = 'monospace';
        box.style.boxShadow = '0 8px 32px rgba(0,0,0,0.7)';
        box.style.textAlign = 'center';
        box.innerHTML = `<div style="margin-bottom:18px;">成功提示！</div><button id="persistent-success-confirm" style="font-size:18px;padding:8px 24px;border-radius:8px;background:#6eff9f;color:#222;border:none;cursor:pointer;">停止</button>`;
        document.body.appendChild(box);
        const btn = box.querySelector('#persistent-success-confirm');
        btn.addEventListener('click', () => {
            stopPersistentBeep();
            box.remove();
        });
    }

    function check() {
        try {
            const upgradeElem = document.querySelector('span.text-secondary.font-medium');
            if (upgradeElem && upgradeElem.textContent.includes('Upgrade to unlock more')) {
                if (!limitAlertShown) {
                    limitAlertShown = true;
                    console.log(`${getTimeString()} 額度已用完！`);
                    if (playBeepOnLimit) beepTriple(440, 0.15);
                }
            } else { limitAlertShown = false; }

            const elem = document.querySelector(selector);
            // console.log('check()', '檢測進度元素:', elem ? '存在' : '不存在');
            if (elem) {
                wasPresent = true;
                const val = parseNumber(elem.textContent.trim());
                if (!isNaN(val)) lastValue = val;
                // console.log(`${getTimeString()} 當前進度: ${lastValue !== null ? lastValue + '%' : '未知'}`);
                if (val === 0) {
                    zeroCount++;
                    if (zeroCount >= zeroMaxCount && autoMode) {
                        if (consecutiveRetries >= maxConsecutiveRetries) {
                            if (!maxRetriesAlertShown) {
                                console.log(`${getTimeString()} 已連續重試${consecutiveRetries}次仍卡在0%，停止自動重試`);
                                if (playBeepOnLimit) beepTriple(440, 0.15); // 播放提示音
                                maxRetriesAlertShown = true; // 標記已經顯示過警報
                            }
                            return;
                        }
                        const button = document.querySelector('button[data-slot="button"].bg-button-filled'); // 生成按鈕
                        if (button) {
                            button.click();
                            console.log(`${getTimeString()} 長時間為0，已再次點擊生成按鈕 (第${consecutiveRetries + 1}次重試)`);
                            consecutiveRetries++;
                        }
                        else { console.log(`${getTimeString()} 長時間為0，但找不到生成按鈕`); }
                        zeroCount = 0;
                    }
                } else {
                    zeroCount = 0;
                    consecutiveRetries = 0; // 當進度不為0時重置重試計數
                    maxRetriesAlertShown = false; // 重置警報標記
                }

            } else if (wasPresent) {
                wasPresent = false;
                stats.total++;
                const progress = lastValue !== null ? lastValue : "未知";
                // console.log(`${getTimeString()} (進度: ${lastValue})`);
                // ===== 新增功能：生成成功後 5 秒內每秒檢測 Content Moderated =====
				const moderationCheckDuration = 10000; // 10 秒
				const checkInterval = 1000; // 每秒檢測
				const startTime = Date.now();
				const moderationIntervalId = setInterval(() => {
                // 超過檢測時間就停止；若五秒內未檢測到 Content Moderated，判定為成功
                if (Date.now() - startTime > moderationCheckDuration) {
                    // 最後一次確認是否有 Content Moderated 訊息
                    const finalElem = document.querySelector('body > section > ol > li > div > span');
                    if (!(finalElem && finalElem.textContent.includes('Content Moderated. Try a different idea.'))) {
                        // 沒有偵測到警告，判定為生成成功
                        stats.success++;
                        console.log(`${getTimeString()} 10秒內未檢測到Content Moderated，判定成功！(進度: ${progress}%)`);
                        if (persistentSuccessNotify) {
                            showPersistentSuccessBox();
                            startPersistentBeep();
                        } else {
                            playCmaj7Arpeggio(beepVolume);
                        }
                        if (window.__grokImaginePanel && window.__grokImaginePanel._updateStatsDisplay) window.__grokImaginePanel._updateStatsDisplay();
                    }
                    clearInterval(moderationIntervalId);
                    return;
                }

                const elem = document.querySelector('body > section > ol > li > div > span'); // Content Moderated 訊息元素

                if (elem && elem.textContent.includes('Content Moderated. Try a different idea.')) {
                    const button = document.querySelector('button[data-slot="button"].bg-button-filled'); // 生成按鈕
                    stats.fail++;
                    if (window.__grokImaginePanel && window.__grokImaginePanel._updateStatsDisplay) window.__grokImaginePanel._updateStatsDisplay();
                    if (autoMode && progress >= threshold) {
                        // 如果設定了 failurePrompt，先嘗試把它填入可用的輸入框（textarea 或 contenteditable），再點擊生成
                        const fillAndClick = (delay = 300) => {
                            const target = document.querySelector('textarea') || document.querySelector('textarea[name]') || document.querySelector('div[contenteditable="true"]') || document.querySelector('div[role="textbox"]');
                            if (target) {
                                try {
                                    // 優先使用原生 setter（對 React controlled component 有效）
                                    if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') {
                                        const nativeSetter = Object.getOwnPropertyDescriptor(target.constructor.prototype, 'value')?.set;
                                        if (nativeSetter) nativeSetter.call(target, failurePrompt);
                                        else target.value = failurePrompt;
                                        target.dispatchEvent(new Event('input', { bubbles: true }));
                                        target.dispatchEvent(new Event('change', { bubbles: true }));
                                    } else {
                                        // contenteditable
                                        target.focus();
                                        target.innerText = failurePrompt;
                                        target.dispatchEvent(new InputEvent('input', { bubbles: true }));
                                        target.dispatchEvent(new Event('change', { bubbles: true }));
                                    }
                                    // console.log(`${getTimeString()} 已將關鍵字填入輸入框: ${failurePrompt}`);
                                } catch (e) { console.log(`${getTimeString()} 填入關鍵字失敗:`, e); }
                            } else {
                                console.log(`${getTimeString()} 找不到可填入的輸入框（textarea 或 contenteditable），將直接點擊生成`);
                            }

                            setTimeout(() => {
                                if (button) {
                                    button.click();
                                    console.log(`${getTimeString()} 已自動點擊生成按鈕 (進度: ${progress}%)`);
                                } else {
                                    console.log(`${getTimeString()} 找不到生成按鈕 (進度: ${progress}%)`);
                                }
                            }, delay);
                        };

                        if (failurePrompt && failurePrompt.trim()) {
                            fillAndClick(300);
                        } else {
                            if (button) {
                                button.click();
                                console.log(`${getTimeString()} 生成後 5 秒內檢測到 Content Moderated，自動再次點擊生成按鈕(進度: ${progress}%)`);
                            } else {
                                console.log(`${getTimeString()} 生成後 5 秒內檢測到 Content Moderated，但找不到生成按鈕(進度: ${progress}%)`);
                            }
                        }
                    } else {
                        console.log(`${getTimeString()} 低於閾值(進度: ${progress}%)`);
                        // 保留提示音
                        beepTriple();
                        // 若有設定 failurePrompt，嘗試自動填入但不自動點擊（讓使用者決定是否重新生成）
                        if (failurePrompt && failurePrompt.trim()) {
                            const target = document.querySelector('textarea') || document.querySelector('textarea[name]') || document.querySelector('div[contenteditable="true"]') || document.querySelector('div[role="textbox"]');
                            if (target) {
                                try {
                                    if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') {
                                        const nativeSetter = Object.getOwnPropertyDescriptor(target.constructor.prototype, 'value')?.set;
                                        if (nativeSetter) nativeSetter.call(target, failurePrompt);
                                        else target.value = failurePrompt;
                                        target.dispatchEvent(new Event('input', { bubbles: true }));
                                        target.dispatchEvent(new Event('change', { bubbles: true }));
                                    } else {
                                        target.focus();
                                        target.innerText = failurePrompt;
                                        target.dispatchEvent(new InputEvent('input', { bubbles: true }));
                                        target.dispatchEvent(new Event('change', { bubbles: true }));
                                    }
                                    console.log(`${getTimeString()} 已將關鍵字填入輸入框（低於閾值）`);
                                } catch (e) { console.log(`${getTimeString()} 填入關鍵字失敗（低於閾值）:`, e); }
                            } else {
                                console.log(`${getTimeString()} 找不到可填入的輸入框（低於閾值）`);
                            }
                        }
                    }
                    // 只處理一次就停止
                    clearInterval(moderationIntervalId);
                }
				}, checkInterval);
				// ===== End 新增功能 =====

                if (window.__grokImaginePanel && window.__grokImaginePanel._updateStatsDisplay) window.__grokImaginePanel._updateStatsDisplay();
                lastValue = null;
            }
        } catch (e) { console.log(getTimeString(), 'check() 發生錯誤:', e); }
    }

    function tryLogout() {
        const attemptLogout = () => {
            const sidebar = document.querySelector('div[data-variant="sidebar"][data-side="left"]');
            if (sidebar && sidebar.getAttribute('data-state') === 'expanded') {
                const triggerBtn = document.querySelector('button[data-sidebar="trigger"]');
                if (triggerBtn) { triggerBtn.click(); setTimeout(attemptLogout, 300); return; }
            }
            const trigger = document.querySelector('button[id^="radix-"][aria-haspopup="menu"]');
            if (trigger) {
                ['pointerdown','mousedown','mouseup','pointerup','click'].forEach(type => trigger.dispatchEvent(new MouseEvent(type,{bubbles:true,cancelable:true,view:window})));
                setTimeout(() => {
                    const allItems = document.querySelectorAll('div[role="menuitem"].flex.cursor-pointer');
                    const logoutBtn = allItems[allItems.length - 1]; // 通常登出是最後一個

                    if (logoutBtn) {
                        ['pointerdown','mousedown','mouseup','pointerup','click'].forEach(type =>
                            logoutBtn.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, view: window }))
                        );
                        console.log('✅ 已嘗試點擊登出');
                    } else {
                        console.log('⚠️ 找不到登出');
                        setTimeout(attemptLogout, 1000);
                    }
                }, 500);
            } else setTimeout(attemptLogout,1000);
        };
        attemptLogout();
    }

    function startChecker() {
        if (worker) return;
        const workerCode = `setInterval(()=>postMessage('tick'), ${checkInterval});`;
        const blob = new Blob([workerCode], { type: 'application/javascript' });
        worker = new Worker(URL.createObjectURL(blob));
        worker.onmessage = () => check();
    }

    function stopChecker() { if(worker) { worker.terminate(); worker = null; } }

    function isImaginePage() { return location.pathname.startsWith('/imagine/'); }

    function handlePageChange() {
        if (isImaginePage()) { if(window.__grokImaginePanel) window.__grokImaginePanel.style.display='flex'; startChecker(); }
        else { if(window.__grokImaginePanel) window.__grokImaginePanel.style.display='none'; stopChecker(); }
    }

    const consoleBox = createControlPanel();
    handlePageChange();

    let lastPath = location.pathname;
    const observer = new MutationObserver(()=>{ if(location.pathname !== lastPath){ lastPath = location.pathname; handlePageChange(); }});

observer.observe(document, {subtree:true, childList:true});

document.addEventListener('visibilitychange',()=>{ if(!document.hidden) check(); });

})();