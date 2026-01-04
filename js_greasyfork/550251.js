// ==UserScript==
// @name         Geoguessr head-to-head duel statistics
// @namespace    http://tampermonkey.net/
// @version      0.5.0
// @description  Index competitive duels and display head-to-head statistics on user pages
// @author       irrational
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @license      MIT
// @require      https://greasyfork.org/scripts/460322-geoguessr-styles-scan/code/Geoguessr%20Styles%20Scan.js?version=1408713
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/550251/Geoguessr%20head-to-head%20duel%20statistics.user.js
// @updateURL https://update.greasyfork.org/scripts/550251/Geoguessr%20head-to-head%20duel%20statistics.meta.js
// ==/UserScript==


const THE_INFINITE_PAST = null;
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
const DATABASE_VERSION = 7;


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


const fetchTeam = async (userId, members) => {
    const mapTeamToReturnValues = (team) => { return {
        name: team.teamName,
        ids: team.members.map(member => member.userId),
        nicks: team.members.map(member => member.nick),
        ccs: team.members.map(member => member.countryCode)}; };

    return fetchJSON('https://www.geoguessr.com/api/v4/ranked-team-duels/teams?' +
                     members.map(member => `userId=${member}`).join('&')).then(async json => {
        if (json) {
            /* This is a currently ranked team, so we got a response. */
            return mapTeamToReturnValues(json);
        } else if (members.includes(userId)) {
            /* This endpoint is the most reliable if available, it returns data even for inactive teams. Unfortunately,
               it is quite slow as it can respond with about a megabyte of data, most of which we don't care about.
               So we only use it if we must. */
            const partner = members[0] == userId ? members[1] : members[0];
            return fetchJSON('https://www.geoguessr.com/api/v4/ranked-team-duels/me/teams/' + partner).then( json => {
                return mapTeamToReturnValues(json.team);
            });
        } else {
            /* Team not including us is no longer on the leaderboard; we have to build our own record. */
            const team = { ids: members, nicks: [], ccs: [] };
            for (const member of members) {
                const user = await fetchJSON('https://www.geoguessr.com/api/v3/users/' + member);
                if (user) {
                    team.nicks.push(user.nick);
                    team.ccs.push(user.countryCode);
                } else {
                    /* Likely a deleted account */
                    team.nicks.push("Anonymous");
                    team.ccs.push("zz");
                }
            }
            team.name = team.nicks.map(nick => nick.substring(0, 3)).join('/');
            return team;
        }
    });
};


const extractDuelData = (duel, userId) => {
    let winner, player, opponent, winners, partner, opponents;

    if (duel.result.isDraw) return null;

    const isTeamDuel = duel.teams[0].players.length > 1;

    for (const team of duel.teams) {
        if (team.id == duel.result.winningTeamId) {
            winner = team.players[0];
            winners = team.players;
        }
        if (team.players.some(player => player.playerId == userId)) {
            if (team.players[0].playerId == userId) {
                player = team.players[0];
                if (isTeamDuel) partner = team.players[1];
            } else {
                player = team.players[1];
                partner = team.players[0];
            }
        } else {
            opponent = team.players[0];
            opponents = team.players;
        }
    }

    /* Sometimes the rating system fails after a duel, in which case progressChange is null. */
    const playerProgress = isTeamDuel ? player.progressChange?.rankedTeamDuelsProgress :
                                        player.progressChange?.rankedSystemProgress;
    const opponentProgress = isTeamDuel ? opponent.progressChange?.rankedTeamDuelsProgress :
                                          opponent.progressChange?.rankedSystemProgress;
    const scoreResult = isTeamDuel ? {partner: partner.playerId,
                                      opponents: opponents.map(player => player.playerId),
                                      winners: winners.map(player => player.playerId)}
                                   : {opponent: opponent.playerId, winner: winner.playerId};
    const overallRatingResult = {
        ourEloBefore: playerProgress?.ratingBefore,
        theirEloBefore: opponentProgress?.ratingBefore,
        ourEloAfter: playerProgress?.ratingAfter,
        theirEloAfter: opponentProgress?.ratingAfter };
    const gameModeRatingResult = isTeamDuel ? {} : {
        ourModeEloBefore: playerProgress?.gameModeRatingBefore,
        theirModeEloBefore: opponentProgress?.gameModeRatingBefore,
        ourModeEloAfter: playerProgress?.gameModeRatingAfter,
        theirModeEloAfter: opponentProgress?.gameModeRatingAfter };
    return {...scoreResult, ...overallRatingResult, ...gameModeRatingResult};
};


