// ==UserScript==
// @name         💰 GTA Companion Mod - Los Santos Edition ⭐️
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Become a boss! Summon weapons, skills, and GTA search levels to dominate Drawaria.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @match        https://*.drawaria.online/*
// @icon         https://fonts.gstatic.com/s/e/notoemoji/latest/1f4b8/512.webp
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550806/%F0%9F%92%B0%20GTA%20Companion%20Mod%20-%20Los%20Santos%20Edition%20%E2%AD%90%EF%B8%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/550806/%F0%9F%92%B0%20GTA%20Companion%20Mod%20-%20Los%20Santos%20Edition%20%E2%AD%90%EF%B8%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ----------------------------------------------------------------------------------
    //  CONFIGURACIÓN Y ASSETS DE GTA
    // ---------------------------------------------------------------------------------- */

    // Colores de la paleta GTA (Grove Street / Los Santos)
    const GTA_COLORS = {
        'G': '#008000',  // Verde (Grove Street)
        'B': '#00008B',  // Azul Oscuro (LSPD/Neon)
        'R': '#B22222',  // Rojo (Gang/Wanted)
        'W': '#FFFFFF',  // Blanco
        'K': '#000000',  // Negro
        'Y': '#FFD700',  // Amarillo (Cash)
        'T': '#00FFFF',  // Teal (Neon)
        'P': '#800080',  // Púrpura (Ballaz/Gang)
        'A': '#A9A9A9',  // Gris (Armor/Asfalto)
        'O': '#FF4500'   // Naranja (Fuego/Explosión)
    };

    // Estructuras de Pixel Art simplificadas (Iconos de GTA)
    const GTA_PIXEL_ASSETS = {
        // Estrellas de Nivel de Búsqueda (Wanted Level)
        'WANTED_STAR': {
            art: [
                "  R   ",
                " RRRR ",
                "RRRRRR",
                " RRRR ",
                "  R   "
            ],
            colors: { 'R': '#FF0000', 'W': '#FFFFFF' }
        },
        // Símbolo de Dinero ($)
        'CASH_SYMBOL': {
            art: [
                "  Y  ",
                " YYY ",
                " KYK ",
                " YYY ",
                "  Y  "
            ],
            colors: { 'Y': '#FFD700', 'K': '#000000' }
        },
        // Icono de Salud (Cruz verde)
        'HEALTH_ICON': {
            art: [
                "  G  ",
                " GGG ",
                "GGGGG",
                " GGG ",
                "  G  "
            ],
            colors: { 'G': '#00FF00' }
        }
    };

    // Armas GTA
    const GTA_WEAPONS = {
        'Ninguno': '',
        '🔫 Minigun Spray': 'weapon:minigun_spray',
        '🚀 Rocket Launcher': 'weapon:rocket_launcher',
        '⚡ Taser Stun': 'weapon:taser_stun',
        '🚗 Drive-By (AK)': 'weapon:drive_by_attack',
        '💣 Sticky Bomb': 'weapon:sticky_bomb',
    };

    // Poderes/Efectos GTA
    const GTA_POWERS = {
        'Ninguno': '',
        '🛡️ Full Armor': 'effect:full_armor',
        '💰 Cash Drop / Payday': 'effect:cash_drop',
        '💉 Health Injector': 'effect:health_injector',
    };

    const POWER_INTENSITY_LABELS = ['Bajo (Traficante)', 'Medio (Sicario)', 'Alto (Jefe)', 'Maestro (CEO)', 'Leyenda (CJ/Trevor)'];

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
    //  NÚCLEO DE DIBUJO GTA: SINCRONIZACIÓN LOCAL Y REMOTA
    // ---------------------------------------------------------------------------------- */

    /**
     * 1. Dibuja el efecto localmente en el canvas del usuario (visibilidad inmediata).
     */
    function drawLocalLine(x1, y1, x2, y2, color, thickness) {
        if (!ctx) return;

        // Para el modo 'spray' o 'punto grueso', Drawaria usa grosor negativo en el cmd.
        // Localmente necesitamos el grosor POSITIVO.
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

    /**
     * 2. Envía el comando al servidor (Drawcmd) para visibilidad de otros jugadores.
     */
    function sendRemoteDrawCommand(x1, y1, x2, y2, color, thickness) {
        x1 = Math.round(x1);
        y1 = Math.round(y1);
        x2 = Math.round(x2); y2 = Math.round(y2);

        if (!socket || !canvas) return;

        // Conversión a coordenadas normalizadas [0, 1]
        const normX1 = (x1 / canvas.width).toFixed(4);
        const normY1 = (y1 / canvas.height).toFixed(4);
        const normX2 = (x2 / canvas.width).toFixed(4);
        const normY2 = (y2 / canvas.height).toFixed(4);

        // Se usa un grosor NEGATIVO para asegurar que se dibuje como un pincel/spray
        const cmd = `42["drawcmd",0,[${normX1},${normY1},${normX2},${normY2},false,${0 - thickness},"${color}",0,0,{}]]`;
        socket.send(cmd);
    }

    /**
     * 3. Función principal: Llama a dibujar localmente y enviar remotamente.
     */
    function sendAndDrawCommand(x1, y1, x2, y2, color, thickness) {
        drawLocalLine(x1, y1, x2, y2, color, thickness);
        sendRemoteDrawCommand(x1, y1, x2, y2, color, thickness);
    }

    /**
     * Dibuja el pixel art de GTA en la posición del objetivo (usando la nueva función).
     */
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
                const color = colors[char];

                if (color) {
                    const pX = startX + col * pixelSize;
                    const pY = startY + row * pixelSize;

                    // Dibuja el pixel como un punto grueso (usa thickness positivo para el servidor)
                    sendAndDrawCommand(pX, pY, pX + 1, pY + 1, color, pixelSize);
                }
            }
        }
    }

    /* ----------------------------------------------------------------------------------
    //  FUNCIONES DE ARMAS GTA (ACTUALIZADAS)
    //  Todas las llamadas a sendGTADrawCommand han sido reemplazadas por sendAndDrawCommand.
    // ---------------------------------------------------------------------------------- */

    // 1. Minigun Spray (Weapon)
    async function minigunSpray(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const startX = canvas.width * 0.5;
        const startY = canvas.height - 50;
        const endX = target.x;
        const endY = target.y;
        const duration = 500;
        const startTime = Date.now();
        const thickness = 1 + intensity;
        const color = GTA_COLORS.K;

        while (Date.now() - startTime < duration) {
            if (stopSignal) break;
            for (let i = 0; i < 5 + intensity; i++) {
                const spreadX = (Math.random() - 0.5) * 40;
                const spreadY = (Math.random() - 0.5) * 40;
                // USANDO sendAndDrawCommand
                sendAndDrawCommand(startX + spreadX, startY, endX + spreadX, endY + spreadY, color, thickness);
            }
            await new Promise(r => setTimeout(r, 20));
        }
        // Efecto de impacto final
        sendAndDrawCommand(endX, endY, endX, endY, GTA_COLORS.R, 20);
    }

    // 2. Rocket Launcher (Weapon)
    async function rocketLauncher(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const startX = canvas.width * 0.1;
        const startY = canvas.height * 0.8;
        const endX = target.x;
        const endY = target.y;

        // Animación del cohete
        for (let i = 0; i < 15; i++) {
            if (stopSignal) break;
            const progress = i / 14;
            const currentX = startX + (endX - startX) * progress;
            const currentY = startY + (endY - startY) * progress;

            const trailThickness = 5 + intensity;
            // USANDO sendAndDrawCommand
            sendAndDrawCommand(currentX, currentY, currentX, currentY, GTA_COLORS.R, trailThickness); // Cabeza
            sendAndDrawCommand(startX, startY, currentX, currentY, GTA_COLORS.O, 3); // Estela de fuego

            await new Promise(r => setTimeout(r, 40));
        }

        // Explosión final
        const maxRadius = 50 + intensity * 10;
        const colors = [GTA_COLORS.O, GTA_COLORS.Y, GTA_COLORS.R];

        for (let step = 0; step < 10; step++) {
            if (stopSignal) break;
            const currentRadius = maxRadius * (step / 10);
            for (let p = 0; p < 10; p++) {
                const angle = Math.random() * Math.PI * 2;
                const x = endX + currentRadius * Math.cos(angle);
                const y = endY + currentRadius * Math.sin(angle);
                const color = colors[Math.floor(Math.random() * colors.length)];
                // USANDO sendAndDrawCommand
                sendAndDrawCommand(endX, endY, x, y, color, 5);
            }
            await new Promise(r => setTimeout(r, 30));
        }
    }

    // 3. Taser Stun (Weapon)
    async function taserStun(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const centerX = target.x;
        const centerY = target.y;
        const duration = 1500;
        const startTime = Date.now();
        const thickness = 2 + intensity;

        while (Date.now() - startTime < duration) {
            if (stopSignal) break;

            // Dibuja el efecto de electricidad azul/teal
            for (let i = 0; i < 5 + intensity; i++) {
                const r1 = 10;
                const r2 = 30;
                const angle1 = Math.random() * Math.PI * 2;
                const angle2 = Math.random() * Math.PI * 2;

                const x1 = centerX + r1 * Math.cos(angle1);
                const y1 = centerY + r1 * Math.sin(angle1);
                const x2 = centerX + r2 * Math.cos(angle2);
                const y2 = centerY + r2 * Math.sin(angle2);

                const color = (Math.random() > 0.5) ? GTA_COLORS.B : GTA_COLORS.T;
                // USANDO sendAndDrawCommand
                sendAndDrawCommand(x1, y1, x2, y2, color, thickness);
            }

            await new Promise(r => setTimeout(r, 50));
        }
    }

    // 4. Drive-By (AK) (Weapon)
    async function driveByAttack(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const centerX = target.x;
        const centerY = target.y;
        const duration = 800;
        const startTime = Date.now();
        const thickness = 2 + intensity;

        while (Date.now() - startTime < duration) {
            if (stopSignal) break;

            // Líneas de bala rojas y verdes cruzadas (Gang Colors)
            for (let i = 0; i < 10; i++) {
                const offset = (Math.random() - 0.5) * 50;
                const color = (Math.random() > 0.5) ? GTA_COLORS.R : GTA_COLORS.G;

                // Línea rápida a través del objetivo
                // USANDO sendAndDrawCommand
                sendAndDrawCommand(centerX - 100, centerY + offset, centerX + 100, centerY - offset, color, thickness);
            }
            await new Promise(r => setTimeout(r, 40));
        }
    }

    // 5. Sticky Bomb (Weapon)
    async function stickyBomb(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const endX = target.x;
        const endY = target.y + 20;

        // Paso 1: Dibujar la bomba pegajosa (drawPixelArt ya usa sendAndDrawCommand)
        drawPixelArt(endX, endY, GTA_PIXEL_ASSETS.CASH_SYMBOL, 2); // Usando Cash Symbol como placeholder para la bomba
        await new Promise(r => setTimeout(r, 500));

        // Paso 2: Explosión
        const maxRadius = 80 + intensity * 15;
        const colors = [GTA_COLORS.O, GTA_COLORS.Y, GTA_COLORS.R, GTA_COLORS.K];

        for (let step = 0; step < 15; step++) {
            if (stopSignal) break;
            const currentRadius = maxRadius * (step / 15);
            for (let p = 0; p < 15; p++) {
                const angle = Math.random() * Math.PI * 2;
                const x = endX + currentRadius * Math.cos(angle);
                const y = endY + currentRadius * Math.sin(angle);
                const color = colors[Math.floor(Math.random() * colors.length)];
                // USANDO sendAndDrawCommand
                sendAndDrawCommand(endX, endY, x, y, color, 8);
            }
            await new Promise(r => setTimeout(r, 30));
        }
    }

    /* ----------------------------------------------------------------------------------
    //  FUNCIONES DE PODERES/EFECTOS GTA (ACTUALIZADAS)
    // ---------------------------------------------------------------------------------- */

    // 6. Full Armor (Power)
    async function fullArmorDefense(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const duration = 4000;
        const startTime = Date.now();
        const thickness = 5 + intensity * 2;

        while (Date.now() - startTime < duration) {
            if (stopSignal) break;
            const elapsed = Date.now() - startTime;
            const radius = 50;
            const pulse = Math.sin(elapsed * 0.015) * 5;

            // Dibuja un círculo exterior gris/azul pulsante
            for (let i = 0; i < 10; i++) {
                const angle = (i / 10) * 2 * Math.PI;
                const dist = radius + pulse;
                const x = target.x + dist * Math.cos(angle);
                const y = target.y + dist * Math.sin(angle);
                const color = (elapsed % 300 < 150) ? GTA_COLORS.A : GTA_COLORS.B;
                // USANDO sendAndDrawCommand
                sendAndDrawCommand(target.x, target.y, x, y, color, thickness);
            }

            await new Promise(r => setTimeout(r, 100));
        }
    }

    // 7. Cash Drop / Payday (Power)
    async function cashDrop(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const duration = 500;
        const startTime = Date.now();

        while (Date.now() - startTime < duration) {
            if (stopSignal) break;
            const elapsed = Date.now() - startTime;
            const count = 5 + intensity;

            for (let i = 0; i < count; i++) {
                const xOffset = (Math.random() - 0.5) * 100;
                const yOffset = -100 + (elapsed * 0.1) % 150; // Movimiento de caída
                // drawPixelArt ya usa sendAndDrawCommand
                drawPixelArt(target.x + xOffset, target.y + yOffset, GTA_PIXEL_ASSETS.CASH_SYMBOL, 1 + intensity * 0.2);
            }

            await new Promise(r => setTimeout(r, 50));
        }
    }

    // 8. 5-Star Wanted Level (Power)
    async function wantedLevelFive(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const duration = 3000;
        const startTime = Date.Now();

        while (Date.now() - startTime < duration) {
            if (stopSignal) break;
            const elapsed = Date.now() - startTime;
            const pulse = Math.sin(elapsed * 0.02) * 5;
            const rotation = elapsed * 0.01;

            // Dibuja 5 estrellas girando
            for (let i = 0; i < 5; i++) {
                const angle = (i / 5) * 2 * Math.PI + rotation;
                const dist = 50 + pulse;
                const x = target.x + dist * Math.cos(angle);
                const y = target.y - 50 + dist * Math.sin(angle); // Sobre la cabeza

                // drawPixelArt ya usa sendAndDrawCommand
                drawPixelArt(x, y, GTA_PIXEL_ASSETS.WANTED_STAR, 1.5);
            }

            await new Promise(r => setTimeout(r, 100));
        }
    }

    // 9. Health Injector (Power)
    async function healthInjector(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const centerX = target.x;
        const centerY = target.y;

        // Pulso de curación verde
        for (let i = 0; i < 8; i++) {
            if (stopSignal) break;
            const size = 1 + i * 0.5;
            // drawPixelArt ya usa sendAndDrawCommand
            drawPixelArt(centerX, centerY, GTA_PIXEL_ASSETS.HEALTH_ICON, size);
            await new Promise(r => setTimeout(r, 50));
        }

        // Estela de salud ascendente
        for (let i = 0; i < 10; i++) {
            // USANDO sendAndDrawCommand
            sendAndDrawCommand(centerX, centerY, centerX, centerY - 50, GTA_COLORS.G, 5 + intensity);
            await new Promise(r => setTimeout(r, 20));
        }
    }

    /* ----------------------------------------------------------------------------------
    //  INTERFAZ DE USUARIO Y GESTIÓN DE EVENTOS (SIN CAMBIOS)
    // ---------------------------------------------------------------------------------- */

    const gtaContainer = document.createElement('div');
    gtaContainer.id = 'GTACompanionUI';
    gtaContainer.style.cssText = `
        position:fixed; bottom:10px; right:10px; z-index:9999;
        background:rgba(20, 20, 20, 0.9);
        color:#FFFFFF; padding:15px 20px; border-radius:10px;
        font-family: 'Consolas', 'Monospace', sans-serif; font-size:12px;
        display:flex; flex-direction:column; gap:10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.8), 0 0 15px rgba(0, 255, 0, 0.3);
        border: 3px solid #00FF00;
        min-width: 250px;
        backdrop-filter: blur(5px);
    `;

    const titleBar = document.createElement('div');
    titleBar.innerHTML = '💰 GTA COMPANION MANAGER ⭐️';
    titleBar.style.cssText = `
        font-weight: bold; font-size: 14px; text-align: center; cursor: grab;
        color: #00FF00;
        background: rgba(0, 0, 0, 0.5);
        text-shadow: 0 0 5px #00FF00;
        margin: -15px -20px 8px -20px; padding: 10px 20px;
        border-bottom: 2px solid #00FF00;
        border-radius: 7px 7px 0 0;
    `;
    gtaContainer.appendChild(titleBar);

    const contentDiv = document.createElement('div');
    contentDiv.style.cssText = `display:flex; flex-direction:column; gap:8px;`;
    gtaContainer.appendChild(contentDiv);

    const gtaInputStyle = `
        flex-grow: 1; padding: 6px 10px; border-radius: 5px;
        border: 2px solid #00FF00; background: rgba(0, 0, 0, 0.7);
        color: #00FFFF; font-size: 11px; font-family: monospace;
        transition: all 0.2s ease;
    `;

    function createGtaRow(parent, labelText, inputElement) {
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
    enemySelect.style.cssText = gtaInputStyle;
    createGtaRow(contentDiv, '👤 Objetivo (LSP D):', enemySelect);

    // Selector de Armas
    const weaponSelect = document.createElement('select');
    weaponSelect.style.cssText = gtaInputStyle;
    for (const name in GTA_WEAPONS) {
        const opt = document.createElement('option');
        opt.value = GTA_WEAPONS[name];
        opt.textContent = name;
        weaponSelect.appendChild(opt);
    }
    weaponSelect.value = GTA_WEAPONS['Ninguno'];
    createGtaRow(contentDiv, '🔫 Arma:', weaponSelect);

    // Selector de Poderes (Effects)
    const powerSelect = document.createElement('select');
    powerSelect.style.cssText = gtaInputStyle;
    for (const name in GTA_POWERS) {
        const opt = document.createElement('option');
        opt.value = GTA_POWERS[name];
        opt.textContent = name;
        powerSelect.appendChild(opt);
    }
    powerSelect.value = GTA_POWERS['Ninguno'];
    createGtaRow(contentDiv, '✨ Habilidad:', powerSelect);

    // Auto-reset de selectores (solo uno a la vez)
    weaponSelect.addEventListener('change', () => {
        if (weaponSelect.value !== '') powerSelect.value = GTA_POWERS['Ninguno'];
    });

    powerSelect.addEventListener('change', () => {
        if (powerSelect.value !== '') weaponSelect.value = GTA_WEAPONS['Ninguno'];
    });

    // Medidor de Fuerza/Poder (Intensity)
    const powerInput = document.createElement('input');
    powerInput.type = 'range';
    powerInput.min = '1';
    powerInput.max = '5';
    powerInput.value = '3';
    powerInput.style.cssText = `flex-grow: 1; accent-color: #00FF00;`;
    createGtaRow(contentDiv, '💪 Intensidad:', powerInput);

    const powerLabel = document.createElement('span');
    powerLabel.style.cssText = 'color: #00FFFF; font-size: 10px; text-align: center; margin-top: -5px;';
    powerLabel.textContent = `Nivel: ${POWER_INTENSITY_LABELS[powerInput.value - 1]}`;
    contentDiv.appendChild(powerLabel);
    powerInput.addEventListener('input', () => {
        powerLabel.textContent = `Nivel: ${POWER_INTENSITY_LABELS[powerInput.value - 1]}`;
    });

    // Toggle de Repetición ("Flujo Continuo")
    const repeatToggle = document.createElement('input');
    repeatToggle.type = 'checkbox';
    repeatToggle.style.cssText = `transform: scale(1.2); accent-color: #FFD700;`;
    const repeatLabel = document.createElement('label');
    repeatLabel.textContent = ' 🔄 Flujo Continuo (Spam)';
    repeatLabel.style.cssText = `color: #FFD700; font-weight: bold; cursor: pointer;`;
    const repeatWrapper = document.createElement('div');
    repeatWrapper.style.cssText = `display:flex; align-items:center; gap:8px; justify-content: center;`;
    repeatWrapper.appendChild(repeatToggle);
    repeatWrapper.appendChild(repeatLabel);
    contentDiv.appendChild(repeatWrapper);

    // Botón de Activación
    const activateBtn = document.createElement('button');
    activateBtn.textContent = '🔥 USA ARMA / ACTIVA HABILIDAD 🔥';
    activateBtn.disabled = true;
    activateBtn.style.cssText = `
        padding: 10px 15px; border-radius: 8px; border: none;
        background: linear-gradient(45deg, #FFD700, #FFCC00);
        color: #000000; font-weight: bold; font-size: 14px;
        cursor: pointer; transition: all 0.2s ease;
        box-shadow: 0 3px 10px rgba(255, 215, 0, 0.5);
        font-family: 'Monospace', monospace;
        &:hover { background: linear-gradient(45deg, #FFCC00, #FFAC00); transform: translateY(-1px); }
        &:disabled { background: #666; cursor: not-allowed; opacity: 0.5; transform: none; }
    `;
    contentDiv.appendChild(activateBtn);

    // Botón de Parada
    stopBtn = document.createElement('button');
    stopBtn.textContent = '⛔ EVADE LA POLICÍA (Stop)';
    stopBtn.disabled = true;
    stopBtn.style.cssText = `
        margin-top: 5px; padding: 8px 12px; border-radius: 6px; border: none;
        background: linear-gradient(45deg, #8B0000, #FF0000);
        color: white; font-weight: bold; font-size: 12px;
        cursor: pointer; transition: all 0.2s ease;
        box-shadow: 0 2px 8px rgba(255, 0, 0, 0.4);
        font-family: 'Monospace', monospace;
        &:hover { background: linear-gradient(45deg, #FF0000, #B00000); transform: translateY(-1px); }
        &:disabled { background: #666; cursor: not-allowed; opacity: 0.5; transform: none; }
    `;
    contentDiv.appendChild(stopBtn);

    document.body.appendChild(gtaContainer);

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
        enemySelect.textContent = '👤 Tú (Prota)';

        playerRows.forEach(row => {
            if (row.dataset.self === 'true') return;
            if (row.dataset.playerid === '0') return;
            const name = row.querySelector('.playerlist-name a')?.textContent || `Enemy ${row.dataset.playerid}`;
            const opt = document.createElement('option');
            opt.value = row.dataset.playerid;
            const gtaName = name.includes('Police') ? '🚨 LSPD/FBI' : '🔪 Rival';
            opt.textContent = `🎯 ${gtaName} (${name})`;
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
        dragOffsetX = e.clientX - gtaContainer.getBoundingClientRect().left;
        dragOffsetY = e.clientY - gtaContainer.getBoundingClientRect().top;
        titleBar.style.cursor = 'grabbing';
    });
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        let newX = e.clientX - dragOffsetX;
        let newY = e.clientY - dragOffsetY;
        newX = Math.max(0, Math.min(newX, window.innerWidth - gtaContainer.offsetWidth));
        newY = Math.max(0, Math.min(newY, window.innerHeight - gtaContainer.offsetHeight));
        gtaContainer.style.left = newX + 'px';
        gtaContainer.style.top = newY + 'px';
        gtaContainer.style.right = 'auto';
        gtaContainer.style.bottom = 'auto';
    });
    document.addEventListener('mouseup', () => {
        isDragging = false;
        titleBar.style.cursor = 'grab';
    });

    // Botón de parada
    stopBtn.addEventListener('click', () => {
        console.log('⛔ Dibujo detenido. ¡Evadiendo a la policía!');
        stopSignal = true;

        if (activePowerInterval) {
            clearInterval(activePowerInterval);
            activePowerInterval = null;
        }

        activateBtn.textContent = '🔥 USA ARMA / ACTIVA HABILIDAD 🔥';
        activateBtn.style.background = 'linear-gradient(45deg, #FFD700, #FFCC00)';
        activateBtn.disabled = false;
        stopBtn.disabled = true;
    });

    // Botón principal de activación
    activateBtn.addEventListener('click', async () => {
        const playerId = enemySelect.value;
        if (!playerId) {
            alert('🎯 ¡Escoge un Rival o LSPD en el que enfocarte!');
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
                case 'weapon:minigun_spray': actionToExecute = () => minigunSpray(playerId, intensity); actionName = 'Minigun Spray'; break;
                case 'weapon:rocket_launcher': actionToExecute = () => rocketLauncher(playerId, intensity); actionName = 'Rocket Launcher'; break;
                case 'weapon:taser_stun': actionToExecute = () => taserStun(playerId, intensity); actionName = 'Taser Stun'; break;
                case 'weapon:drive_by_attack': actionToExecute = () => driveByAttack(playerId, intensity); actionName = 'Drive-By Attack'; break;
                case 'weapon:sticky_bomb': actionToExecute = () => stickyBomb(playerId, intensity); actionName = 'Sticky Bomb'; break;
                default:
                    console.log('⚠️ ¡Esa arma no está en tu inventario!');
                    return;
            }
        } else if (selectedPower && selectedPower.startsWith('effect:')) {
            switch (selectedPower) {
                case 'effect:full_armor': actionToExecute = () => fullArmorDefense(playerId, intensity); actionName = 'Full Armor'; break;
                case 'effect:cash_drop': actionToExecute = () => cashDrop(playerId, intensity); actionName = 'Cash Drop'; break;
                case 'effect:wanted_level_five': actionToExecute = () => wantedLevelFive(playerId, intensity); actionName = '5-Star Wanted Level'; break;
                case 'effect:health_injector': actionToExecute = () => healthInjector(playerId, intensity); actionName = 'Health Injector'; break;
                default:
                    console.log('⚠️ ¡Esa habilidad no está cargada!');
                    return;
            }
        } else {
            alert('🔺 ¡Debes seleccionar un Arma o Habilidad de GTA!');
            return;
        }

        stopSignal = false;
        activateBtn.disabled = true;
        stopBtn.disabled = false;

        try {
            if (repeatToggle.checked) {
                activateBtn.textContent = '🔄 DETENER FLUJO CONTINUO';
                activateBtn.style.background = 'linear-gradient(45deg, #8B0000, #FF0000)';
                activateBtn.disabled = false;

                console.log(`🔥 ¡Iniciando Flujo Continuo de ${actionName}!`);

                const continuousAction = async () => {
                    if (stopSignal || !repeatToggle.checked) {
                        if (activePowerInterval) clearInterval(activePowerInterval);
                        activePowerInterval = null;
                        activateBtn.textContent = '🔥 USA ARMA / ACTIVA HABILIDAD 🔥';
                        activateBtn.style.background = 'linear-gradient(45deg, #FFD700, #FFCC00)';
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
        console.log('¡GRACIAS POR JUGAR! Ahora sal de Drawaria.online y vuelve a la vida real. -Los Santos.');
    });

    // Inicialización
    refreshPlayerList();
    console.log('✨ GTA Companion Mod cargado. ¡Bienvenido a Los Santos! ¡Domina la sesión! ✨');

})();