// ==UserScript==
// @name         Gota.io God Mode V15 (Live Sync & Fixes)
// @namespace    http://gota.io/
// @version      15.0
// @description  V15: Reads inputs directly (WYSIWYG) and syncs settings across tabs instantly.
// @author       Maya
// @match        http://gota.io/*
// @match        https://gota.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562380/Gotaio%20God%20Mode%20V15%20%28Live%20Sync%20%20Fixes%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562380/Gotaio%20God%20Mode%20V15%20%28Live%20Sync%20%20Fixes%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.top !== window.self) return;

    // --- REMOVE OLD MENUS (Fixes "Multiple Scripts" Bug) ---
    const oldGUI = document.getElementById('god-gui');
    if (oldGUI) oldGUI.remove();

    // --- DEFAULT CONFIG ---
    let config = {
        detonatorKey: 'x',
        instantLineKey: 'r',
        delayedLineKey: 't',
        lineDelay: 500,
        instantFreezeTime: 300,
        delayedFreezeTime: 350
    };

    // Load Save
    try {
        const saved = localStorage.getItem('gota_god_v15');
        if (saved) config = JSON.parse(saved);
    } catch (e) {}

    // --- STATE ---
    const channel = new BroadcastChannel('gota_god_mode');
    const TAB_ID = Math.random().toString(36).substring(7);
    let isFreezing = false;
    let isBusy = false;

    // --- WORKER (Anti-Throttle) ---
    function runSafeTimer(ms, callback) {
        if (ms < 10) ms = 10; // Safety minimum
        const blob = new Blob([`self.onmessage = function(e) { setTimeout(function() { self.postMessage('done'); }, e.data); };`], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const worker = new Worker(url);
        worker.onmessage = function() { callback(); worker.terminate(); URL.revokeObjectURL(url); };
        worker.postMessage(ms);
    }

    // --- GUI ---
    function checkGUI() {
        if (!document.getElementById('god-gui-v15')) createGUI();
    }

    function createGUI() {
        const div = document.createElement('div');
        div.id = 'god-gui-v15';
        div.style.cssText = `
            position: fixed; top: 100px; left: 10px; width: 260px;
            background: rgba(0, 0, 0, 0.95); border: 2px solid #00FF00;
            color: white; font-family: monospace; padding: 15px;
            border-radius: 8px; z-index: 2147483647; display: block;
            box-shadow: 0 0 15px rgba(0, 255, 0, 0.2);
        `;

        div.innerHTML = `
            <div style="text-align:center; font-weight:bold; color:#00FF00; margin-bottom:15px; font-size:14px;">
                GOD MODE V15 <span style="font-size:10px; color:#888;">[ = ] Toggle</span>
            </div>

            <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                <span style="font-size:12px; color:#ddd;">Detonator Key:</span>
                <input id="cfg-det" type="text" value="${config.detonatorKey}" maxlength="1" style="width:40px; text-align:center; background:#222; border:1px solid #555; color:#fff;">
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                <span style="font-size:12px; color:#ddd;">Instant Key (Old):</span>
                <input id="cfg-inst" type="text" value="${config.instantLineKey}" maxlength="1" style="width:40px; text-align:center; background:#222; border:1px solid #555; color:#fff;">
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:15px;">
                <span style="font-size:12px; color:#ddd;">Delayed Key (New):</span>
                <input id="cfg-del" type="text" value="${config.delayedLineKey}" maxlength="1" style="width:40px; text-align:center; background:#222; border:1px solid #555; color:#fff;">
            </div>

            <hr style="border:0; border-top:1px solid #333; margin:10px 0;">

            <div style="margin-bottom:5px;">
                <span style="font-size:11px; color:#aaa;">Instant Freeze (ms):</span>
                <input id="cfg-inst-freeze" type="number" value="${config.instantFreezeTime}" style="width:100%; background:#1a1a1a; border:none; color:#0f0; padding:2px;">
            </div>

            <div style="margin-bottom:5px;">
                <span style="font-size:11px; color:#aaa;">Delayed Wait (ms):</span>
                <input id="cfg-delay" type="number" value="${config.lineDelay}" style="width:100%; background:#1a1a1a; border:none; color:#0f0; padding:2px;">
            </div>
             <div style="margin-bottom:15px;">
                <span style="font-size:11px; color:#aaa;">Delayed Final Freeze (ms):</span>
                <input id="cfg-del-freeze" type="number" value="${config.delayedFreezeTime}" style="width:100%; background:#1a1a1a; border:none; color:#0f0; padding:2px;">
            </div>

            <button id="btn-save" style="width:100%; background:#008800; color:white; border:none; padding:8px; cursor:pointer; font-weight:bold; border-radius:4px;">SAVE & SYNC TABS</button>
        `;

        document.body.appendChild(div);

        // SAVE BUTTON LOGIC
        document.getElementById('btn-save').onclick = function() {
            saveSettings();
            // Broadcast Sync Command
            channel.postMessage({ command: 'SYNC_CONFIG' });

            // Visual Feedback
            const btn = document.getElementById('btn-save');
            btn.innerText = "SYNCED ✓";
            setTimeout(() => { btn.innerText = "SAVE & SYNC TABS"; }, 1000);
        };
    }

    function saveSettings() {
        // Read directly from inputs
        config.detonatorKey = document.getElementById('cfg-det').value.toLowerCase() || 'x';
        config.instantLineKey = document.getElementById('cfg-inst').value.toLowerCase() || 'r';
        config.delayedLineKey = document.getElementById('cfg-del').value.toLowerCase() || 't';

        config.instantFreezeTime = parseInt(document.getElementById('cfg-inst-freeze').value) || 300;
        config.lineDelay = parseInt(document.getElementById('cfg-delay').value) || 500;
        config.delayedFreezeTime = parseInt(document.getElementById('cfg-del-freeze').value) || 350;

        localStorage.setItem('gota_god_v15', JSON.stringify(config));
    }

    function loadSettings() {
        try {
            const saved = localStorage.getItem('gota_god_v15');
            if (saved) {
                config = JSON.parse(saved);
                // Update GUI fields if they exist
                if (document.getElementById('cfg-det')) {
                    document.getElementById('cfg-det').value = config.detonatorKey;
                    document.getElementById('cfg-inst').value = config.instantLineKey;
                    document.getElementById('cfg-del').value = config.delayedLineKey;
                    document.getElementById('cfg-inst-freeze').value = config.instantFreezeTime;
                    document.getElementById('cfg-delay').value = config.lineDelay;
                    document.getElementById('cfg-del-freeze').value = config.delayedFreezeTime;
                }
            }
        } catch (e) {}
    }

    // --- KEY LOGIC ---
    window.addEventListener('keydown', function(e) {
        if (e.key === '=') {
            const gui = document.getElementById('god-gui-v15');
            if (gui) gui.style.display = gui.style.display === 'none' ? 'block' : 'none';
            else createGUI();
            return;
        }

        if (document.activeElement.tagName === 'INPUT' || isBusy) return;

        // Force a "Live Read" of inputs if the menu is open, to ensure we use what you see.
        // If menu is closed, use 'config' variable.
        let currentDelay = config.lineDelay;
        let currentInstFreeze = config.instantFreezeTime;
        let currentDelFreeze = config.delayedFreezeTime;

        // If user is editing numbers but didn't save, use the visible numbers anyway (WYSIWYG)
        if (document.getElementById('cfg-delay')) {
            currentDelay = parseInt(document.getElementById('cfg-delay').value) || 500;
            currentInstFreeze = parseInt(document.getElementById('cfg-inst-freeze').value) || 300;
            currentDelFreeze = parseInt(document.getElementById('cfg-del-freeze').value) || 350;
        }

        const k = e.key.toLowerCase();

        // 1. DETONATOR
        if (k === config.detonatorKey) {
            isBusy = true;
            doInstantSplit(2);
            channel.postMessage({ command: 'EXPLODE', senderID: TAB_ID });
            runSafeTimer(200, () => { isBusy = false; });
        }

        // 2. INSTANT LINE
        if (k === config.instantLineKey) {
            isBusy = true;
            isFreezing = true;
            forceCenter();
            doInstantSplit(4);
            runSafeTimer(currentInstFreeze, () => {
                isFreezing = false;
                isBusy = false;
            });
        }

        // 3. DELAYED LINE
        if (k === config.delayedLineKey) {
            isBusy = true;
            isFreezing = true;
            forceCenter();

            doInstantSplit(3);

            // USE THE LIVE VALUE 'currentDelay'
            runSafeTimer(currentDelay, () => {
                doInstantSplit(1);

                // USE THE LIVE VALUE 'currentDelFreeze'
                runSafeTimer(currentDelFreeze, () => {
                    isFreezing = false;
                    isBusy = false;
                });
            });
        }
    });

    // --- HELPER: MOUSE FREEZE ---
    window.addEventListener('mousemove', function(e) {
        if (isFreezing) {
            e.stopImmediatePropagation();
            e.preventDefault();
            forceCenter();
        }
    }, true);

    function forceCenter() {
        const canvas = document.getElementById('canvas');
        if (!canvas) return;
        canvas.dispatchEvent(new MouseEvent('mousemove', {
            bubbles: true, cancelable: true, view: window,
            clientX: window.innerWidth / 2,
            clientY: window.innerHeight / 2
        }));
    }

    function doInstantSplit(times) {
        const key = 32;
        for (let i = 0; i < times; i++) {
            const down = new KeyboardEvent("keydown", { bubbles: true, cancelable: true, keyCode: key, which: key });
            const up = new KeyboardEvent("keyup", { bubbles: true, cancelable: true, keyCode: key, which: key });
            const canvas = document.getElementById('canvas');
            if (canvas) { canvas.dispatchEvent(down); canvas.dispatchEvent(up); }
            else { document.dispatchEvent(down); document.dispatchEvent(up); }
        }
    }

    // --- LISTENER ---
    channel.onmessage = (event) => {
        // Explode Command
        if (event.data.command === 'EXPLODE' && event.data.senderID !== TAB_ID && !document.hasFocus()) {
             doInstantSplit(4);
        }
        // Sync Command (Updates settings on this tab if another tab saved)
        if (event.data.command === 'SYNC_CONFIG') {
            loadSettings();
        }
    };

    setInterval(checkGUI, 2000);
    setTimeout(checkGUI, 1000);

})();