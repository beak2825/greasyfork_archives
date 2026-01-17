// ==UserScript==
// @name          Bazaar Scanner GOD MODE + Auto Monitor
// @namespace     https://weav3r.dev/
// @version       6.3
// @description   Bazaar deals with NPC profit + background monitoring system
// @author        Modified with Auto Monitor Integration
// @match         https://www.torn.com/*
// @grant         GM_xmlhttpRequest
// @grant         GM_addStyle
// @grant         GM_getValue
// @grant         GM_setValue
// @connect       weav3r.dev
// @connect       tornexchange.com
// @connect       api.torn.com
// @run-at        document-idle
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/562860/Bazaar%20Scanner%20GOD%20MODE%20%2B%20Auto%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/562860/Bazaar%20Scanner%20GOD%20MODE%20%2B%20Auto%20Monitor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Global State
    window._visitedBazaars = new Set();
    window._cachedListings = {};
    window._marketValueCache = {};

    // Cache expiration time (10 minutes in milliseconds)
    const CACHE_EXPIRATION_MS = 10 * 60 * 1000;

    // NPC Price Storage
    const S_KEY = 'torn_arbiter_api_key';
    const S_CAT = 'torn_arbiter_catalog';
    const S_CAT_TIMESTAMP = 'torn_arbiter_catalog_timestamp';
    const S_ITEM_NAMES = 'torn_item_names';
    const NPC_CACHE_DURATION = 30 * 24 * 60 * 60 * 1000;
    let npcPrices = {};
    let itemNameToId = {};

    // ============================================================================
    // AUTO-MONITOR INTEGRATION - NEW CONSTANTS
    // ============================================================================
    const MONITOR_STORAGE = {
        monitored: 'bz_monitored_items',
        deals: 'bz_monitor_deals',
        settings: 'bz_monitor_settings',
        instanceLock: 'bz_monitor_lock',
        lastSync: 'bz_monitor_last_sync'
    };

    const MONITOR_CONFIG = {
        maxItems: 10,
        scanIntervalMin: 18000, // 18 seconds minimum (was 15)
        scanIntervalMax: 30000, // 30 seconds maximum (was 25)
        lockDuration: 30000,
        defaultMinProfit: 1000
    };

    // Helper function to get random interval
    function getRandomScanInterval() {
        const min = MONITOR_CONFIG.scanIntervalMin;
        const max = MONITOR_CONFIG.scanIntervalMax;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const THIS_INSTANCE_ID = 'monitor_' + Date.now() + '_' + Math.random();

    let monitorState = {
        isActive: false,
        currentIndex: 0,
        foundDeals: [],
        isScanning: false
    };

    GM_addStyle(`
        /* Existing styles... */
        #bazaar-sidebar {
            position: fixed;
            left: 10px;
            top: 20px;
            width: 180px;
            background: #1a1a1a;
            border: 2px solid #696969;
            border-radius: 8px;
            padding: 12px;
            color: #fff;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-height: calc(100vh - 200px);
            overflow-y: auto;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
        }

        #bazaar-sidebar.dragging {
            cursor: grabbing;
            user-select: none;
        }

        #bazaar-sidebar::-webkit-scrollbar {
            width: 8px;
        }

        #bazaar-sidebar::-webkit-scrollbar-thumb {
            background: #292929;
            border-radius: 4px;
        }

        .bz-header {
            font-size: 16px;
            font-weight: bold;
            color: #001975;
            margin-bottom: 8px;
            padding-bottom: 8px;
            border-bottom: 2px solid #6E6E6E;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: grab;
            user-select: none;
        }

        .bz-header:active {
            cursor: grabbing;
        }

        .bz-item-name {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #FFF;
        }

        .bz-close-btn {
            background: #A33C39;
            border: none;
            color: white;
            padding: 4px 10px;
            cursor: pointer;
            border-radius: 4px;
            font-weight: bold;
            font-size: 12px;
            margin-left: 8px;
        }

        .bz-close-btn:hover {
            background: #9E2724;
        }

        .bz-npc-info {
            font-size: 13px;
            color: #aaa;
            margin-bottom: 10px;
            padding: 8px;
            background: #252525;
            border-radius: 4px;
            border: 1px solid #6E6E6E;
        }

        .bz-npc-price {
            color: #FFD700;
            font-weight: bold;
        }

        .bz-profit-notice {
            color: #00FF00;
            font-weight: bold;
            margin-top: 4px;
            font-size: 12px;
        }

        .bz-market-info {
            font-size: 13px;
            color: #aaa;
            margin-bottom: 10px;
            padding: 6px;
            background: #252525;
            border-radius: 4px;
        }

        .bz-market-value {
            color: #87CEEB;
            font-weight: bold;
        }

        .bz-best-trader {
            color: #FFA500;
            font-weight: bold;
            margin-top: 4px;
        }

        .bz-best-price {
            color: #00FF00;
            font-weight: bold;
        }

        .bz-toggle-container {
            padding: 8px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 10px;
            background: #252525;
            border-radius: 4px;
            border: 1px solid #6E6E6E;
        }

        .bz-toggle-label {
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            user-select: none;
        }

        .bz-toggle-input {
            display: none;
        }

        .bz-toggle-slider {
            position: relative;
            width: 40px;
            height: 20px;
            background-color: #555;
            border-radius: 10px;
            transition: background-color 0.3s;
        }

        .bz-toggle-slider::before {
            content: '';
            position: absolute;
            width: 14px;
            height: 14px;
            left: 3px;
            top: 3px;
            background-color: white;
            border-radius: 50%;
            transition: transform 0.3s;
        }

        .bz-toggle-input:checked + .bz-toggle-slider {
            background-color: #4CAF50;
        }

        .bz-toggle-input:checked + .bz-toggle-slider::before {
            transform: translateX(20px);
        }

        .bz-toggle-text {
            font-size: 12px;
            font-weight: 500;
            color: #fff;
            min-width: 80px;
        }

        .bz-refresh-btn {
            background: #1a4d6f;
            border: 1px solid #2a5d7f;
            color: #00BFFF;
            padding: 6px 10px;
            cursor: pointer;
            border-radius: 4px;
            font-weight: bold;
            font-size: 11px;
            text-align: center;
            transition: all 0.2s;
            margin-bottom: 10px;
        }

        .bz-refresh-btn:hover {
            background: #2a5d7f;
            transform: scale(1.02);
        }

        .bz-refresh-btn:active {
            transform: scale(0.98);
        }

        .bz-listings-title {
            font-size: 14px;
            font-weight: bold;
            color: #FFF;
            margin: 12px 0 8px 0;
            padding-bottom: 4px;
            border-bottom: 1px solid #6E6E6E;
        }

        .bz-listing {
            background: #252525;
            border: 2px solid #444;
            border-radius: 6px;
            padding: 8px;
            margin-bottom: 6px;
            cursor: pointer;
            transition: all 0.2s;
            position: relative;
        }

        .bz-listing.profitable {
            border-color: #3A1CD4;
            background: linear-gradient(135deg, #1a3d1a 0%, #252525 100%);
        }

        .bz-listing:hover {
            background: #2a2a2a;
            border-color: #FFD700;
            transform: translateX(4px);
        }

        .bz-listing.visited {
            opacity: 0.6;
        }

        .bz-listing.visited a {
            color: #800080 !important;
        }

        .bz-player-name {
            font-weight: bold;
            color: #1E90FF;
            font-size: 14px;
            text-decoration: none;
            display: block;
            margin-bottom: 4px;
        }

        .bz-player-name:hover {
            text-decoration: underline;
        }

        .bz-listing-details {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 13px;
        }

        .bz-price {
            color: #00FF00;
            font-weight: bold;
            font-size: 15px;
        }

        .bz-qty {
            color: #aaa;
        }

        .bz-profit {
            position: absolute;
            top: 8px;
            right: 8px;
            font-size: 12px;
            font-weight: bold;
            padding: 4px 8px;
            border-radius: 4px;
            background: rgba(0,0,0,0.5);
        }

        .bz-profit.npc-profit {
            background: linear-gradient(135deg, #00FF00 0%, #00AA00 100%);
            color: #000;
            box-shadow: 0 2px 6px rgba(0, 255, 0, 0.4);
            animation: pulse 1.5s infinite;
        }

        .bz-profit.npc-profit.big {
            background: linear-gradient(135deg, #FF0000 0%, #CC0000 100%);
            color: #FFF;
            animation: pulse 1s infinite;
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.08); }
        }

        .bz-profit.positive {
            color: #00FF00;
        }

        .bz-profit.negative {
            color: #FF4444;
        }

        .bz-profit.neutral {
            color: #FFD700;
        }

        .bz-loading {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            color: #aaa;
        }

        .bz-spinner {
            border: 3px solid #333;
            border-top: 3px solid #FFD700;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            animation: spin 1s linear infinite;
            margin-right: 10px;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .bz-empty {
            text-align: center;
            padding: 20px;
            color: #888;
            font-style: italic;
        }

        .bz-no-profit {
            text-align: center;
            padding: 20px;
            color: #FFA500;
            background: #2a2a1a;
            border-radius: 6px;
            border: 1px solid #FFA500;
        }

        .bz-te-link {
            display: block;
            text-align: center;
            margin-top: 10px;
            padding: 8px;
            background: #1a4d6f;
            border-radius: 4px;
            color: #00BFFF;
            text-decoration: none;
            font-weight: bold;
            font-size: 13px;
        }

        .bz-te-link:hover {
            background: #2a5d7f;
        }

        .bz-scan-item-header {
            background: #202966;
            color: #FFD700;
            padding: 6px;
            font-size: 12px;
            font-weight: bold;
            margin-top: 8px;
            border-radius: 4px;
            border-left: 3px solid #FFD700;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .bz-scan-item-header:hover {
            background: #2a3476;
        }

        .bz-scan-item-name {
            flex: 1;
        }

        .bz-scan-best-profit {
            color: #00FF00;
            font-size: 11px;
            margin-left: 8px;
        }

        /* ============================================================================
           AUTO-MONITOR NEW STYLES
           ============================================================================ */

        /* Alert Button at top of favorites */
        .bz-monitor-alert-btn {
            width: 100%;
            padding: 8px;
            margin-bottom: 8px;
            background: #1a4d6f;
            border: 2px solid #2a5d7f;
            border-radius: 4px;
            color: #00BFFF;
            font-weight: bold;
            font-size: 12px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
        }

        .bz-monitor-alert-btn.has-deals {
            background: #8B0000;
            border-color: #FF0000;
            color: #FFF;
            animation: pulse-alert 1.5s infinite;
        }

        @keyframes pulse-alert {
            0%, 100% {
                box-shadow: 0 0 5px rgba(255, 0, 0, 0.5);
                transform: scale(1);
            }
            50% {
                box-shadow: 0 0 20px rgba(255, 0, 0, 0.8);
                transform: scale(1.02);
            }
        }

        .bz-monitor-alert-btn:hover {
            transform: scale(1.05);
        }

        .bz-alert-icon {
            font-size: 16px;
            animation: bounce 1s infinite;
        }

        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
        }

        /* Monitor checkbox next to favorite items */
        .bz-monitor-checkbox {
            width: 16px;
            height: 16px;
            cursor: pointer;
            margin-right: 6px;
            accent-color: #FFD700;
        }

        .bz-fav-item.monitored {
            background: linear-gradient(90deg, #2a2a1a 0%, #1a1a1a 100%);
            border-left: 3px solid #FFD700;
        }

        .bz-monitor-star {
            color: #FFD700;
            font-size: 14px;
            margin-left: 4px;
        }

        /* Settings button */
        .bz-settings-btn {
            background: #434C66;
            color: #FFD700;
            border: 1px solid #FFD700;
            padding: 4px 8px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 10px;
            font-weight: bold;
            transition: all 0.2s;
        }

        .bz-settings-btn:hover {
            background: #5a6380;
            transform: scale(1.05);
        }

        /* Monitor status indicator */
        .bz-monitor-status {
            font-size: 9px;
            color: #888;
            text-align: center;
            padding: 4px;
            background: #1a1a1a;
            border-radius: 3px;
            margin-bottom: 6px;
        }

        .bz-monitor-status.active {
            color: #2ecc71;
        }

        .bz-monitor-status.standby {
            color: #f39c12;
        }
    `);

    // ============================================================================
    // AUTO-MONITOR: Lock System (Single Tab)
    // ============================================================================
    function acquireMonitorLock() {
        const now = Date.now();
        const lock = GM_getValue(MONITOR_STORAGE.instanceLock, null);

        if (!lock || now - lock.timestamp > MONITOR_CONFIG.lockDuration) {
            GM_setValue(MONITOR_STORAGE.instanceLock, {
                instanceId: THIS_INSTANCE_ID,
                timestamp: now
            });
            return true;
        }

        if (lock.instanceId === THIS_INSTANCE_ID) {
            GM_setValue(MONITOR_STORAGE.instanceLock, {
                instanceId: THIS_INSTANCE_ID,
                timestamp: now
            });
            return true;
        }

        return false;
    }

    function releaseMonitorLock() {
        const lock = GM_getValue(MONITOR_STORAGE.instanceLock, null);
        if (lock && lock.instanceId === THIS_INSTANCE_ID) {
            GM_setValue(MONITOR_STORAGE.instanceLock, null);
        }
    }

    function hasMonitorLock() {
        const lock = GM_getValue(MONITOR_STORAGE.instanceLock, null);
        return lock && lock.instanceId === THIS_INSTANCE_ID;
    }

    // ============================================================================
    // AUTO-MONITOR: Settings
    // ============================================================================
    function getMonitorSettings() {
        const defaults = {
            minProfit: MONITOR_CONFIG.defaultMinProfit,
            enabled: true,
            mode: 'both'  // 'npc', 'market', or 'both'
        };
        return GM_getValue(MONITOR_STORAGE.settings, defaults);
    }

    function saveMonitorSettings(settings) {
        GM_setValue(MONITOR_STORAGE.settings, settings);
    }

    function getMonitoredItems() {
        return GM_getValue(MONITOR_STORAGE.monitored, []);
    }

    function saveMonitoredItems(items) {
        GM_setValue(MONITOR_STORAGE.monitored, items.slice(0, MONITOR_CONFIG.maxItems));
    }

    function getMonitorDeals() {
        return GM_getValue(MONITOR_STORAGE.deals, []);
    }

    function saveMonitorDeals(deals) {
        GM_setValue(MONITOR_STORAGE.deals, deals);
    }

    // ============================================================================
    // AUTO-MONITOR: Scanning Logic
    // ============================================================================
    async function scanMonitoredItem(itemId, itemName) {
        try {
            const settings = getMonitorSettings();
            const [listings, teData] = await Promise.all([
                fetchBazaarListings(itemId),
                fetchTornExchangeData(itemId)
            ]);

            const npcData = npcPrices[itemId];
            let npcPrice = 0;

            if (typeof npcData === 'object' && npcData !== null) {
                npcPrice = npcData.npcPrice || 0;
            } else if (typeof npcData === 'number') {
                npcPrice = npcData;
            }

            const marketValue = teData.marketValue || 0;
            let bestDeal = null;

            // Check each listing
            for (const listing of listings) {
                const price = parseFloat(listing.price.toString().replace(/,/g, ''));

                // Calculate both types of profit
                const npcProfit = npcPrice > 0 ? (npcPrice - price) : 0;
                const marketProfit = marketValue > 0 ? (marketValue - price) : 0;

                // Determine which profit to use based on mode
                let profit = 0;
                let profitType = '';

                const mode = settings.mode || 'both';

                if (mode === 'npc') {
                    // NPC mode only
                    profit = npcProfit;
                    profitType = 'NPC';
                } else if (mode === 'market') {
                    // Market mode only
                    profit = marketProfit;
                    profitType = 'Market';
                } else {
                    // Both mode - use whichever is higher
                    profit = Math.max(npcProfit, marketProfit);
                    profitType = npcProfit > marketProfit ? 'NPC' : 'Market';
                }

                if (profit >= settings.minProfit) {
                    if (!bestDeal || profit > bestDeal.profit) {
                        bestDeal = {
                            itemId,
                            itemName,
                            listing,
                            profit,
                            profitType,
                            npcPrice,
                            marketValue,
                            timestamp: Date.now()
                        };
                    }
                }
            }

            return bestDeal;

        } catch (error) {
            console.error('[Monitor] Scan error for', itemName, ':', error);
            return null;
        }
    }

    async function performMonitorCycle() {
        if (monitorState.isScanning) return;
        if (!acquireMonitorLock()) {
            monitorState.isActive = false;
            updateFavoritesMonitorStatus();
            return;
        }

        monitorState.isActive = true;
        monitorState.isScanning = true;

        const monitored = getMonitoredItems();
        if (monitored.length === 0) {
            monitorState.isScanning = false;
            return;
        }

        // Get item to scan
        const item = monitored[monitorState.currentIndex];
        console.log(`[Monitor] Scanning ${item.name} (${monitorState.currentIndex + 1}/${monitored.length})`);

        const deal = await scanMonitoredItem(item.id, item.name);

        if (deal) {
            // Add or update deal
            const existingDeals = getMonitorDeals();
            const existingIndex = existingDeals.findIndex(d =>
                d.itemId === deal.itemId && d.listing.player_id === deal.listing.player_id
            );

            if (existingIndex !== -1) {
                // Update existing
                existingDeals[existingIndex] = deal;
            } else {
                // Add new
                existingDeals.push(deal);
            }

            // Sort by profit
            existingDeals.sort((a, b) => b.profit - a.profit);

            // Keep top 20
            const top20 = existingDeals.slice(0, 20);
            saveMonitorDeals(top20);

            console.log(`[Monitor] ✓ Found deal: ${deal.itemName} +$${deal.profit} (${deal.profitType})`);
        }

        // Move to next item
        monitorState.currentIndex = (monitorState.currentIndex + 1) % monitored.length;
        monitorState.isScanning = false;

        // Update alert button
        updateFavoritesMonitorAlert();
        updateFavoritesMonitorStatus();
    }

    // ============================================================================
    // AUTO-MONITOR: UI Updates
    // ============================================================================
    function updateFavoritesMonitorAlert() {
        const alertBtn = document.getElementById('bz-monitor-alert');
        if (!alertBtn) return;

        const settings = getMonitorSettings();
        const deals = getMonitorDeals();
        const hasDeals = deals.length > 0;

        // Check if monitor is disabled
        if (!settings.enabled) {
            alertBtn.className = 'bz-monitor-alert-btn';
            alertBtn.innerHTML = `<span style="opacity: 0.5;">⏸️</span> Monitor Disabled`;
            alertBtn.style.opacity = '0.6';
            return;
        }

        // Reset opacity if enabled
        alertBtn.style.opacity = '1';

        if (hasDeals) {
            alertBtn.className = 'bz-monitor-alert-btn has-deals';
            alertBtn.innerHTML = `<span class="bz-alert-icon">🔴</span> ${deals.length} Deal${deals.length > 1 ? 's' : ''} Found!`;
        } else {
            alertBtn.className = 'bz-monitor-alert-btn';
            alertBtn.innerHTML = `<span>🔍</span> No Deals Yet`;
        }
    }

    function updateFavoritesMonitorStatus() {
        const statusEl = document.getElementById('bz-monitor-status');
        if (!statusEl) return;

        const monitored = getMonitoredItems();
        const settings = getMonitorSettings();

        // Check if monitor is disabled
        if (!settings.enabled) {
            statusEl.textContent = 'Monitor: Disabled (Enable in settings)';
            statusEl.className = 'bz-monitor-status';
            statusEl.style.color = '#e74c3c';
            return;
        }

        if (monitored.length === 0) {
            statusEl.textContent = 'Monitor: Idle (No items)';
            statusEl.className = 'bz-monitor-status';
            statusEl.style.color = '';
        } else if (monitorState.isActive) {
            statusEl.textContent = `Monitor: Active (${monitored.length} items)`;
            statusEl.className = 'bz-monitor-status active';
            statusEl.style.color = '';
        } else {
            statusEl.textContent = `Monitor: Standby (Another tab active)`;
            statusEl.className = 'bz-monitor-status standby';
            statusEl.style.color = '';
        }
    }

    function showMonitorDeals() {
        const settings = getMonitorSettings();
        const deals = getMonitorDeals();

        // Check if monitor is disabled
        if (!settings.enabled) {
            alert('Monitor is currently disabled.\n\nEnable it in Settings (⚙️) to start scanning for deals.');
            return;
        }

        if (deals.length === 0) {
            alert('No deals found yet. Monitor is scanning in the background.');
            return;
        }

        renderMonitorDealsInSidebar(deals);
    }

    function renderMonitorDealsInSidebar(deals) {
        const sidebar = createSidebar();
        const settings = getMonitorSettings();

        const mode = settings.mode || 'both';
        const modeText = mode === 'npc' ? 'NPC Only' : mode === 'market' ? 'Market Only' : 'Best Profit';

        let html = `
            <div class="bz-header">
                <span class="bz-item-name">🔄 Auto-Monitor Deals</span>
                <button class="bz-close-btn">✕</button>
            </div>
            <div class="bz-npc-info">
                Monitoring ${getMonitoredItems().length} items
                <br>Mode: <span class="bz-npc-price">${modeText}</span>
                <br>Min Profit: <span class="bz-npc-price">$${settings.minProfit.toLocaleString()}</span>
            </div>
            <div class="bz-listings-title">💰 Best Deals Found</div>
        `;

        deals.forEach(deal => {
            const priceNum = parseFloat(deal.listing.price.toString().replace(/,/g, ''));
            const formattedPrice = `$${Math.round(priceNum).toLocaleString()}`;
            const isVisited = window._visitedBazaars.has(deal.listing.player_id);
            const visitedClass = isVisited ? 'visited' : '';
            const bazaarLink = `https://www.torn.com/bazaar.php?userId=${deal.listing.player_id}#/`;

            const profitHTML = `<span class="bz-profit npc-profit ${deal.profit >= 5000 ? 'big' : ''}">${deal.profitType} +$${deal.profit.toLocaleString()}</span>`;

            html += `
                <div class="bz-scan-item-header" data-item-id="${deal.itemId}" data-item-name="${deal.itemName}">
                    <span class="bz-scan-item-name">${deal.itemName}</span>
                    <span class="bz-scan-best-profit">+$${deal.profit.toLocaleString()}</span>
                </div>
                <div class="bz-listing ${visitedClass} profitable" data-player-id="${deal.listing.player_id}" data-url="${bazaarLink}">
                    ${profitHTML}
                    <a href="${bazaarLink}" target="_blank" class="bz-player-name" onclick="event.stopPropagation()">
                        ${deal.listing.player_name || 'Unknown'}
                    </a>
                    <div class="bz-listing-details">
                        <span class="bz-price">${formattedPrice}</span>
                        <span class="bz-qty">Qty: ${deal.listing.quantity}</span>
                    </div>
                </div>
            `;
        });

        html += `
            <div style="margin-top: 10px;">
                <div class="bz-refresh-btn" id="bz-clear-monitor-deals">
                    🗑️ Clear All Deals
                </div>
            </div>
        `;

        sidebar.innerHTML = html;

        // Event handlers
        sidebar.querySelector('.bz-close-btn').addEventListener('click', () => {
            sidebar.remove();
        });

        sidebar.querySelector('#bz-clear-monitor-deals').addEventListener('click', () => {
            if (confirm('Clear all monitored deals?')) {
                saveMonitorDeals([]);
                updateFavoritesMonitorAlert();
                sidebar.remove();
            }
        });

        sidebar.querySelectorAll('.bz-scan-item-header').forEach(header => {
            header.addEventListener('click', function() {
                const itemId = this.dataset.itemId;
                const itemName = this.dataset.itemName;
                processItem(itemName, itemId);
            });
        });

        sidebar.querySelectorAll('.bz-listing').forEach(listing => {
            listing.addEventListener('click', function() {
                const playerId = this.dataset.playerId;
                const url = this.dataset.url;
                if (playerId) {
                    window._visitedBazaars.add(playerId);
                    this.classList.add('visited');
                }
                window.open(url, '_blank');
            });
        });
    }

    // ============================================================================
    // EXISTING FUNCTIONS (Unchanged)
    // ============================================================================

    async function fetchNPCCatalog() {
        const key = GM_getValue(S_KEY, '');
        if (!key) {
            const inputKey = prompt('Enter your Torn API Key for NPC Profit tracking:');
            if (inputKey) {
                GM_setValue(S_KEY, inputKey.trim());
                return fetchNPCCatalog();
            }
            return null;
        }

        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://api.torn.com/torn/?selections=items&key=${key}`,
                onload: (res) => {
                    try {
                        const data = JSON.parse(res.responseText);
                        if (data.items) {
                            const catalog = {};
                            const nameMap = {};

                            for (const id in data.items) {
                                catalog[id] = data.items[id].sell_price || 0;
                                nameMap[data.items[id].name] = id;
                            }

                            GM_setValue(S_CAT, JSON.stringify(catalog));
                            GM_setValue(S_ITEM_NAMES, JSON.stringify(nameMap));
                            GM_setValue(S_CAT_TIMESTAMP, Date.now());
                            resolve(catalog);
                        } else {
                            resolve(null);
                        }
                    } catch (e) {
                        resolve(null);
                    }
                }
            });
        });
    }

    async function fetchTornItemValue(itemId) {
        return new Promise((resolve) => {
            const apiKey = GM_getValue(S_KEY, '');
            if (!apiKey) {
                resolve(null);
                return;
            }

            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://api.torn.com/torn/${itemId}?selections=items&key=${apiKey}`,
                onload: (response) => {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data && data.items && data.items[itemId]) {
                            const marketValue = data.items[itemId].market_value;
                            resolve(marketValue);
                        } else {
                            resolve(null);
                        }
                    } catch (e) {
                        resolve(null);
                    }
                },
                onerror: () => resolve(null)
            });
        });
    }

    async function fetchTornExchangeData(itemId, forceRefresh = false) {
        return new Promise(async (resolve) => {
            const cached = window._marketValueCache[itemId];
            const now = Date.now();

            if (cached && !forceRefresh && (now - cached.timestamp) < CACHE_EXPIRATION_MS) {
                resolve({ marketValue: cached.marketValue, bestBuyer: cached.bestBuyer });
                return;
            }

            const [tornValue, tePrice, bestBuyer] = await Promise.all([
                fetchTornItemValue(itemId),
                new Promise(res => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: `https://tornexchange.com/api/te_price?item_id=${itemId}`,
                        onload: (response) => {
                            try {
                                const data = JSON.parse(response.responseText);
                                if (data && data.status === 'success' && data.data && data.data.te_price) {
                                    res(parseFloat(data.data.te_price));
                                } else {
                                    res(null);
                                }
                            } catch (e) {
                                res(null);
                            }
                        },
                        onerror: () => res(null)
                    });
                }),
                new Promise(res => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: `https://tornexchange.com/api/best_listing?item_id=${itemId}`,
                        onload: (response) => {
                            try {
                                const data = JSON.parse(response.responseText);
                                if (data && data.status === 'success' && data.data) {
                                    res(data.data);
                                } else {
                                    res(null);
                                }
                            } catch (e) {
                                res(null);
                            }
                        },
                        onerror: () => res(null)
                    });
                })
            ]);

            const marketValue = tornValue || tePrice;
            const result = { marketValue, bestBuyer, timestamp: Date.now() };
            window._marketValueCache[itemId] = result;
            resolve({ marketValue, bestBuyer });
        });
    }

    async function fetchBazaarListings(itemId) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://weav3r.dev/api/marketplace/${itemId}`,
                onload: (res) => {
                    try {
                        const data = JSON.parse(res.responseText);
                        if (data && data.listings) {
                            resolve(data.listings);
                        } else {
                            resolve([]);
                        }
                    } catch (e) {
                        resolve([]);
                    }
                },
                onerror: () => resolve([])
            });
        });
    }

    function createSidebar() {
        let sidebar = document.getElementById('bazaar-sidebar');
        if (!sidebar) {
            sidebar = document.createElement('div');
            sidebar.id = 'bazaar-sidebar';
            document.body.appendChild(sidebar);
            makeDraggable(sidebar);
        }
        return sidebar;
    }

    function makeDraggable(sidebar) {
        let isDragging = false;
        let currentX, currentY, initialX, initialY;
        let xOffset = 0;
        let yOffset = 0;

        sidebar.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            if (e.target.closest('.bz-header') && !e.target.closest('.bz-close-btn')) {
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
                isDragging = true;
                sidebar.classList.add('dragging');
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;

                const rect = sidebar.getBoundingClientRect();
                const maxX = window.innerWidth - rect.width;
                const maxY = window.innerHeight - rect.height;

                xOffset = Math.max(0, Math.min(xOffset, maxX));
                yOffset = Math.max(0, Math.min(yOffset, maxY));

                sidebar.style.left = xOffset + 'px';
                sidebar.style.top = yOffset + 'px';
            }
        }

        function dragEnd() {
            if (isDragging) {
                isDragging = false;
                sidebar.classList.remove('dragging');
            }
        }
    }

    function showLoading(sidebar) {
        sidebar.innerHTML = `
            <div class="bz-header">
                <span class="bz-item-name">Loading...</span>
            </div>
            <div class="bz-loading">
                <div class="bz-spinner"></div>
                Fetching deals...
            </div>
        `;
    }

    function renderSidebar(itemName, itemId, marketValue, bestBuyer, listings) {
        const sidebar = createSidebar();
        const npcData = npcPrices[itemId];
        let npcPrice = 0;

        if (typeof npcData === 'object' && npcData !== null) {
            npcPrice = npcData.npcPrice || 0;
        } else if (typeof npcData === 'number') {
            npcPrice = npcData;
        }

        const profitableListings = [];
        const otherListings = [];

        listings.forEach(listing => {
            const price = parseFloat(listing.price.toString().replace(/,/g, ''));
            const profit = npcPrice - price;

            if (profit > 0 && npcPrice > 0) {
                profitableListings.push({ ...listing, npcProfit: profit });
            } else {
                otherListings.push(listing);
            }
        });

        profitableListings.sort((a, b) => b.npcProfit - a.npcProfit);
        otherListings.sort((a, b) => {
            const priceA = parseFloat(a.price.toString().replace(/,/g, ''));
            const priceB = parseFloat(b.price.toString().replace(/,/g, ''));
            return priceA - priceB;
        });

        let showNPCDeals = true;

        function updateListings() {
            let sortedListings;
            if (showNPCDeals) {
                sortedListings = [...profitableListings.slice(0, 20), ...otherListings.slice(0, 20)];
            } else {
                sortedListings = otherListings.slice(0, 20);
            }
            const top5 = sortedListings.slice(0, 20);

            let listingsHTML = '';
            if (top5.length > 0) {
                const title = showNPCDeals && profitableListings.length > 0 ?
                    '💰 NPC Profitable Deals First' :
                    '📊 Best Bazaar Deals';

                listingsHTML = `<div class="bz-listings-title">${title}</div>`;

                top5.forEach(listing => {
                    const priceNum = parseFloat(listing.price.toString().replace(/,/g, ''));
                    const formattedPrice = `$${Math.round(priceNum).toLocaleString()}`;
                    const isVisited = window._visitedBazaars.has(listing.player_id);
                    const visitedClass = isVisited ? 'visited' : '';
                    const isProfitable = listing.npcProfit && listing.npcProfit > 0;
                    const profitableClass = isProfitable ? 'profitable' : '';

                    let profitHTML = '';
                    if (showNPCDeals && isProfitable) {
                        const tierClass = listing.npcProfit >= 500 ? 'big' : '';
                        profitHTML = `<span class="bz-profit npc-profit ${tierClass}">NPC +$${listing.npcProfit.toLocaleString()}</span>`;
                    } else if (marketValue) {
                        const diff = priceNum - marketValue;
                        const percent = ((diff / marketValue) * 100).toFixed(1);
                        const sign = diff > 0 ? '+' : '';
                        let profitClass = 'neutral';
                        if (percent < -0.5) profitClass = 'positive';
                        else if (percent > 0.5) profitClass = 'negative';

                        profitHTML = `<span class="bz-profit ${profitClass}">${sign}${percent}%</span>`;
                    }

                    const bazaarLink = `https://www.torn.com/bazaar.php?userId=${listing.player_id}#/`;

                    listingsHTML += `
                        <div class="bz-listing ${visitedClass} ${profitableClass}" data-player-id="${listing.player_id}" data-url="${bazaarLink}">
                            ${profitHTML}
                            <a href="${bazaarLink}" target="_blank" class="bz-player-name" onclick="event.stopPropagation()">
                                ${listing.player_name || 'Unknown'}
                            </a>
                            <div class="bz-listing-details">
                                <span class="bz-price">${formattedPrice}</span>
                                <span class="bz-qty">Qty: ${listing.quantity}</span>
                            </div>
                        </div>
                    `;
                });
            } else {
                listingsHTML = '<div class="bz-empty">No bazaar listings found</div>';
            }

            if (showNPCDeals && npcPrice > 0 && profitableListings.length === 0 && listings.length > 0) {
                listingsHTML += `
                    <div class="bz-no-profit">
                        ℹ️ No deals below NPC price found.<br>
                        <small>Showing cheapest bazaar listings instead.</small>
                    </div>
                `;
            }

            const listingsContainer = sidebar.querySelector('.bz-listings-container');
            if (listingsContainer) {
                listingsContainer.innerHTML = listingsHTML;

                listingsContainer.querySelectorAll('.bz-listing').forEach(listing => {
                    listing.addEventListener('click', function() {
                        const playerId = this.dataset.playerId;
                        const url = this.dataset.url;
                        if (playerId) {
                            window._visitedBazaars.add(playerId);
                            this.classList.add('visited');
                            const link = this.querySelector('a');
                            if (link) link.style.color = '#800080';
                        }
                        window.open(url, '_blank');
                    });
                });
            }
        }

        let npcInfoHTML = '';
        if (Object.keys(npcPrices).length > 0) {
            if (npcPrice > 0) {
                const profitCount = profitableListings.length;
                npcInfoHTML = `
                    <div class="bz-npc-info">
                        NPC Sell Price: <span class="bz-npc-price">$${npcPrice.toLocaleString()}</span>
                        ${profitCount > 0 ? `<div class="bz-profit-notice">🎉 ${profitCount} profitable deal(s) found!</div>` : ''}
                    </div>
                `;
            } else {
                npcInfoHTML = `
                    <div class="bz-npc-info" style="border-color: #888; color: #888;">
                        ℹ️ No NPC price available for this item
                    </div>
                `;
            }
        } else {
            npcInfoHTML = `
                <div class="bz-npc-info" style="border-color: #FF4444; color: #FF4444;">
                    ⚠️ NPC prices not loaded. Please refresh the page or check your API key.
                </div>
            `;
        }

        let marketInfoHTML = '';
        if (marketValue) {
            marketInfoHTML = `
                <div class="bz-market-info">
                    Market Value: <span class="bz-market-value">$${marketValue.toLocaleString()}</span>
            `;

            if (bestBuyer && bestBuyer.trader) {
                marketInfoHTML += `
                    <div class="bz-best-trader">
                        Best Trader: <span class="bz-best-price">$${Math.round(bestBuyer.price).toLocaleString()}</span> by ${bestBuyer.trader}
                    </div>
                `;
            }

            marketInfoHTML += `</div>`;
        }

        const toggleHTML = `
            <div class="bz-toggle-container">
                <label class="bz-toggle-label">
                    <input type="checkbox" class="bz-toggle-input" ${showNPCDeals ? 'checked' : ''}>
                    <span class="bz-toggle-slider"></span>
                    <span class="bz-toggle-text">${showNPCDeals ? 'NPC Deals' : 'Market Deals'}</span>
                </label>
            </div>
        `;

        const refreshButtonHTML = marketValue ? `
            <div class="bz-refresh-btn" id="bz-refresh-mv">
                🔄 Refresh Market Data
            </div>
        ` : '';

        const encodedItemName = encodeURIComponent(itemName);
        const teLink = `https://tornexchange.com/listings?model_name_contains=${encodedItemName}&order_by=&status=`;

        sidebar.innerHTML = `
            <div class="bz-header">
                <span class="bz-item-name">${itemName}</span>
                <button class="bz-close-btn">✕</button>
            </div>
            ${npcInfoHTML}
            ${marketInfoHTML}
            ${refreshButtonHTML}
            ${toggleHTML}
            <div class="bz-listings-container"></div>
            <a href="${teLink}" target="_blank" class="bz-te-link">View All TE Listings</a>
        `;

        updateListings();

        const refreshBtn = sidebar.querySelector('#bz-refresh-mv');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', async () => {
                refreshBtn.textContent = '⏳ Refreshing...';
                refreshBtn.style.pointerEvents = 'none';
                delete window._marketValueCache[itemId];
                const teData = await fetchTornExchangeData(itemId, true);
                renderSidebar(itemName, itemId, teData.marketValue, teData.bestBuyer, listings);
            });
        }

        const toggleInput = sidebar.querySelector('.bz-toggle-input');
        const toggleText = sidebar.querySelector('.bz-toggle-text');

        toggleInput.addEventListener('change', function() {
            showNPCDeals = this.checked;
            toggleText.textContent = showNPCDeals ? 'NPC Deals' : 'Market Deals';
            updateListings();
        });

        sidebar.querySelector('.bz-close-btn').addEventListener('click', () => {
            sidebar.remove();
        });
    }

    function renderScanAllResults(dealsData) {
        const sidebar = createSidebar();
        let showNPCDeals = true;

        function updateScanListings() {
            let html = `
                <div class="bz-header">
                    <span class="bz-item-name">Top 20 ${showNPCDeals ? 'NPC' : 'Market'} Deals</span>
                    <button class="bz-close-btn">✕</button>
                </div>
            `;

            const toggleHTML = `
                <div class="bz-toggle-container">
                    <label class="bz-toggle-label">
                        <input type="checkbox" class="bz-toggle-input" ${showNPCDeals ? 'checked' : ''}>
                        <span class="bz-toggle-slider"></span>
                        <span class="bz-toggle-text">${showNPCDeals ? 'NPC Deals' : 'Market Deals'}</span>
                    </label>
                </div>
            `;

            const refreshButtonHTML = `
                <div class="bz-refresh-btn" id="bz-refresh-scan-mv">
                    🔄 Refresh Market Data
                </div>
            `;

            html += toggleHTML;
            html += refreshButtonHTML;

            if (dealsData.length === 0) {
                html += '<div class="bz-empty">No profitable deals found in favorites</div>';
            } else {
                let displayDeals = [...dealsData];

                if (showNPCDeals) {
                    html += `<div class="bz-listings-title">💰 Best NPC Profits Available</div>`;
                } else {
                    displayDeals = displayDeals.map(deal => {
                        const priceNum = parseFloat(deal.listing.price.toString().replace(/,/g, ''));
                        const marketValue = deal.marketValue || 0;
                        let marketDiscount = 0;

                        if (marketValue > 0) {
                            marketDiscount = ((marketValue - priceNum) / marketValue) * 100;
                        }

                        return { ...deal, marketDiscount };
                    }).sort((a, b) => b.marketDiscount - a.marketDiscount);

                    html += `<div class="bz-listings-title">📊 Best Market Value Deals</div>`;
                }

                displayDeals.forEach(deal => {
                    const priceNum = parseFloat(deal.listing.price.toString().replace(/,/g, ''));
                    const formattedPrice = `$${Math.round(priceNum).toLocaleString()}`;
                    const isVisited = window._visitedBazaars.has(deal.listing.player_id);
                    const visitedClass = isVisited ? 'visited' : '';
                    const bazaarLink = `https://www.torn.com/bazaar.php?userId=${deal.listing.player_id}#/`;

                    let profitHTML = '';
                    if (showNPCDeals) {
                        profitHTML = `<span class="bz-profit npc-profit ${deal.profit >= 500 ? 'big' : ''}">NPC +$${deal.profit.toLocaleString()}</span>`;
                    } else {
                        const marketValue = deal.marketValue || 0;
                        if (marketValue > 0) {
                            const diff = priceNum - marketValue;
                            const percent = ((diff / marketValue) * 100).toFixed(1);
                            const sign = diff > 0 ? '+' : '';
                            let profitClass = 'neutral';
                            if (percent < -0.5) profitClass = 'positive';
                            else if (percent > 0.5) profitClass = 'negative';

                            profitHTML = `<span class="bz-profit ${profitClass}">${sign}${percent}%</span>`;
                        }
                    }

                    html += `
                        <div class="bz-scan-item-header" data-item-id="${deal.itemId}" data-item-name="${deal.itemName}">
                            <span class="bz-scan-item-name">${deal.itemName}</span>
                            <span class="bz-scan-best-profit">${showNPCDeals ? '+$' + deal.profit.toLocaleString() : (deal.marketDiscount ? deal.marketDiscount.toFixed(1) + '%' : 'N/A')}</span>
                        </div>
                        <div class="bz-listing ${visitedClass} ${showNPCDeals ? 'profitable' : ''}" data-player-id="${deal.listing.player_id}" data-url="${bazaarLink}">
                            ${profitHTML}
                            <a href="${bazaarLink}" target="_blank" class="bz-player-name" onclick="event.stopPropagation()">
                                ${deal.listing.player_name || 'Unknown'}
                            </a>
                            <div class="bz-listing-details">
                                <span class="bz-price">${formattedPrice}</span>
                                <span class="bz-qty">Qty: ${deal.listing.quantity}</span>
                            </div>
                        </div>
                    `;
                });
            }

            sidebar.innerHTML = html;

            const toggleInput = sidebar.querySelector('.bz-toggle-input');
            const toggleText = sidebar.querySelector('.bz-toggle-text');

            if (toggleInput && toggleText) {
                toggleInput.addEventListener('change', function() {
                    showNPCDeals = this.checked;
                    toggleText.textContent = showNPCDeals ? 'NPC Deals' : 'Market Deals';
                    updateScanListings();
                });
            }

            const refreshBtn = sidebar.querySelector('#bz-refresh-scan-mv');
            if (refreshBtn) {
                refreshBtn.addEventListener('click', async () => {
                    refreshBtn.textContent = '⏳ Refreshing...';
                    refreshBtn.style.pointerEvents = 'none';

                    dealsData.forEach(deal => {
                        delete window._marketValueCache[deal.itemId];
                    });

                    const updatedDeals = [];
                    for (const deal of dealsData) {
                        const teData = await fetchTornExchangeData(deal.itemId, true);
                        updatedDeals.push({
                            ...deal,
                            marketValue: teData.marketValue || 0
                        });
                    }

                    dealsData.length = 0;
                    dealsData.push(...updatedDeals);
                    updateScanListings();
                });
            }

            sidebar.querySelectorAll('.bz-scan-item-header').forEach(header => {
                header.addEventListener('click', function() {
                    const itemId = this.dataset.itemId;
                    const itemName = this.dataset.itemName;
                    processItem(itemName, itemId);
                });
            });

            sidebar.querySelectorAll('.bz-listing').forEach(listing => {
                listing.addEventListener('click', function() {
                    const playerId = this.dataset.playerId;
                    const url = this.dataset.url;
                    if (playerId) {
                        window._visitedBazaars.add(playerId);
                        this.classList.add('visited');
                        const link = this.querySelector('a');
                        if (link) link.style.color = '#800080';
                    }
                    window.open(url, '_blank');
                });
            });

            sidebar.querySelector('.bz-close-btn').addEventListener('click', () => {
                sidebar.remove();
            });
        }

        updateScanListings();
    }

    async function scanAllFavorites(specificCategory = null) {
        const sidebar = createSidebar();
        showLoading(sidebar);

        const favs = window.BZ_FAVOURITES ? window.BZ_FAVOURITES.getAll() : {};
        const selectedCategories = window.BZ_FAVOURITES ? window.BZ_FAVOURITES.getSelectedCategories() : new Set();

        let favItems = Object.values(favs);

        if (specificCategory) {
            favItems = favItems.filter(item => item.category === specificCategory);
        } else if (selectedCategories.size > 0) {
            favItems = favItems.filter(item => selectedCategories.has(item.category));
        }

        if (favItems.length === 0) {
            sidebar.innerHTML = `
                <div class="bz-header">
                    <span class="bz-item-name">Scan Results</span>
                    <button class="bz-close-btn">✕</button>
                </div>
                <div class="bz-empty">No favorites to scan${specificCategory ? ` in ${specificCategory}` : selectedCategories.size > 0 ? ' in selected categories' : ''}</div>
            `;
            sidebar.querySelector('.bz-close-btn').addEventListener('click', () => {
                sidebar.remove();
            });
            return;
        }

        const allDeals = [];

        for (const item of favItems) {
            const [listings, teData] = await Promise.all([
                fetchBazaarListings(item.id),
                fetchTornExchangeData(item.id)
            ]);

            const npcData = npcPrices[item.id];
            let npcPrice = 0;

            if (typeof npcData === 'object' && npcData !== null) {
                npcPrice = npcData.npcPrice || 0;
            } else if (typeof npcData === 'number') {
                npcPrice = npcData;
            }

            if (listings.length > 0) {
                let bestListing = null;
                let bestProfit = 0;

                listings.forEach(listing => {
                    const price = parseFloat(listing.price.toString().replace(/,/g, ''));
                    const profit = npcPrice - price;

                    if (profit > bestProfit) {
                        bestProfit = profit;
                        bestListing = listing;
                    }
                });

                const cheapestListing = listings.reduce((min, listing) => {
                    const price = parseFloat(listing.price.toString().replace(/,/g, ''));
                    const minPrice = parseFloat(min.price.toString().replace(/,/g, ''));
                    return price < minPrice ? listing : min;
                });

                const listingToUse = (bestListing && bestProfit > 0) ? bestListing : cheapestListing;
                const profitToUse = (bestListing && bestProfit > 0) ? bestProfit : 0;

                allDeals.push({
                    itemId: item.id,
                    itemName: item.name,
                    profit: profitToUse,
                    listing: listingToUse,
                    marketValue: teData.marketValue || 0
                });
            }
        }

        allDeals.sort((a, b) => b.profit - a.profit);
        const top20 = allDeals.slice(0, 20);

        renderScanAllResults(top20);
    }

    async function processItem(itemName, itemId) {
        const sidebar = createSidebar();
        showLoading(sidebar);

        const [teData, listings] = await Promise.all([
            fetchTornExchangeData(itemId),
            fetchBazaarListings(itemId)
        ]);

        window._cachedListings[itemId] = listings;

        renderSidebar(
            itemName,
            itemId,
            teData.marketValue,
            teData.bestBuyer,
            listings
        );
    }

    function attachListeners() {
        const observer = new MutationObserver(() => {
            document.querySelectorAll('button[aria-controls*="itemInfo"]').forEach(btn => {
                if (btn.dataset.bazaarHooked) return;
                btn.dataset.bazaarHooked = 'true';

                btn.addEventListener('click', () => {
                    setTimeout(() => {
                        const tile = btn.closest('[class*="itemTile"], li, [class*="row"]');
                        if (!tile) return;

                        const nameEl = tile.querySelector('div[class*="name"], span[class*="name"], a[class*="name"]');
                        if (!nameEl) return;

                        const itemName = nameEl.textContent.trim();
                        const idParts = btn.getAttribute('aria-controls').split('-');
                        const itemId = idParts[idParts.length - 1];

                        if (window.BZ_FAVOURITES && typeof window.BZ_FAVOURITES.save === 'function') {
                            window.BZ_FAVOURITES.save(itemId, itemName);
                        }

                        processItem(itemName, itemId);
                    }, 100);
                });
            });

            document.querySelectorAll('button[aria-label^="Show info:"]').forEach(btn => {
                if (btn.dataset.bazaarEyeHooked) return;
                btn.dataset.bazaarEyeHooked = 'true';

                btn.addEventListener('click', () => {
                    setTimeout(() => {
                        const ariaLabel = btn.getAttribute('aria-label');
                        const itemName = ariaLabel.replace('Show info: ', '').trim();

                        if (!itemName) return;

                        const itemId = itemNameToId[itemName];

                        if (itemId) {
                            if (window.BZ_FAVOURITES && typeof window.BZ_FAVOURITES.save === 'function') {
                                window.BZ_FAVOURITES.save(itemId, itemName);
                            }
                            processItem(itemName, itemId);
                        }
                    }, 100);
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // ============================================================================
    // AUTO-MONITOR: Start Background Cycle
    // ============================================================================
    function startMonitorCycle() {
        function scheduleNextScan() {
            const settings = getMonitorSettings();
            if (settings.enabled) {
                performMonitorCycle();
            }

            // Schedule next scan with random interval (15-25 seconds)
            const nextInterval = getRandomScanInterval();
            setTimeout(scheduleNextScan, nextInterval);
        }

        // Start first scan after random delay
        const initialDelay = getRandomScanInterval();
        setTimeout(scheduleNextScan, initialDelay);

        // Release lock on page unload
        window.addEventListener('beforeunload', () => {
            releaseMonitorLock();
        });

        console.log('[Monitor] Background cycle started with random intervals (18-30s)');
    }

    // ============================================================================
    // INITIALIZATION
    // ============================================================================
    setTimeout(async () => {
        const cachedCatalog = GM_getValue(S_CAT, '');
        const cachedNames = GM_getValue(S_ITEM_NAMES, '');
        const catalogTimestamp = GM_getValue(S_CAT_TIMESTAMP, 0);
        const now = Date.now();
        const cacheAge = now - catalogTimestamp;

        if (cachedCatalog && cachedNames && cacheAge < NPC_CACHE_DURATION) {
            npcPrices = JSON.parse(cachedCatalog);
            itemNameToId = JSON.parse(cachedNames);
            const daysOld = Math.floor(cacheAge / (24 * 60 * 60 * 1000));
            console.log('NPC Profit: Loaded', Object.keys(npcPrices).length, 'items from cache (', daysOld, 'days old)');
        } else {
            console.log('NPC Profit: Cache missing or expired, fetching from API...');
            const catalog = await fetchNPCCatalog();
            if (catalog) {
                npcPrices = catalog;
                const cachedNamesNew = GM_getValue(S_ITEM_NAMES, '');
                if (cachedNamesNew) {
                    itemNameToId = JSON.parse(cachedNamesNew);
                }
                console.log('NPC Profit: Loaded', Object.keys(npcPrices).length, 'items from API and cached');
            } else {
                console.error('NPC Profit: Failed to load catalog');
            }
        }

        attachListeners();
        startMonitorCycle(); // Start the background monitor
    }, 2000);

    window.processItem = processItem;
    window.scanAllFavorites = scanAllFavorites;
    window.showMonitorDeals = showMonitorDeals; // Expose for favorites module

})();

// =====================================================
// BAZAAR FAVOURITES MODULE (With Monitor Integration)
// =====================================================
(function () {
    'use strict';

    const FAV_KEY = 'bz_favourite_items';
    const LOCK_KEY = 'bz_favourite_lock';
    const CATEGORY_SELECTION_KEY = 'bz_category_selection';
    const MONITOR_KEY = 'bz_monitored_items';
    const MONITOR_SETTINGS_KEY = 'bz_monitor_settings';

    const MAX_MONITORED = 10;

    const ITEM_CATEGORIES = {
        'Primary': [
            'Sawed-Off Shotgun', 'Benelli M1 Tactical', 'MP5 Navy', 'P90', 'M4A1 Colt Carbine',
            'Benelli M4 Super', 'M16 A2 Rifle', 'Steyr AUG', 'M249 SAW', '9mm Uzi', 'XM8 Rifle',
            'Enfield SA-80', 'Mag 7', 'Vektor CR-21', 'Heckler & Koch SL8', 'SIG 550',
            'Bushmaster Carbon 15', 'Ithaca 37', 'AK-47',
            'Tavor TAR-21', 'Thompson'
        ],
        'Secondary': [
            'Raven MP25', 'Beretta M9', 'USP', 'Fiveseven', 'Magnum', 'Desert Eagle', 'Taser',
            'Cobra Derringer', 'S&W Revolver', 'Qsz-92', 'Skorpion', 'Harpoon', 'BT MP9',
            'Beretta 92FS', 'Crossbow'
        ],
        'Melee': [
            'Knuckle Dusters', 'Kitchen Knife', 'Axe', 'Scimitar', 'Chainsaw', 'Samurai Sword',
            'Ninja Claws', 'Butterfly Knife', 'Claymore Sword', 'Swiss Army Knife', 'Kama',
            'Katana', 'Twin Tiger Hooks', 'Wushu Double Axes', 'Guandao', 'Ice Pick',
            'Cricket Bat', 'Golf Club', 'Kodachi', 'Macana'
        ],
        'Cars': [
            'Alpha Milano 156', 'Bavaria M5', 'Bavaria X5', 'Bavaria Z8', 'Bedford Nova',
            'Bedford Racer', 'Coche Basurero', 'Chevalier CVR', 'Chevalier CZ06', 'Colina Tanprice',
            'Cosmos EX', 'Çagoutte 10-6', 'Dart Rampager', 'Echo Quadrato', 'Echo R8',
            'Echo S3', 'Echo S4', 'Edomondo ACD', 'Edomondo IR', 'Edomondo Localé',
            'Edomondo NSX', 'Edomondo S2', 'Invader H3', 'Knight Firebrand', 'Lambrini Torobravo',
            'Limoen Saxon', 'Lolo 458', 'Mercia SLR', 'Nano Cavalier', 'Nano Pioneer',
            'Oceania SS', 'Papani Colé', 'Stålhög 860', 'Sturmfahrt 111', 'Tabata RM2',
            'Trident', 'Tsubasa Impressor', 'Veloria LFA', 'Verpestung Insecta', 'Verpestung Sport',
            'Vita Bravo', 'Volt GT', 'Volt MNG', 'Volt RS', 'Weston Marlin 177',
            'Wington GGU', 'Yotsuhada EVX', 'Zaibatsu GT-R', 'Zaibatsu Macro'
        ],
        'Clothing': [
            'Bikini', 'Coconut Bra', 'Diving Gloves', 'Flippers', 'Mountie Hat',
            'Proda Sunglasses', 'Snorkel', 'Speedo', 'Sports Shades', 'Trench Coat', 'Wetsuit', 'Pencil Skirt'
        ],
        'High Roller': [
            'Negev NG-5', 'Minigun', 'Jackhammer', 'SIG 552', 'Stooner 96',
            'China Lake', 'Flamethrower', 'Type 98 Anti Tank', 'Naval Cutlass', 'Flexible Body Armor', 'Liquid Body Armor', 'Small Suitcase',
            'Donator Pack'
        ],
        'Tools': [
            'Skeleton Key', 'ID Badge'
        ],
        'Armor': [
            'Bulletproof Vest', 'Chain Mail', 'Construction Helmet', 'Flak Jacket', 'Full Body Armor',
            'Hiking Boots', 'Kevlar Gloves', 'Leather Boots', 'Leather Helmet', 'Leather Gloves',
            'Leather Vest', 'Leather Pants', 'Outer Tactical Vest', 'Police Vest', 'Safety Boots',
            'WWII Helmet'
        ],
        'Miscellaneous': [
            'Afro Comb', 'Ambergris Lump', 'Bank Check', 'Bear Gall', 'Bearer Bond',
            'Big Al\'s Gun Oil', 'Birth Certificate', 'Boat Engine', 'Counterfeit Manga',
            'Diploma', 'Donator Pack', 'Driver\'s License', 'Drug Pack', 'Ephedrine Powder',
            'Ergotamine Ampoule', 'Fire Hydrant', 'Fishing Rod', 'Jade Buddha', 'Insulin',
            'Lawyer Business Card', 'License Plate', 'Machine Part', 'Maneki Neko',
            'Medical Supply Pack', 'Natural Pearls', 'Pangolin Scales', 'Parking Permit',
            'Passport', 'Perfume', 'Points', 'Prescription', 'Raw Ivory', 'Safrole Oil',
            'Shark Fin', 'Small Explosive Device', 'Snowboard', 'Subway Pass',
            'Tailor\'s Dummy', 'Tiger Bone Powder', 'Tractor Part', 'Travel Visa',
            'Turtle Shell', 'Whale Meat', 'Wind-up Toy', 'Travel Mug', 'Yucca Plant',
            'DVD Player', 'Headphones'
        ],
        'Consumables': [
            'Blood Bag', 'Can of Red Bull', 'Can of Rockstar Rudolph', 'Can of Santa Shooters',
            'Empty Blood Bag', 'Energy Drink', 'Erotic DVD', 'Feathery Hotel Coupon',
            'FHC', 'First Aid Kit', 'LSD', 'Morphine', 'Small Medkit', 'Speed', 'Vicodin', 'Xanax'
        ]
    };

    function getAll() { return GM_getValue(FAV_KEY, {}); }
    function isLocked() { return GM_getValue(LOCK_KEY, false); }

    function getSelectedCategories() {
        const saved = GM_getValue(CATEGORY_SELECTION_KEY, []);
        return new Set(saved);
    }

    function saveSelectedCategories(categories) {
        GM_setValue(CATEGORY_SELECTION_KEY, Array.from(categories));
    }

    function getMonitoredItems() {
        return GM_getValue(MONITOR_KEY, []);
    }

    function saveMonitoredItems(items) {
        GM_setValue(MONITOR_KEY, items);
    }

    function getMonitorSettings() {
        const defaults = { minProfit: 1000, enabled: true };
        return GM_getValue(MONITOR_SETTINGS_KEY, defaults);
    }

    function saveMonitorSettings(settings) {
        GM_setValue(MONITOR_SETTINGS_KEY, settings);
    }

    function save(id, name) {
        if (isLocked()) return;
        const favs = getAll();
        if (!favs[id]) {
            let category = 'Uncategorized';
            for (const [catName, items] of Object.entries(ITEM_CATEGORIES)) {
                if (items.includes(name)) {
                    category = catName;
                    break;
                }
            }
            favs[id] = { id, name, category };
            GM_setValue(FAV_KEY, favs);
            render();
        }
    }

    function remove(id) {
        const favs = getAll();
        delete favs[id];
        GM_setValue(FAV_KEY, favs);

        // Remove from monitored if present
        const monitored = getMonitoredItems();
        const filtered = monitored.filter(item => item.id !== id);
        if (filtered.length !== monitored.length) {
            saveMonitoredItems(filtered);
        }

        render();
    }

    function createUI() {
        if (document.getElementById('bz-fav-btn')) return;

        GM_addStyle(`
            #bz-fav-panel {
                position: fixed;
                right: 50px;
                top: 10px;
                width: 144px;
                background: #1a1a1a;
                border: 2px solid #696969;
                border-radius: 8px;
                padding: 12px;
                color: #fff;
                display: none;
                z-index: 9999;
                max-height: 575px;
                overflow-y: auto;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
            }

            #bz-fav-panel::-webkit-scrollbar {
                width: 8px;
            }

            #bz-fav-panel::-webkit-scrollbar-thumb {
                background: #292929;
                border-radius: 4px;
            }

            #bz-fav-btn {
                position: fixed;
                right: 10px;
                top: 10px;
                width: 30px;
                height: 30px;
                background: #1a1a1a;
                border: 2px solid #696969;
                border-radius: 8px;
                color: #FFD700;
                font-weight: bold;
                font-size: 18px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                z-index: 9999;
                box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
                transition: all 0.2s ease;
            }

            #bz-fav-btn:hover {
                background: #252525;
                border-color: #FFD700;
                transform: scale(1.05);
            }

            /* Red alert state when deals found and panel closed */
            #bz-fav-btn.has-deals {
                background: #8B0000;
                border-color: #FF0000;
                color: #FFF;
                box-shadow: 0 0 20px rgba(255, 0, 0, 0.8);
                animation: pulse-button 1.5s infinite;
            }

            @keyframes pulse-button {
                0%, 100% {
                    box-shadow: 0 0 10px rgba(255, 0, 0, 0.6);
                    transform: scale(1);
                }
                50% {
                    box-shadow: 0 0 25px rgba(255, 0, 0, 1);
                    transform: scale(1.1);
                }
            }

            .bz-header-controls { display: flex; gap: 4px; margin-bottom: 8px; }

            .bz-ctrl-btn {
                flex: 1;
                text-align: center;
                padding: 4px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 10px;
                font-weight: bold;
                border: 1px solid #444;
            }

            #bz-clear-all { background: #434C66; color: white; }
            #bz-lock-btn.locked { background: #992b2b; color: white; }
            #bz-lock-btn.unlocked { background: #2b9943; color: white; }
            #bz-scan-all { background: #1a4d6f; color: #00BFFF; }
            #bz-scan-all:hover { background: #2a5d7f; }

            .bz-fav-category-header {
                background: #202966;
                color: #FFD700;
                padding: 4px 8px;
                font-size: 11px;
                font-weight: bold;
                text-transform: uppercase;
                margin-top: 5px;
                border-radius: 2px;
                border-left: 3px solid #FFD700;
                border-bottom: 1px solid #6E6E6E;
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .bz-category-checkbox {
                width: 14px;
                height: 14px;
                cursor: pointer;
                accent-color: #FFD700;
            }

            .bz-category-label {
                flex: 1;
                cursor: pointer;
            }

            .bz-category-scan-btn {
                background: #1a4d6f;
                color: #00BFFF;
                border: 1px solid #2a5d7f;
                padding: 2px 6px;
                border-radius: 3px;
                font-size: 9px;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.2s;
            }

            .bz-category-scan-btn:hover {
                background: #2a5d7f;
                transform: scale(1.05);
            }

            .bz-fav-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 6px;
                border-bottom: 1px solid #333;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s;
            }

            .bz-fav-item:hover {
                background: #252525;
                color: #FFD700;
                transform: translateX(2px);
            }

            .bz-fav-item.monitored {
                background: linear-gradient(90deg, #2a2a1a 0%, #1a1a1a 100%);
                border-left: 3px solid #FFD700;
            }

            .bz-fav-item-content {
                display: flex;
                align-items: center;
                gap: 4px;
                flex: 1;
            }

            .bz-monitor-checkbox {
                width: 14px;
                height: 14px;
                cursor: pointer;
                accent-color: #FFD700;
            }

            .bz-monitor-star {
                color: #FFD700;
                font-size: 12px;
                margin-left: 2px;
            }

            .bz-fav-remove { color: #575A66; margin-left: 8px; }
            .bz-fav-remove:hover { color: #A33C39; }

            .bz-monitor-alert-btn {
                width: 100%;
                padding: 6px 4px;
                margin-bottom: 8px;
                background: #1a4d6f;
                border: 2px solid #2a5d7f;
                border-radius: 4px;
                color: #00BFFF;
                font-weight: bold;
                font-size: 11px;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 4px;
                box-sizing: border-box;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .bz-monitor-alert-btn.has-deals {
                background: #8B0000;
                border-color: #FF0000;
                color: #FFF;
                animation: pulse-alert 1.5s infinite;
            }

            @keyframes pulse-alert {
                0%, 100% {
                    box-shadow: 0 0 5px rgba(255, 0, 0, 0.5);
                    transform: scale(1);
                }
                50% {
                    box-shadow: 0 0 20px rgba(255, 0, 0, 0.8);
                    transform: scale(1.02);
                }
            }

            .bz-monitor-alert-btn:hover {
                transform: scale(1.05);
            }

            .bz-alert-icon {
                font-size: 16px;
                animation: bounce 1s infinite;
            }

            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-3px); }
            }

            .bz-settings-btn {
                background: #434C66;
                color: #FFD700;
                border: 1px solid #FFD700;
                padding: 4px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 10px;
                font-weight: bold;
                transition: all 0.2s;
                text-align: center;
            }

            .bz-settings-btn:hover {
                background: #5a6380;
                transform: scale(1.05);
            }

            .bz-monitor-status {
                font-size: 9px;
                color: #888;
                text-align: center;
                padding: 4px;
                background: #1a1a1a;
                border-radius: 3px;
                margin-bottom: 6px;
            }

            .bz-monitor-status.active {
                color: #2ecc71;
            }

            .bz-monitor-status.standby {
                color: #f39c12;
            }
        `);

        const btn = document.createElement('div');
        btn.id = 'bz-fav-btn';
        btn.textContent = '⭐';

        const panel = document.createElement('div');
        panel.id = 'bz-fav-panel';

        btn.addEventListener('click', () => {
            const wasOpen = panel.style.display === 'block';
            panel.style.display = wasOpen ? 'none' : 'block';
            render();

            // Update button state after toggle
            setTimeout(() => {
                updateMonitorAlert();
            }, 100);
        });

        document.body.appendChild(btn);
        document.body.appendChild(panel);

        // Update alert indicators every 5 seconds (always check button state)
        setInterval(() => {
            updateMonitorAlert();
        }, 5000);
    }

    function updateMonitorAlert() {
        const alertBtn = document.getElementById('bz-monitor-alert');
        const favBtn = document.getElementById('bz-fav-btn');
        const panel = document.getElementById('bz-fav-panel');

        const settings = GM_getValue('bz_monitor_settings', { enabled: true, mode: 'both', minProfit: 1000 });
        const deals = GM_getValue('bz_monitor_deals', []);
        const hasDeals = deals.length > 0;

        // Update internal alert button (inside panel)
        if (alertBtn) {
            // Check if monitor is disabled
            if (!settings.enabled) {
                alertBtn.className = 'bz-monitor-alert-btn';
                alertBtn.innerHTML = `<span style="opacity: 0.5;">⏸️</span> Monitor Disabled`;
                alertBtn.style.opacity = '0.6';
            } else if (hasDeals) {
                alertBtn.style.opacity = '1';
                alertBtn.className = 'bz-monitor-alert-btn has-deals';
                alertBtn.innerHTML = `<span class="bz-alert-icon">🔴</span> ${deals.length} Deal${deals.length > 1 ? 's' : ''} Found!`;
            } else {
                alertBtn.style.opacity = '1';
                alertBtn.className = 'bz-monitor-alert-btn';
                alertBtn.innerHTML = `<span>🔍</span> No Deals Yet`;
            }
        }

        // Update star button (only when panel is closed and monitor enabled)
        if (favBtn && panel) {
            const isPanelOpen = panel.style.display === 'block';

            // Don't flash star if monitor is disabled
            if (!settings.enabled) {
                favBtn.classList.remove('has-deals');
            } else if (hasDeals && !isPanelOpen) {
                // Panel closed + deals found + monitor enabled = RED FLASHING STAR
                favBtn.classList.add('has-deals');
            } else {
                // Panel open OR no deals = Normal gold star
                favBtn.classList.remove('has-deals');
            }
        }
    }

    function render() {
        const panel = document.getElementById('bz-fav-panel');
        if (!panel) return;

        const favs = Object.values(getAll());
        const locked = isLocked();
        const selectedCategories = getSelectedCategories();
        const monitored = getMonitoredItems();
        const monitoredIds = new Set(monitored.map(item => item.id));
        const settings = getMonitorSettings();

        // Determine initial status text
        let initialStatusText = 'Monitor: Loading...';
        let initialStatusClass = 'bz-monitor-status';
        let initialStatusColor = '';

        if (!settings.enabled) {
            initialStatusText = 'Monitor: Disabled';
            initialStatusColor = '#e74c3c';
        } else if (monitored.length === 0) {
            initialStatusText = 'Monitor: Idle (No items)';
        }

        let html = `
            <div id="bz-monitor-alert" class="bz-monitor-alert-btn">
                ${!settings.enabled ? '<span style="opacity: 0.5;">⏸️</span> Monitor Disabled' : '<span>🔍</span> No Deals Yet'}
            </div>
            <div id="bz-monitor-status" class="bz-monitor-status" style="color: ${initialStatusColor}">
                ${initialStatusText}
            </div>
            <div class="bz-settings-btn" id="bz-settings">
                ⚙️ Settings
            </div>
            <div class="bz-header-controls" style="margin-top: 8px;">
                <div id="bz-clear-all" class="bz-ctrl-btn">Clear</div>
                <div id="bz-lock-btn" class="bz-ctrl-btn ${locked ? 'locked' : 'unlocked'}">
                    ${locked ? 'Locked' : 'Unlocked'}
                </div>
            </div>
            <div style="margin-bottom: 8px;">
                <div id="bz-scan-all" class="bz-ctrl-btn" style="width: 100%;">🔍 Scan ${selectedCategories.size > 0 ? 'Selected' : 'All'}</div>
            </div>
        `;

        if (favs.length === 0) {
            html += `<div style="text-align:center;color:#888;padding:10px;">List Empty</div>`;
        } else {
            const groups = favs.reduce((acc, item) => {
                const cat = item.category || 'Uncategorized';
                if (!acc[cat]) acc[cat] = [];
                acc[cat].push(item);
                return acc;
            }, {});

            Object.keys(groups).sort().forEach(category => {
                const isChecked = selectedCategories.has(category);
                html += `
                    <div class="bz-fav-category-header">
                        <input type="checkbox" class="bz-category-checkbox" data-category="${category}" ${isChecked ? 'checked' : ''}>
                        <span class="bz-category-label">${category}</span>
                        <button class="bz-category-scan-btn" data-category="${category}">🔍</button>
                    </div>
                `;
                html += groups[category].map(f => {
                    const isMonitored = monitoredIds.has(f.id);
                    return `<div class="bz-fav-item ${isMonitored ? 'monitored' : ''}" data-id="${f.id}">
                        <div class="bz-fav-item-content">
                            <input type="checkbox" class="bz-monitor-checkbox" data-id="${f.id}" ${isMonitored ? 'checked' : ''} ${monitored.length >= MAX_MONITORED && !isMonitored ? 'disabled' : ''}>
                            <span>${f.name}</span>
                            ${isMonitored ? '<span class="bz-monitor-star">⭐</span>' : ''}
                        </div>
                        <span class="bz-fav-remove">✕</span>
                    </div>`;
                }).join('');
            });
        }

        panel.innerHTML = html;

        // Update alert button
        updateMonitorAlert();

        // Settings button
        panel.querySelector('#bz-settings').addEventListener('click', () => {
            const settings = getMonitorSettings();
            const currentMode = settings.mode || 'both';
            const currentProfit = settings.minProfit || 1000;

            // Create a custom settings dialog using DOM
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                z-index: 999999;
                display: flex;
                align-items: center;
                justify-content: center;
            `;

            const dialog = document.createElement('div');
            dialog.style.cssText = `
                background: #1a1a1a;
                border: 2px solid #FFD700;
                border-radius: 8px;
                padding: 20px;
                width: 320px;
                color: #fff;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                box-shadow: 0 0 30px rgba(255, 215, 0, 0.6);
            `;

            dialog.innerHTML = `
                <h3 style="margin: 0 0 15px 0; color: #FFD700; text-align: center; font-size: 18px;">
                    ⚙️ Monitor Settings
                </h3>

                <div style="margin-bottom: 15px; padding: 10px; background: #252525; border-radius: 4px; border: 1px solid #444;">
                    <label style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;" id="bz-toggle-label">
                        <span id="bz-toggle-text" style="font-size: 14px; font-weight: bold; color: ${settings.enabled ? '#2ecc71' : '#e74c3c'};">
                            ${settings.enabled ? '🟢 Monitor Enabled' : '🔴 Monitor Disabled'}
                        </span>
                        <div style="position: relative;">
                            <input type="checkbox" id="bz-enabled-toggle" ${settings.enabled ? 'checked' : ''} style="display: none;">
                            <div id="bz-toggle-slider" style="
                                width: 50px;
                                height: 24px;
                                background: ${settings.enabled ? '#2ecc71' : '#e74c3c'};
                                border-radius: 12px;
                                position: relative;
                                transition: background 0.3s;
                                cursor: pointer;
                            ">
                                <div style="
                                    position: absolute;
                                    width: 18px;
                                    height: 18px;
                                    background: white;
                                    border-radius: 50%;
                                    top: 3px;
                                    left: ${settings.enabled ? '29px' : '3px'};
                                    transition: left 0.3s;
                                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                                "></div>
                            </div>
                        </div>
                    </label>
                    <div style="font-size: 11px; color: #666; margin-top: 6px;">
                        Turn background monitoring on/off
                    </div>
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-size: 13px; color: #aaa;">
                        Profit Mode:
                    </label>
                    <select id="bz-mode-select" style="
                        width: 100%;
                        padding: 8px;
                        background: #252525;
                        color: #fff;
                        border: 1px solid #444;
                        border-radius: 4px;
                        font-size: 13px;
                        cursor: pointer;
                    ">
                        <option value="both" ${currentMode === 'both' ? 'selected' : ''}>Both (Best Profit)</option>
                        <option value="npc" ${currentMode === 'npc' ? 'selected' : ''}>NPC Profit Only</option>
                        <option value="market" ${currentMode === 'market' ? 'selected' : ''}>Market Value Only</option>
                    </select>
                    <div style="font-size: 11px; color: #666; margin-top: 4px;">
                        <span id="bz-mode-description"></span>
                    </div>
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 5px; font-size: 13px; color: #aaa;">
                        Minimum Profit ($):
                    </label>
                    <input
                        type="number"
                        id="bz-profit-input"
                        value="${currentProfit}"
                        min="100"
                        step="100"
                        style="
                            width: 100%;
                            padding: 8px;
                            background: #252525;
                            color: #00FF00;
                            border: 1px solid #444;
                            border-radius: 4px;
                            font-size: 14px;
                            font-weight: bold;
                            box-sizing: border-box;
                        "
                    >
                    <div style="font-size: 11px; color: #666; margin-top: 4px;">
                        Only show deals with profit above this amount
                    </div>
                </div>

                <div style="display: flex; gap: 10px;">
                    <button id="bz-save-settings" style="
                        flex: 1;
                        padding: 10px;
                        background: #2ecc71;
                        color: #fff;
                        border: none;
                        border-radius: 4px;
                        font-weight: bold;
                        cursor: pointer;
                        font-size: 13px;
                    ">
                        ✓ Save
                    </button>
                    <button id="bz-cancel-settings" style="
                        flex: 1;
                        padding: 10px;
                        background: #555;
                        color: #fff;
                        border: none;
                        border-radius: 4px;
                        font-weight: bold;
                        cursor: pointer;
                        font-size: 13px;
                    ">
                        Cancel
                    </button>
                </div>
            `;

            overlay.appendChild(dialog);
            document.body.appendChild(overlay);

            // Update description text based on mode selection
            const modeSelect = dialog.querySelector('#bz-mode-select');
            const modeDesc = dialog.querySelector('#bz-mode-description');

            function updateModeDescription() {
                const mode = modeSelect.value;
                if (mode === 'both') {
                    modeDesc.textContent = 'Shows deals with best profit (NPC or Market)';
                } else if (mode === 'npc') {
                    modeDesc.textContent = 'Only shows NPC resale profit deals';
                } else {
                    modeDesc.textContent = 'Only shows market value discount deals';
                }
            }

            updateModeDescription();
            modeSelect.addEventListener('change', updateModeDescription);

            // Toggle switch interaction
            const toggleCheckbox = dialog.querySelector('#bz-enabled-toggle');
            const toggleSlider = dialog.querySelector('#bz-toggle-slider');
            const toggleText = dialog.querySelector('#bz-toggle-text');
            const toggleLabel = dialog.querySelector('#bz-toggle-label');

            function updateToggleUI() {
                const isEnabled = toggleCheckbox.checked;

                // Update slider background color
                toggleSlider.style.background = isEnabled ? '#2ecc71' : '#e74c3c';

                // Update knob position
                const knob = toggleSlider.querySelector('div');
                knob.style.left = isEnabled ? '29px' : '3px';

                // Update text and color
                toggleText.textContent = isEnabled ? '🟢 Monitor Enabled' : '🔴 Monitor Disabled';
                toggleText.style.color = isEnabled ? '#2ecc71' : '#e74c3c';
            }

            // Click on label/slider to toggle
            toggleLabel.addEventListener('click', (e) => {
                toggleCheckbox.checked = !toggleCheckbox.checked;
                updateToggleUI();
            });

            // Save button
            dialog.querySelector('#bz-save-settings').addEventListener('click', () => {
                const newEnabled = dialog.querySelector('#bz-enabled-toggle').checked;
                const newMode = modeSelect.value;
                const newProfit = parseInt(dialog.querySelector('#bz-profit-input').value) || 1000;

                saveMonitorSettings({
                    ...settings,
                    enabled: newEnabled,
                    mode: newMode,
                    minProfit: newProfit
                });

                overlay.remove();

                // Show confirmation
                const modeText = newMode === 'npc' ? 'NPC Only' : newMode === 'market' ? 'Market Only' : 'Both (Best)';
                const statusText = newEnabled ? 'Enabled' : 'Disabled';
                alert(`✓ Settings Saved!\n\nMonitor: ${statusText}\nMode: ${modeText}\nMin Profit: $${newProfit.toLocaleString()}`);

                // Update status display
                render();
                updateFavoritesMonitorAlert();
                updateFavoritesMonitorStatus();
            });

            // Cancel button
            dialog.querySelector('#bz-cancel-settings').addEventListener('click', () => {
                overlay.remove();
            });

            // Click outside to close
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.remove();
                }
            });
        });

        // Alert button
        panel.querySelector('#bz-monitor-alert').addEventListener('click', () => {
            if (typeof window.showMonitorDeals === 'function') {
                window.showMonitorDeals();
            }
        });

        // Clear all
        panel.querySelector('#bz-clear-all').addEventListener('click', () => {
            if (confirm("Clear all favorites?")) {
                GM_setValue(FAV_KEY, {});
                render();
            }
        });

        // Lock button
        panel.querySelector('#bz-lock-btn').addEventListener('click', () => {
            GM_setValue(LOCK_KEY, !locked);
            render();
        });

        // Scan all
        panel.querySelector('#bz-scan-all').addEventListener('click', () => {
            if (typeof window.scanAllFavorites === 'function') {
                window.scanAllFavorites();
            }
        });

        // Category scan
        panel.querySelectorAll('.bz-category-scan-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const category = this.dataset.category;
                if (typeof window.scanAllFavorites === 'function') {
                    window.scanAllFavorites(category);
                }
            });
        });

        // Category checkboxes
        panel.querySelectorAll('.bz-category-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', function(e) {
                e.stopPropagation();
                const category = this.dataset.category;
                const selected = getSelectedCategories();

                if (this.checked) {
                    selected.add(category);
                } else {
                    selected.delete(category);
                }

                saveSelectedCategories(selected);
                render();
            });
        });

        // Category labels
        panel.querySelectorAll('.bz-category-label').forEach(label => {
            label.addEventListener('click', function() {
                const checkbox = this.previousElementSibling;
                if (checkbox) {
                    checkbox.checked = !checkbox.checked;
                    checkbox.dispatchEvent(new Event('change'));
                }
            });
        });

        // Monitor checkboxes
        panel.querySelectorAll('.bz-monitor-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', function(e) {
                e.stopPropagation();
                const itemId = this.dataset.id;
                const fav = favs.find(f => f.id === itemId);
                if (!fav) return;

                const monitored = getMonitoredItems();

                if (this.checked) {
                    if (monitored.length >= MAX_MONITORED) {
                        alert(`Maximum ${MAX_MONITORED} items can be monitored at once`);
                        this.checked = false;
                        return;
                    }
                    monitored.push({ id: fav.id, name: fav.name });
                    saveMonitoredItems(monitored);
                } else {
                    const filtered = monitored.filter(item => item.id !== itemId);
                    saveMonitoredItems(filtered);
                }

                render();
            });
        });

        // Favorite item clicks
        panel.querySelectorAll('.bz-fav-item').forEach(el => {
            el.addEventListener('click', e => {
                if (e.target.classList.contains('bz-monitor-checkbox')) return;
                if (e.target.classList.contains('bz-fav-remove')) {
                    const id = el.dataset.id;
                    remove(id);
                    return;
                }

                const id = el.dataset.id;
                const name = el.querySelector('span').textContent;
                if (typeof window.processItem === 'function') {
                    window.processItem(name, id);
                }
            });
        });
    }

    function waitForBodyAndInit() {
        if (document.body) createUI();
        else setTimeout(waitForBodyAndInit, 250);
    }

    waitForBodyAndInit();
    window.BZ_FAVOURITES = { save, remove, getAll, getSelectedCategories };
})();