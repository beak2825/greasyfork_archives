// ==UserScript==
// @name         Reddit Auto Scroll
// @description  Défilement automatique pou Reddit
// @version      1.0
// @author       Machou
// @license      MIT
// @namespace    https://reddit.com/
// @match        https://www.reddit.com/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @downloadURL https://update.greasyfork.org/scripts/554417/Reddit%20Auto%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/554417/Reddit%20Auto%20Scroll.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SCROLL_DELAY = 2000; // Délai entre deux scrolls (en ms)
    const CHECK_INTERVAL = 1500; // Intervalle pour vérifier la fin de page (en ms)
    let autoScroll = true;

    // Défilement automatique
    function scrollDown() {
        if (!autoScroll) return;

        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    }

    // Détecte la fin de page et relance un scroll
    setInterval(() => {
        if (!autoScroll) return;

        const distanceFromBottom = document.documentElement.scrollHeight - window.scrollY - window.innerHeight;
        if (distanceFromBottom < 500) { // Si proche du bas, on redéfile
            scrollDown();
        }
    }, CHECK_INTERVAL);


    // Scroll automatique initial
    setInterval(scrollDown, SCROLL_DELAY);
})();
