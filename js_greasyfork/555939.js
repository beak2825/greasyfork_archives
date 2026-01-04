// ==UserScript==
// @name         Gemini Hunter (UI Optimized)
// @namespace    http://tampermonkey.net/
// @version      2.23.0
// @description  Gemini Hunter 自动辅助工具（界面优化版）：默认折叠配置项，支持自定义提问词、筛选关键词及图片开关。
// @author       Mozi & Google Gemini
// @match        https://lmarena.ai/*
// @match        https://beta.lmarena.ai/*
// @match        https://chat.lmsys.org/*
// @icon         https://lmarena.ai/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant        GM_notification
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555939/Gemini%20Hunter%20%28UI%20Optimized%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555939/Gemini%20Hunter%20%28UI%20Optimized%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================================================
    // --- 【后台防休眠核心】 Web Worker 代理定时器 ---
    // ============================================================
    const workerBlob = new Blob([`
        var timers = {};
        self.onmessage = function(e) {
            var data = e.data;
            switch (data.type) {
                case 'SET_INTERVAL':
                    timers[data.id] = setInterval(function() {
                        self.postMessage({ type: 'TICK', id: data.id });
                    }, data.delay);
                    break;
                case 'CLEAR_INTERVAL':
                    clearInterval(timers[data.id]);
                    delete timers[data.id];
                    break;
                case 'SET_TIMEOUT':
                    timers[data.id] = setTimeout(function() {
                        self.postMessage({ type: 'TICK', id: data.id });
                        delete timers[data.id];
                    }, data.delay);
                    break;
                case 'CLEAR_TIMEOUT':
                    clearTimeout(timers[data.id]);
                    delete timers[data.id];
                    break;
            }
        };
    `], { type: 'application/javascript' });

    const workerUrl = URL.createObjectURL(workerBlob);
    const bgWorker = new Worker(workerUrl);
    const workerCallbacks = {};
    let workerTimerIdCounter = 0;

    bgWorker.onmessage = function(e) {
        const callback = workerCallbacks[e.data.id];
        if (callback && typeof callback === 'function') {
            callback();
        }
    };

    const wrapTimer = (type, callback, delay) => {
        const id = ++workerTimerIdCounter;
        workerCallbacks[id] = callback;
        bgWorker.postMessage({ type, id, delay });
        return id;
    };

    const clearWorkerTimer = (type, id) => {
        if (workerCallbacks[id]) {
            bgWorker.postMessage({ type, id });
            delete workerCallbacks[id];
        }
    };

    const setInterval = (cb, delay) => wrapTimer('SET_INTERVAL', cb, delay);
    const clearInterval = (id) => clearWorkerTimer('CLEAR_INTERVAL', id);
    const setTimeout = (cb, delay) => wrapTimer('SET_TIMEOUT', cb, delay);
    const clearTimeout = (id) => clearWorkerTimer('CLEAR_TIMEOUT', id);
    // ============================================================

    // --- 核心配置 ---
    const savedPrompt = GM_getValue('gh_custom_prompt', "你是谁");
    const savedKeywords = GM_getValue('gh_custom_keywords', "Gemini");

    const CONFIG = {
        placeholderText: "正在查找，请稍后...",
        resetUrl: window.location.origin + "/c/new",
        defaultIcon: "🧬",
        titlePrefix: "Gemini Hunter"
    };

    const getChatId = () => {
        const match = window.location.pathname.match(/\/c\/([a-z0-9-]+)/);
        return match ? match[1] : null;
    };

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // --- 状态管理 ---
    let storedIsRunning = sessionStorage.getItem('gh_isRunning') === 'true';
    let isRunning = storedIsRunning;
    let attemptCount = parseInt(sessionStorage.getItem('gh_attempt_count') || '0');

    const currentChatId = getChatId();
    let savedLockedSide = sessionStorage.getItem('gh_locked_side');

    if (!savedLockedSide && currentChatId) {
        savedLockedSide = GM_getValue('gh_locked_side_' + currentChatId, null);
    }

    let lockedSide = savedLockedSide;

    // 设置项
    let isMinimized = GM_getValue('gh_minimized_state_v1', false);
    let isConfigOpen = GM_getValue('gh_config_open', false);
    let isAutoExpand = GM_getValue('gh_auto_expand', true);
    let isSoundEnabled = GM_getValue('gh_sound_enabled', true);
    let isAutoHideOther = GM_getValue('gh_auto_hide_other', false);
    let isRemoveVoteUI = GM_getValue('gh_remove_vote_ui', true);
    let isImageInjectionEnabled = GM_getValue('gh_inject_image', true);

    let timerInterval = null;
    let highlightInterval = null;
    let checkLoopInterval = null;
    let timerActive = false;
    let originalTitle = document.title;

    // --- UI 构建 (结构优化) ---
    const uiHtml = `
        <div id="gh-panel" style="${isMinimized ? 'display:none;' : ''}">
            <div class="gh-blur-bg"></div>
            <div class="gh-header" id="gh-header">
                <div class="gh-title">
                    <span class="gh-icon">🧬</span> GHunter
                </div>
                <div class="gh-win-ctrl">
                    <div id="gh-btn-cfg" title="设置" class="${isConfigOpen ? 'active' : ''}">⚙️</div>
                    <div id="gh-btn-min" title="收起"></div>
                </div>
            </div>
            <div class="gh-body">
                <!-- 核心信息区 (始终显示) -->
                <div class="gh-info-row">
                    <div class="gh-info-box">
                        <span class="gh-label">TIME</span>
                        <span id="gh-timer-display">0.00s</span>
                    </div>
                    <div class="gh-divider"></div>
                    <div class="gh-info-box">
                        <span class="gh-label">TRY</span>
                        <span id="gh-count-display">#${attemptCount}</span>
                    </div>
                </div>
                <div class="gh-status-bar">
                    <div class="gh-dot"></div>
                    <span id="gh-msg">就绪</span>
                </div>

                <!-- 控制按钮区 (始终显示) -->
                <div class="gh-controls">
                    <button id="gh-btn-start">
                        <span class="btn-icon">▶</span> 开始查找
                    </button>
                    <button id="gh-btn-stop" style="display:none;">
                        <span class="btn-icon">⏹</span> 停止运行
                    </button>
                </div>

                <!-- 配置面板 (可折叠) -->
                <div id="gh-config-body" style="${isConfigOpen ? '' : 'display:none;'}">
                    <div class="gh-line-divider"></div>
                    <div class="gh-input-area">
                        <div class="gh-input-group">
                            <span class="gh-input-label">提问词</span>
                            <input type="text" id="gh-inp-prompt" class="gh-text-input" value="${savedPrompt}">
                        </div>
                        <div class="gh-input-group">
                            <span class="gh-input-label">关键词 (逗号分隔)</span>
                            <input type="text" id="gh-inp-keywords" class="gh-text-input" value="${savedKeywords}" placeholder="如: Gemini, Google">
                        </div>
                    </div>

                    <div class="gh-settings-grid">
                        <label class="gh-toggle-box">
                            <span class="gh-lbl">注入图片</span>
                            <div class="gh-switch">
                                <input type="checkbox" id="gh-chk-image" ${isImageInjectionEnabled ? 'checked' : ''}>
                                <span class="gh-slider"></span>
                            </div>
                        </label>
                        <label class="gh-toggle-box">
                            <span class="gh-lbl">自动全屏</span>
                            <div class="gh-switch">
                                <input type="checkbox" id="gh-chk-expand" ${isAutoExpand ? 'checked' : ''}>
                                <span class="gh-slider"></span>
                            </div>
                        </label>
                        <label class="gh-toggle-box">
                            <span class="gh-lbl">专注模式</span>
                            <div class="gh-switch">
                                <input type="checkbox" id="gh-chk-hide" ${isAutoHideOther ? 'checked' : ''}>
                                <span class="gh-slider"></span>
                            </div>
                        </label>
                        <label class="gh-toggle-box">
                            <span class="gh-lbl">去投票框</span>
                            <div class="gh-switch">
                                <input type="checkbox" id="gh-chk-remove-vote" ${isRemoveVoteUI ? 'checked' : ''}>
                                <span class="gh-slider"></span>
                            </div>
                        </label>
                        <label class="gh-toggle-box" style="grid-column: span 2;">
                            <span class="gh-lbl">提示音效</span>
                            <div class="gh-switch">
                                <input type="checkbox" id="gh-chk-sound" ${isSoundEnabled ? 'checked' : ''}>
                                <span class="gh-slider"></span>
                            </div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
        <div id="gh-ball" style="${!isMinimized ? 'display:none;' : ''}">
            <div class="gh-ball-ripple"></div>
            <div class="gh-ball-inner">
                <span class="gh-ball-text">${CONFIG.defaultIcon}</span>
            </div>
        </div>
    `;

    const container = document.createElement('div');
    container.innerHTML = uiHtml;
    document.body.appendChild(container);

    // --- CSS (样式优化) ---
    GM_addStyle(`
        :root { --gh-primary: #3b82f6; --gh-primary-dark: #2563eb; --gh-success: #10b981; --gh-danger: #ef4444; --gh-bg: rgba(255, 255, 255, 0.95); --gh-shadow: 0 8px 24px rgba(0, 0, 0, 0.12); }
        #gh-panel { position: fixed; top: 12%; left: 5%; width: 90%; max-width: 250px; background: var(--gh-bg); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.8); border-radius: 16px; box-shadow: var(--gh-shadow); z-index: 100000; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; overflow: hidden; transition: opacity 0.2s, transform 0.2s; touch-action: none; }
        @media (min-width: 768px) { #gh-panel { width: 240px; top: 80px; right: 40px; left: auto; } }

        /* Header */
        .gh-header { padding: 10px 14px; display: flex; justify-content: space-between; align-items: center; cursor: move; user-select: none; border-bottom: 1px solid rgba(0,0,0,0.03); background: rgba(255,255,255,0.5); }
        .gh-title { font-weight: 700; font-size: 13px; color: #1f2937; display: flex; align-items: center; gap: 6px; }
        .gh-win-ctrl { display: flex; align-items: center; gap: 8px; }
        #gh-btn-min { width: 18px; height: 18px; border-radius: 50%; background: #e5e7eb; cursor: pointer; position: relative; transition: background 0.2s; }
        #gh-btn-min:hover { background: #d1d5db; }
        #gh-btn-min::before { content: ""; position: absolute; top: 8px; left: 4px; width: 10px; height: 2px; background: #6b7280; border-radius: 2px; }

        /* Config Button */
        #gh-btn-cfg { cursor: pointer; font-size: 14px; opacity: 0.6; transition: all 0.3s ease; line-height: 1; user-select: none; }
        #gh-btn-cfg:hover { opacity: 1; }
        #gh-btn-cfg.active { opacity: 1; transform: rotate(90deg); color: var(--gh-primary); }

        /* Body */
        .gh-body { padding: 12px 14px; display: flex; flex-direction: column; gap: 10px; }
        .gh-info-row { background: #f9fafb; border-radius: 10px; padding: 6px 10px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #f3f4f6; }
        .gh-info-box { display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1; }
        .gh-divider { width: 1px; height: 20px; background: #e5e7eb; margin: 0 8px; }
        .gh-label { font-size: 8px; font-weight: 800; color: #9ca3af; letter-spacing: 1px; margin-bottom: 1px; }
        #gh-timer-display { font-family: monospace; font-size: 14px; font-weight: 700; color: #374151; }
        #gh-count-display { font-family: monospace; font-size: 14px; font-weight: 700; color: #3b82f6; }

        .gh-status-bar { background: rgba(243, 244, 246, 0.6); padding: 6px 10px; border-radius: 8px; display: flex; align-items: center; gap: 8px; font-size: 12px; color: #4b5563; font-weight: 500; }
        .gh-dot { width: 6px; height: 6px; border-radius: 50%; background: #d1d5db; flex-shrink: 0;}
        .gh-dot.active { background: var(--gh-primary); box-shadow: 0 0 6px var(--gh-primary); animation: gh-pulse-dot 1.5s infinite; }
        .gh-dot.success { background: var(--gh-success); }
        .gh-dot.error { background: var(--gh-danger); }

        /* Controls */
        .gh-controls button { width: 100%; padding: 8px; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; font-size: 13px; display: flex; align-items: center; justify-content: center; gap: 6px; color: white; transition: transform 0.1s; }
        .gh-controls button:active { transform: scale(0.97); }
        #gh-btn-start { background: linear-gradient(135deg, #2563eb, #3b82f6); box-shadow: 0 4px 10px rgba(37, 99, 235, 0.25); }
        #gh-btn-stop { background: linear-gradient(135deg, #dc2626, #ef4444); box-shadow: 0 4px 10px rgba(239, 68, 68, 0.25); }

        /* Config Panel (Collapsible) */
        #gh-config-body { display: flex; flex-direction: column; gap: 10px; animation: gh-slide-down 0.3s ease-out; transform-origin: top; }
        .gh-line-divider { height: 1px; background: #f3f4f6; margin: 2px 0; }

        /* Inputs */
        .gh-input-area { display: flex; flex-direction: column; gap: 8px; }
        .gh-input-group { display: flex; flex-direction: column; gap: 3px; }
        .gh-input-label { font-size: 10px; font-weight: 700; color: #6b7280; margin-left: 2px; }
        .gh-text-input { width: 100%; padding: 5px 8px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 11px; outline: none; background: rgba(255,255,255,0.6); color: #374151; transition: border-color 0.2s, background 0.2s; }
        .gh-text-input:focus { border-color: var(--gh-primary); background: #fff; }

        /* Settings Grid (2 Columns) */
        .gh-settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 10px; padding: 0 2px; }
        .gh-toggle-box { display: flex; justify-content: space-between; align-items: center; cursor: pointer; user-select: none; background: rgba(0,0,0,0.02); padding: 4px 6px; border-radius: 6px; border: 1px solid transparent; transition: background 0.2s; }
        .gh-toggle-box:hover { background: rgba(0,0,0,0.04); }
        .gh-lbl { font-size: 10px; font-weight: 600; color: #4b5563; }

        /* Switch */
        .gh-switch { position: relative; display: inline-block; width: 28px; height: 16px; flex-shrink: 0; margin-left: 4px; }
        .gh-switch input { opacity: 0; width: 0; height: 0; }
        .gh-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #e5e7eb; transition: .3s; border-radius: 34px; }
        .gh-slider:before { position: absolute; content: ""; height: 12px; width: 12px; left: 2px; bottom: 2px; background-color: white; transition: .3s; border-radius: 50%; box-shadow: 0 1px 3px rgba(0,0,0,0.15); }
        input:checked + .gh-slider { background-color: var(--gh-primary); }
        input:checked + .gh-slider:before { transform: translateX(12px); }

        /* Minimized Ball */
        #gh-ball { position: fixed; top: 70%; right: 15px; width: 48px; height: 48px; z-index: 100001; cursor: pointer; user-select: none; display: flex; align-items: center; justify-content: center; touch-action: none; }
        .gh-ball-inner { width: 40px; height: 40px; background: #ffffff; border-radius: 50%; color: #2563eb; display: flex; align-items: center; justify-content: center; position: relative; z-index: 2; box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15); }
        .gh-ball-text { font-weight: 800; font-size: 20px; transition: all 0.3s; }
        .gh-google-letter { background: linear-gradient(135deg, #4285F4 20%, #EA4335 40%, #FBBC05 60%, #34A853 80%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent; font-family: "Google Sans", "Product Sans", Roboto, Arial, sans-serif; font-weight: 900 !important; font-size: 25px !important; letter-spacing: -1px; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1)); }
        .gh-ball-ripple { position: absolute; width: 52px; height: 52px; border-radius: 50%; border: 2px solid transparent; z-index: 1; transition: opacity 0.3s; pointer-events: none; opacity: 0; }
        #gh-ball.running .gh-ball-ripple { opacity: 1; border-top-color: #3b82f6; border-left-color: #a855f7; animation: gh-spin-smooth 1s linear infinite; }

        /* Utils */
        .gh-winner-glow { box-shadow: inset 0 0 0 3px #10b981, 0 0 25px rgba(16, 185, 129, 0.25) !important; border-radius: 12px !important; }
        .gh-hidden-bubble { display: none !important; }
        @keyframes gh-spin-smooth { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes gh-pulse-dot { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }
        @keyframes gh-slide-down { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
    `);

    // --- DOM 引用 ---
    const panel = document.getElementById('gh-panel');
    const ball = document.getElementById('gh-ball');
    const ballInner = ball.querySelector('.gh-ball-text');
    const btnMin = document.getElementById('gh-btn-min');
    const btnCfg = document.getElementById('gh-btn-cfg');
    const configBody = document.getElementById('gh-config-body');
    const header = document.getElementById('gh-header');
    const btnStart = document.getElementById('gh-btn-start');
    const btnStop = document.getElementById('gh-btn-stop');
    const txtMsg = document.getElementById('gh-msg');
    const dot = document.querySelector('.gh-dot');
    const chkExpand = document.getElementById('gh-chk-expand');
    const chkHide = document.getElementById('gh-chk-hide');
    const chkSound = document.getElementById('gh-chk-sound');
    const chkRemoveVote = document.getElementById('gh-chk-remove-vote');
    const chkImage = document.getElementById('gh-chk-image');
    const timerDisplay = document.getElementById('gh-timer-display');
    const countDisplay = document.getElementById('gh-count-display');
    const inpPrompt = document.getElementById('gh-inp-prompt');
    const inpKeywords = document.getElementById('gh-inp-keywords');

    // --- 辅助函数 ---
    function updateBallText(side) {
        if (side === 'A' || side === 'B' || side === 'BOTH') {
            ballInner.innerText = (side === 'BOTH') ? '双' : side;
            ballInner.className = 'gh-ball-text gh-google-letter';
        } else {
            ballInner.innerText = CONFIG.defaultIcon;
            ballInner.className = 'gh-ball-text';
        }
    }

    function updateCountDisplay() { countDisplay.innerText = "#" + attemptCount; }
    function getActiveKeywords() { return (inpKeywords.value || "Gemini").split(/[,，]/).map(k => k.trim()).filter(k => k.length > 0); }

    // --- 新增逻辑：查找并点击 New Chat 按钮 ---
    function clickNewChatBtn() {
        // 策略 1: 查找包含 "New Chat" 文本的链接 (桌面端，对应图3)
        const allAnchors = Array.from(document.querySelectorAll('a'));
        const textLink = allAnchors.find(a => a.innerText.trim() === "New Chat");
        if (textLink) {
            textLink.click();
            return true;
        }

        // 策略 2: 查找特定的 CSS 类名 (桌面端图标，对应图2)
        // "peer/menu-button" 需要转义为 "peer\/menu-button"
        const iconLink = document.querySelector('a.peer\\/menu-button');
        if (iconLink) {
            iconLink.click();
            return true;
        }

        // 策略 3: 移动端保底 (图1)
        // 移动端通常是一个链接到根目录的图标。尝试查找非logo的根链接，
        // 或者尝试查找带有 inline-flex 等类的特定元素 (不够稳健，最好用 href)
        // 这里作为保底，如果没有找到文本和特定class，尝试找 href="/" 的链接
        const homeLink = document.querySelector('a[href="/"]');
        if (homeLink) {
            // 排除可能是左上角Logo的情况（如果有img通常是logo，但这里New Chat也是按钮）
            // 大多数情况下，点击href="/"的按钮在SPA中就是新建对话
            homeLink.click();
            return true;
        }

        return false;
    }

    // --- 交互逻辑 ---
    panel.addEventListener('click', (e) => { e.stopPropagation(); });

    // 设置面板切换
    btnCfg.addEventListener('click', (e) => {
        e.stopPropagation();
        isConfigOpen = !isConfigOpen;
        configBody.style.display = isConfigOpen ? 'flex' : 'none';
        btnCfg.classList.toggle('active', isConfigOpen);
        GM_setValue('gh_config_open', isConfigOpen);
    });

    // 监听
    chkExpand.addEventListener('change', (e) => { isAutoExpand = e.target.checked; GM_setValue('gh_auto_expand', isAutoExpand); if (lockedSide && isAutoExpand) triggerExpand(lockedSide); });
    chkHide.addEventListener('change', (e) => { isAutoHideOther = e.target.checked; GM_setValue('gh_auto_hide_other', isAutoHideOther); });
    chkSound.addEventListener('change', (e) => { isSoundEnabled = e.target.checked; GM_setValue('gh_sound_enabled', isSoundEnabled); });
    chkRemoveVote.addEventListener('change', (e) => { isRemoveVoteUI = e.target.checked; GM_setValue('gh_remove_vote_ui', isRemoveVoteUI); removeVotingBar(); });
    chkImage.addEventListener('change', (e) => { isImageInjectionEnabled = e.target.checked; GM_setValue('gh_inject_image', isImageInjectionEnabled); });
    inpPrompt.addEventListener('input', (e) => { GM_setValue('gh_custom_prompt', e.target.value); });
    inpKeywords.addEventListener('input', (e) => { GM_setValue('gh_custom_keywords', e.target.value); });

    // --- 音频/核心/查找 逻辑 ---
    let _audioCtx = null;
    function playTone(freq, type, startDelay, duration) {
        if (!isSoundEnabled && freq > 0) return;
        if (!_audioCtx) { const AudioContext = window.AudioContext || window.webkitAudioContext; if (AudioContext) _audioCtx = new AudioContext(); }
        if (!_audioCtx) return;
        if (_audioCtx.state === 'suspended') _audioCtx.resume();
        const osc = _audioCtx.createOscillator(); const gain = _audioCtx.createGain();
        osc.type = type; osc.frequency.value = freq; osc.connect(gain); gain.connect(_audioCtx.destination);
        const now = _audioCtx.currentTime + startDelay;
        osc.start(now); gain.gain.setValueAtTime(0.05, now); gain.gain.exponentialRampToValueAtTime(0.001, now + duration); osc.stop(now + duration);
    }
    function keepAliveAudio() { playTone(0, 'sine', 0, 0.01); }
    function playVictoryTheme() {
        const melody = [[523.25, 0, 0.1, 'square'], [659.25, 0.1, 0.1, 'square'], [783.99, 0.2, 0.1, 'square'], [1046.50, 0.3, 0.4, 'square'], [523.25, 0.4, 0.05, 'sawtooth'], [783.99, 0.45, 0.05, 'sawtooth'], [1046.50, 0.5, 0.05, 'sawtooth'], [523.25, 0.6, 0.6, 'triangle']];
        melody.forEach(n => playTone(n[0], n[3], n[1], n[2]));
    }
    function isLoadingIndicatorVisible() { return !!document.querySelector('canvas[data-sentry-component="Loading"]'); }

    function startTimer() {
        if (timerInterval) clearInterval(timerInterval);
        timerActive = true; const startTime = Date.now();
        timerDisplay.innerText = "0.00s"; timerDisplay.style.color = "#374151";
        let hasSeenLoading = false;
        timerInterval = setInterval(() => {
            const elapsed = (Date.now() - startTime) / 1000;
            timerDisplay.innerText = elapsed.toFixed(2) + "s";
            document.title = `[${Math.floor(elapsed)}s] 查找中...`;
            const isLoading = isLoadingIndicatorVisible();
            if (isLoading) hasSeenLoading = true;
            if (hasSeenLoading && !isLoading) { stopTimer(); if (isSoundEnabled && !isRunning) playVictoryTheme(); }
        }, 50);
    }
    function stopTimer() {
        if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
        timerActive = false; timerDisplay.style.color = "#10b981"; timerDisplay.style.transform = "scale(1.2)";
        setTimeout(() => { timerDisplay.style.transform = "scale(1)"; }, 200);
        document.title = originalTitle;
    }

    function setupGlobalListeners() {
        document.addEventListener('keydown', (e) => { if (e.target.tagName === 'TEXTAREA' && e.key === 'Enter' && !e.shiftKey) { setTimeout(() => { startTimer(); }, 50); } }, true);
        document.addEventListener('click', (e) => { const btn = e.target.closest('button'); if (btn) { const label = btn.getAttribute('aria-label') || "", testid = btn.getAttribute('data-testid') || "", type = btn.getAttribute('type') || ""; if (label.includes("Send") || testid.includes("send") || type === "submit") { startTimer(); } } }, true);
    }
    setupGlobalListeners();

    function toggleMinimizeUI(e) {
        isMinimized = !isMinimized;
        GM_setValue('gh_minimized_state_v1', isMinimized);
        if (isMinimized) {
            const pRect = panel.getBoundingClientRect();
            const isRightSide = (pRect.left + pRect.width / 2) > (window.innerWidth / 2);
            let newTop = Math.max(10, Math.min(window.innerHeight - 60, pRect.top));
            let newLeft = isRightSide ? pRect.right - 48 : pRect.left;
            ball.style.top = newTop + 'px'; ball.style.left = newLeft + 'px';
            panel.style.display = 'none'; ball.style.display = 'flex';
        } else {
            const bRect = ball.getBoundingClientRect();
            const isRightSide = (bRect.left + bRect.width / 2) > (window.innerWidth / 2);
            panel.style.opacity = '0'; panel.style.display = 'block';
            const pWidth = panel.offsetWidth; const pHeight = panel.offsetHeight;
            let newLeft = isRightSide ? bRect.right - pWidth : bRect.left;
            newLeft = Math.max(5, Math.min(window.innerWidth - pWidth - 5, newLeft));
            let newTop = Math.max(5, Math.min(window.innerHeight - pHeight - 5, bRect.top));
            panel.style.left = newLeft + 'px'; panel.style.top = newTop + 'px';
            requestAnimationFrame(() => { panel.style.opacity = '1'; panel.style.transform = 'scale(1)'; });
            ball.style.display = 'none';
        }
    }
    btnMin.addEventListener('click', (e) => { e.stopPropagation(); toggleMinimizeUI(); });
    btnMin.addEventListener('touchend', (e) => { e.stopPropagation(); e.preventDefault(); toggleMinimizeUI(); });
    ball.addEventListener('click', (e) => { if(!ball.isDragging) { e.stopPropagation(); toggleMinimizeUI(); } });
    ball.addEventListener('touchend', (e) => { if(!ball.isDragging) { e.stopPropagation(); toggleMinimizeUI(); } });

    function makeDraggable(el, handle = el) {
        let startX, startY, initialLeft, initialTop;
        const getPos = (e) => e.touches ? e.touches[0] : e;
        const onMove = (e) => {
            e.preventDefault(); const { clientX, clientY } = getPos(e); const dx = clientX - startX, dy = clientY - startY;
            if (Math.abs(dx) > 5 || Math.abs(dy) > 5) el.isDragging = true;
            el.style.left = Math.max(0, Math.min(window.innerWidth - el.offsetWidth, initialLeft + dx)) + 'px';
            el.style.top = Math.max(0, Math.min(window.innerHeight - el.offsetHeight, initialTop + dy)) + 'px';
        };
        const onEnd = () => {
            document.body.style.userSelect = ''; handle.style.cursor = 'move'; el.style.transition = 'transform 0.3s, opacity 0.2s';
            document.removeEventListener('mousemove', onMove); document.removeEventListener('touchmove', onMove);
            document.removeEventListener('mouseup', onEnd); document.removeEventListener('touchend', onEnd);
        };
        const onStart = (e) => {
            if (e.target.closest('.gh-win-ctrl') || e.target.tagName === 'INPUT') return;
            e.stopPropagation(); const { clientX, clientY } = getPos(e); startX = clientX; startY = clientY;
            const rect = el.getBoundingClientRect(); initialLeft = rect.left; initialTop = rect.top;
            el.isDragging = false; el.style.position = 'fixed'; el.style.transition = 'none';
            if (el.id === 'gh-ball') el.style.animation = 'none';
            document.body.style.userSelect = 'none'; handle.style.cursor = 'grabbing';
            document.addEventListener('mousemove', onMove); document.addEventListener('touchmove', onMove, { passive: false });
            document.addEventListener('mouseup', onEnd); document.addEventListener('touchend', onEnd);
        };
        handle.addEventListener('mousedown', onStart); handle.addEventListener('touchstart', onStart, { passive: false });
    }
    makeDraggable(panel, header); makeDraggable(ball);

    function updateStatus(msg, type = 'normal') {
        txtMsg.innerText = msg; dot.className = 'gh-dot';
        if (type === 'active') dot.classList.add('active'); else if (type === 'success') dot.classList.add('success'); else if (type === 'error') dot.classList.add('error');
    }
    function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
    async function pasteGeneratedImage(element) {
        try {
            const blob = await new Promise(resolve => { const canvas = document.createElement('canvas'); canvas.width = canvas.height = 1; canvas.getContext('2d').fillStyle = '#FFFFFF'; canvas.getContext('2d').fillRect(0, 0, 1, 1); canvas.toBlob(resolve, 'image/png'); });
            const dataTransfer = new DataTransfer(); dataTransfer.items.add(new File([blob], "gen.png", { type: "image/png" }));
            element.focus(); element.dispatchEvent(new ClipboardEvent('paste', { bubbles: true, cancelable: true, clipboardData: dataTransfer }));
            return true;
        } catch (e) { return false; }
    }
    async function clickImageButton() { const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText?.trim() === "Image"); if (btn) { btn.click(); return true; } return false; }
    async function fillTextOnly(element, text) {
        element.focus(); const valueSetter = Object.getOwnPropertyDescriptor(element, 'value')?.set; const prototype = Object.getPrototypeOf(element); const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;
        if (valueSetter && prototypeValueSetter && valueSetter !== prototypeValueSetter) prototypeValueSetter.call(element, text); else if (valueSetter) valueSetter.call(element, text); else element.value = text;
        element.dispatchEvent(new Event('input', { bubbles: true }));
    }
    async function clickSend() {
        startTimer(); const sendBtn = document.querySelector('button[data-testid="send-button"], button[aria-label="Send message"], button[type="submit"]');
        if (sendBtn && !sendBtn.disabled) { sendBtn.click(); return true; }
        const textarea = document.querySelector('textarea'); if (textarea) { textarea.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })); return true; } return false;
    }
    function removeVotingBar() {
        const targetDivs = document.querySelectorAll('.md\\:absolute.md\\:top-0.md\\:-translate-y-full');
        targetDivs.forEach(div => {
            const text = div.innerText;
            if (text.includes('Left is Better') || text.includes('A is better') || text.includes('tie') || text.includes('Both are bad')) {
                if (isRemoveVoteUI) { if (div.style.display !== 'none') div.style.display = 'none'; } else { if (div.style.display === 'none') div.style.display = ''; }
            }
        });
    }
    setInterval(removeVotingBar, 1000);

    function findTargetElement(text) {
        const xpath = `//*[normalize-space(text())='${text}']`; const snapshot = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let i = 0; i < snapshot.snapshotLength; i++) { const el = snapshot.snapshotItem(i); if (el.offsetParent !== null) return el; } return null;
    }
    function waitForResponse() {
        return new Promise(resolve => {
            if (checkLoopInterval) clearInterval(checkLoopInterval);
            const startTime = Date.now(); let seenLoading = false;
            checkLoopInterval = setInterval(() => {
                if (!isRunning) { clearInterval(checkLoopInterval); resolve("STOPPED"); return; }
                if (document.body.innerText.includes("Something went wrong") || document.body.innerText.includes("Failed to load")) { clearInterval(checkLoopInterval); resolve("ERROR"); }
                const hasLoading = isLoadingIndicatorVisible();
                if (hasLoading) seenLoading = true;
                if (seenLoading && !hasLoading) { clearInterval(checkLoopInterval); stopTimer(); resolve("FOUND"); return; }
                if ((Date.now() - startTime) > 10000 && !hasLoading) { const { A, B } = getModelResponses(); if (A.length > 10 && B.length > 10) { clearInterval(checkLoopInterval); stopTimer(); resolve("FOUND"); return; } }
            }, 100);
            setTimeout(() => { clearInterval(checkLoopInterval); resolve("TIMEOUT"); }, 120000);
        });
    }
    function getModelContainers() {
        const headerA = findTargetElement("Assistant A"); const headerB = findTargetElement("Assistant B");
        if (!headerA || !headerB) return { containerA: null, containerB: null };
        function findColumnWrapper(selfHeader, otherHeader) { let curr = selfHeader.parentElement; let bestContainer = null; for (let i = 0; i < 10 && curr && curr !== document.body; i++) { if (curr.contains(otherHeader)) break; bestContainer = curr; curr = curr.parentElement; } return bestContainer; }
        return { containerA: findColumnWrapper(headerA, headerB), containerB: findColumnWrapper(headerB, headerA) };
    }
    function getCurrentPrompt() { return inpPrompt.value || "你是谁"; }
    function getModelResponses() {
        const { containerA, containerB } = getModelContainers(); const bubbles = Array.from(document.querySelectorAll('.prose')); let lastBubbleA = "", lastBubbleB = ""; const currentPrompt = getCurrentPrompt();
        if (!containerA || !containerB) return { A: "", B: "" };
        bubbles.forEach(b => {
            const text = b.innerText; if (text.includes(currentPrompt) && text.length < (currentPrompt.length + 50)) return;
            if (text.includes("正在查找")) return;
            if (containerA.contains(b)) lastBubbleA = text; else if (containerB.contains(b)) lastBubbleB = text;
        });
        return { A: lastBubbleA || "", B: lastBubbleB || "" };
    }
    async function triggerExpand(side) {
        if (!side) return; if (side === 'BOTH') side = 'A';
        const headerEl = findTargetElement(side === 'A' ? "Assistant A" : "Assistant B");
        if (headerEl) { let parent = headerEl.parentElement; for(let i=0; i<5 && parent; i++) { const buttons = parent.querySelectorAll('button'); if (buttons.length >= 1) { buttons[buttons.length - 1].click(); return; } parent = parent.parentElement; } }
    }
    function startPersistentHighlight() {
        if (!lockedSide) return;
        updateStatus("锁定: " + (lockedSide==='BOTH'?'双侧':lockedSide), 'success'); updateBallText(lockedSide); document.title = `[${lockedSide}] 锁定成功 - GH`;
        if (highlightInterval) clearInterval(highlightInterval);
        let lastExpandCheck = 0; let lastBubbleCount = document.querySelectorAll('.prose').length; const currentPrompt = getCurrentPrompt();
        highlightInterval = setInterval(() => {
            const { containerA, containerB } = getModelContainers(); if (!containerA || !containerB) return;
            document.querySelectorAll('.prose').forEach(b => {
                const text = b.innerText; if (text.includes(currentPrompt) && text.length < 50) return;
                const isSideA = containerA.contains(b); const isSideB = containerB.contains(b); if (!isSideA && !isSideB) return;
                let isTarget = (lockedSide === 'BOTH') || (lockedSide === 'A' && isSideA) || (lockedSide === 'B' && isSideB);
                let container = b.closest('.bg-surface-primary') || b.closest('.border.rounded-xl') || b.closest('.border.rounded-lg') || b.closest('[data-testid="model-answer"]');
                if (!container && b.parentElement?.parentElement) container = b.parentElement.parentElement.parentElement;
                let targetEl = container || b;
                if (isTarget) { if (!targetEl.classList.contains('gh-winner-glow')) targetEl.classList.add('gh-winner-glow'); } else { if (targetEl.classList.contains('gh-winner-glow')) targetEl.classList.remove('gh-winner-glow'); }
                if (isAutoHideOther && lockedSide !== 'BOTH') { if ((lockedSide === 'A' && isSideB) || (lockedSide === 'B' && isSideA)) targetEl.classList.add('gh-hidden-bubble'); else targetEl.classList.remove('gh-hidden-bubble'); } else targetEl.classList.remove('gh-hidden-bubble');
            });
            const now = Date.now();
            if (isAutoExpand && (now - lastExpandCheck > 1000)) { lastExpandCheck = now; const currentCount = document.querySelectorAll('.prose').length; if (currentCount > lastBubbleCount) { lastBubbleCount = currentCount; setTimeout(() => triggerExpand(lockedSide), 500); } }
        }, 200);
    }

    async function runSequence() {
        if (sessionStorage.getItem('gh_isRunning') !== 'true') return;
        isRunning = true; sessionStorage.removeItem('gh_locked_side'); lockedSide = null;
        if (highlightInterval) clearInterval(highlightInterval);
        updateStatus("准备中...", 'normal');
        document.querySelectorAll('.gh-winner-glow').forEach(el => el.classList.remove('gh-winner-glow'));
        document.querySelectorAll('.gh-hidden-bubble').forEach(el => el.classList.remove('gh-hidden-bubble'));
        await sleep(1000);
        if (!isRunning) return;
        const textarea = document.querySelector('textarea, [contenteditable="true"]');
        if (!textarea) { updateStatus("输入框未就绪", 'error'); return; }
        if (isImageInjectionEnabled) { updateStatus("验证 (Gemini)...", 'active'); await pasteGeneratedImage(textarea); await sleep(2000); if (!isRunning) return; await clickImageButton(); await sleep(500); } else { updateStatus("跳过图片...", 'active'); await sleep(500); }
        const currentPrompt = inpPrompt.value || "你是谁";
        await fillTextOnly(textarea, currentPrompt);
        await sleep(300); await clickSend();
        updateStatus("等待回复...", 'active');
        const voteResult1 = await waitForResponse();
        if (voteResult1 === "STOPPED") return; if (voteResult1 !== "FOUND") return retry();
        updateStatus("判别中...", 'active'); await sleep(500);
        const resp1 = getModelResponses();
        const keywords = getActiveKeywords();
        const checkText = (text) => { if (!text) return false; return keywords.some(k => new RegExp(k, 'i').test(text)); };
        const isA = checkText(resp1.A); const isB = checkText(resp1.B);
        if (isA || isB) {
            lockedSide = (isA && isB) ? 'BOTH' : (isA ? 'A' : 'B');
            sessionStorage.setItem('gh_locked_side', lockedSide);
            const finalChatId = getChatId(); if (finalChatId) GM_setValue('gh_locked_side_' + finalChatId, lockedSide);
            updateBallText(lockedSide);
            const textareaDone = document.querySelector('textarea, [contenteditable="true"]'); if (textareaDone) await fillTextOnly(textareaDone, "");
            startPersistentHighlight();
            if(!isMinimized) toggleMinimizeUI();
            if (isSoundEnabled) { try { const u = new SpeechSynthesisUtterance(`锁定成功`); u.lang = 'zh-CN'; window.speechSynthesis.speak(u); } catch(e){} playVictoryTheme(); }
            GM_notification({ text: `成功锁定目标！位置：${lockedSide === 'BOTH' ? '双侧' : lockedSide + '侧'}`, title: 'Gemini Hunter', timeout: 5000 });
            sessionStorage.setItem('gh_isRunning', 'false'); isRunning = false; updateUIState(false);
        } else { updateStatus("未发现，重试...", 'error'); await sleep(1000); return retry(); }
    }

    function startHunt() {
        sessionStorage.removeItem('gh_locked_side'); lockedSide = null; keepAliveAudio();
        sessionStorage.setItem('gh_isRunning', 'true'); isRunning = true;
        attemptCount = 1; sessionStorage.setItem('gh_attempt_count', attemptCount);
        updateCountDisplay(); updateBallText(null); updateUIState(true);
        updateStatus("初始化...", 'active');

        // 逻辑更改：优先尝试点击按钮，如果成功则等待页面SPA跳转，否则回退到URL刷新
        setTimeout(async () => {
            if (clickNewChatBtn()) {
                // 如果点击成功，等待页面切换动画
                await sleep(1500);
                // 重新开始序列（因为SPA没有刷新页面，脚本状态未重置，需手动调用）
                runSequence();
            } else {
                // 找不到按钮，回退旧逻辑
                window.location.href = CONFIG.resetUrl;
            }
        }, 500);
    }

    function stopHunt() {
        sessionStorage.removeItem('gh_locked_side'); lockedSide = null;
        sessionStorage.setItem('gh_isRunning', 'false'); isRunning = false;
        if (timerInterval) clearInterval(timerInterval); if (highlightInterval) clearInterval(highlightInterval); if (checkLoopInterval) clearInterval(checkLoopInterval);
        timerActive = false; document.title = originalTitle;
        updateUIState(false); updateStatus("已停止", 'normal');
        document.querySelectorAll('.gh-winner-glow').forEach(el => el.classList.remove('gh-winner-glow'));
        document.querySelectorAll('.gh-hidden-bubble').forEach(el => el.classList.remove('gh-hidden-bubble'));
        updateBallText(null);
    }

    function retry() {
        if (sessionStorage.getItem('gh_isRunning') !== 'true' || !isRunning) { updateStatus("已停止", 'normal'); return; }
        attemptCount++; sessionStorage.setItem('gh_attempt_count', attemptCount);
        updateCountDisplay();

        // 逻辑更改：同 startHunt
        setTimeout(async () => {
            if (clickNewChatBtn()) {
                await sleep(1500);
                runSequence();
            } else {
                window.location.href = CONFIG.resetUrl;
            }
        }, 500);
    }

    function updateUIState(running) {
        if (running) { btnStart.style.display = 'none'; btnStop.style.display = 'flex'; ball.classList.add('running'); }
        else { btnStart.style.display = 'flex'; btnStop.style.display = 'none'; ball.classList.remove('running'); }
    }
    btnStart.addEventListener('click', startHunt); btnStart.addEventListener('touchend', (e) => { e.preventDefault(); startHunt(); });
    btnStop.addEventListener('click', stopHunt); btnStop.addEventListener('touchend', (e) => { e.preventDefault(); stopHunt(); });

    if (lockedSide) { if (!isMinimized) toggleMinimizeUI(); updateBallText(lockedSide); startPersistentHighlight(); }
    else { updateBallText(null); if (isMinimized) { panel.style.display = 'none'; ball.style.display = 'flex'; } else { panel.style.opacity = '0'; panel.style.transform = 'scale(0.9)'; setTimeout(() => { panel.style.opacity = '1'; panel.style.transform = 'scale(1)'; }, 100); } }

    const runState = sessionStorage.getItem('gh_isRunning');
    // 如果是页面刚刚加载（比如被旧逻辑刷新），且处于运行状态，则自动启动
    // 如果是点击按钮触发的SPA跳转，不会触发这里的 onload 逻辑，而是由 runSequence 递归处理
    if (isMobile && runState === null) startHunt();
    else if (isRunning && !lockedSide) { if (attemptCount === 0) attemptCount = 1; updateCountDisplay(); updateUIState(true); keepAliveAudio(); setTimeout(runSequence, 2500); }
})();