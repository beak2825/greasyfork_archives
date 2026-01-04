// ==UserScript==
// @name         Discogs Label Page Double Slash Redirect
// @namespace    https://discogs.com/
// @version      1.0
// @description  Automatically redirect Discogs label URLs to the older version of label page with a double slash in the link. This solves the bug with missing releases from the label pages, which is an ongoing issue with Discogs currently.
// @author       simcut
// @match        https://www.discogs.com/label/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/553708/Discogs%20Label%20Page%20Double%20Slash%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/553708/Discogs%20Label%20Page%20Double%20Slash%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const currentUrl = window.location.href;

    // Match URLs like https://www.discogs.com/label/1234-LabelName
    // but not ones that already have two slashes
    if (/^https:\/\/www\.discogs\.com\/label\/[^/]/.test(currentUrl)) {
        const newUrl = currentUrl.replace(
            /^https:\/\/www\.discogs\.com\/label\//,
            "https://www.discogs.com/label//"
        );
        window.location.replace(newUrl);
    }
})();