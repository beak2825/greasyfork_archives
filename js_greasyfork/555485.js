// ==UserScript==
// @name         Drawaria Movements Epic
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Caminata con elección inteligente de dirección y nueva interfaz
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555485/Drawaria%20Movements%20Epic.user.js
// @updateURL https://update.greasyfork.org/scripts/555485/Drawaria%20Movements%20Epic.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let drawariaSocket = null;
    let drawariaCanvas = null;
    let drawariaCtx = null;

    // Command queue system
    const commandQueue = [];
    let batchProcessor = null;
    const BATCH_SIZE = 12;
    const BATCH_INTERVAL = 45;

    // WebSocket interception
    const originalWebSocketSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (...args) {
        if (!drawariaSocket && this.url && this.url.includes('drawaria')) {
            drawariaSocket = this;
            console.log('🔗 WebSocket de Drawaria capturado para la animación.');
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
                try { drawariaSocket.send(cmd); } catch (e) { console.warn('Fallo al enviar comando:', e); }
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

        // Render on canvas for immediate feedback (only if context exists)
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

    /* ---------- AUTONOMOUS WALKING STICKMAN ANIMATION SYSTEM ---------- */
    class WalkingStickmanAnimation {
        constructor() {
            this.initialized = false;
            this.isActive = false;
            this.animationId = null;
            this.lastRenderTime = 0;
            this.renderInterval = 1000 / 30; // 30 FPS

            // Walking parameters - Mantenemos las proporciones épicas
            this.walker = {
                x: 400,
                y: 300,
                speed: 2,
                direction: 1,
                verticalDirection: 0,
                bodyHeight: 50,
                legLength: 80,
                thighLength: 45,
                shinLength: 35,
                armLength: 60,
                upperArmLength: 35,
                forearmLength: 25,
                animationPhase: 0,
                animationSpeed: 0.1,
                isStopped: false,
                stopTimer: 0,
                lastDirectionChange: 0,
                movementMode: 'auto',
                decisionTimer: 0,
                decisionInterval: 90,
                cornerAvoidance: true
            };

            this.controls = {
                showDebug: false,
                walkingSpeed: 2,
                animationSpeed: 0.1,
                lineThickness: 4,
                stopProbability: 0.005, // 0.5% chance to stop each frame
                minStopTime: 30, // frames
                maxStopTime: 90, // frames
                directionChangeProbability: 0.3,
                decisionFrequency: 90
            };

            this.stepCount = 0;
            this.stopCount = 0;
            this.directionChangeCount = 0;
            this.isPanelHidden = false;
            this.isSettingsExpanded = false;

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
                    this.createControlPanel();
                    this.createToggleButton();
                    this.setupKeyboardControls();
                    console.log('🚶 Animación de Stickman Caminante Autónomo inicializada');
                } else {
                    setTimeout(checkGameReady, 100);
                }
            };
            checkGameReady();
        }

        createControlPanel() {
            const existingPanel = document.getElementById('walking-animation-panel');
            if (existingPanel) existingPanel.remove();

            const panel = document.createElement('div');
            panel.id = 'walking-animation-panel';
            panel.style.cssText = `
                position: fixed !important;
                top: 20px !important;
                right: 20px !important;
                width: 320px !important;
                z-index: 2147483646 !important;
                background: linear-gradient(135deg, #1a1a2e, #2e1a3a) !important; /* Nuevo fondo oscuro */
                border: 2px solid #00bcd4 !important; /* Nuevo color de acento (cian) */
                border-radius: 15px !important;
                color: white !important;
                font-family: 'Segoe UI', Arial, sans-serif !important;
                overflow: hidden !important;
                box-shadow: 0 0 30px rgba(0, 188, 212, 0.4) !important;
                transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out !important;
            `;

            const header = document.createElement('div');
            header.style.cssText = `
                background: linear-gradient(45deg, #00bcd4, #008394) !important; /* Nuevo degradado */
                padding: 12px 20px !important;
                font-weight: bold !important;
                text-align: center !important;
                font-size: 16px !important;
                cursor: move !important;
                user-select: none !important;
                position: relative !important;
            `;
            header.innerHTML = `
                🤖 MOVIMIENTOS ÉPICOS
                <button id="hide-panel" style="
                    position: absolute !important;
                    right: 10px !important;
                    top: 50% !important;
                    transform: translateY(-50%) !important;
                    background: rgba(255,255,255,0.2) !important;
                    border: none !important;
                    color: white !important;
                    border-radius: 5px !important;
                    width: 24px !important;
                    height: 24px !important;
                    cursor: pointer !important;
                    font-size: 12px !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                ">─</button>
            `;

            const content = document.createElement('div');
            content.id = 'panel-content-wrapper';
            content.style.cssText = `padding: 20px !important;`;
            content.innerHTML = `
                <!-- CONTROL PRINCIPAL -->
                <div style="margin-bottom: 15px; text-align: center;">
                    <button id="toggle-walking" style="
                        width: 100%;
                        padding: 12px;
                        background: linear-gradient(135deg, #00bcd4, #008394);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: bold;
                        box-shadow: 0 4px 10px rgba(0, 188, 212, 0.3);
                        transition: all 0.2s;
                    ">🤖 Iniciar Autónomo</button>
                </div>

                <!-- MODO DE CONTROL Y ESTADÍSTICAS HORIZONTALES -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <!-- MOVEMENT MODE -->
                    <div style="flex-grow: 1; margin-right: 10px;">
                        <label style="display: block; margin-bottom: 5px; font-size: 11px; color: #00bcd4;">
                            🎮 Modo de Control:
                        </label>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                            <button id="mode-auto" style="
                                padding: 8px;
                                background: linear-gradient(135deg, #00bcd4, #008394);
                                color: white;
                                border: none;
                                border-radius: 6px;
                                cursor: pointer;
                                font-size: 11px;
                            ">🤖 Autónomo</button>
                            <button id="mode-manual" style="
                                padding: 8px;
                                background: linear-gradient(135deg, #2d3748, #1a1a2e);
                                color: white;
                                border: 1px solid #4a5568;
                                border-radius: 6px;
                                cursor: pointer;
                                font-size: 11px;
                            ">🎮 Manual</button>
                        </div>
                    </div>

                    <!-- STATS COMPACTAS -->
                    <div id="walking-stats" style="
                        background: rgba(0,0,0,0.3);
                        padding: 8px;
                        border-radius: 6px;
                        font-size: 10px;
                        text-align: left;
                        border: 1px solid rgba(0, 188, 212, 0.3);
                        width: 120px;
                    ">
                        <div style="white-space: nowrap;">Pos: <span id="position-x">400</span>, <span id="position-y">300</span></div>
                        <div style="white-space: nowrap;">Est: <span id="walker-state">Explorando</span></div>
                        <div style="white-space: nowrap;">Dir: <span id="movement-direction">→</span></div>
                    </div>
                </div>

                <!-- CONTROLES MANUALES (MÁS COMPACTOS) -->
                <div id="manual-controls" style="margin-bottom: 15px; display: none; border-top: 1px dashed rgba(0, 188, 212, 0.3); padding-top: 15px;">
                    <label style="display: block; margin-bottom: 8px; font-size: 12px; color: #00bcd4; text-align: center;">
                        🎮 Controles Manuales:
                    </label>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; max-width: 160px; margin: 0 auto;">
                        <div></div>
                        <button id="move-up" class="manual-btn" style="padding: 10px; background: linear-gradient(135deg, #4299e1, #3182ce); color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px;">⬆️</button>
                        <div></div>
                        <button id="move-left" class="manual-btn" style="padding: 10px; background: linear-gradient(135deg, #4299e1, #3182ce); color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px;">⬅️</button>
                        <button id="move-stop" style="padding: 10px; background: linear-gradient(135deg, #ff6b6b, #e63946); color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: bold;">⏹️ Parar</button>
                        <button id="move-right" class="manual-btn" style="padding: 10px; background: linear-gradient(135deg, #4299e1, #3182ce); color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px;">➡️</button>
                        <div></div>
                        <button id="move-down" class="manual-btn" style="padding: 10px; background: linear-gradient(135deg, #4299e1, #3182ce); color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px;">⬇️</button>
                        <div></div>
                    </div>
                    <div style="text-align: center; font-size: 9px; color: rgba(255,255,255,0.6); margin-top: 5px;">
                        O usa Teclas de Dirección + Espacio para parar
                    </div>
                </div>

                <!-- SECCIÓN DE AJUSTES COLAPSIBLE -->
                <div style="margin-top: 20px; border-top: 1px solid #00bcd4; padding-top: 15px;">
                    <div id="settings-toggle-header" style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: bold;
                        color: #00bcd4;
                        margin-bottom: 10px;
                    ">
                        <span>🛠️ Ajustes Avanzados</span>
                        <span id="settings-toggle-icon">▼</span>
                    </div>

                    <div id="advanced-settings-content" style="display: none; transition: height 0.3s ease;">
                        <!-- GRUPO DE VELOCIDAD Y ANIMACIÓN -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                            <div>
                                <label style="display: block; margin-bottom: 5px; font-size: 11px; color: #00bcd4;">
                                    🏃 Velocidad de Caminata:
                                </label>
                                <input type="range" id="walking-speed" min="1" max="10" value="2" step="0.5" style="width: 100%;">
                                <div style="display: flex; justify-content: space-between; font-size: 9px;">
                                    <span>Lento</span>
                                    <span id="speed-value">2</span>
                                    <span>Rápido</span>
                                </div>
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 5px; font-size: 11px; color: #00bcd4;">
                                    🔄 Velocidad de Animación:
                                </label>
                                <input type="range" id="animation-speed" min="0.05" max="0.3" value="0.1" step="0.05" style="width: 100%;">
                                <div style="display: flex; justify-content: space-between; font-size: 9px;">
                                    <span>Lento</span>
                                    <span id="anim-speed-value">0.1</span>
                                    <span>Rápido</span>
                                </div>
                            </div>
                        </div>

                        <!-- GROSOR DE LÍNEA Y INFO DEPURACIÓN -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px; align-items: start;">
                            <div>
                                <label style="display: block; margin-bottom: 5px; font-size: 11px; color: #00bcd4;">
                                    📏 Grosor de Línea:
                                </label>
                                <input type="range" id="line-thickness" min="2" max="8" value="4" step="1" style="width: 100%;">
                                <div style="display: flex; justify-content: space-between; font-size: 9px;">
                                    <span>Fino</span>
                                    <span id="thickness-value">4</span>
                                    <span>Grueso</span>
                                </div>
                            </div>
                            <div style="margin-top: 10px;">
                                <label style="display: flex; align-items: center; font-size: 11px; color: #00bcd4; cursor: pointer;">
                                    <input type="checkbox" id="debug-toggle" style="margin-right: 8px; transform: scale(1.2);">
                                    🔧 Mostrar Info de Depuración
                                </label>
                            </div>
                        </div>

                        <!-- AJUSTES DE COMPORTAMIENTO (IA) -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                            <div>
                                <label style="display: block; margin-bottom: 5px; font-size: 11px; color: #00bcd4;">
                                    🧠 Frecuencia de Decisión:
                                </label>
                                <input type="range" id="decision-frequency" min="30" max="180" value="90" step="15" style="width: 100%;">
                                <div style="display: flex; justify-content: space-between; font-size: 9px;">
                                    <span>Frecuente</span>
                                    <span id="decision-value">90</span>
                                    <span>Raro</span>
                                </div>
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 5px; font-size: 11px; color: #00bcd4;">
                                    ⏸️ Probabilidad de Parada:
                                </label>
                                <input type="range" id="stop-probability" min="0" max="20" value="5" step="1" style="width: 100%;">
                                <div style="display: flex; justify-content: space-between; font-size: 9px;">
                                    <span>Nunca</span>
                                    <span id="stop-prob-value">0.5%</span>
                                    <span>A menudo</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <!-- HELP TEXT -->
                <div style="
                    text-align: center;
                    font-size: 9px;
                    color: rgba(255,255,255,0.6);
                    border-top: 1px solid rgba(255,255,255,0.1);
                    padding-top: 10px;
                    margin-top: 5px;
                ">
                    Caminata autónoma inteligente con evasión de esquinas<br>
                    Creado por YouTubeDrawaria
                </div>
            `;

            panel.appendChild(header);
            panel.appendChild(content);
            document.body.appendChild(panel);

            this.setupEventListeners();
            this.makePanelDraggable();
            this.updateModeDisplay();
        }

        createToggleButton() {
            // Lógica de creación del botón de alternancia (minimizar/maximizar panel)
            // Se mantiene igual, pero con el nuevo estilo de color
            const existingToggle = document.getElementById('panel-toggle-button');
            if (existingToggle) existingToggle.remove();

            const toggleButton = document.createElement('button');
            toggleButton.id = 'panel-toggle-button';
            toggleButton.innerHTML = '⚙️';
            toggleButton.style.cssText = `
                position: fixed !important;
                top: 20px !important;
                right: 20px !important;
                width: 50px !important;
                height: 50px !important;
                z-index: 2147483647 !important;
                background: linear-gradient(135deg, #00bcd4, #008394) !important;
                border: 2px solid #ffffff !important;
                border-radius: 50% !important;
                color: white !important;
                font-size: 20px !important;
                cursor: pointer !important;
                box-shadow: 0 4px 15px rgba(0,0,0,0.3) !important;
                transition: all 0.3s ease !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
            `;

            toggleButton.addEventListener('mouseenter', () => {
                toggleButton.style.transform = 'scale(1.1)';
                toggleButton.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
            });

            toggleButton.addEventListener('mouseleave', () => {
                if (!this.isPanelHidden) {
                    toggleButton.style.transform = 'scale(1)';
                    toggleButton.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
                }
            });

            toggleButton.addEventListener('click', () => {
                this.togglePanel();
            });

            document.body.appendChild(toggleButton);
        }

        setupKeyboardControls() {
            document.addEventListener('keydown', (e) => {
                if (!this.isActive || this.walker.movementMode !== 'manual') return;

                // Prevenir el desplazamiento de la página con las teclas de flecha
                if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                     e.preventDefault();
                }

                switch(e.key) {
                    case 'ArrowLeft':
                        this.setManualDirection(-1, 0);
                        break;
                    case 'ArrowRight':
                        this.setManualDirection(1, 0);
                        break;
                    case 'ArrowUp':
                        this.setManualDirection(0, -1);
                        break;
                    case 'ArrowDown':
                        this.setManualDirection(0, 1);
                        break;
                    case ' ':
                        this.stopMovement();
                        break;
                }
                this.updateStats();
            });

            document.addEventListener('keyup', (e) => {
                if (this.walker.movementMode === 'manual' && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                    // En modo manual, la dirección se mantiene hasta una parada explícita o cambio.
                }
            });
        }

        setupEventListeners() {
            document.getElementById('toggle-walking')?.addEventListener('click', () => this.toggleWalking());

            // Mode buttons
            document.getElementById('mode-auto')?.addEventListener('click', () => this.setMovementMode('auto'));
            document.getElementById('mode-manual')?.addEventListener('click', () => this.setMovementMode('manual'));

            // Manual movement buttons
            document.getElementById('move-left')?.addEventListener('click', () => this.setManualDirection(-1, 0));
            document.getElementById('move-right')?.addEventListener('click', () => this.setManualDirection(1, 0));
            document.getElementById('move-up')?.addEventListener('click', () => this.setManualDirection(0, -1));
            document.getElementById('move-down')?.addEventListener('click', () => this.setManualDirection(0, 1));
            document.getElementById('move-stop')?.addEventListener('click', () => this.stopMovement());

            // Settings Toggle
            document.getElementById('settings-toggle-header')?.addEventListener('click', () => this.toggleSettingsExpansion());

            document.getElementById('debug-toggle')?.addEventListener('change', (e) => {
                this.controls.showDebug = e.target.checked;
            });

            // Hide panel button
            document.getElementById('hide-panel')?.addEventListener('click', (e) => {
                e.stopPropagation();
                this.togglePanel();
            });

            // Speed controls
            document.getElementById('walking-speed')?.addEventListener('input', (e) => {
                this.controls.walkingSpeed = parseFloat(e.target.value);
                document.getElementById('speed-value').textContent = this.controls.walkingSpeed;
            });

            document.getElementById('animation-speed')?.addEventListener('input', (e) => {
                this.controls.animationSpeed = parseFloat(e.target.value);
                document.getElementById('anim-speed-value').textContent = this.controls.animationSpeed;
            });

            // AI settings
            document.getElementById('decision-frequency')?.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                this.controls.decisionFrequency = value;
                this.walker.decisionInterval = value;
                document.getElementById('decision-value').textContent = value;
            });

            // Thickness control
            document.getElementById('line-thickness')?.addEventListener('input', (e) => {
                this.controls.lineThickness = parseInt(e.target.value);
                document.getElementById('thickness-value').textContent = this.controls.lineThickness;
            });

            // Behavior controls
            document.getElementById('stop-probability')?.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                this.controls.stopProbability = value / 1000;
                document.getElementById('stop-prob-value').textContent = `${(value / 10).toFixed(1)}%`;
            });

            // Canvas click to set position
            if (this.canvasElement) {
                this.canvasElement.addEventListener('click', (e) => {
                    if (this.isPanelHidden) return; // Evitar clics accidentales si el panel está oculto
                    const rect = this.canvasElement.getBoundingClientRect();
                    this.walker.x = e.clientX - rect.left;
                    this.walker.y = e.clientY - rect.top;
                    this.updateStats();
                });
            }
        }

        toggleSettingsExpansion() {
            this.isSettingsExpanded = !this.isSettingsExpanded;
            const content = document.getElementById('advanced-settings-content');
            const icon = document.getElementById('settings-toggle-icon');

            if (this.isSettingsExpanded) {
                content.style.display = 'block';
                icon.textContent = '▲';
            } else {
                content.style.display = 'none';
                icon.textContent = '▼';
            }
        }

        setMovementMode(mode) {
            this.walker.movementMode = mode;
            this.updateModeDisplay();

            if (mode === 'auto') {
                this.walker.isStopped = false;
                this.showFeedback('🤖 Modo Autónomo Activado', '#00bcd4');
            } else {
                this.walker.isStopped = true; // Empieza parado en manual hasta que se mueva
                this.walker.verticalDirection = 0;
                this.showFeedback('🎮 Modo Manual Activado', '#4299e1');
            }

            this.updateStats();
        }

        updateModeDisplay() {
            const manualControls = document.getElementById('manual-controls');
            const autoBtn = document.getElementById('mode-auto');
            const manualBtn = document.getElementById('mode-manual');

            if (this.walker.movementMode === 'auto') {
                manualControls.style.display = 'none';
                autoBtn.style.background = 'linear-gradient(135deg, #00bcd4, #008394)';
                manualBtn.style.background = 'linear-gradient(135deg, #2d3748, #1a1a2e)';
                manualBtn.style.border = '1px solid #4a5568';
            } else {
                manualControls.style.display = 'block';
                autoBtn.style.background = 'linear-gradient(135deg, #2d3748, #1a1a2e)';
                autoBtn.style.border = '1px solid #4a5568';
                manualBtn.style.background = 'linear-gradient(135deg, #4299e1, #3182ce)';
                manualBtn.style.border = 'none';
            }
        }

        setManualDirection(horizontal, vertical) {
            this.walker.direction = horizontal !== 0 ? horizontal : this.walker.direction;
            this.walker.verticalDirection = vertical;
            this.walker.isStopped = false;
            this.updateStats();
        }

        stopMovement() {
            this.walker.verticalDirection = 0;
            this.walker.isStopped = true;
            this.showFeedback('⏹️ Movimiento Detenido', '#ff6b6b');
            this.updateStats();
        }

        makeAutonomousDecision() {
            // Lógica de decisión autónoma (se mantiene igual, ya que es funcional)
            if (this.walker.movementMode !== 'auto' || this.walker.isStopped) return;

            const margin = 50;
            const { x, y } = this.walker;
            const { width, height } = this.canvasElement;
            const nearLeft = x < margin * 2;
            const nearRight = x > width - margin * 2;
            const nearTop = y < margin * 2;
            const nearBottom = y > height - margin * 2;

            if (this.walker.cornerAvoidance) {
                // Evasión de esquinas (prioridad)
                if (nearLeft && nearTop) {
                    this.walker.direction = 1;
                    this.walker.verticalDirection = Math.random() > 0.5 ? 1 : 0;
                    return;
                }
                if (nearRight && nearTop) {
                    this.walker.direction = -1;
                    this.walker.verticalDirection = Math.random() > 0.5 ? 1 : 0;
                    return;
                }
                if (nearLeft && nearBottom) {
                    this.walker.direction = 1;
                    this.walker.verticalDirection = Math.random() > 0.5 ? -1 : 0;
                    return;
                }
                if (nearRight && nearBottom) {
                    this.walker.direction = -1;
                    this.walker.verticalDirection = Math.random() > 0.5 ? -1 : 0;
                    return;
                }
            }

            // Evasión de bordes
            if (nearLeft) {
                this.walker.direction = 1;
                this.walker.verticalDirection = Math.random() < 0.3 ? (Math.random() > 0.5 ? 1 : -1) : 0;
            } else if (nearRight) {
                this.walker.direction = -1;
                this.walker.verticalDirection = Math.random() < 0.3 ? (Math.random() > 0.5 ? 1 : -1) : 0;
            } else if (nearTop) {
                this.walker.verticalDirection = 1;
                this.walker.direction = Math.random() < 0.3 ? (Math.random() > 0.5 ? 1 : -1) : this.walker.direction;
            } else if (nearBottom) {
                this.walker.verticalDirection = -1;
                this.walker.direction = Math.random() < 0.3 ? (Math.random() > 0.5 ? 1 : -1) : this.walker.direction;
            } else {
                // Movimiento aleatorio
                if (Math.random() < 0.3) {
                    this.walker.direction = Math.random() > 0.5 ? 1 : -1;
                }
                if (Math.random() < 0.3) {
                    this.walker.verticalDirection = Math.random() > 0.5 ? 1 : -1;
                }
                if (Math.random() < 0.4) {
                    this.walker.verticalDirection = 0;
                }
            }

            if (this.walker.direction === 0 && this.walker.verticalDirection === 0) {
                this.walker.direction = Math.random() > 0.5 ? 1 : -1;
            }
        }

        togglePanel() {
            // Lógica de alternancia del panel (minimizar/maximizar)
            const panel = document.getElementById('walking-animation-panel');
            const toggleButton = document.getElementById('panel-toggle-button');

            if (this.isPanelHidden) {
                panel.style.transform = 'translateX(0)';
                panel.style.opacity = '1';
                toggleButton.innerHTML = '⚙️';
                toggleButton.style.background = 'linear-gradient(135deg, #00bcd4, #008394)';
                toggleButton.style.transform = 'scale(1)';
            } else {
                panel.style.transform = 'translateX(400px)';
                panel.style.opacity = '0';
                toggleButton.innerHTML = '←';
                toggleButton.style.background = 'linear-gradient(135deg, #4299e1, #3182ce)';
                toggleButton.style.transform = 'scale(1.1)';
            }

            this.isPanelHidden = !this.isPanelHidden;
        }

        toggleWalking() {
            const toggleBtn = document.getElementById('toggle-walking');

            if (!this.isActive) {
                this.startWalking();
                if (toggleBtn) {
                    toggleBtn.textContent = '🛑 Detener Movimiento';
                    toggleBtn.style.background = 'linear-gradient(135deg, #ff6b6b, #e63946)';
                    toggleBtn.style.boxShadow = '0 4px 10px rgba(255, 107, 107, 0.3)';
                }
                this.showFeedback('🤖 Caminata Autónoma Iniciada!', '#00bcd4');
            } else {
                this.stopWalking();
                if (toggleBtn) {
                    toggleBtn.textContent = '🤖 Iniciar Autónomo';
                    toggleBtn.style.background = 'linear-gradient(135deg, #00bcd4, #008394)';
                    toggleBtn.style.boxShadow = '0 4px 10px rgba(0, 188, 212, 0.3)';
                }
                this.showFeedback('🛑 Movimiento Detenido', '#ff6b6b');
            }
        }

        startWalking() {
            if (this.isActive) return;
            this.isActive = true;
            this.lastRenderTime = 0;
            this.stepCount = 0;
            this.stopCount = 0;
            this.directionChangeCount = 0;
            this.walker.isStopped = false;
            this.walker.decisionTimer = 0;
            // Asegura que el modo automático se inicie con movimiento
            if (this.walker.movementMode === 'auto') {
                this.makeAutonomousDecision();
            }
            this.startAnimationLoop();
        }

        stopWalking() {
            this.isActive = false;
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
                this.animationId = null;
            }
            this.clearWalker();
        }

        startAnimationLoop() {
            if (!this.isActive) return;

            const currentTime = performance.now();
            if (currentTime - this.lastRenderTime >= this.renderInterval) {
                this.updateWalker();
                this.renderWalker();
                this.lastRenderTime = currentTime;
            }

            this.animationId = requestAnimationFrame(() => this.startAnimationLoop());
        }

        updateWalker() {
            // Lógica de movimiento y paro (se mantiene funcional)
            // ... (código updateWalker se mantiene, solo se ajustan las referencias de `controls` y `walker`)

             // Autonomous decision making
            if (this.walker.movementMode === 'auto') {
                this.walker.decisionTimer++;
                if (this.walker.decisionTimer >= this.walker.decisionInterval) {
                    this.makeAutonomousDecision();
                    this.walker.decisionTimer = 0;
                }
            }

            // Handle stopping behavior
            if (this.walker.isStopped) {
                this.walker.stopTimer--;
                if (this.walker.stopTimer <= 0) {
                    this.walker.isStopped = false;
                    if (this.walker.movementMode === 'auto' && Math.random() < this.controls.directionChangeProbability) {
                        this.makeAutonomousDecision();
                        this.directionChangeCount++;
                    }
                }
                return;
            }

            // Chance to stop randomly (auto mode only)
            if (this.walker.movementMode === 'auto' && !this.walker.isStopped && Math.random() < this.controls.stopProbability) {
                this.walker.isStopped = true;
                this.walker.stopTimer = this.controls.minStopTime +
                    Math.random() * (this.controls.maxStopTime - this.controls.minStopTime);
                this.stopCount++;
                return;
            }

            // Update animation phase only when moving
            this.walker.animationPhase += this.controls.animationSpeed;
            if (this.walker.animationPhase >= Math.PI * 2) {
                this.walker.animationPhase = 0;
                this.stepCount++;
            }

            // Move walker in both directions
            const newX = this.walker.x + this.controls.walkingSpeed * this.walker.direction;
            const newY = this.walker.y + this.controls.walkingSpeed * this.walker.verticalDirection;

            // Boundary checking - stay within canvas
            const margin = 50;
            let hitBoundary = false;

            if (newX > this.canvasElement.width - margin) {
                this.walker.x = this.canvasElement.width - margin;
                if (this.walker.movementMode === 'auto') this.makeAutonomousDecision();
                hitBoundary = true;
            } else if (newX < margin) {
                this.walker.x = margin;
                if (this.walker.movementMode === 'auto') this.makeAutonomousDecision();
                hitBoundary = true;
            } else {
                this.walker.x = newX;
            }

            if (newY > this.canvasElement.height - margin) {
                this.walker.y = this.canvasElement.height - margin;
                if (this.walker.movementMode === 'auto') this.makeAutonomousDecision();
                hitBoundary = true;
            } else if (newY < margin) {
                this.walker.y = margin;
                if (this.walker.movementMode === 'auto') this.makeAutonomousDecision();
                hitBoundary = true;
            } else {
                this.walker.y = newY;
            }

            this.updateStats();
        }

        renderWalker() {
            // Lógica de renderizado (se mantiene funcional)
            this.clearWalkerArea();

            const { x, y, bodyHeight, thighLength, shinLength, upperArmLength, forearmLength, animationPhase, direction, isStopped } = this.walker;
            const color = '#000000';
            const thickness = this.controls.lineThickness;

            const currentPhase = isStopped ? Math.PI * 0.25 : animationPhase;

            // Body
            const bodyY = y - bodyHeight;
            this.drawLine(x, bodyY, x, y, color, thickness);

            const shouldersX = x;
            const shouldersY = bodyY;
            const hipsX = x;
            const hipsY = y;

            // LEFT LEG
            const leftLegPhase = currentPhase;
            const leftHipAngle = Math.sin(leftLegPhase) * 0.6;
            const leftKneeAngle = Math.sin(leftLegPhase + Math.PI * 0.2) * 0.4;

            const leftThighEndX = hipsX + Math.sin(leftHipAngle) * thighLength * direction;
            const leftThighEndY = hipsY + Math.cos(leftHipAngle) * thighLength;
            const leftShinEndX = leftThighEndX + Math.sin(leftHipAngle + leftKneeAngle) * shinLength * direction;
            const leftShinEndY = leftThighEndY + Math.cos(leftHipAngle + leftKneeAngle) * shinLength;

            this.drawLine(hipsX, hipsY, leftThighEndX, leftThighEndY, color, thickness);
            this.drawLine(leftThighEndX, leftThighEndY, leftShinEndX, leftShinEndY, color, thickness);

            // RIGHT LEG
            const rightLegPhase = currentPhase + Math.PI;
            const rightHipAngle = Math.sin(rightLegPhase) * 0.6;
            const rightKneeAngle = Math.sin(rightLegPhase + Math.PI * 0.2) * 0.4;

            const rightThighEndX = hipsX + Math.sin(rightHipAngle) * thighLength * direction;
            const rightThighEndY = hipsY + Math.cos(rightHipAngle) * thighLength;
            const rightShinEndX = rightThighEndX + Math.sin(rightHipAngle + rightKneeAngle) * shinLength * direction;
            const rightShinEndY = rightThighEndY + Math.cos(rightHipAngle + rightKneeAngle) * shinLength;

            this.drawLine(hipsX, hipsY, rightThighEndX, rightThighEndY, color, thickness);
            this.drawLine(rightThighEndX, rightThighEndY, rightShinEndX, rightShinEndY, color, thickness);

            // LEFT ARM
            const leftArmPhase = currentPhase + Math.PI;
            const leftShoulderAngle = Math.sin(leftArmPhase) * 0.5;
            const leftElbowAngle = Math.sin(leftArmPhase + 0.3) * 0.3;

            const leftUpperArmEndX = shouldersX + Math.sin(leftShoulderAngle) * upperArmLength * direction;
            const leftUpperArmEndY = shouldersY + Math.cos(leftShoulderAngle) * upperArmLength;
            const leftForearmEndX = leftUpperArmEndX + Math.sin(leftShoulderAngle + leftElbowAngle) * forearmLength * direction;
            const leftForearmEndY = leftUpperArmEndY + Math.cos(leftShoulderAngle + leftElbowAngle) * forearmLength;

            this.drawLine(shouldersX, shouldersY, leftUpperArmEndX, leftUpperArmEndY, color, thickness);
            this.drawLine(leftUpperArmEndX, leftUpperArmEndY, leftForearmEndX, leftForearmEndY, color, thickness);

            // RIGHT ARM
            const rightArmPhase = currentPhase;
            const rightShoulderAngle = Math.sin(rightArmPhase) * 0.5;
            const rightElbowAngle = Math.sin(rightArmPhase + 0.3) * 0.3;

            const rightUpperArmEndX = shouldersX + Math.sin(rightShoulderAngle) * upperArmLength * direction;
            const rightUpperArmEndY = shouldersY + Math.cos(rightShoulderAngle) * upperArmLength;
            const rightForearmEndX = rightUpperArmEndX + Math.sin(rightShoulderAngle + rightElbowAngle) * forearmLength * direction;
            const rightForearmEndY = rightUpperArmEndY + Math.cos(rightShoulderAngle + rightElbowAngle) * forearmLength;

            this.drawLine(shouldersX, shouldersY, rightUpperArmEndX, rightUpperArmEndY, color, thickness);
            this.drawLine(rightUpperArmEndX, rightUpperArmEndY, rightForearmEndX, rightForearmEndY, color, thickness);

            // Head
            const headRadius = 18;
            this.drawCircle(x, bodyY - headRadius, headRadius, color, thickness);

            // Debug info
            if (this.controls.showDebug) {
                this.drawDebugInfo();
            }
        }

        drawLine(x1, y1, x2, y2, color, thickness) {
            enqueueDrawCommand(x1, y1, x2, y2, color, thickness);
        }

        drawCircle(x, y, radius, color, thickness) {
            const segments = 16;
            for (let i = 0; i < segments; i++) {
                const angle1 = (i / segments) * Math.PI * 2;
                const angle2 = ((i + 1) / segments) * Math.PI * 2;

                const x1 = x + Math.cos(angle1) * radius;
                const y1 = y + Math.sin(angle1) * radius;
                const x2 = x + Math.cos(angle2) * radius;
                const y2 = y + Math.sin(angle2) * radius;

                this.drawLine(x1, y1, x2, y2, color, thickness);
            }
        }

        clearWalkerArea() {
            // Se mantiene la lógica para limpiar el área del personaje
            const headRadius = 18;
            const legLength = this.walker.thighLength + this.walker.shinLength;
            const clearHeight = this.walker.bodyHeight + legLength + headRadius * 2 + 10;
            const clearWidth = 100;

            const clearX = this.walker.x - clearWidth / 2;
            const clearY = this.walker.y - clearHeight + legLength;
            const clearSize = Math.max(clearHeight, clearWidth) * 1.5;

            // Dibujar un gran cuadrado blanco sobre la zona
            this.drawLine(clearX, clearY, clearX + clearSize, clearY + clearSize, '#FFFFFF', clearSize);
        }

        drawDebugInfo() {
            // Lógica de información de depuración (se mantiene funcional con nuevos colores)
            const { x, y, bodyHeight, isStopped, direction, verticalDirection, movementMode } = this.walker;
            const debugColor = '#00bcd4'; // Cian/azul eléctrico para debug
            const debugThickness = 2;

            // Bounding box (simplificado)
            const debugY = y - bodyHeight - 25;
            this.drawLine(x - 50, debugY, x + 50, debugY, debugColor, debugThickness);

            // Movement direction indicator
            if ((direction !== 0 || verticalDirection !== 0) && !isStopped) {
                let arrowColor = movementMode === 'auto' ? '#ffeb3b' : '#4299e1'; // Amarillo para auto, Azul para manual
                this.drawLine(x, debugY - 20, x + direction * 20, debugY - 20 - verticalDirection * 20, arrowColor, 3);
            }

            // Mode indicator (circle)
            const modeColor = movementMode === 'auto' ? '#00bcd4' : '#4299e1';
            this.drawCircle(x, debugY - 40, 5, modeColor, 3);
        }

        updateStats() {
            // Lógica de actualización de estadísticas (textos en español)
            document.getElementById('position-x').textContent = Math.round(this.walker.x);
            document.getElementById('position-y').textContent = Math.round(this.walker.y);

            let stateText = '';
            if (this.walker.isStopped) {
                stateText = `Parado`;
            } else {
                stateText = this.walker.movementMode === 'auto' ? 'Explorando' : 'Caminando';
            }
            document.getElementById('walker-state').textContent = stateText;

            let directionSymbol = '';
            if (this.walker.verticalDirection < 0) directionSymbol = '↑';
            else if (this.walker.verticalDirection > 0) directionSymbol = '↓';

            if (this.walker.direction > 0) directionSymbol += '→';
            else if (this.walker.direction < 0) directionSymbol += '←';

            if (directionSymbol === '') directionSymbol = '●';

            document.getElementById('movement-direction').textContent = directionSymbol;
        }

        showFeedback(message, color) {
            // Lógica de feedback (se mantiene funcional con nuevos colores)
            const feedback = document.createElement('div');
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
                box-shadow: 0 4px 20px rgba(0,0,0,0.5);
                opacity: 0;
                transition: opacity 0.3s ease-in-out;
            `;
            feedback.innerHTML = message;

            document.body.appendChild(feedback);
            setTimeout(() => feedback.style.opacity = '1', 10);
            setTimeout(() => feedback.style.opacity = '0', 1500);
            setTimeout(() => feedback.remove(), 1800);
        }

        makePanelDraggable() {
            // Lógica para arrastrar el panel (se mantiene)
            const panel = document.getElementById('walking-animation-panel');
            const header = panel.querySelector('div');

            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

            header.onmousedown = dragMouseDown;

            function dragMouseDown(e) {
                e.preventDefault();
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;
            }

            function elementDrag(e) {
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
                panel.style.right = 'auto'; // Asegurarse de que 'right' se anule si se arrastra
            }

            function closeDragElement() {
                document.onmouseup = null;
                document.onmousemove = null;
            }
        }
    }

    /* ---------- GLOBAL INITIALIZATION ---------- */
    let walkingAnimation = null;

    const initWalkingAnimation = () => {
        if (!walkingAnimation) {
            console.log('🚶 Inicializando Animación de Caminata Autónoma...');
            walkingAnimation = new WalkingStickmanAnimation();
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWalkingAnimation);
    } else {
        initWalkingAnimation();
    }
    setTimeout(initWalkingAnimation, 2000);

    console.log('🚶 Animación de Stickman Caminante Autónomo cargada con éxito!');
})();