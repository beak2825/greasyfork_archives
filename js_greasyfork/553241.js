// ==UserScript==
// @name         Kagi Search Default for Opera
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically redirects Yahoo searches to Kagi Search
// @match        *://*.yahoo.com/*
// @grant        window.stop
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553241/Kagi%20Search%20Default%20for%20Opera.user.js
// @updateURL https://update.greasyfork.org/scripts/553241/Kagi%20Search%20Default%20for%20Opera.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Configuration
    const config = {
        targetEngine: {
            name: 'Kagi Search',
            url: 'https://kagi.com/search?q=%s'
        }
    };
 
    // Get query parameter specific to Yahoo
    const params = new URLSearchParams(window.location.search);
    const query = params.get('p');  // Yahoo uses 'p' for search queries
 
    if (!query) return;
 
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;
 
    // Stop the page load immediately
    window.stop();
 
    // Clear any existing content and prevent further loading
    if (document.documentElement) {
        document.documentElement.innerHTML = '';
    }
 
    // Cancel any pending requests
    if (window.stop) {
        window.stop();
    }
 
    // Redirect to Kagi Search using the fastest method
    const redirectUrl = config.targetEngine.url.replace('%s', encodeURIComponent(trimmedQuery));
 
    try {
        window.location.replace(redirectUrl);
    } catch {
        window.location.href = redirectUrl;
    }
 
    throw new Error('REDIRECT_COMPLETE');
})();