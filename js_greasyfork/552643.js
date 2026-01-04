// ==UserScript==
// @name         YouTube: Simulate Direct Link to Bypass Anti-Adblock
// @namespace    github.com/annaroblox
// @version      2.0
// @description  Bypasses YouTube's anti-adblock by making in-site navigations appear as direct links without reloading the page (bypasses some anti-adblock features)
// @author       annaroblox
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @license      Public Domain
// @downloadURL https://update.greasyfork.org/scripts/552643/YouTube%3A%20Simulate%20Direct%20Link%20to%20Bypass%20Anti-Adblock.user.js
// @updateURL https://update.greasyfork.org/scripts/552643/YouTube%3A%20Simulate%20Direct%20Link%20to%20Bypass%20Anti-Adblock.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // A Map to track which video IDs have been "fixed" in the current session.
    // Using a Map is slightly cleaner than sessionStorage for session-only data.
    const fixedVideos = new Map();

    // Store the original fetch function.
    const originalFetch = window.fetch;

    // Override the global fetch function.
    window.fetch = function (input, init) {
        // Create a URL object from the fetch input.
        const url = (typeof input === 'string') ? new URL(input, window.location.origin) : new URL(input.url, window.location.origin);

        // We only care about requests to the '/youtubei/v1/player' endpoint,
        // which is responsible for loading the video player and its data.
        if (url.pathname.includes('/youtubei/v1/player')) {
            const currentUrl = new URL(location.href);
            const videoId = currentUrl.searchParams.get('v');

            // Proceed only if we're on a watch page and haven't fixed this video yet.
            if (currentUrl.pathname === '/watch' && videoId && !fixedVideos.has(videoId)) {

                console.info('YT Anti-Adblock Bypass: Simulating direct link for video:', videoId);

                // Mark this video as fixed for this session.
                fixedVideos.set(videoId, true);

                // The key modification: An in-site navigation (clicking a thumbnail) sends a `Referer`
                // header pointing to the previous YouTube page. A direct visit (e.g., from a bookmark or
                // external link) often has no referrer or a non-YouTube one.
                // By removing the header, we make the request look like a direct visit.

                // Create a mutable copy of the headers.
                const newHeaders = new Headers(init ? init.headers : {});

                // Remove the Referer header.
                newHeaders.delete('Referer');

                // Create a new init object to avoid modifying the original one passed to the function.
                const newInit = { ...init, headers: newHeaders };

                // Call the original fetch with the modified headers.
                return originalFetch.call(this, input, newInit);
            }
        }

        // For all other requests, use the original fetch function without modification.
        return originalFetch.apply(this, arguments);
    };
})();