// ==UserScript==
// @name         Torn Faction Calendar & Events
// @namespace    kushindo.faction.calendar
// @version      1.0
// @description  Adds a calendar and upcoming events manager to the faction announcement page
// @match        https://www.torn.com/factions.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560714/Torn%20Faction%20Calendar%20%20Events.user.js
// @updateURL https://update.greasyfork.org/scripts/560714/Torn%20Faction%20Calendar%20%20Events.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'tornFactionEvents';

    function loadEvents() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    }

    function saveEvents(events) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    }

    function createContainer() {
        const container = document.createElement('div');
        container.style.border = '1px solid #444';
        container.style.background = '#111';
        container.style.padding = '10px';
        container.style.marginTop = '15px';
        container.style.color = '#e6e6e6';
        container.style.fontFamily = 'Arial, Helvetica, sans-serif';

        container.innerHTML = `
            <div style="font-size:18px;font-weight:bold;color:#f2c94c;margin-bottom:8px;">
                Faction Calendar & Upcoming Events
            </div>

            <div style="margin-bottom:10px;">
                <input id="eventTitle" placeholder="Event name"
                    style="width:30%;padding:4px;margin-right:5px;">
                <input id="eventDate" type="date"
                    style="padding:4px;margin-right:5px;">
                <input id="eventTime" type="time"
                    style="padding:4px;margin-right:5px;">
                <button id="addEvent"
                    style="padding:4px 8px;cursor:pointer;">
                    Add Event
                </button>
            </div>

            <div id="eventsList"></div>
        `;
        return container;
    }

    function renderEvents(listEl) {
        const events = loadEvents();
        events.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

        listEl.innerHTML = '';

        if (!events.length) {
            listEl.innerHTML = '<div style="color:#888;">No upcoming events.</div>';
            return;
        }

        events.forEach((event, index) => {
            const div = document.createElement('div');
            div.style.borderTop = '1px solid #222';
            div.style.padding = '6px 0';

            div.innerHTML = `
                <b>${event.title}</b><br>
                <span style="color:#aaa;">
                    ${new Date(event.datetime).toLocaleString()}
                </span><br>
                <button data-index="${index}"
                    style="margin-top:4px;padding:2px 6px;cursor:pointer;">
                    Delete
                </button>
            `;

            div.querySelector('button').onclick = () => {
                const events = loadEvents();
                events.splice(index, 1);
                saveEvents(events);
                renderEvents(listEl);
            };

            listEl.appendChild(div);
        });
    }

    function init() {
        const announcement = document.querySelector('#faction-announce, .faction-news, .content-wrapper');
        if (!announcement) return;

        const container = createContainer();
        announcement.appendChild(container);

        const listEl = container.querySelector('#eventsList');
        renderEvents(listEl);

        container.querySelector('#addEvent').onclick = () => {
            const title = container.querySelector('#eventTitle').value.trim();
            const date = container.querySelector('#eventDate').value;
            const time = container.querySelector('#eventTime').value || '00:00';

            if (!title || !date) return alert('Event name and date required');

            const events = loadEvents();
            events.push({
                title,
                datetime: `${date}T${time}`
            });

            saveEvents(events);
            renderEvents(listEl);

            container.querySelector('#eventTitle').value = '';
            container.querySelector('#eventDate').value = '';
            container.querySelector('#eventTime').value = '';
        };
    }

    setTimeout(init, 1500);
})();
