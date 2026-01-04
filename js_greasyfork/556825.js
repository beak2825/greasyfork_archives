// ==UserScript==
// @name         Being Score Fixer
// @namespace    http://tampermonkey.net/
// @version      2025-11-24
// @description  Fix match scores on beingesports team pages
// @author       You
// @match        https://www.beingesports.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=beingesports.com
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556825/Being%20Score%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/556825/Being%20Score%20Fixer.meta.js
// ==/UserScript==

async function extractMatchData() {
    const res = await new Promise(resolve => {
        GM_xmlhttpRequest({
            method: "GET",
            url: window.location.href.replace(/\/teams\/\d+$/, "/spiele"),
            onload: resolve
        });
    });

    const doc = new DOMParser().parseFromString(res.responseText, "text/html");
    const scheduleData = {};

    // 1. Select all day containers (identified by their specific background color class)
    const dayBlocks = doc.querySelectorAll('.bg-\\[rgba\\(255\\,255\\,255\\,\\.02\\)\\]');

    dayBlocks.forEach(block => {
        // 2. Extract the date header
        const dateHeader = block.querySelector('h2');
        if (!dateHeader) return;
        const date = dateHeader.innerText.trim();

        scheduleData[date] = [];

        // 3. Select all match rows within this day
        // We target the flex container that holds the two teams and the VS middle section
        const matchRows = block.querySelectorAll('.flex.w-full.justify-between.gap-x-8.sm\\:flex-row');

        matchRows.forEach(row => {
            try {
                // 4. Extract Teams (Usually inside <a> tags linking to team pages)
                // We fallback to looking for .opacity-40 for "TBD" placeholders
                const teamLinks = row.querySelectorAll('a[href*="/teams/"]');
                const tbdPlaceholders = row.querySelectorAll('.opacity-40'); // For TBD teams

                let team1Name = teamLinks[0] ? teamLinks[0].innerText.trim() : (tbdPlaceholders[0] ? tbdPlaceholders[0].innerText.trim() : "Unknown");
                let team2Name = teamLinks[1] ? teamLinks[1].innerText.trim() : (tbdPlaceholders[1] ? tbdPlaceholders[1].innerText.trim() : "Unknown");

                // 5. Extract Scores (Inside divs with text-2xl class)
                const scoreElements = row.querySelectorAll('.text-2xl');
                const score1 = scoreElements[0] ? parseInt(scoreElements[0].innerText.trim()) : 0;
                const score2 = scoreElements[1] ? parseInt(scoreElements[1].innerText.trim()) : 0;

                // 6. Extract Time (Located in the middle column between "VS" and the stream icon)
                let time = "";
                const middleCol = row.querySelector('.flex.flex-col.text-center');
                if (middleCol) {
                    const divs = middleCol.querySelectorAll('div');
                    // Loop to find the div that contains a colon (e.g., 19:00)
                    for (let div of divs) {
                        if (div.innerText.includes(':')) {
                            time = div.innerText.trim();
                            break;
                        }
                    }
                }

                scheduleData[date].push({
                    team1: team1Name,
                    score1: score1,
                    team2: team2Name,
                    score2: score2,
                    time: time
                });

            } catch (err) {
                console.error("Error parsing specific match row:", err);
            }
        });
    });

    return scheduleData;
}

async function fixScores() {
    if (!/^https:\/\/www\.beingesports\.com\/de\/dota2\/\d+\/teams\/\d+$/.test(window.location.href)) {
        return;
    }
    const allMatches = await extractMatchData();

    const h1 = document.querySelector('h1');
    if (!h1) return;
    const currentTeamName = h1.innerText.trim().toUpperCase();

    const correctMatches = [];
    for (const [date, matches] of Object.entries(allMatches)) {
        const teamMatches = matches.filter(match => match.team1.toUpperCase().includes(currentTeamName) || match.team2.toUpperCase().includes(currentTeamName));
        if (teamMatches.length > 0) {
            correctMatches.push(teamMatches.pop());
        }
    }
    console.log("Gefundene Matches für Team", currentTeamName, correctMatches);

    const matchesGrid = document.querySelector('.grid-cols-teamMatches');
    if (!matchesGrid) return;

    const children = Array.from(matchesGrid.children);

    children.forEach((element) => {
        if (element.tagName === 'A') {
            const opponentName = element.innerText.trim();
            const scoreDiv = element.nextElementSibling;

            if (!scoreDiv || !scoreDiv.innerText.includes('-')) {
                return;
            }

            const matchData = correctMatches.find(m =>
                (m.team1.toUpperCase() === currentTeamName && m.team2.toUpperCase() === opponentName.toUpperCase()) ||
                (m.team2.toUpperCase() === currentTeamName && m.team1.toUpperCase() === opponentName.toUpperCase())
            );

            if (matchData) {
                let ownScore, enemyScore;

                if (matchData.team1.toUpperCase() === currentTeamName) {
                    ownScore = matchData.score1;
                    enemyScore = matchData.score2;
                } else {
                    ownScore = matchData.score2;
                    enemyScore = matchData.score1;
                }

                if (ownScore !== undefined && enemyScore !== undefined) {
                    const ownClass = ownScore > enemyScore ? "text-primary-400" : "";
                    const enemyClass = enemyScore > ownScore ? "text-primary-400" : "";

                    scoreDiv.innerHTML = `<span class="${ownClass}">${ownScore}</span>&nbsp;-&nbsp;<span class="${enemyClass}">${enemyScore}</span>`;
                } else if (matchData.time) {
                    scoreDiv.innerHTML = `<span class="text-white/50">${matchData.time}</span>`;
                }
            }
        }
    });
}

(async function() {
    'use strict';
    function wrap(type) {
        const orig = history[type];
        return function (...args) {
            const result = orig.apply(this, args);
            window.dispatchEvent(new Event(type));
            return result;
        };
    }

    history.pushState = wrap('pushState');
    history.replaceState = wrap('replaceState');

    setTimeout(() => fixScores(), 500);
    window.addEventListener('pushState', () => setTimeout(fixScores, 500));
    window.addEventListener('replaceState', () => setTimeout(fixScores, 500));
    window.addEventListener('popstate', () => setTimeout(fixScores, 500));
})();