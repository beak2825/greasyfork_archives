// ==UserScript==
// @name         Drawaria The Cauldron of Curses (Halloween)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Unleash chilling spectral hexes and auras to sabotage Drawaria players with true Halloween malice.
// @author       SpectralSaboteur
// @match        https://drawaria.online/*
// @match        https://*.drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551694/Drawaria%20The%20Cauldron%20of%20Curses%20%28Halloween%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551694/Drawaria%20The%20Cauldron%20of%20Curses%20%28Halloween%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ----------  CONFIGURACIÓN DE MALDICIONES Y AURAS  ---------- */

    // Hexes (Armas) de sabotaje espectral
    const HALLOWEEN_HEXES = {
        'Ninguno': '',
        '🧛 Vampire\'s Kiss': 'hex:vampires_kiss',         // Drains color palette (visual effect)
        '👻 Phantom\'s Glitch': 'hex:phantom_glitch',       // Chaotic drawing coordinates
        '🎃 Pumpkin King\'s Seal': 'hex:pumpkin_seal',     // Massive circular orange stamp
        '🕷️ Spider Rain': 'hex:spider_rain',
        '💀 Death Mark': 'hex:death_mark',
        '⚰️ Coffin Drop': 'hex:coffin_drop',
        '🔥 Hellfire Breath': 'hex:hellfire_breath',
        '👁️ Evil Eye Curse': 'hex:evil_eye',
        '⛓️ Chains of Torment': 'hex:chains_torment',
        '🔪 Butcher\'s Block': 'hex:butchers_block',
        '🌑 Dark Vortex': 'hex:dark_vortex',
        '🌕 Lunatic Grin': 'hex:lunatic_grin',
        '🧪 Potion of Chaos': 'hex:potion_chaos',
        '⚡ Lightning Strike': 'hex:lightning_strike',
        '🩸 Blood Splatter': 'hex:blood_splatter'
    };

    // Auras (Efectos) de sabotaje persistente
    const SPECTRAL_AURAS = {
        'Ninguno': '',
        '🛡️ Spectral Ward': 'aura:spectral_ward',          // Green/purple shield (for consistency with original)
        '🌫️ Graveyard Fog': 'aura:graveyard_fog',          // Dims the canvas
        '🧪 Ectoplasmic Slime': 'aura:ectoplasm_slime',    // Shimmering green border
        '💀 Haunting Glare': 'aura:haunting_glare',
        '🕯️ Candlelight Flicker': 'aura:candlelight_flicker',
        '🌀 Poltergeist Spin': 'aura:poltergeist_spin',
        '⭐ Demonic Rune': 'aura:demonic_rune',
        '🌑 Void Distortion': 'aura:void_distortion'
    };

    const DEFAULT_HEX_NAME = 'Ninguno';
    const DEFAULT_AURA_NAME = 'Ninguno';

    /* ----------  CONSTANTES DE EFECTOS  ---------- */
    const EFFECT_DURATION_BASE = 100; // ms base entre frames

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

    /* ----------  INTERFAZ DE USUARIO (CAULDRON OF CURSES)  ---------- */
    const container = document.createElement('div');
    container.style.cssText = `
        position:fixed; bottom:10px; right:10px; z-index:9999;
        background: radial-gradient(circle at top left, #330033 0%, #000000 100%);
        color:#ffcc00; padding:15px 20px; border-radius:15px;
        font-family: 'Creepster', 'Times New Roman', serif; font-size:14px;
        display:flex; flex-direction:column; gap:12px;
        box-shadow: 0 8px 30px rgba(100,0,100,0.9), inset 0 1px 0 rgba(255,100,255,0.1);
        border: 3px ridge #4b0082; /* Deep Purple/Indigo for spooky border */
        min-width: 320px;
        backdrop-filter: blur(5px);
        transform: rotateZ(1deg); /* Slight tilt for unsettling look */
    `;

    // Custom Font Styling (Optional: Requires loading a spooky font like 'Creepster')
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Creepster&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    const titleBar = document.createElement('div');
    titleBar.innerHTML = '⚰️ THE CAULDRON OF CURSES ⚰️';
    titleBar.style.cssText = `
        font-weight: bold; font-size: 20px; text-align: center; cursor: grab;
        background: linear-gradient(45deg, #8b0000, #ff00ff, #330033);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        text-shadow: 0 0 10px rgba(255, 0, 0, 0.7), 0 0 20px rgba(255, 100, 255, 0.5);
        margin: -15px -20px 10px -20px; padding: 15px 20px;
        border-bottom: 2px dashed #ff00ff;
        border-radius: 15px 15px 0 0;
        font-family: 'Creepster', cursive;
    `;
    container.appendChild(titleBar);

    const contentDiv = document.createElement('div');
    contentDiv.style.cssText = `display:flex; flex-direction:column; gap:12px;`;
    container.appendChild(contentDiv);

    const spookyInputStyle = `
        flex-grow: 1; padding: 10px 15px; border-radius: 5px;
        border: 2px solid #ff00ff; background: rgba(0, 0, 0, 0.7);
        color: #ffcc00; font-size: 14px; font-family: 'Creepster', monospace;
        transition: all 0.3s ease;
        &:focus { box-shadow: 0 0 15px rgba(255, 0, 255, 0.7); border-color: #ff0000; }
    `;

    function createSpookyRow(parent, labelText, inputElement) {
        const wrapper = document.createElement('div');
        wrapper.style.cssText = `display:flex; align-items:center; gap:12px;`;
        const label = document.createElement('span');
        label.textContent = labelText;
        label.style.cssText = `color: #ffcc00; font-weight: bold; min-width: 120px; text-shadow: 1px 1px 2px #000;`;
        wrapper.appendChild(label);
        wrapper.appendChild(inputElement);
        parent.appendChild(wrapper);
        return { wrapper, label, inputElement };
    }

    // Selector de jugadores (Victim)
    const playerSelect = document.createElement('select');
    playerSelect.style.cssText = spookyInputStyle;
    createSpookyRow(contentDiv, '💀 Victim:', playerSelect);

    // Selector de hexes
    const hexSelect = document.createElement('select');
    hexSelect.style.cssText = spookyInputStyle;
    for (const name in HALLOWEEN_HEXES) {
        const opt = document.createElement('option');
        opt.value = HALLOWEEN_HEXES[name];
        opt.textContent = name;
        hexSelect.appendChild(opt);
    }
    hexSelect.value = HALLOWEEN_HEXES[DEFAULT_HEX_NAME];
    createSpookyRow(contentDiv, '🔮 Hex:', hexSelect);

    // Selector de auras
    const auraSelect = document.createElement('select');
    auraSelect.style.cssText = spookyInputStyle;
    for (const name in SPECTRAL_AURAS) {
        const opt = document.createElement('option');
        opt.value = SPECTRAL_AURAS[name];
        opt.textContent = name;
        auraSelect.appendChild(opt);
    }
    auraSelect.value = SPECTRAL_AURAS[DEFAULT_AURA_NAME];
    createSpookyRow(contentDiv, '👻 Aura:', auraSelect);

    // Auto-reset de selectores
    hexSelect.addEventListener('change', () => {
        if (hexSelect.value !== '') auraSelect.value = SPECTRAL_AURAS['Ninguno'];
    });

    auraSelect.addEventListener('change', () => {
        if (auraSelect.value !== '') hexSelect.value = HALLOWEEN_HEXES['Ninguno'];
    });

    // Nivel de Potencia (Potency Level)
    const potencyInput = document.createElement('input');
    potencyInput.type = 'range';
    potencyInput.min = '1';
    potencyInput.max = '5';
    potencyInput.value = '3';
    potencyInput.style.cssText = `
        flex-grow: 1; accent-color: #ff0000;
        background: linear-gradient(to right, #ffcc00, #ff0000);
    `;

    const potencyLabel = document.createElement('span');
    potencyLabel.textContent = '🧪 Potency Level: (Mischief)';
    potencyLabel.style.cssText = `color: #ffcc00; font-weight: bold; min-width: 120px; text-shadow: 1px 1px 2px #000;`;

    potencyInput.addEventListener('input', () => {
        const levels = { 1: 'Mischief', 2: 'Prank', 3: 'Curse', 4: 'Hex', 5: 'Malice' };
        potencyLabel.textContent = `🧪 Potency Level: (${levels[potencyInput.value]})`;
    });

    const potencyWrapper = document.createElement('div');
    potencyWrapper.style.cssText = `display:flex; align-items:center; gap:12px;`;
    potencyWrapper.appendChild(potencyLabel);
    potencyWrapper.appendChild(potencyInput);
    contentDiv.appendChild(potencyWrapper);


    // Toggle de repetición (Eternal Torment)
    const repeatToggle = document.createElement('input');
    repeatToggle.type = 'checkbox';
    repeatToggle.style.cssText = `transform: scale(1.5); accent-color: #ff00ff;`;
    const repeatLabel = document.createElement('label');
    repeatLabel.textContent = ' ⚰️ Eternal Torment';
    repeatLabel.style.cssText = `color: #ff00ff; font-weight: bold; cursor: pointer; text-shadow: 0 0 5px rgba(255, 0, 255, 0.7);`;
    const repeatWrapper = document.createElement('div');
    repeatWrapper.style.cssText = `display:flex; align-items:center; gap:8px; justify-content: center; margin-top: 10px;`;
    repeatWrapper.appendChild(repeatToggle);
    repeatWrapper.appendChild(repeatLabel);
    contentDiv.appendChild(repeatWrapper);

    // Botón de activación
    const destroyBtn = document.createElement('button');
    destroyBtn.textContent = '🟢 UNLEASH THE HEX! 🟢';
    destroyBtn.disabled = true;
    destroyBtn.style.cssText = `
        padding: 12px 20px; border-radius: 10px; border: 2px solid #00ff00;
        background: linear-gradient(45deg, #008000, #004d00);
        color: white; font-weight: bold; font-size: 18px;
        cursor: pointer; transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(0, 255, 0, 0.5);
        text-shadow: 0 0 5px #000;
        font-family: 'Creepster', sans-serif;
        &:hover {
            background: linear-gradient(45deg, #00ff00, #00b300);
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
    stopBtn.textContent = '🔥 VANISH SPIRIT 🔥';
    stopBtn.disabled = true;
    stopBtn.style.cssText = `
        margin-top: 8px; padding: 10px 16px; border-radius: 8px; border: 2px solid #ff0000;
        background: linear-gradient(45deg, #8b0000, #4d0000);
        color: white; font-weight: bold; font-size: 16px;
        cursor: pointer; transition: all 0.3s ease;
        box-shadow: 0 4px 10px rgba(255, 0, 0, 0.5);
        font-family: 'Creepster', sans-serif;
        &:hover {
            background: linear-gradient(45deg, #ff0000, #b30000);
            transform: translateY(-1px);
        }
        &:disabled {
            background: #666; cursor: not-allowed; opacity: 0.5;
            transform: none;
        }
    `;
    contentDiv.appendChild(stopBtn);

    document.body.appendChild(container);

    /* ----------  FUNCIONES DE SABOTAJE ESPECTRAL  ---------- */

    // Función base para dibujar/lanzar hex
    function castSpectralLine(x1, y1, x2, y2, color, thickness) {
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
        // Note: The thickness is sent as a *negative* value to Drawaria for thicker lines
        const cmd = `42["drawcmd",0,[${normX1},${normY1},${normX2},${normY2},false,${0 - thickness},"${color}",0,0,{}]]`;
        socket.send(cmd);
    }

    // Obtener coordenadas del jugador víctima
    function getPlayerCoords(playerId) {
        // Find the player's avatar on the canvas
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

    /* ----------  HALLOWEEN HEXES  ---------- */

    // 1. Vampire's Kiss (Drains color palette)
    async function vampiresKiss(playerId, potency = 3) {
        if (stopSignal) return;
        console.log(`🧛 Casting Vampire's Kiss on victim ${playerId} (Potency: ${potency})`);

        const target = getPlayerCoords(playerId);
        if (!target) return;

        const drainCount = 10 + (potency * 4);
        const colors = ['#8B0000', '#4B0082', '#000000']; // Deep red, indigo, black

        for (let i = 0; i < drainCount; i++) {
            if (stopSignal) break;

            const startX = target.x + (Math.random() - 0.5) * 100;
            const startY = target.y - 100 + Math.random() * 50;
            const endX = target.x + (Math.random() - 0.5) * 20;
            const endY = target.y + (Math.random() - 0.5) * 10;

            const color = colors[Math.floor(Math.random() * colors.length)];
            const thickness = 2 + Math.random() * potency * 0.5;

            // Draw draining lines converging on the target
            castSpectralLine(startX, startY, endX, endY, color, thickness);

            await new Promise(r => setTimeout(r, 80 - (potency * 10)));
        }
    }

    // 2. Pumpkin King's Seal (Massive circular orange stamp)
    async function pumpkinKingsSeal(playerId, potency = 3) {
        if (stopSignal) return;
        console.log(`🎃 Sealing victim ${playerId} with the Pumpkin King's mark (Potency: ${potency})`);

        const target = getPlayerCoords(playerId);
        if (!target) return;

        const sealCount = 5 + (potency * 3);
        const colors = ['#FF7518', '#FF4500', '#FFA500']; // Pumpkin Orange/Red/Yellow

        for (let i = 0; i < sealCount; i++) {
            if (stopSignal) break;

            const centerX = target.x + (Math.random() - 0.5) * 50;
            const centerY = target.y + (Math.random() - 0.5) * 30;
            const radius = 30 + potency * 15;

            // Draw a massive circle stamp
            for (let angle = 0; angle < 16; angle++) {
                const radians = (angle / 16) * 2 * Math.PI;
                const x = centerX + radius * Math.cos(radians);
                const y = centerY + radius * Math.sin(radians);
                const color = colors[i % colors.length];

                // Draw lines from center to perimeter to simulate a solid circle/stamp
                castSpectralLine(centerX, centerY, x, y, color, 10 + potency);
            }

            await new Promise(r => setTimeout(r, 150 - (potency * 10)));
        }
    }

    // 3. Phantom's Glitch (Chaotic drawing coordinates)
    async function phantomsGlitch(playerId, potency = 3) {
        if (stopSignal) return;
        console.log(`👻 Initiating Phantom's Glitch on victim ${playerId} (Potency: ${potency})`);

        const target = getPlayerCoords(playerId);
        if (!target) return;

        const glitchDuration = 1500 + potency * 500;
        const startTime = Date.now();
        const colors = ['#00FF00', '#00FFFF', '#FF00FF', '#FFFFFF']; // Neon, spectral colors

        while (Date.now() - startTime < glitchDuration) {
            if (stopSignal) break;

            const glitchCount = 5 + potency;
            const maxDisplacement = 50 + potency * 20;

            for (let i = 0; i < glitchCount; i++) {
                const startX = target.x + (Math.random() - 0.5) * maxDisplacement;
                const startY = target.y + (Math.random() - 0.5) * maxDisplacement;
                const endX = startX + (Math.random() - 0.5) * 30;
                const endY = startY + (Math.random() - 0.5) * 30;

                const color = colors[Math.floor(Math.random() * colors.length)];
                const thickness = 1 + Math.random() * potency * 0.5;

                // Draw short, chaotic, glowing lines
                castSpectralLine(startX, startY, endX, endY, color, thickness);
            }

            await new Promise(r => setTimeout(r, 50 - (potency * 5)));
        }
    }

    /* --- Placeholder Hexes (Mapping to existing logic for full menu) --- */
    // Reusing the original mod's structure for the other 12 hexes/auras by mapping them
    // to the three new core functions, adjusted by potency.

    // Helper to map hexes to functions
    const hexFunctionMap = {
        'hex:vampires_kiss': vampiresKiss,
        'hex:phantom_glitch': phantomsGlitch,
        'hex:pumpkin_seal': pumpkinKingsSeal,
        'hex:spider_rain': (id, p) => phantomsGlitch(id, p + 1),
        'hex:death_mark': (id, p) => pumpkinKingsSeal(id, p),
        'hex:coffin_drop': (id, p) => vampiresKiss(id, p * 2),
        'hex:hellfire_breath': (id, p) => pumpkinKingsSeal(id, p * 2),
        'hex:evil_eye': (id, p) => vampiresKiss(id, p + 1),
        'hex:chains_torment': (id, p) => phantomsGlitch(id, p + 1),
        'hex:butchers_block': (id, p) => pumpkinKingsSeal(id, p * 1.5),
        'hex:dark_vortex': (id, p) => phantomsGlitch(id, p * 2),
        'hex:lunatic_grin': (id, p) => vampiresKiss(id, p * 1.5),
        'hex:potion_chaos': (id, p) => phantomsGlitch(id, p * 1.5),
        'hex:lightning_strike': (id, p) => vampiresKiss(id, p),
        'hex:blood_splatter': (id, p) => pumpkinKingsSeal(id, p)
    };

    /* ----------  SPECTRAL AURAS (PERSISTENT EFFECTS)  ---------- */

    // 1. Graveyard Fog (Dims the canvas)
    async function graveyardFog(playerId, potency = 3) {
        if (stopSignal) return;
        console.log(`🌫️ Applying Graveyard Fog to victim ${playerId} (Potency: ${potency})`);

        const target = getPlayerCoords(playerId);
        if (!target || !canvas) return;

        // Draw a large, dark, semi-transparent box over the canvas repeatedly.
        const color = `rgba(0, 0, 0, ${0.1 + potency * 0.05})`; // Increasing darkness
        const thickness = canvas.width / 2; // Make it a large stroke to cover

        // We only cast a single dark line across the whole screen's center
        // to minimize spam, relying on the line thickness to cover the area.
        castSpectralLine(0, canvas.height / 2, canvas.width, canvas.height / 2, color, thickness);
    }

    // 2. Ectoplasmic Slime (Shimmering green border)
    async function ectoplasmicSlime(playerId, potency = 3) {
        if (stopSignal) return;
        console.log(`🧪 Applying Ectoplasmic Slime to canvas (Potency: ${potency})`);

        if (!canvas) return;

        const colors = ['#39ff14', '#00cc00', '#aaffaa']; // Neon green slime
        const thickness = 5 + potency * 2;
        const offset = Math.random() * 5; // Shimmer effect

        // Draw four lines to form a border
        // Top
        castSpectralLine(0 - offset, 0 - offset, canvas.width + offset, 0 - offset, colors[0], thickness);
        // Bottom
        castSpectralLine(0 - offset, canvas.height + offset, canvas.width + offset, canvas.height + offset, colors[1], thickness);
        // Left
        castSpectralLine(0 - offset, 0 - offset, 0 - offset, canvas.height + offset, colors[2], thickness);
        // Right
        castSpectralLine(canvas.width + offset, 0 - offset, canvas.width + offset, canvas.height + offset, colors[0], thickness);
    }

    // Helper to map auras to functions
    const auraFunctionMap = {
        'aura:spectral_ward': (id, p) => ectoplasmicSlime(id, p / 2),
        'aura:graveyard_fog': graveyardFog,
        'aura:ectoplasm_slime': ectoplasmicSlime,
        'aura:haunting_glare': (id, p) => graveyardFog(id, p * 1.5),
        'aura:candlelight_flicker': (id, p) => ectoplasmicSlime(id, p),
        'aura:poltergeist_spin': (id, p) => graveyardFog(id, p),
        'aura:demonic_rune': (id, p) => ectoplasmicSlime(id, p * 1.5),
        'aura:void_distortion': (id, p) => graveyardFog(id, p * 2)
    };

    /* ----------  SISTEMA DE GESTIÓN DE JUGADORES (VICTIMS)  ---------- */

    // (Player list logic remains the same, only renaming labels)
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
            opt.textContent = `💀 ${name}`;
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

    // Dragging logic (renamed for theme)
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
        container.style.right = 'auto'; // Disable right/bottom styles during drag
        container.style.bottom = 'auto';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        titleBar.style.cursor = 'grab';
    });

    // Botón de parada de emergencia (Vanish Spirit)
    stopBtn.addEventListener('click', () => {
        console.log('🔥 VANISH SPIRIT: Hexes Dispersed.');
        stopSignal = true;

        if (activeEffectInterval) {
            clearInterval(activeEffectInterval);
            activeEffectInterval = null;
        }

        destroyBtn.textContent = '🟢 UNLEASH THE HEX! 🟢';
        destroyBtn.style.background = 'linear-gradient(45deg, #008000, #004d00)';
        destroyBtn.disabled = false;
        stopBtn.disabled = true;
    });

    // Botón principal de sabotaje (Unleash the Hex!)
    destroyBtn.addEventListener('click', async () => {
        const playerId = playerSelect.value;
        if (!playerId) {
            alert('💀 Please select a victim first!');
            return;
        }

        const selectedHex = hexSelect.value;
        const selectedAura = auraSelect.value;
        const potency = parseInt(potencyInput.value);

        // Toggle Continuous/Eternal Torment off if already running
        if (activeEffectInterval) {
            console.log('Stopping Eternal Torment...');
            stopSignal = true;
            clearInterval(activeEffectInterval);
            activeEffectInterval = null;
            destroyBtn.textContent = '🟢 UNLEASH THE HEX! 🟢';
            destroyBtn.style.background = 'linear-gradient(45deg, #008000, #004d00)';
            stopBtn.disabled = true;
            return;
        }

        let actionToExecute = null;

        // Select Hex or Aura
        if (selectedHex && selectedHex.startsWith('hex:')) {
            actionToExecute = hexFunctionMap[selectedHex];
        } else if (selectedAura && selectedAura.startsWith('aura:')) {
            actionToExecute = auraFunctionMap[selectedAura];
        } else {
            alert('🔮 Please select a Hex or Aura to unleash!');
            return;
        }

        if (!actionToExecute) {
            alert('⚠️ Curse not implemented! The spirits refuse.');
            return;
        }

        stopSignal = false;
        destroyBtn.disabled = true;
        stopBtn.disabled = false;

        try {
            if (repeatToggle.checked) {
                destroyBtn.textContent = '💀 END TORMENT 💀';
                destroyBtn.style.background = 'linear-gradient(45deg, #8b0000, #ff0000)';
                destroyBtn.disabled = false;

                console.log('🔥 Initiating Eternal Torment...');

                const continuousTorment = async () => {
                    if (stopSignal || !repeatToggle.checked) {
                        if (activeEffectInterval) clearInterval(activeEffectInterval);
                        activeEffectInterval = null;
                        destroyBtn.textContent = '🟢 UNLEASH THE HEX! 🟢';
                        destroyBtn.style.background = 'linear-gradient(45deg, #008000, #004d00)';
                        stopBtn.disabled = true;
                        return;
                    }

                    try {
                        await actionToExecute(playerId, potency);
                    } catch (error) {
                        console.error('Error during Eternal Torment:', error);
                    }
                };

                await continuousTorment(); // First execution
                if (!stopSignal) {
                    // Repeat at a speed based on potency for non-aura effects
                    const intervalSpeed = selectedHex ? 3000 - (potency * 400) : 500;
                    activeEffectInterval = setInterval(continuousTorment, intervalSpeed);
                }
            } else {
                console.log('💥 Executing One-Shot Curse...');
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
    potencyLabel.textContent = `🧪 Potency Level: (Curse)`; // Set default label
    console.log('⚰️ The Cauldron of Curses Mod loaded successfully! ⚰️');

})();