const extractRoundData = (duel, userId) => {
    if (duel.result.isDraw) return null;
    if (duel.teams[0].players.length > 1) return null;

    const weAreTeam0 = duel.teams[0].players.some(player => player.playerId == userId);
    const us = weAreTeam0 ? duel.teams[0].players[0] : duel.teams[1].players[0];
    const them = weAreTeam0 ? duel.teams[1].players[0] : duel.teams[0].players[0];

    let rounds = [];
    for (let round = 0; round < duel.currentRoundNumber; ++round) {
        const duelRound = duel.rounds[round];
        const ourGuess = us.guesses[round];
        const theirGuess = them.guesses[round];
        const roundData = {
            roundNumber: duelRound.roundNumber,
            panorama: duelRound.panorama,
            startTime: new Date(duelRound.startTime),
            timerStartTime: new Date(duelRound.timerStartTime),
            endTime: new Date(duelRound.endTime),
            multiplier: duelRound.multiplier,
            ourGuess: ourGuess ? {
                lat: ourGuess.lat,
                lng: ourGuess.lng,
                guessTime: new Date(ourGuess.created),
                distance: ourGuess.distance,
                score: ourGuess.score
            } : null,
            theirGuess: theirGuess ? {
                lat: theirGuess.lat,
                lng: theirGuess.lng,
                guessTime: new Date(theirGuess.created),
                distance: theirGuess.distance,
                score: theirGuess.score
            } : null,
        };
        rounds.push(roundData);
    }
    return rounds;
};


const processDuel = async (payload, time, userId) => {
    const duel = await fetchDuel(payload.gameId);
    if (duel) { /* For mysterious reasons, duels can go permanently missing from
                   Geoguessr's database. */
        const duelData = extractDuelData(duel, userId);
        const roundData = extractRoundData(duel, userId);
        let rounds = null;
        if (duelData) {
            duelData.gameId = payload.gameId;
            duelData.time = new Date(time);
            duelData.gameMode = payload.competitiveGameMode;
        }
        if (roundData) {
            rounds = {
                gameId: payload.gameId,
                time: new Date(time),
                gameMode: payload.competitiveGameMode,
                rounds: roundData
            }
        }
        return { duelData: duelData, roundData: rounds };
    } else {
        console.log("Skipped irretrievable duel:", payload.gameId);
        return null;
    }
};


const downloadDuel = async (duels, rounds, payload, time, userId, db) => {
    const tx = db.transaction([`duels_${userId}`, `teamduels_${userId}`], 'readonly');
    const duelsStore = tx.objectStore(`duels_${userId}`);
    const teamDuelsStore = tx.objectStore(`teamduels_${userId}`);
    const gameIdIndex = teamDuelsStore.index('gameIdIndex');

    if ((payload.gameMode == "TeamDuels" && ! await hasKey(gameIdIndex, payload.gameId)) ||
        (payload.gameMode == "Duels" && ! await hasKey(duelsStore, payload.gameId)))
    {
        const startTime = new Date();
        const data = await processDuel(payload, time, userId);
        if (data.duelData) duels.push(data.duelData);
        if (data.roundData) rounds.push(data.roundData);
        /* Try to avoid rate limits. */
        await delay(1000*DUEL_DOWNLOAD_SPACING_SECONDS - (new Date() - startTime));
    }
};


const processFeed = async (feed, userId, db) => {
    let duels = {Duels: [], TeamDuels: []};
    let rounds = [];

    for (const entry of feed.entries) {
        if (entry.type == 7) { // a list of (team) duels
            const payload = JSON.parse(entry.payload);
            for (const game of payload) {
                if (game.type == 6) { // a competitive duel or team duel
                    await downloadDuel(duels[game.payload.gameMode], rounds,
                                       game.payload, game.time, userId, db);
                }
            }
        } else if (entry.type == 6) { // a single (team) duel
            const payload = JSON.parse(entry.payload);
            await downloadDuel(duels[payload.gameMode], rounds,
                               payload, entry.time, userId, db);
        }
    }

    // On the last retrievable page of activity, the paginationToken is null.
    let toDate = THE_INFINITE_PAST;
    if (feed.paginationToken) {
        const token = JSON.parse(atob(feed.paginationToken));
        toDate = new Date(token.Created.S);
    }
    return {duels: duels.Duels, teamDuels: duels.TeamDuels, rounds: rounds, toDate: toDate};
};


