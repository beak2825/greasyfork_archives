// ==UserScript==
// @name         Race Optimizer
// @namespace    race-optimizer.zero.nao
// @version      1.1
// @description  Race Optimizations - Blocks buildrace.js and displays custom race results
// @author       nao [2669774]
// @match        https://www.torn.com/page.php?sid=racing*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/562968/Race%20Optimizer.user.js
// @updateURL https://update.greasyfork.org/scripts/562968/Race%20Optimizer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ===== CONFIGURATION =====
    let API_KEY = GM_getValue('apiKey', '');
    let currentRaceResults = null; // Store results for button actions

    // ===== CACHING =====
    const RACING_SKILL_CACHE_KEY = 'racingSkillCache';
    const CACHE_EXPIRY_MS = 14 * 24 * 60 * 60 * 1000; // 2 weeks

    let current_user = null;

    function getRacingSkillCache() {
        try {
            const cache = localStorage.getItem(RACING_SKILL_CACHE_KEY);
            return cache ? JSON.parse(cache) : {};
        } catch (e) {
            console.error('Failed to parse racing skill cache:', e);
            return {};
        }
    }

    function saveRacingSkillCache(cache) {
        try {
            localStorage.setItem(RACING_SKILL_CACHE_KEY, JSON.stringify(cache));
        } catch (e) {
            console.error('Failed to save racing skill cache:', e);
        }
    }

    function getCachedRacingSkill(userId) {
        const cache = getRacingSkillCache();
        const entry = cache[userId];
        if (!entry) return null;

        const now = Date.now();
        if (now - entry.timestamp > CACHE_EXPIRY_MS) {
            delete cache[userId];
            saveRacingSkillCache(cache);
            return null;
        }
        return entry.skill;
    }

    function setCachedRacingSkill(userId, skill) {
        const cache = getRacingSkillCache();
        cache[userId] = {
            skill: skill,
            timestamp: Date.now()
        };
        saveRacingSkillCache(cache);
    }

    // ===== UTILITIES =====
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function getRFC() {
        const rfc = $.cookie && $.cookie("rfc_v");
        if (rfc) return rfc;

        const cookies = document.cookie.split("; ");
        for (const cookie of cookies) {
            const [name, value] = cookie.split("=");
            if (name === "rfc_v") return value;
        }
        return null;
    }

    function getRaceIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('raceID');
    }

    async function fetchInitialRaceData(raceID) {
        const rfcv = getRFC();
        if (!rfcv) {
            console.error('[Race Optimizer] Could not get RFC value');
            return;
        }

        const url = `https://www.torn.com/page.php?rfcv=${rfcv}&sid=racingData&raceID=${raceID}`;
        console.log('[Race Optimizer] Fetching initial race data:', url);

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data && data.user) {
                current_user = data.user.userID;
            }

            if (data && data.timeData) {
                if (data.timeData.status >= 3) {
                    // Race finished - show results
                    const results = parseRaceData(data);
                    if (results && results.length > 0) {
                        displayRaceResults(results);
                    }
                } else {
                    // Race not finished - show participants
                    const participants = parseParticipants(data);
                    if (participants && participants.length > 0) {
                        displayParticipants(participants);
                    }
                }
            }
        } catch (e) {
            console.error('[Race Optimizer] Failed to fetch initial race data:', e);
        }
    }

    function formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const milliseconds = Math.floor((ms % 1000) / 10);

        if (hours > 0) {
            return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`;
        }
        return `${minutes}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`;
    }

    function decode64(data) {
        return atob(data);
    }

    // ===== API FUNCTIONS =====
    function fetchRacingSkill(userId) {
        return new Promise((resolve, reject) => {
            if (!API_KEY) {
                reject('No API key configured');
                return;
            }
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://api.torn.com/user/${userId}?selections=personalstats&key=${API_KEY}`,
                onload: (response) => {
                    try {
                        resolve(JSON.parse(response.responseText));
                    } catch (err) {
                        reject(err);
                    }
                },
                onerror: (err) => reject(err)
            });
        });
    }

    // ===== BLOCK BUILDRACE.JS =====
    const scriptBlocker = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            mutation.addedNodes.forEach((node) => {
                if (node.tagName === 'SCRIPT' && node.src && node.src.includes('buildrace.js')) {
                    node.type = 'javascript/blocked';
                    console.log('[Race Optimizer] Blocked buildrace.js');
                    scriptBlocker.disconnect();
                }
            });
        }
    });

    scriptBlocker.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // ===== STYLES =====
    const addStyles = () => {
        GM_addStyle(`
            #race-results-container {
                padding: 15px;
                background: linear-gradient(160deg,
                    rgba(0, 50, 100, 0.7) 0%,
                    rgba(100, 200, 255, 0.4) 60%,
                    rgba(200, 240, 255, 0.6) 100%
                );
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                border: 1px solid rgba(30, 80, 120, 0.4);
                border-radius: 8px;
                max-height: 500px;
                display: flex;
                flex-direction: column;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(100, 180, 255, 0.1);
            }
            #race-results-container .table-wrapper {
                flex: 1;
                overflow-y: auto;
                min-height: 0;
            }
            #race-results-container .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 1px solid #3a3a5a;
            }
            #race-results-container .header h2 {
                color: #fff;
                margin: 0;
                font-size: 18px;
                font-weight: 600;
            }
            #race-results-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 13px;
            }
            #race-results-table th {
                background: #2a2a4a;
                color: #aaa;
                padding: 10px 12px;
                text-align: left;
                font-weight: 500;
                text-transform: uppercase;
                font-size: 11px;
                letter-spacing: 0.5px;
            }
            #race-results-table td {
                padding: 10px 12px;
                border-bottom: 1px solid #2a2a4a;
                color: #ddd;
            }
            #race-results-table tbody tr:hover {
                background: rgba(255, 255, 255, 0.05);
            }
            #race-results-table .pos-1 td { color: #ffd700; }
            #race-results-table .pos-2 td { color: #c0c0c0; }
            #race-results-table .pos-3 td { color: #cd7f32; }
            #race-results-table .current-user {
                background: rgba(0, 255, 255, 0.15) !important;
                box-shadow: inset 0 0 10px rgba(0, 255, 255, 0.3);
            }
            #race-results-table .current-user td {
                color: #00ffff !important;
                font-weight: 600;
            }
            #race-results-table a {
                color: #6eb5ff;
                text-decoration: none;
                transition: color 0.2s;
            }
            #race-results-table .current-user a {
                color: #00ffff !important;
            }
            #race-results-table a:hover {
                color: #9dd1ff;
                text-decoration: underline;
            }
            #race-results-table .crashed {
                color: #ff6b6b;
                font-style: italic;
            }
            #race-results-table .skill-loading {
                color: #888;
                font-style: italic;
            }
            #race-results-table .api-not-set {
                color: #ff9800;
                font-style: italic;
            }
            #race-results-table .skill-cell.clickable {
                cursor: pointer;
                transition: color 0.2s, background 0.2s;
            }
            #race-results-table .skill-cell.clickable:hover {
                background: rgba(106, 181, 255, 0.15);
                color: #6eb5ff;
            }
            .control-buttons {
                display: flex;
                gap: 8px;
                margin-top: 12px;
                flex-wrap: wrap;
            }
            .control-buttons button {
                background: #3a3a5a;
                color: #ddd;
                border: 1px solid #4a4a6a;
                padding: 6px 12px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 11px;
                transition: all 0.2s;
            }
            .control-buttons button:hover {
                background: #4a4a6a;
                color: #fff;
            }
            .control-buttons button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            .control-buttons button.fetching {
                background: #2a5a2a;
            }
            .api-key-setup {
                background: #2a2a4a;
                padding: 15px;
                border-radius: 8px;
                margin-top: 12px;
            }
            .api-key-setup label {
                color: #aaa;
                display: block;
                margin-bottom: 8px;
                font-size: 12px;
            }
            .api-key-setup input {
                background: #1a1a2e;
                border: 1px solid #3a3a5a;
                color: #fff;
                padding: 8px 12px;
                border-radius: 4px;
                width: 250px;
                margin-right: 10px;
            }
            .api-key-setup button {
                background: #4a90d9;
                color: #fff;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                transition: background 0.2s;
            }
            .api-key-setup button:hover {
                background: #5aa0e9;
            }
            .position-icon {
                display: inline-block;
                width: 18px;
                height: 18px;
                margin-right: 6px;
                vertical-align: middle;
                background: url(/images/v2/racing/car_status.svg) no-repeat;
            }
            .position-icon.gold { background-position: 0 0; }
            .position-icon.silver { background-position: 0 -22px; }
            .position-icon.bronze { background-position: 0 -44px; }
            .sticky-user-row {
                position: sticky;
                z-index: 10;
                background: #004d4d !important;
                border: 1px solid rgba(0, 255, 255, 0.4);
            }
            .sticky-user-row.sticky-top {
                top: 0;
                border-bottom: 2px solid rgba(0, 255, 255, 0.6);
            }
            .sticky-user-row.sticky-bottom {
                bottom: 0;
                border-top: 2px solid rgba(0, 255, 255, 0.6);
            }
            .sticky-user-row td {
                color: #00ffff !important;
                font-weight: 600;
                background: #004d4d !important;
            }
            .sticky-user-row a {
                color: #00ffff !important;
            }
        `);
    };

    // ===== RACE DATA PARSING =====
    function parseRaceData(data) {
        if (!data || !data.timeData || data.timeData.status < 3) {
            return null;
        }

        const carsData = data.raceData.cars;
        const carInfo = data.raceData.carInfo;
        const trackIntervals = data.raceData.trackData.intervals.length;
        const laps = data.laps;
        const results = [];
        const crashes = [];

        for (const playername in carsData) {
            const userId = carInfo[playername].userID;
            const intervals = decode64(carsData[playername]).split(',');
            let raceTime = 0;

            if (intervals.length / trackIntervals === laps) {
                for (let i = 0; i < laps; i++) {
                    for (let j = 0; j < trackIntervals; j++) {
                        raceTime += Number(intervals[i * trackIntervals + j]);
                    }
                }
                results.push({
                    name: playername,
                    userId: userId,
                    time: raceTime,
                    crashed: false
                });
            } else {
                crashes.push({
                    name: playername,
                    userId: userId,
                    time: null,
                    crashed: true
                });
            }
        }

        // Sort by time (fastest first)
        results.sort((a, b) => a.time - b.time);

        // Combine results and crashes
        return [...results, ...crashes];
    }

    function parseParticipants(data) {
        if (!data || !data.raceData || !data.raceData.carInfo) {
            return null;
        }

        const carInfo = data.raceData.carInfo;
        const participants = [];

        for (const playername in carInfo) {
            participants.push({
                name: playername,
                userId: carInfo[playername].userID
            });
        }

        return participants;
    }

    // ===== DISPLAY FUNCTIONS =====
    async function displayParticipants(participants) {
        const container = document.querySelector('#racingupdatesnew');
        if (!container) return;

        currentRaceResults = participants;
        const currentUserId = current_user;

        let resultsContainer = document.querySelector('#race-results-container');
        if (!resultsContainer) {
            resultsContainer = document.createElement('div');
            resultsContainer.id = 'race-results-container';

            const driversList = container.querySelector('.drivers-list');
            if (driversList) {
                driversList.innerHTML = '';
                driversList.appendChild(resultsContainer);
            } else {
                container.appendChild(resultsContainer);
            }
        }

        let html = `
            <div class="header">
                <h2>Participants</h2>
            </div>
            <div class="table-wrapper">
            <table id="race-results-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Racer</th>
                        <th>Racing Skill</th>
                    </tr>
                </thead>
                <tbody>
        `;

        for (let i = 0; i < participants.length; i++) {
            const racer = participants[i];
            const isCurrentUser = currentUserId && racer.userId == currentUserId;
            const userClass = isCurrentUser ? 'current-user' : '';

            const cachedSkill = getCachedRacingSkill(racer.userId);
            let skillDisplay;
            let isClickable = false;
            if (cachedSkill !== null) {
                skillDisplay = cachedSkill;
            } else {
                skillDisplay = '<span class="skill-loading">-</span>';
                isClickable = !!API_KEY;
            }

            html += `
                <tr class="${userClass}" data-user-id="${racer.userId}">
                    <td>${i + 1}</td>
                    <td><a href="/profiles.php?XID=${racer.userId}">${racer.name}</a></td>
                    <td class="skill-cell${isClickable ? ' clickable' : ''}">${skillDisplay}</td>
                </tr>
            `;
        }

        html += '</tbody></table></div>';

        // Add control buttons
        html += `
            <div class="control-buttons">
                <button id="btn-fetch-all" ${!API_KEY ? 'disabled title="API key required"' : ''}>Fetch All</button>
                <button id="btn-api-reset">API Reset</button>
                <button id="btn-refresh-cache" ${!API_KEY ? 'disabled title="API key required"' : ''}>Refresh Cache</button>
            </div>
        `;

        html += `
            <div class="api-key-setup" id="api-key-setup" style="display: none;">
                <label>Enter your API key (leave blank to remove):</label>
                <input type="text" id="api-key-input" placeholder="Your Torn API key" value="${API_KEY}">
                <button id="save-api-key">Save</button>
            </div>
        `;

        resultsContainer.innerHTML = html;
        setupButtonListeners(participants);
        setupStickyUserRow();
    }

    async function displayRaceResults(results) {
        const container = document.querySelector('#racingupdatesnew');
        if (!container) return;

        // Store results for button actions
        currentRaceResults = results;
        const currentUserId = current_user;

        // Find or create results container
        let resultsContainer = document.querySelector('#race-results-container');
        if (!resultsContainer) {
            resultsContainer = document.createElement('div');
            resultsContainer.id = 'race-results-container';

            // Find drivers-list and replace its content
            const driversList = container.querySelector('.drivers-list');
            if (driversList) {
                driversList.innerHTML = '';
                driversList.appendChild(resultsContainer);
            } else {
                container.appendChild(resultsContainer);
            }
        }

        // Build table HTML
        let html = `
            <div class="header">
                <h2>Race Results</h2>
            </div>
            <div class="table-wrapper">
            <table id="race-results-table">
                <thead>
                    <tr>
                        <th>Pos</th>
                        <th>Racer</th>
                        <th>Time</th>
                        <th>Racing Skill</th>
                    </tr>
                </thead>
                <tbody>
        `;

        for (let i = 0; i < results.length; i++) {
            const racer = results[i];
            const position = i + 1;
            const posClass = position <= 3 ? `pos-${position}` : '';
            const isCurrentUser = currentUserId && racer.userId == currentUserId;
            const userClass = isCurrentUser ? 'current-user' : '';
            const posIcon = position === 1 ? 'gold' : position === 2 ? 'silver' : position === 3 ? 'bronze' : '';

            const positionDisplay = posIcon
                ? `<span class="position-icon ${posIcon}"></span>`
                : position;

            const timeDisplay = racer.crashed
                ? '<span class="crashed">Crashed</span>'
                : formatTime(racer.time * 1000);

            const cachedSkill = getCachedRacingSkill(racer.userId);
            let skillDisplay;
            let isClickable = false;
            if (cachedSkill !== null) {
                skillDisplay = cachedSkill;
            } else if (!API_KEY) {
                skillDisplay = '<span class="api-not-set">API_NOT_SET</span>';
            } else if (position <= 10) {
                skillDisplay = '<span class="skill-loading">Loading...</span>';
            } else {
                skillDisplay = '<span class="skill-loading">-</span>';
                isClickable = true;
            }

            html += `
                <tr class="${posClass} ${userClass}" data-user-id="${racer.userId}">
                    <td>${positionDisplay}</td>
                    <td><a href="/profiles.php?XID=${racer.userId}">${racer.name}</a></td>
                    <td>${timeDisplay}</td>
                    <td class="skill-cell${isClickable ? ' clickable' : ''}">${skillDisplay}</td>
                </tr>
            `;
        }

        html += '</tbody></table></div>';

        // Add control buttons
        html += `
            <div class="control-buttons">
                <button id="btn-fetch-all" ${!API_KEY ? 'disabled title="API key required"' : ''}>Fetch All</button>
                <button id="btn-api-reset">API Reset</button>
                <button id="btn-refresh-cache" ${!API_KEY ? 'disabled title="API key required"' : ''}>Refresh Cache</button>
            </div>
        `;

        // Add API key setup (hidden by default, shown on API Reset)
        html += `
            <div class="api-key-setup" id="api-key-setup" style="display: none;">
                <label>Enter your API key (leave blank to remove):</label>
                <input type="text" id="api-key-input" placeholder="Your Torn API key" value="${API_KEY}">
                <button id="save-api-key">Save</button>
            </div>
        `;

        resultsContainer.innerHTML = html;

        // Setup button event listeners
        setupButtonListeners(results);

        // Setup sticky user row
        setupStickyUserRow();

        // Fetch racing skills for top 10 only (if API key is set)
        if (API_KEY) {
            const top10 = results.slice(0, 10);
            await fetchRacingSkillsForRacers(top10, false);
        }
    }

    function setupButtonListeners(results) {
        // Fetch All button
        const fetchAllBtn = document.querySelector('#btn-fetch-all');
        if (fetchAllBtn) {
            fetchAllBtn.addEventListener('click', async () => {
                if (!API_KEY) return;
                fetchAllBtn.disabled = true;
                fetchAllBtn.classList.add('fetching');
                fetchAllBtn.textContent = 'Fetching...';
                await fetchRacingSkillsForRacers(results, false);
                fetchAllBtn.classList.remove('fetching');
                fetchAllBtn.textContent = 'Fetch All';
                fetchAllBtn.disabled = false;
            });
        }

        // API Reset button
        const apiResetBtn = document.querySelector('#btn-api-reset');
        if (apiResetBtn) {
            apiResetBtn.addEventListener('click', () => {
                const setupDiv = document.querySelector('#api-key-setup');
                if (setupDiv) {
                    setupDiv.style.display = setupDiv.style.display === 'none' ? 'block' : 'none';
                }
            });
        }

        // Save API key button
        const saveBtn = document.querySelector('#save-api-key');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const input = document.querySelector('#api-key-input');
                if (input) {
                    const newKey = input.value.trim();
                    GM_setValue('apiKey', newKey);
                    API_KEY = newKey;
                    location.reload();
                }
            });
        }

        // Refresh Cache button
        const refreshCacheBtn = document.querySelector('#btn-refresh-cache');
        if (refreshCacheBtn) {
            refreshCacheBtn.addEventListener('click', async () => {
                if (!API_KEY) return;
                refreshCacheBtn.disabled = true;
                refreshCacheBtn.classList.add('fetching');
                refreshCacheBtn.textContent = 'Refreshing...';
                await fetchRacingSkillsForRacers(results, true); // Force refresh
                refreshCacheBtn.classList.remove('fetching');
                refreshCacheBtn.textContent = 'Refresh Cache';
                refreshCacheBtn.disabled = false;
            });
        }

        // Clickable skill cells for individual fetch
        setupSkillCellClickHandlers(results);
    }

    function setupSkillCellClickHandlers(results) {
        const clickableCells = document.querySelectorAll('#race-results-table .skill-cell.clickable');
        clickableCells.forEach(cell => {
            cell.addEventListener('click', async function () {
                const row = this.closest('tr');
                const userId = row.dataset.userId;
                const racer = results.find(r => r.userId == userId);

                if (!racer || !API_KEY) return;

                // Prevent multiple clicks
                if (this.classList.contains('fetching')) return;

                this.classList.add('fetching');
                this.classList.remove('clickable');
                this.innerHTML = '<span class="skill-loading">Loading...</span>';

                try {
                    const data = await fetchRacingSkill(userId);
                    let skill = 'N/A';

                    if (data && data.personalstats && data.personalstats.racingskill) {
                        skill = data.personalstats.racingskill;
                    }
                    setCachedRacingSkill(userId, skill);

                    this.textContent = skill;
                    this.classList.remove('skill-loading');
                } catch (err) {
                    console.error(`[Race Optimizer] Failed to fetch skill for user ${userId}:`, err);
                    this.textContent = 'Error';
                    this.classList.remove('skill-loading');
                } finally {
                    this.classList.remove('fetching');
                }
            });
        });
    }

    function setupStickyUserRow() {
        const tableWrapper = document.querySelector('#race-results-container .table-wrapper');
        const table = document.querySelector('#race-results-table');
        const userRow = document.querySelector('#race-results-table .current-user');

        if (!tableWrapper || !table || !userRow) return;

        const tbody = table.querySelector('tbody');
        let stickyClone = null;

        function updateStickyRow() {
            const wrapperRect = tableWrapper.getBoundingClientRect();
            const rowRect = userRow.getBoundingClientRect();
            const theadHeight = table.querySelector('thead')?.offsetHeight || 0;

            // Check if user row is above visible area
            const isAbove = rowRect.bottom < wrapperRect.top + theadHeight;
            // Check if user row is below visible area
            const isBelow = rowRect.top > wrapperRect.bottom;
            // Check if user row is in view
            const isInView = !isAbove && !isBelow;

            if (isInView) {
                // Row is visible, remove any sticky clone
                if (stickyClone) {
                    stickyClone.remove();
                    stickyClone = null;
                }
            } else {
                // Row is not visible, show sticky clone
                if (!stickyClone) {
                    stickyClone = userRow.cloneNode(true);
                    stickyClone.classList.add('sticky-user-row');
                    // Copy click handlers for skill cell if clickable
                    const originalSkillCell = userRow.querySelector('.skill-cell.clickable');
                    const cloneSkillCell = stickyClone.querySelector('.skill-cell.clickable');
                    if (originalSkillCell && cloneSkillCell) {
                        cloneSkillCell.addEventListener('click', () => originalSkillCell.click());
                    }
                }

                // Remove existing sticky classes
                stickyClone.classList.remove('sticky-top', 'sticky-bottom');

                if (isAbove) {
                    // Row is above viewport, stick to top
                    stickyClone.classList.add('sticky-top');
                    if (stickyClone.parentNode !== tbody) {
                        tbody.insertBefore(stickyClone, tbody.firstChild);
                    }
                } else {
                    // Row is below viewport, stick to bottom
                    stickyClone.classList.add('sticky-bottom');
                    if (stickyClone.parentNode !== tbody) {
                        tbody.appendChild(stickyClone);
                    }
                }
            }
        }

        // Initial check
        updateStickyRow();

        // Update on scroll
        tableWrapper.addEventListener('scroll', updateStickyRow);
    }

    async function fetchRacingSkillsForRacers(racers, forceRefresh = false) {
        for (const racer of racers) {
            // Skip if already cached (unless force refresh)
            if (!forceRefresh && getCachedRacingSkill(racer.userId) !== null) {
                continue;
            }

            try {
                const data = await fetchRacingSkill(racer.userId);
                let skill = 'N/A';

                if (data && data.personalstats && data.personalstats.racingskill) {
                    skill = data.personalstats.racingskill;
                }
                setCachedRacingSkill(racer.userId, skill);

                // Update the table cell
                const cell = document.querySelector(`#race-results-table tr[data-user-id="${racer.userId}"] .skill-cell`);
                if (cell) {
                    cell.textContent = skill;
                    cell.classList.remove('skill-loading');
                    cell.classList.remove('api-not-set');
                }

                // Rate limiting delay
                await sleep(1000);
            } catch (err) {
                console.error(`[Race Optimizer] Failed to fetch skill for ${racer.name}:`, err);
                const cell = document.querySelector(`#race-results-table tr[data-user-id="${racer.userId}"] .skill-cell`);
                if (cell) {
                    cell.textContent = 'Error';
                    cell.classList.remove('skill-loading');
                }
            }
        }
    }

    // ===== AJAX INTERCEPTION (from TornRacingEnhancements pattern) =====
    function ajax(callback) {
        $(document).ajaxComplete((event, xhr, settings) => {
            if (xhr.readyState > 3 && xhr.status == 200) {
                let url = settings.url;
                if (url.indexOf("torn.com/") < 0) url = "torn.com" + (url.startsWith("/") ? "" : "/") + url;
                const page = url.substring(url.indexOf("torn.com/") + "torn.com/".length, url.indexOf(".php"));
                callback(page, xhr, settings);
            }
        });
    }

    // ===== INITIALIZATION =====
    function init() {
        addStyles();

        ajax((page, xhr) => {
            if (page !== 'loader' && page !== 'page') return;

            try {
                const data = JSON.parse(xhr.responseText);
                console.log('[Race Optimizer] Intercepted AJAX data', page);

                if (data && data.user) {
                    current_user = data.user.userID;
                }

                if (data && data.timeData) {
                    if (data.timeData.status >= 3) {
                        // Race finished - show results
                        const results = parseRaceData(data);
                        if (results && results.length > 0) {
                            displayRaceResults(results);
                        }
                    } else {
                        // Race not finished - show participants
                        const participants = parseParticipants(data);
                        if (participants && participants.length > 0) {
                            displayParticipants(participants);
                        }
                    }
                }
            } catch (e) {
                // Not JSON or not race data, ignore
            }
        });

        // Check if URL has raceID and fetch initial data
        const raceID = getRaceIdFromUrl() || "";

        console.log('[Race Optimizer] Found raceID in URL:', raceID);
        fetchInitialRaceData(raceID);

        console.log('[Race Optimizer] Initialized');
    }

    // Wait for jQuery to be available
    function waitForJQuery() {
        if (typeof $ !== 'undefined' && $.fn && $.fn.jquery) {
            init();
        } else {
            setTimeout(waitForJQuery, 50);
        }
    }

    // Start waiting for jQuery after DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForJQuery);
    } else {
        waitForJQuery();
    }
})();