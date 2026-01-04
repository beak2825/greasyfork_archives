// ==UserScript==
// @name         💙 Frisk's Companion Mod (Undertale Edition) 💎
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Launch Gaster Blasters, use the Noodle Cure, and dodge the Blue attack! Transform Drawaria into an Undertale Boss Battle.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @match        https://*.drawaria.online/*
// @icon         https://fonts.gstatic.com/s/e/notoemoji/latest/2764_fe0f/512.webp
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550905/%F0%9F%92%99%20Frisk%27s%20Companion%20Mod%20%28Undertale%20Edition%29%20%F0%9F%92%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/550905/%F0%9F%92%99%20Frisk%27s%20Companion%20Mod%20%28Undertale%20Edition%29%20%F0%9F%92%8E.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ----------------------------------------------------------------------------------
    //  CONFIGURACIÓN Y ASSETS DE UNDERTALE
    // ---------------------------------------------------------------------------------- */

    // Colores de la paleta Undertale (ALMA, Ataques, HP y Fondo)
    const UT_COLORS = {
        'R': '#FF0000',  // Rojo (ALMA Humana / HP)
        'B': '#0000FF',  // Azul (Ataque Azul / Integridad)
        'O': '#FFA500',  // Naranja (Ataque Naranja / Valentía)
        'G': '#008000',  // Verde (Curación / Amabilidad)
        'Y': '#FFFF00',  // Amarillo (Disparo / Justicia)
        'P': '#800080',  // Púrpura (Telaraña / Paciencia)
        'C': '#00FFFF',  // Cyan (Hielo / Persistencia)
        'W': '#FFFFFF',  // Blanco (Ataque Normal / Fondo)
        'K': '#000000',  // Negro (Bordes / Vacío)
        'F': '#D3D3D3'   // Gris Claro (Caja de Batalla)
    };

    // Estructuras de Pixel Art detalladas (Iconos de Batalla)
    const UT_PIXEL_ASSETS = {
        // ALMA Humana (Corazón)
        'SOUL_HEART': {
            art: [
                "  R R  ",
                " R R R ",
                "R R R R R",
                " R R R ",
                "  R R  "
            ],
            colors: { 'R': UT_COLORS.R, 'K': UT_COLORS.K }
        },
        // Gaster Blaster (Craneo)
        'GASTER_BLASTER': {
            art: [
                " KKKKK ",
                "K W W K",
                "K W W K",
                " KKKKK ",
                "K W W K"
            ],
            colors: { 'W': UT_COLORS.W, 'K': UT_COLORS.K }
        },
        // Hueso (Ataque de Sans/Papyrus)
        'BONE_ATTACK': {
            art: [
                "  WWW  ",
                " W W W ",
                "W W W W",
                " W W W ",
                "  WWW  "
            ],
            colors: { 'W': UT_COLORS.W }
        }
    };

    // Ataques de Jefes (Weapons)
    const UT_ATTACKS = {
        'Ninguno': '',
        '🦴 Huesos (Ataque Blanco)': 'attack:bone_white_wave',
        '⚡ Gaster Blaster (Rayo)': 'attack:gaster_blaster_ray',
        '🧊 Ataque Azul (Integridad)': 'attack:blue_attack_freeze',
        '🔥 Ataque Naranja (Valentía)': 'attack:orange_attack_dash',
    };

    // Objetos/Efectos (Items) de Undertale
    const UT_ITEMS = {
        'Ninguno': '',
        '💚 Cura de Fideos (HP Alto)': 'item:instant_noodles_heal',
        '🛡️ Lazo Sucio (Defensa/Paciencia)': 'item:torn_ribbon_def',
        '🍰 Tarta de Caramelo (HP Máximo)': 'item:butterscotch_pie_maxhp',
        '✨ Determinación (Ataque Doble)': 'item:determination_double',
    };

    const POWER_INTENSITY_LABELS = ['LV 1 (Flowey)', 'LV 5 (Papyrus)', 'LV 10 (Undyne)', 'LV 15 (Mettaton)', 'LV 20 (Sans/Final Boss)'];

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
     * Dibuja pixel art detallado (simulando sprites de Undertale).
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
                const color = colors[char] || UT_COLORS[char];

                if (color && char !== ' ') {
                    const pX1 = startX + col * pixelSize;
                    const pY1 = startY + row * pixelSize;
                    const pX2 = pX1 + pixelSize;
                    const pY2 = pY1 + pixelSize;

                    // Relleno del pixel
                    for (let i = 0; i < pixelSize; i += 2) {
                        sendAndDrawCommand(pX1, pY1 + i, pX2, pY1 + i, color, 2);
                    }
                    // Borde negro
                    sendAndDrawCommand(pX1, pY1, pX2, pY1, UT_COLORS.K, 1);
                }
            }
        }
    }


    /* ----------------------------------------------------------------------------------
    //  FUNCIONES DE ATAQUES (BOSS MOVES) UNDERTALE
    // ---------------------------------------------------------------------------------- */

    // 1. Huesos (Ataque Blanco/Normal)
    async function boneWhiteWave(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const endY = target.y;
        const thickness = 5 + intensity * 2;
        const boneColor = UT_COLORS.W;
        const waveCount = 5 + intensity * 2;

        for (let i = 0; i < waveCount; i++) {
            if (stopSignal) break;

            // Dibuja una línea de Huesos que atraviesa la pantalla horizontalmente
            const startX = (i % 2 === 0) ? 0 : canvas.width;
            const endX = (i % 2 === 0) ? canvas.width : 0;
            const waveY = endY + (Math.random() - 0.5) * 50;

            let currentX = startX;
            for (let j = 0; j < 10; j++) {
                const nextX = startX + (endX - startX) * (j / 9);
                // Dibuja la línea que forma el "hueso"
                sendAndDrawCommand(currentX, waveY, nextX, waveY, boneColor, thickness);
                currentX = nextX;
            }

            // Dibuja un Hueso Pixel Art en un punto de la trayectoria
            drawPixelArt(startX + (endX - startX) * 0.5, waveY, UT_PIXEL_ASSETS.BONE_ATTACK, 0.8 + intensity * 0.1);

            await new Promise(r => setTimeout(r, 150 - intensity * 15));
        }
    }

    // 2. Gaster Blaster (Rayo/Plasma)
    async function gasterBlasterRay(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const endX = target.x;
        const endY = target.y;
        const startX = canvas.width * 0.5;
        const startY = canvas.height * 0.1;
        const rayColor = UT_COLORS.C; // Cyan (Efecto Blaster)
        const thickness = 10 + intensity * 5;

        // 1. Carga (Gaster Blaster aparece)
        drawPixelArt(startX, startY, UT_PIXEL_ASSETS.GASTER_BLASTER, 2);
        await new Promise(r => setTimeout(r, 400 - intensity * 50));

        // 2. Disparo del Rayo
        for (let i = 0; i < 8; i++) {
            if (stopSignal) break;
            const progress = i / 7;
            const currentX = startX + (endX - startX) * progress;
            const currentY = startY + (endY - startY) * progress;
            const color = (i % 2 === 0) ? rayColor : UT_COLORS.W;

            // Dibujo del rayo grueso
            sendAndDrawCommand(currentX, currentY, currentX, currentY, color, thickness);

            await new Promise(r => setTimeout(r, 30));
        }

        // 3. Impacto (Explosión Cyan)
        sendAndDrawCommand(endX, endY, endX, endY, rayColor, 40);
    }

    // 3. Ataque Azul (Integridad: No te muevas)
    async function blueAttackFreeze(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const duration = 2000;
        const startTime = Date.now();
        const blueColor = UT_COLORS.B;
        const thickness = 5 + intensity * 2;

        // Efecto de "congelamiento" o peso (Integridad)
        while (Date.now() - startTime < duration) {
            if (stopSignal) break;
            const elapsed = Date.now() - startTime;
            const count = 5 + intensity;

            // Rayos azules que caen sobre el objetivo, si se mueve, "golpea"
            for (let i = 0; i < count; i++) {
                const x = target.x + (Math.random() - 0.5) * 50;
                const startY = target.y - 50;
                const endY = target.y + 50;
                const currentY = startY + (endY - startY) * (elapsed / duration); // Movimiento descendente
                const color = (elapsed % 200 < 100) ? blueColor : UT_COLORS.W; // Parpadeo
                sendAndDrawCommand(x, startY, x, endY, color, thickness);
            }
            await new Promise(r => setTimeout(r, 80));
        }
    }

    // 4. Ataque Naranja (Valentía: Muévete)
    async function orangeAttackDash(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const duration = 1500;
        const startTime = Date.now();
        const orangeColor = UT_COLORS.O;
        const thickness = 5 + intensity * 3;

        // Efecto de velocidad (si te mueves, pasas, si te quedas quieto, golpea)
        while (Date.now() - startTime < duration) {
            if (stopSignal) break;
            const elapsed = Date.now() - startTime;
            const count = 10 + intensity * 5;

            // Círculos concéntricos naranjas rápidos
            for (let i = 0; i < count; i++) {
                const r = 50 * (elapsed / duration) + Math.random() * 10;
                const angle = Math.random() * Math.PI * 2;
                const x = target.x + r * Math.cos(angle);
                const y = target.y + r * Math.sin(angle);
                sendAndDrawCommand(target.x, target.y, x, y, orangeColor, thickness);
            }
            await new Promise(r => setTimeout(r, 50));
        }
    }

    /* ----------------------------------------------------------------------------------
    //  FUNCIONES DE OBJETOS/EFECTOS (ITEMS) UNDERTALE
    // ---------------------------------------------------------------------------------- */

    // 5. Cura de Fideos (Curación Instantánea)
    async function instantNoodlesHeal(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const duration = 1500;
        const startTime = Date.now();
        const healColor = UT_COLORS.G; // Verde (Amabilidad / Curación)

        // Dibuja el Corazón (ALMA) sobre el objetivo
        drawPixelArt(target.x, target.y - 30, UT_PIXEL_ASSETS.SOUL_HEART, 1.5);
        await new Promise(r => setTimeout(r, 200));

        // Partículas verdes de HP que ascienden
        while (Date.now() - startTime < duration) {
            if (stopSignal) break;
            const count = 8 + intensity * 2;

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

    // 6. Lazo Sucio (Defensa/Paciencia)
    async function tornRibbonDef(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const duration = 3000;
        const startTime = Date.now();
        const defColor = UT_COLORS.P; // Púrpura (Paciencia / Defensa)

        while (Date.now() - startTime < duration) {
            if (stopSignal) break;
            const elapsed = Date.now() - startTime;
            const radius = 40;
            const pulse = Math.sin(elapsed * 0.025) * 8; // Pulso

            // Dibuja un campo de energía púrpura
            for (let i = 0; i < 8 + intensity; i++) {
                const angle = (i / 8) * 2 * Math.PI;
                const dist = radius + pulse;
                const x = target.x + dist * Math.cos(angle);
                const y = target.y + dist * Math.sin(angle);
                const color = (elapsed % 300 < 150) ? defColor : UT_COLORS.F; // Parpadeo gris
                sendAndDrawCommand(target.x, target.y, x, y, color, 3);
            }

            await new Promise(r => setTimeout(r, 80));
        }
    }

    // 7. Tarta de Caramelo (HP Máximo)
    async function butterscotchPieMaxhp(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const duration = 2500;
        const startTime = Date.now();
        const maxHPColor = UT_COLORS.R;

        // Dibuja un gran círculo de curación que pulsa
        while (Date.now() - startTime < duration) {
            if (stopSignal) break;
            const elapsed = Date.now() - startTime;
            const radius = 20 + Math.sin(elapsed * 0.01) * 10;
            const count = 10;

            for (let i = 0; i < count; i++) {
                const angle = (i / count) * 2 * Math.PI;
                const x = target.x + radius * Math.cos(angle);
                const y = target.y + radius * Math.sin(angle);
                sendAndDrawCommand(target.x, target.y, x, y, maxHPColor, 5);
            }

            // Dibuja el ALMA roja pulsando
            drawPixelArt(target.x, target.y, UT_PIXEL_ASSETS.SOUL_HEART, 1 + intensity * 0.1);

            await new Promise(r => setTimeout(r, 100));
        }
    }

    // 8. Determinación (Ataque Doble)
    async function determinationDouble(playerId, intensity = 3) {
        if (stopSignal) return;
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const duration = 500;
        const startTime = Date.now();
        const detColor = UT_COLORS.R; // Rojo (Determinación)

        while (Date.now() - startTime < duration) {
            if (stopSignal) break;
            const count = 5 + intensity * 2;

            // Rayos rojos que emanan del objetivo (aura de determinación)
            for (let i = 0; i < count; i++) {
                const r = 50 + Math.random() * 20;
                const angle = Math.random() * Math.PI * 2;
                const x = target.x + r * Math.cos(angle);
                const y = target.y + r * Math.sin(angle);
                sendAndDrawCommand(target.x, target.y, x, y, detColor, 3);
            }

            // Muestra el Corazón (ALMA) parpadeando
            drawPixelArt(target.x, target.y, UT_PIXEL_ASSETS.SOUL_HEART, 1);

            await new Promise(r => setTimeout(r, 50));
        }
    }


    /* ----------------------------------------------------------------------------------
    //  INTERFAZ DE USUARIO Y GESTIÓN DE EVENTOS
    // ---------------------------------------------------------------------------------- */

    const utContainer = document.createElement('div');
    utContainer.id = 'UndertaleCompanionUI';
    utContainer.style.cssText = `
        position:fixed; bottom:10px; right:10px; z-index:9999;
        background:rgba(0, 0, 0, 0.95); /* Negro (Fondo de Batalla) */
        color:#FFFFFF; padding:15px 20px; border-radius:10px;
        font-family: 'Press Start 2P', 'Consolas', monospace; font-size:12px;
        display:flex; flex-direction:column; gap:10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.9), 0 0 15px rgba(255, 0, 0, 0.6);
        border: 3px solid #FF0000; /* Rojo ALMA */
        min-width: 250px;
        backdrop-filter: blur(5px);
    `;

    const titleBar = document.createElement('div');
    titleBar.innerHTML = '💙 FRISK\'S COMPANION MOD ⚔️';
    titleBar.style.cssText = `
        font-weight: bold; font-size: 14px; text-align: center; cursor: grab;
        color: #FFFFFF;
        background: rgba(128, 128, 128, 0.7); /* Gris caja de batalla */
        text-shadow: 0 0 5px #FF0000;
        margin: -15px -20px 8px -20px; padding: 10px 20px;
        border-bottom: 2px solid #FF0000;
        border-radius: 7px 7px 0 0;
    `;
    utContainer.appendChild(titleBar);

    const contentDiv = document.createElement('div');
    contentDiv.style.cssText = `display:flex; flex-direction:column; gap:8px;`;
    utContainer.appendChild(contentDiv);

    const utInputStyle = `
        flex-grow: 1; padding: 6px 10px; border-radius: 5px;
        border: 2px solid #FF0000; background: rgba(0, 0, 0, 0.7);
        color: #FFFFFF; font-size: 11px; font-family: monospace;
        transition: all 0.2s ease;
    `;

    function createUtRow(parent, labelText, inputElement) {
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
    enemySelect.style.cssText = utInputStyle;
    createUtRow(contentDiv, '👤 Objetivo:', enemySelect);

    // Selector de Ataques
    const attackSelect = document.createElement('select');
    attackSelect.style.cssText = utInputStyle;
    for (const name in UT_ATTACKS) {
        const opt = document.createElement('option');
        opt.value = UT_ATTACKS[name];
        opt.textContent = name;
        attackSelect.appendChild(opt);
    }
    attackSelect.value = UT_ATTACKS['Ninguno'];
    createUtRow(contentDiv, '⚔️ ATAQUE:', attackSelect);

    // Selector de Objetos/Efectos
    const itemSelect = document.createElement('select');
    itemSelect.style.cssText = utInputStyle;
    for (const name in UT_ITEMS) {
        const opt = document.createElement('option');
        opt.value = UT_ITEMS[name];
        opt.textContent = name;
        itemSelect.appendChild(opt);
    }
    itemSelect.value = UT_ITEMS['Ninguno'];
    createUtRow(contentDiv, '🍔 OBJETO/HP:', itemSelect);

    // Auto-reset de selectores (solo uno a la vez)
    attackSelect.addEventListener('change', () => {
        if (attackSelect.value !== '') itemSelect.value = UT_ITEMS['Ninguno'];
    });

    itemSelect.addEventListener('change', () => {
        if (itemSelect.value !== '') attackSelect.value = UT_ATTACKS['Ninguno'];
    });

    // Medidor de Nivel (Intensity)
    const powerInput = document.createElement('input');
    powerInput.type = 'range';
    powerInput.min = '1';
    powerInput.max = '5';
    powerInput.value = '3';
    powerInput.style.cssText = `flex-grow: 1; accent-color: ${UT_COLORS.R};`;
    createUtRow(contentDiv, '📈 LV:', powerInput);

    const powerLabel = document.createElement('span');
    powerLabel.style.cssText = `color: ${UT_COLORS.Y}; font-size: 10px; text-align: center; margin-top: -5px;`;
    powerLabel.textContent = `Nivel: ${POWER_INTENSITY_LABELS[powerInput.value - 1]}`;
    contentDiv.appendChild(powerLabel);
    powerInput.addEventListener('input', () => {
        powerLabel.textContent = `Nivel: ${POWER_INTENSITY_LABELS[powerInput.value - 1]}`;
    });

    // Toggle de Repetición ("Ataque Infinito")
    const repeatToggle = document.createElement('input');
    repeatToggle.type = 'checkbox';
    repeatToggle.style.cssText = `transform: scale(1.2); accent-color: ${UT_COLORS.R};`;
    const repeatLabel = document.createElement('label');
    repeatLabel.textContent = ' 🔄 Batalla Infinita (Sin Perdón)';
    repeatLabel.style.cssText = `color: ${UT_COLORS.R}; font-weight: bold; cursor: pointer;`;
    const repeatWrapper = document.createElement('div');
    repeatWrapper.style.cssText = `display:flex; align-items:center; gap:8px; justify-content: center;`;
    repeatWrapper.appendChild(repeatToggle);
    repeatWrapper.appendChild(repeatLabel);
    contentDiv.appendChild(repeatWrapper);

    // Botón de Activación
    const activateBtn = document.createElement('button');
    activateBtn.textContent = 'ACT (Usar Objeto) / FIGHT (Atacar)';
    activateBtn.disabled = true;
    activateBtn.style.cssText = `
        padding: 10px 15px; border-radius: 8px; border: none;
        background: linear-gradient(45deg, ${UT_COLORS.R}, ${UT_COLORS.K});
        color: ${UT_COLORS.W}; font-weight: bold; font-size: 14px;
        cursor: pointer; transition: all 0.2s ease;
        box-shadow: 0 3px 10px rgba(255, 0, 0, 0.5);
        font-family: 'Monospace', monospace;
        &:hover { background: linear-gradient(45deg, ${UT_COLORS.K}, ${UT_COLORS.R}); transform: translateY(-1px); }
        &:disabled { background: #666; cursor: not-allowed; opacity: 0.5; transform: none; }
    `;
    contentDiv.appendChild(activateBtn);

    // Botón de Parada
    stopBtn = document.createElement('button');
    stopBtn.textContent = 'MERCY (Perdonar / Detener)';
    stopBtn.disabled = true;
    stopBtn.style.cssText = `
        margin-top: 5px; padding: 8px 12px; border-radius: 6px; border: none;
        background: linear-gradient(45deg, ${UT_COLORS.G}, ${UT_COLORS.K});
        color: white; font-weight: bold; font-size: 12px;
        cursor: pointer; transition: all 0.2s ease;
        box-shadow: 0 2px 8px rgba(0, 128, 0, 0.5);
        font-family: 'Monospace', monospace;
        &:hover { background: linear-gradient(45deg, ${UT_COLORS.K}, ${UT_COLORS.G}); transform: translateY(-1px); }
        &:disabled { background: #666; cursor: not-allowed; opacity: 0.5; transform: none; }
    `;
    contentDiv.appendChild(stopBtn);

    document.body.appendChild(utContainer);

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
        enemySelect.textContent = '💙 Tú (Frisk)';

        playerRows.forEach(row => {
            if (row.dataset.self === 'true') return;
            if (row.dataset.playerid === '0') return;
            const name = row.querySelector('.playerlist-name a')?.textContent || `Enemy ${row.dataset.playerid}`;
            const opt = document.createElement('option');
            opt.value = row.dataset.playerid;
            // Asigna nombres de jefes icónicos
            const utName = name.includes('Police') ? '🦴 Sans' : '👑 Asgore';
            opt.textContent = `🎯 ${utName} (${name})`;
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
        dragOffsetX = e.clientX - utContainer.getBoundingClientRect().left;
        dragOffsetY = e.clientY - utContainer.getBoundingClientRect().top;
        titleBar.style.cursor = 'grabbing';
    });
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        let newX = e.clientX - dragOffsetX;
        let newY = e.clientY - dragOffsetY;
        newX = Math.max(0, Math.min(newX, window.innerWidth - utContainer.offsetWidth));
        newY = Math.max(0, Math.min(newY, window.innerHeight - utContainer.offsetHeight));
        utContainer.style.left = newX + 'px';
        utContainer.style.top = newY + 'px';
        utContainer.style.right = 'auto';
        utContainer.style.bottom = 'auto';
    });
    document.addEventListener('mouseup', () => {
        isDragging = false;
        titleBar.style.cursor = 'grab';
    });

    // Botón de parada (MERCY)
    stopBtn.addEventListener('click', () => {
        console.log('💚 MERCY: Has perdonado al objetivo. La batalla ha terminado.');
        stopSignal = true;

        if (activePowerInterval) {
            clearInterval(activePowerInterval);
            activePowerInterval = null;
        }

        activateBtn.textContent = 'ACT (Usar Objeto) / FIGHT (Atacar)';
        activateBtn.style.background = `linear-gradient(45deg, ${UT_COLORS.R}, ${UT_COLORS.K})`;
        activateBtn.disabled = false;
        stopBtn.disabled = true;
    });

    // Botón principal de activación (FIGHT/ACT)
    activateBtn.addEventListener('click', async () => {
        const playerId = enemySelect.value;
        if (!playerId) {
            alert('🎯 ¡Escoge un Monstruo para la Batalla!');
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
            // Modo FIGHT
            switch (selectedAttack) {
                case 'attack:bone_white_wave': actionToExecute = () => boneWhiteWave(playerId, intensity); actionName = 'Huesos Blancos'; break;
                case 'attack:gaster_blaster_ray': actionToExecute = () => gasterBlasterRay(playerId, intensity); actionName = 'Gaster Blaster'; break;
                case 'attack:blue_attack_freeze': actionToExecute = () => blueAttackFreeze(playerId, intensity); actionName = 'Ataque Azul'; break;
                case 'attack:orange_attack_dash': actionToExecute = () => orangeAttackDash(playerId, intensity); actionName = 'Ataque Naranja'; break;
                default: return;
            }
        } else if (selectedItem && selectedItem.startsWith('item:')) {
            // Modo ACT/ITEM
            switch (selectedItem) {
                case 'item:instant_noodles_heal': actionToExecute = () => instantNoodlesHeal(playerId, intensity); actionName = 'Cura de Fideos'; break;
                case 'item:torn_ribbon_def': actionToExecute = () => tornRibbonDef(playerId, intensity); actionName = 'Lazo Sucio (DEF)'; break;
                case 'item:butterscotch_pie_maxhp': actionToExecute = () => butterscotchPieMaxhp(playerId, intensity); actionName = 'Tarta de Caramelo (MAX HP)'; break;
                case 'item:determination_double': actionToExecute = () => determinationDouble(playerId, intensity); actionName = 'Determinación'; break;
                default: return;
            }
        } else {
            alert('🔺 ¡Debes seleccionar un Ataque o un Objeto/HP!');
            return;
        }

        stopSignal = false;
        activateBtn.disabled = true;
        stopBtn.disabled = false;

        try {
            if (repeatToggle.checked) {
                activateBtn.textContent = `🔄 DETENER ${selectedAttack ? 'ATAQUE' : 'ACT' } CONTINUO`;
                activateBtn.style.background = `linear-gradient(45deg, ${UT_COLORS.K}, ${UT_COLORS.R})`;
                activateBtn.disabled = false;

                console.log(`🔥 ¡Iniciando Batalla Infinita con ${actionName}!`);

                const continuousAction = async () => {
                    if (stopSignal || !repeatToggle.checked) {
                        if (activePowerInterval) clearInterval(activePowerInterval);
                        activePowerInterval = null;
                        activateBtn.textContent = 'ACT (Usar Objeto) / FIGHT (Atacar)';
                        activateBtn.style.background = `linear-gradient(45deg, ${UT_COLORS.R}, ${UT_COLORS.K})`;
                        stopBtn.disabled = true;
                        return;
                    }

                    try {
                        await actionToExecute();
                    } catch (error) {
                        console.error(`Error durante la Batalla Infinita (${actionName}):`, error);
                    }
                };

                await continuousAction();
                if (!stopSignal) {
                    activePowerInterval = setInterval(continuousAction, 2000);
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
        console.log('¡GRACIAS POR JUGAR! Ahora sal de Drawaria y sé bueno. -Undertale.');
    });

    // Inicialización
    refreshPlayerList();
    console.log('✨ Frisk\'s Companion Mod cargado. ¡Prepárate para la batalla! ✨');

})();