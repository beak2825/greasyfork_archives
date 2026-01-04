// ==UserScript==
// @name         NFL - odkazy
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  NFL link na example
// @author       Michal
// @match        https://example.com/?redirected/NFL
// @grant        none
// @license      MIT
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555532/NFL%20-%20odkazy.user.js
// @updateURL https://update.greasyfork.org/scripts/555532/NFL%20-%20odkazy.meta.js
// ==/UserScript==

(async () => {
    'use strict';

    if (document.readyState === 'loading') window.stop();

    document.documentElement.innerHTML = `
        <html>
        <head>
            <meta charset="UTF-8">
            <title>NFL Schedule</title>
        </head>
        <body></body>
        </html>
    `;

    const DEFAULT_WEEK = 11;
    const BASE_URL = 'https://www.cbssports.com';
    const weekDatesCache = {};

    const extractTeamCode = (href) => {
        if (!href) return null;
        const match = href.match(/\/nfl\/teams\/([A-Z]+)\//);
        return match?.[1] || null;
    };

    const formatDate = (dateText) => {
        if (!dateText) return null;
        const date = new Date(dateText);
        if (isNaN(date)) return null;

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}${month}${day}`;
    };

    const getShortDate = (dateText) => {
        if (!dateText) return '';
        const date = new Date(dateText);
        if (isNaN(date)) return '';

        const month = date.toLocaleString('en', { month: 'short' });
        const day = date.getDate();
        return `${month} ${day}`;
    };

    const parseSchedule = (html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const games = [];
        let firstDate = null;

        const tables = doc.querySelectorAll('.TableBaseWrapper');

        for (const table of tables) {
            const dateTitle = table.querySelector('.TableBase-title')?.textContent.trim();
            const date = formatDate(dateTitle);

            if (!firstDate && dateTitle) {
                firstDate = dateTitle;
            }

            const rows = table.querySelectorAll('tbody tr');

            for (const row of rows) {
                const cells = row.querySelectorAll('td');

                const awayLink = cells[0]?.querySelector('a[href*="/nfl/teams/"]');
                const awayCode = extractTeamCode(awayLink?.href);
                const awayName = cells[0]?.querySelector('.TeamName')?.textContent.trim();

                const homeLink = cells[1]?.querySelector('a[href*="/nfl/teams/"]');
                const homeCode = extractTeamCode(homeLink?.href);
                const homeName = cells[1]?.querySelector('.TeamName')?.textContent.trim();

                const time = cells[2]?.querySelector('.CellGame a')?.textContent.trim();

                if (awayCode && homeCode && date) {
                    games.push({
                        away: { code: awayCode, name: awayName },
                        home: { code: homeCode, name: homeName },
                        date,
                        dateText: dateTitle,
                        time: time || 'TBD',
                        liveURL: `${BASE_URL}/nfl/gametracker/live/NFL_${date}_${awayCode}@${homeCode}/`
                    });
                }
            }
        }

        return { games, firstDate };
    };

    const fetchWeek = async (week) => {
        try {
            const url = `${BASE_URL}/nfl/schedule/2025/regular/${week}/`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Fetch failed');
            const html = await response.text();
            return parseSchedule(html);
        } catch (error) {
            console.error('Fetch error:', error);
            return { games: [], firstDate: null };
        }
    };

    const fetchWeekDate = async (week) => {
        if (weekDatesCache[week]) return weekDatesCache[week];

        try {
            const url = `${BASE_URL}/nfl/schedule/2025/regular/${week}/`;
            const response = await fetch(url);
            if (!response.ok) return null;
            const html = await response.text();

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const firstDateElement = doc.querySelector('.TableBase-title');
            const firstDate = firstDateElement?.textContent.trim();

            if (firstDate) {
                weekDatesCache[week] = getShortDate(firstDate);
                return weekDatesCache[week];
            }
        } catch (error) {
            console.error('Error fetching week date:', error);
        }
        return null;
    };

    const createStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                background: #f5f5f5;
                padding: 20px;
            }

            .container {
                max-width: 1000px;
                margin: 0 auto;
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                padding: 30px;
            }

            .header {
                margin-bottom: 25px;
            }

            .header h1 {
                font-size: 28px;
                color: #333;
                margin-bottom: 15px;
            }

            .controls {
                display: flex;
                gap: 10px;
                align-items: center;
            }

            .controls select {
                padding: 8px 12px;
                font-size: 15px;
                border: 1px solid #ddd;
                border-radius: 4px;
                background: white;
                cursor: pointer;
                min-width: 200px;
            }

            .controls select option {
                padding: 5px;
            }

            .controls button {
                padding: 8px 20px;
                font-size: 15px;
                background: #333;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }

            .controls button:hover {
                background: #555;
            }

            .games {
                margin-top: 20px;
            }

            .date-group {
                margin-bottom: 25px;
            }

            .date-header {
                font-size: 16px;
                font-weight: 600;
                color: #333;
                padding: 10px 0;
                border-bottom: 2px solid #eee;
                margin-bottom: 12px;
            }

            .game {
                display: flex;
                align-items: center;
                padding: 12px;
                border-bottom: 1px solid #f0f0f0;
            }

            .game:hover {
                background: #fafafa;
            }

            .game-teams {
                flex: 1;
                display: flex;
                gap: 20px;
            }

            .team {
                min-width: 180px;
            }

            .team-name {
                font-size: 15px;
                color: #333;
            }

            .team-code {
                font-size: 13px;
                color: #999;
                margin-left: 5px;
            }

            .game-time {
                min-width: 100px;
                color: #666;
                font-size: 14px;
            }

            .game-action {
                margin-left: auto;
            }

            .btn-live {
                padding: 6px 16px;
                background: #333;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 13px;
                text-decoration: none;
                display: inline-block;
            }

            .btn-live:hover {
                background: #555;
            }

            .loading {
                text-align: center;
                padding: 40px;
                color: #999;
            }

            .vs {
                color: #999;
                font-size: 13px;
            }
        `;
        document.head.appendChild(style);
    };

    const updateWeekSelect = (currentWeek) => {
        const select = document.getElementById('week-select');
        if (!select) return;

        const selectedValue = select.value;
        select.innerHTML = Array.from({length: 18}, (_, i) => {
            const w = i + 1;
            const dateInfo = weekDatesCache[w] ? ` - ${weekDatesCache[w]}` : '';
            return `<option value="${w}" ${w === currentWeek ? 'selected' : ''}>${w}${dateInfo}</option>`;
        }).join('');
    };

    const renderGames = (data, week) => {
        const container = document.getElementById('app');

        const grouped = data.games.reduce((acc, game) => {
            if (!acc[game.dateText]) acc[game.dateText] = [];
            acc[game.dateText].push(game);
            return acc;
        }, {});

        const gamesHTML = Object.entries(grouped).map(([date, games]) => `
            <div class="date-group">
                <div class="date-header">${date}</div>
                ${games.map(game => `
                    <div class="game">
                        <div class="game-teams">
                            <div class="team">
                                <span class="team-name">${game.away.name}</span>
                                <span class="team-code">${game.away.code}</span>
                            </div>
                            <span class="vs">@</span>
                            <div class="team">
                                <span class="team-name">${game.home.name}</span>
                                <span class="team-code">${game.home.code}</span>
                            </div>
                        </div>
                        <div class="game-time">${game.time}</div>
                        <div class="game-action">
                            <a href="${game.liveURL}" target="_blank" class="btn-live">Live</a>
                        </div>
                    </div>
                `).join('')}
            </div>
        `).join('');

        container.innerHTML = `
            <div class="container">
                <div class="header">
                    <h1>NFL Schedule</h1>
                    <div class="controls">
                        <select id="week-select">
                            ${Array.from({length: 18}, (_, i) => {
                                const w = i + 1;
                                const dateInfo = weekDatesCache[w] ? ` - ${weekDatesCache[w]}` : '';
                                return `<option value="${w}" ${w === week ? 'selected' : ''}>${w}${dateInfo}</option>`;
                            }).join('')}
                        </select>
                        <button id="load-btn">Load</button>
                    </div>
                </div>
                <div class="games">
                    ${data.games.length ? gamesHTML : '<div class="loading">No games found</div>'}
                </div>
            </div>
        `;

        document.getElementById('load-btn').addEventListener('click', async () => {
            const week = parseInt(document.getElementById('week-select').value);
            await loadWeek(week);
        });
    };

    const loadWeek = async (week) => {
        const container = document.getElementById('app');
        container.innerHTML = '<div class="container"><div class="loading">Loading...</div></div>';

        const data = await fetchWeek(week);

        if (data.firstDate) {
            weekDatesCache[week] = getShortDate(data.firstDate);
        }

        renderGames(data, week);
    };

    const preloadWeekDates = async () => {
        for (let i = 1; i <= 18; i++) {
            await fetchWeekDate(i);
            updateWeekSelect(DEFAULT_WEEK);
        }
    };

    const init = async () => {
        createStyles();

        const app = document.createElement('div');
        app.id = 'app';
        document.body.appendChild(app);

        app.innerHTML = '<div class="container"><div class="loading">Loading...</div></div>';

        await loadWeek(DEFAULT_WEEK);

        preloadWeekDates();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();