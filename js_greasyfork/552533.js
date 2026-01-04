// ==UserScript==
// @name         Hide HLTV Betting Section
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Hides the "Betting" odds section on HLTV match pages.
// @author       You
// @match        https://www.hltv.org/matches/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552533/Hide%20HLTV%20Betting%20Section.user.js
// @updateURL https://update.greasyfork.org/scripts/552533/Hide%20HLTV%20Betting%20Section.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. Hide the main "Betting" section (using the ID from the previous request)
    const bettingSection = document.getElementById('betting');
    if (bettingSection) {
        bettingSection.style.display = 'none';
        console.log('HLTV Betting section hidden.');
    }

    // 2. Hide the element containing the ad/promo (using the class name from this request)
    const adSection = document.querySelector('.matchpage-after-betting-web');
    if (adSection) {
        adSection.style.display = 'none';
        console.log('HLTV after-betting ad section hidden.');
    }
})();