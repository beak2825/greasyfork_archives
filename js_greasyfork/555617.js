// ==UserScript==
// @name         Nitro Type Top Racer/Team Badges
// @namespace    http://tampermonkey.net/
// @version      3.2.0
// @description  OPTIMIZED - Instant loading, shared cache, eliminates delays and visual shifts. Adds top racer and team badges with proper bot filtering and display name handling
// @match        https://www.nitrotype.com/team/*
// @match        https://www.nitrotype.com/friends
// @match        https://www.nitrotype.com/leagues
// @match        https://www.nitrotype.com/racer/*
// @match        https://www.nitrotype.com/garage*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @connect      ntstartrack.org
// @connect      nitrotype.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555617/Nitro%20Type%20Top%20RacerTeam%20Badges.user.js
// @updateURL https://update.greasyfork.org/scripts/555617/Nitro%20Type%20Top%20RacerTeam%20Badges.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // ===== SHARED OPTIMIZATION LAYER (Optional - enhances performance with Leaderboard script) =====
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
            window.dispatchEvent(new CustomEvent('nt-cache-updated', {
                detail: { type, data, expiresAt }
            }));
        },

        getCache(type) {
        const cached = this.cache[type];
        if (!cached.data) return null;

        if (Date.now() < cached.expiresAt) {
                return cached.data;
            }
            return null;
        },

        getBotStatus(username) {
            return this.cache.isbot.get(username.toLowerCase());
        },

        setBotStatus(username, status) {
            this.cache.isbot.set(username.toLowerCase(), status);
        }
    };

    // Icon loading coordination - ensures all badges load simultaneously
    window.NTIconQueue = window.NTIconQueue || {
        pending: [],
        isProcessing: false,

        add(fn) {
            this.pending.push(fn);
            if (!this.isProcessing) {
                this.flush();
            }
        },

        flush() {
            if (this.pending.length === 0) return;

            this.isProcessing = true;
            requestAnimationFrame(() => {
                // Execute all pending icon additions in one frame
                this.pending.forEach(fn => fn());
                this.pending = [];
                this.isProcessing = false;
            });
        }
    };

    const SCRIPT_VERSION = '3.2.0';
    
    // Clear old caches if script version changed (fixes display name issues from older versions)
    const lastVersion = GM_getValue('script_version');
    if (lastVersion !== SCRIPT_VERSION) {
        GM_deleteValue('individual_leaderboard_cache');
        GM_deleteValue('team_leaderboard_cache');
        GM_setValue('script_version', SCRIPT_VERSION);
    }
 
    const BADGE_TIERS = {
        individual: [
            { rank: 3, img: 'https://www.nitrotype.com/dist/site/images/badges/profile-racer-top3.png', label: 'Top 3' },
            { rank: 10, img: 'https://www.nitrotype.com/dist/site/images/badges/profile-racer-top10.png', label: 'Top 10' },
            { rank: 50, img: 'https://www.nitrotype.com/dist/site/images/badges/profile-racer-top50.png', label: 'Top 50' },
            { rank: 100, img: 'https://www.nitrotype.com/dist/site/images/badges/profile-racer-top100.png', label: 'Top 100' },
            { rank: 300, img: 'https://www.nitrotype.com/dist/site/images/badges/profile-racer-top300.png', label: 'Top 300' }
        ],
        team: [
            { rank: 3, img: 'https://www.nitrotype.com/dist/site/images/badges/profile-team-top3.png', label: 'Top 3' },
            { rank: 10, img: 'https://www.nitrotype.com/dist/site/images/badges/profile-team-top10.png', label: 'Top 10' },
            { rank: 50, img: 'https://www.nitrotype.com/dist/site/images/badges/profile-team-top50.png', label: 'Top 50' }
        ]
    };
 
    const usernameCache = {
        data: {},
        get: function(displayName) {
        if (!displayName) return null;
            return this.data[displayName.toLowerCase()];
        },
        set: function(displayName, username) {
        if (!displayName || !username) return;
            this.data[displayName.toLowerCase()] = username.toLowerCase();
        },
        has: function(displayName) {
        if (!displayName) return false;
            return displayName.toLowerCase() in this.data;
        }
    };
 
    const resolutionQueue = {
        team: new Map(),
        friends: new Set(),
        leagues: new Set(),
        timers: {}
    };
 
    function getToken() {
        let token = GM_getValue('nt_token');
        if (!token) {
            token = localStorage.getItem("player_token");
        if (token) {
                GM_setValue('nt_token', token);
            }
        }
        return token;
    }
 
    function getTokenAndRetry(callback) {
        const token = localStorage.getItem("player_token");
        if (token) {
            GM_setValue('nt_token', token);
            callback();
        }
    }
 
    function getUsernameFromToken() {
        const token = getToken();
        if (!token) return null;
 
        try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        const parts = JSON.parse(jsonPayload);
            return parts.username || parts.sub;
        } catch (e) {
            console.error('[BADGE] Error decoding token:', e);
            return null;
        }
    }
 
    function getCTMidnight() {
        const now = new Date();
        const ctOffset = -6 * 60;
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const ctTime = new Date(utc + (ctOffset * 60000));
        ctTime.setHours(0, 0, 0, 0);
        return ctTime;
    }
 
    function getNextCTMidnight() {
        const midnight = getCTMidnight();
        midnight.setDate(midnight.getDate() + 1);
        return midnight;
    }
 
    function get7DaysBeforeCTMidnight() {
        const midnight = getCTMidnight();
        midnight.setDate(midnight.getDate() - 7);
        return midnight;
    }
 
    function formatDateForAPI(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day} 00:00:00`;
    }
 
    function fetchIndividualLeaderboard(callback) {
        // Check shared cache first (from Leaderboard script)
        if (window.NTShared && window.NTShared.getCache) {
        const sharedData = window.NTShared.getCache('individual');
        if (sharedData) {
                console.log('[BADGE] ✓ Using shared individual cache (instant, no API call!)');
                const individualMap = {};
                let currentRank = 0;

                sharedData.forEach((entry) => {
                    const username = (entry.Username || entry.username || '').toLowerCase();
                    if (!username || entry.bot === 1) return;
                    individualMap[username] = currentRank++;
                });

                callback(individualMap);
                return;
            }
        }

        const cacheKey = 'individual_leaderboard_cache';
        const cached = GM_getValue(cacheKey);
 
        if (cached && cached.expiresAt && Date.now() < cached.expiresAt) {
            callback(cached.data);
            return;
        }
 
        const endTime = getCTMidnight();
        const startTime = get7DaysBeforeCTMidnight();
        const nextMidnight = getNextCTMidnight();
 
        const startStr = encodeURIComponent(formatDateForAPI(startTime));
        const endStr = encodeURIComponent(formatDateForAPI(endTime));
 
        const url = `https://ntstartrack.org/api/individual-leaderboard?start_time=${startStr}&end_time=${endStr}`;
 
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                if (response.status === 200) {
                    try {
                        const data = JSON.parse(response.responseText);
 
                        const individualMap = {};
                        let currentRank = 0;
 
                        // ✅ FIX: Properly filter bots and assign sequential ranks
                        data.forEach((entry) => {
                            const username = (entry.Username || entry.username || '').toLowerCase();
                            if (!username) return;
 
                            // Skip bots completely
                            if (entry.bot === 1) return;
 
                            individualMap[username] = currentRank;
                            currentRank++;
                        });
 
                        GM_setValue(cacheKey, {
                            data: individualMap,
                            expiresAt: nextMidnight.getTime()
                        });
 
                        callback(individualMap);
                    } catch (err) {
                        console.error('[BADGE] Error parsing individual leaderboard:', err);
                        callback({});
                    }
                } else {
                    console.error('[BADGE] Individual leaderboard fetch failed:', response.status);
                    callback({});
                }
            },
            onerror: function() {
                console.error('[BADGE] Network error fetching individual leaderboard');
                callback({});
            }
        });
    }
 
    function fetchTeamLeaderboard(callback) {
        // Check shared cache first (from Leaderboard script)
        if (window.NTShared && window.NTShared.getCache) {
        const sharedData = window.NTShared.getCache('team');
        if (sharedData) {
                console.log('[BADGE] ✓ Using shared team cache (instant, no API call!)');
                const teamMap = {};

                sharedData.forEach((entry, index) => {
                    const teamTag = (entry.TeamTag || entry.teamTag || '').toLowerCase();
                    const teamID = (entry.TeamID || entry.teamID || '').toString();
                    if (teamTag) teamMap[teamTag] = index;
                    if (teamID) teamMap[teamID] = index;
                });

                callback(teamMap);
                return;
            }
        }

        const cacheKey = 'team_leaderboard_cache';
        const cached = GM_getValue(cacheKey);
 
        if (cached && cached.expiresAt && Date.now() < cached.expiresAt) {
            callback(cached.data);
            return;
        }
 
        const endTime = getCTMidnight();
        const startTime = get7DaysBeforeCTMidnight();
        const nextMidnight = getNextCTMidnight();
 
        const startStr = encodeURIComponent(formatDateForAPI(startTime));
        const endStr = encodeURIComponent(formatDateForAPI(endTime));
 
        const url = `https://ntstartrack.org/api/team-leaderboard?start_time=${startStr}&end_time=${endStr}&showbot=FALSE`;
 
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                if (response.status === 200) {
                    try {
                        const data = JSON.parse(response.responseText);
 
                        const teamMap = {};
                        data.forEach((entry, index) => {
                            const teamTag = (entry.TeamTag || entry.teamTag || '').toLowerCase();
                            const teamID = (entry.TeamID || entry.teamID || '').toString();
 
                            if (teamTag) {
                                teamMap[teamTag] = index;
                            }
                            if (teamID) {
                                teamMap[teamID] = index;
                            }
                        });
 
                        GM_setValue(cacheKey, {
                            data: teamMap,
                            expiresAt: nextMidnight.getTime()
                        });
 
                        callback(teamMap);
                    } catch (err) {
                        console.error('[BADGE] Error parsing team leaderboard:', err);
                        callback({});
                    }
                } else {
                    console.error('[BADGE] Team leaderboard fetch failed:', response.status);
                    callback({});
                }
            },
            onerror: function() {
                console.error('[BADGE] Network error fetching team leaderboard');
                callback({});
            }
        });
    }
 
    function getBadgeForRank(rank, type) {
        const tiers = BADGE_TIERS[type];
        for (const tier of tiers) {
        if (rank < tier.rank) {
                return { img: tier.img, label: tier.label };
            }
        }
        return null;
    }
 
    function addBadgeTooltip(badgeElement, tooltipText) {
        let customTooltipElement = null;
 
        badgeElement.style.cursor = 'help';
 
        badgeElement.addEventListener('mouseenter', function(event) {
            customTooltipElement = document.createElement('div');
            customTooltipElement.textContent = tooltipText;
            customTooltipElement.style.position = 'absolute';
            customTooltipElement.style.backgroundColor = '#333';
            customTooltipElement.style.color = 'white';
            customTooltipElement.style.padding = '4px 8px';
            customTooltipElement.style.borderRadius = '4px';
            customTooltipElement.style.zIndex = '10001';
            customTooltipElement.style.fontSize = '12px';
            customTooltipElement.style.fontFamily = 'Arial, sans-serif';
            customTooltipElement.style.pointerEvents = 'none';
            customTooltipElement.style.left = (event.pageX + 10) + 'px';
            customTooltipElement.style.top = (event.pageY + 10) + 'px';
            document.body.appendChild(customTooltipElement);
        });
 
        badgeElement.addEventListener('mousemove', function(event) {
        if (customTooltipElement) {
                customTooltipElement.style.left = (event.pageX + 10) + 'px';
                customTooltipElement.style.top = (event.pageY + 10) + 'px';
            }
        });
 
        badgeElement.addEventListener('mouseleave', function() {
        if (customTooltipElement) {
                customTooltipElement.remove();
                customTooltipElement = null;
            }
        });
    }
 
    function addBadgeToElement(element, badgeUrl, displayName, rank, badgeLabel, badgeType) {
        if (element.nextElementSibling && element.nextElementSibling.classList.contains('prxxs')) {
        const existingBadge = element.nextElementSibling;
        const existingType = existingBadge.getAttribute('data-badge-type');
 
        if (badgeType === 'racer') {
                existingBadge.remove();
        } else if (badgeType === 'team') {
                if (existingType === 'racer') {
                    return;
                }
                existingBadge.remove();
            }
        }
 
        const badgeDiv = document.createElement('div');
        badgeDiv.className = 'prxxs';
        badgeDiv.setAttribute('data-badge-type', badgeType);
 
        const badgeImg = document.createElement('img');
        badgeImg.className = 'db';
        badgeImg.src = badgeUrl;
 
        addBadgeTooltip(badgeImg, `Top ${rank + 1} ${badgeType === 'racer' ? 'Racer' : 'Team'} (${badgeLabel})`);
 
        badgeDiv.appendChild(badgeImg);
        element.parentNode.insertBefore(badgeDiv, element.nextSibling);
    }
 
    function batchResolveTeamMembers(teamTag, callback) {
        const token = getToken();
        if (!token) {
            callback([]);
            return;
        }
 
        // ✅ FIX: Use team tag as-is (case-sensitive API)
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://www.nitrotype.com/api/v2/teams/${teamTag}`,
            headers: {
                "Authorization": `Bearer ${token}`,
                "accept": "application/json, text/plain, */*"
            },
            onload: function(response) {
                if (response.status === 200) {
                    try {
                        const data = JSON.parse(response.responseText);
 
                        if (data.status === "OK" && data.results && data.results.members) {
                            const members = data.results.members;
 
                            members.forEach((member) => {
                                const displayName = member.displayName || member.username;
                                const username = member.username;
 
                                if (!username) return;
 
                                // ✅ FIX: Strip sparkles and special chars for consistent matching
                                const cleanDisplayName = displayName.replace(/✨/g, '');
 
                                usernameCache.set(cleanDisplayName, username);
                                usernameCache.set(username, username);
                            });
 
                            callback(members);
                        } else {
                            callback([]);
                        }
                    } catch (err) {
                        console.error('[BADGE] Error parsing team members response:', err);
                        callback([]);
                    }
                } else if (response.status === 401) {
                    getTokenAndRetry(() => batchResolveTeamMembers(teamTag, callback));
                } else {
                    console.error('[BADGE] Failed to fetch team members:', response.status);
                    callback([]);
                }
            },
            onerror: function(error) {
                console.error('[BADGE] Network error fetching team members:', error);
                callback([]);
            }
        });
    }
 
    function batchResolveFriends(callback) {
        const token = getToken();
        if (!token) {
            return;
        }
 
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://www.nitrotype.com/api/v2/friends",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            onload: function(response) {
                if (response.status === 200) {
                    const data = JSON.parse(response.responseText);
                    const fields = data.results.fields;
                    const values = data.results.values;
 
                    const displayNameIndex = fields.indexOf("displayName");
                    const usernameIndex = fields.indexOf("username");
 
                    const friendsData = values.map(friendData => ({
                        displayName: friendData[displayNameIndex] || '',
                        username: friendData[usernameIndex] || ''
                    })).filter(friend => friend.username);
 
                    friendsData.forEach(friend => {
                        if (friend.displayName && friend.username) {
                            // ✅ FIX: Strip sparkles for consistent matching
                            const cleanDisplayName = friend.displayName.replace(/✨/g, '');
                            usernameCache.set(cleanDisplayName, friend.username);
                            usernameCache.set(friend.username, friend.username);
                        }
                    });
 
                    callback(friendsData);
                } else if (response.status === 401) {
                    getTokenAndRetry(() => batchResolveFriends(callback));
                }
            }
        });
    }
 
    function batchResolveLeagues(callback) {
        const token = getToken();
        if (!token) {
            return;
        }
 
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://www.nitrotype.com/api/v2/leagues/user/activity",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            onload: function(response) {
                if (response.status === 200) {
                    const data = JSON.parse(response.responseText);
                    if (data.status === "OK") {
                        const leagueData = data.results.standings.map(user => ({
                            displayName: user.displayName || user.username || '',
                            username: user.username || ''
                        })).filter(user => user.username);
 
                        leagueData.forEach(user => {
                            if (user.displayName && user.username) {
                                // ✅ FIX: Strip sparkles for consistent matching
                                const cleanDisplayName = user.displayName.replace(/✨/g, '');
                                usernameCache.set(cleanDisplayName, user.username);
                            }
                        });
 
                        callback(leagueData);
                    }
                } else if (response.status === 401) {
                    getTokenAndRetry(() => batchResolveLeagues(callback));
                }
            }
        });
    }
 
    function checkAndAddBadge(username, displayName, element, individualMap) {
        const rank = individualMap[username.toLowerCase()];
 
        if (rank !== undefined) {
        const tiers = BADGE_TIERS.individual;
            let badgeForList = null;
            for (const tier of tiers) {
                 if (rank < tier.rank) {
                     badgeForList = { img: tier.img.replace('/badges/profile-racer', '/pages/race/race-results').replace('.png', '-alt.png'), label: tier.label };
                     break;
                 }
            }
 
        if (badgeForList) {
                addBadgeToElement(element, badgeForList.img, displayName, rank, badgeForList.label, 'racer');
            }
        }
    }
 
    function extractTeamTagFromDOM(usernameElement) {
        let teamTagElement = usernameElement.previousElementSibling;
 
        while (teamTagElement) {
        if (teamTagElement.classList && teamTagElement.classList.contains('player-name--tag')) {
                const teamTagText = teamTagElement.textContent.trim();
                const match = teamTagText.match(/\[([^\]]+)\]/);
                if (match) {
                    return match[1];
                }
                return teamTagText.replace(/[\[\]]/g, '');
            }
            teamTagElement = teamTagElement.previousElementSibling;
        }
 
        return null;
    }
 
    function queueUsernameResolution(displayName, element, individualMap, context) {
        if (usernameCache.has(displayName)) {
        const username = usernameCache.get(displayName);
            checkAndAddBadge(username, displayName, element, individualMap);
            return;
        }
 
        if (context === 'team') {
        if (!resolutionQueue.team.has(context)) {
                resolutionQueue.team.set(context, []);
            }
            resolutionQueue.team.get(context).push({ displayName, element, individualMap });
        } else if (context === 'friends') {
            resolutionQueue.friends.add({ displayName, element, individualMap });
        } else if (context === 'leagues') {
            resolutionQueue.leagues.add({ displayName, element, individualMap });
        }
 
        clearTimeout(resolutionQueue.timers[context]);
        resolutionQueue.timers[context] = setTimeout(() => {
            flushResolutionQueue(context);
        }, 300);

    }
 
    function flushResolutionQueue(context) {
        if (context === 'team') {
        const teamTag = window.location.pathname.split('/').pop();
        const queue = resolutionQueue.team.get(context);
        if (queue && queue.length > 0) {
                batchResolveTeamMembers(teamTag, () => {
                    queue.forEach(({ displayName, element, individualMap }) => {
                        if (usernameCache.has(displayName)) {
                            const username = usernameCache.get(displayName);
                            checkAndAddBadge(username, displayName, element, individualMap);
                        }
                    });
                });
                resolutionQueue.team.set(context, []);
            }
        } else if (context === 'friends' && resolutionQueue.friends.size > 0) {
        const queue = Array.from(resolutionQueue.friends);
 
        const needsFetch = queue.some(({ displayName }) => !usernameCache.has(displayName));
 
        if (needsFetch) {
                batchResolveFriends(() => {
                    queue.forEach(({ displayName, element, individualMap }) => {
                        if (usernameCache.has(displayName)) {
                            const username = usernameCache.get(displayName);
                            checkAndAddBadge(username, displayName, element, individualMap);
                        }
                    });
                });
        } else {
                queue.forEach(({ displayName, element, individualMap }) => {
                    if (usernameCache.has(displayName)) {
                        const username = usernameCache.get(displayName);
                        checkAndAddBadge(username, displayName, element, individualMap);
                    }
                });
            }
 
            resolutionQueue.friends.clear();
        } else if (context === 'leagues' && resolutionQueue.leagues.size > 0) {
        const queue = Array.from(resolutionQueue.leagues);
 
        const needsFetch = queue.some(({ displayName }) => !usernameCache.has(displayName));
 
        if (needsFetch) {
                batchResolveLeagues(() => {
                    queue.forEach(({ displayName, element, individualMap }) => {
                        if (usernameCache.has(displayName)) {
                            const username = usernameCache.get(displayName);
                            checkAndAddBadge(username, displayName, element, individualMap);
                        }
                    });
                });
        } else {
                queue.forEach(({ displayName, element, individualMap }) => {
                    if (usernameCache.has(displayName)) {
                        const username = usernameCache.get(displayName);
                        checkAndAddBadge(username, displayName, element, individualMap);
                    }
                });
            }
 
            resolutionQueue.leagues.clear();
        }
    }
 
    function processRacerBadges(individualMap, context) {
        const usernameElements = document.querySelectorAll('.type-ellip:not([data-badge-processed])');
 
        if (usernameElements.length === 0) return;
 
        usernameElements.forEach(element => {
        const displayName = element.textContent.trim().replace(/✨/g, '');
            queueUsernameResolution(displayName, element, individualMap, context);
            element.setAttribute('data-badge-processed', 'true');
        });
    }
 
    function checkAndAddTeamBadge(displayName, element, teamMap) {
        if (element.nextElementSibling && element.nextElementSibling.classList.contains('prxxs')) {
        const existingBadge = element.nextElementSibling;
        if (existingBadge.getAttribute('data-badge-type') === 'racer') {
                return;
            }
        }
 
        const teamTag = extractTeamTagFromDOM(element);
        if (!teamTag) {
            return;
        }
 
        const rank = teamMap[teamTag.toLowerCase()];
        if (rank === undefined) {
            return;
        }
 
        const badge = getBadgeForRank(rank, 'team');
        if (!badge) {
            return;
        }
 
        const badgeForList = {
            img: badge.img.replace('/badges/profile-team', '/pages/race/race-results').replace('.png', '-alt.png'),
            label: badge.label
        };
 
        addBadgeToElement(element, badgeForList.img, displayName, rank, badgeForList.label, 'team');
    }
 
    function processTeamBadgesOnList(teamMap, context) {
        const usernameElements = document.querySelectorAll('.type-ellip[data-badge-processed]:not([data-team-badge-processed])');
 
        if (usernameElements.length === 0) return;
 
        usernameElements.forEach(element => {
        const displayName = element.textContent.trim().replace(/✨/g, '');
            checkAndAddTeamBadge(displayName, element, teamMap);
            element.setAttribute('data-team-badge-processed', 'true');
        });
    }
 
    function processTeamBadge(teamMap) {
        const teamPath = window.location.pathname;
        if (!teamPath.startsWith('/team/')) {
            return;
        }
 
        const teamTag = teamPath.split('/').pop();
 
        const rank = teamMap[teamTag.toLowerCase()];
 
        if (rank === undefined) {
            return;
        }
 
        const badge = getBadgeForRank(rank, 'team');
        if (!badge) {
            return;
        }
 
        const cardCap = document.querySelector('.card-cap');
        if (!cardCap) {
            return;
        }
 
        if (!cardCap.classList.contains('with-player-rank-banner')) {
            cardCap.classList.add('with-player-rank-banner');
        }
 
        if (document.querySelector('.profile-badge[alt*="Top"]')) {
            return;
        }
 
        let bucketMedia = cardCap.querySelector('.bucket-media');
        if (!bucketMedia) {
            bucketMedia = document.createElement('div');
            bucketMedia.className = 'bucket-media';
            cardCap.insertBefore(bucketMedia, cardCap.firstChild);
        }
 
        const badgeImg = document.createElement('img');
        badgeImg.className = 'profile-badge';
        badgeImg.alt = `Top ${rank + 1} Team`;
        badgeImg.src = badge.img;
 
        addBadgeTooltip(badgeImg, `Top ${rank + 1} Team (${badge.label})`);
 
        bucketMedia.appendChild(badgeImg);
    }
 
    function processRacerProfile_IndividualBadge(individualMap) {
        const path = window.location.pathname;
        if (!path.startsWith('/racer/')) {
            return;
        }
 
        const username = path.split('/').pop().toLowerCase();
        if (!username) {
            return;
        }
 
        const rank = individualMap[username];
 
        if (rank === undefined) {
            return;
        }
 
        const badge = getBadgeForRank(rank, 'individual');
        if (!badge) {
            return;
        }
 
        const playerGrid = document.querySelector('.profile--grid--header .profile--grid--player');
        if (!playerGrid) {
            return;
        }
 
        if (document.querySelector('.profile-badge.racer-rank-badge')) {
            return;
        }
 
        if (!playerGrid.hasAttribute('data-badge-shifted')) {
            playerGrid.style.marginLeft = '130px';
            playerGrid.setAttribute('data-badge-shifted', 'true');
        }
 
        const badgeDiv = document.createElement('div');
        badgeDiv.className = 'profile-badge racer-rank-badge';
        badgeDiv.style.cssText = 'position: absolute; left: 0; top: 0;';
 
        const badgeImg = document.createElement('img');
        badgeImg.className = 'profile-badge';
        badgeImg.src = badge.img;
 
        addBadgeTooltip(badgeImg, `Top ${rank + 1} Racer in the Last 7 Days (${badge.label})`);
 
        badgeDiv.appendChild(badgeImg);
 
        playerGrid.parentElement.style.position = 'relative';
        playerGrid.parentElement.insertBefore(badgeDiv, playerGrid);
 
        const teamBadgeExists = !!document.querySelector('.profile-badge.team-rank-badge');
        const racerBadgeExists = !!document.querySelector('.profile-badge.racer-rank-badge');
 
        if (teamBadgeExists && racerBadgeExists) {
            playerGrid.style.marginLeft = '130px';
        } else if (teamBadgeExists || racerBadgeExists) {
            playerGrid.style.marginLeft = '75px';
        } else {
            playerGrid.style.marginLeft = '0px';
        }
 
        if (!playerGrid.classList.contains('with-racer-ranking')) {
            playerGrid.classList.add('with-racer-ranking');
        }
    }
 
    function processRacerProfile_TeamBadge(teamMap) {
        const path = window.location.pathname;
        if (!path.startsWith('/racer/')) {
            return;
        }
 
        const teamTagElement = document.querySelector('.player-name--tag');
        if (!teamTagElement) {
            return;
        }
 
        const teamTag = teamTagElement.textContent.trim().replace(/[\[\]]/g, '').toLowerCase();
        if (!teamTag) {
            return;
        }
 
        const rank = teamMap[teamTag];
 
        if (rank === undefined) {
            return;
        }
 
        const badge = getBadgeForRank(rank, 'team');
        if (!badge) {
            return;
        }
 
        const playerGrid = document.querySelector('.profile--grid--header .profile--grid--player');
        if (!playerGrid) {
            return;
        }
 
        if (document.querySelector('.profile-badge.team-rank-badge')) {
            return;
        }
 
        const racerBadgeExists = !!document.querySelector('.profile-badge.racer-rank-badge');
        const teamBadgeLeft = racerBadgeExists ? '60px' : '0px';
 
        const badgeDiv = document.createElement('div');
        badgeDiv.className = 'profile-badge team-rank-badge';
        badgeDiv.style.cssText = `position: absolute; left: ${teamBadgeLeft}; top: 0;`;
 
        const badgeImg = document.createElement('img');
        badgeImg.className = 'profile-badge';
        badgeImg.src = badge.img;
 
        addBadgeTooltip(badgeImg, `Top ${rank + 1} Team in the Last 7 Days (${badge.label})`);
 
        badgeDiv.appendChild(badgeImg);
 
        playerGrid.parentElement.style.position = 'relative';
        playerGrid.parentElement.insertBefore(badgeDiv, playerGrid);
 
        const teamBadgeExists = !!document.querySelector('.profile-badge.team-rank-badge');
 
        if (teamBadgeExists && racerBadgeExists) {
                playerGrid.style.marginLeft = '130px';
        } else if (teamBadgeExists || racerBadgeExists) {
                playerGrid.style.marginLeft = '75px';
        } else {
                playerGrid.style.marginLeft = '0px';
            }

        if (!playerGrid.classList.contains('with-team-ranking')) {
            playerGrid.classList.add('with-team-ranking');
        }
    }
 
    function processGarageProfile_IndividualBadge(individualMap, username) {
        if (!username) return;
 
        username = username.toLowerCase();
 
        const rank = individualMap[username];
 
        if (rank === undefined) {
            return;
        }
 
        const badge = getBadgeForRank(rank, 'individual');
        if (!badge) {
            return;
        }
 
        let playerGrid = document.querySelector('.profile--grid--header .profile--grid--player');
 
        if (!playerGrid) {
            playerGrid = document.querySelector('.garage--header .profile--grid--player');
        }
        if (!playerGrid) {
            playerGrid = document.querySelector('.card-cap');
        }
 
        if (!playerGrid) {
            return;
        }
 
        if (document.querySelector('.profile-badge.racer-rank-badge')) {
            return;
        }
 
        if (!playerGrid.hasAttribute('data-badge-shifted')) {
            playerGrid.style.marginLeft = '130px';
            playerGrid.setAttribute('data-badge-shifted', 'true');
        }
 
        const badgeDiv = document.createElement('div');
        badgeDiv.className = 'profile-badge racer-rank-badge';
        badgeDiv.style.cssText = 'position: absolute; left: 0; top: 0;';
 
        const badgeImg = document.createElement('img');
        badgeImg.className = 'profile-badge';
        badgeImg.src = badge.img;
 
        addBadgeTooltip(badgeImg, `Top ${rank + 1} Racer in the Last 7 Days (${badge.label})`);
 
        badgeDiv.appendChild(badgeImg);
 
        playerGrid.parentElement.style.position = 'relative';
        playerGrid.parentElement.insertBefore(badgeDiv, playerGrid);
 
        const teamBadgeExists = !!document.querySelector('.profile-badge.team-rank-badge');
        const racerBadgeExists = !!document.querySelector('.profile-badge.racer-rank-badge');
 
        if (teamBadgeExists && racerBadgeExists) {
                playerGrid.style.marginLeft = '130px';
        } else if (teamBadgeExists || racerBadgeExists) {
                playerGrid.style.marginLeft = '75px';
        } else {
                playerGrid.style.marginLeft = '0px';
            }

        if (!playerGrid.classList.contains('with-racer-ranking')) {
            playerGrid.classList.add('with-racer-ranking');
        }
    }
 
    function processGarageProfile_TeamBadge(teamMap) {
        const teamTagElement = document.querySelector('.player-name--tag');
        if (!teamTagElement) {
            return;
        }
 
        const teamTag = teamTagElement.textContent.trim().replace(/[\[\]]/g, '').toLowerCase();
        if (!teamTag) {
            return;
        }
 
        const rank = teamMap[teamTag];
 
        if (rank === undefined) {
            return;
        }
 
        const badge = getBadgeForRank(rank, 'team');
        if (!badge) {
            return;
        }
 
        let playerGrid = document.querySelector('.profile--grid--header .profile--grid--player');
        if (!playerGrid) {
            playerGrid = document.querySelector('.garage--header .profile--grid--player');
        }
        if (!playerGrid) {
            playerGrid = document.querySelector('.card-cap');
        }
 
        if (!playerGrid) {
            return;
        }
 
        if (document.querySelector('.profile-badge.team-rank-badge')) {
            return;
        }
 
        const racerBadgeExists = !!document.querySelector('.profile-badge.racer-rank-badge');
        const teamBadgeLeft = racerBadgeExists ? '60px' : '0px';
 
        const badgeDiv = document.createElement('div');
        badgeDiv.className = 'profile-badge team-rank-badge';
        badgeDiv.style.cssText = `position: absolute; left: ${teamBadgeLeft}; top: 0;`;
 
        const badgeImg = document.createElement('img');
        badgeImg.className = 'profile-badge';
        badgeImg.src = badge.img;
 
        addBadgeTooltip(badgeImg, `Top ${rank + 1} Team in the Last 7 Days (${badge.label})`);
 
        badgeDiv.appendChild(badgeImg);
 
        playerGrid.parentElement.style.position = 'relative';
        playerGrid.parentElement.insertBefore(badgeDiv, playerGrid);
 
        const teamBadgeExists = !!document.querySelector('.profile-badge.team-rank-badge');
 
        if (teamBadgeExists && racerBadgeExists) {
                playerGrid.style.marginLeft = '130px';
        } else if (teamBadgeExists || racerBadgeExists) {
                playerGrid.style.marginLeft = '75px';
        } else {
                playerGrid.style.marginLeft = '0px';
            }

        if (!playerGrid.classList.contains('with-team-ranking')) {
            playerGrid.classList.add('with-team-ranking');
        }
    }
 
    function createDebouncedObserver(callback, delay = 250) {
        let timeoutId;
        return new MutationObserver(() => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(callback, delay);
        });
    }
 
    function handleTeamPage(individualMap, teamMap) {
        let membersResolved = false;
 
        const teamTag = window.location.pathname.split('/').pop();
 
        batchResolveTeamMembers(teamTag, (members) => {
            membersResolved = true;
 
            processRacerBadges(individualMap, 'team');
 
            processTeamBadgesOnList(teamMap, 'team');
        });
 
        processTeamBadge(teamMap);
 
        const observer = createDebouncedObserver(() => {
        if (membersResolved) {
                processRacerBadges(individualMap, 'team');
                processTeamBadge(teamMap);
 
                processTeamBadgesOnList(teamMap, 'team');
            }
        });
 
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
 
    function handleFriendsPage(individualMap) {
        let racerBadgesComplete = false;
 
        batchResolveFriends((friends) => {
            processRacerBadges(individualMap, 'friends');
 
                racerBadgesComplete = true;
                fetchTeamLeaderboard((teamMap) => {
                        processTeamBadgesOnList(teamMap, 'friends');
                    });
        });
 
        const observer = createDebouncedObserver(() => {
            processRacerBadges(individualMap, 'friends');
 
        if (racerBadgesComplete) {
                    fetchTeamLeaderboard((teamMap) => {
                        processTeamBadgesOnList(teamMap, 'friends');
                    });
            }
        });
 
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
 
    function getCurrentLeagueTab() {
        const checkedRadio = document.querySelector('input[name="showteam"]:checked');
        if (!checkedRadio) return null;
 
        const label = document.querySelector(`label[for="${checkedRadio.id}"]`);
        return label ? label.textContent.trim() : null;
    }
 
    function handleLeaguesPage(individualMap) {
        let leaguesData = [];
        let teamMap = null;
 
        function handlePersonalTab() {
        if (leaguesData.length === 0) {
                batchResolveLeagues((leagues) => {
                    leaguesData = leagues;
 
                    processRacerBadges(individualMap, 'leagues');
 
                        fetchTeamLeaderboard((tMap) => {
                            teamMap = tMap;
                            processTeamBadgesOnList(teamMap, 'leagues');
                        });

                });
        } else {
                processRacerBadges(individualMap, 'leagues');
 
                if (teamMap) {
                    processTeamBadgesOnList(teamMap, 'leagues');
                } else {
                    fetchTeamLeaderboard((tMap) => {
                        teamMap = tMap;
                        processTeamBadgesOnList(teamMap, 'leagues');
                    });
                }
            }
        }
 
        function handleTeamTab() {
        if (!teamMap) {
                fetchTeamLeaderboard((tMap) => {
                    teamMap = tMap;
                    processTeamLeaguesBadges(teamMap);
                });
        } else {
                processTeamLeaguesBadges(teamMap);
            }
        }
 
        const initialTab = getCurrentLeagueTab();
        if (initialTab === 'Team') {
            handleTeamTab();
        } else {
            handlePersonalTab();
        }
 
        const tabBar = document.querySelector('.switch.switch--horizontal');
        if (tabBar) {
        const radioButtons = tabBar.querySelectorAll('input[name="showteam"]');
            radioButtons.forEach(radio => {
                radio.addEventListener('change', () => {
                    const currentTab = getCurrentLeagueTab();
 
                    if (currentTab === 'Team') {
                        handleTeamTab();
                    } else {
                        handlePersonalTab();
                    }
                });
            });
        }
 
        const contentObserver = createDebouncedObserver(() => {
        const currentTab = getCurrentLeagueTab();
        if (currentTab === 'Team') {
                if (teamMap) {
                    processTeamLeaguesBadges(teamMap);
                }
        } else {
                if (leaguesData.length > 0) {
                    processRacerBadges(individualMap, 'leagues');
                    if (teamMap) {
                        processTeamBadgesOnList(teamMap, 'leagues');
                    }
                }
            }
        });
 
        contentObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
 
    function processTeamLeaguesBadges(teamMap) {
        const allCells = Array.from(document.querySelectorAll('td.table-cell.leagues--standings--team'));
        const visibleCells = allCells.filter(cell => {
                const rect = cell.getBoundingClientRect();
                return rect.width > 0 && rect.height > 0;
            });
 
            visibleCells.forEach(cell => {
                if (cell.querySelector('.team-league-badge')) {
                    return;
                }
 
                const cellText = cell.textContent.trim();
                const match = cellText.match(/\[([^\]]+)\]/);
 
                if (!match) {
                    return;
                }
 
                const teamTag = match[1];
 
                const rank = teamMap[teamTag.toLowerCase()];
                if (rank === undefined) {
                    return;
                }
 
                const badge = getBadgeForRank(rank, 'team');
                if (!badge) {
                    return;
                }
 
                const badgeDiv = document.createElement('div');
                badgeDiv.className = 'prxxs team-league-badge';
                badgeDiv.style.display = 'inline-block';
                badgeDiv.style.marginLeft = '4px';
 
                const badgeImg = document.createElement('img');
                badgeImg.className = 'db';
                badgeImg.src = badge.img.replace('/badges/profile-team', '/pages/race/race-results').replace('.png', '-alt.png');
 
                addBadgeTooltip(badgeImg, `Top ${rank + 1} Team (${badge.label})`);
 
                badgeDiv.appendChild(badgeImg);
 
                const divs = cell.querySelectorAll('div');
 
                let teamNameDiv = null;
                divs.forEach(div => {
                    const text = div.textContent.trim();
                    if (!text.startsWith('[') && text.length > 0) {
                        teamNameDiv = div;
                    }
                });
 
                if (teamNameDiv) {
                    teamNameDiv.appendChild(badgeDiv);
                } else {
                    cell.appendChild(badgeDiv);
                }
            });
    }
 
    function handleRacerPage(individualMap, teamMap) {
        processRacerProfile_IndividualBadge(individualMap);
        processRacerProfile_TeamBadge(teamMap);
 
        const observer = createDebouncedObserver(() => {
            processRacerProfile_IndividualBadge(individualMap);
            processRacerProfile_TeamBadge(teamMap);
        });
 
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
 
    function handleGaragePage(individualMap, teamMap) {
        const path = window.location.pathname;
        let username = null;
 
        if (path === '/garage' || path === '/garage/') {
            username = getUsernameFromToken();
        } else if (path.startsWith('/garage/')) {
            username = path.split('/garage/')[1].split('/')[0].split('?')[0];
        }
 
        if (!username) {
            return;
        }
 
        processGarageProfile_IndividualBadge(individualMap, username);
        processGarageProfile_TeamBadge(teamMap);
 
        const observer = createDebouncedObserver(() => {
            processGarageProfile_IndividualBadge(individualMap, username);
            processGarageProfile_TeamBadge(teamMap);
        });
 
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
 
    function initialize() {
        const path = window.location.pathname;
 
        fetchIndividualLeaderboard(function(individualMap) {
        if (path.startsWith('/team/') || path.startsWith('/racer/') || path.startsWith('/garage')) {
                fetchTeamLeaderboard(function(teamMap) {
                    if (path.startsWith('/team/')) {
                        handleTeamPage(individualMap, teamMap);
                    } else if (path.startsWith('/racer/')) {
                        handleRacerPage(individualMap, teamMap);
                    } else if (path.startsWith('/garage')) {
                        handleGaragePage(individualMap, teamMap);
                    }
                });
        } else if (path === '/friends') {
                handleFriendsPage(individualMap);
        } else if (path === '/leagues') {
                handleLeaguesPage(individualMap);
            }
        });
    }
 
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        setTimeout(initialize, 500);
    }
 
})();
