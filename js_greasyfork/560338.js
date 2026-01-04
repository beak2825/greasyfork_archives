// ==UserScript==
// @name         TG Spammer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Telegram Web message spammer with GUI
// @author       Buffxny
// @match        https://web.telegram.org/*
// @icon         https://web.telegram.org/a/favicon.svg
// @license      MIT
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/560338/TG%20Spammer.user.js
// @updateURL https://update.greasyfork.org/scripts/560338/TG%20Spammer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const init = () => {
        if (document.getElementById('spam-gui')) return;

        const gui = document.createElement('div');
        gui.id = 'spam-gui';
        gui.innerHTML = `
            <div id="spam-header" style="font-weight:bold;font-size:14px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;cursor:move;user-select:none">
                <div style="display:flex;align-items:center;gap:8px">
                    <img src="https://web.telegram.org/a/favicon.svg" style="width:20px;height:20px">
                    <span>TG Spammer 1.0</span>
                </div>
                <div style="display:flex;gap:8px">
                    <button id="spam-minimize" style="background:none;border:none;color:#aaa;font-size:14px;cursor:pointer;padding:0">−</button>
                    <button id="spam-close" style="background:none;border:none;color:#aaa;font-size:18px;cursor:pointer;padding:0">&times;</button>
                </div>
            </div>
            <div id="spam-content">
                <input type="text" id="spam-msg" placeholder="Message" value="Test" style="width:100%;padding:8px;margin-bottom:8px;border:1px solid #3b4a54;border-radius:4px;background:#2a3942;color:#e9edef;box-sizing:border-box">
                <div style="display:flex;gap:8px;margin-bottom:8px">
                    <input type="number" id="spam-count" value="5" min="1" style="width:50%;padding:8px;border:1px solid #3b4a54;border-radius:4px;background:#2a3942;color:#e9edef" placeholder="Count">
                    <input type="number" id="spam-delay" value="500" min="100" style="width:50%;padding:8px;border:1px solid #3b4a54;border-radius:4px;background:#2a3942;color:#e9edef" placeholder="Delay (ms)">
                </div>
                <div style="display:flex;gap:8px;margin-bottom:8px">
                    <button id="spam-start" style="flex:1;padding:8px;background:#3390ec;border:none;border-radius:4px;color:white;cursor:pointer;font-weight:bold">Start</button>
                    <button id="spam-stop" style="flex:1;padding:8px;background:#ea4335;border:none;border-radius:4px;color:white;cursor:pointer;font-weight:bold">Stop</button>
                </div>
                <div id="spam-status" style="font-size:12px;color:#8696a0;text-align:center">Ready</div>
            </div>
        `;
        gui.style.cssText = 'position:fixed;top:20px;right:20px;width:280px;padding:15px;background:#111b21;border:1px solid #3b4a54;border-radius:8px;z-index:99999;font-family:Segoe UI,Helvetica,Arial,sans-serif;color:#e9edef;box-shadow:0 4px 12px rgba(0,0,0,0.3)';
        document.body.appendChild(gui);

        const minBtn = document.createElement('div');
        minBtn.id = 'spam-mini';
        minBtn.innerHTML = '<img src="https://web.telegram.org/a/favicon.svg" style="width:28px;height:28px">';
        minBtn.style.cssText = 'position:fixed;top:20px;right:20px;width:45px;height:45px;background:#111b21;border:1px solid #3b4a54;border-radius:50%;z-index:99999;display:none;justify-content:center;align-items:center;cursor:move;box-shadow:0 4px 12px rgba(0,0,0,0.3);user-select:none';
        document.body.appendChild(minBtn);

        let minimized = false;
        let running = false;
        let sent = 0;
        let dragEl = null;
        let offsetX = 0;
        let offsetY = 0;

        const startDrag = (e, el) => {
            dragEl = el;
            const rect = el.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            e.preventDefault();
        };

        document.addEventListener('mousemove', (e) => {
            if (!dragEl) return;
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            dragEl.style.left = x + 'px';
            dragEl.style.right = 'auto';
            dragEl.style.top = y + 'px';
        });

        document.addEventListener('mouseup', () => { dragEl = null; });

        document.getElementById('spam-header').addEventListener('mousedown', (e) => {
            if (e.target.tagName !== 'BUTTON') startDrag(e, gui);
        });

        minBtn.addEventListener('mousedown', (e) => startDrag(e, minBtn));

        minBtn.addEventListener('dblclick', () => {
            minimized = false;
            minBtn.style.display = 'none';
            gui.style.display = 'block';
            gui.style.left = minBtn.style.left;
            gui.style.top = minBtn.style.top;
            gui.style.right = 'auto';
        });

        document.getElementById('spam-minimize').onclick = () => {
            minimized = true;
            gui.style.display = 'none';
            minBtn.style.display = 'flex';
            minBtn.style.left = gui.style.left || 'auto';
            minBtn.style.top = gui.style.top || '20px';
            if (gui.style.left) minBtn.style.right = 'auto';
        };

        const getInput = () => document.querySelector('.form-control.allow-selection[contenteditable="true"]');
        const status = document.getElementById('spam-status');

        const sendMessage = (text) => {
            const input = getInput();
            if (!input) return false;
            input.focus();
            input.textContent = text;
            input.dispatchEvent(new InputEvent('input', { bubbles: true }));
            const enterEvent = new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true,
                cancelable: true
            });
            input.dispatchEvent(enterEvent);
            return true;
        };

        const runSpam = async () => {
            const msg = document.getElementById('spam-msg').value;
            const count = parseInt(document.getElementById('spam-count').value) || 5;
            const delay = parseInt(document.getElementById('spam-delay').value) || 500;

            if (!msg) { status.textContent = 'Enter a message'; return; }

            running = true;
            sent = 0;

            for (let i = 0; i < count && running; i++) {
                status.textContent = `Sending ${i + 1}/${count}...`;
                if (sendMessage(msg)) sent++;
                if (i < count - 1 && running) await new Promise(r => setTimeout(r, delay));
            }

            running = false;
            status.textContent = `Done: ${sent}/${count} sent`;
        };

        document.getElementById('spam-start').onclick = () => { if (!running) runSpam(); };
        document.getElementById('spam-stop').onclick = () => { running = false; status.textContent = `Stopped: ${sent} sent`; };
        document.getElementById('spam-close').onclick = () => { running = false; gui.remove(); minBtn.remove(); };
    };

    const waitForApp = () => {
        const check = setInterval(() => {
            if (document.querySelector('.form-control.allow-selection[contenteditable="true"]')) {
                clearInterval(check);
                setTimeout(init, 1000);
            }
        }, 500);
    };

    if (document.readyState === 'complete') {
        waitForApp();
    } else {
        window.addEventListener('load', waitForApp);
    }
})();