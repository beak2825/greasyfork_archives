// ==UserScript==
// @name         MWI Game Commands (Item/Wiki/Market)
// @namespace    mwi_game_commands
// @version      3.1.1
// @description  Adds /item, /wiki, and /market commands to chat for quick navigation
// @author       Mists
// @license      MIT
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @match        https://www.milkywayidlecn.com/*
// @grant        none
// @run-at       document-idle
// @require      https://cdn.jsdelivr.net/npm/lz-string@1.5.0/libs/lz-string.min.js
// @downloadURL https://update.greasyfork.org/scripts/563313/MWI%20Game%20Commands%20%28ItemWikiMarket%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563313/MWI%20Game%20Commands%20%28ItemWikiMarket%29.meta.js
// ==/UserScript==

/*
 * USAGE:
 * Type one of these commands in chat and press Enter:
 *
 * /item <item name>   - Opens Item Dictionary in-game
 * /wiki <item name>   - Opens wiki page in new tab
 * /market <item name> - Opens marketplace for the item
 *
 * EXAMPLES:
 * /item Radiant Fiber
 * /wiki radiant fiber  (case insensitive)
 * /market Ancient Log
 * /item radiant        (partial match if unique)
 *
 * NOTES:
 * - Item names are validated against game data
 * - If multiple items match, you'll see a list of suggestions
 * - Commands are case-insensitive
 * - Chat input is automatically cleared after command
 *
 * TROUBLESHOOTING:
 * - If nothing happens, check the browser console (F12) for errors
 * - Make sure you're on the game page and chat is loaded
 * - Try refreshing the page
 */

