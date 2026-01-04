// ==UserScript==
// @name         Poker Stats Display with Notes
// @namespace    http://tampermonkey.net/
// @version      2.1.0
// @description  Display player statistics from IndexedDB as HUD overlay with player notes
// @author       DuckOfDestiny
// @match        https://www.torn.com/page.php?sid=holdem*
// @grant        none
// @license MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/553320/Poker%20Stats%20Display%20with%20Notes.user.js
// @updateURL https://update.greasyfork.org/scripts/553320/Poker%20Stats%20Display%20with%20Notes.meta.js
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
                        lastUpdated: record.lastUpdated,
                        notes: record.notes || '' // Load notes from database
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
            document.getElementById('notesSection').style.display = 'block';
            updateNotesPanel();

            console.log(`Loaded stats for ${playerCount} players from database`);

        } catch (error) {
            statusDiv.innerHTML = `<div class="status-line status-error">Error: ${error.message}</div>`;
            console.error('Stats loading failed:', error);
        }
    }

    // ============================================
    // PLAYER NOTES MANAGEMENT
    // ============================================

    async function savePlayerNote(playerName, noteText) {
        if (!db) {
            console.error('Database not connected');
            return false;
        }

        try {
            const transaction = db.transaction(["playerStats"], "readwrite");
            const store = transaction.objectStore("playerStats");

            // Get existing player data
            const getRequest = store.get(playerName);

            return new Promise((resolve, reject) => {
                getRequest.onsuccess = function() {
                    const playerData = getRequest.result;

                    if (playerData) {
                        // Update with note
                        playerData.notes = noteText;
                        const updateRequest = store.put(playerData);

                        updateRequest.onsuccess = function() {
                            // Update in-memory stats
                            if (playerStats && playerStats[playerName]) {
                                playerStats[playerName].notes = noteText;
                            }
                            console.log(`Note saved for ${playerName}`);
                            resolve(true);
                        };

                        updateRequest.onerror = function() {
                            console.error('Failed to save note');
                            reject(false);
                        };
                    } else {
                        console.error('Player not found in database');
                        reject(false);
                    }
                };

                getRequest.onerror = function() {
                    console.error('Failed to retrieve player data');
                    reject(false);
                };
            });
        } catch (error) {
            console.error('Error saving note:', error);
            return false;
        }
    }

    function showNoteDialog(playerName) {
        // Remove any existing dialog
        const existingDialog = document.getElementById('playerNoteDialog');
        if (existingDialog) {
            existingDialog.remove();
        }

        const currentNote = (playerStats && playerStats[playerName] && playerStats[playerName].notes) || '';

        const dialog = document.createElement('div');
        dialog.id = 'playerNoteDialog';
        dialog.className = 'note-dialog-overlay';
        dialog.innerHTML = `
            <div class="note-dialog">
                <div class="note-dialog-header">
                    <span class="note-dialog-title">📝 Notes for ${playerName}</span>
                    <button class="note-dialog-close" id="noteDialogClose">×</button>
                </div>
                <div class="note-dialog-content">
                    <textarea id="noteTextarea" class="note-textarea" placeholder="Enter notes about this player...">${currentNote}</textarea>
                </div>
                <div class="note-dialog-footer">
                    <button class="display-btn display-btn-success" id="noteSaveBtn">💾 Save Note</button>
                    <button class="display-btn display-btn-secondary" id="noteCancelBtn">Cancel</button>
                    ${currentNote ? '<button class="display-btn display-btn-danger" id="noteDeleteBtn">🗑️ Delete Note</button>' : ''}
                </div>
            </div>
        `;

        document.body.appendChild(dialog);

        // Focus textarea
        const textarea = document.getElementById('noteTextarea');
        textarea.focus();
        textarea.setSelectionRange(textarea.value.length, textarea.value.length);

        // Event listeners
        document.getElementById('noteDialogClose').onclick = () => dialog.remove();
        document.getElementById('noteCancelBtn').onclick = () => dialog.remove();

        document.getElementById('noteSaveBtn').onclick = async () => {
            const noteText = textarea.value.trim();
            const success = await savePlayerNote(playerName, noteText);

            if (success) {
                dialog.remove();
                // Refresh HUD to show/hide note icon
                if (hudEnabled) {
                    updateAllOverlays();
                }
                updateNotesPanel();
            } else {
                alert('Failed to save note. Please try again.');
            }
        };

        if (currentNote) {
            document.getElementById('noteDeleteBtn').onclick = async () => {
                if (confirm(`Delete note for ${playerName}?`)) {
                    const success = await savePlayerNote(playerName, '');
                    if (success) {
                        dialog.remove();
                        if (hudEnabled) {
                            updateAllOverlays();
                        }
                        updateNotesPanel();
                    }
                }
            };
        }

        // Close on overlay click
        dialog.onclick = (e) => {
            if (e.target === dialog) {
                dialog.remove();
            }
        };

        // Close on Escape key
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                dialog.remove();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }

    function updateNotesPanel() {
        const notesContent = document.getElementById('notesListContent');
        if (!notesContent || !playerStats) return;

        // Get all players with notes
        const playersWithNotes = Object.entries(playerStats)
            .filter(([name, stats]) => stats.notes && stats.notes.trim() !== '')
            .sort((a, b) => a[0].localeCompare(b[0]));

        if (playersWithNotes.length === 0) {
            notesContent.innerHTML = '<div class="note-item-empty">No player notes yet. Right-click on any HUD to add notes!</div>';
            return;
        }

        notesContent.innerHTML = playersWithNotes.map(([playerName, stats]) => `
            <div class="note-item">
                <div class="note-item-header">
                    <span class="note-item-player">${playerName}</span>
                    <button class="note-item-edit" data-player="${playerName}">✏️ Edit</button>
                </div>
                <div class="note-item-text">${escapeHtml(stats.notes)}</div>
                <div class="note-item-stats">
                    <span>V:${stats.vpip}% P:${stats.pfr}% AF:${stats.af} (${stats.hands}h)</span>
                </div>
            </div>
        `).join('');

        // Add click handlers to edit buttons
        notesContent.querySelectorAll('.note-item-edit').forEach(btn => {
            btn.onclick = () => showNoteDialog(btn.dataset.player);
        });
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
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

        const hasNotes = stats.notes && stats.notes.trim() !== '';
        const noteIconHtml = hasNotes ? '<div class="hud-note-icon">📝</div>' : '';

        const hudElement = document.createElement('div');
        hudElement.className = 'poker-hud-overlay';
        if (hasNotes) {
            hudElement.classList.add('has-notes');
        }
        hudElement.innerHTML = `
            ${noteIconHtml}
            <div class="hud-stats">
                <div class="hud-vpip">V: ${stats.vpip}%</div>
                <div class="hud-pfr">P: ${stats.pfr}%</div>
                <div class="hud-af">AF: ${stats.af}</div>
                <div class="hud-hands">(${stats.hands}h)</div>
            </div>
        `;

        // Enable right-click for notes
        hudElement.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showNoteDialog(playerName);
        });

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

            const notesCount = matches.filter(m => m.stats.notes && m.stats.notes.trim() !== '').length;
            document.getElementById('hudInfo').innerHTML = `
                HUD Active<br>
                <small>Players at table: ${detectedPlayers.length}</small><br>
                <small>With stats: ${matches.length}</small><br>
                <small>With notes: ${notesCount}</small><br>
                <small>Without stats: ${noStats.length}</small>
                ${noStats.length > 0 ? `<br><small style="color: #fbbf24;">Missing: ${noStats.join(', ')}</small>` : ''}
                <br><small style="color: #93c5fd; margin-top: 5px; display: block;">Right-click any HUD to add/edit notes</small>
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
                <span class="display-title">📈 Poker Stats Display v2.1 (Drag to Move)</span>
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

                <div class="display-section" id="notesSection" style="display: none;">
                    <div class="display-label">📝 Player Notes</div>
                    <div class="display-info">
                        View and manage notes for all players. Right-click any HUD during play to add notes quickly.
                    </div>
                    <div id="notesListContent" class="notes-list">
                        <div class="note-item-empty">No player notes yet.</div>
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
                pointer-events: auto;
                border: 1px solid #333;
                min-width: 70px;
                text-align: center;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
                cursor: context-menu;
                transition: all 0.2s;
            }

            .poker-hud-overlay:hover {
                border-color: #e94560;
                box-shadow: 0 2px 12px rgba(233, 69, 96, 0.4);
            }

            .poker-hud-overlay.has-notes {
                border: 2px solid #fbbf24;
                box-shadow: 0 2px 8px rgba(251, 191, 36, 0.3);
            }

            .poker-hud-overlay.has-notes:hover {
                border-color: #f59e0b;
                box-shadow: 0 2px 12px rgba(245, 158, 11, 0.5);
            }

            .hud-note-icon {
                position: absolute;
                top: -8px;
                right: -8px;
                background: #fbbf24;
                border-radius: 50%;
                width: 18px;
                height: 18px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 10px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
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

            /* Note Dialog Styles */
            .note-dialog-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999999;
                animation: fadeIn 0.2s;
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            .note-dialog {
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border: 2px solid #0f3460;
                border-radius: 10px;
                width: 500px;
                max-width: 90vw;
                max-height: 80vh;
                display: flex;
                flex-direction: column;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.9);
                animation: slideUp 0.2s;
            }

            @keyframes slideUp {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }

            .note-dialog-header {
                background: #0f3460;
                padding: 12px 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-radius: 8px 8px 0 0;
            }

            .note-dialog-title {
                font-weight: bold;
                font-size: 14px;
                color: #e94560;
            }

            .note-dialog-close {
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

            .note-dialog-close:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .note-dialog-content {
                padding: 20px;
                flex: 1;
            }

            .note-textarea {
                width: 100%;
                height: 150px;
                background: rgba(0, 0, 0, 0.3);
                border: 1px solid #0f3460;
                border-radius: 6px;
                color: #e4e4e4;
                padding: 10px;
                font-family: 'Segoe UI', Arial, sans-serif;
                font-size: 13px;
                resize: vertical;
                min-height: 100px;
                max-height: 300px;
            }

            .note-textarea:focus {
                outline: none;
                border-color: #e94560;
                box-shadow: 0 0 0 2px rgba(233, 69, 96, 0.2);
            }

            .note-textarea::placeholder {
                color: #666;
            }

            .note-dialog-footer {
                padding: 15px 20px;
                display: flex;
                justify-content: center;
                gap: 10px;
                border-top: 1px solid #0f3460;
            }

            /* Notes List Styles */
            .notes-list {
                max-height: 300px;
                overflow-y: auto;
                margin-top: 10px;
            }

            .notes-list::-webkit-scrollbar {
                width: 8px;
            }

            .notes-list::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.2);
                border-radius: 4px;
            }

            .notes-list::-webkit-scrollbar-thumb {
                background: rgba(233, 69, 96, 0.5);
                border-radius: 4px;
            }

            .note-item {
                background: rgba(0, 0, 0, 0.3);
                border: 1px solid #0f3460;
                border-radius: 6px;
                padding: 12px;
                margin-bottom: 10px;
                transition: all 0.2s;
            }

            .note-item:hover {
                border-color: #e94560;
                background: rgba(0, 0, 0, 0.4);
            }

            .note-item-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
            }

            .note-item-player {
                font-weight: bold;
                color: #e94560;
                font-size: 13px;
            }

            .note-item-edit {
                background: rgba(59, 130, 246, 0.3);
                border: 1px solid #3b82f6;
                color: #93c5fd;
                padding: 4px 10px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 11px;
                transition: all 0.2s;
            }

            .note-item-edit:hover {
                background: rgba(59, 130, 246, 0.5);
            }

            .note-item-text {
                color: #e4e4e4;
                font-size: 12px;
                line-height: 1.5;
                margin-bottom: 8px;
                white-space: pre-wrap;
                word-wrap: break-word;
            }

            .note-item-stats {
                color: #94a3b8;
                font-size: 10px;
                font-family: 'Courier New', monospace;
            }

            .note-item-empty {
                color: #94a3b8;
                font-size: 12px;
                text-align: center;
                padding: 20px;
                font-style: italic;
            }
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
            document.getElementById('notesSection').style.display = 'none';

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
        console.log('Poker Stats Display v2.1 with Notes');
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