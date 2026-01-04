// ==UserScript==
// @name         browser auto clicker
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  kewl auto clicker
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559192/browser%20auto%20clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/559192/browser%20auto%20clicker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let leftEnabled = false;
    let rightEnabled = false;
    let cps = 13; // default CPS
    const MIN_CPS = 1;
    const MAX_CPS = 500;

    let leftInterval = null;
    let rightInterval = null;

    let lastX = window.innerWidth / 2;
    let lastY = window.innerHeight / 2;

    // Track cursor
    window.addEventListener('mousemove', e => {
        lastX = e.clientX;
        lastY = e.clientY;
    }, { passive: true });

    window.addEventListener('touchmove', e => {
        if (e.touches.length > 0) {
            lastX = e.touches[0].clientX;
            lastY = e.touches[0].clientY;
        }
    }, { passive: true });

    // Click simulation
    function dispatchClick(buttonType) {
        const target = document.elementFromPoint(lastX, lastY);
        if (!target) return;

        const opts = {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: lastX,
            clientY: lastY,
            button: buttonType
        };

        target.dispatchEvent(new MouseEvent('mousedown', opts));
        target.dispatchEvent(new MouseEvent('mouseup', opts));
        target.dispatchEvent(new MouseEvent('click', opts));

        if (buttonType === 2) {
            target.dispatchEvent(new MouseEvent('contextmenu', opts));
        }
    }

    function intervalFromCPS() {
        return Math.max(1, 1000 / cps);
    }

    function startLeft() {
        if (leftInterval) return;
        leftInterval = setInterval(() => dispatchClick(0), intervalFromCPS());
    }

    function stopLeft() {
        clearInterval(leftInterval);
        leftInterval = null;
    }

    function startRight() {
        if (rightInterval) return;
        rightInterval = setInterval(() => dispatchClick(2), intervalFromCPS());
    }

    function stopRight() {
        clearInterval(rightInterval);
        rightInterval = null;
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
    // CPS POPUP
    // =========================
    let popup = null;

    function createPopup() {
        if (popup) return popup;

        popup = document.createElement('div');
        popup.id = 'cpsPopup';
        popup.innerHTML = `
            <div class="header">
                <span>CPS Settings</span>
                <button class="close">&times;</button>
            </div>
            <div class="body">
                <label>CPS (1–${MAX_CPS})</label>
                <input type="range" min="${MIN_CPS}" max="${MAX_CPS}" value="${cps}" class="slider">
                <input type="number" min="${MIN_CPS}" max="${MAX_CPS}" value="${cps}" class="num">
                <button class="apply">Apply</button>
            </div>
        `;

        const style = document.createElement('style');
        style.textContent = `
            #cpsPopup {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #111;
                color: #fff;
                padding: 14px;
                border-radius: 8px;
                z-index: 999999999 !important;
                width: 260px;
                font-family: Arial, sans-serif;
                box-shadow: 0 0 20px rgba(0,0,0,0.6);
            }
            #cpsPopup .header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
                font-weight: bold;
            }
            #cpsPopup .close {
                background: none;
                border: none;
                color: #fff;
                font-size: 18px;
                cursor: pointer;
            }
            #cpsPopup .body {
                display: flex;
                flex-direction: column;
                gap: 6px;
            }
            #cpsPopup .slider {
                width: 100%;
            }
            #cpsPopup .num {
                width: 100%;
                padding: 4px;
                background: #222;
                border: 1px solid #444;
                color: #fff;
                border-radius: 4px;
            }
            #cpsPopup .apply {
                margin-top: 6px;
                padding: 6px;
                background: #2e7dff;
                border: none;
                color: #fff;
                border-radius: 4px;
                cursor: pointer;
            }
        `;
        document.body.appendChild(style);
        document.body.appendChild(popup);

        const slider = popup.querySelector('.slider');
        const num = popup.querySelector('.num');
        const closeBtn = popup.querySelector('.close');
        const applyBtn = popup.querySelector('.apply');

        slider.oninput = () => num.value = slider.value;
        num.oninput = () => {
            let v = Math.max(MIN_CPS, Math.min(MAX_CPS, Number(num.value)));
            num.value = v;
            slider.value = v;
        };

        closeBtn.onclick = () => popup.style.display = 'none';

        applyBtn.onclick = () => {
            cps = Number(num.value);
            refreshIntervals();
            popup.style.display = 'none';
        };

        return popup;
    }

    function togglePopup() {
        const p = createPopup();
        p.style.display = (p.style.display === 'block') ? 'none' : 'block';
    }

    // =========================
    // KEYBINDS
    // =========================
    document.addEventListener('keydown', e => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;

        if (e.altKey && e.key.toLowerCase() === 'm') {
            e.preventDefault();
            togglePopup();
            return;
        }

        if (e.key.toLowerCase() === 'r') {
            leftEnabled = !leftEnabled;
            leftEnabled ? startLeft() : stopLeft();
            return;
        }

        if (e.key.toLowerCase() === 'f') {
            rightEnabled = !rightEnabled;
            rightEnabled ? startRight() : stopRight();
            return;
        }
    });

    console.log('[Autoclicker] Loaded. Default CPS = 13. R = left, F = right, ALT+M = CPS popup.');
})();
