// ==UserScript==
// @name         Rummikub Chrome Update Remover
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove the overlay so you can play the game on other browsers like FireFox
// @author       yclee126
// @match        https://rummikub-apps.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552608/Rummikub%20Chrome%20Update%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/552608/Rummikub%20Chrome%20Update%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var intv = setInterval(function() {

        // get element
        const elem = document.querySelector('.header-fix-tester-container');
        if (elem == null) {
            return;
        }

        // remove element
        elem.remove();

        // stop interval loop
        clearInterval(intv);

    }, 100);
})();