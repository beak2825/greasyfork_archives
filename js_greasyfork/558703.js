// ==UserScript==
// @name         Pinpointing Live Challenges
// @namespace    http://tampermonkey.net/
// @version      0.55
// @description  The script that makes pinpointing matter, even in Live Challenges.
// @match        https://www.geoguessr.com/*
// @icon         https://i.imgur.com/eKp3nIa.png
// @grant        GM_xmlhttpRequest
// @connect      firebasedatabase.app
// @require      https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js
// @require      https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558703/Pinpointing%20Live%20Challenges.user.js
// @updateURL https://update.greasyfork.org/scripts/558703/Pinpointing%20Live%20Challenges.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.top !== window.self) return;

    // --- SETTINGS ---
    const PANEL_DELAY = 4000;
    const MAX_NOTIFICATIONS = 2;
    const BACKUP_POLLING_RATE_MS = 5000;

    // --- CONFIGURATION ---
    const firebaseConfig = {
        apiKey: "AIzaSyCmkGRSezro0Sl27qT4vXetnA7kKJRdYog",
        authDomain: "pinpointinglivechallenges.firebaseapp.com",
        databaseURL: "https://pinpointinglivechallenges-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "pinpointinglivechallenges",
        storageBucket: "pinpointinglivechallenges.firebasestorage.app",
        messagingSenderId: "707336313368",
        appId: "1:707336313368:web:791e7fa09a22dc7596416d",
        measurementId: "G-GWZ6ZXJ97X"
    };

    try {
        if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
    } catch (e) { console.error(e); }
    const db = firebase.database();

    // Global State
    let currentPollingId = null;
    let gamePollInterval = null;
    let firebaseBackupInterval = null;
    let dbListenerRef = null;
    let connectedListenerRef = null; // NEW: Monitor connection status
    let lastReportedRound = 0;
    let podiumObserver = null;
    let celebratedPlayers = new Set();
    let panelTimeout = null;
    let prevRoundFinished = false;

    // Smart Connection State
    let isSocketHealthy = false;

    // Identity Cache
    let myLocalName = localStorage.getItem('pp_cached_name') || null;
    let myLocalId = localStorage.getItem('pp_cached_id') || null;

    // Data Cache
    let cachedGameData = {};
    let uiState = {
        currentRoundNum: 1,
        totalRounds: 10,
        isRoundFinished: false,
        isTimeUp: false,
        isGracePeriod: false,
        isGameFinished: false,
        podiumDetected: false,
        roundEndTime: 0,
        roundTimeLimit: 0
    };

    // --- ZOMBIE-PROOF SAVER ---
    function safeSave(path, payload) {
        return new Promise((resolve) => {
            let isResolved = false;
            // 1. Try Standard SDK
            db.ref(path).set(payload).then(() => {
                if (!isResolved) { isResolved = true; resolve(); }
            }).catch(() => {});
            // 2. Watchdog / Fallback
            setTimeout(() => {
                if (!isResolved) {
                    console.warn("[Pinpointing] Write hung. Sending via GM_REST...");
                    const restUrl = `${firebaseConfig.databaseURL}/${path}.json`;
                    GM_xmlhttpRequest({
                        method: "PUT",
                        url: restUrl,
                        data: JSON.stringify(payload),
                        headers: { "Content-Type": "application/json" },
                        onload: function() {
                            if (!isResolved) { isResolved = true; console.log("[Pinpointing] GM_REST Write Success"); resolve(); }
                        }
                    });
                }
            }, 2000);
        });
    }

    // --- SMART HYBRID LISTENER ---
    function setupDatabaseListener(gameId) {
        if (dbListenerRef) dbListenerRef.off();
        console.log(`[Pinpointing] Listening to Firebase (Socket): ${gameId}`);

        dbListenerRef = db.ref(`games/${gameId}`);
        dbListenerRef.on('value', (snapshot) => {
            const val = snapshot.val();
            if (val) {
                cachedGameData = val;
                renderVisuals();
            }
        });

        // We listen to the special ".info/connected" node.
        // This is true if the websocket is open, false if blocked/disconnected.
        if (connectedListenerRef) connectedListenerRef.off();
        connectedListenerRef = db.ref(".info/connected");
        connectedListenerRef.on("value", (snap) => {
            isSocketHealthy = (snap.val() === true);
            // console.log("[Pinpointing] Socket Status:", isSocketHealthy ? "CONNECTED" : "DISCONNECTED");
        });

        if (firebaseBackupInterval) clearInterval(firebaseBackupInterval);
        firebaseBackupInterval = setInterval(() => {
            // ONLY poll if Firebase itself says "I am disconnected"
            // This protects your quota during quiet rounds where the socket is open but no data is moving.
            if (!isSocketHealthy) {
                console.log("[Pinpointing] Socket disconnected. Fetching via GM_REST...");
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `${firebaseConfig.databaseURL}/games/${gameId}.json`,
                    onload: (response) => {
                        if (response.status === 200 && response.responseText) {
                            try {
                                const val = JSON.parse(response.responseText);
                                if (val) {
                                    cachedGameData = val;
                                    renderVisuals();
                                }
                            } catch (e) { console.error("[Pinpointing] JSON Parse Error", e); }
                        }
                    }
                });
            }
        }, BACKUP_POLLING_RATE_MS);
    }

    // --- HELPER: ID PARSER ---
    function getGameIdFromUrl() {
        const path = location.pathname;
        const match = path.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
        return match ? match[0] : null;
    }

    // --- HELPER: GET IDENTITY ---
    function getIdentityFallback() {
        if (myLocalId && myLocalName) return { id: myLocalId, nick: myLocalName };
        try {
            const el = document.getElementById("__NEXT_DATA__");
            if (el) {
                const data = JSON.parse(el.innerText);
                const user = data.props?.pageProps?.account ||
                             data.props?.pageProps?.user ||
                             data.props?.accountProps?.account?.user;
                if (user) {
                    const foundId = user.id || user.userId;
                    if (foundId) {
                        saveIdentity(foundId, user.nick);
                        return { id: foundId, nick: user.nick };
                    }
                }
            }
        } catch (e) { console.warn("[Pinpointing] Identity fallback error:", e); }
        return null;
    }

    function saveIdentity(id, name) {
        if (!id) return;
        myLocalId = id;
        myLocalName = name;
        localStorage.setItem('pp_cached_id', id);
        localStorage.setItem('pp_cached_name', name);
    }

    // --- UI STYLES ---
    const STYLES = `
        #pp-results-panel {
            position: absolute; bottom: 2%; left: 50%; transform: translateX(-50%);
            width: 750px; background: rgba(23, 23, 23, 0.98);
            border: 3px solid #594eaf; border-radius: 12px;
            color: white; z-index: 4; font-family: 'ggFont', sans-serif;
            box-shadow: 0 10px 40px rgba(0,0,0,0.8);
            display: none; flex-direction: column; overflow: hidden; transition: top 0.5s ease;
        }
        #pp-results-panel.final-mode { top: 15% !important; }
        #pp-results-panel.visible { display: flex; }
        .pp-tabs { display: flex; border-bottom: 2px solid #555; cursor: pointer; background: #111; }
        .pp-tab { flex: 1; padding: 15px; text-align: center; font-size: 16px; font-weight: bold; color: #888; text-transform: uppercase; transition: all 0.2s; }
        .pp-tab:hover { background: #222; color: #aaa; }
        .pp-tab.active { background: linear-gradient(180deg,#322a6a 0%, #594eaf 100%); color: white; border-bottom: 4px solid #8f86e6; }
        .pp-tab-content { display: none; min-height: 150px; max-height: 35vh; overflow-y: auto; }
        #pp-results-panel.final-mode .pp-tab-content { max-height: 60vh; }
        .pp-tab-content.active { display: block; }
        .pp-tab-content::-webkit-scrollbar { width: 8px; }
        .pp-tab-content::-webkit-scrollbar-track { background: #1a1a1a; }
        .pp-tab-content::-webkit-scrollbar-thumb { background: #594eaf; border-radius: 4px; }
        .pp-columns { display: grid; padding: 10px 20px; border-bottom: 1px solid #444; color: #aaa; font-size: 12px; text-transform: uppercase; font-weight: bold; background: #1a1a1a; position: sticky; top: 0; z-index: 10; }
        .cols-round { grid-template-columns: 50px 1fr 100px 80px 80px; }
        .cols-total { grid-template-columns: 50px 1fr 100px; }
        .cols-final { grid-template-columns: 50px 1fr 100px 100px 80px 100px; }
        .pp-row { display: flex; align-items: center; padding: 10px 20px; border-bottom: 1px solid #333; font-size: 15px; }
        .pp-row:nth-child(even) { background: rgba(255,255,255,0.03); }
        .pp-row.is-me { background: rgba(90, 219, 149, 0.15); border-left: 4px solid #5adb95; }
        .grid-round { display: grid; grid-template-columns: 50px 1fr 100px 80px 80px; align-items: center; }
        .grid-total { display: grid; grid-template-columns: 50px 1fr 100px; align-items: center; }
        .grid-final { display: grid; grid-template-columns: 50px 1fr 100px 100px 80px 100px; align-items: center; }
        .pp-row.top-3 { font-size: 18px; padding: 15px 20px; background: rgba(255, 215, 0, 0.05); }
        .pp-row.rank-1 { border-left: 4px solid #FFD700; }
        .pp-row.rank-2 { border-left: 4px solid #C0C0C0; }
        .pp-row.rank-3 { border-left: 4px solid #CD7F32; }
        .pp-rank { font-weight: bold; color: #888; }
        .pp-name { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 600; }
        .pp-score { color: #fff; }
        .pp-time { color: #ccc; font-size: 13px; }
        .pp-dist { color: #ccc; font-size: 13px; }
        .pp-5k { color: #5adb95; font-weight: bold; }
        .pp-gained { color: #5adb95; font-weight: bold; text-align: right; }
        .pp-total-pts { color: #ffcc00; font-weight: bold; font-size: 16px; text-align: right; }
        #pp-notifs { position: fixed; top: 180px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; gap: 10px; z-index: 100000; }
        .pp-toast { background: linear-gradient(180deg,#322a6a 0%, #594eaf 100%); border: 2px solid #8f86e6; color: white; padding: 15px 30px; border-radius: 50px; font-family: 'ggFont', sans-serif; font-size: 20px; font-weight: bold; box-shadow: 0 5px 20px rgba(0,0,0,0.5); animation: pp-slide-in 0.3s ease-out forwards; opacity: 0; }
        .pp-toast.perfect { background: linear-gradient(180deg, #2c6e49 0%, #479e65 100%); border-color: #5adb95; }
        .pp-toast.close { background: linear-gradient(180deg, #8a6d0b 0%, #b59218 100%); border-color: #ffd700; }
        @keyframes pp-slide-in { 0% { transform: translateY(-20px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
        @keyframes pp-fade-out { 0% { opacity: 1; } 100% { opacity: 0; } }
        div[class*="multiplayer-round-results_leaderboard"] { display: none !important; }
        div[class*="leaderboard_leaderboard"] { display: none !important; }
        div[class*="podium_podiumWrapper"], div[class*="styles_podiumWrapper"] { display: none !important; }
        div[class*="avatar-podium_root"] { display: none !important; }
        div[class*="multiplayer-round-results_playerActionSection"] { margin-top: .5rem !important; }
        div[class*="score_score"] { margin: .5rem 0 .5rem !important; }
        div[class*="multiplayer-round-results_content"] { padding-top: 1.5rem }
        div[class*="multiplayer-round-results_waitingForHostMessage"] { display: none !important; }
    `;

    function createUI() {
        if (document.getElementById('pp-results-panel')) return;
        const styleSheet = document.createElement("style");
        styleSheet.innerText = STYLES;
        document.head.appendChild(styleSheet);
        const panel = document.createElement('div');
        panel.id = 'pp-results-panel';
        panel.innerHTML = `
            <div class="pp-tabs" id="pp-tabs-header">
                <div id="tab-btn-round" class="pp-tab active">Round Results</div>
                <div id="tab-btn-total" class="pp-tab">Total Standings</div>
            </div>
            <div id="view-round" class="pp-tab-content active"><div class="pp-columns cols-round"><div>#</div><div>Player</div><div>Score</div><div>Time</div><div>+Pts</div></div><div id="list-round"></div></div>
            <div id="view-total" class="pp-tab-content"><div class="pp-columns cols-total"><div>#</div><div>Player</div><div style="text-align:right">Total Pts</div></div><div id="list-total"></div></div>
            <div id="view-final" class="pp-tab-content"><div class="pp-columns cols-final"><div>#</div><div>Player</div><div>Time</div><div>Dist</div><div>5Ks</div><div style="text-align:right">Pts</div></div><div id="list-final"></div></div>
        `;
        document.body.appendChild(panel);
        document.getElementById('tab-btn-round').onclick = () => switchTab('round');
        document.getElementById('tab-btn-total').onclick = () => switchTab('total');
        const notifs = document.createElement('div');
        notifs.id = 'pp-notifs';
        document.body.appendChild(notifs);
    }

    function switchTab(tabName) {
        document.getElementById('tab-btn-round').classList.toggle('active', tabName === 'round');
        document.getElementById('tab-btn-total').classList.toggle('active', tabName === 'total');
        document.getElementById('view-round').classList.toggle('active', tabName === 'round');
        document.getElementById('view-total').classList.toggle('active', tabName === 'total');
    }

    function showNotification(message, type = 'normal') {
        const container = document.getElementById('pp-notifs');
        if (!container) return;
        while (container.childElementCount >= MAX_NOTIFICATIONS) container.firstElementChild.remove();
        const toast = document.createElement('div');
        toast.className = `pp-toast ${type}`;
        toast.innerText = message;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'pp-fade-out 0.5s ease forwards';
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }

    function renderVisuals() {
        if (!cachedGameData) return;
        let totalLeaderboard = {};
        let roundResults = [];
        const isPodiumTime = uiState.podiumDetected && uiState.isGameFinished;
        const targetRoundNum = uiState.isGracePeriod ? (uiState.currentRoundNum - 1) : uiState.currentRoundNum;
        let hasGuessedCurrent = false;
        if (myLocalId) {
            const rData = cachedGameData[`round_${uiState.currentRoundNum}`];
            if (rData && rData[myLocalId]) hasGuessedCurrent = true;
        }
        const showPanel = isPodiumTime || uiState.isRoundFinished || uiState.isGracePeriod || uiState.isTimeUp || hasGuessedCurrent;
        Object.keys(cachedGameData).forEach(roundKey => {
            if (!roundKey.startsWith("round_")) return;
            const rNum = parseInt(roundKey.replace("round_", ""));
            const playersInRound = Object.values(cachedGameData[roundKey]);
            if (rNum === uiState.currentRoundNum) {
                playersInRound.forEach(p => {
                    const uniqueKey = `${roundKey}_${p.name}`;
                    if (!celebratedPlayers.has(uniqueKey)) {
                        if (p.score === 5000) { showNotification(`${p.name} JUST 5K'D! (${p.time}s)`, 'perfect'); celebratedPlayers.add(uniqueKey); }
                        else if (p.score >= 4990 && p.score < 5000) { showNotification(`${p.name} was close! (${p.score})`, 'close'); celebratedPlayers.add(uniqueKey); }
                    }
                });
            }
            playersInRound.sort((a, b) => (b.score !== a.score) ? b.score - a.score : a.time - b.time);
            const totalPlayers = playersInRound.length;
            let previousP = null;
            let previousEarned = 0;
            playersInRound.forEach((player, index) => {
                const pName = player.name;
                let earned = (totalPlayers - 1) - index;
                if (previousP && player.score === previousP.score && player.time === previousP.time) earned = previousEarned;
                if (!totalLeaderboard[pName]) totalLeaderboard[pName] = { name: pName, totalPinPoints: 0, num5ks: 0, totalTime: 0, totalDist: 0 };
                totalLeaderboard[pName].totalPinPoints += earned;
                totalLeaderboard[pName].totalTime += (player.time || 0);
                totalLeaderboard[pName].totalDist += (player.distance || 0);
                if (player.score === 5000) totalLeaderboard[pName].num5ks++;
                if (rNum === targetRoundNum) player.pointsEarned = earned;
                previousP = player;
                previousEarned = earned;
            });
            if (rNum === targetRoundNum) roundResults = playersInRound;
        });

        const panel = document.getElementById('pp-results-panel');
        if (panel) showPanel ? panel.classList.add('visible') : panel.classList.remove('visible');

        if (isPodiumTime) {
            if (Object.keys(totalLeaderboard).length === 0) { if (panel) panel.classList.remove('visible'); return; }
            if (panel) panel.classList.add('final-mode');
            const tabsHeader = document.getElementById('pp-tabs-header');
            if (tabsHeader) tabsHeader.style.display = 'none';
            document.getElementById('view-round').classList.remove('active');
            document.getElementById('view-total').classList.remove('active');
            document.getElementById('view-final').style.display = 'block';
            const listFinal = document.getElementById('list-final');
            if (listFinal) {
                const finalRankings = Object.values(totalLeaderboard).sort((a, b) => b.totalPinPoints !== a.totalPinPoints ? b.totalPinPoints - a.totalPinPoints : (b.num5ks !== a.num5ks ? b.num5ks - a.num5ks : a.totalDist - b.totalDist));
                let html = '<div style="padding:15px; text-align:center; font-size:24px; font-weight:bold; color:#ffd700;">FINAL STANDINGS</div>';
                finalRankings.forEach((p, index) => {
                    const isMe = (p.name === myLocalName);
                    const rank = index + 1;
                    let medal = '', rowExtraClass = '';
                    if (rank === 1) { medal = '🥇 '; rowExtraClass = 'top-3 rank-1'; }
                    else if (rank === 2) { medal = '🥈 '; rowExtraClass = 'top-3 rank-2'; }
                    else if (rank === 3) { medal = '🥉 '; rowExtraClass = 'top-3 rank-3'; }
                    let distStr = Math.round(p.totalDist) + "m";
                    if (p.totalDist > 5000) distStr = (p.totalDist / 1000).toFixed(1) + "km";
                    html += `<div class="pp-row grid-final ${isMe ? 'is-me' : ''} ${rowExtraClass}"><div class="pp-rank">${medal || '#' + rank}</div><div class="pp-name">${p.name}</div><div class="pp-time">${p.totalTime.toFixed(0)}s</div><div class="pp-dist">${distStr}</div><div class="pp-5k">${p.num5ks}</div><div class="pp-total-pts">${p.totalPinPoints}</div></div>`;
                });
                listFinal.innerHTML = html;
            }
            return;
        }

        if (showPanel) {
            if (panel) panel.classList.remove('final-mode');
            const tabsHeader = document.getElementById('pp-tabs-header');
            if (tabsHeader) tabsHeader.style.display = 'flex';
            document.getElementById('view-final').style.display = 'none';
            const isFinalRound = (targetRoundNum === uiState.totalRounds);
            const tabTotal = document.getElementById('tab-btn-total');
            if (tabTotal) {
                if (isFinalRound) { tabTotal.style.display = 'none'; switchTab('round'); }
                else { tabTotal.style.display = 'block'; }
            }
            if (!document.getElementById('view-round').classList.contains('active') && !document.getElementById('view-total').classList.contains('active')) switchTab('round');
            const listRound = document.getElementById('list-round');
            if (listRound) {
                let html = '';
                roundResults.forEach((p, index) => {
                    const isMe = (p.name === myLocalName);
                    html += `<div class="pp-row grid-round ${isMe ? 'is-me' : ''}"><div class="pp-rank">#${index + 1}</div><div class="pp-name">${p.name}</div><div class="pp-score">${p.score}</div><div class="pp-time">${p.time}s</div><div class="pp-gained">+${p.pointsEarned !== undefined ? p.pointsEarned : '?'}</div></div>`;
                });
                listRound.innerHTML = html || '<div style="padding:20px;text-align:center;color:#666;">No guesses recorded.</div>';
            }
            const listTotal = document.getElementById('list-total');
            if (listTotal) {
                const totalRankings = Object.values(totalLeaderboard).sort((a, b) => b.totalPinPoints !== a.totalPinPoints ? b.totalPinPoints - a.totalPinPoints : (b.num5ks !== a.num5ks ? b.num5ks - a.num5ks : a.totalDist - b.totalDist));
                let html = '';
                totalRankings.forEach((p, index) => {
                    const isMe = (p.name === myLocalName);
                    html += `<div class="pp-row grid-total ${isMe ? 'is-me' : ''}"><div class="pp-rank">#${index + 1}</div><div class="pp-name">${p.name}</div><div class="pp-total-pts">${p.totalPinPoints}</div></div>`;
                });
                listTotal.innerHTML = html;
            }
        }
    }

    function startPodiumObserver() {
        if (podiumObserver) return;
        podiumObserver = new MutationObserver((mutations) => {
            const pageText = document.body.innerText;
            const isSummaryScreen = pageText.includes("Game breakdown") || pageText.includes("Game summary");
            const avatarPodium = document.querySelector('div[class*="avatar-podium_root"]');
            if ((isSummaryScreen || avatarPodium) && uiState.isGameFinished) {
                if (!uiState.podiumDetected) { uiState.podiumDetected = true; renderVisuals(); }
            }
        });
        podiumObserver.observe(document.body, { childList: true, subtree: true });
    }

    // --- WATCHDOG ---
    function startWatchdog(gameId, myId, myName) {
        setInterval(() => {
            if (!uiState.roundEndTime || !myId) return;
            const now = Date.now();
            if (now > (uiState.roundEndTime + 5000)) {
                if (lastReportedRound < uiState.currentRoundNum) {
                    const payload = { name: myName, score: 0, time: uiState.roundTimeLimit, distance: 20000000, updatedAt: firebase.database.ServerValue.TIMESTAMP };
                    safeSave(`games/${gameId}/round_${uiState.currentRoundNum}/${myId}`, payload).then(() => {
                        lastReportedRound = uiState.currentRoundNum;
                        renderVisuals();
                    });
                }
                if (!uiState.isTimeUp) { uiState.isTimeUp = true; renderVisuals(); }
            }
        }, 1000);
    }

    async function fetchChallengeData(gameId) {
        try {
            const res = await fetch(`https://game-server.geoguessr.com/api/live-challenge/${gameId}`, { method: "GET", credentials: "include" });
            if (res.ok) processGameData(await res.json());
        } catch (e) { console.error("[Pinpointing] Poll Error:", e); }
    }

    function processGameData(data) {
        let myId = data.playerPositions?.gameEntry?.id;
        let myName = data.playerPositions?.gameEntry?.name;
        if (myId) { saveIdentity(myId, myName); }
        else { const fallback = getIdentityFallback(); if (fallback) { myId = fallback.id; myName = fallback.nick; } }

        const currentRound = data.currentRoundNumber;
        const totalRounds = data.roundCount || data.options?.roundCount || data.totalSteps || 10;

        if (myId) {
            if (!window.ppWatchdogStarted) { startWatchdog(data.gameId, myId, myName); window.ppWatchdogStarted = true; }
            const roundStartCheck = lastReportedRound + 1;
            const roundEndCheck = currentRound;
            for (let r = roundStartCheck; r <= roundEndCheck; r++) {
                const currentGuess = data.guesses.find(g => g.roundNumber === r);
                const roundObj = data.rounds.find(ro => ro.roundNumber === r);
                const isRoundOver = roundObj && roundObj.state === "Ended";
                const roundTimeLimit = roundObj?.roundTime || data.options?.roundTime || 9999;
                const roundStartTime = roundObj ? new Date(roundObj.startTime).getTime() : 0;
                const timeNow = Date.now();
                const timeDeadline = roundStartTime + (roundTimeLimit * 1000) + 5000;
                const isTimeUp = (roundStartTime > 0) && (timeNow > timeDeadline);

                let payload = null;
                if (currentGuess) { payload = { name: myName, score: currentGuess.score, time: currentGuess.time, distance: currentGuess.distance, updatedAt: firebase.database.ServerValue.TIMESTAMP }; }
                else if (isRoundOver || isTimeUp) { payload = { name: myName, score: 0, time: roundTimeLimit, distance: 20000000, updatedAt: firebase.database.ServerValue.TIMESTAMP }; }
                else { break; }

                if (payload) {
                    safeSave(`games/${data.gameId}/round_${r}/${myId}`, payload);
                    lastReportedRound = r;
                }
            }
        }
        uiState.currentRoundNum = currentRound;
        uiState.totalRounds = totalRounds;
        const currentRoundObj = data.rounds.find(r => r.roundNumber === currentRound);
        const isRoundOver = currentRoundObj && currentRoundObj.state === "Ended";
        uiState.isRoundFinished = isRoundOver;
        uiState.isGameFinished = (data.status === "Finished" || data.status === "Ended");
        const curRoundStartTime = currentRoundObj ? new Date(currentRoundObj.startTime).getTime() : 0;
        const curRoundLimit = currentRoundObj?.roundTime || data.options?.roundTime || 9999;
        const curTimeNow = Date.now();
        const curDeadline = curRoundStartTime + (curRoundLimit * 1000) + 5000;
        if (curRoundStartTime > 0) {
            uiState.isTimeUp = (curTimeNow > curDeadline);
            uiState.roundEndTime = curRoundStartTime + (curRoundLimit * 1000);
            uiState.roundTimeLimit = curRoundLimit;
        } else { uiState.isTimeUp = false; }
        if (prevRoundFinished && !isRoundOver) {
             if (!uiState.isGracePeriod && !panelTimeout && lastReportedRound > 0) {
                 uiState.isGracePeriod = true;
                 panelTimeout = setTimeout(() => { uiState.isGracePeriod = false; panelTimeout = null; renderVisuals(); }, PANEL_DELAY);
             }
        }
        if (isRoundOver) { uiState.isGracePeriod = false; if (panelTimeout) { clearTimeout(panelTimeout); panelTimeout = null; } }
        prevRoundFinished = isRoundOver;

        // Ensure Listener is Active
        if (currentPollingId !== data.gameId) {
             setupDatabaseListener(data.gameId);
             currentPollingId = data.gameId;
        }

        renderVisuals();
    }

    function startPolling(gameId) {
        if (currentPollingId === gameId) return;
        currentPollingId = gameId;
        lastReportedRound = 0;
        celebratedPlayers.clear();
        cachedGameData = {};
        window.ppWatchdogStarted = false;
        prevRoundFinished = false;
        uiState.isGameFinished = false;
        uiState.podiumDetected = false;
        uiState.isGracePeriod = false;
        isSocketHealthy = false; // Reset

        const old = document.getElementById('pp-results-panel');
        if (old) old.remove();
        createUI();
        startPodiumObserver();

        setupDatabaseListener(gameId);

        if (!myLocalId) { const fallback = getIdentityFallback(); if (fallback) { myLocalId = fallback.id; myLocalName = fallback.nick; } }
        fetchChallengeData(gameId);
        if (gamePollInterval) clearInterval(gamePollInterval);
        gamePollInterval = setInterval(() => fetchChallengeData(gameId), 2000);
    }

    function stopPolling() {
        if (!currentPollingId) return;
        currentPollingId = null;
        if (gamePollInterval) clearInterval(gamePollInterval);
        if (firebaseBackupInterval) clearInterval(firebaseBackupInterval);
        if (podiumObserver) { podiumObserver.disconnect(); podiumObserver = null; }
        const panel = document.getElementById('pp-results-panel');
        if (panel) panel.remove();
        const notifs = document.getElementById('pp-notifs');
        if (notifs) notifs.remove();
        if (dbListenerRef) { dbListenerRef.off(); dbListenerRef = null; }
        if (connectedListenerRef) { connectedListenerRef.off(); connectedListenerRef = null; }
    }

    function heartbeat() {
        if (location.pathname.includes("/live-challenge/")) {
            const gameId = getGameIdFromUrl();
            if (gameId) { if (currentPollingId !== gameId) startPolling(gameId); }
        } else { if (currentPollingId) stopPolling(); }
    }

    setInterval(heartbeat, 1000);
    heartbeat();

})();