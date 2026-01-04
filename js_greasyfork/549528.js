// ==UserScript==
// @name         Google Search -noai
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Append "-noai" to all Google searches
// @author       Kir
// @match        https://www.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549528/Google%20Search%20-noai.user.js
// @updateURL https://update.greasyfork.org/scripts/549528/Google%20Search%20-noai.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const addNoAIToURL = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const q = urlParams.get('q');
        if (q && !q.includes('-noai')) {
            urlParams.set('q', q + ' -noai');
            const newUrl = window.location.origin + window.location.pathname + '?' + urlParams.toString();
            window.location.replace(newUrl);
        }
    };

    // Check on page load
    addNoAIToURL();

    // Listen for URL changes (Google uses pushState)
    let lastURL = location.href;
    setInterval(() => {
        if (location.href !== lastURL) {
            lastURL = location.href;
            addNoAIToURL();
        }
    }, 300);
})();
