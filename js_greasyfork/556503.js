// ==UserScript==
// @name         Gemini Bulk Chat Deleter
// @namespace    http://tampermonkey.net/
// @version      2025-11-27
// @description  Bulk delete (mass-remove) chats from Gemini in batch. Select specific chats or delete all.
// @author       Lorenzo Alali
// @match        https://gemini.google.com/*
// @grant        GM_addStyle
// @grant        GM_log
// @license      MIT
// @homepageURL  https://github.com/lorenzoalali/Gemini-and-AI-Studio-Mass-Chat-Deleter
// @downloadURL https://update.greasyfork.org/scripts/556503/Gemini%20Bulk%20Chat%20Deleter.user.js
// @updateURL https://update.greasyfork.org/scripts/556503/Gemini%20Bulk%20Chat%20Deleter.meta.js
// ==/UserScript==

/*
 * =======================================================================
 * --- DISCLAIMER & IMPORTANT INFORMATION ---
 *
 * This tool (and its Google AI Studio equivalent) can be found
 * on GitHub https://github.com/lorenzoalali/Google-AI-Studio-Bulk-Delete-UserScript
 * and on Greasy Fork https://greasyfork.org/en/scripts/556503-gemini-bulk-chat-deleter
 *
 * --- USAGE AT YOUR OWN RISK ---
 * The author provides no guarantees regarding the performance, safety, or functionality of this script. You assume
 * all risks associated with its use. The author offers no support and is not responsible for any potential data
 * loss or issues that may arise.
 *
 * --- FUTURE COMPATIBILITY ---
 * This script's operation depends on the current Document Object Model (DOM) of the Gemini platform.
 * Modifications to the website by Google are likely to render this script non-functional in the future. While the
 * author does not plan on providing proactive updates or support, contributions in the form of GitHub pull requests
 * are welcome.
 * =======================================================================
 */

