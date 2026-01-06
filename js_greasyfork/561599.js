// ==UserScript==
// @name         Google Search Domain Blacklist
// @namespace    http://feraldragon.com
// @version      0.1
// @description  Automatically appends blacklist content to Google searches
// @author       Gemini
// @license      GPL v3
// @match        https://www.google.com/search*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/561599/Google%20Search%20Domain%20Blacklist.user.js
// @updateURL https://update.greasyfork.org/scripts/561599/Google%20Search%20Domain%20Blacklist.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const params = new URLSearchParams(window.location.search);
    let query = params.get('q');
    const blacklist = "-site:fandom.com -site:pintrest.com";

    if (query && !query.includes(blacklist)) {
        // Append the blacklist operator to the query
        params.set('q', query + " " + blacklist);

        // Redirect to the new URL with the filtered results
        window.location.replace(window.location.pathname + '?' + params.toString());
    }
})();