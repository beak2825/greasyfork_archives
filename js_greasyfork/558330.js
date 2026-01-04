// ==UserScript==
// @name         YouTube - Redirect Home To Videos Tab
// @version      4.0
// @description  Redirects to Videos, but allows navigation to Home from Shorts, Live, Playlists, etc.
// @match        *://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @license   MIT
// @namespace https://greasyfork.org/users/1545977
// @downloadURL https://update.greasyfork.org/scripts/558330/YouTube%20-%20Redirect%20Home%20To%20Videos%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/558330/YouTube%20-%20Redirect%20Home%20To%20Videos%20Tab.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Store the previous path to track where the user came from
    let lastPath = window.location.pathname;

    function checkAndRedirect() {
        const currentPath = window.location.pathname;
        const url = window.location.href;

        // 1. Identify the Channel Root (e.g., /@Gemini, /channel/ID)
        const channelMatch = currentPath.match(/^(\/(?:@[\w\.-]+|channel\/[\w-]+|c\/[\w-]+|user\/[\w-]+))/);

        if (channelMatch) {
            const channelRoot = channelMatch[1];

            // Check if we are currently on the "Home" tab (Root or /featured)
            const isHome = (currentPath === channelRoot || currentPath === channelRoot + "/" || currentPath === channelRoot + "/featured");

            // Check if we came from ANY tab within this same channel (Videos, Shorts, Live, etc.)
            // We verify if the PREVIOUS path also started with this channel's root
            const cameFromSameChannel = lastPath && lastPath.startsWith(channelRoot) && lastPath !== currentPath;

            // LOGIC:
            // 1. If we are on Home...
            // 2. AND we did NOT come from a tab on this same channel...
            // 3. THEN we must have come from outside (Search, Google, Subs) -> Redirect to Videos.
            if (isHome && !cameFromSameChannel) {
                const newUrl = url.replace(/\/featured\/?$/, "").replace(/\/$/, "") + "/videos";
                window.location.replace(newUrl);
            }
        }

        // Update the "Last Path" for the next click
        lastPath = currentPath;
    }

    // Run on initial page load (Force redirect if opening link in new tab)
    checkAndRedirect();

    // Run on in-page navigation (YouTube "Soft" clicks)
    window.addEventListener('yt-navigate-finish', checkAndRedirect);

})();