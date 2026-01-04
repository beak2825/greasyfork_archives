// ==UserScript==
// @name         Anonymous OC Tool
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  A tool to pull Faction OC info, including downtime. All data is previous 100 OC.
// @author       HeyItzWerty [3626448]
// @match        https://www.torn.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/551308/Anonymous%20OC%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/551308/Anonymous%20OC%20Tool.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- SCRIPT STATE & CONFIG ---
    let state = {
        apiKey: '',
        isMenuOpen: false,
        fullOCData: null,
        userCache: {}, // Master map of { userID: userName } - The single source of truth
        currentMembers: {}, // Raw data from the 'members' API endpoint
        itemMap: null,
        isDataLoading: false,
        apiCallCount: 0,
        lastUpdatedTimestamp: 0,
    };

    // --- STYLES ---
    GM_addStyle(`
        :root { --aoc-font: 'Signika', sans-serif; }
        #aoc-menu-container { display: none; grid-template-rows: auto auto 1fr auto; position: fixed; min-width: 800px; min-height: 500px; max-width: 95vw; max-height: 95vh; background-color: var(--bg-main); color: var(--text-main); border: 1px solid var(--border-main); border-radius: 8px; box-shadow: 0 5px 25px rgba(0,0,0,0.5); z-index: 9999; font-family: var(--aoc-font); resize: both; overflow: hidden; }
        #aoc-menu-container.aoc-visible { display: grid; }
        .aoc-header { grid-row: 1; flex-shrink: 0; }
        .aoc-tab-bar { grid-row: 2; flex-shrink: 0; }
        .aoc-content-area { grid-row: 3; overflow: hidden; display: flex; }
        .aoc-footer { grid-row: 4; flex-shrink: 0; }
        .aoc-tab-content { display: none; flex-direction: column; width: 100%; padding: 15px; box-sizing: border-box; overflow: hidden; }
        .aoc-tab-content.active { display: flex; }
        .aoc-controls { flex-shrink: 0; }
        .aoc-summary-bar { flex-shrink: 0; }
        .aoc-table-container { flex-grow: 1; overflow-y: auto; min-height: 0; }
        #aoc-menu-container.theme-dark { --bg-main: #333; --bg-secondary: #2a2a2a; --bg-header: #222; --bg-table-hover: #454545; --bg-table-even: #2f2f2f; --text-main: #eee; --text-light: #aaa; --text-header: #85ea2d; --border-main: #555; --border-light: #444; --accent: #85ea2d; --link: #6caddf; --btn-success: #3a8543; --btn-success-hover: #4aa956; --status-success: #4CAF50; --status-fail: #F44336; }
        #aoc-menu-container.theme-light { --bg-main: #f9f9f9; --bg-secondary: #f0f0f0; --bg-header: #e9e9e9; --bg-table-hover: #e0e0e0; --bg-table-even: #f5f5f5; --text-main: #333; --text-light: #777; --text-header: #0056b3; --border-main: #ccc; --border-light: #ddd; --accent: #0056b3; --link: #007bff; --btn-success: #218838; --btn-success-hover: #28a745; --status-success: #28a745; --status-fail: #dc3545; }
        #aoc-menu-container.theme-readability { --bg-main: #ffffff; --bg-secondary: #f5f5f5; --bg-header: #efefef; --bg-table-hover: #e8e8e8; --bg-table-even: #fafafa; --text-main: #000000; --text-light: #555555; --text-header: #000000; --border-main: #999999; --border-light: #cccccc; --accent: #0000ff; --link: #0000ee; --btn-success: #006400; --btn-success-hover: #008000; --status-success: #006400; --status-fail: #c81d1d; }
        .aoc-header { padding: 8px 15px; background-color: var(--bg-header); border-bottom: 1px solid var(--border-main); display: flex; justify-content: flex-end; align-items: center; border-radius: 8px 8px 0 0; cursor: move; min-height: 46px; box-sizing: border-box; }
        .aoc-close-btn { font-size: 1.8em; background: none; border: none; color: var(--text-light); cursor: pointer; line-height: 1; padding: 0 5px; width: 30px; height: 30px; }
        .aoc-close-btn:hover { color: var(--text-main); }
        .aoc-tab-bar { display: flex; background-color: var(--bg-secondary); padding: 0 10px; border-bottom: 1px solid var(--border-main); }
        .aoc-tab-btn { padding: 10px 15px; border: none; background-color: transparent; color: var(--text-light); cursor: pointer; font-size: 1em; border-bottom: 3px solid transparent; display: flex; align-items: center; gap: 5px;}
        .aoc-tab-btn.active { color: var(--text-main); font-weight: bold; border-bottom: 3px solid var(--accent);}
        .aoc-tab-btn:hover:not(.active) { background-color: var(--bg-table-hover); }
        .aoc-tab-content h3 { color: var(--accent); border-bottom: 1px solid var(--border-light); padding-bottom: 5px; margin-top: 0;}
        .aoc-controls { padding-bottom: 15px; display: flex; flex-wrap: wrap; gap: 10px; align-items: center; border-bottom: 1px solid var(--border-light); margin-bottom: 10px; }
        .aoc-controls label { font-weight: bold; margin-right: 5px; cursor: pointer; }
        .aoc-controls input, .aoc-controls select, .aoc-controls button { padding: 6px 10px; border: 1px solid var(--border-main); background-color: var(--bg-secondary); color: var(--text-main); border-radius: 4px; font-family: var(--aoc-font); }
        .aoc-controls input[type=checkbox] { margin-right: 2px; }
        .aoc-controls button { cursor: pointer; background-color: var(--border-main); transition: background-color 0.2s; }
        .aoc-controls button:hover { background-color: var(--bg-table-hover); }
        .aoc-api-save-btn { background-color: var(--btn-success) !important; color: white !important; }
        .aoc-api-save-btn:hover { background-color: var(--btn-success-hover) !important; }
        .aoc-summary-bar { padding-bottom: 10px; font-size: 0.9em; display: flex; gap: 10px 20px; flex-wrap: wrap; align-items: center; }
        .aoc-summary-bar span { font-weight: bold; color: var(--text-main); }
        .aoc-summary-bar .summary-light { font-weight: normal; color: var(--text-light); }
        .aoc-table { width: 100%; border-collapse: collapse; font-size: 0.9em; }
        .aoc-table th, .aoc-table td { padding: 8px 10px; text-align: left; border-bottom: 1px solid var(--border-light); word-break: break-word; }
        .aoc-table th { background-color: var(--bg-main); position: sticky; top: 0; z-index: 1; }
        .aoc-table tbody tr:nth-child(even):not(.aoc-details-row) { background-color: var(--bg-table-even); }
        .aoc-table tbody tr:not(.aoc-details-row):hover { background-color: var(--bg-table-hover); }
        .aoc-table a, #aoc-menu-container p a, .aoc-footer a { color: var(--link); text-decoration: none; }
        .aoc-table a:hover, #aoc-menu-container p a:hover, .aoc-footer a:hover { text-decoration: underline; }
        .aoc-toggle-details { cursor: pointer; font-weight: bold; margin-right: 8px; color: var(--accent); user-select: none; display: inline-block; width: 12px; font-family: monospace; font-size: 1.2em; }
        .aoc-details-row td { padding: 0; background-color: var(--bg-secondary) !important; }
        .aoc-details-content { padding: 10px 20px 10px 40px; }
        .aoc-details-content ul { margin: 0; padding-left: 20px; list-style: disc; }
        .aoc-footer { padding: 8px 15px; font-size: 0.9em; color: var(--text-light); border-top: 1px solid var(--border-main); display: flex; justify-content: space-between; align-items: center; }
        #aoc-api-counter { font-weight: bold; padding: 2px 5px; border-radius: 3px; }
        .aoc-api-low { background-color: #38761d; color: white; } .aoc-api-medium { background-color: #f1c232; color: black; }
        .aoc-api-high { background-color: #cc4125; color: white; } .aoc-api-max { background-color: #990000; color: white; }
        #aoc-loader { text-align: center; padding: 50px; font-size: 1.2em; }
        #aoc-log-container { flex-grow: 1; overflow-y: auto; background: var(--bg-header); padding: 10px; font-family: monospace; font-size: 0.8em; white-space: pre-wrap; color: var(--text-main); }
        #aoc-log-container .log-warn { color: #f1c232; } #aoc-log-container .log-error { color: #e06666; }
        #aoc-api-key-input { width: 300px; }
        #aoc-tool-tab a { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding-top: 5px; }
        body.aoc-dragging { user-select: none; }
    `);

    // --- HTML TEMPLATE ---
    const menuHTML = `
        <div id="aoc-menu-container">
            <div class="aoc-header"><button class="aoc-close-btn" title="Close">&times;</button></div>
            <div class="aoc-tab-bar">
                <button class="aoc-tab-btn active" data-tab="log">OC Log</button>
                <button class="aoc-tab-btn" data-tab="downtime">Downtime Report</button>
                <button class="aoc-tab-btn" data-tab="settings">Settings</button>
                <button class="aoc-tab-btn" data-tab="script-log">Script Log</button>
            </div>
            <div class="aoc-content-area">
                <div id="aoc-tab-log" class="aoc-tab-content active">
                    <div class="aoc-controls">
                        <div><input type="checkbox" id="aoc-completed-only"><label for="aoc-completed-only">Show only completed OCs</label></div>
                        <div style="margin-left:auto;"><button class="aoc-refresh-btn">Force Refresh</button><button class="aoc-export-btn">Export to CSV</button></div>
                    </div>
                    <div class="aoc-summary-bar" id="aoc-summary-log"></div>
                    <div class="aoc-table-container"><div id="aoc-loader"></div><table class="aoc-table" id="aoc-results-table"></table></div>
                </div>
                <div id="aoc-tab-downtime" class="aoc-tab-content">
                     <div class="aoc-controls">
                           <small style="width:100%; text-align: center; color: var(--text-light);">Report based on the latest ~100 OCs available from the API.</small>
                           <div style="margin-left:auto;"><button class="aoc-refresh-btn">Force Refresh</button><button class="aoc-export-btn">Export to CSV</button></div>
                     </div>
                    <div class="aoc-summary-bar" id="aoc-summary-downtime"></div>
                    <div class="aoc-table-container"><table class="aoc-table" id="aoc-leaderboard-table"></table></div>
                </div>
                <div id="aoc-tab-settings" class="aoc-tab-content">
                    <h3>API Key Settings</h3>
                    <p>Your API Key is stored locally and never shared. Go to your <a href="https://www.torn.com/preferences.php#tab=api" target="_blank">API Key settings</a>, create a key with <strong>Limited Access</strong>, and paste it below. <strong>Important:</strong> Your role within the faction must also have permissions to view Organized Crimes for this tool to function correctly.</p>
                    <div class="aoc-controls" style="border:none; margin-bottom: 20px;">
                        <label for="aoc-api-key-input">API Key:</label><input type="password" id="aoc-api-key-input" placeholder="Enter your Torn API Key"><button id="aoc-api-save-btn" class="aoc-api-save-btn">Save Key</button>
                    </div>
                    <h3>Display Settings</h3>
                    <div class="aoc-controls" style="border:none;">
                       <label for="aoc-theme-select">Theme:</label><select id="aoc-theme-select"><option value="theme-dark">Dark</option><option value="theme-light">Light</option><option value="theme-readability">Readability</option></select>
                       <button id="aoc-test-oc-btn" style="margin-left: auto;">Show Test OC</button>
                    </div>
                </div>
                <div id="aoc-tab-script-log" class="aoc-tab-content" style="padding: 0;"><div id="aoc-log-container"></div></div>
            </div>
            <div class="aoc-footer">
                <a href="https://www.torn.com/forums.php#/p=threads&f=67&t=16405559&b=0&a=0" target="_blank">By HeyItzWerty [3626448] v1.2</a>
                <span id="aoc-api-counter">API Calls: 0/100</span>
            </div>
        </div>
    `;

    // --- LOGGING ---
    function logMessage(message, level = 'INFO') {
        const logContainer = document.getElementById('aoc-log-container');
        if (!logContainer) return;
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.className = `log-${level.toLowerCase()}`;
        logEntry.textContent = `[${timestamp}] [${level}] ${message}`;
        logContainer.prepend(logEntry);
    }

    // --- API & DATA HANDLING ---
    async function rateLimitedFetch(url) {
        const API_LOG_KEY = 'aoc_api_log';
        let apiLog = JSON.parse(await GM_getValue(API_LOG_KEY, '[]'));
        const now = Date.now();
        apiLog = apiLog.filter(ts => now - ts < 60000);
        if (apiLog.length >= 100) {
            const errorMsg = "API limit reached. Please wait a minute.";
            logMessage(errorMsg, "ERROR");
            return Promise.reject({ error: errorMsg, code: 5 });
        }
        apiLog.push(now);
        state.apiCallCount = apiLog.length;
        await GM_setValue(API_LOG_KEY, JSON.stringify(apiLog));
        updateApiCounterUI(state.apiCallCount);
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET', url,
                onload: response => {
                    try {
                        if (response.status === 200) {
                            const data = JSON.parse(response.responseText);
                            if (data.error) {
                                logMessage(`API Error Code ${data.error.code}: ${data.error.error}`, "ERROR");
                                reject(data.error);
                            } else { resolve(data); }
                        } else {
                            logMessage(`HTTP Error: ${response.status}`, "ERROR");
                            reject({ error: `HTTP Error: ${response.status}` });
                        }
                    } catch (e) {
                        logMessage(`JSON Parse Error: ${e.message}`, "ERROR");
                        reject({ error: `JSON Parse Error: ${e.message}`});
                    }
                },
                onerror: error => { logMessage('Request Error', "ERROR"); reject({ error: 'Request Error' }) }
            });
        });
    }

    async function fetchAndCacheItems() {
        if (!state.apiKey || state.itemMap) return;
        logMessage("Fetching item list from API...");
        try {
            const data = await rateLimitedFetch(`https://api.torn.com/torn/?selections=items&key=${state.apiKey}`);
            state.itemMap = data.items;
            await GM_setValue('aoc_item_cache', JSON.stringify({ items: state.itemMap, timestamp: Date.now() }));
            logMessage(`Item list fetched and cached with ${Object.keys(state.itemMap).length} items.`, "INFO");
        } catch (error) {
            logMessage(`Failed to fetch item list. Error: ${error.error || 'Unknown'}`, "ERROR");
        }
    }

    async function syncAndFetchData() {
        if (!state.apiKey) {
            logMessage("API Key not set. Aborting fetch.", "WARN");
            switchTab('settings');
            document.getElementById('aoc-loader').textContent = "Please enter your API Key in the Settings tab.";
            return null;
        }

        logMessage("Starting data sync...");
        document.getElementById('aoc-loader').textContent = "Fetching Faction & OC Data...";

        try {
            const factionData = await rateLimitedFetch(`https://api.torn.com/v2/faction?selections=crimes,members&key=${state.apiKey}`);
            const ocData = factionData.crimes ? Object.values(factionData.crimes) : [];
            state.currentMembers = factionData.members || {};

            logMessage(`Building definitive user cache from ${ocData.length} OC logs...`);
            let userMap = JSON.parse(await GM_getValue('aoc_user_cache', '{}'));
            const idsNeedingNames = new Set();

            ocData.forEach(oc => {
                oc.slots?.forEach(slot => {
                    if (slot.user?.id) {
                        const userId = String(slot.user.id);
                        if (!userMap[userId]) { idsNeedingNames.add(userId); }
                    }
                });
            });

            if (idsNeedingNames.size > 0) {
                logMessage(`Found ${idsNeedingNames.size} users with missing names. Fetching...`);
                document.getElementById('aoc-loader').textContent = `Syncing ${idsNeedingNames.size} user names...`;
                for (const id of idsNeedingNames) {
                    try {
                        const userData = await rateLimitedFetch(`https://api.torn.com/user/${id}?selections=profile&key=${state.apiKey}`);
                        userMap[id] = userData.name ? userData.name : `[${id}]`;
                    } catch (error) {
                        logMessage(`Failed to fetch name for user ${id}. Error: ${error.error || 'Unknown'}`, 'WARN');
                        userMap[id] = `[${id}]`; // Prevent re-fetching. Saves on calls
                        if (error.code === 5) {
                            logMessage('Rate limit hit. Pausing fetches for 60 seconds.', 'ERROR');
                            await new Promise(resolve => setTimeout(resolve, 60000));
                        }
                    }
                      await new Promise(resolve => setTimeout(resolve, 600));
                }
                logMessage(`User name sync complete.`);
            } else {
                 logMessage(`User cache is up to date.`);
            }

            await GM_setValue('aoc_user_cache', JSON.stringify(userMap));
            const finalData = { ocData, userCache: userMap, timestamp: Date.now() };
            await GM_setValue('aoc_cache', JSON.stringify(finalData));
            logMessage(`Sync complete. Data fetched and cached.`, "INFO");
            return finalData;

        } catch (error) {
            let errorText = `Failed to fetch or sync data. Error: ${error.error || 'Unknown'}`;
            logMessage(errorText, "ERROR");
            document.getElementById('aoc-loader').textContent = "Error during data sync. Check the Script Log tab for details.";
            return null;
        }
    }

    async function loadData(forceRefresh = false) {
        if (state.isDataLoading) return;
        state.isDataLoading = true;
        document.getElementById('aoc-loader').style.display = 'block';
        document.getElementById('aoc-results-table').innerHTML = '';
        document.getElementById('aoc-leaderboard-table').innerHTML = '';

        let data = null;
        const cachedData = JSON.parse(await GM_getValue('aoc_cache', 'null'));

        if (!forceRefresh && cachedData && (Date.now() - cachedData.timestamp) < (30 * 60 * 1000)) {
            logMessage("Loading data from cache.");
            data = cachedData;
            state.currentMembers = JSON.parse(await GM_getValue('aoc_current_members', '{}'));
        } else {
            logMessage(forceRefresh ? "Forcing refresh of all data from API." : "Cache expired or missing. Fetching from API.");
            data = await syncAndFetchData();
            await GM_setValue('aoc_current_members', JSON.stringify(state.currentMembers));
        }

        if (data) {
            state.fullOCData = data.ocData;
            state.userCache = data.userCache;
            state.lastUpdatedTimestamp = data.timestamp;
            await fetchAndCacheItems();
            applyFiltersAndRender();
        } else {
            document.getElementById('aoc-loader').textContent = "Failed to load data. Check script log.";
        }
        state.isDataLoading = false;
    }

    // --- UI & RENDERING ---
    function formatDuration(seconds) {
        if (seconds < 0 || isNaN(seconds) || seconds === null) return 'N/A';
        if (seconds === 0) return '0s';
        const d = Math.floor(seconds / 86400);
        const h = Math.floor(seconds % 86400 / 3600);
        const m = Math.floor(seconds % 3600 / 60);
        const s = Math.floor(seconds % 60);
        return [d > 0 ? `${d}d` : '', h > 0 ? `${h}h` : '', m > 0 ? `${m}m` : '', s > 0 ? `${s}s` : ''].filter(Boolean).join(' ') || '0s';
    }

    function getFilteredData() {
        if (!state.fullOCData) return [];
        const completedOnly = document.getElementById('aoc-completed-only').checked;
        return completedOnly ? state.fullOCData.filter(oc => oc.status === 'Successful' || oc.status === 'Failure') : state.fullOCData;
    }

    function applyFiltersAndRender() {
        if (!state.fullOCData || !state.userCache) {
            const loader = document.getElementById('aoc-loader');
            loader.style.display = 'block';
            loader.textContent = state.apiKey ? "No data found. Try a force refresh." : "Please enter your API Key.";
            return;
        }
        document.getElementById('aoc-loader').style.display = 'none';
        const activeTab = document.querySelector('.aoc-tab-btn.active').dataset.tab;
        if (activeTab === 'log') {
            renderOcLog(getFilteredData());
        } else if (activeTab === 'downtime') {
            calculateAndRenderLeaderboard(state.fullOCData);
        }
    }

    function renderOcLog(data) {
        const table = document.getElementById('aoc-results-table');
        let totalMoney = 0, successCount = 0;
        const sortedData = [...data].sort((a, b) => (a.executed_at || a.created_at) - (b.executed_at || b.created_at));
        let tableHTML = `<thead><tr><th style="width:20px;"></th><th>Crime</th><th>Status</th><th>Results</th><th>Completed</th></tr></thead><tbody>`;

        if (sortedData.length === 0) {
            tableHTML += `<tr><td colspan="5" style="text-align:center;">No organized crimes match the current filters.</td></tr>`;
        } else {
            sortedData.forEach(oc => {
                if (oc.status === 'Recruiting' && oc.slots.every(s => !s.user)) return;
                const isSuccess = oc.status === 'Successful';
                if (isSuccess) { totalMoney += oc.rewards?.money || 0; successCount++; }

                const items = oc.rewards?.items?.map(i => `${i.quantity}x ${state.itemMap?.[i.id]?.name || `Item ${i.id}`}`).join(', ') || 'None';
                const resultsHTML = `<div style="line-height: 1.4;"><span style="color: var(--status-success);">$${(oc.rewards?.money || 0).toLocaleString()}</span> | <span>${(oc.rewards?.respect || 0).toLocaleString()} Respect</span><br><small style="color: var(--text-light);"><em>Items: ${items}</em></small></div>`;
                const participants = oc.slots.filter(s => s.user).map(s => `<li><a href="https://www.torn.com/profiles.php?XID=${s.user.id}" target="_blank">${state.userCache[String(s.user.id)] || `User ${s.user.id}`}</a> - ${s.position} (${s.checkpoint_pass_rate}%)</li>`).join('');

                tableHTML += `
                    <tr class="aoc-main-row" data-oc-id="${oc.id}">
                        <td><span class="aoc-toggle-details" title="Show participants">+</span></td>
                        <td><a href="https://www.torn.com/factions.php?step=your&type=1#/tab/crimes&crimeId=${oc.id}" target="_blank">${oc.name}</a></td>
                        <td style="color:var(${isSuccess ? '--status-success' : (oc.status === 'Failure' ? '--status-fail' : '--text-light')}); font-weight: bold;">${oc.status}</td>
                        <td>${resultsHTML}</td>
                        <td>${oc.executed_at ? new Date(oc.executed_at * 1000).toLocaleString() : 'In Progress'}</td>
                    </tr>
                    <tr class="aoc-details-row" data-details-for="${oc.id}" style="display: none;"><td colspan="5"><div class="aoc-details-content"><strong>Participants:</strong><ul>${participants || 'None'}</ul></div></td></tr>`;
            });
        }
        table.innerHTML = tableHTML + '</tbody>';
        const summaryBar = document.getElementById('aoc-summary-log');
        const completedOCs = data.filter(oc => oc.status === 'Successful' || oc.status === 'Failure');
        const successRate = completedOCs.length > 0 ? ((successCount / completedOCs.length) * 100).toFixed(1) : 0;
        summaryBar.innerHTML = `<span>Showing: ${sortedData.length}</span><span>Success Rate: ${successRate}%</span><span>Total Money: $${totalMoney.toLocaleString()}</span><span class="summary-light">Last Updated: ${new Date(state.lastUpdatedTimestamp).toLocaleTimeString()}</span>`;
    }

    function calculateAndRenderLeaderboard(allOcData) {
        const table = document.getElementById('aoc-leaderboard-table');
        const memberStats = {};

        const nameToIdCache = {};
        for (const userId in state.userCache) { nameToIdCache[state.userCache[userId].toLowerCase()] = userId; }

        const currentMemberNames = Object.values(state.currentMembers).map(member => member.name);
        if (currentMemberNames.length === 0) {
            table.innerHTML = '<tbody><tr><td colspan="4" style="text-align:center;">Could not find any current faction members. Please try a force refresh.</td></tr></tbody>';
            return;
        }

        currentMemberNames.forEach(name => {
            const userId = nameToIdCache[name.toLowerCase()];
            if (userId) {
                memberStats[userId] = { userID: userId, name: name, ocs: [], joinTimes: [], downtime: 0, avgJoinTime: -1, };
            } else {
                logMessage(`Could not find UserID for current member "${name}". They will be excluded from the downtime report until they participate in a logged OC.`, 'WARN');
            }
        });

        const completedOcs = allOcData.filter(oc => oc.status === 'Successful' || oc.status === 'Failure');

        completedOcs.forEach(oc => {
            oc.slots?.forEach(slot => {
                if (slot.user) {
                    const userId = String(slot.user.id);
                    if (memberStats[userId]) {
                        if (oc.planning_at && oc.executed_at) { memberStats[userId].ocs.push({ start: parseInt(oc.planning_at), end: parseInt(oc.executed_at) }); }
                        if (slot.user.joined_at && oc.created_at) { memberStats[userId].joinTimes.push(slot.user.joined_at - oc.created_at); }
                    }
                }
            });
        });

        const now = Date.now() / 1000;
        const periodStart = completedOcs.length > 0 ? Math.min(...completedOcs.map(oc => oc.executed_at).filter(Boolean)) : now;

        for (const userId in memberStats) {
            const member = memberStats[userId];
            member.ocs.sort((a, b) => a.start - b.start);
            if (member.ocs.length > 0) {
                let downtime = Math.max(0, member.ocs[0].start - periodStart);
                for (let i = 0; i < member.ocs.length - 1; i++) { downtime += Math.max(0, member.ocs[i + 1].start - member.ocs[i].end); }
                downtime += Math.max(0, now - member.ocs[member.ocs.length - 1].end);
                member.downtime = downtime;
            } else {
                member.downtime = now - periodStart;
            }
            member.avgJoinTime = member.joinTimes.length > 0 ? member.joinTimes.reduce((a, b) => a + b, 0) / member.joinTimes.length : -1;
        }

        const memberStatsArray = Object.values(memberStats).sort((a, b) => b.downtime - a.downtime);

        let tableHTML = `<thead><tr><th>Member</th><th>OCs Joined</th><th>Avg. Join Time</th><th>Downtime</th></tr></thead><tbody>`;
        if (memberStatsArray.length === 0) {
             tableHTML += `<tr><td colspan="4" style="text-align:center;">No current members found in recent OC logs. Report cannot be generated.</td></tr>`;
        } else {
            memberStatsArray.forEach(stat => {
                tableHTML += `<tr><td><a href="https://www.torn.com/profiles.php?XID=${stat.userID}" target="_blank">${stat.name} [${stat.userID}]</a></td><td>${stat.ocs.length}</td><td>${formatDuration(stat.avgJoinTime)}</td><td>${formatDuration(stat.downtime)}</td></tr>`;
            });
        }
        table.innerHTML = tableHTML + `</tbody>`;
        const summaryBar = document.getElementById('aoc-summary-downtime');
        summaryBar.innerHTML = `<span>Tracking ${memberStatsArray.length} Members</span> <span class="summary-light">Last Updated: ${new Date(state.lastUpdatedTimestamp).toLocaleTimeString()}</span>`;
    }

    function setupEventListeners() {
        const menu = document.getElementById('aoc-menu-container');
        const header = menu.querySelector('.aoc-header');
        menu.querySelector('.aoc-close-btn').addEventListener('click', closeMenu);
        document.querySelectorAll('.aoc-refresh-btn').forEach(btn => btn.addEventListener('click', () => loadData(true)));
        document.querySelectorAll('.aoc-export-btn').forEach(btn => btn.addEventListener('click', exportDataToCSV));
        document.getElementById('aoc-api-save-btn').addEventListener('click', saveApiKey);
        document.getElementById('aoc-test-oc-btn').addEventListener('click', showTestOC);
        document.getElementById('aoc-completed-only').addEventListener('change', async (e) => {
            await GM_setValue('aoc_completed_only', e.target.checked);
            applyFiltersAndRender();
        });
        menu.querySelectorAll('.aoc-tab-btn').forEach(tab => tab.addEventListener('click', () => switchTab(tab.dataset.tab)));
        document.getElementById('aoc-theme-select').addEventListener('change', (e) => saveTheme(e.target.value));
        document.getElementById('aoc-results-table').addEventListener('click', (e) => {
            const toggle = e.target.closest('.aoc-toggle-details');
            if (toggle) {
                const mainRow = toggle.closest('.aoc-main-row');
                const detailsRow = mainRow.nextElementSibling;
                const isHidden = detailsRow.style.display === 'none';
                detailsRow.style.display = isHidden ? 'table-row' : 'none';
                toggle.textContent = isHidden ? '−' : '+';
            }
        });
        let pos = {};
        const dragMouseDown = (e) => {
             if (e.target.closest('button, input, a, select')) return;
            e.preventDefault();
            pos = { left: menu.offsetLeft, top: menu.offsetTop, x: e.clientX, y: e.clientY };
            document.body.classList.add('aoc-dragging');
            document.addEventListener('mousemove', dragMouseMove);
            document.addEventListener('mouseup', dragMouseUp, { once: true });
        };
        const dragMouseMove = (e) => { menu.style.left = `${pos.left + e.clientX - pos.x}px`; menu.style.top = `${pos.top + e.clientY - pos.y}px`; };
        const dragMouseUp = () => {
            document.body.classList.remove('aoc-dragging');
            document.removeEventListener('mousemove', dragMouseMove);
            GM_setValue('aoc_menu_pos', JSON.stringify({ x: menu.style.left, y: menu.style.top }));
        };
        header.addEventListener('mousedown', dragMouseDown);
        new ResizeObserver(() => { GM_setValue('aoc_menu_size', JSON.stringify({ w: menu.offsetWidth, h: menu.offsetHeight })); }).observe(menu);
    }

    function updateApiCounterUI(count) {
        const counterEl = document.getElementById('aoc-api-counter');
        if (!counterEl) return;
        counterEl.textContent = `API Calls: ${count}/100`;
        counterEl.className = count >= 100 ? 'aoc-api-max' : count >= 80 ? 'aoc-api-high' : count >= 50 ? 'aoc-api-medium' : 'aoc-api-low';
    }

    async function init() {
        state.apiKey = await GM_getValue('aoc_api_key', '');
        const savedSize = JSON.parse(await GM_getValue('aoc_menu_size', 'null'));
        const savedPos = JSON.parse(await GM_getValue('aoc_menu_pos', 'null'));
        const savedTheme = await GM_getValue('aoc_theme', 'theme-dark');
        const completedOnly = await GM_getValue('aoc_completed_only', true);
        document.body.insertAdjacentHTML('beforeend', menuHTML);
        const menu = document.getElementById('aoc-menu-container');
        document.getElementById('aoc-theme-select').value = savedTheme;
        applyTheme(savedTheme);
        document.getElementById('aoc-completed-only').checked = completedOnly;
        if(savedSize) { menu.style.width = `${savedSize.w}px`; menu.style.height = `${savedSize.h}px`; }
        if(savedPos) { menu.style.top = savedPos.y; menu.style.left = savedPos.x; }
        else { menu.style.top = '50%'; menu.style.left = '50%'; menu.style.transform = 'translate(-50%, -50%)'; }
        if(state.apiKey) document.getElementById('aoc-api-key-input').value = state.apiKey;
        const itemCache = JSON.parse(await GM_getValue('aoc_item_cache', 'null'));
        if (itemCache && (Date.now() - itemCache.timestamp) < (7 * 24 * 60 * 60 * 1000)) {
             state.itemMap = itemCache.items;
             logMessage("Loaded items from cache.");
        }
        const observer = new MutationObserver(() => {
            if (window.location.href.includes("factions.php")) {
                const factionTabs = document.querySelector('ul.faction-tabs');
                if (factionTabs && !document.getElementById('aoc-tool-tab')) {
                    injectMenuButton(factionTabs);
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        setupEventListeners();
        logMessage("Anonymous OC Tool initialized.");
    }

    async function saveApiKey() {
        state.apiKey = document.getElementById('aoc-api-key-input').value.trim();
        await GM_setValue('aoc_api_key', state.apiKey);
        logMessage("API Key saved.");
        alert("API Key saved successfully!");
        await GM_setValue('aoc_cache', 'null');
        await GM_setValue('aoc_user_cache', '{}');
        if (state.isMenuOpen) loadData(true);
    }

    function applyTheme(theme) {
        const menu = document.getElementById('aoc-menu-container');
        menu.className = theme;
        if (state.isMenuOpen) menu.classList.add('aoc-visible');
    }

    async function saveTheme(theme) { await GM_setValue('aoc_theme', theme); applyTheme(theme); }
    function injectMenuButton(factionTabs) {
        if (document.getElementById('aoc-tool-tab')) return;
        const toolTab = document.createElement('li');
        toolTab.className = 'ui-state-default ui-corner-top';
        toolTab.id = 'aoc-tool-tab';
        toolTab.innerHTML = `<a class="ui-tabs-anchor" href="#" role="presentation" title="Anonymous OC Tool"><i class="faction-crimes-icon"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" viewBox="0 0 24 24" style="margin-top:-5px;"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-12h2v4h-2zm0 6h2v2h-2z"/></svg></i><span class="tab-name">OC TOOL</span></a>`;
        toolTab.addEventListener('click', (e) => { e.preventDefault(); toggleMenu(); });
        factionTabs.appendChild(toolTab);
        logMessage("Tool button injected.");
    }
    function showTestOC() {
        logMessage("Generating test OC data.");
        switchTab('log');
        const fakeOC = {"id":123,"name":"Test OC", crime_id: 6, "status":"Successful","executed_at":Date.now()/1000,"rewards":{"money":10e6,"respect":100,"items":[{"id":283,"quantity":1}]},"slots":[{"user":{"id":1},"position":"Test","checkpoint_pass_rate":100}]};
        state.userCache = { ...state.userCache, '1': 'TestUser' };
        state.itemMap = { ...state.itemMap, 283: { name: 'TestItem' } };
        document.getElementById('aoc-loader').style.display = 'none';
        renderOcLog([fakeOC]);
    }
    function openMenu() {
        document.getElementById('aoc-menu-container').classList.add('aoc-visible');
        state.isMenuOpen = true;
        if (!state.fullOCData) { loadData(false); }
        else { applyFiltersAndRender(); }
    }
    function closeMenu() { document.getElementById('aoc-menu-container').classList.remove('aoc-visible'); state.isMenuOpen = false; }
    function toggleMenu() { state.isMenuOpen ? closeMenu() : openMenu(); }
    function switchTab(tabId) {
        document.querySelectorAll('.aoc-tab-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabId));
        document.querySelectorAll('.aoc-tab-content').forEach(c => c.classList.toggle('active', c.id === `aoc-tab-${tabId}`));
        if (state.fullOCData) { applyFiltersAndRender(); }
    }

    function escapeCsvCell(cell) {
        let str = String(cell ?? '');
        if (str.includes(',') || str.includes('\n') || str.includes('"')) {
            str = `"${str.replace(/"/g, '""')}"`;
        }
        return str;
    }

    function downloadCSV(csvContent, filename) {
        const link = document.createElement("a");
        link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function exportDataToCSV() {
        const activeTab = document.querySelector('.aoc-tab-btn.active').dataset.tab;

        if (activeTab === 'downtime') {
            const table = document.getElementById('aoc-leaderboard-table');
            if (!table || table.rows.length <= 1) return alert("No data to export.");

            const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent);
            let csvRows = [headers.join(',')];

            Array.from(table.querySelectorAll('tbody tr')).forEach(row => {
                const cells = Array.from(row.querySelectorAll('td'));
                if (cells.length > 0) {
                    const userLink = cells[0].querySelector('a');
                    const userName = userLink ? userLink.textContent : cells[0].textContent;
                    const userUrl = userLink ? userLink.href : '';
                    const userCell = userUrl ? `=HYPERLINK("${userUrl}", "${userName}")` : userName;
                    const otherCells = cells.slice(1).map(td => td.textContent);
                    const allCells = [userCell, ...otherCells];
                    csvRows.push(allCells.map(escapeCsvCell).join(','));
                }
            });
            downloadCSV(csvRows.join('\n'), `aoc_downtime_export_${new Date().toISOString().slice(0,10)}.csv`);
            logMessage(`Exported downtime data to CSV.`);

        } else if (activeTab === 'log') {
            if (!state.fullOCData || state.fullOCData.length === 0) return alert("No OC data to export.");

            const sortedData = [...getFilteredData()].sort((a, b) => (a.executed_at || a.created_at) - (b.executed_at || b.created_at));

            // --- Transposed CSV Logic ---
            const labels = ['Crime', 'Status', 'Date', 'Cash', 'Respect', 'Items', '--- Participants ---'];
            const maxParticipants = sortedData.reduce((max, oc) => Math.max(max, oc.slots.filter(s => s.user).length), 0);

            for (let i = 1; i <= maxParticipants; i++) {
                labels.push(`P${i} Success`);
                labels.push(`P${i} Name`);
                labels.push(`P${i} Role`);
            }

            const dataMatrix = [labels];

            sortedData.forEach(oc => {
                const column = new Array(labels.length).fill('');
                const ocUrl = `https://www.torn.com/factions.php?step=your&type=1#/tab/crimes&crimeId=${oc.id}`;
                column[0] = `=HYPERLINK("${ocUrl}", "${oc.name}")`;
                column[1] = oc.status;
                column[2] = oc.executed_at ? new Date(oc.executed_at * 1000).toLocaleString() : 'In Progress';
                column[3] = oc.rewards?.money || 0;
                column[4] = oc.rewards?.respect || 0;
                column[5] = oc.rewards?.items?.map(i => `${i.quantity}x ${state.itemMap?.[i.id]?.name || `Item ${i.id}`}`).join('; ') || 'None';
                // column[6] is the separator, remains blank

                let participantRowIndex = 7;
                oc.slots.forEach(slot => {
                    if (slot.user) {
                        const userName = state.userCache[String(slot.user.id)] || `User ${slot.user.id}`;
                        const userUrl = `https://www.torn.com/profiles.php?XID=${slot.user.id}`;
                        column[participantRowIndex++] = `${slot.checkpoint_pass_rate}%`;
                        column[participantRowIndex++] = `=HYPERLINK("${userUrl}", "${userName}")`;
                        column[participantRowIndex++] = slot.position;
                    }
                });
                dataMatrix.push(column);
            });

            // Transpose the matrix
            const transposedMatrix = dataMatrix[0].map((_, colIndex) => dataMatrix.map(row => row[colIndex]));

            const csvContent = transposedMatrix.map(row => row.map(escapeCsvCell).join(',')).join('\n');
            downloadCSV(csvContent, `aoc_log_export_${new Date().toISOString().slice(0,10)}.csv`);
            logMessage(`Exported OC log data to transposed CSV.`);
        }
    }

    // --- SCRIPT START ---
    init();

})();