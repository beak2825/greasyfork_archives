// ==UserScript==
// @name         Greasy Client - Full Version
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Official GC - Draggable HUD, Splash, and Multi-Tab Chat Sync
// @author       Alexander12351Playz & ykCole
// @match        https://miniblox.io/*
// @license      MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/562687/Greasy%20Client%20-%20Full%20Version.user.js
// @updateURL https://update.greasyfork.org/scripts/562687/Greasy%20Client%20-%20Full%20Version.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIG & SYNC ---
    const VERSION = "v3.1";
    const LOGO_URL = "https://image2url.com/r2/default/images/1768417124251-5983eb05-3d31-4428-b722-7a8c8574ea14.png";
    const DISCORD_LINK = "https://discord.gg/emEaezsMzp";
    const phrases = ["Bypassing The Limits....", "TIME TO FLY OFF!", "Stay Greasy.", "GC ON TOP!"];
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];

    // The Bridge that connects your Alt and Main tabs
    const chatBridge = new BroadcastChannel('gc_global_sync');

    const defaultSettings = {
        nickname: "Greasy" + Math.floor(Math.random() * 999),
        showFPS: true, showCPS: true, showKeystrokes: true,
        positions: {
            'greasy-main-title': { top: '15px', left: '15px' },
            'fps-wrap': { top: '70px', left: '15px' },
            'cps-wrap': { top: '110px', left: '15px' },
            'keys-wrap': { top: '160px', left: '15px' }
        }
    };
    let settings = JSON.parse(localStorage.getItem('greasyClientSettings')) || defaultSettings;
    const save = () => localStorage.setItem('greasyClientSettings', JSON.stringify(settings));

    // --- STYLES ---
    const style = document.createElement('style');
    style.innerHTML = `
        #gc-master-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #000; z-index: 100000; display: flex; flex-direction: column; justify-content: center; align-items: center; font-family: 'Segoe UI', sans-serif; transition: opacity 0.8s ease; }
        #gc-branding { text-align: center; margin-bottom: 20px; transition: transform 0.5s ease; }
        #gc-tagline { color: white; font-family: monospace; opacity: 0.8; letter-spacing: 4px; text-transform: uppercase; margin-top: 15px; transition: opacity 0.5s ease; }
        #gc-launcher-ui { display: none; opacity: 0; transition: opacity 0.5s ease; text-align: center; }
        #gc-ver-tag { position: fixed; bottom: 10px; right: 15px; color: rgba(255,255,255,0.2); font-family: monospace; font-size: 12px; }

        /* HUD STYLES */
        #greasy-main-title { position: fixed; font-family: Arial, sans-serif; font-size: 38px; font-weight: bold; color: #2ecc71; z-index: 10001; pointer-events: none; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); display: none; white-space: nowrap; }
        .draggable-hud { position: fixed; pointer-events: none; font-family: 'Segoe UI', sans-serif; z-index: 10000; color: white; text-shadow: 2px 2px 2px black; display: none; }
        .menu-open .draggable-hud, .menu-open #greasy-main-title { pointer-events: auto !important; cursor: move !important; outline: 1px dashed #00ff88; background: rgba(0, 255, 136, 0.1); }
        .hud-item { background: rgba(0,0,0,0.6); padding: 6px 14px; border-radius: 4px; font-weight: bold; border-left: 3px solid #2ecc71; margin-bottom: 5px; }
        .key { width: 45px; height: 45px; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; border-radius: 4px; font-weight: bold; }
        .key.active { background: #2ecc71; color: black; box-shadow: 0 0 10px #2ecc71; }

        /* CHAT STYLES */
        #gc-chat-box { position: fixed; bottom: 20px; left: 20px; width: 320px; height: 220px; background: rgba(0,0,0,0.8); border: 1px solid #333; border-radius: 8px; display: none; flex-direction: column; z-index: 10002; }
        #gc-chat-msgs { flex: 1; overflow-y: auto; padding: 10px; color: white; font-size: 13px; display: flex; flex-direction: column; gap: 5px; }
        #gc-chat-input { background: #111; border: none; border-top: 1px solid #333; padding: 10px; color: white; border-radius: 0 0 8px 8px; outline: none; }
        .chat-user { color: #00ff88; font-weight: bold; margin-right: 5px; }

        /* MENU STYLES */
        .gc-box { width: 300px; background: #0a0a0a; border: 1px solid #333; border-radius: 15px; padding: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.8); }
        .gc-sub-btn { background: #111; color: white; border: 1px solid #333; padding: 10px; border-radius: 5px; cursor: pointer; transition: 0.2s; font-family: monospace; width: 100%; margin-top: 10px; font-weight: bold; }
        .gc-sub-btn:hover { border-color: #00ff88; color: #00ff88; }
        #client-menu { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #111; border: 2px solid #2ecc71; padding: 25px; color: white; z-index: 100002; border-radius: 12px; display: none; min-width: 280px; text-align: center; }
        img[src*="logo"], .miniblox-logo { display: none !important; }
    `;

    // --- DRAGGABLE LOGIC ---
    function makeDraggable(el) {
        let p1=0, p2=0, p3=0, p4=0;
        el.onmousedown = (e) => {
            if (!document.body.classList.contains('menu-open')) return;
            e.preventDefault(); p3 = e.clientX; p4 = e.clientY;
            document.onmouseup = () => {
                document.onmouseup = null; document.onmousemove = null;
                settings.positions[el.id] = { top: el.style.top, left: el.style.left }; save();
            };
            document.onmousemove = (e) => {
                e.preventDefault(); p1 = p3 - e.clientX; p2 = p4 - e.clientY; p3 = e.clientX; p4 = e.clientY;
                el.style.top = (el.offsetTop - p2) + "px"; el.style.left = (el.offsetLeft - p1) + "px";
            };
        };
    }

    function addChatMessage(nick, msg) {
        const msgs = document.getElementById('gc-chat-msgs');
        if (!msgs) return;
        const div = document.createElement('div');
        div.innerHTML = `<span class="chat-user">${nick}:</span> <span>${msg}</span>`;
        msgs.appendChild(div);
        msgs.scrollTop = msgs.scrollHeight;
    }

    // LISTENING FOR ALT TABS
    chatBridge.onmessage = (e) => addChatMessage(e.data.nickname, e.data.message);

    function init() {
        if (document.getElementById('gc-master-container')) return;
        document.head.appendChild(style);

        const master = document.body.appendChild(document.createElement('div'));
        master.id = 'gc-master-container';
        master.innerHTML = `
            <div id="gc-branding">
                <img src="${LOGO_URL}" style="width: 140px; border-radius: 20px; border: 3px solid #00ff88; box-shadow: 0 0 30px rgba(0,255,136,0.6);">
                <h1 style="color: #00ff88; font-size: 55px; margin: 15px 0 0; letter-spacing: 15px; font-weight: 900;">GC</h1>
                <p id="gc-tagline">${randomPhrase}</p>
            </div>
            <div id="gc-launcher-ui">
                <div class="gc-box">
                    <input id="gc-nick-input" type="text" placeholder="Nickname..." value="${settings.nickname}" style="width:90%; padding:8px; margin-bottom:10px; background:#111; border:1px solid #333; color:white; border-radius:5px; text-align:center;">
                    <button id="gc-play" style="width: 100%; background: #00ff88; color: #000; border: none; padding: 15px; font-size: 20px; font-weight: bold; border-radius: 8px; cursor: pointer;">PLAY</button>
                    <button class="gc-sub-btn" id="gc-open-settings">MOD SETTINGS</button>
                    <button class="gc-sub-btn" id="gc-open-discord">DISCORD SERVER</button>
                </div>
            </div>
            <div id="gc-ver-tag">Greasy Client ${VERSION}</div>
        `;

        // HUD Elements
        const mainTitle = document.body.appendChild(document.createElement('div'));
        mainTitle.id = 'greasy-main-title'; mainTitle.innerText = 'GREASY CLIENT';
        mainTitle.style.top = settings.positions['greasy-main-title'].top;
        mainTitle.style.left = settings.positions['greasy-main-title'].left;

        const fpsW = createHUDElement('fps-wrap', '<div id="fps-display" class="hud-item">FPS: 0</div>', settings.positions['fps-wrap']);
        const cpsW = createHUDElement('cps-wrap', '<div id="cps-display" class="hud-item">CPS: 0</div>', settings.positions['cps-wrap']);
        const keysW = createHUDElement('keys-wrap', `<div style="display:flex;flex-direction:column;align-items:center;"><div style="display:flex;gap:4px;"><div id="key-KeyW" class="key">W</div></div><div style="display:flex;gap:4px;margin-top:4px;"><div id="key-KeyA" class="key">A</div><div id="key-KeyS" class="key">S</div><div id="key-KeyD" class="key">D</div></div></div>`, settings.positions['keys-wrap']);

        [mainTitle, fpsW, cpsW, keysW].forEach(makeDraggable);

        // Chat Box
        const chatBox = document.body.appendChild(document.createElement('div'));
        chatBox.id = "gc-chat-box";
        chatBox.innerHTML = `<div id="gc-chat-msgs"></div><input id="gc-chat-input" placeholder="Type to sync tabs...">`;

        // Settings Menu
        const menu = document.body.appendChild(document.createElement('div'));
        menu.id = 'client-menu';
        menu.innerHTML = `<h2 style="color:#00ff88; margin:0 0 5px;">GC SETTINGS</h2><p style="font-size:11px; color:#666; margin-bottom:15px;">Press R-SHIFT to Toggle</p>
            <button id="btn-fps" class="gc-sub-btn">FPS COUNTER</button>
            <button id="btn-cps" class="gc-sub-btn">CPS COUNTER</button>
            <button id="btn-keys" class="gc-sub-btn">KEYSTROKES</button>`;

        // SPLASH SEQUENCE
        setTimeout(() => {
            document.getElementById('gc-tagline').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('gc-tagline').style.display = 'none';
                document.getElementById('gc-branding').style.transform = 'translateY(-20px)';
                document.getElementById('gc-launcher-ui').style.display = 'block';
                setTimeout(() => document.getElementById('gc-launcher-ui').style.opacity = '1', 50);
            }, 500);
        }, 2500);

        // BUTTONS
        document.getElementById('gc-play').onclick = () => {
            settings.nickname = document.getElementById('gc-nick-input').value || "GreasyUser";
            save();
            master.style.opacity = '0';
            setTimeout(() => {
                master.remove();
                mainTitle.style.display = 'block';
                chatBox.style.display = 'flex';
                if(settings.showFPS) fpsW.style.display = 'block';
                if(settings.showCPS) cpsW.style.display = 'block';
                if(settings.showKeystrokes) keysW.style.display = 'block';
                startSystems();
            }, 800);
        };

        document.getElementById('gc-chat-input').onkeydown = (e) => {
            if (e.key === 'Enter' && e.target.value.trim() !== "") {
                addChatMessage("You", e.target.value);
                chatBridge.postMessage({ nickname: settings.nickname, message: e.target.value });
                e.target.value = "";
            }
        };

        document.getElementById('gc-open-settings').onclick = () => {
            menu.style.display = 'block'; document.body.classList.add('menu-open');
        };
        document.getElementById('gc-open-discord').onclick = () => window.open(DISCORD_LINK, '_blank');
    }

    function createHUDElement(id, html, pos) {
        const el = document.body.appendChild(document.createElement('div'));
        el.id = id; el.className = 'draggable-hud';
        el.style.top = pos.top; el.style.left = pos.left;
        el.innerHTML = html; return el;
    }

    function startSystems() {
        let frames = 0, lastTime = performance.now(), clicks = [];
        window.addEventListener('mousedown', (e) => { if(e.target.id !== 'gc-chat-input') clicks.push(Date.now()); });
        function update() {
            frames++; const now = performance.now();
            if (now - lastTime >= 1000) {
                if(document.getElementById('fps-display')) document.getElementById('fps-display').innerText = `FPS: ${frames}`;
                frames = 0; lastTime = now;
            }
            clicks = clicks.filter(t => Date.now() - t < 1000);
            if(document.getElementById('cps-display')) document.getElementById('cps-display').innerText = `CPS: ${clicks.length}`;
            requestAnimationFrame(update);
        }
        update();
    }

    window.addEventListener('keydown', e => {
        if (document.activeElement.id === 'gc-chat-input') return;
        const k = document.getElementById(`key-${e.code}`); if(k) k.classList.add('active');
        if(e.code === 'ShiftRight') {
            const m = document.getElementById('client-menu');
            const isVis = m.style.display === 'block';
            m.style.display = isVis ? 'none' : 'block';
            document.body.classList.toggle('menu-open', !isVis);
        }
    });
    window.addEventListener('keyup', e => {
        const k = document.getElementById(`key-${e.code}`); if(k) k.classList.remove('active');
    });

    if (document.readyState === 'complete') init();
    else window.addEventListener('load', init);
})();