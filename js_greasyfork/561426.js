// ==UserScript==
// @name         Hxdes's Mod Menu (PRO) V1.5
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Multiboxing, Auto-Builds (Glass/Ram/Meta), 101+ Themes, Dynamic Rainbow Mode, Custom SVG Crosshairs, Numeric HP, and Anti-AFK. Press [R] for Menu.
// @author       Hxdes
// @license      All Rights Reserved. No part of this script may be copied, edited, redistributed, or stolen without explicit permission from Hxdes.
// @match        https://diep.io/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561426/Hxdes%27s%20Mod%20Menu%20%28PRO%29%20V15.user.js
// @updateURL https://update.greasyfork.org/scripts/561426/Hxdes%27s%20Mod%20Menu%20%28PRO%29%20V15.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- ANTI-AFK LOGIC ---
    let antiAFKEnabled = false;
    let showAFKIndicator = false; 
    const afkBlob = new Blob([`setInterval(() => postMessage('ping'), 25000);`], { type: 'application/javascript' });
    const afkWorker = new Worker(URL.createObjectURL(afkBlob));
    afkWorker.onmessage = () => { if (antiAFKEnabled && window.input && window.input.execute) window.input.execute("ren_score_bar_alpha 0.99"); };

    // --- MULTIBOX LOGIC ---
    let multiboxEnabled = false;
    let showMBIndicator = false; 
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
    let centerGuidesActive = false, gridActive = true, hpActive = false, crosshairActive = false;
    let currentTheme = "Classic", currentColor = "#00ffff", lastBuild = "None Selected", currentCrosshair = "Tactical";
    let mouseX = 0, mouseY = 0, lastLoop = performance.now(), fps = 0, hue = 0;

    // --- CROSSHAIR DEFINITIONS ---
    const crosshairShapes = {
        "Tactical": `<svg width="50" height="50" viewBox="0 0 50 50"><circle cx="25" cy="25" r="2.5" fill="COLOR" stroke="black" stroke-width="1.2"/><circle cx="25" cy="25" r="8" fill="none" stroke="black" stroke-width="4"/><circle cx="25" cy="25" r="8" fill="none" stroke="COLOR" stroke-width="2.5"/><path d="M25 10 V15 M25 35 V40 M10 25 H15 M35 25 H40" stroke="black" stroke-width="5" stroke-linecap="round"/><path d="M25 10 V15 M25 35 V40 M10 25 H15 M35 25 H40" stroke="COLOR" stroke-width="3.5" stroke-linecap="round"/></svg>`,
        "Cross": `<svg width="60" height="60" viewBox="0 0 60 60"><path d="M30 18 V42 M18 30 H42" stroke="black" stroke-width="5" stroke-linecap="square"/><path d="M30 18 V42 M18 30 H42" stroke="COLOR" stroke-width="3" stroke-linecap="square"/></svg>`,
        "Dot": `<svg width="50" height="50" viewBox="0 0 50 50"><circle cx="25" cy="25" r="4.5" fill="black"/><circle cx="25" cy="25" r="3" fill="COLOR"/></svg>`,
        "Chevron": `<svg width="50" height="50" viewBox="0 0 50 50"><path d="M12 35 L25 18 L38 35" fill="none" stroke="black" stroke-width="6" stroke-linejoin="miter" stroke-linecap="square"/><path d="M12 35 L25 18 L38 35" fill="none" stroke="COLOR" stroke-width="3.5" stroke-linejoin="miter" stroke-linecap="square"/></svg>`,
        "T-Post": `<svg width="50" height="50" viewBox="0 0 50 50"><path d="M25 42 V22 M10 22 H40" stroke="black" stroke-width="6" stroke-linecap="square"/><path d="M25 42 V22 M10 22 H40" stroke="COLOR" stroke-width="3.5" stroke-linecap="square"/></svg>`,
        "X-Sight": `<svg width="50" height="50" viewBox="0 0 50 50"><path d="M15 15 L35 35 M35 15 L15 35" stroke="black" stroke-width="5" stroke-linecap="round"/><path d="M15 15 L35 35 M35 15 L15 35" stroke="COLOR" stroke-width="3" stroke-linecap="round"/></svg>`
    };

    // --- THEMES ---
    const themes = {
        "Rainbow": {bg: 0x000000, grid: 0x000000, alpha: 0.3, dynamic: true},
        "Classic": {bg: 0xCDCDCD, grid: 0x000000, alpha: 0.1}, "Dark": {bg: 0x202020, grid: 0x303030, alpha: 0.2}, "Neon": {bg: 0x001A1A, grid: 0x00FFFF, alpha: 0.15}, "Midnight": {bg: 0x050505, grid: 0x222222, alpha: 0.1},
        "Virtual Boy": {bg: 0x000000, grid: 0xFF0000, alpha: 0.3}, "Pip-Boy": {bg: 0x020502, grid: 0x00FF00, alpha: 0.2}, "Matrix": {bg: 0x000000, grid: 0x003300, alpha: 0.5}, "Tron": {bg: 0x02020A, grid: 0x00D9FF, alpha: 0.2},
        "Gameboy": {bg: 0x8BAC0F, grid: 0x306230, alpha: 0.2}, "Commodore 64": {bg: 0x352879, grid: 0x6C5EB5, alpha: 0.3}, "Retro-PC": {bg: 0x000080, grid: 0xC0C0C0, alpha: 0.2}, "Cyberpunk": {bg: 0x0B0014, grid: 0xFCEE09, alpha: 0.1},
        "Thermal": {bg: 0x1A0033, grid: 0xFFFF00, alpha: 0.2}, "Magma": {bg: 0x110500, grid: 0xFF4500, alpha: 0.3}, "Blueprint": {bg: 0x1A3A6D, grid: 0xFFFFFF, alpha: 0.1}, "Monochrome": {bg: 0x000000, grid: 0xFFFFFF, alpha: 0.2},
        "Ocean": {bg: 0x001B2E, grid: 0x00D2FF, alpha: 0.1}, "Forest": {bg: 0x0E1A0E, grid: 0x3E5C3E, alpha: 0.2}, "Desert": {bg: 0x3D2B1F, grid: 0xEDC9AF, alpha: 0.2}, "Inferno": {bg: 0x1A0000, grid: 0xFF0000, alpha: 0.2},
        "Sky": {bg: 0x87CEEB, grid: 0xFFFFFF, alpha: 0.2}, "Space": {bg: 0x020208, grid: 0x4B0082, alpha: 0.1}, "Emerald": {bg: 0x001A0D, grid: 0x50C878, alpha: 0.15}, "Gold": {bg: 0x1A1500, grid: 0xD4AF37, alpha: 0.2},
        "Sunset": {bg: 0x2D142C, grid: 0xEE4540, alpha: 0.2}, "Lavender": {bg: 0x2E1A47, grid: 0x9370DB, alpha: 0.15}, "Mint": {bg: 0xF5FFFA, grid: 0x3EB489, alpha: 0.1}, "Candy": {bg: 0xFFF0F5, grid: 0xFF69B4, alpha: 0.2},
        "Blood": {bg: 0x1A0000, grid: 0x800000, alpha: 0.3}, "Toxic": {bg: 0x0D1A00, grid: 0xADFF2F, alpha: 0.2}, "Royal": {bg: 0x1A0033, grid: 0xFFD700, alpha: 0.15}, "Peppermint": {bg: 0xFFFFFF, grid: 0xFF0000, alpha: 0.05},
        "Nord": {bg: 0x2E3440, grid: 0x88C0D0, alpha: 0.15}, "Dracula": {bg: 0x282A36, grid: 0xBD93F9, alpha: 0.2}, "Slate": {bg: 0x2F4F4F, grid: 0x708090, alpha: 0.2}, "Void": {bg: 0x010101, grid: 0x111111, alpha: 0.05},
        "Titanium": {bg: 0x333333, grid: 0x555555, alpha: 0.2}, "Bronze": {bg: 0x2A1A0A, grid: 0xCD7F32, alpha: 0.2}, "Carbon": {bg: 0x111111, grid: 0x222222, alpha: 0.3}, "Ghost": {bg: 0xE6E6E6, grid: 0xFFFFFF, alpha: 0.5},
        "Solar": {bg: 0x1A0F00, grid: 0xFDB813, alpha: 0.2}, "Arctic": {bg: 0xFFFFFF, grid: 0xADD8E6, alpha: 0.2}, "Deep Sea": {bg: 0x00001A, grid: 0x0000FF, alpha: 0.2}, "Mars": {bg: 0x331100, grid: 0xCC4400, alpha: 0.2},
        "Outrun": {bg: 0x190233, grid: 0xFF00FF, alpha: 0.15}, "Vaporwave": {bg: 0x00B2E1, grid: 0xFF71CE, alpha: 0.2}, "Synthwave": {bg: 0x241734, grid: 0x2DE2E6, alpha: 0.2}, "Tokyo": {bg: 0x111111, grid: 0xFE019A, alpha: 0.15},
        "Overgrowth": {bg: 0x1B1E10, grid: 0x4B5320, alpha: 0.2}, "Storm": {bg: 0x1C1C1C, grid: 0x6495ED, alpha: 0.2}, "Paper": {bg: 0xF4F4F4, grid: 0xCCCCCC, alpha: 0.3}, "Aero": {bg: 0xF0F8FF, grid: 0x00B2E1, alpha: 0.05},
        "Obsidian": {bg: 0x0A0A0A, grid: 0x4B0082, alpha: 0.1}, "Sakura": {bg: 0x1A0A0F, grid: 0xFFB7C5, alpha: 0.2}, "Electric": {bg: 0x000033, grid: 0x007FFF, alpha: 0.2}, "Autumn": {bg: 0x2A1801, grid: 0xD2691E, alpha: 0.2},
        "Vampire": {bg: 0x0A0000, grid: 0x4A0000, alpha: 0.3}, "Ice": {bg: 0xF0FFFF, grid: 0x00CED1, alpha: 0.1}, "Copper": {bg: 0x1A0F00, grid: 0xB87333, alpha: 0.2}, "Radioactive": {bg: 0x000000, grid: 0x39FF14, alpha: 0.1},
        "Coffee": {bg: 0x2C1E16, grid: 0x6F4E37, alpha: 0.2}, "Lavender-Fog": {bg: 0x1A1A2E, grid: 0x16213E, alpha: 0.4}, "Cyber-Red": {bg: 0x000000, grid: 0xFF003C, alpha: 0.2}, "Zen": {bg: 0xF5F5DC, grid: 0x808000, alpha: 0.1},
        "Deep-Purple": {bg: 0x120458, grid: 0xFF124F, alpha: 0.2}, "Alien": {bg: 0x001100, grid: 0x00FF00, alpha: 0.1}, "Glitch": {bg: 0x000000, grid: 0x00FFFF, alpha: 0.4}, "Uranium": {bg: 0x001A00, grid: 0xCCFF00, alpha: 0.2},
        "Bumblebee": {bg: 0x111100, grid: 0xFFFF00, alpha: 0.3}, "Hot-Pink": {bg: 0x1A000A, grid: 0xFF69B4, alpha: 0.2}, "Plum": {bg: 0x1A001A, grid: 0xDDA0DD, alpha: 0.2}, "Vintage": {bg: 0x3D3D3D, grid: 0xA9A9A9, alpha: 0.2},
        "Night-Owl": {bg: 0x010101, grid: 0x1E90FF, alpha: 0.1}, "Red-Alert": {bg: 0x1A0000, grid: 0xFF0000, alpha: 0.4}, "Jungle": {bg: 0x051105, grid: 0x006400, alpha: 0.2}, "Deep-Blue": {bg: 0x00001A, grid: 0x000080, alpha: 0.4},
        "Sandstone": {bg: 0x2D1A0A, grid: 0xCD853F, alpha: 0.2}, "Amethyst": {bg: 0x1A002A, grid: 0x9966CC, alpha: 0.2}, "Hacker-Pro": {bg: 0x000000, grid: 0x00FF41, alpha: 0.2}, "Minimal": {bg: 0x0D0D0D, grid: 0x1A1A1A, alpha: 0.4},
        "Chalkboard": {bg: 0x1A2421, grid: 0xFFFFFF, alpha: 0.1}, "Rust": {bg: 0x1A0A00, grid: 0x8B4513, alpha: 0.3}, "Camo": {bg: 0x2E3B2E, grid: 0x556B2F, alpha: 0.2}, "Steel": {bg: 0x1A1A1A, grid: 0x4682B4, alpha: 0.2},
        "Ultraviolet": {bg: 0x1A001A, grid: 0x7F00FF, alpha: 0.3}, "Creepy": {bg: 0x050000, grid: 0x330000, alpha: 0.6}, "Ocean-Breeze": {bg: 0xE0FFFF, grid: 0x00BFFF, alpha: 0.1}, "Dune": {bg: 0x2A2A00, grid: 0xFFFFE0, alpha: 0.1},
        "Midnight-Sky": {bg: 0x00000C, grid: 0xFFFFFF, alpha: 0.05}, "Neon-Grape": {bg: 0x1A001A, grid: 0x8F00FF, alpha: 0.2}, "Cold-Steel": {bg: 0x121212, grid: 0xE0E0E0, alpha: 0.1}, "Firefly": {bg: 0x000000, grid: 0xFFFF00, alpha: 0.1},
        "Crimson": {bg: 0x1A0000, grid: 0xDC143C, alpha: 0.2}, "Aqua": {bg: 0x001A1A, grid: 0x7FFFD4, alpha: 0.1}, "Shadow": {bg: 0x020202, grid: 0x0A0A0A, alpha: 0.3}, "Limelight": {bg: 0x001A00, grid: 0x32CD32, alpha: 0.15},
        "Polar": {bg: 0xF0F8FF, grid: 0xB0C4DE, alpha: 0.2}, "Grapefruit": {bg: 0x1A0000, grid: 0xFF6347, alpha: 0.2}, "Abyss": {bg: 0x000005, grid: 0x191970, alpha: 0.2}, "High-Contrast": {bg: 0xFFFFFF, grid: 0x000000, alpha: 0.5}
    };

    const allT4Builds = [
        { cat: "Glass", name: "Pure Glass", stats: [0,0,0,7,7,7,7,5], desc: "Best for: Triplet, Penta Shot, Spread Shot.", type: "glass" },
        { cat: "Glass", name: "Speed Glass", stats: [0,0,0,5,7,7,7,7], desc: "Best for: Fighter and Booster.", type: "glass" },
        { cat: "Glass", name: "Battleship Meta", stats: [0,0,0,7,7,7,7,5], desc: "Best for: Battleship and Sniper.", type: "glass" },
        { cat: "Rammer", name: "Classic Rammer", stats: [5,7,7,0,0,0,7,7], desc: "Best for: Booster, Annihilator, Stalker.", type: "ram" },
        { cat: "Rammer", name: "Smasher Pro", stats: [10,10,10,0,0,0,0,10], desc: "Best for: Spike and Landmine.", type: "ram" },
        { cat: "Hybrid", name: "Sea Serpent", stats: [0,2,3,0,7,7,7,7], desc: "Best for: Fighter and Booster.", type: "glass" },
        { cat: "Hybrid", name: "Hurricane", stats: [0,2,3,7,7,7,0,7], desc: "Best for: Octo Tank and Overlord.", type: "glass" },
        { cat: "Hybrid", name: "Drone Meta", stats: [0,0,0,7,7,7,5,7], desc: "Best for: Factory and Necromancer.", type: "glass" },
        { cat: "Hybrid", name: "Anti-Ram Overlord", stats: [0,2,3,0,7,7,7,7], desc: "Best for: Overlord survival.", type: "glass" }
    ];

    const generateSmartCode = (stats, type) => {
        let code = ""; let remaining = [...stats]; let order = (type === "glass") ? [5, 4, 7, 6, 3] : [2, 1, 7, 6, 0];
        order.forEach(statIdx => { while (remaining[statIdx] > 0) { code += (statIdx + 1); remaining[statIdx]--; } });
        remaining.forEach((val, i) => { while(val > 0) { code += (i+1); val--; } }); return code;
    };

    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes hxdesFade { 0% { opacity: 0; transform: translate(-50%, -40%); } 15% { opacity: 1; transform: translate(-50%, -50%); } 85% { opacity: 1; transform: translate(-50%, -50%); } 100% { opacity: 0; transform: translate(-50%, -60%); } }
        @keyframes hxdesDim { 0% { background: rgba(0,0,0,0); } 15% { background: rgba(0,0,0,0.85); } 85% { background: rgba(0,0,0,0.85); } 100% { background: rgba(0,0,0,0); } }
        @keyframes textGlow { 0%, 100% { text-shadow: 0 0 10px #00b2e1; } 50% { text-shadow: 0 0 25px #00b2e1; } }
        .hide-cursor { cursor: none !important; } .hide-cursor * { cursor: none !important; }
        .hxdes-intro-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; z-index: 10000000; pointer-events: none; animation: hxdesDim 5s ease forwards; }
        .hxdes-text { position: absolute; top: 50%; left: 50%; width: 100%; text-align: center; font-family: 'Ubuntu', sans-serif; font-weight: 900; letter-spacing: 4px; animation: hxdesFade 5s ease forwards; }
        .hxdes-welcome { font-size: 48px; color: #00b2e1; animation: hxdesFade 5s ease forwards, textGlow 2s infinite ease-in-out; }
        .hxdes-subtext { font-size: 22px; color: white; margin-top: 80px; opacity: 0.9; text-transform: uppercase; }
        .tab-btn { flex: 1; padding: 12px; border: none; background: #111; color: #555; cursor: pointer; font-weight: bold; font-size: 11px; transition: 0.2s; border-bottom: 2px solid transparent; }
        .tab-btn.active { color: #00b2e1; background: #181818; border-bottom: 2px solid #00b2e1; }
        .sec-header { color: #00b2e1; font-size: 10px; font-weight: 900; letter-spacing: 1px; margin: 15px 0 8px 0; text-transform: uppercase; border-left: 2px solid #00b2e1; padding-left: 5px; }
        #hx-cross { position:fixed; top:0; left:0; pointer-events:none; z-index:2147483647; display:none; width:60px; height:60px; transform: translate3d(0,0,0); margin-left:-30px; margin-top:-30px; }
        #build-list::-webkit-scrollbar, #theme-list::-webkit-scrollbar, #pane-info::-webkit-scrollbar { width: 6px; }
        #build-list::-webkit-scrollbar-thumb, #theme-list::-webkit-scrollbar-thumb, #pane-info::-webkit-scrollbar-thumb { background: #00b2e1; border-radius: 10px; }
        .btn-toggle { padding: 10px; border: none; color: white; cursor: pointer; border-radius: 4px; font-size: 10px; font-weight: bold; transition: 0.2s; }
        .th-btn { padding: 14px; margin-bottom: 6px; border: 1px solid #333; color: white; cursor: pointer; border-radius: 6px; font-size: 13px; font-weight: 900; transition: 0.2s; text-align: left; background: #222; width: 100%; letter-spacing: 1px; text-transform: uppercase; }
        .info-card { background: #111; padding: 12px; border-radius: 6px; margin-bottom: 10px; border-left: 2px solid #00b2e1; width: 100%; box-sizing: border-box; }
        .info-card h4 { color: #00b2e1; margin: 0 0 5px 0; font-size: 11px; text-transform: uppercase; }
        .info-card p { color: #bbb; margin: 0; font-size: 10px; line-height: 1.4; }
        .build-card { background: #151515; border: 1px solid #333; border-radius: 8px; padding: 10px; cursor: pointer; transition: 0.2s; display: flex; flex-direction: column; gap: 4px; border-left: 3px solid transparent; }
        .build-card-name { color: #00b2e1; font-weight: 900; font-size: 11px; text-transform: uppercase; }
        .cross-opt { padding: 10px; background: #181818; border: 1px solid #333; color: #666; font-size: 9px; font-weight: 900; text-align: center; cursor: pointer; border-radius: 4px; transition: 0.2s; }
        .top-indicator { position: fixed; top: 10px; padding: 6px 15px; background: rgba(0, 0, 0, 0.75); border-radius: 50px; font-family: 'Ubuntu', sans-serif; font-size: 12px; font-weight: 900; letter-spacing: 1px; z-index: 10000001; border: 1px solid rgba(255, 255, 255, 0.1); pointer-events: none; text-transform: uppercase; transition: all 0.3s ease; display: none; }
        #mb-top-indicator { left: calc(50% - 95px); transform: translateX(-50%); }
        #afk-top-indicator { left: calc(50% + 95px); transform: translateX(-50%); }
    `;
    document.head.appendChild(style);

    const mbIndicator = document.createElement('div');
    mbIndicator.id = 'mb-top-indicator'; mbIndicator.className = 'top-indicator';
    document.body.appendChild(mbIndicator);

    const afkIndicator = document.createElement('div');
    afkIndicator.id = 'afk-top-indicator'; afkIndicator.className = 'top-indicator';
    document.body.appendChild(afkIndicator);

    const updateVisuals = () => {
        visualLayer.innerHTML = '';
        if (centerGuidesActive) { visualLayer.innerHTML = `<div style="position:absolute; top:50%; left:0; width:100%; height:2px; background:rgba(255, 0, 0, 0.7);"></div><div style="position:absolute; top:0; left:50%; width:2px; height:100%; background:rgba(255, 0, 0, 0.7);"></div>`; }
        crosshair.innerHTML = crosshairShapes[currentCrosshair].replace(/COLOR/g, currentColor);

        const t = themes[currentTheme];
        if (window.input?.execute) {
            if (!t.dynamic) { window.input.execute(`ren_background_color ${t.bg}`); window.input.execute(`ren_grid_color ${t.grid}`); }
            window.input.execute(`ren_grid_base_alpha ${gridActive ? t.alpha : 0}`);
            window.input.execute(`ren_raw_health_values ${hpActive}`);
        }

        const buildInfo = document.getElementById('build-info-bar'); if (buildInfo) buildInfo.innerHTML = `BUILD: <span style="color:#00b2e1">${lastBuild.toUpperCase()}</span>`;
        
        mbIndicator.style.display = showMBIndicator ? 'block' : 'none';
        mbIndicator.innerHTML = `MULTIBOX: <span style="color: ${multiboxEnabled ? '#00ff00' : '#ff4444'}">${multiboxEnabled ? 'ON' : 'OFF'}</span> <span style="color: #666; margin-left: 5px;">[F]</span>`;
        mbIndicator.style.borderBottom = `2px solid ${multiboxEnabled ? '#00ff00' : '#ff4444'}`;

        afkIndicator.style.display = showAFKIndicator ? 'block' : 'none';
        afkIndicator.innerHTML = `ANTI-AFK: <span style="color: ${antiAFKEnabled ? '#00ff00' : '#ff4444'}">${antiAFKEnabled ? 'ON' : 'OFF'}</span> <span style="color: #666; margin-left: 5px;">[K]</span>`;
        afkIndicator.style.borderBottom = `2px solid ${antiAFKEnabled ? '#00ff00' : '#ff4444'}`;

        document.getElementById('mb-tog-ui-btn').style.background = showMBIndicator ? '#00b2e1' : '#222';
        document.getElementById('afk-tog-ui-btn').style.background = showAFKIndicator ? '#00b2e1' : '#222';
        document.getElementById('afk-toggle-btn').style.background = antiAFKEnabled ? '#00b2e1' : '#222';
        document.getElementById('mb-toggle-btn').style.background = multiboxEnabled ? '#00b2e1' : '#222';
        document.getElementById('mb-master-btn').style.background = (multiboxEnabled && isMaster) ? '#00b2e1' : '#222';
        document.getElementById('mb-minion-btn').style.background = (multiboxEnabled && !isMaster) ? '#00b2e1' : '#222';

        document.getElementById('guide-btn').style.background = centerGuidesActive ? '#00b2e1' : '#222';
        document.getElementById('hp-btn').style.background = hpActive ? '#00b2e1' : '#222';
        document.getElementById('cross-btn').style.background = crosshairActive ? '#00b2e1' : '#222';
        document.getElementById('grid-btn').style.background = gridActive ? '#00b2e1' : '#222';

        document.querySelectorAll('.th-btn').forEach(btn => {
             btn.style.background = (btn.innerText === currentTheme.toUpperCase()) ? '#00b2e1' : '#222';
        });

        document.querySelectorAll('.cross-opt').forEach(btn => {
            const isSelected = btn.dataset.shape === currentCrosshair;
            btn.style.color = isSelected ? 'white' : '#666';
            btn.style.borderColor = isSelected ? '#00ffff' : '#333';
            btn.style.background = isSelected ? '#00b2e1' : '#181818';
        });

        document.querySelectorAll('.build-card').forEach(card => {
             const cardName = card.querySelector('.build-card-name').innerText;
             const isSelected = cardName === lastBuild.toUpperCase();
             card.style.background = isSelected ? '#00b2e1' : '#151515';
             card.style.borderColor = isSelected ? '#00ffff' : '#333';
             card.querySelector('.build-card-name').style.color = isSelected ? 'white' : '#00b2e1';
        });

        if (crosshairActive) { document.getElementById('cross-settings').style.display = 'block'; document.body.classList.add('hide-cursor'); crosshair.style.display = 'block'; }
        else { document.getElementById('cross-settings').style.display = 'none'; document.body.classList.remove('hide-cursor'); crosshair.style.display = 'none'; }
    };

    let menu, isDragging = false, offset = { x: 0, y: 0 };
    const initMenu = () => {
        if (document.getElementById('diep-toolkit-root')) return;
        menu = document.createElement('div'); menu.id = 'diep-toolkit-root';
        menu.style = `position:fixed; top:20px; left:20px; width:420px; height:88vh; background:rgba(10,10,10,0.98); color:white; border-radius:12px; z-index:999999; display:none; flex-direction:column; border:3px solid #00b2e1; box-sizing:border-box; overflow: hidden;`;

        menu.innerHTML = `
            <div id="drag-header" style="text-align:center; font-weight:900; padding:15px; font-size:20px; color:#00b2e1; cursor:move; user-select:none; letter-spacing:2px; background: rgba(0,0,0,0.3); flex-shrink: 0;">HXDES MOD MENU V1.5 (PRO)</div>
            <div style="display:flex; width:100%; flex-shrink: 0;">
                <button id="tab-main" class="tab-btn active">MENU</button>
                <button id="tab-themes" class="tab-btn">THEMES</button>
                <button id="tab-multibox" class="tab-btn">MULTIBOX</button>
                <button id="tab-info" class="tab-btn">INFO</button>
            </div>
            <div id="menu-content" style="padding: 20px; flex: 1; display: flex; flex-direction: column; overflow: hidden;">
                <div id="pane-main" style="display: flex; flex-direction: column; height: 100%; overflow: hidden;">
                    <div id="build-info-bar" style="background:#181818; padding:8px 15px; border-radius:50px; font-size:10px; margin-bottom:15px; border:1px solid #333; text-align:center; font-weight:900; flex-shrink: 0;"></div>
                    <div style="flex-shrink: 0;">
                        <div class="sec-header">Visual Toggles</div>
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; margin-bottom:15px;">
                            <button id="guide-btn" class="btn-toggle">GUIDES</button><button id="hp-btn" class="btn-toggle">HP VALUES</button>
                            <button id="cross-btn" class="btn-toggle">CROSSHAIR</button><button id="grid-btn" class="btn-toggle">GRID</button>
                        </div>
                        <div id="cross-settings" style="display:none; margin-bottom:15px;">
                            <div class="sec-header">Crosshair Selection</div>
                            <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:6px; margin-bottom:10px;">
                                <div class="cross-opt" data-shape="Tactical">TACTICAL</div><div class="cross-opt" data-shape="Cross">CROSS</div><div class="cross-opt" data-shape="Dot">DOT</div>
                                <div class="cross-opt" data-shape="Chevron">CHEVRON</div><div class="cross-opt" data-shape="T-Post">T-POST</div><div class="cross-opt" data-shape="X-Sight">X-SIGHT</div>
                            </div>
                            <div class="sec-header">Crosshair Color</div>
                            <input type="color" id="cross-color-picker" style="width:100%; height:30px; background:none; border:1px solid #333; cursor:pointer;" value="#00ffff">
                        </div>
                        <div class="sec-header">Tactical Build Library</div>
                        <button id="clear-build-btn" style="width:100%; padding:8px; background:#222; border:1px solid #444; color:#ff4444; border-radius:50px; font-size:10px; font-weight:bold; cursor:pointer; margin-bottom:10px;">CLEAR CURRENT BUILD</button>
                        <input type="text" id="b-search" placeholder="Search archetypes..." style="width:100%; padding:10px; margin-bottom:10px; background:#181818; border:1px solid #333; color:white; border-radius:6px; font-size:13px; outline:none;">
                    </div>
                    <div id="build-list" style="overflow-y: auto; flex-grow: 1; border-top:1px solid #333; padding-top:10px; display: grid; grid-template-columns: 1fr; gap: 8px;"></div>
                </div>

                <div id="pane-themes" style="display: none; flex-direction: column; height: 100%; overflow: hidden;">
                    <div class="sec-header">Theme Library (101)</div>
                    <input type="text" id="t-search" placeholder="Search theme library..." style="width:100%; padding:10px; margin-bottom:15px; background:#181818; border:1px solid #333; color:white; border-radius:6px; font-size:13px; outline:none; flex-shrink: 0;">
                    <div id="theme-list" style="overflow-y: auto; flex-grow: 1; display: flex; flex-direction: column; padding-right: 5px;"></div>
                </div>

                <div id="pane-multibox" style="display: none; flex-direction: column; overflow-y: auto;">
                    <div class="sec-header">HUD Indicators</div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:15px;">
                        <button id="mb-tog-ui-btn" class="btn-toggle">SHOW MULTIBOX UI</button>
                        <button id="afk-tog-ui-btn" class="btn-toggle">SHOW ANTI-AFK UI</button>
                    </div>
                    <div class="sec-header">Multibox Controls</div>
                    <button id="mb-toggle-btn" style="width:100%; padding:15px; margin-bottom:10px; border:none; color:white; border-radius:6px; font-weight:bold; cursor:pointer;">TOGGLE MULTIBOX [F]</button>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:20px;">
                        <button id="mb-master-btn" style="padding:12px; border:none; color:white; cursor:pointer; border-radius:4px; font-weight:bold; background:#222;">SET AS MASTER</button>
                        <button id="mb-minion-btn" style="padding:12px; border:none; color:white; cursor:pointer; border-radius:4px; font-weight:bold; background:#222;">SET AS MINION</button>
                    </div>
                    <div class="sec-header">Anti-AFK System</div>
                    <button id="afk-toggle-btn" style="width:100%; padding:15px; border:none; color:white; border-radius:6px; font-weight:bold; cursor:pointer;">TOGGLE ANTI-AFK [K]</button>
                </div>

                <div id="pane-info" style="display: none; overflow-y: auto; flex-direction: column; height: 100%; padding-right:5px;">
                    <div class="sec-header">Multibox System</div>
                    <div class="info-card"><h4>Master vs Minion</h4><p>MASTER: Sends all input data. MINION: Mirrors Master actions exactly.</p></div>
                    <div class="info-card"><h4>HUD Indicators</h4><p>Toggle top-center status labels in the Multibox tab. Defaults to hidden.</p></div>
                    <div class="sec-header">Visual Enhancements</div>
                    <div class="info-card"><h4>Tactical Guides</h4><p>Displays axis lines for centering shots.</p></div>
                    <div class="info-card"><h4>Numeric HP Values</h4><p>Shows exact health numbers on entities.</p></div>
                    <div class="info-card"><h4>Custom Crosshairs</h4><p>Select from 6 SVG shapes with custom color support.</p></div>
                    <div class="sec-header">Automation & Performance</div>
                    <div class="info-card"><h4>Anti-AFK Heartbeat</h4><p>Prevents idle kick by sending pings. Toggle with [ K ].</p></div>
                    <div class="info-card"><h4>Build Library</h4><p>Automatically spends skill points in tactical order.</p></div>
                    <div class="info-card"><h4>Theme Engine</h4><p>Over 101 custom color presets and dynamic Rainbow mode.</p></div>
                    <div class="sec-header">Hotkeys</div>
                    <div class="info-card"><h4>[ R ] Toggle Menu</h4><p>Toggle main interface.</p></div>
                    <div class="info-card"><h4>[ F ] Toggle Multibox</h4><p>Toggle input broadcasting.</p></div>
                    <div class="info-card"><h4>[ K ] Toggle Anti-AFK</h4><p>Toggle idle-kick prevention.</p></div>
                </div>
            </div>
        `;
        document.body.appendChild(menu);
        const header = menu.querySelector('#drag-header');
        header.onmousedown = (e) => { isDragging = true; offset = { x: menu.offsetLeft - e.clientX, y: menu.offsetTop - e.clientY }; };
        document.onmousemove = (e) => { if (isDragging) { menu.style.left = (e.clientX + offset.x) + 'px'; menu.style.top = (e.clientY + offset.y) + 'px'; } };
        document.onmouseup = () => { isDragging = false; };

        const tabs = { 'tab-main': 'pane-main', 'tab-themes': 'pane-themes', 'tab-multibox': 'pane-multibox', 'tab-info': 'pane-info' };
        Object.keys(tabs).forEach(id => {
            menu.querySelector(`#${id}`).onclick = () => {
                Object.keys(tabs).forEach(tId => { menu.querySelector(`#${tId}`).classList.remove('active'); menu.querySelector(`#${tabs[tId]}`).style.display = 'none'; });
                menu.querySelector(`#${id}`).classList.add('active'); menu.querySelector(`#${tabs[id]}`).style.display = 'flex';
            };
        });

        menu.querySelector('#mb-tog-ui-btn').onclick = () => { showMBIndicator = !showMBIndicator; updateVisuals(); };
        menu.querySelector('#afk-tog-ui-btn').onclick = () => { showAFKIndicator = !showAFKIndicator; updateVisuals(); };
        menu.querySelector('#afk-toggle-btn').onclick = () => { antiAFKEnabled = !antiAFKEnabled; updateVisuals(); };
        menu.querySelector('#mb-toggle-btn').onclick = () => { multiboxEnabled = !multiboxEnabled; updateVisuals(); };
        menu.querySelector('#mb-master-btn').onclick = () => { isMaster = true; updateVisuals(); };
        menu.querySelector('#mb-minion-btn').onclick = () => { isMaster = false; updateVisuals(); };
        menu.querySelector('#guide-btn').onclick = () => { centerGuidesActive = !centerGuidesActive; updateVisuals(); };
        menu.querySelector('#hp-btn').onclick = () => { hpActive = !hpActive; updateVisuals(); };
        menu.querySelector('#cross-btn').onclick = () => { crosshairActive = !crosshairActive; updateVisuals(); };
        menu.querySelector('#grid-btn').onclick = () => { gridActive = !gridActive; updateVisuals(); };
        menu.querySelector('#cross-color-picker').oninput = (e) => { currentColor = e.target.value; updateVisuals(); };
        menu.querySelector('#clear-build-btn').onclick = () => { if(window.input?.execute) window.input.execute("game_stats_build None"); lastBuild = "None Selected"; updateVisuals(); };

        menu.querySelectorAll('.cross-opt').forEach(btn => {
            btn.onclick = () => { currentCrosshair = btn.dataset.shape; updateVisuals(); };
        });

        const tList = menu.querySelector('#theme-list');
        const drawThemes = (f = "") => {
            tList.innerHTML = "";
            Object.keys(themes).filter(t => t.toLowerCase().includes(f.toLowerCase())).forEach(t => {
                const btn = document.createElement('button'); btn.className = 'th-btn'; btn.innerText = t.toUpperCase(); btn.onclick = () => { currentTheme = t; updateVisuals(); };
                tList.appendChild(btn);
            });
            updateVisuals();
        };
        menu.querySelector('#t-search').oninput = (e) => drawThemes(e.target.value);
        drawThemes();

        const bList = menu.querySelector('#build-list');
        const drawBuilds = (f = "") => {
            bList.innerHTML = "";
            allT4Builds.filter(b => b.name.toLowerCase().includes(f.toLowerCase()) || b.cat.toLowerCase().includes(f.toLowerCase())).forEach(b => {
                const card = document.createElement('div'); card.className = 'build-card'; card.innerHTML = `<div class="build-card-name">${b.name.toUpperCase()}</div><div class="build-card-desc" style="font-size:9px;">${b.desc}</div>`;
                card.onclick = () => { if(window.input?.execute) { window.input.execute("game_stats_build " + generateSmartCode(b.stats, b.type)); lastBuild = b.name; updateVisuals(); } };
                bList.appendChild(card);
            });
        };
        menu.querySelector('#b-search').oninput = (e) => drawBuilds(e.target.value);
        drawBuilds(); updateVisuals();
        setTimeout(() => { const overlay = document.createElement('div'); overlay.className = 'hxdes-intro-overlay'; overlay.innerHTML = `<div class="hxdes-text hxdes-welcome">Welcome to Hxdes's Mod Menu (PRO)</div><div class="hxdes-text hxdes-subtext">Press [ R ] to Toggle Menu</div>`; document.body.appendChild(overlay); setTimeout(() => overlay.remove(), 5500); }, 100);
    };

    const visualLayer = document.createElement('div'); visualLayer.style = `position:fixed; top:0; left:0; width:100vw; height:100vh; pointer-events:none; z-index:2147483646;`; document.body.appendChild(visualLayer);
    const crosshair = document.createElement('div'); crosshair.id = "hx-cross"; document.body.appendChild(crosshair);
    const fpsDisplay = document.createElement('div'); fpsDisplay.style = `position:fixed; top:10px; right:15px; color:#00b2e1; font-weight:bold; font-size:16px; pointer-events:none; z-index:2147483647;`; document.body.appendChild(fpsDisplay);

    function loop() {
        const now = performance.now(); fps = Math.round(1000 / (now - lastLoop)); fpsDisplay.innerText = `FPS: ${fps}`; lastLoop = now;
        if (themes[currentTheme].dynamic && window.input?.execute) {
            hue = (hue + 1) % 360;
            const hslToHex = (h) => {
                const l = 0.5; const s = 0.8; const a = s * Math.min(l, 1 - l);
                const f = n => { const k = (n + h / 30) % 12; const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1); return Math.round(255 * color).toString(16).padStart(2, '0'); };
                return "0x" + f(0) + f(8) + f(4);
            };
            const rainbowColor = hslToHex(hue);
            window.input.execute(`ren_background_color ${rainbowColor}`);
            window.input.execute(`ren_grid_color ${rainbowColor}`);
        }
        if (crosshairActive) crosshair.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        requestAnimationFrame(loop);
    }

    window.addEventListener('keydown', (e) => {
        if (document.activeElement.tagName === 'INPUT') return;
        const key = e.key.toLowerCase();
        if (key === 'r') { if(!menu) initMenu(); menu.style.display = menu.style.display === 'none' ? 'flex' : 'none'; }
        if (key === 'f') { multiboxEnabled = !multiboxEnabled; updateVisuals(); }
        if (key === 'k') { antiAFKEnabled = !antiAFKEnabled; updateVisuals(); }
        if (multiboxEnabled && isMaster) mbChannel.postMessage({ type: 'kd', key: e.key, code: e.code, keyCode: e.keyCode, which: e.which });
    }, true);

    window.addEventListener('keyup', (e) => { if (multiboxEnabled && isMaster) mbChannel.postMessage({ type: 'ku', key: e.key, code: e.code, keyCode: e.keyCode, which: e.which }); }, true);
    window.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; if (multiboxEnabled && isMaster) mbChannel.postMessage({ type: 'mm', x: mouseX, y: mouseY }); }, true);

    loop(); setTimeout(initMenu, 1000);
})();