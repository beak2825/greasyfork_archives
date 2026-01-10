// ==UserScript==
// @name         Nightmare AutoClicker Dual + Freeze (PC + Mobile Keyboardz!
// @namespace    https://greasyfork.org/users/notnightmare
// @version      1.0
// @description  Dual left/right autoclicker with real-cursor clicks, mouse/keyboard hotkeys, toggle/hold modes, and global freeze. Disabled on Discord.
// @author       NotNightmare
// @match        *://*/*
// @exclude      *://discord.com/*
// @exclude      *://*.discord.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562040/Nightmare%20AutoClicker%20Dual%20%2B%20Freeze%20%28PC%20%2B%20Mobile%20Keyboardz%21.user.js
// @updateURL https://update.greasyfork.org/scripts/562040/Nightmare%20AutoClicker%20Dual%20%2B%20Freeze%20%28PC%20%2B%20Mobile%20Keyboardz%21.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // ---- Hard block on Discord ----
    if (location.host.indexOf("discord.com") !== -1) {
        return;
    }

    // ---- Settings + state ----
    var STORAGE_KEY = "nn_dual_autoclicker_settings_v2";

    var settings = {
        // Left click settings
        modeLeft: "toggle",            // "toggle" or "hold"
        cpsLeft: 10,                   // 0–100, 0 = hold button down
        hotkeyToggleLeft: "z",
        hotkeyHoldLeft: "x",

        // Right click settings
        modeRight: "toggle",
        cpsRight: 10,
        hotkeyToggleRight: "c",
        hotkeyHoldRight: "v",

        // Menu + Freeze
        hotkeyMenu: "m",
        hotkeyFreeze: "l",

        // Runtime state
        enabledLeft: false,
        enabledRight: false,
        frozen: false
    };

    // Load saved settings
    try {
        var saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            var parsed = JSON.parse(saved);
            Object.keys(settings).forEach(function (k) {
                if (Object.prototype.hasOwnProperty.call(parsed, k)) {
                    settings[k] = parsed[k];
                }
            });
        }
    } catch (e) {
        console.warn("Nightmare AutoClicker Dual + Freeze: failed to load settings", e);
    }

    function saveSettings() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        } catch (e) {
            console.warn("Nightmare AutoClicker Dual + Freeze: failed to save settings", e);
        }
    }

    // ---- Real cursor tracking ----
    var lastCursorX = window.innerWidth / 2;
    var lastCursorY = window.innerHeight / 2;

    window.addEventListener("mousemove", function (e) {
        lastCursorX = e.clientX;
        lastCursorY = e.clientY;
    }, true);

    window.addEventListener("touchmove", function (e) {
        if (e.touches && e.touches.length > 0) {
            lastCursorX = e.touches[0].clientX;
            lastCursorY = e.touches[0].clientY;
        }
    }, { passive: true });

    window.addEventListener("touchstart", function (e) {
        if (e.touches && e.touches.length > 0) {
            lastCursorX = e.touches[0].clientX;
            lastCursorY = e.touches[0].clientY;
        }
    }, { passive: true });

    function getClickTargetAndPos() {
        var x = lastCursorX;
        var y = lastCursorY;

        var target = document.elementFromPoint(x, y);
        if (!target) {
            target = document.body || document.documentElement;
            var rect = target.getBoundingClientRect();
            return {
                target: target,
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            };
        }

        return { target: target, x: x, y: y };
    }

    // ---- Core autoclick logic ----
    var intervalLeft = null;
    var intervalRight = null;
    var isMouseDownLeftHeld = false;
    var isMouseDownRightHeld = false;

    function dispatchMouseEvent(type, buttonCode, target, clientX, clientY) {
        var event = new MouseEvent(type, {
            bubbles: true,
            cancelable: true,
            view: window,
            button: buttonCode,
            buttons: 1,
            clientX: clientX,
            clientY: clientY
        });
        target.dispatchEvent(event);
    }

    function startLeft() {
        if (intervalLeft !== null || isMouseDownLeftHeld || settings.frozen) return;

        var cps = parseInt(settings.cpsLeft, 10);
        if (isNaN(cps) || cps < 0) cps = 0;
        if (cps > 100) cps = 100;

        if (cps === 0) {
            var info0 = getClickTargetAndPos();
            dispatchMouseEvent("mousedown", 0, info0.target, info0.x, info0.y);
            isMouseDownLeftHeld = true;
            return;
        }

        var interval = 1000 / cps;
        intervalLeft = window.setInterval(function () {
            if (settings.frozen) return;
            var info = getClickTargetAndPos();
            dispatchMouseEvent("mousedown", 0, info.target, info.x, info.y);
            dispatchMouseEvent("mouseup", 0, info.target, info.x, info.y);
        }, interval);
    }

    function stopLeft() {
        if (intervalLeft !== null) {
            window.clearInterval(intervalLeft);
            intervalLeft = null;
        }
        if (isMouseDownLeftHeld) {
            var info = getClickTargetAndPos();
            dispatchMouseEvent("mouseup", 0, info.target, info.x, info.y);
            isMouseDownLeftHeld = false;
        }
    }

    function startRight() {
        if (intervalRight !== null || isMouseDownRightHeld || settings.frozen) return;

        var cps = parseInt(settings.cpsRight, 10);
        if (isNaN(cps) || cps < 0) cps = 0;
        if (cps > 100) cps = 100;

        if (cps === 0) {
            var info0 = getClickTargetAndPos();
            dispatchMouseEvent("mousedown", 2, info0.target, info0.x, info0.y);
            isMouseDownRightHeld = true;
            return;
        }

        var interval = 1000 / cps;
        intervalRight = window.setInterval(function () {
            if (settings.frozen) return;
            var info = getClickTargetAndPos();
            dispatchMouseEvent("mousedown", 2, info.target, info.x, info.y);
            dispatchMouseEvent("mouseup", 2, info.target, info.x, info.y);
        }, interval);
    }

    function stopRight() {
        if (intervalRight !== null) {
            window.clearInterval(intervalRight);
            intervalRight = null;
        }
        if (isMouseDownRightHeld) {
            var info = getClickTargetAndPos();
            dispatchMouseEvent("mouseup", 2, info.target, info.x, info.y);
            isMouseDownRightHeld = false;
        }
    }

    function setLeftEnabled(on) {
        if (settings.frozen) {
            on = false;
        }
        if (on) {
            if (!settings.enabledLeft) {
                settings.enabledLeft = true;
                startLeft();
            }
        } else {
            if (settings.enabledLeft) {
                settings.enabledLeft = false;
                stopLeft();
            }
        }
        updateStatusDisplay();
        saveSettings();
    }

    function setRightEnabled(on) {
        if (settings.frozen) {
            on = false;
        }
        if (on) {
            if (!settings.enabledRight) {
                settings.enabledRight = true;
                startRight();
            }
        } else {
            if (settings.enabledRight) {
                settings.enabledRight = false;
                stopRight();
            }
        }
        updateStatusDisplay();
        saveSettings();
    }

    function forceOffAll() {
        setLeftEnabled(false);
        setRightEnabled(false);
    }

    function applyFreezeState() {
        if (settings.frozen) {
            // Hard kill
            settings.enabledLeft = false;
            settings.enabledRight = false;
            stopLeft();
            stopRight();
        }
        updateStatusDisplay();
        saveSettings();
    }

    function toggleFreeze() {
        settings.frozen = !settings.frozen;
        applyFreezeState();
    }

    // ---- Key normalization & typing detection ----
    function normalizeKey(e) {
        // Mouse buttons will be mapped separately
        if (e.type === "mousedown") {
            if (e.button === 0) return "Mouse1";
            if (e.button === 1) return "Mouse2";
            if (e.button === 2) return "Mouse3";
        }
        if (e.key && e.key.length === 1) {
            return e.key.toLowerCase();
        }
        return e.key;
    }

    function isTypingTarget(target) {
        var tag = (target && target.tagName) ? target.tagName.toLowerCase() : "";
        if (tag === "input" || tag === "textarea") return true;
        if (target && target.isContentEditable) return true;
        return false;
    }

    // ---- Global keyboard/mouse handling ----
    var menuRoot = null;
    var menuVisible = false;

    function handleKeyDown(e) {
        if (isTypingTarget(e.target)) return;

        var key = normalizeKey(e);
        if (!key) return;

        // Freeze key: works even when frozen (to unfreeze)
        if (key === settings.hotkeyFreeze) {
            e.preventDefault();
            toggleFreeze();
            return;
        }

        // Menu key: always works (even when frozen)
        if (key === settings.hotkeyMenu) {
            e.preventDefault();
            toggleMenuVisibility();
            return;
        }

        // If frozen: everything else is dead
        if (settings.frozen) return;

        // LEFT TOGGLE (works always if modeLeft is toggle)
        if (key === settings.hotkeyToggleLeft && settings.modeLeft === "toggle") {
            e.preventDefault();
            setLeftEnabled(!settings.enabledLeft);
            return;
        }

        // RIGHT TOGGLE (works always if modeRight is toggle)
        if (key === settings.hotkeyToggleRight && settings.modeRight === "toggle") {
            e.preventDefault();
            setRightEnabled(!settings.enabledRight);
            return;
        }

        // HOLD ONLY WORKS WHILE MENU IS VISIBLE
        if (!menuVisible) return;

        // LEFT HOLD (menu must be open, modeLeft = hold)
        if (key === settings.hotkeyHoldLeft && settings.modeLeft === "hold") {
            e.preventDefault();
            setLeftEnabled(true);
            return;
        }

        // RIGHT HOLD (menu must be open, modeRight = hold)
        if (key === settings.hotkeyHoldRight && settings.modeRight === "hold") {
            e.preventDefault();
            setRightEnabled(true);
            return;
        }
    }

    function handleKeyUp(e) {
        if (isTypingTarget(e.target)) return;

        var key = normalizeKey(e);
        if (!key) return;

        // Freeze key keyup: nothing special
        if (key === settings.hotkeyFreeze) {
            return;
        }

        // If frozen: no hold release logic
        if (settings.frozen) return;

        // HOLD RELEASE ONLY MATTERS IF MENU VISIBLE
        if (!menuVisible) return;

        if (key === settings.hotkeyHoldLeft && settings.modeLeft === "hold") {
            e.preventDefault();
            setLeftEnabled(false);
            return;
        }

        if (key === settings.hotkeyHoldRight && settings.modeRight === "hold") {
            e.preventDefault();
            setRightEnabled(false);
            return;
        }
    }

    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("keyup", handleKeyUp, true);

    // ---- Menu UI ----
    var statusLeftSpan = null;
    var statusRightSpan = null;
    var freezeStatusSpan = null;

    var modeLeftSelect = null;
    var cpsLeftInput = null;
    var cpsLeftValueLabel = null;
    var keyToggleLeftInput = null;
    var keyHoldLeftInput = null;

    var modeRightSelect = null;
    var cpsRightInput = null;
    var cpsRightValueLabel = null;
    var keyToggleRightInput = null;
    var keyHoldRightInput = null;

    var menuKeyInput = null;
    var freezeKeyInput = null;

    function createMenu() {
        if (menuRoot) return;

        menuRoot = document.createElement("div");
        menuRoot.id = "nn-dual-autoclicker-menu";

        menuRoot.style.position = "fixed";
        menuRoot.style.top = "20px";
        menuRoot.style.right = "20px";
        menuRoot.style.zIndex = "999999";
        menuRoot.style.background = "rgba(15, 15, 20, 0.95)";
        menuRoot.style.color = "#f5f5f5";
        menuRoot.style.fontFamily = "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
        menuRoot.style.fontSize = "13px";
        menuRoot.style.padding = "10px 12px";
        menuRoot.style.borderRadius = "8px";
        menuRoot.style.border = "1px solid rgba(255,255,255,0.15)";
        menuRoot.style.boxShadow = "0 8px 20px rgba(0,0,0,0.5)";
        menuRoot.style.backdropFilter = "blur(8px)";
        menuRoot.style.minWidth = "260px";

        menuRoot.style.display = "none";

        var html = "";

        // Header
        html += "<div id=\"nn-dac-header\" style=\"display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;cursor:move;\">";
        html += "  <span style=\"font-weight:bold;letter-spacing:0.03em;\">Nightmare AutoClicker Dual</span>";
        html += "  <button id=\"nn-dac-close\" style=\"background:none;border:none;color:#aaa;font-size:14px;cursor:pointer;padding:0;margin:0;\">✕</button>";
        html += "</div>";

        // Status
        html += "<div style=\"margin-bottom:6px;font-size:11px;color:#bbb;\">";
        html += "  <div>Freeze: <span id=\"nn-dac-status-freeze\">OFF</span></div>";
        html += "  <div>Left: <span id=\"nn-dac-status-left\">OFF</span></div>";
        html += "  <div>Right: <span id=\"nn-dac-status-right\">OFF</span></div>";
        html += "</div>";

        // LEFT SECTION
        html += "<div style=\"border-top:1px solid rgba(255,255,255,0.08);margin-top:4px;padding-top:4px;margin-bottom:6px;\">";
        html += "  <div style=\"font-size:11px;color:#eee;margin-bottom:4px;font-weight:bold;\">Left Click</div>";

        html += "  <div style=\"margin-bottom:6px;\">";
        html += "    <label style=\"display:block;margin-bottom:2px;\">Mode</label>";
        html += "    <select id=\"nn-dac-mode-left\" style=\"width:100%;background:#111;border:1px solid #444;color:#eee;border-radius:4px;padding:2px 4px;\">";
        html += "      <option value=\"toggle\">Toggle</option>";
        html += "      <option value=\"hold\">Hold</option>";
        html += "    </select>";
        html += "  </div>";

        html += "  <div style=\"margin-bottom:6px;\">";
        html += "    <label style=\"display:block;margin-bottom:2px;\">CPS (0–100)</label>";
        html += "    <input id=\"nn-dac-cps-left\" type=\"range\" min=\"0\" max=\"100\" step=\"1\" style=\"width:100%;\">";
        html += "    <div style=\"font-size:11px;color:#bbb;margin-top:2px;\">Current: <span id=\"nn-dac-cps-left-value\"></span> CPS</div>";
        html += "    <div style=\"font-size:10px;color:#888;margin-top:2px;\">0 = hold left button down</div>";
        html += "  </div>";

        html += "  <div style=\"margin-bottom:4px;display:grid;grid-template-columns:1fr 1fr;gap:4px;font-size:11px;\">";
        html += "    <div>";
        html += "      <label style=\"display:block;margin-bottom:2px;\">Toggle key</label>";
        html += "      <input id=\"nn-dac-key-toggle-left\" type=\"text\" maxlength=\"6\" style=\"width:100%;box-sizing:border-box;background:#111;border:1px solid #444;color:#eee;border-radius:4px;padding:2px 4px;\">";
        html += "    </div>";
        html += "    <div>";
        html += "      <label style=\"display:block;margin-bottom:2px;\">Hold key</label>";
        html += "      <input id=\"nn-dac-key-hold-left\" type=\"text\" maxlength=\"6\" style=\"width:100%;box-sizing:border-box;background:#111;border:1px solid #444;color:#eee;border-radius:4px;padding:2px 4px;\">";
        html += "    </div>";
        html += "  </div>";

        html += "</div>";

        // RIGHT SECTION
        html += "<div style=\"border-top:1px solid rgba(255,255,255,0.08);padding-top:4px;margin-bottom:6px;\">";
        html += "  <div style=\"font-size:11px;color:#eee;margin-bottom:4px;font-weight:bold;\">Right Click</div>";

        html += "  <div style=\"margin-bottom:6px;\">";
        html += "    <label style=\"display:block;margin-bottom:2px;\">Mode</label>";
        html += "    <select id=\"nn-dac-mode-right\" style=\"width:100%;background:#111;border:1px solid #444;color:#eee;border-radius:4px;padding:2px 4px;\">";
        html += "      <option value=\"toggle\">Toggle</option>";
        html += "      <option value=\"hold\">Hold</option>";
        html += "    </select>";
        html += "  </div>";

        html += "  <div style=\"margin-bottom:6px;\">";
        html += "    <label style=\"display:block;margin-bottom:2px;\">CPS (0–100)</label>";
        html += "    <input id=\"nn-dac-cps-right\" type=\"range\" min=\"0\" max=\"100\" step=\"1\" style=\"width:100%;\">";
        html += "    <div style=\"font-size:11px;color:#bbb;margin-top:2px;\">Current: <span id=\"nn-dac-cps-right-value\"></span> CPS</div>";
        html += "    <div style=\"font-size:10px;color:#888;margin-top:2px;\">0 = hold right button down</div>";
        html += "  </div>";

        html += "  <div style=\"margin-bottom:4px;display:grid;grid-template-columns:1fr 1fr;gap:4px;font-size:11px;\">";
        html += "    <div>";
        html += "      <label style=\"display:block;margin-bottom:2px;\">Toggle key</label>";
        html += "      <input id=\"nn-dac-key-toggle-right\" type=\"text\" maxlength=\"6\" style=\"width:100%;box-sizing:border-box;background:#111;border:1px solid:#444;color:#eee;border-radius:4px;padding:2px 4px;\">";
        html += "    </div>";
        html += "    <div>";
        html += "      <label style=\"display:block;margin-bottom:2px;\">Hold key</label>";
        html += "      <input id=\"nn-dac-key-hold-right\" type=\"text\" maxlength=\"6\" style=\"width:100%;box-sizing:border-box;background:#111;border:1px solid:#444;color:#eee;border-radius:4px;padding:2px 4px;\">";
        html += "    </div>";
        html += "  </div>";

        html += "</div>";

        // Menu key + Freeze key + footer
        html += "<div style=\"border-top:1px solid rgba(255,255,255,0.08);padding-top:4px;margin-top:4px;font-size:11px;\">";
        html += "  <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-bottom:6px;\">";
        html += "    <div>";
        html += "      <label style=\"display:block;margin-bottom:2px;\">Menu key</label>";
        html += "      <input id=\"nn-dac-key-menu\" type=\"text\" maxlength=\"6\" style=\"width:100%;box-sizing:border-box;background:#111;border:1px solid #444;color:#eee;border-radius:4px;padding:2px 4px;\">";
        html += "    </div>";
        html += "    <div>";
        html += "      <label style=\"display:block;margin-bottom:2px;\">Freeze key</label>";
        html += "      <input id=\"nn-dac-key-freeze\" type=\"text\" maxlength=\"6\" style=\"width:100%;box-sizing:border-box;background:#111;border:1px solid #444;color:#eee;border-radius:4px;padding:2px 4px;\">";
        html += "    </div>";
        html += "  </div>";
        html += "  <div style=\"display:flex;justify-content:space-between;align-items:center;font-size:10px;color:#777;\">";
        html += "    <span>External keyboard + mouse hotkeys</span>";
        html += "    <button id=\"nn-dac-off-btn\" style=\"background:#222;border:1px solid #555;color:#eee;border-radius:4px;padding:2px 6px;font-size:10px;cursor:pointer;\">Force OFF</button>";
        html += "  </div>";
        html += "</div>";

        menuRoot.innerHTML = html;
        document.documentElement.appendChild(menuRoot);

        // Grab elements
        freezeStatusSpan = document.getElementById("nn-dac-status-freeze");
        statusLeftSpan = document.getElementById("nn-dac-status-left");
        statusRightSpan = document.getElementById("nn-dac-status-right");

        modeLeftSelect = document.getElementById("nn-dac-mode-left");
        cpsLeftInput = document.getElementById("nn-dac-cps-left");
        cpsLeftValueLabel = document.getElementById("nn-dac-cps-left-value");
        keyToggleLeftInput = document.getElementById("nn-dac-key-toggle-left");
        keyHoldLeftInput = document.getElementById("nn-dac-key-hold-left");

        modeRightSelect = document.getElementById("nn-dac-mode-right");
        cpsRightInput = document.getElementById("nn-dac-cps-right");
        cpsRightValueLabel = document.getElementById("nn-dac-cps-right-value");
        keyToggleRightInput = document.getElementById("nn-dac-key-toggle-right");
        keyHoldRightInput = document.getElementById("nn-dac-key-hold-right");

        menuKeyInput = document.getElementById("nn-dac-key-menu");
        freezeKeyInput = document.getElementById("nn-dac-key-freeze");

        document.getElementById("nn-dac-close").addEventListener("click", function () {
            menuRoot.style.display = "none";
            menuVisible = false;
        });

        document.getElementById("nn-dac-off-btn").addEventListener("click", function () {
            forceOffAll();
        });

        var header = document.getElementById("nn-dac-header");
        makeDraggable(menuRoot, header);

        // Init values
        modeLeftSelect.value = settings.modeLeft;
        modeRightSelect.value = settings.modeRight;

        cpsLeftInput.value = settings.cpsLeft;
        cpsRightInput.value = settings.cpsRight;
        cpsLeftValueLabel.textContent = String(settings.cpsLeft);
        cpsRightValueLabel.textContent = String(settings.cpsRight);

        keyToggleLeftInput.value = settings.hotkeyToggleLeft;
        keyHoldLeftInput.value = settings.hotkeyHoldLeft;
        keyToggleRightInput.value = settings.hotkeyToggleRight;
        keyHoldRightInput.value = settings.hotkeyHoldRight;

        menuKeyInput.value = settings.hotkeyMenu;
        freezeKeyInput.value = settings.hotkeyFreeze;

        // Events
        modeLeftSelect.addEventListener("change", function () {
            settings.modeLeft = modeLeftSelect.value;
            saveSettings();
            updateStatusDisplay();
        });

        modeRightSelect.addEventListener("change", function () {
            settings.modeRight = modeRightSelect.value;
            saveSettings();
            updateStatusDisplay();
        });

        cpsLeftInput.addEventListener("input", function () {
            var v = parseInt(cpsLeftInput.value, 10);
            if (isNaN(v)) v = 0;
            if (v < 0) v = 0;
            if (v > 100) v = 100;
            settings.cpsLeft = v;
            cpsLeftValueLabel.textContent = String(v);
            saveSettings();
            if (settings.enabledLeft && !settings.frozen) {
                stopLeft();
                startLeft();
            }
            updateStatusDisplay();
        });

        cpsRightInput.addEventListener("input", function () {
            var v = parseInt(cpsRightInput.value, 10);
            if (isNaN(v)) v = 0;
            if (v < 0) v = 0;
            if (v > 100) v = 100;
            settings.cpsRight = v;
            cpsRightValueLabel.textContent = String(v);
            saveSettings();
            if (settings.enabledRight && !settings.frozen) {
                stopRight();
                startRight();
            }
            updateStatusDisplay();
        });

        function bindKeyInput(inputElement, settingKey) {
            // Keyboard keys
            inputElement.addEventListener("keydown", function (e) {
                e.preventDefault();
                var key = normalizeKey(e);
                if (!key) return;
                settings[settingKey] = key;
                inputElement.value = key;
                saveSettings();
            });

            // Mouse buttons as hotkeys
            inputElement.addEventListener("mousedown", function (e) {
                e.preventDefault();
                var key = normalizeKey(e);
                if (!key) return;
                settings[settingKey] = key;
                inputElement.value = key;
                saveSettings();
            });

            inputElement.addEventListener("focus", function () {
                inputElement.select();
            });
        }

        bindKeyInput(keyToggleLeftInput, "hotkeyToggleLeft");
        bindKeyInput(keyHoldLeftInput, "hotkeyHoldLeft");
        bindKeyInput(keyToggleRightInput, "hotkeyToggleRight");
        bindKeyInput(keyHoldRightInput, "hotkeyHoldRight");
        bindKeyInput(menuKeyInput, "hotkeyMenu");
        bindKeyInput(freezeKeyInput, "hotkeyFreeze");

        updateStatusDisplay();
    }

    function toggleMenuVisibility() {
        createMenu();
        if (menuRoot.style.display === "none" || menuRoot.style.display === "") {
            menuRoot.style.display = "block";
            menuVisible = true;
        } else {
            menuRoot.style.display = "none";
            menuVisible = false;
        }
    }

    function statusText(enabled, mode, cps) {
        var text = enabled ? "ON" : "OFF";
        text += " · " + mode.toUpperCase();
        text += " · " + cps + " CPS";
        return text;
    }

    function updateStatusDisplay() {
        if (freezeStatusSpan) {
            freezeStatusSpan.textContent = settings.frozen ? "ON" : "OFF";
            freezeStatusSpan.style.color = settings.frozen ? "#60a5fa" : "#fbbf24";
        }
        if (!statusLeftSpan || !statusRightSpan) return;
        statusLeftSpan.textContent = statusText(settings.enabledLeft && !settings.frozen, settings.modeLeft, settings.cpsLeft);
        statusRightSpan.textContent = statusText(settings.enabledRight && !settings.frozen, settings.modeRight, settings.cpsRight);
        statusLeftSpan.style.color = (settings.enabledLeft && !settings.frozen) ? "#4ade80" : "#f87171";
        statusRightSpan.style.color = (settings.enabledRight && !settings.frozen) ? "#4ade80" : "#f87171";
    }

    function makeDraggable(container, handle) {
        var isDragging = false;
        var startX = 0;
        var startY = 0;
        var startLeft = 0;
        var startTop = 0;

        handle.addEventListener("mousedown", function (e) {
            e.preventDefault();
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            var rect = container.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;
            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        });

        function onMouseMove(e) {
            if (!isDragging) return;
            var dx = e.clientX - startX;
            var dy = e.clientY - startY;
            container.style.left = (startLeft + dx) + "px";
            container.style.top = (startTop + dy) + "px";
            container.style.right = "auto";
        }

        function onMouseUp() {
            if (!isDragging) return;
            isDragging = false;
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        }
    }

    // Lazily create menu, open with menu hotkey (default "m")
    // Freeze key default: "l"
})();
