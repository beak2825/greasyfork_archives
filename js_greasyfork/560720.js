// ==UserScript==
    // @name         MineFun king 零式
　　// @namespace    http://tampermonkey.net/
    // @version      7.2
    // @description  故障中だよ！
    // @author       サギ2266
    // @match        https://minefun.io/*
    // @match        https://*.minefun.io/*
    // @match        http://minefun.io/*
    // @match        http://*.minefun.io/*
    // @icon         https://www.google.com/s2/favicons?sz=64&domain=minefun.io
    // @grant        none
    // @run-at       document-start
    // @license      ISC
// @downloadURL https://update.greasyfork.org/scripts/560720/MineFun%20king%20%E9%9B%B6%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/560720/MineFun%20king%20%E9%9B%B6%E5%BC%8F.meta.js
    // ==/UserScript==
 
    (function() {
        'use strict';
 
        // IMMEDIATE ALERT TO CONFIRM SCRIPT IS LOADED
            console.log('%c[MineFun King] Script is loading...', 'color: #00ff00; font-size: 16px; font-weight: bold;');
 
            // Create visual status indicator with manual button
            function createStatusIndicator() {
                const indicator = document.createElement('div');
                indicator.id = 'minefun-king-status';
                indicator.style.cssText = `
                    position: fixed;
                    top: 10px;
                    right: 10px;
                    background: rgba(0, 0, 0, 0.9);
                    color: #00ff00;
                    padding: 15px 20px;
                    border-radius: 8px;
                    font-family: monospace;
                    font-size: 14px;
                    z-index: 999999;
                    border: 2px solid #00ff00;
                    box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
                `;
            indicator.innerHTML = `
                🎮 MineFun King v7.2<br>
                Status: <span id="mfk-status">Loading...</span><br>
                    <button id="mfk-manual-btn" style="
                        margin-top: 10px;
                        padding: 8px 15px;
                        background: #00ff00;
                        color: #000;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        font-weight: bold;
                        font-size: 12px;
                    ">🔧 FORCE ACTIVATE</button>
                    <br>
                    <button id="mfk-scan-btn" style="
                        margin-top: 5px;
                        padding: 5px 10px;
                        background: #ffff00;
                        color: #000;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 11px;
                    ">🔍 Scan Now</button>
                `;
                document.body.appendChild(indicator);
 
                // Manual activation button
                document.getElementById('mfk-manual-btn').addEventListener('click', () => {
                    forceActivate();
                });
 
                // Scan button
                document.getElementById('mfk-scan-btn').addEventListener('click', () => {
                    aggressiveScan();
                    // Also run the detailed finder
                    setTimeout(() => {
                        console.log('%c[MineFun King] Running detailed search...', 'color: #00ffff;');
                        window.findAllGameObjects();
                    }, 1000);
                });
 
                return indicator;
            }
 
        function updateStatus(status, color = '#00ff00') {
            const statusEl = document.getElementById('mfk-status');
            if (statusEl) {
                statusEl.textContent = status;
                statusEl.style.color = color;
            }
        }
 
        // Create Hit All indicator (green/red dot) - TOP LEFT
        function createHitAllIndicator() {
            const indicator = document.createElement('div');
            indicator.id = 'mfk-hitall-indicator';
            indicator.style.cssText = `
                position: fixed;
                top: 10px;
                left: 10px;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: #ff0000;
                border: 3px solid rgba(255, 255, 255, 0.8);
                box-shadow: 0 0 15px rgba(255, 0, 0, 0.8);
                z-index: 999999;
                transition: all 0.3s ease;
            `;
 
            if (document.body) {
                document.body.appendChild(indicator);
            } else {
                window.addEventListener('DOMContentLoaded', () => {
                    document.body.appendChild(indicator);
                });
            }
 
            return indicator;
        }
 
        function updateHitAllIndicator(isActive) {
            const indicator = document.getElementById('mfk-hitall-indicator');
            if (indicator) {
                if (isActive) {
                    indicator.style.background = '#00ff00';
                    indicator.style.boxShadow = '0 0 15px rgba(0, 255, 0, 0.8)';
                } else {
                    indicator.style.background = '#ff0000';
                    indicator.style.boxShadow = '0 0 15px rgba(255, 0, 0, 0.8)';
                }
            }
        }
 
        // Create Infection Win indicator (green/red dot) - BOTTOM LEFT
        function createInfectionWinIndicator() {
            const indicator = document.createElement('div');
            indicator.id = 'mfk-infection-indicator';
            indicator.style.cssText = `
                position: fixed;
                bottom: 10px;
                left: 10px;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: #ff0000;
                border: 3px solid rgba(255, 255, 255, 0.8);
                box-shadow: 0 0 15px rgba(255, 0, 0, 0.8);
                z-index: 999999;
                transition: all 0.3s ease;
            `;
 
            if (document.body) {
                document.body.appendChild(indicator);
            } else {
                window.addEventListener('DOMContentLoaded', () => {
                    document.body.appendChild(indicator);
                });
            }
 
            return indicator;
        }
 
        function updateInfectionWinIndicator(isActive) {
            const indicator = document.getElementById('mfk-infection-indicator');
            if (indicator) {
                if (isActive) {
                    indicator.style.background = '#00ff00';
                    indicator.style.boxShadow = '0 0 15px rgba(0, 255, 0, 0.8)';
                } else {
                    indicator.style.background = '#ff0000';
                    indicator.style.boxShadow = '0 0 15px rgba(255, 0, 0, 0.8)';
                }
            }
        }
 
        // Create DEBUG overlay for Infection Win
        function createInfectionDebugOverlay() {
            const overlay = document.createElement('div');
            overlay.id = 'mfk-infection-debug';
            overlay.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.95);
                color: #00ff00;
                padding: 20px;
                border-radius: 10px;
                font-family: 'Courier New', monospace;
                font-size: 14px;
                z-index: 10000000;
                border: 3px solid #ff0000;
                box-shadow: 0 0 30px rgba(255, 0, 0, 0.7);
                display: none;
                min-width: 400px;
                max-width: 600px;
            `;
            overlay.innerHTML = `
                <div style="text-align: center; margin-bottom: 15px;">
                    <div style="font-size: 20px; font-weight: bold; color: #ff0000;">🐛 INFECTION WIN DEBUG</div>
                </div>
                <div id="mfk-debug-content" style="line-height: 1.8; max-height: 400px; overflow-y: auto;">
                    <div>⏳ Waiting for H key press...</div>
                </div>
                <div style="text-align: center; margin-top: 15px; font-size: 12px; color: #888;">
                    Press H again to close this debug panel
                </div>
            `;
 
            if (document.body) {
                document.body.appendChild(overlay);
            } else {
                window.addEventListener('DOMContentLoaded', () => {
                    document.body.appendChild(overlay);
                });
            }
 
            return overlay;
        }
 
        function showInfectionDebug(message, isError = false) {
            const overlay = document.getElementById('mfk-infection-debug');
            const content = document.getElementById('mfk-debug-content');
 
            if (!overlay || !content) return;
 
            const color = isError ? '#ff0000' : '#00ff00';
            const timestamp = new Date().toLocaleTimeString();
 
            const newLine = document.createElement('div');
            newLine.style.color = color;
            newLine.innerHTML = `[${timestamp}] ${message}`;
 
            content.appendChild(newLine);
            content.scrollTop = content.scrollHeight;
 
            overlay.style.display = 'block';
        }
 
        function clearInfectionDebug() {
            const content = document.getElementById('mfk-debug-content');
            if (content) {
                content.innerHTML = '<div>⏳ Starting new debug session...</div>';
            }
        }
 
        function hideInfectionDebug() {
            const overlay = document.getElementById('mfk-infection-debug');
            if (overlay) {
                overlay.style.display = 'none';
            }
        }
 
        // Create keybinds help menu (toggle with K)
        function createKeybindsMenu() {
            const menu = document.createElement('div');
            menu.id = 'mfk-keybinds-menu';
            menu.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.95);
                color: #00ff00;
                padding: 30px;
                border-radius: 15px;
                font-family: 'Courier New', monospace;
                font-size: 16px;
                z-index: 9999999;
                border: 3px solid #00ff00;
                box-shadow: 0 0 30px rgba(0, 255, 0, 0.7);
                display: none;
                min-width: 400px;
            `;
            menu.innerHTML = `
                <div style="text-align: center; margin-bottom: 20px;">
                    <div style="font-size: 24px; font-weight: bold; color: #00ff00;">🎮 MineFun King v7.2</div>
                    <div style="font-size: 14px; color: #ffff00; margin-top: 5px;">Status: <span id="mfk-menu-status">ACTIVE</span></div>
                </div>
 
                <div style="border-top: 2px solid #00ff00; padding-top: 15px; margin-top: 15px;">
                    <div style="font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #00ffff;">⌨️ KEYBINDS:</div>
 
                    <div style="display: flex; justify-content: space-between; margin: 8px 0;">
                        <span style="color: #ffff00;">SPACE</span>
                        <span>→</span>
                        <span>Super Jump / Fly 🚀</span>
                    </div>
 
                    <div style="display: flex; justify-content: space-between; margin: 8px 0;">
                        <span style="color: #ffff00;">\` (Backtick)</span>
                        <span>→</span>
                        <span>Teleport to Block 📍</span>
                    </div>
 
                    <div style="display: flex; justify-content: space-between; margin: 8px 0;">
                        <span style="color: #ffff00;">. (Period)</span>
                        <span>→</span>
                        <span>Toggle Hit All (Green Dot = ON) 🎯</span>
                    </div>
 
                    <div style="display: flex; justify-content: space-between; margin: 8px 0;">
                        <span style="color: #ffff00;">, (Comma)</span>
                        <span>→</span>
                        <span>Remove Floor 🪓</span>
                    </div>
 
                    <div style="display: flex; justify-content: space-between; margin: 8px 0;">
                        <span style="color: #ffff00;">H</span>
                        <span>→</span>
                        <span>SERVER TP K**l (Infection) 🌐💀</span>
                    </div>
 
                    <div style="display: flex; justify-content: space-between; margin: 8px 0;">
                        <span style="color: #ffff00;">= or + (Equal)</span>
                        <span>→</span>
                        <span>Toggle All Hacks ON/OFF 🔥</span>
                    </div>
 
                    <div style="display: flex; justify-content: space-between; margin: 8px 0;">
                        <span style="color: #ffff00;">K K (Double-Tap)</span>
                        <span>→</span>
                        <span>Toggle This Menu 📋</span>
                    </div>
                </div>
 
                <div style="border-top: 2px solid #00ff00; padding-top: 15px; margin-top: 15px;">
                    <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #00ffff;">✨ FEATURES:</div>
                    <div style="font-size: 14px; line-height: 1.6;">
                        <div>✅ ESP (See players through walls)</div>
                        <div>✅ No Fog</div>
                        <div>✅ Fast Crouch</div>
                        <div>✅ No Fall Damage</div>
                        <div>✅ Instant Block Breaking</div>
                        <div>✅ Auto-activation on server join</div>
                    </div>
                </div>
 
                <div style="border-top: 2px solid #00ff00; padding-top: 15px; margin-top: 15px;">
                    <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #00ffff;">📍 INDICATORS:</div>
                    <div style="font-size: 14px; line-height: 1.6;">
                        <div>🔴 <strong>Top-Left:</strong> Hit All OFF</div>
                        <div>🟢 <strong>Top-Left:</strong> Hit All ON</div>
                        <div>🔴 <strong>Bottom-Left:</strong> Infection Win Ready</div>
                        <div>🟢 <strong>Bottom-Left:</strong> Killing in Progress</div>
                    </div>
                </div>
 
                <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #888;">
                    Double-tap K to close • Press H to WIN (Infection Mode)
                </div>
            `;
 
            if (document.body) {
                document.body.appendChild(menu);
            } else {
                window.addEventListener('DOMContentLoaded', () => {
                    document.body.appendChild(menu);
                });
            }
 
            return menu;
        }
 
        // Toggle menu with DOUBLE-TAP K key (press K twice within 2 seconds)
        let menuVisible = false;
        let lastKPress = 0;
        window.addEventListener('keydown', (e) => {
            if (e.code === 'KeyK') {
                const now = Date.now();
                const timeSinceLastPress = now - lastKPress;
 
                // If pressed within 2 seconds, toggle menu
                if (timeSinceLastPress < 2000 && timeSinceLastPress > 100) {
                    const menu = document.getElementById('mfk-keybinds-menu');
                    if (menu) {
                        menuVisible = !menuVisible;
                        menu.style.display = menuVisible ? 'block' : 'none';
 
                        // Update status in menu
                        const statusEl = document.getElementById('mfk-menu-status');
                        if (statusEl && window.hooked) {
                            statusEl.textContent = cheatInterval ? 'ACTIVE ✅' : 'STANDBY ⏸️';
                            statusEl.style.color = cheatInterval ? '#00ff00' : '#ffff00';
                        }
                    }
                    lastKPress = 0; // Reset after successful toggle
                } else {
                    // First press or too long ago
                    lastKPress = now;
                    console.log('%c[MineFun King] Press K again within 2 seconds to open menu', 'color: #ffff00; font-size: 12px;');
                }
            }
        });
 
        // Wait for page to load before creating indicator and menu
        if (document.body) {
            createStatusIndicator();
            createKeybindsMenu();
            createHitAllIndicator();
            createInfectionWinIndicator();
            createInfectionDebugOverlay();
        } else {
            window.addEventListener('DOMContentLoaded', () => {
                createStatusIndicator();
                createKeybindsMenu();
                createHitAllIndicator();
                createInfectionWinIndicator();
                createInfectionDebugOverlay();
            });
        }
 
            // TECHNIQUE 1: Hook POKI SDK - games must call these methods
            console.log('%c[MineFun King] 🎯 Hooking POKI SDK...', 'color: #00ffff; font-size: 14px;');
 
            // Create a proxy for the POKI SDK that will be set later
            const pokiHandler = {
                get(target, prop) {
                    if (prop === 'gameplayStart') {
                        return function(...args) {
                            console.log('%c[MineFun King] 🎮 POKI.gameplayStart called!', 'color: #00ff00; font-weight: bold;');
                            // Game is starting! Wait a moment then auto-activate
                            setTimeout(() => {
                                console.log('%c[MineFun King] 🔥 Gameplay started! Auto-activating cheats...', 'color: #ff00ff; font-weight: bold;');
 
                            // Don't auto-activate anymore - user must press = or + key
                            console.log('%c[MineFun King] 🎮 Game ready! Press = or + to activate cheats', 'color: #ffff00; font-size: 16px; font-weight: bold;');
                            updateStatus('Press = or + to start', '#ffff00');
                            }, 1000);
 
                            if (target[prop]) {
                                return target[prop].apply(target, args);
                            }
                        };
                    }
                    if (prop === 'gameplayStop') {
                        return function(...args) {
                            console.log('%c[MineFun King] 🛑 POKI.gameplayStop called!', 'color: #ff9900;');
                            if (target[prop]) {
                                return target[prop].apply(target, args);
                            }
                        };
                    }
                    return target[prop];
                }
            };
 
            // Intercept POKI SDK assignments - with safety checks
            Object.defineProperty(window, 'PokiSDK', {
                set(value) {
                    console.log('%c[MineFun King] 📦 PokiSDK assigned!', 'color: #00ff00;');
                    // Only create Proxy if value is an object
                    if (value && typeof value === 'object') {
                        this._pokiSDK = new Proxy(value, pokiHandler);
                    } else {
                        // If not an object, store directly
                        this._pokiSDK = value;
                    }
                },
                get() {
                    return this._pokiSDK;
                },
                configurable: true
            });
 
        // AUTO-ENABLE DEBUG MODE (this is what makes it work!)
        console.log('%c[MineFun King] 🔥 Auto-enabling debug mode...', 'color: #ff00ff; font-size: 14px; font-weight: bold;');
 
        // Hook Function.prototype.call to intercept ALL function calls
        const originalCall = Function.prototype.call;
        Function.prototype.call = function(thisArg, ...args) {
            // Check if thisArg looks like a game object
            if (thisArg && typeof thisArg === 'object') {
                if (thisArg.player && thisArg.gameWorld && !window.hooked) {
                    console.log('%c[MineFun King] 🎯 FOUND via function.call!', 'color: #00ff00; font-weight: bold;');
                    window.hooked = thisArg;
                    updateStatus('Game detected! 🎮', '#00ff00');
                }
            }
            return originalCall.apply(this, [thisArg, ...args]);
        };
 
        // Silent startup - no alerts!
        setTimeout(() => {
            console.log('%c[MineFun King] v5.5 loaded! DEBUG MODE: Press H to see why Infection Win works/fails!', 'color: #00ff00; font-size: 14px;');
            updateStatus('Auto-mode! 🔥', '#00ff00');
        }, 500);
 
    const { log, warn, error, debug } = window.console;
 
    const packetsOut = {
        TIME_STEP_INFO: 1,
        TIME_STEP: 2,
        DEATH: 3,
        REQUEST_RESPAWN: 4,
        PLAY_EMOTION: 5,
        PING: 7,
        PLACE_BLOCKS: 8,
        CHAT: 9,
        GET_PLAYERS: 10,
        CONVERT_MINEBUCKS: 11,
        FREE_AD: 12,
        HIT: 13,
        PASTE_CHUNK_BLOCKS: 22,
        FILL_AREA_WITH_BLOCKS: 23,
        PICKUP_DROP_ITEM: 24,
        SKIN_CHANGED: 25,
        USE_FOOD: 26,
        GOT_DAMAGE: 27,
        THROW_DYNAMITE: 28,
        THROW_PROJECTILE: 29,
        UPDATE_SIGN_TEXT: 30,
        SIGN_INPUT_REQUEST: 31,
        MODIFIERS_AMOUNT_TO_REQUEST: 500,
        GET_CHUNKS_MODIFIERS: 501,
        GET_ITEM_WITH_CREATE: 502,
        SHOOTER_CHANGE_WEAPON: 516,
        OPEN_LOOTBOX: 517,
        TRY_TO_USE_TNT: 520,
        USE_HAND_ITEM: 521,
        SET_CURRENT_ACTIVE_SLOT: 504,
        REPLACE_ITEMS_IN_BLOCK: 505,
        REPLACE_ITEMS: 506,
        MOVE_ITEMS_IN_BLOCK: 507,
        MOVE_ITEMS: 508,
        THROW_OUT_ITEM: 509,
        GET_BLOCK_VIA_WHEEL: 510,
        CHANGE_BLOCK_OPEN_STATE: 511,
        EXIT_FROM_STORAGE_BLOCK: 518,
        INST_DRAG_ITEM_TO_ARMOR: 519,
        OPEN_ITEM: 220,
        CRAFT: 221,
        START_TICKER: 222,
        ADD_PLAYER_TO_PRIVATE: 512,
        REMOVE_PLAYER_FROM_PRIVATE: 513,
        GET_PLAYER_PRIVATE_MEMBERS: 514,
        CREATE_PREFAB: 1101,
        DELETE_PREFAB: 1102,
        GET_PREFAB: 1103,
        GET_PREFABS: 1104,
        INSERT_PREFAB: 1105,
        ERASE_AREA: 1106,
        PUBLISH_PREFAB: 1107,
        HNS_ATTACK_BLOCK: 1200,
        HNS_PLAYER_LEFT_HIDED_STATE: 1201,
        CHOOSED_BLOCK: 1202,
        HNS_CHANGE_DOOR_STATE: 1203,
        HNS_GET_FREE_KIT: 1204,
        INFECTION_GET_WEAPON: 1300,
        INFECTION_SELECT_ZOMBIE: 1301,
        WAR_GET_WEAPON: 1400,
        SKY_WARS_SET_KIT: 1500,
        SKY_WARS_GET_FREE_KIT: 1501,
        ONE_BLOCK_PORTAL_REQUEST: 1550,
        ONE_BLOCK_GO_HOME: 1551
    };
    const packetsIn = {
        PLAYER_IN_CHUNK_RANGE: 1,
        PLAYER_OUT_OF_CHUNK_RANGE: 2,
        TIME_STEP: 3,
        UPD_SERVER_TIME: 4,
        PLAYERS_TIME_STEP_INFO: 5,
        PLAYER_DEAD: 6,
        PLAYER_RESPAWNED: 7,
        PLAYER_LEFT: 8,
        PLAY_PLAYER_EMOTION: 9,
        INIT_DATA: 10,
        CHANGE_PLAYER_SKIN: 11,
        PONG: 12,
        UPD_GAME_TIMER: 13,
        GAME_END: 14,
        ALERT: 16,
        CHAT_ALERT: 17,
        CONSOLE_LOG: 18,
        PLAYER_CURRENT_ITEM: 19,
        CHAT: 20,
        GET_PLAYERS: 21,
        UPDATE_SKIN: 22,
        UPDATE_PLAYER_SKIN: 23,
        SET_HEALTH: 24,
        SET_HUNGER: 25,
        PLAYER_FOOTSTEPS_HERABLE: 26,
        TNT_WAS_ACTIVATED: 27,
        TNT_EXPLODED: 28,
        UPD_TICKING_ENTITY_TRANSFORMS: 29,
        DYNAMITE_WAS_THROWN: 30,
        DYNAMITE_EXPLODED: 31,
        DEV_SPAWN_SMALL_CUBE_ON_XYZ: 32,
        PROJECTILE_WAS_THROWN: 33,
        PROJECTILE_COLLIDED: 34,
        SIGN_INPUT_REQUEST: 35,
        SIGN_CHANGE_TEXT: 36,
        CORRECT_POSITION: 37,
        INVENTORY: 501,
        UPDATE_ARMOR: 525,
        UPDATE_PLAYER_ARMOR: 526,
        INSIDE_ITEM_DATA: 527,
        CLOSE_ALL_MODALS: 528,
        UPDATE_DRAG_AND_OPENED_BLOCK: 529,
        BLOCK_STATE: 530,
        INIT_INFO: 502,
        UPDATE_NEAREST_CHUNKS: 503,
        ALL_MODIFIERS_SENT: 504,
        CHUNK_MODIFIERS: 505,
        BLOCKS_TO_SET_BY_COORDS: 506,
        ERASE_BLOCKS: 508,
        SET_BLOCKS_BY_BLOCKS_OFFSETS: 509,
        PRIVATE_MEMBERS_DATA: 510,
        SHOOTER_SHOOT: 511,
        GOT_DAMAGE: 512,
        UPDATE_BALANCE: 513,
        UPD_STARTING_TIME: 522,
        YOU_DEAD: 523,
        PLAYER_GOT_DAMAGE: 524,
        SET_POS: 531,
        SET_ROT: 532,
        LOOTBOX_DATA: 514,
        SHOOTER_CHANGE_PLAYER_WEAPON: 515,
        ADD_DROP_ITEMS: 516,
        UPDATE_DROP_ITEMS: 517,
        DELETE_DROP_ITEMS: 518,
        DELETE_DROP_ITEM_BY_PICKUP: 519,
        FAILED_DROP_ITEM_PICKUP_ATTEMPT: 520,
        CREATIVE_PLOT_MARKER: 1100,
        PREFABS: 1101,
        PREFAB: 1102,
        HNS_PLAYER_HIDED: 1200,
        HNS_HUNTERS_AND_HIDERS: 1204,
        HNS_YOU_ARE_HIDER: 1205,
        HNS_PLAYER_LEFT_HIDED_STATE: 1207,
        HNS_LOCATE_HIDERS: 1208,
        HNS_PLAYER_WAS_ATTACKED: 1209,
        HNS_YOU_ARE_HUNTER: 1210,
        HNS_CHANGE_PLAYER_TO_HUNTER: 1211,
        HNS_UPD_HUNTERS_AND_HIDERS_AMOUNT: 1212,
        HNS_KILL_INFO: 1213,
        HNS_SHOW_BLOCKS_CHOICE_OPTIONS: 1214,
        HNS_CHANGE_PLAYER_BLOCK_ID: 1219,
        HNS_SET_LOCAL_PLAYER_BLOCK_ID: 1220,
        HNS_YOU_WAS_ATTACKED: 1221,
        HNS_HUNTERS_UNLOCKED: 1222,
        HNS_ADD_PHYSICS_IMPULSE: 1223,
        HNS_YOU_CANT_HIDE_HERE: 1225,
        WAR_PLAYER_DEATH: 1300,
        WAR_HURTED_PLAYER: 1301,
        WAR_YOU_KILLED_PLAYER: 1302,
        WAR_YOU_RESPAWNED: 1303,
        INFECTION_ZOMBIES_AND_SHOOTERS: 1350,
        INFECTION_YOU_TURN_TO_ZOMBIE: 1351,
        INFECTION_PLAYER_TURNED_TO_ZOMBIE: 1352,
        INFECTION_UPD_ZOMBIES_AND_SHOOTERS_AMOUNT: 1354,
        INFECTION_YOU_RESPAWNED: 1356,
        INFECTION_HURTED_PLAYER: 1357,
        INFECTION_YOU_KILLED_PLAYER: 1358,
        INFECTION_DEATH_INFO: 1359,
        INFECTION_SHOOTER_WAS_ATTACKED: 1360,
        INFECTION_SET_WEAPON: 1361,
        INFECTION_SET_ZOMBIE_TYPE: 1362,
        INFECTION_UPDATE_HP: 1363,
        SKY_WARS_GAME_STARTED: 1400,
        SKY_WARS_NICKNAMES_DEPTH_TEST_FALSE: 1401,
        SKY_WARS_CHANGE_PLAYER_AVATAR: 1402,
        SKY_WARS_BOARD_PLACE: 1403,
        SKY_WARS_UPD_KILL_DEATH_BAR: 1404,
        ONE_BLOCK_PORTAL_REQUEST_REJECTED: 1450,
        ONE_BLOCK_DEATH: 1451,
        ONE_BLOCK_BLOCKS_DESTROYED: 1452,
        ONE_BLOCK_NEW_PHASE: 1453,
        ONE_BLOCK_LEADERBOARD: 1454
    };
 
    const invertedPacketsIn = Object.fromEntries(Object.entries(packetsIn).map(([key, value]) => [value, key]));
    const invertedPacketsOut = Object.fromEntries(Object.entries(packetsOut).map(([key, value]) => [value, key]));
 
    const _assign = Object.assign;
    const _create = Object.create;
    const _defineProperty = Object.defineProperty;
    const _parse = JSON.parse;
 
            // Store WebSocket for later use
            let gameWebSocket = null;
            let playerData = null;
            let gameActive = false;
            let packetLogging = false; // MUST be declared BEFORE WebSocket hook
 
            // TECHNIQUE: Network Packet Interception - MINIMAL VERSION
            const OriginalWebSocket = window.WebSocket;
            window.WebSocket = function(...args) {
                const ws = new OriginalWebSocket(...args);
                gameWebSocket = ws;
                console.log('%c[MineFun King] 🌐 WebSocket detected!', 'color: #00ffff; font-size: 14px;');
 
                // Store original send for packet interception (when logging enabled)
                const originalSend = ws.send.bind(ws);
                ws.send = function(data) {
                    // Only intercept if logging is enabled
                    if (packetLogging) {
                        try {
                            console.log('%c[MineFun King] 📤 Sending:', 'color: #ffff00;', data);
                        } catch (e) {}
                    }
                    return originalSend(data);
                };
 
                // Simple connection logging - no interference
                ws.addEventListener('open', () => {
                    console.log('%c[MineFun King] ✅ WebSocket connected!', 'color: #00ff00;');
                    updateStatus('Connected!', '#00ff00');
                    gameActive = true;
                });
 
                ws.addEventListener('close', (e) => {
                    console.log('%c[MineFun King] 🔴 WebSocket closed', 'color: #ff0000;');
                });
 
                return ws;
            };
 
            // Global function to send custom packets
            window.sendCustomPacket = function(packetType, ...args) {
                if (!gameWebSocket) {
                    console.log('%c[MineFun King] ❌ No WebSocket connection', 'color: #ff0000;');
                    return false;
                }
 
                console.log('%c[MineFun King] 📤 Sending custom packet type: ' + packetType, 'color: #00ff00;', args);
 
                // This would need to be implemented based on the game's protocol
                // For now, just log it
                return true;
            };
 
            // Packet logger - call this to enable detailed packet logging
            window.startPacketLogging = function() {
                packetLogging = true;
                console.log('%c[MineFun King] 📊 PACKET LOGGING ENABLED', 'color: #00ff00; font-size: 16px; font-weight: bold;');
                console.log('%cAll WebSocket packets will be logged. This will generate A LOT of output!', 'color: #ffff00;');
                updateStatus('Logging packets...', '#ffff00');
 
                console.log('%c[MineFun King] ✅ Packet logging ON! Check console for packet data.', 'color: #00ff00; font-size: 14px;');
            };
 
            window.stopPacketLogging = function() {
                packetLogging = false;
                console.log('%c[MineFun King] 📊 Packet logging disabled', 'color: #888;');
            };
 
            // Analyze WebSocket status
            window.checkWebSocket = function() {
                console.log('%c=== WebSocket Status ===', 'color: #00ffff; font-size: 16px; font-weight: bold;');
                console.log('WebSocket exists:', !!gameWebSocket);
                console.log('Game active:', gameActive);
 
                if (gameWebSocket) {
                    console.log('WebSocket readyState:', gameWebSocket.readyState);
                    console.log('  0 = CONNECTING, 1 = OPEN, 2 = CLOSING, 3 = CLOSED');
                    console.log('WebSocket URL:', gameWebSocket.url);
                    console.log('WebSocket protocol:', gameWebSocket.protocol);
                } else {
                    console.log('%c❌ No WebSocket found. Are you in a game?', 'color: #ff0000;');
                }
 
                return gameWebSocket;
            };
 
    Object.create = function create() {
        if (!arguments[0]) return {};
        return _create.apply(this, arguments);
    };
 
            // Hook Object.defineProperty to catch any 'player' property
    Object.defineProperty = function defineProperty() {
        const ret = _defineProperty.apply(this, arguments);
 
                // Log ALL defineProperty calls to see what's being defined
                if (arguments[0] && arguments[1]) {
                    const objName = arguments[0].constructor ? arguments[0].constructor.name : 'Unknown';
                    const propName = arguments[1];
 
                    // Look for game-related properties
                    if (propName === 'player' || propName === 'gameWorld' || propName === 'server') {
                        console.log('%c[MineFun King] 🎯 defineProperty caught: ' + objName + '.' + propName, 'color: #00ff00; font-weight: bold;');
 
                        if (propName === 'player') {
            window.hooked = ret;
                            console.log('%c[MineFun King] ✅ Player object hooked successfully!', 'color: #00ff00; font-size: 14px;');
                            updateStatus('Press = or + to start', '#ffff00');
 
                            // Don't auto-activate - wait for user to press = or +
                            console.log('%c[MineFun King] 🎉 GAME HOOKED! Press = or + to activate cheats!', 'color: #00ff00; font-size: 16px; font-weight: bold;');
                        }
                    }
                }
 
        return ret;
    };
 
            // Try to hook Object.prototype.player (might fail with modern security)
            try {
    Object.defineProperty(Object.prototype, 'player', {
        get() {
            return this.__player;
        },
        set(v) {
            this.__player = v;
                        // Also set window.hooked as backup
                        if (v && v.gameWorld) {
                            window.hooked = this;
                            console.log('%c[MineFun King] Player hooked via setter!', 'color: #00ff00; font-size: 14px;');
                            updateStatus('Game hooked! ✅', '#00ff00');
                        }
                    }
                });
            } catch (e) {
                console.log('%c[MineFun King] ⚠️ Object.prototype hooking blocked. Using fallback method...', 'color: #ff9900; font-size: 12px;');
            }
 
            // Aggressive scan function
            function aggressiveScan() {
                console.log('%c[MineFun King] 🔍 Starting aggressive scan...', 'color: #ffff00; font-size: 14px; font-weight: bold;');
                updateStatus('Scanning...', '#ffff00');
 
                let found = false;
                let potentialObjects = [];
 
                // Method 1: Direct window properties - look for game-specific names
                console.log('%c[MineFun King] Scanning window properties...', 'color: #00ffff;');
                for (let key in window) {
                    try {
                        if (window[key] && typeof window[key] === 'object') {
                            // Check for game object with player/gameWorld
                            if (window[key].player && window[key].gameWorld) {
                                window.hooked = window[key];
                                console.log('%c[MineFun King] ✅ Found via window.' + key, 'color: #00ff00; font-size: 14px;');
                                found = true;
                                break;
                            }
 
                            // Look for properties that suggest it's a game object
                            if (window[key].player || window[key].gameWorld || window[key].server) {
                                potentialObjects.push({key: key, obj: window[key]});
                                console.log('%c[MineFun King] 🔍 Potential object: ' + key, 'color: #ffff00;');
                            }
 
                            // Deep scan - check nested properties
                            if (!found) {
                                for (let subKey in window[key]) {
                                    try {
                                        if (window[key][subKey] && typeof window[key][subKey] === 'object') {
                                            if (window[key][subKey].player && window[key][subKey].gameWorld) {
                                                window.hooked = window[key][subKey];
                                                console.log('%c[MineFun King] ✅ Found via window.' + key + '.' + subKey, 'color: #00ff00; font-size: 14px;');
                                                found = true;
                                                break;
                                            }
                                        }
                                    } catch (e) {}
                                }
                            }
                        }
                    } catch (e) {}
                }
 
                // Method 1.5: Check potential objects for nested game data
                if (!found && potentialObjects.length > 0) {
                    console.log('%c[MineFun King] Checking ' + potentialObjects.length + ' potential objects...', 'color: #00ffff;');
                    for (let item of potentialObjects) {
                        try {
                            // Try to access nested properties
                            if (item.obj.player && item.obj.player.position) {
                                window.hooked = item.obj;
                                console.log('%c[MineFun King] ✅ Found via potential object: ' + item.key, 'color: #00ff00; font-size: 14px;');
                                found = true;
                                break;
                            }
                        } catch (e) {}
                    }
                }
 
                // Method 2: Check THREE.js objects
                if (!found && window.THREE) {
                    try {
                        console.log('%c[MineFun King] Checking THREE.js scene...', 'color: #00ffff;');
                        for (let key in window) {
                            try {
                                if (window[key] && window[key].scene && window[key].scene.children) {
                                    console.log('%c[MineFun King] Found THREE scene at: ' + key, 'color: #00ffff;');
                                }
                            } catch (e) {}
                        }
                    } catch (e) {}
                }
 
                // Method 3: Check canvas elements for attached data
                if (!found) {
                    try {
                        console.log('%c[MineFun King] Checking canvas elements...', 'color: #00ffff;');
                        const canvases = document.getElementsByTagName('canvas');
                        for (let canvas of canvases) {
                            for (let key in canvas) {
                                try {
                                    if (canvas[key] && typeof canvas[key] === 'object' && canvas[key].player) {
                                        window.hooked = canvas[key];
                                        console.log('%c[MineFun King] ✅ Found via canvas.' + key, 'color: #00ff00; font-size: 14px;');
                                        found = true;
                                        break;
                                    }
                                } catch (e) {}
                            }
                        }
                    } catch (e) {}
                }
 
                if (found) {
                    updateStatus('Game found! ✅', '#00ff00');
                    return true;
                } else {
                    updateStatus('Not found ❌', '#ff0000');
                    console.log('%c[MineFun King] ❌ Could not find game object', 'color: #ff0000; font-size: 14px;');
                    return false;
                }
            }
 
            // Force activation (even without game object)
            function forceActivate() {
                console.log('%c[MineFun King] 🔧 FORCE ACTIVATION!', 'color: #ff00ff; font-size: 16px; font-weight: bold;');
 
                // Try aggressive scan first
                if (!window.hooked) {
                    aggressiveScan();
                }
 
                if (window.hooked) {
                    cheatingIsFun();
                    keybindsLoop();
                    updateStatus('FORCED ON! 🔥', '#00ff00');
                    console.log('%c[MineFun King] ✅ Cheats FORCE ACTIVATED! Press K to see keybinds.', 'color: #00ff00; font-size: 14px; font-weight: bold;');
                } else {
                    updateStatus('Can\'t find game ❌', '#ff0000');
                    console.log('%c[MineFun King] ❌ Could not find game object! Make sure you\'re IN a server.', 'color: #ff0000; font-size: 14px;');
                }
            }
 
            // Fallback: Search for game object in window
            function findGameObject() {
                for (let key in window) {
                    try {
                        if (window[key] && typeof window[key] === 'object') {
                            if (window[key].player && window[key].gameWorld && window[key].gameWorld.server) {
                                window.hooked = window[key];
                                console.log('%c[MineFun King] Game object found via window scan!', 'color: #00ff00; font-size: 14px;');
                                updateStatus('Game found! ✅', '#00ff00');
                                return true;
                            }
                        }
                    } catch (e) {}
                }
                return false;
            }
 
            // DISABLED: RAF hook was too invasive and broke game
            // const originalRAF = window.requestAnimationFrame;
            // (hook code removed to prevent interference)
 
            // Alternative method: Hook canvas/WebGL context
            const originalGetContext = HTMLCanvasElement.prototype.getContext;
            HTMLCanvasElement.prototype.getContext = function(...args) {
                const ctx = originalGetContext.apply(this, args);
                // Silently scan for game object after canvas creation
                if (!window.hooked) {
                    setTimeout(() => findGameObject(), 2000);
                }
                return ctx;
            };
 
            // DISABLED: Array.push hook was too invasive and slowed down game
            // const originalPush = Array.prototype.push;
            // (hook code removed to prevent interference)
 
            // Try to find game object every 500ms
            let findInterval = setInterval(() => {
                if (!window.hooked && findGameObject()) {
                    clearInterval(findInterval);
                }
            }, 500);
 
            // After 10 seconds, scan more aggressively
            setTimeout(() => {
                if (!window.hooked) {
                    console.log('%c[MineFun King] Trying aggressive scan...', 'color: #ffff00; font-size: 12px;');
                    // Deep scan through window properties
                    for (let key in window) {
                        try {
                            let obj = window[key];
                            if (obj && typeof obj === 'object') {
                                // Check nested properties
                                for (let subKey in obj) {
                                    try {
                                        if (obj[subKey] && obj[subKey].player && obj[subKey].gameWorld) {
                                            window.hooked = obj[subKey];
                                            console.log('%c[MineFun King] Found via deep scan!', 'color: #00ff00; font-size: 14px;');
                                            updateStatus('Game found! ✅', '#00ff00');
                                            break;
                                        }
                                    } catch (e) {}
                                }
                            }
                        } catch (e) {}
                    }
                }
            }, 10000);
 
    let cheatInterval;
    function cheatingIsFun() {
        if (cheatInterval) {
            clearInterval(cheatInterval);
            cheatInterval = false;
                    console.log('%c[MineFun King] Cheats DISABLED', 'color: #ff0000; font-size: 14px;');
                    updateStatus('Cheats OFF', '#ff0000');
            return;
        }
 
                console.log('%c[MineFun King] 🔥 Cheats STARTING!', 'color: #00ff00; font-size: 16px; font-weight: bold;');
                updateStatus('ACTIVE! 🔥', '#00ff00');
 
        cheatInterval = setInterval(() => {
            // ESP
            try {
                window.hooked.gameWorld.server.players.forEach((plr) => {
                    plr.playerMaterial.depthTest = false;
                    if (plr.isHided) plr.model.visible = true;
                });
            } catch {}
 
            // No Fog
            try {
                if (window?.hooked?.gameWorld?.threeScene?.scene?.fog) {
                    _assign(
                        window.hooked.gameWorld.threeScene.scene.fog,
                        {
                            near: 9999,
                            far: 10000
                        }
                    );
                }
            } catch {}
 
            // Crouch Speed, anti slip (for ice)
            try {
                _assign(window.hooked.player.velocity, {
                    crouchSpeedMultiplier: 16,
                });
                _defineProperty(window.hooked.player.velocity, 'slipperiness', {
                    get() {
                        return 1;
                    },
                    set(v) {}
                });
            } catch {}
 
            try {
                const weaponMod = {
                    // OP Weapons config
                    isAuto: true,
                    firerateMs: 15,
                    lastShootFirerateMs: 15,
 
                    timeToScopeSec: 0.01,
                    reloadTimeMs: 1,
                    currAmmo: 30,
                    distance: 9999,
 
                    recoilDecayRatio: 999,
                    recoilMax: 0.000001,
                    maxCrouchSpread: 0.000001,
                    maxStandSpread: 0.000001,
 
                    maxJumpInaccuracy: 0.000001,
                    maxMoveInaccuracy: 0.000001,
 
                    knifeLongAttackDelayMs: 10,
                    knifeLongAttackFirerateMs: 15,
                    recoilAttackX: 0.0001,
                    recoilAttackY: 0.0001,
                    secondAttackDistance: 9999,
                    swapTimeMs: 1
                };
 
                window.hooked.gameWorld.systemsManager.activeSystems.forEach(
                    (system) => {
                        // Reach
                        if (system?.far) system.far = 9999;
 
                        // Weapon mods
                        if (system?.playerShooter?.currPlayerWeapon) {
                            _assign(
                                system.playerShooter.currPlayerWeapon,
                                weaponMod
                            );
                        }
                        if (system?.playerShooter?.currPlayerWeaponSpec) {
                            _assign(
                                system.playerShooter.currPlayerWeaponSpec,
                                weaponMod
                            );
                        }
                        if (
                            system?.playerShooter?.currPlayerWeaponSpec
                            ?.bulletsQueue
                        ) {
                            _assign(
                                system.playerShooter.currPlayerWeaponSpec
                                .bulletsQueue,
                                {
                                    queueStepMs: 10
                                }
                            );
                        }
                        if (system?.playerShooter) {
                            _defineProperty(system, 'cooldownRemainderMs', {
                                get() {
                                    return 10;
                                },
                                set(v) {}
                            });
                            _defineProperty(system, 'shootPressedDelayer', {
                                get() {
                                    return 1;
                                },
                                set(v) {}
                            });
                        }
                    }
                );
            } catch {}
 
            try {
                if (typeof window.hooked.gameWorld.server.msgsToSend?._push !== 'function') {
                    window.hooked.gameWorld.server.msgsToSend._push = window.hooked.gameWorld.server.msgsToSend.push;
                    window.hooked.gameWorld.server.msgsToSend.push = function () {
                        if (arguments[0] === packetsOut.HIT && Array.isArray(arguments[1])) {
                            for (let i = 0; i < 15; i++) this._push.apply(this, arguments);
                        }
                        if (arguments[0] === packetsOut.HNS_ATTACK_BLOCK && Array.isArray(arguments[1])) {
                            for (let i = 0; i < 5; i++) this._push.apply(this, arguments);
                        }
 
 
                        return this._push.apply(this, arguments);
                    }
                }
            } catch {}
 
 
            try {
                let system = window.hooked.gameWorld.systemsManager.activeSystems.find(x => x?.infinityBlocks !== undefined);
                if (system) _defineProperty(system, 'instantBlockBreaking', {
                    get() { return true },
                    set(v) {}
                });
            } catch {}
 
            try {
                // Adel you're going to have to try a LOT harder than this if you want to stop me LOL
                let posCorrection = Object.entries(window.hooked.gameWorld.server.msgsListeners).find(([k,v]) => v.toString().includes('=this.player.physicsPosComp'));
                if (posCorrection) delete window.hooked.gameWorld.server.msgsListeners[posCorrection[0]];
            } catch {}
        }, 100);
    }
 
            // Debug function to check game status
            window.checkMineFunStatus = function() {
                console.log('%c=== MineFun King Debug Info ===', 'color: #ffff00; font-size: 16px; font-weight: bold;');
                console.log('window.hooked exists:', !!window.hooked);
                console.log('window.hooked value:', window.hooked);
                if (window.hooked) {
                    console.log('gameWorld exists:', !!window.hooked.gameWorld);
                    console.log('player exists:', !!window.hooked.player);
                    if (window.hooked.gameWorld) {
                        console.log('server exists:', !!window.hooked.gameWorld.server);
                        console.log('players count:', window.hooked.gameWorld.server?.players?.length);
                    }
                }
                console.log('cheatInterval active:', !!cheatInterval);
                console.log('%c=== End Debug ===', 'color: #ffff00; font-size: 16px; font-weight: bold;');
 
                if (!window.hooked) {
                    console.log('%c[MineFun King] ⚠️ Game object not found! Join a server first.', 'color: #ffff00; font-size: 14px;');
                } else {
                    console.log('%c[MineFun King] ✅ Game hooked successfully! Press K for keybinds.', 'color: #00ff00; font-size: 14px;');
                }
            };
 
            // TECHNIQUE 2: Deep game scan with multiple methods
            window.deepGameScan = function() {
                console.log('%c╔═══════════════════════════════════════╗', 'color: #ff00ff; font-weight: bold;');
                console.log('%c║   DEEP GAME SCAN - ALL TECHNIQUES    ║', 'color: #ff00ff; font-weight: bold;');
                console.log('%c╚═══════════════════════════════════════╝', 'color: #ff00ff; font-weight: bold;');
 
                let found = false;
 
                // Method 1: Canvas element inspection
                console.log('%c[1/6] 🎨 Inspecting Canvas elements...', 'color: #00ffff;');
                const canvases = document.querySelectorAll('canvas');
                canvases.forEach((canvas, idx) => {
                    console.log(`  Canvas ${idx}:`, canvas);
 
                    // Check all properties of canvas (including non-enumerable)
                    const allProps = Object.getOwnPropertyNames(canvas);
                    for (let prop of allProps) {
                        try {
                            const val = canvas[prop];
                            if (val && typeof val === 'object' && val.player && val.gameWorld) {
                                console.log('%c  🎯 FOUND via canvas.' + prop + '!', 'color: #00ff00; font-weight: bold;');
                                window.hooked = val;
                                found = true;
                                break;
                            }
                        } catch (e) {}
                    }
 
                    // Check Symbol properties
                    const symbols = Object.getOwnPropertySymbols(canvas);
                    if (symbols.length > 0) {
                        console.log('  Found ' + symbols.length + ' Symbol properties on canvas');
                        for (let sym of symbols) {
                            try {
                                const val = canvas[sym];
                                if (val && typeof val === 'object' && val.player) {
                                    console.log('%c  🎯 FOUND via Symbol!', 'color: #00ff00; font-weight: bold;');
                                    window.hooked = val;
                                    found = true;
                                    break;
                                }
                            } catch (e) {}
                        }
                    }
                });
 
                if (found) {
                    updateStatus('Found via canvas!', '#00ff00');
                    activateMineFunCheats();
                    return;
                }
 
                // Method 2: Event listener inspection (Chrome only)
                console.log('%c[2/6] 📡 Checking for event listeners...', 'color: #00ffff;');
                try {
                    if (typeof getEventListeners !== 'undefined') {
                        const listeners = getEventListeners(document);
                        if (listeners) {
                            Object.keys(listeners).forEach(eventType => {
                                console.log(`  Found ${listeners[eventType].length} ${eventType} listeners`);
                            });
                        }
                    } else {
                        console.log('  getEventListeners not available (use Chrome DevTools)');
                    }
                } catch (e) {
                    console.log('  Event listener inspection not available');
                }
 
                // Method 3: Stack trace analysis
                console.log('%c[3/6] 📚 Creating stack trace...', 'color: #00ffff;');
                try {
                    throw new Error('Trace');
                } catch (e) {
                    console.log('  Stack:', e.stack);
                }
 
                // Method 4: THREE.js scene inspection (if exists)
                console.log('%c[4/6] 🎭 Checking THREE.js...', 'color: #00ffff;');
                if (window.THREE) {
                    console.log('  THREE.js version:', window.THREE.REVISION);
 
                    // Look for scenes in window
                    for (let key in window) {
                        try {
                            if (window[key] && window[key].type === 'Scene') {
                                console.log('  Found THREE.Scene at window.' + key);
                                // Walk the scene tree
                                window[key].traverse((obj) => {
                                    if (obj.userData && obj.userData.gameObject) {
                                        console.log('%c  🎯 FOUND gameObject in THREE scene!', 'color: #00ff00; font-weight: bold;');
                                        window.hooked = obj.userData.gameObject;
                                        found = true;
                                    }
                                });
                            }
                        } catch (e) {}
                    }
                } else {
                    console.log('  THREE.js not found');
                }
 
                // Method 5: Prototype chain walking
                console.log('%c[5/6] 🔗 Walking prototype chains...', 'color: #00ffff;');
                const checkPrototype = (obj, depth = 0) => {
                    if (depth > 10 || !obj) return;
                    try {
                        const proto = Object.getPrototypeOf(obj);
                        if (proto && proto.constructor && proto.constructor.name) {
                            const name = proto.constructor.name;
                            if (name.includes('Game') || name.includes('Player') || name.includes('World')) {
                                console.log('  Found interesting constructor: ' + name);
                            }
                        }
                        checkPrototype(proto, depth + 1);
                    } catch (e) {}
                };
 
                for (let key in window) {
                    try {
                        if (window[key] && typeof window[key] === 'object') {
                            checkPrototype(window[key]);
                        }
                    } catch (e) {}
                }
 
                // Method 6: Memory leak technique - create an error and inspect its context
                console.log('%c[6/6] 🧠 Memory inspection technique...', 'color: #00ffff;');
                const originalError = Error.prepareStackTrace;
                Error.prepareStackTrace = (error, structuredStackTrace) => {
                    console.log('  Stack frames:', structuredStackTrace.length);
                    structuredStackTrace.forEach((frame, idx) => {
                        try {
                            const thisVal = frame.getThis();
                            if (thisVal && typeof thisVal === 'object' && thisVal.player && thisVal.gameWorld) {
                                console.log('%c  🎯 FOUND via stack frame ' + idx + '!', 'color: #00ff00; font-weight: bold;');
                                window.hooked = thisVal;
                                found = true;
                            }
                        } catch (e) {}
                    });
                    return originalError ? originalError(error, structuredStackTrace) : error.stack;
                };
 
                try {
                    throw new Error();
                } catch (e) {
                    e.stack; // Trigger prepareStackTrace
                }
 
                Error.prepareStackTrace = originalError;
 
                console.log('%c════════════════════════════════════════', 'color: #ff00ff; font-weight: bold;');
                if (found) {
                    console.log('%c✅ GAME OBJECT FOUND!', 'color: #00ff00; font-size: 16px; font-weight: bold;');
                    updateStatus('Found! ✅', '#00ff00');
                    activateMineFunCheats();
                } else {
                    console.log('%c❌ Game object not found with any technique', 'color: #ff0000; font-size: 14px;');
                    console.log('%cThe game might be using advanced closure protection.', 'color: #ff9900;');
                    console.log('%cTry: enableDebugMode() for the nuclear option', 'color: #ffff00;');
                    updateStatus('Not found ❌', '#ff0000');
                }
            };
 
            // Legacy function (now calls deepGameScan)
            window.findAllGameObjects = function() {
                console.log('%c[MineFun King] Calling deepGameScan()...', 'color: #00ffff;');
                deepGameScan();
            };
 
            // Expose functions for debugging
            window.cheatingIsFun = cheatingIsFun;
            window.keybindsLoop = keybindsLoop;
 
            // Manual activation function
            window.activateMineFunCheats = function() {
                console.log('%c[MineFun King] Manual activation triggered!', 'color: #ff00ff; font-size: 14px;');
                if (!window.hooked) {
                    console.log('%c[MineFun King] ❌ Game not ready yet! Wait for game to load.', 'color: #ff0000; font-size: 14px;');
                    return;
                }
                console.log('%c[MineFun King] Starting cheat interval...', 'color: #ffff00;');
                cheatingIsFun();
                console.log('%c[MineFun King] Starting keybinds loop...', 'color: #ffff00;');
                keybindsLoop();
                console.log('%c[MineFun King] ✅ Cheats activated! Press K to see keybinds menu!', 'color: #00ff00; font-size: 16px; font-weight: bold;');
            };
 
            // Helper: Manually set game object
            window.setGameObject = function(objectName) {
                if (window[objectName]) {
                    window.hooked = window[objectName];
                    console.log('%c[MineFun King] ✅ Game object set to: ' + objectName, 'color: #00ff00; font-size: 14px;');
                    updateStatus('Hooked manually!', '#00ff00');
                    console.log('%c[MineFun King] Now type: activateMineFunCheats()', 'color: #00ffff; font-size: 14px;');
                    return true;
                } else {
                    console.log('%c[MineFun King] ❌ Object "' + objectName + '" not found! Use findAllGameObjects() to see available objects.', 'color: #ff0000; font-size: 14px;');
                    return false;
                }
            };
 
        // Debug mode is now AUTO-ENABLED! This function just confirms it's on
        window.enableDebugMode = function() {
            console.log('%c[MineFun King] ✅ DEBUG MODE IS ALREADY AUTO-ENABLED!', 'color: #00ff00; font-size: 16px; font-weight: bold;');
            console.log('%cDebug mode runs automatically to detect the game object.', 'color: #00ffff;');
            console.log('%cCheats will auto-activate when you join a server!', 'color: #00ffff;');
            return true;
        };
 
    setTimeout(() => {
                console.log('%c[MineFun King] Starting keybinds listener...', 'color: #ffff00; font-size: 14px;');
 
                // START keybindsLoop immediately so it can detect the = key press
                keybindsLoop();
 
                if (window.hooked) {
                    console.log('%c[MineFun King] Game ready! Press = or + to activate cheats!', 'color: #00ff00; font-size: 16px; font-weight: bold;');
                    updateStatus('Press = or + to start', '#ffff00');
                } else {
                    console.log('%c[MineFun King] ⚠️ Game not detected yet. Join a server!', 'color: #ff9900; font-size: 14px;');
                    console.log('%c[MineFun King] Once in game, press = or + to activate', 'color: #00ffff; font-size: 12px;');
                    updateStatus('Join a server!', '#ffff00');
                }
    }, 8000);
 
    /* Teleportation Stuff */
    function tp(x = 0, y = 0, z = 0, relative = true, sendToServer = true) {
        try {
                // FIXED: Use window.hooked.player (not gameWorld.player!)
                let position = window.hooked.player.position;
                let velocity = window.hooked.player.velocity.velVec3;
 
            if (relative) {
                position.x += x;
                position.y += y;
                position.z += z;
            } else {
                _assign(position, { x, y, z });
            }
                window.hooked.player.physicsPosComp.copyPos(position);
 
                // SEND POSITION TO SERVER so others can see you!
                if (sendToServer && window.hooked.gameWorld.server) {
                    try {
                        // Send TIME_STEP packet with new position
                        window.hooked.gameWorld.server.sendData(packetsOut.TIME_STEP, [
                            position.x,
                            position.y,
                            position.z,
                            velocity.x || 0,
                            velocity.y || 0,
                            velocity.z || 0,
                            window.hooked.gameWorld.time.localServerTimeMs
                        ]);
                    } catch (e) {
                        console.log('%c[MineFun King] Failed to send position to server:', 'color: #ff9900;', e);
                    }
                }
        } catch {}
    }
 
    function tpToSelectedBlock() {
        try {
            let outlineSystem = window.hooked.gameWorld.systemsManager.activeSystems.find(x => x.currBlockPos);
            if (!outlineSystem) return;
            outlineSystem.intersectAndShow(true, 500);
            if (!outlineSystem.currBlockPos) return;
            let { x, y, z } = outlineSystem.currBlockPos;
            tp(x, y + 1, z, false);
                    console.log(`%c[MineFun King] Teleported to ${x}, ${y+1}, ${z}`, 'color: #00ffff;');
        } catch {}
    }
 
    /* LOL */
    function hitAll() {
        try {
            let hitCount = 0;
            let skippedCount = 0;
            const mySessionId = window.hooked?.player?.sessionId;
            const totalPlayers = window.hooked.gameWorld.server.players.length;
 
            window.hooked.gameWorld.server.players.forEach(plr => {
                try {
                    // Don't hit yourself
                    if (plr.sessionId === mySessionId) {
                        skippedCount++;
                        return;
                    }
 
                    // Skip if no valid position
                    if (!plr.model || !plr.model.position) {
                        skippedCount++;
                        return;
                    }
 
                const { x, y, z } = plr.model.position;
 
                    // Get velocity if available (for moving players)
                    let vx = 0, vy = 0, vz = 0;
                    if (plr.velocity && plr.velocity.velVec3) {
                        vx = plr.velocity.velVec3.x || 0;
                        vy = plr.velocity.velVec3.y || 0;
                        vz = plr.velocity.velVec3.z || 0;
                    }
 
                    // SIMPLIFIED: Just hit their current position - no prediction to avoid kicks!
                    let hitSent = false;
 
                    // Hide and Seek mode - a****k blocks
                    if (plr.hasOwnProperty('isBlock') && !plr.isHunter) {
                    window.hooked.gameWorld.server.sendData(packetsOut.HNS_ATTACK_BLOCK, [x, y + 0.1, z, 0.00000001, -0.9999999, 0.00000001, window.hooked.gameWorld.time.localServerTimeMs, plr.sessionId]);
                        hitSent = true;
                    }
                    // Infection mode - hit humans only
                    else if (plr.hasOwnProperty('isZombie') && !plr.isZombie) {
                    window.hooked.gameWorld.server.sendData(packetsOut.HIT, [window.hooked.gameWorld.time.localServerTimeMs, x, y + 0.1, z, 0.00000001, -0.9999999, 0.00000001, 2, plr.sessionId]);
                        hitSent = true;
                    }
                    // All other modes
                    else if (!hitSent) {
                    window.hooked.gameWorld.server.sendData(packetsOut.HIT, [window.hooked.gameWorld.time.localServerTimeMs, x, y + 0.1, z, 0.00000001, -0.9999999, 0.00000001, 2, plr.sessionId]);
                    }
 
                    hitCount++;
 
                } catch (e) {
                    skippedCount++;
                    console.log('%c[MineFun King] Failed to hit player:', 'color: #ff9900;', e);
                }
            });
 
            console.log(`%c[MineFun King] ⚔️ Hit ${hitCount}/${totalPlayers} players! (Skipped: ${skippedCount})`, 'color: #ff00ff; font-weight: bold;');
        } catch (e) {
            console.log('%c[MineFun King] ❌ Hit All failed:', 'color: #ff0000;', e);
        }
    }
 
    function removeFloor() {
        try {
                    let floorCount = 0;
            window.hooked.gameWorld.server.players.forEach(plr => {
                if (!plr.isAlive) return;
 
                let { x, y, z } = plr.model.position;
                x = Math.round(x);
                y = Math.round(y - 1);
                z = Math.round(z);
 
                window.hooked.gameWorld.server.sendData(packetsOut.PLACE_BLOCKS, [+x.toFixed(3), +y.toFixed(3), +z.toFixed(3), 1, `${x-1},${y},${z-1}`, 0]);
                window.hooked.gameWorld.server.sendData(packetsOut.PLACE_BLOCKS, [+x.toFixed(3), +y.toFixed(3), +z.toFixed(3), 1, `${x},${y},${z-1}`, 0]);
                window.hooked.gameWorld.server.sendData(packetsOut.PLACE_BLOCKS, [+x.toFixed(3), +y.toFixed(3), +z.toFixed(3), 1, `${x+1},${y},${z-1}`, 0]);
                window.hooked.gameWorld.server.sendData(packetsOut.PLACE_BLOCKS, [+x.toFixed(3), +y.toFixed(3), +z.toFixed(3), 1, `${x-1},${y},${z}`, 0]);
                window.hooked.gameWorld.server.sendData(packetsOut.PLACE_BLOCKS, [+x.toFixed(3), +y.toFixed(3), +z.toFixed(3), 1, `${x},${y},${z}`, 0]);
                window.hooked.gameWorld.server.sendData(packetsOut.PLACE_BLOCKS, [+x.toFixed(3), +y.toFixed(3), +z.toFixed(3), 1, `${x+1},${y},${z}`, 0]);
                window.hooked.gameWorld.server.sendData(packetsOut.PLACE_BLOCKS, [+x.toFixed(3), +y.toFixed(3), +z.toFixed(3), 1, `${x-1},${y},${z+1}`, 0]);
                window.hooked.gameWorld.server.sendData(packetsOut.PLACE_BLOCKS, [+x.toFixed(3), +y.toFixed(3), +z.toFixed(3), 1, `${x},${y},${z+1}`, 0]);
                window.hooked.gameWorld.server.sendData(packetsOut.PLACE_BLOCKS, [+x.toFixed(3), +y.toFixed(3), +z.toFixed(3), 1, `${x+1},${y},${z+1}`, 0]);
                        floorCount++;
            });
                    console.log(`%c[MineFun King] Removed floor under ${floorCount} players! 🕳️`, 'color: #ff6600;');
        } catch {}
    }
 
    // WIN CONDITION: K**l all humans in Infection mode (SAFE VERSION WITH DEBUG)
    function infectionWin() {
        try {
            clearInfectionDebug();
            showInfectionDebug('🔍 H key pressed! Starting checks...');
 
            // Check if game is loaded
            showInfectionDebug('📊 Checking if game is loaded...');
            if (!window.hooked) {
                showInfectionDebug('❌ window.hooked is undefined!', true);
                showInfectionDebug('⚠️ Game object not detected. Make sure you\'re in a game!', true);
                return;
            }
            showInfectionDebug('✅ window.hooked exists');
 
            if (!window.hooked.gameWorld) {
                showInfectionDebug('❌ gameWorld not found!', true);
                return;
            }
            showInfectionDebug('✅ gameWorld exists');
 
            if (!window.hooked.gameWorld.server) {
                showInfectionDebug('❌ server not found!', true);
                return;
            }
            showInfectionDebug('✅ server exists');
 
            if (!window.hooked.gameWorld.server.players) {
                showInfectionDebug('❌ players not found!', true);
                return;
            }
            showInfectionDebug('✅ players object exists');
 
            // Get players (it's already an array, we can forEach it)
            const playersData = window.hooked.gameWorld.server.players;
            const mySessionId = window.hooked?.player?.sessionId;
 
            // Count players and collect humans
            let totalCount = 0;
            let isInfectionMode = false;
            const humans = [];
 
            showInfectionDebug('🔍 Iterating through players...');
 
            playersData.forEach(plr => {
                if (plr) {
                    totalCount++;
 
                    // Check if Infection mode
                    if (plr.hasOwnProperty('isZombie')) {
                        isInfectionMode = true;
 
                        // If this is a human (not zombie, not yourself)
                        if (!plr.isZombie && plr.sessionId !== mySessionId) {
                            humans.push(plr);
                        }
                    }
                }
            });
 
            showInfectionDebug(`📊 Found ${totalCount} total players`);
            showInfectionDebug(`🎮 Your session ID: ${mySessionId || 'unknown'}`);
 
            if (totalCount === 0) {
                showInfectionDebug('❌ No players detected in forEach loop!', true);
                return;
            }
 
            // Check if we're in Infection mode
            showInfectionDebug('🔍 Checking if this is Infection mode...');
            if (!isInfectionMode) {
                showInfectionDebug('❌ NOT in Infection mode!', true);
                showInfectionDebug('⚠️ This feature only works in Infection mode', true);
                return;
            }
            showInfectionDebug('✅ Confirmed: Infection mode detected!');
 
            // Find all humans (not zombies, not yourself)
            showInfectionDebug('🔍 Searching for human players...');
 
            showInfectionDebug(`👥 Found ${humans.length} humans to eliminate`);
 
            if (humans.length === 0) {
                showInfectionDebug('✅ No humans left! You already won!');
                return;
            }
 
            showInfectionDebug(`🧟 Starting REINFORCED TELEPORT for ${humans.length} humans...`);
            showInfectionDebug('🔄 Strategy: 3× TP packets → Lock position → A****k!');
            showInfectionDebug('⚡ Position sent 3 times + during a****k to FORCE sync!');
 
            // Turn indicator GREEN (killing in progress)
            updateInfectionWinIndicator(true);
 
            // Save YOUR original position to return to
            const originalPos = {
                x: window.hooked.player.position.x,
                y: window.hooked.player.position.y,
                z: window.hooked.player.position.z
            };
            showInfectionDebug(`📍 Your original position: (${originalPos.x.toFixed(1)}, ${originalPos.y.toFixed(1)}, ${originalPos.z.toFixed(1)})`);
 
            // Show human positions and distances
            humans.forEach((human, idx) => {
                const dist = Math.sqrt(
                    Math.pow(human.model.position.x - originalPos.x, 2) +
                    Math.pow(human.model.position.y - originalPos.y, 2) +
                    Math.pow(human.model.position.z - originalPos.z, 2)
                );
                const pos = human.model.position;
                showInfectionDebug(`🎯 Human ${idx+1}: ${dist.toFixed(1)} blocks away at (${pos.x.toFixed(1)}, ${pos.y.toFixed(1)}, ${pos.z.toFixed(1)})`);
            });
 
            showInfectionDebug('🔥 STARTING STEALTH K**L SEQUENCE!');
 
            let currentIndex = 0;
 
            const killNextHuman = () => {
                if (currentIndex >= humans.length) {
                    showInfectionDebug('🏆 SEQUENCE COMPLETE!');
                    showInfectionDebug(`📊 Attacked ${currentIndex} humans`);
                    showInfectionDebug('🔙 Returning to original position...');
 
                    // Return to original position
                    tp(originalPos.x, originalPos.y, originalPos.z, false);
 
                    updateInfectionWinIndicator(false);
                    return;
                }
 
                const human = humans[currentIndex];
 
                try {
                    if (!human || !human.model || !human.model.position) {
                        showInfectionDebug(`⚠️ Human ${currentIndex+1} invalid, skipping...`, true);
                        currentIndex++;
                        setTimeout(killNextHuman, 200);
                        return;
                    }
 
                    const { x, y, z } = human.model.position;
 
                    showInfectionDebug(`\n🚀 [${currentIndex+1}/${humans.length}] Multi-step TP...`);
                    showInfectionDebug(`📍 Target: (${x.toFixed(1)}, ${y.toFixed(1)}, ${z.toFixed(1)})`);
 
                    // Step 1: First position update
                    tp(x, y + 1, z, false, true);
                    showInfectionDebug(`✅ TP #1 sent! Waiting 200ms...`);
 
                    setTimeout(() => {
                        // Step 2: Second position update (reinforce)
                        tp(x, y + 1, z, false, true);
                        showInfectionDebug(`✅ TP #2 sent! Waiting 200ms...`);
 
                        setTimeout(() => {
                            // Step 3: Third position update (make it stick!)
                            tp(x, y + 1, z, false, true);
                            showInfectionDebug(`✅ TP #3 sent! Position should be locked!`);
                            showInfectionDebug(`⏱️ Waiting 300ms then attacking...`);
 
                            setTimeout(() => {
                                showInfectionDebug(`💥 A****K: Sending 8 hits over 320ms...`);
 
                                // Send 8 hits (40ms apart = 320ms total)
                                let hitCount = 0;
                                const rapidHitInterval = setInterval(() => {
                                    if (hitCount >= 8) {
                                        clearInterval(rapidHitInterval);
                                        showInfectionDebug(`💀 Human ${currentIndex+1} attacked (8 hits)!`);
 
                                        // Check if we should continue
                                        showInfectionDebug(`⏱️ Waiting 800ms before next target...`);
                                        currentIndex++;
                                        setTimeout(killNextHuman, 800);
                                        return;
                                    }
 
                                    try {
                                        // Send hit packet + resend position to keep it locked
                                        if (hitCount % 3 === 0) {
                                            tp(x, y + 1, z, false, true); // Resend position every 3rd hit
                                        }
 
                                        window.hooked.gameWorld.server.sendData(
                                            packetsOut.HIT,
                                            [window.hooked.gameWorld.time.localServerTimeMs, x, y + 0.1, z, 0.00000001, -0.9999999, 0.00000001, 2, human.sessionId]
                                        );
                                        hitCount++;
                                    } catch (e) {
                                        showInfectionDebug(`  ❌ Hit ${hitCount + 1} failed`, true);
                                    }
                                }, 40); // 40ms between hits (slower, safer)
 
                            }, 300); // Wait 300ms after last TP
 
                        }, 200); // Wait 200ms for TP #2
 
                    }, 200); // Wait 200ms for TP #1
 
                } catch (e) {
                    showInfectionDebug(`❌ Error on Human ${currentIndex+1}: ${e.message}`, true);
                    currentIndex++;
                    setTimeout(killNextHuman, 600);
                }
            };
 
            // Start the sequence
            killNextHuman();
 
        } catch (e) {
            showInfectionDebug(`❌ ERROR: ${e.message}`, true);
            showInfectionDebug(`📍 Error details: ${e.stack}`, true);
            console.log('%c[MineFun King] ❌ Infection Win failed:', 'color: #ff0000;', e);
        }
    }
 
    /* Keystokes Stuff */
    function allowBinds() {
        if (!document) return false;
        return (
            document?.pointerLockElement &&
            document?.activeElement?.tagName !== 'INPUT'
        );
    }
 
    // Hit All toggle system
    let hitAllActive = false;
    let hitAllInterval = null;
 
    function toggleHitAll() {
        hitAllActive = !hitAllActive;
        updateHitAllIndicator(hitAllActive);
 
        if (hitAllActive) {
            console.log('%c[MineFun King] 🔥 HIT ALL ENABLED! (450ms - ULTRA SAFE!)', 'color: #00ff00; font-size: 16px; font-weight: bold;');
            // Run immediately
            hitAll();
            // Then run every 450ms (ULTRA SAFE - 1 hit per player only!)
            hitAllInterval = setInterval(() => {
                hitAll();
            }, 450);
        } else {
            console.log('%c[MineFun King] ⏹️ HIT ALL DISABLED', 'color: #ff9900; font-size: 16px; font-weight: bold;');
            if (hitAllInterval) {
                clearInterval(hitAllInterval);
                hitAllInterval = null;
            }
        }
    }
 
    const pressedKeys = {
        allowBackquote: true,
        allowPeriod: true,
        allowComma: true,
        allowKeyH: true,
        allowEqual: true
    };
 
    function unlockKey(code) {
        pressedKeys[`allow${code}`] = true;
    }
 
    window.addEventListener('keydown', (event) => {
        pressedKeys[event.code] = true;
    });
 
    // Event listener for when a key is released
    window.addEventListener('keyup', (event) => {
        pressedKeys[event.code] = false;
    });
 
    function keybindsLoop() {
        if (allowBinds()) {
            if (pressedKeys['Space']) {
                    // FIXED: Use window.hooked.player (not gameWorld.player!)
                    if (window?.hooked?.player?.velocity?.velVec3) {
                        try {
                            let { x, y, z } = window.hooked.player.velocity.velVec3;
                            window.hooked.player.velocity.velVec3.set(x, 8, z);
                            console.log('%c[MineFun King] 🚀 SUPER JUMP!', 'color: #00ff00; font-weight: bold;');
                        } catch (e) {
                            console.error('[MineFun King] Jump error:', e);
                        }
                    } else {
                        console.warn('[MineFun King] ⚠️ Player velocity not accessible!');
                }
            }
            if (pressedKeys['Backquote'] && pressedKeys.allowBackquote) {
                    // FIXED: Use window.hooked.player (not gameWorld.player!)
                    if (window?.hooked?.player?.velocity?.velVec3) {
                    pressedKeys.allowBackquote = false;
                    setTimeout(unlockKey.bind(this, ['Backquote']), 400);
                    tpToSelectedBlock();
                }
            }
            if (pressedKeys['Period'] && pressedKeys.allowPeriod) {
                if (window?.hooked?.gameWorld) {
                    pressedKeys.allowPeriod = false;
                    setTimeout(unlockKey.bind(this, ['Period']), 500); // Prevent double-toggle
                    toggleHitAll(); // Toggle on/off instead of single hit
                }
            }
            if (pressedKeys['Comma'] && pressedKeys.allowComma) {
                if (window?.hooked?.gameWorld?.server?.sendData) {
                    pressedKeys.allowComma = false;
                    setTimeout(unlockKey.bind(this, ['Comma']), 200);
                    removeFloor();
                }
            }
            if (pressedKeys['KeyH'] && pressedKeys.allowKeyH) {
                if (allowBinds()) {
                    pressedKeys.allowKeyH = false;
                    setTimeout(unlockKey.bind(this, ['KeyH']), 1000); // 1 second cooldown
 
                    // Toggle debug panel if it's already open
                    const debugPanel = document.getElementById('mfk-infection-debug');
                    if (debugPanel && debugPanel.style.display === 'block') {
                        hideInfectionDebug();
                    } else {
                        infectionWin();
                    }
                }
            }
            // = or + key to toggle all hacks ON/OFF
            if ((pressedKeys['Equal'] || pressedKeys['NumpadAdd']) && pressedKeys.allowEqual) {
                pressedKeys.allowEqual = false;
                setTimeout(unlockKey.bind(this, ['Equal']), 1000);
 
                if (!cheatInterval) {
                    // ACTIVATE hacks
                    console.log('%c[MineFun King] 🔥 ACTIVATING ALL HACKS!', 'color: #ff00ff; font-size: 16px; font-weight: bold;');
                    cheatingIsFun();
                    updateStatus('ACTIVE! 🔥', '#00ff00');
                    console.log('%c[MineFun King] ✅ All hacks ON! Fly, ESP, No Fog, etc. Press = again to turn OFF.', 'color: #00ff00; font-size: 16px; font-weight: bold;');
                } else {
                    // DEACTIVATE hacks
                    console.log('%c[MineFun King] ⏹️ DEACTIVATING ALL HACKS!', 'color: #ff9900; font-size: 16px; font-weight: bold;');
                    cheatingIsFun(); // This will turn off the interval (toggle)
                    updateStatus('Press = to start', '#ffff00');
                    console.log('%c[MineFun King] ❌ All hacks OFF! Press = to turn back ON.', 'color: #ff0000; font-size: 16px; font-weight: bold;');
                }
            }
        }
        requestAnimationFrame(keybindsLoop);
    }
 
    /* POKI SDK Stuff */
    function skipRewardedBreak() {
        return new Promise((resolve) => {
            resolve(true);
        });
    }
 
            // Wrap in try-catch to handle frozen objects
            try {
    Object.defineProperties(Object.prototype, {
        rewardedBreak: {
            get() {
                return skipRewardedBreak.bind(this);
            },
            set() {},
            enumerable: false
        },
        gameanalytics: {
            get() {
                return {
                    GameAnalytics: {
                        addAdEvent: () => {}
                    },
                    EGAErrorSeverity: {
                        0: 'Undefined',
                        1: 'Debug',
                        2: 'Info',
                        3: 'Warning',
                        4: 'Error',
                        5: 'Critical',
                        Undefined: 0,
                        Debug: 1,
                        Info: 2,
                        Warning: 3,
                        Error: 4,
                        Critical: 5
                    },
                    EGAProgressionStatus: {
                        0: 'Undefined',
                        1: 'Start',
                        2: 'Complete',
                        3: 'Fail',
                        Undefined: 0,
                        Start: 1,
                        Complete: 2,
                        Fail: 3
                    },
                    EGAResourceFlowType: {
                        0: 'Undefined',
                        1: 'Source',
                        2: 'Sink',
                        Undefined: 0,
                        Source: 1,
                        Sink: 2
                    },
                    EGAAdAction: {
                        0: 'Undefined',
                        1: 'Clicked',
                        2: 'Show',
                        3: 'FailedShow',
                        4: 'RewardReceived',
                        Undefined: 0,
                        Clicked: 1,
                        Show: 2,
                        FailedShow: 3,
                        RewardReceived: 4
                    },
                    EGAAdError: {
                        0: 'Undefined',
                        1: 'Unknown',
                        2: 'Offline',
                        3: 'NoFill',
                        4: 'InternalError',
                        5: 'InvalidRequest',
                        6: 'UnableToPrecache',
                        Undefined: 0,
                        Unknown: 1,
                        Offline: 2,
                        NoFill: 3,
                        InternalError: 4,
                        InvalidRequest: 5,
                        UnableToPrecache: 6
                    },
                    EGAAdType: {
                        0: 'Undefined',
                        1: 'Video',
                        2: 'RewardedVideo',
                        3: 'Playable',
                        4: 'Interstitial',
                        5: 'OfferWall',
                        6: 'Banner',
                        Undefined: 0,
                        Video: 1,
                        RewardedVideo: 2,
                        Playable: 3,
                        Interstitial: 4,
                        OfferWall: 5,
                        Banner: 6
                    },
                    http: {
                        EGAHTTPApiResponse: {
                            0: 'NoResponse',
                            1: 'BadResponse',
                            2: 'RequestTimeout',
                            3: 'JsonEncodeFailed',
                            4: 'JsonDecodeFailed',
                            5: 'InternalServerError',
                            6: 'BadRequest',
                            7: 'Unauthorized',
                            8: 'UnknownResponseCode',
                            9: 'Ok',
                            10: 'Created',
                            NoResponse: 0,
                            BadResponse: 1,
                            RequestTimeout: 2,
                            JsonEncodeFailed: 3,
                            JsonDecodeFailed: 4,
                            InternalServerError: 5,
                            BadRequest: 6,
                            Unauthorized: 7,
                            UnknownResponseCode: 8,
                            Ok: 9,
                            Created: 10
                        }
                    },
                    events: {
                        EGASdkErrorCategory: {
                            0: 'Undefined',
                            1: 'EventValidation',
                            2: 'Database',
                            3: 'Init',
                            4: 'Http',
                            5: 'Json',
                            Undefined: 0,
                            EventValidation: 1,
                            Database: 2,
                            Init: 3,
                            Http: 4,
                            Json: 5
                        },
                        EGASdkErrorArea: {
                            0: 'Undefined',
                            1: 'BusinessEvent',
                            2: 'ResourceEvent',
                            3: 'ProgressionEvent',
                            4: 'DesignEvent',
                            5: 'ErrorEvent',
                            9: 'InitHttp',
                            10: 'EventsHttp',
                            11: 'ProcessEvents',
                            12: 'AddEventsToStore',
                            20: 'AdEvent',
                            Undefined: 0,
                            BusinessEvent: 1,
                            ResourceEvent: 2,
                            ProgressionEvent: 3,
                            DesignEvent: 4,
                            ErrorEvent: 5,
                            InitHttp: 9,
                            EventsHttp: 10,
                            ProcessEvents: 11,
                            AddEventsToStore: 12,
                            AdEvent: 20
                        },
                        EGASdkErrorAction: {
                            0: 'Undefined',
                            1: 'InvalidCurrency',
                            2: 'InvalidShortString',
                            3: 'InvalidEventPartLength',
                            4: 'InvalidEventPartCharacters',
                            5: 'InvalidStore',
                            6: 'InvalidFlowType',
                            7: 'StringEmptyOrNull',
                            8: 'NotFoundInAvailableCurrencies',
                            9: 'InvalidAmount',
                            10: 'NotFoundInAvailableItemTypes',
                            11: 'WrongProgressionOrder',
                            12: 'InvalidEventIdLength',
                            13: 'InvalidEventIdCharacters',
                            15: 'InvalidProgressionStatus',
                            16: 'InvalidSeverity',
                            17: 'InvalidLongString',
                            18: 'DatabaseTooLarge',
                            19: 'DatabaseOpenOrCreate',
                            25: 'JsonError',
                            29: 'FailHttpJsonDecode',
                            30: 'FailHttpJsonEncode',
                            31: 'InvalidAdAction',
                            32: 'InvalidAdType',
                            33: 'InvalidString',
                            Undefined: 0,
                            InvalidCurrency: 1,
                            InvalidShortString: 2,
                            InvalidEventPartLength: 3,
                            InvalidEventPartCharacters: 4,
                            InvalidStore: 5,
                            InvalidFlowType: 6,
                            StringEmptyOrNull: 7,
                            NotFoundInAvailableCurrencies: 8,
                            InvalidAmount: 9,
                            NotFoundInAvailableItemTypes: 10,
                            WrongProgressionOrder: 11,
                            InvalidEventIdLength: 12,
                            InvalidEventIdCharacters: 13,
                            InvalidProgressionStatus: 15,
                            InvalidSeverity: 16,
                            InvalidLongString: 17,
                            DatabaseTooLarge: 18,
                            DatabaseOpenOrCreate: 19,
                            JsonError: 25,
                            FailHttpJsonDecode: 29,
                            FailHttpJsonEncode: 30,
                            InvalidAdAction: 31,
                            InvalidAdType: 32,
                            InvalidString: 33
                        },
                        EGASdkErrorParameter: {
                            0: 'Undefined',
                            1: 'Currency',
                            2: 'CartType',
                            3: 'ItemType',
                            4: 'ItemId',
                            5: 'Store',
                            6: 'FlowType',
                            7: 'Amount',
                            8: 'Progression01',
                            9: 'Progression02',
                            10: 'Progression03',
                            11: 'EventId',
                            12: 'ProgressionStatus',
                            13: 'Severity',
                            14: 'Message',
                            15: 'AdAction',
                            16: 'AdType',
                            17: 'AdSdkName',
                            18: 'AdPlacement',
                            Undefined: 0,
                            Currency: 1,
                            CartType: 2,
                            ItemType: 3,
                            ItemId: 4,
                            Store: 5,
                            FlowType: 6,
                            Amount: 7,
                            Progression01: 8,
                            Progression02: 9,
                            Progression03: 10,
                            EventId: 11,
                            ProgressionStatus: 12,
                            Severity: 13,
                            Message: 14,
                            AdAction: 15,
                            AdType: 16,
                            AdSdkName: 17,
                            AdPlacement: 18
                        }
                    },
                    logging: {},
                    utilities: {},
                    validators: {},
                    device: {},
                    threading: {},
                    store: {
                        EGAStoreArgsOperator: {
                            0: 'Equal',
                            1: 'LessOrEqual',
                            2: 'NotEqual',
                            Equal: 0,
                            LessOrEqual: 1,
                            NotEqual: 2
                        },
                        EGAStore: {
                            0: 'Events',
                            1: 'Sessions',
                            2: 'Progression',
                            Events: 0,
                            Sessions: 1,
                            Progression: 2
                        }
                    },
                    state: {},
                    tasks: {}
                };
            },
            set(v) {},
            enumerable: false
        }
    });
            } catch (e) {
                console.log('%c[MineFun King] ⚠️ Could not override rewardedBreak/gameanalytics (object frozen)', 'color: #ff9900; font-size: 11px;');
            }
 
    console.warn = function (...m) {
        if (m[0] && String(m[0]).includes('GameAnalytics')) {
            return;
        }
        return warn.apply(this, arguments);
    };
 
            console.log('%c[MineFun King] Script fully loaded and waiting for game...', 'color: #00ff00; font-size: 14px;');
        })();