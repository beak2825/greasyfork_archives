// ==UserScript==
// @name         页面定时刷新带输入控制(持久化版)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  添加开始/停止刷新按钮、倒计时显示和自定义时间输入，刷新后继续计时
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558121/%E9%A1%B5%E9%9D%A2%E5%AE%9A%E6%97%B6%E5%88%B7%E6%96%B0%E5%B8%A6%E8%BE%93%E5%85%A5%E6%8E%A7%E5%88%B6%28%E6%8C%81%E4%B9%85%E5%8C%96%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558121/%E9%A1%B5%E9%9D%A2%E5%AE%9A%E6%97%B6%E5%88%B7%E6%96%B0%E5%B8%A6%E8%BE%93%E5%85%A5%E6%8E%A7%E5%88%B6%28%E6%8C%81%E4%B9%85%E5%8C%96%E7%89%88%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let refreshInterval = null;
    let countdownTimer = null;
    let countdown = 0;
    let intervalSeconds = parseInt(localStorage.getItem('refresh_interval')) || 5;
    let isRunning = localStorage.getItem('refresh_running') === 'true';

    // 创建控制面板
    const panel = document.createElement('div');
    panel.style.position = 'fixed';
    panel.style.top = '10px';
    panel.style.right = '10px';
    panel.style.background = 'rgba(0,0,0,0.7)';
    panel.style.color = '#fff';
    panel.style.padding = '10px';
    panel.style.zIndex = '99999';
    panel.style.borderRadius = '5px';
    panel.style.fontSize = '14px';

    const inputBox = document.createElement('input');
    inputBox.type = 'number';
    inputBox.value = intervalSeconds;
    inputBox.style.width = '50px';
    inputBox.style.marginRight = '5px';

    const startBtn = document.createElement('button');
    startBtn.textContent = '开始刷新';
    startBtn.style.marginRight = '5px';

    const stopBtn = document.createElement('button');
    stopBtn.textContent = '停止刷新';

    const countdownDisplay = document.createElement('span');
    countdownDisplay.textContent = '倒计时: 未开始';

    panel.appendChild(document.createTextNode('间隔(s): '));
    panel.appendChild(inputBox);
    panel.appendChild(startBtn);
    panel.appendChild(stopBtn);
    panel.appendChild(document.createElement('br'));
    panel.appendChild(countdownDisplay);
    document.body.appendChild(panel);

    // 启动逻辑
    function startRefresh() {
        intervalSeconds = parseInt(inputBox.value, 10) || 5;
        localStorage.setItem('refresh_interval', intervalSeconds);
        localStorage.setItem('refresh_running', 'true');

        countdown = intervalSeconds;
        countdownDisplay.textContent = `倒计时: ${countdown}s`;

        countdownTimer = setInterval(() => {
            countdown--;
            countdownDisplay.textContent = `倒计时: ${countdown}s`;
            if (countdown <= 0) {
                location.reload();
            }
        }, 1000);

        refreshInterval = setInterval(() => {
            countdown = intervalSeconds;
        }, intervalSeconds * 1000);

        startBtn.disabled = true;
        stopBtn.disabled = false;
        inputBox.disabled = true;
    }

    // 停止逻辑
    function stopRefresh() {
        clearInterval(refreshInterval);
        clearInterval(countdownTimer);
        refreshInterval = null;
        countdownTimer = null;
        countdownDisplay.textContent = '倒计时: 已停止';
        startBtn.disabled = false;
        stopBtn.disabled = true;
        inputBox.disabled = false;
        localStorage.setItem('refresh_running', 'false');
    }

    startBtn.addEventListener('click', startRefresh);
    stopBtn.addEventListener('click', stopRefresh);

    // 页面加载时恢复状态
    if (isRunning) {
        startRefresh();
    } else {
        stopRefresh();
    }
})();
