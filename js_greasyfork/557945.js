// ==UserScript==
// @name         CBS Sports Preview Redirect to Live
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Přesměruje CBS Gametracker preview na live stránku (SPA ready)
// @match        https://www.cbssports.com/*
// @run-at       document-start
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557945/CBS%20Sports%20Preview%20Redirect%20to%20Live.user.js
// @updateURL https://update.greasyfork.org/scripts/557945/CBS%20Sports%20Preview%20Redirect%20to%20Live.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function tryRedirect() {
        const url = window.location.href;

        // zajímá nás jen preview stránka
        if (!/\/nba\/gametracker\/preview\/NBA_[^/]+\/?$/.test(url)) return;

        // získání ID zápasu
        const match = url.match(/\/preview\/(NBA_[^/]+)\/?/);
        if (!match) return;

        const gameId = match[1];

        const targetUrl = `https://www.cbssports.com/nba/gametracker/live/${gameId}/`;

        window.location.replace(targetUrl);
    }

    // podpora SPA navigace
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

    // i pro přímý vstup
    setTimeout(tryRedirect, 50);

})();