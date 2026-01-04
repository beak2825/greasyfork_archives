// ==UserScript==
// @name         Drawaria Pac-Man Game
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Recreación precisa del Pac-Man clásico en el canvas de Drawaria.online, con laberinto, fantasmas, puntos, y un panel de control arrastrable.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        none
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/549553/Drawaria%20Pac-Man%20Game.user.js
// @updateURL https://update.greasyfork.org/scripts/549553/Drawaria%20Pac-Man%20Game.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* ---------- COMPONENTES COMPARTIDOS DEL SISTEMA ---------- */
    let drawariaSocket = null;
    let drawariaCanvas = null;
    let drawariaCtx = null;
    const commandQueue = [];
    let batchProcessor = null;
    const BATCH_SIZE = 8;
    const BATCH_INTERVAL = 60; // 60ms para un balance entre rendimiento y fluidez

    const originalWebSocketSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function(...args) {
        if (!drawariaSocket && this.url && this.url.includes('drawaria')) {
            drawariaSocket = this;
            console.log('🔗 Drawaria WebSocket capturado para el juego de Pac-Man.');
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
     * Dibuja una línea o forma rellena. Asegura la retroalimentación visual local.
     */
    function enqueueDrawCommand(x1, y1, x2, y2, color, thickness, isArc = false, startAngle = 0, endAngle = 0) {
        if (!drawariaCanvas || !drawariaSocket) return;

        // Renderizado local para retroalimentación visual inmediata
        if (drawariaCtx) {
            drawariaCtx.fillStyle = color;
            drawariaCtx.strokeStyle = color;
            drawariaCtx.lineWidth = thickness;
            drawariaCtx.lineCap = 'round';
            drawariaCtx.lineJoin = 'round';

            if (isArc) {
                drawariaCtx.beginPath();
                drawariaCtx.arc(x1, y1, thickness / 2, startAngle, endAngle);
                drawariaCtx.lineTo(x1, y1); // Para cerrar el Pac-Man
                drawariaCtx.fill();
            } else {
                drawariaCtx.beginPath();
                drawariaCtx.moveTo(x1, y1);
                drawariaCtx.lineTo(x2, y2);
                if (thickness < 0) { // Para formas rellenas
                    drawariaCtx.lineCap = 'butt';
                    drawariaCtx.stroke();
                } else { // Para líneas
                    drawariaCtx.stroke();
                }
            }
        }

        // Comando para Drawaria.online
        const normX1 = (x1 / drawariaCanvas.width).toFixed(4);
        const normY1 = (y1 / drawariaCanvas.height).toFixed(4);
        const normX2 = (x2 / drawariaCanvas.width).toFixed(4);
        const normY2 = (y2 / drawariaCanvas.height).toFixed(4);

        let cmd;
        if (isArc) {
            // Para arcos, el "thickness" se usa como radio. Esto es una simplificación
            // y puede no ser exacto con el comando nativo de Drawaria sin más manipulación del lienzo.
            // Para el propósito actual, enviamos una forma rellena simulando un círculo.
            cmd = `42["drawcmd",0,[${normX1},${normY1},${normX1},${normY1},false,${-Math.abs(thickness)},"${color}",0,0,{}]]`; // Simula un círculo rellenando un punto grande
        } else {
            cmd = `42["drawcmd",0,[${normX1},${normY1},${normX2},${normY2},false,${-Math.abs(thickness)},"${color}",0,0,{}]]`;
        }
        commandQueue.push(cmd);
    }

    /* ---------- LÓGICA DEL JUEGO DE PAC-MAN ---------- */
    class PacmanGame {
        constructor() {
            this.isActive = false;
            this.cellSize = 16; // Tamaño de celda ajustado para el mapa
            this.pacman = { x: 0, y: 0, direction: 'right', nextDirection: 'right', frame: 0, speed: 2 };
            this.ghost = { x: 0, y: 0, direction: 'left', speed: 2, frightened: false, frightenedTimer: 0 };
            this.dots = []; // Pequeños puntos
            this.powerPills = []; // Píldoras de poder (puntos grandes)
            this.score = 0;
            this.gameInterval = null;
            this.animationFrame = 0; // Para animación de Pac-Man y fantasmas
            this.isGameOver = false;
            this.gameEndedMessage = '';

            // Mapa del laberinto (0: vacío, 1: pared, 2: punto, 3: píldora de poder)
            // Este mapa es una adaptación del original de Pac-Man
            this.map = [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
                [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
                [1, 3, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 3, 1],
                [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
                [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
                [1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1],
                [1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1],
                [1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 1],
                [1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1], // Zona de fantasmas
                [1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1],
                [0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0], // Túnel
                [1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1],
                [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
                [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
                [1, 3, 2, 1, 1, 2, 2, 2, 1, 1, 1, 1, 2, 0, 0, 2, 1, 1, 1, 1, 1, 2, 2, 1, 1, 2, 3, 1],
                [1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1],
                [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            ];
            this.mapWidth = this.map[0].length;
            this.mapHeight = this.map.length;
            this.init();
        }

        init() {
            const checkGameReady = () => {
                const gameCanvas = document.getElementById('canvas');
                if (gameCanvas) {
                    drawariaCanvas = gameCanvas;
                    drawariaCtx = gameCanvas.getContext('2d');
                    // Aseguramos que el canvas tenga un tamaño manejable para nuestro mapa
                    if (drawariaCanvas.width < this.mapWidth * this.cellSize || drawariaCanvas.height < this.mapHeight * this.cellSize) {
                        console.warn("⚠️ Canvas de Drawaria es más pequeño de lo esperado. El mapa podría no verse completo.");
                        // Ajustar cellSize si el canvas es muy pequeño para que el mapa quepa.
                        this.cellSize = Math.min(drawariaCanvas.width / this.mapWidth, drawariaCanvas.height / this.mapHeight);
                        console.log(`Cambiando cellSize a ${this.cellSize} para adaptarse al canvas.`);
                    }
                    this.createGamePanel();
                    this.resetGamePositions(); // Establecer posiciones iniciales
                    this.generateDotsAndPowerPills(); // Generar puntos y píldoras
                    console.log('✅ Juego de Pac-Man inicializado.');
                } else {
                    setTimeout(checkGameReady, 100);
                }
            };
            checkGameReady();
        }

        createGamePanel() {
            const existingPanel = document.getElementById('pacman-game-panel');
            if (existingPanel) existingPanel.remove();

            const panel = document.createElement('div');
            panel.id = 'pacman-game-panel';
            panel.style.cssText = `
                position: fixed !important;
                top: 20px !important;
                right: 20px !important;
                width: 250px !important;
                z-index: 2147483647 !important;
                background: linear-gradient(135deg, #000033, #00001a) !important;
                border: 2px solid #FFD700 !important;
                border-radius: 12px !important;
                color: white !important;
                font-family: 'Press Start 2P', 'Segoe UI', Arial, sans-serif !important;
                box-shadow: 0 0 20px rgba(255, 215, 0, 0.3) !important;
                padding: 15px !important;
                text-align: center !important;
            `;

            panel.innerHTML = `
                <h3 style="margin-top: 0; color: #FFD700;">🟡 Pac-Man</h3>
                <div style="margin-bottom: 10px;">
                    Score: <span id="pacman-score">0</span>
                </div>
                <button id="draw-maze-btn" style="
                    width: 100%;
                    padding: 10px;
                    background: #2196F3;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: bold;
                    margin-bottom: 10px;
                    transition: background 0.3s ease;
                ">🖼️ Dibuja el Laberinto</button>
                <button id="toggle-game" style="
                    width: 100%;
                    padding: 10px;
                    background: #FFD700;
                    color: black;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: bold;
                    transition: background 0.3s ease;
                ">▶️ Iniciar Juego</button>
                <div id="game-message" style="
                    margin-top: 10px;
                    color: #ff4d4d;
                    font-weight: bold;
                    display: none;
                "></div>
                <div style="
                    margin-top: 15px;
                    font-size: 10px;
                    color: rgba(255,255,255,0.6);
                ">
                    Usa las teclas de flecha para moverte.<br>
                    Evita al fantasma y come todos los puntos.
                </div>
            `;
            document.body.appendChild(panel);
            this.setupEventListeners();
            this.makePanelDraggable(panel);

            // Efectos hover
            document.getElementById('draw-maze-btn').onmouseover = function() { this.style.background = '#1a75c2'; };
            document.getElementById('draw-maze-btn').onmouseout = function() { this.style.background = '#2196F3'; };
            document.getElementById('toggle-game').onmouseover = function() { this.style.background = '#e6b800'; };
            document.getElementById('toggle-game').onmouseout = function() { this.style.background = '#FFD700'; };
        }

        setupEventListeners() {
            document.getElementById('toggle-game').addEventListener('click', () => this.toggleGame());
            document.getElementById('draw-maze-btn').addEventListener('click', () => {
                this.drawMaze(true); // Dibuja y fuerza el borrado inicial
                this.drawDotsAndPowerPills(); // Dibuja todos los puntos
                this.drawPacman(); // Dibuja a Pac-Man en su posición inicial
                this.drawGhost(); // Dibuja al fantasma en su posición inicial
            });
            document.addEventListener('keydown', (e) => this.handleKeyInput(e));
        }

        toggleGame() {
            if (!this.isActive) {
                this.startGame();
                document.getElementById('toggle-game').textContent = '⏸️ Pausar Juego';
                document.getElementById('toggle-game').style.background = '#ffc107';
                document.getElementById('game-message').style.display = 'none';
            } else {
                this.pauseGame();
                document.getElementById('toggle-game').textContent = '▶️ Reanudar Juego';
                document.getElementById('toggle-game').style.background = '#FFD700';
            }
        }

        startGame() {
            if (this.isActive && !this.isGameOver) return;
            this.isActive = true;
            this.isGameOver = false;
            this.score = 0;
            this.updateScoreDisplay();
            this.resetGamePositions();
            this.generateDotsAndPowerPills();
            this.drawMaze(true); // Dibuja el laberinto y lo limpia para el juego
            this.gameLoop();
        }

        pauseGame() {
            this.isActive = false;
            if (this.gameInterval) clearInterval(this.gameInterval);
            this.gameInterval = null;
        }

        endGame(message) {
            this.isGameOver = true;
            this.pauseGame();
            document.getElementById('toggle-game').textContent = '🔄 Reiniciar Juego';
            document.getElementById('toggle-game').style.background = '#cc0000';
            const messageEl = document.getElementById('game-message');
            messageEl.textContent = `¡${message}! Puntos: ${this.score}`;
            messageEl.style.display = 'block';
            console.log(`💀 ¡Juego Terminado! ${message}. Puntos: ${this.score}`);
        }

        resetGamePositions() {
            // Posiciones iniciales basadas en el mapa
            this.pacman.x = 1.5 * this.cellSize;
            this.pacman.y = 1.5 * this.cellSize;
            this.pacman.direction = 'right';
            this.pacman.nextDirection = 'right';
            this.pacman.frame = 0;

            this.ghost.x = 13.5 * this.cellSize; // Central en el área de fantasmas
            this.ghost.y = 12.5 * this.cellSize;
            this.ghost.direction = 'left';
            this.ghost.frightened = false;
            this.ghost.frightenedTimer = 0;
        }

        generateDotsAndPowerPills() {
            this.dots = [];
            this.powerPills = [];
            for (let y = 0; y < this.mapHeight; y++) {
                for (let x = 0; x < this.mapWidth; x++) {
                    const centerX = (x + 0.5) * this.cellSize;
                    const centerY = (y + 0.5) * this.cellSize;
                    if (this.map[y][x] === 2) {
                        this.dots.push({ x: centerX, y: centerY, eaten: false });
                    } else if (this.map[y][x] === 3) {
                        this.powerPills.push({ x: centerX, y: centerY, eaten: false });
                    }
                }
            }
        }

        gameLoop() {
            if (!this.isActive || this.isGameOver) return;

            this.updateGame();
            this.drawGame();

            this.gameInterval = setTimeout(() => this.gameLoop(), 100); // Velocidad del juego
        }

        updateGame() {
            // Animación de Pac-Man
            this.pacman.frame = (this.pacman.frame + 1) % 2; // Alterna entre 0 y 1

            // Mover Pac-Man
            this.moveCharacter(this.pacman);

            // Mover Fantasma (lógica simple de persecución/aleatoria)
            this.moveGhostAI();

            // Actualizar estado de miedo del fantasma
            if (this.ghost.frightened && this.ghost.frightenedTimer > 0) {
                this.ghost.frightenedTimer--;
                if (this.ghost.frightenedTimer === 0) {
                    this.ghost.frightened = false;
                }
            }

            // Verificar colisión con puntos
            this.checkDotCollision();

            // Verificar colisión con píldoras de poder
            this.checkPowerPillCollision();

            // Verificar colisión con fantasma
            if (this.checkCollision(this.pacman, this.ghost, this.cellSize * 0.7)) {
                if (this.ghost.frightened) {
                    // Pac-Man come al fantasma
                    this.score += 200; // Puntos por comer fantasma
                    this.updateScoreDisplay();
                    this.resetGhostPosition(); // El fantasma regresa a su punto de inicio
                    this.ghost.frightened = false; // Ya no está asustado
                    this.ghost.frightenedTimer = 0;
                } else {
                    this.endGame('Fuiste comido por el fantasma');
                }
            }

            // Comprobar si todos los puntos han sido comidos
            if (this.dots.every(d => d.eaten) && this.powerPills.every(p => p.eaten)) {
                this.endGame('¡Ganaste!');
            }
        }

        drawGame() {
            // Borra solo las entidades que se mueven, no el laberinto
            this.clearMovingEntities();
            this.drawDotsAndPowerPills(); // Para redibujar los puntos no comidos
            this.drawPacman();
            this.drawGhost();
        }

        clearCanvas() {
            enqueueDrawCommand(0, 0, drawariaCanvas.width, drawariaCanvas.height, '#000000', Math.max(1400, 1400));
        }

        clearMovingEntities() {
            const clearRadius = this.cellSize * 1.5; // Un radio mayor para asegurar la limpieza
            enqueueDrawCommand(this.ghost.x, this.ghost.y, this.ghost.x, this.ghost.y, '#000000', clearRadius);
            enqueueDrawCommand(this.pacman.x, this.pacman.y, this.pacman.x, this.pacman.y, '#000000', clearRadius);
        }

        drawMaze(clearFirst = false) {
            if (clearFirst) {
                this.clearCanvas();
                // Retraso para que Drawaria procese el borrado antes de dibujar el laberinto
                setTimeout(() => this._drawMazeElements(), 50);
            } else {
                this._drawMazeElements();
            }
        }

        _drawMazeElements() {
            const wallColor = '#2196F3'; // Azul clásico de Pac-Man
            const wallThickness = 2; // Grosor de la línea para las paredes

            for (let y = 0; y < this.mapHeight; y++) {
                for (let x = 0; x < this.mapWidth; x++) {
                    const currentCell = this.map[y][x];
                    if (currentCell === 1) { // Es una pared
                        const px = x * this.cellSize;
                        const py = y * this.cellSize;

                        // Dibujar las líneas de pared individualmente para hacer un laberinto
                        // Arriba
                        if (y === 0 || this.map[y - 1][x] !== 1) {
                             enqueueDrawCommand(px, py, px + this.cellSize, py, wallColor, wallThickness);
                        }
                        // Abajo
                        if (y === this.mapHeight - 1 || this.map[y + 1][x] !== 1) {
                            enqueueDrawCommand(px, py + this.cellSize, px + this.cellSize, py + this.cellSize, wallColor, wallThickness);
                        }
                        // Izquierda
                        if (x === 0 || this.map[y][x - 1] !== 1) {
                            enqueueDrawCommand(px, py, px, py + this.cellSize, wallColor, wallThickness);
                        }
                        // Derecha
                        if (x === this.mapWidth - 1 || this.map[y][x + 1] !== 1) {
                            enqueueDrawCommand(px + this.cellSize, py, px + this.cellSize, py + this.cellSize, wallColor, wallThickness);
                        }
                    }
                }
            }
            console.log('✅ Laberinto dibujado.');
        }

        drawDotsAndPowerPills() {
            const dotColor = '#FFFFFF';
            const powerPillColor = '#FFFFFF';

            this.dots.forEach(dot => {
                if (!dot.eaten) {
                    enqueueDrawCommand(dot.x, dot.y, dot.x, dot.y, dotColor, 4); // Punto pequeño
                }
            });

            this.powerPills.forEach(pill => {
                if (!pill.eaten) {
                    enqueueDrawCommand(pill.x, pill.y, pill.x, pill.y, powerPillColor, 8); // Punto grande
                }
            });
            console.log('✅ Puntos y píldoras dibujados.');
        }

        drawPacman() {
            const pacmanRadius = this.cellSize * 0.4; // Radio para Pac-Man
            const x = this.pacman.x;
            const y = this.pacman.y;
            const color = '#FFD700'; // Amarillo Pac-Man

            let startAngle = 0;
            let endAngle = 2 * Math.PI; // Círculo completo
            let mouthAngle = Math.PI / 6 * this.pacman.frame; // Apertura de boca

            // Ajustar el ángulo de la boca según la dirección
            if (this.pacman.direction === 'right') {
                startAngle = mouthAngle;
                endAngle = 2 * Math.PI - mouthAngle;
            } else if (this.pacman.direction === 'left') {
                startAngle = Math.PI + mouthAngle;
                endAngle = Math.PI - mouthAngle;
            } else if (this.pacman.direction === 'up') {
                startAngle = 1.5 * Math.PI + mouthAngle;
                endAngle = 1.5 * Math.PI - mouthAngle;
            } else if (this.pacman.direction === 'down') {
                startAngle = 0.5 * Math.PI + mouthAngle;
                endAngle = 0.5 * Math.PI - mouthAngle;
            }

            // Dibuja Pac-Man como un arco relleno
            enqueueDrawCommand(x, y, x, y, color, pacmanRadius * 2, true, startAngle, endAngle);
        }

        drawGhost() {
            const ghostBodyRadius = this.cellSize * 0.4;
            const ghostLegRadius = this.cellSize * 0.15;
            const x = this.ghost.x;
            const y = this.ghost.y;
            const color = this.ghost.frightened ? '#0000FF' : '#FF4D4D'; // Azul si está asustado, rojo normal

            // Cuerpo del fantasma (semi-círculo superior + rectángulo inferior)
            // Círculo superior
            enqueueDrawCommand(x, y - ghostBodyRadius / 2, x, y - ghostBodyRadius / 2, color, ghostBodyRadius * 2, true, Math.PI, 0);
            // Rectángulo inferior (simulado con línea gruesa)
            enqueueDrawCommand(x - ghostBodyRadius, y - ghostBodyRadius / 2, x + ghostBodyRadius, y + ghostBodyRadius, color, ghostBodyRadius);

            // Pies del fantasma (simulados con círculos pequeños)
            enqueueDrawCommand(x - ghostBodyRadius * 0.7, y + ghostBodyRadius, x - ghostBodyRadius * 0.7, y + ghostBodyRadius, color, ghostLegRadius * 2);
            enqueueDrawCommand(x, y + ghostBodyRadius, x, y + ghostBodyRadius, color, ghostLegRadius * 2);
            enqueueDrawCommand(x + ghostBodyRadius * 0.7, y + ghostBodyRadius, x + ghostBodyRadius * 0.7, y + ghostBodyRadius, color, ghostLegRadius * 2);
        }

        moveCharacter(character) {
            // Intentar mover en la dirección deseada primero (si es Pac-Man)
            if (character === this.pacman && character.direction !== character.nextDirection) {
                if (this.canMove(character.x, character.y, character.nextDirection, character.speed)) {
                    character.direction = character.nextDirection;
                }
            }

            // Mover en la dirección actual
            let newX = character.x;
            let newY = character.y;

            if (character.direction === 'up') newY -= character.speed;
            else if (character.direction === 'down') newY += character.speed;
            else if (character.direction === 'left') newX -= character.speed;
            else if (character.direction === 'right') newX += character.speed;

            // Verificar colisiones con paredes antes de actualizar la posición
            if (this.canMove(character.x, character.y, character.direction, character.speed)) {
                character.x = newX;
                character.y = newY;
            }

            // Manejar teletransporte en los túneles laterales
            if (character.x < 0) {
                character.x = this.mapWidth * this.cellSize;
            } else if (character.x > this.mapWidth * this.cellSize) {
                character.x = 0;
            }
        }

        canMove(x, y, direction, speed) {
            const nextCellX = Math.floor((x + (direction === 'right' ? speed : direction === 'left' ? -speed : 0)) / this.cellSize);
            const nextCellY = Math.floor((y + (direction === 'down' ? speed : direction === 'up' ? -speed : 0)) / this.cellSize);

            // Asegurarse de que las coordenadas estén dentro de los límites del mapa
            if (nextCellX < 0 || nextCellX >= this.mapWidth || nextCellY < 0 || nextCellY >= this.mapHeight) {
                // Permitir movimiento a través del túnel (coordenadas 0, 14 y 27, 14 del mapa)
                if ((y / this.cellSize >= 14 && y / this.cellSize < 15) && (nextCellX < 0 || nextCellX >= this.mapWidth)) {
                    return true;
                }
                return false; // Colisión con el límite del canvas si no es el túnel
            }

            const currentMapValue = this.map[nextCellY][nextCellX];
            return currentMapValue !== 1; // No se puede mover si la siguiente celda es una pared
        }

        moveGhostAI() {
            // Implementación simple: el fantasma se mueve aleatoriamente o hacia Pac-Man
            const targetX = this.pacman.x;
            const targetY = this.pacman.y;

            const possibleDirections = [];
            const currentMapX = Math.floor(this.ghost.x / this.cellSize);
            const currentMapY = Math.floor(this.ghost.y / this.cellSize);

            // Probar todas las direcciones posibles que no sean paredes o la dirección opuesta
            ['up', 'down', 'left', 'right'].forEach(dir => {
                let checkX = currentMapX;
                let checkY = currentMapY;
                if (dir === 'up') checkY--;
                else if (dir === 'down') checkY++;
                else if (dir === 'left') checkX--;
                else if (dir === 'right') checkX++;

                // Asegurar que no se salga del mapa antes de verificar la pared
                if (checkX >= 0 && checkX < this.mapWidth && checkY >= 0 && checkY < this.mapHeight && this.map[checkY][checkX] !== 1) {
                    // Evitar invertir la dirección a menos que sea un callejón sin salida
                    const oppositeDir = { 'up': 'down', 'down': 'up', 'left': 'right', 'right': 'left' }[dir];
                    if (this.ghost.direction !== oppositeDir || this.isDeadEnd(currentMapX, currentMapY, dir)) {
                         possibleDirections.push(dir);
                    }
                }
            });

            let bestDirection = this.ghost.direction;
            let minDistance = Infinity;

            if (possibleDirections.length > 0) {
                if (this.ghost.frightened) {
                    // Si está asustado, se mueve en dirección opuesta a Pac-Man
                    // o aleatoriamente si no hay una "mejor" dirección para huir
                    let farthestDistance = -1;
                    possibleDirections.forEach(dir => {
                        const testX = this.ghost.x + (dir === 'right' ? this.ghost.speed : dir === 'left' ? -this.ghost.speed : 0);
                        const testY = this.ghost.y + (dir === 'down' ? this.ghost.speed : dir === 'up' ? -this.ghost.speed : 0);
                        const dist = Math.sqrt(Math.pow(testX - targetX, 2) + Math.pow(testY - targetY, 2));
                        if (dist > farthestDistance) {
                            farthestDistance = dist;
                            bestDirection = dir;
                        }
                    });
                } else {
                    // Comportamiento normal: buscar Pac-Man (heurística simple)
                    possibleDirections.forEach(dir => {
                        const testX = this.ghost.x + (dir === 'right' ? this.ghost.speed : dir === 'left' ? -this.ghost.speed : 0);
                        const testY = this.ghost.y + (dir === 'down' ? this.ghost.speed : dir === 'up' ? -this.ghost.speed : 0);
                        const dist = Math.sqrt(Math.pow(testX - targetX, 2) + Math.pow(testY - targetY, 2));
                        if (dist < minDistance) {
                            minDistance = dist;
                            bestDirection = dir;
                        }
                    });
                }
            }
            this.ghost.direction = bestDirection;
            this.moveCharacter(this.ghost);
        }

        isDeadEnd(x, y, currentDir) {
            let exits = 0;
            const directions = ['up', 'down', 'left', 'right'];
            directions.forEach(dir => {
                let checkX = x;
                let checkY = y;
                if (dir === 'up') checkY--;
                else if (dir === 'down') checkY++;
                else if (dir === 'left') checkX--;
                else if (dir === 'right') checkX++;

                if (checkX >= 0 && checkX < this.mapWidth && checkY >= 0 && checkY < this.mapHeight && this.map[checkY][checkX] !== 1) {
                    exits++;
                }
            });
            return exits <= 1; // Un callejón sin salida si solo hay 0 o 1 salida
        }

        resetGhostPosition() {
            this.ghost.x = 13.5 * this.cellSize;
            this.ghost.y = 12.5 * this.cellSize;
            this.ghost.direction = 'left';
            this.ghost.frightened = false;
            this.ghost.frightenedTimer = 0;
        }

        checkDotCollision() {
            this.dots.forEach(dot => {
                if (!dot.eaten) {
                    const distance = Math.sqrt(Math.pow(this.pacman.x - dot.x, 2) + Math.pow(this.pacman.y - dot.y, 2));
                    if (distance < this.cellSize * 0.3) { // Colisión más precisa para puntos
                        dot.eaten = true;
                        this.score += 10;
                        this.updateScoreDisplay();
                    }
                }
            });
        }

        checkPowerPillCollision() {
            this.powerPills.forEach(pill => {
                if (!pill.eaten) {
                    const distance = Math.sqrt(Math.pow(this.pacman.x - pill.x, 2) + Math.pow(this.pacman.y - pill.y, 2));
                    if (distance < this.cellSize * 0.5) { // Colisión para píldoras grandes
                        pill.eaten = true;
                        this.score += 50;
                        this.updateScoreDisplay();
                        this.ghost.frightened = true;
                        this.ghost.frightenedTimer = 50; // Fantasma asustado por 5 segundos (50 * 100ms)
                    }
                }
            });
        }

        checkCollision(obj1, obj2, distThreshold) {
            const distance = Math.sqrt(Math.pow(obj1.x - obj2.x, 2) + Math.pow(obj1.y - obj2.y, 2));
            return distance < distThreshold;
        }

        handleKeyInput(e) {
            const key = e.key;
            if (key === 'ArrowUp') this.pacman.nextDirection = 'up';
            else if (key === 'ArrowDown') this.pacman.nextDirection = 'down';
            else if (key === 'ArrowLeft') this.pacman.nextDirection = 'left';
            else if (key === 'ArrowRight') this.pacman.nextDirection = 'right';
        }

        updateScoreDisplay() {
            const scoreDisplay = document.getElementById('pacman-score');
            if (scoreDisplay) scoreDisplay.textContent = this.score;
        }

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

    const initPacmanGame = () => {
        new PacmanGame();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPacmanGame);
    } else {
        setTimeout(initPacmanGame, 500);
    }
})();