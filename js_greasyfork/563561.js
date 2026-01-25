// ==UserScript==
// @name         MWI Command Palette (Item/Wiki/Market)
// @namespace    mwi_command_palette
// @version      4.1.1
// @description  Command palette for quick item lookup (Cmd+K / Ctrl+K) with autocomplete and fuzzy matching.
// @author       Mists
// @license      MIT
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @match        https://www.milkywayidlecn.com/*
// @grant        none
// @run-at       document-idle
// @require      https://cdn.jsdelivr.net/npm/lz-string@1.5.0/libs/lz-string.min.js
// @downloadURL https://update.greasyfork.org/scripts/563561/MWI%20Command%20Palette%20%28ItemWikiMarket%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563561/MWI%20Command%20Palette%20%28ItemWikiMarket%29.meta.js
// ==/UserScript==

/*
 * USAGE:
 * 1. Press Cmd+K (Mac) or Ctrl+K (Windows) to open command palette
 * 2. Start typing an item name (supports fuzzy/typo-tolerant matching!)
 * 3. Use arrow keys or mouse to select an item
 * 4. Press Enter for Item Dictionary
 * 5. Press Shift+Enter for Marketplace
 * 6. Press Cmd+Enter (Mac) or Ctrl+Enter (Windows) for Wiki
 * 7. Press ESC to close palette or Item Dictionary
 *
 * EXAMPLES:
 * - Type "radiant" → Select "Radiant Fiber" → Enter
 * - Type "iron" → Select "Iron Ore" → Shift+Enter (marketplace)
 * - Type "fiber" → Select any → Cmd+Enter (wiki)
 * - Type "chees bul" → Finds "Cheese Bulwark" (fuzzy matching!)
 * - Type "rad fib" → Finds "Radiant Fiber" (token matching!)
 *
 * CONFIGURATION:
 * Edit the CONFIG object below to customize keybinds and fuzzy matching
 *
 * NOTES:
 * - Works from anywhere in the game (no need to click chat)
 * - Item names are validated against game data
 * - Fuzzy matching handles typos and partial words
 * - Autocomplete shows matching items as you type
 * - Click outside or press Escape to close
 * - ESC also closes Item Dictionary when open
 *
 * TROUBLESHOOTING:
 * - If nothing happens, check the browser console (F12) for errors
 * - Make sure you're on the game page
 * - Try refreshing the page
 */

