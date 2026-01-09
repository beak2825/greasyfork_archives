// ==UserScript==
// @name         猫站摇摇乐自动抽奖
// @namespace    https://tampermonkey.net/
// @version      1.2.0
// @description  带UI控制面板、Toast监听、奖励统计的自动抽奖
// @match        *://*/slot/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561778/%E7%8C%AB%E7%AB%99%E6%91%87%E6%91%87%E4%B9%90%E8%87%AA%E5%8A%A8%E6%8A%BD%E5%A5%96.user.js
// @updateURL https://update.greasyfork.org/scripts/561778/%E7%8C%AB%E7%AB%99%E6%91%87%E6%91%87%E4%B9%90%E8%87%AA%E5%8A%A8%E6%8A%BD%E5%A5%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /************ 状态 ************/
    let running = false;
    let totalTimes = GM_getValue('times', 2);
    let intervalSec = GM_getValue('interval', 7);

    const rewardStats = new Map();

    /************ UI ************/
    const panel = document.createElement('div');
    panel.style = `
        position: fixed;
        right: 20px;
        bottom: 20px;
        z-index: 99999;
        width: 260px;
        background: #1f2937;
        color: #fff;
        border-radius: 10px;
        padding: 12px;
        font-size: 14px;
        box-shadow: 0 10px 30px rgba(0,0,0,.4);
    `;

    panel.innerHTML = `
        <div style="font-weight:bold;font-size:16px;margin-bottom:8px">🎰 自动抽奖</div>

        <label>抽奖次数
            <input id="tm-times" type="number" min="1" value="${totalTimes}" style="width:100%">
        </label>

        <label>间隔（秒）
            <input id="tm-interval" type="number" min="1" value="${intervalSec}" style="width:100%">
        </label>

        <div style="margin-top:8px;display:flex;gap:6px">
            <button id="tm-start" style="flex:1">开始</button>
            <button id="tm-stop" style="flex:1">停止</button>
        </div>

        <button id="tm-clear" style="width:100%;margin-top:6px">清空统计</button>

        <div id="tm-stats" style="margin-top:8px;max-height:150px;overflow:auto;font-size:12px"></div>
    `;

    document.body.appendChild(panel);

    /************ 工具 ************/
    const sleep = ms => new Promise(r => setTimeout(r, ms));

    function updateStatsUI() {
        const box = panel.querySelector('#tm-stats');
        box.innerHTML = [...rewardStats.entries()]
            .map(([k, v]) => `${k} × ${v}`)
            .join('<br>') || '暂无数据';
    }

    function findSpinButton() {
        return document.querySelector('.handler .cursor-pointer');
    }

    /************ 核心抽奖逻辑（关键修复） ************/
    async function startLottery() {
        if (running) return;
        running = true;

        for (let i = 0; i < totalTimes; i++) {
            if (!running) break;

            const btn = findSpinButton();
            if (!btn) break;

            btn.click();
            await sleep(intervalSec * 1000);
        }

        running = false;
    }

    function stopLottery() {
        running = false;
    }

    /************ Toast 监听 ************/
    function observeToast() {
        const container = document.querySelector('.dk__toast-top-left');
        if (!container) return;

        const observer = new MutationObserver(mutations => {
            for (const m of mutations) {
                m.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        const text = node.innerText?.trim();
                        if (text) {
                            rewardStats.set(text, (rewardStats.get(text) || 0) + 1);
                            updateStatsUI();
                        }
                    }
                });
            }
        });

        observer.observe(container, { childList: true });
    }

    /************ 事件 ************/
    panel.querySelector('#tm-start').onclick = startLottery;
    panel.querySelector('#tm-stop').onclick = stopLottery;

    panel.querySelector('#tm-clear').onclick = () => {
        rewardStats.clear();
        updateStatsUI();
    };

    panel.querySelector('#tm-times').onchange = e => {
        totalTimes = +e.target.value;
        GM_setValue('times', totalTimes);
    };

    panel.querySelector('#tm-interval').onchange = e => {
        intervalSec = +e.target.value;
        GM_setValue('interval', intervalSec);
    };

    /************ 初始化 ************/
    const wait = setInterval(() => {
        if (document.querySelector('.dk__toast-top-left')) {
            clearInterval(wait);
            observeToast();
        }
    }, 500);

})();
