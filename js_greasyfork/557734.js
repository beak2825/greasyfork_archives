// ==UserScript==
// @name         Destiny V1
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  The best cheat for Deadshot.io
// @match        *://*deadshot.io/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557734/Destiny%20V1.user.js
// @updateURL https://update.greasyfork.org/scripts/557734/Destiny%20V1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const defaultConfig = {
        aimbotEnabled: true,
        aimSmooth: 1.5,
        lockDist: 40,
        hitbox: 0,
        priority: 1,
        randomize: false,
        espEnabled: true,
        fov: 100,
        showFov: false,
        showCrosshair: false,
        menuKey: "Insert",
        accentColor: "#00ff00",
        menuVisible: true,
        x: 100,
        y: 100,
        predictionEnabled: true,
        predictionStrength: 2.0,
        velocityTracking: true,
        showDistance: true,
        showTracers: false,
        espThickness: 2,
        triggerBot: false,
        triggerDelay: 100,
        fovGradient: true,
        performanceMode: false,
        showFPS: true,
        showStats: true,
        antiAFK: false,
        aimKey: "RightClick",
        smoothCurve: "ease",
        targetLock: false,
        lockTime: 2000,
        visibilityCheck: true,
        customLogoUrl: "https://i.ibb.co/8gCPHXx5/g5djaezffr9etxvfd-Hb-H5-removebg-preview.png",
        showWelcome: true,
        blockFullscreen: false
    };

    let config = { ...defaultConfig };

    localStorage.removeItem("destiny_v1_config");
    localStorage.removeItem('destiny_welcome_shown');

    const saved = localStorage.getItem("destiny_v1_config");
    if (saved) {
        try { config = { ...config, ...JSON.parse(saved) }; } catch (e) {}
    }

    function save() {
        localStorage.setItem("destiny_v1_config", JSON.stringify(config));
    }

    // =================================================================
    // FULLSCREEN BLOCKER
    // =================================================================
    function setupFullscreenBlocker() {
        if (!config.blockFullscreen) return;

        console.log("[Destiny] Blocking fullscreen API...");

        const block = () => {
            return new Promise((resolve) => {
                console.log("[Destiny] Blocked fullscreen attempt");
                resolve();
            });
        };

        // Override all fullscreen APIs
        Object.defineProperty(Element.prototype, 'requestFullscreen', { value: block, writable: false });
        Object.defineProperty(Element.prototype, 'webkitRequestFullscreen', { value: block, writable: false });
        Object.defineProperty(Element.prototype, 'mozRequestFullScreen', { value: block, writable: false });
        Object.defineProperty(Element.prototype, 'msRequestFullscreen', { value: block, writable: false });
    }

    // Initialize fullscreen blocker immediately
    setupFullscreenBlocker();

    function showWelcomeScreen() {
        if (!config.showWelcome || localStorage.getItem('destiny_welcome_shown')) return;

        const welcome = document.createElement('div');
        welcome.id = 'destiny-welcome';
        welcome.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
            z-index: 2147483647;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.5s ease;
            backdrop-filter: blur(10px);
        `;

        welcome.innerHTML = `
            <div style="text-align: center; animation: slideUp 0.8s ease-out;">
                <img src="${config.customLogoUrl}"
                     style="width: 120px; height: 120px; margin-bottom: 30px; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,255,0,0.3); animation: pulse 2s infinite;"
                     onerror="this.style.display='none'">
                <div style="font-size: 48px; font-weight: 900; color: ${config.accentColor}; margin-bottom: 10px; font-family: 'Segoe UI', sans-serif; letter-spacing: 3px; text-shadow: 0 0 20px ${config.accentColor}80;">
                    DESTINY V32.1
                </div>
                <div style="font-size: 18px; color: #888; margin-bottom: 40px; font-weight: 300; letter-spacing: 2px;">
                    ADVANCED COMBAT SUITE
                </div>
                <div style="background: #111; border: 1px solid #333; border-radius: 12px; padding: 30px 50px; margin-bottom: 40px; box-shadow: 0 5px 30px rgba(0,0,0,0.5);">
                    <div style="display: flex; gap: 40px; justify-content: center; margin-bottom: 25px;">
                        <div style="text-align: center;">
                            <div style="font-size: 32px; color: ${config.accentColor}; font-weight: bold; margin-bottom: 5px;">✓</div>
                            <div style="font-size: 12px; color: #666; text-transform: uppercase;">Aimbot</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 32px; color: ${config.accentColor}; font-weight: bold; margin-bottom: 5px;">✓</div>
                            <div style="font-size: 12px; color: #666; text-transform: uppercase;">ESP</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 32px; color: ${config.accentColor}; font-weight: bold; margin-bottom: 5px;">✓</div>
                            <div style="font-size: 12px; color: #666; text-transform: uppercase;">Prediction</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 32px; color: ${config.accentColor}; font-weight: bold; margin-bottom: 5px;">✓</div>
                            <div style="font-size: 12px; color: #666; text-transform: uppercase;">Auto-Fire</div>
                        </div>
                    </div>
                    <div style="height: 1px; background: linear-gradient(90deg, transparent, #333, transparent); margin: 20px 0;"></div>
                    <div style="color: #aaa; font-size: 13px; line-height: 1.8;">
                        <div style="margin-bottom: 8px;">🎯 <span style="color: white;">Advanced Prediction System</span></div>
                        <div style="margin-bottom: 8px;">👁️ <span style="color: white;">Enhanced ESP with Skeleton</span></div>
                        <div style="margin-bottom: 8px;">⚡ <span style="color: white;">Performance Optimized</span></div>
                        <div>� <span style="color: white;">Maximum Performance Mode</span></div>
                    </div>
                </div>
                <div style="font-size: 14px; color: #666; margin-bottom: 20px;">
                    Press <span style="color: ${config.accentColor}; font-weight: bold;">INSERT</span> to open menu
                </div>
                <button id="welcome-continue" style="
                    background: linear-gradient(135deg, ${config.accentColor}, ${config.accentColor}dd);
                    color: #000;
                    border: none;
                    padding: 15px 60px;
                    font-size: 16px;
                    font-weight: bold;
                    border-radius: 8px;
                    cursor: pointer;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    box-shadow: 0 5px 20px ${config.accentColor}60;
                    transition: all 0.3s ease;
                    font-family: 'Segoe UI', sans-serif;
                " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 30px ${config.accentColor}80';"
                   onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 5px 20px ${config.accentColor}60';">
                    Continue
                </button>
                <div style="margin-top: 30px; font-size: 11px; color: #444;">
                    © 2025 Destiny Suite • Premium Edition
                </div>
            </div>
            <style>
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
            </style>
        `;

        document.body.appendChild(welcome);

        // Fade in
        setTimeout(() => welcome.style.opacity = '1', 50);

        // Continue button
        document.getElementById('welcome-continue').onclick = () => {
            welcome.style.opacity = '0';
            setTimeout(() => {
                welcome.remove();
                localStorage.setItem('destiny_welcome_shown', 'true');
            }, 500);
        };

        // Auto-close after 10 seconds
        setTimeout(() => {
            if (document.getElementById('destiny-welcome')) {
                document.getElementById('welcome-continue').click();
            }
        }, 10000);
    }

    // =================================================================
    // GUI SYSTEM
    // =================================================================
    let currentTab = 'combat';

    function getTabContent() {
        const accent = config.accentColor;

        if (currentTab === 'combat') {
            return `
                <label style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px; cursor:pointer; font-size:10px;">
                    <span>Aimbot</span>
                    <input type="checkbox" id="chk-aim" ${config.aimbotEnabled?'checked':''} style="accent-color:${accent};">
                </label>
                <div style="margin-bottom:3px; color:#888; font-size:9px; display:flex; justify-content:space-between;">
                    <span>Smooth</span><span id="val-smooth" style="color:white;">${config.aimSmooth}</span>
                </div>
                <input type="range" id="sld-smooth" min="1" max="10" step="0.1" value="${config.aimSmooth}" style="width:100%; accent-color:${accent}; height:4px;">

                <label style="display:flex; align-items:center; justify-content:space-between; margin:6px 0; cursor:pointer; font-size:10px;">
                    <span>Prediction</span>
                    <input type="checkbox" id="chk-pred" ${config.predictionEnabled?'checked':''} style="accent-color:${accent};">
                </label>
                <div style="margin-bottom:3px; color:#888; font-size:9px; display:flex; justify-content:space-between;">
                    <span>Strength</span><span id="val-pred" style="color:white;">${config.predictionStrength}</span>
                </div>
                <input type="range" id="sld-pred" min="0.5" max="3" step="0.1" value="${config.predictionStrength}" style="width:100%; accent-color:${accent}; height:4px;">

                <div style="display:flex; gap:6px; margin:8px 0;">
                    <div style="flex:1;">
                        <div style="color:#888; font-size:9px; margin-bottom:2px;">Hitbox</div>
                        <select id="sel-bone" style="width:100%; background:#222; color:white; border:1px solid #444; padding:4px; border-radius:3px; font-size:10px;">
                            <option value="0" ${config.hitbox===0?'selected':''}>Head</option>
                            <option value="1" ${config.hitbox===1?'selected':''}>Neck</option>
                            <option value="2" ${config.hitbox===2?'selected':''}>Body</option>
                        </select>
                    </div>
                    <div style="flex:1;">
                        <div style="color:#888; font-size:9px; margin-bottom:2px;">Priority</div>
                        <select id="sel-prio" style="width:100%; background:#222; color:white; border:1px solid #444; padding:4px; border-radius:3px; font-size:10px;">
                            <option value="1" ${config.priority===1?'selected':''}>Crosshair</option>
                            <option value="0" ${config.priority===0?'selected':''}>Distance</option>
                        </select>
                    </div>
                </div>

                <label style="display:flex; align-items:center; justify-content:space-between; margin:6px 0; cursor:pointer; font-size:10px;">
                    <span>Trigger Bot</span>
                    <input type="checkbox" id="chk-trigger" ${config.triggerBot?'checked':''} style="accent-color:${accent};">
                </label>
                <label style="display:flex; align-items:center; justify-content:space-between; margin:6px 0; cursor:pointer; font-size:10px;">
                    <span>Target Lock</span>
                    <input type="checkbox" id="chk-lock" ${config.targetLock?'checked':''} style="accent-color:${accent};">
                </label>
                <div style="margin-top:8px; font-size:9px; color:#666; text-align:center; padding:4px; background:#111; border-radius:3px;">
                    ID: <span id="id-disp" style="color:${accent}; font-weight:bold;">${state.targetID}</span> <span style="color:#444;">|</span> Arrow Keys
                </div>
            `;
        } else if (currentTab === 'visuals') {
            return `
                <label style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px; cursor:pointer; font-size:10px;">
                    <span>ESP</span>
                    <input type="checkbox" id="chk-esp" ${config.espEnabled?'checked':''} style="accent-color:${accent};">
                </label>
                <label style="display:flex; align-items:center; justify-content:space-between; margin:5px 0; cursor:pointer; font-size:10px;">
                    <span>FOV Circle</span>
                    <input type="checkbox" id="chk-fov" ${config.showFov?'checked':''} style="accent-color:${accent};">
                </label>
                <div style="margin-bottom:3px; color:#888; font-size:9px; display:flex; justify-content:space-between;">
                    <span>Radius</span><span id="val-fov" style="color:white;">${config.fov}</span>
                </div>
                <input type="range" id="sld-fov" min="50" max="600" step="10" value="${config.fov}" style="width:100%; accent-color:${accent}; height:4px;">
                <label style="display:flex; align-items:center; justify-content:space-between; margin:5px 0; cursor:pointer; font-size:10px;">
                    <span>Crosshair</span>
                    <input type="checkbox" id="chk-crosshair" ${config.showCrosshair?'checked':''} style="accent-color:${accent};">
                </label>

                <hr style="border:0; border-top:1px solid #222; margin:8px 0;">

                <label style="display:flex; align-items:center; justify-content:space-between; margin:5px 0; cursor:pointer; font-size:10px;">
                    <span>Distance</span>
                    <input type="checkbox" id="chk-dist" ${config.showDistance?'checked':''} style="accent-color:${accent};">
                </label>
                <label style="display:flex; align-items:center; justify-content:space-between; margin:5px 0; cursor:pointer; font-size:10px;">
                    <span>Tracers</span>
                    <input type="checkbox" id="chk-tracers" ${config.showTracers?'checked':''} style="accent-color:${accent};">
                </label>
                <label style="display:flex; align-items:center; justify-content:space-between; margin:5px 0; cursor:pointer; font-size:10px;">
                    <span>FOV Gradient</span>
                    <input type="checkbox" id="chk-gradient" ${config.fovGradient?'checked':''} style="accent-color:${accent};">
                </label>

                <div style="margin:8px 0 3px; color:#888; font-size:9px; display:flex; justify-content:space-between;">
                    <span>Thickness</span><span id="val-thick" style="color:white;">${config.espThickness}</span>
                </div>
                <input type="range" id="sld-thick" min="1" max="5" step="0.5" value="${config.espThickness}" style="width:100%; accent-color:${accent}; height:4px;">
            `;
        } else if (currentTab === 'advanced') {
            return `
                <label style="display:flex; align-items:center; justify-content:space-between; margin:6px 0; cursor:pointer; font-size:10px;">
                    <span>Velocity Tracking</span>
                    <input type="checkbox" id="chk-velocity" ${config.velocityTracking?'checked':''} style="accent-color:${accent};">
                </label>
                <label style="display:flex; align-items:center; justify-content:space-between; margin:6px 0; cursor:pointer; font-size:10px;">
                    <span>Visibility Check</span>
                    <input type="checkbox" id="chk-visibility" ${config.visibilityCheck?'checked':''} style="accent-color:${accent};">
                </label>
                <label style="display:flex; align-items:center; justify-content:space-between; margin:6px 0; cursor:pointer; font-size:10px;">
                    <span>Anti-AFK</span>
                    <input type="checkbox" id="chk-afk" ${config.antiAFK?'checked':''} style="accent-color:${accent};">
                </label>
                <label style="display:flex; align-items:center; justify-content:space-between; margin:6px 0; cursor:pointer; font-size:10px;">
                    <span>Block Fullscreen</span>
                    <input type="checkbox" id="chk-blockfs" ${config.blockFullscreen?'checked':''} style="accent-color:${accent};">
                </label>
                <div style="font-size:9px; color:#666; margin-left:2px; margin-bottom:8px;">Prevents auto-fullscreen (reload required)</div>

                <hr style="border:0; border-top:1px solid #222; margin:8px 0;">

                <div style="color:#888; font-size:9px; margin-bottom:2px;">Smooth Curve</div>
                <select id="sel-curve" style="width:100%; background:#222; color:white; border:1px solid #444; padding:4px; border-radius:3px; margin-bottom:8px; font-size:10px;">
                    <option value="linear" ${config.smoothCurve==='linear'?'selected':''}>Linear</option>
                    <option value="ease" ${config.smoothCurve==='ease'?'selected':''}>Ease</option>
                    <option value="exponential" ${config.smoothCurve==='exponential'?'selected':''}>Exponential</option>
                </select>

                <button id="btn-reset" style="width:100%; padding:6px; background:#222; color:${accent}; border:1px solid #444; border-radius:3px; cursor:pointer; font-weight:600; margin-top:6px; font-size:10px;">Reset to Defaults</button>
            `;
        } else if (currentTab === 'perf') {
            return `
                <label style="display:flex; align-items:center; justify-content:space-between; margin:10px 0; cursor:pointer;">
                    <span>Show FPS</span>
                    <input type="checkbox" id="chk-fps" ${config.showFPS?'checked':''} style="accent-color:${accent};">
                </label>
                <label style="display:flex; align-items:center; justify-content:space-between; margin:10px 0; cursor:pointer;">
                    <span>Show Stats</span>
                    <input type="checkbox" id="chk-stats" ${config.showStats?'checked':''} style="accent-color:${accent};">
                </label>
                <label style="display:flex; align-items:center; justify-content:space-between; margin:10px 0; cursor:pointer;">
                    <span>Performance Mode</span>
                    <input type="checkbox" id="chk-perfmode" ${config.performanceMode?'checked':''} style="accent-color:${accent};">
                </label>

                <hr style="border:0; border-top:1px solid #333; margin:15px 0;">

                <div style="background:#111; padding:15px; border-radius:4px; border:1px solid #333;">
                    <div style="font-size:11px; color:${accent}; font-weight:bold; margin-bottom:10px; text-transform:uppercase;">Performance Stats</div>
                    <div style="display:flex; justify-content:space-between; margin:5px 0; font-size:12px;">
                        <span style="color:#aaa;">FPS:</span>
                        <span id="stat-fps" style="color:white; font-weight:bold;">${state.fps}</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; margin:5px 0; font-size:12px;">
                        <span style="color:#aaa;">Targets Detected:</span>
                        <span id="stat-targets" style="color:white; font-weight:bold;">${state.totalTargets}</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; margin:5px 0; font-size:12px;">
                        <span style="color:#aaa;">Hit Accuracy:</span>
                        <span id="stat-accuracy" style="color:white; font-weight:bold;">${state.hitCount + state.missCount > 0 ? Math.round(state.hitCount/(state.hitCount+state.missCount)*100) : 0}%</span>
                    </div>
                </div>

                <div style="margin-top:15px; padding:10px; background:#1a1a1a; border-radius:4px; font-size:10px; color:#888; text-align:center;">
                    No anticheat detected - Full performance mode enabled<br>
                    Adjust settings for your preference
                </div>
            `;
        } else if (currentTab === 'help') {
            return `
                <div style="color:#aaa; font-size:13px; line-height:1.8;">
                    <div style="font-size:14px; color:${accent}; font-weight:bold; margin-bottom:15px; text-transform:uppercase;">📖 How to Use</div>

                    <div style="background:#111; padding:15px; border-radius:6px; margin-bottom:15px; border-left:3px solid ${accent};">
                        <div style="color:white; font-weight:bold; margin-bottom:8px;">🎯 Finding the Correct Target ID</div>
                        <div style="font-size:12px; color:#aaa; line-height:1.7;">
                            The Target ID tells the script which game layer contains enemy players.
                            <br><br>
                            <strong style="color:${accent};">Step 1:</strong> Join a game with enemies visible
                            <br>
                            <strong style="color:${accent};">Step 2:</strong> Press <span style="background:#222; padding:2px 6px; border-radius:3px; color:white;">Arrow Right</span> key to increase ID
                            <br>
                            <strong style="color:${accent};">Step 3:</strong> Watch for ESP boxes to appear around enemies
                            <br>
                            <strong style="color:${accent};">Step 4:</strong> When boxes appear = correct ID found!
                            <br>
                            <strong style="color:${accent};">Step 5:</strong> If you go too far, use <span style="background:#222; padding:2px 6px; border-radius:3px; color:white;">Arrow Left</span> to go back
                            <br><br>
                            💡 <strong>Tip:</strong> The ID usually stays the same for each game session.
                        </div>
                    </div>

                    <div style="background:#111; padding:15px; border-radius:6px; margin-bottom:15px; border-left:3px solid ${accent};">
                        <div style="color:white; font-weight:bold; margin-bottom:8px;">⌨️ Keyboard Controls</div>
                        <div style="font-size:12px; color:#aaa; line-height:1.7;">
                            <strong style="color:white;">INSERT / DELETE:</strong> Toggle menu on/off
                            <br>
                            <strong style="color:white;">Arrow Right:</strong> Increase Target ID
                            <br>
                            <strong style="color:white;">Arrow Left:</strong> Decrease Target ID
                            <br>
                            <strong style="color:white;">Right Click:</strong> Activate aimbot (hold)
                        </div>
                    </div>

                    <div style="background:#111; padding:15px; border-radius:6px; margin-bottom:15px; border-left:3px solid ${accent};">
                        <div style="color:white; font-weight:bold; margin-bottom:8px;">⚙️ Quick Setup Guide</div>
                        <div style="font-size:12px; color:#aaa; line-height:1.7;">
                            <strong style="color:${accent};">1.</strong> Enable ESP in Visuals tab
                            <br>
                            <strong style="color:${accent};">2.</strong> Find correct Target ID (see above)
                            <br>
                            <strong style="color:${accent};">3.</strong> Enable Aimbot in Combat tab
                            <br>
                            <strong style="color:${accent};">4.</strong> Adjust smoothing to your preference
                            <br>
                            <strong style="color:${accent};">5.</strong> Enable Prediction for moving targets
                        </div>
                    </div>

                    <div style="background:#1a1a1a; padding:12px; border-radius:6px; border:1px solid #333; text-align:center;">
                        <div style="font-size:11px; color:#666;">
                            Current Target ID: <span style="color:${accent}; font-weight:bold; font-size:14px;">${state.targetID}</span>
                        </div>
                        <div style="font-size:10px; color:#555; margin-top:5px;">
                            Use Arrow Keys to adjust
                        </div>
                    </div>
                </div>
            `;
        }
        return '';
    }

    function createGUI() {
        if (document.getElementById('destiny-simple-ui')) return;

        const div = document.createElement('div');
        div.id = 'destiny-simple-ui';

        div.style.cssText = `
            position: fixed;
            top: ${config.y}px;
            left: ${config.x}px;
            width: ${config.menuWidth || 320}px;
            background: rgba(10, 10, 10, 0.95);
            border: 1px solid ${config.accentColor};
            border-radius: 6px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: white;
            z-index: 2147483646;
            user-select: none;
            display: ${config.menuVisible ? 'block' : 'none'};
            box-shadow: 0 0 20px rgba(0,0,0,0.9);
            backdrop-filter: blur(10px);
            resize: horizontal;
            overflow: hidden;
            min-width: 280px;
            max-width: 500px;
        `;

        div.innerHTML = `
            <div id="d-header" style="background: rgba(17, 17, 17, 0.8); padding: 8px 10px; border-bottom: 1px solid #333; cursor: move; display: flex; justify-content: space-between; align-items: center; border-radius: 5px 5px 0 0;">
                <div style="display: flex; align-items: center; gap: 6px;">
                    <img src="${config.customLogoUrl}" style="width: 18px; height: 18px; border-radius: 3px;" onerror="this.style.display='none'">
                    <span style="font-weight:700; color:${config.accentColor}; font-size: 12px; letter-spacing:0.5px;">DESTINY</span>
                </div>
                <span style="font-size:9px; color:#666;">[INS]</span>
            </div>

            <!-- TABS -->
            <div style="display:flex; flex-wrap:wrap; background:rgba(17,17,17,0.6); border-bottom:1px solid #333; gap:1px; padding:3px;">
                <div id="tab-combat" class="tab-btn" style="padding:6px 10px; cursor:pointer; border-radius:3px; transition:all 0.15s; font-size:10px; pointer-events:auto; position:relative; z-index:10; font-weight:600;">COMBAT</div>
                <div id="tab-visuals" class="tab-btn" style="padding:6px 10px; cursor:pointer; border-radius:3px; transition:all 0.15s; font-size:10px; pointer-events:auto; position:relative; z-index:10; font-weight:600;">VISUALS</div>
                <div id="tab-advanced" class="tab-btn" style="padding:6px 10px; cursor:pointer; border-radius:3px; transition:all 0.15s; font-size:10px; pointer-events:auto; position:relative; z-index:10; font-weight:600;">ADVANCED</div>
                <div id="tab-perf" class="tab-btn" style="padding:6px 10px; cursor:pointer; border-radius:3px; transition:all 0.15s; font-size:10px; pointer-events:auto; position:relative; z-index:10; font-weight:600;">STATS</div>
                <div id="tab-help" class="tab-btn" style="padding:6px 10px; cursor:pointer; border-radius:3px; transition:all 0.15s; font-size:10px; pointer-events:auto; position:relative; z-index:10; font-weight:600;">HELP</div>
            </div>

            <div id="tab-content" style="padding: 10px; background: rgba(13, 13, 13, 0.8); border-radius: 0 0 5px 5px; max-height:400px; overflow-y:auto; font-size:11px;">
                ${getTabContent()}
            </div>
        `;

        document.documentElement.appendChild(div);

        // DRAG LOGIC
        const header = document.getElementById('d-header');
        let isDragging = false;
        let offsetX, offsetY;

        header.onmousedown = (e) => {
            isDragging = true;
            offsetX = e.clientX - div.offsetLeft;
            offsetY = e.clientY - div.offsetTop;
            e.preventDefault();
        };

        window.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const x = e.clientX - offsetX;
                const y = e.clientY - offsetY;
                div.style.left = x + 'px';
                div.style.top = y + 'px';
                config.x = x;
                config.y = y;
            }
        });

        window.addEventListener('mouseup', () => {
            if (isDragging) {
                config.menuWidth = div.offsetWidth;
                save();
            }
            isDragging = false;
        });

        // Save width on resize
        new ResizeObserver(() => {
            config.menuWidth = div.offsetWidth;
            save();
        }).observe(div);

        // TAB SWITCHING
        ['combat', 'visuals', 'advanced', 'perf', 'help'].forEach(tab => {
            const btn = document.getElementById(`tab-${tab}`);
            if (btn) {
                btn.onclick = () => {
                    console.log('[Destiny] Switching to tab:', tab);
                    currentTab = tab;
                    refreshGUI();
                };
            }
        });

        // ATTACH EVENT HANDLERS
        attachEventHandlers();
    }

    function refreshGUI() {
        const content = document.getElementById('tab-content');
        if (content) content.innerHTML = getTabContent();

        // Update tab buttons
        ['combat', 'visuals', 'advanced', 'perf', 'help'].forEach(tab => {
            const btn = document.getElementById(`tab-${tab}`);
            if (btn) {
                btn.style.background = currentTab === tab ? '#1a1a1a' : 'transparent';
                btn.style.color = currentTab === tab ? config.accentColor : '#888';
            }
        });

        attachEventHandlers();
    }

    function attachEventHandlers() {
        const handlers = {
            'chk-aim': e => { config.aimbotEnabled = e.target.checked; save(); },
            'chk-esp': e => { config.espEnabled = e.target.checked; save(); },
            'chk-fov': e => { config.showFov = e.target.checked; save(); },
            'chk-crosshair': e => { config.showCrosshair = e.target.checked; save(); },
            'chk-pred': e => { config.predictionEnabled = e.target.checked; save(); },
            'chk-trigger': e => { config.triggerBot = e.target.checked; save(); },
            'chk-lock': e => { config.targetLock = e.target.checked; save(); },
            'chk-dist': e => { config.showDistance = e.target.checked; save(); },
            'chk-tracers': e => { config.showTracers = e.target.checked; save(); },
            'chk-gradient': e => { config.fovGradient = e.target.checked; save(); },
            'chk-velocity': e => { config.velocityTracking = e.target.checked; save(); },
            'chk-visibility': e => { config.visibilityCheck = e.target.checked; save(); },
            'chk-afk': e => { config.antiAFK = e.target.checked; save(); },
            'chk-blockfs': e => {
                config.blockFullscreen = e.target.checked;
                save();
                if(confirm('Reload page to apply fullscreen blocker?')) location.reload();
            },
            'chk-fps': e => { config.showFPS = e.target.checked; save(); },
            'chk-stats': e => { config.showStats = e.target.checked; save(); },
            'chk-perfmode': e => { config.performanceMode = e.target.checked; save(); },
            'sld-smooth': e => { config.aimSmooth = parseFloat(e.target.value); const el = document.getElementById('val-smooth'); if(el) el.innerText = config.aimSmooth; save(); },
            'sld-fov': e => { config.fov = parseInt(e.target.value); const el = document.getElementById('val-fov'); if(el) el.innerText = config.fov; save(); },
            'sld-pred': e => { config.predictionStrength = parseFloat(e.target.value); const el = document.getElementById('val-pred'); if(el) el.innerText = config.predictionStrength; save(); },
            'sld-thick': e => { config.espThickness = parseFloat(e.target.value); const el = document.getElementById('val-thick'); if(el) el.innerText = config.espThickness; save(); },
            'sel-prio': e => { config.priority = parseInt(e.target.value); save(); },
            'sel-bone': e => { config.hitbox = parseInt(e.target.value); save(); },
            'sel-curve': e => { config.smoothCurve = e.target.value; save(); },
            'btn-reset': () => { if(confirm('Reset all settings to defaults?')) { config = {...defaultConfig}; save(); refreshGUI(); } }
        };

        Object.keys(handlers).forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                if (el.tagName === 'INPUT' && el.type === 'range') {
                    el.oninput = handlers[id];
                } else if (el.tagName === 'BUTTON') {
                    el.onclick = handlers[id];
                } else {
                    el.onchange = handlers[id];
                }
            }
        });
    }

    // =================================================================
    // KEYBOARD LISTENER
    // =================================================================
    window.addEventListener('keydown', (e) => {
        if (e.code === 'Insert' || e.code === 'Delete') {
            config.menuVisible = !config.menuVisible;
            const el = document.getElementById('destiny-simple-ui');
            if (el) el.style.display = config.menuVisible ? 'block' : 'none';
            save();
            e.preventDefault();
            e.stopPropagation();
        }
        if (e.code === 'ArrowRight') { state.targetID++; updateID(); }
        if (e.code === 'ArrowLeft') { state.targetID--; updateID(); }
    }, true);

    function updateID() {
        state.modelMatrices = [];
        const el = document.getElementById('id-disp');
        if (el) el.innerText = state.targetID;
    }

    // =================================================================
    // TRACKING STATE
    // =================================================================
    const state = {
        targetID: -1,
        programCounter: 0,
        modelMatrices: [],
        vpMatrices: [],
        input: {left:false, right:false},
        accX: 0, accY: 0,
        // NEW STATE
        lastPositions: new Map(),
        velocities: new Map(),
        lockedTarget: null,
        lockStartTime: 0,
        fps: 0,
        frameCount: 0,
        lastFPSUpdate: Date.now(),
        totalTargets: 0,
        hitCount: 0,
        missCount: 0,
        recoilPattern: [],
        currentRecoilIndex: 0,
        lastMouseMove: Date.now()
    };

    window.addEventListener('mousedown', e => { if(e.button===0) state.input.left=true; if(e.button===2) state.input.right=true; });
    window.addEventListener('mouseup', e => { if(e.button===0) state.input.left=false; if(e.button===2) state.input.right=false; });

    // =================================================================
    // WEBGL HOOK
    // =================================================================
    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    const proxyCache = new WeakMap();
    const programMap = new WeakMap();

    function spoof(fake, real) {
        Object.defineProperty(fake, 'name', { value: real.name, configurable: true });
        Object.defineProperty(fake, 'toString', { value: () => real.toString(), configurable: true });
        return fake;
    }

    HTMLCanvasElement.prototype.getContext = spoof(function(type, options) {
        const ctx = originalGetContext.call(this, type, options);
        if (!ctx || (type !== 'webgl' && type !== 'webgl2')) return ctx;
        if (proxyCache.has(ctx)) return proxyCache.get(ctx);

        const handler = {
            get(target, prop) {
                const val = target[prop];
                if (typeof val === 'function') {
                    if (prop === 'uniformMatrix4fv') {
                        return function(location, transpose, value) {
                            if (value && value.length === 16) {
                                if (Math.abs(value[11] + 1) < 0.1 && Math.abs(value[15]) < 0.1) {
                                    if (state.vpMatrices.length > 3) state.vpMatrices.shift();
                                    state.vpMatrices.push(new Float32Array(value));
                                }
                                const gl = target;
                                const pid = programMap.get(gl.getParameter(gl.CURRENT_PROGRAM));
                                if (pid === state.targetID) {
                                    // Stricter validation for model matrices
                                    if (Math.abs(value[3]) < 1e-6 &&
                                        Math.abs(value[7]) < 1e-6 &&
                                        Math.abs(value[15] - 1) < 1e-6 &&
                                        state.modelMatrices.length < 100) { // Limit to prevent overflow
                                        state.modelMatrices.push(new Float32Array(value));
                                    }
                                }
                            }
                            return val.apply(target, arguments);
                        }
                    }
                    if (prop === 'useProgram') {
                        return function(program) {
                            if (program && !programMap.has(program)) programMap.set(program, state.programCounter++);
                            return val.apply(target, arguments);
                        }
                    }
                    if (prop === 'drawElements') {
                        return function(mode, count, type, offset) {
                            const gl = target;
                            const pid = programMap.get(gl.getParameter(gl.CURRENT_PROGRAM));
                            if (config.aimbotEnabled && config.espEnabled && pid === state.targetID) gl.disable(gl.DEPTH_TEST);
                            const res = val.apply(target, arguments);
                            if (config.aimbotEnabled && config.espEnabled && pid === state.targetID) gl.enable(gl.DEPTH_TEST);
                            return res;
                        }
                    }
                    return val.bind(target);
                }
                return val;
            }
        };
        const proxied = new Proxy(ctx, handler);
        proxyCache.set(ctx, proxied);
        return proxied;
    }, originalGetContext);

    function setupCanvas() {
        const canvas = document.createElement('canvas');
        canvas.id = 'destiny-overlay-canvas';
        canvas.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:2147483646;pointer-events:none;";
        document.documentElement.appendChild(canvas);

        function updateCanvasSize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        window.addEventListener('resize', updateCanvasSize);

        // Handle fullscreen changes
        document.addEventListener('fullscreenchange', () => {
            setTimeout(updateCanvasSize, 100);
        });
        document.addEventListener('webkitfullscreenchange', () => {
            setTimeout(updateCanvasSize, 100);
        });

        updateCanvasSize();

        function loop() {
            render(canvas);
            requestAnimationFrame(loop);
        }
        loop();
        setInterval(createGUI, 2000);
    }

    function getBoneOffset() {
        let y = (config.hitbox === 0) ? 2.15 : (config.hitbox === 1) ? 1.5 : 0.8;
        if (config.randomize) y += (Math.random() - 0.5) * 0.15;
        return y;
    }

    function applySmoothCurve(value, curve) {
        if (curve === 'ease') {
            return value < 0.5
                ? 4 * value * value * value
                : 1 - Math.pow(-2 * value + 2, 3) / 2;
        } else if (curve === 'exponential') {
            return 1 - Math.pow(1 - value, 3);
        }
        return value;
    }

    function easeOutQuart(x) {
        return 1 - Math.pow(1 - x, 4);
    }

    function easeInOutCubic(x) {
        return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    }

    function calculateVelocity(matrixId, currentPos) {
        const lastPos = state.lastPositions.get(matrixId);
        if (lastPos) {
            const vx = currentPos.x - lastPos.x;
            const vy = currentPos.y - lastPos.y;
            const vz = currentPos.z - lastPos.z;
            state.velocities.set(matrixId, {vx, vy, vz, time: Date.now()});
        }
        state.lastPositions.set(matrixId, currentPos);
    }

    function render(canvas) {
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;
        const cx = w / 2;
        const cy = h / 2;

        ctx.clearRect(0, 0, w, h);

        state.frameCount++;
        const now = Date.now();
        const shouldUpdateStats = now - state.lastFPSUpdate > 1000;

        if (shouldUpdateStats) {
            state.fps = state.frameCount;
            state.frameCount = 0;
            state.lastFPSUpdate = now;

            if (config.menuVisible && currentTab === 'perf') {
                const fpsEl = document.getElementById('stat-fps');
                const targetsEl = document.getElementById('stat-targets');
                const accuracyEl = document.getElementById('stat-accuracy');
                if (fpsEl) fpsEl.innerText = state.fps;
                if (targetsEl) targetsEl.innerText = state.totalTargets;
                if (accuracyEl) {
                    const total = state.hitCount + state.missCount;
                    accuracyEl.innerText = total > 0 ? Math.round(state.hitCount/total*100) + '%' : '0%';
                }
            }
        }

        if (config.showFPS) {
            ctx.font = 'bold 16px monospace';
            ctx.fillStyle = config.accentColor;
            ctx.fillText(`FPS: ${state.fps}`, 10, 30);
        }

        if (config.showCrosshair) {
            const crosshairSize = 10;
            const crosshairGap = 4;
            const crosshairThickness = 2;

            ctx.strokeStyle = config.accentColor;
            ctx.lineWidth = crosshairThickness;

            ctx.beginPath();
            ctx.moveTo(cx, cy - crosshairGap - crosshairSize);
            ctx.lineTo(cx, cy - crosshairGap);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(cx, cy + crosshairGap);
            ctx.lineTo(cx, cy + crosshairGap + crosshairSize);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(cx - crosshairGap - crosshairSize, cy);
            ctx.lineTo(cx - crosshairGap, cy);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(cx + crosshairGap, cy);
            ctx.lineTo(cx + crosshairGap + crosshairSize, cy);
            ctx.stroke();

            ctx.fillStyle = config.accentColor;
            ctx.fillRect(cx - 1, cy - 1, 2, 2);
        }

        if (config.showFov) {
            ctx.beginPath();
            ctx.arc(cx, cy, config.fov, 0, Math.PI * 2);
            if (config.fovGradient && !config.performanceMode) {
                const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, config.fov);
                gradient.addColorStop(0, 'transparent');
                gradient.addColorStop(0.8, 'transparent');
                gradient.addColorStop(1, config.accentColor + '40');
                ctx.fillStyle = gradient;
                ctx.fill();
            }
            ctx.strokeStyle = config.accentColor;
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }

        if(state.modelMatrices.length > 50) state.modelMatrices.length = 0;
        if (state.vpMatrices.length === 0) return;

        const vp = state.vpMatrices[state.vpMatrices.length - 1];
        let bestTarget = null;
        let bestScore = Infinity;
        let bestTargetData = null;
        state.totalTargets = 0;

        const processedPositions = [];
        const MIN_DISTANCE = 0.5;

        for (let i = 0; i < state.modelMatrices.length; i++) {
            const mat = state.modelMatrices[i];
            const wx = mat[12], wy = mat[13], wz = mat[14];

            let isDuplicate = false;
            for (const pos of processedPositions) {
                const dx = wx - pos.x;
                const dy = wy - pos.y;
                const dz = wz - pos.z;
                // Fast distance check without sqrt
                const distSq = dx*dx + dy*dy + dz*dz;
                if (distSq < MIN_DISTANCE * MIN_DISTANCE) {
                    isDuplicate = true;
                    break;
                }
            }
            if (isDuplicate) continue;

            // Limit processed positions to prevent memory issues
            if (processedPositions.length < 20) {
                processedPositions.push({x: wx, y: wy, z: wz});
            }

            // Calculate velocity (only if prediction is enabled to save performance)
            if (config.velocityTracking && config.predictionEnabled) {
                calculateVelocity(i, {x: wx, y: wy, z: wz});
            }

            // Use actual position for ESP boxes (not predicted)
            const head = project(vp, wx, wy + getBoneOffset(), wz, w, h);
            const foot = project(vp, wx, wy, wz, w, h);

            // Calculate predicted position separately for aimbot
            let targetX = wx, targetY = wy + getBoneOffset(), targetZ = wz;
            if (config.predictionEnabled && config.velocityTracking) {
                const vel = state.velocities.get(i);
                if (vel && now - vel.time < 100) {
                    const predTime = config.predictionStrength * 0.016;
                    targetX += vel.vx * predTime;
                    targetY += vel.vy * predTime;
                    targetZ += vel.vz * predTime;
                }
            }

            if (!head || !foot) continue;
            const boxH = foot.y - head.y;
            const boxW = boxH * 0.6;

            // Filter out invalid boxes (too small, too large, or negative)
            // Stricter filtering to avoid weapon models and effects
            if (boxH < 30 || boxH > 400 || boxW < 15 || boxW > 250) continue;

            // Filter out boxes with weird aspect ratios (likely not players)
            const aspectRatio = boxW / boxH;
            if (aspectRatio < 0.3 || aspectRatio > 1.0) continue;

            // Filter out boxes that are off-screen or at extreme positions
            if (head.x < -100 || head.x > w + 100 || head.y < -100 || head.y > h + 100) continue;

            // Track position for dead player detection
            const posKey = `${i}_${Math.round(wx*10)}_${Math.round(wy*10)}_${Math.round(wz*10)}`;
            state.lastPositions.set(posKey, now);

            state.totalTargets++;
            const dist3D = Math.sqrt(wx*wx + wy*wy + wz*wz);

            if (config.espEnabled) {
                const skipAdvancedESP = config.performanceMode;

                if (config.showDistance && !skipAdvancedESP) {
                    ctx.font = '11px monospace';
                    ctx.fillStyle = config.accentColor;
                    ctx.fillText(`${Math.round(dist3D)}m`, head.x, head.y - 5);
                }

                if (config.showTracers && !skipAdvancedESP) {
                    ctx.beginPath();
                    ctx.moveTo(cx, h);
                    ctx.lineTo(foot.x, foot.y);
                    ctx.strokeStyle = config.accentColor + '60';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }

            const dist2D = Math.hypot(head.x - cx, head.y - cy);
            if (dist2D > config.fov) continue;

            // Dead body check - skip if position hasn't changed (frozen/dead)
            const aimbotPosKey = `${i}_${Math.round(wx*10)}_${Math.round(wy*10)}_${Math.round(wz*10)}`;
            const aimbotLastSeen = state.lastPositions.get(aimbotPosKey);
            const isDead = aimbotLastSeen && now - aimbotLastSeen > 2000; // 2 seconds frozen = dead

            if (isDead) continue; // Skip dead players for aimbot

            // Visibility/Wall check
            if (config.visibilityCheck) {
                // Skip targets with invalid depth (behind walls or invalid geometry)
                if (head.w < 0.01 || head.w > 100) continue;

                // Check screen-to-world distance ratio to detect walls
                // If target is far in 3D but close on screen = behind wall
                const screenToWorldRatio = dist3D / (dist2D + 1);
                if (screenToWorldRatio > 50) continue;

                // Check if box dimensions are unrealistic (can indicate wall occlusion)
                if (boxH < 20 || boxH > 500) continue;
            }

            let score = (config.priority === 1) ? dist2D : head.w;
            if (score < bestScore) {
                bestScore = score;
                // Use predicted position for aimbot
                const predictedHead = project(vp, targetX, targetY, targetZ, w, h);
                bestTarget = predictedHead || head;
                bestTargetData = {x: targetX, y: targetY, z: targetZ, dist2D, dist3D};
            }
        }

        // Target lock logic
        if (config.targetLock && bestTarget) {
            if (!state.lockedTarget) {
                state.lockedTarget = bestTarget;
                state.lockStartTime = now;
            } else if (now - state.lockStartTime > config.lockTime) {
                state.lockedTarget = null;
            }
        } else {
            state.lockedTarget = null;
        }

        const activeTarget = state.lockedTarget || bestTarget;

        if (config.aimbotEnabled && activeTarget && (state.input.right || state.input.left)) {
            const dx = activeTarget.x - cx;
            const dy = activeTarget.y - cy;
            const dist = Math.hypot(dx, dy);

            // Smooth deadzone with gradual fade-in
            const DEADZONE = 3;
            if (dist < DEADZONE) {
                state.accX *= 0.7; // Smooth decay instead of instant zero
                state.accY *= 0.7;
                return;
            }

            // Premium aim feel with distance-based easing
            let smooth = config.aimSmooth;

            // Calculate distance ratio for smooth scaling
            const distRatio = Math.min(1, dist / config.fov);

            // Multi-zone smoothing for premium feel
            if (dist < config.lockDist * 0.5) {
                // Very close - ultra smooth lock
                smooth *= 2.5;
            } else if (dist < config.lockDist) {
                // Close - smooth transition
                const closeRatio = (dist - config.lockDist * 0.5) / (config.lockDist * 0.5);
                smooth *= 1.5 + easeOutQuart(closeRatio);
            } else if (dist < config.lockDist * 2) {
                // Medium distance - gradual acceleration
                const midRatio = (dist - config.lockDist) / config.lockDist;
                smooth *= 1.0 + (0.5 * easeInOutCubic(midRatio));
            }

            // Apply premium easing curve
            const easedProgress = easeInOutCubic(distRatio);
            smooth = smooth * (0.8 + easedProgress * 0.4);

            // Calculate movement with premium smoothing
            let tx = dx / smooth;
            let ty = dy / smooth;

            // Smooth accumulator blending
            tx += state.accX * 0.85; // Blend previous movement
            ty += state.accY * 0.85;

            let mx = Math.round(tx);
            let my = Math.round(ty);

            state.accX = (tx - mx) * 0.9; // Smooth accumulator decay
            state.accY = (ty - my) * 0.9;

            // Premium movement threshold with micro-smoothing
            const moveAmount = Math.hypot(mx, my);
            if (moveAmount >= 1) {
                // Apply premium smoothing based on movement speed
                const speedFactor = Math.min(1, moveAmount / 20);
                const smoothFactor = 0.92 + (speedFactor * 0.06); // 0.92-0.98 range

                const smoothedMx = Math.round(mx * smoothFactor);
                const smoothedMy = Math.round(my * smoothFactor);

                if (smoothedMx !== 0 || smoothedMy !== 0) {
                    window.dispatchEvent(new MouseEvent('mousemove', {
                        movementX: smoothedMx,
                        movementY: smoothedMy,
                        bubbles: true
                    }));
                    state.lastMouseMove = now;
                }
            }
        } else {
            // Smooth deceleration when not aiming
            state.accX *= 0.5;
            state.accY *= 0.5;
        }

        // Anti-AFK
        if (config.antiAFK && now - state.lastMouseMove > 60000) {
            window.dispatchEvent(new MouseEvent('mousemove', {movementX: 1, movementY: 0, bubbles: true}));
            state.lastMouseMove = now;
        }

        // Cleanup old position data every 5 seconds to prevent memory leaks
        if (now % 5000 < 16) {
            const cutoffTime = now - 5000;
            for (const [key, time] of state.lastPositions.entries()) {
                if (typeof time === 'number' && time < cutoffTime) {
                    state.lastPositions.delete(key);
                }
            }
            for (const [key, vel] of state.velocities.entries()) {
                if (vel.time < cutoffTime) {
                    state.velocities.delete(key);
                }
            }
        }

        // Clear model matrices immediately to prevent duplicates
        state.modelMatrices.length = 0;
    }

    function project(vp, x, y, z, w, h) {
        const X = x*vp[0] + y*vp[4] + z*vp[8] + vp[12];
        const Y = x*vp[1] + y*vp[5] + z*vp[9] + vp[13];
        const W = x*vp[3] + y*vp[7] + z*vp[11] + vp[15];
        if (W < 0.1) return null;
        return { x: (X/W + 1) * w * 0.5, y: (-Y/W + 1) * h * 0.5, w: W };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setupCanvas();
            setTimeout(showWelcomeScreen, 500);
        });
    } else {
        setupCanvas();
        setTimeout(showWelcomeScreen, 500);
    }

})();