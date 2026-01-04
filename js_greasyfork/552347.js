// ==UserScript==
// @name         Super Drawaria Smash - Rest Area
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Rest Area de Super Drawaria Smash, asegurando la carga en toda la pantalla.
// @author       YouTubeDrawaria
// @match	     https://drawaria.online/*
// @include	     https://drawaria.online
// @include      https://*.drawaria.online/*
// @icon         https://m.media-amazon.com/images/I/51P8Uyw+6UL._UF894,1000_QL80_.jpg
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/552347/Super%20Drawaria%20Smash%20-%20Rest%20Area.user.js
// @updateURL https://update.greasyfork.org/scripts/552347/Super%20Drawaria%20Smash%20-%20Rest%20Area.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ----------------------------------------------------
    // PASO 1: Inyección de CSS (Fundamental para la superposición)
    // ----------------------------------------------------
    function injectCSS() {
        const style = document.createElement('style');
        style.textContent = `
            /* Los estilos originales */
            body { margin: 0; overflow: hidden !important; background-color: #000000 !important; }
            #game-canvas {
                display: block;
                position: fixed;
                top: 0;
                left: 0;
                /* Z-INDEX EXTREMADAMENTE ALTO: Asegura que el canvas cubra cualquier contenido */
                z-index: 2147483647;
            }
            audio { display: none; }
        `;
        document.head.appendChild(style);

        // Inyectar el favicon
        const link = document.createElement('link');
        link.rel = 'icon';
        link.href = 'https://m.media-amazon.com/images/I/51P8Uyw+6UL._UF894,1000_QL80_.jpg';
        link.type = 'image/x-icon';
        document.head.appendChild(link);
    }

    // ----------------------------------------------------
    // PASO 2: Inyección de HTML (Canvas y Audios)
    // ----------------------------------------------------
    function injectHTML() {
        // Crear Canvas
        const canvas = document.createElement('canvas');
        canvas.id = 'game-canvas';
        document.body.appendChild(canvas);

        // Definiciones de Audio (Extraídas del HTML original)
        const audioData = [
            { id: 'menu-music', src: '', loop: true },
            { id: 'select-music', src: 'https://www.myinstants.com/media/sounds/drawaria-legends-select.mp3', loop: true },
            { id: 'mario-music', src: 'https://www.myinstants.com/media/sounds/super-mario-bros_8nlGIsH.mp3', loop: true },
            { id: 'kirby-music', src: 'https://www.myinstants.com/media/sounds/scaralie-intro.mp3', loop: true },
            { id: 'metroid-music', src: 'https://www.myinstants.com/media/sounds/noods-boss-2.mp3', loop: true },
            { id: 'zelda-music', src: 'https://www.myinstants.com/media/sounds/noods-boss-5.mp3', loop: true },
            { id: 'sonic-music', src: 'https://www.myinstants.com/media/sounds/noods-boss-8.mp3', loop: true },
            { id: 'pokemon-music', src: 'https://www.myinstants.com/media/sounds/noods-boss-3.mp3', loop: true },
            { id: 'drawaria-music', src: 'https://www.myinstants.com/media/sounds/scaralie.mp3', loop: true },
            { id: 'hit-sfx', src: 'https://www.myinstants.com/media/sounds/selection.mp3' },
            { id: 'ko-sfx', src: 'https://www.myinstants.com/media/sounds/wilhelm.mp3' },
            { id: 'bg-music', src: 'https://www.myinstants.com/media/sounds/rest-area-melee.mp3', loop: true }
        ];

        audioData.forEach(data => {
            const audio = document.createElement('audio');
            audio.id = data.id;
            audio.src = data.src;
            if (data.loop) audio.loop = true;
            document.body.appendChild(audio);
        });
    }

    // ----------------------------------------------------
    // PASO 3: Inyección del Código JavaScript del Juego
    // ----------------------------------------------------
    function injectGameScript() {
        /*
         * Se usa una función autoejecutable (IIFE) para aislar el código,
         * pero se ejecuta en el ámbito de la ventana (window) para que el canvas y los audios
         * sean accesibles por ID.
         */
        const scriptContent = `
            // =====================================================================
            // CONFIGURACIÓN GLOBAL Y CONSTANTES DE FÍSICA
            // (TODO EL CÓDIGO JS EXTRAÍDO DEL FICHERO ORIGINAL)
            // =====================================================================
            const CONFIG = {
                WIDTH: 0,
                HEIGHT: 0,
                TIME: 0,
                SCALE: 1.0,
                STATE: 'REST_AREA', // <--- INICIAMOS DIRECTAMENTE EN EL REST AREA
                GRAVITY: 9.8,
                MAX_FALL_SPEED: 25,
                FIGHTER_SPEED: 8,
                JUMP_VELOCITY: 15,
                KNOCKBACK_FACTOR: 0.15,
                MAX_STOCK: 3,
                STAGE_FADE_DURATION: 3,
                NPC_MODE: 'RANDOM',
                SELECTED_FIGHTERS: [null, null],
                FIGHTER_LIST: [],
                STAGE_ID: 'MARIO_STAGE',
                FADE_TIMER: 0,

                // --- PROPIEDADES PARA REST AREA ---
                ACTIVE_FIGHTER_DATA: null,
                REST_AREA_TIMER: 21.38, // 00:21 38 como en la imagen
                // ----------------------------------
            };

            // =====================================================================
            // CLASES DE PERSONAJES (ADAPTADAS Y MAXIMIZADAS)
            // =====================================================================

            // --- Extracción y adaptación de Personaje de Mario Articulado 2D.txt ---
            class MarioArticulado {
                constructor(ctx) {
                    this.ctx = ctx;
                    this.pose = {
                        torsoAngle: 0, armL: { x: -40, y: -80, angle: 0 }, forearmL: { x: 0, y: 30, angle: -0.2 }, handL: { x: 0, y: 25, angle: 0 },
                        armR: { x: 40, y: -80, angle: 0.1 }, forearmR: { x: 0, y: 30, angle: 0.3 }, handR: { x: 0, y: 25, angle: 0 },
                        thighL: { x: -20, y: 5, angle: 0.1 }, shinL: { x: 0, y: 40, angle: -0.1 }, footL: { x: 0, y: 40, angle: 0 },
                        thighR: { x: 20, y: 5, angle: -0.1 }, shinR: { x: 0, y: 40, angle: 0.1 }, footR: { x: 0, y: 40, angle: 0 },
                    };
                }
                _adjustColor(hex, lum) { hex = hex.replace(/[^0-9a-f]/gi, ''); if (hex.length < 6) { hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]; } let rgb = "#", c, i; for (i = 0; i < 3; i++) { c = parseInt(hex.substr(i * 2, 2), 16); c = Math.round(Math.min(255, Math.max(0, c + lum))).toString(16); while (c.length < 2) c = "0" + c; rgb += c; } return rgb; }
                _drawShadedRect(colorBase, x, y, w, h, radius = 0) { const ctx = this.ctx; const bodyGrad = ctx.createLinearGradient(x - w / 2, y, x + w / 2, y); bodyGrad.addColorStop(0.0, this._adjustColor(colorBase, -40)); bodyGrad.addColorStop(0.4, colorBase); bodyGrad.addColorStop(0.6, colorBase); bodyGrad.addColorStop(1.0, this._adjustColor(colorBase, 20)); ctx.fillStyle = bodyGrad; if (radius > 0) { ctx.beginPath(); ctx.moveTo(x - w / 2 + radius, y - h / 2); ctx.lineTo(x + w / 2 - radius, y - h / 2); ctx.quadraticCurveTo(x + w / 2, y - h / 2, x + w / 2, y - h / 2 + radius); ctx.lineTo(x + w / 2, y + h / 2 - radius); ctx.quadraticCurveTo(x + w / 2, y + h / 2, x + w / 2 - radius, y + h / 2); ctx.lineTo(x - w / 2 + radius, y + h / 2); ctx.quadraticCurveTo(x - w / 2, y + h / 2, x - w / 2, y + h / 2 - radius); ctx.lineTo(x - w / 2, y - h / 2 + radius); ctx.quadraticCurveTo(x - w / 2, y - h / 2, x - w / 2 + radius, y - h / 2); ctx.closePath(); ctx.fill(); } else { ctx.fillRect(x - w / 2, y - h / 2, w, h); } }
                _drawHead(ctx) { const faceColor = '#FFDBA5'; const hatRed = '#FF0000'; ctx.save(); ctx.fillStyle = faceColor; ctx.beginPath(); ctx.arc(-22, 0, 8, 0, Math.PI * 2); ctx.arc(22, 0, 8, 0, Math.PI * 2); ctx.fill(); this._drawShadedRect(faceColor, 0, 0, 40, 50, 25); ctx.fillStyle = 'white'; ctx.beginPath(); ctx.ellipse(-10, -5, 8, 10, 0, 0, Math.PI * 2); ctx.ellipse(10, -5, 8, 10, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#1E90FF'; ctx.beginPath(); ctx.arc(-10, -5, 4, 0, Math.PI * 2); ctx.arc(10, -5, 4, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = 'black'; ctx.beginPath(); ctx.arc(-10, -5, 2, 0, Math.PI * 2); ctx.arc(10, -5, 2, 0, Math.PI * 2); ctx.fill(); this._drawShadedRect(faceColor, 0, 5, 12, 10, 5); ctx.fillStyle = '#654321'; ctx.beginPath(); ctx.moveTo(-25, 15); ctx.bezierCurveTo(-15, 25, 15, 25, 25, 15); ctx.lineTo(25, 20); ctx.bezierCurveTo(15, 30, -15, 30, -25, 20); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#654321'; ctx.beginPath(); ctx.arc(-15, -15, 10, 0, Math.PI * 2); ctx.arc(15, -15, 10, 0, Math.PI * 2); ctx.fill(); this._drawShadedRect(hatRed, 0, -35, 60, 30, 15); ctx.fillStyle = this._adjustColor(hatRed, -10); ctx.beginPath(); ctx.ellipse(5, -25, 40, 20, 0, 0, Math.PI, true); ctx.fill(); ctx.fillStyle = 'white'; ctx.beginPath(); ctx.arc(0, -35, 15, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = hatRed; ctx.font = 'bold 25px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('M', 0, -35); ctx.restore(); }
                _drawTorso(ctx) { const shirtRed = '#FF0000'; const overallsBlue = '#1E90FF'; ctx.save(); this._drawShadedRect(shirtRed, 0, -40, 80, 50, 10); this._drawShadedRect(overallsBlue, 0, 0, 90, 80, 15); ctx.lineWidth = 10; ctx.strokeStyle = this._adjustColor(overallsBlue, -20); ctx.beginPath(); ctx.moveTo(-35, -20); ctx.lineTo(-20, -60); ctx.moveTo(35, -20); ctx.lineTo(20, -60); ctx.stroke(); ctx.fillStyle = '#FFD700'; ctx.beginPath(); ctx.arc(-20, -15, 8, 0, Math.PI * 2); ctx.arc(20, -15, 8, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; ctx.beginPath(); ctx.ellipse(0, 0, 30, 15, 0, 0, Math.PI, false); ctx.fill(); ctx.restore(); }
                _drawLimb(ctx, isArm, w, h, angle) { const color = isArm ? '#FF0000' : '#1E90FF'; ctx.save(); ctx.rotate(angle); this._drawShadedRect(color, 0, h / 2, w, h, w / 4); ctx.restore(); }
                _drawHand(ctx) { const gloveWhite = '#FFFFFF'; ctx.save(); this._drawShadedRect(gloveWhite, 0, 0, 30, 25, 10); ctx.fillStyle = this._adjustColor(gloveWhite, -30); ctx.beginPath(); ctx.arc(10, -5, 5, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
                _drawFoot(ctx) { const shoeBrown = '#8B4513'; ctx.save(); this._drawShadedRect(shoeBrown, 0, 0, 20, 40, 10); ctx.fillStyle = '#654321'; ctx.fillRect(-15, 15, 30, 10); ctx.fillStyle = shoeBrown; ctx.beginPath(); ctx.ellipse(0, 0, 15, 20, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
                _drawLimbSet(joint1, joint2, joint3, isFront, isArm) { const ctx = this.ctx; const limbW = isArm ? 20 : 35; const limbH1 = isArm ? 30 : 40; const limbH2 = isArm ? 25 : 40; ctx.save(); ctx.translate(joint1.x, joint1.y); this._drawLimb(ctx, isArm, limbW, limbH1, joint1.angle); ctx.translate(Math.sin(joint1.angle) * limbH1, Math.cos(joint1.angle) * limbH1); this._drawLimb(ctx, isArm, limbW * 0.9, limbH2, joint2.angle); ctx.translate(Math.sin(joint2.angle) * limbH2, Math.cos(joint2.angle) * limbH2); if (isArm) { this._drawHand(ctx); } else { this._drawFoot(ctx); } ctx.restore(); }
                draw(ctx) { ctx.save(); ctx.rotate(this.pose.torsoAngle); this._drawLimbSet(this.pose.thighL, this.pose.shinL, this.pose.footL, true, false); this._drawLimbSet(this.pose.thighR, this.pose.shinR, this.pose.footR, false, false); this._drawLimbSet(this.pose.armL, this.pose.forearmL, this.pose.handL, false, true); ctx.save(); this._drawTorso(ctx); ctx.translate(0, -100); this._drawHead(ctx); ctx.restore(); this._drawLimbSet(this.pose.armR, this.pose.forearmR, this.pose.handR, true, true); ctx.restore(); }
            }

            // --- Extracción y adaptación de personaje-de-kirby-articulado-2d.txt ---
            class KirbyArticulado {
                constructor(ctx) { this.ctx = ctx; this.pose = { bodyAngle: 0, armL: { x: -60, y: -20, angle: 0.2 }, armR: { x: 60, y: -20, angle: -0.2 }, footL: { x: -25, y: 70, angle: 0.1 }, footR: { x: 25, y: 70, angle: -0.1 }, }; }
                _adjustColor(hex, lum) { hex = hex.replace(/[^0-9a-f]/gi, ''); if (hex.length < 6) { hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]; } let rgb = "#", c, i; for (i = 0; i < 3; i++) { c = parseInt(hex.substr(i * 2, 2), 16); c = Math.round(Math.min(255, Math.max(0, c + lum))).toString(16); while (c.length < 2) c = "0" + c; rgb += c; } return rgb; }
                _drawShadedSphere(colorBase, rx, ry) { const ctx = this.ctx; const grad = ctx.createRadialGradient(-rx * 0.3, -ry * 0.3, rx * 0.1, 0, 0, Math.max(rx, ry)); grad.addColorStop(0.0, this._adjustColor(colorBase, 40)); grad.addColorStop(0.5, colorBase); grad.addColorStop(1.0, this._adjustColor(colorBase, -40)); ctx.fillStyle = grad; ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2); ctx.fill(); }
                _drawBody(ctx) { const pink = '#FFC0CB'; const blushPink = '#FFB6C1'; ctx.save(); ctx.rotate(this.pose.bodyAngle); this._drawShadedSphere(pink, 80, 80, true); ctx.fillStyle = blushPink; ctx.beginPath(); ctx.ellipse(-35, 10, 15, 10, -0.2, 0, Math.PI * 2); ctx.ellipse(35, 10, 15, 10, 0.2, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = 'white'; ctx.beginPath(); ctx.ellipse(-20, -20, 12, 20, 0, 0, Math.PI * 2); ctx.ellipse(20, -20, 12, 20, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#00008B'; ctx.beginPath(); ctx.ellipse(-20, -15, 8, 12, 0, 0, Math.PI * 2); ctx.ellipse(20, -15, 8, 12, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = 'black'; ctx.beginPath(); ctx.arc(-20, -10, 4, 0, Math.PI * 2); ctx.arc(20, -10, 4, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = 'white'; ctx.beginPath(); ctx.arc(-25, -25, 3, 0, Math.PI * 2); ctx.arc(15, -25, 3, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#654321'; ctx.beginPath(); ctx.ellipse(0, 25, 8, 5, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
                _drawArm(ctx, angle) { const pink = '#FFC0CB'; const armRX = 30; const armRY = 20; ctx.save(); ctx.rotate(angle); this._drawShadedSphere(pink, armRX, armRY); ctx.restore(); }
                _drawFoot(ctx, angle) { const red = '#FF0000'; const footRX = 40; const footRY = 30; ctx.save(); ctx.rotate(angle); this._drawShadedSphere(red, footRX, footRY); ctx.restore(); }
                draw(ctx) { this._drawBody(ctx); ctx.save(); ctx.translate(this.pose.armL.x, this.pose.armL.y); this._drawArm(ctx, this.pose.armL.angle); ctx.restore(); ctx.save(); ctx.translate(this.pose.armR.x, this.pose.armR.y); this._drawArm(ctx, this.pose.armR.angle); ctx.restore(); ctx.save(); ctx.translate(this.pose.footL.x, this.pose.footL.y); this._drawFoot(ctx, this.pose.footL.angle); ctx.restore(); ctx.save(); ctx.translate(this.pose.footR.x, this.pose.footR.y); this._drawFoot(ctx, this.pose.footR.angle); ctx.restore(); }
            }

            // --- Extracción y adaptación de pikachu-articulated-2d-character-detalle-mximo-html-canvas.html ---
            class PikachuArticulado {
                constructor(ctx) { this.ctx = ctx; this.pose = { torsoAngle: 0, headAngle: 0, armL: { x: -35, y: -20, angle: 0.1 }, armR: { x: 35, y: -20, angle: -0.1 }, thighL: { x: -20, y: 80, angle: 0.1 }, thighR: { x: 20, y: 80, angle: -0.1 }, earL: { x: -25, y: -80, angle: -0.2 }, earR: { x: 25, y: -80, angle: 0.2 }, }; }
                _adjustColor(hex, lum) { hex = hex.replace(/[^0-9a-f]/gi, ''); if (hex.length < 6) { hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]; } let rgb = "#", c, i; for (i = 0; i < 3; i++) { c = parseInt(hex.substr(i * 2, 2), 16); c = Math.round(Math.min(255, Math.max(0, c + lum))).toString(16); while (c.length < 2) c = "0" + c; rgb += c; } return rgb; }
                _drawShadedShape(colorBase, w, h, radius, lightDirection = 'vertical') { const ctx = this.ctx; let grad; if (lightDirection === 'vertical') { grad = ctx.createLinearGradient(0, -h / 2, 0, h / 2); grad.addColorStop(0.0, this._adjustColor(colorBase, 20)); grad.addColorStop(0.5, colorBase); grad.addColorStop(1.0, this._adjustColor(colorBase, -30)); } else { grad = ctx.createLinearGradient(-w / 2, 0, w / 2, 0); grad.addColorStop(0.0, this._adjustColor(colorBase, -20)); grad.addColorStop(0.5, colorBase); grad.addColorStop(1.0, this._adjustColor(colorBase, 15)); } ctx.fillStyle = grad; ctx.beginPath(); ctx.moveTo(-w / 2 + radius, -h / 2); ctx.lineTo(w / 2 - radius, -h / 2); ctx.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + radius); ctx.lineTo(w / 2, h / 2 - radius); ctx.quadraticCurveTo(w / 2, h / 2, w / 2 - radius, h / 2); ctx.lineTo(-w / 2 + radius, h / 2); ctx.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - radius); ctx.lineTo(-w / 2, -h / 2 + radius); ctx.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + radius, -h / 2); ctx.closePath(); ctx.fill(); }
                _drawBody(ctx) { const yellow = '#FFD700'; ctx.save(); const bodyW = 100; const bodyH = 150; this._drawShadedShape(yellow, bodyW, bodyH, 50, 'vertical'); ctx.save(); ctx.translate(0, bodyH / 2 - 20); ctx.rotate(Math.sin(CONFIG.TIME * 1.5) * 0.1); this._drawTail(ctx); ctx.restore(); ctx.restore(); }
                _drawHeadDetails(ctx) { const redCheeks = '#DC143C'; ctx.save(); ctx.rotate(this.pose.headAngle); ctx.translate(-35, 10); this._drawShadedShape(redCheeks, 30, 30, 15, 'vertical'); ctx.translate(70, 0); this._drawShadedShape(redCheeks, 30, 30, 15, 'vertical'); ctx.translate(-35, -10); ctx.fillStyle = '#654321'; ctx.beginPath(); ctx.arc(-15, -20, 10, 0, Math.PI * 2); ctx.arc(15, -20, 10, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = 'black'; ctx.beginPath(); ctx.arc(-15, -20, 4, 0, Math.PI * 2); ctx.arc(15, -20, 4, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = 'white'; ctx.beginPath(); ctx.arc(-18, -23, 2, 0, Math.PI * 2); ctx.arc(12, -23, 2, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = 'black'; ctx.beginPath(); ctx.arc(0, -5, 5, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#FF69B4'; ctx.beginPath(); ctx.arc(0, 5, 8, 0, Math.PI); ctx.fill(); ctx.restore(); }
                _drawEar(ctx, angle) { const yellow = '#FFD700'; const tipBlack = 'black'; const earW = 25; const earH = 80; ctx.save(); ctx.rotate(angle); ctx.translate(0, -earH / 2); this._drawShadedShape(yellow, earW, earH, 10, 'vertical'); ctx.fillStyle = tipBlack; ctx.beginPath(); ctx.moveTo(-earW / 2, -earH / 2); ctx.lineTo(earW / 2, -earH / 2); ctx.lineTo(0, -earH); ctx.closePath(); ctx.fill(); ctx.restore(); }
                _drawArm(ctx, angle) { const yellow = '#FFD700'; const armW = 25; const armH = 60; ctx.save(); ctx.rotate(angle); this._drawShadedShape(yellow, armW, armH, 10, 'horizontal'); ctx.translate(0, armH / 2); ctx.rotate(0.1); this._drawShadedShape(yellow, armW * 1.2, 15, 7); ctx.restore(); }
                _drawLeg(ctx, angle) { const yellow = '#FFD700'; const legW = 30; const legH = 40; ctx.save(); ctx.rotate(angle); ctx.translate(0, legH / 2); this._drawShadedShape(yellow, legW, legH, 15, 'horizontal'); ctx.translate(0, legH / 2); ctx.rotate(-0.1); this._drawShapedFoot(ctx, legW * 1.3, 10); ctx.restore(); }
                _drawShapedFoot(ctx, w, h) { const yellow = '#FFD700'; const toeBlack = '#654321'; ctx.save(); this._drawShadedShape(yellow, w, h, h / 2); ctx.fillStyle = toeBlack; ctx.beginPath(); ctx.arc(-w * 0.3, 0, 3, 0, Math.PI * 2); ctx.arc(0, 0, 3, 0, Math.PI * 2); ctx.arc(w * 0.3, 0, 3, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
                _drawTail(ctx) { const yellow = '#FFD700'; const brown = '#8B4513'; const segments = 4; const segmentSize = 25; ctx.save(); ctx.fillStyle = brown; ctx.fillRect(-15, 0, 30, 10); ctx.translate(0, 10); for(let i=0; i<segments; i++) { ctx.rotate(Math.sin(CONFIG.TIME * 5 + i * 2) * 0.05); this._drawShadedShape(yellow, segmentSize, segmentSize, 5); ctx.translate(segmentSize * 0.1, segmentSize); } ctx.fillStyle = yellow; ctx.beginPath(); ctx.moveTo(-segmentSize, 0); ctx.lineTo(segmentSize, 0); ctx.lineTo(segmentSize * 0.5, segmentSize * 0.5); ctx.lineTo(0, 0); ctx.lineTo(-segmentSize * 0.5, segmentSize * 0.5); ctx.closePath(); ctx.fill(); ctx.restore(); }
                draw(ctx) { ctx.save(); ctx.translate(this.pose.armL.x, this.pose.armL.y); this._drawArm(ctx, this.pose.armL.angle); ctx.restore(); ctx.save(); ctx.translate(this.pose.armR.x, this.pose.armR.y); this._drawArm(ctx, this.pose.armR.angle); ctx.restore(); ctx.save(); ctx.translate(this.pose.thighL.x, this.pose.thighL.y); this._drawLeg(ctx, this.pose.thighL.angle); ctx.restore(); ctx.save(); ctx.translate(this.pose.thighR.x, this.pose.thighR.y); this._drawLeg(ctx, this.pose.thighR.angle); ctx.restore(); this._drawBody(ctx); ctx.save(); ctx.translate(this.pose.earL.x, this.pose.earL.y); this._drawEar(ctx, this.pose.earL.angle); ctx.restore(); ctx.save(); ctx.translate(this.pose.earR.x, this.pose.earR.y); this._drawEar(ctx, this.pose.earR.angle); ctx.restore(); ctx.translate(0, -30); this._drawHeadDetails(ctx); }
            }

            // --- Extracción y adaptación de personaje-de-link-articulado-2d-detalle-mximo.html ---
            class LinkArticulado {
                constructor(ctx) { this.ctx = ctx; this.pose = { torsoAngle: 0, armL: { x: -30, y: -70, angle: 0.1 }, forearmL: { x: 0, y: 35, angle: 0.3 }, handL: { x: 0, y: 30, angle: 0 }, armR: { x: 30, y: -70, angle: -0.1 }, forearmR: { x: 0, y: 35, angle: -0.3 }, handR: { x: 0, y: 30, angle: 0 }, thighL: { x: -15, y: 15, angle: -0.05 }, shinL: { x: 0, y: 45, angle: 0.1 }, footL: { x: 0, y: 45, angle: 0 }, thighR: { x: 15, y: 15, angle: 0.05 }, shinR: { x: 0, y: 45, angle: -0.1 }, footR: { x: 0, y: 45, angle: 0 }, }; }
                _adjustColor(hex, lum) { hex = hex.replace(/[^0-9a-f]/gi, ''); if (hex.length < 6) { hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]; } let rgb = "#", c, i; for (i = 0; i < 3; i++) { c = parseInt(hex.substr(i * 2, 2), 16); c = Math.round(Math.min(255, Math.max(0, c + lum))).toString(16); while (c.length < 2) c = "0" + c; rgb += c; } return rgb; }
                _drawShadedRect(colorBase, x, y, w, h, radius = 0, isVertical = false) { const ctx = this.ctx; let grad; if (isVertical) { grad = ctx.createLinearGradient(x - w / 2, y, x + w / 2, y); grad.addColorStop(0.0, this._adjustColor(colorBase, -40)); grad.addColorStop(0.5, colorBase); grad.addColorStop(1.0, this._adjustColor(colorBase, 20)); } else { grad = ctx.createLinearGradient(x, y - h / 2, x, y + h / 2); grad.addColorStop(0.0, this._adjustColor(colorBase, 20)); grad.addColorStop(0.5, colorBase); grad.addColorStop(1.0, this._adjustColor(colorBase, -40)); } ctx.fillStyle = grad; ctx.beginPath(); if (radius > 0) { const x0 = x - w / 2; const y0 = y - h / 2; ctx.moveTo(x0 + radius, y0); ctx.arcTo(x0 + w, y0, x0 + w, y0 + h, radius); ctx.arcTo(x0 + w, y0 + h, x0, y0 + h, radius); ctx.arcTo(x0, y0 + h, x0, y0, radius); ctx.arcTo(x0, y0, x0 + w, y0, radius); ctx.closePath(); ctx.fill(); } else { ctx.fillRect(x - w / 2, y - h / 2, w, h); } }
                _drawHead(ctx) { const faceColor = '#FFDBA5'; const hairColor = '#FFD700'; const capGreen = '#228B22'; ctx.save(); ctx.fillStyle = hairColor; ctx.beginPath(); ctx.arc(0, 0, 35, 0, Math.PI * 2); ctx.fill(); this._drawShadedRect(faceColor, 0, 10, 35, 45, 10); ctx.fillStyle = 'white'; ctx.beginPath(); ctx.ellipse(-8, 5, 5, 8, 0, 0, Math.PI * 2); ctx.ellipse(8, 5, 5, 8, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#1E90FF'; ctx.beginPath(); ctx.arc(-8, 5, 2.5, 0, Math.PI * 2); ctx.arc(8, 5, 2.5, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = this._adjustColor(faceColor, -10); ctx.beginPath(); ctx.arc(0, 15, 3, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = faceColor; ctx.beginPath(); ctx.moveTo(25, 10); ctx.lineTo(35, 0); ctx.lineTo(25, -10); ctx.fill(); ctx.fillStyle = capGreen; ctx.beginPath(); ctx.moveTo(-30, -10); ctx.lineTo(30, -10); ctx.lineTo(0, -60); ctx.closePath(); ctx.fill(); ctx.restore(); }
                _drawTorso(ctx) { const tunicGreen = '#3CB371'; const beltBrown = '#8B4513'; ctx.save(); this._drawShadedRect(tunicGreen, 0, -40, 60, 80, 5); ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.moveTo(-15, -80); ctx.lineTo(15, -80); ctx.lineTo(0, -50); ctx.closePath(); ctx.fill(); ctx.fillStyle = tunicGreen; ctx.beginPath(); ctx.moveTo(-40, 0); ctx.lineTo(40, 0); ctx.lineTo(60, 40); ctx.lineTo(-60, 40); ctx.closePath(); ctx.fill(); ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; ctx.beginPath(); ctx.moveTo(0, 5); ctx.bezierCurveTo(-30, 10, 30, 10, 0, 40); ctx.fill(); ctx.fillStyle = beltBrown; ctx.fillRect(-60, -10, 120, 10); ctx.fillStyle = '#FF0000'; ctx.beginPath(); ctx.arc(0, -5, 5, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
                _drawLimb(ctx, isArm, h, angle) { const color = isArm ? '#FFFFFF' : '#FFFFFF'; const w = isArm ? 15 : 25; ctx.save(); ctx.rotate(angle); this._drawShadedRect(color, 0, h / 2, w, h, w / 4, true); ctx.restore(); }
                _drawHand(ctx) { const gloveBrown = '#A0522D'; const handW = 25; const handH = 35; ctx.save(); this._drawShadedRect('#FFFFFF', 0, -5, handW, 10, 5, true); this._drawShadedRect(gloveBrown, 0, handH / 2 + 5, handW + 5, handH, 10, true); ctx.fillStyle = '#FF0000'; ctx.fillRect(-handW / 2, 5, handW, 5); ctx.restore(); }
                _drawFoot(ctx) { const bootBrown = '#8B4513'; const footW = 35; const footH = 20; ctx.save(); this._drawShadedRect(bootBrown, 0, -10, footW, 30, 10, true); ctx.fillStyle = bootBrown; ctx.beginPath(); ctx.ellipse(0, 15, footW * 0.7, footH, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#FFD700'; ctx.fillRect(-footW / 2 + 5, -15, footW - 10, 5); ctx.restore(); }
                _drawLimbSet(joint1, joint2, joint3, isFront, isArm) { const ctx = this.ctx; const limbH1 = isArm ? 35 : 45; const limbH2 = isArm ? 35 : 45; ctx.save(); ctx.translate(joint1.x, joint1.y); this._drawLimb(ctx, isArm, limbH1, joint1.angle); ctx.translate(Math.sin(joint1.angle) * limbH1, Math.cos(joint1.angle) * limbH1); this._drawLimb(ctx, isArm, limbH2, joint2.angle); ctx.translate(Math.sin(joint2.angle) * limbH2, Math.cos(joint2.angle) * limbH2); if (isArm) { this._drawHand(ctx); } else { this._drawFoot(ctx); } ctx.restore(); }
                draw(ctx) { ctx.translate(0, -60); this._drawLimbSet(this.pose.thighR, this.pose.shinR, this.pose.footR, false, false); this._drawLimbSet(this.pose.thighL, this.pose.shinL, this.pose.footL, true, false); ctx.save(); ctx.rotate(this.pose.torsoAngle); this._drawTorso(ctx); ctx.translate(0, -90); this._drawHead(ctx); ctx.restore(); this._drawLimbSet(this.pose.armL, this.pose.forearmL, this.pose.handL, false, true); this._drawLimbSet(this.pose.armR, this.pose.forearmR, this.pose.handR, true, true); }
            }

            // --- Extracción y adaptación de samus-aran-2d-articulated-power-suit-detalle-mximo.html ---
            class SamusArticulada {
                constructor(ctx) { this.ctx = ctx; this.pose = { torsoAngle: 0, shoulderL: { x: -45, y: -65, angle: 0.2 }, armL: { x: 0, y: 30, angle: 0.1 }, forearmL: { x: 0, y: 35, angle: -0.1 }, shoulderR: { x: 45, y: -65, angle: -0.2 }, armR: { x: 0, y: 30, angle: -0.1 }, forearmR: { x: 0, y: 35, angle: 0.1 }, handR: { x: 0, y: 30, angle: 0 }, thighL: { x: -25, y: 30, angle: -0.05 }, shinL: { x: 0, y: 55, angle: 0.1 }, footL: { x: 0, y: 50, angle: 0 }, thighR: { x: 25, y: 30, angle: 0.05 }, shinR: { x: 0, y: 55, angle: -0.1 }, footR: { x: 0, y: 50, angle: 0 }, }; }
                _adjustColor(hex, lum) { hex = hex.replace(/[^0-9a-f]/gi, ''); if (hex.length < 6) { hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]; } let rgb = "#", c, i; for (i = 0; i < 3; i++) { c = parseInt(hex.substr(i * 2, 2), 16); c = Math.round(Math.min(255, Math.max(0, c + lum))).toString(16); while (c.length < 2) c = "0" + c; rgb += c; } return rgb; }
                _drawShadedPlate(colorBase, w, h, radius = 5, isVertical = false) { const ctx = this.ctx; let grad; if (isVertical) { grad = ctx.createLinearGradient(-w / 2, 0, w / 2, 0); grad.addColorStop(0.0, this._adjustColor(colorBase, -40)); grad.addColorStop(0.3, this._adjustColor(colorBase, 0)); grad.addColorStop(0.7, this._adjustColor(colorBase, 50)); grad.addColorStop(1.0, this._adjustColor(colorBase, -20)); } else { grad = ctx.createLinearGradient(0, -h / 2, 0, h / 2); grad.addColorStop(0.0, this._adjustColor(colorBase, 50)); grad.addColorStop(0.3, this._adjustColor(colorBase, 0)); grad.addColorStop(0.8, this._adjustColor(colorBase, -40)); } ctx.fillStyle = grad; ctx.beginPath(); ctx.moveTo(-w / 2 + radius, -h / 2); ctx.lineTo(w / 2 - radius, -h / 2); ctx.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + radius); ctx.lineTo(w / 2, h / 2 - radius); ctx.quadraticCurveTo(w / 2, h / 2, w / 2 - radius, h / 2); ctx.lineTo(-w / 2 + radius, h / 2); ctx.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - radius); ctx.lineTo(-w / 2, -h / 2 + radius); ctx.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + radius, -h / 2); ctx.closePath(); ctx.fill(); ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)'; ctx.lineWidth = 1; ctx.stroke(); }
                _drawHelmet(ctx) { const orange = '#FF4500'; const red = '#CC0000'; const green = '#3CB371'; ctx.save(); ctx.beginPath(); ctx.ellipse(0, 0, 35, 40, 0, 0, Math.PI * 2); ctx.fillStyle = this._adjustColor(orange, -10); ctx.fill(); ctx.beginPath(); ctx.moveTo(-35, 0); ctx.lineTo(35, 0); ctx.arc(0, 0, 35, 0, Math.PI, true); ctx.fillStyle = this._adjustColor(red, 0); ctx.fill(); ctx.fillStyle = green; ctx.beginPath(); ctx.moveTo(-20, 5); ctx.lineTo(-10, 15); ctx.lineTo(10, 15); ctx.lineTo(20, 5); ctx.lineTo(15, 0); ctx.lineTo(-15, 0); ctx.closePath(); ctx.fill(); ctx.fillStyle = orange; ctx.fillRect(-25, 40, 50, 10); ctx.restore(); }
                _drawTorso(ctx) { const orange = '#FF4500'; const yellow = '#FFD700'; ctx.save(); ctx.rotate(this.pose.torsoAngle); this._drawShadedPlate(orange, 80, 100, 25); ctx.fillStyle = yellow; ctx.beginPath(); ctx.ellipse(0, 55, 30, 15, 0, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(0, -30, 10, 0, Math.PI * 2); ctx.fillStyle = '#1E90FF'; ctx.fill(); ctx.restore(); }
                _drawLimbPlate(color, w, h, angle) { const ctx = this.ctx; ctx.save(); ctx.rotate(angle); this._drawShadedPlate(color, w, h, w / 2, true); ctx.restore(); }
                _drawShoulder(ctx, isCannon = false) { const orange = '#FF4500'; const jointColor = '#808080'; ctx.save(); ctx.beginPath(); ctx.arc(0, 0, 20, 0, Math.PI * 2); ctx.fillStyle = this._adjustColor(jointColor, -10); ctx.fill(); ctx.translate(0, -10); this._drawShadedPlate(orange, 50, 40, 20); ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 2; ctx.stroke(); ctx.restore(); }
                _drawCannon(ctx) { const green = '#3CB371'; const blue = '#1E90FF'; const orange = '#FF4500'; ctx.save(); this._drawLimbPlate(orange, 30, 20, 0); ctx.translate(0, 40); this._drawLimbPlate(green, 40, 60, 0); ctx.translate(0, 30); ctx.beginPath(); ctx.ellipse(0, 0, 30, 10, 0, 0, Math.PI * 2); ctx.fillStyle = this._adjustColor(blue, 30); ctx.fill(); ctx.restore(); }
                _drawHand(ctx) { const orange = '#FF4500'; ctx.save(); this._drawLimbPlate(orange, 25, 30, 0); ctx.translate(0, 15); ctx.beginPath(); ctx.arc(0, 0, 15, 0, Math.PI * 2); ctx.fillStyle = this._adjustColor(orange, -20); ctx.fill(); ctx.restore(); }
                _drawBoot(ctx) { const orange = '#FF4500'; const yellow = '#FFD700'; ctx.save(); ctx.translate(0, -10); this._drawShadedPlate(orange, 40, 30, 15); ctx.translate(0, 40); ctx.fillStyle = orange; ctx.beginPath(); ctx.moveTo(-30, -30); ctx.lineTo(30, -30); ctx.lineTo(40, 20); ctx.lineTo(-40, 20); ctx.closePath(); ctx.fill(); ctx.fillStyle = yellow; ctx.fillRect(-40, 15, 80, 5); ctx.restore(); }
                _drawLimbSet(joint1, joint2, joint3, isFront, isArm, shoulderJoint = null, isCannon = false) { const ctx = this.ctx; const orange = '#FF4500'; const yellow = '#FFD700'; const limbH1 = isArm ? 30 : 55; const limbH2 = isArm ? 35 : 55; const limbW = isArm ? 25 : 35; ctx.save(); ctx.translate(joint1.x, joint1.y); if (shoulderJoint) { this._drawShoulder(ctx, isCannon); } if (!isArm) { this._drawLimbPlate(orange, limbW, limbH1, joint1.angle); ctx.save(); ctx.rotate(joint1.angle); ctx.translate(0, limbH1); ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI * 2); ctx.fillStyle = this._adjustColor(yellow, -20); ctx.fill(); ctx.restore(); } else if (!shoulderJoint) { this._drawLimbPlate(orange, limbW, limbH1, joint1.angle); } ctx.translate(Math.sin(joint1.angle) * limbH1, Math.cos(joint1.angle) * limbH1); if (isArm && !isCannon) { this._drawLimbPlate(orange, limbW, limbH2, joint2.angle); } else if (!isArm) { this._drawLimbPlate(orange, limbW, limbH2, joint2.angle); } ctx.translate(Math.sin(joint2.angle) * limbH2, Math.cos(joint2.angle) * limbH2); if (isCannon) { this._drawCannon(ctx); } else if (isArm && joint3) { this._drawHand(ctx); } else if (!isArm) { this._drawBoot(ctx); } ctx.restore(); }
                draw(ctx) { ctx.translate(0, -100); this._drawLimbSet(this.pose.thighR, this.pose.shinR, this.pose.footR, false, false); this._drawLimbSet(this.pose.thighL, this.pose.shinL, this.pose.footL, true, false); ctx.save(); this._drawTorso(ctx); ctx.translate(0, -110); this._drawHelmet(ctx); ctx.restore(); this._drawLimbSet(this.pose.armR, this.pose.forearmR, this.pose.handR, false, true, this.pose.shoulderR); this._drawLimbSet(this.pose.armL, this.pose.forearmL, null, true, true, this.pose.shoulderL, true); }
            }

            // --- Extracción y adaptación de personaje-de-sonic-articulado-2d-detalle-mximo.html ---
            class SonicArticulado {
                constructor(ctx) { this.ctx = ctx; this.pose = { torsoAngle: 0, headAngle: 0, armL: { x: -30, y: -40, angle: 0.1 }, forearmL: { x: 0, y: 35, angle: 0.1 }, handL: { x: 0, y: 30, angle: 0 }, armR: { x: 30, y: -40, angle: -0.1 }, forearmR: { x: 0, y: 35, angle: -0.1 }, handR: { x: 0, y: 30, angle: 0 }, thighL: { x: -15, y: 40, angle: -0.05 }, shinL: { x: 0, y: 45, angle: 0.1 }, footL: { x: 0, y: 45, angle: 0 }, thighR: { x: 15, y: 40, angle: 0.05 }, shinR: { x: 0, y: 45, angle: -0.1 }, footR: { x: 0, y: 45, angle: 0 }, }; }
                _adjustColor(hex, lum) { hex = hex.replace(/[^0-9a-f]/gi, ''); if (hex.length < 6) { hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]; } let rgb = "#", c, i; for (i = 0; i < 3; i++) { c = parseInt(hex.substr(i * 2, 2), 16); c = Math.round(Math.min(255, Math.max(0, c + lum))).toString(16); while (c.length < 2) c = "0" + c; rgb += c; } return rgb; }
                _drawShadedRect(colorBase, w, h, radius = 0, isVertical = false) { const ctx = this.ctx; let grad; if (isVertical) { grad = ctx.createLinearGradient(-w / 2, 0, w / 2, 0); grad.addColorStop(0.0, this._adjustColor(colorBase, -30)); grad.addColorStop(0.5, colorBase); grad.addColorStop(1.0, this._adjustColor(colorBase, 20)); } else { grad = ctx.createLinearGradient(0, -h / 2, 0, h / 2); grad.addColorStop(0.0, this._adjustColor(colorBase, 20)); grad.addColorStop(0.5, colorBase); grad.addColorStop(1.0, this._adjustColor(colorBase, -30)); } ctx.fillStyle = grad; ctx.beginPath(); ctx.moveTo(-w / 2 + radius, -h / 2); ctx.lineTo(w / 2 - radius, -h / 2); ctx.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + radius); ctx.lineTo(w / 2, h / 2 - radius); ctx.quadraticCurveTo(w / 2, h / 2, w / 2 - radius, h / 2); ctx.lineTo(-w / 2 + radius, h / 2); ctx.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - radius); ctx.lineTo(-w / 2, -h / 2 + radius); ctx.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + radius, -h / 2); ctx.closePath(); ctx.fill(); }
                _drawHead(ctx) { const blue = '#1E90FF'; const peach = '#FFDBA5'; ctx.save(); ctx.rotate(this.pose.headAngle); ctx.fillStyle = this._adjustColor(blue, -20); for(let i=0; i<3; i++) { ctx.save(); ctx.rotate(0.3 * (i - 1)); ctx.beginPath(); ctx.moveTo(0, -50); ctx.lineTo(15, -15); ctx.lineTo(-15, -15); ctx.closePath(); ctx.fill(); ctx.restore(); } this._drawShadedRect(blue, 60, 70, 35, true); ctx.translate(0, 10); this._drawShadedRect(peach, 40, 35, 20); ctx.fillStyle = blue; ctx.beginPath(); ctx.moveTo(-30, -55); ctx.lineTo(-50, -65); ctx.lineTo(-35, -45); ctx.fill(); ctx.fillStyle = this._adjustColor(peach, -10); ctx.beginPath(); ctx.moveTo(-35, -50); ctx.lineTo(-45, -60); ctx.lineTo(-35, -45); ctx.fill(); ctx.fillStyle = 'white'; ctx.beginPath(); ctx.moveTo(-25, -20); ctx.arc(-10, -20, 15, Math.PI, Math.PI * 1.5); ctx.arc(10, -20, 15, Math.PI * 1.5, Math.PI * 2); ctx.lineTo(25, -20); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#006400'; ctx.beginPath(); ctx.arc(-5, -15, 4, 0, Math.PI * 2); ctx.arc(5, -15, 4, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = 'black'; ctx.beginPath(); ctx.arc(-5, -15, 1, 0, Math.PI * 2); ctx.arc(5, -15, 1, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = 'black'; ctx.beginPath(); ctx.ellipse(0, -5, 7, 5, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
                _drawTorso(ctx) { const blue = '#1E90FF'; const peach = '#FFDBA5'; ctx.save(); ctx.rotate(this.pose.torsoAngle); this._drawShadedRect(blue, 50, 60, 20, true); ctx.translate(0, 5); this._drawShadedRect(peach, 40, 45, 20); ctx.fillStyle = this._adjustColor(blue, -30); ctx.beginPath(); ctx.moveTo(-20, -30); ctx.lineTo(0, -50); ctx.lineTo(20, -30); ctx.closePath(); ctx.fill(); ctx.restore(); }
                _drawLimb(ctx, h, angle) { const blue = '#1E90FF'; const w = 15; ctx.save(); ctx.rotate(angle); this._drawShadedRect(blue, w, h, w / 2, true); ctx.restore(); }
                _drawHand(ctx) { const white = '#FFFFFF'; const handW = 20; const handH = 20; ctx.save(); this._drawShadedRect(white, handW * 0.9, 10, 5); ctx.translate(0, 15); this._drawShadedRect(white, handW, handH, 10); ctx.fillStyle = this._adjustColor(white, -20); ctx.fillRect(-handW * 0.4, 5, 5, 5); ctx.fillRect(0, 5, 5, 5); ctx.restore(); }
                _drawFoot(ctx) { const red = '#FF0000'; const white = '#FFFFFF'; const yellow = '#FFD700'; ctx.save(); this._drawShadedRect(white, 20, 20, 10); ctx.translate(0, 15); ctx.rotate(0.1); this.ctx.beginPath(); this.ctx.ellipse(0, 0, 40, 25, 0, 0, Math.PI * 2); this.ctx.fillStyle = red; this.ctx.fill(); ctx.fillStyle = white; ctx.fillRect(-40, -10, 80, 5); ctx.fillStyle = yellow; ctx.fillRect(30, -20, 10, 10); ctx.restore(); }
                _drawLimbSet(joint1, joint2, joint3, isFront, isArm) { const ctx = this.ctx; const limbH1 = 40; const limbH2 = 40; ctx.save(); ctx.translate(joint1.x, joint1.y); this._drawLimb(ctx, limbH1, joint1.angle); ctx.translate(Math.sin(joint1.angle) * limbH1, Math.cos(joint1.angle) * limbH1); this._drawLimb(ctx, limbH2, joint2.angle); ctx.translate(Math.sin(joint2.angle) * limbH2, Math.cos(joint2.angle) * limbH2); if (isArm) { this._drawHand(ctx); } else { this._drawFoot(ctx); } ctx.restore(); }
                draw(ctx) { ctx.translate(0, -60); this._drawLimbSet(this.pose.thighR, this.pose.shinR, this.pose.footR, false, false); this._drawLimbSet(this.pose.armL, this.pose.forearmL, this.pose.handL, false, true); ctx.save(); this._drawTorso(ctx); ctx.translate(0, -65); this._drawHead(ctx); ctx.restore(); this._drawLimbSet(this.pose.thighL, this.pose.shinL, this.pose.footL, true, false); ctx.save(); ctx.translate(this.pose.armR.x, this.pose.armR.y); this._drawLimbSet(this.pose.armR, this.pose.forearmR, this.pose.handR, true, true); ctx.restore(); }
            }

            // =====================================================================
            // CLASE FIGHTER (Clase contenedora con lógica de física y animación)
            // =====================================================================

            class Fighter {
                constructor(id, name, color, initialX, initialY, drawClass, ctx) {
                    this.id = id;
                    this.name = name;
                    this.color = color;
                    this.drawImpl = new drawClass(ctx); // La clase de dibujo detallada

                    this.x = initialX;
                    this.y = initialY;
                    this.vx = 0;
                    this.vy = 0;
                    this.onGround = false;
                    this.jumpsLeft = 2;
                    this.damage = 0;
                    this.stock = CONFIG.MAX_STOCK;
                    this.hitStunTimer = 0;
                    this.facing = 1;
                    this.size = 100 * CONFIG.SCALE;
                }

                updatePose() {
                    // Adaptar la animación de pose en función del estado (Aquí solo idle para Rest Area)
                    const t = CONFIG.TIME * 5;
                    if (this.drawImpl.pose) {
                        // Animación de idle (reposo sutil)
                        if (this.drawImpl.pose.armL) this.drawImpl.pose.armL.angle = 0.1 + Math.sin(t * 0.3) * 0.1;
                        if (this.drawImpl.pose.armR) this.drawImpl.pose.armR.angle = -0.1 - Math.sin(t * 0.3) * 0.1;
                    } else if (this.drawImpl.pose.bodyAngle !== undefined) {
                        this.drawImpl.pose.bodyAngle = Math.sin(t * 0.2) * 0.03; // Kirby
                    } else if (this.drawImpl.pose.headAngle !== undefined) {
                        this.drawImpl.pose.headAngle = Math.cos(t * 0.4) * 0.03; // Pikachu/Sonic
                    }
                }

                // Los demás métodos de física (updatePhysics, takeDamage, attack) se omiten ya que no son necesarios en el modo REST_AREA.

                draw(ctx) {
                    ctx.save();
                    ctx.translate(this.x, this.y);
                    ctx.scale(this.facing * CONFIG.SCALE, CONFIG.SCALE);

                    this.drawImpl.draw(ctx);

                    ctx.restore();
                }
            }

            // =====================================================================
            // CLASES DE GESTIÓN (Música, UI, Input)
            // =====================================================================

            class MusicManager {
                static _currentTrack = null;
                static _audioElements = {};

                static init() {
                    const trackIds = ['menu-music', 'select-music', 'mario-music', 'kirby-music', 'metroid-music', 'zelda-music', 'sonic-music', 'pokemon-music', 'drawaria-music', 'hit-sfx', 'ko-sfx'];
                    trackIds.forEach(id => {
                        this._audioElements[id] = document.getElementById(id);
                    });
                }

                static playTrack(id) {
                    if (this._currentTrack === this._audioElements[id]) return;

                    if (this._currentTrack) {
                        this._currentTrack.pause();
                        this._currentTrack.currentTime = 0;
                    }

                    this._currentTrack = this._audioElements[id];
                    if (this._currentTrack) {
                        this._currentTrack.volume = 0.6;
                        this._currentTrack.play().catch(e => console.error("Error al reproducir música:", e));
                    }
                }

                static playSFX(id) {
                    const sfx = this._audioElements[id];
                    if (sfx) {
                        sfx.currentTime = 0;
                        sfx.volume = 0.8;
                        sfx.play().catch(e => console.error("Error al reproducir SFX:", e));
                    }
                }
            }

            class UIManager {
                constructor(ctx) {
                    this.ctx = ctx;
                }

                _drawFighterGrid(fighterList) {
                    const ctx = this.ctx;
                    const W = CONFIG.WIDTH;
                    const H = CONFIG.HEIGHT;

                    const gridX = W * 0.05;
                    const gridY = H * 0.2;
                    const cols = 4;
                    const cellW = 50;
                    const cellH = 50;
                    const padding = 5;

                    fighterList.forEach((fighter, index) => {
                        const row = Math.floor(index / cols);
                        const col = index % cols;

                        const x = gridX + col * (cellW + padding);
                        const y = gridY + row * (cellH + padding);

                        // Contenedor del ícono
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                        ctx.fillRect(x, y, cellW, cellH);

                        // Si es el luchador activo, resáltalo
                        if (fighter.id === CONFIG.ACTIVE_FIGHTER_DATA.id) {
                            ctx.strokeStyle = (CONFIG.TIME % 0.1 < 0.05) ? '#FFD700' : '#FF00FF';
                            ctx.lineWidth = 3;
                            ctx.shadowColor = ctx.strokeStyle;
                            ctx.shadowBlur = 10;
                            ctx.strokeRect(x, y, cellW, cellH);
                            ctx.shadowBlur = 0;
                        }

                        // Dibuja el ícono (Implementación Placeholder simplificada: solo un círculo de color)
                        ctx.save();
                        ctx.translate(x + cellW/2, y + cellH/2);
                        ctx.scale(0.08 * CONFIG.SCALE, 0.08 * CONFIG.SCALE);

                        // Crear una instancia temporal solo para dibujar la miniatura
                        const tempFighter = new fighter.class(ctx);
                        tempFighter.draw(ctx);

                        ctx.restore();
                    });
                }

                _drawRestArea(fighter) {
                    const ctx = this.ctx;
                    const W = CONFIG.WIDTH;
                    const H = CONFIG.HEIGHT;

                    // 1. Timer (Top Center)
                    ctx.font = 'bold 50px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillStyle = 'white';
                    ctx.shadowColor = 'black';
                    ctx.shadowBlur = 5;

                    const minutes = Math.floor(CONFIG.REST_AREA_TIMER / 60);
                    const seconds = Math.floor(CONFIG.REST_AREA_TIMER % 60);
                    const centiseconds = Math.floor((CONFIG.REST_AREA_TIMER * 100) % 100);
                    const timerText = \`\${minutes.toString().padStart(2, '0')}:\${seconds.toString().padStart(2, '0')} \${centiseconds.toString().padStart(2, '0')}\`;

                    ctx.fillText(timerText, W / 2, H * 0.1);
                    ctx.shadowBlur = 0;

                    // 2. Cuadrícula de Personajes (Grid de la esquina superior izquierda)
                    this._drawFighterGrid(CONFIG.FIGHTER_LIST);

                    // 3. HUD de Daño y Vidas (Bottom Left, estilo Melee)

                    // Iconos de Corazón (Stocks)
                    const heartX = W * 0.1;
                    const heartY = H * 0.7;
                    for (let i = 0; i < fighter.stock; i++) {
                        ctx.save();
                        ctx.translate(heartX + i * 100, heartY);

                        // Dibuja un corazón simplificado (simula el asset 3D)
                        ctx.fillStyle = 'rgba(0, 255, 0, 0.4)';
                        ctx.strokeStyle = 'rgba(0, 255, 0, 0.8)';
                        ctx.lineWidth = 3;
                        ctx.shadowColor = 'rgba(0, 255, 0, 0.6)';
                        ctx.shadowBlur = 10;
                        ctx.beginPath();
                        ctx.moveTo(0, 20);
                        ctx.bezierCurveTo(20, 0, 40, 0, 0, -40);
                        ctx.bezierCurveTo(-40, 0, -20, 0, 0, 20);
                        ctx.fill();
                        ctx.stroke();
                        ctx.restore();
                    }

                    // Porcentaje de Daño (Simulación de 18% en la imagen)
                    ctx.font = 'bold 100px Arial Black';
                    ctx.textAlign = 'left';
                    ctx.fillStyle = '#FFFFFF';
                    ctx.strokeStyle = '#000000';
                    ctx.lineWidth = 4;
                    const damageText = \`Rest Area\`;
                    ctx.fillText(damageText, W * 0.1, H * 0.95);
                    ctx.strokeText(damageText, W * 0.1, H * 0.95);

                    // Indicador P1 (Sobre el luchador)
                    ctx.font = 'bold 30px Arial Black';
                    ctx.fillStyle = 'red';
                    ctx.textAlign = 'center';
                    ctx.fillText('P1', fighter.x, fighter.y - fighter.size * 1.5);
                    ctx.beginPath();
                    ctx.moveTo(fighter.x - 10, fighter.y - fighter.size * 1.4);
                    ctx.lineTo(fighter.x + 10, fighter.y - fighter.size * 1.4);
                    ctx.lineTo(fighter.x, fighter.y - fighter.size * 1.3);
                    ctx.closePath();
                    ctx.fill();
                }

                draw(gameState, fighters, winner) {
                    switch (gameState) {
                        case 'REST_AREA':
                            this._drawRestArea(Game.restFighter);
                            break;
                        // ... (otros estados pueden estar aquí, pero nos centramos en REST_AREA)
                    }
                }
            }

            // El InputManager se adapta para solo manejar clics en este modo.
            class InputManager {
                constructor() {
                    // No necesitamos keydown/keyup para el modo Rest Area, solo el evento de clic.
                }
            }


            // =====================================================================
            // CLASE GAME (Controlador Principal)
            // =====================================================================

            class SmashGame {
                constructor() {
                    this.canvas = document.getElementById('game-canvas');
                    this.ctx = this.canvas.getContext('2d');
                    this._initDimensions();
                    window.addEventListener('resize', this._initDimensions.bind(this));

                    // Inicializar gestores
                    MusicManager.init();
                    this.inputManager = new InputManager();
                    this.uiManager = new UIManager(this.ctx);

                    // Definición de personajes
                    CONFIG.FIGHTER_LIST = [
                        { id: 'MARIO', name: 'Mario', color: 'red', class: MarioArticulado, music: 'mario-music' },
                        { id: 'KIRBY', name: 'Kirby', color: 'pink', class: KirbyArticulado, music: 'kirby-music' },
                        { id: 'PIKACHU', name: 'Pikachu', color: 'yellow', class: PikachuArticulado, music: 'pokemon-music' },
                        { id: 'LINK', name: 'Link', color: 'green', class: LinkArticulado, music: 'zelda-music' },
                        { id: 'SAMUS', name: 'Samus', color: 'orange', class: SamusArticulada, music: 'metroid-music' },
                        { id: 'SONIC', name: 'Sonic', color: 'blue', class: SonicArticulado, music: 'sonic-music' },
                    ];

                    this.fighters = [];
                    this.winner = null;
                    this.lastTime = 0;

                    // --- Inicializar el luchador para el Rest Area ---
                    CONFIG.ACTIVE_FIGHTER_DATA = CONFIG.FIGHTER_LIST.find(f => f.id === 'MARIO');
                    if (!CONFIG.ACTIVE_FIGHTER_DATA) CONFIG.ACTIVE_FIGHTER_DATA = CONFIG.FIGHTER_LIST[0]; // Fallback a Mario
                    this.restFighter = this._createRestFighter();
                    // --------------------------------------------------------

                    // --- Manejador de Clicks para el Grid ---
                    this.canvas.addEventListener('click', this._handleCanvasClick.bind(this));
                    // -----------------------------------------------

                    this.rafHandle = requestAnimationFrame(this._gameLoop.bind(this));
                }

                _initDimensions() {
                    CONFIG.WIDTH = window.innerWidth;
                    CONFIG.HEIGHT = window.innerHeight;
                    this.canvas.width = CONFIG.WIDTH;
                    this.canvas.height = CONFIG.HEIGHT;
                    CONFIG.SCALE = Math.min(CONFIG.WIDTH / 1200, CONFIG.HEIGHT / 1000) * 1.5;

                    // Re-crear el luchador para asegurar la posición correcta después de la escala/dimensiones
                    if (this.restFighter) this.restFighter = this._createRestFighter();
                }

                _createRestFighter() {
                    if (!CONFIG.ACTIVE_FIGHTER_DATA || !this.ctx) return null;
                    const W = CONFIG.WIDTH;
                    const H = CONFIG.HEIGHT;

                    const fighter = new Fighter(
                        'P1',
                        CONFIG.ACTIVE_FIGHTER_DATA.name,
                        CONFIG.ACTIVE_FIGHTER_DATA.color,
                        W / 2,
                        H * 0.7,
                        CONFIG.ACTIVE_FIGHTER_DATA.class,
                        this.ctx
                    );
                    fighter.damage = 18; // Daño inicial como en la imagen de referencia
                    fighter.stock = 2; // Dos corazones
                    fighter.facing = -1; // Mirando hacia la izquierda (hacia el grid)
                    return fighter;
                }

                _handleCanvasClick(e) {
                    if (CONFIG.STATE !== 'REST_AREA') return;

                    const W = CONFIG.WIDTH;
                    const H = CONFIG.HEIGHT;
                    const x = e.clientX;
                    const y = e.clientY;

                    const gridX = W * 0.05;
                    const gridY = H * 0.2;
                    const cols = 4;
                    const cellW = 50;
                    const cellH = 50;
                    const padding = 5;

                    // Comprobar colisión con la cuadrícula
                    CONFIG.FIGHTER_LIST.forEach((fighter, index) => {
                        const row = Math.floor(index / cols);
                        const col = index % cols;

                        const cellLeft = gridX + col * (cellW + padding);
                        const cellTop = gridY + row * (cellH + padding);

                        if (x >= cellLeft && x <= cellLeft + cellW &&
                            y >= cellTop && y <= cellTop + cellH) {

                            // Personaje clickeado
                            CONFIG.ACTIVE_FIGHTER_DATA = fighter;
                            this.restFighter = this._createRestFighter();
                            MusicManager.playSFX('hit-sfx'); // SFX de golpe como placeholder de click
                            return;
                        }
                    });
                }

                _gameLoop(time) {
                    const dt = (time - this.lastTime) / 1000 || 0;
                    this.lastTime = time;
                    CONFIG.TIME = time / 1000;

                    this.ctx.clearRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

                    // Actualizar el Timer
                    if (CONFIG.STATE === 'REST_AREA') {
                        // El timer solo sube/avanza en este ejemplo
                        CONFIG.REST_AREA_TIMER += dt;
                    }

                    switch (CONFIG.STATE) {
                        case 'REST_AREA':
                            MusicManager.playTrack('menu-music'); // Música del Rest Area de Melee

                            // --- DIBUJO DEL FONDO TIPO REST AREA (Green Hill Zone) ---

                            // 1. Cielo (Azul)
                            this.ctx.fillStyle = '#61A9FF';
                            this.ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

                            // 2. Césped y Arboles (Fondo)
                            this.ctx.fillStyle = '#3CB371';
                            this.ctx.fillRect(0, CONFIG.HEIGHT * 0.4, CONFIG.WIDTH, CONFIG.HEIGHT * 0.6);

                            // Dibujar árboles simplificados (Silueta)
                            this.ctx.fillStyle = '#2F4F4F'; // Gris oscuro para la lejanía
                            this.ctx.beginPath();
                            this.ctx.moveTo(0, CONFIG.HEIGHT * 0.45);
                            this.ctx.bezierCurveTo(CONFIG.WIDTH * 0.2, CONFIG.HEIGHT * 0.3, CONFIG.WIDTH * 0.8, CONFIG.HEIGHT * 0.3, CONFIG.WIDTH, CONFIG.HEIGHT * 0.45);
                            this.ctx.lineTo(CONFIG.WIDTH, CONFIG.HEIGHT * 0.6);
                            this.ctx.lineTo(0, CONFIG.HEIGHT * 0.6);
                            this.ctx.closePath();
                            this.ctx.fill();

                            // 3. Primer Plano (Césped vibrante con sendero)
                            this.ctx.fillStyle = '#55A855'; // Césped más oscuro
                            this.ctx.fillRect(0, CONFIG.HEIGHT * 0.65, CONFIG.WIDTH, CONFIG.HEIGHT * 0.35);

                            // Sendero de tierra
                            this.ctx.fillStyle = '#8B4513';
                            this.ctx.beginPath();
                            this.ctx.ellipse(CONFIG.WIDTH / 2, CONFIG.HEIGHT * 0.75, CONFIG.WIDTH * 0.5, 30, 0, 0, Math.PI * 2);
                            this.ctx.fill();


                            // --- DIBUJO DE ELEMENTOS DE JUEGO ---

                            // Actualizar y Dibujar el Luchador Activo
                            if (this.restFighter) {
                                this.restFighter.updatePose();
                                this.restFighter.draw(this.ctx);
                            }

                            // Dibujar la UI
                            this.uiManager.draw('REST_AREA', null);
                            break;

                        // Los demás estados de juego se omiten intencionalmente para la escena de Rest Area.
                        case 'MENU':
                        case 'CHARACTER_SELECT':
                        case 'BATTLE':
                        case 'RESULTS':
                            // Evitar fallos si se cambia el estado
                            this.ctx.font = '50px Arial';
                            this.ctx.fillStyle = 'red';
                            this.ctx.fillText("MODO NO IMPLEMENTADO EN ESTA VERSIÓN", CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2);
                            break;
                    }

                    this.rafHandle = requestAnimationFrame(this._gameLoop.bind(this));
                }
            }

            // =====================================================================
            // INICIADOR GLOBAL Y MÚSICA DE FONDO
            // =====================================================================
            let Game;

            // Usamos DOMContentLoaded en lugar de 'load' para iniciar antes y
            // no esperar a que todas las imágenes de la página de destino carguen.
            window.addEventListener('load', () => {
                Game = new SmashGame();

                // Lógica de reproducción del audio bg-music del final del script original
                const music = document.getElementById('bg-music');
                // Intentar reproducir al hacer clic en cualquier parte de la pantalla
                document.body.addEventListener('click', () => {
                    // Intenta reproducir solo si está pausado
                    if (music && music.paused) {
                        music.play().catch(e => console.log("Se requiere interacción para la música de fondo.", e));
                    }
                });
            });
        `;

        // Inyectar el script usando un elemento <script> para asegurar el ámbito global (window)
        const script = document.createElement('script');
        script.textContent = scriptContent;
        document.body.appendChild(script);
    }

    // ----------------------------------------------------
    // EJECUCIÓN DEL SCRIPT
    // ----------------------------------------------------

    // Asegurarse de que el script se inyecta después de que el cuerpo del documento esté listo.
    if (document.body) {
        injectCSS();
        injectHTML();
        injectGameScript();
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            injectCSS();
            injectHTML();
            injectGameScript();
        });
    }

})();