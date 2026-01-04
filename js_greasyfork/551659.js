// ==UserScript==
// @name         ESPN Tennis — Favorites Filter (With Persistent Button Placement)
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  Hide all ESPN tennis matches that don't include favorite players or are empty, with an auto-hiding toggle button that remembers its state and sits beside the ESPN nav menu.
// @match        https://www.espn.com/tennis/scoreboard/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551659/ESPN%20Tennis%20%E2%80%94%20Favorites%20Filter%20%28With%20Persistent%20Button%20Placement%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551659/ESPN%20Tennis%20%E2%80%94%20Favorites%20Filter%20%28With%20Persistent%20Button%20Placement%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const favoritePlayers = [
        'Carlos Alcaraz', 'Jannik Sinner', 'Taylor Fritz','Novak Djokovic',
        'Ben Shelton', 'Tommy Paul', 'Frances Tiafoe', 'Brandon Nakashima', 'Learner Tien'
    ];
    const selectors = [
        '.CompetitionsWrapper > div',
    ];

    // --- Persistence ---
    const STORAGE_KEY = 'espnTennisFavoritesShowAll';
    let showAll = localStorage.getItem(STORAGE_KEY) === 'true';

    // --- Core logic ---
    const cleanText = str => (str || '').replace(/\s+/g, ' ').trim().toLowerCase();
    const hasFavoriteName = el => {
        const text = cleanText(el.innerText);
        return favoritePlayers.some(name => text.includes(name.toLowerCase()));
    };
    const isEmptyCard = el => {
        const text = cleanText(el.innerText);
        return !/[A-Za-z]/.test(text) || text.length < 15;
    };

    function filterMatches() {
        selectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(card => {
                if (showAll) {
                    card.style.display = '';
                } else {
                    const hide = isEmptyCard(card) || !hasFavoriteName(card);
                    card.style.display = hide ? 'none' : '';
                }
            });
        });
    }

    // --- Button Code ---
    function createToggleButton() {
        const btn = document.createElement('button');
        btn.innerText = showAll ? 'Show Only Favorites' : 'Show All Matches';
        btn.id = 'favToggleBtn';
        Object.assign(btn.style, {
            marginLeft: '10px',
            background: '#222',
            color: '#fff',
            border: '1px solid #555',
            borderRadius: '8px',
            padding: '7px 12px',
            cursor: 'pointer',
            fontSize: '13px',
            fontFamily: 'sans-serif',
            opacity: '0.85',
            transition: 'opacity 0.4s ease, transform 0.3s ease'
        });

        btn.addEventListener('mouseenter', () => (btn.style.opacity = '1'));
        btn.addEventListener('mouseleave', () => (btn.style.opacity = '0.85'));

        btn.addEventListener('click', () => {
            showAll = !showAll;
            localStorage.setItem(STORAGE_KEY, showAll);
            btn.innerText = showAll ? 'Show Only Favorites' : 'Show All Matches';
            filterMatches();
        });

        // Place the button next to the target nav link
        function placeButton() {
            const navTarget = document.querySelector('.Nav__AccessibleMenuItem_Wrapper.justify-between.relative.n7.items-center.flex.Nav__Secondary__Menu__Item > .ph3.items-center.flex.clr-gray-01.Nav__Secondary__Menu__Link.Button--unstyled.AnchorLink');
            if (navTarget && !document.getElementById('favToggleBtn')) {
                navTarget.parentNode.insertBefore(btn, navTarget.nextSibling);
            }
        }

        placeButton();
        // In case site loads content later:
        const navObs = new MutationObserver(placeButton);
        navObs.observe(document.body, { childList: true, subtree: true });

        return btn;
    }

    // React dynamic updates
    const observer = new MutationObserver(() => requestIdleCallback(filterMatches));
    observer.observe(document.body, { childList: true, subtree: true });

    // Repeat during load to catch late content
    let tries = 0;
    const interval = setInterval(() => {
        filterMatches();
        if (++tries > 25) clearInterval(interval);
    }, 2000);

    // Initial startup
    setTimeout(() => {
        createToggleButton();
        filterMatches();
    }, 2000);
})();
