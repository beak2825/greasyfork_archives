// ==UserScript==
// @name         Block Multiple Casino Game Links
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Blocks multiple specified game links and shows an alert.
// @author       You
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552933/Block%20Multiple%20Casino%20Game%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/552933/Block%20Multiple%20Casino%20Game%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Array of the game links to block
    const blockedGames = [
        "/casino/games/dice",
        "/casino/games/plinko",
        "/casino/games/primedice",
        "/casino/games/crash",
        "/casino/games/pump",
        "/casino/games/cases",
        "/casino/games/mines",
        "/casino/games/limbo",
        "/casino/games/packs",
        "/casino/games/keno",
        "/casino/games/Hilo"
    ];

    // Function to find and block the game links
    function blockGameLinks() {
        // Loop through each game path in our block list
        blockedGames.forEach(function(gameHref) {
            // Find all links that match the current game path and haven't been processed yet
            const gameLinks = document.querySelectorAll(`a[href="${gameHref}"]:not([data-blocked])`);

            // Attach the click-blocking event to each found link
            gameLinks.forEach(function(link) {
                // Prevent the link from being followed
                link.addEventListener('click', function(event) {
                    event.preventDefault();
                    event.stopPropagation(); // Stop the event from bubbling up further
                    alert("This game is blocked.");
                });

                // Mark this link as processed so we don't attach another listener
                link.setAttribute('data-blocked', 'true');
            });
        });
    }

    // --- Main Execution ---

    // Run the function once on initial page load
    blockGameLinks();

    // Set up a MutationObserver to watch for new content being added to the page
    // This is important for modern websites that load content dynamically
    const observer = new MutationObserver(function(mutations) {
        // If nodes were added, re-run our blocking function to check for new links
        if (mutations.some(mutation => mutation.addedNodes.length > 0)) {
            blockGameLinks();
        }
    });

    // Start observing the entire document body for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();