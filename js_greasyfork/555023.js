// ==UserScript==
// @name         NSFW-Profile Auto Redirector
// @name:en      NSFW-Profile Auto Redirector
// @namespace    https://greasyfork.org/en/users/1373266-godinraider
// @version      1.1
// @description  Redirects OnlyFans and Fansly to Coomer search pages, Patreon and Boosty to Kemono search pages, using the username from the URL.
// @description:en Redirects OnlyFans and Fansly to Coomer search pages, Patreon and Boosty to Kemono search pages, using the username from the URL.
// @author       Inspired by GodinRaider
// @match        *://*.onlyfans.com/*
// @match        *://*.patreon.com/*
// @match        *://*.fansly.com/*
// @match        *://*.boosty.to/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555023/NSFW-Profile%20Auto%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/555023/NSFW-Profile%20Auto%20Redirector.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to extract username from URL
    function getUsername() {
        const path = window.location.pathname.replace(/^\/+|\/+$/g, ''); // Remove leading/trailing slashes
        return path.split('/')[0]; // Get the first part of the path (username)
    }

    // Function to perform the redirect
    function redirectToSearchOrProfile() {
        const username = getUsername();

        // If no username is found, do nothing
        if (!username) return;

        // Determine the current site and redirect accordingly
        const isPatreon = window.location.hostname.includes('patreon.com');
        const isBoosty = window.location.hostname.includes('boosty.to');
        const isFansly = window.location.hostname.includes('fansly.com');
        const isOnlyFans = window.location.hostname.includes('onlyfans.com');

        let redirectUrl = '';

        if (isPatreon) {
            redirectUrl = `https://kemono.cr/artists?q=${username}&service=patreon&sort_by=favorited&order=desc`;
        } else if (isBoosty) {
            redirectUrl = `https://kemono.cr/artists?q=${username}&service=boosty&sort_by=favorited&order=desc`;
        } else if (isFansly) {
            redirectUrl = `https://coomer.st/artists?q=${username}&service=fansly&sort_by=favorited&order=desc`;
        } else if (isOnlyFans) {
            redirectUrl = `https://coomer.st/artists?q=${username}&service=onlyfans&sort_by=favorited&order=desc`;
        }

        // Perform the redirect if a URL is set
        if (redirectUrl) {
            window.location.href = redirectUrl;
        }
    }

    // Execute the redirect
    redirectToSearchOrProfile();
})();