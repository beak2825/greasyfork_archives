// ==UserScript==
// @name        Drawaria Space Invaders Game
// @namespace   http://tampermonkey.net/
// @version     1.7
// @description Juego clásico Space Invaders en Drawaria.online con gráficos pixel-art personalizados, panel arrastrable y optimización de rastros mejorada.
// @author      YouTubeDrawaria
// @match       https://drawaria.online/*
// @grant       none
// @license     MIT
// @icon        https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/549575/Drawaria%20Space%20Invaders%20Game.user.js
// @updateURL https://update.greasyfork.org/scripts/549575/Drawaria%20Space%20Invaders%20Game.meta.js
// ==/UserScript==
(function() {
    'use strict';

    let drawariaSocket = null;
    let drawariaCanvas = null;
    let drawariaCtx = null;
    const commandQueue = [];
    let batchProcessor = null;
    const BATCH_SIZE = 8;
    const BATCH_INTERVAL = 60; // ms
    const originalWebSocketSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function(...args) {
        if (!drawariaSocket && this.url && this.url.includes('drawaria')) {
            drawariaSocket = this;
            console.log('🔗 Drawaria WebSocket capturado para Space Invaders.');
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
                    console.warn('⚠️ Fallo al enviar comando:', e);
                }
            });
        }, BATCH_INTERVAL);
    }

    // Color de fondo para "borrar" rastros y el escenario espacial
    const BACKGROUND_COLOR = '#000000'; // Negro

    /**
     * Función unificada para encolar comandos de dibujo.
     * Utiliza una línea muy corta con grosor negativo para dibujar formas rellenas (puntos/círculos)
     * o líneas con grosor negativo para "simular" líneas gruesas o rellenos rectangulares.
     * @param {number} x1 - Coordenada X inicial
     * @param {number} y1 - Coordenada Y inicial
     * @param {number} x2 - Coordenada X final
     * @param {number} y2 - Coordenada Y final
     * @param {string} color - Color del objeto (ej. '#FFFFFF')
     * @param {number} thickness - Grosor efectivo (positivo para círculo, negativo para línea gruesa/relleno)
     * @param {boolean} isArc - Si es true, dibuja un círculo con x1,y1 como centro y thickness como diámetro. Si es false, dibuja una línea o un rectángulo relleno (si es una línea corta con grosor negativo).
     * @param {number} startAngle - Ángulo inicial para arcos (usado solo localmente si isArc es true)
     * @param {number} endAngle - Ángulo final para arcos (usado solo localmente si isArc es true)
     */
    function enqueueDrawCommand(x1, y1, x2, y2, color, thickness, isArc = false, startAngle = 0, endAngle = 0) {
        if (!drawariaCanvas || !drawariaSocket) return;

        // Renderizado local para retroalimentación visual inmediata (útil para depuración)
        if (drawariaCtx) {
            drawariaCtx.fillStyle = color; // Para formas rellenas
            drawariaCtx.strokeStyle = color; // Para líneas
            drawariaCtx.lineWidth = Math.abs(thickness); // Usa el valor absoluto para el grosor local
            drawariaCtx.lineCap = 'butt'; // Para líneas cuadradas, no redondas
            drawariaCtx.lineJoin = 'miter'; // Para esquinas cuadradas
            if (isArc) { // Para dibujar círculos/píxeles rellenos localmente
                drawariaCtx.beginPath();
                drawariaCtx.arc(x1, y1, Math.abs(thickness) / 2, startAngle, endAngle);
                drawariaCtx.fill(); // Rellenar el círculo
            } else { // Para líneas o rectángulos rellenos (interpretando thickness como alto/ancho)
                // Si x1 == x2 y y1 == y2 (o muy cercanos), Drawaria puede interpretar como punto/círculo.
                // Para garantizar un rectángulo localmente, podemos usar fillRect para el feedback.
                // Sin embargo, para Drawaria, una línea muy gruesa (grosor negativo) actuará como un relleno rectangular.
                // Si la "línea" es horizontal (y1=y2), actuará como un rect.width = x2-x1, rect.height = thickness
                // Si la "línea" es vertical (x1=x2), actuará como un rect.width = thickness, rect.height = y2-y1
                // Dado que estamos enviando una línea de un punto a otro con un grosor,
                // localmente esto dibujará una línea de ese grosor.
                drawariaCtx.beginPath();
                drawariaCtx.moveTo(x1, y1);
                drawariaCtx.lineTo(x2, y2);
                drawariaCtx.stroke(); // Dibuja la línea gruesa/rectángulo
            }
        }

        const normX1 = (x1 / drawariaCanvas.width).toFixed(4);
        const normY1 = (y1 / drawariaCanvas.height).toFixed(4);
        const normX2 = (x2 / drawariaCanvas.width).toFixed(4);
        const normY2 = (y2 / drawariaCanvas.height).toFixed(4);
        let cmd;
        // Para el servidor, los círculos/píxeles se envían como puntos con grosor negativo (si isArc es true).
        // Las líneas o rectángulos rellenos se envían con grosor negativo (si isArc es false).
        // El cliente de Drawaria interpreta un comando de línea con grosor negativo como un rectángulo relleno.
        cmd = `42["drawcmd",0,[${normX1},${normY1},${normX2},${normY2},false,${-Math.abs(thickness)},"${color}",0,0,{}]]`;
        commandQueue.push(cmd);
    }

    // --- CONSTANTES Y FUNCIÓN AUXILIAR PARA PIXEL ART ---
    // ✅ Cambio para mayor GROSOR: Aumentar el valor de PIXEL_SCALE para píxeles más gruesos y cuadrados.
    const PIXEL_SCALE = 8; // Cada "píxel" en nuestras matrices y el grosor de los elementos será de 8x8 en el canvas

    // Forma del invasor (11x8 píxeles)
    const INVADER_PIXELS = [
        [0,1,1,0,0,0,0,0,1,1,0],
        [1,1,1,1,1,1,1,1,1,1,1],
        [1,1,0,0,1,1,1,0,0,1,1],
        [1,1,0,0,1,1,1,0,0,1,1],
        [0,1,1,1,1,1,1,1,1,1,0],
        [0,0,1,1,1,1,1,1,1,0,0],
        [0,1,0,0,0,0,0,0,0,1,0],
        [0,0,1,0,0,0,0,0,1,0,0]
    ];
    const INVADER_WIDTH_PX = 11;
    const INVADER_HEIGHT_PX = 8;
    const INVADER_COLOR = '#00FF00'; // Verde

    // Forma del jugador (13x8 píxeles)
    const PLAYER_PIXELS = [
        [0,0,0,0,0,1,1,1,0,0,0,0,0],
        [0,0,0,0,1,1,1,1,1,0,0,0,0],
        [0,0,0,1,1,1,1,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,1,1,1,1,0,0],
        [0,1,1,1,1,1,1,1,1,1,1,1,0],
        [1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];
    const PLAYER_WIDTH_PX = 13;
    const PLAYER_HEIGHT_PX = 8;
    const PLAYER_COLOR = '#00FFFF'; // Azul vibrante / Cian

    // Función auxiliar para dibujar formas de pixel art
    function drawPixelShape(originX, originY, pixelMap, color, pixelSize) {
        for (let y = 0; y < pixelMap.length; y++) {
            for (let x = 0; x < pixelMap[y].length; x++) {
                if (pixelMap[y][x] === 1) {
                    const px = originX + x * pixelSize;
                    const py = originY + y * pixelSize;
                    // ✅ CAMBIO CLAVE: Dibuja cada "píxel" como un rectángulo relleno
                    // Envía una línea horizontal de longitud `pixelSize` con grosor `pixelSize`.
                    // Esto crea un cuadrado relleno. isArc es false.
                    enqueueDrawCommand(px, py + pixelSize / 2, px + pixelSize, py + pixelSize / 2, color, pixelSize, false);
                }
            }
        }
    }
    // --- FIN DE LAS NUEVAS CONSTANTES Y FUNCIÓN AUXILIAR ---

    class SpaceInvadersGame {
        constructor() {
            this.isActive = false;
            // Ajustar tamaños de jugador basados en el pixel art y la escala
            this.playerWidth = PLAYER_WIDTH_PX * PIXEL_SCALE;
            this.playerHeight = PLAYER_HEIGHT_PX * PIXEL_SCALE;
            this.playerSpeed = 6 * (PIXEL_SCALE / 6); // Ajustar velocidad para la nueva escala

            this.bullets = [];
            // Velocidad de bala ajustada para intervalo de 5 segundos y "más arriba"
            this.bulletSpeed = 50;
            this.canShoot = true;
            this.shootCooldown = 300; // ms

            this.invaders = [];
            this.invaderRows = 1; // Solo una fila de invasores
            this.invaderCols = 5; // Un total de 5 invasores
            // Ajustar tamaños de invasores basados en el pixel art y la escala
            this.invaderWidth = INVADER_WIDTH_PX * PIXEL_SCALE;
            this.invaderHeight = INVADER_HEIGHT_PX * PIXEL_SCALE;
            this.invaderGapX = 20; // Espacio entre invasores para distribuirlos mejor
            this.invaderGapY = 15; // Menos relevante con una sola fila, pero se mantiene
            // Reintroducir velocidad del invader y ajustar para intervalo de 5 segundos
            this.invaderSpeed = 7.5;
            this.invaderDirection = 1; // 1 derecha, -1 izquierda
            this.invaderStepDown = 20; // Bajada más pronunciada al cambiar de dirección

            this.score = 0;
            this.gameInterval = null;
            // Limitar la velocidad de fotogramas del juego a 5 segundos (0.2 FPS)
            this.gameSpeed = 5000; // ms por frame (antes 1000)

            this.isGameOver = false;

            // --- NUEVAS PROPIEDADES PARA ELIMINAR RASTROS (estado del frame anterior) ---
            this.prevPlayerX = 0;
            this.prevPlayerY = 0;
            this.prevInvaders = [];
            this.prevBullets = [];
            // --- FIN NUEVAS PROPIEDADES ---

            this.init();
        }

        init() {
            const checkCanvasReady = () => {
                const canvas = document.getElementById('canvas');
                if (canvas) {
                    drawariaCanvas = canvas;
                    drawariaCtx = canvas.getContext('2d');
                    // Posicionar jugador al centro abajo
                    this.playerX = (drawariaCanvas.width - this.playerWidth) / 2;
                    this.playerY = drawariaCanvas.height - this.playerHeight - 10;
                    // Inicializar prevPlayerX/Y con la posición inicial del jugador
                    this.prevPlayerX = this.playerX;
                    this.prevPlayerY = this.playerY;

                    this.createGamePanel();
                    this.resetGame();
                    console.log('✅ Space Invaders inicializado.');
                } else {
                    setTimeout(checkCanvasReady, 100);
                }
            };
            checkCanvasReady();
        }

        createGamePanel() {
            const existing = document.getElementById('spaceinvaders-game-panel');
            if (existing) existing.remove();
            const panel = document.createElement('div');
            panel.id = 'spaceinvaders-game-panel';
            panel.style.cssText = `
                position: fixed !important;
                top: 20px !important;
                right: 20px !important;
                width: 250px !important;
                z-index: 2147483647 !important;
                background: linear-gradient(135deg, #000011, #000006) !important;
                border: 2px solid #00FF00 !important;
                border-radius: 12px !important;
                color: #00FF00 !important;
                font-family: 'Press Start 2P', 'Segoe UI', Arial, sans-serif !important;
                box-shadow: 0 0 20px rgba(0, 255, 0, 0.3) !important;
                padding: 15px !important;
                text-align: center !important;
            `;
            panel.innerHTML = `
                <h3 style="margin-top: 0; color: #00FF00;">🚀 Space Invaders</h3>
                <div style="margin-bottom: 10px;">
                    Score: <span id="si-score">0</span>
                </div>
                <button id="si-create-space-btn" style="
                    width: 100%;
                    padding: 10px;
                    background: #34495e; /* Un tono oscuro de azul/gris */
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: bold;
                    margin-bottom: 10px;
                    transition: background 0.3s ease;
                ">🌌 Create Space</button>
                <button id="si-start-pause" style="
                    width: 100%;
                    padding: 10px;
                    background: #00FF00;
                    color: black;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: bold;
                    margin-bottom: 10px;
                    transition: background 0.3s ease;
                ">▶️ Iniciar Juego</button>
                <div id="si-game-message" style="
                    margin-top: 10px;
                    color: #FF4444;
                    font-weight: bold;
                    display: none;
                "></div>
                <div style="
                    margin-top: 15px;
                    font-size: 10px;
                    color: rgba(0,255,0,0.6);
                ">
                    Usa ← → para mover.<br> Barra espaciadora para disparar.
                    <br><br>
                    *Nota: Animación de juego cada 5 segundos para reducir comandos al servidor.*
                </div>
            `;
            document.body.appendChild(panel);

            this.makePanelDraggable(panel);

            document.getElementById('si-create-space-btn').addEventListener('click', () => this.createSpaceScenario());
            document.getElementById('si-start-pause').addEventListener('click', () => this.toggleGame());
            document.addEventListener('keydown', e => this.handleKeyInput(e));
            document.addEventListener('keyup', e => this.handleKeyUp(e));
        }

        makePanelDraggable(panel) {
            let isDragging = false;
            let currentX, currentY, initialX, initialY;
            let xOffset = 0, yOffset = 0;

            const dragStart = e => {
                e.preventDefault();
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
                isDragging = true;
                panel.style.cursor = 'grabbing';
                document.addEventListener("mousemove", drag);
                document.addEventListener("mouseup", dragEnd);
            };

            const dragEnd = () => {
                isDragging = false;
                panel.style.cursor = 'grab';
                document.removeEventListener("mousemove", drag);
                document.removeEventListener("mouseup", dragEnd);
            };

            const drag = e => {
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
            }
        }

        resetGame() {
            this.isActive = false;
            this.isGameOver = false;
            this.score = 0;
            this.updateScore();
            this.bullets = [];
            this.invaderDirection = 1;
            this.createInvaders();

            this.playerX = (drawariaCanvas.width - this.playerWidth) / 2;
            this.playerY = drawariaCanvas.height - this.playerHeight - 10;
            this.prevPlayerX = this.playerX;
            this.prevPlayerY = this.playerY;
            this.prevInvaders = this.invaders.map(inv => ({ ...inv }));
            this.prevBullets = [];

            this.lastShotTime = 0;
            this.keysPressed = {};
            this.clearCanvas(); // Borrado completo
            this.drawAll(); // Dibuja el estado inicial
        }

        // Modificado para crear solo 5 invasores centrados
        createInvaders() {
            this.invaders = [];
            const numInvaders = 5;
            const totalInvadersContentWidth = numInvaders * this.invaderWidth + (numInvaders - 1) * this.invaderGapX;
            const startX = (drawariaCanvas.width - totalInvadersContentWidth) / 2;
            const startY = 40;

            for (let i = 0; i < numInvaders; i++) {
                this.invaders.push({
                    x: startX + i * (this.invaderWidth + this.invaderGapX),
                    y: startY,
                    width: this.invaderWidth,
                    height: this.invaderHeight,
                    alive: true
                });
            }
        }

        toggleGame() {
            if (!this.isActive) {
                this.startGame();
                document.getElementById('si-start-pause').textContent = '⏸️ Pausar Juego';
            } else {
                this.pauseGame();
                document.getElementById('si-start-pause').textContent = '▶️ Reanudar Juego';
            }
        }

        startGame() {
            if (this.isActive) return;
            this.isActive = true;
            this.isGameOver = false;
            this.gameLoop();
            document.getElementById('si-game-message').style.display = 'none';
            document.getElementById('si-start-pause').style.background = '#00FF00';
        }

        pauseGame() {
            this.isActive = false;
            if (this.gameInterval) clearTimeout(this.gameInterval);
            this.gameInterval = null;
        }

        endGame(message) {
            this.isGameOver = true;
            this.pauseGame();
            const msgEl = document.getElementById('si-game-message');
            msgEl.textContent = message;
            msgEl.style.display = 'block';
            document.getElementById('si-start-pause').textContent = '🔄 Reiniciar Juego';
            document.getElementById('si-start-pause').style.background = '#cc0000';
            console.log(`💀 Juego terminado: ${message}. Puntuación: ${this.score}`);
        }

        gameLoop() {
            if (!this.isActive) return;

            this.updateGame();
            this.drawAll();

            if (!this.isGameOver) {
                this.gameInterval = setTimeout(() => this.gameLoop(), this.gameSpeed);
            }
        }

        updateGame() {
            // --- ALMACENAR ESTADO ANTERIOR PARA ELIMINACIÓN DE RASTROS ---
            this.prevPlayerX = this.playerX;
            this.prevPlayerY = this.playerY;
            this.prevInvaders = this.invaders.map(inv => ({ ...inv }));
            this.prevBullets = this.bullets.map(b => ({ ...b }));
            // --- FIN ALMACENAR ESTADO ANTERIOR ---

            // Mover jugador según teclas (efecto visual cada 5 segundos)
            if (this.keysPressed['ArrowLeft']) {
                this.playerX = Math.max(this.playerX - this.playerSpeed, 0);
            }
            if (this.keysPressed['ArrowRight']) {
                this.playerX = Math.min(this.playerX + this.playerSpeed, drawariaCanvas.width - this.playerWidth);
            }

            // Actualizar balas (efecto visual cada 5 segundos, con velocidad ajustada)
            this.bullets.forEach(bullet => {
                bullet.y -= this.bulletSpeed;
            });
            this.bullets = this.bullets.filter(bullet => bullet.y + bullet.height > 0);

            // Verificar colisiones bala-invader
            for (let b = this.bullets.length -1; b >= 0; b--) {
                const bullet = this.bullets[b];
                for (let i = 0; i < this.invaders.length; i++) {
                    const invader = this.invaders[i];
                    if (invader.alive && this.rectOverlap(bullet, invader)) {
                        invader.alive = false;
                        this.bullets.splice(b,1);
                        this.score += 100;
                        this.updateScore();
                        break;
                    }
                }
            }

            // Reintroducir lógica de movimiento para invasores ("mueva de un lado a otro solo")
            let invaderHitWall = false;
            for (const invader of this.invaders) {
                if (!invader.alive) continue;
                invader.x += this.invaderSpeed * this.invaderDirection;
                if (invader.x + invader.width > drawariaCanvas.width || invader.x < 0) {
                    invaderHitWall = true;
                }
                // Condición de derrota: si un invader llega al jugador
                if (invader.y + invader.height > this.playerY) {
                    this.endGame('¡Los invasores te alcanzaron!');
                    return;
                }
            }

            if (invaderHitWall) {
                this.invaderDirection *= -1; // Cambia de dirección
                for (const invader of this.invaders) {
                    invader.y += this.invaderStepDown; // Baja un paso
                    // Ajustar posición si se salió por el otro lado debido al cambio de dirección
                    if (invader.x + invader.width > drawariaCanvas.width) {
                        invader.x = drawariaCanvas.width - invader.width;
                    } else if (invader.x < 0) {
                        invader.x = 0;
                    }
                }
            }

            // Condición de victoria
            if (this.invaders.every(i => !i.alive)) {
                this.endGame('¡Ganaste!');
            }
        }

        rectOverlap(a, b) {
            return a.x < b.x + b.width &&
                a.x + a.width > b.x &&
                a.y < b.y + b.height &&
                a.y + a.height > b.y;
        }

        /**
         * Borra los dibujos del frame anterior dibujando sobre ellos con el color de fondo.
         * El área de borrado es ligeramente más grande para asegurar una limpieza completa.
         */
        erasePreviousDrawings() {
            // Borrar jugador de su posición anterior
            const playerErasePadding = PIXEL_SCALE * 2; // Añadir margen para borrar bien
            const playerEraseWidth = this.playerWidth + playerErasePadding;
            const playerEraseHeight = this.playerHeight + playerErasePadding;
            const playerEraseX = this.prevPlayerX - (playerErasePadding / 2);
            const playerEraseY = this.prevPlayerY - (playerErasePadding / 2);
            enqueueDrawCommand(playerEraseX, playerEraseY + playerEraseHeight / 2, playerEraseX + playerEraseWidth, playerEraseY + playerEraseHeight / 2, BACKGROUND_COLOR, playerEraseHeight, false);


            // Borrar invasores de sus posiciones anteriores
            for (const invader of this.prevInvaders) {
                // Borrar siempre, incluso si ya no está vivo, para limpiar su último rastro
                const invaderErasePadding = PIXEL_SCALE * 2;
                const invaderEraseWidth = invader.width + invaderErasePadding;
                const invaderEraseHeight = invader.height + invaderErasePadding;
                const invaderEraseX = invader.x - (invaderErasePadding / 2);
                const invaderEraseY = invader.y - (invaderErasePadding / 2);
                enqueueDrawCommand(invaderEraseX, invaderEraseY + invaderEraseHeight / 2, invaderEraseX + invaderEraseWidth, invaderEraseY + invaderEraseHeight / 2, BACKGROUND_COLOR, invaderEraseHeight, false);
            }

            // Borrar balas de sus posiciones anteriores
            this.prevBullets.forEach(bullet => {
                // Para balas, que son rectángulos, dibujamos un rectángulo un poco más grande de color de fondo
                const bulletEraseWidth = bullet.width + PIXEL_SCALE;
                const bulletEraseHeight = bullet.height + PIXEL_SCALE;
                const bulletEraseX = bullet.x - (PIXEL_SCALE / 2);
                const bulletEraseY = bullet.y - (PIXEL_SCALE / 2);
                enqueueDrawCommand(bulletEraseX, bulletEraseY + bulletEraseHeight / 2, bulletEraseX + bulletEraseWidth, bulletEraseY + bulletEraseHeight / 2, BACKGROUND_COLOR, bulletEraseHeight, false);
            });
        }

        /**
         * Dibuja todos los elementos del juego en sus posiciones actuales.
         */
        drawAll() {
            // Primero, borrar los dibujos del frame anterior
            // Esto se asegura de que los elementos "desaparezcan" de su posición anterior
            // y luego se "redibujen" en la nueva, cada 5 segundos.
            this.erasePreviousDrawings();

            // Dibujar jugador con la nueva forma pixel-art en su posición actual (ahora con píxeles cuadrados)
            drawPixelShape(this.playerX, this.playerY, PLAYER_PIXELS, PLAYER_COLOR, PIXEL_SCALE);

            // Dibujar invasores con la nueva forma pixel-art en sus posiciones actuales (ahora con píxeles cuadrados)
            for (const invader of this.invaders) {
                if (!invader.alive) continue; // Solo dibujar invasores vivos
                drawPixelShape(invader.x, invader.y, INVADER_PIXELS, INVADER_COLOR, PIXEL_SCALE);
            }

            // Dibujar balas (rectángulos blancos) en sus posiciones actuales
            this.bullets.forEach(bullet => {
                // ✅ CAMBIO CLAVE: Balas dibujadas como rectángulos rellenos
                // Dibuja una línea horizontal de la longitud de la bala y con el grosor de la altura de la bala.
                enqueueDrawCommand(bullet.x, bullet.y + bullet.height / 2, bullet.x + bullet.width, bullet.y + bullet.height / 2, '#FFFFFF', bullet.height, false);
            });
        }

        /**
         * Realiza un borrado completo de todo el canvas.
         * Se usa principalmente al inicio o reinicio del juego y para el escenario espacial.
         */
        clearCanvas() {
            enqueueDrawCommand(0, 0, drawariaCanvas.width, drawariaCanvas.height, BACKGROUND_COLOR, Math.max(1500, 1500), false); // Usar false para borrar con rectángulo grueso
        }

        handleKeyInput(e) {
            // Permitir que las pulsaciones de teclas se registren incluso si el juego no está activo,
            // pero el movimiento visual solo se aplicará en el gameLoop cada 5 segundos.
            if (e.code === 'Space') {
                e.preventDefault();
                // El disparo ocurre inmediatamente, pero la bala solo se mueve cada 5 segundos.
                // Esto podría sentirse un poco raro, pero es la consecuencia de la restricción de 5 segundos.
                this.shoot();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                this.keysPressed[e.key] = true;
                e.preventDefault();
            }
        }

        handleKeyUp(e) {
            if(e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                this.keysPressed[e.key] = false;
            }
        }

        // Modificado para que las balas se ajusten al nuevo tamaño del jugador pixel art y empiecen más arriba
        shoot() {
            if(!this.canShoot || this.isGameOver) return;

            const now = Date.now();
            if (this.lastShotTime && now - this.lastShotTime < this.shootCooldown) {
                return;
            }
            this.lastShotTime = now;

            // Agrega una bala en la parte superior del jugador
            // Bala inicia aún más arriba, ajustado al nuevo PIXEL_SCALE
            this.bullets.push({
                x: this.playerX + this.playerWidth / 2 - (PIXEL_SCALE / 2), // Centrar la bala con respecto al jugador (ajuste fino)
                y: this.playerY - (PIXEL_SCALE * 7), // La bala comienza significativamente más arriba
                width: PIXEL_SCALE, // Ancho base de la bala (será un cuadrado)
                height: PIXEL_SCALE * 3 // Alto base de la bala (para una forma rectangular si se desea)
            });
        }

        updateScore() {
            const scoreEl = document.getElementById('si-score');
            if(scoreEl) scoreEl.textContent = this.score;
        }

        // --- FUNCIÓN PARA EL ESCENARIO ESPACIAL ---
        createSpaceScenario() {
            if (!drawariaCanvas || !drawariaSocket) {
                console.log('Canvas or WebSocket not available.');
                return;
            }

            this.pauseGame(); // Pausa el juego para dibujar el escenario

            // Borra todo el canvas con negro
            this.clearCanvas();

            // Dibuja puntos blancos para simular estrellas
            // Se usa un setTimeout para dar tiempo a que el borrado completo se procese
            setTimeout(() => {
                const numStars = 200; // Número de estrellas
                const starSize = PIXEL_SCALE / 2; // Tamaño de los puntos (más pequeño que el PIXEL_SCALE general)

                for (let i = 0; i < numStars; i++) {
                    const x = Math.random() * drawariaCanvas.width;
                    const y = Math.random() * drawariaCanvas.height;
                    // Dibuja una pequeña estrella como un pequeño cuadrado (pixel)
                    enqueueDrawCommand(x, y + starSize / 2, x + starSize, y + starSize / 2, '#FFFFFF', starSize, false);
                }
                console.log('✅ Escenario espacial dibujado con éxito.');
            }, 200); // Pequeño retraso para asegurar que el borrado se complete primero
        }
        // --- FIN FUNCIÓN ---
    }

    // Inicialización del juego
    const initSpaceInvaders = () => {
        new SpaceInvadersGame();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSpaceInvaders);
    } else {
        setTimeout(initSpaceInvaders, 500);
    }
})();