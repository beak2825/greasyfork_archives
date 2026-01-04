// ==UserScript==
// @name         Drawaria Pong Engine
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Create a vertical and ultra-smooth Pong game on the Drawaria canvas
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        none
// @icon         data:image/gif;base64,R0lGODlhEAAQAKEDAP+/3/9/vwAAAP///yH/C05FVFNDQVBFMi4wAwEAAAAh/glqZXN1czIwOTkAIfkEAQACAwAsAAAAABAAEAAAAkCcL5nHlgFiWE3AiMFkNnvBed42CCJgmlsnplhyonIEZ8ElQY8U66X+oZF2ogkIYcFpKI6b4uls3pyKqfGJzRYAACH5BAEIAAMALAgABQAFAAMAAAIFhI8ioAUAIfkEAQgAAwAsCAAGAAUAAgAAAgSEDHgFADs=
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551568/Drawaria%20Pong%20Engine.user.js
// @updateURL https://update.greasyfork.org/scripts/551568/Drawaria%20Pong%20Engine.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* ---------- SHARED SYSTEM COMPONENTS (Optimized for Drawaria) ---------- */
    let drawariaSocket = null;
    let drawariaCanvas = null;
    let drawariaCtx = null;

    // Cola de comandos optimizada con agrupamiento inteligente
    const commandQueue = [];
    let batchProcessor = null;
    const BATCH_SIZE = 10; // Aumentado ligeramente para más fluidez
    const BATCH_INTERVAL = 40; // Reducido el intervalo para enviar a ~25 FPS de red.

    // Intercepta WebSocket para capturar el socket del juego
    const originalWebSocketSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function(...args) {
        if (!drawariaSocket && this.url && this.url.includes('drawaria')) {
            drawariaSocket = this;
            console.log('🔗 Drawaria WebSocket capturado para el juego de Pong.');
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
     * Función unificada para encolar comandos de dibujo (Filled Shapes).
     * @param {number} x1 - Coordenada X inicial (centro de la forma)
     * @param {number} y1 - Coordenada Y inicial (centro de la forma)
     * @param {string} color - Color del objeto (ej. '#FFFFFF')
     * @param {number} thickness - Grosor efectivo (negativo para relleno en el servidor)
     * @param {boolean} isServerCommand - Si se añade a la cola del servidor.
     */
    function enqueueDrawCommand(x1, y1, color, thickness, isServerCommand = true) {
        if (!drawariaCanvas) return;

        const thickAbs = Math.abs(thickness);

        // Renderizado local para retroalimentación visual inmediata (MAX FPS)
        if (drawariaCtx) {
            drawariaCtx.fillStyle = color; // Usar fillStyle para mejor representación de formas llenas

            // Simulación de círculo (para la pelota)
            if (thickAbs < 100) { // Asumimos que grosor pequeño es la pelota
                drawariaCtx.beginPath();
                drawariaCtx.arc(x1, y1, thickAbs / 2.5, 0, Math.PI * 2);
                drawariaCtx.fill();
            } else { // Simulación de rectángulo para la paleta (aunque Drawaria lo dibuje como un óvalo)
                 // Para la paleta, dibujamos el óvalo centrado con el grosor de la paleta.
                 drawariaCtx.strokeStyle = color;
                 drawariaCtx.lineWidth = thickAbs;
                 drawariaCtx.lineCap = 'butt'; // Mejor para rectángulos simulados
                 drawariaCtx.beginPath();
                 drawariaCtx.moveTo(x1, y1 - thickAbs / 2 + 0.1); // Pequeña línea vertical
                 drawariaCtx.lineTo(x1, y1 + thickAbs / 2 - 0.1);
                 drawariaCtx.stroke();
            }
        }

        // SERVER COMMAND (para otros jugadores)
        if (isServerCommand && drawariaSocket) {
            const normX1 = (x1 / drawariaCanvas.width).toFixed(4);
            const normY1 = (y1 / drawariaCanvas.height).toFixed(4);
            // Usamos un desplazamiento mínimo para simular un "punto" para la forma rellena
            const normX2 = (x1 / drawariaCanvas.width + 0.0001).toFixed(4);
            const normY2 = (y1 / drawariaCanvas.height + 0.0001).toFixed(4);

            // La clave: grosor negativo para forma rellena
            const cmd = `42["drawcmd",0,[${normX1},${normY1},${normX2},${normY2},false,${-thickAbs},"${color}",0,0,{}]]`;
            commandQueue.push(cmd);
        }
    }

    /* ---------- PONG GAME LOGIC AND PHYSICS ---------- */

    const PONG_CONSTANTS = {
        PADDLE_WIDTH: 15,
        PADDLE_HEIGHT: 120,
        PADDLE_SPEED: 400,
        BALL_RADIUS: 20,
        BALL_INITIAL_SPEED: 350,
        TIMESTEP: 1 / 60, // Física a 60 Hz
        MAX_VELOCITY: 800,
        WALL_OFFSET: 30,
        BACKGROUND_COLOR: '#000000', // Tinted black
        BOT_PADDLE_COLOR: '#FF0000', // Red
        PLAYER_PADDLE_COLOR: '#0000FF', // Blue
        BALL_COLOR: '#FFFFFF', // White
        RENDER_INTERVAL: 1000 / 30, // Red a 30 FPS (para comandos)

        // Grosor estandarizado (es el grosor negativo que se enviará al servidor)
        BALL_THICKNESS: 20 * 2.5, // ~50
        PADDLE_THICKNESS: 120 * 1.05, // ~126 (ligeramente más que la altura)
    };

    class VerticalPongGame {
        constructor() {
            this.isActive = false;
            this.lastTime = 0;
            this.renderTime = 0;

            this.score = { player: 0, bot: 0 };
            this.input = { up: false, down: false };

            this.player = null;
            this.bot = null;
            this.ball = null;
            this.W = 0;
            this.H = 0;

            this.init();
        }

        init() {
            const checkGameReady = () => {
                const gameCanvas = document.getElementById('canvas');
                if (gameCanvas) {
                    drawariaCanvas = gameCanvas;
                    drawariaCtx = gameCanvas.getContext('2d');
                    this.W = drawariaCanvas.width;
                    this.H = drawariaCanvas.height;
                    this.createGamePanel();
                    this.setupEventListeners();
                    // Llama a dibujar el fondo negro una única vez al inicio
                    this.drawBackground();
                    console.log('✅ Drawaria Pong Game inicializado.');
                } else {
                    setTimeout(checkGameReady, 100);
                }
            };
            checkGameReady();
        }

        drawBackground() {
            // Dibuja el fondo negro de forma PERMANENTE en el servidor.
            enqueueDrawCommand(
                this.W / 2, this.H / 2,
                PONG_CONSTANTS.BACKGROUND_COLOR,
                Math.max(this.W, this.H) * 2,
                true // Enviar al servidor
            );
        }

        // ... (createGamePanel, setupEventListeners, toggleGame, pauseGame remain the same)
        createGamePanel() {
            const existingPanel = document.getElementById('pong-game-panel');
            if (existingPanel) existingPanel.remove();

            const panel = document.createElement('div');
            panel.id = 'pong-game-panel';
            panel.style.cssText = `
                position: fixed !important;
                top: 250px !important;
                right: 20px !important;
                width: 250px !important;
                z-index: 2147483647 !important;
                background: linear-gradient(135deg, #001f3f, #000a14) !important;
                border: 2px solid #0000FF !important;
                border-radius: 12px !important;
                color: white !important;
                font-family: 'Segoe UI', Arial, sans-serif !important;
                box-shadow: 0 0 20px rgba(0, 0, 255, 0.3) !important;
                padding: 15px !important;
                text-align: center !important;
            `;

            panel.innerHTML = `
                <h3 style="margin-top: 0; color: #0000FF;">🔵 Vertical Pong Engine 🔴</h3>
                <div style="margin-bottom: 10px; font-size: 1.2em; font-weight: bold;">
                    Score: <span id="player-score">0</span> - <span id="bot-score">0</span>
                </div>
                <button id="toggle-game" style="
                    width: 100%;
                    padding: 10px;
                    background: #0000FF;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: bold;
                ">▶️ Start Pong</button>
                <div id="game-message" style="
                    margin-top: 10px;
                    color: #FFD700;
                    font-weight: bold;
                ">Ready to Play!</div>
                <div style="
                    margin-top: 15px;
                    font-size: 10px;
                    color: rgba(255,255,255,0.6);
                    text-align: left;
                ">
                    <p style="margin: 3px 0;">Control Player Paddle (Blue):</p>
                    <ul style="padding-left: 20px; margin: 3px 0;">
                        <li>ArrowUp or W: Move Up</li>
                        <li>ArrowDown or S: Move Down</li>
                    </ul>
                </div>
            `;
            document.body.appendChild(panel);
            this.makePanelDraggable(panel);
        }

        setupEventListeners() {
            document.getElementById('toggle-game').addEventListener('click', () => this.toggleGame());
            document.addEventListener('keydown', (e) => this.handleKeyInput(e, true));
            document.addEventListener('keyup', (e) => this.handleKeyInput(e, false));
        }

        toggleGame() {
            if (!this.isActive) {
                this.startGame();
                document.getElementById('toggle-game').textContent = '⏸️ Pause Game';
                document.getElementById('toggle-game').style.background = '#FFD700';
            } else {
                this.pauseGame();
                document.getElementById('toggle-game').textContent = '▶️ Resume Game';
                document.getElementById('toggle-game').style.background = '#0000FF';
            }
        }

        startGame() {
            if (this.isActive || !drawariaCanvas) return;
            this.isActive = true;
            this.score = { player: 0, bot: 0 };
            this.resetGameObjects();
            this.updateScoreDisplay();
            // Re-draw background just in case was overdrawn
            this.drawBackground();
            this.gameLoop(performance.now());
            console.log('🚀 Pong Game Started!');
        }

        pauseGame() {
            this.isActive = false;
            document.getElementById('game-message').textContent = 'Game Paused!';
            console.log('🛑 Pong Game Paused.');
        }


        resetGameObjects() {
            const W = this.W;
            const H = this.H;
            const P = PONG_CONSTANTS;

            // Initialize Player Paddle (Blue, Right Side)
            this.player = {
                id: 'player', color: P.PLAYER_PADDLE_COLOR, thickness: P.PADDLE_THICKNESS,
                x: W - P.WALL_OFFSET - P.PADDLE_WIDTH / 2, y: H / 2,
                W: P.PADDLE_WIDTH, H: P.PADDLE_HEIGHT,
                lastRenderX: W - P.WALL_OFFSET - P.PADDLE_WIDTH / 2, lastRenderY: H / 2
            };
            // Initialize Bot Paddle (Red, Left Side)
            this.bot = {
                id: 'bot', color: P.BOT_PADDLE_COLOR, thickness: P.PADDLE_THICKNESS,
                x: P.WALL_OFFSET + P.PADDLE_WIDTH / 2, y: H / 2,
                W: P.PADDLE_WIDTH, H: P.PADDLE_HEIGHT,
                lastRenderX: P.WALL_OFFSET + P.PADDLE_WIDTH / 2, lastRenderY: H / 2
            };

            this.resetBall();
        }

        resetBall(direction = 1) {
            const W = this.W;
            const H = this.H;
            const P = PONG_CONSTANTS;

            // Reset ball to center
            this.ball = {
                id: 'ball', color: P.BALL_COLOR, thickness: P.BALL_THICKNESS,
                x: W / 2, y: H / 2, radius: P.BALL_RADIUS,
                lastRenderX: W / 2, lastRenderY: H / 2,
                // Initial velocity: Random vertical, fixed horizontal (direction * speed)
                vx: direction * P.BALL_INITIAL_SPEED,
                vy: (Math.random() * 2 - 1) * P.BALL_INITIAL_SPEED * 0.5
            };
        }

        gameLoop(currentTime) {
            if (!this.isActive) return;

            const dt = PONG_CONSTANTS.TIMESTEP;
            const timeElapsed = (currentTime - (this.lastTime || currentTime)) / 1000;
            this.lastTime = currentTime;

            // --- 1. LOCAL CLEAR (For local ultra-fluidity) ---
            if (drawariaCtx) {
                drawariaCtx.clearRect(0, 0, this.W, this.H);
            }

            // --- 2. Update Physics ---
            this.updatePhysics(dt);

            // --- 3. LOCAL RENDER (Draws locally at maximum FPS via enqueueDrawCommand) ---
            this.localRender();


            // --- 4. NETWORK RENDER (Sends commands to server at fixed rate) ---
            if (currentTime - this.renderTime >= PONG_CONSTANTS.RENDER_INTERVAL) {
                this.networkRender();
                this.renderTime = currentTime;
            }

            requestAnimationFrame((t) => this.gameLoop(t));
        }

        localRender() {
             // Draw background locally (optional, but ensures black background on local client)
            enqueueDrawCommand(
                this.W / 2, this.H / 2,
                PONG_CONSTANTS.BACKGROUND_COLOR,
                Math.max(this.W, this.H) * 2,
                false // NO enviar al servidor
            );

            this.drawObject(this.player, false);
            this.drawObject(this.bot, false);
            this.drawObject(this.ball, false);
        }

        networkRender() {
            const objects = [this.player, this.bot, this.ball];

            objects.forEach(obj => {
                const isMoved = Math.abs(obj.x - obj.lastRenderX) > 1 || Math.abs(obj.y - obj.lastRenderY) > 1;

                if (isMoved || obj.lastRenderX === -9999) {
                    // Step 1: ERASE (Dirty Erase) at old position using background color
                    if (obj.lastRenderX !== -9999) {
                        this.drawObject(obj, true, obj.lastRenderX, obj.lastRenderY, PONG_CONSTANTS.BACKGROUND_COLOR);
                    }

                    // Step 2: DRAW at new position
                    this.drawObject(obj, true, obj.x, obj.y, obj.color);

                    // Update last render position
                    obj.lastRenderX = obj.x;
                    obj.lastRenderY = obj.y;
                }
            });
        }

        drawObject(obj, isServer, x, y, color) {
            const drawX = x !== undefined ? x : obj.x;
            const drawY = y !== undefined ? y : obj.y;
            const drawColor = color !== undefined ? color : obj.color;

            enqueueDrawCommand(drawX, drawY, drawColor, obj.thickness, isServer);
        }

        updatePhysics(dt) {
            if (!this.ball || !this.player || !this.bot) return;

            // --- 1. Update Player Paddle Position ---
            let playerNewY = this.player.y;
            if (this.input.up) {
                playerNewY -= PONG_CONSTANTS.PADDLE_SPEED * dt;
            }
            if (this.input.down) {
                playerNewY += PONG_CONSTANTS.PADDLE_SPEED * dt;
            }
            // Clamp player paddle position
            const playerMinY = PONG_CONSTANTS.PADDLE_HEIGHT / 2;
            const playerMaxY = this.H - PONG_CONSTANTS.PADDLE_HEIGHT / 2;
            this.player.y = Math.max(playerMinY, Math.min(playerMaxY, playerNewY));

            // --- 2. Update Bot Paddle Position (Simple AI) ---
            const botCenter = this.bot.y;
            const ballCenter = this.ball.y;
            const deltaY = ballCenter - botCenter;
            const botSpeed = PONG_CONSTANTS.PADDLE_SPEED * 0.7;

            if (Math.abs(deltaY) > 20) {
                this.bot.y += Math.sign(deltaY) * Math.min(Math.abs(deltaY), botSpeed * dt);
            }
            // Clamp bot paddle position
            const botMinY = PONG_CONSTANTS.PADDLE_HEIGHT / 2;
            const botMaxY = this.H - PONG_CONSTANTS.PADDLE_HEIGHT / 2;
            this.bot.y = Math.max(botMinY, Math.min(botMaxY, this.bot.y));

            // --- 3. Update Ball Position ---
            this.ball.x += this.ball.vx * dt;
            this.ball.y += this.ball.vy * dt;

            // --- 4. Ball Wall Collision (Top/Bottom) ---
            const minH = this.ball.radius;
            const maxH = this.H - this.ball.radius;
            if (this.ball.y < minH || this.ball.y > maxH) {
                this.ball.vy *= -1;
                this.ball.y = this.ball.y < minH ? minH : maxH;
            }

            // --- 5. Ball Paddle Collision (Player & Bot) ---
            this.checkPaddleCollision(this.player);
            this.checkPaddleCollision(this.bot);

            // --- 6. Ball Goal Check (Left/Right) ---
            this.checkGoal();
        }

        checkPaddleCollision(paddle) {
            const ball = this.ball;
            const paddleHalfH = paddle.H / 2;

            // Horizontal intersection point (closest edge of the paddle to the ball)
            let paddleHitX;
            if (paddle === this.player) {
                paddleHitX = paddle.x - paddle.W / 2; // Left edge of player paddle
            } else { // bot
                paddleHitX = paddle.x + paddle.W / 2; // Right edge of bot paddle
            }

            // Vertical check: within paddle Y-bounds
            const isCollidingY = ball.y + ball.radius > paddle.y - paddleHalfH &&
                                 ball.y - ball.radius < paddle.y + paddleHalfH;

            // Horizontal check: ball hits the side of the paddle
            const isCollidingX = (ball.vx > 0 && ball.x + ball.radius >= paddleHitX && paddle === this.player) ||
                                 (ball.vx < 0 && ball.x - ball.radius <= paddleHitX && paddle === this.bot);


            if (isCollidingX && isCollidingY) {
                // Positional correction: Push ball out to prevent multi-hit
                if (paddle === this.player) {
                    ball.x = paddleHitX - ball.radius;
                } else {
                    ball.x = paddleHitX + ball.radius;
                }

                // 1. Reverse horizontal direction
                ball.vx *= -1;

                // 2. Angle/Vertical speed adjustment
                const relativeIntersectY = (ball.y - paddle.y);
                const normalizedRelativeIntersectionY = relativeIntersectY / paddleHalfH; // -1 to 1
                const bounceAngle = normalizedRelativeIntersectionY * (Math.PI / 4);
                const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy) * 1.05;

                ball.vx = Math.cos(bounceAngle) * speed * Math.sign(ball.vx);
                ball.vy = Math.sin(bounceAngle) * speed;

                // 3. Limit max speed
                const currentSpeed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
                if (currentSpeed > PONG_CONSTANTS.MAX_VELOCITY) {
                    ball.vx = (ball.vx / currentSpeed) * PONG_CONSTANTS.MAX_VELOCITY;
                    ball.vy = (ball.vy / currentSpeed) * PONG_CONSTANTS.MAX_VELOCITY;
                }
            }
        }

        checkGoal() {
            const W = this.W;
            const ballX = this.ball.x;

            if (ballX < 0) {
                // Goal scored by Player (passed left side)
                this.score.player++;
                this.updateScoreDisplay();
                document.getElementById('game-message').textContent = 'GOAL! Player Scores!';
                this.resetBall(-1); // Start ball towards the bot (left)
            } else if (ballX > W) {
                // Goal scored by Bot (passed right side)
                this.score.bot++;
                this.updateScoreDisplay();
                document.getElementById('game-message').textContent = 'GOAL! Bot Scores!';
                this.resetBall(1); // Start ball towards the player (right)
            }
        }

        // ... (handleKeyInput, updateScoreDisplay, makePanelDraggable remain the same)
        handleKeyInput(e, isKeyDown) {
            const key = e.key.toLowerCase();
            if (key === 'arrowup' || key === 'w') {
                this.input.up = isKeyDown;
                e.preventDefault();
            }
            if (key === 'arrowdown' || key === 's') {
                this.input.down = isKeyDown;
                e.preventDefault();
            }
        }

        updateScoreDisplay() {
            document.getElementById('player-score').textContent = this.score.player;
            document.getElementById('bot-score').textContent = this.score.bot;
            document.getElementById('game-message').textContent = `Player: ${this.score.player} | Bot: ${this.score.bot}`;
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
            header.style.cursor = 'grab';
            header.addEventListener("mousedown", dragStart);
            document.addEventListener("mouseup", dragEnd);
            document.addEventListener("mousemove", drag);
        }
    }

    // Initialization of the Pong Game
    const initPongGame = () => {
        const pongGame = new VerticalPongGame();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPongGame);
    } else {
        setTimeout(initPongGame, 500);
    }

})();