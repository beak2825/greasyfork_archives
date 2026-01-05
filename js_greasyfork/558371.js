// ==UserScript==
// @name         Geoguessr head-to-head unranked duel statistics
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Index unranked duels and display head-to-head statistics on user pages
// @author       Hawk
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @license      MIT
// @require      https://greasyfork.org/scripts/460322-geoguessr-styles-scan/code/Geoguessr%20Styles%20Scan.js?version=1408713
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/558371/Geoguessr%20head-to-head%20unranked%20duel%20statistics.user.js
// @updateURL https://update.greasyfork.org/scripts/558371/Geoguessr%20head-to-head%20unranked%20duel%20statistics.meta.js
// ==/UserScript==

// Modified Geoguessr head-to-head duel statistics as a base. Shout out to @irrational

const THE_INFINITE_PAST = new Date("2025-10-01");
const ECMASCRIPT_MIN_TIME = new Date(-8640000000000000); // https://262.ecma-international.org/15.0/#sec-time-values-and-time-range
const USERSCRIPT_DATA_BLOCK_CLASS = '__userscript_data_block';
const USERSCRIPT_DATA_ELEMENT_CLASS = '__userscript_data_element';
const USERSCRIPT_GAME_LIST_CLASS = '__userscript_game_list';
const USERSCRIPT_GAME_LIST_CLASS_INACTIVE = '__userscript_game_list_inactive';
const USERSCRIPT_UPDATE_NOTIFICATION_CLASS = '__userscript_update_notification';
const USERSCRIPT_CUSTOM_SPACER_CLASS = '__userscript_custom_spacer';
const RENEW_TIME_SECONDS = 3600;
const DUEL_DOWNLOAD_SPACING_SECONDS = 0.3;
const GAME_LIST_MAX_COUNT = 20;
const DATABASE_VERSION = 1;


const delay = async (ms) => new Promise(resolve => setTimeout(resolve, ms));


const fetchJSON = async (url, retryDelay = 10000) => {
    return fetch(url, {credentials: "include"})
    .then(async (response) => {
        if (response.status === 429) {
            await delay(retryDelay);
            return fetchJSON(url, retryDelay);
        }
        return response.ok ? response.json() : Promise.resolve(null);
    }, async (error) => {
        /* Because Geoguessr's 429s can (or regularly do?) not include correct CORS headers,
           we can end up here and have to just guess and hope that it's due to a 429. */
        await delay(retryDelay);
        return fetchJSON(url, retryDelay);
    });
};


const fetchFeed = async (userId, fromDate) => {
    const date = fromDate.toISOString();
    /* Pagination tokens are really a base64-encoded LastEvaluatedKey from Amazon DynamoDB,
       which contains the starting date of items on the next page. Conveniently, this allows
       us to query the feed from a starting date of our choosing. */
    const token = btoa(JSON.stringify({
        HashKey: {S: `${userId}_activity`},
        Created: {S: `${date}`}}));
    return fetchJSON(`https://www.geoguessr.com/api/v4/feed/private?paginationToken=${token}`);
};


const fetchDuel = async (duelId) => {
    return fetchJSON(`https://game-server.geoguessr.com/api/duels/${duelId}`);
};


const fetchUserId = async () => {
    return fetchJSON('https://www.geoguessr.com/api/v3/profiles')
           .then((json) => json.user.id);
};

const extractDuelData = (duel, userId) => {
    let winner, player, opponent;

    if (duel.result.isDraw) return null;

    for (const team of duel.teams) {
        if (team.id == duel.result.winningTeamId) {
            winner = team.players[0];
        }
        if (team.players.some(player => player.playerId == userId)) {
            if (team.players[0].playerId == userId) {
                player = team.players[0];
            } else {
                player = team.players[1];
            }
        } else {
            opponent = team.players[0];
        }
    }

    const scoreResult = {opponent: opponent.playerId, winner: winner.playerId};
    return {...scoreResult};
};


const processDuel = async (payload, time, userId) => {
    const duel = await fetchDuel(payload.gameId);
    if (duel) { /* For mysterious reasons, duels can go permanently missing from
                   Geoguessr's database. */
        const duelData = extractDuelData(duel, userId);
        if (duelData) {
            duelData.gameId = payload.gameId;
            duelData.time = new Date(time);
            duelData.gameMode = payload.competitiveGameMode;
            return duelData;
        }
    } else {
        console.log("Skipped irretrievable duel:", payload.gameId);
        return null;
    }
};


