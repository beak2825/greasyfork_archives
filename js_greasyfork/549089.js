// ==UserScript==
// @name         Bookies % based on Odds
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  This script will allow you to see a % sign next to the odds in the bookies.
// @author       SwiftJustice [1964832]
// @match        https://www.torn.com/*
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/549089/Bookies%20%25%20based%20on%20Odds.user.js
// @updateURL https://update.greasyfork.org/scripts/549089/Bookies%20%25%20based%20on%20Odds.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const odds = document.createElement('span');
    odds.innerHTML = 'Test';
    odds.style.position = 'fixed';
    odds.style.top = '10px';
    odds.style.right = '10px';
    odds.style.top = '27%'; // Adjusted to center vertically
    odds.style.right = '0%'; // Center horizontally
    odds.style.transform = 'translate(-50%, -50%)'; // Center the button properly
    odds.style.zIndex = '9999';

    // Add CSS styles for a green background
    //odds.style.backgroundColor = 'green';
    //odds.style.color = 'white';
    //odds.style.border = 'none';
    //odds.style.padding = '6px';
    //odds.style.borderRadius = '6px';
    //odds.style.cursor = 'pointer';

    // Add a click event listener to open Google in a new tab
    /*odds.addEventListener('click', function() {

    });*/

    // Add the button to the page
    document.body.appendChild(odds);
})();