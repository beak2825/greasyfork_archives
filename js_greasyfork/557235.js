// ==UserScript==
// @name         购买流程循环控制（稳定版，带轮询第二步）
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  自动循环点击购买流程三按钮，页面可设置循环次数，支持开始停止，修正第二步按钮点击问题
// @author       你自己
// @match        https://armory.korabli.su/ru/category/customizations/5000005314*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557235/%E8%B4%AD%E4%B9%B0%E6%B5%81%E7%A8%8B%E5%BE%AA%E7%8E%AF%E6%8E%A7%E5%88%B6%EF%BC%88%E7%A8%B3%E5%AE%9A%E7%89%88%EF%BC%8C%E5%B8%A6%E8%BD%AE%E8%AF%A2%E7%AC%AC%E4%BA%8C%E6%AD%A5%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/557235/%E8%B4%AD%E4%B9%B0%E6%B5%81%E7%A8%8B%E5%BE%AA%E7%8E%AF%E6%8E%A7%E5%88%B6%EF%BC%88%E7%A8%B3%E5%AE%9A%E7%89%88%EF%BC%8C%E5%B8%A6%E8%BD%AE%E8%AF%A2%E7%AC%AC%E4%BA%8C%E6%AD%A5%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 按钮的选择器，简化改用宽松选择器来提高匹配率
    const selectors = {
        first: 'button.armory__auto--bundle_button_purchase',  // 第一个购买按钮
        second: 'button.PriceGroup-module_price-group-actions-btn', // 第二确认按钮
        close: 'button._button-secondary_10j1n_67'  // 关闭按钮
    };

    // 状态
    let step = 0;      // 当前流程步骤：0-准备点第一个，1-等待点第二个，2-等待点关闭按钮
    let running = false; // 运行状态
    let count = 0;       // 已完成循环次数
    let maxCount = 0;    // 最大循环次数 0为无限

    // 控制面板相关变量
    let pollInterval;   // 轮询第二步按钮
    let observer;       // 观察器

    // 每个按钮上次点击时间，防节流
    const lastClickTimes = {
        first: 0,
        second: 0,
        close: 0,
    };

    // 创建页面控制面板
    function createControlPanel() {
        if (document.getElementById('autoPurchaseControlPanel')) return; // 防重复

        const panel = document.createElement('div');
        panel.id = 'autoPurchaseControlPanel';
        Object.assign(panel.style, {
            position: 'fixed',
            top: '10px',
            right: '10px',
            width: '260px',
            padding: '10px',
            backgroundColor: 'rgba(255,255,255,0.95)',
            border: '1px solid #999',
            borderRadius: '6px',
            zIndex: 999999,
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
            color: '#333',
            boxShadow: '0 0 10px rgba(0,0,0,0.3)'
        });

        panel.innerHTML = `
            <h4 style="margin:0 0 8px 0; font-weight:bold;">自动购买循环控制</h4>
            <label>
                循环次数（0为无限）：<br>
                <input id="loopCountInput" type="number" min="0" value="0" style="width:100%; padding:5px; margin:4px 0;">
            </label>
            <button id="startBtn" style="width:100%;padding:8px;margin-top:6px;background:#28a745;color:#fff;border:none;cursor:pointer;">开始</button>
            <button id="stopBtn" style="width:100%;padding:8px;margin-top:6px;background:#dc3545;color:#fff;border:none;cursor:pointer;" disabled>停止</button>
            <div id="statusMsg" style="margin-top:8px; min-height:20px; font-style: italic; color: #555;">状态：已停止</div>
        `;

        document.body.appendChild(panel);

        const startBtn = panel.querySelector('#startBtn');
        const stopBtn = panel.querySelector('#stopBtn');
        const loopCountInput = panel.querySelector('#loopCountInput');
        const statusMsg = panel.querySelector('#statusMsg');

        startBtn.addEventListener('click', () => {
            const val = parseInt(loopCountInput.value, 10);
            if (isNaN(val) || val < 0) {
                alert("请输入有效的循环次数 (0或正整数)");
                return;
            }
            maxCount = val;
            count = 0;
            step = 0;
            running = true;
            updateStatus(`状态：运行中，目标循环次数 ${maxCount === 0 ? "无限" : maxCount}`);
            startBtn.disabled = true;
            loopCountInput.disabled = true;
            stopBtn.disabled = false;
            startObserver();
        });

        stopBtn.addEventListener('click', () => {
            running = false;
            updateStatus("状态：已停止");
            startBtn.disabled = false;
            loopCountInput.disabled = false;
            stopBtn.disabled = true;
            stopObserver();
            stopPolling();
        });

        function updateStatus(text) {
            statusMsg.textContent = text;
        }
    }


    // 判断元素是否可见
    function isVisible(elem) {
        if (!elem) return false;
        return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
    }

    // 安全点击，带节流和可见检测
    function safeClick(selector, name, key) {
        if (!running) return false;
        const now = Date.now();
        if (now - lastClickTimes[key] < 800) { // 节流800ms
            return false;
        }
        const btn = document.querySelector(selector);
        if (btn && isVisible(btn)) {
            console.log(`点击按钮: ${name}`);
            btn.click();
            lastClickTimes[key] = now;
            return true;
        }
        return false;
    }

    // 轮询检测并点击第二步按钮
    function tryClickSecondButton() {
        if (!running || step !== 1) return;
        if (safeClick(selectors.second, "第二个确认按钮", "second")) {
            step = 2;
            stopPolling();
        }
    }

    // 启动轮询（每500ms尝试点击第二按钮）
    function startPolling() {
        if (pollInterval) return;
        pollInterval = setInterval(tryClickSecondButton, 500);
    }

    function stopPolling() {
        if (pollInterval) {
            clearInterval(pollInterval);
            pollInterval = null;
        }
    }

    // MutationObserver辅助，监听DOM变化驱动流程尝试点击第一个或关闭按钮
    function startObserver() {
        if (observer) return;
        observer = new MutationObserver(() => {
            if (!running) return;
            processStep();
        });
        observer.observe(document.body, { childList: true, subtree: true });

        processStep(); // 立即尝试执行一次
    }

    function stopObserver() {
        if (observer) {
            observer.disconnect();
            observer = null;
        }
    }

    // 处理当前步骤点击逻辑
    function processStep() {
        if (!running) return;

        switch(step) {
            case 0: // 点击第一个购买按钮
                if (safeClick(selectors.first, "第一个购买按钮", "first")) {
                    step = 1;
                    startPolling(); // 轮询第二按钮
                }
                break;
            case 1:
                // 第二步点击由轮询控制，主流程无动作
                break;
            case 2: // 点击关闭按钮
                if (safeClick(selectors.close, "关闭按钮", "close")) {
                    step = 0;
                    count++;
                    updateLoopStatus();
                }
                break;
            default:
                step = 0;
        }
    }

    // 更新控制面板的循环状态显示
    function updateLoopStatus() {
        const panel = document.getElementById("autoPurchaseControlPanel");
        if (!panel) return;
        const statusMsg = panel.querySelector("#statusMsg");

        if (maxCount > 0 && count >= maxCount) {
            running = false;
            statusMsg.textContent = `状态：完成，已循环 ${count} 次`;
            panel.querySelector("#startBtn").disabled = false;
            panel.querySelector("#loopCountInput").disabled = false;
            panel.querySelector("#stopBtn").disabled = true;
            stopObserver();
            stopPolling();
            console.log("已达到期望循环次数，脚本停止运行");
        } else {
            statusMsg.textContent = `状态：运行中，已完成 ${count} 次 ，目标 ${
                maxCount === 0 ? "无限" : maxCount
            }`;
        }
    }

    // 启动时创建界面
    createControlPanel();

})();
