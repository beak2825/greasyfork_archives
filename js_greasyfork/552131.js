// ==UserScript==
// @name         WTR-Lab Library Auto-Sorter by Progress
// @namespace    https://greasyfork.org/en/users/1433142-masuriii
// @version      2.6
// @description  Automatically loads all items and sorts your WTR-Lab library by reading progress. Sort order and logging are configurable in the menu.
// @author       MasuRii
// @match        https://wtr-lab.com/en/library*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wtr-lab.com
// @license      MIT
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/552131/WTR-Lab%20Library%20Auto-Sorter%20by%20Progress.user.js
// @updateURL https://update.greasyfork.org/scripts/552131/WTR-Lab%20Library%20Auto-Sorter%20by%20Progress.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION ---
    const SORT_ORDER_KEY = 'wtr_lab_sorter_order';
    const LOGGING_KEY = 'wtr_lab_sorter_logging'; // Key for storing logging preference
    const ASC = 'ascending';
    const DESC = 'descending';
    const DEFAULT_SORT_ORDER = ASC;
    const PROCESSED_MARKER = 'data-sorter-processed';

    // --- HELPER FUNCTIONS ---
    async function debugLog(...messages) {
        const loggingEnabled = await GM_getValue(LOGGING_KEY, false); // Default to false (disabled)
        if (loggingEnabled) {
            console.log('[WTR-Lab Sorter]:', ...messages);
        }
    }

    function getProgressPercent(item) {
        const progressSpan = item.querySelector('.progress .progress-bar span');
        if (progressSpan) {
            const text = progressSpan.textContent.trim().replace('%', '');
            const percent = parseFloat(text);
            return isNaN(percent) ? 0 : percent;
        }
        return 0;
    }

    // --- CORE LOGIC ---

    /**
     * Registers menu commands in Tampermonkey.
     */
    async function registerMenu() {
        // --- Sort Order Menu ---
        const currentOrder = await GM_getValue(SORT_ORDER_KEY, DEFAULT_SORT_ORDER);
        const setOrder = async (order) => {
            await GM_setValue(SORT_ORDER_KEY, order);
            alert(`Sort order set to ${order}. Reloading page to apply changes.`);
            location.reload();
        };

        let ascLabel = "Sort Ascending (Lowest First)";
        if (currentOrder === ASC) ascLabel = "✅ " + ascLabel;

        let descLabel = "Sort Descending (Highest First)";
        if (currentOrder === DESC) descLabel = "✅ " + descLabel;

        GM_registerMenuCommand(ascLabel, () => setOrder(ASC));
        GM_registerMenuCommand(descLabel, () => setOrder(DESC));

        // --- Logging Toggle Menu ---
        const loggingEnabled = await GM_getValue(LOGGING_KEY, false);
        const loggingLabel = `Toggle Logging (Currently: ${loggingEnabled ? 'Enabled' : 'Disabled'})`;
        GM_registerMenuCommand(loggingLabel, async () => {
            const newValue = !loggingEnabled;
            await GM_setValue(LOGGING_KEY, newValue);
            alert(`Logging has been ${newValue ? 'Enabled' : 'Disabled'}. Reloading page.`);
            location.reload();
        });
    }

    /**
     * Finds and clicks the "Load More" button repeatedly until it disappears.
     */
    async function clickLoadMoreUntilDone(rootContainer) {
        const loadMoreSelector = '.load-more button';
        const waitTime = 1000;

        while (true) {
            const loadMoreButton = rootContainer.querySelector(loadMoreSelector);
            if (!loadMoreButton || loadMoreButton.disabled) {
                debugLog('"Load More" button not found or is disabled. Assuming all items are loaded.');
                break;
            }

            debugLog('Found "Load More" button. Clicking...');
            loadMoreButton.click();
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
    }

    /**
     * Sorts the library items based on the saved sort order.
     */
    async function sortLibrary(rootContainer) {
        debugLog('Attempting to sort library items...');
        const sortOrder = await GM_getValue(SORT_ORDER_KEY, DEFAULT_SORT_ORDER);
        debugLog(`Current sort order: ${sortOrder}`);

        const items = Array.from(rootContainer.querySelectorAll('.serie-item'));
        if (items.length === 0) {
            debugLog('No items found to sort.');
            return;
        }

        const actualContainer = items[0].parentNode;
        debugLog(`Found ${items.length} items to sort.`);

        items.sort((a, b) => {
            const percentA = getProgressPercent(a);
            const percentB = getProgressPercent(b);
            return sortOrder === DESC ? percentB - percentA : percentA - percentB;
        });

        debugLog('Sorting complete. Re-appending items to the DOM.');
        items.forEach(item => actualContainer.appendChild(item));
    }

    /**
     * The main execution flow, called for a specific library container.
     */
    async function runMainLogic(rootContainer) {
        debugLog('Main logic triggered for container:', rootContainer);
        await debugLog('Starting "Load More" process...');
        await clickLoadMoreUntilDone(rootContainer);
        await debugLog('Starting sorting process...');
        await sortLibrary(rootContainer);
        await debugLog('Script finished for this container.');
    }

    /**
     * Initializes the script, setting up the menu and the master observer.
     */
    function initialize() {
        debugLog('Script initializing...');
        registerMenu();

        debugLog('Setting up master observer on document body.');
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type !== 'childList') continue;

                for (const node of mutation.addedNodes) {
                    if (node.nodeType !== Node.ELEMENT_NODE) continue;

                    const serieItem = node.matches('.serie-item') ? node : node.querySelector('.serie-item');
                    if (serieItem) {
                        const container = serieItem.closest('.library-list');
                        if (container && !container.hasAttribute(PROCESSED_MARKER)) {
                            debugLog('New library content detected in container:', container);
                            container.setAttribute(PROCESSED_MARKER, 'true');
                            runMainLogic(container);
                            return;
                        }
                    }
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        const initialContainer = document.querySelector(`.library-list:not([${PROCESSED_MARKER}])`);
        if (initialContainer && initialContainer.querySelector('.serie-item')) {
             debugLog('Initial library content found on page load.');
             initialContainer.setAttribute(PROCESSED_MARKER, 'true');
             runMainLogic(initialContainer);
        }
    }

    // --- SCRIPT KICK-OFF ---
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();