const downloadDuel = async (duels, payload, time, userId, db) => {
    const tx = db.transaction([`duels_${userId}`], 'readonly');
    const duelsStore = tx.objectStore(`duels_${userId}`);

    if (payload.gameMode == "Duels" && ! await hasKey(duelsStore, payload.gameId))
    {
        const startTime = new Date();
        const duelData = await processDuel(payload, time, userId);
        if (duelData) duels.push(duelData);
        /* Try to avoid rate limits. */
        await delay(1000*DUEL_DOWNLOAD_SPACING_SECONDS - (new Date() - startTime));
    }
};


const processFeed = async (feed, userId, db) => {
    let duels = {Duels: []};
    for (const entry of feed.entries) {
        const payload = JSON.parse(entry.payload);
        if (entry.type == 11 && (payload.gameMode !== "BattleRoyaleDistance" && payload.gameMode !== "BattleRoyaleCountries" && payload.gameMode !== "TeamDuels")) { // a single unranked duel
            await downloadDuel(duels[payload.gameMode], payload, entry.time, userId, db);
        }
        if (entry.type == 7) { // a list of duels
           const payload = JSON.parse(entry.payload);
           for (const game of payload) {
               if (game.type == 11) { // an unranked duel
                   await downloadDuel(duels[game.payload.gameMode], game.payload, game.time, userId, db);
                }
            }
        }
    }

    // On the last retrievable page of activity, the paginationToken is null.
    let toDate = THE_INFINITE_PAST;
    if (feed.paginationToken) {
        const token = JSON.parse(atob(feed.paginationToken));
        toDate = new Date(token.Created.S);
    }
    return {duels: duels.Duels, toDate: toDate};
};


const openDB = async (userId) => {
    const request = indexedDB.open('userscript_unranked_duels', DATABASE_VERSION);
    request.onupgradeneeded = (event) => {
        const db = event.target.result;
        const oldVersion = event.oldVersion;
        if (oldVersion <= 1) {
            const duelsStore = db.createObjectStore(`duels_${userId}`, {keyPath: 'gameId'});
            db.createObjectStore(`intervals_${userId}`, {keyPath: 'from'});
            duelsStore.createIndex('opponentIndex', 'opponent', {unique: false});
            duelsStore.createIndex('gameModeOpponentIndex', ['opponent', 'gameMode'], {unique: false});
            duelsStore.createIndex('timeOpponentIndex', ['opponent', 'time'], {unique: false});
            duelsStore.createIndex('timeGameModeOpponentIndex', ['opponent', 'gameMode', 'time'], {unique: false});
            duelsStore.createIndex('timeIndex', 'time', {unique: false});
            duelsStore.createIndex('timeGameModeIndex', ['gameMode', 'time'], {unique: false});
        }
    };
    return new Promise((resolve, reject) => {
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event);
    });
};


const hasKey = async (storeOrIndex, key) =>
    await fetchResult(storeOrIndex.count(key)) > 0;


const fetchResult = (request) => new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = (event) => reject(event);
});


const fetchDuels = async (userId, fromDate, toDate) => {
    const db = await openDB(userId);
    let currentFromDate = new Date(fromDate);
    while (true) {
        console.log("Fetching duels from", currentFromDate);
        currentFromDate =
            await fetchFeed(userId, currentFromDate)
            .then((feed) => processFeed(feed, userId, db))
            .then((feedData) => {
                const tx = db.transaction([`duels_${userId}`, `intervals_${userId}`], 'readwrite');
                const duelsStore = tx.objectStore(`duels_${userId}`);
                for (const duel of feedData.duels) duelsStore.put(duel);
                const intervalsStore = tx.objectStore(`intervals_${userId}`);
                intervalsStore.put({from: fromDate, to: feedData.toDate});
                return feedData.toDate;
            });
        console.log(currentFromDate);
        if (currentFromDate === THE_INFINITE_PAST || (toDate && currentFromDate <= toDate)) break;
    }
};


