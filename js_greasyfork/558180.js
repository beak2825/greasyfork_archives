// ==UserScript==
// @name         SwordMasters.io 終極安全版（x11 + 隱形 WebSocket + 封包偽裝 + 人類化封包）
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      3.0
// @description  封包隱匿、Fingerprint Randomizer、封包噪音、隨機延遲、PPS 限速、最高 x11、安全不被識別
// @author       huang
// @match        https://swordmasters.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558180/SwordMastersio%20%E7%B5%82%E6%A5%B5%E5%AE%89%E5%85%A8%E7%89%88%EF%BC%88x11%20%2B%20%E9%9A%B1%E5%BD%A2%20WebSocket%20%2B%20%E5%B0%81%E5%8C%85%E5%81%BD%E8%A3%9D%20%2B%20%E4%BA%BA%E9%A1%9E%E5%8C%96%E5%B0%81%E5%8C%85%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/558180/SwordMastersio%20%E7%B5%82%E6%A5%B5%E5%AE%89%E5%85%A8%E7%89%88%EF%BC%88x11%20%2B%20%E9%9A%B1%E5%BD%A2%20WebSocket%20%2B%20%E5%B0%81%E5%8C%85%E5%81%BD%E8%A3%9D%20%2B%20%E4%BA%BA%E9%A1%9E%E5%8C%96%E5%B0%81%E5%8C%85%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let enabled = true;
    let folded = false;

    // ★ 安全設定（不可太高）
    const MAX_PPS = 25; // 每秒最多封包
    const RANDOM_DELAY_MIN = 10;
    const RANDOM_DELAY_MAX = 40;

    const schedulerQueue = [];
    let ppsCounter = 0;

    setInterval(() => ppsCounter = 0, 1000);

    function rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // ============================================================
    //   ★ Fingerprint Randomizer — 封包指紋偽裝
    // ============================================================
    function addPacketNoise(data) {

        // ---------- 如果是文字封包 ----------
        if (typeof data === "string") {
            // 插入隨機 comment（解析時會被忽略）
            const noise = `/*${Math.random().toString(36).slice(2)}*/`;
            const pos = Math.floor(Math.random() * (data.length + 1));
            return data.slice(0, pos) + noise + data.slice(pos);
        }

        // ---------- 如果是 ArrayBuffer ----------
        if (data instanceof ArrayBuffer) {
            const original = new Uint8Array(data);
            const padding = new Uint8Array(1);
            padding[0] = Math.floor(Math.random() * 256); // entropy

            const extended = new Uint8Array(original.length + 1);
            extended.set(original);
            extended.set(padding, original.length);

            return extended.buffer;
        }

        return data;
    }

    // ============================================================
    //   ★ 隱形 WebSocket 發送隊列（不可被遊戲 detect）
    // ============================================================
    function scheduleSend(ws, data) {
        schedulerQueue.push({ ws, data });
        if (schedulerQueue.length === 1) processQueue();
    }

    function processQueue() {
        if (schedulerQueue.length === 0) return;

        if (ppsCounter >= MAX_PPS) {
            return setTimeout(processQueue, 50);
        }

        const { ws, data } = schedulerQueue.shift();

        // ★ 偷偷加入指紋噪音（無法被察覺）
        const disguised = addPacketNoise(data);

        ws.__realSend(disguised);
        ppsCounter++;

        setTimeout(processQueue, rand(RANDOM_DELAY_MIN, RANDOM_DELAY_MAX));
    }

    // ============================================================
    //   ★ UI：可折疊 + 切換 + 倍率滑桿（最高 x11）
    // ============================================================
    function createMultiplierUI() {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.bottom = '10px';
        container.style.left = '10px';
        container.style.zIndex = '999999';
        container.style.backgroundColor = 'rgba(0,0,0,0.75)';
        container.style.color = 'white';
        container.style.padding = '8px';
        container.style.borderRadius = '7px';
        container.style.fontFamily = 'Arial';
        container.style.width = '200px';
        container.style.userSelect = 'none';

        const header = document.createElement('div');
        header.style.cursor = 'pointer';
        header.style.fontWeight = 'bold';
        header.style.marginBottom = '6px';
        container.appendChild(header);

        const content = document.createElement('div');

        function updateHeader() {
            const s = enabled ? "啟用" : "關閉";
            header.innerText = `攻擊倍率 (${s}) ${folded ? "▲" : "▼"}`;
        }

        // button
        const toggleBtn = document.createElement('button');
        toggleBtn.innerText = '已啟用';
        toggleBtn.style.width = '100%';
        toggleBtn.style.padding = '4px';
        toggleBtn.style.border = 'none';
        toggleBtn.style.borderRadius = '4px';
        toggleBtn.style.cursor = 'pointer';
        toggleBtn.style.marginBottom = '8px';
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

        // slider 1~11
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '1';
        slider.max = '11';
        slider.value = '1';
        slider.style.width = '150px';
        slider.style.cursor = 'pointer';
        content.appendChild(slider);

        const label = document.createElement('span');
        label.innerText = ' x1';
        label.style.marginLeft = '8px';
        content.appendChild(label);

        slider.addEventListener('input', () => {
            label.innerText = ' x' + slider.value;
        });

        // safe note
        const note = document.createElement('div');
        note.innerText = '最高 x11（安全限制）';
        note.style.fontSize = '12px';
        note.style.opacity = '0.6';
        note.style.marginTop = '4px';
        content.appendChild(note);

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

    // ============================================================
    //   ★ 無法被遊戲偵測的 WebSocket send hook
    // ============================================================
    const RealSend = WebSocket.prototype.send;
    WebSocket.prototype.__realSend = RealSend;

    // 使用 Proxy 方式完全不可見
    WebSocket.prototype.send = new Proxy(RealSend, {
        apply(target, thisArg, args) {
            const data = args[0];

            if (!enabled) {
                return target.call(thisArg, data);
            }

            let msg = "";
            try {
                if (typeof data === "string") msg = data;
                else if (data instanceof ArrayBuffer || ArrayBuffer.isView(data))
                    msg = new TextDecoder().decode(data);
                else msg = data.toString();
            } catch { msg = ""; }

            // ≈≈≈ 攻擊封包偵測 ≈≈≈
            if (msg.includes("Client:EnemyController:checkDamage")) {

                scheduleSend(thisArg, data);

                const targetTimes = Math.min(parseInt(slider.value), 11);
                let current = 1;

                while (current < targetTimes) {
                    current++;
                    scheduleSend(thisArg, data);
                }
                return;
            }

            scheduleSend(thisArg, data);
        }
    });

    console.log("[Ultimate Safe Mode] 已啟動：隱形 WebSocket + Fingerprint Noise + x11");
})();
