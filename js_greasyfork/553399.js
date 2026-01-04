// ==UserScript==
// @name         Geoguessr rating graph
// @namespace    http://tampermonkey.net/
// @version      0.5.1
// @description  Use head-to-head duel statistics data to display a rating graph
// @author       irrational
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @license      MIT
// @require      https://greasyfork.org/scripts/460322-geoguessr-styles-scan/code/Geoguessr%20Styles%20Scan.js?version=1408713
// @require      https://cdn.jsdelivr.net/npm/chart.js@4.5.1
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553399/Geoguessr%20rating%20graph.user.js
// @updateURL https://update.greasyfork.org/scripts/553399/Geoguessr%20rating%20graph.meta.js
// ==/UserScript==


const DATABASE_MIN_VERSION = 5;
const DATABASE_MIN_TEAM_DUELS_VERSION = 6;
const DUELS_STATISTICS_URL = 'https://greasyfork.org/en/scripts/550251-geoguessr-head-to-head-duel-statistics';
const USERSCRIPT_GRAPH_CANVAS_CLASS = "__userscript_graph_canvas";
const USERSCRIPT_GRAPH_CANVAS_SPACER_CLASS = "__userscript_graph_canvas_spacer";
const ZOOM_HALF_WINDOW = 24 * 3600 * 1000;
const DETAILED_TICKS_THRESHOLD = 5 * 86400 * 1000;


const openDB = async (userId) => {
    const request = indexedDB.open('userscript_duels');
    return new Promise((resolve, reject) => {
        request.onsuccess = (event) => {
            const db = event.target.result;
            db.version >= DATABASE_MIN_VERSION ? resolve(db) : reject();
        };
        request.onerror = (event) => reject();
    });
};


const fetchUserId = () => {
    return fetch('https://www.geoguessr.com/api/v3/profiles')
           .then(response => response.json())
           .then(json => json.user.id);
};


const fetchTeam = (members) => {
    return fetch('https://www.geoguessr.com/api/v4/ranked-team-duels/teams?' +
                 members.map(member => `userId=${member}`).join('&'))
    .then(resp => resp.status == 200 ? resp.json() : null,
          resp => null)
    .then(async json => {
        if (json) {
            return `${json.teamName} ${json.members.map(member => flag(member.countryCode)).join('')}`;
        } else {
            /* Team is no longer on the leaderboard; we have to build our own record. */
            const nicks = [], flags = [];
            for (const member of members) {
                const user = await fetch('https://www.geoguessr.com/api/v3/users/' + member)
                                   .then(resp => resp.status == 200 ? resp.json() : null,
                                         resp => null);
                nicks.push(user.nick);
                flags.push(flag(user ? user.countryCode : "zz"));
            }
            return nicks.map(nick => nick.substring(0, 3)).join('/') + ' ' + flags.join('');
        }
    });
};


const flag = (cc) =>
    cc.toUpperCase() == "ZZ" ? "🇺🇳"
                             : String.fromCodePoint(...cc.toUpperCase().split('')
                                                         .map(char => 127397 + char.charCodeAt()));


const fetchUser = (userId) => {
    return fetch('https://www.geoguessr.com/api/v3/users/' + userId)
           .then(response => response.json())
           .then(user => `${user.nick} ${flag(user.countryCode)}`, () => 'Anonymous ' + flag('zz'));
};


