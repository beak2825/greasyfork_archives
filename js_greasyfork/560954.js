// ==UserScript==
// @name         Torn Mug & Profit Analyzer
// @namespace    DFs Torn Mug & Profit Analyzer
// @version      5.9
// @description  Mug profit analysis with v2 Market API and Weav3r Bazaar scraping. Optimized for Greasemonkey/Tampermonkey.
// @author       Dirt-Fairy
// @match        https://www.torn.com/page.php?sid=log*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      api.torn.com
// @connect      weav3r.dev
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560954/Torn%20Mug%20%20Profit%20Analyzer.user.js
// @updateURL https://update.greasyfork.org/scripts/560954/Torn%20Mug%20%20Profit%20Analyzer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const ENERGY_COST = 1800000;
    let currentProfitMode = 'market';

    GM_addStyle(`
        #mug-analyzer-container { background: #111 !important; border: 1px solid #444 !important; color: #fff !important; width: 340px !important; }
        .row-container { display: flex; justify-content: space-between; margin: 3px 0; font-size: 13px; }
        .txt-white { color: #fff !important; }
        .txt-yellow { color: #f1c40f !important; font-weight: bold; }
        .txt-green { color: #2ecc71 !important; font-weight: bold; }
        .txt-red { color: #e74c3c !important; font-weight: bold; }
        .item-box { background: #222; padding: 10px; margin-bottom: 8px; border-radius: 4px; border: 1px solid #333; }
        .item-name { color: #3498db; font-weight: bold; border-bottom: 1px solid #444; margin-bottom: 6px; padding-bottom: 2px; text-transform: uppercase; font-size: 12px; }
        .mode-btn { cursor: pointer; padding: 5px 10px; font-size: 11px; background: #333; border: 1px solid #444; color: #888; border-radius: 3px; flex: 1; text-align: center; }
        .active-btn { background: #e67e22; color: #fff; border-color: #e67e22; }
    `);

    const container = document.createElement('div');
    container.id = "mug-analyzer-container";
    container.style = "position: fixed; top: 60px; right: 20px; z-index: 9999; padding: 15px; border-radius: 5px; font-family: sans-serif; box-shadow: 0 0 10px #000;";
    document.body.appendChild(container);

    container.innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom:10px; align-items: center;">
            <b style="font-size:12px; color:#3498db;">MUG PROFIT ANALYZER</b>
            <span id="toggle-key" style="cursor:pointer; font-size:10px; color:#666;">[API KEY ▾]</span>
        </div>
        <div id="key-menu" style="display:none; margin-bottom:10px; background:#222; padding:8px; border-radius:3px;">
            <input type="text" id="api-input" placeholder="Paste Key" style="width:100%; font-size:11px; background:#000; color:#fff; border:1px solid #444; padding:4px; box-sizing:border-box;">
            <button id="save-key" style="width:100%; margin-top:5px; font-size:11px; cursor:pointer;">SAVE</button>
        </div>
        <textarea id="log-input" placeholder="Paste logs here..." style="width:100%; height:70px; background:#000; color:#0f0; border:1px solid #333; font-size:11px; padding:5px; box-sizing:border-box; font-family:monospace;"></textarea>
        <button id="run-btn" style="width:100%; margin-top:8px; background:#3498db; color:#fff; border:none; padding:10px; font-weight:bold; cursor:pointer; border-radius:3px;">ANALYZE SESSION</button>

        <div id="ui-controls" style="display:none; margin-top:12px; display:flex; gap:5px;">
            <button id="btn-mkt" class="mode-btn active-btn">MARKET (5%)</button>
            <button id="btn-baz" class="mode-btn">BAZAAR (0%)</button>
        </div>
        <div id="results" style="margin-top:12px; max-height:450px; overflow-y:auto;"></div>
    `;

    const resultsArea = document.getElementById('results');
    const apiInput = document.getElementById('api-input');
    let sessionData = [];

    apiInput.value = GM_getValue('torn_api_key', '');

    const callAPI = (url) => new Promise(res => {
        GM_xmlhttpRequest({ method: "GET", url, onload: (r) => res(JSON.parse(r.responseText)) });
    });

    const getBazaar = (id) => new Promise(res => {
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://weav3r.dev/item/${id}?timeframe=24h&tab=all`,
            onload: (r) => {
                const doc = new DOMParser().parseFromString(r.responseText, "text/html");
                const row = doc.querySelector('tbody tr td:nth-child(3)');
                if (row) {
                    const cleanPrice = row.innerText.match(/\$[\d,]+/);
                    const finalNum = cleanPrice ? parseInt(cleanPrice[0].replace(/[^0-9]/g, '')) : 0;
                    res(finalNum);
                } else {
                    res(0);
                }
            },
            onerror: () => res(0)
        });
    });

    const draw = () => {
        let total = 0;
        let html = "";
        sessionData.forEach(item => {
            const sell = currentProfitMode === 'market' ? item.mktPrice : item.bazPrice;
            const be = currentProfitMode === 'market' ? item.mktBE : null;
            const profit = (sell - (currentProfitMode === 'market' ? item.mktBE : item.bazBE)) * item.qty;
            total += profit;

            html += `
                <div class="item-box">
                    <div class="item-name">${item.qty}x ${item.name}</div>
                    <div class="row-container"><span>Eff. Cost:</span><span class="txt-yellow">$${Math.floor(item.eff).toLocaleString()}</span></div>
                    ${be ? `<div class="row-container"><span>Break-even (5%):</span><span class="txt-white">$${Math.floor(be).toLocaleString()}</span></div>` : ''}
                    <div class="row-container"><span>Lowest ${currentProfitMode === 'market' ? 'Market' : 'Bazaar'}:</span><span>$${sell.toLocaleString()}</span></div>
                    <div class="row-container ${profit > 0 ? 'txt-green' : 'txt-red'}" style="margin-top:8px; border-top:1px solid #444; padding-top:6px;">
                        <span>PROFIT:</span><span>$${Math.floor(profit).toLocaleString()}</span>
                    </div>
                </div>`;
        });
        resultsArea.innerHTML = html + `<div style="text-align:center; padding:12px; background:#222; border:1px solid #444; border-radius:4px;" class="${total > 0 ? 'txt-green' : 'txt-red'}">SESSION TOTAL: $${Math.floor(total).toLocaleString()}</div>`;
    };

    document.getElementById('btn-mkt').onclick = () => {
        currentProfitMode = 'market';
        document.getElementById('btn-mkt').classList.add('active-btn');
        document.getElementById('btn-baz').classList.remove('active-btn');
        draw();
    };

    document.getElementById('btn-baz').onclick = () => {
        currentProfitMode = 'bazaar';
        document.getElementById('btn-baz').classList.add('active-btn');
        document.getElementById('btn-mkt').classList.remove('active-btn');
        draw();
    };

    document.getElementById('toggle-key').onclick = () => {
        const m = document.getElementById('key-menu');
        const isHidden = m.style.display === 'none';
        m.style.display = isHidden ? 'block' : 'none';
    };

    document.getElementById('save-key').onclick = () => {
        GM_setValue('torn_api_key', apiInput.value);
        alert("API Key Saved");
        document.getElementById('key-menu').style.display = 'none';
    };

    document.getElementById('run-btn').onclick = async () => {
        const key = GM_getValue('torn_api_key', '');
        const logs = document.getElementById('log-input').value;
        if (!key) { alert("Please save API Key first"); return; }

        const items = [], lines = logs.split('\n');
        let paid = 0;

        lines.forEach(l => {
            const m = l.match(/bought\s+(?:(\d+)x\s+|an?\s+)?(.*?)\s+on.*?at\s+\$([\d,]+)/i);
            if (m) {
                const qty = parseInt(m[1]) || 1;
                const price = parseInt(m[3].replace(/,/g, ''));
                items.push({ name: m[2].trim(), qty, price });
                paid += (price * qty);
            }
        });

        const mugM = logs.match(/mugged them for \$([\d,]+)/i);
        const mug = mugM ? parseInt(mugM[1].replace(/,/g, '')) : 0;
        const disc = paid > 0 ? ((mug - ENERGY_COST) / paid) : 0;

        resultsArea.innerHTML = "<b class='txt-yellow'>Syncing...</b>";
        const data = await callAPI(`https://api.torn.com/torn/?selections=items&key=${key}`);
        sessionData = [];

        for (const i of items) {
            const id = Object.keys(data.items).find(k => data.items[k].name.toLowerCase() === i.name.toLowerCase());
            const [v2, baz] = await Promise.all([
                callAPI(`https://api.torn.com/v2/market/${id}?selections=itemmarket&key=${key}`),
                getBazaar(id)
            ]);

            const mktLowest = (v2.itemmarket && v2.itemmarket.listings && v2.itemmarket.listings[0]) ? v2.itemmarket.listings[0].price : 0;
            const eff = i.price * (1 - disc);

            sessionData.push({
                name: i.name,
                qty: i.qty,
                eff: eff,
                mktPrice: mktLowest,
                bazPrice: baz,
                mktBE: Math.ceil(eff / 0.95),
                bazBE: Math.ceil(eff)
            });
        }
        document.getElementById('ui-controls').style.display = 'flex';
        draw();
    };
})();