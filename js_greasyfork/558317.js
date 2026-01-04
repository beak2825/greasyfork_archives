// ==UserScript==
// @name        Torn Stock Market Enhancer
// @namespace   http://tampermonkey.net/
// @version     1.0.0
// @description Enhanced stock market interface with customizable settings, sorted favorites, API integration, and smart momentum analysis.
// @author      Legaci [2100546]
// @match       https://www.torn.com/page.php?sid=stocks*
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @connect     api.torn.com
// @run-at      document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558317/Torn%20Stock%20Market%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/558317/Torn%20Stock%20Market%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION (Loaded from Storage) ---
    const CONFIG = {
        API_KEY: localStorage.getItem('TSME_API_KEY') || '',
        // Default 60s (60000ms)
        UPDATE_INTERVAL: parseInt(localStorage.getItem('TSME_UPDATE_INTERVAL')) || 60000,
        CACHE_DURATION: 300000,
        // Default 0.25%
        ALERT_THRESHOLD_HOURLY: parseFloat(localStorage.getItem('TSME_ALERT_THRESHOLD')) || 0.25,
    };

    // --- STATE MANAGEMENT ---
    const state = {
        stocks: {},
        historicalData: {},
        lastPrices: {},
        inMemoryCache: {},
        pinnedStocks: JSON.parse(localStorage.getItem('TSME_pinnedStocks') || '[]'),
        intervalId: null,
        initialized: false
    };

    // --- LOGGING & UTILITIES ---
    const Log = {
        debug: (...args) => console.log(`[TSME DEBUG]`, ...args),
        error: (...args) => console.error(`[TSME ERROR]`, ...args),
        info: (...args) => console.info(`[TSME INFO]`, ...args)
    };

    const Cache = {
        get(key) {
            const item = state.inMemoryCache[key];
            if (!item) return null;
            if (Date.now() - item.timestamp > CONFIG.CACHE_DURATION) {
                delete state.inMemoryCache[key];
                return null;
            }
            return item.data;
        },
        set(key, data) {
            state.inMemoryCache[key] = { data: data, timestamp: Date.now() };
        },
    };

    function savePinnedStocks() {
        localStorage.setItem('TSME_pinnedStocks', JSON.stringify(state.pinnedStocks));
    }

    function extractStockAcronym(stockElement) {
        const nameEl = stockElement.querySelector('.nameContainer___bxIrG');
        if (!nameEl) return null;
        const acronymMatch = nameEl.textContent.match(/\(([A-Z]+)\)/);
        return acronymMatch ? acronymMatch[1] : null;
    }

    function getStockIdByAcronym(acronym) {
        if (!state.stocks) return null;
        const stock = Object.values(state.stocks).find(s => s.acronym === acronym);
        return stock ? stock.stock_id : null;
    }

    function formatNumber(num) {
        if (typeof num !== 'number') return 'N/A';
        return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // --- DOM ELEMENT HELPERS ---

    function createStarIcon(isPinned = false) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '14');
        svg.setAttribute('height', '14');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', isPinned ? '#FFD700' : 'none');
        svg.setAttribute('stroke', '#FFD700');
        svg.setAttribute('stroke-width', '2');
        svg.setAttribute('stroke-linecap', 'round');
        svg.setAttribute('stroke-linejoin', 'round');
        svg.classList.add('star-icon');

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z');
        svg.appendChild(path);

        return svg;
    }

    function createPinButton(stockId) {
        const button = document.createElement('button');
        button.className = 'pin-button';
        const isPinned = state.pinnedStocks.includes(stockId);
        button.title = isPinned ? 'Unpin stock' : 'Pin stock';

        const star = createStarIcon(isPinned);
        button.appendChild(star);

        button.addEventListener('click', (e) => {
            e.stopPropagation();
            togglePinStock(stockId);
            button.innerHTML = '';
            button.appendChild(createStarIcon(state.pinnedStocks.includes(stockId)));
        });

        return button;
    }

    // --- API HANDLERS ---

    async function apiRequest(url, selection, key = CONFIG.API_KEY) {
        return new Promise((resolve, reject) => {
            if (!key) return reject(new Error('API key is missing.'));

            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://api.torn.com/${url}?key=${key}&selections=${selection}`,
                onload: (response) => {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.error) return reject(data.error);
                        resolve(data);
                    } catch (e) {
                        reject({ error: 'Invalid JSON response.' });
                    }
                },
                onerror: (error) => reject({ error: `Network error: ${error.status}` })
            });
        });
    }

    async function fetchStocksData() {
        const cacheKey = 'all_stocks';
        const cached = Cache.get(cacheKey);
        if (cached) return cached;

        const data = await apiRequest('torn', 'stocks');
        Cache.set(cacheKey, data.stocks);
        return data.stocks;
    }

    async function fetchStockHistory(stockId) {
        const cacheKey = `stock_hist_${stockId}`;
        const cached = Cache.get(cacheKey);
        if (cached) return cached;

        const data = await apiRequest(`torn/${stockId}`, 'stocks');
        const stockData = data.stocks[stockId];
        Cache.set(cacheKey, stockData);
        return stockData;
    }

    // --- UI LOGIC ---

    function togglePinStock(stockId) {
        const index = state.pinnedStocks.indexOf(stockId);
        if (index === -1) {
            state.pinnedStocks.push(stockId);
        } else {
            state.pinnedStocks.splice(index, 1);
        }
        savePinnedStocks();
        reorganizeStockList();
        updateAnalytics();
    }

    function addPinButtons() {
        document.querySelectorAll('.stock___ElSDB').forEach(stockEl => {
            if (stockEl.querySelector('.pin-button')) return;

            const acronym = extractStockAcronym(stockEl);
            const stockId = getStockIdByAcronym(acronym);

            if (!stockId) return;

            const logoContainer = stockEl.querySelector('.logoContainer___M_y5p');
            if (logoContainer) {
                if (window.getComputedStyle(logoContainer).position === 'static') {
                    logoContainer.style.position = 'relative';
                }
                const pinButton = createPinButton(stockId);
                logoContainer.appendChild(pinButton);
            }
        });
    }

    function reorganizeStockList() {
        const stockRows = Array.from(document.querySelectorAll('.stock___ElSDB'));
        if (!stockRows.length) return;

        const parent = stockRows[0].parentElement;
        if (!parent) return;

        const pinnedRows = [];
        const unpinnedRows = [];

        stockRows.forEach(row => {
            const acronym = extractStockAcronym(row);
            const stockId = getStockIdByAcronym(acronym);

            if (stockId && state.pinnedStocks.includes(stockId)) {
                row.classList.add('pinned-stock');
                pinnedRows.push(row);
            } else {
                row.classList.remove('pinned-stock');
                unpinnedRows.push(row);
            }
        });

        pinnedRows.sort((a, b) => {
            const aId = getStockIdByAcronym(extractStockAcronym(a));
            const bId = getStockIdByAcronym(extractStockAcronym(b));
            return state.pinnedStocks.indexOf(aId) - state.pinnedStocks.indexOf(bId);
        });

        const fragment = document.createDocumentFragment();
        [...pinnedRows, ...unpinnedRows].forEach(row => fragment.appendChild(row));
        parent.appendChild(fragment);

        addPinButtons();
    }

    function calculateTrend(stock) {
        const hist = state.historicalData[stock.stock_id];
        if (!hist) return null;

        const momentum = hist.last_hour?.change_percentage || 0;
        const dailyTrend = hist.last_day?.change_percentage || 0;
        const weeklyTrend = hist.last_week?.change_percentage || 0;

        let trend = 'neutral';
        let speed = 'Stagnant';

        if (momentum > 0.5) {
            trend = 'strong-up';
            speed = 'Fast Rising 🚀';
        } else if (momentum > 0) {
            trend = 'up';
            speed = 'Slow Rising ↗️';
        } else if (momentum < -0.5) {
            trend = 'strong-down';
            speed = 'Fast Falling 📉';
        } else if (momentum < 0) {
            trend = 'down';
            speed = 'Slow Falling ↘️';
        }

        return { trend, speed, momentum, dailyTrend, weeklyTrend };
    }

    function addTrendIndicators() {
        document.querySelectorAll('.stock___ElSDB').forEach(stockEl => {
            const nameEl = stockEl.querySelector('.nameContainer___bxIrG');
            if (!nameEl) return;

            const acronym = extractStockAcronym(stockEl);
            const stock = Object.values(state.stocks).find(s => s.acronym === acronym);
            if (!stock) return;

            const existingDot = nameEl.querySelector('.stock-trend-indicator');
            if (existingDot) existingDot.remove();
            const existingWrapper = nameEl.querySelector('.stock-momentum-wrapper');
            if (existingWrapper) existingWrapper.remove();

            const trend = calculateTrend(stock);
            if (!trend) return;

            const indicator = document.createElement('span');
            indicator.className = `stock-trend-indicator trend-${trend.trend}`;
            indicator.title = `${trend.speed}\nHourly: ${formatNumber(trend.momentum)}%\nDaily: ${formatNumber(trend.dailyTrend)}%\nWeekly: ${formatNumber(trend.weeklyTrend)}%`;
            nameEl.appendChild(indicator);
        });
    }

    function updateLivePrices() {
        document.querySelectorAll('.stock___ElSDB').forEach(stockEl => {
            const acronym = extractStockAcronym(stockEl);
            const stock = Object.values(state.stocks).find(s => s.acronym === acronym);
            if (!stock) return;

            const priceEl = stockEl.querySelector('.priceContainer___c5v5F .value___YpnUQ');
            if (!priceEl) return;

            const currentUIPrice = parseFloat(priceEl.textContent.replace(/[$,]/g, '')) || 0;
            const newAPIPrice = stock.current_price;

            if (currentUIPrice !== newAPIPrice) {
                const isUp = newAPIPrice > currentUIPrice;
                priceEl.textContent = '$' + newAPIPrice.toLocaleString();
                priceEl.classList.add('live-price-update', isUp ? 'price-up' : 'price-down');

                setTimeout(() => {
                    priceEl.classList.remove('live-price-update', 'price-up', 'price-down');
                }, 1000);
            }
        });
    }

    function checkAndDisplayAlerts(stock, newTrend, oldTrend) {
        if (!newTrend || !oldTrend) return;

        const momentum = newTrend.momentum;
        const oldMomentum = oldTrend.momentum;
        const threshold = CONFIG.ALERT_THRESHOLD_HOURLY;
        const acronym = stock.acronym;
        let alertMessage = null;

        if (momentum >= threshold && oldMomentum < threshold) {
            alertMessage = `📈 **${acronym}** surged past ${threshold}% hourly! (+${formatNumber(momentum)}%)`;
        } else if (momentum <= -threshold && oldMomentum > -threshold) {
            alertMessage = `📉 **${acronym}** dropped past -${threshold}% hourly! (${formatNumber(momentum)}%)`;
        }

        if (alertMessage) {
            const container = document.getElementById('stock-enhancer-alerts');
            if (container) {
                const alertEl = document.createElement('div');
                alertEl.className = `alert-box alert-${momentum > 0 ? 'buy' : 'sell'}`;
                alertEl.innerHTML = `<strong>ALERT:</strong> ${alertMessage}`;

                container.prepend(alertEl);
                setTimeout(() => alertEl.classList.add('fading'), 5000);
                setTimeout(() => alertEl.remove(), 7000);
            }
        }
    }

    function calculatePortfolioMetrics() {
        const ownedStocks = [];
        document.querySelectorAll('.stock___ElSDB').forEach(stockEl => {
            const acronym = extractStockAcronym(stockEl);
            const ownedCountEl = stockEl.querySelector('.stockOwned___eXJed .count___Al4Wq');

            if (ownedCountEl && ownedCountEl.textContent !== 'None') {
                const count = parseInt(ownedCountEl.textContent.replace(/,/g, ''));
                if (count > 0 && acronym) {
                    ownedStocks.push({ acronym, count });
                }
            }
        });
        return ownedStocks;
    }

    function updateAnalytics() {
        const content = document.getElementById('analytics-content');
        if (!content) return;

        const portfolio = calculatePortfolioMetrics();
        const trackedStocks = new Set(portfolio.map(p => getStockIdByAcronym(p.acronym)).filter(Boolean).concat(state.pinnedStocks)).size;
        const loadedHistorical = Object.keys(state.historicalData).length;

        let html = '';
        if (!CONFIG.API_KEY) {
            html += `<div class="alert-box alert-sell" style="margin-bottom: 10px; cursor: pointer;" id="missing-key-alert">🔑 **API Key Missing!** Click to configure.</div>`;
        }

        html += '<div class="stock-metrics">';

        const totalValueEl = document.querySelector('.tt-total-stock-value .value');
        const totalProfitEl = document.querySelector('.tt-total-stock-value .profit');

        if (totalValueEl) html += `<div class="metric-card"><div class="metric-label">Value</div><div class="metric-value">${totalValueEl.textContent}</div></div>`;

        if (totalProfitEl) {
            const profitText = totalProfitEl.textContent.trim();
            const isNegative = profitText.startsWith('-');
            html += `<div class="metric-card"><div class="metric-label">Profit</div><div class="metric-value ${isNegative ? 'negative' : 'positive'}">${profitText}</div></div>`;
        }

        html += `
            <div class="metric-card"><div class="metric-label">Pinned</div><div class="metric-value">${state.pinnedStocks.length}</div></div>
            <div class="metric-card"><div class="metric-label">Data</div><div class="metric-value">${loadedHistorical} / ${trackedStocks}</div></div>
        </div>`;

        const lastUpdateText = state.lastUpdate ? new Date(state.lastUpdate).toLocaleTimeString() : 'Waiting...';
        
        const intervalSecs = Math.round(CONFIG.UPDATE_INTERVAL / 1000);
        html += `<div class="update-time">Updated: ${lastUpdateText} (Every ${intervalSecs}s)</div>`;

        content.innerHTML = html;

        const alertBox = content.querySelector('#missing-key-alert');
        if (alertBox) alertBox.addEventListener('click', () => showSettingsModal(false));
    }

    // --- MAIN LOOP ---

    function startUpdateInterval() {
        if (state.intervalId) clearInterval(state.intervalId);
        if (CONFIG.API_KEY) state.intervalId = setInterval(updateData, CONFIG.UPDATE_INTERVAL);
    }

    async function updateData() {
        try {
            state.stocks = await fetchStocksData();

            const portfolio = calculatePortfolioMetrics();
            const ownedAcronyms = portfolio.map(p => p.acronym);
            const stocksToFetchIds = new Set(ownedAcronyms.map(getStockIdByAcronym).filter(Boolean).concat(state.pinnedStocks));

            for (const stockId of stocksToFetchIds) {
                const stock = Object.values(state.stocks).find(s => s.stock_id === stockId);
                if (!stock) continue;

                const oldTrend = state.historicalData[stockId] ? calculateTrend(stock) : null;
                const histData = await fetchStockHistory(stockId);
                state.historicalData[stockId] = histData;
                const newTrend = calculateTrend(stock);

                if ((ownedAcronyms.includes(stock.acronym) || state.pinnedStocks.includes(stockId)) && oldTrend && newTrend) {
                    checkAndDisplayAlerts(stock, newTrend, oldTrend);
                }
                await new Promise(resolve => setTimeout(resolve, 50));
            }

            state.lastUpdate = Date.now();
            updateAnalytics();
            updateLivePrices();
            addTrendIndicators();
            addPinButtons();
            reorganizeStockList();

        } catch (error) {
            if (error && error.code === 2) {
                 clearInterval(state.intervalId);
                 showSettingsModal(true);
            }
            updateAnalytics();
        }
    }

    // --- MODALS & BUTTONS ---

    function createApiKeyButton() {
        const btn = document.createElement('button');
        btn.innerHTML = '⚙️ Settings';
        btn.style.cssText = `background: #444; color: white; border: 1px solid #666; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 11px; margin-left: 5px; float: right; transform: translateY(-3px);`;
        btn.addEventListener('click', () => showSettingsModal(false));
        return btn;
    }

    function createHelpButton() {
        const btn = document.createElement('button');
        btn.innerHTML = '❓ Help';
        btn.style.cssText = `background: #444; color: white; border: 1px solid #666; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 11px; margin-left: 10px; float: right; transform: translateY(-3px);`;
        btn.addEventListener('click', () => showHelpModal());
        return btn;
    }

    // --- SETTINGS MODAL (Replaces showApiKeyModal) ---
    async function showSettingsModal(wasInvalid = false) {
        let modal = document.getElementById('tsme-modal');
        if (modal) modal.remove();

        modal = document.createElement('div');
        modal.id = 'tsme-modal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); display: flex; justify-content: center; align-items: center; z-index: 99999;`;

        const content = document.createElement('div');
        content.style.cssText = `background: #1a1a1a; padding: 30px; border-radius: 8px; border: 1px solid #333; max-width: 420px; width: 90%; color: white;`;

        let warning = wasInvalid ? `<p style="color: #ff4444; font-weight: bold;">⚠️ Invalid API Key</p>` : '';

        // Display update interval in seconds (e.g. 60)
        const currentIntervalSeconds = CONFIG.UPDATE_INTERVAL / 1000;

        content.innerHTML = `
            <h3 style="margin-top: 0; color: #4CAF50;">Configuration</h3>
            ${warning}

            <div style="margin-bottom: 20px;">
                <label style="display:block; margin-bottom:5px; color:#ccc; font-size:12px;">Torn API Key (Requires "Stocks")</label>
                <input type="password" id="api-key-input" style="width: 100%; padding: 10px; background: #333; border: 1px solid #444; color: white; border-radius: 4px; box-sizing: border-box;" value="${CONFIG.API_KEY}">
            </div>

            <div style="display: flex; gap: 15px; margin-bottom: 25px;">
                <div style="flex: 1;">
                    <label style="display:block; margin-bottom:5px; color:#ccc; font-size:12px;">Update Interval (seconds)</label>
                    <input type="number" id="interval-input" min="30" style="width: 100%; padding: 10px; background: #333; border: 1px solid #444; color: white; border-radius: 4px; box-sizing: border-box;" value="${currentIntervalSeconds}">
                </div>
                <div style="flex: 1;">
                    <label style="display:block; margin-bottom:5px; color:#ccc; font-size:12px;">Alert Threshold (%)</label>
                    <input type="number" id="threshold-input" step="0.01" min="0.01" style="width: 100%; padding: 10px; background: #333; border: 1px solid #444; color: white; border-radius: 4px; box-sizing: border-box;" value="${CONFIG.ALERT_THRESHOLD_HOURLY}">
                </div>
            </div>

            <div style="display: flex; justify-content: flex-end;">
                <button id="cancel-api-btn" style="padding: 8px 16px; background: #666; border: none; color: white; border-radius: 4px; cursor: pointer;">Close</button>
                <button id="save-api-btn" style="padding: 8px 16px; background: #4CAF50; border: none; color: white; border-radius: 4px; cursor: pointer; margin-left: 10px;">Save & Apply</button>
            </div>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        modal.querySelector('#save-api-btn').addEventListener('click', async () => {
            const apiKeyInput = modal.querySelector('#api-key-input');
            const intervalInput = modal.querySelector('#interval-input');
            const thresholdInput = modal.querySelector('#threshold-input');
            const saveBtn = modal.querySelector('#save-api-btn');

            const key = apiKeyInput.value.trim();
            const newInterval = parseInt(intervalInput.value) * 1000; // Convert back to ms
            const newThreshold = parseFloat(thresholdInput.value);

            if (key) {
                apiKeyInput.disabled = true;
                saveBtn.textContent = 'Validating...';

                try {
                    await apiRequest('torn', 'stocks', key);

                    // Save to CONFIG & Storage
                    CONFIG.API_KEY = key;
                    CONFIG.UPDATE_INTERVAL = newInterval >= 30000 ? newInterval : 60000; // Minimum 30s safeguard
                    CONFIG.ALERT_THRESHOLD_HOURLY = newThreshold || 0.25;

                    localStorage.setItem('TSME_API_KEY', CONFIG.API_KEY);
                    localStorage.setItem('TSME_UPDATE_INTERVAL', CONFIG.UPDATE_INTERVAL);
                    localStorage.setItem('TSME_ALERT_THRESHOLD', CONFIG.ALERT_THRESHOLD_HOURLY);

                    modal.remove();
                    startUpdateInterval(); // Restart with new interval
                    updateData();
                    Log.info(`Configuration Saved: Interval=${CONFIG.UPDATE_INTERVAL}ms, Threshold=${CONFIG.ALERT_THRESHOLD_HOURLY}%`);
                } catch (error) {
                    alert(`Invalid Key or Network Error`);
                    apiKeyInput.disabled = false;
                    saveBtn.textContent = 'Save & Apply';
                }
            } else {
                alert('API Key is required.');
            }
        });
        modal.querySelector('#cancel-api-btn').addEventListener('click', () => modal.remove());
    }

    // --- HELP MODAL (Updated) ---
    function showHelpModal() {
        let modal = document.getElementById('tsme-modal');
        if (modal) modal.remove();

        modal = document.createElement('div');
        modal.id = 'tsme-modal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); display: flex; justify-content: center; align-items: center; z-index: 99999;`;

        const content = document.createElement('div');
        content.style.cssText = `background: #1a1a1a; padding: 30px; border-radius: 8px; border: 1px solid #333; max-width: 500px; width: 90%; color: white; font-size: 14px; line-height: 1.6;`;

        content.innerHTML = `
            <h3 style="margin-top: 0; color: #4CAF50;">Enhancer Guide</h3>

            <div style="margin-bottom: 20px; border-bottom: 1px solid #333; padding-bottom: 10px;">
                <h4 style="color: #FFD700; margin: 10px 0 5px;">⭐ How to Pin Stocks</h4>
                <p style="margin: 0; color: #ccc;">Hover your mouse over any <strong>Stock Logo</strong> (left side) to reveal the star button. Click it to pin that stock to the top.</p>
            </div>

            <div style="margin-bottom: 20px; border-bottom: 1px solid #333; padding-bottom: 10px;">
                <h4 style="color: #4CAF50; margin: 10px 0 5px;">📊 Momentum Dots</h4>
                <div style="display: grid; grid-template-columns: 20px auto; gap: 10px; align-items: center;">
                    <span class="stock-trend-indicator trend-strong-up" style="display:inline-block; margin:0;"></span> <span><strong>Glowing Green:</strong> Fast Rising (>0.5%/hr)</span>
                    <span class="stock-trend-indicator trend-up" style="display:inline-block; margin:0;"></span> <span><strong>Light Green:</strong> Slow Rising</span>
                    <span class="stock-trend-indicator trend-neutral" style="display:inline-block; margin:0;"></span> <span><strong>Yellow:</strong> Neutral / Stagnant</span>
                    <span class="stock-trend-indicator trend-down" style="display:inline-block; margin:0;"></span> <span><strong>Light Red:</strong> Slow Falling</span>
                    <span class="stock-trend-indicator trend-strong-down" style="display:inline-block; margin:0;"></span> <span><strong>Glowing Red:</strong> Fast Falling (<-0.5%/hr)</span>
                </div>
            </div>

            <div style="margin-bottom: 20px;">
                <h4 style="color: #2196F3; margin: 10px 0 5px;">⚡ Alerts & Updates</h4>
                <p style="margin: 0; color: #ccc;">
                    Prices update every <strong>${CONFIG.UPDATE_INTERVAL / 1000} seconds</strong> (Configurable).<br>
                    Alerts trigger if a pinned/owned stock moves by <strong>${CONFIG.ALERT_THRESHOLD_HOURLY}%</strong> in one hour (Configurable).
                </p>
            </div>

            <div style="display: flex; justify-content: flex-end;">
                <button id="close-help-btn" style="padding: 8px 16px; background: #666; border: none; color: white; border-radius: 4px; cursor: pointer;">Close</button>
            </div>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);
        modal.querySelector('#close-help-btn').addEventListener('click', () => modal.remove());
    }

    function createEnhancedUI() {
        const style = `
            .stock-enhancer-panel { background: #1a1a1a; border: 1px solid #333; border-radius: 5px; padding: 15px; margin: 10px 0; color: #fff; }
            #stock-enhancer-alerts { min-height: 40px; margin-bottom: 10px; }
            .alert-box { padding: 10px; margin-bottom: 5px; border-radius: 4px; font-size: 13px; border-left: 5px solid; opacity: 1; transition: opacity 2s ease-in-out; }
            .alert-box.fading { opacity: 0; }
            .alert-buy { background: #1a2a1a; border-left-color: #00ff00; }
            .alert-sell { background: #2a1a2a; border-left-color: #ff4444; }

            .stock-trend-indicator { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-left: 5px; cursor: help; vertical-align: middle; }
            .trend-strong-up { background: #00ff00; box-shadow: 0 0 5px #00ff00; }
            .trend-up { background: #90ee90; }
            .trend-neutral { background: #ffff00; }
            .trend-down { background: #ff6b6b; }
            .trend-strong-down { background: #ff0000; box-shadow: 0 0 5px #ff0000; }

            .stock-metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; margin-top: 10px; }
            .metric-card { background: #252525; padding: 10px; border-radius: 4px; }
            .metric-label { font-size: 11px; color: #888; margin-bottom: 5px; text-transform: uppercase; }
            .metric-value { font-size: 16px; font-weight: bold; }
            .positive { color: #85c742 !important; } .negative { color: #e55c5c !important; }

            .star-icon { color: #FFD700; transition: color 0.2s; }
            .pin-button {
                position: absolute; top: -5px; right: -5px;
                background: rgba(0,0,0,0.5); border-radius: 50%;
                border: none; cursor: pointer; padding: 2px;
                display: none; align-items: center; justify-content: center;
                z-index: 10;
            }
            .logoContainer___M_y5p:hover .pin-button { display: flex; }
            .pin-button:hover { background: rgba(0,0,0,0.8); }

            .pinned-stock { border-left: 3px solid #FFD700; background: rgba(255, 215, 0, 0.05) !important; order: -1; }
            .update-time { font-size: 11px; color: #666; text-align: right; margin-top: 10px; }
            .live-price-update { font-weight: bold; }
            .price-up { color: #00ff00; background-color: rgba(0, 255, 0, 0.1); transition: background-color 0.5s ease-out; }
            .price-down { color: #ff4444; background-color: rgba(255, 68, 68, 0.1); transition: background-color 0.5s ease-out; }
        `;
        GM_addStyle(style);

        const panel = document.createElement('div');
        panel.id = 'stock-enhancer-main';
        panel.className = 'stock-enhancer-panel';
        panel.innerHTML = '<h3>📈 Stock Enhancer</h3><div id="stock-enhancer-alerts"></div><div id="analytics-content">Loading...</div>';

        const header = document.querySelector('.appHeaderWrapper___uyPti');
        if (header) header.parentNode.insertBefore(panel, header.nextSibling);

        const h3 = panel.querySelector('h3');
        h3.appendChild(createApiKeyButton());
        h3.appendChild(createHelpButton());
    }

    function init() {
        createEnhancedUI();
        const listObserver = new MutationObserver((mutations, obs) => {
            if (document.querySelector('.stock___ElSDB')) {
                obs.disconnect();
                updateData();
                startUpdateInterval();
            }
        });

        const root = document.getElementById('content-root') || document.body;
        listObserver.observe(root, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();