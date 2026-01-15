// ==UserScript==
// @name         8thGear Leaderboard Overhaul
// @namespace    8thGear Leaderboard OVerhaul by Tentakill
// @version      2.0.1
// @description  Overhauls the leaderboard for 8th Gear. Adds filters and column toggles.
// @author       Tentakill
// @match        https://8thgear.racing/laptimes*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=8thgear.racing
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/557582/8thGear%20Leaderboard%20Overhaul.user.js
// @updateURL https://update.greasyfork.org/scripts/557582/8thGear%20Leaderboard%20Overhaul.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Storage Keys
    const GLOBAL_MASTER_KEY = 'tm_8thgear_master_state';
    const HISTORY_KEY = 'tm_8thgear_layout_history';
    const WELCOME_KEY = 'tm_8thgear_welcome_seen_v1';

    // --- 1. CSS CONFIGURATION ---
    const css = `
        /* --- MASTER TOGGLE --- */
        #tm-master-toggle {
            position: fixed; top: 10px; left: 50%; transform: translateX(-50%);
            z-index: 9999; padding: 8px 20px; border: none; border-radius: 20px;
            font-weight: bold; font-family: sans-serif; cursor: pointer;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3); transition: all 0.2s;
        }
        .tm-is-active { background-color: #28a745; color: white; }
        .tm-is-inactive { background-color: #dc3545; color: white; }

        /* --- HISTORY BAR --- */
        #tm-history-bar {
            position: fixed; top: 10px; right: 50%;
            margin-right: 110px; display: flex; gap: 8px; z-index: 9999;
        }
        .tm-slot-wrapper { position: relative; width: 34px; height: 34px; }
        .tm-slot-btn {
            width: 100%; height: 100%; border-radius: 6px; border: 1px solid #444;
            background-color: #2c2c2c; color: #888; font-weight: bold; font-size: 14px;
            cursor: default; transition: all 0.2s; display: flex; align-items: center; justify-content: center;
        }
        .tm-slot-wrapper.tm-has-data .tm-slot-btn {
            background-color: #198754; color: white; border-color: #157347; cursor: pointer;
        }
        .tm-slot-wrapper.tm-has-data:hover .tm-slot-btn { background-color: #157347; }
        .tm-slot-wrapper.tm-is-pinned .tm-slot-btn { border: 2px solid #ffd700; }

        .tm-slot-controls {
            position: absolute; top: -12px; left: -4px; right: -4px;
            display: none; justify-content: space-between; pointer-events: none;
        }
        .tm-slot-wrapper.tm-has-data:hover .tm-slot-controls { display: flex; pointer-events: auto; }

        .tm-mini-ctrl {
            width: 16px; height: 16px; border-radius: 50%; border: none;
            font-size: 10px; display: flex; align-items: center; justify-content: center;
            cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.5); color: white; font-weight: bold;
        }
        .tm-ctrl-pin { background-color: #6c757d; }
        .tm-ctrl-pin:hover { background-color: #ffd700; color: #000; }
        .tm-is-pinned .tm-ctrl-pin { background-color: #ffd700; color: #000; }
        .tm-ctrl-clear { background-color: #dc3545; }
        .tm-ctrl-clear:hover { background-color: #bb2d3b; }

        /* --- TOOLTIP --- */
        .tm-slot-tooltip {
            visibility: hidden; background-color: #000; color: #fff;
            text-align: left; border-radius: 4px; padding: 8px 10px;
            position: absolute; z-index: 10000; top: 110%; left: 50%; transform: translateX(-50%);
            white-space: pre; font-size: 11px; opacity: 0; transition: opacity 0.2s;
            pointer-events: none; border: 1px solid #444; line-height: 1.4;
            box-shadow: 0 4px 8px rgba(0,0,0,0.5); min-width: 120px;
        }
        .tm-slot-wrapper.tm-has-data:hover .tm-slot-tooltip { visibility: visible; opacity: 1; }

        /* --- HELP BUTTON --- */
        #tm-help-btn {
            position: fixed; top: 10px; left: 50%; margin-left: 110px;
            z-index: 9999; width: 30px; height: 30px; border: none; border-radius: 50%;
            background-color: #6c757d; color: white; font-weight: bold; cursor: pointer;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3); transition: all 0.2s;
            display: flex; align-items: center; justify-content: center;
        }
        #tm-help-btn:hover { background-color: #5a6268; transform: scale(1.1); }

        /* --- MODAL --- */
        .tm-modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.7); z-index: 10002; display: none;
            justify-content: center; align-items: center; backdrop-filter: blur(3px);
        }
        .tm-modal-overlay.tm-show { display: flex; }
        .tm-modal-content {
            background: #2c2c2c; color: #eee; padding: 25px; border-radius: 8px;
            border: 1px solid #555; max-width: 600px; text-align: left;
            box-shadow: 0 10px 25px rgba(0,0,0,0.5); font-family: sans-serif; line-height: 1.6;
        }
        .tm-modal-content h3 { margin-top: 0; color: #ffd700; border-bottom: 1px solid #444; padding-bottom: 10px; }
        .tm-modal-content p { margin-bottom: 15px; font-size: 14px; }
        .tm-modal-close-btn {
            display: block; width: 100%; padding: 10px; background: #0d6efd; color: white; border: none;
            border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: bold; margin-top: 20px;
        }
        .tm-modal-close-btn:hover { background: #0b5ed7; }

        /* --- VISIBILITY --- */
        body.tm-enabled .tm-react-hidden { display: none !important; }
        body.tm-enabled table > thead:not(#tm-custom-thead) { display: none !important; }
        /* Hide Original Pagination */
        body.tm-enabled table > tfoot { display: none !important; }
        .tm-original-pagination-hidden { display: none !important; }

        #tm-custom-thead, #tm-custom-tbody { display: none; }

        body.tm-enabled #tm-custom-thead { display: table-header-group; }
        /* NEW: Force header on top of body rows */
        body.tm-enabled #tm-custom-thead th {
            overflow: visible !important;
            z-index: 1000 !important;
            position: relative;
        }

        body.tm-enabled #tm-custom-tbody { display: table-row-group; }
        .tm-controls-wrapper, .tm-load-more-wrapper { display: none; }
        body.tm-enabled .tm-controls-wrapper { display: flex; }
        body.tm-enabled .tm-load-more-wrapper { display: block; }

        /* --- HEADER & MENU --- */
        .tm-header-cell-flex {
            display: flex; align-items: center; justify-content: space-between;
            position: relative; gap: 25px;
        }
        .tm-menu-btn { background: none; border: 1px solid transparent; padding: 4px; border-radius: 3px; cursor: pointer; display: flex; }
        .tm-menu-btn svg { width: 14px; height: 14px; fill: #666; }
        .tm-menu-btn.tm-active-highlight svg { fill: #ffd700 !important; }
        .tm-menu-btn.tm-active-filter svg { fill: #dc3545 !important; }

        /* NEW: Ensure popup is above everything */
        .tm-popup-panel {
            display: none; position: absolute; top: 100%; left: 0; background-color: #2c2c2c;
            border: 1px solid #555; box-shadow: 0 4px 12px rgba(0,0,0,0.6);
            z-index: 10001 !important; /* Force high z-index */
            width: 220px; padding: 10px; border-radius: 4px; margin-top: 5px;
        }
        .tm-popup-panel.tm-show { display: block; }
        th:nth-child(n+8) .tm-popup-panel { left: auto; right: 0; }

        .tm-popup-controls { display: flex; align-items: center; justify-content: space-between; gap: 5px; margin-bottom: 10px; border-bottom: 1px solid #444; padding-bottom: 10px; }
        .tm-mode-switch { font-size: 10px; cursor: pointer; padding: 3px 8px; border-radius: 3px; border: 1px solid #555; background: #222; color: #888; }
        .tm-mode-switch.active { font-weight: bold; color: #000; }
        .tm-mode-highlight.active { background-color: #ffd700; border-color: #ffd700; }
        .tm-mode-filter.active { background-color: #dc3545; border-color: #dc3545; color: white; }

        .tm-dropdown-search { width: 100%; padding: 6px; padding-right: 25px; border: 1px solid #555; background: #333; color: white; border-radius: 3px; box-sizing: border-box; font-size: 12px; }
        .tm-search-wrapper { position: relative; margin-bottom: 8px; }
        .tm-search-clear { position: absolute; right: 6px; top: 50%; transform: translateY(-50%); color: #888; cursor: pointer; display: none; font-weight: bold; }

        .tm-popup-list-container { max-height: 250px; overflow-y: auto; border: 1px solid #444; border-radius: 3px; background: #222; }
        .tm-multi-controls { display: flex; justify-content: space-between; padding-bottom: 5px; margin-bottom: 5px; border-bottom: 1px solid #444; }
        .tm-mini-btn { font-size: 10px; padding: 2px 6px; cursor: pointer; background: #444; color: #ccc; border: none; border-radius: 3px; }
        .tm-multi-item { display: block; padding: 3px 5px; font-size: 12px; cursor: pointer; white-space: nowrap; color: #ddd; }
        .tm-multi-item:hover { background-color: #444; }
        .tm-item-hidden { display: none !important; }

        /* --- TABLE --- */
        body.tm-enabled tr.tm-gold-row td { background-color: #463a00 !important; border-top: 1px solid #ffd700 !important; border-bottom: 1px solid #ffd700 !important; color: #fff !important; }
        body.tm-enabled tr.tm-gold-row td:first-child { border-left: 4px solid #ffd700 !important; }

        .tm-header-label { font-weight: bold; font-size: 13px; display: block; }

        /* --- COLUMN WIDTHS (SHRINK + BUFFER) --- */
        body.tm-enabled table th:nth-child(9), body.tm-enabled table td:nth-child(9) { width: auto; text-align: right !important; }
        body.tm-enabled table th:nth-child(10), body.tm-enabled table td:nth-child(10) { width: 1px; white-space: nowrap; text-align: right !important; padding-right: 15px; }

        /* Columns 1-8 */
        body.tm-enabled table th:nth-child(-n+8),
        body.tm-enabled table td:nth-child(-n+8) {
            width: 1px !important;
            max-width: 250px !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            padding-right: 25px !important;
        }

        /* --- VISIBILITY TOGGLES --- */
        body.tm-enabled table.tm-hide-track th:nth-child(2), body.tm-enabled table.tm-hide-track td:nth-child(2) { display: none; }
        body.tm-enabled table.tm-hide-class th:nth-child(3), body.tm-enabled table.tm-hide-class td:nth-child(3) { display: none; }
        body.tm-enabled table.tm-hide-car th:nth-child(4), body.tm-enabled table.tm-hide-car td:nth-child(4) { display: none; }
        body.tm-enabled table.tm-hide-type th:nth-child(5), body.tm-enabled table.tm-hide-type td:nth-child(5) { display: none; }
        body.tm-enabled table.tm-hide-fps th:nth-child(6), body.tm-enabled table.tm-hide-fps td:nth-child(6) { display: none; }
        body.tm-enabled table.tm-hide-slip th:nth-child(7), body.tm-enabled table.tm-hide-slip td:nth-child(7) { display: none; }
        body.tm-enabled table.tm-hide-weather th:nth-child(8), body.tm-enabled table.tm-hide-weather td:nth-child(8) { display: none; }

        .tm-controls-wrapper { margin: 15px 0; flex-wrap: wrap; gap: 8px; align-items: center; background-color: #2c2c2c; padding: 10px; border-radius: 6px; border: 1px solid #444; color: #eee; }
        .tm-btn { padding: 6px 12px; cursor: pointer; border: 1px solid #444; background-color: #333; color: #ddd; border-radius: 4px; font-size: 13px; font-weight: 500; transition: all 0.2s; }
        .tm-btn.tm-active { background-color: #6c757d; color: #fff; border-color: #6c757d; }
        #tm-load-more-btn { background-color: #0d6efd; color: white; border-color: #0d6efd; padding: 10px 20px; font-size: 15px; }
        #tm-load-more-btn:disabled { background-color: #6c757d; cursor: wait; opacity: 0.8; }
        .tm-loading-active { animation: pulse 1s infinite; }
    `;
    GM_addStyle(css);

    // --- 2. STATE ---
    let customTbody = null;
    let customThead = null;
    let observer = null;
    let isAutoLoading = true;
    let loadTimeout = null;
    let masterState = true;

    let capturedTracks = new Set();

    const state = {
        modes: { player: 'highlight', class: 'filter', car: 'filter', type: 'filter', fps: 'filter', slip: 'filter', weather: 'filter', track: 'filter' },
        filters: { player: new Set(), class: new Set(), car: new Set(), type: new Set(), fps: new Set(), slip: new Set(), weather: new Set(), track: new Set() }
    };

    const knownValues = { player: new Set(), class: new Set(), car: new Set(), type: new Set(), fps: new Set(), slip: new Set(), weather: new Set(), track: new Set() };

    // --- 3. PERSISTENCE ---
    function loadGlobalMaster() {
        const saved = localStorage.getItem(GLOBAL_MASTER_KEY);
        return saved === null ? true : JSON.parse(saved);
    }
    function saveGlobalMaster(isOn) { localStorage.setItem(GLOBAL_MASTER_KEY, JSON.stringify(isOn)); }

    function formatTrackLabel(trackSet) {
        if (trackSet.size === 0) return "Unknown Track";

        const tracks = Array.from(trackSet);
        if (tracks.length <= 3) {
            return tracks.join('\n');
        } else {
            const firstThree = tracks.slice(0, 3).join('\n');
            const remaining = tracks.length - 3;
            return `${firstThree}\n+${remaining} more`;
        }
    }

    function loadTrackSettings() {
        const historyJson = localStorage.getItem(HISTORY_KEY);
        if (!historyJson) return null;
        try {
            const history = JSON.parse(historyJson);
            const currentUrl = window.location.search;
            const found = history.find(entry => entry.url === currentUrl);
            return found ? found.config : null;
        } catch(e) { return null; }
    }

    function saveTrackSettings(table) {
        if (!masterState) return;

        const activeClasses = [];
        if (table) table.classList.forEach(cls => { if (cls.startsWith('tm-')) activeClasses.push(cls); });

        const serializableFilters = {};
        for (let key in state.filters) serializableFilters[key] = Array.from(state.filters[key]);

        const currentConfig = { classes: activeClasses, modes: state.modes, filters: serializableFilters };
        const currentUrl = window.location.search;

        const trackLabel = formatTrackLabel(capturedTracks);

        let history = [];
        try { history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; } catch(e) { history = []; }

        const existingIndex = history.findIndex(e => e.url === currentUrl);
        if (existingIndex > -1) {
            history[existingIndex].config = currentConfig;
            if (trackLabel !== "Unknown Track") history[existingIndex].name = trackLabel;
            const item = history.splice(existingIndex, 1)[0];
            history.unshift(item);
        } else {
            const newItem = { url: currentUrl, name: trackLabel, config: currentConfig, pinned: false };
            if (history.length >= 5) {
                let removeIndex = -1;
                for (let i = history.length - 1; i >= 0; i--) {
                    if (!history[i].pinned) { removeIndex = i; break; }
                }
                if (removeIndex > -1) {
                    history.splice(removeIndex, 1);
                    history.unshift(newItem);
                }
            } else {
                history.unshift(newItem);
            }
        }
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        renderHistoryBar();
    }

    function togglePin(index) {
        let history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
        if (history[index]) {
            history[index].pinned = !history[index].pinned;
            localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
            renderHistoryBar();
        }
    }

    function removeHistoryItem(index) {
        let history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
        if (history[index]) {
            history.splice(index, 1);
            localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
            renderHistoryBar();
        }
    }

    // --- 4. UI ---
    function renderHistoryBar() {
        const old = document.getElementById('tm-history-bar');
        if (old) old.remove();

        const bar = document.createElement('div');
        bar.id = 'tm-history-bar';

        let history = [];
        try { history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; } catch(e) { }

        for (let i = 0; i < 5; i++) {
            const data = history[i];
            const wrapper = document.createElement('div');
            wrapper.className = 'tm-slot-wrapper';
            if (data) {
                wrapper.classList.add('tm-has-data');
                if (data.pinned) wrapper.classList.add('tm-is-pinned');
            }

            const btn = document.createElement('button');
            btn.className = 'tm-slot-btn';
            btn.innerText = i + 1;
            if (data) {
                btn.onclick = () => {
                    if (window.location.search !== data.url) window.location.search = data.url;
                };
            }
            wrapper.appendChild(btn);

            if (data) {
                const tip = document.createElement('div');
                tip.className = 'tm-slot-tooltip';
                tip.innerText = data.name || "Unknown Track";
                wrapper.appendChild(tip);

                const ctrls = document.createElement('div');
                ctrls.className = 'tm-slot-controls';

                const pinBtn = document.createElement('button');
                pinBtn.className = 'tm-mini-ctrl tm-ctrl-pin';
                pinBtn.innerHTML = '📍';
                pinBtn.onclick = (e) => { e.stopPropagation(); togglePin(i); };

                const clearBtn = document.createElement('button');
                clearBtn.className = 'tm-mini-ctrl tm-ctrl-clear';
                clearBtn.innerHTML = '×';
                clearBtn.onclick = (e) => { e.stopPropagation(); removeHistoryItem(i); };

                ctrls.appendChild(pinBtn);
                ctrls.appendChild(clearBtn);
                wrapper.appendChild(ctrls);
            }
            bar.appendChild(wrapper);
        }
        document.body.appendChild(bar);
    }

    // --- 5. INITIALIZATION ---
    function initUI() {
        if (document.getElementById('tm-master-toggle')) return;
        createHelpUI();
        createMasterToggle();
        renderHistoryBar();

        masterState = loadGlobalMaster();
        if (masterState) {
            document.body.classList.add('tm-enabled');
            waitForData();
        }

        if (!localStorage.getItem(WELCOME_KEY)) {
            document.getElementById('tm-help-modal').classList.add('tm-show');
            localStorage.setItem(WELCOME_KEY, 'true');
        }
    }

    function waitForData() {
        const table = document.querySelector('table');
        const realTbody = document.querySelector('table tbody:not(#tm-custom-tbody)');

        if (!table || !realTbody || realTbody.rows.length === 0) {
            return setTimeout(waitForData, 200);
        }
        const text = realTbody.rows[0].textContent.toLowerCase();
        if (text.includes('loading')) {
            return setTimeout(waitForData, 200);
        }

        startTableLogic(table, realTbody);
    }

    function hideOriginalPagination() {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(btn => {
            const txt = (btn.innerText || "").toLowerCase().trim();
            if (txt === "next" || txt === "next »" || txt === "previous" || txt === "« previous") {
                if (btn.id !== 'tm-load-more-btn' && btn.id !== 'tm-master-toggle') {
                    btn.classList.add('tm-original-pagination-hidden');
                }
            }
        });
    }

    function startTableLogic(table, realTbody) {
        hideOriginalPagination();

        const savedConfig = loadTrackSettings();
        if (savedConfig) {
            if (savedConfig.classes) savedConfig.classes.forEach(cls => table.classList.add(cls));
            if (savedConfig.modes) state.modes = savedConfig.modes;
            if (savedConfig.filters) {
                for (let k in savedConfig.filters) state.filters[k] = new Set(savedConfig.filters[k]);
            }
        } else {
            table.classList.add('tm-hide-track', 'tm-hide-class', 'tm-hide-type', 'tm-hide-fps', 'tm-hide-slip', 'tm-hide-weather');
        }

        realTbody.classList.add('tm-react-hidden');

        if (customThead) customThead.remove();
        if (customTbody) customTbody.remove();

        customThead = table.querySelector('thead').cloneNode(true);
        customThead.id = 'tm-custom-thead';
        const headerRow = customThead.querySelector('tr');
        if (headerRow) {
            reorderCells(headerRow);
            injectCustomHeaders(headerRow);
        }
        if (table.firstChild) table.insertBefore(customThead, table.firstChild);
        else table.appendChild(customThead);

        customTbody = document.createElement('tbody');
        customTbody.id = 'tm-custom-tbody';
        table.appendChild(customTbody);

        setupControls(table);
        copyRows(realTbody);

        // Hide Original only AFTER build
        realTbody.classList.add('tm-react-hidden');

        saveTrackSettings(table);

        observer = new MutationObserver((mutations) => {
            if (observer.timeout) clearTimeout(observer.timeout);
            observer.timeout = setTimeout(() => { copyRows(realTbody, true); }, 50);
        });
        observer.observe(realTbody, { childList: true, subtree: true });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.tm-popup-panel') && !e.target.closest('.tm-header-cell-flex')) {
                document.querySelectorAll('.tm-popup-panel').forEach(el => el.classList.remove('tm-show'));
            }
            if (e.target.closest('.tm-modal-overlay') && !e.target.closest('.tm-modal-content')) {
                document.getElementById('tm-help-modal').classList.remove('tm-show');
            }
        });

        setTimeout(triggerNextPage, 500);
    }

    // --- LOGIC ---
    function reorderCells(row) {
        if (!row || row.cells.length < 10) return;
        const dateCell = row.cells[5];
        const timeCell = row.cells[9];
        if (dateCell && timeCell) row.insertBefore(dateCell, timeCell);
    }

    function injectCustomHeaders(row) {
        const replaceCell = (index, label, key) => {
            if (!row.cells[index]) return;
            row.cells[index].innerHTML = '';
            const flexDiv = document.createElement('div');
            flexDiv.className = 'tm-header-cell-flex';
            const labelSpan = document.createElement('span');
            labelSpan.className = 'tm-header-label';
            labelSpan.innerText = label;
            flexDiv.appendChild(labelSpan);
            createAdvancedMenu(flexDiv, key);
            row.cells[index].appendChild(flexDiv);
        };
        replaceCell(0, 'Player / Rank', 'player');
        replaceCell(1, 'Track', 'track');
        replaceCell(2, 'Class', 'class');
        replaceCell(3, 'Car', 'car');
        replaceCell(4, 'Type', 'type');
        replaceCell(5, '60FPS', 'fps');
        replaceCell(6, 'Slipstream', 'slip');
        replaceCell(7, 'Weather', 'weather');
    }

    function createAdvancedMenu(container, key) {
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'tm-menu-btn';
        toggleBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/></svg>`;
        toggleBtn.id = `tm-icon-${key}`;
        updateIconState(key);
        toggleBtn.onclick = (e) => {
            e.stopPropagation();
            document.querySelectorAll('.tm-popup-panel').forEach(el => {
                if (el.id !== `tm-panel-${key}`) el.classList.remove('tm-show');
            });
            const panel = document.getElementById(`tm-panel-${key}`);
            panel.classList.toggle('tm-show');
        };
        container.appendChild(toggleBtn);

        const panel = document.createElement('div');
        panel.id = `tm-panel-${key}`;
        panel.className = 'tm-popup-panel';
        panel.onclick = (e) => e.stopPropagation();

        const controlRow = document.createElement('div');
        controlRow.className = 'tm-popup-controls';

        const label = document.createElement('span');
        label.className = 'tm-mode-label';
        label.innerText = 'MODE:';

        const btnHighlight = document.createElement('span');
        btnHighlight.className = 'tm-mode-switch tm-mode-highlight';
        btnHighlight.innerText = 'Highlight';
        const btnFilter = document.createElement('span');
        btnFilter.className = 'tm-mode-switch tm-mode-filter';
        btnFilter.innerText = 'Filter';

        const updateModeUI = () => {
            if (state.modes[key] === 'highlight') {
                btnHighlight.classList.add('active');
                btnFilter.classList.remove('active');
            } else {
                btnHighlight.classList.remove('active');
                btnFilter.classList.add('active');
            }
        };
        updateModeUI();

        btnHighlight.onclick = () => {
            state.modes[key] = 'highlight'; updateModeUI(); applyFilters(); updateIconState(key);
            saveTrackSettings(document.querySelector('table'));
        };
        btnFilter.onclick = () => {
            state.modes[key] = 'filter'; updateModeUI(); applyFilters(); updateIconState(key);
            saveTrackSettings(document.querySelector('table'));
        };

        controlRow.appendChild(label);
        controlRow.appendChild(btnHighlight);
        controlRow.appendChild(btnFilter);
        panel.appendChild(controlRow);

        const searchWrapper = document.createElement('div');
        searchWrapper.className = 'tm-search-wrapper';
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.className = 'tm-dropdown-search';
        searchInput.placeholder = 'Search...';
        const clearSearchBtn = document.createElement('span');
        clearSearchBtn.className = 'tm-search-clear';
        clearSearchBtn.innerHTML = '×';
        searchWrapper.appendChild(searchInput);
        searchWrapper.appendChild(clearSearchBtn);

        const listContainer = document.createElement('div');
        listContainer.className = 'tm-popup-list-container';
        listContainer.id = `tm-list-${key}`;

        const performSearch = () => {
            const term = searchInput.value.toLowerCase();
            if (term.length > 0) clearSearchBtn.style.display = 'block';
            else clearSearchBtn.style.display = 'none';
            const items = listContainer.querySelectorAll('.tm-multi-item');
            items.forEach(item => {
                const text = item.innerText.toLowerCase();
                if (text.includes(term)) item.classList.remove('tm-item-hidden');
                else item.classList.add('tm-item-hidden');
            });
        };
        searchInput.onkeyup = performSearch;
        clearSearchBtn.onclick = () => { searchInput.value = ''; performSearch(); };

        const btnRow = document.createElement('div');
        btnRow.className = 'tm-multi-controls';

        const btnAll = document.createElement('button');
        btnAll.className = 'tm-mini-btn';
        btnAll.innerText = 'Select All';
        btnAll.onclick = () => {
            const inputs = listContainer.querySelectorAll('.tm-multi-item:not(.tm-item-hidden) input');
            inputs.forEach(inp => { inp.checked = true; state.filters[key].add(inp.value); });
            applyFilters(); updateIconState(key); saveTrackSettings(document.querySelector('table'));
        };

        const btnClear = document.createElement('button');
        btnClear.className = 'tm-mini-btn';
        btnClear.innerText = 'Clear';
        btnClear.onclick = () => {
            const inputs = listContainer.querySelectorAll('.tm-multi-item:not(.tm-item-hidden) input');
            inputs.forEach(inp => { inp.checked = false; state.filters[key].delete(inp.value); });
            applyFilters(); updateIconState(key); saveTrackSettings(document.querySelector('table'));
        };

        btnRow.appendChild(btnAll);
        btnRow.appendChild(btnClear);
        panel.appendChild(searchWrapper);
        panel.appendChild(btnRow);
        panel.appendChild(listContainer);
        container.appendChild(panel);
    }

    function updateListUI(key) {
        const list = document.getElementById(`tm-list-${key}`);
        if (!list) return;
        const sorted = Array.from(knownValues[key]).sort();
        list.innerHTML = '';
        sorted.forEach(val => {
            const label = document.createElement('label');
            label.className = 'tm-multi-item';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = val;
            checkbox.checked = state.filters[key].has(val);
            checkbox.onchange = () => {
                if (checkbox.checked) state.filters[key].add(val);
                else state.filters[key].delete(val);
                applyFilters(); updateIconState(key); saveTrackSettings(document.querySelector('table'));
            };
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(val));
            list.appendChild(label);
        });
        updateIconState(key);
    }

    function updateIconState(key) {
        const btn = document.getElementById(`tm-icon-${key}`);
        if (!btn) return;
        const selectedCount = state.filters[key].size;
        btn.classList.remove('tm-active-highlight');
        btn.classList.remove('tm-active-filter');
        if (selectedCount > 0) {
            if (state.modes[key] === 'highlight') btn.classList.add('tm-active-highlight');
            else btn.classList.add('tm-active-filter');
        }
    }

    function applyFilters() {
        const rows = customTbody.querySelectorAll('tr');
        rows.forEach(row => {
            const values = {
                player: row.cells[0].textContent.trim(),
                track: row.cells[1].textContent.trim(),
                class: row.cells[2].textContent.trim(),
                car: row.cells[3].textContent.trim(), type: row.cells[4].textContent.trim(),
                fps: row.cells[5].textContent.trim(), slip: row.cells[6].textContent.trim(), weather: row.cells[7].textContent.trim()
            };
            let isVisible = true;
            let isHighlighted = false;
            for (let key in state.filters) {
                const filterSet = state.filters[key];
                if (filterSet.size === 0) continue;
                const val = values[key];
                const match = filterSet.has(val);
                if (state.modes[key] === 'filter') { if (!match) isVisible = false; }
                else if (state.modes[key] === 'highlight') { if (match) isHighlighted = true; }
            }
            row.classList.remove('tm-gold-row');
            if (isVisible && isHighlighted) row.classList.add('tm-gold-row');
            row.style.display = isVisible ? '' : 'none';
        });
    }

    function copyRows(sourceTbody, isAppend = false) {
        if (!masterState) return;

        hideOriginalPagination();

        if (loadTimeout) { clearTimeout(loadTimeout); loadTimeout = null; }
        if (!isAppend) {
            customTbody.innerHTML = '';
            for (let k in knownValues) knownValues[k].clear();
            capturedTracks.clear();
        }

        const sourceRows = sourceTbody.querySelectorAll('tr');
        let hasValidData = false;

        sourceRows.forEach(row => {
            const text = row.textContent.toLowerCase();
            if (text.includes('no results') || text.includes('loading')) return;
            if (row.cells.length < 3) return;

            try {
                // --- CAPTURE TRACK NAME ---
                const trackVal = row.cells[1].textContent.trim();
                if (trackVal && trackVal.length > 2) {
                    capturedTracks.add(trackVal);
                    hasValidData = true; // Mark that we found real data
                }

                const newRow = row.cloneNode(true);
                reorderCells(newRow);

                const extract = (idx, key) => {
                    if (newRow.cells[idx]) knownValues[key].add(newRow.cells[idx].textContent.trim());
                };

                extract(0, 'player');
                extract(1, 'track');
                extract(2, 'class');
                extract(3, 'car');
                extract(4, 'type');
                extract(5, 'fps');
                extract(6, 'slip');
                extract(7, 'weather');

                customTbody.appendChild(newRow);
            } catch (err) {
                console.warn("Skipping malformed row", err);
            }
        });

        // Only save if we actually found new valid data to avoid "Unknown" overwrite
        if (hasValidData || isAppend) {
            saveTrackSettings(document.querySelector('table'));
        }

        ['player', 'track', 'class', 'car', 'type', 'fps', 'slip', 'weather'].forEach(updateListUI);
        applyFilters();
        const btn = document.getElementById('tm-load-more-btn');
        if (btn) {
            if (isAutoLoading && masterState) {
                btn.innerText = `Auto-Fetching... (${customTbody.rows.length} rows)`;
                btn.classList.add('tm-loading-active');
                btn.disabled = true;
                triggerNextPage();
            } else {
                btn.innerText = 'Load More Records';
                btn.classList.remove('tm-loading-active');
                btn.disabled = false;
            }
        }
    }

    function createMasterToggle() {
        const btn = document.createElement('button');
        btn.id = 'tm-master-toggle';
        updateMasterBtn(btn);
        btn.onclick = () => {
            masterState = !masterState;
            saveGlobalMaster(masterState);
            if (masterState) {
                window.location.reload();
            } else {
                document.body.classList.remove('tm-enabled');
                updateMasterBtn(btn);
                isAutoLoading = false;
            }
        };
        document.body.appendChild(btn);
    }
    function updateMasterBtn(btn) {
        if (masterState) { btn.innerHTML = 'Script: ON'; btn.className = 'tm-is-active'; }
        else { btn.innerHTML = 'Script: OFF'; btn.className = 'tm-is-inactive'; }
    }

    function createHelpUI() {
        const helpBtn = document.createElement('button');
        helpBtn.id = 'tm-help-btn';
        helpBtn.innerText = '?';
        helpBtn.onclick = () => document.getElementById('tm-help-modal').classList.add('tm-show');
        document.body.appendChild(helpBtn);

        const overlay = document.createElement('div');
        overlay.id = 'tm-help-modal';
        overlay.className = 'tm-modal-overlay';

        const content = document.createElement('div');
        content.className = 'tm-modal-content';
        content.innerHTML = `
            <h3>How to use this Leaderboard Tool</h3>
            <p>This script enhances the leaderboard with filters, history, and comparison tools.</p>
            <p><b>Important:</b> To change the track or car class (raw data), you must <b>toggle the script OFF</b>, adjust the website filters, and then <b>toggle ON</b> again. The page will reload to capture the new data.</p>
            <p><b>Top Bar:</b> The numbered buttons (1-5) save your recent leaderboards. Hover to see the track name. Click the Pin (📍) to keep a save forever.</p>
            <p><b>Filters:</b> Click the filter icon on any column header to Highlight or Filter specific cars/players.</p>
        `;
        const closeBtn = document.createElement('button');
        closeBtn.className = 'tm-modal-close-btn';
        closeBtn.innerText = 'Understood';
        closeBtn.onclick = () => overlay.classList.remove('tm-show');

        content.appendChild(closeBtn);
        overlay.appendChild(content);
        document.body.appendChild(overlay);
    }

    function setupControls(table) {
        const wrapper = document.createElement('div');
        wrapper.className = 'tm-controls-wrapper';
        table.parentNode.insertBefore(wrapper, table);
        function createToggle(label, cssClass) {
            const btn = document.createElement('button');
            btn.className = 'tm-btn';
            const updateText = () => {
                const isActive = table.classList.contains(cssClass);
                if (cssClass.includes('shrink')) btn.innerText = isActive ? `Expand ${label}` : `Shrink ${label}`;
                else btn.innerText = isActive ? `Show ${label}` : `Hide ${label}`;
                if (isActive) btn.classList.add('tm-active');
                else btn.classList.remove('tm-active');
            };
            btn.onclick = () => { table.classList.toggle(cssClass); updateText(); saveTrackSettings(table); };
            updateText();
            wrapper.appendChild(btn);
        }
        createToggle('Track', 'tm-hide-track');
        createToggle('Class', 'tm-hide-class');
        createToggle('Car', 'tm-hide-car');
        createToggle('Type', 'tm-hide-type');
        createToggle('60FPS', 'tm-hide-fps');
        createToggle('Slipstream', 'tm-hide-slip');
        createToggle('Weather', 'tm-hide-weather');

        const bottomDiv = document.createElement('div');
        bottomDiv.className = 'tm-load-more-wrapper';
        bottomDiv.style.textAlign = 'center';
        bottomDiv.style.marginTop = '20px';
        const loadMoreBtn = document.createElement('button');
        loadMoreBtn.id = 'tm-load-more-btn';
        loadMoreBtn.className = 'tm-btn';
        loadMoreBtn.innerText = 'Initializing...';
        loadMoreBtn.onclick = () => { isAutoLoading = true; triggerNextPage(); };
        bottomDiv.appendChild(loadMoreBtn);
        table.parentNode.appendChild(bottomDiv);
    }

    function triggerNextPage() {
        if (!masterState || !isAutoLoading) return;
        const buttons = document.querySelectorAll('button');
        let realNextBtn = null;
        for (let btn of buttons) {
            if (btn.id === 'tm-load-more-btn' || btn.classList.contains('tm-btn') || btn.id === 'tm-master-toggle') continue;
            const text = (btn.innerText || btn.textContent).trim();
            if (text === 'Next' || text === 'Next »' || text.includes('Next')) { realNextBtn = btn; break; }
        }
        const myBtn = document.getElementById('tm-load-more-btn');
        if (realNextBtn) {
            loadTimeout = setTimeout(() => {
                console.log("Tampermonkey: Auto-load timed out.");
                isAutoLoading = false;
                if (myBtn) { myBtn.innerText = "Done (Finished / Slow)"; myBtn.classList.remove('tm-loading-active'); myBtn.disabled = false; }
            }, 1000);
            realNextBtn.click();
        } else {
            isAutoLoading = false;
            if (myBtn) { myBtn.innerText = "All Records Loaded"; myBtn.classList.remove('tm-loading-active'); myBtn.disabled = true; }
        }
    }

    window.addEventListener('load', initUI);
})();