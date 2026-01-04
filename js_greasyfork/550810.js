// ==UserScript==
// @name         ⭐ Super Star Companion Mod (Mario Edition) 🍄
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  It's-a me, Mario! Summon Super Stars, Red Shells, and Fire Flowers to dominate Drawaria.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @match        https://*.drawaria.online/*
// @icon         https://fonts.gstatic.com/s/e/notoemoji/latest/1f31f/512.webp
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550810/%E2%AD%90%20Super%20Star%20Companion%20Mod%20%28Mario%20Edition%29%20%F0%9F%8D%84.user.js
// @updateURL https://update.greasyfork.org/scripts/550810/%E2%AD%90%20Super%20Star%20Companion%20Mod%20%28Mario%20Edition%29%20%F0%9F%8D%84.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ----------------------------------------------------------------------------------
    //  CONFIGURACIÓN Y ASSETS DE MARIO
    // ---------------------------------------------------------------------------------- */

    // Colores de la paleta Mario (Reino Champiñón)
    const MARIO_COLORS = {
        'R': '#FF0000',  // Rojo (Mario / Caparazón Rojo)
        'Y': '#FFD700',  // Amarillo (Monedas / Super Star)
        'B': '#0000FF',  // Azul (Caparazón Azul / Pantalones de Mario)
        'G': '#008000',  // Verde (Luigi / Caparazón Verde)
        'W': '#FFFFFF',  // Blanco (Nubes)
        'K': '#000000',  // Negro (Bordes)
        'P': '#FF69B4',  // Rosa (Princesa Peach)
        'C': '#8B4513',  // Café (Bloques de Tierra)
        'O': '#FF4500'   // Naranja (Flor de Fuego)
    };

    // Estructuras de Pixel Art simplificadas (Iconos de Mario)
    const MARIO_PIXEL_ASSETS = {
        // Super Star (Invencibilidad)
        'STAR': {
            art: [
                "  Y K Y  ",
                " Y Y K Y Y ",
                "K Y Y K Y K",
                " Y Y Y Y ",
                "  Y Y Y  "
            ],
            colors: { 'Y': MARIO_COLORS.Y, 'K': MARIO_COLORS.K }
        },
        // Moneda (Cash)
        'COIN': {
            art: [
                " K Y Y K ",
                " Y Y Y Y ",
                " Y Y Y Y ",
                " K Y Y K "
            ],
            colors: { 'Y': MARIO_COLORS.Y, 'K': MARIO_COLORS.K }
        },
        // Champiñón 1-Up (Vida extra)
        '1UP': {
            art: [
                "  G G G  ",
                " G G G G ",
                " K K K K ",
                " C C C C "
            ],
            colors: { 'G': MARIO_COLORS.G, 'K': MARIO_COLORS.K, 'C': MARIO_COLORS.C }
        }
    };

    // Objetos/Armas de Mario
    const MARIO_WEAPONS = {
        'Ninguno': '',
        '🔥 Flor de Fuego (Lanzallamas)': 'weapon:fire_flower_flame',
        '🐢 Caparazón Rojo (Teledirigido)': 'weapon:red_shell_lock',
        '💣 Bob-omb (Explosión)': 'weapon:bob_omb_explosion',
        '🌟 Lluvia de Estrellas': 'weapon:star_rain',
    };

    // Poderes/Efectos de Mario
    const MARIO_POWERS = {
        'Ninguno': '',
        '👑 Súper Corona (Invulnerabilidad)': 'effect:super_crown',
        '🍄 Súper Champiñón (Vida Extra)': 'effect:super_mushroom',
        '🧱 Bloque Ladrillo (Defensa)': 'effect:brick_block',
        '☁️ Nube de Lakitu (Ocultamiento)': 'effect:lakitu_cloud',
    };

    const POWER_INTENSITY_LABELS = ['Nivel 1 (Pequeño)', 'Nivel 2 (Súper)', 'Nivel 3 (Fuego)', 'Nivel 4 (Tanooki)', 'Nivel 5 (Estrella)'];

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
    //  NÚCLEO DE DIBUJO: SINCRONIZACIÓN LOCAL Y REMOTA
    // ---------------------------------------------------------------------------------- */

    function drawLocalLine(x1, y1, x2, y2, color, thickness) {
        if (!ctx) return;
        const actualThickness = Math.abs(thickness);
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = actualThickness;
        ctx.lineCap = 'round';
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

    function drawPixelArt(x, y, asset, sizeMultiplier = 1) {
        const { art, colors } = asset;
        const pixelSize = 5 * sizeMultiplier;

        const height = art.length;
        const width = art[0].length;

        const startX = x - (width * pixelSize) / 2;
        const startY = y - (height * pixelSize) / 2;

        for (let row = 0; row < height; row++) {
            for (let col = 0; col < width; col++) {
                const char = art[row][col];
                const color = colors[char] || MARIO_COLORS[char]; // Usa el color si es definido en asset, sino usa paleta global

                if (color && char !== ' ') {
                    const pX = startX + col * pixelSize;
                    const pY = startY + row * pixelSize;
                    sendAndDrawCommand(pX, pY, pX + 1, pY + 1, color, pixelSize);
                }
            }
        }
    }

    /* ----------------------------------------------------------------------------------
    //  FUNCIONES DE OBJETOS/ARMAS MARIO
    // ---------------------------------------------------------------------------------- */

    // 1. Flor de Fuego (Lanzallamas)
    async function fireFlowerFlame(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const startX = canvas.width * 0.5;
        const startY = canvas.height * 0.8;
        const endX = target.x;
        const endY = target.y;
        const duration = 600;
        const startTime = Date.now();
        const thickness = 2 + intensity * 2;
        const colors = [MARIO_COLORS.R, MARIO_COLORS.O, MARIO_COLORS.Y];

        while (Date.now() - startTime < duration) {
            if (stopSignal) break;
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;

            for (let i = 0; i < 5 + intensity; i++) {
                const spreadX = (Math.random() - 0.5) * 50 * (1 - progress);
                const spreadY = (Math.random() - 0.5) * 50 * (1 - progress);
                const color = colors[Math.floor(Math.random() * colors.length)];

                // Bolas de fuego que van del centro a la posición del enemigo
                sendAndDrawCommand(startX + spreadX, startY + spreadY, endX + spreadX, endY + spreadY, color, thickness);
            }
            await new Promise(r => setTimeout(r, 20));
        }
    }

    // 2. Caparazón Rojo (Teledirigido)
    async function redShellLock(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const startX = canvas.width * 0.1;
        const startY = canvas.height * 0.5;
        const endX = target.x;
        const endY = target.y;

        // Trayectoria del caparazón
        for (let i = 0; i < 20; i++) {
            if (stopSignal) break;
            const progress = i / 19;
            const currentX = startX + (endX - startX) * progress;
            const currentY = startY + (endY - startY) * progress;

            // Dibujar un círculo rojo (caparazón) con línea azul (guía teledirigida)
            sendAndDrawCommand(currentX, currentY, currentX, currentY, MARIO_COLORS.R, 8 + intensity * 2);
            sendAndDrawCommand(startX, startY, currentX, currentY, MARIO_COLORS.B, 1);

            await new Promise(r => setTimeout(r, 30));
        }

        // Efecto de KO
        sendAndDrawCommand(endX, endY, endX, endY, MARIO_COLORS.K, 30 + intensity * 5);
    }

    // 3. Bob-omb (Explosión)
    async function bobOmbExplosion(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const endX = target.x;
        const endY = target.y + 20;

        // Paso 1: Dibujar la Bob-omb (usamos un punto negro grueso)
        sendAndDrawCommand(endX, endY, endX, endY, MARIO_COLORS.K, 15);
        await new Promise(r => setTimeout(r, 1000)); // Cuenta regresiva

        // Paso 2: Explosión
        const maxRadius = 60 + intensity * 15;
        const colors = [MARIO_COLORS.O, MARIO_COLORS.Y, MARIO_COLORS.R];

        for (let step = 0; step < 12; step++) {
            if (stopSignal) break;
            const currentRadius = maxRadius * (step / 12);
            for (let p = 0; p < 10 + intensity; p++) {
                const angle = Math.random() * Math.PI * 2;
                const x = endX + currentRadius * Math.cos(angle);
                const y = endY + currentRadius * Math.sin(angle);
                const color = colors[Math.floor(Math.random() * colors.length)];
                sendAndDrawCommand(endX, endY, x, y, color, 6);
            }
            await new Promise(r => setTimeout(r, 30));
        }
    }

    // 4. Lluvia de Estrellas
    async function starRain(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const duration = 500;
        const startTime = Date.now();

        while (Date.now() - startTime < duration) {
            if (stopSignal) break;
            const count = 5 + intensity * 2;

            for (let i = 0; i < count; i++) {
                const xOffset = (Math.random() - 0.5) * 150;
                const startY = 50;
                const endY = target.y;

                const currentY = startY + (endY - startY) * (Math.random() * 0.8 + 0.2); // Aparecen y caen
                const size = 1 + Math.random() * 1;

                drawPixelArt(target.x + xOffset, currentY, MARIO_PIXEL_ASSETS.STAR, size);
            }

            await new Promise(r => setTimeout(r, 80));
        }
    }

    /* ----------------------------------------------------------------------------------
    //  FUNCIONES DE PODERES/EFECTOS MARIO
    // ---------------------------------------------------------------------------------- */

    // 5. Súper Corona (Invulnerabilidad)
    async function superCrownDefense(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const duration = 4000;
        const startTime = Date.now();
        const thickness = 3 + intensity * 2;

        while (Date.now() - startTime < duration) {
            if (stopSignal) break;
            const elapsed = Date.now() - startTime;
            const radius = 40;
            const pulse = Math.sin(elapsed * 0.02) * 8; // Pulso rosa/blanco

            // Dibuja un aura rosa pulsante (Princesa Peach)
            for (let i = 0; i < 12; i++) {
                const angle = (i / 12) * 2 * Math.PI;
                const dist = radius + pulse;
                const x = target.x + dist * Math.cos(angle);
                const y = target.y + dist * Math.sin(angle);
                const color = (elapsed % 400 < 200) ? MARIO_COLORS.P : MARIO_COLORS.W;
                sendAndDrawCommand(target.x, target.y, x, y, color, thickness);
            }

            await new Promise(r => setTimeout(r, 80));
        }
    }

    // 6. Súper Champiñón (Vida Extra)
    async function superMushroom(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const centerX = target.x;
        const centerY = target.y;

        // Pulso de crecimiento verde
        for (let i = 0; i < 10; i++) {
            if (stopSignal) break;
            const size = 1 + i * 0.2;
            drawPixelArt(centerX, centerY, MARIO_PIXEL_ASSETS['1UP'], size);
            await new Promise(r => setTimeout(r, 60));
        }

        // Estela de vida ascendente
        for (let i = 0; i < 10; i++) {
            sendAndDrawCommand(centerX, centerY, centerX, centerY - 60, MARIO_COLORS.G, 5 + intensity);
            await new Promise(r => setTimeout(r, 20));
        }
    }

    // 7. Bloque Ladrillo (Defensa)
    async function brickBlockDefense(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const size = 20 + intensity * 5;
        const thickness = 2 + intensity;

        // Dibuja un bloque alrededor del objetivo
        for (let i = 0; i < 4; i++) {
            const x1 = target.x - size / 2;
            const y1 = target.y - size / 2;
            const x2 = target.x + size / 2;
            const y2 = target.y + size / 2;

            sendAndDrawCommand(x1, y1, x2, y1, MARIO_COLORS.C, thickness); // Top
            sendAndDrawCommand(x2, y1, x2, y2, MARIO_COLORS.C, thickness); // Right
            sendAndDrawCommand(x2, y2, x1, y2, MARIO_COLORS.C, thickness); // Bottom
            sendAndDrawCommand(x1, y2, x1, y1, MARIO_COLORS.C, thickness); // Left
            await new Promise(r => setTimeout(r, 100));
        }
    }

    // 8. Nube de Lakitu (Ocultamiento)
    async function lakituCloud(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const duration = 2500;
        const startTime = Date.now();
        const thickness = 10 + intensity * 3;
        const colors = [MARIO_COLORS.W, MARIO_COLORS.A, MARIO_COLORS.G]; // Blanco, Gris (para sombra), Verde

        while (Date.now() - startTime < duration) {
            if (stopSignal) break;
            const radius = 50;

            // Dibuja puntos de nube blanca/gris alrededor del jugador
            for (let i = 0; i < 8 + intensity; i++) {
                const angle = Math.random() * Math.PI * 2;
                const dist = radius * Math.random();
                const x = target.x + dist * Math.cos(angle);
                const y = target.y - 50 + dist * Math.sin(angle); // Aparece sobre la cabeza
                const color = (Math.random() > 0.7) ? MARIO_COLORS.W : MARIO_COLORS.A;
                sendAndDrawCommand(x, y, x, y, color, thickness);
            }
            await new Promise(r => setTimeout(r, 80));
        }
    }

    /* ----------------------------------------------------------------------------------
    //  INTERFAZ DE USUARIO Y GESTIÓN DE EVENTOS (Adaptado de GTA Mod)
    // ---------------------------------------------------------------------------------- */

    const marioContainer = document.createElement('div');
    marioContainer.id = 'MarioCompanionUI';
    marioContainer.style.cssText = `
        position:fixed; bottom:10px; right:10px; z-index:9999;
        background:rgba(139, 69, 19, 0.9);
        color:#FFFFFF; padding:15px 20px; border-radius:10px;
        font-family: 'Consolas', 'Monospace', sans-serif; font-size:12px;
        display:flex; flex-direction:column; gap:10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.8), 0 0 15px rgba(255, 215, 0, 0.5);
        border: 3px solid #FFD700;
        min-width: 250px;
        backdrop-filter: blur(5px);
    `;

    const titleBar = document.createElement('div');
    titleBar.innerHTML = '🍄 MARIO STAR MANAGER ⭐';
    titleBar.style.cssText = `
        font-weight: bold; font-size: 14px; text-align: center; cursor: grab;
        color: #FFD700;
        background: rgba(0, 0, 0, 0.5);
        text-shadow: 0 0 5px #FFD700;
        margin: -15px -20px 8px -20px; padding: 10px 20px;
        border-bottom: 2px solid #FFD700;
        border-radius: 7px 7px 0 0;
    `;
    marioContainer.appendChild(titleBar);

    const contentDiv = document.createElement('div');
    contentDiv.style.cssText = `display:flex; flex-direction:column; gap:8px;`;
    marioContainer.appendChild(contentDiv);

    const marioInputStyle = `
        flex-grow: 1; padding: 6px 10px; border-radius: 5px;
        border: 2px solid #FFD700; background: rgba(0, 0, 0, 0.7);
        color: #FFFFFF; font-size: 11px; font-family: monospace;
        transition: all 0.2s ease;
    `;

    function createMarioRow(parent, labelText, inputElement) {
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
    enemySelect.style.cssText = marioInputStyle;
    createMarioRow(contentDiv, '👤 Objetivo (Bowser):', enemySelect);

    // Selector de Armas
    const weaponSelect = document.createElement('select');
    weaponSelect.style.cssText = marioInputStyle;
    for (const name in MARIO_WEAPONS) {
        const opt = document.createElement('option');
        opt.value = MARIO_WEAPONS[name];
        opt.textContent = name;
        weaponSelect.appendChild(opt);
    }
    weaponSelect.value = MARIO_WEAPONS['Ninguno'];
    createMarioRow(contentDiv, '⚔️ Objeto:', weaponSelect);

    // Selector de Poderes (Effects)
    const powerSelect = document.createElement('select');
    powerSelect.style.cssText = marioInputStyle;
    for (const name in MARIO_POWERS) {
        const opt = document.createElement('option');
        opt.value = MARIO_POWERS[name];
        opt.textContent = name;
        powerSelect.appendChild(opt);
    }
    powerSelect.value = MARIO_POWERS['Ninguno'];
    createMarioRow(contentDiv, '✨ Poder:', powerSelect);

    // Auto-reset de selectores (solo uno a la vez)
    weaponSelect.addEventListener('change', () => {
        if (weaponSelect.value !== '') powerSelect.value = MARIO_POWERS['Ninguno'];
    });

    powerSelect.addEventListener('change', () => {
        if (powerSelect.value !== '') weaponSelect.value = MARIO_WEAPONS['Ninguno'];
    });

    // Medidor de Fuerza/Poder (Intensity)
    const powerInput = document.createElement('input');
    powerInput.type = 'range';
    powerInput.min = '1';
    powerInput.max = '5';
    powerInput.value = '3';
    powerInput.style.cssText = `flex-grow: 1; accent-color: #FFD700;`;
    createMarioRow(contentDiv, '💪 Nivel:', powerInput);

    const powerLabel = document.createElement('span');
    powerLabel.style.cssText = 'color: #FFFFFF; font-size: 10px; text-align: center; margin-top: -5px;';
    powerLabel.textContent = `Poder: ${POWER_INTENSITY_LABELS[powerInput.value - 1]}`;
    contentDiv.appendChild(powerLabel);
    powerInput.addEventListener('input', () => {
        powerLabel.textContent = `Poder: ${POWER_INTENSITY_LABELS[powerInput.value - 1]}`;
    });

    // Toggle de Repetición ("Flujo Continuo")
    const repeatToggle = document.createElement('input');
    repeatToggle.type = 'checkbox';
    repeatToggle.style.cssText = `transform: scale(1.2); accent-color: #FF0000;`;
    const repeatLabel = document.createElement('label');
    repeatLabel.textContent = ' 🔄 Flujo Continuo (Spam Koopa)';
    repeatLabel.style.cssText = `color: #FF0000; font-weight: bold; cursor: pointer;`;
    const repeatWrapper = document.createElement('div');
    repeatWrapper.style.cssText = `display:flex; align-items:center; gap:8px; justify-content: center;`;
    repeatWrapper.appendChild(repeatToggle);
    repeatWrapper.appendChild(repeatLabel);
    contentDiv.appendChild(repeatWrapper);

    // Botón de Activación
    const activateBtn = document.createElement('button');
    activateBtn.textContent = '🌟 ¡VAMOS! (Activar Poder)';
    activateBtn.disabled = true;
    activateBtn.style.cssText = `
        padding: 10px 15px; border-radius: 8px; border: none;
        background: linear-gradient(45deg, #FFD700, #FF0000);
        color: #000000; font-weight: bold; font-size: 14px;
        cursor: pointer; transition: all 0.2s ease;
        box-shadow: 0 3px 10px rgba(255, 215, 0, 0.5);
        font-family: 'Monospace', monospace;
        &:hover { background: linear-gradient(45deg, #FF0000, #FFD700); transform: translateY(-1px); }
        &:disabled { background: #666; cursor: not-allowed; opacity: 0.5; transform: none; }
    `;
    contentDiv.appendChild(activateBtn);

    // Botón de Parada
    stopBtn = document.createElement('button');
    stopBtn.textContent = '⛔ GAME OVER (Stop)';
    stopBtn.disabled = true;
    stopBtn.style.cssText = `
        margin-top: 5px; padding: 8px 12px; border-radius: 6px; border: none;
        background: linear-gradient(45deg, #000000, #444444);
        color: white; font-weight: bold; font-size: 12px;
        cursor: pointer; transition: all 0.2s ease;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
        font-family: 'Monospace', monospace;
        &:hover { background: linear-gradient(45deg, #444444, #000000); transform: translateY(-1px); }
        &:disabled { background: #666; cursor: not-allowed; opacity: 0.5; transform: none; }
    `;
    contentDiv.appendChild(stopBtn);

    document.body.appendChild(marioContainer);

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
        enemySelect.textContent = '👤 Tú (Mario/Luigi)';

        playerRows.forEach(row => {
            if (row.dataset.self === 'true') return;
            if (row.dataset.playerid === '0') return;
            const name = row.querySelector('.playerlist-name a')?.textContent || `Enemy ${row.dataset.playerid}`;
            const opt = document.createElement('option');
            opt.value = row.dataset.playerid;
            const marioName = name.includes('Police') ? '🐢 Koopa' : '🔥 Bowser JR';
            opt.textContent = `🎯 ${marioName} (${name})`;
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
        dragOffsetX = e.clientX - marioContainer.getBoundingClientRect().left;
        dragOffsetY = e.clientY - marioContainer.getBoundingClientRect().top;
        titleBar.style.cursor = 'grabbing';
    });
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        let newX = e.clientX - dragOffsetX;
        let newY = e.clientY - dragOffsetY;
        newX = Math.max(0, Math.min(newX, window.innerWidth - marioContainer.offsetWidth));
        newY = Math.max(0, Math.min(newY, window.innerHeight - marioContainer.offsetHeight));
        marioContainer.style.left = newX + 'px';
        marioContainer.style.top = newY + 'px';
        marioContainer.style.right = 'auto';
        marioContainer.style.bottom = 'auto';
    });
    document.addEventListener('mouseup', () => {
        isDragging = false;
        titleBar.style.cursor = 'grab';
    });

    // Botón de parada
    stopBtn.addEventListener('click', () => {
        console.log('⛔ ¡GAME OVER! Deteniendo acción.');
        stopSignal = true;

        if (activePowerInterval) {
            clearInterval(activePowerInterval);
            activePowerInterval = null;
        }

        activateBtn.textContent = '🌟 ¡VAMOS! (Activar Poder)';
        activateBtn.style.background = 'linear-gradient(45deg, #FFD700, #FF0000)';
        activateBtn.disabled = false;
        stopBtn.disabled = true;
    });

    // Botón principal de activación
    activateBtn.addEventListener('click', async () => {
        const playerId = enemySelect.value;
        if (!playerId) {
            alert('🎯 ¡Escoge un rival del ejército de Bowser!');
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
                case 'weapon:fire_flower_flame': actionToExecute = () => fireFlowerFlame(playerId, intensity); actionName = 'Flor de Fuego'; break;
                case 'weapon:red_shell_lock': actionToExecute = () => redShellLock(playerId, intensity); actionName = 'Caparazón Rojo'; break;
                case 'weapon:bob_omb_explosion': actionToExecute = () => bobOmbExplosion(playerId, intensity); actionName = 'Bob-omb'; break;
                case 'weapon:star_rain': actionToExecute = () => starRain(playerId, intensity); actionName = 'Lluvia de Estrellas'; break;
                default: return;
            }
        } else if (selectedPower && selectedPower.startsWith('effect:')) {
            switch (selectedPower) {
                case 'effect:super_crown': actionToExecute = () => superCrownDefense(playerId, intensity); actionName = 'Súper Corona'; break;
                case 'effect:super_mushroom': actionToExecute = () => superMushroom(playerId, intensity); actionName = 'Súper Champiñón'; break;
                case 'effect:brick_block': actionToExecute = () => brickBlockDefense(playerId, intensity); actionName = 'Bloque Ladrillo'; break;
                case 'effect:lakitu_cloud': actionToExecute = () => lakituCloud(playerId, intensity); actionName = 'Nube de Lakitu'; break;
                default: return;
            }
        } else {
            alert('🔺 ¡Debes seleccionar un Objeto o Poder de Mario!');
            return;
        }

        stopSignal = false;
        activateBtn.disabled = true;
        stopBtn.disabled = false;

        try {
            if (repeatToggle.checked) {
                activateBtn.textContent = '🔄 DETENER FLUJO CONTINUO';
                activateBtn.style.background = 'linear-gradient(45deg, #000000, #FF0000)';
                activateBtn.disabled = false;

                console.log(`🔥 ¡Iniciando Flujo Continuo de ${actionName}!`);

                const continuousAction = async () => {
                    if (stopSignal || !repeatToggle.checked) {
                        if (activePowerInterval) clearInterval(activePowerInterval);
                        activePowerInterval = null;
                        activateBtn.textContent = '🌟 ¡VAMOS! (Activar Poder)';
                        activateBtn.style.background = 'linear-gradient(45deg, #FFD700, #FF0000)';
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
        console.log('¡Gracias por jugar! See you next time! -Mario.');
    });

    // Inicialización
    refreshPlayerList();
    console.log('✨ Super Star Companion Mod cargado. ¡Let\'s a go! ✨');

})();