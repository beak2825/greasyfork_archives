// ==UserScript==
// @name           Googler Redirect (neura-neura fork)
// @description    Automatically redirects Bing, Daum, and Yahoo search results to Google.
// @namespace      https://github.com/neura-neura/userscripts
// @version        2025.11.11
// @author         neura-neura
// @license        MIT
// @icon           https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://www.google.com
// @match          *://*.bing.com/search?*
// @match          *://search.daum.net/search?*
// @match          *://search.yahoo.com/search?*
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/556787/Googler%20Redirect%20%28neura-neura%20fork%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556787/Googler%20Redirect%20%28neura-neura%20fork%29.meta.js
// ==/UserScript==

/*
 * Googler Redirect (neura-neura fork)
 * Redirects search queries from Bing, Daum, and Yahoo to Google Search.
 *
 * Original author: ndaesik (https://update.greasyfork.org/scripts/437239/Googler.user.js)
 * Modified and maintained by neura-neura.
 * License: MIT
 */

(function() {
    'use strict';
    try {
        // Extract the search query parameter (?q= or ?p=)
        const query = document.URL.split(/[?|&](?:q|p)=/)[1]?.split('&')[0];
        if (query) {
            const decoded = decodeURIComponent(query);
            location.replace('https://www.google.com/search?q=' + decoded);
        }
    } catch (e) {
        console.error('Googler Redirect (neura-neura fork) error:', e);
    }
})();
