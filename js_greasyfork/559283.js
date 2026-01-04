// ==UserScript==
// @name         Bast auto clicker
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  kewl auto clicker
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559283/Bast%20auto%20clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/559283/Bast%20auto%20clicker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let leftEnabled = false;
    let rightEnabled = false;

    // NEW: separate CPS values
    let leftCps = 14;
    let rightCps = 30;

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

    function intervalFromCPS(cps) {
        return Math.max(1, 1000 / cps);
    }

    function startLeft() {
        if (leftInterval) return;
        leftInterval = setInterval(() => dispatchClick(0), intervalFromCPS(leftCps));
    }

    function stopLeft() {
        clearInterval(leftInterval);
        leftInterval = null;
    }

    function startRight() {
        if (rightInterval) return;
        rightInterval = setInterval(() => dispatchClick(2), intervalFromCPS(rightCps));
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
    // CPS POPUP (now controls BOTH)
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
                <label>Left CPS (1–${MAX_CPS})</label>
                <input type="range" min="${MIN_CPS}" max="${MAX_CPS}" value="${leftCps}" class="sliderL">
                <input type="number" min="${MIN_CPS}" max="${MAX_CPS}" value="${leftCps}" class="numL">

                <label>Right CPS (1–${MAX_CPS})</label>
                <input type="range" min="${MIN_CPS}" max="${MAX_CPS}" value="${rightCps}" class="sliderR">
                <input type="number" min="${MIN_CPS}" max="${MAX_CPS}" value="${rightCps}" class="numR">

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
            #cpsPopup input {
                width: 100%;
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

        const sliderL = popup.querySelector('.sliderL');
        const numL = popup.querySelector('.numL');
        const sliderR = popup.querySelector('.sliderR');
        const numR = popup.querySelector('.numR');
        const closeBtn = popup.querySelector('.close');
        const applyBtn = popup.querySelector('.apply');

        sliderL.oninput = () => numL.value = sliderL.value;
        numL.oninput = () => {
            let v = Math.max(MIN_CPS, Math.min(MAX_CPS, Number(numL.value)));
            numL.value = v;
            sliderL.value = v;
        };

        sliderR.oninput = () => numR.value = sliderR.value;
        numR.oninput = () => {
            let v = Math.max(MIN_CPS, Math.min(MAX_CPS, Number(numR.value)));
            numR.value = v;
            sliderR.value = v;
        };

        closeBtn.onclick = () => popup.style.display = 'none';

        applyBtn.onclick = () => {
            leftCps = Number(numL.value);
            rightCps = Number(numR.value);
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

    console.log('[Autoclicker] Loaded. Left = 14 CPS, Right = 30 CPS. R = left, F = right, ALT+M = CPS popup.');
})();
