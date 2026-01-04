// ==UserScript==
// @name         Geoguessr Activities Exporter
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Fetches Geoguessr duel data with date range filtering and exports to JSON
// @author       Data Fetcher (kairos)
// @match        https://www.geoguessr.com/me/profile
// @grant        GM_addStyle
// @require      https://unpkg.com/axios@1.6.7/dist/axios.min.js
// @connect      game-server.geoguessr.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555138/Geoguessr%20Activities%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/555138/Geoguessr%20Activities%20Exporter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        API_BASE_URL: 'https://game-server.geoguessr.com/api/duels',
        FEED_API_URL: 'https://www.geoguessr.com/api/v4/feed/private',
        REQUEST_DELAY_MS: 1000,
        BATCH_SIZE: 10,
    };

    const AppState = {
        playerId: '',
        numberOfGames: 1,
        mainContainer: null,
        preloader: null,
        stopButton: null,
        isLoading: false,
        shouldStop: false,
        requestLog: [],
        dateFrom: null,
        dateTo: null,
        gameMode: 'Duels',
        currentDuels: []
    };

    class RequestLogger {
        static log(type, url, status, duration) {
            const logEntry = {
                timestamp: new Date().toISOString(),
                type,
                url,
                status,
                duration: `${duration}ms`
            };
            AppState.requestLog.push(logEntry);
            console.log(`[REQUEST] ${type} | ${status} | ${duration}ms | ${url}`);
        }
    }

    class RateLimitedRequester {
        constructor(delayMs = CONFIG.REQUEST_DELAY_MS) {
            this.delayMs = delayMs;
            this.lastRequestTime = 0;
        }

        async request(fn) {
            const now = Date.now();
            const timeSinceLastRequest = now - this.lastRequestTime;

            if (timeSinceLastRequest < this.delayMs) {
                const waitTime = this.delayMs - timeSinceLastRequest;
                await this.delay(waitTime);
            }

            this.lastRequestTime = Date.now();
            const startTime = Date.now();

            try {
                const result = await fn();
                const duration = Date.now() - startTime;
                return { result, duration };
            } catch (error) {
                const duration = Date.now() - startTime;
                throw { error, duration };
            }
        }

        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    }

    const requester = new RateLimitedRequester();

    function parseDate(dateString) {
        if (!dateString) return null;
        const date = new Date(dateString);
        date.setHours(0, 0, 0, 0);
        return date;
    }

    function isDateInRange(dateString, fromDate, toDate) {
        if (!dateString) return false;

        const date = new Date(dateString);
        date.setHours(0, 0, 0, 0);

        if (fromDate && date < fromDate) return false;
        if (toDate && date > toDate) return false;

        return true;
    }

    function formatDateForFilename(date) {
        if (!date) return '';
        const d = new Date(date);
        return d.toISOString().split('T')[0];
    }

    function getDateRangeFromDuels(duels) {
        if (!duels || duels.length === 0) return { min: null, max: null };

        const dates = duels
            .map(d => d.gameTime ? new Date(d.gameTime) : null)
            .filter(d => d !== null)
            .sort((a, b) => a - b);

        if (dates.length === 0) return { min: null, max: null };

        return {
            min: formatDateForFilename(dates[0]),
            max: formatDateForFilename(dates[dates.length - 1])
        };
    }

    function addCustomStyles() {
        GM_addStyle(`.gga-exporter-container{color:#fff}
        .gga-exporter-init-button {position:fixed;bottom:20px;left:20px;background:#3498db;color:#fff;border:none;padding:10px 15px;border-radius:25px;cursor:pointer;z-index:9999;font-weight:700;box-shadow:0 2px 10px rgb(0 0 0 / .2);}
        .gga-exporter-close-button {cursor:pointer;margin-left:12px;}
        .gga-exporter-modal {position:fixed;top:20px;right:20px;width:50vw;min-width:500px;max-width:800px;max-height:90vh;background:#2c3e50;color:#fff;padding:20px;border-radius:10px;box-shadow:0 4px 20px rgb(0 0 0 / .3);z-index:1000;font-family:Arial,sans-serif;font-size:14px;overflow-y:auto;display:flex;flex-direction:column;}
        .gga-exporter-title{display:flex;align-items:center;color:rgba(255,255,255,.6);font-style:italic;font-weight:700;line-height:.75rem;font-size:.625rem;text-transform:uppercase;margin-bottom:1rem}
        .gga-exporter-title-bar{margin-left:1rem;background:hsla(0,0%,100%,.5);flex:1 1;height:.125rem;position:relative}
        .gga-exporter-form{display:flex;gap:1rem;align-items:center;margin-bottom:2rem;flex-wrap:wrap}
        .gga-exporter-form-group{display:flex;flex-direction:column;gap:0.25rem}
        .gga-exporter-form-group label{font-size:0.75rem;color:rgba(255,255,255,.7)}
        .gga-exporter-form input[type=number],
        .gga-exporter-form input[type=date]{background:0 0;color:#fff;border:0;border-radius:.5rem;box-shadow:inset 0 0 .0625rem 0 hsla(0,0%,100%,.9);padding:.75rem;font-size:.875rem}
        .gga-exporter-form input[type=number]{width:200px}
        .gga-exporter-form input[type=date]{width:150px}
        .gga-exporter-form button{border-radius:3.75rem;color:#fff;background:0 0;border:1px solid #fff;display:inline-block;padding:.5rem 1.5rem;cursor:pointer;font-size:.875rem}
        .gga-exporter-form button:hover:not(:disabled){color:#171235;background:#fff}
        .gga-exporter-form button:disabled{opacity:.5;cursor:not-allowed}
        .gga-exporter-stop-button{position:fixed!important;top:50%;left:50%;transform:translate(-50%,100px);z-index:10000;border-color:#ff4444!important;color:#ff4444!important;background:rgba(0,0,0,0.9)!important;padding:1rem 2rem!important;font-size:1rem!important;border-width:2px!important}
        .gga-exporter-stop-button:hover:not(:disabled){background:#ff4444!important;color:#fff!important}
        .gga-exporter-results{background:rgba(255,164,61,.1);border:1px solid #ffa43d;border-radius:.5rem;padding:1.5rem;margin-top:2rem}
        .gga-exporter-results h3{color:#ffa43d;margin-bottom:1rem;font-size:1.25rem}
        .gga-exporter-results p{margin-bottom:.5rem}
        .gga-exporter-export-button{margin-top:1rem;padding:.75rem 1.5rem;background:#ffa43d;color:#171235;border:none;border-radius:.5rem;cursor:pointer;font-weight:700;font-size:1rem}
        .gga-exporter-export-button:hover{background:#ff9020}
        .gga-exporter-preloader{position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,.9);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:9999;color:#fff}
        .gga-exporter-preloader-content{max-width:600px;max-height:400px;overflow-y:auto;padding:1rem;background:rgba(0,0,0,.5);border-radius:.5rem}
        .gga-exporter-progress{color:#ffa43d;font-size:1.25rem;margin-bottom:1rem}`);
    }

    function showPreloader(message = 'Loading...') {
        if (AppState.preloader) return;

        AppState.preloader = document.createElement('div');
        AppState.preloader.className = 'gga-exporter-preloader';
        AppState.preloader.innerHTML = `
            <div class="gga-exporter-preloader-content">
                <div class="gga-exporter-progress">${message}</div>
            </div>
        `;
        document.body.appendChild(AppState.preloader);
    }

    function updatePreloaderMessage(message) {
        if (AppState.preloader) {
            const progressDiv = AppState.preloader.querySelector('.gga-exporter-progress');
            if (progressDiv) {
                progressDiv.textContent = message;
            }
        }
    }

    function hidePreloader() {
        if (AppState.preloader) {
            AppState.preloader.remove();
            AppState.preloader = null;
        }
    }

    function extractGameIds(entry, gameIds) {
        if (entry.type === 6) {
            const payload = JSON.parse(entry.payload);
            if (payload.gameMode === AppState.gameMode) {
                gameIds.push({
                    id: payload.gameId,
                    time: entry.time
                });
            }
        } else if (entry.type === 7) {
            const payloadArray = JSON.parse(entry.payload);
            payloadArray.forEach(item => {
                if (item.type === 6 && item.payload) {
                    const gameData = item.payload;
                    if (gameData.gameMode === AppState.gameMode) {
                        gameIds.push({
                            id: gameData.gameId,
                            time: item.time
                        });
                    }
                }
            });
        }
    }

    async function fetchGamesSequentially(session, targetCount) {
        const duels = [];
        let paginationToken = null;
        let totalFetched = 0;
        const gameIds = [];

        try {
            showPreloader('Starting data fetch...');

            while (totalFetched < targetCount && !AppState.shouldStop) {
                updatePreloaderMessage(`Scanning activities... Found ${gameIds.length} total, fetched ${totalFetched} in range...`);

                const { result: feedResponse, duration: feedDuration } = await requester.request(async () => {
                    const params = paginationToken ? { paginationToken } : {};
                    return await session.get(CONFIG.FEED_API_URL, { params });
                });

                RequestLogger.log('FEED_API', CONFIG.FEED_API_URL, 'SUCCESS', feedDuration);

                const data = feedResponse.data;
                paginationToken = data.paginationToken;

                if (!AppState.playerId && data.entries.length > 0) {
                    AppState.playerId = data.entries[0].user.id;
                }

                const pageGameIds = [];
                data.entries.forEach(entry => {
                    try {
                        extractGameIds(entry, pageGameIds);
                    } catch (error) {
                        console.error('Error extracting game IDs:', error);
                    }
                });

                const filteredGameIds = pageGameIds.filter(gameInfo =>
                    isDateInRange(gameInfo.time, AppState.dateFrom, AppState.dateTo)
                );

                gameIds.push(...filteredGameIds);


                if (AppState.dateFrom && pageGameIds.length > 0) {
                    const newestGameInPage = new Date(pageGameIds[0].time);
                    newestGameInPage.setHours(0, 0, 0, 0);
                    if (newestGameInPage < AppState.dateFrom) {
                        console.log('All games are now older than date range, stopping pagination');
                        updatePreloaderMessage(`Reached end of date range. Found ${gameIds.length} eligible games, fetched ${totalFetched}...`);
                        paginationToken = null;
                    }
                }

                while (gameIds.length > 0 && totalFetched < targetCount && !AppState.shouldStop) {
                    const batch = gameIds.splice(0, Math.min(CONFIG.BATCH_SIZE, targetCount - totalFetched));

                    for (const gameInfo of batch) {
                        if (totalFetched >= targetCount || AppState.shouldStop) break;

                        try {
                            const { result: duelResponse, duration: duelDuration } = await requester.request(async () => {
                                return await session.get(`${CONFIG.API_BASE_URL}/${gameInfo.id}`);
                            });

                            RequestLogger.log('DUEL_API', `${CONFIG.API_BASE_URL}/${gameInfo.id}`, 'SUCCESS', duelDuration);

                            duels.push({
                                ...duelResponse.data,
                                gameTime: gameInfo.time
                            });
                            totalFetched++;

                            updatePreloaderMessage(`Fetched ${totalFetched}/${targetCount} games in date range...`);

                        } catch (error) {
                            console.error(`Failed to fetch duel ${gameInfo.id}:`, error);
                            RequestLogger.log('DUEL_API', `${CONFIG.API_BASE_URL}/${gameInfo.id}`, 'ERROR', error.duration || 0);
                        }
                    }
                }

                if (totalFetched >= targetCount || !paginationToken || AppState.shouldStop) {
                    break;
                }
            }

            if (AppState.shouldStop) {
                updatePreloaderMessage(`Stopped by user. Fetched ${duels.length} games.`);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            console.log(`Successfully fetched ${duels.length} games`);
            return duels;

        } catch (error) {
            console.error('Error in sequential fetching:', error);
            throw error;
        } finally {
            hidePreloader();
            AppState.shouldStop = false;
        }
    }

    function cleanupDuelData(duel) {
        delete duel.movementOptions;
        delete duel.mapBounds;

        if (duel.options) {
            delete duel.options.gameContext;
            delete duel.options.roundStartingBehavior;
            delete duel.options.flashbackRounds;
            delete duel.options.masterControlAutoStartRounds;
            delete duel.options.consumedLocationsIdentifier;
            delete duel.options.useCuratedLocations;
            delete duel.options.extraWaitTimeBetweenRounds;

            if (duel.options.individualInitialHealth === false) {
                delete duel.options.individualInitialHealth;
                delete duel.options.initialHealthTeamOne;
                delete duel.options.initialHealthTeamTwo;
            }
        }

        if (duel.result) {
            delete duel.result.winnerStyle;
        }

        if (duel.teams) {
            duel.teams.forEach(team => {
                if (team.players) {
                    team.players.forEach(player => {
                        if (player.progressChange) {
                            const rankedSystemProgress = player.progressChange.rankedSystemProgress;
                            player.progressChange = { rankedSystemProgress };

                            if (rankedSystemProgress) {
                                delete rankedSystemProgress.points;
                                delete rankedSystemProgress.totalWeeklyPoints;
                                delete rankedSystemProgress.weeklyCap;
                                delete rankedSystemProgress.gamesPlayedWithinWeeklyCap;
                            }
                        }
                    });
                }
            });
        }

        return duel;
    }

    function exportDuelsData(duels) {
        const dateRange = getDateRangeFromDuels(duels);

        const exportData = {
            version: "1.0",
            exportDate: new Date().toISOString(),
            playerId: AppState.playerId,
            totalGames: duels.length,
            dateRange: dateRange,
            duels: duels.map(cleanupDuelData)
        };

        const jsonData = JSON.stringify(exportData);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;

        const gameModePrefix = AppState.gameMode === 'TeamDuels' ? 'teamduels' : 'duels';
        let filename = `geoguessr_${gameModePrefix}_data`;
        if (dateRange.min && dateRange.max) {
            if (dateRange.min === dateRange.max) {
                filename += `_${dateRange.min}`;
            } else {
                filename += `_${dateRange.min}_to_${dateRange.max}`;
            }
        }
        filename += '.json';

        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function exportRequestLog() {
        const dateRange = getDateRangeFromDuels(AppState.currentDuels || []);

        const logData = {
            version: "1.0",
            exportDate: new Date().toISOString(),
            playerId: AppState.playerId,
            totalRequests: AppState.requestLog.length,
            dateRange: dateRange,
            requestLog: AppState.requestLog
        };

        const jsonData = JSON.stringify(logData, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;


        const gameModePrefix = AppState.gameMode === 'TeamDuels' ? 'teamduels' : 'duels';
        let filename = `geoguessr_${gameModePrefix}_log`;
        if (dateRange.min && dateRange.max) {
            if (dateRange.min === dateRange.max) {
                filename += `_${dateRange.min}`;
            } else {
                filename += `_${dateRange.min}_to_${dateRange.max}`;
            }
        }
        filename += '.json';

        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function exportMapMakerData(duels) {
        const customCoordinates = [];

        duels.forEach(duel => {
            if (duel.rounds) {
                duel.rounds.forEach(round => {
                    if (round.panorama && round.panorama.lat && round.panorama.lng) {
                        const gameMode = duel.options?.movementOptions?.forbidMoving ? 'NoMoveDuels' :
                        (duel.options?.movementOptions?.forbidZooming ? 'NmpzDuels' : 'Duels');

                        const date = duel.gameTime ?
                              new Date(duel.gameTime).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) :
                        'Unknown';

                        // Get country name from country code
                        const countryName = round.panorama.countryCode ? round.panorama.countryCode.toUpperCase() : 'Unknown';

                        customCoordinates.push({
                            heading: round.panorama.heading || 0,
                            countryCode: round.panorama.countryCode || "",
                            pitch: round.panorama.pitch || 2,
                            zoom: round.panorama.zoom || 0,
                            lat: round.panorama.lat,
                            lng: round.panorama.lng,
                            extra: {
                                tags: [
                                    `CTRY: ${countryName}`,
                                    `DATE: ${date}`,
                                    `MODE: ${gameMode}`
                                ]
                            }
                        });
                    }
                });
            }
        });

        const mapMakerData = {
            name: "Exported duels",
            customCoordinates: customCoordinates
        };

        const jsonData = JSON.stringify(mapMakerData, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;

        const dateRange = getDateRangeFromDuels(duels);
        const gameModePrefix = AppState.gameMode === 'TeamDuels' ? 'teamduels' : 'duels';
        let filename = `geoguessr_${gameModePrefix}_mapmaking`;
        if (dateRange.min && dateRange.max) {
            if (dateRange.min === dateRange.max) {
                filename += `_${dateRange.min}`;
            } else {
                filename += `_${dateRange.min}_to_${dateRange.max}`;
            }
        }
        filename += '.json';

        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function closeAE() {
        document.body.removeChild(AppState.mainContainer);
        AppState.mainContainer = null;
    };

    function createUI() {
        const ui = document.createElement('div');
        ui.id = 'activities-exporter-ui';
        ui.className = 'gga-exporter-modal';

        document.body.appendChild(ui);

        AppState.mainContainer = ui;

        const container = document.createElement('div');
        container.className = 'gga-exporter-container';

        const titleBlock = document.createElement('div');
        titleBlock.className = 'gga-exporter-title';
        const title = document.createElement('h4');
        title.textContent = 'Geoguessr Duels Activities Exporter';
        const bar = document.createElement('div');
        bar.className = 'gga-exporter-title-bar';
        const closeButton = document.createElement('div');
        closeButton.className = 'gga-exporter-close-button';
        closeButton.textContent = 'Close';
        closeButton.onclick = closeAE;

        titleBlock.appendChild(title);
        titleBlock.appendChild(bar);
        titleBlock.appendChild(closeButton);
        container.appendChild(titleBlock);

        const form = document.createElement('form');
        form.className = 'gga-exporter-form';
        const gamesGroup = document.createElement('div');
        gamesGroup.className = 'gga-exporter-form-group';
        const gamesLabel = document.createElement('label');
        gamesLabel.textContent = 'Max. number of duels';
        const gamesInput = document.createElement('input');
        Object.assign(gamesInput, {
            type: 'number',
            min: '1',
            max: '7200',
            placeholder: 'Max. number of duels',
            required: true,
            value: '3600'
        });
        gamesGroup.appendChild(gamesLabel);
        gamesGroup.appendChild(gamesInput);

        const gameModeGroup = document.createElement('div');
        gameModeGroup.className = 'gga-exporter-form-group';
        const gameModeLabel = document.createElement('label');
        gameModeLabel.textContent = 'Game mode';
        gameModeGroup.appendChild(gameModeLabel);

        const gameModeContainer = document.createElement('div');
        gameModeContainer.style.display = 'flex';
        gameModeContainer.style.gap = '1rem';

        const duelsRadio = document.createElement('input');
        duelsRadio.type = 'radio';
        duelsRadio.name = 'gameMode';
        duelsRadio.value = 'Duels';
        duelsRadio.id = 'radio-duels';
        duelsRadio.checked = true;

        const duelsLabel = document.createElement('label');
        duelsLabel.htmlFor = 'radio-duels';
        duelsLabel.textContent = 'Duels';
        duelsLabel.style.cursor = 'pointer';

        const teamDuelsRadio = document.createElement('input');
        teamDuelsRadio.type = 'radio';
        teamDuelsRadio.name = 'gameMode';
        teamDuelsRadio.value = 'TeamDuels';
        teamDuelsRadio.id = 'radio-teamduels';

        const teamDuelsLabel = document.createElement('label');
        teamDuelsLabel.htmlFor = 'radio-teamduels';
        teamDuelsLabel.textContent = 'Team Duels';
        teamDuelsLabel.style.cursor = 'pointer';

        gameModeContainer.append(duelsRadio, duelsLabel, teamDuelsRadio, teamDuelsLabel);
        gameModeGroup.appendChild(gameModeContainer);

        const dateFromGroup = document.createElement('div');
        dateFromGroup.className = 'gga-exporter-form-group';
        const dateFromLabel = document.createElement('label');
        dateFromLabel.textContent = 'From date';
        const dateFromInput = document.createElement('input');
        dateFromInput.type = 'date';
        dateFromGroup.appendChild(dateFromLabel);
        dateFromGroup.appendChild(dateFromInput);

        const dateToGroup = document.createElement('div');
        dateToGroup.className = 'gga-exporter-form-group';
        const dateToLabel = document.createElement('label');
        dateToLabel.textContent = 'To date';
        const dateToInput = document.createElement('input');
        dateToInput.type = 'date';
        dateToGroup.appendChild(dateToLabel);
        dateToGroup.appendChild(dateToInput);

        const fetchButton = document.createElement('button');
        fetchButton.textContent = 'Get Data';
        fetchButton.type = 'submit';

        form.append(gamesGroup, dateFromGroup, dateToGroup, gameModeGroup, fetchButton);
        container.appendChild(form);

        const resultsDiv = document.createElement('div');
        resultsDiv.className = 'gga-exporter-results';
        resultsDiv.style.display = 'none';
        container.appendChild(resultsDiv);

        AppState.mainContainer.appendChild(container);

        const stopButton = document.createElement('button');
        stopButton.textContent = 'Stop';
        stopButton.type = 'button';
        stopButton.className = 'gga-exporter-stop-button';
        stopButton.style.display = 'none';
        AppState.stopButton = stopButton;
        document.body.appendChild(stopButton);

        stopButton.addEventListener('click', function() {
            AppState.shouldStop = true;
            stopButton.disabled = true;
            stopButton.textContent = 'Stopping...';
            updatePreloaderMessage('Stopping fetch... Processing remaining requests...');
        });

        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            if (AppState.isLoading) return;

            AppState.numberOfGames = parseInt(gamesInput.value);
            AppState.dateFrom = parseDate(dateFromInput.value);
            AppState.dateTo = parseDate(dateToInput.value);
            AppState.gameMode = document.querySelector('input[name="gameMode"]:checked').value;
            AppState.shouldStop = false;
            AppState.requestLog = [];

            fetchButton.disabled = true;
            fetchButton.textContent = 'Fetching...';
            stopButton.style.display = 'block';
            stopButton.disabled = false;
            stopButton.textContent = 'Stop';

            try {
                const session = axios.create({
                    withCredentials: true,
                    timeout: 30000
                });

                console.time('loading_games');
                const duels = await fetchGamesSequentially(session, AppState.numberOfGames);
                console.timeEnd('loading_games');

                AppState.currentDuels = duels;

                const dateRange = getDateRangeFromDuels(duels);
                let dateRangeText = '';
                if (dateRange.min && dateRange.max) {
                    dateRangeText = dateRange.min === dateRange.max
                        ? `<p><strong>Date:</strong> ${dateRange.min}</p>`
                        : `<p><strong>Date range:</strong> ${dateRange.min} to ${dateRange.max}</p>`;
                }

                resultsDiv.innerHTML = `
                    <h3>Data Fetched Successfully!</h3>
                    <p><strong>Total duels fetched:</strong> ${duels.length}</p>
                    <p><strong>Player ID:</strong> ${AppState.playerId}</p>
                    ${dateRangeText}
                    <p><strong>Total requests made:</strong> ${AppState.requestLog.length}</p>
                `;

                const exportButton = document.createElement('button');
                exportButton.className = 'gga-exporter-export-button';
                exportButton.textContent = 'Download Duels Data JSON';
                exportButton.onclick = () => exportDuelsData(duels);
                resultsDiv.appendChild(exportButton);

                const mapMakerButton = document.createElement('button');
                mapMakerButton.className = 'gga-exporter-export-button';
                mapMakerButton.textContent = 'Download map-making.app JSON';
                mapMakerButton.style.marginLeft = '1rem';
                mapMakerButton.onclick = () => exportMapMakerData(duels);
                resultsDiv.appendChild(mapMakerButton);

                const logButton = document.createElement('button');
                logButton.className = 'gga-exporter-export-button';
                logButton.textContent = 'Log';
                logButton.style.marginLeft = '1rem';
                logButton.onclick = () => exportRequestLog();
                resultsDiv.appendChild(logButton);

                resultsDiv.style.display = 'block';

            } catch (error) {
                console.error('Error fetching data:', error);
                alert(`Error: ${error.message}`);
            } finally {
                fetchButton.disabled = false;
                fetchButton.textContent = 'Get data';
                stopButton.style.display = 'none';
            }
        });
    }

    function addTriggerButton() {
        const button = document.createElement('button');
        button.textContent = ' Duels Activities Exporter';
        button.className = 'gga-exporter-init-button';

        button.onclick = () => {
            createUI();
        };

        document.body.appendChild(button);
    }

    function init() {
        console.log('Initializing Geoguessr Duels Activities Exporter...');
        addCustomStyles();
        addTriggerButton();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(init, 1200));
    } else {
        setTimeout(init, 1200);
    }

})();