// ==UserScript==
// @name         TVF Maç Takvimi → vlastní Canlı Skor tabulka + hard refresh
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Přímo na TVF MacTakvim vytvoří vlastní tabulku z Canlı Skor, řádky označí ID HOME_AWAY a každých 8s reloadne stránku
// @author       LM
// @match        https://fikstur.tvf.org.tr/MacTakvim/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556662/TVF%20Ma%C3%A7%20Takvimi%20%E2%86%92%20vlastn%C3%AD%20Canl%C4%B1%20Skor%20tabulka%20%2B%20hard%20refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/556662/TVF%20Ma%C3%A7%20Takvimi%20%E2%86%92%20vlastn%C3%AD%20Canl%C4%B1%20Skor%20tabulka%20%2B%20hard%20refresh.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function normalizeTeamName(name) {
        return name
            .trim()
            .replace(/\s+/g, '_')  // mezery -> podtržítka
            .replace(/\//g, '_')
            .replace(/\./g, '')
            .replace(/__+/g, '_');
    }

    function createWrapper() {
        if (document.getElementById('tvf-wrapper')) return;

        const container = document.createElement('div');
        container.id = 'tvf-wrapper';
        container.style.maxWidth = '90%';
        container.style.margin = '20px auto';
        container.style.padding = '16px';
        container.style.background = '#f8f9fa';
        container.style.border = '1px solid #ddd';
        container.style.borderRadius = '10px';
        container.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        container.style.fontFamily = 'system-ui, sans-serif';
        container.style.fontSize = '14px';

        const title = document.createElement('h2');
        title.textContent = 'TVF – Canlı Skor (vlastní tabulka)';
        title.style.textAlign = 'center';
        title.style.marginBottom = '8px';

        const info = document.createElement('div');
        info.id = 'tvf-info';
        info.textContent = 'Načítám data z Canlı Skor tabulky...';
        info.style.textAlign = 'center';
        info.style.marginBottom = '10px';

        const holder = document.createElement('div');
        holder.id = 'tvf-table-holder';
        holder.style.overflowX = 'auto';
        holder.style.maxHeight = '70vh';
        holder.style.overflowY = 'auto';

        const table = document.createElement('table');
        table.id = 'tvf-table';
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';

        holder.appendChild(table);
        container.appendChild(title);
        container.appendChild(info);
        container.appendChild(holder);

        document.body.prepend(container);
    }

    // najdeme PŮVODNÍ Canlı Skor tabulku (ignorujeme naši vlastní ve wrapperu)
    function findScoreTable() {
        const tables = Array
            .from(document.querySelectorAll('table'))
            .filter(tbl => !tbl.closest('#tvf-wrapper'));

        if (!tables.length) return null;

        let chosen = tables.find(tbl => {
            const t = tbl.textContent.toUpperCase();
            return t.includes('DETAY') || t.includes('CANLI SKOR');
        });

        if (!chosen) {
            console.log('❗ Nenašel jsem tabulku s textem DETAY / CANLI SKOR.');
            return null;
        }

        return chosen;
    }

    function extractRowsData(scoreTable) {
        const rowsData = [];
        const rows = Array.from(scoreTable.querySelectorAll('tr'));

        rows.forEach(tr => {
            const cells = Array.from(tr.querySelectorAll('th,td'));
            if (!cells.length) return;

            const row = cells.map(c =>
                c.textContent.replace(/\s+/g, ' ').trim()
            );

            if (row.some(col => col !== '')) {
                rowsData.push(row);
            }
        });

        return rowsData;
    }

    function renderCustomTable(rowsData) {
        const table = document.getElementById('tvf-table');
        const info = document.getElementById('tvf-info');
        if (!table) return;

        if (!rowsData.length) {
            if (info) info.textContent = 'Nenalezeny žádné řádky v Canlı Skor tabulce.';
            table.innerHTML = '';
            return;
        }

        if (info) info.textContent = `Načteno řádků: ${rowsData.length}`;

        const maxCols = rowsData.reduce((max, row) => Math.max(max, row.length), 0);

        // vyčistíme tabulku
        table.innerHTML = '';

        // HLAVIČKA (zatím generická)
        const thead = table.createTHead();
        const headRow = document.createElement('tr');
        for (let i = 0; i < maxCols; i++) {
            const th = document.createElement('th');
            th.textContent = `Col ${i + 1}`;
            th.style.background = '#e9ecef';
            th.style.padding = '6px';
            th.style.borderBottom = '1px solid #ccc';
            th.style.position = 'sticky';
            th.style.top = '0';
            th.style.zIndex = '1';
            headRow.appendChild(th);
        }
        thead.appendChild(headRow);

        const tbody = document.createElement('tbody');

        rowsData.forEach((row, index) => {
            const tr = document.createElement('tr');
            tr.style.background = index % 2 === 0 ? '#ffffff' : '#f1f3f5';

            const home = (row[1] || '').trim();
            const away = (row[7] || '').trim();

            let matchId = '';
            if (home && away) {
                matchId = `${normalizeTeamName(home)}_${normalizeTeamName(away)}`;
                tr.id = matchId;
            }

            for (let c = 0; c < maxCols; c++) {
                const td = document.createElement('td');
                td.textContent = row[c] || '';
                td.style.padding = '4px 6px';
                td.style.borderBottom = '1px solid #eee';
                td.style.whiteSpace = 'nowrap';

                if (matchId) {
                    td.dataset.matchId = matchId;
                }

                tr.appendChild(td);
            }

            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
    }

    function initOnce() {
        createWrapper();

        const scoreTable = findScoreTable();
        if (!scoreTable) {
            const info = document.getElementById('tvf-info');
            if (info) info.textContent = 'Nenalezena Canlı Skor tabulka na stránce.';
            return;
        }

        const rowsData = extractRowsData(scoreTable);
        renderCustomTable(rowsData);

        // HARD REFRESH každých 8 vteřin
        setInterval(() => {
            console.log('🔄 Hard reload stránky TVF...');
            location.reload();
        }, 8000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initOnce);
    } else {
        initOnce();
    }

})();