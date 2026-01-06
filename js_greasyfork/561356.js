// ==UserScript==
// @name         Torn - Dedicated Profit Tracker
// @namespace    http://torn.com/
// @version      28.0
// @description  Standalone tracker with minus sign added to negative Net Total.
// @author       srsbsns
// @match        *://www.torn.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561356/Torn%20-%20Dedicated%20Profit%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/561356/Torn%20-%20Dedicated%20Profit%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'torn_profit_clean_v20_tracker';
    const API_KEY_STORAGE = 'torn_profit_clean_v20_api_key';
    const MARKET_CACHE_KEY = 'torn_profit_clean_v20_market_cache';
    const TRACKER_URL = '/preferences.php#profit-tracker';

    // 1. LAUNCHER (Visible on regular pages)
    if (!window.location.href.includes('#profit-tracker')) {
        GM_addStyle(`#profit-launcher { position: fixed; bottom: 45px; right: 20px; width: 45px; height: 45px; background: #1a1a1a; border: 2px solid #3F68E0; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 1000000; font-size: 22px; box-shadow: 0 4px 10px rgba(0,0,0,0.5); }`);
        const launcher = document.createElement('div');
        launcher.id = 'profit-launcher';
        launcher.innerHTML = '📈';
        launcher.addEventListener('click', () => window.open(window.location.origin + TRACKER_URL, '_blank'));
        document.body.appendChild(launcher);
        return;
    }

    // 2. WIPE SCREEN & CHANGE ICON (Only on tracker page)
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💰</text></svg>';
    document.getElementsByTagName('head')[0].appendChild(link);

    document.documentElement.innerHTML = '<head><title>💰 Profit Master</title></head><body style="background:#111; color:white; margin:0; padding:0; height:100vh; width:100vw; display:flex; justify-content:center; align-items:center; font-family:Arial;"></body>';

    // --- TRACKER LOGIC ---
    let apiKey = localStorage.getItem(API_KEY_STORAGE);
    if (!apiKey) {
        apiKey = prompt("Please enter your Torn API Key:");
        if (apiKey) { localStorage.setItem(API_KEY_STORAGE, apiKey); location.reload(); }
        return;
    }

    let data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
        resetTimestamp: 0, bazaarSales: { total: 0, marketValueLost: 0 },
        bazaarBuys: { total: 0 }, marketBuys: { total: 0 }, marketSales: { total: 0 },
        shops: { sales: 0, buys: 0 }, totalProfit: 0
    };

    GM_addStyle(`
        #profit-app { background: #1a1a1a; border: 2px solid #3F68E0; border-radius: 12px; padding: 25px; width: 350px; box-shadow: 0 0 30px rgba(0,0,0,0.5); }
        .header { text-align: center; font-weight: bold; color: #76c776; font-size: 18px; margin-bottom: 15px; border-bottom: 1px solid #333; padding-bottom: 10px; }
        .row { display: flex; justify-content: space-between; font-size: 14px; margin: 8px 0; }
        .subrow { display: flex; justify-content: space-between; font-size: 11px; margin: 2px 0 2px 15px; color: #999; }
        .net { margin-top: 15px; font-size: 18px; display: flex; justify-content: space-between; font-weight: bold; border-top: 1px solid #444; padding-top: 10px; }
        .btn { width: 100%; background: #333; color: white; border: 1px solid #444; margin-top: 10px; cursor: pointer; padding: 10px; border-radius: 4px; font-weight: bold; }
    `);

    async function getMarketValue(itemId) {
        let cache = JSON.parse(localStorage.getItem(MARKET_CACHE_KEY)) || {};
        if (cache[itemId] && Date.now() - cache[itemId].time < 3600000) return cache[itemId].value;
        try {
            const res = await fetch(`https://api.torn.com/torn/${itemId}?selections=items&key=${apiKey}`);
            const json = await res.json();
            const val = json.items?.[itemId]?.market_value || 0;
            cache[itemId] = { value: val, time: Date.now() };
            localStorage.setItem(MARKET_CACHE_KEY, JSON.stringify(cache));
            return val;
        } catch (e) { return 0; }
    }

    function render() {
        let old = document.getElementById('profit-app');
        if (old) old.remove();

        const app = document.createElement('div');
        app.id = 'profit-app';
        const shopNet = (data.shops?.sales || 0) - (data.shops?.buys || 0);

        app.innerHTML = `
            <div class="header">💰 PROFIT MASTER</div>
            <div class="row"><span>Bazaar Sales:</span><span style="color:#76c776">$${(data.bazaarSales?.total || 0).toLocaleString()}</span></div>
            ${data.bazaarSales?.marketValueLost > 0 ? `<div class="subrow"><span>└ Value lost:</span><span style="color:#ff6b6b">-$${data.bazaarSales.marketValueLost.toLocaleString()}</span></div>` : ''}
            <div class="row"><span>Bazaar Buys:</span><span style="color:#ff6b6b">-$${(data.bazaarBuys?.total || 0).toLocaleString()}</span></div>
            <div class="row"><span>Market Sales:</span><span style="color:#76c776">$${(data.marketSales?.total || 0).toLocaleString()}</span></div>
            <div class="row"><span>Market Buys:</span><span style="color:#ff6b6b">-$${(data.marketBuys?.total || 0).toLocaleString()}</span></div>
            <div class="row"><span>Shops:</span><span style="color:${shopNet >= 0 ? '#76c776' : '#ff6b6b'}">$${shopNet.toLocaleString()}</span></div>
            <div class="net"><span>NET TOTAL:</span><span style="color:${data.totalProfit >= 0 ? '#76c776' : '#ff6b6b'}">${data.totalProfit < 0 ? '-' : ''}$${Math.abs(data.totalProfit).toLocaleString()}</span></div>
            <button class="btn" id="sync-btn" style="background:#2C2E78; color:#fff; border:none; margin-top:20px;">🔄 Sync Now</button>
            <button class="btn" id="reset-btn" style="background:#2C2E78; color:#ff9999;">Reset for Today</button>
        `;
        document.body.appendChild(app);

        document.getElementById('sync-btn').addEventListener('click', () => location.reload());
        document.getElementById('reset-btn').addEventListener('click', () => {
            if(confirm("Reset?")) {
                data = { resetTimestamp: Math.floor(Date.now()/1000), bazaarSales:{total:0,marketValueLost:0}, bazaarBuys:{total:0}, marketBuys:{total:0}, marketSales:{total:0}, shops:{sales:0,buys:0}, totalProfit:0 };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                render();
            }
        });
    }

    async function sync() {
        try {
            const response = await fetch(`https://api.torn.com/user/?selections=log&key=${apiKey}`);
            const json = await response.json();
            if (!json.log) return;
            let snapshot = { bazaarSales: { total: 0, marketValueLost: 0 }, bazaarBuys: { total: 0 }, marketBuys: { total: 0 }, marketSales: { total: 0 }, shops: { sales: 0, buys: 0 }, totalProfit: 0 };

            for (const [id, log] of Object.entries(json.log)) {
                if (log.timestamp <= data.resetTimestamp) continue;
                const title = log.title.toLowerCase();
                const d = log.data;
                if (!d || title.includes("bazaar add") || title.includes("bazaar edit") || title.includes("bazaar remove")) continue;

                const money = parseFloat(d.cost_total || d.total_cost || d.cost || d.total_value || 0);
                if (money === 0) continue;

                if (title.includes("buy")) {
                    if (title.includes("bazaar")) snapshot.bazaarBuys.total += money;
                    else if (title.includes("market")) snapshot.marketBuys.total += money;
                    else if (title.includes("shop") || title.includes("item buy")) snapshot.shops.buys += money;
                    snapshot.totalProfit -= money;
                } else if (title.includes("sell")) {
                    if (title.includes("bazaar")) {
                        snapshot.bazaarSales.total += money; snapshot.totalProfit += money;
                        const itemId = d.items?.[0]?.id || d.items?.[0] || d.item;
                        if (itemId) {
                            const mv = await getMarketValue(itemId);
                            const loss = (mv * (d.quantity || 1)) - money;
                            if (loss > 0) { snapshot.bazaarSales.marketValueLost += loss; snapshot.totalProfit -= loss; }
                        }
                    } else if (title.includes("market")) { snapshot.marketSales.total += money; snapshot.totalProfit += money; }
                    else if (title.includes("shop")) { snapshot.shops.sales += money; snapshot.totalProfit += money; }
                }
            }
            Object.assign(data, snapshot);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            render();
        } catch (e) { console.error(e); }
    }

    render();
    sync();
    setInterval(sync, 30000);
})();