// ==UserScript==
// @name         🎮 Smash Companion Mod (Super Smash Bros. Edition)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Use the Smash Attack, throw Poké Balls, and use the Hammer! Turn Drawaria into a Smash Bros. battlefield.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @match        https://*.drawaria.online/*
// @icon         https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e558db9c-ca9a-4fb7-af65-60c6c53244b8/dhduvrg-6a9727d6-2bfe-4ae2-87b5-61e394a89b6c.png/v1/fill/w_894,h_894/super_smash_bros_ultimate_dock_icon_by_lexiloo826_dhduvrg-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9OTAwIiwicGF0aCI6Ii9mL2U1NThkYjljLWNhOWEtNGZiNy1hZjY1LTYwYzZjNTMyNDRiOC9kaGR1dnJnLTZhOTcyN2Q2LTJiZmUtNGFlMi04N2I1LTYxZTM5NGE4OWI2Yy5wbmciLCJ3aWR0aCI6Ijw9OTAwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.y8Gr96_NJdBcU6cxuCE0m_lnE6tnd-Bcxo8J_jipKAU
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550910/%F0%9F%8E%AE%20Smash%20Companion%20Mod%20%28Super%20Smash%20Bros%20Edition%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550910/%F0%9F%8E%AE%20Smash%20Companion%20Mod%20%28Super%20Smash%20Bros%20Edition%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ----------------------------------------------------------------------------------
    //  CONFIGURACIÓN Y ASSETS DE SUPER SMASH BROS.
    // ---------------------------------------------------------------------------------- */

    // Colores de la paleta Smash (Ataques, Daño, Ítems y Efectos)
    const SSB_COLORS = {
        'R': '#FF0000',  // Rojo (Daño Alto / Explosión)
        'B': '#0000FF',  // Azul (Ataque de Hielo / Escudo)
        'Y': '#FFFF00',  // Amarillo (Estrellas / Impacto)
        'P': '#FF00FF',  // Rosa/Fucsia (Efecto de Hada / Curación)
        'G': '#00FF00',  // Verde (Curación/Vida)
        'K': '#000000',  // Negro (Bordes / Humo)
        'W': '#FFFFFF',  // Blanco (Brillo / Rayo)
        'S': '#A9A9A9'   // Gris Plata (Escudo Roto / Martillo)
    };

    // Estructuras de Pixel Art detalladas (Iconos de Batalla e Ítems)
    const SSB_PIXEL_ASSETS = {
        // Estrellas de KO (Impacto)
        'KO_STARS': {
            art: [
                "  Y Y  ",
                " Y Y Y ",
                "Y Y W Y Y",
                " Y Y Y ",
                "  Y Y  "
            ],
            colors: { 'Y': SSB_COLORS.Y, 'W': SSB_COLORS.W, 'K': SSB_COLORS.K }
        },
        // Pokebola (Lanzamiento)
        'POKEBALL': {
            art: [
                "  R R  ",
                " R W R ",
                "R W K W R",
                " R K R ",
                "  K K  "
            ],
            colors: { 'R': SSB_COLORS.R, 'W': SSB_COLORS.W, 'K': SSB_COLORS.K }
        },
        // Martillo (Item)
        'HAMMER_HEAD': {
            art: [
                " S S S ",
                "S S S S",
                " S S S ",
                " S G S ",
                " S G S "
            ],
            colors: { 'S': SSB_COLORS.S, 'G': SSB_COLORS.G }
        }
    };

    // Ataques Especiales (Special Moves)
    const SSB_ATTACKS = {
        'Ninguno': '',
        '🤜 Ataque Smash (KO)': 'attack:smash_fist_ko',
        '🔥 Bola de Fuego (Mario/MegaMan)': 'attack:fireball_flinch',
        '🧊 Ataque de Hielo (Ice Climbers)': 'attack:ice_blast_freeze',
    };

    // Ítems y Buffs (Items & Status)
    const SSB_ITEMS = {
        'Ninguno': '',
        '💊 Cápsula de Curación': 'item:capsule_heal',
        '🔨 Martillo (Furia)': 'item:hammer_fury',
        '🌟 Estrella de Invencibilidad': 'item:star_invincibility',
        '📦 Pokebola (Lanzamiento)': 'item:pokeball_launch',
    };

    const DAMAGE_PERCENT_LABELS = ['0% (Verde)', '50% (Amarillo)', '100% (Naranja)', '150% (Rojo)', '300% (Mortal)'];

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
                const color = colors[char] || SSB_COLORS[char];

                if (color && char !== ' ') {
                    const pX1 = startX + col * pixelSize;
                    const pY1 = startY + row * pixelSize;
                    const pX2 = pX1 + pixelSize;
                    const pY2 = pY1 + pixelSize;

                    // Relleno del pixel
                    for (let i = 0; i < pixelSize; i += 2) {
                        sendAndDrawCommand(pX1, pY1 + i, pX2, pY1 + i, color, 2);
                    }
                    // Borde negro (definición del pixel art)
                    sendAndDrawCommand(pX1, pY1, pX2, pY1, SSB_COLORS.K, 1);
                }
            }
        }
    }


    /* ----------------------------------------------------------------------------------
    //  FUNCIONES DE ATAQUE (SPECIAL MOVES) SUPER SMASH BROS.
    // ---------------------------------------------------------------------------------- */

    // 1. Ataque Smash (Efecto KO)
    async function smashFistKO(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const endX = target.x;
        const endY = target.y;
        const damageColor = SSB_COLORS.R;
        const impactDuration = 800;
        const startTime = Date.now();
        const thickness = 10 + intensity * 5;

        // 1. Efecto de carga (rojo)
        for (let i = 0; i < 5; i++) {
            if (stopSignal) break;
            const r = 5 + i * 5;
            const x = endX + r;
            const y = endY + r;
            sendAndDrawCommand(endX, endY, x, y, damageColor, 3);
            await new Promise(r => setTimeout(r, 50));
        }

        // 2. Impacto (Explosión y Estrellas de KO)
        while (Date.now() - startTime < impactDuration) {
            if (stopSignal) break;

            // Gran círculo rojo de impacto
            for (let i = 0; i < 15; i++) {
                const angle = Math.random() * Math.PI * 2;
                const r = 30 + Math.random() * 20;
                const x = endX + r * Math.cos(angle);
                const y = endY + r * Math.sin(angle);
                sendAndDrawCommand(endX, endY, x, y, damageColor, thickness);
            }

            // Dibuja Estrellas de KO
            drawPixelArt(endX + 50, endY - 50, SSB_PIXEL_ASSETS.KO_STARS, 1 + intensity * 0.2);

            await new Promise(r => setTimeout(r, 100));
        }
    }

    // 2. Rayo (Stun)
    async function thunderJoltStun(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const endX = target.x;
        const endY = target.y;
        const lightningColor = SSB_COLORS.Y; // Amarillo/Eléctrico
        const duration = 1200;
        const startTime = Date.now();

        // Rayo que golpea desde arriba
        while (Date.now() - startTime < duration) {
            if (stopSignal) break;
            const count = 10 + intensity * 5;

            // Líneas de rayo zigzagueantes
            let currentX = endX;
            let currentY = endY - 100;
            for (let i = 0; i < 10; i++) {
                const nextX = currentX + (Math.random() - 0.5) * 20;
                const nextY = currentY + 10;
                sendAndDrawCommand(currentX, currentY, nextX, nextY, lightningColor, 5);
                currentX = nextX;
                currentY = nextY;
            }

            // Efecto de parálisis (Brillo blanco)
            sendAndDrawCommand(endX, endY, endX, endY, SSB_COLORS.W, 20);

            await new Promise(r => setTimeout(r, 50));
        }
    }

    // 3. Bola de Fuego (Flinch/Empuje)
    async function fireballFlinch(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const endX = target.x;
        const endY = target.y;
        const fireColor = SSB_COLORS.R;
        const startX = endX - 100;

        // Trayectoria de la bola de fuego (Horizontal)
        for (let i = 0; i < 15; i++) {
            if (stopSignal) break;
            const progress = i / 14;
            const currentX = startX + (endX - startX) * progress;
            const thickness = 5 + intensity * 2;

            // Fuego (rojo y amarillo)
            for (let j = 0; j < 5; j++) {
                const offset = (Math.random() - 0.5) * 10;
                const color = (Math.random() > 0.5) ? fireColor : SSB_COLORS.Y;
                sendAndDrawCommand(currentX + offset, endY + offset, currentX + offset, endY + offset, color, thickness);
            }
            await new Promise(r => setTimeout(r, 40));
        }

        // Impacto de empuje
        sendAndDrawCommand(endX, endY, endX + 50, endY, SSB_COLORS.R, 5);
    }

    // 4. Ataque de Hielo (Freeze)
    async function iceBlastFreeze(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const endX = target.x;
        const endY = target.y;
        const iceColor = SSB_COLORS.B; // Azul
        const duration = 1500;
        const startTime = Date.now();

        // Efecto de congelación (partículas azules y líneas de hielo)
        while (Date.now() - startTime < duration) {
            if (stopSignal) break;
            const count = 8 + intensity * 3;
            const maxRadius = 50;

            // Partículas de hielo azules que rodean al objetivo
            for (let i = 0; i < count; i++) {
                const r = maxRadius * Math.random();
                const angle = Math.random() * Math.PI * 2;
                const x = endX + r * Math.cos(angle);
                const y = endY + r * Math.sin(angle);
                const color = (Math.random() > 0.5) ? iceColor : SSB_COLORS.W;
                sendAndDrawCommand(x, y, x, y, 5); // Puntos de hielo
            }

            // Dibuja un "bloque" de hielo alrededor
            sendAndDrawCommand(endX - maxRadius, endY - maxRadius, endX + maxRadius, endY - maxRadius, iceColor, 3);
            sendAndDrawCommand(endX - maxRadius, endY - maxRadius, endX - maxRadius, endY + maxRadius, iceColor, 3);

            await new Promise(r => setTimeout(r, 100));
        }
    }


    /* ----------------------------------------------------------------------------------
    //  FUNCIONES DE ÍTEMS Y BUFFS (ITEMS) SUPER SMASH BROS.
    // ---------------------------------------------------------------------------------- */

    // 5. Cápsula de Curación
    async function capsuleHeal(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const duration = 1000;
        const startTime = Date.now();
        const healColor = SSB_COLORS.P; // Rosa/Fucsia (Efecto de Hada/Curación)

        // Partículas rosas que descienden sobre el objetivo
        while (Date.now() - startTime < duration) {
            if (stopSignal) break;
            const count = 10 + intensity * 3;

            for (let i = 0; i < count; i++) {
                const x = target.x + (Math.random() - 0.5) * 40;
                const startY = target.y - 50;
                const endY = target.y + 20;
                const currentY = startY + (endY - startY) * (Math.random());
                sendAndDrawCommand(x, currentY, x, currentY + 5, healColor, 4);
            }

            await new Promise(r => setTimeout(r, 80));
        }
    }

    // 6. Martillo (Furia)
    async function hammerFury(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const duration = 2000;
        const startTime = Date.now();
        const furyColor = SSB_COLORS.S; // Plata (Cabeza de martillo)

        // Martillo golpeando repetidamente sobre el objetivo
        while (Date.now() - startTime < duration) {
            if (stopSignal) break;

            const swingX = target.x + (Math.sin(Date.now() * 0.02) * 50);
            const swingY = target.y - 50;

            // Dibuja el Martillo
            drawPixelArt(swingX, swingY, SSB_PIXEL_ASSETS.HAMMER_HEAD, 1.5);

            // Efecto de onda de choque al golpear
            sendAndDrawCommand(target.x - 30, target.y, target.x + 30, target.y, furyColor, 10);

            await new Promise(r => setTimeout(r, 150 - intensity * 15));
        }
    }

    // 7. Estrella de Invencibilidad
    async function starInvincibility(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const duration = 3000;
        const startTime = Date.now();
        const starColors = [SSB_COLORS.R, SSB_COLORS.Y, SSB_COLORS.B];

        // Ráfaga de colores brillantes alrededor del objetivo
        while (Date.now() - startTime < duration) {
            if (stopSignal) break;
            const count = 15 + intensity * 5;
            const maxRadius = 60;

            for (let i = 0; i < count; i++) {
                const r = maxRadius * Math.random();
                const angle = Math.random() * Math.PI * 2;
                const x = target.x + r * Math.cos(angle);
                const y = target.y + r * Math.sin(angle);
                const color = starColors[Math.floor(Math.random() * 3)];
                sendAndDrawCommand(target.x, target.y, x, y, color, 3);
            }
            await new Promise(r => setTimeout(r, 80));
        }
    }

    // 8. Pokebola (Lanzamiento)
    async function pokeballLaunch(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const endX = target.x;
        const endY = target.y;
        const startX = canvas.width * 0.2;
        const startY = canvas.height * 0.8;

        // Trayectoria parabólica de la Pokebola
        for (let i = 0; i < 20; i++) {
            if (stopSignal) break;
            const progress = i / 19;
            const currentX = startX + (endX - startX) * progress;
            // Simulación de parábola (curva en Y)
            const parabolaFactor = Math.sin(progress * Math.PI);
            const currentY = startY + (endY - startY) * progress - 100 * parabolaFactor;

            // Dibuja la Pokebola
            drawPixelArt(currentX, currentY, SSB_PIXEL_ASSETS.POKEBALL, 1.2);
            await new Promise(r => setTimeout(r, 40));
        }

        // Efecto de salida del Pokémon (gran destello de luz)
        sendAndDrawCommand(endX, endY, endX, endY, SSB_COLORS.W, 50);
    }

    /* ----------------------------------------------------------------------------------
    //  INTERFAZ DE USUARIO Y GESTIÓN DE EVENTOS
    // ---------------------------------------------------------------------------------- */

    const ssbContainer = document.createElement('div');
    ssbContainer.id = 'SmashCompanionUI';
    ssbContainer.style.cssText = `
        position:fixed; bottom:10px; right:10px; z-index:9999;
        background:rgba(0, 0, 0, 0.95); /* Negro (Fondo de Pantalla de VS) */
        color:#FFFFFF; padding:15px 20px; border-radius:10px;
        font-family: 'Arial Black', 'Impact', sans-serif; font-size:12px;
        display:flex; flex-direction:column; gap:10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.9), 0 0 15px rgba(255, 0, 0, 0.6);
        border: 3px solid #FF0000; /* Rojo Daño */
        min-width: 250px;
        backdrop-filter: blur(5px);
    `;

    const titleBar = document.createElement('div');
    titleBar.innerHTML = '🎮 SMASH COMPANION MOD 💥';
    titleBar.style.cssText = `
        font-weight: bold; font-size: 14px; text-align: center; cursor: grab;
        color: #FFFF00; /* Amarillo Impacto */
        background: rgba(169, 169, 169, 0.7); /* Gris Plata */
        text-shadow: 0 0 5px #FF0000;
        margin: -15px -20px 8px -20px; padding: 10px 20px;
        border-bottom: 2px solid #FFFF00;
        border-radius: 7px 7px 0 0;
    `;
    ssbContainer.appendChild(titleBar);

    const contentDiv = document.createElement('div');
    contentDiv.style.cssText = `display:flex; flex-direction:column; gap:8px;`;
    ssbContainer.appendChild(contentDiv);

    const ssbInputStyle = `
        flex-grow: 1; padding: 6px 10px; border-radius: 5px;
        border: 2px solid #FF0000; background: rgba(0, 0, 0, 0.7);
        color: #FFFFFF; font-size: 11px; font-family: monospace;
        transition: all 0.2s ease;
    `;

    function createSsbRow(parent, labelText, inputElement) {
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

    // Selector de Oponente (Target)
    const enemySelect = document.createElement('select');
    enemySelect.style.cssText = ssbInputStyle;
    createSsbRow(contentDiv, '👤 Oponente:', enemySelect);

    // Selector de Ataques
    const attackSelect = document.createElement('select');
    attackSelect.style.cssText = ssbInputStyle;
    for (const name in SSB_ATTACKS) {
        const opt = document.createElement('option');
        opt.value = SSB_ATTACKS[name];
        opt.textContent = name;
        attackSelect.appendChild(opt);
    }
    attackSelect.value = SSB_ATTACKS['Ninguno'];
    createSsbRow(contentDiv, '⚔️ SPECIAL:', attackSelect);

    // Selector de Ítems
    const itemSelect = document.createElement('select');
    itemSelect.style.cssText = ssbInputStyle;
    for (const name in SSB_ITEMS) {
        const opt = document.createElement('option');
        opt.value = SSB_ITEMS[name];
        opt.textContent = name;
        itemSelect.appendChild(opt);
    }
    itemSelect.value = SSB_ITEMS['Ninguno'];
    createSsbRow(contentDiv, '📦 ÍTEM:', itemSelect);

    // Auto-reset de selectores (solo uno a la vez)
    attackSelect.addEventListener('change', () => {
        if (attackSelect.value !== '') itemSelect.value = SSB_ITEMS['Ninguno'];
    });

    itemSelect.addEventListener('change', () => {
        if (itemSelect.value !== '') attackSelect.value = SSB_ATTACKS['Ninguno'];
    });

    // Medidor de Daño/Intensidad
    const powerInput = document.createElement('input');
    powerInput.type = 'range';
    powerInput.min = '1';
    powerInput.max = '5';
    powerInput.value = '3';
    powerInput.style.cssText = `flex-grow: 1; accent-color: ${SSB_COLORS.R};`;
    createSsbRow(contentDiv, '🩸 Daño %:', powerInput);

    const powerLabel = document.createElement('span');
    powerLabel.style.cssText = `color: ${SSB_COLORS.Y}; font-size: 10px; text-align: center; margin-top: -5px;`;
    powerLabel.textContent = `Daño Simul.: ${DAMAGE_PERCENT_LABELS[powerInput.value - 1]}`;
    contentDiv.appendChild(powerLabel);
    powerInput.addEventListener('input', () => {
        powerLabel.textContent = `Daño Simul.: ${DAMAGE_PERCENT_LABELS[powerInput.value - 1]}`;
    });

    // Toggle de Repetición ("Lucha Continua")
    const repeatToggle = document.createElement('input');
    repeatToggle.type = 'checkbox';
    repeatToggle.style.cssText = `transform: scale(1.2); accent-color: ${SSB_COLORS.R};`;
    const repeatLabel = document.createElement('label');
    repeatLabel.textContent = ' 🔄 Lucha Continua (Spam)';
    repeatLabel.style.cssText = `color: ${SSB_COLORS.R}; font-weight: bold; cursor: pointer;`;
    const repeatWrapper = document.createElement('div');
    repeatWrapper.style.cssText = `display:flex; align-items:center; gap:8px; justify-content: center;`;
    repeatWrapper.appendChild(repeatToggle);
    repeatWrapper.appendChild(repeatLabel);
    contentDiv.appendChild(repeatWrapper);

    // Botón de Activación
    const activateBtn = document.createElement('button');
    activateBtn.textContent = '💥 SMASH ATTACK / USAR ÍTEM 📦';
    activateBtn.disabled = true;
    activateBtn.style.cssText = `
        padding: 10px 15px; border-radius: 8px; border: none;
        background: linear-gradient(45deg, ${SSB_COLORS.R}, ${SSB_COLORS.K});
        color: ${SSB_COLORS.Y}; font-weight: bold; font-size: 14px;
        cursor: pointer; transition: all 0.2s ease;
        box-shadow: 0 3px 10px rgba(255, 0, 0, 0.5);
        font-family: 'Impact', sans-serif;
        &:hover { background: linear-gradient(45deg, ${SSB_COLORS.K}, ${SSB_COLORS.R}); transform: translateY(-1px); }
        &:disabled { background: #666; cursor: not-allowed; opacity: 0.5; transform: none; }
    `;
    contentDiv.appendChild(activateBtn);

    // Botón de Parada
    stopBtn = document.createElement('button');
    stopBtn.textContent = '⛔ TERMINAR PARTIDA (Stop)';
    stopBtn.disabled = true;
    stopBtn.style.cssText = `
        margin-top: 5px; padding: 8px 12px; border-radius: 6px; border: none;
        background: linear-gradient(45deg, ${SSB_COLORS.B}, ${SSB_COLORS.K});
        color: white; font-weight: bold; font-size: 12px;
        cursor: pointer; transition: all 0.2s ease;
        box-shadow: 0 2px 8px rgba(0, 0, 255, 0.5);
        font-family: 'Impact', sans-serif;
        &:hover { background: linear-gradient(45deg, ${SSB_COLORS.K}, ${SSB_COLORS.B}); transform: translateY(-1px); }
        &:disabled { background: #666; cursor: not-allowed; opacity: 0.5; transform: none; }
    `;
    contentDiv.appendChild(stopBtn);

    document.body.appendChild(ssbContainer);

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
        enemySelect.textContent = '🔴 Tú (Jugador 1)';

        playerRows.forEach(row => {
            if (row.dataset.self === 'true') return;
            if (row.dataset.playerid === '0') return;
            const name = row.querySelector('.playerlist-name a')?.textContent || `Enemy ${row.dataset.playerid}`;
            const opt = document.createElement('option');
            opt.value = row.dataset.playerid;
            // Asigna un personaje genérico
            const ssbName = name.includes('Police') ? '🎯 Captain Falcon' : '🎯 Bowser';
            opt.textContent = `${ssbName} (${name})`;
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
        dragOffsetX = e.clientX - ssbContainer.getBoundingClientRect().left;
        dragOffsetY = e.clientY - ssbContainer.getBoundingClientRect().top;
        titleBar.style.cursor = 'grabbing';
    });
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        let newX = e.clientX - dragOffsetX;
        let newY = e.clientY - dragOffsetY;
        newX = Math.max(0, Math.min(newX, window.innerWidth - ssbContainer.offsetWidth));
        newY = Math.max(0, Math.min(newY, window.innerHeight - ssbContainer.offsetHeight));
        ssbContainer.style.left = newX + 'px';
        ssbContainer.style.top = newY + 'px';
        ssbContainer.style.right = 'auto';
        ssbContainer.style.bottom = 'auto';
    });
    document.addEventListener('mouseup', () => {
        isDragging = false;
        titleBar.style.cursor = 'grab';
    });

    // Botón de parada
    stopBtn.addEventListener('click', () => {
        console.log('⛔ Partida terminada. ¡Buen juego!');
        stopSignal = true;

        if (activePowerInterval) {
            clearInterval(activePowerInterval);
            activePowerInterval = null;
        }

        activateBtn.textContent = '💥 SMASH ATTACK / USAR ÍTEM 📦';
        activateBtn.style.background = `linear-gradient(45deg, ${SSB_COLORS.R}, ${SSB_COLORS.K})`;
        activateBtn.disabled = false;
        stopBtn.disabled = true;
    });

    // Botón principal de activación
    activateBtn.addEventListener('click', async () => {
        const playerId = enemySelect.value;
        if (!playerId) {
            alert('🎯 ¡Escoge un Oponente!');
            return;
        }

        const selectedAttack = attackSelect.value;
        const selectedItem = itemSelect.value;
        const intensity = parseInt(powerInput.value);

        if (activePowerInterval) {
            stopBtn.click();
            return;
        }

        let actionToExecute = null;
        let actionName = '';

        if (selectedAttack && selectedAttack.startsWith('attack:')) {
            // Ataque Especial
            switch (selectedAttack) {
                case 'attack:smash_fist_ko': actionToExecute = () => smashFistKO(playerId, intensity); actionName = 'Ataque Smash KO'; break;
                case 'attack:thunder_jolt_stun': actionToExecute = () => thunderJoltStun(playerId, intensity); actionName = 'Rayo Stun'; break;
                case 'attack:fireball_flinch': actionToExecute = () => fireballFlinch(playerId, intensity); actionName = 'Bola de Fuego'; break;
                case 'attack:ice_blast_freeze': actionToExecute = () => iceBlastFreeze(playerId, intensity); actionName = 'Ataque de Hielo'; break;
                default: return;
            }
        } else if (selectedItem && selectedItem.startsWith('item:')) {
            // Uso de Ítem
            switch (selectedItem) {
                case 'item:capsule_heal': actionToExecute = () => capsuleHeal(playerId, intensity); actionName = 'Cápsula de Curación'; break;
                case 'item:hammer_fury': actionToExecute = () => hammerFury(playerId, intensity); actionName = 'Martillo'; break;
                case 'item:star_invincibility': actionToExecute = () => starInvincibility(playerId, intensity); actionName = 'Estrella de Invencibilidad'; break;
                case 'item:pokeball_launch': actionToExecute = () => pokeballLaunch(playerId, intensity); actionName = 'Pokebola'; break;
                default: return;
            }
        } else {
            alert('🔺 ¡Debes seleccionar un Ataque o un Ítem!');
            return;
        }

        stopSignal = false;
        activateBtn.disabled = true;
        stopBtn.disabled = false;

        try {
            if (repeatToggle.checked) {
                activateBtn.textContent = '🔄 DETENER LUCHA CONTINUA';
                activateBtn.style.background = `linear-gradient(45deg, ${SSB_COLORS.B}, ${SSB_COLORS.K})`;
                activateBtn.disabled = false;

                console.log(`🔥 ¡Iniciando Lucha Continua con ${actionName}! ¡No hay piedad!`);

                const continuousAction = async () => {
                    if (stopSignal || !repeatToggle.checked) {
                        if (activePowerInterval) clearInterval(activePowerInterval);
                        activePowerInterval = null;
                        activateBtn.textContent = '💥 SMASH ATTACK / USAR ÍTEM 📦';
                        activateBtn.style.background = `linear-gradient(45deg, ${SSB_COLORS.R}, ${SSB_COLORS.K})`;
                        stopBtn.disabled = true;
                        return;
                    }

                    try {
                        await actionToExecute();
                    } catch (error) {
                        console.error(`Error durante la Lucha Continua (${actionName}):`, error);
                    }
                };

                await continuousAction();
                if (!stopSignal) {
                    activePowerInterval = setInterval(continuousAction, 1500); // Rápido para simular spam
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
        console.log('¡GRACIAS POR JUGAR! ¡GAME SET! -Super Smash Bros.');
    });

    // Inicialización
    refreshPlayerList();
    console.log('✨ Smash Companion Mod cargado. ¡A luchar! ✨');

})();