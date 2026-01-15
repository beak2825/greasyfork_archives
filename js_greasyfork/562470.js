// ==UserScript==
// @name         pokechill助手
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  游戏变速器 + 自动重开：按钮优化(1/5/200/500)、跳过时间、拖拽修复
// @author       黄黄
// @match        https://play-pokechill.github.io/*
// @match        https://g1tyx.github.io/play-pokechill/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/562470/pokechill%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/562470/pokechill%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================= 1. 配置区域 =================
    const CONFIG = {
        MIN_SPEED: 0.1,
        MAX_SPEED: 500.0,
        DEFAULT_SPEED: 1.0,
        STEP_SIZE: 0.5,
        UI_ZINDEX: 2147483647
    };

    const STORAGE = {
        enabled: 'msg_autoRejoinEnabled',
        count: 'msg_autoRejoinCount'
    };

    // ================= 2. 核心状态 =================
    const state = {
        speed: CONFIG.DEFAULT_SPEED,
        isActive: false,
        isMuted: false,
        autoRejoin: {
            enabled: localStorage.getItem(STORAGE.enabled) === '1',
            count: parseInt(localStorage.getItem(STORAGE.count) || '0', 10),
            clickedThisCycle: false,
            lastVisible: false
        },
        startTime: {
            real: 0,
            virtual: 0
        },
        originals: {
            raf: null,
            date: null,
            dateNow: null,
            perfNow: null,
            setTimeout: null,
            setInterval: null
        },
        ui: null
    };

    // ================= 3. 核心时间算法 =================

    function getVirtualTime(realTimeNow) {
        if (!state.isActive) return realTimeNow;
        const realDelta = realTimeNow - state.startTime.real;
        return state.startTime.virtual + (realDelta * state.speed);
    }

    function getRealNow() {
        if (state.originals.perfNow) {
            return state.originals.perfNow.call(window.performance);
        }
        return state.originals.dateNow.call(state.originals.date);
    }

    function updateTimeAnchor() {
        const realNow = getRealNow();
        const currentVirtual = state.isActive ? getVirtualTime(realNow) : realNow;
        state.startTime.real = realNow;
        state.startTime.virtual = currentVirtual;
        state.isActive = true;
    }

    function skipTime(hours) {
        updateTimeAnchor();
        const msToAdd = hours * 60 * 60 * 1000;
        state.startTime.virtual += msToAdd;

        const label = hours < 1 ? `${hours * 60}分钟` : `${hours}小时`;
        console.log(`[Pokechill助手] ⏳ 已跳过 ${label}`);

        const btnId = hours === 1.5 ? 'msg-skip-90m' : 'msg-skip-12h';
        const btn = document.getElementById(btnId);
        if(btn) {
            const originalColor = btn.style.background;
            btn.style.background = "#27ae60";
            setTimeout(() => { if(btn) btn.style.background = originalColor; }, 500);
        }
    }

    // ================= 4. 自动重开逻辑 =================

    function isActuallyVisible(el) {
        return !!(el && el.offsetParent !== null && el.getClientRects().length > 0);
    }

    function checkAutoRejoin() {
        if (!state.autoRejoin.enabled) return;

        const btn = document.getElementById('area-rejoin');
        if (!btn) return;

        const visible = isActuallyVisible(btn);

        if (!visible && state.autoRejoin.lastVisible) {
            state.autoRejoin.clickedThisCycle = false;
        }

        if (visible && !state.autoRejoin.lastVisible && !state.autoRejoin.clickedThisCycle) {
            state.autoRejoin.clickedThisCycle = true;
            btn.click();
            state.autoRejoin.count++;
            localStorage.setItem(STORAGE.count, state.autoRejoin.count);
            updateUI();
            console.log(`[Pokechill助手] 自动重开触发 (总次数: ${state.autoRejoin.count})`);
        }
        state.autoRejoin.lastVisible = visible;
    }

    function toggleAutoRejoin() {
        state.autoRejoin.enabled = !state.autoRejoin.enabled;
        localStorage.setItem(STORAGE.enabled, state.autoRejoin.enabled ? '1' : '0');
        if (!state.autoRejoin.enabled) {
            state.autoRejoin.count = 0;
            localStorage.setItem(STORAGE.count, '0');
            state.autoRejoin.clickedThisCycle = false;
            state.autoRejoin.lastVisible = false;
        }
        updateUI();
    }

    // ================= 5. 函数劫持 (Hooks) =================

    function saveOriginals() {
        if (state.originals.date) return;
        const rafName = window.requestAnimationFrame ? 'requestAnimationFrame' :
                        window.webkitRequestAnimationFrame ? 'webkitRequestAnimationFrame' : null;
        if (rafName) state.originals.raf = window[rafName];
        state.originals.date = window.Date;
        state.originals.dateNow = Date.now;
        if (window.performance && window.performance.now) {
            state.originals.perfNow = window.performance.now;
        }
        state.originals.setTimeout = window.setTimeout;
        state.originals.setInterval = window.setInterval;
    }

    function hijackRAF() {
        if (!state.originals.raf) return;
        const rafPolyfill = (callback) => {
            return state.originals.raf.call(window, (realTimestamp) => {
                const virtualTimestamp = state.isActive ? getVirtualTime(realTimestamp) : realTimestamp;
                callback(virtualTimestamp);
            });
        };
        if (window.requestAnimationFrame) window.requestAnimationFrame = rafPolyfill;
        if (window.webkitRequestAnimationFrame) window.webkitRequestAnimationFrame = rafPolyfill;
    }

    function hijackPerformance() {
        if (!state.originals.perfNow) return;
        window.performance.now = () => {
            const realNow = state.originals.perfNow.call(window.performance);
            return state.isActive ? getVirtualTime(realNow) : realNow;
        };
    }

    function hijackDate() {
        const OriginalDate = state.originals.date;
        const MockDate = function(...args) {
            if (args.length === 0 && state.isActive) {
                const realNow = state.originals.dateNow.call(OriginalDate);
                const offset = getVirtualTime(getRealNow()) - getRealNow();
                return new OriginalDate(realNow + offset);
            }
            return new OriginalDate(...args);
        };
        MockDate.prototype = OriginalDate.prototype;
        MockDate.UTC = OriginalDate.UTC;
        MockDate.parse = OriginalDate.parse;
        MockDate.now = () => {
            const realNow = state.originals.dateNow.call(OriginalDate);
            if (!state.isActive) return realNow;
            const offset = getVirtualTime(getRealNow()) - getRealNow();
            return realNow + offset;
        };
        window.Date = MockDate;
    }

    function hijackTimers() {
        window.setTimeout = (cb, delay, ...args) => {
            const scaledDelay = state.isActive ? (delay / state.speed) : delay;
            return state.originals.setTimeout.call(window, cb, scaledDelay, ...args);
        };
        window.setInterval = (cb, delay, ...args) => {
            const scaledDelay = state.isActive ? (delay / state.speed) : delay;
            return state.originals.setInterval.call(window, cb, scaledDelay, ...args);
        };
    }

    // ================= 6. 控制逻辑 =================

    function setSpeed(targetSpeed) {
        targetSpeed = Math.max(CONFIG.MIN_SPEED, Math.min(CONFIG.MAX_SPEED, targetSpeed));
        if (state.speed === targetSpeed && state.isActive) return;
        updateTimeAnchor();
        state.speed = targetSpeed;
        updateUI();
    }

    function toggleMute() {
        state.isMuted = !state.isMuted;
        document.querySelectorAll('audio, video').forEach(el => el.muted = state.isMuted);
        updateUI();
    }

    // ================= 7. UI 界面 =================

    function createUI() {
        if (state.ui) return;

        const ui = document.createElement('div');
        ui.id = 'pokechill-helper-ui';
        ui.style.cssText = `
            position: fixed; top: 50px; right: 50px; width: 230px;
            background: rgba(16, 20, 25, 0.95); color: #fff;
            padding: 12px; border-radius: 8px;
            font-family: 'Segoe UI', Arial, sans-serif; font-size: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.6);
            z-index: ${CONFIG.UI_ZINDEX}; backdrop-filter: blur(5px);
            user-select: none; border: 1px solid rgba(255,255,255,0.1);
        `;

        // 标题这里改成了 "Pokechill助手"
        ui.innerHTML = `
            <div style="display:flex; justify-content:space-between; margin-bottom:10px; align-items:center;">
                <span style="font-weight:bold; color:#f1c40f; font-size:14px;">⚡ Pokechill助手</span>
                <span id="msg-display" style="font-family:monospace; font-size:14px; color:#fff;">1.00x</span>
            </div>

            <input type="range" id="msg-slider" min="${CONFIG.MIN_SPEED * 10}" max="${CONFIG.MAX_SPEED * 10}" value="10"
                style="width:100%; margin-bottom:12px; cursor:pointer; height:6px;">

            <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap: 5px; margin-bottom: 8px;">
                <button data-speed="1.0">1x</button>
                <button data-speed="5.0">5x</button>
                <button data-speed="200.0">200x</button>
                <button data-speed="500.0">500x</button>
            </div>

            <button id="msg-auto-btn" style="width:100%; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center; padding:6px 10px;">
                <span>🔄 自动重开</span>
                <span id="msg-auto-status" style="font-weight:bold;">OFF</span>
            </button>

            <div style="display:flex; gap: 5px; margin-bottom: 8px;">
                 <button id="msg-skip-90m" style="flex:1; background:#8e44ad;">⏱️ 90m</button>
                 <button id="msg-skip-12h" style="flex:1; background:#9b59b6;">🌙 12h</button>
            </div>

            <div style="display:flex; gap: 5px;">
                <button id="msg-reset" style="flex:1; background:#d35400;">重置</button>
                <button id="msg-mute" style="flex:1; background:#2980b9;">静音</button>
            </div>

            <div style="margin-top:8px; color:#666; font-size:10px; text-align:center;">
                By 黄黄 | Ctrl+Shift+箭头
            </div>
        `;

        const style = document.createElement('style');
        style.textContent = `
            #pokechill-helper-ui button {
                background: #34495e; color: white; border: none; padding: 6px;
                border-radius: 4px; cursor: pointer; transition: 0.1s; font-size:11px;
            }
            #pokechill-helper-ui button:hover { opacity: 0.9; filter: brightness(1.1); }
            #pokechill-helper-ui button:active { transform: translateY(1px); }
            #pokechill-helper-ui input[type=range] { accent-color: #f1c40f; }
        `;
        document.head.appendChild(style);
        document.body.appendChild(ui);
        state.ui = ui;

        // 事件绑定
        const slider = ui.querySelector('#msg-slider');
        slider.oninput = (e) => setSpeed(parseFloat(e.target.value) / 10);

        ui.querySelectorAll('button[data-speed]').forEach(btn => {
            btn.onclick = () => setSpeed(parseFloat(btn.getAttribute('data-speed')));
        });

        ui.querySelector('#msg-reset').onclick = () => { setSpeed(1.0); slider.value = 10; };
        ui.querySelector('#msg-mute').onclick = toggleMute;
        ui.querySelector('#msg-skip-90m').onclick = () => skipTime(1.5);
        ui.querySelector('#msg-skip-12h').onclick = () => skipTime(12);
        ui.querySelector('#msg-auto-btn').onclick = toggleAutoRejoin;

        // ================= 修复拖拽逻辑 =================
        let isDragging = false;
        let startX, startY, initLeft, initTop;

        const onMouseMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            ui.style.left = (initLeft + (e.clientX - startX)) + 'px';
            ui.style.top = (initTop + (e.clientY - startY)) + 'px';
        };

        const onMouseUp = () => {
            if (isDragging) {
                isDragging = false;
                ui.style.cursor = 'default';
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }
        };

        ui.addEventListener('mousedown', (e) => {
            if (['BUTTON', 'INPUT', 'SPAN'].includes(e.target.tagName)) return;

            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            initLeft = ui.offsetLeft;
            initTop = ui.offsetTop;
            ui.style.cursor = 'grabbing';

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        updateUI();
    }

    function updateUI() {
        if (!state.ui) return;
        state.ui.querySelector('#msg-display').textContent = state.speed.toFixed(2) + 'x';
        const slider = state.ui.querySelector('#msg-slider');
        if (document.activeElement !== slider) {
            slider.value = state.speed * 10;
        }

        const muteBtn = state.ui.querySelector('#msg-mute');
        muteBtn.textContent = state.isMuted ? '已静音' : '静音';
        muteBtn.style.background = state.isMuted ? '#c0392b' : '#2980b9';

        const autoBtn = state.ui.querySelector('#msg-auto-btn');
        const autoStatus = state.ui.querySelector('#msg-auto-status');
        if (state.autoRejoin.enabled) {
            autoBtn.style.background = '#2ecc71';
            autoStatus.textContent = `ON (${state.autoRejoin.count})`;
        } else {
            autoBtn.style.background = '#34495e';
            autoStatus.textContent = 'OFF';
        }
    }

    function setupHotkeys() {
        document.addEventListener('keydown', (e) => {
            if (!e.ctrlKey || !e.shiftKey) return;
            const key = e.key.toLowerCase();
            if (['arrowup', 'arrowdown', 'h', 'r'].includes(key)) e.preventDefault();

            if (e.key === 'ArrowUp') setSpeed(state.speed + CONFIG.STEP_SIZE);
            if (e.key === 'ArrowDown') setSpeed(state.speed - CONFIG.STEP_SIZE);
            if (key === 'r') { setSpeed(1.0); if(state.ui) state.ui.querySelector('#msg-slider').value = 10; }
            if (key === 'h') state.ui.style.display = state.ui.style.display === 'none' ? 'block' : 'none';
        });
    }

    function init() {
        saveOriginals();
        hijackRAF();
        hijackPerformance();
        hijackDate();
        hijackTimers();
        createUI();
        setupHotkeys();
        setSpeed(1.0);

        const observer = new MutationObserver(checkAutoRejoin);
        observer.observe(document.body, { childList: true, subtree: true, attributes: true });

        console.log('Pokechill助手 已加载');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.MSG = { set: setSpeed, skip: skipTime, reset: () => setSpeed(1.0) };
})();