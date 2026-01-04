// ==UserScript==
// @name         Overtide.io Mod Menu
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Mod menu for Overtide.io with various features
// @author       You
// @match        https://overtide.io/*
// @match        https://*.overtide.io/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/560585/Overtideio%20Mod%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/560585/Overtideio%20Mod%20Menu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Mod menu state
    let modMenuVisible = false;
    let modSettings = {
        godMode: false,
        speedHack: false,
        speedMultiplier: 1.5,
        noClip: false,
        infiniteAmmo: false,
        esp: false,
        aimbot: false,
        autoClick: false
    };

    // Store original game functions/variables
    let gameHooks = {
        player: null,
        originalUpdate: null,
        originalMove: null
    };

    // Create mod menu UI
    function createModMenu() {
        // Remove existing menu if present
        const existingMenu = document.getElementById('overtide-mod-menu');
        if (existingMenu) existingMenu.remove();

        const menu = document.createElement('div');
        menu.id = 'overtide-mod-menu';
        menu.innerHTML = `
            <div class="mod-menu-header">
                <h3>Overtide.io Mod Menu</h3>
                <button class="mod-menu-close" id="mod-menu-close">×</button>
            </div>
            <div class="mod-menu-content">
                <div class="mod-section">
                    <h4>Combat</h4>
                    <label class="mod-toggle">
                        <input type="checkbox" id="god-mode" ${modSettings.godMode ? 'checked' : ''}>
                        <span>God Mode</span>
                    </label>
                    <label class="mod-toggle">
                        <input type="checkbox" id="infinite-ammo" ${modSettings.infiniteAmmo ? 'checked' : ''}>
                        <span>Infinite Ammo</span>
                    </label>
                    <label class="mod-toggle">
                        <input type="checkbox" id="aimbot" ${modSettings.aimbot ? 'checked' : ''}>
                        <span>Aimbot</span>
                    </label>
                    <label class="mod-toggle">
                        <input type="checkbox" id="auto-click" ${modSettings.autoClick ? 'checked' : ''}>
                        <span>Auto Click</span>
                    </label>
                </div>
                <div class="mod-section">
                    <h4>Movement</h4>
                    <label class="mod-toggle">
                        <input type="checkbox" id="speed-hack" ${modSettings.speedHack ? 'checked' : ''}>
                        <span>Speed Hack</span>
                    </label>
                    <div class="mod-slider-container" id="speed-slider-container" style="display: ${modSettings.speedHack ? 'block' : 'none'};">
                        <label>Speed Multiplier: <span id="speed-value">${modSettings.speedMultiplier}x</span></label>
                        <input type="range" id="speed-multiplier" min="1" max="5" step="0.1" value="${modSettings.speedMultiplier}">
                    </div>
                    <label class="mod-toggle">
                        <input type="checkbox" id="no-clip" ${modSettings.noClip ? 'checked' : ''}>
                        <span>No Clip</span>
                    </label>
                </div>
                <div class="mod-section">
                    <h4>Visual</h4>
                    <label class="mod-toggle">
                        <input type="checkbox" id="esp" ${modSettings.esp ? 'checked' : ''}>
                        <span>ESP (Wallhack)</span>
                    </label>
                </div>
                <div class="mod-section">
                    <h4>Debug & Help</h4>
                    <button id="inspect-game" class="mod-button">🔍 Quick Search</button>
                    <button id="deep-search" class="mod-button">🔬 Deep Search (Slow)</button>
                    <button id="find-player" class="mod-button">👤 Find Player Object</button>
                    <button id="list-window" class="mod-button">📋 List All Window Properties</button>
                    <button id="show-help" class="mod-button">❓ Show Manual Inspection Guide</button>
                    <div id="help-text" style="display: none; margin-top: 10px; padding: 10px; background: rgba(0,0,0,0.3); border-radius: 8px; font-size: 12px; line-height: 1.6;">
                        <strong>Manual Inspection Steps:</strong><br>
                        1. Press F12 → <strong>Console</strong> tab<br>
                        2. Try these commands:<br>
                        <code style="background: rgba(0,0,0,0.5); padding: 2px 4px; border-radius: 3px;">window.Module</code> (Unity games)<br>
                        <code style="background: rgba(0,0,0,0.5); padding: 2px 4px; border-radius: 3px;">Object.keys(window).filter(k => !k.includes('CPM'))</code><br>
                        <code style="background: rgba(0,0,0,0.5); padding: 2px 4px; border-radius: 3px;">document.querySelector('canvas')</code><br>
                        3. Press F12 → <strong>Sources</strong> tab<br>
                        4. Look for .js files (especially framework.js or similar)<br>
                        5. Search for keywords: "player", "health", "speed", "update"<br>
                        6. Set breakpoints to see game state<br>
                        <br>
                        <strong>For Unity Games:</strong><br>
                        - Check if <code>window.Module.SendMessage</code> exists<br>
                        - You may need GameObject names from the game code<br>
                        - Unity games often obfuscate their JavaScript
                    </div>
                </div>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            #overtide-mod-menu {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 400px;
                max-height: 80vh;
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border: 2px solid #0f3460;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
                z-index: 999999;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                color: #fff;
                display: none;
                overflow: hidden;
            }

            #overtide-mod-menu.visible {
                display: block;
            }

            .mod-menu-header {
                background: linear-gradient(135deg, #0f3460 0%, #16213e 100%);
                padding: 15px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 2px solid #0f3460;
            }

            .mod-menu-header h3 {
                margin: 0;
                font-size: 18px;
                font-weight: 600;
                color: #4a9eff;
                text-shadow: 0 0 10px rgba(74, 158, 255, 0.5);
            }

            .mod-menu-close {
                background: transparent;
                border: none;
                color: #fff;
                font-size: 28px;
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.3s ease;
            }

            .mod-menu-close:hover {
                background: rgba(255, 255, 255, 0.1);
                transform: rotate(90deg);
            }

            .mod-menu-content {
                padding: 20px;
                max-height: calc(80vh - 70px);
                overflow-y: auto;
            }

            .mod-menu-content::-webkit-scrollbar {
                width: 8px;
            }

            .mod-menu-content::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 4px;
            }

            .mod-menu-content::-webkit-scrollbar-thumb {
                background: #4a9eff;
                border-radius: 4px;
            }

            .mod-section {
                margin-bottom: 25px;
            }

            .mod-section:last-child {
                margin-bottom: 0;
            }

            .mod-section h4 {
                margin: 0 0 15px 0;
                font-size: 14px;
                font-weight: 600;
                color: #4a9eff;
                text-transform: uppercase;
                letter-spacing: 1px;
                border-bottom: 1px solid rgba(74, 158, 255, 0.3);
                padding-bottom: 8px;
            }

            .mod-toggle {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px;
                margin-bottom: 8px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .mod-toggle:hover {
                background: rgba(255, 255, 255, 0.1);
                transform: translateX(5px);
            }

            .mod-toggle span {
                font-size: 14px;
                user-select: none;
            }

            .mod-toggle input[type="checkbox"] {
                width: 20px;
                height: 20px;
                cursor: pointer;
                accent-color: #4a9eff;
            }

            .mod-slider-container {
                padding: 12px;
                margin-top: 8px;
                background: rgba(255, 255, 255, 0.03);
                border-radius: 8px;
            }

            .mod-slider-container label {
                display: block;
                margin-bottom: 10px;
                font-size: 13px;
                color: #ccc;
            }

            .mod-slider-container input[type="range"] {
                width: 100%;
                height: 6px;
                border-radius: 3px;
                background: rgba(255, 255, 255, 0.1);
                outline: none;
                -webkit-appearance: none;
            }

            .mod-slider-container input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: #4a9eff;
                cursor: pointer;
                box-shadow: 0 0 10px rgba(74, 158, 255, 0.5);
            }

            .mod-slider-container input[type="range"]::-moz-range-thumb {
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: #4a9eff;
                cursor: pointer;
                border: none;
                box-shadow: 0 0 10px rgba(74, 158, 255, 0.5);
            }

            .mod-button {
                width: 100%;
                padding: 12px;
                margin-bottom: 8px;
                background: rgba(74, 158, 255, 0.2);
                border: 1px solid #4a9eff;
                border-radius: 8px;
                color: #4a9eff;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .mod-button:hover {
                background: rgba(74, 158, 255, 0.3);
                transform: translateY(-2px);
            }

            #mod-menu-toggle-btn {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #0f3460 0%, #16213e 100%);
                border: 2px solid #4a9eff;
                border-radius: 50%;
                color: #4a9eff;
                font-size: 24px;
                cursor: pointer;
                z-index: 999998;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 20px rgba(74, 158, 255, 0.3);
                transition: all 0.3s ease;
            }

            #mod-menu-toggle-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 30px rgba(74, 158, 255, 0.5);
            }

            #mod-menu-toggle-btn:active {
                transform: scale(0.95);
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(menu);

        // Setup event listeners
        setupEventListeners();
    }

    // Deep search for objects with game-like properties
    function deepSearchForGameObjects(obj, found, path, depth, maxDepth) {
        if (depth >= maxDepth) return;
        
        const gameProperties = ['x', 'y', 'health', 'hp', 'speed', 'velocity', 'position', 'transform', 'rigidbody'];
        const skipTypes = ['function', 'string', 'number', 'boolean', 'undefined'];
        const skipKeys = ['prototype', '__proto__', 'constructor', 'length'];
        
        try {
            for (let key in obj) {
                if (skipKeys.includes(key)) continue;
                
                try {
                    const value = obj[key];
                    const valueType = typeof value;
                    
                    if (skipTypes.includes(valueType)) continue;
                    if (value === null) continue;
                    
                    // Check if object has game-like properties
                    if (valueType === 'object') {
                        let gamePropertyCount = 0;
                        for (let prop of gameProperties) {
                            if (value.hasOwnProperty(prop) || prop in value) {
                                gamePropertyCount++;
                            }
                        }
                        
                        // If it has multiple game properties, it's likely a game object
                        if (gamePropertyCount >= 2) {
                            const fullPath = `${path}.${key}`;
                            if (!found[fullPath]) {
                                found[fullPath] = value;
                                console.log(`%c🎮 Found game-like object: ${fullPath}`, 'color: #00ff00; font-weight: bold', {
                                    properties: gameProperties.filter(p => p in value),
                                    object: value
                                });
                            }
                        }
                        
                        // Recursively search nested objects (but limit depth)
                        if (depth < maxDepth - 1) {
                            deepSearchForGameObjects(value, found, `${path}.${key}`, depth + 1, maxDepth);
                        }
                    }
                } catch(e) {
                    // Skip if we can't access the property
                }
            }
        } catch(e) {
            // Skip if we can't iterate
        }
    }

    // Find game objects by searching common patterns
    function findGameObjects() {
        console.log('=== Searching for game objects ===');
        console.log('%cLooking for Unity WebGL and other game engines...', 'color: #4a9eff; font-weight: bold');
        
        // Unity WebGL specific paths
        const unityPaths = [
            'window.Module',
            'window.UnityInstance',
            'window.gameInstance',
            'window.unityInstance',
            'window.unityGame',
            'window.canvas'
        ];
        
        // Common game object locations
        const searchPaths = [
            'window.game',
            'window.player',
            'window.Game',
            'window.Player',
            'window.app',
            'window.scene',
            'window.engine',
            'window.physics',
            'window.world',
            'window.gameManager',
            'window.GameManager',
            'window.playerController',
            'window.PlayerController'
        ];

        const found = {};
        
        // Search Unity paths first
        console.log('%c--- Unity WebGL Detection ---', 'color: #ffaa00');
        unityPaths.forEach(path => {
            try {
                const obj = eval(path);
                if (obj && typeof obj === 'object') {
                    found[path] = obj;
                    console.log(`%c✓ Found Unity: ${path}`, 'color: #00ff00', obj);
                    
                    // If Module found, try to access Unity functions
                    if (path === 'window.Module' && obj.SendMessage) {
                        console.log('%cUnity SendMessage function found!', 'color: #00ff00');
                        console.log('You can call: window.Module.SendMessage(gameObject, method, value)');
                    }
                }
            } catch(e) {}
        });
        
        // Search common game paths
        console.log('%c--- Common Game Objects ---', 'color: #ffaa00');
        searchPaths.forEach(path => {
            try {
                const obj = eval(path);
                if (obj && typeof obj === 'object') {
                    found[path] = obj;
                    console.log(`%c✓ Found: ${path}`, 'color: #00ff00', obj);
                }
            } catch(e) {}
        });

        // Search window properties for game-related objects
        console.log('%c--- Searching Window Properties ---', 'color: #ffaa00');
        const gameKeywords = ['game', 'player', 'scene', 'world', 'unity', 'instance', 'module'];
        const skipKeywords = ['cpmstar', 'google', 'ads', 'analytics', 'ad', 'tracking', 'gtag', 'fbq', 'amplitude', 'mixpanel'];
        
        for (let key in window) {
            try {
                const obj = window[key];
                if (obj && typeof obj === 'object' && obj !== null) {
                    const keyLower = key.toLowerCase();
                    // Check for game-related keywords
                    if (gameKeywords.some(keyword => keyLower.includes(keyword))) {
                        // Skip known non-game objects
                        if (!skipKeywords.some(skip => keyLower.includes(skip))) {
                            found[`window.${key}`] = obj;
                            console.log(`%c? Potential: window.${key}`, 'color: #ffff00', obj);
                        }
                    }
                }
            } catch(e) {}
        }
        
        // Deep search for objects with game-like properties
        console.log('%c--- Deep Search for Game Objects ---', 'color: #ffaa00');
        console.log('Searching for objects with properties: x, y, health, speed, velocity...');
        deepSearchForGameObjects(window, found, 'window', 0, 3);
        
        // Look for canvas element (Unity games usually have one)
        const canvas = document.querySelector('canvas');
        if (canvas) {
            found['document.canvas'] = canvas;
            console.log('%c✓ Found Canvas element', 'color: #00ff00', canvas);
            console.log('Canvas ID:', canvas.id, '| Classes:', canvas.className);
        }

        console.log('%c=== Search Complete ===', 'color: #4a9eff; font-weight: bold');
        console.log(`Found ${Object.keys(found).length} potential game objects`);
        console.log('%c💡 TIP: Try these commands in console:', 'color: #ffaa00; font-weight: bold');
        console.log('  - Object.keys(window).filter(k => k.toLowerCase().includes("game"))');
        console.log('  - Object.keys(window).filter(k => k.toLowerCase().includes("player"))');
        console.log('  - window.Module (if Unity game)');
        console.log('  - Check the canvas element for game data');

        return found;
    }

    // Find player object
    function findPlayer() {
        console.log('=== Searching for player object ===');
        
        const objects = findGameObjects();
        const playerCandidates = [];
        
        for (let path in objects) {
            const obj = objects[path];
            // Look for player-like properties
            if (obj.x !== undefined && obj.y !== undefined) {
                playerCandidates.push({ path, obj });
                console.log(`Player candidate: ${path}`, {
                    x: obj.x,
                    y: obj.y,
                    health: obj.health,
                    speed: obj.speed,
                    velocity: obj.velocity
                });
            }
        }
        
        return playerCandidates;
    }

    // Setup event listeners for mod menu
    function setupEventListeners() {
        // Toggle button
        const toggleBtn = document.getElementById('mod-menu-toggle-btn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', toggleModMenu);
        }

        // Close button
        const closeBtn = document.getElementById('mod-menu-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', toggleModMenu);
        }

        // Debug buttons
        document.getElementById('inspect-game')?.addEventListener('click', () => {
            const objects = findGameObjects();
            console.table(objects);
            alert(`Found ${Object.keys(objects).length} potential game objects. Check console for details.`);
        });

        document.getElementById('deep-search')?.addEventListener('click', () => {
            console.log('%c=== Starting Deep Search (this may take a moment) ===', 'color: #ffaa00; font-weight: bold');
            const found = {};
            deepSearchForGameObjects(window, found, 'window', 0, 4);
            console.log('%c=== Deep Search Complete ===', 'color: #00ff00; font-weight: bold');
            console.log(`Found ${Object.keys(found).length} game-like objects`);
            console.table(found);
            alert(`Deep search complete! Found ${Object.keys(found).length} game-like objects. Check console for details.`);
        });

        document.getElementById('find-player')?.addEventListener('click', () => {
            const players = findPlayer();
            console.table(players);
            alert(`Found ${players.length} potential player objects. Check console for details.`);
        });

        document.getElementById('list-window')?.addEventListener('click', () => {
            console.log('%c=== All Window Properties ===', 'color: #4a9eff; font-weight: bold');
            const allKeys = Object.keys(window).sort();
            console.log(`Total properties: ${allKeys.length}`);
            console.log('All keys:', allKeys);
            
            // Filter for potentially interesting ones
            const interesting = allKeys.filter(k => {
                const lower = k.toLowerCase();
                return !lower.includes('webkit') && 
                       !lower.includes('moz') && 
                       !lower.includes('ms') &&
                       !lower.includes('chrome') &&
                       !lower.includes('ad') &&
                       !lower.includes('google') &&
                       !lower.includes('fb') &&
                       !lower.includes('cpm');
            });
            console.log('%cPotentially interesting properties:', 'color: #00ff00', interesting);
            alert(`Found ${allKeys.length} window properties. ${interesting.length} potentially interesting. Check console.`);
        });

        document.getElementById('show-help')?.addEventListener('click', () => {
            const helpText = document.getElementById('help-text');
            if (helpText) {
                helpText.style.display = helpText.style.display === 'none' ? 'block' : 'none';
            }
        });

        // Toggle switches
        document.getElementById('god-mode')?.addEventListener('change', (e) => {
            modSettings.godMode = e.target.checked;
            console.log('God Mode:', modSettings.godMode);
            applyMod('godMode', modSettings.godMode);
        });

        document.getElementById('speed-hack')?.addEventListener('change', (e) => {
            modSettings.speedHack = e.target.checked;
            const sliderContainer = document.getElementById('speed-slider-container');
            if (sliderContainer) {
                sliderContainer.style.display = modSettings.speedHack ? 'block' : 'none';
            }
            console.log('Speed Hack:', modSettings.speedHack);
            applyMod('speedHack', modSettings.speedHack);
        });

        document.getElementById('speed-multiplier')?.addEventListener('input', (e) => {
            modSettings.speedMultiplier = parseFloat(e.target.value);
            const valueSpan = document.getElementById('speed-value');
            if (valueSpan) {
                valueSpan.textContent = modSettings.speedMultiplier + 'x';
            }
            console.log('Speed Multiplier:', modSettings.speedMultiplier);
            applyMod('speedMultiplier', modSettings.speedMultiplier);
        });

        document.getElementById('no-clip')?.addEventListener('change', (e) => {
            modSettings.noClip = e.target.checked;
            console.log('No Clip:', modSettings.noClip);
            applyMod('noClip', modSettings.noClip);
        });

        document.getElementById('infinite-ammo')?.addEventListener('change', (e) => {
            modSettings.infiniteAmmo = e.target.checked;
            console.log('Infinite Ammo:', modSettings.infiniteAmmo);
            applyMod('infiniteAmmo', modSettings.infiniteAmmo);
        });

        document.getElementById('esp')?.addEventListener('change', (e) => {
            modSettings.esp = e.target.checked;
            console.log('ESP:', modSettings.esp);
            applyMod('esp', modSettings.esp);
        });

        document.getElementById('aimbot')?.addEventListener('change', (e) => {
            modSettings.aimbot = e.target.checked;
            console.log('Aimbot:', modSettings.aimbot);
            applyMod('aimbot', modSettings.aimbot);
        });

        document.getElementById('auto-click')?.addEventListener('change', (e) => {
            modSettings.autoClick = e.target.checked;
            console.log('Auto Click:', modSettings.autoClick);
            applyMod('autoClick', modSettings.autoClick);
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modMenuVisible) {
                toggleModMenu();
            }
        });
    }

    // Toggle mod menu visibility
    function toggleModMenu() {
        modMenuVisible = !modMenuVisible;
        const menu = document.getElementById('overtide-mod-menu');
        if (menu) {
            menu.classList.toggle('visible', modMenuVisible);
        }
    }

    // Create toggle button
    function createToggleButton() {
        const btn = document.createElement('button');
        btn.id = 'mod-menu-toggle-btn';
        btn.innerHTML = '⚙';
        btn.title = 'Open Mod Menu (Press M)';
        document.body.appendChild(btn);
    }

    // Apply mod effects - Hook into game functions
    function applyMod(modName, value) {
        // Try to find and hook into game objects
        if (!gameHooks.player) {
            // Try to find player object
            const players = findPlayer();
            if (players.length > 0) {
                gameHooks.player = players[0].obj;
                console.log('Player object found:', gameHooks.player);
            }
        }

        const player = gameHooks.player;
        
        switch(modName) {
            case 'godMode':
                if (player) {
                    if (value) {
                        // Store original health/damage functions
                        if (player.health !== undefined) {
                            player._originalHealth = player.health;
                            Object.defineProperty(player, 'health', {
                                get: () => Infinity,
                                set: () => {},
                                configurable: true
                            });
                        }
                        if (player.takeDamage) {
                            player._originalTakeDamage = player.takeDamage;
                            player.takeDamage = () => {};
                        }
                    } else {
                        // Restore original
                        if (player._originalHealth !== undefined) {
                            Object.defineProperty(player, 'health', {
                                get: () => player._originalHealth,
                                set: (val) => { player._originalHealth = val; },
                                configurable: true
                            });
                        }
                        if (player._originalTakeDamage) {
                            player.takeDamage = player._originalTakeDamage;
                        }
                    }
                }
                break;
                
            case 'speedHack':
            case 'speedMultiplier':
                if (player) {
                    if (modSettings.speedHack) {
                        if (player.speed !== undefined) {
                            player._originalSpeed = player.speed;
                            player.speed = player._originalSpeed * modSettings.speedMultiplier;
                        }
                        if (player.velocity) {
                            player._originalVelocity = player.velocity;
                            Object.defineProperty(player, 'velocity', {
                                get: () => ({
                                    x: player._originalVelocity?.x * modSettings.speedMultiplier || 0,
                                    y: player._originalVelocity?.y * modSettings.speedMultiplier || 0
                                }),
                                set: (val) => {
                                    if (player._originalVelocity) {
                                        player._originalVelocity = val;
                                    }
                                },
                                configurable: true
                            });
                        }
                    } else {
                        if (player._originalSpeed !== undefined) {
                            player.speed = player._originalSpeed;
                        }
                        if (player._originalVelocity && player._originalVelocity !== undefined) {
                            Object.defineProperty(player, 'velocity', {
                                get: () => player._originalVelocity,
                                set: (val) => { player._originalVelocity = val; },
                                configurable: true
                            });
                        }
                    }
                }
                break;
                
            case 'noClip':
                if (player) {
                    if (value) {
                        if (player.collision !== undefined) {
                            player._originalCollision = player.collision;
                            player.collision = false;
                        }
                        if (player.body) {
                            player._originalBody = player.body;
                            if (player.body.setCollisionGroup) {
                                player.body.setCollisionGroup(0);
                            }
                        }
                    } else {
                        if (player._originalCollision !== undefined) {
                            player.collision = player._originalCollision;
                        }
                        if (player._originalBody && player.body) {
                            // Restore collision
                        }
                    }
                }
                break;
                
            case 'infiniteAmmo':
                if (player) {
                    if (value) {
                        if (player.ammo !== undefined) {
                            player._originalAmmo = player.ammo;
                            Object.defineProperty(player, 'ammo', {
                                get: () => Infinity,
                                set: () => {},
                                configurable: true
                            });
                        }
                        if (player.ammunition !== undefined) {
                            player._originalAmmunition = player.ammunition;
                            Object.defineProperty(player, 'ammunition', {
                                get: () => Infinity,
                                set: () => {},
                                configurable: true
                            });
                        }
                    } else {
                        if (player._originalAmmo !== undefined) {
                            Object.defineProperty(player, 'ammo', {
                                get: () => player._originalAmmo,
                                set: (val) => { player._originalAmmo = val; },
                                configurable: true
                            });
                        }
                        if (player._originalAmmunition !== undefined) {
                            Object.defineProperty(player, 'ammunition', {
                                get: () => player._originalAmmunition,
                                set: (val) => { player._originalAmmunition = val; },
                                configurable: true
                            });
                        }
                    }
                }
                break;
                
            case 'esp':
                // ESP implementation would require finding enemy objects
                // and drawing overlays
                break;
                
            case 'aimbot':
                // Aimbot would require finding enemies and calculating angles
                break;
                
            case 'autoClick':
                if (value) {
                    // Auto-click implementation
                    const autoClickInterval = setInterval(() => {
                        if (!modSettings.autoClick) {
                            clearInterval(autoClickInterval);
                            return;
                        }
                        // Simulate click - adjust selector based on game
                        const shootButton = document.querySelector('[data-action="shoot"], .shoot-button, button');
                        if (shootButton) {
                            shootButton.click();
                        }
                    }, 100);
                }
                break;
        }
    }

    // Keyboard shortcut (M key to toggle menu)
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'm' && !e.ctrlKey && !e.altKey && !e.shiftKey) {
            const activeElement = document.activeElement;
            if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
                return; // Don't toggle if typing in input
            }
            toggleModMenu();
        }
    });

    // Unity WebGL helper - try to hook into Unity SendMessage
    function tryUnityHook() {
        if (window.Module && window.Module.SendMessage) {
            console.log('%c=== Unity WebGL Detected ===', 'color: #00ff00; font-weight: bold');
            console.log('Unity Module found! You can use SendMessage to interact with the game.');
            console.log('Example: window.Module.SendMessage("GameObjectName", "MethodName", "value")');
            console.log('Note: You need to know the GameObject names and method names from the game code.');
            
            // Try to find game canvas
            const canvas = document.querySelector('canvas');
            if (canvas) {
                console.log('Game canvas found:', canvas);
            }
        }
    }

    // Initialize when DOM is ready
    function init() {
        if (document.body) {
            createModMenu();
            createToggleButton();
            
            // Try to find game objects after delays (game may load slowly)
            setTimeout(() => {
                console.log('%c=== Overtide.io Mod Menu Initialized ===', 'color: #4a9eff; font-weight: bold; font-size: 14px');
                console.log('Press M or click the gear icon (⚙) to open the mod menu');
                console.log('Use the debug buttons in the menu to find game objects');
                findGameObjects();
                tryUnityHook();
            }, 2000);
            
            // Try again after more time (game might load later)
            setTimeout(() => {
                console.log('%cRe-scanning for game objects...', 'color: #ffaa00');
                findGameObjects();
                tryUnityHook();
            }, 5000);
        } else {
            setTimeout(init, 100);
        }
    }

    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
