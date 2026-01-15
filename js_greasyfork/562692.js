// ==UserScript==
// @name          Bazaar Listing Age Tracker v3
// @namespace     http://torn.com/
// @version       3.0
// @description   Tracks bazaar listing ages using API (now with correct log parsing!)
// @author        srsbsns
// @match         *://www.torn.com/*
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_addStyle
// @grant         GM_registerMenuCommand
// @grant         GM_xmlhttpRequest
// @connect       api.torn.com
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/562692/Bazaar%20Listing%20Age%20Tracker%20v3.user.js
// @updateURL https://update.greasyfork.org/scripts/562692/Bazaar%20Listing%20Age%20Tracker%20v3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================================================================
    // CONSTANTS
    // ============================================================================
    const STORAGE_KEYS = {
        timestamps: 'bazaar.listing.timestamps',
        apiKey: 'bazaar.age.api_key',
        lastSync: 'bazaar.log.last_sync',
        lastLogId: 'bazaar.log.last_id',
        itemCatalog: 'bazaar.age.item_catalog',
        catalogTimestamp: 'bazaar.age.catalog_ts'
    };

    const LOG_CATEGORIES = {
        BAZAAR_ADD: 1222,      // When you list items
        BAZAAR_SALE: 1223      // When items sell (need to verify)
    };

    const AGE_THRESHOLDS = {
        FRESH: 1 * 60 * 60 * 1000,      // < 1 hour (green)
        RECENT: 24 * 60 * 60 * 1000,    // < 1 day (blue)
        AGING: 7 * 24 * 60 * 60 * 1000, // < 1 week (yellow)
        STALE: Infinity                  // > 1 week (red)
    };

    const INTERVALS = {
        UPDATE_BADGES: 5000,   // Update badges every 5 seconds
        API_SYNC: 60000        // Sync with API every 60 seconds
    };

    const API_BASE = 'https://api.torn.com';
    const CATALOG_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

    // ============================================================================
    // STATE
    // ============================================================================
    const state = {
        syncInterval: null,
        updateInterval: null,
        itemCatalog: null,
        processedItems: new Set() // Track which items already have badges
    };

    // ============================================================================
    // UTILITY FUNCTIONS
    // ============================================================================
    const onBazaar = () => /\/bazaar\.php/i.test(location.pathname);
    const onManage = () => onBazaar() && /^#\/manage\b/i.test(location.hash || '');

    function sanitizeItemName(name) {
        return name
            .replace(/^\d+x?\s+/i, '')
            .replace(/\s+/g, ' ')
            .trim()
            .toLowerCase();
    }

    function formatAge(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const weeks = Math.floor(days / 7);

        if (weeks > 0) return `${weeks}w ${days % 7}d`;
        if (days > 0) return `${days}d ${hours % 24}h`;
        if (hours > 0) return `${hours}h ${minutes % 60}m`;
        if (minutes > 0) return `${minutes}m`;
        return 'Just now';
    }

    function getAgeColor(age) {
        if (age < AGE_THRESHOLDS.FRESH) return '#7cfc00';
        if (age < AGE_THRESHOLDS.RECENT) return '#00aaff';
        if (age < AGE_THRESHOLDS.AGING) return '#ffde00';
        return '#ff4444';
    }

    // ============================================================================
    // API KEY MANAGEMENT
    // ============================================================================
    let apiKey = GM_getValue(STORAGE_KEYS.apiKey, '');
    if (!apiKey) {
        apiKey = prompt("Bazaar Age Tracker needs your Torn API Key:\n\n(Full Access recommended)");
        if (apiKey) GM_setValue(STORAGE_KEYS.apiKey, apiKey.trim());
    }

    function getApiKey() {
        return GM_getValue(STORAGE_KEYS.apiKey, '');
    }

    function setApiKey(key) {
        GM_setValue(STORAGE_KEYS.apiKey, key.trim());
    }

    // ============================================================================
    // STORAGE FUNCTIONS
    // ============================================================================
    function getTimestamps() {
        try {
            const data = GM_getValue(STORAGE_KEYS.timestamps, '{}');
            return JSON.parse(data);
        } catch (e) {
            console.error('[Age Tracker] Failed to load timestamps:', e);
            return {};
        }
    }

    function setTimestamps(data) {
        try {
            GM_setValue(STORAGE_KEYS.timestamps, JSON.stringify(data));
        } catch (e) {
            console.error('[Age Tracker] Failed to save timestamps:', e);
        }
    }

    function recordListing(itemId, itemName, timestamp) {
        const timestamps = getTimestamps();
        const key = sanitizeItemName(itemName);

        // Store by ID and by name for flexibility
        const entry = { id: itemId, name: itemName, timestamp };

        if (!timestamps[key] || timestamp < timestamps[key].timestamp) {
            timestamps[key] = entry;
            setTimestamps(timestamps);
            console.log(`[Age Tracker] Recorded: ${itemName} (ID: ${itemId}) at ${new Date(timestamp).toLocaleString()}`);
            return true;
        }
        return false;
    }

    function removeItemTracking(itemName) {
        const timestamps = getTimestamps();
        const key = sanitizeItemName(itemName);
        if (timestamps[key]) {
            delete timestamps[key];
            setTimestamps(timestamps);
            console.log(`[Age Tracker] Removed: ${itemName}`);
            return true;
        }
        return false;
    }

    function getListingAge(itemName) {
        const timestamps = getTimestamps();
        const key = sanitizeItemName(itemName);
        const entry = timestamps[key];

        if (!entry) return null;
        return Date.now() - entry.timestamp;
    }

    // ============================================================================
    // ITEM CATALOG
    // ============================================================================
    async function fetchItemCatalog(force = false) {
        // Check cache
        const cached = GM_getValue(STORAGE_KEYS.itemCatalog, null);
        const cacheTime = GM_getValue(STORAGE_KEYS.catalogTimestamp, 0);

        if (!force && cached && (Date.now() - cacheTime) < CATALOG_CACHE_DURATION) {
            try {
                state.itemCatalog = JSON.parse(cached);
                return state.itemCatalog;
            } catch (e) {
                console.error('[Age Tracker] Failed to parse cached catalog');
            }
        }

        // Fetch fresh catalog
        try {
            console.log('[Age Tracker] Fetching item catalog...');
            const data = await apiCall('/torn/?selections=items');
            const items = data.items || {};

            const catalog = {};
            for (const [id, item] of Object.entries(items)) {
                catalog[id] = item.name;
            }

            GM_setValue(STORAGE_KEYS.itemCatalog, JSON.stringify(catalog));
            GM_setValue(STORAGE_KEYS.catalogTimestamp, Date.now());

            state.itemCatalog = catalog;
            console.log(`[Age Tracker] Item catalog loaded (${Object.keys(catalog).length} items)`);
            return catalog;

        } catch (error) {
            console.error('[Age Tracker] Failed to fetch item catalog:', error);
            throw error;
        }
    }

    function getItemName(itemId) {
        if (!state.itemCatalog) return null;
        return state.itemCatalog[itemId] || null;
    }

    // ============================================================================
    // API FUNCTIONS
    // ============================================================================
    async function apiCall(endpoint) {
        return new Promise((resolve, reject) => {
            const key = getApiKey();
            if (!key) {
                reject(new Error('API key not configured'));
                return;
            }

            GM_xmlhttpRequest({
                method: 'GET',
                url: `${API_BASE}${endpoint}&key=${encodeURIComponent(key)}`,
                onload: (response) => {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.error) {
                            reject(new Error(data.error.error || 'API error'));
                            return;
                        }
                        resolve(data);
                    } catch (e) {
                        reject(new Error('Failed to parse API response'));
                    }
                },
                onerror: () => reject(new Error('Network error'))
            });
        });
    }

    async function fetchAndProcessLogs() {
        try {
            // Ensure we have item catalog
            if (!state.itemCatalog) {
                await fetchItemCatalog();
            }

            console.log('[Age Tracker] Fetching logs from API...');
            const data = await apiCall('/user/?selections=log');
            const logs = data.log || {};

            let newListings = 0;
            let salesDetected = 0;

            // Get the last timestamp we processed (NOT current time!)
            const lastProcessedTimestamp = GM_getValue(STORAGE_KEYS.lastSync, 0);
            let newestTimestamp = lastProcessedTimestamp;

            // Process all logs
            for (const [logId, entry] of Object.entries(logs)) {
                const timestamp = entry.timestamp * 1000;

                // Track the newest timestamp we see
                newestTimestamp = Math.max(newestTimestamp, timestamp);

                // Skip if we've already processed this entry
                if (timestamp <= lastProcessedTimestamp) continue;

                // Process bazaar additions (log category 1222)
                if (entry.log === LOG_CATEGORIES.BAZAAR_ADD) {
                    const items = entry.data?.items || [];
                    const price = entry.data?.price || 0;

                    for (const item of items) {
                        const itemId = item.id;
                        const itemName = getItemName(itemId);

                        if (itemName) {
                            if (recordListing(itemId, itemName, timestamp)) {
                                newListings++;
                                console.log(`[Age Tracker] Tracked: ${itemName} from ${new Date(timestamp).toLocaleString()}`);
                            }
                        } else {
                            console.warn(`[Age Tracker] Unknown item ID: ${itemId}`);
                        }
                    }
                }

                // Process bazaar sales (category may be 1223 or similar)
                if (entry.log === LOG_CATEGORIES.BAZAAR_SALE || entry.title?.includes('sold')) {
                    const items = entry.data?.items || [];

                    for (const item of items) {
                        const itemId = item.id;
                        const itemName = getItemName(itemId);

                        if (itemName && removeItemTracking(itemName)) {
                            salesDetected++;
                        }
                    }
                }
            }

            // Update to the newest timestamp we saw, not current time!
            if (newestTimestamp > lastProcessedTimestamp) {
                GM_setValue(STORAGE_KEYS.lastSync, newestTimestamp);
                console.log(`[Age Tracker] Updated last processed timestamp to ${new Date(newestTimestamp).toLocaleString()}`);
            }

            console.log(`[Age Tracker] Sync complete: ${newListings} new, ${salesDetected} sold`);
            return { newListings, salesDetected };

        } catch (error) {
            console.error('[Age Tracker] Sync failed:', error);
            throw error;
        }
    }

    // ============================================================================
    // BAZAAR PAGE INTEGRATION
    // ============================================================================
    function getItemNameFromRow(row) {
        const nameEl = row.querySelector('.name, .item-name, .title, b, [class*="name"]');
        if (nameEl) return nameEl.textContent.trim();

        const img = row.querySelector('img[alt]');
        if (img && img.alt) return img.alt.trim();

        return null;
    }

    function addAgeBadge(row) {
        // Check if badge already exists in this row
        if (row.querySelector('.jp-age-badge')) return;

        const itemName = getItemNameFromRow(row);
        if (!itemName) return;

        const age = getListingAge(itemName);
        if (age === null) return;

        const nameEl = row.querySelector('.name, .item-name, .title, b, [class*="name"]');
        if (!nameEl) return;

        // Create badge
        const badge = document.createElement('span');
        badge.className = 'jp-age-badge';
        badge.textContent = formatAge(age);
        badge.style.borderColor = getAgeColor(age);
        badge.title = `Listed ${new Date(Date.now() - age).toLocaleString()}\n\nClick to remove tracking`;

        // Store item name on badge for updates
        badge.dataset.itemName = sanitizeItemName(itemName);

        badge.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm(`Remove age tracking for "${itemName}"?`)) {
                removeItemTracking(itemName);
                badge.remove();
            }
        });

        nameEl.parentElement.insertBefore(badge, nameEl.nextSibling);
    }

    function updateAgeBadges() {
        if (!onManage()) return;

        document.querySelectorAll('.jp-age-badge').forEach(badge => {
            // Try to get item name from badge data first (more reliable)
            let itemName = badge.dataset.itemName;

            // Fallback to finding from row
            if (!itemName) {
                const row = badge.closest('li, [class*="row"], .bazaar-item');
                itemName = getItemNameFromRow(row);
                if (itemName) {
                    badge.dataset.itemName = sanitizeItemName(itemName);
                }
            }

            if (!itemName) {
                badge.remove();
                return;
            }

            // Get age using the stored sanitized name
            const timestamps = getTimestamps();
            const entry = timestamps[itemName];

            if (!entry) {
                badge.remove();
                return;
            }

            const age = Date.now() - entry.timestamp;
            badge.textContent = formatAge(age);
            badge.style.borderColor = getAgeColor(age);
            badge.title = `Listed ${new Date(Date.now() - age).toLocaleString()}\n\nClick to remove tracking`;
        });
    }

    function annotateBazaar() {
        if (!onManage()) return;
        const rows = document.querySelectorAll('li[class*="item"], div[class*="row"], .bazaar-item');
        rows.forEach(addAgeBadge);
    }

    // ============================================================================
    // MENU COMMANDS
    // ============================================================================
    GM_registerMenuCommand('Set API Key', () => {
        const key = prompt('Enter your Torn API key (Full Access recommended):', getApiKey());
        if (key !== null && key.trim()) {
            setApiKey(key);
            alert('API key saved!');
        }
    });

    GM_registerMenuCommand('Sync Now', async () => {
        try {
            updateSyncStatus('Syncing...', false);
            const result = await fetchAndProcessLogs();
            alert(`Sync complete!\n\nNew listings: ${result.newListings}\nSales detected: ${result.salesDetected}`);
            if (onManage()) {
                document.querySelectorAll('.jp-age-badge').forEach(b => b.remove());
                annotateBazaar();
            }
        } catch (error) {
            alert('Sync failed: ' + error.message);
            updateSyncStatus(`Sync failed: ${error.message}`, true);
        }
    });

    GM_registerMenuCommand('View Tracked Items', () => {
        const timestamps = getTimestamps();
        const items = Object.entries(timestamps)
            .map(([name, entry]) => ({
                name: entry.name || name,
                age: Date.now() - entry.timestamp
            }))
            .sort((a, b) => b.age - a.age);

        if (items.length === 0) {
            alert('No items tracked.\n\nWait for sync (60s) or use "Sync Now".');
        } else {
            const output = items.map(item =>
                `${item.name}: ${formatAge(item.age)}`
            ).join('\n');
            alert(`Tracked Items (${items.length}):\n\n${output}`);
        }
    });

    GM_registerMenuCommand('Refresh Item Catalog', async () => {
        try {
            await fetchItemCatalog(true);
            alert('Item catalog refreshed!');
        } catch (error) {
            alert('Failed to refresh catalog: ' + error.message);
        }
    });

    GM_registerMenuCommand('Clear All Data', () => {
        if (confirm('⚠️ Clear all listing age data?')) {
            setTimestamps({});
            GM_setValue(STORAGE_KEYS.lastSync, 0);
            alert('Data cleared!');
            if (onManage()) location.reload();
        }
    });

    // ============================================================================
    // STYLES
    // ============================================================================
    GM_addStyle(`
        .jp-age-badge {
            display: inline-block;
            margin-left: 8px;
            padding: 2px 6px;
            background: transparent;
            border-radius: 3px;
            font-size: 11px;
            font-weight: normal;
            font-family: 'Courier New', monospace;
            border: 1px solid;
            cursor: pointer;
            transition: all 0.2s;
            color: #ffffff;
        }

        .jp-age-badge:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: scale(1.05);
        }

        .jp-sync-status {
            position: fixed;
            bottom: 10px;
            left: 10px;
            background: rgba(30, 30, 30, 0.9);
            border: 1px solid #666;
            border-radius: 4px;
            padding: 5px 10px;
            font-size: 10px;
            color: #7cfc00;
            z-index: 9999;
            font-family: monospace;
            pointer-events: none;
        }

        .jp-sync-status.error {
            color: #ff4444;
        }
    `);

    // ============================================================================
    // SYNC STATUS DISPLAY
    // ============================================================================
    const syncStatusLabel = document.createElement('div');
    syncStatusLabel.className = 'jp-sync-status';
    syncStatusLabel.textContent = 'Age Tracker: Initializing...';
    document.body.appendChild(syncStatusLabel);

    function updateSyncStatus(text, isError = false) {
        syncStatusLabel.textContent = text;
        syncStatusLabel.classList.toggle('error', isError);
    }

    // ============================================================================
    // AUTOMATIC SYNC
    // ============================================================================
    async function autoSync() {
        try {
            const result = await fetchAndProcessLogs();
            const tracked = Object.keys(getTimestamps()).length;
            updateSyncStatus(`Age Tracker: ${tracked} items tracked`, false);

            if (onManage()) annotateBazaar();
        } catch (error) {
            console.error('[Age Tracker] Auto-sync failed:', error);
            updateSyncStatus(`Age Tracker: ${error.message}`, true);
        }
    }

    // ============================================================================
    // MUTATION OBSERVER
    // ============================================================================
    let updateTimer = null;
    let isAnnotating = false;

    function scheduleUpdate(immediate = false) {
        if (!onManage()) return;
        if (isAnnotating) return;
        if (updateTimer) clearTimeout(updateTimer);

        // For immediate mode (like when items come into view), run instantly
        const delay = immediate ? 0 : 250;

        updateTimer = setTimeout(() => {
            isAnnotating = true;
            annotateBazaar();
            isAnnotating = false;
        }, delay);
    }

    const observer = new MutationObserver((mutations) => {
        // Check if we're seeing items being added (virtual scroll)
        const hasNewItems = mutations.some(mutation => {
            return Array.from(mutation.addedNodes).some(node => {
                if (node.nodeType !== 1) return false;
                return node.matches && (
                    node.matches('li[class*="item"]') ||
                    node.matches('div[class*="row"]') ||
                    node.matches('.bazaar-item') ||
                    node.querySelector('li[class*="item"], div[class*="row"], .bazaar-item')
                );
            });
        });

        if (hasNewItems) {
            // Use immediate mode for faster response
            scheduleUpdate(true);
        }
    });

    if (onBazaar()) {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // ============================================================================
    // CLEANUP
    // ============================================================================
    window.addEventListener('beforeunload', () => {
        if (state.syncInterval) clearInterval(state.syncInterval);
        if (state.updateInterval) clearInterval(state.updateInterval);
        observer.disconnect();
    });

    // ============================================================================
    // INITIALIZATION
    // ============================================================================
    async function init() {
        console.log('[Age Tracker] Initialized v3.0');

        try {
            // Load item catalog
            await fetchItemCatalog();

            // Initial sync
            setTimeout(autoSync, 2000);

            // Setup automatic sync
            state.syncInterval = setInterval(autoSync, INTERVALS.API_SYNC);

            // Setup badge updates
            if (onManage()) {
                annotateBazaar();
                state.updateInterval = setInterval(updateAgeBadges, INTERVALS.UPDATE_BADGES);
            }
        } catch (error) {
            console.error('[Age Tracker] Initialization failed:', error);
            updateSyncStatus(`Init failed: ${error.message}`, true);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 1000);
    }

    window.addEventListener('hashchange', () => {
        if (state.updateInterval) {
            clearInterval(state.updateInterval);
            state.updateInterval = null;
        }

        setTimeout(() => {
            if (onManage()) {
                annotateBazaar();
                state.updateInterval = setInterval(updateAgeBadges, INTERVALS.UPDATE_BADGES);
            }
        }, 500);
    });

})();