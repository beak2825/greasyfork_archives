// ==UserScript==
// @name         Drawaria Undertale Toriel Battle
// @namespace    http://tampermonkey.net/
// @version      6.1
// @description  FINAL VERSION with Full Fidelity: Boss HP Bar, Hit Shake Animation, SFX, and stable turn management.
// @author       YouTubeDrawaria
// @include	 https://drawaria.online/*
// @include	 https://*.drawaria.online/*
// @include      https://drawaria.online*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online/room/
// @connect      i.pinimg.com
// @connect      static.wikia.nocookie.net
// @connect      www.myinstants.com
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/551789/Drawaria%20Undertale%20Toriel%20Battle.user.js
// @updateURL https://update.greasyfork.org/scripts/551789/Drawaria%20Undertale%20Toriel%20Battle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- I. CONFIGURATION & GLOBAL STATE ---
    const BATTLE_DURATION_MS = 5000;
    const MERCY_THRESHOLD = 8;
    const INVINCIBILITY_MS = 500;
    const BOX_SIZE = 200;
    const SOUL_SIZE = 20;
    const BAR_WIDTH = 180;

    // ASSETS (URLs)
    const SPRITE_TORIEL = 'https://static.wikia.nocookie.net/characterprofile/images/0/01/Toriel.png/revision/latest?cb=20230302211440';
    const SPRITE_SOUL_ICON = 'https://i.pinimg.com/originals/3d/91/1e/3d911edb3c3b52e04f6c08b95b3b97ce.jpg';
    const SPRITE_BULLET = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PGNpcmNsZSBjeD0iNSIgY3k9IjUiIHI9IjUiIGZpbGw9IndoaXRlIi8+PC9zdmc+';
    const TORIEL_MUSIC_URL = 'https://www.myinstants.com/media/sounds/z-jefe1.mp3';
    const GAMEOVER_MUSIC_URL = 'https://www.myinstants.com/media/sounds/undertale-game-over.mp3';

    // SFX (New Assets)
    const SOUND_DAMAGE = 'https://www.myinstants.com/media/sounds/undertale-damage-taken.mp3';
    const SOUND_ATTACK = 'https://www.myinstants.com/media/sounds/undertale-attack-slash-green-screen.mp3';
    const SOUND_SELECT = 'https://www.myinstants.com/media/sounds/undertale-select-sound.mp3';
    const SOUND_YOU_WIN = 'https://www.myinstants.com/media/sounds/undertale-sound-effect-you-win.mp3';

    // ESTADO DEL JEFE
    const BOSS_NAME = 'Toriel';
    const BOSS_MAX_HP = 40;
    let bossCurrentHP = BOSS_MAX_HP;

    // DIALOGUES (All English)
    const TORIEL_DIALOGUES = [
        "Toriel: I do not have much time.",
        "Toriel: You smell like a child who has not showered...",
        "Toriel: ... I am sorry, my child.",
        "Toriel: Where do you come from, my child?",
        "Toriel: I will not fight you.",
        "Toriel: If you wish to leave, you must prove to me that you are strong enough."
    ];
    const CHECK_TEXT = "TORIEL - ATK 8, DEF 999. She is very protective. Hates violence.";

    // STATE VARIABLES
    let battleOverlay = null;
    let isBattleActive = false;
    let animationFrameId = null;
    let bulletInterval = null;
    let enemyTurnTimer = null;
    let musicPlayer = null;
    let gameoverPlayer = null;

    let currentTurn = 'PLAYER';
    let mercyCounter = 0;
    let currentHP = 20;
    const MAX_HP = 20;
    let isInvincible = false;
    let dialogueIndex = 0;

    let keys = {};
    let soulX = (BOX_SIZE - SOUL_SIZE) / 2;
    let soulY = (BOX_SIZE - SOUL_SIZE) / 2;
    const soulSpeed = 3;
    const bullets = [];

    let cursorX = 0;
    let cursorSpeed = 5;
    let isAttacking = false;
    let gameoverSelection = 'yes';

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

    /**
     * @function playSFX
     * Reproduce un sonido de efecto corto.
     * @param {string} url La URL del archivo de sonido.
     */
    const playSFX = (url) => {
        try {
            // NOTE: SFX (myinstants) may need CORS bypass for consistency, but often works directly.
            // We use direct load for simplicity of short effects.
            const audio = new Audio(url);
            audio.volume = 0.5; // Ensure it's not too loud
            audio.play().catch(e => console.warn("Error al reproducir SFX:", e));
        } catch (e) {
            console.warn("No se pudo crear el objeto de audio SFX:", e);
        }
    };

    // --- III. CSS & HTML STRUCTURE ---

    const UT_CSS = `
        @font-face {
            font-family: 'Undertale-Styled';
            font-family: 'Press Start 2P', monospace;
        }

        /* Animación de Shake (Toriel) */
        @keyframes shake {
            0%, 100% { transform: translate(0, 0); }
            20%, 60% { transform: translate(-3px, 0); }
            40%, 80% { transform: translate(3px, 0); }
        }
        .shaking {
            animation: shake 0.2s ease-out 3;
        }

        #ut-battle-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(0, 0, 0, 1); z-index: 99999;
            display: flex; flex-direction: column; align-items: center; justify-content: space-between;
            font-family: 'Undertale-Styled', monospace; color: white;
            padding: 20px; box-sizing: border-box; user-select: none;
            pointer-events: none;
        }
        #ut-top-area { width: 100%; max-width: 600px; display: flex; justify-content: center; align-items: flex-end; }
        #ut-toriel-img { width: 150px; height: 150px; object-fit: contain; image-rendering: pixelated; }
        .ut-side-pattern { width: 150px; height: 150px; border: 2px solid #00FF00; margin: 0 50px; display: grid; grid-template-columns: 50% 50%; grid-template-rows: 50% 50%; }
        .ut-side-pattern div { border: 1px solid #00FF00; }

        #ut-dialogue-box {
            width: ${BOX_SIZE * 1.5}px; height: 50px; border: 3px solid white;
            margin-bottom: 5px; padding: 5px; font-size: 14px; line-height: 1.2;
            pointer-events: none; text-align: left;
        }

        #ut-battle-box-container {
            position: relative; width: ${BOX_SIZE}px; height: ${BOX_SIZE}px;
            border: 3px solid white; margin-top: 20px; overflow: hidden;
            pointer-events: none;
        }
        #ut-soul {
            position: absolute; width: ${SOUL_SIZE}px; height: ${SOUL_SIZE}px;
            background-size: contain; image-rendering: pixelated;
        }

        .ut-bullet { position: absolute; width: 10px; height: 10px; background-image: url('${SPRITE_BULLET}'); background-size: contain; }

        #ut-hud {
            position: relative; /* Para posicionar la barra de jefe de forma absoluta */
            width: 100%; max-width: 600px; display: flex; justify-content: space-between; font-size: 14px;
        }

        /* Barra de Vida del JEFE */
        #ut-boss-hud {
            position: absolute;
            top: -9px; /* Arriba del diálogo */
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            align-items: center;
            font-size: 14px;
            color: white;
        }
        #ut-boss-hp-bar {
            width: 80px;
            height: 6px;
            background-color: #333;
            border: 1px solid white;
            margin-left: 8px;
            position: relative;
            overflow: hidden;
        }
        #ut-boss-hp-fill {
            height: 100%;
            width: 100%;
            background-color: yellow;
            transition: width 0.3s ease-out;
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
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            text-align: center; font-size: 32px; line-height: 1.5; pointer-events: auto;
        }
        #ut-gameover-screen span { display: block; }
        .gameover-text { font-size: 48px; margin-bottom: 20px; }
        .gameover-option { cursor: pointer; margin-top: 10px; font-size: 24px; }
        .gameover-option.selected { color: yellow; text-shadow: 0 0 5px white; }
    `;

    // --- IV. HTML STRUCTURE (Initial) ---
    const UT_HTML = `
        <div id="ut-top-area">
            <div class="ut-side-pattern"><div></div><div></div><div></div><div></div></div>
            <img id="ut-toriel-img" src="" alt="Toriel Sprite">
            <div class="ut-side-pattern"><div></div><div></div><div></div><div></div></div>
        </div>

        <div id="ut-dialogue-box">Toriel is waiting for your move.</div>

        <div id="ut-battle-box-container">
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
                <span id="ut-boss-name">${BOSS_NAME}</span>
                <div id="ut-boss-hp-bar"><div id="ut-boss-hp-fill"></div></div>
            </div>

            <!-- Player HP Bar -->
            <div>EROGMR LV 1 HP</div>
            <div style="display: flex; align-items: center;">
                <div id="ut-hp-bar"><div id="ut-hp-bar-fill"></div></div>
                <div>${currentHP} / ${MAX_HP}</div>
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

    // --- V. GAME LOGIC HANDLERS ---

    // Global Key Handlers (Filters by state)
    const handleKeyDown = (e) => {
        if (!isBattleActive) return;

        // SFX: Play select sound for menu navigation (simulated)
        if (currentTurn === 'PLAYER' || currentTurn === 'GAMEOVER') {
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                 playSFX(SOUND_SELECT);
            }
        }

        if (currentTurn === 'ENEMY') {
            keys[e.key] = true;
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

    // Attack Bar Logic (Local Listener)
    const handleAttackKey = (e) => {
        if (!isAttacking || (e.key !== 'Enter' && e.key !== 'z' && e.key !== 'Z')) return;

        e.preventDefault();
        stopAttack();
    };

    const stopAttack = () => {
        isAttacking = false;
        window.removeEventListener('keydown', handleAttackKey, true);

        // SFX: Play attack sound
        playSFX(SOUND_ATTACK);

        const hitPosition = cursorX / 1.8;
        let damageText = "";
        let damage = 1; // Base damage

        if (hitPosition >= 45 && hitPosition <= 55) {
            damage = 10;
            damageText = "CRITICAL HIT! (Max Fictional Damage)";
            mercyCounter += 2;
        } else if (hitPosition >= 20 && hitPosition <= 80) {
            damage = 5;
            damageText = "Good Hit! (Medium Fictional Damage)";
            mercyCounter += 1;
        } else {
            damage = 1;
            damageText = "Missed... (Min Fictional Damage)";
        }

        // Apply Damage and Shake
        bossCurrentHP = Math.max(0, bossCurrentHP - damage);
        updateBossHUD();

        const toriel = document.getElementById('ut-toriel-img');
        if (toriel) {
            toriel.classList.add('shaking');
            setTimeout(() => {
                toriel.classList.remove('shaking');
            }, 600);
        }

        setDialogue(`FIGHT: ${damageText} Toriel's HP: ${bossCurrentHP}/${BOSS_MAX_HP}`);

        document.getElementById('ut-attack-bar-container').style.display = 'none';

        // Check Kill Condition
        if (bossCurrentHP === 0) {
            handleWinCondition('KILL');
            return;
        }

        setTimeout(startEnemyTurn, 1500);
    };

    // Game Over Logic
    const handleGameOverKey = (e) => {
        const yesBtn = document.getElementById('go-yes-btn');
        const noBtn = document.getElementById('go-no-btn');
        if (!yesBtn || !noBtn) return;

        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            playSFX(SOUND_SELECT); // SFX
            gameoverSelection = (gameoverSelection === 'yes' ? 'no' : 'yes');
            yesBtn.classList.toggle('selected', gameoverSelection === 'yes');
            noBtn.classList.toggle('selected', gameoverSelection === 'no');
            e.preventDefault();
        } else if (e.key === 'Enter' || e.key === 'z' || e.key === 'Z') {
            if (gameoverSelection === 'yes') {
                handleContinueYes();
            } else {
                handleContinueNo();
            }
        }
    };

    // Soul/Bullet Logic
    const updateSoulPosition = () => {
        let dx = 0; let dy = 0;
        if (keys['ArrowUp'] || keys['w']) dy -= soulSpeed;
        if (keys['ArrowDown'] || keys['s']) dy += soulSpeed;
        if (keys['ArrowLeft'] || keys['a']) dx -= soulSpeed;
        if (keys['ArrowRight'] || keys['d']) dx += soulSpeed;

        soulX += dx;
        soulY += dy;

        soulX = Math.max(0, Math.min(soulX, BOX_SIZE - SOUL_SIZE));
        soulY = Math.max(0, Math.min(soulY, BOX_SIZE - SOUL_SIZE));

        document.getElementById('ut-soul').style.transform = `translate(${soulX}px, ${soulY}px)`;
    };

    const checkCollision = () => {
        const soul = document.getElementById('ut-soul');
        if (!soul || isInvincible) return;

        const sX = soulX + SOUL_SIZE / 2;
        const sY = soulY + SOUL_SIZE / 2;
        const sR = SOUL_SIZE / 2;

        document.querySelectorAll('.ut-bullet').forEach(bullet => {
            const bX = parseFloat(bullet.style.left) + 5;
            const bY = parseFloat(bullet.style.top) + 5;
            const bR = 5;

            const distance = Math.sqrt(Math.pow(sX - bX, 2) + Math.pow(sY - bY, 2));

            if (distance < sR + bR) {
                if (currentHP > 0) {
                    currentHP = Math.max(0, currentHP - 1);
                    updateHUD();
                    playSFX(SOUND_DAMAGE); // SFX: Player Damage

                    isInvincible = true;
                    soul.style.opacity = 0.5;

                    setTimeout(() => {
                        isInvincible = false;
                        soul.style.opacity = 1;
                    }, INVINCIBILITY_MS);

                    if (currentHP === 0) {
                        handleGameOver();
                        return;
                    }
                }
                bullet.remove();
            }
        });
    };

    const spawnBullet = () => {
        const box = document.getElementById('ut-battle-box-container');
        if (!box) return;

        const bullet = document.createElement('div');
        bullet.className = 'ut-bullet';
        box.appendChild(bullet);

        let startX = Math.random() * (BOX_SIZE - 10);
        let startY = 0;
        let speed = 1.5 + Math.random() * 1;
        let angle = Math.PI / 2 + (Math.random() - 0.5) * 0.1;

        bullet.style.left = `${startX}px`;
        bullet.style.top = `${startY}px`;

        bullets.push({ element: bullet, x: startX, y: startY, vx: speed * Math.cos(angle), vy: speed * Math.sin(angle) });
    };

    // Game Loop (RAF)
    const updateGame = () => {
        if (!isBattleActive || currentTurn === 'GAMEOVER') {
            animationFrameId = null;
            return;
        }

        if (currentTurn === 'ENEMY') {
            for (let i = bullets.length - 1; i >= 0; i--) {
                const b = bullets[i];
                b.x += b.vx;
                b.y += b.vy;
                b.element.style.left = `${b.x}px`;
                b.element.style.top = `${b.y}px`;

                if (b.y > BOX_SIZE) {
                    b.element.remove();
                    bullets.splice(i, 1);
                }
            }
            updateSoulPosition();
            checkCollision();
        }

        if (isAttacking) {
            cursorX += cursorSpeed;
            if (cursorX > BAR_WIDTH || cursorX < 0) {
                cursorSpeed = -cursorSpeed;
                cursorX = Math.max(0, Math.min(cursorX, BAR_WIDTH));
            }
            document.getElementById('ut-cursor').style.left = `${cursorX}px`;
        }

        animationFrameId = requestAnimationFrame(updateGame);
    };

    // --- VI. TURN CONTROL AND UI UPDATES ---

    // Boss HP Update Function
    const updateBossHUD = () => {
        const fill = document.getElementById('ut-boss-hp-fill');
        const name = document.getElementById('ut-boss-name');

        if (fill) {
            const percent = (bossCurrentHP / BOSS_MAX_HP) * 100;
            fill.style.width = `${percent}%`;

            if (percent < 25) {
                fill.style.backgroundColor = 'red';
            } else {
                fill.style.backgroundColor = 'yellow';
            }
        }
        if (name) {
            name.textContent = `${BOSS_NAME} ${bossCurrentHP}/${BOSS_MAX_HP}`;
        }
    };
    // Player HP Update Function (Existing)
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

    // Turn Control
    const startEnemyTurn = () => {
        currentTurn = 'ENEMY';
        disableMenu();
        document.getElementById('ut-submenu').style.display = 'none';

        setDialogue("Toriel attacks...");
        document.getElementById('ut-battle-box-container').style.pointerEvents = 'auto';

        if (!animationFrameId) {
             animationFrameId = requestAnimationFrame(updateGame);
        }

        bulletInterval = setInterval(spawnBullet, 500);
        enemyTurnTimer = setTimeout(endEnemyTurn, BATTLE_DURATION_MS);
    };

    const endEnemyTurn = () => {
        if (currentTurn !== 'ENEMY' && currentTurn !== 'PLAYER') return;

        // FIX 1: Reset Loop IDs
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        animationFrameId = null;

        if (bulletInterval) clearInterval(bulletInterval);
        bulletInterval = null;

        if (enemyTurnTimer) clearTimeout(enemyTurnTimer);
        enemyTurnTimer = null;

        document.querySelectorAll('.ut-bullet').forEach(b => b.remove());
        bullets.length = 0;

        // FIX 2: Reset Key State
        keys = {};

        document.getElementById('ut-battle-box-container').style.pointerEvents = 'none';

        currentTurn = 'PLAYER';
        setDialogue("What will you do?");
        enableMenu();
    };

    // Win Condition Handler (New)
    const handleWinCondition = (type) => {
        stopMusic();
        playSFX(SOUND_YOU_WIN);

        if (type === 'MERCY') {
            setDialogue("Toriel spares you. She hugs you. The battle ends. (PACIFIST VICTORY)");
        } else if (type === 'KILL') {
            setDialogue("Toriel is defeated. Your LV increases. (GENOCIDE VICTORY)");
        }

        setTimeout(closeBattleUI, 3000);
    }

    // --- VII. BUTTON HANDLERS (FIGHT, ACT, MERCY) ---

    const handleFight = () => {
        disableMenu();
        setDialogue("Press Z or Enter to hit!");

        document.getElementById('ut-attack-bar-container').style.display = 'block';

        cursorX = 0;
        isAttacking = true;

        window.addEventListener('keydown', handleAttackKey, true);

        if (!animationFrameId) {
            animationFrameId = requestAnimationFrame(updateGame);
        }
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

        document.getElementById('check-btn').onclick = () => { playSFX(SOUND_SELECT); handleCheck(); };
        document.getElementById('talk-btn').onclick = () => { playSFX(SOUND_SELECT); handleTalk(); };
    };

    const handleCheck = () => {
        setDialogue(CHECK_TEXT);
        document.getElementById('ut-submenu').style.display = 'none';
        mercyCounter++;
        setTimeout(startEnemyTurn, 1000);
    };

    const handleTalk = () => {
        const totalDialogues = TORIEL_DIALOGUES.length;
        const dialogue = TORIEL_DIALOGUES[dialogueIndex % totalDialogues];
        dialogueIndex++;

        setDialogue(dialogue);
        document.getElementById('ut-submenu').style.display = 'none';
        mercyCounter++;

        setTimeout(startEnemyTurn, 1000);
    };

    const handleItem = () => {
        setDialogue("ITEM: You have a 'Stick' and 'Bandage'. (No effect in Drawaria)");
        setTimeout(startEnemyTurn, 1000);
    };

    const handleMercy = () => {
        if (mercyCounter >= MERCY_THRESHOLD) {
            handleWinCondition('MERCY');
            return;
        }

        setDialogue("Spare: Toriel looks at you sadly. She seems more docile.");
        mercyCounter++;
        setTimeout(startEnemyTurn, 1000);
    };

    const attachButtonListeners = () => {
        document.getElementById('fight-btn').onclick = () => { playSFX(SOUND_SELECT); handleFight(); };
        document.getElementById('act-btn').onclick = () => { playSFX(SOUND_SELECT); handleAct(); };
        document.getElementById('item-btn').onclick = () => { playSFX(SOUND_SELECT); handleItem(); };
        document.getElementById('mercy-btn').onclick = () => { playSFX(SOUND_SELECT); handleMercy(); };
    };

    // --- VIII. AUDIO AND GAMEOVER LOGIC ---

    const playMusic = () => {
        stopMusic();
        musicPlayer = new Audio();

        getLocalUrl(TORIEL_MUSIC_URL)
            .then(url => {
                musicPlayer.src = url;
                musicPlayer.loop = true;
                musicPlayer.volume = 0.5;
                musicPlayer.play().catch(e => console.warn("Error playing battle music:", e));
            })
            .catch(e => {
                console.error("Failed to load battle music via CORS bypass.", e);
                musicPlayer.src = TORIEL_MUSIC_URL;
            });
    };

    const stopMusic = () => {
        if (musicPlayer) { musicPlayer.pause(); musicPlayer.currentTime = 0; }
        if (gameoverPlayer) { gameoverPlayer.pause(); gameoverPlayer.currentTime = 0; }
    };

    const showGameOverScreen = () => {
        const screenHTML = `
            <div id="ut-gameover-screen" style="display: none;">
                <span class="gameover-text">GAME</span>
                <span class="gameover-text">OVER</span>
                <span>CONTINUE?</span>
                <span class="gameover-option selected" id="go-yes-btn">- YES</span>
                <span class="gameover-option" id="go-no-btn">No</span>
            </div>
        `;

        battleOverlay.insertAdjacentHTML('beforeend', screenHTML);
        document.getElementById('ut-gameover-screen').style.display = 'flex';

        document.getElementById('go-yes-btn').onclick = handleContinueYes;
        document.getElementById('go-no-btn').onclick = handleContinueNo;
    };

    const handleGameOver = () => {
        if (currentTurn === 'GAMEOVER') return;

        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        if (bulletInterval) clearInterval(bulletInterval);
        if (enemyTurnTimer) clearTimeout(enemyTurnTimer);

        animationFrameId = null;
        bulletInterval = null;
        enemyTurnTimer = null;

        stopMusic();

        currentTurn = 'GAMEOVER';

        const uiElements = ['ut-top-area', 'ut-dialogue-box', 'ut-battle-box-container', 'ut-hud', 'ut-menu', 'ut-submenu'];
        uiElements.forEach(id => {
            const el = document.getElementById(id);
            if(el) el.style.display = 'none';
        });

        gameoverPlayer = new Audio();
        getLocalUrl(GAMEOVER_MUSIC_URL)
            .then(url => {
                gameoverPlayer.src = url;
                gameoverPlayer.play().catch(e => console.warn("Error playing Game Over music:", e));
            })
            .catch(e => {
                console.error("Failed to load Game Over music via CORS bypass.", e);
                gameoverPlayer.src = GAMEOVER_MUSIC_URL;
            });

        showGameOverScreen();
    };

    const handleContinueYes = () => {
        stopMusic();
        const goScreen = document.getElementById('ut-gameover-screen');
        if(goScreen) goScreen.remove();

        // Reset essential state
        currentHP = MAX_HP;
        bossCurrentHP = BOSS_MAX_HP; // Reset Boss HP
        mercyCounter = 0;
        dialogueIndex = 0;

        // Restore UI elements
        document.getElementById('ut-top-area').style.display = 'flex';
        document.getElementById('ut-dialogue-box').style.display = 'block';
        document.getElementById('ut-battle-box-container').style.display = 'block';
        document.getElementById('ut-hud').style.display = 'flex';
        document.getElementById('ut-menu').style.display = 'flex';

        updateHUD();
        updateBossHUD(); // Update Boss HUD on continue
        playMusic();
        endEnemyTurn();

        console.log("Game continued from Game Over.");
    };

    const handleContinueNo = () => {
        stopMusic();
        closeBattleUI();
    };

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

    // Main Entry Function
    function openBattleUI() {
        if (isBattleActive) {
            console.warn("Undertale Battle UI is already active.");
            return;
        }

        // Reset ALL state on fresh start
        isBattleActive = true;
        currentHP = MAX_HP;
        bossCurrentHP = BOSS_MAX_HP; // Boss HP Reset
        mercyCounter = 0;
        dialogueIndex = 0;
        currentTurn = 'PLAYER';

        injectCSS();
        battleOverlay = document.createElement('div');
        battleOverlay.id = 'ut-battle-overlay';
        battleOverlay.innerHTML = UT_HTML;
        document.body.appendChild(battleOverlay);

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        attachButtonListeners();

        // Centralized Asset Loading (After DOM creation)
        getLocalUrl(SPRITE_TORIEL)
            .then(url => {
                const torielImg = document.getElementById('ut-toriel-img');
                if(torielImg) torielImg.src = url;
            })
            .catch(e => console.warn("Error loading Toriel sprite (relying on direct URL).", e));

        getLocalUrl(SPRITE_SOUL_ICON)
            .then(url => {
                const soulEl = document.getElementById('ut-soul');
                if(soulEl) soulEl.style.backgroundImage = `url('${url}')`;
            })
            .catch(e => console.warn("Error loading Soul sprite (relying on direct URL).", e));

        playMusic();

        updateHUD();
        updateBossHUD(); // Initialize Boss HUD
        enableMenu();
        setDialogue("Toriel blocks the way. (Player Turn)");

        console.log("Undertale Battle UI ACTIVATED.");
    }

    // Main Exit Function (Cleanup)
    function closeBattleUI() {
        if (!isBattleActive) return;

        stopMusic();
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        if (bulletInterval) clearInterval(bulletInterval);
        if (enemyTurnTimer) clearTimeout(enemyTurnTimer);

        animationFrameId = null;
        bulletInterval = null;
        enemyTurnTimer = null;

        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        window.removeEventListener('keydown', handleAttackKey, true);

        if (battleOverlay) battleOverlay.remove();
        removeCSS();

        isBattleActive = false;
        bullets.length = 0;
        currentTurn = 'PLAYER';
        keys = {};

        console.log("Undertale Battle UI DEACTIVATED.");
    }

    // --- X. TAMPERMONKEY MENU COMMAND REGISTRATION ---

    if (typeof GM_registerMenuCommand !== 'undefined') {
        GM_registerMenuCommand("Open Undertale Battle UI", openBattleUI);
        GM_registerMenuCommand("Close Undertale Battle UI", closeBattleUI);
    } else {
        console.error("GM_registerMenuCommand is not available. Please ensure the script runs in Tampermonkey.");
    }

})();