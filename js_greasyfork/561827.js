// ==UserScript==
// @name         Speedslicer Configurable Clicker 2026
// @namespace    tampermonkey.net
// @version      2026.01
// @description  Portable GUI with 10-750ms configuration. \ = Menu | [ = Left | ] = Right
// @author       User
// @match        https://tuff.speedslicer.dev/files/1_1UT12/WASM/
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561827/Speedslicer%20Configurable%20Clicker%202026.user.js
// @updateURL https://update.greasyfork.org/scripts/561827/Speedslicer%20Configurable%20Clicker%202026.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let leftActive = false, rightActive = false;
    let leftInterval, rightInterval;
    let settings = { leftSpeed: 40, rightSpeed: 250 };

    // --- GUI SETUP ---
    const container = document.createElement('div');
    document.documentElement.appendChild(container);
    const shadow = container.attachShadow({mode: 'open'});

    const gui = document.createElement('div');
    gui.style.cssText = `
        position: fixed; top: 50px; left: 50px; width: 220px;
        background: #111; color: #0f0; padding: 15px;
        border-radius: 10px; border: 2px solid #444;
        z-index: 2147483647; font-family: sans-serif;
        box-shadow: 0 0 15px rgba(0,0,0,0.8); display: block;
    `;

    gui.innerHTML = `
        <div id="header" style="cursor:move; background:#222; color:#fff; text-align:center; padding:8px; margin:-15px -15px 15px -15px; border-radius:8px 8px 0 0; font-weight:bold; font-size:13px;">
            🖱️ CLICKER CONFIG
        </div>

        <div style="margin-bottom: 15px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                <label style="font-size:12px;">[ Links (<span id="l-val">${settings.leftSpeed}</span>ms)</label>
                <div id="l-light" style="width:10px; height:10px; border-radius:50%; background:#300;"></div>
            </div>
            <input type="range" id="l-speed" min="10" max="750" value="${settings.leftSpeed}" style="width:100%; accent-color:#0f0;">
        </div>

        <div style="margin-bottom: 15px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                <label style="font-size:12px;">] Rechts (<span id="r-val">${settings.rightSpeed}</span>ms)</label>
                <div id="r-light" style="width:10px; height:10px; border-radius:50%; background:#300;"></div>
            </div>
            <input type="range" id="r-speed" min="10" max="750" value="${settings.rightSpeed}" style="width:100%; accent-color:#0f0;">
        </div>

        <div style="font-size:10px; color:#888; text-align:center; border-top:1px solid #333; padding-top:5px;">
            \\ = Menu verbergen/tonen
        </div>
    `;
    shadow.appendChild(gui);

    // --- SLEEPFUNCTIE ---
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    shadow.getElementById('header').onmousedown = (e) => {
        e.preventDefault();
        pos3 = e.clientX; pos4 = e.clientY;
        document.onmouseup = () => { document.onmouseup = null; document.onmousemove = null; };
        document.onmousemove = (e) => {
            pos1 = pos3 - e.clientX; pos2 = pos4 - e.clientY;
            pos3 = e.clientX; pos4 = e.clientY;
            gui.style.top = (gui.offsetTop - pos2) + "px";
            gui.style.left = (gui.offsetLeft - pos1) + "px";
        };
    };

    // --- KLIK LOGICA ---
    function doClick(btn) {
        const canvas = document.querySelector('canvas') || document.body;
        const rect = canvas.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        const opts = { bubbles: true, cancelable: true, view: window, clientX: x, clientY: y, button: btn, buttons: btn === 0 ? 1 : 2 };

        canvas.dispatchEvent(new PointerEvent('pointerdown', opts));
        canvas.dispatchEvent(new MouseEvent('mousedown', opts));
        setTimeout(() => {
            canvas.dispatchEvent(new PointerEvent('pointerup', opts));
            canvas.dispatchEvent(new MouseEvent('mouseup', opts));
        }, 5);
    }

    // --- INPUT HANDLERS ---
    shadow.getElementById('l-speed').oninput = (e) => {
        settings.leftSpeed = e.target.value;
        shadow.getElementById('l-val').innerText = e.target.value;
        if(leftActive) { clearInterval(leftInterval); leftInterval = setInterval(() => doClick(0), settings.leftSpeed); }
    };

    shadow.getElementById('r-speed').oninput = (e) => {
        settings.rightSpeed = e.target.value;
        shadow.getElementById('r-val').innerText = e.target.value;
        if(rightActive) { clearInterval(rightInterval); rightInterval = setInterval(() => doClick(2), settings.rightSpeed); }
    };

    // --- HOTKEYS ---
    window.addEventListener('keydown', (e) => {
        if (e.key === '\\') gui.style.display = gui.style.display === 'none' ? 'block' : 'none';

        if (e.key === '[') {
            leftActive = !leftActive;
            if (leftActive) leftInterval = setInterval(() => doClick(0), settings.leftSpeed);
            else clearInterval(leftInterval);
            shadow.getElementById('l-light').style.background = leftActive ? '#0f0' : '#300';
            shadow.getElementById('l-light').style.boxShadow = leftActive ? '0 0 8px #0f0' : 'none';
        }

        if (e.key === ']') {
            rightActive = !rightActive;
            if (rightActive) rightInterval = setInterval(() => doClick(2), settings.rightSpeed);
            else clearInterval(rightInterval);
            shadow.getElementById('r-light').style.background = rightActive ? '#0f0' : '#300';
            shadow.getElementById('r-light').style.boxShadow = rightActive ? '0 0 8px #0f0' : 'none';
        }
    });
})();