const getGames = (db, userId, timeFrom, timeTo, gameMode = null, partner = null,
                  reverse = false, maxGames = null) =>
{
    return new Promise(resolve => {
        const tx = db.transaction(`${partner ? 'team' : ''}duels_${userId}`, 'readonly');
        const duelsStore = tx.objectStore(`${partner ? 'team' : ''}duels_${userId}`);

        let index, keyRange;
        if (! partner) {
            if (gameMode) {
                index = duelsStore.index('timeGameModeIndex');
                keyRange = IDBKeyRange.bound([gameMode, timeFrom], [gameMode, timeTo]);
            } else {
                index = duelsStore.index('timeIndex');
                keyRange = IDBKeyRange.bound(timeFrom, timeTo);
            }
        } else {
            index = duelsStore.index('timePartnerIndex');
            keyRange = IDBKeyRange.bound([partner, timeFrom], [partner, timeTo]);
        }
        const games = [];
        const cursorRequest = index.openCursor(keyRange, reverse ? 'prev' : 'next');
        let lastGameId = null;
        cursorRequest.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                // Team duels are in the database twice, once for each opponent
                if (! (partner && cursor.value.gameId == lastGameId)) games.push(cursor.value);
                lastGameId = cursor.value.gameId;
                if (! maxGames || games.length < maxGames) {
                    cursor.continue();
                } else {
                    resolve(games);
                }
            } else {
                resolve(games);
            }
        };
    });
};


const collectGamesFrom = async (db, userId, daysAgo = null, partner = null) => {
    let fromDate;
    if (daysAgo) {
        fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - daysAgo);
    } else {
        // https://262.ecma-international.org/15.0/#sec-time-values-and-time-range
        fromDate = new Date(-8640000000000000);
    }
    const games = { overall: await getGames(db, userId, fromDate, new Date(), null, partner) };
    for (const mode of ['StandardDuels', 'NoMoveDuels', 'NmpzDuels']) {
        games[mode] = partner ? [] : await getGames(db, userId, fromDate, new Date(), mode);
    }
    return games;
};


const extremalGameDate = async (db, userId, getLatest = false, partner = null) => {
    const extremalGame = await getGames(db, userId, new Date(-8640000000000000), new Date(),
                                      null, partner, getLatest, 1);
    return extremalGame.length > 0 ? extremalGame[0].time : null;
};


const makeSpacer = (height) => {
    const spacer = document.createElement('div');
    spacer.className = `${cn('spacer_space__')} ${cn('spacer_height__')}`;
    spacer.style = `--height: ${height}`;
    return spacer;
};


const modeToLabel = mode => {
    switch (mode) {
        case 'overall': return 'Overall';
        case 'StandardDuels': return 'Moving';
        case 'NoMoveDuels': return 'No Move';
        case 'NmpzDuels': return 'NMPZ';
    }
};


