// ==UserScript==
// @name         Wallhaven - Sort tags alphabetically DESC
// @namespace    https://greasyfork.org/users/5097-aemony
// @version      1.0
// @description  Sort tags alphabetical on subscription page
// @author       Aemony
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @match        *://wallhaven.cc/subscription/tag/*
// @match        *://wallhaven.cc/subscription
// @icon         https://wallhaven.cc/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557434/Wallhaven%20-%20Sort%20tags%20alphabetically%20DESC.user.js
// @updateURL https://update.greasyfork.org/scripts/557434/Wallhaven%20-%20Sort%20tags%20alphabetically%20DESC.meta.js
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements */

(function() {
    'use strict';

    // Sort list of tags in descending alphabetical order
    function sortUsingNestedText(parent, childSelector, keySelector) {
        var items = parent.children(childSelector).sort(function(a, b) {
            var vA = $(keySelector, a).text();
            var vB = $(keySelector, b).text();
            return (vA < vB) ? -1 : (vA > vB) ? 1 : 0; // Sort by string
            //return vB - vA; // Sort by number
        });
        parent.append(items);
    }

    sortUsingNestedText($('div[data-storage-id="tagsubscriptions"] > ul.subscription-list'), "li", "span.tagname");

})();