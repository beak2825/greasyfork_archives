// ==UserScript==
// @name         Veyra - Enhanced Reaction Farm
// @namespace    http://tampermonkey.net/
// @version      2.0.3
// @description  Enhanced auto farm reactions with comprehensive HUD and session management
// @author       Sinclair
// @match        https://demonicscans.org/title/*/chapter/*
// @match        https://demonicscans.org/signin.php
// @match        https://demonicscans.org/index.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=demonicscans.org
// @grant        none
// @license      GNU General Public License v3.0
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/557358/Veyra%20-%20Enhanced%20Reaction%20Farm.user.js
// @updateURL https://update.greasyfork.org/scripts/557358/Veyra%20-%20Enhanced%20Reaction%20Farm.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const AUTO_LOGIN_EMAIL = "jteopp@gmail.com"; // <-- Replace
    const AUTO_LOGIN_PASSWORD = "1Jonathan!"; // <-- Replace

    // Session state
    let farmingState = {
        isRunning: false,
        isPaused: false,
        mode: 'farmX', // 'farmX' or 'farmUntil'
        targetValue: 0,
        sessionProgress: 0,
        hasStartedThisSession: false
    };

    // Load session state from localStorage
    function loadSessionState() {
        const saved = localStorage.getItem('veyra_farming_state');
        if (saved) {
            const parsed = JSON.parse(saved);
            farmingState = { ...farmingState, ...parsed };
            // Don't restore isRunning or isPaused - these reset on page load
            farmingState.isRunning = false;
            farmingState.isPaused = false;
        }
    }

    // Save session state to localStorage
    function saveSessionState() {
        localStorage.setItem('veyra_farming_state', JSON.stringify(farmingState));
    }

    // --- HUD Setup ---
    function createHUD() {
        const hud = document.createElement("div");
        hud.id = "veyra-hud";
        hud.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: rgba(0,0,0,0.95);
            color: #00ff00;
            font-size: 12px;
            font-family: 'Courier New', monospace;
            padding: 12px;
            border-radius: 8px;
            border: 2px solid #00ff00;
            z-index: 99999;
            min-width: 280px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            cursor: move;
            user-select: none;

        `;

        hud.innerHTML = `
            <div style="text-align: center; margin-bottom: 8px; font-weight: bold; color: #ffff00;">
                🎯 VEYRA FARM v2.0
            </div>

            <div id="stats-container" style="margin-bottom: 10px;">
                <div>⚡ Stamina: <span id="stamina-display">Loading...</span></div>
                <div>📊 Daily: <span id="daily-display">Loading...</span></div>
                <div>🏆 Session: <span id="session-display">0</span></div>
            </div>

            <div id="mode-container" style="margin-bottom: 10px; padding: 8px; background: rgba(255,255,255,0.1); border-radius: 4px;">
                <div style="margin-bottom: 6px;">
                    <label style="display: flex; align-items: center; cursor: pointer;">
                        <input type="radio" name="farmMode" value="farmX" id="mode-farmX" style="margin-right: 6px;">
                        <span>Farm X Stamina</span>
                    </label>
                </div>
                <div style="margin-bottom: 6px;">
                    <label style="display: flex; align-items: center; cursor: pointer;">
                        <input type="radio" name="farmMode" value="farmUntil" id="mode-farmUntil" style="margin-right: 6px;">
                        <span>Farm Until X Stamina</span>
                    </label>
                </div>
                <div style="margin-top: 6px;">
                    <label>Target Value:</label>
                    <input type="number" id="target-input" value="0" min="0" style="
                        width: 60px;
                        margin-left: 6px;
                        padding: 2px 4px;
                        background: rgba(0,0,0,0.5);
                        color: #00ff00;
                        border: 1px solid #00ff00;
                        border-radius: 3px;
                    ">
                </div>
            </div>

            <div id="controls-container" style="text-align: center;">
                <button id="start-btn" style="
                    padding: 8px 16px;
                    background: #00aa00;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 12px;
                ">▶ START FARMING</button>

                <div id="running-controls" style="display: none;">
                    <button id="pause-btn" style="
                        padding: 6px 12px;
                        background: #ffaa00;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        margin-right: 8px;
                        font-size: 11px;
                    ">⏸ PAUSE</button>

                    <button id="stop-btn" style="
                        padding: 6px 12px;
                        background: #aa0000;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 11px;
                    ">⏹ STOP</button>
                </div>
            </div>

            <div id="status-display" style="
                margin-top: 8px;
                text-align: center;
                font-size: 11px;
                color: #888;
            ">Ready to farm</div>
        `;

        document.body.appendChild(hud);
        setupHUDEvents();
        restoreHUDState();
        makeHUDDraggable(hud);
    }

    function makeHUDDraggable(hud) {
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;

        hud.addEventListener('mousedown', (e) => {
            // Allow dragging only if clicked on empty space (not a button/input)
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;

            isDragging = true;
            offsetX = e.clientX - hud.offsetLeft;
            offsetY = e.clientY - hud.offsetTop;
            hud.style.transition = 'none';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            let x = e.clientX - offsetX;
            let y = e.clientY - offsetY;

            // Clamp within viewport bounds
            const maxX = window.innerWidth - hud.offsetWidth;
            const maxY = window.innerHeight - hud.offsetHeight;

            x = Math.max(0, Math.min(x, maxX));
            y = Math.max(0, Math.min(y, maxY));

            hud.style.left = x + 'px';
            hud.style.top = y + 'px';
            hud.style.right = 'auto';
            hud.style.bottom = 'auto';
            hud.style.position = 'fixed';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            hud.style.transition = '';
        });
    }


    function setupHUDEvents() {
        const startBtn = document.getElementById('start-btn');
        const pauseBtn = document.getElementById('pause-btn');
        const stopBtn = document.getElementById('stop-btn');
        const modeRadios = document.querySelectorAll('input[name="farmMode"]');
        const targetInput = document.getElementById('target-input');

        startBtn.addEventListener('click', startFarming);
        pauseBtn.addEventListener('click', togglePause);
        stopBtn.addEventListener('click', stopFarming);

        modeRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                farmingState.mode = e.target.value;
                saveSessionState();
            });
        });

        targetInput.addEventListener('change', (e) => {
            farmingState.targetValue = parseInt(e.target.value) || 0;
            saveSessionState();
        });
    }

    function restoreHUDState() {
        // Restore mode selection
        document.getElementById(`mode-${farmingState.mode}`).checked = true;

        // Restore target value
        document.getElementById('target-input').value = farmingState.targetValue;

        // Update session display
        document.getElementById('session-display').textContent = farmingState.sessionProgress;

        // Show appropriate controls based on session state
        if (farmingState.hasStartedThisSession) {
            document.getElementById('start-btn').style.display = 'none';
            document.getElementById('running-controls').style.display = 'block';
            // Don't update status here - will be handled in initialize()
        }
    }

    // --- Data Extraction Functions ---
    function getStamina() {
        let staminaEl = document.evaluate(
            '//*[@id="discuscontainer"]/div[1]/div[1]/div[2]/span[1]/span',
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
        ).singleNodeValue;
        if (!staminaEl) return null;
        let [current, max] = staminaEl.innerText.split('/').map(s => parseInt(s.replace(/,/g,'').trim(), 10));
        return { current, max };
    }

    function getFarm() {
        let farmEl = document.evaluate(
            '//*[@id="discuscontainer"]/div[1]/div[1]/div[2]/span[2]/span',
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
        ).singleNodeValue;
        if (!farmEl) return null;
        let [current, max] = farmEl.innerText.split('/').map(s => parseInt(s.replace(/,/g,'').trim(), 10));
        return { current, max };
    }

    function updateHUDDisplay() {
        const stamina = getStamina();
        const farm = getFarm();

        const staminaDisplay = stamina ? `${stamina.current}/${stamina.max}` : 'N/A';
        const farmDisplay = farm ? `${farm.current}/${farm.max}` : 'N/A';

        document.getElementById('stamina-display').textContent = staminaDisplay;
        document.getElementById('daily-display').textContent = farmDisplay;
        document.getElementById('session-display').textContent = farmingState.sessionProgress;
    }

    function updateStatus(message) {
        const statusEl = document.getElementById('status-display');
        if (statusEl) {
            statusEl.textContent = message;
        }
    }

    // --- Farming Control Functions ---
    function startFarming() {
        farmingState.isRunning = true;
        farmingState.isPaused = false;
        farmingState.hasStartedThisSession = true;

        document.getElementById('start-btn').style.display = 'none';
        document.getElementById('running-controls').style.display = 'block';

        saveSessionState();
        updateStatus('Starting farm...');

        setTimeout(() => farmLoop(), 1000);
    }

    function togglePause() {
        const pauseBtn = document.getElementById('pause-btn');

        farmingState.isPaused = !farmingState.isPaused;

        if (farmingState.isPaused) {
            pauseBtn.textContent = '▶ RESUME';
            pauseBtn.style.background = '#00aa00';
            updateStatus('Farming paused');
        } else {
            pauseBtn.textContent = '⏸ PAUSE';
            pauseBtn.style.background = '#ffaa00';
            updateStatus('Farming resumed');
            setTimeout(() => farmLoop(), 1000);
        }

        saveSessionState();
    }

    function stopFarming() {
        farmingState.isRunning = false;
        farmingState.isPaused = false;
        farmingState.hasStartedThisSession = false;
        farmingState.sessionProgress = 0;

        document.getElementById('start-btn').style.display = 'block';
        document.getElementById('running-controls').style.display = 'none';
        document.getElementById('pause-btn').textContent = '⏸ PAUSE';
        document.getElementById('pause-btn').style.background = '#ffaa00';

        saveSessionState();
        updateStatus('Farming stopped. Session reset.');
        updateHUDDisplay();
    }

    // --- Farming Logic ---
    function checkStopConditions() {
        const stamina = getStamina();
        const farm = getFarm();

        if (!stamina || !farm) {
            return { shouldStop: true, reason: 'Unable to read stamina/farm data' };
        }

        // Condition A: Current Stamina >= (Max Stamina - 30)
        if (stamina.current >= (stamina.max - 30)) {
            return { shouldStop: true, reason: 'Stamina limit reached (max - 30)' };
        }

        // Condition B: Current Daily Progress >= Max Daily Limit
        if (farm.current >= farm.max) {
            return { shouldStop: true, reason: 'Daily farm limit reached' };
        }

        // Condition C: Farm X mode and has farmed X stamina
        if (farmingState.mode === 'farmX' && farmingState.targetValue > 0) {
            if (farmingState.sessionProgress >= farmingState.targetValue) {
                return { shouldStop: true, reason: `Target of ${farmingState.targetValue} stamina farmed` };
            }
        }

        // Condition D: Farm Until X mode and current stamina >= X
        if (farmingState.mode === 'farmUntil' && farmingState.targetValue > 0) {
            if (stamina.current >= farmingState.targetValue) {
                return { shouldStop: true, reason: `Target stamina of ${farmingState.targetValue} reached` };
            }
        }

        return { shouldStop: false };
    }

    function clickReaction() {
        const reactionMap = {
            0: 3, // Sunday
            1: 1, // Monday
            2: 2, // Tuesday
            3: 3, // Wednesday
            4: 4, // Thursday
            5: 5, // Friday
            6: 2  // Saturday
        };

        const today = new Date().getDay();
        const reactionToClick = reactionMap[today]; // Pick reaction number based on day
        let reactio2n = document.evaluate(
            '/html/body/div[5]/center/div/div[1]/div[3]/div[1]',
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
        ).singleNodeValue;
        const selector = `.chapter-reactions .reaction[data-reaction="${reactionToClick}"]`;
        const reaction = document.querySelector(selector);
        if (reaction) {
            reaction.scrollIntoView();
            reaction.click();

            // Increment session progress (each reaction gives 2 stamina)
            farmingState.sessionProgress += 2;
            saveSessionState();
            updateHUDDisplay();

            return true;
        }
        return false;
    }

    function goNextPage() {
        let nextBtn = document.querySelector("body > div.chapter-info > div > a.nextchap");
        if (nextBtn) {
            window.location.href = nextBtn.href;
            return true;
        } else {
            updateStatus('❌ Next button not found');
            return false;
        }
    }

    function farmLoop() {
        if (!farmingState.isRunning || farmingState.isPaused) {
            return;
        }

        updateHUDDisplay();

        const stopCheck = checkStopConditions();
        if (stopCheck.shouldStop) {
            updateStatus(`Stopped: ${stopCheck.reason}`);
            stopFarming();
            return;
        }

        updateStatus('Clicking reaction...');

        if (clickReaction()) {
            updateStatus('Reaction clicked, going to next page...');
            setTimeout(() => {
                if (goNextPage()) {
                    // Page navigation will restart the script
                } else {
                    // If can't navigate, stop farming
                    stopFarming();
                }
            }, 1500);
        } else {
            updateStatus('❌ Reaction not found');
            // Retry in 5 seconds
            setTimeout(() => farmLoop(), 5000);
        }
    }

    // --- Auto-login Functions ---
    function autoLogin() {
        if (!window.location.href.includes("signin.php")) return false;

        const emailInput = document.evaluate('//*[@id="login-container"]/form/input[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        const passwordInput = document.evaluate('//*[@id="login-container"]/form/input[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        const loginBtn = document.evaluate('//*[@id="login-container"]/form/input[3]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (emailInput && passwordInput && loginBtn && AUTO_LOGIN_EMAIL !== "YOUR_EMAIL_HERE") {
            emailInput.value = AUTO_LOGIN_EMAIL;
            passwordInput.value = AUTO_LOGIN_PASSWORD;
            loginBtn.click();
            return true;
        }
        return false;
    }

    function handleLoggedOut() {
        if (window.location.href.includes("/chapter/")) {
            const loginBtn = document.evaluate(
                '//*[@id="discuscontainer"]/div[1]/div[3]/div[5]/a[1]',
                document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
            ).singleNodeValue;

            if (loginBtn) {
                // Save current page to resume after login
                localStorage.setItem("veyra_resume_page", window.location.href);
                // Navigate to login page
                window.location.href = "https://demonicscans.org/signin.php";
                return true;
            }
        }
        return false;
    }

    function handleLoginRedirect() {
        // If on login page, try auto-login
        if (window.location.href.includes("signin.php")) {
            autoLogin();
            return true;
        }

        // If came back from login, resume to saved page
        const resumePage = localStorage.getItem("veyra_resume_page");
        if (resumePage && resumePage !== window.location.href) {
            localStorage.removeItem("veyra_resume_page");
            window.location.href = resumePage;
            return true;
        }

        return false;
    }

    // --- Main Initialization ---
    function initialize() {
        // Load saved state first
        loadSessionState();

        // Handle login/logout scenarios
        if (handleLoggedOut() || handleLoginRedirect()) {
            return; // Page will redirect
        }

        // Only create HUD on chapter pages
        if (!window.location.href.match(/https:\/\/demonicscans\.org\/title\/.*\/chapter\/.*/)) {
            return; // Not a chapter page, don't load HUD
        }

        // Create and show HUD
        createHUD();

        // Wait for page elements to load, then update display
        function waitForElements() {
            const staminaEl = document.evaluate(
                '//*[@id="discuscontainer"]/div[1]/div[1]/div[2]/span[1]/span',
                document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
            ).singleNodeValue;

            if (staminaEl) {
                updateHUDDisplay();

                // If user had started farming in previous session, auto-resume
                if (farmingState.hasStartedThisSession) {
                    farmingState.isRunning = true;
                    farmingState.isPaused = false;
                    updateStatus('Session restored. Auto-resuming farming...');
                    setTimeout(() => farmLoop(), 2000);
                } else {
                    updateStatus('Ready to farm');
                }
            } else {
                setTimeout(waitForElements, 500);
            }
        }

        waitForElements();
    }

    // Start the script
    initialize();

})();