// ==UserScript==
// @name         FIFA API – full set
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Na stránce timeline API vytvoří tabulku žlutých/červených karet, střídání, skóre a status (bez penalt) a minutáž
// @author       LM + JV
// @match        https://api.fifa.com/api/v3/timelines/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553989/FIFA%20API%20%E2%80%93%20full%20set.user.js
// @updateURL https://update.greasyfork.org/scripts/553989/FIFA%20API%20%E2%80%93%20full%20set.meta.js
// ==/UserScript==

(async function() {

    const urlParts = window.location.pathname.split('/');
    const competitionId = urlParts[4];
    const seasonId = urlParts[5];
    const stageId = urlParts[6];
    const matchId = urlParts[7]?.split('?')[0];

    if (!competitionId || !seasonId || !matchId) {
        console.warn("⚠️ Nepodařilo se načíst ID z URL");
        return;
    }

    const timelineUrl = `https://api.fifa.com/api/v3/timelines/${competitionId}/${seasonId}/${stageId}/${matchId}?language=en`;
    const calendarUrl = `https://api.fifa.com/api/v3/calendar/${competitionId}/${seasonId}/${matchId}?language=en`;

    try {
        const [timelineRes, calendarRes] = await Promise.all([
            fetch(timelineUrl),
            fetch(calendarUrl)
        ]);

        const timelineData = await timelineRes.json();
        const calendarData = await calendarRes.json();

        const homeId = calendarData.Home?.IdTeam;
        const awayId = calendarData.Away?.IdTeam;
        const homeName = calendarData.Home?.ShortClubName || "Home";
        const awayName = calendarData.Away?.ShortClubName || "Away";

        const stats = {
            home: { yellow: 0, red: 0, subs: 0 },
            away: { yellow: 0, red: 0, subs: 0 }
        };

        const events = timelineData.Event || [];

        events.forEach(ev => {
            const team =
                ev.IdTeam === homeId ? "home" :
                ev.IdTeam === awayId ? "away" : null;
            if (!team) return;

            switch (ev.Type) {
                case 2: stats[team].yellow++; break;
                case 3:
                case 4: stats[team].red++; break;
                case 5: stats[team].subs++; break;
            }
        });

        // skóre – poslední event
        const lastEvent = events[events.length - 1] || {};
        const homeScore = lastEvent.HomeGoals ?? 0;
        const awayScore = lastEvent.AwayGoals ?? 0;

        let lastMinute = "";

        if (events.length > 0) {
            const lastMinuteRaw = [...events].reverse().find(e => e.MatchMinute !== undefined)?.MatchMinute;

            if (lastMinuteRaw !== undefined) {
                if (typeof lastMinuteRaw === "number") {
                    lastMinute = Math.floor(lastMinuteRaw) + 1;
                } else {
                    const parts = String(lastMinuteRaw).split(":");
                    const m = parseInt(parts[0]) || 0;
                    lastMinute = m + 1;
                }
            }
        }

        const getStatus = () => {
            if (!events.length) return "";

            const lastStatusEv = [...events].reverse().find(e =>
                [7, 8, 26].includes(e.Type)
            );

            if (!lastStatusEv) return "";
            if (lastStatusEv.Type === 26) return "Konec zápasu";
            if (lastStatusEv.Type === 8 && lastStatusEv.Period === 3) return "Poločas";
            if (lastStatusEv.Type === 8 && lastStatusEv.Period === 5) return "OVĚŘIT - Konec 2. poločasu";
            if (lastStatusEv.Type === 7 && lastStatusEv.Period === 3) return "Start zápasu";
            if (lastStatusEv.Type === 7 && lastStatusEv.Period === 5) return "2.poločas";
            return "Probíhá";
        };

        const status = getStatus();

        // UI box
        const container = document.createElement("div");
        container.style.fontFamily = "Arial, sans-serif";
        container.style.margin = "20px";
        container.style.padding = "10px";
        container.style.border = "2px solid #003366";
        container.style.borderRadius = "10px";
        container.style.background = "#f5f7fb";
        container.style.width = "600px";

        const title = document.createElement("h3");
        title.textContent = `Match Summary: ${homeName} vs ${awayName}`;
        title.style.textAlign = "center";
        title.style.color = "#003366";
        title.style.marginBottom = "10px";

        const table = document.createElement("table");
        table.style.borderCollapse = "collapse";
        table.style.width = "100%";
        table.style.textAlign = "center";
        table.style.fontSize = "14px";

        table.innerHTML = `
            <tr style="background:#003366;color:white;">
                <th style="padding:6px;border:1px solid #ccc;">Team</th>
                <th style="padding:6px;border:1px solid #ccc;">Score</th>
                <th style="padding:6px;border:1px solid #ccc;">Yellow</th>
                <th style="padding:6px;border:1px solid #ccc;">Red</th>
                <th style="padding:6px;border:1px solid #ccc;">Subs</th>
                <th style="padding:6px;border:1px solid #ccc;">Status</th>
                <th style="padding:6px;border:1px solid #ccc;">Minute</th>
            </tr>

            <tr style="background:#ffffff;">
                <td id="home_name" style="padding:6px;border:1px solid #ccc;">${homeName}</td>
                <td id="home_score" style="padding:6px;border:1px solid #ccc;">${homeScore}</td>
                <td id="home_yellowcards" style="padding:6px;border:1px solid #ccc;">${stats.home.yellow}</td>
                <td id="home_redcards" style="padding:6px;border:1px solid #ccc;">${stats.home.red}</td>
                <td id="home_subs" style="padding:6px;border:1px solid #ccc;">${stats.home.subs}</td>

                <td id="match_status" rowspan="2" style="padding:6px;border:1px solid #ccc;">${status}</td>
                <td id="match_minute" rowspan="2" style="padding:6px;border:1px solid #ccc;">${lastMinute}</td>
            </tr>

            <tr style="background:#eef2f7;">
                <td id="away_name" style="padding:6px;border:1px solid #ccc;">${awayName}</td>
                <td id="away_score" style="padding:6px;border:1px solid #ccc;">${awayScore}</td>
                <td id="away_yellowcards" style="padding:6px;border:1px solid #ccc;">${stats.away.yellow}</td>
                <td id="away_redcards" style="padding:6px;border:1px solid #ccc;">${stats.away.red}</td>
                <td id="away_subs" style="padding:6px;border:1px solid #ccc;">${stats.away.subs}</td>
            </tr>
        `;

        container.appendChild(title);
        container.appendChild(table);
        document.body.prepend(container);

    } catch (err) {
        console.error("❌ Chyba při načítání dat:", err);
    }
})();