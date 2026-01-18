// ==UserScript==
// @name         YT DOWNL VIDEO (BROKEN
// @namespace    https://greasyfork.org/en/users/000000
// @version      1.2
// @description  Two independent autoclickers (left & right) with CPS, modes, keybind capture, mouse toggles, freeze key, saved settings, and a closeable menu toggled by ArrowUp. Safari Userscripts compatible.
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563049/YT%20DOWNL%20VIDEO%20%28BROKEN.user.js
// @updateURL https://update.greasyfork.org/scripts/563049/YT%20DOWNL%20VIDEO%20%28BROKEN.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // ============================
    // GLOBAL CONFIG
    // ============================
    const MENU_TOGGLE_KEY = "ArrowUp";    // show/hide menu
    const FREEZE_KEY      = "ArrowRight"; // freeze/unfreeze everything

    // LEFT clicker defaults
    let L_cps  = parseInt(localStorage.getItem("acL_cps") || "15", 10);
    let L_mode = localStorage.getItem("acL_mode") || "toggle"; // "toggle" | "hold"
    let L_key  = localStorage.getItem("acL_key") || "z";

    // RIGHT clicker defaults
    let R_cps  = parseInt(localStorage.getItem("acR_cps") || "15", 10);
    let R_mode = localStorage.getItem("acR_mode") || "toggle";
    let R_key  = localStorage.getItem("acR_key") || "x";

    // Panel position + visibility
    let panelX       = parseInt(localStorage.getItem("ac_panelX") || "10", 10);
    let panelY       = parseInt(localStorage.getItem("ac_panelY") || "10", 10);
    let panelVisible = (localStorage.getItem("ac_panelVisible") || "1") === "1";

    // ============================
    // INTERNAL STATE
    // ============================
    let lastX = 0, lastY = 0;

    let L_running    = false;
    let L_interval   = null;
    let L_holdActive = false;

    let R_running    = false;
    let R_interval   = null;
    let R_holdActive = false;

    let capturingKeyFor = null; // "L" | "R" | null
    let frozen          = false;

    // ============================
    // POINTER TRACKING
    // ============================
    document.addEventListener("pointermove", e => {
        lastX = e.clientX;
        lastY = e.clientY;
    }, { passive: true });

    function getTarget() {
        return document.elementFromPoint(lastX, lastY);
    }

    // ============================
    // CLICK ENGINES
    // ============================
    function fireLeftClick(target) {
        if (!target) return;
        try {
            target.click();
        } catch (e) {
            console.warn("[AutoClicker] Left click failed:", e);
        }
    }

    function fireRightClick(target) {
        if (!target) return;
        try {
            const evt = new MouseEvent("contextmenu", {
                bubbles: true,
                cancelable: true,
                button: 2,
                buttons: 2,
                clientX: lastX,
                clientY: lastY
            });
            target.dispatchEvent(evt);
        } catch (e) {
            console.warn("[AutoClicker] Right click failed:", e);
        }
    }

    // ============================
    // LEFT CLICKER START/STOP
    // ============================
    function L_start() {
        if (L_running || frozen) return;
        L_running = true;
        const intervalMs = Math.max(1, Math.floor(1000 / Math.max(1, L_cps)));
        L_interval = setInterval(() => {
            if (frozen) return;
            fireLeftClick(getTarget());
        }, intervalMs);
        updateStatus();
    }

    function L_stop() {
        if (!L_running) return;
        L_running = false;
        clearInterval(L_interval);
        L_interval = null;
        updateStatus();
    }

    // ============================
    // RIGHT CLICKER START/STOP
    // ============================
    function R_start() {
        if (R_running || frozen) return;
        R_running = true;
        const intervalMs = Math.max(1, Math.floor(1000 / Math.max(1, R_cps)));
        R_interval = setInterval(() => {
            if (frozen) return;
            fireRightClick(getTarget());
        }, intervalMs);
        updateStatus();
    }

    function R_stop() {
        if (!R_running) return;
        R_running = false;
        clearInterval(R_interval);
        R_interval = null;
        updateStatus();
    }

    // ============================
    // FREEZE HANDLING
    // ============================
    function setFrozen(state) {
        frozen = state;
        if (frozen) {
            L_stop();
            R_stop();
            L_holdActive = false;
            R_holdActive = false;
        }
        updateFreezeIndicator();
    }

    // ============================
    // KEY HANDLING
    // ============================
    document.addEventListener("keydown", e => {
        // Freeze toggle has absolute priority
        if (e.key === FREEZE_KEY) {
            setFrozen(!frozen);
            return;
        }

        // If frozen, ignore everything else
        if (frozen) return;

        // Key capture mode: ONLY capture, ignore menu + clickers
        if (capturingKeyFor) {
            e.preventDefault();
            e.stopPropagation();

            const newKey = e.key;

            if (capturingKeyFor === "L") {
                L_key = newKey;
                localStorage.setItem("acL_key", L_key);
            } else if (capturingKeyFor === "R") {
                R_key = newKey;
                localStorage.setItem("acR_key", R_key);
            }

            capturingKeyFor = null;
            updateKeyLabels();
            return;
        }

        // MENU TOGGLE (only when not capturing and not frozen)
        if (e.key === MENU_TOGGLE_KEY) {
            togglePanelVisibility();
            return;
        }

        // LEFT CLICKER
        if (e.key === L_key) {
            if (L_mode === "toggle") {
                L_running ? L_stop() : L_start();
            } else if (L_mode === "hold") {
                if (!L_holdActive) {
                    L_holdActive = true;
                    L_start();
                }
            }
        }

        // RIGHT CLICKER
        if (e.key === R_key) {
            if (R_mode === "toggle") {
                R_running ? R_stop() : R_start();
            } else if (R_mode === "hold") {
                if (!R_holdActive) {
                    R_holdActive = true;
                    R_start();
                }
            }
        }
    }, true);

    document.addEventListener("keyup", e => {
        if (frozen) return;

        if (L_mode === "hold" && e.key === L_key) {
            L_holdActive = false;
            L_stop();
        }
        if (R_mode === "hold" && e.key === R_key) {
            R_holdActive = false;
            R_stop();
        }
    }, true);

    // ============================
    // MOUSE BUTTON TOGGLES
    // ============================
    // Option B + mode 2: mouse toggles only when menu is CLOSED and not frozen
    document.addEventListener("mousedown", e => {
        if (frozen) return;

        const panel = document.getElementById("dual-ac-panel");
        const menuOpen = panel && panel.style.display !== "none";

        if (menuOpen) return; // no mouse toggles while menu open

        // Left button toggles LEFT clicker
        if (e.button === 0) {
            if (L_mode === "toggle") {
                L_running ? L_stop() : L_start();
            } else if (L_mode === "hold") {
                if (!L_holdActive) {
                    L_holdActive = true;
                    L_start();
                }
            }
        }

        // Right button toggles RIGHT clicker
        if (e.button === 2) {
            if (R_mode === "toggle") {
                R_running ? R_stop() : R_start();
            } else if (R_mode === "hold") {
                if (!R_holdActive) {
                    R_holdActive = true;
                    R_start();
                }
            }
        }
    }, true);

    document.addEventListener("mouseup", e => {
        if (frozen) return;

        const panel = document.getElementById("dual-ac-panel");
        const menuOpen = panel && panel.style.display !== "none";

        if (menuOpen) return;

        if (e.button === 0 && L_mode === "hold") {
            L_holdActive = false;
            L_stop();
        }
        if (e.button === 2 && R_mode === "hold") {
            R_holdActive = false;
            R_stop();
        }
    }, true);

    // ============================
    // UI CREATION
    // ============================
    function createUI() {
        const panel = document.createElement("div");
        panel.id = "dual-ac-panel";
        Object.assign(panel.style, {
            position: "fixed",
            top: panelY + "px",
            left: panelX + "px",
            zIndex: 999999,
            background: "rgba(20,20,20,0.95)",
            color: "#fff",
            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
            fontSize: "12px",
            padding: "8px 10px",
            borderRadius: "6px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
            minWidth: "240px",
            maxWidth: "280px",
            display: panelVisible ? "block" : "none"
        });

        panel.innerHTML = `
            <div style="display:flex; align-items:center; margin-bottom:4px;">
                <div style="font-weight:600; flex:1;">Dual AutoClicker</div>
                <span id="ac-freeze-indicator" style="font-size:11px; margin-right:6px; color:#f44; display:none;">FROZEN</span>
                <button id="ac-close-btn" style="font-size:11px; padding:1px 5px;">✕</button>
            </div>

            <div style="border-bottom:1px solid #444; padding-bottom:4px; margin-bottom:4px; font-size:11px; color:#ccc;">
                Menu: <b>${MENU_TOGGLE_KEY}</b> &nbsp;|&nbsp; Freeze: <b>${FREEZE_KEY}</b>
            </div>

            <!-- LEFT CLICKER -->
            <div style="margin-bottom:6px; padding:4px; border-radius:4px; background:rgba(255,255,255,0.03);">
                <div style="display:flex; align-items:center; margin-bottom:3px;">
                    <span style="font-weight:600; flex:1;">Left Clicker</span>
                    <span id="acL-status" style="font-weight:600; color:#f44;">OFF</span>
                </div>

                <div style="margin-bottom:4px;">
                    CPS:
                    <input id="acL-cps" type="range" min="1" max="50" value="${L_cps}" style="width:130px;">
                    <span id="acL-cps-val">${L_cps}</span>
                </div>

                <div style="margin-bottom:4px;">
                    Mode:
                    <select id="acL-mode">
                        <option value="toggle">Toggle</option>
                        <option value="hold">Hold</option>
                    </select>
                </div>

                <div style="margin-bottom:4px;">
                    Toggle key: <span id="acL-key-label" style="font-weight:600;">${L_key}</span><br>
                    <button id="acL-key-btn" style="margin-top:2px; font-size:11px;">Set key</button>
                </div>

                <div style="text-align:right;">
                    <button id="acL-toggle-btn" style="font-size:11px;">Start / Stop</button>
                </div>
            </div>

            <!-- RIGHT CLICKER -->
            <div style="margin-bottom:2px; padding:4px; border-radius:4px; background:rgba(255,255,255,0.03);">
                <div style="display:flex; align-items:center; margin-bottom:3px;">
                    <span style="font-weight:600; flex:1;">Right Clicker</span>
                    <span id="acR-status" style="font-weight:600; color:#f44;">OFF</span>
                </div>

                <div style="margin-bottom:4px;">
                    CPS:
                    <input id="acR-cps" type="range" min="1" max="50" value="${R_cps}" style="width:130px;">
                    <span id="acR-cps-val">${R_cps}</span>
                </div>

                <div style="margin-bottom:4px;">
                    Mode:
                    <select id="acR-mode">
                        <option value="toggle">Toggle</option>
                        <option value="hold">Hold</option>
                    </select>
                </div>

                <div style="margin-bottom:4px;">
                    Toggle key: <span id="acR-key-label" style="font-weight:600;">${R_key}</span><br>
                    <button id="acR-key-btn" style="margin-top:2px; font-size:11px;">Set key</button>
                </div>

                <div style="text-align:right;">
                    <button id="acR-toggle-btn" style="font-size:11px;">Start / Stop</button>
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        // Close button (just hides; ArrowUp reopens)
        panel.querySelector("#ac-close-btn").addEventListener("click", () => {
            panelVisible = false;
            localStorage.setItem("ac_panelVisible", "0");
            panel.style.display = "none";
        });

        // LEFT controls
        const L_cpsSlider = panel.querySelector("#acL-cps");
        const L_cpsVal    = panel.querySelector("#acL-cps-val");
        const L_modeSel   = panel.querySelector("#acL-mode");
        const L_keyBtn    = panel.querySelector("#acL-key-btn");
        const L_toggleBtn = panel.querySelector("#acL-toggle-btn");

        L_modeSel.value = L_mode;

        L_cpsSlider.addEventListener("input", () => {
            L_cps = parseInt(L_cpsSlider.value, 10);
            L_cpsVal.textContent = L_cps;
            localStorage.setItem("acL_cps", L_cps);
            if (L_running) {
                L_stop();
                L_start();
            }
        });

        L_modeSel.addEventListener("change", () => {
            L_mode = L_modeSel.value;
            localStorage.setItem("acL_mode", L_mode);
            if (L_running && L_mode === "hold") L_stop();
        });

        L_keyBtn.addEventListener("click", () => {
            if (frozen) return;
            capturingKeyFor = "L";
            const label = panel.querySelector("#acL-key-label");
            label.textContent = "Press any key...";
            label.style.color = "#ff0";
        });

        L_toggleBtn.addEventListener("click", () => {
            if (frozen) return;
            L_running ? L_stop() : L_start();
        });

        // RIGHT controls
        const R_cpsSlider = panel.querySelector("#acR-cps");
        const R_cpsVal    = panel.querySelector("#acR-cps-val");
        const R_modeSel   = panel.querySelector("#acR-mode");
        const R_keyBtn    = panel.querySelector("#acR-key-btn");
        const R_toggleBtn = panel.querySelector("#acR-toggle-btn");

        R_modeSel.value = R_mode;

        R_cpsSlider.addEventListener("input", () => {
            R_cps = parseInt(R_cpsSlider.value, 10);
            R_cpsVal.textContent = R_cps;
            localStorage.setItem("acR_cps", R_cps);
            if (R_running) {
                R_stop();
                R_start();
            }
        });

        R_modeSel.addEventListener("change", () => {
            R_mode = R_modeSel.value;
            localStorage.setItem("acR_mode", R_mode);
            if (R_running && R_mode === "hold") R_stop();
        });

        R_keyBtn.addEventListener("click", () => {
            if (frozen) return;
            capturingKeyFor = "R";
            const label = panel.querySelector("#acR-key-label");
            label.textContent = "Press any key...";
            label.style.color = "#ff0";
        });

        R_toggleBtn.addEventListener("click", () => {
            if (frozen) return;
            R_running ? R_stop() : R_start();
        });

        makeDraggable(panel);
        updateStatus();
        updateKeyLabels();
        updateFreezeIndicator();
    }

    function updateStatus() {
        const L_el = document.querySelector("#acL-status");
        const R_el = document.querySelector("#acR-status");
        if (L_el) {
            L_el.textContent = L_running ? "ON" : "OFF";
            L_el.style.color = L_running ? "#0f0" : "#f44";
        }
        if (R_el) {
            R_el.textContent = R_running ? "ON" : "OFF";
            R_el.style.color = R_running ? "#0f0" : "#f44";
        }
    }

    function updateKeyLabels() {
        const L_label = document.querySelector("#acL-key-label");
        const R_label = document.querySelector("#acR-key-label");
        if (L_label) {
            L_label.textContent = L_key;
            L_label.style.color = "#fff";
        }
        if (R_label) {
            R_label.textContent = R_key;
            R_label.style.color = "#fff";
        }
    }

    function updateFreezeIndicator() {
        const el = document.querySelector("#ac-freeze-indicator");
        if (!el) return;
        el.style.display = frozen ? "inline" : "none";
    }

    // ============================
    // DRAGGABLE PANEL + SAVE POS
    // ============================
    function makeDraggable(el) {
        let down = false;
        let offsetX = 0, offsetY = 0;

        el.addEventListener("pointerdown", e => {
            if (e.button !== 0) return;
            down = true;
            offsetX = e.clientX - el.offsetLeft;
            offsetY = e.clientY - el.offsetTop;
            el.setPointerCapture(e.pointerId);
        });

        el.addEventListener("pointermove", e => {
            if (!down) return;
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            el.style.left = x + "px";
            el.style.top = y + "px";
            localStorage.setItem("ac_panelX", x);
            localStorage.setItem("ac_panelY", y);
        });

        el.addEventListener("pointerup", e => {
            down = false;
            el.releasePointerCapture(e.pointerId);
        });
    }

    // ============================
    // PANEL VISIBILITY TOGGLE
    // ============================
    function togglePanelVisibility() {
        const panel = document.getElementById("dual-ac-panel");
        if (!panel) return;
        panelVisible = !panelVisible;
        panel.style.display = panelVisible ? "block" : "none";
        localStorage.setItem("ac_panelVisible", panelVisible ? "1" : "0");
    }

    // ============================
    // INIT
    // ============================
    function init() {
        createUI();
        console.log("[Dual AutoClicker] Loaded. Menu key:", MENU_TOGGLE_KEY, "Freeze key:", FREEZE_KEY);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
