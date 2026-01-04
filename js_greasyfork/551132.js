// ==UserScript==
// @name         Robux Display Controller
// @namespace    khanh_dev
// @version      1.2
// @description  Fake Robux display with controls, persistent value, and Enter support
// @match        https://www.roblox.com/*
// @match        https://web.roblox.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/551132/Robux%20Display%20Controller.user.js
// @updateURL https://update.greasyfork.org/scripts/551132/Robux%20Display%20Controller.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let mockValue = parseInt(localStorage.getItem('mockRobux')) || 999999;

    function updateRobuxDisplay() {
        const robuxEl = document.getElementById("nav-robux-amount");
        if (robuxEl) {
            robuxEl.textContent = mockValue.toLocaleString();
            robuxEl.setAttribute("data-robux-amount", mockValue);
        }
        localStorage.setItem('mockRobux', mockValue); 
    }

    function injectControlsAtTop() {
        const popover = document.querySelector('.popover-content');
        if (!popover || document.getElementById('robux-control-top')) return;

        const controlBox = document.createElement('div');
        controlBox.id = 'robux-control-top';
        controlBox.style.padding = '8px 12px';
        controlBox.style.textAlign = 'center';
        controlBox.style.background = '#fff';
        controlBox.style.borderBottom = '1px solid #e5e5e5';

        const btnAdd = document.createElement('button');
        btnAdd.textContent = '+10';
        btnAdd.onclick = (e) => {
            e.stopPropagation();
            mockValue += 10;
            updateRobuxDisplay();
        };

        const btnSub = document.createElement('button');
        btnSub.textContent = '-10';
        btnSub.onclick = (e) => {
            e.stopPropagation();
            mockValue = Math.max(0, mockValue - 10);
            updateRobuxDisplay();
        };

        const btnReset = document.createElement('button');
        btnReset.textContent = 'Reset';
        btnReset.onclick = (e) => {
            e.stopPropagation();
            mockValue = 0;
            updateRobuxDisplay();
        };

        const input = document.createElement('input');
        input.type = 'number';
        input.placeholder = 'Enter';
        input.style.width = '60px';
        input.style.padding = '2px 4px';
        input.style.fontSize = '12px';
        input.onclick = e => e.stopPropagation();

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.stopPropagation();
                const val = parseInt(input.value);
                if (!isNaN(val) && val >= 0) {
                    mockValue = val;
                    updateRobuxDisplay();
                }
            }
        });

        const btnSet = document.createElement('button');
        btnSet.textContent = 'Set';
        btnSet.onclick = (e) => {
            e.stopPropagation();
            const val = parseInt(input.value);
            if (!isNaN(val) && val >= 0) {
                mockValue = val;
                updateRobuxDisplay();
            }
        };

        [btnAdd, btnSub, btnReset, btnSet].forEach(btn => {
            btn.style.margin = '4px';
            btn.style.padding = '4px 8px';
            btn.style.fontSize = '12px';
            btn.style.cursor = 'pointer';
            btn.style.border = '1px solid #ccc';
            btn.style.borderRadius = '4px';
            btn.style.background = '#eee';
        });

        controlBox.appendChild(btnAdd);
        controlBox.appendChild(btnSub);
        controlBox.appendChild(btnReset);
        controlBox.appendChild(input);
        controlBox.appendChild(btnSet);

        controlBox.addEventListener('mousedown', e => e.stopPropagation());
        controlBox.addEventListener('click', e => e.stopPropagation());

        popover.insertBefore(controlBox, popover.firstChild);
    }

    function run() {
        updateRobuxDisplay();
        injectControlsAtTop();
    }

    setInterval(run, 500);
})();
