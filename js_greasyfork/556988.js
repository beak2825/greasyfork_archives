// ==UserScript==
// @name         Geoguessr/Seterra cheat
// @namespace    geoguessr.com
// @version      0.0.0
// @description  N/A
// @author       Mooldool
// @match        http://*.geoguessr.com/*
// @match        https://*.geoguessr.com/*
// @match        http://geoguessr.com/*
// @match        https://geoguessr.com/*
// @icon         https://www.geoguessr.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556988/GeoguessrSeterra%20cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/556988/GeoguessrSeterra%20cheat.meta.js
// ==/UserScript==

// Naming variables is the second hardest thing in computer programming.

(function() {
    'use strict';
    // The delay in ms to wait inbetween every loop.
    const delay = 10;
    // This element stores the ID (and name) of the current element they have to click.
    let game_map_header = document.querySelectorAll("[data-qa=game-map-header]");

    setInterval(() => {
        let current_question_id = game_map_header[0].getAttribute("data-current-question-id");
        let current_area = document.querySelectorAll("[data-qa=" + current_question_id + "]");

        // For the "click on the flag" games
        current_area[0].children[0].children[0].click();
        // For the "click on the country" games
        // SVG elements don't have the click function.
        current_area[0].dispatchEvent(new MouseEvent('click'));
        console.log("Clicked on " + current_question_id);
    }, delay)
})();