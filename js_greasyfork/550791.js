// ==UserScript==
// @name         Drawaria Battle! 🔥 Tik Tok vs. сонечка
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  2D fighting game with Language/Character selection and improved combat mechanics into drawaria.online.
// @author       YouTubeDrawaria
// @match        *://drawaria.online/*
// @match        *://*drawaria.online/*
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @icon         https://fonts.gstatic.com/s/e/notoemoji/latest/1f525/512.webp
// @match        https://drawaria.online/profile/?uid=1f400b90-8e8c-11ed-9fd3-c3a00b129da4
// @match        https://drawaria.online/profile/?uid=7dda2280-618f-11ef-acaf-250da20bac69
// @downloadURL https://update.greasyfork.org/scripts/550791/Drawaria%20Battle%21%20%F0%9F%94%A5%20Tik%20Tok%20vs%20%D1%81%D0%BE%D0%BD%D0%B5%D1%87%D0%BA%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/550791/Drawaria%20Battle%21%20%F0%9F%94%A5%20Tik%20Tok%20vs%20%D1%81%D0%BE%D0%BD%D0%B5%D1%87%D0%BA%D0%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- L10N: TRANSLATIONS ---
    const translations = {
        'en': {
            lang_question: "Choose your language:",
            fight_title: "Drawaria Battle! 🔥 Tik Tok vs. сонечка",
            epic_brawl: "EPIC BRAWL BEGINS!",
            select_char: "Select your fighter:",
            play_as: "Play as",
            controls_title: "Controls (Player):",
            p1_controls: "P1 (Human): ← (Left), → (Right), ↑ (Jump), Space (Attack)", // Unified controls
            p2_controls: "P2 (Bot): Automatic Movement & Attacks",
            audio_note: "Click on the game to enable background music.",
            start_button: "FIGHT!",
            game_over: "GAME OVER",
            ko_message: "WINS by KO!",
            time_advantage: "WINS by Health Advantage!",
            draw_message: "Time Up! It's a DRAW!",
            restart_button: "CONTINUE / PLAY AGAIN", // Updated text
            ko: "KO!",
            round: "Round",
            match_over: "MATCH OVER" // New text
        },
        'ru': {
            lang_question: "Выберите ваш язык:",
            fight_title: "Drawaria Battle! 🔥 Tik Tok vs. сонечка",
            epic_brawl: "ЭПИЧЕСКАЯ БИТВА НАЧИНАЕТСЯ!",
            select_char: "Выберите вашего бойца:",
            play_as: "Играть за",
            controls_title: "Управление (Игрок):",
            p1_controls: "P1 (Человек): ← (Влево), → (Вправо), ↑ (Прыжок), Пробел (Атака)", // Unified controls
            p2_controls: "P2 (Бот): Автоматическое движение и атаки",
            audio_note: "Нажмите на игру, чтобы включить фоновую музыку.",
            start_button: "СРАЖАТЬСЯ!",
            game_over: "ИГРА ОКОНЧЕНА",
            ko_message: "ПОБЕДА нокаутом!",
            time_advantage: "ПОБЕДА по преимуществу здоровья!",
            draw_message: "Время вышло! НИЧЬЯ!",
            restart_button: "ПРОДОЛЖИТЬ / ИГРАТЬ СНОВА", // Updated text
            ko: "НОКАУТ!",
            round: "Раунд",
            match_over: "МАТЧ ОКОНЧЕН" // New text
        }
    };

    let currentLang = 'en'; // Default language

    // --- USERSCRIPT STYLES & HTML INJECTION ---
    const GAME_WIDTH = 1200;
    const GAME_HEIGHT = 700;
    const STAGE_GROUND = 60;
    const TT_AVATAR_URL = 'https://yt3.googleusercontent.com/Fh3avs1Wt0eckLYBbX-DTGoCkiQ0tsBpZLU7k6lpKeSLcAwikIUOOb1vKrCzlnsHtnXFmVGCNQI=s120-c-k-c0x00ffffff';
    const SONECKA_AVATAR_URL = 'https://yt3.googleusercontent.com/Rz25VO6HQZ_vhE2gJMgBOjzbSiqaVrSExTZOkTeL9gLTPXPJI1Pad-ozGSMm9QIDFyOR8pCHn4s=s120-c-k-c0x00ffffff-no-rj';
    const TOTAL_ROUNDS = 3; // New constant for total rounds

    // The styles were kept from the previous version, focusing on functionality here.
    GM_addStyle(`
        @keyframes pulse { 0% { transform: scale(1); opacity: 0.8; } 100% { transform: scale(1.05); opacity: 1; } }
        #fighting-game-container { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 99999; border: 5px solid gold; box-shadow: 0 0 30px rgba(255, 69, 0, 0.9); background: #111; }
        #game-canvas { display: block; background: linear-gradient(to bottom, red 0%, yellow 50%); }
        #ui-overlay { position: absolute; top: 0; left: 0; width: 100%; pointer-events: none; }
        .ui-bar { height: 30px; background: rgba(0, 0, 0, 0.7); border: 2px solid white; position: relative; display: inline-block; box-shadow: 0 0 10px rgba(255, 0, 0, 0.5); }
        .health-bar { height: 100%; transition: width 0.1s ease-out; }
        #p1-health-container, #p2-health-container { width: 40%; margin-top: 20px; }
        #p1-health-container { float: left; margin-left: 50px; }
        #p2-health-container { float: right; margin-right: 50px; }
        .health-text { position: absolute; top: 0; left: 50%; transform: translateX(-50%); color: white; font-size: 18px; font-weight: bold; text-shadow: 1px 1px 3px #000; line-height: 30px; }
        .player-info { position: absolute; top: 5px; color: white; font-size: 14px; text-shadow: 1px 1px 2px #000; }
        .player-info img { width: 60px; height: 60px; border-radius: 50%; border: 3px solid gold; vertical-align: middle; margin: 0 5px; }
        #p1-info { left: 0; }
        #p2-info { right: 0; text-align: right; }
        #timer { position: absolute; top: 15px; left: 50%; transform: translateX(-50%); color: gold; font-size: 40px; font-weight: bold; background: rgba(0, 0, 0, 0.8); padding: 5px 20px; border-radius: 10px; border: 3px solid red; line-height: 1; }
        #lang-select-screen, #char-select-screen, #end-screen { position: absolute; color: white; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.98); color: white; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; border: 5px solid gold; }
        #lang-select-screen h1 { margin-bottom: 20px; color: white; }
        #lang-select-screen button { background: none; border: none; cursor: pointer; margin: 0 20px; font-size: 30px; }
        #lang-select-screen button img { width: 80px; height: 50px; border: 2px solid white; vertical-align: middle; margin-right: 10px;}
        #char-select-screen h1 { color: gold; text-shadow: 0 0 15px red, 0 0 30px orange; font-size: 64px; margin-bottom: 30px; animation: pulse 1s infinite alternate; }
        .char-button { display: inline-flex; flex-direction: column; align-items: center; background: linear-gradient(to right, #FF4500, #FFD700); color: white; border: 3px solid white; border-radius: 8px; margin: 0 30px; padding: 15px 40px; font-size: 24px; cursor: pointer; box-shadow: 0 5px #900; transition: all 0.1s; }
        .char-button:hover { transform: translateY(-2px); box-shadow: 0 7px #900; }
        .char-button img { width: 120px; height: 120px; border-radius: 50%; margin-bottom: 10px; }
        #end-screen h1 { font-size: 48px; }
        #end-screen button { padding: 15px 40px; font-size: 28px; cursor: pointer; background: linear-gradient(to right, #FF4500, #FFD700); color: white; border: 3px solid white; border-radius: 8px; margin-top: 30px; box-shadow: 0 5px #900; transition: all 0.1s; }
        #round-display { position: absolute; top: 5px; left: 50%; transform: translateX(-50%); color: white; font-size: 24px; font-weight: bold; text-shadow: 1px 1px 3px #000; }
    `);

    // HTML Structure (Kept the same structure, updated text via JS)
    const gameContainer = document.createElement('div');
    gameContainer.id = 'fighting-game-container';
    gameContainer.style.width = `${GAME_WIDTH}px`;
    gameContainer.style.height = `${GAME_HEIGHT}px`;

    gameContainer.innerHTML = `
        <canvas id="game-canvas" width="${GAME_WIDTH}" height="${GAME_HEIGHT}"></canvas>
        <div id="ui-overlay">
            <div id="p1-info" class="player-info">
                <img id="p1-avatar-ui" src="${TT_AVATAR_URL}">
                <span id="p1-name">Tik Tok Minecraft</span>
            </div>
            <div id="p2-info" class="player-info">
                <span id="p2-name">Сонечка</span>
                <img id="p2-avatar-ui" src="${SONECKA_AVATAR_URL}">
            </div>
            <div id="p1-health-container" class="ui-bar">
                <div id="p1-health-bar" class="health-bar" style="background: red; width: 100%;"></div>
                <span id="p1-health-text" class="health-text">100</span>
            </div>
            <div id="p2-health-container" class="ui-bar">
                <div id="p2-health-bar" class="health-bar" style="background: blue; width: 100%;"></div>
                <span id="p2-health-text" class="health-text">100</span>
            </div>
            <div id="timer">60</div>
            <div id="round-display"></div>
        </div>

        <div id="lang-select-screen">
            <h1 id="lang-question-text"></h1>
            <button id="lang-en"><img src="https://flagcdn.com/w80/us.png" alt="English Flag">English</button>
            <button id="lang-ru"><img src="https://flagcdn.com/w80/ru.png" alt="Russian Flag">Русский</button>
        </div>

        <div id="char-select-screen" style="display: none;">
            <h1 id="char-title"></h1>
            <h2 id="char-subtitle"></h2>
            <div>
                <button id="select-tt" class="char-button">
                    <img src="${TT_AVATAR_URL}">
                    <span id="tt-button-text"></span>
                </button>
                <button id="select-sonechka" class="char-button">
                    <img src="${SONECKA_AVATAR_URL}">
                    <span id="sonechka-button-text"></span>
                </button>
            </div>
            <h2 id="controls-title" style="margin-top: 40px;"></h2>
            <p id="p1-controls-text"></p>
            <p id="p2-controls-text"></p>
            <p id="audio-note-text"></p>
        </div>

        <div id="end-screen" style="display: none;">
            <h1 id="end-title"></h1>
            <h2 id="winner-message"></h2>
            <button id="restart-button"></button>
        </div>

        <audio id="bg-music" src="https://www.myinstants.com/media/sounds/kenstheme.mp3" loop></audio>
    `;

    document.body.appendChild(gameContainer);

    // --- GAME SETUP & CONSTANTS ---
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const bgMusic = document.getElementById('bg-music');
    const winnerMessage = document.getElementById('winner-message');

    const GRAVITY = 0.8;
    const MAX_HEALTH = 100;
    const ROUND_TIME = 60;

    let gameState = {
        isRunning: false,
        time: ROUND_TIME,
        timerId: null,
        gameOver: false,
        lastTime: 0,
        deltaTime: 0,
        playerChar: null,
        botChar: null,
        round: 1, // Current round
        ttWins: 0, // Win counter for TT
        sonechkaWins: 0, // Win counter for Sonechka
        selectedPlayerKey: null // Stores the character chosen by the human
    };

    let particles = [];

    // --- L10N FUNCTIONS (unchanged) ---
    function updateText() {
        const t = translations[currentLang];
        document.getElementById('lang-question-text').textContent = t.lang_question;
        document.getElementById('char-title').textContent = t.fight_title;
        document.getElementById('char-subtitle').textContent = t.select_char;
        document.getElementById('tt-button-text').textContent = `${t.play_as} Tik Tok Minecraft`;
        document.getElementById('sonechka-button-text').textContent = `${t.play_as} Сонечка`;
        document.getElementById('controls-title').textContent = t.controls_title;
        document.getElementById('p1-controls-text').textContent = t.p1_controls; // Uses unified controls text
        document.getElementById('p2-controls-text').textContent = t.p2_controls;
        document.getElementById('audio-note-text').textContent = t.audio_note;
        document.getElementById('end-title').textContent = t.ko;
        document.getElementById('restart-button').textContent = t.restart_button;
        updateRoundDisplay(); // Update round display text
    }

    function setCurrentLanguage(lang) {
        currentLang = lang;
        updateText();
        document.getElementById('lang-select-screen').style.display = 'none';
        document.getElementById('char-select-screen').style.display = 'flex';
    }

    // --- AUDIO, PARTICLE SYSTEM & FIGHTER CLASS (Fighter class updated for unified controls) ---

    let audioContext;
    function initAudioContext() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }
    function playSound(frequency, duration, type = 'sine', volume = 0.5) {
        initAudioContext();
        if (!audioContext) return;
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + duration);
    }
    const soundEffects = {
        attack: () => playSound(600, 0.05, 'sawtooth', 0.4),
        hit: () => playSound(180, 0.15, 'square', 0.7),
        ko: () => playSound(100, 0.8, 'square', 0.8),
        jump: () => playSound(660, 0.08, 'sine', 0.3)
    };

    class Particle {
        // ... (Particle class remains unchanged)
        constructor({ x, y, color }) {
            this.x = x;
            this.y = y;
            this.velocity = { x: (Math.random() - 0.5) * 5, y: (Math.random() - 0.5) * 5 - 2 };
            this.size = Math.random() * 5 + 3;
            this.color = color;
            this.opacity = 1;
            this.friction = 0.99;
        }
        update() {
            this.velocity.x *= this.friction;
            this.velocity.y *= this.friction;
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            this.opacity -= 0.03;
            this.size -= 0.1;
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = Math.max(0, this.opacity);
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    class Fighter {
        // Updated controls parameter to match unified keys
        constructor({ x, name, avatarUrl, side }) {
            this.name = name;
            this.width = 80;
            this.height = 120;
            this.position = { x: x, y: GAME_HEIGHT - this.height - STAGE_GROUND };
            this.avatar = new Image();
            this.avatar.src = avatarUrl;
            this.loaded = false;
            this.avatar.onload = () => { this.loaded = true; };
            this.velocity = { x: 0, y: 0 };
            this.isGrounded = true;
            this.health = MAX_HEALTH;
            this.isAttacking = false;
            this.attackBox = {
                position: { x: this.position.x, y: this.position.y },
                width: 100,
                height: 30,
                offset: side === 'left' ? 80 : -100
            };
            // Set unified controls for the human player (Logic handles which fighter is the human)
            this.controls = { left: 'arrowleft', right: 'arrowright', jump: 'arrowup', attack: ' ' };
            this.side = side;
            this.isHit = false;
            this.hitTimer = 0;
            this.knockbackX = 0;
            this.damage = 10;
            this.isBot = false;
            this.wins = 0; // Win count for this fighter
        }

        update(keys) {
            if (!gameState.isRunning || this.health <= 0) return;

            // Apply gravity
            this.position.y += this.velocity.y;
            this.velocity.y += GRAVITY;

            const groundY = GAME_HEIGHT - this.height - STAGE_GROUND;
            if (this.position.y >= groundY) {
                this.position.y = groundY;
                this.velocity.y = 0;
                this.isGrounded = true;
            }

            let moveSpeed = 5;
            this.velocity.x = 0;

            // **IMPROVEMENT: Prevent movement during attack/hit**
            // Human player controls logic uses the unified key mapping regardless of which fighter it is
            if (!this.isAttacking && !this.isHit && !this.isBot && keys) {
                // UNIFIED CONTROLS LOGIC: Always use Arrow Keys and Space for the human player
                if (keys[this.controls.left].pressed) {
                    this.velocity.x = -moveSpeed;
                } else if (keys[this.controls.right].pressed) {
                    this.velocity.x = moveSpeed;
                }
                if (keys[this.controls.jump].pressed && this.isGrounded) {
                    this.velocity.y = -18;
                    this.isGrounded = false;
                    soundEffects.jump();
                }
                if (keys[this.controls.attack].pressed && !this.isAttacking && this.knockbackX === 0) {
                    this.attack();
                }
            } else if (this.isBot && !this.isAttacking && !this.isHit) {
                // Bot velocity set by botUpdate
            }

            // Apply knockback
            if (this.knockbackX !== 0) {
                this.velocity.x += this.knockbackX;
                this.knockbackX *= 0.9;
                if (Math.abs(this.knockbackX) < 0.5) this.knockbackX = 0;
            }

            this.position.x += this.velocity.x;

            if (this.position.x < 0) this.position.x = 0;
            if (this.position.x + this.width > GAME_WIDTH) this.position.x = GAME_WIDTH - this.width;

            this.attackBox.position.x = this.position.x + this.attackBox.offset;
            this.attackBox.position.y = this.position.y + 30;

            if (this.isHit) {
                this.hitTimer += gameState.deltaTime;
                if (this.hitTimer > 200) {
                    this.isHit = false;
                    this.hitTimer = 0;
                }
            }
        }

        attack() {
            // Prevent multiple attack calls during the attack window
            if (this.isAttacking) return;

            this.isAttacking = true;
            soundEffects.attack();

            // Attack window duration
            setTimeout(() => {
                this.isAttacking = false;
            }, 250); // Slightly longer attack animation time
        }

        takeHit(damage, attackerSide) {
            if (this.health <= 0 || this.isHit) return;
            this.health = Math.max(0, this.health - damage);
            this.isHit = true;
            this.hitTimer = 0; // Reset timer on new hit
            soundEffects.hit();
            this.updateUI();

            const knockbackForce = 18;
            this.knockbackX = attackerSide === 'left' ? knockbackForce : -knockbackForce;

            for (let i = 0; i < 15; i++) {
                particles.push(new Particle({
                    x: this.position.x + this.width / 2,
                    y: this.position.y + this.height / 2,
                    color: 'rgba(255, 100, 0, 1)'
                }));
            }

            if (this.health === 0) {
                // Do not call endGame immediately, set flag for main loop to handle round end
                gameState.gameOver = true;
            }
        }

        updateUI() {
            const healthPercent = (this.health / MAX_HEALTH) * 100;
            const barId = this.side === 'left' ? 'p1-health-bar' : 'p2-health-bar';
            const textId = this.side === 'left' ? 'p1-health-text' : 'p2-health-text';
            const nameId = this.side === 'left' ? 'p1-name' : 'p2-name';

            document.getElementById(barId).style.width = `${healthPercent}%`;
            document.getElementById(textId).textContent = this.health;
            document.getElementById(nameId).textContent = this.name + (this.isBot ? " (BOT)" : "");
        }

        draw() {
            // ... (Draw logic remains unchanged)
            const spriteSize = 100;
            let avatarX = this.position.x + (this.width - spriteSize) / 2;
            let avatarY = this.position.y + (this.height - spriteSize) / 2;
            let drawW = spriteSize;
            let drawH = spriteSize;
            let hitRecoilY = 0;

            // Guard against null reference if one fighter is somehow not initialized in update() loop
            const opponentX = this.side === 'left' && p2 ? p2.position.x : (p1 ? p1.position.x : this.position.x + 1);
            const isFacingRight = this.position.x < opponentX;

            // **IMPROVEMENT: Visual Attack/Hit effects**
            if (this.isAttacking) {
                drawW *= 1.1;
                drawH *= 1.1;
                // Simple forward lunge visual
                avatarX += isFacingRight ? 10 : -10;
            }

            if (this.isHit) {
                // Vertical jiggle/recoil visual
                hitRecoilY = Math.sin(this.hitTimer / 50) * 5;
            }

            ctx.save();

            // Flipping logic
            if (!isFacingRight) {
                ctx.translate(avatarX + drawW, 0); // Move origin to the right edge of the drawn sprite
                ctx.scale(-1, 1);
                // Draw the image at (0, Y + recoil) after translation/scaling
                ctx.drawImage(this.avatar, 0, avatarY + hitRecoilY, drawW, drawH);
            } else {
                ctx.drawImage(this.avatar, avatarX, avatarY + hitRecoilY, drawW, drawH);
            }

            ctx.restore();

            // Hit state (flashing effect)
            if (this.isHit) {
                ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(Math.sin(performance.now() / 30))})`; // Very fast white flash
                ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
            }

            // Attack state (Hitbox visual)
            if (this.isAttacking) {
                ctx.fillStyle = 'rgba(255, 255, 0, 0.2)';
                ctx.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
            }
        }
    }


    // --- AI LOGIC (BOT) (Unchanged) ---

    function botUpdate(bot, target) {
        if (bot.isHit || bot.knockbackX !== 0 || bot.isAttacking) {
            bot.update(null); // Only physics/state updates
            return;
        }

        const distance = target.position.x - bot.position.x;
        const absDistance = Math.abs(distance);
        const attackRange = bot.width + 50;

        // 1. Attack Logic
        if (absDistance < attackRange && bot.isGrounded && Math.random() < 0.1) {
            bot.attack();
        }

        // 2. Movement Logic
        const followDistance = 150;
        const tooCloseDistance = 50;

        if (absDistance > followDistance) {
            // Chase
            bot.velocity.x = distance > 0 ? 4 : -4;
        } else if (absDistance < tooCloseDistance) {
            // Step back (sometimes)
            if (Math.random() < 0.05) {
                bot.velocity.x = distance > 0 ? -2 : 2;
            } else {
                bot.velocity.x = 0;
            }
        } else {
            // Stay within range/stop
            bot.velocity.x = 0;
        }

        // 3. Jump Logic (Simple random jump/avoidance)
        if (bot.isGrounded && Math.random() < 0.005) {
            bot.velocity.y = -18;
            bot.isGrounded = false;
        }

        // Apply bot-set velocity
        bot.position.x += bot.velocity.x;
        bot.update(null); // Update physics/collision/boundaries
    }

    // --- GAME STATE & INSTANTIATION (Updated fighterData and resetGame logic) ---

    // Updated keys to only track the UNIFIED controls
    const keys = {
        'arrowleft': { pressed: false }, 'arrowright': { pressed: false }, 'arrowup': { pressed: false }, ' ': { pressed: false }
    };

    // Removed specific P1/P2 controls from data, as they are now unified/bot
    const fighterData = {
        tt: {
            name: 'Tik Tok Minecraft',
            avatarUrl: TT_AVATAR_URL,
            side: 'left',
            x: 100
        },
        sonechka: {
            name: 'Сонечка',
            avatarUrl: SONECKA_AVATAR_URL,
            side: 'right',
            x: GAME_WIDTH - 100 - 80
        }
    };

    let p1, p2;

    function updateRoundDisplay() {
        const t = translations[currentLang];
        document.getElementById('round-display').textContent = `${t.round} ${gameState.round}/${TOTAL_ROUNDS} | TT: ${gameState.ttWins} - S: ${gameState.sonechkaWins}`;
    }

    // New function to reset the round state (health, position, etc.)
    function resetRound() {
        p1.health = MAX_HEALTH;
        p2.health = MAX_HEALTH;

        // Reset positions
        p1.position = { x: fighterData.tt.x, y: GAME_HEIGHT - p1.height - STAGE_GROUND };
        p2.position = { x: fighterData.sonechka.x, y: GAME_HEIGHT - p2.height - STAGE_GROUND };

        // Reset velocity/state
        p1.velocity = { x: 0, y: 0 };
        p2.velocity = { x: 0, y: 0 };
        p1.isAttacking = p2.isAttacking = false;
        p1.isHit = p2.isHit = false;
        p1.knockbackX = p2.knockbackX = 0;

        p1.updateUI();
        p2.updateUI();

        gameState.gameOver = false;
        gameState.time = ROUND_TIME;
        document.getElementById('timer').textContent = ROUND_TIME;
        particles = [];
    }


    function setupGame(selectedCharKey) {
        // This function runs once at the start of the match
        gameState.selectedPlayerKey = selectedCharKey;
        gameState.round = 1;
        gameState.ttWins = 0;
        gameState.sonechkaWins = 0;

        const p1_data = fighterData.tt;
        const p2_data = fighterData.sonechka;

        p1 = new Fighter(p1_data);
        p2 = new Fighter(p2_data);

        // Assign player/bot roles based on selection
        if (selectedCharKey === 'tt') {
            gameState.playerChar = p1;
            gameState.botChar = p2;
            p2.isBot = true;
        } else { // selectedCharKey === 'sonechka'
            gameState.playerChar = p2;
            gameState.botChar = p1;
            p1.isBot = true;
        }

        // Initialize display
        updateRoundDisplay();
        resetRound();
    }


    // --- COLLISION LOGIC (Unchanged) ---

    function rectangularCollision({ rectangle1, rectangle2 }) {
        return (
            rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
            rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
            rectangle1.position.y + rectangle1.height >= rectangle2.position.y &&
            rectangle1.position.y <= rectangle2.position.y + rectangle2.height
        );
    }

    function checkAttacks(attacker, target) {
        // IMPROVEMENT: Attack hits only if target is not currently being hit AND attacker is in attack state
        if (attacker.isAttacking && !target.isHit) {
            const hit = rectangularCollision({ rectangle1: attacker.attackBox, rectangle2: target });
            if (hit) {
                target.takeHit(attacker.damage, attacker.side);
                attacker.isAttacking = false; // Attack only hits once per animation
            }
        }
    }

    // --- GAME LOOP & RENDER (Unchanged logic, just references updated fighter variables) ---

    function drawBackground() {
        ctx.fillStyle = '#696969';
        ctx.beginPath();
        ctx.moveTo(0, GAME_HEIGHT - STAGE_GROUND - 100);
        ctx.lineTo(200, GAME_HEIGHT - STAGE_GROUND - 220);
        ctx.lineTo(450, GAME_HEIGHT - STAGE_GROUND - 150);
        ctx.lineTo(GAME_WIDTH, GAME_HEIGHT - STAGE_GROUND - 200);
        ctx.lineTo(GAME_WIDTH, GAME_HEIGHT - STAGE_GROUND);
        ctx.lineTo(0, GAME_HEIGHT - STAGE_GROUND);
        ctx.fill();

        const groundY = GAME_HEIGHT - STAGE_GROUND;
        const groundGradient = ctx.createLinearGradient(0, groundY, 0, GAME_HEIGHT);
        groundGradient.addColorStop(0, '#556B2F');
        groundGradient.addColorStop(1, '#8B4513');
        ctx.fillStyle = groundGradient;
        ctx.fillRect(0, groundY, GAME_WIDTH, STAGE_GROUND);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(0, groundY, GAME_WIDTH, 5);
    }

    function render() {
        ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        drawBackground();

        if (p1) p1.draw();
        if (p2) p2.draw();

        particles.forEach((p, i) => {
            p.update();
            p.draw();
            if (p.opacity <= 0.05 || p.size <= 1) {
                particles.splice(i, 1);
            }
        });
    }

    function update() {
        if (!gameState.isRunning || gameState.gameOver) return;

        // Player (Human) update uses keys, Bot update calls its own logic
        if (!gameState.playerChar.isBot) {
            gameState.playerChar.update(keys);
            botUpdate(gameState.botChar, gameState.playerChar);
        } else { // Human is P2
            gameState.botChar.update(keys); // BotChar is now P1, but gets the keys object
            botUpdate(gameState.playerChar, gameState.botChar); // PlayerChar is P2, and is the bot's target
        }

        // Correcting the check: playerChar is the human, botChar is the bot regardless of P1/P2
        if (gameState.playerChar.isBot) { // If player is the bot (i.e., the human chose Sonechka, which makes P1 the bot)
            gameState.botChar.update(keys); // P1 (Tik Tok) is the human, P2 (Sonechka) is the bot
            botUpdate(gameState.playerChar, gameState.botChar); // P2 (Sonechka) is the human, P1 (Tik Tok) is the bot

            // Re-assigning for clarity and to follow the original structure, though the underlying logic is better:
            // Let's rely on p1 and p2 directly for attack checks, as they are static.
            p1.update(p1.isBot ? null : keys);
            p2.update(p2.isBot ? null : keys);

            if (p1.isBot) botUpdate(p1, p2);
            if (p2.isBot) botUpdate(p2, p1);


        } else { // Human chose Tik Tok (p1 is human, p2 is bot)
            gameState.playerChar.update(keys);
            botUpdate(gameState.botChar, gameState.playerChar);
        }

        // Apply attack checks
        checkAttacks(p1, p2);
        checkAttacks(p2, p1);

        if (p1.health <= 0 || p2.health <= 0) {
            gameState.gameOver = true;
            endRound(p1.health <= 0 ? p2 : p1); // Pass the winner (or who didn't lose)
        }
    }

    function gameLoop(currentTime) {
        const elapsed = currentTime - gameState.lastTime;
        gameState.deltaTime = elapsed;
        gameState.lastTime = currentTime;

        update();
        render();

        if (!gameState.gameOver) {
            window.requestAnimationFrame(gameLoop);
        }
    }

    // --- GAME CONTROL FUNCTIONS (Updated for round system) ---

    function startTimer() {
        if (gameState.timerId) clearInterval(gameState.timerId);
        const timerDisplay = document.getElementById('timer');
        gameState.time = ROUND_TIME;
        timerDisplay.textContent = gameState.time;
        gameState.timerId = setInterval(() => {
            if (!gameState.isRunning || gameState.gameOver) {
                clearInterval(gameState.timerId);
                return;
            }
            gameState.time--;
            timerDisplay.textContent = gameState.time;
            if (gameState.time <= 0) {
                clearInterval(gameState.timerId);
                gameState.gameOver = true;
                endRound(null, true); // Time up, no KO winner
            }
        }, 1000);
    }

    function startGame(selectedCharKey) {
        document.getElementById('char-select-screen').style.display = 'none';
        document.getElementById('end-screen').style.display = 'none';

        // Only run setupGame if it's the very first time (or after a full match ends)
        if (gameState.round === 1 && gameState.ttWins === 0 && gameState.sonechkaWins === 0) {
            setupGame(selectedCharKey);
        } else {
            // Otherwise, it's a new round in the same match
            resetRound();
        }

        gameState.isRunning = true;
        startTimer();
        gameState.lastTime = performance.now();
        window.requestAnimationFrame(gameLoop);
    }

    function endRound(winner, timeUp = false) {
        gameState.isRunning = false;
        clearInterval(gameState.timerId);
        const t = translations[currentLang];

        let message = '';

        if (timeUp) {
            if (p1.health > p2.health) {
                winner = p1;
                message = `${winner.name} ${t.time_advantage}`;
            } else if (p2.health > p1.health) {
                winner = p2;
                message = `${winner.name} ${t.time_advantage}`;
            } else {
                message = t.draw_message;
            }
        } else {
            // KO win
            message = `${winner.name} ${t.ko_message}`;
        }

        if (winner) {
            if (winner === p1) {
                gameState.ttWins++;
            } else if (winner === p2) {
                gameState.sonechkaWins++;
            }
        }

        // Update win counters and round display before moving on
        updateRoundDisplay();

        // Check for match end
        if (gameState.round >= TOTAL_ROUNDS || gameState.ttWins >= Math.ceil(TOTAL_ROUNDS/2) || gameState.sonechkaWins >= Math.ceil(TOTAL_ROUNDS/2) ) {
            // Final Game Over
            let finalWinner = null;
            if (gameState.ttWins > gameState.sonechkaWins) finalWinner = p1;
            else if (gameState.sonechkaWins > gameState.ttWins) finalWinner = p2;

            if (finalWinner) {
                document.getElementById('winner-message').textContent = `${finalWinner.name} ${t.match_over}! (${gameState.ttWins}-${gameState.sonechkaWins})`;
            } else {
                document.getElementById('winner-message').textContent = `${t.match_over}! ${t.draw_message} (${gameState.ttWins}-${gameState.sonechkaWins})`;
            }
            document.getElementById('end-title').textContent = t.game_over;
            document.getElementById('restart-button').textContent = t.restart_button.split(' / ')[1]; // PLAY AGAIN
            document.getElementById('end-screen').style.display = 'flex';

            // Next click will go back to char select
            document.getElementById('restart-button').onclick = () => {
                document.getElementById('char-select-screen').style.display = 'flex';
                document.getElementById('end-screen').style.display = 'none';
            };


        } else {
            // Next Round
            gameState.round++;
            document.getElementById('winner-message').textContent = message + ` - ${t.round} ${gameState.round}`;
            document.getElementById('end-title').textContent = t.ko;
            document.getElementById('restart-button').textContent = t.restart_button.split(' / ')[0]; // CONTINUE
            document.getElementById('end-screen').style.display = 'flex';

            // Next click starts the next round
            document.getElementById('restart-button').onclick = () => {
                startGame(gameState.selectedPlayerKey);
            };
        }
    }

    // --- EVENT LISTENERS BINDING (Updated to use startGame with selectedCharKey) ---

    document.getElementById('lang-en').addEventListener('click', () => setCurrentLanguage('en'));
    document.getElementById('lang-ru').addEventListener('click', () => setCurrentLanguage('ru'));

    document.getElementById('select-tt').addEventListener('click', () => {
        // First round start, setup the game state
        setupGame('tt');
        startGame('tt');
    });
    document.getElementById('select-sonechka').addEventListener('click', () => {
        // First round start, setup the game state
        setupGame('sonechka');
        startGame('sonechka');
    });

    // Initial click handler for restart button (for when the match is fully over)
    document.getElementById('restart-button').addEventListener('click', () => {
        if (!gameState.isRunning && gameState.round > TOTAL_ROUNDS) { // Only go back to char select if match is truly over
            document.getElementById('char-select-screen').style.display = 'flex';
            document.getElementById('end-screen').style.display = 'none';
        }
    });


    // **UNIFIED KEYBOARD LISTENER LOGIC**
    window.addEventListener('keydown', (event) => {
        const key = event.key.toLowerCase();
        // Check if the key is one of the unified controls
        if (keys[key] && gameState.isRunning) {
            keys[key].pressed = true;
            // Prevent default action for game keys
            if (['arrowleft', 'arrowright', 'arrowup', ' '].includes(key)) {
                event.preventDefault();
            }
        }
    });

    window.addEventListener('keyup', (event) => {
        const key = event.key.toLowerCase();
        if (keys[key]) {
            keys[key].pressed = false;
        }
    });

    document.body.addEventListener('click', () => {
        initAudioContext();
        if (bgMusic.paused) {
            bgMusic.play().catch(e => console.error("Autoplay failed:", e));
        }
    }, { once: true });

    // Initial setup
    updateText();
    document.getElementById('lang-select-screen').style.display = 'flex';
})();