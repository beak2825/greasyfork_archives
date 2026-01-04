// ==UserScript==
// @name         Poker Stats Calculator
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  Calculate player statistics from IndexedDB hand history
// @author       DuckOfDestiny
// @match        https://www.torn.com/page.php?sid=holdem*
// @grant        none
// @license MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/551730/Poker%20Stats%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/551730/Poker%20Stats%20Calculator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================================
    // GLOBAL STATE
    // ============================================
    let db = null;
    let calculatorPanelOpen = false;
    let calculatedStats = null;
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };

    // ============================================
    // DATABASE CONNECTION
    // ============================================

    function connectToDatabase() {
        return new Promise((resolve, reject) => {
            const openRequest = indexedDB.open("pokerHandHistoryDB", 2);

            openRequest.onupgradeneeded = function(event) {
                db = event.target.result;

                // Create hands store if it doesn't exist (from collector)
                if (!db.objectStoreNames.contains("hands")) {
                    const handStore = db.createObjectStore("hands", {
                        keyPath: "autoId",
                        autoIncrement: true
                    });
                    handStore.createIndex("handNumber", "handNumber", { unique: false });
                    handStore.createIndex("handId", "handId", { unique: false });
                    handStore.createIndex("startTime", "startTime", { unique: false });
                }

                // Create playerStats store for calculated statistics
                if (!db.objectStoreNames.contains("playerStats")) {
                    const statsStore = db.createObjectStore("playerStats", {
                        keyPath: "playerName"
                    });
                    statsStore.createIndex("lastUpdated", "lastUpdated", { unique: false });
                }
            };

            openRequest.onsuccess = function(event) {
                db = event.target.result;
                console.log('Connected to poker database');
                resolve(db);
            };

            openRequest.onerror = function(event) {
                console.error('Failed to connect to database:', event.target.error);
                reject(event.target.error);
            };
        });
    }

    function loadAllHands() {
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

    function saveStatsToDatabase(statsData) {
        return new Promise((resolve, reject) => {
            if (!db) {
                reject(new Error('Database not connected'));
                return;
            }

            const transaction = db.transaction(["playerStats"], "readwrite");
            const store = transaction.objectStore("playerStats");
            const timestamp = Date.now();

            let saved = 0;
            const players = Object.entries(statsData);

            players.forEach(([playerName, stats]) => {
                const record = {
                    playerName: playerName,
                    ...stats,
                    lastUpdated: timestamp
                };

                store.put(record);
                saved++;
            });

            transaction.oncomplete = function() {
                resolve(saved);
            };

            transaction.onerror = function() {
                reject(transaction.error);
            };
        });
    }

    function getHandCount() {
        return new Promise((resolve, reject) => {
            if (!db) {
                reject(new Error('Database not connected'));
                return;
            }

            const transaction = db.transaction(["hands"], "readonly");
            const store = transaction.objectStore("hands");
            const request = store.count();

            request.onsuccess = function() {
                resolve(request.result);
            };

            request.onerror = function() {
                reject(request.error);
            };
        });
    }

    // ============================================
    // PARSING LOGIC
    // ============================================

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

        match = text.match(/^(.+?)\s+posted \$([0-9,]+)/);
        if (match) {
            action.player = match[1].trim();
            action.action = 'posted';
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

    // ============================================
    // STAT CALCULATION
    // ============================================

    function calculateVPIP(playerName, hands) {
        let handsPlayed = 0;
        let vpipHands = 0;

        hands.forEach(hand => {
            const streets = parseHandIntoStreets(hand);
            const preflopActions = streets.preflop;

            const playerActions = preflopActions.filter(a => a.player === playerName);
            if (playerActions.length === 0) return;

            handsPlayed++;

            const postedBlind = playerActions.some(a =>
                a.action === 'small_blind' || a.action === 'big_blind' || a.action === 'posted'
            );

            const voluntaryActions = playerActions.filter(a =>
                a.action === 'call' || a.action === 'bet' || a.action === 'raise'
            );

            if (voluntaryActions.length > 0) {
                vpipHands++;
            }
        });

        return {
            handsPlayed,
            vpipHands,
            vpip: handsPlayed > 0 ? Math.round((vpipHands / handsPlayed) * 100) : 0
        };
    }

    function calculatePFR(playerName, hands) {
        let handsPlayed = 0;
        let pfrHands = 0;

        hands.forEach(hand => {
            const streets = parseHandIntoStreets(hand);
            const preflopActions = streets.preflop;

            const playerActions = preflopActions.filter(a => a.player === playerName);
            if (playerActions.length === 0) return;

            handsPlayed++;

            const raised = playerActions.some(a => a.action === 'raise');
            if (raised) {
                pfrHands++;
            }
        });

        return {
            handsPlayed,
            pfrHands,
            pfr: handsPlayed > 0 ? Math.round((pfrHands / handsPlayed) * 100) : 0
        };
    }

    function calculateAF(playerName, hands) {
        let totalBets = 0;
        let totalRaises = 0;
        let totalCalls = 0;

        hands.forEach(hand => {
            const streets = parseHandIntoStreets(hand);

            ['preflop', 'flop', 'turn', 'river'].forEach(street => {
                const playerActions = streets[street].filter(a => a.player === playerName);

                playerActions.forEach(action => {
                    if (action.action === 'bet') totalBets++;
                    if (action.action === 'raise') totalRaises++;
                    if (action.action === 'call') totalCalls++;
                });
            });
        });

        const aggressive = totalBets + totalRaises;
        const passive = totalCalls;

        let af;
        if (passive === 0) {
            af = aggressive > 0 ? '∞' : '0.00';
        } else {
            af = (aggressive / passive).toFixed(2);
        }

        return {
            bets: totalBets,
            raises: totalRaises,
            calls: totalCalls,
            af: af
        };
    }

    async function calculateStats() {
        const statusDiv = document.getElementById('calcStatus');
        statusDiv.innerHTML = '<div class="status-line status-info">Loading hands from database...</div>';

        try {
            const allHands = await loadAllHands();

            if (allHands.length === 0) {
                statusDiv.innerHTML = '<div class="status-line status-error">No hands found in database. Play some poker first!</div>';
                return;
            }

            statusDiv.innerHTML += `<div class="status-line status-success">Loaded ${allHands.length} hands</div>`;
            statusDiv.innerHTML += '<div class="status-line status-info">Analyzing player actions...</div>';

            console.log(`Calculating stats from ${allHands.length} hands...`);

            const playerNames = new Set();
            allHands.forEach(hand => {
                const streets = parseHandIntoStreets(hand);
                ['preflop', 'flop', 'turn', 'river'].forEach(street => {
                    streets[street].forEach(action => {
                        if (action.player) {
                            playerNames.add(action.player);
                        }
                    });
                });
            });

            console.log(`Found ${playerNames.size} unique players`);
            statusDiv.innerHTML += `<div class="status-line status-success">Found ${playerNames.size} unique players</div>`;
            statusDiv.innerHTML += '<div class="status-line status-info">Calculating statistics...</div>';

            const statsData = {};

            playerNames.forEach(playerName => {
                const vpipData = calculateVPIP(playerName, allHands);
                const pfrData = calculatePFR(playerName, allHands);
                const afData = calculateAF(playerName, allHands);

                statsData[playerName] = {
                    hands: vpipData.handsPlayed,
                    vpip: vpipData.vpip,
                    pfr: pfrData.pfr,
                    af: afData.af
                };
            });

            calculatedStats = statsData;

            // Save to database
            statusDiv.innerHTML += '<div class="status-line status-info">Saving stats to database...</div>';
            const saved = await saveStatsToDatabase(statsData);

            statusDiv.innerHTML += `<div class="status-line status-success">Stats saved to database (${saved} players)</div>`;

            displayResults(statsData);
            console.log('Stats calculation complete and saved');

        } catch (error) {
            console.error('Calculation failed:', error);
            statusDiv.innerHTML += `<div class="status-line status-error">Error: ${error.message}</div>`;
        }
    }

    function displayResults(statsData) {
        const resultsDiv = document.getElementById('statsResults');
        const players = Object.entries(statsData).sort((a, b) => b[1].hands - a[1].hands);

        let html = `<div style="margin-bottom: 10px; font-weight: bold; color: #34d399;">
            Calculated stats for ${players.length} players
        </div>`;

        players.forEach(([playerName, stats]) => {
            html += `
                <div class="player-stat-item">
                    <div class="player-stat-name">${playerName}</div>
                    <div class="player-stat-line">Hands: ${stats.hands}</div>
                    <div class="player-stat-line">VPIP: ${stats.vpip}%</div>
                    <div class="player-stat-line">PFR: ${stats.pfr}%</div>
                    <div class="player-stat-line">AF: ${stats.af}</div>
                </div>
            `;
        });

        resultsDiv.innerHTML = html;
        document.getElementById('resultsSection').style.display = 'block';
    }

    // ============================================
    // IMPORT/EXPORT (BACKUP ONLY)
    // ============================================

    async function handleFileImport(event) {
        const file = event.target.files[0];
        if (!file) return;

        const statusDiv = document.getElementById('importStatus');
        statusDiv.innerHTML = '<div class="status-line status-info">Reading file...</div>';

        try {
            const text = await file.text();
            const data = JSON.parse(text);

            if (!data.hands || !Array.isArray(data.hands)) {
                throw new Error('Invalid format (missing hands array)');
            }

            statusDiv.innerHTML += `<div class="status-line status-success">File contains ${data.hands.length} hands</div>`;
            statusDiv.innerHTML += '<div class="status-line status-info">This will calculate stats without saving hands to database</div>';

            const playerNames = new Set();
            data.hands.forEach(hand => {
                const streets = parseHandIntoStreets(hand);
                ['preflop', 'flop', 'turn', 'river'].forEach(street => {
                    streets[street].forEach(action => {
                        if (action.player) {
                            playerNames.add(action.player);
                        }
                    });
                });
            });

            const statsData = {};
            playerNames.forEach(playerName => {
                const vpipData = calculateVPIP(playerName, data.hands);
                const pfrData = calculatePFR(playerName, data.hands);
                const afData = calculateAF(playerName, data.hands);

                statsData[playerName] = {
                    hands: vpipData.handsPlayed,
                    vpip: vpipData.vpip,
                    pfr: pfrData.pfr,
                    af: afData.af
                };
            });

            calculatedStats = statsData;
            displayResults(statsData);

            statusDiv.innerHTML += `<div class="status-line status-success">Calculated stats for ${playerNames.size} players (temporary - not saved)</div>`;

        } catch (error) {
            statusDiv.innerHTML += `<div class="status-line status-error">Error: ${error.message}</div>`;
        } finally {
            event.target.value = '';
        }
    }

    function downloadStats() {
        if (!calculatedStats) {
            alert('No stats calculated yet');
            return;
        }

        const exportData = {
            lastUpdated: new Date().toISOString(),
            players: calculatedStats
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `poker_stats_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        console.log('Stats downloaded');
    }

    // ============================================
    // UI CREATION
    // ============================================

    function createUI() {
        const controlBtn = document.createElement('button');
        controlBtn.id = 'statsCalculatorBtn';
        controlBtn.className = 'stats-calc-btn';
        controlBtn.innerHTML = '📊 Stats Calculator';
        controlBtn.onclick = toggleCalculatorPanel;

        const panel = document.createElement('div');
        panel.id = 'statsCalculatorPanel';
        panel.className = 'stats-calc-panel';
        panel.style.display = 'none';
        panel.innerHTML = `
            <div class="calc-header" id="calcDragHandle">
                <span class="calc-title">📊 Poker Stats Calculator v2.0 (Drag to Move)</span>
                <button class="calc-close-btn" id="calcCloseBtn">×</button>
            </div>
            <div class="calc-content">
                <div class="calc-section">
                    <div class="calc-label">Calculate from Database</div>
                    <div class="calc-info">
                        Calculate player statistics from all hands stored in your IndexedDB.
                        Stats will be saved and available to the Stats Display HUD.
                    </div>
                    <div id="dbInfo" class="calc-info"></div>
                    <div style="margin: 15px 0; text-align: center;">
                        <button class="calc-btn calc-btn-success" id="calculateStatsBtn">
                            🎯 Calculate & Save Stats
                        </button>
                    </div>
                    <div id="calcStatus" class="calc-status"></div>
                </div>

                <div class="calc-section">
                    <div class="calc-label">Import External Hands (Optional)</div>
                    <div class="calc-info">
                        Calculate stats from an external JSON file without saving to database.
                        Useful for analyzing shared hand histories.
                    </div>
                    <div style="margin: 15px 0; text-align: center;">
                        <button class="calc-btn calc-btn-primary" id="importHandsBtn">
                            📁 Import & Calculate
                        </button>
                        <input type="file" id="handsFileInput" accept=".json" style="display: none;">
                    </div>
                    <div id="importStatus" class="calc-status"></div>
                </div>

                <div id="resultsSection" style="display: none;">
                    <div class="calc-section">
                        <div class="calc-label">Calculation Results</div>
                        <div id="statsResults" class="stats-results"></div>
                        <div style="margin: 15px 0; text-align: center;">
                            <button class="calc-btn calc-btn-download" id="downloadStatsBtn">
                                💾 Export Stats JSON
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(controlBtn);
        document.body.appendChild(panel);

        document.getElementById('calcCloseBtn').onclick = toggleCalculatorPanel;
        document.getElementById('calculateStatsBtn').onclick = calculateStats;
        document.getElementById('importHandsBtn').onclick = () => {
            document.getElementById('handsFileInput').click();
        };
        document.getElementById('handsFileInput').onchange = handleFileImport;
        document.getElementById('downloadStatsBtn').onclick = downloadStats;

        makeDraggable(panel, document.getElementById('calcDragHandle'));
        injectStyles();

        updateDatabaseInfo();
    }

    async function updateDatabaseInfo() {
        const dbInfo = document.getElementById('dbInfo');
        try {
            const count = await getHandCount();
            dbInfo.innerHTML = `<strong>Database contains ${count} hands ready for analysis</strong>`;
        } catch (error) {
            dbInfo.innerHTML = `<span style="color: #fca5a5;">Database not accessible. Make sure Hand Collector is running.</span>`;
        }
    }

    function makeDraggable(panel, handle) {
        handle.style.cursor = 'move';
        handle.style.userSelect = 'none';

        handle.addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = panel.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;
            panel.style.zIndex = '1000000';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const newX = e.clientX - dragOffset.x;
            const newY = e.clientY - dragOffset.y;
            panel.style.left = newX + 'px';
            panel.style.top = newY + 'px';
            panel.style.transform = 'none';
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                panel.style.zIndex = '999999';
            }
        });
    }

    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .stats-calc-btn {
                position: fixed;
                bottom: 80px;
                right: 20px;
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border: 2px solid #0f3460;
                color: #e94560;
                padding: 12px 20px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: bold;
                font-size: 14px;
                z-index: 999998;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
                transition: all 0.2s;
            }

            .stats-calc-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.6);
            }

            .stats-calc-panel {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 800px;
                max-width: 95vw;
                max-height: 90vh;
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border: 2px solid #0f3460;
                border-radius: 10px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.7);
                z-index: 999999;
                display: flex;
                flex-direction: column;
                font-family: 'Segoe UI', Arial, sans-serif;
                color: #e4e4e4;
            }

            .calc-header {
                background: #0f3460;
                padding: 12px 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-radius: 8px 8px 0 0;
            }

            .calc-title {
                font-weight: bold;
                font-size: 14px;
                color: #e94560;
            }

            .calc-close-btn {
                background: rgba(255, 255, 255, 0.1);
                border: none;
                color: #e4e4e4;
                width: 28px;
                height: 28px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 20px;
                line-height: 1;
                transition: all 0.2s;
            }

            .calc-close-btn:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .calc-content {
                flex: 1;
                padding: 20px;
                overflow-y: auto;
            }

            .calc-section {
                background: rgba(0, 0, 0, 0.2);
                padding: 15px;
                border-radius: 6px;
                margin-bottom: 15px;
                border: 1px solid #0f3460;
            }

            .calc-label {
                font-size: 14px;
                font-weight: bold;
                color: #e94560;
                margin-bottom: 8px;
            }

            .calc-info {
                font-size: 12px;
                color: #94a3b8;
                line-height: 1.5;
                margin-bottom: 10px;
            }

            .calc-btn {
                border: none;
                padding: 10px 20px;
                border-radius: 6px;
                cursor: pointer;
                font-weight: bold;
                font-size: 13px;
                transition: all 0.2s;
                margin: 5px;
            }

            .calc-btn-primary {
                background: rgba(59, 130, 246, 0.3);
                border: 1px solid #3b82f6;
                color: #93c5fd;
            }

            .calc-btn-primary:hover {
                background: rgba(59, 130, 246, 0.5);
            }

            .calc-btn-success {
                background: rgba(52, 211, 153, 0.3);
                border: 1px solid #34d399;
                color: #6ee7b7;
            }

            .calc-btn-success:hover {
                background: rgba(52, 211, 153, 0.5);
            }

            .calc-btn-download {
                background: rgba(168, 85, 247, 0.3);
                border: 1px solid #a855f7;
                color: #e9d5ff;
            }

            .calc-btn-download:hover {
                background: rgba(168, 85, 247, 0.5);
            }

            .calc-status {
                background: rgba(0, 0, 0, 0.3);
                padding: 10px;
                border-radius: 4px;
                font-size: 12px;
                min-height: 40px;
                max-height: 200px;
                overflow-y: auto;
            }

            .status-line {
                padding: 4px 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .status-line:last-child {
                border-bottom: none;
            }

            .status-success {
                color: #6ee7b7;
            }

            .status-error {
                color: #fca5a5;
            }

            .status-info {
                color: #93c5fd;
            }

            .stats-results {
                background: rgba(0, 0, 0, 0.3);
                padding: 15px;
                border-radius: 4px;
                max-height: 400px;
                overflow-y: auto;
                font-size: 12px;
            }

            .player-stat-item {
                background: rgba(255, 255, 255, 0.05);
                padding: 10px;
                margin-bottom: 8px;
                border-radius: 4px;
                border-left: 3px solid #34d399;
            }

            .player-stat-name {
                font-weight: bold;
                color: #e94560;
                margin-bottom: 4px;
            }

            .player-stat-line {
                color: #94a3b8;
                padding: 2px 0;
            }

            .calc-content::-webkit-scrollbar, .calc-status::-webkit-scrollbar {
                width: 8px;
            }

            .calc-content::-webkit-scrollbar-track, .calc-status::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.2);
                border-radius: 4px;
            }

            .calc-content::-webkit-scrollbar-thumb, .calc-status::-webkit-scrollbar-thumb {
                background: rgba(233, 69, 96, 0.5);
                border-radius: 4px;
            }
        `;
        document.head.appendChild(style);
    }

    // ============================================
    // UI CONTROL
    // ============================================

    function toggleCalculatorPanel() {
        const panel = document.getElementById('statsCalculatorPanel');
        calculatorPanelOpen = !calculatorPanelOpen;
        panel.style.display = calculatorPanelOpen ? 'flex' : 'none';

        if (calculatorPanelOpen) {
            updateDatabaseInfo();
        }
    }

    // ============================================
    // INITIALIZATION
    // ============================================

    async function init() {
        console.log('Poker Stats Calculator v2.0');
        console.log('Waiting for poker table...');

        const checkForTable = setInterval(async () => {
            const pokerTable = document.querySelector('.holdemWrapper___D71Gy');
            if (pokerTable) {
                clearInterval(checkForTable);
                console.log('Poker table found - initializing calculator');

                try {
                    await connectToDatabase();
                    console.log('Database connected');
                } catch (error) {
                    console.warn('Database connection failed:', error);
                }

                createUI();
            }
        }, 1000);

        setTimeout(() => clearInterval(checkForTable), 30000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();