const openDB = async (userId) => {
    const request = indexedDB.open('userscript_duels', DATABASE_VERSION);
    request.onupgradeneeded = (event) => {
        const db = event.target.result;
        const oldVersion = event.oldVersion;
        if (oldVersion < 1) {
            const duelsStore = db.createObjectStore('duels', {keyPath: 'gameId'});
            duelsStore.createIndex('opponentIndex', 'opponent', {unique: false});
            duelsStore.createIndex('gameModeOpponentIndex', ['opponent', 'gameMode'], {unique: false});
            db.createObjectStore('intervals', {keyPath: 'from'});
        }
        if (oldVersion < 2) {
            db.deleteObjectStore('intervals');
            db.createObjectStore('intervals', {keyPath: 'from'});
        }
        if (oldVersion < 3) {
            const duelsStore = event.target.transaction.objectStore('duels');
            duelsStore.createIndex('timeOpponentIndex', ['opponent', 'time'], {unique: false});
            duelsStore.createIndex('timeGameModeOpponentIndex', ['opponent', 'gameMode', 'time'], {unique: false});
        }
        if (oldVersion < 4) {
            const duelsStore = event.target.transaction.objectStore('duels');
            duelsStore.name = `duels_${userId}`;
            const intervalsStore = event.target.transaction.objectStore('intervals');
            intervalsStore.name = `intervals_${userId}`;
            const teamDuelsStore = db.createObjectStore(`teamduels_${userId}`, {keyPath: ['gameId', 'opponent']});
            teamDuelsStore.createIndex('gameIdIndex', 'gameId', {unique: false});
            teamDuelsStore.createIndex('opponentIndex', 'opponent', {unique: false});
            teamDuelsStore.createIndex('timeOpponentIndex', ['opponent', 'time'], {unique: false});
            teamDuelsStore.createIndex('timeGameModeOpponentIndex', ['opponent', 'gameMode', 'time'], {unique: false});
            event.target.transaction.objectStore(`intervals_${userId}`).clear();
        }
        if (oldVersion < 5) {
            // indexes for other userscripts that use the database
            const duelsStore = event.target.transaction.objectStore(`duels_${userId}`);
            duelsStore.createIndex('timeIndex', 'time', {unique: false});
            duelsStore.createIndex('timeGameModeIndex', ['gameMode', 'time'], {unique: false});
            const teamDuelsStore = event.target.transaction.objectStore(`teamduels_${userId}`);
            teamDuelsStore.createIndex('timeIndex', 'time', {unique: false});
            teamDuelsStore.createIndex('timeGameModeIndex', ['gameMode', 'time'], {unique: false});
        }
        if (oldVersion < 6) {
            // more indexes for other userscripts to use
            const teamDuelsStore = event.target.transaction.objectStore(`teamduels_${userId}`);
            teamDuelsStore.createIndex('timePartnerIndex', ['partner', 'time'], {unique: false});
            teamDuelsStore.createIndex('timeGameModePartnerIndex', ['partner', 'gameMode', 'time'], {unique: false});
        }
        if (oldVersion < 7) {
            const roundDataStore = db.createObjectStore(`rounds_${userId}`, {keyPath: 'gameId'});
            roundDataStore.createIndex('timeIndex', ['time']);
            roundDataStore.createIndex('timeGameModeIndex', ['gameMode', 'time']);
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
                const tx = db.transaction([`duels_${userId}`, `teamduels_${userId}`, `rounds_${userId}`, `intervals_${userId}`], 'readwrite');
                const duelsStore = tx.objectStore(`duels_${userId}`);
                const roundsStore = tx.objectStore(`rounds_${userId}`);
                const teamDuelsStore = tx.objectStore(`teamduels_${userId}`);
                for (const duel of feedData.duels) duelsStore.put(duel);
                for (const duel of feedData.rounds) roundsStore.put(duel);
                for (const teamDuel of feedData.teamDuels) {
                    /* A multiEntry index won't do because these don't work with a
                       composite index that includes a time key at the end. So we
                       add records for each opponent separately and index by opponent. */
                    for (const opponent of teamDuel.opponents) {
                        teamDuelsStore.put({opponent: opponent, ...teamDuel});
                    }
                }
                const intervalsStore = tx.objectStore(`intervals_${userId}`);
                intervalsStore.put({from: fromDate, to: feedData.toDate});
                return feedData.toDate;
            });
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
    const tx = db.transaction([`duels_${userId}`, `teamduels_${userId}`, `rounds_${userId}`], 'readonly');
    return { duels: await fetchResult(tx.objectStore(`duels_${userId}`).count()),
             teamDuels: await fetchResult(tx.objectStore(`teamduels_${userId}`).count()) / 2,
             rounds: await fetchResult(tx.objectStore(`rounds_${userId}`).count()) };
};


