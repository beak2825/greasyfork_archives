// ==UserScript==
// @name         Drawaria Physics Engine Tennis🥎
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Advanced tennis physics with professional Wimbledon court and spin system!
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        none
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/547930/Drawaria%20Physics%20Engine%20Tennis%F0%9F%A5%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/547930/Drawaria%20Physics%20Engine%20Tennis%F0%9F%A5%8E.meta.js
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
    const BATCH_SIZE = 15;
    const BATCH_INTERVAL = 40;

    const positionCache = new Map();
    const MOVEMENT_THRESHOLD = 2;

    // ✅ COLORES OFICIALES DE TENIS
    const TENNIS_COURT_COLORS = {
        courtColor: '#228B22',      // Verde césped Wimbledon
        lineColor: '#FFFFFF',       // Líneas blancas oficiales
        netColor: '#000000',        // Red negra
        postColor: '#8B4513',       // Postes marrones
        textColor: '#FFFFFF',       // Texto blanco
        clayColor: '#CD853F',       // Arcilla (superficie alternativa)
        hardColor: '#4169E1'        // Cemento azul (superficie alternativa)
    };

    // Tennis physics constants[1][2]
    const TENNIS_PHYSICS = {
        GRAVITY: 300,               // Menor que baloncesto
        BALL_MASS: 0.1,            // Pelota más liviana
        BALL_RADIUS: 15,           // Pelota más pequeña
        TIMESTEP: 1/60,
        MAX_VELOCITY: 800,         // Más rápida que baloncesto
        AIR_RESISTANCE: 0.003,     // Menos resistencia
        RESTITUTION_BALL: 0.75,    // Rebote medio de tenis
        RESTITUTION_NET: 0.1,      // Rebote muy bajo en la red
        RESTITUTION_WALL: 0.6,
        FRICTION_COURT: 0.85,      // Alta fricción en césped
        PLAYER_INTERACTION_FORCE: 300,
        PLAYER_PUSH_MULTIPLIER: 2.2,
        PLAYER_RESTITUTION: 0.95,
        PLAYER_DETECTION_RADIUS_MULTIPLIER: 2.5,

        // Tennis specific
        SERVE_FORCE: 400,
        SPIN_FACTOR: 0.8,
        BALL_COLOR: '#9ACD32',     // Verde lima tenis
        NET_HEIGHT: 40,
        COURT_SURFACE: 'grass'     // grass, clay, hard
    };

    const TENNIS_MATCH = {
        SETS_TO_WIN: 2,
        GAMES_TO_WIN: 6,
        POINTS: [0, 15, 30, 40, 'DEUCE', 'ADV'],
        SERVE_AREAS: {
            left: { x1: 0, y1: 0, x2: 0.5, y2: 0.5 },
            right: { x1: 0.5, y1: 0, x2: 1, y2: 0.5 }
        }
    };

    let isDrawing = false;
    let isStopped = false;

    // WebSocket interception[3]
    const originalWebSocketSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (...args) {
        if (!drawariaSocket && this.url && this.url.includes('drawaria')) {
            drawariaSocket = this;
            console.log('🔗 Drawaria WebSocket captured for tennis engine.');
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

    // ✅ SISTEMA DE COORDENADAS DE TENIS PROFESIONAL
    function getCanvasSize() {
        return {
            width: drawariaCanvas.width,
            height: drawariaCanvas.height
        };
    }

    function calculateTennisCoordinates() {
        const size = getCanvasSize();

        const coords = {
            // Dimensiones oficiales de cancha de tenis (proporción 2:1)
            court: {
                x: Math.floor(size.width * 0.1),
                y: Math.floor(size.height * 0.1),
                width: Math.floor(size.width * 0.8),
                height: Math.floor(size.height * 0.8)
            },

            // Red central
            net: {
                x: Math.floor(size.width * 0.5),
                y1: Math.floor(size.height * 0.1),
                y2: Math.floor(size.height * 0.9),
                height: TENNIS_PHYSICS.NET_HEIGHT,
                postHeight: 50
            },

            // Líneas de servicio
            serviceLines: {
                leftService: Math.floor(size.width * 0.35),
                rightService: Math.floor(size.width * 0.65),
                topService: Math.floor(size.height * 0.3),
                bottomService: Math.floor(size.height * 0.7)
            },

            // Líneas laterales (singles y doubles)
            sideLines: {
                leftSingles: Math.floor(size.width * 0.15),
                rightSingles: Math.floor(size.width * 0.85),
                leftDoubles: Math.floor(size.width * 0.1),
                rightDoubles: Math.floor(size.width * 0.9)
            },

            // Líneas de fondo
            baseLines: {
                top: Math.floor(size.height * 0.1),
                bottom: Math.floor(size.height * 0.9)
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

    async function drawLineLocalAndServer(startX, startY, endX, endY, color, thickness, delay = 50) {
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
        await sleep(15);
    }

    // ✅ FUNCIONES DE DIBUJO DE CANCHA DE TENIS
    async function drawTennisCourtSurface() {
        if (isStopped) return;

        updateStatus(document.getElementById('tennis-status'), "🎾 Dibujando superficie de césped Wimbledon...", TENNIS_COURT_COLORS.courtColor);

        const canvasSize = getCanvasSize();
        const coords = calculateTennisCoordinates();

        // Superficie principal de césped
        for (let y = coords.court.y; y < coords.court.y + coords.court.height; y += 8) {
            await drawLineLocalAndServer(coords.court.x, y, coords.court.x + coords.court.width, y, TENNIS_COURT_COLORS.courtColor, 2, 25);
            if (isStopped) break;
        }

        // Líneas de textura para simular césped
        for (let y = coords.court.y + 10; y < coords.court.y + coords.court.height - 10; y += 20) {
            for (let x = coords.court.x + 10; x < coords.court.x + coords.court.width - 10; x += 30) {
                await drawLineLocalAndServer(x, y, x + 15, y, '#32CD32', 1, 10);
                if (isStopped) break;
            }
            if (isStopped) break;
        }
    }

    async function drawTennisCourtLines(coords) {
        if (isStopped) return;

        updateStatus(document.getElementById('tennis-status'), "⚪ Dibujando líneas oficiales de tenis...", TENNIS_COURT_COLORS.lineColor);

        const lineThickness = Math.max(3, Math.floor(drawariaCanvas.width * 0.006));

        // Perímetro exterior (doubles)
        await drawRectangleOutline({
            x: coords.sideLines.leftDoubles,
            y: coords.baseLines.top,
            width: coords.sideLines.rightDoubles - coords.sideLines.leftDoubles,
            height: coords.baseLines.bottom - coords.baseLines.top
        }, TENNIS_COURT_COLORS.lineColor, lineThickness);

        // Líneas laterales singles
        await drawLineLocalAndServer(
            coords.sideLines.leftSingles, coords.baseLines.top,
            coords.sideLines.leftSingles, coords.baseLines.bottom,
            TENNIS_COURT_COLORS.lineColor, lineThickness, 60
        );

        await drawLineLocalAndServer(
            coords.sideLines.rightSingles, coords.baseLines.top,
            coords.sideLines.rightSingles, coords.baseLines.bottom,
            TENNIS_COURT_COLORS.lineColor, lineThickness, 60
        );

        // Líneas de servicio horizontales
        await drawLineLocalAndServer(
            coords.sideLines.leftSingles, coords.serviceLines.topService,
            coords.sideLines.rightSingles, coords.serviceLines.topService,
            TENNIS_COURT_COLORS.lineColor, lineThickness, 70
        );

        await drawLineLocalAndServer(
            coords.sideLines.leftSingles, coords.serviceLines.bottomService,
            coords.sideLines.rightSingles, coords.serviceLines.bottomService,
            TENNIS_COURT_COLORS.lineColor, lineThickness, 70
        );

        // Línea central de servicio
        await drawLineLocalAndServer(
            coords.net.x, coords.serviceLines.topService,
            coords.net.x, coords.serviceLines.bottomService,
            TENNIS_COURT_COLORS.lineColor, lineThickness, 80
        );
    }

    async function drawTennisNet(coords) {
        if (isStopped) return;

        updateStatus(document.getElementById('tennis-status'), "🕸️ Instalando red de tenis...", TENNIS_COURT_COLORS.netColor);

        // Postes de la red
        const postWidth = 8;
        const postHeight = coords.net.postHeight;

        // Poste izquierdo
        await drawRectangleOutline({
            x: coords.net.x - postWidth/2,
            y: coords.net.y1 - postHeight,
            width: postWidth,
            height: postHeight
        }, TENNIS_COURT_COLORS.postColor, 3);

        // Poste derecho
        await drawRectangleOutline({
            x: coords.net.x - postWidth/2,
            y: coords.net.y2,
            width: postWidth,
            height: postHeight
        }, TENNIS_COURT_COLORS.postColor, 3);

        // Red central (líneas verticales)
        const netDensity = 12;
        for (let i = 0; i < netDensity; i++) {
            const netY = coords.net.y1 + (i * (coords.net.y2 - coords.net.y1) / netDensity);
            await drawLineLocalAndServer(
                coords.net.x, netY,
                coords.net.x, netY + (coords.net.y2 - coords.net.y1) / netDensity,
                TENNIS_COURT_COLORS.netColor, 2, 30
            );
            if (isStopped) break;
        }

        // Líneas horizontales de la red
        const horizontalNetLines = 8;
        for (let i = 0; i < horizontalNetLines; i++) {
            const netX = coords.net.x - 2 + (i * 0.5);
            await drawLineLocalAndServer(
                netX, coords.net.y1,
                netX, coords.net.y2,
                TENNIS_COURT_COLORS.netColor, 1, 25
            );
            if (isStopped) break;
        }
    }

    // ✅ FUNCIONES GEOMÉTRICAS
    async function drawRectangleOutline(rectCoords, color, thickness) {
        await drawLineLocalAndServer(rectCoords.x, rectCoords.y,
            rectCoords.x + rectCoords.width, rectCoords.y, color, thickness, 40);
        await drawLineLocalAndServer(rectCoords.x + rectCoords.width, rectCoords.y,
            rectCoords.x + rectCoords.width, rectCoords.y + rectCoords.height, color, thickness, 40);
        await drawLineLocalAndServer(rectCoords.x + rectCoords.width, rectCoords.y + rectCoords.height,
            rectCoords.x, rectCoords.y + rectCoords.height, color, thickness, 40);
        await drawLineLocalAndServer(rectCoords.x, rectCoords.y + rectCoords.height,
            rectCoords.x, rectCoords.y, color, thickness, 40);
    }

    // ✅ TEXTO TENNIS EN PIXEL ART
    const TENNIS_LETTERS = {
        'T': [[1,1,1,1,1],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0]],
        'E': [[1,1,1,1],[1,0,0,0],[1,1,1,0],[1,0,0,0],[1,1,1,1]],
        'N': [[1,0,0,1],[1,1,0,1],[1,0,1,1],[1,0,0,1],[1,0,0,1]],
        'I': [[1,1,1],[0,1,0],[0,1,0],[0,1,0],[1,1,1]],
        'S': [[1,1,1,1],[1,0,0,0],[1,1,1,1],[0,0,0,1],[1,1,1,1]]
    };

    async function drawTennisPixelText(text, coords) {
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

            const pattern = TENNIS_LETTERS[letter];
            if (!pattern) continue;

            for (let row = 0; row < pattern.length; row++) {
                for (let col = 0; col < pattern[row].length; col++) {
                    if (pattern[row][col] === 1) {
                        const pixelX = currentX + (col * coords.text.pixelSize);
                        const pixelY = coords.text.y + (row * coords.text.pixelSize);

                        const canvasSize = getCanvasSize();
                        if (pixelX >= 0 && pixelX < canvasSize.width && pixelY >= 0 && pixelY < canvasSize.height) {
                            await drawPixel(pixelX, pixelY, TENNIS_COURT_COLORS.textColor, coords.text.pixelSize);
                        }
                    }
                }
            }

            currentX += letterSpacing;
            await sleep(100);
        }
    }

    // ✅ FUNCIÓN PRINCIPAL: CANCHA DE TENIS COMPLETA
    async function drawCompleteTennisCourt() {
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
        const statusDiv = document.getElementById('tennis-status') || createStatusDiv();

        try {
            const coords = calculateTennisCoordinates();
            const canvasSize = getCanvasSize();

            console.log(`🎾 Cancha de tenis Wimbledon iniciada:`);
            console.log(`📏 Canvas: ${canvasSize.width}x${canvasSize.height}`);

            updateStatus(statusDiv, `🎾 CANCHA DE TENIS WIMBLEDON: ${canvasSize.width}x${canvasSize.height}`, "#228B22");
            await sleep(800);

            // FASE 1: SUPERFICIE DE CÉSPED
            updateStatus(statusDiv, "🎾 FASE 1: Superficie de césped Wimbledon...", TENNIS_COURT_COLORS.courtColor);
            await drawTennisCourtSurface();
            await sleep(300);
            if (isStopped) return;

            // FASE 2: LÍNEAS OFICIALES
            updateStatus(statusDiv, "⚪ FASE 2: Líneas oficiales de tenis...", TENNIS_COURT_COLORS.lineColor);
            await drawTennisCourtLines(coords);
            await sleep(300);
            if (isStopped) return;

            // FASE 3: RED Y POSTES
            updateStatus(statusDiv, "🕸️ FASE 3: Instalando red de tenis...", TENNIS_COURT_COLORS.netColor);
            await drawTennisNet(coords);
            await sleep(300);
            if (isStopped) return;

            // FASE 4: TEXTO TENNIS
            updateStatus(statusDiv, "🎮 FASE 4: Texto blanco 'TENNIS'...", TENNIS_COURT_COLORS.textColor);
            await drawTennisPixelText("TENNIS", coords);

            // CANCHA COMPLETA
            updateStatus(statusDiv, "🏆 ¡CANCHA DE TENIS WIMBLEDON COMPLETA! 🎾🏆", "#006400");

            setTimeout(() => {
                if (statusDiv && statusDiv.parentNode) {
                    statusDiv.style.opacity = 0;
                    setTimeout(() => statusDiv.remove(), 500);
                }
            }, 4000);

        } catch (error) {
            console.error("Error en cancha de tenis:", error);
            updateStatus(statusDiv, `❌ Error: ${error.message}`, "#B22222");
        } finally {
            isDrawing = false;
        }
    }

    function createStatusDiv() {
        const statusDiv = document.createElement('div');
        statusDiv.id = 'tennis-status';
        statusDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #228B22 0%, #32CD32 100%);
            color: white;
            padding: 20px 45px;
            border-radius: 35px;
            font-weight: bold;
            z-index: 10000;
            transition: opacity 0.5s;
            text-align: center;
            min-width: 480px;
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

    /* ---------- ADVANCED TENNIS PHYSICS ENGINE ---------- */
    class AdvancedDrawariaTennis {
        constructor() {
            this.initialized = false;
            this.isActive = false;
            this.physicsObjects = new Map();
            this.objectIdCounter = 0;
            this.lastRenderTime = 0;
            this.renderInterval = 1000 / 30;

            // Sistema de raquetas virtuales[4][5]
            this.racketSystem = {
                playerRackets: new Map(),
                racketLength: 60,
                racketWidth: 8,
                hitCooldown: 300
            };

            // Tennis match scoring
            this.tennisMatch = {
                active: false,
                scores: { p1: { sets: 0, games: 0, points: 0 }, p2: { sets: 0, games: 0, points: 0 } },
                serving: 'p1',
                courtSurface: 'grass',
                lastServeTime: 0
            };

            this.gameStats = {
                totalHits: 0,
                maxVelocityReached: 0,
                ballsCreated: 0,
                totalAces: 0,
                netHits: 0
            };

            this.controls = {
                showDebug: false,
                defaultBallColor: TENNIS_PHYSICS.BALL_COLOR,
                courtSurface: 'grass'
            };

            this.playerTracker = {
                players: new Map(),
                detectionRadius: TENNIS_PHYSICS.BALL_RADIUS * TENNIS_PHYSICS.PLAYER_DETECTION_RADIUS_MULTIPLIER,
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
                    this.createTennisPanel();
                    console.log('✅ Advanced Tennis Physics Engine v1.0 initialized');
                } else {
                    setTimeout(checkGameReady, 100);
                }
            };
            checkGameReady();
        }

        createTennisPanel() {
            const existingPanel = document.getElementById('tennis-physics-panel');
            if (existingPanel) existingPanel.remove();

            const panel = document.createElement('div');
            panel.id = 'tennis-physics-panel';
            panel.style.cssText = `
                position: fixed !important;
                top: 20px !important;
                right: 20px !important;
                width: 380px !important;
                z-index: 2147483647 !important;
                background: linear-gradient(135deg, #0f2f0f, #1a4a1a) !important;
                border: 2px solid #32CD32 !important;
                border-radius: 15px !important;
                color: white !important;
                font-family: 'Segoe UI', Arial, sans-serif !important;
                overflow: hidden !important;
                box-shadow: 0 0 30px rgba(50,205,50,0.4) !important;
            `;

            const header = document.createElement('div');
            header.id = 'tennis-panel-header';
            header.style.cssText = `
                background: linear-gradient(45deg, #228B22, #32CD32) !important;
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
            title.innerHTML = '🎾 WIMBLEDON TENNIS ENGINE v1.0';
            title.style.flex = '1';

            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = `display: flex !important; gap: 8px !important;`;

            const minimizeBtn = document.createElement('button');
            minimizeBtn.id = 'tennis-minimize-btn';
            minimizeBtn.innerHTML = '−';
            minimizeBtn.style.cssText = `
                width: 25px !important; height: 25px !important;
                background: rgba(255,255,255,0.2) !important;
                border: none !important; border-radius: 4px !important;
                color: white !important; cursor: pointer !important;
                font-size: 16px !important; line-height: 1 !important; padding: 0 !important;
            `;

            const closeBtn = document.createElement('button');
            closeBtn.id = 'tennis-close-btn';
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

            const content = document.createElement('div');
            content.id = 'tennis-panel-content';
            content.style.cssText = `padding: 20px !important;`;
            content.innerHTML = `
                <!-- CREATE TENNIS COURT -->
                <div style="margin-bottom: 15px; text-align: center;">
                    <button id="create-tennis-court-btn" style="
                        width: 100%;
                        padding: 12px;
                        background: linear-gradient(135deg, #228B22, #32CD32);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: bold;
                        margin-bottom: 10px;
                        box-shadow: 0 4px 15px rgba(34,139,34,0.3);
                    ">🎾 Create Wimbledon Tennis Court</button>
                </div>

                <!-- LAUNCH TENNIS ENGINE -->
                <div style="margin-bottom: 15px; text-align: center;">
                    <button id="toggle-tennis-physics" style="
                        width: 100%;
                        padding: 12px;
                        background: linear-gradient(135deg, #32CD32, #9ACD32);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: bold;
                    ">🚀 Launch Tennis Engine</button>
                </div>

                <!-- TENNIS BALL CREATION -->
                <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                    <button id="add-tennis-ball-btn" style="
                        flex: 1;
                        padding: 8px;
                        background: linear-gradient(135deg, #9ACD32, #32CD32);
                        color: white;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 12px;
                        font-weight: bold;
                    ">🎾 Add Tennis Ball</button>
                    <button id="serve-ball-btn" style="
                        flex: 1;
                        padding: 8px;
                        background: linear-gradient(135deg, #FFD700, #FFA500);
                        color: white;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 12px;
                        font-weight: bold;
                    ">🏆 Serve</button>
                </div>

                <!-- COURT SURFACE SELECTION -->
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-size: 12px; color: #32CD32;">
                        🏟️ Court Surface:
                    </label>
                    <select id="court-surface" style="
                        width: 100%;
                        padding: 8px;
                        border: 1px solid #32CD32;
                        border-radius: 6px;
                        background: #1a4a1a;
                        color: white;
                        font-size: 12px;
                    ">
                        <option value="grass">🌱 Grass (Wimbledon)</option>
                        <option value="clay">🧱 Clay (Roland Garros)</option>
                        <option value="hard">🏢 Hard Court (US Open)</option>
                    </select>
                </div>

                <!-- ACTION BUTTONS -->
                <div style="display: flex; gap: 8px; margin-bottom: 15px;">
                    <button id="reset-tennis-btn" style="
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
                    <button id="stop-tennis-court-btn" style="
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

                <!-- TENNIS MODES -->
                <div style="margin-bottom: 15px;">
                    <h4 style="margin: 0 0 10px 0; font-size: 13px; color: #32CD32; text-align: center;">🌟 Tennis Modes</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                        <button id="match-mode-toggle" class="tennis-mode-toggle" style="
                            padding: 8px;
                            background: linear-gradient(135deg, #444, #666);
                            color: white;
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 10px;
                            font-weight: bold;
                        ">🏆 Match Mode</button>
                        <button id="clean-tennis-canvas-btn" style="
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
                    <button id="clear-tennis-balls-btn" style="
                        width: 100%;
                        padding: 10px;
                        background: linear-gradient(135deg, #990000, #cc0000);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: bold;
                    ">🗑️ Clear All Tennis Balls</button>
                </div>

                <!-- TENNIS SCOREBOARD -->
                <div id="tennis-scoreboard" style="
                    display: none;
                    background: rgba(0,0,0,0.4);
                    padding: 15px;
                    border-radius: 8px;
                    text-align: center;
                    margin-bottom: 15px;
                    border: 2px solid #FFD700;
                ">
                    <h4 style="margin: 0 0 10px 0; color: #FFD700; font-size: 14px;">🎾 WIMBLEDON SCORE</h4>
                    <div style="display: flex; justify-content: space-between; font-size: 14px; font-weight: bold;">
                        <div style="color: #ff6b6b;">
                            P1: <span id="tennis-score-p1-sets">0</span>-<span id="tennis-score-p1-games">0</span>
                            <br><span id="tennis-score-p1-points" style="font-size: 18px;">0</span>
                        </div>
                        <div style="color: #666; font-size: 12px;">vs</div>
                        <div style="color: #74b9ff;">
                            P2: <span id="tennis-score-p2-sets">0</span>-<span id="tennis-score-p2-games">0</span>
                            <br><span id="tennis-score-p2-points" style="font-size: 18px;">0</span>
                        </div>
                    </div>
                    <div style="margin-top: 10px; font-size: 11px; color: #FFD700;">
                        Serving: <span id="serving-player">P1</span>
                    </div>
                </div>

                <!-- TENNIS STATS -->
                <div id="tennis-stats" style="
                    background: rgba(0,0,0,0.3);
                    padding: 10px;
                    border-radius: 6px;
                    font-size: 10px;
                    text-align: center;
                    border: 1px solid rgba(50,205,50,0.3);
                ">
                    <div>Tennis Balls: <span id="tennis-ball-count">0</span> | Hits: <span id="hits-count">0</span></div>
                    <div>Aces: <span id="aces-count">0</span> | Net Hits: <span id="net-hits-count">0</span></div>
                    <div>Max Speed: <span id="tennis-max-speed">0</span> km/h</div>
                    <div>Surface: <span id="surface-info">Grass</span></div>
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
                    Professional Wimbledon Court • Tennis Physics<br>
                    <span style="color: #32CD32;">Spin effects • Net detection • Court surfaces</span>
                </div>
            `;

            panel.appendChild(header);
            panel.appendChild(content);
            document.body.appendChild(panel);

            this.makeTennisPanelDraggable();
            this.setupTennisPanelButtons();
            this.setupTennisEventListeners();
            this.startTennisStatsMonitoring();
        }

        setupTennisEventListeners() {
            // Tennis court controls
            document.getElementById('create-tennis-court-btn')?.addEventListener('click', () => drawCompleteTennisCourt());
            document.getElementById('toggle-tennis-physics')?.addEventListener('click', () => this.toggleTennisPhysics());
            document.getElementById('stop-tennis-court-btn')?.addEventListener('click', () => this.stopTennisCourtDrawing());

            // Tennis ball creation
            document.getElementById('add-tennis-ball-btn')?.addEventListener('click', () => this.addRandomTennisBall());
            document.getElementById('serve-ball-btn')?.addEventListener('click', () => this.serveTennisBall());

            // Actions
            document.getElementById('reset-tennis-btn')?.addEventListener('click', () => this.resetAllTennisBalls());
            document.getElementById('clear-tennis-balls-btn')?.addEventListener('click', () => this.clearAllTennisBalls());
            document.getElementById('match-mode-toggle')?.addEventListener('click', () => this.toggleTennisMatch());
            document.getElementById('clean-tennis-canvas-btn')?.addEventListener('click', () => this.cleanTennisCourt());

            // Court surface
            document.getElementById('court-surface')?.addEventListener('change', (e) => {
                this.controls.courtSurface = e.target.value;
                this.updateSurfacePhysics(e.target.value);
                this.showTennisFeedback(`🏟️ Court Surface: ${e.target.options[e.target.selectedIndex].text}`, '#32CD32');
            });

            // Canvas click for tennis ball
            if (this.canvasElement) {
                this.canvasElement.addEventListener('click', (e) => this.createTennisBall(e.clientX - this.canvasElement.getBoundingClientRect().left, e.clientY - this.canvasElement.getBoundingClientRect().top));
            }
        }

        stopTennisCourtDrawing() {
            isStopped = true;
            const statusDiv = document.getElementById('tennis-status');
            if (statusDiv) {
                updateStatus(statusDiv, "⛔ Dibujo de cancha detenido", "#B22222");
            }
            this.showTennisFeedback('⛔ Tennis court drawing stopped', '#B22222');
        }

        /* ---------- TENNIS PHYSICS ENGINE ---------- */
        toggleTennisPhysics() {
            const toggleBtn = document.getElementById('toggle-tennis-physics');
            if (!this.isActive) {
                this.startTennisPhysics();
                if (toggleBtn) {
                    toggleBtn.textContent = '🛑 Stop Tennis Engine';
                    toggleBtn.style.background = 'linear-gradient(135deg, #f56565, #e53e3e)';
                }
            } else {
                this.stopTennisPhysics();
                if (toggleBtn) {
                    toggleBtn.textContent = '🚀 Launch Tennis Engine';
                    toggleBtn.style.background = 'linear-gradient(135deg, #32CD32, #9ACD32)';
                }
            }
        }

        startTennisPhysics() {
            if (this.isActive) return;
            this.isActive = true;
            this.startTennisGameLoop();
            this.showTennisFeedback('🚀 Wimbledon Tennis Engine Started!', '#32CD32');
        }

        stopTennisPhysics() {
            this.isActive = false;
            this.showTennisFeedback('🛑 Tennis Engine Stopped', '#f56565');
        }

        startTennisGameLoop() {
            if (!this.isActive) return;
            const currentTime = performance.now();
            if (currentTime - this.lastRenderTime >= this.renderInterval) {
                this.updateTennisPhysics();
                this.renderTennisBalls();
                this.lastRenderTime = currentTime;
            }
            requestAnimationFrame(() => this.startTennisGameLoop());
        }

        updateTennisPhysics() {
            const dt = TENNIS_PHYSICS.TIMESTEP;

            // Surface-specific physics adjustments
            let gravityMultiplier = 1;
            let frictionMultiplier = 1;
            let bounceMultiplier = 1;

            switch(this.controls.courtSurface) {
                case 'clay':
                    frictionMultiplier = 1.5;
                    bounceMultiplier = 0.8;
                    break;
                case 'hard':
                    frictionMultiplier = 0.8;
                    bounceMultiplier = 1.1;
                    break;
                case 'grass':
                default:
                    frictionMultiplier = 1.0;
                    bounceMultiplier = 0.9;
                    break;
            }

            // Update tennis balls
            this.physicsObjects.forEach(ball => {
                if (ball.type !== 'tennis') return;

                // Apply air resistance
                ball.vx *= (1 - TENNIS_PHYSICS.AIR_RESISTANCE * dt);
                ball.vy *= (1 - TENNIS_PHYSICS.AIR_RESISTANCE * dt);

                // Apply gravity
                ball.vy += TENNIS_PHYSICS.GRAVITY * gravityMultiplier * dt;

                // Apply spin effects (Magnus effect)
                if (ball.spin) {
                    const spinForce = ball.spin * TENNIS_PHYSICS.SPIN_FACTOR;
                    ball.vx += spinForce * dt;
                    ball.vy += spinForce * 0.5 * dt;
                    ball.spin *= 0.98; // Spin decay
                }

                // Update position
                ball.x += ball.vx * dt;
                ball.y += ball.vy * dt;

                this.handleTennisBoundaryCollisions(ball, frictionMultiplier, bounceMultiplier);
                this.handleTennisNetCollision(ball);

                // Velocity limiting
                const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
                if (speed > this.gameStats.maxVelocityReached) {
                    this.gameStats.maxVelocityReached = speed;
                }

                if (speed > TENNIS_PHYSICS.MAX_VELOCITY) {
                    ball.vx = (ball.vx / speed) * TENNIS_PHYSICS.MAX_VELOCITY;
                    ball.vy = (ball.vy / speed) * TENNIS_PHYSICS.MAX_VELOCITY;
                }
            });

            this.handleTennisBallCollisions();
            this.handleTennisPlayerCollisions();

            if (this.tennisMatch.active) {
                this.checkTennisScoring();
            }
        }

        updateSurfacePhysics(surface) {
            this.controls.courtSurface = surface;

            // Update existing balls' physics
            this.physicsObjects.forEach(ball => {
                if (ball.type !== 'tennis') return;

                switch(surface) {
                    case 'clay':
                        ball.friction = TENNIS_PHYSICS.FRICTION_COURT * 1.5;
                        ball.restitution = TENNIS_PHYSICS.RESTITUTION_BALL * 0.8;
                        break;
                    case 'hard':
                        ball.friction = TENNIS_PHYSICS.FRICTION_COURT * 0.8;
                        ball.restitution = TENNIS_PHYSICS.RESTITUTION_BALL * 1.1;
                        break;
                    case 'grass':
                    default:
                        ball.friction = TENNIS_PHYSICS.FRICTION_COURT;
                        ball.restitution = TENNIS_PHYSICS.RESTITUTION_BALL;
                        break;
                }
            });
        }

        /* ---------- TENNIS BALL CREATION ---------- */
        addRandomTennisBall() {
            if (!this.canvasElement) return;

            const padding = 80;
                        const x = Math.random() * (this.canvasElement.width - 2 * padding) + padding;
            const y = Math.random() * (this.canvasElement.height * 0.3 - 2 * padding) + padding;

            this.createTennisBall(x, y);
        }

        serveTennisBall() {
            if (!this.canvasElement) return;

            const coords = calculateTennisCoordinates();

            // Serve desde línea de fondo
            const isP1Serving = this.tennisMatch.serving === 'p1';
            const serveX = isP1Serving ? coords.court.x + 50 : coords.court.x + coords.court.width - 50;
            const serveY = this.canvasElement.height * 0.85;

            const ball = this.createTennisBall(serveX, serveY);

            // Aplicar fuerza de saque
            const serveDirection = isP1Serving ? 1 : -1;
            ball.vx = TENNIS_PHYSICS.SERVE_FORCE * serveDirection * 0.6;
            ball.vy = -TENNIS_PHYSICS.SERVE_FORCE * 0.8;
            ball.spin = Math.random() * 20 - 10; // Spin aleatorio

            this.showTennisFeedback(`🎾 ${this.tennisMatch.serving.toUpperCase()} SERVES!`, '#FFD700');
        }

        createTennisBall(x, y) {
            const id = `tennis_${this.objectIdCounter++}`;
            const ball = {
                id: id,
                type: 'tennis',
                x: x, y: y, vx: 0, vy: 0,
                radius: TENNIS_PHYSICS.BALL_RADIUS,
                color: TENNIS_PHYSICS.BALL_COLOR,
                mass: TENNIS_PHYSICS.BALL_MASS,
                restitution: TENNIS_PHYSICS.RESTITUTION_BALL,
                friction: TENNIS_PHYSICS.FRICTION_COURT,
                lastRenderX: -9999, lastRenderY: -9999,
                creationTime: performance.now(),
                lastCollisionTime: 0,

                // Tennis specific properties
                spin: 0,
                lastBounceTime: 0,
                bounceCount: 0,
                lastHitTime: 0,
                isInPlay: true
            };

            this.physicsObjects.set(id, ball);
            this.gameStats.ballsCreated++;
            return ball;
        }

        /* ---------- TENNIS COLLISION HANDLING ---------- */
        handleTennisBoundaryCollisions(ball, frictionMultiplier, bounceMultiplier) {
            if (!this.canvasElement) return;

            const ballHalfSize = ball.radius;
            const coords = calculateTennisCoordinates();

            // Límites de la cancha
            const boundaries = {
                left: coords.court.x + ballHalfSize,
                right: coords.court.x + coords.court.width - ballHalfSize,
                top: coords.court.y + ballHalfSize,
                bottom: coords.court.y + coords.court.height - ballHalfSize
            };

            // Colisiones laterales
            if (ball.x < boundaries.left) {
                ball.x = boundaries.left;
                ball.vx = -ball.vx * TENNIS_PHYSICS.RESTITUTION_WALL * bounceMultiplier;
                ball.vy *= frictionMultiplier;
            } else if (ball.x > boundaries.right) {
                ball.x = boundaries.right;
                ball.vx = -ball.vx * TENNIS_PHYSICS.RESTITUTION_WALL * bounceMultiplier;
                ball.vy *= frictionMultiplier;
            }

            // Colisiones verticales
            if (ball.y < boundaries.top) {
                ball.y = boundaries.top;
                ball.vy = -ball.vy * TENNIS_PHYSICS.RESTITUTION_WALL * bounceMultiplier;
                ball.vx *= frictionMultiplier;
            } else if (ball.y > boundaries.bottom) {
                ball.y = boundaries.bottom;
                ball.vy = -ball.vy * ball.restitution * bounceMultiplier;
                ball.vx *= ball.friction * frictionMultiplier;

                // Registrar rebote
                ball.bounceCount++;
                ball.lastBounceTime = performance.now();
            }
        }

        handleTennisNetCollision(ball) {
            const coords = calculateTennisCoordinates();
            const netX = coords.net.x;
            const netTop = coords.net.y1;
            const netBottom = coords.net.y2;
            const netHeight = TENNIS_PHYSICS.NET_HEIGHT;

            // Verificar colisión con la red (área vertical)
            if (Math.abs(ball.x - netX) < ball.radius + 5 &&
                ball.y > netTop && ball.y < netBottom &&
                ball.y > netBottom - netHeight) {

                // La pelota golpea la red
                ball.vx = -ball.vx * TENNIS_PHYSICS.RESTITUTION_NET;
                ball.vy *= 0.5; // Pierde velocidad vertical
                ball.spin = 0; // Pierde spin

                // Posicionar fuera de la red
                if (ball.x < netX) {
                    ball.x = netX - ball.radius - 5;
                } else {
                    ball.x = netX + ball.radius + 5;
                }

                this.gameStats.netHits++;
                this.showTennisFeedback('🕸️ NET HIT!', '#ff4757');
            }
        }

        handleTennisBallCollisions() {
            const ballsArray = Array.from(this.physicsObjects.values()).filter(obj => obj.type === 'tennis');

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

                        // Intercambiar velocidades (rebote elástico)
                        const tempVx = ballA.vx;
                        const tempVy = ballA.vy;
                        ballA.vx = ballB.vx * 0.9;
                        ballA.vy = ballB.vy * 0.9;
                        ballB.vx = tempVx * 0.9;
                        ballB.vy = tempVy * 0.9;

                        // Intercambiar spin
                        const tempSpin = ballA.spin;
                        ballA.spin = ballB.spin * 0.5;
                        ballB.spin = tempSpin * 0.5;
                    }
                }
            }
        }

        /* ---------- SISTEMA DE RAQUETAS VIRTUALES ---------- */
        handleTennisPlayerCollisions() {
            const players = this.getTennisPlayerPositions();
            if (players.length === 0) return;

            this.physicsObjects.forEach(ball => {
                if (ball.type !== 'tennis') return;

                players.forEach(player => {
                    const dx = ball.x - player.x;
                    const dy = ball.y - player.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const racketReach = this.racketSystem.racketLength;

                    if (distance < racketReach && distance > 0) {
                        const currentTime = performance.now();

                        if (currentTime - ball.lastHitTime > this.racketSystem.hitCooldown) {
                            this.executeTennisHit(ball, player, dx, dy, distance);
                            ball.lastHitTime = currentTime;
                            this.gameStats.totalHits++;
                        }
                    }
                });
            });
        }

        executeTennisHit(ball, player, dx, dy, distance) {
            const normalX = dx / distance;
            const normalY = dy / distance;

            // Fuerza del golpe basada en proximidad
            const hitIntensity = Math.max(0.3, (this.racketSystem.racketLength - distance) / this.racketSystem.racketLength);
            const baseHitForce = TENNIS_PHYSICS.PLAYER_INTERACTION_FORCE * hitIntensity;

            // Aplicar fuerza del golpe
            ball.vx += normalX * baseHitForce * TENNIS_PHYSICS.TIMESTEP * 2;
            ball.vy += normalY * baseHitForce * TENNIS_PHYSICS.TIMESTEP * 2;

            // Añadir velocidad del jugador si se está moviendo
            if (player.vx || player.vy) {
                const playerSpeed = Math.sqrt((player.vx || 0) ** 2 + (player.vy || 0) ** 2);
                if (playerSpeed > 30) {
                    ball.vx += (player.vx || 0) * 0.8;
                    ball.vy += (player.vy || 0) * 0.8;
                }
            }

            // Generar spin aleatorio en el golpe
            ball.spin = (Math.random() - 0.5) * 40 * hitIntensity;

            // Efecto visual del golpe
            this.showTennisHitEffect(ball.x, ball.y, player.type);
        }

        showTennisHitEffect(x, y, playerType) {
            const hitColor = playerType === 'self' ? '#48bb78' : '#f56565';
            this.showTennisFeedback(`🎾 ${playerType === 'self' ? 'YOUR' : 'OPPONENT'} HIT!`, hitColor);
        }

        getTennisPlayerPositions() {
            const currentTime = performance.now();
            const players = [];
            if (!drawariaCanvas) return players;

            const canvasRect = drawariaCanvas.getBoundingClientRect();
            const deltaTime = currentTime - this.playerTracker.lastUpdateTime;

            // Self player
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

            // Other players
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
            return players;
        }

        /* ---------- TENNIS SCORING SYSTEM ---------- */
        checkTennisScoring() {
            if (!this.tennisMatch.active || !this.canvasElement) return;

            const coords = calculateTennisCoordinates();

            this.physicsObjects.forEach(ball => {
                if (ball.type !== 'tennis' || !ball.isInPlay) return;

                // Verificar si la pelota está dentro de la cancha después del rebote
                if (ball.bounceCount > 0 && ball.lastBounceTime > 0) {
                    const isInCourt = this.checkTennisBallInCourt(ball, coords);

                    if (!isInCourt) {
                        this.scoreTennisPoint(ball);
                        ball.isInPlay = false;
                    }
                }

                // Verificar doble rebote (punto perdido)
                if (ball.bounceCount >= 2) {
                    this.scoreTennisPoint(ball, 'double_bounce');
                    ball.isInPlay = false;
                }
            });
        }

        checkTennisBallInCourt(ball, coords) {
            return ball.x >= coords.sideLines.leftSingles &&
                   ball.x <= coords.sideLines.rightSingles &&
                   ball.y >= coords.baseLines.top &&
                   ball.y <= coords.baseLines.bottom;
        }

        async scoreTennisPoint(ball, reason = 'out') {
            const opponent = this.tennisMatch.serving === 'p1' ? 'p2' : 'p1';

            if (reason === 'out' || reason === 'double_bounce') {
                this.tennisMatch.scores[opponent].points++;
            }

            await this.updateTennisScore();

            const reasonText = reason === 'double_bounce' ? 'DOUBLE BOUNCE' : 'OUT';
            this.showTennisFeedback(`🎾 ${reasonText}! Point to ${opponent.toUpperCase()}`, '#FFD700');

            // Cambiar servidor cada juego
            if (this.checkGameWon()) {
                this.tennisMatch.serving = this.tennisMatch.serving === 'p1' ? 'p2' : 'p1';
            }

            setTimeout(() => {
                this.clearAllTennisBalls(false);
                if (this.tennisMatch.active) {
                    this.serveTennisBall();
                }
            }, 2000);
        }

        async updateTennisScore() {
            // Convertir puntos numéricos a sistema de tenis (0, 15, 30, 40, deuce, etc.)
            const p1Points = this.convertToTennisPoints(this.tennisMatch.scores.p1.points);
            const p2Points = this.convertToTennisPoints(this.tennisMatch.scores.p2.points);

            document.getElementById('tennis-score-p1-points').textContent = p1Points;
            document.getElementById('tennis-score-p2-points').textContent = p2Points;
            document.getElementById('tennis-score-p1-sets').textContent = this.tennisMatch.scores.p1.sets;
            document.getElementById('tennis-score-p1-games').textContent = this.tennisMatch.scores.p1.games;
            document.getElementById('tennis-score-p2-sets').textContent = this.tennisMatch.scores.p2.sets;
            document.getElementById('tennis-score-p2-games').textContent = this.tennisMatch.scores.p2.games;
            document.getElementById('serving-player').textContent = this.tennisMatch.serving.toUpperCase();
        }

        convertToTennisPoints(numericPoints) {
            const tennisPoints = ['0', '15', '30', '40'];

            if (numericPoints < 4) {
                return tennisPoints[numericPoints];
            } else if (numericPoints === 4) {
                return 'DEUCE';
            } else {
                return 'ADV';
            }
        }

        checkGameWon() {
            const p1 = this.tennisMatch.scores.p1;
            const p2 = this.tennisMatch.scores.p2;

            // Verificar si alguien ganó el punto
            if ((p1.points >= 4 && p1.points - p2.points >= 2) ||
                (p2.points >= 4 && p2.points - p1.points >= 2)) {

                // Resetear puntos y sumar juego
                if (p1.points > p2.points) {
                    p1.games++;
                } else {
                    p2.games++;
                }

                p1.points = 0;
                p2.points = 0;

                // Verificar si alguien ganó el set
                if ((p1.games >= 6 && p1.games - p2.games >= 2) ||
                    (p2.games >= 6 && p2.games - p1.games >= 2)) {

                    if (p1.games > p2.games) {
                        p1.sets++;
                    } else {
                        p2.sets++;
                    }

                    p1.games = 0;
                    p2.games = 0;

                    // Verificar si alguien ganó el match
                    if (p1.sets >= TENNIS_MATCH.SETS_TO_WIN || p2.sets >= TENNIS_MATCH.SETS_TO_WIN) {
                        this.endTennisMatch(p1.sets > p2.sets ? 'p1' : 'p2');
                    }
                }

                return true;
            }

            return false;
        }

        /* ---------- TENNIS MATCH MODE ---------- */
        toggleTennisMatch() {
            const button = document.getElementById('match-mode-toggle');
            const scoreboard = document.getElementById('tennis-scoreboard');

            this.tennisMatch.active = !this.tennisMatch.active;

            if (this.tennisMatch.active) {
                button.style.background = 'linear-gradient(135deg, #FFD700, #FFA500)';
                button.setAttribute('data-active', 'true');
                scoreboard.style.display = 'block';
                this.setupTennisMatch();
                this.showTennisFeedback('🏆 WIMBLEDON MATCH MODE ACTIVATED!', '#FFD700');
            } else {
                button.style.background = 'linear-gradient(135deg, #444, #666)';
                button.removeAttribute('data-active');
                scoreboard.style.display = 'none';
                this.resetTennisMatch();
                this.showTennisFeedback('🏆 Match Mode Deactivated', '#666');
            }
        }

        async setupTennisMatch() {
            await drawCompleteTennisCourt();
            this.resetTennisMatchScores();
            await this.updateTennisScore();

            setTimeout(() => {
                this.serveTennisBall();
            }, 1500);
        }

        resetTennisMatchScores() {
            this.tennisMatch.scores = {
                p1: { sets: 0, games: 0, points: 0 },
                p2: { sets: 0, games: 0, points: 0 }
            };
            this.tennisMatch.serving = 'p1';
        }

        resetTennisMatch() {
            this.resetTennisMatchScores();
            if (this.tennisMatch.active) {
                this.clearAllTennisBalls(false);
                setTimeout(() => {
                    drawCompleteTennisCourt().then(() => {
                        this.serveTennisBall();
                    });
                }, 500);
            }
        }

        async endTennisMatch(winner) {
            this.showTennisFeedback(`🏆 ${winner.toUpperCase()} WINS THE WIMBLEDON MATCH!`, '#FFD700');

            setTimeout(() => {
                this.resetTennisMatch();
            }, 4000);
        }

        /* ---------- RENDERING ---------- */
        renderTennisBalls() {
            this.physicsObjects.forEach(obj => {
                if (obj.type !== 'tennis') return;

                const dx = Math.abs(obj.x - obj.lastRenderX);
                const dy = Math.abs(obj.y - obj.lastRenderY);

                const needsServerRedraw = dx > MOVEMENT_THRESHOLD || dy > MOVEMENT_THRESHOLD;

                if (needsServerRedraw) {
                    // Borrar posición anterior
                    if (obj.lastRenderX !== -9999 || obj.lastRenderY !== -9999) {
                        this.drawTennisBall(obj.lastRenderX, obj.lastRenderY, obj.radius, '#FFFFFF');
                    }

                    // Dibujar en nueva posición
                    this.drawTennisBall(obj.x, obj.y, obj.radius, obj.color);

                    obj.lastRenderX = obj.x;
                    obj.lastRenderY = obj.y;
                }
            });
        }

        drawTennisBall(x, y, radius, color) {
            const effectiveThickness = radius * 2.2; // Más pequeña que baloncesto
            enqueueDrawCommand(x, y, x + 0.1, y + 0.1, color, effectiveThickness);
        }

        /* ---------- UTILITY FUNCTIONS ---------- */
        clearAllTennisBalls(showFeedback = true) {
            this.physicsObjects.clear();
            positionCache.clear();

            if (drawariaCtx && drawariaCanvas) {
                drawariaCtx.clearRect(0, 0, drawariaCanvas.width, drawariaCanvas.height);
            }
            if (showFeedback) {
                this.showTennisFeedback('🗑️ ALL TENNIS BALLS CLEARED!', '#cc0000');
            }
        }

        resetAllTennisBalls() {
            if (this.canvasElement) {
                this.physicsObjects.forEach(obj => {
                    obj.x = this.canvasElement.width / 2 + (Math.random() - 0.5) * 100;
                    obj.y = this.canvasElement.height / 2 + (Math.random() - 0.5) * 100;
                    obj.vx = 0; obj.vy = 0; obj.spin = 0;
                    obj.lastRenderX = -9999; obj.lastRenderY = -9999;
                    obj.bounceCount = 0;
                    obj.isInPlay = true;
                });

                this.showTennisFeedback('🔄 All tennis balls reset to center court!', '#74b9ff');
            }
        }

        async cleanTennisCourt() {
            if (!drawariaCanvas) return;

            this.showTennisFeedback('🧹 Cleaning Wimbledon Court...', '#e17055');

            const canvasWidth = drawariaCanvas.width;
            const canvasHeight = drawariaCanvas.height;

            for (let y = 0; y < canvasHeight; y += 80) {
                for (let x = 0; x < canvasWidth; x += 80) {
                    const width = Math.min(80, canvasWidth - x);
                    const height = Math.min(80, canvasHeight - y);
                    enqueueDrawCommand(x, y, x + width, y + height, '#FFFFFF', Math.max(width, height));
                    await sleep(3);
                }
            }

            if (drawariaCtx) {
                drawariaCtx.clearRect(0, 0, canvasWidth, canvasHeight);
            }

            this.showTennisFeedback('🧹 Wimbledon Court Cleaned!', '#00d084');
        }

        /* ---------- PANEL FUNCTIONALITY ---------- */
        makeTennisPanelDraggable() {
            const panel = document.getElementById('tennis-physics-panel');
            const header = document.getElementById('tennis-panel-header');

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

        setupTennisPanelButtons() {
            const minimizeBtn = document.getElementById('tennis-minimize-btn');
            const closeBtn = document.getElementById('tennis-close-btn');
            const content = document.getElementById('tennis-panel-content');
            const panel = document.getElementById('tennis-physics-panel');

            let isMinimized = false;

            // MINIMIZE BUTTON
            minimizeBtn?.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!panel) return;

                if (!isMinimized) {
                    content.style.display = 'none';
                    panel.style.height = 'auto';
                    minimizeBtn.innerHTML = '+';
                    isMinimized = true;
                    this.showTennisFeedback('📱 Tennis Panel Minimized', '#32CD32');
                } else {
                    content.style.display = 'block';
                    panel.style.height = 'auto';
                    minimizeBtn.innerHTML = '−';
                    isMinimized = false;
                    this.showTennisFeedback('📱 Tennis Panel Restored', '#32CD32');
                }
            });

            // CLOSE BUTTON
            closeBtn?.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!panel) return;

                if (confirm('¿Estás seguro de que quieres cerrar el motor de tenis?')) {
                    if (this.isActive) {
                        this.stopTennisPhysics();
                    }
                    isStopped = true;
                    panel.remove();
                    this.showTennisFeedback('❌ Tennis Engine Closed', '#ff4757');
                    console.log('🔴 Tennis Panel closed by user');
                }
            });

            // Hover effects
            [minimizeBtn, closeBtn].forEach(btn => {
                if (!btn) return;
                btn.addEventListener('mouseenter', () => btn.style.opacity = '0.8');
                btn.addEventListener('mouseleave', () => btn.style.opacity = '1');
            });
        }

        startTennisStatsMonitoring() {
            setInterval(() => {
                document.getElementById('tennis-ball-count').textContent = this.physicsObjects.size;
                document.getElementById('hits-count').textContent = this.gameStats.totalHits;
                document.getElementById('aces-count').textContent = this.gameStats.totalAces;
                document.getElementById('net-hits-count').textContent = this.gameStats.netHits;
                document.getElementById('tennis-max-speed').textContent = Math.round(this.gameStats.maxVelocityReached * 3.6); // Convert to km/h
                document.getElementById('surface-info').textContent =
                    this.controls.courtSurface.charAt(0).toUpperCase() + this.controls.courtSurface.slice(1);
            }, 1000);
        }

        showTennisFeedback(message, color) {
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
    let tennisEngine = null;

    const initTennisEngine = () => {
        if (!tennisEngine) {
            console.log('🎾 Initializing Wimbledon Tennis Physics Engine v1.0...');
            tennisEngine = new AdvancedDrawariaTennis();

            setTimeout(() => {
                const confirmMsg = document.createElement('div');
                confirmMsg.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: linear-gradient(45deg, #228B22, #32CD32);
                    color: white;
                    padding: 25px 35px;
                    border-radius: 20px;
                    font-size: 16px;
                    font-weight: bold;
                    z-index: 2147483648;
                    text-align: center;
                    box-shadow: 0 0 40px rgba(34,139,34,0.6);
                    opacity: 0;
                    transition: opacity 0.3s ease-in-out;
                    border: 3px solid #FFD700;
                `;
                confirmMsg.innerHTML = `
                    🎾 WIMBLEDON TENNIS ENGINE v1.0 LOADED! 🎾<br>
                    <div style="font-size: 12px; margin-top: 10px; color: #E0FFE0;">
                        ✅ Professional Wimbledon Court • Tennis Physics • Spin Effects<br>
                        ✅ Net Detection • Court Surfaces • Tennis Scoring System<br>
                        ✅ Virtual Rackets • Match Mode • Realistic Ball Physics
                    </div>
                `;

                document.body.appendChild(confirmMsg);
                setTimeout(() => confirmMsg.style.opacity = '1', 10);
                setTimeout(() => confirmMsg.style.opacity = '0', 4000);
                setTimeout(() => confirmMsg.remove(), 4300);
            }, 1000);
        }
    };

    // Enhanced CSS for Tennis styling
    const tennisStyle = document.createElement('style');
    tennisStyle.textContent = `
        @keyframes tennis-serve {
            0% { transform: scale(0) rotate(0deg); opacity: 1; }
            50% { transform: scale(1.3) rotate(180deg); opacity: 0.9; }
            100% { transform: scale(0) rotate(360deg); opacity: 0; }
        }

        @keyframes court-shine {
            0% { box-shadow: 0 0 15px rgba(34, 139, 34, 0.3); }
            50% { box-shadow: 0 0 25px rgba(50, 205, 50, 0.6); }
            100% { box-shadow: 0 0 15px rgba(34, 139, 34, 0.3); }
        }

        .tennis-mode-toggle[data-active="true"] {
            animation: court-shine 2s infinite;
        }

        #tennis-physics-panel {
            transition: none !important;
        }

        #tennis-panel-header:hover {
            background: linear-gradient(45deg, #228B22, #32CD32) !important;
        }

        #tennis-minimize-btn:hover {
            background: rgba(255,255,255,0.4) !important;
        }

        #tennis-close-btn:hover {
            background: rgba(255,0,0,0.8) !important;
        }

        /* Tennis court specific styling */
        .wimbledon-court {
            background: linear-gradient(45deg, #228B22, #32CD32);
        }

        .tennis-ball-spin {
            animation: tennis-ball-rotation 0.5s linear infinite;
        }

        @keyframes tennis-ball-rotation {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        /* Tennis match styling */
        @keyframes tennis-serve-ready {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-8px) scale(1.05); }
        }

        .tennis-serving {
            animation: tennis-serve-ready 1s infinite ease-in-out;
        }

        /* Status div tennis styling */
        #tennis-status {
            font-family: 'Arial Black', Arial, sans-serif !important;
            animation: court-shine 3s infinite;
        }

        /* Button hover effects */
        button:hover {
            transform: translateY(-2px) !important;
            transition: all 0.2s ease !important;
        }

        /* Tennis color scheme */
        .tennis-green { color: #228B22; }
        .tennis-lime { color: #32CD32; }
        .tennis-white { color: #FFFFFF; }
        .tennis-black { color: #000000; }
        .tennis-brown { color: #8B4513; }

        /* Tennis specific animations */
        @keyframes tennis-net-hit {
            0% { opacity: 1; }
            50% { opacity: 0.3; transform: scale(1.2); }
            100% { opacity: 1; transform: scale(1); }
        }

        .tennis-net-collision {
            animation: tennis-net-hit 0.3s ease-out;
        }
    `;
    document.head.appendChild(tennisStyle);

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTennisEngine);
    } else {
        initTennisEngine();
    }
    setTimeout(initTennisEngine, 2000);

    console.log('🎾 Advanced Wimbledon Tennis Physics Engine v1.0 loaded successfully! 🎾');
    console.log('🏟️ Features: Professional Court • Tennis Physics • Spin Effects • Net Detection');
    console.log('🏆 Ready for Wimbledon-style tennis matches in Drawaria!');

})();
