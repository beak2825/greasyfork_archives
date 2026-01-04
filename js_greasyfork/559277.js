// ==UserScript==
// @name         insane auto clicker
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Autoclicker that clicks at cursor position. R toggles left click, F toggles right click, ALT+M opens CPS selector popup (up to 500 CPS shared for both).
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559277/insane%20auto%20clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/559277/insane%20auto%20clicker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // =========================
    // State
    // =========================
    let leftEnabled = false;
    let rightEnabled = false;
    let cps = 24; // default CPS (updated)
    const MIN_CPS = 1;
    const MAX_CPS = 500;

    let leftInterval = null;
    let rightInterval = null;

    let lastX = window.innerWidth / 2;
    let lastY = window.innerHeight / 2;

    // =========================
    // Cursor tracking (mouse + touch)
    // =========================
    function updateCursorFromMouse(e) {
        lastX = e.clientX;
        lastY = e.clientY;
    }

    function updateCursorFromTouch(e) {
        if (e.touches && e.touches.length > 0) {
            lastX = e.touches[0].clientX;
            lastY = e.touches[0].clientY;
        }
    }

    window.addEventListener('mousemove', updateCursorFromMouse, { passive: true });
    window.addEventListener('touchmove', updateCursorFromTouch, { passive: true });

    // =========================
    // Click simulation
    // =========================
    function dispatchClickAtCursor(buttonType) {
        const target = document.elementFromPoint(lastX, lastY);
        if (!target) return;

        const down = new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: lastX,
            clientY: lastY,
            button: buttonType,
        });

        const up = new MouseEvent('mouseup', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: lastX,
            clientY: lastY,
            button: buttonType,
        });

        const click = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: lastX,
            clientY: lastY,
            button: buttonType,
        });

        target.dispatchEvent(down);
        target.dispatchEvent(up);
        target.dispatchEvent(click);

        if (buttonType === 2) {
            const context = new MouseEvent('contextmenu', {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: lastX,
                clientY: lastY,
                button: 2,
            });
            target.dispatchEvent(context);
        }
    }

    // =========================
    // Interval management
    // =========================
    function getIntervalFromCPS() {
        const interval = 1000 / cps;
        return Math.max(1, interval);
    }

    function startLeft() {
        if (leftInterval) return;
        leftInterval = setInterval(() => {
            dispatchClickAtCursor(0);
        }, getIntervalFromCPS());
    }

    function stopLeft() {
        if (leftInterval) {
            clearInterval(leftInterval);
            leftInterval = null;
        }
    }

    function startRight() {
        if (rightInterval) return;
        rightInterval = setInterval(() => {
            dispatchClickAtCursor(2);
        }, getIntervalFromCPS());
    }

    function stopRight() {
        if (rightInterval) {
            clearInterval(rightInterval);
            rightInterval = null;
        }
    }

    function refreshIntervals() {
        if (leftEnabled) {
            stopLeft();
            startLeft();
        }
        if (rightEnabled) {
            stopRight();
            startRight();
        }
    }

    // =========================
    // CPS Popup UI
    // =========================
    let popupEl = null;

    function createPopup() {
        if (popupEl) return popupEl;

        popupEl = document.createElement('div');
        popupEl.id = 'autoClickerCpsPopup';

        popupEl.innerHTML = `
            <div class="acp-header">
                <span>Autoclicker CPS</span>
                <button class="acp-close-btn" title="Close">&times;</button>
            </div>
            <div class="acp-body">
                <label class="acp-label">
                    CPS (1–${MAX_CPS})
                </label>
                <input type="range" min="${MIN_CPS}" max="${MAX_CPS}" value="${cps}" class="acp-slider">
                <input type="number" min="${MIN_CPS}" max="${MAX_CPS}" value="${cps}" class="acp-number">
                <div class="acp-row">
                    <button class="acp-apply-btn">Apply</button>
                </div>
                <div class="acp-info">
                    R = toggle left, F = toggle right, ALT+M = open CPS popup
                </div>
            </div>
        `;

        const style = document.createElement('style');
        style.textContent = `
            #autoClickerCpsPopup {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(20, 20, 20, 0.95);
                color: #f5f5f5;
                border-radius: 8px;
                padding: 12px 14px;
                z-index: 999999;
                font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                font-size: 13px;
                box-shadow: 0 0 12px rgba(0, 0, 0, 0.5);
                min-width: 260px;
                max-width: 320px;
            }
            #autoClickerCpsPopup .acp-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
                font-weight: 600;
            }
            #autoClickerCpsPopup .acp-close-btn {
                background: transparent;
                border: none;
                color: #f5f5f5;
                font-size: 16px;
                cursor: pointer;
                padding: 0 4px;
            }
            #autoClickerCpsPopup .acp-body {
                display: flex;
                flex-direction: column;
                gap: 6px;
            }
            #autoClickerCpsPopup .acp-label {
                margin-bottom: 2px;
                font-size: 12px;
                opacity: 0.9;
            }
            #autoClickerCpsPopup .acp-slider {
                width: 100%;
            }
            #autoClickerCpsPopup .acp-number {
                width: 100%;
                padding: 4px 6px;
                border-radius: 4px;
                border: 1px solid #555;
                background: #111;
                color: #f5f5f5;
                box-sizing: border-box;
            }
            #autoClickerCpsPopup .acp-row {
                display: flex;
                justify-content: flex-end;
                margin-top: 4px;
            }
            #autoClickerCpsPopup .acp-apply-btn {
                padding: 4px 10px;
                border-radius: 4px;
                border: none;
                background: #2e7dff;
                color: #fff;
                cursor: pointer;
                font-size: 12px;
            }
            #autoClickerCpsPopup .acp-apply-btn:hover {
                background: #1b5fd1;
            }
            #autoClickerCpsPopup .acp-info {
                font-size: 11px;
                opacity: 0.8;
                margin-top: 4px;
            }
        `;

        document.documentElement.appendChild(style);
        document.documentElement.appendChild(popupEl);

        const slider = popupEl.querySelector('.acp-slider');
        const numberInput = popupEl.querySelector('.acp-number');
        const closeBtn = popupEl.querySelector('.acp-close-btn');
        const applyBtn = popupEl.querySelector('.acp-apply-btn');

        slider.addEventListener('input', () => {
            numberInput.value = slider.value;
        });

        numberInput.addEventListener('input', () => {
            let val = parseInt(numberInput.value, 10);
            if (isNaN(val)) val = MIN_CPS;
            val = Math.max(MIN_CPS, Math.min(MAX_CPS, val));
            numberInput.value = val;
            slider.value = val;
        });

        closeBtn.addEventListener('click', () => {
            hidePopup();
        });

        applyBtn.addEventListener('click', () => {
            let val = parseInt(numberInput.value, 10);
            if (isNaN(val)) val = MIN_CPS;
            val = Math.max(MIN_CPS, Math.min(MAX_CPS, val));
            cps = val;
            slider.value = val;
            numberInput.value = val;
            refreshIntervals();
            hidePopup();
        });

        popupEl.addEventListener('keydown', (e) => {
            e.stopPropagation();
        });

        return popupEl;
    }

    function showPopup() {
        createPopup();
        popupEl.style.display = 'block';
    }

    function hidePopup() {
        if (popupEl) {
            popupEl.style.display = 'none';
        }
    }

    function togglePopup() {
        if (!popupEl || popupEl.style.display === 'none' || popupEl.style.display === '') {
            showPopup();
        } else {
            hidePopup();
        }
    }

    // =========================
    // Keybind handling
    // =========================
    function isTypingTarget(el) {
        if (!el) return false;
        const tag = el.tagName;
        const type = el.type ? el.type.toLowerCase() : '';
        return (
            tag === 'INPUT' ||
            tag === 'TEXTAREA' ||
            el.isContentEditable ||
            type === 'text' ||
            type === 'search' ||
            type === 'password' ||
            type === 'email' ||
            type === 'number'
        );
    }

    window.addEventListener('keydown', (e) => {
        if (isTypingTarget(document.activeElement)) {
            return;
        }

        if (e.altKey && (e.key === 'm' || e.key === 'M')) {
            e.preventDefault();
            togglePopup();
            return;
        }

        if (!e.altKey && !e.ctrlKey && !e.metaKey && (e.key === 'r' || e.key === 'R')) {
            e.preventDefault();
            leftEnabled = !leftEnabled;
            if (leftEnabled) {
                startLeft();
            } else {
                stopLeft();
            }
            console.log('[Autoclicker] Left:', leftEnabled ? 'ON' : 'OFF');
            return;
        }

        if (!e.altKey && !e.ctrlKey && !e.metaKey && (e.key === 'f' || e.key === 'F')) {
            e.preventDefault();
            rightEnabled = !rightEnabled;
            if (rightEnabled) {
                startRight();
            } else {
                stopRight();
            }
            console.log('[Autoclicker] Right:', rightEnabled ? 'ON' : 'OFF');
            return;
        }
    });

    console.log('[Autoclicker] Loaded. Default CPS = 24. R = left, F = right, ALT+M = CPS popup.');
})();