(function () {
    'use strict';

    // --- DOM Selectors (Updated 2025-11-27 for Gemini UI) ---
    const SELECTORS = {
        CHAT_CONTAINER: '.chat-history', // The scrollable container with chats
        CHAT_ITEM: 'div[data-test-id="conversation"]', // Individual chat item
        CHAT_TITLE: '.conversation-title',
        PINNED_ICON: '.pin-icon-container mat-icon', // Check for pinned icon
        MENU_BUTTON: 'button[data-test-id="actions-menu-button"]', // "More options" button
        DELETE_MENU_ITEM: 'button[data-test-id="delete-button"], div[role="menu"] button:has(mat-icon[data-mat-icon-name="delete"])', // Delete menu option
        CONFIRM_DIALOG: 'mat-dialog-container',
        CONFIRM_BUTTON: 'button[data-test-id="confirm-button"]', // Confirmation button
        CANCEL_BUTTON: 'button[data-test-id="cancel-button"]' // Cancel button
    };

    // Trusted Types Policy for safe HTML insertion
    let policy = null;
    if (window.trustedTypes && window.trustedTypes.createPolicy) {
        try {
            policy = window.trustedTypes.createPolicy('geminiBulkDeletePolicy', {
                createHTML: (string) => string
            });
        } catch (e) {
            console.warn('TrustedTypes policy creation failed or already exists:', e);
        }
    }

    const safeHTML = (html) => {
        return policy ? policy.createHTML(html) : html;
    };

    // --- Styles ---
    const css = `
        #bulk-delete-controls {
            display: flex;
            align-items: center;
            margin-right: 12px;
            z-index: 999;
            gap: 8px;
        }
        .bulk-delete-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 8px 12px;
            border: none;
            border-radius: 8px;
            font-family: 'Google Sans', Roboto, Arial, sans-serif;
            font-weight: 500;
            font-size: 14px;
            cursor: pointer;
            color: white !important;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
            transition: background-color 0.2s, filter 0.2s, opacity 0.2s;
            height: 36px; /* Match Gemini header button height */
            white-space: nowrap; /* Prevent text wrapping */
            flex-shrink: 0; /* Prevent button from shrinking */
        }
        .bulk-delete-btn:hover {
            filter: brightness(0.9);
        }
        .bulk-delete-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            filter: grayscale(0.5);
        }
        .bulk-delete-emoji {
            font-size: 120%;
            line-height: 1;
        }
        .btn-red { background-color: #B3261E; } /* Material Design Red */
        .btn-blue { background-color: #0B57D0; } /* Material Design Blue */
        .btn-orange { background-color: #F29900; color: #202124 !important; } /* Warning/Select Color */

        /* Checkbox Styles */
        .bulk-delete-checkbox {
            appearance: none;
            -webkit-appearance: none;
            width: 18px;
            height: 18px;
            border: 2px solid #5f6368;
            border-radius: 4px;
            margin-right: 12px; /* Space between checkbox and text */
            cursor: pointer;
            position: relative;
            flex-shrink: 0;
            transition: background-color 0.2s, border-color 0.2s;
            z-index: 100; /* Ensure clickable */
        }
        .bulk-delete-checkbox:checked {
            background-color: #0B57D0;
            border-color: #0B57D0;
        }
        .bulk-delete-checkbox:checked::after {
            content: '';
            position: absolute;
            left: 5px;
            top: 1px;
            width: 4px;
            height: 10px;
            border: solid white;
            border-width: 0 2px 2px 0;
            transform: rotate(45deg);
        }
        .bulk-delete-checkbox:hover {
            border-color: #0B57D0;
        }
        
        /* Row Alignment Fix - Updated for Nov 2025 UI */
        .gemini-bulk-delete-row {
            display: flex !important;
            align-items: center !important;
            flex-direction: row !important;
            gap: 8px !important;
        }
        /* Ensure other children of the chat item don't shrink */
        .gemini-bulk-delete-row > *:not(.bulk-delete-checkbox) {
            flex: 1 !important;
            min-width: 0 !important; /* Critical for text truncation in flex containers */
        }
        

    `;
    GM_addStyle(css);

    // --- State Variable ---
    let deletionInProgress = false;
    let selectedChats = new Set(); // Store DOM elements or IDs of selected chats
    let lastCheckedCheckbox = null; // For Range Selection


    // --- UI Helper & Styles ---
    const UI = {
        injectStyles: () => {
            if (document.getElementById('gemini-bulk-delete-styles')) return;
            const style = document.createElement('style');
            style.id = 'gemini-bulk-delete-styles';
            style.textContent = `
                .gas-toast-container {
                    position: fixed;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 10000;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    pointer-events: none;
                }
                .gas-toast {
                    background: #333;
                    color: #fff;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-family: 'Google Sans', Roboto, Arial, sans-serif;
                    font-size: 14px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    opacity: 0;
                    transform: translateY(20px);
                    transition: opacity 0.3s, transform 0.3s;
                    pointer-events: auto;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    min-width: 300px;
                    justify-content: center;
                }
                .gas-toast.visible {
                    opacity: 1;
                    transform: translateY(0);
                }
                .gas-toast.success { background: #0f9d58; }
                .gas-toast.error { background: #d93025; }
                .gas-toast.warning { background: #f4b400; color: #202124; }
                .gas-toast.info { background: #1a73e8; }

                .gas-modal-overlay {
                    position: fixed;
                    top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0,0,0,0.5);
                    z-index: 10001;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.2s;
                }
                .gas-modal-overlay.visible { opacity: 1; }
                .gas-modal {
                    background: white;
                    padding: 24px;
                    border-radius: 8px;
                    width: 400px;
                    max-width: 90%;
                    box-shadow: 0 1px 3px 0 rgba(60,64,67,0.3), 0 4px 8px 3px rgba(60,64,67,0.15);
                    font-family: 'Google Sans', Roboto, Arial, sans-serif;
                    transform: scale(0.95);
                    transition: transform 0.2s;
                }
                .gas-modal-overlay.visible .gas-modal { transform: scale(1); }
                .gas-modal-title {
                    font-size: 18px;
                    font-weight: 500;
                    margin-bottom: 12px;
                    color: #202124;
                }
                .gas-modal-content {
                    font-size: 14px;
                    color: #5f6368;
                    line-height: 1.5;
                    margin-bottom: 24px;
                    white-space: pre-wrap;
                }
                .gas-modal-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 12px;
                }
                .gas-btn {
                    border: none;
                    background: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: 500;
                    font-size: 14px;
                    transition: background 0.2s;
                }
                .gas-btn:hover { background: rgba(0,0,0,0.04); }
                .gas-btn.primary {
                    background: #1a73e8;
                    color: white;
                }
                .gas-btn.primary:hover { background: #1557b0; }
                .gas-btn.danger {
                    background: #d93025;
                    color: white;
                }
                .gas-btn.danger:hover { background: #a50e0e; }
                .gas-btn.secondary {
                    background: white;
                    color: #3c4043;
                    border: 1px solid #dadce0;
                }
                .gas-btn.secondary:hover {
                    background: #f1f3f4;
                    border-color: #dadce0;
                }

                /* Progress Bar Styles */
                .gas-progress-container {
                    position: fixed;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 10000;
                    background: #333;
                    color: #fff;
                    padding: 16px 24px;
                    border-radius: 12px;
                    font-family: 'Google Sans', Roboto, Arial, sans-serif;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.25);
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    min-width: 320px;
                    opacity: 0;
                    transform: translate(-50%, 20px);
                    transition: opacity 0.3s, transform 0.3s;
                    pointer-events: auto;
                }
                .gas-progress-container.visible {
                    opacity: 1;
                    transform: translate(-50%, 0);
                }
                .gas-progress-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 14px;
                    font-weight: 500;
                }
                .gas-progress-bar-bg {
                    width: 100%;
                    height: 6px;
                    background: rgba(255,255,255,0.2);
                    border-radius: 3px;
                    overflow: hidden;
                }
                .gas-progress-bar-fill {
                    height: 100%;
                    background: #4285f4; /* Google Blue */
                    width: 0%;
                    transition: width 0.3s ease-out;
                }
                .gas-progress-details {
                    font-size: 12px;
                    color: rgba(255,255,255,0.7);
                    text-align: right;
                }
            `;
            document.head.appendChild(style);
        },

        showToast: (message, type = 'info', duration = 3000) => {
            UI.injectStyles();
            let container = document.querySelector('.gas-toast-container');
            if (!container) {
                container = document.createElement('div');
                container.className = 'gas-toast-container';
                document.body.appendChild(container);
            }

            const toast = document.createElement('div');
            toast.className = `gas-toast ${type}`;

            let icon = '';
            if (type === 'success') icon = '✅';
            if (type === 'error') icon = '❌';
            if (type === 'warning') icon = '⚠️';
            if (type === 'info') icon = 'ℹ️';

            toast.innerHTML = safeHTML(`<span>${icon}</span><span>${message}</span>`);
            container.appendChild(toast);

            // Trigger reflow
            toast.offsetHeight;
            toast.classList.add('visible');

            if (duration > 0) {
                setTimeout(() => {
                    toast.classList.remove('visible');
                    setTimeout(() => toast.remove(), 300);
                }, duration);
            }
            return toast;
        },

        showConfirm: (title, message, confirmText = 'Confirm', confirmType = 'primary') => {
            UI.injectStyles();
            return new Promise((resolve) => {
                const overlay = document.createElement('div');
                overlay.className = 'gas-modal-overlay';

                const modal = document.createElement('div');
                modal.className = 'gas-modal';

                modal.innerHTML = safeHTML(`
                    <div class="gas-modal-title">${title}</div>
                    <div class="gas-modal-content">${message}</div>
                    <div class="gas-modal-actions">
                        <button class="gas-btn secondary cancel-btn">Cancel</button>
                        <button class="gas-btn ${confirmType} confirm-btn">${confirmText}</button>
                    </div>
                `);

                overlay.appendChild(modal);
                document.body.appendChild(overlay);

                // Trigger reflow
                overlay.offsetHeight;
                overlay.classList.add('visible');

                const close = (result) => {
                    overlay.classList.remove('visible');
                    setTimeout(() => overlay.remove(), 200);
                    resolve(result);
                };

                modal.querySelector('.cancel-btn').addEventListener('click', () => close(false));
                modal.querySelector('.confirm-btn').addEventListener('click', () => close(true));
                // Close on click outside
                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay) close(false);
                });
            });
        },

        showProgress: (message, total) => {
            UI.injectStyles();
            // Remove existing if any
            UI.hideProgress();

            const container = document.createElement('div');
            container.className = 'gas-progress-container';
            container.id = 'gas-progress-ui';

            container.innerHTML = safeHTML(`
                <div class="gas-progress-header">
                    <span id="gas-progress-text">${message}</span>
                    <span id="gas-progress-percent">0%</span>
                </div>
                <div class="gas-progress-bar-bg">
                    <div class="gas-progress-bar-fill" id="gas-progress-fill"></div>
                </div>
                <div class="gas-progress-details" id="gas-progress-count">0 of ${total}</div>
            `);

            document.body.appendChild(container);

            // Trigger reflow
            container.offsetHeight;
            container.classList.add('visible');
        },

        updateProgress: (current, total, textOverride = null) => {
            const container = document.getElementById('gas-progress-ui');
            if (!container) return;

            const percentage = Math.min(100, Math.round((current / total) * 100));

            const fill = document.getElementById('gas-progress-fill');
            const percentText = document.getElementById('gas-progress-percent');
            const countText = document.getElementById('gas-progress-count');
            const mainText = document.getElementById('gas-progress-text');

            if (fill) fill.style.width = `${percentage}%`;
            if (percentText) percentText.textContent = `${percentage}%`;
            if (countText) countText.textContent = `${current} of ${total}`;
            if (textOverride && mainText) mainText.textContent = textOverride;
        },

        hideProgress: () => {
            const container = document.getElementById('gas-progress-ui');
            if (container) {
                container.classList.remove('visible');
                setTimeout(() => container.remove(), 300);
            }
        },

        showUndoToast: (seconds) => {
            UI.injectStyles();
            return new Promise((resolve, reject) => {
                let container = document.querySelector('.gas-toast-container');
                if (!container) {
                    container = document.createElement('div');
                    container.className = 'gas-toast-container';
                    document.body.appendChild(container);
                }

                const toast = document.createElement('div');
                toast.className = 'gas-toast warning';
                toast.id = 'gas-undo-toast';

                let remaining = seconds;

                const updateText = () => {
                    toast.innerHTML = safeHTML(`
                        <span>⏳</span>
                        <span style="flex:1">Starting deletion in ${remaining}s...</span>
                        <button id="gas-undo-cancel" style="background:transparent;border:1px solid white;color:white;border-radius:4px;padding:4px 8px;cursor:pointer;font-size:12px;">CANCEL</button>
                    `);
                };

                updateText();
                container.appendChild(toast);

                // Trigger reflow
                toast.offsetHeight;
                toast.classList.add('visible');

                const interval = setInterval(() => {
                    remaining--;
                    if (remaining <= 0) {
                        clearInterval(interval);
                        toast.classList.remove('visible');
                        setTimeout(() => toast.remove(), 300);
                        resolve(true); // Timer finished
                    } else {
                        updateText();
                        // Re-attach listener because innerHTML wiped it
                        document.getElementById('gas-undo-cancel').addEventListener('click', handleCancel);
                    }
                }, 1000);

                const handleCancel = () => {
                    clearInterval(interval);
                    toast.classList.remove('visible');
                    setTimeout(() => toast.remove(), 300);
                    resolve(false); // Cancelled
                };

                // Initial listener
                toast.querySelector('#gas-undo-cancel').addEventListener('click', handleCancel);
            });
        }
    };

    // --- Helper Functions ---

    function waitForElement(selector, timeout = 3000, parent = document) {
        return new Promise((resolve, reject) => {
            const intervalTime = 200;
            let timeWaited = 0;

            const check = () => {
                const element = parent.querySelector(selector);
                if (element) {
                    resolve(element);
                    return true;
                }
                return false;
            };

            if (check()) return;

            const interval = setInterval(() => {
                if (check()) {
                    clearInterval(interval);
                } else {
                    timeWaited += intervalTime;
                    if (timeWaited >= timeout) {
                        clearInterval(interval);
                        reject(new Error(`Timed out waiting for selector: ${selector}`));
                    }
                }
            }, intervalTime);
        });
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    // --- Checkbox Injection Logic ---

    function injectCheckboxes() {
        const historyContainer = document.querySelector(SELECTORS.CHAT_CONTAINER);
        if (!historyContainer) return;

        const chatItems = Array.from(historyContainer.querySelectorAll(SELECTORS.CHAT_ITEM));

        chatItems.forEach((item, index) => {
            // Check if we already injected a checkbox
            if (item.querySelector('.bulk-delete-checkbox')) return;

            // Check if pinned
            const isPinned = item.querySelector(SELECTORS.PINNED_ICON);

            // Do NOT inject checkbox for pinned chats
            if (isPinned) return;

            // Create checkbox
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'bulk-delete-checkbox';
            checkbox.title = "Select for deletion (Shift+Click to select range)";
            checkbox.dataset.index = index; // Store index for range selection

            // Event listener for selection
            checkbox.addEventListener('click', (e) => {
                // Handle Range Selection (Shift + Click)
                if (e.shiftKey && lastCheckedCheckbox && lastCheckedCheckbox !== checkbox) {
                    const allCheckboxes = Array.from(document.querySelectorAll('.bulk-delete-checkbox'));
                    const start = allCheckboxes.indexOf(lastCheckedCheckbox);
                    const end = allCheckboxes.indexOf(checkbox);

                    if (start !== -1 && end !== -1) {
                        const low = Math.min(start, end);
                        const high = Math.max(start, end);

                        for (let i = low; i <= high; i++) {
                            const cb = allCheckboxes[i];
                            cb.checked = lastCheckedCheckbox.checked; // Match the state of the first clicked

                            const chatItem = cb.closest(SELECTORS.CHAT_ITEM);
                            if (chatItem) {
                                if (cb.checked) {
                                    selectedChats.add(chatItem);
                                } else {
                                    selectedChats.delete(chatItem);
                                }
                            }
                        }
                    }
                } else {
                    // Normal Click
                    if (e.target.checked) {
                        selectedChats.add(item);
                    } else {
                        selectedChats.delete(item);
                    }
                }

                lastCheckedCheckbox = checkbox;
                updateButtonState();
            });

            // Insert at the beginning of the chat item
            item.prepend(checkbox);
            item.classList.add('gemini-bulk-delete-row');
        });
    }

    function toggleSelectAll(shouldSelect) {
        const allCheckboxes = document.querySelectorAll('.bulk-delete-checkbox');
        allCheckboxes.forEach(cb => {
            cb.checked = shouldSelect;
            // The checkbox is now directly inside the chat item (SELECTORS.CHAT_ITEM)
            const chatItem = cb.closest(SELECTORS.CHAT_ITEM);
            if (chatItem) {
                if (shouldSelect) {
                    selectedChats.add(chatItem);
                } else {
                    selectedChats.delete(chatItem);
                }
            }
        });
        updateButtonState();
    }


    // --- Core Deletion Logic ---

    async function startBulkDelete(mode = 'ALL') {
        // Verify Sidebar visibility before starting
        const historyContainerCheck = document.querySelector(SELECTORS.CHAT_CONTAINER);
        if (!historyContainerCheck) {
            UI.showToast("Error: Chat history is not visible. Please open the sidebar.", 'error', 5000);
            return;
        }

        let confirmMsg = "";
        let title = "";
        let confirmBtnText = "";

        if (mode === 'SELECTED') {
            if (selectedChats.size === 0) {
                UI.showToast("No chats selected.", 'warning');
                return;
            }
            title = `Delete ${selectedChats.size} Selected Chat(s)?`;
            confirmMsg = `Are you sure you want to delete the ${selectedChats.size} selected chat(s)? This cannot be undone.`;
            confirmBtnText = "Delete Selected";
        } else {
            title = "Delete All Chats?";
            confirmMsg = "Are you sure you want to permanently delete all chats visible in the sidebar?\n\n(Pinned chats & Gems will be preserved)";
            confirmBtnText = "Delete All";
        }

        const userConfirmation = await UI.showConfirm(
            title,
            confirmMsg,
            confirmBtnText,
            "danger"
        );

        if (!userConfirmation) return;

        // Undo Timer
        const proceed = await UI.showUndoToast(5); // 5 seconds
        if (!proceed) {
            UI.showToast("Deletion Cancelled.", 'info');
            return;
        }

        if (deletionInProgress) return;
        deletionInProgress = true;
        updateButtonState();
        GM_log(`▶️ Starting bulk delete (Mode: ${mode})...`);

        let successCount = 0;
        let failureCount = 0;
        let consecutiveFailures = 0;

        // Create a list of items to process
        let itemsToProcess = [];
        let totalItemsToProcess = 0;

        if (mode === 'SELECTED') {
            itemsToProcess = Array.from(selectedChats);
            totalItemsToProcess = itemsToProcess.length;
        } else {
            // For ALL mode, we'll dynamically query, but we can start by clearing selection
            selectedChats.clear();
            // Uncheck all checkboxes visually
            document.querySelectorAll('.bulk-delete-checkbox').forEach(cb => cb.checked = false);

            // Estimate total for progress bar
            const historyContainer = document.querySelector(SELECTORS.CHAT_CONTAINER);
            if (historyContainer) {
                const allChats = Array.from(historyContainer.querySelectorAll(SELECTORS.CHAT_ITEM));
                // Filter out pinned
                const deletableChats = allChats.filter(item => {
                    const isPinned = item.querySelector(SELECTORS.PINNED_ICON);
                    return !isPinned;
                });
                totalItemsToProcess = deletableChats.length;
            }
        }

        // Initialize Progress Bar
        UI.showProgress("Deletion in progress...", totalItemsToProcess);
        let processedCount = 0;

        while (deletionInProgress) {
            try {
                let targetItem = null;

                if (mode === 'SELECTED') {
                    if (itemsToProcess.length === 0) {
                        GM_log("✅ Finished processing selected items.");
                        break;
                    }
                    targetItem = itemsToProcess.shift(); // Get next item

                    // Verify it still exists in DOM
                    if (!document.body.contains(targetItem)) {
                        GM_log("⚠️ Item no longer in DOM, skipping.");
                        processedCount++;
                        UI.updateProgress(processedCount, totalItemsToProcess);
                        continue;
                    }
                } else {
                    // ALL Mode: Dynamic Query
                    const historyContainer = document.querySelector('div.conversations-container');
                    if (!historyContainer) break;

                    const chatItems = Array.from(historyContainer.querySelectorAll('.conversation-actions-container'));
                    if (chatItems.length === 0) break;

                    // Find first non-pinned
                    for (const item of chatItems) {
                        const previousSibling = item.previousElementSibling;
                        const isPinned = item.querySelector(SELECTORS.PINNED_ICON);
                        if (!isPinned) {
                            targetItem = item;
                            break;
                        }
                    }

                    if (!targetItem) {
                        GM_log("✅ No more non-pinned chats found.");
                        break;
                    }
                }

                // --- Perform Deletion on targetItem ---

                // Force visibility
                targetItem.style.visibility = 'visible';
                targetItem.style.opacity = '1';

                // Find the menu button - it's in the next sibling (.conversation-actions-container)
                // or within the parent element
                let optionsButton = targetItem.nextElementSibling?.querySelector(SELECTORS.MENU_BUTTON);
                if (!optionsButton) {
                    optionsButton = targetItem.parentElement?.querySelector(SELECTORS.MENU_BUTTON);
                }

                if (!optionsButton) {
                    GM_log("⚠️ Menu button not found for item, skipping.");
                    failureCount++;
                    processedCount++;
                    UI.updateProgress(processedCount, totalItemsToProcess);
                    continue;
                }

                // Click "More options"
                optionsButton.click();
                await sleep(500);

                // Find 'Delete' in dropdown menu
                const deleteMenuItem = await waitForElement(SELECTORS.DELETE_MENU_ITEM, 2000, document.body);
                deleteMenuItem.click();
                await sleep(500);

                // Confirm Dialog
                const dialog = await waitForElement(SELECTORS.CONFIRM_DIALOG, 2000, document.body);
                const confirmBtn = dialog.querySelector(SELECTORS.CONFIRM_BUTTON);

                if (!confirmBtn) throw new Error("Confirmation button not found.");

                confirmBtn.click();

                // Wait for response/animation
                await sleep(1200);

                successCount++;
                processedCount++;
                consecutiveFailures = 0;

                // Update Progress
                UI.updateProgress(processedCount, totalItemsToProcess, `Deleting ${processedCount} of ${totalItemsToProcess}...`);

                // If in SELECTED mode, remove the checkbox/row from UI if it wasn't automatically removed
                if (mode === 'SELECTED') {
                    // The parent element usually gets removed by Gemini, but we can ensure the checkbox is gone
                    // We don't need to do much as the DOM update should handle it.
                    // But we should remove it from our set.
                    selectedChats.delete(targetItem);
                }

            } catch (error) {
                GM_log(`❌ Error: ${error.message}`);
                failureCount++;
                processedCount++; // Count failure as processed so bar keeps moving
                consecutiveFailures++;

                UI.updateProgress(processedCount, totalItemsToProcess, `Error on item ${processedCount}...`);

                if (consecutiveFailures > 5) {
                    UI.showToast("Too many consecutive errors. Stopping.", 'error');
                    deletionInProgress = false;
                }

                await sleep(1000);
                if (!deletionInProgress) break;
            }
        }

        deletionInProgress = false;
        selectedChats.clear(); // Clear selection after operation
        updateButtonState();
        UI.hideProgress(); // Hide progress bar

        if (successCount > 0 || failureCount > 0) {
            UI.showToast(`Deletion Complete! Deleted: ${successCount}, Errors: ${failureCount}`, 'success', 5000);
        } else {
            UI.showToast("No chats found to delete.", 'warning', 5000);
        }
    }

    function stopBulkDelete() {
        if (deletionInProgress) {
            deletionInProgress = false;
            const stopBtn = document.getElementById('stop-delete-btn');
            if (stopBtn) {
                stopBtn.innerHTML = safeHTML('<span class="bulk-delete-emoji">🛑</span> Stopping...');
                stopBtn.disabled = true;
                UI.showToast("Bulk delete will stop after the current action.", 'info');
            }
        }
    }

    // --- UI Injection ---

    function createUI() {
        // Check if already exists to prevent duplicates
        if (document.getElementById('bulk-delete-controls')) return;

        // Priority 1: The right section container inside the top bar (Standard Gemini Layout)
        let anchorPoint = document.querySelector('.right-section');

        // Priority 2: Fallback to the standard Google Bar header if right-section is missing
        if (!anchorPoint) {
            anchorPoint = document.querySelector('.gb_Rd');
        }

        if (!anchorPoint) return;

        const container = document.createElement('div');
        container.id = 'bulk-delete-controls';

        // Select All Checkbox
        const selectAllContainer = document.createElement('div');
        selectAllContainer.style.display = 'flex';
        selectAllContainer.style.alignItems = 'center';
        selectAllContainer.title = "Select All Visible";

        const selectAllCheckbox = document.createElement('input');
        selectAllCheckbox.type = 'checkbox';
        selectAllCheckbox.className = 'bulk-delete-checkbox';
        selectAllCheckbox.style.marginRight = '0';
        selectAllCheckbox.style.marginLeft = '8px';
        selectAllCheckbox.addEventListener('change', (e) => toggleSelectAll(e.target.checked));

        selectAllContainer.appendChild(selectAllCheckbox);



        // Delete Selected Button
        const deleteSelectedBtn = document.createElement('button');
        deleteSelectedBtn.id = 'delete-selected-btn';
        deleteSelectedBtn.className = 'bulk-delete-btn btn-orange';
        deleteSelectedBtn.innerHTML = safeHTML('<span class="bulk-delete-emoji">✅</span>&nbsp;Delete Selected');
        deleteSelectedBtn.title = "Delete selected chats";
        deleteSelectedBtn.disabled = true; // Disabled by default
        deleteSelectedBtn.onclick = () => startBulkDelete('SELECTED');

        // Start Button (Delete All)
        const startBtn = document.createElement('button');
        startBtn.id = 'start-delete-btn';
        startBtn.className = 'bulk-delete-btn btn-red';
        startBtn.innerHTML = safeHTML('<span class="bulk-delete-emoji">🔥</span>&nbsp;Delete All');
        startBtn.title = "Delete all chats in sidebar (except pinned chats & Gems)";
        startBtn.onclick = () => startBulkDelete('ALL');

        // Stop Button
        const stopBtn = document.createElement('button');
        stopBtn.id = 'stop-delete-btn';
        stopBtn.className = 'bulk-delete-btn btn-blue';
        stopBtn.innerHTML = safeHTML('<span class="bulk-delete-emoji">🛑</span> Stop');
        stopBtn.style.display = 'none';
        stopBtn.onclick = stopBulkDelete;

        container.appendChild(selectAllContainer);
        container.appendChild(deleteSelectedBtn);
        container.appendChild(startBtn);
        container.appendChild(stopBtn);

        // Prepend ensures it sits to the left of the User Profile / Advanced button
        anchorPoint.prepend(container);
    }

    function updateButtonState() {
        const deleteSelected = document.getElementById('delete-selected-btn');
        const start = document.getElementById('start-delete-btn');
        const stop = document.getElementById('stop-delete-btn');

        if (start && stop && deleteSelected) {
            if (deletionInProgress) {
                start.style.display = 'none';
                deleteSelected.style.display = 'none';
                stop.style.display = 'inline-flex';
                stop.disabled = false;
                stop.innerHTML = safeHTML('<span class="bulk-delete-emoji">🛑</span> Stop');
            } else {
                start.style.display = 'inline-flex';
                start.innerHTML = safeHTML('<span class="bulk-delete-emoji">🔥</span>&nbsp;Delete All');

                deleteSelected.style.display = 'inline-flex';
                deleteSelected.disabled = selectedChats.size === 0;
                deleteSelected.innerHTML = safeHTML(`<span class="bulk-delete-emoji">✅</span>&nbsp;Delete Selected (${selectedChats.size})`);

                stop.style.display = 'none';
            }
        }
    }

    // --- Initialization ---
    const observer = new MutationObserver((mutations) => {
        // Continuously check if our button is missing (e.g., after page navigation)
        if (!document.getElementById('bulk-delete-controls')) {
            createUI();
        }
        // Also continuously try to inject checkboxes as list loads/scrolls
        injectCheckboxes();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Initial try
    setTimeout(createUI, 1000);
    setTimeout(injectCheckboxes, 1500);
    setTimeout(createUI, 3000); // Retry for slower connections

})();