// ==UserScript==
// @name         FT to RemovePaywall
// @namespace    Violentmonkey Scripts
// @version      1.0
// @description  Auto-redirect FT article pages to removepaywall.com
// @author       DionysusDK
// @match        *://*.ft.com/content/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557410/FT%20to%20RemovePaywall.user.js
// @updateURL https://update.greasyfork.org/scripts/557410/FT%20to%20RemovePaywall.meta.js
// ==/UserScript==

const REMOVE_PAYWALL_URL = "https://removepaywall.com/search?url=";

(function redirectFTArticle() {
    const { hostname, pathname, href } = window.location;

    // Only run on ft.com and only when path is /content/{uuid}
    if (hostname.endsWith("ft.com")) {
        const uuidRegex = /^\/content\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (uuidRegex.test(pathname)) {
            const redirectUrl = `${REMOVE_PAYWALL_URL}${encodeURIComponent(href)}`;
            window.location.href = redirectUrl;
        }
    }
})();

//this was made in one night - If you see that any changes could be made to further the codes simplicity or add more feature - kindly dm u/lonelyportrait123