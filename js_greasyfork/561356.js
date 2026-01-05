// ==UserScript==
// @name         Torn - Profit Tracker CLEAN
// @namespace    http://torn.com/
// @version      18.7
// @description  Simple profit tracker with WORKING reset
// @author       srsbsns
// @match        *://www.torn.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561356/Torn%20-%20Profit%20Tracker%20CLEAN.user.js
// @updateURL https://update.greasyfork.org/scripts/561356/Torn%20-%20Profit%20Tracker%20CLEAN.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'torn_profit_clean_v16';
    const API_KEY_STORAGE = 'torn_profit_tracker_api_key';
    const MARKET_CACHE_KEY = 'torn_market_cache_v16';

    // Get API key
    let apiKey = localStorage.getItem(API_KEY_STORAGE);
    if (!apiKey || apiKey.length < 10) {
        apiKey = prompt("Please enter your Torn API Key:");
        if (apiKey) {
            localStorage.setItem(API_KEY_STORAGE, apiKey);
            location.reload();
        }
        return;
    }

    // Load data
    let data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
        resetTimestamp: 0,
        bazaarSales: { total: 0, marketValueLost: 0 },  // Your bazaar sales
        bazaarBuys: { total: 0 },                        // Buying from other bazaars
        marketBuys: { total: 0 },                        // Item market purchases
        marketSales: { total: 0 },                       // Item market sales
        shops: { sales: 0, buys: 0 },                    // Shops (NPC)
        totalProfit: 0
    };

    // Migration: Convert old data structure if needed
    if (data.bazaar || data.market) {
        data = {
            resetTimestamp: data.resetTimestamp || 0,
            bazaarSales: { total: data.bazaar?.sales || 0, marketValueLost: data.bazaar?.marketValueLost || 0 },
            bazaarBuys: { total: data.bazaar?.buys || 0 },
            marketBuys: { total: data.market?.buys || 0 },
            marketSales: { total: data.market?.sales || 0 },
            shops: data.shops || { sales: 0, buys: 0 },
            totalProfit: data.totalProfit || 0
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    // Market cache
    let marketCache = JSON.parse(localStorage.getItem(MARKET_CACHE_KEY)) || {};

    GM_addStyle(`
        #profit-widget {
            position: fixed !important;
            top: 20px !important;
            left: 20px !important;
            right: auto !important;
            background: rgba(26, 26, 26, 0.98);
            border: 1px solid #76c776;
            border-radius: 6px;
            padding: 10px;
            z-index: 999999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.8);
            font-family: Arial, sans-serif;
            color: white;
            min-width: 160px;
            max-width: 180px;
        }
        .header {
            text-align: center;
            font-weight: bold;
            color: #76c776;
            font-size: 13px;
            margin-bottom: 8px;
            border-bottom: 1px solid #333;
            padding-bottom: 4px;
        }
        .row {
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            margin: 3px 0;
        }
        .subrow {
            display: flex;
            justify-content: space-between;
            font-size: 9px;
            margin: 2px 0 2px 10px;
            color: #999;
        }
        .net {
            margin-top: 8px;
            font-size: 13px;
            display: flex;
            justify-content: space-between;
            font-weight: bold;
            border-top: 1px solid #444;
            padding-top: 4px;
        }
        .btn {
            width: 100%;
            background: #222;
            color: #ff9999;
            border: 1px solid #444;
            margin-top: 8px;
            cursor: pointer;
            padding: 4px;
            border-radius: 3px;
            font-size: 10px;
            font-weight: bold;
        }
        .btn:hover { background: #333; }
    `);

    function save() {
        // CRITICAL: Before saving, check if another tab has a newer reset timestamp
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
        if (stored && stored.resetTimestamp > data.resetTimestamp) {
            console.warn('⚠️ Another tab has newer reset time, aborting save to prevent overwrite');
            console.warn('  Our reset:', new Date(data.resetTimestamp * 1000).toLocaleString());
            console.warn('  Their reset:', new Date(stored.resetTimestamp * 1000).toLocaleString());
            // Reload their data instead
            data = stored;
            render();
            return;
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    async function getMarketValue(itemId) {
        // Check cache first
        if (marketCache[itemId] && Date.now() - marketCache[itemId].time < 3600000) {
            return marketCache[itemId].value;
        }

        try {
            // Use the torn items catalog API like the reference script
            const res = await fetch(`https://api.torn.com/torn/${itemId}?selections=items&key=${apiKey}`);
            const json = await res.json();

            if (json.error) {
                console.error('Market API error:', json.error);
                return 0;
            }

            // The response has items[itemId].market_value
            const items = json.items || {};
            const itemData = items[itemId];
            const val = itemData ? (Number(itemData.market_value) || 0) : 0;

            // Cache it
            marketCache[itemId] = { value: val, time: Date.now() };
            localStorage.setItem(MARKET_CACHE_KEY, JSON.stringify(marketCache));

            console.log(`📊 Market value for item #${itemId}: $${val.toLocaleString()}`);
            return val;
        } catch (e) {
            console.error('Error fetching market value:', e);
            return 0;
        }
    }

    function render() {
        let old = document.getElementById('profit-widget');
        if (old) old.remove();

        // Safety checks - ensure all data properties exist
        if (!data.bazaarSales) data.bazaarSales = { total: 0, marketValueLost: 0 };
        if (!data.bazaarBuys) data.bazaarBuys = { total: 0 };
        if (!data.marketBuys) data.marketBuys = { total: 0 };
        if (!data.marketSales) data.marketSales = { total: 0 };
        if (!data.shops) data.shops = { sales: 0, buys: 0 };

        // Calculate net values - bazaar sales shows ACTUAL money received, value lost shown separately
        const bazaarSalesTotal = data.bazaarSales.total || 0;
        const bazaarBuysNet = -(data.bazaarBuys.total || 0);
        const marketBuysNet = -(data.marketBuys.total || 0);
        const marketSalesNet = data.marketSales.total || 0;
        const shopsNet = (data.shops.sales || 0) - (data.shops.buys || 0);
        const total = data.totalProfit || 0;

        const widget = document.createElement('div');
        widget.id = 'profit-widget';
        widget.innerHTML = `
            <div class="header">💰 Daily Profit</div>

            <div class="row">
                <span>Bazaar Sales:</span>
                <span style="color:${bazaarSalesTotal >= 0 ? '#76c776' : '#ff6b6b'}">
                    ${bazaarSalesTotal < 0 ? '-' : ''}$${Math.abs(bazaarSalesTotal).toLocaleString()}
                </span>
            </div>
            ${data.bazaarSales.marketValueLost > 0 ? `
            <div class="subrow">
                <span>└ Value lost:</span>
                <span style="color:#ff6b6b">-$${data.bazaarSales.marketValueLost.toLocaleString()}</span>
            </div>
            ` : ''}

            <div class="row">
                <span>Bazaar Buys:</span>
                <span style="color:${bazaarBuysNet >= 0 ? '#76c776' : '#ff6b6b'}">
                    ${bazaarBuysNet < 0 ? '-' : ''}$${Math.abs(bazaarBuysNet).toLocaleString()}
                </span>
            </div>

            <div class="row">
                <span>Item Market Buys:</span>
                <span style="color:${marketBuysNet >= 0 ? '#76c776' : '#ff6b6b'}">
                    ${marketBuysNet < 0 ? '-' : ''}$${Math.abs(marketBuysNet).toLocaleString()}
                </span>
            </div>

            <div class="row">
                <span>Item Market Sales:</span>
                <span style="color:${marketSalesNet >= 0 ? '#76c776' : '#ff6b6b'}">
                    ${marketSalesNet < 0 ? '-' : ''}$${Math.abs(marketSalesNet).toLocaleString()}
                </span>
            </div>

            <div class="row">
                <span>Shops:</span>
                <span style="color:${shopsNet >= 0 ? '#76c776' : '#ff6b6b'}">
                    ${shopsNet < 0 ? '-' : ''}$${Math.abs(shopsNet).toLocaleString()}
                </span>
            </div>

            <div class="net">
                <span>NET:</span>
                <span style="color:${total >= 0 ? '#76c776' : '#ff6b6b'}">
                    ${total < 0 ? '-' : ''}$${Math.abs(total).toLocaleString()}
                </span>
            </div>
            <button class="btn" id="debug-btn" style="background:#1f6feb;color:#fff;margin-top:4px;">🐛 Debug</button>
            <button class="btn" id="reset-btn">Reset for Today</button>
        `;

        document.body.appendChild(widget);

        document.getElementById('debug-btn').onclick = async () => {
            console.log('=== 🐛 PROFIT TRACKER DEBUG REPORT ===');
            console.log('Reset timestamp:', data.resetTimestamp, '=', new Date(data.resetTimestamp * 1000).toLocaleString());
            console.log('Current data:', JSON.parse(JSON.stringify(data)));
            console.log('Market cache:', Object.keys(marketCache).length, 'items cached');

            console.log('\n--- Fetching current log from API ---');
            try {
                const response = await fetch(`https://api.torn.com/user/?selections=log&key=${apiKey}`);
                const json = await response.json();

                if (json.error) {
                    console.error('❌ API Error:', json.error);
                    alert('API Error: ' + (json.error.error || 'Unknown'));
                    return;
                }

                console.log('✅ API responded with', Object.keys(json.log || {}).length, 'log entries');

                // Show relevant events
                const relevantEvents = [];
                for (const [id, log] of Object.entries(json.log || {})) {
                    if (log.timestamp > data.resetTimestamp) {
                        const title = log.title.toLowerCase();
                        if (title.includes('bazaar') || title.includes('market') || title.includes('shop')) {
                            relevantEvents.push({
                                id,
                                timestamp: log.timestamp,
                                date: new Date(log.timestamp * 1000).toLocaleString(),
                                title: log.title,
                                data: log.data
                            });
                        }
                    }
                }

                console.log('\n--- Events AFTER reset ---');
                console.log('Found', relevantEvents.length, 'relevant events since reset');
                relevantEvents.sort((a, b) => a.timestamp - b.timestamp);

                // Use for...of instead of forEach so we can await
                for (let i = 0; i < relevantEvents.length; i++) {
                    const e = relevantEvents[i];
                    console.log(`\n[${i+1}] ${e.date}`);
                    console.log('  Title:', e.title);
                    console.log('  Data:', e.data);

                    // Check if it's a bazaar sale
                    if (e.title.toLowerCase().includes('bazaar') && e.title.toLowerCase().includes('sell')) {
                        // For bazaar sales, item ID is in items array
                        const itemId = e.data?.items?.[0]?.id || e.data?.items?.[0] || e.data?.item;
                        const money = e.data?.cost_total || e.data?.total_value || 0;
                        console.log('  → YOUR BAZAAR SALE detected!');
                        console.log('  → Items array:', e.data?.items);
                        console.log('  → Item ID:', itemId);
                        console.log('  → Sale price:', money);

                        if (itemId) {
                            console.log('  → Checking market value...');
                            const mv = await getMarketValue(itemId);
                            console.log('  → Market value:', mv);
                            if (mv > 0) {
                                const valueLost = mv - money;
                                console.log('  → Value lost:', valueLost);
                            }
                        }
                    }
                }

                console.log('\n=== END DEBUG REPORT ===');
                alert('Debug report printed to console (F12). Check the console for details!');

            } catch (e) {
                console.error('❌ Debug failed:', e);
                alert('Debug failed: ' + e.message);
            }
        };

        document.getElementById('reset-btn').onclick = () => {
            if (confirm("Reset all tracking data? This cannot be undone.")) {
                const now = Math.floor(Date.now() / 1000);
                data = {
                    resetTimestamp: now,
                    bazaarSales: { total: 0, marketValueLost: 0 },
                    bazaarBuys: { total: 0 },
                    marketBuys: { total: 0 },
                    marketSales: { total: 0 },
                    shops: { sales: 0, buys: 0 },
                    totalProfit: 0
                };

                // Save immediately to trigger storage event in other tabs
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

                console.log(`✅ RESET at timestamp ${now} (${new Date(now * 1000).toLocaleString()})`);
                console.log('📡 Reset will sync to all open tabs automatically');
                render();
            }
        };
    }

    async function sync() {
        try {
            // CRITICAL: ALWAYS check for newer reset timestamp before syncing
            // (protects against old tabs that have been asleep since yesterday)
            const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
            if (stored && stored.resetTimestamp > data.resetTimestamp) {
                console.log('🔄 Found newer reset timestamp in localStorage, updating...');
                console.log('  Old reset:', new Date(data.resetTimestamp * 1000).toLocaleString());
                console.log('  New reset:', new Date(stored.resetTimestamp * 1000).toLocaleString());
                data = stored;
                render();
            }

            const resetTime = data.resetTimestamp;
            console.log(`🔍 Syncing... Reset time: ${resetTime} (${new Date(resetTime * 1000).toLocaleString()})`);

            const response = await fetch(`https://api.torn.com/user/?selections=log&key=${apiKey}`);
            const json = await response.json();
            if (!json.log) return;

            // Create a snapshot of current state
            const snapshot = {
                bazaarSales: { total: 0, marketValueLost: 0 },
                bazaarBuys: { total: 0 },
                marketBuys: { total: 0 },
                marketSales: { total: 0 },
                shops: { sales: 0, buys: 0 },
                totalProfit: 0
            };

            // Process ALL events after reset time
            for (const [id, log] of Object.entries(json.log)) {
                // ONLY process events AFTER reset
                if (log.timestamp <= resetTime) {
                    continue;
                }

                const title = log.title.toLowerCase();
                const d = log.data;
                if (!d) continue;

                // IGNORE bazaar management actions (add/edit/remove) - only track actual transactions
                if (title.includes("bazaar add") || title.includes("bazaar edit") || title.includes("bazaar remove")) {
                    continue;
                }

                // IGNORE non-financial activities
                if (title.includes("nerve") || title.includes("energy") ||
                    title.includes("bootleg") || title.includes("contract") ||
                    title.includes("mission") || title.includes("crime") ||
                    title.includes("attacking") || title.includes("defeated")) {
                    continue;
                }

                const money = parseFloat(d.cost_total || d.total_cost || d.cost || d.total_value || 0);
                if (money === 0) continue;

                let cat = "";
                let isYourBazaarSale = false;
                let isBazaarBuy = false;

                if (title.includes("bazaar")) {
                    if (title.includes("buy") || title.includes("bought")) {
                        cat = "bazaar"; // Buying from someone's bazaar
                        isBazaarBuy = true;
                    } else if (title.includes("sell")) {
                        cat = "bazaar"; // Selling on YOUR bazaar
                        isYourBazaarSale = true;
                    }
                } else if (title.includes("market")) {
                    cat = "market";
                } else if (title.includes("shop") || title.includes("item buy")) {
                    cat = "shops";
                }

                if (!cat) continue;

                if (title.includes("buy")) {
                    if (cat === "bazaar" && isBazaarBuy) {
                        snapshot.bazaarBuys.total += money;
                        snapshot.totalProfit -= money;
                    } else if (cat === "market") {
                        snapshot.marketBuys.total += money;
                        snapshot.totalProfit -= money;
                    } else if (cat === "shops") {
                        snapshot.shops.buys += money;
                        snapshot.totalProfit -= money;
                    }
                } else if (title.includes("sell")) {
                    if (cat === "bazaar" && isYourBazaarSale) {
                        snapshot.bazaarSales.total += money;
                        snapshot.totalProfit += money;

                        // Check market value for YOUR bazaar sales
                        const itemId = d.items?.[0]?.id || d.items?.[0] || d.item;
                        if (itemId) {
                            const qty = d.quantity || d.items?.[0]?.quantity || 1;
                            const marketVal = await getMarketValue(itemId);

                            if (marketVal > 0) {
                                const totalMarketVal = marketVal * qty;
                                const valueLost = totalMarketVal - money;

                                if (valueLost > 0) {
                                    snapshot.bazaarSales.marketValueLost += valueLost;
                                    snapshot.totalProfit -= valueLost;
                                    console.log(`📉 Bazaar: Sold item #${itemId} for $${money}, market $${totalMarketVal}, lost $${valueLost}`);
                                }
                            }
                        }
                    } else if (cat === "market") {
                        snapshot.marketSales.total += money;
                        snapshot.totalProfit += money;
                    } else if (cat === "shops") {
                        snapshot.shops.sales += money;
                        snapshot.totalProfit += money;
                    }
                }
            }

            // Replace entire state with snapshot
            data.bazaarSales = snapshot.bazaarSales;
            data.bazaarBuys = snapshot.bazaarBuys;
            data.marketBuys = snapshot.marketBuys;
            data.marketSales = snapshot.marketSales;
            data.shops = snapshot.shops;
            data.totalProfit = snapshot.totalProfit;

            save();
            render();

            console.log(`✅ Sync complete. NET: $${data.totalProfit.toLocaleString()}`);
        } catch (e) {
            console.error("Sync error:", e);
        }
    }

    // Start
    render();
    sync();
    setInterval(sync, 30000);

    // CRITICAL: Listen for storage changes from other tabs (e.g., when reset is clicked in another tab)
    window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY && e.newValue) {
            try {
                const newData = JSON.parse(e.newValue);

                // CRITICAL: Only accept if the new reset timestamp is NEWER or EQUAL
                if (newData.resetTimestamp < data.resetTimestamp) {
                    console.warn('🚫 Ignoring older reset from another tab');
                    console.warn('  Our reset:', new Date(data.resetTimestamp * 1000).toLocaleString());
                    console.warn('  Their reset:', new Date(newData.resetTimestamp * 1000).toLocaleString());
                    // Force save our newer reset back to localStorage
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                    return;
                }

                console.log('📡 Data changed in another tab, reloading...');

                // Ensure all required fields exist
                data = {
                    resetTimestamp: newData.resetTimestamp || 0,
                    bazaarSales: newData.bazaarSales || { total: 0, marketValueLost: 0 },
                    bazaarBuys: newData.bazaarBuys || { total: 0 },
                    marketBuys: newData.marketBuys || { total: 0 },
                    marketSales: newData.marketSales || { total: 0 },
                    shops: newData.shops || { sales: 0, buys: 0 },
                    totalProfit: newData.totalProfit || 0
                };

                render();
                console.log('✅ Synced with other tab. Reset time:', new Date(data.resetTimestamp * 1000).toLocaleString());
            } catch (err) {
                console.error('❌ Error syncing from other tab:', err);
            }
        }
    });

    console.log('💰 Profit Tracker loaded');
})();