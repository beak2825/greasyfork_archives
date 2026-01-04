// ==UserScript==
// @name         Blacket Market Click Bot (with Fast Toggle)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Record up to 3 clicks and run them in order. R=record, S=start, Q=stop, T=repeat, C=clear, F=fast.
// @match        https://blacket.org/market*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551008/Blacket%20Market%20Click%20Bot%20%28with%20Fast%20Toggle%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551008/Blacket%20Market%20Click%20Bot%20%28with%20Fast%20Toggle%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Config ---
    let fastMode = false;          // default = normal speed
    let normalDelay = 600;         // 600ms between clicks
    let fastDelay = 30;            // 30ms between clicks
    // ----------------

    let targets = [];
    let running = false;
    let repeatMode = false;
    let recording = false;

    // Create UI overlay
    const ui = document.createElement('div');
    ui.style.position = 'fixed';
    ui.style.bottom = '12px';
    ui.style.right = '12px';
    ui.style.zIndex = 2147483647;
    ui.style.fontFamily = 'Arial, sans-serif';
    ui.style.fontSize = '13px';
    ui.style.background = 'rgba(0,0,0,0.6)';
    ui.style.color = '#fff';
    ui.style.padding = '8px 10px';
    ui.style.borderRadius = '8px';
    ui.style.boxShadow = '0 2px 10px rgba(0,0,0,0.5)';
    ui.innerHTML = `
        <div><b>Click Bot</b> (R=record, S=start, Q=stop, T=repeat, C=clear, F=fast)</div>
        <div id="cb_status">Status: Idle</div>
        <div id="cb_targets">Targets: 0</div>
        <div id="cb_repeat">Repeat: Off</div>
        <div id="cb_speed">Speed: Normal</div>
    `;
    document.body.appendChild(ui);

    const statusEl = ui.querySelector('#cb_status');
    const targetsEl = ui.querySelector('#cb_targets');
    const repeatEl = ui.querySelector('#cb_repeat');
    const speedEl = ui.querySelector('#cb_speed');

    const markerContainer = document.createElement('div');
    markerContainer.style.position = 'fixed';
    markerContainer.style.left = '0';
    markerContainer.style.top = '0';
    markerContainer.style.width = '100%';
    markerContainer.style.height = '100%';
    markerContainer.style.pointerEvents = 'none';
    markerContainer.style.zIndex = 2147483646;
    document.body.appendChild(markerContainer);

    function getDelay() {
        return fastMode ? fastDelay : normalDelay;
    }

    function updateUI() {
        statusEl.textContent = `Status: ${running ? 'Running' : (recording ? 'Recording - click a spot' : 'Idle')}`;
        targetsEl.textContent = `Targets: ${targets.length}`;
        repeatEl.textContent = `Repeat: ${repeatMode ? 'On' : 'Off'}`;
        speedEl.textContent = `Speed: ${fastMode ? 'FAST' : 'Normal'}`;
    }

    function addMarker(x, y, label) {
        const marker = document.createElement('div');
        marker.className = 'cb_marker';
        marker.textContent = label;
        marker.style.position = 'fixed';
        marker.style.left = (x-10) + 'px';
        marker.style.top = (y-10) + 'px';
        marker.style.width = '20px';
        marker.style.height = '20px';
        marker.style.background = 'rgba(0,150,255,0.9)';
        marker.style.color = '#fff';
        marker.style.borderRadius = '50%';
        marker.style.display = 'flex';
        marker.style.alignItems = 'center';
        marker.style.justifyContent = 'center';
        marker.style.fontSize = '12px';
        marker.style.fontWeight = 'bold';
        marker.style.boxShadow = '0 1px 3px rgba(0,0,0,0.5)';
        marker.style.pointerEvents = 'none';
        markerContainer.appendChild(marker);
        return marker;
    }

    function clearMarkers() {
        markerContainer.innerHTML = '';
    }

    function syntheticClick(x, y) {
        const el = document.elementFromPoint(x, y);
        if (!el) return;
        ['mouseover','mouseenter','mousemove','mousedown','mouseup','click'].forEach(type => {
            const evt = new MouseEvent(type, {
                view: window,
                bubbles: true,
                cancelable: true,
                clientX: x,
                clientY: y,
                button: 0
            });
            el.dispatchEvent(evt);
        });
    }

    async function runSequenceOnce() {
        for (let i = 0; i < targets.length; i++) {
            if (!running) return;
            const t = targets[i];
            statusEl.textContent = `Status: Clicking ${i+1}/${targets.length}`;
            syntheticClick(t.x, t.y);
            await new Promise(r => setTimeout(r, getDelay()));
        }
    }

    async function runSequence() {
        if (targets.length === 0) {
            alert('No targets recorded. Press R then click to record targets.');
            running = false;
            updateUI();
            return;
        }
        running = true;
        updateUI();
        do {
            await runSequenceOnce();
            if (!repeatMode) break;
            await new Promise(r => setTimeout(r, getDelay()));
        } while (running && repeatMode);

        running = false;
        updateUI();
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'r' || e.key === 'R') {
            recording = true;
            statusEl.textContent = 'Status: Recording - click a spot to save target';
            updateUI();
            const onClick = (ev) => {
                if (ev.composedPath().some(node => node === ui || node === markerContainer)) return;
                const x = ev.clientX;
                const y = ev.clientY;
                const label = targets.length + 1;
                targets.push({x,y, label});
                addMarker(x,y,label);
                recording = false;
                updateUI();
                ev.preventDefault();
                ev.stopPropagation();
                document.removeEventListener('click', onClick, true);
            };
            document.addEventListener('click', onClick, true);
        } else if (e.key === 's' || e.key === 'S') {
            if (running) return;
            running = true;
            updateUI();
            runSequence();
        } else if (e.key === 'q' || e.key === 'Q') {
            running = false;
            recording = false;
            updateUI();
        } else if (e.key === 't' || e.key === 'T') {
            repeatMode = !repeatMode;
            updateUI();
        } else if (e.key === 'c' || e.key === 'C') {
            targets = [];
            clearMarkers();
            updateUI();
        } else if (e.key === 'f' || e.key === 'F') {
            fastMode = !fastMode;
            updateUI();
        }
    });

    ui.addEventListener('click', (ev)=> { ev.stopPropagation(); ev.preventDefault(); });
    updateUI();
})();

/*
MIT License

Copyright (c) 2025 Jackson Staats

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
