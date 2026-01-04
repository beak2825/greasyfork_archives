// ==UserScript==
// @name Drawaria JSAB Bosses Drawings Collection
// @namespace http://tampermonkey.net/
// @version 7.2
// @description Draw every boss of JSAB with details and instantly
// @author       YouTubeDrawaria
// @include	 https://drawaria.online/*
// @include	 https://*.drawaria.online/*
// @include      https://drawaria.online*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online/room/
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552189/Drawaria%20JSAB%20Bosses%20Drawings%20Collection.user.js
// @updateURL https://update.greasyfork.org/scripts/552189/Drawaria%20JSAB%20Bosses%20Drawings%20Collection.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const canvas = document.getElementById('canvas');
    const ctx = canvas?.getContext('2d');
    let socket;

    // === CONSTANTES DE DISEÑO GENERALES Y COMPARTIDAS ===
    const corruptionColor = '#FF008C'; // Magenta Brillante
    const darkCorruptionColor = '#B3005D'; // Magenta Oscuro
    const innerColor = '#000000';      // Negro Puro
    const highlightColor = '#FFFFFF';   // Blanco (para ojos de Fresh/LltNF)

    // Parámetros de lienzo base
    const centerX_Factor = 0.5;
    const centerY_Factor = 0.6;
    const radiusFactor = 0.35; // Radio base relativo a la altura del canvas
    const outlineThickness = 12;

    let isDrawing = false;
    let isStopped = false;

    // === UTILITIES Y HOOKS (COMPARTIDOS) ===

    const originalSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (...args) {
        if (!socket) socket = this;
        return originalSend.apply(this, args);
    };

    function getCanvasSize() {
        return { width: canvas.width, height: canvas.height };
    }

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    // Función central que envía el comando de dibujo al servidor Y DIBUJA LOCALMENTE
    function sendDrawCommand(x1, y1, x2, y2, color, thickness) {
        if (isStopped || !socket || !canvas || !ctx) return;

        // 1. DIBUJO LOCAL (Instantáneo en tu pantalla)
        ctx.strokeStyle = color;
        ctx.lineWidth = thickness;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // 2. ENVÍO AL SERVIDOR (Normalizar coordenadas a valores 0-1)
        const normX1 = (clamp(x1, -100, canvas.width + 100) / canvas.width).toFixed(4);
        const normY1 = (clamp(y1, 0, canvas.height) / canvas.height).toFixed(4);
        const normX2 = (clamp(x2, -100, canvas.width + 100) / canvas.width).toFixed(4);
        const normY2 = (clamp(y2, 0, canvas.height) / canvas.height).toFixed(4);

        // thickness se envía como negativo para indicar grosor
        const command = `42["drawcmd",0,[${normX1},${normY1},${normX2},${normY2},false,${0 - thickness},"${color}",0,0,{}]]`;
        socket.send(command);
    }

    // Dibuja una línea simple (SÍNCRONO)
    function drawLine(startX, startY, endX, endY, color, thickness) {
        sendDrawCommand(startX, startY, endX, endY, color, thickness);
    }

    // Dibuja un triángulo sólido (relleno) usando tres líneas gruesas (SÍNCRONO)
    function drawSolidTriangle(p1, p2, p3, color, baseThickness) {
        // Usar un grosor grande para asegurar que se rellene
        const t = baseThickness * 3;
        drawLine(p1.x, p1.y, p2.x, p2.y, color, t);
        drawLine(p2.x, p2.y, p3.x, p3.y, color, t);
        drawLine(p3.x, p3.y, p1.x, p1.y, color, t);
    }

    // Dibuja un círculo sólido (relleno) usando la técnica de scanline (SÍNCRONO)
    function drawSolidCircle(centerX, centerY, radius, color, lineDensity = 5) {
        const lineThickness = lineDensity * 2;
        const squaredRadius = Math.pow(radius, 2);
        for (let y = centerY - radius; y <= centerY + radius; y += lineDensity) {
            if (isStopped) return;
            const dy = y - centerY;
            const squaredDY = Math.pow(dy, 2);
            if (squaredRadius < squaredDY) continue;

            const dx = Math.sqrt(squaredRadius - squaredDY);
            const startX = centerX - dx;
            const endX = centerX + dx;

            if (endX > startX) {
                drawLine(startX, y, endX, y, color, lineThickness);
            }
        }
    }

    // Dibuja el contorno circular (SÍNCRONO)
    function drawCircularOutline(coords, thickness, color) {
        if (isStopped) return;
        const { centerX, centerY, radius } = coords;
        const numSegments = 60;
        let prevX = 0, prevY = 0;

        for (let i = 0; i <= numSegments; i++) {
            if (isStopped) break;
            const angle = (i / numSegments) * 2 * Math.PI;
            const currentX = centerX + radius * Math.cos(angle);
            const currentY = centerY + radius * Math.sin(angle);

            if (i > 0) {
                drawLine(prevX, prevY, currentX, currentY, color, thickness);
            }
            prevX = currentX;
            prevY = currentY;
        }
    }

    // === FUNCIONES DE COORDENADAS BASE ===
    function calculateBaseCoordinates() {
        const size = getCanvasSize();
        const radius = Math.floor(size.height * radiusFactor);
        const centerX = Math.floor(size.width * centerX_Factor);
        const centerY = Math.floor(size.height * centerY_Factor);
        return { centerX, centerY, radius, size };
    }


    // =================================================================
    // === V6.1 ORIGINAL (EL JEFE DE CEÑO Y COLMILLOS - MANTENIDO INTACTO)
    // =================================================================

    function calculateSmartCoordinates_V61() {
        const size = getCanvasSize();
        const radius = Math.floor(size.height * radiusFactor);
        const centerX = Math.floor(size.width * centerX_Factor);
        const centerY = Math.floor(size.height * centerY_Factor);

        // Ajuste: Aumento el grosor del contorno magenta de cuernos.
        const HORN_OUTLINE_THICKNESS = 10;

        // AJUSTE: Grosor base para los colmillos rellenos (se multiplica por 3 en drawSolidTriangle)
        const FANG_BASE_THICKNESS = 8;

        // AJUSTE CLAVE: Mover el ceño un número fijo de píxeles hacia arriba (positivo = arriba)
        const BROW_TOP_ADJUSTMENT = -40;

        return {
            centerX,
            centerY,
            radius,

            // Cuernos
            hornBaseY: centerY - radius + Math.floor(radius * 0.05),
            hornTipY: centerY - radius - Math.floor(radius * 0.08),
            hornWidth: Math.floor(radius * 0.08),
            hornSpacing: Math.floor(radius * 0.70),
            hornOutlineThickness: HORN_OUTLINE_THICKNESS,

            // Ceño (¡Posición MUCHO más alta, V normal!)
            browCenterRadius: Math.floor(radius * 0.09),

            // Base (Lados de la 'V'). Factor ajustado para posición alta.
            browBaseY: centerY - Math.floor(radius * 0.55),

            // Punta (Centro de la 'V'). Factor más alto que la base para la forma de 'V' normal,
            // más el AJUSTE que lo sube aún más.
            browTipY: centerY - Math.floor(radius * 0.65) - BROW_TOP_ADJUSTMENT,

            browWidth: Math.floor(radius * 0.25),

            // Colmillos (AJUSTE: HACIÉNDOLOS MÁS PEQUEÑOS)
            fangY: centerY + Math.floor(radius * 0.45), // Un poco más abajo
            fangHeight: Math.floor(radius * 0.07),    // Más cortos (antes 0.15)
            fangSpacing: Math.floor(radius * 0.25),   // Más juntos (antes 0.30)
            fangWidth: Math.floor(radius * 0.05),     // Más delgados (antes 0.10)
            fangBaseThickness: FANG_BASE_THICKNESS, // Grosor base para relleno
        };
    }

    function drawBossDetails_V61(coords) {
        if (isStopped) return;
        const { centerX, hornTipY, hornBaseY, hornWidth, hornSpacing, hornOutlineThickness, browCenterRadius, browTipY, browBaseY, browWidth, fangY, fangHeight, fangSpacing, fangWidth, fangBaseThickness } = coords;
        const detailThickness = 10;

        // FASE 3A: CUERNOS (RELLENO NEGRO Y CONTORNO MAGENTA V6.1)
        const hornDraw = (sign) => {
            const hl_p1 = { x: centerX + sign * hornSpacing / 2, y: hornBaseY };
            const hl_p2 = { x: centerX + sign * (hornSpacing / 2 + hornWidth), y: hornBaseY };
            const hl_p3 = { x: centerX + sign * (hornSpacing / 2 + (hornWidth / 2)), y: hornTipY };
            drawSolidTriangle(hl_p1, hl_p2, hl_p3, innerColor, detailThickness);
            drawSolidTriangle(hl_p1, hl_p2, hl_p3, corruptionColor, hornOutlineThickness);
        };
        hornDraw(-1); hornDraw(1);

        // FASE 3B: CEÑO AGRESIVO (V6.1)
        drawSolidCircle(centerX, browBaseY + 40, browCenterRadius, corruptionColor, 3); // Nariz
        const aggressiveThickness = detailThickness * 1.5;
        drawLine(centerX - browWidth / 2, browBaseY, centerX, browTipY, corruptionColor, aggressiveThickness);
        drawLine(centerX + browWidth / 2, browBaseY, centerX, browTipY, corruptionColor, aggressiveThickness);

        // FASE 3C: COLMILLOS INFERIORES (AJUSTADOS Y RELLENOS)
        const fangDraw = (sign) => {
            const fl_p1 = { x: centerX + sign * fangSpacing / 2, y: fangY };
            const fl_p2 = { x: centerX + sign * (fangSpacing / 2 - sign * fangWidth), y: fangY };
            const fl_p3 = { x: centerX + sign * (fangSpacing / 2 - sign * (fangWidth / 2)), y: fangY + fangHeight };
            drawSolidTriangle(fl_p1, fl_p2, fl_p3, corruptionColor, fangBaseThickness);
        };
        fangDraw(-1); fangDraw(1);
    }

    // FUNCIÓN PRINCIPAL V6.1
    function drawJSABBoss_V61() {
        if (isDrawing) { alert('Ya está en curso un dibujo. Presiona "Parar" para cancelar.'); return; }
        if (!socket || !canvas || !ctx) { alert('No se detectó conexión o canvas. Asegúrate de estar en una sala de juego.'); return; }

        isDrawing = true;
        isStopped = false;
        const statusDiv = document.getElementById('boss-status') || createStatusDiv('boss-status');

        try {
            updateStatus(statusDiv, `🚀 JEFE JSAB: Iniciando Corrupción V6.1 (Instantáneo)...`, corruptionColor);
            const coords = calculateSmartCoordinates_V61();

            // 1. RELLENO INTERIOR NEGRO SÓLIDO
            const innerRadius = coords.radius - Math.floor(outlineThickness / 2);
            drawSolidCircle(coords.centerX, coords.centerY, innerRadius, innerColor, 5);
            updateStatus(statusDiv, "⚫ FASE 1: Relleno Negro Completo...", innerColor);

            // 2. CONTORNO CIRCULAR MAGENTA
            drawCircularOutline(coords, outlineThickness, corruptionColor);
            updateStatus(statusDiv, "⭕ FASE 2: Contorno de Corrupción Magenta...", corruptionColor);

            // 3. DETALLES FACIALES SÓLIDOS Y PRECISOS (V6.1)
            drawBossDetails_V61(coords);
            updateStatus(statusDiv, "👁️ FASE 3: Dibujando detalles precisos (V6.1)...", corruptionColor);

            updateStatus(statusDiv, "🏆 ¡JEFE JSAB DIBUJADO AL INSTANTE! 🎯", "#006400", true);
            setTimeout(() => { if (statusDiv.parentNode) { statusDiv.style.opacity = 0; setTimeout(() => statusDiv.remove(), 500); } }, 3000);

        } catch (error) {
            console.error("Error al dibujar jefe JSAB V6.1:", error);
            updateStatus(statusDiv, `❌ Error: ${error.message}`, "#B22222", true);
        } finally {
            isDrawing = false;
        }
    }


    // =================================================================
    // === V7.1 NUEVOS JEFES (GEOMETRÍA DE ALTA PRECISIÓN)
    // =================================================================

    // BOSS A: Long Live The New Fresh (LltNF) / The Corrupted - (IMAGEN 1 - Ojos y Sonrisa Rayada)
    function drawLltNF_Image1(coords) {
        const { centerX, centerY, radius: R } = coords;

        // --- CÁLCULO DE COORDENADAS ESPECÍFICAS ---
        const HORN_TIP_Y = centerY - R - Math.floor(R * 0.08);
        const HORN_BASE_Y = centerY - R + Math.floor(R * 0.05);
        const HORN_WIDTH = Math.floor(R * 0.08);
        const HORN_SPACING = Math.floor(R * 0.70);
        const HORN_OUTLINE_T = 10;
        const DETAIL_T = 10;
        const L_EYE_R = Math.floor(R * 0.16); // Ojo Izquierdo Grande
        const R_EYE_R = Math.floor(R * 0.09); // Ojo Derecho Pequeño
        const EYE_BASE_Y = centerY - Math.floor(R * 0.15);
        const L_EYE_X = centerX - Math.floor(R * 0.22);
        const R_EYE_X = centerX + Math.floor(R * 0.25);
        const MOUTH_W = Math.floor(R * 0.55); // Ancho de la sonrisa
        const MOUTH_Y = centerY + Math.floor(R * 0.22); // Centro de la boca
        const MOUTH_STRIPES = 12;

        // 1. Círculo Base (Relleno Negro y Contorno Magenta)
        drawSolidCircle(centerX, centerY, R - Math.floor(outlineThickness / 2), innerColor);
        drawCircularOutline(coords, outlineThickness, corruptionColor);

        // 2. Cuernos (Triángulos Rellenos de Negro con Borde Magenta)
        const hornDraw = (sign) => {
            const h_p1 = { x: centerX + sign * HORN_SPACING / 2, y: HORN_BASE_Y };
            const h_p2 = { x: centerX + sign * (HORN_SPACING / 2 + HORN_WIDTH), y: HORN_BASE_Y };
            const h_p3 = { x: centerX + sign * (HORN_SPACING / 2 + (HORN_WIDTH / 2)), y: HORN_TIP_Y };
            drawSolidTriangle(h_p1, h_p2, h_p3, innerColor, DETAIL_T);
            drawSolidTriangle(h_p1, h_p2, h_p3, corruptionColor, HORN_OUTLINE_T);
        };
        hornDraw(-1); hornDraw(1);

        // 3. Ojos Desproporcionados
        drawSolidCircle(L_EYE_X, EYE_BASE_Y, L_EYE_R, highlightColor, 3);
        drawSolidCircle(R_EYE_X, EYE_BASE_Y, R_EYE_R, highlightColor, 3);

        // 4. Sonrisa Rayada (Magenta)
        const stripeThickness = Math.floor((MOUTH_W / MOUTH_STRIPES) * 0.5);
        const stripeSpacing = MOUTH_W / MOUTH_STRIPES;
        const mouthR = Math.floor(R * 0.45); // Radio para la curva de la boca

        for (let i = 0; i < MOUTH_STRIPES; i++) {
            const x = centerX - MOUTH_W / 2 + i * stripeSpacing + stripeSpacing / 2;
            const dx = x - centerX;

            // Usamos la curva del círculo para determinar el punto final de la línea
            const dyFromCenter = Math.sqrt(Math.pow(mouthR, 2) - Math.pow(dx, 2));
            const endY = centerY + Math.floor(R * 0.3) + dyFromCenter; // Ajuste la posición Y para que la boca esté en la parte inferior

            const startY = centerY + Math.floor(R * 0.05); // Comienza por debajo del centro del círculo

            drawLine(x, startY, x, endY, corruptionColor, stripeThickness);
        }
    }


    // BOSS B: Barracuda (El Triángulo)
    function drawBarracuda(coords) {
        const { centerX, centerY, radius } = coords;
        const R = radius * 1.2;
        const H = R * 1.732 / 2;

        // Puntos del triángulo centralizado
        const p_top = { x: centerX, y: centerY - H * 0.6 };
        const p_bl = { x: centerX - R / 2, y: centerY + H * 0.4 };
        const p_br = { x: centerX + R / 2, y: centerY + H * 0.4 };

        // 1. Capa Externa Oscura (Relleno grueso)
        drawSolidTriangle(p_top, p_bl, p_br, darkCorruptionColor, 15);

        // 2. Capa Interna Brillante (Triángulo más pequeño)
        const innerFactor = 0.8;
        const i_top = { x: centerX, y: p_top.y * innerFactor + centerY * (1 - innerFactor) };
        const i_bl = { x: centerX - (R / 2) * innerFactor, y: p_bl.y * innerFactor + centerY * (1 - innerFactor) };
        const i_br = { x: centerX + (R / 2) * innerFactor, y: p_br.y * innerFactor + centerY * (1 - innerFactor) };
        drawSolidTriangle(i_top, i_bl, i_br, corruptionColor, 15);

        // 3. Núcleo Central (Anillo y Punto)
        const core_R_out = Math.floor(radius * 0.1);
        const core_R_in = Math.floor(radius * 0.05);
        drawSolidCircle(centerX, centerY, core_R_out, innerColor, 3);
        drawSolidCircle(centerX, centerY, core_R_in, corruptionColor, 3);
    }


    // BOSS C: Close To Me (Urchin/Spiky Blob)
    function drawCloseToMe(coords) {
        const { centerX, centerY, radius } = coords;
        const R = radius * 0.6;
        const NUM_SPIKES = 14;
        const SPIKE_LENGTH = Math.floor(R * 0.3);

        // 1. Cuerpo Principal (Círculo Sólido Magenta)
        drawSolidCircle(centerX, centerY, R, corruptionColor, 5);

        // 2. Spikes (Triángulos Alrededor)
        for (let i = 0; i < NUM_SPIKES; i++) {
            if (isStopped) break;
            const angle = (i / NUM_SPIKES) * 2 * Math.PI;
            const p1 = { x: centerX + R * Math.cos(angle - 0.1), y: centerY + R * Math.sin(angle - 0.1) };
            const p2 = { x: centerX + R * Math.cos(angle + 0.1), y: centerY + R * Math.sin(angle + 0.1) };
            const tipX = centerX + (R + SPIKE_LENGTH) * Math.cos(angle);
            const tipY = centerY + (R + SPIKE_LENGTH) * Math.sin(angle);
            const p3 = { x: tipX, y: tipY };
            drawSolidTriangle(p1, p2, p3, corruptionColor, 8);
        }

        // 3. Ojos y Boca (Relleno Negro)
        const browH = Math.floor(R * 0.08);
        const browW = Math.floor(R * 0.2);
        const browY = centerY - Math.floor(R * 0.3);
        const browX = Math.floor(R * 0.2);
        drawLine(centerX - browX, browY, centerX - browX + browW, browY + browH, innerColor, 10);
        drawLine(centerX + browX, browY, centerX + browX - browW, browY + browH, innerColor, 10);

        const MOUTH_W = Math.floor(R * 0.3);
        const MOUTH_Y = centerY + Math.floor(R * 0.1);
        drawLine(centerX - MOUTH_W / 2, MOUTH_Y, centerX + MOUTH_W / 2, MOUTH_Y, innerColor, 10);
    }


    // BOSS D: Annihilate (Fresh con Corona)
    function drawAnnihilate(coords) {
        // 1. Dibuja el cuerpo base de LltNF (el de la Imagen 1)
        drawLltNF_Image1(coords);

        // 2. Dibujar la Corona
        const { centerX, centerY, radius: R } = coords;
        const CROWN_BASE_Y = centerY - R - Math.floor(R * 0.05);
        const CROWN_HEIGHT = Math.floor(R * 0.3);
        const CROWN_POINTS = 5;
        const CROWN_WIDTH = Math.floor(R * 1.2);
        const BASE_T = 15;

        // Base de la Corona (Rectángulo grueso)
        drawLine(centerX - CROWN_WIDTH / 2, CROWN_BASE_Y, centerX + CROWN_WIDTH / 2, CROWN_BASE_Y, corruptionColor, BASE_T);

        // Picos de la Corona (Triángulos)
        for (let i = 0; i < CROWN_POINTS; i++) {
            const startX = centerX - CROWN_WIDTH / 2 + (i * CROWN_WIDTH / (CROWN_POINTS - 1));
            const p1 = { x: startX - Math.floor(R * 0.05), y: CROWN_BASE_Y - BASE_T / 2 };
            const p2 = { x: startX + Math.floor(R * 0.05), y: CROWN_BASE_Y - BASE_T / 2 };
            const p3 = { x: startX, y: CROWN_BASE_Y - CROWN_HEIGHT };
            drawSolidTriangle(p1, p2, p3, corruptionColor, 8);
        }

        // 3. Pequeño Triángulo Lateral
        const sideT_R = Math.floor(R * 0.1);
        const t1 = { x: centerX - R - sideT_R, y: centerY - Math.floor(R * 0.2) };
        const t2 = { x: centerX - R, y: centerY - Math.floor(R * 0.2) + sideT_R / 2 };
        const t3 = { x: centerX - R, y: centerY - Math.floor(R * 0.2) - sideT_R / 2 };
        drawSolidTriangle(t1, t2, t3, corruptionColor, 8);
    }


    // BOSS E: Final Boss (The Crown Only)
    function drawFinalBossCrown(coords) {
        const { centerX, centerY, radius: R } = coords;

        const CROWN_BASE_Y = centerY + Math.floor(R * 0.2);
        const CROWN_HEIGHT = Math.floor(R * 0.4);
        const CROWN_POINTS = 5;
        const CROWN_WIDTH = Math.floor(R * 1.5);
        const BASE_T = 20;

        // Base de la Corona (Rectángulo grueso)
        drawLine(centerX - CROWN_WIDTH / 2, CROWN_BASE_Y, centerX + CROWN_WIDTH / 2, CROWN_BASE_Y, corruptionColor, BASE_T);

        // Picos de la Corona (Triángulos)
        for (let i = 0; i < CROWN_POINTS; i++) {
            const startX = centerX - CROWN_WIDTH / 2 + (i * CROWN_WIDTH / (CROWN_POINTS - 1));
            const p1 = { x: startX - Math.floor(R * 0.05), y: CROWN_BASE_Y - BASE_T / 2 };
            const p2 = { x: startX + Math.floor(R * 0.05), y: CROWN_BASE_Y - BASE_T / 2 };
            const p3 = { x: startX, y: CROWN_BASE_Y - CROWN_HEIGHT };
            drawSolidTriangle(p1, p2, p3, corruptionColor, 8);
        }

        // Triángulo superior invertido (El ojo central de la corrupción)
        const triR = Math.floor(R * 0.3);
        const tr1 = { x: centerX, y: CROWN_BASE_Y - CROWN_HEIGHT - triR * 0.2 };
        const tr2 = { x: centerX - triR / 2, y: CROWN_BASE_Y - CROWN_HEIGHT + triR };
        const tr3 = { x: centerX + triR / 2, y: CROWN_BASE_Y - CROWN_HEIGHT + triR };
        drawSolidTriangle(tr1, tr2, tr3, corruptionColor, 10);
    }


    // BOSS F: Lycanthropy (Polígono Angular)
    function drawLycanthropy(coords) {
        const { centerX, centerY, radius } = coords;
        const R = radius * 1.1;
        const NUM_SIDES = 8;
        const FACE_OFFSET = Math.floor(R * 0.15);
        const EYE_W = Math.floor(R * 0.2);

        // 1. Cuerpo Principal (Octágono Angular Relleno)
        const points = [];
        for (let i = 0; i < NUM_SIDES; i++) {
            const angle = (i / NUM_SIDES) * 2 * Math.PI;
            const x = centerX + R * Math.cos(angle);
            const y = centerY + R * Math.sin(angle);
            points.push({ x, y });
        }
        for (let i = 0; i < NUM_SIDES; i++) {
            drawLine(points[i].x, points[i].y, points[(i + 1) % NUM_SIDES].x, points[(i + 1) % NUM_SIDES].y, darkCorruptionColor, R * 0.5);
        }

        // 2. Dientes/Boca (Magenta)
        const MOUTH_W = Math.floor(R * 0.6);
        const MOUTH_Y = centerY + Math.floor(R * 0.2) + FACE_OFFSET;
        const NUM_TEETH = 8;
        const toothSpacing = MOUTH_W / NUM_TEETH;

        for (let i = 0; i < NUM_TEETH; i++) {
            const x = centerX - MOUTH_W / 2 + i * toothSpacing + toothSpacing / 2;
            const y_base = MOUTH_Y;
            const y_tip = MOUTH_Y + Math.floor(R * 0.25);
            const d1 = { x: x - toothSpacing * 0.3, y: y_base };
            const d2 = { x: x + toothSpacing * 0.3, y: y_base };
            const d3 = { x: x, y: y_tip };
            drawSolidTriangle(d1, d2, d3, corruptionColor, 6);
            const u1 = { x: x - toothSpacing * 0.3, y: y_base - Math.floor(R * 0.3) };
            const u2 = { x: x + toothSpacing * 0.3, y: y_base - Math.floor(R * 0.3) };
            const u3 = { x: x, y: y_base - Math.floor(R * 0.5) };
            drawSolidTriangle(u1, u2, u3, corruptionColor, 6);
        }
        const tongue_r = { x: centerX, y: MOUTH_Y + Math.floor(R * 0.3) };
        const tongue_l = { x: centerX - MOUTH_W * 0.4, y: MOUTH_Y - Math.floor(R * 0.1) };
        const tongue_rgt = { x: centerX + MOUTH_W * 0.4, y: MOUTH_Y - Math.floor(R * 0.1) };
        drawSolidTriangle(tongue_r, tongue_l, tongue_rgt, darkCorruptionColor, 8);


        // 3. Ojos (Blancos, Triangulares)
        const eyeY = centerY - Math.floor(R * 0.4) + FACE_OFFSET;
        const eyeDraw = (sign) => {
            const e1 = { x: centerX + sign * EYE_W, y: eyeY };
            const e2 = { x: centerX + sign * EYE_W * 0.2, y: eyeY - EYE_W * 0.4 };
            const e3 = { x: centerX + sign * EYE_W * 0.2, y: eyeY + EYE_W * 0.4 };
            drawSolidTriangle(e1, e2, e3, highlightColor, 8);
        };
        eyeDraw(-1); eyeDraw(1);
    }


    // BOSS G: Spider Dance (Araña)
    function drawSpiderDance(coords) {
        const { centerX, centerY, radius } = coords;
        const R = radius * 1.1;
        const NUM_LEGS = 8;
        const LEG_LENGTH = R * 1.5;
        const LEG_WIDTH = Math.floor(R * 0.08);

        // 1. Cuerpo Principal (Círculo Sólido Magenta)
        drawSolidCircle(centerX, centerY, R, corruptionColor, 5);

        // 2. Patas (8 Angulares)
        for (let i = 0; i < NUM_LEGS; i++) {
            if (isStopped) break;
            const angle = (i / NUM_LEGS) * 2 * Math.PI;

            const p1 = { x: centerX + R * Math.cos(angle), y: centerY + R * Math.sin(angle) };
            const elbowFactor = 0.5;
            const elbowX = centerX + (R + LEG_LENGTH * elbowFactor) * Math.cos(angle - Math.PI / 16);
            const elbowY = centerY + (R + LEG_LENGTH * elbowFactor) * Math.sin(angle - Math.PI / 16);
            const p2 = { x: elbowX, y: elbowY };
            const tipX = centerX + (R + LEG_LENGTH) * Math.cos(angle - Math.PI / 8);
            const tipY = centerY + (R + LEG_LENGTH) * Math.sin(angle - Math.PI / 8);
            const p3 = { x: tipX, y: tipY };

            drawLine(p1.x, p1.y, p2.x, p2.y, corruptionColor, LEG_WIDTH);
            drawLine(p2.x, p2.y, p3.x, p3.y, corruptionColor, LEG_WIDTH);
        }

        // 3. Ojos (Pequeños Triángulos Agresivos)
        const EYE_H = Math.floor(R * 0.15);
        const EYE_Y = centerY - Math.floor(R * 0.2);
        const EYE_SPACING = Math.floor(R * 0.2);
        const eyeDraw = (sign) => {
            const e1 = { x: centerX + sign * EYE_SPACING, y: EYE_Y };
            const e2 = { x: centerX + sign * (EYE_SPACING + EYE_H), y: EYE_Y - EYE_H };
            const e3 = { x: centerX + sign * (EYE_SPACING + EYE_H), y: EYE_Y + EYE_H };
            drawSolidTriangle(e1, e2, e3, innerColor, 8);
        };
        eyeDraw(-1); eyeDraw(1);

        // 4. Pequeños Triángulos Inferiores (Boca)
        const MOUTH_Y = centerY + Math.floor(R * 0.2);
        const MOUTH_SPACING = Math.floor(R * 0.1);
        const MOUTH_H = Math.floor(R * 0.1);
        const mouthDraw = (sign) => {
            const m1 = { x: centerX + sign * MOUTH_SPACING, y: MOUTH_Y };
            const m2 = { x: centerX + sign * (MOUTH_SPACING + MOUTH_H), y: MOUTH_Y + MOUTH_H };
            const m3 = { x: centerX + sign * (MOUTH_SPACING - MOUTH_H), y: MOUTH_Y + MOUTH_H };
            drawSolidTriangle(m1, m2, m3, innerColor, 8);
        };
        mouthDraw(-1); mouthDraw(1);
    }


    // === MAPA DE JEFES Y FUNCIÓN PRINCIPAL PARA EL SELECTOR ===

    const BOSS_FUNCTIONS = {
        'New Game': drawLltNF_Image1,
        'Annihilate': drawAnnihilate,
        'Barracuda': drawBarracuda,
        'Close To Me': drawCloseToMe,
    };

    function drawSelectedBoss() {
        const bossSelect = document.getElementById('boss-select');
        const selectedBoss = bossSelect?.value;

        if (!selectedBoss || !BOSS_FUNCTIONS[selectedBoss]) {
            alert('Por favor, selecciona un jefe válido.');
            return;
        }

        if (isDrawing) { alert('Ya está en curso un dibujo. Presiona "Parar" para cancelar.'); return; }
        if (!socket || !canvas || !ctx) { alert('No se detectó conexión o canvas. Asegúrate de estar en una sala de juego.'); return; }

        isDrawing = true;
        isStopped = false;
        const statusDiv = document.getElementById('boss-status') || createStatusDiv('boss-status');

        try {
            updateStatus(statusDiv, `🚀 JEFE JSAB: Iniciando ${selectedBoss} (Instantáneo)...`, corruptionColor);
            const coords = calculateBaseCoordinates();

            BOSS_FUNCTIONS[selectedBoss](coords);

            updateStatus(statusDiv, `🏆 ¡JEFE ${selectedBoss} DIBUJADO AL INSTANTE! 🎯`, "#006400", true);
            setTimeout(() => { if (statusDiv.parentNode) { statusDiv.style.opacity = 0; setTimeout(() => statusDiv.remove(), 500); } }, 3000);

        } catch (error) {
            console.error(`Error al dibujar jefe JSAB (${selectedBoss}):`, error);
            updateStatus(statusDiv, `❌ Error: ${error.message}`, "#B22222", true);
        } finally {
            isDrawing = false;
        }
    }


    // === UI Y STATUS (CONSOLIDADO) ===

    function createConsolidatedUI() {
        const uiContainer = document.createElement('div');
        uiContainer.id = 'minimal-boss-ui';
        uiContainer.style.cssText = `
            position: fixed;
            bottom: 15px;
            left: 15px;
            background: linear-gradient(135deg, ${corruptionColor} 0%, #B3005D 100%);
            border: 3px solid #000;
            border-radius: 15px;
            padding: 22px;
            z-index: 9999;
            box-shadow: 0 12px 35px rgba(0,0,0,0.5);
            display: none;
            max-width: 300px;
            color: white;
            font-family: Arial, sans-serif;
        `;

        const toggleButton = document.createElement('button');
        toggleButton.innerText = '😈';
        toggleButton.style.cssText = `
            position: fixed;
            bottom: 15px;
            left: 15px;
            width: 58px;
            height: 58px;
            background: linear-gradient(135deg, ${corruptionColor} 0%, #B3005D 100%);
            border: 3px solid #000;
            border-radius: 15px;
            font-size: 28px;
            cursor: pointer;
            z-index: 9998;
            box-shadow: 0 10px 25px rgba(0,0,0,0.4);
            transition: all 0.3s;
            animation: glow-boss 3s infinite;
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes glow-boss {
                0%, 100% { box-shadow: 0 10px 25px rgba(0,0,0,0.4); }
                50% { box-shadow: 0 10px 35px rgba(255,0,140,0.8); }
            }
            .boss-select {
                padding: 10px;
                border-radius: 8px;
                border: 2px solid #000;
                width: 100%;
                margin-bottom: 15px;
                font-size: 14px;
                background-color: white;
                color: #333;
            }
        `;
        document.head.appendChild(style);

        const selectOptions = Object.keys(BOSS_FUNCTIONS).map(boss =>
            `<option value="${boss}">${boss}</option>`
        ).join('');

        uiContainer.innerHTML = `
            <div style="margin-bottom: 22px; font-weight: bold; text-align: center; font-size: 19px; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
                😈 JSAB BOSS COLLECTION (V7.1) 😈
            </div>

            <!-- Botón V6.1 original -->
            <button id="draw-boss-btn-v61" style="
                background: linear-gradient(45deg, #FF69B4, #E91E63);
                color: white;
                border: none;
                border-radius: 15px;
                padding: 15px;
                width: 100%;
                font-weight: bold;
                cursor: pointer;
                margin-bottom: 20px;
                font-size: 15px;
                box-shadow: 0 6px 18px rgba(255,105,180,0.4);
                text-shadow: 1px 1px 3px rgba(0,0,0,0.4);
                transition: all 0.2s;
            " onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">Long Live The New Fresh</button>

            <div style="border-top: 1px solid #FF008C; padding-top: 20px; margin-top: 10px;">
                <label for="boss-select" style="display:block; margin-bottom: 5px; font-weight: bold;">SELECCIONAR JEFE DETALLADO:</label>
                <select id="boss-select" class="boss-select">
                    ${selectOptions}
                </select>

                <button id="draw-selected-boss-btn" style="
                    background: linear-gradient(45deg, ${corruptionColor}, #B3005D);
                    color: white;
                    border: none;
                    border-radius: 15px;
                    padding: 15px;
                    width: 100%;
                    font-weight: bold;
                    cursor: pointer;
                    margin-bottom: 15px;
                    font-size: 17px;
                    box-shadow: 0 6px 18px rgba(255,0,140,0.4);
                    text-shadow: 1px 1px 3px rgba(0,0,0,0.4);
                    transition: all 0.2s;
                " onmouseover="this.style.transform='scale(1.04)'" onmouseout="this.style.transform='scale(1)'">🚀 INICIAR DIBUJO INSTANTÁNEO</button>
            </div>

            <button id="stop-btn" style="
                background: linear-gradient(45deg, #f44336, #da190b);
                color: white;
                border: none;
                border-radius: 10px;
                padding: 10px;
                width: 100%;
                cursor: pointer;
                font-size: 13px;
                margin-top: 10px;
            ">❌ Parar Todos los Dibujos</button>
        `;

        document.body.appendChild(uiContainer);
        document.body.appendChild(toggleButton);

        toggleButton.addEventListener('click', () => {
            const ui = document.getElementById('minimal-boss-ui');
            const isVisible = ui.style.display === 'block';
            ui.style.display = isVisible ? 'none' : 'block';
        });

        document.getElementById('draw-boss-btn-v61').addEventListener('click', drawJSABBoss_V61);
        document.getElementById('draw-selected-boss-btn').addEventListener('click', drawSelectedBoss);

        document.getElementById('stop-btn').addEventListener('click', () => {
            isStopped = true;
            const statusDiv = document.getElementById('boss-status');
            if (statusDiv) {
                updateStatus(statusDiv, "⛔ Dibujo detenido", "#B22222", true);
            }
        });
    }

    function createStatusDiv(id) {
        const statusDiv = document.createElement('div');
        statusDiv.id = id;
        statusDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #787878 0%, #505050 100%);
            color: white;
            padding: 20px 40px;
            border-radius: 35px;
            font-weight: bold;
            z-index: 10000;
            transition: opacity 0.5s;
            text-align: center;
            min-width: 450px;
            box-shadow: 0 12px 30px rgba(0,0,0,0.5);
            text-shadow: 1px 1px 3px rgba(0,0,0,0.4);
        `;
        document.body.appendChild(statusDiv);
        return statusDiv;
    }

    function updateStatus(statusDiv, message, color, permanent = false) {
        if (!statusDiv) return;
        statusDiv.textContent = message;
        if (color) {
            statusDiv.style.background = `linear-gradient(135deg, ${color} 0%, #333 100%)`;
        }
        statusDiv.style.opacity = 1;
    }

    // Inicialización
    function init() {
        if (canvas && ctx) {
            createConsolidatedUI();
            console.log('😈 JSAB Boss Script V7.1 Cargado: Colección completa con V6.1 intacto.');
        } else {
            setTimeout(init, 1000);
        }
    }

    init();

})();