// ==UserScript==
// @name         DBD Detailed Match History
// @namespace    https://github.com/Bloodpoint-Farming
// @version      1.0.8
// @description  Changes match history to show BP/category for all players and BP/hour.
// @author       Snoggles
// @match        https://stats.deadbydaylight.com/match-history*
// @run-at       document-start
// @license      MIT
// @supportURL   https://github.com/Bloodpoint-Farming/dbd-detailed-match-history
// @icon         https://bloodpoint-farming.github.io/dbd-detailed-match-history/img/bloodpoints-96.webp
// @downloadURL https://update.greasyfork.org/scripts/562996/DBD%20Detailed%20Match%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/562996/DBD%20Detailed%20Match%20History.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('[DBD Userscript] Script started at:', document.readyState);

    // --- Early CSS Injection (to prevent flash) ---
    const earlyStyle = document.createElement('style');
    earlyStyle.textContent = `
        html.dbd-data-ready .\\@container\\/match-card:not(.dbd-table-mode) {
            display: none !important;
        }
    `;
    (document.head || document.documentElement).appendChild(earlyStyle);

    const ASSETS_BASE_URL = 'https://assets.live.bhvraccount.com/';
    // Targeting: https://account-backend.bhvr.com/player-stats/match-history/games/dbd/providers/bhvr?lang=en&limit=30
    const MATCH_HISTORY_API_REGEX = /\/player-stats\/match-history\/games\/dbd\/providers\/bhvr/;

    // --- Configuration ---
    const ICON_SIZE = 44;
    const ICON_SIZE_SMALL = ICON_SIZE * 0.8;

    // Store for intercepted match data
    const matchDataStore = new Map();

    function storeMatchData(data) {
        if (Array.isArray(data)) {
            data.forEach(match => {
                const matchId = `${match.matchStat.matchStartTime}_${match.matchStat.map.name}`;
                matchDataStore.set(matchId, match);
            });
            console.log(`[DBD Userscript] Stored ${data.length} matches. Total: ${matchDataStore.size}`);
            document.documentElement.classList.add('dbd-data-ready');
            processAllCards();
        }
    }

    // --- Interception & Data Retrieval ---

    const processedUrls = new Set();

    function setupInterception() {
        // --- Fetch Interception ---
        const originalFetch = window.fetch;
        window.fetch = async function (...args) {
            const response = await originalFetch.apply(this, args);
            let url = typeof args[0] === 'string' ? args[0] : (args[0]?.url || args[0]?.href || '');

            if (MATCH_HISTORY_API_REGEX.test(url) && !processedUrls.has(url)) {
                processedUrls.add(url);
                console.log('[DBD Userscript] Intercepted fetch:', url);
                const clone = response.clone();
                clone.json().then(data => storeMatchData(data)).catch(err => console.error('[DBD Userscript] Fetch JSON error:', err));
            }
            return response;
        };

        // --- XHR Interception ---
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (method, url) {
            this._url = url;
            return originalOpen.apply(this, arguments);
        };

        const originalSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function () {
            const xhr = this;
            const onDone = () => {
                if (MATCH_HISTORY_API_REGEX.test(xhr._url) && !processedUrls.has(xhr._url)) {
                    processedUrls.add(xhr._url);
                    console.log('[DBD Userscript] Intercepted XHR:', xhr._url);
                    try {
                        const data = JSON.parse(xhr.responseText);
                        storeMatchData(data);
                    } catch (err) {
                        console.error('[DBD Userscript] XHR JSON error:', err);
                    }
                }
            };
            this.addEventListener('load', onDone);
            this.addEventListener('readystatechange', () => { if (xhr.readyState === 4) onDone(); });
            return originalSend.apply(this, arguments);
        };
    }

    function extractFromSessionStorage() {
        try {
            const cacheRaw = sessionStorage.getItem('REACT_QUERY_OFFLINE_CACHE');
            if (!cacheRaw) return;

            const cache = JSON.parse(cacheRaw);
            const queries = cache?.clientState?.queries || [];

            const matchQuery = queries.find(q =>
                Array.isArray(q.queryKey) && q.queryKey[0] === 'stats.match-history'
            );

            if (matchQuery?.state?.data) {
                console.log('[DBD Userscript] Found cached match data in sessionStorage.');
                storeMatchData(matchQuery.state.data);
            }
        } catch (err) {
            console.error('[DBD Userscript] Error extracting from sessionStorage:', err);
        }
    }

    setupInterception();
    extractFromSessionStorage();

    // --- UI Rendering ---

    function formatDuration(seconds) {
        if (!seconds && seconds !== 0) return '-';
        if (seconds < 0) {
            seconds = 0; // sometimes -1
        }
        // Intentionally NOT doing hours and days to avoid confusion.
        // Thousands of minutes since last match is fine.
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    }

    function getImageUrl(path) {
        if (!path) return '';
        if (path.startsWith('https')) return path;
        return ASSETS_BASE_URL + path;
    }

    function renderLoadoutItem(item, bgType, title = '', sizeClass = 'dbd-loadout-large') {
        const bgUrl = `https://assets.live.bhvraccount.com/display/${bgType}_bg.png`;
        const isEmpty = !item || !item.image?.path;
        const size = sizeClass === 'dbd-loadout-small' ? ICON_SIZE_SMALL : ICON_SIZE;

        const innerHtml = isEmpty
            ? ''
            : `<img src="${getImageUrl(item.image.path)}" alt="${item.name || ''}" class="dbd-loadout-icon">`;

        return `
            <div class="dbd-loadout-item ${sizeClass} ${isEmpty ? 'dbd-loadout-empty' : ''}" title="${item?.name || title}">
                <div class="dbd-loadout-bg" style="background-image: url('${bgUrl}')"></div>
                <div class="dbd-loadout-icon-container" style="width: ${size}px; height: ${size}px;">
                    ${innerHtml}
                </div>
            </div>
        `;
    }

    function createPlayerRow(player, isKiller, isUser = false) {
        const loadout = player.characterLoadout || {};
        const postGame = player.postGameStat || {};

        // Post game stats - find the 4 values
        const statKeys = isKiller
            ? ['Brutality', 'Deviousness', 'Hunter', 'Sacrifice']
            : ['Objectives', 'Survival', 'Altruism', 'Boldness'];

        const scoreCategoriesHtml = statKeys.map(key => {
            const fullKey = isKiller ? `DBD_SlasherScoreCat_${key}` : `DBD_CamperScoreCat_${key}`;
            const score = postGame[fullKey] || 0;
            const isLow = score < 10000;
            return `<td class="dbd-stat-cell ${isLow ? 'dbd-stat-low' : ''}" title="${key}">${score.toLocaleString()}</td>`;
        }).join('');

        // Loadout construction
        const perks = loadout.perks || [];
        const perksHtml = [0, 1, 2, 3].map(i => renderLoadoutItem(perks[i], 'perk', `Perk ${i + 1}`)).join('');
        const offeringHtml = renderLoadoutItem(loadout.offering, 'offering', 'Offering');
        const itemPowerHtml = renderLoadoutItem(loadout.power, 'item', isKiller ? 'Power' : 'Item');
        const addons = loadout.addOns || [];
        const addonsHtml = [0, 1].map(i => renderLoadoutItem(addons[i], 'item', `Add-on ${i + 1}`, 'dbd-loadout-small')).join('');

        const loadoutHtml = `
            <td class="dbd-loadout-cell">
                <div class="dbd-loadout-container">
                    <div class="dbd-loadout-group">${perksHtml}</div>
                    <div class="dbd-loadout-divider"></div>
                    <div class="dbd-loadout-group">${offeringHtml}</div>
                    <div class="dbd-loadout-divider"></div>
                    <div class="dbd-loadout-group">
                        ${itemPowerHtml}
                        <span class="dbd-loadout-plus">+</span>
                        <div class="dbd-loadout-addons">${addonsHtml}</div>
                    </div>
                </div>
            </td>
        `;

        const statusIconHtml = player.playerStatus?.image?.path
            ? `<img src="${getImageUrl(player.playerStatus.image.path)}" class="dbd-status-icon-overlay">`
            : '';

        const charBgUrl = `/_next/image/?url=%2Fstatic%2Fimages%2Fgames%2Fdbd%2Fcharacters%2F${isKiller ? 'killer' : 'survivor'}_bg.png&w=3840&q=75`;

        return `
            <tr class="dbd-player-row ${isKiller ? 'dbd-killer-row' : 'dbd-survivor-row'} ${isUser ? 'dbd-user-row' : 'dbd-opponent-row'}">
                <td class="dbd-char-cell">
                    <div class="dbd-char-container" title="${player.characterName?.name || ''}">
                        <img src="${charBgUrl}" class="dbd-char-bg" role="presentation">
                        <div class="dbd-char-icon-wrapper">
                            <img src="${getImageUrl(player.characterName?.image?.path)}" alt="${player.characterName?.name || ''}" class="dbd-char-icon">
                        </div>
                        ${!isKiller ? statusIconHtml : ''}
                    </div>
                </td>
                ${loadoutHtml}
                <td></td>
                ${scoreCategoriesHtml}
                <td></td>
                <td class="dbd-bp-cell">${player.bloodpointsEarned?.toLocaleString() || 0}</td>
                <td></td>
                <td class="dbd-time-cell">${formatDuration(player.playerTimeInMatch)}</td>
            </tr>
        `;
    }

    function createMatchTable(match) {
        // Sort: Survivors (VE_Camper) first, Killer (VE_Slasher) last -- just like in game.
        match.opponentStat.sort((a, b) => {
            if (a.playerRole === b.playerRole) return 0;
            return a.playerRole === 'VE_Slasher' ? 1 : -1;
        });

        // Calculate BP/hour for the current player
        // We need the previous match in chronological order
        const matchesSorted = Array.from(matchDataStore.values()).sort((a, b) => b.matchStat.matchStartTime - a.matchStat.matchStartTime);
        const currentIndex = matchesSorted.findIndex(m => m.matchStat.matchStartTime === match.matchStat.matchStartTime);

        // Calc BP/hour and queue time only if last match was recent
        // Otherwise, report time since last match and skip nonsensical BP/hour calc.
        let bpHour = null;
        let bpHourHtml = ''
        let downtimeHtml = ''
        if (currentIndex < matchesSorted.length - 1) {
            const currentStart = match.matchStat.matchStartTime;
            const currentEnd = currentStart + match.playerStat.playerTimeInMatch;
            const prevMatch = matchesSorted[currentIndex + 1];
            const prevEnd = prevMatch.matchStat.matchStartTime + prevMatch.playerStat.playerTimeInMatch;

            const hourDiff = (currentEnd - prevEnd) / 3600;
            const hourDiffRound = Math.round(hourDiff)
            if (hourDiff > 0 && hourDiff < 1) {
                bpHour = Math.round(match.playerStat.bloodpointsEarned / hourDiff);
            }

            const downtimeSec = currentStart - prevEnd;

            if (hourDiff < 1) {
                const downtimeText = downtimeSec !== null && downtimeSec >= 0 ? formatDuration(downtimeSec) : '-'
                downtimeHtml = `
                <div class="dbd-downtime-container">
                    <span class="dbd-downtime-value">${downtimeText}</span>
                    <span class="dbd-downtime-label">between matches</span>
                </div>
            `;
            } else {
                // We need to show *something* here so it's obvious why BP/hour is absent.
                downtimeHtml = `
                <div class="dbd-downtime-container">
                    ${hourDiffRound} hour${hourDiffRound === 1 ? '' : 's'} since last match
                </div>`
            }
        }


        const allPlayers = [match.playerStat].map(p => createPlayerRow(p, p.playerRole === 'VE_Slasher', true));
        const opponentRows = match.opponentStat.map(p => createPlayerRow(p, p.playerRole === 'VE_Slasher', false));

        const rowsHtml = allPlayers.concat(opponentRows).join('');

        const matchDate = new Date(match.matchStat.matchStartTime * 1000);
        const dateOptions = { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true };
        const formattedDate = matchDate.toLocaleString('en-US', dateOptions);

        let tableHeaderGeneralInfo = formattedDate
        if (match.matchStat.isCustomMatch) {
            tableHeaderGeneralInfo += ` - Custom Match`
        }

        if (bpHour) {
            const bpHourStr = (bpHour / 1000000).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + 'M'
            const bpHourFull = bpHour.toLocaleString()
            bpHourHtml = `
                <div class="dbd-bph-container" title="${bpHourFull} BP/hour (since last match)">
                    <span class="dbd-bph-value">${bpHourStr}</span>
                    <span class="dbd-bph-label">BP / hour</span>
                </div>
            `;
        }

        return `
            <div class="dbd-match-container">
                <table class="dbd-match-table">
                    <colgroup>
                        <col style="width: 45px;"> <!-- Character -->
                        <col style="width: 420px;"> <!-- Loadout -->
                        <col> <!-- Spacer 1 -->
                        <col style="width: 60px;"> <!-- Score -->
                        <col style="width: 60px;"> <!-- Score -->
                        <col style="width: 60px;"> <!-- Score -->
                        <col style="width: 60px;"> <!-- Score -->
                        <col> <!-- Spacer 2 -->
                        <col style="width: 70px;"> <!-- Total BP -->
                        <col> <!-- Spacer 3 -->
                        <col style="width: 55px;"> <!-- Match -->
                    </colgroup>
                    <thead>
                        <tr>
                            <th colspan="3" style="text-align: left;">${tableHeaderGeneralInfo}</th>
                            <th title="Objectives / Brutality">Obj Brut</th>
                            <th title="Survival / Deviousness">Surv Dev</th>
                            <th title="Altruism / Hunter">Alt Hunt</th>
                            <th title="Boldness / Sacrifice">Bold Sac</th>
                            <th></th>
                            <th style="text-align: center;">BP</th>
                            <th></th>
                            <th style="text-align: center;">Match</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHtml}
                    </tbody>
                </table>
                <div class="dbd-match-global-info">
                    <div class="dbd-map-photo-container">
                        <img src="${getImageUrl(match.matchStat.map?.image?.path)}" alt="${match.matchStat.map?.name || ''}" class="dbd-map-photo">
                    </div>
                    <div class="dbd-global-text-stack">
                        <span class="dbd-match-map-name">${match.matchStat.map?.name || 'Unknown Map'}</span> 
                        ${bpHourHtml}
                        ${downtimeHtml}
                    </div>
                </div>
            </div>
        `;
    }

    // --- DOM Mutation Handling ---

    function createEnhancedCard(match, index) {
        const newCard = document.createElement('div');
        newCard.className = '@container/match-card dbd-table-mode';

        const isKillerMatch = Object.keys(match.playerStat?.postGameStat || {}).some(k => k.includes('Slasher'));
        newCard.classList.add(isKillerMatch ? 'dbd-killer-match' : 'dbd-survivor-match');

        newCard.innerHTML = createMatchTable(match);
        newCard.dataset.dbdProcessed = 'true';
        newCard.dataset.dbdExpanded = index === 0 ? 'true' : 'false';

        // Handle expansion toggle
        newCard.addEventListener('click', (e) => {
            const selection = window.getSelection();
            if (selection && selection.toString().trim().length > 0) return;
            const isExpanded = newCard.getAttribute('data-dbd-expanded') === 'true';
            newCard.setAttribute('data-dbd-expanded', isExpanded ? 'false' : 'true');
        });

        return newCard;
    }

    function processAllCards() {
        const originalCards = document.querySelectorAll('.\\@container\\/match-card:not(.dbd-table-mode)');

        // Always hide original cards if they appear
        originalCards.forEach(card => {
            if (card.style.display !== 'none') card.style.display = 'none';
        });

        if (matchDataStore.size === 0) return;

        // Find or create our wrapper
        let wrapper = document.getElementById('dbd-enhanced-history-wrapper');
        if (!wrapper) {
            const firstCard = document.querySelector('.\\@container\\/match-card:not(.dbd-table-mode)');
            if (firstCard && firstCard.parentElement) {
                wrapper = document.createElement('div');
                wrapper.id = 'dbd-enhanced-history-wrapper';
                // Insert before the first original card to maintain position 
                // while keeping original cards as siblings for React stability
                firstCard.parentElement.insertBefore(wrapper, firstCard);
            } else {
                return;
            }
        }

        const matches = Array.from(matchDataStore.values()).sort((a, b) => b.matchStat.matchStartTime - a.matchStat.matchStartTime);

        matches.forEach((match, index) => {
            const matchId = `${match.matchStat.matchStartTime}_${match.matchStat.map.name}`;
            const elementId = `dbd-match-${match.matchStat.matchStartTime}`; // Use start time for ID stability
            let card = document.getElementById(elementId);

            if (!card) {
                card = createEnhancedCard(match, index);
                card.id = elementId;
                card.dataset.dbdMatchId = matchId;

                // Find correct position in wrapper to maintain reverse-chronological order
                const nextInSorted = matches[index + 1];
                let referenceNode = null;
                if (nextInSorted) {
                    const nextElementId = `dbd-match-${nextInSorted.matchStat.matchStartTime}`;
                    referenceNode = document.getElementById(nextElementId);
                }

                if (referenceNode) {
                    wrapper.insertBefore(card, referenceNode);
                } else {
                    wrapper.appendChild(card);
                }
            }

            // Ensure only the latest match is expanded after adding new data or re-processing
            card.setAttribute('data-dbd-expanded', index === 0 ? 'true' : 'false');
        });
    }


    // --- Initialization ---

    function init() {
        if (!document.head || !document.body) {
            setTimeout(init, 10);
            return;
        }

        console.log('[DBD Userscript] Initializing DOM components...');

        // CSS Injection
        const style = document.createElement('style');
        style.textContent = `
            #dbd-enhanced-history-wrapper {
                display: flex !important;
                flex-direction: column !important;
                gap: 24px !important;
                width: 100% !important;
            }
            .dbd-table-mode {
                display: block !important;
                padding: 8px !important;
                height: auto !important;
                min-height: unset !important;
                cursor: pointer !important;
                border: 1px solid rgba(206, 206, 206, 0.1) !important;
                border-radius: 8px !important;
                overflow: hidden !important;
                width: 100% !important;
                transition: background 0.2s ease;
            }
            .dbd-survivor-match.dbd-table-mode {
                background: linear-gradient(157deg, oklab(0.372685 -0.0166675 -0.0297666 / 0.9) 0px, oklab(0.256055 -0.00657756 -0.0136725 / 0.5) 80%) !important;
            }
            .dbd-killer-match.dbd-table-mode {
                background: linear-gradient(157deg, oklab(0.300393 0.107573 0.060206 / 0.6) 0px, oklab(0.202126 0.0788645 0.0174824 / 0.36) 80%) !important;
            }
            .dbd-survivor-match.dbd-table-mode:hover {
                background: linear-gradient(157deg, oklab(0.372685 -0.0166675 -0.0297666 / 1) 0px, oklab(0.300393 -0.0105345 -0.0232491 / 0.6) 80%) !important;
            }
            .dbd-killer-match.dbd-table-mode:hover {
                background: linear-gradient(157deg, oklab(0.300393 0.107573 0.060206 / 0.8) 0px, oklab(0.202126 0.0788645 0.0174824 / 0.48) 80%) !important;
            }
            .dbd-table-mode[data-dbd-expanded="false"] .dbd-opponent-row {
                display: none;
            }
            .dbd-match-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 16px;
                color: #ccc;
                table-layout: fixed;
            }
            .dbd-match-table th {
                padding: 4px;
                border-bottom: 1px solid #333;
                color: #777;
                font-weight: 600;
                text-align: right;
                text-transform: uppercase;
                font-size: 9px;
                letter-spacing: 0.5px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: clip;
            }
            .dbd-player-row td {
                padding: 4px;
                border-bottom: 1px solid #222;
                vertical-align: middle;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .dbd-player-row:last-child td {
                border-bottom: none;
            }
            .dbd-killer-row {
                background: rgba(255, 68, 68, 0.08);
            }
            .dbd-killer-row td {
                border-bottom-color: rgba(255, 68, 68, 0.2);
            }
            .dbd-char-container {
                position: relative;
                width: ${ICON_SIZE}px;
                height: ${ICON_SIZE}px;
                overflow: hidden;
                border-radius: 2px;
            }
            .dbd-char-bg {
                position: absolute;
                inset: 0;
                width: 100%;
                height: 100%;
                object-fit: cover;
                z-index: 1;
            }
            .dbd-char-icon-wrapper {
                position: absolute;
                inset: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2;
                /* Matches the masking style from original site */
                clip-path: polygon(0 0, 100% 0, 100% 90%, 90% 100%, 0 100%);
            }
            .dbd-char-icon {
                width: 120%;
                max-width: none;
                height: auto;
                object-fit: contain;
            }
            .dbd-status-icon-overlay {
                position: absolute;
                bottom: -2px;
                right: -2px;
                width: 24px;
                height: 24px;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 50%;
                border: 1px solid #444;
                padding: 1px;
                z-index: 3;
            }
            
            /* Loadout Styles */
            .dbd-loadout-cell {
                padding: 0 4px !important;
            }
            .dbd-loadout-container {
                display: flex;
                align-items: center;
                gap: 2px;
                height: ${ICON_SIZE}px;
            }
            .dbd-loadout-group {
                display: flex;
                align-items: center;
                gap: 1px;
            }
            .dbd-loadout-item {
                position: relative;
                display: inline-block;
                margin: 0px 2px;
            }
            .dbd-loadout-large {
                width: ${ICON_SIZE}px;
                height: ${ICON_SIZE}px;
            }
            .dbd-loadout-small {
                width: ${ICON_SIZE_SMALL}px;
                height: ${ICON_SIZE_SMALL}px;
            }
            .dbd-loadout-bg {
                position: absolute;
                inset: 0;
                background-position: center;
                background-size: contain;
                background-repeat: no-repeat;
                filter: brightness(0);
            }
            .dbd-loadout-empty .dbd-loadout-bg {
                opacity: 0.2;
            }
            .dbd-loadout-icon-container {
                position: relative;
                z-index: 1;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .dbd-loadout-icon {
                width: 100%;
                object-fit: contain;
            }
            .dbd-loadout-divider {
                width: 1px;
                align-self: stretch;
                background: #6f6f6f;
                margin: 0px 4px;
            }
            .dbd-loadout-plus {
                font-size: 14px;
                font-weight: bold;
                margin: 0 1px;
            }
            .dbd-loadout-addons {
                display: flex;
                flex-direction: row;
                gap: 1px;
            }

            .dbd-stat-cell {
                font-size: 14px;
                text-align: right;
                color: #ccc;
            }
            .dbd-stat-low {
                color: #d4af37;
            }
            .dbd-user-row {
                background: rgba(255, 255, 255, 0.05);
            }
            .dbd-bp-cell {
                text-align: right;
                color: #d4af37;
                font-weight: bold;
            }
            .dbd-time-cell {
                text-align: center;
            }
            .dbd-user-row .dbd-time-cell {
                color: white;
                font-weight: bold;
            }

            /* Global Info Styles */
            .dbd-match-container {
                display: flex;
                gap: 16px;
                align-items: stretch;
                justify-content: space-between;
                width: 100%;
            }
            .dbd-match-global-info {
                display: flex;
                gap: 16px;
                align-items: center;
                min-width: 320px;
                padding-top: 8px;
                padding-left: 16px;
                border-left: 1px solid rgba(206, 206, 206, 0.1);
            }
            .dbd-map-photo-container {
                position: relative;
                width: 120px;
                height: 80px;
                overflow: hidden;
                border-radius: 4px;
                flex-shrink: 0;
            }
            .dbd-map-photo {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            .dbd-global-text-stack {
                display: flex;
                flex-direction: column;
                gap: 2px;
                text-align: left;
                color: #aaa;
            }
            .dbd-match-map-name {
            }
            .dbd-bph-container {
                display: flex;
                align-items: baseline;
            }
            .dbd-bph-value {
                font-size: 22px;
                font-weight: bold;
                color: white;
            }
            .dbd-bph-label {
                font-size: 12px;
                opacity: 0.8;
                padding-left: 4px;
            }
            .dbd-downtime-container {
                display: flex;
                align-items: baseline;
                font-size: 12px;
            }
            .dbd-downtime-label {
                padding-left: 4px;
                font-size: 12px;
                opacity: 0.7;
            }
        `;
        document.head.appendChild(style);

        // Observer
        const observer = new MutationObserver(() => {
            if (matchDataStore.size > 0) {
                if (window._dbdTimer) clearTimeout(window._dbdTimer);
                window._dbdTimer = setTimeout(processAllCards, 0);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });


        // Initial scan
        processAllCards();
    }

    // Start initialization when DOM begins loading
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
