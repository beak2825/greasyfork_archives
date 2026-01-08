// ==UserScript==
// @name         NotNightmare Autoclicker (Keyboard + Mouse Keybinds)
// @version      1.1
// @description  Fully configurable left/right autoclicker with A–Z keys + mouse button keybinds. Toggle/Hold modes. iPad-friendly.
// @match        *://*/*
// @namespace https://greasyfork.org/users/1547770
// @downloadURL https://update.greasyfork.org/scripts/561779/NotNightmare%20Autoclicker%20%28Keyboard%20%2B%20Mouse%20Keybinds%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561779/NotNightmare%20Autoclicker%20%28Keyboard%20%2B%20Mouse%20Keybinds%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let mouseX = 0, mouseY = 0;

    // Core state
    let leftEnabled = false;
    let rightEnabled = false;

    let leftHeld = false;
    let rightHeld = false;

    let leftCPS = 10;
    let rightCPS = 10;

    // Default keybinds
    let leftKey = "KeyR";   // R toggles left
    let rightKey = "KeyF";  // F toggles right

    let leftMode = "toggle";   // toggle or hold
    let rightMode = "toggle";

    let menuOpen = false;

    document.addEventListener("mousemove", e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }, { passive: true });

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
            Configure keys, modes, CPS, and mouse toggles.
        </div>

        <!-- LEFT CLICK -->
        <div style="margin-bottom:10px;padding:8px;border-radius:8px;background:rgba(255,255,255,0.03);">
            <div style="font-weight:600;margin-bottom:4px;">Left Click</div>
            <label style="font-size:12px;">
                <input type="checkbox" id="leftToggleChk"> Enable Left Autoclick
            </label>

            <div style="margin-top:6px;display:flex;gap:6px;align-items:center;">
                <span style="font-size:11px;opacity:0.8;">Key:</span>
                <select id="leftKeySelect" style="flex:1;padding:2px 4px;font-size:12px;border-radius:4px;background:rgba(0,0,0,0.4);color:white;">
                </select>
                <select id="leftModeSelect" style="flex:1;padding:2px 4px;font-size:12px;border-radius:4px;background:rgba(0,0,0,0.4);color:white;">
                    <option value="toggle">Toggle</option>
                    <option value="hold">Hold</option>
                </select>
            </div>

            <div style="margin-top:6px;">
                <input type="range" id="leftSlider" min="0" max="500" value="10" style="width:100%;">
                <div style="display:flex;justify-content:space-between;font-size:11px;opacity:0.8;">
                    <span>Speed</span>
                    <span id="leftLabel">10 CPS</span>
                </div>
            </div>
        </div>

        <!-- RIGHT CLICK -->
        <div style="margin-bottom:10px;padding:8px;border-radius:8px;background:rgba(255,255,255,0.03);">
            <div style="font-weight:600;margin-bottom:4px;">Right Click</div>
            <label style="font-size:12px;">
                <input type="checkbox" id="rightToggleChk"> Enable Right Autoclick
            </label>

            <div style="margin-top:6px;display:flex;gap:6px;align-items:center;">
                <span style="font-size:11px;opacity:0.8;">Key:</span>
                <select id="rightKeySelect" style="flex:1;padding:2px 4px;font-size:12px;border-radius:4px;background:rgba(0,0,0,0.4);color:white;">
                </select>
                <select id="rightModeSelect" style="flex:1;padding:2px 4px;font-size:12px;border-radius:4px;background:rgba(0,0,0,0.4);color:white;">
                    <option value="toggle">Toggle</option>
                    <option value="hold">Hold</option>
                </select>
            </div>

            <div style="margin-top:6px;">
                <input type="range" id="rightSlider" min="0" max="500" value="10" style="width:100%;">
                <div style="display:flex;justify-content:space-between;font-size:11px;opacity:0.8;">
                    <span>Speed</span>
                    <span id="rightLabel">10 CPS</span>
                </div>
            </div>
        </div>

        <div style="font-size:10px;opacity:0.7;text-align:center;">
            Default: R = left toggle, F = right toggle.  
            Mouse buttons only toggle if selected above.
        </div>
    `;

    document.body.appendChild(menu);

    // Elements
    const leftToggleChk = menu.querySelector("#leftToggleChk");
    const rightToggleChk = menu.querySelector("#rightToggleChk");
    const leftSlider = menu.querySelector("#leftSlider");
    const rightSlider = menu.querySelector("#rightSlider");
    const leftLabel = menu.querySelector("#leftLabel");
    const rightLabel = menu.querySelector("#rightLabel");
    const leftKeySelect = menu.querySelector("#leftKeySelect");
    const rightKeySelect = menu.querySelector("#rightKeySelect");
    const leftModeSelect = menu.querySelector("#leftModeSelect");
    const rightModeSelect = menu.querySelector("#rightModeSelect");

    // Populate key dropdowns A–Z + mouse buttons
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    const addOption = (select, value, label) => {
        const opt = document.createElement("option");
        opt.value = value;
        opt.textContent = label;
        select.appendChild(opt);
    };

    addOption(leftKeySelect, "MOUSE_LEFT", "Left Mouse Button");
    addOption(leftKeySelect, "MOUSE_RIGHT", "Right Mouse Button");
    addOption(rightKeySelect, "MOUSE_LEFT", "Left Mouse Button");
    addOption(rightKeySelect, "MOUSE_RIGHT", "Right Mouse Button");

    for (const ch of letters) {
        addOption(leftKeySelect, "Key" + ch, ch);
        addOption(rightKeySelect, "Key" + ch, ch);
    }

    leftKeySelect.value = leftKey;
    rightKeySelect.value = rightKey;

    // UI handlers
    leftSlider.oninput = () => {
        leftCPS = Number(leftSlider.value);
        leftLabel.textContent = leftCPS === 0 ? "Hold spam" : `${leftCPS} CPS`;
    };

    rightSlider.oninput = () => {
        rightCPS = Number(rightSlider.value);
        rightLabel.textContent = rightCPS === 0 ? "Hold spam" : `${rightCPS} CPS`;
    };

    leftToggleChk.onchange = () => leftEnabled = leftToggleChk.checked;
    rightToggleChk.onchange = () => rightEnabled = rightToggleChk.checked;

    leftKeySelect.onchange = () => leftKey = leftKeySelect.value;
    rightKeySelect.onchange = () => rightKey = rightKeySelect.value;

    leftModeSelect.onchange = () => leftMode = leftModeSelect.value;
    rightModeSelect.onchange = () => rightMode = rightModeSelect.value;

    // -----------------------------
    // Keyboard keybinds (iPad-friendly)
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
                leftToggleChk.checked = leftEnabled;
            } else if (leftMode === "hold") {
                leftHeld = true;
            }
        }

        // RIGHT
        if (e.code === rightKey) {
            if (rightMode === "toggle") {
                rightEnabled = !rightEnabled;
                rightToggleChk.checked = rightEnabled;
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
    // ONLY active if selected in menu
    // -----------------------------
    document.addEventListener("pointerdown", e => {
        // Left mouse button
        if (leftKey === "MOUSE_LEFT" && e.button === 0) {
            if (leftMode === "toggle") {
                leftEnabled = !leftEnabled;
                leftToggleChk.checked = leftEnabled;
            } else if (leftMode === "hold") {
                leftHeld = true;
            }
        }

        // Right mouse button
        if (rightKey === "MOUSE_RIGHT" && e.button === 2) {
            if (rightMode === "toggle") {
                rightEnabled = !rightEnabled;
                rightToggleChk.checked = rightEnabled;
            } else if (rightMode === "hold") {
                rightHeld = true;
            }
        }
    });

    document.addEventListener("pointerup", e => {
        if (leftKey === "MOUSE_LEFT" && e.button === 0 && leftMode === "hold") leftHeld = false;
        if (rightKey === "MOUSE_RIGHT" && e.button === 2 && rightMode === "hold") rightHeld = false;
    });

    // Prevent right-click menu if RMB is toggle key
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
        // LEFT
        if (leftEnabled || (leftMode === "hold" && leftHeld)) {
            if (leftCPS === 0) {
                fireClick(0);
            } else {
                const interval = 1000 / leftCPS;
                if (t - lastLeft >= interval) {
                    fireClick(0);
                    lastLeft = t;
                }
            }
        }

        // RIGHT
        if (rightEnabled || (rightMode === "hold" && rightHeld)) {
            if (rightCPS === 0) {
                fireClick(2);
            } else {
                const interval = 1000 / rightCPS;
                if (t - lastRight >= interval) {
                    fireClick(2);
                    lastRight = t;
                }
            }
        }

        requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
})();
