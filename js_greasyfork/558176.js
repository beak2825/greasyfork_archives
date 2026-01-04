// ==UserScript==
// @name         SwordMasters.io 擊殺倍數（可折疊 UI + 狀態顯示 + 折疊倍率）
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      1.5
// @description  可折疊面板 + 滑桿 + 啟用/停用 + 折疊時顯示倍率
// @author       huang-wei-lun
// @match        https://swordmasters.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558176/SwordMastersio%20%E6%93%8A%E6%AE%BA%E5%80%8D%E6%95%B8%EF%BC%88%E5%8F%AF%E6%8A%98%E7%96%8A%20UI%20%2B%20%E7%8B%80%E6%85%8B%E9%A1%AF%E7%A4%BA%20%2B%20%E6%8A%98%E7%96%8A%E5%80%8D%E7%8E%87%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/558176/SwordMastersio%20%E6%93%8A%E6%AE%BA%E5%80%8D%E6%95%B8%EF%BC%88%E5%8F%AF%E6%8A%98%E7%96%8A%20UI%20%2B%20%E7%8B%80%E6%85%8B%E9%A1%AF%E7%A4%BA%20%2B%20%E6%8A%98%E7%96%8A%E5%80%8D%E7%8E%87%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let enabled = true;
    let folded = false;

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

        // 標題（含狀態）
        const header = document.createElement('div');
        header.style.cursor = 'pointer';
        header.style.fontWeight = 'bold';
        header.style.marginBottom = '6px';
        container.appendChild(header);

        // UI 內容
        const content = document.createElement('div');

        // 啟用 / 停用按鈕
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

        // 滑桿
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '1';
        slider.max = '100';
        slider.value = '1';
        slider.style.width = '150px';
        slider.style.height = '4px';
        slider.style.cursor = 'pointer';

        content.appendChild(slider);

        // 滑桿旁數字顯示
        const valueLabel = document.createElement('span');
        valueLabel.innerText = ' x1';
        valueLabel.style.marginLeft = '8px';
        content.appendChild(valueLabel);

        slider.addEventListener('input', () => {
            valueLabel.innerText = ' x' + slider.value;
            updateHeader();
        });

        // 點擊折疊
        header.onclick = () => {
            folded = !folded;
            content.style.display = folded ? 'none' : 'block';
            updateHeader();
        };

        function updateHeader() {
            const statusText = enabled ? "已啟用" : "已停用";
            if (folded) {
                // 折疊時標題顯示倍率
                header.innerText = `殺人乘數 x${slider.value} (${statusText}) ▲`;
            } else {
                // 展開時標題只顯示狀態
                header.innerText = `殺人乘數 (${statusText}) ▼`;
            }
        }

        if (folded) content.style.display = 'none';

        updateHeader();

        container.appendChild(content);
        document.body.appendChild(container);

        return slider;
    }

    const originalWSSend = WebSocket.prototype.send;
    const multiplierSlider = createMultiplierUI();

    WebSocket.prototype.send = function (data) {
        try {
            let messageText;

            if (typeof data === 'string') {
                messageText = data;
            } else if (data instanceof ArrayBuffer || ArrayBuffer.isView(data)) {
                messageText = new TextDecoder("utf-8").decode(data);
            } else {
                messageText = data.toString();
            }

            if (!enabled) {
                originalWSSend.call(this, data);
                return;
            }

            if (messageText.includes("Client:EnemyController:checkDamage")) {
                originalWSSend.call(this, data);

                const multiplier = parseInt(multiplierSlider.value, 10);
                const extra = multiplier - 1;

                for (let i = 0; i < extra; i++) {
                    setTimeout(() => {
                        originalWSSend.call(this, data);
                    }, 20 * (i + 1));
                }

                return;
            }

        } catch (err) {
            console.error("Kill multiplier WS hook error:", err);
        }

        originalWSSend.call(this, data);
    };

    console.log("[Kill Multiplier] Foldable UI with correct multiplier display loaded.");
})();