const findHistoryGaps = async (userId) => {
    const db = await openDB(userId);
    const tx = db.transaction([`intervals_${userId}`], 'readonly');
    const intervalsStore = tx.objectStore(`intervals_${userId}`);
    return new Promise(resolve => {
        let currentInterval = null;
        let gaps = [];
        let top = THE_INFINITE_PAST, bottom = THE_INFINITE_PAST;
        const cursorRequest = intervalsStore.openCursor(null, 'prev');
        cursorRequest.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                const interval = cursor.value;
                if (top === THE_INFINITE_PAST) top = interval.from;
                if (! currentInterval) currentInterval = interval;
                if (interval.from >= currentInterval.to) {
                    currentInterval.to =
                        interval.to === THE_INFINITE_PAST || currentInterval.to === THE_INFINITE_PAST ?
                        THE_INFINITE_PAST : new Date(Math.min(currentInterval.to, interval.to));
                } else {
                    gaps.push({from: currentInterval.to, to: interval.from});
                    currentInterval = interval;
                }
                bottom = interval.to;
                cursor.continue();
            } else {
                resolve([gaps, top, bottom]);
            }
        };
    });
};


const countDuels = async (userId) => {
    const db = await openDB(userId);
    const tx = db.transaction([`duels_${userId}`], 'readonly');
    return { duels: await fetchResult(tx.objectStore(`duels_${userId}`).count()) };
};


const updateInProgress = async () => {
    const locks = await navigator.locks.query();
    return locks.held.some(lock => lock.name == "userscript_unranked_duels_history_download");
};


