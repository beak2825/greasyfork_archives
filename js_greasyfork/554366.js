// ==UserScript==
// @name         Doubao 自动点击重新生成按钮
// @author       Hayln
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  自动点击 Doubao 聊天页“重新生成”按钮，可设置间隔、运行时长，带计次与控制面板
// @match        https://www.doubao.com/chat/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554366/Doubao%20%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E9%87%8D%E6%96%B0%E7%94%9F%E6%88%90%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/554366/Doubao%20%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E9%87%8D%E6%96%B0%E7%94%9F%E6%88%90%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let clickIntervalId = null;   // 点击计时器
    let timerId = null;           // 秒计时器
    let isRunning = false;
    let elapsedSeconds = 0;       // 已运行时间（秒）
    let clickCount = 0;           // 点击次数
    let maxRunSeconds = 0;        // 最大运行时间（秒）
    let intervalSeconds = 60;     // 点击间隔

    // === 创建控制面板 ===
    const panel = document.createElement('div');
    panel.id = 'doubao-auto-panel';
    panel.style.position = 'fixed';
    panel.style.top = '20px';
    panel.style.right = '20px';
    panel.style.background = 'rgba(0,0,0,0.85)';
    panel.style.color = '#fff';
    panel.style.padding = '12px 16px';
    panel.style.borderRadius = '10px';
    panel.style.zIndex = '99999';
    panel.style.fontSize = '14px';
    panel.style.fontFamily = 'sans-serif';
    panel.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
    panel.style.width = '220px';
    panel.innerHTML = `
        <div style="font-weight:bold;margin-bottom:6px;">Doubao 自动重生成</div>
        <button id="startAuto" style="margin-right:6px;padding:4px 6px;">▶ 启动</button>
        <button id="stopAuto" style="padding:4px 6px;">⏸ 暂停</button>
        <div style="margin-top:6px;">
            <label>间隔(秒): </label><input id="intervalInput" type="number" value="60" style="width:50px;">
        </div>
        <div style="margin-top:6px;">
            <label>总运行(分钟): </label><input id="maxTimeInput" type="number" placeholder="0=无限" style="width:50px;">
        </div>
        <div id="autoStatus" style="margin-top:6px;font-size:12px;color:#0f0;">状态：已停止</div>
        <div id="elapsedTime" style="margin-top:4px;font-size:12px;color:#0ff;">已运行：00:00:00</div>
        <div id="clickCountEl" style="margin-top:4px;font-size:12px;color:#ff0;">点击次数：0</div>
    `;
    document.body.appendChild(panel);

    const statusEl = document.getElementById('autoStatus');
    const elapsedEl = document.getElementById('elapsedTime');
    const clickCountEl = document.getElementById('clickCountEl');
    const intervalInput = document.getElementById('intervalInput');
    const maxTimeInput = document.getElementById('maxTimeInput');

    // === 格式化时间 hh:mm:ss ===
    function formatTime(seconds) {
        const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const s = String(seconds % 60).padStart(2, '0');
        return `${h}:${m}:${s}`;
    }

    function updateElapsedTime() {
        elapsedSeconds++;
        elapsedEl.textContent = `已运行：${formatTime(elapsedSeconds)}`;

        if (maxRunSeconds > 0 && elapsedSeconds >= maxRunSeconds) {
            console.log('⏹ 已达到设定的运行时长，自动停止');
            stopAuto();
        }
    }

    function clickButton() {
        const btn = document.querySelector('button[data-testid="message_action_regenerate"]');
        if (btn && !btn.disabled) {
            btn.click();
            clickCount++;
            clickCountEl.textContent = `点击次数：${clickCount}`;
            console.log(`✅ 第 ${clickCount} 次点击“重新生成”`);
            statusEl.textContent = '状态：运行中...';
            statusEl.style.color = '#0f0';
        } else if (btn && btn.disabled) {
            console.log('⚠️ 按钮存在但不可点击（disabled）');
            statusEl.textContent = '状态：按钮禁用';
            statusEl.style.color = '#ff0';
        } else {
            console.log('⚠️ 未找到按钮');
            statusEl.textContent = '状态：未找到按钮';
            statusEl.style.color = '#f00';
        }
    }

    function startAuto() {
        if (isRunning) return;
        isRunning = true;

        intervalSeconds = Math.max(parseInt(intervalInput.value) || 60, 1);
        const maxTimeMinutes = parseInt(maxTimeInput.value) || 0;
        maxRunSeconds = maxTimeMinutes > 0 ? maxTimeMinutes * 60 : 0;

        elapsedSeconds = 0;
        clickCount = 0;
        clickCountEl.textContent = `点击次数：0`;
        elapsedEl.textContent = `已运行：00:00:00`;

        clickButton(); // 立即执行一次
        clickIntervalId = setInterval(clickButton, intervalSeconds * 1000);
        timerId = setInterval(updateElapsedTime, 1000);

        statusEl.textContent = '状态：运行中...';
        statusEl.style.color = '#0f0';
    }

    function stopAuto() {
        if (!isRunning) return;
        isRunning = false;
        clearInterval(clickIntervalId);
        clearInterval(timerId);
        clickIntervalId = null;
        timerId = null;

        statusEl.textContent = '状态：已停止';
        statusEl.style.color = '#f00';
    }

    document.getElementById('startAuto').addEventListener('click', startAuto);
    document.getElementById('stopAuto').addEventListener('click', stopAuto);

    window.addEventListener('keydown', (e) => {
        if (e.key === 'F8') {
            if (isRunning) stopAuto();
            else startAuto();
        }
    });

})();
