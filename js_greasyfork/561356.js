// ==UserScript==
// @name         Torn - Profit Tracker by srsbsns
// @namespace    http://torn.com/
// @version      17.2
// @description  Simple profit tracker with $1MV calculated
// @author       srsbsns
// @match        *://www.torn.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561356/Torn%20-%20Profit%20Tracker%20by%20srsbsns.user.js
// @updateURL https://update.greasyfork.org/scripts/561356/Torn%20-%20Profit%20Tracker%20by%20srsbsns.meta.js
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
        bazaar: { sales: 0, buys: 0, marketValueLost: 0 },
        market: { sales: 0, buys: 0 },
        shops: { sales: 0, buys: 0 },
        totalProfit: 0
    };

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

        const bazaarNet = data.bazaar.sales - data.bazaar.buys - (data.bazaar.marketValueLost || 0);
        const marketNet = data.market.sales - data.market.buys;
        const shopsNet = data.shops.sales - data.shops.buys;
        const total = data.totalProfit;

        const widget = document.createElement('div');
        widget.id = 'profit-widget';
        widget.innerHTML = `
            <div class="header">💰 Daily Profit</div>
            <div class="row">
                <span>Bazaar:</span>
                <span style="color:${bazaarNet >= 0 ? '#76c776' : '#ff6b6b'}">
                    ${bazaarNet < 0 ? '-' : ''}$${Math.abs(bazaarNet).toLocaleString()}
                </span>
            </div>
            ${data.bazaar.marketValueLost > 0 ? `
            <div class="subrow">
                <span>└ Value lost:</span>
                <span style="color:#ff6b6b">-$${data.bazaar.marketValueLost.toLocaleString()}</span>
            </div>
            ` : ''}
            <div class="row">
                <span>Market:</span>
                <span style="color:${marketNet >= 0 ? '#76c776' : '#ff6b6b'}">
                    ${marketNet < 0 ? '-' : ''}$${Math.abs(marketNet).toLocaleString()}
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
                    bazaar: { sales: 0, buys: 0, marketValueLost: 0 },
                    market: { sales: 0, buys: 0 },
                    shops: { sales: 0, buys: 0 },
                    totalProfit: 0
                };
                save();
                console.log(`✅ RESET at timestamp ${now} (${new Date(now * 1000).toLocaleString()})`);
                render();
            }
        };
    }

    async function sync() {
        try {
            const response = await fetch(`https://api.torn.com/user/?selections=log&key=${apiKey}`);
            const json = await response.json();
            if (!json.log) return;

            const resetTime = data.resetTimestamp;
            console.log(`🔍 Syncing... Reset time: ${resetTime} (${new Date(resetTime * 1000).toLocaleString()})`);

            // Create a snapshot of current state
            const snapshot = {
                bazaar: { sales: 0, buys: 0, marketValueLost: 0 },
                market: { sales: 0, buys: 0 },
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

                const money = parseFloat(d.cost_total || d.total_cost || d.cost || d.total_value || 0);
                if (money === 0) continue;

                let cat = "";
                let isYourBazaarSale = false;

                if (title.includes("bazaar")) {
                    if (title.includes("buy") || title.includes("bought")) {
                        cat = "market"; // Buying from someone's bazaar = market
                    } else {
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
                    snapshot[cat].buys += money;
                    snapshot.totalProfit -= money;
                } else if (title.includes("sell")) {
                    snapshot[cat].sales += money;
                    snapshot.totalProfit += money;

                    // Check market value for YOUR bazaar sales
                    // Item ID is in items array: items[0].id or items[0]
                    const itemId = d.items?.[0]?.id || d.items?.[0] || d.item;
                    if (isYourBazaarSale && itemId) {
                        const qty = d.quantity || d.items?.[0]?.quantity || 1;
                        const marketVal = await getMarketValue(itemId);

                        if (marketVal > 0) {
                            const totalMarketVal = marketVal * qty;
                            const valueLost = totalMarketVal - money;

                            if (valueLost > 0) {
                                snapshot.bazaar.marketValueLost += valueLost;
                                snapshot.totalProfit -= valueLost;
                                console.log(`📉 Bazaar: Sold item #${itemId} for $${money}, market $${totalMarketVal}, lost $${valueLost}`);
                            }
                        }
                    }
                }
            }

            // Replace entire state with snapshot
            data.bazaar = snapshot.bazaar;
            data.market = snapshot.market;
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

    console.log('💰 Profit Tracker loaded');
})();