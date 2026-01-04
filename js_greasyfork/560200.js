// ==UserScript==
// @name         Reddit Anti Translate (All Languages Version)
// @author       Minjae Kim
// @version      2.0
// @description  Redirects Reddit pages auto translated by removing the tl parameter from Reddit URLs
// @match        https://www.reddit.com/r/*/comments/*
// @icon         https://www.iconpacks.net/icons/2/free-reddit-logo-icon-2436-thumb.png
// @run-at       document-start
// @license      MIT
// @namespace    https://greasyfork.org/en/users/1529082-minjae-kim
// @downloadURL https://update.greasyfork.org/scripts/560200/Reddit%20Anti%20Translate%20%28All%20Languages%20Version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560200/Reddit%20Anti%20Translate%20%28All%20Languages%20Version%29.meta.js
// ==/UserScript==
 
(function() {
    const url = new URL(location.href);
    if (url.searchParams.has("tl")) {
        url.searchParams.delete("tl");
        location.replace(url.toString());
    }
})();