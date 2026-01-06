// ==UserScript==
// @name         Nitro Type Startrack Leaderboard Integration
// @version      9.5
// @description  This script adds a custom Startrack Leaderboards tab to Nitro Type, providing advanced leaderboard functionality with multiple timeframes, intelligent caching, and a polished UI that closely matches the original Nitro Type leaderboard design.
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

        /* Position Change Arrows */
        .position-change {
            font-size: 10px;
            font-weight: bold;
            margin-right: 4px;
            vertical-align: middle;
            display: inline-flex;
            align-items: center;
            gap: 1px;
        }
        .position-change--up {
            color: #28a745;
        }
        .position-change--down {
            color: #dc3545;
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
    // 2. SHARED OPTIMIZATION LAYER (PROPERLY KEYED BY VIEW+TIMEFRAME+RANGE)
    // =================================================================
    window.NTShared = window.NTShared || {
        cache: new Map(), // Now uses Map with composite keys
        isbot: new Map(),

        _makeKey(view, timeframe, startKey, endKey) {
            return `${view}_${timeframe}_${startKey}_${endKey}`;
        },

        setCache(key, data, expiresAt) {
            this.cache.set(key, {
                data: data,
                timestamp: Date.now(),
                expiresAt: expiresAt || (Date.now() + 3600000)
            });
            window.dispatchEvent(new CustomEvent('nt-cache-updated', { detail: { key, data, expiresAt } }));
        },

        getCache(key) {
            const cached = this.cache.get(key);
            if (!cached || !cached.data) return null;
            if (Date.now() < cached.expiresAt) return cached.data;
            return null;
        },

        getTimestamp(key) {
            const cached = this.cache.get(key);
            return cached?.timestamp || null;
        },

        getBotStatus(username) { return this.isbot.get(username.toLowerCase()); },
        setBotStatus(username, status) { this.isbot.set(username.toLowerCase(), status); }
    };

    // --- CONFIGURATION ---
    const TAB_CLASS = 'nt-custom-leaderboards';
    const LEADERBOARD_PATH = '/leaderboards';
    const CACHE_KEY = 'ntStartrackCache_';
    const CACHE_TIMESTAMP_KEY = 'ntStartrackCacheTime_';
    const SEASON_CACHE_KEY = 'ntStartrackSeasonCache';
    const CACHE_DURATION = 60 * 60 * 1000;
    const ASYNC_DELAY = 50;

    // --- STATE ---
    let cacheQueue = [];
    let isCaching = false;
    let forceBackgroundUpdate = false;
    let initialCacheComplete = false;
    let carDataMap = {};
    let carDataLoaded = false;
    let carDataLoadAttempts = 0;
    const MAX_CAR_LOAD_ATTEMPTS = 10;
    let lastCheckedHour = null;
    let hourlyCheckInterval = null;
    let pageRenderInProgress = false;

    // Dynamic season data (loaded from NTBOOTSTRAP)
    let currentSeason = {
        seasonID: null,
        name: 'Season',
        startCT: null,
        endCT: null,
        startStampUTC: null,
        endStampUTC: null
    };

    let state = {
        view: 'individual',
        timeframe: 'season',
        currentDate: getCurrentCT(),
        dateRange: { start: null, end: null }
    };

    const timeframes = [
        { key: 'season', label: 'Season', hasNav: false },
        { key: '24hr', label: 'Last 24 Hours', hasNav: false },
        { key: '60min', label: '60 Minutes', hasNav: false },
        { key: '7day', label: 'Last 7 Days', hasNav: false },
        { key: 'daily', label: 'Daily', hasNav: true },
        { key: 'weekly', label: 'Weekly', hasNav: true },
        { key: 'monthly', label: 'Monthly', hasNav: true }
        // { key: 'custom', label: 'Custom', hasNav: false }  // TODO: Add custom date picker UI
    ];

    // =================================================================
    // 3. TIMEZONE & SEASON UTILITIES
    // =================================================================

    function getCurrentCT() {
        const now = new Date();
        const ctString = now.toLocaleString("en-US", { timeZone: "America/Chicago" });
        return new Date(ctString);
    }

    function getCurrentHour() { return new Date().getHours(); }

    // Convert Unix timestamp (UTC seconds) to CT-formatted string for Startrack API
    function utcToCTString(unixTimestamp) {
        const date = new Date(unixTimestamp * 1000);
        const ctString = date.toLocaleString("en-US", { timeZone: "America/Chicago" });
        const ctDate = new Date(ctString);
        return formatDate(ctDate);
    }

    // Convert Unix timestamp to user's local timezone for display
    function utcToLocalDate(unixTimestamp) {
        return new Date(unixTimestamp * 1000);
    }

    // Check if cache should be refreshed (within 1 week of season end)
    function shouldRefreshSeasonCache(endStampUTC) {
        if (!endStampUTC) return true;
        const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
        const endMs = endStampUTC * 1000;
        const now = Date.now();
        return (endMs - now) < oneWeekMs;
    }

    // Load season data from NTBOOTSTRAP or cache
    function loadSeasonData() {
        // 1. Check localStorage cache first
        try {
            const cached = localStorage.getItem(SEASON_CACHE_KEY);
            if (cached) {
                const seasonCache = JSON.parse(cached);
                // If cache exists and we're NOT within 1 week of end, use it
                if (!shouldRefreshSeasonCache(seasonCache.endStampUTC)) {
                    currentSeason = seasonCache;
                    console.log('[Startrack] Using cached season data:', currentSeason.name);
                    return;
                }
            }
        } catch (e) {
            console.warn('[Startrack] Error reading season cache:', e);
        }

        // 2. Parse NTBOOTSTRAP for ACTIVE_SEASONS
        if (typeof NTBOOTSTRAP === 'function') {
            try {
                const bootstrapData = NTBOOTSTRAP();
                const seasonsData = bootstrapData.find(item => item[0] === 'ACTIVE_SEASONS');

                if (seasonsData && seasonsData[1] && seasonsData[1].length > 0) {
                    const now = Math.floor(Date.now() / 1000); // Current time in UTC seconds

                    // Find the current active season (now >= startStamp && now < endStamp)
                    let activeSeason = seasonsData[1].find(s => now >= s.startStamp && now < s.endStamp);

                    // If no active season, use the most recent/upcoming one
                    if (!activeSeason) {
                        activeSeason = seasonsData[1][0];
                    }

                    if (activeSeason) {
                        currentSeason = {
                            seasonID: activeSeason.seasonID,
                            name: activeSeason.name,
                            startStampUTC: activeSeason.startStamp,
                            endStampUTC: activeSeason.endStamp,
                            startCT: utcToCTString(activeSeason.startStamp),
                            endCT: utcToCTString(activeSeason.endStamp)
                        };

                        // Cache the season data
                        localStorage.setItem(SEASON_CACHE_KEY, JSON.stringify(currentSeason));
                        console.log('[Startrack] Loaded season from NTBOOTSTRAP:', currentSeason.name);
                        return;
                    }
                }
            } catch (e) {
                console.warn('[Startrack] Error parsing NTBOOTSTRAP for seasons:', e);
            }
        }

        // 3. Fallback: try to use cached data even if expired
        try {
            const cached = localStorage.getItem(SEASON_CACHE_KEY);
            if (cached) {
                currentSeason = JSON.parse(cached);
                console.log('[Startrack] Using expired cache as fallback:', currentSeason.name);
                return;
            }
        } catch (e) {}

        // 4. Ultimate fallback - this shouldn't happen normally
        console.warn('[Startrack] Could not load season data, using defaults');
        currentSeason = {
            seasonID: null,
            name: 'Season',
            startCT: '2025-01-01 00:00:00',
            endCT: '2025-12-31 23:59:59',
            startStampUTC: null,
            endStampUTC: null
        };
    }

    // Format season dates for display (user's local timezone)
    function getSeasonDisplayDates() {
        if (!currentSeason.startStampUTC || !currentSeason.endStampUTC) {
            return { startDisplay: 'Unknown', endDisplay: 'Unknown' };
        }

        const startLocal = utcToLocalDate(currentSeason.startStampUTC);
        const endLocal = utcToLocalDate(currentSeason.endStampUTC);

        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return {
            startDisplay: startLocal.toLocaleDateString(undefined, options),
            endDisplay: endLocal.toLocaleDateString(undefined, options)
        };
    }

    // =================================================================
    // 4. POSITION CHANGE HELPER
    // =================================================================

    function getPositionChangeHTML(change) {
        if (change === null || change === undefined || change === 0) {
            return '';
        }
        if (change > 0) {
            return `<span class="position-change position-change--up">▲${change}</span>`;
        } else {
            return `<span class="position-change position-change--down">▼${Math.abs(change)}</span>`;
        }
    }

    // =================================================================
    // 5. CAR DATA LOADING (DEFERRED WITH RETRY)
    // =================================================================

    function loadCarData(callback) {
        // Check cache timestamp first
        const cacheTimestamp = localStorage.getItem('ntCarDataMapTimestamp');
        const cacheAge = cacheTimestamp ? Date.now() - parseInt(cacheTimestamp) : Infinity;
        const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

        // Try loading from cache if it's less than 7 days old
        if (cacheAge < SEVEN_DAYS) {
            const cached = localStorage.getItem('ntCarDataMap');
            if (cached) {
                try {
                    carDataMap = JSON.parse(cached);
                    if (Object.keys(carDataMap).length > 0) {
                        carDataLoaded = true;
                        console.log(`[Startrack] Loaded ${Object.keys(carDataMap).length} cars from cache`);
                        if (callback) callback(true);
                        return;
                    }
                } catch (e) {
                    console.warn('[Startrack] Failed to parse cached car data');
                }
            }
        }

        // Try to load from NTBOOTSTRAP
        if (typeof NTBOOTSTRAP === 'function') {
            try {
                const bootstrapData = NTBOOTSTRAP();
                const carsData = bootstrapData.find(item => item[0] === 'CARS');

                if (carsData && carsData[1] && carsData[1].length > 0) {
                    carsData[1].forEach(car => {
                        if (car.carID && car.options && car.options.smallSrc) {
                            carDataMap[car.carID] = car.options.smallSrc;
                        }
                    });

                    if (Object.keys(carDataMap).length > 0) {
                        localStorage.setItem('ntCarDataMap', JSON.stringify(carDataMap));
                        localStorage.setItem('ntCarDataMapTimestamp', Date.now().toString());
                        carDataLoaded = true;
                        console.log(`[Startrack] Loaded ${Object.keys(carDataMap).length} cars from NTBOOTSTRAP`);
                        if (callback) callback(true);
                        return;
                    }
                }
            } catch (e) {
                console.warn('[Startrack] Error loading from NTBOOTSTRAP:', e);
            }
        }

        // NTBOOTSTRAP not available yet - retry
        carDataLoadAttempts++;
        if (carDataLoadAttempts < MAX_CAR_LOAD_ATTEMPTS) {
            console.log(`[Startrack] NTBOOTSTRAP not ready, retry ${carDataLoadAttempts}/${MAX_CAR_LOAD_ATTEMPTS}...`);
            setTimeout(() => loadCarData(callback), 500);
            return;
        }

        // Max attempts reached - try expired cache as fallback
        const cached = localStorage.getItem('ntCarDataMap');
        if (cached) {
            try {
                carDataMap = JSON.parse(cached);
                if (Object.keys(carDataMap).length > 0) {
                    carDataLoaded = true;
                    console.log(`[Startrack] Using expired car cache (${Object.keys(carDataMap).length} cars)`);
                    if (callback) callback(true);
                    return;
                }
            } catch (e) {}
        }

        console.error('[Startrack] Failed to load car data after all attempts');
        carDataLoaded = true; // Mark as loaded to prevent infinite retries
        if (callback) callback(false);
    }

    function getCarImage(carID, carHueAngle) {
        const smallSrc = carDataMap[carID];

        if (smallSrc) {
            // If car has a hue angle, use painted version
            if (carHueAngle !== null && carHueAngle !== undefined && carHueAngle !== 0) {
                // Format: /cars/painted/{smallSrc without .png}_{hue}.png
                const baseImage = smallSrc.replace('.png', '');
                const url = `https://www.nitrotype.com/cars/painted/${baseImage}_${carHueAngle}.png`;
                // Debug: uncomment to trace image URLs
                // console.log(`[Startrack] Car ${carID}: painted → ${url}`);
                return url;
            }
            // Unpainted car - use smallSrc directly
            // Debug: uncomment to trace image URLs
            // console.log(`[Startrack] Car ${carID}: unpainted → /cars/${smallSrc}`);
            return `https://www.nitrotype.com/cars/${smallSrc}`;
        }

        // Fallback - unpainted rental car (identifiable error state)
        console.warn(`[Startrack] Unknown car ID: ${carID}, carDataMap has ${Object.keys(carDataMap).length} entries`);
        return `https://www.nitrotype.com/cars/9_small_1.png`;
    }

    // =================================================================
    // 6. OTHER UTILITIES
    // =================================================================

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

        if (timeframe === 'season') {
            // Use dynamic season data
            return { start: currentSeason.startCT, end: currentSeason.endCT };
        }
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

    // Generate a cache key for both localStorage and RAM cache
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
            const posChangeHTML = getPositionChangeHTML(item.position_change);

            // Position change BEFORE rank/medal
            let medalHTML = `<div class="mhc">${posChangeHTML}<span class="h3 tc-ts">${rank}</span></div>`;

            if (rank === 1) {
                rowClass = 'table-row table-row--gold';
                medalHTML = `<div class="mhc">${posChangeHTML}<img class="db" src="/dist/site/images/medals/gold-sm.png"></div>`;
            } else if (rank === 2) {
                rowClass = 'table-row table-row--silver';
                medalHTML = `<div class="mhc">${posChangeHTML}<img class="db" src="/dist/site/images/medals/silver-sm.png"></div>`;
            } else if (rank === 3) {
                rowClass = 'table-row table-row--bronze';
                medalHTML = `<div class="mhc">${posChangeHTML}<img class="db" src="/dist/site/images/medals/bronze-sm.png"></div>`;
            }

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
                const title = item.title || 'Untitled';

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
                    <td class="table-cell table-cell--team"><span class="tc-lemon">"${teamName}"</span></td>
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

        if (state.timeframe === 'season') {
            // Use dynamic season name and dates
            titleEl.textContent = currentSeason.name || 'Season';
            const seasonDates = getSeasonDisplayDates();
            rangeEl.textContent = `${seasonDates.startDisplay} - ${seasonDates.endDisplay}`;
        }
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
            isCaching = false;
            forceBackgroundUpdate = false;
        }
    }

    function fetchLeaderboardData(forceRefresh = false) {
        const cacheKey = getCacheKey();

        // Check RAM cache first (now properly keyed)
        if (window.NTShared && window.NTShared.getCache && !forceRefresh) {
            const sharedData = window.NTShared.getCache(cacheKey);
            if (sharedData) {
                updateDateDisplay();
                const sharedTS = window.NTShared.getTimestamp(cacheKey);
                renderTable(sharedData, sharedTS);
                return;
            }
        }

        // Check localStorage cache
        const cachedData = localStorage.getItem(cacheKey);
        updateDateDisplay();

        if (cachedData && isCacheFresh(cacheKey) && !forceRefresh) {
            try {
                const data = JSON.parse(cachedData);
                renderTable(data);
                return;
            }
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
                            const top100 = data.slice(0, 100);
                            saveToCache(cacheKey, JSON.stringify(top100));

                            // Save to RAM cache with proper key
                            if (window.NTShared && window.NTShared.setCache) {
                                window.NTShared.setCache(cacheKey, top100, now + CACHE_DURATION);
                            }

                            if (view === state.view && timeframe === state.timeframe) renderTable(data, now);
                            if (callback) callback();
                        } catch (e) {
                            console.error(e);
                            if (view === state.view && timeframe === state.timeframe) {
                                setIndicator(`Update failed`, false);
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
        if (pageRenderInProgress) return;
        pageRenderInProgress = true;

        const mainContent = document.querySelector('main.structure-content');
        if (!mainContent) {
            pageRenderInProgress = false;
            return;
        }

        try {
            // Load season data first (this can use NTBOOTSTRAP or cache)
            loadSeasonData();

            // Build HTML immediately
            mainContent.innerHTML = buildLeaderboardHTML();
            requestAnimationFrame(() => { mainContent.classList.add('custom-loaded'); });

            attachListeners();
            setActiveTab();
            setTabTitle();
            startHourlyCheck();

            // Defer car loading with retry mechanism
            loadCarData((success) => {
                if (success) {
                    console.log('[Startrack] Car data ready, fetching leaderboard...');
                }
                // Fetch leaderboard data after car data is loaded (or failed)
                fetchLeaderboardData(forceRefresh);
            });

        } catch (error) {
            console.error('Error rendering leaderboard page:', error);
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