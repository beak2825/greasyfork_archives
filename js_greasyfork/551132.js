// ==UserScript==
// @name         Robux Display Controller (Improved)
// @namespace    khanh_dev
// @version      1.3
// @description  Fake Robux display with controls, persistent value, and abbreviated formatting
// @match        https://www.roblox.com/*
// @match        https://web.roblox.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/551132/Robux%20Display%20Controller%20%28Improved%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551132/Robux%20Display%20Controller%20%28Improved%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let mockValue = parseInt(localStorage.getItem('mockRobux')) || 999999;

    function formatRobux(val) {
        if (val >= 1_000_000_000_000) {
            return Math.floor(val / 1_000_000_000_000) + "T+";
        } else if (val >= 1_000_000_000) {
            return Math.floor(val / 1_000_000_000) + "B+";
        } else if (val >= 1_000_000) {
            return Math.floor(val / 1_000_000) + "M+";
        } else if (val >= 1_000) {
            return Math.floor(val / 1_000) + "K+";
        } else {
            return val.toLocaleString();
        }
    }

    function updateRobuxDisplay() {
        const robuxEl = document.getElementById("nav-robux-amount");
        if (robuxEl) {
            robuxEl.textContent = formatRobux(mockValue);
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

        function createButton(label, onClick) {
            const btn = document.createElement('button');
            btn.textContent = label;
            btn.onclick = e => { e.stopPropagation(); onClick(); };
            Object.assign(btn.style, {
                margin: '4px',
                padding: '4px 8px',
                fontSize: '12px',
                cursor: 'pointer',
                border: '1px solid #ccc',
                borderRadius: '4px',
                background: '#eee'
            });
            return btn;
        }

        const btnAdd = createButton('+10', () => { mockValue += 10; updateRobuxDisplay(); });
        const btnSub = createButton('-10', () => { mockValue = Math.max(0, mockValue - 10); updateRobuxDisplay(); });
        const btnReset = createButton('Reset', () => { mockValue = 0; updateRobuxDisplay(); });

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

        const btnSet = createButton('Set', () => {
            const val = parseInt(input.value);
            if (!isNaN(val) && val >= 0) {
                mockValue = val;
                updateRobuxDisplay();
            }
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
