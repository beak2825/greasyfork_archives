// ==UserScript==
// @name         OpenSubtitles - Add Request Link (Restored Feature)
// @namespace    https://greasyfork.org/en/users/1531759-fyhtma 
// @version      1.0.9
// @description  Restores the missing “Add a request” link on OpenSubtitles search pages. Adds a native-style warning message when no subtitles are found, just like the site originally had.
// @author       Gemini (original concept by ChatGPT)
// @license      MIT
// @icon         https://static.opensubtitles.org/favicon.ico
// @match        https://www.opensubtitles.org/*/search/sublanguageid-*/imdbid-*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554034/OpenSubtitles%20-%20Add%20Request%20Link%20%28Restored%20Feature%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554034/OpenSubtitles%20-%20Add%20Request%20Link%20%28Restored%20Feature%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // This script restores the old OpenSubtitles feature:
    // When a search returns no results, the site used to show
    // a yellow "No subtitles found — Click here to add a request" box.
    // That function was removed from newer versions of the site.
    // This script brings it back using the site's original CSS styling.

    window.addEventListener('load', function() {
        const resultsTable = document.getElementById('search_results');
        const searchBoxContainer = document.getElementById('search_field');

        // Only run when there are no search results on the page
        if (!resultsTable && searchBoxContainer) {

            // Build the correct “Request” page URL based on current search address
            const requestUrl = window.location.href.replace('/search/', '/request/');

            // Create a message box using OpenSubtitles' native styling
            const containerDiv = document.createElement('div');
            // 'msg warn' automatically applies yellow background, warning icon and correct layout
            containerDiv.className = 'msg warn';
            containerDiv.style.marginTop = '10px'; // small spacing below the search field

            // Message text (static part)
            const textNode = document.createTextNode('No subtitles found. ');

            // Create clickable link leading to the “Add a request” page
            const requestLink = document.createElement('a');
            requestLink.href = requestUrl;
            requestLink.innerHTML = 'Click here to <b>add a request</b>.';

            // Combine text and link
            containerDiv.appendChild(textNode);
            containerDiv.appendChild(requestLink);

            // Insert the message directly below the search bar
            searchBoxContainer.parentNode.insertBefore(containerDiv, searchBoxContainer.nextSibling);
        }
    });
})();
