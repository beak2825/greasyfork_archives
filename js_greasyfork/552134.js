// ==UserScript==
// @name         Google Photo Gradient Remover
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Remove black gradient on the top in Google Photos
// @author       yclee126
// @match        https://photos.google.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552134/Google%20Photo%20Gradient%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/552134/Google%20Photo%20Gradient%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const removeGradient = () => {
        // get elements
        const elems = document.querySelectorAll('[role="menubar"]');

        // set elements
        for (const elem of elems) { // don't use "in" -- it will iterate over keys.
            elem.style.setProperty('background', 'transparent');
        }
    };

    // observe layout changes
    const observer = new MutationObserver((mutations) => {
        removeGradient();
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // initial call
    removeGradient();
})();