// ==UserScript==
// @name         Better Bloxd (broken)
// @namespace    https://greasyfork.org/users/yourname
// @version      1.0.0
// @description  Toggleable left/right autoclicker with rebindable hotkeys and separate CPS for each button. Menu on Right Shift by default.
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559440/Better%20Bloxd%20%28broken%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559440/Better%20Bloxd%20%28broken%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===========================
    //  SETTINGS & LOCALSTORAGE
    // ===========================
    const STORAGE_PREFIX = 'prism_autoclicker_';
    const LS_KEYS = {
        leftKey: STORAGE_PREFIX + 'left_key',
        rightKey: STORAGE_PREFIX + 'right_key',
        menuKey: STORAGE_PREFIX + 'menu_key',
        leftCPS: STORAGE_PREFIX + 'left_cps',
        rightCPS: STORAGE_PREFIX + 'right_cps',
        leftEnabled: STORAGE_PREFIX + 'left_enabled',
        rightEnabled: STORAGE_PREFIX + 'right_enabled'
    };

    const DEFAULTS = {
        leftKeyCode: 'KeyR',
        rightKeyCode: 'KeyF',
        menuKeyCode: 'ShiftRight',
        leftCPS: 20,
        rightCPS: 20,
        leftEnabled: false,
        rightEnabled: false
    };

    function loadSetting(key, fallback) {
        const v = localStorage.getItem(key);
        if (v === null || v === undefined) return fallback;
        if (v === 'true') return true;
        if (v === 'false') return false;
        const n = Number(v);
        return Number.isNaN(n) ? v : n;
    }

    function saveSetting(key, value) {
        localStorage.setItem(key, String(value));
    }

    // Current settings
    let leftKeyCode = loadSetting(LS_KEYS.leftKey, DEFAULTS.leftKeyCode);
    let rightKeyCode = loadSetting(LS_KEYS.rightKey, DEFAULTS.rightKeyCode);
    let menuKeyCode = loadSetting(LS_KEYS.menuKey, DEFAULTS.menuKeyCode);
    let leftCPS = clamp(loadSetting(LS_KEYS.leftCPS, DEFAULTS.leftCPS), 1, 100);
    let rightCPS = clamp(loadSetting(LS_KEYS.rightCPS, DEFAULTS.rightCPS), 1, 100);
    let leftEnabled = !!loadSetting(LS_KEYS.leftEnabled, DEFAULTS.leftEnabled);
    let rightEnabled = !!loadSetting(LS_KEYS.rightEnabled, DEFAULTS.rightEnabled);

    function clamp(v, min, max) {
        return Math.max(min, Math.min(max, v));
    }

    // ===========================
    //  CURSOR TRACKING
    // ===========================
    let cursorX = window.innerWidth / 2;
    let cursorY = window.innerHeight / 2;

    document.addEventListener('mousemove', function(e) {
        cursorX = e.clientX;
        cursorY = e.clientY;
    }, { passive: true });

    document.addEventListener('touchmove', function(e) {
        const t = e.touches[0];
        if (!t) return;
        cursorX = t.clientX;
        cursorY = t.clientY;
    }, { passive: true });

    document.addEventListener('touchstart', function(e) {
        const t = e.touches[0];
        if (!t) return;
        cursorX = t.clientX;
        cursorY = t.clientY;
    }, { passive: true });

    // ===========================
    //  AUTCLICK LOGIC
    // ===========================
    let leftIntervalId = null;
    let rightIntervalId = null;

    function getTargetElement() {
        const el = document.elementFromPoint(cursorX, cursorY);
        if (!el) return null;
        // Avoid clicking inside our own UI
        if (uiContainer && uiContainer.contains(el)) return null;
        return el;
    }

    function dispatchClick(target, button) {
        if (!target) return;
        const clientX = cursorX;
        const clientY = cursorY;

        const opts = {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX,
            clientY,
            button,
            buttons: 1 << button
        };

        const down = new MouseEvent('mousedown', opts);
        const up = new MouseEvent('mouseup', opts);
        target.dispatchEvent(down);
        target.dispatchEvent(up);

        // For left-click, also send a 'click' event
        if (button === 0) {
            const click = new MouseEvent('click', opts);
            target.dispatchEvent(click);
        }

        // For right-click, send contextmenu as well
        if (button === 2) {
            const ctx = new MouseEvent('contextmenu', opts);
            target.dispatchEvent(ctx);
        }
    }

    function setLeftEnabled(on) {
        leftEnabled = !!on;
        saveSetting(LS_KEYS.leftEnabled, leftEnabled);
        updateUIStatus();
        restartLeftInterval();
    }

    function setRightEnabled(on) {
        rightEnabled = !!on;
        saveSetting(LS_KEYS.rightEnabled, rightEnabled);
        updateUIStatus();
        restartRightInterval();
    }

    function restartLeftInterval() {
        if (leftIntervalId !== null) {
            clearInterval(leftIntervalId);
            leftIntervalId = null;
        }
        if (!leftEnabled) return;

        const interval = 1000 / clamp(leftCPS, 1, 100);
        leftIntervalId = setInterval(() => {
            if (!leftEnabled) return;
            if (isMenuOpen) return;
            const target = getTargetElement();
            if (!target) return;
            dispatchClick(target, 0);
        }, interval);
    }

    function restartRightInterval() {
        if (rightIntervalId !== null) {
            clearInterval(rightIntervalId);
            rightIntervalId = null;
        }
        if (!rightEnabled) return;

        const interval = 1000 / clamp(rightCPS, 1, 100);
        rightIntervalId = setInterval(() => {
            if (!rightEnabled) return;
            if (isMenuOpen) return;
            const target = getTargetElement();
            if (!target) return;
            dispatchClick(target, 2);
        }, interval);
    }

    // Start intervals if enabled from last session
    restartLeftInterval();
    restartRightInterval();

    // ===========================
    //  UI CREATION
    // ===========================
    let uiContainer = null;
    let isMenuOpen = false;
    let waitingForKey = null; // 'left' | 'right' | 'menu' | null

    function createUI() {
        if (uiContainer) return;

        const style = document.createElement('style');
        style.textContent = `
.prism-ac-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 999999;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    color: #f5f5f5;
    background: rgba(10, 10, 20, 0.95);
    border-radius: 10px;
    border: 1px solid rgba(120, 200, 255, 0.6);
    box-shadow: 0 0 20px rgba(0, 150, 255, 0.4);
    padding: 10px 12px;
    min-width: 260px;
    max-width: 320px;
    backdrop-filter: blur(8px);
    display: none;
}

.prism-ac-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
    font-size: 13px;
}

.prism-ac-title {
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #9ae6ff;
}

.prism-ac-close {
    cursor: pointer;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 12px;
    color: #ccc;
}

.prism-ac-close:hover {
    background: rgba(255, 255, 255, 0.08);
}

.prism-ac-section-title {
    margin: 6px 0 4px 0;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #9fb3ff;
}

.prism-ac-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    margin-bottom: 6px;
    font-size: 12px;
}

.prism-ac-label {
    flex: 1 1 auto;
    font-size: 12px;
    color: #e0e7ff;
}

.prism-ac-status {
    font-size: 11px;
    padding: 2px 6px;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    min-width: 60px;
    text-align: center;
}

.prism-ac-status.on {
    color: #c6ffdd;
    border-color: rgba(0, 255, 170, 0.7);
    box-shadow: 0 0 8px rgba(0, 255, 170, 0.4);
}

.prism-ac-status.off {
    color: #ffcccc;
    border-color: rgba(255, 120, 120, 0.6);
}

.prism-ac-slider-row {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
}

.prism-ac-slider-row input[type="range"] {
    flex: 1 1 auto;
}

.prism-ac-slider-value {
    width: 32px;
    text-align: right;
    font-size: 11px;
    color: #cbd5f5;
}

.prism-ac-key-btn {
    font-size: 11px;
    padding: 3px 6px;
    border-radius: 6px;
    border: 1px solid rgba(130, 200, 255, 0.7);
    background: rgba(15, 23, 42, 0.9);
    color: #dbeafe;
    cursor: pointer;
    min-width: 86px;
    text-align: center;
}

.prism-ac-key-btn.waiting {
    border-style: dashed;
    border-color: rgba(255, 200, 90, 0.9);
    color: #fde68a;
    box-shadow: 0 0 10px rgba(251, 191, 36, 0.4);
}

.prism-ac-key-btn:hover {
    background: rgba(30, 64, 175, 0.8);
}

.prism-ac-hint {
    font-size: 11px;
    color: #a5b4fc;
    opacity: 0.9;
    margin-top: 4px;
}

.prism-ac-divider {
    border-top: 1px solid rgba(148, 163, 184, 0.4);
    margin: 4px 0 6px 0;
}
        `;
        document.documentElement.appendChild(style);

        uiContainer = document.createElement('div');
        uiContainer.className = 'prism-ac-container';
        uiContainer.innerHTML = `
<div class="prism-ac-header">
  <div class="prism-ac-title">Prism AutoClicker</div>
  <div class="prism-ac-close" title="Hide menu">✕</div>
</div>

<div class="prism-ac-section-title">Status</div>
<div class="prism-ac-row">
  <div class="prism-ac-label">Left click</div>
  <div class="prism-ac-status" id="prism-ac-left-status"></div>
</div>
<div class="prism-ac-row">
  <div class="prism-ac-label">Right click</div>
  <div class="prism-ac-status" id="prism-ac-right-status"></div>
</div>

<div class="prism-ac-divider"></div>

<div class="prism-ac-section-title">CPS (Clicks per second)</div>
<div class="prism-ac-slider-row">
  <div class="prism-ac-label">Left</div>
  <input type="range" min="1" max="100" step="1" id="prism-ac-left-cps-slider">
  <div class="prism-ac-slider-value" id="prism-ac-left-cps-value"></div>
</div>
<div class="prism-ac-slider-row">
  <div class="prism-ac-label">Right</div>
  <input type="range" min="1" max="100" step="1" id="prism-ac-right-cps-slider">
  <div class="prism-ac-slider-value" id="prism-ac-right-cps-value"></div>
</div>

<div class="prism-ac-divider"></div>

<div class="prism-ac-section-title">Hotkeys</div>
<div class="prism-ac-row">
  <div class="prism-ac-label">Toggle left</div>
  <button class="prism-ac-key-btn" id="prism-ac-left-key-btn"></button>
</div>
<div class="prism-ac-row">
  <div class="prism-ac-label">Toggle right</div>
  <button class="prism-ac-key-btn" id="prism-ac-right-key-btn"></button>
</div>
<div class="prism-ac-row">
  <div class="prism-ac-label">Toggle menu</div>
  <button class="prism-ac-key-btn" id="prism-ac-menu-key-btn"></button>
</div>

<div class="prism-ac-hint">
  • Default: Left = R, Right = F, Menu = Right Shift<br>
  • Press the buttons above, then press any key to rebind.
</div>
        `;
        document.body.appendChild(uiContainer);

        const closeBtn = uiContainer.querySelector('.prism-ac-close');
        const leftStatusEl = document.getElementById('prism-ac-left-status');
        const rightStatusEl = document.getElementById('prism-ac-right-status');
        const leftSlider = document.getElementById('prism-ac-left-cps-slider');
        const rightSlider = document.getElementById('prism-ac-right-cps-slider');
        const leftValue = document.getElementById('prism-ac-left-cps-value');
        const rightValue = document.getElementById('prism-ac-right-cps-value');
        const leftKeyBtn = document.getElementById('prism-ac-left-key-btn');
        const rightKeyBtn = document.getElementById('prism-ac-right-key-btn');
        const menuKeyBtn = document.getElementById('prism-ac-menu-key-btn');

        function codeToLabel(code) {
            if (!code) return '?';
            if (code.startsWith('Key') && code.length === 4) return code.slice(3);
            if (code.startsWith('Digit') && code.length === 6) return code.slice(5);
            if (code === 'ShiftRight') return 'Right Shift';
            if (code === 'ShiftLeft') return 'Left Shift';
            if (code === 'ControlLeft') return 'Left Ctrl';
            if (code === 'ControlRight') return 'Right Ctrl';
            if (code === 'AltLeft') return 'Left Alt';
            if (code === 'AltRight') return 'Right Alt';
            if (code === 'Space') return 'Space';
            if (code === 'Enter') return 'Enter';
            if (code === 'Escape') return 'Esc';
            if (code === 'Tab') return 'Tab';
            return code;
        }

        function updateKeyButtons() {
            leftKeyBtn.textContent = (waitingForKey === 'left')
                ? 'Press a key...'
                : codeToLabel(leftKeyCode);
            rightKeyBtn.textContent = (waitingForKey === 'right')
                ? 'Press a key...'
                : codeToLabel(rightKeyCode);
            menuKeyBtn.textContent = (waitingForKey === 'menu')
                ? 'Press a key...'
                : codeToLabel(menuKeyCode);

            leftKeyBtn.classList.toggle('waiting', waitingForKey === 'left');
            rightKeyBtn.classList.toggle('waiting', waitingForKey === 'right');
            menuKeyBtn.classList.toggle('waiting', waitingForKey === 'menu');
        }

        function updateStatus() {
            if (!leftStatusEl || !rightStatusEl) return;
            leftStatusEl.textContent = leftEnabled ? 'ON' : 'OFF';
            rightStatusEl.textContent = rightEnabled ? 'ON' : 'OFF';
            leftStatusEl.classList.toggle('on', leftEnabled);
            leftStatusEl.classList.toggle('off', !leftEnabled);
            rightStatusEl.classList.toggle('on', rightEnabled);
            rightStatusEl.classList.toggle('off', !rightEnabled);
        }

        // Expose to outer scope
        updateUIStatus = updateStatus;

        // Init CPS controls
        leftSlider.value = leftCPS;
        rightSlider.value = rightCPS;
        leftValue.textContent = leftCPS;
        rightValue.textContent = rightCPS;

        leftSlider.addEventListener('input', () => {
            leftCPS = clamp(Number(leftSlider.value), 1, 100);
            saveSetting(LS_KEYS.leftCPS, leftCPS);
            leftValue.textContent = leftCPS;
            restartLeftInterval();
        });

        rightSlider.addEventListener('input', () => {
            rightCPS = clamp(Number(rightSlider.value), 1, 100);
            saveSetting(LS_KEYS.rightCPS, rightCPS);
            rightValue.textContent = rightCPS;
            restartRightInterval();
        });

        // Key rebind buttons
        leftKeyBtn.addEventListener('click', () => {
            waitingForKey = (waitingForKey === 'left') ? null : 'left';
            updateKeyButtons();
        });

        rightKeyBtn.addEventListener('click', () => {
            waitingForKey = (waitingForKey === 'right') ? null : 'right';
            updateKeyButtons();
        });

        menuKeyBtn.addEventListener('click', () => {
            waitingForKey = (waitingForKey === 'menu') ? null : 'menu';
            updateKeyButtons();
        });

        closeBtn.addEventListener('click', () => {
            setMenuOpen(false);
        });

        updateKeyButtons();
        updateStatus();
    }

    // Placeholder, will be replaced in createUI
    let updateUIStatus = function() {};

    function setMenuOpen(open) {
        isMenuOpen = !!open;
        if (!uiContainer) return;
        uiContainer.style.display = isMenuOpen ? 'block' : 'none';
        if (!isMenuOpen) {
            waitingForKey = null;
            const keyButtons = uiContainer.querySelectorAll('.prism-ac-key-btn');
            keyButtons.forEach(btn => btn.classList.remove('waiting'));
        }
    }

    function toggleMenu() {
        if (!uiContainer) createUI();
        setMenuOpen(!isMenuOpen);
    }

    // ===========================
    //  KEYBOARD HANDLING
    // ===========================
    document.addEventListener('keydown', function(e) {
        // Ignore in input/textarea/contentEditable unless we're rebinding
        const target = e.target;
        const tag = (target && target.tagName) ? target.tagName.toLowerCase() : '';
        const isTypingField = tag === 'input' || tag === 'textarea' || (target && target.isContentEditable);
        if (!waitingForKey && isTypingField) return;

        // Rebinding logic
        if (waitingForKey) {
            e.preventDefault();
            e.stopPropagation();

            const code = e.code || '';
            if (!code) return;

            if (waitingForKey === 'left') {
                leftKeyCode = code;
                saveSetting(LS_KEYS.leftKey, leftKeyCode);
            } else if (waitingForKey === 'right') {
                rightKeyCode = code;
                saveSetting(LS_KEYS.rightKey, rightKeyCode);
            } else if (waitingForKey === 'menu') {
                menuKeyCode = code;
                saveSetting(LS_KEYS.menuKey, menuKeyCode);
            }

            waitingForKey = null;
            if (uiContainer) {
                const leftKeyBtn = document.getElementById('prism-ac-left-key-btn');
                const rightKeyBtn = document.getElementById('prism-ac-right-key-btn');
                const menuKeyBtn = document.getElementById('prism-ac-menu-key-btn');
                const all = [leftKeyBtn, rightKeyBtn, menuKeyBtn];
                all.forEach(btn => btn && btn.classList.remove('waiting'));
                // Update labels
                const evt = new Event('click'); // dummy, we won't actually use it
                // Safer: call update via function inside createUI if needed
            }
            // Rebuild labels
            createUI(); // ensures key text refresh
            return;
        }

        if (e.repeat) return;

        // Normal key handling
        const code = e.code || '';
        if (!code) return;

        if (code === menuKeyCode) {
            e.preventDefault();
            toggleMenu();
            return;
        }

        if (code === leftKeyCode) {
            e.preventDefault();
            setLeftEnabled(!leftEnabled);
            return;
        }

        if (code === rightKeyCode) {
            e.preventDefault();
            setRightEnabled(!rightEnabled);
            return;
        }
    }, true);

    // Create UI lazily on first toggle/menu open
    // But if you want it to show immediately:
    createUI();
})();
