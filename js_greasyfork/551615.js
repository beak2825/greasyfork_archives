// ==UserScript==
// @name         Onetricks.gg Score Calculation
// @namespace    http://tampermonkey.net/
// @version      3
// @description  Automatically scores OTPs based on win rate, games, LP, and play rate
// @author       Joshinon
// @match        https://www.onetricks.gg/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551615/Onetricksgg%20Score%20Calculation.user.js
// @updateURL https://update.greasyfork.org/scripts/551615/Onetricksgg%20Score%20Calculation.meta.js
// ==/UserScript==

// NOTE: THIS IS AN UNOFFICIAL COMMUNITY EXTENSION. IT IS NOT CREATED, ENDORSED, OR SUPPORTED BY ONETRICKS.GG. PLEASE USE RESPONSIBLY.

(function () {
    'use strict';

    /* ----------------- Config ----------------- */
    const BUTTON_Z = 999999;
    const DEBOUNCE_MS = 150;
    const WAIT_RETRY_MS = 200;
    const WAIT_MAX_RETRIES = 50;

    /* ----------------- State ----------------- */
    let table = null;
    let tbody = null;
    let headerRow = null;
    let scoreHeaderCell = null;
    let observer = null;
    let debounceTimer = null;

    let headerAdded = false;
    let autoSortActive = false; // toggled by main button
    let scoreColumnVisible = true; // toggled by small button
    let sortDirection = 'desc';

    /* ----------------- Helpers ----------------- */
    function parseNumber(str) {
        if (str === null || str === undefined) return NaN;
        return parseFloat(String(str).replace(/[,%LP\s]/g, '').trim());
    }
    function q(sel, root = document) { return root.querySelector(sel); }
    function qa(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

    /* ----------------- UI: Buttons ----------------- */
    function createMainButton() {
        if (q('#scoreToggleBtn')) return q('#scoreToggleBtn');

        const b = document.createElement('button');
        b.id = 'scoreToggleBtn';
        b.textContent = autoSortActive ? 'Auto Sort: ON (click to disable)' : 'Auto Sort: OFF (click to enable)';
        Object.assign(b.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: BUTTON_Z,
            padding: '10px 16px',
            borderRadius: '10px',
            border: 'none',
            background: autoSortActive ? '#2ecc71' : '#007bff',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: 600,
            boxShadow: '0 6px 18px rgba(0,0,0,0.25)'
        });
        b.addEventListener('click', () => {
            if (!autoSortActive) enableAutoSort();
            else disableAutoSort();
        });
        document.body.appendChild(b);
        return b;
    }

    function createHideButton() {
        if (q('#scoreHideBtn')) return q('#scoreHideBtn');

        const b = document.createElement('button');
        b.id = 'scoreHideBtn';
        b.textContent = scoreColumnVisible ? 'Hide Scores' : 'Show Scores';
        Object.assign(b.style, {
            position: 'fixed',
            bottom: '72px',
            right: '20px',
            zIndex: BUTTON_Z,
            padding: '6px 10px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(0,0,0,0.6)',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: 600,
            boxShadow: '0 4px 10px rgba(0,0,0,0.18)'
        });
        b.addEventListener('click', () => toggleScoreColumnVisibility());
        document.body.appendChild(b);
        return b;
    }

    function updateMainButton() {
        const b = q('#scoreToggleBtn');
        if (!b) return;
        b.textContent = autoSortActive ? 'Auto Sort: ON (click to disable)' : 'Auto Sort: OFF (click to enable)';
        b.style.background = autoSortActive ? '#2ecc71' : '#007bff';
    }
    function updateHideButton() {
        const b = q('#scoreHideBtn');
        if (!b) return;
        b.textContent = scoreColumnVisible ? 'Hide Scores' : 'Show Scores';
    }

    /* ----------------- Table Init / Header ----------------- */
    function initTableRefs() {
        table = q('table');
        if (!table) return false;
        tbody = q('tbody', table);
        if (!tbody) return false;

        const rows = qa('tr', tbody);
        if (!rows || !rows.length) return false;

        headerRow = rows[0];

        // add score header if not present
        if (!headerAdded) {
            scoreHeaderCell = document.createElement('td');
            scoreHeaderCell.className = 'score-header';
            scoreHeaderCell.innerText = 'Score ↓';
            Object.assign(scoreHeaderCell.style, {
                cursor: 'pointer',
                fontWeight: '700',
                userSelect: 'none',
                whiteSpace: 'nowrap',
                paddingLeft: '6px'
            });

            scoreHeaderCell.addEventListener('click', () => {
                // toggle sort direction and do an immediate resort
                sortDirection = (sortDirection === 'desc') ? 'asc' : 'desc';
                scoreHeaderCell.innerText = sortDirection === 'desc' ? 'Score ↓' : 'Score ↑';
                calculateAndSort(true);
            });

            try { headerRow.appendChild(scoreHeaderCell); } catch (e) {}
            headerAdded = true;

            // clicking other headers disables auto-sort (user intent to sort manually)
            const otherHeaders = Array.from(headerRow.querySelectorAll('td:not(.score-header)'));
            otherHeaders.forEach(h => {
                h.addEventListener('click', () => {
                    if (autoSortActive) disableAutoSort();
                });
            });
        }

        return true;
    }

    /* ----------------- Score Calculation & Sorting ----------------- */
    function calculateAndSort(forceSort = false) {
        // ensure table refs are current
        if (!table || !tbody || !document.contains(table)) {
            headerAdded = false;
            if (!initTableRefs()) return false;
        }

        const rows = qa('tr', tbody).slice(1); // skip header row
        if (!rows.length) return false;

        const scoredRows = [];
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const cells = row.querySelectorAll('td');

            // guard: expect columns up to index 10 typically; relax to at least 8
            if (cells.length < 8) continue;

            const lp = parseNumber(cells[7]?.innerText || '');
            const playRate = parseNumber(cells[8]?.innerText || '');
            const games = parseNumber(cells[9]?.innerText || '');
            const winRate = parseNumber(cells[10]?.innerText || '');

            if ([lp, playRate, games, winRate].some(v => Number.isNaN(v))) continue;

            const reliability = 1 - Math.exp(-games / 250);
            const winrateScore = Math.max(0, (winRate - 40) * 2);
            const lpScore = Math.min(lp * 0.012, 30);
            const commitmentBonus = playRate >= 50 ? 5 : 0;

            const score = (winrateScore * reliability * 0.8) + (lpScore * 0.45) + commitmentBonus;
            const rounded = Number(score.toFixed(2));

            let scoreCell = row.querySelector('.score-cell');
            if (!scoreCell) {
                scoreCell = document.createElement('td');
                scoreCell.className = 'score-cell';
                scoreCell.style.fontWeight = '700';
                scoreCell.style.paddingLeft = '6px';
                row.appendChild(scoreCell);
            }

            if (scoreCell.innerText !== String(rounded)) {
                scoreCell.innerText = String(rounded);
                scoreCell.style.color = (playRate >= 50) ? '#00ff88' : '#ffffff';
            }

            row.dataset.score = String(rounded);
            row.dataset.lp = String(lp);
            row.dataset.index = String(i);
            scoredRows.push(row);
        }

        if (!scoredRows.length) return false;

        // if auto-sort disabled and not forced, skip sorting (we still updated score cells)
        if (!autoSortActive && !forceSort) return true;

        // sort scored rows
        scoredRows.sort((a, b) => {
            const sA = parseFloat(a.dataset.score || '0');
            const sB = parseFloat(b.dataset.score || '0');
            const diff = sB - sA;
            if (Math.abs(diff) > 1e-6) return (sortDirection === 'desc') ? diff : -diff;
            const lpA = parseFloat(a.dataset.lp || '0');
            const lpB = parseFloat(b.dataset.lp || '0');
            const lpDiff = lpB - lpA;
            if (Math.abs(lpDiff) > 1e-6) return (sortDirection === 'desc') ? lpDiff : -lpDiff;
            return (sortDirection === 'desc')
                ? parseInt(a.dataset.index || '0') - parseInt(b.dataset.index || '0')
                : parseInt(b.dataset.index || '0') - parseInt(a.dataset.index || '0');
        });

        const others = rows.filter(r => scoredRows.indexOf(r) === -1);

        // stop observer while we rewrite
        if (observer) observer.disconnect();

        const frag = document.createDocumentFragment();
        frag.appendChild(headerRow);
        scoredRows.forEach(r => frag.appendChild(r));
        others.forEach(r => frag.appendChild(r));

        tbody.innerHTML = '';
        tbody.appendChild(frag);

        // reconnect observer after short delay
        if (observer) {
            setTimeout(() => {
                try {
                    const target = tbody || table || document.body;
                    observer.observe(target, { childList: true, subtree: true });
                } catch (e) {}
            }, 60);
        }

        return true;
    }

    /* ----------------- Observer & Debounce ----------------- */
    function onTableMutations() {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            debounceTimer = null;
            if (autoSortActive) calculateAndSort(true);
        }, DEBOUNCE_MS);
    }

    function attachObserver() {
        if (observer) observer.disconnect();
        try {
            const target = tbody || table || document.body;
            observer = new MutationObserver(onTableMutations);
            observer.observe(target, { childList: true, subtree: true });
        } catch (e) {
            observer = null;
        }
    }

    function detachObserver() {
        if (!observer) return;
        try { observer.disconnect(); } catch (e) {}
        observer = null;
    }

    /* ----------------- Toggle behaviors ----------------- */
    function enableAutoSort() {
        createMainButton();
        createHideButton();
        let tries = 0;
        const waiter = setInterval(() => {
            tries++;
            if (initTableRefs()) {
                clearInterval(waiter);
                autoSortActive = true;
                updateMainButton();
                calculateAndSort(true);
                attachObserver();
            } else if (tries >= WAIT_MAX_RETRIES) {
                clearInterval(waiter);
                autoSortActive = false;
                updateMainButton();
                alert('Table not found — try again after the ranking tab finishes loading.');
            }
        }, WAIT_RETRY_MS);
    }

