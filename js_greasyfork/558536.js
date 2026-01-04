// ==UserScript==
// @name         FV - Royal Higher or Lower Mini-game
// @namespace    https://greasyfork.org/en/users/1535374-necroam
// @version      1.0
// @description  Play against the Royal Fox with King Catrick. Guess if the next card drawn will be higher or lower than the previous one (1-21). Guess correctly as many times in a row as possible. Game works on /villager/455908
// @match        https://www.furvilla.com/villager/455908
// @match        https://docs.google.com/spreadsheets/d/1onJ9_DmlBa512bd8gudsHbhtueNk8pp3Aoy0bQhr2xA/edit?usp=sharing
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558536/FV%20-%20Royal%20Higher%20or%20Lower%20Mini-game.user.js
// @updateURL https://update.greasyfork.org/scripts/558536/FV%20-%20Royal%20Higher%20or%20Lower%20Mini-game.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function init() {
        const container = document.querySelector('.villager-data-info-wide .profanity-filter');
        if (!container) return;
        if (!container.innerHTML.includes('testGameHere')) return;

        const userPanel = document.querySelector('.widget .user-info h4 a');
        const username = userPanel ? userPanel.textContent.trim() : 'Player';

        container.innerHTML = `
            <div class="registration-well" style="text-align:center;">
                <h2>Royal Fox: Higher or Lower</h2>
                <a href="#" id="startRoyalFoxGame" class="btn big">Play Game</a>
                <div id="royalfox-game" style="margin-top:10px;"></div>

                <div id="leaderboard-section" style="margin-top:20px; text-align:left;">
                    <h3>Leaderboard</h3>
                    <div id="leaderboard-box">
                        <p>Loading...</p>
                    </div>
                </div>
            </div>
        `;

        const btn = document.getElementById('startRoyalFoxGame');
        const gameContainer = document.getElementById('royalfox-game');
        const leaderboardBox = document.getElementById('leaderboard-box');

        // --- Game state ---
        let currentCard = null;
        let score = 0;

        // Fixed companion: King Catrick
        const companion = 'King Catrick';
        const companions = {
            'King Catrick': 'https://www.furvilla.com/img/villagers/0/166-4-th.png'
        };
        const chatter = {
            'King Catrick': [
        "I trust your judgement here!",
        "Which one is it going to be?",
        "Together we will triumph!",
        "Stay sharp, the Royal Fox won't go easy!",
        "We've got this, one card at a time!",
        "Keep your eyes open, the next card might be tricky!",
        "I can feel victory is close!",
        "Don't let the Royal Fox intimidate us!",
        "Every guess counts!",
        "Let's make it count!",
        "Stay focused, and I’ll guide you!",
        "Courage, my friend! The Royal Fox is clever!",
        "This is our moment to shine!",
        "Trust me, your instincts are right!",
        "Keep going, we’re on a roll!",
        "The Royal Fox won't know what hit it!",
        "We need perfect timing, are you ready?",
        "Focus… and strike at the right moment!",
        "With every correct guess, we get stronger!",
        "I’m counting on you to lead us to victory!",
        "Together, nothing can stop us!"
            ]
        };

        function randomChatter() {
            const lines = chatter[companion];
            return lines[Math.floor(Math.random() * lines.length)];
        }

        // Draw card in 1–21, never equal to notEqualTo
        function drawCard(notEqualTo) {
            let card;
            do {
                card = Math.floor(Math.random() * 21) + 1;
            } while (card === notEqualTo);
            return card;
        }

        function startGame() {
            score = 0;
            currentCard = drawCard(null);
            if (btn) btn.style.display = 'none'; // hide Play
            renderGameUI(`${companion} says: "${randomChatter()}"`);
        }

        // Companion selection removed
        function renderCompanionSelect() {
            // intentionally left blank
        }

        function renderGameUI(message = '') {
            gameContainer.innerHTML = `
                <div style="display:flex; justify-content:center; gap:20px; align-items:flex-start;">
                  <div style="flex:0 0 auto; text-align:center;">
                    <img src="https://www.furvilla.com/img/villagers/0/166-2.png" style="height:200px;">
                    <p><em>The Royal Fox watches you...</em></p>
                    <p><strong>Score (${username}): ${score}</strong></p>
                  </div>

                  <div style="flex:1; text-align:center; font-size:smaller;">
                    <label>Current Card:</label>
                    <div style="font-size:2em; font-weight:bold; margin:6px 0;">${currentCard}</div>
                    <hr style="margin:12px 0;">
                    <div style="margin:10px 0; display:flex; justify-content:center; gap:15px;">
                      <a href="#" id="higherBtn" class="btn">Higher</a>
                      <a href="#" id="lowerBtn" class="btn">Lower</a>
                    </div>
                    <div style="margin-top:10px;">
                        <label>Your Companion:</label><br>
                        <img src="${companions[companion]}" style="height:80px;">
                        <div style="margin-top:6px;"><em>${message}</em></div>
                    </div>
                    <div style="margin-top:10px;">
                        <a href="#" id="restartGame" class="btn">Restart Game</a>
                    </div>
                  </div>
                </div>
            `;
            gameContainer.querySelector('#higherBtn').onclick = (e) => { e.preventDefault(); makeGuess('higher'); };
            gameContainer.querySelector('#lowerBtn').onclick = (e) => { e.preventDefault(); makeGuess('lower'); };
            gameContainer.querySelector('#restartGame').onclick = (e) => { e.preventDefault(); startGame(); };
        }

        function renderLoseScreen(choice, nextCard, usernameLocal, scoreLocal) {
            const companionLine = `${companion} says: "We’ll get them next time!"`;
            gameContainer.innerHTML = `
                <div style="display:flex; justify-content:center; gap:20px; align-items:flex-start;">
                  <div style="flex:0 0 auto; text-align:center;">
                    <img src="https://www.furvilla.com/img/villagers/0/166-2.png" style="height:200px;">
                    <p><em>The Royal Fox laughs at your failure!</em></p>
                    <p><strong>Final Score (${usernameLocal}): ${scoreLocal}</strong></p>
                  </div>

                  <div style="flex:1; text-align:center; font-size:smaller;">
                    <img src="https://www.furvilla.com/static/Aspen%20Things/Royalfoxface.png" style="height:120px; display:block; margin:0 auto 6px;">
                    <label>Royal Fox is amused...</label>
                    <p>You guessed <strong>${choice}</strong>, but the next card was <strong>${nextCard}</strong>.</p>
                    <p>${companionLine}</p>
                    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:8px; font-size:smaller;">
                      <a href="#" id="sendScore" class="btn">Send Score</a>
                      <a href="#" id="restartGame" class="btn">Restart Game</a>
                    </div>
                  </div>
                </div>
            `;
            gameContainer.querySelector('#restartGame').onclick = (e) => { e.preventDefault(); startGame(); };
            gameContainer.querySelector('#sendScore').onclick = (e) => { e.preventDefault(); submitScore(usernameLocal, scoreLocal); };
        }

        function makeGuess(choice) {
            const nextCard = drawCard(currentCard);
            const correct = (choice === 'higher' && nextCard > currentCard) ||
                            (choice === 'lower' && nextCard < currentCard);
            if (correct) {
                score++;
                currentCard = nextCard;
                renderGameUI(`${companion} says: "${randomChatter()}"`);
            } else {
                renderLoseScreen(choice, nextCard, username, score);
            }
        }

        function submitScore(usernameLocal, scoreLocal) {
            const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSdWnR1qVK9MQLOmV_mzL5ZJG74Sv4pSgHkkro3umvnSNfQtVw/formResponse';
            const data = new FormData();
            data.append('entry.635040059', usernameLocal);
            data.append('entry.1309241728', scoreLocal);

            fetch(formUrl, { method: 'POST', body: data, mode: 'no-cors' })
              .then(() => {
                  gameContainer.innerHTML = `
                      <div style="text-align:center;">
                          <p>Score submitted successfully!</p>
                          <a href="#" id="restartGame" class="btn">Play Again</a>
                      </div>
                  `;
                  gameContainer.querySelector('#restartGame').onclick = (e) => { e.preventDefault(); startGame(); };
                  loadLeaderboard();
              })
              .catch(() => {
                  gameContainer.innerHTML = `
                      <div style="text-align:center;">
                          <p>There was an error submitting your score.</p>
                          <a href="#" id="restartGame" class="btn">Restart Game</a>
                      </div>
                  `;
                  gameContainer.querySelector('#restartGame').onclick = (e) => { e.preventDefault(); startGame(); };
              });
        }

        async function loadLeaderboard() {
            const sheetCsvUrl = "https://docs.google.com/spreadsheets/d/1onJ9_DmlBa512bd8gudsHbhtueNk8pp3Aoy0bQhr2xA/export?format=csv";

            leaderboardBox.innerHTML = `
              <table class="table" style="width:100%;">
                <thead>
                  <tr>
                    <th class="friends-user">User</th>
                    <th class="friends-online">Score</th>
                  </tr>
                </thead>
                <tbody id="leaderboard-top"></tbody>
              </table>
              <div id="leaderboard-scroll" style="max-height:200px; overflow-y:auto; border-top:1px solid #ccc; margin-top:8px;">
                <table class="table" style="width:100%; margin:0;">
                  <tbody id="leaderboard-rest"></tbody>
                </table>
              </div>
            `;

            const topBody = document.getElementById('leaderboard-top');
            const restBody = document.getElementById('leaderboard-rest');
            const scrollBox = document.getElementById('leaderboard-scroll');

            try {
                const resp = await fetch(sheetCsvUrl, { cache: 'no-store' });
                const text = await resp.text();

                const rows = text.trim().split("\n").map(r => r.split(","));
                const header = rows[0].map(h => h.trim().toLowerCase());
                const userIndex = header.indexOf('username');
                const scoreIndex = header.indexOf('finalscore');

                const raw = rows.slice(1).map(r => ({
                    Username: (userIndex >= 0 ? r[userIndex] : '').trim(),
                    FinalScore: parseInt((scoreIndex >= 0 ? r[scoreIndex] : '0'), 10)
                })).filter(d => d.Username && !isNaN(d.FinalScore) && d.FinalScore > 0);

                const bestMap = new Map();
                raw.forEach(d => {
                    const existing = bestMap.get(d.Username);
                    if (!existing || d.FinalScore > existing.FinalScore) {
                        bestMap.set(d.Username, d);
                    }
                });

                const data = Array.from(bestMap.values());
                data.sort((a, b) => b.FinalScore - a.FinalScore);

                const makeRow = (rank, user, score) => `
                  <tr class="playground-score-row">
                    <td class="friends-user col-xs-6">
                      ${encodeURIComponent(user)}
                    </td>
                    <td class="friends-online col-xs-6">
                      <span class="playground-score">${score}</span>
                    </td>
                  </tr>
                `;

                topBody.innerHTML = data.slice(0, 10).map((d, i) => makeRow(i + 1, d.Username, d.FinalScore)).join('');
                const rest = data.slice(10);
                if (rest.length) {
                    scrollBox.style.display = 'block';
                    restBody.innerHTML = rest.map((d, i) => makeRow(10 + i + 1, d.Username, d.FinalScore)).join('');
                } else {
                    scrollBox.style.display = 'none';
                }
            } catch (e) {
                leaderboardBox.innerHTML = `
                  <div class="confirm well" style="margin-top:8px;">
                    Error loading leaderboard.
                  </div>
                `;
            }
        }

        btn.addEventListener('click', (e) => { e.preventDefault(); startGame(); });
        loadLeaderboard();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
