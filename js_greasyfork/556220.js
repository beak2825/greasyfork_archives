// ==UserScript==
// @name         Torn Faction War Hit Tracker (War Hits Column)
// @namespace    http://tampermonkey.net/
// @version      4
// @description  Show faction member war hits against enemy faction in its own 'War Hits' column, with persistent date filter and white buttons
// @match        https://www.torn.com/factions.php*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/556220/Torn%20Faction%20War%20Hit%20Tracker%20%28War%20Hits%20Column%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556220/Torn%20Faction%20War%20Hit%20Tracker%20%28War%20Hits%20Column%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // -------------------------------
    // Section 1 – Header & Setup
    // -------------------------------

    let API_KEY = GM_getValue("torn_api_key", null);
    let FACTION_ID = GM_getValue("torn_faction_id", null);
    let ENEMY_FACTION_ID = GM_getValue("torn_enemy_faction_id", null);
    let startTime = GM_getValue("torn_start_time", null);
    const refreshInterval = 120000; // 2 minutes

    // Format faction IDs to numeric string
    function formatFactionId(id) {
        if (!id) return null;
        const clean = String(id).replace(/\D/g, '');
        return clean.length ? clean : null;
    }

    // Ensure credentials exist and are valid
    function ensureCredentials() {
        if (!API_KEY || API_KEY.trim() === "") {
            API_KEY = prompt("Enter your Torn API key:");
            if (API_KEY) GM_setValue("torn_api_key", API_KEY);
        }
        if (!FACTION_ID || !/^\d+$/.test(FACTION_ID)) {
            FACTION_ID = prompt("Enter your Faction ID (numbers only):");
            FACTION_ID = formatFactionId(FACTION_ID);
            if (FACTION_ID) GM_setValue("torn_faction_id", FACTION_ID);
        }
        if (!ENEMY_FACTION_ID || !/^\d+$/.test(ENEMY_FACTION_ID)) {
            ENEMY_FACTION_ID = prompt("Enter the Enemy Faction ID (numbers only):");
            ENEMY_FACTION_ID = formatFactionId(ENEMY_FACTION_ID);
            if (ENEMY_FACTION_ID) GM_setValue("torn_enemy_faction_id", ENEMY_FACTION_ID);
        }
    }
// -------------------------------
    // Section 2 – Controls
    // -------------------------------
    function createControls() {
        const header = document.querySelector('.content-title, .title-black');
        if (!header) return;

        const container = document.createElement('span');
        container.id = 'hitTrackerBox';
        container.style.marginLeft = '15px';
        container.style.background = '#222';
        container.style.color = '#fff';
        container.style.padding = '6px 10px';
        container.style.borderRadius = '6px';
        container.style.fontSize = '13px';

        // Helper to style all buttons consistently
        function styleButton(btn) {
            btn.style.marginRight = '5px';
            btn.style.fontSize = '12px';
            btn.style.background = '#444';
            btn.style.color = '#fff'; // white text
            btn.style.border = '1px solid #666';
            btn.style.borderRadius = '4px';
            btn.style.padding = '2px 6px';
            return btn;
        }

        const toggleBtn = styleButton(document.createElement('button'));
        toggleBtn.textContent = 'Tracker';
        toggleBtn.addEventListener('click', () => {
            const content = document.getElementById('trackerContent');
            if (content) {
                content.style.display = (content.style.display === 'none') ? 'inline-block' : 'none';
            }
        });

        const content = document.createElement('span');
        content.id = 'trackerContent';
        content.style.display = 'inline-block';
        content.style.marginLeft = '10px';

        const input = document.createElement('input');
        input.type = 'datetime-local';
        input.id = 'start-time-input';
        input.style.fontSize = '12px';
        input.style.marginRight = '5px';

        // preload stored start time if available
        if (startTime) {
            const dt = new Date(startTime * 1000);
            input.value = dt.toISOString().slice(0, 16);
        }

        const applyBtn = styleButton(document.createElement('button'));
        applyBtn.textContent = 'Apply';
        applyBtn.addEventListener('click', () => {
            const val = document.getElementById('start-time-input').value;
            if (val) {
                startTime = Math.floor(new Date(val).getTime() / 1000);
                GM_setValue("torn_start_time", startTime);
                fetchAttackData(displayHits);
            }
        });

        const resetBtn = styleButton(document.createElement('button'));
        resetBtn.textContent = 'Reset';
        resetBtn.addEventListener('click', () => {
            startTime = null;
            GM_setValue("torn_start_time", null);
            input.value = '';
            fetchAttackData(displayHits);
        });

        const credsBtn = styleButton(document.createElement('button'));
        credsBtn.textContent = 'Change Credentials';
        credsBtn.addEventListener('click', () => {
            GM_setValue("torn_api_key", null);
            GM_setValue("torn_faction_id", null);
            GM_setValue("torn_enemy_faction_id", null);
            API_KEY = null;
            FACTION_ID = null;
            ENEMY_FACTION_ID = null;
            ensureCredentials();
            fetchAttackData(displayHits);
        });

        content.appendChild(input);
        content.appendChild(applyBtn);
        content.appendChild(resetBtn);
        content.appendChild(credsBtn);

        container.appendChild(toggleBtn);
        container.appendChild(content);
        header.appendChild(container);
    }
