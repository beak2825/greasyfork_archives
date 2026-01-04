// ==UserScript==
// @name         Twitch 防止揪團
// @name:en      Twitch Anti-Raid - Auto Return to Initial Channel
// @version      1.1
// @description  自動記住初始頻道並防止被揪團
// @description:en     Automatically remembers your initial channel and prevents raids from redirecting you
// @match        https://www.twitch.tv/*
// @grant        none
// @run-at       document-start
// @namespace    https://greasyfork.org/users/1447528
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552822/Twitch%20%E9%98%B2%E6%AD%A2%E6%8F%AA%E5%9C%98.user.js
// @updateURL https://update.greasyfork.org/scripts/552822/Twitch%20%E9%98%B2%E6%AD%A2%E6%8F%AA%E5%9C%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function isChannelPage(url) {
        const path = new URL(url).pathname;

        const excludePaths = [
            'directory', 'search', 'settings', 'subscriptions',
            'downloads', 'jobs', 'drops', 'turbo', 'videos',
            'prime', 'friends', 'inventory', 'wallet', 'messages',
            'popout', 'moderator', 'dashboard', 'u'
        ];

        const firstPath = path.split('/')[1];
        if (excludePaths.includes(firstPath)) {
            return false;
        }

        return /^\/[a-zA-Z0-9_]{4,25}$/.test(path);
    }

    const check = () => {
        const currentURL = location.href.split('?')[0];

        if (isChannelPage(currentURL)) {
            const savedInitial = sessionStorage.getItem('twitch_initial');

            if (!savedInitial) {
                sessionStorage.setItem('twitch_initial', currentURL);
                return;
            }

            if (currentURL !== savedInitial) {
                location.replace(savedInitial);
            }
        } else {
            sessionStorage.removeItem('twitch_initial');
        }
    };

    ['pushState', 'replaceState'].forEach(method => {
        const original = history[method];
        history[method] = function() {
            original.apply(this, arguments);
            check();
        };
    });

    addEventListener('popstate', check);
    addEventListener('beforeunload', () => sessionStorage.removeItem('twitch_initial'));
    setInterval(check, 500);

    check();
})();