// ==UserScript==
// @name         Domain‑specific CSS Injector
// @namespace    https://example.com/
// @version      1.0
// @description  Inject custom CSS per domain – works on iOS, iPadOS and desktop browsers.
// @author       Nick Bakaka
// @match        *://*/*                     // Apply to every page
// @grant        none
// @license      CC-ND-NA
// @downloadURL https://update.greasyfork.org/scripts/561485/Domain%E2%80%91specific%20CSS%20Injector.user.js
// @updateURL https://update.greasyfork.org/scripts/561485/Domain%E2%80%91specific%20CSS%20Injector.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ------------------------------------------------------------------
     *  Configuration: Add your domain‑specific CSS here.
     *
     *  The key is a regular expression that matches the hostname of the
     *  target website.  The value is one or more CSS rules separated by newlines.
     *  You may use `@media`, `!important` etc. as you wish.
     * ------------------------------------------------------------------ */
    const domainCssMap = [
        {
            // Matches example.com and any sub‑domain
            hostRegex: /^(?:www\.)?example\.com$/i,
            css: `
                body { background-color: #f0f8ff !important; }
                h1, h2, h3 { color: #0044cc !important; }
            `
        },
        {
            // Matches any sub‑domain of mysite.org
            hostRegex: /^(?:.*\.)?mysite\.org$/i,
            css: `
                .navbar { display:none !important; }
                footer { font-size: 0.8rem !important; }
            `
        },
        {
            // Matches any site that contains "blog" in the hostname
            hostRegex: /blog/i,
            css: `
                .post-content img { max-width:100% !important; height:auto !important; }
            `
        }
        // Add more entries as needed...
    ];

    /* ------------------------------------------------------------------
     *  Helper: Inject a style element into the document head.
     * ------------------------------------------------------------------ */
    function injectCss(cssText) {
        if (!cssText.trim()) return;
        const style = document.createElement('style');
        style.type = 'text/css';
        style.textContent = cssText;
        // Append to <head> or <html> if head is missing
        (document.head || document.documentElement).appendChild(style);
    }

    /* ------------------------------------------------------------------
     *  Main logic: Find matching rule for current hostname and inject CSS.
     * ------------------------------------------------------------------ */
    const hostname = window.location.hostname;

    for (const { hostRegex, css } of domainCssMap) {
        if (hostRegex.test(hostname)) {
            // If multiple rules match we inject all of them
            injectCss(css);
        }
    }

})();
