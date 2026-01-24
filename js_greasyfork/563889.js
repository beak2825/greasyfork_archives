// ==UserScript==
// @name         GS Hide Leaderboard + Show Progress
// @namespace    https://tampermonkey.net/
// @version      1.0
// @description  Disable leaderboard and ensure lab progress/score stays visible like the old one.
// @match        https://www.skills.google/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563889/GS%20Hide%20Leaderboard%20%2B%20Show%20Progress.user.js
// @updateURL https://update.greasyfork.org/scripts/563889/GS%20Hide%20Leaderboard%20%2B%20Show%20Progress.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /*Force-hide leaderboard via CSS (most reliable)*/
    GM_addStyle(`
        .js-lab-leaderboard,
        .lab-leaderboard,
        [data-test="leaderboard"] {
            display: none !important;
        }
    `);

    /*Fix layout so content expands properly*/
    function fixLayout() {
        const app = document.querySelector('.application-new');
        if (app) {
            app.classList.add('l-full', 'no-nav');
        }
    }

    /*Ensure progress / score area stays enabled*/
    function ensureProgressVisible() {
        const score = document.querySelector('.games-labs');
        if (score) {
            score.className =
                'lab-show l-full no-nav application-new lab-show l-full no-nav';
        }
    }

    /*MutationObserver for SPA updates*/
    const observer = new MutationObserver(() => {
        const leaderboard = document.querySelector('.js-lab-leaderboard');
        if (leaderboard) leaderboard.remove();

        fixLayout();
        ensureProgressVisible();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    /*Initial run*/
    fixLayout();
    ensureProgressVisible();
})();