function disableAutoSort() {
    autoSortActive = false;
    updateMainButton();
    detachObserver();

    try {
        if (!initTableRefs()) return;

        // find LP header cell
        const headerCells = Array.from(headerRow.querySelectorAll('td'));
        let lpCell = null;
        for (const cell of headerCells) {
            const txt = (cell.textContent || '').trim().replace(/\s+/g, ' ');
            if (/(^|\W)LP(\W|$)/i.test(txt) || txt.toUpperCase().includes('LP')) {
                lpCell = cell;
                break;
            }
            if (cell.querySelector && cell.querySelector('small') && /\bLP\b/i.test(cell.querySelector('small').textContent || '')) {
                lpCell = cell;
                break;
            }
        }

        if (lpCell) {
            // Click twice: first ascending, second descending
            lpCell.click();
            setTimeout(() => lpCell.click(), 150);
        } else {
            console.warn('disableAutoSort: LP header not found');
        }
    } catch (e) {
        console.warn('disableAutoSort: failed to click LP header', e);
    }
}
    /* ----------------- Score Column Visibility ----------------- */
function toggleScoreColumnVisibility() {
    scoreColumnVisible = !scoreColumnVisible;
    const header = q('.score-header');
    if (header) header.style.display = scoreColumnVisible ? '' : 'none';
    qa('.score-cell').forEach(cell => {
        cell.style.display = scoreColumnVisible ? '' : 'none';
    });
    updateHideButton();
}

    /* ----------------- Button creators wrappers ----------------- */
    function createOrGetMain() {
        if (q('#scoreToggleBtn')) return q('#scoreToggleBtn');
        const b = document.createElement('button');
        b.id = 'scoreToggleBtn';
        b.textContent = autoSortActive ? 'Auto Sort: ON (click to disable)' : 'Auto Sort: OFF (click to enable)';
        Object.assign(b.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: BUTTON_Z,
            padding: '10px 16px',
            borderRadius: '10px',
            border: 'none',
            background: autoSortActive ? '#2ecc71' : '#007bff',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: 600,
            boxShadow: '0 6px 18px rgba(0,0,0,0.25)'
        });
        b.addEventListener('click', () => {
            if (!autoSortActive) enableAutoSort();
            else disableAutoSort();
        });
        document.body.appendChild(b);
        return b;
    }

    function createOrGetHide() {
        if (q('#scoreHideBtn')) return q('#scoreHideBtn');
        const b = document.createElement('button');
        b.id = 'scoreHideBtn';
        b.textContent = scoreColumnVisible ? 'Hide Scores' : 'Show Scores';
        Object.assign(b.style, {
            position: 'fixed',
            bottom: '72px',
            right: '20px',
            zIndex: BUTTON_Z,
            padding: '6px 10px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(0,0,0,0.6)',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: 600,
            boxShadow: '0 4px 10px rgba(0,0,0,0.18)'
        });
        b.addEventListener('click', () => toggleScoreColumnVisibility());
        document.body.appendChild(b);
        return b;
    }

    /* ----------------- Boot ----------------- */
    createMainButton();
    createHideButton();

    // try one-shot init (writes score cells but does not enable autoSort)
    try { if (initTableRefs()) calculateAndSort(false); } catch (e) {}

    // expose for debugging:
    window.__leaderboardScore = {
        enableAutoSort,
        disableAutoSort,
        calculateAndSort,
        toggleScoreColumnVisibility,
        initTableRefs
    };
})();
