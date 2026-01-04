// ==UserScript==
// @name         Drawaria.online Dandy's World Mod
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  A brand new RPG-Game inside drawaria.online featuring the characters of Dandy's World!
// @author       ChatGPT & Dandy's World Creator
// @include      https://drawaria.online/*
// @include      https://*.drawaria.online/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @connect      images.unsplash.com
// @connect      ibb.co
// @connect      myinstants.com
// @connect      picsum.photos
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554687/Drawariaonline%20Dandy%27s%20World%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/554687/Drawariaonline%20Dandy%27s%20World%20Mod.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =====================================================================
    // === SECCIÓN DE DEFINICIÓN DE NIVELES GLOBALES (DANDY'S WORLD) ===
    // =====================================================================

    // --- CONSTANTES GLOBALES INYECTADAS EN CADA NIVEL ---
    const AVATAR_HEIGHT_PX_CONST = 64;
    const VIEWBOX_WIDTH_CONST = 800;
    const LEVEL_END_X_CONST = VIEWBOX_WIDTH_CONST + 220;
    const LEVEL_START_X_CONST = 50;
    const NPC_WIDTH_DEFAULT_CONST = 100;
    const AVATAR_GROUND_Y_CONST = 450 - AVATAR_HEIGHT_PX_CONST;


    // --- PERSONAJES Y ASSETS BASE (Monitor Girl como Dandy's Host) ---
    const DANDY_HOST_SVG = `
        <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
            <rect x="150" y="50" width="200" height="150" rx="15" ry="15" fill="#46D899" stroke="#000000" stroke-width="5"/>
            <rect x="160" y="60" width="180" height="130" fill="#000000"/>
            <path d="M 190 120 A 10 10 0 1 1 210 120 L 210 130 Q 200 140 190 130 Z" fill="#46D899"/>
            <path d="M 290 120 A 10 10 0 1 1 310 120 L 310 130 Q 300 140 290 130 Z" fill="#46D899"/>
            <path d="M 220 160 Q 250 170 280 160" stroke="#46D899" stroke-width="4" fill="none"/>
            <path d="M 250 200 L 250 250" stroke="#000000" stroke-width="8"/>
            <path d="M 210 250 L 200 350 L 300 350 L 290 250" fill="#757575"/>
            <circle cx="200" cy="350" r="10" fill="#46D899" stroke="#000000" stroke-width="3"/>
            <circle cx="300" cy="350" r="10" fill="#46D899" stroke="#000000" stroke-width="3"/>
        </svg>
    `;

    // --- BASE TEMPLATE PARA NIVELES (reemplaza la lógica repetida) ---
    function createLevelTemplate(levelTitle, musicUrl, backgroundSvgs, npcData, finalDialogue, isSwimming = false, windForce = 0) {
        return `
// ==UserScript==
// @name         Drawaria Game Level: ${levelTitle}
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  ${levelTitle} - A Dandy's World Adventure.
// @author       ChatGPT & Dandy's World Creator
// @match        https://drawaria.online/
// @match        https://*.drawaria.online/*
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. LEVEL METADATA AND CONSTANTS (FIXED) ---
    const LEVEL_TITLE = "${levelTitle}";
    const BACKGROUND_MUSIC_URL = "${musicUrl}";

    // Core Game Constants (Injected from Outer Scope)
    const NPC_WIDTH_DEFAULT = ${NPC_WIDTH_DEFAULT_CONST};
    const AVATAR_HEIGHT_PX = ${AVATAR_HEIGHT_PX_CONST};
    const AVATAR_GROUND_Y = ${AVATAR_GROUND_Y_CONST};
    const VIEWBOX_WIDTH = ${VIEWBOX_WIDTH_CONST};
    const LEVEL_END_X = ${LEVEL_END_X_CONST};
    const LEVEL_START_X = ${LEVEL_START_X_CONST};

    const DIALOGUE_BOX_ID = 'centered-dialogue-box';
    const MAX_TRANSITIONS = ${backgroundSvgs.length - 1};

    // --- 2. SVG ASSETS AND NPC DATA ---
    const BACKGROUND_SVGS = [
        ${backgroundSvgs.map(svg => '`' + svg + '`').join(',\n        ')}
    ];

    const NPC_DATA = ${JSON.stringify(npcData, null, 8).replace(/"(function.*?)"/gs, '$1')};

    const DIALOGUE_LINES_FINAL = ${JSON.stringify(finalDialogue)};

    // --- 3. STATE AND GAME VARIABLES ---
    let mapContainer = null;
    let backgroundMusic = null;
    let musicButton = null;
    let currentMapIndex = 0;
    let phasesCompleted = 0;
    let avatarX = LEVEL_START_X;
    let avatarY = AVATAR_GROUND_Y;
    let avatarVX = 0;
    let avatarVY = 0;
    let isJumping = false;
    let isLevelComplete = false;
    let selfAvatarImage = null;
    let keys = {};
    let isDialogueActive = false;
    let currentDialogueIndex = 0;
    let dialogueBox = null;
    let dialogueName = null;
    let dialogueText = null;
    let activeNPCDialogue = null;


    // --- 4. ENVIRONMENT AND SETUP ---

    function setupEnvironment() {
        const originalBody = document.body;

        selfAvatarImage = document.querySelector('#selfavatarimage');
        if (!selfAvatarImage) {
            setTimeout(setupEnvironment, 100);
            return;
        }

        mapContainer = document.createElement('div');
        mapContainer.id = 'map-container';
        mapContainer.style.cssText = 'position: absolute; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 1; overflow: hidden; background-color: #000000;';

        originalBody.innerHTML = '';
        originalBody.style.background = 'none';
        originalBody.appendChild(mapContainer);
        originalBody.appendChild(selfAvatarImage);

        selfAvatarImage.style.position = 'absolute';
        selfAvatarImage.style.zIndex = '1000';
        selfAvatarImage.style.pointerEvents = 'none';
        selfAvatarImage.style.display = 'block';
        selfAvatarImage.style.width = AVATAR_HEIGHT_PX + 'px';
        selfAvatarImage.style.height = AVATAR_HEIGHT_PX + 'px';

        createDialogueBox();
        updateMapSVG();
        initializeMusic();
        createMusicButton();
        updateAvatar();
    }

    function initializeMusic() {
        backgroundMusic = new Audio(BACKGROUND_MUSIC_URL);
        backgroundMusic.loop = true;
        backgroundMusic.volume = 0.5;
    }

    function createMusicButton() {
        musicButton = document.createElement('button');
        musicButton.textContent = LEVEL_TITLE + " Music";
        musicButton.style.cssText = 'position: absolute; top: 20px; right: 20px; padding: 10px 15px; background-color: #34495e; color: white; border: 2px solid white; border-radius: 5px; cursor: pointer; z-index: 10002;';
        musicButton.addEventListener('click', startMusic);
        document.body.appendChild(musicButton);
    }

    function startMusic() {
        if (backgroundMusic) {
            backgroundMusic.play().then(() => {
                musicButton.style.display = 'none';
                musicButton.removeEventListener('click', startMusic);
            }).catch(e => {
                console.error("Failed to play music on click:", e);
                musicButton.textContent = "Music Error (Click to retry)";
            });
        }
    }

    function updateMapSVG() {
        if (currentMapIndex < BACKGROUND_SVGS.length) {
            mapContainer.innerHTML = BACKGROUND_SVGS[currentMapIndex];
        }
        injectNPCs();
    }

    function removeAllNPCs() {
        document.querySelectorAll('.npc-clickarea').forEach(npc => npc.remove());
    }

    function injectNPCs() {
        removeAllNPCs();

        const currentNPCData = NPC_DATA[currentMapIndex];
        if (!currentNPCData) return;

        const npcs = Array.isArray(currentNPCData) ? currentNPCData : [currentNPCData];

        npcs.forEach(npcData => {
            const isFinalNPC = npcData.final_npc;
            const size = NPC_WIDTH_DEFAULT;
            const x = npcData.initial_x || npcData.x;
            const y = npcData.initial_y || npcData.y || AVATAR_GROUND_Y;

            const clickArea = document.createElement('div');
            clickArea.id = \`${npcData.char_id}-clickarea\`;
            clickArea.className = 'npc-clickarea';

            clickArea.style.cssText = \`
                position: absolute;
                top: \${y}px;
                left: \${x}px;
                width: \${size}px;
                height: \${size}px;
                z-index: 999;
                cursor: pointer;
                display: block;
            \`;

            const svgContainer = document.createElement('div');
            svgContainer.id = npcData.char_id;
            svgContainer.innerHTML = npcData.svg_content;

            svgContainer.style.cssText = \`
                width: 100%;
                height: 100%;
                \${isFinalNPC && npcData.scale ? \`transform: scale(\${npcData.scale}); transform-origin: top left;\` : ''}
            \`;

            clickArea.appendChild(svgContainer);
            clickArea.addEventListener('click', () => startDialogue(npcData));
            document.body.appendChild(clickArea);
        });
    }

    // --- 5. NPC AND DIALOGUE LOGIC ---
    function createDialogueBox() {
        dialogueBox = document.createElement('div');
        dialogueBox.id = DIALOGUE_BOX_ID;
        dialogueName = document.createElement('div');
        dialogueText = document.createElement('div');

        // Styles for Dandy's World Dialogue Box (Digital/Neon Theme)
        dialogueBox.style.cssText = 'position: absolute; top: 50px; left: 50%; transform: translateX(-50%); width: 80%; max-width: 600px; min-height: 80px; padding: 15px 25px; background: rgba(0, 0, 0, 0.9); border: 5px solid #46D899; box-shadow: 0 0 20px rgba(70, 216, 153, 0.9); border-radius: 10px; font-family: "Courier New", monospace; z-index: 10001; display: none; cursor: pointer;';
        dialogueName.style.cssText = 'font-weight: bold; font-size: 20px; margin-bottom: 5px; color: #46D899; text-shadow: 1px 1px 2px #000;';
        dialogueText.style.cssText = 'font-size: 18px; color: white; text-shadow: 1px 1px 2px #000;';

        dialogueBox.appendChild(dialogueName);
        dialogueBox.appendChild(dialogueText);
        document.body.appendChild(dialogueBox);
    }

    function startDialogue(npcData) {
        if (isDialogueActive || isLevelComplete) return;
        isDialogueActive = true;
        currentDialogueIndex = 0;
        activeNPCDialogue = npcData.dialogue;

        dialogueBox.style.display = 'block';
        dialogueBox.style.pointerEvents = 'auto';

        dialogueBox.removeEventListener('click', processDialogue);
        dialogueBox.removeEventListener('click', endDialogue);

        processDialogue();
        dialogueBox.addEventListener('click', processDialogue);
    }

    function processDialogue() {
        if (!isDialogueActive || !activeNPCDialogue) return;

        const lines = activeNPCDialogue;

        if (currentDialogueIndex >= lines.length) {
            endDialogue();
            return;
        }

        const line = lines[currentDialogueIndex];
        const parts = line.split(':');
        dialogueName.textContent = \`\${parts[0]}:\`;
        dialogueText.textContent = parts.slice(1).join(':').trim();

        currentDialogueIndex++;

        if (currentDialogueIndex >= lines.length) {
            dialogueBox.removeEventListener('click', processDialogue);
            dialogueBox.addEventListener('click', endDialogue);
        }
    }

    function endDialogue() {
        isDialogueActive = false;
        dialogueBox.style.display = 'none';
        currentDialogueIndex = 0;
        dialogueBox.style.pointerEvents = 'none';

        if (currentMapIndex === BACKGROUND_SVGS.length - 1) {
            isLevelComplete = true;

            mapContainer.innerHTML = \`
                <div id="victory-message" style="position:absolute; top:40%; left:50%; transform:translate(-50%, -50%); color:#46D899; font-size:36px; text-align:center; font-family: 'Courier New', monospace; text-shadow: 0 0 15px #46D899;">
                    LEVEL COMPLETE: \${LEVEL_TITLE}
                    <br>
                    \${DIALOGUE_LINES_FINAL[DIALOGUE_LINES_FINAL.length - 1].text.toUpperCase()}
                </div>
            \`;
            createBackToLevelsButton();

            if (backgroundMusic) backgroundMusic.pause();
            if (musicButton) musicButton.style.display = 'none';
            removeAllNPCs();

            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        }
    }

    function createBackToLevelsButton() {
        const button = document.createElement('button');
        button.textContent = "BACK TO LEVELS";
        button.style.cssText = 'position: absolute; top: 60%; left: 50%; transform: translateX(-50%); padding: 15px 25px; background-color: #000; color: #46D899; border: 4px solid #46D899; border-radius: 8px; cursor: pointer; z-index: 10003; font-size: 24px; font-family: "Courier New", monospace; text-transform: uppercase; box-shadow: 0 0 20px rgba(70, 216, 153, 0.7);';
        button.addEventListener('click', () => { window.location.reload(); });
        document.body.appendChild(button);
    }


    // --- 6. GAME LOOP AND MOVEMENT LOGIC ---

    function advanceMap() {
        phasesCompleted++;
        if (currentMapIndex < BACKGROUND_SVGS.length - 1) {
            currentMapIndex++;
            updateMapSVG();
        }
    }

    function updateAvatar() {
        if (isLevelComplete) return;

        const GRAVITY = ${isSwimming ? 0.1 : 0.5};
        const JUMP_HEIGHT = ${isSwimming ? 8 : 15};
        const MAX_SPEED = 10;
        const FRICTION = ${isSwimming ? 0.95 : 0.9};
        const WIND_FORCE = ${windForce};

        if (isDialogueActive) {
            avatarVX = 0; avatarVY = 0; isJumping = false;
        } else {
            avatarVY += GRAVITY;
            avatarVX -= WIND_FORCE;

            if (keys['ArrowRight']) {
                avatarVX = Math.min(avatarVX + 0.5, MAX_SPEED);
            } else if (keys['ArrowLeft']) {
                avatarVX = Math.max(avatarVX - 0.5, -MAX_SPEED);
            } else {
                avatarVX *= FRICTION;
            }

            if (keys['ArrowUp'] && !isJumping) {
                avatarVY = -JUMP_HEIGHT;
                isJumping = true;
            }
        }

        avatarX += avatarVX;
        avatarY += avatarVY;

        if (avatarY > AVATAR_GROUND_Y) {
            avatarY = AVATAR_GROUND_Y;
            avatarVY = 0;
            isJumping = false;
        }

        if (avatarX > LEVEL_END_X) {
            avatarX = LEVEL_START_X;
            if (phasesCompleted < MAX_TRANSITIONS) {
                advanceMap();
            }
        }

        if (avatarX < 0) {
            avatarX = 0;
            avatarVX = 0;
        }

        drawAvatar(avatarX, avatarY);
        requestAnimationFrame(updateAvatar);
    }

    function handleKeyDown(event) { keys[event.key] = true; }
    function handleKeyUp(event) { keys[event.key] = false; }
    function drawAvatar(x, y) {
        if (selfAvatarImage) {
            selfAvatarImage.style.transform = \`translate(\${x}px, \${y}px) scale(1)\`;
            selfAvatarImage.style.border = 'none';
            selfAvatarImage.style.boxShadow = 'none';
        }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    setTimeout(setupEnvironment, 0);

})();
        `;
    }

    // =====================================================================
    // === NIVELES DE DANDY'S WORLD (Definiciones Específicas) ===
    // =====================================================================

    // --- LEVEL 1: THE START (MONITOR GIRL) ---
    const LVL1_BGS = [
        `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="500" fill="#111"/><path d="M 0 450 H 800" stroke="#46D899" stroke-width="5"/></svg>`,
        `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="500" fill="#111"/><rect x="50" y="400" width="700" height="50" fill="#222" stroke="#46D899" stroke-width="2"/><path d="M 0 450 H 800" stroke="#46D899" stroke-width="5"/></svg>`,
        `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="500" fill="#111"/><rect x="50" y="300" width="100" height="150" fill="#222" stroke="#46D899" stroke-width="2"/><rect x="650" y="350" width="100" height="100" fill="#222" stroke="#46D899" stroke-width="2"/><path d="M 0 450 H 800" stroke="#46D899" stroke-width="5"/></svg>`
    ];
    const LVL1_NPC_DATA = { 0: { char_id: 'DandyHost', name: 'Dandy Host', svg_content: DANDY_HOST_SVG, initial_x: 650, dialogue: ["Dandy Host: Welcome to Dandy's World. A unique adventure awaits.", "Dandy Host: Move right to proceed. Jump with UP. Find the exit to the right three times.", "Dandy Host: You must first prove your mastery of movement. Good luck!"] } };
    const LVL1_FINAL_DIALOGUE = [{ name: 'Dandy Host', text: "Excellent! You are ready to meet the residents of this world." }];

    window.startGameLevel1 = new Function(createLevelTemplate(
        "The Start - Dandy's World", 'https://www.myinstants.com/media/sounds/mad-pac-rabios-level-1-music.mp3', LVL1_BGS, LVL1_NPC_DATA, LVL1_FINAL_DIALOGUE
    ));

    // --- LEVEL 2: GHOSTALANA'S HAUNT ---
    const GHOSTALANA_SVG = `<svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg"><path d="M 250 50 C 150 50, 100 250, 150 350 L 350 350 C 400 250, 350 50, 250 50 Z" fill="#88FFFF" stroke="#000" stroke-width="5"/><circle cx="200" cy="150" r="15" fill="#000"/><circle cx="300" cy="150" r="15" fill="#000"/><path d="M 200 250 Q 250 280 300 250" fill="none" stroke="#000" stroke-width="5"/><path d="M 150 350 L 160 380 L 170 350 L 180 380 L 190 350 L 200 380 L 210 350 L 220 380 L 230 350 L 240 380 L 250 350 L 260 380 L 270 350 L 280 380 L 290 350 L 300 380 L 310 350 L 320 380 L 330 350 L 340 380 L 350 350" fill="#88FFFF" stroke="#000" stroke-width="5"/></svg>`;
    const LVL2_BGS = [`<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="500" fill="#333"/><path d="M 0 450 H 800" stroke="#777" stroke-width="5"/><path d="M 50 450 L 100 400 L 150 450 Z" fill="#444"/></svg>`];
    const LVL2_NPC_DATA = { 0: { char_id: 'Ghostalana', name: 'Ghostalana', svg_content: GHOSTALANA_SVG, initial_x: 650, dialogue: ["Ghostalana: Shhh... this is my eternal slumber. Be quiet.", "Ghostalana: The key to the next level is not in the light, but the shadow."] } };
    const LVL2_FINAL_DIALOGUE = [{ name: 'Ghostalana', text: "You disturbed my peace, but you found the path. Farewell." }];

    window.startGameLevel2 = new Function(createLevelTemplate(
        "Ghostalana's Haunt", 'https://www.myinstants.com/media/sounds/robbie-williams-shes-madonna.mp3', LVL2_BGS, LVL2_NPC_DATA, LVL2_FINAL_DIALOGUE
    ));

    // --- LEVEL 3: THE SWEET FACTORY ---
    const GINGERBREAD_LADY_SVG = `<svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg"><circle cx="250" cy="250" r="150" fill="#996633" stroke="#553311" stroke-width="5"/><rect x="200" y="100" width="100" height="50" fill="white" stroke="#553311" stroke-width="3"/><path d="M 180 280 Q 250 350 320 280" fill="red" stroke="#553311" stroke-width="5"/><circle cx="220" cy="220" r="10" fill="red"/><circle cx="280" cy="220" r="10" fill="red"/></svg>`;
    const LVL3_BGS = [`<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="500" fill="#FFC0CB"/><path d="M 0 450 H 800" stroke="#FF69B4" stroke-width="10"/><circle cx="100" cy="400" r="20" fill="red"/><rect x="300" y="350" width="100" height="100" fill="white"/></svg>`];
    const LVL3_NPC_DATA = { 0: { char_id: 'GingerbreadLady', name: 'Gingerbread Lady', svg_content: GINGERBREAD_LADY_SVG, initial_x: 650, dialogue: ["Gingerbread Lady: Everything is sweet in my domain. Try some!", "Gingerbread Lady: Your heart will guide you through the sticky patches."] } };
    const LVL3_FINAL_DIALOGUE = [{ name: 'Gingerbread Lady', text: "Such a sweet victory! Now, on to the party." }];

    window.startGameLevel3 = new Function(createLevelTemplate(
        "The Sweet Factory", 'https://www.myinstants.com/media/sounds/klangkarussell-sonnentanz.mp3', LVL3_BGS, LVL3_NPC_DATA, LVL3_FINAL_DIALOGUE
    ));

    // --- LEVEL 4: THE BALLOON BOUNCE ---
    const BALLOONEY_GUY_SVG = `<svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg"><path d="M 250 50 Q 350 100 250 150 Q 150 100 250 50 Z" fill="#99CCFF" stroke="#000" stroke-width="5"/><circle cx="250" cy="250" r="80" fill="#FFD700" stroke="#000" stroke-width="5"/><path d="M 250 150 L 250 250" stroke="#000" stroke-width="3"/><circle cx="230" cy="230" r="5" fill="#000"/><circle cx="270" cy="230" r="5" fill="#000"/><path d="M 230 270 Q 250 290 270 270" fill="none" stroke="#000" stroke-width="4"/></svg>`;
    const LVL4_BGS = [`<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="500" fill="#FFFFCC"/><path d="M 0 450 H 800" stroke="#FF4500" stroke-width="5"/><path d="M 50 450 L 50 350 L 150 350 L 150 450 Z" fill="#FF6347"/><path d="M 600 450 L 600 300 L 700 300 L 700 450 Z" fill="#FF6347"/></svg>`];
    const LVL4_NPC_DATA = { 0: { char_id: 'BallooneyGuy', name: 'Ballooney Guy!', svg_content: BALLOONEY_GUY_SVG, initial_x: 650, dialogue: ["Ballooney Guy!: Whee! The party never stops!", "Ballooney Guy!: Jump high! The bouncy pillars are your friends!"] } };
    const LVL4_FINAL_DIALOGUE = [{ name: 'Ballooney Guy!', text: "You bounced to victory! Onwards!" }];

    window.startGameLevel4 = new Function(createLevelTemplate(
        "The Balloon Bounce", 'https://www.myinstants.com/media/sounds/bs-_-bs-zelda-wait-and-listen-theme-satellaview.mp3', LVL4_BGS, LVL4_NPC_DATA, LVL4_FINAL_DIALOGUE, false, 0
    ));

    // --- LEVEL 5: THE CLEAN ZONE (TISSUE HEAD) ---
    const TISSUE_HEAD_SVG = `<svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg"><rect x="150" y="100" width="200" height="150" rx="10" ry="10" fill="#00BFFF" stroke="#000" stroke-width="5"/><rect x="200" y="120" width="100" height="30" fill="white" rx="5" ry="5"/><path d="M 250 250 L 250 350" stroke="#000" stroke-width="8"/><circle cx="200" cy="200" r="10" fill="#000"/><circle cx="300" cy="200" r="10" fill="#000"/><path d="M 230 220 Q 250 240 270 220" fill="none" stroke="#000" stroke-width="4"/></svg>`;
    const LVL5_BGS = [`<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="500" fill="#ADD8E6"/><path d="M 0 450 H 800" stroke="#6495ED" stroke-width="5"/><rect x="100" y="400" width="100" height="50" fill="#6495ED"/><rect x="500" y="400" width="200" height="50" fill="#6495ED"/></svg>`];
    const LVL5_NPC_DATA = { 0: { char_id: 'TissueHead', name: 'Tissue Head', svg_content: TISSUE_HEAD_SVG, initial_x: 650, dialogue: ["Tissue Head: Cleanliness is next to godliness. Or doom.", "Tissue Head: Don't slip on the wet floor signs. The time keeper awaits!"] } };
    const LVL5_FINAL_DIALOGUE = [{ name: 'Tissue Head', text: "You passed the inspection. Now, for the clockwork maze." }];

    window.startGameLevel5 = new Function(createLevelTemplate(
        "The Clean Zone", 'https://www.myinstants.com/media/sounds/scaldera-tentalus-critical.mp3', LVL5_BGS, LVL5_NPC_DATA, LVL5_FINAL_DIALOGUE
    ));

    // --- LEVEL 6: THE TIME WARP (CLOCK MAN) ---
    const CLOCK_MAN_SVG = `<svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg"><circle cx="250" cy="250" r="100" fill="#F0F0F0" stroke="#000" stroke-width="5"/><circle cx="250" cy="250" r="80" fill="white"/><circle cx="250" cy="250" r="5" fill="black"/><line x1="250" y1="250" x2="250" y2="180" stroke="black" stroke-width="3"/><line x1="250" y1="250" x2="300" y2="250" stroke="black" stroke-width="3"/><rect x="200" y="350" width="100" height="150" fill="#555" stroke="#000" stroke-width="5"/><path d="M 250 350 Q 220 320 280 320 L 250 350 Z" fill="#555"/></svg>`;
    const LVL6_BGS = [`<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="500" fill="#4B0082"/><path d="M 0 450 H 800" stroke="#9400D3" stroke-width="5"/><rect x="350" y="300" width="100" height="150" fill="#6A5ACD" rx="10" ry="10"/></svg>`];
    const LVL6_NPC_DATA = { 0: { char_id: 'ClockMan', name: 'Clock Man', svg_content: CLOCK_MAN_SVG, initial_x: 650, dialogue: ["Clock Man: Tick-tock. Time runs short in Dandy's World.", "Clock Man: The seconds are your enemy. Be swift!"] } };
    const LVL6_FINAL_DIALOGUE = [{ name: 'Clock Man', text: "Time is on your side, for now. Proceed to the gardens." }];

    window.startGameLevel6 = new Function(createLevelTemplate(
        "The Time Warp", 'https://www.myinstants.com/media/sounds/dandys-world.mp3', LVL6_BGS, LVL6_NPC_DATA, LVL6_FINAL_DIALOGUE
    ));

    // --- LEVEL 7: THE BUTTERFLY GARDEN ---
    const BUTTERFLY_BOY_SVG = `<svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg"><circle cx="250" cy="250" r="100" fill="#FFC0CB" stroke="#000" stroke-width="5"/><path d="M 250 50 C 150 50, 100 200, 250 250 L 250 50 Z" fill="#FF69B4" stroke="#000" stroke-width="5"/><path d="M 250 50 C 350 50, 400 200, 250 250 L 250 50 Z" fill="#FF69B4" stroke="#000" stroke-width="5"/><circle cx="230" cy="230" r="5" fill="#000"/><circle cx="270" cy="230" r="5" fill="#000"/></svg>`;
    const BUTTERFLYER_SVG = `<svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg"><path d="M 250 50 C 100 50, 50 250, 250 300 C 450 250, 400 50, 250 50 Z" fill="#ADFF2F" stroke="#000" stroke-width="5"/><circle cx="250" cy="200" r="20" fill="#000"/><circle cx="250" cy="100" r="5" fill="#000"/></svg>`;
    const LVL7_BGS = [`<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="500" fill="#3CB371"/><path d="M 0 450 H 800" stroke="#228B22" stroke-width="5"/><path d="M 100 450 Q 200 350 300 450" fill="#6B8E23"/></svg>`];
    const LVL7_NPC_DATA = { 0: { char_id: 'ButterflyBoy', name: 'Butterfly Boy', svg_content: BUTTERFLY_BOY_SVG, initial_x: 650, dialogue: ["Butterfly Boy: We are the children of freedom and light.", "Butterfly Boy: Watch the Butterflyer—if you're quick, you'll reach the next stage."] }, 1: { char_id: 'Butterflyer', name: 'Butterflyer', svg_content: BUTTERFLYER_SVG, initial_x: 200, dialogue: ["Butterflyer: Flutter, flutter! Be light on your feet!", "Butterflyer: The garden is tricky, but beautiful."] } };
    const LVL7_FINAL_DIALOGUE = [{ name: 'Butterfly Boy', text: "Freedom achieved! The lights await." }];

    window.startGameLevel7 = new Function(createLevelTemplate(
        "The Butterfly Garden", 'https://www.myinstants.com/media/sounds/dandys-world.mp3', LVL7_BGS, LVL7_NPC_DATA, LVL7_FINAL_DIALOGUE
    ));

    // --- LEVEL 8: THE LANTERN LABYRINTH (LAMPEY) ---
    const LAMPEY_SVG = `<svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg"><circle cx="250" cy="250" r="100" fill="#FF4500" stroke="#8B0000" stroke-width="5"/><rect x="230" y="350" width="40" height="150" fill="#8B4513" stroke="#8B0000" stroke-width="5"/><circle cx="250" cy="250" r="50" fill="yellow"/><circle cx="250" cy="230" r="10" fill="#000"/></svg>`;
    const LVL8_BGS = [`<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="500" fill="#1C1C1C"/><path d="M 0 450 H 800" stroke="#FFD700" stroke-width="5"/><rect x="50" y="400" width="100" height="50" fill="#333"/><rect x="650" y="350" width="100" height="100" fill="#333"/></svg>`];
    const LVL8_NPC_DATA = { 0: { char_id: 'Lampey', name: 'Lampey', svg_content: LAMPEY_SVG, initial_x: 650, dialogue: ["Lampey: I light the way, but darkness is tricky.", "Lampey: Follow my light, but prepare for moments of pure blackness!"] } };
    const LVL8_FINAL_DIALOGUE = [{ name: 'Lampey', text: "The light found its way! Find serenity in the next stage." }];

    window.startGameLevel8 = new Function(createLevelTemplate(
        "The Lantern Labyrinth", 'https://www.myinstants.com/media/sounds/dandys-world.mp3', LVL8_BGS, LVL8_NPC_DATA, LVL8_FINAL_DIALOGUE
    ));

    // --- LEVEL 9: THE ZEN TEA HOUSE (TEA GIRL) ---
    const TEA_GIRL_SVG = `<svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg"><path d="M 200 200 H 300 Q 350 200 350 250 V 350 H 150 V 250 Q 150 200 200 200 Z" fill="#F4A460" stroke="#8B4513" stroke-width="5"/><path d="M 350 250 Q 400 250 400 300 V 350 Q 350 350 350 300 Z" fill="#D2B48C" stroke="#8B4513" stroke-width="5"/><path d="M 200 200 C 220 180 280 180 300 200" fill="#D2B48C" stroke="#8B4513" stroke-width="5"/><circle cx="230" cy="270" r="10" fill="#000"/><circle cx="270" cy="270" r="10" fill="#000"/></svg>`;
    const LVL9_BGS = [`<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="500" fill="#D2B48C"/><path d="M 0 450 H 800" stroke="#8B4513" stroke-width="5"/><rect x="100" y="400" width="100" height="50" fill="#A0522D" rx="5" ry="5"/><rect x="600" y="400" width="100" height="50" fill="#A0522D" rx="5" ry="5"/></svg>`];
    const LVL9_NPC_DATA = { 0: { char_id: 'TeaGirl', name: 'Tea Girl', svg_content: TEA_GIRL_SVG, initial_x: 650, dialogue: ["Tea Girl: Shh, peace. The path ahead is serene, but challenging.", "Tea Girl: Find your balance, traveler. The end is a step away."] } };
    const LVL9_FINAL_DIALOGUE = [{ name: 'Tea Girl', text: "Namaste. The final stage is all yours. Go, draw your future." }];

    window.startGameLevel9 = new Function(createLevelTemplate(
        "The Zen Tea House", 'https://www.myinstants.com/media/sounds/dandys-world.mp3', LVL9_BGS, LVL9_NPC_DATA, LVL9_FINAL_DIALOGUE
    ));

    // --- LEVEL 10: THE DANDY SHOWDOWN (MONITOR GIRL) ---
    const DANDY_BOSS_SVG = `<svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
        <rect x="100" y="0" width="300" height="450" fill="url(#bossPattern)" stroke="#FF00FF" stroke-width="5"/>
        <path d="M 150 100 L 350 100 L 350 200 L 150 200 Z" fill="#46D899" stroke="#000" stroke-width="5"/>
        <path d="M 160 110 L 340 110 L 340 190 L 160 190 Z" fill="#000"/>
        <path d="M 190 140 A 10 10 0 1 1 210 140 L 210 150 Q 200 160 190 150 Z" fill="#FF00FF"/>
        <path d="M 290 140 A 10 10 0 1 1 310 140 L 310 150 Q 300 160 290 150 Z" fill="#FF00FF"/>
        <path d="M 220 170 Q 250 180 280 170" stroke="#FF00FF" stroke-width="4" fill="none"/>
        <path d="M 100 400 L 400 400 L 300 500 L 200 500 Z" fill="#4B0082" stroke="#FF00FF" stroke-width="5"/>
        <defs><pattern id="bossPattern" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="25" height="25" fill="#46D899"/><rect x="25" y="25" width="25" height="25" fill="#FF00FF"/></pattern></defs>
    </svg>`;
    const LVL10_BGS = [
        `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="500" fill="#000"/><path d="M 0 450 H 800" stroke="#FF00FF" stroke-width="10"/><rect x="350" y="0" width="100" height="450" fill="#111" stroke="#46D899" stroke-width="5"/><circle cx="400" cy="100" r="50" fill="#46D899" opacity="0.3"/></svg>`,
    ];
    // --- CORRECCIÓN CLAVE AQUÍ: AVATAR_GROUND_Y cambiado a AVATAR_GROUND_Y_CONST ---
    const LVL10_NPC_DATA = { 0: { char_id: 'DandyBoss', name: 'Queen Diamond', svg_content: DANDY_BOSS_SVG, x: 350, y: AVATAR_GROUND_Y_CONST - 100, scale: 0.5, final_npc: true, dialogue: ["Queen Diamond: I am Dandy's Host. I am the code that runs this world!", "Queen Diamond: You have met all the facets of my creation, but you cannot defeat the source!", "Queen Diamond: Your journey is over. Dandy's World is mine!"] } };
    const LVL10_FINAL_DIALOGUE = [{ name: 'Game Over', text: "CONGRATULATIONS! You have completed Dandy's World. Now go and draw your own future!" }];

    window.startGameLevel10 = new Function(createLevelTemplate(
        "The Dandy Showdown", 'https://www.myinstants.com/media/sounds/dandys-world.mp3', LVL10_BGS, LVL10_NPC_DATA, LVL10_FINAL_DIALOGUE, false, 0
    ));

    // =====================================================================
    // === FIN DE LA SECCIÓN DE DEFINICIÓN DE NIVELES GLOBALES ===
    // =====================================================================


    // --- CONFIGURACIÓN DE RECURSOS Y TIEMPOS ---
    const RESOURCES = {
        BACKGROUND_INTRO: 'https://i.pinimg.com/222x/9c/77/5d/9c775d8ada3407879a2f0f774c1a113f.jpg',
        LOGO: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsy-PRg9lKQxvDd__GyeZrDkRNu0aVy_C61w&s', // Placeholder (replace with Dandy's logo)
        PLAY_BUTTON: 'https://www.kindpng.com/picc/m/117-1179018_logo-play-play-png-transparent-png.png', // Placeholder
        OPENING_SONG: 'https://www.myinstants.com/media/sounds/sigma-town-bad-quality.mp3',
        CLICK_SFX: 'https://www.myinstants.com/media/sounds/dandys-world-heal-sound.mp3',

        BACKGROUND_SELECT: 'https://i.pinimg.com/236x/84/75/61/847561327b3d88264ed1512b9d162ebd.jpg',
        STORY_CARD_BG: 'https://i.ibb.co/5XC582GK/00000001.png', // Placeholder
        MAIN_CARD_BG: 'https://i.ibb.co/sprKQVpb/00000001.png', // Placeholder
        TITLE_IMAGE: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLv5qWifEvostB6o-Ye4J-FxAd5JySNh1meg&s', // Placeholder (replace with Dandy's World Title)
    };

    const STORIES = [
        "The Start - Dandy's World", "Ghostalana's Haunt", "The Sweet Factory", "The Balloon Bounce",
        "The Clean Zone", "The Time Warp", "The Butterfly Garden", "The Lantern Labyrinth",
        "The Zen Tea House", "The Dandy Showdown"
    ];

    const STORY_THUMBNAILS = [
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuw1qQF1mtRkJlOvflY_8xqYDQReqk2TpZ-w&s',
        'https://dandysworld.gg/cdn/shop/files/gourdy-plush_5e255cfa-4607-4f21-8a7d-a7d408d57fc3.png?v=1760122298&width=1200',
        'https://media.tenor.com/PBLf-7Ym12QAAAAe/dandy%27s-world-dandys-world.png',
        'https://i.etsystatic.com/43637722/r/il/6e580c/6630725782/il_fullxfull.6630725782_rxqe.jpg',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnLOPuNg124HE1FI100Wodj1GIUXPYgOYWyQ&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvUq8uJh4oioULLc4KohF_2mwP1F6PPcgaBQ&s',
        'https://wildcorazondesigns.com/cdn/shop/files/Dandy_s_World.webp?v=1739347534',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnwKnU6kwEHZ6HmDP63Ltp_wrpwQdjbErkdA&s',
        'https://svgmilo.com/cdn/shop/files/It_sMyBirthdayDandyWorldPNGcopy_300x300.jpg?v=1738589949',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBZhFAG-Ti3MiFubpHm9T-PPxyNWJxyyWpoA&s'
    ];

    const STORY_LAUNCH_FUNCTION_NAMES = {
        "The Start - Dandy's World": "startGameLevel1",
        "Ghostalana's Haunt": "startGameLevel2",
        "The Sweet Factory": "startGameLevel3",
        "The Balloon Bounce": "startGameLevel4",
        "The Clean Zone": "startGameLevel5",
        "The Time Warp": "startGameLevel6",
        "The Butterfly Garden": "startGameLevel7",
        "The Lantern Labyrinth": "startGameLevel8",
        "The Zen Tea House": "startGameLevel9",
        "The Dandy Showdown": "startGameLevel10"
    };

    const TIMINGS = {
        FADE_TO_BLACK: 2000,
        SPLIT_REVEAL: 3000,
        LOGO_POPUP: 500,
        PLAY_BUTTON_FADE: 3000,
        BUTTON_DELAY: 500,
        TRANSITION_DURATION: 1000
    };

    let songAudio, sfxAudio;
    let mainContainer;
    let canvasOverlay;
    let animationLoopID;
    let preStartOverlay;

    function setupAudio() {
        songAudio = new Audio(RESOURCES.OPENING_SONG);
        songAudio.loop = true;
        songAudio.volume = 0.5;

        sfxAudio = new Audio(RESOURCES.CLICK_SFX);
        sfxAudio.volume = 0.8;
    }

    function playSong() {
        if (songAudio) {
             songAudio.play().catch(e => console.error("No se pudo reproducir la canción automáticamente:", e));
        }
    }

    function playSfx() {
        if (sfxAudio) {
            sfxAudio.currentTime = 0;
            sfxAudio.play();
        }
    }

    const sparkles = [];
    const magicOrbs = [];
    let ctx;

    function resizeCanvas() {
        if (canvasOverlay) {
            canvasOverlay.width = window.innerWidth;
            canvasOverlay.height = window.innerHeight;
        }
    }

    function drawSparkles(canvas) {
      if (!ctx) return;
      if (Math.random() < 0.5) {
        sparkles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: 1 + Math.random() * 2,
          opacity: 1,
          fadeSpeed: 0.02 + Math.random() * 0.03
        });
      }

      sparkles.forEach((sparkle, index) => {
        ctx.fillStyle = `rgba(255, 255, 255, ${sparkle.opacity})`;
        ctx.beginPath();
        ctx.arc(sparkle.x, sparkle.y, sparkle.size, 0, Math.PI * 2);
        ctx.fill();

        sparkle.opacity -= sparkle.fadeSpeed;
        if (sparkle.opacity <= 0) sparkles.splice(index, 1);
      });
    }

    function drawMagicOrbs(canvas) {
      if (!ctx) return;
      if (Math.random() < 0.1) {
        magicOrbs.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: 5 + Math.random() * 5,
          color: `hsl(${Math.random() * 360}, 100%, 50%)`,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          opacity: 0.7 + Math.random() * 0.3
        });
      }

      magicOrbs.forEach((orb, index) => {
        ctx.globalAlpha = orb.opacity;
        ctx.fillStyle = orb.color;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.size, 0, Math.PI * 2);
        ctx.fill();

        orb.x += orb.vx;
        orb.y += orb.vy;
        orb.size *= 0.99;

        if (orb.x < 0 || orb.x > canvas.width ||
            orb.y < 0 || orb.y > canvas.height ||
            orb.size < 1) {
          magicOrbs.splice(index, 1);
        }
      });

      ctx.globalAlpha = 1;
    }

    function animateStars() {
      if (!ctx || !canvasOverlay) return;
      ctx.clearRect(0, 0, canvasOverlay.width, canvasOverlay.height);
      drawSparkles(canvasOverlay);
      drawMagicOrbs(canvasOverlay);
      animationLoopID = requestAnimationFrame(animateStars);
    }

    function startIntro() {
        playSong();

        if (preStartOverlay) {
            preStartOverlay.remove();
            preStartOverlay = null;
        }

        const curtainTop = document.getElementById('curtain-top');
        const curtainBottom = document.getElementById('curtain-bottom');
        const logo = document.getElementById('story-logo');
        const playButton = document.getElementById('play-button');

        mainContainer.style.pointerEvents = 'auto';

        setTimeout(() => {
            curtainTop.style.transform = 'translateY(-100%)';
            curtainBottom.style.transform = 'translateY(100%)';

            setTimeout(() => {
                logo.classList.add('bounce');
                logo.style.opacity = '1';
                logo.style.transform = 'scale(1)';

                animateStars();

                setTimeout(() => {
                    playButton.style.opacity = '1';
                    playButton.style.transform = 'scale(1)';

                }, TIMINGS.LOGO_POPUP + TIMINGS.BUTTON_DELAY);

            }, TIMINGS.SPLIT_REVEAL);

        }, TIMINGS.FADE_TO_BLACK);
    }


    function cleanup() {
        playSfx();
        songAudio.pause();

        cancelAnimationFrame(animationLoopID);

        if (mainContainer) mainContainer.remove();
        if (canvasOverlay) canvasOverlay.remove();

        startSelectTransition();
    }

    function startSelectTransition() {
        showSelectScreen(false);

        const transitionCurtainLeft = document.createElement('div');
        transitionCurtainLeft.id = 'transition-curtain-left';
        transitionCurtainLeft.classList.add('transition-curtain');
        document.body.appendChild(transitionCurtainLeft);

        const transitionCurtainRight = document.createElement('div');
        transitionCurtainRight.id = 'transition-curtain-right';
        transitionCurtainRight.classList.add('transition-curtain');
        document.body.appendChild(transitionCurtainRight);

        setTimeout(() => {
            transitionCurtainLeft.style.transform = 'translateX(-100%)';
            transitionCurtainRight.style.transform = 'translateX(100%)';

            setTimeout(() => {
                transitionCurtainLeft.remove();
                transitionCurtainRight.remove();
                const selectScreen = document.getElementById('select-screen');
                if(selectScreen) selectScreen.style.opacity = '1';

                playSong();
            }, TIMINGS.TRANSITION_DURATION);
        }, 50);
    }

    function launchLevel(storyName) {
        const functionName = STORY_LAUNCH_FUNCTION_NAMES[storyName];

        playSfx();
        songAudio.pause();
        const selectScreen = document.getElementById('select-screen');
        if (selectScreen) selectScreen.remove();

        if (typeof window[functionName] === 'function') {
            // Llama a la función que fue definida y retornada por new Function()
            window[functionName]();
        } else {
            alert(`Error: The code for level "${storyName}" is missing or improperly loaded. Please check the script source.`);
        }
    }


    function showSelectScreen(doFadeIn = true) {
        const selectScreen = document.createElement('div');
        selectScreen.id = 'select-screen';
        selectScreen.style.opacity = doFadeIn ? '0' : '1';
        document.body.appendChild(selectScreen);

        const titleContainer = document.createElement('div');
        titleContainer.id = 'select-title-container';
        const titleImage = document.createElement('img');
        titleImage.src = RESOURCES.TITLE_IMAGE;
        titleImage.alt = 'Choose your story';
        titleContainer.appendChild(titleImage);

        const mainCardContainer = document.createElement('div');
        mainCardContainer.id = 'main-card-container-select';

        const storiesGrid = document.createElement('div');
        storiesGrid.id = 'stories-grid';

        STORIES.forEach((storyName, index) => {
            const storyDiv = document.createElement('div');
            storyDiv.classList.add('story-card');
            storyDiv.dataset.storyName = storyName;
            storyDiv.addEventListener('click', () => launchLevel(storyName));

            const imgContainer = document.createElement('div');
            imgContainer.classList.add('story-img-container');

            const thumbnailURL = STORY_THUMBNAILS[index];
            const thumbnailImg = document.createElement('img');
            thumbnailImg.src = thumbnailURL;
            thumbnailImg.alt = storyName + ' thumbnail';
            thumbnailImg.classList.add('placeholder-img');

            imgContainer.appendChild(thumbnailImg);

            const nameP = document.createElement('p');
            nameP.classList.add('story-name');
            nameP.textContent = storyName;

            storyDiv.appendChild(imgContainer);
            storyDiv.appendChild(nameP);

            storiesGrid.appendChild(storyDiv);
        });

        mainCardContainer.appendChild(storiesGrid);
        selectScreen.appendChild(titleContainer);
        selectScreen.appendChild(mainCardContainer);
    }

    function injectCSS() {
        GM_addStyle(`
            @keyframes bounce {
                0% { transform: scale(0.5); } 70% { transform: scale(1.1); } 100% { transform: scale(1); }
            }
            #pre-start-overlay {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background-color: black; color: #46D899; display: flex;
                justify-content: center; align-items: center; font-size: 2em;
                font-family: 'Courier New', monospace; cursor: pointer; z-index: 10000;
                opacity: 0; transition: opacity 1s ease-in; text-shadow: 0 0 10px #46D899;
            }
            #opening-scene-container {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                z-index: 9998; background-color: black;
                background-image: url('${RESOURCES.BACKGROUND_INTRO}');
                background-size: cover; background-position: center top;
                opacity: 1; pointer-events: none; overflow: hidden;
                transition: none;
            }
            .curtain {
                position: absolute; left: 0; width: 100vw; height: 50vh;
                background-color: black;
                transition: transform ${TIMINGS.SPLIT_REVEAL/1000}s cubic-bezier(0.165, 0.84, 0.44, 1);
            }
            #curtain-top { top: 0; }
            #curtain-bottom { bottom: 0; }
            #elements-container {
                position: absolute; top: 50%; left: 50%;
                transform: translate(-50%, -50%); width: 100%;
                text-align: center; display: flex; flex-direction: column;
                align-items: center;
            }
            #story-logo {
                width: 50%; max-width: 500px; height: auto; opacity: 0;
                margin-bottom: 20px; transform: scale(0.5);
            }
            #story-logo.bounce {
                animation: bounce ${TIMINGS.LOGO_POPUP/1000}s forwards;
            }
            #play-button {
                width: 25%; max-width: 200px; height: auto; cursor: pointer;
                opacity: 0; margin-top: 50vh;
                transform: scale(0.5);
                transition: opacity ${TIMINGS.PLAY_BUTTON_FADE/1000}s ease-in, transform ${TIMINGS.PLAY_BUTTON_FADE/1000}s ease-in;
            }
            .transition-curtain {
                position: fixed; top: 0; width: 50vw; height: 100vh;
                background-color: black;
                z-index: 10000;
                transition: transform ${TIMINGS.TRANSITION_DURATION/1000}s ease-out;
            }
            #transition-curtain-left { left: 0; }
            #transition-curtain-right { right: 0; }
            #select-screen {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                z-index: 9999; background-color: black;
                background-image: url('${RESOURCES.BACKGROUND_SELECT}');
                background-size: cover; background-position: center;
                display: flex; flex-direction: column; align-items: center;
                transition: opacity 0.5s ease-in;
            }
            #select-title-container {
                width: 60vh; max-width: 600px; margin-bottom: 1vh; margin-top: 3vh;
            }
            #select-title-container img { width: 100%; height: auto; }
            #main-card-container-select {
                width: 80vw; height: 85vh; max-width: 1100px; max-height: 850px;
                background-image: none; background-color: transparent; padding: 0;
                box-sizing: border-box; display: flex; justify-content: center;
                align-items: center; margin-top: 0;
            }
            #stories-grid {
                display: grid; grid-template-columns: repeat(5, 1fr); grid-template-rows: repeat(2, 1fr);
                gap: 20px; width: 100%; height: 100%; justify-items: center; align-items: center;
            }
            .story-card {
                display: flex; flex-direction: column; align-items: center; text-align: center;
                cursor: pointer; width: 90%; max-width: 180px; justify-self: center; align-self: center;
            }
            .story-img-container {
                position: relative; width: 100%; padding-top: 65%;
                background-image: url('${RESOURCES.STORY_CARD_BG}');
                background-size: 100% 100%; background-repeat: no-repeat; margin-bottom: 0.3vh;
                max-width: 150px; max-height: 150px; align-self: center;
            }
            .placeholder-img {
                position: absolute; top: 15%; left: 16%; width: 70%; height: 70%;
                object-fit: cover; border-radius: 12%;
            }
            .story-name {
                font-family: 'Courier New', monospace; font-weight: bold;
                color: #46D899; font-size: 2vh; margin: 0.5vh 0 0 0;
                text-shadow: 1px 1px 2px #000;
            }
            .story-card:hover { transform: scale(1.05); transition: transform 0.2s; }
        `);
    }

    function buildDOM() {
        injectCSS();
        preStartOverlay = document.createElement('div');
        preStartOverlay.id = 'pre-start-overlay';
        preStartOverlay.textContent = 'Welcome to Dandy\'s World Adventure - Click to Start';
        document.body.appendChild(preStartOverlay);

        setTimeout(() => { preStartOverlay.style.opacity = '1'; }, 100);

        mainContainer = document.createElement('div');
        mainContainer.id = 'opening-scene-container';

        const curtainTop = document.createElement('div');
        curtainTop.id = 'curtain-top';
        curtainTop.classList.add('curtain');
        const curtainBottom = document.createElement('div');
        curtainBottom.id = 'curtain-bottom';
        curtainBottom.classList.add('curtain');

        const elementsContainer = document.createElement('div');
        elementsContainer.id = 'elements-container';

        const logo = document.createElement('img');
        logo.id = 'story-logo';
        logo.src = RESOURCES.LOGO;
        logo.alt = 'Dandy\'s World Logo';

        const playButton = document.createElement('img');
        playButton.id = 'play-button';
        playButton.src = RESOURCES.PLAY_BUTTON;
        playButton.alt = 'Play Button';
        playButton.addEventListener('click', cleanup);

        elementsContainer.appendChild(logo);
        elementsContainer.appendChild(playButton);
        mainContainer.appendChild(elementsContainer);
        mainContainer.appendChild(curtainTop);
        mainContainer.appendChild(curtainBottom);
        document.body.appendChild(mainContainer);

        canvasOverlay = document.createElement('canvas');
        canvasOverlay.style.position = 'fixed';
        canvasOverlay.style.top = '0';
        canvasOverlay.style.left = '0';
        canvasOverlay.style.pointerEvents = 'none';
        canvasOverlay.style.zIndex = '9999';
        document.body.appendChild(canvasOverlay);
        ctx = canvasOverlay.getContext('2d');
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        let loaded = 0;
        const totalToLoad = 4;
        const checkLoad = () => {
            loaded++;
            if (loaded === totalToLoad) {
                preStartOverlay.addEventListener('click', startIntro, { once: true });
            }
        };

        const bgIntroImg = new Image(); bgIntroImg.onload = checkLoad; bgIntroImg.onerror = checkLoad; bgIntroImg.src = RESOURCES.BACKGROUND_INTRO;
        const bgSelectImg = new Image(); bgSelectImg.onload = checkLoad; bgSelectImg.onerror = checkLoad; bgSelectImg.src = RESOURCES.BACKGROUND_SELECT;
        const logoImg = new Image(); logoImg.onload = checkLoad; logoImg.onerror = checkLoad; logoImg.src = RESOURCES.LOGO;
        const playButtonImg = new Image(); playButtonImg.onload = checkLoad; playButtonImg.onerror = checkLoad; playButtonImg.src = RESOURCES.PLAY_BUTTON;
    }

    window.addEventListener('load', () => {
        setupAudio();
        buildDOM();
    });

})();