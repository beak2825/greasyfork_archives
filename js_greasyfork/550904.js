// ==UserScript==
// @name         🌱 Farmer's Companion Mod (Stardew Valley Edition) 💎
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Plant seeds, water them, mine minerals, and consume Energy Potions! Transform Drawaria into your Stardew Valley farm.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @match        https://*.drawaria.online/*
// @icon         https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/0d55ae41-e76d-4375-b2d9-5b40b36a2f82/dehzxxr-72b13630-0a09-4aa5-b442-1d752c6f6971.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiIvZi8wZDU1YWU0MS1lNzZkLTQzNzUtYjJkOS01YjQwYjM2YTJmODIvZGVoenh4ci03MmIxMzYzMC0wYTA5LTRhYTUtYjQ0Mi0xZDc1MmM2ZjY5NzEucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.Oq9eEn02EANhsXiW2Rz_fMY38N05khYmK_1bP01ugTo
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550904/%F0%9F%8C%B1%20Farmer%27s%20Companion%20Mod%20%28Stardew%20Valley%20Edition%29%20%F0%9F%92%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/550904/%F0%9F%8C%B1%20Farmer%27s%20Companion%20Mod%20%28Stardew%20Valley%20Edition%29%20%F0%9F%92%8E.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ----------------------------------------------------------------------------------
    //  CONFIGURACIÓN Y ASSETS DE STARDEW VALLEY
    // ---------------------------------------------------------------------------------- */

    // Colores de la paleta Stardew Valley (Estaciones, Minerales y Energía)
    const SDV_COLORS = {
        'G': '#38761d',  // Verde Oscuro (Cosecha/Hierba)
        'B': '#0000FF',  // Azul (Agua/Riego)
        'Y': '#FFD700',  // Amarillo/Oro (Mineral/Energía)
        'D': '#654321',  // Marrón Oscuro (Tierra Arada)
        'P': '#800080',  // Púrpura (Iridio/Efectos Mágicos)
        'R': '#B22222',  // Rojo Oscuro (Roca/Impacto)
        'S': '#A9A9A9',  // Gris Plata (Mineral de Hierro)
        'W': '#FFFFFF',  // Blanco (Estrellas/Brillo)
        'K': '#000000'   // Negro (Bordes)
    };

    // Estructuras de Pixel Art detalladas (Herramientas y Recursos Clave)
    const SDV_PIXEL_ASSETS = {
        // Semilla de Coliflor (Item)
        'CAULIFLOWER_SEED': {
            art: [
                "  G G  ",
                " G G G ",
                "G G W G G",
                " G G G ",
                "  G G  "
            ],
            colors: { 'G': SDV_COLORS.G, 'W': SDV_COLORS.W }
        },
        // Mineral de Iridio
        'IRIDIUM_ORE': {
            art: [
                " P P P ",
                "P P P P",
                " P P P ",
                "P P P P",
                " P P P "
            ],
            colors: { 'P': SDV_COLORS.P, 'K': SDV_COLORS.K }
        },
        // Gota de Agua (Riego)
        'WATER_DROP': {
            art: [
                "  B  ",
                " B B ",
                "B B B",
                " B B ",
                "  B  "
            ],
            colors: { 'B': SDV_COLORS.B }
        }
    };

    // Herramientas (Ataques) de Stardew Valley
    const SDV_TOOLS = {
        'Ninguno': '',
        '⛏️ Pico (Minería)': 'tool:pickaxe_mining',
        '💧 Regadera (Riego)': 'tool:watering_can_spray',
        '🔪 Guadaña (Corte)': 'tool:scythe_cut',
        '🎣 Caña de Pescar (Impacto)': 'tool:fishing_rod_impact',
    };

    // Alimentos/Efectos de Estado (Buffs) de Stardew Valley
    const SDV_BUFFS = {
        'Ninguno': '',
        '🌟 Poción de Energía (Max Energy)': 'buff:energy_potion_full',
        '🌱 Polvo de Hada (Crecimiento rápido)': 'buff:fairy_dust_growth',
    };

    const POWER_INTENSITY_LABELS = ['Cobre (Nivel 1)', 'Acero (Nivel 2)', 'Oro (Nivel 3)', 'Iridio (Nivel 4)', 'Maestro (Nivel 5)'];

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

        return {
            x: Math.round((aRect.left - cRect.left) + (aRect.width / 2)),
            y: Math.round((aRect.top - cRect.top) + (aRect.height / 2)),
            width: aRect.width,
            height: aRect.height
        };
    }

    /* ----------------------------------------------------------------------------------
    //  NÚCLEO DE DIBUJO: DETALLE Y SINCRONIZACIÓN (PIXEL ART)
    // ---------------------------------------------------------------------------------- */

    function drawLocalLine(x1, y1, x2, y2, color, thickness) {
        if (!ctx) return;
        const actualThickness = Math.abs(thickness);
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = actualThickness;
        ctx.lineCap = 'butt';
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

    function sendAndDrawCommand(x1, y1, x2, y2, color, thickness) {
        drawLocalLine(x1, y1, x2, y2, color, thickness);
        sendRemoteDrawCommand(x1, y1, x2, y2, color, thickness);
    }

    /**
     * Dibuja pixel art detallado (simulando sprites de ítems).
     */
    function drawPixelArt(x, y, asset, sizeMultiplier = 1) {
        const { art, colors } = asset;
        const basePixelSize = 6;
        const pixelSize = basePixelSize * sizeMultiplier;

        const height = art.length;
        const width = art[0].length;

        const startX = x - (width * pixelSize) / 2;
        const startY = y - (height * pixelSize) / 2;

        for (let row = 0; row < height; row++) {
            for (let col = 0; col < width; col++) {
                const char = art[row][col];
                const color = colors[char] || SDV_COLORS[char];

                if (color && char !== ' ') {
                    const pX1 = startX + col * pixelSize;
                    const pY1 = startY + row * pixelSize;
                    const pX2 = pX1 + pixelSize;
                    const pY2 = pY1 + pixelSize;

                    // Relleno del pixel (para simular el color del sprite)
                    for (let i = 0; i < pixelSize; i += 2) {
                        sendAndDrawCommand(pX1, pY1 + i, pX2, pY1 + i, color, 2);
                    }
                    // Borde negro (definición del pixel art)
                    sendAndDrawCommand(pX1, pY1, pX2, pY1, SDV_COLORS.K, 1);
                }
            }
        }
    }


    /* ----------------------------------------------------------------------------------
    //  FUNCIONES DE HERRAMIENTAS (TOOLS) STARDEW VALLEY
    // ---------------------------------------------------------------------------------- */

    // 1. Pico (Minería)
    async function pickaxeMining(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const endX = target.x;
        const endY = target.y;
        const thickness = 5 + intensity * 2;
        const colors = [SDV_COLORS.S, SDV_COLORS.R, SDV_COLORS.Y]; // Plata, Roca, Oro

        // Simulación de impacto de pico
        for (let i = 0; i < 5; i++) {
            if (stopSignal) break;

            // Movimiento rápido del pico (línea diagonal)
            const x1 = endX - 50 + i * 10;
            const y1 = endY - 50 + i * 10;
            sendAndDrawCommand(x1, y1, endX, endY, SDV_COLORS.S, 5);
            await new Promise(r => setTimeout(r, 50));

            // Partículas de roca (Rojo/Gris)
            for (let j = 0; j < 5 + intensity; j++) {
                const r = 20 + Math.random() * 30;
                const angle = Math.random() * Math.PI * 2;
                const x = endX + r * Math.cos(angle);
                const y = endY + r * Math.sin(angle);
                const color = colors[Math.floor(Math.random() * 3)];
                sendAndDrawCommand(endX, endY, x, y, color, 3);
            }
            await new Promise(r => setTimeout(r, 50));
        }

        // Drop de mineral (Iridio)
        drawPixelArt(endX, endY - 30, SDV_PIXEL_ASSETS.IRIDIUM_ORE, 1 + intensity * 0.2);
    }

    // 2. Regadera (Riego)
    async function wateringCanSpray(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const endX = target.x;
        const endY = target.y;
        const duration = 200;
        const startTime = Date.now();

        // Color de tierra recién regada
        sendAndDrawCommand(endX, endY + 20, endX, endY + 20, SDV_COLORS.D, 50);

        while (Date.now() - startTime < duration) {
            if (stopSignal) break;
            const count = 10 + intensity * 5;

            // Chorro de agua descendente
            for (let i = 0; i < count; i++) {
                const x = endX + (Math.random() - 0.5) * 50;
                const startY = endY - 50;
                const y = startY + (Math.random() * 70);
                // Dibuja la gota de agua pixelada
                drawPixelArt(x, y, SDV_PIXEL_ASSETS.WATER_DROP, 0.5);
            }

            // Lodo/Tierra que salpica
            for (let i = 0; i < 3; i++) {
                const x = endX + (Math.random() - 0.5) * 50;
                const y = endY + (Math.random() * 20);
                sendAndDrawCommand(x, y, x, y, SDV_COLORS.D, 5);
            }
            await new Promise(r => setTimeout(r, 50));
        }
    }

    // 3. Guadaña (Corte)
    async function scytheCut(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const endX = target.x;
        const endY = target.y;
        const duration = 1000;
        const startTime = Date.now();
        const swingRadius = 50 + intensity * 10;
        const grassColor = SDV_COLORS.G;

        // Movimiento de guadaña (arco de corte)
        while (Date.now() - startTime < duration) {
            if (stopSignal) break;
            const elapsed = Date.now() - startTime;
            const angle = (elapsed / duration) * Math.PI * 1.5;

            // Simulación del filo de la guadaña
            const x = endX + swingRadius * Math.cos(angle - Math.PI / 2);
            const y = endY + swingRadius * Math.sin(angle - Math.PI / 2);
            sendAndDrawCommand(endX, endY, x, y, SDV_COLORS.S, 5); // Hoja de guadaña

            // Partículas de hierba/cultivo cortado (Verde)
            for (let i = 0; i < 5 + intensity; i++) {
                const r = 20 + Math.random() * 10;
                const angle = Math.random() * Math.PI * 2;
                const x = endX + r * Math.cos(angle);
                const y = endY + r * Math.sin(angle);
                sendAndDrawCommand(endX, endY, x, y, grassColor, 3);
            }
            await new Promise(r => setTimeout(r, 50));
        }

        // Drop de Semilla (Coliflor)
        drawPixelArt(endX, endY - 10, SDV_PIXEL_ASSETS.CAULIFLOWER_SEED, 1);
    }

    // 4. Caña de Pescar (Impacto)
    async function fishingRodImpact(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const endX = target.x;
        const endY = target.y;
        const startX = canvas.width * 0.8;
        const startY = canvas.height * 0.8;

        // Trayectoria de la línea de pesca (simulando lanzamiento)
        for (let i = 0; i < 20; i++) {
            if (stopSignal) break;
            const progress = i / 19;
            const currentX = startX + (endX - startX) * progress;
            const currentY = startY + (endY - startY) * progress;

            // Línea de pesca (Negro y Blanco)
            sendAndDrawCommand(startX, startY, currentX, currentY, SDV_COLORS.K, 2);
            // Plomada (Azul)
            sendAndDrawCommand(currentX, currentY, currentX, currentY, SDV_COLORS.B, 5);
            await new Promise(r => setTimeout(r, 40));
        }

        // Efecto de Salpicadura al Impacto
        const splashDuration = 500;
        const splashStartTime = Date.now();
        const splashColor = SDV_COLORS.B;

        while (Date.now() - splashStartTime < splashDuration) {
             if (stopSignal) break;
             for (let i = 0; i < 5 + intensity; i++) {
                const r = 30 * Math.random();
                const angle = Math.random() * Math.PI * 2;
                const x = endX + r * Math.cos(angle);
                const y = endY + r * Math.sin(angle);
                sendAndDrawCommand(endX, endY, x, y, splashColor, 3);
             }
             await new Promise(r => setTimeout(r, 50));
        }
    }

    /* ----------------------------------------------------------------------------------
    //  FUNCIONES DE ALIMENTOS/EFECTOS (BUFFS) STARDEW VALLEY
    // ---------------------------------------------------------------------------------- */

    // 5. Poción de Energía (Max Energy)
    async function energyPotionFull(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const duration = 3000;
        const startTime = Date.now();
        const energyColor = SDV_COLORS.Y;

        while (Date.now() - startTime < duration) {
            if (stopSignal) break;
            const elapsed = Date.now() - startTime;
            const count = 5 + intensity * 2;

            // Partículas de energía amarilla ascendentes
            for (let i = 0; i < count; i++) {
                const x = target.x + (Math.random() - 0.5) * 50;
                const startY = target.y + 20;
                const endY = target.y - 50;
                const currentY = startY + (endY - startY) * (elapsed / duration); // Movimiento ascendente
                sendAndDrawCommand(x, currentY, x, currentY - 5, energyColor, 5);
            }

            await new Promise(r => setTimeout(r, 80));
        }
    }

    // 6. Amuleto de la Suerte (High Luck)
    async function luckyCharmLuck(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const duration = 2500;
        const startTime = Date.now();
        const luckColor = '#32CD32'; // Verde brillante (trébol)
        const starColor = SDV_COLORS.W;

        while (Date.now() - startTime < duration) {
            if (stopSignal) break;
            const count = 8 + intensity;
            const radius = 40 + intensity * 5;

            // Destellos verdes y blancos alrededor del jugador (Aura de suerte)
            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2;
                const dist = radius * Math.random();
                const x = target.x + dist * Math.cos(angle);
                const y = target.y + dist * Math.sin(angle);
                const color = (Math.random() > 0.6) ? starColor : luckColor;
                sendAndDrawCommand(x, y, x, y, 5);
            }
            await new Promise(r => setTimeout(r, 100));
        }
    }

    // 7. Seta Común (Recuperación lenta - Stamina)
    async function mushroomStamina(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const duration = 3000;
        const startTime = Date.now();
        const mushroomColor = '#8B0000'; // Rojo oscuro (sombrero de seta)

        while (Date.now() - startTime < duration) {
            if (stopSignal) break;
            const count = 3 + intensity;

            // Dibuja setas pequeñas que aparecen y desaparecen brevemente
            for (let i = 0; i < count; i++) {
                const r = 30 + Math.random() * 20;
                const angle = Math.random() * Math.PI * 2;
                const x = target.x + r * Math.cos(angle);
                const y = target.y + r * Math.sin(angle);

                // Dibujar una forma simple de seta (rojo y blanco)
                sendAndDrawCommand(x, y, x, y, mushroomColor, 8); // Sombrero
                sendAndDrawCommand(x, y + 10, x, y + 2, SDV_COLORS.W, 4); // Tallo
            }
            await new Promise(r => setTimeout(r, 200));
        }
    }

    // 8. Polvo de Hada (Crecimiento rápido)
    async function fairyDustGrowth(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const duration = 1500;
        const startTime = Date.now();
        const dustColor = '#FF69B4'; // Rosa/Fucsia (color de hada)

        while (Date.now() - startTime < duration) {
            if (stopSignal) break;
            const count = 10 + intensity * 5;

            // Destellos de polvo rosa/púrpura
            for (let i = 0; i < count; i++) {
                const r = 50 * Math.random();
                const angle = Math.random() * Math.PI * 2;
                const x = target.x + r * Math.cos(angle);
                const y = target.y + r * Math.sin(angle);
                const color = (Math.random() > 0.5) ? dustColor : SDV_COLORS.P;
                sendAndDrawCommand(x, y, x, y, color, 3);
            }

            // Simulación de crecimiento (líneas verdes ascendentes)
            for (let i = 0; i < 5; i++) {
                const xOffset = (Math.random() - 0.5) * 10;
                sendAndDrawCommand(target.x + xOffset, target.y, target.x + xOffset, target.y - 50, SDV_COLORS.G, 5);
            }
            await new Promise(r => setTimeout(r, 50));
        }
    }


    /* ----------------------------------------------------------------------------------
    //  INTERFAZ DE USUARIO Y GESTIÓN DE EVENTOS
    // ---------------------------------------------------------------------------------- */

    const sdvContainer = document.createElement('div');
    sdvContainer.id = 'StardewCompanionUI';
    sdvContainer.style.cssText = `
        position:fixed; bottom:10px; right:10px; z-index:9999;
        background:rgba(101, 67, 33, 0.95); /* Tierra/Madera */
        color:#FFFFFF; padding:15px 20px; border-radius:10px;
        font-family: 'Consolas', 'Monospace', sans-serif; font-size:12px;
        display:flex; flex-direction:column; gap:10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.8), 0 0 15px rgba(56, 118, 29, 0.7);
        border: 3px solid #38761d; /* Verde Hierba */
        min-width: 250px;
        backdrop-filter: blur(5px);
    `;

    const titleBar = document.createElement('div');
    titleBar.innerHTML = '🌱 FARMER\'S COMPANION MOD ⛏️';
    titleBar.style.cssText = `
        font-weight: bold; font-size: 14px; text-align: center; cursor: grab;
        color: #FFD700; /* Oro */
        background: rgba(0, 0, 0, 0.7);
        text-shadow: 0 0 5px #38761d;
        margin: -15px -20px 8px -20px; padding: 10px 20px;
        border-bottom: 2px solid #FFD700;
        border-radius: 7px 7px 0 0;
    `;
    sdvContainer.appendChild(titleBar);

    const contentDiv = document.createElement('div');
    contentDiv.style.cssText = `display:flex; flex-direction:column; gap:8px;`;
    sdvContainer.appendChild(contentDiv);

    const sdvInputStyle = `
        flex-grow: 1; padding: 6px 10px; border-radius: 5px;
        border: 2px solid #FFD700; background: rgba(0, 0, 0, 0.5);
        color: #FFFFFF; font-size: 11px; font-family: monospace;
        transition: all 0.2s ease;
    `;

    function createSdvRow(parent, labelText, inputElement) {
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

    // Selector de Enemigo/Objetivo (Target)
    const enemySelect = document.createElement('select');
    enemySelect.style.cssText = sdvInputStyle;
    createSdvRow(contentDiv, '👤 Objetivo:', enemySelect);

    // Selector de Herramientas
    const toolSelect = document.createElement('select');
    toolSelect.style.cssText = sdvInputStyle;
    for (const name in SDV_TOOLS) {
        const opt = document.createElement('option');
        opt.value = SDV_TOOLS[name];
        opt.textContent = name;
        toolSelect.appendChild(opt);
    }
    toolSelect.value = SDV_TOOLS['Ninguno'];
    createSdvRow(contentDiv, '⛏️ Herramienta:', toolSelect);

    // Selector de Alimentos/Buffs
    const buffSelect = document.createElement('select');
    buffSelect.style.cssText = sdvInputStyle;
    for (const name in SDV_BUFFS) {
        const opt = document.createElement('option');
        opt.value = SDV_BUFFS[name];
        opt.textContent = name;
        buffSelect.appendChild(opt);
    }
    buffSelect.value = SDV_BUFFS['Ninguno'];
    createSdvRow(contentDiv, '🥕 Alimento/Buff:', buffSelect);

    // Auto-reset de selectores (solo uno a la vez)
    toolSelect.addEventListener('change', () => {
        if (toolSelect.value !== '') buffSelect.value = SDV_BUFFS['Ninguno'];
    });

    buffSelect.addEventListener('change', () => {
        if (buffSelect.value !== '') toolSelect.value = SDV_TOOLS['Ninguno'];
    });

    // Medidor de Calidad/Nivel (Intensity)
    const powerInput = document.createElement('input');
    powerInput.type = 'range';
    powerInput.min = '1';
    powerInput.max = '5';
    powerInput.value = '3';
    powerInput.style.cssText = `flex-grow: 1; accent-color: ${SDV_COLORS.P};`;
    createSdvRow(contentDiv, '✨ Calidad:', powerInput);

    const powerLabel = document.createElement('span');
    powerLabel.style.cssText = `color: ${SDV_COLORS.Y}; font-size: 10px; text-align: center; margin-top: -5px;`;
    powerLabel.textContent = `Herramienta: ${POWER_INTENSITY_LABELS[powerInput.value - 1]}`;
    contentDiv.appendChild(powerLabel);
    powerInput.addEventListener('input', () => {
        powerLabel.textContent = `Herramienta: ${POWER_INTENSITY_LABELS[powerInput.value - 1]}`;
    });

    // Toggle de Repetición ("Flujo de Trabajo")
    const repeatToggle = document.createElement('input');
    repeatToggle.type = 'checkbox';
    repeatToggle.style.cssText = `transform: scale(1.2); accent-color: ${SDV_COLORS.G};`;
    const repeatLabel = document.createElement('label');
    repeatLabel.textContent = ' 🔄 Flujo de Trabajo (Trabajo Continuo)';
    repeatLabel.style.cssText = `color: ${SDV_COLORS.G}; font-weight: bold; cursor: pointer;`;
    const repeatWrapper = document.createElement('div');
    repeatWrapper.style.cssText = `display:flex; align-items:center; gap:8px; justify-content: center;`;
    repeatWrapper.appendChild(repeatToggle);
    repeatWrapper.appendChild(repeatLabel);
    contentDiv.appendChild(repeatWrapper);

    // Botón de Activación
    const activateBtn = document.createElement('button');
    activateBtn.textContent = '👨‍🌾 USAR HERRAMIENTA / CONSUMIR 🎣';
    activateBtn.disabled = true;
    activateBtn.style.cssText = `
        padding: 10px 15px; border-radius: 8px; border: none;
        background: linear-gradient(45deg, ${SDV_COLORS.G}, ${SDV_COLORS.D});
        color: #FFD700; font-weight: bold; font-size: 14px;
        cursor: pointer; transition: all 0.2s ease;
        box-shadow: 0 3px 10px rgba(56, 118, 29, 0.7);
        font-family: 'Monospace', monospace;
        &:hover { background: linear-gradient(45deg, ${SDV_COLORS.D}, ${SDV_COLORS.G}); transform: translateY(-1px); }
        &:disabled { background: #666; cursor: not-allowed; opacity: 0.5; transform: none; }
    `;
    contentDiv.appendChild(activateBtn);

    // Botón de Parada
    stopBtn = document.createElement('button');
    stopBtn.textContent = '⛔ DEJAR DE TRABAJAR (Stop)';
    stopBtn.disabled = true;
    stopBtn.style.cssText = `
        margin-top: 5px; padding: 8px 12px; border-radius: 6px; border: none;
        background: linear-gradient(45deg, #B22222, #8B0000);
        color: white; font-weight: bold; font-size: 12px;
        cursor: pointer; transition: all 0.2s ease;
        box-shadow: 0 2px 8px rgba(178, 34, 34, 0.5);
        font-family: 'Monospace', monospace;
        &:hover { background: linear-gradient(45deg, #8B0000, #B22222); transform: translateY(-1px); }
        &:disabled { background: #666; cursor: not-allowed; opacity: 0.5; transform: none; }
    `;
    contentDiv.appendChild(stopBtn);

    document.body.appendChild(sdvContainer);

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
        enemySelect.textContent = '👤 Tú (Granjero)';

        playerRows.forEach(row => {
            if (row.dataset.self === 'true') return;
            if (row.dataset.playerid === '0') return;
            const name = row.querySelector('.playerlist-name a')?.textContent || `Enemy ${row.dataset.playerid}`;
            const opt = document.createElement('option');
            opt.value = row.dataset.playerid;
            const sdvName = name.includes('Police') ? '👹 Monstruo de Mina' : '🐐 Vaca Leche';
            opt.textContent = `🎯 ${sdvName} (${name})`;
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
        dragOffsetX = e.clientX - sdvContainer.getBoundingClientRect().left;
        dragOffsetY = e.clientY - sdvContainer.getBoundingClientRect().top;
        titleBar.style.cursor = 'grabbing';
    });
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        let newX = e.clientX - dragOffsetX;
        let newY = e.clientY - dragOffsetY;
        newX = Math.max(0, Math.min(newX, window.innerWidth - sdvContainer.offsetWidth));
        newY = Math.max(0, Math.min(newY, window.innerHeight - sdvContainer.offsetHeight));
        sdvContainer.style.left = newX + 'px';
        sdvContainer.style.top = newY + 'px';
        sdvContainer.style.right = 'auto';
        sdvContainer.style.bottom = 'auto';
    });
    document.addEventListener('mouseup', () => {
        isDragging = false;
        titleBar.style.cursor = 'grab';
    });

    // Botón de parada
    stopBtn.addEventListener('click', () => {
        console.log('⛔ Dejando de trabajar. ¡Hora de descansar!');
        stopSignal = true;

        if (activePowerInterval) {
            clearInterval(activePowerInterval);
            activePowerInterval = null;
        }

        activateBtn.textContent = '👨‍🌾 USAR HERRAMIENTA / CONSUMIR 🎣';
        activateBtn.style.background = `linear-gradient(45deg, ${SDV_COLORS.G}, ${SDV_COLORS.D})`;
        activateBtn.disabled = false;
        stopBtn.disabled = true;
    });

    // Botón principal de activación
    activateBtn.addEventListener('click', async () => {
        const playerId = enemySelect.value;
        if (!playerId) {
            alert('🎯 ¡Escoge un Objetivo o un NPC!');
            return;
        }

        const selectedTool = toolSelect.value;
        const selectedBuff = buffSelect.value;
        const intensity = parseInt(powerInput.value);

        if (activePowerInterval) {
            stopBtn.click();
            return;
        }

        let actionToExecute = null;
        let actionName = '';

        if (selectedTool && selectedTool.startsWith('tool:')) {
            switch (selectedTool) {
                case 'tool:pickaxe_mining': actionToExecute = () => pickaxeMining(playerId, intensity); actionName = 'Pico (Minería)'; break;
                case 'tool:watering_can_spray': actionToExecute = () => wateringCanSpray(playerId, intensity); actionName = 'Regadera (Riego)'; break;
                case 'tool:scythe_cut': actionToExecute = () => scytheCut(playerId, intensity); actionName = 'Guadaña (Corte)'; break;
                case 'tool:fishing_rod_impact': actionToExecute = () => fishingRodImpact(playerId, intensity); actionName = 'Caña de Pescar'; break;
                default: return;
            }
        } else if (selectedBuff && selectedBuff.startsWith('buff:')) {
            switch (selectedBuff) {
                case 'buff:energy_potion_full': actionToExecute = () => energyPotionFull(playerId, intensity); actionName = 'Poción de Energía'; break;
                case 'buff:lucky_charm_luck': actionToExecute = () => luckyCharmLuck(playerId, intensity); actionName = 'Amuleto de la Suerte'; break;
                case 'buff:mushroom_stamina': actionToExecute = () => mushroomStamina(playerId, intensity); actionName = 'Seta Común'; break;
                case 'buff:fairy_dust_growth': actionToExecute = () => fairyDustGrowth(playerId, intensity); actionName = 'Polvo de Hada'; break;
                default: return;
            }
        } else {
            alert('🔺 ¡Debes seleccionar una Herramienta o un Alimento!');
            return;
        }

        stopSignal = false;
        activateBtn.disabled = true;
        stopBtn.disabled = false;

        try {
            if (repeatToggle.checked) {
                activateBtn.textContent = '🔄 DETENER FLUJO DE TRABAJO';
                activateBtn.style.background = `linear-gradient(45deg, #B22222, #8B0000)`;
                activateBtn.disabled = false;

                console.log(`🔥 ¡Iniciando Flujo de Trabajo Continuo con ${actionName}!`);

                const continuousAction = async () => {
                    if (stopSignal || !repeatToggle.checked) {
                        if (activePowerInterval) clearInterval(activePowerInterval);
                        activePowerInterval = null;
                        activateBtn.textContent = '👨‍🌾 USAR HERRAMIENTA / CONSUMIR 🎣';
                        activateBtn.style.background = `linear-gradient(45deg, ${SDV_COLORS.G}, ${SDV_COLORS.D})`;
                        stopBtn.disabled = true;
                        return;
                    }

                    try {
                        await actionToExecute();
                    } catch (error) {
                        console.error(`Error durante el Flujo de Trabajo (${actionName}):`, error);
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
        console.log('¡GRACIAS POR JUGAR! ¡Vuelve mañana para cosechar! -Stardew Valley.');
    });

    // Inicialización
    refreshPlayerList();
    console.log('✨ Farmer\'s Companion Mod cargado. ¡Manos a la obra! ✨');

})();