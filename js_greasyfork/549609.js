// ==UserScript==
// @name         Reddit User Profile /hot/ Page Keyboard Shortcut
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Ctrl-q to go from a Reddit user's profile to their associated /hot/ page. Instead of having to modify the URL manually.
// @author       NiteCyper
// @match        *://www.reddit.com/user/*
// @match        *://www.reddit.com/u/*
// @match        *://reddit.com/user/*
// @match        *://reddit.com/u/*
// @match        *://old.reddit.com/u/*
// @match        *://old.reddit.com/user/*
// @grant        none
// @run-at       document-idle
// @license     GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/549609/Reddit%20User%20Profile%20hot%20Page%20Keyboard%20Shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/549609/Reddit%20User%20Profile%20hot%20Page%20Keyboard%20Shortcut.meta.js
// ==/UserScript==

// ===UserScript Comment ===
// Essentially vibe-coded this sh** with Google Gemini. idk Javascript. Took a lot of trial and error.
// Tried Vimium C Chrome extension at first but kept getting errors. But now it works.
// What's this for? Well, Do you like a reddit user's posts? Want to follow them?
// This only matters if they post on their own profile. idk how they do that, but some do.
// ===UserScript Comment ===

(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        // Check for Ctrl+Q (event.key for character, event.keyCode for older browsers)
        if (event.ctrlKey && (event.key === 'q' || event.keyCode === 81)) {
            // Prevent the default browser action for Ctrl+Q
            event.preventDefault();

            // Get the current URL
            let currentUrl = window.location.href;

            // v1.2 Now works without trailing slash
            let newUrl = currentUrl.replace(/(\/(u|user)\/[^/]+)\/?(.*)/, '$1/hot/');

            // Navigate to the new URL
            window.location.href = newUrl;
        }
    });
})();