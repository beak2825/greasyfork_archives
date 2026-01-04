// ==UserScript==
// @name         Twitch 页面自动刷新
// @namespace    https://tampermonkey.net/
// @version      1.1
// @description  仅在Twitch网站自动刷新页面，默认每3分钟刷新，显示剩余时间倒计时，面板固定右下角且无刷新确认弹窗
// @author       SundayRX
// @license      MIT
// @match        https://www.twitch.tv/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/560019/Twitch%20%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/560019/Twitch%20%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置项
    const DEFAULT_INTERVAL = 3 * 60 * 1000; // 默认3分钟（毫秒）
    let refreshInterval = GM_getValue('refreshInterval', DEFAULT_INTERVAL);
    let isEnabled = GM_getValue('isEnabled', true); // 是否启用自动刷新
    let refreshTimer = null; // 刷新主定时器
    let countdownTimer = null; // 倒计时更新定时器
    let remainingTime = refreshInterval; // 剩余刷新时间（毫秒）

    // 格式化时间：毫秒 → 分:秒（例如 2分58秒）
    function formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}分${seconds.toString().padStart(2, '0')}秒`;
    }

    // 显示控制面板（固定右下角）
    function createControlPanel() {
        if (document.getElementById('auto-refresh-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'auto-refresh-panel';
        panel.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: #18181b;
            border: 1px solid #3a3a3d;
            border-radius: 8px;
            padding: 12px;
            z-index: 999999;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            font-size: 14px;
            color: #f1f1f2;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            min-width: 180px;
            pointer-events: auto;
            display: block !important;
        `;

        // 面板头部（含关闭按钮）
        const panelHeader = document.createElement('div');
        panelHeader.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            padding-bottom: 6px;
            border-bottom: 1px solid #3a3a3d;
        `;

        // 面板标题
        const panelTitle = document.createElement('span');
        panelTitle.textContent = '自动刷新控制';
        panelTitle.style.color = '#9147ff';

        // 关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
            background: transparent;
            color: #f1f1f2;
            border: none;
            font-size: 16px;
            cursor: pointer;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            transition: background 0.2s;
        `;
        closeBtn.onmouseover = () => closeBtn.style.background = '#3a3a3d';
        closeBtn.onmouseout = () => closeBtn.style.background = 'transparent';
        closeBtn.onclick = () => {
            panel.style.display = 'none';
        };

        panelHeader.appendChild(panelTitle);
        panelHeader.appendChild(closeBtn);
        panel.appendChild(panelHeader);

        // 状态显示
        const statusText = document.createElement('div');
        statusText.innerHTML = `自动刷新：<span style="color: ${isEnabled ? '#4ade80' : '#f87171'}">${isEnabled ? '已启用' : '已禁用'}</span>`;
        statusText.style.marginBottom = '6px';

        // 间隔显示
        const intervalText = document.createElement('div');
        intervalText.innerHTML = `刷新间隔：${refreshInterval / 60000} 分钟`;
        intervalText.style.marginBottom = '6px';

        // 倒计时显示
        const countdownText = document.createElement('div');
        countdownText.id = 'refresh-countdown';
        countdownText.innerHTML = `剩余时间：${formatTime(remainingTime)}`;
        countdownText.style.marginBottom = '10px';
        countdownText.style.color = '#9147ff';

        // 手动刷新按钮
        const refreshBtn = document.createElement('button');
        refreshBtn.textContent = '立即刷新';
        refreshBtn.style.cssText = `
            margin-right: 8px;
            padding: 4px 8px;
            background: #9147ff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.2s;
        `;
        refreshBtn.onmouseover = () => refreshBtn.style.background = '#772ce8';
        refreshBtn.onmouseout = () => refreshBtn.style.background = '#9147ff';
        refreshBtn.onclick = () => {
            window.location.reload();
            resetCountdown();
        };

        // 开关按钮
        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = isEnabled ? '暂停刷新' : '启用刷新';
        toggleBtn.style.cssText = `
            padding: 4px 8px;
            background: ${isEnabled ? '#ef4444' : '#22c55e'};
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.2s;
        `;
        toggleBtn.onmouseover = () => {
            toggleBtn.style.background = isEnabled ? '#dc2626' : '#16a34a';
        };
        toggleBtn.onmouseout = () => {
            toggleBtn.style.background = isEnabled ? '#ef4444' : '#22c55e';
        };
        toggleBtn.onclick = toggleRefresh;

        // 组装面板
        panel.appendChild(statusText);
        panel.appendChild(intervalText);
        panel.appendChild(countdownText);
        panel.appendChild(refreshBtn);
        panel.appendChild(toggleBtn);
        document.body.appendChild(panel);

        // 双击页面空白处显示面板
        document.addEventListener('dblclick', (e) => {
            if (!e.target.closest('button, a, input, textarea, [role="button"], [data-a-target], video, canvas')) {
                panel.style.display = 'block';
                updateCountdownDisplay();
            }
        });
    }

    // 更新倒计时显示
    function updateCountdownDisplay() {
        const countdownEl = document.getElementById('refresh-countdown');
        if (countdownEl) {
            if (isEnabled) {
                countdownEl.innerHTML = `剩余时间：${formatTime(remainingTime)}`;
                countdownEl.style.color = '#9147ff';
            } else {
                countdownEl.innerHTML = '剩余时间：已暂停';
                countdownEl.style.color = '#f87171';
            }
        }
    }

    // 重置倒计时
    function resetCountdown() {
        remainingTime = refreshInterval;
        updateCountdownDisplay();
    }

    // 启动倒计时更新
    function startCountdownUpdate() {
        if (countdownTimer) clearInterval(countdownTimer);

        if (isEnabled) {
            countdownTimer = setInterval(() => {
                remainingTime -= 1000;
                if (remainingTime < 0) remainingTime = 0;
                updateCountdownDisplay();
            }, 1000);
        }
    }

    // 切换刷新状态
    function toggleRefresh() {
        isEnabled = !isEnabled;
        GM_setValue('isEnabled', isEnabled);

        const statusSpan = document.querySelector('#auto-refresh-panel span');
        const toggleBtn = document.querySelector('#auto-refresh-panel button:last-child');

        if (statusSpan) {
            statusSpan.style.color = isEnabled ? '#4ade80' : '#f87171';
            statusSpan.textContent = isEnabled ? '已启用' : '已禁用';
        }
        if (toggleBtn) {
            toggleBtn.textContent = isEnabled ? '暂停刷新' : '启用刷新';
            toggleBtn.style.background = isEnabled ? '#ef4444' : '#22c55e';
        }

        resetCountdown();
        restartTimer();
    }

    // 设置刷新间隔
    function setRefreshInterval() {
        const minutes = prompt('请输入自动刷新间隔（分钟）：', refreshInterval / 60000);
        if (minutes === null) return;

        const numMinutes = parseFloat(minutes);
        if (isNaN(numMinutes) || numMinutes <= 0) {
            alert('请输入有效的正数！');
            return;
        }

        refreshInterval = numMinutes * 60 * 1000;
        GM_setValue('refreshInterval', refreshInterval);

        const intervalText = document.querySelector('#auto-refresh-panel div:nth-child(3)');
        if (intervalText) intervalText.innerHTML = `刷新间隔：${numMinutes} 分钟`;

        resetCountdown();
        restartTimer();
    }

    // 重启所有定时器（核心修改：移除确认弹窗，自动刷新）
    function restartTimer() {
        if (refreshTimer) clearTimeout(refreshTimer);
        if (countdownTimer) clearInterval(countdownTimer);

        if (isEnabled) {
            refreshTimer = setTimeout(() => {
                // 移除确认弹窗，直接刷新页面
                window.location.reload();

                // 刷新后自动重置倒计时并重启定时器（无需用户确认）
                resetCountdown();
                startTimer();
            }, refreshInterval);

            startCountdownUpdate();
        } else {
            updateCountdownDisplay();
        }
    }

    // 启动主定时器
    function startTimer() {
        restartTimer();
    }

    // 注册油猴菜单
    GM_registerMenuCommand('设置Twitch刷新间隔', setRefreshInterval);
    GM_registerMenuCommand('切换Twitch刷新状态', toggleRefresh);
    GM_registerMenuCommand('显示刷新控制面板', () => {
        const panel = document.getElementById('auto-refresh-panel');
        if (panel) panel.style.display = 'block';
        updateCountdownDisplay();
    });

    // 初始化
    function init() {
        createControlPanel();
        updateCountdownDisplay();
        if (isEnabled) startTimer();

        window.addEventListener('beforeunload', () => {
            if (refreshTimer) clearTimeout(refreshTimer);
            if (countdownTimer) clearInterval(countdownTimer);
        });
    }

    // 页面加载完成后初始化
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }

})();