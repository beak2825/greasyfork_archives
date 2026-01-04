// ==UserScript==
// @name         Timery na atak
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Lista wampirów z timerami i statystykami walk (wygrane/przegrane)
// @match        https://*.bloodwars.pl/*
// @run-at       document-end
// @grant        none
// @author       Varriz
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556922/Timery%20na%20atak.user.js
// @updateURL https://update.greasyfork.org/scripts/556922/Timery%20na%20atak.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'bw_attack_timers';

    /* ------------------------- STORAGE -------------------------- */

    function loadTimers() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        } catch {
            return [];
        }
    }

    function saveTimers(t) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(t));
    }

    /* ------------------------- TIME PARSER ----------------------- */

    function parseTimeToSeconds(text) {
        if (!text) return 0;
        const t = text.toLowerCase();

        let sec = 0;
        const h = t.match(/(\d+)\s*godz/);
        const m = t.match(/(\d+)\s*min/);
        const s = t.match(/(\d+)\s*sek/);

        if (h) sec += parseInt(h[1]) * 3600;
        if (m) sec += parseInt(m[1]) * 60;
        if (s) sec += parseInt(s[1]);

        return sec;
    }

    function formatTime(seconds) {
        seconds = Math.max(seconds, 0);
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;

        const pad = n => (n < 10 ? '0' + n : n);

        return h > 0
            ? `${pad(h)}:${pad(m)}:${pad(s)}`
            : `${pad(m)}:${pad(s)}`;
    }

    /* ------------------------- MODAL UI -------------------------- */

    let timers = loadTimers();
    let modal, listContainer;

    function createModal() {
        if (document.getElementById('bw-attack-modal')) return;

        modal = document.createElement('div');
        modal.id = 'bw-attack-modal';
        Object.assign(modal.style, {
            position: 'fixed', left: '5px', top: '100px',
            width: '230px', background: 'rgba(15,10,5,0.95)',
            color: '#f0d7a4', border: '1px solid #663300',
            padding: '6px 8px', fontSize: '11px',
            zIndex: 999999, borderRadius: '4px',
            fontFamily: 'Tahoma, sans-serif', maxHeight: '75vh',
            overflowY: 'auto'
        });

        const header = document.createElement('div');
        header.textContent = 'Timery napadów';
        header.style.fontWeight = 'bold';
        header.style.textAlign = 'center';
        header.style.marginBottom = '5px';

        listContainer = document.createElement('div');

        modal.appendChild(header);
        modal.appendChild(listContainer);
        document.body.appendChild(modal);
    }

    function renderList() {
        const now = Date.now();
        listContainer.innerHTML = '';

        timers
            .sort((a, b) => a.expiresAt - b.expiresAt)
            .forEach((t, index) => {
                const left = Math.floor((t.expiresAt - now) / 1000);
                if (left <= 0) return;

                const row = document.createElement('div');
                row.style.display = 'flex';
                row.style.justifyContent = 'space-between';
                row.style.marginBottom = '3px';

                const link = document.createElement('a');
                link.href = t.url;
                link.style.color = '#ffcc66';
                link.style.textDecoration = 'none';
                link.textContent = `${t.name} [${t.wins}/${t.loses}] (${formatTime(left)})`;

                const x = document.createElement('span');
                x.textContent = '×';
                x.style.cursor = 'pointer';
                x.style.color = '#ff9999';
                x.onclick = e => {
                    e.preventDefault();
                    timers.splice(index, 1);
                    saveTimers(timers);
                    renderList();
                };

                row.appendChild(link);
                row.appendChild(x);
                listContainer.appendChild(row);
            });

        if (!timers.length) {
            const e = document.createElement('div');
            e.style.textAlign = 'center';
            e.style.opacity = '0.7';
            e.textContent = 'Brak aktywnych timerów';
            listContainer.appendChild(e);
        }
    }

    function tick() {
        const now = Date.now();
        const before = timers.length;
        timers = timers.filter(t => t.expiresAt > now);
        if (before !== timers.length) saveTimers(timers);

        renderList();
    }

    /* ------------------------- STATS PARSING --------------------- */

    function parseStats() {
        const tables = [...document.querySelectorAll('.profile-stats')];

        const fightTable = tables.find(t => t.textContent.includes('WALKI'));
        if (!fightTable) return { wins: 0, loses: 0 };

        const rows = fightTable.querySelectorAll('tr');
        if (rows.length < 4) return { wins: 0, loses: 0 };

        // wiersz z wygranymi/przegranymi
        const cells = rows[3].querySelectorAll('td');
        const wins = parseInt(cells[0].innerText.trim()) || 0;
        const loses = parseInt(cells[1].innerText.trim()) || 0;

        return { wins, loses };
    }

    /* ------------------------- PROFILE READING ------------------- */

    function initFromProfile() {
        const hdr = document.querySelector('.profile-hdr');
        if (!hdr) return;

        const match = hdr.textContent.match(/Profil\s+wampira\s+(.+?)\s*$/);
        if (!match) return;

        const name = match[1].trim();
        const napLink = [...document.querySelectorAll('a.profileLinks')]
            .find(a => a.textContent.trim().toUpperCase() === 'NAPADNIJ');

        if (!napLink) return;

        const span = napLink.parentElement.querySelector('span.disabled');
        if (!span) return;

        const sec = parseTimeToSeconds(span.textContent);
        if (sec <= 0) return;

        const stats = parseStats();
        const url = napLink.href;
        const expiresAt = Date.now() + sec * 1000;

        const existing = timers.find(t => t.name === name);
        if (existing) {
            existing.expiresAt = expiresAt;
            existing.wins = stats.wins;
            existing.loses = stats.loses;
            existing.url = url;
        } else {
            timers.push({
                name,
                url,
                expiresAt,
                wins: stats.wins,
                loses: stats.loses
            });
        }

        saveTimers(timers);
        renderList();
    }

    /* ------------------------- START ------------------------------ */

    createModal();
    timers = timers.filter(t => t.expiresAt > Date.now());
    saveTimers(timers);
    renderList();

    setInterval(tick, 1000);

    initFromProfile();
})();
