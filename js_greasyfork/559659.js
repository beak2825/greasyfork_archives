// ==UserScript==
// @name         IMMORTAL DEMON v14.5 – THE OVERLORD ASCENDS
// @namespace    http://tampermonkey.net/
// @version      14.5
// @description  Pro PvP Crosshair Size, Visual Fixes, and Demon Arrival Message.
// @author       IMMORTAL_DEMON
// @match        *://bloxd.io/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559659/IMMORTAL%20DEMON%20v145%20%E2%80%93%20THE%20OVERLORD%20ASCENDS.user.js
// @updateURL https://update.greasyfork.org/scripts/559659/IMMORTAL%20DEMON%20v145%20%E2%80%93%20THE%20OVERLORD%20ASCENDS.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 1. THE CHAT ANNOUNCEMENT ---
    const sendDemonMessage = () => {
        const chatInput = document.querySelector(".ChatInput") || document.querySelector('input[class*="Chat"]');
        if (chatInput) {
            console.log("%c IMMORTAL DEMON V14.5 LOADED ", "background: #000; color: #ff0000; font-size: 20px; font-weight: bold;");
            // This displays only for YOU to confirm the script is active
            const notify = document.createElement('div');
            notify.innerHTML = "SYSTEM: <span style='color:gold; font-weight:bold;'>IMMORTAL_DEMON v14.5</span> <span style='color:red;'>STRIKE MODE ACTIVE</span>";
            notify.style = "position:fixed; top:20px; right:20px; background:rgba(0,0,0,0.8); padding:10px; border-left:4px solid red; z-index:1000001; font-family:monospace; color:white;";
            document.body.appendChild(notify);
            setTimeout(() => notify.remove(), 5000);
        }
    };

    const style = document.createElement('style');
    style.innerHTML = `
        /* --- 2. THE HOTBAR FIX --- */
        [class*="ExperienceBar"], .ExperienceBar {
            margin-bottom: 25px !important;
            z-index: 100 !important;
        }

        .Selected, [class*="Selected"], [style*="border: 2px solid white"] {
            background-color: rgba(180, 0, 0, 0.4) !important;
            border: 2px solid #ffd700 !important;
            box-shadow: 0 0 15px rgba(255, 0, 0, 0.8), inset 0 0 10px rgba(255, 215, 0, 0.5) !important;
            transform: translateY(-6px) scale(1.1) !important;
            border-radius: 4px !important;
        }

        [class*="ExperienceBar"] div {
            background: #ff6600 !important;
            box-shadow: 0 0 15px #ff6600 !important;
        }

        /* --- 3. 10000% PRO PVP CROSSHAIR --- */
        .CrossHair, [class*="CrossHair"] {
            background-image: none !important;
            background-color: #ff0000 !important;
            width: 6px !important;
            height: 6px !important;
            border: 2px solid #ffffff !important;
            border-radius: 0px !important;
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            box-shadow: 0 0 8px #ff0000 !important;
            z-index: 2000000 !important;
            pointer-events: none !important;
        }

        /* --- 4. THE KEY HUD --- */
        #demonPlate {
            position: fixed; bottom: 20px; left: 20px;
            display: flex; flex-direction: column; gap: 5px;
            z-index: 1000000; pointer-events: none;
            font-family: 'Arial Black', sans-serif;
        }
        .shard {
            background: #0a0a0a; border-left: 2px solid #900; border-bottom: 2px solid #900;
            color: #ff0000; clip-path: polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%);
            display: flex; align-items: center; justify-content: center; font-weight: 900;
        }
        .s-main { width: 44px; height: 44px; font-size: 16px; }
        .s-tiny { width: 32px; height: 32px; font-size: 9px; }
        .s-long { width: 60px; height: 38px; font-size: 11px; }
        .s-space { width: 110px; height: 24px; font-size: 10px; }
        .s-mouse { width: 80px; height: 50px; flex-direction: column; font-size: 12px; }
        .counter-val { color: gold !important; font-size: 15px !important; }

        .incinerate {
            background: #ff0000 !important; color: #fff !important;
            box-shadow: 0 0 20px #ff0000; transform: translateY(3px);
            clip-path: none !important;
        }
    `;
    document.head.appendChild(style);

    const hud = document.createElement('div');
    hud.id = 'demonPlate';
    hud.innerHTML = `
        <div style="color:gold; font-size:10px; margin-bottom:2px;">DEMON_CLIENT_V14.5</div>
        <div style="display:flex; gap:5px;">
            <div id="k-CapsLock" class="shard s-tiny">CAPS</div>
            <div id="k-KeyE" class="shard s-tiny">E</div>
            <div id="k-KeyW" class="shard s-main">W</div>
            <div id="k-KeyC" class="shard s-tiny">C</div>
        </div>
        <div style="display:flex; gap:5px;">
            <div id="k-ShiftLeft" class="shard s-long">SHIFT</div>
            <div id="k-KeyA" class="shard s-main">A</div>
            <div id="k-KeyS" class="shard s-main">S</div>
            <div id="k-KeyD" class="shard s-main">D</div>
        </div>
        <div style="display:flex; gap:5px;">
            <div id="k-Space" class="shard s-space">SPACE</div>
            <div id="k-LMB" class="shard s-mouse">LMB <span id="c-l" class="counter-val">0</span></div>
            <div id="k-RMB" class="shard s-mouse">RMB <span id="c-r" class="counter-val">0</span></div>
        </div>
    `;
    document.body.appendChild(hud);

    // --- LOGIC ---
    let l = 0, r = 0;
    window.addEventListener('mousedown', (e) => {
        if (e.button === 0) { document.getElementById('k-LMB').classList.add('incinerate'); l++; }
        if (e.button === 2) { document.getElementById('k-RMB').classList.add('incinerate'); r++; }
    });
    window.addEventListener('mouseup', (e) => {
        if (e.button === 0) document.getElementById('k-LMB').classList.remove('incinerate');
        if (e.button === 2) document.getElementById('k-RMB').classList.remove('incinerate');
    });
    window.addEventListener('keydown', (e) => {
        const k = document.getElementById('k-' + e.code);
        if (k) k.classList.add('incinerate');
    });
    window.addEventListener('keyup', (e) => {
        const k = document.getElementById('k-' + e.code);
        if (k) k.classList.remove('incinerate');
    });

    setInterval(() => {
        document.getElementById('c-l').innerText = l;
        document.getElementById('c-r').innerText = r;
        l = 0; r = 0;
    }, 1000);

    // Run the load message once the game is ready
    setTimeout(sendDemonMessage, 3000);
})();