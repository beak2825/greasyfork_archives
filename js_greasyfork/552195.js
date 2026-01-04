// ==UserScript==
// @name         Drawaria Warrior Legends RPG Boss Battle
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Modular Boss Battle System with 6 fully functional Bosses. Starts from the Tampermonkey menu. Includes a 100% reliable AUTO-BATTLE/IDLE mode.
// @author       YouTubeDrawaria
// @include	     https://drawaria.online/*
// @include	     https://*.drawaria.online/*
// @include      https://drawaria.online*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online/room/
// @connect      i.ibb.co
// @connect      drawaria.online
// @connect      png.pngtree.com
// @connect      www.myinstants.com
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/552195/Drawaria%20Warrior%20Legends%20RPG%20Boss%20Battle.user.js
// @updateURL https://update.greasyfork.org/scripts/552195/Drawaria%20Warrior%20Legends%20RPG%20Boss%20Battle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- I. CONFIGURATION & GLOBAL STATE ---

    // Game Constants
    const BATTLE_DURATION_MS = 6000;
    const MERCY_THRESHOLD = 5;
    const BOX_SIZE = 200;
    const SOUL_SIZE = 25;
    const BAR_WIDTH = 180;
    const RHYTHM_PULSE_MS = 75;

    // ASSETS (URLs)
    const SPRITE_SOUL_ICON = 'https://png.pngtree.com/png-vector/20230407/ourmid/pngtree-gmaing-star-clipart-vector-png-image_6667802.png';

    // SFX (Direct URLs)
    const SOUND_DAMAGE = 'https://www.myinstants.com/media/sounds/undertale-damage-taken.mp3';
    const SOUND_ATTACK = 'https://www.myinstants.com/media/sounds/undertale-attack-slash-green-screen.mp3';
    const SOUND_SELECT = 'https://www.myinstants.com/media/sounds/undertale-select-sound.mp3';
    const SOUND_YOU_WIN = 'https://www.myinstants.com/media/sounds/undertale-sound-effect-you-win.mp3';
    const GAMEOVER_MUSIC_URL = 'https://www.myinstants.com/media/sounds/undertale-game-over.mp3';

    // --- II. BOSS DATA (MODULARIZED) ---

    const BOSS_DATA = {
        "Rubina": {
            name: "Rubina",
            spriteURL: "https://i.ibb.co/1t189GVk/image.png",
            musicURL: "https://www.myinstants.com/media/sounds/feel-good-ncs-syn-cole.mp3",
            maxHP: 100,
            checkText: "RUBINA - ATK 15, DEF 5. Quick fire warrior. Attacks are based on Flint's radial patterns.",
            color: "#FF5733",
            attackPatternFunc: "spawnFlintPattern"
        },
        "Hydorus": {
            name: "Hydorus",
            spriteURL: "https://drawaria.online/avatar/cache/0ae1d270-0d15-11ee-b951-ffe73ac3abcf.jpg",
            musicURL: "https://www.myinstants.com/media/sounds/random-mp3.mp3",
            maxHP: 120,
            checkText: "HYDORUS - ATK 10, DEF 10. Water mage. Attacks involve massive walls and sine waves.",
            color: "#33FFF6",
            attackPatternFunc: "spawnSallyPattern"
        },
        "Zeno": {
            name: "Zeno",
            spriteURL: "https://i.ibb.co/dJKqYg2N/image.png",
            musicURL: "https://www.myinstants.com/media/sounds/sky-high-elektronomia.mp3",
            maxHP: 90,
            checkText: "ZENO - ATK 18, DEF 3. Electric demon. Uses homing missiles and chaotic pursuit.",
            color: "#FFDD33",
            attackPatternFunc: "spawnEmberPattern"
        },
        "Simon": {
            name: "Simon",
            spriteURL: "https://i.ibb.co/YFcCDnsX/image.png",
            musicURL: "https://www.myinstants.com/media/sounds/retrovision-heroes-ncs-release_intro_w6PQD3o.mp3",
            maxHP: 110,
            checkText: "SIMON - ATK 12, DEF 8. Beat master. Attacks are rhythmic spirals, based on Flanny's patterns.",
            color: "#FF33A1",
            attackPatternFunc: "spawnFlannyPattern"
        },
        "Flora": {
            name: "Flora",
            spriteURL: "https://i.ibb.co/21t52KCY/image.png",
            musicURL: "https://www.myinstants.com/media/sounds/tmpx4lciw9e.mp3",
            maxHP: 150,
            checkText: "FLORA - ATK 5, DEF 20. Nature protector. Focuses on static, area-denial hazards.",
            color: "#33FF57",
            attackPatternFunc: "spawnCoralPattern"
        },
        "Tobias": {
            name: "Tobias",
            spriteURL: "https://i.ibb.co/bgx6HSXf/image.png",
            musicURL: "https://www.myinstants.com/media/sounds/debris-jonth-game-time-ncs-release-mp3cut.mp3",
            maxHP: 130,
            checkText: "TOBIAS - ATK 20, DEF 0. Physical brute. Uses mirror attacks and reflected projectiles.",
            color: "#800080",
            attackPatternFunc: "spawnAshPattern"
        }
    };

    // STATE VARIABLES
    let battleOverlay = null;
    let isBattleActive = false;
    let animationFrameId = null;
    let bulletInterval = null;
    let enemyTurnTimer = null;
    let musicPlayer = null;
    let gameoverPlayer = null;
    let ambientParticlesContainer = null;
    let currentBossData = null;

    let currentTurn = 'PLAYER';
    let mercyCounter = 0;
    let currentHP = 50;
    const MAX_HP = 50;
    let bossCurrentHP = 0;
    let isInvincible = false;
    let dialogueIndex = 0;
    let isAutoMode = GM_getValue('autoMode', false); // Start with saved state

    let keys = {};
    let soulX = 0;
    let soulY = 0;
    const soulSpeed = 3;
    let bullets = [];

    let cursorX = 0;
    let cursorSpeed = 5;
    let isAttacking = false;
    let gameoverSelection = 'yes';
    let patternIndex = 0;
    let lastUpdateTime = 0;

    // --- III. UTILITY FUNCTIONS (CORS BYPASS & SFX) ---

    // CORS Bypass Utility (GM_xmlhttpRequest)
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

    // SFX Player
    const playSFX = (soundType) => {
        let url;
        switch(soundType) {
            case 'damage': url = SOUND_DAMAGE; break;
            case 'attack': url = SOUND_ATTACK; break;
            case 'select': url = SOUND_SELECT; break;
            case 'win': url = SOUND_YOU_WIN; break;
            case 'gameover': url = GAMEOVER_MUSIC_URL; break;
            default: return;
        }

        try {
            const audio = new Audio(url);
            audio.volume = 0.5;
            audio.play().catch(e => console.warn(`Error playing SFX (${soundType}):`, e));
            if(soundType === 'gameover') gameoverPlayer = audio;
        } catch (e) {
            console.warn("Could not create SFX audio object:", e);
        }
    };

    // Music Player (Uses getLocalUrl for CORS)
    const playMusic = (url) => {
        stopMusic();
        musicPlayer = new Audio();

        getLocalUrl(url)
            .then(localUrl => {
                musicPlayer.src = localUrl;
                musicPlayer.loop = true;
                musicPlayer.volume = 0.4;
                musicPlayer.play().catch(e => console.warn("Error playing battle music:", e));
            })
            .catch(e => {
                console.error("Failed to load battle music via CORS bypass.", e);
                musicPlayer.src = url;
                musicPlayer.loop = true;
                musicPlayer.volume = 0.4;
                musicPlayer.play().catch(e => console.warn("Error playing fallback music:", e));
            });
    };

    const stopMusic = () => {
        if (musicPlayer) { musicPlayer.pause(); musicPlayer.currentTime = 0; }
        if (gameoverPlayer) { gameoverPlayer.pause(); gameoverPlayer.currentTime = 0; gameoverPlayer = null; }
    };

    // Visual Effects
    const applyVisualEffect = (type) => {
         const container = document.getElementById('ut-battle-box-container');
         if (type === 'shake' && container) {
             container.classList.add('screen-shake-active');
             setTimeout(() => container.classList.remove('screen-shake-active'), 150);
         }
    };

    // --- IV. JSAB ATTACK PATTERNS (The modular functions & Map) ---

    const PHASE_DURATION = 150;
    const getPhase = (beat) => Math.floor(beat / PHASE_DURATION);
    const getBoxCenter = () => {
         const W = BOX_SIZE; const H = BOX_SIZE;
         const BOSS_X = W / 2; const BOSS_Y = H / 2;
         return { W, H, BOSS_X, BOSS_Y };
    }
    const getRandomAngle = () => Math.random() * 2 * Math.PI;

    // Bullet Spawners
    const createBullet = (x, y, vx, vy, width = 10, height = 10, className = 'circle', isPersistent = false) => {
        const box = document.getElementById('ut-battle-box-container');
        if (!box) return;

        const b = {
            element: document.createElement('div'),
            x: x - width / 2, y: y - height / 2,
            vx: vx, vy: vy,
            width: width, height: height, isPersistent: isPersistent,
            r: Math.max(width, height) / 2,
        };
        b.element.className = 'ut-bullet ' + className;
        b.element.style.width = `${b.width}px`;
        b.element.style.height = `${b.height}px`;
        b.element.style.transform = `translate(${b.x}px, ${b.y}px)`;
        b.element.style.setProperty('--bullet-color', currentBossData.color);

        box.appendChild(b.element);
        bullets.push(b);
        return b;
    };

    const createWallBullet = (x, y, w, h, vx, vy) => {
        const centerX = x + w / 2;
        const centerY = y + h / 2;
        return createBullet(centerX, centerY, vx, vy, w, h, 'bar', true);
    };

    function spawnAmbientParticles() {
        if (!ambientParticlesContainer) return;
        ambientParticlesContainer.innerHTML = '';
        const ambientColor = currentBossData.color;
        const particleCount = 20;
        const W = BOX_SIZE; const H = BOX_SIZE;

        for (let i = 0; i < particleCount; i++) {
            const p = document.createElement('div');
            p.classList.add('ambient-particle');
            p.style.setProperty('--ambient-color', ambientColor);
            p.style.left = `${Math.random() * W}px`;
            p.style.top = `${Math.random() * H}px`;
            p.style.width = `${5 + Math.random() * 10}px`;
            p.style.height = p.style.width;
            p.style.animationDelay = `-${Math.random() * 5}s`;
            p.style.setProperty('--duration', `${5 + Math.random() * 5}s`);
            p.style.transform = `translate(0, ${Math.random() * H}px)`;
            if (currentBossData.name === "Rubina") { p.style.borderRadius = '0'; }
            ambientParticlesContainer.appendChild(p);
        }
    }

    // --- Attack Patterns (Logic is kept identical) ---
    function spawnFlintPattern(beat) {
         const { W, H, BOSS_X, BOSS_Y } = getBoxCenter();
         const speed = 4.0;
         const phase = getPhase(beat);
         const phaseBeat = beat % 150;
         if (phase === 0) {
             if (phaseBeat % 15 === 0) {
                 applyVisualEffect('shake');
                 const baseAngle = beat * 0.1;
                 for (let i = 0; i < 10; i++) {
                     const angle = baseAngle + i * (Math.PI / 5);
                     createBullet(BOSS_X, BOSS_Y, speed * Math.cos(angle), speed * Math.sin(angle), 10, 10, 'circle');
                 }
             }
         } else if (phase === 1) {
             if (phaseBeat % 10 === 0) {
                 const numBullets = 8;
                 const currentSpeed = 3.0;
                 const offset = (phaseBeat % 20 === 0) ? 0 : Math.PI / 8;
                 for (let i = 0; i < numBullets; i++) {
                     const angle = i * (2 * Math.PI / numBullets) + offset;
                     createBullet(BOSS_X, BOSS_Y, currentSpeed * Math.cos(angle), currentSpeed * Math.sin(angle), 12, 12, 'spiky');
                 }
             }
         } else {
             if (phaseBeat % 7 === 0) {
                const speed = 5.0;
                const angle = getRandomAngle();
                createBullet(BOSS_X, BOSS_Y, speed * Math.cos(angle), speed * Math.sin(angle), 15, 15, 'spiky', false);
             }
         }
    }

    function spawnSallyPattern(beat) {
        const { W, H, BOSS_X, BOSS_Y } = getBoxCenter();
        const wallSpeed = 2.0;
        const phase = getPhase(beat);
        const phaseBeat = beat % 150;
        const wallThickness = 15;
        if (phase === 0) {
            if (phaseBeat % 30 === 0) {
                 const gapSize = 50;
                 const gapYCenter = H * 0.2 + (phaseBeat * 0.05) % (H * 0.6);
                 const travelVx = 0;
                 const travelVy = wallSpeed * 0.5;
                 createWallBullet(0, 0, W, gapYCenter - gapSize / 2, travelVx, travelVy);
                 createWallBullet(0, gapYCenter + gapSize / 2, W, H - (gapYCenter + gapSize / 2), travelVx, travelVy);
            }
        } else if (phase === 1) {
             if (phaseBeat % 12 === 0) {
                 const numBullets = 8;
                 for (let i = 0; i < numBullets; i++) {
                     const angle = i * (2 * Math.PI / numBullets);
                     const vx = wallSpeed * Math.cos(angle);
                     const vy = wallSpeed * Math.sin(angle) + Math.sin(beat * 0.1) * 1.5;
                     createBullet(BOSS_X, BOSS_Y, vx, vy, 12, 12, 'circle');
                 }
             }
        } else {
             if (phaseBeat % 20 === 0) {
                 const travelVx = 3.0;
                 const gapSize = 50;
                 const side = phaseBeat % 40 === 0 ? 0 : W - wallThickness;
                 createWallBullet(side, 0, wallThickness, H/2 - gapSize/2, side === 0 ? travelVx : -travelVx, 0);
                 createWallBullet(side, H/2 + gapSize/2, wallThickness, H/2 - gapSize/2, side === 0 ? travelVx : -travelVx, 0);
             }
        }
    }

    function spawnEmberPattern(beat) {
        const { W, H, BOSS_X, BOSS_Y } = getBoxCenter();
        const phase = getPhase(beat);
        const phaseBeat = beat % 150;
        if (phase === 0) {
             if (phaseBeat % 8 === 0) {
                applyVisualEffect('shake');
                const HOMING_SPEED = 4.0;
                const angle = getRandomAngle();
                const homingBullet = createBullet(BOSS_X, BOSS_Y, HOMING_SPEED * Math.cos(angle), HOMING_SPEED * Math.sin(angle), 20, 20, 'spiky', false);
                let trailCounter = 0;
                const trailInterval = setInterval(() => {
                    if (trailCounter >= 4 || homingBullet.element.isConnected === false) { clearInterval(trailInterval); return; }
                    const trailBullet = createBullet(homingBullet.x + homingBullet.width/2, homingBullet.y + homingBullet.height/2, 0, 0, 8, 8, 'circle', true);
                    trailBullet.element.style.opacity = 0.5;
                    setTimeout(() => trailBullet.element.remove(), 750);
                    trailCounter++;
                }, RHYTHM_PULSE_MS * 2);
             }
        } else if (phase === 1) {
            if (phaseBeat % 25 === 0) {
                const speed = 3;
                const directions = [{vx: speed, vy: speed}, {vx: -speed, vy: speed}, {vx: speed, vy: -speed}, {vx: -speed, vy: -speed}];
                directions.forEach(dir => {
                     const projectile = createBullet(W/2, H/2, dir.vx, dir.vy, 15, 15, 'spiky', false);
                     setTimeout(() => {
                         if(projectile.element.isConnected) {
                             projectile.vx = 0; projectile.vy = 0; projectile.isPersistent = true;
                             projectile.element.style.opacity = 0.8;
                             setTimeout(() => projectile.element.remove(), 1200);
                         }
                     }, 500);
                });
            }
        } else {
             if (phaseBeat % 10 === 0) {
                 const numBullets = 16;
                 const currentSpeed = 5.0;
                 for (let i = 0; i < numBullets; i++) {
                     const angle = i * (2 * Math.PI / numBullets) + beat * 0.05;
                     createBullet(BOSS_X, BOSS_Y, currentSpeed * Math.cos(angle), currentSpeed * Math.sin(angle), 12, 12, 'spiky');
                 }
             }
        }
    }

    function spawnFlannyPattern(beat) {
        const { W, H, BOSS_X, BOSS_Y } = getBoxCenter();
        const speed = 4.0;
        const phase = getPhase(beat);
        const phaseBeat = beat % 150;
        if (phase === 0) {
             if (phaseBeat % 15 === 0) {
                 applyVisualEffect('shake');
                 const numBullets = 8;
                 const rotation = beat * 0.05;
                 for (let i = 0; i < numBullets; i++) {
                     const angle = i * (2 * Math.PI / numBullets) + rotation;
                     createBullet(BOSS_X, BOSS_Y, speed * Math.cos(angle), speed * Math.sin(angle), 12, 12, 'circle');
                 }
             }
        } else if (phase === 1) {
             if (phaseBeat % 15 === 0) {
                 const barWidth = 15;
                 const barHeight = H * 0.8;
                 const travelSpeed = 3.5;
                 const side = phaseBeat % 30 === 0 ? 0 : W - barWidth;
                 createWallBullet(side, H * 0.1, barWidth, barHeight, side === 0 ? travelSpeed : -travelSpeed, 0);
                 for(let i = 0; i < 3; i++) {
                     const x = side + (side === 0 ? barWidth : -barWidth);
                     const y = H/2 + Math.cos(beat * 0.1 + i) * H * 0.3;
                     createBullet(x, y, (side === 0 ? 1 : -1) * travelSpeed * 0.8, 0, 8, 8, 'circle', false);
                 }
             }
        } else {
             if (phaseBeat % 10 === 0) {
                  const numBullets = 6;
                  for(let i = 0; i < numBullets; i++) {
                      const angle = i * (2 * Math.PI / numBullets);
                      const bullet = createBullet(BOSS_X, BOSS_Y, speed * Math.cos(angle), speed * Math.sin(angle), 15, 15, 'spiky');
                      setTimeout(() => { if(bullet.element.isConnected) { bullet.vx *= 0.5; bullet.vy *= 0.5; } }, 300);
                  }
             }
        }
    }

    function spawnCoralPattern(beat) {
        const { W, H, BOSS_X, BOSS_Y } = getBoxCenter();
        const speed = 3.0;
        const phase = getPhase(beat);
        const phaseBeat = beat % 150;
        if (phase === 0) {
            if (phaseBeat % 30 === 0) {
                const wallThickness = 40;
                const gapSize = 50;
                const wallXLeft = W * 0.2;
                const gapYCenter = H * 0.3 + Math.random() * (H * 0.4);
                const wallA = createWallBullet(wallXLeft, 0, wallThickness, Math.max(0, gapYCenter - gapSize / 2), 0, 0);
                const wallB = createWallBullet(wallXLeft, Math.min(H, gapYCenter + gapSize / 2), wallThickness, H - (gapYCenter + gapSize / 2), 0, 0);
                setTimeout(() => {
                     if(wallA.element.isConnected) wallA.element.remove();
                     if(wallB.element.isConnected) wallB.element.remove();
                }, 1500);
            }
        } else if (phase === 1) {
            if (phaseBeat % 10 === 0) {
                applyVisualEffect('shake');
                const HOMING_SPEED = 3.0;
                const angle = getRandomAngle();
                const homingBullet = createBullet(BOSS_X, BOSS_Y, HOMING_SPEED * Math.cos(angle), HOMING_SPEED * Math.sin(angle), 15, 15, 'circle', false);
                let trailCounter = 0;
                const trailInterval = setInterval(() => {
                    if (trailCounter >= 3 || homingBullet.element.isConnected === false) { clearInterval(trailInterval); return; }
                    const trailBullet = createBullet(homingBullet.x + homingBullet.width/2, homingBullet.y + homingBullet.height/2, 0, 0, 8, 8, 'circle', true);
                    setTimeout(() => trailBullet.element.remove(), 800);
                    trailCounter++;
                }, RHYTHM_PULSE_MS * 4);
            }
        } else {
             if (phaseBeat % 10 === 0) {
                 const numBullets = 10;
                 const currentSpeed = 4.0;
                 for (let i = 0; i < numBullets; i++) {
                     const angle = i * (2 * Math.PI / numBullets) + beat * 0.1;
                     createBullet(BOSS_X, BOSS_Y, currentSpeed * Math.cos(angle), currentSpeed * Math.sin(angle), 10, 10, 'circle');
                 }
             }
        }
    }

    function spawnAshPattern(beat) {
        const { W, H, BOSS_X, BOSS_Y } = getBoxCenter();
        const speed = 3.5;
        const phase = getPhase(beat);
        const phaseBeat = beat % 150;
        if (phase === 0) {
            if (phaseBeat % 20 === 0) {
                const numBullets = 6;
                for (let i = 0; i < numBullets; i++) {
                     const angle = i * (2 * Math.PI / numBullets);
                     createBullet(BOSS_X, BOSS_Y, speed * Math.cos(angle), speed * Math.sin(angle), 10, 10, 'circle');
                     createBullet(W - BOSS_X, BOSS_Y, -speed * Math.cos(angle), speed * Math.sin(angle), 10, 10, 'circle');
                }
            }
        } else if (phase === 1) {
            if (phaseBeat % 7 === 0) {
                applyVisualEffect('shake');
                const HOMING_SPEED = 3.5;
                const angle = getRandomAngle();
                createBullet(BOSS_X, BOSS_Y, HOMING_SPEED * Math.cos(angle), HOMING_SPEED * Math.sin(angle), 15, 15, 'spiky', false);
                const mirrorAngle = getRandomAngle();
                createBullet(W - BOSS_X, BOSS_Y, HOMING_SPEED * Math.cos(mirrorAngle), HOMING_SPEED * Math.sin(mirrorAngle), 15, 15, 'spiky', false);
            }
        } else {
             if (phaseBeat % 15 === 0) {
                 const wallThickness = 10;
                 const travelSpeed = 4.0;
                 const gapSize = 50;
                 createWallBullet(0, H/2 - wallThickness/2, W/2 - gapSize/2, wallThickness, travelSpeed, 0);
                 createWallBullet(W/2 + gapSize/2, H/2 - wallThickness/2, W/2 - gapSize/2, wallThickness, -travelSpeed, 0);
             }
        }
    }

    // MAPA DE FUNCIONES DE ATAQUE
    const ATTACK_FUNCTIONS = {
        spawnFlintPattern: spawnFlintPattern,
        spawnSallyPattern: spawnSallyPattern,
        spawnEmberPattern: spawnEmberPattern,
        spawnFlannyPattern: spawnFlannyPattern,
        spawnCoralPattern: spawnCoralPattern,
        spawnAshPattern: spawnAshPattern,
    };

    const spawnRhythmicBullet = () => {
        if (!currentBossData) return;
        const patternFunctionName = currentBossData.attackPatternFunc;
        const patternFunction = ATTACK_FUNCTIONS[patternFunctionName];
        if (patternFunction) {
            patternFunction(patternIndex);
        }
        patternIndex++;
    };

    // --- V. GAME LOOP & CORE LOGIC ---

    // Movement (Manual Mode fallback)
    const updateSoulPosition = () => {
        let dx = 0; let dy = 0;
        if (keys['ArrowUp'] || keys['w']) dy -= soulSpeed;
        if (keys['ArrowDown'] || keys['s']) dy += soulSpeed;
        if (keys['ArrowLeft'] || keys['a']) dx -= soulSpeed;
        if (keys['ArrowRight'] || keys['d']) dx += soulSpeed;
        soulX = Math.max(0, Math.min(soulX + dx, BOX_SIZE - SOUL_SIZE));
        soulY = Math.max(0, Math.min(soulY + dy, BOX_SIZE - SOUL_SIZE));
        document.getElementById('ut-soul').style.transform = `translate(${soulX}px, ${soulY}px)`;
    };

    // FIXED: Collision (Disabled in Auto Mode for 100% Evasion)
    const checkCollision = () => {
        if (isAutoMode) return; // Full invulnerability when auto-dodging

        const soul = document.getElementById('ut-soul');
        if (!soul) return;

        const sLeft = soulX; const sRight = soulX + SOUL_SIZE;
        const sTop = soulY; const sBottom = soulY + SOUL_SIZE;

        const takeDamage = (amount) => {
             if (isInvincible) return;
             currentHP = Math.max(0, currentHP - amount);
             updateHUD();
             playSFX('damage');
             applyVisualEffect('shake');

             const INVINCIBILITY_MS = 150;
             isInvincible = true; soul.style.opacity = 0.5;
             setTimeout(() => { isInvincible = false; soul.style.opacity = 1; }, INVINCIBILITY_MS);
             if (currentHP === 0) { handleGameOver(); return true; }
             return false;
        };

        for (let i = bullets.length - 1; i >= 0; i--) {
            const b = bullets[i];
            const bWidth = b.width || 10; const bHeight = b.height || 10;
            const bLeft = b.x; const bRight = b.x + bWidth;
            const bTop = b.y; const bBottom = b.y + bHeight;

            if (sLeft < bRight && sRight > bLeft && sTop < bBottom && sBottom > bTop) {
                if (takeDamage(1)) return;
                if (!b.isPersistent) { b.element.remove(); bullets.splice(i, 1); }
            }
        }
    };

    const updateGame = (timestamp) => {
        if (!isBattleActive || currentTurn === 'GAMEOVER') {
            animationFrameId = null;
            return;
        }

        if (!lastUpdateTime) lastUpdateTime = timestamp;
        const deltaTime = (timestamp - lastUpdateTime) / 1000;
        lastUpdateTime = timestamp;
        const frameTime = Math.min(deltaTime, 0.1);

        if (currentTurn === 'ENEMY') {
            for (let i = bullets.length - 1; i >= 0; i--) {
                const b = bullets[i];
                b.x += b.vx * 60 * frameTime;
                b.y += b.vy * 60 * frameTime;
                b.element.style.transform = `translate(${b.x}px, ${b.y}px)`;

                if (b.y > BOX_SIZE + 50 || b.y < -50 || b.x > BOX_SIZE + 50 || b.x < -50) {
                    if (!b.isPersistent) {
                        b.element.remove();
                        bullets.splice(i, 1);
                    }
                }
            }

            // In Auto Mode, the soul is not moved, but collision is disabled (checkCollision handles this)
            if (!isAutoMode) {
                updateSoulPosition();
                checkCollision();
            }
        }

        if (isAttacking) {
            cursorX += cursorSpeed * 60 * frameTime;
            if (cursorX > BAR_WIDTH || cursorX < 0) {
                cursorSpeed = -cursorSpeed;
                cursorX = Math.max(0, Math.min(cursorX, BAR_WIDTH));
            }
            document.getElementById('ut-cursor').style.left = `${cursorX}px`;
        }

        animationFrameId = requestAnimationFrame(updateGame);
    };

    // --- VI. UI HELPERS & TURN CONTROL ---

    const updateBossHUD = () => {
        const fill = document.getElementById('ut-boss-hp-fill');
        const nameEl = document.getElementById('ut-boss-name');

        if (fill && currentBossData) {
            const percent = (bossCurrentHP / currentBossData.maxHP) * 100;
            fill.style.width = `${percent}%`;
            fill.style.backgroundColor = percent < 25 ? 'red' : 'yellow';
        }
        if (nameEl && currentBossData) {
            nameEl.textContent = `${currentBossData.name} ${bossCurrentHP}/${currentBossData.maxHP}`;
        }
    };

    const updateHUD = () => {
        const fill = document.getElementById('ut-hp-bar-fill');
        const text = document.querySelector('#ut-hud > div:last-child > div:last-child');
        if (fill) {
            const percentage = (currentHP / MAX_HP) * 100;
            fill.style.width = `${percentage}%`;
        }
        if (text) {
            text.textContent = `${currentHP} / ${MAX_HP}`;
        }
    };

    const setDialogue = (text) => {
        const dialogBox = document.getElementById('ut-dialogue-box');
        if (dialogBox) dialogBox.textContent = text;
    };

    const enableMenu = (menuId = 'ut-menu') => {
        const menu = document.getElementById(menuId);
        if (menu) {
            menu.style.pointerEvents = 'auto';
            document.querySelectorAll(`#${menuId} .ut-menu-button`).forEach(btn => btn.classList.add('active'));
        }
    };
    const disableMenu = (menuId = 'ut-menu') => {
        const menu = document.getElementById(menuId);
        if (menu) {
            menu.style.pointerEvents = 'none';
            document.querySelectorAll(`#${menuId} .ut-menu-button`).forEach(btn => btn.classList.remove('active'));
        }
    };

    // --- AUTO MODE CORE: PLAYER TURN ---
    const startPlayerTurnAuto = () => {
        currentTurn = 'PLAYER';
        disableMenu();
        document.getElementById('ut-submenu').style.display = 'none';
        setDialogue("AUTO-MODE: Calculating next move...");

        setTimeout(() => {
            if (bossCurrentHP === 0) {
                handleWinCondition('KILL');
                return;
            }

            // 1. Prioritize Healing (if below 50%)
            if (currentHP < MAX_HP * 0.5 && currentHP < MAX_HP) {
                playSFX('select');
                handleItem();
                return;
            }

            // 2. Prioritize Mercy/Pacifist Route
            if (mercyCounter >= MERCY_THRESHOLD) {
                playSFX('select');
                handleMercy();
                return;
            }

            // 3. Build Mercy/Use ACT
            if (mercyCounter >= MERCY_THRESHOLD - 1) {
                playSFX('select');
                handleCheck();
                return;
            }

            // 4. Attack (Default/Fastest turn)
            handleFightAuto();

        }, 500); // Wait 0.5s for "decision time"
    };

    // Auto-Attack (Perfect Hit)
    const handleFightAuto = () => {
        disableMenu();
        setDialogue("AUTO-MODE: Perfect Hit activated!");
        document.getElementById('ut-attack-bar-container').style.display = 'block';

        // Force cursor to perfect hit position (90px)
        cursorX = BAR_WIDTH * 0.5;
        isAttacking = true;

        setTimeout(() => {
            isAttacking = false;

            playSFX('attack');

            let damageText = "CRITICAL HIT! (+2 Mercy)";
            let damage = 25;
            mercyCounter += 2;

            bossCurrentHP = Math.max(0, bossCurrentHP - damage);
            updateBossHUD();

            const bossImg = document.getElementById('ut-toriel-img');
            if (bossImg) {
                bossImg.classList.add('shaking');
                setTimeout(() => { bossImg.classList.remove('shaking'); }, 600);
            }

            setDialogue(`FIGHT: ${damageText} ${currentBossData.name}'s HP: ${bossCurrentHP}/${currentBossData.maxHP}`);

            document.getElementById('ut-attack-bar-container').style.display = 'none';

            if (bossCurrentHP === 0) {
                handleWinCondition('KILL');
                return;
            }

            setTimeout(startEnemyTurn, 1500);
        }, 50); // Minimal delay
    };
    // -----------------------------------


    // Turn Control
    const startEnemyTurn = () => {
        if (!currentBossData) return;
        currentTurn = 'ENEMY';
        disableMenu();
        document.getElementById('ut-submenu').style.display = 'none';

        setDialogue(`${currentBossData.name} attacks... Dodge!`);
        // Only allow pointer-events for manual mode (to capture keypresses)
        document.getElementById('ut-battle-box-container').style.pointerEvents = isAutoMode ? 'none' : 'auto';

        patternIndex = 0;
        lastUpdateTime = 0;

        if (!animationFrameId) {
             animationFrameId = requestAnimationFrame(updateGame);
        }

        bulletInterval = setInterval(spawnRhythmicBullet, RHYTHM_PULSE_MS);
        enemyTurnTimer = setTimeout(endEnemyTurn, BATTLE_DURATION_MS);
    };

    const endEnemyTurn = () => {
        if (currentTurn !== 'ENEMY' && currentTurn !== 'PLAYER' && currentTurn !== 'GAMEOVER') return;

        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        animationFrameId = null;

        if (bulletInterval) clearInterval(bulletInterval);
        bulletInterval = null;

        if (enemyTurnTimer) clearTimeout(enemyTurnTimer);
        enemyTurnTimer = null;

        document.querySelectorAll('.ut-bullet').forEach(b => b.remove());
        bullets.length = 0;
        keys = {};

        document.getElementById('ut-battle-box-container').style.pointerEvents = 'none';

        if (currentHP === 0) {
            handleGameOver();
            return;
        }

        // --- AUTO MODE INTEGRATION ---
        if (isAutoMode) {
            startPlayerTurnAuto();
        } else {
            currentTurn = 'PLAYER';
            setDialogue("What will you do?");
            enableMenu();
        }
        // ------------------------------
    };

    const handleWinCondition = (type) => {
        endEnemyTurn();
        stopMusic();
        playSFX('win');

        const finalMessage = type === 'MERCY' ?
            `${currentBossData.name} spares you. You won the battle. (PACIFIST VICTORY)` :
            `${currentBossData.name} is defeated. Your LV increases. (GENOCIDE VICTORY)`;

        setDialogue(finalMessage);

        setTimeout(closeBattleUI, 3000);
    }

    // --- VII. BUTTON HANDLERS (Manual Fallbacks) ---
    // (The functions handleFight, handleAct, handleCheck, handleTalk, handleItem, handleMercy, attachButtonListeners are necessary for Manual Mode)

    const handleFight = () => {
        disableMenu();
        setDialogue("Press Z or Enter to hit!");
        document.getElementById('ut-attack-bar-container').style.display = 'block';
        cursorX = 0;
        isAttacking = true;
        window.addEventListener('keydown', handleAttackKey, true);
        if (!animationFrameId) { animationFrameId = requestAnimationFrame(updateGame); }
    };

    const handleAct = () => {
        disableMenu();
        const submenu = document.getElementById('ut-submenu');
        submenu.innerHTML = `
            <div class="ut-menu-button" id="check-btn">🔍 Check</div>
            <div class="ut-menu-button" id="talk-btn">🗣️ Talk</div>
        `;
        submenu.style.display = 'flex';
        enableMenu('ut-submenu');

        document.getElementById('check-btn').onclick = () => { playSFX('select'); handleCheck(); };
        document.getElementById('talk-btn').onclick = () => { playSFX('select'); handleTalk(); };
    };

    const handleCheck = () => {
        setDialogue(currentBossData.checkText);
        document.getElementById('ut-submenu').style.display = 'none';
        mercyCounter++;
        setTimeout(startEnemyTurn, 1000);
    };

    const handleTalk = () => {
        const dialogues = [
            `${currentBossData.name}: Hmmph.`,
            `${currentBossData.name}: Why are you still here?`,
            `${currentBossData.name}: ... (They seem annoyed.)`
        ];
        const dialogue = dialogues[dialogueIndex % dialogues.length];
        dialogueIndex++;
        setDialogue(dialogue);
        document.getElementById('ut-submenu').style.display = 'none';
        mercyCounter++;
        setTimeout(startEnemyTurn, 1000);
    };

    const handleItem = () => {
        const HEAL_AMOUNT = 5;
        const oldHP = currentHP;
        currentHP = Math.min(currentHP + HEAL_AMOUNT, MAX_HP);
        updateHUD();
        const healed = currentHP - oldHP;
        setDialogue(`ITEM: You used a Bandage. Healed ${healed} HP.`);
        setTimeout(startEnemyTurn, 1000);
    };

    const handleMercy = () => {
        if (mercyCounter >= MERCY_THRESHOLD) {
            handleWinCondition('MERCY');
            return;
        }
        setDialogue(`Spare: ${currentBossData.name} seems less hostile. Mercy: ${mercyCounter}/${MERCY_THRESHOLD}`);
        mercyCounter++;
        setTimeout(startEnemyTurn, 1000);
    };

    const attachButtonListeners = () => {
        document.getElementById('fight-btn').onclick = () => { playSFX('select'); handleFight(); };
        document.getElementById('act-btn').onclick = () => { playSFX('select'); handleAct(); };
        document.getElementById('item-btn').onclick = () => { playSFX('select'); handleItem(); };
        document.getElementById('mercy-btn').onclick = () => { playSFX('select'); handleMercy(); };
    };

    // Input Handlers
    const handleKeyDown = (e) => {
        if (!isBattleActive) return;
        if (currentTurn === 'PLAYER' || currentTurn === 'GAMEOVER') {
            if (e.key.startsWith('Arrow') || e.key === 'Enter' || e.key === 'z' || e.key === 'Z') { playSFX('select'); }
        }
        if (currentTurn === 'ENEMY' && !isAutoMode) { keys[e.key] = true; } // Manual movement only
        if (currentTurn === 'GAMEOVER') { handleGameOverKey(e); }
    };
    const handleKeyUp = (e) => {
        if (currentTurn === 'ENEMY' && isBattleActive && !isAutoMode) { keys[e.key] = false; }
    };

    const handleAttackKey = (e) => {
        if (!isAttacking || (e.key !== 'Enter' && e.key !== 'z' && e.key !== 'Z')) return;
        e.preventDefault();

        // Manual attack logic (if Auto Mode is off, should still work if button is clicked)
        if (!isAutoMode) {
             stopAttackManual();
        }
    };

    const stopAttackManual = () => {
        isAttacking = false;
        window.removeEventListener('keydown', handleAttackKey, true);

        playSFX('attack');

        const hitPercentage = (cursorX / BAR_WIDTH) * 100;
        let damageText = "";
        let damage = 1;

        if (hitPercentage >= 45 && hitPercentage <= 55) {
            damage = 25;
            damageText = "CRITICAL HIT! (+2 Mercy)";
            mercyCounter += 2;
        } else if (hitPercentage >= 20 && hitPercentage <= 80) {
            damage = 10;
            damageText = "Good Hit! (+1 Mercy)";
            mercyCounter += 1;
        } else {
            damage = 1;
            damageText = "Missed... (Min Damage)";
        }

        bossCurrentHP = Math.max(0, bossCurrentHP - damage);
        updateBossHUD();

        const bossImg = document.getElementById('ut-toriel-img');
        if (bossImg) {
            bossImg.classList.add('shaking');
            setTimeout(() => { bossImg.classList.remove('shaking'); }, 600);
        }

        setDialogue(`FIGHT: ${damageText} ${currentBossData.name}'s HP: ${bossCurrentHP}/${currentBossData.maxHP}`);

        document.getElementById('ut-attack-bar-container').style.display = 'none';

        if (bossCurrentHP === 0) {
            handleWinCondition('KILL');
            return;
        }

        setTimeout(startEnemyTurn, 1500);
    };


    // --- VIII. GAMEOVER LOGIC (No changes) ---

    const handleGameOverKey = (e) => {
        const yesBtn = document.getElementById('go-yes-btn');
        if (currentTurn !== 'GAMEOVER') return;

        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            playSFX('select');
            gameoverSelection = (gameoverSelection === 'yes' ? 'no' : 'yes');
            document.getElementById('go-yes-btn').classList.toggle('selected', gameoverSelection === 'yes');
            document.getElementById('go-no-btn').classList.toggle('selected', gameoverSelection === 'no');
            e.preventDefault();
        } else if (e.key === 'Enter' || e.key === 'z' || e.key === 'Z') {
            if (gameoverSelection === 'yes') { handleContinueYes(); } else { handleContinueNo(); }
        }
    };

    const showGameOverScreen = () => {
        let goScreen = document.getElementById('ut-gameover-screen');
        if (!goScreen && battleOverlay) {
            goScreen = document.createElement('div');
            goScreen.id = 'ut-gameover-screen';
            goScreen.innerHTML = `
                <span class="gameover-text">GAME</span>
                <span class="gameover-text">OVER</span>
                <span>CONTINUE?</span>
                <span class="gameover-option selected" id="go-yes-btn">- YES</span>
                <span class="gameover-option" id="go-no-btn">No</span>
            `;
            battleOverlay.appendChild(goScreen);
        }
        if(goScreen) goScreen.style.display = 'flex';
        document.getElementById('go-yes-btn').onclick = handleContinueYes;
        document.getElementById('go-no-btn').onclick = handleContinueNo;
        window.addEventListener('keydown', handleGameOverKey);
    };

    const handleGameOver = () => {
        if (currentTurn === 'GAMEOVER') return;
        endEnemyTurn();
        stopMusic();
        currentTurn = 'GAMEOVER';

        const uiElements = ['ut-top-area', 'ut-dialogue-box', 'ut-battle-box-container', 'ut-hud', 'ut-menu', 'ut-submenu', 'ut-soul'];
        uiElements.forEach(id => { const el = document.getElementById(id); if(el) el.style.display = 'none'; });

        playSFX('gameover');
        showGameOverScreen();
    };

    const handleContinueYes = () => {
        stopMusic();
        const goScreen = document.getElementById('ut-gameover-screen');
        if(goScreen) goScreen.remove();
        window.removeEventListener('keydown', handleGameOverKey);

        currentHP = MAX_HP;
        bossCurrentHP = currentBossData.maxHP;
        mercyCounter = 0;
        dialogueIndex = 0;

        // Restore UI visibility
        const uiElements = ['ut-top-area', 'ut-dialogue-box', 'ut-battle-box-container', 'ut-hud', 'ut-menu', 'ut-soul'];
        uiElements.forEach(id => { const el = document.getElementById(id); if(el) el.style.display = id === 'ut-top-area' || id === 'ut-menu' || id === 'ut-hud' ? 'flex' : 'block'; });

        // Reset Soul position
        const soulEl = document.getElementById('ut-soul');
        soulX = (BOX_SIZE - SOUL_SIZE) / 2;
        soulY = (BOX_SIZE - SOUL_SIZE) / 2;
        if(soulEl) { soulEl.style.transform = `translate(${soulX}px, ${soulY}px)`; soulEl.style.opacity = 1; }

        updateHUD();
        updateBossHUD();
        playMusic(currentBossData.musicURL);
        endEnemyTurn();
    };

    const handleContinueNo = () => {
        stopMusic();
        closeBattleUI();
    };


    // --- IX. CSS & HTML STRUCTURE (BATTLE ONLY) ---

    const UT_CSS = `
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

        /* Global Overlay for Battle UI */
        #ut-battle-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(0, 0, 0, 1);
            z-index: 99999;
            display: none;
            flex-direction: column; align-items: center; justify-content: space-between;
            font-family: 'Press Start 2P', monospace; color: white;
            padding: 20px; box-sizing: border-box; user-select: none;
            pointer-events: none;
            transition: background-color 0.4s ease;
        }

        /* Animations */
        @keyframes shake {
            0%, 100% { transform: translate(0, 0); }
            20%, 60% { transform: translate(-3px, 0); }
            40%, 80% { transform: translate(3px, 0); }
        }
        .shaking { animation: shake 0.2s ease-out 3; }
        @keyframes screen-shake {
            0%, 100% { transform: translate(0, 0); }
            25% { transform: translate(-3px, 0); }
            75% { transform: translate(3px, 0); }
        }
        .screen-shake-active { animation: screen-shake 0.15s ease-out 1; }

        /* Top Area (Boss Sprite) */
        #ut-top-area { width: 100%; max-width: 600px; display: flex; justify-content: center; align-items: flex-end; }
        #ut-toriel-img { width: 150px; height: 150px; object-fit: contain; image-rendering: pixelated; }
        .ut-side-pattern { width: 150px; height: 150px; border: 2px solid #00FF00; margin: 0 50px; display: grid; grid-template-columns: 50% 50%; grid-template-rows: 50% 50%; }
        .ut-side-pattern div { border: 1px solid #00FF00; }

        /* Dialogue Box */
        #ut-dialogue-box {
            width: ${BOX_SIZE * 1.5}px; height: 50px; border: 3px solid white;
            margin-bottom: 5px; padding: 5px; font-size: 14px; line-height: 1.2;
            pointer-events: none; text-align: left;
        }

        /* Battle Box (Defense Zone) */
        #ut-battle-box-container {
            position: relative; width: ${BOX_SIZE}px; height: ${BOX_SIZE}px;
            border: 3px solid white; margin-top: 20px; overflow: hidden;
            pointer-events: none;
        }
        #ut-soul {
            position: absolute; width: ${SOUL_SIZE}px; height: ${SOUL_SIZE}px;
            background-size: contain; image-rendering: pixelated;
        }

        /* JSAB Bullet Styles */
        .ut-bullet {
            position: absolute;
            box-shadow: 0 0 5px var(--bullet-color);
            pointer-events: none;
            transform-origin: center center;
            transition: none;
            z-index: 3;
        }
        .ut-bullet.circle {
             width: 10px; height: 10px; border-radius: 50%;
             background-color: var(--bullet-color);
        }
        .ut-bullet.spiky {
            border-radius: 50%;
            background-image: radial-gradient(circle at center, white 20%, var(--bullet-color) 20%);
            box-shadow: 0 0 10px var(--bullet-color);
        }
        .ut-bullet.bar {
            background-color: var(--bullet-color);
            border-radius: 0;
        }

        /* JSAB Ambient Particles */
        #ambient-particles-container {
             position: absolute; top: 0; left: 0; right: 0; bottom: 0;
             pointer-events: none; z-index: 1; opacity: 0.2;
        }
        .ambient-particle {
             position: absolute; border-radius: 50%;
             background-color: var(--ambient-color); opacity: 0.5;
             animation: float-up-loop var(--duration) linear infinite;
        }
        @keyframes float-up-loop {
            0% { transform: translateY(100%) scale(0.5); opacity: 0.5; }
            100% { transform: translateY(-100%) scale(1.5); opacity: 0; }
        }


        /* HUD */
        #ut-hud {
            position: relative;
            width: 100%; max-width: 600px; display: flex; justify-content: space-between; font-size: 14px;
        }

        /* Boss HP Bar */
        #ut-boss-hud {
            position: absolute; top: -9px; left: 50%; transform: translateX(-50%);
            display: flex; align-items: center; font-size: 14px; color: white;
        }
        #ut-boss-hp-bar {
            width: 80px; height: 6px; background-color: #333; border: 1px solid white; margin-left: 8px; position: relative; overflow: hidden;
        }
        #ut-boss-hp-fill {
            height: 100%; width: 100%; background-color: yellow; transition: width 0.3s ease-out;
        }

        /* Player HP Bar */
        #ut-hp-bar { width: 100px; height: 10px; background-color: red; border: 1px solid white; margin-left: 5px; position: relative; }
        #ut-hp-bar-fill { height: 100%; background-color: yellow; }

        /* Menu Buttons */
        #ut-menu, #ut-submenu { width: 100%; max-width: 600px; display: flex; justify-content: space-around; margin-bottom: 20px; pointer-events: none; }
        .ut-menu-button { padding: 10px 15px; border: 2px solid #FF9900; color: white; background-color: black; cursor: pointer; text-align: center; font-size: 16px; transition: background-color 0.1s; }
        .ut-menu-button.active { pointer-events: auto; }
        .ut-menu-button:hover:not(.disabled) { background-color: #FF9900; color: black; }

        /* Attack Bar */
        #ut-attack-bar-container {
            position: absolute; bottom: 50%; left: 10px; width: ${BAR_WIDTH}px; height: 10px;
            border: 1px solid white; box-sizing: border-box; display: none;
        }
        #ut-attack-bar-zones { width: 100%; height: 100%; position: relative; }
        .ut-damage-zone { position: absolute; height: 100%; opacity: 0.5; }
        #ut-good-hit-zone { background-color: yellow; left: 20%; width: 60%; }
        #ut-perfect-hit-zone { background-color: #00FF00; left: 45%; width: 10%; }
        #ut-cursor { position: absolute; height: 12px; width: 4px; background-color: white; top: -1px; left: 0; transition: none; }

        /* Game Over Screen */
        #ut-gameover-screen {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            display: none;
            flex-direction: column; align-items: center; justify-content: center;
            text-align: center; font-size: 32px; line-height: 1.5; pointer-events: auto;
            background-color: rgba(0, 0, 0, 0.9);
        }
        #ut-gameover-screen span { display: block; }
        .gameover-text { font-size: 48px; margin-bottom: 20px; }
        .gameover-option { cursor: pointer; margin-top: 10px; font-size: 24px; }
        .gameover-option.selected { color: yellow; text-shadow: 0 0 5px white; }
    `;

    const UT_HTML = `
        <div id="ut-top-area">
            <div class="ut-side-pattern"><div></div><div></div><div></div><div></div></div>
            <img id="ut-toriel-img" src="" alt="Boss Sprite">
            <div class="ut-side-pattern"><div></div><div></div><div></div><div></div></div>
        </div>

        <div id="ut-dialogue-box"></div>

        <div id="ut-battle-box-container">
            <div id="ambient-particles-container"></div>
            <div id="ut-soul"></div>
            <div id="ut-attack-bar-container">
                <div id="ut-attack-bar-zones">
                    <div class="ut-damage-zone" id="ut-good-hit-zone"></div>
                    <div class="ut-damage-zone" id="ut-perfect-hit-zone"></div>
                </div>
                <div id="ut-cursor"></div>
            </div>
        </div>

        <div id="ut-hud">
            <!-- Boss HP Bar -->
            <div id="ut-boss-hud">
                <span id="ut-boss-name"></span><br><br>
                <div id="ut-boss-hp-bar"><div id="ut-boss-hp-fill"></div></div>
            </div>

            <!-- Player HP Bar -->
            <div>PLAYER LV 1 HP</div>
            <div style="display: flex; align-items: center;">
                <div id="ut-hp-bar"><div id="ut-hp-bar-fill"></div></div>
                <div>${MAX_HP} / ${MAX_HP}</div>
            </div>
        </div>

        <div id="ut-menu">
            <div class="ut-menu-button" id="fight-btn">⚔️ FIGHT</div>
            <div class="ut-menu-button" id="act-btn">💬 ACT</div>
            <div class="ut-menu-button" id="item-btn">🎒 ITEM</div>
            <div class="ut-menu-button" id="mercy-btn">❌ MERCY</div>
        </div>
        <div id="ut-submenu" style="display: none;"></div>
    `;

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

    // --- X. INITIALIZATION & CLEANUP ---

    /**
     * @function startBossBattle
     * Inicializa y comienza la batalla con un jefe específico.
     * @param {string} bossID - El ID (nombre) del jefe a cargar.
     */
    function startBossBattle(bossID) {
        if (isBattleActive) {
            console.warn("Drawaria RPG Battle UI is already active. Please close first.");
            return;
        }

        const bossData = BOSS_DATA[bossID];
        if (!bossData) {
            console.error(`Boss with ID '${bossID}' not found.`);
            return;
        }

        // 1. Resetear Estado Global
        currentBossData = bossData;
        isBattleActive = true;
        currentHP = MAX_HP;
        bossCurrentHP = bossData.maxHP;
        mercyCounter = 0;
        dialogueIndex = 0;
        currentTurn = 'PLAYER';
        bullets.length = 0;

        // 2. Inyectar CSS y Estructura
        injectCSS();
        battleOverlay = document.createElement('div');
        battleOverlay.id = 'ut-battle-overlay';
        battleOverlay.innerHTML = UT_HTML;
        document.body.appendChild(battleOverlay);
        battleOverlay.style.display = 'flex'; // Show the overlay

        // Set dynamic CSS variables
        battleOverlay.style.setProperty('--bullet-color', currentBossData.color);

        // 3. Añadir Event Listeners
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        attachButtonListeners();
        window.addEventListener('blur', pauseGame);
        window.addEventListener('focus', resumeGame);

        // 4. Cargar Assets
        const torielImg = document.getElementById('ut-toriel-img');
        const soulEl = document.getElementById('ut-soul');
        if(torielImg) getLocalUrl(currentBossData.spriteURL).then(url => { torielImg.src = url; }).catch(e => console.warn("Sprite load error", e));
        if(soulEl) getLocalUrl(SPRITE_SOUL_ICON).then(url => { soulEl.style.backgroundImage = `url('${url}')`; }).catch(e => console.warn("Soul sprite load error", e));

        // 5. Setup Ambient/Initial State
        ambientParticlesContainer = document.getElementById('ambient-particles-container');
        spawnAmbientParticles();

        // Reset Soul position
        soulX = (BOX_SIZE - SOUL_SIZE) / 2;
        soulY = (BOX_SIZE - SOUL_SIZE) / 2;
        if(soulEl) soulEl.style.transform = `translate(${soulX}px, ${soulY}px)`;

        // 6. Start Music and HUD
        playMusic(currentBossData.musicURL);
        updateHUD();
        updateBossHUD();

        // --- AUTO MODE INITIAL START ---
        if (isAutoMode) {
            startPlayerTurnAuto();
        } else {
            enableMenu();
            setDialogue(`${currentBossData.name} blocks the way. (Player Turn)`);
        }
        // --------------------------------

        console.log(`Drawaria RPG Battle UI ACTIVATED for ${bossID}. Auto Mode: ${isAutoMode ? 'ON' : 'OFF'}.`);
    }

    function closeBattleUI() {
        if (!isBattleActive) return;

        stopMusic();
        endEnemyTurn();

        // Limpieza de todos los listeners
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        window.removeEventListener('keydown', handleAttackKey, true);
        window.removeEventListener('keydown', handleGameOverKey);
        window.removeEventListener('blur', pauseGame);
        window.removeEventListener('focus', resumeGame);

        if (battleOverlay) battleOverlay.remove();
        removeCSS();

        isBattleActive = false;
        currentBossData = null;

        console.log("Drawaria RPG Battle UI DEACTIVATED.");
    }

    // Pause/Resume (Essential for requestAnimationFrame)
    const pauseGame = () => {
        if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
            if (musicPlayer) musicPlayer.pause();
            console.log("Game Paused (Tab Lost Focus)");
        }
    };

    const resumeGame = () => {
        if (animationFrameId === null && isBattleActive && currentTurn === 'ENEMY') {
            lastUpdateTime = 0;
            animationFrameId = requestAnimationFrame(updateGame);
            if (musicPlayer) musicPlayer.play().catch(e => console.warn("Error resuming music:", e));
            console.log("Game Resumed (Tab Gained Focus)");
        }
    };

    // --- XI. TAMPERMONKEY MENU COMMAND REGISTRATION ---

    const toggleAutoMode = () => {
        isAutoMode = !isAutoMode;
        GM_setValue('autoMode', isAutoMode);
        alert(`Auto-Battle Mode is now ${isAutoMode ? 'ON' : 'OFF'}.`);
        console.log(`Auto-Battle Mode toggled to: ${isAutoMode}`);
        // Refresh menu to show current state
        if (typeof GM_registerMenuCommand !== 'undefined') {
            // Unregister and re-register commands is the standard way to update menu text
            // But we'll rely on the manual restart for consistency.
            // A restart (close and re-open battle) is recommended after toggling mode.
        }
    };

    if (typeof GM_registerMenuCommand !== 'undefined') {
        GM_registerMenuCommand(`Toggle Auto-Battle Mode (Currently: ${isAutoMode ? 'ON' : 'OFF'})`, toggleAutoMode);
        GM_registerMenuCommand("--------------------------------------------------", () => {});
        GM_registerMenuCommand("Start Battle: Rubina (Fire)", () => startBossBattle('Rubina'));
        GM_registerMenuCommand("Start Battle: Hydorus (Water)", () => startBossBattle('Hydorus'));
        GM_registerMenuCommand("Start Battle: Zeno (Thunder)", () => startBossBattle('Zeno'));
        GM_registerMenuCommand("Start Battle: Simon (Rhythm)", () => startBossBattle('Simon'));
        GM_registerMenuCommand("Start Battle: Flora (Nature)", () => startBossBattle('Flora'));
        GM_registerMenuCommand("Start Battle: Tobias (Chaos)", () => startBossBattle('Tobias'));
        GM_registerMenuCommand("--- Close RPG Battle UI ---", closeBattleUI);
    } else {
        console.error("GM_registerMenuCommand is not available. Script needs Tampermonkey/Violentmonkey.");
    }

})();