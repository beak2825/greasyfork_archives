// ==UserScript==
// @name         Session Review Framework V2.0
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  In-Memory Chain Analysis System for Poker Sessions
// @author       DuckOfDestiny
// @match        https://www.torn.com/page.php?sid=holdem*
// @grant        none
// @license MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/556211/Session%20Review%20Framework%20V20.user.js
// @updateURL https://update.greasyfork.org/scripts/556211/Session%20Review%20Framework%20V20.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================================================================
    // CHAIN MANAGER - Core State Management
    // ============================================================================
    class ChainManager {
        constructor() {
            this.fullDatabase = [];
            this.chainHistory = [];
        }

        initialize(hands, dbName) {
            this.fullDatabase = hands;
            this.chainHistory = [{
                name: dbName,
                data: hands,
                count: hands.length,
                moduleInfo: null
            }];
        }

        addStep(moduleName, filteredData, moduleInfo) {
            this.chainHistory.push({
                name: moduleName,
                data: filteredData,
                count: filteredData.length,
                moduleInfo: moduleInfo
            });
        }

        jumpToStep(stepIndex) {
            this.chainHistory = this.chainHistory.slice(0, stepIndex + 1);
        }

        back() {
            if (this.chainHistory.length > 1) {
                this.chainHistory.pop();
            }
        }

        reset() {
            this.chainHistory = [this.chainHistory[0]];
        }

        getCurrentData() {
            return this.chainHistory[this.chainHistory.length - 1].data;
        }

        getChainDisplay() {
            return this.chainHistory.map(step => ({
                name: step.name,
                count: step.count
            }));
        }

        getChainLength() {
            return this.chainHistory.length;
        }
    }

    // ============================================================================
    // DATABASE CONNECTION (OPTIONAL - SAME AS V1.0)
    // ============================================================================
    let db = null;

    function connectToDatabase() {
        return new Promise((resolve, reject) => {
            const openRequest = indexedDB.open("pokerHandArchiveDB", 1);

            openRequest.onsuccess = function(event) {
                db = event.target.result;
                console.log('📊 V2.0: Connected to database');
                resolve(db);
            };

            openRequest.onerror = function(event) {
                console.error('V2.0: Database connection failed:', event.target.error);
                reject(event.target.error);
            };

            openRequest.onupgradeneeded = function(event) {
                console.warn('V2.0: Database not found. Load JSON file instead.');
                reject(new Error('Database not initialized'));
            };
        });
    }

    function loadAllHandsFromDB() {
        return new Promise((resolve, reject) => {
            if (!db) {
                reject(new Error('Database not connected'));
                return;
            }

            const transaction = db.transaction(["hands"], "readonly");
            const store = transaction.objectStore("hands");
            const request = store.openCursor();

            const hands = [];

            request.onsuccess = function(event) {
                const cursor = event.target.result;
                if (cursor) {
                    hands.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(hands);
                }
            };

            request.onerror = function() {
                reject(request.error);
            };
        });
    }


    // ============================================================================
    // HELPER FUNCTIONS (From V1.0 - For Module Compatibility)
    // ============================================================================

    function parseAction(text) {
        const action = {
            player: null,
            action: null,
            amount: null,
            raw: text
        };

        let match = text.match(/^(.+?)\s+posted small blind \$([0-9,]+)/);
        if (match) {
            action.player = match[1].trim();
            action.action = 'small_blind';
            action.amount = parseInt(match[2].replace(/,/g, ''));
            return action;
        }

        match = text.match(/^(.+?)\s+posted big blind \$([0-9,]+)/);
        if (match) {
            action.player = match[1].trim();
            action.action = 'big_blind';
            action.amount = parseInt(match[2].replace(/,/g, ''));
            return action;
        }

        match = text.match(/^(.+?)\s+folded/);
        if (match) {
            action.player = match[1].trim();
            action.action = 'fold';
            return action;
        }

        match = text.match(/^(.+?)\s+checked/);
        if (match) {
            action.player = match[1].trim();
            action.action = 'check';
            return action;
        }

        match = text.match(/^(.+?)\s+called \$([0-9,]+)/);
        if (match) {
            action.player = match[1].trim();
            action.action = 'call';
            action.amount = parseInt(match[2].replace(/,/g, ''));
            return action;
        }

        match = text.match(/^(.+?)\s+bet \$([0-9,]+)/);
        if (match) {
            action.player = match[1].trim();
            action.action = 'bet';
            action.amount = parseInt(match[2].replace(/,/g, ''));
            return action;
        }

        match = text.match(/^(.+?)\s+raised \$([0-9,]+) to \$([0-9,]+)/);
        if (match) {
            action.player = match[1].trim();
            action.action = 'raise';
            action.amount = parseInt(match[3].replace(/,/g, ''));
            return action;
        }

        match = text.match(/^(.+?)\s+raised \$([0-9,]+)/);
        if (match) {
            action.player = match[1].trim();
            action.action = 'raise';
            action.amount = parseInt(match[2].replace(/,/g, ''));
            return action;
        }

        return action;
    }

    function parseHandIntoStreets(hand) {
        const streets = {
            preflop: [],
            flop: [],
            turn: [],
            river: []
        };

        let currentStreet = null;

        hand.messages.forEach(msg => {
            const text = msg.text;

            if (text.includes('The preflop')) {
                currentStreet = 'preflop';
                return;
            }
            if (text.includes('The flop')) {
                currentStreet = 'flop';
                return;
            }
            if (text.includes('The turn')) {
                currentStreet = 'turn';
                return;
            }
            if (text.includes('The river')) {
                currentStreet = 'river';
                return;
            }

            if (currentStreet) {
                const action = parseAction(text);
                if (action.player) {
                    streets[currentStreet].push(action);
                }
            }
        });

        return streets;
    }

    function extractBigBlind(messages) {
        for (const msg of messages) {
            const match = msg.text.match(/posted big blind \$([0-9,]+)/);
            if (match) {
                return parseInt(match[1].replace(/,/g, ''));
            }
        }
        return null;
    }

    function extractWinner(messages) {
        for (const msg of messages) {
            const match = msg.text.match(/^(.+?)\s+won \$([0-9,]+) with \[(.+?)\] \((.+?)\)/);
            if (match) {
                return {
                    player: match[1].trim(),
                    amount: parseInt(match[2].replace(/,/g, '')),
                    cards: match[3],
                    hand: match[4]
                };
            }
        }
        return null;
    }

    function getPlayerStack(tableData, playerName) {
        if (!tableData || !tableData.players) return null;

        const heroName = document.getElementById('sr-hero-name')?.value.trim() || null;
        const searchName = (playerName === heroName) ? 'HERO' : playerName;
        const player = tableData.players.find(p => p.name === searchName);
        if (!player) return null;

        const stackStr = player.stack.replace(/,/g, '');
        return parseInt(stackStr);
    }

    function getHeroName() {
    // Return the auto-detected hero name stored in framework
    return window.detectedHeroName || 'HERO';
}
    function getPotSize(hand) {
    if (!hand.messages) return null;

    for (const msg of hand.messages) {
        const match = msg.text.match(/won \$([0-9,]+)/);
        if (match) {
            return parseInt(match[1].replace(/,/g, ''));
        }
    }
    return null;
}

