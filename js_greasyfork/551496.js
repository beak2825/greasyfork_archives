// ==UserScript==
// @name         Metacritic - Hide Critic Scores
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hide critic scores, critic reviews, and critic platform sections on Metacritic game pages (leave only user scores visible)
// @author       W2B
// @match        https://www.metacritic.com/game/*
// @run-at       document-idle
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551496/Metacritic%20-%20Hide%20Critic%20Scores.user.js
// @updateURL https://update.greasyfork.org/scripts/551496/Metacritic%20-%20Hide%20Critic%20Scores.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const css = `
        /* Critic score box under the title */
        .g-inner-spacing-bottom-medium.u-clearfix.c-productScoreInfo { display: none !important; }

        /* The first review summary block (critic reviews) */
        .g-inner-spacing-bottom-medium.g-inner-spacing-top-medium.c-productHero_details--desktop.c-gameReviews > div.c-reviewWrapper:nth-of-type(1) { display: none !important; }

        /* Platform section showing critic-based summaries */
        .g-outer-spacing-bottom-medium.g-grid-container.c-gamePlatformsSection { display: none !important; }

        /* Entire critic reviews section */
        .c-reviewsSection_criticReviews { display: none !important; }

        .c-reviewsSection_carouselContainer-critic,
        .c-reviewsSection_criticReviews {
            display: none !important;
        }

    `;

    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
})();
