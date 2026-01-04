// ==UserScript==
// @name         Gmail Bulk Delete
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Bulk delete Gmail messages before a specified date
// @author       Liminality Dreams
// @match        https://mail.google.com/*
// @icon         https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.iconsdb.com%2Ficons%2Fdownload%2Fpurple%2Fgmail-login-512.png&f=1&nofb=1&ipt=58f1f097af09cca95119782f0ac6c01fd525f248fe858e72e9364340d8a5d4f7
// @grant        none
// @license GNU 3.0
// @downloadURL https://update.greasyfork.org/scripts/556838/Gmail%20Bulk%20Delete.user.js
// @updateURL https://update.greasyfork.org/scripts/556838/Gmail%20Bulk%20Delete.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isDeleting = false;
    let stopRequested = false;
    let deletedCount = 0;
    let cutoffDate = null;

    // Create GUI
    function createGUI() {
        const gui = document.createElement('div');
        gui.id = 'gmail-bulk-delete-gui';
        gui.innerHTML = `
            <div style="position: fixed; top: 20px; right: 20px; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%); border: 2px solid #a855f7; border-radius: 12px; padding: 24px; z-index: 10000; box-shadow: 0 0 20px rgba(168, 85, 247, 0.5), 0 4px 12px rgba(0,0,0,0.3); width: 340px; font-family: 'Google Sans', Roboto, Arial, sans-serif;">
                <div style="display: flex; align-items: center; margin-bottom: 20px;">
                    <svg style="width: 24px; height: 24px; margin-right: 12px; fill: #a855f7; filter: drop-shadow(0 0 8px rgba(168, 85, 247, 0.6));" viewBox="0 0 24 24">
                        <path d="M15 4V3H9v1H4v2h1v13c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6h1V4h-5zm-8 15V7h10v12H7z"/>
                    </svg>
                    <h3 style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 600; text-shadow: 0 0 10px rgba(168, 85, 247, 0.5);">Gmail Bulk Delete</h3>
                </div>

                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 8px; color: #e9d5ff; font-size: 14px; font-weight: 500;">Delete emails before (start):</label>
                    <input type="date" id="cutoff-date" style="width: 100%; padding: 10px; border: 2px solid #7c3aed; border-radius: 6px; font-size: 14px; color: #ffffff; background: #0f172a; box-sizing: border-box; box-shadow: 0 0 10px rgba(124, 58, 237, 0.3);">
                </div>

                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 8px; color: #e9d5ff; font-size: 14px; font-weight: 500;">Stop at date (optional):</label>
                    <input type="date" id="stop-date" style="width: 100%; padding: 10px; border: 2px solid #7c3aed; border-radius: 6px; font-size: 14px; color: #ffffff; background: #0f172a; box-sizing: border-box; box-shadow: 0 0 10px rgba(124, 58, 237, 0.3);">
                    <small style="color: #c4b5fd; font-size: 12px; margin-top: 4px; display: block;">Leave empty to delete all emails before start date</small>
                </div>

                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 8px; color: #e9d5ff; font-size: 14px; font-weight: 500;">Search query (optional):</label>
                    <input type="text" id="search-query" placeholder="e.g., from:someone@example.com" style="width: 100%; padding: 10px; border: 2px solid #7c3aed; border-radius: 6px; font-size: 14px; color: #ffffff; background: #0f172a; box-sizing: border-box; box-shadow: 0 0 10px rgba(124, 58, 237, 0.3);">
                    <small style="color: #c4b5fd; font-size: 12px; margin-top: 4px; display: block;">Leave empty to delete all emails</small>
                </div>

                <div style="margin-bottom: 20px; padding: 12px; background: rgba(168, 85, 247, 0.1); border-radius: 8px; border: 2px solid #7c3aed; box-shadow: 0 0 15px rgba(124, 58, 237, 0.3);">
                    <div style="font-size: 13px; color: #e9d5ff; margin-bottom: 4px;"><strong>Status:</strong> <span id="status" style="color: #a855f7;">Ready</span></div>
                    <div style="font-size: 13px; color: #e9d5ff;"><strong>Deleted:</strong> <span id="deleted-count" style="color: #a855f7;">0</span> emails</div>
                </div>

                <div style="display: flex; gap: 8px; margin-bottom: 16px;">
                    <button id="start-btn" style="flex: 1; padding: 12px 24px; background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%); color: white; border: 2px solid #a855f7; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600; font-family: 'Google Sans', Roboto, Arial, sans-serif; transition: all 0.3s; box-shadow: 0 0 15px rgba(168, 85, 247, 0.5);">
                        <svg style="width: 14px; height: 14px; margin-right: 8px; fill: white; vertical-align: text-bottom; display: inline-block;" viewBox="0 0 24 24">
                            <path d="M15 4V3H9v1H4v2h1v13c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6h1V4h-5zm-8 15V7h10v12H7z"/>
                        </svg>
                        Start Delete
                    </button>
                    <button id="stop-btn" style="flex: 1; padding: 12px 24px; background: rgba(30, 30, 46, 0.8); color: #c4b5fd; border: 2px solid #6b21a8; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600; font-family: 'Google Sans', Roboto, Arial, sans-serif; transition: all 0.3s;" disabled>Stop</button>
                </div>

                <div style="padding: 12px; background: rgba(168, 85, 247, 0.15); border: 2px solid #a855f7; border-radius: 6px; font-size: 12px; color: #e9d5ff; line-height: 1.5; box-shadow: 0 0 10px rgba(168, 85, 247, 0.3);">
                    ⚠️ <strong style="color: #c4b5fd;">Warning:</strong> This will permanently delete emails. They go to Trash first (30-day recovery). Make sure you're on the correct account!
                </div>
            </div>
        `;
        document.body.appendChild(gui);

        // Set default dates
        const dateInput = document.getElementById('cutoff-date');
        const stopDateInput = document.getElementById('stop-date');
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
        // Leave stop date empty by default

        // Event listeners
        document.getElementById('start-btn').addEventListener('click', startDeletion);
        document.getElementById('stop-btn').addEventListener('click', stopDeletion);

        // Hover effects
        const startBtn = document.getElementById('start-btn');
        const stopBtn = document.getElementById('stop-btn');

        startBtn.addEventListener('mouseover', () => {
            if (!startBtn.disabled) {
                startBtn.style.boxShadow = '0 0 25px rgba(168, 85, 247, 0.8)';
                startBtn.style.transform = 'translateY(-2px)';
            }
        });
        startBtn.addEventListener('mouseout', () => {
            if (!startBtn.disabled) {
                startBtn.style.boxShadow = '0 0 15px rgba(168, 85, 247, 0.5)';
                startBtn.style.transform = 'translateY(0)';
            }
        });

        stopBtn.addEventListener('mouseover', () => {
            if (!stopBtn.disabled) {
                stopBtn.style.background = 'rgba(107, 33, 168, 0.3)';
                stopBtn.style.boxShadow = '0 0 15px rgba(168, 85, 247, 0.4)';
            }
        });
        stopBtn.addEventListener('mouseout', () => {
            if (!stopBtn.disabled) {
                stopBtn.style.background = 'rgba(30, 30, 46, 0.8)';
                stopBtn.style.boxShadow = 'none';
            }
        });
    }

    function updateStatus(status) {
        document.getElementById('status').textContent = status;
    }

    function updateDeletedCount() {
        document.getElementById('deleted-count').textContent = deletedCount;
    }

    function startDeletion() {
        const dateInput = document.getElementById('cutoff-date').value;
        const stopDateInput = document.getElementById('stop-date').value;
        const searchQuery = document.getElementById('search-query').value.trim();

        if (!dateInput) {
            alert('Please select a cutoff date!');
            return;
        }

        cutoffDate = new Date(dateInput);

        isDeleting = true;
        stopRequested = false;
        deletedCount = 0;

        document.getElementById('start-btn').disabled = true;
        document.getElementById('stop-btn').disabled = false;

        updateStatus('Running...');
        updateDeletedCount();

        // Build search query with proper Gmail date format
        const startParts = dateInput.split('-'); // YYYY-MM-DD
        let query = `before:${startParts[0]}/${startParts[1]}/${startParts[2]}`;

        if (stopDateInput) {
            const stopParts = stopDateInput.split('-');
            query += ` after:${stopParts[0]}/${stopParts[1]}/${stopParts[2]}`;
        }

        if (searchQuery) {
            query += ' ' + searchQuery;
        }

        console.log('Search query:', query);

        // Navigate to search results
        window.location.href = `https://mail.google.com/mail/u/0/#search/${encodeURIComponent(query)}`;

        // Start deletion after page loads
        setTimeout(deleteEmails, 3000);
    }

    function stopDeletion() {
        stopRequested = true;
        isDeleting = false;
        document.getElementById('start-btn').disabled = false;
        document.getElementById('stop-btn').disabled = true;
        updateStatus('Stopped');
    }

    async function deleteEmails() {
        if (!isDeleting || stopRequested) {
            updateStatus('Stopped');
            return;
        }

        try {
            updateStatus('Checking for emails...');

            // Check if we've reached "No messages matched your search"
            const noMessagesText = document.body.textContent;
            if (noMessagesText.includes('No messages matched your search') ||
                noMessagesText.includes('No conversations') ||
                noMessagesText.includes('Nothing in')) {
                // All done!
                updateStatus('Complete!');
                isDeleting = false;
                document.getElementById('start-btn').disabled = false;
                document.getElementById('stop-btn').disabled = true;
                alert(`✅ Deletion complete! ${deletedCount} emails deleted.`);
                return;
            }

            // Click "Select all" checkbox
            const selectAllCheckbox = document.querySelector('span[role="checkbox"][aria-checked="false"]');
            if (!selectAllCheckbox) {
                // No checkbox but also no "no messages" - page might be loading
                updateStatus('Waiting for page to load...');
                setTimeout(deleteEmails, 2000);
                return;
            }

            updateStatus('Selecting emails...');
            selectAllCheckbox.click();
            await sleep(1000);

            // Check if "Select all conversations" banner appears and click it
            const selectAllBanner = Array.from(document.querySelectorAll('span')).find(el =>
                el.textContent.includes('Select all conversations') ||
                el.textContent.includes('Select all')
            );

            if (selectAllBanner) {
                updateStatus('Selecting all conversations...');
                selectAllBanner.click();
                await sleep(800);
            }

            updateStatus('Finding delete button...');

            // Find the delete button - it's next to "Report spam"
            // Try multiple methods to find it
            let deleteButton = null;

            // Method 1: Find by the specific class
            deleteButton = document.querySelector('div[act="10"]');

            if (!deleteButton) {
                // Method 2: Find all buttons with the trash icon class
                deleteButton = document.querySelector('div.ar9.T-I-J3.J-J5-Ji');
            }

            if (!deleteButton) {
                // Method 3: Find the toolbar and get the delete button (usually 3rd button)
                const toolbar = document.querySelector('div[role="toolbar"]');
                if (toolbar) {
                    const buttons = toolbar.querySelectorAll('div[role="button"]');
                    // Delete is typically the 3rd button (after Archive and Report Spam)
                    if (buttons.length >= 3) {
                        deleteButton = buttons[2];
                    }
                }
            }

            if (!deleteButton) {
                // Method 4: Find by data-tooltip="Delete"
                deleteButton = document.querySelector('div[data-tooltip="Delete"]');
            }

            if (!deleteButton) {
                // Method 5: Search through all toolbar buttons
                const allToolbarButtons = document.querySelectorAll('div[role="toolbar"] div[role="button"]');
                for (const btn of allToolbarButtons) {
                    const tooltip = btn.getAttribute('data-tooltip');
                    const ariaLabel = btn.getAttribute('aria-label');
                    if (tooltip?.includes('Delete') || ariaLabel?.includes('Delete')) {
                        deleteButton = btn;
                        break;
                    }
                }
            }

            if (deleteButton) {
                updateStatus('Clicking delete button...');
                console.log('Found delete button:', deleteButton);

                // Use multiple click methods to ensure it works
                // Method 1: Direct click
                deleteButton.click();

                // Method 2: Focus and trigger
                deleteButton.focus();
                await sleep(100);

                // Method 3: MouseDown and MouseUp events
                const mouseDownEvent = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                const mouseUpEvent = new MouseEvent('mouseup', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });

                deleteButton.dispatchEvent(mouseDownEvent);
                await sleep(50);
                deleteButton.dispatchEvent(mouseUpEvent);
                await sleep(50);

                // Method 4: Trigger another click just to be sure
                deleteButton.click();

                // Try to get actual count from selection
                const selectedSpan = document.querySelector('span.Dj');
                let batchCount = 50; // default
                if (selectedSpan) {
                    const match = selectedSpan.textContent.match(/(\d+)/);
                    if (match) {
                        batchCount = parseInt(match[1]);
                    }
                }

                deletedCount += batchCount;
                updateDeletedCount();
                updateStatus(`Deleted ${batchCount}, waiting for next batch...`);

                // Wait for Gmail to process the deletion and load next batch
                await sleep(4000);

                // Automatically continue - the page should refresh with next batch
                setTimeout(deleteEmails, 1500);
            } else {
                updateStatus('Error: Delete button not found');
                console.log('Could not find delete button. Available toolbar buttons:',
                    Array.from(document.querySelectorAll('div[role="toolbar"] div[role="button"]')).map(b => ({
                        aria: b.getAttribute('aria-label'),
                        tooltip: b.getAttribute('data-tooltip'),
                        act: b.getAttribute('act'),
                        classes: b.className
                    }))
                );
                stopDeletion();
            }
        } catch (error) {
            console.error('Error during deletion:', error);
            updateStatus('Error: ' + error.message);
            stopDeletion();
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Wait for Gmail to load, then create GUI
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(createGUI, 2000);
            });
        } else {
            setTimeout(createGUI, 2000);
        }
    }

    init();
})();