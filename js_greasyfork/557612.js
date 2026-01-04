// ==UserScript==
// @name         Remove OpenStax banner + highlights
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  removes the top book banner and highlights popup on OpenStax pages
// @author       Max Peng
// @match        https://openstax.org/books/*
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/557612/Remove%20OpenStax%20banner%20%2B%20highlights.user.js
// @updateURL https://update.greasyfork.org/scripts/557612/Remove%20OpenStax%20banner%20%2B%20highlights.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeBanner() {
        const b1 = document.querySelector('.styled__BarWrapper-sc-3syvnw-12 ');
        if (b1) {b1.remove();}
        const b2 = document.querySelector('.BookBanner__BarWrapper-sc-1avy0c0-5');
        if (b2) {b2.remove();}
        const b3 = document.querySelector('.styled__SearchPrintWrapper-sc-12dq39v-9'); //has search bar
        if (b3) {b3.remove();}
        const highlights = document.querySelector('.sc-cIShpX'); //highlights popup
        if (highlights) {highlights.remove();}
    }

    const observer = new MutationObserver(removeBanner);
    observer.observe(document.body, { childList: true, subtree: true });
})();
