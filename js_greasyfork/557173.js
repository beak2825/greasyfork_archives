// ==UserScript==
// @name         Sega-UFO Auto Reserve
// @namespace    http://tampermonkey.net/
// @version      10.0
// @description  通过开始/停止按钮控制，对 sega-ufo 预约按钮进行无限轮询+狂点
// @match        https://sega-ufo.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/557173/Sega-UFO%20Auto%20Reserve.user.js
// @updateURL https://update.greasyfork.org/scripts/557173/Sega-UFO%20Auto%20Reserve.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("[UFO-AutoReserve] 脚本已注入（带开始/停止按钮）");

    // 运行状态
    let isRunning = false;
    let intervalId = null;
    let observer = null;

    // 核心点击函数：无限轮询模式，只要在就点
    function checkAndClick() {
        if (!isRunning) return;

        const btn = document.getElementById("reservation-button");
        if (btn) {
            try {
                btn.click();
            } catch (e) {
                // 忽略单次点击异常
            }
        }
    }

    // 开始狂点
    function startAuto() {
        if (isRunning) return;
        isRunning = true;
        console.log("[UFO-AutoReserve] ✅ 已开始无限轮询+狂点模式");

        // 50ms 轮询
        intervalId = setInterval(checkAndClick, 50);

        // DOM 变化监听，立刻再检查一次
        observer = new MutationObserver(() => {
            checkAndClick();
        });
        observer.observe(document.documentElement, {
            subtree: true,
            childList: true,
            attributes: true
        });

        updateStatus();
    }

    // 停止狂点
    function stopAuto() {
        if (!isRunning) return;
        isRunning = false;
        console.log("[UFO-AutoReserve] ⛔ 已停止");

        if (intervalId !== null) {
            clearInterval(intervalId);
            intervalId = null;
        }
        if (observer !== null) {
            observer.disconnect();
            observer = null;
        }

        updateStatus();
    }

    // 创建控制面板 UI
    function createControlPanel() {
        if (document.getElementById("ufo-auto-reserve-panel")) return;

        const panel = document.createElement("div");
        panel.id = "ufo-auto-reserve-panel";
        panel.innerHTML = `
            <div class="ufo-panel-header">UFO AutoReserve</div>
            <div class="ufo-panel-body">
                <button id="ufo-start-btn">开始狂点</button>
                <button id="ufo-stop-btn">停止</button>
                <div id="ufo-status" class="ufo-status">当前状态：未运行</div>
            </div>
        `;

        const style = document.createElement("style");
        style.textContent = `
            #ufo-auto-reserve-panel {
                position: fixed;
                right: 10px;
                bottom: 10px;
                z-index: 999999;
                background: rgba(0, 0, 0, 0.8);
                color: #fff;
                font-size: 12px;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                border-radius: 6px;
                padding: 8px 10px;
                box-shadow: 0 0 8px rgba(0,0,0,0.5);
            }
            #ufo-auto-reserve-panel .ufo-panel-header {
                font-weight: bold;
                margin-bottom: 6px;
                text-align: center;
            }
            #ufo-auto-reserve-panel .ufo-panel-body {
                display: flex;
                flex-direction: column;
                gap: 4px;
                align-items: stretch;
            }
            #ufo-start-btn, #ufo-stop-btn {
                cursor: pointer;
                border: none;
                border-radius: 4px;
                padding: 4px 6px;
                font-size: 12px;
            }
            #ufo-start-btn {
                background: #28a745;
                color: #fff;
            }
            #ufo-stop-btn {
                background: #dc3545;
                color: #fff;
            }
            #ufo-status {
                margin-top: 2px;
                font-size: 11px;
                opacity: 0.85;
            }
        `;

        document.documentElement.appendChild(style);
        document.documentElement.appendChild(panel);

        // 绑定按钮事件
        const startBtn = document.getElementById("ufo-start-btn");
        const stopBtn = document.getElementById("ufo-stop-btn");

        startBtn.addEventListener("click", () => {
            startAuto();
        });

        stopBtn.addEventListener("click", () => {
            stopAuto();
        });

        updateStatus();
    }

    function updateStatus() {
        const statusEl = document.getElementById("ufo-status");
        if (!statusEl) return;
        statusEl.textContent = "当前状态：" + (isRunning ? "运行中（无限轮询 + 狂点）" : "未运行");
    }

    // 等待 DOM 准备好后创建控制面板
    function waitForBodyAndInit() {
        if (document.body) {
            createControlPanel();
        } else {
            // body 还没出现就稍后再试，保证在 @run-at document-start 下也能正常挂 UI
            setTimeout(waitForBodyAndInit, 50);
        }
    }

    waitForBodyAndInit();

    // 如果你希望一进页面就默认开始，可以在这里打开：
    // window.addEventListener("load", () => {
    //     startAuto();
    // });

})();
