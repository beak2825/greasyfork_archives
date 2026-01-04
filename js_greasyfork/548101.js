// ==UserScript==
// @name         Torn Poker - Individual Player Notes & Networth
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Individual player networth links and comprehensive note-taking system
// @author       You
// @match        https://www.torn.com/page.php?sid=holdem*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548101/Torn%20Poker%20-%20Individual%20Player%20Notes%20%20Networth.user.js
// @updateURL https://update.greasyfork.org/scripts/548101/Torn%20Poker%20-%20Individual%20Player%20Notes%20%20Networth.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Data storage (persistent across sessions)
    let playerNotes = {};
    let currentNotesPlayer = null;

    // Storage key for localStorage
    const STORAGE_KEY = 'torn_poker_player_notes';

    // Load notes from localStorage
    function loadNotesFromStorage() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                playerNotes = JSON.parse(stored);
                console.log('Loaded player notes from storage:', Object.keys(playerNotes).length, 'players');
            }
        } catch (e) {
            console.error('Error loading notes from storage:', e);
            playerNotes = {};
        }
    }

    // Save notes to localStorage
    function saveNotesToStorage() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(playerNotes));
            console.log('Saved player notes to storage:', Object.keys(playerNotes).length, 'players');
        } catch (e) {
            console.error('Error saving notes to storage:', e);
        }
    }

    // Player traits definitions
    const playerTraits = {
        'T': 'Tight',
        'L': 'Loose',
        'A': 'Aggressive',
        'P': 'Passive',
        'M': 'Maniac',
        'B': 'Bluffer',
        'D': 'Deceptive',
        'S-P': 'Slow-plays',
        'Ch': 'Chases',
        'C-S': 'Calling-station'
    };

    // Add styles
    GM_addStyle(`
        .player-networth-link {
            position: absolute !important;
            top: -25px !important;
            left: 40% !important;
            transform: translateX(-50%) !important;
            background: linear-gradient(135deg, #4a90e2, #357abd) !important;
            color: white !important;
            padding: 2px 6px !important;
            border-radius: 3px !important;
            font-size: 10px !important;
            text-decoration: none !important;
            z-index: 1000 !important;
            cursor: pointer !important;
            border: 1px solid #2e5a8a !important;
            box-shadow: 0 1px 3px rgba(0,0,0,0.3) !important;
        }

        .player-networth-link:hover {
            background: linear-gradient(135deg, #5aa0f2, #4080cd) !important;
            transform: translateX(-50%) translateY(-1px) !important;
        }

        .player-notes-btn {
            position: absolute !important;
            top: -25px !important;
            left: calc(40% + 30px + 4px) !important;
            background: linear-gradient(135deg, #28a745, #20823d) !important;
            color: white !important;
            padding: 2px 4px !important;
            border-radius: 3px !important;
            font-size: 10px !important;
            cursor: pointer !important;
            border: 1px solid #1e6b32 !important;
            box-shadow: 0 1px 3px rgba(0,0,0,0.3) !important;
            z-index: 1000 !important;
        }

        .player-notes-btn:hover {
            background: linear-gradient(135deg, #38b755, #30934d) !important;
            transform: translateY(-1px) !important;
        }

        .player-notes-btn.has-notes {
            background: linear-gradient(135deg, #ffc107, #e0a800) !important;
            border-color: #d39e00 !important;
        }

        .player-traits-hud {
            position: absolute !important;
            top: -10px !important;
            left: 35% !important;
            transform: translateX(-50%) !important;
            background: rgba(0,0,0,0.85) !important;
            color: #fff !important;
            padding: 3px 6px !important;
            border-radius: 4px !important;
            font-size: 9px !important;
            font-weight: bold !important;
            border: 1px solid #555 !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.4) !important;
            z-index: 999 !important;
            white-space: nowrap !important;
            max-width: 120px !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            cursor: pointer !important;
            min-width: 20px !important;
            min-height: 16px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
        }

        .player-traits-hud:hover {
            background: rgba(0,0,0,0.95) !important;
            border-color: #777 !important;
        }

        .player-traits-hud .notes-placeholder {
            font-size: 8px !important;
            opacity: 0.7 !important;
        }

        .player-traits-hud .trait-tag {
            background: #4a90e2 !important;
            color: white !important;
            padding: 1px 3px !important;
            border-radius: 2px !important;
            font-size: 8px !important;
            margin-right: 2px !important;
            display: inline-block !important;
        }

        .player-traits-hud .trait-tag.tight { background: #28a745 !important; }
        .player-traits-hud .trait-tag.loose { background: #dc3545 !important; }
        .player-traits-hud .trait-tag.aggressive { background: #fd7e14 !important; }
        .player-traits-hud .trait-tag.passive { background: #6f42c1 !important; }
        .player-traits-hud .trait-tag.maniac { background: #e83e8c !important; }
        .player-traits-hud .trait-tag.bluffer { background: #20c997 !important; }
        .player-traits-hud .trait-tag.deceptive { background: #6c757d !important; }
        .player-traits-hud .trait-tag.slowplay { background: #17a2b8 !important; }
        .player-traits-hud .trait-tag.chases { background: #ffc107 !important; color: #000 !important; }
        .player-traits-hud .trait-tag.calling { background: #f8f9fa !important; color: #000 !important; }

        .player-container {
            position: relative !important;
        }

        .notes-modal {
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            background: #2d2d2d !important;
            border: 2px solid #555 !important;
            border-radius: 8px !important;
            padding: 20px !important;
            z-index: 10000 !important;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5) !important;
            width: 500px !important;
            max-height: 80vh !important;
            overflow-y: auto !important;
            font-family: Arial, sans-serif !important;
        }

        .notes-overlay {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: rgba(0,0,0,0.7) !important;
            z-index: 9999 !important;
        }

        .notes-header {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            margin-bottom: 15px !important;
            border-bottom: 1px solid #555 !important;
            padding-bottom: 10px !important;
        }

        .notes-title {
            color: #fff !important;
            font-size: 16px !important;
            font-weight: bold !important;
            margin: 0 !important;
        }

        .notes-close {
            background: #666 !important;
            color: #fff !important;
            border: none !important;
            border-radius: 3px !important;
            padding: 5px 10px !important;
            cursor: pointer !important;
            font-size: 14px !important;
        }

        .notes-close:hover {
            background: #777 !important;
        }

        .notes-section {
            margin-bottom: 20px !important;
        }

        .notes-section-title {
            color: #4a90e2 !important;
            font-size: 14px !important;
            font-weight: bold !important;
            margin-bottom: 8px !important;
            display: block !important;
        }

        .traits-grid {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 6px !important;
            margin-bottom: 10px !important;
        }

        .trait-checkbox {
            display: flex !important;
            align-items: center !important;
            gap: 4px !important;
        }

        .trait-checkbox input {
            margin: 0 !important;
        }

        .trait-checkbox label {
            color: #ccc !important;
            font-size: 11px !important;
            cursor: pointer !important;
            user-select: none !important;
        }

        .custom-traits-input {
            width: 100% !important;
            background: #1a1a1a !important;
            color: #fff !important;
            border: 1px solid #555 !important;
            border-radius: 3px !important;
            padding: 6px !important;
            font-size: 12px !important;
            margin-top: 8px !important;
        }

        .preflop-notes {
            width: 100% !important;
            height: 80px !important;
            background: #1a1a1a !important;
            color: #fff !important;
            border: 1px solid #555 !important;
            border-radius: 3px !important;
            padding: 8px !important;
            font-size: 12px !important;
            resize: vertical !important;
            font-family: monospace !important;
        }

        .notes-actions {
            display: flex !important;
            gap: 10px !important;
            justify-content: flex-end !important;
            margin-top: 15px !important;
            border-top: 1px solid #555 !important;
            padding-top: 15px !important;
        }

        .notes-btn {
            background: linear-gradient(to bottom, #4a90e2, #357abd) !important;
            color: #fff !important;
            border: 1px solid #2e5a8a !important;
            border-radius: 4px !important;
            padding: 6px 12px !important;
            cursor: pointer !important;
            font-size: 12px !important;
            transition: all 0.2s ease !important;
        }

        .notes-btn:hover {
            background: linear-gradient(to bottom, #5aa0f2, #4080cd) !important;
        }

        .notes-btn.clear {
            background: linear-gradient(to bottom, #dc3545, #c82333) !important;
            border-color: #bd2130 !important;
        }

        .notes-btn.clear:hover {
            background: linear-gradient(to bottom, #e24555, #d23343) !important;
        }

        .notes-help {
            color: #999 !important;
            font-size: 10px !important;
            margin-top: 4px !important;
            font-style: italic !important;
        }
    `);

    // Initialize the script
    function init() {
        // Load existing notes first
        loadNotesFromStorage();

        // Wait a bit for the poker interface to load
        setTimeout(() => {
            addPlayerButtons();
            setupObserver();
        }, 1000);
    }

    // Find and add buttons to all players
    function addPlayerButtons() {
        const playerElements = document.querySelectorAll("[id^='player-']");

        playerElements.forEach(playerEl => {
            const match = playerEl.id.match(/^player-(\d+)/);
            if (!match) return;

            const playerId = match[1];

            // Skip if HUD already exists
            if (playerEl.querySelector('.player-traits-hud')) return;

            // Make player container relative positioned
            playerEl.style.position = 'relative';
            playerEl.classList.add('player-container');

            // Create traits HUD (always present)
            const traitsHud = document.createElement('div');
            traitsHud.className = 'player-traits-hud';
            traitsHud.id = `traits-hud-${playerId}`;

            // Add click events for split functionality
            traitsHud.addEventListener('click', (e) => {
                e.preventDefault();
                openPlayerNetworth(playerId);
            });

            traitsHud.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                openNotesModal(playerId);
            });

            // Add to player element
            playerEl.appendChild(traitsHud);

            // Update HUD content
            updateTraitsHUD(playerId);
        });
    }

    // Open individual player networth
    function openPlayerNetworth(playerId) {
        const url = `https://www.torn.com/personalstats.php?ID=${playerId}&stats=useractivity&from=1%20month`;
        window.open(url, '_blank');

        // Show brief instruction
        setTimeout(() => {
            // Could add a small toast notification here instead of alert
            console.log(`Opened networth for player ${playerId} - click Networth tab`);
        }, 500);
    }

    // Check if player has any notes
    function hasPlayerNotes(playerId) {
        const notes = playerNotes[playerId];
        if (!notes) return false;

        return (notes.traits && notes.traits.length > 0) ||
               (notes.customTraits && notes.customTraits.trim()) ||
               (notes.preflop && notes.preflop.trim());
    }

    // Open notes modal
    function openNotesModal(playerId) {
        currentNotesPlayer = playerId;

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'notes-overlay';
        overlay.addEventListener('click', closeNotesModal);

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'notes-modal';

        // Modal content
        modal.innerHTML = `
            <div class="notes-header">
                <h3 class="notes-title">Player ${playerId} Notes</h3>
                <button class="notes-close">×</button>
            </div>

            <div class="notes-section">
                <label class="notes-section-title">Playing Traits:</label>
                <div class="traits-grid">
                    ${Object.entries(playerTraits).map(([code, name]) => `
                        <div class="trait-checkbox">
                            <input type="checkbox" id="trait-${code}" value="${code}">
                            <label for="trait-${code}">${code} - ${name}</label>
                        </div>
                    `).join('')}
                </div>
                <input type="text" class="custom-traits-input" id="custom-traits" placeholder="Additional traits (comma separated)">
                <div class="notes-help">Select common traits or add custom ones</div>
            </div>

            <div class="notes-section">
                <label class="notes-section-title" for="preflop-notes">Preflop Hand Selection:</label>
                <textarea class="preflop-notes" id="preflop-notes" placeholder="Examples:&#10;K-J/early, 10-9 suited/middle&#10;A-3/late, pocket pairs/any position&#10;Limps with: A-x suited, connectors"></textarea>
                <div class="notes-help">Note starting hands played and positions</div>
            </div>

            <div class="notes-actions">
                <button class="notes-btn clear" id="clear-notes">Clear All</button>
                <button class="notes-btn" id="save-notes">Save Notes</button>
            </div>
        `;

        // Add event listeners
        modal.querySelector('.notes-close').addEventListener('click', closeNotesModal);
        modal.querySelector('#save-notes').addEventListener('click', savePlayerNotes);
        modal.querySelector('#clear-notes').addEventListener('click', clearPlayerNotes);

        // Load existing notes
        loadPlayerNotes(playerId, modal);

        // Add to page
        document.body.appendChild(overlay);
        document.body.appendChild(modal);
    }

    // Load existing notes into modal
    function loadPlayerNotes(playerId, modal) {
        const notes = playerNotes[playerId];
        if (!notes) return;

        // Load traits
        if (notes.traits) {
            notes.traits.forEach(trait => {
                const checkbox = modal.querySelector(`#trait-${trait}`);
                if (checkbox) checkbox.checked = true;
            });
        }

        // Load custom traits
        if (notes.customTraits) {
            modal.querySelector('#custom-traits').value = notes.customTraits;
        }

        // Load preflop notes
        if (notes.preflop) {
            modal.querySelector('#preflop-notes').value = notes.preflop;
        }
    }

    // Save player notes
    function savePlayerNotes() {
        const modal = document.querySelector('.notes-modal');
        if (!modal || !currentNotesPlayer) return;

        // Collect traits
        const selectedTraits = [];
        modal.querySelectorAll('.trait-checkbox input:checked').forEach(cb => {
            selectedTraits.push(cb.value);
        });

        // Collect custom traits
        const customTraits = modal.querySelector('#custom-traits').value.trim();

        // Collect preflop notes
        const preflopNotes = modal.querySelector('#preflop-notes').value.trim();

        // Save to localStorage
        playerNotes[currentNotesPlayer] = {
            traits: selectedTraits,
            customTraits: customTraits,
            preflop: preflopNotes,
            lastUpdated: new Date().toISOString()
        };

        // Persist to storage
        saveNotesToStorage();

        // Update notes button appearance
        updateNotesButton(currentNotesPlayer);

        // Close modal
        closeNotesModal();

        // Show confirmation
        console.log(`Notes saved for player ${currentNotesPlayer}`);
    }

    // Clear player notes
    function clearPlayerNotes() {
        if (!currentNotesPlayer) return;

        if (confirm('Clear all notes for this player?')) {
            delete playerNotes[currentNotesPlayer];
            saveNotesToStorage(); // Persist the deletion
            updateNotesButton(currentNotesPlayer);
            closeNotesModal();
        }
    }

    // Update traits HUD display
    function updateTraitsHUD(playerId) {
        const hudElement = document.querySelector(`#traits-hud-${playerId}`);
        if (!hudElement) return;

        const notes = playerNotes[playerId];

        if (notes && notes.traits && notes.traits.length > 0) {
            // Show trait tags for players with notes
            const traitTagsHTML = notes.traits.map(trait => {
                const cssClass = getTraitCSSClass(trait);
                return `<span class="trait-tag ${cssClass}">${trait}</span>`;
            }).join('');

            hudElement.innerHTML = traitTagsHTML;
            hudElement.title = `Left-click: Networth | Right-click: Notes\nTraits: ${notes.traits.map(trait => playerTraits[trait] || trait).join(', ')}`;
        } else {
            // Show notes placeholder for players without notes
            hudElement.innerHTML = '<span class="notes-placeholder">📝</span>';
            hudElement.title = 'Left-click: Networth | Right-click: Add Notes';
        }

        hudElement.style.display = 'flex';
    }

    // Get CSS class for trait color coding
    function getTraitCSSClass(trait) {
        const traitMap = {
            'T': 'tight',
            'L': 'loose',
            'A': 'aggressive',
            'P': 'passive',
            'M': 'maniac',
            'B': 'bluffer',
            'D': 'deceptive',
            'S-P': 'slowplay',
            'Ch': 'chases',
            'C-S': 'calling'
        };
        return traitMap[trait] || 'default';
    }

    // Update notes button appearance
    function updateNotesButton(playerId) {
        const playerEl = document.querySelector(`#player-${playerId}`);
        if (!playerEl) return;

        const notesBtn = playerEl.querySelector('.player-notes-btn');
        if (!notesBtn) return;

        if (hasPlayerNotes(playerId)) {
            notesBtn.classList.add('has-notes');
        } else {
            notesBtn.classList.remove('has-notes');
        }

        // Update the traits HUD
        updateTraitsHUD(playerId);
    }

    // Close notes modal
    function closeNotesModal() {
        const overlay = document.querySelector('.notes-overlay');
        const modal = document.querySelector('.notes-modal');

        if (overlay) overlay.remove();
        if (modal) modal.remove();

        currentNotesPlayer = null;
    }

    // Setup observer to watch for new players
    function setupObserver() {
        const observer = new MutationObserver((mutations) => {
            let shouldUpdate = false;

            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1 && (
                            node.id && node.id.startsWith('player-') ||
                            node.querySelector && node.querySelector("[id^='player-']")
                        )) {
                            shouldUpdate = true;
                        }
                    });
                }
            });

            if (shouldUpdate) {
                setTimeout(addPlayerButtons, 500);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Initialize when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Keyboard shortcut to close modal (Escape)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.querySelector('.notes-modal')) {
            closeNotesModal();
        }
    });
})();