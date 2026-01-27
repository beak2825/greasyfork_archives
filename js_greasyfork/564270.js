// ==UserScript==
// @name         MMA in GeoGuessr
// @version      4.2
// @description  Display Map Making App (MMA) tags on GeoGuessr game map. Supports tag filtering, searching, sorting.
// @author       wang
// @license      MIT
// @match        https://www.geoguessr.com/game/*
// @icon         https://www.geoguessr.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @connect      map-making.app
// @run-at       document-idle
// @noframes
// @namespace https://greasyfork.org/users/1562026
// @downloadURL https://update.greasyfork.org/scripts/564270/MMA%20in%20GeoGuessr.user.js
// @updateURL https://update.greasyfork.org/scripts/564270/MMA%20in%20GeoGuessr.meta.js
// ==/UserScript==
(function() {
    'use strict';

    let mmaPanel = null;
    let mmaMap = null;
    let mmaOverlay = null;
    let mmaLocations = [];
    let mmaTags = {};
    let mmaSelectedTags = [];
    let mmaMapId = GM_getValue('mmaMapId', '');
    let mmaMapName = GM_getValue('mmaMapName', '');
    let mmaMarkerSize = GM_getValue('mmaMarkerSize', 5);
    let mmaShowBorder = GM_getValue('mmaShowBorder', false);
    let mmaPanelPos = GM_getValue('mmaPanelPos', { top: 80, left: 8 });
    let mmaPanelSize = GM_getValue('mmaPanelSize', { width: 200, height: null });
    let mmaTagColors = {};
    let mmaProcessedData = [];
    let mmaSettingsOpen = false;
    let mmaMinimized = GM_getValue('mmaMinimized', false);
    let mmaTagSearch = '';
    let mmaTagSort = GM_getValue('mmaTagSort', 'default');
    let mmaTagOrder = [];

    const COLORS = [
        [254, 205, 25], [108, 185, 40], [232, 60, 75], [26, 151, 240], [245, 129, 66],
        [164, 94, 229], [25, 254, 205], [240, 75, 160], [66, 245, 129], [229, 164, 94],
        [40, 185, 197], [205, 25, 254], [151, 240, 26], [75, 15, 232], [254, 66, 25]
    ];
    const COLORS_HEX = [
        '#fecd19', '#6cb928', '#e83c4b', '#1a97f0', '#f58142',
        '#a45ee5', '#19fecd', '#f04ba0', '#42f581', '#e5a45e',
        '#28b9c5', '#cd19fe', '#97f01a', '#4b0fe8', '#fe4219'
    ];

    function loadDeckGL() {
        return new Promise((resolve) => {
            if (unsafeWindow.deck) { resolve(); return; }
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/deck.gl@latest/dist.min.js';
            script.onload = () => {
                let tries = 0;
                const check = () => {
                    if (unsafeWindow.deck || tries++ > 50) resolve();
                    else setTimeout(check, 100);
                };
                check();
            };
            script.onerror = () => resolve();
            document.head.appendChild(script);
        });
    }

    function createPanel() {
        if (mmaPanel) return;

        mmaPanel = document.createElement('div');
        mmaPanel.id = 'mma-panel';
        mmaPanel.innerHTML = `
            <div id="mma-header">
                <div id="mma-title-section">
                    <div id="mma-label">Map</div>
                    <div id="mma-status">-</div>
                </div>
                <div id="mma-controls">
                    <button id="mma-all" title="All">A</button>
                    <button id="mma-none" title="None">N</button>
                    <button id="mma-settings-btn" title="Settings">⚙</button>
                    <button id="mma-minimize-btn" title="Minimize">${mmaMinimized ? '+' : '−'}</button>
                </div>
            </div>
            <div id="mma-settings" class="hidden">
                <div class="mma-setting">
                    <span>Map ID</span>
                    <input type="text" id="mma-map-id" value="${mmaMapId}">
                    <button id="mma-load">↵</button>
                </div>
                <div id="mma-map-name-row" class="mma-setting" style="display:${mmaMapName ? 'flex' : 'none'}">
                    <span>Name</span>
                    <div id="mma-map-name">${mmaMapName}</div>
                </div>
                <div class="mma-setting">
                    <span>Size</span>
                    <input type="range" id="mma-size" min="2" max="15" value="${mmaMarkerSize}">
                </div>
                <div class="mma-setting">
                    <span>Border</span>
                    <label class="mma-switch"><input type="checkbox" id="mma-border" ${mmaShowBorder ? 'checked' : ''}><span class="mma-slider"></span></label>
                </div>
            </div>
            <div id="mma-tag-toolbar">
                <input type="text" id="mma-tag-search" placeholder="Search...">
                <div id="mma-sort-btns">
                    <button id="mma-sort-default" class="${mmaTagSort === 'default' ? 'active' : ''}" title="Default order">D</button>
                    <button id="mma-sort-count" class="${mmaTagSort === 'count' ? 'active' : ''}" title="Sort by count">#</button>
                    <button id="mma-sort-name" class="${mmaTagSort === 'name' ? 'active' : ''}" title="Sort by name">A</button>
                </div>
            </div>
            <div id="mma-tags"></div>
            <div id="mma-resize"></div>
        `;

        const style = document.createElement('style');
        style.textContent = `
            #mma-panel {
                position: fixed;
                top: ${mmaPanelPos.top}px;
                left: ${mmaPanelPos.left}px;
                width: ${mmaPanelSize.width}px;
                ${mmaPanelSize.height ? `height: ${mmaPanelSize.height}px;` : ''}
                min-width: 140px;
                max-width: 500px;
                max-height: 80vh;
                background: linear-gradient(180deg, rgb(161 155 217 / 60%) 0%, rgb(161 155 217 / 0%) 50%), var(--ds-color-purple-80, #393273);
                border-radius: 0.25rem;
                color: var(--ds-color-white, #fff);
                font-family: var(--default-font, 'ggFont', sans-serif);
                font-size: 14px;
                z-index: 99999;
                filter: drop-shadow(0 0.5rem 0.5rem rgb(0 0 0 / 30%));
                box-shadow: inset 0 0.0625rem 0 rgb(255 255 255 / 15%), inset 0 -0.0625rem 0 rgb(0 0 0 / 25%);
                overflow: hidden;
                resize: both;
                min-height: 70px;
                user-select: none;
                display: flex;
                flex-direction: column;
            }
            #mma-panel.minimized {
                height: auto !important;
                min-height: auto;
                resize: none;
            }
            #mma-panel.minimized #mma-settings,
            #mma-panel.minimized #mma-tag-toolbar,
            #mma-panel.minimized #mma-tags,
            #mma-panel.minimized #mma-resize { display: none !important; }
            #mma-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.5rem 0.75rem;
                background: linear-gradient(180deg, rgb(161 155 217 / 40%) 0%, transparent 100%);
                cursor: move;
                gap: 0.5rem;
                flex-shrink: 0;
            }
            #mma-title-section { display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 0; }
            #mma-label { font-weight: 700; font-style: italic; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.6; }
            #mma-status { font-size: 16px; font-weight: 700; font-style: italic; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            #mma-controls { display: flex; gap: 3px; }
            #mma-controls button {
                background: var(--ds-color-white-10, rgba(255,255,255,0.1));
                border: none;
                color: var(--ds-color-white, #fff);
                width: 24px;
                height: 24px;
                border-radius: 3px;
                cursor: pointer;
                font-size: 12px;
                font-weight: 700;
                font-style: italic;
            }
            #mma-controls button:hover { background: var(--ds-color-white-20, rgba(255,255,255,0.2)); }
            #mma-settings { padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--ds-color-white-10, rgba(255,255,255,0.1)); flex-shrink: 0; }
            #mma-settings.hidden { display: none; }
            .mma-setting { display: flex; align-items: center; gap: 0.5rem; margin: 0.4rem 0; }
            .mma-setting span { font-size: 11px; font-weight: 700; font-style: italic; text-transform: uppercase; opacity: 0.5; width: 40px; flex-shrink: 0; }
            .mma-setting input[type="text"] {
                flex: 1;
                padding: 0.3rem 0.5rem;
                border: none;
                border-radius: 3px;
                background: var(--ds-color-white-10, rgba(255,255,255,0.1));
                color: var(--ds-color-white, #fff);
                font-size: 13px;
                font-family: inherit;
                font-weight: 700;
                font-style: italic;
                min-width: 0;
            }
            .mma-setting input[type="text"]:focus { outline: none; background: var(--ds-color-white-20, rgba(255,255,255,0.2)); }
            #mma-map-name { flex: 1; font-size: 13px; font-weight: 700; font-style: italic; opacity: 0.8; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
            #mma-load {
                padding: 0.3rem 0.5rem;
                background: var(--ds-color-brand-50, #7950e5);
                border: none;
                border-radius: 3px;
                color: var(--ds-color-white, #fff);
                cursor: pointer;
                font-size: 13px;
                font-weight: 700;
            }
            #mma-load:hover { background: var(--ds-color-brand-30, #a685ff); }
            .mma-setting input[type="range"] {
                flex: 1;
                height: 4px;
                -webkit-appearance: none;
                background: var(--ds-color-white-20, rgba(255,255,255,0.2));
                border-radius: 2px;
            }
            .mma-setting input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 14px;
                height: 14px;
                background: var(--ds-color-purple-30, #8f86e6);
                border-radius: 50%;
                cursor: pointer;
            }
            .mma-switch {
                position: relative;
                width: 32px;
                height: 18px;
            }
            .mma-switch input { opacity: 0; width: 0; height: 0; }
            .mma-slider {
                position: absolute;
                cursor: pointer;
                top: 0; left: 0; right: 0; bottom: 0;
                background: var(--ds-color-white-20, rgba(255,255,255,0.2));
                border-radius: 9px;
                transition: 0.2s;
            }
            .mma-slider:before {
                position: absolute;
                content: "";
                height: 12px;
                width: 12px;
                left: 3px;
                bottom: 3px;
                background: white;
                border-radius: 50%;
                transition: 0.2s;
            }
            .mma-switch input:checked + .mma-slider { background: var(--ds-color-purple-30, #8f86e6); }
            .mma-switch input:checked + .mma-slider:before { transform: translateX(14px); }
            #mma-tag-toolbar {
                display: flex;
                gap: 0.4rem;
                padding: 0.4rem 0.6rem;
                flex-shrink: 0;
            }
            #mma-tag-search {
                flex: 1;
                padding: 0.25rem 0.4rem;
                border: none;
                border-radius: 3px;
                background: var(--ds-color-white-10, rgba(255,255,255,0.1));
                color: var(--ds-color-white, #fff);
                font-size: 12px;
                font-family: inherit;
                min-width: 0;
            }
            #mma-tag-search:focus { outline: none; background: var(--ds-color-white-20, rgba(255,255,255,0.2)); }
            #mma-tag-search::placeholder { color: var(--ds-color-white-40, rgba(255,255,255,0.4)); }
            #mma-sort-btns { display: flex; gap: 2px; }
            #mma-sort-btns button {
                background: var(--ds-color-white-10, rgba(255,255,255,0.1));
                border: none;
                color: var(--ds-color-white, #fff);
                width: 22px;
                height: 22px;
                border-radius: 3px;
                cursor: pointer;
                font-size: 11px;
                font-weight: 700;
                opacity: 0.5;
            }
            #mma-sort-btns button:hover { opacity: 0.8; }
            #mma-sort-btns button.active { opacity: 1; background: var(--ds-color-brand-70, #4a2399); }
            #mma-tags {
                flex: 1;
                min-height: 0;
                overflow-y: auto;
                padding: 0.4rem 0.6rem;
            }
            #mma-tags::-webkit-scrollbar { width: 0.375rem; }
            #mma-tags::-webkit-scrollbar-track { background: var(--ds-color-black-80, #10101ccc); }
            #mma-tags::-webkit-scrollbar-thumb { background: var(--ds-color-white-20, rgba(255,255,255,0.2)); border-radius: 3px; }
            #mma-tags::-webkit-scrollbar-thumb:hover { background: var(--ds-color-white-40, rgba(255,255,255,0.4)); }
            .mma-tag {
                display: flex;
                align-items: center;
                padding: 0.3rem 0.4rem;
                margin: 2px 0;
                cursor: pointer;
                border-radius: 3px;
                opacity: 0.4;
                transition: all 0.15s;
            }
            .mma-tag:hover { background: var(--ds-color-white-10, rgba(255,255,255,0.1)); opacity: 0.7; }
            .mma-tag.selected { opacity: 1; background: var(--ds-color-brand-70, #4a2399); }
            .mma-tag-color { width: 10px; height: 10px; border-radius: 2px; margin-right: 0.5rem; flex-shrink: 0; }
            .mma-tag-name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 13px; font-weight: 700; font-style: italic; }
            .mma-tag-count { color: var(--ds-color-white-40, rgba(255,255,255,0.4)); font-size: 12px; font-weight: 700; font-style: italic; margin-left: 0.4rem; }
            #mma-resize {
                position: absolute;
                bottom: 0;
                right: 0;
                width: 12px;
                height: 12px;
                cursor: nwse-resize;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(mmaPanel);

        if (mmaMinimized) mmaPanel.classList.add('minimized');

        setupDrag();
        setupEvents();
    }

    function setupDrag() {
        const header = document.getElementById('mma-header');
        let isDragging = false;
        let startX, startY, startLeft, startTop;

        header.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            const rect = mmaPanel.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            mmaPanel.style.left = (startLeft + e.clientX - startX) + 'px';
            mmaPanel.style.top = (startTop + e.clientY - startY) + 'px';
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                const rect = mmaPanel.getBoundingClientRect();
                mmaPanelPos = { top: rect.top, left: rect.left };
                GM_setValue('mmaPanelPos', mmaPanelPos);
            }
        });

        new ResizeObserver(() => {
            const rect = mmaPanel.getBoundingClientRect();
            mmaPanelSize = { width: rect.width, height: rect.height };
            GM_setValue('mmaPanelSize', mmaPanelSize);
        }).observe(mmaPanel);
    }

    function setupEvents() {
        document.getElementById('mma-settings-btn').addEventListener('click', () => {
            mmaSettingsOpen = !mmaSettingsOpen;
            document.getElementById('mma-settings').classList.toggle('hidden', !mmaSettingsOpen);
        });

        document.getElementById('mma-minimize-btn').addEventListener('click', () => {
            mmaMinimized = !mmaMinimized;
            GM_setValue('mmaMinimized', mmaMinimized);
            mmaPanel.classList.toggle('minimized', mmaMinimized);
            document.getElementById('mma-minimize-btn').textContent = mmaMinimized ? '+' : '−';
        });

        document.getElementById('mma-load').addEventListener('click', loadMap);
        document.getElementById('mma-map-id').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') loadMap();
        });

        document.getElementById('mma-size').addEventListener('input', (e) => {
            mmaMarkerSize = parseInt(e.target.value);
            GM_setValue('mmaMarkerSize', mmaMarkerSize);
            updateOverlay();
        });

        document.getElementById('mma-border').addEventListener('change', (e) => {
            mmaShowBorder = e.target.checked;
            GM_setValue('mmaShowBorder', mmaShowBorder);
            updateOverlay();
        });

        document.getElementById('mma-all').addEventListener('click', () => {
            let tags = Object.keys(mmaTags);
            if (mmaTagSearch) {
                tags = tags.filter(t => t.toLowerCase().includes(mmaTagSearch));
            }
            tags.forEach(t => {
                if (!mmaSelectedTags.includes(t)) mmaSelectedTags.push(t);
            });
            updateTagUI();
            updateOverlay();
        });

        document.getElementById('mma-none').addEventListener('click', () => {
            if (mmaTagSearch) {
                mmaSelectedTags = mmaSelectedTags.filter(t => !t.toLowerCase().includes(mmaTagSearch));
            } else {
                mmaSelectedTags = [];
            }
            updateTagUI();
            updateOverlay();
        });

        document.getElementById('mma-tag-search').addEventListener('input', (e) => {
            mmaTagSearch = e.target.value.toLowerCase();
            renderTags();
        });

        const sortBtns = ['default', 'count', 'name'];
        sortBtns.forEach(type => {
            document.getElementById(`mma-sort-${type}`).addEventListener('click', () => {
                mmaTagSort = type;
                GM_setValue('mmaTagSort', mmaTagSort);
                sortBtns.forEach(t => {
                    document.getElementById(`mma-sort-${t}`).classList.toggle('active', t === type);
                });
                renderTags();
            });
        });
    }

    function loadMap() {
        const mapId = document.getElementById('mma-map-id').value.trim();
        if (!mapId) return;

        mmaMapId = mapId;
        GM_setValue('mmaMapId', mmaMapId);
        setStatus('Loading...');

        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://map-making.app/api/maps/${mapId}`,
            withCredentials: true,
            onload: function(response) {
                if (response.status === 200) {
                    try {
                        const info = JSON.parse(response.responseText);
                        mmaMapName = info.name || info.title || '';
                        GM_setValue('mmaMapName', mmaMapName);
                        updateMapNameUI();
                    } catch(e) {}
                }
            }
        });

        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://map-making.app/api/maps/${mapId}/locations`,
            withCredentials: true,
            onload: function(response) {
                if (response.status === 401 || response.status === 403) {
                    setStatus('Need login');
                    return;
                }
                if (response.status === 404) {
                    setStatus('Not found');
                    return;
                }
                try {
                    processMapData(JSON.parse(response.responseText));
                } catch (e) {
                    setStatus('Error');
                }
            },
            onerror: function() {
                setStatus('Error');
            }
        });
    }

    function updateMapNameUI() {
        const row = document.getElementById('mma-map-name-row');
        const el = document.getElementById('mma-map-name');
        if (row && el) {
            row.style.display = mmaMapName ? 'flex' : 'none';
            el.textContent = mmaMapName;
        }
    }

    function processMapData(data) {
        mmaLocations = Array.isArray(data) ? data : (data.customCoordinates || data.locations || []);

        mmaTags = {};
        mmaTagOrder = [];
        let untaggedCount = 0;

        mmaLocations.forEach(loc => {
            const tags = loc.extra?.tags || loc.tags;
            if (tags && tags.length > 0) {
                tags.forEach(tag => {
                    const name = typeof tag === 'object' ? (tag.name || tag.id || String(tag)) : String(tag);
                    if (!mmaTags[name]) {
                        mmaTags[name] = 0;
                        mmaTagOrder.push(name);
                    }
                    mmaTags[name]++;
                });
            } else {
                untaggedCount++;
            }
        });

        if (untaggedCount > 0) {
            mmaTags['Untagged'] = untaggedCount;
            mmaTagOrder.push('Untagged');
        }

        const sorted = Object.keys(mmaTags).sort((a, b) => {
            if (a === 'Untagged') return 1;
            if (b === 'Untagged') return -1;
            return mmaTags[b] - mmaTags[a];
        });
        
        mmaTagColors = {};
        sorted.forEach((t, i) => {
            const idx = t === 'Untagged' ? -1 : i % COLORS.length;
            mmaTagColors[t] = {
                rgb: idx < 0 ? [85, 85, 85] : COLORS[idx],
                hex: idx < 0 ? '#555' : COLORS_HEX[idx]
            };
        });

        mmaProcessedData = mmaLocations.map(loc => {
            const lat = loc.lat ?? loc.latitude ?? loc.location?.lat;
            const lng = loc.lng ?? loc.longitude ?? loc.location?.lng;
            const tags = loc.extra?.tags || loc.tags;
            let locTags = [];
            if (tags && tags.length > 0) {
                locTags = tags.map(t => typeof t === 'object' ? (t.name || t.id || String(t)) : String(t));
            } else {
                locTags = ['Untagged'];
            }
            return { lat, lng, tags: locTags };
        }).filter(d => d.lat != null && d.lng != null);

        mmaSelectedTags = [];
        renderTags();
        setStatus(`${mmaLocations.length}`);
        
        if (mmaOverlay) {
            mmaOverlay.setMap(null);
            mmaOverlay = null;
        }
        mmaMap = null;
        waitForMapAndSetup();
    }

    function renderTags() {
        const container = document.getElementById('mma-tags');
        container.innerHTML = '';

        let entries = Object.entries(mmaTags);
        
        if (mmaTagSearch) {
            entries = entries.filter(([tag]) => tag.toLowerCase().includes(mmaTagSearch));
        }

        if (mmaTagSort === 'default') {
            entries.sort((a, b) => mmaTagOrder.indexOf(a[0]) - mmaTagOrder.indexOf(b[0]));
        } else {
            entries.sort((a, b) => {
                if (a[0] === 'Untagged') return 1;
                if (b[0] === 'Untagged') return -1;
                if (mmaTagSort === 'name') {
                    return a[0].localeCompare(b[0]);
                }
                return b[1] - a[1];
            });
        }

        entries.forEach(([tag, count]) => {
            const color = mmaTagColors[tag]?.hex || '#555';
            const div = document.createElement('div');
            div.className = 'mma-tag' + (mmaSelectedTags.includes(tag) ? ' selected' : '');
            div.dataset.tag = tag;
            div.innerHTML = `<div class="mma-tag-color" style="background:${color}"></div><span class="mma-tag-name">${tag}</span><span class="mma-tag-count">${count}</span>`;
            div.onclick = () => {
                const idx = mmaSelectedTags.indexOf(tag);
                if (idx >= 0) mmaSelectedTags.splice(idx, 1);
                else mmaSelectedTags.push(tag);
                div.classList.toggle('selected', mmaSelectedTags.includes(tag));
                updateOverlay();
            };
            container.appendChild(div);
        });
    }

    function updateTagUI() {
        document.querySelectorAll('.mma-tag').forEach(div => {
            div.classList.toggle('selected', mmaSelectedTags.includes(div.dataset.tag));
        });
    }

    function waitForMapAndSetup() {
        let attempts = 0;
        const tryFind = () => {
            const map = findGuessMap();
            if (map) {
                mmaMap = map;
                setupDeckOverlay();
            } else if (attempts++ < 40) {
                setTimeout(tryFind, 250);
            } else {
                setStatus('No map');
            }
        };
        tryFind();
    }

    function findGuessMap() {
        const elements = document.querySelectorAll('[class*="guess-map"]');
        for (const el of elements) {
            const fiberKey = Object.keys(el).find(k => k.startsWith('__reactFiber$'));
            if (!fiberKey) continue;
            let fiber = el[fiberKey];
            let map = null;
            let depth = 0;
            try {
                while (fiber && depth < 50) {
                    depth++;
                    if (fiber.memoizedProps?.map) {
                        map = fiber.memoizedProps.map;
                        break;
                    }
                    if (fiber.memoizedState?.memoizedState?.current?.instance) {
                        map = fiber.memoizedState.memoizedState.current.instance;
                        break;
                    }
                    fiber = fiber.return;
                }
            } catch(e) {}
            if (map && typeof map.getCenter === 'function') return map;
        }
        return null;
    }

    function setupDeckOverlay() {
        const g = unsafeWindow.google;
        const d = unsafeWindow.deck;
        if (!g?.maps) { setStatus('No GMaps'); return; }
        if (!d?.GoogleMapsOverlay) { setStatus('No deck'); return; }

        mmaOverlay = new d.GoogleMapsOverlay({ layers: [] });
        mmaOverlay.setMap(mmaMap);
        updateOverlay();
    }

    function updateOverlay() {
        if (!mmaOverlay) return;
        const d = unsafeWindow.deck;
        if (!d) return;

        if (mmaSelectedTags.length === 0) {
            mmaOverlay.setProps({ layers: [] });
            return;
        }
        
        const filteredData = mmaProcessedData.filter(loc => 
            loc.tags.some(t => mmaSelectedTags.includes(t))
        ).map(loc => {
            let bestTag = null;
            let bestIdx = -1;
            for (const t of loc.tags) {
                const idx = mmaSelectedTags.indexOf(t);
                if (idx > bestIdx) {
                    bestIdx = idx;
                    bestTag = t;
                }
            }
            return { ...loc, displayTag: bestTag || loc.tags[0] };
        });

        const layerProps = {
            id: 'mma-' + Date.now(),
            data: filteredData,
            getPosition: d => [d.lng, d.lat],
            getFillColor: d => {
                const c = mmaTagColors[d.displayTag]?.rgb || [85, 85, 85];
                return [...c, 200];
            },
            getRadius: mmaMarkerSize * 80,
            radiusMinPixels: mmaMarkerSize,
            radiusMaxPixels: mmaMarkerSize * 2.5,
            filled: true,
            pickable: false
        };

        if (mmaShowBorder) {
            layerProps.stroked = true;
            layerProps.getLineColor = [0, 0, 0, 150];
            layerProps.lineWidthMinPixels = 0.5;
        } else {
            layerProps.stroked = false;
        }

        const layer = new d.ScatterplotLayer(layerProps);
        mmaOverlay.setProps({ layers: [layer] });
    }

    function setStatus(text) {
        const el = document.getElementById('mma-status');
        if (el) el.textContent = text;
    }

    async function init() {
        createPanel();
        setStatus('Loading...');
        await loadDeckGL();
        
        if (!unsafeWindow.deck) {
            setStatus('Lib error');
            return;
        }
        
        setStatus('Ready');
        if (mmaMapId) setTimeout(loadMap, 500);

        let checkCount = 0;
        const interval = setInterval(() => {
            if (mmaProcessedData.length > 0 && !mmaOverlay) {
                const newMap = findGuessMap();
                if (newMap) {
                    mmaMap = newMap;
                    setupDeckOverlay();
                }
            }
            if (++checkCount > 300) clearInterval(interval);
        }, 2000);
    }

    if (document.readyState === 'complete') {
        setTimeout(init, 800);
    } else {
        window.addEventListener('load', () => setTimeout(init, 800));
    }
})();
