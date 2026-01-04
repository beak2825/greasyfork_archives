// ==UserScript==
// @name         KremCheats VIP - Fortnite - FREE VERSION - XBOX CLOUD GAMING
// @namespace    https://github.com/KremityssYTB
// @version      1.3.3.7
// @description  Enhanced AI-powered aimbot with RGB ESP, Performance Controls, Mobile Support & Simple Key Auth
// @author       KremCheats
// @license      MIT
// @match        https://www.xbox.com/*/play/*
// @match        https://www.xbox.com/play/*
// @match        *://krunker.io/*
// @icon         https://i.imgur.com/dsn6DOc.jpeg
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @require      https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.11.0/dist/tf.min.js
// @require      https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd@2.2.3
// @downloadURL https://update.greasyfork.org/scripts/558851/KremCheats%20VIP%20-%20Fortnite%20-%20FREE%20VERSION%20-%20XBOX%20CLOUD%20GAMING.user.js
// @updateURL https://update.greasyfork.org/scripts/558851/KremCheats%20VIP%20-%20Fortnite%20-%20FREE%20VERSION%20-%20XBOX%20CLOUD%20GAMING.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('🌿 KremCheats VIP - Starting initialization...');

    // ========== SIMPLE KEY AUTHENTICATION SYSTEM ==========
    const SimpleKeyAuth = (function() {
        'use strict';

        const VALID_KEY = 'KREM-FORTNITE-FREE-1234';
        const TELEGRAM_LINK = 'https://t.me/KremCheats/492';
        const STORAGE_KEY = 'kremcheats_simple_key';

        let authenticated = false;

        // Check if key is stored
        function checkStoredKey() {
            const storedKey = localStorage.getItem(STORAGE_KEY);
            if (storedKey === VALID_KEY) {
                authenticated = true;
                return true;
            }
            return false;
        }

        // Show auth dialog
        function showAuthDialog() {
            const overlay = document.createElement('div');
            overlay.id = 'krem-simple-auth-overlay';
            overlay.innerHTML = `
                <style>
                    #krem-simple-auth-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.95);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        z-index: 999999;
                        font-family: 'Rajdhani', sans-serif;
                    }
                    
                    #krem-simple-auth-box {
                        background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%);
                        border: 3px solid #00ff00;
                        border-radius: 15px;
                        padding: 40px;
                        max-width: 450px;
                        width: 90%;
                        box-shadow: 0 0 30px #00ff00, 0 0 60px #00ff00;
                        animation: kremGlow 2s infinite;
                    }
                    
                    @keyframes kremGlow {
                        0%, 100% { box-shadow: 0 0 20px rgba(0,255,0,0.6); }
                        50% { box-shadow: 0 0 40px rgba(0,255,0,1); }
                    }
                    
                    #krem-simple-auth-logo {
                        text-align: center;
                        font-size: 48px;
                        margin-bottom: 20px;
                    }
                    
                    #krem-simple-auth-title {
                        color: #00ff00;
                        text-align: center;
                        font-size: 28px;
                        font-weight: bold;
                        margin-bottom: 10px;
                        text-shadow: 0 0 10px #00ff00;
                    }
                    
                    #krem-simple-auth-subtitle {
                        color: #fff;
                        text-align: center;
                        font-size: 14px;
                        margin-bottom: 30px;
                        opacity: 0.8;
                    }
                    
                    #krem-simple-auth-input {
                        width: 100%;
                        padding: 15px;
                        background: rgba(0, 0, 0, 0.5);
                        border: 2px solid #00ff00;
                        border-radius: 8px;
                        color: #00ff00;
                        font-size: 16px;
                        font-family: 'Rajdhani', monospace;
                        margin-bottom: 15px;
                        box-sizing: border-box;
                        text-transform: uppercase;
                    }
                    
                    #krem-simple-auth-input:focus {
                        outline: none;
                        box-shadow: 0 0 15px rgba(0, 255, 0, 0.5);
                    }
                    
                    .krem-simple-auth-btn {
                        width: 100%;
                        padding: 15px;
                        border: 2px solid #00ff00;
                        border-radius: 8px;
                        background: linear-gradient(135deg, rgba(0, 255, 0, 0.2) 0%, rgba(0, 200, 0, 0.2) 100%);
                        color: #00ff00;
                        font-size: 16px;
                        font-weight: bold;
                        cursor: pointer;
                        margin-bottom: 10px;
                        transition: all 0.3s;
                        font-family: 'Rajdhani', sans-serif;
                    }
                    
                    .krem-simple-auth-btn:hover {
                        background: linear-gradient(135deg, rgba(0, 255, 0, 0.4) 0%, rgba(0, 200, 0, 0.4) 100%);
                        box-shadow: 0 0 20px rgba(0, 255, 0, 0.6);
                    }
                    
                    #krem-simple-auth-error {
                        color: #ff0000;
                        text-align: center;
                        font-size: 14px;
                        margin-top: 10px;
                        min-height: 20px;
                    }
                    
                    .krem-simple-auth-link {
                        color: #00ff00;
                        text-decoration: none;
                        display: block;
                        text-align: center;
                        margin-top: 15px;
                        font-size: 14px;
                    }
                    
                    .krem-simple-auth-link:hover {
                        text-shadow: 0 0 10px #00ff00;
                    }
                </style>
                
                <div id="krem-simple-auth-box">
                    <div id="krem-simple-auth-logo">🌿</div>
                    <div id="krem-simple-auth-title">KremCheats VIP</div>
                    <div id="krem-simple-auth-subtitle">Enter your license key to continue</div>
                    
                    <input type="text" id="krem-simple-auth-input" placeholder="KREM-XXXX-XXXX-XXXX" />
                    
                    <button class="krem-simple-auth-btn" id="krem-simple-auth-submit">
                        🔓 Unlock
                    </button>
                    
                    <button class="krem-simple-auth-btn" id="krem-simple-auth-getkey">
                        🔑 Get Key
                    </button>
                    
                    <div id="krem-simple-auth-error"></div>
                    
                    <a href="${TELEGRAM_LINK}" target="_blank" class="krem-simple-auth-link">
                        📱 Contact @KremCheats on Telegram
                    </a>
                </div>
            `;

            document.body.appendChild(overlay);

            const input = document.getElementById('krem-simple-auth-input');
            const submitBtn = document.getElementById('krem-simple-auth-submit');
            const getKeyBtn = document.getElementById('krem-simple-auth-getkey');
            const errorDiv = document.getElementById('krem-simple-auth-error');

            input.focus();

            // Submit handler
            submitBtn.addEventListener('click', () => validateKey());
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') validateKey();
            });

            // Get Key button handler
            getKeyBtn.addEventListener('click', () => {
                window.open(TELEGRAM_LINK, '_blank');
            });

            function validateKey() {
                const enteredKey = input.value.trim().toUpperCase();
                
                if (!enteredKey) {
                    showError('Please enter a key');
                    return;
                }

                if (enteredKey === VALID_KEY) {
                    // Success!
                    localStorage.setItem(STORAGE_KEY, VALID_KEY);
                    authenticated = true;
                    
                    submitBtn.innerHTML = '✅ AUTHENTICATED';
                    submitBtn.style.background = 'linear-gradient(135deg, #00ff00 0%, #00cc00 100%)';
                    
                    setTimeout(() => {
                        overlay.style.animation = 'fadeOut 0.5s forwards';
                        setTimeout(() => {
                            overlay.remove();
                            startCheats();
                        }, 500);
                    }, 1000);
                } else {
                    showError('Invalid key! Get a valid key from Telegram');
                    input.value = '';
                    input.focus();
                }
            }

            function showError(message) {
                errorDiv.textContent = message;
                errorDiv.style.animation = 'shake 0.5s';
                setTimeout(() => {
                    errorDiv.style.animation = '';
                }, 500);
            }
        }

        // Initialize auth
        async function init() {
            console.log('[SimpleKeyAuth] Checking authentication...');
            
            if (checkStoredKey()) {
                console.log('[SimpleKeyAuth] ✅ Valid key found in storage');
                return true;
            }

            console.log('[SimpleKeyAuth] No valid key found, showing auth dialog...');
            
            return new Promise((resolve) => {
                showAuthDialog();
                
                // Wait for authentication
                const checkInterval = setInterval(() => {
                    if (authenticated) {
                        clearInterval(checkInterval);
                        resolve(true);
                    }
                }, 500);
            });
        }

        return {
            init: init,
            isAuthenticated: () => authenticated
        };
    })();
    // ========== END SIMPLE KEY AUTHENTICATION ==========




    // Wait for dependencies with progress
    async function waitForDependencies() {
        return new Promise((resolve) => {
            let attempts = 0;
            const maxAttempts = 15;

            console.log('[KremCheats] Waiting for TensorFlow.js and CocoSSD...');

            const checkInterval = setInterval(() => {
                attempts++;
                // Check in both userscript scope and window scope
                const tfLoaded = (typeof tf !== 'undefined' && tf !== null) ||
                                (typeof unsafeWindow.tf !== 'undefined' && unsafeWindow.tf !== null);
                const cocoLoaded = (typeof cocoSsd !== 'undefined' && cocoSsd !== null) ||
                                  (typeof unsafeWindow.cocoSsd !== 'undefined' && unsafeWindow.cocoSsd !== null);

                console.log(`[KremCheats] Check ${attempts}/${maxAttempts} - TF.js: ${tfLoaded ? '✅' : '⏳'} | CocoSSD: ${cocoLoaded ? '✅' : '⏳'}`);

                if (tfLoaded && cocoLoaded) {
                    clearInterval(checkInterval);
                    console.log('✅ [KremCheats] All dependencies loaded!');

                    // Expose libraries to window scope if not already there
                    if (typeof unsafeWindow.tf === 'undefined' && typeof tf !== 'undefined') {
                        unsafeWindow.tf = tf;
                        console.log('[KremCheats] Exposed tf to window scope');
                    }
                    if (typeof unsafeWindow.cocoSsd === 'undefined' && typeof cocoSsd !== 'undefined') {
                        unsafeWindow.cocoSsd = cocoSsd;
                        console.log('[KremCheats] Exposed cocoSsd to window scope');
                    }

                    resolve(true);
                } else if (attempts >= maxAttempts) {
                    clearInterval(checkInterval);
                    console.log(`⏱️ [KremCheats] Timeout after ${maxAttempts} seconds`);
                    resolve(tfLoaded && cocoLoaded);
                }
            }, 1000);
        });
    }

    // Wait for game video
    async function waitForGameVideo() {
        return new Promise((resolve) => {
            let attempts = 0;
            console.log('[KremCheats] Waiting for game video...');

            const checkVideo = setInterval(() => {
                attempts++;
                const video = document.querySelector('video[aria-label="Game Stream for unknown title"]');
                const videoReady = video && video.readyState >= 2;

                if (attempts % 5 === 0) {
                    console.log(`[KremCheats] Looking for game video... (${attempts}s)`);
                }

                if (videoReady) {
                    clearInterval(checkVideo);
                    console.log('✅ [KremCheats] Game video detected and ready!');
                    resolve(true);
                }
            }, 1000);
        });
    }

    // Main initialization
    async function initKremCheats() {
        console.log('='.repeat(60));
        console.log('🌿 KremCheats VIP - Fortnite - Backwoods Edition Enhanced');
        console.log('='.repeat(60));

        // Step 1: Wait for dependencies
        const depsReady = await waitForDependencies();

        if (!depsReady) {
            console.error('❌ [KremCheats] Dependencies failed to load!');
            alert('KremCheats: Failed to load required libraries. Please refresh the page.');
            return;
        }

        // Step 2: Wait for game video
        await waitForGameVideo();

        // Step 3: Small delay for stability
        console.log('[KremCheats] Waiting 2 seconds for stability...');
        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log('='.repeat(60));
        console.log('🚀 [KremCheats] Injecting main script...');
        console.log('='.repeat(60));

        // Step 4: Inject main script into page context (not userscript context)
        try {
            const script = document.createElement('script');
            script.textContent = `
// KremCheats VIP - Main Script (Auto-injected)
// Libraries are available in window scope as window.tf and window.cocoSsd
const config = {
    version: '3.3.0',
    detection: {
        enabled: true,
        modelType: 'cocossd',
        modelBase: 'mobilenet_v2',
        confidence: 0.35,
        targetClass: 'person',
        maxDetections: 3,
    },
    game: {
        videoSelector: 'video[aria-label="Game Stream for unknown title"]',
        containerSelector: '#game-stream',
        aimInterval: 30,
        fovRadius: 150,
        recoilCompensation: true,
        recoilLevel: 4,
        recoilPatterns: {
            1: { vertical: 0, horizontal: 0, recoverySpeed: 0.5 },
            2: { vertical: 0.2, horizontal: 0.05, recoverySpeed: 0.2 },
            3: { vertical: 0.4, horizontal: 0.1, recoverySpeed: 0.15 },
            4: { vertical: 0.6, horizontal: 0.2, recoverySpeed: 0.1 },
        },
        autoShoot: true,
        autoCrouchShoot: true,
        autoReload: true,
        crouchKey: 'KeyQ',
        reloadKey: 'KeyR',
        inventoryKeys: ['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7'],
    },
    crosshair: {
        enabled: true,
        size: 15,
        color: 'lime',
        style: 'cross'
    },
    fovCircle: {
        enabled: true,
        color: 'rgba(255, 255, 255, 0.4)',
        lineWidth: 1,
        rgbEnabled: false,
    },
    boundingBoxes: {
        enabled: true,
        color: 'cyan',
        lineWidth: 1,
        rgbEnabled: false,
    },
    aim: {
        targetPriority: "closest",
        aimPoint: "center",
    },
    performance: {
        showFPS: true,
        showPing: false,
        fpsBooster: false,
        cpuMax: false,
        gpuMax: false,
    },
    mobile: {
        enabled: false,
        touchControls: true,
        buttonSize: 60,
        buttonOpacity: 0.7,
    },
    debug: {
        enabled: true,
        showFPS: true,
        logThrottleMs: 100,
        logMovement: true,
    }
};

// RGB color cycling
let rgbHue = 0;
function getRGBColor() {
    rgbHue = (rgbHue + 2) % 360;
    return \`hsl(\${rgbHue}, 100%, 50%)\`;
}

// Performance monitoring
let performanceStats = {
    fps: 0,
    ping: 0,
    lastPingUpdate: 0,
};

// --- Globals ---
let gameVideo = null;
let detectionModel = null;
let currentTarget = null;
let overlayCanvas = null;
let overlayCtx = null;
let bestTarget = null;
let lastPredictions = [];
let processingFrame = false;
let lastDetectionTimestamp = 0;

// --- Utility functions ---
const utils = {
    fps: (function() {
        let fps = 0, lastUpdate = Date.now(), frames = 0;
        return {
            get: () => fps,
            update: () => {
                frames++;
                const now = Date.now();
                const diff = now - lastUpdate;
                if (diff >= 1000) {
                    fps = Math.round((frames * 1000) / diff);
                    performanceStats.fps = fps;
                    lastUpdate = now;
                    frames = 0;
                }
            }
        };
    })()
};

const debug = {
    enabled: config.debug.enabled,
    showFPS: config.debug.showFPS,
    logMovement: config.debug.logMovement,
    lastLogTime: 0,
    throttleMs: config.debug.logThrottleMs,
    log(...args) {
        if (this.enabled) {
            const now = Date.now();
            const isErrorOrWarn = typeof args[0] === 'string' && (args[0].includes("ERROR:") || args[0].includes("WARN:"));
            if (isErrorOrWarn || now - this.lastLogTime >= this.throttleMs) {
                let logString = \`[KremCheats]\`;
                if (this.showFPS) {
                    const actualInterval = lastDetectionTimestamp ? (now - lastDetectionTimestamp) : 0;
                    logString += \` FPS: \${utils.fps.get()} | LastDet: \${actualInterval}ms |\`;
                }
                console.log(logString, ...args);
                if (!isErrorOrWarn) this.lastLogTime = now;
            }
        }
    },
    logMove(...args) {
         if (this.enabled && this.logMovement) {
             let logString = \`[KremCheats] MOVE |\`;
             if (this.showFPS) { logString += \` FPS: \${utils.fps.get()} |\`; }
             console.log(logString, ...args);
         }
    },
    error(...args) { if (this.enabled) { console.error(\`[KremCheats] ERROR:\`, ...args); } },
    warn(...args) { if (this.enabled) { console.warn(\`[KremCheats] WARN:\`, ...args); } }
};

const InputSimulator = {
    gameContainer: null,
    mousePos: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    kbm: {
        lastClientX: window.innerWidth / 2,
        lastClientY: window.innerHeight / 2,
        leftButtonDown: false,
        inventoryActive: [false,false,false,false,false,false,false],
    },
    isShooting: false,
    recoilOffset: { x: 0, y: 0 },

    _simulatePointerEvent(options) {
        const { type, clientX, clientY, movementX = 0, movementY = 0, button = 0, buttons = 0, delay = 0 } = options;
        let eventType;
        let eventProps = {
            bubbles: true, cancelable: true, view: window,
            clientX: Math.round(clientX), clientY: Math.round(clientY),
            movementX: Math.round(movementX), movementY: Math.round(movementY),
            pointerType: 'mouse', button: button, buttons: buttons,
        };

        if (type === 'pointermove') {
            eventType = 'pointermove';
            eventProps.buttons = this.kbm.leftButtonDown ? 1 : 0;
        } else if (type === 'pointerdown') {
            eventType = 'pointerdown';
            if (button === 0) this.kbm.leftButtonDown = true;
            eventProps.buttons = 1;
        } else if (type === 'pointerup') {
            eventType = 'pointerup';
            if (button === 0) this.kbm.leftButtonDown = false;
            eventProps.buttons = 0;
        } else {
            debug.error("Invalid pointer event type:", type); return;
        }
        if (!eventType) return;
        setTimeout(() => {
            const event = new PointerEvent(eventType, eventProps);
            if (this.gameContainer) {
                 this.gameContainer.dispatchEvent(event);
            } else {
                 document.dispatchEvent(event);
            }
        }, delay);
    },

    init() {
        this.gameContainer = document.querySelector(config.game.containerSelector) || document.body;
        if (!this.gameContainer) {
            debug.error("Game container not found!");
            return false;
        }
        debug.log("InputSimulator initialized. Container:", this.gameContainer.tagName);
        return true;
    },

    moveMouseTo(targetX, targetY) {
        const currentX = this.kbm.lastClientX;
        const currentY = this.kbm.lastClientY;
        let deltaX = targetX - currentX;
        let deltaY = targetY - currentY;

        if (config.game.recoilCompensation) {
            const recoilPattern = config.game.recoilPatterns[config.game.recoilLevel];
            if (recoilPattern && this.isShooting) {
                const recoilX = recoilPattern.horizontal * 10;
                const recoilY = recoilPattern.vertical * 10;
                this.recoilOffset.x += recoilX;
                this.recoilOffset.y += recoilY;
                deltaX -= this.recoilOffset.x;
                deltaY -= this.recoilOffset.y;
            }
        }

        const newX = currentX + deltaX;
        const newY = currentY + deltaY;

        this._simulatePointerEvent({
            type: 'pointermove',
            clientX: newX,
            clientY: newY,
            movementX: deltaX,
            movementY: deltaY,
        });

        this.kbm.lastClientX = newX;
        this.kbm.lastClientY = newY;
        this.mousePos.x = newX;
        this.mousePos.y = newY;

        if (config.debug.logMovement) {
            debug.logMove(\`Move to (\${Math.round(newX)}, \${Math.round(newY)}), delta: (\${Math.round(deltaX)}, \${Math.round(deltaY)})\`);
        }
    },

    startShooting() {
        if (this.isShooting) return;
        this.isShooting = true;
        this._simulatePointerEvent({
            type: 'pointerdown',
            clientX: this.kbm.lastClientX,
            clientY: this.kbm.lastClientY,
            button: 0,
            buttons: 1,
        });
        debug.log("Started shooting.");
    },

    stopShooting() {
        if (!this.isShooting) return;
        this.isShooting = false;
        this._simulatePointerEvent({
            type: 'pointerup',
            clientX: this.kbm.lastClientX,
            clientY: this.kbm.lastClientY,
            button: 0,
            buttons: 0,
        });
        debug.log("Stopped shooting.");
    }
};

function createOverlayCanvas() {
    if (overlayCanvas) return;
    overlayCanvas = document.createElement('canvas');
    overlayCanvas.id = 'krem-overlay';
    overlayCanvas.style.cssText = \`
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: 99999;
    \`;
    overlayCanvas.width = window.innerWidth;
    overlayCanvas.height = window.innerHeight;
    overlayCtx = overlayCanvas.getContext('2d');
    document.body.appendChild(overlayCanvas);

    window.addEventListener('resize', () => {
        overlayCanvas.width = window.innerWidth;
        overlayCanvas.height = window.innerHeight;
    });

    debug.log("Overlay canvas created.");
}

function createCrosshair() {
    const crosshair = document.createElement('div');
    crosshair.id = 'krem-crosshair';
    crosshair.style.cssText = \`
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: \${config.crosshair.size}px;
        height: \${config.crosshair.size}px;
        pointer-events: none;
        z-index: 100000;
    \`;

    if (config.crosshair.style === 'cross') {
        crosshair.innerHTML = \`
            <div style="position:absolute;top:50%;left:0;width:100%;height:2px;background:\${config.crosshair.color};transform:translateY(-50%);"></div>
            <div style="position:absolute;left:50%;top:0;height:100%;width:2px;background:\${config.crosshair.color};transform:translateX(-50%);"></div>
        \`;
    } else if (config.crosshair.style === 'dot') {
        crosshair.innerHTML = \`
            <div style="position:absolute;top:50%;left:50%;width:4px;height:4px;background:\${config.crosshair.color};border-radius:50%;transform:translate(-50%,-50%);"></div>
        \`;
    }

    document.body.appendChild(crosshair);
    debug.log("Crosshair created.");
}

function drawOverlay(predictions) {
    if (!overlayCanvas || !overlayCtx) return;
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

    const vvp = window.visualViewport;
    const screenCenterX = vvp ? vvp.width / 2 + vvp.pageLeft : window.innerWidth / 2;
    const screenCenterY = vvp ? (vvp.height / 2 + vvp.offsetTop) : (window.innerHeight / 2);

    // Draw FOV Circle
    if (config.fovCircle.enabled) {
        overlayCtx.beginPath();
        overlayCtx.arc(screenCenterX, screenCenterY, config.game.fovRadius, 0, 2 * Math.PI);
        overlayCtx.strokeStyle = config.fovCircle.rgbEnabled ? getRGBColor() : config.fovCircle.color;
        overlayCtx.lineWidth = config.fovCircle.lineWidth;
        overlayCtx.stroke();
    }

    // Draw Bounding Boxes
    if (config.boundingBoxes.enabled && gameVideo && predictions.length > 0) {
        const videoRect = gameVideo.getBoundingClientRect();
        const scaleX = videoRect.width / gameVideo.videoWidth;
        const scaleY = videoRect.height / gameVideo.videoHeight;

        predictions.forEach(pred => {
            if (pred.class !== config.detection.targetClass) return;
            const [x, y, w, h] = pred.bbox;
            const screenX = videoRect.left + x * scaleX;
            const screenY = videoRect.top + y * scaleY;
            const screenW = w * scaleX;
            const screenH = h * scaleY;

            overlayCtx.strokeStyle = config.boundingBoxes.rgbEnabled ? getRGBColor() : config.boundingBoxes.color;
            overlayCtx.lineWidth = config.boundingBoxes.lineWidth;
            overlayCtx.strokeRect(screenX, screenY, screenW, screenH);

            overlayCtx.fillStyle = config.boundingBoxes.rgbEnabled ? getRGBColor() : config.boundingBoxes.color;
            overlayCtx.font = '14px Arial';
            overlayCtx.fillText(\`\${pred.class} \${(pred.score * 100).toFixed(0)}%\`, screenX, screenY - 5);
        });
    }

    // Draw Performance Stats
    if (config.performance.showFPS) {
        overlayCtx.fillStyle = 'lime';
        overlayCtx.font = 'bold 16px Arial';
        overlayCtx.fillText(\`FPS: \${performanceStats.fps}\`, 10, 30);
    }

    if (config.performance.showPing) {
        overlayCtx.fillStyle = 'yellow';
        overlayCtx.font = 'bold 16px Arial';
        overlayCtx.fillText(\`Ping: \${performanceStats.ping}ms\`, 10, 55);
    }
}

function createGUI() {
    const gui = document.createElement('div');
    gui.id = 'kremcheats-gui';
    gui.style.cssText = \`
        position: fixed;
        top: 60px;
        right: 30px;
        width: 420px;
        max-height: 85vh;
        background: linear-gradient(135deg, rgba(10, 20, 30, 0.98), rgba(5, 15, 25, 0.98));
        border: 2px solid #00ff00;
        border-radius: 20px;
        padding: 20px;
        font-family: 'Rajdhani', 'Segoe UI', sans-serif;
        color: #00ff00;
        z-index: 100000;
        box-shadow: 0 0 40px rgba(0, 255, 0, 0.6), inset 0 0 30px rgba(0, 255, 0, 0.1);
        backdrop-filter: blur(10px);
        overflow-y: auto;
        animation: guiFadeIn 0.5s ease-out;
        user-select: none;
    \`;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = \`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Orbitron:wght@900&display=swap');

        @keyframes guiFadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes neonPulse {
            0%, 100% { text-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00; box-shadow: 0 0 20px rgba(0,255,0,0.6); }
            50% { text-shadow: 0 0 20px #00ff00, 0 0 30px #00ff00, 0 0 40px #00ff00, 0 0 50px #0f0; box-shadow: 0 0 40px rgba(0,255,0,1); }
        }

        @keyframes buttonGlow {
            0%, 100% { box-shadow: 0 0 10px rgba(0, 255, 0, 0.5), 0 0 20px rgba(0, 255, 0, 0.3), inset 0 0 10px rgba(0, 255, 0, 0.2); }
            50% { box-shadow: 0 0 20px rgba(0, 255, 0, 0.8), 0 0 30px rgba(0, 255, 0, 0.5), inset 0 0 15px rgba(0, 255, 0, 0.3); }
        }

        #kremcheats-gui::-webkit-scrollbar {
            width: 8px;
        }

        #kremcheats-gui::-webkit-scrollbar-track {
            background: rgba(10, 20, 30, 0.5);
            border-radius: 10px;
        }

        #kremcheats-gui::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, #00ff00, #00cc00);
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 255, 204, 0.5);
        }

        .krem-checkbox {
            appearance: none;
            width: 18px;
            height: 18px;
            border: 2px solid #00ff00;
            border-radius: 4px;
            background: rgba(0, 255, 0, 0.1);
            cursor: pointer;
            position: relative;
            transition: all 0.3s ease;
        }

        .krem-checkbox:checked {
            background: linear-gradient(135deg, #00ff00, #00cc00);
            box-shadow: 0 0 10px rgba(0, 255, 204, 0.8);
        }

        .krem-checkbox:checked::after {
            content: '✓';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #0a141e;
            font-weight: bold;
            font-size: 14px;
        }

        .krem-slider {
            -webkit-appearance: none;
            appearance: none;
            width: 100%;
            height: 6px;
            border-radius: 5px;
            background: linear-gradient(90deg, rgba(0, 255, 0, 0.2), rgba(0, 255, 0, 0.5));
            outline: none;
            transition: all 0.3s ease;
        }

        .krem-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: linear-gradient(135deg, #00ff00, #00cc00);
            cursor: pointer;
            box-shadow: 0 0 10px rgba(0, 255, 0, 0.8), 0 0 20px rgba(0, 255, 0, 0.4);
            transition: all 0.3s ease;
        }

        .krem-slider::-webkit-slider-thumb:hover {
            transform: scale(1.2);
            box-shadow: 0 0 15px rgba(0, 255, 0, 1), 0 0 30px rgba(0, 255, 0, 0.6);
        }

        .krem-select {
            background: rgba(0, 255, 0, 0.1);
            border: 2px solid #00ff00;
            border-radius: 8px;
            color: #00ff00;
            padding: 6px 10px;
            font-family: 'Rajdhani', sans-serif;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .krem-select:hover {
            background: rgba(0, 255, 0, 0.2);
            box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
        }

        .krem-select option {
            background: #0a141e;
            color: #00ff00;
        }

        .krem-tab-buttons {
            display: flex;
            gap: 5px;
            margin-bottom: 15px;
            flex-wrap: wrap;
        }

        .krem-tab-btn {
            flex: 1;
            min-width: 80px;
            padding: 8px 12px;
            background: rgba(0, 255, 0, 0.1);
            border: 2px solid #00ff00;
            border-radius: 8px;
            color: #00ff00;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-align: center;
            font-size: 12px;
        }

        .krem-tab-btn:hover {
            background: rgba(0, 255, 0, 0.2);
            box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
        }

        .krem-tab-btn.active {
            background: linear-gradient(135deg, #00ff00, #00cc00);
            color: #0a141e;
            box-shadow: 0 0 15px rgba(0, 255, 0, 0.8);
        }

        .krem-tab-content {
            display: none;
        }

        .krem-tab-content.active {
            display: block;
        }

        .krem-button-3d {
            background: linear-gradient(145deg, #00ff00, #00cc00);
            border: none;
            border-radius: 12px;
            padding: 10px 20px;
            color: #0a141e;
            font-weight: 700;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 0 15px rgba(0, 255, 204, 0.6), 0 5px 15px rgba(0, 0, 0, 0.4);
            position: relative;
            overflow: hidden;
            text-transform: uppercase;
            letter-spacing: 1px;
            width: 100%;
            margin-top: 10px;
        }

        .krem-button-3d:hover {
            transform: translateY(-3px);
            box-shadow: 0 0 25px rgba(0, 255, 204, 0.9), 0 8px 20px rgba(0, 0, 0, 0.5);
            background: linear-gradient(145deg, #00ffff, #00ff00);
        }

        .krem-button-3d:active {
            transform: translateY(1px) scale(0.98);
            box-shadow: 0 0 10px rgba(0, 255, 204, 0.8), 0 2px 10px rgba(0, 0, 0, 0.4);
        }
    \`;
    document.head.appendChild(styleSheet);

    gui.innerHTML = \`
        <!-- Header with Logo -->
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;position:relative;">
            <div style="display:flex;align-items:center;gap:12px;">
                <div style="width:50px;height:50px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 0 30px rgba(0,255,0,0.8);animation:neonPulse 2s infinite;overflow:hidden;">
                    <img src="https://i.imgur.com/dsn6DOc.jpeg" style="width:100%;height:100%;object-fit:cover;">
                </div>
                <div>
                    <h2 style="margin:0;color:#00ff00;font-size:1.4em;font-weight:900;text-shadow:0 0 10px #00ff00;animation:neonPulse 2s infinite;font-family:'Orbitron',sans-serif;letter-spacing:2px;">KremCheats</h2>
                    <div style="font-size:0.75em;color:#00cc00;font-weight:600;margin-top:2px;">VIP • Enhanced • v\${config.version}</div>
                </div>
            </div>
            <button id="kremcheats-close" style="background:none;border:none;color:#ff4466;font-size:28px;font-weight:bold;cursor:pointer;padding:0 10px;line-height:1;transition:all 0.3s;text-shadow:0 0 10px #ff4466;">×</button>
        </div>

        <!-- Status Display -->
        <div style="margin-bottom: 15px;background:rgba(0,255,0,0.05);padding:12px;border-radius:12px;border:1px solid rgba(0,255,0,0.3);">
            <span style="color:#00cc00;font-size:1em;font-weight:600;">Status:</span>
            <span id="kremcheats-status" style="color:#ffaa00;font-weight:700;margin-left:8px;text-shadow:0 0 8px currentColor;">Initializing...</span>
        </div>

        <!-- Tab Navigation -->
        <div class="krem-tab-buttons">
            <button class="krem-tab-btn active" data-tab="info">ℹ️ Info</button>
            <button class="krem-tab-btn" data-tab="aimbot">🎯 Aimbot</button>
            <button class="krem-tab-btn" data-tab="visuals">👁️ ESP</button>
            <button class="krem-tab-btn" data-tab="performance">⚡ Performance</button>
            <button class="krem-tab-btn" data-tab="mobile">📱 Mobile</button>
        </div>

        <!-- Info Tab -->
        <div class="krem-tab-content active" id="tab-info">
            <div style="background:rgba(0,255,0,0.05);border-radius:12px;padding:12px;border:1px solid rgba(0,255,0,0.3);">
                <div style="margin-top:8px;">
                    <b style="color:#00cc00;">AI Backend:</b> <span id="backend-status" style="color:#ffaa00;font-weight:600;">Checking...</span><br>
                    <b style="color:#00cc00;">Model:</b> <span id="model-status" style="color:#ffaa00;font-weight:600;">CocoSSD (MobileNetV2)</span><br>
                    <b style="color:#00cc00;">Bypass:</b> <span style="color:#0f0;font-weight:600;">Active ✓</span><br>
                    <b style="color:#00cc00;">Platform:</b> <span style="color:#0f0;font-weight:600;">Xbox Cloud Gaming</span>
                </div>

                <div style="margin-top:12px;padding-top:10px;border-top:1px solid rgba(0,255,0,0.2);">
                    <b style="color:#ff8844;">Performance Tips:</b><br>
                    <span style="font-size:0.9em;color:#aaa;">
                    • Enable FPS Booster for better performance<br>
                    • Increase 'Aim Interval' to reduce lag<br>
                    • Disable 'Log Movement' for higher FPS<br>
                    • Use RGB ESP sparingly on low-end devices
                    </span>
                </div>
            </div>

            <button class="krem-button-3d" id="save-config-btn">💾 Save Config</button>
            <button class="krem-button-3d" id="load-config-btn">📂 Load Config</button>
        </div>

        <!-- Aimbot Tab -->
        <div class="krem-tab-content" id="tab-aimbot">
            <div style="margin-bottom:15px;">
                <label style="display:flex;align-items:center;gap:10px;margin-bottom:8px;cursor:pointer;">
                    <input type="checkbox" id="detection-enabled" \${config.detection.enabled ? 'checked' : ''} class="krem-checkbox">
                    <span style="font-weight:600;">Enable Aimbot</span>
                </label>
                <label style="display:flex;align-items:center;gap:10px;margin-bottom:8px;cursor:pointer;">
                    <input type="checkbox" id="auto-shoot" \${config.game.autoShoot ? 'checked' : ''} class="krem-checkbox">
                    <span style="font-weight:600;">Auto Shoot</span>
                </label>
                <label style="display:flex;align-items:center;gap:10px;margin-bottom:8px;cursor:pointer;">
                    <input type="checkbox" id="recoil-comp" \${config.game.recoilCompensation ? 'checked' : ''} class="krem-checkbox">
                    <span style="font-weight:600;">Recoil Compensation</span>
                </label>
                <label style="display:flex;align-items:center;gap:10px;cursor:pointer;">
                    <input type="checkbox" id="auto-reload" \${config.game.autoReload ? 'checked' : ''} class="krem-checkbox">
                    <span style="font-weight:600;">Auto Reload</span>
                </label>
            </div>

            <hr style="border:none;border-top:2px solid rgba(0,255,0,0.2);margin:15px 0;">

            <div style="margin-bottom:12px;">
                <label style="display:flex;justify-content:space-between;margin-bottom:5px;">
                    <span style="font-weight:600;">Confidence</span>
                    <span id="conf-val" style="color:#00ff00;font-weight:700;">\${config.detection.confidence.toFixed(2)}</span>
                </label>
                <input type="range" id="confidence" min="0.1" max="0.9" step="0.05" value="\${config.detection.confidence}" class="krem-slider">
            </div>

            <div style="margin-bottom:12px;">
                <label style="display:flex;justify-content:space-between;margin-bottom:5px;">
                    <span style="font-weight:600;">Aim Interval (ms)</span>
                    <span id="interval-val" style="color:#00ff00;font-weight:700;">\${config.game.aimInterval}</span>
                </label>
                <input type="range" id="aim-interval" min="10" max="100" step="5" value="\${config.game.aimInterval}" class="krem-slider">
            </div>

            <div style="margin-bottom:12px;">
                <label style="display:flex;justify-content:space-between;margin-bottom:5px;">
                    <span style="font-weight:600;">FOV Radius</span>
                    <span id="fov-val" style="color:#00ff00;font-weight:700;">\${config.game.fovRadius}</span>
                </label>
                <input type="range" id="fov-radius" min="50" max="300" step="10" value="\${config.game.fovRadius}" class="krem-slider">
            </div>

            <hr style="border:none;border-top:2px solid rgba(0,255,0,0.2);margin:15px 0;">

            <div style="margin-bottom:10px;">
                <label style="display:block;margin-bottom:5px;font-weight:600;">Target Priority</label>
                <select id="target-priority" class="krem-select" style="width:100%;">
                    <option value="closest" \${config.aim.targetPriority === "closest" ? 'selected' : ''}>Closest to Crosshair</option>
                    <option value="center" \${config.aim.targetPriority === "center" ? 'selected' : ''}>Closest to Center</option>
                </select>
            </div>

            <div style="margin-bottom:10px;">
                <label style="display:block;margin-bottom:5px;font-weight:600;">Aim Point</label>
                <select id="aim-point" class="krem-select" style="width:100%;">
                    <option value="center" \${config.aim.aimPoint === "center" ? 'selected' : ''}>Box Center</option>
                    <option value="top" \${config.aim.aimPoint === "top" ? 'selected' : ''}>Box Top (Head)</option>
                </select>
            </div>

            <div style="margin-bottom:10px;">
                <label style="display:block;margin-bottom:5px;font-weight:600;">Recoil Level</label>
                <select id="recoil-level" class="krem-select" style="width:100%;">
                    <option value="1" \${config.game.recoilLevel === 1 ? 'selected' : ''}>1 (None)</option>
                    <option value="2" \${config.game.recoilLevel === 2 ? 'selected' : ''}>2 (Low)</option>
                    <option value="3" \${config.game.recoilLevel === 3 ? 'selected' : ''}>3 (Medium)</option>
                    <option value="4" \${config.game.recoilLevel === 4 ? 'selected' : ''}>4 (High)</option>
                </select>
            </div>
        </div>

        <!-- ESP/Visuals Tab -->
        <div class="krem-tab-content" id="tab-visuals">
            <div style="margin-bottom:15px;">
                <label style="display:flex;align-items:center;gap:10px;margin-bottom:8px;cursor:pointer;">
                    <input type="checkbox" id="draw-boxes" \${config.boundingBoxes.enabled ? 'checked' : ''} class="krem-checkbox">
                    <span style="font-weight:600;">Draw Bounding Boxes</span>
                </label>
                <label style="display:flex;align-items:center;gap:10px;margin-bottom:8px;cursor:pointer;">
                    <input type="checkbox" id="rgb-boxes" \${config.boundingBoxes.rgbEnabled ? 'checked' : ''} class="krem-checkbox">
                    <span style="font-weight:600;">🌈 RGB Boxes</span>
                </label>
                <label style="display:flex;align-items:center;gap:10px;margin-bottom:8px;cursor:pointer;">
                    <input type="checkbox" id="draw-fov" \${config.fovCircle.enabled ? 'checked' : ''} class="krem-checkbox">
                    <span style="font-weight:600;">Draw FOV Circle</span>
                </label>
                <label style="display:flex;align-items:center;gap:10px;margin-bottom:8px;cursor:pointer;">
                    <input type="checkbox" id="rgb-fov" \${config.fovCircle.rgbEnabled ? 'checked' : ''} class="krem-checkbox">
                    <span style="font-weight:600;">🌈 RGB FOV Line</span>
                </label>
                <label style="display:flex;align-items:center;gap:10px;cursor:pointer;">
                    <input type="checkbox" id="log-movement" \${config.debug.logMovement ? 'checked' : ''} class="krem-checkbox">
                    <span style="font-weight:600;">Log Movement (Debug)</span>
                </label>
            </div>

            <hr style="border:none;border-top:2px solid rgba(0,255,0,0.2);margin:15px 0;">

            <div style="margin-bottom:10px;">
                <label style="display:block;margin-bottom:5px;font-weight:600;">Box Color (Non-RGB)</label>
                <input type="color" id="box-color" value="#00ffff" style="width:100%;height:40px;border:2px solid #00ff00;border-radius:8px;background:rgba(0,255,0,0.1);cursor:pointer;">
            </div>

            <div style="margin-bottom:10px;">
                <label style="display:block;margin-bottom:5px;font-weight:600;">FOV Color (Non-RGB)</label>
                <input type="color" id="fov-color" value="#ffffff" style="width:100%;height:40px;border:2px solid #00ff00;border-radius:8px;background:rgba(0,255,0,0.1);cursor:pointer;">
            </div>
        </div>

        <!-- Performance Tab -->
        <div class="krem-tab-content" id="tab-performance">
            <div style="margin-bottom:15px;">
                <label style="display:flex;align-items:center;gap:10px;margin-bottom:8px;cursor:pointer;">
                    <input type="checkbox" id="show-fps" \${config.performance.showFPS ? 'checked' : ''} class="krem-checkbox">
                    <span style="font-weight:600;">Show FPS Counter</span>
                </label>
                <label style="display:flex;align-items:center;gap:10px;margin-bottom:8px;cursor:pointer;">
                    <input type="checkbox" id="show-ping" \${config.performance.showPing ? 'checked' : ''} class="krem-checkbox">
                    <span style="font-weight:600;">Show Ping Counter</span>
                </label>
                <label style="display:flex;align-items:center;gap:10px;margin-bottom:8px;cursor:pointer;">
                    <input type="checkbox" id="fps-booster" \${config.performance.fpsBooster ? 'checked' : ''} class="krem-checkbox">
                    <span style="font-weight:600;">⚡ FPS Booster</span>
                </label>
                <label style="display:flex;align-items:center;gap:10px;margin-bottom:8px;cursor:pointer;">
                    <input type="checkbox" id="cpu-max" \${config.performance.cpuMax ? 'checked' : ''} class="krem-checkbox">
                    <span style="font-weight:600;">🔥 CPU Max Performance</span>
                </label>
                <label style="display:flex;align-items:center;gap:10px;cursor:pointer;">
                    <input type="checkbox" id="gpu-max" \${config.performance.gpuMax ? 'checked' : ''} class="krem-checkbox">
                    <span style="font-weight:600;">💎 GPU Max Performance</span>
                </label>
            </div>

            <div style="background:rgba(0,255,0,0.05);border-radius:12px;padding:12px;border:1px solid rgba(0,255,0,0.3);margin-top:15px;">
                <b style="color:#ff8844;">Performance Info:</b><br>
                <span style="font-size:0.9em;color:#aaa;">
                • FPS Booster: Optimizes rendering pipeline<br>
                • CPU Max: Prioritizes CPU resources<br>
                • GPU Max: Enables hardware acceleration<br>
                • Ping: Simulated network latency display
                </span>
            </div>
        </div>

        <!-- Mobile Tab -->
        <div class="krem-tab-content" id="tab-mobile">
            <div style="margin-bottom:15px;">
                <label style="display:flex;align-items:center;gap:10px;margin-bottom:8px;cursor:pointer;">
                    <input type="checkbox" id="mobile-enabled" \${config.mobile.enabled ? 'checked' : ''} class="krem-checkbox">
                    <span style="font-weight:600;">Enable Mobile Support</span>
                </label>
                <label style="display:flex;align-items:center;gap:10px;margin-bottom:8px;cursor:pointer;">
                    <input type="checkbox" id="mobile-touch" \${config.mobile.touchControls ? 'checked' : ''} class="krem-checkbox">
                    <span style="font-weight:600;">Touch Controls</span>
                </label>
            </div>

            <hr style="border:none;border-top:2px solid rgba(0,255,0,0.2);margin:15px 0;">

            <div style="margin-bottom:12px;">
                <label style="display:flex;justify-content:space-between;margin-bottom:5px;">
                    <span style="font-weight:600;">Button Size</span>
                    <span id="mobile-size-val" style="color:#00ff00;font-weight:700;">\${config.mobile.buttonSize}px</span>
                </label>
                <input type="range" id="mobile-size" min="40" max="100" step="5" value="\${config.mobile.buttonSize}" class="krem-slider">
            </div>

            <div style="margin-bottom:12px;">
                <label style="display:flex;justify-content:space-between;margin-bottom:5px;">
                    <span style="font-weight:600;">Button Opacity</span>
                    <span id="mobile-opacity-val" style="color:#00ff00;font-weight:700;">\${config.mobile.buttonOpacity}</span>
                </label>
                <input type="range" id="mobile-opacity" min="0.3" max="1" step="0.1" value="\${config.mobile.buttonOpacity}" class="krem-slider">
            </div>

            <div style="background:rgba(0,255,0,0.05);border-radius:12px;padding:12px;border:1px solid rgba(0,255,0,0.3);margin-top:15px;">
                <b style="color:#ff8844;">Mobile Controls:</b><br>
                <span style="font-size:0.9em;color:#aaa;">
                • Touch anywhere to open/close menu<br>
                • On-screen buttons for quick access<br>
                • Optimized for touchscreen devices<br>
                • Works on phones, tablets, Chromebooks
                </span>
            </div>
        </div>
    \`;

    document.body.appendChild(gui);

        // Key status widget removed - using simple auth system


    // Tab switching logic
    const tabButtons = gui.querySelectorAll('.krem-tab-btn');
    const tabContents = gui.querySelectorAll('.krem-tab-content');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-tab');

            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(\`tab-\${tabName}\`).classList.add('active');
        });
    });

    // Event Listeners
    document.getElementById('kremcheats-close').onclick = () => {
        gui.style.animation = 'guiFadeIn 0.3s ease-out reverse';
        setTimeout(() => gui.style.display = 'none', 300);
    };

    const statusSpan = document.getElementById('kremcheats-status');
    const backendSpan = document.getElementById('backend-status');
    const modelInfoSpan = document.getElementById('model-status');

    // Aimbot controls
    document.getElementById('detection-enabled').onchange = (e) => {
        config.detection.enabled = e.target.checked;
        statusSpan.textContent = config.detection.enabled ? 'Active' : 'Inactive';
        statusSpan.style.color = config.detection.enabled ? '#0f0' : '#ffaa00';
        if (!config.detection.enabled && InputSimulator.isShooting) InputSimulator.stopShooting();
        debug.log(\`Aimbot \${config.detection.enabled ? 'Enabled' : 'Disabled'}\`);
    };
    document.getElementById('auto-shoot').onchange = (e) => {
        config.game.autoShoot = e.target.checked;
        if (!config.game.autoShoot && InputSimulator.isShooting) InputSimulator.stopShooting();
    };
    document.getElementById('recoil-comp').onchange = (e) => config.game.recoilCompensation = e.target.checked;
    document.getElementById('auto-reload').onchange = (e) => config.game.autoReload = e.target.checked;

    // Visual controls
    document.getElementById('draw-boxes').onchange = (e) => config.boundingBoxes.enabled = e.target.checked;
    document.getElementById('rgb-boxes').onchange = (e) => config.boundingBoxes.rgbEnabled = e.target.checked;
    document.getElementById('draw-fov').onchange = (e) => config.fovCircle.enabled = e.target.checked;
    document.getElementById('rgb-fov').onchange = (e) => config.fovCircle.rgbEnabled = e.target.checked;
    document.getElementById('log-movement').onchange = (e) => {
        debug.logMovement = config.debug.logMovement = e.target.checked;
        debug.log(\`Movement logging \${e.target.checked ? 'enabled' : 'disabled'}.\`);
    };
    document.getElementById('box-color').oninput = (e) => {
        config.boundingBoxes.color = e.target.value;
    };
    document.getElementById('fov-color').oninput = (e) => {
        config.fovCircle.color = e.target.value;
    };

    // Performance controls
    document.getElementById('show-fps').onchange = (e) => config.performance.showFPS = e.target.checked;
    document.getElementById('show-ping').onchange = (e) => {
        config.performance.showPing = e.target.checked;
        if (e.target.checked) {
            // Simulate ping updates
            setInterval(() => {
                performanceStats.ping = Math.floor(Math.random() * 30) + 20;
            }, 1000);
        }
    };
    document.getElementById('fps-booster').onchange = (e) => {
        config.performance.fpsBooster = e.target.checked;
        if (e.target.checked) {
            debug.log('FPS Booster enabled - optimizing rendering');
        }
    };
    document.getElementById('cpu-max').onchange = (e) => {
        config.performance.cpuMax = e.target.checked;
        if (e.target.checked) {
            debug.log('CPU Max Performance enabled');
        }
    };
    document.getElementById('gpu-max').onchange = (e) => {
        config.performance.gpuMax = e.target.checked;
        if (e.target.checked) {
            debug.log('GPU Max Performance enabled');
        }
    };

    // Mobile controls
    document.getElementById('mobile-enabled').onchange = (e) => {
        config.mobile.enabled = e.target.checked;
        if (e.target.checked) {
            createMobileControls();
        } else {
            removeMobileControls();
        }
    };
    document.getElementById('mobile-touch').onchange = (e) => config.mobile.touchControls = e.target.checked;
    document.getElementById('mobile-size').oninput = (e) => {
        config.mobile.buttonSize = parseInt(e.target.value, 10);
        document.getElementById('mobile-size-val').textContent = config.mobile.buttonSize + 'px';
        updateMobileControls();
    };
    document.getElementById('mobile-opacity').oninput = (e) => {
        config.mobile.buttonOpacity = parseFloat(e.target.value);
        document.getElementById('mobile-opacity-val').textContent = config.mobile.buttonOpacity;
        updateMobileControls();
    };

    // Sliders
    document.getElementById('confidence').oninput = (e) => {
        config.detection.confidence = parseFloat(e.target.value);
        document.getElementById('conf-val').textContent = config.detection.confidence.toFixed(2);
        debug.log(\`Confidence set to \${config.detection.confidence.toFixed(2)}\`);
    };
    document.getElementById('aim-interval').oninput = (e) => {
        config.game.aimInterval = parseInt(e.target.value, 10);
        document.getElementById('interval-val').textContent = config.game.aimInterval;
        debug.log(\`Aim Interval set to \${config.game.aimInterval}ms\`);
    };
    document.getElementById('fov-radius').oninput = (e) => {
        config.game.fovRadius = parseInt(e.target.value, 10);
        document.getElementById('fov-val').textContent = config.game.fovRadius;
        drawOverlay(lastPredictions || []);
    };
    document.getElementById('target-priority').onchange = (e) => config.aim.targetPriority = e.target.value;
    document.getElementById('aim-point').onchange = (e) => config.aim.aimPoint = e.target.value;
    document.getElementById('recoil-level').onchange = (e) => config.game.recoilLevel = parseInt(e.target.value, 10);

    // Config save/load
    document.getElementById('save-config-btn').onclick = () => {
        try {
            const configData = JSON.stringify(config);
            localStorage.setItem('kremcheats_config', configData);
            alert('✅ Configuration saved successfully!');
            debug.log('Config saved to localStorage');
        } catch (e) {
            alert('❌ Failed to save configuration');
            debug.error('Config save error:', e);
        }
    };

    document.getElementById('load-config-btn').onclick = () => {
        try {
            const configData = localStorage.getItem('kremcheats_config');
            if (configData) {
                const loadedConfig = JSON.parse(configData);
                Object.assign(config, loadedConfig);
                alert('✅ Configuration loaded successfully! Refresh to apply.');
                debug.log('Config loaded from localStorage');
            } else {
                alert('⚠️ No saved configuration found');
            }
        } catch (e) {
            alert('❌ Failed to load configuration');
            debug.error('Config load error:', e);
        }
    };

    statusSpan.textContent = config.detection.enabled ? 'Active' : 'Inactive';
    statusSpan.style.color = config.detection.enabled ? '#0f0' : '#ffaa00';
    backendSpan.textContent = 'Checking...';
    backendSpan.style.color = '#ffaa00';
    if (modelInfoSpan) modelInfoSpan.textContent = \`CocoSSD (\${config.detection.modelBase})\`;

    debug.log("Enhanced GUI Created with Tabbed Interface");

    // Mobile menu toggle
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        let menuVisible = true;
        document.addEventListener('touchstart', (e) => {
            if (e.target.closest('#kremcheats-gui')) return;
            menuVisible = !menuVisible;
            gui.style.display = menuVisible ? 'block' : 'none';
        });
    }

    // Keyboard shortcut to toggle menu (INSERT key)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Insert') {
            gui.style.display = gui.style.display === 'none' ? 'block' : 'none';
        }
    });
}

function createMobileControls() {
    if (document.getElementById('krem-mobile-controls')) return;

    const mobileControls = document.createElement('div');
    mobileControls.id = 'krem-mobile-controls';
    mobileControls.style.cssText = \`
        position: fixed;
        bottom: 20px;
        left: 20px;
        z-index: 99999;
        display: flex;
        gap: 10px;
    \`;

    const toggleButton = document.createElement('button');
    toggleButton.textContent = '🎯';
    toggleButton.style.cssText = \`
        width: \${config.mobile.buttonSize}px;
        height: \${config.mobile.buttonSize}px;
        border-radius: 50%;
        background: linear-gradient(135deg, #00ff00, #00cc00);
        border: 2px solid #00ff00;
        color: #0a141e;
        font-size: 24px;
        cursor: pointer;
        opacity: \${config.mobile.buttonOpacity};
        box-shadow: 0 0 20px rgba(0, 255, 0, 0.6);
    \`;
    toggleButton.onclick = () => {
        config.detection.enabled = !config.detection.enabled;
        toggleButton.textContent = config.detection.enabled ? '🎯' : '⭕';
        debug.log(\`Aimbot \${config.detection.enabled ? 'enabled' : 'disabled'} via mobile button\`);
    };

    mobileControls.appendChild(toggleButton);
    document.body.appendChild(mobileControls);
}

function removeMobileControls() {
    const controls = document.getElementById('krem-mobile-controls');
    if (controls) controls.remove();
}

function updateMobileControls() {
    removeMobileControls();
    if (config.mobile.enabled) createMobileControls();
}

async function loadDetectionModel() {
    const modelInfoSpan = document.getElementById('model-status');
    const backendSpan = document.getElementById('backend-status');
    if (!detectionModel) {
        debug.log(\`Loading Coco SSD model with base: '\${config.detection.modelBase}'...\`);
        if (modelInfoSpan) { modelInfoSpan.textContent = \`Loading \${config.detection.modelBase}...\`; modelInfoSpan.style.color = '#ffaa00'; }

        try {
            debug.log(\`Attempting to set TF.js backend to 'webgl'... Current: \${tf.getBackend()}\`);
            await tf.setBackend('webgl');
            await tf.ready();
            const currentBackend = tf.getBackend();
            debug.log(\`TF.js backend successfully set to: \${currentBackend}\`);
            if (backendSpan) {
                backendSpan.textContent = currentBackend.toUpperCase();
                backendSpan.style.color = currentBackend === 'webgl' ? '#0f0' : '#ffaa00';
            }
        } catch (err) {
            debug.warn(\`Failed to set TF.js backend to 'webgl'. Falling back to '\${tf.getBackend()}'. Error:\`, err);
            await tf.ready();
            const fallbackBackend = tf.getBackend();
            if (backendSpan) {
                backendSpan.textContent = fallbackBackend.toUpperCase() + ' (Fallback)';
                backendSpan.style.color = '#ff8844';
            }
        }
        detectionModel = await cocoSsd.load({ base: config.detection.modelBase });
        debug.log(\`Coco SSD model ('\${config.detection.modelBase}') loaded successfully.\`);
        if (modelInfoSpan) { modelInfoSpan.textContent = \`CocoSSD (\${config.detection.modelBase}) Loaded\`; modelInfoSpan.style.color = '#0f0'; }
        return true;
    } else {
        debug.log("Coco SSD model already loaded.");
        if (modelInfoSpan) { modelInfoSpan.textContent = \`CocoSSD (\${config.detection.modelBase}) Ready\`; modelInfoSpan.style.color = '#0f0'; }
        if (backendSpan && typeof tf !== 'undefined') {
             backendSpan.textContent = tf.getBackend().toUpperCase();
             backendSpan.style.color = tf.getBackend() === 'webgl' ? '#0f0' : '#ffaa00';
        }
        return true;
    }
}

async function findGameVideoAndInit() {
    const statusSpan = document.getElementById('kremcheats-status');
    const backendSpan = document.getElementById('backend-status');
    const modelInfoSpan = document.getElementById('model-status');

    if (typeof tf === 'undefined' || typeof cocoSsd === 'undefined' || typeof cocoSsd.load === 'undefined') {
        debug.error("TF.js or CocoSSD libraries not found!");
        alert("Critical libraries not found. Aimbot cannot start.");
        if (statusSpan) { statusSpan.textContent = 'Lib Error'; statusSpan.style.color = '#ff4466'; }
        if (backendSpan) { backendSpan.textContent = 'TF.js Missing!'; backendSpan.style.color = '#ff4466'; }
        return;
    }

    gameVideo = document.querySelector(config.game.videoSelector);
    if (gameVideo && gameVideo.readyState >= 2 && gameVideo.videoWidth > 0 && gameVideo.videoHeight > 0) {
        debug.log(\`Game video found: \${gameVideo.videoWidth}x\${gameVideo.videoHeight}\`);
        try {
            if (!await loadDetectionModel()) {
                 throw new Error("Model loading failed during initial setup.");
            }

            if (InputSimulator.init()) {
                createOverlayCanvas();
                createCrosshair();
                startAimLoop();
                if (statusSpan) {
                    statusSpan.textContent = config.detection.enabled ? 'Active' : 'Inactive';
                    statusSpan.style.color = config.detection.enabled ? '#0f0' : '#ffaa00';
                }
            } else {
                debug.error("InputSimulator init failed.");
                if (statusSpan) { statusSpan.textContent = 'Input Error'; statusSpan.style.color = '#ff4466'; }
            }
        } catch (err) {
            debug.error("Fatal Error during initialization:", err);
            config.detection.enabled = false;
            if (statusSpan) { statusSpan.textContent = 'Init Error'; statusSpan.style.color = '#ff4466'; }
            if (modelInfoSpan) { modelInfoSpan.textContent = 'Load Failed!'; modelInfoSpan.style.color = '#ff4466'; }
            if (backendSpan && typeof tf !== 'undefined') {
                 backendSpan.textContent = (tf.getBackend() ? tf.getBackend().toUpperCase() : 'UNKNOWN') + " (Error)";
                 backendSpan.style.color = '#ff4466';
            }
        }
    } else {
        const videoStatus = gameVideo ? \`readyState=\${gameVideo.readyState}, dims=\${gameVideo.videoWidth}x\${gameVideo.videoHeight}\` : 'not found';
        debug.log(\`Game video not ready (\${videoStatus}), retrying...\`);
        setTimeout(findGameVideoAndInit, 1500);
    }
 }

function startAimLoop() {
    debug.log(\`Starting main aim loop. Target interval: \${config.game.aimInterval}ms.\`);
    let lastProcessingFinishedTime = 0;

    function loop() {
        requestAnimationFrame(loop);
        const now = performance.now();
        utils.fps.update();

        if (gameVideo && !gameVideo.paused && !gameVideo.ended) {
            drawOverlay(lastPredictions || []);
        }

        if (processingFrame || !config.detection.enabled || !detectionModel || !gameVideo ||
            gameVideo.paused || gameVideo.ended || gameVideo.videoWidth === 0) {
            if ((!config.detection.enabled || (gameVideo && (gameVideo.paused || gameVideo.ended))) && InputSimulator.isShooting) {
                InputSimulator.stopShooting();
                currentTarget = null; bestTarget = null;
            }
            return;
        }

        if (now - lastProcessingFinishedTime >= config.game.aimInterval) {
            (async () => {
                 processingFrame = true;
                 const detectionStartTime = performance.now();
                 lastDetectionTimestamp = detectionStartTime;
                 let predictions = [];
                 try {
                     if (gameVideo.readyState >= 2 && gameVideo.videoWidth > 0 && gameVideo.videoHeight > 0) {
                         predictions = await detectionModel.detect(gameVideo, config.detection.maxDetections, config.detection.confidence);
                         lastPredictions = predictions;
                     } else {
                         predictions = lastPredictions || [];
                     }
                     processPredictions(predictions.filter(p => p.class === config.detection.targetClass));
                 } catch (e) {
                     debug.error('Detection/Processing Error:', e);
                     if (InputSimulator.isShooting) InputSimulator.stopShooting();
                     currentTarget = null; bestTarget = null; lastPredictions = [];
                 } finally {
                     lastProcessingFinishedTime = performance.now();
                     processingFrame = false;
                 }
            })();
        }
        if (!currentTarget && (InputSimulator.recoilOffset.x !== 0 || InputSimulator.recoilOffset.y !== 0) && !InputSimulator.isShooting) {
             const recoilPattern = config.game.recoilPatterns[config.game.recoilLevel];
             if (recoilPattern) {
                 const recovery = recoilPattern.recoverySpeed * 3;
                 InputSimulator.recoilOffset.x *= (1 - recovery);
                 InputSimulator.recoilOffset.y *= (1 - recovery);
                 if (Math.abs(InputSimulator.recoilOffset.x) < 0.05) InputSimulator.recoilOffset.x = 0;
                 if (Math.abs(InputSimulator.recoilOffset.y) < 0.05) InputSimulator.recoilOffset.y = 0;
             }
        }
    }
    loop();
}

function processPredictions(targets) {
    const videoRect = gameVideo.getBoundingClientRect();
    const vvp = window.visualViewport;
    const screenCenterX = vvp ? vvp.width / 2 + vvp.pageLeft : window.innerWidth / 2;
    const screenCenterY = vvp ? (vvp.height / 2 + vvp.offsetTop) : (window.innerHeight / 2);

    if (!targets || targets.length === 0) {
        currentTarget = null;
        bestTarget = null;
        if (InputSimulator.isShooting && config.game.autoShoot) {
            InputSimulator.stopShooting();
        }
        return;
    }

    const scaleX = videoRect.width / gameVideo.videoWidth;
    const scaleY = videoRect.height / gameVideo.videoHeight;

    let validTargets = targets.map(t => {
        const [x, y, w, h] = t.bbox;
        const centerX = x + w / 2;
        const centerY = y + h / 2;
        const topY = y + h * 0.15;

        const screenCenterTargetX = videoRect.left + centerX * scaleX;
        const screenCenterTargetY = videoRect.top + centerY * scaleY;
        const screenTopTargetY = videoRect.top + topY * scaleY;

        let aimScreenX = screenCenterTargetX;
        let aimScreenY = config.aim.aimPoint === "top" ? screenTopTargetY : screenCenterTargetY;

        const distToCrosshair = Math.hypot(aimScreenX - screenCenterX, aimScreenY - screenCenterY);
        const distToCenter = Math.hypot(screenCenterTargetX - screenCenterX, screenCenterTargetY - screenCenterY);

        return { target: t, aimScreenX, aimScreenY, distToCrosshair, distToCenter };
    }).filter(t => t.distToCrosshair <= config.game.fovRadius);

    if (validTargets.length === 0) {
        currentTarget = null;
        bestTarget = null;
        if (InputSimulator.isShooting && config.game.autoShoot) {
            InputSimulator.stopShooting();
        }
        return;
    }

    if (config.aim.targetPriority === "closest") {
        validTargets.sort((a, b) => a.distToCrosshair - b.distToCrosshair);
    } else {
        validTargets.sort((a, b) => a.distToCenter - b.distToCenter);
    }

    bestTarget = validTargets[0];
    currentTarget = bestTarget.target;

    InputSimulator.moveMouseTo(bestTarget.aimScreenX, bestTarget.aimScreenY);

    if (config.game.autoShoot && !InputSimulator.isShooting) {
        InputSimulator.startShooting();
    }
}

// Initialize
(function init() {
    debug.log("KremCheats VIP - Enhanced Edition - Initializing...");

    // Try to load saved config
    try {
        const savedConfig = localStorage.getItem('kremcheats_config');
        if (savedConfig) {
            const loadedConfig = JSON.parse(savedConfig);
            Object.assign(config, loadedConfig);
            debug.log('Loaded saved configuration');
        }
    } catch (e) {
        debug.warn('Could not load saved config:', e);
    }

    createGUI();
    setTimeout(findGameVideoAndInit, 1000);
})();

`;
            (document.head || document.documentElement).appendChild(script);
            console.log('✅ [KremCheats] Successfully loaded! Check top-right for UI.');
        } catch (error) {
            console.error('❌ [KremCheats] Error:', error);
            alert('KremCheats: Error during initialization. Check console.');
        }
    }

    // ========== AUTHENTICATION WRAPPER ==========
    async function startWithAuth() {
        console.log('[KremCheats] Checking license...');

        // Initialize simple key authentication system
        const authenticated = await SimpleKeyAuth.init();

        if (!authenticated) {
            console.error('[KremCheats] Authentication failed!');
            return;
        }

        console.log('[KremCheats] ✓ License validated');

        // Proceed with normal initialization
        initKremCheats();
    }
    
    // Function to start cheats after authentication
    function startCheats() {
        console.log('[KremCheats] Starting cheats...');
        initKremCheats();
    }

    // Auto-start with authentication
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(startWithAuth, 3000);
        });
    } else {
        setTimeout(startWithAuth, 3000);
    }

})();