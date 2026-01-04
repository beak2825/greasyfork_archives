// ==UserScript==
// @name          GitHub: View User Gists
// @namespace     https://khalila.dev
// @version       1.0
// @author        Khalila Gazal
// @description   Adds a button to the GitHub profile sidebar to easily view the user's Gists
// @license       MIT
// @homepageURL   https://github.com/khaliladev/github-gist-button
// @match         https://github.com/*
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/559202/GitHub%3A%20View%20User%20Gists.user.js
// @updateURL https://update.greasyfork.org/scripts/559202/GitHub%3A%20View%20User%20Gists.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function injectGistButton() {
        // Find the sidebar area where the 'Follow' button is located
        const sidebar = document.querySelector('.js-profile-editable-area');

        // Stop if the sidebar isn't found or if the button is already there
        if (!sidebar || document.getElementById('gist-profile-link')) return;

        // Get the username from the address bar
        const username = window.location.pathname.split('/')[1];

        // Create the link and make it look like a GitHub button
        const btn = document.createElement('a');
        btn.id = 'gist-profile-link';
        btn.innerText = 'View Gist Profile';
        btn.href = `https://gist.github.com/${username}`;
        btn.className = 'btn btn-block mt-2';

        // Put the button into the sidebar
        sidebar.appendChild(btn);
    }

    // Run the script when the page first opens
    injectGistButton();

    // Run the script again when navigating to a new page without a refresh
    document.addEventListener('turbo:load', injectGistButton);
})();