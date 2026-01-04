// ==UserScript==
// @name         Hoobs Slither Mod 2 - Threat Radar/Zoom/Bot Edition | Zoom with mouse scroll
// @namespace    http://tampermonkey.net/
// @version      0.9.12
// @license MIT
// @description  Slither.io mod with modern glassmorphic UI, heat radar, auto-eat, collision avoidance, and mouse scroll zoom
// @author       minigem.uk
// @match        http://slither.com/io
// @run-at       document-start
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/558413/Hoobs%20Slither%20Mod%202%20-%20Threat%20RadarZoomBot%20Edition%20%7C%20Zoom%20with%20mouse%20scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/558413/Hoobs%20Slither%20Mod%202%20-%20Threat%20RadarZoomBot%20Edition%20%7C%20Zoom%20with%20mouse%20scroll.meta.js
// ==/UserScript==

(function (win) {
    "use strict";

    /********** CORE MOD VARIABLES **********/
    const UNIQUE_MOD_VERSION = "v0.9.12";
    const DEFAULT_BG_COLOR = "#2a2a2a";
    let CURSOR_SIZE = 32;
    let CURSOR_OPACITY = 0.4;
    let backupBgImage = null;
    let originalBodyStyle = null;
    let customZoomLevel = 0.9;
    let connectAttempts = 0;
    let isInitialized = false;

    // Constants for physics
    const TURN_RATE = 0.1;
    const REACTION_FRAMES = 2;
    const PROJECTION_FRAMES = 3;
    const MAP_SIZE = 50000;
    /********** HUD ELEMENTS **********/
    const HUD_CSS = `
        color: #FFF;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        font-size: 14px;
        position: fixed;
        opacity: 0.35;
        z-index: 9999;
    `;
    let hudCoords = null;
    let hudServerInfo = null;
    let hudFrames = null;
    /********** CORE STATE VARIABLES **********/
    let autoAvoidEnabled = false;
    let avoidanceSensitivity = 71;  // Controls heatmap/radar detection range
    let collisionSensitivity = 30;  // Controls actual collision avoidance range (inner circle)
    // Heatmap resolution settings (sectors = angular divisions, rings = radial divisions)
    let heatmapSectors = 22;  // angular resolution (like HDD sectors)
    let heatmapRings = 7;     // radial resolution (like HDD tracks/cylinders)
    let heatDecay = 0.1;      // Heat dissipation rate (0=instant clear, 1=never fades)
    // Simplified overlay system
    let showCollisionOverlay = false; // Shows all collision overlays and circles
    let showFeedingOverlay = false;   // Shows all paths, foods overlays, food search circle, next food target and feast overlay
    let showHeatmapOverlay = false;   // Shows the threat heat map
    
    // Internal state aliases
    let showFoodOverlay = false;
    let showTspPath = false;
    
    let autoEatEnabled = false;
    // Settings
    let foodSearchMultiplier = 2; // 0..5, multiplied by collision radius
    const tspIntervalSec = 10; // fixed 10 second TSP refresh
    const feastThreshold = 40; // fixed feast threshold (matches FEAST_MASS constant)
    const threatSampleStep = 2; // fixed sampling rate for performance
    // Background refresh flag (polled)
    let backgroundNeedsUpdate = false;
    let foodTarget = null; // The actual target position (for display)
    let steerTarget = null; // The steering target (may include lead-point offset)
    let isTurning = false;
    let turnDirection = 0;
    let turnStartTime = 0;
    let turnPurpose = null;
    // Avoidance cache to reduce CPU: recompute at most every 50ms (~20 Hz)
    let lastAvoidance = { distance: 0, threats: [], vector: { x: 0, y: 0 } };
    let lastAvoidanceAt = 0;

    /********** UI Elements **********/
    let nickInputElem = null;
    let sensitivitySliderContainer = null;
    // UI drag suppression: prevent game input while adjusting mod sliders
    let uiDragging = false, uiDragCount = 0;
    function startUIDrag() { uiDragCount++; uiDragging = true; }
    function endUIDrag() { uiDragCount = Math.max(0, uiDragCount - 1); if (uiDragCount === 0) uiDragging = false; }

    /********** Settings Popup Variables **********/
    let settingsPopup = null;

    /********** Persistence **********/
    const STORAGE_KEYS = {
        defaultBgEnabled: "hsm_defaultBgEnabled",
        bgColor: "hsm_bgColor",
        cursorSize: "hsm_cursorSize",
        cursorOpacity: "hsm_cursorOpacity",
        autoAvoid: "hsm_autoAvoidEnabled",
        avoidanceSensitivity: "hsm_avoidanceSensitivity",
        collisionSensitivity: "hsm_collisionSensitivity",
        heatmapSectors: "hsm_heatmapSectors",
        heatmapRings: "hsm_heatmapRings",
        heatDecay: "hsm_heatDecay",
        showCollisionOverlay: "hsm_showCollisionOverlay",
        showFeedingOverlay: "hsm_showFeedingOverlay",
        showHeatmapOverlay: "hsm_showHeatmapOverlay",
        autoEat: "hsm_autoEatEnabled",
        foodSearchRadius: "hsm_foodSearchRadius",
        foodSearchMultiplier: "hsm_foodSearchMultiplier",
        showTspPath: "hsm_showTspPath"
    };

    function updateSliderValue(slider, event, min, max, callback, isFloat = false) {
        const rect = slider.getBoundingClientRect();
        const width = rect.width;
        let position = (event.clientX - rect.left) / width;
        position = Math.max(0, Math.min(1, position));
        const range = max - min;
        let value = min + position * range;
        if (slider.step) {
            const step = parseFloat(slider.step);
            value = Math.round(value / step) * step;
        }
        value = Math.max(min, Math.min(max, value));
        slider.value = value;
        callback(isFloat ? parseFloat(value.toFixed(1)) : Math.round(value));
    }

 function waitForCanvas() {
    let canvas = document.querySelector('canvas.nsi') || document.getElementsByTagName('canvas')[0];
    if (canvas) {
        //console.log('Canvas found:', canvas);
        win.gameCanvas = canvas;
        initialize();
        return;
    }

    setTimeout(waitForCanvas, 100);
}

    function setCustomBackgroundColor(color) {
        if (!win.bgi2 || !(win.bgi2 instanceof HTMLCanvasElement)) {
            win.bgi2 = document.createElement("canvas");
            win.bgi2.width = window.innerWidth;
            win.bgi2.height = window.innerHeight;
            win.bgi2.style.display = "none";
            document.body.appendChild(win.bgi2);
        }
        if (win.bgi2.width === 0 || win.bgi2.height === 0) {
            win.bgi2.width = window.innerWidth;
            win.bgi2.height = window.innerHeight;
        }
        const bgCanvas = win.bgi2.getContext("2d");
        if (!bgCanvas) {
            return;
        }
        bgCanvas.clearRect(0, 0, win.bgi2.width, win.bgi2.height);
        bgCanvas.fillStyle = color;
        bgCanvas.fillRect(0, 0, win.bgi2.width, win.bgi2.height);
        if (typeof win.setBgp2 === "function") {
            win.setBgp2(win.bgi2);
        } else {
            win.bgp2 = win.bgi2;
        }
    customBackgroundPattern = null;
        document.body.style.background = "none";
        document.body.style.backgroundColor = color;
    }

    function loadPersistentData() {
        try {
            let data;
            data = win.localStorage.getItem(STORAGE_KEYS.bgColor); if (!data) win.localStorage.setItem(STORAGE_KEYS.bgColor, DEFAULT_BG_COLOR);
            data = win.localStorage.getItem(STORAGE_KEYS.cursorSize); CURSOR_SIZE = data ? parseInt(data) : 32;
            data = win.localStorage.getItem(STORAGE_KEYS.cursorOpacity); CURSOR_OPACITY = data ? parseFloat(data) : 0.4;
            data = win.localStorage.getItem(STORAGE_KEYS.autoAvoid); autoAvoidEnabled = data ? JSON.parse(data) : false;
            data = win.localStorage.getItem(STORAGE_KEYS.avoidanceSensitivity); avoidanceSensitivity = data ? parseInt(data) : 71;
            data = win.localStorage.getItem(STORAGE_KEYS.collisionSensitivity); collisionSensitivity = data ? parseInt(data) : 30;
            // Heatmap resolution settings
            data = win.localStorage.getItem(STORAGE_KEYS.heatmapSectors); heatmapSectors = data ? parseInt(data) : 22;
            data = win.localStorage.getItem(STORAGE_KEYS.heatmapRings); heatmapRings = data ? parseInt(data) : 7;
            data = win.localStorage.getItem(STORAGE_KEYS.heatDecay); heatDecay = data ? parseFloat(data) : 0.1;
            data = win.localStorage.getItem(STORAGE_KEYS.showCollisionOverlay); showCollisionOverlay = data ? JSON.parse(data) : false;
            data = win.localStorage.getItem(STORAGE_KEYS.showFeedingOverlay); showFeedingOverlay = data ? JSON.parse(data) : false;
            data = win.localStorage.getItem(STORAGE_KEYS.showHeatmapOverlay); showHeatmapOverlay = data ? JSON.parse(data) : false;
            
            showFoodOverlay = showFeedingOverlay;
            showTspPath = showFeedingOverlay;
            data = win.localStorage.getItem(STORAGE_KEYS.autoEat); autoEatEnabled = data ? JSON.parse(data) : false;
            // Food search range multiplier (0..5)
            data = win.localStorage.getItem(STORAGE_KEYS.foodSearchMultiplier);
            if (data != null) {
                const m = parseFloat(data);
                foodSearchMultiplier = isFinite(m) ? Math.max(0, Math.min(5, m)) : 2;
            } else {
                const legacy = win.localStorage.getItem(STORAGE_KEYS.foodSearchRadius);
                if (legacy != null) {
                    const base = (avoidanceSensitivity <= 0) ? 0 : (200 + (avoidanceSensitivity / 100) * 600);
                    const m = base > 0 ? (parseFloat(legacy) / base) : 2;
                    foodSearchMultiplier = Math.max(0, Math.min(5, isFinite(m) ? m : 2));
                } else {
                    foodSearchMultiplier = 2;
                }
            }
            data = win.localStorage.getItem(STORAGE_KEYS.showTspPath); showTspPath = data ? JSON.parse(data) : false;
        } catch (e) {
            // Error loading data - use defaults
        }
    }

    function savePersistentData() {
        try {
            win.localStorage.setItem(STORAGE_KEYS.cursorSize, CURSOR_SIZE);
            win.localStorage.setItem(STORAGE_KEYS.cursorOpacity, CURSOR_OPACITY);
            win.localStorage.setItem(STORAGE_KEYS.autoAvoid, JSON.stringify(autoAvoidEnabled));
            win.localStorage.setItem(STORAGE_KEYS.avoidanceSensitivity, avoidanceSensitivity);
            win.localStorage.setItem(STORAGE_KEYS.collisionSensitivity, collisionSensitivity);
            win.localStorage.setItem(STORAGE_KEYS.showCollisionOverlay, JSON.stringify(showCollisionOverlay));
            win.localStorage.setItem(STORAGE_KEYS.showFeedingOverlay, JSON.stringify(showFeedingOverlay));
            win.localStorage.setItem(STORAGE_KEYS.showHeatmapOverlay, JSON.stringify(showHeatmapOverlay));
            
            showFoodOverlay = showFeedingOverlay;
            showTspPath = showFeedingOverlay;
            win.localStorage.setItem(STORAGE_KEYS.autoEat, JSON.stringify(autoEatEnabled));
            win.localStorage.setItem(STORAGE_KEYS.foodSearchMultiplier, foodSearchMultiplier);
            win.localStorage.setItem(STORAGE_KEYS.showTspPath, JSON.stringify(showTspPath));
        } catch (e) {
            // Error saving data
        }
    }

    /********** Helper Functions **********/
    function createDiv(id, className, style) {
        const divElem = document.createElement("div");
        if (id) divElem.id = id;
        if (className) divElem.className = className;
        if (style) divElem.style = style;
        document.body.appendChild(divElem);
    }

    // Shared UI row factory used by multiple creators
    function makeRow() {
        const row = document.createElement("div");
        row.style.display = "flex";
        row.style.alignItems = "center";
        row.style.gap = "10px";
        row.style.background = "rgba(20, 20, 30, 0.85)";
        row.style.padding = "5px 10px";
        row.style.border = "1px solid rgba(255,255,255,0.4)";
        row.style.borderRadius = "5px";
        row.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
        row.style.color = "#FFF";
        return row;
    }

    function getControlsDock() {
        // Find existing unified controls dock or create it once
        let controlsDock = document.getElementById("hsm-controls-dock");
        const host = document.getElementById("hsm-controls-host");
        const embedded = !!host;
        if (!controlsDock) {
            controlsDock = document.createElement("div");
            controlsDock.id = "hsm-controls-dock";
            // Hidden by default; will be shown when General tab is active
            controlsDock.style.display = "none";
            document.body.appendChild(controlsDock);
        }
        // Apply styles depending on whether we embed in popup or float
    if (embedded) {
            // Move into host and style as an inline stack - fills the popup
            if (controlsDock.parentElement !== host) host.appendChild(controlsDock);
            Object.assign(controlsDock.style, {
                position: "relative",
                top: "",
                left: "",
                transform: "none",
        display: 'flex',
        flexDirection: 'column',
        alignItems: "stretch",
        gap: "8px",
        padding: "2px",
                background: "transparent",
                border: "none",
                borderRadius: "0",
                boxShadow: "none",
                zIndex: "auto",
                width: "100%",
                height: "100%"
            });
        } else {
            // Floating style (used only if popup not created yet)
            Object.assign(controlsDock.style, {
                position: "fixed",
                top: "10px",
                left: "10px",
                transform: "none",
                display: controlsDock.style.display || "none",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "8px",
                padding: "8px",
                background: "rgba(20, 20, 30, 0.6)",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: "8px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
                zIndex: "10002"
            });
        }
        // Create mod options section container
        const ensureSection = (id) => {
            let sec = controlsDock.querySelector('#'+id);
            if (!sec) {
                sec = document.createElement('div');
                sec.id = id;
                sec.className = 'hsm-dock-section';
                sec.style.display = 'flex';
                sec.style.flexDirection = 'column';
                sec.style.gap = '6px';
                sec.style.padding = '8px';
                sec.style.background = 'transparent';
                sec.style.border = 'none';
                sec.style.borderRadius = '8px';
                sec.style.flex = '1';
                controlsDock.appendChild(sec);
            }
            return sec;
        };
        ensureSection('hsm-section-options');
        return controlsDock;
    }

    function getDockSection() {
        const dock = getControlsDock();
        return dock.querySelector('#hsm-section-options') || dock;
    }

    function initializeSlithers() {
        const snakeArray = findSnakeArray();
        if (snakeArray) {
            win.slithers = snakeArray;
        } else {
            win.slithers = [];
        }
        // Also expose foods if available
        const foodsArray = findFoodsArray();
        if (foodsArray) {
            win.foods = foodsArray;
        }
    }

    function findSnakeArray() {
        const possibleNames = ["slithers", "snakes", "all", "snake", "snakeArray", "allSnakes"];
        for (const name of possibleNames) {
            if (win[name] && Array.isArray(win[name]) && win[name].length > 0 && (win[name][0]?.nk || (typeof win[name][0]?.xx === "number" && typeof win[name][0]?.yy === "number"))) {
                return win[name];
            }
        }
        setTimeout(findSnakeArray, 1000);
        return null;
    }

    function findFoodsArray() {
        const possibleNames = ["foods", "food", "allFoods", "foodArray"];
        for (const name of possibleNames) {
            if (win[name] && Array.isArray(win[name]) && (win[name].length === 0 || (typeof win[name][0]?.xx === "number" && typeof win[name][0]?.yy === "number"))) {
                return win[name];
            }
        }
        setTimeout(findFoodsArray, 1000);
        return null;
    }

    function createModInfo() {
        if (document.getElementById("mod-info")) return;
        const loginDiv = document.getElementById("login") || document.body;
        if (!loginDiv) return;

        const modInfoDiv = document.createElement("div");
        modInfoDiv.id = "mod-info";
        modInfoDiv.style.position = "relative";
        modInfoDiv.style.textAlign = "center";
        modInfoDiv.style.margin = "20px auto";
        modInfoDiv.style.padding = "15px";
        modInfoDiv.style.background = "rgba(20, 20, 30, 0.85)";
        modInfoDiv.style.color = "#FFF";
        modInfoDiv.style.border = "1px solid rgba(255,255,255,0.4)";
        modInfoDiv.style.borderRadius = "10px";
        modInfoDiv.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
        modInfoDiv.style.zIndex = "10000";
        modInfoDiv.style.width = "fit-content";
        modInfoDiv.style.boxShadow = "0px 0px 15px rgba(0,0,0,0.5)";
        loginDiv.insertBefore(modInfoDiv, loginDiv.firstChild);

        const title = document.createElement("div");
        title.textContent = `Hoobs Slither Mod ${UNIQUE_MOD_VERSION}`;
        title.style.fontSize = "18px";
        title.style.marginBottom = "10px";
        modInfoDiv.appendChild(title);

        const author = document.createElement("div");
        author.textContent = "Author: hoobs";
        author.style.fontSize = "14px";
        author.style.marginBottom = "10px";
        modInfoDiv.appendChild(author);

        const shortcuts = document.createElement("div");
        shortcuts.style.fontSize = "14px";
        shortcuts.style.marginBottom = "15px";
        shortcuts.innerHTML = `
            <strong>Shortcuts:</strong><br>
            Tab: Settings<br>
            Esc: Quick Respawn<br>
            Q: Quit to Menu<br>
            Z: Restore Zoom<br>
            E: Toggle Auto-Eat<br>
            C: Toggle Auto-Avoid
        `;
        modInfoDiv.appendChild(shortcuts);

        const settingsBtn = document.createElement("button");
        settingsBtn.textContent = "Settings";
        settingsBtn.style.background = "#4CAF50";
        settingsBtn.style.color = "#FFF";
        settingsBtn.style.border = "none";
        settingsBtn.style.borderRadius = "5px";
        settingsBtn.style.padding = "8px 16px";
        settingsBtn.style.cursor = "pointer";
        settingsBtn.style.fontSize = "14px";
        settingsBtn.onclick = toggleSettingsPopup;
        modInfoDiv.appendChild(settingsBtn);
    }

    function setupPlayButton() {
        const playButton = document.getElementById("playh");
        if (!playButton) {
            setTimeout(setupPlayButton, 100);
            return;
        }

        const originalOnClick = playButton.onclick || function() {
            if (win.connect) win.connect();
        };

        playButton.onclick = function(e) {
            if (!win.connect || !win.bso || !win.snake) {
                return;
            }
            originalOnClick.call(playButton, e);
            win.forcing = true;
        };

        const nickInput = document.getElementById("nick");
        if (nickInput) {
            const storedNick = win.localStorage.getItem("nick") || "";
            nickInput.value = storedNick;
        }
    }

    function loadSettings() {
        try {
            const storedNick = win.localStorage.getItem("nick");
            if (storedNick !== null && nickInputElem) nickInputElem.value = storedNick;
        } catch (err) {
            // Error loading settings
        }
    }

    /********** Mod Options Panel **********/
    function createSensitivitySlider() {
        const controlsDock = getControlsDock();
        const optionsSec = getDockSection();
        
        // Main container - 2 columns: left (sliders) and right (checkboxes + radar)
        sensitivitySliderContainer = document.createElement('div');
        sensitivitySliderContainer.id = "sensitivity-slider-container";
        sensitivitySliderContainer.style.cssText = 'display:flex;gap:20px;width:100%;height:100%;';
        optionsSec.appendChild(sensitivitySliderContainer);
        
        // LEFT COLUMN: UI Settings + Radar Settings stacked
        const leftColumn = document.createElement('div');
        leftColumn.style.cssText = 'display:flex;flex-direction:column;gap:16px;flex:1;';
        sensitivitySliderContainer.appendChild(leftColumn);
        
        // RIGHT COLUMN: (Show Overlays + Stance) on top, Radar Preview below
        const rightColumn = document.createElement('div');
        rightColumn.style.cssText = 'display:flex;flex-direction:column;gap:16px;flex:1;';
        sensitivitySliderContainer.appendChild(rightColumn);
        
        // Right column top row: Show Overlays + Stance side by side
        const rightTopRow = document.createElement('div');
        rightTopRow.style.cssText = 'display:flex;gap:16px;flex-wrap:wrap;';
        rightColumn.appendChild(rightTopRow);
        
        // Right column bottom: Radar Preview - fills remaining space
        const rightBottom = document.createElement('div');
        rightBottom.style.cssText = 'display:flex;justify-content:center;align-items:center;flex:1;';
        rightColumn.appendChild(rightBottom);
        
        // Helper to create a labeled box
        const createBox = (title, flexGrow = false) => {
            const box = document.createElement('div');
            box.style.cssText = 'background:rgba(0,0,0,0.35);border:1px solid rgba(255,255,255,0.18);border-radius:10px;padding:16px 18px;display:flex;flex-direction:column;' + (flexGrow ? 'flex:1;' : '');
            const header = document.createElement('div');
            header.textContent = title;
            header.style.cssText = 'color:#8af;font-size:13px;font-weight:bold;margin-bottom:12px;text-transform:uppercase;letter-spacing:1.5px;border-bottom:1px solid rgba(255,255,255,0.12);padding-bottom:8px;';
            box.appendChild(header);
            const content = document.createElement('div');
            content.style.cssText = 'display:flex;flex-direction:column;gap:4px;';
            box.appendChild(content);
            return { box, content };
        };
        
        // Helper to create toggle
        const mkToggle = (container, id, labelText, get, set) => {
            const wrapper = document.createElement('label');
            wrapper.style.cssText = 'display:flex;align-items:center;gap:6px;cursor:pointer;padding:2px 0;';
            wrapper.setAttribute('for', id);
            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.id = id;
            cb.checked = get();
            cb.style.cssText = 'width:18px;height:18px;cursor:pointer;accent-color:#0af;';
            cb.onchange = (e) => { e.stopPropagation(); set(cb.checked); };
            const lab = document.createElement('span');
            lab.textContent = labelText;
            lab.style.cssText = 'color:#ddd;font-size:14px;';
            wrapper.appendChild(cb);
            wrapper.appendChild(lab);
            container.appendChild(wrapper);
            return cb;
        };
        
        // === SHOW OVERLAYS BOX ===
        const overlaysBox = createBox('Show Overlays');
        overlaysBox.content.style.cssText = 'display:flex;flex-direction:row;flex-wrap:wrap;gap:8px 16px;';
        
        mkToggle(overlaysBox.content, 'toggle-collision-overlay', 'Collision', () => !!showCollisionOverlay, (v) => {
            showCollisionOverlay = v;
            win.localStorage.setItem(STORAGE_KEYS.showCollisionOverlay, JSON.stringify(v));
        });
        mkToggle(overlaysBox.content, 'toggle-feeding-overlay', 'Feeding', () => !!showFeedingOverlay, (v) => {
            showFeedingOverlay = v;
            showFoodOverlay = v;
            showTspPath = v;
            win.localStorage.setItem(STORAGE_KEYS.showFeedingOverlay, JSON.stringify(v));
        });
        mkToggle(overlaysBox.content, 'toggle-heatmap-overlay', 'Radar', () => !!showHeatmapOverlay, (v) => {
            showHeatmapOverlay = v;
            win.localStorage.setItem(STORAGE_KEYS.showHeatmapOverlay, JSON.stringify(v));
        });
        
        // === STANCE BOX ===
        const stanceBox = createBox('Stance');
        stanceBox.content.style.cssText = 'display:flex;flex-direction:row;flex-wrap:wrap;gap:8px 16px;';
        
        const autoAvoidCb = mkToggle(stanceBox.content, 'toggle-auto-avoid-2', 'Auto-Avoid', () => autoAvoidEnabled, (v) => {
            autoAvoidEnabled = v;
            savePersistentData();
            // Sync with old toggle if it exists
            const oldToggle = settingsPopup?.querySelector('#toggle-auto-avoid');
            if (oldToggle) oldToggle.checked = v;
            updateAvoidanceSliderVisibility();
        });
        
        const autoEatCb = mkToggle(stanceBox.content, 'toggle-auto-eat-2', 'Auto-Eat', () => autoEatEnabled, (v) => {
            autoEatEnabled = v;
            savePersistentData();
            // Sync with old toggle if it exists
            const oldToggle = settingsPopup?.querySelector('#toggle-auto-eat');
            if (oldToggle) oldToggle.checked = v;
            if (!autoEatEnabled) {
                tspPlan = { route: [], idx: 0, expiresAt: 0 };
                foodTarget = null;
            }
        });
        
        // === UI SETTINGS BOX ===
        const uiBox = createBox('UI Settings', true);
        
        // Default BG toggle
        const storedBgToggle = win.localStorage.getItem(STORAGE_KEYS.defaultBgEnabled) || "false";
        mkToggle(uiBox.content, 'toggle-default-bg-2', 'Default BG', () => storedBgToggle === "true", (v) => {
            win.localStorage.setItem(STORAGE_KEYS.defaultBgEnabled, v ? "true" : "false");
            // Sync with old toggle if it exists
            const oldToggle = settingsPopup?.querySelector('#toggle-default-bg');
            if (oldToggle) oldToggle.checked = v;
            if (win.playing) backgroundNeedsUpdate = true;
        });
        
        // Cursor Size slider row
        const cursorSizeRow = document.createElement('div');
        cursorSizeRow.style.cssText = 'display:flex;align-items:center;gap:8px;padding:4px 10px;background:rgba(0,0,0,0.25);border-radius:6px;';
        const cursorSizeLabel = document.createElement('span');
        cursorSizeLabel.textContent = 'Cursor Size';
        cursorSizeLabel.style.cssText = 'color:#bbb;font-size:13px;width:90px;flex-shrink:0;';
        cursorSizeRow.appendChild(cursorSizeLabel);
        const cursorSizeSlider2 = document.createElement('input');
        cursorSizeSlider2.type = 'range';
        cursorSizeSlider2.min = '8';
        cursorSizeSlider2.max = '64';
        cursorSizeSlider2.value = CURSOR_SIZE;
        cursorSizeSlider2.style.cssText = 'flex:1;height:18px;cursor:pointer;min-width:80px;accent-color:#0af;';
        cursorSizeRow.appendChild(cursorSizeSlider2);
        const cursorSizeVal = document.createElement('span');
        cursorSizeVal.textContent = CURSOR_SIZE;
        cursorSizeVal.style.cssText = 'color:#0f0;font-size:14px;width:36px;text-align:right;font-family:monospace;';
        cursorSizeRow.appendChild(cursorSizeVal);
        uiBox.content.appendChild(cursorSizeRow);
        
        cursorSizeSlider2.addEventListener('input', () => {
            CURSOR_SIZE = parseInt(cursorSizeSlider2.value);
            cursorSizeVal.textContent = CURSOR_SIZE;
            win.localStorage.setItem(STORAGE_KEYS.cursorSize, CURSOR_SIZE);
            updateCursor();
        });
        
        // Cursor Opacity slider row
        const cursorOpacityRow = document.createElement('div');
        cursorOpacityRow.style.cssText = 'display:flex;align-items:center;gap:8px;padding:4px 10px;background:rgba(0,0,0,0.25);border-radius:6px;';
        const cursorOpacityLabel = document.createElement('span');
        cursorOpacityLabel.textContent = 'Cursor Opacity';
        cursorOpacityLabel.style.cssText = 'color:#bbb;font-size:13px;width:90px;flex-shrink:0;';
        cursorOpacityRow.appendChild(cursorOpacityLabel);
        const cursorOpacitySlider2 = document.createElement('input');
        cursorOpacitySlider2.type = 'range';
        cursorOpacitySlider2.min = '0.1';
        cursorOpacitySlider2.max = '1.0';
        cursorOpacitySlider2.step = '0.1';
        cursorOpacitySlider2.value = CURSOR_OPACITY;
        cursorOpacitySlider2.style.cssText = 'flex:1;height:18px;cursor:pointer;min-width:80px;accent-color:#0af;';
        cursorOpacityRow.appendChild(cursorOpacitySlider2);
        const cursorOpacityVal = document.createElement('span');
        cursorOpacityVal.textContent = CURSOR_OPACITY.toFixed(1);
        cursorOpacityVal.style.cssText = 'color:#0f0;font-size:14px;width:36px;text-align:right;font-family:monospace;';
        cursorOpacityRow.appendChild(cursorOpacityVal);
        uiBox.content.appendChild(cursorOpacityRow);
        
        cursorOpacitySlider2.addEventListener('input', () => {
            CURSOR_OPACITY = parseFloat(cursorOpacitySlider2.value);
            cursorOpacityVal.textContent = CURSOR_OPACITY.toFixed(1);
            win.localStorage.setItem(STORAGE_KEYS.cursorOpacity, CURSOR_OPACITY);
            updateCursor();
        });
        
        // === RADAR SETTINGS BOX ===
        const heatmapBox = createBox('Radar Settings', true);
        
        // Compact slider creator for heatmap box
        const createSliderRow = (container, labelText, min, max, getValue, setValue, defaultVal, formatFn = null) => {
            const row = document.createElement('div');
            row.style.cssText = 'display:flex;align-items:center;gap:8px;padding:4px 10px;background:rgba(0,0,0,0.25);border-radius:6px;';
            
            const label = document.createElement('span');
            label.textContent = labelText;
            label.style.cssText = 'color:#bbb;font-size:13px;width:65px;flex-shrink:0;';
            row.appendChild(label);
            
            const slider = document.createElement('input');
            slider.type = 'range';
            slider.min = min;
            slider.max = max;
            slider.value = getValue();
            slider.style.cssText = 'flex:1;height:18px;cursor:pointer;min-width:80px;accent-color:#0af;';
            row.appendChild(slider);
            
            const displayValue = formatFn ? formatFn(getValue()) : getValue();
            const valueDisp = document.createElement('span');
            valueDisp.textContent = displayValue;
            valueDisp.style.cssText = 'color:#0f0;font-size:14px;width:36px;text-align:right;font-family:monospace;flex-shrink:0;';
            row.appendChild(valueDisp);
            
            const resetBtn = document.createElement('button');
            resetBtn.textContent = '↺';
            resetBtn.title = 'Reset to ' + (formatFn ? formatFn(defaultVal) : defaultVal);
            resetBtn.style.cssText = 'background:#444;color:#aaa;border:none;border-radius:4px;cursor:pointer;padding:2px 6px;font-size:12px;flex-shrink:0;line-height:16px;';
            resetBtn.onclick = (e) => {
                e.stopPropagation();
                setValue(defaultVal);
                slider.value = defaultVal;
                valueDisp.textContent = formatFn ? formatFn(defaultVal) : defaultVal;
            };
            row.appendChild(resetBtn);
            
            let dragging = false;
            slider.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                startUIDrag();
                dragging = true;
            });
            slider.addEventListener('input', () => {
                const v = parseInt(slider.value);
                setValue(v);
                valueDisp.textContent = formatFn ? formatFn(v) : v;
            });
            document.addEventListener('mouseup', () => {
                if (dragging) { dragging = false; endUIDrag(); }
            });
            
            container.appendChild(row);
            return { slider, valueDisp, row };
        };
        
        // Radar Distance (outer blue circle - detection range)
        createSliderRow(heatmapBox.content, 'Radar Dist', 0, 100, () => avoidanceSensitivity, (v) => {
            avoidanceSensitivity = v;
            // Ensure collision doesn't exceed radar
            if (collisionSensitivity > v) {
                collisionSensitivity = v;
                win.localStorage.setItem(STORAGE_KEYS.collisionSensitivity, v);
            }
            win.localStorage.setItem(STORAGE_KEYS.avoidanceSensitivity, v);
            if (typeof drawHeatmapPreview === 'function') drawHeatmapPreview();
        }, 71);
        
        // Collision Distance (inner orange/red circle - actual avoidance range)
        createSliderRow(heatmapBox.content, 'Avoid Dist', 0, 100, () => collisionSensitivity, (v) => {
            // Cap collision at radar distance
            collisionSensitivity = Math.min(v, avoidanceSensitivity);
            win.localStorage.setItem(STORAGE_KEYS.collisionSensitivity, collisionSensitivity);
            if (typeof drawHeatmapPreview === 'function') drawHeatmapPreview();
        }, 30);
        
        createSliderRow(heatmapBox.content, 'Sectors', 8, 64, () => heatmapSectors, (v) => {
            heatmapSectors = v;
            win.localStorage.setItem(STORAGE_KEYS.heatmapSectors, v);
            heatGrid = null;
            if (typeof drawHeatmapPreview === 'function') drawHeatmapPreview();
        }, 22);
        
        createSliderRow(heatmapBox.content, 'Rings', 3, 12, () => heatmapRings, (v) => {
            heatmapRings = v;
            win.localStorage.setItem(STORAGE_KEYS.heatmapRings, v);
            heatGrid = null;
            if (typeof drawHeatmapPreview === 'function') drawHeatmapPreview();
        }, 7);
        
        // Heat Decay slider (0.0 = instant clear, 1.0 = never fades)
        createSliderRow(heatmapBox.content, 'Heat Decay', 0, 100, () => Math.round(heatDecay * 100), (v) => {
            heatDecay = v / 100;
            win.localStorage.setItem(STORAGE_KEYS.heatDecay, heatDecay);
            if (typeof drawHeatmapPreview === 'function') drawHeatmapPreview();
        }, 10);
        
        // Food Search Range slider (multiplier of collision radius, 0-5x)
        createSliderRow(heatmapBox.content, 'Food Range', 0, 50, () => Math.round(foodSearchMultiplier * 10), (v) => {
            foodSearchMultiplier = v / 10;
            win.localStorage.setItem(STORAGE_KEYS.foodSearchMultiplier, foodSearchMultiplier);
            if (typeof drawHeatmapPreview === 'function') drawHeatmapPreview();
        }, 20, (v) => '×' + (v / 10).toFixed(1));
        
        // === APPEND BOXES TO LAYOUT ===
        // Left column: UI Settings (top) + Radar Settings (bottom)
        leftColumn.appendChild(uiBox.box);
        leftColumn.appendChild(heatmapBox.box);
        
        // Right column top: Show Overlays + Stance side by side
        rightTopRow.appendChild(overlaysBox.box);
        rightTopRow.appendChild(stanceBox.box);
        
        // === RADAR PREVIEW (right column bottom) ===
        const previewSection = document.createElement('div');
        previewSection.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;';
        rightBottom.appendChild(previewSection);
        
        const previewTitle = document.createElement('div');
        previewTitle.textContent = 'RADAR';
        previewTitle.style.cssText = 'color:#6af;font-size:14px;font-weight:bold;text-transform:uppercase;letter-spacing:3px;text-shadow:0 0 8px rgba(100,170,255,0.5);';
        previewSection.appendChild(previewTitle);
        
        const previewCanvas = document.createElement('canvas');
        previewCanvas.width = 300;
        previewCanvas.height = 300;
        previewCanvas.style.cssText = 'background:rgba(5,10,20,0.85);border:1px solid rgba(80,140,220,0.4);border-radius:4px;';
        previewCanvas.id = 'radar-preview-canvas';
        previewSection.appendChild(previewCanvas);
        
        // Inject CSS rule to always hide cursor on radar preview
        const radarCursorStyle = document.createElement('style');
        radarCursorStyle.textContent = '#radar-preview-canvas { cursor: none !important; }';
        document.head.appendChild(radarCursorStyle);
        
        // Track mouse position for cursor preview
        let cursorPreviewPos = null;
        previewCanvas.addEventListener('mousemove', (e) => {
            const rect = previewCanvas.getBoundingClientRect();
            cursorPreviewPos = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
            if (typeof drawHeatmapPreview === 'function') drawHeatmapPreview();
        });
        previewCanvas.addEventListener('mouseleave', () => {
            cursorPreviewPos = null;
            if (typeof drawHeatmapPreview === 'function') drawHeatmapPreview();
        });
        
        const previewInfo = document.createElement('div');
        previewInfo.style.cssText = 'color:#aaa;font-size:14px;text-align:center;';
        previewInfo.innerHTML = `<span id="preview-sectors" style="color:#0f0">${heatmapSectors}</span>×<span id="preview-rings" style="color:#0f0">${heatmapRings}</span> = <span id="preview-total" style="color:#0f0">${heatmapSectors * heatmapRings}</span> cells`;
        previewSection.appendChild(previewInfo);
        
        // Draw radar preview function
        window.drawHeatmapPreview = function() {
            const ctx = previewCanvas.getContext('2d');
            const w = previewCanvas.width, h = previewCanvas.height;
            const cx = w / 2, cy = h / 2;
            
            ctx.clearRect(0, 0, w, h);
            
            // Draw screen rectangle (subtle neon border)
            const screenMargin = 10;
            ctx.strokeStyle = 'rgba(60, 100, 160, 0.35)';
            ctx.lineWidth = 1;
            ctx.strokeRect(screenMargin, screenMargin, w - screenMargin * 2, h - screenMargin * 2);
            
            // Screen area label
            ctx.fillStyle = 'rgba(80, 130, 200, 0.4)';
            ctx.font = '10px monospace';
            ctx.fillText('SCREEN', screenMargin + 4, screenMargin + 12);
            
            // Calculate radii based on distance settings (0-100 maps to small-large)
            const maxPossibleR = Math.min(cx, cy) - screenMargin - 5;
            const radarRatio = avoidanceSensitivity / 100;
            const collisionRatio = collisionSensitivity / 100;
            const radarR = maxPossibleR * (0.2 + radarRatio * 0.8); // Outer - radar/detection
            const collisionR = maxPossibleR * (0.2 + collisionRatio * 0.8); // Inner - collision/avoidance
            
            // Subtle background gradient for radar zone
            const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radarR);
            bgGrad.addColorStop(0, 'rgba(15, 25, 45, 0.7)');
            bgGrad.addColorStop(0.6, 'rgba(20, 30, 50, 0.4)');
            bgGrad.addColorStop(1, 'rgba(10, 20, 35, 0.2)');
            ctx.fillStyle = bgGrad;
            ctx.beginPath();
            ctx.arc(cx, cy, radarR, 0, Math.PI * 2);
            ctx.fill();
            
            // Outer RADAR circle border (subtle cyan neon)
            ctx.strokeStyle = 'rgba(60, 140, 220, 0.6)';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([6, 4]);
            ctx.beginPath();
            ctx.arc(cx, cy, radarR, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
            
            // Inner COLLISION circle border (subtle orange neon)
            if (collisionR > 0 && collisionR < radarR) {
                ctx.strokeStyle = 'rgba(255, 130, 50, 0.6)';
                ctx.lineWidth = 1.5;
                ctx.setLineDash([5, 3]);
                ctx.beginPath();
                ctx.arc(cx, cy, collisionR, 0, Math.PI * 2);
                ctx.stroke();
                ctx.setLineDash([]);
            }
            
            // Food search radius (subtle yellow fill)
            const foodR = collisionR * foodSearchMultiplier;
            if (foodR > 0 && foodSearchMultiplier > 0) {
                ctx.fillStyle = 'rgba(220, 200, 50, 0.08)';
                ctx.beginPath();
                ctx.arc(cx, cy, Math.min(foodR, maxPossibleR), 0, Math.PI * 2);
                ctx.fill();
            }
            
            const sectors = heatmapSectors, rings = heatmapRings;
            const ringStep = radarR / rings;
            
            // Sample hot spots (threats) - subtle neon red
            const hotSpots = [
                { ai: Math.floor(sectors * 0.1), ri: 0, heat: 0.9 },
                { ai: Math.floor(sectors * 0.5), ri: 1, heat: 0.7 },
                { ai: Math.floor(sectors * 0.75), ri: 0, heat: 0.5 },
            ];
            for (const spot of hotSpots) {
                if (spot.ri >= rings) continue;
                const rIn = spot.ri * ringStep, rOut = (spot.ri + 1) * ringStep;
                const a0 = (spot.ai / sectors) * Math.PI * 2 - Math.PI / 2;
                const a1 = ((spot.ai + 1) / sectors) * Math.PI * 2 - Math.PI / 2;
                ctx.beginPath();
                ctx.moveTo(cx + Math.cos(a0) * rIn, cy + Math.sin(a0) * rIn);
                ctx.arc(cx, cy, rIn, a0, a1);
                ctx.lineTo(cx + Math.cos(a1) * rOut, cy + Math.sin(a1) * rOut);
                ctx.arc(cx, cy, rOut, a1, a0, true);
                ctx.closePath();
                ctx.fillStyle = `rgba(255, ${Math.floor(60 - spot.heat * 60)}, ${Math.floor(30 - spot.heat * 30)}, ${0.2 + spot.heat * 0.3})`;
                ctx.fill();
            }
            
            // Ring circles - very subtle
            ctx.strokeStyle = 'rgba(200, 80, 80, 0.15)';
            ctx.lineWidth = 0.5;
            for (let ri = 1; ri <= rings; ri++) {
                ctx.beginPath();
                ctx.arc(cx, cy, ri * ringStep, 0, Math.PI * 2);
                ctx.stroke();
            }
            
            // Sector lines - very subtle
            ctx.strokeStyle = 'rgba(180, 80, 80, 0.1)';
            for (let ai = 0; ai < sectors; ai++) {
                const ang = (ai / sectors) * Math.PI * 2;
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(cx + Math.cos(ang) * radarR, cy + Math.sin(ang) * radarR);
                ctx.stroke();
            }
            
            // Center dot (player) - subtle neon green
            ctx.beginPath();
            ctx.arc(cx, cy, 3, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(80, 255, 120, 0.9)';
            ctx.fill();
            
            // Distance labels - subtle neon colors
            ctx.font = '9px monospace';
            ctx.textAlign = 'center';
            // Radar label (cyan)
            ctx.fillStyle = 'rgba(60, 140, 220, 0.8)';
            ctx.fillText(`Radar: ${avoidanceSensitivity}%`, cx - 60, cy + radarR + 14);
            // Collision label (orange)
            ctx.fillStyle = 'rgba(255, 130, 50, 0.8)';
            ctx.fillText(`Avoid: ${collisionSensitivity}%`, cx, cy + radarR + 14);
            // Food label (yellow)
            ctx.fillStyle = 'rgba(220, 200, 50, 0.8)';
            ctx.fillText(`Food: ×${foodSearchMultiplier.toFixed(1)}`, cx + 60, cy + radarR + 14);
            ctx.textAlign = 'left';
            
            // Draw cursor preview if mouse is over canvas
            if (cursorPreviewPos) {
                const halfSize = CURSOR_SIZE / 2;
                
                // Draw crosshair cursor (matches actual game cursor)
                ctx.strokeStyle = `rgba(255, 255, 255, ${CURSOR_OPACITY * 0.8})`;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                // Vertical line
                ctx.moveTo(cursorPreviewPos.x, cursorPreviewPos.y - halfSize);
                ctx.lineTo(cursorPreviewPos.x, cursorPreviewPos.y + halfSize);
                // Horizontal line
                ctx.moveTo(cursorPreviewPos.x - halfSize, cursorPreviewPos.y);
                ctx.lineTo(cursorPreviewPos.x + halfSize, cursorPreviewPos.y);
                ctx.stroke();
                
                // Cursor info label
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.font = '9px monospace';
                ctx.textAlign = 'center';
                ctx.fillText(`${CURSOR_SIZE}px @ ${(CURSOR_OPACITY * 100).toFixed(0)}%`, cursorPreviewPos.x, cursorPreviewPos.y + halfSize + 14);
                ctx.textAlign = 'left';
            }
            
            // Update info text
            const totalCells = sectors * rings;
            const color = totalCells > 400 ? '#f80' : totalCells > 200 ? '#ff0' : '#0f0';
            const sectorsEl = document.getElementById('preview-sectors');
            const ringsEl = document.getElementById('preview-rings');
            const totalEl = document.getElementById('preview-total');
            if (sectorsEl) sectorsEl.textContent = sectors;
            if (ringsEl) ringsEl.textContent = rings;
            if (totalEl) { totalEl.textContent = totalCells; totalEl.style.color = color; }
        };
        
        // Initial draw
        drawHeatmapPreview();
        
        // The container is always visible now since it contains UI settings and stance
        sensitivitySliderContainer.style.display = "flex";

        const autoAvoidToggle = settingsPopup?.querySelector("#toggle-auto-avoid");
        if (autoAvoidToggle) {
            autoAvoidToggle.onchange = function(e) {
                autoAvoidEnabled = this.checked;
                savePersistentData();
                updateAvoidanceSliderVisibility();
                // Sync the new toggle
                const newToggle = document.querySelector('#toggle-auto-avoid-2');
                if (newToggle) newToggle.checked = autoAvoidEnabled;
            };
        }
    }

    /********** Overlay Canvas **********/
    let overlayCanvas = null;
    let overlayCtx = null;
    let statusDiv = null;
    let useRedrawSync = false; // when true, draw overlay in game's redraw pass

    function getMySnake() {
        // First, prefer the explicit global if present
        if (win.snake && typeof win.snake.xx === 'number' && typeof win.snake.yy === 'number') {
            return win.snake;
        }
        // Fallback: pick the snake closest to the screen center (camera is centered on the player)
        const arr = win.slithers;
        if (!arr || !Array.isArray(arr) || arr.length === 0 || !win.gsc) return null;
        const viewX = win.view_xx || 0;
        const viewY = win.view_yy || 0;
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        let best = null;
        let bestDist = Infinity;
        for (const s of arr) {
            if (!s || typeof s.xx !== 'number' || typeof s.yy !== 'number') continue;
            const sx = (s.xx - viewX) * win.gsc + window.innerWidth / 2;
            const sy = (s.yy - viewY) * win.gsc + window.innerHeight / 2;
            const dx = sx - cx;
            const dy = sy - cy;
            const d2 = dx*dx + dy*dy;
            if (d2 < bestDist) { bestDist = d2; best = s; }
        }
        return best;
    }

    function createOverlayCanvas() {
        overlayCanvas = document.createElement("canvas");
        overlayCanvas.id = "mod-overlay";
        overlayCanvas.style.position = "absolute";
        overlayCanvas.style.left = "0";
        overlayCanvas.style.top = "0";
        overlayCanvas.style.pointerEvents = "none";
        overlayCanvas.style.zIndex = "10000";
        document.body.appendChild(overlayCanvas);
    // Small status HUD
    statusDiv = document.createElement('div');
    statusDiv.id = 'mod-status';
    statusDiv.style.position = 'fixed';
    statusDiv.style.right = '10px';
    statusDiv.style.top = '10px';
    statusDiv.style.padding = '6px 8px';
    statusDiv.style.background = 'rgba(0,0,0,0.5)';
    statusDiv.style.color = '#fff';
    statusDiv.style.font = '12px/1.2 monospace';
    statusDiv.style.zIndex = '10005';
    document.body.appendChild(statusDiv);
        resizeOverlayCanvas();

        window.addEventListener("resize", resizeOverlayCanvas);
    requestAnimationFrame(updateModOverlay);
    }

    function resizeOverlayCanvas() {
        if (overlayCanvas) {
            overlayCanvas.width = window.innerWidth;
            overlayCanvas.height = window.innerHeight;
            overlayCtx = overlayCanvas.getContext("2d");
        }
    }

    // ============ Real-time Polar Threat Heatmap (rAF-synced) ============
    // Bins nearby heads/segments into angle×radius sectors centered on our head.
    // Resolution is configurable: sectors (angular) and rings (radial) like HDD addressing.
    
    // Calculate max screen radius in game units (distance from center to nearest edge)
    // This dynamically adjusts based on current zoom so circles always cover
    // the same proportion of visible screen regardless of zoom level
    function getScreenRadiusInGameUnits() {
        const gsc = win.gsc || 0.9;
        const halfW = (window.innerWidth || 1920) / 2;
        const halfH = (window.innerHeight || 1080) / 2;
        // Distance from center to nearest EDGE (not corner) - matches preview behavior
        const edgeDist = Math.min(halfW, halfH);
        return edgeDist / gsc;
    }
    
    // Get the effective RADAR radius (outer blue circle - detection/heatmap range)
    // Based on avoidanceSensitivity slider (0-100)
    // Returns radius in GAME UNITS that scales with zoom to maintain screen proportion
    function getRadarRadius() {
        if (avoidanceSensitivity <= 0) return 0;
        // maxRadius is recalculated each frame based on current gsc (zoom)
        // so the circle always covers the same screen proportion
        const maxRadius = getScreenRadiusInGameUnits();
        // 0% = 20% of screen edge, 100% = 100% of screen edge
        return maxRadius * (0.2 + (avoidanceSensitivity / 100) * 0.8);
    }
    
    // Get the effective COLLISION radius (inner orange circle - actual avoidance range)
    // Based on collisionSensitivity slider (0-100), capped at radar radius
    // Returns radius in GAME UNITS that scales with zoom to maintain screen proportion
    function getCollisionAvoidRadius() {
        if (collisionSensitivity <= 0) return 0;
        const maxRadius = getScreenRadiusInGameUnits();
        const raw = maxRadius * (0.2 + (collisionSensitivity / 100) * 0.8);
        // Can't exceed radar radius
        return Math.min(raw, getRadarRadius());
    }
    
    // Legacy alias for heatmap config (uses radar radius)
    function getEffectiveRadius() {
        return getRadarRadius();
    }
    
    // Use getHeatmapCfg() to get current config with live values
    function getHeatmapCfg() {
        const effectiveRadius = getEffectiveRadius();
        const dynamicRingStep = effectiveRadius / heatmapRings;
        return {
            angBins: heatmapSectors,   // sectors (angular divisions)
            radBins: heatmapRings,     // rings (radial divisions)
            ringStep: dynamicRingStep, // world units per ring (dynamic based on radius)
            headWeight: 5.0,           // heads are HOT - main threat
            segWeight: 0.3,            // body segments less hot
            decay: 0.85,               // fast decay to clear stale heat
            maxDist: effectiveRadius   // max distance is the effective radius
        };
    }
    // Heatmap configuration object with dynamic getters
    const heatmapCfg = {
        get angBins() { return heatmapSectors; },
        get radBins() { return heatmapRings; },
        get ringStep() { return getEffectiveRadius() / heatmapRings; },
        headWeight: 5.0,
        segWeight: 0.3,
        decay: 0.85,
        get maxDist() { return getEffectiveRadius(); }
    };
    let heatGrid = null; // Float32Array of size angBins*radBins
    let lastHeatGridSize = 0; // Track size to detect resolution changes
    function ensureHeatGrid(){
        const n = heatmapSectors * heatmapRings;
        if (!heatGrid || heatGrid.length !== n || lastHeatGridSize !== n) {
            heatGrid = new Float32Array(n);
            lastHeatGridSize = n;
        }
    }
    function heatIndex(ai, ri){ return ri * heatmapSectors + ai; }
    // --- Position helpers ---
    // For OVERLAY: use raw positions only (no interpolation offsets) for accurate real-time display
    function rawHeadX(s){ return (s && typeof s.xx === 'number') ? s.xx : 0; }
    function rawHeadY(s){ return (s && typeof s.yy === 'number') ? s.yy : 0; }
    function rawPtX(p){ 
        if (!p) return 0;
        if (typeof p.xx === 'number') return p.xx;
        if (typeof p.x === 'number') return p.x;
        if (Array.isArray(p)) return p[0] || 0;
        return 0;
    }
    function rawPtY(p){ 
        if (!p) return 0;
        if (typeof p.yy === 'number') return p.yy;
        if (typeof p.y === 'number') return p.y;
        if (Array.isArray(p)) return p[1] || 0;
        return 0;
    }
    // For HEATMAP: use smoothed positions (with interpolation) for less jittery heatmap
    function effHeadX(s){ const fx = (s && typeof s.fx === 'number') ? s.fx : 0; return (s && typeof s.xx === 'number' ? s.xx : 0) + fx; }
    function effHeadY(s){ const fy = (s && typeof s.fy === 'number') ? s.fy : 0; return (s && typeof s.yy === 'number' ? s.yy : 0) + fy; }
    function effPtX(p){ const fx = (p && typeof p.fx === 'number') ? p.fx : 0; const px = (p && (typeof p.xx === 'number' ? p.xx : (typeof p.x === 'number' ? p.x : Array.isArray(p)?p[0]:0))) || 0; return px + fx; }
    function effPtY(p){ const fy = (p && typeof p.fy === 'number') ? p.fy : 0; const py = (p && (typeof p.yy === 'number' ? p.yy : (typeof p.y === 'number' ? p.y : Array.isArray(p)?p[1]:0))) || 0; return py + fy; }
    function atten(val){ return val; }
    function heatColor(v, vmax){
        const t = Math.max(0, Math.min(1, vmax>0 ? (v/vmax) : 0));
        const a = 0.12 + t * 0.45;
        return `rgba(255,0,0,${a.toFixed(3)})`;
    }
    function predictPt(cx, cy, lx, ly, f){ if(lx==null||ly==null) return [cx,cy]; return [cx+(cx-lx)*f, cy+(cy-ly)*f]; }
    function accumulatePolar(cx, cy, px, py, w){
        const dx = px - cx, dy = py - cy; const r = Math.hypot(dx, dy);
        if (r <= 1 || r > heatmapCfg.maxDist) return;
        const riFloat = r / heatmapCfg.ringStep; const ri = Math.max(0, Math.min(heatmapCfg.radBins-1, Math.floor(riFloat)));
        const rt = riFloat - ri;
        let ang = Math.atan2(dy, dx); if (ang < 0) ang += Math.PI*2;
        const aiFloat = ang / (Math.PI*2) * heatmapCfg.angBins; const ai = Math.floor(aiFloat) % heatmapCfg.angBins;
        const at = aiFloat - ai; const ai2 = (ai+1) % heatmapCfg.angBins; const ri2 = Math.min(heatmapCfg.radBins-1, ri+1);
        const w00 = (1-at)*(1-rt), w10 = at*(1-rt), w01 = (1-at)*rt, w11 = at*rt;
        const base = w / (1 + r*0.01);
        heatGrid[heatIndex(ai, ri)] += base * w00;
        heatGrid[heatIndex(ai2,ri)] += base * w10;
        heatGrid[heatIndex(ai, ri2)] += base * w01;
        heatGrid[heatIndex(ai2,ri2)] += base * w11;
    }
    function buildThreatHeat(mySnake){
        if (!mySnake || !Array.isArray(win.slithers)) return {cx:0, cy:0, vmax:0};
        ensureHeatGrid();
        // Use configurable decay (0 = instant clear, 1 = never fades)
        // Lower values = faster response to new threats
        for (let i=0;i<heatGrid.length;i++) heatGrid[i] *= heatDecay;
        // Use view position as center (matches screen center)
        const cx = win.view_xx || mySnake.xx;
        const cy = win.view_yy || mySnake.yy;
        let vmax = 0;
        for (const s of win.slithers){
            if (!s || s===mySnake || s.dead) continue;
            // head - use interpolated position to match game rendering
            const hx = effHeadX(s), hy = effHeadY(s);
            accumulatePolar(cx, cy, hx, hy, heatmapCfg.headWeight);
            
            // VELOCITY PREDICTION: project head forward based on snake's movement
            // This helps detect incoming threats before they arrive
            const sAng = s.ehang != null ? s.ehang : (s.ang || 0);
            // Estimate speed (boosting snakes move faster)
            const isBoosting = s.sp && s.sp > 10;
            const speed = isBoosting ? 18 : 11; // approximate pixels per frame
            // Project 3-5 frames ahead for prediction
            for (let frame = 1; frame <= 5; frame++) {
                const projDist = speed * frame;
                const projX = hx + Math.cos(sAng) * projDist;
                const projY = hy + Math.sin(sAng) * projDist;
                // Higher weight for closer projected positions
                const projWeight = heatmapCfg.headWeight * (1.0 - frame * 0.15);
                accumulatePolar(cx, cy, projX, projY, projWeight);
            }
            
            // sparse body sampling - use interpolated positions
            const pts = s.pts || [];
            const step = Math.max(4, (threatSampleStep||1)*2);
            for (let i=0;i<pts.length;i+=step){
                const p = pts[i]; if (!p) continue;
                const bx = effPtX(p);
                const by = effPtY(p);
                if (typeof bx !== 'number' || typeof by !== 'number') continue;
                accumulatePolar(cx, cy, bx, by, heatmapCfg.segWeight);
            }
        }
        // find vmax
        for (let i=0;i<heatGrid.length;i++) if (heatGrid[i]>vmax) vmax = heatGrid[i];
        return {cx, cy, vmax};
    }
    function drawThreatHeat(ctx, mySnake, viewX, viewY, gsc){
        if (!ctx || !mySnake || !heatGrid) return;
        let vmax = 0; for (let i=0;i<heatGrid.length;i++) if (heatGrid[i]>vmax) vmax = heatGrid[i];
        // Player is always at screen center
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        for (let ri=0; ri<heatmapCfg.radBins; ri++){
            const rIn = (ri * heatmapCfg.ringStep) * gsc;
            const rOut= ((ri+1) * heatmapCfg.ringStep) * gsc;
            for (let ai=0; ai<heatmapCfg.angBins; ai++){
                const v = heatGrid[heatIndex(ai, ri)]; if (v <= 0.001) continue;
                const a0 = ai / heatmapCfg.angBins * Math.PI*2;
                const a1 = (ai+1) / heatmapCfg.angBins * Math.PI*2;
                ctx.beginPath();
                // sector path in screen space
                ctx.moveTo(cx + Math.cos(a0)*rIn, cy + Math.sin(a0)*rIn);
                ctx.arc(cx, cy, rIn, a0, a1);
                ctx.lineTo(cx + Math.cos(a1)*rOut, cy + Math.sin(a1)*rOut);
                ctx.arc(cx, cy, rOut, a1, a0, true);
                ctx.closePath();
                ctx.fillStyle = heatColor(v, vmax);
                ctx.fill();
            }
        }
    }

    /********** Zoom Handling **********/
function modifyResize() {
    if (win.resize) {
        const originalResize = win.resize;
        win.resize = function() {
            const currentZoom = customZoomLevel || 0.9;
            originalResize.apply(win, arguments);
            win.gsc = customZoomLevel = currentZoom;
            // Fallback: Force gsc in case Slither.io overrides it immediately
            setTimeout(() => {
                if (win.gsc !== customZoomLevel) {
                    win.gsc = customZoomLevel;
                }
            }, 0);
        };
    } else {
        setTimeout(modifyResize, 100);
    }
}

    modifyResize();



    function handleZoom(e) {
        try {
            if (!win.gsc || !win.playing) return;
            customZoomLevel *= Math.pow(0.9, e.wheelDelta / -120 || e.detail / 2 || 0);
            win.gsc = customZoomLevel;
        } catch (err) {
            // Error in handleZoom
        }
    }

    function restoreZoom() {
        try {
            customZoomLevel = 0.9;
            win.gsc = customZoomLevel;
        } catch (err) {
            // Error in restoreZoom
        }
    }

    /********** Key Bindings **********/
    function handleKeyBindings(ev) {
        try {
            switch (ev.keyCode) {
                case 27: quickRespawn(); break;
                case 81: quitToMenu(); break;
                case 90: restoreZoom(); break;
                case 9: toggleSettingsPopup(); break;
                case 69: // E key for Auto-Eat
                    autoEatEnabled = !autoEatEnabled;
                    savePersistentData();
                    // Clear TSP plan when disabling auto-eat
                    if (!autoEatEnabled) {
                        tspPlan = { route: [], idx: 0, expiresAt: 0 };
                        foodTarget = null;
                    }
                    // Sync checkbox UI if present
                    const eatToggleEl = document.getElementById("toggle-auto-eat");
                    if (eatToggleEl) eatToggleEl.checked = autoEatEnabled;
                    break;
                case 67: // C key for Auto-Avoid
                    autoAvoidEnabled = !autoAvoidEnabled;
                    savePersistentData();
                    updateAvoidanceSliderVisibility();
                    // Sync checkbox UI if present
                    const avoidToggleEl = document.getElementById("toggle-auto-avoid");
                    if (avoidToggleEl) avoidToggleEl.checked = autoAvoidEnabled;
                    break;
            }
        } catch (err) {
        }
    }

    /********** Settings Popup **********/
    function createSettingsPopup() {
        settingsPopup = document.createElement("div");
        settingsPopup.id = "settings-popup";
        settingsPopup.style.position = "fixed";
        settingsPopup.style.top = "8%";
        settingsPopup.style.left = "10%";
        settingsPopup.style.width = "80%";
        settingsPopup.style.height = "80%";
        settingsPopup.style.background = "rgba(20, 20, 35, 0.97)";
        settingsPopup.style.color = "#FFF";
        settingsPopup.style.zIndex = "10003";
        settingsPopup.style.border = "1px solid rgba(255,255,255,0.4)";
        settingsPopup.style.borderRadius = "10px";
        settingsPopup.style.padding = "15px";
        settingsPopup.style.overflowY = "auto";
        settingsPopup.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
        settingsPopup.style.boxShadow = "0px 0px 15px rgba(0,0,0,0.5)";
        settingsPopup.style.display = "none";
        document.body.appendChild(settingsPopup);

        const titleBar = document.createElement("div");
        titleBar.style.display = "flex";
        titleBar.style.justifyContent = "space-between";
        titleBar.style.alignItems = "center";
        titleBar.style.marginBottom = "10px";
        settingsPopup.appendChild(titleBar);

        let title = document.createElement("div");
        title.textContent = "Mod Settings";
        title.style.fontSize = "22px";
        title.style.flex = "1";
        title.style.textAlign = "center";
        titleBar.appendChild(title);

        let closeBtn = document.createElement("button");
        closeBtn.textContent = "Close";
        closeBtn.style.background = "#900";
        closeBtn.style.color = "#FFF";
        closeBtn.style.border = "none";
        closeBtn.style.borderRadius = "5px";
        closeBtn.style.cursor = "pointer";
        closeBtn.style.padding = "5px 10px";
        closeBtn.onclick = toggleSettingsPopup;
        titleBar.appendChild(closeBtn);

        // Content wrapper (no tabs needed - single settings page)
        const settingsWrap = document.createElement("div");
        settingsWrap.id = "hsm-tabc-general";
        settingsWrap.style.cssText = 'padding:6px 2px;height:calc(100% - 50px);display:flex;flex-direction:column;';
        settingsPopup.appendChild(settingsWrap);

        // Host for controls dock - fills available space
        const controlsHost = document.createElement("div");
        controlsHost.id = "hsm-controls-host";
        controlsHost.style.cssText = 'display:flex;flex-direction:column;gap:8px;flex:1;height:100%;';
        settingsWrap.appendChild(controlsHost);

        const optionsBar = document.createElement("div");
        optionsBar.style.display = "none"; // Hidden - controls moved to organized boxes
        optionsBar.style.alignItems = "center";
        optionsBar.style.gap = "15px";
        optionsBar.style.padding = "10px";
        optionsBar.style.background = "rgba(0, 0, 0, 0.2)";
        optionsBar.style.borderRadius = "5px";
        optionsBar.style.marginBottom = "12px";
        settingsWrap.appendChild(optionsBar);

        let bgToggleContainer = document.createElement("div");
        bgToggleContainer.style.display = "flex";
        bgToggleContainer.style.alignItems = "center";
        optionsBar.appendChild(bgToggleContainer);

        let bgToggle = document.createElement("input");
        bgToggle.type = "checkbox";
        bgToggle.id = "toggle-default-bg";
        let storedBgToggle = win.localStorage.getItem(STORAGE_KEYS.defaultBgEnabled) || "false";
        bgToggle.checked = storedBgToggle === "true";
        bgToggle.style.marginRight = "4px";
        bgToggle.onchange = function() {
            win.localStorage.setItem(STORAGE_KEYS.defaultBgEnabled, bgToggle.checked ? "true" : "false");
            if (win.playing) backgroundNeedsUpdate = true;
        };
        bgToggleContainer.appendChild(bgToggle);

        let bgToggleLabel = document.createElement("label");
        bgToggleLabel.textContent = "Default BG";
        bgToggleLabel.style.color = "#fff";
        bgToggleLabel.style.fontSize = "12px";
        bgToggleLabel.setAttribute("for", "toggle-default-bg");
        bgToggleContainer.appendChild(bgToggleLabel);

        const colorPickerContainer = document.createElement("div");
        colorPickerContainer.style.display = "flex";
        colorPickerContainer.style.alignItems = "center";
        colorPickerContainer.style.position = "relative";
        optionsBar.appendChild(colorPickerContainer);

        const colorLabel = document.createElement("span");
        colorLabel.textContent = "BG Color:";
        colorLabel.style.marginRight = "8px";
        colorLabel.style.fontSize = "12px";
        colorPickerContainer.appendChild(colorLabel);

        const colorSwatch = document.createElement("div");
        colorSwatch.style.width = "20px";
        colorSwatch.style.height = "20px";
        colorSwatch.style.border = "1px solid rgba(255,255,255,0.6)";
        colorSwatch.style.borderRadius = "4px";
        colorSwatch.style.cursor = "pointer";
        colorSwatch.style.backgroundColor = win.localStorage.getItem(STORAGE_KEYS.bgColor) || DEFAULT_BG_COLOR;
        colorPickerContainer.appendChild(colorSwatch);

        const colorPicker = document.createElement("div");
        colorPicker.style.position = "absolute";
        colorPicker.style.top = "30px";
        colorPicker.style.left = "0";
        colorPicker.style.background = "rgba(30, 30, 40, 0.95)";
        colorPicker.style.border = "1px solid rgba(255,255,255,0.3)";
        colorPicker.style.borderRadius = "6px";
        colorPicker.style.padding = "10px";
        colorPicker.style.display = "none";
        colorPicker.style.zIndex = "10004";
        colorPicker.style.width = "200px";
        colorPickerContainer.appendChild(colorPicker);

        const swatchTypeContainer = document.createElement("div");
        swatchTypeContainer.style.marginBottom = "10px";
        colorPicker.appendChild(swatchTypeContainer);

        const swatchTypeLabel = document.createElement("span");
        swatchTypeLabel.textContent = "Swatch Type: ";
        swatchTypeLabel.style.marginRight = "5px";
        swatchTypeContainer.appendChild(swatchTypeLabel);

        const swatchTypeSelect = document.createElement("select");
        swatchTypeSelect.style.background = "rgba(255,255,255,0.1)";
        swatchTypeSelect.style.color = "#FFF";
        swatchTypeSelect.style.border = "1px solid #666";
        swatchTypeSelect.style.borderRadius = "4px";
        swatchTypeSelect.style.padding = "2px";
        swatchTypeContainer.appendChild(swatchTypeSelect);

        const swatchTypes = [
            { value: "darkGrey", label: "Dark Grey Tones" },
            { value: "lightGrey", label: "Light Grey Tones" },
            { value: "rainbow", label: "Rainbow" },
            { value: "fullSpectrum", label: "Full Spectrum" }
        ];
        swatchTypes.forEach(type => {
            const option = document.createElement("option");
            option.value = type.value;
            option.textContent = type.label;
            swatchTypeSelect.appendChild(option);
        });

        const swatchOptions = {
            darkGrey: ["#0A0A0A", "#141414", "#1E1E1E", "#282828", "#323232", "#3C3C3C", "#464646", "#505050", "#5A5A5A", "#646464", "#6E6E6E", "#787878", "#828282", "#8C8C8C", "#969696", "#2D2D2D", "#373737", "#414141"],
            lightGrey: ["#AAAAAA", "#BBBBBB", "#CCCCCC", "#DDDDDD", "#EEEEEE", "#F5F5F5", "#999999", "#A9A9A9", "#B9B9B9", "#C9C9C9", "#D9D9D9", "#E9E9E9"],
            rainbow: ["#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF", "#4B0082", "#8A2BE2", "#FF00FF", "#FF1493", "#00CED1", "#FFD700", "#ADFF2F"],
            fullSpectrum: ["#FF0000", "#FF4500", "#FFA500", "#FFFF00", "#ADFF2F", "#00FF00", "#00CED1", "#00B7EB", "#0000FF", "#8A2BE2", "#FF00FF", "#FF1493"]
        };

        const swatchContainer = document.createElement("div");
        swatchContainer.style.display = "grid";
        swatchContainer.style.gridTemplateColumns = "repeat(6, 20px)";
        swatchContainer.style.gap = "4px";
        swatchContainer.style.marginBottom = "10px";
        colorPicker.appendChild(swatchContainer);

        function updateSwatches(type) {
            swatchContainer.innerHTML = "";
            const colors = swatchOptions[type] || swatchOptions.darkGrey;
            colors.forEach(color => {
                const swatch = document.createElement("div");
                swatch.style.width = "20px";
                swatch.style.height = "20px";
                swatch.style.backgroundColor = color;
                swatch.style.border = "1px solid rgba(255,255,255,0.2)";
                swatch.style.borderRadius = "2px";
                swatch.style.cursor = "pointer";
                swatch.onclick = (e) => {
                    e.stopPropagation();
                    updateColor(color);
                };
                swatchContainer.appendChild(swatch);
            });
        }

        updateSwatches(swatchTypeSelect.value);
        swatchTypeSelect.onchange = () => updateSwatches(swatchTypeSelect.value);

        const colorInputContainer = document.createElement("div");
        colorInputContainer.style.display = "flex";
        colorInputContainer.style.flexDirection = "column";
        colorInputContainer.style.gap = "8px";
        colorPicker.appendChild(colorInputContainer);

        const hexContainer = document.createElement("div");
        hexContainer.style.display = "flex";
        hexContainer.style.alignItems = "center";
        hexContainer.style.gap = "5px";
        colorInputContainer.appendChild(hexContainer);

        const hexLabel = document.createElement("span");
        hexLabel.textContent = "Hex:";
        hexLabel.style.width = "30px";
        hexContainer.appendChild(hexLabel);

        const hexInput = document.createElement("input");
        hexInput.type = "text";
        hexInput.placeholder = "#2a2a2a";
        hexInput.style.width = "80px";
        hexInput.style.padding = "3px";
        hexInput.style.border = "1px solid #666";
        hexInput.style.borderRadius = "4px";
        hexInput.style.background = "rgba(255,255,255,0.1)";
        hexInput.style.color = "#FFF";
        hexContainer.appendChild(hexInput);

        const rgbContainer = document.createElement("div");
        rgbContainer.style.display = "flex";
        rgbContainer.style.gap = "5px";
        colorInputContainer.appendChild(rgbContainer);

        const rInput = document.createElement("input");
        rInput.type = "number";
        rInput.min = "0";
        rInput.max = "255";
        rInput.placeholder = "R";
        rInput.style.width = "50px";
        rInput.style.padding = "3px";
        rInput.style.border = "1px solid #666";
        rInput.style.borderRadius = "4px";
        rInput.style.background = "rgba(255,255,255,0.1)";
        rInput.style.color = "#FFF";
        rgbContainer.appendChild(rInput);

        const gInput = document.createElement("input");
        gInput.type = "number";
        gInput.min = "0";
        gInput.max = "255";
        gInput.placeholder = "G";
        gInput.style.width = "50px";
        gInput.style.padding = "3px";
        gInput.style.border = "1px solid #666";
        gInput.style.borderRadius = "4px";
        gInput.style.background = "rgba(255,255,255,0.1)";
        gInput.style.color = "#FFF";
        rgbContainer.appendChild(gInput);

        const bInput = document.createElement("input");
        bInput.type = "number";
        bInput.min = "0";
        bInput.max = "255";
        bInput.placeholder = "B";
        bInput.style.width = "50px";
        bInput.style.padding = "3px";
        bInput.style.border = "1px solid #666";
        bInput.style.borderRadius = "4px";
        bInput.style.background = "rgba(255,255,255,0.1)";
        bInput.style.color = "#FFF";
        rgbContainer.appendChild(bInput);

        function updateColor(color) {
            color = color.toLowerCase();
            if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
                const r = parseInt(color.slice(1, 3), 16);
                const g = parseInt(color.slice(3, 5), 16);
                const b = parseInt(color.slice(5, 7), 16);
                hexInput.value = color;
                rInput.value = r;
                gInput.value = g;
                bInput.value = b;
                colorSwatch.style.backgroundColor = color;
                win.localStorage.setItem(STORAGE_KEYS.bgColor, color);
                if (win.playing && !bgToggle.checked) {
                    setCustomBackgroundColor(color);
                }
            }
        }

        function updateFromHex() {
            let hex = hexInput.value.trim().replace(/^#/, "");
            if (/^[0-9A-Fa-f]{6}$/.test(hex)) {
                updateColor(`#${hex}`);
            }
        }

        function updateFromRGB() {
            const r = Math.min(255, Math.max(0, parseInt(rInput.value) || 0));
            const g = Math.min(255, Math.max(0, parseInt(gInput.value) || 0));
            const b = Math.min(255, Math.max(0, parseInt(bInput.value) || 0));
            const hex = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
            updateColor(hex);
        }

        function loadColor() {
            const color = win.localStorage.getItem(STORAGE_KEYS.bgColor) || DEFAULT_BG_COLOR;
            updateColor(color);
        }

        colorSwatch.onclick = (e) => {
            e.stopPropagation();
            const isHidden = colorPicker.style.display === "none" || colorPicker.style.display === "";
            colorPicker.style.display = isHidden ? "block" : "none";
            if (isHidden) loadColor();
        };

        hexInput.oninput = updateFromHex;
        rInput.oninput = updateFromRGB;
        gInput.oninput = updateFromRGB;
        bInput.oninput = updateFromRGB;

        document.addEventListener("click", (e) => {
            if (!colorPickerContainer.contains(e.target) && colorPicker.style.display === "block") {
                colorPicker.style.display = "none";
            }
        });

        const cursorSizeContainer = document.createElement("div");
        cursorSizeContainer.style.display = "flex";
        cursorSizeContainer.style.alignItems = "center";
        cursorSizeContainer.style.gap = "8px";
        optionsBar.appendChild(cursorSizeContainer);

        const cursorSizeLabel = document.createElement("span");
        cursorSizeLabel.textContent = "Cursor Size:";
        cursorSizeLabel.style.fontSize = "12px";
        cursorSizeContainer.appendChild(cursorSizeLabel);

        const cursorSizeSlider = document.createElement("input");
        cursorSizeSlider.type = "range";
        cursorSizeSlider.min = "8";
        cursorSizeSlider.max = "64";
        cursorSizeSlider.value = CURSOR_SIZE;
        cursorSizeSlider.style.width = "100px";
        cursorSizeContainer.appendChild(cursorSizeSlider);

        const cursorSizeValue = document.createElement("span");
        cursorSizeValue.textContent = CURSOR_SIZE;
        cursorSizeValue.style.fontSize = "12px";
        cursorSizeContainer.appendChild(cursorSizeValue);

        let isDraggingSize = false;
        cursorSizeSlider.addEventListener("mousedown", (e) => {
            e.stopPropagation();
            startUIDrag();
            isDraggingSize = true;
            updateSliderValue(cursorSizeSlider, e, 8, 64, (value) => {
                CURSOR_SIZE = value;
                cursorSizeValue.textContent = CURSOR_SIZE;
                win.localStorage.setItem(STORAGE_KEYS.cursorSize, CURSOR_SIZE);
                updateCursor();
            });
        });

        document.addEventListener("mousemove", (e) => {
            if (isDraggingSize) {
                e.stopPropagation();
                updateSliderValue(cursorSizeSlider, e, 8, 64, (value) => {
                    CURSOR_SIZE = value;
                    cursorSizeValue.textContent = CURSOR_SIZE;
                    win.localStorage.setItem(STORAGE_KEYS.cursorSize, CURSOR_SIZE);
                    updateCursor();
                });
            }
        });

    document.addEventListener("mouseup", (e) => {
            if (isDraggingSize) {
                e.stopPropagation();
                isDraggingSize = false;
        endUIDrag();
            }
        });

        const cursorOpacityContainer = document.createElement("div");
        cursorOpacityContainer.style.display = "flex";
        cursorOpacityContainer.style.alignItems = "center";
        cursorOpacityContainer.style.gap = "8px";
        optionsBar.appendChild(cursorOpacityContainer);

        const cursorOpacityLabel = document.createElement("span");
        cursorOpacityLabel.textContent = "Cursor Opacity:";
        cursorOpacityLabel.style.fontSize = "12px";
        cursorOpacityContainer.appendChild(cursorOpacityLabel);

        const cursorOpacitySlider = document.createElement("input");
        cursorOpacitySlider.type = "range";
        cursorOpacitySlider.min = "0.1";
        cursorOpacitySlider.max = "1.0";
        cursorOpacitySlider.step = "0.1";
        cursorOpacitySlider.value = CURSOR_OPACITY;
        cursorOpacitySlider.style.width = "100px";
        cursorOpacityContainer.appendChild(cursorOpacitySlider);

        const cursorOpacityValue = document.createElement("span");
        cursorOpacityValue.textContent = CURSOR_OPACITY.toFixed(1);
        cursorOpacityValue.style.fontSize = "12px";
        cursorOpacityContainer.appendChild(cursorOpacityValue);

        let isDraggingOpacity = false;
        cursorOpacitySlider.addEventListener("mousedown", (e) => {
            e.stopPropagation();
            startUIDrag();
            isDraggingOpacity = true;
            updateSliderValue(cursorOpacitySlider, e, 0.1, 1.0, (value) => {
                CURSOR_OPACITY = value;
                cursorOpacityValue.textContent = CURSOR_OPACITY.toFixed(1);
                win.localStorage.setItem(STORAGE_KEYS.cursorOpacity, CURSOR_OPACITY);
                updateCursor();
            }, true);
        });

        document.addEventListener("mousemove", (e) => {
            if (isDraggingOpacity) {
                e.stopPropagation();
                updateSliderValue(cursorOpacitySlider, e, 0.1, 1.0, (value) => {
                    CURSOR_OPACITY = value;
                    cursorOpacityValue.textContent = CURSOR_OPACITY.toFixed(1);
                    win.localStorage.setItem(STORAGE_KEYS.cursorOpacity, CURSOR_OPACITY);
                    updateCursor();
                }, true);
            }
        });

    document.addEventListener("mouseup", (e) => {
            if (isDraggingOpacity) {
                e.stopPropagation();
                isDraggingOpacity = false;
        endUIDrag();
            }
        });

        const autoAvoidContainer = document.createElement("div");
        autoAvoidContainer.style.display = "flex";
        autoAvoidContainer.style.alignItems = "center";
        optionsBar.appendChild(autoAvoidContainer);

        const autoAvoidToggle = document.createElement("input");
        autoAvoidToggle.type = "checkbox";
        autoAvoidToggle.id = "toggle-auto-avoid";
        autoAvoidToggle.checked = autoAvoidEnabled;
        autoAvoidToggle.style.marginRight = "4px";
        autoAvoidToggle.onchange = function() {
            autoAvoidEnabled = this.checked;
            savePersistentData();
            updateAvoidanceSliderVisibility();
        };
        autoAvoidContainer.appendChild(autoAvoidToggle);

        const autoAvoidLabel = document.createElement("label");
        autoAvoidLabel.textContent = "Auto-Avoid";
        autoAvoidLabel.style.color = "#fff";
        autoAvoidLabel.style.fontSize = "12px";
        autoAvoidLabel.setAttribute("for", "toggle-auto-avoid");
        autoAvoidContainer.appendChild(autoAvoidLabel);

        const autoEatContainer = document.createElement("div");
        autoEatContainer.style.display = "flex";
        autoEatContainer.style.alignItems = "center";
        optionsBar.appendChild(autoEatContainer);

        const autoEatToggle = document.createElement("input");
        autoEatToggle.type = "checkbox";
        autoEatToggle.id = "toggle-auto-eat";
        autoEatToggle.checked = autoEatEnabled;
        autoEatToggle.style.marginRight = "4px";
        autoEatToggle.onchange = function() {
            autoEatEnabled = this.checked;
            savePersistentData();
            // Clear TSP plan when disabling auto-eat
            if (!autoEatEnabled) {
                tspPlan = { route: [], idx: 0, expiresAt: 0 };
                foodTarget = null;
            }
        };
        autoEatContainer.appendChild(autoEatToggle);

        const autoEatLabel = document.createElement("label");
        autoEatLabel.textContent = "Auto Eat";
        autoEatLabel.style.color = "#fff";
        autoEatLabel.style.fontSize = "12px";
        autoEatLabel.setAttribute("for", "toggle-auto-eat");
        autoEatContainer.appendChild(autoEatLabel);
    }

    function toggleSettingsPopup() {
        if (!settingsPopup) createSettingsPopup();
        settingsPopup.style.display = settingsPopup.style.display === "none" ? "block" : "none";
    }

    function updateAvoidanceSliderVisibility() {
        const avoidContainer = document.getElementById("avoidance-slider-container");
        if (avoidContainer) avoidContainer.style.display = autoAvoidEnabled ? "flex" : "none";
        // Note: sensitivity-slider-container is now the main settings container and should always be visible
    }

    function findBestFoodCluster(mySnake) {
        if (!mySnake || !win.foods || !Array.isArray(win.foods) || typeof mySnake.xx !== "number" || typeof mySnake.yy !== "number") return null;

        const snakeX = mySnake.xx;
        const snakeY = mySnake.yy;
        const radius = foodSearchRadius;
        const nearbyFoods = win.foods.filter(food => {
            if (!food || typeof food.xx !== "number" || typeof food.yy !== "number" || typeof food.sz !== "number") return false;
            const dx = food.xx - snakeX;
            const dy = food.yy - snakeY;
            return Math.hypot(dx, dy) <= radius;
        });

        if (nearbyFoods.length === 0) return null;

        const CLUSTER_RADIUS = 200;
        const clusters = [];
        const used = new Set();

    nearbyFoods.forEach((food, i) => {
            if (used.has(i)) return;
            const cluster = { foods: [food], totalValue: food.sz, xSum: food.xx * food.sz, ySum: food.yy * food.sz };
            used.add(i);

            nearbyFoods.forEach((otherFood, j) => {
                if (i === j || used.has(j)) return;
        const dx = food.xx - otherFood.xx;
        const dy = food.yy - otherFood.yy;
        const dist = Math.hypot(dx, dy);
                if (dist <= CLUSTER_RADIUS) {
                    cluster.foods.push(otherFood);
                    cluster.totalValue += otherFood.sz;
                    cluster.ySum += otherFood.yy * otherFood.sz;
                    used.add(j);
                }
            });

            clusters.push(cluster);
        });

        if (clusters.length === 0) return null;
        let bestCluster = null;
        let bestScore = -Infinity;

        clusters.forEach(cluster => {
            const centerX = cluster.xSum / cluster.totalValue;
            const centerY = cluster.ySum / cluster.totalValue;
            const dx = centerX - snakeX;
            const dy = centerY - snakeY;
            const distance = Math.hypot(dx, dy);
            const density = cluster.totalValue / (CLUSTER_RADIUS * CLUSTER_RADIUS);
            const score = cluster.totalValue / (distance + 1) + density * 10;

            if (score > bestScore) {
                bestScore = score;
                bestCluster = { x: centerX, y: centerY, value: cluster.totalValue };
            }
        });

        return bestCluster ? { x: bestCluster.x, y: bestCluster.y } : null;
    }

    /********** Auto-Eat: Density Heatmap + Trail Following + Feast Detection **********/
    const FOOD_HEAT_UPDATE_MS = 50; // recompute target ~20 Hz for more responsive steering
    const GRID_COLS = 20, GRID_ROWS = 12; // coarse screen grid
    const TRAIL_RADIUS = 500; // around cluster for trail fit (raised to favor trails)
    const TRAIL_LOOKAHEAD = 260; // base lookahead; additional dynamic lookahead applied
    const FEAST_RADIUS = 500; // radius to detect dead snake food
    const FEAST_MASS = 80;   // threshold of total sz to classify feast
    const FEAST_BIG_SZ = 6;  // big bead size threshold - dead snakes drop sz 6+ beads, normal food is 1-4

    // --- Death-line (dead snake) detection state ---
    let foodSizeStats = new Map(); // sz -> count (sampled)
    let observedMinSz = Infinity, observedMaxSz = 0;
    let deathFrenzyActive = false;
    let deathFrenzyUntil = 0; // ms timestamp
    let deathFrenzyThresh = FEAST_BIG_SZ;

    function tallyFoodSizes(foods) {
        for (const f of foods) {
            const sz = (f && typeof f.sz === 'number') ? f.sz : null;
            if (sz == null) continue;
            if (sz < observedMinSz) observedMinSz = sz;
            if (sz > observedMaxSz) observedMaxSz = sz;
            foodSizeStats.set(sz, (foodSizeStats.get(sz) || 0) + 1);
        }
    }

    function computeBigThreshold() {
        // Use p95 of observed sizes - only truly large beads count as "big"
        // Normal food is typically size 1-4, dead snake food is 6+
        const entries = Array.from(foodSizeStats.entries());
        if (entries.length < 3) return FEAST_BIG_SZ;
        const sample = [];
        for (const [sz, count] of entries) {
            const reps = Math.min(50, count);
            for (let i = 0; i < reps; i++) sample.push(sz);
        }
        sample.sort((a, b) => a - b);
        const idx = Math.max(0, Math.min(sample.length - 1, Math.floor(sample.length * 0.95)));
        return Math.max(FEAST_BIG_SZ, sample[idx]);
    }

    function pcaLinearity(points) {
        // points: [{x,y}]
        const n = points.length;
        if (n < 2) return { ratio: 0, axis: { x: 1, y: 0 }, span: 0 };
        let mx = 0, my = 0;
        for (const p of points) { mx += p.x; my += p.y; }
        mx /= n; my /= n;
        let sxx = 0, sxy = 0, syy = 0;
        for (const p of points) {
            const dx = p.x - mx, dy = p.y - my;
            sxx += dx * dx; sxy += dx * dy; syy += dy * dy;
        }
        const tr = sxx + syy;
        const det = sxx * syy - sxy * sxy;
        const disc = Math.max(0, tr * tr - 4 * det);
        const l1 = 0.5 * (tr + Math.sqrt(disc));
        const l2 = 0.5 * (tr - Math.sqrt(disc));
        // principal axis is eigenvector of l1; for 2x2, (sxy, l1 - sxx) or (l1 - syy, sxy)
        let ax = sxy, ay = (l1 - sxx);
        let norm = Math.hypot(ax, ay);
        if (norm < 1e-6) { ax = 1; ay = 0; norm = 1; }
        ax /= norm; ay /= norm;
        // span along principal axis
        let minProj = Infinity, maxProj = -Infinity;
        for (const p of points) {
            const proj = (p.x - mx) * ax + (p.y - my) * ay;
            if (proj < minProj) minProj = proj;
            if (proj > maxProj) maxProj = proj;
        }
        return { ratio: (l2 <= 0 ? (l1 > 0 ? 1e6 : 0) : (l1 / l2)), axis: { x: ax, y: ay }, span: (maxProj - minProj) };
    }

    function getEffectiveAvoidanceSensitivity() {
        if (deathFrenzyActive) {
            // allow close-in collection; keep a tiny buffer
            return Math.min(10, avoidanceSensitivity);
        }
        return avoidanceSensitivity;
    }
    const FEAST_BIG_COUNT = 10; // if >= this many big beads, treat as feast
    const FEAST_STICK_MS = 350; // keep boosting briefly even if feast flickers
    const LOCAL_RADIUS = 420; // compare local mass to best cluster
    const INNER_CLUSTER_RADIUS = 260; // inside this, don't boost for normal clusters
    const LOCAL_DOMINANCE = 1.5; // local must be this much better to cancel travel (favor trail/cluster)
    const STICK_RATIO = 0.6;     // if local mass >= STICK_RATIO * best cluster, stay and feast locally
    // TSP planner (snapshot route across foods)
    // Snapshot recompute interval is dynamic via slider (tspIntervalSec)
    const TSP_SNAPSHOT_MIN_MS = 3000; // minimum 3 seconds before considering new route
    const TSP_MAX_POINTS = 100;    // cap foods used for route (performance)
    const TSP_MIN_POINTS = 3;      // need at least this many to plan a route
    const TSP_NEAR_ADVANCE = 80;   // smaller radius - must get close to waypoint before advancing
    const TSP_2OPT_PASSES = 120;   // balanced 2-opt passes
    const TSP_EDGE_MARGIN = 600;   // exclude nodes within this distance of the world edge
    const SNAKE_TURN_RADIUS = 120; // estimated turning radius for lead-point calculation
    const STEER_LEAD_FACTOR = 0.4; // how far ahead to aim based on distance (0-1)

    // Low-food escape mode - navigate to better areas when food is sparse
    const LOW_FOOD_THRESHOLD = 8;     // minimum food count to consider area "good enough"
    const LOW_FOOD_MASS_THRESHOLD = 12; // minimum total mass to consider area "good enough"
    const SAFE_ZONE_INNER = 0.25;     // don't go closer than 25% of world radius to center
    const SAFE_ZONE_OUTER = 0.85;     // don't go closer than 15% of world radius to edge
    const ESCAPE_SCAN_INTERVAL = 500; // ms between direction scans when escaping
    const ESCAPE_DIRECTION_HOLD = 2000; // ms to hold escape direction before re-evaluating

    // Boost budget: spend ~50% of gathered mass on boosting
    const BOOST_SPEND_FRACTION = 0.5; // portion of gathered mass converted to budget
    const BOOST_COST_PER_SEC = 25;    // estimated mass cost per second of boosting (tunable)
    const HEAD_EAT_RADIUS = 80;       // radius around our head to attribute food pickups
    const FOOD_KEY_Q = 2;             // quantization for food keying (reduce float jitter)

    let foodNavCache = { when: 0, target: null, trailVec: null, feast: null, cluster: null, boostMode: 'none', inCluster: false };
    let feastActiveUntil = 0; // hysteresis timer to keep boost on during feast
    let lastSnakePos = { x: 0, y: 0, t: 0 }; // track snake movement for adaptive updates
    let lastSteerAngle = 0; // smooth steering angle
    let bypassTspForLocalFeast = false; // module-level flag for feast mode
    
    // Low-food escape state
    let lowFoodEscapeActive = false;
    let escapeDirection = { x: 0, y: 0 }; // unit vector for escape direction
    let escapeDirectionSetAt = 0; // when we last set the escape direction
    let lastEscapeScan = 0; // when we last scanned for food density
    
    // Boost budget state
    let boostBudget = 0;        // mass units available for boosting
    let totalMassGained = 0;    // total mass attributed to us (for telemetry)
    let lastBudgetTick = 0;     // ms timestamp for budget dt
    let lastBoosting = false;   // whether we were boosting during last dt
    let prevNearbyFoodKeys = new Map(); // key -> mass (sz)
    let lastBoostMode = 'none'; // for HUD/debug
    // TSP route state
    let tspPlan = { route: [], idx: 0, expiresAt: 0 };
    
    // Stuck detection - when snake circles same waypoint too long
    let waypointStuckTracker = { waypointIdx: -1, nearSince: 0, circleCount: 0, lastAngle: 0 };
    
    // Food target stuck tracker - for when circling around a food target (not just waypoints)
    let foodTargetStuckTracker = { targetX: 0, targetY: 0, nearSince: 0, circleCount: 0, lastAngle: 0 };
    
    // Avoidance state - used to hide food overlay when avoiding
    let isCurrentlyAvoiding = false;
    
    // Oscillation/no-eat detection - force new path if not eating
    let lastFoodCount = 0;          // Track food eaten
    let lastFoodCountTime = 0;      // When we last checked
    let noEatDuration = 0;          // How long since we ate
    let lastTargetPositions = [];   // Track recent target positions for oscillation detection
    const MAX_TARGET_HISTORY = 15;
    const OSCILLATION_THRESHOLD = 6; // How many times we need to revisit same area (stricter)
    const NO_EAT_TIMEOUT = 10000;   // 10 seconds without eating = find new path
    
    // Exclusion zone - areas to avoid when replanning after getting stuck
    let exclusionZones = [];        // Array of {x, y, radius, expiresAt}
    const EXCLUSION_RADIUS = 200;   // Radius around stuck area to exclude
    const EXCLUSION_DURATION = 15000; // How long to exclude the area (15 seconds)

    function getViewBounds() {
        const gsc = win.gsc || 1;
        const viewX = win.view_xx || 0;
        const viewY = win.view_yy || 0;
        const w = window.innerWidth / gsc;
        const h = window.innerHeight / gsc;
        const margin = 150; // small margin
        return { minX: viewX - margin, minY: viewY - margin, maxX: viewX + w + margin, maxY: viewY + h + margin };
    }

    function getVisibleFoods() {
        if (!win.foods || !Array.isArray(win.foods)) return [];
        const b = getViewBounds();
        const arr = [];
        for (const f of win.foods) {
            if (!f || typeof f.xx !== 'number' || typeof f.yy !== 'number') continue;
            if (f.xx >= b.minX && f.xx <= b.maxX && f.yy >= b.minY && f.yy <= b.maxY) arr.push(f);
        }
        return arr;
    }

    function foodsWithinRadius(foods, cx, cy, r) {
        const r2 = r * r;
        const out = [];
        for (const f of foods) {
            const dx = f.xx - cx, dy = f.yy - cy;
            if (dx*dx + dy*dy <= r2) out.push(f);
        }
        return out;
    }

    function nearestFood(foods, cx, cy, maxR = 120) {
        let best = null, bestD2 = (maxR*maxR);
        for (const f of foods) {
            const dx = f.xx - cx, dy = f.yy - cy;
            const d2 = dx*dx + dy*dy;
            if (d2 <= bestD2) { bestD2 = d2; best = f; }
        }
        return best;
    }

    function aheadFood(foods, cx, cy, dirx, diry, funnelWidth = 0.6, maxR = 220) {
        // Pick the nearest bead roughly ahead in a cone aligned with dir
        const cosThresh = Math.cos(funnelWidth); // ~0.825 when 0.6 rad (~34°)
        let best = null, bestD2 = (maxR*maxR);
        for (const f of foods) {
            const vx = f.xx - cx, vy = f.yy - cy;
            const d2 = vx*vx + vy*vy;
            if (d2 > bestD2 || d2 === 0) continue;
            const len = Math.sqrt(d2);
            const dot = (vx/len)*dirx + (vy/len)*diry;
            if (dot < cosThresh) continue; // not sufficiently ahead
            best = f; bestD2 = d2;
        }
        return best;
    }

    function buildFoodGrid(foods) {
        const b = getViewBounds();
        const dx = (b.maxX - b.minX) / GRID_COLS;
        const dy = (b.maxY - b.minY) / GRID_ROWS;
        const grid = new Array(GRID_COLS * GRID_ROWS).fill(0);
        const accum = new Array(GRID_COLS * GRID_ROWS).fill(null).map(() => ({ x: 0, y: 0, w: 0 }));
        for (const f of foods) {
            const sz = typeof f.sz === 'number' ? f.sz : 1;
            const cx = Math.max(0, Math.min(GRID_COLS - 1, Math.floor((f.xx - b.minX) / dx)));
            const cy = Math.max(0, Math.min(GRID_ROWS - 1, Math.floor((f.yy - b.minY) / dy)));
            const idx = cy * GRID_COLS + cx;
            grid[idx] += sz;
            accum[idx].x += f.xx * sz; accum[idx].y += f.yy * sz; accum[idx].w += sz;
        }
        return { grid, accum, b, dx, dy };
    }

    function topClusterFromGrid(info) {
        // Find top weighted cell and neighbors to form a small cluster
        let bestIdx = -1, bestW = -1;
        for (let i = 0; i < info.grid.length; i++) { if (info.grid[i] > bestW) { bestW = info.grid[i]; bestIdx = i; } }
        if (bestIdx < 0 || bestW <= 0) return null;
        const cx = bestIdx % GRID_COLS, cy = Math.floor(bestIdx / GRID_COLS);
        // Merge simple 3x3 neighborhood
        let wSum = 0, xSum = 0, ySum = 0;
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                const x = cx + dx, y = cy + dy;
                if (x < 0 || x >= GRID_COLS || y < 0 || y >= GRID_ROWS) continue;
                const idx = y * GRID_COLS + x;
                const w = info.grid[idx];
                if (w > 0) {
                    const ac = info.accum[idx];
                    wSum += w; xSum += ac.x; ySum += ac.y;
                }
            }
        }
        if (wSum <= 0) return null;
        return { x: xSum / wSum, y: ySum / wSum, weight: wSum };
    }

    function pcaTrailVector(foods, cx, cy, radius) {
        // Weighted PCA of foods around (cx,cy) to get a trail direction
        let wSum = 0, mx = 0, my = 0;
        const pts = [];
        for (const f of foods) {
            if (!f) continue;
            const dx = f.xx - cx, dy = f.yy - cy;
            if (dx*dx + dy*dy > radius*radius) continue;
            const w = (typeof f.sz === 'number') ? f.sz : 1;
            wSum += w; mx += f.xx * w; my += f.yy * w; pts.push({ x: f.xx, y: f.yy, w });
        }
        if (wSum <= 0 || pts.length < 2) return null;
        mx /= wSum; my /= wSum;
        // Covariance
        let sxx = 0, sxy = 0, syy = 0;
        for (const p of pts) {
            const dx = p.x - mx, dy = p.y - my, w = p.w;
            sxx += w * dx * dx; sxy += w * dx * dy; syy += w * dy * dy;
        }
        // Eigenvector for largest eigenvalue of 2x2
        const tr = sxx + syy;
        const det = sxx * syy - sxy * sxy;
        const disc = Math.max(0, tr*tr/4 - det);
        const l1 = tr/2 + Math.sqrt(disc);
        // (A - lI)v = 0 => (sxx-l)*vx + sxy*vy = 0
        let vx = sxy, vy = l1 - sxx;
        if (Math.abs(vx) + Math.abs(vy) < 1e-6) { vx = 1; vy = 0; }
        const len = Math.hypot(vx, vy) || 1; vx /= len; vy /= len;
        return { x: vx, y: vy };
    }

    function detectFeast(foods, cx, cy, radius) {
        let wSum = 0, cnt = 0, big = 0;
        for (const f of foods) {
            const dx = f.xx - cx, dy = f.yy - cy;
            if (dx*dx + dy*dy > radius*radius) continue;
            const w = (typeof f.sz === 'number') ? f.sz : 1;
            wSum += w; cnt++;
            if (w >= FEAST_BIG_SZ) big++;
        }
        return { mass: wSum, count: cnt, big };
    }

    function localWeightedCentroid(foods, cx, cy, r) {
        let wSum = 0, xSum = 0, ySum = 0;
        const r2 = r*r;
        for (const f of foods) {
            const dx = f.xx - cx, dy = f.yy - cy;
            if (dx*dx + dy*dy > r2) continue;
            const w = (typeof f.sz === 'number') ? f.sz : 1;
            wSum += w; xSum += f.xx * w; ySum += f.yy * w;
        }
        if (wSum <= 0) return null;
        return { x: xSum / wSum, y: ySum / wSum, w: wSum };
    }

    // --- TSP planner helpers ---
    function routeDistance(route, sx, sy) {
        let d = 0, px = sx, py = sy;
        for (let i = 0; i < route.length; i++) {
            const p = route[i];
            d += Math.hypot(p.x - px, p.y - py);
            px = p.x; py = p.y;
        }
        return d;
    }

    function getWorldCenterRadius() {
        const cx = (typeof win.grd === 'number') ? win.grd : null;
        const cy = cx;
        const R = (typeof win.real_flux_grd === 'number' && win.real_flux_grd > 0) ? win.real_flux_grd : win.flux_grd;
        if (cx != null && typeof R === 'number' && R > 0) return { cx, cy, R };
        return null;
    }
    function nnRoute(points, sx, sy) {
        const remaining = points.slice();
        const route = [];
        let cx = sx, cy = sy;
        while (remaining.length) {
            let bestIdx = -1, bestD2 = Infinity;
            for (let i = 0; i < remaining.length; i++) {
                const p = remaining[i];
                const d2 = (p.x - cx) * (p.x - cx) + (p.y - cy) * (p.y - cy);
                if (d2 < bestD2) { bestD2 = d2; bestIdx = i; }
            }
            const [p] = remaining.splice(bestIdx, 1);
            route.push(p);
            cx = p.x; cy = p.y;
        }
        return route;
    }
    function twoOptOpen(route, sx, sy, passes = TSP_2OPT_PASSES) {
        const n = route.length;
        if (n < 3) return route;
        const point = (idx) => route[idx];
        const dist = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);
        for (let pass = 0; pass < passes; pass++) {
            let improved = false;
            for (let i = -1; i < n - 2; i++) {
                const A = (i < 0) ? { x: sx, y: sy } : point(i);
                const B = point(i + 1);
                for (let j = i + 1; j < n - 1; j++) { // ensure D exists (open path)
                    const C = point(j);
                    const D = point(j + 1);
                    const dNow = dist(A.x, A.y, B.x, B.y) + dist(C.x, C.y, D.x, D.y);
                    const dSwap = dist(A.x, A.y, C.x, C.y) + dist(B.x, B.y, D.x, D.y);
                    if (dSwap + 1e-6 < dNow) {
                        // reverse segment (i+1..j)
                        let l = i + 1, r = j;
                        while (l < r) { const tmp = route[l]; route[l] = route[r]; route[r] = tmp; l++; r--; }
                        improved = true;
                    }
                }
            }
            if (!improved) break;
        }
        return route;
    }
    function planTspRoute(mySnake, foods) {
        if (!mySnake || !foods || !foods.length) return null;
        // Snapshot foods in range up to cap; exclude ones too close to the world edge
        const world = getWorldCenterRadius();
        let pts = foods.map(f => ({ x: f.xx, y: f.yy }));
        if (world) {
            const edgeLimit = Math.max(0, world.R - TSP_EDGE_MARGIN);
            pts = pts.filter(p => Math.hypot(p.x - world.cx, p.y - world.cy) < edgeLimit);
        }
        
        // Filter out points in exclusion zones (areas where we got stuck)
        if (exclusionZones.length > 0) {
            pts = pts.filter(p => {
                for (const zone of exclusionZones) {
                    if (Math.hypot(p.x - zone.x, p.y - zone.y) < zone.radius) {
                        return false; // Point is in exclusion zone
                    }
                }
                return true;
            });
        }
        
        if (pts.length < TSP_MIN_POINTS) return null;
        // If too many, downsample by taking every k-th point to keep spatial spread
        let pool = pts;
        if (pts.length > TSP_MAX_POINTS) {
            const k = Math.ceil(pts.length / TSP_MAX_POINTS);
            pool = pts.filter((_, idx) => idx % k === 0);
        }
        let route = nnRoute(pool, mySnake.xx, mySnake.yy);
        route = twoOptOpen(route, mySnake.xx, mySnake.yy, TSP_2OPT_PASSES);
        return route;
    }
    
    // Calculate total route length for quality comparison
    function calcRouteLength(route, startX, startY) {
        if (!route || !route.length) return Infinity;
        let len = Math.hypot(route[0].x - startX, route[0].y - startY);
        for (let i = 1; i < route.length; i++) {
            len += Math.hypot(route[i].x - route[i-1].x, route[i].y - route[i-1].y);
        }
        return len;
    }
    
    // Calculate route quality: food density per unit distance
    function calcRouteQuality(route, foods, startX, startY) {
        if (!route || !route.length) return 0;
        const len = calcRouteLength(route, startX, startY);
        if (len <= 0) return 0;
        // Count food items near the route
        let foodCount = 0;
        for (const f of foods) {
            for (const wp of route) {
                if (Math.hypot(f.xx - wp.x, f.yy - wp.y) < 150) {
                    foodCount++;
                    break; // Count each food only once
                }
            }
        }
        // Quality = food per 100 units of travel
        return (foodCount / len) * 100;
    }

    function makeFoodKey(f) {
        // Quantize coordinates to make a stable-ish key across frames
        const qx = Math.round(f.xx / FOOD_KEY_Q);
        const qy = Math.round(f.yy / FOOD_KEY_Q);
        const sz = (typeof f.sz === 'number') ? Math.round(f.sz) : 1;
        return qx + ':' + qy + ':' + sz;
    }

    function updateBoostBudget(mySnake) {
        const now = performance.now ? performance.now() : Date.now();
        const dt = lastBudgetTick ? Math.max(0, (now - lastBudgetTick) / 1000) : 0;
        lastBudgetTick = now;

        // Spend budget for last frame's boosting
        if (lastBoosting && dt > 0) {
            boostBudget = Math.max(0, boostBudget - BOOST_COST_PER_SEC * dt);
        }

        // Attribute newly eaten mass near our head since last frame
        const visFoods = getVisibleFoods();
        if (!mySnake || !visFoods.length) { prevNearbyFoodKeys.clear(); return { gain: 0, budget: boostBudget }; }

        const near = foodsWithinRadius(visFoods, mySnake.xx, mySnake.yy, HEAD_EAT_RADIUS);
        const current = new Map();
        for (const f of near) {
            const key = makeFoodKey(f);
            const mass = (typeof f.sz === 'number') ? f.sz : 1;
            current.set(key, mass);
        }
        // Track food consumed nearby
        let gained = 0;
        for (const [key, mass] of prevNearbyFoodKeys.entries()) {
            if (!current.has(key)) gained += mass;
        }
        if (gained > 0) {
            totalMassGained += gained;
            boostBudget += gained * BOOST_SPEND_FRACTION;
        }
        prevNearbyFoodKeys = current;
        return { gain: gained, budget: boostBudget };
    }

    // Dynamic collision/search radius helpers
    function getCollisionRadius() {
        // Uses collision sensitivity (inner circle) for actual avoidance
        return getCollisionAvoidRadius();
    }
    function getFoodSearchRadius() {
        const base = getCollisionRadius();
        const mult = Math.max(0, Math.min(5, Number(foodSearchMultiplier) || 0));
        return base * mult;
    }

    // Calculate a lead point that accounts for snake turning dynamics
    function calcLeadPoint(mySnake, targetX, targetY) {
        if (!mySnake) return { x: targetX, y: targetY };
        const dx = targetX - mySnake.xx;
        const dy = targetY - mySnake.yy;
        const dist = Math.hypot(dx, dy);
        if (dist < 50) return { x: targetX, y: targetY }; // close enough, aim direct
        
        // Get snake's current heading
        const heading = mySnake.ang || 0;
        const hx = Math.cos(heading);
        const hy = Math.sin(heading);
        
        // Calculate angle to target
        const targetAngle = Math.atan2(dy, dx);
        let angleDiff = targetAngle - heading;
        // Normalize to [-PI, PI]
        while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
        while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
        
        // If target is nearly ahead, aim directly
        if (Math.abs(angleDiff) < 0.3) return { x: targetX, y: targetY };
        
        // Calculate a lead point that's offset perpendicular to help the snake curve toward target
        // The further the target, the more we lead
        const leadDist = Math.min(dist * STEER_LEAD_FACTOR, 200);
        const turnSign = Math.sign(angleDiff);
        
        // Offset perpendicular to current heading in the turn direction
        const perpX = -hy * turnSign;
        const perpY = hx * turnSign;
        
        // Blend between direct target and a lead point
        const blend = Math.min(1, Math.abs(angleDiff) / (Math.PI / 2));
        const leadX = targetX + perpX * leadDist * blend;
        const leadY = targetY + perpY * leadDist * blend;
        
        return { x: leadX, y: leadY };
    }
    
    // Helper to track target history and return food cache
    // Only adds to history when target changes significantly (prevents false oscillation)
    let lastTrackedTarget = null;
    function returnFoodTarget(cache) {
        if (cache.target) {
            // Only track if target moved significantly from last tracked position
            const targetMoved = !lastTrackedTarget || 
                Math.hypot(cache.target.x - lastTrackedTarget.x, cache.target.y - lastTrackedTarget.y) > 150;
            if (targetMoved) {
                lastTargetPositions.push({ x: cache.target.x, y: cache.target.y });
                if (lastTargetPositions.length > MAX_TARGET_HISTORY) {
                    lastTargetPositions.shift();
                }
                lastTrackedTarget = { x: cache.target.x, y: cache.target.y };
            }
        }
        return cache;
    }
    
    function pickFoodTargetCached(mySnake) {
        const now = performance.now ? performance.now() : Date.now();
        
        // Adaptive update: recalculate more often when snake has moved significantly or turned
        let forceUpdate = false;
        if (mySnake && lastSnakePos.t > 0) {
            const moved = Math.hypot(mySnake.xx - lastSnakePos.x, mySnake.yy - lastSnakePos.y);
            const dt = now - lastSnakePos.t;
            // Force update if moved more than 60 units or it's been a while
            if (moved > 60 || dt > 200) forceUpdate = true;
        }
        if (mySnake) {
            lastSnakePos = { x: mySnake.xx, y: mySnake.yy, t: now };
        }
        
        if (!forceUpdate && now - foodNavCache.when < FOOD_HEAT_UPDATE_MS && foodNavCache.target) return foodNavCache;
        const visFoods = getVisibleFoods();
        if (!visFoods.length) { foodNavCache = { when: now, target: null, trailVec: null, feast: null, cluster: null, boostMode: 'none', inCluster: false }; return foodNavCache; }
        // Restrict to a dynamic search radius around us (multiplier × collision radius)
        const searchR = getFoodSearchRadius();
        if (searchR <= 0) { foodNavCache = { when: now, target: null, trailVec: null, feast: null, cluster: null, boostMode: 'none', inCluster: false }; return foodNavCache; }
        // Use all foods in range for better path quality (no filtering)
        const foods = foodsWithinRadius(visFoods, mySnake.xx, mySnake.yy, searchR);
        
        // === NO-EAT / OSCILLATION DETECTION ===
        // If we haven't eaten in a while, or are oscillating, force new path
        const currentFoodCount = foods.length;
        if (lastFoodCountTime === 0) {
            lastFoodCountTime = now;
            lastFoodCount = currentFoodCount;
        }
        
        // Check if we've eaten (food count decreased means we ate something)
        const foodDelta = lastFoodCount - currentFoodCount;
        if (foodDelta > 0) {
            // We ate! Reset no-eat timer
            noEatDuration = 0;
            lastFoodCountTime = now;
            lastTargetPositions = []; // Clear oscillation history
        } else {
            // Haven't eaten, accumulate time
            noEatDuration += (now - lastFoodCountTime);
            lastFoodCountTime = now;
        }
        lastFoodCount = currentFoodCount;
        
        // Check for oscillation - are we revisiting the same areas?
        // Only check if we have enough history AND haven't been eating
        let isOscillating = false;
        let oscillationCenter = null;
        if (foodNavCache.target && lastTargetPositions.length >= OSCILLATION_THRESHOLD && noEatDuration > 3000) {
            const currentTarget = foodNavCache.target;
            let revisitCount = 0;
            let sumX = 0, sumY = 0, count = 0;
            for (const pos of lastTargetPositions) {
                if (Math.hypot(pos.x - currentTarget.x, pos.y - currentTarget.y) < 150) {
                    revisitCount++;
                    sumX += pos.x;
                    sumY += pos.y;
                    count++;
                }
            }
            if (revisitCount >= OSCILLATION_THRESHOLD) {
                isOscillating = true;
                // Calculate center of oscillation area
                oscillationCenter = { x: sumX / count, y: sumY / count };
            }
        }
        
        // Clean up expired exclusion zones
        const nowExcl = performance.now ? performance.now() : Date.now();
        exclusionZones = exclusionZones.filter(z => z.expiresAt > nowExcl);
        
        // Force new path if not eating for too long OR oscillating
        if (noEatDuration > NO_EAT_TIMEOUT || isOscillating) {
            // Add exclusion zone around where we got stuck
            const stuckCenter = oscillationCenter || (foodNavCache.target ? { x: foodNavCache.target.x, y: foodNavCache.target.y } : { x: mySnake.xx, y: mySnake.yy });
            exclusionZones.push({
                x: stuckCenter.x,
                y: stuckCenter.y,
                radius: EXCLUSION_RADIUS,
                expiresAt: nowExcl + EXCLUSION_DURATION
            });
            
            // Clear route to force replanning
            tspPlan = { route: [], idx: 0, expiresAt: 0 };
            noEatDuration = 0; // Reset timer
            lastTargetPositions = []; // Clear history
            waypointStuckTracker = { waypointIdx: -1, nearSince: 0, circleCount: 0, lastAngle: 0 };
        }
        
        // === LOW-FOOD ESCAPE MODE ===
        // If food is sparse, navigate to a better area in the safe zone
        const world = getWorldCenterRadius();
        if (world) {
            // Calculate food density metrics
            const foodCount = foods.length;
            let totalMass = 0;
            for (const f of foods) {
                totalMass += (typeof f.sz === 'number') ? f.sz : 1;
            }
            
            // Check if we're in a low-food area
            const isLowFood = foodCount < LOW_FOOD_THRESHOLD || totalMass < LOW_FOOD_MASS_THRESHOLD;
            
            // Calculate our position relative to world
            const distFromCenter = Math.hypot(mySnake.xx - world.cx, mySnake.yy - world.cy);
            const relativePos = distFromCenter / world.R; // 0 = center, 1 = edge
            
            // Check if we're in the safe zone
            const inSafeZone = relativePos >= SAFE_ZONE_INNER && relativePos <= SAFE_ZONE_OUTER;
            const tooCloseToCenter = relativePos < SAFE_ZONE_INNER;
            const tooCloseToEdge = relativePos > SAFE_ZONE_OUTER;
            
            if (isLowFood || tooCloseToCenter || tooCloseToEdge) {
                // Activate or continue escape mode
                const shouldUpdateDirection = !lowFoodEscapeActive || 
                    (now - escapeDirectionSetAt > ESCAPE_DIRECTION_HOLD) ||
                    tooCloseToCenter || tooCloseToEdge;
                
                if (shouldUpdateDirection) {
                    lowFoodEscapeActive = true;
                    
                    // Calculate escape direction based on position
                    let targetRadius;
                    if (tooCloseToCenter) {
                        // Move outward toward safe zone
                        targetRadius = world.R * (SAFE_ZONE_INNER + 0.15); // aim for 40% radius
                    } else if (tooCloseToEdge) {
                        // Move inward toward safe zone
                        targetRadius = world.R * (SAFE_ZONE_OUTER - 0.15); // aim for 70% radius
                    } else {
                        // In low food area within safe zone - orbit around center
                        // Pick a direction tangent to current radius, with slight outward/inward bias
                        targetRadius = world.R * 0.55; // aim for middle of safe zone
                    }
                    
                    // Direction from center to us
                    const toUsX = mySnake.xx - world.cx;
                    const toUsY = mySnake.yy - world.cy;
                    const toUsLen = Math.hypot(toUsX, toUsY) || 1;
                    const radialX = toUsX / toUsLen;
                    const radialY = toUsY / toUsLen;
                    
                    // Tangent direction (perpendicular to radial, pick one consistently)
                    const tangentX = -radialY;
                    const tangentY = radialX;
                    
                    // Blend radial and tangent based on how far we are from target radius
                    const radiusDiff = distFromCenter - targetRadius;
                    const radialWeight = Math.min(1, Math.abs(radiusDiff) / 500); // more radial if far from target
                    const radialSign = radiusDiff > 0 ? -1 : 1; // inward if too far out, outward if too close
                    
                    // Combine: mostly tangent (orbiting) with some radial correction
                    escapeDirection.x = tangentX * (1 - radialWeight) + radialX * radialSign * radialWeight;
                    escapeDirection.y = tangentY * (1 - radialWeight) + radialY * radialSign * radialWeight;
                    
                    // Normalize
                    const escLen = Math.hypot(escapeDirection.x, escapeDirection.y) || 1;
                    escapeDirection.x /= escLen;
                    escapeDirection.y /= escLen;
                    
                    escapeDirectionSetAt = now;
                }
                
                // Generate escape target point
                const escapeDistance = 400; // how far ahead to aim
                const escapeTargetX = mySnake.xx + escapeDirection.x * escapeDistance;
                const escapeTargetY = mySnake.yy + escapeDirection.y * escapeDistance;
                
                // Clamp to safe zone
                const escDistFromCenter = Math.hypot(escapeTargetX - world.cx, escapeTargetY - world.cy);
                let finalTargetX = escapeTargetX;
                let finalTargetY = escapeTargetY;
                
                if (escDistFromCenter > world.R * SAFE_ZONE_OUTER) {
                    // Clamp to outer safe zone
                    const scale = (world.R * SAFE_ZONE_OUTER) / escDistFromCenter;
                    finalTargetX = world.cx + (escapeTargetX - world.cx) * scale;
                    finalTargetY = world.cy + (escapeTargetY - world.cy) * scale;
                } else if (escDistFromCenter < world.R * SAFE_ZONE_INNER) {
                    // Clamp to inner safe zone
                    const scale = (world.R * SAFE_ZONE_INNER) / escDistFromCenter;
                    finalTargetX = world.cx + (escapeTargetX - world.cx) * scale;
                    finalTargetY = world.cy + (escapeTargetY - world.cy) * scale;
                }
                
                foodNavCache = { 
                    when: now, 
                    target: { x: finalTargetX, y: finalTargetY }, 
                    trailVec: null, 
                    feast: null, 
                    cluster: null, 
                    boostMode: 'escape', 
                    inCluster: false,
                    escapeMode: true
                };
                return foodNavCache;
            } else {
                // Food is good enough - exit escape mode
                if (lowFoodEscapeActive) {
                    lowFoodEscapeActive = false;
                }
            }
        }
        
        if (!foods.length) { foodNavCache = { when: now, target: null, trailVec: null, feast: null, cluster: null, boostMode: 'none', inCluster: false }; return foodNavCache; }

        // Update size telemetry and detect a "death-line" of large beads
        tallyFoodSizes(foods);
        const bigThresh = computeBigThreshold();
        const bigOnly = foods.filter(f => (typeof f.sz === 'number' ? f.sz : 1) >= bigThresh);
        
        // Detect death-line pattern (dead snake food in a line)
        // Requires 5+ big beads in a clear line pattern - this is unmistakably a dead snake
        if (bigOnly.length >= 5) {
            const pts = bigOnly.map(f => ({ x: f.xx, y: f.yy }));
            const pcs = pcaLinearity(pts);
            // Strict linearity: ratio >= 6, span >= 200 (dead snakes form clear lines)
            if (pcs.ratio >= 6 && pcs.span >= 200) {
                const nowMs2 = performance.now ? performance.now() : Date.now();
                deathFrenzyActive = true;
                deathFrenzyUntil = nowMs2 + 2000;
                deathFrenzyThresh = bigThresh;
            }
        }
        if (deathFrenzyActive) {
            const nowMs2 = performance.now ? performance.now() : Date.now();
            if (nowMs2 > deathFrenzyUntil) deathFrenzyActive = false;
        }
        
        // If frenzy is active (from timer), always prioritize big beads even if isFeast check below fails
        // This ensures we keep eating the dead snake food for the full 2 second window
        if (deathFrenzyActive && bigOnly.length > 0) {
            const bigNearFrenzy = foodsWithinRadius(bigOnly, mySnake.xx, mySnake.yy, FEAST_RADIUS * 1.5);
            if (bigNearFrenzy.length > 0) {
                bypassTspForLocalFeast = true;
                // Target the nearest big bead
                const nearestBig = nearestFood(bigNearFrenzy, mySnake.xx, mySnake.yy, FEAST_RADIUS * 1.5);
                if (nearestBig) {
                    const target = { x: nearestBig.xx, y: nearestBig.yy };
                    let bigMassFrenzy = 0;
                    for (const f of bigNearFrenzy) {
                        bigMassFrenzy += (typeof f.sz === 'number') ? f.sz : 1;
                    }
                    foodNavCache = { when: now, target, trailVec: null, feast: { mass: bigMassFrenzy, count: bigNearFrenzy.length }, cluster: null, boostMode: 'feast', inCluster: true };
                    return returnFoodTarget(foodNavCache);
                }
            }
        }
        
        // Priority 2 - High-value feast detection (DEAD SNAKE FOOD ONLY)
        // This should ONLY trigger when a snake actually dies and drops high-value food
        // Normal scattered food should NEVER trigger this
        bypassTspForLocalFeast = false; // reset each tick
        {
            // Look for big beads nearby - these indicate a dead snake
            // Big beads are size 6+ (normal food is 1-4)
            const bigNear = foodsWithinRadius(bigOnly, mySnake.xx, mySnake.yy, FEAST_RADIUS);
            
            // Calculate total mass of big beads nearby
            let bigMass = 0;
            for (const f of bigNear) {
                bigMass += (typeof f.sz === 'number') ? f.sz : 1;
            }
            
            // FEAST DETECTION: STRICT - only real dead snake food
            // Dead snakes drop BIG beads (size 6+) in a LINE pattern
            // Requirements:
            // 1. At least 4 big beads nearby AND total big mass >= 30
            // 2. OR clear line pattern with 4+ big beads (unmistakable death trail)
            const hasManyBigBeads = bigNear.length >= 4 && bigMass >= 30;
            
            let hasLinePattern = false;
            if (bigNear.length >= 4) {
                const pcsL = pcaLinearity(bigNear.map(f => ({ x: f.xx, y: f.yy })));
                // Line pattern: ratio >= 4, span >= 150 (dead snakes form lines)
                hasLinePattern = (pcsL.ratio >= 4 && pcsL.span >= 150);
            }
            
            // Only trigger frenzy for ACTUAL dead snake food - big beads with line pattern
            const isFeast = hasManyBigBeads || hasLinePattern;
            
            if (isFeast) {
                bypassTspForLocalFeast = true;
                const nowMs3 = performance.now ? performance.now() : Date.now();
                deathFrenzyActive = true;
                deathFrenzyUntil = nowMs3 + 2000; // Stay in feast mode for 2 seconds
                deathFrenzyThresh = bigThresh;
                // Clear TSP route to prevent the blue line from showing
                tspPlan = { route: [], idx: 0, expiresAt: 0 };
                
                // Target the nearest big bead for immediate consumption
                const nearestBig = nearestFood(bigNear, mySnake.xx, mySnake.yy, FEAST_RADIUS);
                let target;
                
                if (nearestBig) {
                    target = { x: nearestBig.xx, y: nearestBig.yy };
                } else {
                    const localC = localWeightedCentroid(bigNear, mySnake.xx, mySnake.yy, FEAST_RADIUS) || { x: mySnake.xx, y: mySnake.yy };
                    target = { x: localC.x, y: localC.y };
                }
                
                foodNavCache = { when: now, target, trailVec: null, feast: { mass: bigMass, count: bigNear.length }, cluster: null, boostMode: 'feast', inCluster: true };
                return returnFoodTarget(foodNavCache);
            }
        }
        if (!foods.length) { foodNavCache = { when: now, target: null, trailVec: null, feast: null, cluster: null, boostMode: 'none', inCluster: false }; return foodNavCache; }
        // TSP snapshot route planning (unless we are clearly feasting)
    const nowMs = performance.now ? performance.now() : Date.now();
    let snapshotMs = Math.max(TSP_SNAPSHOT_MIN_MS, (tspIntervalSec || 10) * 1000);
    if (deathFrenzyActive) snapshotMs = Math.min(snapshotMs, 1000); // even in frenzy, keep route for 1 sec
    
    // Force route refresh ONLY if route is nearly exhausted or we've drifted very far
    let forceRouteRefresh = false;
    if (tspPlan.route.length > 0 && tspPlan.idx >= tspPlan.route.length - 1) {
        forceRouteRefresh = true; // on last waypoint
    }
    if (tspPlan.route.length > 0 && tspPlan.idx < tspPlan.route.length) {
        const nextWp = tspPlan.route[tspPlan.idx];
        const distToNext = Math.hypot(nextWp.x - mySnake.xx, nextWp.y - mySnake.yy);
        if (distToNext > 800) forceRouteRefresh = true; // drifted VERY far from route
    }
    
    // Only consider new route if: no route, expired, or forced refresh
    // IMPORTANT: Don't reconsider just because time passed - must complete current route
    const shouldConsiderNewRoute = !tspPlan.route.length || tspPlan.idx >= tspPlan.route.length || forceRouteRefresh;
    
    if (shouldConsiderNewRoute) {
            // For high-value feast mode, plan route using only big beads above threshold
            // For normal mode, use all foods
            let routeFoods;
            if (deathFrenzyActive || bypassTspForLocalFeast) {
                // Use only high-value foods when in feast mode
                routeFoods = bigOnly.length ? bigOnly : foods;
            } else {
                // Normal mode: use all foods
                routeFoods = foods;
            }
            const newRoute = planTspRoute(mySnake, routeFoods);
            
            // PATH STABILITY: Complete current route before switching
            // Only switch if we have no valid waypoints left
            let shouldSwitch = false;
            if (!tspPlan.route.length || tspPlan.idx >= tspPlan.route.length) {
                // No current route or exhausted, must switch
                shouldSwitch = true;
            } else if (forceRouteRefresh && tspPlan.idx >= tspPlan.route.length - 1) {
                shouldSwitch = true;
            }
            
            if (shouldSwitch && newRoute && newRoute.length) {
                tspPlan = { route: newRoute, idx: 0, expiresAt: nowMs + snapshotMs };
            } else if (!tspPlan.route.length) {
                tspPlan = { route: [], idx: 0, expiresAt: nowMs + Math.min(2000, snapshotMs) };
            }
            // If we have a valid route, don't change it
        }
        // Priority 3: Follow TSP route with dynamic waypoint management
        // Accounts for snake movement dynamics - can't stop, must curve to turn
    if (tspPlan.route && tspPlan.route.length) {
            let idx = tspPlan.idx;
            let waypoint = tspPlan.route[idx];
            const distToWaypoint = waypoint ? Math.hypot(waypoint.x - mySnake.xx, waypoint.y - mySnake.yy) : Infinity;
            
            // Advance distance - increased to account for snake turning radius
            const advanceDist = 80; // Advance when within 80 units (was 50)
            
            let adv = false;
            if (waypoint && distToWaypoint <= advanceDist) {
                idx++; 
                adv = true;
                // Reset stuck tracker when advancing
                waypointStuckTracker = { waypointIdx: -1, nearSince: 0, circleCount: 0, lastAngle: 0 };
            }
            
            // STUCK DETECTION: If we're moderately close but circling, skip waypoint
            const stuckRadius = 150; // Consider "near" if within this range
            if (waypoint && distToWaypoint <= stuckRadius && distToWaypoint > advanceDist) {
                const nowStuck = performance.now ? performance.now() : Date.now();
                
                // Track angle changes to detect circling
                const angleToWaypoint = Math.atan2(waypoint.y - mySnake.yy, waypoint.x - mySnake.xx);
                
                if (waypointStuckTracker.waypointIdx !== idx) {
                    // New waypoint, reset tracker
                    waypointStuckTracker = { waypointIdx: idx, nearSince: nowStuck, circleCount: 0, lastAngle: angleToWaypoint };
                } else {
                    // Same waypoint - check for circling behavior
                    let angleDiff = angleToWaypoint - waypointStuckTracker.lastAngle;
                    // Normalize to [-PI, PI]
                    while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
                    while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
                    
                    // If angle changed significantly, we're moving around the waypoint
                    if (Math.abs(angleDiff) > 0.3) {
                        waypointStuckTracker.circleCount++;
                        waypointStuckTracker.lastAngle = angleToWaypoint;
                    }
                    
                    const stuckDuration = nowStuck - waypointStuckTracker.nearSince;
                    
                    // Skip waypoint if: circled 4+ times OR stuck for 2+ seconds
                    if (waypointStuckTracker.circleCount >= 4 || stuckDuration > 2000) {
                        // Create exclusion zone at this unreachable waypoint
                        exclusionZones.push({
                            x: waypoint.x,
                            y: waypoint.y,
                            radius: EXCLUSION_RADIUS,
                            expiresAt: nowStuck + EXCLUSION_DURATION
                        });
                        
                        // Clear entire route to force complete replan
                        tspPlan = { route: [], idx: 0, expiresAt: 0 };
                        waypointStuckTracker = { waypointIdx: -1, nearSince: 0, circleCount: 0, lastAngle: 0 };
                        adv = true; // Signal that we changed something
                    }
                }
            } else if (waypoint && distToWaypoint > stuckRadius) {
                // Far from waypoint, reset stuck tracker
                waypointStuckTracker = { waypointIdx: -1, nearSince: 0, circleCount: 0, lastAngle: 0 };
            }
            
            if (adv) tspPlan.idx = idx;
            // Only clear route when truly exhausted (idx beyond last waypoint)
            if (tspPlan.idx >= tspPlan.route.length) { 
                // Route complete - will plan new one on next consideration
                tspPlan.route = []; 
                tspPlan.idx = 0; 
            }
            
            if (tspPlan.route.length) {
                const w = tspPlan.route[tspPlan.idx];
                const routeFoods = (deathFrenzyActive || bypassTspForLocalFeast) ? (bigOnly.length ? bigOnly : foods) : foods;
                
                // No immediate food - head toward waypoint but target nearby food along the way
                const near = foodsWithinRadius(routeFoods, w.x, w.y, 150);
                
                // Find the nearest food to US that's near the waypoint
                let targetFood = null;
                let bestDist = Infinity;
                for (const f of near) {
                    const d = Math.hypot(f.xx - mySnake.xx, f.yy - mySnake.yy);
                    if (d < bestDist) {
                        bestDist = d;
                        targetFood = f;
                    }
                }
                
                // If no food near waypoint, check if waypoint is stale (no food there)
                // If so, skip to next waypoint or find nearest food anywhere
                if (!targetFood) {
                    // Waypoint has no food - skip it
                    tspPlan.idx++;
                    if (tspPlan.idx >= tspPlan.route.length) {
                        tspPlan.route = [];
                        tspPlan.idx = 0;
                    }
                    // Find nearest food in our search area as fallback
                    const fallbackFood = nearestFood(routeFoods, mySnake.xx, mySnake.yy, searchR);
                    if (fallbackFood) {
                        const fbx = fallbackFood.xx;
                        const fby = fallbackFood.yy;
                        const fbSegLen = Math.hypot(fbx - mySnake.xx, fby - mySnake.yy);
                        const fbBoostMode = (deathFrenzyActive || bypassTspForLocalFeast) ? 'feast' : 'none';
                        foodNavCache = { when: now, target: { x: fbx, y: fby }, trailVec: null, feast: null, cluster: null, boostMode: fbBoostMode, inCluster: fbSegLen <= INNER_CLUSTER_RADIUS };
                        return returnFoodTarget(foodNavCache);
                    }
                }
                
                // Use the closest food to us near the waypoint
                const tx = targetFood ? targetFood.xx : w.x;
                const ty = targetFood ? targetFood.yy : w.y;
                
                // IMPORTANT: Return the actual target position for display (yellow dot)
                // Lead-point steering will be applied in navigateToTarget
                const segLen = Math.hypot(tx - mySnake.xx, ty - mySnake.yy);
                const boostMode = (deathFrenzyActive || bypassTspForLocalFeast) ? 'feast' : 'none';
                foodNavCache = { when: now, target: { x: tx, y: ty }, trailVec: null, feast: null, cluster: null, boostMode, inCluster: segLen <= INNER_CLUSTER_RADIUS };
                return returnFoodTarget(foodNavCache);
            }
        }

        // 2) Fallback to density/trail/feast logic when route is exhausted
        const grid = buildFoodGrid(foods);
        const cluster = topClusterFromGrid(grid);
        if (!cluster) { foodNavCache = { when: now, target: null, trailVec: null, feast: null, cluster: null, boostMode: 'none', inCluster: false }; return foodNavCache; }
        const feast = detectFeast(foods, cluster.x, cluster.y, FEAST_RADIUS);
        const isFeast = feast.mass >= (feastThreshold || 60) || feast.big >= FEAST_BIG_COUNT;
        const local = detectFeast(foods, mySnake.xx, mySnake.yy, LOCAL_RADIUS);
        const localFeast = detectFeast(foods, mySnake.xx, mySnake.yy, FEAST_RADIUS);
        const localIsFeast = localFeast.mass >= (feastThreshold || 60) || localFeast.big >= FEAST_BIG_COUNT;
        const localIsBest = local.mass >= cluster.weight * LOCAL_DOMINANCE; // require stronger local to cancel travel
        const stickOnLocal = local.mass >= cluster.weight * STICK_RATIO; // stay if local is still rich enough

        let target = null;
        let trail = null;
        let boostMode = 'none';
        let inCluster = false;

        if (localIsFeast) {
            // Highest priority: feast near us, stick and boost
            const localC = localWeightedCentroid(foods, mySnake.xx, mySnake.yy, FEAST_RADIUS) || { x: mySnake.xx, y: mySnake.yy };
            trail = pcaTrailVector(foods, localC.x, localC.y, Math.min(TRAIL_RADIUS, FEAST_RADIUS));
            if (trail) {
                // Micro-target: a bead ahead along trail to ensure actual eating
                const af = aheadFood(foods, mySnake.xx, mySnake.yy, trail.x, trail.y, 0.7, 260) || nearestFood(foods, mySnake.xx, mySnake.yy, 200);
                if (af) target = { x: af.xx, y: af.yy };
                else target = { x: localC.x + trail.x * Math.min(200, TRAIL_LOOKAHEAD), y: localC.y + trail.y * Math.min(200, TRAIL_LOOKAHEAD) };
            } else {
                const nf = nearestFood(foods, mySnake.xx, mySnake.yy, 200);
                target = nf ? { x: nf.xx, y: nf.yy } : { x: localC.x, y: localC.y };
            }
            boostMode = 'feast';
            inCluster = true;
        } else if (isFeast) {
            // Dead snake detected elsewhere: go there first, boost while eating
            // Aim slightly ahead along trail if possible for better lane entry
            trail = pcaTrailVector(foods, cluster.x, cluster.y, TRAIL_RADIUS);
            if (trail) {
                const dx = cluster.x - mySnake.xx, dy = cluster.y - mySnake.yy;
                if (dx*trail.x + dy*trail.y < 0) { trail.x = -trail.x; trail.y = -trail.y; }
                const af = aheadFood(foods, cluster.x, cluster.y, trail.x, trail.y, 0.7, 320);
                target = af ? { x: af.xx, y: af.yy } : { x: cluster.x + trail.x * 200, y: cluster.y + trail.y * 200 };
            } else {
                target = { x: cluster.x, y: cluster.y };
            }
            boostMode = 'feast';
            inCluster = Math.hypot(cluster.x - mySnake.xx, cluster.y - mySnake.yy) <= INNER_CLUSTER_RADIUS;
        } else if (localIsBest || stickOnLocal) {
            // Stay and feast locally if it’s good enough relative to best cluster (stick), even if not strictly dominant
            const localC = localWeightedCentroid(foods, mySnake.xx, mySnake.yy, LOCAL_RADIUS) || { x: mySnake.xx, y: mySnake.yy };
            trail = pcaTrailVector(foods, localC.x, localC.y, Math.min(TRAIL_RADIUS, LOCAL_RADIUS));
            if (trail) {
                const af = aheadFood(foods, mySnake.xx, mySnake.yy, trail.x, trail.y, 0.7, 240) || nearestFood(foods, mySnake.xx, mySnake.yy, 180);
                target = af ? { x: af.xx, y: af.yy } : { x: localC.x + trail.x * Math.min(160, TRAIL_LOOKAHEAD*0.6), y: localC.y + trail.y * Math.min(160, TRAIL_LOOKAHEAD*0.6) };
            } else {
                const nf = nearestFood(foods, mySnake.xx, mySnake.yy, 180);
                target = nf ? { x: nf.xx, y: nf.yy } : { x: localC.x, y: localC.y };
            }
            boostMode = 'none';
            inCluster = true;
        } else {
            // Travel to best cluster within search radius; boost until inside. Favor trail more strongly.
            trail = pcaTrailVector(foods, cluster.x, cluster.y, TRAIL_RADIUS);
            const distToCluster = Math.hypot(cluster.x - mySnake.xx, cluster.y - mySnake.yy);
            // Dynamic lookahead increases with distance to encourage lane-following
            const dynAhead = TRAIL_LOOKAHEAD + Math.min(600, distToCluster * 0.25);
            if (trail) {
                const dx = cluster.x - mySnake.xx, dy = cluster.y - mySnake.yy;
                if (dx*trail.x + dy*trail.y < 0) { trail.x = -trail.x; trail.y = -trail.y; }
                const af = aheadFood(foods, mySnake.xx, mySnake.yy, trail.x, trail.y, 0.7, 280);
                target = af ? { x: af.xx, y: af.yy } : { x: cluster.x + trail.x * dynAhead, y: cluster.y + trail.y * dynAhead };
            } else {
                const nf = nearestFood(foods, mySnake.xx, mySnake.yy, 220);
                target = nf ? { x: nf.xx, y: nf.yy } : { x: cluster.x, y: cluster.y };
            }
            inCluster = distToCluster <= INNER_CLUSTER_RADIUS;
            boostMode = inCluster ? 'none' : 'travel';
        }

        // Apply lead-point calculation to all fallback targets for consistent smooth turning
        if (target) {
            const lead = calcLeadPoint(mySnake, target.x, target.y);
            target = lead;
        }

        foodNavCache = { when: now, target, trailVec: trail, feast, cluster, boostMode, inCluster };
        return returnFoodTarget(foodNavCache);
    }

    /********** Overlay / Compass / Arrow Drawing **********/

    function drawDebugOverlay(mySnake, avoidanceDistance, avoidanceVector = { x: 0, y: 0 }, enabledOverlays = false) {
    if (!overlayCtx || !mySnake || !win.gsc) return;
    const gsc = win.gsc || 1;
    
    // Use the GAME's view coordinates for screen transform (this is what the game uses for rendering)
    // view_xx and view_yy represent the world coordinates at the screen center
    const screenCenterX = window.innerWidth / 2;
    const screenCenterY = window.innerHeight / 2;
    const viewX = win.view_xx || mySnake.xx;
    const viewY = win.view_yy || mySnake.yy;
    
    // Helper to convert world coords to screen coords (using game's view position)
    const worldToScreenX = (wx) => screenCenterX + (wx - viewX) * gsc;
    const worldToScreenY = (wy) => screenCenterY + (wy - viewY) * gsc;
    
    // Player screen position (may not be exactly at center if view is offset)
    const screenX = worldToScreenX(mySnake.xx);
    const screenY = worldToScreenY(mySnake.yy);
    const baseRadius = avoidanceDistance * gsc;

    overlayCtx.save();

    // Core collision/search visuals (only draw when Collision Overlay is on)
    if (showCollisionOverlay) {
        // Get both radii
        const radarRadius = getRadarRadius() * gsc;
        const collisionRadius = getCollisionAvoidRadius() * gsc;
        
        // Draw OUTER radar/detection circle (blue - where threats are tracked)
        if (radarRadius > 0) {
            overlayCtx.beginPath();
            overlayCtx.arc(screenX, screenY, radarRadius, 0, 2 * Math.PI);
            overlayCtx.strokeStyle = "rgba(80, 150, 255, 0.5)";
            overlayCtx.lineWidth = 2;
            overlayCtx.setLineDash([12, 6]);
            overlayCtx.stroke();
            overlayCtx.setLineDash([]);
            overlayCtx.closePath();
        }
        
        // Draw INNER collision/avoidance circle (orange/red - actual avoidance zone)
        // Each dash is drawn individually - dashes that intersect threats will flash/glow
        if (collisionRadius > 0) {
            const dashLen = 8;
            const gapLen = 4;
            const circumference = 2 * Math.PI * collisionRadius;
            const totalDashGap = dashLen + gapLen;
            const numDashes = Math.floor(circumference / totalDashGap);
            const dashAngle = (dashLen / circumference) * 2 * Math.PI;
            const gapAngle = (gapLen / circumference) * 2 * Math.PI;
            
            // Animation time for flashing
            const flashTime = Date.now() * 0.008; // Flash speed
            
            // Get collision radius in world units for heatmap check
            const collisionRadiusWorld = getCollisionAvoidRadius();
            
            for (let i = 0; i < numDashes; i++) {
                const startAngle = i * (dashAngle + gapAngle);
                const endAngle = startAngle + dashAngle;
                const midAngle = (startAngle + endAngle) / 2;
                
                // Check if this dash intersects with a threat in the heatmap
                // Map the angle to heatmap sector
                let hasThreat = false;
                if (heatGrid && heatmapCfg) {
                    // Normalize angle to [0, 2PI]
                    let normAngle = midAngle;
                    while (normAngle < 0) normAngle += 2 * Math.PI;
                    while (normAngle >= 2 * Math.PI) normAngle -= 2 * Math.PI;
                    
                    const angBin = Math.floor((normAngle / (2 * Math.PI)) * heatmapCfg.angBins) % heatmapCfg.angBins;
                    
                    // Check rings within collision zone
                    const maxRing = Math.min(heatmapCfg.radBins, Math.ceil(collisionRadiusWorld / heatmapCfg.ringStep));
                    for (let ri = 0; ri < maxRing; ri++) {
                        const idx = heatIndex(angBin, ri);
                        if (heatGrid[idx] > 0.1) {
                            hasThreat = true;
                            break;
                        }
                    }
                }
                
                overlayCtx.beginPath();
                overlayCtx.arc(screenX, screenY, collisionRadius, startAngle, endAngle);
                
                if (hasThreat) {
                    // Flashing glow effect for threatened dashes
                    const flashIntensity = (Math.sin(flashTime + i * 0.5) + 1) / 2; // 0 to 1
                    const alpha = 0.5 + flashIntensity * 0.5; // 0.5 to 1.0
                    const red = Math.floor(255);
                    const green = Math.floor(50 + flashIntensity * 50); // 50-100
                    const blue = Math.floor(flashIntensity * 30); // 0-30
                    
                    overlayCtx.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
                    overlayCtx.lineWidth = 4 + flashIntensity * 2; // 4-6 thickness
                    overlayCtx.shadowColor = `rgba(255, 100, 50, ${flashIntensity * 0.8})`;
                    overlayCtx.shadowBlur = 8 + flashIntensity * 8;
                } else {
                    // Normal dash - subtle orange
                    overlayCtx.strokeStyle = "rgba(255, 140, 50, 0.5)";
                    overlayCtx.lineWidth = 3;
                    overlayCtx.shadowColor = 'transparent';
                    overlayCtx.shadowBlur = 0;
                }
                
                overlayCtx.stroke();
                overlayCtx.closePath();
            }
            // Reset shadow
            overlayCtx.shadowColor = 'transparent';
            overlayCtx.shadowBlur = 0;
        }

        // Food search zone (gold dashed circle)
        const fsr = (typeof getFoodSearchRadius === 'function') ? getFoodSearchRadius() : 0;
        if (fsr > 0 && showFeedingOverlay) {
            const r = fsr * gsc;
            overlayCtx.setLineDash([8,6]);
            overlayCtx.beginPath();
            overlayCtx.arc(screenX, screenY, r, 0, 2 * Math.PI);
            overlayCtx.strokeStyle = "rgba(255, 215, 0, 0.7)";
            overlayCtx.lineWidth = 2;
            overlayCtx.stroke();
            overlayCtx.setLineDash([]);
            overlayCtx.closePath();
        }
    }

    // Additional debug info (drawn when any overlay is active)
    if (showCollisionOverlay || showFeedingOverlay) {
        if (avoidanceVector.x !== 0 || avoidanceVector.y !== 0) {
            const vectorLength = Math.hypot(avoidanceVector.x, avoidanceVector.y);
            if (vectorLength > 0) {
                const scale = 80 / vectorLength; // Longer arrow for visibility
                const endX = screenX + avoidanceVector.x * scale;
                const endY = screenY + avoidanceVector.y * scale;
                // Draw escape direction arrow
                overlayCtx.beginPath();
                overlayCtx.moveTo(screenX, screenY);
                overlayCtx.lineTo(endX, endY);
                overlayCtx.strokeStyle = "rgba(0, 255, 100, 0.9)";
                overlayCtx.lineWidth = 3;
                overlayCtx.stroke();
                // Arrow head
                const angle = Math.atan2(avoidanceVector.y, avoidanceVector.x);
                const headLen = 12;
                overlayCtx.beginPath();
                overlayCtx.moveTo(endX, endY);
                overlayCtx.lineTo(endX - headLen * Math.cos(angle - 0.4), endY - headLen * Math.sin(angle - 0.4));
                overlayCtx.moveTo(endX, endY);
                overlayCtx.lineTo(endX - headLen * Math.cos(angle + 0.4), endY - headLen * Math.sin(angle + 0.4));
                overlayCtx.stroke();
                overlayCtx.closePath();
            }
        }

        if (foodTarget && showFeedingOverlay && !isCurrentlyAvoiding) {
            const foodScreenX = worldToScreenX(foodTarget.x);
            const foodScreenY = worldToScreenY(foodTarget.y);
            overlayCtx.beginPath();
            overlayCtx.arc(foodScreenX, foodScreenY, 15, 0, 2 * Math.PI);
            overlayCtx.fillStyle = "rgba(255, 215, 0, 0.7)";
            overlayCtx.fill();
            overlayCtx.closePath();
        }
    }

    // TSP path overlay (part of Feeding Overlay) - only show if auto-eat is enabled and NOT avoiding
    if (showFeedingOverlay && autoEatEnabled && !isCurrentlyAvoiding) {
        overlayCtx.save();
        
        // Use different colors for feast mode
        const isFeastMode = deathFrenzyActive || bypassTspForLocalFeast;
        const pathColor = isFeastMode ? 'rgba(255, 100, 0, 0.9)' : 'rgba(0, 200, 255, 0.9)';
        const waypointColor = isFeastMode ? 'rgba(255, 100, 0, 0.8)' : 'rgba(0, 200, 255, 0.8)';
        const currentWaypointColor = isFeastMode ? 'rgba(255, 200, 0, 0.9)' : 'rgba(0, 255, 180, 0.9)';
        
        overlayCtx.lineWidth = 2;
        overlayCtx.strokeStyle = pathColor;
        overlayCtx.fillStyle = pathColor;
        
        // Draw path: head → current target (foodTarget only)
        // Only show waypoints if the target IS on the current waypoint
        const hx = screenCenterX;
        const hy = screenCenterY;
        
        if (foodTarget) {
            const targetX = worldToScreenX(foodTarget.x);
            const targetY = worldToScreenY(foodTarget.y);
            
            // Draw line from head to target
            overlayCtx.beginPath();
            overlayCtx.moveTo(hx, hy);
            overlayCtx.lineTo(targetX, targetY);
            
            // Check if target is on/near the current waypoint - only then show rest of path
            let targetIsOnPath = false;
            let waypointStartIdx = tspPlan.idx;
            
            if (tspPlan && tspPlan.route && tspPlan.route.length > 0 && tspPlan.idx < tspPlan.route.length) {
                const currentWaypoint = tspPlan.route[tspPlan.idx];
                const distToWaypoint = Math.hypot(foodTarget.x - currentWaypoint.x, foodTarget.y - currentWaypoint.y);
                if (distToWaypoint < 200) {
                    targetIsOnPath = true;
                    waypointStartIdx = tspPlan.idx + 1; // Start from NEXT waypoint
                }
            }
            
            // Only draw remaining waypoints if target is on the path
            if (targetIsOnPath && tspPlan && tspPlan.route && tspPlan.route.length > waypointStartIdx) {
                for (let i = waypointStartIdx; i < tspPlan.route.length; i++) {
                    const p = tspPlan.route[i];
                    const px = worldToScreenX(p.x);
                    const py = worldToScreenY(p.y);
                    overlayCtx.lineTo(px, py);
                }
            }
            overlayCtx.stroke();
            
            // Draw waypoints as small circles (only if target is on path)
            if (targetIsOnPath && tspPlan && tspPlan.route && tspPlan.route.length > 0) {
                for (let i = waypointStartIdx; i < tspPlan.route.length; i++) {
                    const p = tspPlan.route[i];
                    const px = worldToScreenX(p.x);
                    const py = worldToScreenY(p.y);
                    overlayCtx.beginPath();
                    overlayCtx.arc(px, py, 3, 0, 2*Math.PI);
                    overlayCtx.fillStyle = waypointColor;
                    overlayCtx.fill();
                }
            }
        }
        
        // Draw rotating dashed circle around snake during feast mode
        if (isFeastMode) {
            const time = Date.now() * 0.003; // Rotation speed
            const radius = 25 * gsc; // Circle radius
            const dashLength = 8 * gsc; // Length of each dash
            const gapLength = 6 * gsc; // Gap between dashes
            const circumference = 2 * Math.PI * radius;
            const dashCount = Math.floor(circumference / (dashLength + gapLength));
            
            overlayCtx.strokeStyle = pathColor;
            overlayCtx.lineWidth = 3;
            
            for (let i = 0; i < dashCount; i++) {
                const angle = (i / dashCount) * 2 * Math.PI + time;
                const startAngle = angle;
                const endAngle = angle + (dashLength / radius);
                
                overlayCtx.beginPath();
                overlayCtx.arc(hx, hy, radius, startAngle, endAngle);
                overlayCtx.stroke();
            }
        }
        
        overlayCtx.restore();
    }

    // Compact numeric debug HUD near head when Debug/Planner visible and we have last avoidance debug
    try {
        if (false && window.__lastAvoidanceDebug) {
            const dbg = window.__lastAvoidanceDebug;
            const lines = [
                `TTC:${(dbg.ttcNow!=null?(dbg.ttcNow*1000|0):'-')}ms`,
                `Clr:${(dbg.immediateClear|0)} Best:${(dbg.bestClear|0)}`,
                `MinA:${(dbg.minApproach|0)} Enc:${dbg.encircled?1:0}`,
                `CW:${(dbg.cwScore|0)} CCW:${(dbg.ccwScore|0)}`
            ];
            overlayCtx.save();
            overlayCtx.font = "12px Orbitron, monospace";
            overlayCtx.textAlign = "left";
            overlayCtx.textBaseline = "top";
            overlayCtx.fillStyle = "rgba(255,255,255,0.9)";
            const pad = 4, lh = 14; let x = screenX + 14, y = screenY - 14;
            overlayCtx.fillText(lines[0], x, y);
            overlayCtx.fillText(lines[1], x, y+lh);
            overlayCtx.fillText(lines[2], x, y+2*lh);
            overlayCtx.fillText(lines[3], x, y+3*lh);
            overlayCtx.restore();
        }
    } catch(_) {}

    // Draw exclusion zones (areas where snake got stuck) - red hatched circles
    if (showFeedingOverlay && exclusionZones.length > 0) {
        const nowExclVis = performance.now ? performance.now() : Date.now();
        
        for (const zone of exclusionZones) {
            if (zone.expiresAt <= nowExclVis) continue; // Skip expired
            
            const zx = worldToScreenX(zone.x);
            const zy = worldToScreenY(zone.y);
            const zr = zone.radius * gsc;
            
            // Semi-transparent red fill
            overlayCtx.beginPath();
            overlayCtx.arc(zx, zy, zr, 0, 2 * Math.PI);
            overlayCtx.fillStyle = "rgba(255, 50, 50, 0.15)";
            overlayCtx.fill();
            
            // Red dashed border
            overlayCtx.setLineDash([8, 6]);
            overlayCtx.strokeStyle = "rgba(255, 80, 80, 0.6)";
            overlayCtx.lineWidth = 2;
            overlayCtx.stroke();
            overlayCtx.setLineDash([]);
            overlayCtx.closePath();
            
            // "X" through center
            const xSize = 15;
            overlayCtx.beginPath();
            overlayCtx.moveTo(zx - xSize, zy - xSize);
            overlayCtx.lineTo(zx + xSize, zy + xSize);
            overlayCtx.moveTo(zx + xSize, zy - xSize);
            overlayCtx.lineTo(zx - xSize, zy + xSize);
            overlayCtx.strokeStyle = "rgba(255, 80, 80, 0.7)";
            overlayCtx.lineWidth = 3;
            overlayCtx.stroke();
            overlayCtx.closePath();
        }
    }

    overlayCtx.restore();
}
    // Fast, per-frame threat discs for overlay only (avoids cachedAvoidance lag)
    // Returns safety radius based on sensitivity slider - now screen-relative
    function calcSafetyRadiusFromSensitivity(){
        return getEffectiveRadius();
    }
    
    function updateModOverlay(noResched) {
    if (!overlayCtx || !overlayCanvas || !overlayCanvas.getContext) {
        // Attempt to recreate if context is lost (less likely, but safe)
        createOverlayCanvas();
        if (!overlayCtx) {
            requestAnimationFrame(updateModOverlay); // Try again next frame
            return;
        }
    }

    // Determine if the game is actively being played
    const isPlaying = win.playing || !!getMySnake() ||
                      (win.slithers && win.slithers.length > 0 && win.slithers.some(s => s && typeof s.xx === "number"));

    if (!isPlaying) {
        // Reset cursor on landing page/when not playing
        document.body.style.cursor = "default";
        const canvases = document.getElementsByTagName("canvas");
        for (let canvas of canvases) {
            canvas.style.cursor = "default";
        }
        overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height); // Clear overlay when not playing
        requestAnimationFrame(updateModOverlay);
        return;
    }

    // Apply custom cursor during gameplay
    updateCursor();

    // Clear the overlay canvas for the new frame
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

    // Get current view and player position (handle potential nulls)
    const mySnakeForOverlay = getMySnake();
    let myX = mySnakeForOverlay ? mySnakeForOverlay.xx : (win.view_xx || 0);
    let myY = mySnakeForOverlay ? mySnakeForOverlay.yy : (win.view_yy || 0);
    let viewX = win.view_xx || (myX - (window.innerWidth / 2) / (win.gsc || 1));
    let viewY = win.view_yy || (myY - (window.innerHeight / 2) / (win.gsc || 1));

    // Heatmap overlay
    if (showHeatmapOverlay) {
        try { buildThreatHeat(mySnakeForOverlay); } catch(_) {}
        try { drawThreatHeat(overlayCtx, mySnakeForOverlay, viewX, viewY, (win.gsc||1)); } catch(_) {}
    }

    // --- Auto-Avoidance / Debug Overlay Logic ---
    // Calculate avoidance data IF autoAvoidEnabled is true, otherwise provide default zero data.
    const needAvoid = (autoAvoidEnabled || showCollisionOverlay);
    const minAvoidInterval = showCollisionOverlay ? 16 : 30;
    const avoidanceData = needAvoid ? cachedAvoidance(getMySnake(), minAvoidInterval) : { distance: showCollisionOverlay ? Math.round((avoidanceSensitivity/100) * 300) : 0, threats: [], vector: { x: 0, y: 0 } };
    // If we’re not using redraw sync, push an extra same-frame overlay draw after avoidance to reduce visual lag
    if (!useRedrawSync && (showCollisionOverlay || showHeatmapOverlay)) {
        try { /* draw-focused tick */ } catch(_) {}
    }

    // Call the drawing function if any overlay layer is on
    if (autoAvoidEnabled || showCollisionOverlay || showFeedingOverlay) {
        // Render basic collision/food rings via drawDebugOverlay, governed by specific flags
        const wantAnyBase = (showCollisionOverlay || showFeedingOverlay);
        if (wantAnyBase) {
            const safetyRadius = calcSafetyRadiusFromSensitivity();
            drawDebugOverlay(getMySnake(),
                (showCollisionOverlay ? safetyRadius : 0),
                (showCollisionOverlay ? avoidanceData.vector : {x:0,y:0}),
                (showCollisionOverlay || showFeedingOverlay));
        }
    }

    // Update tiny status HUD
    if (statusDiv) {
        const hasSetm = typeof win.setm === 'function';
        const ms = getMySnake();
        const b = Math.round(boostBudget);
        const accFlag = (()=>{
            try {
                const s = win.snake || {};
                return (s.accel||s.acc||s.want_accel||win.accel||win.acc||win.want_accel) ? 1 : 0;
            } catch(_) { return 0; }
        })();
        const routeInfo = tspPlan.route ? `R:${tspPlan.route.length}/${tspPlan.idx}` : 'R:0/0';
        const feastFlag = (deathFrenzyActive || bypassTspForLocalFeast) ? 'F:1' : 'F:0';
        const escapeFlag = lowFoodEscapeActive ? 'ESC' : '';
        statusDiv.textContent = `AE:${autoEatEnabled?'1':'0'} AV:${autoAvoidEnabled?'1':'0'} ${routeInfo} ${feastFlag} ${escapeFlag} snk:${(win.slithers&&win.slithers.length)||0} fd:${(win.foods&&win.foods.length)||0}`;
    }

    // Request the next frame unless we are syncing to game redraw or explicitly disabled
    if (!useRedrawSync && !noResched) requestAnimationFrame(updateModOverlay);
}
    /********** Auto-Avoidance and Navigation **********/
    
    // HEATMAP-BASED AVOIDANCE
    // Only react to heat WITHIN THE COLLISION ZONE (inner circle).
    // Heat outside collision zone is for awareness only, not for steering.
    function calculateAvoidance(mySnake) {
        if (!mySnake || !heatGrid) {
            return { distance: 0, vector: { x: 0, y: 0 }, risk: false, shouldBoost: false };
        }
        
        // Map sensitivity to how aggressively we avoid heat
        if (avoidanceSensitivity <= 0) {
            return { distance: 0, vector: { x: 0, y: 0 }, risk: false, shouldBoost: false };
        }
        
        const myAng = mySnake.ehang != null ? mySnake.ehang : (mySnake.ang || 0);
        
        // Use current resolution settings
        const angBins = heatmapSectors;
        const radBins = heatmapRings;
        
        // CRITICAL: Only consider rings within the COLLISION ZONE, not the full radar
        const radarRadius = getRadarRadius();
        const collisionRadius = getCollisionAvoidRadius();
        const ringStep = radarRadius / radBins;
        
        // Calculate which rings are within the collision zone
        // maxCollisionRing is the last ring index that falls within collision radius
        const maxCollisionRing = Math.min(radBins - 1, Math.floor(collisionRadius / ringStep));
        
        // If collision zone is too small to cover any rings, no avoidance
        if (maxCollisionRing < 0 || collisionRadius <= 0) {
            return { distance: 0, vector: { x: 0, y: 0 }, risk: false, shouldBoost: false };
        }
        
        // Sample heat at different angles, but ONLY within collision zone rings
        function getHeatAtAngle(targetAng) {
            // Normalize angle to 0-2π
            let a = targetAng;
            while (a < 0) a += Math.PI * 2;
            while (a >= Math.PI * 2) a -= Math.PI * 2;
            
            const ai = Math.floor(a / (Math.PI * 2) * angBins) % angBins;
            const ai2 = (ai + 1) % angBins;
            const aiPrev = (ai - 1 + angBins) % angBins;
            
            let heat = 0;
            // ONLY sample rings within the collision zone
            for (let ri = 0; ri <= maxCollisionRing; ri++) {
                // Inner rings weighted more heavily - exponential decay
                const w = 5.0 * Math.pow(0.4, ri); // 5.0, 2.0, 0.8, 0.32, ...
                // Sample this bin and neighbors for smoother reading
                heat += heatGrid[heatIndex(ai, ri)] * w * 0.5;
                heat += heatGrid[heatIndex(ai2, ri)] * w * 0.25;
                heat += heatGrid[heatIndex(aiPrev, ri)] * w * 0.25;
            }
            return heat;
        }
        
        // Get heat in our current forward direction (collision zone only)
        const forwardHeat = getHeatAtAngle(myAng);
        
        // Find the coldest direction by scanning - use sector count for scan resolution
        let coldestAng = myAng;
        let coldestHeat = forwardHeat;
        let hottestHeat = forwardHeat;
        let totalHeat = 0; // Track total heat in COLLISION ZONE only
        const scanSteps = Math.max(16, angBins);
        for (let i = 0; i < scanSteps; i++) {
            const scanAng = (i / scanSteps) * Math.PI * 2;
            const heat = getHeatAtAngle(scanAng);
            totalHeat += heat;
            if (heat < coldestHeat) {
                coldestHeat = heat;
                coldestAng = scanAng;
            }
            if (heat > hottestHeat) {
                hottestHeat = heat;
            }
        }
        
        // Calculate angle difference to coldest direction
        let angleDiff = coldestAng - myAng;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        
        // Only react if there's heat within the collision zone
        const heatThreshold = 0.001;
        const hasHeatInCollisionZone = totalHeat > heatThreshold;
        
        // Risk levels based on heat in collision zone
        const heatRange = hottestHeat - coldestHeat;
        
        // High risk if forward direction has meaningful heat in collision zone
        const highRisk = forwardHeat > 0.05;
        // Any heat in collision zone = should avoid
        const risk = hasHeatInCollisionZone;
        
        // Should boost: escaping from high heat AND coldest direction is significantly cooler
        const needsSharpTurn = Math.abs(angleDiff) > Math.PI / 3;
        const headingToCooler = forwardHeat > coldestHeat * 1.5;
        const shouldBoost = highRisk && headingToCooler && !needsSharpTurn;
        
        // Steering strength scales with heat level in collision zone
        let vectorX = 0, vectorY = 0;
        
        if (hasHeatInCollisionZone) {
            // Base steering distance scaled by sensitivity
            const sensitivityScale = avoidanceSensitivity / 100;
            
            // Heat intensity factor: how much heat relative to typical maximum
            const heatIntensity = Math.min(1, hottestHeat / 3.0);
            
            // Turn strength based on angle difference needed
            const turnStrength = Math.min(1, Math.abs(angleDiff) / (Math.PI / 2));
            
            // Steering scales with collision zone heat
            const minSteer = 50 * sensitivityScale;
            const maxSteer = 500 * sensitivityScale;
            
            // Forward heat in collision zone adds urgency
            const forwardUrgency = forwardHeat > 0.01 ? 1.5 : 1.0;
            const steerDist = Math.max(minSteer, maxSteer * heatIntensity * turnStrength * forwardUrgency);
            
            vectorX = Math.cos(coldestAng) * steerDist;
            vectorY = Math.sin(coldestAng) * steerDist;
        }
        
        return {
            distance: collisionRadius,
            vector: { x: vectorX, y: vectorY },
            risk: risk,
            highRisk: highRisk,
            shouldBoost: shouldBoost,
            forwardHeat: forwardHeat,
            coldestHeat: coldestHeat,
            totalHeat: totalHeat
        };
    }
    
    // Cache avoidance result - but bypass cache when there's active danger
    function cachedAvoidance(mySnake, minIntervalMs = 16) {
        const now = performance.now ? performance.now() : Date.now();
        
        // If last result showed risk/danger, ALWAYS recalculate to catch new threats
        // The heatmap is already rebuilt each frame in gameLoop
        const hadRiskLastFrame = lastAvoidance && (lastAvoidance.risk || lastAvoidance.highRisk);
        if (hadRiskLastFrame) {
            const res = calculateAvoidance(mySnake);
            lastAvoidance = res;
            lastAvoidanceAt = now;
            return res;
        }
        
        // Otherwise use cache for performance
        if (now - lastAvoidanceAt < minIntervalMs && lastAvoidance && lastAvoidance.distance) {
            return lastAvoidance;
        }
        
        const res = calculateAvoidance(mySnake);
        lastAvoidance = res;
        lastAvoidanceAt = now;
        return res;
    }

    function estimateSnakeRadius(s) {
        const sc = typeof s.sc === 'number' ? s.sc : 1;
        return 6 * sc + 2; // heuristic based on snake scale
    }

    function normalizeAngle(a) {
        a = (a + Math.PI) % (2 * Math.PI);
        if (a < 0) a += 2 * Math.PI;
        return a - Math.PI;
    }

    // Convert a world-space point to screen-space and set Slither's mouse aim
    function setAimToWorld(worldX, worldY) {
        if (uiDragging) return; // avoid steering while dragging UI
        if (typeof worldX !== "number" || typeof worldY !== "number") return;
        const gsc = win.gsc || 1;
        const viewX = win.view_xx || 0;
        const viewY = win.view_yy || 0;
        const screenX = (worldX - viewX) * gsc + window.innerWidth / 2;
        const screenY = (worldY - viewY) * gsc + window.innerHeight / 2;
        const clampedX = Math.max(0, Math.min(window.innerWidth, screenX));
        const clampedY = Math.max(0, Math.min(window.innerHeight, screenY));
        const applyAim = () => {
            // Best-path: native setm
            if (typeof win.setm === "function") {
                try { win.setm(clampedX, clampedY); } catch (_) {}
            }
            // Also set commonly used globals
            try {
                win.xm = clampedX; win.ym = clampedY;
                win.mx = clampedX; win.my = clampedY;
            } catch (_) {}

            const pageX = clampedX + (win.pageXOffset || 0);
            const pageY = clampedY + (win.pageYOffset || 0);
            const screenX = (win.screenX || 0) + clampedX;
            const screenY = (win.screenY || 0) + clampedY;

            const opts = { bubbles: true, cancelable: true, view: win, clientX: clampedX, clientY: clampedY, pageX, pageY, screenX, screenY };
            const targets = [win, document, (win.gameCanvas || document.querySelector('canvas.nsi') || document.querySelector('canvas'))].filter(Boolean);
            for (const t of targets) {
                try { t.dispatchEvent(new MouseEvent('mousemove', opts)); } catch (_) {}
                try { t.dispatchEvent(new PointerEvent('pointermove', opts)); } catch (_) {}
            }
        };
        applyAim();
    }

    // --- Boost Control: robust activation using Space and Mouse fallbacks ---
    let boostPressed = false; // whether we've synthetically engaged boost
    let lastBoostCmd = false; // last commanded state by our automation
    function getCanvasTarget() {
        return (win.gameCanvas || document.querySelector('canvas.nsi') || document.querySelector('canvas') || document.body);
    }
    function synthKey(type, opts) {
        const ev = new KeyboardEvent(type, Object.assign({
            bubbles: true,
            cancelable: true,
            key: ' ',
            code: 'Space',
            keyCode: 32,
            which: 32
        }, opts||{}));
        try { if (typeof window.focus === 'function') window.focus(); } catch(_) {}
        try { window.dispatchEvent(ev); } catch(_) {}
        try { document.dispatchEvent(ev); } catch(_) {}
        try {
            const t = (win.gameCanvas || document.querySelector('canvas.nsi') || document.querySelector('canvas'));
            if (t) { try { if (typeof t.focus === 'function') t.focus(); } catch(_) {}; t.dispatchEvent(ev); }
        } catch(_) {}
    }
    function synthMouse(type, btnOpts) {
        const target = getCanvasTarget();
    try { if (target && typeof target.focus === 'function') target.focus(); } catch(_) {}
        const x = (win.xm != null) ? win.xm : (window.innerWidth/2);
        const y = (win.ym != null) ? win.ym : (window.innerHeight/2);
        const pageX = x + (win.pageXOffset||0);
        const pageY = y + (win.pageYOffset||0);
        const screenX = (win.screenX||0) + x;
        const screenY = (win.screenY||0) + y;
        const opts = Object.assign({
            bubbles: true,
            cancelable: true,
            clientX: x, clientY: y,
            pageX, pageY, screenX, screenY,
            button: 0,
            buttons: (type === 'mouseup' ? 0 : 1)
        }, btnOpts||{});
        try { target.dispatchEvent(new MouseEvent(type, opts)); } catch(_) {}
        try { target.dispatchEvent(new PointerEvent(type.replace('mouse','pointer'), opts)); } catch(_) {}
    }
    function setBoostActive(active) {
        if (uiDragging) return; // avoid boost while dragging UI
        // Only act when our desired state changes; this prevents cancelling manual boosts
        if (active === lastBoostCmd) return;
        lastBoostCmd = active;
        if (active) {
            // Try native first
            try { if (typeof win.setAcceleration === 'function') win.setAcceleration(1); } catch(_) {}
            // Fallback flags
            try {
                if (win.snake) {
                    if ('accel' in win.snake) win.snake.accel = true;
                    if ('acc' in win.snake) win.snake.acc = true;
                    if ('want_accel' in win.snake) win.snake.want_accel = true;
                }
                if ('accel' in win) win.accel = true;
                if ('acc' in win) win.acc = true;
                if ('want_accel' in win) win.want_accel = true;
            } catch (_) {}
            // Engage via Space + Mouse press
            synthKey('keydown');
            synthMouse('mousedown');
            // Known direct hooks in some builds
            try { if (typeof win.accelerating === 'function') win.accelerating(1); } catch(_) {}
            boostPressed = true;
        } else {
            // Release only if we engaged
            synthKey('keyup');
            synthMouse('mouseup');
            try { if (typeof win.setAcceleration === 'function') win.setAcceleration(0); } catch(_) {}
            try { if (typeof win.accelerating === 'function') win.accelerating(0); } catch(_) {}
            try {
                if (win.snake) {
                    if ('accel' in win.snake) win.snake.accel = false;
                    if ('acc' in win.snake) win.snake.acc = false;
                    if ('want_accel' in win.snake) win.snake.want_accel = false;
                }
                if ('accel' in win) win.accel = false;
                if ('acc' in win) win.acc = false;
                if ('want_accel' in win) win.want_accel = false;
            } catch (_) {}
            boostPressed = false;
        }
    }

    function navigateToTarget(mySnake, targetX, targetY) {
        if (!mySnake || typeof mySnake.xx !== "number" || typeof mySnake.yy !== "number") return;
        // Clamp target within a safe world radius to avoid steering off-edge
        const world = (typeof win.grd === 'number' && (typeof win.real_flux_grd === 'number' || typeof win.flux_grd === 'number')) ? {
            cx: win.grd,
            cy: win.grd,
            R: (typeof win.real_flux_grd === 'number' && win.real_flux_grd > 0) ? win.real_flux_grd : win.flux_grd
        } : null;
        if (world && typeof world.R === 'number' && world.R > 0) {
            const maxR = Math.max(0, world.R - 200); // small runtime safety margin
            const dx = targetX - world.cx;
            const dy = targetY - world.cy;
            const d = Math.hypot(dx, dy);
            if (d > maxR) {
                const scale = maxR / d;
                targetX = world.cx + dx * scale;
                targetY = world.cy + dy * scale;
            }
        }
        
        // Apply lead-point steering to help snake curve toward target
        // This accounts for the fact that snakes can't stop - they must curve to turn
        const lead = calcLeadPoint(mySnake, targetX, targetY);
        const steerX = lead.x;
        const steerY = lead.y;
        
        // Smooth steering: blend toward target angle to avoid jittery movement
        const dx = steerX - mySnake.xx;
        const dy = steerY - mySnake.yy;
        const targetAngle = Math.atan2(dy, dx);
        
        // Blend current steer angle toward target (low-pass filter)
        let angleDiff = targetAngle - lastSteerAngle;
        while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
        while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
        
        const blendRate = 0.5; // slightly higher for more responsive turning
        lastSteerAngle = lastSteerAngle + angleDiff * blendRate;
        
        // Convert smoothed angle back to world position for aiming
        const aimDist = Math.max(100, Math.hypot(dx, dy));
        const smoothTargetX = mySnake.xx + Math.cos(lastSteerAngle) * aimDist;
        const smoothTargetY = mySnake.yy + Math.sin(lastSteerAngle) * aimDist;
        
        setAimToWorld(smoothTargetX, smoothTargetY);
    }

    function applyTurn(mySnake) {
        if (!isTurning || !mySnake) return;

        const elapsed = Date.now() - turnStartTime;
        if (elapsed >= TURN_DURATION || turnPurpose === null) {
            isTurning = false;
            turnDirection = 0;
            turnPurpose = null;
            return;
        }

        const turnProgress = elapsed / TURN_DURATION;
        const turnAmount = TURN_RATE * turnDirection * turnProgress;

        mySnake.ang += turnAmount;
        mySnake.ang = ((mySnake.ang + 2 * Math.PI) % (2 * Math.PI));
    }

    /********** Game Loop and Automation **********/
    function gameLoop() {

        // (re)grab the live array if we haven’t yet
        if (!win.slithers || win.slithers.length === 0) {
            const s = findSnakeArray();
            if (s) win.slithers = s;
        }
        if (!win.foods || win.foods.length === 0) {
            const f = findFoodsArray();
            if (f) win.foods = f;
        }

    // Guard Clause: Check for playing state AND a valid snake object with valid coordinates
    // Use optional chaining (?.) for safer access to snake properties during the check
    const mySnakeCandidate = getMySnake();
    if (!mySnakeCandidate || typeof mySnakeCandidate.xx !== 'number' || typeof mySnakeCandidate.yy !== 'number') {
        // Snake not ready or not playing, wait and try again
        setTimeout(gameLoop, 50); // Use a slightly longer delay when not ready
        return; // Exit this tick
    }

    // --- If execution reaches here, win.snake is valid ---

    // Assign the snake object AFTER the check passes
    const mySnake = mySnakeCandidate;

    // --- Feature Logic ---
    let aimedByAvoid = false;
    // Maintain boost budget every tick
    try { updateBoostBudget(mySnake); } catch (_) {}
    // Hard safety: avoid world edge first
    try {
        const cx = (typeof win.grd === 'number') ? win.grd : null;
        const cy = cx; // world is centered at (grd, grd)
        const R = (typeof win.real_flux_grd === 'number' && win.real_flux_grd > 0) ? win.real_flux_grd : win.flux_grd;
        if (cx != null && cy != null && typeof R === 'number' && R > 0) {
            const EDGE_MARGIN = 600; // start turning back inside before hitting the ring
            const dx = mySnake.xx - cx;
            const dy = mySnake.yy - cy;
            const dist = Math.hypot(dx, dy);
            if (dist > R - EDGE_MARGIN) {
                setAimToWorld(cx, cy);
                aimedByAvoid = true;
            }
        }
    } catch (_) {}
    let avoidanceForBoost = {vector:{x:0,y:0}, risk:false, shouldBoost:false};
    let actualDanger = false;
    isCurrentlyAvoiding = false; // Reset each frame
    if (autoAvoidEnabled) {
        // CRITICAL: Rebuild heatmap EVERY frame when avoidance is enabled
        // This ensures we detect new threats immediately
        try { buildThreatHeat(mySnake); } catch(_) {}
        
        // Use shorter cache (8ms) when already avoiding to catch new threats faster
        const cacheTime = isCurrentlyAvoiding ? 8 : 16;
        const avoidance = cachedAvoidance(mySnake, cacheTime);
        avoidanceForBoost = avoidance;
        // ANY heat in radar = should avoid (risk flag is true if any heat detected)
        actualDanger = !!avoidance.risk;
        // PRIORITY 1: Avoidance ALWAYS takes precedence when ANY heat is detected
        // The avoidance vector is already scaled by heat intensity, so even low heat
        // produces gentle steering while high heat produces aggressive avoidance
        if (avoidance.vector.x !== 0 || avoidance.vector.y !== 0) {
            const safeX = mySnake.xx + avoidance.vector.x;
            const safeY = mySnake.yy + avoidance.vector.y;
            setAimToWorld(safeX, safeY);
            aimedByAvoid = true;
            isCurrentlyAvoiding = true; // Set flag to hide food overlay
            
            // Clear TSP route after collision avoidance so we find a new food path
            // Only clear if we had significant avoidance (not just minor adjustments)
            const avoidMagnitude = Math.hypot(avoidance.vector.x, avoidance.vector.y);
            if (avoidMagnitude > 30 && tspPlan.route.length > 0) {
                tspPlan = { route: [], idx: 0, expiresAt: 0 };
            }
        }
    }

    // Auto-eat steering (only if avoidance didn't already aim this frame)
    if (autoEatEnabled && !aimedByAvoid) {
        const nav = pickFoodTargetCached(mySnake);
        foodTarget = nav.target;
        
        // FOOD TARGET STUCK DETECTION - detect tight circling around target
        if (foodTarget) {
            const distToTarget = Math.hypot(foodTarget.x - mySnake.xx, foodTarget.y - mySnake.yy);
            const nowFTS = performance.now ? performance.now() : Date.now();
            const stuckRadius = 120; // Tighter detection radius
            const advanceDist = 30;  // If within this, we should eat it
            
            // Check if same target (within 50 units)
            const sameTarget = Math.hypot(foodTarget.x - foodTargetStuckTracker.targetX, 
                                          foodTarget.y - foodTargetStuckTracker.targetY) < 50;
            
            if (distToTarget <= stuckRadius && distToTarget > advanceDist) {
                const angleToTarget = Math.atan2(foodTarget.y - mySnake.yy, foodTarget.x - mySnake.xx);
                
                if (!sameTarget) {
                    // New target, reset tracker
                    foodTargetStuckTracker = { 
                        targetX: foodTarget.x, targetY: foodTarget.y, 
                        nearSince: nowFTS, circleCount: 0, lastAngle: angleToTarget 
                    };
                } else {
                    // Same target - check for circling
                    let angleDiff = angleToTarget - foodTargetStuckTracker.lastAngle;
                    while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
                    while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
                    
                    if (Math.abs(angleDiff) > 0.25) { // More sensitive angle detection
                        foodTargetStuckTracker.circleCount++;
                        foodTargetStuckTracker.lastAngle = angleToTarget;
                    }
                    
                    const stuckDuration = nowFTS - foodTargetStuckTracker.nearSince;
                    
                    // Create exclusion if: circled 5+ times OR stuck for 2.5+ seconds
                    if (foodTargetStuckTracker.circleCount >= 5 || stuckDuration > 2500) {
                        // Create exclusion zone at this unreachable food
                        exclusionZones.push({
                            x: foodTarget.x,
                            y: foodTarget.y,
                            radius: EXCLUSION_RADIUS,
                            expiresAt: nowFTS + EXCLUSION_DURATION
                        });
                        
                        // Clear route to force complete replan
                        tspPlan = { route: [], idx: 0, expiresAt: 0 };
                        foodTargetStuckTracker = { targetX: 0, targetY: 0, nearSince: 0, circleCount: 0, lastAngle: 0 };
                        
                        // Clear the target so we pick a new one next frame
                        foodTarget = null;
                        foodNavCache = { when: 0, target: null, trailVec: null, feast: null, cluster: null, boostMode: 'none', inCluster: false };
                    }
                }
            } else if (distToTarget > stuckRadius || distToTarget <= advanceDist) {
                // Far from target or ate it - reset tracker
                foodTargetStuckTracker = { targetX: 0, targetY: 0, nearSince: 0, circleCount: 0, lastAngle: 0 };
            }
        }
        
        if (foodTarget) {
            navigateToTarget(mySnake, foodTarget.x, foodTarget.y);
        }
        // No boosting from auto-eat anymore
        lastBoostMode = 'none';
    }

    // Boost: during death-frenzy, always boost; otherwise use heatmap's shouldBoost recommendation
    // The heatmap tells us to boost when escaping to cooler area AND not needing sharp turn
    const nowBoostMs = performance.now ? performance.now() : Date.now();
    const BOOST_HYST_MS = 180; // small stickiness to prevent flicker
    if (typeof window.__boostStickUntil === 'undefined') window.__boostStickUntil = 0;
    if (deathFrenzyActive) {
        // Simple danger check using risk flag
        const imminentDanger = !!avoidanceForBoost.risk;
        if (imminentDanger) {
            // Prioritize avoidance boosting during danger even in frenzy
            setBoostActive(true);
            lastBoosting = true;
            lastBoostMode = 'avoid';
        } else {
            setBoostActive(true);
            lastBoosting = true;
            lastBoostMode = 'frenzy';
        }
    } else {
        // Use the heatmap's shouldBoost recommendation
        // It considers: risk level, heading to cooler area, turn sharpness
        const heatmapWantsBoost = !!avoidanceForBoost.shouldBoost;
        if (heatmapWantsBoost) window.__boostStickUntil = nowBoostMs + BOOST_HYST_MS;
        const shouldBoost = heatmapWantsBoost || (nowBoostMs < window.__boostStickUntil);
        setBoostActive(shouldBoost);
        lastBoosting = shouldBoost;
        lastBoostMode = shouldBoost ? 'avoid' : 'none';
    }
    // Schedule the next loop iteration
    setTimeout(gameLoop, 16); // ~60Hz automation
}
    /********** Quick Respawn and Quit **********/
    function quickRespawn() {
        if (win.playing) {
            win.want_close_socket = true;
            win.dead_mtm = -1;
        }
        setTimeout(() => {
            if (win.connect) win.connect();
        }, 100);
    }

    function quitToMenu() {
        if (win.playing) {
            win.want_close_socket = true;
            win.dead_mtm = -1;
            win.playing = false;
            document.getElementById("login").style.display = "block";
            document.getElementById("game_area_wrapper").style.display = "none";
        }
    }

