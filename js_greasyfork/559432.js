// ==UserScript==
// @name         Universal Autoclicker (PC Only, Custom Hotkeys)
// @namespace    https://greasyfork.org/en/users/your-name
// @version      1.0.0
// @description  PC-only autoclicker with left/right CPS sliders (1–100), assign-any-key toggles, and a neon menu opened with Right Shift.
// @author       You
// @match        *://*/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559432/Universal%20Autoclicker%20%28PC%20Only%2C%20Custom%20Hotkeys%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559432/Universal%20Autoclicker%20%28PC%20Only%2C%20Custom%20Hotkeys%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // =========================
    // State
    // =========================

    let leftInterval = null;
    let rightInterval = null;

    let leftCPS = 20;   // default
    let rightCPS = 20;  // default

    let leftEnabled = false;
    let rightEnabled = false;

    let lastX = window.innerWidth / 2;
    let lastY = window.innerHeight / 2;

    let leftHotkey = null;
    let rightHotkey = null;

    let waitingForLeftKey = false;
    let waitingForRightKey = false;

    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    const KEY_TOGGLE_MENU = "ShiftRight";

    // =========================
    // Utility
    // =========================

    function clamp(v, min, max) {
        return Math.min(max, Math.max(min, v));
    }

    function cpsToInterval(cps) {
        cps = clamp(cps, 1, 100);
        return 1000 / cps;
    }

    function getTarget() {
        const el = document.elementFromPoint(lastX, lastY);
        return el || document.body;
    }

    function clickAt(button) {
        const target = getTarget();
        const ev = {
            bubbles: true,
            cancelable: true,
            clientX: lastX,
            clientY: lastY,
            button: button
        };

        ["mousedown", "mouseup", "click"].forEach(type => {
            target.dispatchEvent(new MouseEvent(type, ev));
        });
    }

    // =========================
    // Autoclick loops
    // =========================

    function startLeft() {
        stopLeft();
        leftInterval = setInterval(() => clickAt(0), cpsToInterval(leftCPS));
    }

    function stopLeft() {
        if (leftInterval) clearInterval(leftInterval);
        leftInterval = null;
    }

    function startRight() {
        stopRight();
        rightInterval = setInterval(() => clickAt(2), cpsToInterval(rightCPS));
    }

    function stopRight() {
        if (rightInterval) clearInterval(rightInterval);
        rightInterval = null;
    }

    function updateLeft() {
        if (leftEnabled) startLeft();
        else stopLeft();
        updateUI();
    }

    function updateRight() {
        if (rightEnabled) startRight();
        else stopRight();
        updateUI();
    }

    // =========================
    // Pointer tracking
    // =========================

    window.addEventListener("mousemove", e => {
        lastX = e.clientX;
        lastY = e.clientY;
    });

    // =========================
    // UI
    // =========================

    let panel, leftSlider, rightSlider, leftLabel, rightLabel;
    let leftToggleBtn, rightToggleBtn;
    let leftKeyBtn, rightKeyBtn;

    function injectStyles() {
        const s = document.createElement("style");
        s.textContent = `
            .ac-panel {
                position: fixed;
                top: 80px;
                right: 20px;
                width: 260px;
                background: rgba(10, 10, 18, 0.95);
                border: 1px solid rgba(0,255,200,0.5);
                border-radius: 10px;
                box-shadow: 0 0 18px rgba(0,255,200,0.4);
                color: #e6ffff;
                font-family: system-ui, sans-serif;
                font-size: 12px;
                padding: 10px;
                z-index: 999999;
                display: none;
                backdrop-filter: blur(8px);
            }
            .ac-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 6px;
                cursor: move;
                user-select: none;
            }
            .ac-title {
                font-size: 12px;
                letter-spacing: 0.08em;
                text-transform: uppercase;
                color: #a7ffff;
            }
            .ac-close {
                background: transparent;
                border: none;
                color: #88ffff;
                cursor: pointer;
                font-size: 14px;
            }
            .ac-row { margin-bottom: 10px; }
            .ac-label-line {
                display: flex;
                justify-content: space-between;
                margin-bottom: 2px;
            }
            .ac-slider {
                width: 100%;
                height: 4px;
                border-radius: 4px;
                background: linear-gradient(90deg,#00ffc8,#00bfff);
                outline: none;
            }
            .ac-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 14px;
                height: 14px;
                border-radius: 50%;
                background: #000;
                border: 2px solid #00ffc8;
                cursor: pointer;
                box-shadow: 0 0 6px rgba(0,255,200,0.7);
            }
            .ac-btn {
                width: 100%;
                padding: 5px;
                border-radius: 6px;
                border: 1px solid rgba(0,255,200,0.7);
                background: rgba(0,20,25,0.9);
                color: #a7ffff;
                cursor: pointer;
                margin-top: 4px;
            }
            .ac-btn.on {
                background: rgba(0,255,200,0.25);
                border-color: #00ffc8;
                color: #eaffff;
                box-shadow: 0 0 14px rgba(0,255,200,0.6);
            }
            .ac-footer {
                margin-top: 6px;
                font-size: 10px;
                color: #7ecfd1;
                text-align: right;
            }
        `;
        document.documentElement.appendChild(s);
    }

    function buildUI() {
        panel = document.createElement("div");
        panel.className = "ac-panel";

        panel.innerHTML = `
            <div class="ac-header">
                <div class="ac-title">AUTOCLICKER</div>
                <button class="ac-close">✕</button>
            </div>

            <div class="ac-row">
                <div class="ac-label-line">
                    <span>Left CPS</span>
                    <span class="ac-left-label">${leftCPS} CPS</span>
                </div>
                <input type="range" min="1" max="100" value="${leftCPS}" class="ac-slider ac-left-slider">
                <button class="ac-btn ac-left-toggle">Left: OFF</button>
                <button class="ac-btn ac-left-key">Set Left Toggle Key</button>
            </div>

            <div class="ac-row">
                <div class="ac-label-line">
                    <span>Right CPS</span>
                    <span class="ac-right-label">${rightCPS} CPS</span>
                </div>
                <input type="range" min="1" max="100" value="${rightCPS}" class="ac-slider ac-right-slider">
                <button class="ac-btn ac-right-toggle">Right: OFF</button>
                <button class="ac-btn ac-right-key">Set Right Toggle Key</button>
            </div>

            <div class="ac-footer">Menu: Right Shift</div>
        `;

        document.documentElement.appendChild(panel);

        leftSlider = panel.querySelector(".ac-left-slider");
        rightSlider = panel.querySelector(".ac-right-slider");
        leftLabel = panel.querySelector(".ac-left-label");
        rightLabel = panel.querySelector(".ac-right-label");

        leftToggleBtn = panel.querySelector(".ac-left-toggle");
        rightToggleBtn = panel.querySelector(".ac-right-toggle");

        leftKeyBtn = panel.querySelector(".ac-left-key");
        rightKeyBtn = panel.querySelector(".ac-right-key");

        // Close
        panel.querySelector(".ac-close").onclick = () => panel.style.display = "none";

        // Sliders
        leftSlider.oninput = () => {
            leftCPS = clamp(parseInt(leftSlider.value), 1, 100);
            leftLabel.textContent = `${leftCPS} CPS`;
            updateLeft();
        };

        rightSlider.oninput = () => {
            rightCPS = clamp(parseInt(rightSlider.value), 1, 100);
            rightLabel.textContent = `${rightCPS} CPS`;
            updateRight();
        };

        // Toggle buttons
        leftToggleBtn.onclick = () => {
            leftEnabled = !leftEnabled;
            updateLeft();
        };

        rightToggleBtn.onclick = () => {
            rightEnabled = !rightEnabled;
            updateRight();
        };

        // Hotkey assignment
        leftKeyBtn.onclick = () => {
            waitingForLeftKey = true;
            leftKeyBtn.textContent = "Press any key...";
        };

        rightKeyBtn.onclick = () => {
            waitingForRightKey = true;
            rightKeyBtn.textContent = "Press any key...";
        };

        // Dragging
        const header = panel.querySelector(".ac-header");
        header.onmousedown = e => {
            isDragging = true;
            dragOffsetX = e.clientX - panel.getBoundingClientRect().left;
            dragOffsetY = e.clientY - panel.getBoundingClientRect().top;
        };

        window.onmouseup = () => isDragging = false;

        window.onmousemove = e => {
            if (!isDragging) return;
            panel.style.left = (e.clientX - dragOffsetX) + "px";
            panel.style.top = (e.clientY - dragOffsetY) + "px";
            panel.style.right = "auto";
        };

        updateUI();
    }

    function updateUI() {
        if (leftEnabled) {
            leftToggleBtn.classList.add("on");
            leftToggleBtn.textContent = `Left: ON (${leftCPS})`;
        } else {
            leftToggleBtn.classList.remove("on");
            leftToggleBtn.textContent = "Left: OFF";
        }

        if (rightEnabled) {
            rightToggleBtn.classList.add("on");
            rightToggleBtn.textContent = `Right: ON (${rightCPS})`;
        } else {
            rightToggleBtn.classList.remove("on");
            rightToggleBtn.textContent = "Right: OFF";
        }

        leftKeyBtn.textContent = leftHotkey ? `Left Key: ${leftHotkey}` : "Set Left Toggle Key";
        rightKeyBtn.textContent = rightHotkey ? `Right Key: ${rightHotkey}` : "Set Right Toggle Key";
    }

    // =========================
    // Keyboard handling
    // =========================

    window.addEventListener("keydown", e => {
        // Menu toggle
        if (e.code === KEY_TOGGLE_MENU) {
            e.preventDefault();
            panel.style.display = panel.style.display === "none" ? "block" : "none";
            return;
        }

        // Assigning keys
        if (waitingForLeftKey) {
            waitingForLeftKey = false;
            leftHotkey = e.code;
            updateUI();
            return;
        }

        if (waitingForRightKey) {
            waitingForRightKey = false;
            rightHotkey = e.code;
            updateUI();
            return;
        }

        // Ignore typing in inputs
        const tag = e.target.tagName.toLowerCase();
        if (tag === "input" || tag === "textarea") return;

        // Toggle left
        if (leftHotkey && e.code === leftHotkey) {
            leftEnabled = !leftEnabled;
            updateLeft();
        }

        // Toggle right
        if (rightHotkey && e.code === rightHotkey) {
            rightEnabled = !rightEnabled;
            updateRight();
        }
    });

    // =========================
    // Init
    // =========================

    function init() {
        injectStyles();
        buildUI();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
