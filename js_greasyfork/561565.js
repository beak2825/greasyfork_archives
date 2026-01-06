 // ==UserScript==

// @name         Nitro Type - Hide Speed During Race

// @namespace    nitrotype-hide-speed

// @version      1.0

// @description  Hides WPM/speed during races to reduce anxiety, shows it again after race ends

// @match        https://www.nitrotype.com/*

// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/561565/Nitro%20Type%20-%20Hide%20Speed%20During%20Race.user.js
// @updateURL https://update.greasyfork.org/scripts/561565/Nitro%20Type%20-%20Hide%20Speed%20During%20Race.meta.js
// ==/UserScript==

(function () {

    'use strict';

    const HIDE_STYLE = 'visibility: hidden !important;';

    const SHOW_STYLE = 'visibility: visible !important;';

    function hideSpeed() {

        const speedElements = document.querySelectorAll(

            '.raceStats, .raceStats__wpm, .raceStats__value'

        );

        speedElements.forEach(el => el.style = HIDE_STYLE);

    }

    function showSpeed() {

        const speedElements = document.querySelectorAll(

            '.raceStats, .raceStats__wpm, .raceStats__value'

        );

        speedElements.forEach(el => el.style = SHOW_STYLE);

    }

    // Observe page changes (Nitro Type is SPA-based)

    const observer = new MutationObserver(() => {

        const inRace = document.querySelector('.raceContainer');

        const raceFinished = document.querySelector('.results');

        if (inRace && !raceFinished) {

            hideSpeed();

        }

        if (raceFinished) {

            showSpeed();

        }

    });

    observer.observe(document.body, {

        childList: true,

        subtree: true

    });

})();