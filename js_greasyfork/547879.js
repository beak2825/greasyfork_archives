// ==UserScript==
// @name         Drawaria Physics Engine Basketball🏀
// @namespace    http://tampermonkey.net/
// @version      6.1.0
// @description  Advanced physics-based basketball engine with professional NBA court and possession system!
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        none
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/547879/Drawaria%20Physics%20Engine%20Basketball%F0%9F%8F%80.user.js
// @updateURL https://update.greasyfork.org/scripts/547879/Drawaria%20Physics%20Engine%20Basketball%F0%9F%8F%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* ---------- SHARED SYSTEM COMPONENTS ---------- */
    let drawariaSocket = null;
    let drawariaCanvas = null;
    let drawariaCtx = null;

    // Optimized command queue
    const commandQueue = [];
    let batchProcessor = null;
    const BATCH_SIZE = 12;
    const BATCH_INTERVAL = 45;

    const positionCache = new Map();
    const MOVEMENT_THRESHOLD = 3;

    // Basketball-specific constants
    const PHYSICS_CONSTANTS = {
        GRAVITY: 400,
        BALL_MASS: 0.2,
        BALL_RADIUS: 25,
        TIMESTEP: 1/60,
        MAX_VELOCITY: 600,
        AIR_RESISTANCE: 0.005,
        RESTITUTION_BALL: 0.85,
        RESTITUTION_WALL: 0.7,
        FRICTION_COURT: 0.75,
        PLAYER_INTERACTION_FORCE: 250,
        PLAYER_PUSH_MULTIPLIER: 1.8,
        PLAYER_RESTITUTION: 0.9,
        PLAYER_DETECTION_INTERVAL: 1000 / 60,
        PLAYER_DETECTION_RADIUS_MULTIPLIER: 2.0,
        DRIBBLE_FORCE: 150,
        POSSESSION_DISTANCE: 80,
        BALL_COLOR: '#FF8C00',
        STEAL_COOLDOWN: 1000,
    };

    // Professional NBA Court Constants (from first script)
    const NBA_COURT_CONSTANTS = {
        COURT_COLOR: '#D2691E',      // Madera de cancha
        LINE_COLOR: '#FF4555',       // Líneas blancas oficiales
        RIM_COLOR: '#787878',        // Aros grises metálicos
        BACKBOARD_COLOR: '#787878',  // Tableros blancos
        KEY_COLOR: '#FF4500',        // Área restringida naranja
        TEXT_COLOR: '#000000',       // Texto negro
        POLE_COLOR: '#696969',       // Postes grises
        NET_COLOR: '#787878',        // Red blanca
        RIM_THICKNESS: 8,
        LINE_THICKNESS_MULTIPLIER: 0.008
    };

    const MATCH_CONSTANTS = {
        MAX_BASKETS: 5,
        PLAY_AREA_REDUCTION: {
            SIDES: 0.1,
            TOP: 0.4
        }
    };

    // WebSocket interception
    const originalWebSocketSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (...args) {
        if (!drawariaSocket && this.url && this.url.includes('drawaria')) {
            drawariaSocket = this;
            console.log('🔗 Drawaria WebSocket captured for basketball engine.');
            startBatchProcessor();
        }
        return originalWebSocketSend.apply(this, args);
    };

    function startBatchProcessor() {
        if (batchProcessor) return;
        batchProcessor = setInterval(() => {
            if (!drawariaSocket || drawariaSocket.readyState !== WebSocket.OPEN || commandQueue.length === 0) {
                return;
            }
            const batch = commandQueue.splice(0, BATCH_SIZE);
            batch.forEach(cmd => {
                try { drawariaSocket.send(cmd); } catch (e) { console.warn('Failed to send command:', e); }
            });
        }, BATCH_INTERVAL);
    }

    function enqueueDrawCommand(x1, y1, x2, y2, color, thickness) {
        if (!drawariaCanvas || !drawariaSocket) return;

        const normX1 = (x1 / drawariaCanvas.width).toFixed(4);
        const normY1 = (y1 / drawariaCanvas.height).toFixed(4);
        const normX2 = (x2 / drawariaCanvas.width).toFixed(4);
        const normY2 = (y2 / drawariaCanvas.height).toFixed(4);

        const cmd = `42["drawcmd",0,[${normX1},${normY1},${normX2},${normY2},false,${-Math.abs(thickness)},"${color}",0,0,{}]]`;
        commandQueue.push(cmd);

        if (drawariaCtx) {
            drawariaCtx.strokeStyle = color;
            drawariaCtx.lineWidth = thickness;
            drawariaCtx.lineCap = 'round';
            drawariaCtx.lineJoin = 'round';
            drawariaCtx.beginPath();
            drawariaCtx.moveTo(x1, y1);
            drawariaCtx.lineTo(x2, y2);
            drawariaCtx.stroke();
        }
    }

    // Helper functions
    function clamp(value, min, max) { return Math.min(Math.max(value, min), max); }
    function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

    /* ---------- ADVANCED BASKETBALL PHYSICS ENGINE ---------- */
    class AdvancedDrawariaBasketball {
        constructor() {
            this.initialized = false;
            this.isActive = false;
            this.physicsObjects = new Map();
            this.objectIdCounter = 0;
            this.lastRenderTime = 0;
            this.renderInterval = 1000 / 30;

            // Sistema de posesión de baloncesto
            this.possessionSystem = {
                ballOwner: null,
                lastStealTime: 0,
                dribbleInterval: null,
                possessionDistance: PHYSICS_CONSTANTS.POSSESSION_DISTANCE
            };

            // Match mode system
            this.matchMode = {
                active: false,
                scores: { p1: 0, p2: 0 },
                playArea: null,
                lastScorePositions: { p1: null, p2: null },
                goalCooldown: false
            };

            this.gameStats = {
                totalCollisions: 0,
                maxVelocityReached: 0,
                objectsCreated: 0,
                totalBaskets: 0
            };

            this.controls = {
                showTrails: false,
                showDebug: false,
                rainbowModeActive: false,
                defaultObjectColor: PHYSICS_CONSTANTS.BALL_COLOR,
                alternatePhysics: 'normal'
            };

            this.rainbowHue = 0;
            this.rainbowInterval = null;

            this.playerTracker = {
                players: new Map(),
                detectionRadius: PHYSICS_CONSTANTS.BALL_RADIUS * PHYSICS_CONSTANTS.PLAYER_DETECTION_RADIUS_MULTIPLIER,
                lastUpdateTime: 0
            };

            this.fieldDrawing = { isDrawing: false, isStopped: false };

            this.init();
        }

        init() {
            if (this.initialized) return;

            const checkGameReady = () => {
                const gameCanvas = document.getElementById('canvas');
                if (gameCanvas) {
                    this.canvasElement = gameCanvas;
                    drawariaCanvas = gameCanvas;
                    this.canvasContext = gameCanvas.getContext('2d');
                    drawariaCtx = gameCanvas.getContext('2d');

                    this.initialized = true;
                    this.createAdvancedPanel();
                    console.log('✅ Advanced Basketball Physics Engine v6.1 initialized with Professional NBA Court');
                } else {
                    setTimeout(checkGameReady, 100);
                }
            };
            checkGameReady();
        }

        createAdvancedPanel() {
            const existingPanel = document.getElementById('advanced-physics-panel');
            if (existingPanel) existingPanel.remove();

            const panel = document.createElement('div');
            panel.id = 'advanced-physics-panel';
            panel.style.cssText = `
                position: fixed !important;
                top: 20px !important;
                right: 20px !important;
                width: 380px !important;
                z-index: 2147483647 !important;
                background: linear-gradient(135deg, #0f0f23, #1a1a3a) !important;
                border: 2px solid #FF8C00 !important;
                border-radius: 15px !important;
                color: white !important;
                font-family: 'Segoe UI', Arial, sans-serif !important;
                overflow: hidden !important;
                box-shadow: 0 0 30px rgba(255,140,0,0.4) !important;
            `;

            // Header draggable
            const header = document.createElement('div');
            header.id = 'panel-header';
            header.style.cssText = `
                background: linear-gradient(45deg, #FF8C00, #FF6347) !important;
                padding: 12px 20px !important;
                font-weight: bold !important;
                text-align: center !important;
                font-size: 14px !important;
                cursor: move !important;
                user-select: none !important;
                display: flex !important;
                justify-content: space-between !important;
                align-items: center !important;
            `;

            const title = document.createElement('div');
            title.innerHTML = '🏀 NBA BASKETBALL ENGINE v6.1';
            title.style.flex = '1';

            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = `display: flex !important; gap: 8px !important;`;

            // Botón minimizar
            const minimizeBtn = document.createElement('button');
            minimizeBtn.id = 'minimize-btn';
            minimizeBtn.innerHTML = '−';
            minimizeBtn.style.cssText = `
                width: 25px !important; height: 25px !important;
                background: rgba(255,255,255,0.2) !important;
                border: none !important; border-radius: 4px !important;
                color: white !important; cursor: pointer !important;
                font-size: 16px !important; line-height: 1 !important; padding: 0 !important;
            `;

            // Botón cerrar
            const closeBtn = document.createElement('button');
            closeBtn.id = 'close-btn';
            closeBtn.innerHTML = '×';
            closeBtn.style.cssText = `
                width: 25px !important; height: 25px !important;
                background: rgba(255,0,0,0.6) !important;
                border: none !important; border-radius: 4px !important;
                color: white !important; cursor: pointer !important;
                font-size: 18px !important; line-height: 1 !important; padding: 0 !important;
            `;

            buttonContainer.appendChild(minimizeBtn);
            buttonContainer.appendChild(closeBtn);
            header.appendChild(title);
            header.appendChild(buttonContainer);

            // Contenido del panel
            const content = document.createElement('div');
            content.id = 'panel-content';
            content.style.cssText = `padding: 20px !important;`;
            content.innerHTML = `
                <!-- CREATE PROFESSIONAL NBA COURT BUTTON -->
                <div style="margin-bottom: 15px; text-align: center;">
                    <button id="create-court-btn" style="
                        width: 100%;
                        padding: 12px;
                        background: linear-gradient(135deg, ${NBA_COURT_CONSTANTS.COURT_COLOR}, #CD853F);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: bold;
                        margin-bottom: 10px;
                    ">🏀 Create Professional NBA Court</button>
                </div>

                <!-- LAUNCH PHYSICS BUTTON -->
                <div style="margin-bottom: 15px; text-align: center;">
                    <button id="toggle-physics" style="
                        width: 100%;
                        padding: 12px;
                        background: linear-gradient(135deg, #FF8C00, #FF6347);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: bold;
                    ">🚀 Launch Basketball Engine</button>
                </div>

                <!-- OBJECT CREATION BUTTONS -->
                <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                    <button id="add-basketball-btn" style="
                        flex: 1;
                        padding: 8px;
                        background: linear-gradient(135deg, #FF8C00, #FF6347);
                        color: white;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 12px;
                        font-weight: bold;
                    ">🏀 Basketball</button>
                </div>

                <!-- ACTION BUTTONS -->
                <div style="display: flex; gap: 8px; margin-bottom: 15px;">
                    <button id="reset-all-btn" style="
                        flex: 1;
                        padding: 8px;
                        background: linear-gradient(135deg, #74b9ff, #0984e3);
                        color: white;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-weight: bold;
                        font-size: 11px;
                    ">🔄 Reset</button>
                </div>

                <!-- ADVANCED MODES -->
                <div style="margin-bottom: 15px;">
                    <h4 style="margin: 0 0 10px 0; font-size: 13px; color: #FF8C00; text-align: center;">🌟 Basketball Modes</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                        <button id="match-mode-toggle" class="mode-toggle" style="
                            padding: 8px;
                            background: linear-gradient(135deg, #444, #666);
                            color: white;
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 10px;
                            font-weight: bold;
                        ">🏆 Match Mode</button>
                        <button id="clean-canvas-btn" style="
                            padding: 8px;
                            background: linear-gradient(135deg, #e17055, #d63031);
                            color: white;
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 10px;
                            font-weight: bold;
                        ">🧹 Clean Canvas</button>
                    </div>
                </div>

                <!-- PHYSICS SELECTION -->
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-size: 12px; color: #FF8C00;">
                        🔬 Physics Mode:
                    </label>
                    <select id="physics-mode" style="
                        width: 100%;
                        padding: 8px;
                        border: 1px solid #FF8C00;
                        border-radius: 6px;
                        background: #1a1a3a;
                        color: white;
                        font-size: 12px;
                    ">
                        <option value="normal">🏀 Normal</option>
                        <option value="moon">🌙 Moon Gravity</option>
                        <option value="underwater">🌊 Underwater</option>
                        <option value="magnetic">🧲 Magnetic Court</option>
                    </select>
                </div>

                <!-- CLEAR ALL -->
                <div style="margin-bottom: 15px;">
                    <button id="clear-all-btn" style="
                        width: 100%;
                        padding: 10px;
                        background: linear-gradient(135deg, #990000, #cc0000);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: bold;
                    ">🗑️ Clear All Basketballs</button>
                </div>

                <!-- MATCH MODE SCOREBOARD -->
                <div id="match-scoreboard" style="
                    display: none;
                    background: rgba(0,0,0,0.4);
                    padding: 15px;
                    border-radius: 8px;
                    text-align: center;
                    margin-bottom: 15px;
                    border: 2px solid #ffd700;
                ">
                    <h4 style="margin: 0 0 10px 0; color: #ffd700; font-size: 14px;">🏀 NBA SCORE</h4>
                    <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold;">
                        <span>P1: <span id="score-p1" style="color: #ff6b6b;">0</span></span>
                        <span style="color: #666;">vs</span>
                        <span>P2: <span id="score-p2" style="color: #74b9ff;">0</span></span>
                    </div>
                </div>

                <!-- NBA COURT SPECS -->
                <div style="
                    background: rgba(210,105,30,0.2);
                    padding: 10px;
                    border-radius: 6px;
                    font-size: 10px;
                    margin-bottom: 15px;
                    border: 1px solid ${NBA_COURT_CONSTANTS.COURT_COLOR};
                ">
                    <div style="color: #FF8C00; font-weight: bold; margin-bottom: 8px; text-align: center;">🏀 NBA COURT SPECS</div>
                    <div style="line-height: 1.4; color: #FFE6D1;">
                        ✅ Official court dimensions<br>
                        🏀 3-point lines & free throw areas<br>
                        ⚪ Center circle & court lines<br>
                        🗼 Support poles with nets<br>
                        🏟️ Hardwood parquet floor
                    </div>
                </div>

                <!-- STATS -->
                <div id="stats" style="
                    background: rgba(0,0,0,0.3);
                    padding: 10px;
                    border-radius: 6px;
                    font-size: 10px;
                    text-align: center;
                    border: 1px solid rgba(255,140,0,0.3);
                ">
                    <div>Basketballs: <span id="object-count">0</span> | Baskets: <span id="goals-count">0</span></div>
                    <div>Collisions: <span id="collision-count">0</span> | Max Speed: <span id="max-speed">0</span></div>
                    <div>Queue: <span id="queue-count">0</span> | Performance: <span id="performance">Optimal</span></div>
                </div>

                <!-- HELP TEXT -->
                <div style="
                    text-align: center;
                    margin-top: 15px;
                    font-size: 9px;
                    color: rgba(255,255,255,0.6);
                    border-top: 1px solid rgba(255,255,255,0.1);
                    padding-top: 10px;
                ">
                    Professional NBA court with physics<br>
                    <span style="color: #FF8C00;">Possession system & official dimensions</span>
                </div>
            `;

            panel.appendChild(header);
            panel.appendChild(content);
            document.body.appendChild(panel);

            this.makePanelDraggable();
            this.setupPanelButtons();
            this.setupAdvancedEventListeners();
            this.startAdvancedStatsMonitoring();
        }

        setupAdvancedEventListeners() {
            // Court and physics controls
            document.getElementById('create-court-btn')?.addEventListener('click', () => this.createProfessionalNBACourt());
            document.getElementById('toggle-physics')?.addEventListener('click', () => this.togglePhysics());

            // Object creation
            document.getElementById('add-basketball-btn')?.addEventListener('click', () => this.addRandomBasketball());

            // Actions
            document.getElementById('reset-all-btn')?.addEventListener('click', () => this.resetAllObjects());
            document.getElementById('clear-all-btn')?.addEventListener('click', () => this.clearAllObjects());

            // Advanced controls
            document.getElementById('match-mode-toggle')?.addEventListener('click', () => this.toggleMatchMode());
            document.getElementById('clean-canvas-btn')?.addEventListener('click', () => this.cleanCanvas());

            // Physics mode selection
            document.getElementById('physics-mode')?.addEventListener('change', (e) => {
                this.controls.alternatePhysics = e.target.value;
                this.showFeedback(`🔬 Physics Mode: ${e.target.options[e.target.selectedIndex].text}`, '#FF8C00');
            });

            // Canvas click for basketball creation
            if (this.canvasElement) {
                this.canvasElement.addEventListener('click', (e) => this.createBasketball(e.clientX - this.canvasElement.getBoundingClientRect().left, e.clientY - this.canvasElement.getBoundingClientRect().top));
            }
        }

        /* ---------- NBA PIXEL TEXT DRAWING (CORREGIDO) ---------- */
        NBA_PIXEL_LETTERS = {
            'B': [[1,1,1,1],[1,0,0,1],[1,1,1,1],[1,0,0,1],[1,1,1,1]],
            'A': [[0,1,1,0],[1,0,0,1],[1,1,1,1],[1,0,0,1],[1,0,0,1]],
            'S': [[1,1,1,1],[1,0,0,0],[1,1,1,1],[0,0,0,1],[1,1,1,1]],
            'K': [[1,0,0,1],[1,0,1,0],[1,1,0,0],[1,0,1,0],[1,0,0,1]],
            'E': [[1,1,1,1],[1,0,0,0],[1,1,1,0],[1,0,0,0],[1,1,1,1]],
            'T': [[1,1,1,1,1],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0]],
            'L': [[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,1,1,1]],
            'O': [[1,1,1,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,1,1,1]],
            'P': [[1,1,1,1],[1,0,0,1],[1,1,1,1],[1,0,0,0],[1,0,0,0]]
        };

        NUMBER_PATTERNS = {
            0: [[1,1,1],[1,0,1],[1,0,1],[1,0,1],[1,1,1]],
            1: [[0,1,0],[1,1,0],[0,1,0],[0,1,0],[1,1,1]],
            2: [[1,1,1],[0,0,1],[1,1,1],[1,0,0],[1,1,1]],
            3: [[1,1,1],[0,0,1],[1,1,1],[0,0,1],[1,1,1]],
            4: [[1,0,1],[1,0,1],[1,1,1],[0,0,1],[0,0,1]],
            5: [[1,1,1],[1,0,0],[1,1,1],[0,0,1],[1,1,1]]
        };

        // FUNCIÓN PRINCIPAL PARA DIBUJAR "BASKETBALL" (CORREGIDA)
        async drawNBAMainText(text, coords) {
            if (this.fieldDrawing.isStopped) return;

            const letterSpacing = coords.text.pixelSize * 7;
            const textWidth = text.length * letterSpacing;
            let currentX = coords.text.x - (textWidth / 2);

            for (let i = 0; i < text.length; i++) {
                if (this.fieldDrawing.isStopped) break;
                const letter = text[i].toUpperCase();
                if (letter === ' ') {
                    currentX += letterSpacing;
                    continue;
                }
                const pattern = this.NBA_PIXEL_LETTERS[letter];
                if (!pattern) continue;

                for (let row = 0; row < pattern.length; row++) {
                    for (let col = 0; col < pattern[row].length; col++) {
                        if (pattern[row][col] === 1) {
                            const pixelX = currentX + (col * coords.text.pixelSize);
                            const pixelY = coords.text.y + (row * coords.text.pixelSize);
                            const canvasSize = { width: drawariaCanvas.width, height: drawariaCanvas.height };
                            if (pixelX >= 0 && pixelX < canvasSize.width && pixelY >= 0 && pixelY < canvasSize.height) {
                                await this.drawNBAPixel(pixelX, pixelY, NBA_COURT_CONSTANTS.TEXT_COLOR, coords.text.pixelSize);
                            }
                        }
                    }
                }
                currentX += letterSpacing;
                await sleep(120);
            }
        }

        // FUNCIÓN PARA TEXTOS PEQUEÑOS (SCOREBOARDS)
        async drawNBASmallText(text, x, y, color, pixelSize) {
            let currentX = x;
            for (let i = 0; i < text.length; i++) {
                const letter = text[i];
                const pattern = this.NBA_PIXEL_LETTERS[letter];
                if (pattern) {
                    for (let row = 0; row < pattern.length; row++) {
                        for (let col = 0; col < pattern[row].length; col++) {
                            if (pattern[row][col] === 1) {
                                const pixelX = currentX + (col * pixelSize);
                                const pixelY = y + (row * pixelSize);
                                await this.drawNBAPixel(pixelX, pixelY, color, pixelSize);
                            }
                        }
                    }
                }
                currentX += pixelSize * 4;
            }
        }

        // FUNCIÓN PARA NÚMEROS
        async drawPixelNumber(number, x, y, color, pixelSize) {
            const pattern = this.NUMBER_PATTERNS[number];
            if (!pattern) return;

            for (let row = 0; row < pattern.length; row++) {
                for (let col = 0; col < pattern[row].length; col++) {
                    if (pattern[row][col] === 1) {
                        const pixelX = x + (col * pixelSize);
                        const pixelY = y + (row * pixelSize);
                        await this.drawNBAPixel(pixelX, pixelY, color, pixelSize);
                    }
                }
            }
        }

        async drawNBAPixel(x, y, color, size = 2) {
            if (this.fieldDrawing.isStopped) return;
            const canvasSize = { width: drawariaCanvas.width, height: drawariaCanvas.height };
            x = clamp(x, 0, canvasSize.width - size);
            y = clamp(y, 0, canvasSize.height - size);
            enqueueDrawCommand(x, y, x + 1, y + 1, color, size);
            await sleep(20);
        }


        /* ---------- PROFESSIONAL NBA COURT CREATION (from first script) ---------- */
        calculateProfessionalBasketballCoordinates() {
            const size = { width: drawariaCanvas.width, height: drawariaCanvas.height };
            return {
                // Aros de baloncesto con dimensiones profesionales
                leftBasket: {
                    x: Math.floor(size.width * 0.08),
                    y: Math.floor(size.height * 0.25),
                    rimWidth: Math.floor(size.width * 0.06),
                    rimHeight: Math.floor(size.height * 0.04),
                    backboardWidth: Math.floor(size.width * 0.1),
                    backboardHeight: Math.floor(size.height * 0.12)
                },
                rightBasket: {
                    x: Math.floor(size.width * 0.92),
                    y: Math.floor(size.height * 0.25),
                    rimWidth: Math.floor(size.width * 0.06),
                    rimHeight: Math.floor(size.height * 0.04),
                    backboardWidth: Math.floor(size.width * 0.1),
                    backboardHeight: Math.floor(size.height * 0.12)
                },
                // Líneas de la cancha
                centerLine: {
                    x: Math.floor(size.width * 0.5),
                    y1: Math.floor(size.height * 0.05),
                    y2: Math.floor(size.height * 0.95)
                },
                // Círculo central
                centerCircle: {
                    x: Math.floor(size.width * 0.5),
                    y: Math.floor(size.height * 0.5),
                    radius: Math.floor(size.width * 0.08)
                },
                // Líneas de tres puntos
                threePointLine: {
                    leftArc: {
                        centerX: Math.floor(size.width * 0.08),
                        centerY: Math.floor(size.height * 0.5),
                        radius: Math.floor(size.width * 0.18)
                    },
                    rightArc: {
                        centerX: Math.floor(size.width * 0.92),
                        centerY: Math.floor(size.height * 0.5),
                        radius: Math.floor(size.width * 0.18)
                    }
                },
                // Área restringida (key/paint)
                leftKey: {
                    x: Math.floor(size.width * 0.02),
                    y: Math.floor(size.height * 0.35),
                    width: Math.floor(size.width * 0.18),
                    height: Math.floor(size.height * 0.3)
                },
                rightKey: {
                    x: Math.floor(size.width * 0.8),
                    y: Math.floor(size.height * 0.35),
                    width: Math.floor(size.width * 0.18),
                    height: Math.floor(size.height * 0.3)
                },
                // Texto centrado
                text: {
                    x: Math.floor(size.width * 0.5),
                    y: Math.floor(size.height * 0.08),
                    pixelSize: Math.max(3, Math.floor(size.width * 0.006)) // Aumenté el tamaño mínimo
                }

            };
        }

        async createProfessionalNBACourt() {
            if (this.fieldDrawing.isDrawing) {
                this.showFeedback('⚠️ NBA Court creation already in progress!', '#ed8936');
                return;
            }
            if (!drawariaSocket || !drawariaCanvas || !drawariaCtx) {
                this.showFeedback('❌ Canvas or WebSocket connection not detected!', '#f56565');
                return;
            }

            this.fieldDrawing.isDrawing = true;
            this.fieldDrawing.isStopped = false;

            try {
                const coords = this.calculateProfessionalBasketballCoordinates();
                const canvasSize = { width: drawariaCanvas.width, height: drawariaCanvas.height };

                this.showFeedback(`🏀 Creating Professional NBA Court: ${canvasSize.width}x${canvasSize.height}`, NBA_COURT_CONSTANTS.COURT_COLOR);
                await sleep(800);

                // === 1. PISO DE PARQUET ===
                this.showFeedback("🏀 PHASE 1: Hardwood parquet floor...", NBA_COURT_CONSTANTS.COURT_COLOR);
                await this.drawProfessionalBasketballFloor();
                await sleep(300);
                if (this.fieldDrawing.isStopped) return;

                // === 2. LÍNEAS OFICIALES ===
                this.showFeedback("⚪ PHASE 2: Official NBA court lines...", NBA_COURT_CONSTANTS.LINE_COLOR);
                await this.drawProfessionalCourtLines(coords);
                await sleep(300);
                if (this.fieldDrawing.isStopped) return;

                // === 3. AROS PROFESIONALES ===
                this.showFeedback("🏀 PHASE 3: Installing left NBA rim...", NBA_COURT_CONSTANTS.RIM_COLOR);
                await this.drawProfessionalBasketballRim(coords.leftBasket, 'left');
                this.showFeedback("🏀 PHASE 3: Installing right NBA rim...", NBA_COURT_CONSTANTS.RIM_COLOR);
                await this.drawProfessionalBasketballRim(coords.rightBasket, 'right');
                await sleep(300);
                if (this.fieldDrawing.isStopped) return;

                // === 4. TEXTO "BASKETBALL" ===
                this.showFeedback("🎮 PHASE 4: Drawing 'BASKETBALL' text...", NBA_COURT_CONSTANTS.TEXT_COLOR);
                await this.drawNBAMainText("BASKETBALL", coords);

                // === CANCHA COMPLETA ===
                this.showFeedback("🏆 PROFESSIONAL NBA COURT COMPLETE! 🏀🎯", "#006400");
                setTimeout(() => {
                    const statusDiv = document.querySelector('.feedback-div');
                    if (statusDiv) {
                        statusDiv.style.opacity = 0;
                        setTimeout(() => statusDiv.remove(), 500);
                    }
                }, 4000);

                // Si match mode está activo, configurar área de juego
                if (this.matchMode.active) {
                    this.setupReducedPlayArea();
                    await this.drawNBAScoreboards(coords);
                }

            } catch (error) {
                console.error("Error creating NBA court:", error);
                this.showFeedback(`❌ Error: ${error.message}`, "#B22222");
            } finally {
                this.fieldDrawing.isDrawing = false;
            }
        }

        // Piso de parquet profesional
        async drawProfessionalBasketballFloor() {
            if (this.fieldDrawing.isStopped) return;
            const canvasSize = { width: drawariaCanvas.width, height: drawariaCanvas.height };

            // Base de madera
            await this.drawLineLocalAndServer(0, canvasSize.height - 5, canvasSize.width, canvasSize.height - 5, NBA_COURT_CONSTANTS.COURT_COLOR, 8, 40);

            // Líneas de madera horizontales para simular tablones
            for (let y = 25; y < canvasSize.height - 10; y += 30) {
                await this.drawLineLocalAndServer(0, y, canvasSize.width, y, '#8B4513', 1, 20);
                if (this.fieldDrawing.isStopped) break;
            }
        }

        // Líneas oficiales de cancha NBA
        async drawProfessionalCourtLines(coords) {
            if (this.fieldDrawing.isStopped) return;
            const lineThickness = Math.max(4, Math.floor(drawariaCanvas.width * NBA_COURT_CONSTANTS.LINE_THICKNESS_MULTIPLIER));

            // Línea central
            await this.drawLineLocalAndServer(
                coords.centerLine.x, coords.centerLine.y1,
                coords.centerLine.x, coords.centerLine.y2,
                NBA_COURT_CONSTANTS.LINE_COLOR, lineThickness, 80
            );

            // Bordes de la cancha
            const canvasSize = { width: drawariaCanvas.width, height: drawariaCanvas.height };
            await this.drawLineLocalAndServer(0, 0, canvasSize.width, 0, NBA_COURT_CONSTANTS.LINE_COLOR, lineThickness, 60);
            await this.drawLineLocalAndServer(canvasSize.width, 0, canvasSize.width, canvasSize.height, NBA_COURT_CONSTANTS.LINE_COLOR, lineThickness, 60);
            await this.drawLineLocalAndServer(canvasSize.width, canvasSize.height, 0, canvasSize.height, NBA_COURT_CONSTANTS.LINE_COLOR, lineThickness, 60);
            await this.drawLineLocalAndServer(0, canvasSize.height, 0, 0, NBA_COURT_CONSTANTS.LINE_COLOR, lineThickness, 60);

            // Círculo central
            await this.drawProfessionalCircle(
                coords.centerCircle.x,
                coords.centerCircle.y,
                coords.centerCircle.radius,
                NBA_COURT_CONSTANTS.LINE_COLOR,
                lineThickness
            );

            // Áreas restringidas
            await this.drawProfessionalRectangleOutline(coords.leftKey, NBA_COURT_CONSTANTS.KEY_COLOR, lineThickness);
            await this.drawProfessionalRectangleOutline(coords.rightKey, NBA_COURT_CONSTANTS.KEY_COLOR, lineThickness);

            // Líneas de tres puntos
            await this.drawProfessionalArc(coords.threePointLine.leftArc, NBA_COURT_CONSTANTS.LINE_COLOR, lineThickness, Math.PI/4, 3*Math.PI/4);
            await this.drawProfessionalArc(coords.threePointLine.rightArc, NBA_COURT_CONSTANTS.LINE_COLOR, lineThickness, Math.PI/4, 3*Math.PI/4);

            // Líneas de tiro libre
            await this.drawProfessionalFreeThrowLines(coords, NBA_COURT_CONSTANTS.LINE_COLOR, lineThickness);
        }

        // Aros NBA con postes de soporte profesionales
        async drawProfessionalBasketballRim(basketCoords, side = 'left') {
            if (this.fieldDrawing.isStopped) return;

            // Tablero rectangular
            const boardX = basketCoords.x - basketCoords.backboardWidth/2;
            const boardY = basketCoords.y - basketCoords.backboardHeight/2;

            await this.drawProfessionalRectangleOutline({
                x: boardX,
                y: boardY,
                width: basketCoords.backboardWidth,
                height: basketCoords.backboardHeight
            }, NBA_COURT_CONSTANTS.BACKBOARD_COLOR, 5);

            // Relleno del tablero (líneas horizontales)
            for (let y = boardY + 5; y < boardY + basketCoords.backboardHeight - 5; y += 3) {
                await this.drawLineLocalAndServer(boardX + 5, y, boardX + basketCoords.backboardWidth - 5, y, NBA_COURT_CONSTANTS.BACKBOARD_COLOR, 1, 20);
                if (this.fieldDrawing.isStopped) break;
            }

            // === POSTE DE SOPORTE PROFESIONAL ===
            const poleWidth = Math.floor(basketCoords.backboardWidth * 0.15);
            const poleHeight = Math.floor(drawariaCanvas.height * 0.15);
            const poleX = basketCoords.x - poleWidth/2;
            const poleY = boardY + basketCoords.backboardHeight;

            this.showFeedback(`🏗️ Installing ${side} NBA support pole...`, NBA_COURT_CONSTANTS.POLE_COLOR);

            // Dibujar poste vertical
            await this.drawProfessionalRectangleOutline({
                x: poleX,
                y: poleY,
                width: poleWidth,
                height: poleHeight
            }, NBA_COURT_CONSTANTS.POLE_COLOR, 4);

            // Rellenar el poste con líneas verticales para textura metálica
            for (let x = poleX + 2; x < poleX + poleWidth - 2; x += 3) {
                await this.drawLineLocalAndServer(x, poleY + 2, x, poleY + poleHeight - 2, '#808080', 1, 15);
                if (this.fieldDrawing.isStopped) break;
            }

            // Aro circular NBA
            const rimY = basketCoords.y + basketCoords.backboardHeight/3;
            await this.drawProfessionalCircle(
                basketCoords.x,
                rimY,
                basketCoords.rimWidth/2,
                NBA_COURT_CONSTANTS.RIM_COLOR,
                6
            );

            // Red del aro (líneas colgantes)
            const netLines = 8; // Más líneas para red más realista
            for (let i = 0; i < netLines; i++) {
                const angle = (Math.PI * 2 * i) / netLines;
                const startX = basketCoords.x + Math.cos(angle) * (basketCoords.rimWidth/2);
                const startY = rimY;
                const endX = startX + Math.cos(angle) * 8;
                const endY = startY + 20;

                await this.drawLineLocalAndServer(startX, startY, endX, endY, NBA_COURT_CONSTANTS.NET_COLOR, 2, 35);
                if (this.fieldDrawing.isStopped) break;
            }
        }

        // === FUNCIONES AUXILIARES GEOMÉTRICAS PROFESIONALES ===
        async drawProfessionalCircle(centerX, centerY, radius, color, thickness) {
            const steps = 24;
            for (let i = 0; i <= steps; i++) {
                if (this.fieldDrawing.isStopped) break;
                const angle1 = (Math.PI * 2 * i) / steps;
                const angle2 = (Math.PI * 2 * (i + 1)) / steps;
                const x1 = centerX + Math.cos(angle1) * radius;
                const y1 = centerY + Math.sin(angle1) * radius;
                const x2 = centerX + Math.cos(angle2) * radius;
                const y2 = centerY + Math.sin(angle2) * radius;
                await this.drawLineLocalAndServer(x1, y1, x2, y2, color, thickness, 30);
            }
        }

        async drawProfessionalArc(arcCoords, color, thickness, startAngle = 0, endAngle = Math.PI) {
            const steps = 16;
            for (let i = 0; i < steps; i++) {
                if (this.fieldDrawing.isStopped) break;
                const progress1 = i / steps;
                const progress2 = (i + 1) / steps;
                const angle1 = startAngle + (endAngle - startAngle) * progress1;
                const angle2 = startAngle + (endAngle - startAngle) * progress2;
                const x1 = arcCoords.centerX + Math.cos(angle1) * arcCoords.radius;
                const y1 = arcCoords.centerY + Math.sin(angle1) * arcCoords.radius;
                const x2 = arcCoords.centerX + Math.cos(angle2) * arcCoords.radius;
                const y2 = arcCoords.centerY + Math.sin(angle2) * arcCoords.radius;
                await this.drawLineLocalAndServer(x1, y1, x2, y2, color, thickness, 40);
            }
        }

        async drawProfessionalRectangleOutline(rectCoords, color, thickness) {
            await this.drawLineLocalAndServer(rectCoords.x, rectCoords.y,
                rectCoords.x + rectCoords.width, rectCoords.y, color, thickness, 50);
            await this.drawLineLocalAndServer(rectCoords.x + rectCoords.width, rectCoords.y,
                rectCoords.x + rectCoords.width, rectCoords.y + rectCoords.height, color, thickness, 50);
            await this.drawLineLocalAndServer(rectCoords.x + rectCoords.width, rectCoords.y + rectCoords.height,
                rectCoords.x, rectCoords.y + rectCoords.height, color, thickness, 50);
            await this.drawLineLocalAndServer(rectCoords.x, rectCoords.y + rectCoords.height,
                rectCoords.x, rectCoords.y, color, thickness, 50);
        }

        async drawProfessionalFreeThrowLines(coords, color, thickness) {
            // Línea de tiro libre izquierda
            const freeThrowX = coords.leftKey.x + coords.leftKey.width;
            await this.drawLineLocalAndServer(
                freeThrowX, coords.leftKey.y,
                freeThrowX, coords.leftKey.y + coords.leftKey.height,
                color, thickness, 60
            );
            // Línea de tiro libre derecha
            await this.drawLineLocalAndServer(
                coords.rightKey.x, coords.rightKey.y,
                coords.rightKey.x, coords.rightKey.y + coords.rightKey.height,
                color, thickness, 60
            );
            // Semicírculos de tiro libre
            await this.drawProfessionalArc({
                centerX: freeThrowX,
                centerY: coords.leftKey.y + coords.leftKey.height/2,
                radius: coords.leftKey.height/2
            }, color, thickness, -Math.PI/2, Math.PI/2);
            await this.drawProfessionalArc({
                centerX: coords.rightKey.x,
                centerY: coords.rightKey.y + coords.rightKey.height/2,
                radius: coords.rightKey.height/2
            }, color, thickness, Math.PI/2, 3*Math.PI/2);
        }

        /* ---------- BASKETBALL POSSESSION SYSTEM ---------- */
        handleBasketballPossession() {
            const players = this.getPlayerPositions();
            if (players.length === 0) return;

            this.physicsObjects.forEach(ball => {
                if (ball.type !== 'basketball') return;

                let closestPlayer = null;
                let closestDistance = Infinity;

                // Encontrar jugador más cercano
                players.forEach(player => {
                    const dx = ball.x - player.x;
                    const dy = ball.y - player.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closestPlayer = player;
                    }
                });

                // Sistema de posesión
                if (closestPlayer && closestDistance < this.possessionSystem.possessionDistance) {
                    const currentTime = performance.now();

                    // Si no tiene dueño o es un robo válido
                    if (!ball.owner || (ball.owner.id !== closestPlayer.id &&
                        currentTime - ball.lastStealAttempt > PHYSICS_CONSTANTS.STEAL_COOLDOWN)) {

                        // Cambio de posesión
                        if (ball.owner && ball.owner.id !== closestPlayer.id) {
                            ball.lastStealAttempt = currentTime;
                            this.showFeedback(`🏀 ${closestPlayer.type === 'self' ? 'YOU' : 'OPPONENT'} STOLE THE BALL!`, '#FF4500');
                        }

                        ball.owner = closestPlayer;
                        ball.isBeingDribbled = true;
                    }

                    // Efecto de dribleo
                    if (ball.owner && ball.owner.id === closestPlayer.id) {
                        this.applyDribblePhysics(ball, closestPlayer);
                    }
                } else {
                    // Pelota libre
                    ball.owner = null;
                    ball.isBeingDribbled = false;
                }
            });
        }

        // Física de dribleo
        applyDribblePhysics(ball, player) {
            const dx = player.x - ball.x;
            const dy = player.y - ball.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 0) {
                // Fuerza magnética suave hacia el jugador
                const magneticForce = PHYSICS_CONSTANTS.DRIBBLE_FORCE / (distance * 0.5);
                ball.vx += (dx / distance) * magneticForce * PHYSICS_CONSTANTS.TIMESTEP;
                ball.vy += (dy / distance) * magneticForce * PHYSICS_CONSTANTS.TIMESTEP;

                // Transferir velocidad del jugador
                if (player.vx || player.vy) {
                    ball.vx += (player.vx || 0) * 0.3;
                    ball.vy += (player.vy || 0) * 0.3;
                }

                // Dribleo automático cada 800ms
                if (performance.now() - ball.lastDribbleTime > 800) {
                    ball.lastDribbleTime = performance.now();
                    ball.vy -= 100; // Pequeño rebote hacia arriba
                }
            }
        }

        /* ---------- NBA SCORING SYSTEM ---------- */
        checkBasketballScoring() {
            if (!this.matchMode.active || !this.canvasElement) return;

            const coords = this.calculateProfessionalBasketballCoordinates();
            const currentTime = performance.now();

            this.physicsObjects.forEach(ball => {
                if (ball.type !== 'basketball') return;
                if (currentTime - ball.lastGoalTime < 2000) return;

                // Detección de canasta más precisa para aros NBA
                const basketDetection = PHYSICS_CONSTANTS.BALL_RADIUS + 15;

                // Canasta izquierda (P2 anota) - usando coordenadas del aro
                const leftRimY = coords.leftBasket.y + coords.leftBasket.backboardHeight/3;
                if (ball.x >= coords.leftBasket.x - basketDetection &&
                    ball.x <= coords.leftBasket.x + basketDetection &&
                    ball.y >= leftRimY - basketDetection &&
                    ball.y <= leftRimY + basketDetection) {

                    ball.lastGoalTime = currentTime;
                    this.scoreBasket('p2', ball);
                }

                // Canasta derecha (P1 anota) - usando coordenadas del aro
                const rightRimY = coords.rightBasket.y + coords.rightBasket.backboardHeight/3;
                if (ball.x >= coords.rightBasket.x - basketDetection &&
                    ball.x <= coords.rightBasket.x + basketDetection &&
                    ball.y >= rightRimY - basketDetection &&
                    ball.y <= rightRimY + basketDetection) {

                    ball.lastGoalTime = currentTime;
                    this.scoreBasket('p1', ball);
                }
            });
        }

        // Anotar canasta con rebote hacia adentro
        async scoreBasket(player, basketball) {
            if (this.matchMode.goalCooldown) return;
            this.matchMode.goalCooldown = true;

            // Rebote hacia adentro de la canasta
            const bounceForce = 80;
            basketball.vx *= -0.2;
            basketball.vy = -bounceForce;

            this.matchMode.scores[player]++;
            this.gameStats.totalBaskets++;

            this.updateScoreboard();
            await this.updateNBAScoreDisplay();

            this.showFeedback(`🏀 NBA BASKET! ${player.toUpperCase()} SCORES!`, '#FFD700');

            // NO eliminar la pelota, solo liberar posesión
            basketball.owner = null;
            basketball.isBeingDribbled = false;

            setTimeout(() => {
                this.matchMode.goalCooldown = false;
            }, 1500);

            if (this.matchMode.scores[player] >= MATCH_CONSTANTS.MAX_BASKETS) {
                await this.endMatch(player);
            }
        }

        /* ---------- MATCH MODE WITH NBA COURT ---------- */
        toggleMatchMode() {
            const button = document.getElementById('match-mode-toggle');
            const scoreboard = document.getElementById('match-scoreboard');

            this.matchMode.active = !this.matchMode.active;

            if (this.matchMode.active) {
                button.style.background = 'linear-gradient(135deg, #ffd700, #ffb347)';
                scoreboard.style.display = 'block';
                this.setupMatchMode();
                this.showFeedback('🏆 NBA MATCH MODE ACTIVATED!', '#ffd700');
            } else {
                button.style.background = 'linear-gradient(135deg, #444, #666)';
                scoreboard.style.display = 'none';
                this.resetMatch();
                this.showFeedback('🏆 Match Mode Deactivated', '#666');
            }
        }

        async setupMatchMode() {
            await this.createProfessionalNBACourt();
            this.matchMode.scores = { p1: 0, p2: 0 };
            this.updateScoreboard();
            this.setupReducedPlayArea();

            setTimeout(() => {
                this.addRandomBasketball(true);
            }, 500);
        }

        async drawNBAScoreboards(coords) {
            if (!this.canvasElement) return;

            // P1 scoreboard (cerca del aro derecho)
            const p1X = coords.rightBasket.x;
            const p1Y = coords.rightBasket.y - 60;

            // P2 scoreboard (cerca del aro izquierdo)
            const p2X = coords.leftBasket.x;
            const p2Y = coords.leftBasket.y - 60;

            await this.drawNBASmallText("P1", p1X - 20, p1Y - 30, NBA_COURT_CONSTANTS.TEXT_COLOR, 3);
            await this.drawNBASmallText("P2", p2X - 20, p2Y - 30, NBA_COURT_CONSTANTS.TEXT_COLOR, 3);

            this.matchMode.lastScorePositions = {
                p1: { x: p1X, y: p1Y },
                p2: { x: p2X, y: p2Y }
            };

            await this.updateNBAScoreDisplay();
        }

        async updateNBAScoreDisplay() {
            if (!this.matchMode.lastScorePositions.p1) return;

            const { p1, p2 } = this.matchMode.lastScorePositions;
            const pixelSize = 4;

            await this.clearScoreArea(p1.x, p1.y, pixelSize);
            await this.clearScoreArea(p2.x, p2.y, pixelSize);

            await this.drawPixelNumber(this.matchMode.scores.p1, p1.x, p1.y, NBA_COURT_CONSTANTS.TEXT_COLOR, pixelSize);
            await this.drawPixelNumber(this.matchMode.scores.p2, p2.x, p2.y, NBA_COURT_CONSTANTS.TEXT_COLOR, pixelSize);
        }

        /* ---------- PHYSICS ENGINE ---------- */
        togglePhysics() {
            const toggleBtn = document.getElementById('toggle-physics');
            if (!this.isActive) {
                this.startPhysics();
                if (toggleBtn) {
                    toggleBtn.textContent = '🛑 Stop Basketball Engine';
                    toggleBtn.style.background = 'linear-gradient(135deg, #f56565, #e53e3e)';
                }
            } else {
                this.stopPhysics();
                if (toggleBtn) {
                    toggleBtn.textContent = '🚀 Launch Basketball Engine';
                    toggleBtn.style.background = 'linear-gradient(135deg, #FF8C00, #FF6347)';
                }
            }
        }

        startPhysics() {
            if (this.isActive) return;
            this.isActive = true;
            this.startGameLoop();
            this.showFeedback('🚀 NBA Basketball Engine Started!', '#FF8C00');
        }

        stopPhysics() {
            this.isActive = false;
            this.showFeedback('🛑 Basketball Engine Stopped', '#f56565');
        }

        startGameLoop() {
            if (!this.isActive) return;
            const currentTime = performance.now();
            if (currentTime - this.lastRenderTime >= this.renderInterval) {
                this.updateAdvancedPhysics();
                this.renderOptimized();
                this.lastRenderTime = currentTime;
            }
            requestAnimationFrame(() => this.startGameLoop());
        }

        updateAdvancedPhysics() {
            const dt = PHYSICS_CONSTANTS.TIMESTEP;

            // Apply physics mode modifications
            let gravityMultiplier = 1;
            let airResistanceMultiplier = 1;

            switch(this.controls.alternatePhysics) {
                case 'moon':
                    gravityMultiplier = 0.16;
                    break;
                case 'underwater':
                    airResistanceMultiplier = 15;
                    gravityMultiplier = 0.3;
                    break;
                case 'magnetic':
                    break;
            }

            // Update all basketballs
            this.physicsObjects.forEach(obj => {
                // Apply air resistance
                obj.vx *= (1 - PHYSICS_CONSTANTS.AIR_RESISTANCE * airResistanceMultiplier * dt);
                obj.vy *= (1 - PHYSICS_CONSTANTS.AIR_RESISTANCE * airResistanceMultiplier * dt);

                // Apply gravity
                obj.vy += PHYSICS_CONSTANTS.GRAVITY * gravityMultiplier * dt;

                // Magnetic field effects
                if (this.controls.alternatePhysics === 'magnetic') {
                    this.physicsObjects.forEach(otherObj => {
                        if (otherObj.id !== obj.id) {
                            const dx = otherObj.x - obj.x;
                            const dy = otherObj.y - obj.y;
                            const distance = Math.sqrt(dx * dx + dy * dy);

                            if (distance > 0 && distance < 200) {
                                const magneticForce = 50 / (distance * distance);
                                const forceX = (dx / distance) * magneticForce;
                                const forceY = (dy / distance) * magneticForce;

                                obj.vx += forceX * dt;
                                obj.vy += forceY * dt;
                            }
                        }
                    });
                }

                // Update position
                obj.x += obj.vx * dt;
                obj.y += obj.vy * dt;

                // Boundary collisions
                this.handleBoundaryCollisions(obj);

                // Track maximum velocity
                const speed = Math.sqrt(obj.vx * obj.vx + obj.vy * obj.vy);
                if (speed > this.gameStats.maxVelocityReached) {
                    this.gameStats.maxVelocityReached = speed;
                }

                // Limit maximum velocity
                if (speed > PHYSICS_CONSTANTS.MAX_VELOCITY) {
                    obj.vx = (obj.vx / speed) * PHYSICS_CONSTANTS.MAX_VELOCITY;
                    obj.vy = (obj.vy / speed) * PHYSICS_CONSTANTS.MAX_VELOCITY;
                }
            });

            // Handle collisions
            this.handleObjectCollisions();
            this.handleBallPlayerCollisions();

            // Handle basketball possession system
            this.handleBasketballPossession();

            // Check for basketball scoring
            if (this.matchMode.active) {
                this.checkBasketballScoring();
            }
        }

        /* ---------- OBJECT CREATION ---------- */
        addRandomBasketball(spawnAtCenterForScore = false) {
            if (!this.canvasElement) return;

            let x, y;
            if (spawnAtCenterForScore) {
                x = this.canvasElement.width / 2;
                y = this.canvasElement.height / 2;
            } else {
                const padding = 100;
                x = Math.random() * (this.canvasElement.width - 2 * padding) + padding;
                y = Math.random() * (this.canvasElement.height * 0.4 - 2 * padding) + padding;
            }

            this.createBasketball(x, y);
        }

        createBasketball(x, y) {
            const id = `basketball_${this.objectIdCounter++}`;
            const ball = {
                id: id,
                type: 'basketball',
                x: x, y: y, vx: 0, vy: 0,
                radius: PHYSICS_CONSTANTS.BALL_RADIUS,
                color: PHYSICS_CONSTANTS.BALL_COLOR,
                mass: PHYSICS_CONSTANTS.BALL_MASS,
                restitution: PHYSICS_CONSTANTS.RESTITUTION_BALL,
                friction: PHYSICS_CONSTANTS.FRICTION_COURT,
                lastRenderX: -9999, lastRenderY: -9999,
                creationTime: performance.now(),
                lastCollisionTime: 0,
                lastGoalTime: 0,

                // Propiedades de baloncesto
                owner: null,
                lastDribbleTime: 0,
                isBeingDribbled: false,
                lastStealAttempt: 0
            };

            this.physicsObjects.set(id, ball);
            this.gameStats.objectsCreated++;
            return ball;
        }

        /* ---------- COLLISION HANDLING ---------- */
        handleBoundaryCollisions(obj) {
            if (!this.canvasElement) return;

            let objHalfSize = obj.radius;

            let boundaries;
            if (this.matchMode.active && this.matchMode.playArea) {
                boundaries = {
                    left: this.matchMode.playArea.left + objHalfSize,
                    right: this.matchMode.playArea.right - objHalfSize,
                    top: this.matchMode.playArea.top + objHalfSize,
                    bottom: this.matchMode.playArea.bottom - objHalfSize
                };
            } else {
                boundaries = {
                    left: objHalfSize,
                    right: this.canvasElement.width - objHalfSize,
                    top: objHalfSize,
                    bottom: this.canvasElement.height - objHalfSize
                };
            }

            if (obj.x < boundaries.left) {
                obj.x = boundaries.left;
                obj.vx = -obj.vx * PHYSICS_CONSTANTS.RESTITUTION_WALL;
            } else if (obj.x > boundaries.right) {
                obj.x = boundaries.right;
                obj.vx = -obj.vx * PHYSICS_CONSTANTS.RESTITUTION_WALL;
            }

            if (obj.y < boundaries.top) {
                obj.y = boundaries.top;
                obj.vy = -obj.vy * PHYSICS_CONSTANTS.RESTITUTION_WALL;
            } else if (obj.y > boundaries.bottom) {
                obj.y = boundaries.bottom;
                obj.vy = -obj.vy * PHYSICS_CONSTANTS.RESTITUTION_WALL;
                obj.vx *= obj.friction;
            }
        }

        handleObjectCollisions() {
            const objectsArray = Array.from(this.physicsObjects.values());
            for (let i = 0; i < objectsArray.length; i++) {
                const objA = objectsArray[i];
                for (let j = i + 1; j < objectsArray.length; j++) {
                    const objB = objectsArray[j];

                    if (objA.type === 'basketball' && objB.type === 'basketball') {
                        if (this.handleBasketballCollision(objA, objB)) {
                            this.gameStats.totalCollisions++;
                            objA.lastCollisionTime = performance.now();
                            objB.lastCollisionTime = performance.now();
                        }
                    }
                }
            }
        }

        handleBasketballCollision(ball1, ball2) {
            const dx = ball2.x - ball1.x;
            const dy = ball2.y - ball1.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance = ball1.radius + ball2.radius;

            if (distance < minDistance && distance !== 0) {
                const normalX = dx / distance;
                const normalY = dy / distance;

                const overlap = minDistance - distance;
                ball1.x -= normalX * overlap * 0.5;
                ball1.y -= normalY * overlap * 0.5;
                ball2.x += normalX * overlap * 0.5;
                ball2.y += normalY * overlap * 0.5;

                const rvX = ball2.vx - ball1.vx;
                const rvY = ball2.vy - ball1.vy;
                const velAlongNormal = rvX * normalX + rvY * normalY;

                if (velAlongNormal > 0) return false;

                const e = (ball1.restitution + ball2.restitution) * 0.5;
                let j = -(1 + e) * velAlongNormal;
                j /= (1 / ball1.mass) + (1 / ball2.mass);

                const impulseX = j * normalX;
                const impulseY = j * normalY;

                ball1.vx -= impulseX / ball1.mass;
                ball1.vy -= impulseY / ball1.mass;
                ball2.vx += impulseX / ball2.mass;
                ball2.vy += impulseY / ball2.mass;

                return true;
            }
            return false;
        }

        /* ---------- PLAYER COLLISION SYSTEM ---------- */
        getPlayerPositions() {
            const currentTime = performance.now();
            const players = [];
            if (!drawariaCanvas) return players;

            const canvasRect = drawariaCanvas.getBoundingClientRect();
            const deltaTime = currentTime - this.playerTracker.lastUpdateTime;

            const selfPlayer = document.querySelector('div.spawnedavatar.spawnedavatar-self');
            if (selfPlayer) {
                const rect = selfPlayer.getBoundingClientRect();
                const currentPos = {
                    type: 'self',
                    id: selfPlayer.dataset.playerid || 'self',
                    x: rect.left - canvasRect.left + rect.width / 2,
                    y: rect.top - canvasRect.top + rect.height / 2,
                    width: rect.width,
                    height: rect.height,
                    radius: Math.max(rect.width, rect.height) / 2,
                    vx: 0,
                    vy: 0
                };

                const prevPlayer = this.playerTracker.players.get('self');
                if (prevPlayer && deltaTime > 0) {
                    currentPos.vx = (currentPos.x - prevPlayer.x) / (deltaTime / 1000);
                    currentPos.vy = (currentPos.y - prevPlayer.y) / (deltaTime / 1000);
                }

                players.push(currentPos);
                this.playerTracker.players.set('self', currentPos);
            }

            const otherPlayers = document.querySelectorAll('div.spawnedavatar.spawnedavatar-otherplayer');
            otherPlayers.forEach((player, index) => {
                const rect = player.getBoundingClientRect();
                const playerId = player.dataset.playerid || `other_${index}`;
                const currentPos = {
                    type: 'other',
                    id: playerId,
                    x: rect.left - canvasRect.left + rect.width / 2,
                    y: rect.top - canvasRect.top + rect.height / 2,
                    width: rect.width,
                    height: rect.height,
                    radius: Math.max(rect.width, rect.height) / 2,
                    vx: 0,
                    vy: 0
                };

                const prevPlayer = this.playerTracker.players.get(playerId);
                if (prevPlayer && deltaTime > 0) {
                    currentPos.vx = (currentPos.x - prevPlayer.x) / (deltaTime / 1000);
                    currentPos.vy = (currentPos.y - prevPlayer.y) / (deltaTime / 1000);
                }

                players.push(currentPos);
                this.playerTracker.players.set(playerId, currentPos);
            });

            this.playerTracker.lastUpdateTime = currentTime;

            return players.filter(p =>
                p.x >= -this.playerTracker.detectionRadius &&
                p.x <= drawariaCanvas.width + this.playerTracker.detectionRadius &&
                p.y >= -this.playerTracker.detectionRadius &&
                p.y <= drawariaCanvas.height + this.playerTracker.detectionRadius
            );
        }

        handleBallPlayerCollisions() {
            const players = this.getPlayerPositions();
            if (players.length === 0) return;

            this.physicsObjects.forEach(ball => {
                if (ball.type !== 'basketball') return;

                players.forEach(player => {
                    const dx = ball.x - player.x;
                    const dy = ball.y - player.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const detectionDistance = this.playerTracker.detectionRadius;

                    if (distance < detectionDistance && distance > 0) {
                        const intensity = Math.max(0, (detectionDistance - distance) / detectionDistance);

                        if (distance < ball.radius + player.radius) {
                            this.resolveBasketballPlayerCollision(ball, player, dx, dy, distance, 'collision');
                        } else if (intensity > 0.3) {
                            this.resolveBasketballPlayerCollision(ball, player, dx, dy, distance, 'push', intensity);
                        }
                    }
                });
            });
        }

        resolveBasketballPlayerCollision(ball, player, dx, dy, distance, interactionType = 'collision', intensity = 1.0) {
            const normalX = dx / distance;
            const normalY = dy / distance;

            if (interactionType === 'collision') {
                const overlap = (ball.radius + player.radius) - distance;
                ball.x += normalX * overlap * 1.1;
                ball.y += normalY * overlap * 1.1;

                const relativeVelX = ball.vx - (player.vx || 0);
                const relativeVelY = ball.vy - (player.vy || 0);
                const velAlongNormal = relativeVelX * normalX + relativeVelY * normalY;

                if (velAlongNormal > 0) return;

                const restitution = PHYSICS_CONSTANTS.PLAYER_RESTITUTION;
                const impulse = -(1 + restitution) * velAlongNormal;

                ball.vx += impulse * normalX;
                ball.vy += impulse * normalY;

                if (player.vx || player.vy) {
                    const transferFactor = 0.7;
                    ball.vx += (player.vx || 0) * transferFactor;
                    ball.vy += (player.vy || 0) * transferFactor;
                }

                const additionalForce = PHYSICS_CONSTANTS.PLAYER_INTERACTION_FORCE * 1.5;
                ball.vx += normalX * additionalForce * PHYSICS_CONSTANTS.TIMESTEP;
                ball.vy += normalY * additionalForce * PHYSICS_CONSTANTS.TIMESTEP;

            } else if (interactionType === 'push') {
                const pushForce = PHYSICS_CONSTANTS.PLAYER_INTERACTION_FORCE *
                                 PHYSICS_CONSTANTS.PLAYER_PUSH_MULTIPLIER *
                                 intensity * intensity;

                ball.vx += normalX * pushForce * PHYSICS_CONSTANTS.TIMESTEP;
                ball.vy += normalY * pushForce * PHYSICS_CONSTANTS.TIMESTEP;

                if (player.vx || player.vy) {
                    const playerSpeed = Math.sqrt((player.vx || 0) ** 2 + (player.vy || 0) ** 2);
                    if (playerSpeed > 50) {
                        const moveTransfer = intensity * 0.4;
                        ball.vx += (player.vx || 0) * moveTransfer;
                        ball.vy += (player.vy || 0) * moveTransfer;
                    }
                }
            }

            const maxSpeed = PHYSICS_CONSTANTS.MAX_VELOCITY * 1.2;
            const currentSpeed = Math.sqrt(ball.vx ** 2 + ball.vy ** 2);
            if (currentSpeed > maxSpeed) {
                ball.vx = (ball.vx / currentSpeed) * maxSpeed;
                ball.vy = (ball.vy / currentSpeed) * maxSpeed;
            }
        }

        /* ---------- RENDERING ---------- */
        renderOptimized() {
            this.physicsObjects.forEach(obj => {
                if (obj.type !== 'basketball') return;

                const dx = Math.abs(obj.x - obj.lastRenderX);
                const dy = Math.abs(obj.y - obj.lastRenderY);

                const needsServerRedraw = dx > MOVEMENT_THRESHOLD || dy > MOVEMENT_THRESHOLD;

                if (needsServerRedraw) {
                    // Erase old position
                    if (obj.lastRenderX !== -9999 || obj.lastRenderY !== -9999) {
                        this.drawBasketball(obj.lastRenderX, obj.lastRenderY, obj.radius, '#FFFFFF');
                    }

                    // Draw at new position
                    this.drawBasketball(obj.x, obj.y, obj.radius, obj.color);

                    obj.lastRenderX = obj.x;
                    obj.lastRenderY = obj.y;
                }
            });
        }

        drawBasketball(x, y, radius, color) {
            const effectiveThickness = radius * 2.5;
            enqueueDrawCommand(x, y, x + 0.1, y + 0.1, color, effectiveThickness);
        }

        /* ---------- UTILITY FUNCTIONS ---------- */
        clearAllObjects(showFeedback = true) {
            this.physicsObjects.clear();
            positionCache.clear();

            if (drawariaCtx && drawariaCanvas) {
                drawariaCtx.clearRect(0, 0, drawariaCanvas.width, drawariaCanvas.height);
            }
            if (showFeedback) {
                this.showFeedback('🗑️ ALL BASKETBALLS CLEARED!', '#cc0000');
            }
        }

        resetAllObjects() {
            if (this.canvasElement) {
                this.physicsObjects.forEach(obj => {
                    obj.x = this.canvasElement.width / 2 + (Math.random() - 0.5) * 100;
                    obj.y = this.canvasElement.height / 2 + (Math.random() - 0.5) * 100;
                    obj.vx = 0; obj.vy = 0;
                    obj.lastRenderX = -9999; obj.lastRenderY = -9999;
                    obj.lastGoalTime = 0;
                    obj.owner = null;
                    obj.isBeingDribbled = false;
                });

                this.showFeedback('🔄 All basketballs reset!', '#74b9ff');
            }
        }

        setupReducedPlayArea() {
            if (!this.canvasElement) return;

            const reductionSides = this.canvasElement.width * MATCH_CONSTANTS.PLAY_AREA_REDUCTION.SIDES;
            const reductionTop = this.canvasElement.height * MATCH_CONSTANTS.PLAY_AREA_REDUCTION.TOP;

            this.matchMode.playArea = {
                left: reductionSides,
                right: this.canvasElement.width - reductionSides,
                top: reductionTop,
                bottom: this.canvasElement.height
            };
        }

        updateScoreboard() {
            document.getElementById('score-p1').textContent = this.matchMode.scores.p1;
            document.getElementById('score-p2').textContent = this.matchMode.scores.p2;
        }

                async endMatch(winner) {
            this.showFeedback(`🏆 ${winner.toUpperCase()} WINS THE NBA MATCH!`, '#ffd700');

            setTimeout(() => {
                this.resetMatch();
            }, 3000);
        }

        resetMatch() {
            this.matchMode.scores = { p1: 0, p2: 0 };
            this.updateScoreboard();
            if (this.matchMode.active) {
                this.clearAllObjects(false);
                this.createProfessionalNBACourt().then(() => {
                    this.addRandomBasketball(true);
                });
            }
        }

        /* ---------- NBA PIXEL TEXT DRAWING ---------- */
        NBA_PIXEL_LETTERS = {
            'B': [[1,1,1,1],[1,0,0,1],[1,1,1,1],[1,0,0,1],[1,1,1,1]],
            'A': [[0,1,1,0],[1,0,0,1],[1,1,1,1],[1,0,0,1],[1,0,0,1]],
            'S': [[1,1,1,1],[1,0,0,0],[1,1,1,1],[0,0,0,1],[1,1,1,1]],
            'K': [[1,0,0,1],[1,0,1,0],[1,1,0,0],[1,0,1,0],[1,0,0,1]],
            'E': [[1,1,1,1],[1,0,0,0],[1,1,1,0],[1,0,0,0],[1,1,1,1]],
            'T': [[1,1,1,1,1],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0]],
            'L': [[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,1,1,1]],
            'O': [[1,1,1,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,1,1,1]],
            'P': [[1,1,1,1],[1,0,0,1],[1,1,1,1],[1,0,0,0],[1,0,0,0]],
            '1': [[0,1,0],[1,1,0],[0,1,0],[0,1,0],[1,1,1]],
            '2': [[1,1,1],[0,0,1],[1,1,1],[1,0,0],[1,1,1]]
        };

        NUMBER_PATTERNS = {
            0: [[1,1,1],[1,0,1],[1,0,1],[1,0,1],[1,1,1]],
            1: [[0,1,0],[1,1,0],[0,1,0],[0,1,0],[1,1,1]],
            2: [[1,1,1],[0,0,1],[1,1,1],[1,0,0],[1,1,1]],
            3: [[1,1,1],[0,0,1],[1,1,1],[0,0,1],[1,1,1]],
            4: [[1,0,1],[1,0,1],[1,1,1],[0,0,1],[0,0,1]],
            5: [[1,1,1],[1,0,0],[1,1,1],[0,0,1],[1,1,1]]
        };

        async drawNBAPixelText(text, coords) {
            if (this.fieldDrawing.isStopped) return;
            const letterSpacing = coords.text.pixelSize * 7;
            const textWidth = text.length * letterSpacing;
            let currentX = coords.text.x - (textWidth / 2);

            for (let i = 0; i < text.length; i++) {
                if (this.fieldDrawing.isStopped) break;
                const letter = text[i].toUpperCase();
                if (letter === ' ') {
                    currentX += letterSpacing;
                    continue;
                }
                const pattern = this.NBA_PIXEL_LETTERS[letter];
                if (!pattern) continue;

                for (let row = 0; row < pattern.length; row++) {
                    for (let col = 0; col < pattern[row].length; col++) {
                        if (pattern[row][col] === 1) {
                            const pixelX = currentX + (col * coords.text.pixelSize);
                            const pixelY = coords.text.y + (row * coords.text.pixelSize);
                            const canvasSize = { width: drawariaCanvas.width, height: drawariaCanvas.height };
                            if (pixelX >= 0 && pixelX < canvasSize.width && pixelY >= 0 && pixelY < canvasSize.height) {
                                await this.drawNBAPixel(pixelX, pixelY, NBA_COURT_CONSTANTS.TEXT_COLOR, coords.text.pixelSize);
                            }
                        }
                    }
                }
                currentX += letterSpacing;
                await sleep(120);
            }
        }

        async drawNBAPixelText(text, x, y, color, pixelSize) {
            let currentX = x;
            for (let i = 0; i < text.length; i++) {
                const letter = text[i];
                const pattern = this.NBA_PIXEL_LETTERS[letter];
                if (pattern) {
                    for (let row = 0; row < pattern.length; row++) {
                        for (let col = 0; col < pattern[row].length; col++) {
                            if (pattern[row][col] === 1) {
                                const pixelX = currentX + (col * pixelSize);
                                const pixelY = y + (row * pixelSize);
                                await this.drawNBAPixel(pixelX, pixelY, color, pixelSize);
                            }
                        }
                    }
                }
                currentX += pixelSize * 4;
            }
        }

        async drawPixelNumber(number, x, y, color, pixelSize) {
            const pattern = this.NUMBER_PATTERNS[number];
            if (!pattern) return;

            for (let row = 0; row < pattern.length; row++) {
                for (let col = 0; col < pattern[row].length; col++) {
                    if (pattern[row][col] === 1) {
                        const pixelX = x + (col * pixelSize);
                        const pixelY = y + (row * pixelSize);
                        await this.drawNBAPixel(pixelX, pixelY, color, pixelSize);
                    }
                }
            }
        }

        async drawNBAPixel(x, y, color, size = 2) {
            if (this.fieldDrawing.isStopped) return;
            const canvasSize = { width: drawariaCanvas.width, height: drawariaCanvas.height };
            x = clamp(x, 0, canvasSize.width - size);
            y = clamp(y, 0, canvasSize.height - size);
            enqueueDrawCommand(x, y, x + 1, y + 1, color, size);
            await sleep(20);
        }

        async clearScoreArea(x, y, size) {
            const clearWidth = size * 5 + 10;
            const clearHeight = size * 7 + 10;
            const startX = x - 5;
            const startY = y - 5;

            await sleep(10);
        }

        /* ---------- DRAWING FUNCTIONS ---------- */
        async drawLineLocalAndServer(startX, startY, endX, endY, color, thickness, delay = 60) {
            if (this.fieldDrawing.isStopped) {
                this.fieldDrawing.isDrawing = false;
                return;
            }
            const canvasSize = { width: drawariaCanvas.width, height: drawariaCanvas.height };
            startX = clamp(startX, -100, canvasSize.width + 100);
            startY = clamp(startY, 0, canvasSize.height);
            endX = clamp(endX, -100, canvasSize.width + 100);
            endY = clamp(endY, 0, canvasSize.height);
            enqueueDrawCommand(startX, startY, endX, endY, color, thickness);
            await sleep(delay);
        }

        // Clean Canvas functionality
        async cleanCanvas() {
            if (!drawariaCanvas) return;

            this.showFeedback('🧹 Cleaning NBA Court...', '#e17055');

            const canvasWidth = drawariaCanvas.width;
            const canvasHeight = drawariaCanvas.height;

            for (let y = 0; y < canvasHeight; y += 100) {
                for (let x = 0; x < canvasWidth; x += 100) {
                    const width = Math.min(100, canvasWidth - x);
                    const height = Math.min(100, canvasHeight - y);
                    enqueueDrawCommand(x, y, x + width, y + height, '#FFFFFF', Math.max(width, height));
                    await sleep(5);
                }
            }

            if (drawariaCtx) {
                drawariaCtx.clearRect(0, 0, canvasWidth, canvasHeight);
            }

            this.showFeedback('🧹 NBA Court Cleaned!', '#00d084');
        }

        /* ---------- PANEL FUNCTIONALITY ---------- */
        makePanelDraggable() {
            const panel = document.getElementById('advanced-physics-panel');
            const header = document.getElementById('panel-header');

            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

            if (header) {
                header.onmousedown = dragMouseDown;
            } else {
                panel.onmousedown = dragMouseDown;
            }

            function dragMouseDown(e) {
                e = e || window.event;
                e.preventDefault();
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;
                panel.classList.add('panel-dragging');
            }

            function elementDrag(e) {
                e = e || window.event;
                e.preventDefault();
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;

                const newTop = panel.offsetTop - pos2;
                const newLeft = panel.offsetLeft - pos1;

                const maxLeft = window.innerWidth - panel.offsetWidth;
                const maxTop = window.innerHeight - panel.offsetHeight;

                panel.style.top = Math.min(Math.max(0, newTop), maxTop) + "px";
                panel.style.left = Math.min(Math.max(0, newLeft), maxLeft) + "px";
                panel.style.right = 'auto';
            }

            function closeDragElement() {
                document.onmouseup = null;
                document.onmousemove = null;
                panel.classList.remove('panel-dragging');
            }
        }

        setupPanelButtons() {
            const minimizeBtn = document.getElementById('minimize-btn');
            const closeBtn = document.getElementById('close-btn');
            const content = document.getElementById('panel-content');
            const panel = document.getElementById('advanced-physics-panel');

            let isMinimized = false;

            // BOTÓN MINIMIZAR
            minimizeBtn?.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!panel) return;

                if (!isMinimized) {
                    content.style.display = 'none';
                    panel.style.height = 'auto';
                    minimizeBtn.innerHTML = '+';
                    isMinimized = true;
                    this.showFeedback('📱 NBA Panel Minimized', '#FF8C00');
                } else {
                    content.style.display = 'block';
                    panel.style.height = 'auto';
                    minimizeBtn.innerHTML = '−';
                    isMinimized = false;
                    this.showFeedback('📱 NBA Panel Restored', '#FF8C00');
                }
            });

            // BOTÓN CERRAR
            closeBtn?.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!panel) return;

                if (confirm('¿Estás seguro de que quieres cerrar el panel de baloncesto NBA?')) {
                    if (this.isActive) {
                        this.stopPhysics();
                    }
                    panel.remove();
                    this.showFeedback('❌ NBA Basketball Panel Closed', '#ff4757');
                    console.log('🔴 NBA Basketball Panel closed by user');
                }
            });

            // Efectos hover
            [minimizeBtn, closeBtn].forEach(btn => {
                if (!btn) return;
                btn.addEventListener('mouseenter', () => btn.style.opacity = '0.8');
                btn.addEventListener('mouseleave', () => btn.style.opacity = '1');
            });
        }

        startAdvancedStatsMonitoring() {
            setInterval(() => {
                document.getElementById('object-count').textContent = this.physicsObjects.size;
                document.getElementById('goals-count').textContent = this.gameStats.totalBaskets;
                document.getElementById('collision-count').textContent = this.gameStats.totalCollisions;
                document.getElementById('max-speed').textContent = Math.round(this.gameStats.maxVelocityReached);
                document.getElementById('queue-count').textContent = commandQueue.length;

                const queueSize = commandQueue.length;
                const performanceElement = document.getElementById('performance');
                if (queueSize < 30) {
                    performanceElement.textContent = 'Optimal';
                    performanceElement.style.color = '#48bb78';
                } else if (queueSize < 150) {
                    performanceElement.textContent = 'Good';
                    performanceElement.style.color = '#ed8936';
                } else {
                    performanceElement.textContent = 'Overloaded';
                    performanceElement.style.color = '#f56565';
                }
            }, 1000);
        }

        showFeedback(message, color) {
            // Remove existing feedback
            const existingFeedback = document.querySelector('.feedback-div');
            if (existingFeedback) existingFeedback.remove();

            const feedback = document.createElement('div');
            feedback.className = 'feedback-div';
            feedback.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: ${color};
                color: white;
                padding: 15px 25px;
                border-radius: 10px;
                font-weight: bold;
                z-index: 2147483648;
                font-size: 16px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                opacity: 0;
                transition: opacity 0.3s ease-in-out;
                text-align: center;
                min-width: 300px;
                border: 2px solid rgba(255,255,255,0.3);
            `;
            feedback.innerHTML = message;

            document.body.appendChild(feedback);
            setTimeout(() => feedback.style.opacity = '1', 10);
            setTimeout(() => feedback.style.opacity = '0', 2500);
            setTimeout(() => feedback.remove(), 2800);
        }
    }

    /* ---------- GLOBAL INITIALIZATION ---------- */
    let basketballEngine = null;

    const initNBABasketballEngine = () => {
        if (!basketballEngine) {
            console.log('🏀 Initializing Advanced NBA Basketball Physics Engine v6.1...');
            basketballEngine = new AdvancedDrawariaBasketball();

            setTimeout(() => {
                const confirmMsg = document.createElement('div');
                confirmMsg.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: linear-gradient(45deg, #FF8C00, #FF6347);
                    color: white;
                    padding: 25px 35px;
                    border-radius: 20px;
                    font-size: 18px;
                    font-weight: bold;
                    z-index: 2147483648;
                    text-align: center;
                    box-shadow: 0 0 40px rgba(255,140,0,0.6);
                    opacity: 0;
                    transition: opacity 0.3s ease-in-out;
                    border: 3px solid #FFD700;
                `;
                confirmMsg.innerHTML = `
                    🏀 NBA BASKETBALL ENGINE v6.1 LOADED! 🏀<br>
                    <div style="font-size: 14px; margin-top: 10px; color: #FFE6D1;">
                        ✅ Professional NBA Court<br>
                        🏀 Advanced Physics System<br>
                        🎯 Match Mode & Possession<br>
                        🏗️ Support Poles & Official Lines<br>
                        🏆 Complete Scoring System
                    </div>
                `;

                document.body.appendChild(confirmMsg);
                setTimeout(() => confirmMsg.style.opacity = '1', 10);
                setTimeout(() => confirmMsg.style.opacity = '0', 4000);
                setTimeout(() => confirmMsg.remove(), 4300);
            }, 1000);
        }
    };

    // Enhanced CSS animations for NBA basketball
    const nbaBasketballStyle = document.createElement('style');
    nbaBasketballStyle.textContent = `
        @keyframes nba-bounce-effect {
            0% { transform: scale(0) rotate(0deg); opacity: 1; }
            50% { transform: scale(1.2) rotate(180deg); opacity: 0.8; }
            100% { transform: scale(0) rotate(360deg); opacity: 0; }
        }

        @keyframes nba-pulse-effect {
            0% { transform: scale(0.5); opacity: 0.8; }
            50% { transform: scale(1.3); opacity: 0.6; }
            100% { transform: scale(0); opacity: 0; }
        }

        @keyframes nba-dribble {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }

        .toggle-btn[data-active="true"] {
            box-shadow: 0 0 15px rgba(255, 140, 0, 0.6) !important;
        }

        .mode-toggle[data-active="true"] {
            box-shadow: 0 0 15px rgba(255, 215, 0, 0.8) !important;
        }

        #advanced-physics-panel {
            transition: none !important;
        }

        #panel-header:hover {
            background: linear-gradient(45deg, #FF6347, #FF4500) !important;
        }

        #minimize-btn:hover {
            background: rgba(255,255,255,0.4) !important;
        }

        #close-btn:hover {
            background: rgba(255,0,0,0.8) !important;
        }

        .panel-dragging {
            user-select: none !important;
            pointer-events: none !important;
            opacity: 0.9;
        }

        /* NBA court styling */
        .nba-basketball-court {
            background: linear-gradient(45deg, ${NBA_COURT_CONSTANTS.COURT_COLOR}, #CD853F);
        }

        .basketball-possession {
            animation: nba-dribble 0.8s infinite ease-in-out;
        }

        /* NBA match mode styling */
        .nba-match-active {
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
        }

        /* NBA scoring animation */
        .nba-score-animation {
            animation: nba-pulse-effect 2s ease-out;
        }

        /* Professional NBA panel styling */
        .nba-professional-panel {
            background: linear-gradient(135deg, #0f0f23, #1a1a3a, #2a1810);
            border: 3px solid ${NBA_COURT_CONSTANTS.COURT_COLOR};
        }
    `;
    document.head.appendChild(nbaBasketballStyle);

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNBABasketballEngine);
    } else {
        initNBABasketballEngine();
    }

    // Backup initialization
    setTimeout(initNBABasketballEngine, 2000);

    // Console welcome message
    console.log(`
    🏀============================================🏀
    🏆    NBA BASKETBALL PHYSICS ENGINE v6.1    🏆
    🏀============================================🏀

    ✅ Professional NBA Court Creation
    🏀 Advanced Physics System
    🎯 Match Mode with Scoring
    🏗️ Support Poles & Official Lines
    🏆 Complete Possession System

    Ready to play! Click the 🏀 button to start.
    🏀============================================🏀
    `);

})();