(function() {
    'use strict';

    // ===== CONFIGURATION =====
    const CONFIG = {
        // Keybind to open/close command palette
        TRIGGER_KEY: 'k',                   // The key to press
        TRIGGER_MODIFIER_MAC: 'metaKey',    // Cmd on Mac
        TRIGGER_MODIFIER_WIN: 'ctrlKey',    // Ctrl on Windows/Linux

        // Action modifiers (when selecting an item)
        ACTION_ITEM: null,                  // Just Enter (no modifier)
        ACTION_MARKET: 'shiftKey',          // Shift+Enter
        ACTION_WIKI_MAC: 'metaKey',         // Cmd+Enter on Mac
        ACTION_WIKI_WIN: 'ctrlKey',         // Ctrl+Enter on Windows/Linux

        // Fuzzy matching settings
        ENABLE_FUZZY_MATCHING: true,        // Enable fuzzy/typo-tolerant matching
        FUZZY_MIN_QUERY_LENGTH: 3,          // Minimum token length for fuzzy matching

        // UI Settings
        MAX_SUGGESTIONS: 10,
        SHOW_ACTION_HINTS: true,
    };

    // ===== CONSTANTS =====
    const WIKI_BASE_URL = 'https://milkywayidle.wiki.gg/wiki/';

    // Palette state
    const paletteState = {
        elements: null,        // {backdrop, container, input, suggestions, hints}
        isOpen: false,         // Whether palette is visible
        suggestions: [],       // Current filtered suggestions
        selectedIndex: -1,     // Currently selected suggestion
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

    /**
     * Get wiki URL for item
     * @param {string} normalizedItemName - The normalized item name
     * @returns {string} Full wiki URL
     */
    function getWikiUrl(normalizedItemName) {
        return WIKI_BASE_URL + normalizedItemName;
    }

    // ===== FUZZY MATCHING =====

    /**
     * Calculate Levenshtein distance (edit distance) between two strings
     * Used for typo-tolerant matching
     * @param {string} a - First string
     * @param {string} b - Second string
     * @returns {number} Edit distance (number of edits needed to transform a into b)
     */
    function levenshteinDistance(a, b) {
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;

        const matrix = [];

        // Initialize first column (deletions from b)
        for (let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }

        // Initialize first row (deletions from a)
        for (let j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }

        // Fill in the rest of the matrix
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    // Characters match, no edit needed
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    // Take minimum of:
                    // - substitution (diagonal)
                    // - insertion (left)
                    // - deletion (top)
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,  // substitution
                        matrix[i][j - 1] + 1,      // insertion
                        matrix[i - 1][j] + 1       // deletion
                    );
                }
            }
        }

        return matrix[b.length][a.length];
    }

    /**
     * Check if query tokens fuzzy-match item name
     * Uses token-based matching with edit distance for typo tolerance
     * @param {Array<string>} queryTokens - Array of query words (lowercase)
     * @param {string} itemName - Item name (lowercase)
     * @returns {number} Match score (0 = no match, higher = better match)
     */
    function fuzzyMatchItem(queryTokens, itemName) {
        if (!CONFIG.ENABLE_FUZZY_MATCHING) return 0;

        const itemTokens = itemName.split(/\s+/);  // Split on whitespace
        let matchedTokens = 0;
        let totalScore = 0;

        for (const queryToken of queryTokens) {
            let bestScore = 0;

            for (const itemToken of itemTokens) {
                let score = 0;

                // Exact match (best)
                if (itemToken === queryToken) {
                    score = 100;
                }
                // Starts with (good)
                else if (itemToken.startsWith(queryToken)) {
                    score = 80 - (itemToken.length - queryToken.length);  // Prefer shorter
                }
                // Contains (ok)
                else if (itemToken.includes(queryToken)) {
                    score = 50;
                }
                // Edit distance (typo tolerance) - only for longer tokens
                else if (queryToken.length >= CONFIG.FUZZY_MIN_QUERY_LENGTH) {
                    const distance = levenshteinDistance(queryToken, itemToken);
                    const tolerance = Math.floor(queryToken.length / 3);  // 33% error rate

                    if (distance <= tolerance) {
                        score = 30 - (distance * 10);
                    }
                }

                if (score > bestScore) {
                    bestScore = score;
                }
            }

            if (bestScore > 0) {
                matchedTokens++;
                totalScore += bestScore;
            }
        }

        // All query tokens must match
        if (matchedTokens < queryTokens.length) {
            return 0;
        }

        return totalScore / queryTokens.length;  // Average score
    }

    // ===== ITEM SUGGESTIONS =====

    /**
     * Get item suggestions based on query
     * @param {string} query - The search query
     * @param {number} maxResults - Maximum number of results to return
     * @returns {Array<Object>} Array of {name, hrid, priority, score} objects
     */
    function getItemSuggestions(query, maxResults = 10) {
        if (!window.GAME_COMMAND_DATA || !query) return [];

        const lowerQuery = query.toLowerCase();
        const suggestions = [];

        // Split query into tokens for fuzzy matching
        const queryTokens = lowerQuery.split(/\s+/).filter(t => t.length > 0);

        // Iterate through item names
        for (const [lowerName, hrid] of Object.entries(window.GAME_COMMAND_DATA.itemNameToHrid)) {
            let priority;
            let score = 0;

            // Check for exact match (highest priority)
            if (lowerName === lowerQuery) {
                priority = 0;
                score = 1000;
            }
            // Check if item name starts with query
            else if (lowerName.startsWith(lowerQuery)) {
                priority = 1;
                score = 900;
            }
            // Check if item name contains query
            else if (lowerName.includes(lowerQuery)) {
                priority = 2;
                score = 800;
            }
            // Try fuzzy matching with tokens
            else {
                const fuzzyScore = fuzzyMatchItem(queryTokens, lowerName);
                if (fuzzyScore > 0) {
                    priority = 3;
                    score = fuzzyScore;
                } else {
                    continue;  // No match
                }
            }

            suggestions.push({
                name: window.GAME_COMMAND_DATA.itemHridToName[hrid],
                hrid: hrid,
                priority: priority,
                score: score
            });

            // Stop early if we have enough (more buffer for fuzzy matches)
            if (suggestions.length >= maxResults * 3) break;
        }

        // Sort by priority, then score, then alphabetically
        suggestions.sort((a, b) => {
            if (a.priority !== b.priority) return a.priority - b.priority;
            if (a.score !== b.score) return b.score - a.score;  // Higher score first
            return a.name.localeCompare(b.name);
        });

        return suggestions.slice(0, maxResults);
    }

    // ===== COMMAND PALETTE UI =====

    /**
     * Create command palette overlay
     * @returns {Object} Palette elements {backdrop, container, input, suggestions, hints}
     */
    function createCommandPalette() {
        // Create full-screen backdrop
        const backdrop = document.createElement('div');
        backdrop.id = 'mwi-command-palette-backdrop';
        backdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.7);
            z-index: 100000;
            display: none;
            justify-content: center;
            align-items: flex-start;
            padding-top: 15vh;
        `;

        // Create palette container
        const container = document.createElement('div');
        container.id = 'mwi-command-palette-container';
        container.style.cssText = `
            width: 600px;
            max-width: 90vw;
            background: rgba(20, 20, 35, 0.98);
            border: 1px solid rgba(98, 167, 233, 0.3);
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
            overflow: hidden;
        `;

        // Create input box
        const input = document.createElement('input');
        input.id = 'mwi-command-palette-input';
        input.type = 'text';
        input.placeholder = 'Search items... (Cmd+K to toggle)';
        input.style.cssText = `
            width: 100%;
            padding: 16px 20px;
            background: transparent;
            border: none;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            color: #ffffff;
            font-size: 16px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            outline: none;
        `;

        // Create suggestions container
        const suggestions = document.createElement('div');
        suggestions.id = 'mwi-command-palette-suggestions';
        suggestions.style.cssText = `
            max-height: 400px;
            overflow-y: auto;
        `;

        // Create action hints
        const hints = document.createElement('div');
        hints.id = 'mwi-command-palette-hints';
        hints.style.cssText = `
            padding: 12px 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.5);
            font-size: 12px;
            text-align: center;
            font-family: monospace;
        `;

        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const cmdKey = isMac ? '⌘' : 'Ctrl';
        hints.textContent = `⏎ Item Dictionary  |  ⇧⏎ Marketplace  |  ${cmdKey}⏎ Wiki`;

        // Assemble
        container.appendChild(input);
        container.appendChild(suggestions);
        if (CONFIG.SHOW_ACTION_HINTS) {
            container.appendChild(hints);
        }
        backdrop.appendChild(container);
        document.body.appendChild(backdrop);

        return {
            backdrop,
            container,
            input,
            suggestions,
            hints
        };
    }

    /**
     * Show command palette
     */
    function showCommandPalette() {
        if (!paletteState.elements) return;

        paletteState.elements.backdrop.style.display = 'flex';
        paletteState.elements.input.value = '';
        paletteState.elements.input.focus();
        paletteState.isOpen = true;
        paletteState.selectedIndex = -1;

        // Clear suggestions
        paletteState.elements.suggestions.innerHTML = '';
    }

    /**
     * Hide command palette
     */
    function hideCommandPalette() {
        if (!paletteState.elements) return;

        paletteState.elements.backdrop.style.display = 'none';
        paletteState.isOpen = false;
        paletteState.suggestions = [];
        paletteState.selectedIndex = -1;
    }

    /**
     * Render suggestions in palette
     * @param {Array<Object>} suggestions - Array of suggestion objects
     */
    function renderPaletteSuggestions(suggestions) {
        const container = paletteState.elements.suggestions;
        if (!container) return;

        container.innerHTML = '';

        if (suggestions.length === 0) {
            // Show "no results" message
            const emptyDiv = document.createElement('div');
            emptyDiv.style.cssText = `
                padding: 20px;
                text-align: center;
                color: rgba(255, 255, 255, 0.4);
                font-size: 14px;
            `;
            emptyDiv.textContent = 'No items found';
            container.appendChild(emptyDiv);
            return;
        }

        suggestions.forEach((item, index) => {
            const suggestionDiv = document.createElement('div');
            suggestionDiv.className = 'palette-suggestion-item';
            suggestionDiv.textContent = item.name;
            suggestionDiv.dataset.index = index;

            suggestionDiv.style.cssText = `
                padding: 12px 20px;
                cursor: pointer;
                color: #e0e0e0;
                font-size: 14px;
                transition: background-color 0.1s;
            `;

            // Hover effect
            suggestionDiv.addEventListener('mouseenter', () => {
                paletteState.selectedIndex = index;
                updatePaletteSelection();
            });

            // Click to select (default: open item dictionary)
            suggestionDiv.addEventListener('click', () => {
                executeAction('item', item);
            });

            container.appendChild(suggestionDiv);
        });

        paletteState.suggestions = suggestions;
        paletteState.selectedIndex = 0;
        updatePaletteSelection();
    }

    /**
     * Update visual selection in palette
     */
    function updatePaletteSelection() {
        const container = paletteState.elements.suggestions;
        if (!container) return;

        const items = container.querySelectorAll('.palette-suggestion-item');
        items.forEach((item, index) => {
            if (index === paletteState.selectedIndex) {
                item.style.backgroundColor = 'rgba(98, 167, 233, 0.25)';
                item.style.color = '#ffffff';
                item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            } else {
                item.style.backgroundColor = 'transparent';
                item.style.color = '#e0e0e0';
            }
        });
    }

    /**
     * Execute action on selected item
     * @param {string} actionType - 'item', 'market', or 'wiki'
     * @param {Object} item - Item object with name and hrid
     */
    function executeAction(actionType, item) {
        if (!item || !item.hrid) return;

        const itemHrid = item.hrid;
        const itemName = item.name;

        switch (actionType) {
            case 'item':
                // Open Item Dictionary
                openItemDictionary(itemHrid);
                break;

            case 'market':
                // Open Marketplace
                openMarketplace(itemHrid);
                break;

            case 'wiki':
                // Open Wiki (50ms delay breaks Cmd+Enter shortcut chain)
                const wikiName = itemName.replace(/ /g, '_');
                const wikiUrl = getWikiUrl(wikiName);
                setTimeout(() => {
                    const newWindow = window.open(wikiUrl, '_blank');
                    if (newWindow) newWindow.focus();
                }, 50);
                break;
        }

        // Close palette after action
        hideCommandPalette();
    }

    // ===== EVENT HANDLERS =====

    /**
     * Handle global keydown events
     * @param {KeyboardEvent} event - The keydown event
     */
    function handleGlobalKeydown(event) {
        // Detect platform
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const triggerModifier = isMac ? CONFIG.TRIGGER_MODIFIER_MAC : CONFIG.TRIGGER_MODIFIER_WIN;

        // Check for palette toggle (Cmd+K / Ctrl+K)
        if (event.key.toLowerCase() === CONFIG.TRIGGER_KEY && event[triggerModifier]) {
            event.preventDefault();

            if (paletteState.isOpen) {
                hideCommandPalette();
            } else {
                showCommandPalette();
            }
            return;
        }

        // ESC key - close item dictionary if open, or close palette
        if (event.key === 'Escape') {
            event.preventDefault();

            // Check if item dictionary is open
            const itemDictionary = document.querySelector('.ItemDictionary_modalContent__WvEBY');
            if (itemDictionary) {
                // Close item dictionary
                if (window.MWI_GAME_CORE && typeof window.MWI_GAME_CORE.handleCloseItemDictionary === 'function') {
                    window.MWI_GAME_CORE.handleCloseItemDictionary();
                }
                return;
            }

            // Otherwise, close palette if open
            if (paletteState.isOpen) {
                hideCommandPalette();
            }
            return;
        }

        // Only process other keys if palette is open
        if (!paletteState.isOpen) return;

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                paletteState.selectedIndex = Math.min(
                    paletteState.selectedIndex + 1,
                    paletteState.suggestions.length - 1
                );
                updatePaletteSelection();
                break;

            case 'ArrowUp':
                event.preventDefault();
                paletteState.selectedIndex = Math.max(
                    paletteState.selectedIndex - 1,
                    0
                );
                updatePaletteSelection();
                break;

            case 'Enter':
                event.preventDefault();
                if (paletteState.selectedIndex >= 0 && paletteState.suggestions.length > 0) {
                    const selected = paletteState.suggestions[paletteState.selectedIndex];

                    // Determine action based on CONFIG modifier keys
                    const wikiModifier = isMac ? CONFIG.ACTION_WIKI_MAC : CONFIG.ACTION_WIKI_WIN;

                    // Build action map from CONFIG
                    const actionMap = [
                        { action: 'item', modifier: CONFIG.ACTION_ITEM },
                        { action: 'market', modifier: CONFIG.ACTION_MARKET },
                        { action: 'wiki', modifier: wikiModifier }
                    ];

                    // Find matching action (null modifier = default/no modifier pressed)
                    let matchedAction = 'item'; // fallback
                    for (const { action, modifier } of actionMap) {
                        if (modifier === null && !event.shiftKey && !event[wikiModifier]) {
                            matchedAction = action;
                            break;
                        } else if (modifier && event[modifier]) {
                            matchedAction = action;
                            break;
                        }
                    }

                    executeAction(matchedAction, selected);
                }
                break;
        }
    }

    /**
     * Handle palette input changes
     * @param {Event} event - The input event
     */
    function handlePaletteInput(event) {
        const query = event.target.value.trim();

        if (query.length >= 1) {
            const suggestions = getItemSuggestions(query, CONFIG.MAX_SUGGESTIONS);
            renderPaletteSuggestions(suggestions);
        } else {
            // Clear suggestions when input is empty
            paletteState.elements.suggestions.innerHTML = '';
            paletteState.suggestions = [];
            paletteState.selectedIndex = -1;
        }
    }

    /**
     * Handle backdrop clicks
     * @param {MouseEvent} event - The click event
     */
    function handleBackdropClick(event) {
        // Close palette if clicking outside the container
        if (event.target === paletteState.elements.backdrop) {
            hideCommandPalette();
        }
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

    // ===== MAIN =====

    // Initialize game core access
    setTimeout(() => {
        const core = getGameCore();
        if (core) {
            window.MWI_GAME_CORE = core;
        }
    }, 2000);

    // Initialize command palette
    (function initCommandPalette() {
        // Load item data
        const itemData = loadItemData();
        window.GAME_COMMAND_DATA = itemData || null;

        if (!itemData) {
            console.error('[Command Palette] Failed to load item data');
            return;
        }

        // Create palette UI
        paletteState.elements = createCommandPalette();

        // Attach event listeners
        document.addEventListener('keydown', handleGlobalKeydown);
        paletteState.elements.input.addEventListener('input', handlePaletteInput);
        paletteState.elements.backdrop.addEventListener('click', handleBackdropClick);

        console.log('[Command Palette] Ready! Press Cmd+K (Mac) or Ctrl+K (Win) to open');
    })();

})();
