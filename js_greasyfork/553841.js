// ==UserScript==
// @name         Sportlogiq: Hotkey manager
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  HotKey Manager для управління гарячими клавішами
// @author       Volodymyr Kerdiak
// @match        https://app.sportlogiq.com/EventorApp.php*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553841/Sportlogiq%3A%20Hotkey%20manager.user.js
// @updateURL https://update.greasyfork.org/scripts/553841/Sportlogiq%3A%20Hotkey%20manager.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function injectPageScript() {
        if (window.HKM_INJECTED) return;
        window.HKM_INJECTED = true;
        const actualCode = `
(function() {
'use strict';
if (window.hkmInjectedListener) return;
window.hkmInjectedListener = true;

const SvgVerticalSnap = {
            svgElement: null, markerElement: null, isInitialized: false, isSnapActive: false,
            hasMouseEnteredSvg: false, snapLinesX: [150, 252, 201], lockedX: 0,
            lastMousePos: {x: 0, y: 0}, _boundOnMouseMove: null,

            init: function (svgEl, markerEl) {
                if (this.isInitialized) return;
                this.svgElement = svgEl;
                this.markerElement = markerEl;
                this._boundOnMouseMove = this.onMouseMove.bind(this);
                this.isInitialized = true;
            },
            enable: function () {
                if (!this.isInitialized) return;
                this.svgElement.addEventListener('mousemove', this._boundOnMouseMove);
            },
            disable: function () {
                if (!this.isInitialized) return;
                this.svgElement.removeEventListener('mousemove', this._boundOnMouseMove);
                if (this.isSnapActive) { this.svgElement.style.cursor = 'default'; this.isSnapActive = false; }
            },
            getMousePosition: function (evt) {
                const CTM = this.svgElement.getScreenCTM();
                if (!CTM) return {x: 0, y: 0};
                return {x: (evt.clientX - CTM.e) / CTM.a, y: (evt.clientY - CTM.f) / CTM.d};
            },
            findClosestLineX: function (currentX) {
                return this.snapLinesX.reduce((prev, curr) => (Math.abs(curr - currentX) < Math.abs(prev - currentX) ? curr : prev));
            },
            onMouseMove: function (event) {
                if (!this.hasMouseEnteredSvg) this.hasMouseEnteredSvg = true;
                this.lastMousePos = this.getMousePosition(event);
                if (this.isSnapActive) {
                    this.markerElement.setAttribute('transform', \`translate(\${this.lockedX}, \${this.lastMousePos.y})\`);
                }
            },
            activate: function () {
                if (!this.isInitialized || this.isSnapActive || !this.hasMouseEnteredSvg) return;
                this.isSnapActive = true;
                this.lockedX = this.findClosestLineX(this.lastMousePos.x);
                this.markerElement.style.display = '';
                this.markerElement.setAttribute('transform', \`translate(\${this.lockedX}, \${this.lastMousePos.y})\`);
                this.svgElement.style.cursor = 'ns-resize';
            },
            deactivateAndSimulateClick: function () {
                if (!this.isInitialized || !this.isSnapActive) return;
                const svgPoint = {x: this.lockedX, y: this.lastMousePos.y};
                const CTM = this.svgElement.getScreenCTM();
                if (CTM) {
                    const clientX = svgPoint.x * CTM.a + CTM.e;
                    const clientY = svgPoint.y * CTM.d + CTM.f;
                    this.svgElement.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, clientX, clientY }));
                }
                window.postMessage({ type: "FROM_EXT_ACTION_EXECUTE", payload: {actionId: 'carry/nz/none/successful'} }, window.location.origin);
                this.isSnapActive = false;
                this.svgElement.style.cursor = 'default';
            }
        };

        window.addEventListener('message', (event) => {
            if (event.source !== window || !event.data.type || !event.data.type.startsWith("FROM_EXT_")) return;
            const { type, payload } = event.data;
            switch(type) {
                case "FROM_EXT_ACTION_EXECUTE":
                    if (payload && payload.actionId && typeof triggerGameAction === 'function') {
                        triggerGameAction(payload.actionId);
                    }
                    break;
                case "FROM_EXT_SNAP_SETTINGS":
                    if(payload.enabled) SvgVerticalSnap.enable(); else SvgVerticalSnap.disable();
                    break;
                case "FROM_EXT_SNAP_ACTIVATE":
                    SvgVerticalSnap.activate();
                    break;
                case "FROM_EXT_SNAP_DEACTIVATE":
                    SvgVerticalSnap.deactivateAndSimulateClick();
                    break;
                case "FROM_EXT_GET_SNAP_SETTINGS":
                    window.postMessage({ type: "FROM_INJECTED_SNAP_SETTINGS_REQUEST" }, window.location.origin);
                    break;
            }
        });

        const triggerGameAction = function(actionId) {
            if (actionId === 'toggle-edit-mode') {
                if (typeof playerEventEditor !== 'undefined') {
                    if (playerEventEditor.editMode) playerEventEditor.startExitEditMode();
                    else if (playerEventEditor.getSelectedEvent()) playerEventEditor.checkIfUserCanEnterEditMode();
                } return;
            }
            const el = document.getElementById(actionId);
            if (!el) { return; }
            if (el.classList.contains('toggle')) { const classList = el.className.baseVal.split(' '); const toggleClass = classList.find(c => c !== 'toggle' && c !== 'active'); if (toggleClass && typeof currentEvent !== 'undefined' && typeof currentEvent.toggleType === 'function') { currentEvent.toggleType(toggleClass); } return; }
            if (el.classList.contains('flag')) { const classList = el.className.baseVal.split(' '); const toggleClass = classList.find(c => c !== 'flag' && c !== 'active'); if (toggleClass && typeof currentEvent !== 'undefined' && typeof currentEvent.toggleType === 'function') { currentEvent.toggleType(toggleClass); el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })); } return; }
            if (typeof playerEventModel !== 'undefined' && typeof playerEventModel.addPlayerEvent === 'function') { const activeFlags = []; document.querySelectorAll('.flag.active, .toggle.active').forEach(activeEl => { const propsString = activeEl.getAttribute('data-event-props'); if (propsString) { try { const props = JSON.parse(propsString); const flagName = props.flag || (activeEl.className.baseVal.split(' ').find(c => c !== 'toggle' && c !== 'flag' && c !== 'active')); if (flagName) activeFlags.push(flagName); } catch(e) {} } }); const eventPropsString = el.getAttribute('data-event-props'); if (eventPropsString) { try { const eventProps = JSON.parse(eventPropsString); playerEventModel.addPlayerEvent({ ...eventProps, flags: activeFlags }, true); setTimeout(() => { document.querySelectorAll('.toggle.active, .flag.active').forEach(activeEl => { const classList = activeEl.className.baseVal.split(' '); const toggleClass = classList.find(c => c !== 'toggle' && c !== 'flag' && c !== 'active'); if (toggleClass && typeof currentEvent !== 'undefined' && typeof currentEvent.toggleType === 'function') currentEvent.toggleType(toggleClass); }); }, 100); } catch(e) {} } }
        };

        const initSnapInterval = setInterval(() => {
            const svgEl = document.getElementById('Layer_1');
            const markerEl = document.getElementById('current-xy-marker');
            if(svgEl && markerEl) {
                clearInterval(initSnapInterval);
                SvgVerticalSnap.init(svgEl, markerEl);
                window.postMessage({ type: "FROM_EXT_GET_SNAP_SETTINGS" }, window.location.origin);
            }
        }, 500);
    })();
`;
        const script = document.createElement('script');
        script.textContent = actualCode;
        (document.head || document.documentElement).appendChild(script);
        script.remove();

    }

    const GM_Store = {
        get: (key, def = null) => {
            try {
                const v = GM_getValue(key, def);
                return typeof v === 'string' && (v.startsWith('{') || v.startsWith('[')) ? JSON.parse(v) : v;
            } catch (e) {
                return GM_getValue(key, def);
            }
        },
        set: (key, val) => {
            GM_setValue(key, typeof val === 'object' ? JSON.stringify(val) : val);
        },
        listValues: () => GM_listValues(),
        deleteValue: (key) => GM_setValue(key, null),
        getAllHotkeys: function () {
            const hotkeys = {};
            for (const key of this.listValues()) {
                if (key.endsWith('Hotkeys')) {
                    const catHks = this.get(key, []);
                    if (Array.isArray(catHks)) catHks.forEach(item => {
                        if (item.shortcut) hotkeys[item.shortcut] = item.actionId;
                    });
                }
            }
            return hotkeys;
        },
    };

    const categoryData = {
        'blocks-checks': [{
            id: 'block/none/pass/successful',
            name: 'Successful blocked pass'
        }, {id: 'block/none/pass/failed', name: 'Failed blocked pass'}, {
            id: 'receptionprevention/nz/none/successful',
            name: 'Reception prevention'
        }, {id: 'block/oz/blueline/successful', name: 'Successful blue-line hold'}, {
            id: 'block/oz/blueline/failed',
            name: 'Failed blue-line hold'
        }, {id: 'check/none/stick/successful', name: 'Successful stick-check'}, {
            id: 'check/none/body/successful',
            name: 'Successful body-check'
        }, {
            id: 'controlledentryagainst/dz/none/undetermined',
            name: 'Controlled entry against '
        }, {id: 'dumpinagainst/dz/none/undetermined', name: 'Dump-in against '}, {
            id: 'block/dz/shot/successful',
            name: 'Successful blocked shot'
        }, {id: 'block/dz/shot/failed', name: 'Failed blocked shot'}, {
            id: 'pressure/dz/shot/undetermined',
            name: 'Shot pressure',
            defaultShortcut: 'G'
        }],
        'lprs': [{
            id: 'lpr/none/none/successful',
            name: 'Successful loose puck recovery',
            defaultShortcut: 'A'
        }, {id: 'lpr/none/none/failed', name: 'Failed loose puck recovery', defaultShortcut: 'Q'}, {
            id: 'Contested_LPR',
            name: 'Contested LPR',
            defaultShortcut: 'Z'
        }, {
            id: 'lpr/none/faceoff/successful',
            name: 'Loose puck recovery after face-off'
        }, {
            id: 'lpr/dz/nofore/successful',
            name: 'Loose puck recovery without opposition forecheck'
        }, {
            id: 'lpr/dz/hipresopdump/successful',
            name: 'Successful loose puck recovery after a high pressure opposition dump-in'
        }, {
            id: 'lpr/dz/hipresopdump/failed',
            name: 'Failed loose puck recovery after a high pressure opposition dump-in'
        }],
        'carries-dumps': [{id: 'icing/dz/none/failed', name: 'Icing'}, {
            id: 'Straight_Dump-In',
            name: 'Straight dump-in'
        }, {id: 'Cross-Ice_Dump-In', name: 'Cross-ice dump-in'}, {
            id: 'dumpin/nz/chip/successful',
            name: 'Successful chip-in to the offensive zone'
        }, {
            id: 'dumpin/nz/dump/successful',
            name: 'Successful dump-in to the offensive zone'
        }, {id: 'dumpin/nz/dump/failed', name: 'Failed dump-in'}, {
            id: 'dumpin/nz/chip/failed',
            name: 'Failed chip-in'
        }, {id: 'Soft_Dump-In', name: 'Soft dump-in'}, {
            id: 'offside/nz/none/failed',
            name: 'Offside caused'
        }, {
            id: 'carry/nz/none/successful',
            name: 'Line carry',
            defaultShortcut: 'W'
        }, {
            id: 'dumpout/dz/boards/successful',
            name: 'Successful dump-out off the board'
        }, {id: 'dumpout/dz/flip/successful', name: 'Successful flip out'}, {
            id: 'dumpout/dz/ice/successful',
            name: 'Successful dump-out through center ice'
        }, {id: 'dumpout/dz/ice/failed', name: 'Failed dump-out through center ice'}, {
            id: 'dumpout/dz/flip/failed',
            name: 'Failed flip out'
        }, {
            id: 'dumpout/dz/boards/failed',
            name: 'Failed dump-out off the board'
        }, {id: 'controlledbreakout/dz/none/undetermined', name: 'Controlled breakout'}],
        'passes': [{
            id: 'Pass_off-boards_(high)',
            name: 'Pass off boards',
            defaultShortcut: 'X'
        }, {id: 'pass/nz/none/undetermined', name: 'Pass', defaultShortcut: 'S'}, {
            id: 'reception/nz/none/successful',
            name: 'Successful pass reception',
            defaultShortcut: 'D'
        }, {
            id: 'failedpasslocation/oz/none/failed',
            name: 'Failed pass trajectory location',
            defaultShortcut: 'E'
        }, {id: 'reception/nz/none/failed', name: 'Missed pass reception'}, {
            id: 'OZ_W-E_Pass_Off-Boards',
            name: 'OZ east-west pass off boards'
        }, {id: 'pass/dz/outlet/undetermined', name: 'Outlet pass'}],
        'shots-puck-protection': [{
            id: 'puckprotection/oz/deke/successful',
            name: 'Successful open-ice deke in the offensive zone'
        }, {
            id: 'puckprotection/oz/deke/failed',
            name: 'Failed open-ice deke in the offensive zone'
        }, {
            id: 'puckprotection/oz/body/successful',
            name: 'Successful puck protection in the offensive zone'
        }, {id: 'puckprotection/oz/body/failed', name: 'Failed puck protection in the offensive zone'}],
        'other': [{
            id: 'carry-line-snap-toggle',
            name: 'Enable Vertical Line Snapping',
            type: 'toggle'
        }, {id: 'toggle-edit-mode', name: 'Toggle Edit Mode', defaultShortcut: 'M'}, {
            id: 'find-event-by-clipboard',
            name: 'Find Event by Copied Timestamp',
            defaultShortcut: 'Control + F'
        }, {id: 'delete-selected-player', name: 'Delete Selected Player Event', defaultShortcut: 'Delete'}]
    };

    const HotkeyManager = {
        hotkeyMap: new Map(),
        activeHotkeyActionId: null,
        settings: {},
        CARRY_LINE_ACTION_ID: 'carry/nz/none/successful',
        FIND_EVENT_ACTION_ID: 'find-event-by-clipboard',
        DELETE_SELECTED_PLAYER_ACTION_ID: 'delete-selected-player',

        init: function () {
            this.loadSettings();
            window.addEventListener('keydown', this.onKeyDown.bind(this), true);
            window.addEventListener('keyup', this.onKeyUp.bind(this), true);
            window.addEventListener('message', (event) => {
                if (event.data.type === "FROM_INJECTED_SNAP_SETTINGS_REQUEST") {
                    this.sendSnapSettings();
                }
            });
        },

        sendSnapSettings: function () {
            window.postMessage({
                type: "FROM_EXT_SNAP_SETTINGS",
                payload: {enabled: !!this.settings.carryLineSnapEnabled}
            }, window.location.origin);
        },

        loadSettings: function () {
            this.settings = {
                hotkeys: GM_Store.getAllHotkeys(),
                carryLineSnapEnabled: GM_Store.get('carryLineSnapEnabled', false)
            };
            this.hotkeyMap.clear();
            if (this.settings.hotkeys) {
                for (const shortcut in this.settings.hotkeys) {
                    this.hotkeyMap.set(shortcut, this.settings.hotkeys[shortcut]);
                }
            }
            this.sendSnapSettings();
        },

        formatShortcutFromEvent: function (e) {
            const parts = [];
            if (e.ctrlKey) parts.push('Control');
            if (e.shiftKey) parts.push('Shift');
            if (e.altKey) parts.push('Alt');
            if (e.metaKey) parts.push('Meta');
            let primary = (e.code && e.code.startsWith('Key')) ? e.code.slice(3) : (e.code && e.code.startsWith('Digit')) ? e.code.slice(5) : e.key.length === 1 ? e.key.toUpperCase() : e.key;
            if (primary && !parts.includes(primary)) parts.push(primary);
            return parts.join(' + ');
        },

        onKeyDown: function (event) {
            if (document.getElementById('hkm-settings-overlay')) return;
            if (event.repeat || this.activeHotkeyActionId) return;
            const target = event.target;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;
            const shortcut = this.formatShortcutFromEvent(event);
            if (!this.hotkeyMap.has(shortcut)) return;

            const actionId = this.hotkeyMap.get(shortcut);

            event.preventDefault();
            event.stopImmediatePropagation();

            if (actionId === this.FIND_EVENT_ACTION_ID) {
                this.triggerFindByClipboard();
            } else if (actionId === this.DELETE_SELECTED_PLAYER_ACTION_ID) {
                this.triggerDeleteSelectedPlayerEvent();
            } else if (actionId === this.CARRY_LINE_ACTION_ID && this.settings.carryLineSnapEnabled) {
                this.activeHotkeyActionId = actionId;
                window.postMessage({type: "FROM_EXT_SNAP_ACTIVATE"}, window.location.origin);
            } else {
                window.postMessage({type: "FROM_EXT_ACTION_EXECUTE", payload: {actionId}}, window.location.origin);
            }
        },

        onKeyUp: function (event) {
            if (!this.activeHotkeyActionId) return;
            const shortcut = this.formatShortcutFromEvent(event);
            if (this.hotkeyMap.get(shortcut) !== this.activeHotkeyActionId) return;

            event.preventDefault();
            event.stopImmediatePropagation();

            if (this.activeHotkeyActionId === this.CARRY_LINE_ACTION_ID) {
                window.postMessage({type: "FROM_EXT_SNAP_DEACTIVATE"}, window.location.origin);
            }
            this.activeHotkeyActionId = null;
        },

        triggerFindByClipboard: async function () {
            try {
                if (navigator.clipboard) {
                    const text = await navigator.clipboard.readText();
                    this.processTimestamp(text);
                }
            } catch (err) {
            }
        },
        processTimestamp: function (text) {
            const ts = text.trim();
            if (/^\d{2}:\d{2}:\d{2}:\d{2}$/.test(ts)) {
                this.findAndSelectEventByTimestamp(ts);
            }
        },
        findAndSelectEventByTimestamp: function (ts) {
            let targetRow = null;
            const rows = document.querySelectorAll('#game-events tbody tr');
            for (const row of rows) {
                const cell = row.querySelector('td.video-time');
                if (cell && cell.textContent.trim() === ts) {
                    targetRow = row;
                    break;
                }
            }
            if (targetRow) {
                rows.forEach(r => r.classList.remove('selected'));
                targetRow.classList.add('selected');
                targetRow.scrollIntoView({behavior: 'smooth', block: 'center'});
                targetRow.click();
            }
        },
        triggerDeleteSelectedPlayerEvent: function () {
            const selectedRow = document.querySelector('#game-events tr.selected');
            if (selectedRow && selectedRow.id.startsWith('event-player-')) {
                const deleteButton = selectedRow.querySelector('.delete-event-button a');
                if (deleteButton) {
                    deleteButton.click();
                }
            }
        }

    };

    function openSettingsUI() {
        if (document.getElementById('hkm-settings-overlay')) return;
        GM_addStyle(`#hkm-settings-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 99999; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; font-family: 'Segoe UI', Arial, sans-serif; } #hkm-settings-overlay .layout-container { display: flex; width: 90%; max-width: 1200px; height: 80vh; max-height: 800px; background: #f0f2f5; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); overflow: hidden; } #hkm-settings-overlay .sidebar { width: 260px; background: #fff; border-right: 1px solid #dee2e6; display: flex; flex-direction: column; } #hkm-settings-overlay .sidebar-header { padding: 20px; text-align: center; border-bottom: 1px solid #dee2e6; position: relative; } #hkm-settings-overlay .close-btn { position: absolute; top: 10px; right: 10px; background: none; border: none; font-size: 24px; cursor: pointer; color: #6c757d; line-height: 1; padding: 5px; } #hkm-settings-overlay .sidebar-header h1 { margin: 0; font-size: 22px; color: #667eea; } #hkm-settings-overlay .sidebar-header .subtitle { font-size: 13px; color: #6c757d; margin-top: 5px; } #hkm-settings-overlay .categories { flex-grow: 1; padding: 10px 0; overflow-y: auto; } #hkm-settings-overlay .category { display: block; padding: 12px 20px; cursor: pointer; border-left: 3px solid transparent; font-size: 15px; transition: all 0.2s; } #hkm-settings-overlay .category:hover { background: #f8f9fa; border-left-color: #ccc; } #hkm-settings-overlay .category.active { background: #e9ecef; border-left-color: #667eea; font-weight: 600; color: #667eea; } #hkm-settings-overlay .sidebar-footer { padding: 20px; margin-top: auto; } #hkm-settings-overlay #reset-settings-btn { width: 100%; background: #6c757d; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer; transition: background 0.2s; } #hkm-settings-overlay #reset-settings-btn:hover { background: #5a6268; } #hkm-settings-overlay .main-content { flex: 1; padding: 30px; overflow-y: auto; } #hkm-settings-overlay #section-title { font-size: 24px; font-weight: 600; margin-bottom: 20px; } #hkm-settings-overlay .hotkey-item { display: flex; align-items: center; justify-content: space-between; padding: 15px; background: #fff; border-radius: 8px; margin-bottom: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); transition: all 0.2s; } #hkm-settings-overlay .hotkey-item:hover { box-shadow: 0 4px 10px rgba(0,0,0,0.08); transform: translateY(-2px); } #hkm-settings-overlay .hotkey-item.recording { box-shadow: 0 0 0 2px #667eea; } #hkm-settings-overlay .event-name { font-size: 15px; padding-right: 15px; } #hkm-settings-overlay .hotkey-input-container { display: flex; align-items: center; } #hkm-settings-overlay .hotkey-input { width: 140px; padding: 8px; border: 1px solid #dee2e6; border-radius: 5px; text-align: center; font-family: monospace; font-size: 14px; cursor: pointer; } #hkm-settings-overlay .hotkey-input.recording { border-color: #667eea; box-shadow: 0 0 5px rgba(102, 126, 234, 0.4); outline: none; } #hkm-settings-overlay .clear-btn { background: #f1f3f5; border: 1px solid #dee2e6; color: #555; width: 30px; height: 30px; border-radius: 50%; margin-left: 10px; cursor: pointer; font-weight: bold; flex-shrink: 0; } #hkm-settings-overlay .clear-btn:hover { background: #dc3545; color: white; border-color: #dc3545; } #hkm-settings-overlay .switch { position: relative; display: inline-block; width: 50px; height: 28px; flex-shrink: 0; } #hkm-settings-overlay .switch input { opacity: 0; width: 0; height: 0; } #hkm-settings-overlay .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 28px; } #hkm-settings-overlay .slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 4px; bottom: 4px; background-color: white; transition: .4s; border-radius: 50%; box-shadow: 0 1px 3px rgba(0,0,0,0.2); } #hkm-settings-overlay input:checked + .slider { background-color: #667eea; } #hkm-settings-overlay input:checked + .slider:before { transform: translateX(22px); } #hkm-settings-overlay #toast-container { position: absolute; bottom: 20px; right: 20px; z-index: 100000; } #hkm-settings-overlay .toast { background: #333; color: white; padding: 12px 20px; border-radius: 8px; margin-bottom: 10px; opacity: 0; transform: translateY(20px); transition: all 0.3s; } #hkm-settings-overlay .toast.show { opacity: 1; transform: translateY(0); } #hkm-settings-overlay .toast.success { background: #28a745; } #hkm-settings-overlay .toast.error { background: #dc3545; }`);
        const overlay = document.createElement('div');
        overlay.id = 'hkm-settings-overlay';
        overlay.innerHTML = `<div class="layout-container" onclick="event.stopPropagation()"><div class="sidebar"><div class="sidebar-header"><button class="close-btn" title="Закрити">&times;</button><h1>HotKey Manager</h1><div class="subtitle">Налаштування гарячих клавіш</div></div><div class="categories"><div class="category active" data-category="blocks-checks">Blocks & Checks</div><div class="category" data-category="lprs">LPRs</div><div class="category" data-category="carries-dumps">Carries & Dumps</div><div class="category" data-category="passes">Passes</div><div class="category" data-category="shots-puck-protection">Shots & Puck Protection</div><div class="category" data-category="other">Other</div></div><div class="sidebar-footer"><button id="reset-settings-btn" title="Скинути всі налаштування до значень за замовчуванням">Скинути до замовчуванням</button></div></div><div class="main-content"><h2 id="section-title">Blocks & Checks Actions</h2><div class="hotkey-list" id="hotkey-list"></div></div></div><div id="toast-container"></div>`;
        document.body.appendChild(overlay);
        initializeSettingsLogic(overlay);
    }

    function initializeSettingsLogic(overlay) {
        const hotkeyList = overlay.querySelector('#hotkey-list'),
            toastContainer = overlay.querySelector('#toast-container'),
            categories = overlay.querySelectorAll('.category'), sectionTitle = overlay.querySelector('#section-title'),
            resetBtn = overlay.querySelector('#reset-settings-btn'), closeBtn = overlay.querySelector('.close-btn');
        let currentInput = null, isRecording = false, pressedKeys = new Set(), currentCategory = 'blocks-checks';
        const closeUI = () => {
            document.removeEventListener('keydown', handleGlobalKeydown, true);
            overlay.remove();
        };
        const handleGlobalKeydown = (e) => {
            if (e.key === 'Escape' && !isRecording) {
                closeUI();
            }
        };
        document.addEventListener('keydown', handleGlobalKeydown, true);
        closeBtn.addEventListener('click', closeUI);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeUI();
        });

        function getCategoryTitle(cat) {
            const t = {
                'blocks-checks': 'Blocks & Checks Actions',
                'lprs': 'LPRs Actions',
                'carries-dumps': 'Carries & Dumps Actions',
                'passes': 'Passes Actions',
                'shots-puck-protection': 'Shots & Puck Protection Actions',
                'other': 'Other Actions'
            };
            return t[cat] || 'Actions';
        }

        function initializeDefaults(force = false) {
            if (GM_Store.get('defaultsInitialized') && !force) return;
            if (force) GM_Store.listValues().forEach(k => GM_Store.deleteValue(k));
            for (const cat in categoryData) {
                const sk = `${cat}Hotkeys`;
                const d = categoryData[cat].filter(i => i.defaultShortcut).map(i => ({
                    actionId: i.id,
                    shortcut: i.defaultShortcut
                }));
                if (d.length > 0) GM_Store.set(sk, d);
            }
            Object.values(categoryData).flat().filter(i => i.type === 'toggle' && i.default !== undefined).forEach(i => {
                const key = i.id.replace(/-toggle$/, '').replace(/-\w/g, m => m[1].toUpperCase()) + 'Enabled';
                GM_Store.set(key, i.default);
            });
            GM_Store.set('defaultsInitialized', true);
            HotkeyManager.loadSettings();
            showStatus('Налаштування скинуто до стандартних.', 'success');
        }

        function resetSettings() {
            if (confirm('Ви впевнені, що хочете скинути всі налаштування до стандартних?')) {
                initializeDefaults(true);
                switchCategory(currentCategory);
            }
        }

        function switchCategory(cat) {
            currentCategory = cat;
            GM_Store.set('lastCategory', cat);
            categories.forEach(c => c.classList.toggle('active', c.dataset.category === cat));
            sectionTitle.textContent = getCategoryTitle(cat);
            loadHotkeys();
        }

        function loadHotkeys() {
            const sKey = `${currentCategory}Hotkeys`;
            const saved = GM_Store.get(sKey, []);
            const all = GM_Store.listValues().reduce((a, k) => ({...a, [k]: GM_Store.get(k)}), {});
            renderHotkeyList(saved, all);
        }

        function renderHotkeyList(saved, all) {
            hotkeyList.innerHTML = '';
            categoryData[currentCategory]?.forEach(item => {
                if (item.type === 'interval') return;
                const actionId = item.id;
                if (item.type === 'toggle') {
                    const key = actionId.replace(/-toggle$/, '').replace(/-\w/g, m => m[1].toUpperCase()) + 'Enabled';
                    hotkeyList.appendChild(createToggleItem(item, !!all[key], key));
                } else {
                    const h = saved.find(h => h.actionId === actionId);
                    hotkeyList.appendChild(createHotkeyItem(item, h ? h.shortcut : (item.defaultShortcut || '')));
                }
            });
        }

        function createToggleItem(item, isEnabled, key) {
            const div = document.createElement('div');
            div.className = 'hotkey-item';
            div.innerHTML = `<div class="event-name">${item.name}</div><label class="switch"><input type="checkbox" ${isEnabled ? 'checked' : ''}><span class="slider"></span></label>`;
            div.querySelector('input').addEventListener('change', e => {
                GM_Store.set(key, e.target.checked);
                HotkeyManager.loadSettings();
                showStatus('Налаштування оновлено', 'success');
            });
            return div;
        }

        function createHotkeyItem(item, shortcut) {
            const div = document.createElement('div');
            div.className = 'hotkey-item';
            div.innerHTML = `<div class="event-name">${item.name}</div><div class="hotkey-input-container"><input type="text" class="hotkey-input" placeholder="Натисніть..." value="${shortcut}" readonly data-action-id="${item.id}"><button class="clear-btn" title="Видалити" style="display:${shortcut ? 'inline-flex' : 'none'}; align-items:center; justify-content:center;">×</button></div>`;
            div.querySelector('.hotkey-input').addEventListener('click', e => startRecording(e.target));
            div.querySelector('.clear-btn').addEventListener('click', e => {
                e.stopPropagation();
                clearHotkey(item.id);
            });
            return div;
        }

        function startRecording(input) {
            if (isRecording) stopRecording(false);
            isRecording = true;
            currentInput = input;
            pressedKeys.clear();
            input.value = 'Записуємо...';
            input.classList.add('recording');
            input.closest('.hotkey-item').classList.add('recording');
            document.addEventListener('keydown', handleKeyRecord, true);
            document.addEventListener('keyup', handleKeyRecordUp, true);
        }

        function stopRecording(save) {
            if (!isRecording) return;
            const wasRecordingInput = currentInput;
            isRecording = false;
            currentInput = null;
            document.removeEventListener('keydown', handleKeyRecord, true);
            document.removeEventListener('keyup', handleKeyRecordUp, true);
            if (wasRecordingInput) {
                wasRecordingInput.classList.remove('recording');
                wasRecordingInput.closest('.hotkey-item').classList.remove('recording');
            }
            if (save) {
                saveCurrentHotkey(wasRecordingInput);
            } else {
                loadHotkeys();
            }
        }

        function getKeyFromEvent(e) {
            const mods = ['Control', 'Shift', 'Alt', 'Meta'];
            if (mods.includes(e.key)) return e.key;
            if (e.code.startsWith('Key')) return e.code.slice(3);
            if (e.code.startsWith('Digit')) return e.code.slice(5);
            return e.key.toUpperCase();
        }

        function handleKeyRecord(e) {
            e.preventDefault();
            e.stopPropagation();
            if (e.key === 'Escape') return stopRecording(false);
            pressedKeys.add(getKeyFromEvent(e));
            if (currentInput) currentInput.value = formatShortcut(pressedKeys);
        }

        function handleKeyRecordUp(e) {
            e.preventDefault();
            e.stopPropagation();
            if (!['Control', 'Shift', 'Alt', 'Meta'].includes(getKeyFromEvent(e)) && pressedKeys.size > 0) stopRecording(true);
        }

        function formatShortcut(keys) {
            const order = ['Control', 'Shift', 'Alt', 'Meta'];
            const k = [...keys];
            const m = k.filter(key => order.includes(key)).sort((a, b) => order.indexOf(a) - order.indexOf(b));
            const p = k.find(key => !order.includes(key));
            return [...m, p].filter(Boolean).join(' + ');
        }

        function saveCurrentHotkey(inputElement) {
            const shortcut = formatShortcut(pressedKeys);
            const actionId = inputElement.dataset.actionId;
            pressedKeys.clear();
            if (!shortcut || !actionId) return loadHotkeys();
            const allH = GM_Store.getAllHotkeys();
            if (allH[shortcut] && allH[shortcut] !== actionId) {
                showStatus('Ця комбінація вже зайнята!', 'error');
                return loadHotkeys();
            }
            const sk = `${currentCategory}Hotkeys`;
            let h = GM_Store.get(sk, []).filter(hotkey => hotkey.actionId !== actionId);
            h.push({actionId, shortcut});
            GM_Store.set(sk, h);
            showStatus('Хоткей збережено!', 'success');
            loadHotkeys();
            HotkeyManager.loadSettings();
        }

        function clearHotkey(actionId) {
            const sk = `${currentCategory}Hotkeys`;
            let h = GM_Store.get(sk, []).filter(hotkey => hotkey.actionId !== actionId);
            GM_Store.set(sk, h);
            showStatus('Хоткей видалено.', 'success');
            loadHotkeys();
            HotkeyManager.loadSettings();
        }

        function showStatus(msg, type = 'success') {
            const t = document.createElement('div');
            t.className = `toast ${type}`;
            t.textContent = msg;
            toastContainer.appendChild(t);
            setTimeout(() => t.classList.add('show'), 10);
            setTimeout(() => {
                t.classList.remove('show');
                t.addEventListener('transitionend', () => t.remove());
            }, 3000);
        }

        function main() {
            initializeDefaults();
            switchCategory(GM_Store.get('lastCategory', 'blocks-checks'));
            categories.forEach(c => c.addEventListener('click', () => switchCategory(c.dataset.category)));
            resetBtn.addEventListener('click', resetSettings);
            document.addEventListener('click', (e) => {
                if (isRecording && !e.target.closest('.hotkey-input-container')) {
                    stopRecording(false);
                }
            }, true);
        }

        main();
    }

    GM_registerMenuCommand('Налаштувати гарячі клавіші', openSettingsUI);

    injectPageScript();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => HotkeyManager.init());
    } else {
        HotkeyManager.init();
    }

})();