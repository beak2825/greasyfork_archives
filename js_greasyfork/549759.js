// ==UserScript==
// @name         Indeed Custom New Jobs Search
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a button to Indeed.com for custom searching new job posts. Requires login.
// @author       Grok
// @match        https://*.indeed.com/*
// @grant        none
// @license      PNDT
// @downloadURL https://update.greasyfork.org/scripts/549759/Indeed%20Custom%20New%20Jobs%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/549759/Indeed%20Custom%20New%20Jobs%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check if user is logged in
    function isLoggedIn() {
        // Look for the profile icon or 'My Jobs' link, which appears when logged in
        // If 'Sign in' button is present, not logged in
        const signInElement = document.querySelector('a[data-gnav-element-name="SignIn"]');
        return !signInElement; // If no sign-in link, assume logged in
    }

    // Only add the button if logged in
    if (!isLoggedIn()) {
        console.log('Please log in to Indeed to use this script.');
        return;
    }

    // Create the button
    const button = document.createElement('button');
    button.textContent = 'Search New Jobs';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = '1000';
    button.style.padding = '10px';
    button.style.backgroundColor = '#0073bb';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';

    // Add click event
    button.addEventListener('click', function() {
        const keywords = prompt('Enter job keywords (e.g., software engineer):');
        if (!keywords) return;

        const location = prompt('Enter location (e.g., Remote):') || '';
        const days = prompt('Enter number of days for new posts (e.g., 1 for last 24 hours, 3 for last 3 days):') || '1';

        // Construct Indeed search URL
        const baseUrl = 'https://www.indeed.com/jobs';
        const queryParams = new URLSearchParams({
            q: keywords,
            l: location,
            fromage: days
        });

        // Navigate to the search results
        window.location.href = `${baseUrl}?${queryParams.toString()}`;
    });

    // Append button to body
    document.body.appendChild(button);
})();// ==UserScript==
// @name        New script
// @namespace   Violentmonkey Scripts
// @match       *://example.org/*
// @grant       none
// @version     1.0
// @author      -
// @description 9/15/2025, 2:54:21 PM
// ==/UserScript==
