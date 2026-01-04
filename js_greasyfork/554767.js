// ==UserScript==
// @name         Drawaria Cold Ice Menu ❄️☃️
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  A reflective drama script. Transforms the game atmosphere into a melancholic, snowy city on Dec 31st. Weapon/Effect buttons now trigger Emotional Contrast Filters.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @match        https://*.drawaria.online/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license      MIT
// @icon https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/554767/Drawaria%20Cold%20Ice%20Menu%20%E2%9D%84%EF%B8%8F%E2%98%83%EF%B8%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/554767/Drawaria%20Cold%20Ice%20Menu%20%E2%9D%84%EF%B8%8F%E2%98%83%EF%B8%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ----------  EFECTOS REFLEXIVOS / CONTRASTES  ---------- */

    const REFLECTIVE_CONTRASTS = {
        'Ninguno': '',
        '❄️ Soledad del Invierno': 'effect:solitude_ice',
        '☕ Calor Interior': 'effect:inner_warmth',
        '🌫️ Niebla de la Memoria': 'effect:memory_fog',
        '⏳ Final de Ciclo': 'effect:end_cycle_vignette',
        '🌌 Conexión Humana': 'effect:human_connection',
        '💡 El Propósito (Raro)': 'effect:rare_purpose',
    };

    // Usaremos los mismos nombres de armas, pero su lógica será reflejar drama.
    const DRAMA_WEAPONS = {
        'Ninguno': '',
        '💔 Corazón Roto': 'drama:broken_heart',
        '⏳ Pasaje del Tiempo': 'drama:time_passage',
        '🏙️ Ciudad Despierta': 'drama:city_wakes',
        '💤 Sueño Profundo': 'drama:deep_sleep',
    };

    /* ----------  SETUP BÁSICO  ---------- */
    let socket;
    const canvas = document.getElementById('canvas');
    const ctx = canvas ? canvas.getContext('2d') : null;
    let stopSignal = false;
    let stopBtn;
    let activeEffectInterval = null;
    let isExecuting = false;

    // Almacena el filtro original del cuerpo para poder alternar.
    let originalBodyFilter = document.body.style.filter;

    const originalSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (...args) {
        if (!socket) socket = this;
        return originalSend.apply(this, args);
    };

    // --- AMBIENTACIÓN MELANCÓLICA DE INVIERNO (NUEVO FONDO) ---
    GM_addStyle(`
        body {
            /* Nuevo Fondo de Noche Estrellada Melancólica */
            background-image: url('https://media.springernature.com/full/springer-static/image/art%3A10.1038%2F494027a/MediaObjects/41586_2013_BF494027a_Figa_HTML.jpg') !important;
            background-size: cover !important;
            background-attachment: fixed !important;
            background-color: #1a1a1a !important;
            /* Filtro Melancólico: Saturación baja, contraste suave, tono frío */
            filter: grayscale(30%) contrast(105%) hue-rotate(200deg) brightness(85%);
        }

        /* Ajustar el contenedor para ver el fondo */
        .wrapper {
            background-color: rgba(255, 255, 255, 0.9) !important;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.5) !important;
        }

        /* Ajuste de colores del canvas para no ser demasiado vibrante */
        #game-canvas {
            filter: saturate(80%) contrast(100%);
        }
    `);


    /* ----------  INTERFAZ DE USUARIO (Menú de Contraste Emocional) ---------- */
    const container = document.createElement('div');
    container.style.cssText = `
        position:fixed; bottom:10px; right:10px; z-index:9999;
        /* Estilo de la Base del Menú (Inspirado en Solar Smash pero más suave) */
        background:linear-gradient(135deg, #2e1a1a, #21163e, #0f3460); /* Tonos más tierra/noche */
        color:#fff; padding:15px 20px; border-radius:15px;
        font-family: 'Segoe UI', Arial, sans-serif; font-size:13px;
        display:flex; flex-direction:column; gap:12px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1);
        border: 2px solid #b0c4de; /* Azul frío/Acero */
        min-width: 320px;
        backdrop-filter: blur(5px);
        cursor: default;
    `;

    // Título Melancólico
    const titleBar = document.createElement('div');
    titleBar.innerHTML = 'Drawaria Cold Ice Menu ❄️☃️';
    titleBar.style.cssText = `
        font-weight: bold; font-size: 16px; text-align: center; cursor: grab;
        background: linear-gradient(45deg, #a0522d, #deb887); /* Tonos de café y marrón */
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        text-shadow: 0 0 10px rgba(160, 82, 45, 0.5);
        margin: -15px -20px 10px -20px; padding: 15px 20px;
        border-bottom: 2px solid rgba(176, 196, 222, 0.3);
        border-radius: 15px 15px 0 0;
    `;
    container.appendChild(titleBar);

    const contentDiv = document.createElement('div');
    contentDiv.style.cssText = `display:flex; flex-direction:column; gap:12px;`;
    container.appendChild(contentDiv);

    // Estilo de los Selectores de Contraste
    const solarInputStyle = `
        flex-grow: 1; padding: 8px 12px; border-radius: 8px;
        border: 2px solid #b0c4de; background: rgba(0, 20, 40, 0.8);
        color: #b0c4de; font-size: 13px; font-family: 'Segoe UI', monospace;
        transition: all 0.3s ease;
        appearance: none;
        /* Ícono de Flecha suave para el select */
        background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23b0c4de%22%20d%3D%22M287%2C197.3L159.2%2C69.5c-3.6-3.6-8.2-5.4-12.8-5.4s-9.2%2C1.8-12.8%2C5.4L5.4%2C197.3c-7.2%2C7.2-7.2%2C18.8%2C0%2C26c3.6%2C3.6%2C8.2%2C5.4%2C12.8%2C5.4s9.2%2C1.8%2C12.8%2C5.4l117%2C117c3.6%2C3.6%2C8.2%2C5.4%2C12.8%2C5.4s9.2%2C1.8%2C12.8%2C5.4l117-117c7.2-7.2%2C7.2-18.8%2C0-26C294.2%2C204.5%2C294.2%2C200.9%2C287%2C197.3z%22%2F%3E%3C%2Fsvg%3E');
        background-repeat: no-repeat;
        background-position: right 8px center;
        background-size: 12px;
        cursor: pointer;
    `;

    function createSolarRow(parent, labelText, inputElement) {
        const wrapper = document.createElement('div');
        wrapper.style.cssText = `display:flex; align-items:center; gap:12px;`;
        const label = document.createElement('span');
        label.textContent = labelText;
        label.style.cssText = `color: #b0c4de; font-weight: bold; min-width: 90px;`;
        wrapper.appendChild(label);
        wrapper.appendChild(inputElement);
        parent.appendChild(wrapper);
        return { wrapper, label, inputElement };
    }

    // **NOTA: El selector de jugadores se mantiene pero su propósito es simbólico (el 'Target' de la reflexión)**
    const playerSelect = document.createElement('select');
    playerSelect.style.cssText = solarInputStyle;
    // La función de actualización de jugadores se ejecuta más abajo.
    createSolarRow(contentDiv, '👤 Persona:', playerSelect);

    // Selector de Dramas
    const weaponSelect = document.createElement('select');
    weaponSelect.style.cssText = solarInputStyle;
    for (const name in DRAMA_WEAPONS) {
        const opt = document.createElement('option');
        opt.value = DRAMA_WEAPONS[name];
        opt.textContent = name;
        weaponSelect.appendChild(opt);
    }
    weaponSelect.value = DRAMA_WEAPONS['Ninguno'];
   // createSolarRow(contentDiv, '💔 Drama:', weaponSelect);

    // Selector de Efectos Reflexivos
    const effectSelect = document.createElement('select');
    effectSelect.style.cssText = solarInputStyle;
    for (const name in REFLECTIVE_CONTRASTS) {
        const opt = document.createElement('option');
        opt.value = REFLECTIVE_CONTRASTS[name];
        opt.textContent = name;
        effectSelect.appendChild(opt);
    }
    effectSelect.value = REFLECTIVE_CONTRASTS['Ninguno'];
   // createSolarRow(contentDiv, '✨ Contraste:', effectSelect);

    // Auto-reset de selectores (funcionalidad de exclusividad mutua se mantiene)
    weaponSelect.addEventListener('change', () => {
        if (weaponSelect.value !== '') {
            effectSelect.value = REFLECTIVE_CONTRASTS['Ninguno'];
        }
    });

    effectSelect.addEventListener('change', () => {
        if (effectSelect.value !== '') {
            weaponSelect.value = DRAMA_WEAPONS['Ninguno'];
        }
    });

    // Intensity slider (Ahora "Intensidad Emocional")
    const intensitySlider = document.createElement('input');
    intensitySlider.type = 'range';
    intensitySlider.min = '1';
    intensitySlider.max = '5';
    intensitySlider.value = '3';
    intensitySlider.style.cssText = `
        flex-grow: 1; -webkit-appearance: none; height: 6px; border-radius: 5px;
        background: linear-gradient(to right, #b0c4de 0%, #a0522d 100%); /* Azul Frío a Café Cálido */
        outline: none;
    `;
    createSolarRow(contentDiv, '🎭 Emoción:', intensitySlider);

    // Repeat toggle (Ahora "Ciclo Continuo")
    const repeatToggle = document.createElement('input');
    repeatToggle.type = 'checkbox';
    repeatToggle.id = 'solarRepeatToggle';
    repeatToggle.style.cssText = `margin-right: 8px; cursor: pointer; transform: scale(1.3);`;
    const repeatLabel = document.createElement('label');
    repeatLabel.htmlFor = 'solarRepeatToggle';
    repeatLabel.textContent = ' 🔄 Ciclo Continuo';
    repeatLabel.style.cssText = `display: flex; align-items: center; cursor: pointer; color: #b0c4de;`;
    const repeatWrapper = document.createElement('div');
    repeatWrapper.style.cssText = `display:flex; align-items:center; gap:0;`;
    repeatWrapper.appendChild(repeatToggle);
    repeatWrapper.appendChild(repeatLabel);
    contentDiv.appendChild(repeatWrapper);

    // Botones
    const executeBtn = document.createElement('button');
    executeBtn.textContent = '';
    executeBtn.disabled = true;
    executeBtn.style.cssText = `
        padding: 12px 20px; border-radius: 10px; border: none;
        background: linear-gradient(145deg, #a0522d, #deb887); /* Café Cálido */
        color: white; font-weight: bold; font-size: 15px;
        cursor: pointer; transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(160, 82, 45, 0.4);
        text-transform: uppercase; letter-spacing: 1px;
    `;

    stopBtn = document.createElement('button');
    stopBtn.textContent = '';
    stopBtn.disabled = true;
    stopBtn.style.cssText = `
        margin-top: 8px; padding: 10px 18px; border-radius: 8px; border: none;
        background: linear-gradient(145deg, #444444, #666666); /* Gris Neutro */
        color: white; font-weight: bold; font-size: 14px;
        cursor: pointer; transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(68, 68, 68, 0.4);
        text-transform: uppercase;
    `;

    contentDiv.appendChild(executeBtn);
    contentDiv.appendChild(stopBtn);
    document.body.appendChild(container);

    /* ----------  FUNCIONES REFLEXIVAS (REEMPLAZANDO ARMAS/EFECTOS) ---------- */

    function getPlayerCoords(playerId) {
        const avatar = document.querySelector(`.spawnedavatar[data-playerid="${playerId}"]`);
        if (!avatar) return null;
        const cRect = canvas.getBoundingClientRect();
        const aRect = avatar.getBoundingClientRect();
        return {
            x: Math.round((aRect.left - cRect.left) + (aRect.width / 2)),
            y: Math.round((aRect.top - cRect.top) + (aRect.height / 2)),
            width: aRect.width,
            height: aRect.height
        };
    }

    // Adaptación de la función de dibujo para enviar al socket (manteniendo la funcionalidad)
    function drawReflectiveCommand(x1, y1, x2, y2, color, thickness) {
        x1 = Math.round(x1); y1 = Math.round(y1);
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

        if (!socket) return;
        const normX1 = (x1 / canvas.width).toFixed(4);
        const normY1 = (y1 / canvas.height).toFixed(4);
        const normX2 = (x2 / canvas.width).toFixed(4);
        const normY2 = (y2 / canvas.height).toFixed(4);
        // Usar la estructura de comando de Drawaria (asumiendo que es para dibujar líneas)
        const cmd = `42["drawcmd",0,[${normX1},${normY1},${normX2},${normY2},false,${0 - thickness},"${color}",0,0,{}]]`;
        // socket.send(cmd); // Comentado para evitar spam, descomentar si se desea que el dibujo se envíe
    }


    /* --- CONTRASTES (EFECTOS) --- */

    // ❄️ Soledad del Invierno (Filtro frío y temporal en el lienzo)
    async function solitudeIce(playerId, intensity = 3) {
        if (stopSignal) return;
        sendMessageToChat(`❄️ Se siente la Soledad del Invierno en el lienzo...`);
        const duration = 2000 + intensity * 500;

        // Efecto: Filtro de frío en el lienzo
        if (canvas) {
            canvas.style.transition = 'filter 1s ease-in-out';
            canvas.style.filter = 'grayscale(100%) contrast(150%) hue-rotate(180deg)';
        }

        await new Promise(r => setTimeout(r, duration));

        if (canvas) {
            canvas.style.filter = 'saturate(80%) contrast(100%)'; // Volver al filtro base
        }
    }

    // ☕ Calor Interior (Dibujo de humo de taza de café alrededor del objetivo)
    async function innerWarmth(playerId, intensity = 3) {
        if (stopSignal) return;
        sendMessageToChat(`☕ Un momento de Calor Interior rodea a la persona elegida...`);
        const target = getPlayerCoords(playerId);
        if (!target) return;

        const puffCount = 8 + intensity * 4;
        const colors = ['#f5f5dc', '#d2b48c', '#a0522d']; // Beige, Canela, Marrón Café

        for (let i = 0; i < puffCount; i++) {
            if (stopSignal) break;

            // Simulación de una espiral de humo
            const smokeX = target.x + Math.sin(i * 0.5) * (10 + i * 2);
            const smokeY = target.y - 40 - i * 5;
            const color = colors[i % colors.length];

            // Dibujar el "humo" como líneas difusas
            for (let j = 0; j < 4; j++) {
                const startX = smokeX + (Math.random() - 0.5) * 5;
                const startY = smokeY + (Math.random() - 0.5) * 5;
                const endX = startX + (Math.random() - 0.5) * 15;
                const endY = startY - 10;
                drawReflectiveCommand(startX, startY, endX, endY, color, 3);
            }

            await new Promise(r => setTimeout(r, 150));
        }
    }

    // 🌫️ Niebla de la Memoria (Filtro Blur temporal en toda la interfaz)
    async function memoryFog(playerId, intensity = 3) {
        if (stopSignal) return;
        sendMessageToChat(`🌫️ Una Niebla de la Memoria envuelve el mundo...`);
        const duration = 3000 + intensity * 1000;

        // Efecto: Filtro Blur en todo el cuerpo del documento
        document.body.style.transition = 'filter 2s ease-in-out';
        document.body.style.filter = 'blur(5px)';

        await new Promise(r => setTimeout(r, duration));

        document.body.style.filter = 'none';
        // Volver al filtro de ambiente (ya aplicado por GM_addStyle al inicio)
        document.body.style.filter = 'grayscale(30%) contrast(105%) hue-rotate(200deg) brightness(85%)';
    }

    // ⏳ Final de Ciclo (Vignette Oscuro y Desvanecimiento)
    async function endCycleVignette(playerId, intensity = 3) {
        if (stopSignal) return;
        sendMessageToChat(`⏳ El Final del Ciclo se acerca. El tiempo se desvanece...`);
        const duration = 2000 + intensity * 500;

        // Efecto: Vignetado oscuro y desvanecimiento
        document.body.style.transition = 'box-shadow 1s, opacity 1s';
        document.body.style.boxShadow = 'inset 0 0 100px rgba(0,0,0,0.9)';
        document.body.style.opacity = '0.5';

        await new Promise(r => setTimeout(r, duration));

        document.body.style.boxShadow = 'none';
        document.body.style.opacity = '1.0';
    }

    // 🌌 Conexión Humana (Líneas que conectan al objetivo con otros jugadores)
    async function humanConnection(playerId, intensity = 3) {
        if (stopSignal) return;
        sendMessageToChat(`🌌 El tejido de la Conexión Humana se revela...`);

        const target = getPlayerCoords(playerId);
        if (!target) return;

        const playerElements = document.querySelectorAll('.spawnedavatar[data-playerid]');
        const connectionDuration = 1000 + intensity * 300;
        const color = '#ffbfff'; // Rosa claro (Tono de conexión)

        playerElements.forEach(el => {
            const connectedPlayerId = el.dataset.playerid;
            if (connectedPlayerId !== playerId) {
                const otherCoords = getPlayerCoords(connectedPlayerId);
                if (otherCoords) {
                    // Dibujar una línea de conexión
                    drawReflectiveCommand(target.x, target.y, otherCoords.x, otherCoords.y, color, 2);

                    // Efecto de pulso en el punto de conexión
                    for(let p = 0; p < 3; p++) {
                        const radius = 5 + p * 2;
                        for(let s = 0; s < 8; s++) {
                           drawReflectiveCommand(otherCoords.x, otherCoords.y,
                                                 otherCoords.x + radius * Math.cos(s),
                                                 otherCoords.y + radius * Math.sin(s), color, 1);
                        }
                    }
                }
            }
        });

        await new Promise(r => setTimeout(r, connectionDuration));
        // En este caso, no borramos el dibujo, permitimos que Drawaria lo borre naturalmente.
    }

    // 💡 El Propósito (Raro) - Invertir Colores de Interfaz (Contraste Extremo)
    async function rarePurpose(playerId, intensity = 3) {
        if (stopSignal) return;
        sendMessageToChat(`💡 **¡EL PROPÓSITO HA SIDO REVELADO!** (Contraste Extremo)`);
        const duration = 5000;

        // Inversión de colores para un contraste extremo entre la 'realidad' y el 'propósito'
        document.body.style.transition = 'filter 1s ease-in-out';
        document.body.style.filter = 'invert(100%) hue-rotate(180deg)';

        await new Promise(r => setTimeout(r, duration));

        // Volver al filtro de ambiente (y el filtro original del body)
        document.body.style.filter = 'grayscale(30%) contrast(105%) hue-rotate(200deg) brightness(85%)';
    }


    /* --- DRAMAS (ARMAS) --- */

    // Las funciones DRAMA no dibujarán, sino que cambiarán la percepción y el chat.

    // 💔 Corazón Roto (Filtro Sepia / Chat Triste)
    async function brokenHeart(playerId, intensity = 3) {
        if (stopSignal) return;
        sendMessageToChat(`💔 El Corazón Roto de la Persona se filtra en el ambiente...`);
        const duration = 4000;

        document.body.style.transition = 'filter 1s ease-in-out';
        document.body.style.filter = 'sepia(100%) saturate(150%)';

        await new Promise(r => setTimeout(r, duration));

        document.body.style.filter = 'grayscale(30%) contrast(105%) hue-rotate(200deg) brightness(85%)';
    }

    // ⏳ Pasaje del Tiempo (Acelerar y Ralentizar el juego)
    async function timePassage(playerId, intensity = 3) {
        if (stopSignal) return;
        sendMessageToChat(`⏳ El Pasaje del Tiempo se distorsiona...`);

        document.body.style.transition = 'all 0.5s ease-in-out';
        document.body.style.transform = 'scale(0.9)'; // Simular ralentización/enfoque

        await new Promise(r => setTimeout(r, 1500));

        document.body.style.transform = 'scale(1.1)'; // Simular aceleración/desenfoque

        await new Promise(r => setTimeout(r, 1500));

        document.body.style.transform = 'scale(1.0)';
    }

    // 🏙️ Ciudad Despierta (Alto Contraste y Brillo)
    async function cityWakes(playerId, intensity = 3) {
        if (stopSignal) return;
        sendMessageToChat(`🏙️ La Ciudad Despierta con un brillo cegador...`);
        const duration = 3000;

        document.body.style.transition = 'filter 1s ease-in-out';
        document.body.style.filter = 'contrast(200%) brightness(150%)';

        await new Promise(r => setTimeout(r, duration));

        document.body.style.filter = 'grayscale(30%) contrast(105%) hue-rotate(200deg) brightness(85%)';
    }

    // 💤 Sueño Profundo (Oscuridad extrema)
    async function deepSleep(playerId, intensity = 3) {
        if (stopSignal) return;
        sendMessageToChat(`💤 La mente se hunde en el Sueño Profundo...`);
        const duration = 2000;

        document.body.style.transition = 'filter 1s ease-in-out';
        document.body.style.filter = 'brightness(10%) grayscale(100%)';

        await new Promise(r => setTimeout(r, duration));

        document.body.style.filter = 'grayscale(30%) contrast(105%) hue-rotate(200deg) brightness(85%)';
    }


    /* ----------  FUNCIONES PRINCIPALES (MANTENIDAS)  ---------- */

    function updatePlayerOptions() {
        const currentSelection = playerSelect.value;
        playerSelect.innerHTML = '';
        const playerElements = document.querySelectorAll('.spawnedavatar[data-playerid], .playerlist-row[data-playerid]');
        const validPlayers = [];

        playerElements.forEach(el => {
            const playerId = el.dataset.playerid;
            if (!playerId || playerId === '0' || el.dataset.self === 'true') return;

            let playerName = '';
            const nicknameEl = el.querySelector('.nickname, .playerlist-name a, .player-name');
            if (nicknameEl) {
                playerName = nicknameEl.textContent.trim();
            } else {
                playerName = `Persona ${playerId}`;
            }

            if (!validPlayers.some(p => p.id === playerId)) {
                validPlayers.push({ id: playerId, name: playerName });
            }
        });

        if (validPlayers.length === 0) {
            const opt = document.createElement('option');
            opt.value = '';
            opt.textContent = '👤 No hay personajes.';
            playerSelect.appendChild(opt);
            executeBtn.disabled = true;
        } else {
            validPlayers.forEach(player => {
                const opt = document.createElement('option');
                opt.value = player.id;
                opt.textContent = `👤 ${player.name}`;
                playerSelect.appendChild(opt);
            });

            const stillExists = validPlayers.some(p => p.id === currentSelection);
            if (currentSelection && stillExists) {
                playerSelect.value = currentSelection;
            } else {
                playerSelect.selectedIndex = 0;
            }

            executeBtn.disabled = false;
        }
    }


    async function executeSolarAction() {
        if (isExecuting) return;

        const playerId = playerSelect.value;
        const weaponType = weaponSelect.value;
        const effectType = effectSelect.value;
        const intensity = parseInt(intensitySlider.value);
        const shouldRepeat = repeatToggle.checked;

        if (!playerId) {
            sendMessageToChat('🚫 Por favor selecciona un personaje (objetivo) válido.');
            return;
        }

        if (!weaponType && !effectType) {
            sendMessageToChat('🚫 Por favor selecciona un Drama o Contraste.');
            return;
        }

        isExecuting = true;
        stopSignal = false;
        executeBtn.disabled = true;
        stopBtn.disabled = false;

        do {
            try {
                if (weaponType) {
                    switch (weaponType) {
                        case 'drama:broken_heart': await brokenHeart(playerId, intensity); break;
                        case 'drama:time_passage': await timePassage(playerId, intensity); break;
                        case 'drama:city_wakes': await cityWakes(playerId, intensity); break;
                        case 'drama:deep_sleep': await deepSleep(playerId, intensity); break;
                    }
                }

                if (effectType) {
                    switch (effectType) {
                        case 'effect:solitude_ice': await solitudeIce(playerId, intensity); break;
                        case 'effect:inner_warmth': await innerWarmth(playerId, intensity); break;
                        case 'effect:memory_fog': await memoryFog(playerId, intensity); break;
                        case 'effect:end_cycle_vignette': await endCycleVignette(playerId, intensity); break;
                        case 'effect:human_connection': await humanConnection(playerId, intensity); break;
                        case 'effect:rare_purpose': await rarePurpose(playerId, intensity); break;
                    }
                }

                if (shouldRepeat && !stopSignal) {
                    await new Promise(r => setTimeout(r, 1000));
                }

            } catch (error) {
                console.error('☕ Error ejecutando Reflexión:', error);
                break;
            }
        } while (shouldRepeat && !stopSignal);

        isExecuting = false;
        executeBtn.disabled = false;
        stopBtn.disabled = true;
        sendMessageToChat('🎬 Secuencia Reflexiva completada.');
    }

    function stopExecution() {
        stopSignal = true;
        isExecuting = false;
        if (activeEffectInterval) {
            clearInterval(activeEffectInterval);
            activeEffectInterval = null;
        }
        executeBtn.disabled = false;
        stopBtn.disabled = true;

        // Limpiar efectos visuales globales
        document.body.style.filter = 'grayscale(30%) contrast(105%) hue-rotate(200deg) brightness(85%)';
        document.body.style.boxShadow = 'none';
        document.body.style.opacity = '1.0';
        document.body.style.transform = 'scale(1.0)';
        if(canvas) canvas.style.filter = 'saturate(80%) contrast(100%)';

        sendMessageToChat('⏸️ Vignette detenida por el usuario.');
    }

    /* ----------  EVENT LISTENERS Y INICIALIZACIÓN  ---------- */

    executeBtn.addEventListener('click', executeSolarAction);
    stopBtn.addEventListener('click', stopExecution);

    // Actualizar jugadores cada 2 segundos
    setInterval(updatePlayerOptions, 2000);
    updatePlayerOptions();

    // Lógica de arrastre
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    titleBar.addEventListener('mousedown', (e) => {
        isDragging = true;
        dragOffsetX = e.clientX - container.offsetLeft;
        dragOffsetY = e.clientY - container.offsetTop;
        titleBar.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            container.style.left = (e.clientX - dragOffsetX) + 'px';
            container.style.top = (e.clientY - dragOffsetY) + 'px';
            container.style.right = 'auto';
            container.style.bottom = 'auto';
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        titleBar.style.cursor = 'grab';
    });

    // Efectos hover para los controles
    [executeBtn, stopBtn, playerSelect, weaponSelect, effectSelect].forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'translateY(-2px)';
            element.style.boxShadow = element.style.boxShadow.replace(/rgba$$[^)]+$$/, 'rgba(176, 196, 222, 0.6)');
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translateY(0)';
            const isExecute = element === executeBtn;
            const shadowColor = isExecute ? 'rgba(160, 82, 45, 0.4)' : 'rgba(68, 68, 68, 0.4)';
            element.style.boxShadow = `0 4px 1${isExecute ? 5 : 2}px ${shadowColor}`;
        });
    });

    sendMessageToChat('☕ **[ÚLTIMO AUTOBÚS]:** El guion de Drama y Reflexión se ha cargado. Escoge un "Contraste" para tu experiencia.');
})();