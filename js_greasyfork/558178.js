// ==UserScript==
// @name         SwordMasters.io 擊殺倍數安全版（每次+1、最多+10、自動限速、人類化封包）
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      2.1
// @description  已加入每次+1、最高額外10次（總共最多 x11）+ 安全限速 + 隨機延遲 + 折疊 UI
// @author       huang-wei-lun
// @match        https://swordmasters.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558178/SwordMastersio%20%E6%93%8A%E6%AE%BA%E5%80%8D%E6%95%B8%E5%AE%89%E5%85%A8%E7%89%88%EF%BC%88%E6%AF%8F%E6%AC%A1%2B1%E3%80%81%E6%9C%80%E5%A4%9A%2B10%E3%80%81%E8%87%AA%E5%8B%95%E9%99%90%E9%80%9F%E3%80%81%E4%BA%BA%E9%A1%9E%E5%8C%96%E5%B0%81%E5%8C%85%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/558178/SwordMastersio%20%E6%93%8A%E6%AE%BA%E5%80%8D%E6%95%B8%E5%AE%89%E5%85%A8%E7%89%88%EF%BC%88%E6%AF%8F%E6%AC%A1%2B1%E3%80%81%E6%9C%80%E5%A4%9A%2B10%E3%80%81%E8%87%AA%E5%8B%95%E9%99%90%E9%80%9F%E3%80%81%E4%BA%BA%E9%A1%9E%E5%8C%96%E5%B0%81%E5%8C%85%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let enabled = true;
    let folded = false;

    // ★ 安全設定
    const MAX_PPS = 25; // 每秒最多 25 封包
    const RANDOM_DELAY_MIN = 10;
    const RANDOM_DELAY_MAX = 40;

    const schedulerQueue = [];
    let ppsCounter = 0;

    // 每秒清空 PPS 計數
    setInterval(() => { ppsCounter = 0; }, 1000);

    function rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function scheduleSend(ws, data) {
        schedulerQueue.push({ ws, data });
        if (schedulerQueue.length === 1) processQueue();
    }

    function processQueue() {
        if (schedulerQueue.length === 0) return;

        if (ppsCounter >= MAX_PPS) {
            setTimeout(processQueue, 50);
            return;
        }

        const { ws, data } = schedulerQueue.shift();
        ws.__originalSend(data);
        ppsCounter++;

        setTimeout(processQueue, rand(RANDOM_DELAY_MIN, RANDOM_DELAY_MAX));
    }

    // UI
    function createMultiplierUI() {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.bottom = '10px';
        container.style.left = '10px';
        container.style.zIndex = '10000';
        container.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
        container.style.color = 'white';
        container.style.padding = '8px';
        container.style.borderRadius = '7px';
        container.style.fontFamily = 'Arial, sans-serif';
        container.style.fontSize = '14px';
        container.style.width = '200px';
        container.style.userSelect = 'none';

        const header = document.createElement('div');
        header.style.cursor = 'pointer';
        header.style.fontWeight = 'bold';
        header.style.marginBottom = '6px';
        container.appendChild(header);

        function updateHeader() {
            const statusText = enabled ? "已啟用" : "已停用";
            header.innerText = `殺人乘數 (${statusText}) ${folded ? "▲" : "▼"}`;
        }

        const content = document.createElement('div');

        const toggleBtn = document.createElement('button');
        toggleBtn.innerText = '已啟用';
        toggleBtn.style.width = '100%';
        toggleBtn.style.padding = '4px';
        toggleBtn.style.marginBottom = '8px';
        toggleBtn.style.border = 'none';
        toggleBtn.style.borderRadius = '4px';
        toggleBtn.style.cursor = 'pointer';
        toggleBtn.style.backgroundColor = '#28a745';
        toggleBtn.style.color = 'white';

        toggleBtn.onclick = () => {
            enabled = !enabled;
            if (enabled) {
                toggleBtn.innerText = '已啟用';
                toggleBtn.style.backgroundColor = '#28a745';
            } else {
                toggleBtn.innerText = '已停用';
                toggleBtn.style.backgroundColor = '#dc3545';
            }
            updateHeader();
        };
        content.appendChild(toggleBtn);

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '1';
        slider.max = '100';
        slider.value = '1';
        slider.style.width = '150px';
        slider.style.height = '4px';
        slider.style.cursor = 'pointer';
        content.appendChild(slider);

        const valueLabel = document.createElement('span');
        valueLabel.innerText = ' x1';
        valueLabel.style.marginLeft = '8px';
        content.appendChild(valueLabel);

        slider.addEventListener('input', () => {
            valueLabel.innerText = ' x' + slider.value;
        });

        header.onclick = () => {
            folded = !folded;
            content.style.display = folded ? 'none' : 'block';
            updateHeader();
        };

        updateHeader();
        container.appendChild(content);
        document.body.appendChild(container);

        return slider;
    }

    const slider = createMultiplierUI();

    // ★ Hook WebSocket
    const OldSend = WebSocket.prototype.send;
    WebSocket.prototype.__originalSend = OldSend;

    WebSocket.prototype.send = function (data) {
        let msg;

        try {
            if (typeof data === "string") msg = data;
            else if (data instanceof ArrayBuffer || ArrayBuffer.isView(data))
                msg = new TextDecoder().decode(data);
            else msg = data.toString();
        } catch {
            msg = "";
        }

        if (!enabled) return this.__originalSend(data);

        if (msg.includes("Client:EnemyController:checkDamage")) {
            // 先送原本攻擊
            scheduleSend(this, data);

            // ★ 你的新規則：每次 +1，最多 +10
            let target = parseInt(slider.value, 10);

            // 把最高額外限制成 +10 → 最大 x11
            target = Math.min(target, 11);

            let lastValue = 1;

            while (lastValue < target) {
                lastValue = lastValue + 1; // 每次只 +1
                scheduleSend(this, data);
            }
            return;
        }

        scheduleSend(this, data);
    };

    console.log("[Kill Multiplier] 已啟動（每次+1、最高+10）");
})();
