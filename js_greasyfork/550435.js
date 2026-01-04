// ==UserScript==
// @name         Session B&B Tracker - With UI
// @namespace    http://tampermonkey.net/
// @version      4.0
// @license MIT
// @description  B&B tracking with visual interface
// @author       DuckOfDestiny
// @match        https://www.torn.com/page.php?sid=holdem*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/550435/Session%20BB%20Tracker%20-%20With%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/550435/Session%20BB%20Tracker%20-%20With%20UI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let messageBoxObserver = null;
    let currentHand = null;
    let uiUpdateInterval = null;
    let lastHandHistory = null; // Store previous hand history

    // Hand tracking data structure
    function createNewHand() {
        return {
            phase: 'preflop',
            raisedPreflop: false,
            smallBlind: null,
            bigBlind: null,
            preflopActions: [],
            activeOpponents: 0,
            hadPosition: false,
            analyzed: false,
            positionAnalysis: '',
            opponentAnalysis: '',
            finalResult: '',
            startTime: Date.now()
        };
    }

    // Initialize DOM monitoring
    function initPokerObserver() {
        const pokerWrapper = document.querySelector("div.holdemWrapper___D71Gy");
        if (!pokerWrapper) return;

        const observer = new MutationObserver(reObserveMessageBox);
        const observerConfig = { attributes: false, childList: true, subtree: false };
        observer.observe(pokerWrapper, observerConfig);
        reObserveMessageBox();
    }

    function reObserveMessageBox() {
        if (!messageBoxObserver) {
            messageBoxObserver = new MutationObserver(handleMessageBoxChange);
        }
        messageBoxObserver.disconnect();
        const messagesWrap = document.querySelector("div.holdemWrapper___D71Gy div.messagesWrap___tBx9u");
        if (messagesWrap) {
            const observerConfig = { attributes: true, childList: true, subtree: false };
            messageBoxObserver.observe(messagesWrap, observerConfig);
        }
    }

    function handleMessageBoxChange(mutated) {
        if (mutated.length >= 40) return;
        for (const mutation of mutated) {
            for (const node of mutation.addedNodes) {
                if (node.classList && node.classList.contains("message___RlFXd")) {
                    const messageText = node.innerText.trim();

                    // Hand boundary tracking
                    if (messageText.includes('Game')) {
                        // Save previous hand history if it exists and Duck raised
                        if (currentHand && currentHand.raisedPreflop && currentHand.analyzed) {
                            lastHandHistory = {
                                preflopActions: [...currentHand.preflopActions],
                                positionAnalysis: currentHand.positionAnalysis,
                                opponentAnalysis: currentHand.opponentAnalysis,
                                finalResult: currentHand.finalResult
                            };
                        }

                        if (currentHand) {
                            currentHand = createNewHand();
                        } else {
                            currentHand = createNewHand();
                        }
                    }

                    // Track actions in current hand
                    if (currentHand) {
                        // Blind detection
                        if (messageText.includes('posted small blind') && currentHand.phase === 'preflop') {
                            const playerName = extractPlayerName(messageText);
                            if (playerName) {
                                currentHand.smallBlind = playerName;
                            }
                        }

                        if (messageText.includes('posted big blind') && currentHand.phase === 'preflop') {
                            const playerName = extractPlayerName(messageText);
                            if (playerName) {
                                currentHand.bigBlind = playerName;
                            }
                        }

                        // Collect all preflop actions
                        if (currentHand.phase === 'preflop' && isPlayerAction(messageText)) {
                            const playerName = extractPlayerName(messageText);
                            const action = getActionType(messageText);
                            if (playerName && action) {
                                currentHand.preflopActions.push({
                                    player: playerName,
                                    action: action,
                                    message: messageText
                                });

                                // Track if DuckOfDestiny raised
                                if (playerName === 'DuckOfDestiny' && action === 'raised') {
                                    currentHand.raisedPreflop = true;
                                }
                            }
                        }

                        // Flop detection - analyze collected preflop actions
                        if (messageText.includes('The flop:')) {
                            currentHand.phase = 'flop';
                            if (!currentHand.analyzed) {
                                analyzeBreadAndButter();
                                currentHand.analyzed = true;
                            }
                        }
                    }
                }
            }
        }
    }

    function analyzeBreadAndButter() {
        // First determine if Duck maintained aggression throughout preflop
        determineFinalAggressor();

        if (!currentHand.raisedPreflop) {
            currentHand.finalResult = 'Duck did not maintain preflop aggression (called instead of raising/reraising)';
            return;
        }

        // Analyze position
        analyzePosition();

        // Count active opponents
        countActiveOpponentsFromActions();

        // Generate final result
        const correctOpponents = currentHand.activeOpponents >= 1 && currentHand.activeOpponents <= 2;

        if (correctOpponents && currentHand.hadPosition) {
            currentHand.finalResult = `COMPLETE B&B! Raised preflop + correct opponents (${currentHand.activeOpponents}) + had position`;
        } else if (correctOpponents) {
            currentHand.finalResult = `B&B setup (correct opponents: ${currentHand.activeOpponents}) but no position`;
        } else if (currentHand.hadPosition) {
            currentHand.finalResult = `B&B position but wrong opponent count (${currentHand.activeOpponents} opponents)`;
        } else {
            currentHand.finalResult = `B&B failed: no position and wrong opponent count (${currentHand.activeOpponents} opponents)`;
        }
    }

    function determineFinalAggressor() {
        let duckFinalAction = null;
        let lastDuckRaiseIndex = -1;
        let analysisSteps = [];

        // Find Duck's last action and last raise
        for (let i = currentHand.preflopActions.length - 1; i >= 0; i--) {
            const action = currentHand.preflopActions[i];
            if (action.player === 'DuckOfDestiny') {
                if (!duckFinalAction) {
                    duckFinalAction = action.action;
                }
                if (action.action === 'raised' && lastDuckRaiseIndex === -1) {
                    lastDuckRaiseIndex = i;
                }
            }
        }

        if (lastDuckRaiseIndex === -1) {
            // Duck never raised at all
            currentHand.raisedPreflop = false;
            currentHand.positionAnalysis = 'Duck never raised preflop';
            analysisSteps.push('Duck never raised preflop');
        } else {
            // Check if anyone raised after Duck's last raise
            let someoneRaisedAfterDuck = false;
            for (let i = lastDuckRaiseIndex + 1; i < currentHand.preflopActions.length; i++) {
                const action = currentHand.preflopActions[i];
                if (action.player !== 'DuckOfDestiny' && action.action === 'raised') {
                    someoneRaisedAfterDuck = true;
                    analysisSteps.push(`${action.player} raised after Duck's last raise`);
                    break;
                }
            }

            if (someoneRaisedAfterDuck) {
                // Someone raised after Duck - check Duck's response
                if (duckFinalAction === 'called') {
                    currentHand.raisedPreflop = false;
                    analysisSteps.push('Duck called a reraise instead of reraising - lost initiative');
                } else if (duckFinalAction === 'raised') {
                    currentHand.raisedPreflop = true;
                    analysisSteps.push('Duck reraised - maintained initiative');
                } else if (duckFinalAction === 'folded') {
                    currentHand.raisedPreflop = false;
                    analysisSteps.push('Duck folded to reraise - lost initiative');
                } else {
                    currentHand.raisedPreflop = false;
                    analysisSteps.push(`Duck's final action was ${duckFinalAction} - did not maintain aggression`);
                }
            } else {
                // No one raised after Duck's last raise - Duck maintained aggression
                currentHand.raisedPreflop = true;
                analysisSteps.push('Duck was final aggressor preflop - maintained initiative');
            }
        }

        // Store the analysis for display
        currentHand.aggressionAnalysis = analysisSteps.join('\n');
    }

    function countActiveOpponentsFromActions() {
        if (!currentHand.raisedPreflop) {
            currentHand.activeOpponents = 0;
            currentHand.opponentAnalysis = 'No preflop raise by DuckOfDestiny';
            return;
        }

        let activePlayers = new Set();
        let duckLastRaiseIndex = -1;
        let analysisSteps = [];

        // Find Duck's last raise in the action sequence
        for (let i = currentHand.preflopActions.length - 1; i >= 0; i--) {
            const action = currentHand.preflopActions[i];
            if (action.player === 'DuckOfDestiny' && action.action === 'raised') {
                duckLastRaiseIndex = i;
                analysisSteps.push(`Found Duck's last raise at action ${i + 1}`);
                break;
            }
            // If Duck folded after his last raise, no B&B
            if (action.player === 'DuckOfDestiny' && action.action === 'folded') {
                currentHand.activeOpponents = 0;
                currentHand.opponentAnalysis = 'Duck folded after raising - no B&B possible';
                return;
            }
        }

        if (duckLastRaiseIndex === -1) {
            currentHand.activeOpponents = 0;
            currentHand.opponentAnalysis = 'No valid Duck raise found';
            return;
        }

        // Count calls to Duck's last raise
        for (let i = duckLastRaiseIndex + 1; i < currentHand.preflopActions.length; i++) {
            const action = currentHand.preflopActions[i];

            if (action.player === 'DuckOfDestiny') {
                if (action.action === 'folded') {
                    // Duck folded - no B&B
                    currentHand.activeOpponents = 0;
                    currentHand.opponentAnalysis = 'Duck folded after raising - no B&B possible';
                    return;
                } else if (action.action === 'raised') {
                    // Duck raised again - reset count and continue from this new raise
                    activePlayers.clear();
                    duckLastRaiseIndex = i;
                    analysisSteps.push(`Duck raised again - reset count from action ${i + 1}`);
                }
                continue;
            }

            if (action.action === 'called') {
                activePlayers.add(action.player);
                analysisSteps.push(`${action.player} called Duck's raise`);
            } else if (action.action === 'raised') {
                // Someone reraised Duck - reset count, wait for Duck's response
                activePlayers.clear();
                analysisSteps.push(`${action.player} reraised Duck - cleared count`);
            } else if (action.action === 'folded') {
                analysisSteps.push(`${action.player} folded to Duck's raise`);
            }
        }

        currentHand.activeOpponents = activePlayers.size;
        analysisSteps.push(`Final count: ${activePlayers.size} opponents (${Array.from(activePlayers).join(', ')})`);
        currentHand.opponentAnalysis = analysisSteps.join('\n');
    }

    function analyzePosition() {
        if (!currentHand.raisedPreflop) {
            currentHand.positionAnalysis = 'No preflop raise by DuckOfDestiny';
            return;
        }

        let analysisSteps = [];

        // Handle blind position edge cases first
        if (currentHand.smallBlind === 'DuckOfDestiny') {
            // Small blind can never have position postflop
            currentHand.hadPosition = false;
            currentHand.positionAnalysis = 'DuckOfDestiny is Small Blind - never has position postflop';
            return;
        }

        if (currentHand.bigBlind === 'DuckOfDestiny') {
            // Big blind has position only if no non-SB players called Duck's last raise
            let hasPosition = true;
            analysisSteps.push('DuckOfDestiny is Big Blind');

            // Find Duck's last raise and check who responded
            let duckLastRaiseIndex = -1;
            for (let i = currentHand.preflopActions.length - 1; i >= 0; i--) {
                const action = currentHand.preflopActions[i];
                if (action.player === 'DuckOfDestiny' && action.action === 'raised') {
                    duckLastRaiseIndex = i;
                    break;
                }
            }

            if (duckLastRaiseIndex !== -1) {
                // Check actions after Duck's last raise
                for (let i = duckLastRaiseIndex + 1; i < currentHand.preflopActions.length; i++) {
                    const action = currentHand.preflopActions[i];

                    if (action.player !== currentHand.smallBlind && action.action === 'called') {
                        // Non-small blind player called BB's raise
                        hasPosition = false;
                        analysisSteps.push(`${action.player} (non-SB) called BB's raise - position lost`);
                        break;
                    } else if (action.player === currentHand.smallBlind) {
                        analysisSteps.push(`${action.player} (SB) responded - position maintained`);
                    }
                }
            }

            currentHand.hadPosition = hasPosition;
            analysisSteps.push(`Final result: ${hasPosition ? 'HAS position' : 'NO position'}`);
            currentHand.positionAnalysis = analysisSteps.join('\n');
            return;
        }

        // Regular position analysis for non-blind positions
        analysisSteps.push('Analyzing non-blind position');

        // Find players who acted before Duck's first action
        const playersWhoActedBeforeDuck = [];
        for (const action of currentHand.preflopActions) {
            if (action.player === 'DuckOfDestiny') {
                break; // Stop when we reach Duck's first action
            }
            playersWhoActedBeforeDuck.push(action.player);
        }

        analysisSteps.push(`Players who acted before Duck: ${playersWhoActedBeforeDuck.join(', ')}`);

        // Find Duck's last raise
        let duckLastRaiseIndex = -1;
        for (let i = currentHand.preflopActions.length - 1; i >= 0; i--) {
            const action = currentHand.preflopActions[i];
            if (action.player === 'DuckOfDestiny' && action.action === 'raised') {
                duckLastRaiseIndex = i;
                break;
            }
        }

        if (duckLastRaiseIndex === -1) {
            currentHand.hadPosition = false;
            currentHand.positionAnalysis = 'No valid Duck raise found';
            return;
        }

        const blinds = [currentHand.smallBlind, currentHand.bigBlind].filter(Boolean);
        analysisSteps.push(`Blinds: ${blinds.join(', ')}`);

        // Check each action after Duck's last raise
        let hasPosition = true;

        for (let i = duckLastRaiseIndex + 1; i < currentHand.preflopActions.length; i++) {
            const action = currentHand.preflopActions[i];
            const playerName = action.player;

            if (playerName === 'DuckOfDestiny') continue; // Skip Duck's own actions

            if (action.action === 'called' || action.action === 'raised') {
                // Check if this player is allowed to act
                const isBlind = blinds.includes(playerName);
                const alreadyActed = playersWhoActedBeforeDuck.includes(playerName);

                if (!isBlind && !alreadyActed) {
                    // This is a NEW non-blind player acting after Duck's raise
                    hasPosition = false;
                    analysisSteps.push(`${playerName} acted after Duck's raise (not blind, didn't act before) - position lost`);
                    break;
                } else {
                    const reason = isBlind ? 'is blind' : 'already acted before';
                    analysisSteps.push(`${playerName} allowed to act (${reason}) - position maintained`);
                }
            }
        }

        currentHand.hadPosition = hasPosition;
        analysisSteps.push(`Final result: ${hasPosition ? 'HAS position' : 'NO position'}`);
        currentHand.positionAnalysis = analysisSteps.join('\n');
    }

    function isPlayerAction(messageText) {
        const actionWords = ['checked', 'bet', 'called', 'raised', 'folded', 'posted small blind', 'posted big blind'];
        return actionWords.some(word => messageText.includes(word));
    }

    function getActionType(messageText) {
        if (messageText.includes('folded')) return 'folded';
        if (messageText.includes('called')) return 'called';
        if (messageText.includes('raised')) return 'raised';
        if (messageText.includes('bet')) return 'bet';
        if (messageText.includes('checked')) return 'checked';
        if (messageText.includes('posted small blind')) return 'posted_sb';
        if (messageText.includes('posted big blind')) return 'posted_bb';
        return 'unknown';
    }

    function extractPlayerName(messageText) {
        // Player actions format: "PlayerName checked" or "PlayerName bet $100" or "PlayerName posted small blind $50"
        const match = messageText.match(/^(.+?)\s+(checked|bet|called|raised|folded|posted)/);
        return match ? match[1].trim() : null;
    }

    // UI Functions
    function createTrackerUI() {
        const trackerHTML = `
            <div id="breadButterTracker">
                <div class="tracker-header" id="trackerHeader">
                    <div class="control-buttons">
                        <button class="control-button" id="minimizeButton" title="Minimize">−</button>
                    </div>
                    <h3 class="tracker-title">Bread & Butter</h3>
                </div>

                <div class="tracker-content" id="trackerContent">
                    <div id="condition1" class="condition unknown">
                        <span class="condition-text">Pre-flop Raiser</span>
                        <span class="condition-status">?</span>
                    </div>

                    <div id="condition2" class="condition unknown">
                        <span class="condition-text">In Position</span>
                        <span class="condition-status">?</span>
                    </div>

                    <div id="condition3" class="condition unknown">
                        <span class="condition-text">1-2 Opponents</span>
                        <span class="condition-status">?</span>
                    </div>

                    <div class="score-display">
                        <span id="scoreNumber" class="score-number">0</span>
                        <div class="score-label">/ 3 Conditions Met</div>
                    </div>

                    <div id="handHistory" class="hand-history" style="display: none;">
                        <div class="history-header">Hand History</div>
                        <div id="historyContent" class="history-content"></div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', trackerHTML);
    }

    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #breadButterTracker {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 280px;
                background: rgba(0, 0, 0, 0.95);
                border: 2px solid #4CAF50;
                border-radius: 12px;
                padding: 20px;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                color: white;
                z-index: 10000;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(10px);
                user-select: none;
            }

            #breadButterTracker.minimized .tracker-content {
                display: none;
            }

            .tracker-header {
                text-align: center;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 1px solid #555;
                position: relative;
                cursor: move;
            }

            .tracker-title {
                font-size: 18px;
                font-weight: bold;
                color: #4CAF50;
                margin: 0;
            }

            .control-buttons {
                position: absolute;
                top: 0;
                right: 0;
            }

            .control-button {
                background: rgba(255, 255, 255, 0.1);
                border: none;
                color: #ccc;
                font-size: 16px;
                cursor: pointer;
                padding: 4px 8px;
                border-radius: 4px;
                transition: all 0.2s ease;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .control-button:hover {
                background: rgba(255, 255, 255, 0.2);
                color: white;
            }

            .condition {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 10px;
                margin: 8px 0;
                border-radius: 8px;
                border-left: 4px solid;
                transition: all 0.3s ease;
            }

            .condition.met {
                background: rgba(76, 175, 80, 0.2);
                border-left-color: #4CAF50;
            }

            .condition.not-met {
                background: rgba(244, 67, 54, 0.2);
                border-left-color: #f44336;
            }

            .condition.unknown {
                background: rgba(255, 193, 7, 0.2);
                border-left-color: #FFC107;
            }

            .condition-text {
                font-size: 14px;
                flex: 1;
            }

            .condition-status {
                font-size: 20px;
                font-weight: bold;
                margin-left: 10px;
            }

            .score-display {
                text-align: center;
                margin: 15px 0;
                padding: 15px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 8px;
            }

            .score-number {
                font-size: 36px;
                font-weight: bold;
                color: #4CAF50;
                display: block;
            }

            .score-label {
                font-size: 14px;
                color: #ccc;
                margin-top: 5px;
            }

            .hand-history {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
                padding: 12px;
                margin-top: 15px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                font-size: 12px;
                max-height: 300px;
                overflow-y: auto;
            }

            .history-header {
                font-size: 14px;
                font-weight: bold;
                color: #4CAF50;
                margin-bottom: 10px;
                text-align: center;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                padding-bottom: 5px;
            }

            .history-content {
                color: #ddd;
                line-height: 1.4;
            }

            .history-section {
                margin-bottom: 12px;
            }

            .history-section-title {
                font-weight: bold;
                color: #FFC107;
                margin-bottom: 5px;
            }

            .action-line {
                margin: 2px 0;
                padding: 2px 0;
            }

            .analysis-line {
                margin: 3px 0;
                padding: 2px 0;
                font-style: italic;
                color: #bbb;
            }

            .result-line {
                margin: 5px 0;
                padding: 5px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 4px;
                font-weight: bold;
            }

            .perfect-spot {
                animation: perfectSpotGlow 2s ease-in-out infinite alternate;
            }

            @keyframes perfectSpotGlow {
                0% { box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3); }
                100% { box-shadow: 0 8px 25px rgba(76, 175, 80, 0.5); }
            }
        `;
        document.head.appendChild(style);
    }

    function updateUI() {
        if (!currentHand) return;

        // Calculate conditions
        const conditions = [
            {
                met: currentHand.raisedPreflop,
                status: currentHand.raisedPreflop ? 'met' : (currentHand.phase === 'preflop' ? 'unknown' : 'not-met'),
                symbol: currentHand.raisedPreflop ? '✓' : (currentHand.phase === 'preflop' ? '?' : '✗')
            },
            {
                met: currentHand.hadPosition,
                status: currentHand.analyzed ? (currentHand.hadPosition ? 'met' : 'not-met') : 'unknown',
                symbol: currentHand.analyzed ? (currentHand.hadPosition ? '✓' : '✗') : '?'
            },
            {
                met: currentHand.activeOpponents >= 1 && currentHand.activeOpponents <= 2,
                status: currentHand.analyzed ?
                       (currentHand.activeOpponents >= 1 && currentHand.activeOpponents <= 2 ? 'met' : 'not-met') : 'unknown',
                symbol: currentHand.analyzed ?
                       (currentHand.activeOpponents >= 1 && currentHand.activeOpponents <= 2 ? '✓' : '✗') : '?'
            }
        ];

        // Update condition displays
        conditions.forEach((condition, index) => {
            const element = document.getElementById(`condition${index + 1}`);
            if (element) {
                element.className = `condition ${condition.status}`;
                const statusElement = element.querySelector('.condition-status');
                if (statusElement) {
                    statusElement.textContent = condition.symbol;
                }
            }
        });

        // Calculate and update score
        const score = conditions.filter(c => c.met).length;
        const scoreElement = document.getElementById('scoreNumber');
        if (scoreElement) {
            scoreElement.textContent = score;
        }

        // Update perfect spot animation
        const tracker = document.getElementById('breadButterTracker');
        if (tracker) {
            if (score === 3 && currentHand.analyzed) {
                tracker.classList.add('perfect-spot');
            } else {
                tracker.classList.remove('perfect-spot');
            }
        }

        // Update hand history display
        updateHandHistory();
    }

    function updateHandHistory() {
        const historyDiv = document.getElementById('handHistory');
        const historyContent = document.getElementById('historyContent');

        if (!historyDiv || !historyContent) return;

        let historyToShow = null;

        // Determine which history to show
        if (currentHand && currentHand.raisedPreflop) {
            // Current hand where Duck raised - show current hand history
            historyToShow = currentHand;
        } else if (lastHandHistory) {
            // No current raise, but we have previous hand history - show that
            historyToShow = lastHandHistory;
        }

        if (historyToShow) {
            historyDiv.style.display = 'block';

            let historyHTML = '';

            // Add indicator if showing previous hand
            if (historyToShow === lastHandHistory) {
                historyHTML += `<div style="color: #FFC107; font-size: 11px; text-align: center; margin-bottom: 8px; font-style: italic;">Previous Hand</div>`;
            }

            // Preflop Actions Section
            if (historyToShow.preflopActions && historyToShow.preflopActions.length > 0) {
                historyHTML += `
                    <div class="history-section">
                        <div class="history-section-title">Preflop Action Sequence</div>`;

                historyToShow.preflopActions.forEach((action, index) => {
                    const actionText = `${index + 1}. ${action.player} ${action.action}`;
                    historyHTML += `<div class="action-line">${actionText}</div>`;
                });

                historyHTML += `</div>`;
            }

            // Position Analysis Section
            if (historyToShow.positionAnalysis) {
                historyHTML += `
                    <div class="history-section">
                        <div class="history-section-title">Position Analysis</div>`;

                historyToShow.positionAnalysis.split('\n').forEach(line => {
                    if (line.trim()) {
                        historyHTML += `<div class="analysis-line">${line}</div>`;
                    }
                });

                historyHTML += `</div>`;
            }

            // Opponent Count Analysis Section
            if (historyToShow.opponentAnalysis) {
                historyHTML += `
                    <div class="history-section">
                        <div class="history-section-title">Opponent Count Analysis</div>`;

                historyToShow.opponentAnalysis.split('\n').forEach(line => {
                    if (line.trim()) {
                        historyHTML += `<div class="analysis-line">${line}</div>`;
                    }
                });

                historyHTML += `</div>`;
            }

            // Final Result Section
            if (historyToShow.finalResult) {
                historyHTML += `
                    <div class="history-section">
                        <div class="history-section-title">Final Result</div>
                        <div class="result-line">${historyToShow.finalResult}</div>
                    </div>`;
            }

            historyContent.innerHTML = historyHTML;
        } else {
            historyDiv.style.display = 'none';
        }
    }

    // UI Control Functions
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };

    function setupUIControls() {
        const tracker = document.getElementById('breadButterTracker');
        const header = document.getElementById('trackerHeader');
        const minimizeButton = document.getElementById('minimizeButton');

        if (!tracker || !header || !minimizeButton) {
            console.log('UI elements not found for controls setup');
            return;
        }

        // Load saved position
        const savedPosition = localStorage.getItem('bbTrackerPosition');
        if (savedPosition) {
            try {
                const { x, y } = JSON.parse(savedPosition);
                tracker.style.left = x + 'px';
                tracker.style.top = y + 'px';
                tracker.style.right = 'auto';
            } catch (e) {
                console.log('Failed to load saved position');
            }
        }

        // Setup dragging
        header.addEventListener('mousedown', function(e) {
            if (e.target === minimizeButton || e.target.closest('.control-button')) return; // Don't drag when clicking minimize

            isDragging = true;
            const rect = tracker.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;

            document.addEventListener('mousemove', handleDrag);
            document.addEventListener('mouseup', handleDragEnd);
            e.preventDefault();
        });

        // Setup minimize button
        minimizeButton.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent drag event

            const isMinimized = tracker.classList.contains('minimized');

            if (isMinimized) {
                tracker.classList.remove('minimized');
                minimizeButton.textContent = '−';
                minimizeButton.title = 'Minimize';
            } else {
                tracker.classList.add('minimized');
                minimizeButton.textContent = '+';
                minimizeButton.title = 'Expand';
            }
        });

        console.log('UI controls setup complete');
    }

    function handleDrag(e) {
        if (!isDragging) return;

        const tracker = document.getElementById('breadButterTracker');
        const x = e.clientX - dragOffset.x;
        const y = e.clientY - dragOffset.y;

        // Keep tracker within viewport
        const maxX = window.innerWidth - tracker.offsetWidth;
        const maxY = window.innerHeight - tracker.offsetHeight;

        const clampedX = Math.max(0, Math.min(x, maxX));
        const clampedY = Math.max(0, Math.min(y, maxY));

        tracker.style.left = clampedX + 'px';
        tracker.style.top = clampedY + 'px';
        tracker.style.right = 'auto';
    }

    function handleDragEnd() {
        if (!isDragging) return;

        isDragging = false;
        document.removeEventListener('mousemove', handleDrag);
        document.removeEventListener('mouseup', handleDragEnd);

        // Save position
        const tracker = document.getElementById('breadButterTracker');
        const position = {
            x: parseInt(tracker.style.left) || 0,
            y: parseInt(tracker.style.top) || 0
        };

        try {
            localStorage.setItem('bbTrackerPosition', JSON.stringify(position));
        } catch (e) {
            console.log('Failed to save position');
        }
    }

    // Initialize when poker table is found
    function init() {
        const checkForTable = setInterval(() => {
            const pokerTable = document.querySelector('.holdemWrapper___D71Gy');
            if (pokerTable) {
                clearInterval(checkForTable);

                // Initialize the first hand
                currentHand = createNewHand();

                // Create UI
                injectStyles();
                createTrackerUI();

                // Start tracking
                initPokerObserver();

                // Start UI updates
                uiUpdateInterval = setInterval(updateUI, 500);

                // Setup UI controls after a small delay to ensure DOM is ready
                setTimeout(() => {
                    setupUIControls();
                }, 100);

                console.log('B&B Tracker with UI initialized');
            }
        }, 1000);
    }

    init();

})();