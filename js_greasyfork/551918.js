// ==UserScript==
// @name         FUT.GG - Remove creator cards
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes the useless "creator cards" from the Trending view by deleting div elements in the grid if they lack data-item-id
// @match        https://www.fut.gg/
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551918/FUTGG%20-%20Remove%20creator%20cards.user.js
// @updateURL https://update.greasyfork.org/scripts/551918/FUTGG%20-%20Remove%20creator%20cards.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Adjust the selector below to match your actual grid class (add dots for each class, e.g., '.grid.justify-center')
    const container = document.querySelector('.grid.justify-center');
    if (container) {
        Array.from(container.children).forEach(child => {
            if (child.tagName === 'DIV' && !child.hasAttribute('data-item-id')) {
                child.remove();
            }
        });
    }
})();
