// ==UserScript==
// @name         Autoclicker Menu (Toggle/Hold Modes)
// @version      1.1
// @description  Left/right autoclicker with toggle/hold modes + CPS sliders
// @match        *://*/*
// @namespace https://greasyfork.org/users/1547770
// @downloadURL https://update.greasyfork.org/scripts/561770/Autoclicker%20Menu%20%28ToggleHold%20Modes%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561770/Autoclicker%20Menu%20%28ToggleHold%20Modes%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let mouseX = 0, mouseY = 0;

    // States
    let leftEnabled = false;
    let rightEnabled = false;

    let leftCPS = 10;
    let rightCPS = 10;

    let leftMode = "toggle";   // "toggle" or "hold"
    let rightMode = "toggle";

    let leftHeld = false;
    let rightHeld = false;

    let menuOpen = false;

    document.addEventListener("mousemove", e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // -----------------------------
    // Menu UI
    // -----------------------------
    const menu = document.createElement("div");
    menu.style = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(20,20,20,0.92);
        padding: 20px;
        border-radius: 10px;
        color: white;
        font-family: Arial, sans-serif;
        font-size: 14px;
        z-index: 999999;
        width: 280px;
        display: none;
    `;

    menu.innerHTML = `
        <h3 style="margin-top:0; text-align:center;">Autoclicker Menu</h3>

        <label><input type="checkbox" id="leftToggle"> Enable Left Click</label><br>
        <select id="leftMode">
            <option value="toggle">Toggle Mode</option>
            <option value="hold">Hold Mode</option>
        </select>
        <br>
        <input type="range" id="leftSlider" min="0" max="500" value="10">
        <span id="leftLabel">10 CPS</span>

        <hr>

        <label><input type="checkbox" id="rightToggle"> Enable Right Click</label><br>
        <select id="rightMode">
            <option value="toggle">Toggle Mode</option>
            <option value="hold">Hold Mode</option>
        </select>
        <br>
        <input type="range" id="rightSlider" min="0" max="500" value="10">
        <span id="rightLabel">10 CPS</span>

        <hr>
        <div style="text-align:center; opacity:0.7;">Right Alt + X to close</div>
    `;

    document.body.appendChild(menu);

    const leftToggle = menu.querySelector("#leftToggle");
    const rightToggle = menu.querySelector("#rightToggle");
    const leftSlider = menu.querySelector("#leftSlider");
    const rightSlider = menu.querySelector("#rightSlider");
    const leftLabel = menu.querySelector("#leftLabel");
    const rightLabel = menu.querySelector("#rightLabel");
    const leftModeSel = menu.querySelector("#leftMode");
    const rightModeSel = menu.querySelector("#rightMode");

    leftSlider.oninput = () => {
        leftCPS = Number(leftSlider.value);
        leftLabel.textContent = leftCPS === 0 ? "Hold" : `${leftCPS} CPS`;
    };

    rightSlider.oninput = () => {
        rightCPS = Number(rightSlider.value);
        rightLabel.textContent = rightCPS === 0 ? "Hold" : `${rightCPS} CPS`;
    };

    leftToggle.onchange = () => leftEnabled = leftToggle.checked;
    rightToggle.onchange = () => rightEnabled = rightToggle.checked;

    leftModeSel.onchange = () => leftMode = leftModeSel.value;
    rightModeSel.onchange = () => rightMode = rightModeSel.value;

    // -----------------------------
    // Toggle Menu (Right Alt + X)
    // -----------------------------
    document.addEventListener("keydown", e => {
        if (e.code === "KeyX" && e.altKey && e.location === 1) {
            menuOpen = !menuOpen;
            menu.style.display = menuOpen ? "block" : "none";
        }
    });

    // -----------------------------
    // Hold Mode Detection
    // -----------------------------
    document.addEventListener("keydown", e => {
        if (e.code === "KeyZ") leftHeld = true;
        if (e.code === "KeyC") rightHeld = true;
    });

    document.addEventListener("keyup", e => {
        if (e.code === "KeyZ") leftHeld = false;
        if (e.code === "KeyC") rightHeld = false;
    });

    // -----------------------------
    // Click Simulation
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
    // High‑precision Autoclick Loop
    // -----------------------------
    let lastLeft = 0;
    let lastRight = 0;

    function loop(t) {
        // LEFT CLICK
        if (leftEnabled) {
            const active = leftMode === "toggle" ? true : leftHeld;

            if (active) {
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
        }

        // RIGHT CLICK
        if (rightEnabled) {
            const active = rightMode === "toggle" ? true : rightHeld;

            if (active) {
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
        }

        requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
})();
