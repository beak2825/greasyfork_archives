// ==UserScript==
// @name         Omniverse 
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  A userscript that changes the Deadshot client
// @author       xliam.space 
// @run-at       document-end
// @match        https://deadshot.io/*
// @grant        none
// @icon         https://deadshot.io/favicon.png
// @downloadURL https://update.greasyfork.org/scripts/551924/Omniverse.user.js
// @updateURL https://update.greasyfork.org/scripts/551924/Omniverse.meta.js
// ==/UserScript==

//  __   _  _  __ _  __  _  _  ____  ____  ____  ____
// /  \ ( \/ )(  ( \(  )/ )( \(  __)(  _ \/ ___)(  __)
//(  O )/ \/ \/    / )( \ \/ / ) _)  )   /\___ \ ) _)
// \__/ \_)(_/\_)__)(__) \__/ (____)(__\_)(____/(____)
// ONLY DOWNLOAD THIS FROM xliam.space OR https://greasyfork.org/en/scripts/551924-omniverse
// DO NOT DISTRIBUTE WITHOUT CREDIT

// CREDITS:
// By xLiam1 | xliam.space
// Crosshair Editor: https://greasyfork.org/en/scripts/551511-deadshot-io-stylish-crosshair-overlay-persistent-settings
// Leaderboard Inspiration: https://greasyfork.org/en/scripts/518544-vortex-forge-deadshot-io

