// ==UserScript==
// @name         SwordMasters.io 透過 WS 複製實現擊殺倍數
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      1.0
// @description  透過傳送重複攻擊訊息來增加殺戮資料的腳本（使用滑桿從 1 調整到 50000）
// @author       huang-wei-lun
// @match        https://swordmasters.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564279/SwordMastersio%20%E9%80%8F%E9%81%8E%20WS%20%E8%A4%87%E8%A3%BD%E5%AF%A6%E7%8F%BE%E6%93%8A%E6%AE%BA%E5%80%8D%E6%95%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/564279/SwordMastersio%20%E9%80%8F%E9%81%8E%20WS%20%E8%A4%87%E8%A3%BD%E5%AF%A6%E7%8F%BE%E6%93%8A%E6%AE%BA%E5%80%8D%E6%95%B8.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    // -- 1. UI 建立：左下角滑桿 (1~50000) --
    function createMultiplierUI() {
        // UI 容器
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.bottom = '10px';
        container.style.left = '10px';
        container.style.zIndex = '10000';
        container.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        container.style.color = 'white';
        container.style.padding = '8px';
        container.style.borderRadius = '5px';
        container.style.fontFamily = 'Arial, sans-serif';
        container.style.fontSize = '14px';
        container.style.userSelect = 'none';
 
        // 標題
        const title = document.createElement('div');
        title.innerText = '殺人乘數';
        title.style.marginBottom = '4px';
        container.appendChild(title);
 
        // 滑桿
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '1';
        slider.max = '50000';
        slider.value = '1'; // 基本的: 1 （即沒有額外的傳輸）
        slider.style.width = '200px';
        container.appendChild(slider);
 
        // 顯示價值
        const valueLabel = document.createElement('span');
        valueLabel.innerText = ' x1';
        valueLabel.style.marginLeft = '8px';
        container.appendChild(valueLabel);
 
        slider.addEventListener('input', function () {
            valueLabel.innerText = ' x' + slider.value;
        });
 
        document.body.appendChild(container);
        return slider;
    }
 
    // -- 2. WebSocket 訊息掛鉤 --
    // 通常 WebSocket.send節省
    const originalWSSend = WebSocket.prototype.send;
    // 在使用者介面中 kill multiplier 建立一個滑桿物件來讀取值
    const multiplierSlider = createMultiplierUI();
 
    WebSocket.prototype.send = function (data) {
        try {
            // 資料必須是要分析的字串
            let messageText;
            if (typeof data === 'string') {
                messageText = data;
            } else if (data instanceof ArrayBuffer || ArrayBuffer.isView(data)) {
                // 解碼為字串 (UTF-8)
                messageText = new TextDecoder("utf-8").decode(data);
            } else {
                messageText = data.toString();
            }
 
            // 確認：在訊息中 "Client:EnemyController:checkDamage" 包含在內嗎？
            if (messageText.indexOf("Client:EnemyController:checkDamage") !== -1) {
                // 傳送基本訊息（實際攻擊）
                originalWSSend.call(this, data);
                // 額外傳輸：取決於滑桿值（例如，如果值為 1，則無額外傳輸）
                const multiplier = parseInt(multiplierSlider.value, 10);
                // multiplier的 預設值 1: 0 extra, 2: 1 extra, ...
                const extraCount = multiplier - 1;
                if (extraCount > 0) {
                    for (let i = 0; i < extraCount; i++) {
                        // 短暫延遲後進行額外傳輸（每次延遲 20ms）
                        setTimeout(() => {
                            originalWSSend.call(this, data);
                        }, 20 * (i + 1));
                    }
                }
                return; // 由於已經被處理，因此返回
            }
        } catch (err) {
            console.error("Kill multiplier WS hook error:", err);
        }
        // 正常訊息原樣發送
        originalWSSend.call(this, data);
    };
 
    console.log("[Kill Multiplier] Script loaded and WS.send hooked.");
})();