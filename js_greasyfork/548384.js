// ==UserScript==
// @name         Bypass UK restrictions
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      1.0
// @description  Block api/geo requests on radio.garden
// @author       You
// @match        https://radio.garden/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/548384/Bypass%20UK%20restrictions.user.js
// @updateURL https://update.greasyfork.org/scripts/548384/Bypass%20UK%20restrictions.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Store the original fetch function
    const originalFetch = window.fetch;
    // Override the fetch function
    window.fetch = function(...args) {
        const url = args[0] instanceof Request ? args[0].url : args[0];
        // Check if the URL contains "api/geo"
        if (typeof url === 'string' && url.includes('api/geo')) {
            console.log('Blocked geo API request:', url);
            // Return a rejected promise to simulate a blocked request
            return Promise.reject(new Error('Request blocked by Tampermonkey script'));
        }
        // For all other requests, use the original fetch
        return originalFetch.apply(this, args);
    };

    // Also override XMLHttpRequest for additional coverage
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        // Check if the URL contains "api/geo"
        if (typeof url === 'string' && url.includes('api/geo')) {
            console.log('Blocked geo API XHR request:', url);
            // Override send to prevent the request
            this.send = function() {
                this.dispatchEvent(new Event('error'));
            };
            return;
        }
        // For all other requests, use the original open method
        return originalOpen.apply(this, arguments);
    };

    console.log('Radio.Garden Geo API blocker loaded successfully');
})();