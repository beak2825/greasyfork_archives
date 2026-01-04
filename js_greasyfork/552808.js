// ==UserScript==
// @name         Strava - Colored Notifications + Icons
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Kolory i ikonki dla powiadomień na Strava + ukrywanie Kudosów i aktywności z opcją "Pokaż wszystkie"
// @author       JOUKI
// @match        https://www.strava.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552808/Strava%20-%20Colored%20Notifications%20%2B%20Icons.user.js
// @updateURL https://update.greasyfork.org/scripts/552808/Strava%20-%20Colored%20Notifications%20%2B%20Icons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let hideNotifications = true;
    let toggleButton = null;

    const notificationsToHide = [
        'New Kudos',
        'Another activity down 🙌',
        'Wow! Nice work, ',
        'Way to go,  👏',
        'Kudos to you,  👍',
        'Event Reminder',
        'Nice work, '
    ];

    // Mapowanie typów powiadomień → ikonka + kolor tła
    const styleMap = {
        'New Comment': { icon: '💬', bg: '#e8f5e9' },      // zielone tło
        'New Mention': { icon: '💬', bg: '#e8f5e9' },      // zielone tło
        'New Reaction': { icon: '👍', bg: '#fff3e0' },     // pomarańczowe tło
        'New Follower': { icon: '🧑‍🤝‍🧑', bg: '#e3f2fd' },     // niebieskie tło
        'Check out': { icon: '📢', bg: '#f3e5f5' },        // fioletowe tło (posty klubów)
        'New Event': { icon: '📅', bg: '#fff9c4' }         // żółte tło
        // "New Kudos" nie stylizujemy, bo są ukrywane
    };

    function createToggleButton() {
        if (toggleButton) return;

        const notificationsList = document.getElementById('notifications-list');
        if (!notificationsList) return;

        toggleButton = document.createElement('button');
        toggleButton.textContent = hideNotifications ? 'Pokaż wszystkie' : 'Ukryj filtry';
        toggleButton.style.cssText = `
            position: sticky;
            top: 0;
            z-index: 1000;
            background: #fc4c02;
            color: white;
            border: none;
            padding: 5px 10px;
            margin: 6px 0;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            font-size: 12px;
            width: auto;
            display: block;
            margin-left: auto;
            margin-right: auto;
        `;

        toggleButton.addEventListener('click', () => {
            hideNotifications = !hideNotifications;
            toggleButton.textContent = hideNotifications ? 'Pokaż wszystkie' : 'Ukryj filtry';
            filterNotifications();
        });

        notificationsList.parentNode.insertBefore(toggleButton, notificationsList);
    }

    function filterNotifications() {
        const notifications = document.querySelectorAll('#notifications-list li');

        notifications.forEach(notification => {
            const notificationText = notification.querySelector('.OXg4T');
            if (!notificationText) return;
            const text = notificationText.textContent.trim();

            // --- ukrywanie Kudosów i aktywności ---
            const shouldHide = notificationsToHide.some(hideText =>
                text === hideText || text.startsWith(hideText.split(',')[0])
            );
            if (hideNotifications && shouldHide) {
                notification.style.display = 'none';
                return;
            } else {
                notification.style.display = '';
            }

            // --- dodanie ikonki i koloru ---
            for (const key in styleMap) {
                if (text.startsWith(key)) {
                    const { icon, bg } = styleMap[key];
                    // unikamy zdublowania ikonki
                    if (!notificationText.textContent.startsWith(icon)) {
                        notificationText.textContent = `${icon} ${text}`;
                    }
                    notification.style.backgroundColor = bg;
                    notification.style.borderRadius = '6px';
                    notification.style.marginBottom = '4px';
                }
            }
        });
    }

    function init() {
        createToggleButton();
        filterNotifications();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    const observer = new MutationObserver(() => {
        createToggleButton();
        filterNotifications();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

//    setInterval(() => {
//        createToggleButton();
//        filterNotifications();
//    }, 3000);
})();