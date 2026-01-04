// ==UserScript==
// @name         Smart Reddit → old.reddit Redirect (media-safe)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Redirect reddit.com to old.reddit.com except for media/image pages
// @match        *://reddit.com/*
// @match        *://www.reddit.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561051/Smart%20Reddit%20%E2%86%92%20oldreddit%20Redirect%20%28media-safe%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561051/Smart%20Reddit%20%E2%86%92%20oldreddit%20Redirect%20%28media-safe%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const url = new URL(window.location.href);

    // Already on old.reddit → do nothing
    if (url.hostname.startsWith("old.reddit.com")) return;

    // 1️⃣ Never redirect Reddit image hosts
    const imageHosts = [
        "i.redd.it",
        "preview.redd.it",
        "i.reddituploads.com"
    ];
    if (imageHosts.includes(url.hostname)) return;

    // 2️⃣ Never redirect /media URLs (this fixes your exact case)
    if (url.pathname === "/media") return;

    // 3️⃣ Never redirect galleries
    if (url.pathname.startsWith("/gallery/")) return;

    // 4️⃣ Never redirect comment pages that end in media focus
    // (new Reddit image viewer inside comments)
    if (/\/comments\/.*\/.*\/?$/.test(url.pathname) && url.searchParams.has("context")) {
        return;
    }

    // Otherwise → redirect to old.reddit
    url.hostname = "old.reddit.com";
    window.location.replace(url.toString());
})();
