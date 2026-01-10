// ==UserScript==
// @name         cool thingy
// @version      1.0
// @description  not ai
// @match        *://*/*
// @namespace https://greasyfork.org/users/1547770
// @downloadURL https://update.greasyfork.org/scripts/562037/cool%20thingy.user.js
// @updateURL https://update.greasyfork.org/scripts/562037/cool%20thingy.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const SITE_KEY = "NN_SETTINGS_" + location.hostname;

    // Load saved settings
    let saved = JSON.parse(localStorage.getItem(SITE_KEY) || "{}");

    // Core states
    let frozen = false;
    let masterEnabled = false;

    // Settings
    let masterKey = saved.masterKey ?? "Backquote";
    let leftKey = saved.leftKey ?? "KeyR";
    let rightKey = saved.rightKey ?? "KeyF";

    let leftMode = saved.leftMode ?? "toggle";
    let rightMode = saved.rightMode ?? "toggle";

    let leftCPS = saved.leftCPS ?? 10;
    let rightCPS = saved.rightCPS ?? 10;

    // Save function
    function save() {
        localStorage.setItem(SITE_KEY, JSON.stringify({
            masterKey,
            leftKey,
            rightKey,
            leftMode,
            rightMode,
            leftCPS,
            rightCPS
        }));
    }

    // -----------------------------
    // Build menu
    // -----------------------------
    const menu = document.createElement("div");
    menu.style = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(10,10,10,0.92);
        backdrop-filter: blur(12px);
        padding: 18px 20px;
        border-radius: 12px;
        color: white;
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 13px;
        z-index: 999999;
        width: 330px;
        display: none;
        box-shadow: 0 10px 30px rgba(0,0,0,0.6);
        border: 1px solid rgba(255,255,255,0.08);
    `;

    menu.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
            <div style="font-weight:600;font-size:14px;">NotNightmare Client</div>
            <div style="font-size:11px;opacity:0.7;">CapsLock + X</div>
        </div>

        <div style="margin-bottom:12px;font-size:11px;opacity:0.8;">
            Settings are saved per-site. Freeze key is always Backquote (&#96;).
        </div>

        <!-- MASTER ENABLE -->
        <div style="margin-bottom:12px;padding:8px;border-radius:8px;background:rgba(255,255,255,0.03);">
            <div style="font-weight:600;margin-bottom:4px;">Master Enable Key</div>
            <select id="masterKeySelect" style="width:100%;padding:4px;font-size:12px;border-radius:4px;background:rgba(0,0,0,0.4);color:white;"></select>
        </div>

        <!-- LEFT CLICK -->
        <div style="margin-bottom:12px;padding:8px;border-radius:8px;background:rgba(255,255,255,0.03);">
            <div style="font-weight:600;margin-bottom:4px;">Left Action</div>
            <div style="display:flex;gap:6px;margin-bottom:6px;">
                <select id="leftKeySelect" style="flex:1;padding:4px;font-size:12px;border-radius:4px;background:rgba(0,0,0,0.4);color:white;"></select>
                <select id="leftModeSelect" style="flex:1;padding:4px;font-size:12px;border-radius:4px;background:rgba(0,0,0,0.4);color:white;">
                    <option value="toggle">Toggle</option>
                    <option value="hold">Hold</option>
                </select>
            </div>
            <input type="range" id="leftSlider" min="0" max="500" style="width:100%;">
            <div style="display:flex;justify-content:space-between;font-size:11px;opacity:0.8;">
                <span>Speed</span>
                <span id="leftLabel"></span>
            </div>
        </div>

        <!-- RIGHT CLICK -->
        <div style="margin-bottom:12px;padding:8px;border-radius:8px;background:rgba(255,255,255,0.03);">
            <div style="font-weight:600;margin-bottom:4px;">Right Action</div>
            <div style="display:flex;gap:6px;margin-bottom:6px;">
                <select id="rightKeySelect" style="flex:1;padding:4px;font-size:12px;border-radius:4px;background:rgba(0,0,0,0.4);color:white;"></select>
                <select id="rightModeSelect" style="flex:1;padding:4px;font-size:12px;border-radius:4px;background:rgba(0,0,0,0.4);color:white;">
                    <option value="toggle">Toggle</option>
                    <option value="hold">Hold</option>
                </select>
            </div>
            <input type="range" id="rightSlider" min="0" max="500" style="width:100%;">
            <div style="display:flex;justify-content:space-between;font-size:11px;opacity:0.8;">
                <span>Speed</span>
                <span id="rightLabel"></span>
            </div>
        </div>

        <div style="font-size:10px;opacity:0.7;text-align:center;">
            Freeze Key: Backquote (&#96;) — cannot be changed.
        </div>
    `;

    document.body.appendChild(menu);

    // -----------------------------
    // Populate dropdowns
    // -----------------------------
    const masterKeySelect = menu.querySelector("#masterKeySelect");
    const leftKeySelect = menu.querySelector("#leftKeySelect");
    const rightKeySelect = menu.querySelector("#rightKeySelect");

    const leftModeSelect = menu.querySelector("#leftModeSelect");
    const rightModeSelect = menu.querySelector("#rightModeSelect");

    const leftSlider = menu.querySelector("#leftSlider");
    const rightSlider = menu.querySelector("#rightSlider");

    const leftLabel = menu.querySelector("#leftLabel");
    const rightLabel = menu.querySelector("#rightLabel");

    // Human-friendly key list
    const keyMap = {
        "Backquote": "Backquote (`)",
        "Space": "Space",
        "Enter": "Enter",
        "Tab": "Tab",
        "Escape": "Escape",
        "ArrowUp": "Arrow Up",
        "ArrowDown": "Arrow Down",
        "ArrowLeft": "Arrow Left",
        "ArrowRight": "Arrow Right",
        "MouseLeft": "Left Mouse Button",
        "MouseRight": "Right Mouse Button",
        "MouseMiddle": "Middle Mouse Button",
        "MouseBack": "Mouse Back Button",
        "MouseForward": "Mouse Forward Button"
    };

    // Add A–Z
    for (let i = 65; i <= 90; i++) {
        const code = "Key" + String.fromCharCode(i);
        keyMap[code] = String.fromCharCode(i);
    }

    // Add F1–F12
    for (let i = 1; i <= 12; i++) {
        keyMap["F" + i] = "F" + i;
    }

    // Add all keys to dropdowns
    function populate(select) {
        for (const code in keyMap) {
            const opt = document.createElement("option");
            opt.value = code;
            opt.textContent = keyMap[code];
            select.appendChild(opt);
        }
    }

    populate(masterKeySelect);
    populate(leftKeySelect);
    populate(rightKeySelect);

    // Load saved values
    masterKeySelect.value = masterKey;
    leftKeySelect.value = leftKey;
    rightKeySelect.value = rightKey;

    leftModeSelect.value = leftMode;
    rightModeSelect.value = rightMode;

    leftSlider.value = leftCPS;
    rightSlider.value = rightCPS;

    leftLabel.textContent = leftCPS + " CPS";
    rightLabel.textContent = rightCPS + " CPS";

    // -----------------------------
    // Menu toggle
    // -----------------------------
    let menuOpen = false;

    document.addEventListener("keydown", e => {
        // Freeze key (always works)
        if (e.code === "Backquote") {
            frozen = !frozen;
            return;
        }

        if (frozen) return;

        // Menu toggle
        if (e.getModifierState("CapsLock") && e.code === "KeyX") {
            menuOpen = !menuOpen;
            menu.style.display = menuOpen ? "block" : "none";
        }

        // Master enable toggle
        if (e.code === masterKey) {
            masterEnabled = !masterEnabled;
            return;
        }
    });

    // -----------------------------
    // Save handlers
    // -----------------------------
    masterKeySelect.onchange = () => {
        masterKey = masterKeySelect.value;
        save();
    };

    leftKeySelect.onchange = () => {
        leftKey = leftKeySelect.value;
        save();
    };

    rightKeySelect.onchange = () => {
        rightKey = rightKeySelect.value;
        save();
    };

    leftModeSelect.onchange = () => {
        leftMode = leftModeSelect.value;
        save();
    };

    rightModeSelect.onchange = () => {
        rightMode = rightModeSelect.value;
        save();
    };

    leftSlider.oninput = () => {
        leftCPS = Number(leftSlider.value);
        leftLabel.textContent = leftCPS + " CPS";
        save();
    };

    rightSlider.oninput = () => {
        rightCPS = Number(rightSlider.value);
        rightLabel.textContent = rightCPS + " CPS";
        save();
    };

})();
