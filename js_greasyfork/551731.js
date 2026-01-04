// ==UserScript==
// @name         Poker Stats Display
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  Display player statistics from IndexedDB as HUD overlay
// @author       DuckOfDestiny
// @match        https://www.torn.com/page.php?sid=holdem*
// @grant        none
// @license MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/551731/Poker%20Stats%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/551731/Poker%20Stats%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================================
    // GLOBAL STATE
    // ============================================
    let db = null;
    let playerStats = null;
    let displayPanelOpen = false;
    let hudEnabled = false;
    let playerElements = {};
    let playerRefreshInterval = null;
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

                if (!db.objectStoreNames.contains("hands")) {
                    const handStore = db.createObjectStore("hands", {
                        keyPath: "autoId",
                        autoIncrement: true
                    });
                    handStore.createIndex("handNumber", "handNumber", { unique: false });
                    handStore.createIndex("handId", "handId", { unique: false });
                    handStore.createIndex("startTime", "startTime", { unique: false });
                }

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

    function loadStatsFromDatabase() {
        return new Promise((resolve, reject) => {
            if (!db) {
                reject(new Error('Database not connected'));
                return;
            }

            const transaction = db.transaction(["playerStats"], "readonly");
            const store = transaction.objectStore("playerStats");
            const request = store.openCursor();

            const stats = {};

            request.onsuccess = function(event) {
                const cursor = event.target.result;
                if (cursor) {
                    const record = cursor.value;
                    stats[record.playerName] = {
                        hands: record.hands,
                        vpip: record.vpip,
                        pfr: record.pfr,
                        af: record.af,
                        lastUpdated: record.lastUpdated
                    };
                    cursor.continue();
                } else {
                    resolve(stats);
                }
            };

            request.onerror = function() {
                reject(request.error);
            };
        });
    }

    async function loadStats() {
        const statusDiv = document.getElementById('displayStatus');
        statusDiv.innerHTML = '<div class="status-line status-info">Loading stats from database...</div>';

        try {
            const stats = await loadStatsFromDatabase();
            const playerCount = Object.keys(stats).length;

            if (playerCount === 0) {
                statusDiv.innerHTML = '<div class="status-line status-error">No stats in database. Run Stats Calculator first!</div>';
                return;
            }

            playerStats = stats;

            const timestamps = Object.values(stats).map(s => s.lastUpdated);
            const lastUpdated = timestamps.length > 0 ? new Date(Math.max(...timestamps)).toLocaleString() : 'Unknown';

            statusDiv.innerHTML = `
                <div class="status-line status-success">Stats loaded from database</div>
                <div class="status-line status-info">Players: ${playerCount}</div>
                <div class="status-line status-info">Last Updated: ${lastUpdated}</div>
            `;

            document.getElementById('hudSection').style.display = 'block';

            console.log(`Loaded stats for ${playerCount} players from database`);

        } catch (error) {
            statusDiv.innerHTML = `<div class="status-line status-error">Error: ${error.message}</div>`;
            console.error('Stats loading failed:', error);
        }
    }

    // ============================================
    // IMPORT FROM FILE (BACKUP ONLY)
    // ============================================

    function loadStatsFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = function(event) {
                try {
                    const data = JSON.parse(event.target.result);

                    if (!data.players || typeof data.players !== 'object') {
                        reject(new Error('Invalid stats file format (missing players object)'));
                        return;
                    }

                    resolve(data);
                } catch (error) {
                    reject(new Error('Failed to parse JSON: ' + error.message));
                }
            };

            reader.onerror = function() {
                reject(new Error('Failed to read file'));
            };

            reader.readAsText(file);
        });
    }

    async function handleStatsUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const statusDiv = document.getElementById('displayStatus');
        statusDiv.innerHTML = '<div class="status-line status-info">Loading external stats file...</div>';

        try {
            const data = await loadStatsFile(file);
            playerStats = data.players;

            const playerCount = Object.keys(playerStats).length;
            const lastUpdated = data.lastUpdated ? new Date(data.lastUpdated).toLocaleString() : 'Unknown';

            statusDiv.innerHTML = `
                <div class="status-line status-success">External stats loaded</div>
                <div class="status-line status-info">Players: ${playerCount}</div>
                <div class="status-line status-info">Last Updated: ${lastUpdated}</div>
                <div class="status-line" style="color: #fbbf24;">Note: Imported stats are temporary (not saved to database)</div>
            `;

            document.getElementById('hudSection').style.display = 'block';

            console.log(`Loaded stats for ${playerCount} players from file`);

        } catch (error) {
            statusDiv.innerHTML = `<div class="status-line status-error">Error: ${error.message}</div>`;
            console.error('Stats loading failed:', error);
        }

        event.target.value = '';
    }

    // ============================================
    // PLAYER DETECTION
    // ============================================

    function findPlayerElements() {
        const nameElements = document.querySelectorAll('.name___cESdZ');
        const detectedPlayers = [];
        playerElements = {};

        nameElements.forEach((element) => {
            const playerName = element.textContent.trim();
            if (playerName && playerName !== '') {
                detectedPlayers.push(playerName);
                playerElements[playerName] = {
                    nameElement: element,
                    hudElement: null
                };
            }
        });

        return detectedPlayers;
    }

    function matchPlayersWithStats(detectedPlayers) {
        const matches = [];
        const noStats = [];

        detectedPlayers.forEach(playerName => {
            if (playerStats && playerStats[playerName]) {
                matches.push({
                    name: playerName,
                    stats: playerStats[playerName]
                });
            } else {
                noStats.push(playerName);
            }
        });

        return { matches, noStats };
    }

    // ============================================
    // HUD OVERLAY RENDERING
    // ============================================

    function createPlayerOverlay(playerName, stats) {
        const playerData = playerElements[playerName];
        if (!playerData || !playerData.nameElement) return;

        if (playerData.hudElement) {
            playerData.hudElement.remove();
        }

        const hudElement = document.createElement('div');
        hudElement.className = 'poker-hud-overlay';
        hudElement.innerHTML = `
            <div class="hud-stats">
                <div class="hud-vpip">V: ${stats.vpip}%</div>
                <div class="hud-pfr">P: ${stats.pfr}%</div>
                <div class="hud-af">AF: ${stats.af}</div>
                <div class="hud-hands">(${stats.hands}h)</div>
            </div>
        `;

        const pokerWrapper = document.querySelector('.holdemWrapper___D71Gy');
        if (!pokerWrapper) return;

        const nameRect = playerData.nameElement.getBoundingClientRect();
        const wrapperRect = pokerWrapper.getBoundingClientRect();

        const tableCenterX = wrapperRect.width / 2;
        const playerCenterX = nameRect.left - wrapperRect.left + (nameRect.width / 2);

        hudElement.style.position = 'absolute';
        hudElement.style.top = Math.max(5, (nameRect.top - wrapperRect.top)) + 'px';

        if (playerCenterX < tableCenterX) {
            hudElement.style.right = (wrapperRect.right - nameRect.left + 15) + 'px';
        } else {
            hudElement.style.left = Math.max(5, (nameRect.left - wrapperRect.left + nameRect.width + 10)) + 'px';
        }

        pokerWrapper.appendChild(hudElement);
        playerData.hudElement = hudElement;
    }

    function updateAllOverlays() {
        if (!hudEnabled || !playerStats) return;

        const detectedPlayers = findPlayerElements();
        const { matches } = matchPlayersWithStats(detectedPlayers);

        matches.forEach(match => {
            createPlayerOverlay(match.name, match.stats);
        });
    }

    function removeAllOverlays() {
        Object.values(playerElements).forEach(playerData => {
            if (playerData.hudElement) {
                playerData.hudElement.remove();
                playerData.hudElement = null;
            }
        });
    }

    // ============================================
    // HUD CONTROL
    // ============================================

    function toggleHUD() {
        const button = document.getElementById('toggleHudBtn');

        if (!playerStats) {
            alert('Please load stats first');
            return;
        }

        if (!hudEnabled) {
            const detectedPlayers = findPlayerElements();

            if (detectedPlayers.length === 0) {
                alert('No players detected at table. Make sure you are seated at a table.');
                return;
            }

            const { matches, noStats } = matchPlayersWithStats(detectedPlayers);

            console.log(`Detected ${detectedPlayers.length} players at table`);
            console.log(`${matches.length} have stats, ${noStats.length} without stats`);

            if (matches.length === 0) {
                alert('No players at this table have stats in the loaded file.');
                return;
            }

            hudEnabled = true;
            button.innerHTML = '⏹️ Stop HUD';
            button.classList.remove('display-btn-success');
            button.classList.add('display-btn-danger');

            updateAllOverlays();

            if (playerRefreshInterval) clearInterval(playerRefreshInterval);
            playerRefreshInterval = setInterval(() => {
                if (hudEnabled) {
                    updateAllOverlays();
                }
            }, 3000);

            document.getElementById('hudInfo').innerHTML = `
                HUD Active<br>
                <small>Players at table: ${detectedPlayers.length}</small><br>
                <small>With stats: ${matches.length}</small><br>
                <small>Without stats: ${noStats.length}</small>
                ${noStats.length > 0 ? `<br><small style="color: #fbbf24;">Missing: ${noStats.join(', ')}</small>` : ''}
            `;

            console.log('HUD enabled');

        } else {
            hudEnabled = false;
            button.innerHTML = '🎯 Start HUD';
            button.classList.remove('display-btn-danger');
            button.classList.add('display-btn-success');

            if (playerRefreshInterval) {
                clearInterval(playerRefreshInterval);
                playerRefreshInterval = null;
            }

            removeAllOverlays();

            document.getElementById('hudInfo').innerHTML = 'Stats loaded and ready to display.';

            console.log('HUD disabled');
        }
    }

    // ============================================
    // UI CREATION
    // ============================================

    function createUI() {
        const controlBtn = document.createElement('button');
        controlBtn.id = 'statsDisplayBtn';
        controlBtn.className = 'stats-display-btn';
        controlBtn.innerHTML = '📈 Stats Display';
        controlBtn.onclick = toggleDisplayPanel;

        const panel = document.createElement('div');
        panel.id = 'statsDisplayPanel';
        panel.className = 'stats-display-panel';
        panel.style.display = 'none';
        panel.innerHTML = `
            <div class="display-header" id="displayDragHandle">
                <span class="display-title">📈 Poker Stats Display v2.0 (Drag to Move)</span>
                <button class="display-close-btn" id="displayCloseBtn">×</button>
            </div>
            <div class="display-content">
                <div class="display-section">
                    <div class="display-label">Load Stats from Database</div>
                    <div class="display-info">
                        Load player statistics calculated by the Stats Calculator.
                        Stats will be displayed as overlays on the poker table.
                    </div>
                    <div style="margin: 15px 0; text-align: center;">
                        <button class="display-btn display-btn-success" id="loadStatsBtn">
                            📊 Load Stats from Database
                        </button>
                    </div>
                    <div id="displayStatus" class="display-status"></div>
                </div>

                <div class="display-section">
                    <div class="display-label">Import External Stats (Optional)</div>
                    <div class="display-info">
                        Load stats from an external JSON file (temporary, not saved to database).
                    </div>
                    <div style="margin: 15px 0; text-align: center;">
                        <button class="display-btn display-btn-primary" id="uploadStatsBtn">
                            📂 Import Stats JSON
                        </button>
                        <input type="file" id="statsFileInput" accept=".json" style="display: none;">
                    </div>
                </div>

                <div class="display-section" id="hudSection" style="display: none;">
                    <div class="display-label">HUD Controls</div>
                    <div class="display-info" id="hudInfo">
                        Stats loaded and ready to display.
                    </div>
                    <div style="margin: 15px 0; text-align: center;">
                        <button class="display-btn display-btn-success" id="toggleHudBtn">
                            🎯 Start HUD
                        </button>
                        <button class="display-btn display-btn-secondary" id="clearStatsBtn">
                            🗑️ Clear Stats
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(controlBtn);
        document.body.appendChild(panel);

        document.getElementById('displayCloseBtn').onclick = toggleDisplayPanel;
        document.getElementById('loadStatsBtn').onclick = loadStats;
        document.getElementById('uploadStatsBtn').onclick = () => {
            document.getElementById('statsFileInput').click();
        };
        document.getElementById('statsFileInput').onchange = handleStatsUpload;
        document.getElementById('toggleHudBtn').onclick = toggleHUD;
        document.getElementById('clearStatsBtn').onclick = clearStats;

        makeDraggable(panel, document.getElementById('displayDragHandle'));
        injectStyles();
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
            .stats-display-btn {
                position: fixed;
                bottom: 140px;
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

            .stats-display-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.6);
            }

            .stats-display-panel {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 600px;
                max-width: 95vw;
                max-height: 80vh;
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

            .display-header {
                background: #0f3460;
                padding: 12px 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-radius: 8px 8px 0 0;
            }

            .display-title {
                font-weight: bold;
                font-size: 14px;
                color: #e94560;
            }

            .display-close-btn {
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

            .display-close-btn:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .display-content {
                flex: 1;
                padding: 20px;
                overflow-y: auto;
            }

            .display-section {
                background: rgba(0, 0, 0, 0.2);
                padding: 15px;
                border-radius: 6px;
                margin-bottom: 15px;
                border: 1px solid #0f3460;
            }

            .display-label {
                font-size: 14px;
                font-weight: bold;
                color: #e94560;
                margin-bottom: 8px;
            }

            .display-info {
                font-size: 12px;
                color: #94a3b8;
                line-height: 1.5;
                margin-bottom: 10px;
            }

            .display-btn {
                border: none;
                padding: 10px 20px;
                border-radius: 6px;
                cursor: pointer;
                font-weight: bold;
                font-size: 13px;
                transition: all 0.2s;
                margin: 5px;
            }

            .display-btn-primary {
                background: rgba(59, 130, 246, 0.3);
                border: 1px solid #3b82f6;
                color: #93c5fd;
            }

            .display-btn-primary:hover {
                background: rgba(59, 130, 246, 0.5);
            }

            .display-btn-success {
                background: rgba(52, 211, 153, 0.3);
                border: 1px solid #34d399;
                color: #6ee7b7;
            }

            .display-btn-success:hover {
                background: rgba(52, 211, 153, 0.5);
            }

            .display-btn-danger {
                background: rgba(239, 68, 68, 0.3);
                border: 1px solid #ef4444;
                color: #fca5a5;
            }

            .display-btn-danger:hover {
                background: rgba(239, 68, 68, 0.5);
            }

            .display-btn-secondary {
                background: rgba(100, 100, 100, 0.3);
                border: 1px solid #666;
                color: #ccc;
            }

            .display-btn-secondary:hover {
                background: rgba(100, 100, 100, 0.5);
            }

            .display-status {
                background: rgba(0, 0, 0, 0.3);
                padding: 10px;
                border-radius: 4px;
                font-size: 12px;
                min-height: 60px;
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

            .display-content::-webkit-scrollbar {
                width: 8px;
            }

            .display-content::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.2);
                border-radius: 4px;
            }

            .display-content::-webkit-scrollbar-thumb {
                background: rgba(233, 69, 96, 0.5);
                border-radius: 4px;
            }

            .poker-hud-overlay {
                position: absolute;
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 6px 10px;
                border-radius: 6px;
                font-family: 'Courier New', monospace;
                font-size: 11px;
                font-weight: bold;
                z-index: 999999;
                pointer-events: none;
                border: 1px solid #333;
                min-width: 70px;
                text-align: center;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
            }

            .hud-stats {
                display: flex;
                flex-direction: column;
                gap: 2px;
            }

            .hud-vpip { color: #4CAF50; }
            .hud-pfr { color: #FF9800; }
            .hud-af { color: #E91E63; }
            .hud-hands { color: #2196F3; font-size: 9px; }
        `;
        document.head.appendChild(style);
    }

    // ============================================
    // UI CONTROL
    // ============================================

    function toggleDisplayPanel() {
        const panel = document.getElementById('statsDisplayPanel');
        displayPanelOpen = !displayPanelOpen;
        panel.style.display = displayPanelOpen ? 'flex' : 'none';
    }

    function clearStats() {
        if (confirm('Clear loaded stats? The HUD will stop if active.')) {
            playerStats = null;
            document.getElementById('displayStatus').innerHTML = '';
            document.getElementById('hudSection').style.display = 'none';

            if (hudEnabled) {
                toggleHUD();
            }

            console.log('Stats cleared');
        }
    }

    // ============================================
    // INITIALIZATION
    // ============================================

    async function init() {
        console.log('Poker Stats Display v2.0');
        console.log('Waiting for poker table...');

        const checkForTable = setInterval(async () => {
            const pokerTable = document.querySelector('.holdemWrapper___D71Gy');
            if (pokerTable) {
                clearInterval(checkForTable);
                console.log('Poker table found - initializing display');

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