// -------------------------------
    // Section 3 – Fetch Logic (Respect Tracking)
    // -------------------------------
    function fetchAttackData(callback) {
        if (!API_KEY || !FACTION_ID || !ENEMY_FACTION_ID) return;

        const url = `https://api.torn.com/faction/${FACTION_ID}?selections=attacks&key=${API_KEY}`;
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                let data = {};
                try {
                    data = JSON.parse(response.responseText);
                } catch (e) {
                    alert("Failed to parse Torn API response.");
                    return;
                }

                // Invalid API key
                if (data.error && data.error.code === 2) {
                    alert("Your API key is invalid or expired. Please enter a new one.");
                    API_KEY = prompt("Enter your new Torn API key:");
                    if (API_KEY) GM_setValue("torn_api_key", API_KEY);
                    return;
                }

                const respectCounts = {};

                if (data.attacks) {
                    for (const attack of Object.values(data.attacks)) {
                        // Only count attacks by your faction against the enemy faction
                        if (attack.attacker_faction == FACTION_ID &&
                            attack.defender_faction == ENEMY_FACTION_ID) {

                            if (startTime && attack.timestamp_started < startTime) continue;

                            const id = attack.attacker_id;
                            const respect = attack.respect_gain || 0;

                            // Sum respect gained per member
                            respectCounts[id] = (respectCounts[id] || 0) + respect;
                        }
                    }
                }

                callback(respectCounts);
            }
        });
    }
// -------------------------------
    // Section 4 – Display (Respect Column)
    // -------------------------------
    function addRespectColumnHeader() {
        const headerRow = document.querySelector('.members-list .table-header, .members-list .table-row.header');
        if (headerRow && !headerRow.querySelector('.respect-col-header')) {
            const respectHeader = document.createElement('div');
            respectHeader.className = 'respect-col-header';
            respectHeader.style.minWidth = '60px';
            respectHeader.style.flex = '0 1 auto';
            respectHeader.style.fontWeight = 'bold';
            respectHeader.style.textAlign = 'right';
            respectHeader.textContent = 'Respect';
            headerRow.appendChild(respectHeader);
        }
    }

    function ensureRowRespectCell(row) {
        let respectCell = row.querySelector('.respect-col');
        if (!respectCell) {
            respectCell = document.createElement('div');
            respectCell.className = 'respect-col';
            respectCell.style.minWidth = '60px';
            respectCell.style.flex = '0 1 auto';
            respectCell.style.textAlign = 'right';
            respectCell.style.fontWeight = 'bold';
            row.appendChild(respectCell);
        }
        return respectCell;
    }

    function displayRespect(respectCounts) {
        addRespectColumnHeader();
        const memberRows = document.querySelectorAll('.members-list .table-row:not(.header), .members-list li');
        memberRows.forEach(row => {
            const profileLink = row.querySelector('a[href*="profiles.php"]');
            if (!profileLink) return;
            const match = profileLink.href.match(/XID=(\d+)/);
            if (!match) return;
            const userId = match[1];
            const respectCell = ensureRowRespectCell(row);
            const respect = respectCounts[userId] || 0;
            respectCell.textContent = respect.toFixed(1); // show respect with one decimal
            respectCell.style.color = respect > 0 ? 'green' : 'red';
        });
    }
// -------------------------------
    // Section 5 – Init & Closing
    // -------------------------------
    function init() {
        ensureCredentials();
        FACTION_ID = formatFactionId(FACTION_ID);
        ENEMY_FACTION_ID = formatFactionId(ENEMY_FACTION_ID);
        if (!API_KEY || !FACTION_ID || !ENEMY_FACTION_ID) {
            alert("API key, Faction ID, and Enemy Faction ID are required.");
            return;
        }
        createControls();
        fetchAttackData(displayHits);
        setInterval(() => fetchAttackData(displayHits), refreshInterval);
    }

    // Wait until the faction page header is loaded, then initialize
    const checkInterval = setInterval(() => {
        if (document.querySelector('.content-title, .title-black')) {
            clearInterval(checkInterval);
            init();
        }
    }, 1000);

})(); 