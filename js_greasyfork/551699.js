// ==UserScript==
// @name         K線倒數計時器（滑鼠穿透 + 重新倒數前三秒長亮 + 最後10秒閃爍）
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  所有網頁都顯示，每次倒數重新開始的前三秒長亮 + 最後10秒直接切換原色閃爍，且滑鼠無視背景
// @author       issac
// @match        *://*/*
// @license      GPL-3.0 License
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551699/K%E7%B7%9A%E5%80%92%E6%95%B8%E8%A8%88%E6%99%82%E5%99%A8%EF%BC%88%E6%BB%91%E9%BC%A0%E7%A9%BF%E9%80%8F%20%2B%20%E9%87%8D%E6%96%B0%E5%80%92%E6%95%B8%E5%89%8D%E4%B8%89%E7%A7%92%E9%95%B7%E4%BA%AE%20%2B%20%E6%9C%80%E5%BE%8C10%E7%A7%92%E9%96%83%E7%88%8D%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/551699/K%E7%B7%9A%E5%80%92%E6%95%B8%E8%A8%88%E6%99%82%E5%99%A8%EF%BC%88%E6%BB%91%E9%BC%A0%E7%A9%BF%E9%80%8F%20%2B%20%E9%87%8D%E6%96%B0%E5%80%92%E6%95%B8%E5%89%8D%E4%B8%89%E7%A7%92%E9%95%B7%E4%BA%AE%20%2B%20%E6%9C%80%E5%BE%8C10%E7%A7%92%E9%96%83%E7%88%8D%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function initTimer() {
        const timerContainer = document.createElement('div');
        timerContainer.id = "timerContainer";
        document.body.appendChild(timerContainer);

        const style = document.createElement('style');
        style.innerHTML = `
            #timerContainer {
                position: fixed;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                align-items: stretch;
                gap: 8px;
                background: rgba(0,0,0,0.7);
                padding: 8px 12px;
                border-radius: 10px 10px 0 0;
                font-family: monospace;
                color: white;
                z-index: 999999;
                pointer-events: none; /* 背景穿透 */
            }
            #timerContainer * {
                pointer-events: auto; /* 讓內部元素可點擊 */
            }
            .timer {
                padding: 4px 8px;
                border-radius: 5px;
                text-align: center;
                font-size: 14px;
                cursor: default;
                display: flex;
                flex-direction: column;
                justify-content: center;
            }
            .timer span {
                display: block;
            }
            #currentTime {
                padding: 4px 8px;
                background: rgba(255,255,255,0.1);
                border-radius: 5px;
                font-size: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            #toggleBtn {
                position: fixed;
                bottom: 5px;
                right: 5px;
                background: rgba(0,0,0,0.7);
                color: white;
                padding: 5px 10px;
                border-radius: 5px;
                font-size: 12px;
                cursor: pointer;
                z-index: 1000000;
                pointer-events: auto; /* 讓按鈕可點擊 */
            }
            #settingsPanel {
                position: fixed;
                bottom: 40px;
                right: 5px;
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 10px;
                border-radius: 5px;
                font-size: 12px;
                display: none;
                z-index: 1000000;
                pointer-events: auto; /* 設定面板可點擊 */
            }
            #settingsPanel label {
                display: block;
                margin-top: 5px;
            }
            #toggleVisibilityBtn { /* 新增按鈕樣式 */
                display: block;
                margin-top: 8px;
                padding: 4px;
                background: rgba(255,255,255,0.2);
                border: none;
                border-radius: 3px;
                color: white;
                cursor: pointer;
            }
        `;
        document.head.appendChild(style);

        const currentTimeDiv = document.createElement('div');
        currentTimeDiv.id = "currentTime";
        currentTimeDiv.innerText = "--:--:--";
        timerContainer.appendChild(currentTimeDiv);

        const toggleBtn = document.createElement('div');
        toggleBtn.id = "toggleBtn";
        toggleBtn.innerText = "倒數計時器設定";
        document.body.appendChild(toggleBtn);

        const settingsPanel = document.createElement('div');
        settingsPanel.id = "settingsPanel";
        document.body.appendChild(settingsPanel);

        const intervals = [
            {min: 1, color: "#ff4d4d"},
            {min: 5, color: "#4da6ff"},
            {min: 15, color: "#4dff88"},
            {min: 30, color: "#ffd24d"},
            {min: 60, color: "#b84dff"}
        ];

        intervals.forEach(item => {
            const div = document.createElement("div");
            div.className = "timer";
            div.id = "timer_" + item.min;
            div.dataset.baseColor = item.color;
            div.style.background = item.color + "33";
            div.innerHTML = `<span>${item.min} 分</span><span>--:--</span>`;
            timerContainer.appendChild(div);

            const label = document.createElement("label");
            label.innerHTML = `${item.min} 分顏色: <input type="color" value="${item.color}" data-min="${item.min}">`;
            settingsPanel.appendChild(label);
        });

        const sizeLabel = document.createElement("label");
        sizeLabel.innerHTML = `字體大小: <input type="number" id="fontSize" value="14" min="10" max="30"> px`;
        settingsPanel.appendChild(sizeLabel);

        const paddingLabel = document.createElement("label");
        paddingLabel.innerHTML = `間距: <input type="number" id="paddingSize" value="8" min="0" max="50"> px`;
        settingsPanel.appendChild(paddingLabel);

        // 🔹 新增顯示/隱藏計時器按鈕
        const toggleVisibilityBtn = document.createElement("button");
        toggleVisibilityBtn.id = "toggleVisibilityBtn";
        toggleVisibilityBtn.innerText = "隱藏倒數計時器";
        settingsPanel.appendChild(toggleVisibilityBtn);

        let timerVisible = true;
        toggleVisibilityBtn.onclick = () => {
            timerVisible = !timerVisible;
            timerContainer.style.display = timerVisible ? "flex" : "none";
            toggleVisibilityBtn.innerText = timerVisible ? "隱藏倒數計時器" : "顯示倒數計時器";
        };

        toggleBtn.onclick = () => {
            settingsPanel.style.display = settingsPanel.style.display === "block" ? "none" : "block";
        };

        document.getElementById("fontSize").addEventListener("input", function() {
            document.querySelectorAll(".timer").forEach(div => {
                div.style.fontSize = this.value + "px";
            });
            currentTimeDiv.style.fontSize = this.value + "px";
        });

        document.getElementById("paddingSize").addEventListener("input", function() {
            timerContainer.style.gap = this.value + "px";
        });

        settingsPanel.querySelectorAll("input[type=color]").forEach(input => {
            input.addEventListener("change", function() {
                const min = this.getAttribute("data-min");
                const div = document.getElementById("timer_" + min);
                div.dataset.baseColor = this.value;
                div.style.background = this.value + "33";
            });
        });

        let blinkFlag = false;

        function updateTimers() {
            const now = new Date();
            const seconds = now.getSeconds();
            const minutes = now.getMinutes();
            const hours = now.getHours();

            currentTimeDiv.innerText = `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;

            blinkFlag = !blinkFlag;

            intervals.forEach(item => {
                let totalSeconds = item.min * 60;
                let elapsedSeconds = (minutes % item.min) * 60 + seconds;
                let remaining = totalSeconds - elapsedSeconds;
                if (remaining < 0) remaining = 0;

                const m = Math.floor(remaining / 60).toString().padStart(2, '0');
                const s = (remaining % 60).toString().padStart(2, '0');
                const timerDiv = document.querySelector(`#timer_${item.min}`);
                timerDiv.querySelector("span:nth-child(2)").innerText = `${m}:${s}`;

                if (remaining >= totalSeconds - 3) {
                    timerDiv.style.background = item.color;
                } else if (remaining <= 10) {
                    timerDiv.style.background = blinkFlag ? item.color : item.color + "33";
                } else {
                    timerDiv.style.background = item.color + "33";
                }
            });
        }

        setInterval(updateTimers, 500);
        updateTimers();
    }

    if (document.readyState === "complete" || document.readyState === "interactive") {
        initTimer();
    } else {
        window.addEventListener("DOMContentLoaded", initTimer);
    }
})();
