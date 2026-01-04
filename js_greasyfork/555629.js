// ==UserScript==
// @name         Glomdalen - api tabulka (incidenty + status)
// @namespace    http://tampermonkey.net/
// @version      5
// @description  Ligové zápasy, incidenty, status
// @author       LM
// @license      MIT
// @match        https://v3api.nifs.no/matches/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555629/Glomdalen%20-%20api%20tabulka%20%28incidenty%20%2B%20status%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555629/Glomdalen%20-%20api%20tabulka%20%28incidenty%20%2B%20status%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const normalize = s => s?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

    fetch(location.href)
        .then(r => r.text())
        .then(t => {
            let txt = t.trim();
            txt = txt.substring(txt.indexOf("{"), txt.lastIndexOf("}") + 1);

            let data = JSON.parse(txt);

            // 🟦 TEAM PARSING
            let home = data.homeTeam;
            let away = data.awayTeam;

            if (!home && Array.isArray(data.teams)) {
                const h = data.teams.find(t => t.side === "home");
                const a = data.teams.find(t => t.side === "away");
                if (h) home = h.team;
                if (a) away = a.team;
            }

            if (!home || !away) {
                console.warn("Cannot detect teams");
                return;
            }

            const homeName = home.name;
            const awayName = away.name;

            const normHome = normalize(homeName);
            const normAway = normalize(awayName);

            // 🟦 BASE STATS
            const stats = {
                home: {
                    name: homeName,
                    goals: 0,
                    subs: 0,
                    yellow: home.matchStatistics?.yellowCards ?? 0,
                    red: home.matchStatistics?.redCards ?? 0
                },
                away: {
                    name: awayName,
                    goals: 0,
                    subs: 0,
                    yellow: away.matchStatistics?.yellowCards ?? 0,
                    red: away.matchStatistics?.redCards ?? 0
                }
            };

            const events = data.matchEvents || [];

            // 🟦 STATUS
            let status = "";

            const goalTypes = [2];

            for (const ev of events) {

                // 📌 STATUS– team is null → must not filter by team
                switch (ev.matchEventTypeId) {
                    case 14: status = "Start zápasu"; break;
                    case 15: status = "Poločas"; break;
                    case 26: status = "2. poločas"; break;
                    case 16: status = "Konec zápasu"; break;
                    case 17: status = "Konec zápasu"; break;
                }

                if (!ev.team?.name) continue;

                const teamNorm = normalize(ev.team.name);
                let side = null;

                if (teamNorm === normHome) side = "home";
                else if (teamNorm === normAway) side = "away";
                else continue;

                // 📌 GOALS
                if (goalTypes.includes(ev.matchEventTypeId)) {
                    stats[side].goals++;
                }

                // 📌 SUBSTITUTIONS
                if (ev.matchEventTypeId === 23) {
                    stats[side].subs++;
                }
            }

            // 🟦 TABLE RENDER
            const table = document.createElement("table");
            table.style.cssText = `
                margin:20px auto;
                border-collapse:collapse;
                background:#fff;
                box-shadow:0 2px 6px rgba(0,0,0,0.2);
                font-family:sans-serif;
                min-width:500px;
                text-align:center;
            `;

            table.innerHTML = `
<tr style="background:#eee;font-weight:bold;">
  <th>Tým</th><th>Góly</th><th>Střídání</th><th>Žluté</th><th>Červené</th>
</tr>
<tr>
  <td id="home_team">${stats.home.name}</td>
  <td id="home_goals">${stats.home.goals}</td>
  <td id="home_subs">${stats.home.subs}</td>
  <td id="home_yellowcards">${stats.home.yellow}</td>
  <td id="home_redcards">${stats.home.red}</td>
</tr>
<tr style="background:#f7f7f7;">
  <td id="away_team">${stats.away.name}</td>
  <td id="away_goals">${stats.away.goals}</td>
  <td id="away_subs">${stats.away.subs}</td>
  <td id="away_yellowcards">${stats.away.yellow}</td>
  <td id="away_redcards">${stats.away.red}</td>
</tr>
<tr>
  <td colspan="2" style="font-weight:bold;">Status:</td>
  <td colspan="3" id="status_value">${status}</td>
</tr>`;

            document.body.prepend(table);

        });
})();
