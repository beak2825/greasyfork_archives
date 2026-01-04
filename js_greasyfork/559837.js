// ==UserScript==
// @name         n8n触控笔悬浮球(兼容RDP)：V1.0
// @namespace    http://tampermonkey.net/
// @version      22.0
// @description  修复胶囊拖动时变形/卡住的问题。核心逻辑(双击/吸附/投放)保持V20水准。
// @match        *://localhost:*/*
// @match        *://127.0.0.1:*/*
// @match        *://*/*n8n*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559837/n8n%E8%A7%A6%E6%8E%A7%E7%AC%94%E6%82%AC%E6%B5%AE%E7%90%83%28%E5%85%BC%E5%AE%B9RDP%29%EF%BC%9AV10.user.js
// @updateURL https://update.greasyfork.org/scripts/559837/n8n%E8%A7%A6%E6%8E%A7%E7%AC%94%E6%82%AC%E6%B5%AE%E7%90%83%28%E5%85%BC%E5%AE%B9RDP%29%EF%BC%9AV10.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("🖱️ n8n 脚本 V22.0 (胶囊修复版) 已启动");

    // --- 状态变量 (V18/V20 核心) ---
    let isDragMode = false;     // true=橙色(中键画布)
    let isHoldingItem = false;  // true=正在吸附
    let justGrabbed = false;    // 标记：是否刚刚抓取
    
    // 双击判定
    let lastClickTime = 0;
    const DBL_CLICK_DELAY = 300; 

    // UI 变量
    let uiContainer = null;
    let modeBtn = null;

    // --- 0. 防御塔 ---
    window.addEventListener('click', (e) => {
        if (uiContainer && (e.target === uiContainer || uiContainer.contains(e.target))) return;
        if (e.isTrusted) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
    }, { capture: true });

    // --- 1. 事件模拟工厂 ---
    function sendEvent(type, originalEvent, buttonCode, detailVal = 1) {
        let buttonsVal = 0;
        if (buttonCode === 1) buttonsVal = 4;
        else if (isHoldingItem || originalEvent.buttons === 1) buttonsVal = 1;

        const ev = new MouseEvent(type, {
            bubbles: true, cancelable: true, view: window,
            detail: detailVal,
            screenX: originalEvent.screenX, screenY: originalEvent.screenY,
            clientX: originalEvent.clientX, clientY: originalEvent.clientY,
            ctrlKey: originalEvent.ctrlKey, shiftKey: originalEvent.shiftKey,
            altKey: originalEvent.altKey, metaKey: originalEvent.metaKey,
            button: buttonCode,
            buttons: buttonsVal
        });
        originalEvent.target.dispatchEvent(ev);
    }

    // --- 2. 键盘模拟 ---
    function sendKey(keyName) {
        const code = keyName === '+' ? 'Equal' : 'Minus';
        const shift = keyName === '+';
        document.body.dispatchEvent(new KeyboardEvent('keydown', { key: keyName, code: code, shiftKey: shift, bubbles: true }));
        setTimeout(() => {
            document.body.dispatchEvent(new KeyboardEvent('keyup', { key: keyName, code: code, shiftKey: shift, bubbles: true }));
        }, 50);
    }

    // --- 3. 核心拦截逻辑 ---
    ['pointerdown', 'pointermove', 'pointerup'].forEach(eventType => {
        window.addEventListener(eventType, (e) => {
            if (uiContainer && (e.target === uiContainer || uiContainer.contains(e.target))) return;
            if (e.pointerType === 'mouse') return;

            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            // === A. 橙色模式 ===
            if (isDragMode) {
                let type = '';
                if (eventType === 'pointerdown') type = 'mousedown';
                else if (eventType === 'pointermove') type = 'mousemove';
                else if (eventType === 'pointerup') type = 'mouseup';
                if (type) sendEvent(type, e, 1);
                return;
            }

            // === B. 蓝色模式 ===
            if (eventType === 'pointermove') {
                sendEvent('mousemove', e, 0);
                return;
            }

            if (eventType === 'pointerdown') {
                if (isHoldingItem) return; 

                let target = e.target;
                let isCanvas = target.classList.contains('react-flow__pane') || target.id === 'canvas-container';
                let isDraggable = false;

                if (!isCanvas) {
                    if (target.closest && target.closest('[draggable="true"]')) isDraggable = true;
                    else {
                        const style = window.getComputedStyle(target);
                        if (style.cursor.includes('grab') || style.cursor.includes('copy')) isDraggable = true;
                    }
                }

                if (isDraggable) {
                    isHoldingItem = true;
                    justGrabbed = true; 
                    sendEvent('mousedown', e, 0);
                    updateVisuals();
                } else {
                    sendEvent('mousedown', e, 0);
                }
                return;
            }

            if (eventType === 'pointerup') {
                if (isHoldingItem) {
                    if (justGrabbed) {
                        justGrabbed = false;
                        return; 
                    } else {
                        sendEvent('mouseup', e, 0); 
                        isHoldingItem = false;      
                        updateVisuals();
                        return;
                    }
                }

                sendEvent('mouseup', e, 0);
                sendEvent('click', e, 0);

                const now = Date.now();
                if (now - lastClickTime < DBL_CLICK_DELAY) {
                    sendEvent('dblclick', e, 0, 2);
                    lastClickTime = 0;
                } else {
                    lastClickTime = now;
                }
            }

        }, { capture: true, passive: false });
    });

    // --- 4. UI: 胶囊逻辑修复 ---
    function initUI() {
        if (document.getElementById('n8n-rdp-capsule')) return;

        const style = document.createElement('style');
        style.innerHTML = `
            html, body, #root, #app, .canvas, div { touch-action: none !important; overscroll-behavior: none !important; }
            #n8n-rdp-capsule {
                position: fixed; bottom: 50px; right: 30px;
                background: rgba(0, 0, 0, 0.75); backdrop-filter: blur(10px);
                border-radius: 40px; padding: 10px;
                display: flex; flex-direction: column; align-items: center; gap: 15px;
                z-index: 2147483647;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5); border: 2px solid rgba(255, 255, 255, 0.15);
                touch-action: none; cursor: grab;
                /* 关键：设置最小尺寸防止挤压 */
                min-width: 75px; 
            }
            #n8n-rdp-capsule:active { cursor: grabbing; background: rgba(0,0,0,0.85); }
            
            .capsule-btn {
                width: 55px; height: 55px; border-radius: 50%;
                display: flex; align-items: center; justify-content: center;
                font-size: 28px; color: white; cursor: pointer; user-select: none;
                transition: transform 0.1s, background 0.2s; background: rgba(255,255,255,0.1);
                pointer-events: none; 
            }
            #mode-btn {
                width: 65px; height: 65px; background: #2D9CDB;
                box-shadow: 0 4px 15px rgba(45, 156, 219, 0.5); font-size: 32px;
                pointer-events: none;
            }
        `;
        document.head.appendChild(style);

        uiContainer = document.createElement('div');
        uiContainer.id = 'n8n-rdp-capsule';

        const btnPlus = document.createElement('div'); btnPlus.className = 'capsule-btn'; btnPlus.innerHTML = '+';
        const btnMinus = document.createElement('div'); btnMinus.className = 'capsule-btn'; btnMinus.innerHTML = '−';
        modeBtn = document.createElement('div'); modeBtn.id = 'mode-btn'; modeBtn.className = 'capsule-btn'; modeBtn.innerHTML = '👆';

        uiContainer.appendChild(btnPlus);
        uiContainer.appendChild(modeBtn);
        uiContainer.appendChild(btnMinus);
        document.body.appendChild(uiContainer);

        // --- 拖拽修复逻辑 ---
        let dragStartX = 0, dragStartY = 0;
        let dragOffsetX = 0, dragOffsetY = 0;
        let isDragging = false;

        uiContainer.addEventListener('pointerdown', (e) => {
            e.stopPropagation(); e.preventDefault();
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            
            // 1. 获取当前位置
            const rect = uiContainer.getBoundingClientRect();
            dragOffsetX = e.clientX - rect.left;
            dragOffsetY = e.clientY - rect.top;
            
            // 【关键修复】按下瞬间，立即把 CSS 的 bottom/right 换算成 left/top
            // 并强制清除 right/bottom，防止冲突
            uiContainer.style.left = rect.left + 'px';
            uiContainer.style.top = rect.top + 'px';
            uiContainer.style.right = 'auto';
            uiContainer.style.bottom = 'auto';
            
            uiContainer.setPointerCapture(e.pointerId);
            isDragging = false;
        });

        uiContainer.addEventListener('pointermove', (e) => {
            if (!uiContainer.hasPointerCapture(e.pointerId)) return;
            e.stopPropagation(); e.preventDefault();

            if (Math.hypot(e.clientX - dragStartX, e.clientY - dragStartY) > 5) {
                isDragging = true;
            }

            if (isDragging) {
                let x = e.clientX - dragOffsetX;
                let y = e.clientY - dragOffsetY;
                
                // 边界限制
                const winW = window.innerWidth; const winH = window.innerHeight;
                const elW = uiContainer.offsetWidth; const elH = uiContainer.offsetHeight;
                if (x < 0) x = 0; if (x > winW - elW) x = winW - elW;
                if (y < 0) y = 0; if (y > winH - elH) y = winH - elH;
                
                uiContainer.style.left = x + 'px'; uiContainer.style.top = y + 'px';
            }
        });

        uiContainer.addEventListener('pointerup', (e) => {
            e.stopPropagation(); e.preventDefault();
            uiContainer.releasePointerCapture(e.pointerId);

            if (!isDragging) {
                const totalH = uiContainer.offsetHeight;
                const yInContainer = e.clientY - uiContainer.getBoundingClientRect().top;
                const relativeY = yInContainer / totalH;

                if (relativeY < 0.33) {
                    sendKey('+');
                } else if (relativeY > 0.66) {
                    sendKey('-');
                } else {
                    if (isHoldingItem) { isHoldingItem = false; sendEvent('mouseup', {target:document.body}, 0); }
                    isDragMode = !isDragMode;
                    updateVisuals();
                }
            }
        });
    }

    function updateVisuals() {
        if (!modeBtn) return;
        if (isDragMode) {
            modeBtn.style.background = "#F2994A"; modeBtn.innerHTML = "✋"; 
            modeBtn.style.boxShadow = "0 4px 15px rgba(242, 153, 74, 0.6)";
        } else {
            modeBtn.style.background = "#2D9CDB"; 
            modeBtn.style.boxShadow = "0 4px 15px rgba(45, 156, 219, 0.6)";
            if (isHoldingItem) {
                modeBtn.innerHTML = "🧲"; modeBtn.style.border = "3px solid #ffeb3b";
            } else {
                modeBtn.innerHTML = "👆"; modeBtn.style.border = "none";
            }
        }
    }

    if (document.body) initUI();
    else {
        window.addEventListener('DOMContentLoaded', initUI);
        window.addEventListener('load', initUI);
    }

})();