// ==UserScript==
// @name         Stake.com Visual Balance & Live Stats Modifier
// @namespace    http://tampermonkey.net/
// @version      9.6
// @description  Adds a persistent fake BTC balance, live stat tracking with a working graph, and an integrated settings UI to visually simulate gameplay on Stake.com.
// @author       XaRTeCK (Enhanced by Gemini)
// @match        *://stake.com/*
// @match        *://rgs.twist-rgs.com/*
// @connect      stake.com
// @connect      rgs.twist-rgs.com
// @license      CC-BY-NC-ND-4.0
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/549858/Stakecom%20Visual%20Balance%20%20Live%20Stats%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/549858/Stakecom%20Visual%20Balance%20%20Live%20Stats%20Modifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const BALANCE_STORAGE_KEY = 'stake_fake_btc_balance_v4';
    const STATS_STORAGE_KEY = 'stake_fake_stats_v3';
    const DEFAULT_BTC_VALUE = 0.1;

    let currentFakeBet = { amount: 0, currency: null };
    let fakeStats = getFakeStats();

    function getFakeBtcValue() {
        const savedBalance = localStorage.getItem(BALANCE_STORAGE_KEY);
        return savedBalance ? parseFloat(savedBalance) : DEFAULT_BTC_VALUE;
    }

    // ENHANCED: This function now forces a live UI update without a page refresh.
    function setFakeBtcValue(amount) {
        const numericAmount = parseFloat(amount);
        if (!isNaN(numericAmount) && numericAmount >= 0) {
            // 1. Save the new balance to local storage
            localStorage.setItem(BALANCE_STORAGE_KEY, numericAmount.toString());

            // 2. Update the footer input if it exists for visual consistency
            const footerInput = document.getElementById('fake-balance-input-btc');
            if (footerInput) {
                footerInput.value = numericAmount.toFixed(4);
            }

            // 3. Force a refresh of the balance display in the UI by simulating a currency switch.
            const balanceToggle = document.querySelector('[data-testid="balance-toggle"] button');
            if (balanceToggle) {
                // First click opens the currency dropdown
                balanceToggle.click();
                // A small delay ensures the UI has time to react before we click again to close it.
                // This double action forces the balance component to re-render with the new value.
                setTimeout(() => balanceToggle.click(), 50);
            }
        }
    }


    function getFakeStats() {
        const savedStats = localStorage.getItem(STATS_STORAGE_KEY);
        const defaultStats = { profit: 0, wagered: 0, wins: 0, losses: 0, profitHistory: [0] };
        if (savedStats) {
            const parsed = JSON.parse(savedStats);
            if (!Array.isArray(parsed.profitHistory) || parsed.profitHistory.length === 0) {
                parsed.profitHistory = [0];
            }
            return { ...defaultStats, ...parsed };
        }
        return defaultStats;
    }

    function saveFakeStats(stats) {
        localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
    }

    function resetFakeStats() {
        fakeStats = { profit: 0, wagered: 0, wins: 0, losses: 0, profitHistory: [0] };
        saveFakeStats(fakeStats);
        updateLiveStatsDisplay();
    }

    function showBalanceSetupPopup() {
        const popupHTML = `
            <div id="visual-script-welcome" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: #2f3c4c; color: #fff; padding: 25px; border-radius: 10px; box-shadow: 0 5px 20px rgba(0,0,0,0.5); z-index: 9999; max-width: 450px; text-align: center; font-family: 'Inter', sans-serif;">
                <h2 style="margin: 0 0 15px 0; font-size: 22px;">Visual Gameplay Modifier Active</h2>
                <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5; color: #b0bdce;">
                    Set your visual BTC balance below. You can change this amount anytime at the bottom of the Stake.com page.
                </p>
                <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 20px;">
                     <input type="number" step="0.001" id="popup-fake-balance-input" value="${getFakeBtcValue()}"
                           style="background-color: #1f2a38; border: 1px solid #3c4a5c; color: white; border-radius: 5px; padding: 10px; width: 100%; text-align: center; font-size: 16px;"
                    >
                    <button id="popup-balance-save" style="background-color: #008756; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 16px; font-weight: bold; white-space: nowrap;">Set Balance</button>
                </div>
                <div style="display: flex; justify-content: flex-end; align-items: center;">
                    <button id="visual-script-close" style="background-color: #55657e; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 16px; font-weight: bold;">Close</button>
                </div>
            </div>
            <div id="visual-script-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 9998;"></div>
        `;
        document.body.insertAdjacentHTML('beforeend', popupHTML);

        const closePopup = () => {
            document.getElementById('visual-script-welcome')?.remove();
            document.getElementById('visual-script-overlay')?.remove();
        };

        document.getElementById('visual-script-close').addEventListener('click', closePopup);
        document.getElementById('visual-script-overlay').addEventListener('click', closePopup);

        const saveBtn = document.getElementById('popup-balance-save');
        const input = document.getElementById('popup-fake-balance-input');
        saveBtn.addEventListener('click', () => {
            setFakeBtcValue(input.value);
            saveBtn.textContent = 'Saved!';
            saveBtn.style.backgroundColor = '#6CDE07';
            setTimeout(() => {
                saveBtn.textContent = 'Set Balance';
                saveBtn.style.backgroundColor = '#008756';
            }, 1500);
        });
    }

    function drawFakeGraph(svg, history) {
        if (!svg) return;

        while (svg.firstChild) svg.removeChild(svg.firstChild);
        if (history.length < 2) return;

        const width = svg.clientWidth || 225;
        const height = svg.clientHeight || 170;
        const padding = 5;

        const maxProfit = Math.max(...history);
        const minProfit = Math.min(...history);
        const range = (maxProfit - minProfit) === 0 ? 1 : maxProfit - minProfit;

        const getCoords = (value, index) => {
            const x = (index / (history.length - 1)) * (width - padding * 2) + padding;
            const y = height - ((value - minProfit) / range) * (height - padding * 2) - padding;
            return { x: x.toFixed(2), y: y.toFixed(2) };
        };

        let linePathData = '';
        history.forEach((value, index) => {
            const { x, y } = getCoords(value, index);
            linePathData += `${index === 0 ? 'M' : 'L'} ${x} ${y} `;
        });

        const lastPoint = getCoords(history[history.length - 1], history.length - 1);
        const firstPoint = getCoords(history[0], 0);
        const fillPathData = `${linePathData} L ${lastPoint.x} ${height} L ${firstPoint.x} ${height} Z`;

        const finalProfit = history[history.length - 1];
        const color = finalProfit >= 0 ? 'var(--green-500)' : 'var(--red-500)';

        svg.innerHTML = `
            <path d="${fillPathData}" fill="${color}" fill-opacity="0.2"></path>
            <path d="${linePathData}" fill="none" stroke="${color}" stroke-width="2"></path>
        `;
    }

    function updateLiveStatsDisplay() {
        const profitEl = document.querySelector('[data-testid="bets-stats-profit"]');
        if (!profitEl) return;

        const statsContainer = profitEl.closest('div.draggable');
        if (!statsContainer) return;

        const wageredEl = statsContainer.querySelector('[data-testid="bets-stats-wagered"]');
        const winsEl = statsContainer.querySelector('[data-testid="bets-stats-wins"]');
        const lossesEl = statsContainer.querySelector('[data-testid="bets-stats-losses"]');
        const svg = statsContainer.querySelector('div.graph-wrap svg');

        if (wageredEl && winsEl && lossesEl) {
             const profitValue = fakeStats.profit * 105000;
             const wageredValue = fakeStats.wagered * 105000;
             const formatCurrency = (value) => value.toLocaleString('en-US', { style: 'currency', currency: 'USD' }).replace('$', '€');

             profitEl.textContent = formatCurrency(profitValue);
             profitEl.classList.remove('text-positive', 'text-critical');
             profitEl.classList.add(profitValue >= 0 ? 'text-positive' : 'text-critical');

             wageredEl.textContent = formatCurrency(wageredValue);
             winsEl.textContent = fakeStats.wins.toLocaleString('en-US');
             lossesEl.textContent = fakeStats.losses.toLocaleString('en-US');

             if (svg) {
                drawFakeGraph(svg, fakeStats.profitHistory);
             }
        }
    }

    function injectBalanceSettings(footerElement) {
        if (document.getElementById('fake-balance-settings')) return;
        const settingsHTML = `
            <div id="fake-balance-settings" class="p-4 mt-6 border-t-2 border-t-grey-500 text-grey-200">
              <div class="flex flex-col gap-2 max-w-sm mx-auto">
                <label for="fake-balance-input-btc" class="ds-body-md-strong text-white text-center">Visual Balance Modifier</label>
                <p class="ds-body-sm text-center">This only changes the balance you see on your screen.</p>
                <input type="number" step="0.001" id="fake-balance-input-btc" value="${getFakeBtcValue().toFixed(4)}"
                       style="background-color: #1f2a38; border: 1px solid #3c4a5c; color: white; border-radius: 5px; padding: 8px; width: 100%; text-align: center;"
                >
                <button id="reset-stats-button-footer" style="background-color: #55657e; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-size: 14px; font-weight: bold; margin-top: 10px;">Reset Live Stats</button>
                <span id="fake-balance-saved" style="color: #6CDE07; font-size: 12px; height: 16px; transition: opacity 0.3s ease-out; opacity: 0; text-align: center;">Saved!</span>
              </div>
            </div>
        `;
        footerElement.insertAdjacentHTML('afterbegin', settingsHTML);

        const input = document.getElementById('fake-balance-input-btc');
        const savedMessage = document.getElementById('fake-balance-saved');
        const resetButton = document.getElementById('reset-stats-button-footer');
        let timeoutId;

        input.addEventListener('input', (event) => {
            setFakeBtcValue(event.target.value);
            savedMessage.textContent = 'Saved!';
            savedMessage.style.opacity = '1';
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => { savedMessage.style.opacity = '0'; }, 1500);
        });

        resetButton.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset your visual stats (Profit, Wagered, Wins, Losses, and Graph)?')) {
                resetFakeStats();
                savedMessage.textContent = 'Stats Reset!';
                savedMessage.style.opacity = '1';
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    savedMessage.style.opacity = '0';
                }, 1500);
            }
        });
    }

    function updateStatsAndHistory(betAmount, payout) {
        fakeStats.wagered += betAmount;
        if (payout > 0) {
            fakeStats.wins++;
            fakeStats.profit += payout - betAmount;
        } else {
            fakeStats.losses++;
            fakeStats.profit -= betAmount;
        }
        fakeStats.profitHistory.push(fakeStats.profit);
        saveFakeStats(fakeStats);
        updateLiveStatsDisplay();
    }

    const originalFetch = window.fetch;
    window.fetch = async function(url, options) {
        const FAKE_BTC_BALANCE = getFakeBtcValue();
        const FAKE_PROVIDER_BALANCE = FAKE_BTC_BALANCE * 100_000_000;
        const requestUrl = new URL(url.toString(), window.location.origin);
        const host = requestUrl.hostname;
        const path = requestUrl.pathname;

        if (host.includes('rgs.twist-rgs.com') && path.includes('/wallet/authenticate')) {
            const response = await originalFetch(url, options);
            const data = await response.clone().json();
            if (data.balance) data.balance.amount = FAKE_PROVIDER_BALANCE;
            return new Response(JSON.stringify(data), { status: 200, headers: response.headers });
        }

        if (host.includes('stake.com') && path.includes('/_api/graphql') && options?.body) {
            let requestBody;
            try { requestBody = JSON.parse(options.body); } catch (e) { return originalFetch(url, options); }
            let modifiedOptions = options;

            if (requestBody.operationName === 'UserBalances') {
                const response = await originalFetch(url, options);
                const data = await response.clone().json();
                const btcBalance = data?.data?.user?.balances.find(b => b.available.currency === 'btc');
                if (btcBalance) btcBalance.available.amount = FAKE_BTC_BALANCE;
                return new Response(JSON.stringify(data), { status: response.status, headers: response.headers });
            }

            if (requestBody.query?.includes('mutation') && requestBody.variables?.amount > 0) {
                currentFakeBet = { amount: requestBody.variables.amount, currency: requestBody.variables.currency };
                const modifiedBody = JSON.parse(JSON.stringify(requestBody));
                modifiedBody.variables.amount = 0;
                modifiedOptions = { ...options, body: JSON.stringify(modifiedBody) };
            }

            const response = await originalFetch(url, modifiedOptions);
            const responseClone = response.clone();
            try {
                const data = await response.json();
                if (data.data) {
                    const gameDataKey = Object.keys(data.data).find(key => data.data[key] && typeof data.data[key] === 'object' && 'amount' in data.data[key]);
                    if (gameDataKey && currentFakeBet.amount > 0) {
                        const gameData = data.data[gameDataKey];
                        gameData.amount = currentFakeBet.amount;
                        gameData.payout = (gameData.payoutMultiplier || 0) * currentFakeBet.amount;
                        updateStatsAndHistory(currentFakeBet.amount, gameData.payout);
                        if (!gameData.active) currentFakeBet = { amount: 0, currency: null };
                        return new Response(JSON.stringify(data), { status: 200, headers: response.headers });
                    }
                }
                return responseClone;
            } catch (e) { return responseClone; }
        }

        if (host.includes('stake.com') && path.startsWith('/_api/casino/')) {
            let modifiedOptions = options;
            if (/\/(bet|roll|bonus)$/.test(path) && options?.body) {
                try {
                    const originalRequestBody = JSON.parse(options.body);
                    const modifiedBody = { ...originalRequestBody };
                    let totalAmount = 0;
                    if (path.includes('/roulette/bet')) {
                        ['colors', 'parities', 'dozens', 'numbers', 'columns', 'halves'].forEach(key => {
                            if (Array.isArray(modifiedBody[key])) modifiedBody[key].forEach(bet => { totalAmount += bet.amount; bet.amount = 0; });
                        });
                    } else if (originalRequestBody.amount > 0) {
                        totalAmount = originalRequestBody.amount;
                        modifiedBody.amount = 0;
                    }
                    if (totalAmount > 0) {
                        currentFakeBet = { amount: totalAmount, currency: originalRequestBody.currency };
                        modifiedOptions = { ...options, body: JSON.stringify(modifiedBody) };
                    }
                } catch (e) {}
            }
            const response = await originalFetch(url, modifiedOptions);
            const responseClone = response.clone();
            try {
                const data = await response.json();
                const gameDataKey = Object.keys(data).find(key => data[key] && typeof data[key] === 'object' && 'amount' in data[key]);
                if (gameDataKey && currentFakeBet.amount > 0 && data[gameDataKey].currency === currentFakeBet.currency) {
                    const gameData = data[gameDataKey];
                    gameData.amount = currentFakeBet.amount;
                    gameData.payout = (gameData.payoutMultiplier || 0) * currentFakeBet.amount;
                    updateStatsAndHistory(currentFakeBet.amount, gameData.payout);
                    if (gameData.state?.rounds) gameData.state.rounds.forEach(r => { if ('amount' in r) r.amount = currentFakeBet.amount; });
                    if (!gameData.active) currentFakeBet = { amount: 0, currency: null };
                    return new Response(JSON.stringify(data), { status: 200, headers: response.headers });
                }
                return responseClone;
            } catch (e) { return responseClone; }
        }
        return originalFetch(url, options);
    };

    window.addEventListener('DOMContentLoaded', () => {
        showBalanceSetupPopup();
        const mainObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType !== Node.ELEMENT_NODE) continue;

                    if (node.matches('footer[data-testid="footer"]') && !document.getElementById('fake-balance-settings')) {
                        injectBalanceSettings(node);
                    }
                    if (node.matches('div.draggable') && node.querySelector('[data-testid="bets-stats-profit"]')) {
                         setTimeout(() => updateLiveStatsDisplay(), 100);
                    }
                    const resetButton = node.matches('[data-testid="draggable-stats-reset"]') ? node : node.querySelector('[data-testid="draggable-stats-reset"]');
                    if (resetButton && !resetButton.dataset.scriptListenerAttached) {
                        resetButton.dataset.scriptListenerAttached = 'true';
                        resetButton.addEventListener('click', (event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            if (confirm('Are you sure you want to reset your visual stats? This will clear the graph and all tracked data.')) {
                                resetFakeStats();
                            }
                        }, true);
                    }
                }
            }
        });
        mainObserver.observe(document.body, { childList: true, subtree: true });
    });
})();