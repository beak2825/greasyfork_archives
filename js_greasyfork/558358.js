// ==UserScript==
// @name         Soccer Match Calendar Exporter for LiveSoccerTV
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Create .ics calendar events from LiveSoccerTV, with favorite teams, league filters, and quick date navigation.
// @author       Nazmus Sakib
// @match        https://www.livesoccertv.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558358/Soccer%20Match%20Calendar%20Exporter%20for%20LiveSoccerTV.user.js
// @updateURL https://update.greasyfork.org/scripts/558358/Soccer%20Match%20Calendar%20Exporter%20for%20LiveSoccerTV.meta.js
// ==/UserScript==

/*
 * Copyright (c) 2025 Nazmus Sakib
 * Licensed under the MIT License.
 */


(function() {
    'use strict';

    const CONFIG = {
        cartKey: "soccer_cart_v15_items",
        prefKey: "soccer_cart_v15_prefs",
        teamPrefKey: "soccer_cart_v15_team_prefs",
        historyKey: "soccer_cart_v15_history",
        teamHistoryKey: "soccer_cart_v15_team_history",
        defaultDuration: 2
    };

    // --- 0. SEED DATA ---
    const SEED_LEAGUES = [
        "England - Premier League", "Spain - La Liga", "Italy - Serie A", "Germany - Bundesliga",
        "France - Ligue 1", "Europe - UEFA Champions League", "Europe - UEFA Europa League",
        "Europe - UEFA Europa Conference League", "USA - Major League Soccer",
        "Brazil - Brasileirão", "Argentina - Liga Profesional", "Mexico - Liga MX",
        "Netherlands - Eredivisie", "Portugal - Primeira Liga", "Turkey - Super Lig"
    ];
    const SEED_TEAMS = [
        "Real Madrid", "Barcelona", "Manchester United", "Liverpool", "Arsenal", "Chelsea", "Manchester City",
        "Bayern München", "Juventus", "AC Milan", "Inter Milan", "Paris Saint-Germain", "Inter Miami", "Boca Juniors", "River Plate"
    ];

    // --- 1. MEMORY MANAGEMENT ---
    function getCart() { return JSON.parse(localStorage.getItem(CONFIG.cartKey) || "[]"); }
    function addToCart(matchObj) {
        const cart = getCart();
        if (!cart.some(m => m.id === matchObj.id)) {
            cart.push(matchObj);
            localStorage.setItem(CONFIG.cartKey, JSON.stringify(cart));
        }
    }
    function removeFromCart(matchId) {
        const cart = getCart().filter(m => m.id !== matchId);
        localStorage.setItem(CONFIG.cartKey, JSON.stringify(cart));
    }
    function clearCart() { localStorage.removeItem(CONFIG.cartKey); }

    function getPrefs() { return JSON.parse(localStorage.getItem(CONFIG.prefKey) || "[]"); }
    function addPref(name) {
        const list = getPrefs();
        if (!list.includes(name)) { list.push(name); localStorage.setItem(CONFIG.prefKey, JSON.stringify(list)); }
    }
    function removePref(name) {
        localStorage.setItem(CONFIG.prefKey, JSON.stringify(getPrefs().filter(x => x !== name)));
    }

    function getTeamPrefs() { return JSON.parse(localStorage.getItem(CONFIG.teamPrefKey) || "[]"); }
    function addTeamPref(name) {
        const list = getTeamPrefs();
        if (!list.includes(name)) { list.push(name); localStorage.setItem(CONFIG.teamPrefKey, JSON.stringify(list)); }
    }
    function removeTeamPref(name) {
        localStorage.setItem(CONFIG.teamPrefKey, JSON.stringify(getTeamPrefs().filter(x => x !== name)));
    }

    function getKnownLeagues() {
        const set = new Set([...JSON.parse(localStorage.getItem(CONFIG.historyKey) || "[]"), ...SEED_LEAGUES]);
        return Array.from(set).sort();
    }
    function learnLeagues(newItems) {
        const current = getKnownLeagues();
        localStorage.setItem(CONFIG.historyKey, JSON.stringify(Array.from(new Set([...current, ...newItems])).sort()));
    }
    function getKnownTeams() {
        const set = new Set([...JSON.parse(localStorage.getItem(CONFIG.teamHistoryKey) || "[]"), ...SEED_TEAMS]);
        return Array.from(set).sort();
    }
    function learnTeams(newItems) {
        const current = getKnownTeams();
        localStorage.setItem(CONFIG.teamHistoryKey, JSON.stringify(Array.from(new Set([...current, ...newItems])).sort()));
    }

    // --- 2. SCRAPER ---
    function scrapeDataFromDoc(doc, url) {
        let dateBase = null;
        const titleRegex = /:\s+\w+\s+([A-Za-z]{3})\.?\s+(\d{1,2}),\s+(\d{4})/;
        const titleMatch = doc.title.match(titleRegex);

        if (titleMatch) {
            dateBase = new Date(`${titleMatch[1]} ${titleMatch[2]} ${titleMatch[3]}`);
        } else {
            dateBase = new Date();
        }

        const matches = [];
        const leagueCounts = {};
        const teamCounts = {};
        const foundLeagues = new Set();
        const foundTeams = new Set();
        let currentLeague = "General";

        const rows = doc.querySelectorAll('tr');

        rows.forEach(row => {
            if (row.style.display === 'none') return;
            const cells = row.querySelectorAll('td');
            if (cells.length === 0) return;

            const col1 = cells[0].innerText.trim();
            // Ad Filter
            if (col1.includes("adsbygoogle") || col1.includes("window.innerWidth") || col1.includes("{") || col1.includes("}")) return;

            const timeMatch = col1.match(/(\d{1,2}):(\d{2})(am|pm)?/i);
            const isLiveOrStatus = /^(Live|FT|HT|Postp|Canc)/i.test(col1);

            if (timeMatch || isLiveOrStatus) {
                let teams = "";
                let channels = "";
                if (cells.length >= 2) teams = cells[1].innerText.trim();
                if (cells.length >= 3) channels = cells[2].innerText.trim();

                if (teams) {
                    let h = 12, m = 0;
                    if (timeMatch) {
                        h = parseInt(timeMatch[1]);
                        m = parseInt(timeMatch[2]);
                        const mer = timeMatch[3] ? timeMatch[3].toLowerCase() : null;
                        if (mer === 'pm' && h !== 12) h += 12;
                        if (mer === 'am' && h === 12) h = 0;
                    }

                    const matchDate = new Date(dateBase);
                    matchDate.setHours(h, m, 0);
                    const cleanTeams = teams.replace(/\n/g, " ").replace(/\s+/g, " ");

                    const matchObj = {
                        id: `${cleanTeams}_${matchDate.getTime()}`,
                        league: currentLeague,
                        teams: cleanTeams,
                        startTime: matchDate.toISOString(),
                        channels: channels,
                        url: url
                    };
                    matches.push(matchObj);

                    if (!leagueCounts[currentLeague]) leagueCounts[currentLeague] = 0;
                    leagueCounts[currentLeague]++;

                    // Split logic
                    const splitTeams = cleanTeams.split(/\s+(?:vs?|v|\d+\s*-\s*\d+| - )\s+/i);
                    splitTeams.forEach(t => {
                        const tName = t.trim();
                        if (tName.length > 1) {
                            foundTeams.add(tName);
                            if (!teamCounts[tName]) teamCounts[tName] = 0;
                            teamCounts[tName]++;
                        }
                    });
                }
            } else {
                if (col1.length > 3 && !col1.includes("December") && !col1.match(/^\d/)) {
                     const junk = ["Date", "Match", "Time", "Live Soccer", "Newsletter", "Upcoming", "Fubo", "Email:", "reCAPTCHA", "Privacy Policy"];
                     if (!junk.some(j => col1.includes(j))) {
                         currentLeague = col1.replace(/[*|]/g, "").trim();
                         if (!leagueCounts[currentLeague]) leagueCounts[currentLeague] = 0;
                         foundLeagues.add(currentLeague);
                     }
                }
            }
        });

        learnLeagues(Array.from(foundLeagues));
        learnTeams(Array.from(foundTeams));

        return { matches, leagueCounts, teamCounts, dateObj: dateBase };
    }

    // --- 3. TIME TRAVEL ---
    let currentPageData = null;
    let currentDateCursor = new Date();
    let dateCache = {};

    async function loadDate(dateObj) {
        const yyyy = dateObj.getFullYear();
        const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
        const dd = String(dateObj.getDate()).padStart(2, '0');
        const urlDate = `${yyyy}-${mm}-${dd}`;
        const targetUrl = `https://www.livesoccertv.com/schedules/${urlDate}/`;

        if (dateCache[urlDate]) {
            currentPageData = dateCache[urlDate];
            return;
        }

        document.getElementById('lstv-schedule-list').innerHTML = '<div style="padding:40px; text-align:center; color:#666;">⏳ Time Traveling...</div>';

        try {
            const response = await fetch(targetUrl);
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const data = scrapeDataFromDoc(doc, targetUrl);
            currentPageData = data;
            dateCache[urlDate] = data;
        } catch (err) {
            alert("Error: " + err);
        }
    }

    // --- 4. UI BUILDER (Height Fix) ---
    function createUI() {
        if (document.getElementById('lstv-modal')) return;

        const style = document.createElement('style');
        style.innerHTML = `
            #lstv-btn { position: fixed; bottom: 20px; right: 20px; z-index: 999999; padding: 15px; background: #d32f2f; color: white; border-radius: 50%; border: none; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.3); font-size: 24px; transition: transform 0.2s; }
            #lstv-btn:hover { transform: scale(1.1); }
            #lstv-modal { display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.7); z-index: 1000000; justify-content: center; align-items: center; }

            /* FIXED HEIGHT BOX */
            #lstv-content { display: flex; flex-direction: column; width: 950px; height: 650px; background: white; border-radius: 8px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; overflow: hidden; }

            #lstv-tabs { display: flex; background: #f1f1f1; border-bottom: 1px solid #ddd; flex-shrink: 0; }
            .tab-btn { flex: 1; padding: 15px; border: none; background: transparent; cursor: pointer; font-size: 16px; font-weight: bold; color: #555; border-bottom: 3px solid transparent; }
            .tab-btn:hover { background: #e9ecef; }
            .tab-btn.active { color: #d32f2f; border-bottom: 3px solid #d32f2f; background: white; }

            /* CONTENT AREA FILL */
            .tab-view { flex: 1; display: none; overflow: hidden; }
            .tab-view.active { display: flex; }

            /* View 1 */
            #view-schedule { flex-direction: column; height: 100%; width: 100%; }
            #date-nav-bar { display: flex; align-items: center; justify-content: space-between; padding: 10px 15px; background: #343a40; color: white; border-bottom: 1px solid #eee; flex-shrink: 0; }
            .date-nav-btn { background: rgba(255,255,255,0.2); border: none; color: white; padding: 5px 12px; border-radius: 4px; cursor: pointer; font-size: 14px; }
            .date-nav-btn:hover { background: rgba(255,255,255,0.3); }

            #lstv-sidebar { width: 300px; background: #f8f9fa; border-right: 1px solid #ddd; display: flex; flex-direction: column; overflow-y: auto; }
            .sidebar-section-header { padding: 12px; background: #e9ecef; color: #333; font-size: 13px; font-weight: bold; border-bottom: 1px solid #ddd; cursor: pointer; display: flex; justify-content: space-between; user-select: none; }
            .sidebar-section-header:hover { background: #dee2e6; }
            .sidebar-group { display: block; }
            .sidebar-group.collapsed { display: none; }
            #lstv-filters { flex: 1; }
            .filter-row { padding: 8px 12px; cursor: pointer; font-size: 13px; border-bottom: 1px solid #eee; display: flex; align-items: center; }
            .filter-row:hover { background: #e2e6ea; }
            .filter-row input { margin-right: 10px; transform: scale(1.2); }
            .filter-row.fav-highlight { background: #fff8e1; }
            #lstv-schedule-list { flex: 1; overflow-y: auto; padding: 0; background: #fff; }

            .match-item { padding: 12px 15px; border-bottom: 1px solid #eee; display: flex; align-items: center; background: white; }
            .match-item:hover { background: #f8f9fa; }
            .match-cb { margin-right: 15px; transform: scale(1.3); cursor: pointer; }
            .match-info { flex: 1; }
            .match-league { font-size: 11px; color: #d32f2f; text-transform: uppercase; font-weight: bold; margin-bottom: 2px; }
            .match-teams { font-weight: 600; font-size: 15px; color: #333; }
            .match-time { font-size: 12px; color: #666; margin-top: 2px; }

            /* Prefs */
            #view-prefs { flex-direction: column; padding: 20px; background: #fafafa; overflow-y: auto; width: 100%; }
            .pref-container { max-width: 700px; margin: 0 auto; width: 100%; display: flex; gap: 20px; }
            .pref-col { flex: 1; background: white; padding: 15px; border-radius: 8px; border: 1px solid #ddd; }
            .pref-search-box { width: 100%; padding: 10px; font-size: 14px; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 5px; box-sizing: border-box; }
            .search-results-container { border: 1px solid #ddd; max-height: 150px; overflow-y: auto; background: white; margin-bottom: 15px; display: none; }
            .search-result { padding: 8px; border-bottom: 1px solid #eee; cursor: pointer; font-size: 13px; }
            .search-result:hover { background: #f1f1f1; }
            .pref-item { display: flex; justify-content: space-between; align-items: center; padding: 8px; border-bottom: 1px solid #eee; font-size: 13px; }
            .pref-item button { background: #ff6b6b; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 11px; }

            /* Cart */
            #view-cart { flex-direction: column; width: 100%; overflow-y: auto; background: #fafafa; padding: 20px; box-sizing: border-box; }
            .cart-date-group { background: white; border: 1px solid #ddd; border-radius: 8px; margin-bottom: 20px; overflow: hidden; flex-shrink: 0; }
            .cart-date-header { position: sticky; top: 0; z-index: 10; background: #343a40; color: white; padding: 10px 15px; font-weight: bold; font-size: 14px; }

            #lstv-footer { padding: 15px 20px; border-top: 1px solid #ddd; background: #f8f9fa; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }
            .btn { padding: 10px 20px; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 14px; }
            .btn-green { background: #28a745; color: white; }
            .btn-red { background: #dc3545; color: white; }
            .btn-gray { background: #6c757d; color: white; }
        `;
        document.head.appendChild(style);

        const btn = document.createElement('button');
        btn.id = 'lstv-btn';
        btn.innerHTML = '📅';
        document.body.appendChild(btn);

        const modal = document.createElement('div');
        modal.id = 'lstv-modal';
        modal.innerHTML = `
            <div id="lstv-content">
                <div id="lstv-tabs">
                    <button class="tab-btn active" id="tab-schedule">📅 Daily Schedule</button>
                    <button class="tab-btn" id="tab-cart">🛒 My Basket <span id="cart-badge">(0)</span></button>
                    <button class="tab-btn" id="tab-prefs">⚙️ Preferences</button>
                </div>

                <div id="view-schedule" class="tab-view active">
                    <div id="date-nav-bar">
                        <button class="date-nav-btn" id="prev-day">◀ Prev Day</button>
                        <div id="date-display">Loading...</div>
                        <button class="date-nav-btn" id="next-day">Next Day ▶</button>
                    </div>
                    <div style="flex:1; display:flex; overflow:hidden;">
                        <div id="lstv-sidebar">
                            <div id="lstv-filters"></div>
                        </div>
                        <div id="lstv-schedule-list"></div>
                    </div>
                </div>

                <div id="view-cart" class="tab-view"></div>

                <div id="view-prefs" class="tab-view">
                    <div class="pref-container">
                        <div class="pref-col">
                            <h3>⭐ Leagues</h3>
                            <input type="text" id="pref-league-search" class="pref-search-box" placeholder="Add League (e.g. Premier League)">
                            <div id="pref-league-results" class="search-results-container"></div>
                            <div id="pref-league-list"></div>
                        </div>
                        <div class="pref-col">
                            <h3>⚽ Teams</h3>
                            <input type="text" id="pref-team-search" class="pref-search-box" placeholder="Add Team (e.g. Real Madrid)">
                            <div id="pref-team-results" class="search-results-container"></div>
                            <div id="pref-team-list"></div>
                        </div>
                    </div>
                </div>

                <div id="lstv-footer">
                    <div><button class="btn btn-red" id="clear-all">Empty Basket</button></div>
                    <div>
                        <button class="btn btn-gray" id="close-modal">Continue Browsing</button>
                        <button class="btn btn-green" id="dl-ics">Download ICS</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        function renderFilters() {
            const container = document.getElementById('lstv-filters');
            container.innerHTML = '';
            const leaguePrefs = getPrefs();
            const teamPrefs = getTeamPrefs();
            const allPageLeagues = Object.keys(currentPageData.leagueCounts);

            function createSection(title, type, items) {
                const header = document.createElement('div');
                header.className = 'sidebar-section-header';
                header.innerHTML = `<span>${title}</span> <span>▼</span>`;
                const group = document.createElement('div');
                group.className = 'sidebar-group';
                header.addEventListener('click', () => {
                    group.classList.toggle('collapsed');
                    header.querySelector('span:last-child').innerText = group.classList.contains('collapsed') ? '▶' : '▼';
                });
                container.appendChild(header);
                container.appendChild(group);

                if (items.length === 0) {
                    const empty = document.createElement('div');
                    empty.style.padding = "10px";
                    empty.style.color = "#999";
                    empty.style.fontSize = "12px";
                    empty.innerText = "(None)";
                    group.appendChild(empty);
                } else {
                    items.forEach(item => {
                        const count = type === 'team'
                            ? (currentPageData.teamCounts[item] || 0)
                            : (currentPageData.leagueCounts[item] || 0);
                        const row = document.createElement('div');
                        row.className = `filter-row ${type === 'fav-league' || type === 'team' ? 'fav-highlight' : ''}`;
                        row.innerHTML = `<input type="checkbox" value="${item}" class="${type === 'team' ? 'tm-cb' : 'lg-cb'}"> <span>${item} <span style="color:#666;">(${count})</span></span>`;
                        if (count === 0) {
                            row.querySelector('input').disabled = true;
                            row.style.opacity = "0.6";
                        } else {
                            row.querySelector('input').addEventListener('change', renderScheduleList);
                        }
                        group.appendChild(row);
                    });
                }
            }

            createSection('⭐ Favorite Teams', 'team', teamPrefs.sort());
            createSection('⭐ Favorite Leagues', 'fav-league', leaguePrefs.sort());
            const otherLeagues = allPageLeagues.filter(l => !leaguePrefs.includes(l)).sort();
            createSection('All Other Leagues', 'league', otherLeagues);
        }

        // --- UPDATED RENDER SCHEDULE (AND LOGIC) ---
        function renderScheduleList() {
            const container = document.getElementById('lstv-schedule-list');
            container.innerHTML = '';

            const checkedLeagues = Array.from(document.querySelectorAll('.lg-cb:checked')).map(c => c.value);
            const checkedTeams = Array.from(document.querySelectorAll('.tm-cb:checked')).map(c => c.value);
            const cart = getCart();

            const hasLeagues = checkedLeagues.length > 0;
            const hasTeams = checkedTeams.length > 0;

            if (!hasLeagues && !hasTeams) {
                container.innerHTML = '<div style="padding:40px; color:#ccc; text-align:center;">Select a team or league on the left</div>';
                return;
            }

            currentPageData.matches.forEach(m => {
                const leagueMatch = !hasLeagues || checkedLeagues.includes(m.league);
                const teamMatch = !hasTeams || checkedTeams.some(t => m.teams.includes(t));

                if (leagueMatch && teamMatch) {
                    const isChecked = cart.some(c => c.id === m.id);
                    const row = document.createElement('div');
                    row.className = 'match-item';
                    row.innerHTML = `
                        <input type="checkbox" class="match-cb" ${isChecked?'checked':''}>
                        <div class="match-info">
                            <div class="match-league">${m.league}</div>
                            <div class="match-teams">${m.teams}</div>
                            <div class="match-time">📺 ${m.channels || "No info"} • ${new Date(m.startTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
                        </div>
                    `;
                    row.querySelector('.match-cb').addEventListener('change', (e) => {
                        if(e.target.checked) addToCart(m);
                        else removeFromCart(m.id);
                        updateBadges();
                    });
                    container.appendChild(row);
                }
            });
        }

        function setupSearch(inputId, resultsId, listId, getFn, addFn, removeFn, sourceFn) {
            const input = document.getElementById(inputId);
            const results = document.getElementById(resultsId);
            const listEl = document.getElementById(listId);

            function render() {
                listEl.innerHTML = '';
                getFn().sort().forEach(item => {
                    const row = document.createElement('div');
                    row.className = 'pref-item';
                    row.innerHTML = `<span>${item}</span> <button>Remove</button>`;
                    row.querySelector('button').addEventListener('click', () => { removeFn(item); render(); });
                    listEl.appendChild(row);
                });
            }

            input.addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase();
                results.innerHTML = '';
                if (term.length < 2) { results.style.display = 'none'; return; }
                const matches = sourceFn().filter(x => x.toLowerCase().includes(term));
                if (matches.length > 0) {
                    results.style.display = 'block';
                    matches.forEach(m => {
                        const div = document.createElement('div');
                        div.className = 'search-result';
                        div.innerText = m;
                        div.addEventListener('click', () => {
                            addFn(m);
                            render();
                            input.value = '';
                            results.style.display = 'none';
                        });
                        results.appendChild(div);
                    });
                } else { results.style.display = 'none'; }
            });
            render();
        }

        function updateDateUI() {
            document.getElementById('date-display').innerText = currentDateCursor.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
            renderFilters();
            document.getElementById('lstv-schedule-list').innerHTML = '<div style="padding:40px; color:#ccc; text-align:center;">Select a filter</div>';
        }
        async function changeDate(offset) {
            currentDateCursor.setDate(currentDateCursor.getDate() + offset);
            await loadDate(currentDateCursor);
            updateDateUI();
        }
        function updateBadges() { document.getElementById('cart-badge').innerText = `(${getCart().length})`; }

        function renderCart() {
            const container = document.getElementById('view-cart');
            container.innerHTML = '';
            const cart = getCart();
            if (cart.length === 0) { container.innerHTML = '<div style="text-align:center; color:#999; margin-top:100px;">Basket is empty.</div>'; return; }
            const grouped = {};
            cart.forEach(m => {
                const d = new Date(m.startTime).toLocaleDateString(undefined, {weekday:'long', month:'short', day:'numeric'});
                if (!grouped[d]) grouped[d] = [];
                grouped[d].push(m);
            });
            Object.keys(grouped).sort((a,b) => new Date(grouped[a][0].startTime) - new Date(grouped[b][0].startTime)).forEach(dateStr => {
                const groupDiv = document.createElement('div');
                groupDiv.className = 'cart-date-group';
                groupDiv.innerHTML = `<div class="cart-date-header">${dateStr}</div>`;
                grouped[dateStr].forEach(m => {
                    const row = document.createElement('div');
                    row.className = 'match-item';
                    row.innerHTML = `<input type="checkbox" class="match-cb" checked><div class="match-info"><div class="match-league">${m.league}</div><div class="match-teams">${m.teams}</div><div class="match-time">${new Date(m.startTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div></div>`;
                    row.querySelector('.match-cb').addEventListener('change', () => { removeFromCart(m.id); renderCart(); updateBadges(); });
                    groupDiv.appendChild(row);
                });
                container.appendChild(groupDiv);
            });
        }

        const tabs = {
            schedule: { btn: document.getElementById('tab-schedule'), view: document.getElementById('view-schedule') },
            cart: { btn: document.getElementById('tab-cart'), view: document.getElementById('view-cart') },
            prefs: { btn: document.getElementById('tab-prefs'), view: document.getElementById('view-prefs') }
        };
        function switchTab(name) {
            Object.values(tabs).forEach(t => { t.btn.classList.remove('active'); t.view.classList.remove('active'); });
            tabs[name].btn.classList.add('active');
            tabs[name].view.classList.add('active');
            if(name === 'schedule') { renderFilters(); renderScheduleList(); }
            if(name === 'cart') renderCart();
            if(name === 'prefs') {
                setupSearch('pref-league-search', 'pref-league-results', 'pref-league-list', getPrefs, addPref, removePref, getKnownLeagues);
                setupSearch('pref-team-search', 'pref-team-results', 'pref-team-list', getTeamPrefs, addTeamPref, removeTeamPref, getKnownTeams);
            }
        }
        tabs.schedule.btn.addEventListener('click', () => switchTab('schedule'));
        tabs.cart.btn.addEventListener('click', () => switchTab('cart'));
        tabs.prefs.btn.addEventListener('click', () => switchTab('prefs'));
        document.getElementById('prev-day').addEventListener('click', () => changeDate(-1));
        document.getElementById('next-day').addEventListener('click', () => changeDate(1));
        document.getElementById('lstv-btn').addEventListener('click', () => {
            currentPageData = scrapeDataFromDoc(document, window.location.href);
            currentDateCursor = currentPageData.dateObj;
            updateDateUI(); updateBadges(); switchTab('schedule');
            document.getElementById('lstv-modal').style.display = 'flex';
        });
        document.getElementById('close-modal').addEventListener('click', () => document.getElementById('lstv-modal').style.display = 'none');
        document.getElementById('clear-all').addEventListener('click', () => { if(confirm("Empty Basket?")) { clearCart(); renderCart(); updateBadges(); } });
        document.getElementById('dl-ics').addEventListener('click', () => {
            const cart = getCart(); if(cart.length === 0) return alert("Empty!");
            const formatDate = (d) => d.toISOString().replace(/-|:|\.\d+/g, "");
            let events = cart.map(m => `BEGIN:VEVENT\nUID:${m.id}\nDTSTAMP:${formatDate(new Date())}\nDTSTART:${formatDate(new Date(m.startTime))}\nDTEND:${formatDate(new Date(new Date(m.startTime).getTime() + CONFIG.defaultDuration*3600000))}\nSUMMARY:${m.teams} (${m.league})\nDESCRIPTION:Streaming: ${m.channels} \\n\\nSource: ${m.url}\nCATEGORIES:Soccer\nTRANSP:TRANSPARENT\nCLASS:PRIVATE\nEND:VEVENT`).join('\n');
            const blob = new Blob([`BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Soccer//EN\n${events}\nEND:VCALENDAR`], {type:'text/calendar'});
            const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `Soccer_Basket.ics`; document.body.appendChild(link); link.click(); document.body.removeChild(link);
        });
    }

    setTimeout(createUI, 1000);
})();