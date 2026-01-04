// ==UserScript==
// @name         Hide Solved Count on VJudge
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hides the number of participants who solved each problem on Vjudge
// @author       joonyou
// @match        https://vjudge.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vjudge.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556310/Hide%20Solved%20Count%20on%20VJudge.user.js
// @updateURL https://update.greasyfork.org/scripts/556310/Hide%20Solved%20Count%20on%20VJudge.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const hideStats = () => {
        const stats = document.querySelectorAll('.all-stat');
        stats.forEach(el => {
            el.style.display = 'none';
        });
    };

    // Run initially and also on dynamic page loads
    hideStats();
    document.addEventListener('DOMContentLoaded', hideStats);
    new MutationObserver(hideStats).observe(document.body, { childList: true, subtree: true });

})();