function updateCursor() {
    const halfSize = CURSOR_SIZE / 2;
    const cursorSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${CURSOR_SIZE}" height="${CURSOR_SIZE}" viewBox="0 0 ${CURSOR_SIZE} ${CURSOR_SIZE}">
            <g opacity="${CURSOR_OPACITY}">
                <line x1="${halfSize}" y1="0" x2="${halfSize}" y2="${CURSOR_SIZE}" stroke="white" stroke-width="2"/>
                <line x1="0" y1="${halfSize}" x2="${CURSOR_SIZE}" y2="${halfSize}" stroke="white" stroke-width="2"/>
            </g>
        </svg>
    `;
    const cursorDataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(cursorSvg)}`;
    const cursorStyle = `url("${cursorDataUri}") ${halfSize} ${halfSize}, crosshair`;

    document.body.style.cursor = cursorStyle;

    const canvases = document.getElementsByTagName("canvas");
    for (let canvas of canvases) {
        // Skip the radar preview canvas - it has its own cursor handling
        if (canvas.id === 'radar-preview-canvas') continue;
        canvas.style.cursor = cursorStyle;
    }
}
 function hookRenderLoop() {
    if (win.redraw) {
        const originalRedraw = win.redraw;
        win.redraw = function (...args) {
            originalRedraw.apply(this, args);
            if (win.gsc !== customZoomLevel) {
                //console.log(`[hookRenderLoop] Enforcing gsc, expected:`, customZoomLevel, `actual:`, win.gsc);
                win.gsc = customZoomLevel;
            }
            // Draw overlay immediately after game redraw for zero-lag visuals
            try { useRedrawSync = true; updateModOverlay(true); } catch(_) {}
        };
        //console.log('[hookRenderLoop] Successfully hooked into redraw');
    } else {
        function applyZoomOnFrame() {
            if (win.gsc !== customZoomLevel) {
                //console.log(`[hookRenderLoop] Enforcing gsc, expected:`, customZoomLevel, 'actual:', win.gsc);
                win.gsc = customZoomLevel;
            }
            requestAnimationFrame(applyZoomOnFrame);
        }
        applyZoomOnFrame();
    }
}
    /********** Initialization **********/

   function initialize() {
    if (isInitialized || !document.body) {
        setTimeout(initialize, 100);
        return;
    }
    isInitialized = true;

    loadPersistentData();
    originalBodyStyle = document.body.style.cssText;
    backupBgImage = win.bgi;

    nickInputElem = document.getElementById("nick");
    if (nickInputElem) {
        nickInputElem.addEventListener("input", () => {
            win.localStorage.setItem("nick", nickInputElem.value);
        });
    }

    createModInfo();
    setupPlayButton();
    loadSettings();
    createOverlayCanvas();
    // Create popup first so the controls dock can embed inside the General tab
    createSettingsPopup();
    // Now build sliders into the dock (which will adopt the popup's host)
    createSensitivitySlider();
    initializeSlithers();

    hookRenderLoop();

    document.addEventListener("wheel", handleZoom, { passive: false, capture: true });
window.addEventListener("keydown", handleKeyBindings);

    setInterval(() => {
    if (backgroundNeedsUpdate) {
            const useDefaultBg = win.localStorage.getItem(STORAGE_KEYS.defaultBgEnabled) === "true";
            if (useDefaultBg && backupBgImage) {
                win.bgi = backupBgImage;
                document.body.style.background = "";
                document.body.style.backgroundColor = "";
            } else {
                const bgColor = win.localStorage.getItem(STORAGE_KEYS.bgColor) || DEFAULT_BG_COLOR;
                setCustomBackgroundColor(bgColor);
            }
            backgroundNeedsUpdate = false;
        }
    }, 100);

    setTimeout(gameLoop, 500);
}


    waitForCanvas();

    })(typeof unsafeWindow !== 'undefined' ? unsafeWindow : window);