const makeChart = (canvas, games, days) => {
    const font = { family: '"ggFont", sans-serif', size: 12 };
    const color = 'rgba(255, 255, 255, 0.6)';

    const datasets = [];
    for (const mode of ['overall', 'StandardDuels', 'NoMoveDuels', 'NmpzDuels']) {
        const datapoints = [];
        let lastEloAfter = null;
        let lastTime = null;
        for (const game of games[mode]) {
            const gameTime = game.time.getTime();

            if (lastEloAfter && (mode == 'overall' ? game.ourEloBefore : game.ourModeEloBefore) != lastEloAfter) {
                // Plot rating gaps (refunds, missing games, or rating system glitches) as separate datapoints
                datapoints.push({ x: (lastTime + gameTime) / 2,
                                  y: mode == 'overall' ? game.ourEloBefore : game.ourModeEloBefore,
                                  eloDifference: mode == 'overall' ? game.ourEloBefore - lastEloAfter
                                                                   : game.ourModeEloBefore - lastEloAfter,
                                  gameId: null, gameMode: mode, opponentId: null, opponents: null });
            }

            datapoints.push({ x: gameTime,
                              y: mode == 'overall' ? game.ourEloAfter : game.ourModeEloAfter,
                              eloDifference: mode == 'overall' ? game.ourEloAfter - game.ourEloBefore
                                                               : game.ourModeEloAfter - game.ourModeEloBefore,
                              gameId: game.gameId,
                              gameMode: mode,
                              opponentId: game.opponent,
                              opponents: game.opponents ? game.opponents : null });

            lastEloAfter = mode == 'overall' ? game.ourEloAfter : game.ourModeEloAfter;
            lastTime = gameTime;
        }
        if (datapoints.length > 0) datasets.push({ label: modeToLabel(mode), data: datapoints });
    }

    let footerText = null;
    let lastDatapointOnHover = null;
    const opponents = {};
    const chart = new Chart(canvas, {
        /* Date adapters don't work in userscripts, so we work with timestamps instead and convert
           to dates for display */
        type: 'line',
        data: { datasets: datasets },
        options: {
            stepped: 'middle',
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    ticks: { callback: (value) => chart.scales.x.max - chart.scales.x.min <= DETAILED_TICKS_THRESHOLD
                                                      ? new Date(value).toLocaleString()
                                                      : new Date(value).toLocaleDateString(),
                             font: font, color: color, minRotation: 15, maxRotation: 15 },
                    grid: { color: color }
                },
                y: {
                    grid: { color: color },
                    ticks: { font: font, color: color },
                }
            },
            onClick: (event, elements) => {
                if (elements.length > 0) {
                    const el = elements[0];
                    const gameId = chart.data.datasets[el.datasetIndex].data[el.index].gameId;
                    if (gameId) location.pathname = `/duels/${gameId}/summary`;
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        title: (context) => {
                            return new Date(context[0].parsed.x).toLocaleString();
                        },
                        footer: (context) => {
                            /* This function can't return a promise and so can't be async but fetching opponent data is async.
                               We must work around that: */
                            const updateFooter = async (context) => {
                                const data = context[0].raw;
                                if (lastDatapointOnHover == `${data.gameId}-${data.gameMode}`) return;
                                lastDatapointOnHover = `${data.gameId}-${data.gameMode}`;

                                let opponentText = null;
                                if (data.opponents) {
                                    const opponentIds = data.opponents.join(',');
                                    opponentText = opponentIds in opponents ? opponents[opponentIds]
                                                                            : await fetchTeam(data.opponents);
                                    opponents[opponentIds] = opponentText;
                                } else if (data.opponentId) {
                                    opponentText = data.opponentId in opponents ? opponents[data.opponentId]
                                                                                : await fetchUser(data.opponentId);
                                    opponents[data.opponentId] = opponentText;
                                }

                                const eloType = (data.gameMode == 'overall' ? '' : modeToLabel(data.gameMode) + ' ') + 'Elo';
                                footerText = `${data.eloDifference > 0 ? '+' : ''}${data.eloDifference} ${eloType}`;
                                if (opponentText) {
                                    footerText += ` against ${opponentText}`;
                                } else {
                                    footerText += "\n(rating gap: refund, missing games, or rating system glitch)";
                                }

                                chart.update();
                            };
                            updateFooter(context);
                            return footerText;
                        }
                    }
                },
                legend: {
                    labels: { font: font, color: color }
                },
                title: {
                    display: true,
                    text: days ? `Rating (past ${days} days)` : 'Rating (all time)',
                    font: {...font, size: 16 },
                    color: 'white'
                }
            }
        }
    });

    canvas.addEventListener('auxclick', (event) => {
        if (event.button != 1) return;

        const elements = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true });
        if (elements.length > 0) {
            const el = elements[0];
            const gameId = chart.data.datasets[el.datasetIndex].data[el.index].gameId;
            if (gameId) {
                const anchor = document.createElement('a');
                anchor.href = `/duels/${gameId}/summary`;
                anchor.target = "_blank";
                anchor.click();
                anchor.remove();
            }
        }
    });

    canvas.addEventListener('dblclick', (event) => {
        const scale = chart.options.scales.x;
        if (! (scale.min && scale.max)) {
            const canvasPosition = Chart.helpers.getRelativePosition(event, chart);
            const middleX = chart.scales.x.getValueForPixel(canvasPosition.x);
            scale.min = middleX - ZOOM_HALF_WINDOW;
            scale.max = middleX + ZOOM_HALF_WINDOW;
        } else {
            scale.min = null;
            scale.max = null;
        }
        chart.update();
    });

    let debounceTimeout = null;
    canvas.addEventListener('wheel', (event) => {
        // Touchpads can fire many wheel events in a row; only handle those at least 10 ms apart
        if (! debounceTimeout) {
            debounceTimeout = setTimeout(() => {
                const canvasPosition = Chart.helpers.getRelativePosition(event, chart);
                const scrollX = chart.scales.x.getValueForPixel(canvasPosition.x);
                const scale = chart.options.scales.x;
                const minX = chart.scales.x.min;
                const maxX = chart.scales.x.max;
                const factor = event.deltaY < 0 ? 0.2 : -0.25; // 0.8 * 1.25 = 1
                scale.min = minX + factor * (scrollX - minX);
                scale.max = maxX - factor * (maxX - scrollX);
                chart.update();
                debounceTimeout = null;
            }, 10);
        }
        event.preventDefault();
    });

    let dragging = false;
    let dragStartX = null;
    canvas.addEventListener('mousedown', (event) => {
        dragging = true;
        const canvasPosition = Chart.helpers.getRelativePosition(event, chart);
        dragStartX = chart.scales.x.getValueForPixel(canvasPosition.x);
    });
    canvas.addEventListener('mousemove', (event) => {
        const scale = chart.options.scales.x;
        if (! dragging || ! (scale.min && scale.max)) return;

        const canvasPosition = Chart.helpers.getRelativePosition(event, chart);
        const deltaX = chart.scales.x.getValueForPixel(canvasPosition.x) - dragStartX;

        scale.min -= deltaX;
        scale.max -= deltaX;
        dragStartX += deltaX;
        chart.update();
    });
    canvas.addEventListener('mouseup', (event) => { dragging = false; });
    canvas.addEventListener('mouseleave', (event) => { dragging = false; });
};


