// ==UserScript==
// @name         Drawaria Physics Engine Baseball⚾
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Advanced baseball physics with professional MLB diamond and batting system!
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        none
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/547934/Drawaria%20Physics%20Engine%20Baseball%E2%9A%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/547934/Drawaria%20Physics%20Engine%20Baseball%E2%9A%BE.meta.js
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
    const BATCH_SIZE = 18;
    const BATCH_INTERVAL = 35;

    const positionCache = new Map();
    const MOVEMENT_THRESHOLD = 2;

    // ✅ COLORES OFICIALES DE BASEBALL MLB
    const BASEBALL_COLORS = {
        fieldColor: '#228B22',      // Verde césped del campo
        dirtColor: '#DEB887',       // Tierra del diamante
        lineColor: '#FFFFFF',       // Líneas blancas oficiales
        baseColor: '#FFFAF0',       // Bases blancas
        moundColor: '#8B7355',      // Montículo marrón
        fenceColor: '#8B4513',      // Cerca marrón
        textColor: '#FFFFFF',       // Texto blanco
        dugoutColor: '#654321'      // Dugouts marrones
    };

    // Baseball physics constants[1][2]
    const BASEBALL_PHYSICS = {
        GRAVITY: 450,               // Gravedad más fuerte para trayectorias parabólicas
        BALL_MASS: 0.15,           // Masa de pelota de baseball
        BALL_RADIUS: 12,           // Pelota más pequeña que baloncesto
        TIMESTEP: 1/60,
        MAX_VELOCITY: 1000,        // Velocidad muy alta para home runs
        AIR_RESISTANCE: 0.002,     // Poca resistencia para vuelos largos
        RESTITUTION_BALL: 0.4,     // Rebote bajo en tierra
        RESTITUTION_WALL: 0.3,     // Rebote muy bajo en cercas
        FRICTION_DIRT: 0.9,        // Alta fricción en tierra
        FRICTION_GRASS: 0.8,       // Fricción media en césped
        PLAYER_INTERACTION_FORCE: 500,
        PLAYER_PUSH_MULTIPLIER: 3.0,
        PLAYER_RESTITUTION: 0.95,

        // Baseball specific[3]
        BAT_FORCE: 600,
        PITCH_FORCE: 300,
        BALL_COLOR: '#87CEEB',     // Azul claro como pidió
        WIND_EFFECT: 0.1,
        HOME_RUN_DISTANCE: 400
    };

    const BASEBALL_GAME = {
        INNINGS: 9,
        OUTS_PER_INNING: 3,
        STRIKES_FOR_OUT: 3,
        BALLS_FOR_WALK: 4
    };

    let isDrawing = false;
    let isStopped = false;

    // WebSocket interception
    const originalWebSocketSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (...args) {
        if (!drawariaSocket && this.url && this.url.includes('drawaria')) {
            drawariaSocket = this;
            console.log('🔗 Drawaria WebSocket captured for baseball engine.');
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

    // ✅ SISTEMA DE COORDENADAS DE BASEBALL PROFESIONAL
    function getCanvasSize() {
        return {
            width: drawariaCanvas.width,
            height: drawariaCanvas.height
        };
    }

    function calculateBaseballCoordinates() {
        const size = getCanvasSize();

        // Home plate en la parte inferior
        const homeX = size.width * 0.5;
        const homeY = size.height * 0.85;

        // Distancia entre bases (proporción MLB)
        const baseDistance = Math.min(size.width, size.height) * 0.25;

        const coords = {
            // Home plate y bases del diamante
            home: { x: homeX, y: homeY },
            firstBase: {
                x: homeX + baseDistance * Math.cos(-Math.PI/4),
                y: homeY + baseDistance * Math.sin(-Math.PI/4)
            },
            secondBase: {
                x: homeX,
                y: homeY - baseDistance * Math.sqrt(2)
            },
            thirdBase: {
                x: homeX - baseDistance * Math.cos(-Math.PI/4),
                y: homeY + baseDistance * Math.sin(-Math.PI/4)
            },

            // Pitcher's mound
            pitcherMound: {
                x: homeX,
                y: homeY - baseDistance * 0.6,
                radius: baseDistance * 0.08
            },

            // Líneas de foul
            foulLines: {
                leftStart: { x: homeX, y: homeY },
                leftEnd: { x: homeX - size.width * 0.4, y: size.height * 0.1 },
                rightStart: { x: homeX, y: homeY },
                rightEnd: { x: homeX + size.width * 0.4, y: size.height * 0.1 }
            },

            // Outfield fence
            outfield: {
                centerX: homeX,
                centerY: homeY - baseDistance * 1.8,
                radius: baseDistance * 1.5,
                startAngle: Math.PI * 0.75,
                endAngle: Math.PI * 0.25
            },

            // Dugouts
            dugouts: {
                left: {
                    x: homeX - baseDistance * 1.2,
                    y: homeY + baseDistance * 0.3,
                    width: baseDistance * 0.6,
                    height: baseDistance * 0.2
                },
                right: {
                    x: homeX + baseDistance * 0.6,
                    y: homeY + baseDistance * 0.3,
                    width: baseDistance * 0.6,
                    height: baseDistance * 0.2
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

    async function drawLineLocalAndServer(startX, startY, endX, endY, color, thickness, delay = 45) {
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
        await sleep(12);
    }

    // ✅ FUNCIONES DE DIBUJO DE CANCHA DE BASEBALL
    async function drawBaseballField() {
        if (isStopped) return;

        updateStatus(document.getElementById('baseball-status'), "⚾ Dibujando campo de césped MLB...", BASEBALL_COLORS.fieldColor);

        const canvasSize = getCanvasSize();
        const coords = calculateBaseballCoordinates();

        // Césped del outfield (fondo verde)
        for (let y = 20; y < canvasSize.height - 20; y += 6) {
            await drawLineLocalAndServer(20, y, canvasSize.width - 20, y, BASEBALL_COLORS.fieldColor, 2, 20);
            if (isStopped) break;
        }

        // Diamante de tierra (infield)
        await drawBaseballDiamond(coords);
    }

    async function drawBaseballDiamond(coords) {
        if (isStopped) return;

        // Diamante de tierra conectando todas las bases[4]
        await drawLineLocalAndServer(coords.home.x, coords.home.y, coords.firstBase.x, coords.firstBase.y, BASEBALL_COLORS.dirtColor, 8, 50);
        await drawLineLocalAndServer(coords.firstBase.x, coords.firstBase.y, coords.secondBase.x, coords.secondBase.y, BASEBALL_COLORS.dirtColor, 8, 50);
        await drawLineLocalAndServer(coords.secondBase.x, coords.secondBase.y, coords.thirdBase.x, coords.thirdBase.y, BASEBALL_COLORS.dirtColor, 8, 50);
        await drawLineLocalAndServer(coords.thirdBase.x, coords.thirdBase.y, coords.home.x, coords.home.y, BASEBALL_COLORS.dirtColor, 8, 50);

        // Rellenar el diamante con tierra
        const steps = 15;
        for (let i = 1; i < steps; i++) {
            const factor = i / steps;

            // Líneas horizontales del diamante
            const leftX = coords.thirdBase.x + (coords.home.x - coords.thirdBase.x) * factor;
            const rightX = coords.firstBase.x + (coords.home.x - coords.firstBase.x) * factor;
            const y = coords.home.y + (coords.secondBase.y - coords.home.y) * factor;

            await drawLineLocalAndServer(leftX, y, rightX, y, BASEBALL_COLORS.dirtColor, 3, 25);
            if (isStopped) break;
        }
    }

    async function drawBaseballBases(coords) {
        if (isStopped) return;

        updateStatus(document.getElementById('baseball-status'), "⚪ Dibujando bases oficiales...", BASEBALL_COLORS.baseColor);

        const baseSize = 12;

        // Home plate (forma de pentágono)
        await drawHomeplate(coords.home, baseSize);

        // Primera base
        await drawSquareBase(coords.firstBase, baseSize, '1st');

        // Segunda base
        await drawSquareBase(coords.secondBase, baseSize, '2nd');

        // Tercera base
        await drawSquareBase(coords.thirdBase, baseSize, '3rd');

        // Pitcher's mound
        await drawPitcherMound(coords.pitcherMound);
    }

    async function drawHomeplate(homeCoords, size) {
        // Home plate tiene forma pentagonal característica
        const points = [
            { x: homeCoords.x, y: homeCoords.y - size },          // Top
            { x: homeCoords.x + size, y: homeCoords.y - size/2 }, // Top right
            { x: homeCoords.x + size, y: homeCoords.y + size/2 }, // Bottom right
            { x: homeCoords.x, y: homeCoords.y + size },          // Bottom point
            { x: homeCoords.x - size, y: homeCoords.y + size/2 }, // Bottom left
            { x: homeCoords.x - size, y: homeCoords.y - size/2 }  // Top left
        ];

        for (let i = 0; i < points.length; i++) {
            const current = points[i];
            const next = points[(i + 1) % points.length];
            await drawLineLocalAndServer(current.x, current.y, next.x, next.y, BASEBALL_COLORS.baseColor, 4, 40);
            if (isStopped) break;
        }
    }

    async function drawSquareBase(baseCoords, size, label) {
        // Base cuadrada
        await drawRectangleOutline({
            x: baseCoords.x - size/2,
            y: baseCoords.y - size/2,
            width: size,
            height: size
        }, BASEBALL_COLORS.baseColor, 4);

        // Rellenar la base
        for (let i = 0; i < size - 2; i += 2) {
            await drawLineLocalAndServer(
                baseCoords.x - size/2 + 1, baseCoords.y - size/2 + 1 + i,
                baseCoords.x + size/2 - 1, baseCoords.y - size/2 + 1 + i,
                BASEBALL_COLORS.baseColor, 1, 15
            );
            if (isStopped) break;
        }
    }

    async function drawPitcherMound(moundCoords) {
        // Círculo del montículo del pitcher
        await drawCircle(moundCoords.x, moundCoords.y, moundCoords.radius, BASEBALL_COLORS.moundColor, 5);

        // Textura del montículo
        const steps = 8;
        for (let i = 0; i < steps; i++) {
            const angle = (Math.PI * 2 * i) / steps;
            const innerRadius = moundCoords.radius * 0.3;
            const outerRadius = moundCoords.radius * 0.8;

            const x1 = moundCoords.x + Math.cos(angle) * innerRadius;
            const y1 = moundCoords.y + Math.sin(angle) * innerRadius;
            const x2 = moundCoords.x + Math.cos(angle) * outerRadius;
            const y2 = moundCoords.y + Math.sin(angle) * outerRadius;

            await drawLineLocalAndServer(x1, y1, x2, y2, '#A0522D', 2, 20);
            if (isStopped) break;
        }
    }

    async function drawBaseballOutfield(coords) {
        if (isStopped) return;

        updateStatus(document.getElementById('baseball-status'), "🏟️ Dibujando outfield y cerca...", BASEBALL_COLORS.fenceColor);

        // Líneas de foul
        await drawLineLocalAndServer(
            coords.foulLines.leftStart.x, coords.foulLines.leftStart.y,
            coords.foulLines.leftEnd.x, coords.foulLines.leftEnd.y,
            BASEBALL_COLORS.lineColor, 4, 60
        );

        await drawLineLocalAndServer(
            coords.foulLines.rightStart.x, coords.foulLines.rightStart.y,
            coords.foulLines.rightEnd.x, coords.foulLines.rightEnd.y,
            BASEBALL_COLORS.lineColor, 4, 60
        );

        // Cerca del outfield (arco)
        await drawArc(coords.outfield, BASEBALL_COLORS.fenceColor, 6, coords.outfield.startAngle, coords.outfield.endAngle);

        // Dugouts
        await drawRectangleOutline(coords.dugouts.left, BASEBALL_COLORS.dugoutColor, 5);
        await drawRectangleOutline(coords.dugouts.right, BASEBALL_COLORS.dugoutColor, 5);

        // Rellenar dugouts
        await fillRectangle(coords.dugouts.left, BASEBALL_COLORS.dugoutColor);
        await fillRectangle(coords.dugouts.right, BASEBALL_COLORS.dugoutColor);
    }

    // ✅ FUNCIONES GEOMÉTRICAS
    async function drawCircle(centerX, centerY, radius, color, thickness) {
        const steps = 20;
        for (let i = 0; i <= steps; i++) {
            if (isStopped) break;

            const angle1 = (Math.PI * 2 * i) / steps;
            const angle2 = (Math.PI * 2 * (i + 1)) / steps;

            const x1 = centerX + Math.cos(angle1) * radius;
            const y1 = centerY + Math.sin(angle1) * radius;
            const x2 = centerX + Math.cos(angle2) * radius;
            const y2 = centerY + Math.sin(angle2) * radius;

            await drawLineLocalAndServer(x1, y1, x2, y2, color, thickness, 25);
        }
    }

    async function drawArc(arcCoords, color, thickness, startAngle, endAngle) {
        const steps = 24;
        for (let i = 0; i < steps; i++) {
            if (isStopped) break;

            const progress1 = i / steps;
            const progress2 = (i + 1) / steps;

            const angle1 = startAngle + (endAngle - startAngle) * progress1;
            const angle2 = startAngle + (endAngle - startAngle) * progress2;

            const x1 = arcCoords.centerX + Math.cos(angle1) * arcCoords.radius;
            const y1 = arcCoords.centerY + Math.sin(angle1) * arcCoords.radius;
            const x2 = arcCoords.centerX + Math.cos(angle2) * arcCoords.radius;
            const y2 = arcCoords.centerY + Math.sin(angle2) * arcCoords.radius;

            await drawLineLocalAndServer(x1, y1, x2, y2, color, thickness, 30);
        }
    }

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
            await drawLineLocalAndServer(rectCoords.x + 1, y, rectCoords.x + rectCoords.width - 1, y, color, 2, 15);
            if (isStopped) break;
        }
    }

    // ✅ TEXTO BASEBALL EN PIXEL ART
    const BASEBALL_LETTERS = {
        'B': [[1,1,1,1],[1,0,0,1],[1,1,1,1],[1,0,0,1],[1,1,1,1]],
        'A': [[0,1,1,0],[1,0,0,1],[1,1,1,1],[1,0,0,1],[1,0,0,1]],
        'S': [[1,1,1,1],[1,0,0,0],[1,1,1,1],[0,0,0,1],[1,1,1,1]],
        'E': [[1,1,1,1],[1,0,0,0],[1,1,1,0],[1,0,0,0],[1,1,1,1]],
        'L': [[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,1,1,1]],
        'R': [[1,1,1,0],[1,0,0,1],[1,1,1,0],[1,0,1,0],[1,0,0,1]]
    };

    async function drawBaseballPixelText(text, coords) {
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

            const pattern = BASEBALL_LETTERS[letter];
            if (!pattern) continue;

            for (let row = 0; row < pattern.length; row++) {
                for (let col = 0; col < pattern[row].length; col++) {
                    if (pattern[row][col] === 1) {
                        const pixelX = currentX + (col * coords.text.pixelSize);
                        const pixelY = coords.text.y + (row * coords.text.pixelSize);

                        const canvasSize = getCanvasSize();
                        if (pixelX >= 0 && pixelX < canvasSize.width && pixelY >= 0 && pixelY < canvasSize.height) {
                            await drawPixel(pixelX, pixelY, BASEBALL_COLORS.textColor, coords.text.pixelSize);
                        }
                    }
                }
            }

            currentX += letterSpacing;
            await sleep(90);
        }
    }

    // ✅ FUNCIÓN PRINCIPAL: CANCHA DE BASEBALL COMPLETA
    async function drawCompleteBaseballField() {
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
        const statusDiv = document.getElementById('baseball-status') || createStatusDiv();

        try {
            const coords = calculateBaseballCoordinates();
            const canvasSize = getCanvasSize();

            console.log(`⚾ Campo de baseball MLB iniciado:`);
            console.log(`📏 Canvas: ${canvasSize.width}x${canvasSize.height}`);

            updateStatus(statusDiv, `⚾ CAMPO DE BASEBALL MLB: ${canvasSize.width}x${canvasSize.height}`, "#228B22");
            await sleep(800);

            // FASE 1: CAMPO DE CÉSPED
            updateStatus(statusDiv, "⚾ FASE 1: Campo de césped MLB...", BASEBALL_COLORS.fieldColor);
            await drawBaseballField();
            await sleep(300);
            if (isStopped) return;

            // FASE 2: BASES Y DIAMANTE
            updateStatus(statusDiv, "💎 FASE 2: Diamante y bases oficiales...", BASEBALL_COLORS.dirtColor);
            await drawBaseballBases(coords);
            await sleep(300);
            if (isStopped) return;

            // FASE 3: OUTFIELD Y CERCA
            updateStatus(statusDiv, "🏟️ FASE 3: Outfield y cerca perimetral...", BASEBALL_COLORS.fenceColor);
            await drawBaseballOutfield(coords);
            await sleep(300);
            if (isStopped) return;

            // FASE 4: TEXTO BASEBALL
            updateStatus(statusDiv, "🎮 FASE 4: Texto blanco 'BASEBALL'...", BASEBALL_COLORS.textColor);
            await drawBaseballPixelText("BASEBALL", coords);

            // CAMPO COMPLETO
            updateStatus(statusDiv, "🏆 ¡CAMPO DE BASEBALL MLB COMPLETO! ⚾🏆", "#006400");

            setTimeout(() => {
                if (statusDiv && statusDiv.parentNode) {
                    statusDiv.style.opacity = 0;
                    setTimeout(() => statusDiv.remove(), 500);
                }
            }, 4000);

        } catch (error) {
            console.error("Error en campo de baseball:", error);
            updateStatus(statusDiv, `❌ Error: ${error.message}`, "#B22222");
        } finally {
            isDrawing = false;
        }
    }

    function createStatusDiv() {
        const statusDiv = document.createElement('div');
        statusDiv.id = 'baseball-status';
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

    /* ---------- ADVANCED BASEBALL PHYSICS ENGINE ---------- */
    class AdvancedDrawariaBaseball {
        constructor() {
            this.initialized = false;
            this.isActive = false;
            this.physicsObjects = new Map();
            this.objectIdCounter = 0;
            this.lastRenderTime = 0;
            this.renderInterval = 1000 / 30;

            // Baseball batting system[5]
            this.battingSystem = {
                batLength: 80,
                batWidth: 6,
                swingCooldown: 500,
                lastSwingTime: 0
            };

            // Baseball game state
            this.baseballGame = {
                active: false,
                inning: 1,
                topBottom: 'top', // top or bottom
                outs: 0,
                strikes: 0,
                balls: 0,
                runs: { home: 0, away: 0 },
                bases: { first: false, second: false, third: false }
            };

            this.gameStats = {
                totalHits: 0,
                homeRuns: 0,
                strikeouts: 0,
                walks: 0,
                maxVelocityReached: 0,
                ballsCreated: 0
            };

            this.controls = {
                showDebug: false,
                defaultBallColor: BASEBALL_PHYSICS.BALL_COLOR,
                windDirection: 0,
                windStrength: 1
            };

            this.playerTracker = {
                players: new Map(),
                detectionRadius: BASEBALL_PHYSICS.BALL_RADIUS * 3,
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
                    this.createBaseballPanel();
                    console.log('✅ Advanced Baseball Physics Engine v1.0 initialized');
                } else {
                    setTimeout(checkGameReady, 100);
                }
            };
            checkGameReady();
        }

        createBaseballPanel() {
            const existingPanel = document.getElementById('baseball-physics-panel');
            if (existingPanel) existingPanel.remove();

            const panel = document.createElement('div');
            panel.id = 'baseball-physics-panel';
            panel.style.cssText = `
                position: fixed !important;
                top: 20px !important;
                right: 20px !important;
                width: 400px !important;
                z-index: 2147483647 !important;
                background: linear-gradient(135deg, #0f2f0f, #1a4a1a) !important;
                border: 2px solid #228B22 !important;
                border-radius: 15px !important;
                color: white !important;
                font-family: 'Segoe UI', Arial, sans-serif !important;
                overflow: hidden !important;
                box-shadow: 0 0 30px rgba(34,139,34,0.4) !important;
            `;

            const header = document.createElement('div');
            header.id = 'baseball-panel-header';
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
            title.innerHTML = '⚾ MLB BASEBALL ENGINE v1.0';
            title.style.flex = '1';

            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = `display: flex !important; gap: 8px !important;`;

            const minimizeBtn = document.createElement('button');
            minimizeBtn.id = 'baseball-minimize-btn';
            minimizeBtn.innerHTML = '−';
            minimizeBtn.style.cssText = `
                width: 25px !important; height: 25px !important;
                background: rgba(255,255,255,0.2) !important;
                border: none !important; border-radius: 4px !important;
                color: white !important; cursor: pointer !important;
                font-size: 16px !important; line-height: 1 !important; padding: 0 !important;
            `;

            const closeBtn = document.createElement('button');
            closeBtn.id = 'baseball-close-btn';
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
            content.id = 'baseball-panel-content';
            content.style.cssText = `padding: 20px !important;`;
            content.innerHTML = `
                <!-- CREATE BASEBALL FIELD -->
                <div style="margin-bottom: 15px; text-align: center;">
                    <button id="create-baseball-field-btn" style="
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
                    ">⚾ Create MLB Baseball Field</button>
                </div>

                <!-- LAUNCH BASEBALL ENGINE -->
                <div style="margin-bottom: 15px; text-align: center;">
                    <button id="toggle-baseball-physics" style="
                        width: 100%;
                        padding: 12px;
                        background: linear-gradient(135deg, #87CEEB, #4682B4);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: bold;
                    ">🚀 Launch Baseball Engine</button>
                </div>

                <!-- BASEBALL ACTIONS -->
                <div style="display: flex; gap: 8px; margin-bottom: 15px;">
                    <button id="add-baseball-btn" style="
                        flex: 1;
                        padding: 8px;
                        background: linear-gradient(135deg, #87CEEB, #4682B4);
                        color: white;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 12px;
                        font-weight: bold;
                    ">⚾ Add Baseball</button>
                    <button id="pitch-ball-btn" style="
                        flex: 1;
                        padding: 8px;
                        background: linear-gradient(135deg, #FFD700, #FFA500);
                        color: white;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 12px;
                        font-weight: bold;
                    ">🥎 Pitch</button>
                </div>

                <!-- WEATHER CONDITIONS -->
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-size: 12px; color: #32CD32;">
                        🌬️ Wind Conditions:
                    </label>
                    <select id="wind-conditions" style="
                        width: 100%;
                        padding: 8px;
                        border: 1px solid #32CD32;
                        border-radius: 6px;
                        background: #1a4a1a;
                        color: white;
                        font-size: 12px;
                    ">
                        <option value="none">🌤️ No Wind</option>
                        <option value="light">💨 Light Breeze</option>
                        <option value="strong">🌪️ Strong Wind</option>
                        <option value="tailwind">➡️ Tailwind (Home Run)</option>
                        <option value="headwind">⬅️ Headwind (Pitcher)</option>
                    </select>
                </div>

                <!-- ACTION BUTTONS -->
                <div style="display: flex; gap: 8px; margin-bottom: 15px;">
                    <button id="reset-baseball-btn" style="
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
                    <button id="stop-baseball-field-btn" style="
                        flex: 1;
                        padding: 8px;
                        background: linear-gradient(135deg, #e74c3c, #c0392b);
                        color: white;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-weight: bold;
                        font-size: 11px;
                    ">⛔ Stop Field</button>
                </div>

                <!-- BASEBALL MODES -->
                <div style="margin-bottom: 15px;">
                    <h4 style="margin: 0 0 10px 0; font-size: 13px; color: #32CD32; text-align: center;">⚾ Baseball Modes</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                        <button id="game-mode-toggle" class="baseball-mode-toggle" style="
                            padding: 8px;
                            background: linear-gradient(135deg, #444, #666);
                            color: white;
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 10px;
                            font-weight: bold;
                        ">🏆 Game Mode</button>
                        <button id="clean-baseball-canvas-btn" style="
                            padding: 8px;
                            background: linear-gradient(135deg, #e17055, #d63031);
                            color: white;
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 10px;
                            font-weight: bold;
                        ">🧹 Clean Field</button>
                    </div>
                </div>

                <!-- CLEAR ALL -->
                <div style="margin-bottom: 15px;">
                    <button id="clear-baseballs-btn" style="
                        width: 100%;
                        padding: 10px;
                        background: linear-gradient(135deg, #990000, #cc0000);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: bold;
                    ">🗑️ Clear All Baseballs</button>
                </div>

                <!-- BASEBALL SCOREBOARD -->
                <div id="baseball-scoreboard" style="
                    display: none;
                    background: rgba(0,0,0,0.4);
                    padding: 15px;
                    border-radius: 8px;
                    text-align: center;
                    margin-bottom: 15px;
                    border: 2px solid #FFD700;
                ">
                    <h4 style="margin: 0 0 10px 0; color: #FFD700; font-size: 14px;">⚾ MLB SCOREBOARD</h4>
                    <div style="display: flex; justify-content: space-between; font-size: 14px; font-weight: bold; margin-bottom: 10px;">
                        <div style="color: #ff6b6b;">
                            Away: <span id="baseball-score-away">0</span>
                        </div>
                        <div style="color: #FFD700; font-size: 12px;">
                            Inning: <span id="current-inning">1</span> (<span id="inning-half">Top</span>)
                        </div>
                        <div style="color: #74b9ff;">
                            Home: <span id="baseball-score-home">0</span>
                        </div>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 11px; color: #FFD700;">
                        <div>Outs: <span id="outs-count">0</span></div>
                        <div>Balls: <span id="balls-count">0</span></div>
                        <div>Strikes: <span id="strikes-count">0</span></div>
                    </div>
                    <div style="margin-top: 8px; font-size: 10px; color: #87CEEB;">
                        Bases:
                        <span id="first-base" style="color: #ccc;">1st</span> |
                        <span id="second-base" style="color: #ccc;">2nd</span> |
                        <span id="third-base" style="color: #ccc;">3rd</span>
                    </div>
                </div>

                <!-- BASEBALL STATS -->
                <div id="baseball-stats" style="
                    background: rgba(0,0,0,0.3);
                    padding: 10px;
                    border-radius: 6px;
                    font-size: 10px;
                    text-align: center;
                    border: 1px solid rgba(34,139,34,0.3);
                ">
                    <div>Baseballs: <span id="baseball-count">0</span> | Hits: <span id="baseball-hits-count">0</span></div>
                    <div>Home Runs: <span id="home-runs-count">0</span> | Strikeouts: <span id="strikeouts-count">0</span></div>
                    <div>Max Speed: <span id="baseball-max-speed">0</span> mph</div>
                    <div>Wind: <span id="wind-info">No Wind</span></div>
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
                    Professional MLB Diamond • Baseball Physics<br>
                    <span style="color: #87CEEB;">Wind effects • Home run detection • Virtual batting</span>
                </div>
            `;

            panel.appendChild(header);
            panel.appendChild(content);
            document.body.appendChild(panel);

            this.makeBaseballPanelDraggable();
            this.setupBaseballPanelButtons();
            this.setupBaseballEventListeners();
            this.startBaseballStatsMonitoring();
        }

        setupBaseballEventListeners() {
            // Baseball field controls
            document.getElementById('create-baseball-field-btn')?.addEventListener('click', () => drawCompleteBaseballField());
            document.getElementById('toggle-baseball-physics')?.addEventListener('click', () => this.toggleBaseballPhysics());
            document.getElementById('stop-baseball-field-btn')?.addEventListener('click', () => this.stopBaseballFieldDrawing());

            // Baseball creation
            document.getElementById('add-baseball-btn')?.addEventListener('click', () => this.addRandomBaseball());
            document.getElementById('pitch-ball-btn')?.addEventListener('click', () => this.pitchBaseball());

            // Actions
            document.getElementById('reset-baseball-btn')?.addEventListener('click', () => this.resetAllBaseballs());
            document.getElementById('clear-baseballs-btn')?.addEventListener('click', () => this.clearAllBaseballs());
            document.getElementById('game-mode-toggle')?.addEventListener('click', () => this.toggleBaseballGame());
            document.getElementById('clean-baseball-canvas-btn')?.addEventListener('click', () => this.cleanBaseballField());

            // Wind conditions
            document.getElementById('wind-conditions')?.addEventListener('change', (e) => {
                this.updateWindConditions(e.target.value);
                this.showBaseballFeedback(`🌬️ Wind: ${e.target.options[e.target.selectedIndex].text}`, '#87CEEB');
            });

            // Canvas click for baseball
            if (this.canvasElement) {
                this.canvasElement.addEventListener('click', (e) => this.createBaseball(e.clientX - this.canvasElement.getBoundingClientRect().left, e.clientY - this.canvasElement.getBoundingClientRect().top));
            }
        }

        stopBaseballFieldDrawing() {
            isStopped = true;
            const statusDiv = document.getElementById('baseball-status');
            if (statusDiv) {
                updateStatus(statusDiv, "⛔ Dibujo de campo detenido", "#B22222");
            }
            this.showBaseballFeedback('⛔ Baseball field drawing stopped', '#B22222');
        }

        /* ---------- BASEBALL PHYSICS ENGINE ---------- */
        toggleBaseballPhysics() {
            const toggleBtn = document.getElementById('toggle-baseball-physics');
            if (!this.isActive) {
                this.startBaseballPhysics();
                if (toggleBtn) {
                    toggleBtn.textContent = '🛑 Stop Baseball Engine';
                    toggleBtn.style.background = 'linear-gradient(135deg, #f56565, #e53e3e)';
                }
            } else {
                this.stopBaseballPhysics();
                if (toggleBtn) {
                    toggleBtn.textContent = '🚀 Launch Baseball Engine';
                    toggleBtn.style.background = 'linear-gradient(135deg, #87CEEB, #4682B4)';
                }
            }
        }

        startBaseballPhysics() {
            if (this.isActive) return;
            this.isActive = true;
            this.startBaseballGameLoop();
            this.showBaseballFeedback('🚀 MLB Baseball Engine Started!', '#87CEEB');
        }

        stopBaseballPhysics() {
            this.isActive = false;
            this.showBaseballFeedback('🛑 Baseball Engine Stopped', '#f56565');
        }

        startBaseballGameLoop() {
            if (!this.isActive) return;
            const currentTime = performance.now();
            if (currentTime - this.lastRenderTime >= this.renderInterval) {
                this.updateBaseballPhysics();
                this.renderBaseballs();
                this.lastRenderTime = currentTime;
            }
            requestAnimationFrame(() => this.startBaseballGameLoop());
        }

        updateBaseballPhysics() {
            const dt = BASEBALL_PHYSICS.TIMESTEP;

            // Apply wind effects based on conditions
            let windX = 0, windY = 0;
            switch(this.controls.windDirection) {
                case 'light':
                    windX = (Math.random() - 0.5) * 20;
                    windY = (Math.random() - 0.5) * 10;
                    break;
                case 'strong':
                    windX = (Math.random() - 0.5) * 60;
                    windY = (Math.random() - 0.5) * 30;
                    break;
                case 'tailwind':
                    windX = 0;
                    windY = -40; // Viento a favor para home runs
                    break;
                case 'headwind':
                    windX = 0;
                    windY = 20; // Viento en contra
                    break;
            }

            // Update baseballs[1][2]
            this.physicsObjects.forEach(ball => {
                if (ball.type !== 'baseball') return;

                // Apply air resistance
                ball.vx *= (1 - BASEBALL_PHYSICS.AIR_RESISTANCE * dt);
                ball.vy *= (1 - BASEBALL_PHYSICS.AIR_RESISTANCE * dt);

                // Apply gravity (más fuerte para trayectorias parabólicas realistas)
                ball.vy += BASEBALL_PHYSICS.GRAVITY * dt;

                // Apply wind effects
                if (windX !== 0 || windY !== 0) {
                    ball.vx += windX * BASEBALL_PHYSICS.WIND_EFFECT * dt;
                    ball.vy += windY * BASEBALL_PHYSICS.WIND_EFFECT * dt;
                }

                // Update position
                ball.x += ball.vx * dt;
                ball.y += ball.vy * dt;

                this.handleBaseballBoundaryCollisions(ball);

                // Velocity limiting
                const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
                if (speed > this.gameStats.maxVelocityReached) {
                    this.gameStats.maxVelocityReached = speed;
                }

                if (speed > BASEBALL_PHYSICS.MAX_VELOCITY) {
                    ball.vx = (ball.vx / speed) * BASEBALL_PHYSICS.MAX_VELOCITY;
                    ball.vy = (ball.vy / speed) * BASEBALL_PHYSICS.MAX_VELOCITY;
                }
            });

            this.handleBaseballCollisions();
            this.handleBaseballPlayerBatting();

            if (this.baseballGame.active) {
                this.checkBaseballScoring();
            }
        }

        updateWindConditions(windType) {
            this.controls.windDirection = windType;

            const windNames = {
                'none': 'No Wind',
                'light': 'Light Breeze',
                'strong': 'Strong Wind',
                'tailwind': 'Tailwind (Home Run Friendly)',
                'headwind': 'Headwind (Pitcher Friendly)'
            };

            document.getElementById('wind-info').textContent = windNames[windType] || 'Unknown';
        }

        /* ---------- BASEBALL CREATION ---------- */
        addRandomBaseball() {
            if (!this.canvasElement) return;

            const coords = calculateBaseballCoordinates();

            // Spawn cerca del pitcher's mound
            const x = coords.pitcherMound.x + (Math.random() - 0.5) * 60;
            const y = coords.pitcherMound.y + (Math.random() - 0.5) * 40;

            this.createBaseball(x, y);
        }

        pitchBaseball() {
            if (!this.canvasElement) return;

            const coords = calculateBaseballCoordinates();

            // Pitch desde el montículo hacia home plate
            const ball = this.createBaseball(coords.pitcherMound.x, coords.pitcherMound.y);

            // Aplicar fuerza de pitch hacia home plate
            const dx = coords.home.x - ball.x;
            const dy = coords.home.y - ball.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 0) {
                ball.vx = (dx / distance) * BASEBALL_PHYSICS.PITCH_FORCE;
                ball.vy = (dy / distance) * BASEBALL_PHYSICS.PITCH_FORCE;

                // Añadir variación de pitch
                ball.vx += (Math.random() - 0.5) * 100;
                ball.vy += (Math.random() - 0.5) * 50;
            }

            this.showBaseballFeedback('🥎 PITCH!', '#FFD700');
        }

        createBaseball(x, y) {
            const id = `baseball_${this.objectIdCounter++}`;
            const ball = {
                id: id,
                type: 'baseball',
                x: x, y: y, vx: 0, vy: 0,
                radius: BASEBALL_PHYSICS.BALL_RADIUS,
                color: BASEBALL_PHYSICS.BALL_COLOR,
                mass: BASEBALL_PHYSICS.BALL_MASS,
                restitution: BASEBALL_PHYSICS.RESTITUTION_BALL,
                friction: BASEBALL_PHYSICS.FRICTION_DIRT,
                lastRenderX: -9999, lastRenderY: -9999,
                creationTime: performance.now(),
                lastCollisionTime: 0,

                // Baseball specific properties
                spin: 0,
                lastBounceTime: 0,
                bounceCount: 0,
                lastBatHit: 0,
                isHomeRun: false,
                inPlay: true
            };

            this.physicsObjects.set(id, ball);
            this.gameStats.ballsCreated++;
            return ball;
        }

        /* ---------- BASEBALL COLLISION HANDLING ---------- */
        handleBaseballBoundaryCollisions(ball) {
            if (!this.canvasElement) return;

            const coords = calculateBaseballCoordinates();
            const ballHalfSize = ball.radius;

            // Límites del campo
            const boundaries = {
                left: 20 + ballHalfSize,
                right: this.canvasElement.width - 20 - ballHalfSize,
                top: 20 + ballHalfSize,
                bottom: this.canvasElement.height - 20 - ballHalfSize
            };

            // Colisiones con paredes del campo
            if (ball.x < boundaries.left || ball.x > boundaries.right) {
                ball.x = ball.x < boundaries.left ? boundaries.left : boundaries.right;
                ball.vx = -ball.vx * BASEBALL_PHYSICS.RESTITUTION_WALL;
                ball.vy *= 0.8;
            }

            if (ball.y < boundaries.top) {
                ball.y = boundaries.top;
                ball.vy = -ball.vy * BASEBALL_PHYSICS.RESTITUTION_WALL;
                ball.vx *= 0.9;
            } else if (ball.y > boundaries.bottom) {
                ball.y = boundaries.bottom;
                ball.vy = -ball.vy * ball.restitution;
                ball.vx *= ball.friction;

                // Determinar superficie (césped vs tierra)
                const isInInfield = this.checkIfInInfield(ball, coords);
                if (isInInfield) {
                    ball.friction = BASEBALL_PHYSICS.FRICTION_DIRT;
                    ball.restitution = BASEBALL_PHYSICS.RESTITUTION_BALL * 0.7; // Menos rebote en tierra
                } else {
                    ball.friction = BASEBALL_PHYSICS.FRICTION_GRASS;
                    ball.restitution = BASEBALL_PHYSICS.RESTITUTION_BALL; // Rebote normal en césped
                }

                ball.bounceCount++;
                ball.lastBounceTime = performance.now();
            }
        }

        checkIfInInfield(ball, coords) {
            // Verificar si la pelota está dentro del diamante de tierra
            const homeToSecond = Math.sqrt(Math.pow(coords.secondBase.x - coords.home.x, 2) + Math.pow(coords.secondBase.y - coords.home.y, 2));
            const ballToHome = Math.sqrt(Math.pow(ball.x - coords.home.x, 2) + Math.pow(ball.y - coords.home.y, 2));

            return ballToHome < homeToSecond * 1.2;
        }

        handleBaseballCollisions() {
            const ballsArray = Array.from(this.physicsObjects.values()).filter(obj => obj.type === 'baseball');

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

                        // Physics collision response
                        const relativeVelocityX = ballB.vx - ballA.vx;
                        const relativeVelocityY = ballB.vy - ballA.vy;
                        const velAlongNormal = relativeVelocityX * normalX + relativeVelocityY * normalY;

                        if (velAlongNormal > 0) continue;

                        const restitution = (ballA.restitution + ballB.restitution) * 0.5;
                        const impulse = -(1 + restitution) * velAlongNormal;
                        const impulseScalar = impulse / (ballA.mass + ballB.mass);

                        ballA.vx -= impulseScalar * ballB.mass * normalX;
                        ballA.vy -= impulseScalar * ballB.mass * normalY;
                        ballB.vx += impulseScalar * ballA.mass * normalX;
                        ballB.vy += impulseScalar * ballA.mass * normalY;
                    }
                }
            }
        }

        /* ---------- SISTEMA DE BATEO VIRTUAL ---------- */
        handleBaseballPlayerBatting() {
            const players = this.getBaseballPlayerPositions();
            if (players.length === 0) return;

            this.physicsObjects.forEach(ball => {
                if (ball.type !== 'baseball') return;

                players.forEach(player => {
                    const dx = ball.x - player.x;
                    const dy = ball.y - player.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const batReach = this.battingSystem.batLength;

                    if (distance < batReach && distance > 0) {
                        const currentTime = performance.now();

                        if (currentTime - ball.lastBatHit > this.battingSystem.swingCooldown) {
                            this.executeBaseballSwing(ball, player, dx, dy, distance);
                            ball.lastBatHit = currentTime;
                            this.gameStats.totalHits++;
                        }
                    }
                });
            });
        }

        executeBaseballSwing(ball, player, dx, dy, distance) {
            const normalX = dx / distance;
            const normalY = dy / distance;

            // Fuerza del swing basada en proximidad[3][4]
            const swingIntensity = Math.max(0.2, (this.battingSystem.batLength - distance) / this.battingSystem.batLength);
            const baseSwingForce = BASEBALL_PHYSICS.BAT_FORCE * swingIntensity;

            // Aplicar fuerza del bateo (trayectoria parabólica)
            const launchAngle = -Math.PI/6; // Ángulo de elevación típico de baseball
            const forceX = Math.cos(launchAngle) * baseSwingForce;
            const forceY = Math.sin(launchAngle) * baseSwingForce;

            ball.vx = normalX * forceX;
            ball.vy = normalY * forceY + forceY; // Combinar dirección + elevación

            // Añadir velocidad del jugador si se está moviendo
            if (player.vx || player.vy) {
                const playerSpeed = Math.sqrt((player.vx || 0) ** 2 + (player.vy || 0) ** 2);
                if (playerSpeed > 20) {
                    ball.vx += (player.vx || 0) * 1.2;
                    ball.vy += (player.vy || 0) * 0.8;
                }
            }

            // Generar spin en el bateo
            ball.spin = (Math.random() - 0.5) * 30 * swingIntensity;

            // Determinar tipo de hit
            const hitSpeed = Math.sqrt(ball.vx ** 2 + ball.vy ** 2);
            this.categorizeBaseballHit(ball, hitSpeed, swingIntensity);

            // Efecto visual del swing
            this.showBaseballSwingEffect(ball.x, ball.y, player.type, swingIntensity);
        }

        categorizeBaseballHit(ball, speed, intensity) {
            if (speed > 600 && intensity > 0.8) {
                ball.isHomeRun = true;
                this.showBaseballFeedback('🏆 HOME RUN!', '#FFD700');
            } else if (speed > 400) {
                this.showBaseballFeedback('💥 HARD HIT!', '#FF6347');
            } else if (speed > 200) {
                this.showBaseballFeedback('⚾ BASE HIT!', '#32CD32');
            } else {
                this.showBaseballFeedback('🏃 WEAK CONTACT', '#FFA500');
            }
        }

        showBaseballSwingEffect(x, y, playerType, intensity) {
            const hitColor = playerType === 'self' ? '#48bb78' : '#f56565';
            const intensityText = intensity > 0.7 ? 'POWER' : intensity > 0.4 ? 'GOOD' : 'WEAK';
            this.showBaseballFeedback(`⚾ ${playerType === 'self' ? 'YOUR' : 'OPPONENT'} ${intensityText} SWING!`, hitColor);
        }

        getBaseballPlayerPositions() {
            const currentTime = performance.now();
            const players = [];
            if (!drawariaCanvas) return players;

            const canvasRect = drawariaCanvas.getBoundingClientRect();

            // Self player
            const selfPlayer = document.querySelector('div.spawnedavatar.spawnedavatar-self');
            if (selfPlayer) {
                const rect = selfPlayer.getBoundingClientRect();
                const currentPos = {
                    type: 'self',
                    id: 'self',
                    x: rect.left - canvasRect.left + rect.width / 2,
                    y: rect.top - canvasRect.top + rect.height / 2,
                    radius: Math.max(rect.width, rect.height) / 2,
                    vx: 0,
                    vy: 0
                };

                players.push(currentPos);
            }

            // Other players
            const otherPlayers = document.querySelectorAll('div.spawnedavatar.spawnedavatar-otherplayer');
            otherPlayers.forEach((player, index) => {
                const rect = player.getBoundingClientRect();
                const currentPos = {
                    type: 'other',
                    id: `other_${index}`,
                    x: rect.left - canvasRect.left + rect.width / 2,
                    y: rect.top - canvasRect.top + rect.height / 2,
                    radius: Math.max(rect.width, rect.height) / 2,
                    vx: 0,
                    vy: 0
                };

                players.push(currentPos);
            });

            return players;
        }

        /* ---------- BASEBALL SCORING SYSTEM ---------- */
        checkBaseballScoring() {
            if (!this.baseballGame.active || !this.canvasElement) return;

            const coords = calculateBaseballCoordinates();

            this.physicsObjects.forEach(ball => {
                if (ball.type !== 'baseball' || !ball.inPlay) return;

                // Verificar home run (pelota sale del outfield)
                if (this.checkHomeRun(ball, coords)) {
                    this.scoreHomeRun(ball);
                    return;
                }

                // Verificar si la pelota aterrizó en territorio foul
                if (this.checkFoulBall(ball, coords)) {
                    this.handleFoulBall(ball);
                    return;
                }

                // Verificar out por fly ball
                if (ball.bounceCount === 0 && ball.vy > 0 && this.checkCatchablePosition(ball, coords)) {
                    this.handleCatch(ball);
                    return;
                }
            });
        }

        checkHomeRun(ball, coords) {
            const distanceFromHome = Math.sqrt(
                Math.pow(ball.x - coords.home.x, 2) +
                Math.pow(ball.y - coords.home.y, 2)
            );

            return distanceFromHome > BASEBALL_PHYSICS.HOME_RUN_DISTANCE && ball.vy > 0;
        }

        checkFoulBall(ball, coords) {
            // Verificar si está fuera de las líneas de foul
            const homeX = coords.home.x;
            const homeY = coords.home.y;

            // Lado izquierdo (línea de tercera base)
            const leftSlope = (coords.foulLines.leftEnd.y - homeY) / (coords.foulLines.leftEnd.x - homeX);
            const leftYAtBallX = homeY + leftSlope * (ball.x - homeX);

            // Lado derecho (línea de primera base)
            const rightSlope = (coords.foulLines.rightEnd.y - homeY) / (coords.foulLines.rightEnd.x - homeX);
            const rightYAtBallX = homeY + rightSlope * (ball.x - homeX);

            return ball.y < leftYAtBallX || ball.y < rightYAtBallX;
        }

        checkCatchablePosition(ball, coords) {
            // Verificar si está en posición de ser atrapada por un fielder
            return ball.y < coords.home.y - 100 && Math.abs(ball.vy) < 50;
        }

        async scoreHomeRun(ball) {
            ball.inPlay = false;
            this.gameStats.homeRuns++;

            // Añadir carrera
            if (this.baseballGame.topBottom === 'top') {
                this.baseballGame.runs.away++;
            } else {
                this.baseballGame.runs.home++;
            }

            await this.updateBaseballScore();
            this.showBaseballFeedback('🏆 HOME RUN! ⚾🏠', '#FFD700');

            setTimeout(() => {
                this.clearAllBaseballs(false);
                this.nextAtBat();
            }, 3000);
        }

        async handleFoulBall(ball) {
            ball.inPlay = false;
            this.baseballGame.strikes++;

            if (this.baseballGame.strikes >= BASEBALL_GAME.STRIKES_FOR_OUT) {
                this.gameStats.strikeouts++;
                this.handleStrikeout();
            } else {
                this.showBaseballFeedback(`❌ FOUL BALL! Strike ${this.baseballGame.strikes}`, '#FFA500');
            }

            await this.updateBaseballScore();

            setTimeout(() => {
                this.clearAllBaseballs(false);
                if (this.baseballGame.active) {
                    this.pitchBaseball();
                }
            }, 1500);
        }

        async handleCatch(ball) {
            ball.inPlay = false;
            this.baseballGame.outs++;

            this.showBaseballFeedback('🥎 CAUGHT! OUT!', '#f56565');

            if (this.baseballGame.outs >= BASEBALL_GAME.OUTS_PER_INNING) {
                this.nextInning();
            } else {
                this.nextAtBat();
            }

            await this.updateBaseballScore();
        }

        handleStrikeout() {
            this.baseballGame.outs++;
            this.showBaseballFeedback('⚾ STRIKEOUT! K!', '#f56565');

            if (this.baseballGame.outs >= BASEBALL_GAME.OUTS_PER_INNING) {
                this.nextInning();
            } else {
                this.nextAtBat();
            }
        }

        nextAtBat() {
            this.baseballGame.strikes = 0;
            this.baseballGame.balls = 0;

            setTimeout(() => {
                if (this.baseballGame.active) {
                    this.pitchBaseball();
                }
            }, 1000);
        }

        nextInning() {
            if (this.baseballGame.topBottom === 'top') {
                this.baseballGame.topBottom = 'bottom';
            } else {
                this.baseballGame.topBottom = 'top';
                this.baseballGame.inning++;
            }

            this.baseballGame.outs = 0;
            this.baseballGame.strikes = 0;
            this.baseballGame.balls = 0;

            this.showBaseballFeedback(`⚾ INNING ${this.baseballGame.inning} - ${this.baseballGame.topBottom.toUpperCase()}`, '#87CEEB');

            if (this.baseballGame.inning > BASEBALL_GAME.INNINGS) {
                this.endBaseballGame();
            } else {
                setTimeout(() => {
                    if (this.baseballGame.active) {
                        this.pitchBaseball();
                    }
                }, 2000);
            }
        }

        /* ---------- BASEBALL GAME MODE ---------- */
        toggleBaseballGame() {
            const button = document.getElementById('game-mode-toggle');
            const scoreboard = document.getElementById('baseball-scoreboard');

            this.baseballGame.active = !this.baseballGame.active;

            if (this.baseballGame.active) {
                button.style.background = 'linear-gradient(135deg, #FFD700, #FFA500)';
                button.setAttribute('data-active', 'true');
                scoreboard.style.display = 'block';
                this.setupBaseballGame();
                this.showBaseballFeedback('🏆 MLB GAME MODE ACTIVATED!', '#FFD700');
            } else {
                button.style.background = 'linear-gradient(135deg, #444, #666)';
                button.removeAttribute('data-active');
                scoreboard.style.display = 'none';
                this.resetBaseballGame();
                this.showBaseballFeedback('🏆 Game Mode Deactivated', '#666');
            }
        }

        async setupBaseballGame() {
            await drawCompleteBaseballField();
            this.resetBaseballGameScores();
            await this.updateBaseballScore();

            setTimeout(() => {
                this.pitchBaseball();
            }, 2000);
        }

        resetBaseballGameScores() {
            this.baseballGame = {
                active: true,
                inning: 1,
                topBottom: 'top',
                outs: 0,
                strikes: 0,
                balls: 0,
                runs: { home: 0, away: 0 },
                bases: { first: false, second: false, third: false }
            };
        }

        async updateBaseballScore() {
            document.getElementById('baseball-score-away').textContent = this.baseballGame.runs.away;
            document.getElementById('baseball-score-home').textContent = this.baseballGame.runs.home;
            document.getElementById('current-inning').textContent = this.baseballGame.inning;
            document.getElementById('inning-half').textContent = this.baseballGame.topBottom.charAt(0).toUpperCase() + this.baseballGame.topBottom.slice(1);
            document.getElementById('outs-count').textContent = this.baseballGame.outs;
            document.getElementById('balls-count').textContent = this.baseballGame.balls;
            document.getElementById('strikes-count').textContent = this.baseballGame.strikes;

            // Update base indicators
            document.getElementById('first-base').style.color = this.baseballGame.bases.first ? '#32CD32' : '#ccc';
            document.getElementById('second-base').style.color = this.baseballGame.bases.second ? '#32CD32' : '#ccc';
            document.getElementById('third-base').style.color = this.baseballGame.bases.third ? '#32CD32' : '#ccc';
        }

        resetBaseballGame() {
            this.resetBaseballGameScores();
            if (this.baseballGame.active) {
                this.clearAllBaseballs(false);
                setTimeout(() => {
                    drawCompleteBaseballField().then(() => {
                        this.pitchBaseball();
                    });
                }, 500);
            }
        }

        async endBaseballGame() {
            const winner = this.baseballGame.runs.home > this.baseballGame.runs.away ? 'HOME' : 'AWAY';
            const finalScore = `${this.baseballGame.runs.away}-${this.baseballGame.runs.home}`;

            this.showBaseballFeedback(`🏆 ${winner} TEAM WINS ${finalScore}!`, '#FFD700');

            setTimeout(() => {
                this.resetBaseballGame();
            }, 5000);
        }

        /* ---------- RENDERING ---------- */
        renderBaseballs() {
            this.physicsObjects.forEach(obj => {
                if (obj.type !== 'baseball') return;

                const dx = Math.abs(obj.x - obj.lastRenderX);
                const dy = Math.abs(obj.y - obj.lastRenderY);

                const needsServerRedraw = dx > MOVEMENT_THRESHOLD || dy > MOVEMENT_THRESHOLD;

                if (needsServerRedraw) {
                    // Borrar posición anterior
                    if (obj.lastRenderX !== -9999 || obj.lastRenderY !== -9999) {
                        this.drawBaseball(obj.lastRenderX, obj.lastRenderY, obj.radius, '#FFFFFF');
                    }

                    // Dibujar en nueva posición
                    this.drawBaseball(obj.x, obj.y, obj.radius, obj.color);

                    obj.lastRenderX = obj.x;
                    obj.lastRenderY = obj.y;
                }
            });
        }

        drawBaseball(x, y, radius, color) {
            const effectiveThickness = radius * 2.0; // Pelota pequeña de baseball
            enqueueDrawCommand(x, y, x + 0.1, y + 0.1, color, effectiveThickness);
        }

        /* ---------- UTILITY FUNCTIONS ---------- */
        clearAllBaseballs(showFeedback = true) {
            this.physicsObjects.clear();
            positionCache.clear();

            if (drawariaCtx && drawariaCanvas) {
                drawariaCtx.clearRect(0, 0, drawariaCanvas.width, drawariaCanvas.height);
            }
            if (showFeedback) {
                this.showBaseballFeedback('🗑️ ALL BASEBALLS CLEARED!', '#cc0000');
            }
        }

        resetAllBaseballs() {
            if (this.canvasElement) {
                const coords = calculateBaseballCoordinates();

                this.physicsObjects.forEach(obj => {
                    obj.x = coords.pitcherMound.x + (Math.random() - 0.5) * 50;
                    obj.y = coords.pitcherMound.y + (Math.random() - 0.5) * 30;
                    obj.vx = 0; obj.vy = 0; obj.spin = 0;
                    obj.lastRenderX = -9999; obj.lastRenderY = -9999;
                    obj.bounceCount = 0;
                    obj.inPlay = true;
                    obj.isHomeRun = false;
                });

                this.showBaseballFeedback('🔄 All baseballs reset to pitcher mound!', '#74b9ff');
            }
        }

        async cleanBaseballField() {
            if (!drawariaCanvas) return;

            this.showBaseballFeedback('🧹 Cleaning MLB Field...', '#e17055');

            const canvasWidth = drawariaCanvas.width;
            const canvasHeight = drawariaCanvas.height;

            for (let y = 0; y < canvasHeight; y += 70) {
                for (let x = 0; x < canvasWidth; x += 70) {
                    const width = Math.min(70, canvasWidth - x);
                    const height = Math.min(70, canvasHeight - y);
                    enqueueDrawCommand(x, y, x + width, y + height, '#FFFFFF', Math.max(width, height));
                    await sleep(2);
                }
            }

            if (drawariaCtx) {
                drawariaCtx.clearRect(0, 0, canvasWidth, canvasHeight);
            }

            this.showBaseballFeedback('🧹 MLB Field Cleaned!', '#00d084');
        }

        /* ---------- PANEL FUNCTIONALITY ---------- */
        makeBaseballPanelDraggable() {
            const panel = document.getElementById('baseball-physics-panel');
            const header = document.getElementById('baseball-panel-header');

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

        setupBaseballPanelButtons() {
            const minimizeBtn = document.getElementById('baseball-minimize-btn');
            const closeBtn = document.getElementById('baseball-close-btn');
            const content = document.getElementById('baseball-panel-content');
            const panel = document.getElementById('baseball-physics-panel');

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
                if (confirm('¿Cerrar el motor de baseball?')) {
                    if (this.isActive) this.stopBaseballPhysics();
                    isStopped = true;
                    panel.remove();
                    this.showBaseballFeedback('❌ Baseball Engine Closed', '#ff4757');
                }
            });
        }

        startBaseballStatsMonitoring() {
            setInterval(() => {
                document.getElementById('baseball-count').textContent = this.physicsObjects.size;
                document.getElementById('baseball-hits-count').textContent = this.gameStats.totalHits;
                document.getElementById('home-runs-count').textContent = this.gameStats.homeRuns;
                document.getElementById('strikeouts-count').textContent = this.gameStats.strikeouts;
                document.getElementById('baseball-max-speed').textContent = Math.round(this.gameStats.maxVelocityReached * 2.237); // Convert to mph
            }, 1000);
        }

        showBaseballFeedback(message, color) {
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
    let baseballEngine = null;

    const initBaseballEngine = () => {
        if (!baseballEngine) {
            console.log('⚾ Initializing MLB Baseball Physics Engine v1.0...');
            baseballEngine = new AdvancedDrawariaBaseball();

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
                    ⚾ MLB BASEBALL ENGINE v1.0 LOADED! ⚾<br>
                    <div style="font-size: 12px; margin-top: 10px; color: #E0FFE0;">
                        ✅ Professional MLB Diamond • Baseball Physics • Wind Effects<br>
                        ✅ Home Run Detection • Virtual Batting • Innings System<br>
                        ✅ Foul Ball Detection • Game Mode • Realistic Ball Physics
                    </div>
                `;

                document.body.appendChild(confirmMsg);
                setTimeout(() => confirmMsg.style.opacity = '1', 10);
                setTimeout(() => confirmMsg.style.opacity = '0', 4000);
                setTimeout(() => confirmMsg.remove(), 4300);
            }, 1000);
        }
    };

    // Enhanced CSS for Baseball styling
    const baseballStyle = document.createElement('style');
    baseballStyle.textContent = `
        @keyframes baseball-pitch {
            0% { transform: scale(0) rotate(0deg); opacity: 1; }
            50% { transform: scale(1.1) rotate(90deg); opacity: 0.9; }
            100% { transform: scale(0) rotate(180deg); opacity: 0; }
        }

        @keyframes diamond-glow {
            0% { box-shadow: 0 0 15px rgba(34, 139, 34, 0.3); }
            50% { box-shadow: 0 0 25px rgba(135, 206, 235, 0.6); }
            100% { box-shadow: 0 0 15px rgba(34, 139, 34, 0.3); }
        }

        .baseball-mode-toggle[data-active="true"] {
            animation: diamond-glow 2s infinite;
        }

        #baseball-physics-panel {
            transition: none !important;
        }

        #baseball-panel-header:hover {
            background: linear-gradient(45deg, #228B22, #32CD32) !important;
        }

        /* Baseball specific styling */
        .mlb-diamond {
            background: linear-gradient(45deg, #228B22, #DEB887);
        }

        .baseball-spinning {
            animation: baseball-rotation 0.6s linear infinite;
        }

        @keyframes baseball-rotation {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        /* Home run animation */
        @keyframes home-run-flight {
            0% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-30px) scale(1.3); }
            100% { transform: translateY(0) scale(1); }
        }

        .home-run-ball {
            animation: home-run-flight 2s ease-out;
        }

        /* Wind effect visualization */
        @keyframes wind-effect {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(5px); }
        }

        .wind-active {
            animation: wind-effect 1.5s infinite ease-in-out;
        }

        /* Status div baseball styling */
        #baseball-status {
            font-family: 'Arial Black', Arial, sans-serif !important;
            animation: diamond-glow 3s infinite;
        }

        /* Baseball color scheme */
        .baseball-green { color: #228B22; }
        .baseball-blue { color: #87CEEB; }
        .baseball-white { color: #FFFFFF; }
        .baseball-dirt { color: #DEB887; }
        .baseball-brown { color: #8B4513; }

        /* Baseball field animations */
        @keyframes field-draw {
            0% { opacity: 0.3; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.1); }
            100% { opacity: 0.9; transform: scale(1); }
        }

        #baseball-status {
            animation: field-draw 2.5s ease-in-out infinite;
        }
    `;
    document.head.appendChild(baseballStyle);

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBaseballEngine);
    } else {
        initBaseballEngine();
    }
    setTimeout(initBaseballEngine, 2000);

    console.log('⚾ Advanced MLB Baseball Physics Engine v1.0 loaded successfully! ⚾');
    console.log('🏟️ Features: Professional MLB Diamond • Baseball Physics • Wind Effects • Home Run Detection');
    console.log('🏆 Ready for MLB-style baseball games in Drawaria!');

})();
