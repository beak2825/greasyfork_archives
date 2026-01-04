// ==UserScript==
// @name         Remove Lolesports
// @namespace    https://lolesports.com/
// @version      1.0
// @description  Clears lolesports page content for lighter idling. Use at your own risk. :riot:
// @match        https://lolesports.com/live/*
// @grant        none
// @icon         https://assets.lolesports.com/watch/lolesports-icon-ice.png
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/549697/Remove%20Lolesports.user.js
// @updateURL https://update.greasyfork.org/scripts/549697/Remove%20Lolesports.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function() {
        var scheduleLink = document.createElement('a');
        scheduleLink.href = 'https://lolesports.com/schedule';
        scheduleLink.textContent = 'Go to schedule';

        var rewardsLink = document.createElement('a');
        rewardsLink.href = 'https://lolesports.com/rewards';
        rewardsLink.textContent = 'Go to rewards';

        var links = document.createElement('p');
        links.appendChild(scheduleLink);
        links.appendChild(document.createElement('br'));
        links.appendChild(rewardsLink);

        document.body.innerHTML = '';
        document.body.appendChild(links);
    }, 15000); // Delay in ms; 15s seems to work
})();