const makeButton = (isTeam) => {
    const buttonDiv = document.createElement('div');
    buttonDiv.className = cn('game-history-button_gameHistoryButton__');
    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add(cn('button_button__'),
                         isTeam ? cn('button_variantTertiary__')
                                : cn('button_variantDimmed__'),
                         cn('button_sizeSmall__'));
    const buttonWrapper = document.createElement('div');
    buttonWrapper.className = cn('button_wrapper__');
    const buttonLabel = document.createElement('span');
    buttonLabel.innerHTML = `${isTeam ? 'Team r' : 'R'}ating graph`;
    buttonDiv.append(button);
    button.append(buttonWrapper);
    buttonWrapper.append(buttonLabel);
    return button;
};


const makeRangeSelect = (earliest, latest) => {
    const select = document.createElement('select');
    select.className = cn('text-input_textInput__');
    select.style.width = "4rem";
    select.style.padding = "6px";
    select.style.fontSize = "12px";
    select.style.background = "transparent";
    const now = new Date();
    const selectDays = [30, 60, 90, 120, 180, 366];
    for (let idx = 0; idx < selectDays.length; ++idx) {
        if (new Date().setDate(now.getDate() - selectDays[idx]) > latest) continue;
        const option = document.createElement('option');
        option.value = selectDays[idx];
        option.innerHTML = `${selectDays[idx]} days`;
        select.append(option);
        if (idx < selectDays.length - 1 &&
            new Date().setDate(now.getDate() - selectDays[idx + 1]) < earliest) break;
    }
    select.innerHTML += '<option value="0">All time</option>';
    return select;
};


const showError = (script_min_version, spacer) => {
    const errorMessage = document.createElement('div');
    errorMessage.innerHTML = 'Can\'t display rating graph: duels database version doesn\'t match.<br>' +
        `You need to be running <a href="${DUELS_STATISTICS_URL}">Head-to-head duels statistics</a>` +
        `version ${script_min_version} or higher.`;
    spacer.insertAdjacentElement('afterend', errorMessage);
};


const removeGraph = () => {
    document.querySelector(`.${USERSCRIPT_GRAPH_CANVAS_CLASS}`)?.remove();
    document.querySelector(`.${USERSCRIPT_GRAPH_CANVAS_SPACER_CLASS}`)?.remove();
};


