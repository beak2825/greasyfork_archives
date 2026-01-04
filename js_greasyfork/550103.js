// ==UserScript==
// @name         Bet365 Goal Alert Sound (Favourites only)
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  Play a sound when a goal goes in for currently favourited matches or competitions
// @match        https://www.bet365.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550103/Bet365%20Goal%20Alert%20Sound%20%28Favourites%20only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550103/Bet365%20Goal%20Alert%20Sound%20%28Favourites%20only%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Short alert sound
    const audio = new Audio("https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg");

    // Check if a fixture or its parent competition is currently favourited
    function isCurrentlyFavourited(fixture) {
        if (!fixture) return false;

        // Fixture itself is explicitly favourited
        if (fixture.classList.contains("ovm-Fixture-favourite")) return true;

        // Check parent competition
        const competition = fixture.closest(".ovm-Competition");
        if (competition?.classList.contains("ovm-Competition-favourite")) return true;

        return false;
    }

    // Handler when a goal alert node is added
    function handleGoal(node) {
        const fixture = node.closest(".ovm-Fixture");
        if (!isCurrentlyFavourited(fixture)) return;

        const teamNames = [...fixture.querySelectorAll(".ovm-FixtureDetailsTwoWay_TeamName")]
            .map(el => el.textContent.trim());

        console.log("GOAL in currently favourited match:", teamNames);
        audio.play().catch(err => console.warn("Audio play failed:", err));
    }

    // Mutation observer for goal alerts
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (!(node instanceof HTMLElement)) continue;
                if (node.classList.contains("ovm-GoalEventAlert")) {
                    handleGoal(node);
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
