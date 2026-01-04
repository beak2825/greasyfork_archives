// ==UserScript==
// @name         NGSpaceCompany 时间控制器
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  控制NGSpaceCompany游戏的时间流速和日期跳转
// @author       HBZHSN
// @match        *://g8hh.github.io/NGSpaceCompany/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555084/NGSpaceCompany%20%E6%97%B6%E9%97%B4%E6%8E%A7%E5%88%B6%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/555084/NGSpaceCompany%20%E6%97%B6%E9%97%B4%E6%8E%A7%E5%88%B6%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========== 配置区域 ==========
    let timeSpeedMultiplier = 1;
    let timeOffset = 0;
    let enableControl = true;

    // ========== 保存原始时间函数 ==========
    const originalDate = Date;
    const originalNow = Date.now;
    const originalGetTime = Date.prototype.getTime;
    const startRealTime = originalNow();
    const baseTime = originalNow();

    // ========== 覆盖 Date.now() ==========
    Date.now = function() {
        if (!enableControl) return originalNow();
        const elapsed = originalNow() - startRealTime;
        return baseTime + (elapsed * timeSpeedMultiplier) + timeOffset;
    };

    // ========== 覆盖 Date 构造函数 ==========
    window.Date = function(...args) {
        if (args.length === 0 && enableControl) {
            return new originalDate(Date.now());
        }
        return new originalDate(...args);
    };

    Object.setPrototypeOf(window.Date, originalDate);
    Object.setPrototypeOf(window.Date.prototype, originalDate.prototype);
    window.Date.prototype = originalDate.prototype;

    Date.prototype.getTime = function() {
        const originalTime = originalGetTime.call(this);
        if (!enableControl) return originalTime;
        if (this.constructor === window.Date) {
            return originalTime;
        }
        return originalTime;
    };

    // ========== 创建控制面板 ==========
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'time-control-panel';
        panel.innerHTML = `
            <style>
                #time-control-panel {
                    position: fixed;
                    top: 10px;
                    right: 10px;
                    background: linear-gradient(145deg, #1a1d23, #252a33);
                    color: #fff;
                    padding: 0;
                    border-radius: 10px;
                    z-index: 999999;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
                    font-size: 13px;
                    width: 280px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.6);
                    border: 1px solid rgba(255,255,255,0.08);
                    overflow: hidden;
                }
                #time-control-panel .header {
                    background: linear-gradient(135deg, #4a5568 0%, #5a6b7d 100%);
                    padding: 10px 12px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: move;
                    user-select: none;
                }
                #time-control-panel h3 {
                    margin: 0;
                    font-size: 14px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    line-height: 1;
                    color: #e2e8f0;
                }
                #time-control-panel .content {
                    padding: 12px;
                }
                #time-control-panel .section {
                    margin-bottom: 10px;
                    background: rgba(255,255,255,0.03);
                    padding: 10px;
                    border-radius: 6px;
                    border: 1px solid rgba(255,255,255,0.05);
                }
                #time-control-panel .section:last-child {
                    margin-bottom: 0;
                }
                #time-control-panel .section-title {
                    display: block;
                    margin: 0 0 8px 0;
                    font-size: 11px;
                    color: #94a3b8;
                    font-weight: 500;
                    text-transform: uppercase;
                    letter-spacing: 0.3px;
                }
                #time-control-panel input[type="number"],
                #time-control-panel input[type="datetime-local"],
                #time-control-panel select {
                    width: 100%;
                    padding: 8px 10px;
                    margin-bottom: 6px;
                    background: rgba(0,0,0,0.3);
                    border: 1px solid rgba(255,255,255,0.1);
                    color: #e2e8f0;
                    border-radius: 5px;
                    box-sizing: border-box;
                    font-size: 12px;
                    transition: all 0.2s;
                }
                #time-control-panel input:focus,
                #time-control-panel select:focus {
                    outline: none;
                    border-color: #64748b;
                    box-shadow: 0 0 0 2px rgba(100,116,139,0.2);
                }
                #time-control-panel button {
                    width: 100%;
                    padding: 8px;
                    margin: 0;
                    background: linear-gradient(135deg, #64748b 0%, #475569 100%);
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: 500;
                    transition: all 0.2s;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                }
                #time-control-panel button:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    background: linear-gradient(135deg, #708aaa 0%, #546682 100%);
                }
                #time-control-panel button:active {
                    transform: translateY(0);
                }
                #time-control-panel button.success {
                    background: linear-gradient(135deg, #5a8a7a 0%, #4a7262 100%);
                    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                }
                #time-control-panel button.success:hover {
                    background: linear-gradient(135deg, #6a9d8a 0%, #5a8272 100%);
                }
                #time-control-panel button.danger {
                    background: linear-gradient(135deg, #b45a5a 0%, #9e4848 100%);
                    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                }
                #time-control-panel button.danger:hover {
                    background: linear-gradient(135deg, #c46a6a 0%, #ae5858 100%);
                }
                #time-control-panel .status {
                    padding: 8px 10px;
                    margin: 0;
                    background: rgba(0,0,0,0.3);
                    border-radius: 6px;
                    font-size: 11px;
                    border: 1px solid rgba(255,255,255,0.05);
                }
                #time-control-panel .status-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 4px 0;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                }
                #time-control-panel .status-item:last-child {
                    border-bottom: none;
                    padding-bottom: 0;
                }
                #time-control-panel .status-label {
                    color: #94a3b8;
                    font-size: 10px;
                }
                #time-control-panel .status-value {
                    color: #e2e8f0;
                    font-weight: 600;
                    font-size: 11px;
                }
                .toggle-btn {
                    width: 20px;
                    height: 20px;
                    background: rgba(255,255,255,0.15);
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    line-height: 1;
                    color: #e2e8f0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                    flex-shrink: 0;
                    padding: 0;
                }
                .toggle-btn:hover {
                    background: rgba(255,255,255,0.25);
                }
                #time-control-panel.minimized {
                    width: auto;
                }
                #time-control-panel.minimized .content {
                    display: none;
                }
            </style>
            <div class="header">
                <h3>时间控制器</h3>
                <button class="toggle-btn" style="width: 30px;" onclick="document.getElementById('time-control-panel').classList.toggle('minimized')">−</button>
            </div>
            <div class="content">
                <div class="section">
                    <span class="section-title">时间倍速</span>
                    <input type="number" id="speed-input" value="1" min="0.1" max="1000" step="0.5" placeholder="输入倍速">
                    <button class="success" onclick="applySpeed()">应用倍速</button>
                </div>

                <div class="section">
                    <span class="section-title">快进时间</span>
                    <select id="skip-select">
                        <option value="3600000" selected>1小时</option>
                        <option value="28800000">8小时</option>
                        <option value="86400000">1天</option>
                        <option value="604800000">7天</option>
                        <option value="2592000000">30天</option>
                        <option value="31536000000">1年</option>
                    </select>
                    <button onclick="skipTime()">快进</button>
                </div>

                <div class="section">
                    <span class="section-title">跳转到指定日期</span>
                    <input type="datetime-local" id="date-input">
                    <button onclick="jumpToDate()">跳转</button>
                </div>

                <div class="section">
                    <button class="danger" onclick="resetTime()">重置时间</button>
                </div>

                <div class="status">
                    <div class="status-item">
                        <span class="status-label">当前倍速</span>
                        <span class="status-value"><span id="current-speed">1.0</span>x</span>
                    </div>
                    <div class="status-item">
                        <span class="status-label">时间偏移</span>
                        <span class="status-value"><span id="current-offset">0.00</span>天</span>
                    </div>
                    <div class="status-item">
                        <span class="status-label">游戏时间</span>
                        <span class="status-value" id="game-time">--</span>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(panel);
        makeDraggable(panel);
    }

    // ========== 拖拽功能 ==========
    function makeDraggable(element) {
        const header = element.querySelector('.header');
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        header.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
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
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
            element.style.right = "auto";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // ========== 控制函数 ==========
    window.applySpeed = function() {
        const speedInput = document.getElementById('speed-input');
        const newSpeed = parseFloat(speedInput.value) || 1;
        timeSpeedMultiplier = newSpeed;
        updateStatus();
        showNotification(`时间倍速已设置为 ${newSpeed}x`);
    };

    window.skipTime = function() {
        const skipSelect = document.getElementById('skip-select');
        const skipAmount = parseInt(skipSelect.value);
        timeOffset += skipAmount;
        updateStatus();
        const days = (skipAmount / 86400000).toFixed(1);
        showNotification(`时间已快进 ${days} 天`);
    };

    window.jumpToDate = function() {
        const dateInput = document.getElementById('date-input');
        if (!dateInput.value) {
            showNotification('请选择一个日期！', 'error');
            return;
        }
        const targetDate = new Date(dateInput.value);
        const currentRealTime = originalNow();
        timeOffset = targetDate.getTime() - currentRealTime;
        updateStatus();
        showNotification(`已跳转到 ${targetDate.toLocaleString('zh-CN')}`);
    };

    window.resetTime = function() {
        timeSpeedMultiplier = 1;
        timeOffset = 0;
        document.getElementById('speed-input').value = 1;
        updateStatus();
        showNotification('时间已重置');
    };

    // ========== 更新状态显示 ==========
    function updateStatus() {
        document.getElementById('current-speed').textContent = timeSpeedMultiplier.toFixed(1);
        document.getElementById('current-offset').textContent = (timeOffset / 86400000).toFixed(2);
        const gameTime = new Date(Date.now());
        document.getElementById('game-time').textContent =
            gameTime.toLocaleString('zh-CN', {
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
    }

    // ========== 通知提示 ==========
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'error' ? 'linear-gradient(135deg, #b45a5a 0%, #9e4848 100%)' : 'linear-gradient(135deg, #5a8a7a 0%, #4a7262 100%)'};
            color: white;
            padding: 10px 20px;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 9999999;
            font-size: 13px;
            font-weight: 500;
            animation: slideDown 0.3s ease-out;
        `;
        notification.textContent = message;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideDown 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    // ========== 定期更新时间显示 ==========
    setInterval(updateStatus, 1000);

    // ========== 等待页面加载后创建控制面板 ==========
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createControlPanel);
    } else {
        createControlPanel();
    }

    console.log('%c⏰ NGSpaceCompany 时间控制器已加载！', 'color: #64748b; font-size: 14px; font-weight: bold;');
})();