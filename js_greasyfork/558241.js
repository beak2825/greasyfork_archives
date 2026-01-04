// ==UserScript==
// @name         LiveFPL Buy/Sell Prices
// @namespace    http://tampermonkey.net/
// @version      1.02
// @description  Adds buy and sell price columns to livefpl.net/prices for your team
// @author       You
// @license      MIT
// @match        https://www.livefpl.net/prices*
// @grant        GM_xmlhttpRequest
// @connect      fantasy.premierleague.com
// @downloadURL https://update.greasyfork.org/scripts/558241/LiveFPL%20BuySell%20Prices.user.js
// @updateURL https://update.greasyfork.org/scripts/558241/LiveFPL%20BuySell%20Prices.meta.js
// ==/UserScript==

// Price calculation logic adapted from:
// https://github.com/solioanalytics/open-fpl-solver/

(function() {
    'use strict';

    const FPL_API = 'https://fantasy.premierleague.com/api';
    const CACHE_KEY = 'fpl_price_cache';
    let priceData = {};
    let teamId = null;
    let dataLoaded = false;
    let cachedAt = null;

    function cacheExpiryFor(cachedAt) {
        const c = new Date(cachedAt);
        const expiry = new Date(c);
        expiry.setUTCHours(1, 35, 0, 0);
        if (c >= expiry) {
            expiry.setUTCDate(expiry.getUTCDate() + 1);
        }
        return expiry;
    }

    function isCacheValid(cachedAt) {
        return Date.now() < cacheExpiryFor(cachedAt).getTime();
    }

    function getCache(teamId) {
        try {
            const raw = localStorage.getItem(CACHE_KEY);
            if (!raw) return null;
            const cache = JSON.parse(raw);
            if (cache.teamId !== teamId) return null;
            if (!isCacheValid(cache.cachedAt)) return null;
            return { data: cache.data, cachedAt: cache.cachedAt };
        } catch {
            return null;
        }
    }

    function setCache(teamId, data) {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
            teamId,
            data,
            cachedAt: new Date().toISOString()
        }));
    }

    function gmFetch(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: (response) => {
                    if (response.status === 200) {
                        resolve(JSON.parse(response.responseText));
                    } else {
                        reject(new Error(`HTTP ${response.status}`));
                    }
                },
                onerror: reject
            });
        });
    }

    async function fetchPriceData(teamId) {
        const [bootstrap, gw1, transfers, history] = await Promise.all([
            gmFetch(`${FPL_API}/bootstrap-static/`),
            gmFetch(`${FPL_API}/entry/${teamId}/event/1/picks/`),
            gmFetch(`${FPL_API}/entry/${teamId}/transfers/`),
            gmFetch(`${FPL_API}/entry/${teamId}/history/`)
        ]);

        const startPrices = {};
        const nowCosts = {};
        for (const el of bootstrap.elements) {
            startPrices[el.id] = el.now_cost - el.cost_change_start;
            nowCosts[el.id] = el.now_cost;
        }

        const fhGws = new Set(
            history.chips.filter(c => c.name === 'freehit').map(c => c.event)
        );

        const squad = {};
        for (const pick of gw1.picks) {
            squad[pick.element] = startPrices[pick.element];
        }

        for (const t of transfers.slice().reverse()) {
            if (fhGws.has(t.event)) continue;
            if (t.element_in) {
                squad[t.element_in] = t.element_in_cost;
            }
            if (t.element_out) {
                delete squad[t.element_out];
            }
        }

        const result = {};
        for (const [playerId, purchasePrice] of Object.entries(squad)) {
            const id = parseInt(playerId);
            const nowCost = nowCosts[id];
            const diff = nowCost - purchasePrice;
            const sellingPrice = diff > 0
                ? purchasePrice + Math.floor(diff / 2)
                : nowCost;

            result[id] = {
                buy: nowCost,
                sell: sellingPrice,
                purchase: purchasePrice
            };
        }

        return result;
    }

    function formatPrice(tenths) {
        return `£${(tenths / 10).toFixed(1)}`;
    }

    function addColumnHeaders() {
        const headerRow = document.querySelector('#data-table thead tr');
        if (!headerRow || headerRow.querySelector('.bought-price-header')) return;

        const predictionHeader = document.getElementById('th-riser-faller');
        if (!predictionHeader) return;

        const headers = [
            { className: 'bought-price-header', text: 'Bought' },
            { className: 'sell-price-header', text: 'Sell' },
            { className: 'sell-rise-header', text: 'Sell +0.1' },
            { className: 'sell-fall-header', text: 'Sell -0.1' }
        ];

        for (const h of headers.reverse()) {
            const th = document.createElement('th');
            th.className = h.className;
            th.style.cssText = 'width:6%; text-align:center; font-size:0.9em;';
            th.textContent = h.text;
            predictionHeader.insertAdjacentElement('afterend', th);
        }
    }

    function calcSellingPrice(purchasePrice, currentPrice) {
        const diff = currentPrice - purchasePrice;
        return diff > 0 ? purchasePrice + Math.floor(diff / 2) : currentPrice;
    }

    function addPriceCells() {
        const rows = document.querySelectorAll('#data-table tbody tr');

        for (const row of rows) {
            if (row.querySelector('.bought-price-cell')) continue;

            const playerDiv = row.querySelector('[data-id]');
            if (!playerDiv) continue;

            const playerId = parseInt(playerDiv.getAttribute('data-id'));
            const prices = priceData[playerId];

            const predictionCell = row.children[4];
            if (!predictionCell) continue;

            const cellStyle = 'text-align:center; padding:4px; font-size:0.9em;';

            const boughtCell = document.createElement('td');
            boughtCell.className = 'bought-price-cell';
            boughtCell.style.cssText = cellStyle;

            const sellCell = document.createElement('td');
            sellCell.className = 'sell-price-cell';
            sellCell.style.cssText = cellStyle;

            const sellRiseCell = document.createElement('td');
            sellRiseCell.className = 'sell-rise-cell';
            sellRiseCell.style.cssText = cellStyle;

            const sellFallCell = document.createElement('td');
            sellFallCell.className = 'sell-fall-cell';
            sellFallCell.style.cssText = cellStyle;

            if (prices) {
                const sellAfterRise = calcSellingPrice(prices.purchase, prices.buy + 1);
                const sellAfterFall = calcSellingPrice(prices.purchase, prices.buy - 1);

                const storedValue = prices.sell - prices.purchase;
                const storedStr = storedValue !== 0
                    ? ` (${storedValue > 0 ? '+' : ''}${(storedValue / 10).toFixed(1)})`
                    : '';

                boughtCell.textContent = formatPrice(prices.purchase);
                sellCell.textContent = `${formatPrice(prices.sell)}${storedStr}`;
                sellRiseCell.textContent = formatPrice(sellAfterRise);
                sellFallCell.textContent = formatPrice(sellAfterFall);

                if (prices.sell > prices.purchase) {
                    sellCell.style.color = '#28a745';
                } else if (prices.sell < prices.purchase) {
                    sellCell.style.color = '#dc3545';
                }

                if (sellAfterRise > prices.sell) {
                    sellRiseCell.style.color = '#28a745';
                    sellRiseCell.style.fontWeight = 'bold';
                }
                if (sellAfterFall < prices.sell) {
                    sellFallCell.style.color = '#dc3545';
                    sellFallCell.style.fontWeight = 'bold';
                }
            } else {
                boughtCell.textContent = '-';
                sellCell.textContent = '-';
                sellRiseCell.textContent = '-';
                sellFallCell.textContent = '-';
            }

            const cells = [sellFallCell, sellRiseCell, sellCell, boughtCell];
            for (const cell of cells) {
                predictionCell.insertAdjacentElement('afterend', cell);
            }
        }
    }

    function isMyTeamTabActive() {
        const myTeamBtn = document.querySelector('#my-team-btn');
        return myTeamBtn && myTeamBtn.classList.contains('active');
    }

    function addSummaryBanner() {
        const banner = document.querySelector('.fpl-summary-banner');

        if (!isMyTeamTabActive()) {
            if (banner) banner.style.display = 'none';
            return;
        }

        if (banner) {
            banner.style.display = 'flex';
            return;
        }

        let totalSquadValue = 0;
        let totalSellValue = 0;

        for (const prices of Object.values(priceData)) {
            totalSquadValue += prices.buy;
            totalSellValue += prices.sell;
        }

        const newBanner = document.createElement('div');
        newBanner.className = 'fpl-summary-banner';
        newBanner.style.cssText = `
            background: #37003c;
            color: white;
            padding: 12px 20px;
            margin: 10px 0;
            border-radius: 8px;
            display: flex;
            justify-content: center;
            gap: 40px;
            font-size: 1.1em;
        `;

        const formatDateTime = (iso) => new Date(iso).toLocaleString('en-GB', {
            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
        });

        const cacheInfo = cachedAt
            ? `Cached: ${formatDateTime(cachedAt)} · Expires: ${formatDateTime(cacheExpiryFor(cachedAt).toISOString())}`
            : '';

        newBanner.innerHTML = `
            <span style="display:flex; gap:40px;">
                <span><strong>Squad Value:</strong> ${formatPrice(totalSquadValue)}</span>
                <span><strong>Sell Value:</strong> ${formatPrice(totalSellValue)}</span>
            </span>
            <span style="font-size:0.7em; opacity:0.7; margin-left:auto; display:flex; align-items:center; gap:8px;">
                ${cacheInfo}
                <button id="fpl-clear-cache" style="background:none; border:none; color:white; opacity:0.5; cursor:pointer; font-size:1.2em; padding:0 4px;" title="Clear cache">×</button>
            </span>
        `;

        newBanner.querySelector('#fpl-clear-cache').addEventListener('click', async () => {
            localStorage.removeItem(CACHE_KEY);
            dataLoaded = false;
            cachedAt = null;
            priceData = {};
            document.querySelector('.fpl-summary-banner')?.remove();
            document.querySelectorAll('.bought-price-header, .sell-price-header, .sell-rise-header, .sell-fall-header').forEach(el => el.remove());
            document.querySelectorAll('.bought-price-cell, .sell-price-cell, .sell-rise-cell, .sell-fall-cell').forEach(el => el.remove());
            await loadPriceData();
        });

        const table = document.querySelector('#data-table');
        if (table) {
            table.parentElement.insertBefore(newBanner, table);
        }
    }

    function injectPrices() {
        addColumnHeaders();
        addPriceCells();
        addSummaryBanner();
    }

    function getTeamIdFromPage() {
        if (typeof unsafeWindow !== 'undefined' && unsafeWindow.picks && unsafeWindow.picks.length > 0) {
            const cookies = document.cookie.split(';');
            for (const cookie of cookies) {
                const [name, value] = cookie.trim().split('=');
                if (name === 'fpl_id' || name === 'id') {
                    return value;
                }
            }
        }

        const stored = localStorage.getItem('fpl_id');
        if (stored) return stored;

        return null;
    }

    async function loadPriceData() {
        if (dataLoaded) {
            injectPrices();
            return;
        }

        teamId = getTeamIdFromPage();

        if (!teamId) {
            teamId = prompt('Enter your FPL Team ID:');
            if (!teamId) return;
            localStorage.setItem('fpl_id', teamId);
        }

        const cached = getCache(teamId);
        if (cached) {
            console.log('[LiveFPL Prices] Using cached data');
            priceData = cached.data;
            cachedAt = cached.cachedAt;
            dataLoaded = true;
            injectPrices();
            return;
        }

        try {
            console.log('[LiveFPL Prices] Fetching price data for team', teamId);
            priceData = await fetchPriceData(teamId);
            cachedAt = new Date().toISOString();
            setCache(teamId, priceData);
            dataLoaded = true;
            console.log('[LiveFPL Prices] Loaded prices for', Object.keys(priceData).length, 'players');
            injectPrices();
        } catch (err) {
            console.error('[LiveFPL Prices] Error:', err);
            alert('Failed to fetch FPL data. Check console for details.');
        }
    }

    function init() {
        const myTeamBtn = document.querySelector('#my-team-btn');
        if (myTeamBtn) {
            myTeamBtn.addEventListener('click', loadPriceData);
        }

        const table = document.querySelector('#data-table');
        if (table && typeof jQuery !== 'undefined') {
            jQuery(table).on('draw.dt', () => {
                if (dataLoaded) injectPrices();
            });
        }

        const observer = new MutationObserver(() => {
            if (dataLoaded && !document.querySelector('.bought-price-header')) {
                injectPrices();
            }
        });
        const tbody = document.querySelector('#data-table tbody');
        if (tbody) {
            observer.observe(tbody, { childList: true });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(init, 1000));
    } else {
        setTimeout(init, 1000);
    }

})();
