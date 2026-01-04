// ==UserScript==
// @name         Poker Stats Display v3.1 with Notes
// @namespace    http://tampermonkey.net/
// @version      3.1.0
// @description  Display 8 player statistics (VPIP/PFR/3Bet/AF/CBet/Fold3Bet/WTSD/W$SD) with notes system
// @author       DuckOfDestiny
// @match        https://www.torn.com/page.php?sid=holdem*
// @grant        none
// @license MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/554061/Poker%20Stats%20Display%20v31%20with%20Notes.user.js
// @updateURL https://update.greasyfork.org/scripts/554061/Poker%20Stats%20Display%20v31%20with%20Notes.meta.js
// ==/UserScript==


// ===============================
// 🩹 Notes DB Early Initialization
// ===============================

let notesDB;
const DB_NAME = "pokerHandHistoryDB";
const STORE_NAME = "playerNotes";
const DB_VERSION = 10;

async function connectNotesDB() {
  if (window.notesDB) return window.notesDB;
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("pokerHandHistoryDB", 13);
    req.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("playerNotes")) {
        db.createObjectStore("playerNotes", { keyPath: "playerName" });
        console.log("🆕 playerNotes store created");
      }
    };
    req.onsuccess = e => {
      window.notesDB = e.target.result;
      console.log("✅ Connected to playerNotes DB");
      resolve(window.notesDB);
    };
    req.onerror = e => reject(e.target.error);
  });
}
// --- Get a single player's note (used by HUD right-click dialog) ---
async function getNoteForPlayer(playerName) {
  const db = await connectNotesDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("playerNotes", "readonly");
    const store = tx.objectStore("playerNotes");
    const req = store.get(playerName);
    req.onsuccess = () => {
      const record = req.result;
      resolve(record ? record.noteText || "" : "");
    };
    req.onerror = e => reject(e.target.error);
  });
}
// --- 💾 Save or update a note for a player ---
async function saveNote(playerName, noteText) {
  const db = await connectNotesDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.put({ playerName, noteText, lastUpdated: Date.now() });
    tx.oncomplete = () => {
      console.log(`💾 Saved note for ${playerName}: "${noteText}"`);
      resolve(true);
    };
    tx.onerror = e => reject(e.target.error);
  });
}


// Run immediately when the script loads
connectNotesDB().then(() => console.log("🩹 Notes DB verified early"));



// ===============================
// MAIN SCRIPT STARTS HERE
// ===============================


