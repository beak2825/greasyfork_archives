// ==UserScript==
// @name         Torn Mass Messenger
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Manual mass messenger
// @author       e7cf09 [3441977]
// @match        https://www.torn.com/*
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564189/Torn%20Mass%20Messenger.user.js
// @updateURL https://update.greasyfork.org/scripts/564189/Torn%20Mass%20Messenger.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const win = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
    let workerPort = null;

    // --- CSS ---
    GM_addStyle(`
        #mm-panel {
            position: fixed; bottom: 20px; right: 20px; width: 220px; z-index: 999999;
            background: #181818; color: #ccc; border: 1px solid #444; border-radius: 4px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.9); font-family: Arial, sans-serif; font-size: 11px;
        }
        #mm-header {
            padding: 6px; background: #222; border-bottom: 1px solid #333; cursor: move;
            display: flex; justify-content: space-between; align-items: center; user-select: none;
        }
        .ctrl-group { display: flex; align-items: center; gap: 8px; }
        .status-dot {
            width: 8px; height: 8px; background: #d32f2f; border-radius: 50%;
            box-shadow: 0 0 3px #d32f2f; transition: background 0.3s;
        }
        .status-dot.ready { background: #76ff03; box-shadow: 0 0 5px #76ff03; }
        .win-btn { cursor: pointer; padding: 0 4px; font-weight: bold; color: #888; }
        .win-btn:hover { color: #fff; }
        #mm-body { padding: 8px; }
        .mm-input {
            width: 100%; background: #2b2b2b; color: #fff; border: 1px solid #555;
            margin-bottom: 6px; padding: 4px; box-sizing: border-box; resize: vertical; border-radius: 3px; font-size: 11px;
        }
        #btn-action {
            width: 100%; padding: 8px; cursor: pointer; font-weight: bold; border-radius: 3px;
            border: none; color: white; background: #1565C0; transition: 0.2s; font-size: 11px;
        }
        #btn-action:hover { background: #0D47A1; }
        #btn-action:disabled { background: #333; color: #666; cursor: not-allowed; }
        #mm-log { margin-top: 5px; text-align: center; color: #666; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .hidden { display: none; }
    `);

    // --- 1. Hijack SharedWorker ---
    const OriginalSharedWorker = win.SharedWorker;
    win.SharedWorker = new Proxy(OriginalSharedWorker, {
        construct(target, args) {
            const sw = new target(...args);
            workerPort = sw.port;
            const dot = document.getElementById('mm-status');
            if(dot) dot.classList.add('ready');

            const originalPost = sw.port.postMessage;
            sw.port.postMessage = function(data) {
                return originalPost.apply(this, arguments);
            };
            return sw;
        }
    });

    // --- 2. Helpers ---
    const uuidv4 = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });

    async function sendMsg(uid, msg) {
        if (!workerPort) throw new Error("Worker disconnected");

        const res = await fetch('/chat/private-chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: uid.toString() })
        });
        const data = await res.json();
        if (!data.channel_url) throw new Error("No Channel");

        workerPort.postMessage({
            type: 'sendMessage',
            payload: {
                channelId: data.channel_url,
                channelType: 'group',
                message: msg,
                id: uuidv4()
            }
        });
    }

    // --- 3. UI ---
    function initUI() {
        const panel = document.createElement('div');
        panel.id = 'mm-panel';
        panel.innerHTML = `
            <div id="mm-header">
                <div class="ctrl-group">
                    <span id="mm-status" class="status-dot"></span>
                    <span style="font-weight:bold; color:#888">Mass Msg</span>
                </div>
                <div class="ctrl-group">
                    <span id="btn-min" class="win-btn">_</span>
                    <span id="btn-close" class="win-btn">✕</span>
                </div>
            </div>
            <div id="mm-body">
                <textarea id="inp-uids" class="mm-input" rows="4" placeholder="UIDs (123, 456...)"></textarea>
                <textarea id="inp-msg" class="mm-input" rows="3" placeholder="Message"></textarea>
                <button id="btn-action">Load List</button>
                <div id="mm-log">Idle</div>
            </div>
        `;
        document.body.appendChild(panel);

        // -- State --
        let queue = [];
        let currIdx = 0;
        let isMinimized = false;

        // -- Elements --
        const header = document.getElementById('mm-header');
        const body = document.getElementById('mm-body');
        const btn = document.getElementById('btn-action');
        const log = document.getElementById('mm-log');
        const closeBtn = document.getElementById('btn-close');
        const minBtn = document.getElementById('btn-min');
        const uidsInput = document.getElementById('inp-uids');
        const msgInput = document.getElementById('inp-msg');

        // -- Check Worker Status immediately --
        if(workerPort) document.getElementById('mm-status').classList.add('ready');

        // -- Window Controls --
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            panel.remove();
        });

        minBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            isMinimized = !isMinimized;
            body.classList.toggle('hidden', isMinimized);
            minBtn.innerText = isMinimized ? '□' : '_';
        });

        // -- Drag Logic --
        let isDragging = false, startX, startY, initLeft, initTop;
        header.addEventListener('mousedown', (e) => {
            if(e.target.classList.contains('win-btn')) return;
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            initLeft = panel.offsetLeft;
            initTop = panel.offsetTop;
        });
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                panel.style.left = (initLeft + e.clientX - startX) + 'px';
                panel.style.top = (initTop + e.clientY - startY) + 'px';
                panel.style.right = 'auto';
                panel.style.bottom = 'auto';
            }
        });
        document.addEventListener('mouseup', () => isDragging = false);

        // -- Core Action Logic --
        btn.addEventListener('click', async () => {

            // STATE 1: Load Queue
            if (queue.length === 0) {
                const raw = uidsInput.value;
                const parsed = raw.split(/[\n,]+/).map(s => s.trim()).filter(s => s);

                if (parsed.length === 0) return alert("UIDs empty");

                queue = parsed;
                currIdx = 0;

                uidsInput.disabled = true;
                msgInput.disabled = true;
                btn.innerText = `Send (1/${queue.length})`;
                btn.style.background = "#2E7D32"; // Green for start
                log.innerText = "Ready to send";
                return; // STOP here, wait for next click
            }

            // STATE 2: Process Queue
            if (currIdx < queue.length) {
                if (!workerPort) return alert("Worker not ready. Open a chat box.");

                const uid = queue[currIdx];
                const msg = msgInput.value;

                btn.disabled = true;
                log.innerText = `Sending: ${uid}...`;

                try {
                    await sendMsg(uid, msg);
                    log.innerText = `✅ Sent: ${uid}`;
                    log.style.color = "#81C784";
                    currIdx++;
                } catch (e) {
                    log.innerText = `❌ Error: ${uid}`;
                    log.style.color = "#E57373";
                    currIdx++; // Skip error
                }

                // Prepare next button state
                if (currIdx < queue.length) {
                    btn.disabled = false;
                    btn.innerText = `Next (${currIdx + 1}/${queue.length})`;
                } else {
                    btn.disabled = false;
                    btn.innerText = "Reset";
                    btn.style.background = "#FF9800"; // Orange for reset
                    log.innerText = "Done";
                }
                return;
            }

            // STATE 3: Reset
            if (currIdx >= queue.length) {
                queue = [];
                currIdx = 0;
                uidsInput.disabled = false;
                msgInput.disabled = false;
                btn.innerText = "Load List";
                btn.style.background = "#1565C0"; // Blue for load
                log.innerText = "Idle";
                log.style.color = "#666";
            }
        });
    }

    window.addEventListener('load', () => setTimeout(initUI, 1000));
})();