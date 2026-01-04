// ==UserScript==
// @name         Drawaria Spooky Grounds Manifestor (Halloween)
// @namespace    http://tampermonkey.net/
// @version      6.66
// @description  An ancient, gnarled oak tree stands silhouetted against a full, ominous moon, its twisted branches clawing at a starless.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @match        https://*.drawaria.online/*
// @grant        none
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/551697/Drawaria%20Spooky%20Grounds%20Manifestor%20%28Halloween%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551697/Drawaria%20Spooky%20Grounds%20Manifestor%20%28Halloween%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* ----------  SPECTRAL MANIFESTATION SYSTEM  ---------- */
    let spectralVeilSocket = null;
    let drawariaCanvas = null;
    let drawariaCtx = null;

    // Spectral Command Queue - Optimized for rapid ethereal summoning
    const spectralCommandQueue = [];
    let batchProcessor = null;
    const BATCH_SIZE = 8;
    const BATCH_INTERVAL = 60; // 60ms pulse for spectral commands

    // Variables of the Haunted Grounds
    let manifestationActive = false;
    let selectedSpecterId = null;
    let selectedSpecterName = null;
    let activeSpectralComponents = {
        curses: true, // Formerly hearts
        scythe: true, // Formerly sword
        ward: true    // Formerly shield
    };

    // Auxiliary function for spectral delay
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Intercept WebSocket: Tapping into the Drawaria Ethereal Channel
    const originalWebSocketSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (...args) {
        if (!spectralVeilSocket && this.url && this.url.includes('drawaria')) {
            spectralVeilSocket = this;
            console.log('🔗 [HAUNTED GROUNDS] Ethereal Channel (Socket) captured.');
            startBatchProcessor();
        }
        return originalWebSocketSend.apply(this, args);
    };

    function startBatchProcessor() {
        if (batchProcessor) return;
        batchProcessor = setInterval(() => {
            if (!spectralVeilSocket || spectralVeilSocket.readyState !== WebSocket.OPEN || spectralCommandQueue.length === 0) {
                return;
            }
            const batch = spectralCommandQueue.splice(0, BATCH_SIZE);
            batch.forEach(cmd => {
                try {
                    spectralVeilSocket.send(cmd);
                } catch (e) {
                    console.warn('⚠️ [HAUNTED GROUNDS] Error invoking spectral command:', e);
                }
            });
        }, BATCH_INTERVAL);
    }

    /* ----------  PIXEL PATTERNS OF THE NIGHT  ---------- */
    const pixelPatterns = {
        'curse_jack_o_lantern': [ // Formerly heart
            "   O O   ",
            "  OYYYO  ",
            " OYYRYYO ",
            " OYRYRYO ",
            "  ORYRO  ",
            "   R R   ",
            "    R    "
        ],
        'phantom_scythe': [ // Formerly sword
            "    W    ",
            "    W    ",
            "    W    ",
            "    W    ",
            "    W B W",
            "    WBBW ",
            "    WB W ",
            "   BBW   ",
            "  BBW    ",
            " BBW     "
        ],
        'ethereal_ward': [ // Formerly shield
            "  BBBBB  ",
            " BGGGGGB ",
            "BGGGGGB",
            "BG S GGB", // S for spike/skull detail
            "BGGGGGB",
            "BGGGGGB",
            " BGGGGGB ",
            "  BBBB  ",
            "   BB   "
        ]
    };

    const specificColorSchemes = {
        curse_jack_o_lantern: {
            classic: { 'R': '#FF4500', 'Y': '#FFA500', 'O': '#000000', ' ': null },
            dimmed: { 'R': '#330000', 'Y': '#442200', 'O': '#111111', ' ': null }
        },
        phantom_scythe: {
            classic: { 'W': '#D3D3D3', 'B': '#111111', ' ': null },
            dark: { 'W': '#666666', 'B': '#000000', ' ': null }
        },
        ethereal_ward: {
            classic: { 'G': '#32CD32', 'B': '#111111', 'S': '#D3D3D3', ' ': null },
            dark: { 'G': '#006400', 'B': '#000000', 'S': '#888888', ' ': null }
        }
    };

    /* ----------  SPECTER MANAGER (PLAYER TRACKING)  ---------- */
    class SpecterManager {
        constructor() {
            this.validSpecters = [];
            this.updateInterval = null;
        }

        updateSpecterOptions() {
            const playerSelect = document.getElementById('specter-selector');
            if (!playerSelect) return;

            // Preserve the current target specter
            const currentSelection = playerSelect.value;
            playerSelect.innerHTML = '';

            const playerElements = document.querySelectorAll('.spawnedavatar[data-playerid], .playerlist-row[data-playerid]');
            const validSpecters = [];

            playerElements.forEach(el => {
                const playerId = el.dataset.playerid;

                // Skip if no ID, or if it's the summoner (current player)
                if (!playerId || playerId === '0' || el.dataset.self === 'true') {
                    return;
                }

                let playerName = '';
                const nicknameEl = el.querySelector('.nickname, .playerlist-name a, .player-name');
                if (nicknameEl) {
                    playerName = nicknameEl.textContent.trim();
                }

                if (!playerName) {
                    const parentRow = el.closest('.playerlist-row');
                    if (parentRow) {
                        const nameEl = parentRow.querySelector('.playerlist-name a, .player-name');
                        if (nameEl) {
                            playerName = nameEl.textContent.trim();
                        }
                    }
                }

                if (!playerName) {
                    playerName = `Unidentified Specter ${playerId}`;
                }

                if (!validSpecters.some(p => p.id === playerId)) {
                    validSpecters.push({
                        id: playerId,
                        name: playerName
                    });
                }
            });

            this.validSpecters = validSpecters;

            if (validSpecters.length === 0) {
                const opt = document.createElement('option');
                opt.value = '';
                opt.textContent = '❌ The Mansion is Empty...';
                opt.disabled = true;
                playerSelect.appendChild(opt);

                const startBtn = document.getElementById('summon-system-btn');
                if (startBtn) startBtn.disabled = true;
            } else {
                // Option for All Specters
                const allOpt = document.createElement('option');
                allOpt.value = 'all';
                allOpt.textContent = `🌍 All Specters (${validSpecters.length})`;
                playerSelect.appendChild(allOpt);

                // Populate the list
                validSpecters.forEach(specter => {
                    const opt = document.createElement('option');
                    opt.value = specter.id;
                    opt.textContent = `💀 ${specter.name}`;
                    opt.dataset.specterName = specter.name;
                    playerSelect.appendChild(opt);
                });

                const stillExists = currentSelection === 'all' || validSpecters.some(p => p.id === currentSelection);

                if (currentSelection && stillExists) {
                    playerSelect.value = currentSelection;
                } else {
                    playerSelect.value = 'all';
                }

                // Update global tracking variables based on final selection
                selectedSpecterId = playerSelect.value;
                selectedSpecterName = (selectedSpecterId === 'all') ? 'All Specters' :
                                      (validSpecters.find(p => p.id === selectedSpecterId)?.name || 'Unknown Specter');

                const startBtn = document.getElementById('summon-system-btn');
                if (startBtn) startBtn.disabled = false;
            }

            console.log(`💀 [HAUNTED GROUNDS] Specters tracked: ${this.validSpecters.length}. Target: ${selectedSpecterName}`);
        }

        startAutoUpdate() {
            if (this.updateInterval) return;
            this.updateInterval = setInterval(() => { this.updateSpecterOptions(); }, 2000);
            this.updateSpecterOptions(); // Initial update
            console.log('🔄 [HAUNTED GROUNDS] Specter auto-tracking initiated.');
        }

        stopAutoUpdate() {
            if (this.updateInterval) {
                clearInterval(this.updateInterval);
                this.updateInterval = null;
                console.log('⏹️ [HAUNTED GROUNDS] Specter auto-tracking halted.');
            }
        }
    }

    /* ----------  SPECTRAL ART MANIFESTATION  ---------- */
    function enqueueSpectralCommand(x1, y1, x2, y2, color, thickness) {
        if (!drawariaCanvas || !spectralVeilSocket || !manifestationActive) return;

        const normX1 = (x1 / drawariaCanvas.width).toFixed(4);
        const normY1 = (y1 / drawariaCanvas.height).toFixed(4);
        const normX2 = (x2 / drawariaCanvas.width).toFixed(4);
        const normY2 = (y2 / drawariaCanvas.height).toFixed(4);

        // Drawaria protocol command for drawing
        const cmd = `42["drawcmd",0,[${normX1},${normY1},${normX2},${normY2},false,${-Math.abs(thickness)},"${color}",0,0,{}]]`;
        spectralCommandQueue.push(cmd);

        // Local drawing for immediate feedback (if drawariaCtx is enabled)
        if (drawariaCtx) {
            drawariaCtx.strokeStyle = color;
            drawariaCtx.lineWidth = thickness;
            drawariaCtx.lineCap = 'round';
            drawariaCtx.beginPath();
            drawariaCtx.moveTo(x1, y1);
            drawariaCtx.lineTo(x2, y2);
            drawariaCtx.stroke();
        }
    }

    /* ----------  HAUNTED GROUNDS MANIFESTOR (MAIN SYSTEM)  ---------- */
    class HauntedGroundsManifestor {
        constructor() {
            this.initialized = false;
            this.cursesRemaining = 3; // Lives
            this.lastSpecterPositions = new Map();
            this.specterManager = new SpecterManager();

            this.MOVEMENT_THRESHOLD = 4;
            this.UPDATE_INTERVAL = 80;
            this.lastUpdateTime = 0;
            this.SPECTRAL_CLASH_COOLDOWN = 3000;
            this.lastSpectralClashTime = 0;

            this.companionStates = new Map();
            this.animationState = {
                curseEffect: false,
                phantomStrike: false,
                etherealWard: false
            };

            this.cachedPatterns = this.preOptimizePatterns();
            this.init();
        }

        init() {
            const checkGameReady = () => {
                const gameCanvas = document.getElementById('canvas');
                if (gameCanvas) {
                    this.canvasElement = gameCanvas;
                    drawariaCanvas = gameCanvas;
                    this.canvasContext = gameCanvas.getContext('2d');
                    drawariaCtx = gameCanvas.getContext('2d');

                    this.initialized = true;
                    this.createControlInterface();
                    console.log('✅ [HAUNTED GROUNDS] Manifestor System initialized.');
                } else {
                    setTimeout(checkGameReady, 100);
                }
            };
            checkGameReady();
        }

        preOptimizePatterns() {
            const optimized = {};
            Object.keys(pixelPatterns).forEach(patternName => {
                optimized[patternName] = this.optimizePatternToLines(pixelPatterns[patternName]);
            });
            return optimized;
        }

        optimizePatternToLines(pattern) {
            const lines = [];
            for (let row = 0; row < pattern.length; row++) {
                let currentLine = null;
                for (let col = 0; col < pattern[row].length; col++) {
                    const char = pattern[row][col];
                    if (char !== ' ') {
                        if (!currentLine || currentLine.char !== char) {
                            if (currentLine) lines.push(currentLine);
                            currentLine = { char, startCol: col, endCol: col, row };
                        } else {
                            currentLine.endCol = col;
                        }
                    } else {
                        if (currentLine) {
                            lines.push(currentLine);
                            currentLine = null;
                        }
                    }
                }
                if (currentLine) lines.push(currentLine);
            }
            return lines;
        }

        getTargetSpecterCoords(specterId = null) {
            // Logic to find player coordinates (identical to original, just renamed context)
            if (!specterId || specterId === 'all') {
                const allSpecters = [];
                const avatars = document.querySelectorAll('.spawnedavatar[data-playerid]:not([data-playerid="0"]):not(.self)');

                avatars.forEach(avatar => {
                    if (!this.canvasElement) return;

                    const cRect = this.canvasElement.getBoundingClientRect();
                    const aRect = avatar.getBoundingClientRect();

                    if (aRect.width > 0 && aRect.height > 0) {
                        allSpecters.push({
                            id: avatar.dataset.playerid || `specter_${allSpecters.length}`,
                            x: Math.round((aRect.left - cRect.left) + (aRect.width / 2)),
                            y: Math.round((aRect.top - cRect.top) + (aRect.height / 2)),
                            width: aRect.width,
                            height: aRect.height
                        });
                    }
                });

                return allSpecters.length > 0 ? allSpecters : null;
            }

            const targetSpecters = [];
            const avatars = document.querySelectorAll(`.spawnedavatar[data-playerid="${specterId}"]`);

            avatars.forEach(avatar => {
                if (!this.canvasElement) return;

                const cRect = this.canvasElement.getBoundingClientRect();
                const aRect = avatar.getBoundingClientRect();

                if (aRect.width > 0 && aRect.height > 0) {
                    targetSpecters.push({
                        id: specterId,
                        x: Math.round((aRect.left - cRect.left) + (aRect.width / 2)),
                        y: Math.round((aRect.top - cRect.top) + (aRect.height / 2)),
                        width: aRect.width,
                        height: aRect.height
                    });
                }
            });

            return targetSpecters.length > 0 ? targetSpecters : null;
        }

        detectSpectralClashWithOtherSpecters() {
            if (selectedSpecterId === 'all') return false;

            const myPos = this.getTargetSpecterCoords(selectedSpecterId);
            if (!myPos || myPos.length === 0) return false;

            const now = Date.now();
            if (now - this.lastSpectralClashTime < this.SPECTRAL_CLASH_COOLDOWN) {
                return false;
            }

            const otherSpecters = document.querySelectorAll('.spawnedavatar.spawnedavatar-otherplayer');
            const clashDistance = 45;

            for (let otherSpecter of otherSpecters) {
                if (!this.canvasElement) continue;

                const cRect = this.canvasElement.getBoundingClientRect();
                const otherRect = otherSpecter.getBoundingClientRect();

                const otherX = (otherRect.left - cRect.left) + (otherRect.width / 2);
                const otherY = (otherRect.top - cRect.top) + (otherRect.height / 2);

                const distance = Math.sqrt(
                    Math.pow(myPos[0].x - otherX, 2) + Math.pow(myPos[0].y - otherY, 2)
                );

                if (distance < clashDistance) {
                    this.lastSpectralClashTime = now;
                    return true;
                }
            }
            return false;
        }

        drawOptimizedSpectralArt(patternName, colorScheme, pixelSize, centerX, centerY, rotation = 0, eraseMode = false) {
            const lines = this.cachedPatterns[patternName];
            if (!lines) return;

            let colors;
            if (eraseMode) {
                // Erasing draws a white square
                colors = Object.keys(specificColorSchemes[patternName][colorScheme] || {})
                    .reduce((acc, key) => {
                        acc[key] = key === ' ' ? null : '#FFFFFF';
                        return acc;
                    }, {});
            } else {
                colors = specificColorSchemes[patternName] ?
                         specificColorSchemes[patternName][colorScheme] :
                         specificColorSchemes.curse_jack_o_lantern[colorScheme];
            }

            const patternCenter = Math.floor(pixelPatterns[patternName].length / 2);

            lines.forEach(line => {
                if (!colors[line.char]) return;

                const startX = centerX + (line.startCol - patternCenter) * pixelSize;
                const endX = centerX + (line.endCol - patternCenter) * pixelSize + pixelSize;
                const y = centerY + (line.row - patternCenter) * pixelSize;

                enqueueSpectralCommand(startX, y, endX, y, colors[line.char], pixelSize * 1.2);
            });
        }

        async executeSpectralCurse() { // Formerly executeDamageSequence
            if (this.animationState.curseEffect || this.cursesRemaining <= 0) return;

            this.animationState.curseEffect = true;
            console.log(`🕯️ [HAUNTED GROUNDS] Curse activated! Curses remaining: ${this.cursesRemaining - 1}`);

            const cursesToDeactivate = [2, 1, 0];

            for (let i = 0; i < Math.min(cursesToDeactivate.length, this.cursesRemaining); i++) {
                const curseIndex = cursesToDeactivate[i];
                // Assuming only single-target mode for the curse logic
                if (this.companions && this.companions.curses[curseIndex]) {
                    this.companions.curses[curseIndex].active = false; // Jack-o'-Lantern dims
                    this.companions.curses[curseIndex].needsRedraw = true;
                }

                await new Promise(r => setTimeout(r, 800));
                if (i >= this.cursesRemaining - 1) break;
            }

            this.cursesRemaining--;

            if (this.cursesRemaining <= 0) {
                console.log('⚰️ [HAUNTED GROUNDS] No curses left! Re-summoning...');

                await new Promise(r => setTimeout(r, 2000));

                this.cursesRemaining = 3;
                if (this.companions) {
                    this.companions.curses.forEach(curse => {
                        curse.active = true; // Full light
                        curse.needsRedraw = true;
                    });
                }
                console.log('🔄 [HAUNTED GROUNDS] Re-summoned with 3 Curses (Jack-o-Lanterns)');
            } else {
                await new Promise(r => setTimeout(r, 500));
                if (this.companions) {
                    this.companions.curses.forEach(curse => {
                        curse.active = true;
                        curse.needsRedraw = true;
                    });
                }
            }

            this.animationState.curseEffect = false;
        }

        async executePhantomStrike() { // Formerly executeSwordAttack
            if (this.animationState.phantomStrike) return;

            this.animationState.phantomStrike = true;
            console.log('⚔️ [HAUNTED GROUNDS] Executing Phantom Scythe Strike!');

            // Swipe animation
            if (this.companions && this.companions.scythe) {
                this.companions.scythe.rotation = Math.PI / 3;
                this.companions.scythe.needsRedraw = true;
                await new Promise(r => setTimeout(r, 500));

                this.companions.scythe.rotation = -Math.PI / 3;
                this.companions.scythe.needsRedraw = true;
                await new Promise(r => setTimeout(r, 500));

                this.companions.scythe.rotation = 0;
                this.companions.scythe.needsRedraw = true;
            }

            await new Promise(r => setTimeout(r, 500));

            this.animationState.phantomStrike = false;
            console.log('⚔️ [HAUNTED GROUNDS] Phantom Strike complete.');
        }

        async executeEtherealWard() { // Formerly executeShieldDefense
            if (this.animationState.etherealWard) return;

            this.animationState.etherealWard = true;
            console.log('🛡️ [HAUNTED GROUNDS] Activating Ethereal Ward (Wrought Iron Gate)!');

            if (this.companions && this.companions.ward) {
                this.companions.ward.defending = true; // Subtle visual change if implemented
                this.companions.ward.needsRedraw = true;
                await new Promise(r => setTimeout(r, 1000));

                this.companions.ward.defending = false;
                this.companions.ward.needsRedraw = true;
            }

            this.animationState.etherealWard = false;
            console.log('🛡️ [HAUNTED GROUNDS] Ethereal Ward fading.');
        }

        // NEW: Clean Canvas functionality - Ritual of Banishment
        async ritualOfBanishment() {
            if (!drawariaCanvas) return;

            console.log('🧹 [HAUNTED GROUNDS] Initiating Ritual of Banishment (Canvas Wipe)...');

            const canvasWidth = drawariaCanvas.width;
            const canvasHeight = drawariaCanvas.height;

            // Send multiple white rectangles to simulate total banishment
            for (let y = 0; y < canvasHeight; y += 100) {
                for (let x = 0; x < canvasWidth; x += 100) {
                    const width = Math.min(100, canvasWidth - x);
                    const height = Math.min(100, canvasHeight - y);
                    enqueueSpectralCommand(x, y, x + width, y + height, '#FFFFFF', Math.max(width, height));
                    await sleep(5);
                }
            }

            // Clear local canvas
            if (drawariaCtx) {
                drawariaCtx.clearRect(0, 0, canvasWidth, canvasHeight);
            }

            console.log('🧹 [HAUNTED GROUNDS] All spectral traces banished!');
        }

        updateCompanions() {
            if (!manifestationActive || !this.initialized) return;

            const now = Date.now();
            if (now - this.lastUpdateTime < this.UPDATE_INTERVAL) return;

            const targetSpecters = this.getTargetSpecterCoords(selectedSpecterId);
            if (!targetSpecters) return;

            // Only check for Spectral Clash if a specific specter is targeted (not 'all')
            if (selectedSpecterId !== 'all') {
                const clash = this.detectSpectralClashWithOtherSpecters();
                if (clash && !this.animationState.curseEffect) {
                    this.executeSpectralCurse();
                    this.executePhantomStrike(); // Concurrent animations
                    this.executeEtherealWard();  // Concurrent animations
                }
            }

            targetSpecters.forEach(specter => {
                this.updateCompanionForSpecter(specter);
            });

            this.lastUpdateTime = now;
        }

        updateCompanionForSpecter(specter) {
            const specterId = specter.id;

            if (!this.companionStates.has(specterId)) {
                this.companionStates.set(specterId, {
                    curses: Array(3).fill().map(() => ({ active: true, lastX: -9999, lastY: -9999, needsRedraw: true })),
                    scythe: { rotation: 0, lastX: -9999, lastY: -9999, needsRedraw: true },
                    ward: { defending: false, lastX: -9999, lastY: -9999, needsRedraw: true }
                });
            }

            const state = this.companionStates.get(specterId);
            const lastPos = this.lastSpecterPositions.get(specterId) || { x: 0, y: 0 };

            const deltaX = Math.abs(specter.x - lastPos.x);
            const deltaY = Math.abs(specter.y - lastPos.y);
            const significantMovement = deltaX > this.MOVEMENT_THRESHOLD || deltaY > this.MOVEMENT_THRESHOLD;

            // --- Curses (Jack-o'-Lanterns) ---
            if (activeSpectralComponents.curses) {
                for (let i = 0; i < 3; i++) {
                    const curseX = specter.x + (i - 1) * 32;
                    const curseY = specter.y - specter.height / 2 - 25;

                    if (significantMovement || state.curses[i].needsRedraw || this.animationState.curseEffect) {
                        // Erase previous
                        if (state.curses[i].lastX !== -9999) {
                            this.drawOptimizedSpectralArt('curse_jack_o_lantern', 'classic', 3,
                                state.curses[i].lastX, state.curses[i].lastY, 0, true);
                        }

                        const scheme = state.curses[i].active ? 'classic' : 'dimmed';
                        this.drawOptimizedSpectralArt('curse_jack_o_lantern', scheme, 3, curseX, curseY, 0, false);

                        state.curses[i].lastX = curseX;
                        state.curses[i].lastY = curseY;
                        state.curses[i].needsRedraw = false;
                    }
                }
            }

            // --- Phantom Scythe ---
            if (activeSpectralComponents.scythe) {
                const scytheX = specter.x + specter.width / 2 + 30;
                const scytheY = specter.y;

                if (significantMovement || state.scythe.needsRedraw || this.animationState.phantomStrike) {
                    // Erase previous
                    if (state.scythe.lastX !== -9999) {
                        this.drawOptimizedSpectralArt('phantom_scythe', 'classic', 5,
                            state.scythe.lastX, state.scythe.lastY, 0, true);
                    }

                    this.drawOptimizedSpectralArt('phantom_scythe', 'classic', 5, scytheX, scytheY, state.scythe.rotation, false);

                    state.scythe.lastX = scytheX;
                    state.scythe.lastY = scytheY;
                    state.scythe.needsRedraw = false;
                }
            }

            // --- Ethereal Ward (Gate) ---
            if (activeSpectralComponents.ward) {
                const wardX = specter.x - specter.width / 2 - 30;
                const wardY = specter.y;

                if (significantMovement || state.ward.needsRedraw || this.animationState.etherealWard) {
                    // Erase previous
                    if (state.ward.lastX !== -9999) {
                        this.drawOptimizedSpectralArt('ethereal_ward', 'classic', 5,
                            state.ward.lastX, state.ward.lastY, 0, true);
                    }

                    const scheme = state.ward.defending ? 'dark' : 'classic'; // Defending could be 'darker'
                    this.drawOptimizedSpectralArt('ethereal_ward', scheme, 5, wardX, wardY, 0, false);

                    state.ward.lastX = wardX;
                    state.ward.lastY = wardY;
                    state.ward.needsRedraw = false;
                }
            }

            if (significantMovement) {
                this.lastSpecterPositions.set(specterId, { x: specter.x, y: specter.y });
            }
        }

        startSystem() {
            if (!this.initialized || !selectedSpecterId) {
                console.log('❌ [HAUNTED GROUNDS] System not ready or no specter selected.');
                return;
            }

            manifestationActive = true;
            this.specterManager.startAutoUpdate();

            // Initialize single-target companion structure (used for animations)
            this.companions = {
                curses: Array(3).fill().map(() => ({ active: true, lastX: -9999, lastY: -9999, needsRedraw: true })),
                scythe: { rotation: 0, lastX: -9999, lastY: -9999, needsRedraw: true },
                ward: { defending: false, lastX: -9999, lastY: -9999, needsRedraw: true }
            };
            this.cursesRemaining = 3;
            this.companionStates.clear(); // Clear multi-target states to allow fresh start

            const updateLoop = () => {
                if (manifestationActive && this.initialized) {
                    this.updateCompanions();
                    this.updateStatusDisplay();
                }
                if (manifestationActive) {
                    requestAnimationFrame(updateLoop);
                }
            };
            updateLoop();

            console.log('🎮 [HAUNTED GROUNDS] Manifestation initiated successfully.');
            console.log(`💀 [HAUNTED GROUNDS] Target Specter: ${selectedSpecterName || 'Unknown Entity'}`);
        }

        async stopSystem() {
            console.log('⏹️ [HAUNTED GROUNDS] Banishing spectral manifestations...');

            manifestationActive = false;
            this.specterManager.stopAutoUpdate();

            // Ritual of Banishment (Canvas cleanup)
            await this.ritualOfBanishment();

            // Reset the spectral command queue
            spectralCommandQueue.length = 0;
            console.log('🧹 [HAUNTED GROUNDS] Spectral Command Queue purged (Queue: 0)');

            // Clear all states
            this.companionStates.clear();
            this.lastSpecterPositions.clear();

            // Reset animations and lives
            this.animationState = { curseEffect: false, phantomStrike: false, etherealWard: false };
            this.cursesRemaining = 3;

            console.log('⏹️ [HAUNTED GROUNDS] System completely banished.');
        }

        createControlInterface() {
            const existingPanel = document.getElementById('haunted-grounds-manifestor');
            if (existingPanel) existingPanel.remove();

            const controlPanel = document.createElement('div');
            controlPanel.id = 'haunted-grounds-manifestor';
            controlPanel.style.cssText = `
                position: fixed; top: 20px; right: 20px; z-index: 9999;
                background: linear-gradient(135deg, #0a0a0a, #1a1a1a);
                color: #B0C4DE; padding: 25px; border-radius: 12px;
                font-family: 'Creepy', 'Old English Text MT', serif; /* Assume a spooky font is available/fallback */
                border: 3px solid #556B2F; /* Moss Green Border */
                min-width: 350px;
                box-shadow: 0 0 40px rgba(50,205,50,0.3); /* Pale Green Glow */
                font-size: 16px;
            `;

            controlPanel.innerHTML = `
                <div style="text-align: center; font-weight: bold; color: #DAA520; margin-bottom: 20px; font-size: 1.4em; border-bottom: 1px solid #556B2F; padding-bottom: 10px;">
                    HAUNTED GROUNDS MANIFESTOR v6.66
                </div>

                <div style="margin-bottom: 18px;">
                    <label style="display: block; margin-bottom: 7px; color: #D2691E;">💀 Target Specter/Victim:</label>
                    <select id="specter-selector" style="width: 100%; padding: 10px; border-radius: 6px; background: #222; color: #F5F5DC; border: 1px solid #D2691E; font-size: 1em;">
                        <option value="">👻 Sensing spectral signatures...</option>
                    </select>
                </div>

                <div style="margin-bottom: 18px;">
                    <label style="display: block; margin-bottom: 10px; color: #D2691E;">🔮 Active Manifestations:</label>
                    <div style="display: flex; gap: 15px; flex-wrap: wrap; justify-content: space-around;">
                        <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
                            <input type="checkbox" id="curses-toggle" checked style="accent-color: #FF4500; transform: scale(1.2);">
                            <span style="color: #FF4500;">🕯️ Flickering Curses</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
                            <input type="checkbox" id="scythe-toggle" checked style="accent-color: #D3D3D3; transform: scale(1.2);">
                            <span style="color: #D3D3D3;">⚔️ Phantom Scythe</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
                            <input type="checkbox" id="ward-toggle" checked style="accent-color: #556B2F; transform: scale(1.2);">
                            <span style="color: #556B2F;">🛡️ Ethereal Ward</span>
                        </label>
                    </div>
                </div>

                <div style="display: flex; gap: 12px; margin-bottom: 20px;">
                    <button id="summon-system-btn" style="flex: 1; padding: 12px; background: linear-gradient(135deg, #4B0082, #8A2BE2); color: #F5F5DC; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; transition: background 0.3s;" disabled>
                        🕸️ SUMMON
                    </button>
                    <button id="banish-system-btn" style="flex: 1; padding: 12px; background: linear-gradient(135deg, #8B0000, #A52A2A); color: #F5F5DC; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; transition: background 0.3s;" disabled>
                        ⚱️ BANISH
                    </button>
                </div>

                <div id="system-status" style="text-align: center; padding: 12px; background: #333; border-radius: 5px; margin-bottom: 10px; border: 1px dashed #556B2F;">
                    ⏸️ Status: <span style="color: #FF6347;">DORMANT</span> | Awaiting ritual...
                </div>

                <div id="manifestation-stats" style="font-size: 0.9em; color: #8B4513; text-align: center;">
                    📊 Specters Tracked: 0 | Queue Size: 0 | Curses Left: 3
                </div>

                <div style="font-size: 0.8em; color: #4B0082; margin-top: 15px; text-align: center;">
                    "Beware the chilling night of spectral encounters..."
                </div>
            `;

            document.body.appendChild(controlPanel);
            this.setupEventListeners();
        }

        setupEventListeners() {
            const specterSelect = document.getElementById('specter-selector');
            const cursesToggle = document.getElementById('curses-toggle');
            const scytheToggle = document.getElementById('scythe-toggle');
            const wardToggle = document.getElementById('ward-toggle');
            const summonBtn = document.getElementById('summon-system-btn');
            const banishBtn = document.getElementById('banish-system-btn');

            specterSelect?.addEventListener('change', (e) => {
                selectedSpecterId = e.target.value;
                if (selectedSpecterId === 'all') {
                    selectedSpecterName = 'All Specters';
                } else if (selectedSpecterId) {
                    const selectedOption = e.target.options[e.target.selectedIndex];
                    selectedSpecterName = selectedOption.dataset.specterName ||
                                       selectedOption.textContent.replace('💀 ', '') ||
                                       `Specter ${selectedSpecterId}`;
                } else {
                    selectedSpecterName = null;
                }

                console.log(`💀 [HAUNTED GROUNDS] Target Specter set to: ${selectedSpecterName || 'None'}`);

                if (summonBtn) summonBtn.disabled = !selectedSpecterId;
            });

            cursesToggle?.addEventListener('change', (e) => {
                activeSpectralComponents.curses = e.target.checked;
                console.log(`🕯️ [HAUNTED GROUNDS] Flickering Curses: ${e.target.checked ? 'Manifested' : 'Dissipated'}`);
            });

            scytheToggle?.addEventListener('change', (e) => {
                activeSpectralComponents.scythe = e.target.checked;
                console.log(`⚔️ [HAUNTED GROUNDS] Phantom Scythe: ${e.target.checked ? 'Manifested' : 'Dissipated'}`);
            });

            wardToggle?.addEventListener('change', (e) => {
                activeSpectralComponents.ward = e.target.checked;
                console.log(`🛡️ [HAUNTED GROUNDS] Ethereal Ward: ${e.target.checked ? 'Manifested' : 'Dissipated'}`);
            });

            summonBtn?.addEventListener('click', () => {
                if (!selectedSpecterId) return;
                this.startSystem();
                summonBtn.disabled = true;
                if (banishBtn) banishBtn.disabled = false;
            });

            banishBtn?.addEventListener('click', async () => {
                banishBtn.disabled = true;
                banishBtn.textContent = '🧹 BANISHING...';

                await this.stopSystem();

                banishBtn.textContent = '⚱️ BANISH';
                if (summonBtn) summonBtn.disabled = false;
                banishBtn.disabled = true;
            });

            // Initiate Specter Tracking after a delay
            setTimeout(() => { this.specterManager.startAutoUpdate(); }, 1000);
        }

        updateStatusDisplay() {
            const statusDiv = document.getElementById('system-status');
            const statsDiv = document.getElementById('manifestation-stats');

            if (statusDiv) {
                const status = manifestationActive ?
                    `▶️ Status: <span style="color: #98FB98;">MANIFESTING</span> | Target: ${selectedSpecterName || 'Unknown'}` :
                    `⏸️ Status: <span style="color: #FF6347;">DORMANT</span> | Awaiting ritual...`;
                statusDiv.innerHTML = status;
            }

            if (statsDiv) {
                const componentsList = Object.entries(activeSpectralComponents)
                    .filter(([, active]) => active)
                    .map(([name]) => name.charAt(0).toUpperCase() + name.slice(1))
                    .join(', ') || 'None';

                statsDiv.innerHTML = `📊 Specters Tracked: ${this.specterManager.validSpecters.length} | Queue Size: ${spectralCommandQueue.length} | Curses Left: <span style="color: ${this.cursesRemaining > 1 ? '#98FB98' : '#FF6347'};">${this.cursesRemaining}</span>`;
            }
        }
    }

    /* ----------  INITIALIZATION RITUAL  ---------- */
    let hauntedGroundsManifestor = null;

    const initHauntedSystem = () => {
        if (!hauntedGroundsManifestor) {
            console.log('💀 [HAUNTED GROUNDS] Initiating Haunted Grounds Manifestor v6.66...');
            hauntedGroundsManifestor = new HauntedGroundsManifestor();

            setTimeout(() => {
                console.log('');
                console.log('🎃 [HAUNTED GROUNDS] HAUNTED GROUNDS MANIFESTOR v6.66 LOADED!');
                console.log('🕯️ [HAUNTED GROUNDS] Spooky Companions: Flickering Jack-o-Lanterns, Phantom Scythe, Ethereal Ward');
                console.log('🧹 [HAUNTED GROUNDS] NEW: Ritual of Banishment (Canvas Wipe) & Queue Purge on BANISH');
                console.log('🎛️ [HAUNTED GROUNDS] Control Panel manifests in the upper right corner.');
                console.log('');
            }, 1000);
        }
    };

    // Initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHauntedSystem);
    } else {
        setTimeout(initHauntedSystem, 500);
    }

    // Fallback initialization
    setTimeout(initHauntedSystem, 2000);

    console.log('🌟 [HAUNTED GROUNDS] Spectral Manifestations Await... 🌟');

})();