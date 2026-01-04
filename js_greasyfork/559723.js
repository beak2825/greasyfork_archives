// ==UserScript==
// @name         Google Video to YouTube (With UI Label)
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Redirects Google Video to YouTube and renames the tab to "YouTube"
// @author       You
// @match        *://www.google.com/*
// @match        *://www.google.co.*/*
// @match        *://www.google.*/*
// @run-at       document-start
// @grant        none
// @license      MIIT
// @downloadURL https://update.greasyfork.org/scripts/559723/Google%20Video%20to%20YouTube%20%28With%20UI%20Label%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559723/Google%20Video%20to%20YouTube%20%28With%20UI%20Label%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getQuery() {
        return new URLSearchParams(window.location.search).get('q');
    }

    function redirectToYouTube() {
        const q = getQuery();
        if (q) {
            const ytUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
            window.location.replace(ytUrl);
        }
    }

    // --- NEW: Function to change "Videos" text to "YouTube" ---
    function renameVideoTab() {
        // Look for the specific span class from your HTML
        const spans = document.querySelectorAll('.R1QWuf');
        spans.forEach(span => {
            if (span.textContent.trim() === "Videos") {
                span.textContent = "YouTube";
            }
        });
    }

    // 1. Monitor URL for redirects
    let lastUrl = location.href;
    setInterval(() => {
        const url = new URL(location.href);
        if (url.searchParams.get('tbm') === 'vid' || url.searchParams.get('udm') === '7' || url.searchParams.get('udm') === '21') {
             redirectToYouTube();
        }
        // Also keep checking to make sure the label stays renamed if Google refreshes the UI
        renameVideoTab();
    }, 250);

    // 2. Intercept clicks on the tab
    window.addEventListener('click', (e) => {
        const target = e.target;
        // Check for both "Videos" and "YouTube" (since we renamed it)
        const text = target.closest('.mXwfNd')?.textContent.trim();
        const isVideoTab = text === "Videos" || text === "YouTube" ||
                           target.closest('[role="listitem"]')?.textContent.includes("Videos");

        if (isVideoTab) {
            setTimeout(redirectToYouTube, 10);
        }
    }, true);

    // 3. Initial execution
    if (window.location.href.includes('tbm=vid') || window.location.href.includes('udm=7')) {
        redirectToYouTube();
    }

    // Run rename as soon as DOM is ready
    document.addEventListener('DOMContentLoaded', renameVideoTab);

})();