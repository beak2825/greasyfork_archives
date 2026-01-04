// ==UserScript==
// @name         Sick auto clicker
// @namespace    https://greasyfork.org/users/your-id
// @version      1.0
// @description  PC-only autoclicker shell with menu, CPS sliders, modes, and keybinds (no actual clicking logic included).
// @author       You
// @match        *://*/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559532/Sick%20auto%20clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/559532/Sick%20auto%20clicker.meta.js
// ==/UserScript==

(function() {
    "use strict";

    /******************************************************************
     * 1. PC-ONLY CHECK
     ******************************************************************/
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
        .test(navigator.userAgent || "");
    if (isMobile) return; // Do nothing on mobile/tablet

    /******************************************************************
     * 2. GLOBAL STATE
     ******************************************************************/
    const state = {
        // Left click module
        left: {
            key: "KeyR",           // default: R
            cps: 20,               // 1–200
            mode: "toggle",        // "toggle" | "hold"
            active: false,         // is currently autoclicking
            keyHeld: false,        // for hold mode
            intervalId: null
        },
        // Right click module
        right: {
            key: "KeyF",           // default: F
            cps: 20,               // 1–200
            mode: "toggle",        // "toggle" | "hold"
            active: false,
            keyHeld: false,
            intervalId: null
        },
        // UI
        menuOpen: false,
        rebinding: null, // "left" | "right" | null
    };

    // Utility: clamp CPS
    function clampCps(value) {
        const n = Number(value) || 1;
        return Math.min(200, Math.max(1, Math.round(n)));
    }

    // Utility: convert KeyboardEvent.code to readable label
    function codeToLabel(code) {
        if (!code) return "?";
        if (code.startsWith("Key")) return code.replace("Key", "");
        if (code.startsWith("Digit")) return code.replace("Digit", "");
        return code;
    }

    /******************************************************************
     * 3. DOM CREATION (MENU PANEL)
     ******************************************************************/
    const style = document.createElement("style");
    style.textContent = `
        .nc-panel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 999999;
            min-width: 320px;
            background: rgba(10, 10, 18, 0.96);
            color: #f5f5f5;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            border-radius: 10px;
            box-shadow: 0 0 25px rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(120, 120, 255, 0.6);
            padding: 12px 16px 14px;
        }
        .nc-panel-hidden {
            display: none !important;
        }
        .nc-title {
            font-size: 15px;
            margin-bottom: 8px;
            font-weight: 600;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .nc-title span {
            opacity: 0.7;
            font-size: 11px;
        }
        .nc-section {
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            padding-top: 8px;
            margin-top: 8px;
        }
        .nc-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            margin: 6px 0;
            font-size: 12px;
        }
        .nc-row-label {
            font-size: 12px;
            opacity: 0.9;
        }
        .nc-toggle-group {
            display: inline-flex;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 999px;
            padding: 2px;
            gap: 2px;
        }
        .nc-toggle-btn {
            border: none;
            border-radius: 999px;
            padding: 4px 10px;
            font-size: 11px;
            cursor: pointer;
            background: transparent;
            color: #ddd;
            transition: background 0.15s, color 0.15s;
        }
        .nc-toggle-btn-active {
            background: linear-gradient(135deg, #6b7bff, #9c6bff);
            color: #fff;
        }
        .nc-slider-wrap {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .nc-slider {
            flex: 1;
        }
        .nc-slider input[type="range"] {
            width: 100%;
        }
        .nc-value-pill {
            min-width: 40px;
            text-align: center;
            font-size: 11px;
            padding: 2px 6px;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.08);
        }
        .nc-key-btn {
            border-radius: 6px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            background: rgba(255, 255, 255, 0.05);
            padding: 3px 8px;
            font-size: 11px;
            cursor: pointer;
            min-width: 60px;
            text-align: center;
            color: #f5f5f5;
            transition: border 0.15s, background 0.15s, color 0.15s;
        }
        .nc-key-btn-rebinding {
            border-color: #ffcc66;
            background: rgba(255, 204, 102, 0.1);
            color: #ffebc2;
        }
        .nc-key-hint {
            font-size: 10px;
            opacity: 0.7;
            margin-top: 2px;
        }
        .nc-footer {
            margin-top: 6px;
            font-size: 10px;
            opacity: 0.6;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .nc-footer span {
            white-space: nowrap;
        }
    `;
    document.head.appendChild(style);

    const panel = document.createElement("div");
    panel.className = "nc-panel nc-panel-hidden";
    panel.innerHTML = `
        <div class="nc-title">
            <div>NightmareClick Shell</div>
            <span>Right Shift to open/close</span>
        </div>

        <div class="nc-section">
            <div class="nc-row">
                <div class="nc-row-label">Mode</div>
                <div class="nc-toggle-group" data-nc-mode-group>
                    <button type="button" class="nc-toggle-btn nc-toggle-btn-active" data-nc-mode="toggle">Toggle</button>
                    <button type="button" class="nc-toggle-btn" data-nc-mode="hold">Hold</button>
                </div>
            </div>
        </div>

        <div class="nc-section">
            <div class="nc-row">
                <div class="nc-row-label">Left click</div>
                <div class="nc-slider-wrap">
                    <div class="nc-slider">
                        <input type="range" min="1" max="200" step="1" value="20" data-nc-left-cps>
                    </div>
                    <div class="nc-value-pill" data-nc-left-cps-label>20 CPS</div>
                </div>
            </div>
            <div class="nc-row">
                <div class="nc-row-label">Left key</div>
                <button type="button" class="nc-key-btn" data-nc-left-key>R</button>
            </div>
        </div>

        <div class="nc-section">
            <div class="nc-row">
                <div class="nc-row-label">Right click</div>
                <div class="nc-slider-wrap">
                    <div class="nc-slider">
                        <input type="range" min="1" max="200" step="1" value="20" data-nc-right-cps>
                    </div>
                    <div class="nc-value-pill" data-nc-right-cps-label>20 CPS</div>
                </div>
            </div>
            <div class="nc-row">
                <div class="nc-row-label">Right key</div>
                <button type="button" class="nc-key-btn" data-nc-right-key>F</button>
            </div>
        </div>

        <div class="nc-footer">
            <span>Mode applies to both L/R</span>
            <span>Shell only – add your own click logic</span>
        </div>
    `;
    document.body.appendChild(panel);

    /******************************************************************
     * 4. UI ELEMENT REFERENCES
     ******************************************************************/
    const modeGroup = panel.querySelector("[data-nc-mode-group]");
    const modeButtons = modeGroup.querySelectorAll(".nc-toggle-btn");

    const leftCpsSlider = panel.querySelector("[data-nc-left-cps]");
    const leftCpsLabel = panel.querySelector("[data-nc-left-cps-label]");
    const leftKeyBtn = panel.querySelector("[data-nc-left-key]");

    const rightCpsSlider = panel.querySelector("[data-nc-right-cps]");
    const rightCpsLabel = panel.querySelector("[data-nc-right-cps-label]");
    const rightKeyBtn = panel.querySelector("[data-nc-right-key]");

    /******************************************************************
     * 5. UI UPDATE HELPERS
     ******************************************************************/
    function updateModeButtons() {
        modeButtons.forEach(btn => {
            const mode = btn.getAttribute("data-nc-mode");
            if (mode === state.left.mode && mode === state.right.mode) {
                btn.classList.add("nc-toggle-btn-active");
            } else {
                btn.classList.remove("nc-toggle-btn-active");
            }
        });
    }

    function syncUIFromState() {
        // Mode (left and right share the same mode in this shell)
        updateModeButtons();

        // Left CPS
        leftCpsSlider.value = String(state.left.cps);
        leftCpsLabel.textContent = `${state.left.cps} CPS`;

        // Right CPS
        rightCpsSlider.value = String(state.right.cps);
        rightCpsLabel.textContent = `${state.right.cps} CPS`;

        // Left key
        leftKeyBtn.textContent = codeToLabel(state.left.key);

        // Right key
        rightKeyBtn.textContent = codeToLabel(state.right.key);

        // Rebinding visual state
        leftKeyBtn.classList.toggle("nc-key-btn-rebinding", state.rebinding === "left");
        rightKeyBtn.classList.toggle("nc-key-btn-rebinding", state.rebinding === "right");
    }

    syncUIFromState();

    /******************************************************************
     * 6. MENU TOGGLE (RIGHT SHIFT)
     ******************************************************************/
    function toggleMenu(force) {
        if (typeof force === "boolean") {
            state.menuOpen = force;
        } else {
            state.menuOpen = !state.menuOpen;
        }
        panel.classList.toggle("nc-panel-hidden", !state.menuOpen);
    }

    /******************************************************************
     * 7. AUTCLICKER SHELL LOGIC (NO REAL CLICKS)
     *
     * These functions manage state and timers ONLY.
     * Insert your own real click code in the marked areas.
     ******************************************************************/

    function stopInterval(side) {
        if (state[side].intervalId != null) {
            clearInterval(state[side].intervalId);
            state[side].intervalId = null;
        }
    }

    function startIntervalIfNeeded(side) {
        const module = state[side];
        stopInterval(side);
        if (!module.active || module.cps <= 0) return;

        const intervalMs = 1000 / module.cps;

        // IMPORTANT:
        // This is where you would add your click logic.
        //
        // For example, you might:
        // - Track mouse position
        // - Dispatch MouseEvents
        // - Or call your own click function
        //
        // This shell does NOT implement any of that; it only manages timing.
        module.intervalId = setInterval(() => {
            // >>> INSERT YOUR OWN CLICK LOGIC HERE <<<
            // side === "left"  => your left-click handler
            // side === "right" => your right-click handler
        }, intervalMs);
    }

    function setModeForBoth(mode) {
        state.left.mode = mode;
        state.right.mode = mode;

        // When switching modes, reset active states for safety.
        state.left.active = false;
        state.right.active = false;
        state.left.keyHeld = false;
        state.right.keyHeld = false;
        stopInterval("left");
        stopInterval("right");

        syncUIFromState();
    }

    function handleTogglePress(side) {
        const module = state[side];
        module.active = !module.active;

        if (!module.active) {
            stopInterval(side);
        } else {
            startIntervalIfNeeded(side);
        }
    }

    function handleHoldPress(side, isDown) {
        const module = state[side];
        module.keyHeld = isDown;
        module.active = isDown;

        if (!module.active) {
            stopInterval(side);
        } else {
            startIntervalIfNeeded(side);
        }
    }

    function handleKeyForSide(side, event, isDown) {
        const module = state[side];

        if (module.mode === "toggle") {
            if (isDown) handleTogglePress(side);
        } else if (module.mode === "hold") {
            handleHoldPress(side, isDown);
        }
    }

    /******************************************************************
     * 8. EVENT LISTENERS – UI INTERACTION
     ******************************************************************/

    // Mode toggle buttons
    modeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const mode = btn.getAttribute("data-nc-mode");
            if (mode === "toggle" || mode === "hold") {
                setModeForBoth(mode);
            }
        });
    });

    // Left CPS slider
    leftCpsSlider.addEventListener("input", () => {
        state.left.cps = clampCps(leftCpsSlider.value);
        leftCpsLabel.textContent = `${state.left.cps} CPS`;
        if (state.left.active) {
            startIntervalIfNeeded("left");
        }
    });

    // Right CPS slider
    rightCpsSlider.addEventListener("input", () => {
        state.right.cps = clampCps(rightCpsSlider.value);
        rightCpsLabel.textContent = `${state.right.cps} CPS`;
        if (state.right.active) {
            startIntervalIfNeeded("right");
        }
    });

    // Rebind left key
    leftKeyBtn.addEventListener("click", () => {
        state.rebinding = state.rebinding === "left" ? null : "left";
        syncUIFromState();
    });

    // Rebind right key
    rightKeyBtn.addEventListener("click", () => {
        state.rebinding = state.rebinding === "right" ? null : "right";
        syncUIFromState();
    });

    /******************************************************************
     * 9. GLOBAL KEYBOARD HANDLING
     ******************************************************************/
    document.addEventListener("keydown", (e) => {
        // Ignore while typing in inputs/textarea/contentEditable
        const target = e.target;
        if (target && (
            target.tagName === "INPUT" ||
            target.tagName === "TEXTAREA" ||
            target.isContentEditable
        )) {
            return;
        }

        // Right Shift -> toggle menu
        if (e.code === "ShiftRight") {
            e.preventDefault();
            toggleMenu();
            return;
        }

        // If rebinding
        if (state.rebinding) {
            e.preventDefault();
            const code = e.code;

            if (state.rebinding === "left") {
                state.left.key = code;
            } else if (state.rebinding === "right") {
                state.right.key = code;
            }
            state.rebinding = null;
            syncUIFromState();
            return;
        }

        // Handle left/right keybinds
        if (e.code === state.left.key) {
            e.preventDefault();
            handleKeyForSide("left", e, true);
        } else if (e.code === state.right.key) {
            e.preventDefault();
            handleKeyForSide("right", e, true);
        }
    });

    document.addEventListener("keyup", (e) => {
        // For hold mode – stop when key released
        if (e.code === state.left.key) {
            if (state.left.mode === "hold") {
                handleHoldPress("left", false);
            }
        } else if (e.code === state.right.key) {
            if (state.right.mode === "hold") {
                handleHoldPress("right", false);
            }
        }
    });

    // Safety: stop intervals if window loses focus
    window.addEventListener("blur", () => {
        state.left.active = false;
        state.right.active = false;
        state.left.keyHeld = false;
        state.right.keyHeld = false;
        stopInterval("left");
        stopInterval("right");
    });

})();
