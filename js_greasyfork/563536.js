// ==UserScript==
// @name         Geocaching Premium Logs For Basic Members
// @namespace    http://tampermonkey.net/
// @version      2026-01-21
// @description  Allow Basic Members to log a Premium Member cache
// @author       Solve n' Share
// @match        https://www.geocaching.com/geocache/GC*
// @icon         https://www.geocaching.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563536/Geocaching%20Premium%20Logs%20For%20Basic%20Members.user.js
// @updateURL https://update.greasyfork.org/scripts/563536/Geocaching%20Premium%20Logs%20For%20Basic%20Members.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var list; // New list element to hold the link
    var link; // Link to "Log this geocache" page
    var target; // Target element to append the new link

    // Check if the Premium Upgrade Widget is present on the page
    if (document.getElementsByClassName("premium-upgrade-widget").length != 0) {
        // Create a list element for the parent bar
        list = document.createElement("LI");

        // Create a hyperlink with the URL for logging PMO Cache
        link = document.createElement("A");
        link.href = "https://www.geocaching.com/live/geocache/";
        link.href += document.getElementsByClassName("li__gccode")[0].innerText;
        link.href += "/log";

        // Set link text and style
        link.innerText="Log Premium Member Cache";
        link.style.color = "green";
        link.style.fontWeight="bold";

        // Add the link to the list element
        list.appendChild(link);

        // Append link to the Difficulty/Terrain bar
        target = document.getElementsByClassName("ul__hide-details")[0];
        target.appendChild(list);
    }
})();
