// ==UserScript==
// @name         Drawaria JSAB Barracuda Boss
// @namespace    http://tampermonkey.net/
// @version      7.9
// @description  Full Conversion to Just Shapes & Beats (JSAB) style: Cyan Cube, trail particles, NERFED continuous Bullet Hell boss fight (OPEN MAP, Dynamic Boss) of "Barracuda (The Serpent)". CONTROLS FIXED!
// @author       YouTubeDrawaria
// @include	 https://drawaria.online/*
// @include	 https://*.drawaria.online/*
// @include      https://drawaria.online*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online/room/
// @connect      i.pinimg.com
// @connect      static.wikia.nocookie.net
// @connect      www.myinstants.com
// @connect      i.ytimg.com
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/551901/Drawaria%20JSAB%20Barracuda%20Boss.user.js
// @updateURL https://update.greasyfork.org/scripts/551901/Drawaria%20JSAB%20Barracuda%20Boss.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- I. CONFIGURATION & GLOBAL STATE (JSAB NORMAL CONVERSION) ---
    const CORRUPTION_COLOR = '#FC1E69'; // Magenta Intenso
    const PLAYER_COLOR = '#00FFFF'; // Cyan Neón
    const BATTLE_DURATION_MS = 60000;

    // NORMAL DIFFICULTY ADJUSTMENTS (NERF)
    const INVINCIBILITY_MS = 150; // Aumentado de 100ms a 150ms (más indulgente)
    const RHYTHM_PULSE_MS = 75; // Ralentizado de 60ms a 75ms (ataques más lentos)

    const SOUL_SIZE = 20;

    // ASSETS (JSAB - BARRACUDA)
    const SPRITE_BOSS = 'https://static.wikia.nocookie.net/just-shapes-and-beats/images/0/0c/Boss2Phase2.png/revision/latest/scale-to-width-down/268?cb=20190221133403&path-prefix=ru';
    const JSAB_MUSIC_URL = 'https://www.myinstants.com/media/sounds/jsab-boss2.mp3';
    const GAMEOVER_MUSIC_URL = 'https://www.myinstants.com/media/sounds/30_xKJjIlc.mp3';
    const SOUND_DAMAGE = 'https://www.myinstants.com/media/sounds/runescape-damage-updated.mp3';
    const SOUND_SELECT = 'https://www.myinstants.com/media/sounds/whoosh-sfx.mp3';
    const SOUND_YOU_WIN = 'https://www.myinstants.com/media/sounds/winners_W9Cpenj.mp3';
    const LOADING_SCREEN_URL = 'https://i.ibb.co/bMHzWLjj/00000001.png';

    // BOSS STATE (Time/Progress)
    const BOSS_NAME = 'Barracuda (The Serpent)';
    const BOSS_MAX_HP = 300;
    const BOSS_BASE_SIZE = 190;
    let bossCurrentHP = BOSS_MAX_HP;

    // STATE VARIABLES
    let battleOverlay = null;
    let isBattleActive = false;
    let animationFrameId = null;
    let bulletInterval = null;
    let enemyTurnTimer = null;
    let musicPlayer = null;
    let gameoverPlayer = null;
    let bossSpriteContainer = null;
    let bossImg = null;

    let currentTurn = 'ENEMY';
    const MAX_HP = 50;
    let currentHP = MAX_HP;
    let isInvincible = false;

    // JSAB Player State
    let keys = {};
    let soulX = 0;
    let soulY = 0;
    const soulSpeed = 8;
    const bullets = [];
    let particleFrameCounter = 0;
    let battleStartTime = 0;

    let isDashing = false;
    let canDash = true;
    const DASH_DURATION_MS = 150;
    const DASH_COOLDOWN_MS = 400;
    const DASH_DISTANCE = 120;

    // BARRACUDA PHASE BEATS (Ajustados para el ritmo de 75ms y dificultad Normal)
    let patternIndex = 0;
    const PHASE_2_START_BEAT = 150;
    const FASE_3_START_BEAT = 300;
    const FASE_4_START_BEAT = 400;
    const FASE_5_START_BEAT = 500;

    // BOSS MOVEMENT STATE
    let bossX = 0;
    let bossY = 0;


    // --- II. UTILITY FUNCTIONS (CORS BYPASS, ASSET LOADING, SFX) ---
    function getLocalUrl(originalUrl) {
        if (originalUrl.startsWith('data:') || originalUrl.startsWith('blob:') || originalUrl.startsWith('http://localhost')) {
            return Promise.resolve(originalUrl);
        }
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: originalUrl,
                responseType: "arraybuffer",
                onload: function(response) {
                    if (response.status === 200) {
                        const contentType = response.responseHeaders.match(/Content-Type: ([^;]+)/i)?.[1] || 'application/octet-stream';
                        const blob = new Blob([response.response], { type: contentType });
                        resolve(URL.createObjectURL(blob));
                    } else {
                        reject(new Error(`Asset fetch failed: Status ${response.status} for ${originalUrl}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error(`GM_xmlhttpRequest failed for ${originalUrl}: ${error.message}`));
                }
            });
        });
    }

    const playSFX = (url) => {
        try {
            const audio = new Audio(url);
            audio.volume = 0.5;
            audio.play().catch(e => console.warn("Error al reproducir SFX:", e));
        } catch (e) {
            console.warn("No se pudo crear el objeto de audio SFX:", e);
        }
    };

    // --- III. CSS & HTML STRUCTURE (JSAB STYLES - OPEN MAP) ---
    const UT_CSS = `
        @font-face {
            font-family: 'Undertale-Styled';
            font-family: 'Press Start 2P', monospace;
        }

        /* NEW LOADING SCREEN CSS */
        #jsab-loading-screen {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: black;
            z-index: 100000; /* Higher than battle overlay */
            display: flex; flex-direction: column; align-items: center; justify-content: center;
        }
        #jsab-loading-screen img {
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
        }
        #jsab-loading-text {
            color: white;
            font-family: 'Press Start 2P', monospace;
            margin-top: 20px;
            font-size: 16px;
        }
        /* END NEW LOADING SCREEN CSS */

        /* SCREEN SHAKE */
        @keyframes screen-shake {
            0%, 100% { transform: translate(0, 0); }
            25% { transform: translate(-3px, 0); }
            75% { transform: translate(3px, 0); }
        }
        .screen-shake-active {
            animation: screen-shake 0.15s ease-out 1;
        }

        /* BOSS SHIVER (Micro-tremor on bullet spawn) */
        @keyframes boss-shiver {
             0%, 100% { transform: translate(-50%, -50%) scale(var(--boss-scale)) rotate(var(--boss-rot)); }
             25% { transform: translate(-53%, -50%) scale(var(--boss-scale)) rotate(var(--boss-rot)); }
             75% { transform: translate(-47%, -50%) scale(var(--boss-scale)) rotate(var(--boss-rot)); }
        }
        .boss-shiver-active {
            animation: boss-shiver 0.1s ease-out 1;
        }

        /* BASE OVERLAY: Minimalist Black Background */
        #ut-battle-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(0, 0, 0, 1); z-index: 99999;
            display: flex; flex-direction: column; align-items: center; justify-content: space-between;
            font-family: 'Press Start 2P', monospace; color: white;
            padding: 20px; box-sizing: border-box; user-select: none;
            pointer-events: none;
            transition: background-color 0.5s ease;
        }

        /* BATTLE BOX: FULL SCREEN GAME AREA */
        #ut-battle-box-container {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            border: none; overflow: hidden;
            pointer-events: none;
        }

        /* PLAYER CUBE: Cian Neón */
        #ut-soul {
            position: absolute;
            width: ${SOUL_SIZE}px;
            height: ${SOUL_SIZE}px;
            background-color: ${PLAYER_COLOR};
            border-radius: 0;
            box-shadow: 0 0 8px ${PLAYER_COLOR};
            image-rendering: pixelated;
            transition: none;
        }

        /* PARTICLES: Trail effect */
        .ut-particle {
            position: absolute;
            width: 4px;
            height: 4px;
            background-color: rgba(0, 255, 255, 0.6);
            border-radius: 50%;
            pointer-events: none;
            animation: particle-fade 0.4s forwards ease-out;
            transform: translate(-50%, -50%);
        }
        @keyframes particle-fade {
            0% { transform: scale(1); opacity: 1; }
            100% { transform: scale(0.2); opacity: 0; }
        }

        /* OBSTACLES: Corruption Magenta (FIXED COLOR) */
        .ut-bullet {
            position: absolute;
            background-color: ${CORRUPTION_COLOR};
            box-shadow: 0 0 5px ${CORRUPTION_COLOR};
            pointer-events: none;
            transform-origin: center center;
            transition: none;
        }
        .ut-bullet.circle {
             width: 10px; height: 10px; border-radius: 50%;
        }
        .ut-bullet.spiky {
            width: 20px; height: 20px; border-radius: 50%;
            background-image: radial-gradient(circle at center, white 20%, ${CORRUPTION_COLOR} 20%);
            box-shadow: 0 0 10px ${CORRUPTION_COLOR};
        }
        .ut-bullet.bar {
            background-color: ${CORRUPTION_COLOR};
            border-radius: 0;
        }

        .ut-bullet.white-arc {
            background-color: ${CORRUPTION_COLOR};
            box-shadow: 0 0 10px ${CORRUPTION_COLOR};
            opacity: 0.8;
            border-radius: 50%;
        }
        .ut-bullet.white-bar {
             background-color: ${CORRUPTION_COLOR};
             box-shadow: 0 0 10px ${CORRUPTION_COLOR};
             border-radius: 0;
        }


        /* BOSS SPRITE CONTAINER & IMAGE */
        #ut-boss-sprite-container {
             position: absolute; top: 0; left: 0;
             transition: all 0.05s linear;
             pointer-events: none;
             transform: translate(-50%, -50%);
        }
        #ut-toriel-img {
            width: ${BOSS_BASE_SIZE}px;
            height: ${BOSS_BASE_SIZE}px;
            object-fit: contain;
            image-rendering: pixelated;
        }

        /* Eliminada la lógica y animaciones de los brazos del jefe anterior */


        /* HIDDEN ELEMENTS (For Game Over) */
        .gameover-option.selected {
            color: yellow;
        }
    `;

    // --- IV. HTML STRUCTURE ---
    const UT_HTML = `
        <!-- Minimalist Top Bar for Boss Name & HP Status (Fixed Position) -->
        <div id="ut-hud">
            <div id="ut-hp-status">
                <span style="color: ${PLAYER_COLOR};">CUBE HP:</span>
                <div id="ut-hp-bar" style="width: 50px; height: 10px; background-color: red; border: 1px solid white; margin-left: 5px;"><div id="ut-hp-bar-fill" style="height: 100%; background-color: yellow;"></div></div>
                <div id="ut-hp-text" style="margin-left: 5px;">${currentHP} / ${MAX_HP}</div>
            </div>

            <div id="ut-boss-hud">
                <span id="ut-boss-name">${BOSS_NAME}</span>
                <div id="ut-boss-hp-bar" style="width: 80px; height: 6px; background-color: #333; border: 1px solid white; margin-left: 8px;"><div id="ut-boss-hp-fill" style="height: 100%; width: 100%; background-color: yellow;"></div></div>
            </div>
        </div>

        <!-- BATTLE BOX (FULL SCREEN Game Area for Bullets) -->
        <div id="ut-battle-box-container">
            <!-- BOSS SPRITE CONTAINER -->
            <div id="ut-boss-sprite-container">
                 <img id="ut-toriel-img" src="" alt="Barracuda Boss">
            </div>
            <!-- PLAYER CUBE -->
            <div id="ut-soul"></div>
        </div>

        <!-- PROGRESS BAR (Bottom of screen) -->
        <div id="jsab-progress-bar">
            <div id="jsab-progress-fill"></div>
        </div>

        <!-- MENU (Only Quit - Fixed Position) -->
        <div id="ut-menu">
            <div class="ut-menu-button" id="quit-btn">🚫 QUIT/RESTART</div>
        </div>
        <div id="ut-submenu" style="display: none;"></div>
    `;

    // --- V. GAME LOGIC HANDLERS (JSAB CORE) ---

    // DASH Control (Directional Impulse Logic)
    const handleDash = (e) => {
        if (!isBattleActive || currentTurn !== 'ENEMY' || isDashing || !canDash) return;

        // CRITICAL: Ensure Z/z and Space are included
        if (e.key === 'Shift' || e.key === ' ' || e.key === 'z' || e.key === 'Z') {
            e.preventDefault();

            // 1. Determine direction vector
            let dashVx = 0;
            let dashVy = 0;

            if (keys['ArrowUp'] || keys['w']) dashVy -= 1;
            if (keys['ArrowDown'] || keys['s']) dashVy += 1;
            if (keys['ArrowLeft'] || keys['a']) dashVx -= 1;
            if (keys['ArrowRight'] || keys['d']) dashVx += 1;

            // Normalize vector and scale by fixed distance
            if (dashVx !== 0 || dashVy !== 0) {
                const magnitude = Math.sqrt(dashVx * dashVx + dashVy * dashVy);
                dashVx = (dashVx / magnitude) * DASH_DISTANCE;
                dashVy = (dashVy / magnitude) * DASH_DISTANCE;
            } else {
                 dashVx = 0;
                 dashVy = 0;
            }

            // Apply Dash state and invincibility
            isDashing = true;
            canDash = false;
            isInvincible = true;

            // 2. Apply position change instantly
            soulX = Math.max(0, Math.min(soulX + dashVx, window.innerWidth - SOUL_SIZE));
            soulY = Math.max(0, Math.min(soulY + dashVy, window.innerHeight - SOUL_SIZE));

            const soulEl = document.getElementById('ut-soul');

            // Apply fast transition and scale visual effect (0.1s duration)
            if(soulEl) {
                 soulEl.style.transition = 'transform 0.1s linear';
                 soulEl.style.transform = `translate(${soulX}px, ${soulY}px) scale(1.5)`;
            }

            playSFX(SOUND_SELECT);

            // 3. Reset after duration
            setTimeout(() => {
                isInvincible = false;
                if(soulEl) {
                     soulEl.style.transform = `translate(${soulX}px, ${soulY}px) scale(1)`;
                     soulEl.style.transition = 'none';
                }
                isDashing = false;
            }, DASH_DURATION_MS);

            // 4. Cooldown
            setTimeout(() => {
                canDash = true;
            }, DASH_COOLDOWN_MS);
        }
    }

    // Key Handlers (Remains the same)
    const handleKeyDown = (e) => {
        if (!isBattleActive) return;
        if (currentTurn === 'ENEMY') {
            keys[e.key] = true;
            handleDash(e);
        }
        if (currentTurn === 'GAMEOVER') {
             handleGameOverKey(e);
        }
    };
    const handleKeyUp = (e) => {
        if (currentTurn === 'ENEMY' && isBattleActive) {
            keys[e.key] = false;
        }
    };

    // Particle Logic (Remains the same)
    const spawnParticle = () => {
        const box = document.getElementById('ut-battle-box-container');
        if (!box) return;

        const pX = soulX + SOUL_SIZE / 2;
        const pY = soulY + SOUL_SIZE / 2;

        const particle = document.createElement('div');
        particle.className = 'ut-particle';
        particle.style.left = `${pX}px`;
        particle.style.top = `${pY}px`;
        box.appendChild(particle);

        setTimeout(() => particle.remove(), 400);
    };

    // Soul/Cube Movement Logic (FIXED: Corrected 's' key to use dy)
    const updateSoulPosition = () => {
        let dx = 0; let dy = 0;

        if (keys['ArrowUp'] || keys['w']) dy -= soulSpeed;
        if (keys['ArrowDown'] || keys['s']) dy += soulSpeed; // FIX: Now correctly sets vertical movement
        if (keys['ArrowLeft'] || keys['a']) dx -= soulSpeed;
        if (keys['ArrowRight'] || keys['d']) dx += soulSpeed;

        // Diagonal movement normalization (optional, but good for balance)
        if (dx !== 0 && dy !== 0) {
            const diagSpeed = soulSpeed / Math.sqrt(2);
            dx = (dx > 0) ? diagSpeed : (dx < 0 ? -diagSpeed : 0);
            dy = (dy > 0) ? diagSpeed : (dy < 0 ? -diagSpeed : 0);
        } else {
             dx = (dx > 0) ? soulSpeed : (dx < 0 ? -soulSpeed : 0);
             dy = (dy > 0) ? soulSpeed : (dy < 0 ? -soulSpeed : 0);
        }


        if (dx !== 0 || dy !== 0) {
            if (particleFrameCounter % 2 === 0) {
                spawnParticle();
            }
        }
        particleFrameCounter++;

        soulX += dx;
        soulY += dy;

        soulX = Math.max(0, Math.min(soulX, window.innerWidth - SOUL_SIZE));
        soulY = Math.max(0, Math.min(soulY, window.innerHeight - SOUL_SIZE));

        const soulEl = document.getElementById('ut-soul');
        if(soulEl) {
            if (!isDashing) {
                 soulEl.style.transform = `translate(${soulX}px, ${soulY}px)`;
            }
        }
    };

    // AABB Collision Check (Remains the same)
    const checkCollision = () => {
        const soul = document.getElementById('ut-soul');
        const battleBox = document.getElementById('ut-battle-box-container');
        if (!soul || isInvincible || !battleBox) return;

        const sLeft = soulX;
        const sRight = soulX + SOUL_SIZE;
        const sTop = soulY;
        const sBottom = soulY + SOUL_SIZE;

        const takeDamage = (amount) => {
             if (isInvincible) return;

             currentHP = Math.max(0, currentHP - amount);
             updateHUD();
             playSFX(SOUND_DAMAGE);

             battleBox.classList.add('screen-shake-active');
             setTimeout(() => battleBox.classList.remove('screen-shake-active'), 150);

             isInvincible = true;
             soul.style.opacity = 0.5;

             setTimeout(() => {
                 isInvincible = false;
                 soul.style.opacity = 1;
             }, INVINCIBILITY_MS); // INVINCIBILITY_MS is 150ms (Nerfed)

             if (currentHP === 0) {
                 handleGameOver();
                 return true;
             }
             return true;
        };

        // 1. Boss Body/Image Collision Check
        if (bossImg) {
            const bossRect = bossImg.getBoundingClientRect();

            const bLeft = bossRect.left;
            const bRight = bossRect.right;
            const bTop = bossRect.top;
            const bBottom = bossRect.bottom;

            // Detección de colisión con el área del jefe
            if (sLeft < bRight && sRight > bLeft && sTop < bBottom && sBottom > bTop) {
                 if (takeDamage(1)) return;
            }
        }

        // 2. Bullet/Projectile Collision Check
        for (let i = bullets.length - 1; i >= 0; i--) {
            const b = bullets[i];
            const bEl = b.element;

            const bWidth = b.width || 10;
            const bHeight = b.height || 10;
            const bLeft = b.x;
            const bRight = b.x + bWidth;
            const bTop = b.y;
            const bBottom = b.y + bHeight;

            if (b.y > window.innerHeight + 50 || b.y < -50 || b.x > window.innerWidth + 50 || b.x < -50) {
                bEl.remove();
                bullets.splice(i, 1);
                continue;
            }

            if (sLeft < bRight && sRight > bLeft && sTop < bBottom && sBottom > bTop) {
                if (takeDamage(1)) return;

                if (!b.isPersistent) {
                    bEl.remove();
                    bullets.splice(i, 1);
                }
            }
        }
    };

    // Helper to spawn a bullet (Remains the same)
    const createBullet = (x, y, vx, vy, width = 10, height = 10, className = 'circle', isPersistent = false) => {
        const box = document.getElementById('ut-battle-box-container');
        const b = {
            element: document.createElement('div'),
            x: x - width / 2,
            y: y - height / 2,
            vx: vx,
            vy: vy,
            width: width,
            height: height,
            isPersistent: isPersistent
        };
        b.element.className = 'ut-bullet ' + className;
        b.element.style.width = `${b.width}px`;
        b.element.style.height = `${b.height}px`;
        b.element.style.transform = `translate(${b.x}px, ${b.y}px)`;
        box.appendChild(b.element);
        bullets.push(b);
        return b;
    };

    // Helper to spawn a bar/wall bullet (Remains the same)
    const createWallBullet = (x, y, w, h, vx, vy, className = 'bar') => {
        return createBullet(x + w / 2, y + h / 2, vx, vy, w, h, className, true);
    };

    // JSAB Rhythmic Pattern Motor (MODIFIED: BARRACUDA NERFED PATTERNS)
    const spawnRhythmicBullet = () => {
        const box = document.getElementById('ut-battle-box-container');
        if (!box || currentTurn !== 'ENEMY') return;

        const W = window.innerWidth;
        const H = window.innerHeight;
        const beat = patternIndex % FASE_5_START_BEAT;

        // --- 1. PHASE 1: Proyectiles Simples Ondulados (Beats 0-150) ---
        if (patternIndex < PHASE_2_START_BEAT) {
             // Ondas Diagonales
             if (patternIndex % 20 === 0) { // Menos frecuente que antes
                 const speed = 3.0; // Velocidad menor
                 const numBullets = 5;
                 const isFromLeft = (patternIndex % 40 === 0);

                 for (let i = 0; i < numBullets; i++) {
                     const startY = (H / numBullets) * i;
                     let vx = isFromLeft ? speed : -speed;
                     let vy = 0.5 * Math.sin(patternIndex * 0.08); // Onda suave

                     createBullet(isFromLeft ? 0 : W - 10, startY, vx, vy, 10, 10, 'circle');
                 }
             }
         }

        // --- 2. PHASE 2: Muros Horizontales/Verticales (Beats 150-300) ---
        const phase2Beat = patternIndex - PHASE_2_START_BEAT;

        if (phase2Beat >= 0 && phase2Beat < 150) {
            if (phase2Beat % 16 === 0) { // Menos frecuente que antes
                const wallSpeed = 2.5; // Velocidad menor
                const wallThickness = 30; // Muros más gruesos
                const gapSize = 150; // Hueco más grande

                // Patrón 1: Muros Horizontales (Movimiento Vertical)
                if (phase2Beat % 32 === 0) {
                    const topY = 0;
                    const bottomY = H;
                    const gapX = W * Math.random() * 0.6 + W * 0.2; // Gap aleatorio más central

                    // Muro Superior Izquierdo
                    createWallBullet(0, topY, gapX, wallThickness, 0, wallSpeed);
                    // Muro Superior Derecho
                    createWallBullet(gapX + gapSize, topY, W - (gapX + gapSize), wallThickness, 0, wallSpeed);
                }
            }
        }


        // --- 3. PHASE 3: Drop (Ráfaga Homing y Espejo) (Beats 300-400) ---
        const phase3Beat = patternIndex - FASE_3_START_BEAT;
        const HOMING_SPEED = 4.5; // Velocidad de Homing nerfeada

        if (patternIndex === FASE_3_START_BEAT) {
             battleOverlay.style.backgroundColor = 'rgba(15, 0, 15, 1)';
        }

        if (phase3Beat >= 0 && phase3Beat < 100) {
            // Homing rápido (cada 8 beats)
            if (phase3Beat % 8 === 0) {
                const targetX = soulX + SOUL_SIZE / 2;
                const targetY = soulY + SOUL_SIZE / 2;
                const startX = bossX;
                const startY = bossY;

                const angle = Math.atan2(targetY - startY, targetX - startX);
                const vx = HOMING_SPEED * Math.cos(angle);
                const vy = HOMING_SPEED * Math.sin(angle);

                createBullet(startX, startY, vx, vy, 15, 15, 'spiky', false);
            }

            // Patrón Espejo (cada 15 beats)
            if (phase3Beat % 15 === 0) {
                 const speed = 3; // Velocidad más lenta
                 const numShots = 4; // Menos densidad

                 // Ráfaga desde Izquierda/Derecha
                 for(let i=0; i < numShots; i++) {
                     const yOffset = H * 0.15 * i;
                     createBullet(0, H/2 + yOffset, speed, 0, 10, 10, 'circle');
                     createBullet(W, H/2 + yOffset, -speed, 0, 10, 10, 'circle');
                 }
            }
        }


        // --- 4. PHASE 4: Zig-Zag Serpiente (Rastro) (Beats 400-500) ---
        const phase4Beat = patternIndex - FASE_4_START_BEAT;
        const SERPENT_SPEED = 3.5; // Velocidad más lenta
        const TRAIL_DELAY = 12; // Rastro más largo, pero más lento

        if (phase4Beat >= 0 && phase4Beat < 100) {
            if (phase4Beat % 25 === 0) { // Menos frecuente
                const startX = (phase4Beat % 50 === 0) ? 0 : W;
                const startY = (phase4Beat % 50 === 0) ? H : 0;
                const vx = (startX === 0) ? SERPENT_SPEED : -SERPENT_SPEED;
                const vy = (startY === 0) ? SERPENT_SPEED : -SERPENT_SPEED;

                const serpentHead = createBullet(startX, startY, vx, vy, 30, 30, 'spiky', false);

                let trailCounter = 0;
                const trailInterval = setInterval(() => {
                    if (!isBattleActive || trailCounter >= TRAIL_DELAY || serpentHead.element.isConnected === false) {
                        clearInterval(trailInterval);
                        return;
                    }
                    createBullet(serpentHead.x + serpentHead.width/2, serpentHead.y + serpentHead.height/2, 0, 0, 15, 15, 'spiky', true);
                    trailCounter++;
                }, RHYTHM_PULSE_MS * 3); // Intervalo de rastro aún más lento
            }
        }


        // --- 5. PHASE 5: Frenesí Final de Paredes Rápidas (Beats 500-Final) ---
        const phase5Beat = patternIndex - FASE_5_START_BEAT;
        if (phase5Beat >= 0) {
            if (phase5Beat % 12 === 0) { // Menos frecuente que antes
                const wallSpeed = 3.5; // Velocidad nerfeada
                const wallThickness = 25; // Más gruesos
                const gapSize = 120; // Hueco más grande
                const isVertical = (phase5Beat % 24 === 0);

                if (isVertical) {
                    // Paredes Verticales Rápidas
                    const startX = (phase5Beat % 48 === 0) ? 0 : W - wallThickness;
                    const gapY = H * Math.random() * 0.5 + H * 0.25;

                    createWallBullet(startX, 0, wallThickness, gapY, (startX === 0 ? wallSpeed : -wallSpeed), 0);
                    createWallBullet(startX, gapY + gapSize, wallThickness, H - (gapY + gapSize), (startX === 0 ? wallSpeed : -wallSpeed), 0);
                } else {
                    // Paredes Horizontales Rápidas
                    const startY = (phase5Beat % 48 === 0) ? 0 : H - wallThickness;
                    const gapX = W * Math.random() * 0.5 + W * 0.25;

                    createWallBullet(0, startY, gapX, wallThickness, 0, (startY === 0 ? wallSpeed : -wallSpeed));
                    createWallBullet(gapX + gapSize, startY, W - (gapX + gapSize), wallThickness, 0, (startY === 0 ? wallSpeed : -wallSpeed));
                }
            }
        }

        if (patternIndex >= 600 && battleOverlay.style.backgroundColor !== 'rgba(0, 0, 0, 1)') {
             battleOverlay.style.backgroundColor = 'rgba(0, 0, 0, 1)';
        }

        patternIndex++;
    };


    // Boss Movement Logic (Remains similar to previous version)
    const updateBossPosition = (timeFactor) => {
        const W = window.innerWidth;
        const H = window.innerHeight;

        let targetX = W / 2;
        let targetY = H / 2;
        let radiusX = 150;
        let radiusY = 150;
        let speed = 0.3; // Velocidad inicial lenta

        // --- PHASE 3+ MOVEMENT: Oscilación Oval Rápida y Amplia ---
        if (patternIndex >= FASE_3_START_BEAT) {
            radiusX = 180; // Radio ligeramente menor
            radiusY = 180;
            speed = 0.6; // Velocidad aumentada (Nerfed de 0.8)
        }

        // Movimiento de Oscilación Oval Rítmico
        bossX = targetX + Math.cos(timeFactor * speed * Math.PI * 2) * radiusX;
        bossY = targetY + Math.sin(timeFactor * speed * Math.PI * 2) * radiusY;

        // Limitar la posición (opcional)
        bossX = Math.max(W * 0.1, Math.min(bossX, W * 0.9));
        bossY = Math.max(H * 0.1, Math.min(bossY, H * 0.9));


        if (bossSpriteContainer) {
            bossSpriteContainer.style.left = `${bossX}px`;
            bossSpriteContainer.style.top = `${bossY}px`;
        }
    };


    // Game Loop (RAF)
    const updateGame = () => {
        if (!isBattleActive || currentTurn === 'GAMEOVER') {
            animationFrameId = null;
            return;
        }

        const elapsedTime = Date.now() - battleStartTime;
        const progress = Math.min(1, elapsedTime / BATTLE_DURATION_MS);
        const timeFactor = elapsedTime / 1000;

        if (elapsedTime >= BATTLE_DURATION_MS) {
             handleWinCondition();
             return;
        }

        bossCurrentHP = BOSS_MAX_HP - Math.round(BOSS_MAX_HP * progress);
        updateBossHUD();

        // --- BOSS ANIMATION LOGIC (Nerfed intensity) ---
        if (bossImg) {
            const time = Date.now();

            const RHYTHMIC_PULSE_MS_ANIM = 150;
            const NOISE_FREQ_MS = 50;
            const SLOW_ROTATION_MS = 2500;

            let intensity = 1.0;
            if (progress >= 0.33 && progress < 0.66) {
                intensity = 1.5; // Nerfed from 1.7
            } else if (progress >= 0.66) {
                intensity = 2.0; // Nerfed from 2.8
            }

            const pulseAmp = 0.08 * intensity;
            const baseScale = 1.25;
            const beatTime = time % RHYTHMIC_PULSE_MS_ANIM;
            let scaleOffset = 0;

            if (beatTime < RHYTHMIC_PULSE_MS_ANIM * 0.2) {
                scaleOffset = beatTime / (RHYTHMIC_PULSE_MS_ANIM * 0.2) * pulseAmp;
            } else if (beatTime < RHYTHMIC_PULSE_MS_ANIM * 0.5) {
                scaleOffset = pulseAmp - ((beatTime - RHYTHMIC_PULSE_MS_ANIM * 0.2) / (RHYTHMIC_PULSE_MS_ANIM * 0.3)) * pulseAmp;
            }

            const rhythmicScale = baseScale + scaleOffset * intensity * 1.5;

            const rotAmp = 10 * intensity;
            const finalRotation = Math.sin(time / SLOW_ROTATION_MS) * rotAmp;

            const noiseAmp = 0.01 * intensity * 0.5;
            const noise = Math.sin(time / NOISE_FREQ_MS) * noiseAmp;

            const finalScale = rhythmicScale + noise;

            bossSpriteContainer.style.setProperty('--boss-scale', `${finalScale}`);
            bossSpriteContainer.style.setProperty('--boss-rot', `${finalRotation}deg`);

            bossSpriteContainer.style.transform = `
                translate(-50%, -50%)
                scale(${finalScale})
                rotate(${finalRotation}deg)
            `;
        }
        // --- END BOSS ANIMATION LOGIC ---

        updateBossPosition(timeFactor);

        const progressFill = document.getElementById('jsab-progress-fill');
        if (progressFill) {
            progressFill.style.width = `${progress * 100}%`;
        }

        for (let i = bullets.length - 1; i >= 0; i--) {
            const b = bullets[i];
            b.x += b.vx;
            b.y += b.vy;
            b.element.style.transform = `translate(${b.x}px, ${b.y}px)`;
        }
        updateSoulPosition();
        checkCollision();

        animationFrameId = requestAnimationFrame(updateGame);
    };

    // --- VI. UI UPDATES (MINIMALIST) ---
    const updateBossHUD = () => {
        const fill = document.getElementById('ut-boss-hp-fill');
        const name = document.getElementById('ut-boss-name');

        if (fill) {
            const percent = (bossCurrentHP / BOSS_MAX_HP) * 100;
            fill.style.width = `${percent}%`;
            fill.style.backgroundColor = percent < 25 ? 'red' : (percent < 50 ? 'orange' : 'yellow');
        }
        if (name) {
            name.textContent = `${BOSS_NAME} (${Math.round(bossCurrentHP * 100 / BOSS_MAX_HP)}%)`;
        }
    };

    const updateHUD = () => {
        const fill = document.getElementById('ut-hp-bar-fill');
        const text = document.getElementById('ut-hp-text');
        if (fill) {
            const percentage = (currentHP / MAX_HP) * 100;
            fill.style.width = `${percentage}%`;
        }
        if (text) {
            text.textContent = `${currentHP} / ${MAX_HP}`;
        }
    };

    const handleWinCondition = () => {
        if (!isBattleActive || currentTurn === 'PLAYER') return;

        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        if (bulletInterval) clearInterval(bulletInterval);
        if (enemyTurnTimer) clearTimeout(enemyTurnTimer);

        stopMusic();
        playSFX(SOUND_YOU_WIN);
        currentTurn = 'PLAYER';

        battleOverlay.style.backgroundColor = 'rgba(255, 255, 255, 1)';
        const trackCompletedText = document.createElement('h1');
        trackCompletedText.textContent = "LEVEL CLEARED";
        trackCompletedText.style.color = PLAYER_COLOR;
        trackCompletedText.style.fontSize = '32px';
        trackCompletedText.style.position = 'fixed';
        trackCompletedText.style.top = '50%';
        trackCompletedText.style.left = '50%';
        trackCompletedText.style.transform = 'translate(-50%, -50%)';
        battleOverlay.appendChild(trackCompletedText);

        document.getElementById('ut-soul').style.display = 'none';
        document.getElementById('ut-toriel-img').style.display = 'none';

        setTimeout(closeBattleUI, 4000);
    }

    // --- VII. BUTTON HANDLERS (Remains the same) ---
    const handleQuit = () => {
        setDialogue("Returning to Drawaria...");
        setTimeout(closeBattleUI, 500);
    };

    const attachButtonListeners = () => {
        const quitBtn = document.getElementById('quit-btn');
        if (quitBtn) {
            quitBtn.onclick = () => { playSFX(SOUND_SELECT); handleQuit(); };
        }
    };

    // --- VIII. AUDIO AND GAMEOVER LOGIC (Remains the same) ---

    const playMusic = () => {
        stopMusic();
        musicPlayer = new Audio();
        musicPlayer.loop = true;
        musicPlayer.volume = 0.5;

        return getLocalUrl(JSAB_MUSIC_URL)
            .then(url => {
                musicPlayer.src = url;
                musicPlayer.play().catch(e => console.warn("Error playing battle music (Autoplay may be blocked).", e));
            })
            .catch(e => {
                console.error("Failed to load battle music. Starting game loop without music.", e);
            });
    };

    const stopMusic = () => {
        if (musicPlayer) { musicPlayer.pause(); musicPlayer.currentTime = 0; }
        if (gameoverPlayer) { gameoverPlayer.pause(); gameoverPlayer.currentTime = 0; }
    };

    const setDialogue = (text) => {
        console.log("JSAB State Change:", text);
    };

    const handleGameOverKey = (e) => {
        const yesBtn = document.getElementById('go-yes-btn');
        const noBtn = document.getElementById('go-no-btn');
        if (!yesBtn || !noBtn || currentTurn !== 'GAMEOVER') return;

        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            playSFX(SOUND_SELECT);
            const isYesSelected = yesBtn.classList.contains('selected');
            yesBtn.classList.toggle('selected', !isYesSelected);
            noBtn.classList.toggle('selected', isYesSelected);
            e.preventDefault();
        } else if (e.key === 'Enter' || e.key === 'z' || e.key === 'Z') {
            if (yesBtn.classList.contains('selected')) {
                handleContinueYes();
            } else {
                handleContinueNo();
            }
        }
    };

    const showGameOverScreen = () => {
        const screenHTML = `
            <div id="ut-gameover-screen" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; font-size: 32px; line-height: 1.5; pointer-events: auto; background-color: rgba(0, 0, 0, 0.9);">
                <span class="gameover-text" style="color: ${CORRUPTION_COLOR};">GAME</span>
                <span class="gameover-text" style="color: ${CORRUPTION_COLOR};">OVER</span>
                <span style="margin-bottom: 20px;">RETRY?</span>
                <span class="gameover-option selected" id="go-yes-btn" style="color: yellow;">- YES</span>
                <span class="gameover-option" id="go-no-btn">No (Quit)</span>
            </div>
        `;

        battleOverlay.insertAdjacentHTML('beforeend', screenHTML);
        document.getElementById('go-yes-btn').onclick = handleContinueYes;
        document.getElementById('go-no-btn').onclick = handleContinueNo;
        window.addEventListener('keydown', handleGameOverKey);
    };

    const handleGameOver = () => {
        if (currentTurn === 'GAMEOVER') return;

        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        if (bulletInterval) clearInterval(bulletInterval);
        if (enemyTurnTimer) clearTimeout(enemyTurnTimer);

        bullets.forEach(b => b.element.remove());
        bullets.length = 0;

        document.getElementById('ut-hud').style.display = 'none';
        document.getElementById('ut-menu').style.display = 'none';
        document.getElementById('jsab-progress-bar').style.display = 'none';
        document.getElementById('ut-soul').style.display = 'none';
        document.getElementById('ut-boss-sprite-container').style.display = 'none';
        battleOverlay.style.backgroundColor = 'rgba(0, 0, 0, 1)';

        stopMusic();
        currentTurn = 'GAMEOVER';

        gameoverPlayer = new Audio();
        getLocalUrl(GAMEOVER_MUSIC_URL)
            .then(url => {
                gameoverPlayer.src = url;
                gameoverPlayer.play().catch(e => console.warn("Error playing Game Over music:", e));
            })
            .catch(e => {
                gameoverPlayer.src = GAMEOVER_MUSIC_URL;
            });

        showGameOverScreen();
    };

    const startGameLoop = () => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        if (bulletInterval) clearInterval(bulletInterval);
        if (enemyTurnTimer) clearTimeout(enemyTurnTimer);

        currentTurn = 'ENEMY';
        patternIndex = 0;
        isInvincible = false;

        const battleBox = document.getElementById('ut-battle-box-container');
        if (battleBox) battleBox.style.pointerEvents = 'auto';

        console.log("Paso 2: Bucle Rítmico y RAF Iniciados. (Barracuda Normal)");

        battleStartTime = Date.now();
        bulletInterval = setInterval(spawnRhythmicBullet, RHYTHM_PULSE_MS);
        enemyTurnTimer = setTimeout(handleWinCondition, BATTLE_DURATION_MS);
        animationFrameId = requestAnimationFrame(updateGame);
    };

    const handleContinueYes = () => {
        stopMusic();
        window.removeEventListener('keydown', handleGameOverKey);
        const goScreen = document.getElementById('ut-gameover-screen');
        if(goScreen) goScreen.remove();

        document.getElementById('ut-hud').style.display = 'flex';
        document.getElementById('ut-menu').style.display = 'block';
        document.getElementById('jsab-progress-bar').style.display = 'block';
        document.getElementById('ut-soul').style.display = 'block';
        document.getElementById('ut-boss-sprite-container').style.display = 'block';
        battleOverlay.style.backgroundColor = 'rgba(0, 0, 0, 1)';

        currentHP = MAX_HP;
        bossCurrentHP = BOSS_MAX_HP;

        // Resetear posición de jugador y jefe
        soulX = (window.innerWidth / 2) - (SOUL_SIZE / 2);
        soulY = (window.innerHeight / 2) - (SOUL_SIZE / 2);
        const soulEl = document.getElementById('ut-soul');
        if(soulEl) soulEl.style.transform = `translate(${soulX}px, ${soulY}px)`;

        bossX = window.innerWidth / 2;
        bossY = window.innerHeight / 2;
        if(bossSpriteContainer) {
            bossSpriteContainer.style.left = `${bossX}px`;
            bossSpriteContainer.style.top = `${bossY}px`;
        }

        updateHUD();
        updateBossHUD();

        openLoadingScreen();
        playMusic()
            .then(() => {
                closeLoadingScreen();
                setDialogue("DODGE! (Retry - Barracuda Normal)");
                startGameLoop();
            })
            .catch(e => setDialogue("Error starting battle."));
    };

    const handleContinueNo = () => {
        stopMusic();
        closeBattleUI();
    };

    // NUEVO: Funciones para manejar la pantalla de carga
    let loadingScreen = null;

    function openLoadingScreen() {
        if (loadingScreen) return;
        loadingScreen = document.createElement('div');
        loadingScreen.id = 'jsab-loading-screen';
        loadingScreen.innerHTML = `
            <img src="${LOADING_SCREEN_URL}" alt="Loading Screen">
            <div id="jsab-loading-text">LOADING BARRACUDA ASSETS...</div>
        `;
        document.body.appendChild(loadingScreen);
    }

    function closeLoadingScreen() {
        if (loadingScreen) {
            loadingScreen.remove();
            loadingScreen = null;
        }
    }


    // --- IX. INITIALIZATION AND CLEANUP ---
    function injectCSS() {
        const style = document.createElement('style');
        style.textContent = UT_CSS;
        style.id = 'ut-battle-style';
        document.head.appendChild(style);
    }
    function removeCSS() {
        const style = document.getElementById('ut-battle-style');
        if (style) style.remove();
    }

    function openBattleUI() {
        if (isBattleActive) return;

        isBattleActive = true;
        currentHP = MAX_HP;
        bossCurrentHP = BOSS_MAX_HP;

        injectCSS();
        openLoadingScreen();

        battleOverlay = document.createElement('div');
        battleOverlay.id = 'ut-battle-overlay';
        battleOverlay.innerHTML = UT_HTML;
        document.body.appendChild(battleOverlay);

        bossSpriteContainer = document.getElementById('ut-boss-sprite-container');
        bossImg = document.getElementById('ut-toriel-img');

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        attachButtonListeners();

        // Cargar imagen del jefe
        getLocalUrl(SPRITE_BOSS)
            .then(url => {
                if(bossImg) bossImg.src = url;
            });

        // Initial positions (Player and Boss)
        soulX = (window.innerWidth / 2) - (SOUL_SIZE / 2);
        soulY = (window.innerHeight / 2) - (SOUL_SIZE / 2);
        const soulEl = document.getElementById('ut-soul');
        if(soulEl) soulEl.style.transform = `translate(${soulX}px, ${soulY}px)`;

        bossX = window.innerWidth / 2;
        bossY = window.innerHeight / 2;
        if(bossSpriteContainer) {
            bossSpriteContainer.style.left = `${bossX}px`;
            bossSpriteContainer.style.top = `${bossY}px`;
        }


        console.log("Paso 1: Iniciando Batalla (Cargando Audio de Barracuda...)");
        playMusic()
            .then(() => {
                closeLoadingScreen();
                updateHUD();
                updateBossHUD();
                setDialogue("JSAB Barracuda Battle Activated. DODGE!");
                startGameLoop();
            })
            .catch(e => {
                closeLoadingScreen();
                console.error("Failed to start JSAB Battle. Check console.", e);
                setDialogue("Error starting battle! Check console (F12).");
            });

        console.log("JSAB Barracuda Battle UI ACTIVATED (Normal Mode).");
    }

    function closeBattleUI() {
        if (!isBattleActive) return;

        stopMusic();
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        if (bulletInterval) clearInterval(bulletInterval);
        if (enemyTurnTimer) clearTimeout(enemyTurnTimer);

        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        window.removeEventListener('keydown', handleGameOverKey);

        closeLoadingScreen();
        if (battleOverlay) battleOverlay.remove();
        removeCSS();

        isBattleActive = false;
        bullets.length = 0;
        keys = {};

        console.log("JSAB Barracuda Battle UI DEACTIVATED.");
    }

    // --- X. TAMPERMONKEY MENU COMMAND REGISTRATION ---
    if (typeof GM_registerMenuCommand !== 'undefined') {
        GM_registerMenuCommand("🐍Open Barracuda Boss", openBattleUI);
        GM_registerMenuCommand("❌Close Barracuda Boss", closeBattleUI);
    }
})();