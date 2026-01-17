// ==UserScript==
// @name         WarScript - Player Attack Buttons (PDA Fork) - TEST
// @namespace    http://tampermonkey.net/
// @version      3.7.8-pda
// @description  Adds a player attack bar to the top of the page with stats, sorting, and mobile-friendly reordering.
// @author       TobyFlenderson[474025]
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @grant        GM_log
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      bigfatboys.com
// @downloadURL https://update.greasyfork.org/scripts/549991/WarScript%20-%20Player%20Attack%20Buttons%20%28PDA%20Fork%29%20-%20TEST.user.js
// @updateURL https://update.greasyfork.org/scripts/549991/WarScript%20-%20Player%20Attack%20Buttons%20%28PDA%20Fork%29%20-%20TEST.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const DEBUG_MODE = false;

    const logDebug = (message, ...args) => {
        if (DEBUG_MODE) {
            console.log(`WarScript DEBUG (PDA Fork): ${message}`, ...args);
        }
    };

    console.log("WarScript (PDA Fork): Script starting (v3.7.8-pda)...");
    const SETTINGS_KEY = 'torn_attack_settings';
    const API_KEY_STORAGE = 'torn_script_api_key';
    const FACTION_ID_STORAGE = 'torn_script_faction_id';
    const POLLING_RATE_STORAGE = 'torn_script_polling_rate';
    const LIVE_DATA_KEY = 'warscript_live_data_pda';
    const HIDE_BAR_KEY = 'warscript_hide_bar';
    const LOCK_BAR_KEY = 'warscript_lock_bar';

    let factionPollingInterval = null;
    let individualPollingInterval = null;
    let statusTimers = {};

    // --- UTILITY FUNCTIONS ---
    function formatStats(total) {
        if (total === null || isNaN(total) || total === 0 || total === undefined) return '-';
        if (total >= 1_000_000_000) return `${(total / 1_000_000_000).toFixed(1)}b`;
        if (total >= 1_000_000) return `${(total / 1_000_000).toFixed(1)}m`;
        if (total >= 1_000) return `${(total / 1_000).toFixed(1)}k`;
        if (total > 0) return '<1k';
        return '-';
    }

    // --- STYLES ---
    GM_addStyle(`
        :root {
            --torn-dark-bg: #333;
            --torn-dark-bg-darker: #222;
            --torn-light-text: #ccc;
            --torn-border-color: #555;
            --torn-red: #990000;
            --torn-red-hover: #d40000;
            --torn-blue: #00698C;
            --torn-blue-hover: #008CBA;
            --torn-green: #4CAF50;
            --torn-green-hover: #5cb85c;
            --torn-orange: #E69500;
            --torn-orange-hover: #f0ad4e;
            --torn-grey: #777;
            --torn-grey-hover: #999;
            --status-online: #4baf50;
            --status-idle: #ff9800;
            --status-offline: #607d8b;
        }

        #script-bar-wrapper { width: 100%; background-color: var(--torn-dark-bg-darker); padding: 5px 0; border-bottom: 1px solid var(--torn-border-color); }
        #script-bar-wrapper.bar-locked { position: fixed; top: 0; left: 0; width: 100%; z-index: 2147483646 !important; }
        #script-controls-container { max-width: 1080px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; padding: 0 10px; box-sizing: border-box; gap: 10px; }
        #warscript-content-area { flex-grow: 1; display: flex; min-width: 0; }
        #attack-buttons-container, #status-icons-container { display: flex; gap: 10px; flex-wrap: wrap; width: 100%; }
        #status-icons-container { display: none; min-height: 17px; gap: 5px; }
        .status-icon { width: 15px; height: 15px; border-radius: 50%; border: 1px solid #000; display: inline-block; }
        #script-main-controls { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
        .attack-button { color: white; border: 1px solid #000; border-radius: 5px; padding: 5px 10px; cursor: pointer; font-size: 14px; text-decoration: none; text-shadow: 0px 1px 0px #000; transition: background 0.3s ease; }
        .attack-button.status-okay-online, .status-icon.status-okay-online { background-color: var(--status-online); }
        .attack-button.status-okay-idle, .status-icon.status-okay-idle { background-color: var(--status-idle); }
        .attack-button.status-okay-offline, .status-icon.status-okay-offline { background-color: var(--status-offline); }
        .attack-button.status-default, .status-icon.status-default { background-color: var(--torn-grey); }
        .attack-button.status-hospital.online-green { background-image: linear-gradient(to right, var(--status-online) 25%, var(--torn-red) 25%); }
        .status-icon.status-hospital.online-green { background-image: linear-gradient(to right, var(--status-online) 50%, var(--torn-red) 50%); }
        .attack-button.status-hospital.online-orange { background-image: linear-gradient(to right, var(--status-idle) 25%, var(--torn-red) 25%); }
        .status-icon.status-hospital.online-orange { background-image: linear-gradient(to right, var(--status-idle) 50%, var(--torn-red) 50%); }
        .attack-button.status-hospital.online-grey { background-image: linear-gradient(to right, var(--status-offline) 25%, var(--torn-red) 25%); }
        .status-icon.status-hospital.online-grey { background-image: linear-gradient(to right, var(--status-offline) 50%, var(--torn-red) 50%); }
        .attack-button.status-traveling.online-green { background-image: linear-gradient(to right, var(--status-online) 25%, var(--torn-blue) 25%); }
        .status-icon.status-traveling.online-green { background-image: linear-gradient(to right, var(--status-online) 50%, var(--torn-blue) 50%); }
        .attack-button.status-traveling.online-orange { background-image: linear-gradient(to right, var(--status-idle) 25%, var(--torn-blue) 25%); }
        .status-icon.status-traveling.online-orange { background-image: linear-gradient(to right, var(--status-idle) 50%, var(--torn-blue) 50%); }
        .attack-button.status-traveling.online-grey { background-image: linear-gradient(to right, var(--status-offline) 25%, var(--torn-blue) 25%); }
        .status-icon.status-traveling.online-grey { background-image: linear-gradient(to right, var(--status-offline) 50%, var(--torn-blue) 50%); }

        #settings-button, #toggle-bar-button { background: linear-gradient(to bottom, #555 5%, #333 100%); color: var(--torn-light-text); border: 1px solid #666; border-radius: 5px; padding: 8px; cursor: pointer; font-size: 20px; line-height: 1; }
        #settings-button:hover, #toggle-bar-button:hover { background: linear-gradient(to bottom, #333 5%, #555 100%); }
        #settings-modal { display: none; position: fixed; z-index: 2147483647 !important; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.7); font-family: var(--default-font, "Helvetica Neue",Helvetica,Arial,sans-serif); }
        #settings-modal-content { background-color: var(--torn-dark-bg); color: var(--torn-light-text); margin: 10% auto; padding: 20px; border: 1px solid var(--torn-border-color); border-radius: 5px; width: 80%; max-width: 600px; position: relative; box-shadow: 0 5px 15px rgba(0,0,0,0.5); }
        #settings-modal-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--torn-border-color); padding-bottom: 10px; margin-bottom: 20px; }
        #settings-modal-header h2 { margin: 0; font-size: 24px; color: #fff; }
        .close-button { color: #aaa; font-size: 28px; font-weight: bold; cursor: pointer; }
        .close-button:hover { color: white; }
        #settings-rows { margin-bottom: 20px; max-height: 40vh; overflow-y: auto; }
        .settings-row, .settings-header-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #444; gap: 5px; position: relative; }
        .settings-column.stats { flex: 1.5; text-align: right; color: #fff; font-weight: bold; }
        #reorder-button.active { background: linear-gradient(to bottom, var(--torn-green-hover) 5%, var(--torn-green) 100%); }
        .reorder-controls { display: flex; flex-direction: column; justify-content: center; }
        .reorder-arrow { cursor: pointer; color: #aaa; font-size: 16px; line-height: 0.8; padding: 2px 4px; }
        .reorder-arrow:hover { color: white; }
        .reorder-arrow.disabled { cursor: not-allowed; color: #555; opacity: 0.5; }
        .settings-header-row { font-weight: bold; border-bottom: 2px solid var(--torn-border-color); }
        .settings-column.profile-id { flex: 1.5; }
        .settings-column.username { flex: 2; }
        .settings-column.enabled { flex: 0.8; text-align: center; }
        .settings-column.delete, .settings-column.reorder { flex: 0.5; text-align: right; }
        .settings-column.sortable { cursor: pointer; user-select: none; }
        .settings-column.sortable:hover { color: #fff; }
        .sort-arrow { display: inline-block; margin-left: 5px; color: #888; width: 1em; }
        .sort-arrow.asc::after { content: '▲'; }
        .sort-arrow.desc::after { content: '▼'; }
        .settings-column input[type="text"], #api-key-input, #faction-id-input, #polling-rate-input, #player-search-input { width: 100%; padding: 8px; border: 1px solid var(--torn-border-color); border-radius: 4px; background-color: var(--torn-dark-bg-darker); color: var(--torn-light-text); font-size: 14px; box-sizing: border-box; }
        .delete-row-button { color: #aaa; font-size: 22px; font-weight: bold; cursor: pointer; padding: 0 10px; }
        .delete-row-button:hover { color: var(--torn-red-hover); }
        .modal-footer-button, .modal-header-button { padding: 10px 20px; border-radius: 5px; border: 1px solid #000; cursor: pointer; font-size: 16px; color: white; text-shadow: 0px 1px 0px #000; }
        #new-line-button { background: linear-gradient(to bottom, var(--torn-green-hover) 5%, var(--torn-green) 100%); }
        #clear-all-button, #delete-api-key-button { background: linear-gradient(to bottom, var(--torn-red-hover) 5%, var(--torn-red) 100%); }
        #save-settings-button, #save-api-key-button { background: linear-gradient(to bottom, var(--torn-blue-hover) 5%, var(--torn-blue) 100%); }
        #change-api-key-button, #disable-all-button { background: linear-gradient(to bottom, var(--torn-orange-hover) 5%, var(--torn-orange) 100%); }
        #faction-fetch-button { background: linear-gradient(to bottom, #6a00d4 5%, #5200a3 100%); }
    `);

    async function fetchFromServer(endpoint, body) {
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: "POST",
                url: `https://bigfatboys.com/api/${endpoint}`,
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify(body),
                timeout: 15000,
                onload: response => {
                    try {
                        const data = JSON.parse(response.responseText);
                        resolve(data.error ? null : data);
                    } catch (e) { resolve(null); }
                },
                onerror: () => resolve(null)
            });
        });
    }

    function renderOrUpdateButtons(liveMembersData = null) {
        const container = document.getElementById('attack-buttons-container');
        const iconContainer = document.getElementById('status-icons-container');
        if (!container || !iconContainer) return;

        let settings = JSON.parse(GM_getValue(SETTINGS_KEY, '[]'));
        container.innerHTML = '';
        iconContainer.innerHTML = '';

        settings.forEach(setting => {
            if (!setting.enabled || !setting.profileId) return;

            let button = document.createElement('a');
            button.id = `attack-button-${setting.profileId}`;
            button.href = `https://www.torn.com/loader.php?sid=attack&user2ID=${setting.profileId}`;
            button.className = 'attack-button status-default';
            button.textContent = setting.name || setting.profileId;
            container.appendChild(button);

            let icon = document.createElement('a');
            icon.id = `status-icon-${setting.profileId}`;
            icon.href = button.href;
            icon.title = setting.name || setting.profileId;
            icon.className = 'status-icon status-default';
            iconContainer.appendChild(icon);

            button.addEventListener('click', function(event) {
                event.preventDefault();
                const urlParams = new URLSearchParams(window.location.search);
                if (window.location.pathname.includes('loader.php') && urlParams.get('sid') === 'attack' && urlParams.get('user2ID') === setting.profileId) {
                    const startFightButton = document.querySelector('.dialogButtons___nX4Bz button.torn-btn');
                    if (startFightButton) startFightButton.click();
                } else {
                    window.location.href = this.href;
                }
            });

            if (statusTimers[setting.profileId]) { clearInterval(statusTimers[setting.profileId]); delete statusTimers[setting.profileId]; }

            const memberData = liveMembersData ? liveMembersData[setting.profileId] : null;
            if (memberData && memberData.status && memberData.last_action) {
                const state = memberData.status.state;
                const lastAction = memberData.last_action.status;
                let mainClass = 'status-default', onlineClass = '';

                if (state === 'Hospital') { mainClass = 'status-hospital'; onlineClass = lastAction === 'Online' ? 'online-green' : (lastAction === 'Idle' ? 'online-orange' : 'online-grey'); }
                else if (state === 'Traveling' || state === 'Abroad') { mainClass = 'status-traveling'; onlineClass = lastAction === 'Online' ? 'online-green' : (lastAction === 'Idle' ? 'online-orange' : 'online-grey'); }
                else if (state === 'Okay') { mainClass = lastAction === 'Online' ? 'status-okay-online' : (lastAction === 'Idle' ? 'status-okay-idle' : 'status-okay-offline'); }

                button.className = `attack-button ${mainClass} ${onlineClass}`;
                icon.className = `status-icon ${mainClass} ${onlineClass}`;

                if (memberData.status.until) {
                    const updateTimer = () => {
                        const remaining = memberData.status.until - Math.floor(Date.now() / 1000);
                        if (remaining > 0) button.textContent = `${setting.name || setting.profileId} (${remaining > 60 ? Math.ceil(remaining / 60) + 'm' : remaining + 's'})`;
                        else { button.textContent = setting.name || setting.profileId; clearInterval(statusTimers[setting.profileId]); }
                    };
                    updateTimer();
                    statusTimers[setting.profileId] = setInterval(updateTimer, 1000);
                }
            }
        });
        updateBodyPadding();
    }

    async function saveSettings() {
        const saveButton = document.getElementById('save-settings-button');
        saveButton.disabled = true;
        saveButton.textContent = 'Saving...';

        GM_setValue(POLLING_RATE_STORAGE, parseInt(document.getElementById('polling-rate-input').value, 10) || 15);
        GM_setValue(LOCK_BAR_KEY, document.getElementById('lock-bar-checkbox').checked);
        updateBarLockState();

        const apiKey = GM_getValue(API_KEY_STORAGE, null);
        const rows = document.querySelectorAll('#settings-rows .settings-row');
        const settingsPromises = Array.from(rows).map(async (row) => {
            const profileId = row.querySelector('input.profile-id').value.trim();
            if (!profileId) return null;
            let name = row.querySelector('input.username').value;
            if (!name && apiKey) {
                let data = await fetchFromServer('individual', { apiKey: apiKey, id: profileId, selections: 'profile' });
                if (data) name = (data.profile || data).name;
            }
            return { profileId, name, enabled: row.querySelector('input.enabled').checked, source: row.dataset.source || 'manual' };
        });

        let newSettings = (await Promise.all(settingsPromises)).filter(s => s !== null);
        GM_setValue(SETTINGS_KEY, JSON.stringify(newSettings));
        await forcePollAndUpdate();
        loadSettings();
        startAllPolling();
        saveButton.disabled = false;
        saveButton.textContent = 'Save';
    }

    function createNewRow(data = {}) {
        const container = document.getElementById('settings-rows');
        const row = document.createElement('div');
        row.className = 'settings-row';
        row.dataset.source = data.source || 'manual';
        row.dataset.profileId = data.profileId || '';

        row.innerHTML = `
            <div class="settings-column profile-id"><input type="text" class="profile-id" placeholder="ID" value="${data.profileId || ''}"></div>
            <div class="settings-column username"><input type="text" class="username" placeholder="Name" value="${data.name || ''}" disabled></div>
            <div class="settings-column stats"><span class="stats-display">${formatStats(data.stats)}</span></div>
            <div class="settings-column enabled"><input type="checkbox" class="enabled" ${data.enabled ? 'checked' : ''}></div>
            <div class="settings-column delete"><span class="delete-row-button">&times;</span></div>
            <div class="settings-column reorder"><div class="reorder-controls" style="display: none;">
                <span class="reorder-arrow up-arrow">&#9650;</span>
                <span class="reorder-arrow down-arrow">&#9660;</span>
            </div></div>
        `;

        row.querySelector('.delete-row-button').onclick = () => row.remove();
        row.querySelector('.up-arrow').onclick = () => { if (row.previousElementSibling?.classList.contains('settings-row')) row.parentNode.insertBefore(row, row.previousElementSibling); updateArrowStates(); };
        row.querySelector('.down-arrow').onclick = () => { if (row.nextElementSibling) row.parentNode.insertBefore(row.nextElementSibling, row); updateArrowStates(); };
        container.appendChild(row);
    }

    function updateArrowStates() {
        document.querySelectorAll('#settings-rows .settings-row').forEach((row, i, arr) => {
            row.querySelector('.up-arrow').classList.toggle('disabled', i === 0);
            row.querySelector('.down-arrow').classList.toggle('disabled', i === arr.length - 1);
        });
    }

    function loadSettings() {
        let settings = JSON.parse(GM_getValue(SETTINGS_KEY, '[]'));
        let liveData = JSON.parse(GM_getValue(LIVE_DATA_KEY, '{}'));
        const container = document.getElementById('settings-rows');
        container.querySelectorAll('.settings-row').forEach(r => r.remove());

        settings.forEach(setting => {
            const live = liveData[setting.profileId];
            if (live?.spy) setting.stats = live.spy.total;
            createNewRow(setting);
        });
    }

    async function forcePollAndUpdate() {
        const apiKey = GM_getValue(API_KEY_STORAGE, null);
        if (!apiKey) return;
        let liveData = JSON.parse(GM_getValue(LIVE_DATA_KEY, '{}'));
        const factionId = GM_getValue(FACTION_ID_STORAGE, null);

        if (factionId) {
            const data = await fetchFromServer('faction', { apiKey, id: factionId });
            if (data?.members) {
                const memObj = Array.isArray(data.members) ? data.members.reduce((o, i) => { o[i.id] = i; return o; }, {}) : data.members;
                liveData = { ...liveData, ...memObj };
            }
        }

        const manual = JSON.parse(GM_getValue(SETTINGS_KEY, '[]')).filter(s => s.enabled && s.source === 'manual');
        for (const p of manual) {
            let data = await fetchFromServer('individual', { apiKey, id: p.profileId, selections: 'profile,basic' });
            if (data?.profile) data = data.profile;
            if (data?.status) liveData[p.profileId] = { ...data, last_action: { status: data.last_action.status } };
        }

        GM_setValue(LIVE_DATA_KEY, JSON.stringify(liveData));
        renderOrUpdateButtons(liveData);
    }

    function startAllPolling() {
        stopAllPolling();
        const apiKey = GM_getValue(API_KEY_STORAGE, null);
        if (!apiKey) return;

        const factionId = GM_getValue(FACTION_ID_STORAGE, null);
        const rate = parseInt(GM_getValue(POLLING_RATE_STORAGE, '15'), 10);

        const factionPoll = async () => {
            if (!factionId) return;
            const data = await fetchFromServer('faction', { apiKey, id: factionId });
            if (data?.members) {
                const current = JSON.parse(GM_getValue(LIVE_DATA_KEY, '{}'));
                const mems = Array.isArray(data.members) ? data.members.reduce((o, i) => { o[i.id] = i; return o; }, {}) : data.members;
                const merged = { ...current, ...mems };
                GM_setValue(LIVE_DATA_KEY, JSON.stringify(merged));
                renderOrUpdateButtons(merged);
            }
        };

        if (factionId) { factionPoll(); factionPollingInterval = setInterval(factionPoll, rate * 1000); }

        const manual = JSON.parse(GM_getValue(SETTINGS_KEY, '[]')).filter(s => s.enabled && s.source === 'manual');
        if (manual.length > 0) {
            let idx = 0;
            const indvPoll = async () => {
                if (idx >= manual.length) idx = 0;
                const p = manual[idx++];
                let data = await fetchFromServer('individual', { apiKey, id: p.profileId, selections: 'profile,basic' });
                if (data?.profile) data = data.profile;
                if (data?.status) {
                    const current = JSON.parse(GM_getValue(LIVE_DATA_KEY, '{}'));
                    current[p.profileId] = { ...data, last_action: { status: data.last_action.status } };
                    GM_setValue(LIVE_DATA_KEY, JSON.stringify(current));
                    renderOrUpdateButtons(current);
                }
            };
            indvPoll();
            individualPollingInterval = setInterval(indvPoll, Math.max(7500, 30000 / manual.length));
        }
    }

    function stopAllPolling() { clearInterval(factionPollingInterval); clearInterval(individualPollingInterval); }

    function updateBarVisibility() {
        const hidden = GM_getValue(HIDE_BAR_KEY, false);
        document.getElementById('attack-buttons-container').style.display = hidden ? 'none' : 'flex';
        document.getElementById('status-icons-container').style.display = hidden ? 'flex' : 'none';
        document.getElementById('toggle-bar-button').textContent = hidden ? '+' : '–';
        updateBodyPadding();
    }

    function updateBodyPadding() {
        const wrapper = document.getElementById('script-bar-wrapper');
        document.body.style.paddingTop = (wrapper && wrapper.classList.contains('bar-locked')) ? `${wrapper.offsetHeight}px` : '';
    }

    function updateBarLockState() {
        const locked = GM_getValue(LOCK_BAR_KEY, false);
        document.getElementById('script-bar-wrapper').classList.toggle('bar-locked', locked);
        updateBodyPadding();
    }

    function initializeUI() {
        const bar = document.createElement('div');
        bar.id = 'script-bar-wrapper';
        bar.innerHTML = `<div id="script-controls-container"><div id="warscript-content-area"><div id="attack-buttons-container"></div><div id="status-icons-container"></div></div><div id="script-main-controls"><button id="toggle-bar-button">–</button><button id="settings-button">&#9881;</button></div></div>`;
        document.body.prepend(bar);

        const modal = document.createElement('div');
        modal.id = 'settings-modal';
        modal.innerHTML = `
            <div id="settings-modal-content">
                <div id="api-key-view" style="display:none;">
                    <div id="settings-modal-header"><h2>API Key Setup</h2></div>
                    <p>Enter Torn API key:</p><input type="text" id="api-key-input">
                    <div id="settings-modal-footer" class="footer-button-row">
                        <button id="back-to-settings-from-api-button" class="modal-footer-button" style="display:none;">Back</button>
                        <button id="save-api-key-button" class="modal-footer-button">Save</button>
                    </div>
                </div>
                <div id="main-settings-view">
                    <div id="settings-modal-header">
                        <h2>Settings</h2>
                        <div><button id="reorder-button" class="modal-header-button">Reorder</button><button id="show-api-management-button" class="modal-header-button">API Key</button><span class="close-button">&times;</span></div>
                    </div>
                    <div id="profile-list-view">
                        <input type="text" id="player-search-input" placeholder="Search...">
                        <div id="settings-rows">
                            <div class="settings-header-row">
                                <div class="settings-column profile-id">ID</div>
                                <div class="settings-column username sortable" data-sort="username">User<span class="sort-arrow"></span></div>
                                <div class="settings-column stats sortable" data-sort="stats">TBS<span class="sort-arrow"></span></div>
                                <div class="settings-column enabled">On</div>
                                <div class="settings-column delete"></div>
                                <div class="settings-column reorder"></div>
                            </div>
                        </div>
                        <div id="settings-options-container">
                            <label>Lock bar: <input type="checkbox" id="lock-bar-checkbox"></label>
                            <label>Poll (s): <input type="number" id="polling-rate-input" style="width:60px;"></label>
                        </div>
                        <div id="settings-modal-footer" class="footer-button-row">
                            <button id="faction-fetch-button" class="modal-footer-button">Faction Fetch</button>
                            <button id="new-line-button" class="modal-footer-button">New Line</button>
                            <button id="disable-all-button" class="modal-footer-button">Disable All</button>
                            <button id="save-settings-button" class="modal-footer-button">Save</button>
                        </div>
                    </div>
                </div>
                <div id="api-management-view" style="display:none;">
                    <div id="settings-modal-header"><h2>API Key</h2><button id="back-to-settings-from-mgmt-button" class="modal-header-button">Back</button></div>
                    <p id="api-key-status"></p>
                    <div class="footer-button-row"><button id="change-api-key-button" class="modal-footer-button">Change</button><button id="delete-api-key-button" class="modal-footer-button">Delete</button></div>
                </div>
            </div>`;
        document.body.appendChild(modal);

        const showView = (v) => { [document.getElementById('api-key-view'), document.getElementById('main-settings-view'), document.getElementById('api-management-view')].forEach(div => div.style.display = 'none'); v.style.display = 'block'; };

        document.getElementById('settings-button').onclick = () => {
            const key = GM_getValue(API_KEY_STORAGE, null);
            if (!key) showView(document.getElementById('api-key-view'));
            else { 
                document.getElementById('polling-rate-input').value = GM_getValue(POLLING_RATE_STORAGE, '15');
                document.getElementById('lock-bar-checkbox').checked = GM_getValue(LOCK_BAR_KEY, false);
                loadSettings();
                showView(document.getElementById('main-settings-view')); 
            }
            modal.style.display = 'block';
        };

        modal.querySelector('.close-button').onclick = () => modal.style.display = 'none';

        document.getElementById('reorder-button').onclick = function() {
            const active = this.classList.toggle('active');
            this.textContent = active ? 'Lock' : 'Reorder';
            document.querySelectorAll('.reorder-controls').forEach(c => c.style.display = active ? 'flex' : 'none');
            if (active) updateArrowStates();
        };

        const parseStatVal = (s) => {
            if (!s || s === '-') return -1;
            const n = parseFloat(s);
            if (s.includes('b')) return n * 1e9;
            if (s.includes('m')) return n * 1e6;
            if (s.includes('k')) return n * 1e3;
            return n;
        };

        document.querySelectorAll('.sortable').forEach(h => h.onclick = () => {
            const col = h.dataset.sort;
            const rows = Array.from(document.querySelectorAll('.settings-row'));
            const dir = h.dataset.dir === 'asc' ? 'desc' : 'asc';
            h.dataset.dir = dir;
            rows.sort((a, b) => {
                let vA = col === 'username' ? a.querySelector('.username').value : parseStatVal(a.querySelector('.stats-display').textContent);
                let vB = col === 'username' ? b.querySelector('.username').value : parseStatVal(b.querySelector('.stats-display').textContent);
                return dir === 'asc' ? (vA > vB ? 1 : -1) : (vA < vB ? 1 : -1);
            });
            rows.forEach(r => document.getElementById('settings-rows').appendChild(r));
        });

        document.getElementById('faction-fetch-button').onclick = async () => {
            const key = GM_getValue(API_KEY_STORAGE, null);
            const fid = prompt("Faction ID:");
            if (!fid) return;
            const data = await fetchFromServer('faction', { apiKey: key, id: fid.trim() });
            if (data?.members) {
                const current = JSON.parse(GM_getValue(LIVE_DATA_KEY, '{}'));
                const memsArr = Array.isArray(data.members) ? data.members : Object.values(data.members);
                memsArr.forEach(m => {
                    current[m.id] = m;
                    createNewRow({ profileId: m.id, name: m.name, enabled: false, source: 'faction', stats: m.spy?.total || 0 });
                });
                GM_setValue(LIVE_DATA_KEY, JSON.stringify(current));
                GM_setValue(FACTION_ID_STORAGE, fid.trim());
                alert("Fetched. Click Save.");
            }
        };

        document.getElementById('save-api-key-button').onclick = async () => {
            const key = document.getElementById('api-key-input').value.trim();
            const data = await fetchFromServer('getFaction', { RL_ApiKey: key });
            if (data?.faction_id) {
                const acc = await fetchFromServer('checkAccess', { factionId: data.faction_id });
                if (acc?.access === 1) { GM_setValue(API_KEY_STORAGE, key); location.reload(); }
                else alert("Access denied.");
            } else alert("Invalid Key.");
        };

        document.getElementById('save-settings-button').onclick = saveSettings;
        document.getElementById('new-line-button').onclick = () => createNewRow({enabled: true});
        document.getElementById('toggle-bar-button').onclick = () => { const h = !GM_getValue(HIDE_BAR_KEY, false); GM_setValue(HIDE_BAR_KEY, h); updateBarVisibility(); };

        document.getElementById('player-search-input').oninput = function() {
            const s = this.value.toLowerCase();
            document.querySelectorAll('.settings-row').forEach(r => {
                const visible = r.querySelector('.profile-id').value.includes(s) || r.querySelector('.username').value.toLowerCase().includes(s);
                r.style.display = visible ? 'flex' : 'none';
            });
        };

        updateBarVisibility(); updateBarLockState();
        if (GM_getValue(API_KEY_STORAGE)) { forcePollAndUpdate(); startAllPolling(); }
    }

    const checkExist = setInterval(() => {
        if (document.querySelector('#mainContainer')) { clearInterval(checkExist); initializeUI(); }
    }, 500);
})();