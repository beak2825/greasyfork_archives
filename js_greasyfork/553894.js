// ==UserScript==
// @name         RYM Rating Remover
// @namespace    http://tampermonkey.net/
// @version      2025-10-27
// @description  Removes the total ratings from the release page and charts. It does not removes ratings from friends
// @author       .
// @match        https://rateyourmusic.com/release/*
// @match        https://rateyourmusic.com/charts/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553894/RYM%20Rating%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/553894/RYM%20Rating%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelectorAll(".page_charts_section_charts_item_stats_ratings").forEach(e => e.remove());
    document.getElementsByClassName("avg_rating")[0].closest("tr").remove();
})();