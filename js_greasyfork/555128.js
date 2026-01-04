// ==UserScript==
// @name         Freedium Redirect for Medium
// @namespace    https://medium.com/
// @version      1.1
// @description  Automatically open Medium articles on freedium.cfd.
// @author       Nick Bakaka
// @match        https://*.medium.com/*
// @grant        none
// @license      CC
// @downloadURL https://update.greasyfork.org/scripts/555128/Freedium%20Redirect%20for%20Medium.user.js
// @updateURL https://update.greasyfork.org/scripts/555128/Freedium%20Redirect%20for%20Medium.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ------------------------------------------------------------------
       1️⃣ List every domain you want the banner on (case‑insensitive).
          e.g. "medium.com", "uxdesign.cc", "example.org"
    ------------------------------------------------------------------ */
    const SHOW_ON_HOSTS = [
        "medium.com",
        "uxdesign.cc"
        // add more here...
    ];

    /* 2️⃣ The host that will receive the redirected URL (unchanged) */
    const FREEDIUM_HOST   = "freedium.cfd";
    const REDIRECT_PREFIX = `https://${FREEDIUM_HOST}/`;

    /* Helper: does the current page belong to one of our target hosts? */
    function isTargetPage() {
        return SHOW_ON_HOSTS.some(h => window.location.hostname.includes(h));
    }

    // If we're NOT on a target host, nothing to do.
    if (!isTargetPage()) return;

    /** Build the URL that will open the article on freedium.cfd */
    function buildRedirectUrl() {
        return REDIRECT_PREFIX + encodeURIComponent(window.location.href);
    }

    /* Create and inject the banner element. */
    function createBanner() {
        const banner = document.createElement('div');
        banner.textContent = 'Open in Freedium.cfd';

        Object.assign(banner.style, {
            position:      'fixed',
            top:           '72px',
            right:         '20px',
            padding:       '.7em 1em',
            background:    'rgb(31,41,55)',
            color:         'rgb(34,197,94)',
            border:        '2px solid rgb(34,197,94)',
            cursor:        'pointer',
            zIndex:        '9999',
            fontFamily:    'sans-serif',
            fontSize:      '.75rem'
        });

        banner.addEventListener('mouseover', () => {
            banner.style.background = 'rgb(45,55,72)';
        });
        banner.addEventListener('mouseout', () => {
            banner.style.background = 'rgb(31,41,55)';
        });

        banner.onclick = () => window.location.replace(buildRedirectUrl());

        document.body.appendChild(banner);
    }

    /* Run after the page has finished rendering. */
    if (document.readyState === 'complete' || document.readyState === 'interactive')
        createBanner();
    else
        window.addEventListener('DOMContentLoaded', createBanner);
})();