// ==UserScript==
// @name         ESPN Matchup Redirect to API (SPA-ready)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Přesměruje ESPN matchup stránku na API bez nutnosti refresh
// @match        https://www.espn.com/*
// @run-at       document-start
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557917/ESPN%20Matchup%20Redirect%20to%20API%20%28SPA-ready%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557917/ESPN%20Matchup%20Redirect%20to%20API%20%28SPA-ready%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function tryRedirect() {
        const url = window.location.href;

        if (!url.includes('/nba/game/_/gameId/')) return;

     const matchId = url.split("gameId/")[1].split("/")[0];


        if (!/^\d+$/.test(matchId)) {
            console.warn("Nelze získat ID:", matchId);
            return;
        }

        const targetUrl =
            "https://site.web.api.espn.com/apis/site/v2/sports/basketball/nba/summary" +
            "?region=us&lang=en&contentorigin=espn&event=" +
            matchId;

        window.location.replace(targetUrl);
    }

    // Zachycení navigace bez reloadu
    const pushState = history.pushState;
    history.pushState = function () {
        pushState.apply(this, arguments);
        setTimeout(tryRedirect, 50);
    };

    const replaceState = history.replaceState;
    history.replaceState = function () {
        replaceState.apply(this, arguments);
        setTimeout(tryRedirect, 50);
    };

    window.addEventListener('popstate', () => {
        setTimeout(tryRedirect, 50);
    });

    // také při prvním loadu
    setTimeout(tryRedirect, 50);

})();