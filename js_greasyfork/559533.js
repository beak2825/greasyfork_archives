// ==UserScript==
// @name         NeonTap Autoclicker (PC Only)
// @namespace    https://greasyfork.org/en/users/000000
// @version      1.0
// @description  A clean, modular PC autoclicker with CPS control, toggle/hold modes, keybinds, and a neon UI panel.
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559533/NeonTap%20Autoclicker%20%28PC%20Only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559533/NeonTap%20Autoclicker%20%28PC%20Only%29.meta.js
// ==/UserScript==

(function() {
    "use strict";

    /******************************
     *  STATE
     ******************************/
    const state = {
        leftEnabled: false,
        rightEnabled: false,

        leftCPS: 12,
        rightCPS: 12,

        leftMode: "toggle",   // toggle | hold
        rightMode: "toggle",

        leftKey: "r",
        rightKey: "f",

        menuOpen: false,
        panicKey: "Escape",

        mouseX: 0,
        mouseY: 0,

        leftInterval: null,
        rightInterval: null,
    };

    /******************************
     *  SAVE / LOAD
     ******************************/
    function save() {
        localStorage.setItem("neontap-settings", JSON.stringify({
            leftCPS: state.leftCPS,
            rightCPS: state.rightCPS,
            leftMode: state.leftMode,
            rightMode: state.rightMode,
            leftKey: state.leftKey,
            rightKey: state.rightKey
        }));
    }

    function load() {
        const data = JSON.parse(localStorage.getItem("neontap-settings") || "{}");
        Object.assign(state, data);
    }
    load();

    /******************************
     *  CLICK ENGINE
     ******************************/
    function startLeft() {
        stopLeft();
        state.leftInterval = setInterval(() => {
            dispatchClick(0);
        }, 1000 / state.leftCPS);
    }

    function stopLeft() {
        clearInterval(state.leftInterval);
        state.leftInterval = null;
    }

    function startRight() {
        stopRight();
        state.rightInterval = setInterval(() => {
            dispatchClick(2);
        }, 1000 / state.rightCPS);
    }

    function stopRight() {
        clearInterval(state.rightInterval);
        state.rightInterval = null;
    }

    function dispatchClick(button) {
        const el = document.elementFromPoint(state.mouseX, state.mouseY);
        if (!el) return;

        ["mousedown", "mouseup", "click"].forEach(type => {
            el.dispatchEvent(new MouseEvent(type, {
                bubbles: true,
                cancelable: true,
                clientX: state.mouseX,
                clientY: state.mouseY,
                button
            }));
        });
    }

    /******************************
     *  EVENT LISTENERS
     ******************************/
    document.addEventListener("mousemove", e => {
        state.mouseX = e.clientX;
        state.mouseY = e.clientY;
    });

    document.addEventListener("keydown", e => {
        if (state.menuOpen) return;

        const key = e.key.toLowerCase();

        // PANIC KEY
        if (key === state.panicKey.toLowerCase()) {
            stopLeft();
            stopRight();
            state.leftEnabled = false;
            state.rightEnabled = false;
            updateUI();
            return;
        }

        // LEFT CLICK KEY
        if (key === state.leftKey.toLowerCase()) {
            if (state.leftMode === "toggle") {
                state.leftEnabled = !state.leftEnabled;
                state.leftEnabled ? startLeft() : stopLeft();
            } else {
                state.leftEnabled = true;
                startLeft();
            }
            updateUI();
        }

        // RIGHT CLICK KEY
        if (key === state.rightKey.toLowerCase()) {
            if (state.rightMode === "toggle") {
                state.rightEnabled = !state.rightEnabled;
                state.rightEnabled ? startRight() : stopRight();
            } else {
                state.rightEnabled = true;
                startRight();
            }
            updateUI();
        }
    });

    document.addEventListener("keyup", e => {
        const key = e.key.toLowerCase();

        if (state.leftMode === "hold" && key === state.leftKey.toLowerCase()) {
            state.leftEnabled = false;
            stopLeft();
            updateUI();
        }

        if (state.rightMode === "hold" && key === state.rightKey.toLowerCase()) {
            state.rightEnabled = false;
            stopRight();
            updateUI();
        }
    });

    /******************************
     *  MENU UI
     ******************************/
    const panel = document.createElement("div");
    panel.id = "neontap-panel";
    panel.innerHTML = `
        <div class="title">NeonTap Autoclicker</div>

        <div class="section">
            <div class="label">Left CPS</div>
            <input id="leftCPS" type="range" min="1" max="200" value="${state.leftCPS}">
            <span id="leftCPSVal">${state.leftCPS}</span>
        </div>

        <div class="section">
            <div class="label">Right CPS</div>
            <input id="rightCPS" type="range" min="1" max="200" value="${state.rightCPS}">
            <span id="rightCPSVal">${state.rightCPS}</span>
        </div>

        <div class="section">
            <div class="label">Left Mode</div>
            <select id="leftMode">
                <option value="toggle">Toggle</option>
                <option value="hold">Hold</option>
            </select>
        </div>

        <div class="section">
            <div class="label">Right Mode</div>
            <select id="rightMode">
                <option value="toggle">Toggle</option>
                <option value="hold">Hold</option>
            </select>
        </div>

        <div class="section">
            <div class="label">Left Key</div>
            <input id="leftKey" type="text" maxlength="1" value="${state.leftKey}">
        </div>

        <div class="section">
            <div class="label">Right Key</div>
            <input id="rightKey" type="text" maxlength="1" value="${state.rightKey}">
        </div>

        <div class="status">
            Left: <span id="leftStatus">OFF</span> |
            Right: <span id="rightStatus">OFF</span>
        </div>

        <div class="hint">Press Right‑Shift to close</div>
    `;
    document.body.appendChild(panel);

    /******************************
     *  MENU LOGIC
     ******************************/
    function updateUI() {
        document.getElementById("leftStatus").textContent = state.leftEnabled ? "ON" : "OFF";
        document.getElementById("rightStatus").textContent = state.rightEnabled ? "ON" : "OFF";
    }

    function bindUI() {
        document.getElementById("leftCPS").oninput = e => {
            state.leftCPS = Number(e.target.value);
            document.getElementById("leftCPSVal").textContent = state.leftCPS;
            save();
        };

        document.getElementById("rightCPS").oninput = e => {
            state.rightCPS = Number(e.target.value);
            document.getElementById("rightCPSVal").textContent = state.rightCPS;
            save();
        };

        document.getElementById("leftMode").value = state.leftMode;
        document.getElementById("rightMode").value = state.rightMode;

        document.getElementById("leftMode").onchange = e => {
            state.leftMode = e.target.value;
            save();
        };

        document.getElementById("rightMode").onchange = e => {
            state.rightMode = e.target.value;
            save();
        };

        document.getElementById("leftKey").oninput = e => {
            state.leftKey = e.target.value.toLowerCase();
            save();
        };

        document.getElementById("rightKey").oninput = e => {
            state.rightKey = e.target.value.toLowerCase();
            save();
        };
    }
    bindUI();

    /******************************
     *  MENU TOGGLE
     ******************************/
    document.addEventListener("keydown", e => {
        if (e.key === "Shift" && e.location === 2) {
            state.menuOpen = !state.menuOpen;
            panel.style.display = state.menuOpen ? "block" : "none";
        }
    });

    /******************************
     *  CSS
     ******************************/
    const css = document.createElement("style");
    css.textContent = `
        #neontap-panel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 260px;
            padding: 16px;
            background: rgba(0,0,0,0.75);
            border: 2px solid #0ff;
            border-radius: 10px;
            color: white;
            font-family: Arial, sans-serif;
            z-index: 999999;
            display: none;
            backdrop-filter: blur(6px);
        }
        #neontap-panel .title {
            font-size: 18px;
            margin-bottom: 10px;
            text-align: center;
            color: #0ff;
        }
        #neontap-panel .section {
            margin-bottom: 10px;
        }
        #neontap-panel .label {
            margin-bottom: 4px;
        }
        #neontap-panel input[type=range] {
            width: 100%;
        }
        #neontap-panel input[type=text] {
            width: 40px;
            text-align: center;
        }
        #neontap-panel select {
            width: 100%;
        }
        #neontap-panel .status {
            margin-top: 10px;
            text-align: center;
            color: #0ff;
        }
        #neontap-panel .hint {
            margin-top: 8px;
            text-align: center;
            font-size: 12px;
            opacity: 0.7;
        }
    `;
    document.head.appendChild(css);

})();
