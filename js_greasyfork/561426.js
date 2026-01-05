// ==UserScript==
// @name         Hxdes's Mod Menu V1
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hxdes's Mod Menu: Multibox, Anti-AFK, Tactical Crosshair, Themes, Meta Builds, and much more
// @author       Hxdes
// @match        https://diep.io/*
// @run-at       document-end
// @grant        none
// @license      CC-BY-ND-4.0
// @downloadURL https://update.greasyfork.org/scripts/561426/Hxdes%27s%20Mod%20Menu%20V1.user.js
// @updateURL https://update.greasyfork.org/scripts/561426/Hxdes%27s%20Mod%20Menu%20V1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- ANTI-AFK LOGIC ---
    let antiAFKEnabled = false;
    const afkBlob = new Blob([`setInterval(() => postMessage('ping'), 25000);`], { type: 'application/javascript' });
    const afkWorker = new Worker(URL.createObjectURL(afkBlob));

    afkWorker.onmessage = () => {
        if (antiAFKEnabled && window.input && window.input.execute) {
            // Internal heartbeat to keep socket alive without movement
            window.input.execute("ren_score_bar_alpha 0.99");
        }
    };

    // --- MULTIBOX LOGIC ---
    let multiboxEnabled = false;
    let isMaster = false;
    const mbChannel = new BroadcastChannel('hxdes_multibox');

    const simulateKey = (type, data) => {
        const event = new KeyboardEvent(type, {
            key: data.key, code: data.code, keyCode: data.keyCode,
            which: data.which, bubbles: true, cancelable: true, view: window
        });
        window.dispatchEvent(event);
        document.dispatchEvent(event);
    };

    mbChannel.onmessage = (event) => {
        if (!multiboxEnabled || isMaster) return;
        const data = event.data;
        if (data.type === 'mm') {
            const canvas = document.getElementById('canvas');
            if (canvas) canvas.dispatchEvent(new MouseEvent('mousemove', { clientX: data.x, clientY: data.y, bubbles: true }));
        } else if (data.type === 'kd') {
            simulateKey('keydown', data);
        } else if (data.type === 'ku') {
            simulateKey('keyup', data);
        }
    };

    // --- VARIABLES ---
    let centerGuidesActive = false, gridActive = true, hpActive = false, crosshairActive = false, fpsActive = true;
    let currentTheme = "Classic", currentColor = "Cyan", lastBuild = "None Selected";
    let mouseX = 0, mouseY = 0, lastLoop = performance.now(), fps = 0;

    // --- BUILD LIBRARY ---
    const allT4Builds = [
        { cat: "Glass", name: "Pure Glass", stats: [0,0,0,7,7,7,7,5], desc: "Best for: Triplet, Penta Shot, Spread Shot. (0/0/0/7/7/7/7/5)", type: "glass" },
        { cat: "Glass", name: "Speed Glass", stats: [0,0,0,5,7,7,7,7], desc: "Best for: Fighter and Booster. (0/0/0/5/7/7/7/7)", type: "glass" },
        { cat: "Glass", name: "Battleship Meta", stats: [0,0,0,7,7,7,7,5], desc: "Best for: Battleship and Sniper. (0/0/0/7/7/7/7/5)", type: "glass" },
        { cat: "Rammer", name: "Classic Rammer", stats: [5,7,7,0,0,0,7,7], desc: "Best for: Booster, Annihilator, Stalker. (5/7/7/0/0/0/7/7)", type: "ram" },
        { cat: "Rammer", name: "Smasher Pro", stats: [10,10,10,0,0,0,0,10], desc: "Best for: Spike and Landmine. (10/10/10/0/0/0/0/10)", type: "ram" },
        { cat: "Hybrid", name: "Sea Serpent", stats: [0,2,3,0,7,7,7,7], desc: "Best for: Fighter and Booster. (0/2/3/0/7/7/7/7)", type: "glass" },
        { cat: "Hybrid", name: "Hurricane", stats: [0,2,3,7,7,7,0,7], desc: "Best for: Octo Tank and Overlord. (0/2/3/7/7/7/0/7)", type: "glass" },
        { cat: "Hybrid", name: "Drone Meta", stats: [0,0,0,7,7,7,5,7], desc: "Best for: Factory and Necromancer. (0/0/0/7/7/7/5/7)", type: "glass" },
        { cat: "Hybrid", name: "Anti-Ram Overlord", stats: [0,2,3,0,7,7,7,7], desc: "Best for: Overlord survival. (0/2/3/0/7/7/7/7)", type: "glass" }
    ];

    const generateSmartCode = (stats, type) => {
        let code = "";
        let remaining = [...stats];
        let order = [];
        if (type === "glass") { order = [5, 4, 7, 6, 3]; } else { order = [2, 1, 7, 6, 0]; }
        order.forEach(statIdx => { while (remaining[statIdx] > 0) { code += (statIdx + 1); remaining[statIdx]--; } });
        remaining.forEach((val, i) => { while(val > 0) { code += (i+1); val--; } });
        return code;
    };

    const themes = {
        "Classic": {bg: 0xCDCDCD, grid: 0x000000, alpha: 0.1},
        "Dark": {bg: 0x202020, grid: 0x303030, alpha: 0.2},
        "Neon": {bg: 0x001A1A, grid: 0x00FFFF, alpha: 0.15},
        "Midnight": {bg: 0x050505, grid: 0x222222, alpha: 0.1}
    };
    const crossColors = { "Cyan": "#00ffff", "Red": "#ff0000", "Lime": "#00ff00", "Yellow": "#ffff00" };

    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes hxdesFade { 0% { opacity: 0; transform: translate(-50%, -40%); } 15% { opacity: 1; transform: translate(-50%, -50%); } 85% { opacity: 1; transform: translate(-50%, -50%); } 100% { opacity: 0; transform: translate(-50%, -60%); } }
        @keyframes hxdesDim { 0% { background: rgba(0,0,0,0); } 15% { background: rgba(0,0,0,0.85); } 85% { background: rgba(0,0,0,0.85); } 100% { background: rgba(0,0,0,0); } }
        @keyframes textGlow { 0%, 100% { text-shadow: 0 0 10px #00b2e1; } 50% { text-shadow: 0 0 25px #00b2e1; } }
        .hide-cursor { cursor: none !important; }
        .hide-cursor * { cursor: none !important; }
        .hxdes-intro-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; z-index: 10000000; pointer-events: none; animation: hxdesDim 5s ease forwards; }
        .hxdes-text { position: absolute; top: 50%; left: 50%; width: 100%; text-align: center; font-family: 'Ubuntu', sans-serif; font-weight: 900; letter-spacing: 4px; animation: hxdesFade 5s ease forwards; }
        .hxdes-welcome { font-size: 48px; color: #00b2e1; animation: hxdesFade 5s ease forwards, textGlow 2s infinite ease-in-out; }
        .hxdes-subtext { font-size: 22px; color: white; margin-top: 80px; opacity: 0.9; text-transform: uppercase; }
        .tab-btn { flex: 1; padding: 12px; border: none; background: #111; color: #555; cursor: pointer; font-weight: bold; font-size: 12px; transition: 0.2s; border-bottom: 2px solid transparent; }
        .tab-btn.active { color: #00b2e1; background: #181818; border-bottom: 2px solid #00b2e1; }
        .sec-header { color: #00b2e1; font-size: 10px; font-weight: 900; letter-spacing: 1px; margin: 15px 0 8px 0; text-transform: uppercase; border-left: 2px solid #00b2e1; padding-left: 5px; }
        #hx-cross { position:fixed; top:0; left:0; pointer-events:none; z-index:2147483647; display:none; width:50px; height:50px; transform: translate3d(0,0,0); margin-left:-25px; margin-top:-25px; }
        #build-list::-webkit-scrollbar, #pane-info::-webkit-scrollbar { width: 6px; }
        #build-list::-webkit-scrollbar-thumb, #pane-info::-webkit-scrollbar-thumb { background: #00b2e1; border-radius: 10px; }
        .th-btn, .cr-btn { padding: 8px; border: 1px solid #333; color: white; cursor: pointer; border-radius: 4px; font-size: 10px; font-weight: bold; transition: 0.2s; }
        .info-card { background: #111; padding: 12px; border-radius: 6px; margin-bottom: 10px; border-left: 2px solid #00b2e1; width: 100%; box-sizing: border-box; overflow-x: hidden; }
        .info-card h4 { color: #00b2e1; margin: 0 0 5px 0; font-size: 13px; text-transform: uppercase; }
        .info-card p { color: #bbb; margin: 0; font-size: 11px; line-height: 1.4; word-wrap: break-word; }
        .build-card { background: #151515; border: 1px solid #333; border-radius: 8px; padding: 10px; cursor: pointer; transition: 0.2s; display: flex; flex-direction: column; gap: 4px; }
        .build-card:hover { border-color: #00b2e1; background: #1a1a1a; }
        .build-card-name { color: #00b2e1; font-weight: 900; font-size: 11px; text-transform: uppercase; }
        .build-card-desc { color: #888; font-size: 9px; line-height: 1.3; }
        #mb-top-indicator { position: fixed; top: 10px; left: 50%; transform: translateX(-50%); padding: 6px 15px; background: rgba(0, 0, 0, 0.75); border-radius: 50px; font-family: 'Ubuntu', sans-serif; font-size: 12px; font-weight: 900; letter-spacing: 1px; z-index: 10000001; border: 1px solid rgba(255, 255, 255, 0.1); pointer-events: none; text-transform: uppercase; transition: all 0.3s ease; }
    `;
    document.head.appendChild(style);

    const mbIndicator = document.createElement('div');
    mbIndicator.id = 'mb-top-indicator';
    document.body.appendChild(mbIndicator);

    const updateVisuals = () => {
        visualLayer.innerHTML = '';
        if (centerGuidesActive) { visualLayer.innerHTML = `<div style="position:absolute; top:50%; left:0; width:100%; height:2px; background:rgba(255, 0, 0, 0.7);"></div><div style="position:absolute; top:0; left:50%; width:2px; height:100%; background:rgba(255, 0, 0, 0.7);"></div>`; }
        const c = crossColors[currentColor];

        crosshair.innerHTML = `
            <svg width="50" height="50" viewBox="0 0 50 50">
                <circle cx="25" cy="25" r="2.5" fill="${c}" stroke="black" stroke-width="1" />
                <path d="M25 5 V15 M25 35 V45 M5 25 H15 M35 25 H45" stroke="black" stroke-width="3.5" stroke-linecap="round"/>
                <path d="M25 5 V15 M25 35 V45 M5 25 H15 M35 25 H45" stroke="${c}" stroke-width="2" stroke-linecap="round"/>
            </svg>`;

        if (window.input?.execute) {
            const t = themes[currentTheme];
            window.input.execute(`ren_background_color ${t.bg}`);
            window.input.execute(`ren_grid_color ${t.grid}`);
            window.input.execute(`ren_grid_base_alpha ${gridActive ? t.alpha : 0}`);
            window.input.execute(`ren_raw_health_values ${hpActive}`);
        }
        const buildInfo = document.getElementById('build-info-bar');
        if (buildInfo) buildInfo.innerHTML = `BUILD: <span style="color:#00b2e1">${lastBuild.toUpperCase()}</span>`;
        mbIndicator.innerHTML = `MULTIBOX: <span style="color: ${multiboxEnabled ? '#00ff00' : '#ff4444'}">${multiboxEnabled ? 'ON' : 'OFF'}</span> <span style="color: #666; margin-left: 5px;">[F]</span>`;
        mbIndicator.style.borderBottom = `2px solid ${multiboxEnabled ? '#00ff00' : '#ff4444'}`;

        document.getElementById('mb-master-btn').style.background = (multiboxEnabled && isMaster) ? '#00b2e1' : '#222';
        document.getElementById('mb-minion-btn').style.background = (multiboxEnabled && !isMaster) ? '#00b2e1' : '#222';
        document.getElementById('mb-toggle-btn').style.background = multiboxEnabled ? '#00b2e1' : '#222';
        document.getElementById('afk-toggle-btn').style.background = antiAFKEnabled ? '#00b2e1' : '#222';
        document.getElementById('guide-btn').style.background = centerGuidesActive ? '#00b2e1' : '#222';
        document.getElementById('hp-btn').style.background = hpActive ? '#00b2e1' : '#222';
        document.getElementById('cross-btn').style.background = crosshairActive ? '#00b2e1' : '#222';
        document.getElementById('grid-btn').style.background = gridActive ? '#00b2e1' : '#222';

        document.querySelectorAll('.th-btn').forEach(btn => btn.style.background = (btn.innerText === currentTheme) ? '#00b2e1' : '#222');

        document.querySelectorAll('.cr-btn').forEach(btn => {
            if (btn.innerText === currentColor) {
                btn.style.background = crossColors[currentColor];
                btn.style.borderColor = 'white';
            } else {
                btn.style.background = '#222';
                btn.style.borderColor = '#333';
            }
        });

        const crRow = document.getElementById('cross-color-row');
        const crHeader = document.getElementById('cross-color-header');
        if (crRow) crRow.style.display = crosshairActive ? 'grid' : 'none';
        if (crHeader) crHeader.style.display = crosshairActive ? 'block' : 'none';
        if (crosshairActive) { document.body.classList.add('hide-cursor'); crosshair.style.display = 'block'; } else { document.body.classList.remove('hide-cursor'); crosshair.style.display = 'none'; }
    };

    let menu, isDragging = false, offset = { x: 0, y: 0 };
    const initMenu = () => {
        if (document.getElementById('diep-toolkit-root')) return;
        menu = document.createElement('div');
        menu.id = 'diep-toolkit-root';
        const savedPos = JSON.parse(localStorage.getItem('toolkit-pos') || '{"top":"20px","left":"20px"}');
        menu.style = `position:fixed; top:${savedPos.top}; left:${savedPos.left}; width:420px; height:88vh; background:rgba(10,10,10,0.98); color:white; border-radius:12px; z-index:999999; display:none; flex-direction:column; border:3px solid #00b2e1; box-sizing:border-box; overflow: hidden;`;

        menu.innerHTML = `
            <div id="drag-header" style="text-align:center; font-weight:900; padding:15px; font-size:20px; color:#00b2e1; cursor:move; user-select:none; letter-spacing:2px; background: rgba(0,0,0,0.3); flex-shrink: 0;">HXDES MOD MENU V1.0</div>
            <div style="display:flex; width:100%; flex-shrink: 0;">
                <button id="tab-main" class="tab-btn active">MENU</button>
                <button id="tab-multibox" class="tab-btn">MULTIBOX</button>
                <button id="tab-info" class="tab-btn">INFO</button>
            </div>
            <div id="menu-content" style="padding: 20px; flex: 1; display: flex; flex-direction: column; overflow: hidden;">
                <div id="pane-main" style="display: flex; flex-direction: column; height: 100%; overflow: hidden;">
                    <div id="build-info-bar" style="background:#181818; padding:8px 15px; border-radius:50px; font-size:10px; margin-bottom:15px; border:1px solid #333; text-align:center; font-weight:900; letter-spacing:1px; flex-shrink: 0;"></div>
                    <div style="flex-shrink: 0;">
                        <div class="sec-header">Visual Toggles</div>
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; margin-bottom:5px;">
                            <button id="guide-btn" style="padding:10px; border:none; color:white; cursor:pointer; border-radius:4px; font-size:10px; font-weight:bold;">GUIDES</button>
                            <button id="hp-btn" style="padding:10px; border:none; color:white; cursor:pointer; border-radius:4px; font-size:10px; font-weight:bold;">HP VALUES</button>
                            <button id="cross-btn" style="padding:10px; border:none; color:white; cursor:pointer; border-radius:4px; font-size:10px; font-weight:bold;">CROSSHAIR</button>
                            <button id="grid-btn" style="padding:10px; border:none; color:white; cursor:pointer; border-radius:4px; font-size:10px; font-weight:bold;">GRID</button>
                        </div>
                        <div id="cross-color-header" class="sec-header" style="display:none;">Crosshair Color</div>
                        <div id="cross-color-row" style="display:none; grid-template-columns: repeat(4, 1fr); gap:8px; margin-bottom:5px;">
                            ${Object.keys(crossColors).map(c => `<button class="cr-btn">${c}</button>`).join('')}
                        </div>
                        <div class="sec-header">Visual Themes</div>
                        <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:8px; margin-bottom:5px;">
                            ${Object.keys(themes).map(t => `<button class="th-btn">${t}</button>`).join('')}
                        </div>
                        <div class="sec-header">Tactical Build Library</div>
                        <button id="clear-build-btn" style="width:100%; padding:8px; background:#222; border:1px solid #444; color:#ff4444; border-radius:50px; font-size:10px; font-weight:bold; cursor:pointer; margin-bottom:10px; text-transform:uppercase;">Clear Current Build</button>
                        <input type="text" id="b-search" placeholder="Search archetypes..." style="width:100%; padding:10px; margin-bottom:10px; background:#181818; border:1px solid #333; color:white; border-radius:6px; font-size:13px; outline:none;">
                    </div>
                    <div id="build-list" style="overflow-y: auto; flex-grow: 1; border-top:1px solid #333; padding-top:10px; display: grid; grid-template-columns: 1fr; gap: 8px;"></div>
                </div>

                <div id="pane-multibox" style="display: none; flex-direction: column; overflow-y: auto;">
                    <div class="sec-header">Status</div>
                    <div id="mb-status-box" style="padding:10px; border-radius:4px; font-size:12px; text-align:center; font-weight:bold; margin-bottom:10px; background:#111;">MULTIBOX MANAGER</div>
                    <button id="mb-toggle-btn" style="width:100%; padding:15px; margin-bottom:15px; border:none; color:white; border-radius:6px; font-weight:bold; cursor:pointer;">TOGGLE MULTIBOX [F]</button>
                    <div class="sec-header">Role Selection</div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:20px;">
                        <button id="mb-master-btn" style="padding:12px; border:none; color:white; cursor:pointer; border-radius:4px; font-weight:bold;">SET AS MASTER</button>
                        <button id="mb-minion-btn" style="padding:12px; border:none; color:white; cursor:pointer; border-radius:4px; font-weight:bold;">SET AS MINION</button>
                    </div>
                    <div class="sec-header">Anti-AFK System</div>
                    <button id="afk-toggle-btn" style="width:100%; padding:15px; border:none; color:white; border-radius:6px; font-weight:bold; cursor:pointer;">TOGGLE ANTI-AFK</button>
                    <div class="info-card" style="margin-top:10px;">
                        <h4>Movement Lock Active</h4>
                        <p>Uses a background worker to keep the connection alive every 25s. When enabled, your movement keys are disabled so the tank stays still.</p>
                    </div>
                </div>

                <div id="pane-info" style="display: none; overflow-y: auto; flex-direction: column; height: 100%;">
                    <div class="sec-header">Feature Manual</div>
                    <div class="info-card">
                        <h4>Multiboxing</h4>
                        <p>Synchronize multiple Diep.io tabs. The <b>Master</b> sends keyboard and mouse movement data via the BroadcastChannel API. <b>Minions</b> listen for these signals and mirror your actions.</p>
                    </div>
                    <div class="info-card">
                        <h4>Smart Auto-Builder</h4>
                        <p>Automatically applies stat points as you level up. It uses a custom sequencing logic based on your archetype selection.</p>
                    </div>
                    <div class="info-card">
                        <h4>Visual Toggles</h4>
                        <p><b>Guides:</b> Center-lines. <b>HP Values:</b> Numbers on bars. <b>Crosshair:</b> Tactical cursor. <b>Grid:</b> Toggle background.</p>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(menu);

        const header = menu.querySelector('#drag-header');
        header.onmousedown = (e) => { isDragging = true; offset = { x: menu.offsetLeft - e.clientX, y: menu.offsetTop - e.clientY }; };
        document.onmousemove = (e) => { if (isDragging) { menu.style.left = (e.clientX + offset.x) + 'px'; menu.style.top = (e.clientY + offset.y) + 'px'; } };
        document.onmouseup = () => { isDragging = false; };
        const btnMain = menu.querySelector('#tab-main'), btnMB = menu.querySelector('#tab-multibox'), btnInfo = menu.querySelector('#tab-info');
        const paneMain = menu.querySelector('#pane-main'), paneMB = menu.querySelector('#pane-multibox'), paneInfo = menu.querySelector('#pane-info');
        const switchTab = (activeBtn, activePane) => { [btnMain, btnMB, btnInfo].forEach(b => b.classList.remove('active')); [paneMain, paneMB, paneInfo].forEach(p => p.style.display = 'none'); activeBtn.classList.add('active'); activePane.style.display = 'flex'; };
        btnMain.onclick = () => switchTab(btnMain, paneMain); btnMB.onclick = () => switchTab(btnMB, paneMB); btnInfo.onclick = () => switchTab(btnInfo, paneInfo);
        menu.querySelector('#mb-toggle-btn').onclick = () => { multiboxEnabled = !multiboxEnabled; updateVisuals(); };
        menu.querySelector('#afk-toggle-btn').onclick = () => { antiAFKEnabled = !antiAFKEnabled; updateVisuals(); };
        menu.querySelector('#mb-master-btn').onclick = () => { isMaster = true; updateVisuals(); };
        menu.querySelector('#mb-minion-btn').onclick = () => { isMaster = false; updateVisuals(); };
        menu.querySelector('#guide-btn').onclick = () => { centerGuidesActive = !centerGuidesActive; updateVisuals(); };
        menu.querySelector('#hp-btn').onclick = () => { hpActive = !hpActive; updateVisuals(); };
        menu.querySelector('#cross-btn').onclick = () => { crosshairActive = !crosshairActive; updateVisuals(); };
        menu.querySelector('#grid-btn').onclick = () => { gridActive = !gridActive; updateVisuals(); };
        menu.querySelector('#clear-build-btn').onclick = () => { if(window.input?.execute) window.input.execute("game_stats_build None"); lastBuild = "None Selected"; updateVisuals(); };
        menu.querySelectorAll('.th-btn').forEach(b => b.onclick = () => { currentTheme = b.innerText; updateVisuals(); });
        menu.querySelectorAll('.cr-btn').forEach(b => b.onclick = () => { currentColor = b.innerText; updateVisuals(); });
        const bList = menu.querySelector('#build-list');
        const drawBuilds = (f = "") => {
            bList.innerHTML = "";
            allT4Builds.filter(b => b.name.toLowerCase().includes(f.toLowerCase()) || b.cat.toLowerCase().includes(f.toLowerCase())).forEach(b => {
                const card = document.createElement('div'); card.className = 'build-card'; card.innerHTML = `<div class="build-card-name">${b.name}</div><div class="build-card-desc">${b.desc}</div>`;
                card.onclick = () => { if(window.input?.execute) { window.input.execute("game_stats_build " + generateSmartCode(b.stats, b.type)); lastBuild = b.name; updateVisuals(); } };
                bList.appendChild(card);
            });
        };
        menu.querySelector('#b-search').oninput = (e) => drawBuilds(e.target.value);
        drawBuilds(); updateVisuals();
        setTimeout(() => { const overlay = document.createElement('div'); overlay.className = 'hxdes-intro-overlay'; overlay.innerHTML = `<div class="hxdes-text hxdes-welcome">Welcome to Hxdes's Mod Menu</div><div class="hxdes-text hxdes-subtext">Press [ R ] to Toggle Menu</div>`; document.body.appendChild(overlay); setTimeout(() => overlay.remove(), 5500); }, 100);
    };

    const visualLayer = document.createElement('div'); visualLayer.style = `position:fixed; top:0; left:0; width:100vw; height:100vh; pointer-events:none; z-index:2147483646;`;
    document.body.appendChild(visualLayer);
    const crosshair = document.createElement('div'); crosshair.id = "hx-cross"; document.body.appendChild(crosshair);
    const fpsDisplay = document.createElement('div'); fpsDisplay.style = `position:fixed; top:10px; right:15px; color:#00b2e1; font-weight:bold; font-size:16px; pointer-events:none; z-index:2147483647;`;
    document.body.appendChild(fpsDisplay);

    function loop() { const now = performance.now(); fps = Math.round(1000 / (now - lastLoop)); fpsDisplay.innerText = `FPS: ${fps}`; lastLoop = now; if (crosshairActive) crosshair.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`; requestAnimationFrame(loop); }

    window.addEventListener('keydown', (e) => {
        // --- MOVEMENT LOCK LOGIC ---
        const moveKeys = ['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'];
        if (antiAFKEnabled && moveKeys.includes(e.key.toLowerCase())) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }

        if (document.activeElement.tagName === 'INPUT') return;
        if (e.key.toLowerCase() === 'r') menu.style.display = menu.style.display === 'none' ? 'flex' : 'none';
        if (e.key.toLowerCase() === 'f') { multiboxEnabled = !multiboxEnabled; updateVisuals(); }
        if (multiboxEnabled && isMaster) mbChannel.postMessage({ type: 'kd', key: e.key, code: e.code, keyCode: e.keyCode, which: e.which });
    }, true);

    window.addEventListener('keyup', (e) => { if (multiboxEnabled && isMaster) mbChannel.postMessage({ type: 'ku', key: e.key, code: e.code, keyCode: e.keyCode, which: e.which }); }, true);
    window.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; if (multiboxEnabled && isMaster) mbChannel.postMessage({ type: 'mm', x: mouseX, y: mouseY }); }, true);

    loop();
    setTimeout(initMenu, 1000);
})();