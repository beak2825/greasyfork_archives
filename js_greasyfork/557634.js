// ==UserScript==
// @name         NF ClickerX – AutoClicker UI
// @name:ru      NF ClickerX — Автокликер UI
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Customizable AutoClicker UI for any browser clicker game. MIT licensed.
// @description:ru  Настраиваемый автокликер с UI для любых браузерных кликер-игр. Лицензия MIT.
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557634/NF%20ClickerX%20%E2%80%93%20AutoClicker%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/557634/NF%20ClickerX%20%E2%80%93%20AutoClicker%20UI.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2025 NF ClickerX

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function() {
    'use strict';

    let autoClickerEnabled = false;
    let targetElement = null;
    let cps = 20;

    const ui = document.createElement('div');
    ui.style.position = 'fixed';
    ui.style.top = '20px';
    ui.style.right = '20px';
    ui.style.padding = '12px';
    ui.style.background = 'rgba(0,0,0,0.75)';
    ui.style.color = '#fff';
    ui.style.borderRadius = '10px';
    ui.style.fontFamily = 'Arial';
    ui.style.zIndex = '999999';
    ui.style.width = '180px';

    ui.innerHTML = `
        <div style="text-align:center; font-weight:bold; margin-bottom:8px;">AutoClicker</div>

        <button id="pickTarget" style="width:100%; margin-bottom:8px;">Select Target</button>

        <label>CPS:</label>
        <input id="cpsInput" type="number" value="${cps}" min="1" max="1000" style="width:100%; margin-bottom:8px;">

        <button id="toggleAC" style="width:100%; margin-bottom:8px; background:#28a745; color:white;">Start</button>

        <div id="status" style="text-align:center; margin-top:6px;">Target: none</div>
    `;

    document.body.appendChild(ui);

    const pickButton = document.getElementById('pickTarget');
    const cpsInput = document.getElementById('cpsInput');
    const toggleButton = document.getElementById('toggleAC');
    const statusText = document.getElementById('status');

    pickButton.onclick = () => {
        statusText.innerText = "Click any element...";
        document.body.style.cursor = "crosshair";

        const pickHandler = e => {
            e.preventDefault();
            e.stopPropagation();
            targetElement = e.target;
            statusText.innerText = "Target selected";
            document.body.style.cursor = "default";
            document.removeEventListener('click', pickHandler, true);
        };

        document.addEventListener('click', pickHandler, true);
    };

    cpsInput.oninput = () => {
        cps = Number(cpsInput.value) || 1;
    };

    toggleButton.onclick = () => {
        autoClickerEnabled = !autoClickerEnabled;
        toggleButton.innerText = autoClickerEnabled ? "Stop" : "Start";
        toggleButton.style.background = autoClickerEnabled ? "#dc3545" : "#28a745";
    };

    setInterval(() => {
        if (autoClickerEnabled && targetElement) {
            targetElement.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        }
    }, 1000 / Math.max(1, cps));
})();
