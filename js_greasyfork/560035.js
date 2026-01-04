// ==UserScript==
// @name         Best countries in duels
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Scan played competitive duels and export almost accurate stats for every country.
// @author       Ferklen
// @match        https://www.geoguessr.com/me/activities*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560035/Best%20countries%20in%20duels.user.js
// @updateURL https://update.greasyfork.org/scripts/560035/Best%20countries%20in%20duels.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //
    const style = document.createElement('style');
    style.innerHTML = `
        #gg-analyzer-container {
            position: fixed;
            top: 100px;
            right: 80px;
            width: 320px;
            background: #24133b;
            color: white;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 12px 40px rgba(0,0,0,0.6);
            z-index: 9999;
            font-family: "Neo Sans", sans-serif;
            border: 2px solid #7c3aed;
        }
        #gg-analyzer-container h2 { margin: 0 0 15px 0; color: #fff; font-size: 1.3rem; text-align: center; font-weight: 800; }
        #gg-input-group { margin: 15px 0; }
        .gg-input {
            width: 100%;
            padding: 12px;
            border-radius: 8px;
            border: 1px solid #4a2b75;
            background: #1a0b2e;
            color: white;
            box-sizing: border-box;
            font-size: 1.1rem;
            outline: none;
        }
        .gg-input:focus { border-color: #9d66ff; }
        .gg-btn {
            width: 100%;
            padding: 12px;
            border: none;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
            transition: transform 0.1s, background 0.2s;
            margin-top: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .gg-btn:active { transform: scale(0.98); }
        .btn-start { background: #7c3aed; color: white; }
        .btn-start:hover { background: #9061f9; }
        .btn-cancel { background: #ef4444; color: white; margin-top: 15px; }
        .progress-wrapper { background: #1a0b2e; border-radius: 20px; height: 24px; overflow: hidden; margin: 20px 0; position: relative; border: 1px solid #4a2b75; }
        #progress-bar { width: 0%; height: 100%; background: linear-gradient(90deg, #7c3aed, #10b981); transition: width 0.2s ease-out; }
        #progress-text { position: absolute; width: 100%; text-align: center; font-size: 0.85rem; line-height: 24px; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.8); }
        .hidden { display: none; }
        #status-update { font-size: 0.85rem; text-align: center; color: #b794f4; }
    `;
    document.head.appendChild(style);

    //
    const container = document.createElement('div');
    container.id = 'gg-analyzer-container';
    container.innerHTML = `
        <h2>Best countries in duels</h2>

        <div id="view-setup">
            <div id="gg-input-group">
                <p style="font-size: 0.8rem; margin-bottom: 8px; opacity: 0.9;">Number of duels to scan (put all the duels in your profile to scan everything that's findable)</p>
                <input type="number" id="input-target" class="gg-input" value="50" min="1">
            </div>
            <button id="btn-start" class="gg-btn btn-start">Start Scanning</button>
        </div>

        <div id="view-running" class="hidden">
            <div class="progress-wrapper">
                <div id="progress-text">0%</div>
                <div id="progress-bar"></div>
            </div>
            <div id="status-update">Initializing...</div>
            <button id="btn-cancel" class="gg-btn btn-cancel">Cancel</button>
        </div>

        <div id="view-complete" class="hidden">
            <div style="text-align: center; color: #10b981; font-weight: bold; font-size: 1.1rem;">Finished scanning</div>
            <p id="final-stats" style="font-size: 0.85rem; text-align: center; margin: 10px 0;"></p>
            <button id="btn-restart" class="gg-btn btn-start">Restart</button>
        </div>

        <div id="view-error" class="hidden">
            <div style="text-align: center; color: #ef4444; font-weight: bold;">Unexpected Error</div>
            <button id="btn-error-retry" class="gg-btn btn-start">Try Again</button>
        </div>
    `;
    document.body.appendChild(container);

    //
    let isRunning = false;
    const myId = "62f6afb55a379b73b23633ae";

    const showView = (viewName) => {
        ['setup', 'running', 'complete', 'error'].forEach(v => {
            document.getElementById(`view-${v}`).classList.add('hidden');
        });
        document.getElementById(`view-${viewName}`).classList.remove('hidden');
    };

    const updateProgress = (current, target) => {
        const percent = Math.min(Math.round((current / target) * 100), 100);
        document.getElementById('progress-bar').style.width = percent + '%';
        document.getElementById('progress-text').innerText = percent + '%';
        document.getElementById('status-update').innerText = `Processed ${current} competitive duels`;
    };

    async function startAnalysis() {
        const targetDuels = parseInt(document.getElementById('input-target').value);
        if (isNaN(targetDuels) || targetDuels <= 0) return;

        isRunning = true;
        showView('running');

        const results = {};
        let paginationToken = "";
        let processedCount = 0;

        try {
            while (processedCount < targetDuels && isRunning) {
                const feedUrl = `https://www.geoguessr.com/api/v4/feed/private${paginationToken ? '?paginationToken=' + paginationToken : ''}`;
                const feedResponse = await fetch(feedUrl).then(res => res.json());

                if (!feedResponse.entries || feedResponse.entries.length === 0) break;

                for (const entry of feedResponse.entries) {
                    if (!isRunning || processedCount >= targetDuels) break;
                    try {
                        const payloadRaw = JSON.parse(entry.payload);
                        const payloadArray = Array.isArray(payloadRaw) ? payloadRaw : [payloadRaw];

                        for (const item of payloadArray) {
                            if (!isRunning || processedCount >= targetDuels) break;
                            const gameId = item.gameId || item.payload?.gameId;
                            if (!gameId) continue;

                            await new Promise(r => setTimeout(r, 150));

                            const response = await fetch(`https://game-server.geoguessr.com/api/duels/${gameId}`, { credentials: 'include' });
                            if (!response.ok) continue;

                            const duelData = await response.json();
                            if (!duelData.options?.isRated || duelData.options?.isTeamDuels === true) continue;

                            const myTeam = duelData.teams.find(t => t.players.some(p => p.playerId === myId));
                            if (!myTeam) continue;

                            const opponentTeam = duelData.teams.find(t => t !== myTeam);
                            duelData.rounds.forEach((round) => {
                                const country = (round.panorama?.countryCode || "Unknown").toUpperCase();
                                const myScore = myTeam.players[0].guesses.find(g => g.roundNumber === round.roundNumber)?.score || 0;
                                const opScore = opponentTeam.players[0].guesses.find(g => g.roundNumber === round.roundNumber)?.score || 0;

                                if (!results[country]) {
                                    results[country] = { totalDiff: 0, rounds: 0 };
                                }
                                results[country].totalDiff += (myScore - opScore);
                                results[country].rounds += 1;
                            });

                            processedCount++;
                            updateProgress(processedCount, targetDuels);
                        }
                    } catch (err) { }
                }

                paginationToken = feedResponse.paginationToken;
                if (!paginationToken) break;
            }

            if (isRunning) {
                finishAnalysis(results, processedCount);
            }

        } catch (globalErr) {
            console.error(globalErr);
            showView('error');
        }
    }

    function finishAnalysis(results, count) {
        isRunning = false;

        document.getElementById('progress-bar').style.width = '100%';
        document.getElementById('progress-text').innerText = '100%';

        setTimeout(() => {
            let csv = "Rank,Country,PointDiff,RoundCount,AvgDiff\n";
            const sorted = Object.entries(results).sort((a, b) => b[1].totalDiff - a[1].totalDiff);
            sorted.forEach(([code, stats], index) => {
                csv += `${index + 1},${code},${stats.totalDiff},${stats.rounds},${(stats.totalDiff / stats.rounds).toFixed(2)}\n`;
            });

            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `best_countries_in_last_${count}_duels.csv`;
            a.click();

            setTimeout(() => window.URL.revokeObjectURL(url), 100);

            document.getElementById('final-stats').innerText = `Processed ${count} competitive duels.`;
            showView('complete');
        }, 50);
    }

    //
    document.getElementById('btn-start').onclick = startAnalysis;
    document.getElementById('btn-cancel').onclick = () => { isRunning = false; showView('setup'); };
    document.getElementById('btn-restart').onclick = () => showView('setup');
    document.getElementById('btn-error-retry').onclick = () => showView('setup');

})();