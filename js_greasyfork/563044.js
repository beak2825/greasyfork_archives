// ==UserScript==
// @name         TORN War Overwatcher
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Track enemy faction activity patterns during war - shows when enemies are most/least active
// @author       Marko
// @match        https://www.torn.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/563044/TORN%20War%20Overwatcher.user.js
// @updateURL https://update.greasyfork.org/scripts/563044/TORN%20War%20Overwatcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================================
    // CONFIGURATION - EDIT THESE VALUES
    // ============================================
    const CONFIG = {
        API_KEY: 'YOUR_API_KEY_HERE', // Replace with your TORN API key
        POLL_INTERVAL: 30000,          // How often to check (ms) - 30 seconds default
        STORAGE_KEY: 'tornWarOverwatcher_data',
        MAX_HISTORY_DAYS: 7,           // How many days of data to keep

        // API Rate limiting - TORN allows 100 calls/min, we stay well under
        MAX_CALLS_PER_MINUTE: 50,      // Stay at 50% of limit to be safe
        MIN_DELAY_BETWEEN_CALLS: 1500, // Minimum 1.5 sec between API calls

        // Page where UI should be visible (check both with and without hash)
        UI_VISIBLE_PATTERNS: [
            'factions.php?step=your&type=1',
            'factions.php?step=your',
            '/factions.php'
        ],

        // Timezone options
        TIMEZONES: {
            'TCT': { label: 'TCT (UTC)', offset: 0 },
            'PST': { label: 'PST (UTC-8)', offset: -8 },
            'CET': { label: 'CET (UTC+1)', offset: 1 },
            'EET': { label: 'EET (UTC+2)', offset: 2 }
        },
        DEFAULT_TIMEZONE: 'TCT'
    };

    // ============================================
    // HELPER: Check if current page should show UI
    // ============================================
    function shouldShowUI() {
        const url = window.location.href;
        const pathname = window.location.pathname;
        const search = window.location.search;

        // Debug logging
        console.log('[Overwatcher] URL Check:', { url, pathname, search });

        // Check if we're on any faction war related page
        if (pathname.includes('factions.php')) {
            // Show on war pages specifically
            if (search.includes('step=your') || url.includes('#/war')) {
                console.log('[Overwatcher] UI page detected!');
                return true;
            }
        }

        return false;
    }

    // ============================================
    // STYLES
    // ============================================
    GM_addStyle(`
        #overwatcher-panel {
            width: 100%;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border: 2px solid #0f3460;
            border-radius: 10px;
            padding: 15px;
            font-family: Arial, sans-serif;
            color: #e4e4e4;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            margin-bottom: 10px;
            box-sizing: border-box;
        }

        #overwatcher-panel.minimized .ow-content {
            display: none;
        }

        .ow-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #0f3460;
        }

        .ow-header h3 {
            margin: 0;
            color: #e94560;
            font-size: 16px;
        }

        .ow-btn {
            background: #e94560;
            border: none;
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 12px;
            margin-left: 5px;
        }

        .ow-btn:hover {
            background: #ff6b6b;
        }

        .ow-btn.secondary {
            background: #0f3460;
        }

        .ow-btn.secondary:hover {
            background: #1a4a7a;
        }

        .ow-section {
            margin-bottom: 15px;
        }

        .ow-section h4 {
            margin: 0 0 10px 0;
            color: #00d9ff;
            font-size: 14px;
        }

        .ow-enemy-faction {
            background: #0f3460;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 10px;
        }

        .ow-enemy-faction h5 {
            margin: 0 0 8px 0;
            color: #ff9f43;
        }

        .ow-stat-row {
            display: flex;
            justify-content: space-between;
            padding: 3px 0;
            font-size: 12px;
        }

        .ow-stat-label {
            color: #a0a0a0;
        }

        .ow-stat-value {
            color: #00ff88;
        }

        .ow-stat-value.danger {
            color: #ff4757;
        }

        .ow-stat-value.warning {
            color: #ffa502;
        }

        .ow-status.warning {
            color: #ffa502;
        }

        .ow-hour-chart {
            display: flex;
            height: 60px;
            align-items: flex-end;
            gap: 1px;
            margin-top: 10px;
            background: #0a0a1a;
            padding: 5px;
            border-radius: 5px;
        }

        .ow-hour-bar {
            flex: 1;
            min-width: 8px;
            border-radius: 2px 2px 0 0;
            position: relative;
            cursor: pointer;
            display: flex;
            flex-direction: column-reverse;
        }

        .ow-hour-bar:hover::after {
            content: attr(data-tooltip);
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            background: #000;
            color: #fff;
            padding: 3px 6px;
            border-radius: 3px;
            font-size: 10px;
            white-space: nowrap;
            z-index: 10;
        }

        .ow-bar-online {
            background: #00ff88;
            width: 100%;
            border-radius: 0 0 0 0;
        }

        .ow-bar-idle {
            background: #ffa502;
            width: 100%;
            border-radius: 2px 2px 0 0;
        }

        .ow-hour-bar .ow-bar-online:only-child {
            border-radius: 2px 2px 0 0;
        }

        .ow-input-group {
            margin-bottom: 10px;
        }

        .ow-input-group label {
            display: block;
            margin-bottom: 5px;
            font-size: 12px;
            color: #a0a0a0;
        }

        .ow-input-group input {
            width: 100%;
            padding: 8px;
            border: 1px solid #0f3460;
            border-radius: 5px;
            background: #0a0a1a;
            color: #e4e4e4;
            box-sizing: border-box;
        }

        .ow-status {
            font-size: 11px;
            color: #666;
            margin-top: 10px;
            text-align: center;
        }

        .ow-status.active {
            color: #00ff88;
        }

        .ow-status.error {
            color: #ff4757;
        }

        .ow-member-list {
            max-height: 200px;
            overflow-y: auto;
            font-size: 11px;
        }

        .ow-member {
            display: flex;
            justify-content: space-between;
            padding: 3px 5px;
            border-radius: 3px;
        }

        .ow-member:nth-child(odd) {
            background: rgba(255,255,255,0.05);
        }

        .ow-member.online {
            border-left: 3px solid #00ff88;
        }

        .ow-member.idle {
            border-left: 3px solid #ffa502;
        }

        .ow-member.offline {
            border-left: 3px solid #ff4757;
        }

        .ow-member.clickable {
            cursor: pointer;
        }

        .ow-member.clickable:hover {
            background: rgba(233, 69, 96, 0.2);
        }

        .ow-member-detail {
            background: #0a0a1a;
            border: 1px solid #0f3460;
            border-radius: 5px;
            padding: 10px;
            margin-top: 10px;
        }

        .ow-member-detail h5 {
            margin: 0 0 10px 0;
            color: #e94560;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .ow-member-detail .close-btn {
            background: none;
            border: none;
            color: #ff4757;
            cursor: pointer;
            font-size: 16px;
        }

        .ow-mini-chart {
            display: flex;
            height: 40px;
            align-items: flex-end;
            gap: 1px;
            background: #1a1a2e;
            padding: 3px;
            border-radius: 3px;
            margin-top: 5px;
        }

        .ow-mini-bar {
            flex: 1;
            background: #e94560;
            min-width: 6px;
            border-radius: 1px 1px 0 0;
        }

        .ow-mini-bar.low { background: #00ff88; }
        .ow-mini-bar.med { background: #ffa502; }
        .ow-mini-bar.high { background: #ff4757; }

        .ow-tabs {
            display: flex;
            gap: 5px;
            margin-bottom: 15px;
        }

        .ow-tab {
            flex: 1;
            padding: 8px;
            background: #0f3460;
            border: none;
            color: #a0a0a0;
            cursor: pointer;
            border-radius: 5px;
            font-size: 12px;
        }

        .ow-tab.active {
            background: #e94560;
            color: white;
        }

        /* Grid layout for factions when we have multiple */
        .ow-factions-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 10px;
        }

        /* Timezone selector */
        .ow-timezone-selector {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 10px;
            margin-bottom: 15px;
            padding: 8px;
            background: #0a0a1a;
            border-radius: 5px;
        }

        .ow-timezone-selector label {
            font-size: 12px;
            color: #a0a0a0;
        }

        .ow-timezone-selector select {
            padding: 6px 10px;
            background: #0f3460;
            border: 1px solid #1a4a7a;
            border-radius: 5px;
            color: #e4e4e4;
            font-size: 12px;
            cursor: pointer;
        }

        .ow-timezone-selector select:hover {
            border-color: #e94560;
        }

        .ow-timezone-selector select:focus {
            outline: none;
            border-color: #e94560;
        }
    `);

    // ============================================
    // TIMEZONE HELPERS
    // ============================================
    function getUTCHour(timestamp = Date.now()) {
        return new Date(timestamp).getUTCHours();
    }

    function convertUTCHourToTimezone(utcHour, timezoneKey) {
        const tz = CONFIG.TIMEZONES[timezoneKey];
        if (!tz) return utcHour;

        let hour = utcHour + tz.offset;
        // Wrap around for negative or >23 hours
        if (hour < 0) hour += 24;
        if (hour >= 24) hour -= 24;
        return hour;
    }

    function formatHourWithTimezone(utcHour, timezoneKey) {
        const displayHour = convertUTCHourToTimezone(utcHour, timezoneKey);
        return `${String(displayHour).padStart(2, '0')}:00`;
    }

    // ============================================
    // RATE LIMITER - Prevents API overuse
    // ============================================
    class RateLimiter {
        constructor() {
            this.calls = [];
            this.storageKey = 'tornWarOverwatcher_rateLimiter';
            this.load();
        }

        load() {
            const stored = GM_getValue(this.storageKey, null);
            if (stored) {
                try {
                    this.calls = JSON.parse(stored).filter(t => Date.now() - t < 60000);
                } catch (e) {
                    this.calls = [];
                }
            }
        }

        save() {
            // Only keep calls from last minute
            this.calls = this.calls.filter(t => Date.now() - t < 60000);
            GM_setValue(this.storageKey, JSON.stringify(this.calls));
        }

        canMakeCall() {
            this.calls = this.calls.filter(t => Date.now() - t < 60000);
            return this.calls.length < CONFIG.MAX_CALLS_PER_MINUTE;
        }

        recordCall() {
            this.calls.push(Date.now());
            this.save();
        }

        getCallsInLastMinute() {
            this.calls = this.calls.filter(t => Date.now() - t < 60000);
            return this.calls.length;
        }

        getTimeUntilNextSlot() {
            if (this.canMakeCall()) return 0;
            const oldestCall = Math.min(...this.calls);
            return Math.max(0, 60000 - (Date.now() - oldestCall));
        }
    }

    // ============================================
    // DATA STORAGE
    // ============================================
    class DataStore {
        constructor() {
            this.data = this.load();
        }

        load() {
            const stored = GM_getValue(CONFIG.STORAGE_KEY, null);
            if (stored) {
                try {
                    return JSON.parse(stored);
                } catch (e) {
                    console.error('Failed to parse stored data:', e);
                }
            }
            return {
                factions: {},
                settings: {
                    apiKey: CONFIG.API_KEY,
                    timezone: CONFIG.DEFAULT_TIMEZONE
                }
            };
        }

        save() {
            GM_setValue(CONFIG.STORAGE_KEY, JSON.stringify(this.data));
        }

        setTimezone(timezone) {
            if (CONFIG.TIMEZONES[timezone]) {
                this.data.settings.timezone = timezone;
                this.save();
            }
        }

        getTimezone() {
            return this.data.settings.timezone || CONFIG.DEFAULT_TIMEZONE;
        }

        recordActivity(factionId, factionName, members) {
            const now = Date.now();
            const utcHour = getUTCHour(now);  // Always store in UTC

            if (!this.data.factions[factionId]) {
                this.data.factions[factionId] = {
                    name: factionName,
                    hourlyActivity: {},
                    snapshots: [],
                    members: {}
                };
            }

            const faction = this.data.factions[factionId];
            faction.name = factionName;

            // Count current online/idle/offline
            let online = 0, idle = 0, offline = 0;
            const memberStatuses = {};

            for (const [memberId, member] of Object.entries(members)) {
                const status = member.last_action?.status || 'Offline';
                memberStatuses[memberId] = {
                    name: member.name,
                    status: status,
                    lastAction: member.last_action?.timestamp || 0,
                    state: member.status?.state || 'Unknown'
                };

                if (status === 'Online') online++;
                else if (status === 'Idle') idle++;
                else offline++;

                // Track individual member activity
                if (!faction.members[memberId]) {
                    faction.members[memberId] = {
                        name: member.name,
                        activityHistory: []
                    };
                }
                faction.members[memberId].name = member.name;
                faction.members[memberId].activityHistory.push({
                    timestamp: now,
                    status: status,
                    state: member.status?.state
                });

                // Keep only last 7 days of history per member
                const cutoff = now - (CONFIG.MAX_HISTORY_DAYS * 24 * 60 * 60 * 1000);
                faction.members[memberId].activityHistory = faction.members[memberId].activityHistory.filter(h => h.timestamp > cutoff);
            }

            // Record hourly activity (in UTC)
            if (!faction.hourlyActivity[utcHour]) {
                faction.hourlyActivity[utcHour] = { samples: 0, totalOnline: 0, totalIdle: 0 };
            }
            faction.hourlyActivity[utcHour].samples++;
            faction.hourlyActivity[utcHour].totalOnline += online;
            faction.hourlyActivity[utcHour].totalIdle += idle;

            // Store snapshot
            faction.snapshots.push({
                timestamp: now,
                hour: utcHour,  // Store UTC hour
                online: online,
                idle: idle,
                offline: offline,
                total: Object.keys(members).length,
                members: memberStatuses
            });

            // Keep only last 7 days of snapshots
            const cutoff = now - (CONFIG.MAX_HISTORY_DAYS * 24 * 60 * 60 * 1000);
            faction.snapshots = faction.snapshots.filter(s => s.timestamp > cutoff);

            this.save();
            return { online, idle, offline, total: Object.keys(members).length };
        }

        getHourlyStats(factionId) {
            const faction = this.data.factions[factionId];
            if (!faction) return null;

            const stats = [];
            for (let h = 0; h < 24; h++) {
                const hourData = faction.hourlyActivity[h];
                if (hourData && hourData.samples > 0) {
                    stats.push({
                        hour: h,
                        avgOnline: hourData.totalOnline / hourData.samples,
                        avgIdle: hourData.totalIdle / hourData.samples,
                        samples: hourData.samples
                    });
                } else {
                    stats.push({ hour: h, avgOnline: 0, avgIdle: 0, samples: 0 });
                }
            }
            return stats;
        }

        getBestAttackTimes(factionId) {
            const stats = this.getHourlyStats(factionId);
            if (!stats) return null;

            // Sort by lowest activity (best time to attack/chain)
            const sorted = [...stats]
                .filter(s => s.samples > 0)
                .sort((a, b) => (a.avgOnline + a.avgIdle * 0.5) - (b.avgOnline + b.avgIdle * 0.5));

            return {
                bestHours: sorted.slice(0, 3),
                worstHours: sorted.slice(-3).reverse()
            };
        }

        getLatestSnapshot(factionId) {
            const faction = this.data.factions[factionId];
            if (!faction || faction.snapshots.length === 0) return null;
            return faction.snapshots[faction.snapshots.length - 1];
        }

        getMemberHourlyStats(factionId, memberId) {
            const faction = this.data.factions[factionId];
            if (!faction || !faction.members[memberId]) return null;

            const member = faction.members[memberId];
            const hourlyStats = {};

            // Initialize all hours
            for (let h = 0; h < 24; h++) {
                hourlyStats[h] = { online: 0, idle: 0, offline: 0, total: 0 };
            }

            // Count activity per hour (using UTC)
            for (const entry of member.activityHistory) {
                const hour = getUTCHour(entry.timestamp);
                hourlyStats[hour].total++;
                if (entry.status === 'Online') hourlyStats[hour].online++;
                else if (entry.status === 'Idle') hourlyStats[hour].idle++;
                else hourlyStats[hour].offline++;
            }

            // Convert to activity percentage per hour
            const result = [];
            for (let h = 0; h < 24; h++) {
                const stat = hourlyStats[h];
                const activePercent = stat.total > 0
                    ? ((stat.online + stat.idle * 0.5) / stat.total * 100)
                    : 0;
                result.push({
                    hour: h,
                    activePercent: activePercent,
                    online: stat.online,
                    idle: stat.idle,
                    offline: stat.offline,
                    samples: stat.total
                });
            }

            return {
                name: member.name,
                hourlyStats: result,
                totalSamples: member.activityHistory.length
            };
        }

        getExtendedStats(factionId) {
            const faction = this.data.factions[factionId];
            if (!faction || !faction.snapshots || faction.snapshots.length === 0) return null;

            const now = Date.now();
            const oneDayAgo = now - (24 * 60 * 60 * 1000);

            // Filter snapshots from last 24 hours
            const recentSnapshots = faction.snapshots.filter(s => s.timestamp > oneDayAgo);
            if (recentSnapshots.length === 0) return null;

            // 1. Unique members who were online in last 24h
            const uniqueOnlineMembers = new Set();
            for (const snapshot of recentSnapshots) {
                if (snapshot.members) {
                    for (const [memberId, member] of Object.entries(snapshot.members)) {
                        if (member.status === 'Online' || member.status === 'Idle') {
                            uniqueOnlineMembers.add(memberId);
                        }
                    }
                }
            }

            // 2. Peak online moment in last 24h
            let peakOnline = 0;
            let peakHour = 0;
            for (const snapshot of recentSnapshots) {
                const totalActive = snapshot.online + snapshot.idle;
                if (totalActive > peakOnline) {
                    peakOnline = totalActive;
                    peakHour = snapshot.hour;
                }
            }

            // 3. Average idle duration (estimate based on consecutive idle statuses)
            let totalIdleStreaks = 0;
            let idleStreakCount = 0;

            for (const [memberId, member] of Object.entries(faction.members || {})) {
                if (!member.activityHistory) continue;

                const recentHistory = member.activityHistory.filter(h => h.timestamp > oneDayAgo);
                let currentIdleStreak = 0;

                for (const entry of recentHistory) {
                    if (entry.status === 'Idle') {
                        currentIdleStreak++;
                    } else {
                        if (currentIdleStreak > 0) {
                            totalIdleStreaks += currentIdleStreak;
                            idleStreakCount++;
                        }
                        currentIdleStreak = 0;
                    }
                }
                // Don't forget last streak
                if (currentIdleStreak > 0) {
                    totalIdleStreaks += currentIdleStreak;
                    idleStreakCount++;
                }
            }

            // Convert streak count to approximate minutes (each sample is ~30 sec)
            const avgIdleMinutes = idleStreakCount > 0
                ? Math.round((totalIdleStreaks / idleStreakCount) * 0.5)
                : 0;

            let avgIdleDuration;
            if (avgIdleMinutes < 1) {
                avgIdleDuration = '< 1 min';
            } else if (avgIdleMinutes < 60) {
                avgIdleDuration = `~${avgIdleMinutes} min`;
            } else {
                const hours = Math.floor(avgIdleMinutes / 60);
                const mins = avgIdleMinutes % 60;
                avgIdleDuration = `~${hours}h ${mins}m`;
            }

            return {
                uniqueOnline24h: uniqueOnlineMembers.size,
                peakOnline24h: peakOnline,
                peakHour24h: peakHour,
                avgIdleDuration: avgIdleDuration
            };
        }

        getMemberExtendedStats(factionId, memberId) {
            const faction = this.data.factions[factionId];
            if (!faction || !faction.members || !faction.members[memberId]) return null;

            const member = faction.members[memberId];
            if (!member.activityHistory || member.activityHistory.length === 0) return null;

            const now = Date.now();
            const oneDayAgo = now - (24 * 60 * 60 * 1000);

            // Filter to last 24 hours
            const recentHistory = member.activityHistory.filter(h => h.timestamp > oneDayAgo);
            if (recentHistory.length === 0) return null;

            // Count times they came online (transitions from offline/idle to online)
            let timesOnline = 0;
            let lastStatus = null;
            for (const entry of recentHistory) {
                if (entry.status === 'Online' && lastStatus !== 'Online') {
                    timesOnline++;
                }
                lastStatus = entry.status;
            }

            // Calculate average session length
            let totalSessionSamples = 0;
            let sessionCount = 0;
            let currentSession = 0;

            for (const entry of recentHistory) {
                if (entry.status === 'Online' || entry.status === 'Idle') {
                    currentSession++;
                } else {
                    if (currentSession > 0) {
                        totalSessionSamples += currentSession;
                        sessionCount++;
                    }
                    currentSession = 0;
                }
            }
            // Don't forget current session
            if (currentSession > 0) {
                totalSessionSamples += currentSession;
                sessionCount++;
            }

            // Convert to minutes (each sample ~30 sec)
            const avgSessionMinutes = sessionCount > 0
                ? Math.round((totalSessionSamples / sessionCount) * 0.5)
                : 0;

            let avgSessionLength;
            if (avgSessionMinutes < 1) {
                avgSessionLength = '< 1 min';
            } else if (avgSessionMinutes < 60) {
                avgSessionLength = `~${avgSessionMinutes} min`;
            } else {
                const hours = Math.floor(avgSessionMinutes / 60);
                const mins = avgSessionMinutes % 60;
                avgSessionLength = `~${hours}h ${mins}m`;
            }

            return {
                timesOnline24h: timesOnline,
                avgSessionLength: avgSessionLength
            };
        }

        setApiKey(key) {
            this.data.settings.apiKey = key;
            this.save();
        }

        getApiKey() {
            return this.data.settings.apiKey || CONFIG.API_KEY;
        }

        clearFactionData(factionId) {
            if (this.data.factions[factionId]) {
                delete this.data.factions[factionId];
                this.save();
            }
        }

        exportData() {
            return JSON.stringify(this.data, null, 2);
        }
    }

    // ============================================
    // API HANDLER
    // ============================================
    class TornAPI {
        constructor(dataStore, rateLimiter) {
            this.dataStore = dataStore;
            this.rateLimiter = rateLimiter;
            this.lastCallTime = 0;
        }

        async fetch(endpoint) {
            // Check rate limit
            if (!this.rateLimiter.canMakeCall()) {
                const waitTime = this.rateLimiter.getTimeUntilNextSlot();
                throw new Error(`Rate limited - wait ${Math.ceil(waitTime/1000)}s (${this.rateLimiter.getCallsInLastMinute()}/${CONFIG.MAX_CALLS_PER_MINUTE} calls/min)`);
            }

            // Enforce minimum delay between calls
            const timeSinceLastCall = Date.now() - this.lastCallTime;
            if (timeSinceLastCall < CONFIG.MIN_DELAY_BETWEEN_CALLS) {
                await new Promise(r => setTimeout(r, CONFIG.MIN_DELAY_BETWEEN_CALLS - timeSinceLastCall));
            }

            return new Promise((resolve, reject) => {
                const apiKey = this.dataStore.getApiKey();
                if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
                    reject(new Error('API key not configured'));
                    return;
                }

                this.rateLimiter.recordCall();
                this.lastCallTime = Date.now();

                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://api.torn.com/${endpoint}&key=${apiKey}`,
                    onload: (response) => {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data.error) {
                                reject(new Error(`API Error ${data.error.code}: ${data.error.error}`));
                            } else {
                                resolve(data);
                            }
                        } catch (e) {
                            reject(new Error('Failed to parse API response'));
                        }
                    },
                    onerror: (error) => {
                        reject(new Error('Network error'));
                    }
                });
            });
        }

        async getFactionBasic(factionId) {
            return this.fetch(`faction/${factionId}?selections=basic`);
        }
    }

    // ============================================
    // UI PANEL
    // ============================================
    class OverwatcherUI {
        constructor(dataStore, api, rateLimiter) {
            this.dataStore = dataStore;
            this.api = api;
            this.rateLimiter = rateLimiter;
            this.trackedFactions = new Set();
            this.pollingInterval = null;
            this.currentTab = 'live';
            this.panel = null;
            this.isUIPage = shouldShowUI();

            // Load tracked factions from storage
            this.loadTrackedFactions();
        }

        loadTrackedFactions() {
            const stored = GM_getValue('tornWarOverwatcher_factions', null);
            if (stored) {
                try {
                    const factions = JSON.parse(stored);
                    factions.forEach(id => this.trackedFactions.add(id));
                } catch (e) {
                    console.error('Failed to load tracked factions:', e);
                }
            }
        }

        saveTrackedFactions() {
            GM_setValue('tornWarOverwatcher_factions', JSON.stringify(Array.from(this.trackedFactions)));
        }

        init() {
            // Always start background polling (on any TORN page)
            this.startPolling();

            // Only create UI panel on the war page
            if (this.isUIPage) {
                // Delay panel creation slightly to ensure page is ready
                setTimeout(() => {
                    this.createPanel();
                    this.detectEnemyFactions();
                }, 500);
            }

            // Track selected member for detail view
            this.selectedMember = null; // { factionId, memberId }

            // Watch for URL changes (TORN uses SPA navigation)
            this.watchForURLChanges();

            console.log(`[Overwatcher] Running in ${this.isUIPage ? 'UI + Background' : 'Background only'} mode`);
            console.log(`[Overwatcher] Current URL: ${window.location.href}`);
        }

        watchForURLChanges() {
            // Check for hash changes
            window.addEventListener('hashchange', () => {
                const shouldShow = shouldShowUI();
                console.log(`[Overwatcher] Hash changed, shouldShowUI: ${shouldShow}`);

                if (shouldShow && !this.panel) {
                    this.isUIPage = true;
                    this.createPanel();
                    this.detectEnemyFactions();
                    this.render();
                } else if (!shouldShow && this.panel) {
                    this.panel.remove();
                    this.panel = null;
                    this.isUIPage = false;
                }
            });

            // Also watch for popstate (back/forward navigation)
            window.addEventListener('popstate', () => {
                setTimeout(() => {
                    const shouldShow = shouldShowUI();
                    if (shouldShow && !this.panel) {
                        this.isUIPage = true;
                        this.createPanel();
                        this.detectEnemyFactions();
                        this.render();
                    }
                }, 300);
            });
        }

        createPanel() {
            // Remove existing panel if any
            const existing = document.getElementById('overwatcher-panel');
            if (existing) existing.remove();

            const panel = document.createElement('div');
            panel.id = 'overwatcher-panel';
            panel.innerHTML = `
                <div class="ow-header">
                    <h3>⚔️ War Overwatcher</h3>
                    <div>
                        <button class="ow-btn secondary" id="ow-minimize">_</button>
                    </div>
                </div>
                <div class="ow-content">
                    <div class="ow-tabs">
                        <button class="ow-tab active" data-tab="live">Live Status</button>
                        <button class="ow-tab" data-tab="analysis">Analysis</button>
                        <button class="ow-tab" data-tab="config">Config</button>
                    </div>
                    <div id="ow-tab-content"></div>
                    <div class="ow-status" id="ow-status">Initializing...</div>
                </div>
            `;

            // Try to find the war content area to inject into
            this.injectPanel(panel);
            this.panel = panel;

            // Event listeners
            panel.querySelector('#ow-minimize').addEventListener('click', () => {
                panel.classList.toggle('minimized');
            });

            panel.querySelectorAll('.ow-tab').forEach(tab => {
                tab.addEventListener('click', (e) => {
                    panel.querySelectorAll('.ow-tab').forEach(t => t.classList.remove('active'));
                    e.target.classList.add('active');
                    this.currentTab = e.target.dataset.tab;
                    this.render();
                });
            });

            this.render();
        }

        injectPanel(panel) {
            // Try multiple possible injection points
            const selectors = [
                // Area above the faction tables (after Ranked War Filter)
                '.faction-war-list',
                '#faction-main',
                // Fallback: content wrapper
                '.content-wrapper',
                '#mainContainer',
                '.content'
            ];

            for (const selector of selectors) {
                const target = document.querySelector(selector);
                if (target) {
                    // Insert at the beginning of the target
                    target.insertBefore(panel, target.firstChild);
                    console.log(`[Overwatcher] Panel injected into: ${selector}`);
                    return;
                }
            }

            // Ultimate fallback: append to body as floating (old behavior)
            console.log('[Overwatcher] No injection point found, using floating panel');
            panel.style.position = 'fixed';
            panel.style.top = '100px';
            panel.style.right = '20px';
            panel.style.width = '400px';
            panel.style.maxHeight = '600px';
            panel.style.zIndex = '9999';
            panel.style.overflowY = 'auto';
            document.body.appendChild(panel);
        }

        detectEnemyFactions() {
            // Only use manually configured factions - no auto-detection
            // This prevents treaties and other factions from being added

            if (this.trackedFactions.size > 0) {
                this.setStatus(`Tracking ${this.trackedFactions.size} faction(s) from config`);
            } else {
                this.setStatus('No factions configured - add IDs in Config tab', 'warning');
            }
        }

        async pollFactions() {
            if (this.trackedFactions.size === 0) {
                this.setStatus('No factions to track - add faction ID in Config', 'error');
                return;
            }

            const callsUsed = this.rateLimiter.getCallsInLastMinute();
            const factionsToUpdate = Array.from(this.trackedFactions);

            // Check if we have enough API budget
            if (callsUsed + factionsToUpdate.length > CONFIG.MAX_CALLS_PER_MINUTE) {
                this.setStatus(`Rate limit protection: ${callsUsed}/${CONFIG.MAX_CALLS_PER_MINUTE} calls used, waiting...`, 'warning');
                return;
            }

            for (const factionId of factionsToUpdate) {
                try {
                    const data = await this.api.getFactionBasic(factionId);
                    if (data && data.members) {
                        const stats = this.dataStore.recordActivity(factionId, data.name, data.members);
                        const apiUsage = `[API: ${this.rateLimiter.getCallsInLastMinute()}/${CONFIG.MAX_CALLS_PER_MINUTE}/min]`;
                        this.setStatus(`${data.name}: ${stats.online}↑ ${stats.idle}~ ${stats.offline}↓ ${apiUsage}`, 'active');
                    }
                } catch (error) {
                    this.setStatus(`Error: ${error.message}`, 'error');
                    console.error('[Overwatcher] Poll error:', error);

                    // If rate limited, skip remaining factions this cycle
                    if (error.message.includes('Rate limited')) {
                        break;
                    }
                }

                // Delay between faction requests
                await new Promise(r => setTimeout(r, CONFIG.MIN_DELAY_BETWEEN_CALLS));
            }

            // Only update UI if we're on the UI page
            if (this.isUIPage && this.panel) {
                this.render();
            }
        }

        startPolling() {
            this.pollFactions(); // Initial poll
            this.pollingInterval = setInterval(() => this.pollFactions(), CONFIG.POLL_INTERVAL);
        }

        setStatus(message, type = '') {
            const timestamp = new Date().toLocaleTimeString();
            const fullMessage = `${timestamp} - ${message}`;

            // Always log to console (for background mode debugging)
            console.log(`[Overwatcher] ${fullMessage}`);

            // Update UI status if panel exists
            const statusEl = document.getElementById('ow-status');
            if (statusEl) {
                statusEl.textContent = fullMessage;
                statusEl.className = `ow-status ${type}`;
            }
        }

        render() {
            const content = document.getElementById('ow-tab-content');
            if (!content) return;

            switch (this.currentTab) {
                case 'live':
                    content.innerHTML = this.renderLiveTab();
                    this.attachMemberClickEvents();
                    break;
                case 'analysis':
                    content.innerHTML = this.renderAnalysisTab();
                    this.attachTimezoneSelectEvents();
                    break;
                case 'config':
                    content.innerHTML = this.renderConfigTab();
                    this.attachConfigEvents();
                    break;
            }
        }

        attachTimezoneSelectEvents() {
            const select = document.getElementById('ow-timezone-select');
            if (select) {
                select.addEventListener('change', (e) => {
                    this.dataStore.setTimezone(e.target.value);
                    this.render();
                });
            }
        }

        attachMemberClickEvents() {
            // Member click for detail view
            document.querySelectorAll('.ow-member.clickable').forEach(el => {
                el.addEventListener('click', (e) => {
                    const factionId = e.currentTarget.dataset.faction;
                    const memberId = e.currentTarget.dataset.member;

                    // Toggle selection
                    if (this.selectedMember?.memberId === memberId) {
                        this.selectedMember = null;
                    } else {
                        this.selectedMember = { factionId, memberId };
                    }
                    this.render();
                });
            });

            // Close button for detail view
            document.querySelectorAll('[data-action="close-detail"]').forEach(el => {
                el.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.selectedMember = null;
                    this.render();
                });
            });
        }

        renderLiveTab() {
            let html = '';

            if (this.trackedFactions.size === 0) {
                return '<p style="color: #a0a0a0; text-align: center;">No factions tracked yet.<br>Go to Config tab to add faction IDs.</p>';
            }

            html += '<div class="ow-factions-grid">';

            for (const factionId of this.trackedFactions) {
                const snapshot = this.dataStore.getLatestSnapshot(factionId);
                const factionData = this.dataStore.data.factions[factionId];
                const extendedStats = this.dataStore.getExtendedStats(factionId);

                html += `<div class="ow-enemy-faction">`;
                html += `<h5>${factionData?.name || `Faction ${factionId}`}</h5>`;

                if (snapshot) {
                    const activePercent = ((snapshot.online + snapshot.idle) / snapshot.total * 100).toFixed(1);
                    const dangerClass = snapshot.online > 10 ? 'danger' : snapshot.online > 5 ? 'warning' : '';

                    html += `
                        <div class="ow-stat-row">
                            <span class="ow-stat-label">Online:</span>
                            <span class="ow-stat-value ${dangerClass}">${snapshot.online}</span>
                        </div>
                        <div class="ow-stat-row">
                            <span class="ow-stat-label">Idle:</span>
                            <span class="ow-stat-value warning">${snapshot.idle}</span>
                        </div>
                        <div class="ow-stat-row">
                            <span class="ow-stat-label">Offline:</span>
                            <span class="ow-stat-value">${snapshot.offline}</span>
                        </div>
                        <div class="ow-stat-row">
                            <span class="ow-stat-label">Active %:</span>
                            <span class="ow-stat-value">${activePercent}%</span>
                        </div>
                    `;

                    // Extended stats section
                    if (extendedStats) {
                        html += `<div style="border-top: 1px solid #1a4a7a; margin-top: 8px; padding-top: 8px;">`;
                        html += `<div class="ow-stat-row">
                            <span class="ow-stat-label">📊 Unique online (24h):</span>
                            <span class="ow-stat-value">${extendedStats.uniqueOnline24h}</span>
                        </div>`;
                        html += `<div class="ow-stat-row">
                            <span class="ow-stat-label">📈 Peak online (24h):</span>
                            <span class="ow-stat-value">${extendedStats.peakOnline24h} @ ${String(extendedStats.peakHour24h).padStart(2, '0')}:00 TCT</span>
                        </div>`;
                        html += `</div>`;
                    }

                    // Member list - clickable for details
                    if (snapshot.members) {
                        html += `<p style="font-size: 10px; color: #666; margin: 8px 0 4px 0;">👆 Click member for activity pattern</p>`;
                        html += `<div class="ow-member-list" style="margin-top: 5px;">`;
                        const sortedMembers = Object.entries(snapshot.members)
                            .sort((a, b) => {
                                const order = { 'Online': 0, 'Idle': 1, 'Offline': 2 };
                                return order[a[1].status] - order[b[1].status];
                            });

                        for (const [id, member] of sortedMembers) {
                            const statusClass = member.status.toLowerCase();
                            const stateInfo = member.state !== 'Okay' ? ` (${member.state})` : '';
                            const isSelected = this.selectedMember?.memberId === id ? 'selected' : '';
                            html += `<div class="ow-member ${statusClass} clickable ${isSelected}" data-faction="${factionId}" data-member="${id}">
                                <span>${member.name}${stateInfo}</span>
                                <span>${member.status}</span>
                            </div>`;
                        }
                        html += `</div>`;

                        // Show selected member detail if any
                        if (this.selectedMember && this.selectedMember.factionId === factionId) {
                            html += this.renderMemberDetail(factionId, this.selectedMember.memberId);
                        }
                    }
                } else {
                    html += '<p style="color: #666;">Waiting for data...</p>';
                }

                html += `</div>`;
            }

            html += '</div>';

            return html;
        }

        renderMemberDetail(factionId, memberId) {
            const memberStats = this.dataStore.getMemberHourlyStats(factionId, memberId);
            const memberExtended = this.dataStore.getMemberExtendedStats(factionId, memberId);
            const currentTz = this.dataStore.getTimezone();

            if (!memberStats || memberStats.totalSamples < 2) {
                return `<div class="ow-member-detail">
                    <h5>${memberStats?.name || 'Unknown'} <button class="close-btn" data-action="close-detail">✕</button></h5>
                    <p style="color: #666; font-size: 11px;">Not enough data yet (${memberStats?.totalSamples || 0} samples)</p>
                </div>`;
            }

            const maxActivity = Math.max(...memberStats.hourlyStats.map(h => h.activePercent), 1);

            // Find peak hours (in UTC, display in selected timezone)
            const sortedHours = [...memberStats.hourlyStats]
                .filter(h => h.samples > 0)
                .sort((a, b) => b.activePercent - a.activePercent);

            const peakHours = sortedHours.slice(0, 3);
            const lowHours = sortedHours.slice(-3).reverse();

            let html = `<div class="ow-member-detail">
                <h5>📊 ${memberStats.name} <button class="close-btn" data-action="close-detail">✕</button></h5>`;

            // Extended member stats
            if (memberExtended) {
                html += `<div style="display: flex; gap: 15px; margin-bottom: 10px; font-size: 11px;">`;
                html += `<div><span style="color: #666;">Online 24h:</span> <span style="color: #00ff88;">${memberExtended.timesOnline24h}x</span></div>`;
                html += `<div><span style="color: #666;">Avg session:</span> <span style="color: #00d9ff;">${memberExtended.avgSessionLength}</span></div>`;
                html += `</div>`;
            }

            // Peak activity times
            if (peakHours.length > 0 && peakHours[0].samples > 0) {
                const peakDisplay = peakHours
                    .filter(h => h.samples > 0)
                    .map(h => {
                        const displayHour = convertUTCHourToTimezone(h.hour, currentTz);
                        return `${String(displayHour).padStart(2,'0')}:00`;
                    })
                    .join(', ');
                html += `<div style="font-size: 11px; margin-bottom: 8px;">
                    <span style="color: #ff4757;">🔥 Most active:</span>
                    ${peakDisplay} ${currentTz}
                </div>`;
            }

            if (lowHours.length > 0 && lowHours[0].samples > 0) {
                const lowDisplay = lowHours
                    .filter(h => h.samples > 0)
                    .map(h => {
                        const displayHour = convertUTCHourToTimezone(h.hour, currentTz);
                        return `${String(displayHour).padStart(2,'0')}:00`;
                    })
                    .join(', ');
                html += `<div style="font-size: 11px; margin-bottom: 8px;">
                    <span style="color: #00ff88;">😴 Least active:</span>
                    ${lowDisplay} ${currentTz}
                </div>`;
            }

            // Mini chart - reorder based on timezone
            const displayStats = memberStats.hourlyStats.map(h => ({
                ...h,
                displayHour: convertUTCHourToTimezone(h.hour, currentTz)
            })).sort((a, b) => a.displayHour - b.displayHour);

            html += `<div class="ow-mini-chart">`;
            for (const h of displayStats) {
                const height = h.samples > 0 ? (h.activePercent / maxActivity * 100) : 0;
                const barClass = h.activePercent > 66 ? 'high' : h.activePercent > 33 ? 'med' : 'low';
                const tooltip = `${String(h.displayHour).padStart(2,'0')}:00 ${currentTz}: ${h.activePercent.toFixed(0)}% active (${h.samples} samples)`;
                html += `<div class="ow-mini-bar ${barClass}" style="height: ${Math.max(height, 3)}%;" title="${tooltip}"></div>`;
            }
            html += `</div>`;
            html += `<div style="display: flex; justify-content: space-between; font-size: 9px; color: #444; margin-top: 2px;">
                <span>00</span><span>06</span><span>12</span><span>18</span><span>24</span>
            </div>`;

            html += `<p style="font-size: 9px; color: #444; margin-top: 5px;">${memberStats.totalSamples} data points (${currentTz})</p>`;
            html += `</div>`;

            return html;
        }

        renderAnalysisTab() {
            let html = '';
            const currentTz = this.dataStore.getTimezone();
            const tzConfig = CONFIG.TIMEZONES[currentTz];

            if (this.trackedFactions.size === 0) {
                return '<p style="color: #a0a0a0; text-align: center;">No data yet.</p>';
            }

            // Timezone dropdown
            html += `
                <div class="ow-timezone-selector">
                    <label>🌍 Timezone:</label>
                    <select id="ow-timezone-select">
                        ${Object.entries(CONFIG.TIMEZONES).map(([key, tz]) =>
                            `<option value="${key}" ${key === currentTz ? 'selected' : ''}>${tz.label}</option>`
                        ).join('')}
                    </select>
                </div>
            `;

            html += '<div class="ow-factions-grid">';

            for (const factionId of this.trackedFactions) {
                const factionData = this.dataStore.data.factions[factionId];
                if (!factionData) continue;

                const hourlyStats = this.dataStore.getHourlyStats(factionId);
                const bestTimes = this.dataStore.getBestAttackTimes(factionId);

                html += `<div class="ow-enemy-faction">`;
                html += `<h5>${factionData.name || `Faction ${factionId}`}</h5>`;

                if (bestTimes && bestTimes.bestHours.length > 0) {
                    html += `<div class="ow-section">`;
                    html += `<h4>🎯 Best Attack Windows (Low Activity)</h4>`;
                    for (const h of bestTimes.bestHours) {
                        const displayHour = convertUTCHourToTimezone(h.hour, currentTz);
                        html += `<div class="ow-stat-row">
                            <span class="ow-stat-label">${String(displayHour).padStart(2, '0')}:00 ${currentTz}</span>
                            <span class="ow-stat-value"><span style="color:#00ff88;">~${h.avgOnline.toFixed(1)}</span> + <span style="color:#ffa502;">~${h.avgIdle.toFixed(1)} idle</span></span>
                        </div>`;
                    }
                    html += `</div>`;

                    html += `<div class="ow-section">`;
                    html += `<h4>⚠️ Avoid These Hours (High Activity)</h4>`;
                    for (const h of bestTimes.worstHours) {
                        const displayHour = convertUTCHourToTimezone(h.hour, currentTz);
                        html += `<div class="ow-stat-row">
                            <span class="ow-stat-label">${String(displayHour).padStart(2, '0')}:00 ${currentTz}</span>
                            <span class="ow-stat-value danger"><span style="color:#00ff88;">~${h.avgOnline.toFixed(1)}</span> + <span style="color:#ffa502;">~${h.avgIdle.toFixed(1)} idle</span></span>
                        </div>`;
                    }
                    html += `</div>`;
                }

                // Hourly chart with stacked bars
                if (hourlyStats) {
                    const maxActivity = Math.max(...hourlyStats.map(h => h.avgOnline + h.avgIdle), 1);
                    html += `<div class="ow-section">`;
                    html += `<h4>📊 24h Activity Pattern (${currentTz})</h4>`;
                    html += `<div style="display: flex; gap: 10px; font-size: 10px; margin-bottom: 5px;">
                        <span><span style="color:#00ff88;">■</span> Online</span>
                        <span><span style="color:#ffa502;">■</span> Idle</span>
                    </div>`;
                    html += `<div class="ow-hour-chart">`;

                    // Reorder hours based on timezone offset
                    const displayStats = hourlyStats.map(h => ({
                        ...h,
                        displayHour: convertUTCHourToTimezone(h.hour, currentTz)
                    })).sort((a, b) => a.displayHour - b.displayHour);

                    for (const h of displayStats) {
                        const totalHeight = ((h.avgOnline + h.avgIdle) / maxActivity * 100);
                        const onlineHeight = h.avgOnline / maxActivity * 100;
                        const idleHeight = h.avgIdle / maxActivity * 100;
                        const tooltip = `${String(h.displayHour).padStart(2, '0')}:00 ${currentTz} - ${h.avgOnline.toFixed(1)} online + ${h.avgIdle.toFixed(1)} idle (${h.samples} samples)`;

                        html += `<div class="ow-hour-bar" style="height: ${Math.max(totalHeight, 2)}%;" data-tooltip="${tooltip}">`;
                        if (idleHeight > 0) {
                            html += `<div class="ow-bar-idle" style="height: ${(idleHeight / totalHeight) * 100}%;"></div>`;
                        }
                        if (onlineHeight > 0) {
                            html += `<div class="ow-bar-online" style="height: ${(onlineHeight / totalHeight) * 100}%;"></div>`;
                        }
                        html += `</div>`;
                    }
                    html += `</div>`;
                    html += `<div style="display: flex; justify-content: space-between; font-size: 10px; color: #666; margin-top: 3px;">
                        <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span>
                    </div>`;
                    html += `</div>`;
                }

                const totalSnapshots = factionData.snapshots?.length || 0;
                html += `<p style="font-size: 10px; color: #666; margin-top: 10px;">Based on ${totalSnapshots} data points</p>`;

                html += `</div>`;
            }

            html += '</div>';

            return html;
        }

        renderConfigTab() {
            const apiKey = this.dataStore.getApiKey();
            const factionIds = Array.from(this.trackedFactions).join(', ');
            const apiCalls = this.rateLimiter.getCallsInLastMinute();

            return `
                <div class="ow-section">
                    <h4>📡 API Status</h4>
                    <div class="ow-stat-row">
                        <span class="ow-stat-label">Calls (last min):</span>
                        <span class="ow-stat-value ${apiCalls > 40 ? 'warning' : ''}">${apiCalls} / ${CONFIG.MAX_CALLS_PER_MINUTE}</span>
                    </div>
                    <div class="ow-stat-row">
                        <span class="ow-stat-label">Poll interval:</span>
                        <span class="ow-stat-value">${CONFIG.POLL_INTERVAL / 1000}s</span>
                    </div>
                    <div class="ow-stat-row">
                        <span class="ow-stat-label">Background mode:</span>
                        <span class="ow-stat-value" style="color: #00ff88;">✓ Active on all pages</span>
                    </div>
                </div>
                <div class="ow-section">
                    <div class="ow-input-group">
                        <label>API Key (required)</label>
                        <input type="password" id="ow-api-key" value="${apiKey === 'YOUR_API_KEY_HERE' ? '' : apiKey}" placeholder="Your 16-character API key">
                    </div>
                    <div class="ow-input-group">
                        <label>Enemy Faction IDs (comma separated)</label>
                        <input type="text" id="ow-faction-ids" value="${factionIds}" placeholder="e.g., 12345, 67890">
                    </div>
                    <button class="ow-btn" id="ow-save-config">💾 Save Configuration</button>
                    <button class="ow-btn secondary" id="ow-export-data" style="margin-top: 5px;">📤 Export Data</button>
                    <button class="ow-btn secondary" id="ow-clear-data" style="margin-top: 5px; background: #ff4757;">🗑️ Clear All Data</button>
                </div>
                <div class="ow-section" style="margin-top: 15px;">
                    <h4>ℹ️ How to use</h4>
                    <ol style="font-size: 11px; color: #a0a0a0; padding-left: 20px; margin: 5px 0;">
                        <li>Get your API key from TORN preferences</li>
                        <li>Enter enemy faction ID(s)</li>
                        <li>Script runs on ALL TORN pages (background)</li>
                        <li>UI only shows on war page</li>
                        <li>Check Analysis tab for best attack windows</li>
                    </ol>
                </div>
            `;
        }

        attachConfigEvents() {
            document.getElementById('ow-save-config')?.addEventListener('click', () => {
                const apiKey = document.getElementById('ow-api-key').value.trim();
                const factionIds = document.getElementById('ow-faction-ids').value.trim();

                if (apiKey) {
                    this.dataStore.setApiKey(apiKey);
                }

                this.trackedFactions.clear();
                if (factionIds) {
                    factionIds.split(',').forEach(id => {
                        const cleanId = id.trim();
                        if (cleanId && /^\d+$/.test(cleanId)) {
                            this.trackedFactions.add(cleanId);
                        }
                    });
                }

                // Save factions for background polling
                this.saveTrackedFactions();

                this.setStatus('Configuration saved! Tracking will continue on all pages.', 'active');
                this.pollFactions();
            });

            document.getElementById('ow-export-data')?.addEventListener('click', () => {
                const data = this.dataStore.exportData();
                const blob = new Blob([data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `torn-overwatcher-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                URL.revokeObjectURL(url);
                this.setStatus('Data exported!', 'active');
            });

            document.getElementById('ow-clear-data')?.addEventListener('click', () => {
                if (confirm('Are you sure you want to clear all collected data? This cannot be undone!')) {
                    for (const factionId of this.trackedFactions) {
                        this.dataStore.clearFactionData(factionId);
                    }
                    this.setStatus('All data cleared', 'active');
                    this.render();
                }
            });
        }
    }

    // ============================================
    // INITIALIZE
    // ============================================
    const dataStore = new DataStore();
    const rateLimiter = new RateLimiter();
    const api = new TornAPI(dataStore, rateLimiter);
    const ui = new OverwatcherUI(dataStore, api, rateLimiter);

    // Wait for page to fully load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => ui.init());
    } else {
        ui.init();
    }

})();