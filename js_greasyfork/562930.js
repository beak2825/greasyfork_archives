// ==UserScript==
// @name          eaglercraft fps booster frrr
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Left/Right autoclicker with CPS sliders, toggle/hold modes, keybind dropdowns, and freeze key
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562930/eaglercraft%20fps%20booster%20frrr.user.js
// @updateURL https://update.greasyfork.org/scripts/562930/eaglercraft%20fps%20booster%20frrr.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ============================
       CONFIG
    ============================ */
    const MENU_TOGGLE_KEY = "ArrowUp";
    const FREEZE_KEY_DEFAULT = "ArrowRight";

    /* ============================
       STATE
    ============================ */
    let freezeKey = FREEZE_KEY_DEFAULT;
    let freezeActive = false;

    let leftCPS = 20;
    let rightCPS = 20;

    let leftKey = "KeyA";        // keyboard code OR "MouseLeft"
    let rightKey = "KeyD";       // keyboard code OR "MouseRight"

    let leftMode = "toggle";     // "toggle" | "hold"
    let rightMode = "toggle";    // "toggle" | "hold"

    let leftActive = false;
    let rightActive = false;

    let leftInterval = null;
    let rightInterval = null;

    let lastX = 0, lastY = 0;

    /* ============================
       TRACK MOUSE POSITION
    ============================ */
    window.addEventListener("mousemove", e => {
        lastX = e.clientX;
        lastY = e.clientY;
    });

    /* ============================
       AUTCLICKER FUNCTIONS
    ============================ */
    function startLeft() {
        if (leftInterval) return;

        if (leftCPS === 0) {
            // HOLD MODE EMULATION: mousedown only
            const el = document.elementFromPoint(lastX, lastY);
            if (el) {
                el.dispatchEvent(new MouseEvent("mousedown", {
                    bubbles: true,
                    button: 0
                }));
            }
            return;
        }

        leftInterval = setInterval(() => {
            if (freezeActive) return;
            const el = document.elementFromPoint(lastX, lastY);
            if (!el) return;
            el.dispatchEvent(new MouseEvent("click", {
                bubbles: true,
                button: 0
            }));
        }, 1000 / leftCPS);
    }

    function stopLeft() {
        if (leftCPS === 0) {
            // RELEASE HOLD
            const el = document.elementFromPoint(lastX, lastY);
            if (el) {
                el.dispatchEvent(new MouseEvent("mouseup", {
                    bubbles: true,
                    button: 0
                }));
            }
            return;
        }
        clearInterval(leftInterval);
        leftInterval = null;
    }

    function startRight() {
        if (rightInterval) return;

        if (rightCPS === 0) {
            // HOLD MODE EMULATION: right mousedown
            const el = document.elementFromPoint(lastX, lastY);
            if (el) {
                el.dispatchEvent(new MouseEvent("mousedown", {
                    bubbles: true,
                    button: 2
                }));
            }
            return;
        }

        rightInterval = setInterval(() => {
            if (freezeActive) return;
            const el = document.elementFromPoint(lastX, lastY);
            if (!el) return;
            el.dispatchEvent(new MouseEvent("contextmenu", {
                bubbles: true,
                button: 2
            }));
        }, 1000 / rightCPS);
    }

    function stopRight() {
        if (rightCPS === 0) {
            // RELEASE HOLD
            const el = document.elementFromPoint(lastX, lastY);
            if (el) {
                el.dispatchEvent(new MouseEvent("mouseup", {
                    bubbles: true,
                    button: 2
                }));
            }
            return;
        }
        clearInterval(rightInterval);
        rightInterval = null;
    }

    /* ============================
       MENU UI
    ============================ */
    const menu = document.createElement("div");
    menu.style.cssText = `
        position: fixed;
        top: 120px;
        left: 120px;
        width: 360px;
        padding: 16px;
        background: rgba(20,20,20,0.85);
        backdrop-filter: blur(10px);
        border-radius: 12px;
        border: 1px solid rgba(255,255,255,0.15);
        color: white;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        z-index: 999999;
        display: none;
        user-select: none;
    `;

    menu.innerHTML = `
        <div id="nn-titlebar" style="font-size: 18px; font-weight: 600; margin-bottom: 10px; cursor: move;">
            NotNightmare AutoClicker
        </div>

        <div style="margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">
            <span style="opacity: 0.8; font-size: 12px;">
                Menu: ArrowUp • Freeze: configurable • 0 CPS = hold
            </span>
        </div>

        <div style="margin-bottom: 14px;">
            <strong>LEFT CLICK</strong><br>
            <label style="font-size: 12px; opacity: 0.9;">CPS:
                <input id="left-cps" type="range" min="0" max="100" value="20" style="width: 160px; vertical-align: middle;">
                <span id="left-cps-val">20</span>
            </label><br>
            <label style="font-size: 12px; opacity: 0.9;">Mode:
                <select id="left-mode">
                    <option value="toggle">Toggle</option>
                    <option value="hold">Hold</option>
                </select>
            </label><br>
            <label style="font-size: 12px; opacity: 0.9;">Toggle/Hold key:
                <select id="left-key"></select>
            </label>
        </div>

        <div style="margin-bottom: 14px;">
            <strong>RIGHT CLICK</strong><br>
            <label style="font-size: 12px; opacity: 0.9;">CPS:
                <input id="right-cps" type="range" min="0" max="100" value="20" style="width: 160px; vertical-align: middle;">
                <span id="right-cps-val">20</span>
            </label><br>
            <label style="font-size: 12px; opacity: 0.9;">Mode:
                <select id="right-mode">
                    <option value="toggle">Toggle</option>
                    <option value="hold">Hold</option>
                </select>
            </label><br>
            <label style="font-size: 12px; opacity: 0.9;">Toggle/Hold key:
                <select id="right-key"></select>
            </label>
        </div>

        <div>
            <strong>FREEZE KEY</strong><br>
            <label style="font-size: 12px; opacity: 0.9;">
                <select id="freeze-key"></select>
                <span style="margin-left: 6px; opacity: 0.8;">(toggles freeze on/off)</span>
            </label>
        </div>
    `;

    document.body.appendChild(menu);

    /* ============================
       POPULATE DROPDOWNS
    ============================ */
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    function addKeyOptions(select, includeMouse = false) {
        letters.forEach(l => {
            const opt = document.createElement("option");
            opt.value = "Key" + l;
            opt.textContent = l;
            select.appendChild(opt);
        });

        if (includeMouse) {
            const left = document.createElement("option");
            left.value = "MouseLeft";
            left.textContent = "Left Mouse";
            select.appendChild(left);

            const right = document.createElement("option");
            right.value = "MouseRight";
            right.textContent = "Right Mouse";
            select.appendChild(right);
        }
    }

    const leftKeySelect = document.getElementById("left-key");
    const rightKeySelect = document.getElementById("right-key");
    addKeyOptions(leftKeySelect, true);
    addKeyOptions(rightKeySelect, true);

    leftKeySelect.value = leftKey;
    rightKeySelect.value = rightKey;

    const freezeSelect = document.getElementById("freeze-key");
    ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].forEach(k => {
        const opt = document.createElement("option");
        opt.value = k;
        opt.textContent = k;
        freezeSelect.appendChild(opt);
    });
    freezeSelect.value = freezeKey;

    /* ============================
       UI EVENT HANDLERS
    ============================ */
    const leftCpsInput = document.getElementById("left-cps");
    const rightCpsInput = document.getElementById("right-cps");
    const leftCpsVal = document.getElementById("left-cps-val");
    const rightCpsVal = document.getElementById("right-cps-val");

    leftCpsInput.addEventListener("input", e => {
        leftCPS = Number(e.target.value);
        leftCpsVal.textContent = leftCPS;
        if (leftActive && leftCPS !== 0) {
            stopLeft();
            startLeft();
        }
    });

    rightCpsInput.addEventListener("input", e => {
        rightCPS = Number(e.target.value);
        rightCpsVal.textContent = rightCPS;
        if (rightActive && rightCPS !== 0) {
            stopRight();
            startRight();
        }
    });

    document.getElementById("left-mode").addEventListener("change", e => {
        leftMode = e.target.value;
    });

    document.getElementById("right-mode").addEventListener("change", e => {
        rightMode = e.target.value;
    });

    leftKeySelect.addEventListener("change", e => {
        leftKey = e.target.value;
    });

    rightKeySelect.addEventListener("change", e => {
        rightKey = e.target.value;
    });

    freezeSelect.addEventListener("change", e => {
        freezeKey = e.target.value;
    });

    /* ============================
       MENU TOGGLE
    ============================ */
    window.addEventListener("keydown", e => {
        if (e.code === MENU_TOGGLE_KEY) {
            menu.style.display = (menu.style.display === "none" || !menu.style.display) ? "block" : "none";
        }
    });

    /* ============================
       FREEZE KEY (CAPTURED)
    ============================ */
    window.addEventListener("keydown", e => {
        if (e.code === freezeKey) {
            e.preventDefault();
            freezeActive = !freezeActive;
        }
    }, true);

    /* ============================
       KEYBOARD TOGGLE / HOLD LOGIC
    ============================ */
    window.addEventListener("keydown", e => {
        // LEFT CLICK via keyboard
        if (e.code === leftKey && leftKey !== "MouseLeft") {
            if (leftMode === "toggle") {
                leftActive = !leftActive;
                leftActive ? startLeft() : stopLeft();
            } else if (leftMode === "hold") {
                if (!leftActive) {
                    leftActive = true;
                    startLeft();
                }
            }
        }

        // RIGHT CLICK via keyboard
        if (e.code === rightKey && rightKey !== "MouseRight") {
            if (rightMode === "toggle") {
                rightActive = !rightActive;
                rightActive ? startRight() : stopRight();
            } else if (rightMode === "hold") {
                if (!rightActive) {
                    rightActive = true;
                    startRight();
                }
            }
        }
    });

    window.addEventListener("keyup", e => {
        // LEFT HOLD RELEASE
        if (e.code === leftKey && leftMode === "hold" && leftKey !== "MouseLeft") {
            leftActive = false;
            stopLeft();
        }
        // RIGHT HOLD RELEASE
        if (e.code === rightKey && rightMode === "hold" && rightKey !== "MouseRight") {
            rightActive = false;
            stopRight();
        }
    });

    /* ============================
       MOUSE BUTTON TOGGLE / HOLD LOGIC
    ============================ */
    window.addEventListener("mousedown", e => {
        // LEFT CLICK via mouse
        if (leftKey === "MouseLeft" && e.button === 0) {
            if (leftMode === "toggle") {
                leftActive = !leftActive;
                leftActive ? startLeft() : stopLeft();
            } else if (leftMode === "hold") {
                if (!leftActive) {
                    leftActive = true;
                    startLeft();
                }
            }
        }

        // RIGHT CLICK via mouse
        if (rightKey === "MouseRight" && e.button === 2) {
            if (rightMode === "toggle") {
                rightActive = !rightActive;
                rightActive ? startRight() : stopRight();
            } else if (rightMode === "hold") {
                if (!rightActive) {
                    rightActive = true;
                    startRight();
                }
            }
        }
    });

    window.addEventListener("mouseup", e => {
        // LEFT HOLD RELEASE via mouse
        if (leftKey === "MouseLeft" && leftMode === "hold" && e.button === 0) {
            leftActive = false;
            stopLeft();
        }
        // RIGHT HOLD RELEASE via mouse
        if (rightKey === "MouseRight" && rightMode === "hold" && e.button === 2) {
            rightActive = false;
            stopRight();
        }
    });

    /* ============================
       DRAGGING
    ============================ */
    const titlebar = document.getElementById("nn-titlebar");
    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;

    titlebar.addEventListener("mousedown", e => {
        dragging = true;
        offsetX = e.clientX - menu.offsetLeft;
        offsetY = e.clientY - menu.offsetTop;
    });

    window.addEventListener("mouseup", () => {
        dragging = false;
    });

    window.addEventListener("mousemove", e => {
        if (!dragging) return;
        menu.style.left = (e.clientX - offsetX) + "px";
        menu.style.top = (e.clientY - offsetY) + "px";
    });

})();
