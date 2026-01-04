// ==UserScript==
// @name         Google AI Studio Bulk Chat Deleter
// @namespace    http://tampermonkey.net/
// @version      2025-11-29
// @description  Bulk delete (mass-remove) chats from Google AI Studio in batch.
// @author       Lorenzo Alali
// @match        https://aistudio.google.com/*
// @grant        none
// @license      MIT
// @homepageURL  https://github.com/lorenzoalali/Gemini-and-AI-Studio-Mass-Chat-Deleter
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/555870/Google%20AI%20Studio%20Bulk%20Chat%20Deleter.user.js
// @updateURL https://update.greasyfork.org/scripts/555870/Google%20AI%20Studio%20Bulk%20Chat%20Deleter.meta.js
// ==/UserScript==

/*
 * =======================================================================
 * --- DISCLAIMER & IMPORTANT INFORMATION ---
 *
 * This tool (and its Gemini equivalent) can be found
 * on GitHub https://github.com/lorenzoalali/Google-AI-Studio-Bulk-Delete-UserScript
 * and on Greasy Fork https://greasyfork.org/en/scripts/555870-google-ai-studio-bulk-delete
 *
 * --- USAGE AT YOUR OWN RISK ---
 * The author provides no guarantees regarding the performance, safety, or functionality of this script. You assume
 * all risks associated with its use. The author offers no support and is not responsible for any potential data
 * loss or issues that may arise.
 *
 * --- FUTURE COMPATIBILITY ---
 * This script's operation depends on the current Document Object Model (DOM) of the Google AI Studio platform.
 * Modifications to the website by Google are likely to render this script non-functional in the future. While the
 * author does not plan on providing proactive updates or support, contributions in the form of GitHub pull requests
 * are welcome.
 * =======================================================================
 */