const updateInProgress = async () => {
    const locks = await navigator.locks.query();
    return locks.held.some(lock => lock.name == "userscript_duels_history_download");
};


const updateMessages = new BroadcastChannel("userscript_duels_history_messages");
// Receive messages on the same tab also
const updateMessageReceiver = new BroadcastChannel("userscript_duels_history_messages");
updateMessageReceiver.addEventListener('message', (event) => {
    handleUpdateNotification();
    if (event.data == "stop") {
        if (location.pathname.match(/^\/(..\/)?user\//)) runOnUserPage(true);
        else if (location.pathname.match(/^\/(..\/)?me\/profile$/)) runOnProfilePage(true);
    } else if (event.data == "refresh") {
        // Allow other userscripts to trigger a database update
        updateDatabase(true);
    }
});


let updateTimeout = null;

const updateDatabase = async (force_update = false) => {
    await navigator.locks.request("userscript_duels_history_download", async (lock) => {
        updateMessages.postMessage("start");

        console.log("Updating duels history database...");
        const userId = await fetchUserId();
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
            console.log(`Duels history update complete. ${counts.duels} solo duels and ${counts.teamDuels} team duels in store.` );
            console.log('Next routine check at', new Date(top.getTime() + 1000 * RENEW_TIME_SECONDS));

            const nextCheck = top.getTime() + 1000 * RENEW_TIME_SECONDS - now.getTime();
            if (updateTimeout) clearTimeout(updateTimeout);
            updateTimeout = setTimeout(updateDatabase, nextCheck);
        });
    });

    updateMessages.postMessage("stop");
};


updateDatabase();
GM_registerMenuCommand("Update duels history now", () => updateDatabase(true));


const fillInRoundData = async (userId) => {
    await navigator.locks.request("userscript_duels_history_download", async (lock) => {
        console.log('Filling in round data...');
        updateMessages.postMessage("start");
        const db = await openDB(userId);
        const tx = db.transaction([`duels_${userId}`], 'readonly');
        const duelsStore = tx.objectStore(`duels_${userId}`);
        const duels = await fetchResult(duelsStore.index('timeIndex').getAll());
        const missingRounds = [];
        for (const duel of duels) {
            const tx = db.transaction([`rounds_${userId}`], 'readonly');
            const alreadyHaveRounds = await hasKey(tx.objectStore(`rounds_${userId}`),
                                                   duel.gameId);
            if (! alreadyHaveRounds) {
                missingRounds.push({gameId: duel.gameId,
                                    time: duel.time,
                                    gameMode: duel.gameMode});
            }
        }
        let counter = 0;
        for (const duel of missingRounds) {
            const startTime = new Date();
            const duelData = await fetchDuel(duel.gameId);
            const roundData = extractRoundData(duelData, userId);
            if (roundData) {
                const writeTx = db.transaction([`rounds_${userId}`], 'readwrite');
                const rounds = {
                    gameId: duel.gameId,
                    time: duel.time,
                    gameMode: duel.gameMode,
                    rounds: roundData
                };
                writeTx.objectStore(`rounds_${userId}`).put(rounds);
            }
            counter += 1;
            if (counter % 20 == 0) console.log(`Filled in rounds for ${counter} of ${missingRounds.length} duels.`);
            await delay(1000*DUEL_DOWNLOAD_SPACING_SECONDS - (new Date() - startTime));
        }
        console.log('Finished filling in round data.');
        updateMessages.postMessage("stop");
    });
}


