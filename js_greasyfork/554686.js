// ==UserScript==
// @name         Imgur to Rimgo Redirect
// @namespace    none
// @version      1.1
// @description  Redirect Imgur URLs to a Rimgo instance for privacy-friendly viewing. Handles SEO-style imgur URLs too.
// @author       OfficialJesseP
// @match        https://imgur.com/*
// @match        https://i.imgur.com/*
// @match        https://imgur.io/*
// @match        https://*.imgur.io/*
// @exclude      https://imgur.com/user/*
// @exclude      https://imgur.com/signin
// @exclude      https://imgur.com/register
// @exclude      https://imgur.com/arcade
// @exclude      https://imgur.com/upload
// @exclude      https://imgur.com/meme-generator
// @exclude      https://imgur.com/privacy
// @exclude      https://imgur.com/rules
// @exclude      https://imgur.com/emerald
// @exclude      https://imgur.com/ccpa
// @exclude      https://imgur.com/tos
// @exclude      https://imgur.com/about
// @exclude      https://imgur.com/apps
// @run-at       document-start
// @grant        none
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/554686/Imgur%20to%20Rimgo%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/554686/Imgur%20to%20Rimgo%20Redirect.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const rimgoInstance = 'https://rimgo.us.projectsegfau.lt';
    const url = new URL(window.location.href);
    let path = url.pathname;

    // Check for SEO-style album or gallery URLs
    const matchSeoURL = path.match(/^\/(a|gallery)\/(?:[a-zA-Z0-9\-]+-)?([a-zA-Z0-9]{5,7})$/);
    if (matchSeoURL) {
        // e.g., "/a/downloading-game-gBLJO" → extract group(1)="a", group(2)="gBLJO"
        const type = matchSeoURL[1]; // 'a' or 'gallery'
        const id = matchSeoURL[2];   // Actual ID (usually 5–7 characters)
        path = `/${type}/${id}`;
    }

    // Rebuild Rimgo URL and redirect
    const newUrl = rimgoInstance + path + url.search + url.hash;

    if (window.location.href !== newUrl) {
        window.location.replace(newUrl);
    }
})();