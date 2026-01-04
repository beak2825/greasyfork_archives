// ==UserScript==
// @name         Cookie Clicker Auto Clicker (High CPS)
// @namespace    https://greasyfork.org/
// @version      1.1
// @description  High-speed auto clicker for Cookie Clicker with UI (up to 1000 CPS)
// @author       You
// @match        https://orteil.dashnet.org/cookieclicker/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557315/Cookie%20Clicker%20Auto%20Clicker%20%28High%20CPS%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557315/Cookie%20Clicker%20Auto%20Clicker%20%28High%20CPS%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let clicksPerSecond = 100;
    let running = false;
    let lastTime = performance.now();
    let clickBuffer = 0;

    // ===== UI =====
    const panel = document.createElement('div');
    panel.style = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(30,30,30,0.92);
        color: white;
        padding: 12px;
        border-radius: 10px;
        font-family: Arial, sans-serif;
        z-index: 99999;
        width: 220px;
    `;

    panel.innerHTML = `
        <b>🍪 Auto Clicker</b><br><br>
        <label>Clicks / second</label>
        <input type="range" min="1" max="1000" value="100" id="ccSpeed">
        <div id="ccSpeedVal">100</div>
        <br>
        <button id="ccToggle" style="width:100%;padding:6px;">Start</button>
    `;

    document.body.appendChild(panel);

    const speedSlider = document.getElementById('ccSpeed');
    const speedVal = document.getElementById('ccSpeedVal');
    const toggleBtn = document.getElementById('ccToggle');

    speedSlider.oninput = () => {
        clicksPerSecond = Number(speedSlider.value);
        speedVal.textContent = clicksPerSecond;
    };

    toggleBtn.onclick = () => {
        running = !running;
        toggleBtn.textContent = running ? 'Stop' : 'Start';
        lastTime = performance.now();
        clickBuffer = 0;
        if (running) tick();
    };

    function tick() {
        if (!running) return;

        const now = performance.now();
        const delta = (now - lastTime) / 1000;
        lastTime = now;

        clickBuffer += clicksPerSecond * delta;

        const clickCount = Math.floor(clickBuffer);
        clickBuffer -= clickCount;

        const cookie = document.getElementById('bigCookie');
        if (cookie) {
            for (let i = 0; i < clickCount; i++) {
                cookie.click();
            }
        }

        requestAnimationFrame(tick);
    }

})();
