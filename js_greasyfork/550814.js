// ==UserScript==
// @name         ⛏️ Netherite Companion Mod (Minecraft Edition)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Summon Creepers, blow up TNT, and throw weakness potions in Drawaria with blocky aesthetics!
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @match        https://*.drawaria.online/*
// @icon         https://fonts.gstatic.com/s/e/notoemoji/latest/1f4a5/512.webp
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550814/%E2%9B%8F%EF%B8%8F%20Netherite%20Companion%20Mod%20%28Minecraft%20Edition%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550814/%E2%9B%8F%EF%B8%8F%20Netherite%20Companion%20Mod%20%28Minecraft%20Edition%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ----------------------------------------------------------------------------------
    //  CONFIGURACIÓN Y ASSETS DE MINECRAFT
    // ---------------------------------------------------------------------------------- */

    // Colores de la paleta Minecraft (Bloques y Elementos Clave)
    const MC_COLORS = {
        'G': '#00A000',  // Verde (Bloque de Hierba / Creeper)
        'D': '#8B4513',  // Café Oscuro (Bloque de Tierra)
        'B': '#0000FF',  // Azul (Diamante)
        'K': '#000000',  // Negro (Bordes / Obsidiana)
        'W': '#FFFFFF',  // Blanco (Nieve / Calavera Wither)
        'R': '#FF0000',  // Rojo (TNT / Corazón)
        'Y': '#FFD700',  // Amarillo (Oro)
        'S': '#A9A9A9',  // Gris Plata (Hierro)
        'T': '#E34234',  // Rojo TNT (Más claro)
        'N': '#4A0404'   // Netherite Oscuro
    };

    // Estructuras de Pixel Art de Bloques (Detalle Cuadrado)
    const MC_PIXEL_ASSETS = {
        // Bloque de TNT
        'TNT_BLOCK': {
            art: [
                " TTTTT ",
                " T K T ",
                " T T T ",
                " T K T ",
                " TTTTT "
            ],
            colors: { 'T': MC_COLORS.T, 'K': MC_COLORS.K }
        },
        // Creeper Face
        'CREEPER_FACE': {
            art: [
                " GGGGG ",
                " G G G ",
                " G K G ",
                " G K G ",
                " K G K "
            ],
            colors: { 'G': MC_COLORS.G, 'K': MC_COLORS.K }
        },
        // Diamante (Item)
        'DIAMOND_ITEM': {
            art: [
                "  B  ",
                " BBB ",
                " BWB ",
                " BBB ",
                "  B  "
            ],
            colors: { 'B': MC_COLORS.B, 'W': MC_COLORS.W }
        },
        // Calavera de Wither
        'WITHER_SKULL': {
            art: [
                " KKKKK ",
                " KW WWK",
                " KWWWWK",
                " K KKK ",
                " K K K "
            ],
            colors: { 'K': MC_COLORS.K, 'W': MC_COLORS.W }
        }
    };

    // Armas/Proyectiles de Minecraft
    const MC_WEAPONS = {
        'Ninguno': '',
        '💥 Bloque de TNT (Explosión)': 'weapon:tnt_explosion',
        '💀 Calavera Wither (Corrosión)': 'weapon:wither_skull_shot',
        '⚡ Rayo de Tridente (Conducción)': 'weapon:trident_lightning',
        '🦠 Poción de Debilidad': 'weapon:potion_weakness',
    };

    // Poderes/Efectos de Minecraft
    const MC_POWERS = {
        'Ninguno': '',
        '✨ Súper Estrella (Invencibilidad)': 'effect:super_star_like', // Similar al efecto de estrella
        '🛡️ Armadura Netherite (Defensa)': 'effect:netherite_armor',
        '💰 Minería de Diamantes (Drop)': 'effect:diamond_mining',
        '🌱 Polvo de Hueso (Crecimiento rápido)': 'effect:bone_meal_growth',
    };

    const POWER_INTENSITY_LABELS = ['Nivel 1 (Madera)', 'Nivel 2 (Piedra)', 'Nivel 3 (Hierro)', 'Nivel 4 (Diamante)', 'Nivel 5 (Netherite)'];

    /* ----------------------------------------------------------------------------------
    //  SETUP BASE (Conexión y Canvas)
    // ---------------------------------------------------------------------------------- */
    let socket;
    const canvas = document.getElementById('canvas');
    const ctx = canvas ? canvas.getContext('2d') : null;

    let stopSignal = false;
    let activePowerInterval = null;
    let stopBtn;

    const originalSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (...args) {
        if (!socket) socket = this;
        return originalSend.apply(this, args);
    };

    function getPlayerCoords(playerId) {
        const avatar = document.querySelector(`.spawnedavatar[data-playerid="${playerId}"]`);
        if (!avatar || !canvas) return null;

        const cRect = canvas.getBoundingClientRect();
        const aRect = avatar.getBoundingClientRect();

        // Obtiene las coordenadas centradas del avatar en el canvas
        return {
            x: Math.round((aRect.left - cRect.left) + (aRect.width / 2)),
            y: Math.round((aRect.top - cRect.top) + (aRect.height / 2)),
            width: aRect.width,
            height: aRect.height
        };
    }

    /* ----------------------------------------------------------------------------------
    //  NÚCLEO DE DIBUJO: SINCRONIZACIÓN LOCAL Y REMOTA (PIXELADO)
    // ---------------------------------------------------------------------------------- */

    function drawLocalLine(x1, y1, x2, y2, color, thickness) {
        if (!ctx) return;
        const actualThickness = Math.abs(thickness);
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = actualThickness;
        ctx.lineCap = 'butt'; // Usamos 'butt' para un aspecto más cuadrado/pixelado
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.closePath();
    }

    function sendRemoteDrawCommand(x1, y1, x2, y2, color, thickness) {
        x1 = Math.round(x1);
        y1 = Math.round(y1);
        x2 = Math.round(x2); y2 = Math.round(y2);
        if (!socket || !canvas) return;

        const normX1 = (x1 / canvas.width).toFixed(4);
        const normY1 = (y1 / canvas.height).toFixed(4);
        const normX2 = (x2 / canvas.width).toFixed(4);
        const normY2 = (y2 / canvas.height).toFixed(4);

        // Usa grosor NEGATIVO para Drawaria (modo pincel/spray)
        const cmd = `42["drawcmd",0,[${normX1},${normY1},${normX2},${normY2},false,${0 - thickness},"${color}",0,0,{}]]`;
        socket.send(cmd);
    }

    /**
     * Función principal: Dibuja y envía.
     * @param {number} x1 Coordenada X inicial.
     * @param {number} y1 Coordenada Y inicial.
     * @param {number} x2 Coordenada X final.
     * @param {number} y2 Coordenada Y final.
     * @param {string} color Color HEX.
     * @param {number} thickness Grosor.
     */
    function sendAndDrawCommand(x1, y1, x2, y2, color, thickness) {
        // Para simular la cuadrícula de Minecraft, redondeamos las coordenadas
        const pixelSize = Math.max(5, thickness);
        x1 = Math.round(x1 / pixelSize) * pixelSize;
        y1 = Math.round(y1 / pixelSize) * pixelSize;
        x2 = Math.round(x2 / pixelSize) * pixelSize;
        y2 = Math.round(y2 / pixelSize) * pixelSize;

        drawLocalLine(x1, y1, x2, y2, color, thickness);
        sendRemoteDrawCommand(x1, y1, x2, y2, color, thickness);
    }

    /**
     * Dibuja pixel art basado en una cuadrícula.
     */
    function drawPixelArt(x, y, asset, sizeMultiplier = 1) {
        const { art, colors } = asset;
        const basePixelSize = 8;
        const pixelSize = basePixelSize * sizeMultiplier;

        const height = art.length;
        const width = art[0].length;

        // Centrar el arte respecto a la posición (x, y)
        const startX = x - (width * pixelSize) / 2;
        const startY = y - (height * pixelSize) / 2;

        for (let row = 0; row < height; row++) {
            for (let col = 0; col < width; col++) {
                const char = art[row][col];
                const color = colors[char] || MC_COLORS[char];

                if (color && char !== ' ') {
                    const pX1 = startX + col * pixelSize;
                    const pY1 = startY + row * pixelSize;
                    const pX2 = pX1 + pixelSize;
                    const pY2 = pY1 + pixelSize;

                    // Dibujar un bloque (rellenar un cuadrado)
                    // Simulación de relleno con varias líneas
                    for (let i = 0; i < pixelSize; i += 2) {
                        sendAndDrawCommand(pX1, pY1 + i, pX2, pY1 + i, color, 2);
                    }
                    // Borde negro para marcar el pixel (como en Minecraft)
                    sendAndDrawCommand(pX1, pY1, pX2, pY1, MC_COLORS.K, 1);
                    sendAndDrawCommand(pX1, pY2, pX2, pY2, MC_COLORS.K, 1);
                }
            }
        }
    }

    /* ----------------------------------------------------------------------------------
    //  FUNCIONES DE OBJETOS/ARMAS MINECRAFT
    // ---------------------------------------------------------------------------------- */

    // 1. Bloque de TNT (Explosión)
    async function tntExplosion(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const endX = target.x;
        const endY = target.y + 10;

        // Paso 1: Dibujar TNT y parpadear (Fuse)
        for(let i = 0; i < 6; i++) {
             if (stopSignal) break;
             drawPixelArt(endX, endY, MC_PIXEL_ASSETS.TNT_BLOCK, 2);
             await new Promise(r => setTimeout(r, 100));
             ctx.clearRect(endX - 30, endY - 30, 60, 60); // Borrado local
             await new Promise(r => setTimeout(r, 100));
        }

        // Paso 2: Explosión (Creeper/TNT)
        const maxRadius = 70 + intensity * 15;
        const colors = [MC_COLORS.R, MC_COLORS.T, MC_COLORS.Y];
        const pixelStep = 10;

        for (let step = 0; step < 10; step++) {
            if (stopSignal) break;
            const currentRadius = maxRadius * (step / 10);
            for (let p = 0; p < 10 + intensity; p++) {
                const angle = Math.random() * Math.PI * 2;
                const x = endX + currentRadius * Math.cos(angle);
                const y = endY + currentRadius * Math.sin(angle);
                const color = colors[Math.floor(Math.random() * colors.length)];
                // Dibujo pixelado de las partículas de explosión
                sendAndDrawCommand(endX, endY, x, y, color, pixelStep);
            }
            await new Promise(r => setTimeout(r, 30));
        }
        // Impacto final (Bloque de tierra quemado)
        sendAndDrawCommand(endX, endY, endX, endY, MC_COLORS.D, 50);
    }

    // 2. Calavera Wither (Corrosión)
    async function witherSkullShot(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const startX = canvas.width * 0.5;
        const startY = 0;
        const endX = target.x;
        const endY = target.y;

        // Trayectoria de la Calavera
        for (let i = 0; i < 5; i++) {
            if (stopSignal) break;
            const progress = i / 14;
            const currentX = startX + (endX - startX) * progress;
            const currentY = startY + (endY - startY) * progress;

            // Dibujar Calavera Wither (pixeleada)
            drawPixelArt(currentX, currentY, MC_PIXEL_ASSETS.WITHER_SKULL, 1.5);
            sendAndDrawCommand(currentX, currentY, currentX, currentY, MC_COLORS.K, 5); // Efecto de hollín
            await new Promise(r => setTimeout(r, 40));
        }

        // Efecto de Corrosión / Wither (Púrpura Oscuro)
        const duration = 300;
        const startTime = Date.now();
        const thickness = 4 + intensity * 5;
        const witherColor = '#550055'; // Púrpura oscuro

        while (Date.now() - startTime < duration) {
             if (stopSignal) break;
             for (let i = 0; i < 5 + intensity; i++) {
                const r = 5 + Math.random() * 5;
                const angle = Math.random() * Math.PI * 2;
                const x = endX + r * Math.cos(angle);
                const y = endY + r * Math.sin(angle);
                sendAndDrawCommand(endX, endY, x, y, witherColor, thickness);
             }
             await new Promise(r => setTimeout(r, 50));
        }
    }

    // 3. Rayo de Tridente (Conducción)
    async function tridentLightning(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const startX = canvas.width * 0.8;
        const startY = 50;
        const endX = target.x;
        const endY = target.y;
        const duration = 1000;
        const startTime = Date.now();

        while (Date.now() - startTime < duration) {
            if (stopSignal) break;
            for (let i = 0; i < 5 + intensity; i++) {
                let currentX = startX;
                let currentY = startY;

                // Genera el patrón zig-zag del rayo
                for (let j = 0; j < 10; j++) {
                    const nextX = currentX + (endX - startX) * 0.1 + (Math.random() - 0.5) * 50;
                    const nextY = currentY + (endY - startY) * 0.1 + (Math.random() - 0.5) * 50;
                    const color = (Math.random() > 0.5) ? MC_COLORS.W : MC_COLORS.Y;
                    sendAndDrawCommand(currentX, currentY, nextX, nextY, color, 3 + intensity);
                    currentX = nextX;
                    currentY = nextY;
                }
            }
            await new Promise(r => setTimeout(r, 50));
        }
    }

    // 4. Poción de Debilidad
    async function potionWeakness(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const startX = canvas.width * 0.2;
        const startY = canvas.height * 0.8;
        const endX = target.x;
        const endY = target.y;
        const duration = 1500;
        const startTime = Date.now();
        const potionColor = '#A9A9A9'; // Gris (efecto de debilidad/antídoto)

        for (let i = 0; i < 20; i++) {
            if (stopSignal) break;
            const progress = i / 19;
            const currentX = startX + (endX - startX) * progress;
            const currentY = startY + (endY - startY) * progress;

            // Dibujar la poción como un punto gris
            sendAndDrawCommand(currentX, currentY, currentX, currentY, potionColor, 10);
            await new Promise(r => setTimeout(r, 50));
        }

        // Efecto de partículas de la poción al impactar
        while (Date.now() - startTime < duration) {
            if (stopSignal) break;
            for (let i = 0; i < 5 + intensity; i++) {
                const r = 50 * Math.random();
                const angle = Math.random() * Math.PI * 2;
                const x = endX + r * Math.cos(angle);
                const y = endY + r * Math.sin(angle);
                // Partículas que se desvanecen (cambio de gris a transparente/blanco)
                sendAndDrawCommand(endX, endY, x, y, (Math.random() > 0.5 ? potionColor : MC_COLORS.W), 5);
            }
            await new Promise(r => setTimeout(r, 80));
        }
    }

    /* ----------------------------------------------------------------------------------
    //  FUNCIONES DE PODERES/EFECTOS MINECRAFT
    // ---------------------------------------------------------------------------------- */

    // 5. Armadura Netherite (Defensa)
    async function netheriteArmorDefense(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const duration = 500;
        const startTime = Date.now();
        const thickness = 5 + intensity * 2;
        const netheriteColor = MC_COLORS.N;

        while (Date.now() - startTime < duration) {
            if (stopSignal) break;
            const elapsed = Date.now() - startTime;
            const radius = 50;
            const pulse = Math.sin(elapsed * 0.015) * 5;

            // Dibuja un aura de Netherite oscura y pulsante
            for (let i = 0; i < 15; i++) {
                const angle = (i / 15) * 2 * Math.PI;
                const dist = radius + pulse;
                const x = target.x + dist * Math.cos(angle);
                const y = target.y + dist * Math.sin(angle);
                const color = (elapsed % 300 < 150) ? netheriteColor : MC_COLORS.K;
                sendAndDrawCommand(target.x, target.y, x, y, color, thickness);
            }

            await new Promise(r => setTimeout(r, 100));
        }
    }

    // 6. Minería de Diamantes (Drop)
    async function diamondMiningDrop(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const duration = 300;
        const startTime = Date.now();

        while (Date.now() - startTime < duration) {
            if (stopSignal) break;
            const elapsed = Date.now() - startTime;
            const count = 5 + intensity;

            for (let i = 0; i < count; i++) {
                const xOffset = (Math.random() - 0.5) * 100;
                const yOffset = -100 + (elapsed * 0.1) % 150; // Movimiento de caída
                // Diamante que cae (drawPixelArt es detallado)
                drawPixelArt(target.x + xOffset, target.y + yOffset, MC_PIXEL_ASSETS.DIAMOND_ITEM, 1 + intensity * 0.2);
            }

            await new Promise(r => setTimeout(r, 50));
        }
    }

    // 7. Polvo de Hueso (Crecimiento rápido)
    async function boneMealGrowth(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const centerX = target.x;
        const centerY = target.y;

        // Partículas de Polvo de Hueso (Blanco)
        for (let i = 0; i < 15 + intensity * 5; i++) {
            if (stopSignal) break;
            const r = 50 * Math.random();
            const angle = Math.random() * Math.PI * 2;
            const x = centerX + r * Math.cos(angle);
            const y = centerY + r * Math.sin(angle);
            sendAndDrawCommand(x, y, x, y, MC_COLORS.W, 5); // Polvo blanco
            await new Promise(r => setTimeout(r, 20));
        }

        // Efecto de crecimiento (hojas verdes)
        for (let i = 0; i < 5; i++) {
            // Líneas verticales simulando el crecimiento de una planta
            sendAndDrawCommand(centerX + (Math.random() - 0.5) * 10, centerY, centerX + (Math.random() - 0.5) * 10, centerY - 80, MC_COLORS.G, 5 + intensity);
            await new Promise(r => setTimeout(r, 50));
        }
    }

    // 8. Súper Estrella (Invencibilidad) - Adaptado a Minecraft
    async function superStarLike(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const duration = 3000;
        const startTime = Date.now();
        const thickness = 5 + intensity * 2;

        while (Date.now() - startTime < duration) {
            if (stopSignal) break;
            const elapsed = Date.now() - startTime;
            const pulse = Math.sin(elapsed * 0.02) * 5;

            // Dibuja aura amarilla y dorada (efecto brillo)
            for (let i = 0; i < 10; i++) {
                const angle = (i / 10) * 2 * Math.PI;
                const dist = 50 + pulse;
                const x = target.x + dist * Math.cos(angle);
                const y = target.y + dist * Math.sin(angle);
                const color = (elapsed % 200 < 100) ? MC_COLORS.Y : MC_COLORS.W;
                sendAndDrawCommand(target.x, target.y, x, y, color, thickness);
            }

            await new Promise(r => setTimeout(r, 100));
        }
    }

    /* ----------------------------------------------------------------------------------
    //  INTERFAZ DE USUARIO Y GESTIÓN DE EVENTOS
    // ---------------------------------------------------------------------------------- */

    const mcContainer = document.createElement('div');
    mcContainer.id = 'MinecraftCompanionUI';
    mcContainer.style.cssText = `
        position:fixed; bottom:10px; right:10px; z-index:9999;
        background:rgba(0, 0, 0, 0.9);
        color:#FFFFFF; padding:15px 20px; border-radius:10px;
        font-family: 'Consolas', 'Monospace', sans-serif; font-size:12px;
        display:flex; flex-direction:column; gap:10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.8), 0 0 15px rgba(74, 4, 4, 0.5);
        border: 3px solid #4A0404; /* Netherite Color */
        min-width: 250px;
        backdrop-filter: blur(5px);
    `;

    const titleBar = document.createElement('div');
    titleBar.innerHTML = '⛏️ NETHERITE COMPANION 💎';
    titleBar.style.cssText = `
        font-weight: bold; font-size: 14px; text-align: center; cursor: grab;
        color: #4A0404;
        background: rgba(255, 255, 255, 0.7);
        text-shadow: 0 0 5px #000000;
        margin: -15px -20px 8px -20px; padding: 10px 20px;
        border-bottom: 2px solid #4A0404;
        border-radius: 7px 7px 0 0;
    `;
    mcContainer.appendChild(titleBar);

    const contentDiv = document.createElement('div');
    contentDiv.style.cssText = `display:flex; flex-direction:column; gap:8px;`;
    mcContainer.appendChild(contentDiv);

    const mcInputStyle = `
        flex-grow: 1; padding: 6px 10px; border-radius: 5px;
        border: 2px solid #00A000; background: rgba(0, 0, 0, 0.7);
        color: #00A000; font-size: 11px; font-family: monospace;
        transition: all 0.2s ease;
    `;

    function createMcRow(parent, labelText, inputElement) {
        const wrapper = document.createElement('div');
        wrapper.style.cssText = `display:flex; align-items:center; gap:8px;`;
        const label = document.createElement('span');
        label.textContent = labelText;
        label.style.cssText = `color: #FFFFFF; font-weight: bold; min-width: 80px;`;
        wrapper.appendChild(label);
        wrapper.appendChild(inputElement);
        parent.appendChild(wrapper);
        return wrapper;
    }

    // Selector de Enemigo (Target)
    const enemySelect = document.createElement('select');
    enemySelect.style.cssText = mcInputStyle.replace('00A000', 'B');
    createMcRow(contentDiv, '👤 Objetivo (Mob):', enemySelect);

    // Selector de Armas
    const weaponSelect = document.createElement('select');
    weaponSelect.style.cssText = mcInputStyle;
    for (const name in MC_WEAPONS) {
        const opt = document.createElement('option');
        opt.value = MC_WEAPONS[name];
        opt.textContent = name;
        weaponSelect.appendChild(opt);
    }
    weaponSelect.value = MC_WEAPONS['Ninguno'];
    createMcRow(contentDiv, '⚔️ Arma / Item:', weaponSelect);

    // Selector de Poderes (Effects)
    const powerSelect = document.createElement('select');
    powerSelect.style.cssText = mcInputStyle;
    for (const name in MC_POWERS) {
        const opt = document.createElement('option');
        opt.value = MC_POWERS[name];
        opt.textContent = name;
        powerSelect.appendChild(opt);
    }
    powerSelect.value = MC_POWERS['Ninguno'];
    createMcRow(contentDiv, '✨ Poder / Buff:', powerSelect);

    // Auto-reset de selectores (solo uno a la vez)
    weaponSelect.addEventListener('change', () => {
        if (weaponSelect.value !== '') powerSelect.value = MC_POWERS['Ninguno'];
    });

    powerSelect.addEventListener('change', () => {
        if (powerSelect.value !== '') weaponSelect.value = MC_WEAPONS['Ninguno'];
    });

    // Medidor de Fuerza/Poder (Intensity)
    const powerInput = document.createElement('input');
    powerInput.type = 'range';
    powerInput.min = '1';
    powerInput.max = '5';
    powerInput.value = '3';
    powerInput.style.cssText = `flex-grow: 1; accent-color: #4A0404;`;
    createMcRow(contentDiv, '⛏️ Nivel:', powerInput);

    const powerLabel = document.createElement('span');
    powerLabel.style.cssText = 'color: #00A000; font-size: 10px; text-align: center; margin-top: -5px;';
    powerLabel.textContent = `Herramienta: ${POWER_INTENSITY_LABELS[powerInput.value - 1]}`;
    contentDiv.appendChild(powerLabel);
    powerInput.addEventListener('input', () => {
        powerLabel.textContent = `Herramienta: ${POWER_INTENSITY_LABELS[powerInput.value - 1]}`;
    });

    // Toggle de Repetición ("Flujo Continuo")
    const repeatToggle = document.createElement('input');
    repeatToggle.type = 'checkbox';
    repeatToggle.style.cssText = `transform: scale(1.2); accent-color: #00A000;`;
    const repeatLabel = document.createElement('label');
    repeatLabel.textContent = ' 🔄 Flujo Continuo (Spam de Creepers)';
    repeatLabel.style.cssText = `color: #00A000; font-weight: bold; cursor: pointer;`;
    const repeatWrapper = document.createElement('div');
    repeatWrapper.style.cssText = `display:flex; align-items:center; gap:8px; justify-content: center;`;
    repeatWrapper.appendChild(repeatToggle);
    repeatWrapper.appendChild(repeatLabel);
    contentDiv.appendChild(repeatWrapper);

    // Botón de Activación
    const activateBtn = document.createElement('button');
    activateBtn.textContent = '💣 INVOCAR / ACTIVAR EFECTO 💣';
    activateBtn.disabled = true;
    activateBtn.style.cssText = `
        padding: 10px 15px; border-radius: 8px; border: none;
        background: linear-gradient(45deg, #00A000, #4A0404);
        color: #FFFFFF; font-weight: bold; font-size: 14px;
        cursor: pointer; transition: all 0.2s ease;
        box-shadow: 0 3px 10px rgba(0, 160, 0, 0.5);
        font-family: 'Monospace', monospace;
        &:hover { background: linear-gradient(45deg, #4A0404, #00A000); transform: translateY(-1px); }
        &:disabled { background: #666; cursor: not-allowed; opacity: 0.5; transform: none; }
    `;
    contentDiv.appendChild(activateBtn);

    // Botón de Parada
    stopBtn = document.createElement('button');
    stopBtn.textContent = '⛔ DESACTIVAR (Stop Minería)';
    stopBtn.disabled = true;
    stopBtn.style.cssText = `
        margin-top: 5px; padding: 8px 12px; border-radius: 6px; border: none;
        background: linear-gradient(45deg, #FF0000, #8B0000);
        color: white; font-weight: bold; font-size: 12px;
        cursor: pointer; transition: all 0.2s ease;
        box-shadow: 0 2px 8px rgba(255, 0, 0, 0.4);
        font-family: 'Monospace', monospace;
        &:hover { background: linear-gradient(45deg, #8B0000, #FF0000); transform: translateY(-1px); }
        &:disabled { background: #666; cursor: not-allowed; opacity: 0.5; transform: none; }
    `;
    contentDiv.appendChild(stopBtn);

    document.body.appendChild(mcContainer);

    // --- Lógica de Gestión de Jugadores ---

    let lastPlayerList = new Set();
    let isUpdatingList = false;

    function refreshPlayerList() {
        if (isUpdatingList) return;

        const currentPlayers = new Set();
        const playerRows = document.querySelectorAll('.playerlist-row[data-playerid]');

        playerRows.forEach(row => {
            if (row.dataset.self !== 'true' && row.dataset.playerid !== '0') {
                const name = row.querySelector('.playerlist-name a')?.textContent || `Player ${row.dataset.playerid}`;
                currentPlayers.add(`${row.dataset.playerid}:${name}`);
            }
        });

        const playersChanged = currentPlayers.size !== lastPlayerList.size ||
              ![...currentPlayers].every(player => lastPlayerList.has(player));

        if (!playersChanged) return;

        isUpdatingList = true;
        const previousSelection = enemySelect.value;

        enemySelect.innerHTML = '';
        enemySelect.textContent = '👤 Tú (Steve/Alex)';

        playerRows.forEach(row => {
            if (row.dataset.self === 'true') return;
            if (row.dataset.playerid === '0') return;
            const name = row.querySelector('.playerlist-name a')?.textContent || `Enemy ${row.dataset.playerid}`;
            const opt = document.createElement('option');
            opt.value = row.dataset.playerid;
            const mcName = name.includes('Police') ? '💀 Wither Skeleton' : '🧟 Zombie';
            opt.textContent = `🎯 ${mcName} (${name})`;
            enemySelect.appendChild(opt);
        });

        if (previousSelection) {
            enemySelect.value = previousSelection;
        }

        lastPlayerList = new Set(currentPlayers);
        activateBtn.disabled = enemySelect.children.length === 0;
        isUpdatingList = false;
    }


    // --- Eventos Principales ---

    // Arrastrar ventana
    let isDragging = false;
    let dragOffsetX, dragOffsetY;
    titleBar.addEventListener('mousedown', (e) => {
        isDragging = true;
        dragOffsetX = e.clientX - mcContainer.getBoundingClientRect().left;
        dragOffsetY = e.clientY - mcContainer.getBoundingClientRect().top;
        titleBar.style.cursor = 'grabbing';
    });
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        let newX = e.clientX - dragOffsetX;
        let newY = e.clientY - dragOffsetY;
        newX = Math.max(0, Math.min(newX, window.innerWidth - mcContainer.offsetWidth));
        newY = Math.max(0, Math.min(newY, window.innerHeight - mcContainer.offsetHeight));
        mcContainer.style.left = newX + 'px';
        mcContainer.style.top = newY + 'px';
        mcContainer.style.right = 'auto';
        mcContainer.style.bottom = 'auto';
    });
    document.addEventListener('mouseup', () => {
        isDragging = false;
        titleBar.style.cursor = 'grab';
    });

    // Botón de parada
    stopBtn.addEventListener('click', () => {
        console.log('⛔ Modo Creativo: Deteniendo acción.');
        stopSignal = true;

        if (activePowerInterval) {
            clearInterval(activePowerInterval);
            activePowerInterval = null;
        }

        activateBtn.textContent = '💣 INVOCAR / ACTIVAR EFECTO 💣';
        activateBtn.style.background = 'linear-gradient(45deg, #00A000, #4A0404)';
        activateBtn.disabled = false;
        stopBtn.disabled = true;
    });

    // Botón principal de activación
    activateBtn.addEventListener('click', async () => {
        const playerId = enemySelect.value;
        if (!playerId) {
            alert('🎯 ¡Escoge un Mob o Boss al que atacar!');
            return;
        }

        const selectedWeapon = weaponSelect.value;
        const selectedPower = powerSelect.value;
        const intensity = parseInt(powerInput.value);

        if (activePowerInterval) {
            stopBtn.click();
            return;
        }

        let actionToExecute = null;
        let actionName = '';

        if (selectedWeapon && selectedWeapon.startsWith('weapon:')) {
            switch (selectedWeapon) {
                case 'weapon:tnt_explosion': actionToExecute = () => tntExplosion(playerId, intensity); actionName = 'Bloque de TNT'; break;
                case 'weapon:wither_skull_shot': actionToExecute = () => witherSkullShot(playerId, intensity); actionName = 'Calavera Wither'; break;
                case 'weapon:trident_lightning': actionToExecute = () => tridentLightning(playerId, intensity); actionName = 'Rayo de Tridente'; break;
                case 'weapon:potion_weakness': actionToExecute = () => potionWeakness(playerId, intensity); actionName = 'Poción de Debilidad'; break;
                default: return;
            }
        } else if (selectedPower && selectedPower.startsWith('effect:')) {
            switch (selectedPower) {
                case 'effect:super_star_like': actionToExecute = () => superStarLike(playerId, intensity); actionName = 'Súper Estrella'; break;
                case 'effect:netherite_armor': actionToExecute = () => netheriteArmorDefense(playerId, intensity); actionName = 'Armadura Netherite'; break;
                case 'effect:diamond_mining': actionToExecute = () => diamondMiningDrop(playerId, intensity); actionName = 'Minería de Diamantes'; break;
                case 'effect:bone_meal_growth': actionToExecute = () => boneMealGrowth(playerId, intensity); actionName = 'Polvo de Hueso'; break;
                default: return;
            }
        } else {
            alert('🔺 ¡Debes seleccionar un Item o Poder de Minecraft!');
            return;
        }

        stopSignal = false;
        activateBtn.disabled = true;
        stopBtn.disabled = false;

        try {
            if (repeatToggle.checked) {
                activateBtn.textContent = '🔄 DETENER FLUJO CONTINUO';
                activateBtn.style.background = 'linear-gradient(45deg, #FF0000, #8B0000)';
                activateBtn.disabled = false;

                console.log(`🔥 ¡Iniciando Flujo Continuo de ${actionName}!`);

                const continuousAction = async () => {
                    if (stopSignal || !repeatToggle.checked) {
                        if (activePowerInterval) clearInterval(activePowerInterval);
                        activePowerInterval = null;
                        activateBtn.textContent = '💣 INVOCAR / ACTIVAR EFECTO 💣';
                        activateBtn.style.background = 'linear-gradient(45deg, #00A000, #4A0404)';
                        stopBtn.disabled = true;
                        return;
                    }

                    try {
                        await actionToExecute();
                    } catch (error) {
                        console.error(`Error durante el Flujo Continuo (${actionName}):`, error);
                    }
                };

                await continuousAction();
                if (!stopSignal) {
                    activePowerInterval = setInterval(continuousAction, 2500);
                }
            } else {
                console.log(`💥 Ejecutando ${actionName} una sola vez...`);
                await actionToExecute();
            }
        } finally {
            if (!activePowerInterval) {
                activateBtn.disabled = false;
                stopBtn.disabled = true;
            }
        }
    });

    // Observar cambios en la lista de jugadores
    const playerListElement = document.getElementById('playerlist');
    if (playerListElement) {
        new MutationObserver(() => {
            setTimeout(refreshPlayerList, 100);
        }).observe(playerListElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['data-playerid']
        });
    }

    // Limpieza al cerrar
    window.addEventListener('beforeunload', () => {
        if (activePowerInterval) {
            clearInterval(activePowerInterval);
            activePowerInterval = null;
        }
        stopSignal = true;
        console.log('¡GRACIAS POR JUGAR! Ahora vuelve a minar. -Minecraft.');
    });

    // Inicialización
    refreshPlayerList();
    console.log('✨ Netherite Companion Mod cargado. ¡Bienvenido al Overworld! ✨');

})();