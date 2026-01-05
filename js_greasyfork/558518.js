// ==UserScript==
// @name         页面滚动神器 (手机/PC通用版)
// @namespace    https://github.com/xkzm123
// @version      1.3
// @description  自动滚动页面，支持亚像素级平滑滚动，非线性速度控制。旗舰版功能：1.自动记忆位置/速度/折叠状态；2.智能防冲突(用户操作自动暂停)；3.闲置自动透明。
// @author       xkzm
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558518/%E9%A1%B5%E9%9D%A2%E6%BB%9A%E5%8A%A8%E7%A5%9E%E5%99%A8%20%28%E6%89%8B%E6%9C%BAPC%E9%80%9A%E7%94%A8%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558518/%E9%A1%B5%E9%9D%A2%E6%BB%9A%E5%8A%A8%E7%A5%9E%E5%99%A8%20%28%E6%89%8B%E6%9C%BAPC%E9%80%9A%E7%94%A8%E7%89%88%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 防止重复加载
    if (window.suyinScrollLoaded) return;
    window.suyinScrollLoaded = true;

    // --- 核心状态 ---
    let state = {
        isScrolling: false,
        isPausedByUser: false, // 标记是否因用户操作而暂时暂停
        userInterventionTimer: null, // 用户操作计时器
        speed: 50,
        sliderValue: 22,
        lastTime: 0,
        pixelAccumulator: 0,
        isMinimized: false, // 是否最小化
        requestId: null,
        drag: { isDragging: false, startX: 0, startY: 0, initialLeft: 0, initialTop: 0, hasMoved: false },
        transparencyTimer: null // 透明度计时器
    };

    // --- 1. 记忆功能配置 (增强版：包含折叠状态) ---
    const CONFIG_KEY = 'suyin_scroll_config_v2'; // 升级Key避免旧数据冲突

    // 读取配置
    function loadConfig() {
        try {
            const raw = localStorage.getItem(CONFIG_KEY);
            if (!raw) return null;
            const config = JSON.parse(raw);

            // 简单的边界检查，防止悬浮窗跑出屏幕外
            const viewportW = window.innerWidth;
            const viewportH = window.innerHeight;

            if (config.left > viewportW - 50 || config.top > viewportH - 50 || config.left < -50 || config.top < -50) {
                return null;
            }
            return config;
        } catch (e) {
            console.error('读取滚动配置失败:', e);
            return null;
        }
    }

    // 保存配置 (包含 isMinimized)
    function saveConfig(host) {
        if (!host) host = document.getElementById('suyin-scroll-host');
        if (!host) return;

        const rect = host.getBoundingClientRect();
        const config = {
            top: rect.top,
            left: rect.left,
            sliderValue: state.sliderValue,
            isMinimized: state.isMinimized // 新增：保存折叠状态
        };
        localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
    }

    // --- 样式定义 ---
    const css = `
        :host {
            all: initial;
            font-family: system-ui, -apple-system, sans-serif;
            z-index: 2147483647;
            position: fixed;
            top: 100px;
            right: 20px;
        }
        #panel-container {
            width: 180px;
            background: rgba(20, 20, 20, 0.9);
            backdrop-filter: blur(8px);
            color: #fff;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.4);
            border: 1px solid rgba(255,255,255,0.15);
            /* 平滑过渡：宽度、高度、透明度 */
            transition: width 0.2s, height 0.2s, opacity 0.3s ease-in-out;
            user-select: none;
            -webkit-user-select: none;
            overflow: hidden;
            touch-action: none;
            opacity: 1;
        }
        /* 2. 自动透明模式样式 */
        #panel-container.idle-mode {
            opacity: 0.3;
        }
        /* 鼠标悬停或触摸时强制不透明 */
        #panel-container:hover, #panel-container:active {
            opacity: 1 !important;
        }

        /* 最小化样式 */
        #panel-container.minimized {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            cursor: move;
            background: rgba(76, 175, 80, 0.9);
        }
        #panel-container.minimized:active { transform: scale(0.95); }
        #panel-container.minimized .panel-content,
        #panel-container.minimized .panel-header { display: none; }
        #panel-container.minimized .minimized-icon { display: flex; }

        .panel-header {
            padding: 12px 15px;
            background: rgba(255,255,255,0.08);
            cursor: move;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .panel-title { font-size: 13px; font-weight: 600; color: #ddd; }
        .minimize-btn {
            cursor: pointer;
            width: 22px; height: 22px;
            line-height: 20px; text-align: center;
            border-radius: 4px;
            background: rgba(255,255,255,0.1);
            font-size: 16px; transition: 0.2s;
        }
        .minimize-btn:hover { background: #ff9800; color: #000; }

        .panel-content { padding: 15px; display: flex; flex-direction: column; gap: 12px; }

        .speed-control { display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #aaa; }
        .speed-val { font-family: 'Menlo', monospace; color: #4CAF50; font-weight: bold; font-size: 14px; }

        input[type=range] {
            width: 100%; height: 5px;
            background: rgba(255,255,255,0.2);
            border-radius: 3px; appearance: none; outline: none; cursor: pointer;
        }
        input[type=range]::-webkit-slider-thumb {
            appearance: none; width: 16px; height: 16px;
            border-radius: 50%; background: #4CAF50;
            box-shadow: 0 0 5px rgba(0,0,0,0.5);
            transition: transform 0.1s;
        }
        input[type=range]::-webkit-slider-thumb:hover { transform: scale(1.2); }

        button {
            width: 100%; padding: 10px 0; border: none; border-radius: 8px;
            background: #4CAF50; color: white; font-weight: bold; font-size: 14px;
            cursor: pointer; transition: background 0.2s;
        }
        button:hover { filter: brightness(1.1); }
        button.scrolling { background: #f44336; }

        .minimized-icon {
            display: none; width: 100%; height: 100%;
            align-items: center; justify-content: center;
            font-size: 24px; color: #fff;
        }
        .hint { font-size:10px; color:#666; text-align:center; margin-top:0px; }
    `;

    // --- 逻辑函数 ---
    function calculateSpeed(val) {
        const maxSpeed = 500;
        const percentage = val / 100;
        let rawSpeed = maxSpeed * Math.pow(percentage, 2.5);
        if (val > 0 && rawSpeed < 1) rawSpeed = 1;
        if (val === 0) rawSpeed = 0;
        return Math.floor(rawSpeed);
    }

    function animationLoop(timestamp) {
        if (!state.isScrolling) return;

        // --- 3. 智能防冲突逻辑 ---
        if (state.isPausedByUser) {
            state.lastTime = timestamp;
            state.requestId = requestAnimationFrame(animationLoop);
            return;
        }

        if (!state.lastTime) state.lastTime = timestamp;
        const deltaTime = timestamp - state.lastTime;
        state.lastTime = timestamp;

        state.pixelAccumulator += (state.speed * deltaTime) / 1000;
        const pixelsToScroll = Math.trunc(state.pixelAccumulator);

        if (pixelsToScroll !== 0) {
            window.scrollBy(0, pixelsToScroll);
            state.pixelAccumulator -= pixelsToScroll;
        }

        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 1) {
            toggleScrolling(false);
            return;
        }
        state.requestId = requestAnimationFrame(animationLoop);
    }

    function toggleScrolling(forceState, shadowRoot) {
        if (!shadowRoot) {
             const host = document.getElementById('suyin-scroll-host');
             if(host) shadowRoot = host.shadowRoot;
        }
        if (!shadowRoot) return;

        if (typeof forceState !== 'undefined') state.isScrolling = forceState;
        else state.isScrolling = !state.isScrolling;

        const btn = shadowRoot.getElementById('toggle-scroll-btn');
        if (btn) {
            if (state.isScrolling) {
                btn.textContent = '停止滚动';
                btn.classList.add('scrolling');
                state.lastTime = 0;
                state.pixelAccumulator = 0;
                state.isPausedByUser = false;
                state.requestId = requestAnimationFrame(animationLoop);
            } else {
                btn.textContent = '开始滚动';
                btn.classList.remove('scrolling');
                if (state.requestId) cancelAnimationFrame(state.requestId);
                state.requestId = null;
            }
        }
    }

    // --- 3. 智能防冲突：监听用户行为 ---
    function initSmartPause() {
        const handleUserInteraction = () => {
            if (!state.isScrolling) return;

            state.isPausedByUser = true;

            if (state.userInterventionTimer) {
                clearTimeout(state.userInterventionTimer);
            }

            state.userInterventionTimer = setTimeout(() => {
                state.isPausedByUser = false;
                state.lastTime = 0;
            }, 1000);
        };

        const opts = { passive: true };
        window.addEventListener('wheel', handleUserInteraction, opts);
        window.addEventListener('touchmove', handleUserInteraction, opts);
        window.addEventListener('keydown', (e) => {
            if(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Space'].includes(e.code)) {
                handleUserInteraction();
            }
        }, opts);
    }

    // --- UI 构建 ---
    function createUI() {
        const host = document.createElement('div');
        host.id = 'suyin-scroll-host';
        document.body.appendChild(host);

        // --- 1. 记忆功能：应用保存的配置 ---
        const savedConfig = loadConfig();
        if (savedConfig) {
            host.style.top = `${savedConfig.top}px`;
            host.style.left = `${savedConfig.left}px`;
            host.style.right = 'auto';
            state.sliderValue = savedConfig.sliderValue;
            state.isMinimized = !!savedConfig.isMinimized; // 恢复状态
        }

        const shadow = host.attachShadow({ mode: 'open' });

        const styleTag = document.createElement('style');
        styleTag.textContent = css;
        shadow.appendChild(styleTag);

        const container = document.createElement('div');
        container.id = 'panel-container';

        // 如果记忆了最小化状态，初始化时直接加上 class
        if (state.isMinimized) {
            container.classList.add('minimized');
        }

        state.speed = calculateSpeed(state.sliderValue);

        container.innerHTML = `
            <div class="minimized-icon">⬇</div>
            <div class="panel-header">
                <span class="panel-title">平滑滚动</span>
                <span class="minimize-btn" title="最小化">−</span>
            </div>
            <div class="panel-content">
                <div class="speed-control">
                    <span>速度</span>
                    <span class="speed-val">${state.speed} px/s</span>
                </div>
                <input type="range" id="speed-slider" min="0" max="100" value="${state.sliderValue}">
                <button id="toggle-scroll-btn">开始滚动</button>
                <div class="hint">Alt+Z 开始 / Alt+X 停止</div>
            </div>
        `;
        shadow.appendChild(container);

        const slider = shadow.getElementById('speed-slider');
        const speedDisplay = container.querySelector('.speed-val');
        const btn = shadow.getElementById('toggle-scroll-btn');
        const minBtn = container.querySelector('.minimize-btn');

        // --- 2. 自动透明功能逻辑 ---
        const wakeUpPanel = () => {
            container.classList.remove('idle-mode');
            if (state.transparencyTimer) clearTimeout(state.transparencyTimer);

            state.transparencyTimer = setTimeout(() => {
                if (!state.drag.isDragging) {
                    container.classList.add('idle-mode');
                }
            }, 3000);
        };

        container.addEventListener('mouseenter', wakeUpPanel);
        container.addEventListener('touchstart', wakeUpPanel);
        container.addEventListener('mousemove', wakeUpPanel);
        wakeUpPanel();


        slider.addEventListener('input', (e) => {
            state.sliderValue = parseInt(e.target.value);
            state.speed = calculateSpeed(state.sliderValue);
            speedDisplay.textContent = `${state.speed} px/s`;
            wakeUpPanel();
        });

        slider.addEventListener('change', () => {
             saveConfig(host);
        });

        slider.addEventListener('touchstart', (e) => { e.stopPropagation(); wakeUpPanel(); });
        slider.addEventListener('mousedown', (e) => { e.stopPropagation(); wakeUpPanel(); });

        btn.addEventListener('click', () => {
            toggleScrolling(undefined, shadow);
            wakeUpPanel();
        });

        // 最小化按钮逻辑 (新增：保存状态)
        minBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            state.isMinimized = true;
            container.classList.add('minimized');
            wakeUpPanel();
            saveConfig(host); // 保存最小化状态
        });

        initDrag(host, container);
        initSmartPause();

        document.addEventListener('keydown', (e) => {
            if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
            if (e.altKey && e.code === 'KeyZ') toggleScrolling(true, shadow);
            else if (e.altKey && e.code === 'KeyX') toggleScrolling(false, shadow);
        });
    }

    // --- 拖拽逻辑 ---
    function initDrag(host, container) {

        function getClientCoords(e) {
            if (e.touches && e.touches.length > 0) {
                return { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
            return { x: e.clientX, y: e.clientY };
        }

        function onStart(e) {
            container.classList.remove('idle-mode');
            if (state.transparencyTimer) clearTimeout(state.transparencyTimer);

            const target = e.target;
            const isControl = target.closest('input') || target.closest('button');
            const isHeader = target.closest('.panel-header');

            if (!state.isMinimized && !isHeader) return;
            if (isControl) return;

            state.drag.isDragging = true;
            state.drag.hasMoved = false;

            const coords = getClientCoords(e);
            state.drag.startX = coords.x;
            state.drag.startY = coords.y;

            const rect = host.getBoundingClientRect();
            state.drag.initialLeft = rect.left;
            state.drag.initialTop = rect.top;

            host.style.right = 'auto';
            host.style.left = `${rect.left}px`;
            host.style.top = `${rect.top}px`;
            container.style.transition = 'none';

            if(e.type === 'touchstart') {
            } else {
                e.preventDefault();
            }
        }

        function onMove(e) {
            if (!state.drag.isDragging) return;
            if (e.cancelable) e.preventDefault();

            const coords = getClientCoords(e);
            const dx = coords.x - state.drag.startX;
            const dy = coords.y - state.drag.startY;

            if (Math.abs(dx) > 2 || Math.abs(dy) > 2) state.drag.hasMoved = true;

            host.style.left = `${state.drag.initialLeft + dx}px`;
            host.style.top = `${state.drag.initialTop + dy}px`;
        }

        function onEnd() {
            if (state.drag.isDragging) {
                state.drag.isDragging = false;
                container.style.transition = 'width 0.2s, height 0.2s, opacity 0.3s ease-in-out';

                saveConfig(host); // 拖拽结束，保存位置

                if (state.transparencyTimer) clearTimeout(state.transparencyTimer);
                state.transparencyTimer = setTimeout(() => {
                    container.classList.add('idle-mode');
                }, 3000);
            }
        }

        container.addEventListener('mousedown', onStart);
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onEnd);

        container.addEventListener('touchstart', onStart, { passive: false });
        document.addEventListener('touchmove', onMove, { passive: false });
        document.addEventListener('touchend', onEnd);

        // PC 点击恢复 (新增：保存状态)
        container.addEventListener('click', (e) => {
            if (state.isMinimized && !state.drag.hasMoved) {
                state.isMinimized = false;
                container.classList.remove('minimized');
                container.classList.remove('idle-mode');
                saveConfig(host); // 保存展开状态
            }
        });

        // 手机 点击恢复 (新增：保存状态)
        container.addEventListener('touchend', (e) => {
            if (state.isMinimized && !state.drag.hasMoved && !state.drag.isDragging) {
                 state.isMinimized = false;
                 container.classList.remove('minimized');
                 container.classList.remove('idle-mode');
                 saveConfig(host); // 保存展开状态
            }
        });
    }

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', createUI);
    } else {
        createUI();
    }

})();