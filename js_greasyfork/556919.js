// ==UserScript==
// @name         Arras.io Alt Movement Mimic (Autodetect)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Right-click on an alt to copy its movement, aiming, and shooting, with automatic variable detection.
// @author       danny
// @match        https://arras.io/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556919/Arrasio%20Alt%20Movement%20Mimic%20%28Autodetect%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556919/Arrasio%20Alt%20Movement%20Mimic%20%28Autodetect%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =========================================================================
    // GLOBAL GAME VARIABLE POINTERS (Will be set by auto-detection)
    // =========================================================================
    let gameVars = {
        canvas: null,
        myInputObject: null, 
        allTanksArray: null,
        camera: { x: 0, y: 0 } // Placeholder for camera position
    };
    
    let isInitialized = false;
    let isMimicking = false;
    let targetTankIndex = -1; 
    let notificationElement = null;

    // Fixed configuration
    const CANVAS_SELECTOR = "canvas:not([id])";
    const SEARCH_RADIUS = 150; // Max search distance in world units (e.g., pixels)
    const PLAYER_DIMENSION_THRESHOLD = 50; // Tanks are likely larger than this value

    /**
     * Creates a simple, non-blocking notification on the screen.
     * @param {string} message The message to display.
     */
    function showNotification(message) {
        if (!notificationElement) {
            notificationElement = document.createElement('div');
            notificationElement.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                padding: 10px 15px;
                background: rgba(0, 0, 0, 0.8);
                color: #fff;
                font-family: sans-serif;
                font-size: 14px;
                border-radius: 5px;
                z-index: 10000;
                transition: opacity 0.3s ease-out;
                pointer-events: none;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            `;
            document.body.appendChild(notificationElement);
        }
        
        notificationElement.textContent = message;
        notificationElement.style.opacity = 1;

        // Automatically hide after 3 seconds
        clearTimeout(notificationElement.timeout);
        notificationElement.timeout = setTimeout(() => {
            notificationElement.style.opacity = 0;
        }, 3000);
    }

    // Utility function to approximate distance between two points
    function distance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    /**
     * Converts screen coordinates (mouse) to game world coordinates 
     * using the dynamically found camera position.
     * @param {number} screenX 
     * @param {number} screenY 
     * @returns {object} { wx, wy } in world space.
     */
    function screenToWorldCoords(screenX, screenY) {
        const { canvas, camera } = gameVars;
        if (!canvas) return { wx: 0, wy: 0 };

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        // The game's camera position (camera.x, camera.y) is the world center 
        // that corresponds to the screen center (centerX, centerY).
        const worldX = camera.x + (screenX - centerX);
        const worldY = camera.y + (screenY - centerY);
        
        return { wx: worldX, wy: worldY };
    }

    /**
     * Finds the closest tank index to the current world coordinates, excluding the main player.
     * @param {number} worldX Mouse X in game world coordinates
     * @param {number} worldY Mouse Y in game world coordinates
     * @returns {number} The index of the closest tank, or -1 if none found.
     */
    function findTargetTank(worldX, worldY) {
        let closestIndex = -1;
        let minDistance = Infinity;
        const tanks = gameVars.allTanksArray;

        if (!tanks || !Array.isArray(tanks)) return -1;

        // 1. First, try to find the player's tank index (the tank at the center)
        let playerTankIndex = -1;
        for (let i = 0; i < tanks.length; i++) {
            const tank = tanks[i];
            // Player tank is usually centered on the camera position
            if (tank && distance(tank.x, tank.y, gameVars.camera.x, gameVars.camera.y) < 1) { 
                 // Also confirm it looks like a player tank (large dimensions)
                if (tank.size > PLAYER_DIMENSION_THRESHOLD || tank.dimension > PLAYER_DIMENSION_THRESHOLD) {
                    playerTankIndex = i;
                    break;
                }
            }
        }

        // 2. Search for the closest nearby tank (alt)
        for (let i = 0; i < tanks.length; i++) {
            if (i === playerTankIndex) continue; // Skip the main player tank
            
            const tank = tanks[i];
            
            // Check if tank object has position data
            if (tank && tank.x !== undefined && tank.y !== undefined) {
                const dist = distance(worldX, worldY, tank.x, tank.y); 

                if (dist < minDistance && dist < SEARCH_RADIUS) {
                    minDistance = dist;
                    closestIndex = i;
                }
            }
        }
        return closestIndex;
    }
    
    /**
     * Aggressively searches the global 'window' scope for game variables based on object structure.
     * This function is the core of the auto-detection.
     */
    function findGameVariables() {
        const globalScope = window;
        
        // 1. Find Canvas
        gameVars.canvas = document.querySelector(CANVAS_SELECTOR);
        if (!gameVars.canvas) {
            console.warn("Autodetect: Canvas not found.");
            return false;
        }

        // 2. Find Tank Array and Camera/Input Objects
        // We will search for a few common patterns in global variables
        for (const prop in globalScope) {
            if (globalScope.hasOwnProperty(prop)) {
                const value = globalScope[prop];

                // --- Input Object Detection ---
                // An object that has common input keys (up, down, shoot)
                if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    if (value.up !== undefined && value.down !== undefined && value.shoot !== undefined) {
                        gameVars.myInputObject = value;
                        console.log(`Autodetect: Found Input Object at window.${prop}`);
                    }
                }

                // --- Tank Array Detection ---
                // A large array of objects with x, y, and size/dimension properties
                if (Array.isArray(value) && value.length > 5 && gameVars.allTanksArray === null) {
                    const sample = value[0];
                    if (typeof sample === 'object' && sample !== null &&
                        sample.x !== undefined && sample.y !== undefined && 
                        (sample.size !== undefined || sample.dimension !== undefined)) {
                        
                        gameVars.allTanksArray = value;
                        console.log(`Autodetect: Found Tank Array at window.${prop}`);
                    }
                }

                // --- Camera Position Detection ---
                // An object that has a position property (x, y) that frequently changes (camera position)
                if (typeof value === 'object' && value !== null && gameVars.camera.x === 0 && gameVars.camera.y === 0) {
                     if (value.x !== undefined && value.y !== undefined && typeof value.x === 'number') {
                         // Check if this object contains properties common to a camera/player state
                         if (value.vx !== undefined || value.vy !== undefined || value.size !== undefined) {
                             gameVars.camera = value;
                             console.log(`Autodetect: Found Camera/Player State at window.${prop}`);
                         }
                     }
                }
            }
        }
        
        // Final check for required variables
        if (gameVars.myInputObject && gameVars.allTanksArray) {
            console.log("Autodetect: All necessary game variables found.");
            return true;
        } else {
            console.warn("Autodetect: Still missing variables.", { Input: !!gameVars.myInputObject, Tanks: !!gameVars.allTanksArray });
            return false;
        }
    }


    /**
     * Main Mimic Loop: Runs periodically to copy the target's state.
     */
    function mimicLoop() {
        if (!isMimicking || targetTankIndex === -1 || !gameVars.myInputObject || !gameVars.allTanksArray) {
            return;
        }

        const targetTank = gameVars.allTanksArray[targetTankIndex];
        const myInput = gameVars.myInputObject;

        // Ensure the target tank still exists at this index and has input state data
        if (targetTank && targetTank.input) {
            // Arras.io tank objects sent over the network usually have an 'input' sub-object 
            // that reflects its current actions. This is the state we need to copy.
            const targetInput = targetTank.input;

            // 1. MIMIC MOVEMENT
            // Copying direct input flags (usually 0 or 1)
            if (targetInput.up !== undefined) myInput.up = targetInput.up;
            if (targetInput.down !== undefined) myInput.down = targetInput.down;
            if (targetInput.left !== undefined) myInput.left = targetInput.left;
            if (targetInput.right !== undefined) myInput.right = targetInput.right;

            // 2. MIMIC SHOOTING
            if (targetInput.shoot !== undefined) {
                myInput.shoot = targetInput.shoot;
            }

            // 3. MIMIC AIMING (Copying the target's aim position)
            if (targetInput.aim_x !== undefined && targetInput.aim_y !== undefined) {
                myInput.aim_x = targetInput.aim_x;
                myInput.aim_y = targetInput.aim_y;
            } 
            
            // Note: Aiming must be copied in world coordinates if the game uses that format.
            // If the game only exposes an aim angle, further conversion logic would be needed.

            console.log(`[Arras Alt Mimic] Mimicking Alt at Index: ${targetTankIndex}`);

        } else {
            // Target tank is gone (maybe disconnected or died)
            console.warn(`[Arras Alt Mimic] Target tank at index ${targetTankIndex} disappeared. Stopping mimic.`);
            isMimicking = false;
            targetTankIndex = -1;
            showNotification("Mimic OFF: Target disconnected/died.");
            // Reset player input to stop unintended movement
            myInput.up = myInput.down = myInput.left = myInput.right = myInput.shoot = 0;
        }
    }

    /**
     * Handles the right-click (contextmenu) event for selecting the alt.
     */
    function handleRightClick(event) {
        // Prevent the default context menu from appearing
        event.preventDefault(); 
        
        if (!isInitialized) {
            showNotification("Initialization not complete. Try reloading the page.");
            return;
        }

        const canvas = gameVars.canvas;

        // Get mouse coordinates relative to the canvas
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        // Convert to world coordinates
        const worldCoords = screenToWorldCoords(mouseX, mouseY);
        
        const newTargetIndex = findTargetTank(worldCoords.wx, worldCoords.wy);

        if (isMimicking && newTargetIndex === targetTankIndex) {
            // Case 1: Already mimicking this target -> STOP MIMICKING
            isMimicking = false;
            targetTankIndex = -1;
            console.log("[Arras Alt Mimic] Stopped mimicking.");
            showNotification("Alt Mimic: OFF");
            // Reset player input
            const myInput = gameVars.myInputObject;
            if(myInput) myInput.up = myInput.down = myInput.left = myInput.right = myInput.shoot = 0;

        } else if (newTargetIndex !== -1) {
            // Case 2: Found a new target -> START MIMICKING
            targetTankIndex = newTargetIndex;
            isMimicking = true;
            console.log(`[Arras Alt Mimic] Started mimicking new Alt at Index: ${targetTankIndex}`);
            showNotification(`Alt Mimic: ON (Following Alt Index: ${targetTankIndex})`);
        } else {
            // Case 3: Right-clicked, but no tank found nearby
            isMimicking = false; // Ensure it's off if no target is found
            targetTankIndex = -1;
            console.log("[Arras Alt Mimic] No tank found near click. Mimic OFF.");
            showNotification("Alt Mimic: No alt found nearby.");
        }
    }

    /**
     * Initialization function
     */
    function init() {
        console.log("[Arras Alt Mimic] Starting Autodetection...");
        
        const detectionSuccess = findGameVariables();

        if (detectionSuccess) {
            isInitialized = true;
            gameVars.canvas.addEventListener('contextmenu', handleRightClick, false);
            // Start the polling loop (runs 60 times per second)
            setInterval(mimicLoop, 1000 / 60); 

            console.log("[Arras Alt Mimic] Userscript loaded and variables autodetected.");
            showNotification("Alt Mimic: Ready. Right-click on an alt to follow.");
        } else {
            console.error("[Arras Alt Mimic] Autodetection failed. Retrying in 2 seconds...");
            // Retry initialization until the global variables are available
            setTimeout(init, 2000); 
        }
    }

    // Start the initialization process
    init();

})();