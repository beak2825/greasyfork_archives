// ==UserScript==
// @name         X/Twitter Open Profile to Media Tab by Default
// @namespace    https://github.com/BD9Max/userscripts/tree/main
// @version      1.2
// @description  Auto redirect X.com (Twitter) user profiles to Media -tab by default on first visit of the profile - instead of Posts -tab.
// @author       krbd99
// @match        https://x.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562228/XTwitter%20Open%20Profile%20to%20Media%20Tab%20by%20Default.user.js
// @updateURL https://update.greasyfork.org/scripts/562228/XTwitter%20Open%20Profile%20to%20Media%20Tab%20by%20Default.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if we should redirect
    function shouldRedirect() {
        const path = window.location.pathname;
        const url = window.location.href;

        // Exclude internal X.com pages (settings, notifications, messages, etc.)
        const internalPages = [
            '/settings',
            '/notifications',
            '/messages',
            '/compose',
            '/home',
            '/explore',
            '/i/',
            '/search',
            '/lists',
            '/bookmarks',
            '/communities',
            '/verified-choose',
            '/premium'
        ];

        for (const page of internalPages) {
            if (path.startsWith(page)) {
                return false;
            }
        }

        // Match base profile pattern: /username or /username/
        // Profile usernames start with a letter and can contain letters, numbers, underscores
        const profileRegex = /^\/([a-zA-Z][a-zA-Z0-9_]{0,14})(\/?$)/;
        const match = path.match(profileRegex);

        if (!match) {
            return false;
        }

        // Check if already on a sub-tab
        const profileTabs = [
            '/media',
            '/with_replies',
            '/highlights',
            '/likes',
            '/followers',
            '/following',
            '/verified_followers'
        ];

        for (const tab of profileTabs) {
            if (path.includes(tab)) {
                return false;
            }
        }

        // Check sessionStorage to prevent redirect loop
        const sessionKey = `x_media_redirect_${path}`;
        if (sessionStorage.getItem(sessionKey)) {
            return false;
        }

        return true;
    }

    // Perform redirect
    if (shouldRedirect()) {
        const currentPath = window.location.pathname;
        const username = currentPath.split('/')[1];
        const newUrl = `https://x.com/${username}/media`;

        // Mark this profile as visited in this session
        sessionStorage.setItem(`x_media_redirect_${currentPath}`, 'true');

        // Redirect
        window.location.href = newUrl;
    }
})();