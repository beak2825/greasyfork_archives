// ==UserScript==
// @name         FlatMMO VanillaChat Modified
// @namespace    http://tampermonkey.net/
// @version      1
// @description  QoL
// @author       Use my loot
// @match        https://flatmmo.com/play.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563575/FlatMMO%20VanillaChat%20Modified.user.js
// @updateURL https://update.greasyfork.org/scripts/563575/FlatMMO%20VanillaChat%20Modified.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. PERSISTENCE ENGINE ---
    const getS = (k, d) => localStorage.getItem('cp_v19_' + k) || d;
    const setS = (k, v) => localStorage.setItem('cp_v19_' + k, v);

    // --- 2. DYNAMIC STYLES ---
    const style = document.createElement('style');
    style.textContent = `
        /* --- GHOST SCROLLBAR --- */
        #chat {
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
        }
        #chat::-webkit-scrollbar {
            display: none !important;
            width: 0 !important;
        }

        /* --- UI STYLES --- */
        .cp-ping-row { border-left: 4px solid #00ffcc !important; padding-left: 4px !important; }

        .cp-rainbow-cycle {
            background: linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet, red);
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: flowing_rainbow 3s linear infinite !important;
            font-weight: bold;
            display: inline-block;
        }

        @keyframes flowing_rainbow {
            0% { background-position: 0% center; }
            100% { background-position: 200% center; }
        }

        #cp-menu { position: fixed; top: 40px; left: 20px; width: 260px; background: #111; border: 2px solid #00ffcc; border-radius: 8px; z-index: 1000000; color: white; font-family: sans-serif; box-shadow: 0 0 15px #000; }
        .cp-head { padding: 10px; background: #222; cursor: move; border-bottom: 1px solid #333; display: flex; justify-content: space-between; font-size: 11px; font-weight: bold; }
        .cp-body { padding: 12px; max-height: 600px; overflow-y: auto; }
        .cp-body label { display: block; font-size: 9px; color: #00ffcc; margin-top: 8px; text-transform: uppercase; }
        .cp-body input[type="text"], .cp-body input[type="range"] { width: 92%; background: #222; color: #fff; border: 1px solid #444; padding: 4px; margin-top: 2px; border-radius: 4px; font-size: 11px; }
        .cp-toggle-row { display: flex; align-items: center; gap: 10px; margin-top: 10px; font-size: 11px; color: #00ffcc; }
        .cp-collapsed { display: none; }
    `;
    document.head.appendChild(style);

    function hexToRgba(hex, alpha) {
        let r = parseInt(hex.slice(1, 3), 16),
            g = parseInt(hex.slice(3, 5), 16),
            b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    // --- 3. THE INTERCEPTOR HOOK ---
    function applyHook() {
        if (window.refresh_chat_div && !window.refresh_chat_div.isHooked) {
            const original = window.refresh_chat_div;
            window.refresh_chat_div = function(obj) {
                const bans = getS('ban', '').toLowerCase().split(',').map(s => s.trim()).filter(s => s);
                const pings = getS('ping', '').toLowerCase().split(',').map(s => s.trim()).filter(s => s);
                if (bans.some(word => obj.message.toLowerCase().includes(word))) return;

                original.apply(this, arguments);

                const chat = document.getElementById('chat');
                if (!chat || !chat.lastElementChild) return;
                const lastRow = chat.lastElementChild;

                const isPing = pings.some(word => obj.message.toLowerCase().includes(word));
                const rainbowActive = getS('rainbow', 'false') === 'true';
                const muteSounds = getS('mute', 'false') === 'true';
                const userCol = getS('uCol', '#00ffcc');
                const textCol = isPing ? getS('pCol', '#ffff00') : getS('tCol', '#ffffff');
                const finalPingBg = hexToRgba(getS('pBg', '#224444'), getS('pAlpha', 0.5));

                lastRow.querySelectorAll('span').forEach(span => {
                    if (span.innerText.includes(':')) {
                        if (rainbowActive && (obj.username.toLowerCase().includes("phucyou") || obj.username.toLowerCase().includes("use my loot"))) {
                            span.classList.add('cp-rainbow-cycle');
                        } else {
                            span.style.setProperty('color', userCol, 'important');
                        }
                    } else {
                        span.style.setProperty('color', textCol, 'important');
                    }
                });

                if (isPing) {
                    lastRow.classList.add('cp-ping-row');
                    lastRow.style.setProperty('background', finalPingBg, 'important');
                    if (!muteSounds) {
                        new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play();
                    }
                }
            };
            window.refresh_chat_div.isHooked = true;
        }
    }

    // --- 4. THE UI ---
    function createMenu() {
        if (document.getElementById('cp-menu')) return;
        const menu = document.createElement('div');
        menu.id = 'cp-menu';
        menu.innerHTML = `
            <div class="cp-head" id="cp-drag"><span>Vanillachat++</span><span style="cursor:pointer" id="cp-min">_</span></div>
            <div class="cp-body" id="cp-body">
                <label>Filters (Banned / Pings)</label>
                <input type="text" id="in-ban" value="${getS('ban', '')}">
                <input type="text" id="in-ping" value="${getS('ping', '')}">

                <label>Text Colors (User / Msg / Ping)</label>
                <div style="display:flex; gap:5px;">
                    <input type="color" id="in-uCol" value="${getS('uCol', '#00ffcc')}">
                    <input type="color" id="in-tCol" value="${getS('tCol', '#ffffff')}">
                    <input type="color" id="in-pCol" value="${getS('pCol', '#ffff00')}">
                </div>

                <label>Ping Background & Alpha</label>
                <input type="color" id="in-pBg" value="${getS('pBg', '#224444')}">
                <input type="range" id="in-pAlpha" min="0" max="1" step="0.1" value="${getS('pAlpha', 0.5)}">

                <label>Input Bar Color & Alpha</label>
                <input type="color" id="in-iCol" value="${getS('iCol', '#111111')}">
                <input type="range" id="in-iAlpha" min="0" max="1" step="0.1" value="${getS('iAlpha', 0.8)}">

                <label>Global Chat Alpha</label>
                <input type="range" id="in-alpha" min="0" max="1" step="0.1" value="${getS('alpha', 0.5)}">

                <div class="cp-toggle-row">
                    <input type="checkbox" id="in-rainbow" ${getS('rainbow', 'false') === 'true' ? 'checked' : ''}>
                    <span>RAINBOW NAME</span>
                </div>
                <div class="cp-toggle-row">
                    <input type="checkbox" id="in-mute" ${getS('mute', 'false') === 'true' ? 'checked' : ''}>
                    <span>MUTE PING SOUNDS</span>
                </div>
            </div>
        `;
        document.body.appendChild(menu);

        menu.oninput = (e) => {
            const id = e.target.id.replace('in-', '');
            const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
            setS(id, val);
        };

        let x=0, y=0, nx=0, ny=0;
        document.getElementById('cp-drag').onmousedown = (e) => {
            nx = e.clientX; ny = e.clientY;
            document.onmousemove = (ev) => {
                x = nx - ev.clientX; y = ny - ev.clientY;
                nx = ev.clientX; ny = ev.clientY;
                menu.style.top = (menu.offsetTop - y) + "px";
                menu.style.left = (menu.offsetLeft - x) + "px";
            };
            document.onmouseup = () => document.onmousemove = null;
        };
        document.getElementById('cp-min').onclick = () => document.getElementById('cp-body').classList.toggle('cp-collapsed');
    }

    setInterval(() => {
        applyHook();
        createMenu();

        const chat = document.getElementById('chat');
        if (chat) chat.style.setProperty('background-color', `rgba(0, 0, 0, ${getS('alpha', 0.5)})`, 'important');

        const inputContainer = document.getElementById('chat-input');
        const inputField = document.getElementById('chat-text-input');

        if (inputContainer) {
            const inputBg = hexToRgba(getS('iCol', '#111111'), getS('iAlpha', 0.8));
            inputContainer.style.setProperty('background', inputBg, 'important');
            inputContainer.style.setProperty('border', 'none', 'important');
        }

        if (inputField) {
            inputField.style.setProperty('background', 'transparent', 'important');
            inputField.style.setProperty('color', getS('tCol', '#ffffff'), 'important');
        }
    }, 500);

})();