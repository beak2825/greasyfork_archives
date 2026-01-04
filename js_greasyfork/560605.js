// ==UserScript==
// @name         Slayca Patreon Redeem Link Highlighter
// @namespace    http://tampermonkey.net/
// @version      2025-11-25
// @description  Highlight links containing "patreon.com/Sleyca/redeem" in bright red
// @author       You
// @match        https://www.patreon.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=patreon.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560605/Slayca%20Patreon%20Redeem%20Link%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/560605/Slayca%20Patreon%20Redeem%20Link%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to highlight matching links
    function highlightPatreonLinks() {
        const links = document.querySelectorAll('a[href*="patreon.com/Sleyca/redeem"]');
        links.forEach(link => {
            link.style.backgroundColor = 'red';
            link.style.color = 'white';
            link.style.padding = '2px 4px';
            link.style.fontWeight = 'bold';
        });
    }

    // Run on page load
    highlightPatreonLinks();

    // Watch for dynamically added content
    const observer = new MutationObserver(highlightPatreonLinks);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();