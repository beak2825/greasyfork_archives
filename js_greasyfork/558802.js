// ==UserScript==
// @name         抖音批量取消点赞
// @namespace    http://tampermonkey.net/
// @version      2025-12-13
// @description  利用键盘快捷键逻辑：按Z取消点赞 -> 下一个视频 -> 循环。仅在沉浸式播放页使用。
// @icon         data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💔</text></svg>
// @grant        none
// @author       DB
// @match        https://www.douyin.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558802/%E6%8A%96%E9%9F%B3%E6%89%B9%E9%87%8F%E5%8F%96%E6%B6%88%E7%82%B9%E8%B5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/558802/%E6%8A%96%E9%9F%B3%E6%89%B9%E9%87%8F%E5%8F%96%E6%B6%88%E7%82%B9%E8%B5%9E.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isRunning = false;
    let loopTimer = null;

    // --- 核心工具函数 ---

    // 随机延迟函数 (让操作看起来像人)
    const sleep = (min, max) => {
        const ms = Math.floor(Math.random() * (max - min + 1) + min);
        return new Promise(resolve => setTimeout(resolve, ms));
    };

    // 模拟键盘按键事件
    const simulateKey = (key, keyCode) => {
        const eventOptions = {
            key: key,
            code: key === 'z' ? 'KeyZ' : 'ArrowDown',
            keyCode: keyCode,
            which: keyCode,
            bubbles: true,
            cancelable: true,
            view: window
        };
        // 触发按下和抬起，确保被识别
        document.dispatchEvent(new KeyboardEvent('keydown', eventOptions));
        setTimeout(() => {
            document.dispatchEvent(new KeyboardEvent('keyup', eventOptions));
        }, 50);
    };

    // --- 业务逻辑 ---

    async function startProcess(statusDiv) {
        if (isRunning) return;
        isRunning = true;
        statusDiv.innerText = "状态：运行中 (请保持在视频播放页)";
        statusDiv.style.color = "#00ff00";

        while (isRunning) {
            try {
                // 1. 模拟按 Z (取消点赞)
                // 注意：如果视频本来没点赞，按Z会变成点赞。请确保你在"我的喜欢"列表里操作。
                console.log('执行：按 Z');
                simulateKey('z', 90);

                // 2. 等待操作生效 (1.5秒 ~ 2.5秒)
                await sleep(1500, 2500);

                if (!isRunning) break;

                // 3. 模拟按 下箭头 (切换下一个)
                console.log('执行：切换下一个');
                simulateKey('ArrowDown', 40);

                // 4. 等待视频加载 (2秒 ~ 4秒，网速慢可适当调大)
                await sleep(2000, 4000);

            } catch (e) {
                console.error("发生错误:", e);
                stopProcess(statusDiv);
            }
        }
    }

    function stopProcess(statusDiv) {
        isRunning = false;
        statusDiv.innerText = "状态：已停止";
        statusDiv.style.color = "#ff4444";
    }

    // --- 创建界面 ---

    function createPanel() {
        const div = document.createElement('div');
        div.style.cssText = `
            position: fixed;
            top: 20px;
            right: 100px;
            width: 150px;
            background: rgba(0, 0, 0, 0.85);
            color: white;
            padding: 15px;
            border-radius: 8px;
            z-index: 99999;
            font-family: sans-serif;
            text-align: center;
            border: 1px solid #444;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
        `;

        const title = document.createElement('div');
        title.innerText = "批量取消点赞";
        title.style.marginBottom = "10px";
        title.style.fontWeight = "bold";
        title.style.fontSize = "16px";

        const status = document.createElement('div');
        status.innerText = "状态：待机";
        status.style.fontSize = "12px";
        status.style.marginBottom = "10px";
        status.style.color = "#aaa";

        const btnStart = document.createElement('button');
        btnStart.innerText = "开始运行";
        btnStart.style.cssText = "width: 100%; padding: 8px; margin-bottom: 5px; cursor: pointer; background: #fe2c55; color: white; border: none; border-radius: 4px;";

        const btnStop = document.createElement('button');
        btnStop.innerText = "停止";
        btnStop.style.cssText = "width: 100%; padding: 8px; cursor: pointer; background: #444; color: white; border: none; border-radius: 4px;";

        const tips = document.createElement('div');
        tips.innerHTML = "⚠️ 请先点进第一个视频<br>进入全屏播放模式<br>再点击开始";
        tips.style.fontSize = "10px";
        tips.style.marginTop = "10px";
        tips.style.color = "#888";
        tips.style.textAlign = "left";

        div.appendChild(title);
        div.appendChild(status);
        div.appendChild(btnStart);
        div.appendChild(btnStop);
        div.appendChild(tips);

        document.body.appendChild(div);

        btnStart.onclick = () => startProcess(status);
        btnStop.onclick = () => stopProcess(status);
    }

    // --- 初始化 ---
    // 延迟2秒加载面板，避免和页面加载冲突
    setTimeout(createPanel, 2000);

})();