// ==UserScript==
// @name         HYDROFLOW v4.3 – Stealth Abyssal PVP CLIENT(ZERO LAG FIX) FOR BLOXD.IO
// @namespace    http://tampermonkey.net/
// @version      4.3
// @description  Lag-free PvP HUD & Death-safe Hotbar.
// @author       IMMORTAL_DEMON_999
// @match        *://bloxd.io/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559225/HYDROFLOW%20v43%20%E2%80%93%20Stealth%20Abyssal%20PVP%20CLIENT%28ZERO%20LAG%20FIX%29%20FOR%20BLOXDIO.user.js
// @updateURL https://update.greasyfork.org/scripts/559225/HYDROFLOW%20v43%20%E2%80%93%20Stealth%20Abyssal%20PVP%20CLIENT%28ZERO%20LAG%20FIX%29%20FOR%20BLOXDIO.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ---------- THEME & STYLES ----------
    const style = document.createElement('style');
    style.textContent = `
        /* --- HUD BASE --- */
        #hydroStealth {
            position: fixed; bottom: 15px; left: 15px;
            display: flex; flex-direction: column; gap: 4px;
            z-index: 100000; pointer-events: none;
            font-family: 'Segoe UI', sans-serif;
            opacity: 0.9;
        }
        .key-row { display: flex; gap: 4px; align-items: flex-end; }
        .k {
            background: rgba(0, 20, 45, 0.7); backdrop-filter: blur(5px);
            border: 1px solid rgba(0, 255, 238, 0.3);
            color: rgba(255, 255, 255, 0.9);
            border-radius: 4px; display: flex; align-items: center; justify-content: center;
            font-weight: 900; transition: transform 0.05s, background 0.1s;
        }

        /* COMPACT SIZES */
        .k-main { width: 36px; height: 36px; font-size: 13px; }
        .k-tiny { width: 26px; height: 26px; font-size: 8px; color: #00ffee; }
        .k-shift { width: 48px; height: 28px; font-size: 9px; }
        .k-space { width: 82px; height: 20px; font-size: 8px; }
        .k-mouse { width: 58px; height: 32px; flex-direction: column; font-size: 9px; }

        .active {
            background: #00ffee !important; color: #000 !important;
            transform: scale(0.9) translateY(2px);
            box-shadow: 0 0 15px #00ffee;
        }

        /* --- THE HOTBAR FIX (CSS ONLY) --- */
        /* This looks for Bloxd's internal "Selected" item class and applies our glow to it automatically */
        .Selected, [class*="Selected"], [style*="border: 2px solid white"] {
            background: rgba(0, 255, 238, 0.3) !important;
            box-shadow: 0 0 20px #00ffee, inset 0 0 10px #00ffee !important;
            border: 2px solid #ffffff !important;
            transform: translateY(-5px) !important;
            transition: transform 0.1s ease-out !important;
        }

        #stat-minimal { font-size: 10px; color: #00ffee; display: flex; gap: 8px; font-weight: 900; margin-bottom: 2px; }
    `;
    document.head.appendChild(style);

    // ---------- HUD HTML ----------
    const hud = document.createElement('div');
    hud.id = 'hydroStealth';
    hud.innerHTML = `
        <div id="stat-minimal"><span id="f-fps">FPS: 0</span><span id="f-cps">CPS: 0</span></div>
        <div class="key-row">
            <div id="k-CapsLock" class="k k-tiny">CAPS</div>
            <div id="k-KeyE" class="k k-tiny">E</div>
            <div id="k-KeyW" class="k k-main">W</div>
            <div id="k-KeyC" class="k k-tiny">C</div>
        </div>
        <div class="key-row">
            <div id="k-ShiftLeft" class="k k-shift">SHIFT</div>
            <div id="k-KeyA" class="k k-main">A</div>
            <div id="k-KeyS" class="k k-main">S</div>
            <div id="k-KeyD" class="k k-main">D</div>
        </div>
        <div class="key-row">
            <div id="k-Space" class="k k-space">SPACE</div>
            <div id="k-LMB" class="k k-mouse">LMB <span id="c-l">0</span></div>
            <div id="k-RMB" class="k k-mouse">RMB <span id="c-r">0</span></div>
        </div>
    `;
    document.body.appendChild(hud);

    // ---------- MINIMALIST LOGIC (SAVES PERFORMANCE) ----------
    let lClicks = 0, rClicks = 0;

    // Use a single listener for all keys
    document.addEventListener('keydown', e => {
        const el = document.getElementById('k-' + e.code);
        if(el) el.classList.add('active');
    });
    document.addEventListener('keyup', e => {
        const el = document.getElementById('k-' + e.code);
        if(el) el.classList.remove('active');
    });

    document.addEventListener('mousedown', e => {
        if(e.button === 0) { document.getElementById('k-LMB').classList.add('active'); lClicks++; }
        if(e.button === 2) { document.getElementById('k-RMB').classList.add('active'); rClicks++; }
    });
    document.addEventListener('mouseup', e => {
        if(e.button === 0) document.getElementById('k-LMB').classList.remove('active');
        if(e.button === 2) document.getElementById('k-RMB').classList.remove('active');
    });

    // Update stats once per second (Very light)
    setInterval(() => {
        const fpsEl = document.getElementById('f-fps');
        if (fpsEl) {
            document.getElementById('f-cps').innerText = "CPS: " + (lClicks + rClicks);
            document.getElementById('c-l').innerText = lClicks;
            document.getElementById('c-r').innerText = rClicks;
            lClicks = 0; rClicks = 0;
        }
    }, 1000);

    // FPS Counter
    let frames = 0, lastTime = performance.now();
    function ticker(now) {
        frames++;
        if (now - lastTime >= 1000) {
            const fpsDisplay = document.getElementById('f-fps');
            if (fpsDisplay) fpsDisplay.innerText = "FPS: " + frames;
            frames = 0;
            lastTime = now;
        }
        requestAnimationFrame(ticker);
    }
    requestAnimationFrame(ticker);

    // Safety Check: Hide HUD if the game is loading or the screen is broken
    setInterval(() => {
        const hudEl = document.getElementById('hydroStealth');
        if (!hudEl) return;
        // If the crosshair is missing, you're likely dead or in a menu—dim the HUD to prevent "Breaking"
        const crosshair = document.querySelector('.CrossHair');
        hudEl.style.opacity = crosshair ? "0.9" : "0.2";
    }, 500);

})();