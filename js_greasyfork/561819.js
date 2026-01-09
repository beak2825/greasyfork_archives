/*
 * File: notebooklm-easy-use.js
 * Project: browser-scripts
 * Created: 2025-01-08
 * Author: Victor Cheng
 * Email: hi@victor42.work
 * Description: Automatically batch update Google Drive sources in NotebookLM
 */

// ==UserScript==
// @name         NotebookLM easy use
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Automatically batch update Google Drive sources (Docs/Sheets/Slides) in NotebookLM. 自动批量更新 NotebookLM 中的 Google Drive 资料（文档/表格/幻灯片）。
// @author       Victor Cheng
// @match        https://notebooklm.google.com/notebook/*
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561819/NotebookLM%20easy%20use.user.js
// @updateURL https://update.greasyfork.org/scripts/561819/NotebookLM%20easy%20use.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //=======================================
    // Configuration
    //=======================================
    const CONFIG = {
        PAGE_LOAD_DELAY: 1500,        // Wait for Angular rendering after navigation
        POLL_INTERVAL: 1000,          // Interval for checking element state changes
        OPERATION_TIMEOUT: 10000,     // Maximum wait for any operation
        MAX_RETRY_ATTEMPTS: 5,        // Maximum attempts for polling operations
        HIGHLIGHT_DURATION: 1000,     // How long to show element highlights
        BETWEEN_ITEMS_DELAY: 300,     // Delay between processing multiple items
        DEBUG_MODE: true,             // Show visual debugging info
    };

    const SELECTORS = {
        SOURCE_CONTAINER: '.single-source-container',
        SOURCE_ICON: 'mat-icon.source-item-source-icon',
        SOURCE_TITLE: '.source-title-column',
        DETAIL_CONTAINER: '.source-panel',
        SYNC_BUTTON: '.source-refresh',
        SYNC_SUCCESS: '.source-refresh--success',
        BACK_BUTTON: '.source-panel .panel-header button',
    };

    const GOOGLE_DRIVE_ICONS = ['article', 'drive_spreadsheet', 'drive_presentation'];

    const ICON_TYPE_NAMES = {
        'article': 'Docs',
        'drive_spreadsheet': 'Sheets',
        'drive_presentation': 'Slides'
    };

    const SYNC_RESULT = {
        UPDATED: 'updated',
        SKIPPED: 'skipped',
        FAILED: 'failed'
    };

    //=======================================
    // State Management
    //=======================================
    let isRunning = false;

    //=======================================
    // Utility Functions
    //=======================================
    function log(message, ...args) {
        console.log(`[NotebookLM easy use] ${message}`, ...args);
    }

    function logWarn(message, ...args) {
        console.warn(`[NotebookLM easy use] ${message}`, ...args);
    }

    function logError(message, ...args) {
        console.error(`[NotebookLM easy use] ${message}`, ...args);
    }

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function waitForElement(selector, timeout = CONFIG.OPERATION_TIMEOUT) {
        return new Promise((resolve) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }

            const observer = new MutationObserver(() => {
                const element = document.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });

            setTimeout(() => {
                observer.disconnect();
                resolve(null);
            }, timeout);
        });
    }

    function clickElement(element) {
        // Focus first
        element.focus();

        // Trigger multiple events to simulate real click
        element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
        element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
        element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

        // Also try keyboard Enter
        element.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Enter', keyCode: 13 }));
    }

    function highlightElement(element, duration) {
        if (!CONFIG.DEBUG_MODE) return;

        const originalBoxShadow = element.style.boxShadow;

        element.style.boxShadow = '0 0 0 4px rgba(255, 0, 0, 0.5), 0 0 0 2px rgba(255, 0, 0, 0.8)';
        element.style.transition = 'box-shadow 0.3s';

        setTimeout(() => {
            element.style.boxShadow = originalBoxShadow;
        }, duration);
    }

    function isOnSourceListPage() {
        return document.querySelectorAll(SELECTORS.SOURCE_CONTAINER).length > 0;
    }

    //=======================================
    // Core Functions - Data Extraction
    //=======================================
    function getGoogleDriveSources() {
        const containers = document.querySelectorAll(SELECTORS.SOURCE_CONTAINER);
        const driveSources = [];

        containers.forEach((container, index) => {
            const icon = container.querySelector(SELECTORS.SOURCE_ICON);
            const iconText = icon?.textContent?.trim();

            if (GOOGLE_DRIVE_ICONS.includes(iconText)) {
                const titleElement = container.querySelector(SELECTORS.SOURCE_TITLE);
                driveSources.push({
                    originalIndex: index,              // 在列表中的原始位置
                    title: titleElement?.textContent?.trim() || 'Untitled',
                    type: ICON_TYPE_NAMES[iconText] || 'Unknown'
                });
            }
        });

        return driveSources;
    }

    //=======================================
    // Core Functions - Navigation
    //=======================================
    async function goBack() {
        const backButton = document.querySelector(SELECTORS.BACK_BUTTON);
        if (backButton) {
            if (CONFIG.DEBUG_MODE) {
                highlightElement(backButton, CONFIG.HIGHLIGHT_DURATION);
                await wait(CONFIG.HIGHLIGHT_DURATION);
            }
            backButton.click();
            await wait(CONFIG.POLL_INTERVAL);
        }
    }

    //=======================================
    // Core Functions - Sync Operations
    //=======================================
    function findSourceByIndex(originalIndex) {
        const allContainers = document.querySelectorAll(SELECTORS.SOURCE_CONTAINER);
        if (originalIndex < allContainers.length) {
            const container = allContainers[originalIndex];
            const titleElement = container.querySelector(SELECTORS.SOURCE_TITLE);
            return { container, titleElement };
        }
        return null;
    }

    async function openSourceDetail(container, titleElement, sourceTitle) {
        highlightElement(container, CONFIG.HIGHLIGHT_DURATION);

        await wait(CONFIG.HIGHLIGHT_DURATION);

        const panelBefore = document.querySelector(SELECTORS.DETAIL_CONTAINER);
        const panelClassBefore = panelBefore ? panelBefore.className : 'no panel';

        clickElement(titleElement);

        await wait(CONFIG.PAGE_LOAD_DELAY);

        const panelAfter = document.querySelector(SELECTORS.DETAIL_CONTAINER);
        const panelClassAfter = panelAfter ? panelAfter.className : 'no panel';

        if (panelClassBefore === panelClassAfter) {
            logWarn('Click failed for: ' + sourceTitle);
            return null;
        }

        const detailPanel = await waitForElement(SELECTORS.DETAIL_CONTAINER);

        if (!detailPanel) {
            logWarn('Detail panel timeout');
            return null;
        }

        highlightElement(detailPanel, CONFIG.HIGHLIGHT_DURATION);
        await wait(CONFIG.PAGE_LOAD_DELAY);

        return detailPanel;
    }

    async function waitForSyncButton(detailPanel) {
        for (let i = 0; i < CONFIG.MAX_RETRY_ATTEMPTS; i++) {
            await wait(CONFIG.POLL_INTERVAL);
            const syncButton = detailPanel.querySelector(SELECTORS.SYNC_BUTTON);
            if (syncButton) {
                highlightElement(syncButton, CONFIG.HIGHLIGHT_DURATION);
                return syncButton;
            }
        }

        return null;
    }

    async function clickSyncButton(detailPanel) {
        await wait(CONFIG.PAGE_LOAD_DELAY);

        detailPanel.querySelector(SELECTORS.SYNC_BUTTON).click();
        log('Sync button clicked, waiting for confirmation...');

        for (let i = 0; i < CONFIG.MAX_RETRY_ATTEMPTS; i++) {
            await wait(CONFIG.POLL_INTERVAL);
            const successButton = detailPanel.querySelector(SELECTORS.SYNC_SUCCESS);
            if (successButton) {
                log('Sync confirmed');
                return true;
            }
        }

        logWarn('Sync failed - no confirmation');
        return false;
    }

    async function syncSource(source) {
        try {
            // Re-find elements by index after DOM might have changed
            const found = findSourceByIndex(source.originalIndex);
            if (!found) {
                logWarn(`Source not found: ${source.title}`);
                return SYNC_RESULT.FAILED;
            }

            const { container, titleElement } = found;
            const detailPanel = await openSourceDetail(container, titleElement, source.title);

            if (!detailPanel) {
                return SYNC_RESULT.SKIPPED;
            }

            const syncButton = await waitForSyncButton(detailPanel);

            if (!syncButton) {
                await goBack();
                return SYNC_RESULT.SKIPPED;
            }

            const success = await clickSyncButton(detailPanel);
            await wait(CONFIG.POLL_INTERVAL);

            await goBack();
            await waitForElement(SELECTORS.SOURCE_CONTAINER);

            return success ? SYNC_RESULT.UPDATED : SYNC_RESULT.FAILED;
        } catch (error) {
            logError('Error:', error);
            try {
                await goBack();
            } catch (e) {
                // Ignore
            }
            return SYNC_RESULT.FAILED;
        }
    }

    async function autoSync() {
        if (isRunning) {
            log('Already running');
            return;
        }

        isRunning = true;

        try {
            if (!isOnSourceListPage()) {
                const backButton = document.querySelector(SELECTORS.BACK_BUTTON);
                if (backButton) {
                    backButton.click();
                    await wait(CONFIG.PAGE_LOAD_DELAY);
                } else {
                    alert('[NotebookLM easy use] Error: Not on source list page. Please navigate manually.');
                    isRunning = false;
                    return;
                }

                if (!isOnSourceListPage()) {
                    alert('[NotebookLM easy use] Error: Still not on source list page. Please refresh.');
                    isRunning = false;
                    return;
                }
            }

            const sources = getGoogleDriveSources();

            if (sources.length === 0) {
                log('No sources found');
                return;
            }

            log(`Processing ${sources.length} sources...`);

            let updatedCount = 0;
            let skippedCount = 0;
            let failedCount = 0;

            for (let i = 0; i < sources.length; i++) {
                const source = sources[i];
                log(`[${i + 1}/${sources.length}] ${source.title}`);

                const result = await syncSource(source);

                if (result === SYNC_RESULT.UPDATED) {
                    updatedCount++;
                } else if (result === SYNC_RESULT.SKIPPED) {
                    skippedCount++;
                } else if (result === SYNC_RESULT.FAILED) {
                    failedCount++;
                }

                await wait(CONFIG.BETWEEN_ITEMS_DELAY);
            }

            log(`Done: ${updatedCount} updated, ${skippedCount} skipped, ${failedCount} failed`);
        } catch (error) {
            logError('Error:', error);
        } finally {
            isRunning = false;
        }
    }

    //=======================================
    // UI Components
    //=======================================
    function addManualButton() {
        if (document.getElementById('nlm-auto-sync-btn')) {
            return;
        }

        const button = document.createElement('button');
        button.id = 'nlm-auto-sync-btn';
        button.textContent = '🔄 Sync docs/sheets/slides';
        button.style.cssText = `
            position: fixed;
            left: 110px;
            top: 79px;
            z-index: 10000;
            padding: 0;
            background: transparent;
            color: #1a73e8;
            border: none;
            cursor: pointer;
            font-size: 14px;
            font-family: Google Sans, arial, sans-serif;
            font-weight: 500;
            transition: color 0.2s;
        `;

        button.addEventListener('mouseenter', () => {
            button.style.color = '#1557b0';
        });

        button.addEventListener('mouseleave', () => {
            button.style.color = '#1a73e8';
        });

        button.addEventListener('click', () => {
            autoSync();
        });

        document.body.appendChild(button);
    }

    //=======================================
    // Initialization
    //=======================================
    function init() {
        setTimeout(() => {
            addManualButton();
        }, 1000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