const fetchStats = async (userId, opponents, partner = null) => {
    const db = await openDB(userId);
    const tx = db.transaction([`${partner ? "team" : ""}duels_${userId}`], 'readonly');
    const duelsStore = tx.objectStore(`${partner ? "team" : ""}duels_${userId}`);
    const opponentIndex = duelsStore.index('opponentIndex');

    const opponentId = partner ? opponents[0] : opponents;
    const request = opponentIndex.getAll(opponentId);
    const duels = await fetchResult(request);

    let count = 0, wins = 0, eloBalance = 0;
    let modeCount = {StandardDuels: 0, NoMoveDuels: 0, NmpzDuels: 0};
    let modeWins = {StandardDuels: 0, NoMoveDuels: 0, NmpzDuels: 0};
    let modeEloBalance = {StandardDuels: 0, NoMoveDuels: 0, NmpzDuels: 0};
    for (const duel of duels) {
        if (partner && duel.partner != partner) continue;
        if (partner && ! opponents.every((opponent) => duel.opponents.includes(opponent))) continue;

        count += 1;
        wins += (partner ? duel.winners.includes(opponentId) : duel.winner == opponentId) ? 0 : 1;
        eloBalance += (duel.ourEloAfter && duel.ourEloBefore) ? duel.ourEloAfter - duel.ourEloBefore : 0;
        modeCount[duel.gameMode] += 1;
        modeWins[duel.gameMode] += (partner ? duel.winners.includes(opponentId) : duel.winner == opponentId) ? 0 : 1;
        if (! partner) {
            modeEloBalance[duel.gameMode] +=
                (duel.ourModeEloAfter && duel.ourModeEloBefore) ? duel.ourModeEloAfter - duel.ourModeEloBefore : 0;
        }
    }
    let stats = {overall: {wins: wins, count: count, eloBalance: eloBalance}};
    for (const mode of ['StandardDuels', 'NoMoveDuels', 'NmpzDuels']) {
        stats[mode] = {wins: modeWins[mode], count: modeCount[mode]};
        if (! partner) stats[mode].eloBalance = modeEloBalance[mode];
    }
    return stats;
};


const fetchOpponentTeams = async (userId, opponentId) => {
    const db = await openDB(userId);
    const tx = db.transaction([`teamduels_${userId}`], 'readonly');
    const duelsStore = tx.objectStore(`teamduels_${userId}`);
    const index = duelsStore.index('opponentIndex');
    const games = await fetchResult(index.getAll(opponentId));

    const partners = new Set();
    for (const game of games) {
        for (const opponent of game.opponents) {
            if (opponent != opponentId) partners.add(opponent);
        }
    }
    return Array.from(partners.values().map(partner => [opponentId, partner]));
};


const fetchOwnTeams = async (userId, opponentTeam) => {
    const db = await openDB(userId);
    const tx = db.transaction([`teamduels_${userId}`], 'readonly');
    const duelsStore = tx.objectStore(`teamduels_${userId}`);
    const index = duelsStore.index('opponentIndex');
    const games = await fetchResult(index.getAll(opponentTeam[0]));

    const partners = new Set();
    for (const game of games) {
        for (const opponent of game.opponents) {
            if (opponent == opponentTeam[1]) partners.add(game.partner);
        }
    }
    return Array.from(partners.values().map(partner => [userId, partner]));
};


