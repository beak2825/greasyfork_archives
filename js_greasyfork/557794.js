// ==UserScript==
// @name         DuckDuckGo Always Enable Search Assist
// @namespace    https://chaoscreater.dev/
// @version      1.0
// @description  Always enable DuckDuckGo Search Assist (autocomplete suggestions), even if assist=false is set in the URL
// @match        *://duckduckgo.com/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/557794/DuckDuckGo%20Always%20Enable%20Search%20Assist.user.js
// @updateURL https://update.greasyfork.org/scripts/557794/DuckDuckGo%20Always%20Enable%20Search%20Assist.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const url = new URL(window.location.href);
    const params = url.searchParams;

    // If assist parameter exists and is false/0, or if it's missing, enforce true
    if (params.get('assist') === 'false' || params.get('assist') === '0' || !params.has('assist')) {
        params.set('assist', 'true');

        // Rebuild the URL with correct params
        url.search = params.toString();

        // Only redirect if URL actually changes
        if (url.toString() !== window.location.href) {
            window.location.replace(url.toString());
        }
    }
})();
