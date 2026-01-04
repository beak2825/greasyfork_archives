// ==UserScript==
// @name         Drawaria Sci-Fi Cockpit Mod
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Immersive and detailed recreation of a spacecraft cockpit (HMI) on Drawaria.online's canvas, featuring functional control systems and modular architecture.
// @author       YouTubeDrawaria
// @include	 https://drawaria.online/*
// @include	 https://*.drawaria.online/*
// @include      https://drawaria.online*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online/room/
// @connect      i.pinimg.com
// @connect      static.wikia.nocookie.net
// @connect      www.myinstants.com
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/551801/Drawaria%20Sci-Fi%20Cockpit%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/551801/Drawaria%20Sci-Fi%20Cockpit%20Mod.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* ---------- COMPONENTES DE INFRAESTRUCTURA DE DIBUJO ---------- */
    let drawariaSocket = null;
    let drawariaCanvas = null;
    let drawariaCtx = null;
    const commandQueue = [];
    let batchProcessor = null;
    const BATCH_SIZE = 12; // Aumentamos el lote para un dibujo más rápido
    const BATCH_INTERVAL = 50; // Intervalo más corto para mayor fluidez

    // 1. Interceptación del WebSocket
    const originalWebSocketSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function(...args) {
        if (!drawariaSocket && this.url && this.url.includes('drawaria')) {
            drawariaSocket = this;
            console.log('🔗 WebSocket de Drawaria capturado para la Cabina HMI.');
            startBatchProcessor();
        }
        return originalWebSocketSend.apply(this, args);
    };

    // 2. Procesador de Comandos por Lote (Batch Processor)
    function startBatchProcessor() {
        if (batchProcessor) return;
        batchProcessor = setInterval(() => {
            if (!drawariaSocket || drawariaSocket.readyState !== WebSocket.OPEN || commandQueue.length === 0) {
                return;
            }
            const batch = commandQueue.splice(0, BATCH_SIZE);
            batch.forEach(cmd => {
                try {
                    drawariaSocket.send(cmd);
                } catch (e) {
                    console.warn('⚠️ Fallo al enviar el comando de dibujo:', e);
                }
            });
        }, BATCH_INTERVAL);
    }

    /**
     * Envía un comando de dibujo al servidor (42["drawcmd",...]) y renderiza localmente.
     * @param {number} x1 - Coordenada X normalizada (0 a 1) o absoluta.
     * @param {number} y1 - Coordenada Y normalizada (0 a 1) o absoluta.
     * @param {number} x2 - Coordenada X destino.
     * @param {number} y2 - Coordenada Y destino.
     * @param {string} color - Color hexadecimal.
     * @param {number} thickness - Grosor de la línea. Negativo para simular formas rellenas.
     * @param {boolean} isArc - Si es un arco/círculo (usando x1, y1 como centro y thickness/2 como radio).
     * @param {number} startAngle - Ángulo inicial (en radianes).
     * @param {number} endAngle - Ángulo final (en radianes).
     */
    function enqueueDrawCommand(x1, y1, x2, y2, color, thickness, isArc = false, startAngle = 0, endAngle = 0) {
        if (!drawariaCanvas || !drawariaSocket) return;

        // Convertir coordenadas absolutas a normalizadas (0 a 1) para el servidor
        const normX1 = (x1 / drawariaCanvas.width).toFixed(4);
        const normY1 = (y1 / drawariaCanvas.height).toFixed(4);
        const normX2 = (x2 / drawariaCanvas.width).toFixed(4);
        const normY2 = (y2 / drawariaCanvas.height).toFixed(4);
        const isFill = thickness < 0;
        const absThickness = Math.abs(thickness);

        // 3. Renderizado Local (para feedback inmediato)
        if (drawariaCtx) {
            drawariaCtx.fillStyle = color;
            drawariaCtx.strokeStyle = color;
            drawariaCtx.lineWidth = absThickness;
            drawariaCtx.lineCap = isFill ? 'butt' : 'round';
            drawariaCtx.lineJoin = 'round';

            if (isArc) {
                // Simulación de arco rellenado o círculo
                drawariaCtx.beginPath();
                drawariaCtx.arc(x1, y1, absThickness / 2, startAngle, endAngle);
                drawariaCtx.closePath();
                drawariaCtx.fill();
            } else if (isFill) {
                 // Simulación de relleno: Dibujar un punto grande o línea muy gruesa
                drawariaCtx.beginPath();
                drawariaCtx.moveTo(x1, y1);
                drawariaCtx.lineTo(x2, y2);
                drawariaCtx.stroke();
            } else {
                // Línea normal
                drawariaCtx.beginPath();
                drawariaCtx.moveTo(x1, y1);
                drawariaCtx.lineTo(x2, y2);
                drawariaCtx.stroke();
            }
        }

        // 4. Comando para el Servidor Drawaria
        // Usamos el formato de línea/relleno del motor Drawaria:
        const cmd = `42["drawcmd",0,[${normX1},${normY1},${normX2},${normY2},false,${thickness.toFixed(2)},"${color}",0,0,{}]]`;
        commandQueue.push(cmd);
    }

    class SciFiCockpitHMI {
        constructor() {
            this.canvasWidth = 0;
            this.canvasHeight = 0;
            this.isDrawn = false;
            this.currentView = 'planetary'; // Nuevo estado: 'planetary' o 'nebula'
            this.shieldsActive = false;    // Nuevo estado: control de escudo
            // Coordenadas para el indicador de escudo, inicializadas más tarde en drawMainConsoles
            this.shieldIndicatorCoords = { x: 0, y: 0, size: 0 };
            this.init();
        }

        init() {
            const checkReady = () => {
                const gameCanvas = document.getElementById('canvas');
                if (gameCanvas) {
                    drawariaCanvas = gameCanvas;
                    drawariaCtx = gameCanvas.getContext('2d');
                    this.canvasWidth = drawariaCanvas.width;
                    this.canvasHeight = drawariaCanvas.height;
                    this.createControlPanel();
                    console.log('✅ Cabina HMI inicializada. Canvas: ' + this.canvasWidth + 'x' + this.canvasHeight);
                } else {
                    setTimeout(checkReady, 100);
                }
            };
            checkReady();
        }

        // --- UTILIDADES ---
        clearCanvas() {
             // Utiliza un grosor enorme y color negro para el borrado total
            enqueueDrawCommand(
                this.canvasWidth / 2, this.canvasHeight / 2, // Centro del canvas
                this.canvasWidth / 2, this.canvasHeight / 2,
                '#000000', -Math.max(this.canvasWidth, this.canvasHeight) * 2
            );
            this.isDrawn = false;
        }

        // --- PANEL DE CONTROL DRAGABLE (Interfaz de Operación) ---
        createControlPanel() {
            const existingPanel = document.getElementById('scifi-cockpit-panel');
            if (existingPanel) existingPanel.remove();

            const panel = document.createElement('div');
            panel.id = 'scifi-cockpit-panel';
            panel.style.cssText = `
                position: fixed !important;
                top: 50px !important;
                left: 50px !important;
                width: 300px !important;
                z-index: 2147483647 !important;
                background: linear-gradient(145deg, #1A237E, #0D47A1) !important;
                border: 3px solid #00BFFF !important;
                border-radius: 15px !important;
                color: white !important;
                font-family: 'Segoe UI', Arial, sans-serif !important;
                box-shadow: 0 0 25px rgba(0, 191, 255, 0.5) !important;
                padding: 20px !important;
                text-align: center !important;
            `;

            panel.innerHTML = `
                <h3 style="margin-top: 0; color: #00BFFF; cursor: grab;">🛰️ Centro de Mando HMI (v1.1)</h3>
                <p style="font-size: 12px; margin-top: -10px; color: #81D4FA;">[PROTOCOLO DE DESPLIEGUE RÁPIDO]</p>
                <div style="margin-bottom: 15px; border-bottom: 1px solid #00BFFF; padding-bottom: 10px;">
                    Estado: <span id="cockpit-status" style="color: #FFEB3B; font-weight: bold;">STANDBY</span>
                </div>

                <div style="margin-bottom: 15px; padding: 10px; border-radius: 5px; background: rgba(0,0,0,0.2);">
                    <h4 style="margin: 0 0 10px 0; color: #81D4FA;">Secuencia Base</h4>
                    <button id="draw-cockpit-btn" style="
                        width: 100%; padding: 10px; background: #28a745; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: bold; margin-bottom: 5px; transition: background 0.3s ease;
                    ">✅ Iniciar Secuencia de Despliegue</button>
                    <button id="clear-canvas-btn" style="
                        width: 100%; padding: 10px; background: #dc3545; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: bold; transition: background 0.3s ease;
                    ">❌ Purgar Memoria Gráfica</button>
                </div>

                <div style="margin-bottom: 15px; padding: 10px; border-radius: 5px; background: rgba(0,0,0,0.2);">
                    <h4 style="margin: 0 0 10px 0; color: #81D4FA;">Sistemas de Navegación</h4>
                    <button id="view-toggle-btn" style="
                        width: 100%; padding: 10px; background: #007bff; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; margin-bottom: 5px;
                    ">🌌 Cambiar Vista (Actual: <span id="current-view-text">PLANETARIO</span>)</button>
                </div>

                <div style="margin-bottom: 15px; padding: 10px; border-radius: 5px; background: rgba(0,0,0,0.2);">
                    <h4 style="margin: 0 0 10px 0; color: #81D4FA;">Controles Tácticos</h4>
                    <button id="shields-toggle-btn" style="
                        width: 100%; padding: 10px; background: #FFC107; color: #333; border: none; border-radius: 8px; cursor: pointer; font-size: 14px;
                    ">🛡️ Toggle Escudos (OFF)</button>
                </div>

                <div style="margin-bottom: 5px; padding: 10px; border-radius: 5px; background: rgba(0,0,0,0.2);">
                    <h4 style="margin: 0 0 10px 0; color: #81D4FA;">Controles de Motor</h4>
                    <button id="warp-btn" style="
                        width: 100%; padding: 10px; background: #6f42c1; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px;
                    ">🚀 Iniciar Salto WARP</button>
                </div>
            `;
            document.body.appendChild(panel);
            this.setupEventListeners();
            this.makePanelDraggable(panel);
        }

        setupEventListeners() {
            document.getElementById('draw-cockpit-btn').addEventListener('click', () => this.drawFullCockpit());
            document.getElementById('clear-canvas-btn').addEventListener('click', () => {
                this.clearCanvas();
                this.updateStatus('PURGADO', '#dc3545');
                this.isDrawn = false;
                this.currentView = 'planetary';
                this.shieldsActive = false;
                this.updateViewText();
                this.updateShieldButton();
            });
            document.getElementById('view-toggle-btn').addEventListener('click', () => this.toggleExternalView());
            document.getElementById('shields-toggle-btn').addEventListener('click', () => this.toggleShields());
            document.getElementById('warp-btn').addEventListener('click', () => this.simulateWarp());
        }

        updateStatus(text, color) {
            const statusEl = document.getElementById('cockpit-status');
            if (statusEl) {
                statusEl.textContent = text;
                statusEl.style.color = color;
            }
        }

        updateViewText() {
            const viewTextEl = document.getElementById('current-view-text');
            if (viewTextEl) {
                viewTextEl.textContent = this.currentView.toUpperCase();
            }
        }

        updateShieldButton() {
            const shieldBtn = document.getElementById('shields-toggle-btn');
            if (shieldBtn) {
                if (this.shieldsActive) {
                    shieldBtn.textContent = '🛡️ Toggle Escudos (ON)';
                    shieldBtn.style.backgroundColor = '#28A745';
                    shieldBtn.style.color = 'white';
                } else {
                    shieldBtn.textContent = '🛡️ Toggle Escudos (OFF)';
                    shieldBtn.style.backgroundColor = '#FFC107';
                    shieldBtn.style.color = '#333';
                }
            }
        }

        // --- NUEVAS FUNCIONES DE MANIPULACIÓN DE NAVE ---

        toggleExternalView() {
            if (!this.isDrawn) {
                alert('⚠️ ¡Despliega la cabina primero!');
                return;
            }

            this.currentView = this.currentView === 'planetary' ? 'nebula' : 'planetary';
            this.updateStatus(`VISTA: ${this.currentView.toUpperCase()}`, '#00BFFF');
            this.updateViewText();

            // Borra y redibuja solo la vista externa
            this.drawExternalView(true); // El parámetro true le indica que es un redibujo rápido de fondo.
        }

        toggleShields() {
            if (!this.isDrawn) {
                alert('⚠️ ¡Despliega la cabina primero!');
                return;
            }

            this.shieldsActive = !this.shieldsActive;
            this.updateShieldButton();
            this.updateStatus(`ESCUDOS: ${this.shieldsActive ? 'ACTIVOS' : 'INACTIVOS'}`, this.shieldsActive ? '#28A745' : '#FFC107');

            // Redibuja solo el indicador de escudo en la consola principal
            const { x, y, size } = this.shieldIndicatorCoords;
            const color = this.shieldsActive ? '#00FF00' : '#FF0000'; // Verde para ON, Rojo para OFF
            const darkBg = '#000000';

            // 1. Borra el área del indicador
            enqueueDrawCommand(x, y, x, y, darkBg, -size * 2, true);

            // 2. Dibuja el nuevo indicador (Círculo relleno)
            enqueueDrawCommand(x, y, x, y, color, size, true);
        }

        simulateWarp() {
            if (!this.isDrawn) {
                alert('⚠️ ¡Despliega la cabina primero!');
                return;
            }

            this.updateStatus('PREPARANDO WARP...', '#6f42c1');
            const W = this.canvasWidth;
            const H = this.canvasHeight;
            const warpColor = '#00BFFF'; // Azul de motor

            // 1. Efecto de Estiramiento/Convergencia (Temporal)
            for (let i = 0; i < 50; i++) {
                const x = Math.random() * W;
                const y = Math.random() * H;
                const targetX = W / 2;
                const targetY = H / 2;
                // Dibuja líneas que convergen en el centro
                enqueueDrawCommand(x, y, targetX + (x - targetX) / 10, targetY + (y - targetY) / 10, warpColor, 3);
            }

            // 2. Limpia el efecto y restaura la vista
            setTimeout(() => {
                // Borra solo el fondo
                this.drawExternalView(true);
                this.updateStatus('WARP COMPLETADO', '#28a745');
            }, 1000); // 1 segundo de efecto
        }

        // --- LÓGICA DE DIBUJO COMPLEJO ---

        drawFullCockpit() {
            if (this.isDrawn) {
                this.clearCanvas();
                setTimeout(() => this._drawElements(), 150); // Pequeño retraso para asegurar el borrado
            } else {
                this._drawElements();
            }
        }

        _drawElements() {
            if (this.isDrawn) return;
            this.updateStatus('DESPLEGANDO...', '#FFC107');
            this.updateViewText();
            this.updateShieldButton();
            console.log('Iniciando secuencia de dibujo de cabina...');

            // Secuencia de renderizado por capas (de atrás hacia adelante)
            this.drawExternalView(false); // Planetas y estrellas (Fondo)
            this.drawCockpitShell(); // Estructura (Ventanas, Techo, Piso)
            this.drawMainConsoles(); // Consolas de Mando (Escritorio)
            this.drawHMI_Displays(); // Pantallas y HUDs (Detalle técnico)
            this.drawSeats(); // Asientos (Primer plano)

            this.isDrawn = true;
            this.updateStatus('OPERACIONAL', '#28a745');
            console.log('Secuencia de cabina finalizada.');
        }

        drawExternalView(onlyBackgroundRedraw = false) {
            const W = this.canvasWidth;
            const H = this.canvasHeight;

            // Siempre borra el fondo antes de dibujar la vista
            enqueueDrawCommand(W / 2, H / 2, W / 2, H / 2, '#000000', -Math.max(W, H) * 2);

            // Fondo Estelar base (azul oscuro)
            enqueueDrawCommand(W / 2, H / 2, W / 2, H / 2, '#191970', -Math.max(W, H) * 2);

            if (this.currentView === 'planetary') {
                // 2. Estrellas
                for (let i = 0; i < 50; i++) {
                    enqueueDrawCommand(Math.random() * W, Math.random() * H, Math.random() * W, Math.random() * H, '#FFFFFF', 1);
                }

                // 3. Planeta Gigante Gaseoso (Derecha, color naranja/rojo)
                enqueueDrawCommand(W * 0.9, H * 0.4, W * 0.9, H * 0.4, '#FF4500', 400, true);
                enqueueDrawCommand(W * 0.9 - 150, H * 0.4, W * 0.9 + 150, H * 0.4, '#FFA07A', 10);

                // 4. Planeta Púrpura (Centro-izquierda)
                enqueueDrawCommand(W * 0.45, H * 0.35, W * 0.45, H * 0.35, '#8A2BE2', 150, true);

            } else if (this.currentView === 'nebula') {
                // Vista de Nebulosa (Nubes de color púrpura y verde)
                const nebulaColors = ['#8A2BE2', '#4B0082', '#3CB371'];
                for (let i = 0; i < 8; i++) {
                    const color = nebulaColors[i % 3];
                    const x = Math.random() * W;
                    const y = Math.random() * H;
                    const size = 150 + Math.random() * 200;
                    // Nubes grandes difusas (círculos rellenos)
                    enqueueDrawCommand(x, y, x, y, color, size, true);
                }
            }

            // Si solo estamos redibujando el fondo, no redibujamos el resto de la cabina.
            if (onlyBackgroundRedraw) {
                // El resto de elementos de la cabina (techo, consolas, etc.)
                // deben estar superpuestos correctamente al dibujarse inicialmente.
                // Si la vista externa requiere un borrado completo del canvas,
                // las capas superiores deben ser redibujadas. Para simplificar
                // y ahorrar comandos, asumimos que el borrado de fondo es
                // suficientemente discreto para no afectar las capas superiores
                // dibujadas *encima*.
            }
        }


        drawCockpitShell() {
            const W = this.canvasWidth;
            const H = this.canvasHeight;
            const darkBlue = '#1E3F66'; // Material estructural oscuro
            const lightGrey = '#FFFFFF'; // Techo/Piso interior

            // 1. Piso Interior
            enqueueDrawCommand(W * 0.1, H * 0.65, W * 0.9, H * 0.65, lightGrey, -H * 0.4);

            // 2. Techo y Paredes
            enqueueDrawCommand(W * 0.1, H * 0.05, W * 0.9, H * 0.05, darkBlue, -H * 0.5);

            // 3. Marcos de Ventanas y Pilares
            const pillarWidth = 15;
            enqueueDrawCommand(W * 0.5 - pillarWidth / 2, H * 0.05, W * 0.5 - pillarWidth / 2, H * 0.65, darkBlue, pillarWidth);
            enqueueDrawCommand(W * 0.1, H * 0.05, W * 0.1, H * 0.65, darkBlue, pillarWidth);
            enqueueDrawCommand(W * 0.9, H * 0.05, W * 0.9, H * 0.65, darkBlue, pillarWidth);

            // 4. Iluminación de Techo
            const lampColor = '#FFFFFF';
            enqueueDrawCommand(W * 0.3, H * 0.08, W * 0.35, H * 0.08, lampColor, 5);
            enqueueDrawCommand(W * 0.65, H * 0.08, W * 0.7, H * 0.08, lampColor, 5);
        }

        drawMainConsoles() {
            const W = this.canvasWidth;
            const H = this.canvasHeight;
            const consoleColor = '#F0F0F0';
            const consoleBaseH = H * 0.6;
            const consoleDepth = H * 0.15;

            // 1. Superficie de la Consola Principal
            enqueueDrawCommand(W * 0.15, consoleBaseH, W * 0.85, consoleBaseH, consoleColor, -consoleDepth * 2);

            // 2. Módulos de Pantalla
            const screenMountColor = '#C0C0C0';
            const screenH = H * 0.18;
            const screenW = W * 0.25;
            enqueueDrawCommand(W * 0.28, consoleBaseH - screenH / 2, W * 0.28, consoleBaseH + screenH / 2, screenMountColor, -screenW);
            enqueueDrawCommand(W * 0.72, consoleBaseH - screenH / 2, W * 0.72, consoleBaseH + screenH / 2, screenMountColor, -screenW);

            // 3. Panel de Control Central Integrado
            const centralPanelColor = '#E0E0E0';
            const centralW = W * 0.2;
            const centralH = H * 0.1;
            enqueueDrawCommand(W * 0.5, consoleBaseH + centralH / 2, W * 0.5, consoleBaseH - centralH / 2, centralPanelColor, -centralW);

            // Indicador de Nivel Crítico (ej. Nivel de Potencia)
            enqueueDrawCommand(W * 0.5, consoleBaseH, W * 0.5, consoleBaseH, '#00BFFF', 40);
            enqueueDrawCommand(W * 0.49, consoleBaseH - 5, W * 0.51, consoleBaseH - 5, '#FFFFFF', 2);
            enqueueDrawCommand(W * 0.49, consoleBaseH + 5, W * 0.51, consoleBaseH + 5, '#FFFFFF', 2);

            // 4. Indicador de ESCUDO (Pequeño indicador táctico, cerca del centro)
            this.shieldIndicatorCoords.x = W * 0.4;
            this.shieldIndicatorCoords.y = consoleBaseH + 40;
            this.shieldIndicatorCoords.size = 20;

            const x = this.shieldIndicatorCoords.x;
            const y = this.shieldIndicatorCoords.y;
            const size = this.shieldIndicatorCoords.size;

            // Dibuja el indicador de escudo en estado inicial (OFF - Rojo)
            enqueueDrawCommand(x, y, x, y, '#FF0000', size, true);
            // Dibuja el borde exterior
            enqueueDrawCommand(x, y, x, y, '#333333', size + 5, true);
        }

        drawHMI_Displays() {
            const W = this.canvasWidth;
            const H = this.canvasHeight;
            const hudColor = '#32CD32';

            const screenH = H * 0.18;
            const screenW = W * 0.25;
            const consoleBaseH = H * 0.6;

            // MFD Izquierdo (Simulando Radar/Mapa Táctico)
            const mfdL_X = W * 0.28;
            const mfdL_Y = consoleBaseH;
            enqueueDrawCommand(mfdL_X, mfdL_Y, mfdL_X, mfdL_Y, '#000000', -screenW);
            enqueueDrawCommand(mfdL_X, mfdL_Y, mfdL_X, mfdL_Y, hudColor, 80, true, 0, 2 * Math.PI);
            enqueueDrawCommand(mfdL_X - 10, mfdL_Y - 10, mfdL_X + 10, mfdL_Y + 10, hudColor, 3);

            // MFD Derecho (Simulando Datos de Vuelo/Telemetría)
            const mfdR_X = W * 0.72;
            const mfdR_Y = consoleBaseH;
            enqueueDrawCommand(mfdR_X, mfdR_Y, mfdR_X, mfdR_Y, '#000000', -screenW);
            enqueueDrawCommand(mfdR_X - 40, mfdR_Y + 10, mfdR_X + 40, mfdR_Y + 10, hudColor, 5);
            enqueueDrawCommand(mfdR_X, mfdR_Y - 20, mfdR_X, mfdR_Y + 20, hudColor, 5);
        }

        drawSeats() {
            const W = this.canvasWidth;
            const H = this.canvasHeight;
            const seatBaseColor = '#C0C0D0';
            const neonBlue = '#00BFFF';

            // Asiento Izquierdo
            const seatL_X = W * 0.25;
            const seatY = H * 0.8;
            const seatW = 120;
            enqueueDrawCommand(seatL_X, seatY, seatL_X, seatY, seatBaseColor, -seatW * 1.5);
            enqueueDrawCommand(seatL_X - seatW / 3, seatY - 50, seatL_X - seatW / 3, seatY + 100, neonBlue, 5);
            enqueueDrawCommand(seatL_X + seatW / 3, seatY - 50, seatL_X + seatW / 3, seatY + 100, neonBlue, 5);

            // Asiento Derecho
            const seatR_X = W * 0.75;
            enqueueDrawCommand(seatR_X, seatY, seatR_X, seatY, seatBaseColor, -seatW * 1.5);
            enqueueDrawCommand(seatR_X - seatW / 3, seatY - 50, seatR_X - seatW / 3, seatY + 100, neonBlue, 5);
            enqueueDrawCommand(seatR_X + seatW / 3, seatY - 50, seatR_X + seatW / 3, seatY + 100, neonBlue, 5);
        }

        // --- FUNCIÓN DE ARRASTRE DEL PANEL (copia del modelo Pac-Man) ---
        makePanelDraggable(panel) {
            let isDragging = false;
            let currentX;
            let currentY;
            let initialX;
            let initialY;
            let xOffset = 0;
            let yOffset = 0;

            const dragStart = (e) => {
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
                isDragging = true;
                panel.style.cursor = 'grabbing';
            };

            const dragEnd = () => {
                initialX = currentX;
                initialY = currentY;
                isDragging = false;
                panel.style.cursor = 'grab';
            };

            const drag = (e) => {
                if (isDragging) {
                    e.preventDefault();
                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;
                    xOffset = currentX;
                    yOffset = currentY;
                    panel.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
                }
            };

            const header = panel.querySelector('h3');
            if (header) {
                header.style.cursor = 'grab';
                header.addEventListener("mousedown", dragStart);
                document.addEventListener("mouseup", dragEnd);
                document.addEventListener("mousemove", drag);
            }
        }
    }

    /* ---------- INICIALIZACIÓN DEL SISTEMA ---------- */
    const initSciFiCockpit = () => {
        // Asegura que la clase se instancie solo una vez.
        new SciFiCockpitHMI();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSciFiCockpit);
    } else {
        setTimeout(initSciFiCockpit, 500);
    }
})();