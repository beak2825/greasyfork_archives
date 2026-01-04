// ==UserScript==
// @name         Drawaria Snake Game
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Crea un juego de Snake totalmente funcional y optimizado para el canvas de Drawaria.online, con escenario de jardín y un panel arrastrable.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        none
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/549552/Drawaria%20Snake%20Game.user.js
// @updateURL https://update.greasyfork.org/scripts/549552/Drawaria%20Snake%20Game.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* ---------- COMPONENTES COMPARTIDOS DEL SISTEMA ---------- */
    let drawariaSocket = null;
    let drawariaCanvas = null;
    let drawariaCtx = null;

    // Cola de comandos optimizada con agrupamiento inteligente
    const commandQueue = [];
    let batchProcessor = null;
    const BATCH_SIZE = 8;
    const BATCH_INTERVAL = 60;

    // Intercepta WebSocket para capturar el socket del juego
    const originalWebSocketSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function(...args) {
        if (!drawariaSocket && this.url && this.url.includes('drawaria')) {
            drawariaSocket = this;
            console.log('🔗 Drawaria WebSocket capturado para el juego de Snake.');
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
     * Utiliza una línea muy corta con grosor negativo para dibujar formas rellenas.
     * @param {number} x1 - Coordenada X inicial
     * @param {number} y1 - Coordenada Y inicial
     * @param {number} x2 - Coordenada X final
     * @param {number} y2 - Coordenada Y final
     * @param {string} color - Color del objeto (ej. '#FFFFFF')
     * @param {number} thickness - Grosor efectivo (negativo para relleno)
     */
    function enqueueDrawCommand(x1, y1, x2, y2, color, thickness) {
        if (!drawariaCanvas || !drawariaSocket) return;

        const normX1 = (x1 / drawariaCanvas.width).toFixed(4);
        const normY1 = (y1 / drawariaCanvas.height).toFixed(4);
        const normX2 = (x2 / drawariaCanvas.width).toFixed(4);
        const normY2 = (y2 / drawariaCanvas.height).toFixed(4);

        const cmd = `42["drawcmd",0,[${normX1},${normY1},${normX2},${normY2},false,${-Math.abs(thickness)},"${color}",0,0,{}]]`;
        commandQueue.push(cmd);

        // Renderizado local para retroalimentación visual inmediata
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

    /* ---------- LÓGICA DEL JUEGO DE SNAKE ---------- */
    class SnakeGame {
        constructor() {
            this.isActive = false;
            this.cellSize = 20; // Tamaño de cada segmento de la serpiente
            this.snake = [];
            this.food = {};
            this.direction = 'right';
            this.nextDirection = 'right';
            this.score = 0;
            this.gameInterval = null;
            this.speed = 150; // Velocidad inicial en ms
            this.isGameOver = false;

            this.init();
        }

        init() {
            const checkGameReady = () => {
                const gameCanvas = document.getElementById('canvas');
                if (gameCanvas) {
                    drawariaCanvas = gameCanvas;
                    drawariaCtx = gameCanvas.getContext('2d');
                    this.createGamePanel();
                    console.log('✅ Juego de Snake inicializado.');
                } else {
                    setTimeout(checkGameReady, 100);
                }
            };
            checkGameReady();
        }

        createGamePanel() {
            const existingPanel = document.getElementById('snake-game-panel');
            if (existingPanel) existingPanel.remove();

            const panel = document.createElement('div');
            panel.id = 'snake-game-panel';
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
                <h3 style="margin-top: 0; color: #5d5dff;">🐍 Snake Game</h3>
                <div style="margin-bottom: 10px;">
                    Score: <span id="snake-score">0</span>
                </div>
                <button id="toggle-game" style="
                    width: 100%;
                    padding: 10px;
                    background: #5d5dff;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: bold;
                ">▶️ Start Game</button>
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
                    Use Arrow Keys to move.<br>
                    Avoid walls and yourself!
                </div>
            `;
            document.body.appendChild(panel);
            this.setupEventListeners();
            this.makePanelDraggable(panel);
            this.addDrawGardenButton(panel);
        }

        setupEventListeners() {
            document.getElementById('toggle-game').addEventListener('click', () => this.toggleGame());
            document.addEventListener('keydown', (e) => this.handleKeyInput(e));
        }

        toggleGame() {
            if (!this.isActive) {
                this.startGame();
                document.getElementById('toggle-game').textContent = '⏸️ Pause Game';
                document.getElementById('toggle-game').style.background = '#ffc107';
                document.getElementById('game-message').style.display = 'none';
            } else {
                this.pauseGame();
                document.getElementById('toggle-game').textContent = '▶️ Resume Game';
                document.getElementById('toggle-game').style.background = '#5d5dff';
            }
        }

        startGame() {
            if (this.isActive) return;
            this.isActive = true;
            this.isGameOver = false;
            this.score = 0;
            this.direction = 'right';
            this.nextDirection = 'right';
            this.updateScoreDisplay();
            this.resetSnake();
            this.createFood();
            this.gameLoop();
        }

        pauseGame() {
            this.isActive = false;
            if (this.gameInterval) {
                clearInterval(this.gameInterval);
                this.gameInterval = null;
            }
        }

        endGame() {
            this.isGameOver = true;
            this.pauseGame();
            document.getElementById('toggle-game').textContent = '🔄 Restart Game';
            document.getElementById('toggle-game').style.background = '#cc0000';
            const messageEl = document.getElementById('game-message');
            messageEl.textContent = `GAME OVER! Score: ${this.score}`;
            messageEl.style.display = 'block';
            console.log('💀 GAME OVER! Final Score:', this.score);
        }

        resetSnake() {
            this.snake = [
                { x: 100, y: 100 },
                { x: 80, y: 100 },
                { x: 60, y: 100 }
            ];
        }

        createFood() {
            const maxX = Math.floor(drawariaCanvas.width / this.cellSize) * this.cellSize;
            const maxY = Math.floor(drawariaCanvas.height / this.cellSize) * this.cellSize;

            this.food = {
                x: Math.floor(Math.random() * (maxX / this.cellSize)) * this.cellSize,
                y: Math.floor(Math.random() * (maxY / this.cellSize)) * this.cellSize
            };
        }

        gameLoop() {
            if (!this.isActive || this.isGameOver) return;

            this.clearCanvas();
            this.updateGame();
            this.drawGame();

            this.gameInterval = setTimeout(() => this.gameLoop(), this.speed);
        }

        updateGame() {
            const head = { x: this.snake[0].x, y: this.snake[0].y };
            this.direction = this.nextDirection;

            if (this.direction === 'up') head.y -= this.cellSize;
            if (this.direction === 'down') head.y += this.cellSize;
            if (this.direction === 'left') head.x -= this.cellSize;
            if (this.direction === 'right') head.x += this.cellSize;

            this.snake.unshift(head);

            if (this.checkCollision(head)) {
                this.endGame();
                return;
            }

            if (head.x === this.food.x && head.y === this.food.y) {
                this.score++;
                this.updateScoreDisplay();
                this.createFood();
                this.speed = Math.max(50, this.speed * 0.95);
            } else {
                this.snake.pop();
            }
        }

        drawGame() {
            this.drawCell(this.food.x, this.food.y, '#FF4500'); // Naranja rojizo para la comida

            this.snake.forEach((segment, index) => {
                const color = index === 0 ? '#8BC34A' : '#8BC34A'; // Cabeza verde, cuerpo verde más claro
                this.drawCell(segment.x, segment.y, color);
            });
        }

        drawCell(x, y, color) {
            enqueueDrawCommand(x, y, x + this.cellSize, y + this.cellSize, color, this.cellSize);
        }

        clearCanvas() {
            const oldTail = this.snake[this.snake.length - 1];
            this.drawCell(oldTail.x, oldTail.y, '#4CAF50');
            this.drawCell(this.food.x, this.food.y, '#4CAF50');
        }

        checkCollision(head) {
            if (head.x < 0 || head.x >= drawariaCanvas.width || head.y < 0 || head.y >= drawariaCanvas.height) {
                return true;
            }

            for (let i = 1; i < this.snake.length; i++) {
                if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
                    return true;
                }
            }
            return false;
        }

        handleKeyInput(e) {
            const key = e.key;
            if (key === 'ArrowUp' && this.direction !== 'down') this.nextDirection = 'up';
            if (key === 'ArrowDown' && this.direction !== 'up') this.nextDirection = 'down';
            if (key === 'ArrowLeft' && this.direction !== 'right') this.nextDirection = 'left';
            if (key === 'ArrowRight' && this.direction !== 'left') this.nextDirection = 'right';
        }

        updateScoreDisplay() {
            const scoreDisplay = document.getElementById('snake-score');
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

        addDrawGardenButton(panel) {
            const newButton = document.createElement('button');
            newButton.id = 'draw-garden-btn';
            newButton.textContent = '🖼️ Draw Garden';
            newButton.style.cssText = `
                width: 100%;
                padding: 10px;
                background: #27ae60;
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                margin-top: 10px;
                transition: background 0.3s ease;
            `;
            newButton.onmouseover = function() {
                this.style.background = '#219353';
            };
            newButton.onmouseout = function() {
                this.style.background = '#27ae60';
            };

            const toggleButton = document.getElementById('toggle-game');
            panel.insertBefore(newButton, toggleButton.nextSibling);
            newButton.addEventListener('click', drawGardenScenario);
        }
    }

    // --------------------------------------------------------------------------------------------------
    // --- LÓGICA DEL ESCENARIO DE JARDÍN ---
    // --------------------------------------------------------------------------------------------------

    function drawGardenScenario() {
        if (!drawariaCanvas || !drawariaSocket) {
            console.log('Canvas or WebSocket not available.');
            return;
        }

        // Borra todo el canvas con blanco
        enqueueDrawCommand(0, 0, drawariaCanvas.width, drawariaCanvas.height, '#FFFFFF', Math.max(drawariaCanvas.width, drawariaCanvas.height));

        setTimeout(() => {
            const grassColor = '#4CAF50';
            const flowerColors = ['#FFC107', '#E91E63', '#9C27B0', '#03A9F4'];
            const cellSize = 10;

            // Dibuja el fondo verde
            enqueueDrawCommand(0, 0, drawariaCanvas.width, drawariaCanvas.height, grassColor, Math.max(9999, 9999));

            // Dibuja pequeños detalles para simular hierbas y flores
            for (let i = 0; i < 100; i++) {
                const x = Math.random() * drawariaCanvas.width;
                const y = Math.random() * drawariaCanvas.height;
                const color = flowerColors[Math.floor(Math.random() * flowerColors.length)];

                // Dibuja un pequeño círculo (simula una flor)
                enqueueDrawCommand(x, y, x + 1, y + 1, color, 8);
                // Dibuja una mini-hierba (línea vertical)
                enqueueDrawCommand(x, y, x, y + 5, '#4CAF50', 3);
            }

            console.log('✅ Escenario de jardín dibujado con éxito.');
        }, 200);
    }

    // --------------------------------------------------------------------------------------------------
    // --- FIN DE CÓDIGO AÑADIDO ---
    // --------------------------------------------------------------------------------------------------


    // Inicialización del juego
    const initSnakeGame = () => {
        const snakeGame = new SnakeGame();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSnakeGame);
    } else {
        setTimeout(initSnakeGame, 500);
    }

})();