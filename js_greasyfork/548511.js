// ==UserScript==
// @license MIT
// @name         Bonk.io Mini Mod Menu + Aimbot 5 con Z
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Menú pequeño con switch y tecla Z que envía "/aimbot 5" para puntería perfecta en Death Arrows.
// @author       Tú
// @match        https://bonk.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548511/Bonkio%20Mini%20Mod%20Menu%20%2B%20Aimbot%205%20con%20Z.user.js
// @updateURL https://update.greasyfork.org/scripts/548511/Bonkio%20Mini%20Mod%20Menu%20%2B%20Aimbot%205%20con%20Z.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', () => {
        // --- Estilos ---
        const style = document.createElement('style');
        style.innerHTML = `
        /* Botón circular flotante (11×11 px) */
        #modToggleBtn {
            width: 11px;
            height: 11px;
            background-color: red;
            border-radius: 50%;
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 10000;
            cursor: pointer;
        }

        /* Menú flotante */
        #modMenu {
            position: fixed;
            bottom: 35px;
            right: 20px;
            width: 140px;
            background: rgba(0,0,0,0.8);
            padding: 8px;
            border-radius: 8px;
            color: white;
            font-family: sans-serif;
            font-size: 13px;
            z-index: 10000;
            display: none;
        }

        /* Switch estilo */
        .switch {
            position: relative;
            display: inline-block;
            width: 32px;
            height: 16px;
        }

        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 16px;
        }

        .slider:before {
            position: absolute;
            content: "";
            height: 12px;
            width: 12px;
            left: 2px;
            bottom: 2px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }

        input:checked + .slider {
            background-color: #4caf50;
        }

        input:checked + .slider:before {
            transform: translateX(16px);
        }
        `;
        document.head.appendChild(style);

        // --- Botón circular ---
        const toggleBtn = document.createElement('div');
        toggleBtn.id = 'modToggleBtn';
        document.body.appendChild(toggleBtn);

        // --- Menú con switch ---
        const menu = document.createElement('div');
        menu.id = 'modMenu';
        menu.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;">
                <span>Aimbot</span>
                <label class="switch">
                  <input type="checkbox" id="aimbotSwitch">
                  <span class="slider"></span>
                </label>
            </div>
        `;
        document.body.appendChild(menu);

        // --- Mostrar u ocultar el menú ---
        let menuVisible = false;
        toggleBtn.addEventListener('click', () => {
            menuVisible = !menuVisible;
            menu.style.display = menuVisible ? 'block' : 'none';
        });

        // --- Lógica del switch ---
        const aimbotSwitch = document.getElementById('aimbotSwitch');
        const toggleAimbot = () => {
            if (aimbotSwitch.checked) {
                console.log("Aimbot PERFECTO ACTIVADO");
                window.gameChat && window.gameChat.sendChat("/aimbot 5");
            } else {
                console.log("Aimbot PERFECTO DESACTIVADO");
                window.gameChat && window.gameChat.sendChat("/aimbot 5");
            }
        };
        aimbotSwitch.addEventListener('change', toggleAimbot);

        // --- Tecla Z para alternar ---
        document.addEventListener('keydown', function(event) {
            if (event.key === 'z' || event.key === 'Z') {
                aimbotSwitch.checked = !aimbotSwitch.checked;
                toggleAimbot();
            }
        });
    });
})();
