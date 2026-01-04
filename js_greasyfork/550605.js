// ==UserScript==
// @name         Veyra - PvP Auto Battle
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  Automated PvP battle script with auto-queue and continuous fighting
// @match        https://demonicscans.org/pvp_battle.php
// @match        https://demonicscans.org/pvp.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=demonicscans.org
// @grant        none
// @license      GNU General Public License v3.0
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/550605/Veyra%20-%20PvP%20Auto%20Battle.user.js
// @updateURL https://update.greasyfork.org/scripts/550605/Veyra%20-%20PvP%20Auto%20Battle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Battle and Queue state
    let battleState = {
        isActive: false,
        firstAttackMade: false,
        willWin: null, // null = unknown, true = will win, false = will lose
        autoSlashing: false,
        battleEnded: false
    };

    let queueState = {
        autoQueue: false,
        battlesWon: 0,
        battlesLost: 0,
        totalBattles: 0,
        battleLimit: 0, // 0 = unlimited (use all tokens)
        battlesRemaining: 0
    };

    // Load session state from localStorage
    function loadSessionState() {
        const saved = localStorage.getItem('veyra_pvp_session');
        if (saved) {
            const parsed = JSON.parse(saved);
            queueState = { ...queueState, ...parsed };
            // Don't restore autoQueue - this resets on page load
            queueState.autoQueue = false;
        }
    }

    // Save session state to localStorage
    function saveSessionState() {
        localStorage.setItem('veyra_pvp_session', JSON.stringify(queueState));
    }

    // Reset session stats
    function resetSessionStats() {
        queueState.battlesWon = 0;
        queueState.battlesLost = 0;
        queueState.totalBattles = 0;
        queueState.battleLimit = 0;
        queueState.battlesRemaining = 0;
        saveSessionState();
    }

    let slashInterval = null;
    let currentPage = window.location.href;

    // --- HUD Setup ---
    function createHUD() {
        const hud = document.createElement("div");
        hud.id = "veyra-pvp-hud";
        hud.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0,0,0,0.95);
            color: #ff6b35;
            font-size: 12px;
            font-family: 'Courier New', monospace;
            padding: 12px;
            border-radius: 8px;
            border: 2px solid #ff6b35;
            z-index: 99999;
            min-width: 280px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        `;

        if (currentPage.includes('pvp.php')) {
            hud.innerHTML = createDashboardHUD();
        } else if (currentPage.includes('pvp_battle.php')) {
            hud.innerHTML = createBattleHUD();
        }

        document.body.appendChild(hud);
        setupHUDEvents();
    }

    function createDashboardHUD() {
        return `
            <div style="text-align: center; margin-bottom: 8px; font-weight: bold; color: #ffff00;">
                ⚔️ VEYRA PvP v1.1
            </div>

            <div id="tokens-container" style="margin-bottom: 10px; padding: 6px; background: rgba(255,255,255,0.1); border-radius: 4px;">
                <div>🪙 PvP Tokens: <span id="token-display">Loading...</span></div>
            </div>

            <div id="battle-limit-container" style="margin-bottom: 10px; padding: 6px; background: rgba(255,255,255,0.1); border-radius: 4px;">
                <div style="margin-bottom: 4px;">⚙️ Battle Limit:</div>
                <input type="number" id="battle-limit-input" value="0" min="0" max="20" style="
                    width: 50px;
                    padding: 2px 4px;
                    background: rgba(0,0,0,0.5);
                    color: #ff6b35;
                    border: 1px solid #ff6b35;
                    border-radius: 3px;
                    margin-right: 6px;
                ">
                <small style="color: #aaa;">battles (0 = use all tokens)</small>
            </div>

            <div id="stats-container" style="margin-bottom: 10px; padding: 6px; background: rgba(255,255,255,0.1); border-radius: 4px;">
                <div>📊 Session Stats:</div>
                <div style="margin-left: 10px;">
                    <div>🏆 Wins: <span id="wins-display">0</span></div>
                    <div>💀 Losses: <span id="losses-display">0</span></div>
                    <div>⚡ Total: <span id="total-display">0</span></div>
                    <div id="remaining-display" style="display: none;">🎯 Remaining: <span id="battles-remaining">0</span></div>
                </div>
            </div>

            <div id="queue-status" style="margin-bottom: 10px; text-align: center; font-weight: bold;">
                Status: <span id="status-text">Ready to queue</span>
            </div>

                        <div id="controls-container" style="text-align: center;">
                <button id="auto-queue-btn" style="
                    padding: 8px 16px;
                    background: #ff6b35;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 12px;
                    margin-right: 8px;
                ">🚀 START AUTO QUEUE</button>

                <button id="stop-queue-btn" style="
                    padding: 8px 16px;
                    background: #aa3333;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 12px;
                    display: none;
                ">⏹️ STOP QUEUE</button>

                <button id="reset-stats-btn" style="
                    padding: 8px 16px;
                    background: #303030;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 12px;
                ">🔁 Reset Stats</button>
            </div>

            <div id="log-container" style="
                margin-top: 8px;
                max-height: 100px;
                overflow-y: auto;
                font-size: 10px;
                color: #ccc;
                border-top: 1px solid #555;
                padding-top: 6px;
            ">
                <div>Auto-queue ready!</div>
            </div>
        `;
    }

    function createBattleHUD() {
        return `
            <div style="text-align: center; margin-bottom: 8px; font-weight: bold; color: #ffff00;">
                ⚔️ VEYRA PvP v1.1
            </div>

            <div id="hp-container" style="margin-bottom: 10px; padding: 6px; background: rgba(255,255,255,0.1); border-radius: 4px;">
                <div>💚 Your HP: <span id="player-hp-display">Loading...</span></div>
                <div>❤️ Enemy HP: <span id="enemy-hp-display">Loading...</span></div>
            </div>

            <div id="battle-status" style="margin-bottom: 10px; text-align: center; font-weight: bold;">
                Status: <span id="status-text">Auto-fighting...</span>
            </div>

            <div id="prediction-container" style="margin-bottom: 10px; padding: 6px; background: rgba(255,255,255,0.1); border-radius: 4px;">
                <div style="text-align: center; font-weight: bold;">
                    <span id="prediction-text">Fighting to the end!</span>
                </div>
            </div>

            <div id="log-container" style="
                margin-top: 8px;
                max-height: 120px;
                overflow-y: auto;
                font-size: 10px;
                color: #ccc;
                border-top: 1px solid #555;
                padding-top: 6px;
            ">
                <div>Auto-battle in progress...</div>
            </div>
        `;
    }

    function setupHUDEvents() {
        if (currentPage.includes('pvp.php')) {
            const autoQueueBtn = document.getElementById('auto-queue-btn');
            const stopQueueBtn = document.getElementById('stop-queue-btn');
            const resetStatsBtn = document.getElementById('reset-stats-btn');
            const battleLimitInput = document.getElementById('battle-limit-input');

            if (autoQueueBtn) {
                autoQueueBtn.addEventListener('click', startAutoQueue);
            }
            if (stopQueueBtn) {
                stopQueueBtn.addEventListener('click', stopAutoQueue);
            }
            if (resetStatsBtn) {
                resetStatsBtn.addEventListener('click', () => {
                    if (confirm('Reset session statistics?')) {
                        resetSessionStats();
                        updateHUDDisplay();
                        addLog('Session stats reset');
                    }
                });
            }
            if (battleLimitInput) {
                battleLimitInput.addEventListener('change', (e) => {
                    queueState.battleLimit = parseInt(e.target.value) || 0;
                    saveSessionState();
                    updateBattleRemainingDisplay();
                });
            }
        }
        // Battle page doesn't need manual controls - auto-starts
    }


    function updateHUDDisplay() {
        if (currentPage.includes('pvp.php')) {
            const tokens = getPvPTokens();
            document.getElementById('token-display').textContent = tokens ? `${tokens}/20` : 'N/A';
            document.getElementById('wins-display').textContent = queueState.battlesWon;
            document.getElementById('losses-display').textContent = queueState.battlesLost;
            document.getElementById('total-display').textContent = queueState.totalBattles;
            updateBattleRemainingDisplay();
        } else if (currentPage.includes('pvp_battle.php')) {
            const playerHP = getPlayerHP();
            const enemyHP = getEnemyHP();
            if (document.getElementById('player-hp-display')) {
                document.getElementById('player-hp-display').textContent = playerHP || 'N/A';
            }
            if (document.getElementById('enemy-hp-display')) {
                document.getElementById('enemy-hp-display').textContent = enemyHP || 'N/A';
            }
        }
    }

    function updateBattleRemainingDisplay() {
        const remainingDisplay = document.getElementById('remaining-display');
        const battlesRemainingSpan = document.getElementById('battles-remaining');

        if (queueState.battleLimit > 0) {
            queueState.battlesRemaining = Math.max(0, queueState.battleLimit - queueState.totalBattles);
            remainingDisplay.style.display = 'block';
            battlesRemainingSpan.textContent = queueState.battlesRemaining;
        } else {
            remainingDisplay.style.display = 'none';
        }
    }

    function updateStatus(message) {
        document.getElementById('status-text').textContent = message;
        addLog(message);
    }

    function addLog(message) {
        const logContainer = document.getElementById('log-container');
        const logEntry = document.createElement('div');
        const timestamp = new Date().toLocaleTimeString();
        logEntry.textContent = `[${timestamp}] ${message}`;
        logContainer.appendChild(logEntry);
        logContainer.scrollTop = logContainer.scrollHeight;
    }

    function showPrediction(willWin) {
        const predictionText = document.getElementById('prediction-text');
        if (predictionText) {
            if (willWin) {
                predictionText.textContent = '🎯 Victory predicted - fighting to the end!';
                predictionText.style.color = '#00ff00';
            } else {
                predictionText.textContent = '⚠️ Defeat predicted - fighting to the end!';
                predictionText.style.color = '#ff4444';
            }
        }
    }

    // --- Game Element Functions ---
    function getPvPTokens() {
        const tokenEl = document.evaluate(
            '//*[@id="pvp-coins"]',
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
        ).singleNodeValue;
        return tokenEl ? parseInt(tokenEl.textContent.trim()) : null;
    }

    function clickStartPvP() {
        const startBtn = document.evaluate(
            '//*[@id="btnStartTop"]',
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
        ).singleNodeValue;

        if (startBtn) {
            startBtn.click();
            return true;
        }
        return false;
    }
    function getPlayerHP() {
        const hpEl = document.evaluate(
            '//*[@id="myHpText"]',
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
        ).singleNodeValue;
        return hpEl ? hpEl.textContent.trim() : null;
    }

    function getEnemyHP() {
        const hpEl = document.evaluate(
            '//*[@id="enemyHpText"]',
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
        ).singleNodeValue;
        return hpEl ? hpEl.textContent.trim() : null;
    }

    function getNotification() {
        const notificationEl = document.evaluate(
            '//*[@id="notification"]',
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
        ).singleNodeValue;
        return notificationEl ? notificationEl.textContent.trim() : null;
    }

    function isBattleEnded() {
        const endTitleEl = document.evaluate(
            '//*[@id="endTitle"]',
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
        ).singleNodeValue;

        if (endTitleEl) {
            const text = endTitleEl.textContent.trim();
            if (text.includes('🏁 Victory!')) {
                return { ended: true, victory: true };
            } else if (text.includes('❌ Defeat')) {
                return { ended: true, victory: false };
            }
        }

        return { ended: false, victory: null };
    }
    function containsSubstring(str, substring) {
        return str.toLowerCase().includes(substring.toLowerCase());
    }

    function clickSlash() {
        const slashSubstring = "Slash";
        const btn1 = document.evaluate(
            '/html/body/div[2]/div/div[3]/div[6]/button[1]',
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
        ).singleNodeValue;
        const btn2 = document.evaluate(
            '/html/body/div[2]/div/div[4]/div[6]/button[1]',
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
        ).singleNodeValue;
        const btn3 = document.evaluate(
            '/html/body/div[4]/div[6]/button',
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
        ).singleNodeValue;
        const btn4 = document.evaluate(
            '/html/body/div[5]/div[6]/button',
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
        ).singleNodeValue;

        if (btn1) {
            if (containsSubstring(btn1.textContent, slashSubstring)) {
            btn1.click()
            return true
            }
        }
        if (btn2) {
            if (containsSubstring(btn2.textContent, slashSubstring)) {
            btn2.click()
            return true
            }
        }
        if (btn3) {
            if (containsSubstring(btn3.textContent, slashSubstring)) {
            btn3.click()
            return true
            }
        }
        if (btn4) {
            if (containsSubstring(btn4.textContent, slashSubstring)) {
            btn4.click()
            return true
            }
        }
        return false;
    }



    // --- Queue Management ---
    function startAutoQueue() {
        // Get battle limit from input
        const battleLimitInput = document.getElementById('battle-limit-input');
        queueState.battleLimit = parseInt(battleLimitInput.value) || 0;
        queueState.battlesRemaining = queueState.battleLimit;

        queueState.autoQueue = true;
        saveSessionState();

        const autoQueueBtn = document.getElementById('auto-queue-btn');
        const stopQueueBtn = document.getElementById('stop-queue-btn');

        autoQueueBtn.style.display = 'none';
        stopQueueBtn.style.display = 'inline-block';

        if (queueState.battleLimit > 0) {
            updateStatus(`Auto-queue started! Target: ${queueState.battleLimit} battles`);
            addLog(`Auto-queue activated for ${queueState.battleLimit} battles`);
        } else {
            updateStatus('Auto-queue started! Using all tokens');
            addLog('Auto-queue activated - will use all available tokens');
        }

        updateBattleRemainingDisplay();

        // Start the queue loop
        queueLoop();
    }

    function stopAutoQueue() {
        queueState.autoQueue = false;

        const autoQueueBtn = document.getElementById('auto-queue-btn');
        const stopQueueBtn = document.getElementById('stop-queue-btn');

        autoQueueBtn.style.display = 'inline-block';
        stopQueueBtn.style.display = 'none';

        updateStatus('Auto-queue stopped');
        addLog('Auto-queue deactivated');
    }

    function queueLoop() {
        if (!queueState.autoQueue) return;

        updateHUDDisplay();

        // Check battle limit first
        if (queueState.battleLimit > 0 && queueState.totalBattles >= queueState.battleLimit) {
            updateStatus('Battle limit reached!');
            addLog(`Completed ${queueState.battleLimit} battles - stopping queue`);
            stopAutoQueue();
            return;
        }

        // Check tokens
        const tokens = getPvPTokens();
        if (!tokens || tokens <= 0) {
            updateStatus('No PvP tokens available - queue stopped');
            addLog('No tokens remaining - auto-queue stopped');
            stopAutoQueue();
            return;
        }

        updateStatus('Starting PvP battle...');
        if (queueState.battleLimit > 0) {
            addLog(`Starting battle ${queueState.totalBattles + 1}/${queueState.battleLimit} (${tokens} tokens)`);
        } else {
            addLog(`Starting battle (${tokens} tokens remaining)`);
        }

        if (clickStartPvP()) {
            // Battle will start and page will redirect
            // The script will continue on the battle page
        } else {
            updateStatus('❌ Start button not found');
            setTimeout(() => queueLoop(), 5000);
        }
    }
    // --- Battle Logic ---
    function startAutoSlashing() {
        if (battleState.autoSlashing) return;

        battleState.isActive = true;
        battleState.autoSlashing = true;

        updateStatus('Auto-battle started');
        addLog('Beginning auto-slash sequence');

        // Make first attack immediately
        makeAttack();
    }

    function makeAttack() {
        if (!battleState.autoSlashing || battleState.battleEnded) return;

        updateStatus('Attacking...');

        if (clickSlash()) {
            // Wait for server response and check result
            setTimeout(() => {
                checkAttackResult();
            }, 500);
        } else {
            updateStatus('❌ Slash button not found');
            stopAutoSlashing();
        }
    }

    function checkAttackResult() {
        const notification = getNotification();

        if (!notification) {
            // No notification yet, wait a bit more
            setTimeout(() => checkAttackResult(), 300);
            return;
        }

        addLog(`Notification: ${notification}`);

        // Check for cooldown message
        if (notification.includes('⏳ Cooldown')) {
            updateStatus('Cooldown active, waiting...');
            setTimeout(() => makeAttack(), 1100);
            return;
        }

        // First attack - determine win prediction
        if (!battleState.firstAttackMade) {
            battleState.firstAttackMade = true;

            if (notification.includes('You won the exchange: dealt')) {
                battleState.willWin = true;
                showPrediction(true);
                updateStatus('Victory predicted - continuing battle');
                setTimeout(() => makeAttack(), 1100);

            } else if (notification.includes('Enemy gained the upper hand: dealt')) {
                battleState.willWin = false;
                showPrediction(false);
                updateStatus('Defeat predicted - fighting to the end');
                setTimeout(() => makeAttack(), 1100);

            } else {
                // Unknown notification, continue
                updateStatus('Unknown result, continuing battle');
                setTimeout(() => makeAttack(), 1100);
            }
        } else {
            // Subsequent attacks - continue fighting
            setTimeout(() => makeAttack(), 1100);
        }
    }

    function surrenderBattle() {
        // Removed - no longer surrendering
    }

    function stopAutoSlashing() {
        battleState.autoSlashing = false;

        if (slashInterval) {
            clearInterval(slashInterval);
            slashInterval = null;
        }

        updateStatus('Battle ended');
    }

    function checkBattleEnd() {
        const battleResult = isBattleEnded();

        if (battleResult.ended) {
            battleState.battleEnded = true;
            stopAutoSlashing();

            // Update stats and save
            queueState.totalBattles++;

            if (battleResult.victory) {
                queueState.battlesWon++;
                updateStatus('🎉 Victory! Returning to queue...');
                addLog('Battle won - returning to dashboard');
            } else {
                queueState.battlesLost++;
                updateStatus('💀 Defeat! Returning to queue...');
                addLog('Battle lost - returning to dashboard');
            }

            saveSessionState();

            saveSessionState();

            // Set flag to continue queue when returning to dashboard
            localStorage.setItem('veyra_continue_queue', 'true');

            // Return to PvP dashboard immediately (no delay)
            setTimeout(() => {
                window.location.href = 'https://demonicscans.org/pvp.php';
            }, 1500);
        }
    }

    // --- Main Loop ---
    function gameLoop() {
        // Update HP display
        updateHUDDisplay();

        // Check if battle ended
        checkBattleEnd();

        // Continue loop
        if (!battleState.battleEnded) {
            setTimeout(() => gameLoop(), 1000);
        }
    }

    // --- Initialization ---
    function initialize() {
        currentPage = window.location.href;

        // Load saved session state first
        loadSessionState();

        // Create HUD
        createHUD();

        if (currentPage.includes('pvp.php')) {
            // PvP Dashboard
            function waitForDashboardElements() {
                const tokens = getPvPTokens();

                if (tokens !== null) {
                    updateStatus('Dashboard ready');
                    updateHUDDisplay();

                    // Restore battle limit input
                    const battleLimitInput = document.getElementById('battle-limit-input');
                    if (battleLimitInput) {
                        battleLimitInput.value = queueState.battleLimit;
                    }

                    // Check if we should continue auto-queuing
                    if (localStorage.getItem('veyra_continue_queue') === 'true') {
                        localStorage.removeItem('veyra_continue_queue');

                        // Check if we should continue based on limits
                        const shouldContinue =
                            (queueState.battleLimit === 0 && tokens > 0) || // Unlimited and has tokens
                            (queueState.battleLimit > 0 && queueState.totalBattles < queueState.battleLimit && tokens > 0); // Has limit and not reached

                        if (shouldContinue) {
                            addLog('Continuing auto-queue after battle');
                            setTimeout(() => startAutoQueue(), 1000);
                        } else {
                            updateStatus('Auto-queue completed!');
                            if (queueState.battleLimit > 0) {
                                addLog(`All ${queueState.battleLimit} battles completed!`);
                            } else {
                                addLog('All tokens used - queue completed');
                            }
                        }
                    }
                } else {
                    setTimeout(waitForDashboardElements, 500);
                }
            }

            waitForDashboardElements();

        } else if (currentPage.includes('pvp_battle.php')) {
            // PvP Battle - auto-start fighting
            function waitForBattleElements() {
                const playerHP = getPlayerHP();

                if (playerHP) {
                    updateHUDDisplay();
                    addLog('Battle detected - starting auto-fight');

                    // Auto-start battle
                    setTimeout(() => startAutoSlashing(), 1000);

                    // Start battle monitoring loop
                    gameLoop();
                } else {
                    setTimeout(waitForBattleElements, 500);
                }
            }

            waitForBattleElements();
        }
    }

    // Start the script
    initialize();

})();