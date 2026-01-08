// ==UserScript==
// @name         better eaglercraft fr
// @version      2.0
// @description  this is very good fr
// @match        *://*/*
// @namespace https://greasyfork.org/users/1547770
// @downloadURL https://update.greasyfork.org/scripts/561782/better%20eaglercraft%20fr.user.js
// @updateURL https://update.greasyfork.org/scripts/561782/better%20eaglercraft%20fr.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const SITE_KEY = "NN_AC_SETTINGS_" + location.hostname;

    // -----------------------------
    // Load saved settings
    // -----------------------------
    let saved = JSON.parse(localStorage.getItem(SITE_KEY) || "{}");

    let mouseX = 0, mouseY = 0;

    // Core state (autoclicker always starts OFF)
    let leftEnabled = false;
    let rightEnabled = false;

    let leftHeld = false;
    let rightHeld = false;

    // Load or default
    let leftCPS = saved.leftCPS ?? 10;
    let rightCPS = saved.rightCPS ?? 10;

    let leftKey = saved.leftKey ?? "KeyR";
    let rightKey = saved.rightKey ?? "KeyF";

    let leftMode = saved.leftMode ?? "toggle";
    let rightMode = saved.rightMode ?? "toggle";

    let menuOpen = false;

    document.addEventListener("mousemove", e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }, { passive: true });

    // -----------------------------
    // Save function
    // -----------------------------
    function save() {
        localStorage.setItem(SITE_KEY, JSON.stringify({
            leftCPS,
            rightCPS,
            leftKey,
            rightKey,
            leftMode,
            rightMode
        }));
    }

    // -----------------------------
    // Menu UI
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
        width: 320px;
        display: none;
        box-shadow: 0 10px 30px rgba(0,0,0,0.6);
        border: 1px solid rgba(255,255,255,0.08);
    `;

    menu.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <div style="font-weight:600;font-size:14px;">NotNightmare Autoclicker</div>
            <div style="font-size:11px;opacity:0.7;">CapsLock + X</div>
        </div>

        <div style="margin-bottom:10px;font-size:11px;opacity:0.8;">
            Settings are saved per-site. Reloading will NOT reset anything.
        </div>

        <!-- LEFT CLICK -->
        <div style="margin-bottom:10px;padding:8px;border-radius:8px;background:rgba(255,255,255,0.03);">
            <div style="font-weight:600;margin-bottom:4px;">Left Click</div>

            <div style="margin-top:6px;display:flex;gap:6px;align-items:center;">
                <span style="font-size:11px;opacity:0.8;">Key:</span>
                <select id="leftKeySelect" style="flex:1;padding:2px 4px;font-size:12px;border-radius:4px;background:rgba(0,0,0,0.4);color:white;"></select>
                <select id="leftModeSelect" style="flex:1;padding:2px 4px;font-size:12px;border-radius:4px;background:rgba(0,0,0,0.4);color:white;">
                    <option value="toggle">Toggle</option>
                    <option value="hold">Hold</option>
                </select>
            </div>

            <div style="margin-top:6px;">
                <input type="range" id="leftSlider" min="0" max="500" style="width:100%;">
                <div style="display:flex;justify-content:space-between;font-size:11px;opacity:0.8;">
                    <span>Speed</span>
                    <span id="leftLabel"></span>
                </div>
            </div>
        </div>

        <!-- RIGHT CLICK -->
        <div style="margin-bottom:10px;padding:8px;border-radius:8px;background:rgba(255,255,255,0.03);">
            <div style="font-weight:600;margin-bottom:4px;">Right Click</div>

            <div style="margin-top:6px;display:flex;gap:6px;align-items:center;">
                <span style="font-size:11px;opacity:0.8;">Key:</span>
                <select id="rightKeySelect" style="flex:1;padding:2px 4px;font-size:12px;border-radius:4px;background:rgba(0,0,0,0.4);color:white;"></select>
                <select id="rightModeSelect" style="flex:1;padding:2px 4px;font-size:12px;border-radius:4px;background:rgba(0,0,0,0.4);color:white;">
                    <option value="toggle">Toggle</option>
                    <option value="hold">Hold</option>
                </select>
            </div>

            <div style="margin-top:6px;">
                <input type="range" id="rightSlider" min="0" max="500" style="width:100%;">
                <div style="display:flex;justify-content:space-between;font-size:11px;opacity:0.8;">
                    <span>Speed</span>
                    <span id="rightLabel"></span>
                </div>
            </div>
        </div>

        <div style="font-size:10px;opacity:0.7;text-align:center;">
            Mouse buttons only toggle if selected above.
        </div>
    `;

    document.body.appendChild(menu);

    // Elements
    const leftSlider = menu.querySelector("#leftSlider");
    const rightSlider = menu.querySelector("#rightSlider");
    const leftLabel = menu.querySelector("#leftLabel");
    const rightLabel = menu.querySelector("#rightLabel");
    const leftKeySelect = menu.querySelector("#leftKeySelect");
    const rightKeySelect = menu.querySelector("#rightKeySelect");
    const leftModeSelect = menu.querySelector("#leftModeSelect");
    const rightModeSelect = menu.querySelector("#rightModeSelect");

    // Populate key dropdowns
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    function addOption(select, value, label) {
        const opt = document.createElement("option");
        opt.value = value;
        opt.textContent = label;
        select.appendChild(opt);
    }

    addOption(leftKeySelect, "MOUSE_LEFT", "Left Mouse Button");
    addOption(leftKeySelect, "MOUSE_RIGHT", "Right Mouse Button");
    addOption(rightKeySelect, "MOUSE_LEFT", "Left Mouse Button");
    addOption(rightKeySelect, "MOUSE_RIGHT", "Right Mouse Button");

    for (const ch of letters) {
        addOption(leftKeySelect, "Key" + ch, ch);
        addOption(rightKeySelect, "Key" + ch, ch);
    }

    // Load UI state
    leftKeySelect.value = leftKey;
    rightKeySelect.value = rightKey;
    leftModeSelect.value = leftMode;
    rightModeSelect.value = rightMode;

    leftSlider.value = leftCPS;
    rightSlider.value = rightCPS;

    leftLabel.textContent = leftCPS === 0 ? "Hold spam" : `${leftCPS} CPS`;
    rightLabel.textContent = rightCPS === 0 ? "Hold spam" : `${rightCPS} CPS`;

    // Handlers
    leftSlider.oninput = () => {
        leftCPS = Number(leftSlider.value);
        leftLabel.textContent = leftCPS === 0 ? "Hold spam" : `${leftCPS} CPS`;
        save();
    };

    rightSlider.oninput = () => {
        rightCPS = Number(rightSlider.value);
        rightLabel.textContent = rightCPS === 0 ? "Hold spam" : `${rightCPS} CPS`;
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

    // -----------------------------
    // Keyboard keybinds
    // -----------------------------
    document.addEventListener("keydown", e => {
        // MENU: CapsLock + X
        if (e.getModifierState("CapsLock") && e.code === "KeyX") {
            menuOpen = !menuOpen;
            menu.style.display = menuOpen ? "block" : "none";
        }

        // LEFT
        if (e.code === leftKey) {
            if (leftMode === "toggle") {
                leftEnabled = !leftEnabled;
            } else if (leftMode === "hold") {
                leftHeld = true;
            }
        }

        // RIGHT
        if (e.code === rightKey) {
            if (rightMode === "toggle") {
                rightEnabled = !rightEnabled;
            } else if (rightMode === "hold") {
                rightHeld = true;
            }
        }
    });

    document.addEventListener("keyup", e => {
        if (e.code === leftKey && leftMode === "hold") leftHeld = false;
        if (e.code === rightKey && rightMode === "hold") rightHeld = false;
    });

    // -----------------------------
    // Mouse button keybinds (Option A)
    // -----------------------------
    document.addEventListener("pointerdown", e => {
        if (leftKey === "MOUSE_LEFT" && e.button === 0) {
            if (leftMode === "toggle") leftEnabled = !leftEnabled;
            else leftHeld = true;
        }

        if (rightKey === "MOUSE_RIGHT" && e.button === 2) {
            if (rightMode === "toggle") rightEnabled = !rightEnabled;
            else rightHeld = true;
        }
    });

    document.addEventListener("pointerup", e => {
        if (leftKey === "MOUSE_LEFT" && e.button === 0 && leftMode === "hold") leftHeld = false;
        if (rightKey === "MOUSE_RIGHT" && e.button === 2 && rightMode === "hold") rightHeld = false;
    });

    document.addEventListener("contextmenu", e => {
        if (rightKey === "MOUSE_RIGHT") e.preventDefault();
    });

    // -----------------------------
    // Click simulation
    // -----------------------------
    function fireClick(button) {
        const el = document.elementFromPoint(mouseX, mouseY);
        if (!el) return;

        ["mousedown", "mouseup", "click"].forEach(type => {
            el.dispatchEvent(new MouseEvent(type, {
                bubbles: true,
                cancelable: true,
                clientX: mouseX,
                clientY: mouseY,
                button
            }));
        });
    }

    // -----------------------------
    // Autoclick loop
    // -----------------------------
    let lastLeft = 0;
    let lastRight = 0;

    function loop(t) {
        if (leftEnabled || (leftMode === "hold" && leftHeld)) {
            if (leftCPS === 0) fireClick(0);
            else if (t - lastLeft >= 1000 / leftCPS) {
                fireClick(0);
                lastLeft = t;
            }
        }

        if (rightEnabled || (rightMode === "hold" && rightHeld)) {
            if (rightCPS === 0) fireClick(2);
            else if (t - lastRight >= 1000 / rightCPS) {
                fireClick(2);
                lastRight = t;
            }
        }

        requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
})();
