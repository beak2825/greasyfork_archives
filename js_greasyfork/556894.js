// ==UserScript==
// @name         Torn - Ranked Wars Leaders + Faction Leader
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Pending ranked wars and faction leaders in Torn, with resize and visited factions tracking
// @author       SuperGogu[3580072]
// @match        https://www.torn.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556894/Torn%20-%20Ranked%20Wars%20Leaders%20%2B%20Faction%20Leader.user.js
// @updateURL https://update.greasyfork.org/scripts/556894/Torn%20-%20Ranked%20Wars%20Leaders%20%2B%20Faction%20Leader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const PANEL_STORAGE_KEY_X = 'rw_panel_x';
    const PANEL_STORAGE_KEY_Y = 'rw_panel_y';
    const PANEL_STORAGE_KEY_WIDTH = 'rw_panel_width';
    const PANEL_STORAGE_KEY_HEIGHT = 'rw_panel_height';
    const API_KEY_STORAGE_KEY = 'rw_api_key';
    const WARS_STORAGE_KEY = 'rw_cached_pending_wars';
    const FACTION_VISITED_KEY = 'rw_faction_visited';
    const LEADER_STORAGE_KEY = 'rw_last_leader';
    const PANEL_VISIBLE_KEY = 'rw_panel_visible';


    let visitedFactions = {};

    function init() {
        const savedX = GM_getValue(PANEL_STORAGE_KEY_X, 100);
        const savedY = GM_getValue(PANEL_STORAGE_KEY_Y, 100);
        const savedApiKey = GM_getValue(API_KEY_STORAGE_KEY, '');
        const savedWidth = GM_getValue(PANEL_STORAGE_KEY_WIDTH, 320);
        const savedHeight = GM_getValue(PANEL_STORAGE_KEY_HEIGHT, 0);
        const maxInitialHeight = Math.floor(window.innerHeight * 0.9);
        const effectiveSavedHeight = savedHeight > 0 ? Math.min(savedHeight, maxInitialHeight) : 400;
        const savedVisible = GM_getValue(PANEL_VISIBLE_KEY, true);



        try {
            const storedVisited = GM_getValue(FACTION_VISITED_KEY, '{}');
            visitedFactions = JSON.parse(storedVisited);
        } catch (e) {
            visitedFactions = {};
        }

        GM_addStyle(`
            #rw-panel {
                position: fixed;
                z-index: 99999;
                background: rgba(15, 15, 20, 0.95);
                color: #fff;
                border: 1px solid #555;
                border-radius: 6px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.6);
                width: ${savedWidth}px;
                height: ${effectiveSavedHeight}px;
                max-height: 90vh;
                min-width: 320px;
                min-height: 200px;

                font-family: Arial, sans-serif;
                font-size: 12px;
                top: ${savedY}px;
                left: ${savedX}px;
                resize: both;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }


            #rw-panel-header {
                cursor: move;
                padding: 6px 8px;
                background: #222;
                border-bottom: 1px solid #444;
                font-weight: bold;
                text-align: center;
                user-select: none;
            }
            #rw-panel-body {
                padding: 8px;
                flex: 1 1 auto;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }


            .rw-input-group {
                display: flex;
                gap: 4px;
                margin-bottom: 6px;
                align-items: center;
            }
            .rw-input-group label {
                flex: 0 0 auto;
                font-size: 11px;
            }
            #rw-api-key-input {
                flex: 1 1 auto;
                padding: 2px 4px;
                border-radius: 3px;
                border: 1px solid #555;
                background: #111;
                color: #fff;
            }
            .rw-button {
                padding: 3px 6px;
                border-radius: 3px;
                border: 1px solid #666;
                background: #333;
                color: #fff;
                font-size: 11px;
                cursor: pointer;
            }
            .rw-button:hover {
                background: #444;
            }
            #rw-status {
                min-height: 14px;
                font-size: 11px;
                margin-bottom: 6px;
                color: #ccc;
            }
            #rw-war-list {
                border: 1px solid #444;
                border-radius: 3px;
                padding: 4px;
                background: #111;
                overflow-y: auto;
                flex: 1 1 auto;
                min-height: 0;
            }


            .rw-row {
                padding: 2px 0;
                border-bottom: 1px solid #222;
                font-size: 11px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
            .rw-row:last-child {
                border-bottom: none;
            }
            .rw-faction-btn {
                display: inline-block;
                margin: 0 2px;
                padding: 1px 4px;
                border-radius: 3px;
                border: 1px solid #666;
                background: #333;
                color: #fff;
                font-size: 11px;
                cursor: pointer;
            }
            .rw-faction-btn:hover {
                background: #444;
            }
            .rw-faction-btn-visited {
                text-decoration: line-through;
                color: red;
            }
            #rw-faction-panel {
                position: fixed;
                z-index: 99999;
                background: rgba(15, 15, 20, 0.95);
                color: #fff;
                border: 1px solid #555;
                border-radius: 6px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.6);
                width: 220px;
                font-family: Arial, sans-serif;
                font-size: 12px;
            }
            #rw-faction-header {
                padding: 6px 8px;
                background: #222;
                border-bottom: 1px solid #444;
                font-weight: bold;
                text-align: center;
            }
            #rw-faction-body {
                padding: 8px;
            }
            #rw-faction-leader {
                font-size: 13px;
                font-weight: bold;
                text-align: center;
            }
            #rw-faction-leader a {
                color: #4ac3ff;
                text-decoration: none;
            }
            #rw-faction-leader a:hover {
                text-decoration: underline;
            }
        `);

        const panel = document.createElement('div');
        panel.id = 'rw-panel';
        panel.innerHTML = `
            <div id="rw-panel-header">Ranked Wars Leaders</div>
            <div id="rw-panel-body">
                <div class="rw-input-group">
                    <label for="rw-api-key-input">API key:</label>
                    <input type="text" id="rw-api-key-input" placeholder="Enter API key">
                </div>
                <div class="rw-input-group">
                    <button id="rw-save-key" class="rw-button">Save</button>
                    <button id="rw-retrieve" class="rw-button">Retrieve</button>
                    <button id="rw-reset" class="rw-button">Reset</button>
                </div>
                <div id="rw-status"></div>
                <div id="rw-war-list"></div>
            </div>
        `;
        document.body.appendChild(panel);

        const factionPanel = document.createElement('div');
        factionPanel.id = 'rw-faction-panel';
        factionPanel.innerHTML = `
            <div id="rw-faction-header">Faction Leader</div>
            <div id="rw-faction-body">
                <div id="rw-faction-leader">No leader selected.</div>
            </div>
        `;
        document.body.appendChild(factionPanel);

        if (!savedVisible) {
            panel.style.display = 'none';
            factionPanel.style.display = 'none';
        }


        const header = document.getElementById('rw-panel-header');
        const apiKeyInput = document.getElementById('rw-api-key-input');
        const saveButton = document.getElementById('rw-save-key');
        const retrieveButton = document.getElementById('rw-retrieve');
        const statusEl = document.getElementById('rw-status');
        const warListEl = document.getElementById('rw-war-list');
        const factionLeaderEl = document.getElementById('rw-faction-leader');
        const resetButton = document.getElementById('rw-reset');

        GM_registerMenuCommand('Show/Hide Ranked Wars panel', function() {
            const currentlyVisible = panel.style.display !== 'none';
            const newVisible = !currentlyVisible;
            panel.style.display = newVisible ? 'flex' : 'none';
            factionPanel.style.display = newVisible ? 'block' : 'none';
            GM_setValue(PANEL_VISIBLE_KEY, newVisible);
        });


        let lastLeader = null;
        try {
            const lastLeaderRaw = GM_getValue(LEADER_STORAGE_KEY, null);
            if (lastLeaderRaw) {
                lastLeader = JSON.parse(lastLeaderRaw);
            }
        } catch (e) {
            lastLeader = null;
        }

        if (lastLeader && lastLeader.id && lastLeader.name) {
            const url = 'https://www.torn.com/profiles.php?XID=' + lastLeader.id;
            factionLeaderEl.innerHTML = '<a href="' + url + '" target="_blank" rel="noopener noreferrer">' + lastLeader.name + '</a>';
        } else {
            factionLeaderEl.textContent = 'No leader selected.';
        }


        apiKeyInput.value = savedApiKey;

        function updateFactionPanelPosition() {
            const rect = panel.getBoundingClientRect();
            factionPanel.style.top = rect.top + 'px';
            factionPanel.style.left = (rect.right + 10) + 'px';
        }
        updateFactionPanelPosition();

GM_registerMenuCommand('Reset panel position (top-left)', function() {
    const margin = 10;
    panel.style.left = margin + 'px';
    panel.style.top = margin + 'px';
    GM_setValue(PANEL_STORAGE_KEY_X, margin);
    GM_setValue(PANEL_STORAGE_KEY_Y, margin);
    updateFactionPanelPosition();
});


        const resizeObserver = new ResizeObserver(function(entries) {
            for (const entry of entries) {
                const rect = entry.contentRect;
                const minWidth = 320;
                const minHeight = 200;
                let width = rect.width;
                let height = rect.height;
                if (width < minWidth) width = minWidth;
                if (height < minHeight) height = minHeight;
                GM_setValue(PANEL_STORAGE_KEY_WIDTH, Math.round(width));
                GM_setValue(PANEL_STORAGE_KEY_HEIGHT, Math.round(height));
            }
            updateFactionPanelPosition();
        });
        resizeObserver.observe(panel);

        let isDragging = false;
        let dragOffsetX = 0;
        let dragOffsetY = 0;

        header.addEventListener('mousedown', function(e) {
            isDragging = true;
            dragOffsetX = e.clientX - panel.offsetLeft;
            dragOffsetY = e.clientY - panel.offsetTop;
            e.preventDefault();
        });

        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            panel.style.left = (e.clientX - dragOffsetX) + 'px';
            panel.style.top = (e.clientY - dragOffsetY) + 'px';
            GM_setValue(PANEL_STORAGE_KEY_X, panel.offsetLeft);
            GM_setValue(PANEL_STORAGE_KEY_Y, panel.offsetTop);
            updateFactionPanelPosition();
        });

        document.addEventListener('mouseup', function() {
            if (!isDragging) return;
            isDragging = false;
        });

        saveButton.addEventListener('click', function() {
            const key = apiKeyInput.value.trim();
            if (!key) {
                statusEl.textContent = 'Please enter an API key before saving.';
                return;
            }
            GM_setValue(API_KEY_STORAGE_KEY, key);
            statusEl.textContent = 'API key saved.';
        });

        retrieveButton.addEventListener('click', function() {
            const key = apiKeyInput.value.trim() || GM_getValue(API_KEY_STORAGE_KEY, '');
            if (!key) {
                statusEl.textContent = 'No API key found. Enter it and click Save.';
                return;
            }
            GM_setValue(API_KEY_STORAGE_KEY, key);
            fetchRankedWars(key, statusEl, warListEl, factionLeaderEl);
        });

        resetButton.addEventListener('click', function() {
            visitedFactions = {};
            try {
                GM_setValue(FACTION_VISITED_KEY, JSON.stringify(visitedFactions));
            } catch (e) {}
            const buttons = document.querySelectorAll('.rw-faction-btn');
            buttons.forEach(function(btn) {
                btn.classList.remove('rw-faction-btn-visited');
            });
            statusEl.textContent = 'Visited factions reset.';
        });


        let cachedWars = null;
        try {
            const stored = GM_getValue(WARS_STORAGE_KEY, null);
            if (stored) {
                cachedWars = JSON.parse(stored);
            }
        } catch (e) {
            cachedWars = null;
        }

        if (cachedWars && Array.isArray(cachedWars) && cachedWars.length > 0) {
            renderWarList(cachedWars, warListEl, statusEl, factionLeaderEl);
            statusEl.textContent = 'List loaded from cache. Click "Retrieve" to refresh.';
        } else {
            warListEl.innerHTML = '<div class="rw-row">Click "Retrieve" to load ranked wars.</div>';
        }
    }

    function renderWarList(wars, warListEl, statusEl, factionLeaderEl) {
        if (!wars || wars.length === 0) {
            warListEl.innerHTML = '<div class="rw-row">No pending ranked wars.</div>';
            return;
        }

        warListEl.innerHTML = '';
        wars.forEach(function(w) {
            const row = document.createElement('div');
            row.className = 'rw-row';

            const label = document.createElement('span');
            label.textContent = 'War ' + w.id + ' ';
            row.appendChild(label);

            w.factions.forEach(function(faction, idx) {
                const btn = document.createElement('button');
                btn.className = 'rw-faction-btn';
                btn.textContent = faction.name;
                btn.dataset.factionId = faction.id;

                if (visitedFactions && visitedFactions[String(faction.id)]) {
                    btn.classList.add('rw-faction-btn-visited');
                }

                btn.addEventListener('click', function() {
                    const apiKey = GM_getValue(API_KEY_STORAGE_KEY, '');
                    if (!apiKey) {
                        statusEl.textContent = 'No API key found. Enter it and click Save.';
                        return;
                    }
                    fetchFactionLeader(
                        faction.id,
                        faction.name,
                        apiKey,
                        statusEl,
                        factionLeaderEl,
                        btn
                    );
                });

                row.appendChild(btn);

                if (idx === 0) {
                    const vsSpan = document.createElement('span');
                    vsSpan.textContent = ' vs ';
                    row.appendChild(vsSpan);
                }
            });

            warListEl.appendChild(row);
        });
    }

    function fetchRankedWars(apiKey, statusEl, warListEl, factionLeaderEl) {
        statusEl.textContent = 'Loading ranked wars...';
        warListEl.innerHTML = '';

        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://api.torn.com/torn/?selections=rankedwars&key=' + encodeURIComponent(apiKey),
            onload: function(response) {
                if (response.status !== 200) {
                    statusEl.textContent = 'HTTP error: ' + response.status;
                    return;
                }

                let data;
                try {
                    data = JSON.parse(response.responseText);
                } catch (e) {
                    statusEl.textContent = 'Error parsing response.';
                    return;
                }

                if (data.error) {
                    statusEl.textContent = 'API error: ' + (data.error.error || 'Unknown');
                    return;
                }

                const ranked = data.rankedwars || {};
                const now = Math.floor(Date.now() / 1000);
                const pendingWars = [];

                for (const [warId, warData] of Object.entries(ranked)) {
                    const factions = warData.factions || {};
                    const war = warData.war || {};

                    const factionEntries = Object.entries(factions);
                    if (factionEntries.length < 2) continue;

                    const [fId1, fData1] = factionEntries[0];
                    const [fId2, fData2] = factionEntries[1];

                    const scores = [
                        Number(fData1.score) || 0,
                        Number(fData2.score) || 0
                    ];

                    const allScoresZero = scores.every(function(s) { return s === 0; });
                    const notStarted = typeof war.start === 'number' && war.start > now;

                    if (allScoresZero || notStarted) {
                        pendingWars.push({
                            id: warId,
                            factions: [
                                { id: fId1, name: fData1.name || '', score: scores[0] },
                                { id: fId2, name: fData2.name || '', score: scores[1] }
                            ],
                            start: war.start || 0
                        });
                    }
                }

                pendingWars.sort(function(a, b) {
                    return a.start - b.start;
                });

                try {
                    GM_setValue(WARS_STORAGE_KEY, JSON.stringify(pendingWars));
                } catch (e) {}

                renderWarList(pendingWars, warListEl, statusEl, factionLeaderEl);

                statusEl.textContent = 'Done. Pending ranked wars loaded.';
            },
            onerror: function() {
                statusEl.textContent = 'Network error on ranked wars API call.';
            }
        });
    }

    function fetchFactionLeader(factionId, factionName, apiKey, statusEl, factionLeaderEl, buttonEl) {
        statusEl.textContent = 'Loading leader for ' + factionName + '...';
        factionLeaderEl.textContent = 'Loading...';

        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://api.torn.com/v2/faction/' + encodeURIComponent(factionId) +
                 '/members?striptags=true&key=' + encodeURIComponent(apiKey),
            onload: function(response) {
                if (response.status !== 200) {
                    statusEl.textContent = 'HTTP error (' + response.status + ') on faction members.';
                    return;
                }

                let data;
                try {
                    data = JSON.parse(response.responseText);
                } catch (e) {
                    statusEl.textContent = 'Error parsing faction members response.';
                    return;
                }

                if (data.error) {
                    statusEl.textContent = 'API error: ' + (data.error.error || 'Unknown');
                    return;
                }

                const members = data.members || [];
                const leader = members.find(function(m) { return m.position === 'Leader'; });

                if (!leader) {
                    factionLeaderEl.textContent = 'Leader for ' + factionName + ' not found.';
                } else {
                    const url = 'https://www.torn.com/profiles.php?XID=' + leader.id;
                    factionLeaderEl.innerHTML = '<a href="' + url + '" target="_blank" rel="noopener noreferrer">' + leader.name + '</a>';
                    try {
                        GM_setValue(LEADER_STORAGE_KEY, JSON.stringify({
                            id: leader.id,
                            name: leader.name,
                            factionName: factionName
                        }));
                    } catch (e) {}
                }


                visitedFactions[String(factionId)] = true;
                try {
                    GM_setValue(FACTION_VISITED_KEY, JSON.stringify(visitedFactions));
                } catch (e) {}

                if (buttonEl) {
                    buttonEl.classList.add('rw-faction-btn-visited');
                }

                statusEl.textContent = 'Leader loaded for ' + factionName + '.';
            },
            onerror: function() {
                statusEl.textContent = 'Network error on faction members API call.';
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
