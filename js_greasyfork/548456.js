// ==UserScript==
// @name         Drawaria POU Interactive Game
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Juego completo de POU interactivo en Drawaria con minijuegos en tiempo real
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @match        https://*.drawaria.online/*
// @grant        none
// @license      MIT
// @icon         https://static.wikitide.net/pouwiki/thumb/8/8a/Pouveryhappy.png/120px-Pouveryhappy.png
// @downloadURL https://update.greasyfork.org/scripts/548456/Drawaria%20POU%20Interactive%20Game.user.js
// @updateURL https://update.greasyfork.org/scripts/548456/Drawaria%20POU%20Interactive%20Game.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* ----------  SISTEMA BASE OPTIMIZADO  ---------- */
    let drawariaSocket = null;
    let drawariaCanvas = null;
    let drawariaCtx = null;

    // Queue optimizado para comandos
    const commandQueue = [];
    let batchProcessor = null;
    const BATCH_SIZE = 6;
    const BATCH_INTERVAL = 50;

    // Variables de control del sistema POU
    let pouGameActive = false;
    let selectedPlayerId = null;
    let selectedPlayerName = null;

    // Estados del POU
    let pouStates = new Map();

    // Intercept WebSocket
    const originalWebSocketSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (...args) {
        if (!drawariaSocket && this.url && this.url.includes('drawaria')) {
            drawariaSocket = this;
            console.log('🔗 [POU GAME] Socket capturado para POU Game');
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
                    console.warn('⚠️ [POU GAME] Error enviando comando:', e);
                }
            });
        }, BATCH_INTERVAL);
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /* ----------  PATRONES PIXEL ART DE POU  ---------- */
    const pouPatterns = {
        'pou_happy': [
            "      BBBBBBBBBB      ",
            "    BBBBBBBBBBBBBB    ",
            "  BBBBBBBBBBBBBBBBBB  ",
            " BBBBBBBBBBBBBBBBBBBB ",
            "BBBBBBBBBBBBBBBBBBBBBB",
            "BBBBBBBBBBBBBBBBBBBBBB",
            "BBBBWWWWBBBBWWWWBBBBBB",
            "BBBBWWWWBBBBWWWWBBBBBB",
            "BBBBWWWWBBBBWWWWBBBBBB",
            "BBBBWWKWBBBBWWKWBBBBBB",
            "BBBBBBBBBBBBBBBBBBBBBB",
            "BBBBBBBBBBBBBBBBBBBBBB",
            "BBBBRRRRRRRRRRBBBBBBBB",
            "BBBBBRRRRRRRRBBBBBBBBB",
            "BBBBBBRRRRRRBBBBBBBBBB",
            "BBBBBBBBBBBBBBBBBBBBBB",
            "BBBBBBBBBBBBBBBBBBBBBB",
            " BBBBBBBBBBBBBBBBBBBB ",
            "  BBBBBBBBBBBBBBBBBB  ",
            "    BBBBBBBBBBBBBB    ",
            "      BBBBBBBBBB      "
        ],
        'pou_sad': [
            "      BBBBBBBBBB      ",
            "    BBBBBBBBBBBBBB    ",
            "  BBBBBBBBBBBBBBBBBB  ",
            " BBBBBBBBBBBBBBBBBBBB ",
            "BBBBBBBBBBBBBBBBBBBBBB",
            "BBBBBBBBBBBBBBBBBBBBBB",
            "BBBBWWWWBBBBWWWWBBBBBB",
            "BBBBWWWWBBBBWWWWBBBBBB",
            "BBBBWWWWBBBBWWWWBBBBBB",
            "BBBBWWKWBBBBWWKWBBBBBB",
            "BBBBBBBBBBBBBBBBBBBBBB",
            "BBBBBBBBBBBBBBBBBBBBBB",
            "BBBBBBRRRRRRBBBBBBBBBB",
            "BBBBBBRRRRRRBBBBBBBBB ",
            "BBBBRRRRRRRRRRBBBBBBBB",
            "BBBBBBBBBBBBBBBBBBBBBB",
            "BBBBBBBBBBBBBBBBBBBBBB",
            " BBBBBBBBBBBBBBBBBBBB ",
            "  BBBBBBBBBBBBBBBBBB  ",
            "    BBBBBBBBBBBBBB    ",
            "      BBBBBBBBBB      "
        ],
        'pou_angry': [
            "      BBBBBBBBBB      ",
            "    BBBBBBBBBBBBBB    ",
            "  BBBBBBBBBBBBBBBBBB  ",
            " BBBBBBBBBBBBBBBBBBBB ",
            "BBBBBBBBBBBBBBBBBBBBBB",
            "BBBBRRRBBBBBBBRRRBBBBB",
            "BBBBWWWWBBBBWWWWBBBBBB",
            "BBBBWWWWBBBBWWWWBBBBBB",
            "BBBBWWWWBBBBWWWWBBBBBB",
            "BBBBWWKWBBBBWWKWBBBBBB",
            "BBBBBBBBBBBBBBBBBBBBBB",
            "BBBBBBBBBBBBBBBBBBBBBB",
            "BBBBBBRRRRRRBBBBBBBBBB",
            "BBBBRRRRRRRRRRBBBBBBB ",
            "BBBBRRRRRRRRRRBBBBBBBB",
            "BBBBBBRRRRRRBBBBBBBBBB",
            "BBBBBBBBBBBBBBBBBBBBBB",
            " BBBBBBBBBBBBBBBBBBBB ",
            "  BBBBBBBBBBBBBBBBBB  ",
            "    BBBBBBBBBBBBBB    ",
            "      BBBBBBBBBB      "
        ],
        'food_apple': [
            "   GG   ",
            "  GGGG  ",
            " RRRRRR ",
            "RRRRRRRR",
            "RRRRRRRR",
            "RRRRRRRR",
            " RRRRRR ",
            "  RRRR  "
        ],
        'food_cake': [
            "YYYYYYYY",
            "WWWWWWWW",
            "PPPPPPPP",
            "WWWWWWWW",
            "PPPPPPPP",
            "WWWWWWWW",
            "BBBBBBBB"
        ],
        'toy_ball': [
            "  RRRR  ",
            " RRRRRR ",
            "RRRWWRRR",
            "RRWWWWRR",
            "RRWWWWRR",
            "RRRWWRRR",
            " RRRRRR ",
            "  RRRR  "
        ],
        'heart': [
            " RR   RR ",
            "RRRR RRRR",
            "RRRRRRRRR",
            " RRRRRRR ",
            "  RRRRR  ",
            "   RRR   ",
            "    R    "
        ]
    };

    // Esquemas de colores para POU
    const pouColorSchemes = {
        pou_happy: {
            'B': '#8B4513', // Marrón para el cuerpo
            'W': '#FFFFFF', // Blanco para los ojos
            'K': '#000000', // Negro para las pupilas
            'R': '#FF1493', // Rosa para la boca feliz
            ' ': null
        },
        pou_sad: {
            'B': '#696969', // Gris para el cuerpo triste
            'W': '#FFFFFF', // Blanco para los ojos
            'K': '#000000', // Negro para las pupilas
            'R': '#0000FF', // Azul para la boca triste
            ' ': null
        },
        pou_angry: {
            'B': '#DC143C', // Rojo oscuro para el cuerpo enojado
            'W': '#FFFFFF', // Blanco para los ojos
            'K': '#000000', // Negro para las pupilas
            'R': '#8B0000', // Rojo más oscuro para la boca
            ' ': null
        },
        food_apple: {
            'R': '#FF0000', // Rojo manzana
            'G': '#00FF00', // Verde hoja
            ' ': null
        },
        food_cake: {
            'Y': '#FFD700', // Amarillo
            'W': '#FFFFFF', // Blanco crema
            'P': '#FFC0CB', // Rosa
            'B': '#8B4513', // Marrón base
            ' ': null
        },
        toy_ball: {
            'R': '#FF0000', // Rojo pelota
            'W': '#FFFFFF', // Blanco detalles
            ' ': null
        },
        heart: {
            'R': '#FF0000', // Rojo corazón
            ' ': null
        }
    };

    /* ----------  SISTEMA DE DIBUJO OPTIMIZADO  ---------- */
    function enqueueDrawCommand(x1, y1, x2, y2, color, thickness) {
        if (!drawariaCanvas || !drawariaSocket || !pouGameActive) return;

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
            drawariaCtx.beginPath();
            drawariaCtx.moveTo(x1, y1);
            drawariaCtx.lineTo(x2, y2);
            drawariaCtx.stroke();
        }
    }

    function optimizePatternToLines(pattern) {
        const lines = [];
        for (let row = 0; row < pattern.length; row++) {
            let currentLine = null;
            for (let col = 0; col < pattern[row].length; col++) {
                const char = pattern[row][col];
                if (char !== ' ') {
                    if (!currentLine || currentLine.char !== char) {
                        if (currentLine) lines.push(currentLine);
                        currentLine = { char, startCol: col, endCol: col, row };
                    } else {
                        currentLine.endCol = col;
                    }
                } else {
                    if (currentLine) {
                        lines.push(currentLine);
                        currentLine = null;
                    }
                }
            }
            if (currentLine) lines.push(currentLine);
        }
        return lines;
    }

    function drawOptimizedPixelArt(patternName, pixelSize, centerX, centerY, eraseMode = false) {
        const pattern = pouPatterns[patternName];
        if (!pattern) return;

        const lines = optimizePatternToLines(pattern);
        const colors = eraseMode ?
            Object.keys(pouColorSchemes[patternName] || {}).reduce((acc, key) => {
                acc[key] = key === ' ' ? null : '#FFFFFF';
                return acc;
            }, {}) :
            pouColorSchemes[patternName];

        const patternCenter = Math.floor(pattern.length / 2);

        lines.forEach(line => {
            if (!colors[line.char]) return;

            const startX = centerX + (line.startCol - patternCenter) * pixelSize;
            const endX = centerX + (line.endCol - patternCenter) * pixelSize + pixelSize;
            const y = centerY + (line.row - patternCenter) * pixelSize;

            enqueueDrawCommand(startX, y, endX, y, colors[line.char], pixelSize * 1.2);
        });
    }

    /* ----------  GESTIÓN DE JUGADORES  ---------- */
    class PlayerManager {
        constructor() {
            this.validPlayers = [];
            this.updateInterval = null;
        }

        updatePlayerOptions() {
            const playerSelect = document.getElementById('pou-player-selector');
            if (!playerSelect) return;

            const currentSelection = playerSelect.value;
            playerSelect.innerHTML = '';

            const playerElements = document.querySelectorAll('.spawnedavatar[data-playerid], .playerlist-row[data-playerid]');
            const validPlayers = [];

            playerElements.forEach(el => {
                const playerId = el.dataset.playerid;
                if (!playerId || playerId === '0' || el.dataset.self === 'true') return;

                let playerName = '';
                const nicknameEl = el.querySelector('.nickname, .playerlist-name a, .player-name');
                if (nicknameEl) {
                    playerName = nicknameEl.textContent.trim();
                }

                if (!playerName) {
                    const parentRow = el.closest('.playerlist-row');
                    if (parentRow) {
                        const nameEl = parentRow.querySelector('.playerlist-name a, .player-name');
                        if (nameEl) {
                            playerName = nameEl.textContent.trim();
                        }
                    }
                }

                if (!playerName) {
                    playerName = `Player ${playerId}`;
                }

                if (!validPlayers.some(p => p.id === playerId)) {
                    validPlayers.push({ id: playerId, name: playerName });
                }
            });

            this.validPlayers = validPlayers;

            if (validPlayers.length === 0) {
                const opt = document.createElement('option');
                opt.value = '';
                opt.textContent = '❌ No players available';
                opt.disabled = true;
                playerSelect.appendChild(opt);

                const startBtn = document.getElementById('pou-start-btn');
                if (startBtn) startBtn.disabled = true;
            } else {
                const allOpt = document.createElement('option');
                allOpt.value = 'all';
                allOpt.textContent = `🌍 All Players (${validPlayers.length})`;
                playerSelect.appendChild(allOpt);

                validPlayers.forEach(player => {
                    const opt = document.createElement('option');
                    opt.value = player.id;
                    opt.textContent = `🎮 ${player.name}`;
                    opt.dataset.playerName = player.name;
                    playerSelect.appendChild(opt);
                });

                const stillExists = currentSelection === 'all' || validPlayers.some(p => p.id === currentSelection);
                if (currentSelection && stillExists) {
                    playerSelect.value = currentSelection;
                    if (currentSelection === 'all') {
                        selectedPlayerName = 'All Players';
                    } else {
                        const selectedPlayer = validPlayers.find(p => p.id === currentSelection);
                        selectedPlayerName = selectedPlayer ? selectedPlayer.name : null;
                    }
                } else {
                    playerSelect.value = 'all';
                    selectedPlayerId = 'all';
                    selectedPlayerName = 'All Players';
                }

                const startBtn = document.getElementById('pou-start-btn');
                if (startBtn) startBtn.disabled = false;
            }

            selectedPlayerId = playerSelect.value;
        }

        startAutoUpdate() {
            if (this.updateInterval) return;
            this.updateInterval = setInterval(() => {
                this.updatePlayerOptions();
            }, 2000);
            this.updatePlayerOptions();
        }

        stopAutoUpdate() {
            if (this.updateInterval) {
                clearInterval(this.updateInterval);
                this.updateInterval = null;
            }
        }
    }

    /* ----------  SISTEMA PRINCIPAL DE POU  ---------- */
    class PouGameSystem {
        constructor() {
            this.initialized = false;
            this.playerManager = new PlayerManager();
            this.pouStates = new Map();
            this.gameStats = {
                happiness: 100,
                hunger: 50,
                cleanliness: 80,
                energy: 70
            };
            this.lastUpdateTime = 0;
            this.UPDATE_INTERVAL = 100;
            this.activeMinigame = null;
            this.init();
        }

        init() {
            const checkGameReady = () => {
                const gameCanvas = document.getElementById('canvas');
                if (gameCanvas) {
                    this.canvasElement = gameCanvas;
                    drawariaCanvas = gameCanvas;
                    this.canvasContext = gameCanvas.getContext('2d');
                    drawariaCtx = gameCanvas.getContext('2d');
                    this.initialized = true;
                    this.createInterface();
                    console.log('✅ [POU GAME] Sistema POU inicializado');
                } else {
                    setTimeout(checkGameReady, 100);
                }
            };
            checkGameReady();
        }

        getTargetPlayerCoords(playerId = null) {
            if (!playerId || playerId === 'all') {
                const allPlayers = [];
                const avatars = document.querySelectorAll('.spawnedavatar[data-playerid]:not([data-playerid="0"]):not(.self)');

                avatars.forEach(avatar => {
                    if (!this.canvasElement) return;
                    const cRect = this.canvasElement.getBoundingClientRect();
                    const aRect = avatar.getBoundingClientRect();

                    if (aRect.width > 0 && aRect.height > 0) {
                        allPlayers.push({
                            id: avatar.dataset.playerid || `player_${allPlayers.length}`,
                            x: Math.round((aRect.left - cRect.left) + (aRect.width / 2)),
                            y: Math.round((aRect.top - cRect.top) + (aRect.height / 2)),
                            width: aRect.width,
                            height: aRect.height
                        });
                    }
                });

                return allPlayers.length > 0 ? allPlayers : null;
            }

            const targetPlayers = [];
            const avatars = document.querySelectorAll(`.spawnedavatar[data-playerid="${playerId}"]`);

            avatars.forEach(avatar => {
                if (!this.canvasElement) return;
                const cRect = this.canvasElement.getBoundingClientRect();
                const aRect = avatar.getBoundingClientRect();

                if (aRect.width > 0 && aRect.height > 0) {
                    targetPlayers.push({
                        id: playerId,
                        x: Math.round((aRect.left - cRect.left) + (aRect.width / 2)),
                        y: Math.round((aRect.top - cRect.top) + (aRect.height / 2)),
                        width: aRect.width,
                        height: aRect.height
                    });
                }
            });

            return targetPlayers.length > 0 ? targetPlayers : null;
        }

        updatePouForPlayer(player) {
            const playerId = player.id;

            if (!this.pouStates.has(playerId)) {
                this.pouStates.set(playerId, {
                    mood: 'happy',
                    lastX: -9999,
                    lastY: -9999,
                    needsRedraw: true,
                    lastAction: Date.now(),
                    items: []
                });
            }

            const state = this.pouStates.get(playerId);

            // Determinar mood basado en stats
            let mood = 'happy';
            if (this.gameStats.happiness < 30) mood = 'sad';
            if (this.gameStats.hunger < 20) mood = 'angry';

            const pouX = player.x;
            const pouY = player.y - 60; // POU encima del jugador

            // Redibujar POU si es necesario
            if (Math.abs(pouX - state.lastX) > 5 || Math.abs(pouY - state.lastY) > 5 || state.needsRedraw || state.mood !== mood) {
                // Borrar POU anterior
                if (state.lastX !== -9999) {
                    drawOptimizedPixelArt(`pou_${state.mood}`, 2, state.lastX, state.lastY, true);
                }

                // Dibujar nuevo POU
                state.mood = mood;
                drawOptimizedPixelArt(`pou_${mood}`, 2, pouX, pouY, false);

                state.lastX = pouX;
                state.lastY = pouY;
                state.needsRedraw = false;
            }

            // Dibujar elementos adicionales
            this.drawPouElements(player, state);
        }

        drawPouElements(player, state) {
            const now = Date.now();

            // Corazones de felicidad
            if (this.gameStats.happiness > 70) {
                if (now - state.lastAction > 3000) {
                    const heartX = player.x + (Math.random() - 0.5) * 60;
                    const heartY = player.y - 100 - Math.random() * 30;
                    drawOptimizedPixelArt('heart', 1, heartX, heartY, false);
                    state.lastAction = now;
                }
            }

            // Items disponibles alrededor del POU
            state.items.forEach((item, index) => {
                if (now - item.spawnTime < 10000) { // 10 segundos
                    drawOptimizedPixelArt(item.type, 1, item.x, item.y, false);
                } else {
                    state.items.splice(index, 1); // Remover item expirado
                }
            });
        }

        // Minijuego: Alimentar POU
        async feedingMinigame(player) {
            console.log('🍎 [POU GAME] Iniciando minijuego de alimentación');

            const foods = ['food_apple', 'food_cake'];
            const selectedFood = foods[Math.floor(Math.random() * foods.length)];

            // Generar comida cerca del jugador
            const foodX = player.x + (Math.random() - 0.5) * 100;
            const foodY = player.y + 50;

            drawOptimizedPixelArt(selectedFood, 2, foodX, foodY, false);

            // Animar POU comiendo
            await sleep(1000);
            drawOptimizedPixelArt(selectedFood, 2, foodX, foodY, true); // Borrar comida

            // Aumentar stats
            this.gameStats.hunger = Math.min(100, this.gameStats.hunger + 20);
            this.gameStats.happiness = Math.min(100, this.gameStats.happiness + 10);

            console.log('🍎 [POU GAME] ¡POU ha comido! Hambre: ' + this.gameStats.hunger);
        }

        // Minijuego: Jugar con POU
        async playMinigame(player) {
            console.log('⚽ [POU GAME] Iniciando minijuego de juego');

            const ballX = player.x + 40;
            const ballY = player.y;

            // Mostrar pelota
            drawOptimizedPixelArt('toy_ball', 2, ballX, ballY, false);

            // Animar juego
            for (let i = 0; i < 5; i++) {
                await sleep(500);
                drawOptimizedPixelArt('toy_ball', 2, ballX + i * 10, ballY - Math.sin(i) * 20, false);
                if (i > 0) {
                    drawOptimizedPixelArt('toy_ball', 2, ballX + (i-1) * 10, ballY - Math.sin(i-1) * 20, true);
                }
            }

            // Limpiar pelota
            drawOptimizedPixelArt('toy_ball', 2, ballX + 40, ballY, true);

            // Aumentar stats
            this.gameStats.happiness = Math.min(100, this.gameStats.happiness + 15);
            this.gameStats.energy = Math.max(0, this.gameStats.energy - 10);

            console.log('⚽ [POU GAME] ¡POU ha jugado! Felicidad: ' + this.gameStats.happiness);
        }

        // Minijuego: Limpiar POU
        async cleaningMinigame(player) {
            console.log('🧼 [POU GAME] Iniciando minijuego de limpieza');

            // Efectos de limpieza
            for (let i = 0; i < 3; i++) {
                const bubbleX = player.x + (Math.random() - 0.5) * 40;
                const bubbleY = player.y - 40 - Math.random() * 30;

                // Dibujar burbuja (usando patrón de corazón pero en azul)
                enqueueDrawCommand(bubbleX-3, bubbleY-3, bubbleX+3, bubbleY+3, '#87CEEB', 2);
                enqueueDrawCommand(bubbleX-3, bubbleY+3, bubbleX+3, bubbleY-3, '#87CEEB', 2);

                await sleep(300);

                // Borrar burbuja
                enqueueDrawCommand(bubbleX-3, bubbleY-3, bubbleX+3, bubbleY+3, '#FFFFFF', 3);
                enqueueDrawCommand(bubbleX-3, bubbleY+3, bubbleX+3, bubbleY-3, '#FFFFFF', 3);
            }

            // Aumentar stats
            this.gameStats.cleanliness = Math.min(100, this.gameStats.cleanliness + 25);
            this.gameStats.happiness = Math.min(100, this.gameStats.happiness + 5);

            console.log('🧼 [POU GAME] ¡POU está limpio! Limpieza: ' + this.gameStats.cleanliness);
        }

        updateGameLoop() {
            if (!pouGameActive || !this.initialized) return;

            const now = Date.now();
            if (now - this.lastUpdateTime < this.UPDATE_INTERVAL) return;

            const targetPlayers = this.getTargetPlayerCoords(selectedPlayerId);
            if (!targetPlayers) return;

            targetPlayers.forEach(player => {
                this.updatePouForPlayer(player);
            });

            // Decrementar stats con el tiempo
            if (now % 5000 < this.UPDATE_INTERVAL) { // Cada 5 segundos
                this.gameStats.hunger = Math.max(0, this.gameStats.hunger - 1);
                this.gameStats.energy = Math.max(0, this.gameStats.energy - 0.5);
                this.gameStats.cleanliness = Math.max(0, this.gameStats.cleanliness - 0.5);

                if (this.gameStats.hunger < 50) {
                    this.gameStats.happiness = Math.max(0, this.gameStats.happiness - 1);
                }
            }

            this.updateStatsDisplay();
            this.lastUpdateTime = now;
        }

        updateStatsDisplay() {
            const statsDiv = document.getElementById('pou-stats');
            if (statsDiv) {
                statsDiv.innerHTML = `
                    <div>😊 Happiness: ${Math.round(this.gameStats.happiness)}%</div>
                    <div>🍎 Hunger: ${Math.round(this.gameStats.hunger)}%</div>
                    <div>🧼 Clean: ${Math.round(this.gameStats.cleanliness)}%</div>
                    <div>⚡ Energy: ${Math.round(this.gameStats.energy)}%</div>
                `;
            }
        }

        async cleanCanvas() {
            if (!drawariaCanvas) return;
            console.log('🧹 [POU GAME] Limpiando canvas...');

            const canvasWidth = drawariaCanvas.width;
            const canvasHeight = drawariaCanvas.height;

            for (let y = 0; y < canvasHeight; y += 80) {
                for (let x = 0; x < canvasWidth; x += 80) {
                    const width = Math.min(80, canvasWidth - x);
                    const height = Math.min(80, canvasHeight - y);
                    enqueueDrawCommand(x, y, x + width, y + height, '#FFFFFF', Math.max(width, height));
                    await sleep(5);
                }
            }

            if (drawariaCtx) {
                drawariaCtx.clearRect(0, 0, canvasWidth, canvasHeight);
            }
        }

        startSystem() {
            if (!this.initialized) {
                console.log('❌ [POU GAME] Sistema no inicializado');
                return;
            }

            if (!selectedPlayerId) {
                console.log('❌ [POU GAME] No hay jugador seleccionado');
                return;
            }

            pouGameActive = true;
            this.playerManager.startAutoUpdate();

            // Reset stats
            this.gameStats = {
                happiness: 100,
                hunger: 50,
                cleanliness: 80,
                energy: 70
            };

            const updateLoop = () => {
                if (pouGameActive && this.initialized) {
                    this.updateGameLoop();
                }
                if (pouGameActive) {
                    requestAnimationFrame(updateLoop);
                }
            };
            updateLoop();

            console.log('🎮 [POU GAME] Juego POU iniciado');
        }

        async stopSystem() {
            console.log('⏹️ [POU GAME] Deteniendo juego POU...');

            pouGameActive = false;
            this.playerManager.stopAutoUpdate();

            await this.cleanCanvas();

            commandQueue.length = 0;
            this.pouStates.clear();

            console.log('⏹️ [POU GAME] Juego POU detenido');
        }

        createInterface() {
            const existingPanel = document.getElementById('pou-game-control');
            if (existingPanel) existingPanel.remove();

            const controlPanel = document.createElement('div');
            controlPanel.id = 'pou-game-control';
            controlPanel.style.cssText = `
                position: fixed; top: 20px; right: 20px; z-index: 9999;
                background: linear-gradient(135deg, #8B4513, #DEB887);
                color: white; padding: 20px; border-radius: 15px;
                font-family: 'Segoe UI', Arial, sans-serif;
                border: 3px solid #FFD700; min-width: 320px;
                box-shadow: 0 0 30px rgba(255,215,0,0.4);
                font-size: 14px;
            `;

            controlPanel.innerHTML = `
                <div style="text-align: center; font-weight: bold; color: #FFD700; margin-bottom: 15px;">
                    🎮 POU INTERACTIVE GAME 🎮
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; color: #FFD700;">🎯 Target Player:</label>
                    <select id="pou-player-selector" style="width: 100%; padding: 8px; border-radius: 5px; background: #2d2d2d; color: white; border: 1px solid #FFD700;">
                        <option value="">🔍 Scanning players...</option>
                    </select>
                </div>

                <div id="pou-stats" style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 8px; margin-bottom: 15px; font-size: 12px;">
                    <div>😊 Happiness: 100%</div>
                    <div>🍎 Hunger: 50%</div>
                    <div>🧼 Clean: 80%</div>
                    <div>⚡ Energy: 70%</div>
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 8px; color: #FFD700;">🎲 Mini Games:</label>
                    <div style="display: flex; gap: 5px; flex-wrap: wrap;">
                        <button id="feed-btn" style="flex: 1; padding: 6px; background: #FF6B6B; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 11px;">🍎 Feed</button>
                        <button id="play-btn" style="flex: 1; padding: 6px; background: #4ECDC4; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 11px;">⚽ Play</button>
                        <button id="clean-btn" style="flex: 1; padding: 6px; background: #45B7D1; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 11px;">🧼 Clean</button>
                    </div>
                </div>

                <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                    <button id="pou-start-btn" style="flex: 1; padding: 10px; background: linear-gradient(135deg, #00FF00, #32CD32); color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;" disabled>
                        ▶️ START POU
                    </button>
                    <button id="pou-stop-btn" style="flex: 1; padding: 10px; background: linear-gradient(135deg, #FF4444, #CC0000); color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;" disabled>
                        ⏹️ STOP
                    </button>
                </div>

                <div style="font-size: 11px; color: rgba(255,255,255,0.7); text-align: center;">
                    🎯 POU follows selected player | 🎲 Interactive minigames | 📊 Real-time stats
                </div>
            `;

            document.body.appendChild(controlPanel);
            this.setupEventListeners();
        }

        setupEventListeners() {
            const playerSelect = document.getElementById('pou-player-selector');
            const startBtn = document.getElementById('pou-start-btn');
            const stopBtn = document.getElementById('pou-stop-btn');
            const feedBtn = document.getElementById('feed-btn');
            const playBtn = document.getElementById('play-btn');
            const cleanBtn = document.getElementById('clean-btn');

            playerSelect?.addEventListener('change', (e) => {
                selectedPlayerId = e.target.value;
                if (selectedPlayerId === 'all') {
                    selectedPlayerName = 'All Players';
                } else if (selectedPlayerId) {
                    const selectedOption = e.target.options[e.target.selectedIndex];
                    selectedPlayerName = selectedOption.dataset.playerName || selectedOption.textContent.replace('🎮 ', '');
                } else {
                    selectedPlayerName = null;
                }

                if (startBtn) startBtn.disabled = !selectedPlayerId;
                console.log(`🎯 [POU GAME] Target: ${selectedPlayerName || 'None'}`);
            });

            startBtn?.addEventListener('click', () => {
                this.startSystem();
                startBtn.disabled = true;
                if (stopBtn) stopBtn.disabled = false;
                if (feedBtn) feedBtn.disabled = false;
                if (playBtn) playBtn.disabled = false;
                if (cleanBtn) cleanBtn.disabled = false;
            });

            stopBtn?.addEventListener('click', async () => {
                stopBtn.disabled = true;
                stopBtn.textContent = '🧹 CLEANING...';

                await this.stopSystem();

                stopBtn.textContent = '⏹️ STOP';
                if (startBtn) startBtn.disabled = false;
                stopBtn.disabled = true;
                if (feedBtn) feedBtn.disabled = true;
                if (playBtn) playBtn.disabled = true;
                if (cleanBtn) cleanBtn.disabled = true;
            });

            feedBtn?.addEventListener('click', async () => {
                if (!pouGameActive) return;
                const players = this.getTargetPlayerCoords(selectedPlayerId);
                if (players) {
                    players.forEach(player => this.feedingMinigame(player));
                }
            });

            playBtn?.addEventListener('click', async () => {
                if (!pouGameActive) return;
                const players = this.getTargetPlayerCoords(selectedPlayerId);
                if (players) {
                    players.forEach(player => this.playMinigame(player));
                }
            });

            cleanBtn?.addEventListener('click', async () => {
                if (!pouGameActive) return;
                const players = this.getTargetPlayerCoords(selectedPlayerId);
                if (players) {
                    players.forEach(player => this.cleaningMinigame(player));
                }
            });

            // Inicializar actualización de jugadores
            setTimeout(() => {
                this.playerManager.startAutoUpdate();
            }, 1000);
        }
    }

    /* ----------  INICIALIZACIÓN  ---------- */
    let pouGameSystem = null;

    const initPouGame = () => {
        if (!pouGameSystem) {
            console.log('🚀 [POU GAME] Inicializando POU Interactive Game...');
            pouGameSystem = new PouGameSystem();

            setTimeout(() => {
                console.log('');
                console.log('✅ [POU GAME] POU INTERACTIVE GAME LOADED! 🎮');
                console.log('🐾 [POU GAME] Tu mascota virtual POU en Drawaria');
                console.log('🎯 [POU GAME] Selecciona jugador para que POU lo siga');
                console.log('🎲 [POU GAME] 3 Minijuegos: Feed 🍎 | Play ⚽ | Clean 🧼');
                console.log('📊 [POU GAME] Stats en tiempo real: Felicidad, Hambre, Limpieza, Energía');
                console.log('😊 [POU GAME] POU cambia de humor según sus stats');
                console.log('💖 [POU GAME] Corazones cuando POU está feliz');
                console.log('🎨 [POU GAME] Pixel art optimizado y animaciones');
                console.log('🧹 [POU GAME] Limpieza automática de canvas al parar');
                console.log('');
            }, 1000);
        }
    };

    // Inicialización
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPouGame);
    } else {
        setTimeout(initPouGame, 500);
    }

    setTimeout(initPouGame, 2000);

    console.log('🌟 [POU GAME] Drawaria POU Interactive Game loaded! 🌟');

})();
