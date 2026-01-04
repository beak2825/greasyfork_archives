// ==UserScript==
// @name         GazelleGames BBCode Link Generator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Generate BBCode link for game titles on GazelleGames
// @author       kdln
// @match        https://gazellegames.net/torrents.php?id=*
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554764/GazelleGames%20BBCode%20Link%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/554764/GazelleGames%20BBCode%20Link%20Generator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Extract the game ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('id');

    if (!gameId) return;

    // Get the display name element
    const displayNameElement = document.getElementById('display_name');
    if (!displayNameElement) return;

    // Extract just the title (the text node after the platform and before the year)
    const fullText = displayNameElement.textContent;
    
    // Match pattern: "Platform – Title (Year)[Rating]"
    // We want to extract just "Title"
    const match = fullText.match(/–\s*(.+?)\s*\(/);
    
    if (!match) return;
    
    const gameTitle = match[1].trim();
    const bbcodeLink = `[url=https://gazellegames.net/torrents.php?id=${gameId}]${gameTitle}[/url]`;

    // Create a button to copy the BBCode link
    const button = document.createElement('button');
    button.textContent = 'Copy BBCode Link';
    button.style.cssText = 'margin-left: 10px; padding: 5px 10px; cursor: pointer;';
    
    button.onclick = function() {
        GM_setClipboard(bbcodeLink);
        button.textContent = 'Copied!';
        setTimeout(() => {
            button.textContent = 'Copy BBCode Link';
        }, 2000);
    };

    // Add the button next to the title
    displayNameElement.appendChild(button);
})();