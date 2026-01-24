// ==UserScript==
// @name         Torn War Matchmaking
// @namespace    http://tampermonkey.net/
// @version      1.9.2
// @description  Integrate with WarMatchmaking API with a polished Torn-style UI - Enhanced Notifications
// @author       You
// @match        https://www.torn.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_notification
// @connect      tornbazaar.com
// @connect      api.torn.com
// @connect      ffscouter.com
// @exclude      https://www.torn.com/swagger.php*
// @exclude      https://www.torn.com/api.html
// @downloadURL https://update.greasyfork.org/scripts/563798/Torn%20War%20Matchmaking.user.js
// @updateURL https://update.greasyfork.org/scripts/563798/Torn%20War%20Matchmaking.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Helper function for a robust JS-based shake
    function jsShake(element) {
        if (!element) return;
        const originalTransition = element.style.transition;
        const originalTransform = element.style.transform;
        const intensity = 5;
        const frames = [
            `translateX(-${intensity}px)`,
            `translateX(${intensity}px)`,
            `translateX(-${intensity}px)`,
            `translateX(${intensity}px)`,
            `translateX(0)`
        ];
        
        element.style.transition = 'transform 0.1s ease-in-out';
        
        let i = 0;
        const interval = setInterval(() => {
            element.style.transform = frames[i];
            i++;
            if (i >= frames.length) {
                clearInterval(interval);
                setTimeout(() => {
                    element.style.transition = originalTransition;
                    element.style.transform = originalTransform;
                }, 100);
            }
        }, 80);
    }

    // --- Enhanced Torn-Style UI ---
    GM_addStyle(`
        #matchmaking-container {
            position: fixed;
            top: ${GM_getValue('mm_pos_top', '120px')};
            left: ${GM_getValue('mm_pos_left', 'unset')};
            right: ${GM_getValue('mm_pos_left') ? 'unset' : '20px'};
            width: 320px;
            background: #222;
            color: #ccc;
            z-index: 999999;
            border: 1px solid #000;
            border-radius: 5px;
            box-shadow: 0 0 15px rgba(0,0,0,0.8);
            font-family: Arial, sans-serif;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            min-height: 34px;
            will-change: transform; /* Hint for browser performance */
        }

        #matchmaking-container.minimized {
            height: 34px !important;
        }

        .mm-header {
            background: linear-gradient(180deg, #444 0%, #222 100%);
            height: 34px;
            padding: 0 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #000;
            cursor: move;
            user-select: none;
            flex-shrink: 0;
        }
        .mm-title {
            color: #fff;
            font-weight: bold;
            font-size: 13px;
            text-shadow: 1px 1px #000;
            text-transform: uppercase;
            pointer-events: none;
        }

        .mm-content {
            background: #333;
            max-height: 500px;
            overflow-y: auto;
            padding: 8px;
            scrollbar-width: thin;
            scrollbar-color: #555 #333;
        }

        .mm-target-card {
            background: linear-gradient(180deg, #444 0%, #333 100%);
            border: 1px solid #555;
            border-radius: 3px;
            padding: 10px;
            margin-bottom: 8px;
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
        }
        .mm-player-line {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #222;
            padding-bottom: 5px;
            margin-bottom: 8px;
            align-items: center;
        }
        .mm-name {
            color: #fff;
            font-weight: bold;
            text-decoration: none;
            font-size: 14px;
        }
        .mm-name:hover { color: #aaa; }

        .mm-stats-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4px;
            font-size: 12px;
        }
        .mm-stat-item {
            background: rgba(0,0,0,0.3);
            padding: 5px 8px;
            border-radius: 2px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .mm-stat-label { color: #888; font-weight: bold; }
        .mm-stat-val { color: #fff; font-weight: bold; }

        .mm-btn {
            background: linear-gradient(180deg, #666 0%, #444 100%);
            border: 1px solid #000;
            color: #fff;
            padding: 3px 10px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 11px;
            text-shadow: 1px 1px #000;
            transition: filter 0.1s;
        }
        .mm-btn:hover { filter: brightness(1.1); }
        .mm-btn-primary {
            background: linear-gradient(180deg, #8cb82b 0%, #5d7a1c 100%);
            border-color: #3e5213;
        }
        .mm-btn-danger {
            background: linear-gradient(180deg, #e34c4c 0%, #a62a2a 100%);
            border-color: #6e1c1c;
            transition: background 0.3s, border-color 0.3s, transform 0.2s;
        }
        /* Shake CSS removed in favour of JS implementation for compatibility */

        .mm-btn-complete {
            width: 100%;
            margin-top: 10px;
            height: 30px;
            font-weight: bold;
            font-size: 13px;
        }

        .mm-state-tag {
            font-size: 10px;
            padding: 2px 6px;
            border-radius: 2px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .mm-state-okay { background: #5d7a1c; color: #fff; border: 1px solid #3e5213; }
        .mm-state-hosp { background: #a62a2a; color: #fff; border: 1px solid #6e1c1c; }

        #mm-footer {
            background: #222;
            padding: 6px 10px;
            border-top: 1px solid #000;
            font-size: 10px;
            color: #777;
            text-align: right;
        }

        .mm-input {
            background: #111;
            border: 1px solid #444;
            color: #ccc;
            padding: 5px;
            width: calc(100% - 12px);
            margin-top: 4px;
            border-radius: 2px;
            font-size: 12px;
        }
    `);

    const API_URL = 'https://tornbazaar.com/api/join';
    const POLL_INTERVAL = 10000;

    let pollIntervalId = null;
    let cachedMemberId = GM_getValue('member_id');
    let lastUpdatedAt = null;

    function fetchFFScouterStatsBatched(apiKey, playerIds, callback) {
        const batchSize = 50;
        let allStats = {};
        let completed = 0;
        if (playerIds.length === 0) return callback({});
        const totalBatches = Math.ceil(playerIds.length / batchSize);

        for (let i = 0; i < playerIds.length; i += batchSize) {
            const batch = playerIds.slice(i, i + batchSize);
            const idsStr = batch.join(',');
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://ffscouter.com/api/v1/get-stats?key=${apiKey}&targets=${idsStr}`,
                onload: (res) => {
                    if (res.status === 200) {
                        JSON.parse(res.responseText).forEach(item => {
                            allStats[item.player_id] = {
                                fair_fight: item.fair_fight,
                                bs_estimate: item.bs_estimate,
                                bs_estimate_human: item.bs_estimate_human,
                                ff_last_updated: item.last_updated
                            };
                        });
                    }
                    if (++completed === totalBatches) callback(allStats);
                },
                onerror: () => { if (++completed === totalBatches) callback(allStats); }
            });
        }
    }

    function fetchTornFactionMembers(tornApiKey, factionId, callback) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://api.torn.com/faction/${factionId}?selections=basic&key=${tornApiKey}`,
            onload: (res) => {
                if (res.status === 200) {
                    const data = JSON.parse(res.responseText);
                    callback(Object.entries(data.members || {}).map(([id, info]) => ({
                        player_id: parseInt(id),
                        name: info.name,
                        level: info.level
                    })));
                }
            }
        });
    }

    function getUserDetailsTorn(cb) {
        let ffscouterApiKey = GM_getValue('ffscouter_api_key');
        if (!ffscouterApiKey) return;

        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://api.torn.com/v2/user/profile?striptags=true',
            headers: { 'Authorization': 'ApiKey ' + ffscouterApiKey },
            onload: (res) => {
                if (res.status === 200) {
                    const profile = JSON.parse(res.responseText).profile;
                    const now = Math.floor(Date.now() / 1000);
                    const until = profile.status?.until || 0;
                    const userDetails = {
                        player_id: profile.id,
                        name: profile.name,
                        level: profile.level,
                        state: profile.status.state,
                        until: until,
                        faction_id: profile.faction_id,
                        status: profile.last_action.status,
                        last_active_ts: profile.last_action.timestamp,
                        remaining: until ? Math.max(until - now, 0) : 0
                    };
                    cachedMemberId = userDetails.player_id;
                    GM_setValue('member_id', cachedMemberId);
                    cb(userDetails);
                }
            }
        });
    }

    function makeDraggable(el, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        handle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            if (e.target.tagName === 'BUTTON') return;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            let newTop = (el.offsetTop - pos2);
            let newLeft = (el.offsetLeft - pos1);

            newTop = Math.max(0, Math.min(newTop, window.innerHeight - 34));
            newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - 320));

            el.style.top = newTop + "px";
            el.style.left = newLeft + "px";
            el.style.right = "unset";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
            GM_setValue('mm_pos_top', el.style.top);
            GM_setValue('mm_pos_left', el.style.left);
        }
    }

    function ensureContainer() {
        let container = document.getElementById('matchmaking-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'matchmaking-container';
            container.innerHTML = `
                <div class="mm-header" id="mm-drag-handle">
                    <span class="mm-title">War Matchmaker</span>
                    <div style="display:flex; gap:4px;">
                        <button id="mm-collapse-btn" class="mm-btn" title="Minimise">_</button>
                        <button id="mm-settings-btn" class="mm-btn" title="Settings">⚙</button>
                    </div>
                </div>
                <div id="mm-settings-panel" style="display:none; background:#222; border-bottom:1px solid #000; padding:10px;">
                    <div style="font-weight:bold; font-size:11px; margin-bottom:5px; color:#fff;">CONFIGURATION</div>
                    <label style="font-size:11px;">FFScouter / Torn API Key:
                    <input id="mm-ffscouter-key" class="mm-input" type="text" autocomplete="off" />
                    </label>
                    <label style="font-size:11px; margin-top:5px; display:block;">Matchmaking Token:
                    <input id="mm-token" class="mm-input" type="text" autocomplete="off" />
                    </label>
                    <label style="font-size:11px; margin-top:5px; display:block;">Enemy Faction ID:
                    <input id="mm-enemy-id" class="mm-input" type="text" autocomplete="off" />
                    </label>
                    <label style="font-size:11px; margin-top:5px; display:block;">
                    <input id="mm-enable-notify" type="checkbox" style="vertical-align:middle; margin-right:4px;" />
                    Enable Browser Notifications
                    </label>
                    <div style="margin-top:10px; display:flex; gap:5px;">
                        <button id="mm-save-settings" class="mm-btn mm-btn-primary" style="flex:1;">Save</button>
                        <button id="mm-clear-settings" class="mm-btn mm-btn-danger">Reset</button>
                    </div>
                </div>
                <div id="mm-controls-bar" class="mm-header" style="background:#111; height:34px; border-top:1px solid #333; cursor:default;">
                     <button id="mm-main-btn" class="mm-btn mm-btn-primary">Start</button>
                     <div style="display:flex; gap:4px;">
                        <button id="mm-refresh-btn" class="mm-btn" title="Refresh">⟳</button>
                        <button id="mm-exit-btn" class="mm-btn mm-btn-danger" style="display:none;">Leave</button>
                     </div>
                </div>
                <div id="mm-content-area" class="mm-content">
                    <p style="text-align:center; color:#666; font-size:12px; padding:20px;">Inactive</p>
                </div>
                <div id="mm-footer">Not connected</div>
            `;
            document.body.appendChild(container);

            makeDraggable(container, document.getElementById('mm-drag-handle'));

            document.getElementById('mm-main-btn').onclick = startMatchmaking;
            document.getElementById('mm-refresh-btn').onclick = () => fetchAssignedTargets(true);
            document.getElementById('mm-exit-btn').onclick = exitMatchmaking;


            document.getElementById('mm-settings-btn').onclick = () => {
                const panel = document.getElementById('mm-settings-panel');
                panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
                document.getElementById('mm-ffscouter-key').value = GM_getValue('ffscouter_api_key') || '';
                document.getElementById('mm-token').value = GM_getValue('custom_token') || '';
                document.getElementById('mm-enemy-id').value = GM_getValue('enemy_faction_id') || '';
                document.getElementById('mm-enable-notify').checked = GM_getValue('mm_enable_notify', false);
            };

            document.getElementById('mm-save-settings').onclick = () => {
                GM_setValue('ffscouter_api_key', document.getElementById('mm-ffscouter-key').value.trim());
                GM_setValue('custom_token', document.getElementById('mm-token').value.trim());
                GM_setValue('enemy_faction_id', document.getElementById('mm-enemy-id').value.trim());
                GM_setValue('mm_enable_notify', document.getElementById('mm-enable-notify').checked);
                document.getElementById('mm-settings-panel').style.display = 'none';
                if (document.getElementById('mm-enable-notify').checked && Notification.permission !== 'granted') {
                    Notification.requestPermission();
                }
            };

            document.getElementById('mm-clear-settings').onclick = () => {
                const btn = document.getElementById('mm-clear-settings');
                if (!btn._resetConfirm) {
                    btn._resetConfirm = true;
                    btn.textContent = 'Confirm Reset';
                    jsShake(btn); // Replaced CSS class with JS function call
                    btn.style.background = 'linear-gradient(180deg, #ff7b7b 0%, #e34c4c 100%)';
                    btn.style.borderColor = '#ff7b7b';
                    btn._resetTimeout = setTimeout(() => {
                        btn._resetConfirm = false;
                        btn.textContent = 'Reset';
                        btn.style.background = '';
                        btn.style.borderColor = '';
                    }, 4000);
                } else {
                    clearTimeout(btn._resetTimeout);
                    btn._resetConfirm = false;
                    btn.textContent = 'Reset';
                    btn.style.background = '';
                    btn.style.borderColor = '';
                    jsShake(btn); // Replaced CSS class with JS function call
                    ['ffscouter_api_key', 'enemy_faction_id', 'custom_token', 'mm_joined'].forEach(k => GM_setValue(k, ''));
                    resetUI();
                    document.getElementById('mm-settings-panel').style.display = 'none';
                }
            };

            const collapseBtn = document.getElementById('mm-collapse-btn');
            let isMinimized = GM_getValue('mm_minimized', false);

            const updateMinimizeUI = (mini) => {
                if (mini) {
                    container.classList.add('minimized');
                    collapseBtn.textContent = '+';
                } else {
                    container.classList.remove('minimized');
                    collapseBtn.textContent = '_';
                }
            };

            collapseBtn.onclick = () => {
                isMinimized = !isMinimized;
                GM_setValue('mm_minimized', isMinimized);
                updateMinimizeUI(isMinimized);
            };
            updateMinimizeUI(isMinimized);
        }
        return container;
    }

    function resetUI() {
        if (pollIntervalId) clearInterval(pollIntervalId);
        clearAllTargetIntervals();
        lastHospState = {};
        lastAssignmentIds = new Set();
        notifiedAssignmentIds = new Set();
        saveAssignmentCache();
        saveNotifiedAssignmentIds();
        const content = document.getElementById('mm-content-area');
        if (content) content.innerHTML = '<p style="text-align:center; color:#666; font-size:12px; padding:20px;">Inactive</p>';
        const btn = document.getElementById('mm-main-btn');
        if (btn) {
            btn.textContent = 'Start';
            btn.disabled = false;
        }
        document.getElementById('mm-exit-btn').style.display = 'none';
        document.getElementById('mm-footer').textContent = 'Not connected';
        GM_setValue('mm_joined', false);
    }

    let mm_hosp_intervals = [];
    let mm_expiry_intervals = [];

    function clearAllTargetIntervals() {
        mm_hosp_intervals.forEach(clearInterval);
        mm_expiry_intervals.forEach(clearInterval);
        mm_hosp_intervals = [];
        mm_expiry_intervals = [];
    }

    let lastHospState = {};
    let lastAssignmentIds = new Set();
    function loadAssignmentCache() {
        try {
            const arr = GM_getValue('mm_last_assignment_ids', '[]');
            lastAssignmentIds = new Set(JSON.parse(arr));
            const hosp = GM_getValue('mm_last_hosp_state', '{}');
            lastHospState = JSON.parse(hosp);
        } catch (e) {
            lastAssignmentIds = new Set();
            lastHospState = {};
        }
    }
    function saveAssignmentCache() {
        try {
            GM_setValue('mm_last_assignment_ids', JSON.stringify(Array.from(lastAssignmentIds)));
            GM_setValue('mm_last_hosp_state', JSON.stringify(lastHospState));
        } catch (e) {}
    }
    loadAssignmentCache();

    let notifiedAssignmentIds = new Set();
    function loadNotifiedAssignmentIds() {
        try {
            const arr = GM_getValue('mm_notified_assignment_ids', '[]');
            notifiedAssignmentIds = new Set(JSON.parse(arr));
        } catch (e) {
            notifiedAssignmentIds = new Set();
        }
    }
    function saveNotifiedAssignmentIds() {
        try {
            GM_setValue('mm_notified_assignment_ids', JSON.stringify(Array.from(notifiedAssignmentIds)));
        } catch (e) {}
    }
    loadNotifiedAssignmentIds();

    function notifyAvailableTargets(targets) {
        if (!GM_getValue('mm_enable_notify', false)) return;
        if (!Array.isArray(targets) || targets.length === 0) return;

        const currentAssignmentIds = new Set();
        let changed = false;

        targets.forEach(t => {
            const enemy = t.enemy || t;
            const assignmentId = t.assignment_id || t.id || `pid_${enemy.player_id}`;
            currentAssignmentIds.add(assignmentId);

            const isOkay = (enemy.state === 'Okay');
            const isAvailable = isOkay && (enemy.remaining === 0 || !enemy.remaining);

            const isNew = !lastAssignmentIds.has(assignmentId);
            const wasInHosp = lastHospState[assignmentId] === true;

            if (isAvailable && (isNew || wasInHosp)) {
                if (!notifiedAssignmentIds.has(assignmentId)) {
                    showNotification(enemy, t);
                    notifiedAssignmentIds.add(assignmentId);
                    changed = true;
                }
            }

            lastHospState[assignmentId] = !isAvailable;
        });

        let removed = false;
        notifiedAssignmentIds.forEach(aid => {
            if (!currentAssignmentIds.has(aid)) {
                notifiedAssignmentIds.delete(aid);
                removed = true;
            }
        });

        if (changed || removed) {
            saveNotifiedAssignmentIds();
            lastAssignmentIds = currentAssignmentIds;
            saveAssignmentCache();
        }
    }

    function showNotification(enemy, assignment) {
        let stats = enemy.stats || {};
        let ff = stats.fair_fight ?? 'N/A';
        let title = `Target Okay: ${enemy.name} (FF: ${ff})`;
        let body = `BS: ${stats.bs_estimate_human ?? 'N/A'} | Click to Attack.`;
        
        if (typeof GM_notification === 'function') {
            GM_notification({
                title: title,
                text: body,
                highlight: false,
                image: 'https://www.torn.com/favicon.ico',
                timeout: 8000,
                onclick: function() {
                    window.open(`https://www.torn.com/loader.php?sid=attack&user2ID=${enemy.player_id}`, '_blank');
                }
            });
        }
    }

    function displayTargets(targets) {
        const content = document.getElementById('mm-content-area');
        if (!content) return;

        clearAllTargetIntervals();

        if (!targets || targets.length === 0) {
            content.innerHTML = '<p style="text-align:center; color:#888; padding:20px; font-size:12px;">No targets.</p>';
        } else {
            content.innerHTML = '';
            const now = Math.floor(Date.now() / 1000);
            targets.forEach((t, idx) => {
                const enemy = t.enemy || t;
                const stats = enemy.stats || {};
                const remaining = enemy.remaining ?? 0;
                const stateClass = (enemy.state === 'Okay' || enemy.state === 'Traveling' || enemy.state === 'Abroad') ? 'mm-state-okay' : 'mm-state-hosp';

                let expiresAt = t.expires_at || t.expiry || null;

                const card = document.createElement('div');
                card.className = 'mm-target-card';
                card.id = `mm-card-${enemy.player_id}`;
                card.innerHTML = `
                    <div class="mm-player-line">
                        <a href="/profiles.php?XID=${enemy.player_id}" target="_blank" class="mm-name">${enemy.name} [${enemy.player_id}]</a>
                        <span class="mm-state-tag ${stateClass}">${enemy.state}</span>
                    </div>
                    <div class="mm-stats-grid">
                        <div class="mm-stat-item"><span class="mm-stat-label">FF</span><span class="mm-stat-val" style="color:#f6f;">${stats.fair_fight ?? 'N/A'}</span></div>
                        <div class="mm-stat-item"><span class="mm-stat-label">BS</span><span class="mm-stat-val" style="color:#f6f;" title="${stats.ff_last_updated ? 'Last updated: ' + new Date(stats.ff_last_updated * 1000).toLocaleString() : ''}">${stats.bs_estimate_human ?? 'N/A'}</span></div>
                        <div class="mm-stat-item"><span class="mm-stat-label">Res</span><span class="mm-stat-val" style="color:#8cb82b;">${stats.respect ?? 'N/A'}</span></div>
                        <div class="mm-stat-item"><span class="mm-stat-label">Hosp</span><span class="mm-stat-val" id="mm-timer-${idx}">${formatTime(remaining)}</span></div>
                        <div class="mm-stat-item" style="background:#5c1a1a;"><a href="/loader.php?sid=attack&user2ID=${enemy.player_id}" target="_blank" style="color:#fff; text-decoration:none; font-weight:bold; width:100%; text-align:center;">ATTACK</a></div>
                    </div>
                    <div style="font-size:10px; color:#aaa; margin-top:8px; text-align:center;">
                        Assignment: <span id="mm-expire-timer-${idx}">${expiresAt ? formatTime(expiresAt - now) : '--:--'}</span>
                    </div>
                    <button class="mm-btn mm-btn-primary mm-btn-complete" id="mm-comp-${enemy.player_id}">Mark as Finished</button>
                `;
                content.appendChild(card);

                if (remaining > 0) {
                    let sec = remaining;
                    const int = setInterval(() => {
                        sec--;
                        const el = document.getElementById(`mm-timer-${idx}`);
                        if(el) el.textContent = formatTime(sec);
                        if (sec <= 0) {
                            clearInterval(int);
                            fetchAssignedTargets(); 
                        }
                    }, 1000);
                    mm_hosp_intervals.push(int);
                }

                if (expiresAt) {
                    let exSec = expiresAt - now;
                    const exInt = setInterval(() => {
                        exSec--;
                        const el = document.getElementById(`mm-expire-timer-${idx}`);
                        if(el) el.textContent = formatTime(exSec);
                        if (exSec <= 0) clearInterval(exInt);
                    }, 1000);
                    mm_expiry_intervals.push(exInt);
                }

                card.querySelector(`#mm-comp-${enemy.player_id}`).onclick = () => markTargetComplete(enemy.player_id);
            });
            notifyAvailableTargets(targets);
        }

        const foot = document.getElementById('mm-footer');
        if (foot && lastUpdatedAt) {
            foot.textContent = `Synced: ${new Date(lastUpdatedAt).toLocaleTimeString()}`;
        }
    }

    function formatTime(sec) {
        if (sec <= 0) return '0:00';
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    }

    function fetchAssignedTargets(force) {
        if (!cachedMemberId) return;
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://tornbazaar.com/api/targets/${cachedMemberId}`,
            headers: { 'X-API-Token': GM_getValue('custom_token') },
            onload: (res) => {
                if (res.status === 200) {
                    lastUpdatedAt = Date.now();
                    let data = {};
                    try { data = JSON.parse(res.responseText); } catch (e) {}
                    if (data.kicked) {
                        resetUI();
                        return;
                    }
                    const assignments = Array.isArray(data.assignments) ? data.assignments : [];
                    displayTargets(assignments);
                    document.getElementById('mm-exit-btn').style.display = 'inline-block';
                    GM_setValue('mm_joined', true);
                }
            }
        });
    }

    function exitMatchmaking() {
        if (!cachedMemberId) return;
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://tornbazaar.com/api/remove',
            data: JSON.stringify({ member_id: cachedMemberId }),
            headers: {
                'Content-Type': 'application/json',
                'X-API-Token': GM_getValue('custom_token')
            },
            onload: () => {
                resetUI();
            }
        });
    }

    function markTargetComplete(enemyId) {
        const card = document.getElementById(`mm-card-${enemyId}`);
        if (card) card.style.opacity = '0.5';
        
        let changed = false;
        notifiedAssignmentIds.forEach(aid => {
            if (aid.endsWith(enemyId.toString())) {
                notifiedAssignmentIds.delete(aid);
                changed = true;
            }
        });
        if (changed) saveNotifiedAssignmentIds();

        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://tornbazaar.com/api/complete',
            data: JSON.stringify({ member_id: cachedMemberId, enemy_id: enemyId }),
            headers: {
                'Content-Type': 'application/json',
                'X-API-Token': GM_getValue('custom_token')
            },
            onload: () => {
                if (card) card.remove();
                fetchAssignedTargets();
            }
        });
    }

    function startMatchmaking() {
        const token = GM_getValue('custom_token');
        const ffKey = GM_getValue('ffscouter_api_key');
        const enemyId = GM_getValue('enemy_faction_id');

        if (!token || !ffKey || !enemyId) {
            document.getElementById('mm-settings-panel').style.display = 'block';
            return;
        }

        const btn = document.getElementById('mm-main-btn');
        btn.textContent = '...';
        btn.disabled = true;

        getUserDetailsTorn(user => {
            fetchTornFactionMembers(ffKey, enemyId, members => {
                const pIds = members.map(m => m.player_id);
                fetchFFScouterStatsBatched(ffKey, pIds, ffStats => {
                    const enemies = {};
                    members.forEach(m => {
                        const ffObj = ffStats[m.player_id] || {};
                        enemies[m.player_id] = {
                            fair_fight: ffObj.fair_fight ?? null,
                            bs_estimate: ffObj.bs_estimate ?? null,
                            bs_estimate_human: ffObj.bs_estimate_human ?? null,
                            ff_last_updated: ffObj.ff_last_updated ?? null
                        };
                    });
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: API_URL,
                        data: JSON.stringify({ member: user, enemies: enemies, enemy_faction_id: parseInt(enemyId) }),
                        headers: {
                            'Content-Type': 'application/json',
                            'X-API-Token': GM_getValue('custom_token')
                        },
                        onload: (res) => {
                            btn.textContent = 'Active';
                            btn.disabled = true;
                            fetchAssignedTargets();
                            if (pollIntervalId) clearInterval(pollIntervalId);
                            pollIntervalId = setInterval(fetchAssignedTargets, POLL_INTERVAL);
                            document.getElementById('mm-exit-btn').style.display = 'inline-block';
                            GM_setValue('mm_joined', true);
                        }
                    });
                });
            });
        });
    }

    window.addEventListener('load', () => {
        ensureContainer();
        if (GM_getValue('mm_joined')) {
            const btn = document.getElementById('mm-main-btn');
            if (btn) {
                btn.textContent = 'Active';
                btn.disabled = true;
            }
            fetchAssignedTargets();
            pollIntervalId = setInterval(fetchAssignedTargets, POLL_INTERVAL);
        }
    });
})();