(function() {
    'use strict';

    // ===== CONSTANTS =====
    const CHAT_INPUT_SELECTOR = '#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_middlePanel__uDts7 > div.GamePage_chatPanel__mVaVt > div > div.Chat_chatInputContainer__2euR8 > form > input';
    const WIKI_BASE_URL = 'https://milkywayidle.wiki.gg/wiki/';

    // Command types
    const COMMAND_TYPES = {
        ITEM: 'item',
        WIKI: 'wiki',
        MARKET: 'market'
    };

    // ===== GAME CORE ACCESS =====

    /**
     * Extract the game's React core object
     * @returns {Object|null} The game core stateNode object, or null if not found
     */
    function getGameCore() {
        try {
            const el = document.querySelector(".GamePage_gamePage__ixiPl");
            if (!el) return null;

            const k = Object.keys(el).find(k => k.startsWith("__reactFiber$"));
            if (!k) return null;

            let f = el[k];
            while (f) {
                if (f.stateNode?.sendPing) {
                    return f.stateNode;
                }
                f = f.return;
            }

            return null;
        } catch (error) {
            console.error('[Game Commands] Error accessing game core:', error);
            return null;
        }
    }

    // ===== DATA MANAGEMENT =====

    /**
     * Load and parse item data from localStorage
     * @returns {Object|null} Object with itemNameToHrid and itemHridToName mappings, or null if failed
     */
    function loadItemData() {
        try {
            const initClientData = JSON.parse(
                LZString.decompressFromUTF16(localStorage.getItem('initClientData'))
            );

            if (!initClientData || initClientData.type !== 'init_client_data') {
                return null;
            }

            // Build item name to HRID mapping
            const itemNameToHrid = {};
            const itemHridToName = {};

            for (const [hrid, item] of Object.entries(initClientData.itemDetailMap)) {
                if (item && item.name) {
                    const normalizedName = item.name.toLowerCase();
                    itemNameToHrid[normalizedName] = hrid;
                    itemHridToName[hrid] = item.name;
                }
            }

            return { itemNameToHrid, itemHridToName };
        } catch (error) {
            console.error('[Game Commands] Failed to load item data:', error);
            return null;
        }
    }

    // ===== COMMAND PARSING =====

    /**
     * Parse game command from chat input
     * @param {string} inputValue - The chat input value
     * @returns {Object|null} {type: 'item'|'wiki'|'market', itemName: string} or null if not a command
     */
    function parseGameCommand(inputValue) {
        const trimmed = inputValue.trim();

        // Check for /item command
        if (trimmed.startsWith('/item ')) {
            const itemName = trimmed.substring(6).trim();
            if (!itemName) return null;
            return { type: COMMAND_TYPES.ITEM, itemName };
        }

        // Check for /wiki command
        if (trimmed.startsWith('/wiki ')) {
            const itemName = trimmed.substring(6).trim();
            if (!itemName) return null;
            return { type: COMMAND_TYPES.WIKI, itemName };
        }

        // Check for /market command
        if (trimmed.startsWith('/market ')) {
            const itemName = trimmed.substring(8).trim();
            if (!itemName) return null;
            return { type: COMMAND_TYPES.MARKET, itemName };
        }

        return null;
    }

    /**
     * Normalize item name for wiki URL
     * @param {string} itemName - The raw item name from user input
     * @param {Object|null} itemData - Item data mappings (can be null)
     * @returns {string|null} Normalized item name for URL, or null if multiple matches
     */
    function normalizeItemNameForWiki(itemName, itemData) {
        // Step 1: Try exact match (case-insensitive)
        const lowerName = itemName.toLowerCase();

        if (itemData && itemData.itemNameToHrid[lowerName]) {
            // Found exact match - use the canonical name
            const hrid = itemData.itemNameToHrid[lowerName];
            const canonicalName = itemData.itemHridToName[hrid];
            return canonicalName.replace(/ /g, '_');
        }

        // Step 2: Fuzzy match (find closest match)
        if (itemData) {
            const allNames = Object.keys(itemData.itemNameToHrid);
            const matches = allNames.filter(name => name.includes(lowerName));

            if (matches.length === 1) {
                // Single match found
                const hrid = itemData.itemNameToHrid[matches[0]];
                const canonicalName = itemData.itemHridToName[hrid];
                return canonicalName.replace(/ /g, '_');
            }

            if (matches.length > 1) {
                // Multiple matches - show user
                console.warn('[Wiki Command] Multiple matches found:', matches);
                showMultipleMatchesWarning(matches);
                return null;
            }
        }

        // Step 3: No match found - do best effort normalization
        // Capitalize first letter of each word, replace spaces with underscores
        return itemName
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join('_');
    }

    /**
     * Get wiki URL for item
     * @param {string} normalizedItemName - The normalized item name
     * @returns {string} Full wiki URL
     */
    function getWikiUrl(normalizedItemName) {
        return WIKI_BASE_URL + normalizedItemName;
    }

    // ===== CHAT MANIPULATION =====

    /**
     * Clear chat input using React-compatible method
     * @param {HTMLInputElement} inputElement - The chat input element
     */
    function clearChatInput(inputElement) {
        // Use native setter to properly update React-controlled input
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            "value"
        ).set;

        nativeInputValueSetter.call(inputElement, '');

        // Dispatch input event to notify React
        const event = new Event('input', { bubbles: true, cancelable: true });
        inputElement.dispatchEvent(event);
    }

    // ===== GAME NAVIGATION =====

    /**
     * Open the Item Dictionary for a specific item
     * @param {string} itemHrid - The item HRID (e.g., "/items/radiant_fiber")
     * @returns {boolean} True if Item Dictionary was opened, false otherwise
     */
    function openItemDictionary(itemHrid) {
        const core = window.MWI_GAME_CORE;
        if (!core || typeof core.handleOpenItemDictionary !== 'function') {
            return false;
        }

        try {
            core.handleOpenItemDictionary(itemHrid);
            return true;
        } catch (error) {
            console.error('[Game Commands] Failed to open Item Dictionary:', error);
            return false;
        }
    }

    /**
     * Navigate to the marketplace for a specific item
     * @param {string} itemHrid - The item HRID (e.g., "/items/radiant_fiber")
     * @returns {boolean} True if navigation succeeded, false otherwise
     */
    function openMarketplace(itemHrid) {
        const core = window.MWI_GAME_CORE;
        if (!core || typeof core.handleGoToMarketplace !== 'function') {
            return false;
        }

        try {
            core.handleGoToMarketplace(itemHrid, 0);
            return true;
        } catch (error) {
            console.error('[Game Commands] Failed to open marketplace:', error);
            return false;
        }
    }

    // ===== UI FEEDBACK =====

    /**
     * Show warning when multiple items match the search
     * @param {Array<string>} matches - Array of matching item names
     */
    function showMultipleMatchesWarning(matches) {
        const chatHistory = document.querySelector('[class^="ChatHistory_chatHistory"]');
        if (!chatHistory) return;

        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            padding: 8px;
            margin: 4px 0;
            background: rgba(255, 100, 100, 0.2);
            border-left: 3px solid #ff6464;
            border-radius: 4px;
            font-family: monospace;
            font-size: 12px;
            color: #ffcccc;
        `;

        const matchList = matches.slice(0, 5).join(', ') + (matches.length > 5 ? '...' : '');
        messageDiv.textContent = `Multiple items match your search: ${matchList}. Please be more specific.`;

        chatHistory.appendChild(messageDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    // ===== EVENT HANDLERS =====

    /**
     * Handle keydown on chat input
     * @param {KeyboardEvent} event - The keydown event
     */
    function handleChatKeydown(event) {
        // Only process Enter key
        if (event.key !== 'Enter') {
            return;
        }

        const input = event.target;
        if (!input) return;

        const inputValue = input.value;
        const command = parseGameCommand(inputValue);

        if (command === null) {
            // Not a game command, let it through
            return;
        }

        // It's a game command - prevent submission
        event.preventDefault();
        event.stopPropagation();

        // Process the command
        const normalizedName = normalizeItemNameForWiki(command.itemName, window.GAME_COMMAND_DATA);

        if (!normalizedName) {
            // Normalization failed (multiple matches or error)
            clearChatInput(input);
            return;
        }

        // Try to get the item HRID
        let itemHrid = null;
        if (window.GAME_COMMAND_DATA) {
            const lowerName = normalizedName.replace(/_/g, ' ').toLowerCase();
            itemHrid = window.GAME_COMMAND_DATA.itemNameToHrid[lowerName];
        }

        // Execute the appropriate action based on command type
        switch (command.type) {
            case COMMAND_TYPES.ITEM:
                if (itemHrid) {
                    openItemDictionary(itemHrid);
                }
                break;

            case COMMAND_TYPES.WIKI:
                const wikiUrl = getWikiUrl(normalizedName);
                window.open(wikiUrl, '_blank');
                break;

            case COMMAND_TYPES.MARKET:
                if (itemHrid) {
                    openMarketplace(itemHrid);
                }
                break;
        }

        // Clear input
        clearChatInput(input);
    }

    // ===== INITIALIZATION =====

    /**
     * Wait for chat input element to be available
     * @returns {Promise<HTMLInputElement>} Promise that resolves with the chat input element
     */
    function waitForChatInput() {
        return new Promise((resolve) => {
            const check = () => {
                const input = document.querySelector(CHAT_INPUT_SELECTOR);
                if (input) {
                    resolve(input);
                } else {
                    setTimeout(check, 200);
                }
            };
            check();
        });
    }

    // ===== MAIN =====

    // Initialize game core access
    setTimeout(() => {
        const core = getGameCore();
        if (core) {
            window.MWI_GAME_CORE = core;
        }
    }, 2000);

    // Initialize chat commands
    waitForChatInput().then(chatInput => {
        // Load item data
        const itemData = loadItemData();
        window.GAME_COMMAND_DATA = itemData || null;

        // Attach event listener
        chatInput.addEventListener('keydown', handleChatKeydown, true);

        console.log('[Game Commands] Ready! Available: /item, /wiki, /market');
    }).catch(error => {
        console.error('[Game Commands] Initialization failed:', error);
    });

})();
