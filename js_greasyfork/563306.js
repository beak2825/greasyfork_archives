// ==UserScript==
// @name         sensitivity speed [F8 ON OFF]
// @namespace    https://tampermonkey.net/
// @version      1.4
// @description  Direct numeric input (1-800), F7 focus, F8 toggle
// @match        https://minefun.io/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=minefun.io
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/563306/sensitivity%20speed%20%5BF8%20ON%20OFF%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/563306/sensitivity%20speed%20%5BF8%20ON%20OFF%5D.meta.js
// ==/UserScript==

(() => {
    'use strict';

    let multiplier = 2;
    let enabled = true;

    /* ===== movementX / movementY フック ===== */
    const proto = MouseEvent.prototype;
    const mx = Object.getOwnPropertyDescriptor(proto, 'movementX');
    const my = Object.getOwnPropertyDescriptor(proto, 'movementY');

    Object.defineProperty(proto, 'movementX', {
        get() {
            const v = mx.get.call(this);
            return enabled ? v * multiplier : v;
        }
    });

    Object.defineProperty(proto, 'movementY', {
        get() {
            const v = my.get.call(this);
            return enabled ? v * multiplier : v;
        }
    });

    /* ===== body待機 ===== */
    const waitBody = (cb) => {
        if (document.body) return cb();
        const obs = new MutationObserver(() => {
            if (document.body) {
                obs.disconnect();
                cb();
            }
        });
        obs.observe(document.documentElement, { childList: true });
    };

    waitBody(() => {
        if (document.getElementById('sens-gui')) return; // 二重防止

        const gui = document.createElement('div');
        gui.id = 'sens-gui';
        gui.style.cssText = `
            position: fixed;
            top: 50%;
            left: 8px;
            transform: translateY(-50%);
            z-index: 99999;
            background: rgba(0,0,0,0.65);
            color: #fff;
            font-family: sans-serif;
            padding: 6px 8px;
            border-radius: 6px;
            width: 135px;
            font-size: 11px;
            user-select: none;
        `;

        gui.innerHTML = `
            <div style="font-weight:bold;margin-bottom:4px;">🎯 Sens</div>

            <input id="slider" type="range"
                min="1" max="800" step="1" value="${multiplier}"
                style="width:100%">

            <div style="margin-top:3px;">
                x<input id="num" type="number"
                    min="1" max="800" value="${multiplier}"
                    style="width:60px;font-size:11px;margin-left:4px;">
            </div>

            <div id="state" style="
                margin-top:4px;
                text-align:center;
                border-radius:4px;
                padding:2px 0;
                background:#2ecc71;
            ">ON</div>

            <div style="margin-top:3px;text-align:center;opacity:0.7;">
                F7:input / F8:ON OFF
            </div>
        `;

        document.body.appendChild(gui);

        const slider = gui.querySelector('#slider');
        const num = gui.querySelector('#num');
        const state = gui.querySelector('#state');

        const applyValue = (v) => {
            v = Math.max(1, Math.min(800, v));
            multiplier = v;
            slider.value = v;
            num.value = v;
        };

        slider.oninput = () => applyValue(+slider.value);

        num.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                applyValue(+num.value);
                num.blur();
            }
        });

        const updateState = () => {
            state.textContent = enabled ? 'ON' : 'OFF';
            state.style.background = enabled ? '#2ecc71' : '#e74c3c';
        };

        window.addEventListener('keydown', e => {
            if (e.code === 'F8') {
                enabled = !enabled;
                updateState();
            }
            if (e.code === 'F7') {
                num.focus();
                num.select();
            }
        });

        updateState();
    });
})();
