// ==UserScript==
// @name         Xtglinks Redirect Helper (Final)
// @namespace    AutoBypass
// @version      2.0
// @description  Skips intermediate shortener pages and lands on xtglinks final page
// @match        https://7vibelife.com/*
// @match        https://mealcold.com/*
// @match        https://*.creditshui.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559531/Xtglinks%20Redirect%20Helper%20%28Final%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559531/Xtglinks%20Redirect%20Helper%20%28Final%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const url = new URL(location.href);
    const host = location.hostname;

    function getToken() {
        // query params
        const q = url.searchParams.get("token") || url.searchParams.get("id");
        if (q) return q;

        // path based (fallback)
        const parts = url.pathname.split("/").filter(Boolean);
        return parts.length ? parts[parts.length - 1] : null;
    }

    const token = getToken();
    if (!token) return;

    // 7vibelife & creditshui → mealcold
    if (host === "7vibelife.com" || host.endsWith(".creditshui.com")) {
        location.replace("https://mealcold.com/prolink.php?id=" + token);
        return;
    }

    // mealcold → xtglinks
    if (host === "mealcold.com") {
        location.replace("https://xtglinks.com/" + token);
        return;
    }
})();