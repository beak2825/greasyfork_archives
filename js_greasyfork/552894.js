// ==UserScript==
// @name         Redirect DuckDuckGo to Brave Search
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Redirects DuckDuckGo searches to Brave Search
// @match        *://*.duckduckgo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552894/Redirect%20DuckDuckGo%20to%20Brave%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/552894/Redirect%20DuckDuckGo%20to%20Brave%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q");

    // Only redirect if there's a search query
    if (query) {
        const braveURL = "https://search.brave.com/search?q=" + encodeURIComponent(query);

        // Prevent redirect loop if already on Brave
        if (!window.location.href.startsWith("https://search.brave.com")) {
            window.location.replace(braveURL);
        }
    }
})();
