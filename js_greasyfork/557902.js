// ==UserScript==
// @name         Amazon.com - Redirects Wishlists to use Custom Sort Order
// @version      1.0.0
// @description  This redirects wishlists to use custom sort order instead of most recently added.
// @author       makewebsitesbetter
// @namespace    userscripts
// @icon         https://i.postimg.cc/3NMLffrh/greenbox.png
// @include      *://*amazon.*/hz/wishlist/ls/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557902/Amazoncom%20-%20Redirects%20Wishlists%20to%20use%20Custom%20Sort%20Order.user.js
// @updateURL https://update.greasyfork.org/scripts/557902/Amazoncom%20-%20Redirects%20Wishlists%20to%20use%20Custom%20Sort%20Order.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const currentUrl = window.location.href;

    // Capture the wishlist ID from the URL.
    const match = currentUrl.match(/\/hz\/wishlist\/ls\/([^/?#]+)/);

    if (match) {
        const id = match[1];
        const domain = window.location.origin;

        // Build the target URL using the current id and domain.
        const targetUrl = `${domain}/hz/wishlist/ls/${id}?type=wishlist&filter=all&sort=custom&viewType=list`;

        // Redirect if we're not already at the desired view.
        if (!currentUrl.includes("sort=custom")) {
            window.location.replace(targetUrl);
        }
    }
})();