(function() {
    'use strict';
    // DEBUG ONLY — allow reading playerStats from console
Object.defineProperty(window, 'playerStats', {
    get() { return playerStats; },
    configurable: true
});


    // ============================================
    // GLOBAL STATE
    // ============================================
    let db = null;
    let playerStats = null;
    let displayPanelOpen = false;
    let hudEnabled = false;
    let playerElements = {};
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };

    // ============================================
    // DATABASE CONNECTION
    // ============================================

    function connectToDatabase() {
        return new Promise((resolve, reject) => {
            const openRequest = indexedDB.open("pokerHandHistoryDB", 13);

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

        request.onsuccess = function (event) {
            const cursor = event.target.result;
            if (cursor) {
                const record = cursor.value;
                stats[record.playerName] = {
                    hands: record.hands,
                    vpip: record.vpip,
                    pfr: record.pfr,
                    af: record.af,
                    threeBet: record.threeBet || 0,
                    cbet: record.cbet || null,
                    foldTo3Bet: record.foldTo3Bet || null,
                    wtsd: record.wtsd || null,
                    wsd: record.wsd || null,
                    lastUpdated: record.lastUpdated
                };
                cursor.continue();
            } else {
                resolve(stats);
            }
        };

        request.onerror = function () {
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
        // Refresh HUD if it's active
        if (hudEnabled) {
            updateAllOverlays();
        }

        console.log(`Loaded stats for ${playerCount} players from database`);

    } catch (error) {
        statusDiv.innerHTML = `<div class="status-line status-error">Error: ${error.message}</div>`;
        console.error('Stats loading failed:', error);
    }
}


    // ============================================
    // PLAYER NOTES MANAGEMENT
    // ============================================

    // Save or update a player's note in the new "playerNotes" store
async function savePlayerNote(playerName, noteText) {
    if (!db) {
        console.error("Database not connected");
        return false;
    }

    try {
        const tx = db.transaction(["playerNotes"], "readwrite");
        const store = tx.objectStore("playerNotes");

        const noteData = {
            playerName,
            noteText,
            lastUpdated: Date.now()
        };

        const req = store.put(noteData);

        return new Promise((resolve, reject) => {
            req.onsuccess = () => {
                // Optional: keep HUD memory copy consistent
                if (playerStats && playerStats[playerName]) {
                    playerStats[playerName].notes = noteText;
                }
                console.log(`📝 Note saved for ${playerName}`);
                resolve(true);
            };
            req.onerror = () => {
                console.error("❌ Failed to save note");
                reject(false);
            };
        });
    } catch (err) {
        console.error("Error saving note:", err);
        return false;
    }
}

// ============================================
    // STAT LABEL HELPER
    // ============================================

    function getStatLabel(statName, value) {
        if (value === null || value === undefined || value === '--') return '';

        const numValue = parseFloat(value);

        switch(statName) {
            case 'vpip':
                if (numValue < 15) return '(Very Tight)';
                if (numValue < 23) return '(Tight)';
                if (numValue < 30) return '(Normal)';
                if (numValue < 40) return '(Loose)';
                return '(Very Loose)';

            case 'pfr':
                if (numValue < 10) return '(Very Passive)';
                if (numValue < 15) return '(Passive)';
                if (numValue < 20) return '(Normal)';
                if (numValue < 25) return '(Aggressive)';
                return '(Very Aggressive)';

            case 'threeBet':
                if (numValue < 3) return '(Weak)';
                if (numValue < 6) return '(Normal)';
                if (numValue < 10) return '(Strong)';
                return '(Very Strong)';

            case 'af':
                if (numValue < 1.0) return '(Very Passive)';
                if (numValue < 1.5) return '(Passive)';
                if (numValue < 2.0) return '(Normal)';
                if (numValue < 3.0) return '(Aggressive)';
                return '(Very Aggressive)';

            case 'cbet':
                if (numValue < 40) return '(Low)';
                if (numValue < 60) return '(Normal)';
                if (numValue < 75) return '(Standard)';
                return '(High)';

            case 'foldTo3Bet':
                if (numValue < 30) return '(Never Folds)';
                if (numValue < 50) return '(Normal)';
                if (numValue < 70) return '(Balanced)';
                return '(Folds Too Much)';

            case 'wtsd':
                if (numValue < 20) return '(Tight)';
                if (numValue < 30) return '(Normal)';
                if (numValue < 40) return '(Loose)';
                return '(Calling Station)';

            case 'wsd':
                if (numValue < 45) return '(Weak)';
                if (numValue < 52) return '(Normal)';
                if (numValue < 58) return '(Good)';
                return '(Strong)';

            default:
                return '';
        }
    }
    async function showNoteDialog(playerName) {
    // Remove any existing dialog
    const existingDialog = document.getElementById('playerNoteDialog');
    if (existingDialog) existingDialog.remove();

    // --- 🔄 NEW: Load note directly from Notes v2 DB ---
    let existingNote = "";
    try {
        existingNote = await getNoteForPlayer(playerName) || "";
    } catch (err) {
        console.warn("⚠️ Could not load note from Notes v2:", err);
    }

    const stats = playerStats && playerStats[playerName] ? playerStats[playerName] : null;
    if (!stats) {
        alert("No stats available for this player.");
        return;
    }

    const formatStat = (value, suffix = "%") =>
        value === null || value === undefined ? "--" : value + suffix;

    const dialog = document.createElement("div");
    dialog.id = "playerNoteDialog";
    dialog.className = "note-dialog-overlay";
    dialog.innerHTML = `
        <div class="note-dialog">
            <div class="note-dialog-header">
                <span class="note-dialog-title">📝 Stats & Notes for ${playerName}</span>
                <button class="note-dialog-close" id="noteDialogClose">×</button>
            </div>
            <div class="note-dialog-content">
                <div class="note-item-stats-grid">
                    <div class="stat-category">
                        <div class="stat-category-title">Core Stats</div>
                        <div class="stat-row"><span class="stat-label">VPIP:</span>
                            <span class="stat-value">${stats.vpip}% ${getStatLabel("vpip", stats.vpip)}</span></div>
                        <div class="stat-row"><span class="stat-label">PFR:</span>
                            <span class="stat-value">${stats.pfr}% ${getStatLabel("pfr", stats.pfr)}</span></div>
                        <div class="stat-row"><span class="stat-label">3Bet:</span>
                            <span class="stat-value">${formatStat(stats.threeBet)} ${getStatLabel("threeBet", stats.threeBet)}</span></div>
                        <div class="stat-row"><span class="stat-label">AF:</span>
                            <span class="stat-value">${stats.af} ${getStatLabel("af", stats.af)}</span></div>
                    </div>
                    <div class="stat-category">
                        <div class="stat-category-title">Postflop</div>
                        <div class="stat-row"><span class="stat-label">CBet:</span>
                            <span class="stat-value">${formatStat(stats.cbet)} ${getStatLabel("cbet", stats.cbet)}</span></div>
                        <div class="stat-row"><span class="stat-label">Fold 3Bet:</span>
                            <span class="stat-value">${formatStat(stats.foldTo3Bet)} ${getStatLabel("foldTo3Bet", stats.foldTo3Bet)}</span></div>
                        <div class="stat-row"><span class="stat-label">WTSD:</span>
                            <span class="stat-value">${formatStat(stats.wtsd)} ${getStatLabel("wtsd", stats.wtsd)}</span></div>
                        <div class="stat-row"><span class="stat-label">W$SD:</span>
                            <span class="stat-value">${formatStat(stats.wsd)} ${getStatLabel("wsd", stats.wsd)}</span></div>
                    </div>
                </div>
                <div style="margin-top:15px;padding-top:15px;border-top:1px solid rgba(255,255,255,0.1);">
                    <div class="note-text-label">Your Notes:</div>
                    <textarea id="noteTextarea" class="note-textarea" placeholder="Enter notes about this player...">${existingNote}</textarea>
                </div>
            </div>
            <div class="note-dialog-footer">
                <button class="display-btn display-btn-success" id="noteSaveBtn">💾 Save Note</button>
                <button class="display-btn display-btn-secondary" id="noteCancelBtn">Cancel</button>
                ${existingNote ? '<button class="display-btn display-btn-danger" id="noteDeleteBtn">🗑️ Delete Note</button>' : ''}
            </div>
        </div>
    `;

    document.body.appendChild(dialog);

    // Focus textarea
    const textarea = document.getElementById("noteTextarea");
    textarea.focus();
    textarea.setSelectionRange(textarea.value.length, textarea.value.length);

    // Event listeners
    document.getElementById("noteDialogClose").onclick = () => dialog.remove();
    document.getElementById("noteCancelBtn").onclick = () => dialog.remove();

    // --- 💾 Save via Notes v2 ---
    document.getElementById("noteSaveBtn").onclick = async () => {
        const noteText = textarea.value.trim();
        await saveNote(playerName, noteText);
        dialog.remove();
        if (hudEnabled && typeof updateAllOverlays === "function") updateAllOverlays();
    };

    // --- 🗑️ Delete note via Notes v2 ---
    if (existingNote) {
        document.getElementById("noteDeleteBtn").onclick = async () => {
            if (confirm(`Delete note for ${playerName}?`)) {
                await saveNote(playerName, "");
                dialog.remove();
                if (hudEnabled && typeof updateAllOverlays === "function") updateAllOverlays();
            }
        };
    }

    // Close on overlay click or Escape
    dialog.onclick = e => { if (e.target === dialog) dialog.remove(); };
    const escapeHandler = e => {
        if (e.key === "Escape") {
            dialog.remove();
            document.removeEventListener("keydown", escapeHandler);
        }
    };
    document.addEventListener("keydown", escapeHandler);
}


    async function updateNotesPanel() {
        const notesContent = document.getElementById('notesListContent');
        if (!notesContent || !playerStats) return;

        // Get all notes from Notes v2 DB
        const allNotes = await loadAllNotes();
        const playersWithNotes = allNotes
        .filter(note => note.noteText && note.noteText.trim() !== '' && playerStats[note.playerName])
        .map(note => [note.playerName, playerStats[note.playerName], note.noteText])
        .sort((a, b) => a[0].localeCompare(b[0]));

        if (playersWithNotes.length === 0) {
            notesContent.innerHTML = '<div class="note-item-empty">No player notes yet. Right-click on any HUD to add notes!</div>';
            return;
        }

        notesContent.innerHTML = playersWithNotes.map(([playerName, stats, noteText]) => {
            const formatStat = (value, suffix = '%') => {
                return (value === null || value === undefined) ? '--' : value + suffix;
            };

            return `
            <div class="note-item">
                <div class="note-item-header">
                    <span class="note-item-player">${playerName} (${stats.hands}h)</span>
                    <button class="note-item-edit" data-player="${playerName}">✏️ Edit</button>
                </div>

                <div class="note-item-stats-grid">
                    <div class="stat-category">
                        <div class="stat-category-title">Core Stats</div>
                        <div class="stat-row">
                            <span class="stat-label">VPIP:</span>
                            <span class="stat-value">${stats.vpip}%</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">PFR:</span>
                            <span class="stat-value">${stats.pfr}%</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">3Bet:</span>
                            <span class="stat-value">${formatStat(stats.threeBet)}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">AF:</span>
                            <span class="stat-value">${stats.af}</span>
                        </div>
                    </div>

                    <div class="stat-category">
                        <div class="stat-category-title">Postflop</div>
                        <div class="stat-row">
                            <span class="stat-label">CBet:</span>
                            <span class="stat-value">${formatStat(stats.cbet)}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Fold 3Bet:</span>
                            <span class="stat-value">${formatStat(stats.foldTo3Bet)}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">WTSD:</span>
                            <span class="stat-value">${formatStat(stats.wtsd)}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">W$SD:</span>
                            <span class="stat-value">${formatStat(stats.wsd)}</span>
                        </div>
                    </div>
                </div>

                <div class="note-item-text-section">
                    <div class="note-text-label">Notes:</div>
                    <div class="note-item-text">${escapeHtml(noteText)}</div>
                </div>
            </div>
        `}).join('');

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

                    // Handle both formats: "stats" (from Calculator) or "players" (legacy)
                    if (data.stats && typeof data.stats === 'object') {
                        // Stats Calculator format
                        resolve({ players: data.stats, lastUpdated: data.exportDate });
                    } else if (data.players && typeof data.players === 'object') {
                        // Legacy format
                        resolve(data);
                    } else {
                        reject(new Error('Invalid stats file format (missing stats/players object)'));
                        return;
                    }
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

    async function createPlayerOverlay(playerName, stats, playerData) {
        if (playerData.hudElement) {
            playerData.hudElement.remove();
        }

        const formatStat = (value) => (value === null || value === undefined) ? '--' : value;

        const hudElement = document.createElement('div');
        hudElement.className = 'poker-hud-overlay';
        const playerNote = await getNoteForPlayer(playerName);
        if (playerNote && playerNote.trim() !== '') {
            hudElement.classList.add('has-notes');
        }

        hudElement.innerHTML = `
            <div class="hud-stats">
                ${playerNote && playerNote.trim() !== '' ? '<div class="hud-note-icon">📝</div>' : ''}
                <div class="hud-main">V:${stats.vpip} P:${stats.pfr}</div>
                <div class="hud-main">3B:${stats.threeBet} CB:${formatStat(stats.cbet)}</div>
                <div class="hud-main">AF:${stats.af}</div>
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
            const playerData = playerElements[match.name];
            if (playerData) {
                createPlayerOverlay(match.name, match.stats, playerData);
            }
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

    async function toggleHUD() {
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

            const allNotes = await loadAllNotes();
            const matchedPlayerNames = matches.map(m => m.name);
            const notesCount = allNotes.filter(note => matchedPlayerNames.includes(note.playerName) && note.noteText && note.noteText.trim() !== '').length;
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
                <span class="display-title">📈 Poker Stats Display v3.0 (Drag to Move)</span>
                <button class="display-help-btn" id="displayHelpBtn">?</button>
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

        // Create help modal
        const helpModal = document.createElement('div');
        helpModal.id = 'displayHelpModal';
        helpModal.className = 'display-modal';
        helpModal.style.display = 'none';
        helpModal.innerHTML = `
            <div class="display-modal-content">
                <div class="display-modal-header">
                    <span class="display-modal-title">How to Use Stats Display</span>
                    <button class="display-close-btn" id="displayHelpClose">×</button>
                </div>
                <div class="display-modal-body">
                    <h3>✨ Fully Automatic Operation</h3>
                    <p>Stats load and display automatically when you open the poker page:</p>
                    <p>• Stats load from database on startup</p>
                    <p>• HUD overlays appear automatically</p>
                    <p>• Updates after every hand automatically</p>
                    <p><strong>No manual clicking required!</strong></p>

                    <h3>📊 HUD Overlays</h3>
                    <p>Stat boxes appear over each player showing:</p>
                    <p>• <strong>Core Stats:</strong> Hands, VPIP, PFR, 3Bet%, AF</p>
                    <p>• <strong>Postflop Stats:</strong> CBet%, Fold to 3Bet%, WTSD%, W$SD%</p>
                    <p>• <strong>Notes:</strong> Your custom notes (click to add/edit)</p>
                    <p><strong>Color coding:</strong> Tight/Loose, Passive/Aggressive ranges</p>

                    <h3>🔄 Load Stats Button</h3>
                    <p>Manual refresh of stats from database:</p>
                    <p>• Use if stats seem outdated</p>
                    <p>• Troubleshooting only - normally auto-updates</p>
                    <p>• Shows player count and last update time</p>

                    <h3>👁️ Toggle HUD Button</h3>
                    <p><strong>Hide HUD:</strong> Temporarily hide all stat overlays</p>
                    <p><strong>Show HUD:</strong> Make overlays visible again</p>
                    <p>• Use to declutter screen when needed</p>
                    <p>• Stats remain loaded in memory</p>
                    <p>• HUD auto-enables on page load</p>

                    <h3>📝 Player Notes</h3>
                    <p>Click any stat overlay to add/edit notes:</p>
                    <p>• Notes saved per player</p>
                    <p>• Persist across sessions</p>
                    <p>• Visible on HUD overlay</p>
                    <p>• Use for player tendencies, tells, history</p>

                    <h3>🔄 Automatic Updates</h3>
                    <p>HUD refreshes automatically when:</p>
                    <p>• Hand completes and stats calculate</p>
                    <p>• Stats Calculator finishes processing</p>
                    <p>• New stats become available</p>
                    <p>• No manual refresh needed during play</p>

                    <h3>🎯 Database Architecture</h3>
                    <p>This script reads from the shared poker database:</p>
                    <p>• <strong>Player Stats:</strong> Calculated statistics for each player</p>
                    <p>• <strong>Player Notes:</strong> Your custom notes per player</p>
                    <p>• Updates automatically when Calculator processes new hands</p>
                    <p>• Use Hand Collector's Settings to manage all poker data</p>

                    <h3>📈 Stat Explanations</h3>
                    <p><strong>VPIP:</strong> Voluntarily Put $ In Pot (preflop aggression)</p>
                    <p><strong>PFR:</strong> Preflop Raise (how often raises preflop)</p>
                    <p><strong>3Bet%:</strong> How often 3-bets when facing a raise</p>
                    <p><strong>AF:</strong> Aggression Factor (bets+raises / calls)</p>
                    <p><strong>CBet%:</strong> Continuation bet on flop after raising preflop</p>
                    <p><strong>Fold to 3Bet%:</strong> Folds when facing a 3-bet</p>
                    <p><strong>WTSD%:</strong> Went To Showdown (how often sees river)</p>
                    <p><strong>W$SD%:</strong> Won $ at Showdown (showdown win rate)</p>

                    <h3>🎨 Color Coding Guide</h3>
                    <p><strong>VPIP Colors:</strong></p>
                    <p>• Green (< 25%): Tight player</p>
                    <p>• Yellow (25-35%): Standard</p>
                    <p>• Red (> 35%): Loose player</p>
                    <p><strong>AF Colors:</strong></p>
                    <p>• Green (< 1.0): Passive</p>
                    <p>• Yellow (1.0-2.0): Balanced</p>
                    <p>• Red (> 2.0): Aggressive</p>

                    <h3>💡 Pro Tips</h3>
                    <p>• Let HUD auto-load - no manual clicking needed</p>
                    <p>• Add notes during/after hands for better reads</p>
                    <p>• VPIP + PFR shows playing style (TAG/LAG/etc)</p>
                    <p>• Small sample sizes (< 30 hands) unreliable</p>
                    <p>• Both $ and BB bet formats fully supported</p>
                    <p>• Stats accumulate automatically across sessions</p>
                    <p>• Use Hand Collector to review hand histories</p>
                </div>
            </div>
        `;
        document.body.appendChild(helpModal);
        // --- 🗂️ Notes Import / Export buttons ---
        const notesControls = document.createElement("div");
        notesControls.style.marginTop = "8px";
        notesControls.style.textAlign = "center";
        notesControls.innerHTML = `
  <button id="exportNotesBtn" class="display-btn display-btn-secondary" style="margin-right:5px;">
    ⬇️ Export Notes
  </button>
  <button id="importNotesBtn" class="display-btn display-btn-secondary">
    ⬆️ Import Notes
  </button>
  <input type="file" id="importNotesFile" accept=".json" style="display:none">
`;
        document.querySelector('#notesSection .display-info').appendChild(notesControls);
        // --- 🎛️ Notes Import / Export Handlers ---
        const exportBtn = document.getElementById("exportNotesBtn");
        const importBtn = document.getElementById("importNotesBtn");
        const importFileInput = document.getElementById("importNotesFile");

        if (exportBtn) {
            exportBtn.onclick = async () => {
                if (typeof exportNotes === "function") {
                    await exportNotes();
                } else {
                    alert("⚠️ exportNotes() not found");
                }
            };
        }

        if (importBtn && importFileInput) {
            importBtn.onclick = () => importFileInput.click();
            importFileInput.onchange = async (e) => {
                const file = e.target.files[0];
                if (file && typeof importNotes === "function") {
                    await importNotes(file);
                    alert("✅ Notes imported successfully!");
                } else {
                    alert("⚠️ Could not import notes.");
                }
            };
        }

        document.getElementById('displayCloseBtn').onclick = toggleDisplayPanel;
        document.getElementById('displayHelpBtn').onclick = () => {
            document.getElementById('displayHelpModal').style.display = 'flex';
        };
        document.getElementById('displayHelpClose').onclick = () => {
            document.getElementById('displayHelpModal').style.display = 'none';
        };
        document.getElementById('loadStatsBtn').onclick = loadStats;
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
                z-index: 1400;
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
                z-index: 999999;
                display: flex;
                flex-direction: column;
                font-family: 'Segoe UI', Arial, sans-serif;
                color: #e4e4e4;
            }

            .display-header {
                position: relative;
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
                z-index: 1400;
                pointer-events: auto;
                border: 1px solid #333;
                min-width: 70px;
                text-align: center;
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

            .hud-main {
                color: #4CAF50;
                font-size: 11px;
                white-space: nowrap;
            }
            .hud-hands {
                color: #2196F3;
                font-size: 9px;
            }

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
                z-index: 1000000;
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

            .note-item-stats-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
                margin: 10px 0;
                padding: 10px;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 4px;
            }

            .stat-category {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }

            .stat-category-title {
                font-size: 10px;
                font-weight: bold;
                color: #93c5fd;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 4px;
            }

            .stat-row {
                display: flex;
                justify-content: space-between;
                font-size: 11px;
                padding: 2px 0;
            }

            .stat-label {
                color: #94a3b8;
            }

            .stat-value {
                color: #e4e4e4;
                font-weight: 600;
                font-family: 'Courier New', monospace;
            }

            .note-item-text-section {
                margin-top: 8px;
                padding-top: 8px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }

            .note-text-label {
                font-size: 10px;
                font-weight: bold;
                color: #93c5fd;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 6px;
            }

            .note-item-text {
                color: #e4e4e4;
                font-size: 12px;
                line-height: 1.5;
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
        /* Help Button */
            .display-help-btn {
                position: absolute;
                right: 50px;
                top: 50%;
                transform: translateY(-50%);
                background: #0f3460;
                border: 1px solid #e94560;
                color: #e94560;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
            }
            .display-help-btn:hover {
                background: #e94560;
                color: #1a1a2e;
                transform: translateY(-50%) scale(1.1);
            }

            /* Help Modal */
            .display-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.85);
                z-index: 1000000;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'Segoe UI', Arial, sans-serif;
            }
            .display-modal-content {
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border: 2px solid #0f3460;
                border-radius: 10px;
                width: 700px;
                max-width: 90vw;
                max-height: 85vh;
                display: flex;
                flex-direction: column;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.9);
            }
            .display-modal-header {
                position: relative;
                background: linear-gradient(135deg, #0f3460 0%, #1a1a2e 100%);
                padding: 15px 20px;
                border-bottom: 2px solid #e94560;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-radius: 8px 8px 0 0;
            }
            .display-modal-title {
                color: #e94560;
                font-weight: bold;
                font-size: 16px;
            }
            .display-modal-body {
                padding: 20px;
                overflow-y: auto;
                color: #e4e4e4;
                line-height: 1.6;
            }
            .display-modal-body h3 {
                color: #93c5fd;
                margin-top: 20px;
                margin-bottom: 10px;
                font-size: 15px;
                border-bottom: 1px solid #0f3460;
                padding-bottom: 5px;
            }
            .display-modal-body h3:first-child {
                margin-top: 0;
            }
            .display-modal-body p {
                margin: 8px 0;
                font-size: 13px;
                color: #d1d5db;
            }
            .display-modal-body strong {
                color: #e94560;
            }
            .display-modal-body em {
                color: #93c5fd;
                font-style: normal;
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
        console.log('Poker Stats Display v3.0 with Notes');
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

                // Auto-load stats on startup
                console.log('Auto-loading stats...');

// Delay stats load slightly to ensure DB and other scripts are ready
setTimeout(async () => {
    try {
        await loadStats();
        console.log('✅ Stats auto-loaded successfully');
        // Auto-enable HUD after stats fully load
        if (playerStats && Object.keys(playerStats).length > 0) {
            console.log('✅ Auto-enabling HUD...');
            toggleHUD();
        }
    } catch (error) {
        console.warn('Auto-load failed:', error);
    }
}, 2500); // ← increased delay to 2.5 seconds

            }
        }, 1000);
        setTimeout(() => clearInterval(checkForTable), 30000);
    }
// Listen for stats refresh trigger from Stats Calculator
    window.addEventListener('message', (event) => {
        if (event.data.type === 'COMMAND' &&
            event.data.target === 'PokerStatsDisplay' &&
            event.data.action === 'REFRESH_STATS') {

            console.log('🔄 Auto-refresh triggered by Stats Calculator');

            // Wait a moment for database to settle
            setTimeout(() => {
                loadStats();
            }, 500);
        }
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
// =====================================================
// Export all player notes to a downloadable JSON file
// =====================================================
async function exportPlayerNotes() {
    if (!db) {
        alert('Database not connected.');
        return;
    }

    const transaction = db.transaction(['playerNotes'], 'readonly');
    const store = transaction.objectStore('playerNotes');
    const request = store.getAll();

    request.onsuccess = () => {
        const notes = request.result;
        if (!notes || notes.length === 0) {
            alert('No player notes found.');
            return;
        }

        const blob = new Blob([JSON.stringify(notes, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `playerNotes_${new Date().toISOString().slice(0,19)}.json`;
        a.click();
        URL.revokeObjectURL(url);

        console.log(`✅ Exported ${notes.length} notes`);
    };

    request.onerror = () => {
        console.error('❌ Failed to export notes:', request.error);
        alert('Failed to export notes.');
    };
}
async function importPlayerNotes() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'application/json';
    fileInput.style.display = 'none';

    fileInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const text = await file.text();
            const imported = JSON.parse(text);
            if (typeof imported !== 'object') throw new Error('Invalid file format');

            db = await connectToDatabase();// use global db, not const
            const tx = db.transaction('playerNotes', 'readwrite');
            const store = tx.objectStore('playerNotes');

            let count = 0;
            if (typeof window.playerStats !== 'undefined') playerStats = window.playerStats;

for (const [playerName, data] of Object.entries(imported)) {
    await new Promise((resolve, reject) => {
        const record = {
    playerName,
    notes: data.notes || data.noteText || '', // <— accepts either format
    lastUpdated: Date.now()
};

        const req = store.put(record);
        req.onsuccess = () => {
            count++;
            resolve();
        };
        req.onerror = e => reject(e.target.error);
    });
}

console.log(`✅ Imported ${count} player notes`);
alert(`Imported ${count} player notes successfully!`);

// --- ✅ ADD THESE 5 LINES BELOW ---
// Merge imported notes into in-memory stats and refresh UI
for (const [playerName, data] of Object.entries(imported)) {
    if (playerStats[playerName]) {
        playerStats[playerName].notes = data.notes || '';
    }
}
updateNotesPanel();
console.log('✅ Merged imported notes into playerStats');
// --- ✅ END OF INSERT ---

} catch (err) {
    console.error('❌ Import failed:', err);
    alert('Import failed: ' + err.message);
}

});

document.body.appendChild(fileInput);
fileInput.click();
}
    const style = document.createElement("style");
style.textContent = `
  .notes-btn {
    background-color: #0078d7;   /* Torn blue tone */
    color: white;
    border: none;
    border-radius: 6px;
    padding: 6px 10px;
    margin-left: 6px;
    cursor: pointer;
    font-weight: bold;
  }
  .notes-btn:hover {
    background-color: #0a84ff;
  }
`;
document.head.appendChild(style);
    // ======================================================
//  🧩 Notes Helper Functions (Restored)
// ======================================================

async function loadAllNotes() {
  const db = await connectNotesDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("playerNotes", "readonly");
    const store = tx.objectStore("playerNotes");
    const req = store.getAll();
    req.onsuccess = () => {
      console.log(`📖 Loaded ${req.result.length} notes`);
      resolve(req.result);
    };
    req.onerror = e => reject(e.target.error);
  });
}

async function exportNotes() {
  const notes = await loadAllNotes();
  const blob = new Blob([JSON.stringify(notes, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `playerNotes-backup-${Date.now()}.json`;
  a.click();
  console.log(`⬇️ Exported ${notes.length} notes`);
}

async function importNotes(file) {
  if (!file) return;
  const text = await file.text();
  let imported;
  try {
    imported = JSON.parse(text);
    if (!Array.isArray(imported)) throw new Error("File must contain an array of note objects");
  } catch (e) {
    console.error("❌ Bad notes file:", e);
    alert("Invalid notes file.");
    return;
  }

  const db = await connectNotesDB();
  const tx = db.transaction("playerNotes", "readwrite");
  const store = tx.objectStore("playerNotes");
  for (const n of imported) {
    if (!n || !n.playerName) continue;
    store.put({
      playerName: n.playerName,
      noteText: n.noteText ?? "",
      lastUpdated: n.lastUpdated ?? Date.now(),
    });
  }
  tx.oncomplete = () => console.log(`✅ Imported ${imported.length} notes`);
  tx.onerror = e => console.error("❌ Import failed:", e.target.error);
}

    console.log("✅ Poker Stats Display + Notes integration ready");
    console.log("🧩 Poker Stats Display script reached the final line — functions loaded.");
// ======================================================
// 🩵 Re-expose Notes helpers globally (for console + HUD)
// ======================================================
if (typeof saveNote === "function")  window.saveNote = saveNote;
if (typeof loadAllNotes === "function")  window.loadAllNotes = loadAllNotes;
if (typeof exportNotes === "function")  window.exportNotes = exportNotes;
if (typeof importNotes === "function")  window.importNotes = importNotes;
if (typeof getNoteForPlayer === "function")  window.getNoteForPlayer = getNoteForPlayer;

console.log("🔗 Notes functions exposed globally");

})();




