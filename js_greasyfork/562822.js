// ==UserScript==
// @name         AUTO CLICK FR
// @namespace    https://greasyfork.org/en/users/NotNightmare
// @version      1.0
// @description  Dual left/right autoclicker with 0-100 CPS sliders, toggle/hold keys, and freeze key.
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562822/AUTO%20CLICK%20FR.user.js
// @updateURL https://update.greasyfork.org/scripts/562822/AUTO%20CLICK%20FR.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**********************
     * Utility & State
     **********************/

    const MouseButtonNames = {
        0: 'Mouse Left',
        1: 'Mouse Middle',
        2: 'Mouse Right',
        3: 'Mouse Back',
        4: 'Mouse Forward'
    };

    function keyEventToId(e) {
        if (e.type === 'mousedown' || e.type === 'mouseup') {
            return `MOUSE_${e.button}`;
        }
        // Keyboard
        let parts = [];
        if (e.ctrlKey) parts.push('Ctrl');
        if (e.altKey) parts.push('Alt');
        if (e.shiftKey) parts.push('Shift');
        if (e.metaKey) parts.push('Meta');
        parts.push(e.code || e.key);
        return parts.join('+');
    }

    function keyIdToLabel(id) {
        if (!id) return 'Unbound';
        if (id.startsWith('MOUSE_')) {
            const btn = parseInt(id.split('_')[1], 10);
            return MouseButtonNames[btn] || `Mouse ${btn}`;
        }
        return id;
    }

    function createEl(tag, props = {}, children = []) {
        const el = document.createElement(tag);
        Object.assign(el, props);
        for (const c of children) {
            if (typeof c === 'string') el.appendChild(document.createTextNode(c));
            else if (c) el.appendChild(c);
        }
        return el;
    }

    const state = {
        freezeKey: null,
        freezeActive: false,

        left: {
            cps: 10,
            toggleKey: null,
            holdKey: null,
            toggledOn: false,
            holdActive: false,
            intervalId: null
        },
        right: {
            cps: 10,
            toggleKey: null,
            holdKey: null,
            toggledOn: false,
            holdActive: false,
            intervalId: null
        },

        waitingForBind: null, // { target: 'leftToggle' | 'leftHold' | 'rightToggle' | 'rightHold' | 'freeze' }
        uiVisible: false
    };

    /**********************
     * Autoclick Logic
     **********************/

    function startClicker(side) {
        const cfg = state[side];
        stopClicker(side);

        if (state.freezeActive) return;
        if (!cfg.toggledOn && !cfg.holdActive) return;
        if (cfg.cps <= 0) return;

        const interval = 1000 / cfg.cps;
        cfg.intervalId = setInterval(() => {
            if (state.freezeActive) return;
            if (!cfg.toggledOn && !cfg.holdActive) return;

            const evt = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window,
                button: side === 'left' ? 0 : 2
            });
            document.dispatchEvent(evt);
        }, interval);
    }

    function stopClicker(side) {
        const cfg = state[side];
        if (cfg.intervalId) {
            clearInterval(cfg.intervalId);
            cfg.intervalId = null;
        }
    }

    function refreshClicker(side) {
        stopClicker(side);
        startClicker(side);
    }

    function setFreezeActive(active) {
        state.freezeActive = active;
        if (active) {
            stopClicker('left');
            stopClicker('right');
        } else {
            refreshClicker('left');
            refreshClicker('right');
        }
        updateUIStatus();
    }

    /**********************
     * UI
     **********************/

    let panel, statusLeft, statusRight, statusFreeze;
    let leftCpsSlider, rightCpsSlider, leftCpsLabel, rightCpsLabel;
    let leftToggleBtn, leftHoldBtn, rightToggleBtn, rightHoldBtn, freezeBtn;

    function buildUI() {
        if (panel) return;

        panel = createEl('div', {
            style: `
                position: fixed;
                top: 80px;
                right: 20px;
                z-index: 999999;
                background: rgba(15,15,20,0.95);
                color: #eee;
                font-family: system-ui, sans-serif;
                font-size: 12px;
                padding: 10px 12px;
                border-radius: 8px;
                box-shadow: 0 4px 16px rgba(0,0,0,0.4);
                width: 260px;
                display: none;
            `
        });

        const title = createEl('div', {
            style: 'font-weight:bold; margin-bottom:6px; font-size:13px;'
        }, ['Dual Autoclicker']);

        const hint = createEl('div', {
            style: 'font-size:11px; opacity:0.7; margin-bottom:8px;'
        }, ['Open/close: Right Shift + Period']);

        // Left section
        const leftHeader = createEl('div', {
            style: 'margin-top:4px; font-weight:bold;'
        }, ['Left Click']);

        leftCpsSlider = createEl('input', {
            type: 'range',
            min: '0',
            max: '100',
            value: String(state.left.cps),
            style: 'width:100%;'
        });
        leftCpsLabel = createEl('div', {
            style: 'font-size:11px; margin-bottom:4px;'
        }, [`CPS: ${state.left.cps}`]);

        leftToggleBtn = createEl('button', {
            type: 'button',
            style: buttonStyle()
        }, ['Toggle: ', keyIdToLabel(state.left.toggleKey)]);
        leftHoldBtn = createEl('button', {
            type: 'button',
            style: buttonStyle()
        }, ['Hold: ', keyIdToLabel(state.left.holdKey)]);

        statusLeft = createEl('div', {
            style: 'font-size:11px; margin-top:3px;'
        }, ['Status: OFF']);

        // Right section
        const rightHeader = createEl('div', {
            style: 'margin-top:8px; font-weight:bold;'
        }, ['Right Click']);

        rightCpsSlider = createEl('input', {
            type: 'range',
            min: '0',
            max: '100',
            value: String(state.right.cps),
            style: 'width:100%;'
        });
        rightCpsLabel = createEl('div', {
            style: 'font-size:11px; margin-bottom:4px;'
        }, [`CPS: ${state.right.cps}`]);

        rightToggleBtn = createEl('button', {
            type: 'button',
            style: buttonStyle()
        }, ['Toggle: ', keyIdToLabel(state.right.toggleKey)]);
        rightHoldBtn = createEl('button', {
            type: 'button',
            style: buttonStyle()
        }, ['Hold: ', keyIdToLabel(state.right.holdKey)]);

        statusRight = createEl('div', {
            style: 'font-size:11px; margin-top:3px;'
        }, ['Status: OFF']);

        // Freeze
        const freezeHeader = createEl('div', {
            style: 'margin-top:8px; font-weight:bold;'
        }, ['Freeze']);

        freezeBtn = createEl('button', {
            type: 'button',
            style: buttonStyle()
        }, ['Freeze key: ', keyIdToLabel(state.freezeKey)]);

        statusFreeze = createEl('div', {
            style: 'font-size:11px; margin-top:3px;'
        }, ['Freeze: OFF']);

        // Close hint
        const closeHint = createEl('div', {
            style: 'font-size:10px; opacity:0.6; margin-top:6px; text-align:right;'
        }, ['Click outside or press hotkey to hide']);

        panel.appendChild(title);
        panel.appendChild(hint);

        panel.appendChild(leftHeader);
        panel.appendChild(leftCpsSlider);
        panel.appendChild(leftCpsLabel);
        panel.appendChild(leftToggleBtn);
        panel.appendChild(leftHoldBtn);
        panel.appendChild(statusLeft);

        panel.appendChild(rightHeader);
        panel.appendChild(rightCpsSlider);
        panel.appendChild(rightCpsLabel);
        panel.appendChild(rightToggleBtn);
        panel.appendChild(rightHoldBtn);
        panel.appendChild(statusRight);

        panel.appendChild(freezeHeader);
        panel.appendChild(freezeBtn);
        panel.appendChild(statusFreeze);

        panel.appendChild(closeHint);

        document.body.appendChild(panel);

        wireUIEvents();
    }

    function buttonStyle() {
        return `
            margin: 2px 2px 0 0;
            padding: 2px 6px;
            font-size: 11px;
            border-radius: 4px;
            border: 1px solid #555;
            background: #222;
            color: #eee;
            cursor: pointer;
        `;
    }

    function wireUIEvents() {
        leftCpsSlider.addEventListener('input', () => {
            state.left.cps = parseInt(leftCpsSlider.value, 10);
            leftCpsLabel.textContent = `CPS: ${state.left.cps}`;
            refreshClicker('left');
        });

        rightCpsSlider.addEventListener('input', () => {
            state.right.cps = parseInt(rightCpsSlider.value, 10);
            rightCpsLabel.textContent = `CPS: ${state.right.cps}`;
            refreshClicker('right');
        });

        leftToggleBtn.addEventListener('click', () => {
            state.waitingForBind = 'leftToggle';
            leftToggleBtn.textContent = 'Toggle: [press key or mouse]';
        });

        leftHoldBtn.addEventListener('click', () => {
            state.waitingForBind = 'leftHold';
            leftHoldBtn.textContent = 'Hold: [press key or mouse]';
        });

        rightToggleBtn.addEventListener('click', () => {
            state.waitingForBind = 'rightToggle';
            rightToggleBtn.textContent = 'Toggle: [press key or mouse]';
        });

        rightHoldBtn.addEventListener('click', () => {
            state.waitingForBind = 'rightHold';
            rightHoldBtn.textContent = 'Hold: [press key or mouse]';
        });

        freezeBtn.addEventListener('click', () => {
            state.waitingForBind = 'freeze';
            freezeBtn.textContent = 'Freeze key: [press key or mouse]';
        });

        document.addEventListener('mousedown', (e) => {
            if (state.waitingForBind) {
                e.preventDefault();
                e.stopPropagation();
                handleBindFromEvent(e);
            }
        }, true);

        document.addEventListener('keydown', (e) => {
            if (state.waitingForBind) {
                e.preventDefault();
                e.stopPropagation();
                handleBindFromEvent(e);
            }
        }, true);

        document.addEventListener('click', (e) => {
            if (!panel || !state.uiVisible) return;
            if (!panel.contains(e.target)) {
                toggleUI(false);
            }
        });
    }

    function handleBindFromEvent(e) {
        const id = keyEventToId(e);

        switch (state.waitingForBind) {
            case 'leftToggle':
                state.left.toggleKey = id;
                leftToggleBtn.textContent = 'Toggle: ' + keyIdToLabel(id);
                break;
            case 'leftHold':
                state.left.holdKey = id;
                leftHoldBtn.textContent = 'Hold: ' + keyIdToLabel(id);
                break;
            case 'rightToggle':
                state.right.toggleKey = id;
                rightToggleBtn.textContent = 'Toggle: ' + keyIdToLabel(id);
                break;
            case 'rightHold':
                state.right.holdKey = id;
                rightHoldBtn.textContent = 'Hold: ' + keyIdToLabel(id);
                break;
            case 'freeze':
                state.freezeKey = id;
                freezeBtn.textContent = 'Freeze key: ' + keyIdToLabel(id);
                break;
        }

        state.waitingForBind = null;
        updateUIStatus();
    }

    function toggleUI(force) {
        buildUI();
        if (typeof force === 'boolean') {
            state.uiVisible = force;
        } else {
            state.uiVisible = !state.uiVisible;
        }
        panel.style.display = state.uiVisible ? 'block' : 'none';
    }

    function updateUIStatus() {
        if (!panel) return;

        const leftOn = (state.left.toggledOn || state.left.holdActive) && !state.freezeActive && state.left.cps > 0;
        const rightOn = (state.right.toggledOn || state.right.holdActive) && !state.freezeActive && state.right.cps > 0;

        statusLeft.textContent = `Status: ${leftOn ? 'ON' : 'OFF'}`;
        statusRight.textContent = `Status: ${rightOn ? 'ON' : 'OFF'}`;
        statusFreeze.textContent = `Freeze: ${state.freezeActive ? 'ON' : 'OFF'}`;
    }

    /**********************
     * Global Input Handling
     **********************/

    function handleKeyOrMouseDown(e) {
        const id = keyEventToId(e);

        // Freeze key (hold)
        if (state.freezeKey && id === state.freezeKey) {
            setFreezeActive(true);
            return;
        }

        // Left hold
        if (state.left.holdKey && id === state.left.holdKey) {
            state.left.holdActive = true;
            refreshClicker('left');
            updateUIStatus();
        }

        // Right hold
        if (state.right.holdKey && id === state.right.holdKey) {
            state.right.holdActive = true;
            refreshClicker('right');
            updateUIStatus();
        }

        // Left toggle
        if (state.left.toggleKey && id === state.left.toggleKey) {
            state.left.toggledOn = !state.left.toggledOn;
            refreshClicker('left');
            updateUIStatus();
        }

        // Right toggle
        if (state.right.toggleKey && id === state.right.toggleKey) {
            state.right.toggledOn = !state.right.toggledOn;
            refreshClicker('right');
            updateUIStatus();
        }
    }

    function handleKeyOrMouseUp(e) {
        const id = keyEventToId(e);

        // Freeze key release
        if (state.freezeKey && id === state.freezeKey) {
            setFreezeActive(false);
            return;
        }

        // Left hold release
        if (state.left.holdKey && id === state.left.holdKey) {
            state.left.holdActive = false;
            refreshClicker('left');
            updateUIStatus();
        }

        // Right hold release
        if (state.right.holdKey && id === state.right.holdKey) {
            state.right.holdActive = false;
            refreshClicker('right');
            updateUIStatus();
        }
    }

    // Menu hotkey: Right Shift + Period
    function isMenuHotkey(e) {
        return e.code === 'Period' && e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey && e.location === KeyboardEvent.DOM_KEY_LOCATION_RIGHT;
    }

    document.addEventListener('keydown', (e) => {
        if (isMenuHotkey(e)) {
            e.preventDefault();
            toggleUI();
            return;
        }
    }, true);

    document.addEventListener('keydown', (e) => {
        if (state.waitingForBind) return; // binding mode handled separately
        handleKeyOrMouseDown(e);
    }, true);

    document.addEventListener('keyup', (e) => {
        if (state.waitingForBind) return;
        handleKeyOrMouseUp(e);
    }, true);

    document.addEventListener('mousedown', (e) => {
        if (state.waitingForBind) return;
        handleKeyOrMouseDown(e);
    }, true);

    document.addEventListener('mouseup', (e) => {
        if (state.waitingForBind) return;
        handleKeyOrMouseUp(e);
    }, true);

})();
