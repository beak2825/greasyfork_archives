// ==UserScript==
// @name         Live.hockey.no – tabulka zápasů
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Vytváří tabulku zápasů z proklikaných zápasů
// @author       LM
// @match        https://live.hockey.no/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557121/Livehockeyno%20%E2%80%93%20tabulka%20z%C3%A1pas%C5%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/557121/Livehockeyno%20%E2%80%93%20tabulka%20z%C3%A1pas%C5%AF.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'livehockey_matches_v1';
    let lastClickedCardInfo = null;

    // Spuštění tak, aby fungovalo i když je script načtený až PO onload
    function start() {
        initUi();
        hookPushState();
        attachGlobalClickListener();
        console.log('Live.hockey script ready ✅');
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        // stránka už je načtená → start rovnou
        start();
    } else {
        // stránka se ještě načítá → počkáme na load
        window.addEventListener('load', start);
    }

    // --------------------------------------------------------------
    // UI
    // --------------------------------------------------------------

    function initUi() {
        const btnTable = document.createElement('button');
        btnTable.textContent = 'Zobrazit tabulku zápasů';
        styleBtn(btnTable);
        btnTable.style.left = '10px';
        btnTable.addEventListener('click', () => {
            showTableFromStorage();
            clearLogButKeepTable();
        });
        document.body.appendChild(btnTable);

        const btnClear = document.createElement('button');
        btnClear.textContent = 'Reset logu';
        styleBtn(btnClear);
        btnClear.style.left = '210px';
        btnClear.addEventListener('click', clearLoggedMatches);
        document.body.appendChild(btnClear);
    }

    function styleBtn(btn) {
        btn.style.position = 'fixed';
        btn.style.top = '10px';
        btn.style.zIndex = '9999';
        btn.style.padding = '6px 10px';
        btn.style.borderRadius = '6px';
        btn.style.border = '1px solid #333';
        btn.style.background = '#ffd54f';
        btn.style.fontWeight = 'bold';
        btn.style.cursor = 'pointer';
    }

    // --------------------------------------------------------------
    // Storage helpers (sessionStorage)
    // --------------------------------------------------------------

    function loadMatches() {
        try {
            const raw = sessionStorage.getItem(STORAGE_KEY);
            if (!raw) return [];
            const arr = JSON.parse(raw);
            return Array.isArray(arr) ? arr : [];
        } catch (e) {
            console.warn('loadMatches error:', e);
            return [];
        }
    }

    function saveMatches(arr) {
        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
        } catch (e) {
            console.warn('saveMatches error:', e);
        }
    }

    function upsertMatch(record) {
        const matches = loadMatches();
        const idx = matches.findIndex(m => m.matchId === record.matchId);
        if (idx >= 0) {
            matches[idx] = record;
        } else {
            matches.push(record);
        }
        saveMatches(matches);
    }

    // --------------------------------------------------------------
    // HOOK pushState
    // --------------------------------------------------------------

    function hookPushState() {
        const orig = history.pushState;
        history.pushState = function (state, title, url) {
            try {
                const u = new URL(url, location.origin);

                if (u.pathname.startsWith('/livematch') || u.pathname.startsWith('/match')) {
                    const matchId = u.searchParams.get('matchId');
                    const matchDate = u.searchParams.get('matchDate');

                    if (matchId) {
                        saveMatchFromNavigation(matchId, matchDate);
                    }
                }
            } catch (e) {
                console.warn('pushState error:', e);
            }

            return orig.apply(this, arguments);
        };
    }

    function saveMatchFromNavigation(matchId, matchDate) {
        const base = lastClickedCardInfo || {};
        const record = {
            matchId,
            matchDate: matchDate || '',
            home: base.home || '',
            away: base.away || '',
            datetime: base.datetime || '',
            savedAt: new Date().toISOString()
        };

        upsertMatch(record);
        console.log('💾 Uložen zápas:', record);
    }

    // --------------------------------------------------------------
    // CLICK LISTENER
    // --------------------------------------------------------------

    function attachGlobalClickListener() {
        document.addEventListener('click', (e) => {
            const card = e.target.closest('.slider-card');
            if (!card) return;

            const container = card.querySelector('.v-container');
            if (!container) return;

            const rows = container.querySelectorAll('.v-row');

            const home = rows[0]?.querySelector('.team-name')?.textContent.trim() || '';
            const away = rows[1]?.querySelector('.team-name')?.textContent.trim() || '';
            const dt   = rows[2]?.querySelector('.date p')?.textContent.trim() || '';

            lastClickedCardInfo = { home, away, datetime: dt };

            console.log('Klik na kartu:', lastClickedCardInfo);
        }, true);
    }

    // --------------------------------------------------------------
    // STORAGE & TABLE
    // --------------------------------------------------------------

    function showTableFromStorage() {
        const matches = loadMatches();

        if (!matches.length) {
            alert('Nemám uložené žádné zápasy.');
            return;
        }

        matches.sort((a, b) => (a.savedAt || '').localeCompare(b.savedAt || ''));

        renderTable(matches);
    }

    function clearLoggedMatches() {
        sessionStorage.removeItem(STORAGE_KEY);
        alert('Log vymazán.');
    }

    function clearLogButKeepTable() {
        sessionStorage.removeItem(STORAGE_KEY);
        console.log('Auto-clear: log vymazán po vykreslení tabulky.');
    }

    // --------------------------------------------------------------
    // TABLE DRAWING
    // --------------------------------------------------------------

    function renderTable(matches) {
        const old = document.getElementById('lh-logged-matches');
        if (old) old.remove();

        const container = document.createElement('div');
        container.id = 'lh-logged-matches';
        container.style.position = 'relative';
        container.style.zIndex = '9998';
        container.style.margin = '80px auto 20px auto';
        container.style.maxWidth = '1000px';
        container.style.background = 'white';
        container.style.border = '1px solid #ccc';
        container.style.borderRadius = '8px';
        container.style.padding = '10px';
        container.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';

        const title = document.createElement('h2');
        title.textContent = 'Zalogované zápasy';
        title.style.textAlign = 'center';
        title.style.marginBottom = '10px';
        title.style.fontSize = '18px';
        container.appendChild(title);

        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.style.fontSize = '14px';

        const thead = document.createElement('thead');
        const hr = document.createElement('tr');
        ['Datum/čas', 'Domácí', 'Hosté', 'matchId', 'Hokej', 'Statistiky'].forEach(h => {
            const th = document.createElement('th');
            th.textContent = h;
            th.style.borderBottom = '1px solid #ccc'; // FIX uvozovek
            th.style.padding = '6px';
            th.style.background = '#f5f5f5';
            hr.appendChild(th);
        });
        thead.appendChild(hr);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');

        matches.forEach(m => {
            const tr = document.createElement('tr');

            addCell(tr, m.datetime);
            addCell(tr, m.home);
            addCell(tr, m.away);
            addCell(tr, m.matchId);

            const lm  = makeLivematchUrl(m.matchId, m.matchDate);
            const pbp = makePlayByPlayUrl(m.matchId, m.matchDate);

            // POŘADÍ: Hokej (play-by-play), Statistiky (livematch)
            addLinkCell(tr, pbp, 'LIVE URL Hokej');
            addLinkCell(tr, lm, 'LIVE URL - Statistiky');

            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        container.appendChild(table);
        document.body.insertBefore(container, document.body.firstChild);
    }

    function addCell(tr, text) {
        const td = document.createElement('td');
        td.textContent = text || '';
        td.style.padding = '4px';
        tr.appendChild(td);
    }

    function addLinkCell(tr, url, label) {
        const td = document.createElement('td');
        td.style.padding = '4px';
        const a = document.createElement('a');
        a.href = url;
        a.textContent = label;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        td.appendChild(a);
        tr.appendChild(td);
    }

    // --------------------------------------------------------------
    // URL GENERATORS (RAW matchDate)
    // --------------------------------------------------------------

    function makeLivematchUrl(matchId, matchDate) {
        const params = new URLSearchParams(location.search);
        const seasonId = params.get('seasonId') || '';
        const tournamentId = params.get('tournamentId') || '';

        let url = 'https://live.hockey.no/livematch?';

        if (seasonId) url += 'seasonId=' + encodeURIComponent(seasonId) + '&';
        if (tournamentId) url += 'tournamentId=' + encodeURIComponent(tournamentId) + '&';

        url += 'matchId=' + encodeURIComponent(matchId);

        // matchDate necháme raw kvůli dvojtečkám
        if (matchDate) url += '&matchDate=' + matchDate + '&tab=3';

        return url;
    }

    function makePlayByPlayUrl(matchId, matchDate) {
        return makeLivematchUrl(matchId, matchDate) + '&tab=1';
    }

})();