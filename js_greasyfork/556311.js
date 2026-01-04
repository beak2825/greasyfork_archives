// ==UserScript==
// @name         Hide Rank Links on VJudge
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hides all "Rank" links on Vjudge contest pages (both group and general standings).
// @author       joonyou
// @match        https://vjudge.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vjudge.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556311/Hide%20Rank%20Links%20on%20VJudge.user.js
// @updateURL https://update.greasyfork.org/scripts/556311/Hide%20Rank%20Links%20on%20VJudge.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const hideRankLinks = () => {
        const links = document.querySelectorAll('a[href="#rank"]');
        links.forEach(link => {
            link.style.display = 'none';
        });
    };

    hideRankLinks();

    // Handle dynamic updates since VJudge is highly dynamic
    new MutationObserver(hideRankLinks).observe(document.body, {
        childList: true,
        subtree: true
    });
})();
