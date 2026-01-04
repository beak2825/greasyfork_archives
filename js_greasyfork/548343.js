// ==UserScript==
// @name         YouTube Sensible Mode
// @description  Removes the stupid "Youtube Big Mode" update.
// @author       Vivian
// @copyright    2025, Chrysalyx (Vivian)
// @namespace    http://tampermonkey.net/
// @license      GPL-3.0-only; http://www.gnu.org/licenses/gpl-3.0.txt
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @homepageURL  https://codeberg.org/Chrysalyx/YouTube-Sensible-Mode
// @supportURL   mailto:chrysalyx@proton.me
// @version      0.1.2
// @match        *://*.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548343/YouTube%20Sensible%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/548343/YouTube%20Sensible%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Removes the class from all elements on the page that have it.
    function deleteBigMode() {
        const cringemode = document.querySelectorAll('.ytp-big-mode');
        cringemode.forEach(el => {
            el.classList.remove('ytp-big-mode');
            console.log('Removed .ytp-big-mode class from element.');
        });
    }

    // Uses a MutationObserver to watch for changes to the entire DOM.
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' || (mutation.type === 'attributes' && mutation.attributeName === 'class')) {
                deleteBigMode();
            }
        });
    });

    observer.observe(document.body, {
        childList: true, // Watch for added/removed nodes
        subtree: true, // Watch all descendants
        attributes: true // Watch for attribute changes
    });

    deleteBigMode();

})();