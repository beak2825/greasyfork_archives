// ==UserScript==
// @name         🎁 DRAWARIA THE FESTIVE MOD MENU 🎁
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Unleash shimmering festive tricks and spectacles to sabotage Drawaria players with true holiday spirit.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @match        https://*.drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554820/%F0%9F%8E%81%20DRAWARIA%20THE%20FESTIVE%20MOD%20MENU%20%F0%9F%8E%81.user.js
// @updateURL https://update.greasyfork.org/scripts/554820/%F0%9F%8E%81%20DRAWARIA%20THE%20FESTIVE%20MOD%20MENU%20%F0%9F%8E%81.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ----------  CONFIGURACIÓN DE JESTS Y SPECTACLES (TRUCOS Y ESPECTÁCULOS)  ---------- */

    // JESTS (Trucos de sabotaje) - One-shot effects targeting the player
    const FESTIVE_JESTS = {
        'Ninguno': '',
        '🎁 Gift Bomb': 'jest:gift_bomb',              // Explosion of wrapping lines
        '🍬 Candy Cane Strike': 'jest:candy_strike',    // Red/White converging lines
        '🎄 Tinsel Glitch': 'jest:tinsel_glitch',      // Chaotic, shiny lines around the player
        '🦌 Reindeer Stampede': 'jest:reindeer_stampede',
        '🌟 Starfall Splatter': 'jest:starfall_splatter',
        '🔔 Bell Ringing Chaos': 'jest:bell_chaos',
        '🍪 Gingerbread Crumble': 'jest:gingerbread_crumble',
        '🕯️ Frozen Flame': 'jest:frozen_flame',
        '🧊 Ice Shard Rain': 'jest:ice_shard_rain',
        '🎀 Ribbon Snare': 'jest:ribbon_snare',
        '🧣 Wool Scarf Entangle': 'jest:scarf_entangle',
        '🎅 Naughty List Mark': 'jest:naughty_mark',
        '☕ Hot Cocoa Spill': 'jest:cocoa_spill',
        '🌨️ Snowball Barrage': 'jest:snowball_barrage',
        '👑 Crown of Gold': 'jest:crown_gold'
    };

    // SPECTACLES (Espectáculos de sabotaje persistente) - Continuous effects for the canvas
    const FESTIVE_SPECTACLES = {
        'Ninguno': '',
        '🌨️ Snowfall Layer': 'spectacle:snowfall_layer', // Continuous whiteout/dimming
        '⭐ Golden Border': 'spectacle:golden_border',  // Shimmering Gold/Green border
        '🌲 Pine Needle Mist': 'spectacle:pine_mist',   // Dims canvas with green
        '✨ Glittering Web': 'spectacle:glitter_web',
        '🔴 Ornament Clutter': 'spectacle:ornament_clutter',
        '🧊 Frost Glaze': 'spectacle:frost_glaze',
        '🎶 Caroling Feedback': 'spectacle:carol_feedback',
        '💡 Fairy Light Flicker': 'spectacle:light_flicker'
    };

    const DEFAULT_JEST_NAME = 'Ninguno';
    const DEFAULT_SPECTACLE_NAME = 'Ninguno';

    /* ----------  SETUP BÁSICO Y SOCKET  ---------- */
    let socket;
    const canvas = document.getElementById('canvas');
    const ctx = canvas ? canvas.getContext('2d') : null;

    let stopSignal = false;
    let stopBtn;
    let activeEffectInterval = null;

    const originalSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (...args) {
        if (!socket) socket = this;
        return originalSend.apply(this, args);
    };

    /* ----------  INTERFAZ DE USUARIO (THE FESTIVE MALICE KETTLE)  ---------- */
    const container = document.createElement('div');
    container.style.cssText = `
        position:fixed; bottom:10px; right:10px; z-index:9999;
        /* Fondo: Degradado de Verde Oscuro a Rojo Oscuro */
        background: radial-gradient(circle at top left, #004d00 0%, #4d0000 100%);
        color:#FFD700; /* Dorado */
        padding:15px 20px; border-radius:15px;
        font-family: 'Arial', sans-serif; font-size:14px;
        display:flex; flex-direction:column; gap:12px;
        /* Sombra: Roja Festiva */
        box-shadow: 0 8px 30px rgba(139,0,0,0.9), inset 0 1px 0 rgba(255,255,200,0.1);
        border: 3px ridge #FFD700; /* Borde Dorado */
        min-width: 320px;
        backdrop-filter: blur(5px);
        transform: rotateZ(-1deg); /* Slight tilt for unsettling festive look */
    `;

    // Custom Font Styling (Using a simple serif for festive feel since custom fonts are heavy)
    const titleBar = document.createElement('div');
    titleBar.innerHTML = '🎁 THE FESTIVE MOD MENU 🎁';
    titleBar.style.cssText = `
        font-weight: bold; font-size: 20px; text-align: center; cursor: grab;
        /* Degradado de Título: Rojo a Verde */
        background: linear-gradient(45deg, #FF0000, #00AA00, #FFD700);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        text-shadow: 0 0 10px rgba(255, 255, 200, 0.7), 0 0 20px rgba(255, 0, 0, 0.5);
        margin: -15px -20px 10px -20px; padding: 15px 20px;
        border-bottom: 2px dashed #00FF00;
        border-radius: 15px 15px 0 0;
        font-family: 'Georgia', serif;
    `;
    container.appendChild(titleBar);

    const contentDiv = document.createElement('div');
    contentDiv.style.cssText = `display:flex; flex-direction:column; gap:12px;`;
    container.appendChild(contentDiv);

    const festiveInputStyle = `
        flex-grow: 1; padding: 10px 15px; border-radius: 5px;
        border: 2px solid #ADFF2F; /* Verde Claro */
        background: rgba(0, 0, 0, 0.7);
        color: #FFFFFF;
        font-size: 14px;
        font-family: 'Arial', monospace;
        transition: all 0.3s ease;
        &:focus { box-shadow: 0 0 15px rgba(255, 215, 0, 0.7); border-color: #FF0000; }
    `;

    function createFestiveRow(parent, labelText, inputElement) {
        const wrapper = document.createElement('div');
        wrapper.style.cssText = `display:flex; align-items:center; gap:12px;`;
        const label = document.createElement('span');
        label.textContent = labelText;
        label.style.cssText = `color: #FFD700; font-weight: bold; min-width: 120px; text-shadow: 1px 1px 2px #000;`;
        wrapper.appendChild(label);
        wrapper.appendChild(inputElement);
        parent.appendChild(wrapper);
        return { wrapper, label, inputElement };
    }

    // Selector de jugadores (Victim)
    const playerSelect = document.createElement('select');
    playerSelect.style.cssText = festiveInputStyle;
    createFestiveRow(contentDiv, '😈 Victim:', playerSelect);

    // Selector de Jests
    const jestSelect = document.createElement('select');
    jestSelect.style.cssText = festiveInputStyle;
    for (const name in FESTIVE_JESTS) {
        const opt = document.createElement('option');
        opt.value = FESTIVE_JESTS[name];
        opt.textContent = name;
        jestSelect.appendChild(opt);
    }
    jestSelect.value = FESTIVE_JESTS[DEFAULT_JEST_NAME];
    createFestiveRow(contentDiv, '🤡 Jest (Trick):', jestSelect);

    // Selector de Spectacles
    const spectacleSelect = document.createElement('select');
    spectacleSelect.style.cssText = festiveInputStyle;
    for (const name in FESTIVE_SPECTACLES) {
        const opt = document.createElement('option');
        opt.value = FESTIVE_SPECTACLES[name];
        opt.textContent = name;
        spectacleSelect.appendChild(opt);
    }
    spectacleSelect.value = FESTIVE_SPECTACLES[DEFAULT_SPECTACLE_NAME];
    createFestiveRow(contentDiv, '✨ Spectacle (Aura):', spectacleSelect);

    // Auto-reset de selectores
    jestSelect.addEventListener('change', () => {
        if (jestSelect.value !== '') spectacleSelect.value = FESTIVE_SPECTACLES['Ninguno'];
    });

    spectacleSelect.addEventListener('change', () => {
        if (spectacleSelect.value !== '') jestSelect.value = FESTIVE_JESTS['Ninguno'];
    });

    // Nivel de Potencia (Potency Level)
    const potencyInput = document.createElement('input');
    potencyInput.type = 'range';
    potencyInput.min = '1';
    potencyInput.max = '5';
    potencyInput.value = '3';
    potencyInput.style.cssText = `
        flex-grow: 1; accent-color: #FF0000;
        background: linear-gradient(to right, #FFD700, #FF0000);
    `;

    const potencyLabel = document.createElement('span');
    potencyLabel.textContent = '🥳 Cheer Level: (Prank)';
    potencyLabel.style.cssText = `color: #FFD700; font-weight: bold; min-width: 120px; text-shadow: 1px 1px 2px #000;`;

    potencyInput.addEventListener('input', () => {
        const levels = { 1: 'Mischief', 2: 'Prank', 3: 'Spectacle', 4: 'Chaos', 5: 'Malice' };
        potencyLabel.textContent = `🥳 Cheer Level: (${levels[potencyInput.value]})`;
    });

    const potencyWrapper = document.createElement('div');
    potencyWrapper.style.cssText = `display:flex; align-items:center; gap:12px;`;
    potencyWrapper.appendChild(potencyLabel);
    potencyWrapper.appendChild(potencyInput);
    contentDiv.appendChild(potencyWrapper);


    // Toggle de repetición (Endless Celebration)
    const repeatToggle = document.createElement('input');
    repeatToggle.type = 'checkbox';
    repeatToggle.style.cssText = `transform: scale(1.5); accent-color: #FFD700;`;
    const repeatLabel = document.createElement('label');
    repeatLabel.textContent = ' 🎊 Endless Celebration';
    repeatLabel.style.cssText = `color: #ADFF2F; font-weight: bold; cursor: pointer; text-shadow: 0 0 5px rgba(0, 255, 0, 0.7);`;
    const repeatWrapper = document.createElement('div');
    repeatWrapper.style.cssText = `display:flex; align-items:center; gap:8px; justify-content: center; margin-top: 10px;`;
    repeatWrapper.appendChild(repeatToggle);
    repeatWrapper.appendChild(repeatLabel);
    contentDiv.appendChild(repeatWrapper);

    // Botón de activación
    const destroyBtn = document.createElement('button');
    destroyBtn.textContent = '🟢 DEPLOY SPECTACLE! 🟢';
    destroyBtn.disabled = true;
    destroyBtn.style.cssText = `
        padding: 12px 20px; border-radius: 10px; border: 2px solid #ADFF2F;
        background: linear-gradient(45deg, #008000, #004d00);
        color: white; font-weight: bold; font-size: 18px;
        cursor: pointer; transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(0, 255, 0, 0.5);
        text-shadow: 0 0 5px #000;
        font-family: 'Georgia', sans-serif;
        &:hover {
            background: linear-gradient(45deg, #00FF00, #00B300);
            box-shadow: 0 6px 20px rgba(0, 255, 0, 0.8);
            transform: translateY(-2px);
        }
        &:disabled {
            background: #666; cursor: not-allowed; opacity: 0.5;
            box-shadow: none; transform: none;
        }
    `;
    contentDiv.appendChild(destroyBtn);

    // Botón de parada (Vanish Spirit)
    stopBtn = document.createElement('button');
    stopBtn.textContent = '🔥 END THE FESTIVITY 🔥';
    stopBtn.disabled = true;
    stopBtn.style.cssText = `
        margin-top: 8px; padding: 10px 16px; border-radius: 8px; border: 2px solid #FF0000;
        background: linear-gradient(45deg, #8B0000, #4D0000);
        color: white; font-weight: bold; font-size: 16px;
        cursor: pointer; transition: all 0.3s ease;
        box-shadow: 0 4px 10px rgba(255, 0, 0, 0.5);
        font-family: 'Georgia', sans-serif;
        &:hover {
            background: linear-gradient(45deg, #FF0000, #B30000);
            transform: translateY(-1px);
        }
        &:disabled {
            background: #666; cursor: not-allowed; opacity: 0.5;
            transform: none;
        }
    `;
    contentDiv.appendChild(stopBtn);

    document.body.appendChild(container);

    /* ----------  FUNCIONES DE SABOTAJE FESTIVO  ---------- */

    // Función base para dibujar/lanzar el truco
    function castFestiveLine(x1, y1, x2, y2, color, thickness) {
        x1 = Math.round(x1); y1 = Math.round(y1);
        x2 = Math.round(x2); y2 = Math.round(y2);

        if (ctx && canvas) {
            // Client-side draw (for visual feedback on own screen)
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

        // Server-side draw command (the actual sabotage)
        const normX1 = (x1 / canvas.width).toFixed(4);
        const normY1 = (y1 / canvas.height).toFixed(4);
        const normX2 = (x2 / canvas.width).toFixed(4);
        const normY2 = (y2 / canvas.height).toFixed(4);
        // Note: The thickness is sent as a *negative* value for thicker lines
        const cmd = `42["drawcmd",0,[${normX1},${normY1},${normX2},${normY2},false,${0 - thickness},"${color}",0,0,{}]]`;
        socket.send(cmd);
    }

    // Obtener coordenadas del jugador víctima
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

    /* ----------  FESTIVE JESTS (TRICKS)  ---------- */

    // 1. Candy Cane Strike (Converging Red/White lines)
    async function candyStrike(playerId, potency = 3) {
        if (stopSignal) return;
        console.log(`🍬 Casting Candy Cane Strike on victim ${playerId} (Potency: ${potency})`);

        const target = getPlayerCoords(playerId);
        if (!target) return;

        const lineCount = 10 + (potency * 4);
        const colors = ['#FF0000', '#FFFFFF']; // Red and White

        for (let i = 0; i < lineCount; i++) {
            if (stopSignal) break;

            const startX = target.x + (Math.random() - 0.5) * 150;
            const startY = target.y + (Math.random() - 0.5) * 150;
            const endX = target.x + (Math.random() - 0.5) * 20;
            const endY = target.y + (Math.random() - 0.5) * 10;

            const color = colors[i % colors.length]; // Alternating colors
            const thickness = 3 + Math.random() * potency * 0.7;

            // Draw sharp lines converging on the target
            castFestiveLine(startX, startY, endX, endY, color, thickness);

            await new Promise(r => setTimeout(r, 80 - (potency * 10)));
        }
    }

    // 2. Gift Bomb (Explosion of wrapping lines/Ribbons)
    async function giftBomb(playerId, potency = 3) {
        if (stopSignal) return;
        console.log(`🎁 Gift Bomb exploding near ${playerId} (Potency: ${potency})`);

        const target = getPlayerCoords(playerId);
        if (!target) return;

        const radius = 30 + potency * 15;
        const colors = ['#8B0000', '#008000', '#FFD700', '#FF4500']; // Red, Green, Gold, Orange

        for (let i = 0; i < 10 + potency * 5; i++) {
            if (stopSignal) break;

            const centerX = target.x + (Math.random() - 0.5) * 50;
            const centerY = target.y + (Math.random() - 0.5) * 30;

            // Draw lines radiating outwards (explosion)
            const angle = Math.random() * 2 * Math.PI;
            const endX = centerX + radius * 3 * Math.cos(angle);
            const endY = centerY + radius * 3 * Math.sin(angle);

            const color = colors[i % colors.length];
            const thickness = 5 + potency * 2;

            castFestiveLine(centerX, centerY, endX, endY, color, thickness);

            await new Promise(r => setTimeout(r, 150 - (potency * 10)));
        }
    }

    // 3. Tinsel Glitch (Chaotic, shiny lines)
    async function tinselGlitch(playerId, potency = 3) {
        if (stopSignal) return;
        console.log(`🎄 Tinsel Glitch activated on victim ${playerId} (Potency: ${potency})`);

        const target = getPlayerCoords(playerId);
        if (!target) return;

        const glitchDuration = 1500 + potency * 500;
        const startTime = Date.now();
        const colors = ['#C0C0C0', '#FFD700', '#FFFFFF']; // Silver, Gold, White (Tinsel)

        while (Date.now() - startTime < glitchDuration) {
            if (stopSignal) break;

            const glitchCount = 5 + potency;
            const maxDisplacement = 60 + potency * 20;

            for (let i = 0; i < glitchCount; i++) {
                const startX = target.x + (Math.random() - 0.5) * maxDisplacement;
                const startY = target.y + (Math.random() - 0.5) * maxDisplacement;
                const endX = startX + (Math.random() - 0.5) * 20;
                const endY = startY + (Math.random() - 0.5) * 20;

                const color = colors[Math.floor(Math.random() * colors.length)];
                const thickness = 1 + Math.random() * potency * 0.5;

                // Draw short, chaotic, glowing lines (Tinsel)
                castFestiveLine(startX, startY, endX, endY, color, thickness);
            }

            await new Promise(r => setTimeout(r, 50 - (potency * 5)));
        }
    }

    /* --- JESTS Mapping --- */
    const jestFunctionMap = {
        'jest:gift_bomb': giftBomb,
        'jest:candy_strike': candyStrike,
        'jest:tinsel_glitch': tinselGlitch,
        'jest:reindeer_stampede': (id, p) => giftBomb(id, p + 1),
        'jest:starfall_splatter': (id, p) => tinselGlitch(id, p * 1.5),
        'jest:bell_chaos': (id, p) => candyStrike(id, p * 2),
        'jest:gingerbread_crumble': (id, p) => giftBomb(id, p),
        'jest:frozen_flame': (id, p) => candyStrike(id, p + 1),
        'jest:ice_shard_rain': (id, p) => tinselGlitch(id, p + 1),
        'jest:ribbon_snare': (id, p) => giftBomb(id, p * 1.5),
        'jest:scarf_entangle': (id, p) => tinselGlitch(id, p * 2),
        'jest:naughty_mark': (id, p) => candyStrike(id, p * 1.5),
        'jest:cocoa_spill': (id, p) => giftBomb(id, p),
        'jest:snowball_barrage': (id, p) => candyStrike(id, p),
        'jest:crown_gold': (id, p) => giftBomb(id, p * 2)
    };

    /* ----------  FESTIVE SPECTACLES (AURAS/PERSISTENT EFFECTS)  ---------- */

    // 1. Snowfall Layer (Dims the canvas with white)
    async function snowfallLayer(playerId, potency = 3) {
        if (stopSignal) return;
        console.log(`🌨️ Applying Snowfall Layer to canvas (Potency: ${potency})`);

        if (!canvas) return;

        // Draw a large, bright, semi-transparent box over the canvas repeatedly.
        const color = `rgba(255, 255, 255, ${0.1 + potency * 0.05})`; // Increasing whiteness
        const thickness = canvas.width / 2; // Cover a large area

        // Draw a single bright white line across the whole screen's center
        castFestiveLine(0, canvas.height / 2, canvas.width, canvas.height / 2, color, thickness);
    }

    // 2. Golden Border (Shimmering Gold/Green border)
    async function goldenBorder(playerId, potency = 3) {
        if (stopSignal) return;
        console.log(`⭐ Applying Golden Border to canvas (Potency: ${potency})`);

        if (!canvas) return;

        const colors = ['#FFD700', '#008000']; // Gold and Green
        const thickness = 5 + potency * 2;
        const offset = Math.random() * 5; // Shimmer effect

        // Draw four lines to form a border
        // Top
        castFestiveLine(0 - offset, 0 - offset, canvas.width + offset, 0 - offset, colors[0], thickness);
        // Bottom
        castFestiveLine(0 - offset, canvas.height + offset, canvas.width + offset, canvas.height + offset, colors[1], thickness);
        // Left
        castFestiveLine(0 - offset, 0 - offset, 0 - offset, canvas.height + offset, colors[0], thickness);
        // Right
        castFestiveLine(canvas.width + offset, 0 - offset, canvas.width + offset, canvas.height + offset, colors[1], thickness);
    }

    /* --- SPECTACLES Mapping --- */
    const spectacleFunctionMap = {
        'spectacle:snowfall_layer': snowfallLayer,
        'spectacle:golden_border': goldenBorder,
        'spectacle:pine_mist': (id, p) => snowfallLayer(id, p / 2),
        'spectacle:glitter_web': (id, p) => goldenBorder(id, p),
        'spectacle:ornament_clutter': (id, p) => snowfallLayer(id, p * 1.5),
        'spectacle:frost_glaze': (id, p) => goldenBorder(id, p * 1.5),
        'spectacle:carol_feedback': (id, p) => snowfallLayer(id, p),
        'spectacle:light_flicker': (id, p) => goldenBorder(id, p * 2)
    };

    /* ----------  SISTEMA DE GESTIÓN DE JUGADORES (VICTIMS)  ---------- */

    let lastPlayerList = new Set();
    let isUpdatingList = false;

    function refreshPlayerList() {
        if (isUpdatingList) return;

        const currentPlayers = new Set();
        const playerRows = document.querySelectorAll('.playerlist-row[data-playerid]');

        playerRows.forEach(row => {
            if (row.dataset.self !== 'true' && row.dataset.playerid !== '0') {
                const name = row.querySelector('.playerlist-name a')?.textContent || `Victim ${row.dataset.playerid}`;
                currentPlayers.add(`${row.dataset.playerid}:${name}`);
            }
        });

        const playersChanged = currentPlayers.size !== lastPlayerList.size ||
              ![...currentPlayers].every(player => lastPlayerList.has(player));

        if (!playersChanged) return;

        isUpdatingList = true;
        const previousSelection = playerSelect.value;

        playerSelect.innerHTML = '';

        playerRows.forEach(row => {
            if (row.dataset.self === 'true') return;
            if (row.dataset.playerid === '0') return;
            const name = row.querySelector('.playerlist-name a')?.textContent || `Victim ${row.dataset.playerid}`;
            const opt = document.createElement('option');
            opt.value = row.dataset.playerid;
            opt.textContent = `😈 ${name}`; // Festive/Malice Icon
            playerSelect.appendChild(opt);
        });

        if (previousSelection) {
            playerSelect.value = previousSelection;
        }

        lastPlayerList = new Set(currentPlayers);
        destroyBtn.disabled = playerSelect.children.length === 0;
        isUpdatingList = false;
    }

    /* ----------  EVENTOS PRINCIPALES  ---------- */

    // Dragging logic
    let isDragging = false;
    let offsetX, offsetY;

    titleBar.addEventListener('mousedown', (e) => {
        isDragging = true;
        titleBar.style.cursor = 'grabbing';
        offsetX = e.clientX - container.getBoundingClientRect().left;
        offsetY = e.clientY - container.getBoundingClientRect().top;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;
        newX = Math.max(0, Math.min(newX, window.innerWidth - container.offsetWidth));
        newY = Math.max(0, Math.min(newY, window.innerHeight - container.offsetHeight));
        container.style.left = newX + 'px';
        container.style.top = newY + 'px';
        container.style.right = 'auto';
        container.style.bottom = 'auto';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        titleBar.style.cursor = 'grab';
    });

    // Botón de parada de emergencia (End the Festivity)
    stopBtn.addEventListener('click', () => {
        console.log('🔥 END THE FESTIVITY: Spectacles Vanished.');
        stopSignal = true;

        if (activeEffectInterval) {
            clearInterval(activeEffectInterval);
            activeEffectInterval = null;
        }

        destroyBtn.textContent = '🟢 DEPLOY SPECTACLE! 🟢';
        destroyBtn.style.background = 'linear-gradient(45deg, #008000, #004d00)';
        destroyBtn.disabled = false;
        stopBtn.disabled = true;
    });

    // Botón principal de sabotaje (Deploy Spectacle!)
    destroyBtn.addEventListener('click', async () => {
        const playerId = playerSelect.value;
        if (!playerId) {
            alert('😈 Please select a victim first!');
            return;
        }

        const selectedJest = jestSelect.value;
        const selectedSpectacle = spectacleSelect.value;
        const potency = parseInt(potencyInput.value);

        // Toggle Continuous/Endless Celebration off if already running
        if (activeEffectInterval) {
            console.log('Stopping Endless Celebration...');
            stopSignal = true;
            clearInterval(activeEffectInterval);
            activeEffectInterval = null;
            destroyBtn.textContent = '🟢 DEPLOY SPECTACLE! 🟢';
            destroyBtn.style.background = 'linear-gradient(45deg, #008000, #004d00)';
            stopBtn.disabled = true;
            return;
        }

        let actionToExecute = null;

        // Select Jest or Spectacle
        if (selectedJest && selectedJest.startsWith('jest:')) {
            actionToExecute = jestFunctionMap[selectedJest];
        } else if (selectedSpectacle && selectedSpectacle.startsWith('spectacle:')) {
            actionToExecute = spectacleFunctionMap[selectedSpectacle];
        } else {
            alert('🎉 Please select a Jest or Spectacle to deploy!');
            return;
        }

        if (!actionToExecute) {
            alert('⚠️ Spectacle not implemented! The spirits refuse.');
            return;
        }

        stopSignal = false;
        destroyBtn.disabled = true;
        stopBtn.disabled = false;

        try {
            if (repeatToggle.checked) {
                destroyBtn.textContent = '🎊 END CELEBRATION 🎊';
                destroyBtn.style.background = 'linear-gradient(45deg, #8B0000, #FF0000)';
                destroyBtn.disabled = false;

                console.log('🔥 Initiating Endless Celebration...');

                const continuousCelebration = async () => {
                    if (stopSignal || !repeatToggle.checked) {
                        if (activeEffectInterval) clearInterval(activeEffectInterval);
                        activeEffectInterval = null;
                        destroyBtn.textContent = '🟢 DEPLOY SPECTACLE! 🟢';
                        destroyBtn.style.background = 'linear-gradient(45deg, #008000, #004d00)';
                        stopBtn.disabled = true;
                        return;
                    }

                    try {
                        await actionToExecute(playerId, potency);
                    } catch (error) {
                        console.error('Error during Endless Celebration:', error);
                    }
                };

                await continuousCelebration(); // First execution
                if (!stopSignal) {
                    // Repeat at a speed based on potency for non-aura effects
                    const intervalSpeed = selectedJest ? 3000 - (potency * 400) : 500;
                    activeEffectInterval = setInterval(continuousCelebration, intervalSpeed);
                }
            } else {
                console.log('💥 Executing One-Shot Jest...');
                await actionToExecute(playerId, potency);
            }
        } finally {
            if (!activeEffectInterval) {
                destroyBtn.disabled = false;
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
        if (activeEffectInterval) {
            clearInterval(activeEffectInterval);
            activeEffectInterval = null;
        }
        stopSignal = true;
    });

    // Inicialización
    refreshPlayerList();
    potencyLabel.textContent = `🥳 Cheer Level: (Spectacle)`; // Set default label
    console.log('🎁 The Festive Malice Kettle Mod loaded successfully! 🎁');

})();