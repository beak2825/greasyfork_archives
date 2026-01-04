// ==UserScript==
// @name         Remove the end card
// @namespace    http://tampermonkey.net/
// @version      2025-09-16
// @description  Get rid of the annoying end card hovering over the whole page!
// @author       Loeschli
// @match        https://www.crunchyroll.com/*
// @match        https://crunchyroll.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=crunchyroll.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549725/Remove%20the%20end%20card.user.js
// @updateURL https://update.greasyfork.org/scripts/549725/Remove%20the%20end%20card.meta.js
// ==/UserScript==

(function() {
    'use strict';

    waitForElement('.erc-end-slate-recommendations-carousel').then((card) => {
        console.log("=== Recommendation Carousel Dialog loaded! ===");
        card.remove();
        console.log("=== Recommendation Carousel Dialog removed! ===");
    });
})();

function waitForElement(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}