// ==UserScript==
// @name         Torn Xmas Town Mapper
// @namespace    http://tampermonkey.net/felsync-xmas-town-mapper
// @version      1.0
// @description  Replaces per-tile borders with a crisp, global grid overlay. Uses GM_storage for unlimited saves.
// @author       Felsync [3921027]
// @match        https://www.torn.com/christmas_town.php*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559747/Torn%20Xmas%20Town%20Mapper.user.js
// @updateURL https://update.greasyfork.org/scripts/559747/Torn%20Xmas%20Town%20Mapper.meta.js
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
        currentMapId: null, // The map the player is physically standing in
        viewingMapId: null, // The map being shown on the canvas

        camera: { x: 0, y: 0, zoom: 1 },
        isDragging: false,
        lastMouse: { x: 0, y: 0 },

        hoverGrid: { x: null, y: null },

        playerPos: { x: 0, y: 0 },
        layers: { ground: true, objects: true, items: true, walls: true },
        settings: {
            showGrid: true,
            followPlayer: true,
            bgColor: '#f2f2f2'
        },
        ui: {
            minimized: false,
            overlayEnabled: false
        }
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
        let raw = GM_getValue(CONFIG.STORAGE_KEY);
        let source = "GM_Storage";

        // Migration from LocalStorage
        if (!raw) {
            raw = localStorage.getItem(CONFIG.STORAGE_KEY);
            source = "LocalStorage";
        }

        if (raw) {
            try {
                const data = JSON.parse(raw);
                state.archives = data.archives || {};
                state.camera = data.camera || { x: 0, y: 0, zoom: 1 };
                state.layers = { ...state.layers, ...(data.layers || {}) };
                if(data.settings) state.settings = { ...state.settings, ...data.settings };
                if (data.ui) state.ui.overlayEnabled = data.ui.overlayEnabled || false;
                console.log(`[CT Mapper] Loaded data from ${source}`);
            } catch (e) {
                console.error("[CT Mapper] Load Error", e);
                alert("Critical Error: Save data is corrupt. Do not save until resolved.");
            }
        } else {
            // Legacy Import
            const legacy = localStorage.getItem(CONFIG.LEGACY_KEY);
            if (legacy) {
                try {
                    const lData = JSON.parse(legacy);
                    if (lData.mapData) {
                        state.archives["Imported Legacy"] = { mapData: lData.mapData };
                        state.settings = { ...state.settings, ...(lData.settings || {}) };
                    }
                } catch(e) {}
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

            // Unlimited Storage via GM
            GM_setValue(CONFIG.STORAGE_KEY, payload);

            if (isManual) {
                alert(`✅ FORCE SAVE SUCCESSFUL!\nTotal Size: ${(payload.length/1024).toFixed(1)} KB`);
                updateUIStats();
            }

        } catch (e) {
            console.error("Save Failed", e);
            if (isManual) {
                alert(`❌ SAVE FAILED:\n${e.message}\n\nCheck console for details.`);
            }
        }
    }

    function switchMapContext(newMapId) {
        if (!newMapId) return;
        if (!state.archives[newMapId]) {
            state.archives[newMapId] = { mapData: {} };
        }
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
        if (!mapName) return; // Security Check

        if (mapName !== state.currentMapId) {
            switchMapContext(mapName);
        }

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

        // --- PLAYER POSITION & AUTO-FOLLOW ---
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

                    // AUTO-FOLLOW LOGIC:
                    // 1. Check if the editor panel is open
                    const panel = document.getElementById('ct-panel');
                    const isEditorOpen = panel && panel.style.display !== 'none';

                    // 2. Decide if we should follow
                    // If editor is CLOSED: Always Follow.
                    // If editor is OPEN: Only follow if checked and not dragging.
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

            if (slider && document.activeElement !== slider) {
                slider.value = state.camera.zoom;
            }
        }
    }

    // --- OVERLAY & DOM ---
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
            if (computed.position === 'static') {
                target.style.position = 'relative';
            }
            target.appendChild(container);
            setTimeout(() => {
                const s = document.getElementById('ct-overlay-slider');
                if (s) {
                    s.oninput = (e) => {
                        state.camera.zoom = parseFloat(e.target.value);
                        requestRender();
                    };
                }
            }, 0);
        } else {
            container.style.display = 'block';
            if (container.parentElement !== target) {
                target.appendChild(container);
            }
        }
    }

    function manageLauncherDOM() {
        const wrap = document.getElementById('ct-launcher-wrap');
        const target = document.querySelector(CONFIG.OVERLAY_SELECTOR) || document.querySelector(CONFIG.FALLBACK_SELECTOR);

        if (!wrap) return;
        if (!target) return;
        if (wrap.parentElement !== target) {
            target.appendChild(wrap);
            const computed = window.getComputedStyle(target);
            if (computed.position === 'static') {
                target.style.position = 'relative';
            }
        }
    }

    // --- UI ---
    function updateMapSelector() {
        const sel = document.getElementById('sel-map');
        if (!sel) return;
        const currentVal = sel.value;
        sel.innerHTML = '<option value="Live Auto">📍 Live (Auto-Detect)</option>';
        Object.keys(state.archives).sort().forEach(mapName => {
            const opt = document.createElement('option');
            opt.value = mapName;
            opt.innerText = mapName + (mapName === state.currentMapId ? " (Current)" : "");
            sel.appendChild(opt);
        });
        sel.value = currentVal;
    }

    function updateUIHeader() {
        const disp = document.getElementById('ct-map-display');
        if(disp) {
            disp.innerText = state.viewingMapId || "Waiting...";
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
            Object.values(state.archives).forEach(archive => {
                if (archive.mapData) total += Object.keys(archive.mapData).length;
            });
            totalEl.innerText = `${total}`;
        }

        const storageEl = document.getElementById('ct-storage-stats');
        if (storageEl) {
            const raw = GM_getValue(CONFIG.STORAGE_KEY) || '';
            const used = raw.length;
            const kb = (used / 1024).toFixed(0);
            storageEl.innerText = `${kb} KB`;
            storageEl.style.color = '#ddd';
        }
    }

    function createUI() {
        const launcherWrap = document.createElement('div');
        launcherWrap.id = 'ct-launcher-wrap';

        const btnModal = document.createElement('div');
        btnModal.className = 'ct-launch-btn';
        btnModal.innerText = '🛠️';
        btnModal.title = "Open Map Editor";
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
        btnOverlay.title = "Toggle HUD Overlay";
        btnOverlay.style.opacity = state.ui.overlayEnabled ? '1' : '0.5';
        btnOverlay.onclick = toggleOverlay;
        launcherWrap.appendChild(btnOverlay);

        document.body.appendChild(launcherWrap);

        const panel = document.createElement('div');
        panel.id = 'ct-panel';
        panel.style.display = 'none';
        panel.innerHTML = `
            <div id="ct-sidebar">
                <div class="ct-header">
                    <span>CT BUILDER v23.14</span>
                    <span id="ct-min">_</span>
                </div>

                <div id="ct-controls">
                    <div class="ct-row" style="font-weight:bold; color:#fff;">Viewing: <span id="ct-map-display">...</span></div>

                    <div class="ct-sep"></div>
                    <div class="ct-row" style="font-size:11px; color:#aaa;">Map Tiles: <span id="ct-stats" style="color:#ddd">0</span></div>
                    <div class="ct-row" style="font-size:11px; color:#aaa;">Total Tiles: <span id="ct-total-stats" style="color:#ddd">0</span></div>
                    <div class="ct-row" style="font-size:11px; color:#aaa;">GM Size: <span id="ct-storage-stats" style="color:#ddd">0 KB</span></div>
                    <div class="ct-sep"></div>

                    <button id="btn-force-save" style="background:#2ecc71; color:#fff; font-weight:bold; border:1px solid #27ae60;">💾 FORCE SAVE</button>
                    <div class="ct-sep"></div>

                    <div class="ct-row">
                        <select id="sel-map" style="width:100%; padding:4px; background:#222; color:#fff; border:1px solid #444;">
                            <option value="Live Auto">📍 Live (Auto-Detect)</option>
                        </select>
                    </div>

                    <div class="ct-sep"></div>
                    <div class="ct-row">Position: <span id="ct-coords-val" style="color:cyan;">0, 0</span></div>

                    <div class="ct-sep"></div>
                    <div class="ct-row"><label><input type="checkbox" checked data-layer="ground"> Ground</label></div>
                    <div class="ct-row"><label><input type="checkbox" checked data-layer="walls"> Walls</label></div>
                    <div class="ct-row"><label><input type="checkbox" checked data-layer="objects"> Objects</label></div>
                    <div class="ct-row"><label><input type="checkbox" checked data-layer="items"> Items</label></div>

                    <div class="ct-sep"></div>
                    <div class="ct-row">
                        <label>BG Color:</label>
                        <input type="color" id="inp-bgcolor" value="${state.settings.bgColor}" style="width:100%; height:25px; border:none; cursor:pointer;">
                    </div>

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
            const sb = document.getElementById('ct-sidebar');
            state.ui.minimized = !state.ui.minimized;
            controls.style.display = state.ui.minimized ? 'none' : 'block';
            sb.style.width = state.ui.minimized ? '40px' : '200px';
        };

        document.getElementById('btn-force-save').onclick = () => {
            saveData(true);
        };

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
            updateUIHeader();
            updateUIStats();
            requestRender();
        };

        const cvs = document.getElementById('ct-canvas');
        const view = document.getElementById('ct-view');
        function resize() {
            cvs.width = view.clientWidth;
            cvs.height = view.clientHeight;
            requestRender();
        }
        window.addEventListener('resize', resize);

        cvs.onmousedown = (e) => {
            e.preventDefault();
            state.isDragging = true;
            state.lastMouse = { x: e.clientX, y: e.clientY };
            state.settings.followPlayer = false;
            document.getElementById('chk-follow').checked = false;
        };
        window.addEventListener('mouseup', () => {
            state.isDragging = false;
            requestRender();
        });
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
                if(coordSpan) {
                    coordSpan.innerText = `${hoverTileX}, ${hoverTileY}`;
                    coordSpan.style.color = '#00ffff';
                }
                requestRender();
            }
        };

        cvs.onmouseout = () => {
            state.hoverGrid = { x: null, y: null };
            const coords = worldToGrid(state.playerPos.px, state.playerPos.py);
            const coordSpan = document.getElementById('ct-coords-val');
            if(coordSpan) {
                coordSpan.innerText = `${coords.x}, ${coords.y} (Player)`;
                coordSpan.style.color = '#ccc';
            }
            requestRender();
        };
        cvs.onwheel = (e) => {
            e.preventDefault();
            const dir = e.deltaY > 0 ? -1 : 1;
            state.camera.zoom = Math.max(0.1, Math.min(5, state.camera.zoom + dir * 0.1));
            requestRender();
        };

        panel.querySelectorAll('input[data-layer]').forEach(el => {
            el.onchange = (e) => { state.layers[e.target.dataset.layer] = e.target.checked; requestRender(); };
        });
        document.getElementById('chk-grid').onchange = (e) => { state.settings.showGrid = e.target.checked; requestRender(); };
        document.getElementById('chk-follow').onchange = (e) => {
            state.settings.followPlayer = e.target.checked;
            if (e.target.checked && state.viewingMapId === state.currentMapId) {
                state.camera.x = -state.playerPos.px;
                state.camera.y = -state.playerPos.py;
                requestRender();
            }
        };
        document.getElementById('inp-bgcolor').oninput = (e) => {
            state.settings.bgColor = e.target.value;
            saveData(false);
            requestRender();
        };
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
        if(state.ui.overlayEnabled) {
            manageOverlayDOM();
        }

        const observer = new MutationObserver(() => { scanWorld(); });
        const target = document.querySelector('#map');
        if(target) observer.observe(target, { childList: true, subtree: true, attributes: true });

        setInterval(scanWorld, 2000);
        setInterval(() => {
             manageLauncherDOM();
             if(state.ui.overlayEnabled && !document.getElementById('ct-overlay-container')) {
                 manageOverlayDOM();
             }
        }, 1000);
    }

    GM_addStyle(`
        #ct-launcher-wrap {
            position: absolute;
            top: 5px;
            right: 5px;
            z-index: 2000;
            display: flex;
            gap: 5px;
        }
        .ct-launch-btn { background:#222; color:#fff; padding:6px; border-radius:4px; cursor:pointer; border:1px solid #444; font-size:16px; width:36px; text-align:center; user-select:none; }
        .ct-launch-btn:hover { background:#333; }

        #ct-panel { position:fixed; inset:0; z-index:1000000; background:rgba(0,0,0,0.9); display:flex; color:#ccc; font-family:sans-serif; }
        #ct-sidebar { width:200px; background:#181818; border-right:1px solid #333; display:flex; flex-direction:column; padding:10px; transition:width 0.2s; }
        .ct-header { font-weight:bold; border-bottom:2px solid #ff4757; margin-bottom:10px; display:flex; justify-content:space-between; cursor:default; }
        #ct-min { cursor:pointer; padding:0 5px; }
        .ct-row { margin: 5px 0; font-size:13px; }
        .ct-sep { border-bottom:1px solid #333; margin:8px 0; }

        #ct-panel button { background:#333; color:#eee; border:1px solid #555; width:100%; padding:5px; margin-top:5px; cursor:pointer; border-radius:3px; }
        #ct-panel button:hover { background:#444; }

        #ct-view { flex:1; position:relative; overflow:hidden; cursor:crosshair; }
        #ct-close { position:absolute; top:10px; right:10px; color:#fff; cursor:pointer; font-weight:bold; font-size:20px; z-index:10; }
    `);

    function init() {
        loadData();
        createUI();
        scanWorld();
    }
    if(document.body) init(); else window.addEventListener('DOMContentLoaded', init);

})();