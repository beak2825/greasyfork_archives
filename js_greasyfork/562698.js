// ==UserScript==
// @name            Youtube: Auto-sort search results by upload date (sort videos by upload date)
// @description     Rewrites the URL of a YouTube search results page to automatically sort by video upload date, if the sort order is not already present
// @author          JMcclain
// @license         GPL-3.0-only
// @namespace       https://github.com/Archangel1C
// @version         0.23
// @match           *://*.youtube.com/results*
// @run-at          document-start
// @grant           none
// @compatible      chrome
// @contributionURL https://flattr.com/@Archangel1C
// @downloadURL https://update.greasyfork.org/scripts/562698/Youtube%3A%20Auto-sort%20search%20results%20by%20upload%20date%20%28sort%20videos%20by%20upload%20date%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562698/Youtube%3A%20Auto-sort%20search%20results%20by%20upload%20date%20%28sort%20videos%20by%20upload%20date%29.meta.js
// ==/UserScript==
//
// Sources/Influences:
// - https://stackoverflow.com/a/28956498/4423698
// Fixes Archangel1C's version in 2026
// https://greasyfork.org/en/scripts/376985-youtube-auto-sort-search-results-by-upload-date

(function() {
    'use strict';

    function addUploadDateQuery() {
        if (!window.location.pathname.startsWith('/results')) return;

        let url = new URL(window.location.href);
        let query = url.searchParams;
        
        // The "Secret Sauce": YouTube and URLSearchParams handle encoding differently.
        // We check for both the raw and encoded versions to stop the loop.
        const currentSp = query.get("sp");
        const targetSp = "CAI=";

        // 1. If we already have the correct parameter, STOP EVERYTHING.
        if (currentSp === targetSp || currentSp === "CAI%3D") {
            console.log("Sort parameter already present. Exiting.");
            return;
        }

        // 2. Prevent redirect loops using a session-based "Gatekeeper"
        // This clears whenever you perform a brand new search.
        const searchFingerprint = query.get("search_query");
        if (sessionStorage.getItem('yt_redirect_done') === searchFingerprint) {
            return;
        }

        // 3. Apply the parameter and redirect
        query.set("sp", targetSp);
        const newUrl = url.pathname + '?' + query.toString();
        
        // Set the gatekeeper flag before redirecting
        sessionStorage.setItem('yt_redirect_done', searchFingerprint);
        
        console.log("Applying sort filter...");
        window.location.replace(newUrl);

        // 4. Fail-safe: If the page is blank after 3 seconds, force a reload and clear flag
        setTimeout(() => {
            if (!document.querySelector('ytd-video-renderer, ytd-rich-item-renderer')) {
                console.warn("Page stuck. Forcing reload.");
                sessionStorage.removeItem('yt_redirect_done');
                window.location.reload();
            }
        }, 3000);
    }

    // Initialize
    addUploadDateQuery();
    window.addEventListener('yt-navigate-finish', addUploadDateQuery);
})();