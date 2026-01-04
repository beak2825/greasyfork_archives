// ==UserScript==
// @name         TORN: Daily Indicators
// @namespace    https://torn.com
// @version      1.2.1
// @description  Displays daily progress for energy/nerve refills, xanax usage, city buys, and casino tokens on the home page (Requires Torn "FULL ACCESS" API Key - to access your user logs and check whether you have done things in the current day)
// @author       Imrealnow
// @match        https://www.torn.com/index.php*
// @license      MIT
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/557180/TORN%3A%20Daily%20Indicators.user.js
// @updateURL https://update.greasyfork.org/scripts/557180/TORN%3A%20Daily%20Indicators.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // PDA API Key placeholder - TornPDA will replace this
    const PDA_API_KEY = '###PDA-APIKEY###';

    // Check if running in TornPDA
    function isPDA() {
        return !/^(###).+(###)$/.test(PDA_API_KEY);
    }

    // API Key management
    function getApiKey() {
        if (isPDA()) {
            return PDA_API_KEY;
        }
        return GM_getValue('tornApiKey', null);
    }

    function setApiKey(apiKey) {
        GM_setValue('tornApiKey', apiKey);
    }

    // Xanax target management (default: 3)
    function getXanaxTarget() {
        return GM_getValue('xanaxTarget', 3);
    }

    function setXanaxTarget(target) {
        GM_setValue('xanaxTarget', target);
    }

    // Refill display mode: 'used' (green=used) or 'available' (green=available)
    function getRefillDisplayMode() {
        return GM_getValue('refillDisplayMode', 'used');
    }

    function setRefillDisplayMode(mode) {
        GM_setValue('refillDisplayMode', mode);
    }

    // Register menu command to set API key
    GM_registerMenuCommand('Set Torn API Key', () => {
        const currentKey = getApiKey();
        const newKey = prompt(
            'Enter your FULL ACCESS Torn API Key (16 characters):',
            currentKey || ''
        );

        if (newKey === null) {
            return; // User cancelled
        }

        if (newKey.length !== 16) {
            alert('Invalid API key. It must be exactly 16 characters.');
            return;
        }

        setApiKey(newKey);
        alert('API key saved! Refreshing page...');
        window.location.reload();
    });

    // Register menu command to clear API key
    GM_registerMenuCommand('Clear Torn API Key', () => {
        if (confirm('Are you sure you want to clear your API key?')) {
            GM_setValue('tornApiKey', null);
            alert('API key cleared! Refreshing page...');
            window.location.reload();
        }
    });

    // Register menu command to set xanax target
    GM_registerMenuCommand('Set Daily Xanax Target', () => {
        const currentTarget = getXanaxTarget();
        const newTarget = prompt(
            'Enter the number of Xanax you want to take daily (0-6):',
            currentTarget
        );

        if (newTarget === null) {
            return; // User cancelled
        }

        const parsed = parseInt(newTarget, 10);
        if (isNaN(parsed) || parsed < 0 || parsed > 6) {
            alert('Invalid target. Please enter a number between 0 and 6.');
            return;
        }

        setXanaxTarget(parsed);
        alert(`Xanax target set to ${parsed}! Refreshing page...`);
        window.location.reload();
    });

    // Register menu command to toggle refill display mode
    GM_registerMenuCommand('Toggle Refill Display Mode', () => {
        const currentMode = getRefillDisplayMode();
        const newMode = currentMode === 'used' ? 'available' : 'used';
        setRefillDisplayMode(newMode);

        const modeDescription = newMode === 'used'
            ? 'Green = Refills Used'
            : 'Green = Refills Available';

        alert(`Refill display mode changed to: ${modeDescription}\nRefreshing page...`);
        window.location.reload();
    });

    // Stylesheet
    const stylesheet = `
        <style id="daily-indicators-style">
            .dailies {
                display: flex;
                justify-content: space-evenly;
                align-items: center;
                padding: 10px 5px;
                background-color: #3b562a8a;
            }

            .daily-indicator {
                display: inline-flex;
                white-space: nowrap;
                margin: 0;
                font-size: 14px;
                font-weight: normal;
                line-height: 24px;
            }

            .daily-indicator.done {
                color: #32cd32;
            }

            .daily-indicator.notdone {
                color: #f44d4d;
            }

            .daily-indicator.loading {
                color: #aaaaaa;
            }

            .dailies .no-api-key {
                color: #f44d4d;
                font-size: 14px;
                margin: 0;
                padding: 5px 0;
            }

            @media screen and (max-width: 784px) {
                .dailies {
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 5px 15px;
                    padding: 8px 10px;
                }

                .daily-indicator {
                    font-size: 12px;
                    line-height: 20px;
                }
            }
        </style>
    `;

    // Render stylesheet
    function renderStylesheet() {
        if (!document.querySelector('#daily-indicators-style')) {
            document.head.insertAdjacentHTML('beforeend', stylesheet);
        }
    }

    // Get timestamps for today's date range (TCT - Torn City Time = UTC)
    function getTodayTimestamps() {
        const now = new Date();

        // Get start of today in UTC (TCT)
        const startOfToday = new Date(Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate(),
            0, 0, 0, 0
        ));

        // Get start of tomorrow in UTC (TCT)
        const startOfTomorrow = new Date(startOfToday);
        startOfTomorrow.setUTCDate(startOfTomorrow.getUTCDate() + 1);

        return {
            from: Math.floor(startOfToday.getTime() / 1000),
            to: Math.floor(startOfTomorrow.getTime() / 1000)
        };
    }

    // Fetch logs from Torn API
    async function fetchDailyLogs(apiKey) {
        const timestamps = getTodayTimestamps();
        const url = `https://api.torn.com/v2/user/log?log=4200,4900,4905,2290&limit=100&from=${timestamps.from}&to=${timestamps.to}&key=${apiKey}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.error) {
                console.error('TORN API Error:', data.error);
                return { error: data.error };
            }

            return data;
        } catch (error) {
            console.error('Fetch error:', error);
            return { error: { message: 'Network error' } };
        }
    }

    // Fetch casino token logs from Torn API
    async function fetchCasinoLogs(apiKey) {
        const timestamps = getTodayTimestamps();
        const url = `https://api.torn.com/v2/user/log?cat=185&limit=100&from=${timestamps.from}&to=${timestamps.to}&key=${apiKey}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.error) {
                console.error('TORN API Error (Casino):', data.error);
                return { error: data.error };
            }

            return data;
        } catch (error) {
            console.error('Fetch error (Casino):', error);
            return { error: { message: 'Network error' } };
        }
    }

    // Parse logs to get daily stats
    function parseLogs(data) {
        const stats = {
            energyRefill: false,
            nerveRefill: false,
            xanaxCount: 0,
            cityBuys: 0,
            casinoTokens: 0
        };

        if (!data.log || !Array.isArray(data.log)) {
            return stats;
        }

        for (const log of data.log) {
            const title = log.details?.title || '';

            switch (log.details?.id) {
                case 4900: // Energy refill
                    if (title.toLowerCase().includes('energy refill')) {
                        stats.energyRefill = true;
                    }
                    break;
                case 4905: // Nerve refill
                    if (title.toLowerCase().includes('nerve refill')) {
                        stats.nerveRefill = true;
                    }
                    break;
                case 2290: // Xanax use
                    if (title.toLowerCase().includes('xanax')) {
                        stats.xanaxCount++;
                    }
                    break;
                case 4200: // Item shop buy
                    if (title.toLowerCase().includes('item shop buy')) {
                        stats.cityBuys += log.data?.quantity || 0;
                    }
                    break;
            }
        }

        return stats;
    }

    // Parse casino logs to count tokens used
    function parseCasinoLogs(data) {
        if (!data.log || !Array.isArray(data.log)) {
            return 0;
        }
        // Each log entry represents 1 casino token used
        return data.log.length;
    }

    // Create the dailies container HTML
    function createDailiesHTML(state = 'loading') {
        if (state === 'no-api-key') {
            return `
                <div class="dailies" id="daily-indicators">
                    <p class="no-api-key">Please set your Torn API Key from the script menu</p>
                </div>
            `;
        }

        if (state === 'loading') {
            return `
                <div class="dailies" id="daily-indicators">
                    <h6 class="daily-indicator loading">Loading...</h6>
                    <h6 class="daily-indicator loading">Loading...</h6>
                    <h6 class="daily-indicator loading">Loading...</h6>
                    <h6 class="daily-indicator loading">Loading...</h6>
                    <h6 class="daily-indicator loading">Loading...</h6>
                </div>
            `;
        }

        if (state === 'error') {
            return `
                <div class="dailies" id="daily-indicators">
                    <h6 class="daily-indicator notdone">API Error - Check Console</h6>
                </div>
            `;
        }

        return '';
    }

    // Update the dailies display with actual stats
    function updateDailiesDisplay(stats) {
        const container = document.querySelector('#daily-indicators');
        if (!container) return;

        const xanaxTarget = getXanaxTarget();
        const refillMode = getRefillDisplayMode();

        // Actual completion status (always based on whether tasks are done)
        const energyActuallyDone = stats.energyRefill;
        const nerveActuallyDone = stats.nerveRefill;
        const xanaxDone = stats.xanaxCount >= xanaxTarget;
        const cityDone = stats.cityBuys >= 100;
        const casinoDone = stats.casinoTokens >= 75;

        // Display status (may be inverted for refills based on mode)
        const energyDisplayDone = refillMode === 'used' ? stats.energyRefill : !stats.energyRefill;
        const nerveDisplayDone = refillMode === 'used' ? stats.nerveRefill : !stats.nerveRefill;

        // Background color based on actual completion, not display mode
        const allActuallyDone = energyActuallyDone && nerveActuallyDone && xanaxDone && cityDone && casinoDone;
        container.style.backgroundColor = allActuallyDone ? '#3b562a8a' : '#56402a8a';

        // Generate refill label based on mode
        const energyLabel = refillMode === 'used' ? 'Energy Refill' : (stats.energyRefill ? 'Energy Used' : 'Energy Refill');
        const nerveLabel = refillMode === 'used' ? 'Nerve Refill' : (stats.nerveRefill ? 'Nerve Used' : 'Nerve Refill');

        container.innerHTML = `
            <h6 class="daily-indicator ${energyDisplayDone ? 'done' : 'notdone'}">${energyLabel}</h6>
            <h6 class="daily-indicator ${nerveDisplayDone ? 'done' : 'notdone'}">${nerveLabel}</h6>
            <h6 class="daily-indicator ${xanaxDone ? 'done' : 'notdone'}">${stats.xanaxCount}/${xanaxTarget} Xanax</h6>
            <h6 class="daily-indicator ${cityDone ? 'done' : 'notdone'}">${Math.min(stats.cityBuys, 100)}/100 City Buys</h6>
            <h6 class="daily-indicator ${casinoDone ? 'done' : 'notdone'}">${Math.min(stats.casinoTokens, 75)}/75 Casino Tokens</h6>
        `;
    }

    // Render the dailies container
    function renderDailies(state = 'loading') {
        // Remove existing container if present
        const existing = document.querySelector('#daily-indicators');
        if (existing) {
            existing.remove();
        }

        // Find the content wrapper
        const contentWrapper = document.querySelector('.content-wrapper');
        if (!contentWrapper) {
            console.error('Could not find .content-wrapper element');
            return false;
        }

        // Insert dailies as first child
        contentWrapper.insertAdjacentHTML('afterbegin', createDailiesHTML(state));
        return true;
    }

    // Main initialization
    async function init() {
        console.log('📊 TORN Daily Indicators script loaded!');

        renderStylesheet();

        const apiKey = getApiKey();

        if (!apiKey) {
            console.log('No API key set');
            renderDailies('no-api-key');
            return;
        }

        // Show loading state
        renderDailies('loading');

        // Fetch both log endpoints in parallel
        const [dailyData, casinoData] = await Promise.all([
            fetchDailyLogs(apiKey),
            fetchCasinoLogs(apiKey)
        ]);

        if (dailyData.error) {
            console.error('API Error:', dailyData.error);
            renderDailies('error');
            return;
        }

        const stats = parseLogs(dailyData);

        // Add casino tokens to stats (even if casino fetch failed, show 0)
        if (!casinoData.error) {
            stats.casinoTokens = parseCasinoLogs(casinoData);
        } else {
            console.warn('Casino API Error:', casinoData.error);
            stats.casinoTokens = 0;
        }

        console.log('📊 Daily stats:', stats);

        updateDailiesDisplay(stats);
    }

    // Wait for page to be ready
    // Handle both browser and PDA loading
    const pdaPromise = new Promise((resolve) => {
        if (document.readyState === 'complete') resolve();
    });

    const browserPromise = new Promise((resolve) => {
        window.addEventListener('load', () => resolve());
    });

    // Also watch for the content wrapper to appear (for dynamic loading)
    const contentPromise = new Promise((resolve) => {
        const check = () => {
            if (document.querySelector('.content-wrapper')) {
                resolve();
            } else {
                setTimeout(check, 100);
            }
        };
        check();
    });

    Promise.race([pdaPromise, browserPromise, contentPromise]).then(() => {
        // Small delay to ensure DOM is fully ready
        setTimeout(init, 100);
    });

})();