(function () {
    'use strict';

    // --- State Management ---
    const aBULK_DELETE_ALL_KEY = 'isAiStudioBulkDeletingAll';
    const aBULK_DELETE_SELECTED_KEY = 'isAiStudioBulkDeletingSelected';
    const aBULK_DELETE_SUCCESS_KEY = 'aiStudioBulkDeleteSuccessCount';
    const aBULK_DELETE_FAIL_KEY = 'aiStudioBulkDeleteFailCount';
    const aBULK_DELETE_TOTAL_KEY = 'aiStudioBulkDeleteTotalCount';

    let isStopRequested = false;
    let isProcessing = false; // Prevent multiple loops
    let lastCheckedCheckbox = null; // For Range Selection


    // Global UI References to handle re-renders
    const uiElements = {
        allBtn: null,
        selBtn: null,
        stopBtn: null
    };

    // --- UI Helper & Styles ---
    const UI = {
        injectStyles: () => {
            if (document.getElementById('gas-bulk-delete-styles')) return;
            const style = document.createElement('style');
            style.id = 'gas-bulk-delete-styles';
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

            const iconSpan = document.createElement('span');
            let icon = '';
            if (type === 'success') icon = '✅';
            if (type === 'error') icon = '❌';
            if (type === 'warning') icon = '⚠️';
            if (type === 'info') icon = 'ℹ️';
            iconSpan.textContent = icon;

            const msgSpan = document.createElement('span');
            msgSpan.textContent = message;

            toast.appendChild(iconSpan);
            toast.appendChild(msgSpan);
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

                const titleDiv = document.createElement('div');
                titleDiv.className = 'gas-modal-title';
                titleDiv.textContent = title;

                const contentDiv = document.createElement('div');
                contentDiv.className = 'gas-modal-content';
                contentDiv.textContent = message;

                const actionsDiv = document.createElement('div');
                actionsDiv.className = 'gas-modal-actions';

                const cancelBtn = document.createElement('button');
                cancelBtn.className = 'gas-btn secondary cancel-btn';
                cancelBtn.textContent = 'Cancel';

                const confirmBtn = document.createElement('button');
                confirmBtn.className = `gas-btn ${confirmType} confirm-btn`;
                confirmBtn.textContent = confirmText;

                actionsDiv.appendChild(cancelBtn);
                actionsDiv.appendChild(confirmBtn);

                modal.appendChild(titleDiv);
                modal.appendChild(contentDiv);
                modal.appendChild(actionsDiv);
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

                cancelBtn.addEventListener('click', () => close(false));
                confirmBtn.addEventListener('click', () => close(true));
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

            const header = document.createElement('div');
            header.className = 'gas-progress-header';

            const msgSpan = document.createElement('span');
            msgSpan.id = 'gas-progress-text';
            msgSpan.textContent = message;

            const percentSpan = document.createElement('span');
            percentSpan.id = 'gas-progress-percent';
            percentSpan.textContent = '0%';

            header.appendChild(msgSpan);
            header.appendChild(percentSpan);

            const barBg = document.createElement('div');
            barBg.className = 'gas-progress-bar-bg';

            const barFill = document.createElement('div');
            barFill.className = 'gas-progress-bar-fill';
            barFill.id = 'gas-progress-fill';
            barBg.appendChild(barFill);

            const details = document.createElement('div');
            details.className = 'gas-progress-details';
            details.id = 'gas-progress-count';
            details.textContent = `0 of ${total}`;

            container.appendChild(header);
            container.appendChild(barBg);
            container.appendChild(details);

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
                let interval;

                const updateText = () => {
                    // Clear current content
                    while (toast.firstChild) {
                        toast.removeChild(toast.firstChild);
                    }

                    const iconSpan = document.createElement('span');
                    iconSpan.textContent = '⏳';

                    const msgSpan = document.createElement('span');
                    msgSpan.style.flex = '1';
                    msgSpan.textContent = `Starting deletion in ${remaining}s...`;

                    const cancelBtn = document.createElement('button');
                    cancelBtn.id = 'gas-undo-cancel';
                    Object.assign(cancelBtn.style, {
                        background: 'transparent',
                        border: '1px solid white',
                        color: 'white',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        cursor: 'pointer',
                        fontSize: '12px'
                    });
                    cancelBtn.textContent = 'CANCEL';

                    cancelBtn.addEventListener('click', handleCancel);

                    toast.appendChild(iconSpan);
                    toast.appendChild(msgSpan);
                    toast.appendChild(cancelBtn);
                };

                const handleCancel = () => {
                    clearInterval(interval);
                    toast.classList.remove('visible');
                    setTimeout(() => toast.remove(), 300);
                    resolve(false); // Cancelled
                };

                updateText();
                container.appendChild(toast);

                // Trigger reflow
                toast.offsetHeight;
                toast.classList.add('visible');

                interval = setInterval(() => {
                    remaining--;
                    if (remaining <= 0) {
                        clearInterval(interval);
                        toast.classList.remove('visible');
                        setTimeout(() => toast.remove(), 300);
                        resolve(true); // Timer finished
                    } else {
                        updateText();
                    }
                }, 1000);
            });
        }
    };

    // --- Configuration ---
    const aDELAY_BETWEEN_ACTIONS = 500;
    const aDELAY_AFTER_DELETION = 1500;

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    // --- Count Management ---
    function getCounts() {
        return {
            success: parseInt(sessionStorage.getItem(aBULK_DELETE_SUCCESS_KEY) || '0', 10),
            fail: parseInt(sessionStorage.getItem(aBULK_DELETE_FAIL_KEY) || '0', 10)
        };
    }

    function incrementSuccess() {
        const current = getCounts().success;
        sessionStorage.setItem(aBULK_DELETE_SUCCESS_KEY, (current + 1).toString());
    }

    function incrementFail() {
        const current = getCounts().fail;
        sessionStorage.setItem(aBULK_DELETE_FAIL_KEY, (current + 1).toString());
    }

    function resetCounts() {
        sessionStorage.setItem(aBULK_DELETE_SUCCESS_KEY, '0');
        sessionStorage.setItem(aBULK_DELETE_FAIL_KEY, '0');
    }

    function clearCounts() {
        sessionStorage.removeItem(aBULK_DELETE_SUCCESS_KEY);
        sessionStorage.removeItem(aBULK_DELETE_FAIL_KEY);
        sessionStorage.removeItem(aBULK_DELETE_TOTAL_KEY);
    }

    async function findAndClickByText(
        selector,
        textOptions,
        maxRetries = 5,
        retryInterval = 250
    ) {
        for (let i = 0; i < maxRetries; i++) {
            const elements = document.querySelectorAll(selector);
            for (const element of elements) {
                const elementText = element.textContent.trim().toLowerCase();
                const found = textOptions.some(text =>
                    elementText.includes(text.toLowerCase())
                );
                if (found) {
                    element.click();
                    return true;
                }
            }
            await sleep(retryInterval);
        }
        console.error(
            `Could not find element with selector "${selector}" ` +
            `and text from [${textOptions.join(', ')}]`
        );
        return false;
    }

    /**
     * Processes a batch of deletions (all visible items) and then reloads.
     */
    async function processBatchDeletion(items) {
        isProcessing = true;

        if (uiElements.allBtn) uiElements.allBtn.disabled = true;
        if (uiElements.selBtn) uiElements.selBtn.disabled = true;
        if (uiElements.stopBtn) uiElements.stopBtn.style.display = 'inline-flex';

        for (let i = 0; i < items.length; i++) {
            if (isStopRequested) {
                sessionStorage.removeItem(aBULK_DELETE_ALL_KEY);
                clearCounts();
                UI.showToast("Bulk delete process stopped by user.", 'warning');
                isProcessing = false;
                break;
            }

            const item = items[i];
            if (!document.body.contains(item)) continue;

            const counts = getCounts();
            const totalProcessed = counts.success + counts.fail + 1;
            const total = parseInt(sessionStorage.getItem(aBULK_DELETE_TOTAL_KEY) || '0');

            // const progressHTML =
            //    `<span style="font-size: 1.2em;">🔥</span> <span>Deleting... (${totalProcessed})</span>`;

            if (uiElements.allBtn) {
                // uiElements.allBtn.innerHTML = progressHTML;
                // Safe DOM update
                while (uiElements.allBtn.firstChild) uiElements.allBtn.removeChild(uiElements.allBtn.firstChild);
                const icon = document.createElement('span');
                icon.style.fontSize = '1.2em';
                icon.textContent = '🔥';
                const text = document.createElement('span');
                text.textContent = `Deleting... (${totalProcessed})`;
                uiElements.allBtn.appendChild(icon);
                uiElements.allBtn.appendChild(text);
            }

            // Update Progress Bar
            UI.updateProgress(totalProcessed, total, `Deleting ${totalProcessed} of ${total}...`);

            try {
                item.click();
                await sleep(aDELAY_BETWEEN_ACTIONS);

                const delMenu = await findAndClickByText(
                    'button[role="menuitem"]',
                    ['Delete']
                );
                if (!delMenu) {
                    document.querySelector('.cdk-overlay-backdrop')?.click();
                    incrementFail();
                    continue;
                }
                await sleep(aDELAY_BETWEEN_ACTIONS);

                const delConfirm = await findAndClickByText(
                    '.mat-mdc-dialog-actions button',
                    ['Delete']
                );
                if (!delConfirm) {
                    document.querySelector('.cdk-overlay-backdrop')?.click();
                    incrementFail();
                    continue;
                }

                incrementSuccess();
                await sleep(aDELAY_AFTER_DELETION);
            } catch (e) {
                console.error("Error deleting item:", e);
                incrementFail();
            }
        }

        if (!isStopRequested) {
            location.reload();
        } else {
            if (uiElements.allBtn) {
                uiElements.allBtn.disabled = false;
                // uiElements.allBtn.innerHTML =
                //    `<span style="font-size: 1.2em;">🔥</span> <span>Delete All</span>`;
                // Safe DOM update
                while (uiElements.allBtn.firstChild) uiElements.allBtn.removeChild(uiElements.allBtn.firstChild);
                const icon = document.createElement('span');
                icon.style.fontSize = '1.2em';
                icon.textContent = '🔥';
                const text = document.createElement('span');
                text.textContent = 'Delete All';
                uiElements.allBtn.appendChild(icon);
                uiElements.allBtn.appendChild(text);
            }
            if (uiElements.selBtn) uiElements.selBtn.disabled = false;
            if (uiElements.stopBtn) uiElements.stopBtn.style.display = 'none';
            isProcessing = false;
        }
    }


    /**
     * Deletes a single item and triggers a page reload.
     */
    async function deleteSingleItemAndReload(itemMenuButton, onComplete) {
        isProcessing = true;
        if (!document.body.contains(itemMenuButton)) {
            incrementFail();
            isProcessing = false;
            return;
        }

        try {
            itemMenuButton.click();
            await sleep(aDELAY_BETWEEN_ACTIONS);

            const delMenu = await findAndClickByText(
                'button[role="menuitem"]',
                ['Delete']
            );
            if (!delMenu) {
                document.querySelector('.cdk-overlay-backdrop')?.click();
                incrementFail();
                isProcessing = false;
                return;
            }
            await sleep(aDELAY_BETWEEN_ACTIONS);

            const delConfirm = await findAndClickByText(
                '.mat-mdc-dialog-actions button',
                ['Delete']
            );
            if (!delConfirm) {
                document.querySelector('.cdk-overlay-backdrop')?.click();
                incrementFail();
                isProcessing = false;
                return;
            }

            incrementSuccess();

            // Update Progress Bar
            const counts = getCounts();
            const total = parseInt(sessionStorage.getItem(aBULK_DELETE_TOTAL_KEY) || '0');
            const current = counts.success + counts.fail;
            UI.updateProgress(current, total, `Deleting ${current} of ${total}...`);

            await sleep(aDELAY_AFTER_DELETION);

            if (onComplete) onComplete();
            if (!isStopRequested) location.reload();
        } catch (e) {
            console.error("Error deleting single item:", e);
            incrementFail();

            // Update Progress Bar on failure too
            const counts = getCounts();
            const total = parseInt(sessionStorage.getItem(aBULK_DELETE_TOTAL_KEY) || '0');
            const current = counts.success + counts.fail;
            UI.updateProgress(current, total, `Error on item ${current}...`);

            if (onComplete) onComplete(); // Proceed anyway
            if (!isStopRequested) location.reload();
        }
        isProcessing = false;
    }

    /**
     * Starts the 'Bulk Delete All' process.
     */
    async function startBulkDeleteAll(isAutoStart = false) {
        const query = 'ms-prompt-options-menu button[aria-label="More options"]';
        const items = document.querySelectorAll(query);

        if (items.length === 0) {
            sessionStorage.removeItem(aBULK_DELETE_ALL_KEY);
            const counts = getCounts();
            clearCounts();

            if (counts.success > 0 || counts.fail > 0) {
                UI.showToast(`Bulk delete complete. Deleted: ${counts.success}, Failed: ${counts.fail}`, 'success', 5000);
            } else {
                UI.showToast("Bulk delete complete. Your library is now empty.", 'success', 5000);
            }
            isProcessing = false;
            return;
        }

        if (!isAutoStart) {
            const confirmMsg =
                "This will bulk-delete ALL items in your history.\n\n" +
                "It will delete items in batches of 5, reload the page, and " +
                "continue until finished.\n\nAre you sure you want to proceed?";

            const userConfirmation = await UI.showConfirm(
                "Delete All Chats?",
                confirmMsg,
                "Delete All",
                "danger"
            );
            if (!userConfirmation) return;

            await sleep(250); // Give modal time to close

            // Undo Timer
            const proceed = await UI.showUndoToast(5);
            if (!proceed) {
                UI.showToast("Deletion Cancelled.", 'info');
                return;
            }

            await sleep(250); // Give toast time to start closing if needed

            sessionStorage.setItem(aBULK_DELETE_ALL_KEY, 'true');
            resetCounts();

            // Initial Total Set
            sessionStorage.setItem(aBULK_DELETE_TOTAL_KEY, items.length.toString());
            UI.showProgress("Starting deletion...", items.length);
        } else {
            // Auto-start (after reload)
            // Update total to include new items found
            const storedTotal = parseInt(sessionStorage.getItem(aBULK_DELETE_TOTAL_KEY) || '0');
            const newTotal = storedTotal + items.length;
            sessionStorage.setItem(aBULK_DELETE_TOTAL_KEY, newTotal.toString());

            const counts = getCounts();
            UI.showProgress("Resuming deletion...", newTotal);
            UI.updateProgress(counts.success + counts.fail, newTotal);
        }

        processBatchDeletion(Array.from(items));
    }

    /**
     * Starts the 'Bulk Delete Selected' process.
     */
    async function startBulkDeleteSelected() {
        sessionStorage.removeItem(aBULK_DELETE_ALL_KEY); // Safety clear

        const selector = '.bulk-delete-checkbox:checked';
        const selectedCheckboxes = document.querySelectorAll(selector);
        if (selectedCheckboxes.length === 0) {
            UI.showToast("No chat(s) selected for deletion.", 'warning');
            return;
        }

        const confirmMsg = `Are you sure you want to delete the ${selectedCheckboxes.length} selected chat(s)?`;
        const userConfirmation = await UI.showConfirm(
            "Delete Selected Chat(s)?",
            confirmMsg,
            "Delete Selected",
            "danger"
        );
        if (!userConfirmation) return;

        // Undo Timer
        const proceed = await UI.showUndoToast(5);
        if (!proceed) {
            UI.showToast("Deletion Cancelled.", 'info');
            return;
        }


        const itemHrefs = Array.from(selectedCheckboxes).map(cb => {
            const link = cb.closest('tr').querySelector('a.name-btn');
            return link ? link.getAttribute('href') : null;
        }).filter(Boolean);

        console.log('[GAS Bulk Delete] Selected hrefs:', itemHrefs);

        const key = aBULK_DELETE_SELECTED_KEY;
        sessionStorage.setItem(key, JSON.stringify(itemHrefs));

        // Set Total for Selected
        sessionStorage.setItem(aBULK_DELETE_TOTAL_KEY, itemHrefs.length.toString());

        resetCounts();
        location.reload(); // Start the process
    }

    function addCheckboxesToRows() {
        // Only run if we are on the library page (relaxed check)
        // if (!location.href.includes('/library')) return;

        const rows = document.querySelectorAll('tbody tr[mat-row]');
        rows.forEach(row => {
            if (row.querySelector('.bulk-delete-checkbox-cell')) return;

            const checkboxCell = document.createElement('td');
            checkboxCell.className = 'mat-mdc-cell mdc-data-table__cell cdk-cell bulk-delete-checkbox-cell';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'bulk-delete-checkbox';
            Object.assign(checkbox.style, {
                width: '18px',
                height: '18px',
                cursor: 'pointer'
            });
            checkboxCell.appendChild(checkbox);
            row.prepend(checkboxCell);

            // Range Selection Logic
            checkbox.addEventListener('click', (e) => {
                if (e.shiftKey && lastCheckedCheckbox && lastCheckedCheckbox !== checkbox) {
                    const allCheckboxes = Array.from(document.querySelectorAll('.bulk-delete-checkbox'));
                    const start = allCheckboxes.indexOf(lastCheckedCheckbox);
                    const end = allCheckboxes.indexOf(checkbox);

                    if (start !== -1 && end !== -1) {
                        const low = Math.min(start, end);
                        const high = Math.max(start, end);

                        for (let i = low; i <= high; i++) {
                            allCheckboxes[i].checked = lastCheckedCheckbox.checked;
                        }
                    }
                }
                lastCheckedCheckbox = checkbox;
                updateButtonState();
            });
        });

        const headerRow = document.querySelector('thead tr');
        if (!headerRow) return;

        const headerExists = headerRow.querySelector('.bulk-delete-header-cell');
        if (headerExists) return;

        const th = document.createElement('th');
        th.className = 'mat-mdc-header-cell mdc-data-table__header-cell cdk-header-cell bulk-delete-header-cell';

        const masterCheckbox = document.createElement('input');
        masterCheckbox.type = 'checkbox';
        masterCheckbox.id = 'master-bulk-delete-checkbox';
        Object.assign(masterCheckbox.style, {
            width: '18px',
            height: '18px',
            cursor: 'pointer'
        });

        masterCheckbox.addEventListener('change', (event) => {
            const isChecked = event.target.checked;
            const allCheckboxes = document.querySelectorAll(
                'input.bulk-delete-checkbox'
            );
            allCheckboxes.forEach(checkbox => {
                checkbox.checked = isChecked;
            });
            updateButtonState();
        });

        th.appendChild(masterCheckbox);
        headerRow.prepend(th);
    }


    function addButtons() {
        // Only run if we are on the library page (relaxed check)
        // if (!location.href.includes('/library')) return;

        // If buttons exist, update references and return
        const existingAll = document.getElementById('bulk-delete-all-button');
        if (existingAll) {
            uiElements.allBtn = existingAll;
            uiElements.selBtn = document.getElementById('bulk-delete-selected-button');
            uiElements.stopBtn = document.getElementById('stop-bulk-delete-button');
            return;
        }

        // Strategy: Look for the "Open in Drive" button or the search bar container
        // Based on browser inspection, the header structure is different.
        // We'll look for the element containing the "Open in Drive" button.
        let wrapper = null;

        // Try to find the "Open in Drive" button's parent
        const driveBtn = document.querySelector('a[href*="drive.google.com"]');
        if (driveBtn) {
            wrapper = driveBtn.parentElement;
        }

        // Fallback: Try finding the search bar and inserting before it
        if (!wrapper) {
            const searchBar = document.querySelector('ms-library-search-bar');
            if (searchBar) {
                wrapper = searchBar.parentElement;
            }
        }

        // Fallback: Try the header title
        if (!wrapper) {
            const title = document.querySelector('.lib-header-title');
            if (title) {
                // Go up to the header container
                wrapper = title.closest('.lib-header');
            }
        }

        if (!wrapper) return;

        // Common button styles
        const btnClass = 'mat-mdc-unelevated-button mdc-unelevated-button mat-mdc-button-base';
        const commonStyle = {
            margin: '0 8px',
            height: '36px',
            borderRadius: '18px',
            padding: '0 16px',
            fontSize: '14px',
            fontWeight: '500',
            textTransform: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
            cursor: 'pointer',
            transition: 'background-color 0.2s, box-shadow 0.2s',
            color: 'white',
            boxShadow: 'none',
            border: 'none',
            verticalAlign: 'middle'
        };

        // --- Delete All Button ---
        const bulkDeleteAllButton = document.createElement('button');
        bulkDeleteAllButton.id = 'bulk-delete-all-button';
        bulkDeleteAllButton.setAttribute('ms-button', '');
        bulkDeleteAllButton.className = btnClass;
        Object.assign(bulkDeleteAllButton.style, {
            ...commonStyle,
            backgroundColor: '#d93025', // Google Red override
            // display: 'none' // Removed to make visible by default
        });

        // Safe DOM update for All button content
        const allIcon = document.createElement('span');
        allIcon.style.fontSize = '1.2em';
        allIcon.textContent = '🔥';
        const allText = document.createElement('span');
        allText.textContent = 'Delete All';
        bulkDeleteAllButton.appendChild(allIcon);
        bulkDeleteAllButton.appendChild(allText);

        // bulkDeleteAllButton.onclick = () => startBulkDeleteAll(false); // Handled by addEventListener below

        // --- Delete Selected Button ---
        const bulkDeleteSelectedButton = document.createElement('button');
        bulkDeleteSelectedButton.id = 'bulk-delete-selected-button';
        bulkDeleteSelectedButton.setAttribute('ms-button', '');
        bulkDeleteSelectedButton.className = btnClass;
        Object.assign(bulkDeleteSelectedButton.style, {
            ...commonStyle,
            backgroundColor: '#e37400', // Google Orange/Warning override
            // display: 'none' // Removed to make visible by default
        });

        // Safe DOM update for Selected button content
        const selIcon = document.createElement('span');
        selIcon.style.fontSize = '1.2em';
        selIcon.textContent = '🗑️';
        const selText = document.createElement('span');
        selText.textContent = 'Delete Selected';
        bulkDeleteSelectedButton.appendChild(selIcon);
        bulkDeleteSelectedButton.appendChild(selText);

        // bulkDeleteSelectedButton.onclick = () => startBulkDeleteSelected(); // Handled by addEventListener below

        // --- Stop Button ---
        const stopButton = document.createElement('button');
        stopButton.id = 'stop-bulk-delete-button';
        stopButton.setAttribute('ms-button', '');
        stopButton.className = btnClass;
        Object.assign(stopButton.style, {
            ...commonStyle,
            backgroundColor: '#f4b400', // Google Yellow
            color: '#202124', // Dark text for contrast
            display: 'none' // Hidden by default
        });

        // Safe DOM update for Stop button content
        const stopIcon = document.createElement('span');
        stopIcon.style.fontSize = '1.2em';
        stopIcon.textContent = '🛑';
        const stopText = document.createElement('span');
        stopText.textContent = 'Stop';
        stopButton.appendChild(stopIcon);
        stopButton.appendChild(stopText);

        // stopButton.onclick = ... // Handled by addEventListener below

        // Store references
        uiElements.allBtn = bulkDeleteAllButton;
        uiElements.selBtn = bulkDeleteSelectedButton;
        uiElements.stopBtn = stopButton;

        // Inject
        // If we found the drive button, append after it to keep layout clean
        if (driveBtn && wrapper === driveBtn.parentElement) {
            // Create a container to hold our buttons so they stay together
            const container = document.createElement('div');
            container.style.display = 'flex';
            container.style.alignItems = 'center';

            container.appendChild(bulkDeleteAllButton);
            container.appendChild(bulkDeleteSelectedButton);
            container.appendChild(stopButton);

            wrapper.insertBefore(container, driveBtn.nextSibling);
        } else {
            wrapper.appendChild(bulkDeleteAllButton);
            wrapper.appendChild(bulkDeleteSelectedButton);
            wrapper.appendChild(stopButton);
        }

        // --- Hover Effects ---
        // Native buttons typically have a state overlay.
        // We simulate this simply by dimming slightly on hover.
        const addHover = (btn) => {
            btn.addEventListener('mouseenter', () => btn.style.filter = 'brightness(0.95)');
            btn.addEventListener('mouseleave', () => btn.style.filter = 'brightness(1)');
        };
        addHover(bulkDeleteAllButton);
        addHover(bulkDeleteSelectedButton);
        addHover(stopButton);
        addHover(stopButton);


        // --- Event Listeners ---
        stopButton.addEventListener('click', () => {
            isStopRequested = true;
            sessionStorage.removeItem(aBULK_DELETE_ALL_KEY);
            sessionStorage.removeItem(aBULK_DELETE_SELECTED_KEY);
            clearCounts();
            stopButton.disabled = true;

            // Safe DOM update for Stop button text
            while (stopButton.firstChild) stopButton.removeChild(stopButton.firstChild);
            const stopIcon = document.createElement('span');
            stopIcon.style.fontSize = '1.2em';
            stopIcon.textContent = '🛑';
            const stopText = document.createElement('span');
            stopText.textContent = 'Stopping...';
            stopButton.appendChild(stopIcon);
            stopButton.appendChild(stopText);

            UI.showToast(
                "Bulk delete will stop. The page will not reload after the current action.",
                'info',
                5000
            );
        });

        bulkDeleteAllButton.addEventListener('click', () =>
            startBulkDeleteAll(false)
        );
        bulkDeleteSelectedButton.addEventListener('click', () =>
            startBulkDeleteSelected()
        );

        // Append to DOM
        wrapper.appendChild(bulkDeleteSelectedButton);
        wrapper.appendChild(bulkDeleteAllButton);
        wrapper.appendChild(stopButton);

        // Update Global Refs
        uiElements.allBtn = bulkDeleteAllButton;
        uiElements.selBtn = bulkDeleteSelectedButton;
        uiElements.stopBtn = stopButton;

        // If we are processing (e.g. after a re-render), restore UI state
        if (isProcessing) {
            bulkDeleteAllButton.disabled = true;
            bulkDeleteSelectedButton.disabled = true;
            stopButton.style.display = 'inline-flex';
            // Note: innerHTML for progress is updated by the running loop
        } else {
            updateButtonState(); // Set initial state
        }

        setTimeout(() => handleAutoDeletion(), 2000);
    }

    /**
     * Checks session storage on page load and continues any pending
     * deletion process.
     */
    function handleAutoDeletion() {
        console.log('[GAS Bulk Delete] handleAutoDeletion called');
        if (isProcessing) {
            console.log('[GAS Bulk Delete] Already processing, returning');
            return; // Already running
        }

        if (sessionStorage.getItem(aBULK_DELETE_ALL_KEY) === 'true') {
            console.log('[GAS Bulk Delete] Starting bulk delete all');
            startBulkDeleteAll(true);

        } else if (sessionStorage.getItem(aBULK_DELETE_SELECTED_KEY)) {
            console.log('[GAS Bulk Delete] Found selected deletion in progress');
            const key = aBULK_DELETE_SELECTED_KEY;
            let itemHrefs = JSON.parse(sessionStorage.getItem(key));
            console.log('[GAS Bulk Delete] ItemHrefs from storage:', itemHrefs);

            if (itemHrefs.length > 0) {
                // Update UI for selected deletion
                if (uiElements.allBtn) uiElements.allBtn.disabled = true;
                if (uiElements.selBtn) uiElements.selBtn.disabled = true;
                if (uiElements.stopBtn) uiElements.stopBtn.style.display = 'inline-flex';

                // Show Progress Bar
                const total = parseInt(sessionStorage.getItem(aBULK_DELETE_TOTAL_KEY) || itemHrefs.length.toString());
                const counts = getCounts();
                const current = counts.success + counts.fail;
                UI.showProgress("Deleting selected...", total);
                UI.updateProgress(current, total);

                const nextHref = itemHrefs[0];
                console.log('[GAS Bulk Delete] Looking for href:', nextHref);
                const linkSelector = `a.name-btn[href="${nextHref}"]`;
                console.log('[GAS Bulk Delete] Using selector:', linkSelector);
                const nextLink = document.querySelector(linkSelector);
                console.log('[GAS Bulk Delete] Found link:', nextLink);

                if (nextLink) {
                    // Safe DOM update for Selected button progress
                    if (uiElements.selBtn) {
                        while (uiElements.selBtn.firstChild) uiElements.selBtn.removeChild(uiElements.selBtn.firstChild);
                        const icon = document.createElement('span');
                        icon.style.fontSize = '1.2em';
                        icon.textContent = '🗑️';
                        const text = document.createElement('span');
                        text.textContent = `Deleting ${itemHrefs.length} selected...`;
                        uiElements.selBtn.appendChild(icon);
                        uiElements.selBtn.appendChild(text);
                    }

                    const itemMenu = nextLink.closest('tr')
                        .querySelector('ms-prompt-options-menu button');
                    console.log('[GAS Bulk Delete] Found menu button:', itemMenu);

                    deleteSingleItemAndReload(itemMenu, () => {
                        itemHrefs.shift(); // Remove processed item
                        // Always save the array, even if empty, so we detect "finished" state on next load
                        sessionStorage.setItem(key, JSON.stringify(itemHrefs));
                    });
                } else {
                    console.warn(
                        `Item with href ${nextHref} not found. Checking next...`
                    );
                    itemHrefs.shift();
                    sessionStorage.setItem(key, JSON.stringify(itemHrefs));
                    incrementFail();
                    location.reload();
                }
            } else {
                // List is empty, meaning we finished
                sessionStorage.removeItem(key);
                const counts = getCounts();
                clearCounts();
                UI.hideProgress();
                UI.showToast(`Selected chat(s) have been deleted. Deleted: ${counts.success}, Failed: ${counts.fail}`, 'success', 5000);

                if (uiElements.allBtn) uiElements.allBtn.disabled = false;
                if (uiElements.selBtn) {
                    uiElements.selBtn.disabled = false;
                    updateButtonState(); // Reset text
                }
                if (uiElements.stopBtn) uiElements.stopBtn.style.display = 'none';
            }
        }
    }

    function updateButtonState() {
        const selectedCount = document.querySelectorAll('.bulk-delete-checkbox:checked').length;
        const btn = uiElements.selBtn;

        if (btn) {
            // Clear current content
            while (btn.firstChild) btn.removeChild(btn.firstChild);

            const icon = document.createElement('span');
            icon.style.fontSize = '1.2em';
            icon.textContent = '🗑️';

            const text = document.createElement('span');

            if (selectedCount > 0) {
                btn.disabled = false;
                text.textContent = `Delete Selected (${selectedCount})`;
            } else {
                btn.disabled = true;
                text.textContent = 'Delete Selected';
            }

            btn.appendChild(icon);
            btn.appendChild(text);
        }
    }

    function manageUI() {
        // If we are on the library page, attempt to inject UI
        // Relaxed check: just look for the table or header
        const libraryTable = document.querySelector('ms-library-table') || document.querySelector('.library-table');
        if (libraryTable || location.href.includes('/library')) {
            addButtons();
            addCheckboxesToRows();
        }
    }

    // --- Observer Setup ---
    const observer = new MutationObserver((mutations) => {
        manageUI();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // --- Fallback Interval ---
    setInterval(() => {
        manageUI();
    }, 1000);

    // Initial Run
    manageUI();

})();