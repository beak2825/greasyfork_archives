// ==UserScript==
// @name         Drawaria Physics Engine Volleyball🏐
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Advanced volleyball physics with professional FIVB court and spike system!
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        none
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/547933/Drawaria%20Physics%20Engine%20Volleyball%F0%9F%8F%90.user.js
// @updateURL https://update.greasyfork.org/scripts/547933/Drawaria%20Physics%20Engine%20Volleyball%F0%9F%8F%90.meta.js
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
    const BATCH_SIZE = 16;
    const BATCH_INTERVAL = 38;

    const positionCache = new Map();
    const MOVEMENT_THRESHOLD = 2;

    // ✅ COLORES OFICIALES DE VOLLEYBALL FIVB
    const VOLLEYBALL_COLORS = {
        courtColor: '#FF8C69',      // Naranja cancha interior
        floorColor: '#DEB887',      // Piso beige alrededor
        lineColor: '#FFFFFF',       // Líneas blancas oficiales (5cm ancho)
        netColor: '#000000',        // Red negra
        postColor: '#8B4513',       // Postes marrones
        attackLineColor: '#FFFF00', // Línea de ataque amarilla
        textColor: '#FFFFFF',       // Texto blanco
        zoneColor: '#FFE4B5'        // Zonas de saque
    };

    // Volleyball physics constants[1][2]
    const VOLLEYBALL_PHYSICS = {
        GRAVITY: 250,               // Gravedad reducida para rallies largos
        BALL_MASS: 0.08,           // Pelota muy liviana
        BALL_RADIUS: 18,           // Tamaño medio de volleyball
        TIMESTEP: 1/60,
        MAX_VELOCITY: 700,         // Velocidad alta para spikes
        AIR_RESISTANCE: 0.008,     // Más resistencia para flotación
        RESTITUTION_BALL: 0.9,     // Rebote alto característico
        RESTITUTION_NET: 0.2,      // Rebote bajo en la red
        RESTITUTION_FLOOR: 0.85,   // Rebote alto en el piso
        FRICTION_COURT: 0.7,       // Fricción media
        PLAYER_INTERACTION_FORCE: 400,
        PLAYER_PUSH_MULTIPLIER: 2.5,

        // Volleyball specific[3]
        SPIKE_FORCE: 500,
        SET_FORCE: 200,
        SERVE_FORCE: 350,
        BALL_COLOR: '#FFFFE0',     // Amarillo claro como pidió
        NET_HEIGHT_MALE: 80,       // 2.43m convertido a pixels
        NET_HEIGHT_FEMALE: 75,     // 2.24m convertido a pixels
        ATTACK_LINE_DISTANCE: 0.33, // 3m de 9m = 1/3
        TOUCH_LIMIT: 3             // Máximo 3 toques por equipo
    };

    const VOLLEYBALL_GAME = {
        POINTS_TO_WIN: 25,
        SETS_TO_WIN: 3,
        MIN_POINT_DIFFERENCE: 2,
        MAX_TOUCHES_PER_TEAM: 3
    };

    let isDrawing = false;
    let isStopped = false;

    // WebSocket interception
    const originalWebSocketSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (...args) {
        if (!drawariaSocket && this.url && this.url.includes('drawaria')) {
            drawariaSocket = this;
            console.log('🔗 Drawaria WebSocket captured for volleyball engine.');
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

    // ✅ SISTEMA DE COORDENADAS DE VOLLEYBALL PROFESIONAL
    function getCanvasSize() {
        return {
            width: drawariaCanvas.width,
            height: drawariaCanvas.height
        };
    }

    function calculateVolleyballCoordinates() {
        const size = getCanvasSize();

        // Cancha oficial: 18m x 9m (proporción 2:1)[1][2]
        const courtWidth = Math.floor(size.width * 0.8);
        const courtHeight = Math.floor(courtWidth * 0.5); // Mantener proporción 2:1
        const courtX = (size.width - courtWidth) / 2;
        const courtY = (size.height - courtHeight) / 2;

        const coords = {
            // Cancha principal (18m x 9m)
            court: {
                x: courtX,
                y: courtY,
                width: courtWidth,
                height: courtHeight
            },

            // Red central[3]
            net: {
                x: courtX + courtWidth / 2,
                y1: courtY,
                y2: courtY + courtHeight,
                height: VOLLEYBALL_PHYSICS.NET_HEIGHT_MALE,
                width: 4
            },

            // Postes de la red
            netPosts: {
                left: {
                    x: courtX + courtWidth / 2 - 2,
                    y: courtY - 30,
                    width: 4,
                    height: 30 + VOLLEYBALL_PHYSICS.NET_HEIGHT_MALE
                },
                right: {
                    x: courtX + courtWidth / 2 - 2,
                    y: courtY + courtHeight,
                    width: 4,
                    height: 30 + VOLLEYBALL_PHYSICS.NET_HEIGHT_MALE
                }
            },

            // Líneas de ataque (3 metros de la red)[1]
            attackLines: {
                left: {
                    x: courtX + courtWidth * (0.5 - VOLLEYBALL_PHYSICS.ATTACK_LINE_DISTANCE),
                    y1: courtY,
                    y2: courtY + courtHeight
                },
                right: {
                    x: courtX + courtWidth * (0.5 + VOLLEYBALL_PHYSICS.ATTACK_LINE_DISTANCE),
                    y1: courtY,
                    y2: courtY + courtHeight
                }
            },

            // Zonas de juego (cada lado 9m x 9m)
            zones: {
                leftSide: {
                    x: courtX,
                    y: courtY,
                    width: courtWidth / 2,
                    height: courtHeight
                },
                rightSide: {
                    x: courtX + courtWidth / 2,
                    y: courtY,
                    width: courtWidth / 2,
                    height: courtHeight
                }
            },

            // Áreas de saque
            serveAreas: {
                leftServe: {
                    x: courtX - 20,
                    y: courtY + courtHeight * 0.8,
                    width: 20,
                    height: courtHeight * 0.2
                },
                rightServe: {
                    x: courtX + courtWidth,
                    y: courtY + courtHeight * 0.8,
                    width: 20,
                    height: courtHeight * 0.2
                }
            },

            // Texto
            text: {
                x: Math.floor(size.width * 0.5),
                y: Math.floor(size.height * 0.05),
                pixelSize: Math.max(2, Math.floor(size.width * 0.004))
            }
        };

        return coords;
    }

    function sendDrawCommand(x, y, x2, y2, color, thickness) {
        if (!drawariaSocket || !drawariaCanvas) return;

        const normX = (x / drawariaCanvas.width).toFixed(4);
        const normY = (y / drawariaCanvas.height).toFixed(4);
        const normX2 = (x2 / drawariaCanvas.width).toFixed(4);
        const normY2 = (y2 / drawariaCanvas.height).toFixed(4);

        const command = `42["drawcmd",0,[${normX},${normY},${normX2},${normY2},false,${0 - thickness},"${color}",0,0,{}]]`;
        drawariaSocket.send(command);
    }

    async function drawLineLocalAndServer(startX, startY, endX, endY, color, thickness, delay = 40) {
        if (isStopped) {
            isDrawing = false;
            return;
        }

        const canvasSize = getCanvasSize();
        startX = clamp(startX, -50, canvasSize.width + 50);
        startY = clamp(startY, 0, canvasSize.height);
        endX = clamp(endX, -50, canvasSize.width + 50);
        endY = clamp(endY, 0, canvasSize.height);

        if (drawariaCtx && startX >= 0 && startX <= canvasSize.width && startY >= 0 && startY <= canvasSize.height) {
            drawariaCtx.strokeStyle = color;
            drawariaCtx.lineWidth = thickness;
            drawariaCtx.lineCap = 'round';
            drawariaCtx.lineJoin = 'round';
            drawariaCtx.beginPath();
            drawariaCtx.moveTo(startX, startY);
            drawariaCtx.lineTo(endX, endY);
            drawariaCtx.stroke();
        }

        sendDrawCommand(startX, startY, endX, endY, color, thickness);
        await sleep(delay);
    }

    async function drawPixel(x, y, color, size = 2) {
        if (isStopped) return;

        const canvasSize = getCanvasSize();
        x = clamp(x, 0, canvasSize.width - size);
        y = clamp(y, 0, canvasSize.height - size);

        if (drawariaCtx) {
            drawariaCtx.fillStyle = color;
            drawariaCtx.fillRect(x, y, size, size);
        }

        sendDrawCommand(x, y, x + 1, y + 1, color, size);
        await sleep(10);
    }

    // ✅ FUNCIONES DE DIBUJO DE CANCHA DE VOLLEYBALL
    async function drawVolleyballCourt() {
        if (isStopped) return;

        updateStatus(document.getElementById('volleyball-status'), "🏐 Dibujando cancha oficial FIVB...", VOLLEYBALL_COLORS.courtColor);

        const coords = calculateVolleyballCoordinates();

        // Piso alrededor de la cancha
        const canvasSize = getCanvasSize();
        for (let y = 20; y < canvasSize.height - 20; y += 5) {
            await drawLineLocalAndServer(20, y, canvasSize.width - 20, y, VOLLEYBALL_COLORS.floorColor, 2, 15);
            if (isStopped) break;
        }

        // Superficie de la cancha (18m x 9m)
        for (let y = coords.court.y; y < coords.court.y + coords.court.height; y += 4) {
            await drawLineLocalAndServer(coords.court.x, y, coords.court.x + coords.court.width, y, VOLLEYBALL_COLORS.courtColor, 2, 20);
            if (isStopped) break;
        }
    }

    async function drawVolleyballLines(coords) {
        if (isStopped) return;

        updateStatus(document.getElementById('volleyball-status'), "⚪ Dibujando líneas oficiales FIVB...", VOLLEYBALL_COLORS.lineColor);

        // Grosor oficial de líneas: 5cm[1]
        const lineThickness = Math.max(4, Math.floor(drawariaCanvas.width * 0.008));

        // Perímetro de la cancha (18m x 9m)
        await drawRectangleOutline(coords.court, VOLLEYBALL_COLORS.lineColor, lineThickness);

        // Línea central (divide la cancha en dos partes iguales)
        await drawLineLocalAndServer(
            coords.net.x, coords.court.y,
            coords.net.x, coords.court.y + coords.court.height,
            VOLLEYBALL_COLORS.lineColor, lineThickness, 60
        );

        // Líneas de ataque (3 metros de la red en cada lado)[1]
        await drawLineLocalAndServer(
            coords.attackLines.left.x, coords.attackLines.left.y1,
            coords.attackLines.left.x, coords.attackLines.left.y2,
            VOLLEYBALL_COLORS.attackLineColor, lineThickness, 70
        );

        await drawLineLocalAndServer(
            coords.attackLines.right.x, coords.attackLines.right.y1,
            coords.attackLines.right.x, coords.attackLines.right.y2,
            VOLLEYBALL_COLORS.attackLineColor, lineThickness, 70
        );
    }

    async function drawVolleyballNet(coords) {
        if (isStopped) return;

        updateStatus(document.getElementById('volleyball-status'), "🕸️ Instalando red de volleyball...", VOLLEYBALL_COLORS.netColor);

        // Postes de la red
        await drawRectangleOutline(coords.netPosts.left, VOLLEYBALL_COLORS.postColor, 4);
        await drawRectangleOutline(coords.netPosts.right, VOLLEYBALL_COLORS.postColor, 4);

        // Rellenar postes
        await fillRectangle(coords.netPosts.left, VOLLEYBALL_COLORS.postColor);
        await fillRectangle(coords.netPosts.right, VOLLEYBALL_COLORS.postColor);

        // Red vertical (1 metro de ancho)[2][3]
        const netDensity = 16;
        for (let i = 0; i < netDensity; i++) {
            const netY = coords.net.y1 + (i * (coords.net.y2 - coords.net.y1) / netDensity);
            await drawLineLocalAndServer(
                coords.net.x, netY,
                coords.net.x, netY + (coords.net.y2 - coords.net.y1) / netDensity,
                VOLLEYBALL_COLORS.netColor, 2, 25
            );
            if (isStopped) break;
        }

        // Líneas horizontales de la red
        const horizontalNetLines = 12;
        for (let i = 0; i < horizontalNetLines; i++) {
            const netX = coords.net.x - 1 + (i * 0.2);
            await drawLineLocalAndServer(
                netX, coords.net.y1,
                netX, coords.net.y2,
                VOLLEYBALL_COLORS.netColor, 1, 20
            );
            if (isStopped) break;
        }

        // Borde superior de la red (más grueso)
        await drawLineLocalAndServer(
            coords.net.x - 2, coords.net.y1,
            coords.net.x + 2, coords.net.y1,
            VOLLEYBALL_COLORS.netColor, 6, 50
        );
    }

    async function drawVolleyballZones(coords) {
        if (isStopped) return;

        updateStatus(document.getElementById('volleyball-status'), "🎯 Marcando zonas de juego...", VOLLEYBALL_COLORS.zoneColor);

        // Zonas de saque
        await drawRectangleOutline(coords.serveAreas.leftServe, VOLLEYBALL_COLORS.zoneColor, 3);
        await drawRectangleOutline(coords.serveAreas.rightServe, VOLLEYBALL_COLORS.zoneColor, 3);

        // Marcar zonas de ataque y defensa con líneas punteadas
        await drawDottedZones(coords);
    }

    async function drawDottedZones(coords) {
        // Zona de ataque izquierda (frontal)
        for (let x = coords.court.x; x < coords.attackLines.left.x; x += 15) {
            await drawLineLocalAndServer(x, coords.court.y + 10, x + 8, coords.court.y + 10, VOLLEYBALL_COLORS.zoneColor, 2, 15);
            if (isStopped) break;
        }

        // Zona de ataque derecha (frontal)
        for (let x = coords.attackLines.right.x; x < coords.court.x + coords.court.width; x += 15) {
            await drawLineLocalAndServer(x, coords.court.y + 10, x + 8, coords.court.y + 10, VOLLEYBALL_COLORS.zoneColor, 2, 15);
            if (isStopped) break;
        }
    }

    // ✅ FUNCIONES GEOMÉTRICAS
    async function drawRectangleOutline(rectCoords, color, thickness) {
        await drawLineLocalAndServer(rectCoords.x, rectCoords.y,
            rectCoords.x + rectCoords.width, rectCoords.y, color, thickness, 35);
        await drawLineLocalAndServer(rectCoords.x + rectCoords.width, rectCoords.y,
            rectCoords.x + rectCoords.width, rectCoords.y + rectCoords.height, color, thickness, 35);
        await drawLineLocalAndServer(rectCoords.x + rectCoords.width, rectCoords.y + rectCoords.height,
            rectCoords.x, rectCoords.y + rectCoords.height, color, thickness, 35);
        await drawLineLocalAndServer(rectCoords.x, rectCoords.y + rectCoords.height,
            rectCoords.x, rectCoords.y, color, thickness, 35);
    }

    async function fillRectangle(rectCoords, color) {
        const steps = Math.floor(rectCoords.height / 3);
        for (let i = 0; i < steps; i++) {
            const y = rectCoords.y + (i * 3);
            await drawLineLocalAndServer(rectCoords.x + 1, y, rectCoords.x + rectCoords.width - 1, y, color, 2, 12);
            if (isStopped) break;
        }
    }

    // ✅ TEXTO VOLLEYBALL EN PIXEL ART
    const VOLLEYBALL_LETTERS = {
        'V': [[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[0,1,0,1,0],[0,0,1,0,0]],
        'O': [[1,1,1,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,1,1,1]],
        'L': [[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,1,1,1]],
        'E': [[1,1,1,1],[1,0,0,0],[1,1,1,0],[1,0,0,0],[1,1,1,1]],
        'Y': [[1,0,0,0,1],[1,0,0,0,1],[0,1,0,1,0],[0,0,1,0,0],[0,0,1,0,0]],
        'B': [[1,1,1,1],[1,0,0,1],[1,1,1,1],[1,0,0,1],[1,1,1,1]],
        'A': [[0,1,1,0],[1,0,0,1],[1,1,1,1],[1,0,0,1],[1,0,0,1]],
        'R': [[1,1,1,0],[1,0,0,1],[1,1,1,0],[1,0,1,0],[1,0,0,1]]
    };

    async function drawVolleyballPixelText(text, coords) {
        if (isStopped) return;

        const letterSpacing = coords.text.pixelSize * 6;
        const textWidth = text.length * letterSpacing;
        let currentX = coords.text.x - (textWidth / 2);

        for (let i = 0; i < text.length; i++) {
            if (isStopped) break;

            const letter = text[i].toUpperCase();
            if (letter === ' ') {
                currentX += letterSpacing;
                continue;
            }

            const pattern = VOLLEYBALL_LETTERS[letter];
            if (!pattern) continue;

            for (let row = 0; row < pattern.length; row++) {
                for (let col = 0; col < pattern[row].length; col++) {
                    if (pattern[row][col] === 1) {
                        const pixelX = currentX + (col * coords.text.pixelSize);
                        const pixelY = coords.text.y + (row * coords.text.pixelSize);

                        const canvasSize = getCanvasSize();
                        if (pixelX >= 0 && pixelX < canvasSize.width && pixelY >= 0 && pixelY < canvasSize.height) {
                            await drawPixel(pixelX, pixelY, VOLLEYBALL_COLORS.textColor, coords.text.pixelSize);
                        }
                    }
                }
            }

            currentX += letterSpacing;
            await sleep(80);
        }
    }

    // ✅ FUNCIÓN PRINCIPAL: CANCHA DE VOLLEYBALL COMPLETA
    async function drawCompleteVolleyballCourt() {
        if (isDrawing) {
            alert('Ya está en curso un dibujo. Presiona "Parar" para cancelar.');
            return;
        }

        if (!drawariaSocket || !drawariaCanvas || !drawariaCtx) {
            alert('No se detectó conexión o canvas. Asegúrate de estar en una sala de juego.');
            return;
        }

        isDrawing = true;
        isStopped = false;
        const statusDiv = document.getElementById('volleyball-status') || createStatusDiv();

        try {
            const coords = calculateVolleyballCoordinates();
            const canvasSize = getCanvasSize();

            console.log(`🏐 Cancha de volleyball FIVB iniciada:`);
            console.log(`📏 Canvas: ${canvasSize.width}x${canvasSize.height}`);

            updateStatus(statusDiv, `🏐 CANCHA VOLLEYBALL FIVB: ${canvasSize.width}x${canvasSize.height}`, "#FF8C69");
            await sleep(800);

            // FASE 1: SUPERFICIE DE CANCHA
            updateStatus(statusDiv, "🏐 FASE 1: Superficie oficial FIVB...", VOLLEYBALL_COLORS.courtColor);
            await drawVolleyballCourt();
            await sleep(300);
            if (isStopped) return;

            // FASE 2: LÍNEAS OFICIALES
            updateStatus(statusDiv, "⚪ FASE 2: Líneas oficiales (5cm ancho)...", VOLLEYBALL_COLORS.lineColor);
            await drawVolleyballLines(coords);
            await sleep(300);
            if (isStopped) return;

            // FASE 3: RED Y POSTES
            updateStatus(statusDiv, "🕸️ FASE 3: Red y postes oficiales...", VOLLEYBALL_COLORS.netColor);
            await drawVolleyballNet(coords);
            await sleep(300);
            if (isStopped) return;

            // FASE 4: ZONAS DE JUEGO
            updateStatus(statusDiv, "🎯 FASE 4: Zonas de ataque y saque...", VOLLEYBALL_COLORS.zoneColor);
            await drawVolleyballZones(coords);
            await sleep(300);
            if (isStopped) return;

            // FASE 5: TEXTO VOLLEYBALL
            updateStatus(statusDiv, "🎮 FASE 5: Texto blanco 'VOLLEYBALL'...", VOLLEYBALL_COLORS.textColor);
            await drawVolleyballPixelText("VOLLEYBALL", coords);

            // CANCHA COMPLETA
            updateStatus(statusDiv, "🏆 ¡CANCHA DE VOLLEYBALL FIVB COMPLETA! 🏐🏆", "#006400");

            setTimeout(() => {
                if (statusDiv && statusDiv.parentNode) {
                    statusDiv.style.opacity = 0;
                    setTimeout(() => statusDiv.remove(), 500);
                }
            }, 4000);

        } catch (error) {
            console.error("Error en cancha de volleyball:", error);
            updateStatus(statusDiv, `❌ Error: ${error.message}`, "#B22222");
        } finally {
            isDrawing = false;
        }
    }

    function createStatusDiv() {
        const statusDiv = document.createElement('div');
        statusDiv.id = 'volleyball-status';
        statusDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #FF8C69 0%, #FFE4B5 100%);
            color: white;
            padding: 20px 45px;
            border-radius: 35px;
            font-weight: bold;
            z-index: 10000;
            transition: opacity 0.5s;
            text-align: center;
            min-width: 500px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.5);
            text-shadow: 1px 1px 3px rgba(0,0,0,0.4);
            border: 2px solid #FFFFFF;
        `;
        document.body.appendChild(statusDiv);
        return statusDiv;
    }

    function updateStatus(statusDiv, message, color) {
        if (!statusDiv) return;
        statusDiv.textContent = message;
        if (color) {
            statusDiv.style.background = color;
        }
        statusDiv.style.opacity = 1;
    }

    /* ---------- ADVANCED VOLLEYBALL PHYSICS ENGINE ---------- */
    class AdvancedDrawariaVolleyball {
        constructor() {
            this.initialized = false;
            this.isActive = false;
            this.physicsObjects = new Map();
            this.objectIdCounter = 0;
            this.lastRenderTime = 0;
            this.renderInterval = 1000 / 30;

            // Sistema de toques de volleyball[4][5]
            this.touchSystem = {
                teamTouches: { left: 0, right: 0 },
                lastTouchTeam: null,
                maxTouches: VOLLEYBALL_GAME.MAX_TOUCHES_PER_TEAM,
                touchCooldown: 200
            };

            // Volleyball game state
            this.volleyballGame = {
                active: false,
                sets: { p1: 0, p2: 0 },
                points: { p1: 0, p2: 0 },
                serving: 'p1',
                netHeight: VOLLEYBALL_PHYSICS.NET_HEIGHT_MALE,
                currentSet: 1
            };

            this.gameStats = {
                totalSpikes: 0,
                totalBlocks: 0,
                totalSets: 0,
                aces: 0,
                maxVelocityReached: 0,
                ballsCreated: 0,
                ralliesPlayed: 0
            };

            this.controls = {
                showDebug: false,
                defaultBallColor: VOLLEYBALL_PHYSICS.BALL_COLOR,
                netHeight: 'male', // male or female
                gameMode: 'rally'
            };

            this.playerTracker = {
                players: new Map(),
                detectionRadius: VOLLEYBALL_PHYSICS.BALL_RADIUS * 2.5,
                lastUpdateTime: 0
            };

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
                    this.createVolleyballPanel();
                    console.log('✅ Advanced Volleyball Physics Engine v1.0 initialized');
                } else {
                    setTimeout(checkGameReady, 100);
                }
            };
            checkGameReady();
        }

        createVolleyballPanel() {
            const existingPanel = document.getElementById('volleyball-physics-panel');
            if (existingPanel) existingPanel.remove();

            const panel = document.createElement('div');
            panel.id = 'volleyball-physics-panel';
            panel.style.cssText = `
                position: fixed !important;
                top: 20px !important;
                right: 20px !important;
                width: 400px !important;
                z-index: 2147483647 !important;
                background: linear-gradient(135deg, #2f1f0f, #4a3a1a) !important;
                border: 2px solid #FF8C69 !important;
                border-radius: 15px !important;
                color: white !important;
                font-family: 'Segoe UI', Arial, sans-serif !important;
                overflow: hidden !important;
                box-shadow: 0 0 30px rgba(255,140,105,0.4) !important;
            `;

            panel.innerHTML = `
                <!-- HEADER -->
                <div id="volleyball-panel-header" style="
                    background: linear-gradient(45deg, #FF8C69, #FFE4B5);
                    padding: 12px 20px;
                    font-weight: bold;
                    text-align: center;
                    font-size: 14px;
                    cursor: move;
                    user-select: none;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <div style="flex: 1;">🏐 FIVB VOLLEYBALL ENGINE v1.0</div>
                    <div style="display: flex; gap: 8px;">
                        <button id="volleyball-minimize-btn" style="
                            width: 25px; height: 25px;
                            background: rgba(255,255,255,0.2);
                            border: none; border-radius: 4px;
                            color: white; cursor: pointer;
                            font-size: 16px; line-height: 1; padding: 0;
                        ">−</button>
                        <button id="volleyball-close-btn" style="
                            width: 25px; height: 25px;
                            background: rgba(255,0,0,0.6);
                            border: none; border-radius: 4px;
                            color: white; cursor: pointer;
                            font-size: 18px; line-height: 1; padding: 0;
                        ">×</button>
                    </div>
                </div>

                <!-- CONTENT -->
                <div id="volleyball-panel-content" style="padding: 20px;">
                    <!-- CREATE VOLLEYBALL COURT -->
                    <div style="margin-bottom: 15px; text-align: center;">
                        <button id="create-volleyball-court-btn" style="
                            width: 100%;
                            padding: 12px;
                            background: linear-gradient(135deg, #FF8C69, #FFE4B5);
                            color: white;
                            border: none;
                            border-radius: 8px;
                            cursor: pointer;
                            font-size: 14px;
                            font-weight: bold;
                            margin-bottom: 10px;
                            box-shadow: 0 4px 15px rgba(255,140,105,0.3);
                        ">🏐 Create FIVB Volleyball Court</button>
                    </div>

                    <!-- LAUNCH VOLLEYBALL ENGINE -->
                    <div style="margin-bottom: 15px; text-align: center;">
                        <button id="toggle-volleyball-physics" style="
                            width: 100%;
                            padding: 12px;
                            background: linear-gradient(135deg, #FFFFE0, #FFD700);
                            color: #333;
                            border: none;
                            border-radius: 8px;
                            cursor: pointer;
                            font-size: 14px;
                            font-weight: bold;
                        ">🚀 Launch Volleyball Engine</button>
                    </div>

                    <!-- VOLLEYBALL ACTIONS -->
                    <div style="display: flex; gap: 8px; margin-bottom: 15px;">
                        <button id="add-volleyball-btn" style="
                            flex: 1;
                            padding: 8px;
                            background: linear-gradient(135deg, #FFFFE0, #FFD700);
                            color: #333;
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 12px;
                            font-weight: bold;
                        ">🏐 Add Ball</button>
                        <button id="spike-ball-btn" style="
                            flex: 1;
                            padding: 8px;
                            background: linear-gradient(135deg, #FF6347, #FF4500);
                            color: white;
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 12px;
                            font-weight: bold;
                        ">💥 Spike</button>
                        <button id="serve-volleyball-btn" style="
                            flex: 1;
                            padding: 8px;
                            background: linear-gradient(135deg, #32CD32, #228B22);
                            color: white;
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 12px;
                            font-weight: bold;
                        ">🏆 Serve</button>
                    </div>

                    <!-- NET HEIGHT SELECTION -->
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-size: 12px; color: #FFE4B5;">
                            📏 Net Height:
                        </label>
                        <select id="net-height" style="
                            width: 100%;
                            padding: 8px;
                            border: 1px solid #FF8C69;
                            border-radius: 6px;
                            background: #4a3a1a;
                            color: white;
                            font-size: 12px;
                        ">
                            <option value="male">👨 Male (2.43m)</option>
                            <option value="female">👩 Female (2.24m)</option>
                        </select>
                    </div>

                    <!-- ACTION BUTTONS -->
                    <div style="display: flex; gap: 8px; margin-bottom: 15px;">
                        <button id="reset-volleyball-btn" style="
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
                        <button id="stop-volleyball-court-btn" style="
                            flex: 1;
                            padding: 8px;
                            background: linear-gradient(135deg, #e74c3c, #c0392b);
                            color: white;
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: bold;
                            font-size: 11px;
                        ">⛔ Stop Court</button>
                    </div>

                    <!-- VOLLEYBALL MODES -->
                    <div style="margin-bottom: 15px;">
                        <h4 style="margin: 0 0 10px 0; font-size: 13px; color: #FFE4B5; text-align: center;">🌟 Volleyball Modes</h4>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                            <button id="volleyball-match-toggle" class="volleyball-mode-toggle" style="
                                                                padding: 8px;
                                background: linear-gradient(135deg, #444, #666);
                                color: white;
                                border: none;
                                border-radius: 6px;
                                cursor: pointer;
                                font-size: 10px;
                                font-weight: bold;
                            ">🏆 Match Mode</button>
                            <button id="clean-volleyball-canvas-btn" style="
                                padding: 8px;
                                background: linear-gradient(135deg, #e17055, #d63031);
                                color: white;
                                border: none;
                                border-radius: 6px;
                                cursor: pointer;
                                font-size: 10px;
                                font-weight: bold;
                            ">🧹 Clean Court</button>
                        </div>
                    </div>

                    <!-- CLEAR ALL -->
                    <div style="margin-bottom: 15px;">
                        <button id="clear-volleyballs-btn" style="
                            width: 100%;
                            padding: 10px;
                            background: linear-gradient(135deg, #990000, #cc0000);
                            color: white;
                            border: none;
                            border-radius: 8px;
                            cursor: pointer;
                            font-weight: bold;
                        ">🗑️ Clear All Volleyballs</button>
                    </div>

                    <!-- VOLLEYBALL SCOREBOARD -->
                    <div id="volleyball-scoreboard" style="
                        display: none;
                        background: rgba(0,0,0,0.4);
                        padding: 15px;
                        border-radius: 8px;
                        text-align: center;
                        margin-bottom: 15px;
                        border: 2px solid #FFD700;
                    ">
                        <h4 style="margin: 0 0 10px 0; color: #FFD700; font-size: 14px;">🏐 FIVB SCOREBOARD</h4>
                        <div style="display: flex; justify-content: space-between; font-size: 14px; font-weight: bold; margin-bottom: 10px;">
                            <div style="color: #ff6b6b;">
                                Team A: <span id="volleyball-score-a">0</span>
                                <br><small>Sets: <span id="volleyball-sets-a">0</span></small>
                            </div>
                            <div style="color: #FFD700; font-size: 12px;">
                                Set: <span id="current-set">1</span>
                                <br>Serving: <span id="serving-team">A</span>
                            </div>
                            <div style="color: #74b9ff;">
                                Team B: <span id="volleyball-score-b">0</span>
                                <br><small>Sets: <span id="volleyball-sets-b">0</span></small>
                            </div>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 11px; color: #FFFFE0;">
                            <div>Touches A: <span id="touches-a">0</span>/3</div>
                            <div style="color: #FF6347;">Rally: <span id="rally-count">0</span></div>
                            <div>Touches B: <span id="touches-b">0</span>/3</div>
                        </div>
                    </div>

                    <!-- VOLLEYBALL STATS -->
                    <div id="volleyball-stats" style="
                        background: rgba(0,0,0,0.3);
                        padding: 10px;
                        border-radius: 6px;
                        font-size: 10px;
                        text-align: center;
                        border: 1px solid rgba(255,140,105,0.3);
                    ">
                        <div>Volleyballs: <span id="volleyball-count">0</span> | Spikes: <span id="spikes-count">0</span></div>
                        <div>Blocks: <span id="blocks-count">0</span> | Aces: <span id="volleyball-aces-count">0</span></div>
                        <div>Max Speed: <span id="volleyball-max-speed">0</span> km/h</div>
                        <div>Net: <span id="net-height-info">Male (2.43m)</span></div>
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
                        Professional FIVB Court • Volleyball Physics<br>
                        <span style="color: #FFFFE0;">3-touch system • Net collision • Spike mechanics</span>
                    </div>
                </div>
            `;

            document.body.appendChild(panel);

            this.makeVolleyballPanelDraggable();
            this.setupVolleyballPanelButtons();
            this.setupVolleyballEventListeners();
            this.startVolleyballStatsMonitoring();
        }

        setupVolleyballEventListeners() {
            // Volleyball court controls
            document.getElementById('create-volleyball-court-btn')?.addEventListener('click', () => drawCompleteVolleyballCourt());
            document.getElementById('toggle-volleyball-physics')?.addEventListener('click', () => this.toggleVolleyballPhysics());
            document.getElementById('stop-volleyball-court-btn')?.addEventListener('click', () => this.stopVolleyballCourtDrawing());

            // Volleyball creation and actions
            document.getElementById('add-volleyball-btn')?.addEventListener('click', () => this.addRandomVolleyball());
            document.getElementById('spike-ball-btn')?.addEventListener('click', () => this.spikeVolleyball());
            document.getElementById('serve-volleyball-btn')?.addEventListener('click', () => this.serveVolleyball());

            // Actions
            document.getElementById('reset-volleyball-btn')?.addEventListener('click', () => this.resetAllVolleyballs());
            document.getElementById('clear-volleyballs-btn')?.addEventListener('click', () => this.clearAllVolleyballs());
            document.getElementById('volleyball-match-toggle')?.addEventListener('click', () => this.toggleVolleyballMatch());
            document.getElementById('clean-volleyball-canvas-btn')?.addEventListener('click', () => this.cleanVolleyballCourt());

            // Net height selection
            document.getElementById('net-height')?.addEventListener('change', (e) => {
                this.updateNetHeight(e.target.value);
                this.showVolleyballFeedback(`📏 Net Height: ${e.target.options[e.target.selectedIndex].text}`, '#FFE4B5');
            });

            // Canvas click for volleyball
            if (this.canvasElement) {
                this.canvasElement.addEventListener('click', (e) => this.createVolleyball(e.clientX - this.canvasElement.getBoundingClientRect().left, e.clientY - this.canvasElement.getBoundingClientRect().top));
            }
        }

        stopVolleyballCourtDrawing() {
            isStopped = true;
            const statusDiv = document.getElementById('volleyball-status');
            if (statusDiv) {
                updateStatus(statusDiv, "⛔ Dibujo de cancha detenido", "#B22222");
            }
            this.showVolleyballFeedback('⛔ Volleyball court drawing stopped', '#B22222');
        }

        /* ---------- VOLLEYBALL PHYSICS ENGINE ---------- */
        toggleVolleyballPhysics() {
            const toggleBtn = document.getElementById('toggle-volleyball-physics');
            if (!this.isActive) {
                this.startVolleyballPhysics();
                if (toggleBtn) {
                    toggleBtn.textContent = '🛑 Stop Volleyball Engine';
                    toggleBtn.style.background = 'linear-gradient(135deg, #f56565, #e53e3e)';
                    toggleBtn.style.color = 'white';
                }
            } else {
                this.stopVolleyballPhysics();
                if (toggleBtn) {
                    toggleBtn.textContent = '🚀 Launch Volleyball Engine';
                    toggleBtn.style.background = 'linear-gradient(135deg, #FFFFE0, #FFD700)';
                    toggleBtn.style.color = '#333';
                }
            }
        }

        startVolleyballPhysics() {
            if (this.isActive) return;
            this.isActive = true;
            this.startVolleyballGameLoop();
            this.showVolleyballFeedback('🚀 FIVB Volleyball Engine Started!', '#FFD700');
        }

        stopVolleyballPhysics() {
            this.isActive = false;
            this.showVolleyballFeedback('🛑 Volleyball Engine Stopped', '#f56565');
        }

        startVolleyballGameLoop() {
            if (!this.isActive) return;
            const currentTime = performance.now();
            if (currentTime - this.lastRenderTime >= this.renderInterval) {
                this.updateVolleyballPhysics();
                this.renderVolleyballs();
                this.lastRenderTime = currentTime;
            }
            requestAnimationFrame(() => this.startVolleyballGameLoop());
        }

        updateVolleyballPhysics() {
            const dt = VOLLEYBALL_PHYSICS.TIMESTEP;

            // Update volleyballs with specific physics[1][2]
            this.physicsObjects.forEach(ball => {
                if (ball.type !== 'volleyball') return;

                // Apply air resistance (more pronounced for volleyball float)
                ball.vx *= (1 - VOLLEYBALL_PHYSICS.AIR_RESISTANCE * dt);
                ball.vy *= (1 - VOLLEYBALL_PHYSICS.AIR_RESISTANCE * dt);

                // Apply gravity (reduced for longer rallies)
                ball.vy += VOLLEYBALL_PHYSICS.GRAVITY * dt;

                // Apply volleyball float effect
                if (Math.abs(ball.vx) < 50 && Math.abs(ball.vy) < 100) {
                    // Pelota "flotando" - pequeñas turbulencias
                    ball.vx += (Math.random() - 0.5) * 10;
                    ball.vy += (Math.random() - 0.5) * 5;
                }

                // Update position
                ball.x += ball.vx * dt;
                ball.y += ball.vy * dt;

                this.handleVolleyballBoundaryCollisions(ball);
                this.handleVolleyballNetCollision(ball);

                // Velocity tracking for stats
                const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
                if (speed > this.gameStats.maxVelocityReached) {
                    this.gameStats.maxVelocityReached = speed;
                }

                if (speed > VOLLEYBALL_PHYSICS.MAX_VELOCITY) {
                    ball.vx = (ball.vx / speed) * VOLLEYBALL_PHYSICS.MAX_VELOCITY;
                    ball.vy = (ball.vy / speed) * VOLLEYBALL_PHYSICS.MAX_VELOCITY;
                }
            });

            this.handleVolleyballCollisions();
            this.handleVolleyballPlayerActions();

            if (this.volleyballGame.active) {
                this.checkVolleyballScoring();
            }
        }

        updateNetHeight(heightType) {
            this.controls.netHeight = heightType;
            this.volleyballGame.netHeight = heightType === 'male' ?
                VOLLEYBALL_PHYSICS.NET_HEIGHT_MALE :
                VOLLEYBALL_PHYSICS.NET_HEIGHT_FEMALE;

            const heightText = heightType === 'male' ? 'Male (2.43m)' : 'Female (2.24m)';
            document.getElementById('net-height-info').textContent = heightText;
        }

        /* ---------- VOLLEYBALL CREATION ---------- */
        addRandomVolleyball() {
            if (!this.canvasElement) return;

            const coords = calculateVolleyballCoordinates();

            // Spawn en el centro de uno de los lados
            const side = Math.random() > 0.5 ? 'left' : 'right';
            const x = side === 'left' ?
                coords.zones.leftSide.x + coords.zones.leftSide.width * 0.5 :
                coords.zones.rightSide.x + coords.zones.rightSide.width * 0.5;
            const y = coords.court.y + coords.court.height * 0.7;

            this.createVolleyball(x, y);
        }

        spikeVolleyball() {
            if (!this.canvasElement) return;

            const coords = calculateVolleyballCoordinates();

            // Spike desde zona de ataque
            const x = coords.attackLines.left.x + 50;
            const y = coords.court.y + 30;

            const ball = this.createVolleyball(x, y);

            // Aplicar fuerza de spike (hacia abajo y hacia adelante)
            ball.vx = VOLLEYBALL_PHYSICS.SPIKE_FORCE * 0.8;
            ball.vy = VOLLEYBALL_PHYSICS.SPIKE_FORCE * 0.6;

            this.gameStats.totalSpikes++;
            this.showVolleyballFeedback('💥 SPIKE ATTACK!', '#FF6347');
        }

        serveVolleyball() {
            if (!this.canvasElement) return;

            const coords = calculateVolleyballCoordinates();

            // Serve desde área de saque
            const isTeamA = this.volleyballGame.serving === 'a';
            const serveArea = isTeamA ? coords.serveAreas.leftServe : coords.serveAreas.rightServe;

            const ball = this.createVolleyball(
                serveArea.x + serveArea.width / 2,
                serveArea.y + serveArea.height / 2
            );

            // Aplicar fuerza de saque
            const direction = isTeamA ? 1 : -1;
            ball.vx = VOLLEYBALL_PHYSICS.SERVE_FORCE * direction * 0.7;
            ball.vy = -VOLLEYBALL_PHYSICS.SERVE_FORCE * 0.5; // Hacia arriba y adelante

            this.showVolleyballFeedback(`🏐 TEAM ${this.volleyballGame.serving.toUpperCase()} SERVES!`, '#32CD32');
        }

        createVolleyball(x, y) {
            const id = `volleyball_${this.objectIdCounter++}`;
            const ball = {
                id: id,
                type: 'volleyball',
                x: x, y: y, vx: 0, vy: 0,
                radius: VOLLEYBALL_PHYSICS.BALL_RADIUS,
                color: VOLLEYBALL_PHYSICS.BALL_COLOR,
                mass: VOLLEYBALL_PHYSICS.BALL_MASS,
                restitution: VOLLEYBALL_PHYSICS.RESTITUTION_BALL,
                friction: VOLLEYBALL_PHYSICS.FRICTION_COURT,
                lastRenderX: -9999, lastRenderY: -9999,
                creationTime: performance.now(),
                lastCollisionTime: 0,

                // Volleyball specific properties
                lastTouchTime: 0,
                lastTouchTeam: null,
                bounceCount: 0,
                isInPlay: true,
                sideOfCourt: null, // 'left' or 'right'
                floatEffect: Math.random() * 0.1
            };

            this.physicsObjects.set(id, ball);
            this.gameStats.ballsCreated++;
            return ball;
        }

        /* ---------- VOLLEYBALL COLLISION HANDLING ---------- */
        handleVolleyballBoundaryCollisions(ball) {
            if (!this.canvasElement) return;

            const coords = calculateVolleyballCoordinates();
            const ballHalfSize = ball.radius;

            // Límites de la cancha oficial (18m x 9m)[1][2]
            const boundaries = {
                left: coords.court.x + ballHalfSize,
                right: coords.court.x + coords.court.width - ballHalfSize,
                top: coords.court.y + ballHalfSize,
                bottom: coords.court.y + coords.court.height - ballHalfSize
            };

            // Colisiones laterales (fuera de bounds)
            if (ball.x < boundaries.left || ball.x > boundaries.right) {
                ball.x = ball.x < boundaries.left ? boundaries.left : boundaries.right;
                ball.vx = -ball.vx * VOLLEYBALL_PHYSICS.RESTITUTION_FLOOR;
                ball.isInPlay = false; // Fuera de la cancha

                if (this.volleyballGame.active) {
                    this.handleVolleyballOut(ball);
                }
            }

            // Colisión con el techo (rebote suave)
            if (ball.y < boundaries.top) {
                ball.y = boundaries.top;
                ball.vy = -ball.vy * 0.3; // Rebote muy suave en el techo
            }

            // Colisión con el piso (rebote alto característico de volleyball)
            if (ball.y > boundaries.bottom) {
                ball.y = boundaries.bottom;
                ball.vy = -ball.vy * ball.restitution;
                ball.vx *= ball.friction;

                ball.bounceCount++;

                // Determinar lado de la cancha
                ball.sideOfCourt = ball.x < coords.net.x ? 'left' : 'right';

                if (this.volleyballGame.active) {
                    this.checkVolleyballBounce(ball);
                }
            }
        }

        handleVolleyballNetCollision(ball) {
            const coords = calculateVolleyballCoordinates();
            const netX = coords.net.x;
            const netTop = coords.net.y1;
            const netBottom = coords.net.y2;
            const netHeight = this.volleyballGame.netHeight;

            // Verificar colisión con la red (área vertical)[3]
            if (Math.abs(ball.x - netX) < ball.radius + coords.net.width/2 &&
                ball.y > netTop && ball.y < netBottom &&
                ball.y > netBottom - netHeight) {

                // La pelota golpea la red
                ball.vx = -ball.vx * VOLLEYBALL_PHYSICS.RESTITUTION_NET;
                ball.vy *= 0.3; // Pierde mucha velocidad vertical

                // Posicionar fuera de la red
                if (ball.x < netX) {
                    ball.x = netX - ball.radius - coords.net.width/2;
                } else {
                    ball.x = netX + ball.radius + coords.net.width/2;
                }

                this.showVolleyballFeedback('🕸️ NET VIOLATION!', '#ff4757');

                if (this.volleyballGame.active) {
                    this.handleNetViolation(ball);
                }
            }
        }

        handleVolleyballCollisions() {
            const ballsArray = Array.from(this.physicsObjects.values()).filter(obj => obj.type === 'volleyball');

            for (let i = 0; i < ballsArray.length; i++) {
                const ballA = ballsArray[i];
                for (let j = i + 1; j < ballsArray.length; j++) {
                    const ballB = ballsArray[j];

                    const dx = ballB.x - ballA.x;
                    const dy = ballB.y - ballA.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const minDistance = ballA.radius + ballB.radius;

                    if (distance < minDistance && distance !== 0) {
                        // Separar pelotas
                        const normalX = dx / distance;
                        const normalY = dy / distance;
                        const overlap = minDistance - distance;

                        ballA.x -= normalX * overlap * 0.5;
                        ballA.y -= normalY * overlap * 0.5;
                        ballB.x += normalX * overlap * 0.5;
                        ballB.y += normalY * overlap * 0.5;

                        // Rebote elástico suave (característico de volleyball)
                        const tempVx = ballA.vx;
                        const tempVy = ballA.vy;
                        ballA.vx = ballB.vx * 0.95;
                        ballA.vy = ballB.vy * 0.95;
                        ballB.vx = tempVx * 0.95;
                        ballB.vy = tempVy * 0.95;
                    }
                }
            }
        }

        /* ---------- SISTEMA DE TOQUES DE VOLLEYBALL ---------- */
        handleVolleyballPlayerActions() {
            const players = this.getVolleyballPlayerPositions();
            if (players.length === 0) return;

            this.physicsObjects.forEach(ball => {
                if (ball.type !== 'volleyball') return;

                players.forEach(player => {
                    const dx = ball.x - player.x;
                    const dy = ball.y - player.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const reachDistance = 50; // Alcance para tocar el volleyball

                    if (distance < reachDistance && distance > 0) {
                        const currentTime = performance.now();

                        if (currentTime - ball.lastTouchTime > this.touchSystem.touchCooldown) {
                            this.executeVolleyballTouch(ball, player, dx, dy, distance);
                            ball.lastTouchTime = currentTime;
                        }
                    }
                });
            });
        }

        executeVolleyballTouch(ball, player, dx, dy, distance) {
            const coords = calculateVolleyballCoordinates();

            // Determinar equipo basado en posición del jugador
            const playerTeam = player.x < coords.net.x ? 'left' : 'right';
            const teamKey = playerTeam === 'left' ? 'a' : 'b';

            // Verificar límite de toques por equipo[4][5]
            if (ball.lastTouchTeam !== teamKey) {
                // Nuevo equipo toca la pelota - resetear contador
                this.touchSystem.teamTouches.a = 0;
                this.touchSystem.teamTouches.b = 0;
                this.touchSystem.teamTouches[teamKey] = 1;
                ball.lastTouchTeam = teamKey;
            } else {
                // Mismo equipo - incrementar contador
                this.touchSystem.teamTouches[teamKey]++;

                if (this.touchSystem.teamTouches[teamKey] > this.touchSystem.maxTouches) {
                    this.handleTouchViolation(ball, teamKey);
                    return;
                }
            }

            // Ejecutar el toque
            const normalX = dx / distance;
            const normalY = dy / distance;

            // Tipo de toque basado en posición
            const touchType = this.determineVolleyballTouchType(ball, player, coords);
            const force = this.getVolleyballTouchForce(touchType);

            // Aplicar fuerza del toque
            ball.vx += normalX * force * VOLLEYBALL_PHYSICS.TIMESTEP * 2;
            ball.vy += normalY * force * VOLLEYBALL_PHYSICS.TIMESTEP * 2;

            // Aplicar velocidad del jugador
            if (player.vx || player.vy) {
                ball.vx += (player.vx || 0) * 0.6;
                ball.vy += (player.vy || 0) * 0.6;
            }

            // Mostrar feedback del toque
            this.showVolleyballTouchFeedback(touchType, teamKey, this.touchSystem.teamTouches[teamKey]);

            // Actualizar UI de toques
            this.updateTouchDisplay();
        }

        determineVolleyballTouchType(ball, player, coords) {
            const playerHeight = player.y;
            const ballHeight = ball.y;
            const netY = coords.net.y1;

            // Determinar tipo de acción basado en posición
            if (ballHeight < netY + 30 && playerHeight < netY + 40) {
                return 'spike'; // Remate
            } else if (ballHeight > netY + 60) {
                return 'dig'; // Defensa baja
            } else if (Math.abs(ball.vy) < 50) {
                return 'set'; // Colocación
            } else {
                return 'pass'; // Pase normal
            }
        }

        getVolleyballTouchForce(touchType) {
            switch (touchType) {
                case 'spike': return VOLLEYBALL_PHYSICS.SPIKE_FORCE;
                case 'set': return VOLLEYBALL_PHYSICS.SET_FORCE;
                case 'dig': return VOLLEYBALL_PHYSICS.PLAYER_INTERACTION_FORCE * 0.6;
                case 'pass':
                default: return VOLLEYBALL_PHYSICS.PLAYER_INTERACTION_FORCE;
            }
        }

        showVolleyballTouchFeedback(touchType, team, touchCount) {
            const actionNames = {
                'spike': '💥 SPIKE',
                'set': '🙌 SET',
                'dig': '🤲 DIG',
                'pass': '🏐 PASS'
            };

            const teamName = team.toUpperCase();
            const actionName = actionNames[touchType] || '🏐 TOUCH';

            this.showVolleyballFeedback(`${actionName} - Team ${teamName} (${touchCount}/3)`, '#FFD700');

            // Actualizar estadísticas
            if (touchType === 'spike') {
                this.gameStats.totalSpikes++;
            }
        }

        handleTouchViolation(ball, team) {
            ball.isInPlay = false;

            // El equipo contrario obtiene el punto
            const oppositeTeam = team === 'a' ? 'b' : 'a';
            this.volleyballGame.points[oppositeTeam]++;

            this.showVolleyballFeedback(`❌ 4-TOUCH VIOLATION! Point to Team ${oppositeTeam.toUpperCase()}`, '#ff4757');

            this.updateVolleyballScore();
            this.resetTouchCounts();

            setTimeout(() => {
                this.clearAllVolleyballs(false);
                if (this.volleyballGame.active) {
                    this.serveVolleyball();
                }
            }, 2000);
        }

        updateTouchDisplay() {
            document.getElementById('touches-a').textContent = this.touchSystem.teamTouches.a || 0;
            document.getElementById('touches-b').textContent = this.touchSystem.teamTouches.b || 0;
        }

        resetTouchCounts() {
            this.touchSystem.teamTouches = { a: 0, b: 0 };
            this.updateTouchDisplay();
        }

        getVolleyballPlayerPositions() {
            const players = [];
            if (!drawariaCanvas) return players;

            const canvasRect = drawariaCanvas.getBoundingClientRect();

            // Self player
            const selfPlayer = document.querySelector('div.spawnedavatar.spawnedavatar-self');
            if (selfPlayer) {
                const rect = selfPlayer.getBoundingClientRect();
                players.push({
                    type: 'self',
                    id: 'self',
                    x: rect.left - canvasRect.left + rect.width / 2,
                    y: rect.top - canvasRect.top + rect.height / 2,
                    radius: Math.max(rect.width, rect.height) / 2,
                    vx: 0, vy: 0
                });
            }

            // Other players
            const otherPlayers = document.querySelectorAll('div.spawnedavatar.spawnedavatar-otherplayer');
            otherPlayers.forEach((player, index) => {
                const rect = player.getBoundingClientRect();
                players.push({
                    type: 'other',
                    id: `other_${index}`,
                    x: rect.left - canvasRect.left + rect.width / 2,
                    y: rect.top - canvasRect.top + rect.height / 2,
                    radius: Math.max(rect.width, rect.height) / 2,
                    vx: 0, vy: 0
                });
            });

            return players;
        }

        /* ---------- VOLLEYBALL SCORING SYSTEM ---------- */
        checkVolleyballScoring() {
            if (!this.volleyballGame.active) return;

            this.physicsObjects.forEach(ball => {
                if (ball.type !== 'volleyball' || !ball.isInPlay) return;

                // Verificar si la pelota tocó el piso dentro de la cancha
                if (ball.bounceCount > 0 && ball.sideOfCourt) {
                    this.scoreVolleyballPoint(ball);
                }
            });
        }

        checkVolleyballBounce(ball) {
            const coords = calculateVolleyballCoordinates();

            // Verificar en qué lado de la cancha rebotó
            if (ball.x >= coords.court.x && ball.x <= coords.court.x + coords.court.width) {
                // Rebotó dentro de la cancha - punto para el equipo contrario
                const scoringTeam = ball.sideOfCourt === 'left' ? 'b' : 'a';
                this.volleyballGame.points[scoringTeam]++;

                this.showVolleyballFeedback(`🏐 POINT! Team ${scoringTeam.toUpperCase()} scores!`, '#32CD32');
                this.updateVolleyballScore();
                this.endCurrentRally();
            }
        }

        handleVolleyballOut(ball) {
            // Pelota salió fuera - punto para el equipo que NO tocó último
            const scoringTeam = ball.lastTouchTeam === 'a' ? 'b' : 'a';
            this.volleyballGame.points[scoringTeam]++;

            this.showVolleyballFeedback(`📍 OUT! Point to Team ${scoringTeam.toUpperCase()}`, '#FFA500');
            this.updateVolleyballScore();
            this.endCurrentRally();
        }

        handleNetViolation(ball) {
            // Violación de red - punto para el equipo contrario
            const scoringTeam = ball.lastTouchTeam === 'a' ? 'b' : 'a';
            this.volleyballGame.points[scoringTeam]++;

            this.showVolleyballFeedback(`🕸️ NET VIOLATION! Point to Team ${scoringTeam.toUpperCase()}`, '#ff4757');
            this.updateVolleyballScore();
            this.endCurrentRally();
        }

        async scoreVolleyballPoint(ball) {
            ball.isInPlay = false;
            this.endCurrentRally();
        }

        endCurrentRally() {
            this.gameStats.ralliesPlayed++;
            this.resetTouchCounts();

            setTimeout(() => {
                this.clearAllVolleyballs(false);
                if (this.volleyballGame.active) {
                    this.checkSetWon();
                    this.serveVolleyball();
                }
            }, 2000);
        }

        /* ---------- VOLLEYBALL MATCH MODE ---------- */
        toggleVolleyballMatch() {
            const button = document.getElementById('volleyball-match-toggle');
            const scoreboard = document.getElementById('volleyball-scoreboard');

            this.volleyballGame.active = !this.volleyballGame.active;

            if (this.volleyballGame.active) {
                button.style.background = 'linear-gradient(135deg, #FFD700, #FFA500)';
                button.setAttribute('data-active', 'true');
                scoreboard.style.display = 'block';
                this.setupVolleyballMatch();
                this.showVolleyballFeedback('🏆 FIVB MATCH MODE ACTIVATED!', '#FFD700');
            } else {
                button.style.background = 'linear-gradient(135deg, #444, #666)';
                button.removeAttribute('data-active');
                scoreboard.style.display = 'none';
                this.resetVolleyballMatch();
                this.showVolleyballFeedback('🏆 Match Mode Deactivated', '#666');
            }
        }

        async setupVolleyballMatch() {
            await drawCompleteVolleyballCourt();
            this.resetVolleyballGameScores();
            await this.updateVolleyballScore();

            setTimeout(() => {
                this.serveVolleyball();
            }, 2000);
        }

        resetVolleyballGameScores() {
            this.volleyballGame = {
                active: true,
                sets: { a: 0, b: 0 },
                points: { a: 0, b: 0 },
                serving: 'a',
                netHeight: this.controls.netHeight === 'male' ?
                    VOLLEYBALL_PHYSICS.NET_HEIGHT_MALE :
                    VOLLEYBALL_PHYSICS.NET_HEIGHT_FEMALE,
                currentSet: 1
            };
            this.resetTouchCounts();
        }

        async updateVolleyballScore() {
            document.getElementById('volleyball-score-a').textContent = this.volleyballGame.points.a;
            document.getElementById('volleyball-score-b').textContent = this.volleyballGame.points.b;
            document.getElementById('volleyball-sets-a').textContent = this.volleyballGame.sets.a;
            document.getElementById('volleyball-sets-b').textContent = this.volleyballGame.sets.b;
            document.getElementById('current-set').textContent = this.volleyballGame.currentSet;
            document.getElementById('serving-team').textContent = this.volleyballGame.serving.toUpperCase();
            document.getElementById('rally-count').textContent = this.gameStats.ralliesPlayed;
        }

        checkSetWon() {
            const pointsA = this.volleyballGame.points.a;
            const pointsB = this.volleyballGame.points.b;

            // Verificar si alguien ganó el set (25 puntos + 2 de diferencia)[4][5]
            if ((pointsA >= VOLLEYBALL_GAME.POINTS_TO_WIN && pointsA - pointsB >= VOLLEYBALL_GAME.MIN_POINT_DIFFERENCE) ||
                (pointsB >= VOLLEYBALL_GAME.POINTS_TO_WIN && pointsB - pointsA >= VOLLEYBALL_GAME.MIN_POINT_DIFFERENCE)) {

                // Determinar ganador del set
                const setWinner = pointsA > pointsB ? 'a' : 'b';
                this.volleyballGame.sets[setWinner]++;

                this.showVolleyballFeedback(`🏐 SET ${this.volleyballGame.currentSet} WON BY TEAM ${setWinner.toUpperCase()}!`, '#FFD700');

                // Verificar si alguien ganó el match (mejor de 5 sets)
                if (this.volleyballGame.sets[setWinner] >= VOLLEYBALL_GAME.SETS_TO_WIN) {
                    this.endVolleyballMatch(setWinner);
                } else {
                    this.startNewSet();
                }
            }
        }

        startNewSet() {
            this.volleyballGame.currentSet++;
            this.volleyballGame.points = { a: 0, b: 0 };

            // Alternar saque
            this.volleyballGame.serving = this.volleyballGame.serving === 'a' ? 'b' : 'a';

            this.showVolleyballFeedback(`🏐 SET ${this.volleyballGame.currentSet} BEGINS!`, '#87CEEB');
            this.updateVolleyballScore();
        }

        async endVolleyballMatch(winner) {
            const finalSets = `${this.volleyballGame.sets.a}-${this.volleyballGame.sets.b}`;
            this.showVolleyballFeedback(`🏆 TEAM ${winner.toUpperCase()} WINS THE MATCH ${finalSets}!`, '#FFD700');

            setTimeout(() => {
                this.resetVolleyballMatch();
            }, 5000);
        }

        resetVolleyballMatch() {
            this.resetVolleyballGameScores();
            if (this.volleyballGame.active) {
                this.clearAllVolleyballs(false);
                setTimeout(() => {
                    drawCompleteVolleyballCourt().then(() => {
                        this.serveVolleyball();
                    });
                }, 500);
            }
        }

        /* ---------- RENDERING ---------- */
        renderVolleyballs() {
            this.physicsObjects.forEach(obj => {
                if (obj.type !== 'volleyball') return;

                const dx = Math.abs(obj.x - obj.lastRenderX);
                const dy = Math.abs(obj.y - obj.lastRenderY);

                const needsServerRedraw = dx > MOVEMENT_THRESHOLD || dy > MOVEMENT_THRESHOLD;

                if (needsServerRedraw) {
                    // Borrar posición anterior
                    if (obj.lastRenderX !== -9999 || obj.lastRenderY !== -9999) {
                        this.drawVolleyball(obj.lastRenderX, obj.lastRenderY, obj.radius, '#FFFFFF');
                    }

                    // Dibujar en nueva posición
                    this.drawVolleyball(obj.x, obj.y, obj.radius, obj.color);

                    obj.lastRenderX = obj.x;
                    obj.lastRenderY = obj.y;
                }
            });
        }

        drawVolleyball(x, y, radius, color) {
            const effectiveThickness = radius * 2.3; // Tamaño medio de volleyball
            enqueueDrawCommand(x, y, x + 0.1, y + 0.1, color, effectiveThickness);
        }

        /* ---------- UTILITY FUNCTIONS ---------- */
        clearAllVolleyballs(showFeedback = true) {
            this.physicsObjects.clear();
            positionCache.clear();
            this.resetTouchCounts();

            if (drawariaCtx && drawariaCanvas) {
                drawariaCtx.clearRect(0, 0, drawariaCanvas.width, drawariaCanvas.height);
            }
            if (showFeedback) {
                this.showVolleyballFeedback('🗑️ ALL VOLLEYBALLS CLEARED!', '#cc0000');
            }
        }

        resetAllVolleyballs() {
            if (this.canvasElement) {
                const coords = calculateVolleyballCoordinates();

                this.physicsObjects.forEach(obj => {
                    obj.x = coords.net.x + (Math.random() - 0.5) * 100;
                    obj.y = coords.court.y + coords.court.height * 0.5;
                    obj.vx = 0; obj.vy = 0;
                    obj.lastRenderX = -9999; obj.lastRenderY = -9999;
                    obj.bounceCount = 0;
                    obj.isInPlay = true;
                    obj.sideOfCourt = null;
                    obj.lastTouchTeam = null;
                });

                this.resetTouchCounts();
                this.showVolleyballFeedback('🔄 All volleyballs reset to center court!', '#74b9ff');
            }
        }

        async cleanVolleyballCourt() {
            if (!drawariaCanvas) return;

            this.showVolleyballFeedback('🧹 Cleaning FIVB Court...', '#e17055');

            const canvasWidth = drawariaCanvas.width;
            const canvasHeight = drawariaCanvas.height;

            for (let y = 0; y < canvasHeight; y += 60) {
                for (let x = 0; x < canvasWidth; x += 60) {
                    const width = Math.min(60, canvasWidth - x);
                    const height = Math.min(60, canvasHeight - y);
                    enqueueDrawCommand(x, y, x + width, y + height, '#FFFFFF', Math.max(width, height));
                    await sleep(2);
                }
            }

            if (drawariaCtx) {
                drawariaCtx.clearRect(0, 0, canvasWidth, canvasHeight);
            }

            this.showVolleyballFeedback('🧹 FIVB Court Cleaned!', '#00d084');
        }

        /* ---------- PANEL FUNCTIONALITY ---------- */
        makeVolleyballPanelDraggable() {
            const panel = document.getElementById('volleyball-physics-panel');
            const header = document.getElementById('volleyball-panel-header');

            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

            if (header) {
                header.onmousedown = dragMouseDown;
            }

            function dragMouseDown(e) {
                e = e || window.event;
                e.preventDefault();
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;
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

                panel.style.top = Math.max(0, newTop) + "px";
                panel.style.left = Math.max(0, newLeft) + "px";
                panel.style.right = 'auto';
            }

            function closeDragElement() {
                document.onmouseup = null;
                document.onmousemove = null;
            }
        }

        setupVolleyballPanelButtons() {
            const minimizeBtn = document.getElementById('volleyball-minimize-btn');
            const closeBtn = document.getElementById('volleyball-close-btn');
            const content = document.getElementById('volleyball-panel-content');
            const panel = document.getElementById('volleyball-physics-panel');

            let isMinimized = false;

            minimizeBtn?.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!isMinimized) {
                    content.style.display = 'none';
                    minimizeBtn.innerHTML = '+';
                    isMinimized = true;
                } else {
                    content.style.display = 'block';
                    minimizeBtn.innerHTML = '−';
                    isMinimized = false;
                }
            });

            closeBtn?.addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm('¿Cerrar el motor de volleyball?')) {
                    if (this.isActive) this.stopVolleyballPhysics();
                    isStopped = true;
                    panel.remove();
                    this.showVolleyballFeedback('❌ Volleyball Engine Closed', '#ff4757');
                }
            });
        }

        startVolleyballStatsMonitoring() {
            setInterval(() => {
                document.getElementById('volleyball-count').textContent = this.physicsObjects.size;
                document.getElementById('spikes-count').textContent = this.gameStats.totalSpikes;
                document.getElementById('blocks-count').textContent = this.gameStats.totalBlocks;
                document.getElementById('volleyball-aces-count').textContent = this.gameStats.aces;
                document.getElementById('volleyball-max-speed').textContent = Math.round(this.gameStats.maxVelocityReached * 3.6); // Convert to km/h
            }, 1000);
        }

        showVolleyballFeedback(message, color) {
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
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                opacity: 0;
                transition: opacity 0.3s ease-in-out;
                text-shadow: 1px 1px 3px rgba(0,0,0,0.5);
                border: 2px solid #FFD700;
            `;
            feedback.innerHTML = message;

            document.body.appendChild(feedback);
            setTimeout(() => feedback.style.opacity = '1', 10);
            setTimeout(() => feedback.style.opacity = '0', 2500);
            setTimeout(() => feedback.remove(), 2800);
        }
    }

    /* ---------- GLOBAL INITIALIZATION ---------- */
    let volleyballEngine = null;

    const initVolleyballEngine = () => {
        if (!volleyballEngine) {
            console.log('🏐 Initializing FIVB Volleyball Physics Engine v1.0...');
            volleyballEngine = new AdvancedDrawariaVolleyball();

            setTimeout(() => {
                const confirmMsg = document.createElement('div');
                confirmMsg.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: linear-gradient(45deg, #FF8C69, #FFE4B5);
                    color: white;
                    padding: 25px 35px;
                    border-radius: 20px;
                    font-size: 16px;
                    font-weight: bold;
                    z-index: 2147483648;
                    text-align: center;
                    box-shadow: 0 0 40px rgba(255,140,105,0.6);
                    opacity: 0;
                    transition: opacity 0.3s ease-in-out;
                    border: 3px solid #FFD700;
                `;
                confirmMsg.innerHTML = `
                    🏐 FIVB VOLLEYBALL ENGINE v1.0 LOADED! 🏐<br>
                    <div style="font-size: 12px; margin-top: 10px; color: #FFF8DC;">
                        ✅ Professional FIVB Court • Volleyball Physics • 3-Touch System<br>
                        ✅ Net Collision Detection • Match Mode • Spike/Set/Dig Mechanics<br>
                        ✅ Official Scoring • Rally System • Realistic Ball Physics
                    </div>
                `;

                document.body.appendChild(confirmMsg);
                setTimeout(() => confirmMsg.style.opacity = '1', 10);
                setTimeout(() => confirmMsg.style.opacity = '0', 4000);
                setTimeout(() => confirmMsg.remove(), 4300);
            }, 1000);
        }
    };

    // Enhanced CSS for Volleyball styling
    const volleyballStyle = document.createElement('style');
    volleyballStyle.textContent = `
        @keyframes volleyball-float {
            0% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-8px) scale(1.05); }
            100% { transform: translateY(0) scale(1); }
        }

        @keyframes court-glow {
            0% { box-shadow: 0 0 15px rgba(255, 140, 105, 0.3); }
            50% { box-shadow: 0 0 25px rgba(255, 228, 181, 0.6); }
            100% { box-shadow: 0 0 15px rgba(255, 140, 105, 0.3); }
        }

        .volleyball-mode-toggle[data-active="true"] {
            animation: court-glow 2s infinite;
        }

        #volleyball-physics-panel {
            transition: none !important;
        }

        #volleyball-panel-header:hover {
            background: linear-gradient(45deg, #FF8C69, #FFE4B5) !important;
        }

        /* Volleyball specific styling */
        .fivb-court {
            background: linear-gradient(45deg, #FF8C69, #FFE4B5);
        }

        .volleyball-floating {
            animation: volleyball-float 1.5s infinite ease-in-out;
        }

        /* Spike animation */
        @keyframes volleyball-spike {
            0% { transform: translateY(-10px) scale(1.2); }
            100% { transform: translateY(0) scale(1); }
        }

        .volleyball-spike-effect {
            animation: volleyball-spike 0.3s ease-out;
        }

        /* Net collision effect */
        @keyframes net-collision {
            0% { opacity: 1; }
            50% { opacity: 0.5; transform: scale(1.1); }
            100% { opacity: 1; transform: scale(1); }
        }

        .volleyball-net-hit {
            animation: net-collision 0.4s ease-out;
        }

        /* Status div volleyball styling */
        #volleyball-status {
            font-family: 'Arial Black', Arial, sans-serif !important;
            animation: court-glow 3s infinite;
        }

        /* Volleyball color scheme */
        .volleyball-orange { color: #FF8C69; }
        .volleyball-yellow { color: #FFFFE0; }
        .volleyball-white { color: #FFFFFF; }
        .volleyball-beige { color: #FFE4B5; }
        .volleyball-brown { color: #8B4513; }

        /* Touch counter styling */
        .touch-warning {
            color: #ff4757 !important;
            font-weight: bold !important;
        }

        .touch-normal {
            color: #32CD32 !important;
        }

        /* Rally counter animation */
        @keyframes rally-pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }

        .rally-active {
            animation: rally-pulse 1s infinite;
        }
    `;
    document.head.appendChild(volleyballStyle);

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initVolleyballEngine);
    } else {
        initVolleyballEngine();
    }
    setTimeout(initVolleyballEngine, 2000);

    console.log('🏐 Advanced FIVB Volleyball Physics Engine v1.0 loaded successfully! 🏐');
    console.log('🏟️ Features: Professional FIVB Court • 3-Touch System • Net Physics • Rally Scoring');
    console.log('🏆 Ready for FIVB-style volleyball matches in Drawaria!');

})();
