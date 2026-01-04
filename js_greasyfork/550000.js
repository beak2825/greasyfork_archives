// ==UserScript==
// @name         Chessable Enhancements - Notes & Favorites
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add personal notes and favorite markers to Chessable moves. Features note-taking, favorites, and backup/restore functionality.
// @author       Dhgf Lu
// @match        https://www.chessable.com/*
// @match        https://chessable.com/*
// @license      MIT
// @grant        none
// @homepageURL  https://github.com/DhgfLu/Chessable-enhancements
// @downloadURL https://update.greasyfork.org/scripts/550000/Chessable%20Enhancements%20-%20Notes%20%20Favorites.user.js
// @updateURL https://update.greasyfork.org/scripts/550000/Chessable%20Enhancements%20-%20Notes%20%20Favorites.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('%c[Chessable Enhancements] Script loaded!', 'color: green; font-weight: bold');

    function checkFirstTimeUser() {
        const hasUsedBefore = localStorage.getItem('chessable_notes_initialized');
        if (!hasUsedBefore) {
            // Create a simple notification
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                z-index: 10000;
                max-width: 300px;
                animation: slideUp 0.3s ease-out;
            `;

            notification.innerHTML = `
                <strong style="font-size: 16px;">✨ Chessable Notes Installed!</strong>
                <div style="margin-top: 10px; font-size: 14px; line-height: 1.4;">
                    📝 Add notes to moves<br>
                    ❤️ Mark favorite variations<br>
                    💾 Right-click notes button to backup<br>
                </div>
                <button id="close-notification" style="
                    margin-top: 10px;
                    padding: 5px 15px;
                    background: rgba(255,255,255,0.2);
                    border: 1px solid white;
                    color: white;
                    border-radius: 4px;
                    cursor: pointer;
                ">Got it!</button>
            `;

            document.body.appendChild(notification);

            // Add animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `;
            document.head.appendChild(style);

            // Close button
            document.getElementById('close-notification').onclick = () => {
                notification.remove();
            };

            // Auto-remove after 10 seconds
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 10000);

            localStorage.setItem('chessable_notes_initialized', 'true');
        }
    }

    // Call after page loads
    setTimeout(checkFirstTimeUser, 2000);


    let currentMode = null;
    let notesPanelVisible = false;
    let lastSeenMove = null;
    let lastChapterTitle = null;

    function sanitizeForId(text) {
        return text.replace(/[.\s]+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '');
    }

    function getCurrentMoveId() {
        const currentMove = document.querySelector('[data-testid="commentMove_shownOnBoard"]');
        if (!currentMove) return null;

        const chapterTitle = document.querySelector('[data-testid="commentVariationName"]')?.textContent ||
                            document.querySelector('h1')?.textContent ||
                            'unknown';
        const moveText = currentMove.textContent.trim();

        return sanitizeForId(`${chapterTitle}_${moveText}`);
    }

    function getMoveId(moveElement) {
        const chapterTitle = document.querySelector('[data-testid="commentVariationName"]')?.textContent ||
                            document.querySelector('h1')?.textContent ||
                            'unknown';
        const moveText = moveElement.textContent.trim();

        return sanitizeForId(`${chapterTitle}_${moveText}`);
    }

    function injectNoteForMove(moveElement, noteText) {
        // Remove any existing note container that follows this move
        let nextElement = moveElement.nextSibling;
        while (nextElement && nextElement.classList && nextElement.classList.contains('my-note-container')) {
            const temp = nextElement.nextSibling;
            nextElement.remove();
            nextElement = temp;
        }

        // Create our own container div
        const noteContainer = document.createElement('div');
        noteContainer.className = 'my-note-container';
        noteContainer.style.cssText = `
            margin-top: 10px;
            margin-bottom: 10px;
            background-color: rgb(227, 242, 253);
            padding: 10px;
            border-left: 4px solid rgb(33, 150, 243);
            border-radius: 4px;
            font-size: 14px;
            line-height: 1.5;
            color: rgb(13, 71, 161);
        `;

        noteContainer.innerHTML = `
            <strong style="color: #1976D2;">📝 My note:</strong> ${noteText}
        `;

        // Insert our container right after the move element
        if (moveElement.parentElement) {
            moveElement.parentElement.insertBefore(noteContainer, moveElement.nextSibling);
        }
    }

    function displayAllNotes() {
        // Remove all existing notes first to avoid duplicates
        document.querySelectorAll('.my-note-container').forEach(note => note.remove());

        // Find all moves
        const allMoves = document.querySelectorAll('[data-testid="commentMove"], [data-testid="commentMove_shownOnBoard"]');

        let notesFound = 0;
        allMoves.forEach(moveElement => {
            const moveId = getMoveId(moveElement);
            const key = `chessable_note_${moveId}`;
            const savedNote = localStorage.getItem(key);

            if (savedNote) {
                notesFound++;
                injectNoteForMove(moveElement, savedNote);
            }
        });

        if (notesFound > 0) {
            console.log(`[Chessable Notes] Displayed ${notesFound} notes`);
        }
    }

    function tryLoadNotesWithRetry() {
        let attempts = 0;
        const maxAttempts = 12; // 3 seconds total (12 * 250ms)

        const tryLoad = setInterval(() => {
            attempts++;
            const moves = document.querySelectorAll('[data-testid="commentMove"], [data-testid="commentMove_shownOnBoard"]');

            if (moves.length > 0) {
                console.log(`[Chessable Notes] Moves found, loading notes`);
                displayAllNotes();
                clearInterval(tryLoad);
            } else if (attempts >= maxAttempts) {
                console.log('[Chessable Notes] No moves found after 3 seconds');
                clearInterval(tryLoad);
            }
        }, 250);
    }

    function checkForChapterChange() {
        const chapterElement = document.querySelector('[data-testid="commentVariationName"]');
        const chapterTitle = chapterElement?.textContent?.trim();

        if (chapterTitle && chapterTitle !== lastChapterTitle) {
            console.log(`[Chessable Notes] Chapter changed to: "${chapterTitle}"`);
            lastChapterTitle = chapterTitle;

            updateFavoriteButton();

            if (currentMode === 'REVIEW') {
                tryLoadNotesWithRetry();
            }
        }
    }

    function checkForMoveChange() {
        const currentMove = document.querySelector('[data-testid="commentMove_shownOnBoard"]');
        const currentMoveText = currentMove ? currentMove.textContent.trim() : null;

        if (currentMoveText !== lastSeenMove) {
            lastSeenMove = currentMoveText;
            if (currentMoveText) {
                setTimeout(displayAllNotes, 100);
            }
        }
    }

    function saveNote() {
        const noteText = document.getElementById('note-textarea').value.trim();
        const moveId = getCurrentMoveId();

        if (!moveId) {
            console.error('Could not identify current move');
            return;
        }

        const key = `chessable_note_${moveId}`;

        if (noteText) {
            localStorage.setItem(key, noteText);
            console.log(`✅ Saved note for ${moveId}`);
        } else {
            localStorage.removeItem(key);
            console.log(`🗑️ Deleted note for ${moveId}`);
        }

        document.getElementById('note-textarea').value = '';
        toggleNotesPanel(false);

        setTimeout(displayAllNotes, 100);
    }

    function checkMode() {
        const quizElement = document.querySelector('.instructions-quiz');
        const newMode = quizElement ? 'QUIZ' : 'REVIEW';

        if (newMode !== currentMode) {
            currentMode = newMode;
            console.log(`%c[Chessable Notes] Mode: ${currentMode}`,
                       `color: ${currentMode === 'QUIZ' ? 'orange' : 'blue'}; font-weight: bold`);

            if (currentMode === 'REVIEW') {
                createNotesPanel();
                // Try loading notes for up to 3 seconds
                tryLoadNotesWithRetry();
            }
        }
    }

    function createNotesPanel() {
        if (document.getElementById('notes-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'notes-panel';
        panel.style.cssText = `
            position: fixed;
            bottom: 70px;
            right: 20px;
            width: 300px;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            display: none;
            z-index: 1000;
        `;

        panel.innerHTML = `
            <h4 style="margin: 0 0 10px 0;">Add Note for Current Move</h4>
            <textarea id="note-textarea" style="width: 100%; height: 100px; padding: 5px; border: 1px solid #ddd; border-radius: 4px;" placeholder="Type your note here..."></textarea>
            <div style="margin-top: 10px;">
                <button id="save-note" style="padding: 5px 15px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Save</button>
                <button id="delete-note" style="padding: 5px 15px; margin-left: 5px; background: #ff6b6b; color: white; border: none; border-radius: 4px; cursor: pointer;">Delete</button>
                <button id="cancel-note" style="padding: 5px 15px; margin-left: 5px; background: #666; color: white; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>
            </div>
            <div style="margin-top: 10px; font-size: 12px; color: #666;">
                Tip: Click "Delete" or save empty text to remove a note
            </div>
        `;

        document.body.appendChild(panel);

        // Stop keyboard events from bubbling
        const textarea = document.getElementById('note-textarea');
        textarea.addEventListener('keydown', (e) => e.stopPropagation());
        textarea.addEventListener('keyup', (e) => e.stopPropagation());
        textarea.addEventListener('keypress', (e) => e.stopPropagation());

        document.getElementById('save-note').onclick = saveNote;
        document.getElementById('delete-note').onclick = () => {
            document.getElementById('note-textarea').value = '';
            saveNote();
        };
        document.getElementById('cancel-note').onclick = () => toggleNotesPanel(false);
    }

    function toggleNotesPanel(show) {
        const panel = document.getElementById('notes-panel');
        if (panel) {
            notesPanelVisible = show;
            panel.style.display = show ? 'block' : 'none';
            if (show) {
                const currentMove = document.querySelector('[data-testid="commentMove_shownOnBoard"]');
                const moveDisplay = currentMove ? currentMove.textContent.trim() : 'Current Move';
                panel.querySelector('h4').textContent = `Note for: ${moveDisplay}`;

                const moveId = getCurrentMoveId();
                if (moveId) {
                    const key = `chessable_note_${moveId}`;
                    const existingNote = localStorage.getItem(key);
                    document.getElementById('note-textarea').value = existingNote || '';
                }

                document.getElementById('note-textarea').focus();
            }
        }
    }

    // Update the addNotesButton function to include right-click handler:
    function addNotesButton() {
        const iconBar = document.querySelector('.practice-icon-bar');

        if (iconBar && !document.getElementById('notes-button')) {
            const notesBtn = document.createElement('button');
            notesBtn.id = 'notes-button';
            notesBtn.innerHTML = '📝';
            notesBtn.style.cssText = `
            margin-left: 10px;
            padding: 6px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.3s ease;
            box-shadow: 0 2px 6px rgba(102, 126, 234, 0.3);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 32px;
            height: 32px;
            position: relative;
            overflow: hidden;
        `;
            notesBtn.title = 'Add/Edit Notes (Right-click for backup options)';

            // Add hover effect
            notesBtn.onmouseover = () => {
                notesBtn.style.transform = 'translateY(-2px)';
                notesBtn.style.boxShadow = '0 4px 10px rgba(102, 126, 234, 0.5)';
            };

            notesBtn.onmouseout = () => {
                notesBtn.style.transform = 'translateY(0)';
                notesBtn.style.boxShadow = '0 2px 6px rgba(102, 126, 234, 0.3)';
            };

            // Add active effect
            notesBtn.onmousedown = () => {
                notesBtn.style.transform = 'scale(0.95)';
            };

            notesBtn.onmouseup = () => {
                notesBtn.style.transform = 'translateY(-2px)';
            };

            notesBtn.onclick = () => toggleNotesPanel(!notesPanelVisible);

            // Right-click for backup menu
            notesBtn.oncontextmenu = (e) => {
                e.preventDefault();
                showBackupMenu(e);
            };

            iconBar.appendChild(notesBtn);
        }
    }

    // Add these new functions for backup:
    function showBackupMenu(e) {
        // Remove any existing menu
        const existingMenu = document.getElementById('backup-menu');
        if (existingMenu) existingMenu.remove();

        const menu = document.createElement('div');
        menu.id = 'backup-menu';
        menu.style.cssText = `
        position: fixed;
        top: ${e.clientY}px;
        left: ${e.clientX - 100}px;
        background: white;
        border: 1px solid #ddd;
        border-radius: 4px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        z-index: 10001;
        padding: 5px 0;
    `;

        menu.innerHTML = `
        <div id="export-option" style="padding: 8px 15px; cursor: pointer; hover: background: #f0f0f0;">
            📤 Export Notes
        </div>
        <div id="import-option" style="padding: 8px 15px; cursor: pointer; hover: background: #f0f0f0;">
            📥 Import Notes
        </div>
        <input type="file" id="import-file" accept=".json" style="display: none;">
    `;

        document.body.appendChild(menu);

        // Add hover effect
        const options = menu.querySelectorAll('div[id$="-option"]');
        options.forEach(opt => {
            opt.onmouseover = () => opt.style.backgroundColor = '#f0f0f0';
            opt.onmouseout = () => opt.style.backgroundColor = 'white';
        });

        // Add click handlers
        document.getElementById('export-option').onclick = () => {
            exportNotes();
            menu.remove();
        };

        document.getElementById('import-option').onclick = () => {
            document.getElementById('import-file').click();
            menu.remove();
        };

        document.getElementById('import-file').onchange = (e) => {
            importNotes(e);
        };

        // Close menu when clicking outside
        setTimeout(() => {
            document.addEventListener('click', function closeMenu() {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }, { once: true });
        }, 10);
    }

    function exportNotes() {
        const allData = {};
        const keys = Object.keys(localStorage);
        let noteCount = 0;
        let favoriteCount = 0;

        keys.forEach(key => {
            if (key.startsWith('chessable_note_')) {
                allData[key] = localStorage.getItem(key);
                noteCount++;
            } else if (key.startsWith('chessable_favorite_')) {
                allData[key] = localStorage.getItem(key);
                favoriteCount++;
            }
        });

        if (noteCount === 0 && favoriteCount === 0) {
            alert('No notes or favorites to export');
            return;
        }

        const dataStr = JSON.stringify(allData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});

        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `chessable_notes_favorites_${new Date().toISOString().split('T')[0]}.json`;
        link.click();

        console.log(`✅ Exported ${noteCount} notes and ${favoriteCount} favorites`);
        alert(`Exported ${noteCount} notes and ${favoriteCount} favorites successfully!`);
    }

    function importNotes(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const data = JSON.parse(event.target.result);
                let importedNotes = 0;
                let importedFavorites = 0;

                for (const [key, value] of Object.entries(data)) {
                    if (key.startsWith('chessable_note_')) {
                        localStorage.setItem(key, value);
                        importedNotes++;
                    } else if (key.startsWith('chessable_favorite_')) {
                        localStorage.setItem(key, value);
                        importedFavorites++;
                    }
                }

                console.log(`✅ Imported ${importedNotes} notes and ${importedFavorites} favorites`);
                alert(`Successfully imported ${importedNotes} notes and ${importedFavorites} favorites!`);

                // Refresh display if in review mode
                if (currentMode === 'REVIEW') {
                    displayAllNotes();
                    updateFavoriteButton(); // Also update favorite button state
                }
            } catch (err) {
                console.error('Import failed:', err);
                alert('Failed to import notes. Make sure the file is valid.');
            }
        };
        reader.readAsText(file);

        // Reset file input
        e.target.value = '';
    }

    function removeNotesButton() {
        const btn = document.getElementById('notes-button');
        if (btn) btn.remove();
    }

    // Click outside to close
    document.addEventListener('click', (e) => {
        const panel = document.getElementById('notes-panel');
        const notesBtn = document.getElementById('notes-button');

        if (notesPanelVisible && panel && !panel.contains(e.target) && e.target !== notesBtn) {
            toggleNotesPanel(false);
        }
    });

    // Updated updateFavoriteButton with emoji approach
    function updateFavoriteButton() {
        try {
            const favButton = document.querySelector('[data-testid="practiceFavButton"]');
            if (!favButton) {
                return;
            }

            // Get course name - try multiple selectors
            const courseElement = document.querySelector('.course-title-wrapper h3') ||
                  document.querySelector('[title*="Repertoires"]');
            const courseName = courseElement?.title || courseElement?.textContent || 'unknown_course';

            // Get chapter name - the active chapter in sidebar
            const chapterElement = document.querySelector('.mt-drawer-content__chapter--active h3');
            const chapterName = chapterElement?.textContent?.trim() || 'unknown_chapter';

            // Get variation name
            const variationElement = document.querySelector('[data-testid="commentVariationName"]');
            const variationName = variationElement?.textContent?.trim() || 'unknown_variation';

            // Create unique identifier
            const favoriteId = sanitizeForId(`${courseName}_${chapterName}_${variationName}`);
            const favoriteKey = `chessable_favorite_${favoriteId}`;

            // Check if already favorited
            const isFavorited = localStorage.getItem(favoriteKey) === 'true';

            // Update button appearance
            favButton.setAttribute('data-isfaved', isFavorited.toString());

            // Replace icon with emoji
            const icon = favButton.querySelector('i');
            if (icon) {
                if (isFavorited) {
                    icon.outerHTML = '<span style="font-size: 16px;">❤️</span>';
                } else {
                    icon.outerHTML = '<span style="font-size: 16px;">🤍</span>';
                }
            }

            favButton.style.display = 'flex';
            favButton.style.alignItems = 'center';
            favButton.style.justifyContent = 'center';

            // Only replace handler if not already done
            if (!favButton.hasAttribute('data-handler-attached')) {
                favButton.setAttribute('data-handler-attached', 'true');
                favButton.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite(favoriteKey, favButton, variationName);
                };
            }

        } catch (error) {
            console.error('[Favorites] Error:', error);
        }
    }

    // Updated toggleFavorite with emoji approach
    function toggleFavorite(favoriteKey, button, variationName) {
        const currentState = localStorage.getItem(favoriteKey) === 'true';
        const newState = !currentState;

        if (newState) {
            localStorage.setItem(favoriteKey, 'true');
            console.log(`❤️ Favorited: ${variationName}`);
        } else {
            localStorage.removeItem(favoriteKey);
            console.log(`🤍 Unfavorited: ${variationName}`);
        }

        // Update button appearance immediately
        button.setAttribute('data-isfaved', newState.toString());

        // Replace with emoji
        const existingIcon = button.querySelector('i, span');
        if (existingIcon) {
            if (newState) {
                existingIcon.outerHTML = '<span style="font-size: 16px;">❤️</span>';
            } else {
                existingIcon.outerHTML = '<span style="font-size: 16px;">🤍</span>';
            }
        }
    }

    // Initial check
    checkMode();

    // Observer for all changes
    const observer = new MutationObserver(() => {
        checkMode();
        checkForChapterChange();

        updateFavoriteButton();

        if (currentMode === 'REVIEW') {
            checkForMoveChange();
            addNotesButton();
        } else {
            // Remove button in quiz mode
            removeNotesButton();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['data-testid']
    });
})();