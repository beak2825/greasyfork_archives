// ==UserScript==
// @name         YouTube Title Cleaner
// @namespace    https://violentmonkey.github.io/
// @version      1.0
// @description  Cleans YouTube tab titles by removing notification numbers and the "- YouTube" suffix, updating automatically when page content changes.
// @author       Alyssa B. Morton
// @license      MIT
// @match        *://*.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555384/YouTube%20Title%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/555384/YouTube%20Title%20Cleaner.meta.js
// ==/UserScript==

(function () {
    "use strict";

    function cleanTitle() {
        setTimeout(() => {
            let title = document.title;

            // Remove notification count e.g. "(7) Video name"
            title = title.replace(/^\(\d+\)\s*/g, "");

            // Remove " - YouTube" at the end of the title
            title = title.replace(/\s*-\s*YouTube\s*$/i, "");

            document.title = title;
        }, 300); // small delay to ensure YouTube updates title first
    }

    // Run on load
    cleanTitle();

    // Detect title changes (YouTube is SPA and changes title dynamically)
    const observer = new MutationObserver(cleanTitle);
    observer.observe(document.querySelector("title"), { childList: true });

})();