let graphPage = null;
let lastPage = null;
let graphButton = null;

const runOnProfilePage = async (partner = null) => {
    // some styles are loaded later
    if ((! partner) && ! cn('profile-v2_buttons__')) return;
    if (partner && ! cn('friend-status_actions__')) return;

    navigator.locks.request("userscript_duels_graph", async (lock) => {
        let buttonContainer = null;
        if (! partner) buttonContainer = document.querySelector(`.${cn('profile-v2_buttons__')}`);
        else buttonContainer = document.querySelector(`.${cn('friend-status_actions__')}`);
        if (! buttonContainer) return;

        if (lastPage == location.pathname) return;
        lastPage = location.pathname;

        if (graphButton) {
            graphButton.nextElementSibling.remove();
            graphButton.remove();
            graphButton = null;
        }
        removeGraph();

        openDB().then(async (db) => {
            if (partner && db.version < DATABASE_MIN_TEAM_DUELS_VERSION) return;

            const userId = await fetchUserId();
            const latest = await extremalGameDate(db, userId, true, partner);
            if (! latest) return; // There are no games to graph
            const earliest = await extremalGameDate(db, userId, false, partner);

            graphButton = makeButton(partner != null);
            buttonContainer.insertAdjacentElement('afterbegin', graphButton);
            const graphSelect = makeRangeSelect(earliest, latest);
            graphButton.insertAdjacentElement('afterend', graphSelect);
            if (partner) {
                buttonContainer.style.gap = '0.5rem 1rem';
                graphSelect.insertAdjacentHTML('afterend', '<div style="flex-basis: 100%; height: 0"></div>');
            }

            graphButton.addEventListener('click', (event) => {
                if (graphPage == location.pathname) removeGraph();
                graphPage = location.pathname;

                const profileHeader = document.querySelector(`.${cn('profile-v2_header__')}`);
                const spacer = makeSpacer(32);
                spacer.className = USERSCRIPT_GRAPH_CANVAS_SPACER_CLASS;
                profileHeader.insertAdjacentElement('afterend', spacer);

                openDB().then(async (db) => {
                    const days = graphSelect.value > 0 ? graphSelect.value : null;
                    const canvasContainer = document.createElement('div');
                    canvasContainer.style.position = 'relative';
                    canvasContainer.className = USERSCRIPT_GRAPH_CANVAS_CLASS;
                    const canvas = document.createElement('canvas');
                    canvasContainer.append(canvas);

                    const refreshButton = document.createElement('div');
                    refreshButton.innerHTML = '\u21bb'; // clockwise open circle arrow
                    Object.assign(refreshButton.style, {
                        position: 'absolute',
                        top: '1vh',
                        right: '1vh',
                        cursor: 'pointer',
                        fontSize: 'large' });
                    refreshButton.addEventListener('click', () => updateMessages.postMessage("refresh"));
                    canvasContainer.append(refreshButton);

                    const userId = await fetchUserId();
                    const games = await collectGamesFrom(db, userId, days, partner);
                    makeChart(canvas, games, days);
                    spacer.insertAdjacentElement('afterend', canvasContainer);
                }, () => showError('0.4.2', spacer));
            });
        });
    });
};


const updateMessages = new BroadcastChannel("userscript_duels_history_messages");
updateMessages.onmessage = (event) => {
    if (event.data == "stop" &&
        document.querySelector(`.${USERSCRIPT_GRAPH_CANVAS_CLASS}`))
    {
        graphButton.click();
    }
};


const run = async (mutations) => {
    if (location.pathname.match(/^\/(..\/)?me\/profile$/)) {
        scanStyles().then(runOnProfilePage);
    } else if (location.pathname.match(/^\/(..\/)?user/)) {
        const partner = location.pathname.split('/').pop();
        scanStyles().then(runOnProfilePage(partner));
    } else {
        graphPage = null;
        lastPage = null;
    }
};
new MutationObserver(run).observe(document.body, { subtree: true, childList: true });
run();