// ==UserScript==
// @name         Show Torn Bazaar in Title
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Updates the browser tab title from "Bazaar | TORN" to the name of the bazaar owner.
// @author       Deviyl[3722358]
// @match        https://www.torn.com/bazaar.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561009/Show%20Torn%20Bazaar%20in%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/561009/Show%20Torn%20Bazaar%20in%20Title.meta.js
// ==/UserScript==


(function() {
    'use strict';
    // check every 500ms on page load until bazaar name found
    const checkInterval = setInterval(updateTitle, 500);

    function updateTitle() {
        // grab all links
        const links = document.getElementsByTagName('a');

        for (let a of links) {
            // look through links until one is a profile link
            // and also has text ends in apostrophe s
            if (a.href.includes('profiles.php?XID=')) {
                const text = a.textContent.trim();
                if (text.endsWith("'s")) {
                    document.title = `${text} Bazaar`; //change page title
                    // stop timer once found and set
                    clearInterval(checkInterval);
                    return;
                }
            }
        }
    }
})();