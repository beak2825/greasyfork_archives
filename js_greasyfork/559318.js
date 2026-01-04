// ==UserScript==
// @name         Aviator 智能助手 (带控制面板)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  自动投注与提现，带可视化设置界面，参数即时生效
// @author       User
// @license      MIT
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/559318/Aviator%20%E6%99%BA%E8%83%BD%E5%8A%A9%E6%89%8B%20%28%E5%B8%A6%E6%8E%A7%E5%88%B6%E9%9D%A2%E6%9D%BF%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559318/Aviator%20%E6%99%BA%E8%83%BD%E5%8A%A9%E6%89%8B%20%28%E5%B8%A6%E6%8E%A7%E5%88%B6%E9%9D%A2%E6%9D%BF%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =========================================================
    // 1. 默认配置与状态管理
    // =========================================================
    const DEFAULT_SETTINGS = {
        cashOutDelay: 200, // 提现延迟 (毫秒)
        loopInterval: 50,  // 扫描频率 (毫秒)
        isRunning: true    // 默认开启
    };

    // 从本地存储读取配置，如果没有则使用默认
    let settings = {
        cashOutDelay: parseInt(localStorage.getItem('aviator_delay')) || DEFAULT_SETTINGS.cashOutDelay,
        loopInterval: parseInt(localStorage.getItem('aviator_loop')) || DEFAULT_SETTINGS.loopInterval,
        isRunning: DEFAULT_SETTINGS.isRunning
    };

    // 运行时变量
    let loopTimer = null;
    let isCashingOut = false; // 防止重复点击标记

    // =========================================================
    // 2. UI 界面构建
    // =========================================================
    function createPanel() {
        const div = document.createElement('div');
        div.id = 'aviator-bot-panel';
        div.innerHTML = `
            <div class="panel-header">✈️ 脚本控制台</div>
            <div class="panel-row">
                <label>提现延迟 (ms):</label>
                <input type="number" id="inp-cash-delay" value="${settings.cashOutDelay}">
            </div>
            <div class="panel-row">
                <label>扫描频率 (ms):</label>
                <input type="number" id="inp-loop-interval" value="${settings.loopInterval}">
            </div>
            <div class="panel-row btn-row">
                <button id="btn-save">💾 保存并应用</button>
                <button id="btn-toggle" class="${settings.isRunning ? 'btn-on' : 'btn-off'}">
                    ${settings.isRunning ? '运行中' : '已暂停'}
                </button>
            </div>
            <div id="status-log" class="status-bar">就绪: 延迟${settings.cashOutDelay}ms</div>
        `;
        document.body.appendChild(div);

        // 注入 CSS 样式
        const style = document.createElement('style');
        style.innerHTML = `
            #aviator-bot-panel {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 220px;
                background: rgba(0, 0, 0, 0.85);
                color: #fff;
                padding: 15px;
                border-radius: 8px;
                z-index: 99999;
                font-family: Arial, sans-serif;
                box-shadow: 0 4px 15px rgba(0,0,0,0.5);
                border: 1px solid #444;
            }
            .panel-header {
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 12px;
                color: #00ff88;
                text-align: center;
                border-bottom: 1px solid #555;
                padding-bottom: 8px;
            }
            .panel-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
            }
            .panel-row label {
                font-size: 12px;
                color: #ddd;
            }
            .panel-row input {
                width: 70px;
                padding: 4px;
                border-radius: 4px;
                border: none;
                background: #333;
                color: white;
                text-align: center;
            }
            .btn-row {
                margin-top: 15px;
                gap: 5px;
            }
            button {
                flex: 1;
                padding: 6px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
                transition: 0.2s;
            }
            #btn-save {
                background: #2196F3;
                color: white;
            }
            #btn-save:hover { background: #1976D2; }
            #btn-toggle.btn-on { background: #4CAF50; color: white; }
            #btn-toggle.btn-off { background: #f44336; color: white; }
            .status-bar {
                margin-top: 10px;
                font-size: 10px;
                color: #aaa;
                text-align: center;
            }
        `;
        document.head.appendChild(style);

        // 绑定事件
        document.getElementById('btn-save').onclick = applySettings;
        document.getElementById('btn-toggle').onclick = toggleBot;
    }

    // =========================================================
    // 3. 核心逻辑功能
    // =========================================================

    function updateStatus(msg) {
        const el = document.getElementById('status-log');
        if (el) el.innerText = msg;
    }

    // 应用新设置（无需刷新）
    function applySettings() {
        const delayInput = document.getElementById('inp-cash-delay').value;
        const loopInput = document.getElementById('inp-loop-interval').value;

        // 更新全局配置
        settings.cashOutDelay = parseInt(delayInput) || 200;
        settings.loopInterval = parseInt(loopInput) || 50;

        // 限制最小频率防止浏览器卡死
        if (settings.loopInterval < 10) settings.loopInterval = 10;

        // 保存到本地存储
        localStorage.setItem('aviator_delay', settings.cashOutDelay);
        localStorage.setItem('aviator_loop', settings.loopInterval);

        updateStatus(`配置已更新: 延迟${settings.cashOutDelay}ms`);
        console.log("配置已更新", settings);

        // 如果正在运行，重启定时器以应用新频率
        if (settings.isRunning) {
            stopLoop();
            startLoop();
        }
    }

    // 切换运行状态
    function toggleBot() {
        settings.isRunning = !settings.isRunning;
        const btn = document.getElementById('btn-toggle');

        if (settings.isRunning) {
            btn.className = 'btn-on';
            btn.innerText = '运行中';
            startLoop();
            updateStatus('脚本已启动');
        } else {
            btn.className = 'btn-off';
            btn.innerText = '已暂停';
            stopLoop();
            updateStatus('脚本已暂停');
        }
    }

    // 查找特定 label 元素 (精确匹配)
    function findExactLabel(targetText) {
        const labels = document.getElementsByTagName('label');
        for (let i = 0; i < labels.length; i++) {
            const element = labels[i];
            // 获取文字，去除首尾空格
            if (element.textContent.trim() === targetText) {
                // 确保元素可见
                if (element.offsetParent !== null) {
                    return element;
                }
            }
        }
        return null;
    }

    // 智能点击
    function smartClick(element, actionName) {
        if (!element) return;
        // console.log(`执行操作: ${actionName}`);

        element.click();
        if (element.parentElement) {
            element.parentElement.click();
        }
    }

    // 主循环逻辑
    function coreLogic() {
        // 1. 检测提现 (Cash Out)
        const cashOutLabel = findExactLabel("提现");

        if (cashOutLabel) {
            if (!isCashingOut) {
                isCashingOut = true;
                updateStatus(`发现提现! 等待 ${settings.cashOutDelay}ms`);

                setTimeout(() => {
                    const targetNow = findExactLabel("提现");
                    if (targetNow) {
                        smartClick(targetNow, "提现");
                        updateStatus(`已执行提现点击`);
                    } else {
                        updateStatus(`提现按钮消失`);
                    }
                    isCashingOut = false;
                }, settings.cashOutDelay);
            }
        } else {
            isCashingOut = false;
        }

        // 2. 检测投注 (Bet) - 仅在未处理提现时
        if (!isCashingOut) {
            const betLabel = findExactLabel("投注");
            if (betLabel) {
                smartClick(betLabel, "投注");
                // 简单的防刷屏日志，实际使用可以去掉
                // updateStatus(`执行投注点击`);
            }
        }
    }

    // 启动循环
    function startLoop() {
        if (loopTimer) clearInterval(loopTimer);
        loopTimer = setInterval(coreLogic, settings.loopInterval);
    }

    // 停止循环
    function stopLoop() {
        if (loopTimer) clearInterval(loopTimer);
        loopTimer = null;
    }

    // =========================================================
    // 4. 初始化
    // =========================================================

    // 等待页面加载完成后再初始化UI
    window.addEventListener('load', () => {
        createPanel();
        if (settings.isRunning) {
            startLoop();
        }
    });

    // 如果页面已经加载（针对某些单页应用）
    if (document.readyState === 'complete') {
        createPanel();
        if (settings.isRunning) {
            startLoop();
        }
    }

})();