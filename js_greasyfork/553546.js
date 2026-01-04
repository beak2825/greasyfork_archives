// ==UserScript==
// @name         Highlight YouTrack Incidents
// @namespace    http://tampermonkey.net/
// @version      2025-10-24
// @description  Adds a red border around YouTrack cards tagged with "incident".
// @author       Rokker
// @match        https://bosbec.myjetbrains.com/youtrack/agiles/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=myjetbrains.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553546/Highlight%20YouTrack%20Incidents.user.js
// @updateURL https://update.greasyfork.org/scripts/553546/Highlight%20YouTrack%20Incidents.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        .incident-marked {
            outline: 2px solid #db5c5c !important;
            background-color: #3f1919 !important;
        }
    `;
    document.head.appendChild(style);

    const colorIncidents = () => {
        if (typeof $ === 'undefined') return;
        $('.yt-issue-tags__tag__name__text').filter(function() {
            return $(this).text().toLowerCase().includes('incident');
        }).each(function() {
            const $card = $(this).closest('yt-agile-card, yt-dropzone');
            if (!$card.hasClass('incident-marked')) {
                $card.addClass('incident-marked');
            }
        });
    };

    colorIncidents();
    setInterval(colorIncidents, 1000);
})();
