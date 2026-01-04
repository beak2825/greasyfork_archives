// ==UserScript==
// @name         Roblox - Unsee Cashgrab & NSFW Games
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hide cashgrab/NSFW games from Roblox discovery and search pages
// @author       You
// @match        https://www.roblox.com/discover/*
// @match        https://www.roblox.com/games/*
// @match        https://www.roblox.com/search/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548229/Roblox%20-%20Unsee%20Cashgrab%20%20NSFW%20Games.user.js
// @updateURL https://update.greasyfork.org/scripts/548229/Roblox%20-%20Unsee%20Cashgrab%20%20NSFW%20Games.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Keywords you want to block
    const blockedKeywords = [
        "r63", "condo", "nsfw", "s*x", "nude", "roleplay 18+",
        "cashgrab", "obby for admin", "free robux", "giveaway"
    ];

    function hideBadGames() {
        // Grab all game tiles
        const gameTiles = document.querySelectorAll(".game-card, .game-card-container, .game-card-link");

        gameTiles.forEach(tile => {
            let text = tile.innerText.toLowerCase();

            // If the title contains blocked keywords → hide it
            if (blockedKeywords.some(word => text.includes(word))) {
                tile.style.display = "none";
            }
        });
    }

    // Run when page loads
    hideBadGames();

    // Observe changes (Roblox dynamically loads games)
    const observer = new MutationObserver(hideBadGames);
    observer.observe(document.body, { childList: true, subtree: true });
})();
