// ==UserScript==
// @name         Drawaria Tunnel Visualizer
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Recreate the visual effect of an expanding tunnel of squares, using ultra-optimization of sockets.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        none
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/550708/Drawaria%20Tunnel%20Visualizer.user.js
// @updateURL https://update.greasyfork.org/scripts/550708/Drawaria%20Tunnel%20Visualizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* ---------- COMPONENTES COMPARTIDOS DEL SISTEMA (ULTRA OPTIMIZADOS) ---------- */
    let drawariaSocket = null;
    let drawariaCanvas = null;
    let drawariaCtx = null;
    // OPTIMIZACIÓN ULTRA: Reducido a 15 FPS para máxima fluidez y menor carga.
    const FRAME_RATE = 10;

    // Cola de comandos optimizada con agrupamiento inteligente (ULTRA BATCHING)
    const commandQueue = [];
    let batchProcessor = null;
    // OPTIMIZACIÓN ULTRA: Tamaño del lote aumentado a 100 para procesar más comandos de una vez.
    const BATCH_SIZE = 100;
    // OPTIMIZACIÓN ULTRA: Intervalo reducido a 5ms para envío más rápido.
    const BATCH_INTERVAL = 5;

    // Intercepta WebSocket para capturar el socket del juego (ORIGINAL)
    const originalWebSocketSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function(...args) {
        if (!drawariaSocket && this.url && this.url.includes('drawaria')) {
            drawariaSocket = this;
            console.log('🔗 Drawaria WebSocket capturado para el Túnel Visualizer.');
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
                try {
                    drawariaSocket.send(cmd);
                } catch (e) {
                    console.warn('⚠️ Fallo al enviar el comando:', e);
                }
            });
        }, BATCH_INTERVAL);
    }

    /**
     * Función unificada para encolar comandos de dibujo.
     * CRÍTICO: Usa grosor positivo para línea, grosor negativo para relleno.
     * Si thickness es negativo (relleno), usa la implementación de Drawaria:
     *      - Envía el valor absoluto del grosor como *negativo* en el comando.
     * OPTIMIZACIÓN ULTRA: Reducida precisión a toFixed(3) para comandos más ligeros.
     * @param {number} x1 - Coordenada X inicial
     * @param {number} y1 - Coordenada Y inicial
     * @param {number} x2 - Coordenada X final
     * @param {number} y2 - Coordenada Y final
     * @param {string} color - Color del objeto (ej. '#FFFFFF')
     * @param {number} thickness - Grosor (Positivo para línea, Negativo para relleno)
     */
    function enqueueDrawCommand(x1, y1, x2, y2, color, thickness) {
        if (!drawariaCanvas || !drawariaSocket) return;

        const normX1 = (x1 / drawariaCanvas.width).toFixed(3);
        const normY1 = (y1 / drawariaCanvas.height).toFixed(3);
        const normX2 = (x2 / drawariaCanvas.width).toFixed(3);
        const normY2 = (y2 / drawariaCanvas.height).toFixed(3);

        // CORRECCIÓN CRÍTICA: Aplica el truco de grosor negativo solo si se pide relleno (thickness < 0)
        const cmdThickness = thickness < 0 ? -Math.abs(thickness) : thickness;

        const cmd = `42["drawcmd",0,[${normX1},${normY1},${normX2},${normY2},false,${cmdThickness},"${color}",0,0,{}]]`;
        commandQueue.push(cmd);

        // Renderizado local para retroalimentación visual inmediata
        if (drawariaCtx) {
            if (thickness > 0) {
                // Para líneas (positivo)
                drawariaCtx.strokeStyle = color;
                drawariaCtx.lineWidth = thickness;
                drawariaCtx.lineCap = 'butt';
                drawariaCtx.lineJoin = 'miter';
                drawariaCtx.beginPath();
                drawariaCtx.moveTo(x1, y1);
                drawariaCtx.lineTo(x2, y2);
                drawariaCtx.stroke();
            } else {
                // Para rellenos (negativo), simula un relleno local si es todo el canvas
                if (x1 === 0 && y1 === 0 && x2 === drawariaCanvas.width && y2 === drawariaCanvas.height) {
                    drawariaCtx.fillStyle = color;
                    drawariaCtx.fillRect(0, 0, drawariaCanvas.width, drawariaCanvas.height);
                }
            }
        }
    }

    // Función auxiliar para forzar un relleno (usando el método de línea gruesa negativa)
    // CORRECCIÓN: Usa diagonal completa (0,0 a width,height) como en el script de Snake para asegurar que funcione.
    function enqueueDrawFillCommand(width, height, color) {
        if (!drawariaCanvas || !drawariaSocket) return;

        // CORRECCIÓN CRÍTICA: Llama a enqueueDrawCommand con grosor negativo y diagonal completa.
        // Se usa un grosor negativo muy grande para asegurar el relleno completo.
        const fillThickness = -(Math.max(width, height) * 2);
        enqueueDrawCommand(0, 0, width, height, color, fillThickness);
    }

    /* ---------- LÓGICA DEL TUNNEL VISUALIZER (USANDO LA ESTRUCTURA) ---------- */
    class TunnelVisualizer {
        constructor() {
            this.isActive = false;
            this.animationInterval = null;
            this.frame = 0;
            // OPTIMIZACIÓN ULTRA: Reducido número de cuadrados a 10 para menor carga por frame.
            this.squareCount = 1;
            this.maxSquareSize = 0;
            this.minSquareSize = 1;
            this.center = { x: 0, y: 0 };

            this.init();
        }

        init() {
            const checkGameReady = () => {
                const gameCanvas = document.getElementById('canvas');
                if (gameCanvas) {
                    drawariaCanvas = gameCanvas;
                    drawariaCtx = gameCanvas.getContext('2d');
                    this.center = {
                        x: drawariaCanvas.width / 2,
                        y: drawariaCanvas.height / 2
                    };
                    // Multiplicador ligeramente mayor para que el cuadrado más grande esté fuera de vista
                    this.maxSquareSize = Math.max(drawariaCanvas.width, drawariaCanvas.height) * 1.8;
                    this.createGamePanel();
                    console.log('✅ Tunnel Visualizer inicializado.');
                } else {
                    setTimeout(checkGameReady, 100);
                }
            };
            checkGameReady();
        }

        createGamePanel() {
            const existingPanel = document.getElementById('tunnel-panel');
            if (existingPanel) existingPanel.remove();

            const panel = document.createElement('div');
            panel.id = 'tunnel-panel';
            panel.style.cssText = `
                position: fixed !important;
                top: 250px !important;
                right: 20px !important;
                width: 250px !important;
                z-index: 2147483647 !important;
                background: linear-gradient(135deg, #2a2a3a, #1a1a2e) !important;
                border: 2px solid #5d5dff !important;
                border-radius: 12px !important;
                color: white !important;
                font-family: 'Segoe UI', Arial, sans-serif !important;
                box-shadow: 0 0 20px rgba(93, 93, 255, 0.3) !important;
                padding: 15px !important;
                text-align: center !important;
            `;

            panel.innerHTML = `
                <h3 style="margin-top: 0; color: #5d5dff; cursor: grab;">🌌 Drawaria Tunnel Effect</h3>
                <div id="status-display" style="margin-bottom: 10px; color: #ffc107;">
                    Status: Paused
                </div>
                <button id="toggle-animation" style="
                    width: 100%;
                    padding: 10px;
                    background: #5d5dff;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: bold;
                ">▶️ Start Animation</button>
                 <button id="draw-black-bg" style="
                    width: 100%;
                    padding: 10px;
                    background: #333;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: bold;
                    margin-top: 10px;
                ">⚫ Draw Black Background (Click First!)</button>
            `;
            document.body.appendChild(panel);
            this.setupEventListeners();
            this.makePanelDraggable(panel);
        }

        setupEventListeners() {
            document.getElementById('toggle-animation').addEventListener('click', () => this.toggleAnimation());
            document.getElementById('draw-black-bg').addEventListener('click', () => this.drawBlackBackground());
        }

        drawBlackBackground() {
             if (!drawariaCanvas || !drawariaSocket) return;
             // Llama a la función de relleno corregida
             enqueueDrawFillCommand(drawariaCanvas.width, drawariaCanvas.height, '#000000');
             document.getElementById('status-display').textContent = 'Status: Background Black';
        }

        toggleAnimation() {
            const btn = document.getElementById('toggle-animation');
            const statusEl = document.getElementById('status-display');
            if (!this.isActive) {
                this.startAnimation();
                btn.textContent = '⏸️ Pause Animation';
                btn.style.background = '#ffc107';
                statusEl.textContent = 'Status: Running';
            } else {
                this.pauseAnimation();
                btn.textContent = '▶️ Resume Animation';
                btn.style.background = '#5d5dff';
                statusEl.textContent = 'Status: Paused';
            }
        }

        startAnimation() {
            if (this.isActive) return;
            this.isActive = true;
            this.animationLoop();
        }

        pauseAnimation() {
            this.isActive = false;
            if (this.animationInterval) {
                clearTimeout(this.animationInterval);
                this.animationInterval = null;
            }
        }

        animationLoop() {
            if (!this.isActive) return;

            this.drawTunnelFrame();
            this.frame++;

            this.animationInterval = setTimeout(() => this.animationLoop(), Math.floor(1000 / FRAME_RATE));
        }

        drawTunnelFrame() {

            // CORRECCIÓN CRÍTICA: Limpia el fondo cada 10 fotogramas para ultra-reducir la carga del servidor (optimización).
            // Esto es necesario para que no se vean los rastros de los cuadrados anteriores.
            if (this.frame % 10 === 0) {
                 enqueueDrawFillCommand(drawariaCanvas.width, drawariaCanvas.height, '#000000');
            }

            const baseThickness = 2;
            const sizeIncrement = this.maxSquareSize / this.squareCount;
            // OPTIMIZACIÓN ULTRA: Velocidad de animación ajustada para mayor suavidad y menor cómputo.
            const speed = 1.5;

            for (let i = 0; i < this.squareCount; i++) {
                const sizeOffset = (this.frame * speed) % (sizeIncrement * this.squareCount);
                let size = (i * sizeIncrement) + sizeOffset;

                // Cálculo modular para un bucle continuo de tamaño.
                const normalizedSize = size % this.maxSquareSize;
                const color = '#FFFFFF';

                // Dibuja el contorno del cuadrado usando el método original con grosor POSITIVO
                this.drawSquareOutline(normalizedSize, color, baseThickness);
            }

            // Cuadrado central azul
            this.drawSquareOutline(this.minSquareSize + 5, '#87CEEB', baseThickness * 1.5);
        }

        drawSquareOutline(size, color, thickness) {
            const cX = this.center.x;
            const cY = this.center.y;
            const halfSize = size / 2;

            const x1 = cX - halfSize;
            const y1 = cY - halfSize;
            const x2 = cX + halfSize;
            const y2 = cY + halfSize;

            // Usando la función original, ahora corregida para líneas
            enqueueDrawCommand(x1, y1, x2, y1, color, thickness); // Superior
            enqueueDrawCommand(x2, y1, x2, y2, color, thickness); // Derecha
            enqueueDrawCommand(x2, y2, x1, y2, color, thickness); // Inferior
            enqueueDrawCommand(x1, y2, x1, y1, color, thickness); // Izquierda
        }

        makePanelDraggable(panel) {
            let isDragging = false;
            let currentX, currentY, initialX, initialY, xOffset = 0, yOffset = 0;

            const header = panel.querySelector('h3');
            if (!header) return;

            const dragStart = (e) => {
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
                isDragging = true;
                header.style.cursor = 'grabbing';
            };

            const dragEnd = () => {
                initialX = currentX;
                initialY = currentY;
                isDragging = false;
                header.style.cursor = 'grab';
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

            header.addEventListener("mousedown", dragStart);
            document.addEventListener("mouseup", dragEnd);
            document.addEventListener("mousemove", drag);
        }
    }

    // Inicialización del visualizador (MISMO MÉTODO QUE SNAKE)
    const initVisualizer = () => {
        const visualizer = new TunnelVisualizer();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initVisualizer);
    } else {
        setTimeout(initVisualizer, 500);
    }

})();