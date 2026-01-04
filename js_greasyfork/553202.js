// ==UserScript==
// @name         Slither.io Mobile Mod
// @namespace    slither_mobile_mod
// @version      1.1
// @description  Slither mod for mobile
// @author       XBACT
// @match        *://slither.com/*
// @match        *://slither.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553202/Slitherio%20Mobile%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/553202/Slitherio%20Mobile%20Mod.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let touchActive = false;
    let touchStartX = 0;
    let touchStartY = 0;
    let touchCurrentX = 0;
    let touchCurrentY = 0;
    let pointerX = 0;
    let pointerY = 0;
    let basePointerX = 0;
    let basePointerY = 0;
    let pointerElement = null;
    let guideLine = null;
    let snakeDot = null;
    let boostButton = null;
    let zoomInButton = null;
    let zoomOutButton = null;
    let respawnButton = null;
    let settingsButton = null;
    let settingsPanel = null;
    let isAccelerating = false;
    let lastKnownAngle = 0;
    let currentZoom = 1.0;
    let gameStartZoom = 1.0;
    let editMode = false;
    let draggingButton = null;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let editingButton = null;
    let wasInGame = false;
    let lastDeadTime = 0;
    let autoRespawnDelay = 500;
    let screenButtons = [];

    let botEnabled = false;
    let botInterval = null;
    let botFirstRun = true;
    let botTargetFood = null;
    let botTargetStartTime = 0;
    let botIgnoredFoods = new Set();
    let botLastIgnoreCleanup = 0;
    const BOT_UPDATE_INTERVAL = 100;
    const BOT_TARGET_TIMEOUT = 3000;
    const BOT_IGNORED_FOOD_RESET = 10000;

    const POINTER_BASE_DISTANCE = 100;
    const MIN_ZOOM = 0.3;
    const MAX_ZOOM = 3.0;

    let visualFeatures = {
        hideBoostGlow: false,
        showGuideLine: false,
        showSnakeDot: false,
        showPointer: true,
        lowPerformance: false,
        blackBackground: false,
        autoRespawn: false,
        instantDeadSnake: false,
        instantEatFood: false,
        resetZoomOnRespawn: false,
        snakeOpacity: 1.0,
        noFoodAnimation: false,
        noFoodWobble: false,
        showRespawnButton: true,
        botEnabled: false
    };

    let guidelineSettings = {
        thickness: 2,
        color: '#64ff64'
    };

    let pointerSettings = {
        size: 40,
        color: '#64c8ff',
        speed: 2.5
    };

    function loadVisualFeatures() {
        const saved = localStorage.getItem('slitherVisualFeatures');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                visualFeatures = { ...visualFeatures, ...parsed };
                if (parsed.pointerSpeed !== undefined) {
                    pointerSettings.speed = parsed.pointerSpeed;
                    delete visualFeatures.pointerSpeed;
                }
            } catch (e) {
            }
        }
        const savedDelay = localStorage.getItem('slitherAutoRespawnDelay');
        if (savedDelay) {
            autoRespawnDelay = parseInt(savedDelay) || 500;
        }
        const savedGuideline = localStorage.getItem('slitherGuidelineSettings');
        if (savedGuideline) {
            try {
                guidelineSettings = { ...guidelineSettings, ...JSON.parse(savedGuideline) };
            } catch (e) {
            }
        }
        const savedPointer = localStorage.getItem('slitherPointerSettings');
        if (savedPointer) {
            try {
                pointerSettings = { ...pointerSettings, ...JSON.parse(savedPointer) };
            } catch (e) {
            }
        }
    }

    function saveVisualFeatures() {
        localStorage.setItem('slitherVisualFeatures', JSON.stringify(visualFeatures));
        localStorage.setItem('slitherAutoRespawnDelay', autoRespawnDelay.toString());
        localStorage.setItem('slitherGuidelineSettings', JSON.stringify(guidelineSettings));
        localStorage.setItem('slitherPointerSettings', JSON.stringify(pointerSettings));
    }

    let buttonSettings = {
        boost: {
            x: window.innerWidth - 110,
            y: window.innerHeight - 110,
            width: 80,
            height: 80,
            color: '#ff3232',
            opacity: 0.7,
            borderRadius: 50
        },
        zoomIn: {
            x: window.innerWidth - 80,
            y: window.innerHeight - 210,
            width: 50,
            height: 50,
            color: '#6496ff',
            opacity: 0.7,
            borderRadius: 10,
            value: 0.05
        },
        zoomOut: {
            x: window.innerWidth - 80,
            y: window.innerHeight - 270,
            width: 50,
            height: 50,
            color: '#6496ff',
            opacity: 0.7,
            borderRadius: 10,
            value: 0.05
        },
        respawn: {
            x: 20,
            y: window.innerHeight - 110,
            width: 80,
            height: 80,
            color: '#4CAF50',
            opacity: 0.7,
            borderRadius: 50
        }
    };

    function loadSettings() {
        const saved = localStorage.getItem('slitherMobileSettings');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                buttonSettings = { ...buttonSettings, ...parsed };
            } catch (e) {
            }
        }
    }

    function saveSettings() {
        localStorage.setItem('slitherMobileSettings', JSON.stringify(buttonSettings));
    }

    function isInGame() {
        if (window.slither && window.slither.id !== undefined && window.playing) return true;
        if (window.playing === true) return true;
        return false;
    }

    function isDead() {
        if (!window.slither) return true;
        if (window.dead_mtm !== -1 && window.dead_mtm !== undefined) return true;
        return false;
    }

    function checkGameStateChange() {
        const currentlyInGame = isInGame();

        if (currentlyInGame && !wasInGame) {
            if (visualFeatures.resetZoomOnRespawn) {
                currentZoom = 1.0;
                gameStartZoom = 1.0;
                if (window.gsc !== undefined) {
                    window.gsc = 1.0;
                }
            } else {
                currentZoom = gameStartZoom;
                if (window.gsc !== undefined) {
                    window.gsc = currentZoom;
                }
            }
            applyVisualFeatures();
        }

        if (!currentlyInGame && wasInGame) {
            lastDeadTime = Date.now();
            if (!visualFeatures.resetZoomOnRespawn) {
                gameStartZoom = currentZoom;
            }
        }

        wasInGame = currentlyInGame;

        if (visualFeatures.autoRespawn && isDead() && Date.now() - lastDeadTime > autoRespawnDelay) {
            respawn();
        }
    }

    setInterval(checkGameStateChange, 100);

    function botThink() {
        if (!botEnabled || !window.playing) return;

        try {
            const snake = window.slither;
            if (!snake || snake.dead_amt === 1) return;

            if (botFirstRun) {
                /*
                x: snake.xx,
                y: snake.yy,
                timeout: BOT_TARGET_TIMEOUT + 'ms',
                resetInterval: BOT_IGNORED_FOOD_RESET + 'ms'
                });
                */
                botFirstRun = false;
            }

            const snakeX = snake.xx;
            const snakeY = snake.yy;
            const snakeAng = snake.ang || snake.ehang;
            const currentTime = Date.now();

            if (botTargetFood) {
                const targetDist = Math.sqrt(
                    Math.pow(botTargetFood.xx - snakeX, 2) +
                    Math.pow(botTargetFood.yy - snakeY, 2)
                );

                if (botTargetFood.eaten || !window.foods.includes(botTargetFood)) {
                    botTargetFood = null;
                    botTargetStartTime = 0;
                }
                else if (currentTime - botTargetStartTime > BOT_TARGET_TIMEOUT && targetDist < 200) {
                    const foodHash = `${Math.round(botTargetFood.xx)}_${Math.round(botTargetFood.yy)}`;
                    botIgnoredFoods.add(foodHash);
                    botTargetFood = null;
                    botTargetStartTime = 0;
                }
                else if (targetDist > 1500) {
                    botTargetFood = null;
                    botTargetStartTime = 0;
                }
            }

            if (currentTime - botLastIgnoreCleanup > BOT_IGNORED_FOOD_RESET) {
                if (botIgnoredFoods.size > 0) {
                    botIgnoredFoods.clear();
                }
                botLastIgnoreCleanup = currentTime;
            }

            let nearestFood = null;
            let nearestDist = Infinity;

            if (window.foods && window.foods_c > 0) {
                for (let i = window.foods.length - 1; i >= 0; i--) {
                    const food = window.foods[i];
                    if (!food || food.eaten) continue;

                    const foodHash = `${Math.round(food.xx)}_${Math.round(food.yy)}`;
                    if (botIgnoredFoods.has(foodHash)) continue;

                    const dx = food.xx - snakeX;
                    const dy = food.yy - snakeY;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 1000 && dist < nearestDist) {
                        nearestDist = dist;
                        nearestFood = food;
                    }
                }
            }

            if (nearestFood && nearestFood !== botTargetFood) {
                botTargetFood = nearestFood;
                botTargetStartTime = currentTime;
            }

            let targetX, targetY;
            if (botTargetFood) {
                targetX = botTargetFood.xx;
                targetY = botTargetFood.yy;
            } else {
                targetX = snakeX + Math.cos(snakeAng) * 500;
                targetY = snakeY + Math.sin(snakeAng) * 500;
            }

            const mouseX = (targetX - snakeX) * window.gsc;
            const mouseY = (targetY - snakeY) * window.gsc;
            window.xm = mouseX;
            window.ym = mouseY;

            let dangerClose = false;
            if (window.slithers && window.slithers.length > 0) {
                for (let i = window.slithers.length - 1; i >= 0; i--) {
                    const otherSnake = window.slithers[i];
                    if (!otherSnake || otherSnake === snake || otherSnake.die_amt !== 0) continue;

                    const dx = otherSnake.xx - snakeX;
                    const dy = otherSnake.yy - snakeY;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 300) {
                        dangerClose = true;
                        break;
                    }
                }
            }

            if (dangerClose && snake.sct > 0.1) {
                window.setAcceleration(1);
            } else {
                window.setAcceleration(0);
            }

        } catch (e) {
        }
    }

    function startBot() {
        if (botInterval) return;
        botEnabled = true;
        visualFeatures.botEnabled = true;
        botInterval = setInterval(botThink, BOT_UPDATE_INTERVAL);
        botTargetFood = null;
        botTargetStartTime = 0;
        botIgnoredFoods.clear();
        botLastIgnoreCleanup = Date.now();
        saveVisualFeatures();
    }

    function stopBot() {
        if (botInterval) {
            clearInterval(botInterval);
            botInterval = null;
        }
        botEnabled = false;
        botFirstRun = true;
        botTargetFood = null;
        botTargetStartTime = 0;
        botIgnoredFoods.clear();
        visualFeatures.botEnabled = false;
        if (window.setAcceleration) {
            window.setAcceleration(0);
        }
        saveVisualFeatures();
    }

    function toggleBot() {
        if (botEnabled) {
            stopBot();
        } else {
            startBot();
        }
    }

    function respawn() {
        try {
            window.dead_mtm = 0;
            window.login_fr = 0;
            window.forcing = true;
            window.connect();
            window.forcing = false;
        } catch (e) {
        }
    }

    let originalBg = null;

    function setCustomBackgroundColor(color) {
        const win = window;

        if (!win.bgi2 || !(win.bgi2 instanceof HTMLCanvasElement)) {
            win.bgi2 = document.createElement("canvas");
            win.bgi2.width = window.innerWidth;
            win.bgi2.height = window.innerHeight;
            win.bgi2.style.display = "none";
            document.body.appendChild(win.bgi2);
        }

        if (win.bgi2.width === 0 || win.bgi2.height === 0) {
            win.bgi2.width = window.innerWidth;
            win.bgi2.height = window.innerHeight;
        }

        const bgCanvas = win.bgi2.getContext("2d");
        if (!bgCanvas) {
            return;
        }

        if (!originalBg && color === '#000000') {
            originalBg = bgCanvas.getImageData(0, 0, win.bgi2.width, win.bgi2.height);
        }

        bgCanvas.clearRect(0, 0, win.bgi2.width, win.bgi2.height);
        bgCanvas.fillStyle = color;
        bgCanvas.fillRect(0, 0, win.bgi2.width, win.bgi2.height);

        if (typeof win.setBgp2 === "function") {
            win.setBgp2(win.bgi2);
        } else {
            win.bgp2 = bgCanvas.createPattern(win.bgi2, "repeat");
        }

    }

    function restoreOriginalBackground() {
        const win = window;
        if (win.bgi2 && originalBg) {
            const bgCanvas = win.bgi2.getContext("2d");
            if (bgCanvas) {
                bgCanvas.putImageData(originalBg, 0, 0);
                if (typeof win.setBgp2 === "function") {
                    win.setBgp2(win.bgi2);
                } else {
                    win.bgp2 = bgCanvas.createPattern(win.bgi2, "repeat");
                }
            }
        }
    }

    function applyVisualFeatures() {
        if (visualFeatures.blackBackground) {
            setCustomBackgroundColor('#000000');
        } else {
            restoreOriginalBackground();
        }

        if (visualFeatures.lowPerformance) {
            if (typeof window.render_mode !== 'undefined') {
                window.render_mode = 1;
                window.want_quality = 0;
                window.high_quality = false;
            }
        } else {
            if (typeof window.render_mode !== 'undefined') {
                window.render_mode = 2;
                window.want_quality = 1;
                window.high_quality = true;
            }
        }
    }

    setInterval(() => {
        if (isInGame() && window.slither) {
            if (visualFeatures.hideBoostGlow && window.slither.pr !== undefined) {

            }

            if (visualFeatures.instantDeadSnake && window.slithers) {
                try {
                    for (let i = window.slithers.length - 1; i >= 0; i--) {
                        const snake = window.slithers[i];
                        if (snake && (snake.dead === true || snake.dead_amt > 0)) {
                            if (typeof window.destroySlitherAtIndex === 'function') {
                                window.destroySlitherAtIndex(i);
                            } else {
                                window.slithers.splice(i, 1);
                            }
                        }
                    }
                } catch (e) {
                }
            }

            if (visualFeatures.instantEatFood && window.foods && window.foods_c) {
                try {
                    for (let i = window.foods_c - 1; i >= 0; i--) {
                        const food = window.foods[i];
                        if (food && food.eaten === true) {
                            if (typeof window.destroyFood === 'function') {
                                window.destroyFood(food);
                            }
                            if (i === window.foods_c - 1) {
                                window.foods[i] = null;
                                window.foods_c--;
                            } else {
                                window.foods[i] = window.foods[window.foods_c - 1];
                                window.foods[window.foods_c - 1] = null;
                                window.foods_c--;
                            }
                        }
                    }
                } catch (e) {
                }
            }

            if (visualFeatures.noFoodAnimation && window.foods && window.foods_c) {
                try {
                    for (let i = 0; i < window.foods_c; i++) {
                        const food = window.foods[i];
                        if (food && !food.eaten) {
                            food.fr = 1;
                            food.rad = 1;
                        }
                    }
                } catch (e) {
                }
            }

            if (visualFeatures.noFoodWobble && window.foods && window.foods_c) {
                try {
                    for (let i = 0; i < window.foods_c; i++) {
                        const food = window.foods[i];
                        if (food) {
                            food.wsp = 0;
                        }
                    }
                } catch (e) {
                }
            }
        }

        if (window.slithers) {
            for (let snake of window.slithers) {
                if (!snake) continue;

                if (snake._originalAlpha === undefined) {
                    snake._originalAlpha = (snake.alpha !== undefined ? snake.alpha : 1.0);
                }

                if (snake.alpha !== undefined)     snake.alpha     = visualFeatures.snakeOpacity;
                if (snake.alive_amt !== undefined) snake.alive_amt = visualFeatures.snakeOpacity;
                if (snake.opacity !== undefined)   snake.opacity   = visualFeatures.snakeOpacity;

                if (snake.pts) {
                    for (let pt of snake.pts) {
                        if (pt && pt.alpha !== undefined) {
                            pt.alpha = visualFeatures.snakeOpacity;
                        }
                    }
                }
            }
        }

    }, 50);

    function createPointer() {
        pointerElement = document.createElement('div');
        updatePointerStyle();
        document.body.appendChild(pointerElement);
    }

    function updatePointerStyle() {
        if (!pointerElement) return;

        const size = pointerSettings.size;
        const color = pointerSettings.color;

        pointerElement.style.cssText = `
            position: fixed;
            width: ${size}px;
            height: ${size}px;
            pointer-events: none;
            z-index: 10000;
            display: none;
            transform: translate(-50%, -50%);
        `;

        pointerElement.innerHTML = `
            <svg width="${size}" height="${size}" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                <path d="M20 38 L10 25 L16 25 L16 2 L24 2 L24 25 L30 25 Z"
                      fill="${color}"
                      stroke="white"
                      stroke-width="2"
                      filter="url(#glow)"/>
                <circle cx="20" cy="20" r="3" fill="white" opacity="0.8"/>
            </svg>
        `;
    }

    function createGuideLine() {
        guideLine = document.createElement('div');
        guideLine.style.cssText = `
            position: fixed;
            pointer-events: none;
            z-index: 9999;
            display: none;
            transform-origin: left center;
        `;
        document.body.appendChild(guideLine);
    }

    function createSnakeDot() {
        snakeDot = document.createElement('div');
        snakeDot.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #ff0000;
            border: 2px solid white;
            pointer-events: none;
            z-index: 10001;
            display: none;
            transform: translate(-50%, -50%);
            box-shadow: 0 0 10px rgba(255, 0, 0, 0.8);
        `;
        document.body.appendChild(snakeDot);
    }

    function updateGuideLine() {
        if (!guideLine || !visualFeatures.showGuideLine || !touchActive || !isInGame()) {
            if (guideLine) guideLine.style.display = 'none';
            return;
        }

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        const dx = pointerX - centerX;
        const dy = pointerY - centerY;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);

        guideLine.style.left = centerX + 'px';
        guideLine.style.top = centerY + 'px';
        guideLine.style.width = length + 'px';
        guideLine.style.height = guidelineSettings.thickness + 'px';
        guideLine.style.background = guidelineSettings.color;
        guideLine.style.transform = `rotate(${angle}rad)`;
        guideLine.style.display = 'block';
    }

    function updateSnakeDot() {
        if (!snakeDot || !visualFeatures.showSnakeDot || !isInGame()) {
            if (snakeDot) snakeDot.style.display = 'none';
            return;
        }

        if (!window.slither || !window.slither.pts || window.slither.pts.length === 0) {
            snakeDot.style.display = 'none';
            return;
        }

        try {
            const snake = window.slither;
            const ang = snake.ang || 0;

            const snakeRadius = snake.sc * 29;

            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            const gsc = window.gsc || 1;
            const screenX = centerX + Math.cos(ang) * snakeRadius * gsc;
            const screenY = centerY + Math.sin(ang) * snakeRadius * gsc;

            snakeDot.style.left = screenX + 'px';
            snakeDot.style.top = screenY + 'px';
            snakeDot.style.display = 'block';
        } catch (e) {
            snakeDot.style.display = 'none';
        }
    }

    function applyButtonStyle(button, settings) {
        const s = buttonSettings[settings];
        button.style.left = s.x + 'px';
        button.style.top = s.y + 'px';
        button.style.width = s.width + 'px';
        button.style.height = s.height + 'px';
        button.style.backgroundColor = `${s.color}${Math.round(s.opacity * 255).toString(16).padStart(2, '0')}`;
        button.style.borderRadius = s.borderRadius + '%';
    }

    function createBoostButton() {
        boostButton = document.createElement('button');
        boostButton.textContent = 'BOOST';
        boostButton.className = 'control-button';
        boostButton.dataset.buttonType = 'boost';
        boostButton.style.cssText = `
            position: fixed;
            border: 3px solid white;
            color: white;
            font-weight: bold;
            font-size: 14px;
            z-index: 10001;
            touch-action: none;
            user-select: none;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        `;

        applyButtonStyle(boostButton, 'boost');

        boostButton.addEventListener('touchstart', handleBoostStart, { passive: false });
        boostButton.addEventListener('touchend', handleBoostEnd, { passive: false });
        boostButton.addEventListener('touchcancel', handleBoostEnd, { passive: false });

        document.body.appendChild(boostButton);
    }

    function handleBoostStart(e) {
        if (editMode) {
            startDragging(e, boostButton);
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        if (!isInGame()) return;
        isAccelerating = true;
        boostButton.style.filter = 'brightness(1.3)';

        if (touchActive) {
            simulateMouseDown();
        } else {
            if (typeof window.setAcceleration === 'function') {
                window.setAcceleration(1);
            }
        }
    }

    function handleBoostEnd(e) {
        if (editMode) return;
        e.preventDefault();
        e.stopPropagation();
        isAccelerating = false;
        boostButton.style.filter = 'brightness(1)';

        if (touchActive) {
            simulateMouseUp();
        } else {
            if (typeof window.setAcceleration === 'function') {
                window.setAcceleration(0);
            }
        }
    }

    function createZoomButtons() {
        zoomInButton = document.createElement('button');
        zoomInButton.textContent = '+';
        zoomInButton.className = 'control-button';
        zoomInButton.dataset.buttonType = 'zoomIn';
        zoomInButton.style.cssText = `
            position: fixed;
            border: 2px solid white;
            color: white;
            font-weight: bold;
            font-size: 24px;
            z-index: 10001;
            touch-action: none;
            user-select: none;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        `;

        applyButtonStyle(zoomInButton, 'zoomIn');

        zoomInButton.addEventListener('touchstart', (e) => {
            if (editMode) {
                startDragging(e, zoomInButton);
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            zoomInButton.style.filter = 'brightness(1.3)';
            adjustZoom(buttonSettings.zoomIn.value);
        }, { passive: false });

        zoomInButton.addEventListener('touchend', (e) => {
            if (editMode) return;
            e.preventDefault();
            e.stopPropagation();
            zoomInButton.style.filter = 'brightness(1)';
        }, { passive: false });

        document.body.appendChild(zoomInButton);

        zoomOutButton = document.createElement('button');
        zoomOutButton.textContent = '−';
        zoomOutButton.className = 'control-button';
        zoomOutButton.dataset.buttonType = 'zoomOut';
        zoomOutButton.style.cssText = `
            position: fixed;
            border: 2px solid white;
            color: white;
            font-weight: bold;
            font-size: 24px;
            z-index: 10001;
            touch-action: none;
            user-select: none;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        `;

        applyButtonStyle(zoomOutButton, 'zoomOut');

        zoomOutButton.addEventListener('touchstart', (e) => {
            if (editMode) {
                startDragging(e, zoomOutButton);
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            zoomOutButton.style.filter = 'brightness(1.3)';
            adjustZoom(-buttonSettings.zoomOut.value);
        }, { passive: false });

        zoomOutButton.addEventListener('touchend', (e) => {
            if (editMode) return;
            e.preventDefault();
            e.stopPropagation();
            zoomOutButton.style.filter = 'brightness(1)';
        }, { passive: false });

        document.body.appendChild(zoomOutButton);
    }

    function createRespawnButton() {
        respawnButton = document.createElement('button');
        respawnButton.textContent = 'Respawn';
        respawnButton.className = 'control-button';
        respawnButton.dataset.buttonType = 'respawn';
        respawnButton.style.cssText = `
            position: fixed;
            border: 3px solid white;
            color: white;
            font-weight: bold;
            font-size: 14px;
            z-index: 10001;
            touch-action: none;
            user-select: none;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            display: ${visualFeatures.showRespawnButton ? 'flex' : 'none'};
            align-items: center;
            justify-content: center;
            cursor: pointer;
        `;

        applyButtonStyle(respawnButton, 'respawn');

        respawnButton.addEventListener('touchstart', (e) => {
            if (editMode) {
                startDragging(e, respawnButton);
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            respawnButton.style.filter = 'brightness(1.3)';
        }, { passive: false });

        respawnButton.addEventListener('touchend', (e) => {
            if (editMode) return;
            e.preventDefault();
            e.stopPropagation();
            respawnButton.style.filter = 'brightness(1)';
            respawn();
        }, { passive: false });

        document.body.appendChild(respawnButton);
    }

    function createSettingsButton() {
        settingsButton = document.createElement('button');
        settingsButton.innerHTML = '⚙';
        settingsButton.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: rgba(100, 100, 100, 0.7);
            border: 2px solid white;
            color: white;
            font-size: 20px;
            z-index: 100000;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            touch-action: manipulation;
            pointer-events: auto;
        `;

        const blockEvent = (e) => {
            e.stopPropagation();
            e.stopImmediatePropagation();
            e.preventDefault();
        };

        settingsButton.addEventListener('touchstart', blockEvent, { passive: false, capture: true });
        settingsButton.addEventListener('touchmove', blockEvent, { passive: false, capture: true });

        settingsButton.addEventListener('touchend', (e) => {
            e.stopPropagation();
            e.stopImmediatePropagation();
            e.preventDefault();
            toggleSettingsPanel();
        }, { passive: false, capture: true });

        document.body.appendChild(settingsButton);
    }

    function createSettingsPanel() {
        settingsPanel = document.createElement('div');
        settingsPanel.id = 'settings-panel';
        settingsPanel.style.cssText = `
            position: fixed;
            top: 60px;
            right: 10px;
            width: 320px;
            max-height: 80vh;
            background: rgba(30, 30, 35, 0.98);
            border: 2px solid white;
            border-radius: 10px;
            padding: 15px;
            z-index: 100000;
            display: none;
            overflow-y: auto;
            color: white;
            font-family: Arial, sans-serif;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            touch-action: auto;
            pointer-events: auto;
        `;

        settingsPanel.innerHTML = `
            <h3 style="margin: 0 0 15px 0; text-align: center;">コントロール設定</h3>
            <button id="toggleEditMode" style="width: 100%; padding: 10px; margin-bottom: 15px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 14px; touch-action: manipulation;">
                移動モード: OFF
            </button>

            <div style="margin-bottom: 20px; padding: 12px; background: rgba(255,255,255,0.1); border-radius: 8px;">
                <h4 style="margin: 0 0 10px 0;">ビジュアル設定</h4>
                ${createToggleButton('botEnabled', 'ボット', visualFeatures.botEnabled)}
                ${createToggleButton('hideBoostGlow', 'ブースト光を隠す', visualFeatures.hideBoostGlow)}
                ${createToggleButton('showGuideLine', 'ガイドラインを表示', visualFeatures.showGuideLine)}
                ${createToggleButton('showSnakeDot', '蛇の頭に点を表示', visualFeatures.showSnakeDot)}
                ${createToggleButton('showPointer', 'ポインターを表示', visualFeatures.showPointer)}
                ${createToggleButton('lowPerformance', 'シンプル表示', visualFeatures.lowPerformance)}
                ${createToggleButton('blackBackground', '背景を真っ黒に', visualFeatures.blackBackground)}
                ${createToggleButton('instantDeadSnake', '死んだ蛇を即消去', visualFeatures.instantDeadSnake)}
                ${createToggleButton('instantEatFood', '食べたエサを即消去', visualFeatures.instantEatFood)}
                ${createToggleButton('noFoodAnimation', 'エサ出現アニメOFF', visualFeatures.noFoodAnimation)}
                ${createToggleButton('noFoodWobble', 'エサの揺れOFF', visualFeatures.noFoodWobble)}
                ${createSlider('蛇の透明度', 'snakeOpacity', visualFeatures.snakeOpacity, 0.1, 1.0, 0.1, true)}
            </div>

            <div style="margin-bottom: 20px; padding: 12px; background: rgba(255,255,255,0.1); border-radius: 8px;">
                <h4 style="margin: 0 0 10px 0;">ガイドライン設定</h4>
                ${createSlider('太さ', 'guidelineThickness', guidelineSettings.thickness, 1, 10, 1, true)}
                ${createColorPicker('色', 'guidelineColor', guidelineSettings.color)}
            </div>

            <div style="margin-bottom: 20px; padding: 12px; background: rgba(255,255,255,0.1); border-radius: 8px;">
                <h4 style="margin: 0 0 10px 0;">ポインター設定</h4>
                ${createSlider('サイズ', 'pointerSize', pointerSettings.size, 20, 80, 5, true)}
                ${createSlider('速度', 'pointerSpeed', pointerSettings.speed, 0.5, 5.0, 0.1, true)}
                ${createColorPicker('色', 'pointerColor', pointerSettings.color)}
            </div>

            <div style="margin-bottom: 20px; padding: 12px; background: rgba(255,255,255,0.1); border-radius: 8px;">
                <h4 style="margin: 0 0 10px 0;">ゲーム設定</h4>
                ${createToggleButton('autoRespawn', 'オートリスポーン', visualFeatures.autoRespawn)}
                ${createSlider('リスポーンディレイ(ms)', 'autoRespawnDelay', autoRespawnDelay, 100, 5000, 100, true)}
                ${createToggleButton('resetZoomOnRespawn', 'リスポーン時ズームリセット', visualFeatures.resetZoomOnRespawn)}
                ${createToggleButton('showRespawnButton', 'リスポーンボタン表示', visualFeatures.showRespawnButton)}
            </div>

            <div id="buttonSettingsContainer"></div>
            <div id="screenButtonsEditContainer" style="display: none; margin-bottom: 20px; padding: 12px; background: rgba(255,255,255,0.1); border-radius: 8px;">
                <h4 style="margin: 0 0 10px 0;">追加ボタン編集</h4>
                <div id="screenButtonsList"></div>
            </div>
            <button id="resetSettings" style="width: 100%; padding: 10px; margin-top: 15px; background: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px; touch-action: manipulation;">
                設定をリセット
            </button>
        `;

        document.body.appendChild(settingsPanel);

        const blockEvent = (e) => {
            e.stopPropagation();
            e.stopImmediatePropagation();
        };

        settingsPanel.addEventListener('touchstart', blockEvent, { passive: false, capture: true });
        settingsPanel.addEventListener('touchmove', blockEvent, { passive: false, capture: true });
        settingsPanel.addEventListener('touchend', blockEvent, { passive: false, capture: true });
        settingsPanel.addEventListener('mousedown', blockEvent, { passive: false, capture: true });
        settingsPanel.addEventListener('mousemove', blockEvent, { passive: false, capture: true });
        settingsPanel.addEventListener('mouseup', blockEvent, { passive: false, capture: true });

        document.getElementById('toggleEditMode').addEventListener('click', toggleEditMode);
        document.getElementById('resetSettings').addEventListener('click', resetSettings);

        ['botEnabled', 'hideBoostGlow', 'showGuideLine', 'showSnakeDot', 'showPointer', 'lowPerformance', 'blackBackground',
         'autoRespawn', 'instantDeadSnake', 'instantEatFood', 'resetZoomOnRespawn', 'noFoodAnimation','noFoodWobble', 'showRespawnButton'].forEach(feature => {
            const btn = document.getElementById(`toggle-${feature}`);
            if (btn) {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    toggleVisualFeature(feature);
                });
            }

            const addBtn = document.getElementById(`add-${feature}`);
            if (addBtn) {
                addBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    addScreenButtonForFeature(feature);
                });
            }
        });

        const opacitySlider = document.getElementById('snakeOpacity');
        if (opacitySlider) {
            opacitySlider.addEventListener('input', (e) => {
                visualFeatures.snakeOpacity = parseFloat(e.target.value);
                document.getElementById('snakeOpacity-val').textContent = visualFeatures.snakeOpacity.toFixed(1);
                saveVisualFeatures();
                applyVisualFeatures();
            });
        }

        const pointerSpeedSlider = document.getElementById('pointerSpeed');
        if (pointerSpeedSlider) {
            pointerSpeedSlider.addEventListener('input', (e) => {
                pointerSettings.speed = parseFloat(e.target.value);
                document.getElementById('pointerSpeed-val').textContent = pointerSettings.speed.toFixed(1);
                saveVisualFeatures();
            });
        }

        const delaySlider = document.getElementById('autoRespawnDelay');
        if (delaySlider) {
            delaySlider.addEventListener('input', (e) => {
                autoRespawnDelay = parseInt(e.target.value);
                document.getElementById('autoRespawnDelay-val').textContent = autoRespawnDelay;
                saveVisualFeatures();
            });
        }

        const guidelineThicknessSlider = document.getElementById('guidelineThickness');
        if (guidelineThicknessSlider) {
            guidelineThicknessSlider.addEventListener('input', (e) => {
                guidelineSettings.thickness = parseInt(e.target.value);
                document.getElementById('guidelineThickness-val').textContent = guidelineSettings.thickness;
                saveVisualFeatures();
                updateGuideLine();
            });
        }

        const guidelineColorPicker = document.getElementById('guidelineColor');
        if (guidelineColorPicker) {
            guidelineColorPicker.addEventListener('input', (e) => {
                guidelineSettings.color = e.target.value;
                saveVisualFeatures();
                updateGuideLine();
            });
        }

        const pointerSizeSlider = document.getElementById('pointerSize');
        if (pointerSizeSlider) {
            pointerSizeSlider.addEventListener('input', (e) => {
                pointerSettings.size = parseInt(e.target.value);
                document.getElementById('pointerSize-val').textContent = pointerSettings.size;
                saveVisualFeatures();
                updatePointerStyle();
            });
        }

        const pointerColorPicker = document.getElementById('pointerColor');
        if (pointerColorPicker) {
            pointerColorPicker.addEventListener('input', (e) => {
                pointerSettings.color = e.target.value;
                saveVisualFeatures();
                updatePointerStyle();
            });
        }

        updateSettingsPanel();
    }

    function createToggleButton(id, label, isActive) {
        return `
            <div style="display: flex; gap: 5px; margin-bottom: 8px;">
                <button id="toggle-${id}" style="flex: 1; padding: 8px; background: ${isActive ? '#4CAF50' : '#666'}; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 13px; text-align: left; padding-left: 12px; touch-action: manipulation;">
                    ${label}: <span style="float: right; font-weight: bold; padding-right: 5px;">${isActive ? 'ON' : 'OFF'}</span>
                </button>
                <button id="add-${id}" style="width: 40px; padding: 8px; background: #2196F3; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; font-weight: bold; touch-action: manipulation;">
                    +
                </button>
            </div>
        `;
    }

    function toggleVisualFeature(feature) {
        visualFeatures[feature] = !visualFeatures[feature];
        saveVisualFeatures();
        applyVisualFeatures();

        const btn = document.getElementById(`toggle-${feature}`);
        if (btn) {
            const isActive = visualFeatures[feature];
            btn.style.background = isActive ? '#4CAF50' : '#666';
            btn.querySelector('span').textContent = isActive ? 'ON' : 'OFF';
        }

        if (feature === 'showGuideLine') {
            updateGuideLine();
        }
        if (feature === 'showSnakeDot') {
            updateSnakeDot();
        }
        if (feature === 'showPointer' && pointerElement) {
            pointerElement.style.display = visualFeatures.showPointer ? (touchActive ? 'block' : 'none') : 'none';
        }
        if (feature === 'showRespawnButton' && respawnButton) {
            respawnButton.style.display = visualFeatures.showRespawnButton ? 'flex' : 'none';
        }
        if (feature === 'botEnabled') {
            if (visualFeatures.botEnabled) {
                startBot();
            } else {
                stopBot();
            }
        }
    }

    function toggleSettingsPanel() {
        const isVisible = settingsPanel.style.display !== 'none';
        settingsPanel.style.display = isVisible ? 'none' : 'block';

        if (!isVisible) {
            updateSettingsPanel();
            const screenButtonsEditContainer = document.getElementById('screenButtonsEditContainer');
            if (screenButtonsEditContainer && screenButtons.length > 0) {
                screenButtonsEditContainer.style.display = 'block';
                updateScreenButtonsList();
            }
        } else {
            const featureEditPanel = document.getElementById('feature-button-edit-panel');
            if (featureEditPanel) {
                featureEditPanel.remove();
            }

            const buttonEditPanels = document.querySelectorAll('[id$="-edit-panel"]');
            buttonEditPanels.forEach(panel => panel.remove());

            editingButton = null;

            const screenButtonsEditContainer = document.getElementById('screenButtonsEditContainer');
            if (screenButtonsEditContainer) {
                screenButtonsEditContainer.style.display = 'none';
            }
        }
    }

    function updateScreenButtonsList() {
        const listContainer = document.getElementById('screenButtonsList');
        if (!listContainer) return;

        if (screenButtons.length === 0) {
            listContainer.innerHTML = '<p style="color: #999; font-size: 12px; margin: 5px 0;">追加されたボタンはありません</p>';
            return;
        }

        let html = '';
        screenButtons.forEach(buttonData => {
            html += `
                <div style="display: flex; gap: 5px; margin-bottom: 8px; align-items: center;">
                    <div style="flex: 1; padding: 8px; background: rgba(100,100,100,0.5); border-radius: 5px; font-size: 12px;">
                        ${getFeatureLabel(buttonData.feature)}
                    </div>
                    <button class="edit-screen-button" data-button-id="${buttonData.id}" style="padding: 8px 12px; background: #2196F3; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">
                        編集
                    </button>
                </div>
            `;
        });

        listContainer.innerHTML = html;

        document.querySelectorAll('.edit-screen-button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const buttonId = btn.dataset.buttonId;
                const buttonData = screenButtons.find(b => b.id === buttonId);
                const buttonElement = document.querySelector(`.feature-button[data-button-id="${buttonId}"]`);
                if (buttonData && buttonElement) {
                    openFeatureButtonEditMenu(buttonData, buttonElement);
                }
            });
        });
    }

    function toggleEditMode() {
        editMode = !editMode;
        const btn = document.getElementById('toggleEditMode');
        btn.textContent = `移動モード: ${editMode ? 'ON' : 'OFF'}`;
        btn.style.background = editMode ? '#ff9800' : '#4CAF50';

        document.querySelectorAll('.control-button').forEach(button => {
            const borderWidth = button.dataset.buttonType === 'boost' || button.dataset.buttonType === 'respawn' ? '3px' : '2px';
            button.style.border = editMode ? '3px dashed yellow' : `${borderWidth} solid white`;
        });
    }

    function updateSettingsPanel() {
        const container = document.getElementById('buttonSettingsContainer');
        if (!container) return;
        container.innerHTML = '';

        Object.keys(buttonSettings).forEach(key => {
            const s = buttonSettings[key];
            const section = document.createElement('div');
            section.style.cssText = 'margin-bottom: 15px; padding: 12px; background: rgba(255,255,255,0.1); border-radius: 8px;';

            const titles = {
                boost: 'ブースト',
                zoomIn: 'ズームイン',
                zoomOut: 'ズームアウト',
                respawn: 'リスポーン'
            };
            const title = titles[key] || key;

            let html = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <h4 style="margin: 0;">${title}</h4>
                    <button class="edit-button" data-button="${key}" style="padding: 5px 12px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; touch-action: manipulation;">
                        ${editingButton === key ? '閉じる' : '編集'}
                    </button>
                </div>
            `;

            if (editingButton === key) {
                html += `<div style="padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.2);">`;
                html += createSlider('幅', `${key}-width`, s.width, 30, 200, 1, false);
                html += createSlider('高さ', `${key}-height`, s.height, 30, 200, 1, false);
                html += createSlider('角丸', `${key}-radius`, s.borderRadius, 0, 50, 1, false);
                html += createSlider('透明度', `${key}-opacity`, s.opacity, 0.1, 1, 0.1, false);
                html += createColorPicker('色', `${key}-color`, s.color);

                if (key === 'zoomIn' || key === 'zoomOut') {
                    html += createSlider('変更値', `${key}-value`, s.value, 0.01, 1.0, 0.01, false);
                }
                html += `</div>`;
            }

            section.innerHTML = html;
            container.appendChild(section);

            section.querySelector('.edit-button').addEventListener('click', (e) => {
                e.stopPropagation();
                editingButton = editingButton === key ? null : key;
                updateSettingsPanel();
            });

            if (editingButton === key) {
                document.getElementById(`${key}-width`).addEventListener('input', (e) => updateSetting(key, 'width', parseFloat(e.target.value)));
                document.getElementById(`${key}-height`).addEventListener('input', (e) => updateSetting(key, 'height', parseFloat(e.target.value)));
                document.getElementById(`${key}-radius`).addEventListener('input', (e) => updateSetting(key, 'borderRadius', parseFloat(e.target.value)));
                document.getElementById(`${key}-opacity`).addEventListener('input', (e) => updateSetting(key, 'opacity', parseFloat(e.target.value)));
                document.getElementById(`${key}-color`).addEventListener('input', (e) => updateSetting(key, 'color', e.target.value));

                if (key === 'zoomIn' || key === 'zoomOut') {
                    document.getElementById(`${key}-value`).addEventListener('input', (e) => updateSetting(key, 'value', parseFloat(e.target.value)));
                }
            }
        });
    }

    function createSlider(label, id, value, min, max, step, isVisual) {
        const displayValue = step < 0.1 ? value.toFixed(2) : (step < 1 ? value.toFixed(1) : value);
        return `
            <div style="margin: 8px 0;">
                <label style="display: block; margin-bottom: 3px; font-size: 12px;">${label}: <span id="${id}-val">${displayValue}</span></label>
                <input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${value}" style="width: 100%; touch-action: pan-x;">
            </div>
        `;
    }

    function createColorPicker(label, id, value) {
        return `
            <div style="margin: 8px 0;">
                <label style="display: block; margin-bottom: 3px; font-size: 12px;">${label}</label>
                <input type="color" id="${id}" value="${value}" style="width: 100%; height: 30px; cursor: pointer; border-radius: 4px; touch-action: manipulation;">
            </div>
        `;
    }

    function updateSetting(buttonType, property, value) {
        buttonSettings[buttonType][property] = value;

        const valSpan = document.getElementById(`${buttonType}-${property}-val`);
        if (valSpan) {
            if (property === 'value') {
                valSpan.textContent = value.toFixed(2);
            } else if (property === 'opacity') {
                valSpan.textContent = value.toFixed(1);
            } else {
                valSpan.textContent = value.toFixed(0);
            }
        }

        const buttonMap = {
            boost: boostButton,
            zoomIn: zoomInButton,
            zoomOut: zoomOutButton,
            respawn: respawnButton
        };
        const button = buttonMap[buttonType];
        if (button) {
            applyButtonStyle(button, buttonType);
        }

        saveSettings();
    }

    function resetSettings() {
        if (confirm('設定をリセットしますか?')) {
            localStorage.removeItem('slitherMobileSettings');
            localStorage.removeItem('slitherVisualFeatures');
            location.reload();
        }
    }

    function startDragging(e, button) {
        e.preventDefault();
        e.stopPropagation();
        draggingButton = button;
        const rect = button.getBoundingClientRect();
        dragOffsetX = e.touches[0].clientX - rect.left;
        dragOffsetY = e.touches[0].clientY - rect.top;
    }

    function adjustZoom(delta) {
        currentZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, currentZoom + delta));
        if (!visualFeatures.resetZoomOnRespawn) {
            gameStartZoom = currentZoom;
        }
        if (window.gsc !== undefined) {
            window.gsc = currentZoom;
        }
        if (window.lgsc !== undefined) {
            window.lgsc = currentZoom;
        }
        if (window.sgsc !== undefined) {
            window.sgsc = currentZoom;
        }
    }

    function getSnakeAngle() {
        if (!window.slither) return lastKnownAngle;

        const angleProps = ['eang', 'wang', 'ang', 'ehang'];

        for (const prop of angleProps) {
            if (typeof window.slither[prop] !== 'undefined' && window.slither[prop] !== null) {
                lastKnownAngle = window.slither[prop];
                return window.slither[prop];
            }
        }

        if (typeof window.ang !== 'undefined') {
            lastKnownAngle = window.ang;
            return window.ang;
        }

        if (typeof window.view_ang !== 'undefined') {
            lastKnownAngle = window.view_ang;
            return window.view_ang;
        }

        return lastKnownAngle;
    }

    function initializePointerPosition() {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const snakeAngle = getSnakeAngle();

        basePointerX = centerX + Math.cos(snakeAngle) * POINTER_BASE_DISTANCE;
        basePointerY = centerY + Math.sin(snakeAngle) * POINTER_BASE_DISTANCE;

        pointerX = basePointerX;
        pointerY = basePointerY;
    }

    function updatePointerPosition() {
        if (!touchActive || !pointerElement || !isInGame()) {
            if (pointerElement) pointerElement.style.display = 'none';
            updateGuideLine();
            return;
        }

        const fingerDeltaX = touchCurrentX - touchStartX;
        const fingerDeltaY = touchCurrentY - touchStartY;

        const adjustedDeltaX = fingerDeltaX * pointerSettings.speed;
        const adjustedDeltaY = fingerDeltaY * pointerSettings.speed;

        pointerX = basePointerX + adjustedDeltaX;
        pointerY = basePointerY + adjustedDeltaY;

        pointerElement.style.left = pointerX + 'px';
        pointerElement.style.top = pointerY + 'px';
        pointerElement.style.display = visualFeatures.showPointer ? 'block' : 'none';

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const angleToCenter = Math.atan2(centerY - pointerY, centerX - pointerX);
        const rotationDegrees = (angleToCenter * 180 / Math.PI) + 90;
        pointerElement.style.transform = `translate(-50%, -50%) rotate(${rotationDegrees}deg)`;

        updateGuideLine();
    }

    let mouseUpdateInterval = null;

    function startMouseTracking() {
        if (mouseUpdateInterval) return;
        mouseUpdateInterval = setInterval(() => {
            if (touchActive && isInGame()) {
                simulateMouseMove(pointerX, pointerY);
                updateSnakeDot();
            }
        }, 16);
    }

    function stopMouseTracking() {
        if (mouseUpdateInterval) {
            clearInterval(mouseUpdateInterval);
            mouseUpdateInterval = null;
        }
    }

    function simulateMouseMove(x, y) {
        if (!isInGame()) return;

        const canvas = document.querySelector('canvas');
        if (!canvas) return;

        if (window.slither && typeof window.gsc !== 'undefined') {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            const dx = x - centerX;
            const dy = y - centerY;

            window.xm = dx;
            window.ym = dy;
        }

        const event = new MouseEvent('mousemove', {
            clientX: x,
            clientY: y,
            bubbles: true,
            cancelable: true,
            view: window
        });
        canvas.dispatchEvent(event);
        window.onmousemove && window.onmousemove(event);
    }

    function simulateMouseDown() {
        if (!isInGame()) return;
        const canvas = document.querySelector('canvas');
        if (!canvas) return;

        const event = new MouseEvent('mousedown', {
            button: 0,
            buttons: 1,
            bubbles: true,
            cancelable: true,
            view: window
        });
        canvas.dispatchEvent(event);
        window.onmousedown && window.onmousedown(event);

        if (typeof window.setAcceleration === 'function') {
            window.setAcceleration(1);
        }
    }

    function simulateMouseUp() {
        const canvas = document.querySelector('canvas');
        if (!canvas) return;

        const event = new MouseEvent('mouseup', {
            button: 0,
            buttons: 0,
            bubbles: true,
            cancelable: true,
            view: window
        });
        canvas.dispatchEvent(event);
        window.onmouseup && window.onmouseup(event);

        if (typeof window.setAcceleration === 'function') {
            window.setAcceleration(0);
        }
    }

    document.addEventListener('touchstart', (e) => {
        if (e.target.closest('#settings-panel') ||
            e.target === settingsButton ||
            e.target.closest('#feature-button-edit-panel')) {
            return;
        }

        if (e.target.closest('.control-button') || e.target.closest('.feature-button')) {
            return;
        }

        if (!isInGame()) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        touchActive = true;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchCurrentX = touchStartX;
        touchCurrentY = touchStartY;

        initializePointerPosition();
        updatePointerPosition();
        startMouseTracking();
    }, { passive: false, capture: true });

    document.addEventListener('touchmove', (e) => {
        if (draggingButton) {
            e.preventDefault();
            e.stopPropagation();
            const newX = e.touches[0].clientX - dragOffsetX;
            const newY = e.touches[0].clientY - dragOffsetY;
            const buttonType = draggingButton.dataset.buttonType;
            buttonSettings[buttonType].x = newX;
            buttonSettings[buttonType].y = newY;
            draggingButton.style.left = newX + 'px';
            draggingButton.style.top = newY + 'px';
            saveSettings();
            return;
        }

        if (!touchActive) return;

        if (e.target.closest('#settings-panel') ||
            e.target.closest('#feature-button-edit-panel')) {
            return;
        }

        if (isInGame()) {
            e.preventDefault();
            e.stopPropagation();
        }

        touchCurrentX = e.touches[0].clientX;
        touchCurrentY = e.touches[0].clientY;

        if (isInGame()) {
            updatePointerPosition();
        }
    }, { passive: false, capture: true });

    document.addEventListener('touchend', (e) => {
        if (draggingButton) {
            draggingButton = null;
            e.preventDefault();
            e.stopPropagation();
            return;
        }

        if (e.target.closest('.control-button') ||
            e.target === settingsButton ||
            e.target.closest('#settings-panel') ||
            e.target.closest('#feature-button-edit-panel')) {
            return;
        }

        if (e.touches.length === 0 && touchActive) {
            if (isInGame()) {
                e.preventDefault();
                e.stopPropagation();
            }

            touchActive = false;
            stopMouseTracking();
            if (pointerElement) {
                pointerElement.style.display = 'none';
            }
            if (guideLine) {
                guideLine.style.display = 'none';
            }
        }
    }, { passive: false, capture: true });

    document.addEventListener('touchcancel', (e) => {
        touchActive = false;
        stopMouseTracking();
        if (pointerElement) {
            pointerElement.style.display = 'none';
        }
        if (guideLine) {
            guideLine.style.display = 'none';
        }
    }, { passive: false, capture: true });

    setInterval(() => {
        if (isInGame()) {
            updateSnakeDot();
        }
    }, 50);

    setInterval(() => {
        if (isInGame() && window.gsc !== undefined) {
            if (Math.abs(window.gsc - currentZoom) > 0.001) {
                window.gsc = currentZoom;
            }
        }
    }, 50);

    function loadScreenButtons() {
        const saved = localStorage.getItem('slitherScreenButtons');
        if (saved) {
            try {
                screenButtons = JSON.parse(saved);
            } catch (e) {
            }
        }
    }

    function saveScreenButtons() {
        localStorage.setItem('slitherScreenButtons', JSON.stringify(screenButtons));
    }

    function getFeatureLabel(featureId) {
        const labels = {
            'botEnabled': 'ボット',
            'hideBoostGlow': 'ブースト光',
            'showGuideLine': 'ガイド',
            'showSnakeDot': '点',
            'showPointer': 'ポインター',
            'showSnakeCenterLine': '中心線',
            'noFoodAnimation': 'エサ揺れ',
            'noFoodWobble': 'エサアニメ',
            'instantDeadSnake': '死蛇消去',
            'instantEatFood': '食エサ消去',
            'simpleFoodGraphics': 'シンプルエサ'
        };
        return labels[featureId] || featureId;
    }

    function addScreenButtonForFeature(featureId) {
        const exists = screenButtons.find(b => b.feature === featureId);
        if (exists) {
            alert('この機能のボタンは既に追加されています');
            return;
        }

        const newButton = {
            id: Date.now().toString(),
            feature: featureId,
            x: window.innerWidth / 2 - 35,
            y: window.innerHeight / 2 - 35,
            width: 70,
            height: 70,
            color: visualFeatures[featureId] ? '#4CAF50' : '#666',
            opacity: 0.7,
            borderRadius: 15
        };

        screenButtons.push(newButton);
        saveScreenButtons();
        createFeatureButton(newButton);

        const screenButtonsEditContainer = document.getElementById('screenButtonsEditContainer');
        if (screenButtonsEditContainer) {
            screenButtonsEditContainer.style.display = 'block';
            updateScreenButtonsList();
        }
    }

    function createFeatureButton(buttonData) {
        const button = document.createElement('button');
        button.className = 'feature-button';
        button.dataset.buttonId = buttonData.id;
        button.dataset.feature = buttonData.feature;
        button.textContent = getFeatureLabel(buttonData.feature);
        button.style.cssText = `
            position: fixed;
            left: ${buttonData.x}px;
            top: ${buttonData.y}px;
            width: ${buttonData.width}px;
            height: ${buttonData.height}px;
            background-color: ${buttonData.color}${Math.round(buttonData.opacity * 255).toString(16).padStart(2, '0')}`;
        button.style.cssText += `
            border: 2px solid white;
            border-radius: ${buttonData.borderRadius}%;
            color: white;
            font-weight: bold;
            font-size: 11px;
            z-index: 10001;
            touch-action: none;
            user-select: none;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            word-break: keep-all;
        `;

        updateFeatureButtonColor(button, buttonData.feature);

        button.addEventListener('touchstart', (e) => {
            if (editMode) {
                startDraggingFeatureButton(e, button, buttonData);
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            button.style.filter = 'brightness(1.3)';
        }, { passive: false });

        button.addEventListener('touchend', (e) => {
            if (editMode) return;
            e.preventDefault();
            e.stopPropagation();
            button.style.filter = 'brightness(1)';
            toggleFeatureFromButton(buttonData.feature, button);
        }, { passive: false });

        document.body.appendChild(button);
    }

    function updateFeatureButtonColor(button, featureId) {
        const isActive = visualFeatures[featureId];
        const buttonData = screenButtons.find(b => b.id === button.dataset.buttonId);
        if (buttonData) {
            buttonData.color = isActive ? '#4CAF50' : '#666';
            button.style.backgroundColor = `${buttonData.color}${Math.round(buttonData.opacity * 255).toString(16).padStart(2, '0')}`;
        }
    }

    function toggleFeatureFromButton(featureId, button) {
        visualFeatures[featureId] = !visualFeatures[featureId];
        saveVisualFeatures();
        applyVisualFeatures();
        updateFeatureButtonColor(button, featureId);

        const mainToggle = document.getElementById(`toggle-${featureId}`);
        if (mainToggle) {
            const isActive = visualFeatures[featureId];
            mainToggle.style.background = isActive ? '#4CAF50' : '#666';
            const span = mainToggle.querySelector('span');
            if (span) span.textContent = isActive ? 'ON' : 'OFF';
        }
    }

    function deleteFeatureButton(buttonId) {
        screenButtons = screenButtons.filter(b => b.id !== buttonId);
        saveScreenButtons();
    }

    function startDraggingFeatureButton(e, button, buttonData) {
        e.preventDefault();
        e.stopPropagation();
        const startX = e.touches[0].clientX;
        const startY = e.touches[0].clientY;
        const offsetX = startX - buttonData.x;
        const offsetY = startY - buttonData.y;

        const handleMove = (e) => {
            e.preventDefault();
            const newX = e.touches[0].clientX - offsetX;
            const newY = e.touches[0].clientY - offsetY;
            buttonData.x = newX;
            buttonData.y = newY;
            button.style.left = newX + 'px';
            button.style.top = newY + 'px';
            saveScreenButtons();
        };

        const handleEnd = () => {
            document.removeEventListener('touchmove', handleMove);
            document.removeEventListener('touchend', handleEnd);
        };

        document.addEventListener('touchmove', handleMove, { passive: false });
        document.addEventListener('touchend', handleEnd);
    }

    function openFeatureButtonEditMenu(buttonData, buttonElement) {
        let editPanel = document.getElementById('feature-button-edit-panel');
        if (editPanel) {
            editPanel.remove();
        }

        editPanel = document.createElement('div');
        editPanel.id = 'feature-button-edit-panel';
        editPanel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 300px;
            background: rgba(30, 30, 35, 0.98);
            border: 2px solid white;
            border-radius: 10px;
            padding: 15px;
            z-index: 100000;
            color: white;
            font-family: Arial, sans-serif;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            touch-action: auto;
            pointer-events: auto;
        `;

        editPanel.innerHTML = `
            <h3 style="margin: 0 0 15px 0; text-align: center;">ボタン編集</h3>
            <div style="margin-bottom: 10px;">
                <label style="display: block; margin-bottom: 3px; font-size: 12px;">幅: <span id="fb-width-val">${buttonData.width}</span></label>
                <input type="range" id="fb-width" min="40" max="150" step="5" value="${buttonData.width}" style="width: 100%; touch-action: auto;">
            </div>
            <div style="margin-bottom: 10px;">
                <label style="display: block; margin-bottom: 3px; font-size: 12px;">高さ: <span id="fb-height-val">${buttonData.height}</span></label>
                <input type="range" id="fb-height" min="40" max="150" step="5" value="${buttonData.height}" style="width: 100%; touch-action: auto;">
            </div>
            <div style="margin-bottom: 10px;">
                <label style="display: block; margin-bottom: 3px; font-size: 12px;">角丸: <span id="fb-radius-val">${buttonData.borderRadius}</span></label>
                <input type="range" id="fb-radius" min="0" max="50" step="1" value="${buttonData.borderRadius}" style="width: 100%; touch-action: auto;">
            </div>
            <div style="margin-bottom: 10px;">
                <label style="display: block; margin-bottom: 3px; font-size: 12px;">透明度: <span id="fb-opacity-val">${buttonData.opacity.toFixed(1)}</span></label>
                <input type="range" id="fb-opacity" min="0.1" max="1" step="0.1" value="${buttonData.opacity}" style="width: 100%; touch-action: auto;">
            </div>
            <div style="display: flex; gap: 10px; margin-top: 15px;">
                <button id="fb-delete" style="flex: 1; padding: 10px; background: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer; touch-action: manipulation;">削除</button>
                <button id="fb-close" style="flex: 1; padding: 10px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; touch-action: manipulation;">閉じる</button>
            </div>
        `;

        document.body.appendChild(editPanel);

        const blockEvent = (e) => {
            e.stopPropagation();
            e.stopImmediatePropagation();
        };

        editPanel.addEventListener('touchstart', blockEvent, { passive: false, capture: true });
        editPanel.addEventListener('touchmove', blockEvent, { passive: false, capture: true });
        editPanel.addEventListener('touchend', blockEvent, { passive: false, capture: true });
        editPanel.addEventListener('mousedown', blockEvent, { passive: false, capture: true });
        editPanel.addEventListener('mousemove', blockEvent, { passive: false, capture: true });
        editPanel.addEventListener('mouseup', blockEvent, { passive: false, capture: true });

        const updateButtonStyle = () => {
            buttonElement.style.width = buttonData.width + 'px';
            buttonElement.style.height = buttonData.height + 'px';
            buttonElement.style.borderRadius = buttonData.borderRadius + '%';
            buttonElement.style.backgroundColor = `${buttonData.color}${Math.round(buttonData.opacity * 255).toString(16).padStart(2, '0')}`;
            saveScreenButtons();
        };

        document.getElementById('fb-width').addEventListener('input', (e) => {
            buttonData.width = parseInt(e.target.value);
            document.getElementById('fb-width-val').textContent = buttonData.width;
            updateButtonStyle();
        });

        document.getElementById('fb-height').addEventListener('input', (e) => {
            buttonData.height = parseInt(e.target.value);
            document.getElementById('fb-height-val').textContent = buttonData.height;
            updateButtonStyle();
        });

        document.getElementById('fb-radius').addEventListener('input', (e) => {
            buttonData.borderRadius = parseInt(e.target.value);
            document.getElementById('fb-radius-val').textContent = buttonData.borderRadius;
            updateButtonStyle();
        });

        document.getElementById('fb-opacity').addEventListener('input', (e) => {
            buttonData.opacity = parseFloat(e.target.value);
            document.getElementById('fb-opacity-val').textContent = buttonData.opacity.toFixed(1);
            updateButtonStyle();
        });

        document.getElementById('fb-delete').addEventListener('click', () => {
            if (confirm('このボタンを削除しますか?')) {
                deleteFeatureButton(buttonData.id);
                buttonElement.remove();
                editPanel.remove();
            }
        });

        document.getElementById('fb-close').addEventListener('click', () => {
            editPanel.remove();
        });
    }

    function init() {
        loadSettings();
        loadVisualFeatures();
        createPointer();
        createGuideLine();
        createSnakeDot();
        createBoostButton();
        createZoomButtons();
        createRespawnButton();
        createSettingsButton();
        createSettingsPanel();

        const canvas = document.querySelector('canvas');
        if (canvas) {
            canvas.style.touchAction = 'none';
        }

        if (window.gsc !== undefined) {
            currentZoom = window.gsc;
            gameStartZoom = currentZoom;
        }

        wasInGame = isInGame();
        applyVisualFeatures();

        loadScreenButtons();
        screenButtons.forEach(buttonData => {
            createFeatureButton(buttonData);
        });

        if (visualFeatures.botEnabled) {
            startBot();
        }

    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();