const fetchDuelList = async (userId, opponents, gameMode = 'overall', partner = null) => {
    const db = await openDB(userId);
    const tx = db.transaction(`${partner ? "team" : ""}duels_${userId}`, 'readonly');
    const duelsStore = tx.objectStore(`${partner ? "team" : ""}duels_${userId}`);
    const index = gameMode == 'overall' ? duelsStore.index('timeOpponentIndex') :
                                          duelsStore.index('timeGameModeOpponentIndex');

    const opponentId = partner ? opponents[0] : opponents;
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
        case 'StandardDuels': return 'Moving';
        case 'NoMoveDuels': return 'No Move';
        case 'NmpzDuels': return 'NMPZ';
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


const makeDataDiv = (label, greyLabel = true, reloadButton = false) => {
    const div = document.createElement('div');
    div.style = '--direction: column; --gap: 4; --justify: center; --align: flex-start';
    div.className = `${cn('flex_flex__')} ${cn('flex_direction__')} ${cn('flex_gap__')}
                     ${cn('flex_justify__')} ${cn('flex_align__')} ${USERSCRIPT_DATA_ELEMENT_CLASS}`;

    const labelElement = document.createElement('label');
    labelElement.className = `${cn('label_label__')}
                              ${greyLabel ? cn('shared_white60Variant__') : cn('shared_orange50Variant__')}
                              ${cn('shared_boldWeight__')} ${cn('label_italic__')} ${cn('label_uppercase__')}`;
    labelElement.style = "--fs: var(--font-size-9); --lh: var(--line-height-9)";
    labelElement.innerHTML = label;

    if (reloadButton) {
        const reloadElement = document.createElement('span');
        reloadElement.style.marginLeft = '1ex';
        reloadElement.style.cursor = 'pointer';
        reloadElement.style.color = '#fff';
        reloadElement.innerHTML = '\u21bb'; // clockwise open circle arrow
        reloadElement.addEventListener('click', () => updateDatabase(true));
        labelElement.append(reloadElement);
    }

    const valueElements = Array.from([0, 1], _ => document.createElement('label'));
    valueElements.map(el => el.classList.add(cn('label_label__'), cn('shared_boldWeight__'),
                                             cn('label_italic__'), cn('label_uppercase__')));
    valueElements[0].style = "--fs: var(--font-size-16); --lh: var(--line-height-16)";
    valueElements[1].style = "--fs: var(--font-size-12); --lh: var(--line-height-12)";

    div.append(labelElement, ...valueElements);
    return [div, ...valueElements];
};


const makeDataBlockDiv = (reloadButton = false) => {
    const dataBlockDiv = document.createElement('div');
    dataBlockDiv.className = `${cn('daily-challenge-streak_root__')} ${USERSCRIPT_DATA_BLOCK_CLASS}`;
    dataBlockDiv.style.transform = 'none'; // disable the inherited zoom animation on hover
    const valueDivs = {score: {}, balance: {}};
    const gamesDivs = {};

    let overallDiv;
    [overallDiv, valueDivs.score.overall, valueDivs.balance.overall] = makeDataDiv('Score', false, reloadButton);
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
        const element = valueDivs.balance[gameMode];
        if ('eloBalance' in stats[gameMode]) {
            element.innerHTML = `${signedNumber(stats[gameMode].eloBalance)} Elo`;
        } else {
            element.innerHTML = "&mdash;";
        }
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
    div.innerHTML = '';
    const headerTable = document.createElement('table');
    headerTable.style.width = '100%';
    const headerTableRow = document.createElement('tr');

    const heading = document.createElement('td');
    heading.innerHTML = `Most recent games ${isGameMode && games.length > 0 ?
        '(' + formatGameMode(games[0].gameMode) + ')' : ''}`;
    heading.style.fontWeight = 'bold';
    headerTableRow.append(heading);

    const reloadElement = document.createElement('td');
    reloadElement.style.textAlign = 'right';
    reloadElement.style.cursor = 'pointer';
    reloadElement.innerHTML = '\u21bb'; // clockwise open circle arrow
    reloadElement.addEventListener('click', () => { updateDatabase(true) });
    headerTableRow.append(reloadElement);
    headerTable.append(headerTableRow);
    div.append(headerTable);

    const gamesTable = document.createElement('table');
    let tableHTML = "";
    for (const game of games) {
        const lost = 'winner' in game ? game.winner == opponentId :
                                        game.winners.includes(opponentId);
        // Team duels don't have a mode rating
        let eloBalance = isGameMode && game.ourModeEloAfter ? game.ourModeEloAfter - game.ourModeEloBefore
                                                            : game.ourEloAfter - game.ourEloBefore;
        // Handle missing rating changes in duel files (duels missing progressChange)
        eloBalance = isNaN(eloBalance) ? 0 : eloBalance;
        tableHTML +=
            `<tr>
               <td style="text-align: right">
                 <a style="font-weight: bold" href="https://www.geoguessr.com/duels/${game.gameId}/summary">
                   ${game.time.toLocaleString()}</a></td>
               ${isGameMode ? "" : `<td style="text-align: center">(${formatGameMode(game.gameMode)})</td>`}
               <td style="text-align: center">
                 ${lost ? '<span style="color: #e94560">lost</span>' :
                          '<span style="color: #6cb928">won</span>'}</td>
               <td style="text-align: left">
                 ${eloBalance > 0 ? "+" : ""}${eloBalance} Elo</td>
             </tr>`;
    }
    gamesTable.innerHTML = tableHTML;
    div.append(gamesTable);
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


const makeTeamsSelect = async (userId, occludedId, teams, listener, soloOption = true) => {
    const select = document.createElement('select');
    select.className = cn('text-input_textInput__');
    select.style.width = "2.5rem";
    select.style.padding = "4px";
    select.style.fontSize = "12px";
    select.style.background = "transparent";
    let teamsHTML = soloOption ? `<option value="solo">Solo</option>` : "";
    const teamsData = await Promise.all(teams.map(team => fetchTeam(userId, team)));
    for (const teamData of teamsData) {
        teamsHTML += `<option value="${teamData.ids.join(',')}">
                        ${formatTeam(occludedId, teamData)}
                      </option>`;
    }
    select.innerHTML = teamsHTML;
    select.addEventListener('change', listener);
    return select;
};


const makeTeamsSelectHandler = (ourTeamsDiv, ourTeamsValue, ourTeamsDummy,
                                userId, opponentId, valueDivs, gamesDivs,
                                soloStats, soloGames) =>
{
    return async (event) => {
        // Selected opponent team
        const value = event.target.value;
        ourTeamsValue.innerHTML = "...";
        ourTeamsDummy.innerHTML = "\u200b"; // zero width space
        if (value != "solo") {
            ourTeamsDiv.style.display = "flex";
            const opponentIds = value.split(',');
            const ourTeams = await fetchOwnTeams(userId, opponentIds);
            const ourTeamsSelect = await makeTeamsSelect(userId, userId, ourTeams, async (event) => {
                // Selected own team
                const partner = event.target.value.split(',').filter((id) => id != userId)[0];
                const teamStats = await fetchStats(userId, opponentIds, partner);
                fillDataBlock(valueDivs, teamStats);
                fillGamesDivs(gamesDivs, await fetchDuelsByAllModes(userId, opponentIds, partner), opponentId);
            }, false);
            ourTeamsValue.innerHTML = "";
            ourTeamsValue.append(ourTeamsSelect);

            // Data for automatically selected own team
            const partner = ourTeamsSelect.value.split(',').filter((id) => id != userId)[0];
            const teamStats = await fetchStats(userId, opponentIds, partner);
            fillDataBlock(valueDivs, teamStats);
            fillGamesDivs(gamesDivs, await fetchDuelsByAllModes(userId, opponentIds, partner), opponentId);
        } else {
            // Fill solo data back in
            ourTeamsDiv.style.display = "none";
            fillDataBlock(valueDivs, soloStats);
            fillGamesDivs(gamesDivs, soloGames, opponentId);
        }
    };
};


let lastOpponentId = null;

const runOnUserPage = async (forceRun = false) => {
    let opponentId = location.pathname.split('/').pop();
    const insertHookElement = document.querySelector("." + cn('friend-status_section__'));
    if (! insertHookElement) return;

    navigator.locks.request("userscript_duels_history", async (lock) => {
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
        const [dataBlockDiv, valueDivs, gamesDivs] = makeDataBlockDiv(stats.overall.count == 0);
        insertHookElement.insertAdjacentElement("beforebegin", dataBlockDiv);
        fillDataBlock(valueDivs, stats);
        fillGamesDivs(gamesDivs, games, opponentId);
        insertHookElement.insertAdjacentElement("beforebegin", makeSpacer(16));

        // Team duels interface
        const opponentTeams = await fetchOpponentTeams(userId, opponentId);
        if (opponentTeams.length > 0) {
            const [opponentTeamsDiv, opponentTeamsValue, opponentTeamsDummy] = makeDataDiv("Team", false);
            const [ourTeamsDiv, ourTeamsValue, ourTeamsDummy] = makeDataDiv("Your team");
            ourTeamsDiv.style.display = "none";
            dataBlockDiv.append(opponentTeamsDiv, ourTeamsDiv);
            opponentTeamsValue.innerHTML = "...";
            opponentTeamsDummy.innerHTML = "\u200b"; // zero width space

            const opponentTeamsSelect = await makeTeamsSelect(userId, opponentId, opponentTeams,
                makeTeamsSelectHandler(ourTeamsDiv, ourTeamsValue, ourTeamsDummy,
                                       userId, opponentId, valueDivs, gamesDivs, stats, games));
            opponentTeamsValue.innerHTML = "";
            opponentTeamsValue.append(opponentTeamsSelect);
        }
    });
};


const makeSpacer = (height) => {
    const spacer = document.createElement('div');
    spacer.className = `${cn('spacer_space__')} ${cn('spacer_height__')} ${USERSCRIPT_CUSTOM_SPACER_CLASS}`;
    spacer.style = `--height: ${height}`;
    return spacer;
};


const makeSectionHeader = (title) => {
    const header = document.createElement('div');
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
    button.style = "margin: 0.25rem";
    return button;
};


const createDownload = async (userId) => {
    const db = await openDB();
    const storeNames = ["duels", "teamduels", "rounds"];
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
    const filePicker = document.createElement('input');
    filePicker.type = 'file';
    filePicker.addEventListener('change', (event) => {
        let reader = new FileReader();
        reader.addEventListener('load', async () => {
            try {
                const json = JSON.parse(reader.result);
                const db = await openDB();
                const storeNames = ["duels", "teamduels", "rounds"];
                const tx = db.transaction(storeNames.map(name => `${name}_${userId}`), 'readwrite');
                const data = {};
                for (const storeName of storeNames) {
                    const store = tx.objectStore(`${storeName}_${userId}`);
                    for (const entry of json.stores[storeName]) {
                        entry.time = new Date(entry.time);
                        if (storeName == "rounds") {
                            for (const round in entry.rounds) {
                                round.startTime = new Date(round.startTime);
                                round.timerStartTime = new Date(round.timerStartTime);
                                round.endTime = new Date(round.endTime);
                                if (round.ourGuess) round.ourGuess.guessTime = new Date(round.ourGuess.guessTime);
                                if (round.theirGuess) round.theirGuess.guessTime = new Date(round.theirGuess.guessTime);
                            }
                        }
                        store.put(entry);
                    }
                }
                databaseStatus.innerHTML = "<b>Import complete.</b><br>";
            } catch (err) {
                databaseStatus.innerHTML = "<b>Import failed. Is this really a duels history export file?</b><br>";
                console.error("Duels history import error:", err);
            }
            const counts = await countDuels(userId);
            databaseStatus.innerHTML += `Solo duels: ${counts.duels}<br>
                                         Team duels: ${counts.teamDuels}<br>
                                         Solo duels with round data: ${counts.rounds}`;
        });
        reader.readAsText(event.target.files[0]);
    });
    filePicker.click();
};


const makeDatabaseStatus = async (userId) => {
    const div = document.createElement('div');
    div.style.display = "inline-block";
    div.style.margin = "1rem";
    div.style.textAlign = "left";
    div.style.verticalAlign = "middle";
    const contents = await countDuels(userId);
    div.innerHTML = `<b>Duels in database</b><br>
                     Solo duels: ${contents.duels}<br>
                     Team duels: ${contents.teamDuels}<br>
                     Solo duels with round data: ${contents.rounds}</p>`;
    return div;
};


let lastProfileHook = null;

const runOnProfilePage = async (forceRun = false) => {
    const hookElement = document.querySelector("." + cn('profile-v2_staticWidgets__'));
    if (! hookElement) return;

    navigator.locks.request("userscript_duels_history_database_download", async (lock) => {
        if (! forceRun && lastProfileHook == hookElement) return;
        lastProfileHook = hookElement;

        const userId = await fetchUserId();
        const statusDiv = await makeDatabaseStatus(userId);
        const spacer1 = makeSpacer(64);
        hookElement.insertAdjacentElement("afterend", spacer1);
        const header = makeSectionHeader("Duels history database");
        spacer1.insertAdjacentElement("afterend", header);
        const container = document.createElement('div');
        const downloadButton = makeButton("Export database");
        downloadButton.addEventListener('click', () => createDownload(userId));
        container.append(downloadButton);
        const importButton = makeButton("Import duels into database");
        importButton.addEventListener('click', () => importDuels(userId, statusDiv));
        container.append(importButton);
        const fillInButton = makeButton("Fill in round data");
        fillInButton.addEventListener('click', () => fillInRoundData(userId));
        container.append(fillInButton);
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
    navigator.locks.request("userscript_duels_history_download_notification", async (lock) => {
        if (updating && headerSection == lastHeaderHook) return;
        lastHeaderHook = headerSection;

        headerSection.insertAdjacentHTML(
            "afterbegin",
            `<div class="${USERSCRIPT_UPDATE_NOTIFICATION_CLASS}">` +
            "Updating duels history... \u23F3</div>"); // hourglass with flowing sand
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