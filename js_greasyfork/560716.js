// ==UserScript==
// @name         Kushindo Luscious Faction Calendar Elite
// @namespace    kushindo.faction.calendar.elite
// @version      3.2
// @description  Elite faction calendar with purple & gold theme, hover effects, collapse toggle, and war timer
// @match        https://www.torn.com/factions.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560716/Kushindo%20Luscious%20Faction%20Calendar%20Elite.user.js
// @updateURL https://update.greasyfork.org/scripts/560716/Kushindo%20Luscious%20Faction%20Calendar%20Elite.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ================= CONFIG ================= */
    const STORAGE_KEY = 'kushindoFactionEvents';
    const LOCK_KEY = 'kushindoFactionLock';
    const READONLY_KEY = 'kushindoFactionReadonly';
    const COLLAPSE_KEY = 'kushindoFactionCollapsed';

    const COLORS = {
        bg: '#120817',
        panel: '#1a0c24',
        border: '#2a1238',
        purple: '#5e2b8c',
        gold: '#d4af37',
        text: '#e6dff0',
        muted: '#9c8cb3'
    };

    const EVENT_TYPES = {
        war:      { label: 'War',      color: '#8e44ad' },
        chain:    { label: 'Chain',    color: '#d4af37' },
        training: { label: 'Training', color: '#5dade2' },
        other:    { label: 'Other',    color: '#a569bd' }
    };

    /* ================= STORAGE ================= */
    const loadEvents = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const saveEvents = e => localStorage.setItem(STORAGE_KEY, JSON.stringify(e));

    const isLocked = () => localStorage.getItem(LOCK_KEY) === 'true';
    const toggleLock = () => localStorage.setItem(LOCK_KEY, !isLocked());

    const isReadonly = () => localStorage.getItem(READONLY_KEY) === 'true';
    const toggleReadonly = () => localStorage.setItem(READONLY_KEY, !isReadonly());

    const isCollapsed = () => localStorage.getItem(COLLAPSE_KEY) === 'true';
    const toggleCollapse = () => localStorage.setItem(COLLAPSE_KEY, !isCollapsed());

    /* ================= HELPERS ================= */
    function countdown(date) {
        const diff = new Date(date) - new Date();
        if (diff <= 0) return 'Started';
        const h = Math.floor(diff / 36e5);
        const m = Math.floor((diff % 36e5) / 6e4);
        return `${h}h ${m}m`;
    }

    function detectWarTimer() {
        const text = document.body.innerText;
        const match = text.match(/War ends in ([0-9h m]+)/i);
        return match ? match[1] : null;
    }

    /* ================= UI ================= */
    function createUI() {
        const box = document.createElement('div');
        box.id = 'kushindoCalendar';
        box.style.cssText = `
            background:${COLORS.bg};
            border-bottom:2px solid ${COLORS.gold};
            padding:10px;
            color:${COLORS.text};
            font-family:Arial,Helvetica,sans-serif;
            position:relative;
            z-index:999;
        `;

        box.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;">
                <div style="font-size:18px;font-weight:bold;color:${COLORS.gold};">
                    Kushindo Luscious — Faction Calendar
                </div>
                <button id="collapseBtn"
                    style="background:${COLORS.panel};color:${COLORS.gold};
                           border:1px solid ${COLORS.gold};cursor:pointer;">
                    ${isCollapsed() ? 'Expand' : 'Collapse'}
                </button>
            </div>

            <div id="warBanner" style="
                display:none;
                margin-top:6px;
                padding:4px;
                border:1px solid ${COLORS.gold};
                color:${COLORS.gold};
                text-align:center;
                font-weight:bold;
            "></div>

            <div id="contentArea">
                <div id="calendar" style="
                    display:grid;
                    grid-template-columns:repeat(7,1fr);
                    gap:4px;
                    font-size:12px;
                    text-align:center;
                    margin-top:8px;
                "></div>

                <div style="margin-top:10px;border-top:1px solid ${COLORS.border};padding-top:6px;">
                    <b style="color:${COLORS.gold};">Upcoming Events</b>
                    <div id="eventList"></div>
                </div>

                <div id="editor" style="margin-top:10px;border-top:1px solid ${COLORS.border};padding-top:6px;">
                    <input id="eTitle" placeholder="Title">
                    <input id="eDate" type="date">
                    <input id="eTime" type="time">
                    <select id="eType">
                        <option value="war">War</option>
                        <option value="chain">Chain</option>
                        <option value="training">Training</option>
                        <option value="other">Other</option>
                    </select>
                    <button id="addBtn">Add</button>

                    <button id="lockBtn" style="float:right;">Lock</button>
                    <button id="roBtn" style="float:right;margin-right:5px;">Read-Only</button>
                </div>
            </div>
        `;

        /* Hover effects */
        box.querySelectorAll('button').forEach(btn => {
            btn.onmouseenter = () => btn.style.boxShadow = `0 0 6px ${COLORS.gold}`;
            btn.onmouseleave = () => btn.style.boxShadow = '';
        });

        return box;
    }

    /* ================= RENDER ================= */
    function renderCalendar(el) {
        el.innerHTML = '';
        const now = new Date();
        const y = now.getFullYear();
        const m = now.getMonth();
        const first = new Date(y, m, 1).getDay();
        const days = new Date(y, m + 1, 0).getDate();
        const events = loadEvents();

        for (let i = 0; i < first; i++) el.appendChild(document.createElement('div'));

        for (let d = 1; d <= days; d++) {
            const cell = document.createElement('div');
            cell.style.cssText = `
                border:1px solid ${COLORS.border};
                background:${COLORS.panel};
                padding:4px;
                cursor:pointer;
            `;
            cell.onmouseenter = () => cell.style.borderColor = COLORS.gold;
            cell.onmouseleave = () => cell.style.borderColor = COLORS.border;

            cell.innerHTML = `<b style="color:${COLORS.gold};">${d}</b>`;

            const dateStr = `${y}-${String(m + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
            events.filter(e => e.datetime.startsWith(dateStr)).forEach(e => {
                cell.innerHTML += `<div style="background:${EVENT_TYPES[e.type].color};
                    margin-top:2px;color:#fff;font-size:11px;">${e.title}</div>`;
            });

            el.appendChild(cell);
        }
    }

    function renderEvents(el) {
        el.innerHTML = '';
        const events = loadEvents().sort((a,b)=>new Date(a.datetime)-new Date(b.datetime));

        if (!events.length) {
            el.innerHTML = `<div style="color:${COLORS.muted};">No upcoming events</div>`;
            return;
        }

        events.forEach((e,i)=>{
            const row = document.createElement('div');
            row.style.cssText = `
                border-top:1px solid ${COLORS.border};
                padding:6px 0;
            `;
            row.onmouseenter = () => row.style.borderColor = COLORS.gold;
            row.onmouseleave = () => row.style.borderColor = COLORS.border;

            row.innerHTML = `
                <b style="color:${EVENT_TYPES[e.type].color};">${e.title}</b><br>
                <span style="color:${COLORS.muted};">
                    ${new Date(e.datetime).toLocaleString()} — ${countdown(e.datetime)}
                </span><br>
                <button ${isLocked()||isReadonly()?'disabled':''}>Delete</button>
            `;

            row.querySelector('button').onclick = ()=>{
                const ev = loadEvents();
                ev.splice(i,1);
                saveEvents(ev);
                refresh();
            };

            el.appendChild(row);
        });
    }

    function refresh() {
        renderCalendar(calendar);
        renderEvents(eventList);

        editor.style.display = isReadonly() ? 'none' : '';
        contentArea.style.display = isCollapsed() ? 'none' : '';

        collapseBtn.textContent = isCollapsed() ? 'Expand' : 'Collapse';
        lockBtn.textContent = isLocked() ? 'Unlock' : 'Lock';
        roBtn.textContent = isReadonly() ? 'Editable' : 'Read-Only';

        const war = detectWarTimer();
        if (war) {
            warBanner.style.display = 'block';
            warBanner.textContent = `WAR ACTIVE — Ends in ${war}`;
        } else {
            warBanner.style.display = 'none';
        }
    }

    /* ================= INIT ================= */
    function init() {
        const header = document.querySelector('#topHeader') || document.body;
        const ui = createUI();
        header.after(ui);

        collapseBtn.onclick = () => { toggleCollapse(); refresh(); };
        lockBtn.onclick = () => { toggleLock(); refresh(); };
        roBtn.onclick = () => { toggleReadonly(); refresh(); };

        addBtn.onclick = () => {
            if (isLocked() || isReadonly()) return;
            if (!eTitle.value || !eDate.value) return alert('Title and date required');

            const ev = loadEvents();
            ev.push({
                title: eTitle.value,
                datetime: `${eDate.value}T${eTime.value||'00:00'}`,
                type: eType.value
            });
            saveEvents(ev);
            eTitle.value = '';
            refresh();
        };

        refresh();
        setInterval(refresh, 60000);
    }

    setTimeout(init, 1200);
})();
