// ==UserScript==
// @name         BuildNowGG Aimbot GUI (Educational Example) with Custom BG & Hotkey
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Educational GUI example for BuildNowGG with custom anime-style background and '/' hotkey toggle
// @author       16saiph (w/ permission from game owner)
// @match        https://buildnow-gg.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549751/BuildNowGG%20Aimbot%20GUI%20%28Educational%20Example%29%20with%20Custom%20BG%20%20Hotkey.user.js
// @updateURL https://update.greasyfork.org/scripts/549751/BuildNowGG%20Aimbot%20GUI%20%28Educational%20Example%29%20with%20Custom%20BG%20%20Hotkey.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Direct image URL (replace with your own if hosting elsewhere)
    const imgUrl = 'https://i.imgur.com/B9eSAfT.jpg'; // Replace this with your own hosted version if needed

    // Styles for GUI
    const style = document.createElement('style');
    style.textContent = `
    #aimbot-gui-container {
        position: fixed;
        top: 80px;
        left: 20px;
        z-index: 9999;
        background: url('${imgUrl}') center/cover, #23272a;
        color: #fff;
        padding: 16px 20px;
        border-radius: 10px;
        min-width: 260px;
        font-family: 'Segoe UI', Arial, sans-serif;
        box-shadow: 0 7px 32px #0008;
        transition: opacity 0.3s, top 0.3s;
        opacity: 1;
        display: block;
    }
    #aimbot-gui-container.aimbot-gui-hidden {
        opacity: 0;
        pointer-events: none;
    }
    #aimbot-gui-tabs {
        display: flex;
        gap: 6px;
        margin-bottom: 10px;
    }
    .aimbot-gui-tab {
        background: #2c2f33dd;
        border: none;
        color: #fff;
        padding: 6px 16px;
        border-radius: 6px 6px 0 0;
        cursor: pointer;
        font-size: 13px;
        outline: none;
        transition: background 0.2s;
    }
    .aimbot-gui-tab.active {
        background: #7289daee;
        color: #fff;
    }
    .aimbot-gui-panel {
        display: none;
        margin-top: 6px;
        background: rgba(35,39,42,0.7);
        padding: 6px 0;
        border-radius: 6px;
    }
    .aimbot-gui-panel.active {
        display: block;
    }
    .aimbot-gui-slider {
        width: 100%;
    }
    .aimbot-gui-row {
        margin-bottom: 10px;
    }
    #aimbot-gui-hide {
        position: absolute;
        right: 8px;
        top: 8px;
        background: #23272a99;
        color: #fff;
        border: none;
        font-size: 15px;
        cursor: pointer;
        border-radius: 4px;
        z-index: 2;
    }
    `;
    document.head.appendChild(style);

    // HTML Structure
    const gui = document.createElement('div');
    gui.id = 'aimbot-gui-container';
    gui.innerHTML = `
        <button id="aimbot-gui-hide">▼</button>
        <div id="aimbot-gui-tabs">
            <button class="aimbot-gui-tab active" data-tab="aimbot">Aimbot</button>
            <button class="aimbot-gui-tab" data-tab="settings">Settings</button>
            <button class="aimbot-gui-tab" data-tab="colour">Colour</button>
            <button class="aimbot-gui-tab" data-tab="fly">Fly</button>
        </div>
        <div id="aimbot-gui-tab-panels">
            <div class="aimbot-gui-panel active" data-panel="aimbot">
                <div class="aimbot-gui-row">
                    <label><input type="checkbox" id="aimbot-enable"> Enable Aimbot</label>
                </div>
                <div class="aimbot-gui-row">
                    <label><input type="checkbox" id="wallbang-enable"> Enable Wallbang</label>
                </div>
                <div class="aimbot-gui-row">
                    <label><input type="checkbox" id="fov-show"> Show FOV</label>
                </div>
                <div class="aimbot-gui-row">
                    <label for="fov-size">FOV Size:</label>
                    <input type="range" min="10" max="300" value="90" id="fov-size" class="aimbot-gui-slider">
                    <span id="fov-size-value">90</span>
                </div>
            </div>
            <div class="aimbot-gui-panel" data-panel="settings">
                <div class="aimbot-gui-row">
                    <label>Sensitivity: <input type="range" min="1" max="10" value="5" id="sens-slider"></label>
                </div>
                <div class="aimbot-gui-row">
                    <label>Keybinds (N/A):</label>
                </div>
            </div>
            <div class="aimbot-gui-panel" data-panel="colour">
                <div class="aimbot-gui-row">
                    <label for="fov-colour">FOV Colour:</label>
                    <input type="color" id="fov-colour" value="#00ff00">
                </div>
                <div class="aimbot-gui-row">
                    <label for="aimbot-colour">Aimbot ESP Colour:</label>
                    <input type="color" id="aimbot-colour" value="#ff0000">
                </div>
            </div>
            <div class="aimbot-gui-panel" data-panel="fly">
                <div class="aimbot-gui-row">
                    <label><input type="checkbox" id="fly-enable"> Enable Fly Mode</label>
                </div>
                <div class="aimbot-gui-row">
                    <label for="fly-speed">Fly Speed:</label>
                    <input type="range" min="1" max="20" value="5" id="fly-speed" class="aimbot-gui-slider">
                    <span id="fly-speed-value">5</span>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(gui);

    // Tab switching logic
    document.querySelectorAll('.aimbot-gui-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.aimbot-gui-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.aimbot-gui-panel').forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            document.querySelector(`.aimbot-gui-panel[data-panel="${tab.dataset.tab}"]`).classList.add('active');
        });
    });

    // Hide GUI (slide down/up)
    let guiVisible = true;
    document.getElementById('aimbot-gui-hide').onclick = function() {
        if(guiVisible) {
            gui.style.top = "calc(100% - 40px)";
            this.textContent = "▲";
        } else {
            gui.style.top = "80px";
            this.textContent = "▼";
        }
        guiVisible = !guiVisible;
    };

    // Hotkey '/' to toggle GUI open/close
    document.addEventListener('keydown', function(e) {
        // Avoid if typing in input or textarea
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
        if (e.key === '/') {
            gui.classList.toggle('aimbot-gui-hidden');
        }
    });

    // Live update for FOV Size & Fly Speed
    document.getElementById('fov-size').oninput = function() {
        document.getElementById('fov-size-value').textContent = this.value;
    };
    document.getElementById('fly-speed').oninput = function() {
        document.getElementById('fly-speed-value').textContent = this.value;
    };

    // --- FEATURE IMPLEMENTATION (GUI logic and FOV circle only, no game modification) ---
    // Show/hide a FOV circle overlay
    let fovCircle = null;
    function updateFovCircle() {
        if (!fovCircle) {
            fovCircle = document.createElement('div');
            fovCircle.style.position = 'fixed';
            fovCircle.style.pointerEvents = 'none';
            fovCircle.style.zIndex = 9998;
            document.body.appendChild(fovCircle);
        }
        const size = Number(document.getElementById('fov-size').value);
        fovCircle.style.width = size + 'px';
        fovCircle.style.height = size + 'px';
        fovCircle.style.left = `calc(50vw - ${size / 2}px)`;
        fovCircle.style.top = `calc(50vh - ${size / 2}px)`;
        fovCircle.style.border = '2px solid ' + document.getElementById('fov-colour').value;
        fovCircle.style.borderRadius = '50%';
        fovCircle.style.background = 'transparent';
        fovCircle.style.display = document.getElementById('fov-show').checked ? 'block' : 'none';
    }
    document.getElementById('fov-show').addEventListener('change', updateFovCircle);
    document.getElementById('fov-size').addEventListener('input', updateFovCircle);
    document.getElementById('fov-colour').addEventListener('input', updateFovCircle);

    // Keep FOV circle in sync with GUI toggle
    updateFovCircle();

    // Dummy feature toggles (educational, no actual aimbot/fly/wallbang logic)
    document.getElementById('aimbot-enable').onchange = function() {
        alert("Aimbot logic would be enabled/disabled here (not implemented for safety and ethics).");
    };
    document.getElementById('wallbang-enable').onchange = function() {
        alert("Wallbang logic would be enabled/disabled here (not implemented for safety and ethics).");
    };
    document.getElementById('fly-enable').onchange = function() {
        alert("Fly mode logic would be enabled/disabled here (not implemented for safety and ethics).");
    };

    // Optional: Save/load settings to localStorage for persistence
    // (Example for FOV size)
    const fovSizeSlider = document.getElementById('fov-size');
    if (localStorage.getItem('bn_fov_size')) {
        fovSizeSlider.value = localStorage.getItem('bn_fov_size');
        document.getElementById('fov-size-value').textContent = fovSizeSlider.value;
        updateFovCircle();
    }
    fovSizeSlider.addEventListener('input', function() {
        localStorage.setItem('bn_fov_size', this.value);
    });

})();