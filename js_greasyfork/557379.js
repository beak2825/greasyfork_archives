// ==UserScript==
// @name         Torn Smart Price Injector
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Injects calculated "smart" prices from a Google Sheets TSV into Torn item market
// @author       Liam
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @connect      docs.google.com
// @connect      googleusercontent.com
// @connect      *.googleusercontent.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557379/Torn%20Smart%20Price%20Injector.user.js
// @updateURL https://update.greasyfork.org/scripts/557379/Torn%20Smart%20Price%20Injector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================================
    // CONFIGURATION
    // ============================================
    const CONFIG = {
        // Published Google Sheet TSV URL (File > Share > Publish to web > TSV)
        // Replace with your actual published TSV URL
        tsvUrl: 'REPLACE-ME',

        // Cache settings
        cacheKey: 'tornSmartPrices',
        cacheTimestampKey: 'tornSmartPricesTimestamp',
        cacheMaxAgeMs: 24 * 60 * 60 * 1000, // 24 hours

        // TSV column indices (0-based)
        itemNameColumn: 0,
        smartPriceColumn: 7, // Column H = index 7
    };

    // ============================================
    // TSV PARSING
    // ============================================

    /**
     * Parses a TSV string into an item name -> smart price map
     * @param {string} tsvText - Raw TSV content
     * @returns {Map<string, number>} - Map of item names to smart prices
     */
    function parseTsvToSmartPriceMap(tsvText) {
        const smartPrices = new Map();
        const lines = tsvText.trim().split('\n');

        // Skip header row (index 0)
        for (let i = 1; i < lines.length; i++) {
            const columns = lines[i].split('\t');

            if (columns.length > CONFIG.smartPriceColumn) {
                const itemName = columns[CONFIG.itemNameColumn].trim();
                const smartPriceRaw = columns[CONFIG.smartPriceColumn];

                // Parse price: remove commas, convert to integer
                const smartPrice = parseFormattedNumber(smartPriceRaw);

                // Only add valid entries (non-zero, valid number)
                if (itemName && smartPrice > 0) {
                    smartPrices.set(itemName, smartPrice);
                }
            }
        }

        console.log(`[Smart Price] Parsed ${smartPrices.size} items from TSV`);
        return smartPrices;
    }

    /**
     * Parses a formatted number string (with commas) to an integer
     * @param {string} numStr - Number string like "469,369,599"
     * @returns {number} - Parsed integer, or 0 if invalid
     */
    function parseFormattedNumber(numStr) {
        if (!numStr) return 0;
        // Remove commas and any whitespace, then parse
        const cleaned = numStr.replace(/,/g, '').trim();
        const parsed = parseInt(cleaned, 10);
        return isNaN(parsed) ? 0 : parsed;
    }

    // ============================================
    // CACHING
    // ============================================

    /**
     * Gets cached smart prices if they exist and aren't stale
     * @returns {Map<string, number>|null} - Cached map or null if stale/missing
     */
    function getCachedPrices() {
        const timestamp = GM_getValue(CONFIG.cacheTimestampKey, 0);
        const now = Date.now();

        // Check if cache is stale
        if (now - timestamp > CONFIG.cacheMaxAgeMs) {
            console.log('[Smart Price] Cache is stale or missing');
            return null;
        }

        const cachedData = GM_getValue(CONFIG.cacheKey, null);
        if (!cachedData) {
            return null;
        }

        // GM storage stores as JSON, so we need to reconstruct the Map
        try {
            const parsed = JSON.parse(cachedData);
            const map = new Map(Object.entries(parsed));
            console.log(`[Smart Price] Loaded ${map.size} items from cache (age: ${Math.round((now - timestamp) / 1000 / 60)} minutes)`);
            return map;
        } catch (e) {
            console.error('[Smart Price] Failed to parse cached data:', e);
            return null;
        }
    }

    /**
     * Saves smart prices to cache with current timestamp
     * @param {Map<string, number>} priceMap - Map to cache
     */
    function cachePrices(priceMap) {
        // Convert Map to plain object for JSON serialization
        const obj = Object.fromEntries(priceMap);
        GM_setValue(CONFIG.cacheKey, JSON.stringify(obj));
        GM_setValue(CONFIG.cacheTimestampKey, Date.now());
        console.log(`[Smart Price] Cached ${priceMap.size} items`);
    }

    /**
     * Forces a cache refresh regardless of age
     */
    function invalidateCache() {
        GM_setValue(CONFIG.cacheTimestampKey, 0);
        console.log('[Smart Price] Cache invalidated');
    }

    // ============================================
    // DATA FETCHING
    // ============================================

    /**
     * Fetches TSV from the configured URL
     * @returns {Promise<string>} - Promise resolving to TSV text
     */
    function fetchTsv() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: CONFIG.tsvUrl,
                onload: function(response) {
                    if (response.status === 200) {
                        resolve(response.responseText);
                    } else {
                        reject(new Error(`HTTP ${response.status}: ${response.statusText}`));
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    /**
     * Gets smart prices, using cache if valid or fetching fresh data
     * @returns {Promise<Map<string, number>>} - Promise resolving to price map
     */
    async function getSmartPrices() {
        // Try cache first
        let prices = getCachedPrices();

        if (prices) {
            return prices;
        }

        // Cache miss or stale - fetch fresh data
        console.log('[Smart Price] Fetching fresh TSV data...');
        try {
            const tsvText = await fetchTsv();
            prices = parseTsvToSmartPriceMap(tsvText);
            cachePrices(prices);
            return prices;
        } catch (error) {
            console.error('[Smart Price] Failed to fetch TSV:', error);
            // Return empty map on failure
            return new Map();
        }
    }

    // ============================================
    // DOM MANIPULATION
    // ============================================

    // Inject CSS for smart price styling
    function injectStyles() {
        GM_addStyle(`
            .smart-price {
                color: #489ae1;
                margin-left: auto;  /* Flexbox: push to right side */
                font-weight: 400;
                font-size: 12px;
                white-space: nowrap;
            }
            .smart-price.no-data {
                color: #888;
                font-style: italic;
            }
        `);
    }

    /**
     * Formats a number as currency string
     * @param {number} num - Number to format
     * @returns {string} - Formatted string like "$1,234,567"
     */
    function formatPrice(num) {
        return '$' + num.toLocaleString();
    }

    /**
     * Injects smart prices into the item market page
     * @param {Map<string, number>} priceMap - Map of item names to smart prices
     */
    function injectSmartPrices(priceMap) {
        // Select all item name elements using the stable .t-overflow class
        const itemNameElements = document.querySelectorAll('span.t-overflow');

        let injectedCount = 0;
        let skippedCount = 0;

        itemNameElements.forEach(nameSpan => {
            // Find the parent title span (uses CSS Modules naming)
            const titleSpan = nameSpan.closest('[class*="title___"]');

            if (!titleSpan) {
                return; // Not in expected structure
            }

            // Check if we've already processed this item
            if (titleSpan.querySelector('.smart-price')) {
                skippedCount++;
                return;
            }

            // Get the item name
            const itemName = nameSpan.textContent.trim();

            // Create the smart price element
            const smartPriceSpan = document.createElement('span');
            smartPriceSpan.className = 'smart-price';

            if (priceMap.has(itemName)) {
                const smartPrice = priceMap.get(itemName);
                smartPriceSpan.textContent = `Smart: ${formatPrice(smartPrice)}`;
                injectedCount++;
            } else {
                // Item not in our data - could show nothing or a placeholder
                smartPriceSpan.textContent = 'Smart: N/A';
                smartPriceSpan.classList.add('no-data');
                injectedCount++;
            }

            // Append to the title span (after name and quantity)
            titleSpan.appendChild(smartPriceSpan);
        });

        if (injectedCount > 0) {
            console.log(`[Smart Price] Injected ${injectedCount} prices (${skippedCount} already processed)`);
        }
    }

    /**
     * Sets up a MutationObserver to handle dynamically loaded content
     * @param {Map<string, number>} priceMap - Map of item names to smart prices
     */
    function observePageChanges(priceMap) {
        // Debounce timer to batch rapid mutations
        let debounceTimer = null;
        const DEBOUNCE_MS = 100;

        const observer = new MutationObserver((mutations) => {
            // Check if any mutations added new elements
            const hasNewElements = mutations.some(mutation =>
                mutation.addedNodes.length > 0 &&
                Array.from(mutation.addedNodes).some(node =>
                    node.nodeType === Node.ELEMENT_NODE
                )
            );

            if (hasNewElements) {
                // Debounce to avoid excessive processing during scroll
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    injectSmartPrices(priceMap);
                }, DEBOUNCE_MS);
            }
        });

        // Observe the main content area
        // Torn typically uses #mainContainer or similar
        const targetNode = document.querySelector('#mainContainer') ||
                          document.querySelector('[class*="itemMarket___"]') ||
                          document.body;

        observer.observe(targetNode, {
            childList: true,
            subtree: true
        });

        console.log('[Smart Price] MutationObserver active for dynamic content');
        return observer;
    }

    // ============================================
    // INITIALIZATION
    // ============================================

    async function init() {
        console.log('[Smart Price] Initializing...');

        // Inject CSS first
        injectStyles();

        // Register Tampermonkey menu command (always available, even if initial load fails)
        GM_registerMenuCommand('🔄 Refresh Smart Prices', async () => {
            console.log('[Smart Price] Manual refresh triggered via menu...');
            invalidateCache();
            const newPrices = await getSmartPrices();
            injectSmartPrices(newPrices);
            alert(`Smart Prices refreshed!\nLoaded ${newPrices.size} items.`);
        });

        const priceMap = await getSmartPrices();

        if (priceMap.size === 0) {
            console.warn('[Smart Price] No prices loaded - check your TSV URL configuration');
            return;
        }

        console.log(`[Smart Price] Loaded ${priceMap.size} item prices`);

        // Initial injection (with a small delay to let the page render)
        setTimeout(() => injectSmartPrices(priceMap), 500);

        // Set up observer for dynamic content (virtual scrolling loads more items)
        observePageChanges(priceMap);

        // Expose utilities to window for debugging/manual control
        window.tornSmartPrice = {
            refresh: async function() {
                invalidateCache();
                const newPrices = await getSmartPrices();
                injectSmartPrices(newPrices);
                console.log('[Smart Price] Manual refresh complete');
            },
            getPrice: function(itemName) {
                return priceMap.get(itemName);
            },
            listPrices: function() {
                console.table(Object.fromEntries(priceMap));
            },
            priceMap: priceMap
        };

        console.log('[Smart Price] Ready. Debug: window.tornSmartPrice.refresh() / .getPrice("Item Name") / .listPrices()');
    }

    // Wait for page to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();