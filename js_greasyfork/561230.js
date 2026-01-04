// ==UserScript==
// @name         RockyIdle 增强辅助 (30秒版 + 视觉反馈 + 开关 + 防休眠)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  每隔30秒自动点击 Boost，带有视觉提示、拖动开关及静默音频防休眠
// @author       Gemini
// @match        https://rockyidle.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561230/RockyIdle%20%E5%A2%9E%E5%BC%BA%E8%BE%85%E5%8A%A9%20%2830%E7%A7%92%E7%89%88%20%2B%20%E8%A7%86%E8%A7%89%E5%8F%8D%E9%A6%88%20%2B%20%E5%BC%80%E5%85%B3%20%2B%20%E9%98%B2%E4%BC%91%E7%9C%A0%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561230/RockyIdle%20%E5%A2%9E%E5%BC%BA%E8%BE%85%E5%8A%A9%20%2830%E7%A7%92%E7%89%88%20%2B%20%E8%A7%86%E8%A7%89%E5%8F%8D%E9%A6%88%20%2B%20%E5%BC%80%E5%85%B3%20%2B%20%E9%98%B2%E4%BC%91%E7%9C%A0%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isRunning = true;
    const INTERVAL_MS = 30000; // 设置为 30000 毫秒 (30秒)

    // --- 1. 创建 UI 样式 ---
    const style = document.createElement('style');
    style.innerHTML = `
        #boost-helper-ctrl {
            position: fixed; top: 20px; right: 20px; z-index: 9999;
            background: rgba(0, 0, 0, 0.85); color: white; padding: 12px;
            border-radius: 10px; cursor: move; user-select: none;
            font-family: system-ui, -apple-system, sans-serif; font-size: 13px;
            border: 1px solid #555; box-shadow: 0 8px 20px rgba(0,0,0,0.6);
            width: 140px; text-align: center;
        }
        #boost-helper-ctrl button {
            cursor: pointer; margin-top: 8px; width: 100%; padding: 6px;
            border-radius: 5px; border: none; font-weight: bold; transition: 0.2s;
        }
        .btn-on { background: #2ecc71; color: white; }
        .btn-off { background: #e74c3c; color: white; }

        /* 点击视觉提示动画 */
        .click-hint {
            position: absolute; width: 40px; height: 40px;
            border: 3px solid #00ff00; border-radius: 50%;
            pointer-events: none; z-index: 10000;
            animation: hint-out 0.8s ease-out forwards;
        }
        @keyframes hint-out {
            0% { transform: scale(0.4); opacity: 1; }
            100% { transform: scale(2.5); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // --- 2. 创建静默音频 (防休眠) ---
    const silentAudio = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==");
    silentAudio.loop = true;

    // --- 3. 创建悬浮窗 ---
    const ctrl = document.createElement('div');
    ctrl.id = 'boost-helper-ctrl';
    ctrl.innerHTML = `
        <div style="margin-bottom:4px; font-weight:bold;">🚀 Rocky Booster</div>
        <div style="font-size:10px; color:#00ff00;">周期: 30s</div>
        <div id="sleep-status" style="font-size:10px; color:#aaa;">🔊 防休眠已准备</div>
        <button id="toggle-btn" class="btn-on">运行中</button>
    `;
    document.body.appendChild(ctrl);

    const toggleBtn = document.getElementById('toggle-btn');
    const sleepStatus = document.getElementById('sleep-status');

    toggleBtn.onclick = () => {
        isRunning = !isRunning;
        toggleBtn.textContent = isRunning ? "运行中" : "已暂停";
        toggleBtn.className = isRunning ? "btn-on" : "btn-off";

        if (isRunning) {
            silentAudio.play().catch(()=>{});
            sleepStatus.textContent = "🔊 防休眠已开启";
        } else {
            silentAudio.pause();
            sleepStatus.textContent = "🔇 防休眠已关闭";
        }
    };

    // --- 4. 拖动逻辑 ---
    let isDragging = false, offset = [0,0];
    ctrl.onmousedown = (e) => {
        isDragging = true;
        offset = [ctrl.offsetLeft - e.clientX, ctrl.offsetTop - e.clientY];
    };
    document.onmousemove = (e) => {
        if (!isDragging) return;
        ctrl.style.left = (e.clientX + offset[0]) + 'px';
        ctrl.style.top = (e.clientY + offset[1]) + 'px';
        ctrl.style.right = 'auto';
    };
    document.onmouseup = () => isDragging = false;

    // 激活音频
    document.addEventListener('click', () => {
        if (isRunning && silentAudio.paused) {
            silentAudio.play().catch(() => {});
            sleepStatus.textContent = "🔊 防休眠已开启";
        }
    }, { once: true });

    // --- 5. 核心逻辑 ---
    const showVisualHint = (el) => {
        const rect = el.getBoundingClientRect();
        const hint = document.createElement('div');
        hint.className = 'click-hint';
        hint.style.left = (rect.left + window.scrollX + rect.width/2 - 20) + 'px';
        hint.style.top = (rect.top + window.scrollY + rect.height/2 - 20) + 'px';
        document.body.appendChild(hint);
        setTimeout(() => hint.remove(), 800);
    };

    setInterval(() => {
        if (!isRunning) return;

        const targets = document.querySelectorAll('img[alt="combat boost"], img[alt="skilling boost"]');
        if (targets.length > 0) {
            targets.forEach(el => {
                showVisualHint(el);
                el.click();
            });
            console.log(`[AutoClick] ${new Date().toLocaleTimeString()} 已执行 30s 周期点击`);
        }
    }, INTERVAL_MS);

})();