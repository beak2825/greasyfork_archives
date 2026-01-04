// ==UserScript==
// @name         Steam Workshop Title Cleaner
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove "Steam Workshop::" from titles on Steam Workshop pages
// @match        https://steamcommunity.com/sharedfiles/filedetails/?id=*
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/559886/Steam%20Workshop%20Title%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/559886/Steam%20Workshop%20Title%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('Steam Workshop Title Cleaner Running');

    // Function to clean the title
    function cleanSteamTitle() {
        const pageTitle = document.title;
        if (pageTitle.startsWith("Steam Workshop::")) {
            const cleanedTitle = pageTitle.replace("Steam Workshop::", "").trim();
            document.title = cleanedTitle;
            console.log("Title cleaned: " + cleanedTitle);
        }
    }

    // Run the cleaning function when the page loads
    window.addEventListener('load', cleanSteamTitle);
})();
