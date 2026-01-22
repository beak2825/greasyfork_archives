// ==UserScript==
// @name         Torn Poker Notes
// @namespace    https://torn.com/
// @version      1.6
// @description  Track player reads at the poker table
// @author       systoned
// @license      MIT
// @match        *://www.torn.com/page.php?sid=holdem*
// @match        *://torn.com/page.php?sid=holdem*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563523/Torn%20Poker%20Notes.user.js
// @updateURL https://update.greasyfork.org/scripts/563523/Torn%20Poker%20Notes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'tornPokerNotes';
    const TAGS = ['Tight', 'Loose', 'Aggressive', 'Passive', 'Bluffer', 'Fish'];

    // Load notes from localStorage
    function loadNotes() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
        } catch (e) {
            return {};
        }
    }

    // Save notes to localStorage
    function saveNotes(notes) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    }

    // Get or create note for a player
    function getPlayerNote(playerId) {
        const notes = loadNotes();
        return notes[playerId] || { tags: [], text: '' };
    }

    // Save note for a player
    function savePlayerNote(playerId, note) {
        const notes = loadNotes();
        notes[playerId] = note;
        saveNotes(notes);
    }

    // Delete note for a player
    function deletePlayerNote(playerId, iconElement) {
        const notes = loadNotes();
        delete notes[playerId];
        saveNotes(notes);

        if (iconElement) {
            iconElement.classList.remove('has-notes');
        }
    }

    // Inject styles
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .poker-note-icon {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 16px;
                height: 16px;
                background: rgba(0, 0, 0, 0.5);
                border: 1px solid #666;
                border-radius: 3px;
                cursor: pointer;
                transition: background 0.2s;
            }
            .poker-note-icon-desktop {
                position: absolute;
                bottom: 2px;
                right: 2px;
                z-index: 100;
            }
            .poker-note-icon-pda {
                margin-right: 4px;
                vertical-align: middle;
            }
            .poker-note-icon:hover {
                background: rgba(50, 50, 50, 0.9);
            }
            .poker-note-icon.has-notes {
                background: rgba(0, 100, 0, 0.8);
                border-color: #0a0;
            }
            .poker-note-icon.has-notes svg {
                stroke: #fff;
            }
            .poker-note-panel {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #1a1a1a;
                border: 1px solid #444;
                border-radius: 8px;
                padding: 16px;
                z-index: 10000;
                min-width: 280px;
                max-width: 320px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
            }
            .poker-note-panel-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
                padding-bottom: 8px;
                border-bottom: 1px solid #333;
            }
            .poker-note-panel-title {
                color: #fff;
                font-size: 14px;
                font-weight: bold;
                margin: 0;
            }
            .poker-note-panel-close {
                background: none;
                border: none;
                color: #888;
                font-size: 18px;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }
            .poker-note-panel-close:hover {
                color: #fff;
            }
            .poker-note-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
                margin-bottom: 12px;
            }
            .poker-note-tag {
                padding: 4px 10px;
                background: #333;
                border: 1px solid #555;
                border-radius: 4px;
                color: #ccc;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s;
            }
            .poker-note-tag:hover {
                background: #444;
            }
            .poker-note-tag.active {
                background: #1a5a1a;
                border-color: #2a8a2a;
                color: #fff;
            }
            .poker-note-textarea {
                width: 100%;
                height: 80px;
                background: #222;
                border: 1px solid #444;
                border-radius: 4px;
                color: #fff;
                padding: 8px;
                font-size: 12px;
                resize: vertical;
                box-sizing: border-box;
            }
            .poker-note-textarea:focus {
                outline: none;
                border-color: #666;
            }
            .poker-note-textarea::placeholder {
                color: #666;
            }
            .poker-note-delete {
                width: 100%;
                margin-top: 10px;
                padding: 6px;
                background: #3a1a1a;
                border: 1px solid #622;
                border-radius: 4px;
                color: #c88;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s;
            }
            .poker-note-delete:hover {
                background: #4a1a1a;
                border-color: #933;
                color: #faa;
            }
            .poker-note-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 9999;
            }
        `;
        document.head.appendChild(style);
    }

    // Create note icon for a player
    function createNoteIcon(playerId, playerName) {
        const icon = document.createElement('div');
        icon.className = 'poker-note-icon';
        icon.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>';
        icon.title = 'Player notes';

        const note = getPlayerNote(playerId);
        if (note.tags.length > 0 || note.text.trim()) {
            icon.classList.add('has-notes');
        }

        icon.addEventListener('click', (e) => {
            e.stopPropagation();
            openNotePanel(playerId, playerName, icon);
        });

        return icon;
    }

    // Open note panel for a player
    function openNotePanel(playerId, playerName, iconElement) {
        // Remove any existing panel
        closeNotePanel();

        const note = getPlayerNote(playerId);

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'poker-note-overlay';
        overlay.addEventListener('click', closeNotePanel);

        // Create panel
        const panel = document.createElement('div');
        panel.className = 'poker-note-panel';
        panel.id = 'poker-note-panel';

        // Header
        const header = document.createElement('div');
        header.className = 'poker-note-panel-header';

        const title = document.createElement('h3');
        title.className = 'poker-note-panel-title';
        title.textContent = playerName || `Player ${playerId}`;

        const closeBtn = document.createElement('button');
        closeBtn.className = 'poker-note-panel-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', closeNotePanel);

        header.appendChild(title);
        header.appendChild(closeBtn);

        // Tags
        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'poker-note-tags';

        TAGS.forEach(tag => {
            const tagEl = document.createElement('button');
            tagEl.className = 'poker-note-tag';
            if (note.tags.includes(tag)) {
                tagEl.classList.add('active');
            }
            tagEl.textContent = tag;
            tagEl.addEventListener('click', () => {
                tagEl.classList.toggle('active');
                saveCurrentNote(playerId, iconElement);
            });
            tagsContainer.appendChild(tagEl);
        });

        // Textarea
        const textarea = document.createElement('textarea');
        textarea.className = 'poker-note-textarea';
        textarea.placeholder = 'Additional notes...';
        textarea.value = note.text;
        textarea.addEventListener('input', () => {
            saveCurrentNote(playerId, iconElement);
        });

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'poker-note-delete';
        deleteBtn.textContent = 'Delete Note';
        deleteBtn.addEventListener('click', () => {
            deletePlayerNote(playerId, iconElement);
            closeNotePanel();
        });

        // Assemble panel
        panel.appendChild(header);
        panel.appendChild(tagsContainer);
        panel.appendChild(textarea);
        panel.appendChild(deleteBtn);

        // Add to DOM
        document.body.appendChild(overlay);
        document.body.appendChild(panel);

        // Focus textarea
        textarea.focus();
    }

    // Save current note from panel
    function saveCurrentNote(playerId, iconElement) {
        const panel = document.getElementById('poker-note-panel');
        if (!panel) return;

        const activeTags = Array.from(panel.querySelectorAll('.poker-note-tag.active'))
            .map(el => el.textContent);
        const text = panel.querySelector('.poker-note-textarea').value;

        savePlayerNote(playerId, { tags: activeTags, text: text });

        // Update icon appearance
        if (iconElement) {
            if (activeTags.length > 0 || text.trim()) {
                iconElement.classList.add('has-notes');
            } else {
                iconElement.classList.remove('has-notes');
            }
        }
    }

    // Close note panel
    function closeNotePanel() {
        const overlay = document.querySelector('.poker-note-overlay');
        const panel = document.getElementById('poker-note-panel');
        if (overlay) overlay.remove();
        if (panel) panel.remove();
    }

    // Add note icons to all players at the table
    function addNoteIcons() {
        const players = document.querySelectorAll('[id^="player-"]');

        players.forEach(player => {
            const playerId = player.id.replace('player-', '');
            const nameEl = player.querySelector('[class^="name___"]');
            const playerName = nameEl ? nameEl.textContent : null;

            // Desktop has detailsBox, PDA doesn't
            const detailsBox = player.querySelector('[class^="detailsBox___"]');

            if (detailsBox) {
                // Desktop: absolute position in detailsBox
                if (!detailsBox.querySelector('.poker-note-icon')) {
                    const computedStyle = window.getComputedStyle(detailsBox);
                    if (computedStyle.position === 'static') {
                        detailsBox.style.position = 'relative';
                    }

                    const icon = createNoteIcon(playerId, playerName);
                    icon.classList.add('poker-note-icon-desktop');
                    detailsBox.appendChild(icon);
                }
            } else if (nameEl) {
                // PDA: inline before name
                if (!nameEl.querySelector('.poker-note-icon')) {
                    const icon = createNoteIcon(playerId, playerName);
                    icon.classList.add('poker-note-icon-pda');
                    nameEl.insertBefore(icon, nameEl.firstChild);
                }
            }
        });
    }

    // Initialize
    function init() {
        injectStyles();
        addNoteIcons();

        // Watch for DOM changes (players joining/leaving)
        const observer = new MutationObserver(() => {
            addNoteIcons();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Wait for page to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();