(() => {
    'use strict';

    /* -------------------------
       Utility: Storage & Pos
       ------------------------- */
    const storage = {
        set(key, value) {
            try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
        },
        get(key, defaultVal = null) {
            try {
                const raw = localStorage.getItem(key);
                return raw ? JSON.parse(raw) : defaultVal;
            } catch { return defaultVal; }
        },
        setRaw(key, value) {
            try { localStorage.setItem(key, value); } catch {}
        },
        getRaw(key, defaultVal = null) {
            try {
                const raw = localStorage.getItem(key);
                return raw === null ? defaultVal : raw;
            } catch { return defaultVal; }
        },
        remove(key) {
            try { localStorage.removeItem(key); } catch {}
        }
    };

    function savePosition(key, x, y) {
        storage.set(`${key}_pos`, { x, y });
    }
    function loadPosition(key) {
        return storage.get(`${key}_pos`, null);
    }

    /* -------------------------
       Utility: DOM helpers
       ------------------------- */
    function injectStyle(css) {
        const s = document.createElement('style');
        s.textContent = css;
        document.head.appendChild(s);
        return s;
    }

    function el(tag, opts = {}) {
        const e = document.createElement(tag);
        if (opts.id) e.id = opts.id;
        if (opts.cls) e.className = opts.cls;
        if (opts.html !== undefined) e.innerHTML = opts.html;
        if (opts.text !== undefined) e.textContent = opts.text;
        if (opts.attrs) {
            for (const [k, v] of Object.entries(opts.attrs)) e.setAttribute(k, v);
        }
        if (opts.style) {
            Object.assign(e.style, opts.style);
        }
        return e;
    }

    /* -------------------------
       Utility: Draggable (single shared implementation)
       ------------------------- */
    function makeDraggable(targetEl, opts = {}) {
        // opts: storageKey (string) - key to save pos, handle (Element) - optional handle element to start drag,
        // onSave: callback(pos) optional
        let dragging = false;
        let offsetX = 0;
        let offsetY = 0;
        const handle = opts.handle || targetEl;
        const storageKey = opts.storageKey || targetEl.id || null;
        const onSave = opts.onSave || (() => {});

        function start(e) {
            // only left mouse button or touch
            if ((e.type === 'mousedown' && e.button !== 0) && e.type !== 'touchstart') return;
            dragging = true;
            const rect = targetEl.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            offsetX = clientX - rect.left;
            offsetY = clientY - rect.top;
            e.preventDefault();
        }

        function move(e) {
            if (!dragging) return;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            targetEl.style.left = (clientX - offsetX) + 'px';
            targetEl.style.top  = (clientY - offsetY) + 'px';
            targetEl.style.right = 'auto';
        }

        function end() {
            if (!dragging) return;
            dragging = false;
            if (storageKey) {
                savePosition(storageKey, targetEl.offsetLeft, targetEl.offsetTop);
                onSave({ x: targetEl.offsetLeft, y: targetEl.offsetTop });
            }
        }

        handle.addEventListener('mousedown', start);
        handle.addEventListener('touchstart', start, { passive: false });
        window.addEventListener('mousemove', move);
        window.addEventListener('touchmove', move, { passive: false });
        window.addEventListener('mouseup', end);
        window.addEventListener('touchend', end);

        // restore pos if any
        if (storageKey) {
            const pos = loadPosition(storageKey);
            if (pos && typeof pos.x === 'number' && typeof pos.y === 'number') {
                try {
                    targetEl.style.left = pos.x + 'px';
                    targetEl.style.top  = pos.y + 'px';
                    targetEl.style.right = 'auto';
                } catch {}
            }
        }

        return {
            destroy() {
                handle.removeEventListener('mousedown', start);
                handle.removeEventListener('touchstart', start);
                window.removeEventListener('mousemove', move);
                window.removeEventListener('touchmove', move);
                window.removeEventListener('mouseup', end);
                window.removeEventListener('touchend', end);
            }
        };
    }

    /* -------------------------
       Component: Stats Overlay
       ------------------------- */
    const statsCSS = `
    #dsOverlayStats {
        position: fixed;
        top: 80px;
        left: 20px;
        gap: 10px;
        background: rgba(0, 0, 0, 0.4);
        padding: 12px;
        border-radius: 10px;
        color: white;
        border: 3px solid #FF4C4C;
        z-index: 99999;
        cursor: move;
        white-space: nowrap;
    }`;
    injectStyle(statsCSS);

    const overlayStats = el('div', { id: 'dsOverlayStats', text: 'Loading stats...' });
    document.body.appendChild(overlayStats);

    // FPS calc
    let fps = 0;
    (function fpsLoop() {
        let last = performance.now();
        function tick() {
            const now = performance.now();
            fps = Math.round(1000 / (now - last));
            last = now;
            requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    })();

    // Ping
    let ping = 0;
    async function updatePing() {
        const start = performance.now();
        try {
            await fetch("https://deadshot.io/favicon.ico", { method: "HEAD", cache: "no-store" });
            ping = Math.round(performance.now() - start);
        } catch {
            ping = -1;
        }
    }

    function getRAM() {
        return navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'N/A';
    }
    function getCPU() {
        return navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} cores` : 'N/A';
    }
    function getOS() {
        return navigator.platform ? `${navigator.platform}` : 'N/A';
    }

    // update loop (1s)
    setInterval(() => {
        overlayStats.innerHTML = `
            OS: ${getOS()}<br>
            CPU: ${getCPU()}<br>
            RAM: ${getRAM()}<br>
            FPS: ${fps}<br>
            Ping: ${ping === -1 ? 'offline' : ping + ' ms'}
        `;
        updatePing();
    }, 1000);

    // make draggable and persist
    makeDraggable(overlayStats, { storageKey: 'dsOverlayStats' });

    /* -------------------------
       Component: Keys Overlay
       ------------------------- */
    const keys = [
        'c', 'w', 'r', ' ', 'shift',
        'a', 's', 'd', 'mouseleft', 'mouseright'
    ];
    const keyLabels = {
        'w': 'W', 'a': 'A', 's': 'S', 'd': 'D', 'r': 'R', ' ': '␣',
        'shift': '🠭', 'c': 'C', 'mouseleft': 'LMB', 'mouseright': 'RMB'
    };
    const keyColors = {
        'w': '#FF4C4C','a': '#FF4C4C','s': '#FF4C4C','d': '#FF4C4C',
        'r': '#c52424',' ': '#c52424','shift': '#c52424','c': '#c52424',
        'mouseleft': '#c52424','mouseright': '#c52424'
    };

    const styleKeys = `
    #keyDisplayOverlay {
        position: fixed;
        top: 150px;
        left: 20px;
        display: grid;
        grid-template-columns: repeat(5, 50px);
        gap: 10px;
        background: rgba(0, 0, 0, 0.4);
        padding: 12px;
        border-radius: 10px;
        border: 3px solid #FF4C4C;
        z-index: 99999;
        cursor: move;
    }
    .keyDisplay {
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid;
        border-radius: 6px;
        font-size: 16px;
        font-weight: bold;
        color: white;
        background-color: transparent;
        transition: background-color 0.15s, transform 0.15s, box-shadow 0.15s;
        user-select: none;
    }
    .keyDisplay.pressed {
        transform: scale(1.1);
        box-shadow: 0 0 12px white;
    }`;
    injectStyle(styleKeys);

    const keyContainer = el('div', { id: 'keyDisplayOverlay' });
    document.body.appendChild(keyContainer);

    const keyElements = {};
    keys.forEach(k => {
        const lower = k.toLowerCase();
        const d = el('div', { cls: 'keyDisplay', text: keyLabels[lower] || lower.toUpperCase() });
        d.style.borderColor = keyColors[lower] || '#fff';
        keyContainer.appendChild(d);
        keyElements[lower] = { el: d, color: keyColors[lower] || '#c52424' };
    });

    function handleKey(action, key) {
        const entry = keyElements[key];
        if (!entry) return;
        const { el: e, color } = entry;
        if (action === 'down') {
            e.classList.add('pressed');
            e.style.backgroundColor = color;
        } else {
            e.classList.remove('pressed');
            e.style.backgroundColor = 'transparent';
        }
    }

    window.addEventListener('keydown', (ev) => {
        const k = ev.key.toLowerCase();
        if (k === ' ') handleKey('down', ' ');
        else if (k === 'shift') handleKey('down', 'shift');
        else handleKey('down', k);
    });
    window.addEventListener('keyup', (ev) => {
        const k = ev.key.toLowerCase();
        if (k === ' ') handleKey('up', ' ');
        else if (k === 'shift') handleKey('up', 'shift');
        else handleKey('up', k);
    });

    // mouse buttons
    window.addEventListener('mousedown', (e) => {
        if (e.button === 0) handleKey('down', 'mouseleft');
        if (e.button === 2) handleKey('down', 'mouseright');
    });
    window.addEventListener('mouseup', (e) => {
        if (e.button === 0) handleKey('up', 'mouseleft');
        if (e.button === 2) handleKey('up', 'mouseright');
    });

    makeDraggable(keyContainer, { storageKey: 'keyDisplayOverlay' });

    /* -------------------------
       Component: Crosshair Editor
       ------------------------- */
    const STORAGE_KEY = 'crosshairSettings_v1';
    const crosshairCSS = `
    #customCrosshair {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 9999;
    }
    #toggleButton {
        position: fixed;
        top: 15px;
        left: 15px;
        background: linear-gradient(135deg, #ff416c, #ff4b2b);
        color: #fff;
        padding: 8px 14px;
        font-size: 14px;
        font-weight: bold;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        z-index: 9999;
        box-shadow: 0 0 8px rgba(255,75,43,0.6);
        transition: all 0.3s ease;
    }
    #toggleButton:hover { transform: scale(1.05); box-shadow: 0 0 12px rgba(255,75,43,0.9); }
    #crosshairSettings {
        position: fixed;
        top: 60px;
        right: 20px;
        width: 240px;
        background: rgba(20,20,20,0.6);
        backdrop-filter: blur(10px);
        color: #fff;
        font-family: 'Segoe UI', sans-serif;
        border-radius: 12px;
        box-shadow: 0 0 12px rgba(0,0,0,0.4);
        padding: 12px;
        display: none;
        transition: all 0.3s ease;
        z-index: 9999;
    }
    #crosshairSettings label { display: block; margin-top: 8px; font-size: 13px; }
    #crosshairSettings input, #crosshairSettings select { width: 100%; margin: 4px 0 10px; padding: 6px; font-size: 13px; color: #fff; background: rgba(255,255,255,0.1); border: none; border-radius: 6px; }
    #crosshairSettings select, #crosshairSettings option { color: #fff; background: rgba(30,30,30,0.9); font-weight: bold; }`;
    injectStyle(crosshairCSS);

    // Crosshair generators (kept same as original)
    const crosshairTypes = {
        "None": (s,c)=>``,
        "Dot": (s,c)=>`<div style="width:${s}px;height:${s}px;background:${c};border-radius:50%;"></div>`,
        "Cross": (s,c,t)=>`
            <div style="position:relative;width:${s}px;height:${s}px;">
                <div style="position:absolute;top:50%;left:0;width:100%;height:${t}px;background:${c};transform:translateY(-50%)"></div>
                <div style="position:absolute;left:50%;top:0;height:100%;width:${t}px;background:${c};transform:translateX(-50%)"></div>
            </div>`,
        "T-Shaped": (s,c,t)=>`
            <div style="position:relative;width:${s}px;height:${s}px;">
                <div style="position:absolute;top:50%;left:0;width:100%;height:${t}px;background:${c};transform:translateY(-50%)"></div>
                <div style="position:absolute;left:50%;top:50%;width:${t}px;height:50%;background:${c};transform:translate(-50%, -50%)"></div>
            </div>`,
        "Circle": (s,c,t)=>`<div style="width:${s}px;height:${s}px;border:${t}px solid ${c};border-radius:50%;"></div>`,
        "Chevron": (s,c)=>`<div style="width:0;height:0;border-left:${s/2}px solid transparent;border-right:${s/2}px solid transparent;border-bottom:${s}px solid ${c};"></div>`,
        "Box": (s,c,t)=>`<div style="width:${s}px;height:${s}px;border:${t}px solid ${c};"></div>`,
        "X-Shaped": (s,c,t)=>`
            <div style="position:relative;width:${s}px;height:${s}px;">
                <div style="position:absolute;width:${t}px;height:100%;background:${c};transform:rotate(45deg);left:50%;top:0;transform-origin:center;"></div>
                <div style="position:absolute;width:${t}px;height:100%;background:${c};transform:rotate(-45deg);left:50%;top:0;transform-origin:center;"></div>
            </div>`,
        "Four Corners": (s,c,t)=>`
            <div style="position:relative;width:${s}px;height:${s}px;">
                ${["top:0;left:0","top:0;right:0","bottom:0;left:0","bottom:0;right:0"].map(pos=>`
                    <div style="position:absolute;${pos};width:${s/4}px;height:${t}px;background:${c};"></div>
                    <div style="position:absolute;${pos};width:${t}px;height:${s/4}px;background:${c};"></div>`).join('')}
            </div>`,
        "Split Cross": (s,c,t)=>`
            <div style="position:relative;width:${s}px;height:${s}px;">
                <div style="position:absolute;top:0;left:50%;width:${t}px;height:${s/2-5}px;background:${c};transform:translateX(-50%)"></div>
                <div style="position:absolute;bottom:0;left:50%;width:${t}px;height:${s/2-5}px;background:${c};transform:translateX(-50%)"></div>
                <div style="position:absolute;left:0;top:50%;width:${s/2-5}px;height:${t}px;background:${c};transform:translateY(-50%)"></div>
                <div style="position:absolute;right:0;top:50%;width:${s/2-5}px;height:${t}px;background:${c};transform:translateY(-50%)"></div>
            </div>`,
        "Star": (s,c,t)=>`
            <div style="position:relative;width:${s}px;height:${s}px;">
                <div style="position:absolute;left:50%;top:0;width:${t}px;height:100%;background:${c};transform:translateX(-50%)"></div>
                <div style="position:absolute;top:50%;left:0;width:100%;height:${t}px;background:${c};transform:translateY(-50%)"></div>
                <div style="position:absolute;width:${t}px;height:100%;background:${c};transform:rotate(45deg);left:50%;top:0;transform-origin:center;"></div>
                <div style="position:absolute;width:${t}px;height:100%;background:${c};transform:rotate(-45deg);left:50%;top:0;transform-origin:center;"></div>
            </div>`,
        "Diamond": (s,c)=>`<div style="width:${s}px;height:${s}px;background:${c};transform:rotate(45deg);"></div>`,
        "Triangle": (s,c)=>`<div style="width:0;height:0;border-left:${s/2}px solid transparent;border-right:${s/2}px solid transparent;border-bottom:${s}px solid ${c};"></div>`,
        "Horizontal Line": (s,c,t)=>`<div style="width:${s}px;height:${t}px;background:${c};"></div>`,
        "Vertical Line": (s,c,t)=>`<div style="width:${t}px;height:${s}px;background:${c};"></div>`,
        "Circle with Dot": (s,c,t)=>`
            <div style="position:relative;width:${s}px;height:${s}px;border:${t}px solid ${c};border-radius:50%;">
                <div style="position:absolute;top:50%;left:50%;width:${s/5}px;height:${s/5}px;background:${c};border-radius:50%;transform:translate(-50%,-50%);"></div>
            </div>`,
        "Ringed Cross": (s,c,t)=>`
            <div style="position:relative;width:${s}px;height:${s}px;">
                <div style="position:absolute;inset:0;border:${t}px solid ${c};border-radius:50%;box-sizing:border-box;"></div>
                <div style="position:absolute;top:50%;left:${t * 1.5}px;width:calc(100% - ${t * 3}px);height:${t}px;background:${c};transform:translateY(-50%);"></div>
                <div style="position:absolute;left:50%;top:${t * 1.5}px;height:calc(100% - ${t * 3}px);width:${t}px;background:${c};transform:translateX(-50%);"></div>
            </div>`
    };

    function createCrosshair(type, size, color, thickness, opacity) {
        const container = el('div', { id: 'customCrosshair' });
        container.style.opacity = opacity;
        const generator = crosshairTypes[type] || (() => '');
        container.innerHTML = generator(size, color, thickness);
        return container;
    }

    function saveCrosshairSettings() {
        const data = {
            type: document.getElementById('chType').value,
            size: document.getElementById('chSize').value,
            color: document.getElementById('chColor').value,
            thickness: document.getElementById('chThickness').value,
            opacity: document.getElementById('chOpacity').value
        };
        storage.set(STORAGE_KEY, data);
    }
    function loadCrosshairSettings() {
        return storage.get(STORAGE_KEY, null);
    }

    function createSettingsPanel() {
        const panel = el('div', { id: 'crosshairSettings' });
        panel.innerHTML = `
            <label>Type:</label>
            <select id="chType">
                ${Object.keys(crosshairTypes).map(t => `<option value="${t}">${t}</option>`).join('')}
            </select>
            <label>Size (px):</label>
            <input id="chSize" type="number" value="30" min="5" max="200">
            <label>Color:</label>
            <input id="chColor" type="color" value="#ff0000">
            <label>Thickness (px):</label>
            <input id="chThickness" type="number" value="2" min="1" max="10">
            <label>Opacity (0–1):</label>
            <input id="chOpacity" type="number" value="1" step="0.1" min="0.1" max="1">
        `;
        // live update + save
        panel.addEventListener('input', () => {
            updateCrosshair();
            saveCrosshairSettings();
        });
        return panel;
    }

    function updateCrosshair() {
        const type      = document.getElementById('chType').value;
        const size      = parseInt(document.getElementById('chSize').value, 10);
        const color     = document.getElementById('chColor').value;
        const thickness = parseInt(document.getElementById('chThickness').value, 10);
        const opacity   = parseFloat(document.getElementById('chOpacity').value);
        const old = document.getElementById('customCrosshair');
        if (old) old.remove();
        document.body.appendChild(createCrosshair(type, size, color, thickness, opacity));
    }

    // Initialize crosshair UI
    const chPanel = createSettingsPanel();
    document.body.appendChild(chPanel);
    // Load saved settings
    (function initCrosshairFromSaved() {
        const saved = loadCrosshairSettings();
        if (saved) {
            try {
                document.getElementById('chType').value = saved.type;
                document.getElementById('chSize').value = saved.size;
                document.getElementById('chColor').value = saved.color;
                document.getElementById('chThickness').value = saved.thickness;
                document.getElementById('chOpacity').value = saved.opacity;
            } catch {}
        }
        updateCrosshair();
    })();

    /* -------------------------
       Component: GUI (Overlay toggles + controls)
       ------------------------- */
    const overlayDefs = [
        { id: 'dsOverlayStats', name: 'Overlay Stats', settingsId: null },
        { id: 'keyDisplayOverlay', name: 'Key Display', settingsId: null },
        { id: 'crosshairSettings', name: 'Crosshair Editor', settingsId: 'crosshairSettings' }
    ];

    const gui = el('div', { id: 'dsGuiContainer' });
    Object.assign(gui.style, {
        position: 'fixed',
        top: '10px',
        right: '10px',
        padding: '10px',
        background: 'rgba(30,30,30,0.8)',
        color: '#fff',
        borderRadius: '8px',
        zIndex: '100000',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        minWidth: '180px',
        cursor: 'move'
    });
    document.body.appendChild(gui);

    const title = el('div', { text: 'Omniverse | Toggle: P' });
    title.style.fontWeight = 'bold';
    title.style.textAlign = 'center';
    gui.appendChild(title);

    // overlay buttons container & state
    const overlayButtons = {};
    const state = {};
    overlayDefs.forEach(def => {
        const saved = storage.getRaw(def.id);
        state[def.id] = saved === null ? true : (saved === 'true' || saved === true);
    });

    for (const def of overlayDefs) {
        const btn = el('button', { text: `${def.name}: ${state[def.id] ? 'ON' : 'OFF'}` });
        Object.assign(btn.style, { padding: '6px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' });
        gui.appendChild(btn);
        overlayButtons[def.id] = btn;
    }

    // Fetch rank button
    const fetchRankBtn = el('button', { text: 'Fetch My Rank' });
    Object.assign(fetchRankBtn.style, { padding: '6px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', background: '#2196f3', color: '#fff' });
    gui.appendChild(fetchRankBtn);
    fetchRankBtn.addEventListener('click', async () => {
        const username = prompt("Enter your username:");
        if (!username) return;
        const rank = await fetchLeaderboardRank(username);
        alert(`${rank}`);
    });

    // Reset button
    const resetBtn = el('button', { text: 'Reset Omniverse' });
    Object.assign(resetBtn.style, { padding: '6px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', background: '#f44336', color: '#fff' });
    gui.appendChild(resetBtn);
    resetBtn.addEventListener('click', () => {
        const idsToReset = ['dsOverlayStats', 'keyDisplayOverlay', 'dsGuiContainer'];
        idsToReset.forEach(id => {
            storage.remove(id + '_pos');
            storage.remove(id);
        });
        location.reload();
    });

    // Update button (open GreasyFork)
    const updateBtn = el('button', { text: 'CLICK ME PLS' });
    Object.assign(updateBtn.style, { padding: '6px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', background: '#ff9800', color: '#fff' });
    gui.appendChild(updateBtn);
    updateBtn.addEventListener('click', () => {
        window.open('https://xliam.space/omniverse', '_blank');
    });

    // Helper to update visibility and button text/style
    function updateVisibility(id, settingsId) {
        const elTarget = document.getElementById(id);
        if (elTarget) elTarget.style.display = state[id] ? '' : 'none';
        if (settingsId) {
            const settingsEl = document.getElementById(settingsId);
            if (settingsEl) settingsEl.style.display = state[id] ? 'block' : 'none';
        }
        const btn = overlayButtons[id];
        const def = overlayDefs.find(o => o.id === id);
        if (btn && def) {
            btn.textContent = `${def.name}: ${state[id] ? 'ON' : 'OFF'}`;
            btn.style.background = state[id] ? '#4caf50' : '#f44336';
            storage.setRaw(id, state[id] ? 'true' : 'false');
        }
    }

    // initialize visibility and add click handlers
    overlayDefs.forEach(def => {
        updateVisibility(def.id, def.settingsId);
        const btn = overlayButtons[def.id];
        if (!btn) return;
        btn.addEventListener('click', () => {
            state[def.id] = !state[def.id];
            updateVisibility(def.id, def.settingsId);
        });
    });

    // Toggle GUI with P
    window.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'p') {
            gui.style.display = gui.style.display === 'none' ? 'flex' : 'none';
        }
    });

    // Make GUI draggable and persist
    makeDraggable(gui, { storageKey: 'dsGuiContainer' });

    ['dsOverlayStats', 'keyDisplayOverlay', 'dsGuiContainer'].forEach(id => {
        const elNode = document.getElementById(id);
        if (!elNode) return;
        const pos = loadPosition(id);
        if (pos && typeof pos.x === 'number' && typeof pos.y === 'number') {
            elNode.style.left = pos.x + 'px';
            elNode.style.top  = pos.y + 'px';
            elNode.style.right = 'auto';
        }
    });

    async function fetchLeaderboardRank(username) {
        try {
            const response = await fetch('https://login.deadshot.io/leaderboards');
            const data = await response.json();
            const categories = ["daily", "weekly", "alltime"];
            const result = {};

            for (const category of categories) {
                if (data[category] && data[category].kills) {
                    const leaderboard = data[category].kills;
                    leaderboard.sort((a, b) => b.kills - a.kills);
                    const player = leaderboard.find(p => p.name === username);
                    result[category] = player ? `#${leaderboard.indexOf(player) + 1}` : "Not found";
                } else {
                    result[category] = "Not found";
                }
            }

            // Convert to a string
            return `Daily: ${result.daily}\nWeekly: ${result.weekly}\nAll-time: ${result.alltime}`;
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            return "Daily: Error\nWeekly: Error\nAll-time: Error";
        }
    }


    
    const footer = el('div', { text: 'xliam.space' });
    footer.style.textAlign = 'center';
    gui.appendChild(footer);
})();
// EOF