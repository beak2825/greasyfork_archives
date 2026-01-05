// ==UserScript==
// @name         Torn Elim - Always Clickable + Black Attack IconAttack Icon
// @namespace    http://tampermonkey.net/
// @version      4.2
// @description  Removes all opacity + color overrides and forces attack icon to pure black.
// @match        https://www.torn.com/page.php?sid=competition*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558531/Torn%20Elim%20-%20Always%20Clickable%20%2B%20Black%20Attack%20IconAttack%20Icon.user.js
// @updateURL https://update.greasyfork.org/scripts/558531/Torn%20Elim%20-%20Always%20Clickable%20%2B%20Black%20Attack%20IconAttack%20Icon.meta.js
// ==/UserScript==

(function() {

    function fixAttackLinks() {

        document.querySelectorAll('.teamRow___R3ZLF').forEach(row => {

            let playerEl = row.querySelector('[data-tdup-player-id]');
            if (!playerEl) return;

            let userID = playerEl.getAttribute('data-tdup-player-id');
            let attackURL = `https://www.torn.com/loader.php?sid=attack&user2ID=${userID}`;
            let attackCell = row.querySelector('.attackLink___Qxet_');
            if (!attackCell) return;

            if (attackCell.querySelector('a')) return;

            let svgWrapper = attackCell.querySelector('div');
            if (!svgWrapper) return;

            let link = document.createElement('a');
            link.href = attackURL;
            link.style.cursor = "pointer";

            let clone = svgWrapper.cloneNode(true);
            link.appendChild(clone);

            let svg = link.querySelector("svg");
            if (svg) {

                // Remove all parent filters
                svg.style.setProperty("filter", "none", "important");
                svg.style.setProperty("opacity", "1", "important");

                let g = svg.querySelector("g");
                if (g) {
                    g.removeAttribute("filter");
                    g.style.setProperty("filter", "none", "important");
                    g.style.setProperty("opacity", "1", "important");
                }

                // Force each path to be pure black
                svg.querySelectorAll("path").forEach(path => {
                    // REMOVE Torn's inactive-opacity attribute entirely
                    path.removeAttribute("opacity");

                    // FORCE IT BLACK
                    path.style.setProperty("fill", "#000000", "important");
                    path.style.setProperty("stroke", "#000000", "important");
                    path.style.setProperty("color", "#000000", "important");
                    path.style.setProperty("opacity", "1", "important");
                });
            }

            attackCell.innerHTML = "";
            attackCell.appendChild(link);
        });
    }

    fixAttackLinks();

    new MutationObserver(fixAttackLinks).observe(document.body, {
        childList: true,
        subtree: true
    });

})();