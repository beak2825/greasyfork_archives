// ==UserScript==
// @name         Torn CT Mapper v23.17 (Container Fix)
// @namespace    http://tampermonkey.net/
// @version      23.17
// @description  Replaces per-tile borders with a crisp, global grid overlay. Includes mobile-safe rendering and container-bound buttons.
// @author       Gemini
// @match        https://www.torn.com/christmas_town.php*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559751/Torn%20CT%20Mapper%20v2317%20%28Container%20Fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559751/Torn%20CT%20Mapper%20v2317%20%28Container%20Fix%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION ---
    const CONFIG = {
        TILE_SIZE: 30,
        STORAGE_KEY: 'CT_Map_Data_v23',
        LEGACY_KEY: 'CT_Map_Data_v22',
        MIN_ZOOM: 0.1,
        MAX_ZOOM: 5.0,
        OVERLAY_SELECTOR: '.status-area-container',
        FALLBACK_SELECTOR: '.user-map-container',
        COLORS: {
            VOID: '#121212',
            GRID: 'rgba(0, 0, 0, 0.25)',
            PLAYER: '#ff4757',
            HIGHLIGHT: 'rgba(0, 255, 255, 0.4)',
            PANEL: 'rgba(18, 18, 18, 0.95)'
        }
    };

    // --- STATE ---
    const state = {
        archives: {},
        currentMapId: null,
        viewingMapId: null,
        camera: { x: 0, y: 0, zoom: 1 },
        isDragging: false,
        lastMouse: { x: 0, y: 0 },
        hoverGrid: { x: null, y: null },
        playerPos: { x: 0, y: 0 },
        layers: { ground: true, objects: true, items: true, walls: true },
        settings: { showGrid: true, followPlayer: true, bgColor: '#f2f2f2' },
        ui: { minimized: false, overlayEnabled: false }
    };

    // --- MOBILE SAFE UTILS ---
    const SafeStorage = {
        get: (key) => {
            try {
                if (typeof GM_getValue === 'function') return GM_getValue(key);
            } catch(e) {}
            return localStorage.getItem(key);
        },
        set: (key, val) => {
            try {
                if (typeof GM_setValue === 'function') {
                    GM_setValue(key, val);
                    return;
                }
            } catch(e) {}
            localStorage.setItem(key, val);
        }
    };

    const injectStyles = () => {
        const css = `
            #ct-launcher-wrap {
                position: absolute; /* Default to absolute for container placement */
                top: 5px;
                right: 5px;
                z-index: 2147483647;
                display: flex;
                flex-direction: row; /* Horizontal by default looks better in header */
                gap: 5px;
            }
            /* Media query for mobile fallback */
            @media (max-width: 600px) {
                #ct-launcher-wrap.ct-fallback-mode {
                     position: fixed;
                     top: 15%;
                     right: 5px;
                     flex-direction: column;
                }
            }
            .ct-launch-btn {
                background: #222;
                color: #fff;
                border: 1px solid #555;
                border-radius: 4px;
                cursor: pointer;
                font-size: 20px;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                user-select: none;
                box-shadow: 0 2px 5px rgba(0,0,0,0.5);
            }
            .ct-launch-btn:active { background: #444; transform: scale(0.95); }

            #ct-panel { position:fixed; inset:0; z-index:2147483647; background:rgba(0,0,0,0.95); display:flex; color:#ccc; font-family:sans-serif; }
            #ct-sidebar { width:200px; background:#181818; border-right:1px solid #333; display:flex; flex-direction:column; padding:10px; overflow-y:auto; }
            .ct-header { font-weight:bold; border-bottom:2px solid #ff4757; margin-bottom:10px; display:flex; justify-content:space-between; cursor:default; font-size: 14px; }
            #ct-min { cursor:pointer; padding:0 5px; font-size: 18px; }
            .ct-row { margin: 8px 0; font-size:13px; }
            .ct-sep { border-bottom:1px solid #333; margin:8px 0; }

            #ct-panel button { background:#333; color:#eee; border:1px solid #555; width:100%; padding:8px; margin-top:5px; cursor:pointer; border-radius:3px; font-size: 14px; }
            #ct-panel button:hover { background:#444; }

            #ct-view { flex:1; position:relative; overflow:hidden; cursor:crosshair; }
            #ct-close { position:absolute; top:10px; right:10px; color:#fff; cursor:pointer; font-weight:bold; font-size:30px; z-index:10; background: rgba(0,0,0,0.5); border-radius: 50%; width: 40px; height: 40px; display:flex; align-items:center; justify-content:center; }
        `;
        const style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        (document.head || document.documentElement).appendChild(style);
    };

    // --- UTILS ---
    const getGridKey = (x, y) => `${x}_${y}`;
    const worldToGrid = (px, py) => ({
        x: Math.round(px / CONFIG.TILE_SIZE),
        y: -Math.round(py / CONFIG.TILE_SIZE)
    });

    const categorizeLayer = (src) => {
        const s = src.toLowerCase();
        if (s.includes('item') || s.includes('loot') || s.includes('gift') || s.includes('key')) return 'items';
        if (s.includes('wall') || s.includes('hedge') || s.includes('cliff') || s.includes('fence')) return 'walls';
        if (s.includes('ground') || s.includes('floor') || s.includes('road') || s.includes('path') || s.includes('river') || s.includes('area')) return 'ground';
        return 'objects';
    };

    const isFlatTile = (src) => {
        const s = src.toLowerCase();
        if (s.includes('wall') || s.includes('hedge') || s.includes('fence') || s.includes('tree') || s.includes('building') || s.includes('lamp') || s.includes('post')) return false;
        return true;
    };

    function getCurrentMapName() {
        const titleEl = document.querySelector('.title-wrap .status-title');
        if (titleEl && titleEl.childNodes.length > 0) {
            const name = titleEl.childNodes[0].textContent.trim();
            return name || null;
        }
        return null;
    }

    // --- STORAGE ---
    function loadData() {
        let raw = SafeStorage.get(CONFIG.STORAGE_KEY);
        if (raw) {
            try {
                const data = JSON.parse(raw);
                state.archives = data.archives || {};
                state.camera = data.camera || { x: 0, y: 0, zoom: 1 };
                state.layers = { ...state.layers, ...(data.layers || {}) };
                if(data.settings) state.settings = { ...state.settings, ...data.settings };
                if (data.ui) state.ui.overlayEnabled = data.ui.overlayEnabled || false;
            } catch (e) {
                console.error("Load Error", e);
            }
        }
    }

    function saveData(isManual = false) {
        try {
            const payload = JSON.stringify({
                archives: state.archives,
                camera: state.camera,
                layers: state.layers,
                settings: state.settings,
                ui: state.ui
            });
            SafeStorage.set(CONFIG.STORAGE_KEY, payload);
            if (isManual) {
                alert(`✅ FORCE SAVE SUCCESSFUL!\nSize: ${(payload.length/1024).toFixed(1)} KB`);
                updateUIStats();
            }
        } catch (e) {
            console.error("Save Failed", e);
            if (isManual) alert("Save Failed. Check console.");
        }
    }

    function switchMapContext(newMapId) {
        if (!newMapId) return;
        if (!state.archives[newMapId]) state.archives[newMapId] = { mapData: {} };
        state.currentMapId = newMapId;
        const selector = document.getElementById('sel-map');
        if (!selector || selector.value === 'Live Auto') {
            state.viewingMapId = newMapId;
            state.settings.followPlayer = true;
            updateUIHeader();
        }
        updateMapSelector();
    }

    // --- SCRAPER ---
    function scanWorld() {
        const worldDiv = document.querySelector('#world');
        if (!worldDiv) return;

        const mapName = getCurrentMapName();
        if (!mapName) return;

        if (mapName !== state.currentMapId) switchMapContext(mapName);

        if (!state.archives[state.currentMapId]) return;
        const currentMapData = state.archives[state.currentMapId].mapData;

        const nodes = worldDiv.querySelectorAll('.objects-layer .ct-object, .items-layer .ct-object');
        let hasChanges = false;
        nodes.forEach((node, i) => {
            const left = parseInt(node.style.left, 10);
            const top = parseInt(node.style.top, 10);
            if (isNaN(left) || isNaN(top)) return;

            let src = '';
            const img = node.querySelector('img');
            if (img) src = img.getAttribute('src');
            else {
                const bg = window.getComputedStyle(node).backgroundImage;
                if (bg && bg !== 'none') src = bg.replace(/url\(['"]?(.*?)['"]?\)/, '$1');
            }
            if (!src) return;

            const w = parseInt(node.style.width, 10) || 30;
            const h = parseInt(node.style.height, 10) || 30;
            const grid = worldToGrid(left, top);
            const key = getGridKey(grid.x, grid.y);

            const tile = {
                x: grid.x, y: grid.y,
                px: left, py: top, w, h, src,
                layer: categorizeLayer(src),
                z: i
            };
            if (!currentMapData[key]) currentMapData[key] = [];

            const existingIdx = currentMapData[key].findIndex(t => t.src === src && t.px === left && t.py === top);
            if (existingIdx > -1) {
                if (currentMapData[key][existingIdx].z !== i) {
                    currentMapData[key][existingIdx].z = i;
                    hasChanges = true;
                }
            } else {
                currentMapData[key].push(tile);
                hasChanges = true;
            }
        });

        if(hasChanges) {
            saveData(false);
            updateUIStats();
        }

        // Auto Follow
        const userNode = document.querySelector('.ct-user .you')?.closest('.ct-user');
        if (userNode) {
            const match = userNode.style.transform.match(/translate\((-?[\d.]+)px,\s*(-?[\d.]+)px\)/);
            if (match) {
                const px = parseFloat(match[1]);
                const py = parseFloat(match[2]);

                if (px !== state.playerPos.px || py !== state.playerPos.py) {
                    state.playerPos = { px, py };
                    if (state.hoverGrid.x === null) {
                        const coords = worldToGrid(px, py);
                        const coordSpan = document.getElementById('ct-coords-val');
                        if(coordSpan) coordSpan.innerText = `${coords.x}, ${coords.y} (Player)`;
                    }

                    const panel = document.getElementById('ct-panel');
                    const isEditorOpen = panel && panel.style.display !== 'none';
                    const shouldFollow = !isEditorOpen || (state.settings.followPlayer && !state.isDragging);

                    if (shouldFollow && state.viewingMapId === state.currentMapId) {
                        state.camera.x = -px;
                        state.camera.y = -py;
                    }
                    requestRender();
                }
            }
        }
    }

    // --- RENDERER ---
    let renderReq = false;
    const imgCache = {};

    function requestRender() {
        if (!renderReq) {
            renderReq = true;
            requestAnimationFrame(renderAll);
        }
    }

    function drawScene(ctx, width, height, isOverlay) {
        ctx.fillStyle = isOverlay ? 'rgba(20,20,20,0.85)' : CONFIG.COLORS.VOID;
        ctx.fillRect(0, 0, width, height);

        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.scale(state.camera.zoom, state.camera.zoom);
        ctx.translate(state.camera.x, state.camera.y);

        let flatTiles = [];
        let tallTiles = [];
        let substrateTiles = [];

        const viewingData = (state.archives[state.viewingMapId] && state.archives[state.viewingMapId].mapData) ?
            state.archives[state.viewingMapId].mapData : {};

        Object.values(viewingData).forEach(tiles => {
            tiles.forEach(tile => {
                if (!state.layers[tile.layer]) return;
                substrateTiles.push(tile);
                if (tile.layer === 'ground' || isFlatTile(tile.src)) {
                    flatTiles.push(tile);
                } else {
                    tallTiles.push(tile);
                }
            });
        });

        ctx.fillStyle = state.settings.bgColor;
        substrateTiles.forEach(tile => {
            ctx.fillRect(tile.px, tile.py, tile.w, tile.h);
        });

        flatTiles.sort((a, b) => (a.z || 0) - (b.z || 0));
        tallTiles.sort((a, b) => a.py - b.py);
        const allTiles = [...flatTiles, ...tallTiles];
        allTiles.forEach(tile => {
            if (!imgCache[tile.src]) {
                const img = new Image();
                img.src = tile.src;
                imgCache[tile.src] = img;
                img.onload = requestRender;
            }
            const img = imgCache[tile.src];
            if (img.complete) {
                ctx.drawImage(img, tile.px, tile.py, tile.w, tile.h);
            }
        });

        if (state.settings.showGrid) {
            const worldLeft = (0 - width / 2) / state.camera.zoom - state.camera.x;
            const worldTop = (0 - height / 2) / state.camera.zoom - state.camera.y;
            const worldRight = (width - width / 2) / state.camera.zoom - state.camera.x;
            const worldBottom = (height - height / 2) / state.camera.zoom - state.camera.y;

            const startX = Math.floor(worldLeft / CONFIG.TILE_SIZE) * CONFIG.TILE_SIZE;
            const startY = Math.floor(worldTop / CONFIG.TILE_SIZE) * CONFIG.TILE_SIZE;
            const endX = Math.ceil(worldRight / CONFIG.TILE_SIZE) * CONFIG.TILE_SIZE;
            const endY = Math.ceil(worldBottom / CONFIG.TILE_SIZE) * CONFIG.TILE_SIZE;

            ctx.strokeStyle = CONFIG.COLORS.GRID;
            ctx.lineWidth = 1 / state.camera.zoom;
            ctx.beginPath();
            for (let x = startX; x <= endX; x += CONFIG.TILE_SIZE) {
                ctx.moveTo(x, startY);
                ctx.lineTo(x, endY);
            }
            for (let y = startY; y <= endY; y += CONFIG.TILE_SIZE) {
                ctx.moveTo(startX, y);
                ctx.lineTo(endX, y);
            }
            ctx.stroke();
        }

        if (state.hoverGrid.x !== null && !state.isDragging && !isOverlay) {
            ctx.fillStyle = CONFIG.COLORS.HIGHLIGHT;
            const hx = state.hoverGrid.x * CONFIG.TILE_SIZE;
            const hy = -state.hoverGrid.y * CONFIG.TILE_SIZE;
            ctx.fillRect(hx, hy, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
            ctx.strokeStyle = 'cyan';
            ctx.lineWidth = 2 / state.camera.zoom;
            ctx.strokeRect(hx, hy, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
        }

        if (state.viewingMapId === state.currentMapId) {
            ctx.fillStyle = CONFIG.COLORS.PLAYER;
            ctx.beginPath();
            const cx = state.playerPos.px + (CONFIG.TILE_SIZE / 2);
            const cy = state.playerPos.py + (CONFIG.TILE_SIZE / 2);
            ctx.arc(cx, cy, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2 / state.camera.zoom;
            ctx.stroke();
        }

        ctx.restore();
    }

    function renderAll() {
        renderReq = false;
        const mainCvs = document.getElementById('ct-canvas');
        if (mainCvs && mainCvs.offsetParent) {
            drawScene(mainCvs.getContext('2d'), mainCvs.width, mainCvs.height, false);
        }

        if (state.ui.overlayEnabled) {
            const overContainer = document.getElementById('ct-overlay-container');
            const overCvs = document.getElementById('ct-overlay-canvas');
            const slider = document.getElementById('ct-overlay-slider');

            if (overContainer && overCvs && overContainer.offsetParent) {
                if (overCvs.width !== overContainer.clientWidth || overCvs.height !== overContainer.clientHeight) {
                    overCvs.width = overContainer.clientWidth;
                    overCvs.height = overContainer.clientHeight;
                }
                drawScene(overCvs.getContext('2d'), overCvs.width, overCvs.height, true);
            }

            if (slider && document.activeElement !== slider) slider.value = state.camera.zoom;
        }
    }

    // --- DOM ---
    function toggleOverlay() {
        state.ui.overlayEnabled = !state.ui.overlayEnabled;
        const btn = document.getElementById('ct-toggle-overlay');
        if (btn) btn.style.opacity = state.ui.overlayEnabled ? '1' : '0.5';
        manageOverlayDOM();
        saveData();
        requestRender();
    }

    function manageOverlayDOM() {
        let container = document.getElementById('ct-overlay-container');
        if (!state.ui.overlayEnabled) {
            if (container) container.style.display = 'none';
            return;
        }

        let target = document.querySelector(CONFIG.OVERLAY_SELECTOR);
        if (!target) target = document.querySelector(CONFIG.FALLBACK_SELECTOR);

        if (!target) return;
        if (!container) {
            container = document.createElement('div');
            container.id = 'ct-overlay-container';
            container.style.cssText = "position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 999; pointer-events: none; overflow: hidden;";
            const canvasHTML = '<canvas id="ct-overlay-canvas" style="width: 100%; height: 100%; display: block;"></canvas>';
            const sliderHTML = `
                <div style="position: absolute; bottom: 5px; right: 5px; background: rgba(0,0,0,0.5); padding: 5px; border-radius: 4px; pointer-events: auto; display: flex; align-items: center; z-index: 1001;">
                    <span style="font-size: 10px; color: #fff; margin-right: 5px;">Zoom</span>
                    <input type="range" id="ct-overlay-slider" min="${CONFIG.MIN_ZOOM}" max="${CONFIG.MAX_ZOOM}" step="0.1" value="${state.camera.zoom}" style="width: 80px; cursor: pointer;">
                </div>
            `;
            container.innerHTML = canvasHTML + sliderHTML;

            const computed = window.getComputedStyle(target);
            if (computed.position === 'static') target.style.position = 'relative';
            target.appendChild(container);
            setTimeout(() => {
                const s = document.getElementById('ct-overlay-slider');
                if (s) s.oninput = (e) => { state.camera.zoom = parseFloat(e.target.value); requestRender(); };
            }, 0);
        } else {
            container.style.display = 'block';
            if (container.parentElement !== target) target.appendChild(container);
        }
    }

    // FIXED: Smart DOM Management
    function manageLauncherDOM() {
        const wrap = document.getElementById('ct-launcher-wrap');
        if (!wrap) return;

        // 1. Try to find the game container
        let target = document.querySelector(CONFIG.OVERLAY_SELECTOR) ||
                     document.querySelector(CONFIG.FALLBACK_SELECTOR);

        // 2. If target exists, attach to it (desktop/tablet behavior)
        if (target) {
             if (wrap.parentElement !== target) {
                 target.appendChild(wrap);
                 const computed = window.getComputedStyle(target);
                 if (computed.position === 'static') target.style.position = 'relative';

                 // Remove fallback class
                 wrap.classList.remove('ct-fallback-mode');
                 wrap.style.position = 'absolute';
                 wrap.style.top = '5px';
                 wrap.style.right = '5px';
             }
        }
        // 3. Fallback to body only if target is completely missing (some mobile views)
        else {
             if (wrap.parentElement !== document.body) {
                 document.body.appendChild(wrap);
                 wrap.classList.add('ct-fallback-mode'); // triggers CSS media query if needed
             }
        }
    }

    function updateMapSelector() {
        const sel = document.getElementById('sel-map');
        if (!sel) return;
        const currentVal = sel.value;
        sel.innerHTML = '<option value="Live Auto">📍 Live</option>';
        Object.keys(state.archives).sort().forEach(mapName => {
            const opt = document.createElement('option');
            opt.value = mapName;
            opt.innerText = mapName + (mapName === state.currentMapId ? " (Cur)" : "");
            sel.appendChild(opt);
        });
        sel.value = currentVal;
    }

    function updateUIHeader() {
        const disp = document.getElementById('ct-map-display');
        if(disp) {
            disp.innerText = state.viewingMapId || "...";
            disp.style.color = (state.viewingMapId === state.currentMapId) ? '#55ff55' : '#aaa';
        }
    }

    function updateUIStats() {
        const stats = document.getElementById('ct-stats');
        if(stats && state.viewingMapId && state.archives[state.viewingMapId]) {
            const count = Object.keys(state.archives[state.viewingMapId].mapData).length;
            stats.innerText = `${count}`;
        }
        const totalEl = document.getElementById('ct-total-stats');
        if (totalEl) {
            let total = 0;
            Object.values(state.archives).forEach(archive => { if (archive.mapData) total += Object.keys(archive.mapData).length; });
            totalEl.innerText = `${total}`;
        }
        const storageEl = document.getElementById('ct-storage-stats');
        if (storageEl) {
            const raw = SafeStorage.get(CONFIG.STORAGE_KEY) || '';
            storageEl.innerText = `${(raw.length / 1024).toFixed(0)} KB`;
        }
    }

    function createUI() {
        injectStyles();

        const launcherWrap = document.createElement('div');
        launcherWrap.id = 'ct-launcher-wrap';

        const btnModal = document.createElement('div');
        btnModal.className = 'ct-launch-btn';
        btnModal.innerText = '🛠️';
        btnModal.onclick = () => {
            document.getElementById('ct-panel').style.display = 'flex';
            const cvs = document.getElementById('ct-canvas');
            const view = document.getElementById('ct-view');
            cvs.width = view.clientWidth;
            cvs.height = view.clientHeight;
            requestRender();
            updateMapSelector();
            updateUIStats();
        };
        launcherWrap.appendChild(btnModal);

        const btnOverlay = document.createElement('div');
        btnOverlay.className = 'ct-launch-btn';
        btnOverlay.id = 'ct-toggle-overlay';
        btnOverlay.innerText = '👁️';
        btnOverlay.style.opacity = state.ui.overlayEnabled ? '1' : '0.5';
        btnOverlay.onclick = toggleOverlay;
        launcherWrap.appendChild(btnOverlay);

        document.body.appendChild(launcherWrap);

        const panel = document.createElement('div');
        panel.id = 'ct-panel';
        panel.style.display = 'none';
        panel.innerHTML = `
            <div id="ct-sidebar">
                <div class="ct-header"><span>CT MAPPER v23.17</span><span id="ct-min">_</span></div>
                <div id="ct-controls">
                    <div class="ct-row" style="color:#fff;">View: <span id="ct-map-display">...</span></div>
                    <div class="ct-sep"></div>
                    <div class="ct-row" style="color:#aaa;">Map: <span id="ct-stats" style="color:#ddd">0</span></div>
                    <div class="ct-row" style="color:#aaa;">Total: <span id="ct-total-stats" style="color:#ddd">0</span></div>
                    <div class="ct-row" style="color:#aaa;">Size: <span id="ct-storage-stats" style="color:#ddd">0 KB</span></div>
                    <div class="ct-sep"></div>
                    <button id="btn-force-save" style="background:#2ecc71; color:#fff;">💾 FORCE SAVE</button>
                    <div class="ct-sep"></div>
                    <div class="ct-row"><select id="sel-map" style="width:100%; padding:4px; background:#222; color:#fff; border:1px solid #444;"><option value="Live Auto">📍 Live</option></select></div>
                    <div class="ct-sep"></div>
                    <div class="ct-row">Pos: <span id="ct-coords-val" style="color:cyan;">0, 0</span></div>
                    <div class="ct-sep"></div>
                    <div class="ct-row"><label><input type="checkbox" checked data-layer="ground"> Ground</label></div>
                    <div class="ct-row"><label><input type="checkbox" checked data-layer="walls"> Walls</label></div>
                    <div class="ct-row"><label><input type="checkbox" checked data-layer="objects"> Objects</label></div>
                    <div class="ct-row"><label><input type="checkbox" checked data-layer="items"> Items</label></div>
                    <div class="ct-sep"></div>
                    <div class="ct-row"><label>BG Color:</label><input type="color" id="inp-bgcolor" value="${state.settings.bgColor}" style="width:100%; height:25px; border:none;"></div>
                    <div class="ct-row"><label><input type="checkbox" checked id="chk-grid"> Grid</label></div>
                    <div class="ct-row"><label><input type="checkbox" checked id="chk-follow"> Follow</label></div>
                    <div class="ct-sep"></div>
                    <button id="btn-export">Export All</button>
                    <button id="btn-import">Import</button>
                    <button id="btn-reset" style="color:#ff6b6b">Wipe Data</button>
                    <input type="file" id="file-import" style="display:none">
                </div>
            </div>
            <div id="ct-view"><canvas id="ct-canvas"></canvas></div>
            <div id="ct-close">❌</div>
        `;
        document.body.appendChild(panel);

        document.getElementById('ct-close').onclick = () => panel.style.display = 'none';

        document.getElementById('ct-min').onclick = () => {
            const controls = document.getElementById('ct-controls');
            state.ui.minimized = !state.ui.minimized;
            controls.style.display = state.ui.minimized ? 'none' : 'block';
        };

        document.getElementById('btn-force-save').onclick = () => saveData(true);

        document.getElementById('sel-map').onchange = (e) => {
            const val = e.target.value;
            if (val === 'Live Auto') {
                state.viewingMapId = state.currentMapId;
                state.settings.followPlayer = true;
                document.getElementById('chk-follow').checked = true;
            } else {
                state.viewingMapId = val;
                state.settings.followPlayer = false;
                document.getElementById('chk-follow').checked = false;
            }
            updateUIHeader(); updateUIStats(); requestRender();
        };

        const cvs = document.getElementById('ct-canvas');
        const view = document.getElementById('ct-view');
        function resize() { cvs.width = view.clientWidth; cvs.height = view.clientHeight; requestRender(); }
        window.addEventListener('resize', resize);

        // Touch support for mobile dragging
        let lastTouch = null;
        cvs.addEventListener('touchstart', (e) => {
            state.isDragging = true;
            lastTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            state.settings.followPlayer = false;
            document.getElementById('chk-follow').checked = false;
        }, {passive: false});

        cvs.addEventListener('touchmove', (e) => {
            e.preventDefault(); // Stop page scroll
            if(state.isDragging) {
                const dx = e.touches[0].clientX - lastTouch.x;
                const dy = e.touches[0].clientY - lastTouch.y;
                state.camera.x += dx / state.camera.zoom;
                state.camera.y += dy / state.camera.zoom;
                lastTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
                requestRender();
            }
        }, {passive: false});

        cvs.addEventListener('touchend', () => { state.isDragging = false; });

        // Mouse support
        cvs.onmousedown = (e) => { e.preventDefault(); state.isDragging = true; state.lastMouse = { x: e.clientX, y: e.clientY }; state.settings.followPlayer = false; document.getElementById('chk-follow').checked = false; };
        window.addEventListener('mouseup', () => { state.isDragging = false; requestRender(); });
        cvs.onmousemove = (e) => {
            const rect = cvs.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            if (state.isDragging) {
                const dx = e.clientX - state.lastMouse.x;
                const dy = e.clientY - state.lastMouse.y;
                state.camera.x += dx / state.camera.zoom;
                state.camera.y += dy / state.camera.zoom;
                state.lastMouse = { x: e.clientX, y: e.clientY };
                requestRender();
                return;
            }
            const worldX = (mouseX - cvs.width / 2) / state.camera.zoom - state.camera.x;
            const worldY = (mouseY - cvs.height / 2) / state.camera.zoom - state.camera.y;
            const hoverTileX = Math.floor(worldX / CONFIG.TILE_SIZE);
            const hoverTileY = -Math.floor(worldY / CONFIG.TILE_SIZE);
            if (state.hoverGrid.x !== hoverTileX || state.hoverGrid.y !== hoverTileY) {
                state.hoverGrid = { x: hoverTileX, y: hoverTileY };
                const coordSpan = document.getElementById('ct-coords-val');
                if(coordSpan) { coordSpan.innerText = `${hoverTileX}, ${hoverTileY}`; coordSpan.style.color = '#00ffff'; }
                requestRender();
            }
        };

        cvs.onmouseout = () => {
            state.hoverGrid = { x: null, y: null };
            requestRender();
        };
        cvs.onwheel = (e) => {
            e.preventDefault();
            const dir = e.deltaY > 0 ? -1 : 1;
            state.camera.zoom = Math.max(0.1, Math.min(5, state.camera.zoom + dir * 0.1));
            requestRender();
        };

        panel.querySelectorAll('input[data-layer]').forEach(el => { el.onchange = (e) => { state.layers[e.target.dataset.layer] = e.target.checked; requestRender(); }; });
        document.getElementById('chk-grid').onchange = (e) => { state.settings.showGrid = e.target.checked; requestRender(); };
        document.getElementById('chk-follow').onchange = (e) => { state.settings.followPlayer = e.target.checked; if (e.target.checked && state.viewingMapId === state.currentMapId) { state.camera.x = -state.playerPos.px; state.camera.y = -state.playerPos.py; requestRender(); } };
        document.getElementById('inp-bgcolor').oninput = (e) => { state.settings.bgColor = e.target.value; saveData(false); requestRender(); };
        document.getElementById('btn-reset').onclick = () => { if(confirm("WIPE ALL MAP DATA?")) { state.archives = {}; saveData(true); requestRender(); updateMapSelector(); updateUIStats(); }};
        document.getElementById('btn-export').onclick = () => {
            const b = new Blob([JSON.stringify({archives:state.archives, settings:state.settings, ui: state.ui})], {type:'application/json'});
            const a = document.createElement('a');
            a.href = URL.createObjectURL(b);
            a.download = `ct_maps_v23_all.json`;
            a.click();
        };
        const fi = document.getElementById('file-import');
        document.getElementById('btn-import').onclick = () => fi.click();
        fi.onchange = (e) => {
            const f = e.target.files[0];
            if(!f) return;
            const r = new FileReader();
            r.onload = (ev) => {
                try {
                    const d = JSON.parse(ev.target.result);
                    if (d.archives) state.archives = { ...state.archives, ...d.archives };
                    if (d.settings) state.settings = { ...state.settings, ...d.settings };
                    saveData(true);
                    requestRender();
                    updateMapSelector();
                    updateUIStats();
                    alert("Imported Successfully");
                } catch(e) { alert("Error importing file"); }
            };
            r.readAsText(f);
        };

        manageLauncherDOM();
        if(state.ui.overlayEnabled) manageOverlayDOM();
        const observer = new MutationObserver(() => { scanWorld(); });
        const target = document.querySelector('#map');
        if(target) observer.observe(target, { childList: true, subtree: true, attributes: true });
        setInterval(scanWorld, 2000);
        setInterval(() => { manageLauncherDOM(); if(state.ui.overlayEnabled && !document.getElementById('ct-overlay-container')) manageOverlayDOM(); }, 1000);
    }

    function init() { loadData(); createUI(); scanWorld(); }
    if(document.body) init(); else window.addEventListener('DOMContentLoaded', init);

})();