// ==UserScript==
// @name         🛡️ The Hylian Companion Mod (Zelda Edition) ⚔️
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Invoke the full power of the Triforce! Transform your Drawaria into Hyrule with all legendary items and powers.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @match        https://*.drawaria.online/*
// @icon         https://fonts.gstatic.com/s/e/notoemoji/latest/2728/512.webp
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550803/%F0%9F%9B%A1%EF%B8%8F%20The%20Hylian%20Companion%20Mod%20%28Zelda%20Edition%29%20%E2%9A%94%EF%B8%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/550803/%F0%9F%9B%A1%EF%B8%8F%20The%20Hylian%20Companion%20Mod%20%28Zelda%20Edition%29%20%E2%9A%94%EF%B8%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ----------------------------------------------------------------------------------
    //  PIXEL ART HYLIAN (Drawaria Line Format)
    //  Definición de los assets visuales clave en arrays para ser dibujados línea por línea.
    // ---------------------------------------------------------------------------------- */

    // R=Rojo, D=Oscuro, G=Oro, P=Púrpura, B=Azul, L=Plata, W=Blanco, Y=Amarillo, F=Fairy/Rosa, O=Naranja
    const HYLIAN_PIXEL_ASSETS = {
        // Corazón de Vida (Zelda Classic Style)
        'HEART_CONTAINER': {
            art: [
                "  DDRRDD  ",
                " DRRRRRRD ",
                "DRRRRRRRRD",
                "DRRRRRRRRD",
                " DRRRRRRD ",
                "  DRRRRD  ",
                "   DRRD   "
            ],
            colors: { 'D': '#440000', 'R': '#FF0000' }
        },
        // Espada Maestra (Master Sword)
        'MASTER_SWORD': {
            art: [
                "   L   ",
                "   B   ",
                "  BLB  ",
                "  GLG  ",
                "  PGP  ",
                "  W W  "
            ],
            colors: { 'B': '#1E90FF', 'L': '#C0C0C0', 'G': '#FFD700', 'P': '#800080', 'W': '#FFFFFF' }
        },
        // Escudo Hylian (Hylian Shield)
        'HYLIAN_SHIELD': {
            art: [
                "   B   ",
                "  GBG  ",
                " BBRBB ",
                " WBBBW ",
                " GBBBG ",
                "  BBB  "
            ],
            colors: { 'B': '#1E90FF', 'G': '#FFD700', 'R': '#DC143C', 'W': '#FFFFFF' }
        },
        // Trifuerza (Triforce)
        'TRIFORCE': {
            art: [
                "   G   ",
                "  G G  ",
                " GGGGG "
            ],
            colors: { 'G': '#FFD700' }
        },
        // Hada de Recuperación (Navi/Fairy)
        'RECOVERY_FAIRY': {
            art: [
                "  YYY  ",
                " YFFFY ",
                " YFFFY ",
                "  YYY  "
            ],
            colors: { 'Y': '#FFFFFF', 'F': '#FFC0CB' }
        },
        // Nota Musical (Ocarina Stun)
        'MUSIC_NOTE': {
            art: [
                " WW ",
                " WB ",
                " B  "
            ],
            colors: { 'W': '#FFFFFF', 'B': '#ADD8E6' }
        }
    };


    /* ----------------------------------------------------------------------------------
    //  CONSTANTES DE HYRULE - ITEMS Y PODERES
    // ---------------------------------------------------------------------------------- */
    const ZELDA_ITEMS = {
        'Ninguno': '',
        '⚔️ Espada Maestra (Ataque)': 'weapon:master_sword',
        '🏹 Flecha de Luz (Laser)': 'weapon:light_arrow',
        '💣 Bomba (Explosión)': 'weapon:bomb_explosion',
        '🎣 Gancho (Movimiento)': 'weapon:hookshot_draw',
        '🌪️ Gran Spin Attack': 'weapon:spin_attack',
        '✨ Espada Lanzarrayos': 'weapon:sword_beam_boost'
    };

    const HYLIAN_POWERS = {
        'Ninguno': '',
        '🛡️ Escudo Hylian (Defensa)': 'effect:hylian_shield',
        '🧚 Hada de Recuperación': 'effect:recovery_fairy',
        '💛 Contenedor de Corazón': 'effect:heart_container_boost',
        '🌀 Ocarina de Tiempo (Stun)': 'effect:ocarina_stun',
        '🔥 Varita de Fuego': 'effect:fire_rod'
    };

    const POWER_INTENSITY_LABELS = ['Bajo (Kokiri)', 'Medio (Goron)', 'Alto (Zora)', 'Maestro (Hylian)', 'Leyenda (Trifuerza)'];

    /* ----------------------------------------------------------------------------------
    //  SETUP BASE (Conexión y Canvas)
    // ---------------------------------------------------------------------------------- */
    let socket;
    const canvas = document.getElementById('canvas');
    const ctx = canvas ? canvas.getContext('2d') : null;

    let stopSignal = false;
    let stopPowerBtn;
    let activePowerInterval = null;

    const originalSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (...args) {
        if (!socket) socket = this;
        return originalSend.apply(this, args);
    };

    /* ----------------------------------------------------------------------------------
    //  INTERFAZ DE USUARIO: Hylian Command Panel (UI) - (Mismo código, no se modifica)
    // ---------------------------------------------------------------------------------- */
    const hylianContainer = document.createElement('div');
    hylianContainer.id = 'HylianCompanionUI';
    hylianContainer.style.cssText = `
        position:fixed; bottom:10px; right:10px; z-index:9999;
        background:rgba(21, 67, 96, 0.85); /* Azul/Verde Oscuro de Inventario */
        color:#FFD700; padding:15px 20px; border-radius:10px;
        font-family: 'Pixelify Sans', 'Press Start 2P', monospace, sans-serif; font-size:12px;
        display:flex; flex-direction:column; gap:10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.6);
        border: 3px solid #FFD700; /* Borde Dorado (Trifuerza) */
        min-width: 250px;
        backdrop-filter: blur(5px);
    `;

    const titleBar = document.createElement('div');
    titleBar.innerHTML = '⚔️ HYLIAN COMPANION MANAGER 🧚';
    titleBar.style.cssText = `
        font-weight: bold; font-size: 14px; text-align: center; cursor: grab;
        color: #00FF00; /* Verde de Link */
        background: rgba(30, 80, 50, 0.7);
        text-shadow: 0 0 5px #00FF00;
        margin: -15px -20px 8px -20px; padding: 10px 20px;
        border-bottom: 2px solid #FFD700;
        border-radius: 7px 7px 0 0;
    `;
    hylianContainer.appendChild(titleBar);

    const contentDiv = document.createElement('div');
    contentDiv.style.cssText = `display:flex; flex-direction:column; gap:8px;`;
    hylianContainer.appendChild(contentDiv);

    const hylianInputStyle = `
        flex-grow: 1; padding: 6px 10px; border-radius: 5px;
        border: 2px solid #00FF00; background: rgba(50, 100, 70, 0.8);
        color: #FFD700; font-size: 11px; font-family: monospace;
        transition: all 0.2s ease;
    `;

    function createHylianRow(parent, labelText, inputElement) {
        const wrapper = document.createElement('div');
        wrapper.style.cssText = `display:flex; align-items:center; gap:8px;`;
        const label = document.createElement('span');
        label.textContent = labelText;
        label.style.cssText = `color: #FFFFFF; font-weight: bold; min-width: 80px;`;
        wrapper.appendChild(label);
        wrapper.appendChild(inputElement);
        parent.appendChild(wrapper);
        return { wrapper, label, inputElement };
    }

    // Selector de Enemigo (Target)
    const enemySelect = document.createElement('select');
    enemySelect.style.cssText = hylianInputStyle;
    createHylianRow(contentDiv, '👤 Objetivo (Bokoblin):', enemySelect);

    // Selector de Items
    const itemSelect = document.createElement('select');
    itemSelect.style.cssText = hylianInputStyle;
    for (const name in ZELDA_ITEMS) {
        const opt = document.createElement('option');
        opt.value = ZELDA_ITEMS[name];
        opt.textContent = name;
        itemSelect.appendChild(opt);
    }
    itemSelect.value = ZELDA_ITEMS['Ninguno'];
    createHylianRow(contentDiv, '🗡️ Item/Arma:', itemSelect);

    // Selector de Poderes (Magic/Effects)
    const powerSelect = document.createElement('select');
    powerSelect.style.cssText = hylianInputStyle;
    for (const name in HYLIAN_POWERS) {
        const opt = document.createElement('option');
        opt.value = HYLIAN_POWERS[name];
        opt.textContent = name;
        powerSelect.appendChild(opt);
    }
    powerSelect.value = HYLIAN_POWERS['Ninguno'];
    createHylianRow(contentDiv, '✨ Poder Mágico:', powerSelect);

    // Auto-reset de selectores (solo uno a la vez)
    itemSelect.addEventListener('change', () => {
        if (itemSelect.value !== '') powerSelect.value = HYLIAN_POWERS['Ninguno'];
    });

    powerSelect.addEventListener('change', () => {
        if (powerSelect.value !== '') itemSelect.value = ZELDA_ITEMS['Ninguno'];
    });

    // Medidor de Fuerza/Poder (Intensity)
    const powerInput = document.createElement('input');
    powerInput.type = 'range';
    powerInput.min = '1';
    powerInput.max = '5';
    powerInput.value = '3';
    powerInput.style.cssText = `flex-grow: 1; accent-color: #00FF00;`;
    const powerRow = createHylianRow(contentDiv, '💪 Fuerza (Medidor):', powerInput);

    const powerLabel = document.createElement('span');
    powerLabel.style.cssText = 'color: #FFCC00; font-size: 10px; text-align: center; margin-top: -5px;';
    powerLabel.textContent = `Nivel: ${POWER_INTENSITY_LABELS[powerInput.value - 1]}`;
    contentDiv.appendChild(powerLabel);
    powerInput.addEventListener('input', () => {
        powerLabel.textContent = `Nivel: ${POWER_INTENSITY_LABELS[powerInput.value - 1]}`;
    });


    // Toggle de Repetición (Opcional - "Flujo de Magia")
    const repeatToggle = document.createElement('input');
    repeatToggle.type = 'checkbox';
    repeatToggle.style.cssText = `transform: scale(1.2); accent-color: #FFD700;`;
    const repeatLabel = document.createElement('label');
    repeatLabel.textContent = ' 🔄 Flujo de Magia Continua';
    repeatLabel.style.cssText = `color: #FFD700; font-weight: bold; cursor: pointer;`;
    const repeatWrapper = document.createElement('div');
    repeatWrapper.style.cssText = `display:flex; align-items:center; gap:8px; justify-content: center;`;
    repeatWrapper.appendChild(repeatToggle);
    repeatWrapper.appendChild(repeatLabel);
    contentDiv.appendChild(repeatWrapper);

    // Botón de Activación
    const activateBtn = document.createElement('button');
    activateBtn.textContent = '🔺 ACTIVA PODER / USA ITEM 🔺';
    activateBtn.disabled = true;
    activateBtn.style.cssText = `
        padding: 10px 15px; border-radius: 8px; border: none;
        background: linear-gradient(45deg, #FFD700, #FFCC00); /* Dorado */
        color: #2E8B57; font-weight: bold; font-size: 14px; /* Verde Oscuro */
        cursor: pointer; transition: all 0.2s ease;
        box-shadow: 0 3px 10px rgba(255, 215, 0, 0.5);
        text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        font-family: 'Pixelify Sans', monospace;
        &:hover { background: linear-gradient(45deg, #FFCC00, #FFAC00); transform: translateY(-1px); }
        &:disabled { background: #666; cursor: not-allowed; opacity: 0.5; transform: none; }
    `;
    contentDiv.appendChild(activateBtn);

    // Botón de Parada (Final de la Aventura)
    stopPowerBtn = document.createElement('button');
    stopPowerBtn.textContent = '🛑 GUARDA LA ESPADA (Detener)';
    stopPowerBtn.disabled = true;
    stopPowerBtn.style.cssText = `
        margin-top: 5px; padding: 8px 12px; border-radius: 6px; border: none;
        background: linear-gradient(45deg, #B22222, #8B0000); /* Rojo Oscuro */
        color: white; font-weight: bold; font-size: 12px;
        cursor: pointer; transition: all 0.2s ease;
        box-shadow: 0 2px 8px rgba(178, 34, 34, 0.4);
        font-family: 'Pixelify Sans', monospace;
        &:hover { background: linear-gradient(45deg, #8B0000, #550000); transform: translateY(-1px); }
        &:disabled { background: #666; cursor: not-allowed; opacity: 0.5; transform: none; }
    `;
    contentDiv.appendChild(stopPowerBtn);

    document.body.appendChild(hylianContainer);

    /* ----------------------------------------------------------------------------------
    //  NÚCLEO DE DIBUJO HYLIAN
    // ---------------------------------------------------------------------------------- */

    /**
     * Envía el comando de dibujo (Drawcmd) a través del WebSocket.
     */
    function sendZeldaDrawCommand(x1, y1, x2, y2, color, thickness) {
        x1 = Math.round(x1);
        y1 = Math.round(y1);
        x2 = Math.round(x2); y2 = Math.round(y2);

        if (ctx && canvas) {
            ctx.strokeStyle = color;
            ctx.lineWidth = thickness;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }

        if (!socket || !canvas) return;

        // Conversión a coordenadas normalizadas para Drawaria
        const normX1 = (x1 / canvas.width).toFixed(4);
        const normY1 = (y1 / canvas.height).toFixed(4);
        const normX2 = (x2 / canvas.width).toFixed(4);
        const normY2 = (y2 / canvas.height).toFixed(4);

        const cmd = `42["drawcmd",0,[${normX1},${normY1},${normX2},${normY2},false,${0 - thickness},"${color}",0,0,{}]]`;
        socket.send(cmd);
    }

    /**
     * Dibuja el pixel art de Zelda definido en HYLIAN_PIXEL_ASSETS en la posición del objetivo.
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

                    // Dibuja el pixel como un punto grande (simula un cuadrado rellenado)
                    sendZeldaDrawCommand(pX, pY, pX + 1, pY + 1, color, pixelSize);
                }
            }
        }
    }

    // Obtener coordenadas del jugador objetivo
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
    //  FUNCIONES DE ARMAS ZELDA (COMPLETADAS)
    // ---------------------------------------------------------------------------------- */

    // 1. Espada Maestra (Ataque) - "Sword Beam"
    async function masterSwordBeam(playerId, intensity = 3) {
        if (stopSignal) return;
        console.log(`⚔️ ¡Link ha desenvainado la Espada Maestra! ¡SWORD BEAM!`);

        const target = getPlayerCoords(playerId);
        if (!target) return;

        const startX = canvas.width * 0.5;
        const startY = canvas.height - 50; // Posición de Link (abajo)
        const endX = target.x;
        const endY = target.y;

        const beamThickness = 5 + intensity * 2;
        const beamColor = '#1E90FF'; // Azul de la Espada Maestra

        // Animación del rayo
        for (let i = 0; i < 8; i++) {
            if (stopSignal) break;
            const progress = i / 7;
            const currentX = startX + (endX - startX) * progress;
            const currentY = startY + (endY - startY) * progress;

            // Dibuja la onda azul
            sendZeldaDrawCommand(startX, startY, currentX, currentY, beamColor, beamThickness);
            sendZeldaDrawCommand(currentX, currentY, currentX, currentY, '#FFFFFF', 3); // Brillo en la punta

            await new Promise(r => setTimeout(r, 40));
        }

        // Efecto de impacto: Dibujar Trifuerza
        drawPixelArt(endX, endY, HYLIAN_PIXEL_ASSETS.TRIFORCE, 1.5);
        await new Promise(r => setTimeout(r, 100));
    }

    // 2. Flecha de Luz (Light Arrow)
    async function lightArrow(playerId, intensity = 3) {
        if (stopSignal) return;
        console.log(`🏹 ¡Zelda dispara una Flecha de Luz!`);

        const target = getPlayerCoords(playerId);
        if (!target) return;

        const startX = canvas.width * 0.1;
        const startY = canvas.height * 0.1;
        const endX = target.x;
        const endY = target.y;

        const duration = 800 + intensity * 200;
        const startTime = Date.now();

        while (Date.now() - startTime < duration) {
            if (stopSignal) break;

            // Trazo principal: Blanco y Dorado
            sendZeldaDrawCommand(startX, startY, endX, endY, '#FFFFFF', 4 + intensity);
            sendZeldaDrawCommand(startX, startY, endX, endY, '#FFD700', 2 + intensity);

            // Estela de energía
            for (let i = 0; i < 3; i++) {
                const offsetX = (Math.random() - 0.5) * 5;
                const offsetY = (Math.random() - 0.5) * 5;
                sendZeldaDrawCommand(
                    startX + offsetX, startY + offsetY,
                    endX + offsetX, endY + offsetY,
                    '#ADD8E6', 1
                );
            }
            await new Promise(r => setTimeout(r, 30));
        }

        // Impacto: Ráfaga de luz
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * 2 * Math.PI;
            const dist = 10 + intensity * 2;
            sendZeldaDrawCommand(endX, endY, endX + dist * Math.cos(angle), endY + dist * Math.sin(angle), '#FFD700', 3);
        }
    }

    // 3. Bomba (Explosión)
    async function bombExplosion(playerId, intensity = 3) {
        if (stopSignal) return;
        console.log(`💣 ¡Cuidado con el radio de explosión!`);

        const target = getPlayerCoords(playerId);
        if (!target) return;

        const centerX = target.x;
        const centerY = target.y;

        // Anima el fuego/humo de la explosión
        const colors = ['#8B4513', '#FF4500', '#FFD700'];
        const explosionSteps = 15;
        const maxRadius = 60 + intensity * 15;

        for (let step = 0; step < explosionSteps; step++) {
            if (stopSignal) break;
            const progress = step / explosionSteps;
            const currentRadius = maxRadius * progress;
            const particleCount = 15 + intensity * 5;

            for (let p = 0; p < particleCount; p++) {
                const angle = Math.random() * Math.PI * 2;
                const distance = currentRadius * (0.5 + Math.random() * 0.5);
                const x = centerX + distance * Math.cos(angle);
                const y = centerY + distance * Math.sin(angle);
                const color = colors[Math.floor(Math.random() * colors.length)];
                const thickness = Math.max(1, 10 - step);
                sendZeldaDrawCommand(centerX, centerY, x, y, color, thickness);
            }
            await new Promise(r => setTimeout(r, 60));
        }
    }

    // 4. Gancho (Hookshot Draw) - IMPLEMENTADO
    async function hookshotDraw(playerId, intensity = 3) {
        if (stopSignal) return;
        console.log(`🎣 ¡Enganche activado! Atrayendo al enemigo.`);

        const target = getPlayerCoords(playerId);
        if (!target) return;

        const startX = canvas.width / 2;
        const startY = canvas.height - 50;
        const endX = target.x;
        const endY = target.y;

        const chainColor = '#C0C0C0'; // Plata
        const headColor = '#FFD700';  // Dorado

        // Paso 1: Extender la cadena
        for (let i = 0; i < 10; i++) {
            if (stopSignal) break;
            const progress = i / 9;
            const currentX = startX + (endX - startX) * progress;
            const currentY = startY + (endY - startY) * progress;

            sendZeldaDrawCommand(startX, startY, currentX, currentY, chainColor, 2);
            // Dibuja la cabeza del gancho en la punta
            sendZeldaDrawCommand(currentX, currentY, currentX, currentY, headColor, 8);
            await new Promise(r => setTimeout(r, 30));
        }

        // Paso 2: Dibujar el efecto de "enganche"
        for (let i = 0; i < 5; i++) {
            const size = 10 + i * 3;
            sendZeldaDrawCommand(endX, endY, endX, endY, headColor, size);
            await new Promise(r => setTimeout(r, 20));
        }

        // Paso 3: Retraer (Opcional: puedes hacer que dibuje una línea hacia atrás rápidamente si quieres simular un tirón)
        await new Promise(r => setTimeout(r, 200));
    }

    // 5. Gran Spin Attack - IMPLEMENTADO
    async function spinAttack(playerId, intensity = 3) {
        if (stopSignal) return;
        console.log(`🌪️ ¡Gran Spin Attack de Link!`);

        const target = getPlayerCoords(playerId);
        if (!target) return;

        const centerX = target.x;
        const centerY = target.y;
        const maxRadius = 30 + intensity * 10;
        const duration = 800;
        const startTime = Date.now();

        while (Date.now() - startTime < duration) {
            if (stopSignal) break;
            const elapsed = Date.now() - startTime;
            const rotation = elapsed * 0.05; // Velocidad de rotación
            const segments = 12;

            for (let i = 0; i < segments; i++) {
                const angle1 = (i / segments) * 2 * Math.PI + rotation;
                const angle2 = ((i + 1) / segments) * 2 * Math.PI + rotation;

                const r1 = maxRadius * (0.8 + Math.random() * 0.2);
                const r2 = maxRadius * (0.8 + Math.random() * 0.2);

                const x1 = centerX + r1 * Math.cos(angle1);
                const y1 = centerY + r1 * Math.sin(angle1);
                const x2 = centerX + r2 * Math.cos(angle2);
                const y2 = centerY + r2 * Math.sin(angle2);

                sendZeldaDrawCommand(x1, y1, x2, y2, '#00FF00', 4 + intensity); // Espada verde de Link
            }
            await new Promise(r => setTimeout(r, 30));
        }
    }

    // 6. Espada Lanzarrayos (Sword Beam Boost) - IMPLEMENTADO
    async function swordBeamBoost(playerId, intensity = 3) {
        if (stopSignal) return;
        console.log(`✨ ¡Espada Lanzarrayos: Poder del Maestro!`);

        const target = getPlayerCoords(playerId);
        if (!target) return;

        // Se usa la función base, pero con un triple rayo
        await masterSwordBeam(playerId, intensity * 1.5);

        // Rayo adicional más grueso y amarillo
        const startX = canvas.width * 0.5;
        const startY = canvas.height - 50;
        const endX = target.x;
        const endY = target.y;

        sendZeldaDrawCommand(startX, startY, endX, endY, '#FFD700', 4);
        sendZeldaDrawCommand(startX + 10, startY, endX + 10, endY, '#1E90FF', 4);

        await new Promise(r => setTimeout(r, 200));
        // Dibujar Trifuerza más grande
        drawPixelArt(endX, endY + 20, HYLIAN_PIXEL_ASSETS.TRIFORCE, 2);
    }


    /* ----------------------------------------------------------------------------------
    //  FUNCIONES DE PODERES HYLIAN (COMPLETADAS)
    // ---------------------------------------------------------------------------------- */

    // 1. Escudo Hylian (Defensa)
    async function hylianShieldDefense(playerId, intensity = 3) {
        if (stopSignal) return;
        console.log(`🛡️ ¡El Escudo Hylian brilla! Defensa activa.`);

        const target = getPlayerCoords(playerId);
        if (!target) return;

        const duration = 4000;
        const startTime = Date.now();

        while (Date.now() - startTime < duration) {
            if (stopSignal) break;

            const elapsed = Date.now() - startTime;
            const shieldRadius = 40 + intensity * 5;
            const pulse = Math.sin(elapsed * 0.015) * 3;

            drawPixelArt(target.x, target.y - 10, HYLIAN_PIXEL_ASSETS.HYLIAN_SHIELD, 1.5);

            // Efecto de parry (destello blanco/azul)
            for (let i = 0; i < 4; i++) {
                const angle = Math.random() * Math.PI * 2;
                const dist = shieldRadius + pulse;
                sendZeldaDrawCommand(target.x, target.y, target.x + dist * Math.cos(angle), target.y + dist * Math.sin(angle), '#ADD8E6', 1);
            }

            await new Promise(r => setTimeout(r, 100));
        }
    }

    // 2. Hada de Recuperación
    async function recoveryFairy(playerId, intensity = 3) {
        if (stopSignal) return;
        console.log(`🧚 ¡Hey, Listen! El hada te restaura la vida.`);

        const target = getPlayerCoords(playerId);
        if (!target) return;

        const fairyDuration = 2000;
        const startTime = Date.now();

        while (Date.now() - startTime < fairyDuration) {
            if (stopSignal) break;
            const elapsed = Date.now() - startTime;
            const yOffset = Math.sin(elapsed * 0.01) * 10;

            drawPixelArt(target.x - 40, target.y - 50 + yOffset, HYLIAN_PIXEL_ASSETS.RECOVERY_FAIRY, 1.2);

            if (elapsed % 500 < 250) {
                drawPixelArt(target.x, target.y + 30, HYLIAN_PIXEL_ASSETS.HEART_CONTAINER, 1.5);
            }

            await new Promise(r => setTimeout(r, 100));
        }

        for (let size = 1.5; size < 2.5; size += 0.2) {
            drawPixelArt(target.x, target.y + 30, HYLIAN_PIXEL_ASSETS.HEART_CONTAINER, size);
            await new Promise(r => setTimeout(r, 50));
        }
    }

    // 3. Contenedor de Corazón (Vida Extendida)
    async function heartContainerBoost(playerId, intensity = 3) {
        if (stopSignal) return;
        console.log(`💖 ¡Felicidades! Has ganado un Contenedor de Corazón.`);

        const target = getPlayerCoords(playerId);
        if (!target) return;

        const centerX = target.x;
        const centerY = target.y;

        for (let i = 0; i < 20; i++) {
            if (stopSignal) break;
            const size = 1 + i * 0.1;
            drawPixelArt(centerX, centerY, HYLIAN_PIXEL_ASSETS.HEART_CONTAINER, size);
            await new Promise(r => setTimeout(r, 50));
        }

        drawPixelArt(centerX, centerY - 80, HYLIAN_PIXEL_ASSETS.TRIFORCE, 2);
        await new Promise(r => setTimeout(r, 500));
    }

    // 4. Ocarina de Tiempo (Stun) - IMPLEMENTADO
    async function ocarinaStun(playerId, intensity = 3) {
        if (stopSignal) return;
        console.log(`🌀 ¡Tocando la Canción del Sol! Enemigo congelado.`);

        const target = getPlayerCoords(playerId);
        if (!target) return;

        const centerX = target.x;
        const centerY = target.y;
        const duration = 2500;
        const startTime = Date.now();
        const colors = ['#00FFFF', '#ADD8E6'];

        while (Date.now() - startTime < duration) {
            if (stopSignal) break;
            const elapsed = Date.now() - startTime;
            const maxRadius = 50 + intensity * 10;
            const pulse = Math.sin(elapsed * 0.02) * 5;

            // Notas musicales girando
            const noteRadius = 30 + pulse;
            const noteAngle = elapsed * 0.01;
            const x = centerX + noteRadius * Math.cos(noteAngle);
            const y = centerY + noteRadius * Math.sin(noteAngle);
            drawPixelArt(x, y, HYLIAN_PIXEL_ASSETS.MUSIC_NOTE, 1.5);
            drawPixelArt(centerX - (x - centerX), centerY - (y - centerY), HYLIAN_PIXEL_ASSETS.MUSIC_NOTE, 1.5);

            // Onda de choque azul
            for (let i = 0; i < 3; i++) {
                const r = maxRadius * (i / 3) + pulse;
                for (let seg = 0; seg < 10; seg++) {
                    const angle1 = (seg / 10) * 2 * Math.PI;
                    const angle2 = ((seg + 1) / 10) * 2 * Math.PI;

                    const x1 = centerX + r * Math.cos(angle1);
                    const y1 = centerY + r * Math.sin(angle1);
                    const x2 = centerX + r * Math.cos(angle2);
                    const y2 = centerY + r * Math.sin(angle2);
                    sendZeldaDrawCommand(x1, y1, x2, y2, colors[i % 2], 1);
                }
            }
            await new Promise(r => setTimeout(r, 80));
        }
    }

    // 5. Varita de Fuego (Fire Rod) - IMPLEMENTADO
    async function fireRod(playerId, intensity = 3) {
        if (stopSignal) return;
        console.log(`🔥 ¡El Fuego de Din se desata!`);

        const target = getPlayerCoords(playerId);
        if (!target) return;

        const startX = 50; // Inicia desde la izquierda
        const endX = target.x;
        const centerY = target.y;

        const flameColors = ['#FF4500', '#FF8C00', '#FFD700'];
        const numFlames = 15 + intensity * 5;

        for (let i = 0; i < numFlames; i++) {
            if (stopSignal) break;

            const progress = i / numFlames;
            const currentX = startX + (endX - startX) * progress;
            const currentY = centerY + (Math.random() - 0.5) * 50; // Movimiento vertical de la flama

            // Dibujar la flama como múltiples líneas
            for (let j = 0; j < 5; j++) {
                const color = flameColors[j % flameColors.length];
                const thickness = Math.max(1, 10 - j * 2 + intensity);
                const x2 = currentX + (Math.random() - 0.5) * 20;
                const y2 = currentY + (Math.random() - 0.5) * 20;
                sendZeldaDrawCommand(currentX, currentY, x2, y2, color, thickness);
            }

            await new Promise(r => setTimeout(r, 40));
        }

        // Impacto final
        await bombExplosion(playerId, intensity * 0.5); // Explosión de fuego menor
    }

    /* ----------------------------------------------------------------------------------
    //  SISTEMA DE GESTIÓN DE JUGADORES (Hylian List) - (Mismo código, no se modifica)
    // ---------------------------------------------------------------------------------- */

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
        enemySelect.textContent = '👤 Link'; // Nombre por defecto si es Link

        playerRows.forEach(row => {
            if (row.dataset.self === 'true') return;
            if (row.dataset.playerid === '0') return;
            const name = row.querySelector('.playerlist-name a')?.textContent || `Enemy ${row.dataset.playerid}`;
            const opt = document.createElement('option');
            opt.value = row.dataset.playerid;
            // Muestra nombre de jugador como "Bokoblin" o "Ganondorf"
            const zeldaName = name.includes('Ganondorf') ? '😈 Ganondorf' : '👹 Bokoblin';
            opt.textContent = `🎯 ${zeldaName} (${name})`;
            enemySelect.appendChild(opt);
        });

        if (previousSelection) {
            enemySelect.value = previousSelection;
        }

        lastPlayerList = new Set(currentPlayers);
        activateBtn.disabled = enemySelect.children.length === 0;
        isUpdatingList = false;
    }


    /* ----------------------------------------------------------------------------------
    //  EVENTOS PRINCIPALES DE HYRULE
    // ---------------------------------------------------------------------------------- */

    // Arrastrar ventana
    let isDragging = false;
    let offsetX, offsetY;
    titleBar.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - hylianContainer.getBoundingClientRect().left;
        offsetY = e.clientY - hylianContainer.getBoundingClientRect().top;
    });
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;
        newX = Math.max(0, Math.min(newX, window.innerWidth - hylianContainer.offsetWidth));
        newY = Math.max(0, Math.min(newY, window.innerHeight - hylianContainer.offsetHeight));
        hylianContainer.style.left = newX + 'px';
        hylianContainer.style.top = newY + 'px';
    });
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Botón de parada de emergencia (Guarda la espada)
    stopPowerBtn.addEventListener('click', () => {
        console.log('🛑 ¡Aventura terminada! "Game Over" de Zelda.');
        stopSignal = true;

        if (activePowerInterval) {
            clearInterval(activePowerInterval);
            activePowerInterval = null;
        }

        activateBtn.textContent = '🔺 ACTIVA PODER / USA ITEM 🔺';
        activateBtn.style.background = 'linear-gradient(45deg, #FFD700, #FFCC00)';
        activateBtn.disabled = false;
        stopPowerBtn.disabled = true;
    });

    // Botón principal de activación
    activateBtn.addEventListener('click', async () => {
        const playerId = enemySelect.value;
        if (!playerId) {
            alert('🎯 ¡Escoge un Bokoblin/Objetivo en el que enfocarte!');
            return;
        }

        const selectedItem = itemSelect.value;
        const selectedPower = powerSelect.value;
        const intensity = parseInt(powerInput.value);

        if (activePowerInterval) {
            console.log('Deteniendo Flujo de Magia...');
            stopPowerBtn.click();
            return;
        }

        let actionToExecute = null;
        let powerName = '';

        // Mapeo COMPLETO de Items/Poderes a Funciones
        if (selectedItem && selectedItem.startsWith('weapon:')) {
            switch (selectedItem) {
                case 'weapon:master_sword': actionToExecute = () => masterSwordBeam(playerId, intensity); powerName = 'Espada Maestra'; break;
                case 'weapon:light_arrow': actionToExecute = () => lightArrow(playerId, intensity); powerName = 'Flecha de Luz'; break;
                case 'weapon:bomb_explosion': actionToExecute = () => bombExplosion(playerId, intensity); powerName = 'Bomba'; break;
                case 'weapon:hookshot_draw': actionToExecute = () => hookshotDraw(playerId, intensity); powerName = 'Gancho'; break; // Mapeo Corregido
                case 'weapon:spin_attack': actionToExecute = () => spinAttack(playerId, intensity); powerName = 'Spin Attack'; break; // Mapeo Corregido
                case 'weapon:sword_beam_boost': actionToExecute = () => swordBeamBoost(playerId, intensity); powerName = 'Master Sword Boost'; break; // Mapeo Corregido
                default:
                    console.log('⚠️ ¡Ese Item de Zelda no está en tu inventario!');
                    return;
            }
        } else if (selectedPower && selectedPower.startsWith('effect:')) {
            switch (selectedPower) {
                case 'effect:hylian_shield': actionToExecute = () => hylianShieldDefense(playerId, intensity); powerName = 'Escudo Hylian'; break;
                case 'effect:recovery_fairy': actionToExecute = () => recoveryFairy(playerId, intensity); powerName = 'Hada'; break;
                case 'effect:heart_container_boost': actionToExecute = () => heartContainerBoost(playerId, intensity); powerName = 'Contenedor de Corazón'; break;
                case 'effect:ocarina_stun': actionToExecute = () => ocarinaStun(playerId, intensity); powerName = 'Ocarina Stun'; break; // Mapeo Corregido
                case 'effect:fire_rod': actionToExecute = () => fireRod(playerId, intensity); powerName = 'Varita de Fuego'; break; // Mapeo Corregido
                default:
                    console.log('⚠️ ¡Ese Poder Mágico no está cargado!');
                    return;
            }
        } else {
            alert('🔺 ¡Debes seleccionar un Item o Poder Mágico de Zelda!');
            return;
        }

        stopSignal = false;
        activateBtn.disabled = true;
        stopPowerBtn.disabled = false;

        try {
            if (repeatToggle.checked) {
                activateBtn.textContent = '🔄 DETENER FLUJO MÁGICO';
                activateBtn.style.background = 'linear-gradient(45deg, #B22222, #8B0000)';
                activateBtn.disabled = false;

                console.log(`🔥 ¡Iniciando Flujo de Magia Continua de ${powerName}!`);

                const continuousAction = async () => {
                    if (stopSignal || !repeatToggle.checked) {
                        if (activePowerInterval) clearInterval(activePowerInterval);
                        activePowerInterval = null;
                        activateBtn.textContent = '🔺 ACTIVA PODER / USA ITEM 🔺';
                        activateBtn.style.background = 'linear-gradient(45deg, #FFD700, #FFCC00)';
                        stopPowerBtn.disabled = true;
                        return;
                    }

                    try {
                        await actionToExecute();
                    } catch (error) {
                        console.error(`Error durante el Flujo de Magia (${powerName}):`, error);
                    }
                };

                await continuousAction();
                if (!stopSignal) {
                    activePowerInterval = setInterval(continuousAction, 2500); // Intervalo de 2.5s
                }
            } else {
                console.log(`💥 Ejecutando ${powerName} una sola vez...`);
                await actionToExecute();
            }
        } finally {
            if (!activePowerInterval) {
                activateBtn.disabled = false;
                stopPowerBtn.disabled = true;
            }
        }
    });

    // Observar cambios en la lista de jugadores (para actualizar Targets)
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

    // Limpieza al cerrar (Despide al compañero)
    window.addEventListener('beforeunload', () => {
        if (activePowerInterval) {
            clearInterval(activePowerInterval);
            activePowerInterval = null;
        }
        stopSignal = true;
        console.log('¡Gracias por jugar! Regresa a Drawaria cuando quieras aventurar de nuevo. -El Compadre Hylian.');
    });

    // Inicialización (Muestra el mensaje de inicio)
    refreshPlayerList();
    console.log('✨ ¡Bienvenido a Hyrule! The Hylian Companion Mod cargado exitosamente. ¡Que la Trifuerza te guíe! ✨');

})();