// ==UserScript==
// @name         360视觉云 - 显式控制面板 (V24.0 监控增强版)
// @namespace    http://tampermonkey.net/
// @version      24.0
// @description  [新增]悬浮球实时显示时间戳；[新增]视频卡死红色预警；[优化]滚轮缩放与中键平移；[修复]全屏黑屏布局。
// @author       Assistant
// @match        *://*.360.cn/*
// @match        *://*.360.com/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/558711/360%E8%A7%86%E8%A7%89%E4%BA%91%20-%20%E6%98%BE%E5%BC%8F%E6%8E%A7%E5%88%B6%E9%9D%A2%E6%9D%BF%20%28V240%20%E7%9B%91%E6%8E%A7%E5%A2%9E%E5%BC%BA%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558711/360%E8%A7%86%E8%A7%89%E4%BA%91%20-%20%E6%98%BE%E5%BC%8F%E6%8E%A7%E5%88%B6%E9%9D%A2%E6%9D%BF%20%28V240%20%E7%9B%91%E6%8E%A7%E5%A2%9E%E5%BC%BA%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const BUTTON_KEYWORDS = ["继续播放", "继续观看", "恢复播放"];
    const PANEL_ID = "my-360-control-panel";
    const HIDE_CLASS = "tm-force-hide-element";
    const ZOOM_STEP = 0.15;

    let isUserHiddenMode = false;
    let isWebFullscreen = false;
    let autoHideTimer = null;
    let isPanelHovered = false;
    let hasMoved = false; 

    // 监控状态
    let lastTimestamp = "";
    let freezeCounter = 0;

    // 变换状态
    let transformState = {
        el: null, 
        scale: 1,
        tx: 0,
        ty: 0,
        rotate: 0
    };

    let isPanning = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    // === CSS 样式注入 ===
    const css = `
        .${HIDE_CLASS} { display: none !important; }

        #${PANEL_ID} {
            position: fixed; top: 160px; left: calc(100% - 250px);
            width: 230px; background: #2c3e50; color: #ecf0f1;
            z-index: 2147483647 !important; border-radius: 6px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.8); font-family: "Microsoft YaHei", sans-serif;
            font-size: 12px; transition: opacity 0.2s, border-radius 0.2s, border-color 0.3s; 
            border: 1px solid #34495e; overflow: visible;
        }
        
        /* 最小化状态（悬浮球） */
        #${PANEL_ID}.minimized { width: 54px; height: 54px; border-radius: 50%; cursor: pointer; border: 3px solid #27ae60; background: #2c3e50; overflow: hidden; }
        #${PANEL_ID}.minimized.frozen { border-color: #e74c3c !important; box-shadow: 0 0 10px #e74c3c; }
        
        /* 悬浮球内的图标和时间 */
        #${PANEL_ID}.minimized::after { content: "🛡️"; font-size: 18px; line-height: 32px; text-align: center; width: 100%; display: block; pointer-events: none; }
        #${PANEL_ID} .time-badge { display: none; }
        #${PANEL_ID}.minimized .time-badge { 
            display: block; position: absolute; bottom: 4px; width: 100%; 
            text-align: center; font-size: 10px; font-weight: bold; color: #2ecc71; 
            pointer-events: none; font-family: monospace;
        }
        #${PANEL_ID}.minimized.frozen .time-badge { color: #e74c3c; }

        #${PANEL_ID} .panel-header { padding: 10px; background: #34495e; cursor: move; display: flex; justify-content: space-between; align-items: center; height: 40px; box-sizing: border-box; }
        #${PANEL_ID}.minimized .header-text, 
        #${PANEL_ID}.minimized .toggle-btn, 
        #${PANEL_ID}.minimized .panel-content { display: none !important; }
        
        #${PANEL_ID} .panel-content { padding: 10px; display: flex; flex-direction: column; gap: 8px; }
        .action-btn { background-color: #e67e22; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 5px; }
        .action-btn:hover { background-color: #d35400; }
        .fullscreen-btn { background-color: #3498db; }
        .log-box { height: 80px; background: #1a252f; border: 1px solid #34495e; overflow-y: auto; padding: 6px; color: #bdc3c7; font-size: 11px; }

        /* === 网页全屏及选中格修复 === */
        body.tm-web-fullscreen { overflow: hidden !important; background: #000 !important; }
        body.tm-web-fullscreen .navbar, body.tm-web-fullscreen .sidebar-logo-container, body.tm-web-fullscreen .device-list-container, body.tm-web-fullscreen .monitor-top, body.tm-web-fullscreen .g-sdk { display: none !important; }

        body.tm-web-fullscreen .monitor-grid-item.tm-video-selected {
            position: fixed !important; top: 0 !important; left: 0 !important;
            width: 100vw !important; height: 100vh !important;
            z-index: 2147483640 !important; background: #000 !important;
            display: flex !important; justify-content: center !important; align-items: center !important;
        }

        body.tm-web-fullscreen .tm-video-selected video {
            width: 100% !important; height: 100% !important;
            object-fit: contain !important; background: #000 !important;
            transform-origin: center center;
        }

        .tm-grabbing, .tm-grabbing * { cursor: grabbing !important; }
        .monitor-grid-item.tm-video-selected { outline: 3px solid #3498db !important; }
    `;

    const style = document.createElement('style');
    style.innerHTML = css;
    document.head.appendChild(style);

    function init() {
        createPanel();
        setupGlobalEvents();
        setInterval(checkAndClick, 2000);
        setInterval(updateTimestampInUI, 1000); // 每秒更新时间戳
        log("脚本 V24.0 已就绪", "#2ecc71");
    }

    // === 创建面板 ===
    function createPanel() {
        if (document.getElementById(PANEL_ID)) return;
        const panel = document.createElement('div');
        panel.id = PANEL_ID;
        panel.innerHTML = `
            <div class="time-badge" id="${PANEL_ID}-ball-time">00:00</div>
            <div class="panel-header"><span class="header-text">360交互控制 V24</span><span class="toggle-btn" title="点击收起">➖</span></div>
            <div class="panel-content">
                <button id="${PANEL_ID}-toggle-fullscreen" class="action-btn fullscreen-btn">📺 开启沉浸全屏</button>
                <button id="${PANEL_ID}-rotate" class="action-btn">🔄 画面旋转</button>
                <button id="${PANEL_ID}-toggle-all" class="action-btn">👁️ 隐藏干扰项</button>
                <div style="font-size:10px; color:#95a5a6; border-top:1px solid #444; padding-top:4px; line-height:1.4">
                    提示：全屏选中视频后<br>
                    - <b>滚轮</b> 缩放<br>
                    - <b>中键</b> 拖拽画布<br>
                    - <b>Alt + R</b> 恢复初始
                </div>
                <div class="log-box" id="${PANEL_ID}-log"></div>
            </div>
        `;
        document.body.appendChild(panel);

        const header = panel.querySelector('.panel-header');
        setupDraggable(panel, header);

        panel.addEventListener('click', (e) => {
            if (hasMoved) return;
            if (panel.classList.contains('minimized')) {
                ensureVisibleOnScreen(panel);
                panel.classList.remove('minimized');
                resetAutoHideTimer();
            }
        });

        panel.querySelector('.toggle-btn').onclick = (e) => {
            e.stopPropagation();
            panel.classList.add('minimized');
        };

        document.getElementById(`${PANEL_ID}-toggle-fullscreen`).onclick = toggleWebFullscreen;
        document.getElementById(`${PANEL_ID}-rotate`).onclick = rotateVideo;
        document.getElementById(`${PANEL_ID}-toggle-all`).onclick = () => toggleUserHiddenMode();

        panel.onmouseenter = () => { isPanelHovered = true; if(autoHideTimer) clearTimeout(autoHideTimer); };
        panel.onmouseleave = () => { isPanelHovered = false; resetAutoHideTimer(); };
        resetAutoHideTimer();
    }

    // === 核心功能：提取时间戳并检测卡死 ===
    function updateTimestampInUI() {
        const panel = document.getElementById(PANEL_ID);
        const ballTime = document.getElementById(`${PANEL_ID}-ball-time`);
        if (!panel) return;

        // 从选中的视频或者第一个视频中寻找 xgplayer 的当前时间标签
        const targetContainer = transformState.el || document.querySelector('.monitor-grid-item');
        const timeEl = targetContainer ? targetContainer.querySelector('.xgplayer-time-current') : null;
        
        if (timeEl) {
            const currentTime = timeEl.innerText;
            ballTime.innerText = currentTime;

            // 检测时间戳是否停滞
            if (currentTime === lastTimestamp && currentTime !== "00:00") {
                freezeCounter++;
            } else {
                freezeCounter = 0;
                panel.classList.remove('frozen');
            }

            // 停滞超过5秒显红
            if (freezeCounter >= 5) {
                panel.classList.add('frozen');
            }
            lastTimestamp = currentTime;
        } else {
            ballTime.innerText = "--:--";
            panel.classList.remove('frozen');
        }
    }

    // === 交互逻辑 ===
    function setupGlobalEvents() {
        window.addEventListener('keydown', (e) => {
            if (e.altKey && e.key.toLowerCase() === 'r') { resetTransform(); log("重置成功", "#2ecc71"); }
            if (e.ctrlKey) {
                if (e.key === ']') { e.preventDefault(); changeZoom(ZOOM_STEP); }
                if (e.key === '[') { e.preventDefault(); changeZoom(-ZOOM_STEP); }
            }
        });

        window.addEventListener('wheel', (e) => {
            if (isWebFullscreen && transformState.el) {
                e.preventDefault();
                const delta = e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP;
                changeZoom(delta);
            }
        }, { passive: false });

        document.addEventListener('mousedown', (e) => {
            if (e.target.closest(`#${PANEL_ID}`)) return;
            const item = e.target.closest('.monitor-grid-item');
            if (!item) return;

            if (e.button === 0) { // 左键选中
                if (transformState.el) transformState.el.classList.remove('tm-video-selected');
                transformState.el = item;
                transformState.el.classList.add('tm-video-selected');
                
                const v = item.querySelector('video');
                if (v) {
                    transformState.scale = parseFloat(v.getAttribute('data-scale') || "1");
                    transformState.tx = parseFloat(v.getAttribute('data-tx') || "0");
                    transformState.ty = parseFloat(v.getAttribute('data-ty') || "0");
                    transformState.rotate = parseInt(v.getAttribute('data-rotate') || "0");
                }
            }

            if (e.button === 1) { // 中键拖拽
                if (isWebFullscreen && transformState.el) {
                    isPanning = true;
                    lastMouseX = e.clientX;
                    lastMouseY = e.clientY;
                    document.body.classList.add('tm-grabbing');
                    e.preventDefault();
                    e.stopImmediatePropagation();
                }
            }
        }, true);

        document.addEventListener('mousemove', (e) => {
            if (!isPanning || !transformState.el) return;
            const dx = e.clientX - lastMouseX;
            const dy = e.clientY - lastMouseY;
            transformState.tx += dx;
            transformState.ty += dy;
            applyTransform(true);
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
            e.stopImmediatePropagation();
        }, true);

        document.addEventListener('mouseup', (e) => {
            if (isPanning) {
                isPanning = false;
                document.body.classList.remove('tm-grabbing');
                e.stopImmediatePropagation();
            }
        }, true);
    }

    function applyTransform(fast = false) {
        if (!transformState.el) return;
        const video = transformState.el.querySelector('video');
        if (!video) return;
        video.setAttribute('data-scale', transformState.scale);
        video.setAttribute('data-tx', transformState.tx);
        video.setAttribute('data-ty', transformState.ty);
        video.setAttribute('data-rotate', transformState.rotate);
        video.style.transition = fast ? "none" : "transform 0.2s ease-out";
        video.style.transform = `translate(${transformState.tx}px, ${transformState.ty}px) scale(${transformState.scale}) rotate(${transformState.rotate}deg)`;
    }

    function changeZoom(delta) {
        if (!transformState.el) return;
        transformState.scale = Math.max(0.1, transformState.scale + delta);
        applyTransform();
    }

    function rotateVideo() {
        if (!transformState.el) return log("未选中视频", "#e74c3c");
        transformState.rotate = (transformState.rotate + 90) % 360;
        applyTransform();
        log(`旋转: ${transformState.rotate}°`);
    }

    function resetTransform() {
        if (!transformState.el) return;
        transformState.scale = 1; transformState.tx = 0; transformState.ty = 0; transformState.rotate = 0;
        applyTransform();
    }

    function toggleWebFullscreen() {
        isWebFullscreen = !isWebFullscreen;
        const btn = document.getElementById(`${PANEL_ID}-toggle-fullscreen`);
        if (isWebFullscreen) {
            document.body.classList.add('tm-web-fullscreen');
            btn.innerText = "❌ 退出全屏模式";
            if (!isUserHiddenMode) toggleUserHiddenMode(true);
            log("沉浸全屏已开启", "#3498db");
        } else {
            document.body.classList.remove('tm-web-fullscreen');
            btn.innerText = "📺 开启沉浸全屏";
            resetTransform();
            log("已退出全屏");
        }
        setTimeout(() => window.dispatchEvent(new Event('resize')), 500);
    }

    function toggleUserHiddenMode(force) {
        isUserHiddenMode = (typeof force === 'boolean') ? force : !isUserHiddenMode;
        document.querySelectorAll('.rotatebox, div[class*="controlsBot"]').forEach(el => {
            isUserHiddenMode ? el.classList.add(HIDE_CLASS) : el.classList.remove(HIDE_CLASS);
        });
    }

    function checkAndClick() {
        const popup = document.querySelector('.offlinebox.playcountdown');
        if (popup && popup.style.display !== 'none' && popup.offsetParent !== null) {
            const btn = popup.querySelector('button');
            if (btn && BUTTON_KEYWORDS.includes(btn.innerText.trim())) {
                btn.click();
                log("检测到中断，已自动恢复", "#e74c3c");
                toggleUserHiddenMode(true);
                setTimeout(() => toggleUserHiddenMode(isUserHiddenMode), 1000);
            }
        }
    }

    function setupDraggable(element, handle) {
        let sx, sy, il, it;
        element.onmousedown = function(e) {
            if (!element.classList.contains('minimized') && !e.target.closest('.panel-header')) return;
            if (e.target.classList.contains('toggle-btn')) return;
            sx = e.clientX; sy = e.clientY;
            const r = element.getBoundingClientRect();
            il = r.left; it = r.top;
            hasMoved = false;
            document.onmousemove = function(e) {
                const dx = e.clientX - sx; const dy = e.clientY - sy;
                if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
                    hasMoved = true;
                    element.style.left = (il + dx) + 'px';
                    element.style.top = (it + dy) + 'px';
                    element.style.right = 'auto';
                }
            };
            document.onmouseup = function() {
                document.onmousemove = null; document.onmouseup = null;
                if (!isPanelHovered) resetAutoHideTimer();
                ensureVisibleOnScreen(element);
            };
        };
    }

    function ensureVisibleOnScreen(panel) {
        const winW = window.innerWidth;
        const rect = panel.getBoundingClientRect();
        if (rect.left + 230 > winW) panel.style.left = (winW - 240) + 'px';
        if (rect.top < 0) panel.style.top = '10px';
    }

    function resetAutoHideTimer() {
        const panel = document.getElementById(PANEL_ID);
        if (autoHideTimer) clearTimeout(autoHideTimer);
        if (!isPanelHovered && panel && !panel.classList.contains('minimized')) {
            autoHideTimer = setTimeout(() => panel.classList.add('minimized'), 10000);
        }
    }

    function log(msg, color="#bdc3c7") {
        const lb = document.getElementById(`${PANEL_ID}-log`);
        if (!lb) return;
        const div = document.createElement('div');
        div.innerHTML = `<span style="color:#7f8c8d">[${new Date().toLocaleTimeString('zh-CN',{hour12:false})}]</span> <span style="color:${color}">${msg}</span>`;
        lb.insertBefore(div, lb.firstChild);
        if (lb.children.length > 30) lb.lastChild.remove();
    }

    setTimeout(init, 1500);
})();
