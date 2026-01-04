// ==UserScript==
// @name         America Random Event
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Change "Tyrannian Random Event!!!" to "America Random Event!!!"
// @author       Abel
// @match        *://grundos.cafe/*
// @match        *://*.grundos.cafe/*
// @icon         https://grundoscafe.b-cdn.net/random_events/sabrex.gif
// @license      Beerware
// @downloadURL https://update.greasyfork.org/scripts/550214/America%20Random%20Event.user.js
// @updateURL https://update.greasyfork.org/scripts/550214/America%20Random%20Event.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function changeRandomEventText() {
        const rePrehistoric = document.querySelector('.re_prehistoric');

        if (rePrehistoric) {
            rePrehistoric.innerHTML = rePrehistoric.innerHTML.replace('Tyrannian Random Event!!!', 'America Random Event!!!');
        }
    }

    // Run immediately when page loads
    changeRandomEventText();

    // Also run after a short delay to catch dynamically loaded content
    setTimeout(changeRandomEventText, 1000);
    setTimeout(changeRandomEventText, 3000);
})();