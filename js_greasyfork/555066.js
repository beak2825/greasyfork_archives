// ==UserScript==
// @name         Nitro Type Startrack Leaderboard Integration
// @version      8.9
// @description  OPTIMIZED - Bug fixes: race condition guard, error handling, curtain removal
// @author       Combined Logic (SuperJoelzy + Captain.Loveridge)
// @license      MIT
// @match        https://www.nitrotype.com/*
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @namespace    https://greasyfork.org/users/1443935
// @downloadURL https://update.greasyfork.org/scripts/555066/Nitro%20Type%20Startrack%20Leaderboard%20Integration.user.js
// @updateURL https://update.greasyfork.org/scripts/555066/Nitro%20Type%20Startrack%20Leaderboard%20Integration.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =================================================================
    // 1. CSS & ANTI-FLICKER SYSTEM
    // =================================================================

    const globalStyles = `
        /* Curtain Logic */
        html.is-leaderboard-route main.structure-content {
            opacity: 0 !important;
            visibility: hidden !important;
        }
        html.is-leaderboard-route main.structure-content.custom-loaded {
            opacity: 1 !important;
            visibility: visible !important;
            transition: opacity 0.15s ease-in;
        }

        /* Spin Animation for Refresh Icon */
        @keyframes nt-spin { 100% { transform: rotate(360deg); } }
        .icon-spin { animation: nt-spin 1s linear infinite; }

        /* Refresh Button Styling */
        #manual-refresh-btn {
            transition: opacity 0.2s, color 0.2s;
            cursor: pointer;
            vertical-align: middle;
        }
        #manual-refresh-btn:hover {
            opacity: 1 !important;
            color: #fff !important;
        }
    `;

    const styleEl = document.createElement('style');
    styleEl.textContent = globalStyles;
    (document.head || document.documentElement).appendChild(styleEl);

    function updateRouteStatus() {
        if (location.pathname === '/leaderboards') {
            document.documentElement.classList.add('is-leaderboard-route');
        } else {
            document.documentElement.classList.remove('is-leaderboard-route');
            const main = document.querySelector('main.structure-content');
            if (main) main.classList.remove('custom-loaded');
        }
    }
    updateRouteStatus();

    const originalPush = history.pushState;
    history.pushState = function() {
        originalPush.apply(this, arguments);
        updateRouteStatus();
    };
    window.addEventListener('popstate', updateRouteStatus);


    // =================================================================
    // 2. SHARED OPTIMIZATION LAYER
    // =================================================================
    window.NTShared = window.NTShared || {
        cache: {
            individual: { data: null, timestamp: 0, expiresAt: 0 },
            team: { data: null, timestamp: 0, expiresAt: 0 },
            isbot: new Map()
        },
        setCache(type, data, expiresAt) {
            this.cache[type].data = data;
            this.cache[type].timestamp = Date.now();
            this.cache[type].expiresAt = expiresAt || (Date.now() + 3600000);
            window.dispatchEvent(new CustomEvent('nt-cache-updated', { detail: { type, data, expiresAt } }));
        },
        getCache(type) {
            const cached = this.cache[type];
            if (!cached.data) return null;
            if (Date.now() < cached.expiresAt) return cached.data;
            return null;
        },
        // NEW: Helper to get the timestamp from shared memory
        getTimestamp(type) {
            return this.cache[type]?.timestamp || null;
        },
        getBotStatus(username) { return this.cache.isbot.get(username.toLowerCase()); },
        setBotStatus(username, status) { this.cache.isbot.set(username.toLowerCase(), status); }
    };

    // --- CONFIGURATION ---
    const TAB_CLASS = 'nt-custom-leaderboards';
    const LEADERBOARD_PATH = '/leaderboards';
    const CACHE_KEY = 'ntStartrackCache_';
    const CACHE_TIMESTAMP_KEY = 'ntStartrackCacheTime_';
    const CACHE_DURATION = 60 * 60 * 1000;
    const ASYNC_DELAY = 50;

    // --- STATE ---
    let cacheQueue = [];
    let isCaching = false;
    let forceBackgroundUpdate = false;
    let initialCacheComplete = false;
    let carDataMap = {};
    let lastCheckedHour = null;
    let hourlyCheckInterval = null;
    let pageRenderInProgress = false; // Guard flag to prevent duplicate renders

    let state = {
        view: 'individual',
        timeframe: 'season',
        currentDate: getCurrentCT(),
        dateRange: { start: null, end: null }
    };

    const SEASON_START = '2025-11-02 06:00:00';
    const SEASON_END = '2025-11-30 08:00:00';

    const timeframes = [
        { key: 'season', label: 'Season', hasNav: false },
        { key: '24hr', label: 'Last 24 Hours', hasNav: false },
        { key: '60min', label: '60 Minutes', hasNav: false },
        { key: '7day', label: 'Last 7 Days', hasNav: false },
        { key: 'daily', label: 'Daily', hasNav: true },
        { key: 'weekly', label: 'Weekly', hasNav: true },
        { key: 'monthly', label: 'Monthly', hasNav: true },
        { key: 'custom', label: 'Custom', hasNav: false }
    ];

    // --- UTILITIES ---
    function getCurrentCT() {
        const now = new Date();
        const ctString = now.toLocaleString("en-US", { timeZone: "America/Chicago" });
        return new Date(ctString);
    }
    function getCurrentHour() { return new Date().getHours(); }

    function startHourlyCheck() {
        lastCheckedHour = getCurrentHour();
        if (hourlyCheckInterval) clearInterval(hourlyCheckInterval);

        hourlyCheckInterval = setInterval(() => {
            const currentHour = getCurrentHour();
            if (currentHour !== lastCheckedHour && location.pathname === LEADERBOARD_PATH) {
                lastCheckedHour = currentHour;
                state.currentDate = getCurrentCT();
                if (['60min', '24hr', '7day'].includes(state.timeframe)) fetchLeaderboardData(true);
            } else if (currentHour !== lastCheckedHour) {
                lastCheckedHour = currentHour;
            }
        }, 60000);
    }

    function stopHourlyCheck() {
        if (hourlyCheckInterval) { clearInterval(hourlyCheckInterval); hourlyCheckInterval = null; }
    }

    function loadCarData() {
        const cacheTimestamp = localStorage.getItem('ntCarDataMapTimestamp');
        const cacheAge = cacheTimestamp ? Date.now() - parseInt(cacheTimestamp) : Infinity;
        const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

        if (cacheAge < SEVEN_DAYS) {
            const cached = localStorage.getItem('ntCarDataMap');
            if (cached) { try { carDataMap = JSON.parse(cached); return; } catch (e) {} }
        }

        if (typeof NTBOOTSTRAP === 'function') {
            try {
                const bootstrapData = NTBOOTSTRAP();
                const carsData = bootstrapData.find(item => item[0] === 'CARS');
                if (carsData && carsData[1]) {
                    carsData[1].forEach(car => {
                        if (car.carID && car.options && car.options.smallSrc) carDataMap[car.carID] = car.options.smallSrc;
                    });
                    localStorage.setItem('ntCarDataMap', JSON.stringify(carDataMap));
                    localStorage.setItem('ntCarDataMapTimestamp', Date.now().toString());
                    return;
                }
            } catch (e) {}
        }

        const cached = localStorage.getItem('ntCarDataMap');
        if (cached) { try { carDataMap = JSON.parse(cached); } catch (e) {} }
    }

    function getCarImage(carID, carHueAngle) {
        const smallSrc = carDataMap[carID];
        if (smallSrc) {
            if (carHueAngle !== null && carHueAngle !== undefined) {
                const baseImage = smallSrc.replace('.png', '');
                return `https://www.nitrotype.com/cars/painted/${baseImage}_${carHueAngle}.png`;
            }
            return `https://www.nitrotype.com/cars/${smallSrc}`;
        }
        return `https://www.nitrotype.com/cars/${carID}_small_1.png`;
    }

    function formatDate(date) {
        if (!date) return '';
        const d = new Date(date);
        const y = d.getFullYear();
        const m = ('0' + (d.getMonth() + 1)).slice(-2);
        const day = ('0' + d.getDate()).slice(-2);
        const h = ('0' + d.getHours()).slice(-2);
        const min = ('0' + d.getMinutes()).slice(-2);
        const s = ('0' + d.getSeconds()).slice(-2);
        return `${y}-${m}-${day} ${h}:${min}:${s}`;
    }

    function getStartOfDay(date) { const d = new Date(date); d.setHours(0, 0, 0, 0); return d; }
    function getEndOfDay(date) { const d = new Date(date); d.setHours(23, 59, 59, 999); return d; }

    function calculateDateRange(tempState) {
        let start, end;
        const current = new Date(tempState.currentDate);
        const timeframe = tempState.timeframe || state.timeframe;
        const now = getCurrentCT();

        if (timeframe === 'season') { return { start: SEASON_START, end: SEASON_END }; }
        else if (timeframe === '60min') { end = now; start = new Date(now.getTime() - (60 * 60 * 1000)); }
        else if (timeframe === '24hr') { end = now; start = new Date(now.getTime() - (24 * 60 * 60 * 1000)); }
        else if (timeframe === '7day') { end = now; start = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000)); }
        else if (timeframe === 'daily') { start = getStartOfDay(current); end = getEndOfDay(current); }
        else if (timeframe === 'weekly') {
            const dayOfWeek = current.getDay();
            start = getStartOfDay(current);
            start.setDate(start.getDate() - dayOfWeek);
            end = new Date(start);
            end.setDate(end.getDate() + 6);
            end = getEndOfDay(end);
        } else if (timeframe === 'monthly') {
            start = new Date(current.getFullYear(), current.getMonth(), 1);
            end = new Date(current.getFullYear(), current.getMonth() + 1, 0);
            end = getEndOfDay(end);
        } else if (timeframe === 'custom') {
            start = tempState.dateRange?.start || getStartOfDay(now);
            end = tempState.dateRange?.end || getEndOfDay(now);
        }
        return { start: formatDate(start), end: formatDate(end) };
    }

    function navigateDate(direction) {
        const current = state.currentDate;
        const date = new Date(current);
        if (state.timeframe === 'daily') date.setDate(current.getDate() + direction);
        else if (state.timeframe === 'weekly') date.setDate(current.getDate() + (7 * direction));
        else if (state.timeframe === 'monthly') date.setMonth(current.getMonth() + direction);
        state.currentDate = date;
        fetchLeaderboardData();
    }

    function setIndicator(message, isUpdating = true) {
        const indicatorEl = document.getElementById('update-indicator');
        if (indicatorEl) {
            indicatorEl.textContent = message;
            indicatorEl.style.color = isUpdating ? '#FFC107' : '#28A745';

            const refreshBtn = document.getElementById('manual-refresh-btn');
            if (refreshBtn && !isUpdating) {
                const svg = refreshBtn.querySelector('svg');
                if (svg) svg.classList.remove('icon-spin');
            }

            document.querySelectorAll('[data-timeframe]').forEach(btn => {
                btn.classList.remove('is-active', 'is-frozen');
                if (btn.dataset.timeframe === state.timeframe) btn.classList.add('is-active', 'is-frozen');
            });
            document.querySelectorAll('[data-view]').forEach(btn => {
                btn.classList.remove('is-active');
                if (btn.dataset.view === state.view) btn.classList.add('is-active');
            });
        }
    }

    function getCacheKey(tempState) {
        const s = tempState || state;
        const ranges = calculateDateRange(s);
        let startKey = ranges.start;
        let endKey = ranges.end;

        if (s.timeframe === '60min' || s.timeframe === '24hr' || s.timeframe === '7day') {
            const roundToHour = (dateStr) => {
                const date = new Date(dateStr.replace(' ', 'T'));
                date.setMinutes(0, 0, 0);
                return formatDate(date);
            };
            startKey = roundToHour(ranges.start);
            endKey = roundToHour(ranges.end);
        }
        return `${CACHE_KEY}${s.view}_${s.timeframe}_${startKey}_${endKey}`;
    }

    // --- HTML BUILDING ---
    function buildLeaderboardHTML() {
        const currentTF = timeframes.find(t => t.key === state.timeframe);
        const hasNav = currentTF?.hasNav || false;
        const isCustom = state.timeframe === 'custom';

        return `
            <section class="card card--b card--o card--shadow card--f card--grit well well--b well--l">
                <div class="card-cap bg--gradient">
                    <h1 class="h2 tbs">Startrack Leaderboards</h1>
                </div>
                <div class="well--p well--l_p">
                    <div class="row row--o well well--b well--l">
                        <div class="tabs tabs--a tabs--leaderboards">
                            <button class="tab" data-view="individual">
                                <div class="bucket bucket--c bucket--xs"><div class="bucket-media"><svg class="icon icon-racer"><use xlink:href="/dist/site/images/icons/icons.css.svg#icon-racer"></use></svg></div><div class="bucket-content">Top Racers</div></div>
                            </button>
                            <button class="tab" data-view="team">
                                <div class="bucket bucket--c bucket--xs"><div class="bucket-media"><svg class="icon icon-team"><use xlink:href="/dist/site/images/icons/icons.css.svg#icon-team"></use></svg></div><div class="bucket-content">Top Teams</div></div>
                            </button>
                        </div>
                        <div class="card card--d card--o card--sq card--f">
                            <div class="well--p well--pt">
                                <div class="row row--o has-btn">
                                    ${timeframes.map(tf => `<button type="button" class="btn btn--dark btn--outline btn--thin" data-timeframe="${tf.key}">${tf.label}</button>`).join('')}
                                </div>
                                <div class="divider divider--a mbf"></div>
                                <div class="seasonLeader seasonLeader--default" style="position: relative;">
                                    <div class="split split--start row">
                                        <div class="split-cell">
                                            <h1 class="seasonLeader-title" id="date-title">Loading...</h1>
                                            <p class="seasonLeader-date" id="date-range"></p>
                                        </div>
                                    </div>
                                    <div style="position: absolute; bottom: 10px; width: 100%; text-align: center; left: 0; pointer-events: none;">
                                        <div style="pointer-events: auto; display: inline-flex; align-items: center; justify-content: center;">
                                            <span id="update-indicator" class="mrxs tsm">Loading...</span>
                                            <button id="manual-refresh-btn" class="btn btn--bare" title="Manual Refresh - Syncs All Tabs" style="padding: 2px; opacity: 0.6; line-height: 0;">
                                                <svg style="width: 14px; height: 14px; fill: currentColor;" viewBox="0 0 24 24">
                                                    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 3.33-3.85 5.63-7.29 5.63-4.14 0-7.5-3.36-7.5-7.5s3.36-7.5 7.5-7.5c2.07 0 3.94.83 5.36 2.24L13 12h7V5l-2.35 1.35z"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                ${hasNav ? `
                                    <div class="row row--o mtm">
                                        <button class="btn btn--secondary btn--thin" id="nav-prev">&lt; Previous</button>
                                        <button class="btn btn--secondary btn--thin" id="nav-today">Today</button>
                                        <button class="btn btn--secondary btn--thin" id="nav-next">Next &gt;</button>
                                    </div>
                                ` : ''}
                                ${isCustom ? `
                                    <div class="row row--o mtm">
                                        <label class="tsm tc-ts">Start:</label>
                                        <input type="date" id="start-date" class="input input--mini mlxs mrm" value="${state.dateRange.start ? state.dateRange.start.toISOString().split('T')[0] : ''}">
                                        <label class="tsm tc-ts">End:</label>
                                        <input type="date" id="end-date" class="input input--mini mlxs mrm" value="${state.dateRange.end ? state.dateRange.end.toISOString().split('T')[0] : ''}">
                                        <button class="btn btn--primary btn--thin" id="update-custom">Update</button>
                                    </div>
                                ` : ''}
                                <div id="leaderboard-table-container">
                                    <div class="tac pxl mtl">
                                        <div class="loading-spinner loading-spinner--ts" style="margin: 0 auto;"></div>
                                        <div class="mtm">Loading content...</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    // --- CACHE MGMT ---
    function cleanOldCache() {
        try {
            const keys = Object.keys(localStorage);
            const cacheKeys = keys.filter(k => k.startsWith(CACHE_KEY));
            if (cacheKeys.length > 50) {
                cacheKeys.sort().slice(0, cacheKeys.length - 50).forEach(key => localStorage.removeItem(key));
            }
        } catch (e) {}
    }
    function isCacheFresh(cacheKey) {
        const timestampKey = CACHE_TIMESTAMP_KEY + cacheKey;
        const timestamp = localStorage.getItem(timestampKey);
        if (!timestamp) return false;
        return (Date.now() - parseInt(timestamp)) < CACHE_DURATION;
    }
    function saveToCache(cacheKey, data) {
        try {
            localStorage.setItem(cacheKey, data);
            localStorage.setItem(CACHE_TIMESTAMP_KEY + cacheKey, Date.now().toString());
        } catch (quotaError) {
            cleanOldCache();
            try {
                localStorage.setItem(cacheKey, data);
                localStorage.setItem(CACHE_TIMESTAMP_KEY + cacheKey, Date.now().toString());
            } catch (e2) {}
        }
    }

    // --- RENDER TABLE ---
    // MODIFIED: Accepts specificTime to ensure "Last updated" is always correct
    function renderTable(data, specificTime = null) {
        const container = document.getElementById('leaderboard-table-container');
        if (!container) return;

        if (!data || data.length === 0) {
            container.innerHTML = '<div class="tac pxl tsm tc-ts">No data available.</div>';
            setIndicator('Updated', false);
            return;
        }

        const top100 = data.slice(0, 100);
        const isIndividual = state.view === 'individual';

        let html = '<table class="table table--selectable table--striped table--fixed table--leaderboard">';
        html += '<thead class="table-head"><tr class="table-row">';
        html += isIndividual
            ? `<th scope="col" class="table-cell table-cell--place"></th><th scope="col" class="table-cell table-cell--racer">Racer</th><th scope="col" class="table-cell table-cell--speed">WPM</th><th scope="col" class="table-cell table-cell--races">Accuracy</th><th scope="col" class="table-cell table-cell--races">Races</th><th scope="col" class="table-cell table-cell--points">Points</th>`
            : `<th scope="col" class="table-cell table-cell--place"></th><th scope="col" class="table-cell table-cell--tag">Tag</th><th scope="col" class="table-cell table-cell--team">Team</th><th scope="col" class="table-cell table-cell--speed">WPM</th><th scope="col" class="table-cell table-cell--races">Accuracy</th><th scope="col" class="table-cell table-cell--races">Races</th><th scope="col" class="table-cell table-cell--points">Points</th>`;
        html += '</tr></thead><tbody class="table-body">';

        top100.forEach((item, index) => {
            const rank = index + 1;
            let rowClass = 'table-row';
            let medalHTML = `<div class="mhc"><span class="h3 tc-ts">${rank}</span></div>`;

            if (rank === 1) { rowClass = 'table-row table-row--gold'; medalHTML = '<img class="db" src="/dist/site/images/medals/gold-sm.png">'; }
            else if (rank === 2) { rowClass = 'table-row table-row--silver'; medalHTML = '<img class="db" src="/dist/site/images/medals/silver-sm.png">'; }
            else if (rank === 3) { rowClass = 'table-row table-row--bronze'; medalHTML = '<img class="db" src="/dist/site/images/medals/bronze-sm.png">'; }

            const wpm = parseFloat(item.WPM).toFixed(1);
            const acc = (parseFloat(item.Accuracy) * 100).toFixed(2);
            const points = Math.round(parseFloat(item.Points)).toLocaleString();

            if (isIndividual) {
                html += `<tr class="${rowClass}" data-username="${item.Username || ''}" style="cursor: pointer;"><td class="table-cell table-cell--place tac">${medalHTML}</td>`;
                const teamTag = item.TeamTag || '--';
                const displayName = item.CurrentDisplayName || item.Username;
                const tagColor = item.tagColor || 'fff';
                const isGold = item.membership === 'gold';
                const carImage = getCarImage(item.carID || 1, item.carHueAngle);
                const title = 'titles coming soon';

                html += `
                    <td class="table-cell table-cell--racer">
                        <div class="bucket bucket--s bucket--c">
                            <div class="bucket-media bucket-media--w90"><img class="db" src="${carImage}"></div>
                            <div class="bucket-content">
                                <div class="df df--align-center">
                                    ${isGold ? '<div class="prxxs"><img alt="NT Gold" class="icon icon-nt-gold-s" src="https://www.nitrotype.com/dist/site/images/themes/profiles/gold/nt-gold-icon.png"></div>' : ''}
                                    <div class="prxs df df--align-center" title="${displayName}">
                                        <a href="https://www.nitrotype.com/team/${teamTag}" class="link link--bare mrxxs twb" style="color: #${tagColor};">[${teamTag}]</a>
                                        <span class="type-ellip ${isGold ? 'type-gold' : ''} tss">${displayName}</span>
                                    </div>
                                </div>
                                <div class="tsxs tc-fuel tsi db">"${title}"</div>
                            </div>
                        </div>
                    </td>
                    <td class="table-cell table-cell--speed">${wpm}</td>
                    <td class="table-cell table-cell--races">${acc}%</td>
                    <td class="table-cell table-cell--races">${item.Races}</td>
                    <td class="table-cell table-cell--points">${points}</td>
                `;
            } else {
                const teamTag = item.TeamTag || '----';
                const teamName = item.TeamName || `${teamTag} Team`;
                const tagColor = item.tagColor || 'B3C8DD';
                html += `<tr class="${rowClass}" data-teamtag="${item.TeamTag || ''}" style="cursor: pointer;"><td class="table-cell table-cell--place tac">${medalHTML}</td>`;
                html += `
                    <td class="table-cell table-cell--tag"><span class="twb" style="color: #${tagColor};">[${teamTag}]</span></td>
                    <td class="table-cell table-cell--team"><span class="tc-lemon">${teamName}</span></td>
                    <td class="table-cell table-cell--speed">${wpm}</td>
                    <td class="table-cell table-cell--races">${acc}%</td>
                    <td class="table-cell table-cell--races">${item.Races}</td>
                    <td class="table-cell table-cell--points">${points}</td>
                `;
            }
            html += '</tr>';
        });

        html += '</tbody></table>';
        container.innerHTML = html;

        if (isIndividual) {
            document.querySelectorAll('.table-row[data-username]').forEach(row => {
                row.addEventListener('click', (e) => {
                    if (!e.target.closest('a[href*="/team/"]')) window.location.href = `https://www.nitrotype.com/racer/${row.dataset.username}`;
                });
            });
        } else {
            document.querySelectorAll('.table-row[data-teamtag]').forEach(row => {
                row.addEventListener('click', () => window.location.href = `https://www.nitrotype.com/team/${row.dataset.teamtag}`);
            });
        }

        // UPDATED: Robust Timestamp Logic
        // 1. Use specificTime if provided (API/RAM)
        // 2. Use LocalStorage if found
        // 3. Fallback to NOW (Date.now()) to ensure text is always visible
        const cacheKey = getCacheKey();
        let timeToDisplay = specificTime || localStorage.getItem(CACHE_TIMESTAMP_KEY + cacheKey);

        if (!timeToDisplay) timeToDisplay = Date.now().toString();

        const updateTime = new Date(parseInt(timeToDisplay));
        setIndicator(`Last updated: ${updateTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`, false);

        if (!initialCacheComplete && !isCaching) {
            initialCacheComplete = true;
            isCaching = true;
            setTimeout(() => { populateCacheQueue(); cacheAllViews(); }, 1000);
        }
    }

    function updateDateDisplay() {
        const titleEl = document.getElementById('date-title');
        const rangeEl = document.getElementById('date-range');
        if (!titleEl || !rangeEl) return;

        const ranges = calculateDateRange(state);
        const start = new Date(ranges.start.replace(' ', 'T'));
        const end = new Date(ranges.end.replace(' ', 'T'));

        if (state.timeframe === 'season') { titleEl.textContent = 'Season'; rangeEl.textContent = 'Nov 2 - Nov 30, 2025'; }
        else if (state.timeframe === 'daily') { titleEl.textContent = 'Daily'; rangeEl.textContent = start.toLocaleDateString(); }
        else if (state.timeframe === 'weekly') { titleEl.textContent = 'Weekly'; rangeEl.textContent = `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`; }
        else if (state.timeframe === 'monthly') { titleEl.textContent = 'Monthly'; rangeEl.textContent = start.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }); }
        else if (state.timeframe === 'custom') { titleEl.textContent = 'Custom Range'; rangeEl.textContent = `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`; }
        else { titleEl.textContent = timeframes.find(t => t.key === state.timeframe)?.label || 'Leaderboards'; rangeEl.textContent = ''; }
    }

    function populateCacheQueue() {
        cacheQueue = [];
        const views = ['individual', 'team'];
        const currentCT = getCurrentCT();
        const priorityTimeframes = ['season', '24hr', '7day'];
        const now = getCurrentCT();
        now.setMinutes(0, 0, 0);

        timeframes.filter(t => priorityTimeframes.includes(t.key)).forEach(tf => {
            views.forEach(view => cacheQueue.push({ view: view, timeframe: tf.key, currentDate: now }));
        });

        const dynamicTFs = timeframes.filter(t => t.hasNav);
        views.forEach(view => {
            dynamicTFs.forEach(tf => {
                let date = new Date(currentCT.getFullYear(), currentCT.getMonth(), currentCT.getDate());
                cacheQueue.push({ view: view, timeframe: tf.key, currentDate: date });
            });
        });

        const currentKey = getCacheKey();
        cacheQueue = cacheQueue.filter(item => getCacheKey(item) !== currentKey);
    }

    function cacheAllViews() {
        try {
            if (cacheQueue.length === 0) {
                isCaching = false;
                forceBackgroundUpdate = false;
                return;
            }
            const nextItem = cacheQueue.shift();
            const nextKey = getCacheKey(nextItem);

            if (!forceBackgroundUpdate && localStorage.getItem(nextKey) && isCacheFresh(nextKey)) {
                cacheAllViews();
                return;
            }

            fetchFreshData(nextKey, nextItem.view, nextItem.timeframe, nextItem.currentDate, cacheAllViews);
        } catch (error) {
            console.error('Error in cache queue:', error);
            // Reset flags on error to prevent stuck state
            isCaching = false;
            forceBackgroundUpdate = false;
        }
    }

    function fetchLeaderboardData(forceRefresh = false) {
        if (window.NTShared && window.NTShared.getCache && !forceRefresh) {
            const sharedData = window.NTShared.getCache(state.view);
            if (sharedData) {
                updateDateDisplay();
                // PASS SHARED TIMESTAMP
                const sharedTS = window.NTShared.getTimestamp ? window.NTShared.getTimestamp(state.view) : null;
                renderTable(sharedData, sharedTS);
                return;
            }
        }

        const cacheKey = getCacheKey();
        const cachedData = localStorage.getItem(cacheKey);
        updateDateDisplay();

        if (cachedData && isCacheFresh(cacheKey) && !forceRefresh) {
            try { renderTable(JSON.parse(cachedData)); return; }
            catch (e) { localStorage.removeItem(cacheKey); }
        }

        const container = document.getElementById('leaderboard-table-container');
        if (container) container.innerHTML = `<div class="tac pxl mtl"><div class="loading-spinner loading-spinner--ts" style="margin: 0 auto;"></div><div class="mtm">Loading data...</div></div>`;
        setIndicator('Updating...', true);
        fetchFreshData(cacheKey);
    }

    function fetchFreshData(cacheKey, view = state.view, timeframe = state.timeframe, currentDate = state.currentDate, callback) {
        const tempState = { view, timeframe, currentDate };
        let ranges = calculateDateRange(tempState);
        if (['60min', '24hr', '7day'].includes(timeframe)) {
            const roundToHour = (d) => { const date = new Date(d.replace(' ', 'T')); date.setMinutes(0, 0, 0); return formatDate(date); };
            ranges = { start: roundToHour(ranges.start), end: roundToHour(ranges.end) };
        }

        const apiUrl = view === 'individual' ? 'https://ntstartrack.org/api/individual-leaderboard' : 'https://ntstartrack.org/api/team-leaderboard';
        const url = `${apiUrl}?start_time=${encodeURIComponent(ranges.start)}&end_time=${encodeURIComponent(ranges.end)}&showbot=FALSE&cb=${new Date().getTime()}`;

        if (view === state.view && timeframe === state.timeframe) setIndicator('Updating...', true);

        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                if (response.status === 200) {
                    setTimeout(() => {
                        try {
                            if (!response.responseText || response.responseText.trim().length === 0) throw new Error('Empty');
                            let data = JSON.parse(response.responseText);
                            if (!Array.isArray(data)) throw new Error('Invalid format');
                            if (view === 'individual') data = data.filter(item => item.bot !== 1);

                            const now = Date.now();
                            saveToCache(cacheKey, JSON.stringify(data.slice(0, 100)));
                            if (window.NTShared && window.NTShared.setCache) window.NTShared.setCache(view, data, now + CACHE_DURATION);

                            // PASS 'now' AS TIMESTAMP
                            if (view === state.view && timeframe === state.timeframe) renderTable(data, now);
                            if (callback) callback();
                        } catch (e) {
                            console.error(e);
                            if (view === state.view && timeframe === state.timeframe) {
                                setIndicator(`Update failed`, false);
                                // Remove curtain on error
                                document.documentElement.classList.remove('is-leaderboard-route');
                                const main = document.querySelector('main.structure-content');
                                if (main) main.classList.remove('custom-loaded');
                            }
                            if (callback) callback();
                        }
                    }, ASYNC_DELAY);
                } else {
                    if (view === state.view && timeframe === state.timeframe) {
                        setIndicator(`Update failed`, false);
                        // Remove curtain on HTTP error
                        document.documentElement.classList.remove('is-leaderboard-route');
                        const main = document.querySelector('main.structure-content');
                        if (main) main.classList.remove('custom-loaded');
                    }
                    if (callback) callback();
                }
            },
            onerror: function() {
                if (view === state.view && timeframe === state.timeframe) {
                    setIndicator('Update failed', false);
                    // Remove curtain on network error
                    document.documentElement.classList.remove('is-leaderboard-route');
                    const main = document.querySelector('main.structure-content');
                    if (main) main.classList.remove('custom-loaded');
                }
                if (callback) callback();
            }
        });
    }

    function attachListeners() {
        document.querySelectorAll('[data-view]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                if (state.view !== view) { state.view = view; fetchLeaderboardData(false); }
            });
        });
        document.querySelectorAll('[data-timeframe]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tf = e.currentTarget.dataset.timeframe;
                if (state.timeframe !== tf) { state.timeframe = tf; state.currentDate = getCurrentCT(); fetchLeaderboardData(false); }
            });
        });
        document.getElementById('nav-prev')?.addEventListener('click', () => navigateDate(-1));
        document.getElementById('nav-next')?.addEventListener('click', () => navigateDate(1));
        document.getElementById('nav-today')?.addEventListener('click', () => { state.currentDate = getCurrentCT(); fetchLeaderboardData(true); });

        const refreshBtn = document.getElementById('manual-refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', (e) => {
                const icon = e.currentTarget.querySelector('svg');
                if(icon) icon.classList.add('icon-spin');

                fetchLeaderboardData(true);
                console.log('Triggering full background sync...');
                forceBackgroundUpdate = true;
                populateCacheQueue();
                if (!isCaching) {
                    isCaching = true;
                    cacheAllViews();
                }
            });
        }

        document.getElementById('update-custom')?.addEventListener('click', () => {
            const startVal = document.getElementById('start-date')?.value;
            const endVal = document.getElementById('end-date')?.value;
            if (startVal && endVal) {
                state.dateRange.start = getStartOfDay(new Date(startVal + 'T00:00:00'));
                state.dateRange.end = getEndOfDay(new Date(endVal + 'T00:00:00'));
                fetchLeaderboardData(true);
            }
        });
    }

    function renderLeaderboardPage(forceRefresh = false) {
        // Guard against duplicate renders
        if (pageRenderInProgress) return;
        pageRenderInProgress = true;

        const mainContent = document.querySelector('main.structure-content');
        if (!mainContent) {
            pageRenderInProgress = false;
            return;
        }

        try {
            loadCarData();
            mainContent.innerHTML = buildLeaderboardHTML();
            requestAnimationFrame(() => { mainContent.classList.add('custom-loaded'); });

            attachListeners();
            fetchLeaderboardData(forceRefresh);
            setActiveTab();
            setTabTitle();
            startHourlyCheck();
        } catch (error) {
            console.error('Error rendering leaderboard page:', error);
            // Remove curtain on error to prevent permanent blank page
            document.documentElement.classList.remove('is-leaderboard-route');
            if (mainContent) mainContent.classList.remove('custom-loaded');
        } finally {
            pageRenderInProgress = false;
        }
    }

    function setActiveTab() {
        document.querySelectorAll('.nav-list-item').forEach(li => li.classList.remove('is-current'));
        const tab = document.querySelector('.' + TAB_CLASS);
        if (tab) tab.classList.add('is-current');
    }

    function setTabTitle() {
        if (window.location.pathname === LEADERBOARD_PATH) document.title = 'Leaderboards | Nitro Type';
    }

    function insertLeaderboardTab() {
        if (document.querySelector(`a[href="${LEADERBOARD_PATH}"]`)) return;
        const navList = document.querySelector('.nav-list');
        if (!navList) return;

        const li = document.createElement('li');
        li.className = `nav-list-item ${TAB_CLASS}`;
        li.innerHTML = `<a href="${LEADERBOARD_PATH}" class="nav-link"><span class="has-notify">Leaderboards</span></a>`;

        const news = Array.from(navList.children).find(li => li.textContent.trim().includes('News'));
        if (news) news.before(li);
        else navList.appendChild(li);
    }

    function handlePage() {
        insertLeaderboardTab();
        if (location.pathname === LEADERBOARD_PATH) {
            if (document.getElementById('leaderboard-table-container')) { setActiveTab(); return; }
            const main = document.querySelector('main.structure-content');
            if (main && (main.children.length === 0 || main.querySelector('.error'))) renderLeaderboardPage();
        } else {
            document.querySelector('.' + TAB_CLASS)?.classList.remove('is-current');
            stopHourlyCheck();
        }
    }

    function fastInject() {
        insertLeaderboardTab();
        if (location.pathname === LEADERBOARD_PATH) {
            const waitForMain = new MutationObserver(() => {
                const main = document.querySelector('main.structure-content');
                if (main) {
                    if (main.children.length === 0 || main.querySelector('.error') || main.textContent.includes("Page Not Found")) {
                         renderLeaderboardPage();
                         waitForMain.disconnect();
                    }
                }
            });
            waitForMain.observe(document.documentElement, { childList: true, subtree: true });
        }
    }

    fastInject();

    const navObserver = new MutationObserver((mutations) => {
        if (!document.querySelector(`a[href="${LEADERBOARD_PATH}"]`)) insertLeaderboardTab();
        if (location.pathname === LEADERBOARD_PATH) {
            const main = document.querySelector('main.structure-content');
            if (main && (main.children.length === 0 || main.querySelector('.error') || main.textContent.includes("Page Not Found"))) {
                if (!main.classList.contains('custom-loaded')) {
                    renderLeaderboardPage();
                }
            }
        }
        handlePage();
    });

    navObserver.observe(document.documentElement, { childList: true, subtree: true });

})();
