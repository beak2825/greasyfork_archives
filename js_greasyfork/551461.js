// ==UserScript==
// @name         GeoGuessr Duels Stats
// @namespace    terrorz
// @version      1.2.5
// @description  Displays best/worst countries, history, and user info on GeoGuessr profiles
// @author       Terrorz
// @match        *://*.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=32&domain=geoguessr.com
// @grant        GM_xmlhttpRequest
// @connect      geoguessr.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551461/GeoGuessr%20Duels%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/551461/GeoGuessr%20Duels%20Stats.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Constants
    const CONFIG = {
        INSERTION_DELAYS: [0, 100, 300],
        FLAG_BASE_URL: 'https://flagcdn.com/w80/',
        API_BASE_URL: 'https://www.geoguessr.com/api',
        CONTAINER_ID: 'geoguessr-stats-extension',
        ACCOUNT_AGE_THRESHOLD_DAYS: 15,
        MAX_HISTORY_ITEMS: 10,
        MAX_UPDATE_CALLS: 4,
        INITIAL_LOAD_DELAY: 100,
        NAVIGATION_DELAY: 150
    };

    const GAME_MODE_MAP = {
        'StandardDuels': 'Move',
        'NoMoveDuels': 'NM',
        'NmpzDuels': 'NMPZ'
    };

    const GAME_MODE_FULL_NAMES = {
        'StandardDuels': 'Moving Duel',
        'NoMoveDuels': 'No Move Duel',
        'NmpzDuels': 'NMPZ Duel'
    };

    const SVG_TEMPLATES = {
        win: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="29" height="29" style="display: inline-block; vertical-align: middle; margin: 0 6px;">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="#4ade80" stroke="#34d2ab" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,

        loss: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="29" height="29" style="display: inline-block; vertical-align: middle; margin: 0 6px;">
            <path d="M18 6L6 18M6 6l12 12" fill="none" stroke="#c8374d" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,

        lock: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="display: inline-block; vertical-align: middle; margin: 0 4px;">
            <path d="M12.2744 2C12.6994 2.00388 13.1598 2.02078 13.6357 2.05859C14.6662 2.14047 15.8151 2.32594 16.8584 2.72949C17.9017 3.13306 18.9144 3.78555 19.5508 4.84473C20.1725 5.87959 20.5328 7.22592 20.7451 8.53027C20.9605 9.85326 21.0381 11.2242 21.0459 12.3672C21.0462 12.4098 21.0448 12.4521 21.0449 12.4941C21.1272 12.4864 21.2112 12.4811 21.2969 12.4805L21.4521 12.4854L21.6816 12.5166C22.1988 12.6184 22.5912 12.927 22.8486 13.3057C23.1218 13.7075 23.2434 14.1799 23.29 14.5996C23.3819 15.4268 23.2198 16.4039 22.834 17.1094C22.438 17.8334 21.7697 18.4025 21.0879 18.749C20.6064 18.9937 20.0037 19.1825 19.3994 19.1553C18.3233 20.0927 16.2982 21.418 13.873 21.8545L13.8721 21.8555L13.8604 21.8574H13.8584L13.8438 21.8604L13.8428 21.8594V21.8604C13.8406 21.8607 13.8372 21.8608 13.834 21.8613C13.8287 21.8623 13.8218 21.8643 13.8164 21.8652C13.3582 21.9449 12.8832 21.9931 12.3965 22H12.3242C11.8476 21.9996 11.3819 21.9593 10.9316 21.8887C10.9098 21.8853 10.901 21.8842 10.8984 21.8838L10.8906 21.8828L10.8828 21.8818L10.8818 21.8809H10.877C10.8749 21.8805 10.8723 21.8802 10.8701 21.8799L10.8564 21.877C10.8504 21.8759 10.8343 21.8735 10.792 21.8662C8.38469 21.4519 6.36341 20.1656 5.2832 19.249C4.68002 19.2838 4.07592 19.1042 3.5918 18.8662C2.90535 18.5287 2.22874 17.968 1.82324 17.249C1.42845 16.5488 1.25395 15.5742 1.33496 14.7461C1.37609 14.3259 1.49104 13.8516 1.75879 13.4463C2.04728 13.0096 2.51445 12.6623 3.14551 12.6084L3.2998 12.6006L3.50293 12.6064C3.51928 12.6075 3.53554 12.609 3.55176 12.6104C3.55131 12.5683 3.55007 12.526 3.5498 12.4834C3.54275 11.3405 3.60271 9.96919 3.80078 8.64355C3.99609 7.33659 4.33826 5.98537 4.94629 4.94238C5.56881 3.87471 6.57424 3.20947 7.6123 2.79199C8.65023 2.37461 9.79594 2.17375 10.8252 2.07812C11.3018 2.03385 11.762 2.0105 12.1855 2.00098H12.2217C12.2275 2.0008 12.2358 2.00019 12.2451 2H12.2744ZM10.9053 21.8848H10.9033C10.9017 21.8845 10.9003 21.8839 10.8994 21.8838L10.9053 21.8848Z" stroke="#82818b" stroke-width="2" stroke-linejoin="round"/>
            <path d="M16.3154 10V15" stroke="#82818b" stroke-width="1.6" stroke-linecap="round"/>
            <path d="M8.31543 10.2529V15.2529" stroke="#82818b" stroke-width="1.6" stroke-linecap="round"/>
        </svg>`,

        dash: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" style="display: inline-block; vertical-align: middle; margin: 0 2px;">
            <line x1="4" y1="10" x2="16" y2="10" stroke="#82818b" stroke-width="2.5" stroke-linecap="round"/>
        </svg>`
    };

    const STYLES = {
        container: `
            background: rgba(46, 41, 72, 0.76);
            backdrop-filter: blur(6px);
            border-radius: 0.6rem;
            padding: 13px 10px;
            margin-top: 15px;
            color: #ffffff;
            box-shadow: rgba(32, 17, 46, 0.2) 0px 0.25rem 2.75rem, rgba(0, 0, 0, 0.24) 0px 1.125rem 2.25rem -1.125rem, rgba(0, 0, 0, 0.16) 0px 1.875rem 1.75rem -0.01rem;
        `,
        tooltip: `
            position: absolute;
            background: rgba(30, 25, 55, 0.88);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 8px;
            padding: 12px 14px;
            z-index: 10000;
            pointer-events: none;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
            font-size: 13px;
            color: #e0dff2;
            min-width: 240px;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            margin-bottom: 8px;
            white-space: nowrap;
        `,
        historyItem: `
            background: rgba(36, 30, 77, 0.55);
            box-shadow: 1px 1px 10px 0px #1a1638 inset;
            border-radius: 12px;
            padding: 8px 5px;
            display: inline-flex;
            flex-direction: column;
            align-items: center;
            margin: 0 5px;
            position: relative;
            transition: all 0.2s ease;
        `
    };

    // State
    const state = {
        currentUserId: null,
        statsContainer: null,
        activeTooltip: null
    };

    // Utility functions
    const Utils = {
        getFlag(countryCode) {
            if (!countryCode) return '';
            const code = countryCode.toLowerCase();
            return `<img src="${CONFIG.FLAG_BASE_URL}${code}.png"
                     style="width:48px; height:32px; border-radius:8px; object-fit:cover;"
                     alt="${code}">`;
        },

        getSmallFlag(countryCode) {
            if (!countryCode) return '';
            const code = countryCode.toLowerCase();
            return `<img src="${CONFIG.FLAG_BASE_URL}${code}.png"
                     style="width:20px; height:13px; border-radius:3px; object-fit:cover; margin-right:6px;"
                     alt="${code}">`;
        },

        extractUserId() {
            const pathParts = window.location.pathname.split('/');

            // If on personal profile (/me/profile), extract UUID from share input
            if (window.location.pathname.includes('/me/profile')) {
                const shareInput = document.querySelector('input[name="copy-link"]');
                if (shareInput && shareInput.value) {
                    const match = shareInput.value.match(/\/user\/([a-f0-9]+)$/);
                    if (match) {
                        return match[1];
                    }
                }
                // If input not found yet, return null to trigger retry
                return null;
            }

            // Standard user profile
            return pathParts[pathParts.length - 1];
        },

        getDaysDifference(date1, date2) {
            return Math.floor((date1 - date2) / (1000 * 60 * 60 * 24));
        },

        getTimeDifference(dateString) {
            const date = new Date(dateString);
            const now = new Date();
            const diffMs = now - date;

            if (diffMs <= 0) return { value: 0, unit: 'now' };

            const diffMinutes = Math.floor(diffMs / (1000 * 60));
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            const diffMonths = Math.floor(diffDays / 30);
            const diffYears = Math.floor(diffDays / 365);

            if (diffYears > 0) return { value: diffYears, unit: 'year' };
            if (diffMonths > 0) return { value: diffMonths, unit: 'month' };
            if (diffDays > 0) return { value: diffDays, unit: 'day' };
            if (diffHours > 0) return { value: diffHours, unit: 'hour' };
            if (diffMinutes > 0) return { value: diffMinutes, unit: 'minute' };
            return { value: 0, unit: 'now' };
        },

        formatTimeDifference(diff, suffix = '') {
            if (diff.unit === 'now') return suffix === ' ago' ? 'Just now' : 'Today';
            const plural = diff.value > 1 ? 's' : '';
            return `${diff.value} ${diff.unit}${plural}${suffix}`;
        }
    };

    const PageValidator = {
        is404Page() {
            // Check if 404 page is present
            return document.querySelector('div[class*="_error_errorPage"]') !== null;
        },

        isValidProfilePage() {
            const isProfileUrl = window.location.href.includes('/user/') ||
                  window.location.href.includes('/me/profile');

            return isProfileUrl && !this.is404Page();
        }
    };

    // Time formatting functions
    const TimeFormatter = {
        getRelativeTime(dateString) {
            const diff = Utils.getTimeDifference(dateString);
            return Utils.formatTimeDifference(diff);
        },

        getTimeSince(dateString) {
            const diff = Utils.getTimeDifference(dateString);
            if (diff.unit === 'now') return 'Ongoing';
            return Utils.formatTimeDifference(diff, ' ago');
        },

        getTimeAgo(dateString) {
            const diff = Utils.getTimeDifference(dateString);
            return Utils.formatTimeDifference(diff, ' ago');
        }
    };

    // User data processing
    const UserDataProcessor = {
        getSuspensionStatus(suspendedUntil) {
            if (suspendedUntil === null) {
                return { text: 'Never', color: '#4ade80' };
            }

            const suspensionDate = new Date(suspendedUntil);
            const now = new Date();

            if (suspensionDate > now) {
                return { text: 'Active', color: '#f44336' };
            }

            return {
                text: TimeFormatter.getTimeSince(suspendedUntil),
                color: '#ffb74d'
            };
        },

        getNicknameChangeInfo(userData) {
            const lastChange = new Date(userData.lastNameChange);
            const created = new Date(userData.created);

            // Default value for unchanged nicknames (year 2000)
            if (lastChange.getFullYear() === 2000) {
                return "Never";
            }

            const diffDays = Utils.getDaysDifference(lastChange, created);

            // If changed within 15 days of account creation, consider it the original nickname
            if (diffDays < CONFIG.ACCOUNT_AGE_THRESHOLD_DAYS) {
                return "Never";
            }

            return TimeFormatter.getRelativeTime(userData.lastNameChange) + " ago";
        }
    };

    // Game data processing
    const GameDataProcessor = {
        findTeamByUserId(teams, userId) {
            return teams?.find(t => t.players[0]?.playerId === userId) || null;
        },

        findPlayerById(players, playerId) {
            return players?.find(p => p.id === playerId) || null;
        },

        calculateEloChange(playerElo, nextGameElo, currentRating, isFirst) {
            if (isFirst && currentRating) {
                return currentRating - playerElo;
            }
            return nextGameElo ? nextGameElo - playerElo : 0;
        },

        getGameDetails(gameData, userId, historyData, index, currentRating) {
            if (!gameData?.duel?.teams || gameData.duel.teams.length !== 2) {
                return null;
            }

            const teams = gameData.duel.teams;
            const playerTeam = this.findTeamByUserId(teams, userId);
            const opponentTeam = teams.find(t => t.players[0]?.playerId !== userId);

            if (!playerTeam || !opponentTeam) {
                return null;
            }

            const playerElo = playerTeam.players[0].rankedSystemRating;
            const opponentElo = opponentTeam.players[0].rankedSystemRating;
            const opponentId = opponentTeam.players[0].playerId;

            const opponentInfo = this.findPlayerById(gameData.players, opponentId);
            const playerInfo = this.findPlayerById(gameData.players, userId);

            // Calculate ELO change
            let eloChange = 0;
            if (index === 0) {
                eloChange = this.calculateEloChange(playerElo, null, currentRating, true);
            } else {
                const previousGame = historyData.entries[index - 1];
                if (previousGame?.duel?.teams) {
                    const prevPlayerTeam = this.findTeamByUserId(previousGame.duel.teams, userId);
                    if (prevPlayerTeam) {
                        const prevElo = prevPlayerTeam.players[0].rankedSystemRating;
                        eloChange = this.calculateEloChange(playerElo, prevElo, null, false);
                    }
                }
            }

            const startTime = gameData.duel?.rounds?.[0]?.startTime;

            return {
                playerNick: playerInfo?.nick || 'You',
                playerElo,
                playerCountry: playerInfo?.countryCode,
                opponentNick: opponentInfo?.nick || 'Opponent',
                opponentElo,
                opponentCountry: opponentInfo?.countryCode,
                eloDiff: playerElo - opponentElo,
                isWin: gameData.duel.winnerId === userId,
                gameMode: gameData.duel.gameMode,
                eloChange,
                timeAgo: startTime ? TimeFormatter.getTimeAgo(startTime) : 'Unknown'
            };
        }
    };

    // UI Components
    const UIComponents = {
        createUserInfoCard(userData) {
            if (!userData) return '';

            const accountAge = TimeFormatter.getRelativeTime(userData.created);
            const lastNameChange = UserDataProcessor.getNicknameChangeInfo(userData);
            const suspensionStatus = UserDataProcessor.getSuspensionStatus(userData.suspendedUntil);

            const banBadge = userData.isBanned ? `
                <div style="text-align: center; grid-column: 1 / -1;">
                    <div style="background: rgba(244, 67, 54, 0.15); border: 1.5px solid rgba(244, 67, 54, 0.4); border-radius: 8px; padding: 8px 12px; display: inline-flex; align-items: center; font-size: 13px; font-weight: 600; color: #ff5252;">
                        <span>Banned account</span>
                    </div>
                </div>
            ` : '';

            return `
                <div style="background: rgba(255, 255, 255, 0.05); padding: 16px; border-radius: 8px; margin-bottom: 14px;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; align-items: center;">
                        <div style="text-align: center;">
                            <div style="font-size: 11px; font-style: italic; text-transform: uppercase; letter-spacing: 0.5px; color: #82818b; margin-bottom: 6px; font-weight: 600;">Account created</div>
                            <div style="font-size: 16px; font-weight: 650; color: #e0dff2;">${accountAge} ago</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 11px; font-style: italic; text-transform: uppercase; letter-spacing: 0.5px; color: #82818b; margin-bottom: 6px; font-weight: 600;">Last nickname</div>
                            <div style="font-size: 16px; font-weight: 650; color: #e0dff2;">${lastNameChange}</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 11px; font-style: italic; text-transform: uppercase; letter-spacing: 0.5px; color: #82818b; margin-bottom: 6px; font-weight: 600;">Last suspension</div>
                            <div style="font-size: 16px; font-weight: 650; color: ${suspensionStatus.color};">${suspensionStatus.text}</div>
                        </div>
                        ${banBadge}
                    </div>
                </div>
            `;
        },

        createTooltip(details, isWin) {
            if (!details) return null;

            const eloChangeColor = details.eloChange > 0 ? '#4ade80' : '#f44336';
            const eloChangeSign = details.eloChange > 0 ? '+' : '';
            const eloDiffSign = details.eloDiff > 0 ? '+' : '';
            const eloDiffColor = details.eloDiff > 0 ? '#4ade80' : details.eloDiff < 0 ? '#f44336' : '#82818b';
            const playerColor = isWin ? '#4ade80' : '#f44336';
            const opponentColor = isWin ? '#f44336' : '#4ade80';

            const playerFlag = Utils.getSmallFlag(details.playerCountry);
            const opponentFlag = Utils.getSmallFlag(details.opponentCountry);

            const gameModeTitle = GAME_MODE_FULL_NAMES[details.gameMode] || details.gameMode;

            const tooltip = document.createElement('div');
            tooltip.className = 'game-tooltip';
            tooltip.style.cssText = STYLES.tooltip;

            tooltip.innerHTML = `
                <div style="text-align: center; margin-bottom: 10px;">
                    <span style="color: #ffa43d; font-weight: 650; font-size: 13px; text-transform: uppercase; font-style: italic; letter-spacing: 0.5px;">${gameModeTitle}</span>
                </div>
                <div style="margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                        <span style="color: ${playerColor}; font-weight: 600; display: flex; align-items: center;">${playerFlag}${details.playerNick}</span>
                        <span style="color: #fff;">${details.playerElo} ELO</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: ${opponentColor}; font-weight: 600; display: flex; align-items: center;">${opponentFlag}${details.opponentNick}</span>
                        <span style="color: #fff;">${details.opponentElo} ELO</span>
                    </div>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                    <span style="color: #82818b;">Rating difference</span>
                    <span style="color: ${eloDiffColor}; font-weight: 600;">${eloDiffSign}${details.eloDiff} ELO</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                    <span style="color: #82818b;">${details.eloChange > 0 ? 'Gain' : 'Loss'}</span>
                    <span style="color: ${eloChangeColor}; font-weight: 600;">${eloChangeSign}${details.eloChange} ELO</span>
                </div>
                <div style="text-align: center; padding-top: 6px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                    <span style="color: #fff; font-size: 11px;">${details.timeAgo}</span>
                </div>
                <div style="position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid rgba(30, 25, 55, 0.98);"></div>
            `;

            return tooltip;
        },

        createHistoryItem(isWin, gameData, userId, index, historyData, currentRating) {
            const gameMode = gameData?.duel?.gameMode;
            const modeText = GAME_MODE_MAP[gameMode] || gameMode || '?';
            const resultSvg = isWin ? SVG_TEMPLATES.win : SVG_TEMPLATES.loss;
            const gameDetails = GameDataProcessor.getGameDetails(gameData, userId, historyData, index, currentRating);

            const itemDiv = document.createElement('div');
            itemDiv.className = 'history-item';
            itemDiv.style.cssText = STYLES.historyItem + `cursor: ${gameDetails ? 'pointer' : 'default'};`;

            itemDiv.innerHTML = `
                <div style="font-size: 12px; color: #fff; margin-bottom: 2px;">${modeText}</div>
                ${resultSvg}
            `;

            if (gameDetails) {
                this.attachTooltipHandlers(itemDiv, gameDetails, isWin);
                this.attachClickHandler(itemDiv, gameData, userId);
            }

            return itemDiv;
        },

        attachClickHandler(element, gameData, userId) {
            element.addEventListener('click', function() {
                const teams = gameData?.duel?.teams;
                if (!teams) return;

                const opponentTeam = teams.find(t => t.players[0]?.playerId !== userId);
                if (opponentTeam?.players[0]?.playerId) {
                    const opponentId = opponentTeam.players[0].playerId;
                    window.open(`https://www.geoguessr.com/user/${opponentId}`, '_blank');
                }
            });
        },

        attachTooltipHandlers(element, details, isWin) {
            element.addEventListener('mouseenter', function() {
                this.style.background = 'rgba(46, 41, 72, 0.75)';
                this.style.transform = 'translateY(-2px)';

                if (state.activeTooltip) {
                    state.activeTooltip.remove();
                }

                const tooltip = UIComponents.createTooltip(details, isWin);
                if (tooltip) {
                    this.appendChild(tooltip);
                    state.activeTooltip = tooltip;
                }
            });

            element.addEventListener('mouseleave', function() {
                this.style.background = 'rgba(36, 30, 77, 0.55)';
                this.style.transform = 'translateY(0)';

                if (state.activeTooltip) {
                    state.activeTooltip.remove();
                    state.activeTooltip = null;
                }
            });
        },

        buildHistory(latestGames, historyData, currentRating, userId) {
            const historyContainer = document.createElement('div');
            historyContainer.style.cssText = 'font-size: 24px; line-height: 1.4; display: flex; justify-content: center;';

            const gameEntries = historyData?.entries?.slice(0, CONFIG.MAX_HISTORY_ITEMS) || [];

            latestGames.forEach((isWin, index) => {
                const gameData = gameEntries[index];
                const itemDiv = this.createHistoryItem(isWin, gameData, userId, index, historyData, currentRating);
                historyContainer.appendChild(itemDiv);
            });

            return historyContainer;
        },

        createStatCard(title, content, isWide = false) {
            const card = document.createElement('div');
            card.style.cssText = `
                background: rgba(255, 255, 255, 0.05);
                padding: 16px;
                border-radius: 8px;
                display: flex;
                flex-direction: column;
                justify-content: ${isWide ? 'center' : 'flex-start'};
                align-items: center;
                text-align: center;
                ${isWide ? 'grid-column: span 3;' : ''}
            `;

            const titleDiv = document.createElement('div');
            titleDiv.style.cssText = `
                font-weight: 650;
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 0.3px;
                color: #bbb9c7;
                font-style: italic;
                min-height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 12px;
            `;
            titleDiv.innerHTML = title;
            card.appendChild(titleDiv);

            if (typeof content === 'string') {
                const contentDiv = document.createElement('div');
                contentDiv.style.cssText = isWide ?
                    'font-size: 24px; line-height: 1.4; display: flex; justify-content: center;' :
                    'flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;';
                contentDiv.innerHTML = content;
                card.appendChild(contentDiv);
            } else {
                card.appendChild(content);
            }

            return card;
        },

        createStatsDisplay(data, historyData, userData, userId) {
            const container = document.createElement('div');
            container.id = CONFIG.CONTAINER_ID;
            container.style.cssText = STYLES.container;

            const hasData = data?.bestCountries && data?.worstCountries && data?.latestGames;

            let bestCountries, worstCountries, history;

            if (hasData) {
                bestCountries = data.bestCountries.map(code => Utils.getFlag(code)).join(' ');
                worstCountries = data.worstCountries.map(code => Utils.getFlag(code)).join(' ');
                history = this.buildHistory(data.latestGames, historyData, data.rating, userId);
            } else {
                bestCountries = SVG_TEMPLATES.lock.repeat(3);
                worstCountries = SVG_TEMPLATES.lock.repeat(3);
                const dashContainer = document.createElement('div');
                dashContainer.innerHTML = Array(10).fill(SVG_TEMPLATES.dash).join(' ');
                history = dashContainer;
            }

            const userInfoDiv = document.createElement('div');
            userInfoDiv.innerHTML = this.createUserInfoCard(userData);
            container.appendChild(userInfoDiv);

            const gridDiv = document.createElement('div');
            gridDiv.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; align-items: stretch;';

            gridDiv.appendChild(this.createStatCard('Best Countries', bestCountries));
            gridDiv.appendChild(this.createStatCard('Worst Countries', worstCountries));
            gridDiv.appendChild(this.createStatCard('Recent History', history, true));

            container.appendChild(gridDiv);

            return container;
        }
    };

    // DOM manipulation
    const DOMManager = {
        removeOldStats() {
            const oldStats = document.getElementById(CONFIG.CONTAINER_ID);
            if (oldStats) {
                oldStats.remove();
            }
            state.statsContainer = null;
        },

findInsertionPoint() {
            // Look for specific section_sectionHeader element
            const sectionHeaders = document.querySelectorAll('[class*="section_sectionHeader"][class*="section_sizeSmall"][class*="section_variantLight"]');

            for (const header of sectionHeaders) {
                // Check if it's a valid section header (usually "Statistics")
                if (header.offsetParent !== null) {
                    console.log('Found section header:', header);
                    return { element: header, method: 'after', name: 'section_sectionHeader' };
                }
            }

            // Look for any section_sectionHeader
            const allHeaders = document.querySelectorAll('[class*="section_sectionHeader"]');
            for (const header of allHeaders) {
                if (header.textContent.includes('Statistics') || header.offsetHeight > 0) {
                    console.log('Found generic section header:', header);
                    return { element: header, method: 'after', name: 'Statistics section header' };
                }
            }

            // Look for the last significant content div in main
            const mainContent = document.querySelector('main');
            if (mainContent) {
                const contentDivs = Array.from(mainContent.children).filter(child => {
                    return child.tagName === 'DIV' &&
                           child.offsetHeight > 100 &&
                           child.offsetParent !== null &&
                           !child.id.includes(CONFIG.CONTAINER_ID);
                });

                if (contentDivs.length > 0) {
                    const targetDiv = contentDivs[0]; // First content element
                    console.log('Using first main content div:', targetDiv);
                    return { element: targetDiv, method: 'after', name: 'first main content div' };
                }
            }

            // Final fallback
            const main = document.querySelector('main');
            if (main) {
                return { element: main, method: 'prepend', name: 'main (prepend)' };
            }

            return null;
        },

        insertStatsIntoDOM() {
            if (document.getElementById(CONFIG.CONTAINER_ID)) {
                return true;
            }

            const insertionPoint = this.findInsertionPoint();
            if (!insertionPoint) return false;

            if (insertionPoint.method === 'after') {
                insertionPoint.element.after(state.statsContainer);
            } else {
                insertionPoint.element.appendChild(state.statsContainer);
            }

            console.log(`Stats inserted after ${insertionPoint.name}`);
            return true;
        },

        scheduleInsertion() {
            // Try immediate insertion first
            if (this.insertStatsIntoDOM()) {
                return;
            }

            // If failed, schedule retries
            CONFIG.INSERTION_DELAYS.forEach(delay => {
                setTimeout(() => this.insertStatsIntoDOM(), delay);
            });
        }
    };

    // API functions
    const API = {
        async fetchData(url, errorMessage) {
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    onload: (response) => {
                        try {
                            const data = JSON.parse(response.responseText);
                            resolve(data);
                        } catch (error) {
                            console.log(errorMessage, error);
                            resolve(null);
                        }
                    },
                    onerror: (error) => {
                        console.log(errorMessage, error);
                        resolve(null);
                    }
                });
            });
        },

        async fetchAllData(userId) {
            const endpoints = {
                history: `${CONFIG.API_BASE_URL}/v4/game-history/${userId}`,
                ranked: `${CONFIG.API_BASE_URL}/v4/ranked-system/progress/${userId}`,
                user: `${CONFIG.API_BASE_URL}/v3/users/${userId}`
            };

            const [historyData, rankedData, userData] = await Promise.all([
                this.fetchData(endpoints.history, 'Error retrieving history:'),
                this.fetchData(endpoints.ranked, 'No ranked data for this user:'),
                this.fetchData(endpoints.user, 'Error retrieving user data:')
            ]);

            return { historyData, rankedData, userData };
        }
    };

    // Main functions
    async function loadStats() {
        // First check if we're on a 404 page
        if (PageValidator.is404Page()) {
            console.log('Page 404 détectée, stats non chargées');
            DOMManager.removeOldStats();
            state.currentUserId = null;
            return;
        }

        const userId = Utils.extractUserId();

        // If no userId found (share input not yet loaded on /me/profile), retry
        if (!userId) {
            setTimeout(loadStats, 200);
            return;
        }

        // Prevent redundant loading
        if (userId === state.currentUserId && state.statsContainer) {
            return;
        }

        state.currentUserId = userId;
        DOMManager.removeOldStats();

        // Load data asynchronously
        const { historyData, rankedData, userData } = await API.fetchAllData(userId);

        // Create and insert stats container with real data
        state.statsContainer = UIComponents.createStatsDisplay(
            rankedData,
            historyData,
            userData,
            userId
        );

        DOMManager.scheduleInsertion();
    }

    function initializeNavigationObserver() {
        let lastUrl = location.href;

        // Strategy 1: MutationObserver for DOM changes
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                if (PageValidator.isValidProfilePage()) {
                    setTimeout(loadStats, CONFIG.NAVIGATION_DELAY);
                }
            }
        }).observe(document, { subtree: true, childList: true });

        // Strategy 2: Listen to popstate (browser back/forward)
        window.addEventListener('popstate', () => {
            if (PageValidator.isValidProfilePage()) {
                setTimeout(loadStats, CONFIG.NAVIGATION_DELAY);
            }
        });

        // Strategy 3: Intercept pushState and replaceState
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function(...args) {
            originalPushState.apply(this, args);
            if (PageValidator.isValidProfilePage()) {
                setTimeout(loadStats, CONFIG.NAVIGATION_DELAY);
            }
        };

        history.replaceState = function(...args) {
            originalReplaceState.apply(this, args);
            if (PageValidator.isValidProfilePage()) {
                setTimeout(loadStats, CONFIG.NAVIGATION_DELAY);
            }
        };
    }

    function initialize() {
        // Always initialize navigation observer first
        initializeNavigationObserver();

        // Check if we're on a valid profile page and load immediately
        if (PageValidator.isValidProfilePage()) {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => setTimeout(loadStats, CONFIG.INITIAL_LOAD_DELAY));
            } else {
                setTimeout(loadStats, CONFIG.INITIAL_LOAD_DELAY);
            }
        }
    }

    // Start the script
    initialize();
})();