// ==UserScript==
// @name         Youtube 2026: Auto-sort search results by upload date (sort videos by upload date)
// @author       JMcclain
// @license      GPL-3.0-only
// @namespace    YT_Sort_Archangel1C
// @version      0.28
// @match        https://www.youtube.com/*
// @match        https://youtube.com/*
// @grant        none
// @run-at       document-start
// @description  Rewrites the URL of a YouTube search results page to automatically sort by video upload date, if the sort order is not already present
// @downloadURL https://update.greasyfork.org/scripts/562698/Youtube%202026%3A%20Auto-sort%20search%20results%20by%20upload%20date%20%28sort%20videos%20by%20upload%20date%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562698/Youtube%202026%3A%20Auto-sort%20search%20results%20by%20upload%20date%20%28sort%20videos%20by%20upload%20date%29.meta.js
// ==/UserScript==
// console.log(">> YouTube Sort by Date Initialized <<");

(function() {
    'use strict';
    const SP = "CAI%3D";

    console.log(">> YouTube Sort by Date Initialized <<");

    function isLocked() {
        const lastAction = sessionStorage.getItem('yt_sort_lock');
        return lastAction && (Date.now() - lastAction < 3000);
    }

    function setLock() {
        sessionStorage.setItem('yt_sort_lock', Date.now());
    }

    // GLOBAL RECOVERY: This runs regardless of the URL path
    function globalWatchdog() {
        let attempts = 0;
        const recoveryInterval = setInterval(() => {
            attempts++;
            const appExist = document.querySelector('ytd-app');
            const hasContent = appExist && appExist.children.length > 0;

            // If the app is loaded and has content, stop checking
            if (hasContent) {
                clearInterval(recoveryInterval);
                return;
            }

            // If we've waited ~5 seconds and the page is still that raw HTML shell
            if (attempts >= 5) {
                clearInterval(recoveryInterval);
                if (!isLocked()) {
                    console.warn(">>> YT-SORT: Emergency Recovery Triggered (App Missing)");
                    setLock();
                    window.location.reload();
                }
            }
        }, 1000);
    }

    // 1. THE SEARCH-STUFFER (For Home Page Searches)
    // We catch the 'Enter' key and manually add the parameter to the query
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const searchInput = e.target.closest('input#search') || document.querySelector('input#search');
            if (searchInput && searchInput.value && !searchInput.value.includes('sp=')) {
                if (isLocked()) return;

                // We add the sort code as a text suffix. YouTube's parser
                // often accepts this as a valid way to trigger the filter.
                // If it fails, we fall back to a hard location change.
                const query = searchInput.value;
                const target = `/results?search_query=${encodeURIComponent(query)}&sp=${SP}`;

                e.stopImmediatePropagation();
                // Removed preventDefault to allow the event to flow,
                // but we redirect manually to ensure the SP param is there.
                setLock();
                window.location.assign(target);
            }
        }
    }, true);

    // 2. THE DIRECT-NAV GUARD (For pasting links)
    // Only triggers on result pages that are MISSING the code
    function checkAndFix() {
        if (isLocked()) return;

        const url = new URL(window.location.href);
        const params = url.searchParams;
        if (window.location.pathname === '/results' && params.has('search_query') && !params.has('sp')) {
            params.set('sp', SP);
            setLock();
            window.location.replace(window.location.pathname + '?' + params.toString());
        }
    }

    // 3. THE VPN NAG-KILLER (Safe Mode)
    setInterval(() => {
        if (document.body && (document.body.innerText.includes('Connect to the internet') || document.body.innerText.includes('Something went wrong'))) {
            const retry = document.querySelector('#retry-button button, yt-button-renderer#retry-button button');
            if (retry) {
                console.log(">>> YT-SORT: VPN/Network nag detected. Clicking retry...");
                retry.click();
            }
        }
    }, 1000);

    // Run recovery immediately
    globalWatchdog();
    checkAndFix();

    // Listen for YouTube's internal page transitions (SPA navigation)
    window.addEventListener('yt-navigate-finish', checkAndFix);

})();