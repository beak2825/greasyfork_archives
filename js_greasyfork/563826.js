    // ==UserScript==
    // @name         Cyber Tanks HUD + Toggles Demo
    // @namespace    http://tampermonkey.net/
    // @version      1.2-DEMO
    // @description  Stripped version of my script
    // @match        *://xigency.herokuapp.com/*
    // @grant        unsafeWindow
    // @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563826/Cyber%20Tanks%20HUD%20%2B%20Toggles%20Demo.user.js
// @updateURL https://update.greasyfork.org/scripts/563826/Cyber%20Tanks%20HUD%20%2B%20Toggles%20Demo.meta.js
    // ==/UserScript==
     
    (function () {
        'use strict';
     
        const w = unsafeWindow;
     
        let jumpEnabled = false;
     
        let currentSpeed = w.TANK_FORWARD_SPEED;
     
        function waitForGame() {
            if (w.tanks && w.tanks[0] && w.socket?.json?.send) {
                init();
            } else {
                setTimeout(waitForGame, 100);
            }
        }
     
        function init() {
            const tank = w.tanks[0];
     
            // ===== CHAT BOX =====
            const chat = document.createElement('input');
            chat.placeholder = 'Unavailable in Demo';
            chat.style.cssText = `
                position: fixed;
                bottom: 10px;
                left: 10px;
                width: 250px;
                padding: 6px;
                background: #111;
                color: #0f0;
                border: 1px solid #0f0;
                font-family: monospace;
                z-index: 9999;
            `;
            document.body.appendChild(chat);
     
            // ===== HUD =====
            const hud = document.createElement('div');
            hud.style.cssText = `
                position: fixed;
                bottom: 52px;
                left: 10px;
                color: white;
                font-family: monospace;
                font-size: 14px;
                pointer-events: none;
                z-index: 9999;
                text-shadow:
                    -1px -1px 0 #000,
                     1px -1px 0 #000,
                    -1px  1px 0 #000,
                     1px  1px 0 #000;
            `;
            document.body.appendChild(hud);
     
            function updateHUD() {
                hud.textContent =
                    `Jump: ${jumpEnabled ? 'ON' : 'OFF'}`
            }
     
            updateHUD();
     
            // ===== KEYBINDS =====
            window.addEventListener('keydown', e => {
                if (e.target === chat) return;
     
                switch (e.key.toLowerCase()) {
                    case 'h':
                        jumpEnabled = !jumpEnabled;
                        updateHUD();
                        break;
                }
            });
     
            // Object to store key states
            const keyStates = {};
     
            // Listen for key down
            window.addEventListener('keydown', (e) => {
                keyStates[e.key.toLowerCase()] = true; // store key as lowercase
            });
     
            // Listen for key up
            window.addEventListener('keyup', (e) => {
                keyStates[e.key.toLowerCase()] = false;
            });
     
     
            setInterval(() => {
                if (!tank || !tank.vel) return;
     
                // --- JUMP (non-fly) ---
                if (jumpEnabled && keyStates.e) {
                    tank.vel[1] = 25;
                }
                updateHUD();
     
            }, 50); // 20 times/sec
        }
     
        waitForGame();
    })();

