// ==UserScript==
// @name         OC Highlighter
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Highlight organised crimes based on a predefined list (green = wanted, red = not wanted)
// @author       GreenDragon89
// @match        https://www.torn.com/factions.php?step=your*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551185/OC%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/551185/OC%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const preferredCrimes = [
        "Mob Mentality", 
        "Pet Project",
        "Cash Me If You Can",
        "Market Forces",
        "Snow Blind",
        "Stage Fright",
        "Guardian Ángels",
        "Leave No Trace",
        "Honey Trap",
        "Sneaky Git Grab"
    ].map(c => c.toLowerCase().trim());

    function highlightCrimes() {
        document.querySelectorAll(".wrapper___U2Ap7").forEach(card => {
            const titleEl = card.querySelector(".panelTitle___aoGuV");
            if (!titleEl) return;

            const crimeName = titleEl.textContent.toLowerCase().trim();

            if (preferredCrimes.includes(crimeName)) {
                card.style.border = "3px solid limegreen";
            } else {
                card.style.border = "3px solid crimson";
            }
            card.style.borderRadius = "6px";
        });
    }

    // Observe page for dynamically loaded cards
    const observer = new MutationObserver(highlightCrimes);
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial run after page load
    window.addEventListener("load", () => {
        setTimeout(highlightCrimes, 500);
    });
})();
