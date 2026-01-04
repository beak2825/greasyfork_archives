// ==UserScript==
// @name         Scan Page for "clkn" URLs
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Scan a webpage for URLs containing "clkn"
// @author       You
// @match        https://getbonsaifreespins.com/*
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/548188/Scan%20Page%20for%20%22clkn%22%20URLs.user.js
// @updateURL https://update.greasyfork.org/scripts/548188/Scan%20Page%20for%20%22clkn%22%20URLs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let newURL = "";
    let option = { active: true };

    // Function to check and log URLs
    function scanForLonestarUrls() {
        const links = document.querySelectorAll('a[href]');
        let found = false;

        links.forEach(link => {
            const href = link.href;
            if (href.toLowerCase().includes("clkn")) {
                console.log("Found URL with 'clkn':", href);
                found = true;
//                link.click();
                newURL = "https://" + href.split("clkn/https/")[1]
                console.log("New URL: ", newURL);
                GM_openInTab(newURL, option);

            }
        });

        if (!found) {
            console.log("No URLs with 'clkn' found on this page.");
        }
    }

    // Run after page loads
    window.addEventListener('load', scanForLonestarUrls);
})();
