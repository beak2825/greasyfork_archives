// ==UserScript==
// @name         Baltic Handball
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Přesměrování z Overview na Play-by-Play
// @match        https://baltichandball.eu/season/*/league/*/game/*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551079/Baltic%20Handball.user.js
// @updateURL https://update.greasyfork.org/scripts/551079/Baltic%20Handball.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function replaceOverviewLinks() {
        document.querySelectorAll('a[href*="/overview"]').forEach(link => {
            if (link.dataset.tmBound) return;

            // rovnou přepíšeme href na play-by-play
            link.href = link.href.replace('/overview', '/play-by-play');
            link.dataset.tmBound = "1";
        });
    }

    
    if (window.location.href.includes('/overview')) {
        const target = window.location.href.replace('/overview', '/play-by-play');
        window.location.replace(target);
    }

    
    replaceOverviewLinks();

    
    const observer = new MutationObserver(replaceOverviewLinks);
    observer.observe(document.body, { childList: true, subtree: true });
})();

