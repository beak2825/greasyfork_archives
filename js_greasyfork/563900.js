// ==UserScript==
// @name         Bonker Client
// @version      1.0(beta)
// @description  Advanced Bonk.io client with trajectory prediction, ESP, player tracking, and more
// @author       Triton (Enhanced)
// @icon         https://bonk.io/graphics/tt/favicon-32x32.png
// @match        https://bonk.io/*
// @match        https://bonk.io/gameframe-release.html
// @run-at       document-end
// @grant        none
// @namespace    https://greasyfork.org/users/1015072
// @downloadURL https://update.greasyfork.org/scripts/563900/Bonker%20Client.user.js
// @updateURL https://update.greasyfork.org/scripts/563900/Bonker%20Client.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function injector(func) {
        if (window.location.hostname === "bonk.io" && window.location.pathname !== "/gameframe-release.html") {
            const waitForFrame = setInterval(() => {
                const frame = document.getElementById("maingameframe");
                if (frame && frame.contentWindow && frame.contentDocument) {
                    const script = document.createElement("script");
                    script.textContent = `(${func.toString()})();`;
                    frame.contentDocument.head.appendChild(script);
                    clearInterval(waitForFrame);
                }
            }, 500);
        } else {
            func();
        }
    }

    injector(function () {
        const scope = window;
        if (!scope.PIXI || !scope.PIXI.Graphics) return;

        // Prevent duplicate UI creation
        if (scope._trajectoryDebugLoaded) return;
        scope._trajectoryDebugLoaded = true;

        //Constants
        const BASE_RADIUS_PPM = 19.709589041095892;

        const PHYSICS = {
            GRAVITY: 197,
            VEL_MULT: 592,
            VEL_BASE: 301
        };

        const CONFIG = {
            MAX_CHARGE: 1.5,
            KEY: "KeyZ",
            POINTS: 50,
            SIM_TIME: 10.0,
            DRAW_ENEMIES: true,
            REQUIRE_KEY_FOR_SELF: false,
            SHOW_TRAJECTORY: true, // Changed from ALWAYS_SHOW_SELF - now controls if trajectory shows at all
            DRAW_NEAREST_LINE: false,
            DRAW_ALL_PLAYER_LINES: false,
            DRAW_SELF_HITBOX: false,
            MUTE_MUSIC: false,
            HIDE_UI_KEY: "KeyO",

            LOCAL: {
                COLOR: 0xD3D3D3,
                THICKNESS: 2,
                ALPHA: 0.1,
            },

            ENEMY: {
                COLOR: 0xD3D3D3,
                THICKNESS: 2,
                ALPHA: 0.1,
            },

            NEAREST_LINE: {
                COLOR: 0xFF0000,
                THICKNESS: 3,
                ALPHA: 0.6,
            },

            ALL_PLAYERS_LINE: {
                COLOR: 0xFF0000,
                NEAREST_COLOR: 0x00FF00,
                THICKNESS: 1,
                ALPHA: 0.4,
            },

            SELF_HITBOX: {
                OUTLINE_COLOR: 0x00FF00,
                FILL_COLOR: 0x00FF00,
                OUTLINE_THICKNESS: 3,
                FILL_ALPHA: 0.15,
                OUTLINE_ALPHA: 0.8,
            }
        };

        let uiCompletelyHidden = false;
        let isFullscreen = false;
        let isResizing = false;
        let resizeStartX, resizeStartY, resizeStartWidth, resizeStartHeight;

        // Load settings from localStorage
        function loadSettings() {
            try {
                const saved = localStorage.getItem('bonkTrajectorySettings');
                if (saved) {
                    const settings = JSON.parse(saved);
                    if (settings.DRAW_ENEMIES !== undefined) CONFIG.DRAW_ENEMIES = settings.DRAW_ENEMIES;
                    if (settings.SHOW_TRAJECTORY !== undefined) CONFIG.SHOW_TRAJECTORY = settings.SHOW_TRAJECTORY;
                    if (settings.DRAW_NEAREST_LINE !== undefined) CONFIG.DRAW_NEAREST_LINE = settings.DRAW_NEAREST_LINE;
                    if (settings.DRAW_ALL_PLAYER_LINES !== undefined) CONFIG.DRAW_ALL_PLAYER_LINES = settings.DRAW_ALL_PLAYER_LINES;
                    if (settings.DRAW_SELF_HITBOX !== undefined) CONFIG.DRAW_SELF_HITBOX = settings.DRAW_SELF_HITBOX;
                    if (settings.MUTE_MUSIC !== undefined) CONFIG.MUTE_MUSIC = settings.MUTE_MUSIC;
                    if (settings.HIDE_UI_KEY !== undefined) CONFIG.HIDE_UI_KEY = settings.HIDE_UI_KEY;
                    if (settings.LOCAL_COLOR !== undefined) CONFIG.LOCAL.COLOR = settings.LOCAL_COLOR;
                    if (settings.LOCAL_ALPHA !== undefined) CONFIG.LOCAL.ALPHA = settings.LOCAL_ALPHA;
                    if (settings.LOCAL_THICKNESS !== undefined) CONFIG.LOCAL.THICKNESS = settings.LOCAL_THICKNESS;
                    if (settings.ENEMY_COLOR !== undefined) CONFIG.ENEMY.COLOR = settings.ENEMY_COLOR;
                    if (settings.ENEMY_ALPHA !== undefined) CONFIG.ENEMY.ALPHA = settings.ENEMY_ALPHA;
                    if (settings.ENEMY_THICKNESS !== undefined) CONFIG.ENEMY.THICKNESS = settings.ENEMY_THICKNESS;
                    if (settings.NEAREST_LINE_COLOR !== undefined) CONFIG.NEAREST_LINE.COLOR = settings.NEAREST_LINE_COLOR;
                    if (settings.NEAREST_LINE_ALPHA !== undefined) CONFIG.NEAREST_LINE.ALPHA = settings.NEAREST_LINE_ALPHA;
                    if (settings.NEAREST_LINE_THICKNESS !== undefined) CONFIG.NEAREST_LINE.THICKNESS = settings.NEAREST_LINE_THICKNESS;
                    if (settings.HITBOX_OUTLINE_THICKNESS !== undefined) CONFIG.SELF_HITBOX.OUTLINE_THICKNESS = settings.HITBOX_OUTLINE_THICKNESS;
                }
            } catch (e) {
                console.error('Error loading settings:', e);
            }
        }

        // Save settings to localStorage
        function saveSettings() {
            try {
                const settings = {
                    DRAW_ENEMIES: CONFIG.DRAW_ENEMIES,
                    SHOW_TRAJECTORY: CONFIG.SHOW_TRAJECTORY,
                    DRAW_NEAREST_LINE: CONFIG.DRAW_NEAREST_LINE,
                    DRAW_ALL_PLAYER_LINES: CONFIG.DRAW_ALL_PLAYER_LINES,
                    DRAW_SELF_HITBOX: CONFIG.DRAW_SELF_HITBOX,
                    MUTE_MUSIC: CONFIG.MUTE_MUSIC,
                    HIDE_UI_KEY: CONFIG.HIDE_UI_KEY,
                    LOCAL_COLOR: CONFIG.LOCAL.COLOR,
                    LOCAL_ALPHA: CONFIG.LOCAL.ALPHA,
                    LOCAL_THICKNESS: CONFIG.LOCAL.THICKNESS,
                    ENEMY_COLOR: CONFIG.ENEMY.COLOR,
                    ENEMY_ALPHA: CONFIG.ENEMY.ALPHA,
                    ENEMY_THICKNESS: CONFIG.ENEMY.THICKNESS,
                    NEAREST_LINE_COLOR: CONFIG.NEAREST_LINE.COLOR,
                    NEAREST_LINE_ALPHA: CONFIG.NEAREST_LINE.ALPHA,
                    NEAREST_LINE_THICKNESS: CONFIG.NEAREST_LINE.THICKNESS,
                    HITBOX_OUTLINE_THICKNESS: CONFIG.SELF_HITBOX.OUTLINE_THICKNESS,
                };
                localStorage.setItem('bonkTrajectorySettings', JSON.stringify(settings));
            } catch (e) {
                console.error('Error saving settings:', e);
            }
        }

        // Load settings on startup
        loadSettings();

        let myUserName = null;
        let myPlayerContainer = null;
        let gameWorld = null;
        let myPlayerID = -1;
        let arcGraphics = null;
        let isHoldingKey = false;
        let currentPPM = BASE_RADIUS_PPM;
        let pixiObjectId = 0;

        // RGB transition for self hitbox
        let hueValue = 0;
        const HUE_SPEED = 5;

        // Separate faster RGB for client name
        let nameHueValue = 0;
        const NAME_HUE_SPEED = 10;

        // Debug stats
        let debugStats = {
            playersFound: 0,
            nearestPlayerDistance: null,
            nearestPlayerName: null,
            playerList: [],
            lastUpdate: Date.now()
        };

        // Create Debug UI
        function createDebugUI() {
            const panel = document.createElement('div');
            panel.id = 'trajectory-debug-panel';
            panel.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: #f0f0f0;
                color: #000000;
                padding: 0;
                border: 2px solid #808080;
                font-family: 'Arial', 'Helvetica', sans-serif;
                font-size: 12px;
                z-index: 10000;
                min-width: 280px;
                width: 320px;
                max-height: 90vh;
                box-shadow: 2px 2px 0px #404040;
                resize: none;
                display: flex;
                flex-direction: column;
            `;

            panel.innerHTML = `
                <div id="panel-header" style="
                    background: linear-gradient(to bottom, #ffffff 0%, #d4d0c8 100%);
                    border-bottom: 2px solid #808080;
                    padding: 4px 6px;
                    cursor: move;
                    user-select: none;
                    font-weight: bold;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <span>Bonker Client</span>
                    <button id="toggle-debug" style="
                        background: #d4d0c8;
                        border: 1px outset #ffffff;
                        padding: 2px 8px;
                        cursor: pointer;
                        font-size: 11px;
                        font-weight: normal;
                    ">Hide</button>
                </div>
                <div id="collapsed-client-name" style="
                    display: none;
                    padding: 4px 8px;
                    text-align: center;
                    font-size: 11px;
                    background: #f0f0f0;
                    border-bottom: 2px solid #808080;
                ">
                    <span style="font-weight: bold;">Client:</span> <span id="collapsed-name" style="font-weight: bold;">Loading...</span>
                </div>
                <div id="debug-stats" style="padding: 8px; background: #f0f0f0; overflow-y: auto; flex-shrink: 0; max-height: 30%;"></div>
                <div id="settings-container" style="padding: 8px; background: #f0f0f0; border-top: 1px solid #808080; overflow-y: auto; flex: 1; min-height: 0;">
                    <fieldset style="border: 2px groove #d4d0c8; padding: 8px; margin-bottom: 8px;">
                        <legend style="font-weight: bold; padding: 0 4px;">Trajectory Settings</legend>
                        <div style="margin-bottom: 6px;">
                            <label style="display: flex; align-items: center; cursor: pointer;">
                                <input type="checkbox" id="show-trajectory-toggle" ${CONFIG.SHOW_TRAJECTORY ? 'checked' : ''} style="margin-right: 6px;">
                                <span>Show trajectory</span>
                            </label>
                        </div>
                        <div style="margin-bottom: 6px;">
                            <label style="display: flex; align-items: center; cursor: pointer;">
                                <input type="checkbox" id="draw-enemies-toggle" ${CONFIG.DRAW_ENEMIES ? 'checked' : ''} style="margin-right: 6px;">
                                <span>Draw enemy trajectories</span>
                            </label>
                        </div>
                    </fieldset>

                    <fieldset style="border: 2px groove #d4d0c8; padding: 8px; margin-bottom: 8px;">
                        <legend style="font-weight: bold; padding: 0 4px;">Player Lines</legend>
                        <div style="margin-bottom: 6px;">
                            <label style="display: flex; align-items: center; cursor: pointer;">
                                <input type="radio" name="line-mode" id="nearest-line-toggle" ${CONFIG.DRAW_NEAREST_LINE ? 'checked' : ''} style="margin-right: 6px;">
                                <span>Line to nearest player</span>
                            </label>
                        </div>
                        <div style="margin-bottom: 6px;">
                            <label style="display: flex; align-items: center; cursor: pointer;">
                                <input type="radio" name="line-mode" id="all-lines-toggle" ${CONFIG.DRAW_ALL_PLAYER_LINES ? 'checked' : ''} style="margin-right: 6px;">
                                <span>Lines to all players</span>
                            </label>
                        </div>
                        <div style="margin-bottom: 6px;">
                            <label style="display: flex; align-items: center; cursor: pointer;">
                                <input type="radio" name="line-mode" id="no-lines-toggle" ${!CONFIG.DRAW_NEAREST_LINE && !CONFIG.DRAW_ALL_PLAYER_LINES ? 'checked' : ''} style="margin-right: 6px;">
                                <span>Off</span>
                            </label>
                        </div>
                        <div style="margin-top: 10px; margin-bottom: 6px;">
                            <label style="display: flex; align-items: center; cursor: pointer;">
                                <input type="checkbox" id="self-hitbox-toggle" ${CONFIG.DRAW_SELF_HITBOX ? 'checked' : ''} style="margin-right: 6px;">
                                <span style="font-weight: bold;">Highlight my hitbox (RGB)</span>
                            </label>
                        </div>
                    </fieldset>

                    <details style="border: 2px groove #d4d0c8; padding: 0; margin-bottom: 8px;">
                        <summary style="cursor: pointer; font-weight: bold; padding: 8px; background: #e8e8e8; list-style-position: inside;">Appearance</summary>
                        <div style="padding: 8px;">
                            <div style="margin-bottom: 8px;">
                                <label style="display: block; margin-bottom: 4px; font-weight: bold;">Arrow Trajectory (Self):</label>
                                <input type="color" id="color-picker-self" value="#d3d3d3" style="width: 100%; height: 30px; border: 1px inset #808080; cursor: pointer;">
                            </div>

                            <div style="margin-bottom: 8px;">
                                <label style="display: block; margin-bottom: 4px; font-weight: bold;">Enemy Trajectories:</label>
                                <input type="color" id="color-picker-enemy" value="#d3d3d3" style="width: 100%; height: 30px; border: 1px inset #808080; cursor: pointer;">
                            </div>

                            <div style="margin-bottom: 8px;">
                                <label style="display: block; margin-bottom: 4px; font-weight: bold;">Nearest Player Line:</label>
                                <input type="color" id="color-picker-nearest" value="#ff0000" style="width: 100%; height: 30px; border: 1px inset #808080; cursor: pointer;">
                            </div>
                        </div>
                    </details>

                    <details style="border: 2px groove #d4d0c8; padding: 0; margin-bottom: 8px;">
                        <summary style="cursor: pointer; font-weight: bold; padding: 8px; background: #e8e8e8; list-style-position: inside;">Settings</summary>
                        <div style="padding: 8px;">
                            <div style="margin-bottom: 12px;">
                                <label style="display: block; margin-bottom: 4px; font-weight: bold;">Hide UI Hotkey:</label>
                                <input type="text" id="hide-ui-key-input" value="${CONFIG.HIDE_UI_KEY}" readonly style="
                                    width: 100%;
                                    padding: 4px;
                                    background: #ffffff;
                                    border: 1px inset #808080;
                                    cursor: pointer;
                                    text-align: center;
                                " placeholder="Press a key...">
                                <div style="font-size: 10px; color: #666; margin-top: 2px;">Click and press any key to set hotkey</div>
                            </div>

                            <div style="margin-bottom: 10px; padding-top: 10px; border-top: 1px solid #ccc;">
                                <label style="display: block; margin-bottom: 3px; font-weight: bold;">Player Trajectory Opacity: <span id="player-trajectory-opacity-value">${Math.round(CONFIG.LOCAL.ALPHA * 100)}%</span></label>
                                <input type="range" id="player-trajectory-opacity-slider" min="10" max="100" step="5" value="${CONFIG.LOCAL.ALPHA * 100}" style="width: 100%;">
                            </div>

                            <div style="margin-bottom: 10px;">
                                <label style="display: block; margin-bottom: 3px; font-weight: bold;">Enemy Trajectory Opacity: <span id="enemy-trajectory-opacity-value">${Math.round(CONFIG.ENEMY.ALPHA * 100)}%</span></label>
                                <input type="range" id="enemy-trajectory-opacity-slider" min="10" max="100" step="5" value="${CONFIG.ENEMY.ALPHA * 100}" style="width: 100%;">
                            </div>

                            <div style="margin-bottom: 10px;">
                                <label style="display: block; margin-bottom: 3px; font-weight: bold;">Player Lines Opacity: <span id="player-lines-opacity-value">${Math.round(CONFIG.NEAREST_LINE.ALPHA * 100)}%</span></label>
                                <input type="range" id="player-lines-opacity-slider" min="10" max="100" step="5" value="${CONFIG.NEAREST_LINE.ALPHA * 100}" style="width: 100%;">
                            </div>

                            <div style="margin-bottom: 10px; padding-top: 10px; border-top: 1px solid #ccc;">
                                <label style="display: block; margin-bottom: 3px; font-weight: bold;">Trajectory Thickness: <span id="trajectory-thickness-value">${CONFIG.LOCAL.THICKNESS}</span>px</label>
                                <input type="range" id="trajectory-thickness-slider" min="1" max="10" step="1" value="${CONFIG.LOCAL.THICKNESS}" style="width: 100%;">
                            </div>

                            <div style="margin-bottom: 10px;">
                                <label style="display: block; margin-bottom: 3px; font-weight: bold;">Player Lines Thickness: <span id="player-lines-thickness-value">${CONFIG.NEAREST_LINE.THICKNESS}</span>px</label>
                                <input type="range" id="player-lines-thickness-slider" min="1" max="10" step="1" value="${CONFIG.NEAREST_LINE.THICKNESS}" style="width: 100%;">
                            </div>

                            <div style="margin-bottom: 10px;">
                                <label style="display: block; margin-bottom: 3px; font-weight: bold;">Self Hitbox Outline: <span id="hitbox-thickness-value">${CONFIG.SELF_HITBOX.OUTLINE_THICKNESS}</span>px</label>
                                <input type="range" id="hitbox-thickness-slider" min="1" max="10" step="1" value="${CONFIG.SELF_HITBOX.OUTLINE_THICKNESS}" style="width: 100%;">
                            </div>
                        </div>
                    </details>
                </div>
                <div style="
                    background: #d4d0c8;
                    border-top: 2px solid #808080;
                    padding: 4px 8px;
                    font-size: 10px;
                    text-align: center;
                    flex-shrink: 0;
                ">
                    <span style="font-weight: bold;">Client:</span> <span id="client-name" style="font-style: italic;">Loading...</span>
                </div>
                <div id="resize-handle" style="
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    width: 16px;
                    height: 16px;
                    cursor: nwse-resize;
                    z-index: 10;
                    background: linear-gradient(135deg, transparent 0%, transparent 40%, #808080 40%, #808080 45%, transparent 45%, transparent 55%, #808080 55%, #808080 60%, transparent 60%);
                "></div>
            `;

            document.body.appendChild(panel);

            // Make panel draggable
            const header = document.getElementById('panel-header');
            let isDragging = false;
            let currentX;
            let currentY;
            let initialX;
            let initialY;
            let xOffset = 0;
            let yOffset = 0;

            header.addEventListener('mousedown', dragStart);
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', dragEnd);

            function dragStart(e) {
                if (e.target === document.getElementById('toggle-debug')) {
                    return;
                }

                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;

                if (e.target === header || header.contains(e.target)) {
                    isDragging = true;
                }
            }

            function drag(e) {
                if (isDragging) {
                    e.preventDefault();

                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;

                    xOffset = currentX;
                    yOffset = currentY;

                    setTranslate(currentX, currentY, panel);
                }
            }

            function dragEnd(e) {
                initialX = currentX;
                initialY = currentY;
                isDragging = false;
            }

            function setTranslate(xPos, yPos, el) {
                el.style.transform = `translate(${xPos}px, ${yPos}px)`;
            }

            // Make panel resizable by dragging bottom-right corner
            const resizeHandle = document.getElementById('resize-handle');

            resizeHandle.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                e.preventDefault();
                isResizing = true;
                resizeStartX = e.clientX;
                resizeStartY = e.clientY;

                const rect = panel.getBoundingClientRect();
                resizeStartWidth = rect.width;
                resizeStartHeight = rect.height;

                const currentTransform = panel.style.transform;
                if (currentTransform && currentTransform !== 'none') {
                    const matrix = new DOMMatrix(currentTransform);
                    panel.style.left = (rect.left) + 'px';
                    panel.style.top = (rect.top) + 'px';
                    panel.style.transform = '';
                    xOffset = 0;
                    yOffset = 0;
                }
            });

            document.addEventListener('mousemove', (e) => {
                if (isResizing) {
                    e.preventDefault();
                    const deltaX = e.clientX - resizeStartX;
                    const deltaY = e.clientY - resizeStartY;

                    const newWidth = resizeStartWidth + deltaX;
                    const newHeight = resizeStartHeight + deltaY;

                    const finalWidth = Math.max(280, Math.min(800, newWidth));
                    const finalHeight = Math.max(150, Math.min(window.innerHeight - 50, newHeight));

                    panel.style.width = finalWidth + 'px';
                    panel.style.height = finalHeight + 'px';
                }
            });

            document.addEventListener('mouseup', () => {
                if (isResizing) {
                    isResizing = false;
                }
            });

            // Fullscreen detection and UI centering
            const checkFullscreen = () => {
                const wasFullscreen = isFullscreen;
                isFullscreen = document.body.classList.contains('fullscreen');

                if (isFullscreen && !wasFullscreen) {
                    panel.style.left = '50%';
                    panel.style.top = '50%';
                    panel.style.right = 'auto';
                    panel.style.transform = 'translate(-50%, -50%)';
                    xOffset = 0;
                    yOffset = 0;
                } else if (!isFullscreen && wasFullscreen) {
                    panel.style.left = 'auto';
                    panel.style.top = '10px';
                    panel.style.right = '10px';
                    panel.style.transform = '';
                    xOffset = 0;
                    yOffset = 0;
                }
            };

            setInterval(checkFullscreen, 500);

            // Event listeners
            document.getElementById('toggle-debug').addEventListener('click', () => {
                const statsDiv = document.getElementById('debug-stats');
                const settingsDiv = document.getElementById('settings-container');
                const footerDiv = panel.lastElementChild.previousElementSibling;
                const collapsedName = document.getElementById('collapsed-client-name');
                const toggleBtn = document.getElementById('toggle-debug');

                if (statsDiv.style.display === 'none') {
                    statsDiv.style.display = 'block';
                    settingsDiv.style.display = 'block';
                    footerDiv.style.display = 'block';
                    collapsedName.style.display = 'none';
                    toggleBtn.textContent = 'Hide';
                } else {
                    statsDiv.style.display = 'none';
                    settingsDiv.style.display = 'none';
                    footerDiv.style.display = 'none';
                    collapsedName.style.display = 'block';
                    toggleBtn.textContent = 'Show';
                }
            });

            // Hotkey to completely hide UI
            document.addEventListener('keydown', (e) => {
                if (e.code === CONFIG.HIDE_UI_KEY) {
                    uiCompletelyHidden = !uiCompletelyHidden;
                    panel.style.display = uiCompletelyHidden ? 'none' : 'block';
                }
            });

            // Advanced settings - keybind configuration
            const hideKeyInput = document.getElementById('hide-ui-key-input');
            hideKeyInput.addEventListener('click', () => {
                hideKeyInput.value = 'Press any key...';
                hideKeyInput.style.background = '#ffffcc';

                const keyHandler = (e) => {
                    e.preventDefault();
                    CONFIG.HIDE_UI_KEY = e.code;
                    hideKeyInput.value = e.code;
                    hideKeyInput.style.background = '#ffffff';
                    saveSettings();
                    document.removeEventListener('keydown', keyHandler);
                };

                document.addEventListener('keydown', keyHandler);
            });

            document.getElementById('show-trajectory-toggle').addEventListener('change', (e) => {
                CONFIG.SHOW_TRAJECTORY = e.target.checked;
                saveSettings();
            });

            document.getElementById('draw-enemies-toggle').addEventListener('change', (e) => {
                CONFIG.DRAW_ENEMIES = e.target.checked;
                saveSettings();
            });

            // Radio button handlers for line modes
            document.getElementById('nearest-line-toggle').addEventListener('change', (e) => {
                if (e.target.checked) {
                    CONFIG.DRAW_NEAREST_LINE = true;
                    CONFIG.DRAW_ALL_PLAYER_LINES = false;
                    saveSettings();
                }
            });

            document.getElementById('all-lines-toggle').addEventListener('change', (e) => {
                if (e.target.checked) {
                    CONFIG.DRAW_ALL_PLAYER_LINES = true;
                    CONFIG.DRAW_NEAREST_LINE = false;
                    saveSettings();
                }
            });

            document.getElementById('no-lines-toggle').addEventListener('change', (e) => {
                if (e.target.checked) {
                    CONFIG.DRAW_NEAREST_LINE = false;
                    CONFIG.DRAW_ALL_PLAYER_LINES = false;
                    saveSettings();
                }
            });

            document.getElementById('self-hitbox-toggle').addEventListener('change', (e) => {
                CONFIG.DRAW_SELF_HITBOX = e.target.checked;
                saveSettings();
            });

            // Opacity sliders
            document.getElementById('player-trajectory-opacity-slider').addEventListener('input', (e) => {
                CONFIG.LOCAL.ALPHA = parseFloat(e.target.value) / 100;
                document.getElementById('player-trajectory-opacity-value').textContent = e.target.value + '%';
                saveSettings();
            });

            document.getElementById('enemy-trajectory-opacity-slider').addEventListener('input', (e) => {
                CONFIG.ENEMY.ALPHA = parseFloat(e.target.value) / 100;
                document.getElementById('enemy-trajectory-opacity-value').textContent = e.target.value + '%';
                saveSettings();
            });

            document.getElementById('player-lines-opacity-slider').addEventListener('input', (e) => {
                const opacity = parseFloat(e.target.value) / 100;
                CONFIG.NEAREST_LINE.ALPHA = opacity;
                CONFIG.ALL_PLAYERS_LINE.ALPHA = opacity;
                document.getElementById('player-lines-opacity-value').textContent = e.target.value + '%';
                saveSettings();
            });

            // Thickness sliders
            document.getElementById('trajectory-thickness-slider').addEventListener('input', (e) => {
                const thickness = parseInt(e.target.value);
                CONFIG.LOCAL.THICKNESS = thickness;
                CONFIG.ENEMY.THICKNESS = thickness;
                document.getElementById('trajectory-thickness-value').textContent = thickness;
                saveSettings();
            });

            document.getElementById('player-lines-thickness-slider').addEventListener('input', (e) => {
                const thickness = parseInt(e.target.value);
                CONFIG.NEAREST_LINE.THICKNESS = thickness;
                CONFIG.ALL_PLAYERS_LINE.THICKNESS = Math.max(1, thickness - 2);
                document.getElementById('player-lines-thickness-value').textContent = thickness;
                saveSettings();
            });

            document.getElementById('hitbox-thickness-slider').addEventListener('input', (e) => {
                const thickness = parseInt(e.target.value);
                CONFIG.SELF_HITBOX.OUTLINE_THICKNESS = thickness;
                document.getElementById('hitbox-thickness-value').textContent = thickness;
                saveSettings();
            });

            // Helper function to convert hex color string to integer
            function hexToInt(hex) {
                return parseInt(hex.replace('#', ''), 16);
            }

            // Helper function to convert integer to hex color string
            function intToHex(int) {
                return '#' + int.toString(16).padStart(6, '0');
            }

            // Self trajectory color
            document.getElementById('color-picker-self').addEventListener('input', (e) => {
                const color = hexToInt(e.target.value);
                CONFIG.LOCAL.COLOR = color;
                saveSettings();
            });

            // Enemy trajectory color
            document.getElementById('color-picker-enemy').addEventListener('input', (e) => {
                const color = hexToInt(e.target.value);
                CONFIG.ENEMY.COLOR = color;
                saveSettings();
            });

            // Nearest player line color
            document.getElementById('color-picker-nearest').addEventListener('input', (e) => {
                const color = hexToInt(e.target.value);
                CONFIG.NEAREST_LINE.COLOR = color;
                saveSettings();
            });

            // Initialize color pickers with saved values
            document.getElementById('color-picker-self').value = intToHex(CONFIG.LOCAL.COLOR);
            document.getElementById('color-picker-enemy').value = intToHex(CONFIG.ENEMY.COLOR);
            document.getElementById('color-picker-nearest').value = intToHex(CONFIG.NEAREST_LINE.COLOR);

            // Initialize sliders with saved values
            document.getElementById('trajectory-thickness-value').textContent = CONFIG.LOCAL.THICKNESS;
            document.getElementById('player-lines-thickness-value').textContent = CONFIG.NEAREST_LINE.THICKNESS;
            document.getElementById('hitbox-thickness-value').textContent = CONFIG.SELF_HITBOX.OUTLINE_THICKNESS;
        }

        // Update debug stats display
        function updateDebugUI() {
            const statsDiv = document.getElementById('debug-stats');
            if (!statsDiv) return;

            const nearestInfo = debugStats.nearestPlayerDistance !== null
                ? `<div style="margin-bottom: 4px;"><b>Nearest Player:</b> ${debugStats.nearestPlayerName || 'Unknown'} (${Math.round(debugStats.nearestPlayerDistance)}px)</div>`
                : '';

            let playerListHTML = '';
            if (debugStats.playerList.length > 0) {
                playerListHTML = '<div style="margin-top: 8px; margin-bottom: 4px;"><b>Players:</b></div>';
                debugStats.playerList.forEach(player => {
                    const isNearest = player.name === debugStats.nearestPlayerName;
                    const nameColor = isNearest ? 'color: #00ff00; font-weight: bold;' : '';
                    playerListHTML += `<div style="margin-left: 8px; font-size: 13px; margin-bottom: 3px; ${nameColor}">${player.name}</div>`;
                });
            }

            statsDiv.innerHTML = `
                <div style="margin-bottom: 4px;"><b>Players Found:</b> ${debugStats.playersFound}</div>
                ${nearestInfo}
                ${playerListHTML}
            `;

            // Update client name with RGB animation (footer)
            const clientNameSpan = document.getElementById('client-name');
            if (clientNameSpan && myUserName) {
                nameHueValue = (nameHueValue + NAME_HUE_SPEED) % 360;
                const rgbColor = hsvToRgb(nameHueValue, 1.0, 0.8);
                const hexColor = '#' + rgbColor.toString(16).padStart(6, '0');
                clientNameSpan.textContent = myUserName;
                clientNameSpan.style.color = hexColor;
                clientNameSpan.style.fontWeight = 'bold';
            }

            // Update collapsed client name with RGB animation
            const collapsedNameSpan = document.getElementById('collapsed-name');
            if (collapsedNameSpan && myUserName) {
                const rgbColor = hsvToRgb(nameHueValue, 1.0, 0.8);
                const hexColor = '#' + rgbColor.toString(16).padStart(6, '0');
                collapsedNameSpan.textContent = myUserName;
                collapsedNameSpan.style.color = hexColor;
            }
        }

        // Initialize UI after a short delay
        setTimeout(createDebugUI, 1000);
        setInterval(updateDebugUI, 100);

        //Websocket hook
        const originalSend = scope.WebSocket.prototype.send;
        scope.WebSocket.prototype.send = function (args) {
            if (typeof args === "string" && args.startsWith('42[12,')) {
                try {
                    const json = JSON.parse(args.substring(2));
                    myUserName = json[1].userName;
                } catch (e) { }
            }
            return originalSend.apply(this, arguments);
        };

        //PIXI hook
        const originalDrawCircle = scope.PIXI.Graphics.prototype.drawCircle;
        scope.PIXI.Graphics.prototype.drawCircle = function (...args) {
            const radius = args[2];
            const parent = this.parent;

            setTimeout(() => {
                if (parent && parent.visible) {
                    if (parent._bonkId === undefined) parent._bonkId = pixiObjectId++;

                    let foundName = null;
                    if (parent.children) {
                        for (let i = 0; i < parent.children.length; i++) {
                            const c = parent.children[i];
                            if (c && c._text) { foundName = c._text; break; }
                        }
                    }

                    if (foundName) {
                        if (!myUserName) {
                            try {
                                const topBar = window.parent.document.getElementById("maingameframe").contentWindow.document.getElementById("pretty_top_name");
                                if (topBar) {
                                    myUserName = topBar.textContent.trim();
                                }
                            } catch (e) {
                                console.error(`Username Error: ${e}`);
                            }
                        }

                        if (myUserName && foundName.trim() === myUserName.trim()) {
                            myPlayerContainer = parent;
                            myPlayerID = parent._bonkId;

                            if (parent.parent) {
                                gameWorld = parent.parent;
                            }

                            if (radius > 5 && radius < 60) currentPPM = radius;
                        }
                    }
                }
            }, 0);

            return originalDrawCircle.apply(this, args);
        };

        function getGlobalTransform(obj) {
            if (!obj || !obj.transform) return { x: 0, y: 0, rot: 0 };
            obj.updateTransform();
            const wt = obj.transform.worldTransform;
            const globalPos = obj.getGlobalPosition();
            return {
                x: globalPos.x,
                y: globalPos.y,
                rot: Math.atan2(wt.b, wt.a)
            };
        }

        // Convert HSV to RGB for smooth color transitions
        function hsvToRgb(h, s, v) {
            h = h / 60;
            const c = v * s;
            const x = c * (1 - Math.abs((h % 2) - 1));
            const m = v - c;

            let r, g, b;
            if (h >= 0 && h < 1) {
                r = c; g = x; b = 0;
            } else if (h >= 1 && h < 2) {
                r = x; g = c; b = 0;
            } else if (h >= 2 && h < 3) {
                r = 0; g = c; b = x;
            } else if (h >= 3 && h < 4) {
                r = 0; g = x; b = c;
            } else if (h >= 4 && h < 5) {
                r = x; g = 0; b = c;
            } else {
                r = c; g = 0; b = x;
            }

            r = Math.round((r + m) * 255);
            g = Math.round((g + m) * 255);
            b = Math.round((b + m) * 255);

            return (r << 16) | (g << 8) | b;
        }

        document.addEventListener("keydown", (e) => {
            if (e.code === CONFIG.KEY) isHoldingKey = true;
        });
        document.addEventListener("keyup", (e) => {
            if (e.code === CONFIG.KEY) isHoldingKey = false;
        });

        const originalRAF = scope.requestAnimationFrame;

        scope.requestAnimationFrame = function (callback) {
            if (!arcGraphics && scope.PIXI) {
                arcGraphics = new scope.PIXI.Graphics();
            }

            debugStats.playersFound = 0;
            debugStats.nearestPlayerDistance = null;
            debugStats.nearestPlayerName = null;
            debugStats.playerList = [];

            let myPosition = null;
            let nearestPlayer = null;
            let nearestDistance = Infinity;
            let allPlayers = [];

            if (gameWorld && gameWorld.transform && arcGraphics) {

                if (arcGraphics.parent !== gameWorld) {
                    gameWorld.addChild(arcGraphics);
                }

                arcGraphics.clear();

                const children = gameWorld.children;

                // First pass: find my position and identify all players
                for (let i = 0; i < children.length; i++) {
                    const playerObj = children[i];

                    if (!playerObj || !playerObj.visible || !playerObj.children) continue;

                    let isMe = false;
                    let isPlayer = false;
                    let playerName = null;

                    for (let j = 0; j < playerObj.children.length; j++) {
                        const child = playerObj.children[j];
                        if (child && child._text) {
                            isPlayer = true;
                            playerName = child._text.trim();
                            if (myUserName && playerName === myUserName.trim()) {
                                isMe = true;
                            }
                            break;
                        }
                    }

                    if (!isPlayer) continue;

                    if (isMe) {
                        const myTransform = getGlobalTransform(playerObj);
                        myPosition = { x: myTransform.x, y: myTransform.y, obj: playerObj };
                    }
                }

                // Second pass: draw trajectories and find nearest player
                for (let i = 0; i < children.length; i++) {
                    const playerObj = children[i];

                    if (!playerObj || !playerObj.visible || !playerObj.children) continue;

                    let isMe = false;
                    let isPlayer = false;
                    let playerName = null;

                    for (let j = 0; j < playerObj.children.length; j++) {
                        const child = playerObj.children[j];
                        if (child && child._text) {
                            isPlayer = true;
                            playerName = child._text.trim();
                            if (myUserName && playerName === myUserName.trim()) {
                                isMe = true;
                            }
                            break;
                        }
                    }

                    if (!isPlayer) continue;

                    debugStats.playersFound++;

                    // Add to player list (skip self)
                    if (!isMe) {
                        debugStats.playerList.push({
                            name: playerName
                        });
                    }

                    // Calculate distance to this player if not me
                    if (!isMe && myPosition) {
                        const playerTransform = getGlobalTransform(playerObj);
                        const dx = playerTransform.x - myPosition.x;
                        const dy = playerTransform.y - myPosition.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        const playerData = {
                            obj: playerObj,
                            name: playerName,
                            x: playerTransform.x,
                            y: playerTransform.y,
                            distance: distance
                        };

                        allPlayers.push(playerData);

                        if (distance < nearestDistance) {
                            nearestDistance = distance;
                            nearestPlayer = playerData;
                        }
                    }

                    if (!isMe && !CONFIG.DRAW_ENEMIES) continue;

                    let aimerChild = null;
                    for (let j = 0; j < playerObj.children.length; j++) {
                        const c = playerObj.children[j];
                        if (c.constructor.name === 'e' || c.constructor.name === 'h') {
                            aimerChild = c;
                            break;
                        }
                    }

                    const arrowVisible = aimerChild && aimerChild.visible && aimerChild.alpha > 0.1;

                    let shouldDraw = false;

                    if (isMe) {
                        // Only draw my trajectory if SHOW_TRAJECTORY is enabled AND arrow is visible
                        shouldDraw = CONFIG.SHOW_TRAJECTORY && arrowVisible;
                    } else {
                        shouldDraw = arrowVisible;
                    }

                    if (shouldDraw) {
                        const settings = isMe ? CONFIG.LOCAL : CONFIG.ENEMY;
                        arcGraphics.lineStyle(settings.THICKNESS, settings.COLOR, settings.ALPHA);

                        if (!playerObj._bonkChargeStart) {
                            playerObj._bonkChargeStart = Date.now();
                        }

                        const scale = currentPPM / BASE_RADIUS_PPM;
                        const G_term = PHYSICS.GRAVITY * scale;
                        const h = Math.min(((Date.now() - playerObj._bonkChargeStart) / 1000.0), CONFIG.MAX_CHARGE);
                        const V_total = (PHYSICS.VEL_MULT * h + PHYSICS.VEL_BASE) * scale;

                        const tf = getGlobalTransform(aimerChild);
                        const n = -tf.rot;
                        const cos_n = Math.cos(n);
                        const sin_n = Math.sin(n);

                        const startLocal = gameWorld.toLocal({ x: tf.x, y: tf.y });
                        arcGraphics.moveTo(startLocal.x, startLocal.y);

                        const dt = CONFIG.SIM_TIME / CONFIG.POINTS;

                        for (let k = 1; k <= CONFIG.POINTS; k++) {
                            const t = k * dt;
                            const dx = V_total * cos_n * t;
                            const dy = (V_total * sin_n * t) - (G_term * Math.pow(t, 2));

                            const pLoc = gameWorld.toLocal({
                                x: tf.x + dx,
                                y: tf.y - dy
                            });

                            arcGraphics.lineTo(pLoc.x, pLoc.y);
                        }
                    } else {
                        playerObj._bonkChargeStart = 0;
                    }
                }

                // Draw line to nearest player
                if (CONFIG.DRAW_NEAREST_LINE && myPosition && nearestPlayer) {
                    debugStats.nearestPlayerDistance = nearestPlayer.distance;
                    debugStats.nearestPlayerName = nearestPlayer.name;

                    arcGraphics.lineStyle(
                        CONFIG.NEAREST_LINE.THICKNESS,
                        CONFIG.NEAREST_LINE.COLOR,
                        CONFIG.NEAREST_LINE.ALPHA
                    );

                    const startLocal = gameWorld.toLocal({ x: myPosition.x, y: myPosition.y });
                    const endLocal = gameWorld.toLocal({ x: nearestPlayer.x, y: nearestPlayer.y });

                    arcGraphics.moveTo(startLocal.x, startLocal.y);
                    arcGraphics.lineTo(endLocal.x, endLocal.y);
                }

                // Draw lines to all players (red for normal, green for nearest)
                if (CONFIG.DRAW_ALL_PLAYER_LINES && myPosition && allPlayers.length > 0) {
                    const startLocal = gameWorld.toLocal({ x: myPosition.x, y: myPosition.y });

                    allPlayers.forEach(player => {
                        const isNearest = nearestPlayer && player.obj === nearestPlayer.obj;
                        const lineColor = isNearest ? CONFIG.ALL_PLAYERS_LINE.NEAREST_COLOR : CONFIG.ALL_PLAYERS_LINE.COLOR;
                        const lineThickness = isNearest ? CONFIG.ALL_PLAYERS_LINE.THICKNESS + 1 : CONFIG.ALL_PLAYERS_LINE.THICKNESS;

                        arcGraphics.lineStyle(
                            lineThickness,
                            lineColor,
                            CONFIG.ALL_PLAYERS_LINE.ALPHA
                        );

                        const endLocal = gameWorld.toLocal({ x: player.x, y: player.y });
                        arcGraphics.moveTo(startLocal.x, startLocal.y);
                        arcGraphics.lineTo(endLocal.x, endLocal.y);
                    });
                }
            }

            // Draw self hitbox ESP LAST so it appears on top (highlight where I am)
            if (CONFIG.DRAW_SELF_HITBOX && gameWorld && gameWorld.transform && arcGraphics && myPlayerContainer) {
                const myTransform = getGlobalTransform(myPlayerContainer);
                const myLocal = gameWorld.toLocal({ x: myTransform.x, y: myTransform.y });
                const radius = currentPPM;

                // Update hue for smooth RGB transition
                hueValue = (hueValue + HUE_SPEED) % 360;
                const rgbColor = hsvToRgb(hueValue, 1.0, 1.0);

                // Draw filled circle with RGB transition
                arcGraphics.beginFill(rgbColor, CONFIG.SELF_HITBOX.FILL_ALPHA);
                arcGraphics.lineStyle(
                    CONFIG.SELF_HITBOX.OUTLINE_THICKNESS,
                    rgbColor,
                    CONFIG.SELF_HITBOX.OUTLINE_ALPHA
                );
                arcGraphics.drawCircle(myLocal.x, myLocal.y, radius);
                arcGraphics.endFill();
            }

            debugStats.lastUpdate = Date.now();
            return originalRAF.call(scope, callback);
        };
    });
})();