const updateMessages = new BroadcastChannel("userscript_unranked_duels_history_messages");
// Receive messages on the same tab also
const updateMessageReceiver = new BroadcastChannel("userscript_unranked_duels_history_messages");
updateMessageReceiver.addEventListener('message', (event) => {
    handleUpdateNotification();
    if (event.data == "stop") {
        if (location.pathname.match(/^\/(..\/)?user\//)) runOnUserPage(true);
        else if (location.pathname.match(/^\/(..\/)?me\/profile$/)) runOnProfilePage(true);
    }
});


let updateTimeout = null;

const updateDatabase = async (userId, force_update = false) => {
    await navigator.locks.request("userscript_unranked_duels_history_download", async (lock) => {
        updateMessages.postMessage("start");

        console.log("Updating duels history database...");
        await findHistoryGaps(userId).then(async ([gaps, top, bottom]) => {
            const now = new Date();
            if (force_update || new Date(Date.now() - 1000 * RENEW_TIME_SECONDS) > top) {
                gaps.unshift({from: now, to: top});
                top = now;
            }
            if (top !== THE_INFINITE_PAST && bottom !== THE_INFINITE_PAST) {
                gaps.push({from: bottom, to: THE_INFINITE_PAST});
            }
            for (const gap of gaps) {
                console.log('Downloading duels history gap:', gap);
                await fetchDuels(userId, gap.from, gap.to);
            }
            const counts = await countDuels(userId);
            console.log(`Duels history update complete. ${counts.duels} solo duels in store.` );
            console.log('Next routine check at', new Date(top.getTime() + 1000 * RENEW_TIME_SECONDS));

            const nextCheck = top.getTime() + 1000 * RENEW_TIME_SECONDS - now.getTime();
            if (updateTimeout) clearTimeout(updateTimeout);
            updateTimeout = setTimeout(updateDatabase, nextCheck);
        });
    });

    updateMessages.postMessage("stop");
};


fetchUserId().then(userId => {
    updateDatabase(userId);
    GM_registerMenuCommand("Update duels history now", () => { updateDatabase(userId, true); });
});


const fetchStats = async (userId, opponents, partner = null) => {
    const db = await openDB(userId);
    const tx = db.transaction([`${partner ? "team" : ""}duels_${userId}`], 'readonly');
    const duelsStore = tx.objectStore(`${partner ? "team" : ""}duels_${userId}`);
    const opponentIndex = duelsStore.index('opponentIndex');

    const opponentId = partner ? opponents[0] : opponents;
    const request = opponentIndex.getAll(opponentId);
    const duels = await fetchResult(request);

    let count = 0, wins = 0
    let modeCount = {StandardDuels: 0, NoMoveDuels: 0, NmpzDuels: 0};
    let modeWins = {StandardDuels: 0, NoMoveDuels: 0, NmpzDuels: 0};
    for (const duel of duels) {
        if (partner && duel.partner != partner) continue;
        if (partner && ! opponents.every((opponent) => duel.opponents.includes(opponent))) continue;

        count += 1;
        wins += (partner ? duel.winners.includes(opponentId) : duel.winner == opponentId) ? 0 : 1;
        modeCount[duel.gameMode] += 1;
        modeWins[duel.gameMode] += (partner ? duel.winners.includes(opponentId) : duel.winner == opponentId) ? 0 : 1;
    }
    let stats = {overall: {wins: wins, count: count}};
    for (const mode of ['StandardDuels', 'NoMoveDuels', 'NmpzDuels']) {
        stats[mode] = {wins: modeWins[mode], count: modeCount[mode]};
    }
    return stats;
};

const fetchDuelList = async (userId, opponents, gameMode = 'overall', partner = null) => {
    const db = await openDB(userId);
    const tx = db.transaction(`duels_${userId}`, 'readonly');
    const duelsStore = tx.objectStore(`duels_${userId}`);
    const index = gameMode == 'overall' ? duelsStore.index('timeOpponentIndex') :
                                          duelsStore.index('timeGameModeOpponentIndex');

    const opponentId = opponents[0];
    const constantBound = gameMode == 'overall' ? [opponentId] : [opponentId, gameMode];
    const lowerBound = constantBound.concat(ECMASCRIPT_MIN_TIME);
    const upperBound = constantBound.concat(new Date());
    const keyRange = IDBKeyRange.bound(lowerBound, upperBound);

    return new Promise(resolve => {
        const games = [];
        const cursorRequest = index.openCursor(keyRange, 'prev');
        cursorRequest.onsuccess = (event) => {
            const cursor = event.target.result;
            if (games.length < GAME_LIST_MAX_COUNT && cursor) {
                if (! partner ||
                    (opponents.every(opponent => cursor.value.opponents.includes(opponent)) &&
                     cursor.value.partner == partner))
                {
                    games.push(cursor.value);
                }
                cursor.continue();
            } else {
                resolve(games);
            }
        };
    });
};


const fetchDuelsByAllModes = async (userId, opponents, partner = null) => {
    const [allGames, movingGames, noMoveGames, nmpzGames] = await Promise.all([
        fetchDuelList(userId, opponents, 'overall', partner),
        fetchDuelList(userId, opponents, 'StandardDuels', partner),
        fetchDuelList(userId, opponents, 'NoMoveDuels', partner),
        fetchDuelList(userId, opponents, 'NmpzDuels', partner)]);
    return {overall: allGames,
            StandardDuels: movingGames,
            NoMoveDuels: noMoveGames,
            NmpzDuels: nmpzGames};
};


const formatGameMode = (gameMode) => {
    switch (gameMode) {
        case 'StandardDuels': return 'Unranked Moving';
        case 'NoMoveDuels': return 'Unranked No Move';
        case 'NmpzDuels': return 'Unranked NMPZ';
    }
};


const formatTeam = (occludedId, teamData) =>
    `${flag(teamData.ccs[0])}${flag(teamData.ccs[1])} ${teamData.name} ` +
    `(with ${teamData.ids[0] == occludedId ? teamData.nicks[1] : teamData.nicks[0]})`;


const flag = (cc) =>
    cc.toUpperCase() == "ZZ" ? "\u{1F1FA}\u{1F1F3}" // UN flag
                             : String.fromCodePoint(...cc.toUpperCase().split('')
                                                         .map(char => 127397 + char.charCodeAt()));


const signedNumber = (n) => `${n > 0 ? "+" : ""}${n}`;


const makeDataDiv = (label, grey_label = true) => {
    const div = document.createElement('unranked_div');
    div.style = '--direction: column; --gap: 4; --justify: center; --align: flex-start';
    div.className = `${cn('flex_flex__')} ${cn('flex_direction__')} ${cn('flex_gap__')}
                     ${cn('flex_justify__')} ${cn('flex_align__')} ${USERSCRIPT_DATA_ELEMENT_CLASS}`;

    const labelElement = document.createElement('unranked_label');
    labelElement.className = `${cn('label_label__')}
                              ${grey_label ? cn('shared_white60Variant__') : cn('shared_orange50Variant__')}
                              ${cn('shared_boldWeight__')} ${cn('label_italic__')} ${cn('label_uppercase__')}`;
    labelElement.style = "--fs: var(--font-size-9); --lh: var(--line-height-9)";
    labelElement.innerHTML = label;

    const valueElements = Array.from([0, 1], _ => document.createElement('unranked_label'));
    valueElements.map(el => el.classList.add(cn('label_label__'), cn('shared_boldWeight__'),
                                             cn('label_italic__'), cn('label_uppercase__')));
    valueElements[0].style = "--fs: var(--font-size-16); --lh: var(--line-height-16)";
    valueElements[1].style = "--fs: var(--font-size-12); --lh: var(--line-height-12)";

    div.append(labelElement, ...valueElements);
    return [div, ...valueElements];
};


const makeDataBlockDiv = () => {
    const dataBlockDiv = document.createElement('unranked_div');
    dataBlockDiv.className = `${cn('daily-challenge-streak_root__')} ${USERSCRIPT_DATA_BLOCK_CLASS}`;
    dataBlockDiv.style.transform = 'none'; // disable the inherited zoom animation on hover
    const valueDivs = {score: {}, balance: {}};
    const gamesDivs = {};

    let overallDiv;
    [overallDiv, valueDivs.score.overall, valueDivs.balance.overall] = makeDataDiv('Score', false);
    gamesDivs.overall = makeGamesDiv('overall');
    overallDiv.append(gamesDivs.overall);
    dataBlockDiv.append(overallDiv);
    for (const gameMode of ['StandardDuels', 'NoMoveDuels', 'NmpzDuels']) {
        [overallDiv, valueDivs.score[gameMode], valueDivs.balance[gameMode]] = makeDataDiv(formatGameMode(gameMode));
        gamesDivs[gameMode] = makeGamesDiv(gameMode);
        overallDiv.append(gamesDivs[gameMode]);
        dataBlockDiv.append(overallDiv);
    }

    return [dataBlockDiv, valueDivs, gamesDivs];
};


const fillDataBlock = (valueDivs, stats) => {
    for (const gameMode of ['overall', 'StandardDuels', 'NoMoveDuels', 'NmpzDuels']) {
        valueDivs.score[gameMode].innerHTML = `${stats[gameMode].wins}&ndash;${stats[gameMode].count - stats[gameMode].wins}`;
    }
};


const makeGamesDiv = (gameMode) => {
    const div = document.createElement('div');
    div.className = `${cn('multiplayer_ratingBox__')} ${USERSCRIPT_GAME_LIST_CLASS_INACTIVE}`;
    div.style.padding = '0.5rem';
    div.style.position = 'absolute';
    div.style.zIndex = 99; // remain above the data block element but below modal overlays
    return div;
};


const fillGames = (div, gameMode, games, opponentId, isGameMode = false) => {
    div.innerHTML = `<p style="margin-bottom: 1ex">
        Most recent games ${isGameMode && games.length > 0 ?
                            '(' + formatGameMode(games[0].gameMode) + ')' : ''}</p>`;

    let tableHTML = "<table>";
    for (const game of games) {
        const lost = 'winner' in game ? game.winner == opponentId :
                                        game.winners.includes(opponentId);
        tableHTML +=
            `<tr>
               <td style="text-align: right">
                 <a style="font-weight: 700" href="https://www.geoguessr.com/duels/${game.gameId}/summary">
                   ${game.time.toLocaleString()}</a></td>
               ${isGameMode ? "" : `<td style="text-align: center">(${formatGameMode(game.gameMode)})</td>`}
               <td style="text-align: center">
                 ${lost ? '<span style="color: #e94560">lost</span>' :
                          '<span style="color: #6cb928">won</span>'}</td>
               <td style="text-align: left">
             </tr>`;
    }
    tableHTML += "</table>";
    div.innerHTML += tableHTML;
};


const fillGamesDivs = (gamesDivs, games, opponentId) => {
    const hasGames = Object.fromEntries(Object.entries(games).map(([k, v]) => [k, v.length > 0]));
    for (const gameMode of ['overall', 'StandardDuels', 'NoMoveDuels', 'NmpzDuels']) {
        if (hasGames[gameMode]) {
            gamesDivs[gameMode].classList.remove(USERSCRIPT_GAME_LIST_CLASS_INACTIVE);
            gamesDivs[gameMode].classList.add(USERSCRIPT_GAME_LIST_CLASS);
            fillGames(gamesDivs[gameMode],
                      gameMode, games[gameMode], opponentId, gameMode != 'overall');
        } else {
            gamesDivs[gameMode].classList.remove(USERSCRIPT_GAME_LIST_CLASS);
            gamesDivs[gameMode].classList.add(USERSCRIPT_GAME_LIST_CLASS_INACTIVE);
        }
    }
};

let lastOpponentId = null;

const runOnUserPage = async (forceRun = false) => {
    let opponentId = location.pathname.split('/').pop();
    const insertHookElement = document.querySelector("." + cn('friend-status_section__'));
    if (! insertHookElement) return;

    navigator.locks.request("userscript_unranked_duels_history", async (lock) => {
        const dataBlock = document.querySelector("." + USERSCRIPT_DATA_BLOCK_CLASS);
        if (! forceRun && opponentId == lastOpponentId && dataBlock) return;
        lastOpponentId = opponentId;

        if (dataBlock) dataBlock.remove();
        [...document.querySelectorAll("." + USERSCRIPT_CUSTOM_SPACER_CLASS)].map(el => el.remove());

        const userId = await fetchUserId();

        insertHookElement.insertAdjacentHTML(
            "beforebegin",
            `<style>
              .${USERSCRIPT_GAME_LIST_CLASS_INACTIVE}, .${USERSCRIPT_GAME_LIST_CLASS} { display: none }
              .${USERSCRIPT_DATA_ELEMENT_CLASS}:hover .${USERSCRIPT_GAME_LIST_CLASS} { display: block }
             </style>`);

        // Singleplayer stats
        const stats = await fetchStats(userId, opponentId);
        const games = await fetchDuelsByAllModes(userId, opponentId);

        insertHookElement.insertAdjacentElement("beforebegin", makeSpacer(16));
        const [dataBlockDiv, valueDivs, gamesDivs] = makeDataBlockDiv();
        insertHookElement.insertAdjacentElement("beforebegin", dataBlockDiv);
        fillDataBlock(valueDivs, stats);
        fillGamesDivs(gamesDivs, games, opponentId);
        insertHookElement.insertAdjacentElement("beforebegin", makeSpacer(16));
    });
};


const makeSpacer = (height) => {
    const spacer = document.createElement('unranked_div');
    spacer.className = `${cn('spacer_space__')} ${cn('spacer_height__')} ${USERSCRIPT_CUSTOM_SPACER_CLASS}`;
    spacer.style = `--height: ${height}`;
    return spacer;
};


const makeSectionHeader = (title) => {
    const header = document.createElement('unranked_div');
    header.innerHTML =
        `<div class="${cn('section_sectionHeader___')} ${cn('section_sizeSmall__')}
                     ${cn('section_variantLight__')}">
           <div class="${cn('bars_root__')} ${cn('bars_variantLight__')}">
             <span class="${cn('bars_content__')}"><h4>${title}</h4></span>
             <div class="${cn('bars_after__')}"></div></div></div>`;
    return header;
};


const makeButton = (label) => {
    const button = document.createElement('button');
    button.type = "button";
    button.innerHTML = label;
    button.className = `${cn('button_button__')} ${cn('button_variantSecondary__')}`;
    button.style = "margin: 1rem";
    return button;
};


const createDownload = async (userId) => {
    const db = await openDB();
    const storeNames = ["duels"];
    const tx = db.transaction(storeNames.map(name => `${name}_${userId}`));
    const data = { version: DATABASE_VERSION, stores: {} };
    for (const storeName of storeNames) {
        const objStore = tx.objectStore(`${storeName}_${userId}`);
        const json = await fetchResult(objStore.getAll());
        data.stores[storeName] = json;
    }
    const blob = new Blob([JSON.stringify(data)], { type: 'application/octet-stream'});
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(blob);
    anchor.download = `geoguessr_duels_history_${new Date().getTime()}.json`;
    anchor.click();
};


const importDuels = async (userId, databaseStatus) => {
    const filePicker = document.createElement('unranked_input');
    filePicker.type = 'file';
    filePicker.addEventListener('change', (event) => {
        let reader = new FileReader();
        reader.addEventListener('load', async () => {
            try {
                const json = JSON.parse(reader.result);
                const db = await openDB();
                const storeNames = ["duels"];
                const tx = db.transaction(storeNames.map(name => `${name}_${userId}`), 'readwrite');
                const data = {};
                for (const storeName of storeNames) {
                    const store = tx.objectStore(`${storeName}_${userId}`);
                    for (const entry of json.stores[storeName]) {
                        entry.time = new Date(entry.time);
                        store.put(entry);
                    }
                }
                databaseStatus.innerHTML = "<b>Import complete.</b><br>";
            } catch (err) {
                databaseStatus.innerHTML = "<b>Import failed. Is this really a duels history export file?</b><br>";
                console.error("Duels history import error:", err);
            }
            const counts = await countDuels(userId);
            databaseStatus.innerHTML += `Solo duels: ${counts.duels}`;
        });
        reader.readAsText(event.target.files[0]);
    });
    filePicker.click();
};


const makeDatabaseStatus = async (userId) => {
    const div = document.createElement('unranked_div');
    div.style.display = "inline-block";
    div.style.margin = "1rem";
    div.style.textAlign = "left";
    div.style.verticalAlign = "middle";
    const contents = await countDuels(userId);
    div.innerHTML = `<b>Duels in database</b><br>
                     Solo duels: ${contents.duels}</p>`;
    return div;
};


let lastProfileHook = null;

const runOnProfilePage = async (forceRun = false) => {
    const hookElement = document.querySelector("." + cn('profile-v2_staticWidgets__'));
    if (! hookElement) return;

    navigator.locks.request("userscript_unranked_duels_history_database_download", async (lock) => {
        if (! forceRun && lastProfileHook == hookElement) return;
        lastProfileHook = hookElement;

        const userId = await fetchUserId();
        const statusDiv = await makeDatabaseStatus(userId);
        const spacer1 = makeSpacer(64);
        hookElement.insertAdjacentElement("afterend", spacer1);
        const header = makeSectionHeader("Duels history database");
        spacer1.insertAdjacentElement("afterend", header);
        const container = document.createElement('unranked_div');
        const downloadButton = makeButton("Export database");
        downloadButton.addEventListener('click', () => createDownload(userId));
        container.append(downloadButton);
        const importButton = makeButton("Import duels into database");
        importButton.addEventListener('click', () => importDuels(userId, statusDiv));
        container.append(importButton);
        container.append(statusDiv);
        const spacer2 = makeSpacer(64);
        container.append(spacer2);
        header.insertAdjacentElement("afterend", container);
    });
};


let lastHeaderHook = null;

const handleUpdateNotification = async () => {
    const headerSection = document.querySelector("." + cn('header-desktop_desktopSectionRight__'));
    if (! headerSection) return;

    const updating = await updateInProgress();
    const updateNotification = document.querySelector("." + USERSCRIPT_UPDATE_NOTIFICATION_CLASS);
    if (Boolean(updateNotification) === updating) return;
    if (updateNotification && ! updating) {
        updateNotification.remove();
        return;
    }
    navigator.locks.request("userscript_unranked_duels_history_download_notification", async (lock) => {
        if (updating && headerSection == lastHeaderHook) return;
        lastHeaderHook = headerSection;

        headerSection.insertAdjacentHTML(
            "afterbegin",
            `<div class="${USERSCRIPT_UPDATE_NOTIFICATION_CLASS}">` +
            "Updating unranked duels history... \u23F3</div>"); // hourglass with flowing sand
    });
};


const run = async (mutations) => {
    scanStyles().then(_ => {
        handleUpdateNotification();
        if (location.pathname.match(/^\/(..\/)?user\//)) runOnUserPage();
        else if (location.pathname.match(/^\/(..\/)?me\/profile$/)) runOnProfilePage();
    });
};
new MutationObserver(run).observe(document.body, { subtree: true, childList: true });
run();