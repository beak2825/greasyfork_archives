// ==UserScript==
// @name         ⚡ Pokedéx Companion Mod (Pokémon Edition) 💎
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Throw Poké Balls, unleash Thunderbolts, and use Full Restore! Transform Drawaria into a Pokémon battlefield.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @match        https://*.drawaria.online/*
// @icon         https://media0.giphy.com/media/v1.Y2lkPTZjMDliOTUyeTRianM4ZWM1ZnphamJqZjN2bmd1cWw1YWg1ZzE1cjl5ZmYxY3F0YiZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/kuWN0iF9BLQKk/giphy.gif
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550902/%E2%9A%A1%20Poked%C3%A9x%20Companion%20Mod%20%28Pok%C3%A9mon%20Edition%29%20%F0%9F%92%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/550902/%E2%9A%A1%20Poked%C3%A9x%20Companion%20Mod%20%28Pok%C3%A9mon%20Edition%29%20%F0%9F%92%8E.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ----------------------------------------------------------------------------------
    //  CONFIGURACIÓN Y ASSETS DE POKÉMON
    // ---------------------------------------------------------------------------------- */

    // Colores de la paleta Pokémon (Tipos y Objetos Clave)
    const POKEMON_COLORS = {
        'R': '#FF0000',  // Rojo (Poké Ball)
        'W': '#FFFFFF',  // Blanco (Poké Ball)
        'K': '#000000',  // Negro (Bordes / Línea central)
        'Y': '#FFD700',  // Amarillo (Eléctrico / Rayo)
        'B': '#0000FF',  // Azul (Agua / Hielo)
        'G': '#008000',  // Verde (Planta / Curación)
        'P': '#800080',  // Púrpura (Veneno / Fantasma)
        'O': '#FF4500',  // Naranja (Fuego)
        'S': '#C0C0C0'   // Plata (Acero / Normal)
    };

    // Estructuras de Pixel Art detalladas (Iconos de Combate)
    const POKEMON_PIXEL_ASSETS = {
        // Poké Ball (Lanzamiento)
        'POKE_BALL': {
            art: [
                "  R R  ",
                " R R R ",
                "R R K R R",
                " W W W ",
                "  W W  "
            ],
            colors: { 'R': POKEMON_COLORS.R, 'W': POKEMON_COLORS.W, 'K': POKEMON_COLORS.K }
        },
        // Rayo (Thunderbolt)
        'THUNDER_BOLT': {
            art: [
                " Y Y Y ",
                "  Y Y  ",
                " Y Y Y ",
                " Y Y   ",
                " Y Y Y "
            ],
            colors: { 'Y': POKEMON_COLORS.Y }
        },
        // Símbolo de Veneno (Toxic/Poison)
        'POISON_ICON': {
            art: [
                "  P P  ",
                " P P P ",
                "P P P P P",
                " P P P ",
                "  P P  "
            ],
            colors: { 'P': POKEMON_COLORS.P }
        }
    };

    // Movimientos (Ataques) de Pokémon
    const POKEMON_ATTACKS = {
        'Ninguno': '',
        '⚡ Rayo (Eléctrico)': 'attack:thunderbolt_shock',
        '🔥 Lanzallamas (Fuego)': 'attack:flamethrower_fire',
        '🔮 Bola Sombra (Fantasma)': 'attack:shadow_ball_curse',
    };

    // Objetos/Efectos de Estado de Pokémon
    const POKEMON_EFFECTS = {
        'Ninguno': '',
        '💚 Full Restore (Curación)': 'effect:full_restore_heal',
        '🛡️ Protección (Defensa)': 'effect:protect_shield',
        '🦠 Tóxico (Veneno)': 'effect:toxic_poison',
    };

    const POWER_INTENSITY_LABELS = ['Nivel 10 (Poké Ball)', 'Nivel 30 (Súper Ball)', 'Nivel 50 (Ultra Ball)', 'Nivel 75 (Master Ball)', 'Nivel 100 (Legendario)'];

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
    //  NÚCLEO DE DIBUJO: DETALLE Y SINCRONIZACIÓN
    // ---------------------------------------------------------------------------------- */

    function drawLocalLine(x1, y1, x2, y2, color, thickness) {
        if (!ctx) return;
        const actualThickness = Math.abs(thickness);
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = actualThickness;
        ctx.lineCap = 'butt'; // Mejor para pixel art
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
     * Dibuja pixel art detallado (simulando bloques de píxeles rellenos).
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
                const color = colors[char] || POKEMON_COLORS[char];

                if (color && char !== ' ') {
                    const pX1 = startX + col * pixelSize;
                    const pY1 = startY + row * pixelSize;
                    const pX2 = pX1 + pixelSize;
                    const pY2 = pY1 + pixelSize;

                    // Relleno del pixel (varias líneas pequeñas)
                    for (let i = 0; i < pixelSize; i += 2) {
                        sendAndDrawCommand(pX1, pY1 + i, pX2, pY1 + i, color, 2);
                    }
                    // Borde del pixel (para más definición)
                    sendAndDrawCommand(pX1, pY1, pX2, pY1, POKEMON_COLORS.K, 1);
                }
            }
        }
    }


    /* ----------------------------------------------------------------------------------
    //  FUNCIONES DE ATAQUES (MOVES) POKÉMON
    // ---------------------------------------------------------------------------------- */

    // 1. Rayo (Thunderbolt - Eléctrico)
    async function thunderboltShock(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const startX = canvas.width * 0.2;
        const startY = canvas.height * 0.8;
        const endX = target.x;
        const endY = target.y;
        const duration = 800;
        const startTime = Date.now();
        const thickness = 5 + intensity * 2;
        const colors = [POKEMON_COLORS.Y, POKEMON_COLORS.W];

        // 1. Efecto de carga
        drawPixelArt(startX, startY, POKEMON_PIXEL_ASSETS.THUNDER_BOLT, 1.5);
        await new Promise(r => setTimeout(r, 100));

        // 2. Rayo zig-zag
        for (let i = 0; i < 5; i++) {
            if (stopSignal) break;
            let currentX = startX;
            let currentY = startY;

            for (let j = 0; j < 10; j++) {
                const targetProgress = j / 9;
                const nextX = startX + (endX - startX) * targetProgress + (Math.random() - 0.5) * 20;
                const nextY = startY + (endY - startY) * targetProgress + (Math.random() - 0.5) * 20;
                const color = colors[Math.floor(Math.random() * colors.length)];

                sendAndDrawCommand(currentX, currentY, nextX, nextY, color, thickness);
                currentX = nextX;
                currentY = nextY;
            }
            await new Promise(r => setTimeout(r, 50));
        }

        // 3. Impacto
        sendAndDrawCommand(endX, endY, endX, endY, POKEMON_COLORS.Y, 30);
    }

    // 2. Lanzallamas (Flamethrower - Fuego)
    async function flamethrowerFire(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const endX = target.x;
        const endY = target.y;
        const duration = 1200;
        const startTime = Date.now();
        const thickness = 10 + intensity * 3;
        const colors = [POKEMON_COLORS.R, POKEMON_COLORS.O, POKEMON_COLORS.Y];

        while (Date.now() - startTime < duration) {
            if (stopSignal) break;
            const elapsed = Date.now() - startTime;
            const startX = canvas.width * 0.8;
            const startY = canvas.height * 0.8;

            for (let i = 0; i < 8 + intensity; i++) {
                const progress = elapsed / duration;
                const xOffset = (Math.random() - 0.5) * 50 * (1 - progress);
                const yOffset = (Math.random() - 0.5) * 50 * (1 - progress);
                const color = colors[Math.floor(Math.random() * colors.length)];

                // Ondas de fuego desde abajo a la derecha
                sendAndDrawCommand(startX + xOffset, startY + yOffset, endX + xOffset, endY + yOffset, color, thickness);
            }
            await new Promise(r => setTimeout(r, 30));
        }
    }

    // 3. Hidrobomba (Hydro Pump - Agua)
    async function hydroPumpJet(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const startX = canvas.width * 0.1;
        const startY = canvas.height * 0.8;
        const endX = target.x;
        const endY = target.y;

        // Trayectoria del chorro de agua
        for (let i = 0; i < 20; i++) {
            if (stopSignal) break;
            const progress = i / 19;
            const currentX = startX + (endX - startX) * progress;
            const currentY = startY + (endY - startY) * progress;
            const thickness = 15 + intensity * 5;

            // Chorro principal (azul intenso)
            sendAndDrawCommand(currentX, currentY, currentX, currentY, POKEMON_COLORS.B, thickness);
            // Salpicaduras (blanco/azul claro)
            for (let j = 0; j < 3; j++) {
                 const xSplash = currentX + (Math.random() - 0.5) * 20;
                 const ySplash = currentY + (Math.random() - 0.5) * 20;
                 const color = (Math.random() > 0.5) ? POKEMON_COLORS.B : POKEMON_COLORS.W;
                 sendAndDrawCommand(xSplash, ySplash, xSplash, ySplash, color, 5);
            }

            await new Promise(r => setTimeout(r, 40));
        }
    }

    // 4. Bola Sombra (Shadow Ball - Fantasma)
    async function shadowBallCurse(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const startX = canvas.width * 0.5;
        const startY = canvas.height * 0.5;
        const endX = target.x;
        const endY = target.y;
        const shadowColor = '#360050'; // Púrpura oscuro fantasma

        // Bola de energía Fantasma
        for (let i = 0; i < 15; i++) {
            if (stopSignal) break;
            const progress = i / 14;
            const currentX = startX + (endX - startX) * progress;
            const currentY = startY + (endY - startY) * progress;
            const radius = 10 + intensity * 2;

            // Dibujar círculo Fantasma
            for (let j = 0; j < 8; j++) {
                const angle = (j / 8) * 2 * Math.PI;
                const dist = radius;
                const x = currentX + dist * Math.cos(angle);
                const y = currentY + dist * Math.sin(angle);
                const color = (Math.random() > 0.5) ? POKEMON_COLORS.P : shadowColor;
                sendAndDrawCommand(currentX, currentY, x, y, color, 3);
            }

            await new Promise(r => setTimeout(r, 40));
        }

        // Efecto de Maldición al Impacto
        sendAndDrawCommand(endX, endY, endX, endY, POKEMON_COLORS.P, 40);
    }

    /* ----------------------------------------------------------------------------------
    //  FUNCIONES DE OBJETOS/EFECTOS DE ESTADO POKÉMON
    // ---------------------------------------------------------------------------------- */

    // 5. Full Restore (Curación)
    async function fullRestoreHeal(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const duration = 2500;
        const startTime = Date.now();
        const healColor = POKEMON_COLORS.G;

        while (Date.now() - startTime < duration) {
            if (stopSignal) break;
            const count = 5 + intensity * 2;

            // Partículas verdes de curación ascendentes
            for (let i = 0; i < count; i++) {
                const x = target.x + (Math.random() - 0.5) * 50;
                const startY = target.y + 20;
                const endY = target.y - 50;
                const currentY = startY + (endY - startY) * (Math.random());
                sendAndDrawCommand(x, currentY, x, currentY - 5, healColor, 5);
            }

            await new Promise(r => setTimeout(r, 80));
        }
    }

    // 6. Protección (Protect - Defensa)
    async function protectShield(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const duration = 3000;
        const startTime = Date.now();
        const thickness = 5 + intensity * 2;
        const shieldColor = '#00FF7F'; // Verde brillante

        while (Date.now() - startTime < duration) {
            if (stopSignal) break;
            const elapsed = Date.now() - startTime;
            const radius = 40;
            const pulse = Math.sin(elapsed * 0.025) * 8; // Pulso

            // Dibuja un campo de energía hexagonal/circular
            for (let i = 0; i < 8 + intensity; i++) {
                const angle = (i / 8) * 2 * Math.PI;
                const dist = radius + pulse;
                const x = target.x + dist * Math.cos(angle);
                const y = target.y + dist * Math.sin(angle);
                const color = (elapsed % 300 < 150) ? shieldColor : POKEMON_COLORS.W;
                sendAndDrawCommand(target.x, target.y, x, y, color, thickness);
            }

            await new Promise(r => setTimeout(r, 80));
        }
    }

    // 7. Tóxico (Toxic - Veneno)
    async function toxicPoison(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const duration = 500;
        const startTime = Date.now();
        const thickness = 5 + intensity * 2;

        while (Date.now() - startTime < duration) {
            if (stopSignal) break;
            // Burbujas de veneno púrpura que envuelven al objetivo
            for (let i = 0; i < 5 + intensity; i++) {
                const r = 30 + Math.random() * 20;
                const angle = Math.random() * Math.PI * 2;
                const x = target.x + r * Math.cos(angle);
                const y = target.y + r * Math.sin(angle);
                // Dibuja la burbuja de veneno (punto píxel art)
                drawPixelArt(x, y, POKEMON_PIXEL_ASSETS.POISON_ICON, 0.5 + intensity * 0.1);
            }
            await new Promise(r => setTimeout(r, 100));
        }
    }

    // 8. X Precisión (X Accuracy - Buff)
    async function xAccuracyEvasion(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const duration = 2000;
        const startTime = Date.now();
        const buffColor = POKEMON_COLORS.S; // Plateado

        while (Date.now() - startTime < duration) {
            if (stopSignal) break;
            const count = 5 + intensity * 2;

            // Pequeños destellos plateados que rodean al objetivo (simulando enfoque)
            for (let i = 0; i < count; i++) {
                const r = 30 + Math.random() * 20;
                const angle = Math.random() * Math.PI * 2;
                const x = target.x + r * Math.cos(angle);
                const y = target.y + r * Math.sin(angle);
                sendAndDrawCommand(x, y, x, y, buffColor, 5);
            }
            await new Promise(r => setTimeout(r, 50));
        }
    }


    /* ----------------------------------------------------------------------------------
    //  INTERFAZ DE USUARIO Y GESTIÓN DE EVENTOS
    // ---------------------------------------------------------------------------------- */

    const pokemonContainer = document.createElement('div');
    pokemonContainer.id = 'PokemonCompanionUI';
    pokemonContainer.style.cssText = `
        position:fixed; bottom:10px; right:10px; z-index:9999;
        background:rgba(0, 0, 0, 0.9);
        color:#FFFFFF; padding:15px 20px; border-radius:10px;
        font-family: 'Consolas', 'Monospace', sans-serif; font-size:12px;
        display:flex; flex-direction:column; gap:10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.8), 0 0 15px rgba(255, 0, 0, 0.5);
        border: 3px solid #FF0000; /* Rojo Poké Ball */
        min-width: 250px;
        backdrop-filter: blur(5px);
    `;

    const titleBar = document.createElement('div');
    titleBar.innerHTML = '⚡ POKÉDEX COMPANION MOD 🧪';
    titleBar.style.cssText = `
        font-weight: bold; font-size: 14px; text-align: center; cursor: grab;
        color: #FFD700;
        background: rgba(255, 0, 0, 0.7);
        text-shadow: 0 0 5px #000000;
        margin: -15px -20px 8px -20px; padding: 10px 20px;
        border-bottom: 2px solid #FFD700;
        border-radius: 7px 7px 0 0;
    `;
    pokemonContainer.appendChild(titleBar);

    const contentDiv = document.createElement('div');
    contentDiv.style.cssText = `display:flex; flex-direction:column; gap:8px;`;
    pokemonContainer.appendChild(contentDiv);

    const pokemonInputStyle = `
        flex-grow: 1; padding: 6px 10px; border-radius: 5px;
        border: 2px solid #FFD700; background: rgba(0, 0, 0, 0.7);
        color: #FFFFFF; font-size: 11px; font-family: monospace;
        transition: all 0.2s ease;
    `;

    function createPokemonRow(parent, labelText, inputElement) {
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
    enemySelect.style.cssText = pokemonInputStyle;
    createPokemonRow(contentDiv, '👤 Rival (Pokémon):', enemySelect);

    // Selector de Ataques
    const attackSelect = document.createElement('select');
    attackSelect.style.cssText = pokemonInputStyle;
    for (const name in POKEMON_ATTACKS) {
        const opt = document.createElement('option');
        opt.value = POKEMON_ATTACKS[name];
        opt.textContent = name;
        attackSelect.appendChild(opt);
    }
    attackSelect.value = POKEMON_ATTACKS['Ninguno'];
    createPokemonRow(contentDiv, '⚔️ Ataque:', attackSelect);

    // Selector de Objetos/Efectos
    const effectSelect = document.createElement('select');
    effectSelect.style.cssText = pokemonInputStyle;
    for (const name in POKEMON_EFFECTS) {
        const opt = document.createElement('option');
        opt.value = POKEMON_EFFECTS[name];
        opt.textContent = name;
        effectSelect.appendChild(opt);
    }
    effectSelect.value = POKEMON_EFFECTS['Ninguno'];
    createPokemonRow(contentDiv, '🧪 Objeto/Estado:', effectSelect);

    // Auto-reset de selectores (solo uno a la vez)
    attackSelect.addEventListener('change', () => {
        if (attackSelect.value !== '') effectSelect.value = POKEMON_EFFECTS['Ninguno'];
    });

    effectSelect.addEventListener('change', () => {
        if (effectSelect.value !== '') attackSelect.value = POKEMON_ATTACKS['Ninguno'];
    });

    // Medidor de Nivel (Intensity)
    const powerInput = document.createElement('input');
    powerInput.type = 'range';
    powerInput.min = '1';
    powerInput.max = '5';
    powerInput.value = '3';
    powerInput.style.cssText = `flex-grow: 1; accent-color: #0000FF;`;
    createPokemonRow(contentDiv, '📈 Nivel:', powerInput);

    const powerLabel = document.createElement('span');
    powerLabel.style.cssText = 'color: #FFD700; font-size: 10px; text-align: center; margin-top: -5px;';
    powerLabel.textContent = `Nivel: ${POWER_INTENSITY_LABELS[powerInput.value - 1]}`;
    contentDiv.appendChild(powerLabel);
    powerInput.addEventListener('input', () => {
        powerLabel.textContent = `Nivel: ${POWER_INTENSITY_LABELS[powerInput.value - 1]}`;
    });

    // Toggle de Repetición ("Combate Continuo")
    const repeatToggle = document.createElement('input');
    repeatToggle.type = 'checkbox';
    repeatToggle.style.cssText = `transform: scale(1.2); accent-color: #FF0000;`;
    const repeatLabel = document.createElement('label');
    repeatLabel.textContent = ' 🔄 Combate Continuo (Spam Attack)';
    repeatLabel.style.cssText = `color: #FF0000; font-weight: bold; cursor: pointer;`;
    const repeatWrapper = document.createElement('div');
    repeatWrapper.style.cssText = `display:flex; align-items:center; gap:8px; justify-content: center;`;
    repeatWrapper.appendChild(repeatToggle);
    repeatWrapper.appendChild(repeatLabel);
    contentDiv.appendChild(repeatWrapper);

    // Botón de Activación
    const activateBtn = document.createElement('button');
    activateBtn.textContent = '🔥 ¡A LUCHAR! (Usar Ataque/Objeto)';
    activateBtn.disabled = true;
    activateBtn.style.cssText = `
        padding: 10px 15px; border-radius: 8px; border: none;
        background: linear-gradient(45deg, #FF0000, #0000FF);
        color: #FFD700; font-weight: bold; font-size: 14px;
        cursor: pointer; transition: all 0.2s ease;
        box-shadow: 0 3px 10px rgba(255, 0, 0, 0.5);
        font-family: 'Monospace', monospace;
        &:hover { background: linear-gradient(45deg, #0000FF, #FF0000); transform: translateY(-1px); }
        &:disabled { background: #666; cursor: not-allowed; opacity: 0.5; transform: none; }
    `;
    contentDiv.appendChild(activateBtn);

    // Botón de Parada
    stopBtn = document.createElement('button');
    stopBtn.textContent = '⛔ DEVOLVER (Stop Combate)';
    stopBtn.disabled = true;
    stopBtn.style.cssText = `
        margin-top: 5px; padding: 8px 12px; border-radius: 6px; border: none;
        background: linear-gradient(45deg, #000000, #444444);
        color: #FFFFFF; font-weight: bold; font-size: 12px;
        cursor: pointer; transition: all 0.2s ease;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
        font-family: 'Monospace', monospace;
        &:hover { background: linear-gradient(45deg, #444444, #000000); transform: translateY(-1px); }
        &:disabled { background: #666; cursor: not-allowed; opacity: 0.5; transform: none; }
    `;
    contentDiv.appendChild(stopBtn);

    document.body.appendChild(pokemonContainer);

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
        enemySelect.textContent = '👤 Tú (Entrenador)';

        playerRows.forEach(row => {
            if (row.dataset.self === 'true') return;
            if (row.dataset.playerid === '0') return;
            const name = row.querySelector('.playerlist-name a')?.textContent || `Enemy ${row.dataset.playerid}`;
            const opt = document.createElement('option');
            opt.value = row.dataset.playerid;
            const pokeName = name.includes('Police') ? '🐢 Blastoise' : '🐲 Charizard'; // Nombres épicos
            opt.textContent = `🎯 ${pokeName} (${name})`;
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
        dragOffsetX = e.clientX - pokemonContainer.getBoundingClientRect().left;
        dragOffsetY = e.clientY - pokemonContainer.getBoundingClientRect().top;
        titleBar.style.cursor = 'grabbing';
    });
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        let newX = e.clientX - dragOffsetX;
        let newY = e.clientY - dragOffsetY;
        newX = Math.max(0, Math.min(newX, window.innerWidth - pokemonContainer.offsetWidth));
        newY = Math.max(0, Math.min(newY, window.innerHeight - pokemonContainer.offsetHeight));
        pokemonContainer.style.left = newX + 'px';
        pokemonContainer.style.top = newY + 'px';
        pokemonContainer.style.right = 'auto';
        pokemonContainer.style.bottom = 'auto';
    });
    document.addEventListener('mouseup', () => {
        isDragging = false;
        titleBar.style.cursor = 'grab';
    });

    // Botón de parada
    stopBtn.addEventListener('click', () => {
        console.log('⛔ Combate detenido. Devolviendo Pokémon.');
        stopSignal = true;

        if (activePowerInterval) {
            clearInterval(activePowerInterval);
            activePowerInterval = null;
        }

        activateBtn.textContent = '🔥 ¡A LUCHAR! (Usar Ataque/Objeto)';
        activateBtn.style.background = 'linear-gradient(45deg, #FF0000, #0000FF)';
        activateBtn.disabled = false;
        stopBtn.disabled = true;
    });

    // Botón principal de activación
    activateBtn.addEventListener('click', async () => {
        const playerId = enemySelect.value;
        if (!playerId) {
            alert('🎯 ¡Escoge un Pokémon Rival!');
            return;
        }

        const selectedAttack = attackSelect.value;
        const selectedEffect = effectSelect.value;
        const intensity = parseInt(powerInput.value);

        if (activePowerInterval) {
            stopBtn.click();
            return;
        }

        let actionToExecute = null;
        let actionName = '';

        if (selectedAttack && selectedAttack.startsWith('attack:')) {
            switch (selectedAttack) {
                case 'attack:thunderbolt_shock': actionToExecute = () => thunderboltShock(playerId, intensity); actionName = 'Rayo'; break;
                case 'attack:flamethrower_fire': actionToExecute = () => flamethrowerFire(playerId, intensity); actionName = 'Lanzallamas'; break;
                case 'attack:hydro_pump_jet': actionToExecute = () => hydroPumpJet(playerId, intensity); actionName = 'Hidrobomba'; break;
                case 'attack:shadow_ball_curse': actionToExecute = () => shadowBallCurse(playerId, intensity); actionName = 'Bola Sombra'; break;
                default: return;
            }
        } else if (selectedEffect && selectedEffect.startsWith('effect:')) {
            switch (selectedEffect) {
                case 'effect:full_restore_heal': actionToExecute = () => fullRestoreHeal(playerId, intensity); actionName = 'Full Restore'; break;
                case 'effect:protect_shield': actionToExecute = () => protectShield(playerId, intensity); actionName = 'Protección'; break;
                case 'effect:toxic_poison': actionToExecute = () => toxicPoison(playerId, intensity); actionName = 'Tóxico'; break;
                case 'effect:x_accuracy_evasion': actionToExecute = () => xAccuracyEvasion(playerId, intensity); actionName = 'X Precisión'; break;
                default: return;
            }
        } else {
            alert('🔺 ¡Debes seleccionar un Ataque o un Objeto/Estado!');
            return;
        }

        stopSignal = false;
        activateBtn.disabled = true;
        stopBtn.disabled = false;

        try {
            if (repeatToggle.checked) {
                activateBtn.textContent = '🔄 DETENER COMBATE CONTINUO';
                activateBtn.style.background = 'linear-gradient(45deg, #000000, #FF0000)';
                activateBtn.disabled = false;

                console.log(`🔥 ¡Iniciando Combate Continuo con ${actionName}!`);

                const continuousAction = async () => {
                    if (stopSignal || !repeatToggle.checked) {
                        if (activePowerInterval) clearInterval(activePowerInterval);
                        activePowerInterval = null;
                        activateBtn.textContent = '🔥 ¡A LUCHAR! (Usar Ataque/Objeto)';
                        activateBtn.style.background = 'linear-gradient(45deg, #FF0000, #0000FF)';
                        stopBtn.disabled = true;
                        return;
                    }

                    try {
                        await actionToExecute();
                    } catch (error) {
                        console.error(`Error durante el Combate Continuo (${actionName}):`, error);
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
        console.log('¡GRACIAS POR JUGAR! ¡Vuelve pronto para ser el mejor Entrenador! -Pokémon.');
    });

    // Inicialización
    refreshPlayerList();
    console.log('✨ Pokedéx Companion Mod cargado. ¡Te elijo a ti! ✨');

})();