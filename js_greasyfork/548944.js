// ==UserScript==
// @name         Faction & Profile Stats
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  shows on profile and faction page.
// @author       aquagloop
// @match        https://www.torn.com/factions.php*
// @match        https://www.torn.com/profiles.php*
// @connect      api.torn.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/548944/Faction%20%20Profile%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/548944/Faction%20%20Profile%20Stats.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_KEY_STORAGE = 'TORN_API_KEY_FACTION_STATS_FINAL';
    const CACHE_STORAGE_PREFIX = 'TORN_STATS_CACHE_V2_';
    let isRunning = false;

    const XANAX_THRESHOLD = 60;
    const REFILLS_THRESHOLD = 25;
    const PLAYTIME_THRESHOLD_HOURS = 25;
    const CACHE_DURATION_MS = 24 * 60 * 60 * 1000;

    GM_addStyle(`
        .tm-stats-row {
            height: 21px;
            background-color: #3b3b3b;
            border-bottom: 1px solid #222;
            line-height: 21px;
        }
        .tm-integrated-stats-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            padding: 0 10px;
            box-sizing: border-box;
            color: #d1d1d1;
            font-size: 11px;
        }
        .tm-integrated-stats-bar > span {
            flex: 1;
            text-align: center;
            white-space: nowrap;
        }
        .tm-integrated-stats-bar strong {
            color: #ffffff;
        }
        .tm-stats-bar-message {
            width: 100%;
            text-align: center;
            font-style: italic;
            color: #999;
        }
        /* Style for injected rows on profile to match */
        .tm-injected-stat .user-info-value span {
            font-weight: bold;
        }
    `);

    function formatNumber(num, isCurrency = false) {
        if (num === null || typeof num === 'undefined' || isNaN(num)) return 'N/A';
        const sign = num < 0 ? "-" : "";
        const numAbs = Math.abs(num);
        const numStr = numAbs.toLocaleString(undefined, { maximumFractionDigits: 0 });
        return isCurrency ? `${sign}$${numStr}` : `${sign}${numStr}`;
    }

    function formatDuration(seconds) {
        if (seconds === null || typeof seconds === 'undefined' || isNaN(seconds)) return 'N/A';
        if (seconds < 60) return "0m";
        const hours = seconds / 3600;
        if (hours < 1) {
            const minutes = Math.round(seconds / 60);
            return `${minutes}m`;
        } else {
            return `${hours.toFixed(1)}h`;
        }
    }

    function displayMessage(container, message) {
        container.innerHTML = `<span class="tm-stats-bar-message">${message}</span>`;
    }

    function makeApiRequest(userId, selection, apiKey, { timestamp = '', stat = '' } = {}) {
        return new Promise((resolve, reject) => {
            let apiUrl = `https://api.torn.com/user/${userId}?selections=${selection}&key=${apiKey}`;
            if (timestamp) apiUrl += `&timestamp=${timestamp}`;
            if (stat) apiUrl += `&stat=${stat}`;
            GM_xmlhttpRequest({
                method: 'GET',
                url: apiUrl,
                onload: (response) => {
                    if (response.status !== 200) return reject(new Error(`HTTP Status ${response.status}`));
                    const data = JSON.parse(response.responseText);
                    if (data.error && data.error.code === 7) return reject(new Error('Too many requests'));
                    if (data.error) return reject(new Error(data.error.error));
                    resolve(data);
                },
                onerror: () => reject(new Error('Network Error')),
            });
        });
    }

    function renderStats(container, stats) {
        container.innerHTML = '';

        const createStatElement = (label, displayValue, color) => {
            const span = document.createElement('span');
            span.innerHTML = `<strong>${label}: </strong>${displayValue}`;
            if (color) {
                span.style.color = color;
            }
            return span;
        };

        const greenColor = 'limegreen';
        const yellowColor = '#E8D44D';
        const redColor = '#FF4C4C';

        let xanaxColor = null;
        if (stats.xanax === 0) {
            xanaxColor = redColor;
        } else if (stats.xanax < XANAX_THRESHOLD) {
            xanaxColor = yellowColor;
        } else {
            xanaxColor = greenColor;
        }

        let refillsColor = null;
        if (stats.refills === 0) {
            refillsColor = redColor;
        } else if (stats.refills < REFILLS_THRESHOLD) {
            refillsColor = yellowColor;
        } else {
            refillsColor = greenColor;
        }

        const playtimeThresholdSeconds = PLAYTIME_THRESHOLD_HOURS * 3600;
        let playtimeColor = null;
        if (stats.activity < 60) {
            playtimeColor = redColor;
        } else if (stats.activity < playtimeThresholdSeconds) {
            playtimeColor = yellowColor;
        } else {
            playtimeColor = greenColor;
        }

        container.appendChild(createStatElement('Xanax Δ', formatNumber(stats.xanax), xanaxColor));
        container.appendChild(createStatElement('Refills Δ', formatNumber(stats.refills), refillsColor));
        container.appendChild(createStatElement('Playtime Δ', formatDuration(stats.activity), playtimeColor));
        container.appendChild(createStatElement('Networth', formatNumber(stats.currentNetworth, true), null));
    }

    async function fetchAndDisplayFactionData(userId, container, apiKey) {
        try {
            const [currentData, pastData] = await Promise.all([
                makeApiRequest(userId, 'personalstats,basic', apiKey),
                makeApiRequest(userId, 'personalstats', apiKey, { timestamp: '-30days', stat: 'xantaken,refills,useractivity' })
            ]);

            if (!currentData.personalstats || !pastData.personalstats) {
                let message = "Cannot fetch stats. ";
                if (currentData.status && currentData.status.description) {
                    message += `User is ${currentData.status.description}.`;
                } else {
                    message += "User may be in Federal Jail or inactive.";
                }
                displayMessage(container, message);
                return;
            }

            const currentStats = currentData.personalstats;
            const pastStats = pastData.personalstats;

            const calculatedStats = {
                xanax: (currentStats.xantaken || 0) - (pastStats.xantaken || 0),
                refills: (currentStats.refills || 0) - (pastStats.refills || 0),
                activity: (currentStats.useractivity || 0) - (pastStats.useractivity || 0),
                currentNetworth: currentStats.networth || 0
            };

            renderStats(container, calculatedStats);

            const cacheItem = {
                timestamp: Date.now(),
                stats: calculatedStats
            };
            GM_setValue(`${CACHE_STORAGE_PREFIX}${userId}`, cacheItem);

        } catch (e) {
            console.error(`[TornStats] Error processing User ${userId}:`, e.message, e);
            if (e.message === 'Too many requests') {
                displayMessage(container, 'API limit reached. Slower polling needed.');
            } else if (e.message && (e.message.includes("Invalid API key") || e.message.includes("Incorrect key"))) {
                GM_setValue(API_KEY_STORAGE, null);
                displayMessage(container, 'Invalid API Key. Please refresh.');
            } else {
                displayMessage(container, 'Error: Check Console (F12)');
            }
        }
    }

    async function processAllMembers() {
        if (isRunning) return;
        isRunning = true;

        let apiKey = GM_getValue(API_KEY_STORAGE);
        if (!apiKey) {
            apiKey = prompt("Please enter your Torn API key (required for Personal Stats):");
            if (apiKey) GM_setValue(API_KEY_STORAGE, apiKey);
            else { isRunning = false; return; }
        }

        const memberRows = document.querySelectorAll('.f-war-list.members-list ul.table-body > li.table-row:not(.tm-processed)');

        for (const row of memberRows) {
            row.classList.add('tm-processed');
            const profileLink = row.querySelector('a[href*="/profiles.php?XID="]');
            if (!profileLink) continue;
            const userIdMatch = profileLink.href.match(/XID=(\d+)/);
            if (!userIdMatch) continue;

            const userId = userIdMatch[1];
            const statsRow = document.createElement('li');
            statsRow.className = 'table-row tm-stats-row';
            const statsContainer = document.createElement('div');
            statsContainer.className = 'tm-integrated-stats-bar';
            statsRow.appendChild(statsContainer);
            row.insertAdjacentElement('afterend', statsRow);

            const cachedData = GM_getValue(`${CACHE_STORAGE_PREFIX}${userId}`);
            if (cachedData && (Date.now() - cachedData.timestamp < CACHE_DURATION_MS)) {
                renderStats(statsContainer, cachedData.stats);
            } else {
                displayMessage(statsContainer, 'Loading from API...');
                fetchAndDisplayFactionData(userId, statsContainer, apiKey);
                await new Promise(resolve => setTimeout(resolve, 2500));
            }
        }
        isRunning = false;
    }

    function renderProfileStatsAsRows(container, stats) {
        const createStatRow = (label, displayValue, color) => {
            const li = document.createElement('li');
            li.classList.add('tm-injected-stat');
            const valueSpan = color ? `<span style="color: ${color};">${displayValue}</span>` : `<span>${displayValue}</span>`;
            li.innerHTML = `
                <div class="user-information-section"><span class="bold">${label}</span></div>
                <div class="user-info-value">${valueSpan}</div>`;
            return li;
        };

        const greenColor = 'limegreen';
        const yellowColor = '#E8D44D';
        const redColor = '#FF4C4C';

        let xanaxColor = null;
        if (stats.xanax === 0) xanaxColor = redColor;
        else if (stats.xanax < XANAX_THRESHOLD) xanaxColor = yellowColor;
        else xanaxColor = greenColor;

        let refillsColor = null;
        if (stats.refills === 0) refillsColor = redColor;
        else if (stats.refills < REFILLS_THRESHOLD) refillsColor = yellowColor;
        else refillsColor = greenColor;

        const playtimeThresholdSeconds = PLAYTIME_THRESHOLD_HOURS * 3600;
        let playtimeColor = null;
        if (stats.activity < 60) playtimeColor = redColor;
        else if (stats.activity < playtimeThresholdSeconds) playtimeColor = yellowColor;
        else playtimeColor = greenColor;
        container.appendChild(createStatRow('Xanax (30d)', formatNumber(stats.xanax), xanaxColor));
        container.appendChild(createStatRow('Refills (30d)', formatNumber(stats.refills), refillsColor));
        container.appendChild(createStatRow('Playtime (30d)', formatDuration(stats.activity), playtimeColor));
        container.appendChild(createStatRow('Networth', formatNumber(stats.currentNetworth, true), null));
    }

    async function addProfileStats() {
        const infoTable = document.querySelector('.basic-information ul.info-table');
        if (!infoTable || infoTable.dataset.statsInjected) return;
        infoTable.dataset.statsInjected = 'true';

        const userIdMatch = window.location.search.match(/XID=(\d+)/);
        if (!userIdMatch) return;
        const userId = userIdMatch[1];

        let apiKey = GM_getValue(API_KEY_STORAGE);
        if (!apiKey) {
            apiKey = prompt("Please enter your Torn API key (required for Personal Stats):");
            if (apiKey) GM_setValue(API_KEY_STORAGE, apiKey);
            else return;
        }

        try {
            const cachedData = GM_getValue(`${CACHE_STORAGE_PREFIX}${userId}`);
            if (cachedData && (Date.now() - cachedData.timestamp < CACHE_DURATION_MS)) {
                renderProfileStatsAsRows(infoTable, cachedData.stats);
                return;
            }

            const [currentData, pastData] = await Promise.all([
                makeApiRequest(userId, 'personalstats', apiKey),
                makeApiRequest(userId, 'personalstats', apiKey, { timestamp: '-30days', stat: 'xantaken,refills,useractivity' })
            ]);

            if (!currentData.personalstats || !pastData.personalstats) {
                console.error("[TornStats] Could not fetch personal stats for profile.");
                return;
            }

            const calculatedStats = {
                xanax: (currentData.personalstats.xantaken || 0) - (pastData.personalstats.xantaken || 0),
                refills: (currentData.personalstats.refills || 0) - (pastData.personalstats.refills || 0),
                activity: (currentData.personalstats.useractivity || 0) - (pastData.personalstats.useractivity || 0),
                currentNetworth: currentData.personalstats.networth || 0
            };

            renderProfileStatsAsRows(infoTable, calculatedStats);
            GM_setValue(`${CACHE_STORAGE_PREFIX}${userId}`, { timestamp: Date.now(), stats: calculatedStats });
        } catch (e) {
            console.error(`[TornStats] Error processing User ${userId}:`, e.message, e);
            if (e.message && (e.message.includes("Invalid API key") || e.message.includes("Incorrect key"))) {
                GM_setValue(API_KEY_STORAGE, null);
            }
        }
    }

    function initializeScript() {
        const path = window.location.pathname;

        if (path === '/factions.php') {
            const observer = new MutationObserver(() => {
                if (document.querySelector('.f-war-list.members-list')) {
                    processAllMembers();
                }
            });
            const targetNode = document.getElementById('factions');
            if (targetNode) observer.observe(targetNode, { childList: true, subtree: true });
        } else if (path === '/profiles.php') {
            const observer = new MutationObserver(() => {
                if (document.querySelector('.basic-information ul.info-table')) {
                    addProfileStats();
                }
            });
            const targetNode = document.getElementById('mainContainer') || document.body;
            observer.observe(targetNode, { childList: true, subtree: true });
        }
    }

    initializeScript();
})();