function getPlayerCount(hand) {
    if (hand.tableData && hand.tableData.playerCount) {
        return hand.tableData.playerCount;
    }
    if (hand.tableData && hand.tableData.players) {
        return hand.tableData.players.length;
    }
    return null;
}

function getHeroCards(hand) {
    if (hand.heroCards && hand.heroCards.length > 0) {
        return hand.heroCards.map(c => c.rank + c.suit).join(' ');
    }
    return null;
}

function formatCurrency(amount) {
    if (!amount) return null;
    if (amount >= 1000000000) {
        return '$' + (amount / 1000000000).toFixed(1) + 'B';
    } else if (amount >= 1000000) {
        return '$' + (amount / 1000000).toFixed(1) + 'M';
    } else if (amount >= 1000) {
        return '$' + (amount / 1000).toFixed(1) + 'K';
    }
    return '$' + amount.toLocaleString();
}

function getEffectiveStack(hand, player1, player2) {
    const stack1 = getPlayerStack(hand.tableData, player1);
    const stack2 = getPlayerStack(hand.tableData, player2);
    const bigBlind = extractBigBlind(hand.messages);

    if (!stack1 || !stack2 || !bigBlind) return null;

    const effectiveStack = Math.min(stack1, stack2);
    return Math.round(effectiveStack / bigBlind);
}
    function autoDetectHeroName(hands) {
    // Method 1: Try live DOM detection (if at poker table)
    const heroElement = document.querySelector('.playerMeGateway___AEI5_ .name___cESdZ');
    if (heroElement && heroElement.textContent.trim()) {
        const name = heroElement.textContent.trim();
        console.log('✅ Hero detected from DOM:', name);
        return name;
    }

    // Method 2: Try torn-user hidden input
    const tornUserInput = document.getElementById('torn-user');
    if (tornUserInput && tornUserInput.value) {
        try {
            const userData = JSON.parse(tornUserInput.value);
            if (userData && userData.playername) {
                console.log('✅ Hero detected from torn-user:', userData.playername);
                return userData.playername;
            }
        } catch (e) {
            // Silent fail, continue to next method
        }
    }

    // Method 3: Try additional fallback selectors
    const selectors = [
        '.heroName___qVjqe',
        '.hero-name',
        '.player-name.hero',
        '.name___cESdZ.hero'
    ];

    for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element && element.textContent.trim()) {
            const name = element.textContent.trim();
            console.log('✅ Hero detected from fallback selector:', name);
            return name;
        }
    }

    // Method 4: Scan hand data for heroCards
    if (hands && hands.length > 0) {
        for (const hand of hands) {
            if (hand.heroCards && hand.heroCards.length > 0) {
                if (hand.tableData?.players?.[0]?.name) {
                    const name = hand.tableData.players[0].name;
                    if (name && name !== 'HERO') {
                        console.log('✅ Hero detected from hand data:', name);
                        return name;
                    }
                }
            }
        }
    }

    // Method 5: Check recent poker messages (if at table)
    const messages = document.querySelectorAll('.message___RlFXd');
    for (let i = messages.length - 1; i >= Math.max(0, messages.length - 20); i--) {
        const message = messages[i].textContent;
        const dealtMatch = message.match(/^Dealt to (.+?) \[/);
        if (dealtMatch) {
            const name = dealtMatch[1].trim();
            console.log('✅ Hero detected from messages:', name);
            return name;
        }
    }

    // Fallback: Generic hero
    console.warn('⚠️ Could not detect hero name, using generic "HERO"');
    return 'HERO';
}

    // ============================================
    // POSITION CALCULATION LOGIC
    // ============================================

    function calculatePositions(hand, framework) {
        // Step 1: Find SB and BB from messages
        let sbPlayer = null;
        let bbPlayer = null;

        hand.messages.forEach(msg => {
            if (msg.text.match(/posted small blind/)) {
                const match = msg.text.match(/^(.+?)\s+posted small blind/);
                if (match) sbPlayer = match[1].trim();
            }
            if (msg.text.match(/posted big blind/)) {
                const match = msg.text.match(/^(.+?)\s+posted big blind/);
                if (match) bbPlayer = match[1].trim();
            }
        });

        if (!sbPlayer || !bbPlayer) {
            return null;
        }

        // Step 2: Get active players from tableData
        if (!hand.tableData || !hand.tableData.players) {
            return null;
        }

        const activePlayers = hand.tableData.players.filter(p => true);

        if (activePlayers.length < 2) {
            return null;
        }

        // Step 3: Find SB and BB seat numbers
        const sbSeat = activePlayers.find(p =>
            p.name === sbPlayer || p.name === 'HERO' && sbPlayer === framework.getHeroName()
        )?.seat;

        const bbSeat = activePlayers.find(p =>
            p.name === bbPlayer || p.name === 'HERO' && bbPlayer === framework.getHeroName()
        )?.seat;

        if (sbSeat === undefined || bbSeat === undefined) {
            return null;
        }

        // Step 4: Calculate button seat
        const seatNumbers = activePlayers.map(p => p.seat).sort((a, b) => a - b);
        const sbIndex = seatNumbers.indexOf(sbSeat);
        const buttonIndex = (sbIndex - 1 + seatNumbers.length) % seatNumbers.length;
        const buttonSeat = seatNumbers[buttonIndex];

        // Step 5: Reorder seats clockwise starting from SB
        const orderedSeats = [];
        for (let i = 0; i < seatNumbers.length; i++) {
            const index = (sbIndex + i) % seatNumbers.length;
            orderedSeats.push(seatNumbers[index]);
        }

        // Step 6: Assign position names
        const positions = assignPositionNames(orderedSeats, activePlayers, framework.getHeroName());

        // Step 7: Find hero's position
        const heroPosition = positions.find(p => p.isHero)?.position || null;

        return {
            positions: positions,
            heroPosition: heroPosition,
            buttonSeat: buttonSeat
        };
    }

    function assignPositionNames(orderedSeats, allPlayers, heroName) {
        const playerCount = orderedSeats.length;

        const positionMaps = {
            2: ['SB', 'BB'],
            3: ['SB', 'BB', 'BTN'],
            4: ['SB', 'BB', 'UTG', 'BTN'],
            5: ['SB', 'BB', 'UTG', 'CO', 'BTN'],
            6: ['SB', 'BB', 'UTG', 'MP', 'CO', 'BTN'],
            7: ['SB', 'BB', 'UTG', 'UTG+1', 'MP', 'CO', 'BTN'],
            8: ['SB', 'BB', 'UTG', 'UTG+1', 'UTG+2', 'MP', 'CO', 'BTN'],
            9: ['SB', 'BB', 'UTG', 'UTG+1', 'UTG+2', 'MP1', 'MP2', 'CO', 'BTN']
        };

        const positionNames = positionMaps[playerCount] || positionMaps[9];

        return orderedSeats.map((seat, index) => {
            const player = allPlayers.find(p => p.seat === seat);
            const isHero = player.name === 'HERO' || player.name === heroName;

            return {
                seat: seat,
                playerName: player.name,
                position: positionNames[index] || 'P' + index,
                isHero: isHero,
                clockwiseOrder: index
            };
        });
    }
    // ============================================
    // AUTO-ENRICHMENT
    // ============================================

    function enrichHandsWithPositions(hands) {
        if (!hands || hands.length === 0) return hands;

        let enrichedCount = 0;
        let skippedCount = 0;

        hands.forEach(hand => {
            // Skip if already has positions
            if (hand.positions && hand.heroPosition !== undefined) {
                skippedCount++;
                return;
            }

            // Calculate positions
            const positionData = calculatePositions(hand, window.SessionReviewFramework);

            if (positionData) {
                hand.positions = positionData.positions;
                hand.heroPosition = positionData.heroPosition;
                hand.buttonSeat = positionData.buttonSeat;
                enrichedCount++;
            }
        });

        if (enrichedCount > 0) {
            console.log(`📍 Framework: Enriched ${enrichedCount} hands with positions`);
        }
        if (skippedCount > 0) {
            console.log(`📍 Framework: Skipped ${skippedCount} hands (already have positions)`);
        }

        return hands;
    }
    // Create SessionReviewFramework for modules
    window.SessionReviewFramework = {
    parseAction: parseAction,
    parseHandIntoStreets: parseHandIntoStreets,
    extractBigBlind: extractBigBlind,
    extractWinner: extractWinner,
    getPlayerStack: getPlayerStack,
    getHeroName: getHeroName,
    getPotSize: getPotSize,
    getPlayerCount: getPlayerCount,
    getHeroCards: getHeroCards,
    formatCurrency: formatCurrency,
    getEffectiveStack: getEffectiveStack
};

    // Initialize module registry if it doesn't exist
    if (!window.sessionReviewModules) {
        window.sessionReviewModules = [];
        console.log('📊 V2.0: Created new module registry');
    } else {
        console.log('📊 V2.0: Found existing module registry with ' + window.sessionReviewModules.length + ' modules');
    }

    console.log('📊 V2.0: SessionReviewFramework created');
    console.log('📊 V2.0: Helper functions available:');
    console.log('  - getPotSize(hand)');
    console.log('  - getPlayerCount(hand)');
    console.log('  - getHeroCards(hand)');
    console.log('  - formatCurrency(amount)');
    console.log('  - getEffectiveStack(hand, player1, player2)');
    console.log('📊 V2.0: Waiting for modules to register...');

    // ============================================================================
    // UI CONTROLLER
    // ============================================================================
    class SessionReviewUI {
        constructor() {
            this.chainManager = new ChainManager();
            this.previewResults = null;
            this.selectedModule = null;
            this.isMinimized = false;
            this.isDragging = false;
            this.dragOffset = { x: 0, y: 0 };
            this.createUI();
        }

        createUI() {
            // Create main container
            const container = document.createElement('div');
            container.id = 'sessionReviewV2';
            container.innerHTML = `
                <style>
                    #sessionReviewV2 {
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        width: 900px;
                        max-height: 90vh;
                        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                        border: 2px solid #0f3460;
                        border-radius: 10px;
                        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.7);
                        z-index: 999999;
                        color: #e4e4e4;
                        font-family: 'Segoe UI', Arial, sans-serif;
                        display: flex;
                        flex-direction: column;
                    }
                    #sessionReviewV2.minimized {
                        max-height: none;
                    }
                    .sr-header {
                        background: #0f3460;
                        padding: 12px 15px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        border-radius: 8px 8px 0 0;
                        cursor: move;
                        user-select: none;
                    }
                    .sr-header h1 {
                        margin: 0;
                        font-size: 14px;
                        font-weight: bold;
                        color: #3498db;
                    }
                    .sr-header p {
                        display: none;
                    }
                    .sr-header-controls {
                        display: flex;
                        gap: 8px;
                    }
                    .sr-minimize, .sr-close {
                        background: rgba(255, 255, 255, 0.1);
                        border: none;
                        color: #e4e4e4;
                        width: 28px;
                        height: 28px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 18px;
                        line-height: 1;
                        transition: all 0.2s;
                    }
                    .sr-minimize:hover, .sr-close:hover {
                        background: rgba(255, 255, 255, 0.2);
                    }
                    .sr-content {
                        flex: 1;
                        padding: 20px;
                        overflow-y: auto;
                    }
                    #sessionReviewV2.minimized .sr-content {
                        display: none;
                    }
                    .sr-section {
                        background: rgba(0, 0, 0, 0.2);
                        padding: 15px;
                        border-radius: 6px;
                        margin-bottom: 15px;
                        border: 1px solid #0f3460;
                    }
                    .sr-section h2 {
                        margin: 0 0 15px 0;
                        font-size: 14px;
                        font-weight: bold;
                        color: #3498db;
                    }
                    .sr-btn {
                        padding: 10px 20px;
                        border: none;
                        border-radius: 6px;
                        font-weight: bold;
                        cursor: pointer;
                        transition: all 0.2s;
                        font-size: 14px;
                    }
                    .sr-btn:hover:not(:disabled) {
                        transform: translateY(-1px);
                    }
                    .sr-btn:disabled {
                        opacity: 0.5;
                        cursor: not-allowed;
                    }
                    .sr-btn-primary {
                        background: rgba(52, 152, 219, 0.3);
                        border: 1px solid #3498db;
                        color: #93c5fd;
                    }
                    .sr-btn-primary:hover:not(:disabled) {
                        background: rgba(52, 152, 219, 0.5);
                    }
                    .sr-btn-success {
                        background: rgba(52, 211, 153, 0.3);
                        border: 1px solid #34d399;
                        color: #6ee7b7;
                    }
                    .sr-btn-success:hover:not(:disabled) {
                        background: rgba(52, 211, 153, 0.5);
                    }
                    .sr-btn-warning {
                        background: rgba(245, 158, 11, 0.3);
                        border: 1px solid #f59e0b;
                        color: #fcd34d;
                    }
                    .sr-btn-warning:hover:not(:disabled) {
                        background: rgba(245, 158, 11, 0.5);
                    }
                    .sr-btn-danger {
                        background: rgba(239, 68, 68, 0.3);
                        border: 1px solid #ef4444;
                        color: #fca5a5;
                    }
                    .sr-btn-danger:hover:not(:disabled) {
                        background: rgba(239, 68, 68, 0.5);
                    }
                    .sr-btn-purple {
                        background: rgba(168, 85, 247, 0.3);
                        border: 1px solid #a855f7;
                        color: #e9d5ff;
                    }
                    .sr-btn-purple:hover:not(:disabled) {
                        background: rgba(168, 85, 247, 0.5);
                    }
                    .sr-chain {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        flex-wrap: wrap;
                    }
                    .sr-chain-step {
                        padding: 8px 16px;
                        border-radius: 6px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s;
                        background: #475569;
                        border: none;
                        color: white;
                    }
                    .sr-chain-step:hover {
                        background: #64748b;
                    }
                    .sr-chain-step.active {
                        background: #3498db;
                    }
                    .sr-chain-arrow {
                        color: #64748b;
                        font-size: 20px;
                    }
                    .sr-input {
                        width: 100%;
                        padding: 10px;
                        background: rgba(0, 0, 0, 0.3);
                        border: 1px solid #0f3460;
                        border-radius: 6px;
                        color: #e4e4e4;
                        font-size: 13px;
                    }
                    .sr-flex {
                        display: flex;
                        gap: 10px;
                        align-items: center;
                    }
                    .sr-preview {
                        background: rgba(0, 0, 0, 0.3);
                        border: 2px solid #34d399;
                        border-radius: 6px;
                        padding: 15px;
                        margin-top: 15px;
                    }
                    .sr-preview-title {
                        font-size: 16px;
                        font-weight: bold;
                        color: #6ee7b7;
                        margin-bottom: 10px;
                    }
                    .sr-preview-count {
                        font-size: 18px;
                        margin-bottom: 10px;
                        color: #cbd5e1;
                    }
                    .sr-preview-list {
                        background: rgba(0, 0, 0, 0.2);
                        border-radius: 4px;
                        padding: 10px;
                        max-height: 200px;
                        overflow-y: auto;
                    }
                    .sr-preview-item {
                        padding: 8px;
                        border-bottom: 1px solid #1e293b;
                        font-size: 12px;
                        cursor: pointer;
                        transition: background 0.2s;
                    }
                    .sr-preview-item:hover {
                        background: rgba(52, 152, 219, 0.2);
                    }
                    .sr-preview-item:last-child {
                        border-bottom: none;
                    }
                    .sr-dataset-info {
                        background: rgba(0, 0, 0, 0.3);
                        border-radius: 6px;
                        padding: 15px;
                        text-align: center;
                    }
                    .sr-dataset-count {
                        font-size: 32px;
                        font-weight: bold;
                        color: white;
                    }
                    .sr-instructions {
                        background: rgba(0, 0, 0, 0.2);
                        border-radius: 6px;
                        padding: 15px;
                        line-height: 1.8;
                        color: #cbd5e1;
                    }
                    .sr-instructions li {
                        margin: 8px 0;
                    }
                    .sr-load-buttons {
                        display: flex;
                        gap: 10px;
                    }
                    .sr-load-buttons button {
                        flex: 1;
                    }
                    .sr-content::-webkit-scrollbar,
                    .sr-preview-list::-webkit-scrollbar {
                        width: 8px;
                    }
                    .sr-content::-webkit-scrollbar-track,
                    .sr-preview-list::-webkit-scrollbar-track {
                        background: rgba(0, 0, 0, 0.2);
                        border-radius: 4px;
                    }
                    .sr-content::-webkit-scrollbar-thumb,
                    .sr-preview-list::-webkit-scrollbar-thumb {
                        background: rgba(52, 152, 219, 0.5);
                        border-radius: 4px;
                    }
                    .sr-content::-webkit-scrollbar-thumb:hover,
                    .sr-preview-list::-webkit-scrollbar-thumb:hover {
                        background: rgba(52, 152, 219, 0.7);
                    }
                    .hand-modal {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.8);
                        z-index: 1000001;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .hand-modal-content {
                        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                        border: 2px solid #0f3460;
                        border-radius: 10px;
                        width: 700px;
                        max-width: 90vw;
                        max-height: 80vh;
                        display: flex;
                        flex-direction: column;
                    }
                    .hand-modal-header {
                        background: #0f3460;
                        padding: 12px 15px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        border-radius: 8px 8px 0 0;
                    }
                    .hand-modal-title {
                        font-weight: bold;
                        font-size: 14px;
                        color: #3498db;
                    }
                    .hand-modal-close {
                        background: rgba(255, 255, 255, 0.1);
                        border: none;
                        color: #e4e4e4;
                        width: 28px;
                        height: 28px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 20px;
                        line-height: 1;
                    }
                    .hand-modal-close:hover {
                        background: rgba(255, 255, 255, 0.2);
                    }
                    .hand-modal-body {
                        padding: 20px;
                        overflow-y: auto;
                    }
                    .modal-section {
                        margin-bottom: 20px;
                        padding-bottom: 15px;
                        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    }
                    .modal-section:last-child {
                        border-bottom: none;
                    }
                    .modal-section-title {
                        font-size: 13px;
                        font-weight: bold;
                        color: #3498db;
                        margin-bottom: 10px;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }
                    .modal-detail-line {
                        font-size: 12px;
                        color: #cbd5e1;
                        margin: 4px 0;
                        padding-left: 10px;
                    }
                    .modal-message {
                        margin: 3px 0;
                        padding: 4px 8px;
                        background: rgba(255, 255, 255, 0.05);
                        border-radius: 3px;
                        font-size: 12px;
                        line-height: 1.4;
                    }
                    .hand-modal-body::-webkit-scrollbar {
                        width: 8px;
                    }
                    .hand-modal-body::-webkit-scrollbar-track {
                        background: rgba(0, 0, 0, 0.2);
                        border-radius: 4px;
                    }
                    .hand-modal-body::-webkit-scrollbar-thumb {
                        background: rgba(52, 152, 219, 0.5);
                        border-radius: 4px;
                    }
                    .hand-modal-body::-webkit-scrollbar-thumb:hover {
                        background: rgba(52, 152, 219, 0.7);
                    }
                </style>

                <div class="sr-header" id="sr-drag-handle">
                   <h1>🔍 Session Review Framework V2.0 (Drag to Move)</h1>
                   <div class="sr-header-controls">
                     <button class="sr-minimize" id="sr-minimize">−</button>
                   </div>
                </div>

                <div class="sr-content" id="sr-content">
                <div class="sr-section">
                    <input type="file" id="sr-file-input" accept=".json" style="display: none;">
                    <div class="sr-load-buttons">
                        <button class="sr-btn sr-btn-primary" id="sr-load-db-btn">
                            💾 Load from Database
                        </button>
                        <button class="sr-btn sr-btn-primary" id="sr-upload-btn">
                            📤 Load JSON File
                        </button>
                    </div>
                    <div style="margin-top: 15px;">
                       <button class="sr-btn sr-btn-success" id="sr-export-btn" style="width: 100%;" disabled>
                            💾 Export Current Results
                       </button>
                    </div>
                    
                </div>

                <div id="sr-main-content" style="display: none;">
                    <div class="sr-section">
                        <h2>Analysis Chain</h2>
                        <div class="sr-chain" id="sr-chain-display"></div>
                    </div>

                    <div class="sr-section">
                        <h2>Chain Actions</h2>
                        <div class="sr-flex">
                            <button class="sr-btn sr-btn-success" id="sr-chain-btn">🔗 Chain Next</button>
                            <button class="sr-btn sr-btn-warning" id="sr-back-btn">⬅️ Back</button>
                            <button class="sr-btn sr-btn-danger" id="sr-reset-btn">🔄 Reset</button>
                        </div>
                    </div>
                    <div class="sr-section">
                           <h2>Regex Filter</h2>
                           <div style="margin-bottom: 10px;">
                               <input type="text" id="sr-regex-input" class="sr-input" placeholder="Enter regex pattern (e.g., WeedPsycho, raised.*15000000)">
                           </div>
                           <button class="sr-btn sr-btn-primary" id="sr-run-regex-btn">🔍 Run Regex</button>
                     </div>

                    <div class="sr-section">
                        <h2>Module Controls</h2>
                        <div class="sr-flex">
                            <select class="sr-input" id="sr-module-select" style="flex: 1;">
                                <option value="">Select Module...</option>
                            </select>
                            <button class="sr-btn sr-btn-purple" id="sr-run-btn">▶️ Run Module</button>
                        </div>
                        <div style="margin-top: 10px;">
                            <button class="sr-btn sr-btn-primary" id="sr-refresh-modules-btn" style="font-size: 12px; padding: 6px 12px;">
                                🔄 Refresh Modules
                            </button>
                            <span id="sr-module-count" style="margin-left: 10px; font-size: 12px; color: #94a3b8;"></span>
                        </div>
                    </div>

                    <div id="sr-preview-container"></div>

                    <div class="sr-section">
                        <h2>Current Working Dataset</h2>
                        <div class="sr-dataset-info">
                            <div class="sr-dataset-count" id="sr-dataset-count">0 hands</div>
                        </div>
                    </div>
                </div>

                <div id="sr-instructions" class="sr-section">
                    <h2>Getting Started</h2>
                    <div class="sr-instructions">
                        <ol>
                            <li>Enter your hero name (optional, helps modules identify your actions)</li>
                            <li>Load database from IndexedDB or upload a JSON file</li>
                            <li>If no modules appear, click "Refresh Modules" (modules may load after V2.0)</li>
                            <li>Select a module and click "Run Module" to preview results</li>
                            <li>Click "Chain Next" to commit the filtered results</li>
                            <li>Run another module on the filtered dataset</li>
                            <li>Click chain steps to jump back, or use Back/Reset buttons</li>
                        </ol>
                        <div style="margin-top: 15px; padding: 10px; background: rgba(59, 130, 246, 0.2); border-left: 3px solid #3b82f6; border-radius: 4px;">
                            <strong>Note:</strong> Module scripts must be loaded in Tampermonkey. Check browser console for module registration messages.
                        </div>
                    </div>
                </div>
            </div>
            `;

            document.body.appendChild(container);
            this.attachEventListeners();
        }

        attachEventListeners() {
            const panel = document.getElementById('sessionReviewV2');
            const dragHandle = document.getElementById('sr-drag-handle');

            // Minimize button
            document.getElementById('sr-minimize').addEventListener('click', () => {
                this.toggleMinimize();
            });

            // Drag functionality
            dragHandle.addEventListener('mousedown', (e) => {
                this.isDragging = true;
                const rect = panel.getBoundingClientRect();
                this.dragOffset.x = e.clientX - rect.left;
                this.dragOffset.y = e.clientY - rect.top;
                panel.style.zIndex = '1000000';
                e.preventDefault();
            });

            document.addEventListener('mousemove', (e) => {
                if (!this.isDragging) return;
                const newX = e.clientX - this.dragOffset.x;
                const newY = e.clientY - this.dragOffset.y;
                panel.style.left = newX + 'px';
                panel.style.top = newY + 'px';
                panel.style.transform = 'none';
            });

            document.addEventListener('mouseup', () => {
                if (this.isDragging) {
                    this.isDragging = false;
                    panel.style.zIndex = '999999';
                }
            });

            // File and database loading
            document.getElementById('sr-upload-btn').addEventListener('click', () => {
                document.getElementById('sr-file-input').click();
            });

            document.getElementById('sr-load-db-btn').addEventListener('click', () => {
                this.loadFromDatabase();
            });

            document.getElementById('sr-file-input').addEventListener('change', (e) => {
                this.handleFileUpload(e);
            });
            // Export button
            document.getElementById('sr-export-btn').addEventListener('click', () => {
                this.exportResults();
            });

            // Module controls
            document.getElementById('sr-run-btn').addEventListener('click', () => {
                this.runModule();
            });

            // Refresh modules button
            document.getElementById('sr-refresh-modules-btn').addEventListener('click', () => {
                this.populateModuleDropdown();
                this.updateModuleCount();
            });
            // Regex filter
            document.getElementById('sr-run-regex-btn').addEventListener('click', () => {
                this.runRegex();
            });

            // Chain actions
            document.getElementById('sr-chain-btn').addEventListener('click', () => {
                this.chainNext();
            });

            document.getElementById('sr-back-btn').addEventListener('click', () => {
                this.goBack();
            });

            document.getElementById('sr-reset-btn').addEventListener('click', () => {
                this.reset();
            });

            // Module selection
            document.getElementById('sr-module-select').addEventListener('change', (e) => {
                const selectedIndex = e.target.value;
                if (selectedIndex === '') {
                    this.selectedModule = null;
                } else {
                    this.selectedModule = window.sessionReviewModules[parseInt(selectedIndex)];
                }
                // Clear regex input when module selected
                document.getElementById('sr-regex-input').value = '';
                this.updateUI();
            });
        }

        toggleMinimize() {
            const panel = document.getElementById('sessionReviewV2');
            const minimizeBtn = document.getElementById('sr-minimize');

            this.isMinimized = !this.isMinimized;

            if (this.isMinimized) {
                panel.classList.add('minimized');
                minimizeBtn.textContent = '+';
            } else {
                panel.classList.remove('minimized');
                minimizeBtn.textContent = '−';
            }
        }

        async loadFromDatabase() {
    try {
        await connectToDatabase();
        const hands = await loadAllHandsFromDB();

        // Auto-detect hero name before enrichment
        window.detectedHeroName = autoDetectHeroName(hands);
        console.log('🎯 Auto-detected hero:', window.detectedHeroName);

        enrichHandsWithPositions(hands);

        this.chainManager.initialize(hands, 'IndexedDB');
        this.previewResults = null;
        this.populateModuleDropdown();
        this.showMainContent();
        this.updateUI();

        console.log('V2.0: Loaded ' + hands.length + ' hands from database');

        // Show hero name in status
        this.showHeroStatus();
    } catch (error) {
        alert('Failed to load from database: ' + error.message + '\n\nPlease load a JSON file instead.');
        console.error('Database load failed:', error);
    }
}

        async handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
        const text = await file.text();
        const data = JSON.parse(text);

        // Handle both raw array and wrapped format
        let hands = [];
        if (Array.isArray(data)) {
            hands = data;
        } else if (data.hands && Array.isArray(data.hands)) {
            hands = data.hands;
        } else {
            throw new Error('Invalid JSON format. Expected array of hands or object with "hands" property.');
        }

        // Auto-detect hero name before enrichment
        window.detectedHeroName = autoDetectHeroName(hands);
        console.log('🎯 Auto-detected hero:', window.detectedHeroName);

        enrichHandsWithPositions(hands);
        this.chainManager.initialize(hands, file.name);
        this.previewResults = null;
        this.populateModuleDropdown();
        this.showMainContent();
        this.updateUI();

        console.log('V2.0: Loaded ' + hands.length + ' hands from ' + file.name);

        // Show hero name in status
        this.showHeroStatus();
    } catch (error) {
        alert('Failed to load file: ' + error.message);
        console.error('File load failed:', error);
    }
}

        populateModuleDropdown() {
            const moduleSelect = document.getElementById('sr-module-select');
            moduleSelect.innerHTML = '<option value="">Select Module...</option>';

            console.log('📊 V2.0: Populating dropdown with ' + (window.sessionReviewModules?.length || 0) + ' modules');

            if (window.sessionReviewModules && Array.isArray(window.sessionReviewModules)) {
                if (window.sessionReviewModules.length === 0) {
                    console.warn('⚠️ V2.0: Module registry is empty! Are module scripts loaded?');
                    const option = document.createElement('option');
                    option.value = '';
                    option.textContent = 'No modules found - check console';
                    option.disabled = true;
                    moduleSelect.appendChild(option);
                } else {
                    window.sessionReviewModules.forEach((module, index) => {
                        const option = document.createElement('option');
                        option.value = index;
                        option.textContent = module.name;
                        moduleSelect.appendChild(option);
                        console.log('  ✓ Loaded: ' + module.name);
                    });
                }
            }
        }

        showMainContent() {
            document.getElementById('sr-main-content').style.display = 'block';
            document.getElementById('sr-instructions').style.display = 'none';
            this.updateModuleCount();
        }

        updateModuleCount() {
            const count = window.sessionReviewModules?.length || 0;
            const countEl = document.getElementById('sr-module-count');
            if (countEl) {
                countEl.textContent = count + ' module(s) available';
                if (count === 0) {
                    countEl.style.color = '#ef4444';
                } else {
                    countEl.style.color = '#6ee7b7';
                }
            }
        }

        showHandModal(hand) {
            const heroName = getHeroName();

            // Build positions section
            let positionsHTML = '';
            if (hand.positions && hand.positions.length > 0) {
                positionsHTML = '<div class="modal-section"><div class="modal-section-title">POSITIONS:</div>';
                hand.positions.forEach(pos => {
                    const isButton = pos.seat === hand.buttonSeat;
                    const buttonMarker = isButton ? ' ← Button' : '';
                    const isHero = pos.isHero;
                    const heroMarker = isHero ? ' (Hero)' : '';
                    positionsHTML += '<div class="modal-detail-line">' + pos.position + ': ' + pos.playerName + heroMarker + ' (Seat ' + pos.seat + ')' + buttonMarker + '</div>';
                });
                if (hand.heroPosition) {
                    positionsHTML += '<div class="modal-detail-line" style="margin-top: 8px; font-weight: bold; color: #3498db;">Hero Position: ' + hand.heroPosition + '</div>';
                }
                positionsHTML += '</div>';
            }

            // Build starting stacks section
            let stacksHTML = '<div class="modal-section"><div class="modal-section-title">STARTING STACKS:</div>';
            const bigBlind = extractBigBlind(hand.messages);
            if (hand.tableData && hand.tableData.players && bigBlind) {
                hand.tableData.players.forEach(player => {
                    const stackNum = parseInt(player.stack.replace(/,/g, ''));
                    const stackBB = Math.round(stackNum / bigBlind);
                    const isHero = player.name === heroName || player.name === 'HERO';
                    const displayName = isHero ? player.name + ' (Hero)' : player.name;
                    stacksHTML += '<div class="modal-detail-line">' + displayName + ' (Seat ' + player.seat + '): ' + player.stack + ' (' + stackBB + ' BB)</div>';
                });
            } else {
                stacksHTML += '<div class="modal-detail-line">Stack data not available</div>';
            }
            stacksHTML += '</div>';

            // Build hole cards section
            let cardsHTML = '<div class="modal-section"><div class="modal-section-title">HOLE CARDS:</div>';
            if (hand.heroCards && hand.heroCards.length > 0) {
                const heroCardsStr = hand.heroCards.map(c => c.rank + c.suit).join(' ');
                cardsHTML += '<div class="modal-detail-line">Hero (' + (heroName || 'Unknown') + '): ' + heroCardsStr + '</div>';
            }
            const revealedCards = [];
            hand.messages.forEach(msg => {
                const match = msg.text.match(/^(.+?)\s+reveals \[(.+?)\]/);
                if (match) {
                    const playerName = match[1].trim();
                    const cards = match[2].trim();
                    if (playerName !== heroName) {
                        revealedCards.push({ player: playerName, cards: cards });
                    }
                }
            });
            revealedCards.forEach(reveal => {
                cardsHTML += '<div class="modal-detail-line">' + reveal.player + ' (revealed): ' + reveal.cards + '</div>';
            });
            if (!hand.heroCards && revealedCards.length === 0) {
                cardsHTML += '<div class="modal-detail-line">No hole cards available</div>';
            }
            cardsHTML += '</div>';

            // Build messages section
            let messagesHTML = '<div class="modal-section"><div class="modal-section-title">HAND MESSAGES:</div>';
            hand.messages.forEach(msg => {
                messagesHTML += '<div class="modal-message"><span style="color: #3498db; font-weight: bold;">' + msg.sequence + '.</span> <span style="color: #cbd5e1;">' + msg.text + '</span></div>';
            });
            messagesHTML += '</div>';

            // Create modal
            const modal = document.createElement('div');
            modal.className = 'hand-modal';
            modal.innerHTML = '<div class="hand-modal-content">' +
                '<div class="hand-modal-header">' +
                '<span class="hand-modal-title">Hand #' + (hand.handNumber || 'Unknown') + ' - Full Details</span>' +
                '<button class="hand-modal-close">×</button>' +
                '</div>' +
                '<div class="hand-modal-body">' +
                positionsHTML + stacksHTML + cardsHTML + messagesHTML +
                '</div>' +
                '</div>';

            document.body.appendChild(modal);

            // Close handlers
            modal.querySelector('.hand-modal-close').addEventListener('click', () => {
                document.body.removeChild(modal);
            });
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    document.body.removeChild(modal);
                }
            });
        }
        exportResults() {
    const currentData = this.chainManager.getCurrentData();
    const chainDisplay = this.chainManager.getChainDisplay();

    if (currentData.length === 0) {
        alert('No data to export');
        return;
    }

    // Build filename from chain
    const chainSteps = chainDisplay.map(step => {
        // Remove special characters and make lowercase
        return step.name
            .replace(/[^a-zA-Z0-9\s]/g, '')
            .replace(/\s+/g, '-')
            .toLowerCase();
    }).join('-');

    // Get date
    const date = new Date().toISOString().split('T')[0];

    // Create filename (limit length)
    let filename = chainSteps.substring(0, 80) + '-' + date + '.json';

    // Collect export data from modules
const moduleExports = {};
(window.sessionReviewModules || []).forEach(mod => {
    if (typeof mod.getExportData === 'function') {
        moduleExports[mod.name] = mod.getExportData();
    }
});

// Build export data (include module stats)
const exportData = {
    exportedFrom: 'Session Review Framework V2.0',
    exportDate: new Date().toISOString(),
    chainPath: chainDisplay.map(s => s.name + ' (' + s.count + ')').join(' → '),
    handCount: currentData.length,
    hands: currentData,
    moduleStats: moduleExports // 👈 New
};


    // Create and download file
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log('V2.0: Exported ' + currentData.length + ' hands to ' + filename);
}

        runModule() {
            if (!this.selectedModule) {
                alert('Please select a module first');
                return;
            }

            const currentData = this.chainManager.getCurrentData();
            const isEnrichment = this.selectedModule.type === 'enrichment';

            const results = [];

            // Reset module stats before running
            if (typeof this.selectedModule.reset === 'function') {
                this.selectedModule.reset();
                console.log('📊 Reset stats for: ' + this.selectedModule.name);
            }

            try {
                for (const hand of currentData) {
                    const detected = this.selectedModule.detect(hand, window.SessionReviewFramework);

                    if (detected) {
                        if (isEnrichment) {
                            results.push(detected);
                        } else {
                            results.push({
                                result: detected,
                                hand: hand
                            });
                        }
                    }
                }

                this.previewResults = {
                    moduleName: this.selectedModule.name,
                    results: results,
                    count: results.length,
                    isEnrichment: isEnrichment
                };

                this.updateUI();
                console.log('V2.0: Found ' + results.length + ' results for ' + this.selectedModule.name);
            } catch (error) {
                alert('Module error: ' + error.message);
                console.error('Module execution failed:', error);
            }
        }
        runRegex() {
    const pattern = document.getElementById('sr-regex-input').value.trim();

    if (!pattern) {
        alert('Please enter a regex pattern');
        return;
    }

    const currentData = this.chainManager.getCurrentData();

    try {
        const regex = new RegExp(pattern, 'i');
        const matchedHands = [];

        for (const hand of currentData) {
    const handText = (hand.messages || [])
        .map(m => (m.text || '').replace(/\u00A0/g, ' '))
        .join(' ');

    const match = handText.match(regex);
    if (match) {
        // Create a snippet around the first match (±60 characters)
        const start = Math.max(0, match.index - 70);
        const end = Math.min(handText.length, match.index + match[0].length + 70);
        let snippet = handText.slice(start, end).replace(/\s+/g, ' ');

        // Highlight the exact match
        const safeMatch = match[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const highlightRegex = new RegExp(safeMatch, 'i');
        snippet = snippet.replace(highlightRegex, m => `<b>${m}</b>`);

        matchedHands.push({
          ...hand,
          displayText: `Hand #${hand.handNumber} | Match: "...${snippet}..."`
        });
    }
}

        this.previewResults = {
            moduleName: 'Regex: ' + pattern,
            results: matchedHands,
            count: matchedHands.length,
            isEnrichment: true,
            isRegex: true
        };

        this.updateUI();
        console.log('V2.0: Regex found ' + matchedHands.length + ' matches');
    } catch (error) {
        alert('Invalid regex pattern: ' + error.message);
    }
}

        chainNext() {
            if (!this.previewResults) {
                alert('Run a module first to see preview results');
                return;
            }

            let filteredHands;

if (this.previewResults.isRegex) {
    // Regex returns hands directly
    filteredHands = this.previewResults.results;
} else if (this.previewResults.isEnrichment) {
    filteredHands = this.previewResults.results;
            } else {
                filteredHands = this.previewResults.results.map(r => r.hand);
            }

            this.chainManager.addStep(
    this.previewResults.moduleName,
    filteredHands,
    {
        moduleName: this.previewResults.isRegex ? 'Regex Filter' : this.selectedModule.name,
                    isEnrichment: this.previewResults.isEnrichment
                }
            );

            this.previewResults = null;
            this.updateUI();
        }

        jumpToStep(index) {
            this.chainManager.jumpToStep(index);
            this.previewResults = null;
            this.updateUI();
        }

        goBack() {
            this.chainManager.back();
            this.previewResults = null;
            this.updateUI();
        }

        reset() {
            this.chainManager.reset();
            this.previewResults = null;
            this.updateUI();
        }
        showHeroStatus() {
    const statusText = document.querySelector('.hh-status-text');
    if (statusText) {
        const heroName = window.detectedHeroName || 'Unknown';
        const heroIcon = heroName === 'HERO' ? '⚠️' : '✅';
        statusText.innerHTML = `${heroIcon} Hero: <strong>${heroName}</strong>`;
    }
}
        updateUI() {
            // Update chain display
            const chainDisplay = document.getElementById('sr-chain-display');
            const chainData = this.chainManager.getChainDisplay();
            chainDisplay.innerHTML = '';

            chainData.forEach((step, index) => {
                if (index > 0) {
                    const arrow = document.createElement('span');
                    arrow.className = 'sr-chain-arrow';
                    arrow.textContent = '→';
                    chainDisplay.appendChild(arrow);
                }

                const stepBtn = document.createElement('button');
                stepBtn.className = 'sr-chain-step';
                if (index === chainData.length - 1) {
                    stepBtn.classList.add('active');
                }
                stepBtn.textContent = step.name + ' (' + step.count + ')';
                stepBtn.addEventListener('click', () => this.jumpToStep(index));
                chainDisplay.appendChild(stepBtn);
            });

            // Update dataset count
            document.getElementById('sr-dataset-count').textContent = this.chainManager.getCurrentData().length + ' hands';

            // Update preview
            const previewContainer = document.getElementById('sr-preview-container');
            if (this.previewResults) {
                let previewHTML = '';

                if (this.previewResults.count > 0) {
                    if (this.previewResults.isEnrichment) {
    previewHTML = '<div class="sr-preview-list">';
    this.previewResults.results.slice(0, 25).forEach((hand, idx) => {
        previewHTML += '<div class="sr-preview-item" data-hand-index="' + idx + '">';

        // NEW: Check if module provided displayText
        if (hand.displayText) {
            previewHTML += '<div style="color: #60a5fa; background: rgba(255,255,255,0.05); white-space: pre-wrap;">' + hand.displayText + '</div>';
        } else {
            // Fallback to basic format
            previewHTML += '<div style="color: #60a5fa;">Hand #' + (hand.handNumber || idx + 1) + '</div>';
            previewHTML += '<div style="color: #94a3b8;">Position: ' + (hand.heroPosition || 'N/A') + '</div>';
        }

        previewHTML += '</div>';
    });
                        if (this.previewResults.count > 25) {
                            previewHTML += '<div style="color: #64748b; padding: 8px; text-align: center;">';
                            previewHTML += '... and ' + (this.previewResults.count - 25) + ' more hands (click any to view)';
                            previewHTML += '</div>';
                        }
                        previewHTML += '</div>';
                    } else {
                        previewHTML = '<div class="sr-preview-list">';
                        this.previewResults.results.slice(0, 25).forEach((item, idx) => {
                            previewHTML += '<div class="sr-preview-item" data-hand-index="' + idx + '">';
                            previewHTML += '<div style="color: #60a5fa; white-space: pre-wrap;">' + (item.result.displayText || JSON.stringify(item.result, null, 2)) + '</div>';
                            previewHTML += '</div>';
                        });
                        if (this.previewResults.count > 25) {
                            previewHTML += '<div style="color: #64748b; padding: 8px; text-align: center;">';
                            previewHTML += '... and ' + (this.previewResults.count - 25) + ' more results (click any to view)';
                            previewHTML += '</div>';
                        }
                        previewHTML += '</div>';
                    }
                }
                // ============ ADD C-BET STATS DISPLAY ============
                if (this.selectedModule && this.selectedModule.name === "C-Bet Analyzer v2.0") {
                    const exportData = this.selectedModule.getExportData();
                    const summary = exportData.summary;
                    const insights = exportData.insights;
                    const recommendations = exportData.recommendations;

                    previewHTML += '<div style="margin-top: 20px; padding: 15px; background: rgba(96, 165, 250, 0.1); border-left: 3px solid #60a5fa; border-radius: 4px;">';
                    previewHTML += '<div style="color: #60a5fa; font-weight: bold; margin-bottom: 10px;">📊 C-Bet Analysis</div>';

                    // Summary stats
                    previewHTML += '<div style="color: #94a3b8; margin-bottom: 10px;">';
                    previewHTML += '<strong>Stats:</strong> ' + summary.heroCBets + '/' + summary.heroCBetSpots + ' spots (' + summary.cBetFrequency + ') | ';
                    previewHTML += 'Avg size: ' + summary.averageCBetSize + ' | ';
                    previewHTML += 'Success: ' + summary.successRate;
                    previewHTML += '</div>';

                    // Outcomes
                    previewHTML += '<div style="color: #94a3b8; margin-bottom: 10px;">';
                    previewHTML += '<strong>Outcomes:</strong> ';
                    previewHTML += '✅ Folded: ' + summary.outcomes.allFolded + ' | ';
                    previewHTML += '🟡 Called: ' + summary.outcomes.called + ' | ';
                    previewHTML += '🔴 Raised: ' + summary.outcomes.raised;
                    previewHTML += '</div>';

                    // Insights
                    if (insights && insights.length > 0) {
                        previewHTML += '<div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(148, 163, 184, 0.2);">';
                        insights.forEach(insight => {
                            previewHTML += '<div style="color: #e2e8f0; margin: 5px 0;">' + insight + '</div>';
                        });
                        previewHTML += '</div>';
                    }

                    // Recommendation
                    if (recommendations && recommendations.workOn) {
                        previewHTML += '<div style="margin-top: 10px; padding: 8px; background: rgba(16, 185, 129, 0.1); border-radius: 4px;">';
                        previewHTML += '<div style="color: #10b981;"><strong>💡 Work on:</strong> ' + recommendations.workOn + '</div>';
                        previewHTML += '</div>';
                    }

                    previewHTML += '</div>';
                }
                // ============ END C-BET STATS DISPLAY ============
                // ============ ADD STARTING HAND CHART BUTTON ============
                if (this.selectedModule && this.selectedModule.name === "Starting Hand Tracker v2.0") {
                    const exportData = this.selectedModule.getExportData();

                    previewHTML += '<div style="margin-top: 20px; padding: 15px; background: rgba(139, 92, 246, 0.1); border-left: 3px solid #8b5cf6; border-radius: 4px;">';
                    previewHTML += '<div style="color: #8b5cf6; font-weight: bold; margin-bottom: 10px;">📊 Starting Hand Analysis</div>';

                    // Summary stats
                    const summary = exportData.summary;
                    previewHTML += '<div style="color: #94a3b8; margin-bottom: 10px;">';
                    previewHTML += '<strong>Total VPIP:</strong> ' + summary.totalVPIP + ' hands | ';
                    previewHTML += '<strong>Open Limps:</strong> ' + summary.openLimps + ' | ';
                    previewHTML += '<strong>Limp Behinds:</strong> ' + summary.limpBehinds;
                    previewHTML += '</div>';

                    // Chart button
                    previewHTML += '<button id="open-hand-chart" style="padding: 10px 20px; background: #8b5cf6; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; margin-top: 10px;">📊 View Hand Selection Chart</button>';

                    previewHTML += '</div>';
                }
                // ============ END STARTING HAND CHART BUTTON ============


                previewContainer.innerHTML = '<div class="sr-section"><div class="sr-preview">' +
                    '<div class="sr-preview-title">Preview Results</div>' +
                    '<div class="sr-preview-count">Found <strong style="color: #10b981;">' + this.previewResults.count + '</strong> ' + (this.previewResults.isEnrichment ? 'hands' : 'situations') + '</div>' +
                    previewHTML +
                    '</div></div>';

                // Attach click handlers to preview items
                const previewItems = previewContainer.querySelectorAll('.sr-preview-item[data-hand-index]');
                previewItems.forEach(item => {
                    item.addEventListener('click', () => {
                        const index = parseInt(item.getAttribute('data-hand-index'));
                        let hand;
                        if (this.previewResults.isEnrichment) {
                            hand = this.previewResults.results[index];
                        } else {
                            hand = this.previewResults.results[index].hand;
                        }
                        this.showHandModal(hand);
                    });
                });
            } else {
                previewContainer.innerHTML = '';
            }
            // Attach chart button handler
                const chartButton = previewContainer.querySelector('#open-hand-chart');
                if (chartButton && this.selectedModule && this.selectedModule.name === "Starting Hand Tracker v2.0") {
                    chartButton.addEventListener('click', () => {
                        const exportData = this.selectedModule.getExportData();
                        if (window.openPreflopChart) {
                            window.openPreflopChart(exportData);
                        }
                    });
                }

            // Update button states
            const canGoBack = this.chainManager.getChainLength() > 1;
            document.getElementById('sr-back-btn').disabled = !canGoBack;
            document.getElementById('sr-reset-btn').disabled = !canGoBack;
            document.getElementById('sr-chain-btn').disabled = !this.previewResults;
            document.getElementById('sr-run-btn').disabled = !this.selectedModule;
            // Enable export button if we have data
            const hasData = this.chainManager.getChainLength() > 0;
            document.getElementById('sr-export-btn').disabled = !hasData;
        }
    }

    // ============================================================================
    // INITIALIZATION
    // ============================================================================
    function createLaunchButton() {
        const btn = document.createElement('button');
        btn.id = 'sr-v2-launch';
        btn.innerHTML = '🔍 Session Review V2.0';
        btn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 12px 20px;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border: 2px solid #0f3460;
            color: #3498db;
            border-radius: 8px;
            font-weight: bold;
            font-size: 14px;
            cursor: pointer;
            z-index: 1400;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
            transition: all 0.2s;
        `;

        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-2px)';
            btn.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.6)';
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0)';
            btn.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.5)';
        });

        btn.addEventListener('click', () => {
            const existingPanel = document.getElementById('sessionReviewV2');

            if (existingPanel) {
                if (existingPanel.style.display === 'none') {
                    existingPanel.style.display = 'flex';
                } else {
                    existingPanel.style.display = 'none';
                }
            } else {
                new SessionReviewUI();
            }
        });

        document.body.appendChild(btn);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createLaunchButton);
    } else {
        createLaunchButton();
    }

    console.log('📊 Session Review Framework V2.0 - Standalone Mode');

})();